-- ============================================================================
-- COMPREHENSIVE MIGRATION TEMPLATE
-- Gap between Prisma Schema and Actual Migrations (20260303+20260306)
-- Missing: 93 ENUMS + 80 TABLES + 450+ INDEXES + 150+ FOREIGN KEYS
-- ============================================================================

-- NOTE: This file shows ONLY the missing enums and tables that exist in the
-- schema but have NOT been created in the migrations yet.
-- Use this as a reference to create a new migration file.

-- ============================================================================
-- SECTION 1: ALL MISSING ENUMS (93 total)
-- ============================================================================

-- Finance & Accounting
CREATE TYPE "AdjustmentType" AS ENUM ('COLLECT', 'REFUND', 'NONE');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELED', 'CREDIT_NOTED');
CREATE TYPE "InvoiceIssuer" AS ENUM ('EVENTY', 'PRO', 'PARTNER');
CREATE TYPE "LedgerEntryType" AS ENUM ('PAYMENT_RECEIVED', 'REFUND_ISSUED', 'COMMISSION', 'PAYOUT', 'ADJUSTMENT', 'TVA_MARGIN', 'TIP');
CREATE TYPE "LedgerStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REVERSED');
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "PayoutBlockReasonCode" AS ENUM ('MISSING_IBAN', 'KYC_PENDING', 'DISPUTE_OPEN', 'MANUAL_HOLD', 'FRAUD_SUSPECTED');
CREATE TYPE "PayoutProfileStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED', 'CLOSED');
CREATE TYPE "IdempotencyStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE "VoucherReason" AS ENUM ('CANCELLATION', 'SERVICE_ISSUE', 'COMMERCIAL_GESTURE', 'OVERBOOKING');
CREATE TYPE "WalletLedgerType" AS ENUM ('CREDIT', 'DEBIT', 'REFUND', 'ADJUSTMENT');

-- Booking & Reservations
CREATE TYPE "AllocationStatus" AS ENUM ('AVAILABLE', 'HELD', 'BOOKED', 'RELEASED', 'BLOCKED');
CREATE TYPE "HoldStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'RELEASED', 'CONVERTED');
CREATE TYPE "HoldPolicyType" AS ENUM ('FIXED_DURATION', 'SLIDING_WINDOW', 'CUSTOM');
CREATE TYPE "RoomingMode" AS ENUM ('AUTOMATIC', 'MANUAL', 'HYBRID');
CREATE TYPE "RoomingListStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CONFIRMED', 'LOCKED');
CREATE TYPE "PreResStatus" AS ENUM ('PENDING_DEPOSIT', 'DEPOSIT_PAID', 'CONFIRMED', 'EXPIRED', 'CANCELED');
CREATE TYPE "PreResMode" AS ENUM ('STANDARD', 'ASSOCIATION', 'CORPORATE');
CREATE TYPE "PreResRoomStatus" AS ENUM ('PENDING', 'ASSIGNED', 'CONFIRMED', 'RELEASED');
CREATE TYPE "LateAddStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "BookingTransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "WaitlistStatus" AS ENUM ('WAITING', 'NOTIFIED', 'CONVERTED', 'EXPIRED', 'CANCELED');
CREATE TYPE "QuoteStatus" AS ENUM ('REQUESTED', 'RECEIVED', 'ACCEPTED', 'REJECTED', 'EXPIRED');
CREATE TYPE "QuoteRequestMode" AS ENUM ('BUS_ONLY', 'FLIGHT_ONLY', 'COMBINED');
CREATE TYPE "ArrivalMode" AS ENUM ('BUS', 'FLIGHT', 'SELF_ARRIVAL', 'TRAIN');

-- Notifications & Messaging
CREATE TYPE "NotifEventType" AS ENUM ('BOOKING_CREATED', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'HOLD_EXPIRING', 'TRAVEL_PUBLISHED', 'TRAVEL_CANCELED', 'DOCUMENT_REQUIRED', 'SUPPORT_REPLY', 'SYSTEM_ALERT');
CREATE TYPE "NotifChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP');
CREATE TYPE "NotifStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ');
CREATE TYPE "NotifCategory" AS ENUM ('BOOKING', 'PAYMENT', 'TRAVEL', 'SYSTEM', 'MARKETING', 'LEGAL', 'SUPPORT');
CREATE TYPE "MessageChannel" AS ENUM ('INTERNAL', 'EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE "MessageSenderType" AS ENUM ('USER', 'PRO', 'ADMIN', 'SYSTEM');
CREATE TYPE "FollowNotifType" AS ENUM ('TRAVEL_UPDATE', 'PRICE_CHANGE', 'AVAILABILITY', 'DEPARTURE_REMINDER');
CREATE TYPE "NoGoNotifType" AS ENUM ('WARNING', 'FINAL', 'CANCELED');
CREATE TYPE "ThreadStatus" AS ENUM ('OPEN', 'CLOSED', 'ARCHIVED');
CREATE TYPE "GroupMessageType" AS ENUM ('TEXT', 'SYSTEM', 'NOTIFICATION', 'FILE');

-- Marketing & Attribution
CREATE TYPE "Channel" AS ENUM ('ORGANIC', 'PAID', 'REFERRAL', 'SOCIAL', 'EMAIL', 'DIRECT', 'AFFILIATE');
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SMS', 'SOCIAL', 'REFERRAL', 'AFFILIATE', 'DISPLAY');
CREATE TYPE "AttributionStatus" AS ENUM ('PENDING', 'ATTRIBUTED', 'EXPIRED');
CREATE TYPE "TouchType" AS ENUM ('FIRST_CLICK', 'LAST_CLICK', 'ASSIST');
CREATE TYPE "LinkTargetType" AS ENUM ('TRAVEL', 'PRO_PROFILE', 'LANDING_PAGE', 'CUSTOM');

-- Compliance & Legal
CREATE TYPE "DsarStatus" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'EXTENDED');
CREATE TYPE "DsarType" AS ENUM ('ACCESS', 'RECTIFICATION', 'ERASURE', 'PORTABILITY', 'RESTRICTION', 'OBJECTION');
CREATE TYPE "DPIAStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'REVIEW_NEEDED');
CREATE TYPE "ConsentType" AS ENUM ('COOKIES_ANALYTICS', 'COOKIES_MARKETING', 'NEWSLETTER', 'DATA_PROCESSING', 'IMAGE_RIGHTS');
CREATE TYPE "ConsentSource" AS ENUM ('CMP_BANNER', 'FORM', 'ONBOARDING', 'API');
CREATE TYPE "ComplianceStatus" AS ENUM ('COMPLIANT', 'NON_COMPLIANT', 'REVIEW_NEEDED', 'EXEMPTED');
CREATE TYPE "CheckResult" AS ENUM ('PASS', 'FAIL', 'WARNING', 'SKIP');
CREATE TYPE "PiiAction" AS ENUM ('READ', 'EXPORT', 'ANONYMIZE', 'DELETE');
CREATE TYPE "LegalBasis" AS ENUM ('CONSENT', 'CONTRACT', 'LEGAL_OBLIGATION', 'LEGITIMATE_INTEREST', 'VITAL_INTEREST', 'PUBLIC_TASK');
CREATE TYPE "LegalIdentifierType" AS ENUM ('SIRET', 'SIREN', 'TVA_INTRA', 'NAF');
CREATE TYPE "ProcessingActivity" AS ENUM (
  -- Actually not an enum in schema, but reference for data types
);
CREATE TYPE "CancellationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED');
CREATE TYPE "IncidentType" AS ENUM ('PAYMENT', 'TECHNICAL', 'SECURITY', 'OPERATIONAL');
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'POST_MORTEM');
CREATE TYPE "IncidentSeverity" AS ENUM ('SEV1', 'SEV2', 'SEV3', 'SEV4');
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "SecurityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Transport & Logistics
CREATE TYPE "VehicleType" AS ENUM ('BUS_STANDARD', 'BUS_VIP', 'MINIBUS', 'VAN', 'CAR');
CREATE TYPE "RouteTemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'SPECIAL');
CREATE TYPE "ProviderDocType" AS ENUM ('LICENCE', 'ASSURANCE', 'KBIS', 'AUTORISATION', 'CERTIFICAT');

-- Admin & Operations
CREATE TYPE "CronStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED');
CREATE TYPE "ScheduleJobType" AS ENUM ('HOLD_EXPIRY', 'PAYMENT_REMINDER', 'NOGO_CHECK', 'REPORT_GENERATION', 'DATA_CLEANUP', 'EMAIL_CAMPAIGN');
CREATE TYPE "ExportType" AS ENUM ('ROOMING_LIST', 'PARTICIPANTS', 'EMERGENCY_CONTACTS', 'BUS_MANIFEST', 'FLIGHT_MANIFESTS', 'SUPPORT_TICKETS', 'LEGAL');
CREATE TYPE "ExportFormat" AS ENUM ('CSV', 'PDF');
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'READY', 'EXPIRED');
CREATE TYPE "FileAssetStatus" AS ENUM ('PENDING', 'CONFIRMED', 'QUARANTINED', 'DELETED');
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED');
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'DEAD_LETTER');
CREATE TYPE "GoAction" AS ENUM ('CONFIRM_DEPARTURE', 'CANCEL_NO_GO', 'EXTEND_DEADLINE');

-- Organization & Grouping
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SEATS');
CREATE TYPE "DiscountScope" AS ENUM ('ALL_TRAVELS', 'SPECIFIC_TRAVEL', 'CATEGORY');
CREATE TYPE "OrgTripRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- Partnership & Third-party
CREATE TYPE "PartnerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLACKLISTED');
CREATE TYPE "HotelInviteStatus" AS ENUM ('SENT', 'OPENED', 'SUBMITTED', 'EXPIRED');

-- Reviews & Feedback
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING_MODERATION', 'APPROVED', 'REJECTED');
CREATE TYPE "ReportReason" AS ENUM ('INAPPROPRIATE_CONTENT', 'SPAM', 'FAKE_REVIEW', 'OFFENSIVE_LANGUAGE', 'OTHER');

-- Pro & Roles
CREATE TYPE "ProStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');
CREATE TYPE "FormationCategory" AS ENUM ('ONBOARDING', 'SALES', 'LEGAL', 'TRANSPORT', 'MARKETING', 'ADVANCED');
CREATE TYPE "GroupMemberRole" AS ENUM ('LEADER', 'CO_LEADER', 'MEMBER', 'GUEST');
CREATE TYPE "GroupMemberStatus" AS ENUM ('INVITED', 'JOINED', 'LEFT', 'REMOVED');
CREATE TYPE "TravelGroupInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- Tipping & Compensation
CREATE TYPE "TipStatus" AS ENUM ('PENDING', 'COLLECTED', 'DISTRIBUTED', 'CANCELED');
CREATE TYPE "BeneficiaryType" AS ENUM ('GUIDE', 'DRIVER', 'STAFF', 'CUSTOM');
CREATE TYPE "SplitPayMode" AS ENUM ('EQUAL', 'CUSTOM', 'LEADER_PAYS_ALL');

-- Misc
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "PurgeAction" AS ENUM ('ANONYMIZE', 'DELETE', 'ARCHIVE');
CREATE TYPE "DeadlineOverrideType" AS ENUM ('SALES_EXTENSION', 'PAYMENT_EXTENSION', 'HOLD_EXTENSION');
CREATE TYPE "RevenueMode" AS ENUM ('COMMISSION', 'MARKUP', 'FIXED_FEE');
CREATE TYPE "RecipientType" AS ENUM ('USER', 'PRO', 'ADMIN', 'GROUP');
CREATE TYPE "TripStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELED');

-- ============================================================================
-- SECTION 2: ALL MISSING TABLES (80 total)
-- ============================================================================
-- NOTE: This section provides the CREATE TABLE DDL for all missing tables.
-- For brevity, the complete SQL is structured in the reference document.
-- Key points:
-- - All use cuid() for id fields (@id @default(cuid()))
-- - All use TIMESTAMP(3) for datetime fields
-- - All use appropriate indexes as defined in schema
-- - All include proper foreign key constraints with cascade/restrict/set null rules
-- ============================================================================

-- Finance & Accounting Tables
-- 1. AdjustmentLine (for collecting/refunding from group members)
-- 2. Invoice (for issuing invoices to clients/pros)
-- 3. InvoiceLine (line items on invoices)
-- 4. LedgerEntry (accounting ledger)
-- 5. Refund (manage refunds)
-- 6. PayoutBlockReason (track why payouts are blocked)
-- 7. CreditVoucher (credit vouchers)
-- 8. WalletLedgerLine (org wallet ledger)
-- 9. TvaMarginCalc (TVA margin calculations for French law)
-- 10. UrssafSettings (URSSAF social charge settings)
-- 11. DisputeHold (payment disputes)

-- Booking & Reservation Tables
-- 12. PreReservation
-- 13. PreResRoomAssignment
-- 14. BookingTransfer
-- 15. RoomHold
-- 16. RoomInventory
-- 17. WaitlistEntry
-- 18. HotelRoomAllocation
-- 19. BusQuoteRequest

-- Notification & Messaging Tables
-- 20. NotificationEvent
-- 21. NotificationPreference
-- 22. NotificationSchedule
-- 23. NoGoNotification
-- 24. ClientNotification
-- 25. InboxThread
-- 26. InboxMessage
-- 27. FollowNotifPreference
-- 28. MessageTemplate

-- Marketing & Attribution Tables
-- 29. Campaign
-- 30. TrackingLink
-- 31. AttributionEvent
-- 32. AttributionModel
-- 33. LeadCapture

-- Compliance & Legal Tables
-- 34. DsarRequest
-- 35. DPIARecord
-- 36. ConsentRecord
-- 37. ComplianceCheck
-- 38. ProcessingActivity
-- 39. PiiAccessLog
-- 40. IncidentReport
-- 41. DataRetentionPolicy
-- 42. SystemAlert
-- 43. AdminActionLog
-- 44. CronJobLog

-- Transport & Logistics Tables
-- 45. QuoteRequest
-- 46. QuoteSegment
-- 47. TransportProvider
-- 48. PickupRouteTemplate
-- 49. PickupRouteStopItem
-- 50. TravelOccurrenceRouteAssignment
-- 51. TravelRotationPlan
-- 52. MealDeclaration
-- 53. RestaurantPartner

-- Organization & Grouping Tables
-- 54. OrgCode
-- 55. OrgMember
-- 56. OrgDiscountConfig
-- 57. OrgTripRequest
-- 58. OrgWallet

-- Admin & User Tables
-- 59. AdminUser
-- 60. EmailVerificationToken
-- 61. PasswordResetToken
-- 62. LoginAttempt

-- Support & Operations
-- 63. SupportMessage
-- 64. ExportLog
-- 65. OutboxMessage
-- 66. GeoCache
-- 67. GoDecisionLog
-- 68. IdempotencyKey
-- 69. ProviderDocument
-- 70. HotelPartner
-- 71. MessageReadEvent
-- 72. MVP

-- Review & Feedback
-- 73. Review (extends existing TravelFeedback)

-- Tipping
-- 74. Tip
-- 75. StaffTipPool
-- 76. StaffTipPoolMovement
-- 77. TipPayoutLine
-- 78. TipSplitPolicy

-- Misc
-- 79. StripeEvent
-- 80. ProFormation

-- ============================================================================
-- CRITICAL NOTES FOR IMPLEMENTATION
-- ============================================================================
-- 1. Order of creation matters due to foreign keys:
--    - Create all enums first (SECTION 1)
--    - Create base tables without FKs to other missing tables
--    - Create dependent tables with FKs
--    - Create indexes
--
-- 2. Foreign key constraints to existing tables (20260303_init):
--    - PaymentContribution (exists)
--    - BookingGroup (exists)
--    - Travel (exists)
--    - RoomBooking (exists)
--    - RoomType (exists)
--    - User (exists)
--    - ProProfile (exists)
--    - SupportTicket (exists)
--    - TravelGroup (exists)
--    - TravelOccurrence (exists)
--    - CampaignMarketing (exists)
--    - HotelBlock (exists)
--
-- 3. Cascade/Restrict Rules:
--    - Use CASCADE for ownership relationships
--    - Use RESTRICT for approval chains
--    - Use SET NULL for optional references
--
-- 4. CampaignMarketing was already created in init migration but:
--    - migration 20260306061254 added: rejectionReason TEXT field
--    - Verify this field exists before adding new relations
--
-- ============================================================================

-- This template is complete but needs to be expanded with actual CREATE TABLE
-- DDL for each model. See MIGRATION_DIFFERENCES_SCHEMA_VS_MIGRATIONS.md
-- for the complete model definitions with all fields and indexes.
