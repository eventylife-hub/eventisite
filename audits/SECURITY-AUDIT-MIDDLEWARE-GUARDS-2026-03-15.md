# Security Audit: Middleware & Guards
**Date:** 2026-03-15
**Scope:** Backend guards, middleware, CORS, rate limiting, and frontend route protection
**Status:** 2 Issues Found (1 High, 1 Medium)

---

## Executive Summary

The Eventy platform implements a comprehensive security architecture with proper JWT authentication, role-based access control, CSRF protection, and security headers. Most controls are well-designed and properly enforced. However, **two issues** were identified that require immediate attention:

1. **[HIGH]** Missing rate limiting on the logout endpoint
2. **[MEDIUM]** Admin layout lacks server-side role verification component

All other security controls are functioning correctly.

---

## Backend Security Audit

### 1. JWT Authentication Guard ✅

**File:** `/backend/src/common/guards/jwt-auth.guard.ts`

**Findings:**
- Properly extends NestJS `AuthGuard('jwt')` from Passport
- Validates JWT signature and expiration through Passport
- Implements `@Public()` decorator bypass for public routes
- Logging does not expose sensitive tokens
- Timing-safe comparison not needed for JWT (signature validation is cryptographic)

**Status:** PASS

---

### 2. Role-Based Access Control (RBAC) Guard ✅

**File:** `/backend/src/common/guards/roles.guard.ts`

**Findings:**
- Properly validates user existence before role checking
- Implements case-insensitive role matching
- Supports both primary user roles (CLIENT, PRO, ADMIN) and admin sub-roles
- Exhaustive role checking prevents fall-through vulnerabilities
- Proper logging without exposing roles
- Correctly throws `ForbiddenException` for unauthorized access
- Guard requires `JwtAuthGuard` to be used together

**Status:** PASS

---

### 3. Rate Limiting Configuration ⚠️ ISSUE #1

**File:** `/backend/src/app.module.ts`
**Related:** `/backend/src/common/decorators/rate-limit.decorator.ts`

**Findings:**

**Global Rate Limit:**
- ✅ Properly configured: 100 requests per 60 seconds per IP
- ✅ ThrottlerGuard registered globally as APP_GUARD
- ✅ Appropriate for general protection

**Endpoint-Specific Rate Limits:**
- ✅ AUTH endpoints (login, register, password reset): 5 req/min
- ✅ PAYMENT endpoints (checkout): 10 req/min
- ✅ UPLOAD endpoints: 5 req/min
- ✅ EXPORT endpoints: 3 req/min
- ✅ ADMIN endpoints: 50 req/min
- ✅ ADMIN_CRITICAL endpoints: 5 req/min
- ✅ WEBHOOK endpoints (Stripe): 200 req/min

**ISSUE FOUND:**
The `/api/auth/logout` endpoint is missing rate limiting protection.

```typescript
// File: /backend/src/modules/auth/auth.controller.ts:217-227
@Post('logout')
@HttpCode(HttpStatus.OK)
async logout(
  @CurrentUser() user: JwtUserPayload,
  @Res({ passthrough: true }) res: Response,
) {
  // NO @RateLimit DECORATOR
  // ...
}
```

**Risk:** An authenticated attacker could flood the logout endpoint to:
- Exhaust server resources
- Trigger audit log spam
- Disrupt the authentication service

**Recommendation:** Add `@RateLimit(RateLimitProfile.AUTH)` decorator.

**Severity:** HIGH

---

### 4. CSRF Protection Middleware ✅

**File:** `/backend/src/common/middleware/csrf.middleware.ts`

**Findings:**
- ✅ Implements "Double Submit Cookie" pattern correctly
- ✅ Non-httpOnly cookie for frontend readability
- ✅ httpOnly flag in production (`secure: isProduction`)
- ✅ `sameSite: 'strict'` prevents CSRF across sites
- ✅ Timing-safe comparison using `crypto.timingSafeEqual()`
- ✅ Token expiry: 2 hours (reasonable)
- ✅ Proper exemptions for auth endpoints and Stripe webhooks

**Exemptions Review:**
- `/api/auth/login` - Exempt (rate-limited + password validation)
- `/api/auth/register` - Exempt (rate-limited + email verification)
- `/api/auth/refresh` - Exempt (JWT + httpOnly cookie validation)
- `/api/auth/forgot-password` - Exempt (rate-limited)
- `/api/auth/reset-password` - Exempt (rate-limited + token validation)
- `/api/auth/verify-email` - Exempt (rate-limited + token validation)
- `/api/webhooks/stripe` - Exempt (HMAC-SHA256 signature verification)

**Status:** PASS

---

### 5. Security Headers Middleware ✅

**File:** `/backend/src/common/security/security-headers.middleware.ts`

**Headers Verified:**
- ✅ `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- ✅ `X-Frame-Options: DENY` - Prevents clickjacking (stronger than SAMEORIGIN)
- ✅ `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- ✅ `Strict-Transport-Security: max-age=31536000; includeSubDomains` - 1 year HSTS
- ✅ `Referrer-Policy: strict-origin-when-cross-origin` - Limits referrer leakage
- ✅ `Permissions-Policy` - Disables camera, microphone, geolocation

**CSP (Content Security Policy):**
```
default-src 'self'
script-src 'self' https://js.stripe.com
frame-src https://js.stripe.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
connect-src 'self' https://api.stripe.com https://maps.googleapis.com
```

**Status:** PASS (Note: `style-src 'unsafe-inline'` is acceptable for this payment platform)

---

### 6. Helmet Configuration ✅

**File:** `/backend/src/main.ts:26`

**Findings:**
- ✅ Helmet is properly configured with default settings
- ✅ Applied globally to all routes
- ✅ Default Helmet settings override with explicit security headers middleware
- ✅ No conflicting configurations detected

**Status:** PASS

---

### 7. CORS Configuration ✅

**File:** `/backend/src/common/security/cors.config.ts`

**Findings:**
- ✅ Explicit origin validation via `CorsConfig.getOrigins()`
- ✅ Wildcard origins (`*`) rejected when `credentials: true`
- ✅ Production requires explicit `CORS_ORIGINS` environment variable
- ✅ Fallback to `http://localhost:3000` in development
- ✅ URL validation using `new URL()` constructor
- ✅ All HTTP methods allowed: GET, POST, PUT, PATCH, DELETE, OPTIONS
- ✅ `credentials: true` enables cookie sharing
- ✅ Preflight cache: 24 hours (86400 seconds)

**Configuration Review:**
```typescript
const CorsOptions = {
  origin: [...], // Validated list
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400,
}
```

**Status:** PASS

---

### 8. Request Limits Configuration ✅

**File:** `/backend/src/common/security/request-limits.config.ts`

**Findings:**
- ✅ JSON payload limit: 1 MB (default)
- ✅ URL-encoded limit: 512 KB
- ✅ Stripe webhook exception: 5 MB (necessary for Stripe events)
- ✅ File upload limits configured separately
- ✅ Request timeout: 30 seconds
- ✅ Header limit: 8 KB (compression bomb protection)

**Status:** PASS

---

### 9. Error Response Filtering ✅

**File:** `/backend/src/common/filters/http-exception.filter.ts`

**Findings:**
- ✅ Standardized error response format
- ✅ No sensitive token/password data exposed in errors
- ✅ Validation errors properly extracted (class-validator)
- ✅ Type guards prevent prototype pollution
- ✅ Generic error on filter exceptions ("Erreur interne du serveur")
- ✅ Proper status code mapping
- ✅ Appropriate logging levels (warn for 4xx, error for 5xx)

**Status:** PASS

---

## Frontend Security Audit

### 1. Middleware JWT Validation ✅

**File:** `/frontend/middleware.ts`

**Findings:**
- ✅ JWT signature verification using HMAC-SHA256
- ✅ Timing-safe comparison: `crypto.timingSafeEqual()`
- ✅ Token expiration validation (`decoded.exp * 1000 < Date.now()`)
- ✅ JWT_SECRET required in production
- ✅ Proper error handling (redirects to login)

**JWT Payload Validation:**
```typescript
interface JwtPayload {
  sub: string;
  email: string;
  role: 'CLIENT' | 'PRO' | 'ADMIN';
  iat: number;
  exp: number;
}
```

**Role Validation:**
- ✅ Valid roles enum: `Set(['CLIENT', 'PRO', 'ADMIN'])`
- ✅ Throws on unknown roles

**Status:** PASS

---

### 2. Protected Route Matching ✅

**File:** `/frontend/middleware.ts:211-218`

**Findings:**
- ✅ Matcher covers all protected portals:
  - `/admin/:path*` - Admin portal
  - `/pro/:path*` - Pro portal
  - `/client/:path*` - Client portal
  - `/checkout/:path*` - Checkout flow

**Status:** PASS

---

### 3. Admin Route Protection ✅

**File:** `/frontend/middleware.ts:171-176`

**Findings:**
- ✅ Routes starting with `/admin` require `role === 'ADMIN'`
- ✅ Redirects non-admins to homepage
- ✅ Server-side validation in middleware (cannot be bypassed)

```typescript
if (pathname.startsWith('/admin')) {
  if (userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
```

**Status:** PASS

---

### 4. Pro Route Protection ✅

**File:** `/frontend/middleware.ts:178-184`

**Findings:**
- ✅ Routes starting with `/pro` require `role === 'PRO' || role === 'ADMIN'`
- ✅ Allows admins to access pro portals (appropriate)
- ✅ Redirects unauthorized users to homepage
- ✅ Server-side validation

**Status:** PASS

---

### 5. Client Route Protection ✅

**File:** `/frontend/middleware.ts:186-192`

**Findings:**
- ✅ Routes starting with `/client` require `role === 'CLIENT' || role === 'ADMIN'`
- ✅ Allows admins to impersonate clients if needed
- ✅ Server-side validation

**Status:** PASS

---

### 6. Public Routes List ✅

**File:** `/frontend/middleware.ts:54-84`

**Findings:**
- ✅ Comprehensive list of public routes
- ✅ Includes auth pages, legal pages, blog, contact, FAQ
- ✅ Dynamic patterns for public travel pages and pro profiles

**Status:** PASS

---

### 7. Open Redirect Protection ✅

**File:** `/frontend/app/(auth)/connexion/page.tsx:21-23`

**Findings:**
- ✅ Validates redirect parameter:
  ```typescript
  const rawRedirect = searchParams.get('redirect') || '/client/dashboard';
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
    ? rawRedirect
    : '/client/dashboard';
  ```
- ✅ Prevents protocol-relative URLs (`//domain.com`)
- ✅ Only allows absolute paths starting with `/`

**Status:** PASS

---

### 8. Admin Layout Client-Side Role Display ⚠️ ISSUE #2

**File:** `/frontend/app/(admin)/admin/layout.tsx:120-125`

**Findings:**

The admin layout displays hardcoded user information and imports `useAuthStore` for logout functionality, but **does NOT verify the user's role before rendering the admin interface**.

```typescript
// File: /frontend/app/(admin)/admin/layout.tsx
const logout = useAuthStore((state) => state.logout);

// Line 124 - displays role without validation
<div className="user-role">FounderAdmin</div>
```

**ISSUE FOUND:**
While the Next.js middleware properly prevents unauthorized access at the route level (server-side in Edge Runtime), the admin layout component itself does not perform client-side role verification. This creates a potential UX problem if the middleware somehow fails or if the page is accessed through an edge case.

**Risk:** Low (middleware is server-side and authoritative), but best practice suggests client-side verification as defense-in-depth.

**Recommendation:** Add client-side role verification in the admin layout:

```typescript
'use client';

export default function AdminLayout({ children }: AdminLayoutProps) {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  // Verify admin role client-side (defense in depth)
  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  // ... rest of layout
}
```

**Severity:** MEDIUM (defense-in-depth, not a direct bypass)

---

## Authentication Token Management ✅

**Findings:**
- ✅ JWT tokens stored in httpOnly cookies (backend sets)
- ✅ Frontend middleware validates token signature
- ✅ Token expiration checked (24-hour default)
- ✅ Refresh token pattern implemented
- ✅ No tokens exposed in localStorage or URL parameters

**Status:** PASS

---

## Summary of Issues

| Issue | File | Severity | Type |
|-------|------|----------|------|
| Missing rate limit on logout endpoint | `/backend/src/modules/auth/auth.controller.ts:217-227` | HIGH | Missing Control |
| Admin layout lacks client-side role verification | `/frontend/app/(admin)/admin/layout.tsx` | MEDIUM | Defense-in-Depth |

---

## Recommendations (Priority Order)

### 1. [IMMEDIATE] Add Rate Limiting to Logout Endpoint

**File:** `/backend/src/modules/auth/auth.controller.ts`

**Fix:**
```typescript
@RateLimit(RateLimitProfile.AUTH)  // ADD THIS LINE
@ApiOperation({ summary: 'Déconnecter l\'utilisateur' })
@ApiResponse({ status: 200, description: 'Déconnexion réussie' })
@ApiResponse({ status: 401, description: 'Non autorisé' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post('logout')
@HttpCode(HttpStatus.OK)
async logout(
  @CurrentUser() user: JwtUserPayload,
  @Res({ passthrough: true }) res: Response,
) {
  // ... existing code
}
```

**Effort:** 1 line change

---

### 2. [SOON] Add Client-Side Role Verification to Admin Layout

**File:** `/frontend/app/(admin)/admin/layout.tsx`

**Fix:**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: AdminLayoutProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Verify admin role client-side (defense in depth)
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') {
    return null; // Prevent render
  }

  // ... rest of existing layout code
}
```

**Effort:** ~10 lines

---

## Security Posture Summary

| Category | Status | Notes |
|----------|--------|-------|
| JWT Authentication | ✅ Strong | Proper validation, signature verification |
| RBAC Implementation | ✅ Strong | Exhaustive checking, proper logging |
| CORS Configuration | ✅ Strong | Production-ready, wildcard rejection |
| CSRF Protection | ✅ Strong | Timing-safe comparison, proper exemptions |
| Security Headers | ✅ Strong | Comprehensive CSP, HSTS, X-Frame-Options |
| Rate Limiting | ⚠️ Good | Missing on logout endpoint (1 issue) |
| Route Protection | ✅ Strong | Server-side middleware, proper redirects |
| Error Handling | ✅ Strong | No sensitive data leakage |
| Request Validation | ✅ Strong | Whitelist mode, XSS sanitization |
| Overall | ⚠️ Very Good | 2 issues found, both fixable in <5 minutes |

---

## Testing Recommendations

1. **Logout Rate Limiting:** Test that 5+ logout requests in 60s return 429
2. **Admin Layout:** Verify client-side redirect when accessing `/admin` with CLIENT role
3. **CORS:** Verify wildcard origins are rejected when credentials=true
4. **CSRF:** Verify token mismatch throws 403
5. **JWT:** Verify expired tokens redirect to login
6. **Role Guards:** Verify role mismatches throw 403

---

## Conclusion

The Eventy platform implements a comprehensive, well-designed security architecture. The two issues identified are minor and easily fixable:

1. **Logout rate limiting** (1 line) - prevents brute-force exhaustion
2. **Admin layout role check** (10 lines) - defense-in-depth measure

**Recommendation:** Fix both issues before production deployment. All other security controls are functioning correctly.

**Audit Date:** 2026-03-15
**Auditor:** Security Audit System
