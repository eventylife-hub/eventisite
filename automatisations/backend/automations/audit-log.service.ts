import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogEntry {
  runId?: string;
  entityType: string;
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'sent' | 'completed' | 'failed' | 'skipped';
  beforeState?: object | null;
  afterState?: object | null;
  actor?: 'system' | 'cron' | 'webhook' | string;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    await this.prisma.auditLogAutomations.create({
      data: {
        automationRunId: entry.runId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        beforeState: entry.beforeState ?? undefined,
        afterState: entry.afterState ?? undefined,
        actor: entry.actor ?? 'system',
      },
    });
  }

  async logBatch(entries: AuditLogEntry[]): Promise<void> {
    if (!entries.length) return;
    await this.prisma.auditLogAutomations.createMany({
      data: entries.map((e) => ({
        automationRunId: e.runId,
        entityType: e.entityType,
        entityId: e.entityId,
        action: e.action,
        beforeState: e.beforeState ?? undefined,
        afterState: e.afterState ?? undefined,
        actor: e.actor ?? 'system',
      })),
    });
  }
}
