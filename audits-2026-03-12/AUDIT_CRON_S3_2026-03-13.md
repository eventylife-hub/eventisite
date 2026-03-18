# Backend Audit: Cron Jobs & S3 Service
**Date:** 2026-03-13
**Scope:** Cron jobs, S3 service, and export functionality
**Status:** ✅ No CRITICAL issues found

---

## 1. CRON SERVICE AUDIT

### File: `/backend/src/modules/cron/cron.service.ts`

#### ✅ STRENGTHS

**Error Handling (PASS)**
- All 6 cron jobs wrapped in try/catch blocks
- Proper error logging with `this.logger.error()` in catch blocks
- Failed jobs recorded via `createFailedJobRun()` utility with error message
- Individual task errors caught with warning logs (handleNoGoCheck, handlePayoutCompute, handleDocsReminder) allowing job continuation

**Logging (PASS)**
- Structured logging with NestJS Logger (not console.log)
- Job execution results logged at INFO level
- Specific metrics logged (counts, timestamps)
- Security: No sensitive data logged
- Warnings logged for individual failures with context

**Pagination Limits (PASS)**
- `handleNoGoCheck`: pageSize = 50, processes in chunks (loop with skip/take)
- `handlePayoutCompute`: take = 500 with explicit security comment
- `handleDocsReminder`: pageSize = 100, processes in chunks
- No unbounded queries found; all handle EOF gracefully

**Race Conditions (PASS)**
- `handleHoldExpiry`: Uses atomic `updateMany()` with WHERE conditions (TOCTOU-safe)
  - Single query with all business logic conditions prevents payment-arrival race
- `handleNoGoCheck`: Conditional update with status guard (`status: { in: ['PUBLISHED', 'SALES_OPEN'] }`)
- `handleBlockExpiry`: Atomic `updateMany()` with status + time conditions
- Uses updateMany instead of findMany + updateMany pattern (avoids classic race)

**Timeouts (WARN - Low Priority)**
- No explicit timeout configuration on NestJS @Cron decorators
- Default NestJS scheduler has implicit timeouts but not documented in code
- **Recommendation:** Add Nest's `SCHEDULE_MODULE_DEFAULT_MAX_RETRIES` if scheduler hangs occur (currently not a CRITICAL issue)

#### ⚠️ FINDINGS

1. **Minor:** `handleHoldExpiry` (line 81) logs generic error without distinguishing from other jobs
   - Low impact - error recorded in DB via JobRun

2. **Minor:** `handleDataRetention` only soft-deletes FileAssets, doesn't actually delete from S3
   - Design decision acknowledged (cleanup is separate concern)
   - **Note:** Data retention job only marks `deletedAt` in DB; hard deletion should be separate cron or manual process

---

## 2. S3 SERVICE AUDIT

### File: `/backend/src/modules/uploads/s3.service.ts`

#### ✅ STRENGTHS

**Presigned URL Expiry (PASS)**
- Upload URLs: 3600 seconds (1 hour) - good default
- Download URLs: configurable via parameter, default 3600 seconds
- Constants defined in `business.constants.ts`: `S3_PRESIGNED_URL_EXPIRY_SECONDS: 3600`
- Validation on download URLs: regex check on key format (line 61-65) prevents arbitrary paths

**File Type Validation (PASS)**
- ContentType passed through and validated at S3 level
- Integration with uploads service which validates MIME types and magic bytes
- ServerSideEncryption: AES256 enabled on all uploads

**Error Handling (PASS)**
- All S3 operations wrapped in try/catch
- Errors logged without exposing AWS credentials or internal paths (line 49, 87, 102, 154)
- Returns generic InternalServerErrorException to client (not AWS error details)
- `getObjectRange()` returns null on error instead of throwing (graceful degradation)
- `headObject()` correctly distinguishes NotFound vs other errors

**S3 Key Validation (PASS)**
- Download URL generation validates key format with regex: `/^uploads\/[a-f0-9-]+\/\d+-[a-f0-9]{8}\.[a-z0-9]+$/`
- Prevents path traversal and arbitrary file access
- Filename sanitization enforces attachment disposition to prevent inline execution

**Bucket Name Handling (PASS)**
- Not hardcoded; retrieved from ConfigService
- Validated via Joi schema in env.validation.ts
- Required environment variable (will fail on startup if missing)

#### 🔍 OBSERVATIONS

1. **S3 Key Format:** Keys follow pattern `uploads/{userId}/{timestamp}-{uuid8}.{ext}`
   - Structured and traceable
   - User isolation enforced via directory structure

2. **Filename Sanitization (line 70-72):**
   - Replaces non-alphanumeric chars with underscore
   - Encodes filename for RFC 5987 UTF-8 compliance
   - Prevents path traversal

3. **Magic Bytes Validation:** Deferred to uploads service (not S3 service responsibility)

---

## 3. UPLOADS SERVICE AUDIT

### File: `/backend/src/modules/uploads/uploads.service.ts`

#### ✅ STRENGTHS

**File Type Validation (PASS)**
- Comprehensive MIME type config with max size limits per type
- Size validation: checks `sizeBytes > config.maxSizeBytes` before upload (line 96-100)
- Extension validation: matches declared MIME type extensions (line 127-132)
- Prevents double extensions: regex `/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/` (line 121)

**Magic Bytes Validation (PASS)**
- Validates actual file content against declared type (not just extension)
- Reads first 16 bytes from S3 and checks signatures
- Supports: JPEG, PNG, WebP, PDF, MP4
- Rejects files with mismatched content (calls `deleteObject()` cleanup on mismatch)
- Graceful fallback if magic byte validation fails (logs warning but doesn't block)

**Path Traversal Protection (PASS)**
- Normalizes filename with `path.normalize()` (line 104)
- Rejects absolute paths and parent references (line 107-109)
- Extracts only basename (line 112) - prevents directory injection
- Validation regex ensures single extension only

**Error Handling (PASS)**
- User upload errors throw BadRequestException (no internal details leaked)
- S3 errors caught and logged safely
- Forbidden access returns ForbiddenException with clear message
- Magic byte validation failures logged with sanitized details

**Idempotency (PASS)**
- If `clientUploadId` provided, checks for existing asset (line 135-158)
- Returns same asset if upload is retried
- Prevents duplicate file creation on network retry

**Deletion Safety (PASS)**
- DB deletion happens first (line 308)
- S3 deletion is best-effort (line 312-319) to avoid orphaned DB records
- Separate soft delete method for non-destructive cleanup

#### ⚠️ MINOR FINDINGS

1. **Line 241:** `this.logger.warn()` message for magic byte validation could include file extension for debugging
   - Low impact - debug logging is already sanitized

---

## 4. EXPORTS SERVICE AUDIT

### File: `/backend/src/modules/exports/exports.service.ts`

#### ✅ STRENGTHS

**Export Expiry (PASS)**
- Exports expire after 24 hours (EXPORTS.VALIDITY_HOURS constant)
- Expiration checked before status verification (line 224-233) - TOCTOU-safe
- Automatic marking of expired exports in listExports (line 139-144)
- Regenerate operation uses status guard (line 303-306) to prevent double-regeneration

**File Size Limits (PASS)**
- No explicit size limit in exports service
- **Note:** Exports are simulated in MVP (no actual file generation)
- **Production:** File size limits should be defined when async generation implemented

**Cleanup of Old Exports (WARN)**
- No automatic cleanup visible in exports service
- **Gap:** Old exports remain in DB indefinitely after expiration
- **Recommendation:** Implement cron job to hard-delete expired exports after X days

**S3 Presigned URL Security (PASS)**
- Uses `EXPORTS.S3_PRESIGNED_URL_EXPIRY_SECONDS` constant (3600 seconds = 1 hour)
- Separate from export expiry (24h) - URLs expire faster than exports
- Fallback to filePath if S3 fails (line 244-255)

**Access Control (PASS)**
- Ownership verification: `exportLog.createdBy !== userId && !isAdmin` (line 218, 294)
- Role-based access: checks `isAdminRole()` function
- PII filtering in listExports (line 155-163) - non-admins see "Another admin" instead of creator details

#### ⚠️ FINDINGS

1. **Export File Size Limits - MISSING:**
   - Currently no size limit check in exports service
   - Could allow disk exhaustion if export generation creates huge files
   - **Recommendation:** Add max file size constant (e.g., 100MB) and validate when generating exports
   - **Priority:** Medium (only impacts MVP testing)

2. **Cleanup Missing:**
   - Expired exports stay in database permanently
   - **Recommendation:** Add cron job to delete exports > 30 days old
   - **Pattern:** Similar to `handleDataRetention` in cron service

3. **MVP Simulation (line 83-94):**
   - File not actually generated; filePath just simulated
   - Production will need Bull/BullMQ async job queue
   - **Note:** Not an issue - documented in comments

---

## 5. CRON MULTIPLE INSTANCE PROTECTION

### Issue: Race Conditions with Distributed Cron

**Current Implementation:**
- Uses NestJS `@Cron` scheduler (in-memory, single instance)
- **No distributed lock mechanism** (NestJS default)

**Risk Assessment:**
- If deployed with multiple instances, cron jobs may run in parallel
- Could cause double-processing of holds, no-go checks, payouts

**Findings:**
- Uses atomic DB operations for state changes (`updateMany` with WHERE guards)
- **Mitigation:** Atomic operations prevent duplicate state changes even if jobs run twice
- Examples:
  - `handleHoldExpiry`: Only expires holds not yet expired
  - `handleBlockExpiry`: Only expires blocks with status 'INVITE_SENT'
  - `handleNoGoCheck`: Only updates travels still in PUBLISHED/SALES_OPEN status

**Recommendation for Multi-Instance Deployment:**
- Add distributed lock library: `@nestjs/locksmith` or `redlock`
- Or use database-level pessimistic locking via Prisma's `findUniqueOrThrow` + transaction
- **Current:** Safe for single-instance deployments (which is MVP status)

---

## CRITICAL ISSUES FOUND
✅ **NONE** - All critical security and reliability checks pass

---

## SUMMARY TABLE

| Component | Check | Status | Notes |
|-----------|-------|--------|-------|
| **Cron Service** | Error Handling | ✅ PASS | Try/catch + DB logging |
| | Logging | ✅ PASS | Structured, no PII |
| | Pagination | ✅ PASS | All jobs use pagination with limits |
| | Race Conditions | ✅ PASS | Atomic updateMany operations |
| | Timeouts | ⚠️ OK | Default NestJS timeouts (not critical) |
| **S3 Service** | Presigned URL Expiry | ✅ PASS | 3600s default, validated |
| | File Type Validation | ✅ PASS | MIME + magic bytes |
| | Error Handling | ✅ PASS | No credential leaks |
| | Hardcoded Buckets | ✅ PASS | ConfigService, not hardcoded |
| **Uploads Service** | File Type Validation | ✅ PASS | MIME + magic bytes + extension |
| | Path Traversal | ✅ PASS | Normalized + basename extraction |
| | Error Handling | ✅ PASS | Safe logging |
| | Deletion Safety | ✅ PASS | DB-first strategy |
| **Exports Service** | Expiry Validation | ✅ PASS | TOCTOU-safe check |
| | S3 URL Security | ✅ PASS | 3600s expiry |
| | File Size Limits | ⚠️ WARN | Missing (MVP only) |
| | Cleanup | ⚠️ WARN | Missing automated cleanup |
| | Access Control | ✅ PASS | Ownership + role-based |

---

## RECOMMENDATIONS FOR PRODUCTION

### High Priority (Before Prod)
1. Implement cron job for export cleanup (delete expired exports after 30 days)
2. Add export file size limits constant and validation
3. Add distributed lock mechanism if multi-instance deployment planned

### Medium Priority (Before Scale)
4. Implement async file generation for exports (Bull/BullMQ)
5. Add monitoring/alerting for failed cron jobs
6. Add explicit timeout configuration to cron decorators

### Low Priority (Nice to Have)
7. Add more granular error logging in cron jobs (distinguish by error type)
8. Implement export file format validation before S3 upload

---

**Audit Completed By:** Claude Code
**Next Review:** After production deployment or architectural changes
