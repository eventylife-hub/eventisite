# TypeScript Error Analysis - Frontend (March 6, 2026)

## Summary
- **Total Errors**: 349
- **Total Lines of Output**: 349 errors across frontend codebase

## Error Distribution by TypeScript Error Code

| Error Code | Count | Description |
|-----------|-------|-------------|
| TS2339 | 68 | Property does not exist on type |
| TS2322 | 64 | Type is not assignable to type (type mismatch) |
| TS2345 | 58 | Argument of type X is not assignable to parameter |
| TS18046 | 26 | Variable is of type 'unknown' |
| TS18048 | 10 | Variable is possibly 'undefined' |
| TS2538 | 7 | Type cannot be used as an index type |
| TS2532 | 7 | Type has no properties in common with type |
| TS2551 | 5 | Property does not exist (typo suggestion) |
| TS2739 | 4 | Type missing required properties |
| TS2613 | 3 | Module has no default export |
| TS18047 | 3 | Variable is possibly 'null' |
| TS2786 | 2 | Expected X arguments, but got Y |
| TS2769 | 2 | Overload resolution failed |
| TS2604 | 2 | Constructor return type is not assignable |
| TS2560 | 2 | Object literal may only specify known properties |
| TS2531 | 2 | Object is possibly 'null' |
| TS2365 | 2 | Operator X cannot be applied to types |
| TS2307 | 2 | Cannot find module |
| TS2741 | 1 | Property is missing in type |
| TS2740 | 1 | Type has no construct signatures |
| TS2362 | 1 | Type 'X' is not applicable as index type |

## Error Categories by Directory

### 1. **App Routes (245 errors) - `app/` directory**

Primary issues in Next.js pages and layouts:

#### Admin Pages - Property Access on Wrong Types (68 TS2339 errors)
Files affected:
- `app/(admin)/admin/annulations/[id]/page.tsx` - Missing properties on `CancellationDetail`
  - `refundCalculation`, `bookingGroup`, `paidAmountCents`, `requestedAt`, `rejectionReason`
- `app/(admin)/admin/audit/page.tsx` - Empty object type `{}`
- `app/(admin)/admin/bookings/page.tsx`
- `app/(admin)/admin/pros/page.tsx`
- `app/(admin)/admin/transport/page.tsx`
- `app/(admin)/admin/support/page.tsx`

#### Type Assignment Issues (64 TS2322 errors)
Files affected:
- `app/(admin)/admin/notifications/page.tsx` - Column value renderer type mismatches (7 errors)
  - Expected types: `string`, `boolean`, `"EMAIL" | "SMS" | "PUSH"`, etc.
  - Receiving: `unknown`
- `app/(admin)/admin/finance/payouts/page.tsx` - Button size prop issues (4 errors)
  - Passing `"icon"` instead of valid ButtonSize
- `app/(admin)/admin/parametres/page.tsx` - Setting array type issues
- `app/(admin)/admin/exports/page.tsx` - Export format state type
- `app/(admin)/admin/alertes/page.tsx`

#### Unknown Type Handling (26 TS18046 + additional errors)
Files affected:
- `app/(admin)/admin/marketing/page.tsx` - Unknown value handling
- `app/(admin)/admin/alertes/page.tsx` - Unknown date and index access
- `app/(admin)/admin/parametres/page.tsx` - Multiple unknown index accesses

#### Possibly Null/Undefined (TS18047, TS18048 - 13 errors)
Files affected:
- `app/(admin)/admin/page.tsx` - Stats object possibly null (3 errors)
  - `stats.userGrowth`, `stats.pendingTravels`, `stats.pendingPros`

### 2. **Test Files (20 errors)**

#### Test Utility Import Issues (3 TS2613 errors)
Files affected:
- `__tests__/components/ReviewCard.test.tsx`
- `__tests__/components/TravelFilters.test.tsx`
- `__tests__/pages/travels-list.test.tsx`

Issue: `test-utils` module exports `userEvent` as named export, not default

#### Test Method/DOM Issues (5 TS2551 + TS2345 errors)
Files affected:
- `__tests__/admin/users.test.tsx` - 3 `selectOption` (should be `selectOptions`)
- `__tests__/components/CookieBanner.test.tsx` - 2 HTMLElement | undefined issues

#### Missing Module (1 TS2307 error)
- `__tests__/pages/travels-list.test.tsx` - Cannot find `@/(public)/voyages/page`

### 3. **Library/Utilities (15 errors)**

#### File Upload Component Issues (6 errors)
- `components/uploads/file-upload.tsx` - Type 'undefined' not assignable to 'string' or 'File'

#### API Client Issues
- `lib/api.ts` - Argument type issues
- `lib/api-client.ts` - URL/Request type issues
- `lib/sentry.ts` - Configuration type issues
- `lib/utils.ts` - Utility function type mismatches

#### Middleware & Config
- `middleware.ts` - Route/auth type issues
- `playwright.config.ts` - Test configuration types

### 4. **E2E Tests (5 errors)**
- `e2e/booking-flow.spec.ts` - Test method calls
- `e2e/pro-dashboard.spec.ts` - Navigation/element selection
- `e2e/global-setup.ts` - Setup type issues

## Top Issues to Address (Priority Order)

### P0 - Critical (Highest Impact)
1. **App/(admin)/admin/annulations/[id]/page.tsx** - 11 errors
   - CancellationDetail type mismatch - likely API response type changed
   
2. **App/(admin)/admin/notifications/page.tsx** - 8 errors
   - Table column renderer typing issues - need to fix generic type constraints

3. **App/(admin)/admin/page.tsx** - Stats type issues
   - Stats response possibly null/undefined - add null checks

### P1 - High (Breaking Issues)
4. **App/(admin)/admin/parametres/page.tsx** - 7 errors
   - Setting type array conversion issues
   
5. **Test imports** - 3 TS2613 errors
   - Fix default vs named exports in test-utils

6. **App/(admin)/admin/finance/payouts/page.tsx** - 4 errors
   - Fix button size property issues

### P2 - Medium (Type Safety)
7. Unknown type handling across admin pages
8. File upload component type safety
9. API client argument typing
10. Test method calls (selectOption vs selectOptions)

## Recommended Actions

1. Run type narrowing audit on API response types
2. Update test-utils exports to named exports
3. Fix table column renderer generic types
4. Add null/undefined guards to admin page data fetching
5. Review and update component prop typing
6. Update test utilities (selectOption → selectOptions)
7. Run full tsconfig check on unused any types

