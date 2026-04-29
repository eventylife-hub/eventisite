import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../automations/audit-log.service';

export interface VatMarginPeriodReport {
  period: { yearMonth: string; from: Date; to: Date };
  totalRevenueTtcEur: number;
  totalCostTtcEur: number;
  totalMarginTtcEur: number;
  vatOnMarginEur: number;
  marginHtEur: number;
  bookingsCount: number;
  computedAt: Date;
}

@Injectable()
export class VatMarginService {
  private readonly logger = new Logger(VatMarginService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  async computeForLastMonth(): Promise<VatMarginPeriodReport> {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return this.computeForPeriod(from, to);
  }

  async computeForPeriod(from: Date, to: Date): Promise<VatMarginPeriodReport> {
    const yearMonth = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}`;
    const dedupeKey = `vat-margin:${yearMonth}`;

    const bookings = await this.prisma.booking.findMany({
      where: { paidAt: { gte: from, lte: to }, status: 'paid' },
      include: { travel: true },
    });

    let totalRevenueTtcEur = 0;
    let totalCostTtcEur = 0;

    for (const b of bookings) {
      totalRevenueTtcEur += Number(b.totalAmountEur);
      // Coût pondéré = coût total voyage × (pax booking / pax voyage total)
      const travelTotalPax = Math.max(1, b.travel.totalPaxConfirmed ?? 1);
      const costShare =
        (Number(b.travel.totalCostEur ?? 0) * (b.passengersCount ?? 1)) / travelTotalPax;
      totalCostTtcEur += costShare;
    }

    const totalMarginTtcEur = +(totalRevenueTtcEur - totalCostTtcEur).toFixed(2);
    const vatOnMarginEur = +Math.max(0, totalMarginTtcEur * (20 / 120)).toFixed(2);
    const marginHtEur = +(totalMarginTtcEur - vatOnMarginEur).toFixed(2);

    const report: VatMarginPeriodReport = {
      period: { yearMonth, from, to },
      totalRevenueTtcEur: +totalRevenueTtcEur.toFixed(2),
      totalCostTtcEur: +totalCostTtcEur.toFixed(2),
      totalMarginTtcEur,
      vatOnMarginEur,
      marginHtEur,
      bookingsCount: bookings.length,
      computedAt: new Date(),
    };

    await this.prisma.vatMarginReport.upsert({
      where: { yearMonth },
      create: {
        yearMonth,
        periodFrom: from,
        periodTo: to,
        totalRevenueTtcEur: report.totalRevenueTtcEur,
        totalCostTtcEur: report.totalCostTtcEur,
        totalMarginTtcEur: report.totalMarginTtcEur,
        vatOnMarginEur: report.vatOnMarginEur,
        marginHtEur: report.marginHtEur,
        bookingsCount: report.bookingsCount,
        computedAt: report.computedAt,
      },
      update: {
        totalRevenueTtcEur: report.totalRevenueTtcEur,
        totalCostTtcEur: report.totalCostTtcEur,
        totalMarginTtcEur: report.totalMarginTtcEur,
        vatOnMarginEur: report.vatOnMarginEur,
        marginHtEur: report.marginHtEur,
        bookingsCount: report.bookingsCount,
        computedAt: report.computedAt,
      },
    });

    await this.notifyAdmin(report);
    await this.audit.log({
      entityType: 'vat-margin-report',
      entityId: yearMonth,
      action: 'created',
      afterState: report as unknown as object,
    });

    // dedupe (informatif — on permet la recompute via upsert mais on log)
    await this.prisma.automationDedupe.upsert({
      where: { key: dedupeKey },
      create: { key: dedupeKey, result: report as unknown as object },
      update: { result: report as unknown as object, updatedAt: new Date() },
    });

    return report;
  }

  private async notifyAdmin(report: VatMarginPeriodReport) {
    const admins = await this.prisma.user.findMany({ where: { role: 'admin' } });
    for (const admin of admins) {
      await this.prisma.outboundEmail.create({
        data: {
          to: admin.email,
          template: 'vat-margin-monthly',
          variables: {
            period: report.period.yearMonth,
            revenue: report.totalRevenueTtcEur.toFixed(2),
            margin: report.totalMarginTtcEur.toFixed(2),
            vat: report.vatOnMarginEur.toFixed(2),
            bookings: report.bookingsCount,
          },
          status: 'queued',
        },
      });
    }
  }
}
