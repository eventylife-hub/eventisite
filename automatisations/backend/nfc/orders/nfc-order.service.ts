import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../automations/audit-log.service';

export interface NfcOrderRequest {
  travelId: string;
  passengersCount: number;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

export interface NfcOrderResult {
  orderId: string;
  externalOrderRef: string;
  quantity: number;
  bracelets: { id: string; uid: string; status: 'provisioned' }[];
  estimatedDeliveryAt: Date;
}

const BUFFER_PERCENT = 0.10;
const ESTIMATED_DELIVERY_DAYS = 7;

@Injectable()
export class NfcOrderService {
  private readonly logger = new Logger(NfcOrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
    private readonly config: ConfigService,
  ) {}

  async orderForTravel(req: NfcOrderRequest): Promise<NfcOrderResult> {
    const dedupeKey = `nfc-order:${req.travelId}`;
    const already = await this.prisma.automationDedupe.findUnique({ where: { key: dedupeKey } });
    if (already) {
      this.logger.log(`[skip] NFC order already placed for travel ${req.travelId}`);
      return already.result as unknown as NfcOrderResult;
    }

    const quantity = Math.ceil(req.passengersCount * (1 + BUFFER_PERCENT));
    const bracelets = await this.provisionUids(req.travelId, quantity);
    const externalOrderRef = await this.placeSupplierOrder(req, bracelets);

    const order = await this.prisma.nfcOrder.create({
      data: {
        travelId: req.travelId,
        quantity,
        externalOrderRef,
        status: 'placed',
        shippingFullName: req.shippingAddress.fullName,
        shippingLine1: req.shippingAddress.line1,
        shippingLine2: req.shippingAddress.line2,
        shippingPostalCode: req.shippingAddress.postalCode,
        shippingCity: req.shippingAddress.city,
        shippingCountry: req.shippingAddress.country,
        estimatedDeliveryAt: this.addDays(new Date(), ESTIMATED_DELIVERY_DAYS),
      },
    });

    const result: NfcOrderResult = {
      orderId: order.id,
      externalOrderRef,
      quantity,
      bracelets: bracelets.map((b) => ({ id: b.id, uid: b.uid, status: 'provisioned' })),
      estimatedDeliveryAt: order.estimatedDeliveryAt,
    };

    await this.prisma.automationDedupe.create({
      data: { key: dedupeKey, result: result as object },
    });

    await this.audit.log({
      entityType: 'nfc-order',
      entityId: order.id,
      action: 'created',
      afterState: { quantity, externalOrderRef },
    });

    await this.notifyCreator(req.travelId, order.id, externalOrderRef);
    return result;
  }

  async onSupplierWebhook(payload: {
    externalOrderRef: string;
    status: 'placed' | 'shipped' | 'delivered' | 'cancelled';
    trackingNumber?: string;
    deliveredAt?: Date;
  }): Promise<void> {
    const order = await this.prisma.nfcOrder.findFirst({
      where: { externalOrderRef: payload.externalOrderRef },
    });
    if (!order) return;

    await this.prisma.nfcOrder.update({
      where: { id: order.id },
      data: {
        status: payload.status,
        trackingNumber: payload.trackingNumber,
        deliveredAt: payload.deliveredAt,
      },
    });

    if (payload.status === 'delivered') {
      await this.notifyDelivered(order.id, order.travelId);
    } else if (payload.status === 'shipped') {
      await this.notifyShipped(order.id, order.travelId, payload.trackingNumber ?? '');
    }

    await this.audit.log({
      entityType: 'nfc-order',
      entityId: order.id,
      action: 'updated',
      afterState: { status: payload.status, trackingNumber: payload.trackingNumber },
    });
  }

  async attachToClient(braceletUid: string, clientId: string, bookingId: string): Promise<void> {
    const bracelet = await this.prisma.nfcBracelet.findUnique({ where: { uid: braceletUid } });
    if (!bracelet) throw new Error(`Bracelet ${braceletUid} not provisioned`);
    if (bracelet.clientId && bracelet.clientId !== clientId) {
      throw new Error(`Bracelet ${braceletUid} already attached to another client`);
    }
    await this.prisma.nfcBracelet.update({
      where: { uid: braceletUid },
      data: { clientId, bookingId, attachedAt: new Date() },
    });
    await this.audit.log({
      entityType: 'nfc-bracelet',
      entityId: bracelet.id,
      action: 'updated',
      afterState: { clientId, bookingId },
    });
  }

  private async provisionUids(travelId: string, quantity: number) {
    const bracelets: { id: string; uid: string }[] = [];
    for (let i = 0; i < quantity; i += 1) {
      const uid = this.generateUid();
      const b = await this.prisma.nfcBracelet.create({
        data: { uid, travelId, status: 'provisioned' },
      });
      bracelets.push({ id: b.id, uid: b.uid });
    }
    return bracelets;
  }

  private generateUid(): string {
    // 14 hex chars (NFC NTAG213/215 7-byte UID)
    const buf = new Uint8Array(7);
    for (let i = 0; i < 7; i += 1) buf[i] = Math.floor(Math.random() * 256);
    return Array.from(buf)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join('');
  }

  private async placeSupplierOrder(
    req: NfcOrderRequest,
    bracelets: { id: string; uid: string }[],
  ): Promise<string> {
    const supplier = this.config.get<string>('NFC_SUPPLIER') ?? 'mock';
    const apiKey = this.config.get<string>('NFC_SUPPLIER_API_KEY');

    if (supplier === 'mock' || !apiKey) {
      // Mode mock pour tests / dev
      return `MOCK-${Date.now()}`;
    }

    // Exemple : Adopen, Smartrac, ou fournisseur local
    const endpoint = this.config.get<string>('NFC_SUPPLIER_ENDPOINT') ?? '';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: 'NTAG215_BRACELET',
        quantity: bracelets.length,
        uids: bracelets.map((b) => b.uid),
        shipping: req.shippingAddress,
        reference: `EVT-NFC-${req.travelId}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Supplier API ${response.status}: ${await response.text()}`);
    }
    const data = (await response.json()) as { orderRef: string };
    return data.orderRef;
  }

  private async notifyCreator(travelId: string, orderId: string, externalOrderRef: string) {
    const travel = await this.prisma.travel.findUnique({ where: { id: travelId } });
    if (!travel?.creatorId) return;
    const creator = await this.prisma.user.findUnique({ where: { id: travel.creatorId } });
    if (!creator?.email) return;
    await this.prisma.outboundEmail.create({
      data: {
        to: creator.email,
        template: 'nfc-order-placed',
        variables: { travelTitle: travel.title, orderId, externalOrderRef },
        status: 'queued',
      },
    });
  }

  private async notifyShipped(orderId: string, travelId: string, trackingNumber: string) {
    const travel = await this.prisma.travel.findUnique({ where: { id: travelId } });
    if (!travel?.creatorId) return;
    const creator = await this.prisma.user.findUnique({ where: { id: travel.creatorId } });
    if (!creator?.email) return;
    await this.prisma.outboundEmail.create({
      data: {
        to: creator.email,
        template: 'nfc-order-shipped',
        variables: { travelTitle: travel.title, orderId, trackingNumber },
        status: 'queued',
      },
    });
  }

  private async notifyDelivered(orderId: string, travelId: string) {
    const travel = await this.prisma.travel.findUnique({ where: { id: travelId } });
    if (!travel?.creatorId) return;
    const creator = await this.prisma.user.findUnique({ where: { id: travel.creatorId } });
    if (!creator?.email) return;
    await this.prisma.outboundEmail.create({
      data: {
        to: creator.email,
        template: 'nfc-order-delivered',
        variables: { travelTitle: travel.title, orderId },
        status: 'queued',
      },
    });
    await this.prisma.outboundPush.create({
      data: {
        userId: travel.creatorId,
        title: 'Bracelets NFC livrés',
        body: `Vos bracelets pour ${travel.title} sont arrivés.`,
        status: 'queued',
      },
    });
  }

  private addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }
}
