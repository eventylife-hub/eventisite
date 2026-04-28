import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

import { AutomationRunnerService } from './automation-runner.service';
import { AuditLogService } from './audit-log.service';
import { AutomationsController } from './automations.controller';

import { ItineraryGeneratorService } from '../travels/itinerary/itinerary-generator.service';
import { PricingEngineService } from '../travels/pricing/pricing-engine.service';
import { BookingLifecycleService } from '../bookings/lifecycle/booking-lifecycle.service';
import { ScheduledNotificationsService } from '../notifications/scheduled/scheduled-notifications.service';
import { NfcOrderService } from '../nfc/orders/nfc-order.service';
import { CreatorInvoicingService } from '../accounting/creator-invoicing/creator-invoicing.service';
import { VatMarginService } from '../accounting/vat-margin/vat-margin.service';
import { FecExportService } from '../accounting/fec-export/fec-export.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, PrismaModule],
  controllers: [AutomationsController],
  providers: [
    AutomationRunnerService,
    AuditLogService,
    ItineraryGeneratorService,
    PricingEngineService,
    BookingLifecycleService,
    ScheduledNotificationsService,
    NfcOrderService,
    CreatorInvoicingService,
    VatMarginService,
    FecExportService,
  ],
  exports: [
    AutomationRunnerService,
    AuditLogService,
    ItineraryGeneratorService,
    PricingEngineService,
    BookingLifecycleService,
    ScheduledNotificationsService,
    NfcOrderService,
    CreatorInvoicingService,
    VatMarginService,
    FecExportService,
  ],
})
export class AutomationsModule {}
