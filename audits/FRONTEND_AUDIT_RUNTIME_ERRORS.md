# Frontend Audit Report: Runtime Errors & Broken Pages
**Date:** 2026-03-15
**Scope:** Frontend source code at `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app`

---

## Summary
Found **3 critical issues** that will cause runtime errors and broken pages, plus **multiple API path mismatches** requiring backend verification.

---

## CRITICAL ISSUES

### 1. Syntax Error in Voyages Page (PUBLIC PORTAL)
**Severity:** CRITICAL (Page will not render)
**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`
**Line:** 292

**Issue:** Malformed onSubmit handler with syntax error
```jsx
// BROKEN:
onSubmit={(e) = noValidate> e.preventDefault()}

// SHOULD BE:
onSubmit={(e) => { e.preventDefault(); }}
```

**Impact:**
- The travel listing page (`/voyages`) will fail to render
- Page-wide TypeScript error
- Users cannot browse or filter travels

**Fix:** Remove the erroneous `= noValidate>` syntax. The `noValidate` attribute is already declared on the `<form>` element (line 287).

---

### 2. Missing API Path: `/travels` (PUBLIC - Travel Listing)
**Severity:** HIGH (API 404 error)
**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`
**Line:** 87

**Issue:** Frontend calls `/travels` but backend has no matching public route
```typescript
// Frontend code:
const response = await apiClient.get<Travel[] | { data: Travel[] }>('/travels');

// Backend controllers found:
- /api/pro/travels (PRO portal)
- /api/admin/travels (ADMIN portal)
- No public `/api/travels` endpoint
```

**Impact:**
- Travel listing fails silently (falls back to demo data)
- Users see hardcoded demo travels instead of real data
- No filtering/sorting works on demo data

**Fix Required:**
- Create `/api/travels` endpoint in backend (public access, no auth required)
- OR update frontend to use an authenticated endpoint if travels should be auth-protected

**Affected Pages:**
- `/voyages` - main travel listing page
- Breadcrumb and navigation links all point here

---

### 3. Duplicate `aria-label` Attribute (PUBLIC - Voyages)
**Severity:** MEDIUM (HTML validation warning, not runtime error)
**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`
**Lines:** 287-289

**Issue:** `aria-label` attribute declared twice on same element
```jsx
<form
  aria-label="Filtrer les voyages"    // Line 287
  role="search"
  aria-label="Filtrer les voyages"    // Line 289 (duplicate)
  className="p-6 rounded-2xl"
```

**Impact:**
- React warning in console about duplicate props
- Accessibility tools may be confused
- Not a runtime error but bad practice

**Fix:** Remove one of the duplicate `aria-label` attributes.

---

## API PATH MISMATCHES (REQUIRE BACKEND VERIFICATION)

### Pro Portal API Paths
**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/lib/stores/pro-store.ts`

These paths are called but need verification against backend controllers:

| Frontend Call | Backend Route | Status | Notes |
|---|---|---|---|
| `/pro/profile` | TBD | ⚠️ VERIFY | Pro profile endpoint |
| `/pro/onboarding/status` | TBD | ⚠️ VERIFY | Onboarding status |
| `/pro/travels` | `/api/pro/travels` | ✓ EXISTS | Confirmed in backend |
| `/pro/bus-stops` | `/api/pro/bus-stops` | ⚠️ VERIFY | Check spelling |
| `/pro/formation/modules` | TBD | ⚠️ VERIFY | Formation modules |
| `/pro/formation/progress` | TBD | ⚠️ VERIFY | Formation progress tracking |
| `/pro/team` | TBD | ⚠️ VERIFY | Team members |
| `/pro/financials` | TBD | ⚠️ VERIFY | Financial data |
| `/pro/marketing/campaigns` | TBD | ⚠️ VERIFY | Marketing campaigns |
| `/pro/revenues` | TBD | ⚠️ VERIFY | Revenue data |

**Pro Dashboard Page:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(pro)/pro/page.tsx`
- Lines 59-60: Calls `/pro/travels?limit=50` and `/pro/revenues`
- Both paths need backend verification

---

### Admin Portal API Paths
**Files:** Multiple admin pages in `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(admin)/admin/`

Sample of paths being called (verify against backend):
- `/admin/alerts` (alertes page)
- `/admin/cancellations` (annulations page)
- `/admin/audit-logs` (audit page)
- `/admin/bookings` (bookings page)
- `/admin/documents` (documents page)
- `/admin/exports` (exports page)
- `/admin/dashboard/revenue` (finance page)
- `/admin/finance/payments` (finance payouts)
- `/admin/marketing` (marketing page)
- `/admin/tickets` (support tickets)
- `/admin/transport` (transport page)
- `/admin/users` (user management)

**Verification Required:** Check that all these paths exist in `AdminController` with correct routes.

---

## BROKEN IMPORTS (All Present, No Issues Found)

✓ All component imports verified as existing:
- `@/components/ui/back-to-top`
- `@/components/ui/form-field-error`
- `@/components/ui/toast-notification`
- `@/components/TravelCard`
- `@/components/newsletter-cta`
- Admin components in `@/components/admin/`
- All layout components present

---

## MAIN USER FLOWS - STATUS

### Public Portal
| Flow | Status | Issues |
|------|--------|--------|
| Homepage | ✓ Works | None |
| Travel Listing | ✗ BROKEN | Syntax error on line 292 |
| Travel Detail | TBD | Need to check `/voyages/[slug]` page |
| Contact | ✓ Works | Form syntax OK |

### Client Portal
| Flow | Status | Issues |
|------|--------|--------|
| Login (`/connexion`) | ✓ Works | Uses `/auth/login` ✓ |
| Register (`/inscription`) | ✓ Works | Uses `/auth/register` ✓ |
| Dashboard | ✓ Works | Form syntax OK |
| Bookings | ✓ Works | Form syntax OK |
| Profile | ✓ Works | Form syntax OK |

### Pro Portal
| Flow | Status | Issues |
|------|--------|--------|
| Pro Dashboard | ⚠️ Partial | API paths not verified; calls `/pro/travels` and `/pro/revenues` |
| Onboarding | ⚠️ Partial | Calls `/pro/onboarding/status` - not verified |
| Formations | ⚠️ Partial | Calls multiple `/pro/formation/*` endpoints |

### Admin Portal
| Flow | Status | Issues |
|------|--------|--------|
| Admin Dashboard | ⚠️ Partial | Multiple unverified API paths |
| User Management | ⚠️ Partial | Calls `/admin/users` - not verified |
| Bookings | ⚠️ Partial | Calls `/admin/bookings` - not verified |
| All other admin pages | ⚠️ Partial | All use unverified `/admin/*` paths |

---

## AUTHENTICATION & COOKIES

✓ **Verified Working:**
- CSRF token extraction: `lib/api-client.ts` lines 55-59 ✓
- HttpOnly cookie handling: `lib/api-client.ts` line 169 ✓
- Token refresh logic: `lib/api-client.ts` lines 173-200 ✓
- API base URL config: `lib/config.ts` line 10 ✓

---

## RECOMMENDATIONS

### Immediate (CRITICAL - Block Production)
1. **Fix line 292** in `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`
   - Remove the malformed `= noValidate>` syntax
   - Keep `noValidate` on the form tag itself

2. **Create `/api/travels` endpoint** or verify why public travel listing needs auth
   - Currently falls back to demo data
   - Production users will see fake content

3. **Remove duplicate `aria-label`** on the form (line 287-289)

### High Priority (WITHIN WEEK)
4. **Verify all Pro portal API paths** exist in backend:
   - Create missing endpoints if needed
   - Or update frontend to match actual backend routes

5. **Verify all Admin portal API paths** exist in backend:
   - Run automated route comparison test
   - Create missing endpoints

6. **Test all three portals** end-to-end:
   - Public (logged out)
   - Client (logged in as CLIENT role)
   - Pro (logged in as PRO role)
   - Admin (logged in as ADMIN role)

### Medium Priority (BEFORE BETA)
7. **Add integration tests** for each main user flow
   - Test API response handling
   - Verify fallback to demo data works correctly

8. **Enable TypeScript strict mode** to catch errors like #1 at compile time

---

## Files Needing Changes

```
CRITICAL:
- /sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx (Line 292)

VERIFICATION REQUIRED (Backend):
- All Pro portal endpoints
- All Admin portal endpoints
- Public /api/travels endpoint
```

---

## Notes

- All component imports are correctly resolved
- No missing page components found
- All main files have valid syntax except for the one critical issue on line 292
- API error handling is comprehensive with fallback to demo data
- Authentication flow is properly implemented with CSRF protection
