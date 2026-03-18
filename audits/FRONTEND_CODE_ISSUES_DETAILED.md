# Frontend Code Issues - Detailed Analysis

## Issue #1: SYNTAX ERROR (Line 292)

**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`

**Current Code (BROKEN):**
```tsx
286:      {/* Filtres */}
287:      <form aria-label="Filtrer les voyages"
288:        role="search"
289:        aria-label="Filtrer les voyages"
290:        className="p-6 rounded-2xl"
291:        style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
292:        onSubmit={(e) = noValidate> e.preventDefault()}
293:      >
```

**Problems:**
1. Line 292: `onSubmit={(e) = noValidate> e.preventDefault()}` is invalid JSX syntax
   - Contains `=` instead of `=>`
   - Contains `noValidate>` which has no meaning here
   - `noValidate` is already a form attribute on line 287

**Fixed Code:**
```tsx
286:      {/* Filtres */}
287:      <form
288:        aria-label="Filtrer les voyages"
289:        role="search"
290:        className="p-6 rounded-2xl"
291:        style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
292:        onSubmit={(e) => e.preventDefault()}
293:        noValidate
294:      >
```

**Why This Happens:**
- The developer likely had merge conflicts or copy-paste error
- The arrow function syntax is corrupted
- The `noValidate` attribute got mixed into the handler code

**Impact:**
- TypeScript/Babel will fail to parse this component
- The entire `/voyages` page will not render
- Users get a white page with no error message

---

## Issue #2: MISSING API ENDPOINT

**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`

**Current Code (LINE 87):**
```typescript
82:  useEffect(() => {
83:    const loadTravels = async () => {
84:      try {
85:        setState('loading');
86:        setError(null);
87:        const response = await apiClient.get<Travel[] | { data: Travel[] }>('/travels');
88:        const travelList = Array.isArray(response) ? response : (response.data || []);
```

**The Problem:**
- Frontend calls: `GET /api/travels`
- Backend controllers checked:
  - ✗ No endpoint in public auth
  - ✓ Exists in `/api/pro/travels` (PRO only)
  - ✓ Exists in `/api/admin/travels` (ADMIN only)
  - ✗ No public `/api/travels`

**What Actually Happens:**
```typescript
107:      } catch (err: unknown) {
108:        logger.warn('API indisponible, utilisation des données de démonstration');
109:        setTravels(FALLBACK_TRAVELS);
110:        setState('data');
111:      }
```

The frontend silently catches the 404 error and shows hardcoded demo data instead. Users never know they're seeing fake content.

**Fallback Data (Lines 16-47):**
```typescript
const FALLBACK_TRAVELS: Travel[] = [
  {
    id: '1', slug: 'marrakech-express', title: 'Marrakech Express',
    destination: 'Marrakech, Maroc', startDate: '2026-05-15', endDate: '2026-05-22',
    price: 89900, image: '', rating: 4.8, reviews: 124, daysCount: 7, capacity: 50, currentBookings: 38, transportType: 'BUS',
  },
  // ... 5 more hardcoded travels
];
```

**Options to Fix:**
1. **Option A:** Create backend endpoint `/api/travels`
   - Should return public travels without auth
   - Accessible to anonymous users
   - Used by homepage carousel (lines 226-312) and travel listing

2. **Option B:** Use authenticated endpoint
   - Change frontend to call `/api/client/travels` (requires login)
   - Update homepage to show different content for logged-out users

3. **Option C:** Keep demo data intentionally
   - Document this is for beta/demo
   - Ensure it's intentional, not accidental

---

## Issue #3: DUPLICATE HTML ATTRIBUTE

**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(public)/voyages/page.tsx`

**Current Code (LINES 287-292):**
```jsx
287:      <form aria-label="Filtrer les voyages"
288:        role="search"
289:        aria-label="Filtrer les voyages"
290:        className="p-6 rounded-2xl"
291:        style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
292:        onSubmit={(e) => e.preventDefault()}
293:      >
```

**Issue:**
- `aria-label="Filtrer les voyages"` appears on lines 287 AND 289
- React will use the last one
- Creates console warning in dev mode
- Accessibility tools may report this as invalid markup

**Fixed Code:**
```jsx
287:      <form
288:        aria-label="Filtrer les voyages"
289:        role="search"
290:        className="p-6 rounded-2xl"
291:        style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
292:        onSubmit={(e) => e.preventDefault()}
293:        noValidate
294:      >
```

---

## Unverified API Paths - Pro Portal

**File:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/lib/stores/pro-store.ts`

These API calls exist but need backend verification:

### Profile Endpoints
**Line 163:** `apiClient.get<ProProfile>('/pro/profile')`
- Used by Pro dashboard
- Fallback: Demo data in lines 167-178

**Line 187:** `apiClient.get<OnboardingStatus>('/pro/onboarding/status')`
- Used by Pro dashboard, onboarding flow
- Fallback: Demo data in lines 191-202

### Travel & Bus Stop Management
**Line 219:** `apiClient.get<{ data: Travel[] }>('/pro/travels?...')`
- Used by Pro dashboard (page.tsx line 59)
- LIKELY EXISTS (endpoint found in backend search)

**Line 247:** `apiClient.get<{ data: BusStop[] }>('/pro/bus-stops?...')`
- Used by Pro bus stop management
- Fallback: Demo bus stops in lines 251-258

### Formation & Training
**Line 267:** `apiClient.get<FormationModule[]>('/pro/formation/modules')`
- Used by Pro formations page
- Fallback: Demo modules in lines 271-277

**Line 288:** `apiClient.get<Record<string, unknown>>('/pro/formation/progress')`
- Used by Pro dashboard
- Fallback: Demo progress (50%) in lines 298-304

### Team & Financials
**Line 313:** `apiClient.get<TeamMember[]>('/pro/team')`
- Used by Pro team management
- Fallback: Demo team in lines 317-324

**Line 333:** `apiClient.get<FinancialData>('/pro/financials')`
- Used by Pro dashboard
- Fallback: Demo financials in lines 337-344

**Line 354:** `apiClient.get<MarketingCampaign[]>('/pro/marketing/campaigns')`
- Used by Pro marketing section
- Fallback: Demo campaigns in lines 358-363

### Pro Dashboard Calls (page.tsx)
**Line 59-60:**
```typescript
const [travelsData, revenuesData] = await Promise.all([
  apiClient.get<Record<string, unknown>>(`/pro/travels?limit=50`, { signal }),
  apiClient.get<Record<string, unknown>>(`/pro/revenues`, { signal }),
]);
```

---

## Unverified API Paths - Admin Portal

**Directory:** `/sessions/exciting-determined-planck/mnt/eventisite/frontend/app/(admin)/admin/*/page.tsx`

All admin pages call unverified endpoints. Examples:

**Alerts Page (alertes/page.tsx):**
```typescript
75:  const data = await apiClient.get<{ data: Alert[] }>(`/admin/alerts?${params.toString()}`, { signal });
```

**Annulations Page (annulations/page.tsx):**
```typescript
115:  const data = await apiClient.get<{ data: Cancellation[] }>(`/admin/cancellations?status=${filter}`, { signal });
```

**Audit Page (audit/page.tsx):**
```typescript
51:  const data = await apiClient.get<{ data: AuditLog[] }>(`/admin/audit-logs?${params}`, { signal });
```

**Bookings Page (bookings/page.tsx):**
```typescript
62:  const data = await apiClient.get<{ data: Booking[] }>(`/admin/bookings?${params.toString()}`, { signal });
```

**Finance Page (finance/page.tsx):**
```typescript
97:  apiClient.get<RevenueStats>('/admin/dashboard/revenue', { signal }),
98:  apiClient.get<{ items?: Payment[] } | Payment[]>('/admin/finance/payments?limit=5', { signal }),
99:  apiClient.get<{ items?: Refund[] } | Refund[]>('/admin/finance/refunds?status=PENDING', { signal }),
```

**Users Page (utilisateurs/page.tsx):**
```typescript
60:  const data = await apiClient.get<PaginatedResponse>(`/admin/users?${params}`, { signal });
```

All have fallback demo data, but they need backend verification.

---

## Summary Table

| Issue | Severity | File | Line | Type | Fix Time |
|-------|----------|------|------|------|----------|
| Syntax error | CRITICAL | voyages/page.tsx | 292 | Code | 5 min |
| Missing /travels | HIGH | voyages/page.tsx | 87 | API | TBD |
| Duplicate aria-label | MEDIUM | voyages/page.tsx | 289 | HTML | 2 min |
| Pro API paths | MEDIUM | pro-store.ts | Various | API Verify | TBD |
| Admin API paths | MEDIUM | admin/*/page.tsx | Various | API Verify | TBD |

---

## Testing Recommendations

1. **Before Fix:** Run TypeScript compiler to verify syntax errors
   ```bash
   npx tsc --noEmit
   ```

2. **After Fix:** Test travel listing page
   ```bash
   # Navigate to http://localhost:3000/voyages
   # Should render filters and travel cards
   ```

3. **Verify All API Paths:** Create a test script that compares:
   - Frontend API calls from all pages
   - Backend routes from all controllers

4. **End-to-End Testing:**
   - Test public portal (no auth)
   - Test client portal (client auth)
   - Test pro portal (pro auth)
   - Test admin portal (admin auth)
