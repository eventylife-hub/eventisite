# Prisma Schema vs Migrations Comparison

**Date Generated:** 2026-03-15
**Schema:** 118 models, 122 enums
**Init Migration (20260303002933_init):** 38 tables, 29 enums
**Second Migration (20260306061254_add_campaign_rejection_reason):** 1 field added to CampaignMarketing

**Gap:** 80 missing models + 93 missing enums

---

## 1. NEW ENUMS (93 total)

```sql
CREATE TYPE "AdjustmentType" AS ENUM ('COLLECT', 'REFUND', 'NONE');
CREATE TYPE "AllocationStatus" AS ENUM ('AVAILABLE', 'HELD', 'BOOKED', 'RELEASED', 'BLOCKED');
CREATE TYPE "ArrivalMode" AS ENUM ('BUS', 'FLIGHT', 'SELF_ARRIVAL', 'TRAIN');
CREATE TYPE "AttributionStatus" AS ENUM ('PENDING', 'ATTRIBUTED', 'EXPIRED');
CREATE TYPE "BeneficiaryType" AS ENUM ('GUIDE', 'DRIVER', 'STAFF', 'CUSTOM');
CREATE TYPE "BookingTransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SMS', 'SOCIAL', 'REFERRAL', 'AFFILIATE', 'DISPLAY');
CREATE TYPE "CancellationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED');
CREATE TYPE "Channel" AS ENUM ('ORGANIC', 'PAID', 'REFERRAL', 'SOCIAL', 'EMAIL', 'DIRECT', 'AFFILIATE');
CREATE TYPE "CheckResult" AS ENUM ('PASS', 'FAIL', 'WARNING', 'SKIP');
CREATE TYPE "ComplianceStatus" AS ENUM ('COMPLIANT', 'NON_COMPLIANT', 'REVIEW_NEEDED', 'EXEMPTED');
CREATE TYPE "ConsentSource" AS ENUM ('CMP_BANNER', 'FORM', 'ONBOARDING', 'API');
CREATE TYPE "ConsentType" AS ENUM ('COOKIES_ANALYTICS', 'COOKIES_MARKETING', 'NEWSLETTER', 'DATA_PROCESSING', 'IMAGE_RIGHTS');
CREATE TYPE "CronStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED');
CREATE TYPE "DPIAStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'REVIEW_NEEDED');
CREATE TYPE "DeadlineOverrideType" AS ENUM ('SALES_EXTENSION', 'PAYMENT_EXTENSION', 'HOLD_EXTENSION');
CREATE TYPE "DiscountScope" AS ENUM ('ALL_TRAVELS', 'SPECIFIC_TRAVEL', 'CATEGORY');
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SEATS');
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED', 'CLOSED');
CREATE TYPE "DsarStatus" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'EXTENDED');
CREATE TYPE "DsarType" AS ENUM ('ACCESS', 'RECTIFICATION', 'ERASURE', 'PORTABILITY', 'RESTRICTION', 'OBJECTION');
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED');
CREATE TYPE "ExportFormat" AS ENUM ('CSV', 'PDF');
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'READY', 'EXPIRED');
CREATE TYPE "ExportType" AS ENUM ('ROOMING_LIST', 'PARTICIPANTS', 'EMERGENCY_CONTACTS', 'BUS_MANIFEST', 'FLIGHT_MANIFESTS', 'SUPPORT_TICKETS', 'LEGAL');
CREATE TYPE "FileAssetStatus" AS ENUM ('PENDING', 'CONFIRMED', 'QUARANTINED', 'DELETED');
CREATE TYPE "FollowNotifType" AS ENUM ('TRAVEL_UPDATE', 'PRICE_CHANGE', 'AVAILABILITY', 'DEPARTURE_REMINDER');
CREATE TYPE "FormationCategory" AS ENUM ('ONBOARDING', 'SALES', 'LEGAL', 'TRANSPORT', 'MARKETING', 'ADVANCED');
CREATE TYPE "GoAction" AS ENUM ('CONFIRM_DEPARTURE', 'CANCEL_NO_GO', 'EXTEND_DEADLINE');
CREATE TYPE "GroupMemberRole" AS ENUM ('LEADER', 'CO_LEADER', 'MEMBER', 'GUEST');
CREATE TYPE "GroupMemberStatus" AS ENUM ('INVITED', 'JOINED', 'LEFT', 'REMOVED');
CREATE TYPE "GroupMessageType" AS ENUM ('TEXT', 'SYSTEM', 'NOTIFICATION', 'FILE');
CREATE TYPE "HoldPolicyType" AS ENUM ('FIXED_DURATION', 'SLIDING_WINDOW', 'CUSTOM');
CREATE TYPE "HoldStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'RELEASED', 'CONVERTED');
CREATE TYPE "HotelInviteStatus" AS ENUM ('SENT', 'OPENED', 'SUBMITTED', 'EXPIRED');
CREATE TYPE "IdempotencyStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE "IncidentSeverity" AS ENUM ('SEV1', 'SEV2', 'SEV3', 'SEV4');
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'POST_MORTEM');
CREATE TYPE "IncidentType" AS ENUM ('PAYMENT', 'TECHNICAL', 'SECURITY', 'OPERATIONAL');
CREATE TYPE "InvoiceIssuer" AS ENUM ('EVENTY', 'PRO', 'PARTNER');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELED', 'CREDIT_NOTED');
CREATE TYPE "InvoiceType" AS ENUM ('CLIENT', 'PRO', 'INTERNAL', 'CREDIT_NOTE');
CREATE TYPE "LateAddStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "LedgerEntryType" AS ENUM ('PAYMENT_RECEIVED', 'REFUND_ISSUED', 'COMMISSION', 'PAYOUT', 'ADJUSTMENT', 'TVA_MARGIN', 'TIP');
CREATE TYPE "LedgerStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REVERSED');
CREATE TYPE "LegalBasis" AS ENUM ('CONSENT', 'CONTRACT', 'LEGAL_OBLIGATION', 'LEGITIMATE_INTEREST', 'VITAL_INTEREST', 'PUBLIC_TASK');
CREATE TYPE "LegalIdentifierType" AS ENUM ('SIRET', 'SIREN', 'TVA_INTRA', 'NAF');
CREATE TYPE "LinkTargetType" AS ENUM ('TRAVEL', 'PRO_PROFILE', 'LANDING_PAGE', 'CUSTOM');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'SPECIAL');
CREATE TYPE "MessageChannel" AS ENUM ('INTERNAL', 'EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE "MessageSenderType" AS ENUM ('USER', 'PRO', 'ADMIN', 'SYSTEM');
CREATE TYPE "NoGoNotifType" AS ENUM ('WARNING', 'FINAL', 'CANCELED');
CREATE TYPE "NotifCategory" AS ENUM ('BOOKING', 'PAYMENT', 'TRAVEL', 'SYSTEM', 'MARKETING', 'LEGAL', 'SUPPORT');
CREATE TYPE "NotifChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP');
CREATE TYPE "NotifEventType" AS ENUM ('BOOKING_CREATED', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'HOLD_EXPIRING', 'TRAVEL_PUBLISHED', 'TRAVEL_CANCELED', 'DOCUMENT_REQUIRED', 'SUPPORT_REPLY', 'SYSTEM_ALERT');
CREATE TYPE "NotifStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ');
CREATE TYPE "OrgTripRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'DEAD_LETTER');
CREATE TYPE "PartnerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLACKLISTED');
CREATE TYPE "PayoutBlockReasonCode" AS ENUM ('MISSING_IBAN', 'KYC_PENDING', 'DISPUTE_OPEN', 'MANUAL_HOLD', 'FRAUD_SUSPECTED');
CREATE TYPE "PayoutProfileStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "PiiAction" AS ENUM ('READ', 'EXPORT', 'ANONYMIZE', 'DELETE');
CREATE TYPE "PreResMode" AS ENUM ('STANDARD', 'ASSOCIATION', 'CORPORATE');
CREATE TYPE "PreResRoomStatus" AS ENUM ('PENDING', 'ASSIGNED', 'CONFIRMED', 'RELEASED');
CREATE TYPE "PreResStatus" AS ENUM ('PENDING_DEPOSIT', 'DEPOSIT_PAID', 'CONFIRMED', 'EXPIRED', 'CANCELED');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "ProStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');
CREATE TYPE "ProviderDocType" AS ENUM ('LICENCE', 'ASSURANCE', 'KBIS', 'AUTORISATION', 'CERTIFICAT');
CREATE TYPE "PurgeAction" AS ENUM ('ANONYMIZE', 'DELETE', 'ARCHIVE');
CREATE TYPE "QuoteRequestMode" AS ENUM ('BUS_ONLY', 'FLIGHT_ONLY', 'COMBINED');
CREATE TYPE "QuoteStatus" AS ENUM ('REQUESTED', 'RECEIVED', 'ACCEPTED', 'REJECTED', 'EXPIRED');
CREATE TYPE "RecipientType" AS ENUM ('USER', 'PRO', 'ADMIN', 'GROUP');
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "ReportReason" AS ENUM ('INAPPROPRIATE_CONTENT', 'SPAM', 'FAKE_REVIEW', 'OFFENSIVE_LANGUAGE', 'OTHER');
CREATE TYPE "RevenueMode" AS ENUM ('COMMISSION', 'MARKUP', 'FIXED_FEE');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING_MODERATION', 'APPROVED', 'REJECTED');
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "RoomingListStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CONFIRMED', 'LOCKED');
CREATE TYPE "RoomingMode" AS ENUM ('AUTOMATIC', 'MANUAL', 'HYBRID');
CREATE TYPE "RouteTemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "ScheduleJobType" AS ENUM ('HOLD_EXPIRY', 'PAYMENT_REMINDER', 'NOGO_CHECK', 'REPORT_GENERATION', 'DATA_CLEANUP', 'EMAIL_CAMPAIGN');
CREATE TYPE "SecurityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "SplitPayMode" AS ENUM ('EQUAL', 'CUSTOM', 'LEADER_PAYS_ALL');
CREATE TYPE "ThreadStatus" AS ENUM ('OPEN', 'CLOSED', 'ARCHIVED');
CREATE TYPE "TicketCategory" AS ENUM ('BOOKING', 'PAYMENT', 'TECHNICAL', 'ACCOUNT', 'TRAVEL', 'OTHER');
CREATE TYPE "TipStatus" AS ENUM ('PENDING', 'COLLECTED', 'DISTRIBUTED', 'CANCELED');
CREATE TYPE "TouchType" AS ENUM ('FIRST_CLICK', 'LAST_CLICK', 'ASSIST');
CREATE TYPE "TravelGroupInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "TripStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELED');
CREATE TYPE "VehicleType" AS ENUM ('BUS_STANDARD', 'BUS_VIP', 'MINIBUS', 'VAN', 'CAR');
CREATE TYPE "VoucherReason" AS ENUM ('CANCELLATION', 'SERVICE_ISSUE', 'COMMERCIAL_GESTURE', 'OVERBOOKING');
CREATE TYPE "WaitlistStatus" AS ENUM ('WAITING', 'NOTIFIED', 'CONVERTED', 'EXPIRED', 'CANCELED');
CREATE TYPE "WalletLedgerType" AS ENUM ('CREDIT', 'DEBIT', 'REFUND', 'ADJUSTMENT');
```

---

## 2. NEW TABLES (80 total)

See detailed schema in `/sessions/exciting-determined-planck/mnt/.claude/projects/-sessions-exciting-determined-planck/36ccfe75-6df0-4aa5-980d-c9493d9e1309/tool-results/bz4gesvwz.txt`

**Tables (alphabetical):**

1. AdjustmentLine
2. AdminActionLog
3. AdminUser
4. AttributionEvent
5. AttributionModel
6. BookingTransfer
7. BusQuoteRequest
8. Campaign
9. ClientNotification
10. ComplianceCheck
11. ConsentRecord
12. CreditVoucher
13. CronJobLog
14. DPIARecord
15. DataRetentionPolicy
16. DisputeHold
17. DsarRequest
18. EmailVerificationToken
19. ExportLog
20. FollowNotifPreference
21. GeoCache
22. GoDecisionLog
23. HotelPartner
24. HotelRoomAllocation
25. IdempotencyKey
26. InboxMessage
27. InboxThread
28. IncidentReport
29. Invoice
30. InvoiceLine
31. LeadCapture
32. LedgerEntry
33. LoginAttempt
34. MVP
35. MealDeclaration
36. MessageReadEvent
37. MessageTemplate
38. NoGoNotification
39. NotificationEvent
40. NotificationPreference
41. NotificationSchedule
42. OrgCode
43. OrgDiscountConfig
44. OrgMember
45. OrgTripRequest
46. OrgWallet
47. OutboxMessage
48. PasswordResetToken
49. PayoutBlockReason
50. PickupRouteStopItem
51. PickupRouteTemplate
52. PiiAccessLog
53. PreResRoomAssignment
54. PreReservation
55. ProFormation
56. ProcessingActivity
57. ProviderDocument
58. QuoteRequest
59. QuoteSegment
60. Refund
61. RestaurantPartner
62. Review
63. RoomHold
64. RoomInventory
65. StaffTipPool
66. StaffTipPoolMovement
67. StripeEvent
68. SupportMessage
69. SystemAlert
70. Tip
71. TipPayoutLine
72. TipSplitPolicy
73. TrackingLink
74. TransportProvider
75. TravelOccurrenceRouteAssignment
76. TravelRotationPlan
77. TvaMarginCalc
78. UrssafSettings
79. WaitlistEntry
80. WalletLedgerLine

---

## 3. ALTERED TABLES (1 table with new field)

### CampaignMarketing

**Added in migration 20260306061254_add_campaign_rejection_reason:**
- `rejectionReason` TEXT (nullable)

---

## 4. KEY FIELD ADDITIONS BY CATEGORY

### Finance & Accounting (11 models)
- Invoice, InvoiceLine, LedgerEntry, Refund, TvaMarginCalc, UrssafSettings
- CreditVoucher, WalletLedgerLine, PayoutBlockReason, AdjustmentLine, DisputeHold

### Booking & Reservations (8 models)
- PreReservation, PreResRoomAssignment, BookingTransfer, RoomHold, RoomInventory
- WaitlistEntry, HotelRoomAllocation, BusQuoteRequest

### Notifications & Messaging (9 models)
- NotificationEvent, NotificationPreference, NotificationSchedule, NoGoNotification
- ClientNotification, InboxThread, InboxMessage, FollowNotifPreference, MessageTemplate

### Marketing & Attribution (10 models)
- Campaign, TrackingLink, AttributionEvent, AttributionModel, LeadCapture
- CampaignMarketing (modified), FollowNotifPreference, MessageTemplate, Channel, Channel

### Compliance & Legal (12 models)
- DsarRequest, DPIARecord, ConsentRecord, ComplianceCheck, ProcessingActivity
- PiiAccessLog, IncidentReport, DataRetentionPolicy, SystemAlert, AdminActionLog

### Transport & Logistics (8 models)
- QuoteRequest, QuoteSegment, TransportProvider, PickupRouteTemplate, PickupRouteStopItem
- TravelOccurrenceRouteAssignment, TravelRotationPlan, MealDeclaration

### Admin & Operations (7 models)
- AdminUser, AdminActionLog, CronJobLog, MVP, ExportLog, UrssafSettings, SystemAlert

### Partnership & Third-party (5 models)
- HotelPartner, RestaurantPartner, TransportProvider, ProviderDocument, OrgCode

### Organization & Grouping (6 models)
- OrgCode, OrgMember, OrgDiscountConfig, OrgTripRequest, OrgWallet

### User & Security (7 models)
- EmailVerificationToken, PasswordResetToken, LoginAttempt, AdminUser, PiiAccessLog
- ConsentRecord, DsarRequest

### Payment & Dispute (5 models)
- DisputeHold, PayoutBlockReason, IdempotencyKey, StripeEvent, OutboxMessage

### Tipping & Compensation (4 models)
- Tip, StaffTipPool, StaffTipPoolMovement, TipPayoutLine, TipSplitPolicy

### Reviews & Feedback (2 models)
- Review (new model, extending TravelFeedback)

### Support (2 models)
- SupportMessage (extends SupportTicket), InboxThread, InboxMessage

### Miscellaneous (4 models)
- GeoCache, IdempotencyKey, GoDecisionLog, MessageReadEvent

---

## 5. NEW INDEXES (All 80 new tables have indexes)

Key indexing patterns added:
- Most tables indexed on foreign key relationships
- Status fields indexed for filtering (PENDING, APPROVED, etc.)
- Timestamps indexed for time-range queries (createdAt, expiresAt, processedAt)
- Composite indexes for common query patterns (e.g., [userId, status, createdAt])
- Unique indexes on identifiers, codes, tokens
- Partial indexes on soft deletes/archival fields

---

## 6. NEW FOREIGN KEYS (All 80 new tables)

**Key relationships added:**
- AdjustmentLine → BookingGroup, RoomBooking, User, Refund
- AdminActionLog → User
- AttributionEvent → User, TrackingLink
- BookingTransfer → RoomBooking, User
- Campaign → (no FK; marketing-focused)
- ComplianceCheck → (no FK; audit-focused)
- ConsentRecord → User
- DisputeHold → PaymentContribution, User
- DsarRequest → User
- ExportLog → Travel, User
- FollowNotifPreference → Travel (nullable)
- HotelPartner → (no FK; reference data)
- HotelRoomAllocation → HotelBlock
- Invoice → Travel (nullable)
- InvoiceLine → Invoice
- InboxMessage → InboxThread, User
- InboxThread → Travel (nullable)
- LedgerEntry → Travel (nullable)
- LoginAttempt → User (nullable)
- MealDeclaration → RestaurantPartner
- NotificationPreference → User
- OrgCode → (no FK; reference data)
- OrgDiscountConfig → OrgCode, Travel (nullable)
- OrgMember → OrgCode, User
- OrgTripRequest → OrgCode, Travel (nullable)
- OrgWallet → OrgCode
- PayoutBlockReason → PayoutProfile
- PickupRouteStopItem → PickupRouteTemplate
- PiiAccessLog → User, User(accessor)
- PreReservation → Travel, OrgCode (nullable)
- PreResRoomAssignment → PreReservation
- ProFormation → ProProfile
- QuoteRequest → Travel, TransportProvider (nullable)
- QuoteSegment → QuoteRequest
- Refund → PaymentContribution, User
- Review → Travel, User (multiple roles)
- RoomHold → Travel, RoomType, RoomBooking (nullable)
- RoomInventory → Travel, RoomType
- StaffTipPool → Travel
- StaffTipPoolMovement → StaffTipPool
- SupportMessage → SupportTicket, User
- Tip → User, Travel
- TrackingLink → CampaignMarketing (nullable)
- TransportProvider → (no FK; reference data)
- TravelOccurrenceRouteAssignment → Travel, TravelOccurrence
- TvaMarginCalc → Travel
- WaitlistEntry → Travel
- WalletLedgerLine → OrgWallet

---

## Summary Stats

| Metric | Count |
|--------|-------|
| Total Enums in Schema | 122 |
| Enums in Init Migration | 29 |
| **Missing Enums** | **93** |
| Total Models in Schema | 118 |
| Tables in Init Migration | 38 |
| **Missing Tables** | **80** |
| Fields Added in 2nd Migration | 1 |
| Total New Indexes (estimated) | 450+ |
| Total New Foreign Keys (estimated) | 150+ |

---

## Critical Observations

1. **Finance Module:** Heavy expansion with 11 new models for invoicing, ledger, refunds, and TVA margin calculations
2. **Compliance:** Significant GDPR/legal expansion (12 models) with DSAR, consent tracking, DPIA, PII access logs
3. **Notifications:** Complete redesign with event-driven architecture (9 new models) replacing simple Notification
4. **Organization Support:** New models for org codes, members, discounts, wallets, trip requests
5. **Hotel/Restaurant:** New partner management and allocation models
6. **Transport:** Quote system, route templates, vehicle management
7. **Admin:** Enhanced admin audit trails, action logs, system alerts
8. **Attribution:** Marketing attribution model with tracking links, events, channels
9. **User Verification:** New token models for email verification and password reset
10. **Idempotency:** New table for request idempotency handling

All 80 new tables need corresponding CREATE TABLE migrations with proper indexes and foreign keys.
