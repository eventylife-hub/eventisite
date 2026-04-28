import { Controller, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { AutomationRunnerService, AutomationName } from './automation-runner.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/automations')
export class AutomationsController {
  constructor(
    private readonly runner: AutomationRunnerService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('settings')
  async getSettings() {
    return this.prisma.automationSetting.findMany({
      orderBy: { automationName: 'asc' },
    });
  }

  @Get('runs')
  async getRecentRuns(@Query('limit') limit = '50') {
    return this.prisma.automationRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: Math.min(parseInt(limit, 10) || 50, 200),
    });
  }

  @Get('runs/:id')
  async getRun(@Param('id') id: string) {
    return this.prisma.automationRun.findUnique({ where: { id } });
  }

  @Post(':name/toggle')
  async toggle(@Param('name') name: string) {
    const current = await this.prisma.automationSetting.findUnique({
      where: { automationName: name },
    });
    return this.prisma.automationSetting.upsert({
      where: { automationName: name },
      create: { automationName: name, enabled: false },
      update: { enabled: !(current?.enabled ?? true) },
    });
  }

  @Post(':name/run-now')
  async runNow(@Param('name') name: AutomationName) {
    switch (name) {
      case 'creator-invoices-monthly':
        return this.runner.runCreatorInvoicesMonthly();
      case 'vat-margin-monthly':
        return this.runner.runVatMarginMonthly();
      case 'fec-export-yearly':
        return this.runner.runFecExportYearly();
      case 'sms-j-minus-one':
        return this.runner.runSmsJMinusOne();
      case 'notifications-tick':
        return this.runner.runNotificationsTick();
      case 'creator-daily-digest':
        return this.runner.runCreatorDailyDigest();
      default:
        return { status: 'unknown-automation', name };
    }
  }
}
