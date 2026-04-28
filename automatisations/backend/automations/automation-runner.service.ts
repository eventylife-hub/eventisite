import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from './audit-log.service';
import { ScheduledNotificationsService } from '../notifications/scheduled/scheduled-notifications.service';
import { CreatorInvoicingService } from '../accounting/creator-invoicing/creator-invoicing.service';
import { VatMarginService } from '../accounting/vat-margin/vat-margin.service';
import { FecExportService } from '../accounting/fec-export/fec-export.service';

export type AutomationName =
  | 'creator-invoices-monthly'
  | 'vat-margin-monthly'
  | 'fec-export-yearly'
  | 'sms-j-minus-one'
  | 'notifications-tick'
  | 'creator-daily-digest';

export interface AutomationRunResult {
  automationName: AutomationName;
  status: 'success' | 'skipped' | 'failed';
  startedAt: Date;
  endedAt: Date;
  durationMs: number;
  itemsProcessed: number;
  error?: string;
}

@Injectable()
export class AutomationRunnerService {
  private readonly logger = new Logger(AutomationRunnerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
    private readonly notifications: ScheduledNotificationsService,
    private readonly creatorInvoicing: CreatorInvoicingService,
    private readonly vatMargin: VatMarginService,
    private readonly fecExport: FecExportService,
  ) {}

  async run<T>(
    name: AutomationName,
    handler: () => Promise<{ itemsProcessed: number; meta?: T }>,
  ): Promise<AutomationRunResult> {
    const enabled = await this.isEnabled(name);
    const startedAt = new Date();

    if (!enabled) {
      this.logger.warn(`[skip] ${name} disabled in automation_settings`);
      return {
        automationName: name,
        status: 'skipped',
        startedAt,
        endedAt: new Date(),
        durationMs: 0,
        itemsProcessed: 0,
      };
    }

    const runId = await this.prisma.automationRun.create({
      data: { automationName: name, status: 'running', startedAt },
    });

    try {
      const { itemsProcessed, meta } = await handler();
      const endedAt = new Date();
      const durationMs = endedAt.getTime() - startedAt.getTime();

      await this.prisma.automationRun.update({
        where: { id: runId.id },
        data: {
          status: 'success',
          endedAt,
          durationMs,
          payload: meta as object | undefined,
        },
      });

      await this.audit.log({
        runId: runId.id,
        entityType: 'automation',
        entityId: name,
        action: 'completed',
        afterState: { itemsProcessed },
      });

      this.logger.log(`[ok] ${name} — ${itemsProcessed} items in ${durationMs}ms`);

      return {
        automationName: name,
        status: 'success',
        startedAt,
        endedAt,
        durationMs,
        itemsProcessed,
      };
    } catch (err) {
      const endedAt = new Date();
      const errorMsg = err instanceof Error ? err.message : String(err);

      await this.prisma.automationRun.update({
        where: { id: runId.id },
        data: { status: 'failed', endedAt, error: errorMsg },
      });

      this.logger.error(`[fail] ${name} — ${errorMsg}`);

      return {
        automationName: name,
        status: 'failed',
        startedAt,
        endedAt,
        durationMs: endedAt.getTime() - startedAt.getTime(),
        itemsProcessed: 0,
        error: errorMsg,
      };
    }
  }

  private async isEnabled(name: AutomationName): Promise<boolean> {
    const setting = await this.prisma.automationSetting.findUnique({
      where: { automationName: name },
    });
    return setting?.enabled ?? true;
  }

  // 03:00 le 1er du mois → factures créateurs
  @Cron('0 3 1 * *', { name: 'creator-invoices-monthly', timeZone: 'Europe/Paris' })
  async runCreatorInvoicesMonthly() {
    return this.run('creator-invoices-monthly', async () => {
      const result = await this.creatorInvoicing.invoiceAllCreatorsForLastMonth();
      return { itemsProcessed: result.invoicesCreated, meta: result };
    });
  }

  // 02:00 le 19 du mois → calcul TVA marge
  @Cron('0 2 19 * *', { name: 'vat-margin-monthly', timeZone: 'Europe/Paris' })
  async runVatMarginMonthly() {
    return this.run('vat-margin-monthly', async () => {
      const result = await this.vatMargin.computeForLastMonth();
      return { itemsProcessed: 1, meta: result };
    });
  }

  // Minuit 31/12 → export FEC annuel
  @Cron('0 0 31 12 *', { name: 'fec-export-yearly', timeZone: 'Europe/Paris' })
  async runFecExportYearly() {
    return this.run('fec-export-yearly', async () => {
      const result = await this.fecExport.exportYear(new Date().getFullYear());
      return { itemsProcessed: result.linesWritten, meta: result };
    });
  }

  // 18:00 chaque jour → SMS J-1 voyages
  @Cron('0 18 * * *', { name: 'sms-j-minus-one', timeZone: 'Europe/Paris' })
  async runSmsJMinusOne() {
    return this.run('sms-j-minus-one', async () => {
      const sent = await this.notifications.sendSmsJMinusOne();
      return { itemsProcessed: sent };
    });
  }

  // toutes les 15 min → notifications J-N
  @Cron(CronExpression.EVERY_15_MINUTES, { name: 'notifications-tick' })
  async runNotificationsTick() {
    return this.run('notifications-tick', async () => {
      const dispatched = await this.notifications.dispatchPending();
      return { itemsProcessed: dispatched };
    });
  }

  // 09:00 chaque jour → digest créateurs
  @Cron('0 9 * * *', { name: 'creator-daily-digest', timeZone: 'Europe/Paris' })
  async runCreatorDailyDigest() {
    return this.run('creator-daily-digest', async () => {
      const sent = await this.notifications.sendCreatorDailyDigest();
      return { itemsProcessed: sent };
    });
  }
}
