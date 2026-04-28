import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../automations/audit-log.service';

export interface CreatorMonthlyInvoiceResult {
  invoicesCreated: number;
  totalAmountEur: number;
  period: { from: Date; to: Date };
}

@Injectable()
export class CreatorInvoicingService {
  private readonly logger = new Logger(CreatorInvoicingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  async invoiceAllCreatorsForLastMonth(): Promise<CreatorMonthlyInvoiceResult> {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const creators = await this.prisma.user.findMany({
      where: { role: 'creator', isActive: true },
    });

    let invoicesCreated = 0;
    let totalAmountEur = 0;

    for (const creator of creators) {
      const result = await this.invoiceOneCreator(creator.id, from, to);
      if (result.invoiceCreated) {
        invoicesCreated += 1;
        totalAmountEur += result.amountEur;
      }
    }

    return { invoicesCreated, totalAmountEur, period: { from, to } };
  }

  async invoiceOneCreator(
    creatorId: string,
    from: Date,
    to: Date,
  ): Promise<{ invoiceCreated: boolean; amountEur: number; invoiceNumber?: string }> {
    const dedupeKey = `creator-invoice:${creatorId}:${from.toISOString().slice(0, 7)}`;
    const already = await this.prisma.automationDedupe.findUnique({ where: { key: dedupeKey } });
    if (already) {
      return already.result as unknown as {
        invoiceCreated: boolean;
        amountEur: number;
        invoiceNumber?: string;
      };
    }

    const closedTravels = await this.prisma.travel.findMany({
      where: {
        creatorId,
        returnAt: { gte: from, lte: to },
        status: 'completed',
      },
      include: { bookings: true },
    });

    if (closedTravels.length === 0) {
      const empty = { invoiceCreated: false, amountEur: 0 };
      await this.prisma.automationDedupe.create({
        data: { key: dedupeKey, result: empty as object },
      });
      return empty;
    }

    let totalCreatorShareEur = 0;
    const lineItems: {
      travelId: string;
      travelTitle: string;
      passengersCount: number;
      revenueEur: number;
      marginNetEur: number;
      creatorShareEur: number;
    }[] = [];

    for (const travel of closedTravels) {
      const revenue = travel.bookings.reduce((sum, b) => sum + Number(b.totalAmountEur), 0);
      const totalCost = Number(travel.totalCostEur ?? 0);
      const marginNet = Math.max(0, revenue - totalCost);
      // 18% brut indépendant sur la marge
      const creatorShare = +(marginNet * 0.18).toFixed(2);
      totalCreatorShareEur += creatorShare;
      lineItems.push({
        travelId: travel.id,
        travelTitle: travel.title,
        passengersCount: travel.bookings.length,
        revenueEur: +revenue.toFixed(2),
        marginNetEur: +marginNet.toFixed(2),
        creatorShareEur: creatorShare,
      });
    }

    if (totalCreatorShareEur === 0) {
      const empty = { invoiceCreated: false, amountEur: 0 };
      await this.prisma.automationDedupe.create({
        data: { key: dedupeKey, result: empty as object },
      });
      return empty;
    }

    const year = from.getFullYear();
    const month = String(from.getMonth() + 1).padStart(2, '0');
    const seq = await this.prisma.creatorInvoiceSequence.upsert({
      where: { yearMonth: `${year}-${month}` },
      create: { yearMonth: `${year}-${month}`, lastSeq: 1 },
      update: { lastSeq: { increment: 1 } },
    });
    const invoiceNumber = `CRT-${year}${month}-${String(seq.lastSeq).padStart(4, '0')}`;

    const creator = await this.prisma.user.findUnique({ where: { id: creatorId } });
    const isAutoEntrepreneur =
      creator?.legalForm === 'auto-entrepreneur' || creator?.legalForm === 'micro-entreprise';
    const vatLegend = isAutoEntrepreneur
      ? 'TVA non applicable, art. 293 B du CGI'
      : 'TVA 20% — Service de courtage / commission';

    const invoice = await this.prisma.creatorInvoice.create({
      data: {
        invoiceNumber,
        creatorId,
        periodFrom: from,
        periodTo: to,
        amountEur: +totalCreatorShareEur.toFixed(2),
        vatLegend,
        status: 'pending-payment',
        lineItems: lineItems as object,
        issuedAt: new Date(),
      },
    });

    const pdfUrl = `https://files.eventy.fr/creator-invoices/${invoiceNumber}.pdf`;
    await this.prisma.creatorInvoice.update({
      where: { id: invoice.id },
      data: { pdfUrl },
    });

    if (creator?.email) {
      await this.prisma.outboundEmail.create({
        data: {
          to: creator.email,
          template: 'creator-invoice-monthly',
          variables: {
            creatorName: creator.firstName ?? '',
            invoiceNumber,
            amountEur: totalCreatorShareEur.toFixed(2),
            periodLabel: `${month}/${year}`,
            invoiceUrl: pdfUrl,
          },
          status: 'queued',
        },
      });
    }

    const result = { invoiceCreated: true, amountEur: totalCreatorShareEur, invoiceNumber };
    await this.prisma.automationDedupe.create({
      data: { key: dedupeKey, result: result as object },
    });

    await this.audit.log({
      entityType: 'creator-invoice',
      entityId: invoice.id,
      action: 'created',
      afterState: { creatorId, amountEur: totalCreatorShareEur, invoiceNumber },
    });

    return result;
  }
}
