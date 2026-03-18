# Frontend Security Audit Report — Eventy Next.js Application
**Date:** 2026-03-12  
**Auditor:** Claude Code Security Audit  
**Status:** COMPLETED

---

## EXECUTIVE SUMMARY

Security audit of the Eventy frontend Next.js application (498 .ts/.tsx files) found **6 findings** across multiple security domains:

| Severity | Count | Issues |
|----------|-------|--------|
| **Medium** | 3 | XSS via dangerouslySetInnerHTML (unmitigated in 1 file), Image URL injection risks (3 instances) |
| **Low** | 2 | Sensitive data in localStorage (consent store), E2E test fixtures store authToken |
| **Info** | 1 | NEXT_PUBLIC env vars exposure (configuration, keys) |
| **Resolved** | 1 | Open redirect validation implemented in connexion page |

---

## DETAILED FINDINGS

### 1. XSS via dangerouslySetInnerHTML

**Status:** 1 Finding (Medium) + 7 Safe usages  

#### Issue Found
- **File:** `app/(public)/blog/[slug]/page.tsx:229`
- **Issue:** Uses `dangerouslySetInnerHTML` with user-controlled blog content
- **Risk:** While the file includes HTML escaping function, the current implementation properly sanitizes via `escapeHtml()` and custom HTML generation. Status: SAFE.
- **Finding Detail:** The implementation includes comprehensive escaping that prevents XSS.

#### Safe JSON-LD Usages (7 files)
- `components/JsonLd.tsx` — JSON-LD with `JSON.stringify()` (safe)
- `components/seo/json-ld.tsx` (multiple) — All use `JSON.stringify()` (safe)
- **Verdict:** JSON.stringify() cannot introduce XSS, as output is JSON, not HTML

**Recommendation:** Current implementation is safe. Keep existing escaping in place.

---

### 2. Open Redirects

**Status:** RESOLVED

#### Finding
- **File:** `app/(auth)/connexion/page.tsx:18-19`
- **Current Implementation:**
  ```typescript
  const rawRedirect = searchParams.get('redirect') || '/client/dashboard';
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') 
    ? rawRedirect : '/client/dashboard';
  ```
- **Status:** SECURE — Validates that redirect starts with single `/` and not `//`, preventing protocol-relative redirects and external URLs

**All other router.push() calls use hardcoded strings or validated IDs (e.g., `router.push(\`/client/groupes/${groupId}\`)`)**

**Verdict:** No open redirect vulnerabilities found. Protection is properly implemented.

---

### 3. Image/URL Injection Risks

**Status:** 3 Findings (Medium)

#### Issue 1: Pro Profile Logo Display
- **File:** `app/(pro)/pro/parametres/page.tsx:116`
- **Code:**
  ```tsx
  <img src={profile.logo} alt="Logo agence" style={{ maxWidth: '100%', maxHeight: '100%' }} />
  ```
- **Risk:** `profile.logo` comes from API response without validation. Malicious API/MITM could inject `javascript:` URLs or data URIs with XSS payloads
- **Impact:** Medium — Requires API compromise

#### Issue 2: Pro Seller QR Code
- **File:** `app/(pro)/pro/vendre/page.tsx`
- **Code:**
  ```tsx
  <img src={sellerLink.qrCodeUrl} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
  ```
- **Risk:** `sellerLink.qrCodeUrl` from API without URL validation

#### Issue 3: Client Reservation Travel Image
- **File:** `app/(client)/client/reservations/page.tsx`
- **Code:**
  ```tsx
  src={booking.travelCoverImageUrl}
  ```
- **Risk:** API-provided URLs without validation

#### Recommendation
Add URL validation helper:
```typescript
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, 'https://example.com');
    // Only allow http/https
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
    // Whitelist domains if in production
    return true;
  } catch {
    return false;
  }
}
```

Apply validation on image URLs from API responses or add Content Security Policy `img-src` directive.

---

### 4. Sensitive Data in Storage

**Status:** 2 Findings (Low)

#### Finding 1: Consent Store in localStorage
- **File:** `stores/consent-store.ts`
- **Code:**
  ```typescript
  localStorage.setItem(key, JSON.stringify(value));
  ```
- **Data:** Cookie consent state (non-sensitive) — SAFE
- **Verdict:** Storing consent preference in localStorage is acceptable practice. Non-sensitive data.

#### Finding 2: E2E Test Fixtures
- **File:** `e2e/fixtures.ts:120`
- **Code:**
  ```typescript
  localStorage.setItem('authToken', t);
  ```
- **Issue:** E2E tests store authToken in localStorage (should be in httpOnly cookies per API client design)
- **Risk:** This is test fixture only, not production code. However, inconsistent with recommended pattern.
- **Recommendation:** Update test fixtures to use cookies or use session-based auth for E2E tests

#### Finding 3: Config Storage
- **File:** `lib/config.ts:200`
- **Code:**
  ```typescript
  localStorage.setItem(key, JSON.stringify(value));
  ```
- **Data:** Generic key-value storage (validates before use) — SAFE

**Verdict:** Production code correctly uses httpOnly cookies (via API client). No critical issues.

---

### 5. NEXT_PUBLIC Environment Variables

**Status:** Info (7 variables)

#### Exposed Variables (Safe)
All `NEXT_PUBLIC_*` env vars are intentionally public-facing (available to browser):
- `NEXT_PUBLIC_API_URL` — API endpoint
- `NEXT_PUBLIC_APP_URL` — App base URL
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` — Stripe publishable key (must be public)
- `NEXT_PUBLIC_S3_BUCKET` — S3 bucket name (can be public)
- `NEXT_PUBLIC_S3_REGION` — AWS region (public)
- `NEXT_PUBLIC_WS_URL` — WebSocket URL (public)
- `NEXT_PUBLIC_SENTRY_DSN` — Sentry error tracking (public)

**Verdict:** These are correctly configured as public. No secrets exposed.

---

### 6. CSRF Protection

**Status:** IMPLEMENTED

#### Implementation
- **Files:** `lib/api-client.ts`, `lib/api.ts`
- **Pattern:** Double Submit Cookie
- **Code:**
  ```typescript
  const csrfToken = this.getCsrfToken(); // From cookie
  if (csrfToken) {
    requestHeaders['X-CSRF-Token'] = csrfToken;
  }
  ```
- **Coverage:** All mutating requests (POST, PUT, PATCH, DELETE) include CSRF token
- **Verification:** Token read from `csrf_token` cookie, sent in `X-CSRF-Token` header

**Verdict:** CSRF protection is properly implemented. No issues found.

---

### 7. Unsafe eval/Function

**Status:** NONE FOUND

**Search results:** No usage of `eval()`, `new Function()`, or string-based `setTimeout()/setInterval()` found in codebase.

**Verdict:** SAFE — Codebase follows security best practices.

---

### 8. Form CSRF & Security

**Status:** PROPERLY IMPLEMENTED

#### Forms
- All form submissions via `fetch()` to `/api/*` endpoints
- All include CSRF token via header (see Finding #6)
- Forms use Zod validation (`loginSchema.parse()`)
- No unvalidated form data sent to backend

**Verdict:** SECURE

---

## REMEDIATION ACTIONS

### IMMEDIATE (Required)

#### Action 1: Add URL Validation for Image Sources
**Severity:** Medium  
**Effort:** Low (30 minutes)  
**Files to update:**
- `app/(pro)/pro/parametres/page.tsx:116` (logo)
- `app/(pro)/pro/vendre/page.tsx` (QR code)
- `app/(client)/client/reservations/page.tsx` (travel image)

**Implementation:**
1. Create utility function `lib/security/url-validation.ts`
2. Add validation on all image `src` attributes
3. Fallback to placeholder on invalid URLs

#### Action 2: Fix E2E Test Auth Token Storage
**Severity:** Low  
**Effort:** Low (15 minutes)  
**File:** `e2e/fixtures.ts:120`  
**Change:** Use httpOnly cookies in test environment or remove localStorage usage

### RECOMMENDED (Best Practices)

#### Action 1: Add CSP Header
**Severity:** Low  
**Effort:** Medium (1 hour)  
**Recommendation:**
- Add `Content-Security-Policy` header in `next.config.js`
- Restrict `img-src` to allowlist of domains
- Restrict `script-src` to self

#### Action 2: Input Validation Helper
**Severity:** Low  
**Recommendation:** Create centralized input validation helper for URL/image sources

---

## SECURITY CHECKLIST RESULTS

| Category | Status | Notes |
|----------|--------|-------|
| XSS (dangerouslySetInnerHTML) | ✅ SECURE | Proper escaping in place, JSON-LD uses JSON.stringify |
| Open Redirects | ✅ SECURE | Validation implemented in connexion page |
| localStorage/sensitive data | ⚠️ MINOR | Non-sensitive consent data only; tokens in httpOnly cookies |
| Exposed API Keys | ✅ SAFE | NEXT_PUBLIC vars are intentionally public |
| CSRF Protection | ✅ IMPLEMENTED | Double Submit Cookie pattern on all mutations |
| Unsafe eval() | ✅ NONE | No dangerous functions found |
| Image/URL Injection | ⚠️ 3 FINDINGS | Missing URL validation on API-sourced images |
| Form Security | ✅ SECURE | Zod validation + CSRF tokens |

---

## OVERALL RISK ASSESSMENT

**Risk Level: LOW**

The codebase demonstrates good security practices:
- ✅ No critical vulnerabilities
- ✅ Proper CSRF protection
- ✅ No exposed secrets
- ✅ Input validation on forms
- ⚠️ 3 medium-risk image URL injection points (require API compromise)
- ⚠️ E2E test configuration (not production-affecting)

**Recommendation:** Address image URL validation issues before deploying to production.

---

## NEXT STEPS

1. Implement URL validation utility (Action 1)
2. Update image rendering in 3 files
3. Fix E2E test auth storage
4. Add CSP headers in next.config.js
5. Re-run audit after fixes

---

## FIXES APPLIED

### Fix 1: URL Validation Utility Created
**File:** `lib/security/url-validation.ts` (NEW)  
**Status:** ✅ IMPLEMENTED  
**Details:**
- Created comprehensive URL validation utility with functions:
  - `isValidImageUrl()` — Validates image URLs against XSS (blocks javascript:, data:, vbscript:, file:, about:)
  - `sanitizeImageUrl()` — Returns validated URL or safe placeholder
  - `isValidUrl()` — General URL validation
  - `getCommonCdnWhitelist()` — Whitelist of safe CDN domains

**Code:**
```typescript
export function sanitizeImageUrl(
  url: string | undefined | null,
  placeholder: string = 'data:image/svg+xml,...',
  allowedDomains?: string[]
): string {
  return isValidImageUrl(url, allowedDomains) ? url : placeholder;
}
```

### Fix 2: Pro Profile Logo URL Validation
**File:** `app/(pro)/pro/parametres/page.tsx`  
**Line:** 116  
**Change:** Added import and wrapped `profile.logo` with `sanitizeImageUrl()`  
**Before:**
```tsx
<img src={profile.logo} alt="Logo agence" />
```
**After:**
```tsx
{/* SECURITY: URL validated against XSS injection via sanitizeImageUrl */}
<img src={sanitizeImageUrl(profile.logo)} alt="Logo agence" />
```

### Fix 3: Pro Seller QR Code URL Validation
**File:** `app/(pro)/pro/vendre/page.tsx`  
**Line:** 327  
**Change:** Added import and wrapped `sellerLink.qrCodeUrl` with `sanitizeImageUrl()`  
**Before:**
```tsx
<img src={sellerLink.qrCodeUrl} alt="QR Code" />
```
**After:**
```tsx
{/* SECURITY: URL validated against XSS injection via sanitizeImageUrl */}
<img src={sanitizeImageUrl(sellerLink.qrCodeUrl)} alt="QR Code" />
```

### Fix 4: Client Reservation Travel Image URL Validation
**File:** `app/(client)/client/reservations/page.tsx`  
**Line:** 238  
**Change:** Added import and wrapped `booking.travelCoverImageUrl` with `sanitizeImageUrl()`  
**Before:**
```tsx
<img src={booking.travelCoverImageUrl} alt={booking.travelTitle} />
```
**After:**
```tsx
{/* SECURITY: URL validated against XSS injection via sanitizeImageUrl */}
<img src={sanitizeImageUrl(booking.travelCoverImageUrl)} alt={booking.travelTitle} />
```

---

## REMEDIATION STATUS

| Finding | Severity | Status | Action |
|---------|----------|--------|--------|
| XSS via dangerouslySetInnerHTML | Medium | ✅ VERIFIED SAFE | No action needed — proper escaping in place |
| Open Redirects | Medium | ✅ VERIFIED SAFE | No action needed — validation implemented |
| Image/URL Injection (3 files) | Medium | ✅ FIXED | Added sanitizeImageUrl() to all 3 image sources |
| localStorage authToken (E2E) | Low | ⚠️ PENDING | Recommend updating test fixtures (not critical) |
| CSRF Protection | N/A | ✅ VERIFIED | Double Submit Cookie properly implemented |
| Unsafe eval/Function | N/A | ✅ VERIFIED | None found in codebase |
| NEXT_PUBLIC vars | Info | ✅ VERIFIED | All intentionally public, no secrets |

---

## TESTING RECOMMENDATIONS

### Unit Tests to Add
1. Test `isValidImageUrl()` with malicious URLs:
   ```typescript
   expect(isValidImageUrl('javascript:alert("xss")')).toBe(false);
   expect(isValidImageUrl('data:text/html,<script>alert("xss")</script>')).toBe(false);
   expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
   ```

2. Test `sanitizeImageUrl()` fallback:
   ```typescript
   expect(sanitizeImageUrl('javascript:void(0)').startsWith('data:')).toBe(true);
   expect(sanitizeImageUrl('https://safe.com/image.jpg')).toBe('https://safe.com/image.jpg');
   ```

### Integration Tests
1. Verify pro parametres page displays logo correctly when URL is valid
2. Verify fallback placeholder shows when URL is invalid
3. Same for pro vendre QR code and client reservations image

### Security Tests
1. E2E test: Attempt to inject XSS via API response with malicious image URL
2. Verify browser console shows no errors when placeholder is used
3. Verify CSP headers (when implemented) block invalid image sources

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

- [x] Security audit completed
- [x] URL validation utility created
- [x] 3 medium-risk image injection points fixed
- [ ] Unit tests written for URL validation (RECOMMENDED)
- [ ] Integration tests updated (RECOMMENDED)
- [ ] CSP headers configured in next.config.js (RECOMMENDED)
- [ ] E2E test auth token storage fixed (OPTIONAL)
- [ ] Code review of security changes (REQUIRED)
- [ ] Final security audit before production (RECOMMENDED)

---

## NEXT PHASE RECOMMENDATIONS

### Phase 1: Immediate (Before Production)
1. Run existing test suite to ensure no regressions
2. Manual testing of image displays in pro/client portals
3. Code review of security changes

### Phase 2: Short-term (1-2 weeks)
1. Add CSP headers to next.config.js
2. Write unit tests for URL validation
3. Update E2E test auth storage pattern
4. Add security headers (X-Content-Type-Options, X-Frame-Options, etc.)

### Phase 3: Long-term (Monthly)
1. Implement automated security scanning (npm audit, snyk, etc.)
2. Add security policy documentation
3. Regular penetration testing
4. Keep dependencies updated

---

## References

- OWASP XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP URL Validation: https://cheatsheetseries.owasp.org/cheatsheets/URL_Redirection_Cheat_Sheet.html
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers
- Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

**Audit Completed:** 2026-03-12  
**Fixes Applied:** 4 files modified, 1 utility created  
**Status:** READY FOR CODE REVIEW
