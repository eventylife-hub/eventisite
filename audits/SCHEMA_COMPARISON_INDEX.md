# Schema vs Migrations Comparison - Complete Index

## Overview
This analysis compares the Prisma schema (`backend/prisma/schema.prisma`) with the database migrations to identify all differences between the data model definition and the actual database schema.

**Summary:**
- **Schema:** 118 models + 122 enums
- **Database:** 38 tables + 29 enums (after 2 migrations)
- **Gap:** 80 models + 93 enums missing from database

## Generated Documents

### 1. MIGRATION_DIFFERENCES_SCHEMA_VS_MIGRATIONS.md
**Purpose:** Comprehensive technical reference for all differences

**Contains:**
- Section 1: All 93 missing enums with full enum values
- Section 2: All 80 missing table definitions
- Section 3: 1 altered table (CampaignMarketing - field added)
- Section 4: Key field additions organized by category
- Section 5: New indexes overview
- Section 6: New foreign key relationships
- Summary statistics and observations

**Use this for:**
- Understanding complete schema structure
- Identifying which models are missing
- Understanding relationships between models
- Planning implementation phases

### 2. COMPREHENSIVE_MIGRATION_TEMPLATE.sql
**Purpose:** SQL-ready template for creating missing database objects

**Contains:**
- Section 1: All 93 CREATE TYPE statements for enums
- Section 2: List of 80 missing tables with descriptions
- Critical notes on implementation order
- Foreign key constraint guidelines
- Cascade/Restrict rules

**Use this for:**
- Creating new migration files
- SQL reference for database setup
- Dependency ordering guidelines
- Copy-paste ready enum definitions

### 3. SCHEMA_GAP_SUMMARY.txt
**Purpose:** Executive summary and impact assessment

**Contains:**
- Executive summary of the gap
- Quantitative breakdown by category
- Top 10 largest missing models
- Critical dependencies and creation phases
- Impact assessment (Dev, Data, Production)
- Recommended action plan
- Reference file locations

**Use this for:**
- Understanding business impact
- Planning implementation timeline
- Identifying critical missing features
- Making decisions about priorities

## Quick Reference: Missing Models by Category

### Finance & Accounting (11 models)
- AdjustmentLine, Invoice, InvoiceLine, LedgerEntry, Refund
- PayoutBlockReason, CreditVoucher, WalletLedgerLine, TvaMarginCalc
- UrssafSettings, DisputeHold

### Booking & Reservations (8 models)
- PreReservation, PreResRoomAssignment, BookingTransfer, RoomHold
- RoomInventory, WaitlistEntry, HotelRoomAllocation, BusQuoteRequest

### Notifications & Messaging (9 models)
- NotificationEvent, NotificationPreference, NotificationSchedule
- NoGoNotification, ClientNotification, InboxThread, InboxMessage
- FollowNotifPreference, MessageTemplate

### Marketing & Attribution (10 models)
- Campaign, TrackingLink, AttributionEvent, AttributionModel, LeadCapture

### Compliance & Legal (12 models)
- DsarRequest, DPIARecord, ConsentRecord, ComplianceCheck
- ProcessingActivity, PiiAccessLog, IncidentReport, DataRetentionPolicy
- SystemAlert, AdminActionLog, CronJobLog

### Transport & Logistics (8 models)
- QuoteRequest, QuoteSegment, TransportProvider, PickupRouteTemplate
- PickupRouteStopItem, TravelOccurrenceRouteAssignment, TravelRotationPlan
- MealDeclaration, RestaurantPartner

### Admin & Operations (7 models)
- AdminUser, EmailVerificationToken, PasswordResetToken, LoginAttempt
- MVP, ExportLog, UrssafSettings

### Organization (6 models)
- OrgCode, OrgMember, OrgDiscountConfig, OrgTripRequest, OrgWallet

### Partnership (5 models)
- HotelPartner, RestaurantPartner, TransportProvider, ProviderDocument

### User & Security (7 models)
- AdminUser, EmailVerificationToken, PasswordResetToken, LoginAttempt
- PiiAccessLog, ConsentRecord, DsarRequest

### Payment & Dispute (5 models)
- DisputeHold, PayoutBlockReason, IdempotencyKey, StripeEvent
- OutboxMessage

### Tipping (4 models)
- Tip, StaffTipPool, StaffTipPoolMovement, TipPayoutLine, TipSplitPolicy

### Reviews (2 models)
- Review (extends TravelFeedback)

### Support (2 models)
- SupportMessage, InboxThread

### Miscellaneous (4 models)
- GeoCache, GoDecisionLog, MessageReadEvent, MVP

## Migration Path

### Phase 1: Enums Only
All 93 enum types must be created before any tables that reference them.

### Phase 2: Base Tables
Tables with no dependencies on other missing tables:
AdminActionLog, Campaign, ComplianceCheck, GeoCache, IdempotencyKey, MVP, ProviderDocument, PickupRouteTemplate, StripeEvent, SystemAlert, TransportProvider, TravelRotationPlan, UrssafSettings

### Phase 3-13: Dependent Tables
Organized by dependency chains and foreign key relationships.

### Phase 14: Indexes & Constraints
~450 indexes and 150+ foreign key constraints across all new tables.

## Critical Statistics

| Metric | Count |
|--------|-------|
| Missing Enums | 93 |
| Missing Models | 80 |
| New Indexes | ~450 |
| New Foreign Keys | ~150 |
| Total Fields to Add | ~1,170 |
| Affected Categories | 15 |

## File Locations

```
/sessions/exciting-determined-planck/mnt/eventisite/
├── MIGRATION_DIFFERENCES_SCHEMA_VS_MIGRATIONS.md  [Detailed reference]
├── COMPREHENSIVE_MIGRATION_TEMPLATE.sql           [SQL template]
├── SCHEMA_GAP_SUMMARY.txt                         [Executive summary]
├── SCHEMA_COMPARISON_INDEX.md                     [This file]
├── backend/prisma/schema.prisma                   [Full schema - 3,391 lines]
└── backend/prisma/migrations/
    ├── 20260303002933_init/migration.sql          [38 tables, 29 enums]
    └── 20260306061254_add_campaign_rejection_reason/migration.sql [+1 field]
```

## How to Use These Documents

**For Implementation:**
1. Start with SCHEMA_GAP_SUMMARY.txt - understand the scope
2. Use COMPREHENSIVE_MIGRATION_TEMPLATE.sql - get SQL ready
3. Reference MIGRATION_DIFFERENCES_SCHEMA_VS_MIGRATIONS.md - detailed specs

**For Discussion:**
1. Use SCHEMA_GAP_SUMMARY.txt - executive overview
2. Reference impact assessment section - business impact

**For Development:**
1. Review MIGRATION_DIFFERENCES_SCHEMA_VS_MIGRATIONS.md - all model definitions
2. Check dependencies in SCHEMA_GAP_SUMMARY.txt - creation order
3. Execute SQL from COMPREHENSIVE_MIGRATION_TEMPLATE.sql

## Next Steps

1. Create new migration file: `20260315000000_add_missing_models.sql`
2. Generate complete DDL from schema using Prisma migration tools
3. Test on staging database
4. Verify Prisma client generation succeeds
5. Deploy to production
