import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../automations/audit-log.service';

export interface NewBookingPayload {
  bookingId: string;
  travelId: string;
  clientId: string;
  passengersCount: number;
  totalAmountEur: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LifecycleResult {
  bookingNumber: string;
  invoiceNumber: string;
  invoicePdfUrl: string;
  icsUrl: string;
  groupCreated: boolean;
  notificationsScheduled: number;
  emailsSent: string[];
}

@Injectable()
export class BookingLifecycleService {
  private readonly logger = new Logger(BookingLifecycleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  async onBookingPaid(payload: NewBookingPayload): Promise<LifecycleResult> {
    const idempotencyKey = `booking-paid:${payload.bookingId}`;
    const already = await this.prisma.automationDedupe.findUnique({
      where: { key: idempotencyKey },
    });
    if (already) {
      this.logger.log(`[skip] booking ${payload.bookingId} already processed`);
      return already.result as unknown as LifecycleResult;
    }

    const bookingNumber = await this.generateBookingNumber();
    const invoice = await this.generateInvoice(payload, bookingNumber);
    const icsUrl = await this.generateIcs(payload);
    const groupCreated = await this.maybeCreateGroup(payload);
    const notifs = await this.scheduleAllNotifications(payload);
    const emails = await this.sendInitialEmails(payload, bookingNumber, invoice);

    const result: LifecycleResult = {
      bookingNumber,
      invoiceNumber: invoice.invoiceNumber,
      invoicePdfUrl: invoice.pdfUrl,
      icsUrl,
      groupCreated,
      notificationsScheduled: notifs,
      emailsSent: emails,
    };

    await this.prisma.automationDedupe.create({
      data: { key: idempotencyKey, result: result as object },
    });

    await this.audit.log({
      entityType: 'booking',
      entityId: payload.bookingId,
      action: 'completed',
      afterState: result as object,
    });

    return result;
  }

  private async generateBookingNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const seq = await this.prisma.bookingSequence.upsert({
      where: { year },
      create: { year, lastSeq: 1 },
      update: { lastSeq: { increment: 1 } },
    });
    return `EVT-${year}-${String(seq.lastSeq).padStart(6, '0')}`;
  }

  private async generateInvoice(
    payload: NewBookingPayload,
    bookingNumber: string,
  ): Promise<{ invoiceNumber: string; pdfUrl: string }> {
    const year = new Date().getFullYear();
    const seq = await this.prisma.invoiceSequence.upsert({
      where: { year },
      create: { year, lastSeq: 1 },
      update: { lastSeq: { increment: 1 } },
    });
    const invoiceNumber = `F-${year}-${String(seq.lastSeq).padStart(4, '0')}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        bookingId: payload.bookingId,
        bookingNumber,
        clientId: payload.clientId,
        totalAmountEur: payload.totalAmountEur,
        vatLegend: 'TVA sur la marge — Art. 266-1-b du CGI',
        issuedAt: new Date(),
      },
    });

    // Génération PDF (Puppeteer ou pdfkit) — hors scope ici
    const pdfUrl = `https://files.eventy.fr/invoices/${invoiceNumber}.pdf`;
    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdfUrl },
    });

    return { invoiceNumber, pdfUrl };
  }

  private async generateIcs(payload: NewBookingPayload): Promise<string> {
    const travel = await this.prisma.travel.findUnique({ where: { id: payload.travelId } });
    if (!travel) return '';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Eventy//FR',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${payload.bookingId}@eventy.fr`,
      `DTSTAMP:${this.toIcsDate(new Date())}`,
      `DTSTART:${this.toIcsDate(travel.departureAt)}`,
      `DTEND:${this.toIcsDate(travel.returnAt)}`,
      `SUMMARY:Voyage Eventy — ${this.escapeIcs(travel.title)}`,
      `DESCRIPTION:Réservation ${payload.bookingId}`,
      `LOCATION:${this.escapeIcs(travel.departureCity ?? '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const icsUrl = `https://files.eventy.fr/ics/${payload.bookingId}.ics`;
    await this.prisma.icsFile.upsert({
      where: { bookingId: payload.bookingId },
      create: { bookingId: payload.bookingId, content: ics, url: icsUrl },
      update: { content: ics, url: icsUrl },
    });
    return icsUrl;
  }

  private async maybeCreateGroup(payload: NewBookingPayload): Promise<boolean> {
    if (payload.passengersCount < 2) return false;
    await this.prisma.travelGroup.upsert({
      where: { bookingId: payload.bookingId },
      create: {
        bookingId: payload.bookingId,
        travelId: payload.travelId,
        leaderClientId: payload.clientId,
        size: payload.passengersCount,
      },
      update: {},
    });
    return true;
  }

  private async scheduleAllNotifications(payload: NewBookingPayload): Promise<number> {
    const travel = await this.prisma.travel.findUnique({ where: { id: payload.travelId } });
    if (!travel) return 0;

    const dep = travel.departureAt;
    const schedule = [
      { offset: -30, channel: 'email', template: 'pre-departure-j-30' },
      { offset: -7, channel: 'email', template: 'pre-departure-j-7' },
      { offset: -3, channel: 'push', template: 'pre-departure-j-3' },
      { offset: -1, channel: 'sms', template: 'pre-departure-j-1' },
      { offset: 0, channel: 'push', template: 'departure-day' },
      { offset: 1, channel: 'push', template: 'first-day-checkin' },
      { offset: 3, channel: 'email', template: 'post-trip-photos-review' },
      { offset: 7, channel: 'email', template: 'next-trip-recommendation' },
      { offset: 30, channel: 'email', template: 'referral-code' },
    ];

    let scheduled = 0;
    for (const s of schedule) {
      const sendAt = this.addDays(dep, s.offset);
      if (sendAt < new Date() && s.offset < 0) continue; // Pas de notif passée
      await this.prisma.scheduledNotification.create({
        data: {
          bookingId: payload.bookingId,
          clientId: payload.clientId,
          channel: s.channel,
          template: s.template,
          sendAt,
          status: 'pending',
        },
      });
      scheduled += 1;
    }
    return scheduled;
  }

  private async sendInitialEmails(
    payload: NewBookingPayload,
    bookingNumber: string,
    invoice: { invoiceNumber: string; pdfUrl: string },
  ): Promise<string[]> {
    await this.prisma.outboundEmail.create({
      data: {
        to: payload.email,
        template: 'booking-confirmation',
        variables: {
          firstName: payload.firstName,
          bookingNumber,
          invoiceNumber: invoice.invoiceNumber,
          invoiceUrl: invoice.pdfUrl,
        },
        status: 'queued',
      },
    });

    const travel = await this.prisma.travel.findUnique({ where: { id: payload.travelId } });
    if (travel?.creatorId) {
      const creator = await this.prisma.user.findUnique({ where: { id: travel.creatorId } });
      if (creator?.email) {
        await this.prisma.outboundEmail.create({
          data: {
            to: creator.email,
            template: 'creator-new-booking',
            variables: {
              creatorName: creator.firstName ?? '',
              travelTitle: travel.title,
              passengersCount: payload.passengersCount,
              clientName: `${payload.firstName} ${payload.lastName}`,
            },
            status: 'queued',
          },
        });
      }
    }

    return ['booking-confirmation', 'creator-new-booking'];
  }

  private toIcsDate(d: Date): string {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private escapeIcs(s: string): string {
    return s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
  }

  private addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }
}
