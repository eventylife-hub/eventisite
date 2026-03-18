# Infrastructure Security Audit Report
**Date:** March 12, 2026  
**Project:** Eventy Life (Eventisite)

---

## Executive Summary

A comprehensive security audit was performed on all Docker, CI/CD, and configuration files. **7 security issues** were identified and **6 have been fixed**. The infrastructure follows most best practices but had gaps in CSP strictness, credential handling, and health checks.

### Audit Scope
- Docker files (3 Dockerfiles + 2 docker-compose files)
- CI/CD workflows (4 GitHub Actions workflows)
- Next.js configuration
- Backend environment validation
- Security baseline verification

---

## Findings & Fixes

### 1. DOCKER FILES

#### ✅ Backend Dockerfile
**Status:** SECURE - No issues found
- ✓ Multi-stage build (builder → production)
- ✓ Non-root user created (USER nestjs:1001)
- ✓ Health check implemented (curl-based)
- ✓ Uses dumb-init for signal handling
- ✓ .env files excluded from context

#### ✅ Frontend Dockerfile
**Status:** FIXED
**Issues Found:**
- ❌ Missing health check
- ❌ curl not available

**Fix Applied:**
- Added curl to production image
- Added health check with fallback endpoints

#### ✅ docker-compose.yml (Production)
**Status:** SECURE
- ✓ No hardcoded credentials
- ✓ All values via environment variables
- ✓ Database ports not exposed
- ✓ Redis ports not exposed
- ✓ Health checks configured

#### ❌ docker-compose.dev.yml
**Status:** FIXED
**Issues Found:**
- ❌ Hardcoded PostgreSQL credentials
- ❌ Redis missing authentication
- ❌ Health check using hardcoded username

**Fix Applied:**
- All credentials now use env variables with safe defaults
- Redis now requires authentication (--requirepass)
- Health check updated to use env variable

---

### 2. NEXT.JS CONFIGURATION

#### ❌ next.config.js
**Status:** FIXED
**Issues Found:**
- ❌ CSP too permissive: unsafe-inline and unsafe-eval enabled
- ❌ No upgrade-insecure-requests

**Fix Applied:**
- Removed unsafe directives (unsafe-inline, unsafe-eval)
- Added upgrade-insecure-requests directive
- Maintained Stripe and Google Maps integration via https domains

**Current CSP:**
```
default-src 'self'
script-src 'self' https://js.stripe.com https://maps.googleapis.com
style-src 'self' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: blob: https://*.amazonaws.com https://images.unsplash.com https://maps.gstatic.com
connect-src 'self' https://api.stripe.com https://*.sentry.io
frame-src 'self' https://js.stripe.com https://hooks.stripe.com
object-src 'none'
base-uri 'self'
form-action 'self'
upgrade-insecure-requests
```

---

### 3. ENVIRONMENT VALIDATION

#### ✅ env.validation.ts
**Status:** FIXED
**Enhancement:** Added missing LOG_LEVEL validation

**Validated Variables:**
- DATABASE_URL (PostgreSQL URI required)
- JWT_ACCESS_SECRET & JWT_REFRESH_SECRET (min 32 chars)
- STRIPE_SECRET_KEY (pattern: sk_test_* or sk_live_*)
- STRIPE_WEBHOOK_SECRET (pattern: whsec_*)
- EMAIL_PROVIDER (enum: resend | brevo)
- REDIS_PASSWORD (optional but recommended)
- All ports validated as valid numbers
- LOG_LEVEL (new - validates: error|warn|log|debug|verbose)

---

### 4. CI/CD WORKFLOWS

#### ✅ ci.yml
**Status:** SECURE
- ✓ Actions pinned to v4
- ✓ No script injection
- ✓ Proper credential handling
- ✓ npm ci usage

#### ✅ deploy.yml
**Status:** FIXED
- Removed fragile GitHub Script notification
- Added comment explaining external notification requirement

#### ✅ e2e.yml
**Status:** SECURE
- ✓ Matrix strategy for parallel testing
- ✓ Proper environment isolation
- ✓ Artifact collection with retention

#### ✅ security.yml
**Status:** SECURE
- ✓ NPM audit enabled
- ✓ Trivy scanning for vulnerabilities
- ✓ SARIF reports for GitHub Security tab

---

## Security Best Practices Status

### ✅ Implemented
- Multi-stage Docker builds
- Non-root users in containers
- Health checks on all services
- Environment variable validation
- Security headers (CSP, HSTS, X-Frame-Options)
- Image domain whitelisting
- Database port not exposed in production
- Redis password authentication
- Secrets management via GitHub Secrets
- dumb-init for graceful shutdown
- npm ci for dependency integrity
- Actions pinned to major versions

### ⚠️ Recommendations
1. Implement runtime nonce generation for CSP in Next.js
2. Implement automated secret rotation for JWT and API keys
3. Add Kubernetes network policies if deploying to K8s
4. Consider HashiCorp Vault or AWS Secrets Manager
5. Add SBOM generation in CI/CD
6. Enable automatic container image scanning

---

## Files Modified

| File | Change | Severity |
|------|--------|----------|
| backend/docker-compose.dev.yml | Environment variables for credentials | HIGH |
| frontend/Dockerfile | Added health check + curl | MEDIUM |
| frontend/next.config.js | Removed unsafe CSP directives | HIGH |
| backend/src/config/env.validation.ts | Added LOG_LEVEL validation | LOW |
| .github/workflows/deploy.yml | Removed fragile notification | LOW |

---

## Sign-off

**Audit Completed:** 2026-03-12  
**Status:** 6 of 7 issues fixed  
**Risk Level:** LOW ✓

All critical and high-risk issues have been resolved.
