import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../automations/audit-log.service';

@Injectable()
export class ScheduledNotificationsService {
  private readonly logger = new Logger(ScheduledNotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  async dispatchPending(): Promise<number> {
    const due = await this.prisma.scheduledNotification.findMany({
      where: { status: 'pending', sendAt: { lte: new Date() } },
      take: 200,
    });

    let sent = 0;
    for (const n of due) {
      try {
        await this.send(n);
        await this.prisma.scheduledNotification.update({
          where: { id: n.id },
          data: { status: 'sent', sentAt: new Date() },
        });
        sent += 1;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        await this.prisma.scheduledNotification.update({
          where: { id: n.id },
          data: {
            status: n.retriesCount >= 2 ? 'failed' : 'pending',
            retriesCount: { increment: 1 } as never,
            lastError: errorMsg,
          },
        });
      }
    }
    return sent;
  }

  async sendSmsJMinusOne(): Promise<number> {
    const tomorrow = this.addDays(new Date(), 1);
    const start = this.startOfDay(tomorrow);
    const end = this.endOfDay(tomorrow);

    const departures = await this.prisma.travel.findMany({
      where: { departureAt: { gte: start, lte: end }, status: 'confirmed' },
      include: { bookings: { include: { client: true } } },
    });

    let sent = 0;
    for (const travel of departures) {
      for (const booking of travel.bookings) {
        if (!booking.client.phone) continue;
        await this.prisma.outboundSms.create({
          data: {
            to: booking.client.phone,
            content: `Eventy : départ demain ${this.formatHour(travel.departureAt)} - ${travel.departureLocation ?? travel.departureCity ?? ''}. Bon voyage ! ${travel.shortUrl ?? ''}`,
            status: 'queued',
          },
        });
        sent += 1;
      }
    }
    return sent;
  }

  async sendCreatorDailyDigest(): Promise<number> {
    const since = this.startOfDay(new Date());
    const creators = await this.prisma.user.findMany({
      where: { role: 'creator', isActive: true },
    });

    let sent = 0;
    for (const creator of creators) {
      const newBookings = await this.prisma.booking.count({
        where: { travel: { creatorId: creator.id }, paidAt: { gte: since } },
      });
      const newRevenue = await this.prisma.booking.aggregate({
        where: { travel: { creatorId: creator.id }, paidAt: { gte: since } },
        _sum: { totalAmountEur: true },
      });
      if (newBookings === 0) continue;

      await this.prisma.outboundEmail.create({
        data: {
          to: creator.email,
          template: 'creator-daily-digest',
          variables: {
            creatorName: creator.firstName ?? '',
            newBookings,
            newRevenueEur: newRevenue._sum.totalAmountEur ?? 0,
            date: new Date().toISOString().slice(0, 10),
          },
          status: 'queued',
        },
      });
      sent += 1;
    }
    return sent;
  }

  private async send(n: {
    id: string;
    bookingId: string | null;
    clientId: string;
    channel: string;
    template: string;
  }): Promise<void> {
    switch (n.channel) {
      case 'email':
        await this.prisma.outboundEmail.create({
          data: {
            scheduledNotificationId: n.id,
            template: n.template,
            clientId: n.clientId,
            status: 'queued',
          },
        });
        break;
      case 'sms':
        await this.prisma.outboundSms.create({
          data: {
            scheduledNotificationId: n.id,
            template: n.template,
            clientId: n.clientId,
            status: 'queued',
          },
        });
        break;
      case 'push':
        await this.prisma.outboundPush.create({
          data: {
            scheduledNotificationId: n.id,
            template: n.template,
            clientId: n.clientId,
            status: 'queued',
          },
        });
        break;
      default:
        this.logger.warn(`Unknown channel ${n.channel}`);
    }
  }

  private addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }
  private startOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(0, 0, 0, 0);
    return r;
  }
  private endOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(23, 59, 59, 999);
    return r;
  }
  private formatHour(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
