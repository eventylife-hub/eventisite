# Eventy API Audit Report
**Date:** 2026-03-15
**Project:** Eventy
**Audit Scope:** Frontend API calls vs. Backend endpoints

---

## Executive Summary

This audit identifies all frontend API calls that do not have corresponding backend endpoints. The analysis found **60 missing endpoints** across 126 frontend API calls, against 339 available backend endpoints.

| Metric | Count |
|--------|-------|
| **Frontend endpoints** | 126 |
| **Backend endpoints** | 339 |
| **Missing endpoints** | 60 |
| **Coverage rate** | 52.4% |

---

## Missing Endpoints by Method

### GET Requests (23 missing)

```
GET /admin/cancellations             ← app/(admin)/admin/annulations/page.tsx
GET /admin/finance/refunds           ← app/(admin)/admin/finance/page.tsx
GET /admin/marketing                 ← app/(admin)/admin/marketing/page.tsx
GET /admin/rooming                   ← app/(admin)/admin/rooming/page.tsx
GET /cancellations/                  ← app/(admin)/admin/annulations/[id]/page.tsx
GET /client/reservations/            ← app/(client)/client/reservations/[id]/rooming/page.tsx
GET /documents/                      ← app/(client)/client/documents/page.tsx
GET /finance/dashboard/              ← app/(pro)/pro/finance/page.tsx
GET /finance/travel/                 ← app/(pro)/pro/voyages/[id]/finance/page.tsx
GET /groups/                         ← app/(client)/client/groupes/[id]/page.tsx
GET /groups/travel/                  ← app/(public)/voyages/[slug]/groupes/page.tsx
GET /marketing                       ← stores/marketing-store.ts
GET /marketing/                      ← stores/marketing-store.ts
GET /pro/financials                  ← lib/stores/pro-store.ts
GET /pro/marketing/campaigns         ← lib/stores/pro-store.ts
GET /pro/messagerie/                 ← app/(pro)/pro/messagerie/[id]/page.tsx
GET /pro/team                        ← lib/stores/pro-store.ts
GET /public/pros/                    ← app/(public)/p/[proSlug]/page.tsx
GET /restauration/                   ← app/(pro)/pro/voyages/[id]/restauration/page.tsx
GET /reviews/travel/                 ← app/(public)/voyages/[slug]/avis/page.tsx
GET /rooming/                        ← app/(pro)/pro/voyages/[id]/rooming/page.tsx
GET /transport/                      ← app/(pro)/pro/voyages/[id]/transport/page.tsx
GET /travels/by-slug/                ← app/(public)/voyages/[slug]/groupes/page.tsx
```

### POST Requests (19 missing)

```
POST /admin/cancellations/           ← stores/cancellation-store.ts
POST /admin/documents/               ← app/(admin)/admin/documents/page.tsx
POST /admin/pros/                    ← app/(admin)/admin/pros/page.tsx
POST /admin/travels                  ← app/(admin)/admin/voyages/creer/page.tsx
POST /admin/travels/                 ← app/(admin)/admin/voyages/page.tsx
POST /cancellations/                 ← app/(admin)/admin/annulations/[id]/page.tsx
POST /cancellations/booking/         ← app/(client)/client/reservations/[id]/annuler/page.tsx
POST /checkout/                      ← app/(public)/voyages/[slug]/checkout/page.tsx
POST /client/reservations/           ← app/(client)/client/reservations/[id]/rooming/page.tsx
POST /finance/travel/                ← components/finance/cost-table.tsx
POST /marketing                      ← stores/marketing-store.ts
POST /marketing/                     ← stores/marketing-store.ts
POST /notifications/send             ← app/(admin)/admin/notifications/page.tsx
POST /notifications/templates/       ← app/(admin)/admin/notifications/page.tsx
POST /post-sale/travel/              ← app/(pro)/pro/voyages/[id]/bilan/page.tsx
POST /pro/messagerie/                ← app/(pro)/pro/messagerie/[id]/page.tsx
POST /pro/onboarding/step/           ← app/(pro)/pro/onboarding/page.tsx
POST /pro/register                   ← app/(pro)/pro/inscription/page.tsx
POST /public/pros/                   ← app/(public)/p/[proSlug]/page.tsx
```

### PATCH Requests (15 missing)

```
PATCH /admin/cancellations/          ← app/(admin)/admin/annulations/[id]/page.tsx
PATCH /admin/feature-flags/          ← app/(admin)/admin/parametres/page.tsx
PATCH /admin/marketing/attribution-settings ← app/(admin)/admin/marketing/page.tsx
PATCH /admin/settings/               ← app/(admin)/admin/parametres/page.tsx
PATCH /admin/travels/                ← app/(admin)/admin/voyages/[id]/page.tsx
PATCH /admin/users/                  ← app/(admin)/admin/utilisateurs/[id]/page.tsx
PATCH /client/profile/preferences    ← app/(client)/client/profil/page.tsx
PATCH /client/reservations/          ← app/(client)/client/reservations/[id]/rooming/page.tsx
PATCH /groups/                       ← stores/groups-store.ts
PATCH /marketing/                    ← stores/marketing-store.ts
PATCH /notifications/templates/      ← app/(admin)/admin/notifications/page.tsx
PATCH /pro/travels/                  ← app/(pro)/pro/voyages/[id]/edit/page.tsx
PATCH /restauration/                 ← components/restauration/meal-plan-editor.tsx
PATCH /rooming/hotel-blocks/         ← app/(pro)/pro/voyages/[id]/rooming/hotel-blocks/page.tsx
PATCH /transport/                    ← app/(pro)/pro/voyages/[id]/transport/page.tsx
```

### PUT Requests (1 missing)

```
PUT /pro/profile                     ← app/(pro)/pro/profil/page.tsx
```

### DELETE Requests (2 missing)

```
DELETE /finance/costs/               ← components/finance/cost-table.tsx
DELETE /pro/travels/                 ← app/(pro)/pro/voyages/[id]/equipe/page.tsx
```

---

## Missing Endpoints by Module

| Module | GET | POST | PATCH | PUT | DELETE | Total |
|--------|-----|------|-------|-----|--------|-------|
| Admin | 4 | 5 | 6 | 0 | 0 | **15** |
| Client | 1 | 1 | 2 | 0 | 0 | **4** |
| Pro | 6 | 4 | 3 | 1 | 1 | **15** |
| Public | 2 | 2 | 0 | 0 | 0 | **4** |
| Finance | 2 | 1 | 0 | 0 | 1 | **4** |
| Other | 8 | 6 | 4 | 0 | 0 | **18** |
| **TOTAL** | **23** | **19** | **15** | **1** | **2** | **60** |

---

## Critical Missing Endpoints

Priority implementation order:

### Phase 1 - Critical Infrastructure
1. **GET /travels/by-slug/** - Required for public voyage pages
2. **GET /client/reservations/** - Core client feature
3. **POST /checkout/** - Payment flow
4. **PUT /pro/profile** - Pro account management

### Phase 2 - Admin Features
1. **GET /admin/cancellations** - Admin cancellation management
2. **PATCH /admin/cancellations/** - Process cancellations
3. **GET /admin/rooming** - Admin accommodation view
4. **GET /admin/marketing** - Admin marketing dashboard
5. **PATCH /admin/marketing/attribution-settings** - Marketing configuration

### Phase 3 - Pro Features
1. **GET /pro/financials** - Financial dashboard
2. **GET /pro/marketing/campaigns** - Marketing overview
3. **PATCH /pro/travels/** - Edit travels
4. **POST /pro/messagerie/** - Messaging system
5. **POST /pro/onboarding/step/** - Onboarding flow

### Phase 4 - Notifications & Post-Sale
1. **POST /notifications/send** - Notification system
2. **POST /post-sale/travel/** - Post-travel operations
3. **POST /notifications/templates/** - Notification templates

---

## Methodology

1. **Frontend Extraction**: Scanned all `.ts` and `.tsx` files in `/frontend/` for `apiClient.(get|post|put|patch|delete)` calls
2. **Backend Extraction**: Scanned all `.ts` files in `/backend/src/` for `@Controller` and HTTP method decorators (`@Get`, `@Post`, etc.)
3. **Path Normalization**: Converted template parameters (`${id}` → `{id}`, `:id` → `{id}`)
4. **Matching Logic**: Exact and normalized path matching across HTTP methods

---

## Recommendations

1. **Immediate Action**: Implement all Phase 1 endpoints before beta testing
2. **Testing Strategy**: Add integration tests for frontend-backend endpoint pairs
3. **Documentation**: Maintain an API contract document listing all endpoints
4. **CI/CD**: Add automated checks to detect new frontend calls without backend endpoints
5. **Staging**: Deploy Phase 1 endpoints to staging for integration testing

---

## Files Scanned

- **Frontend**: 104 files with API calls
- **Backend**: 29 controller modules
- **Total Lines Analyzed**: ~290,000+ (backend) + ~150,000+ (frontend)

---

*End of Report*
