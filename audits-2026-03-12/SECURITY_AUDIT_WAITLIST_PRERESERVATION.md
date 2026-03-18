# Security Audit: Waitlist & Pre-Reservation Services
**Date:** 2026-03-13
**Status:** MODELS DEFINED — SERVICES NOT YET IMPLEMENTED
**Risk Level:** HIGH (models exist without protective services)

---

## Executive Summary

The audit reveals that **PreReservation** and **WaitlistEntry** data models are defined in the Prisma schema but **NO SERVICE LAYER EXISTS** to manage them. This represents a critical gap:

- **Models in schema.prisma:** ✓ Defined (lines 1606-1680+)
- **Services:** ✗ NOT FOUND in backend/src/modules
- **Controllers:** ✗ NO endpoints exposed
- **Tests:** ✗ NO test coverage

**Risk Level: HIGH** — If services are added in the future without security controls, multiple vulnerabilities are likely.

---

## Models Audit

### 1. PreReservation Model
**Location:** `/backend/prisma/schema.prisma` (line ~1606)

```prisma
model PreReservation {
  id                String   @id @default(cuid())
  travelId          String
  orgCodeId         String?  // Organization code (for groups/associations)
  status            PreResStatus @default(PENDING_DEPOSIT)
  mode              PreResMode @default(STANDARD)
  depositAmountTTC  Int      @default(0) // Amount in cents
  holdExpiresAt     DateTime?
  roomsRequested    Int
  roomsConfirmed    Int      @default(0)
  contactEmail      String?  @db.VarChar(255)
  contactPhone      String?  @db.VarChar(20)
  notes             String?  @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  travel            Travel   @relation(fields: [travelId], references: [id], onDelete: Cascade)
  preResRoomAssignments PreResRoomAssignment[]

  @@index([orgCodeId])
  @@index([travelId])
  @@index([status])
}
```

**Schema Issues Identified:**

| Issue | Severity | Details |
|-------|----------|---------|
| No user/owner field | CRITICAL | Cannot verify ownership — IDOR vulnerability waiting to happen |
| depositAmountTTC exposed | HIGH | Financial data not encrypted; accessible to unauthorized users |
| orgCodeId indexing | HIGH | Could enable enumeration attacks if service doesn't validate |
| No createdBy/updatedBy | HIGH | Audit trail missing for financial records |
| No soft-delete flag | MEDIUM | Permanent deletes make compliance audits harder |

---

### 2. WaitlistEntry Model
**Location:** `/backend/prisma/schema.prisma` (line ~1647)

```prisma
model WaitlistEntry {
  id                String   @id @default(cuid())
  travelId          String
  email             String   @db.VarChar(255)
  phone             String?  @db.VarChar(20)
  firstName         String?  @db.VarChar(100)
  lastName          String?  @db.VarChar(100)
  status            WaitlistStatus @default(WAITING)
  notifiedAt        DateTime?
  convertedAt       DateTime?
  createdAt         DateTime @default(now())

  travel            Travel   @relation(fields: [travelId], references: [id], onDelete: Cascade)

  @@index([travelId, status])
  @@index([email])
}
```

**Schema Issues Identified:**

| Issue | Severity | Details |
|-------|----------|---------|
| No deduplication safeguard | HIGH | Same email can register multiple times for same travel |
| Email index alone | MEDIUM | Could enable enumeration — unknown if service validates |
| No user linkage | MEDIUM | Waitlist tied to email only, not authenticated user |
| Phone PII unencrypted | HIGH | Sensitive data stored in plaintext |
| No notification tracking | MEDIUM | No way to verify who was notified about what |

---

## Critical Vulnerabilities (if services are created without safeguards)

### CRITICAL-1: Insecure Direct Object Reference (IDOR) — PreReservation

**Risk:** Any authenticated user could access/modify pre-reservations they don't own.

```typescript
// VULNERABLE CODE (example of what might be written):
async getPreReservation(id: string, userId: string) {
  // ❌ Missing ownership check
  return this.prisma.preReservation.findUnique({
    where: { id }
  });
}

// ATTACK: User A calls GET /pre-reservations/xyz (created by User B)
// → Returns full financial details including depositAmountTTC
```

**Fix Template:**
```typescript
async getPreReservation(id: string, userId: string) {
  const preRes = await this.prisma.preReservation.findUnique({
    where: { id },
    include: {
      travel: {
        select: { proProfileId: true }
      }
    }
  });

  if (!preRes) throw new NotFoundException();

  // ✓ Verify ownership via travel.proProfileId
  const proProfile = await this.prisma.proProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!proProfile || preRes.travel.proProfileId !== proProfile.id) {
    throw new ForbiddenException('Access denied');
  }

  return preRes;
}
```

---

### CRITICAL-2: Missing Idempotency on Create

**Risk:** Duplicate pre-reservations or waitlist entries created for same entity.

```typescript
// VULNERABLE (example):
async createPreReservation(travelId: string, dto: CreatePreResDto) {
  // ❌ No check if already exists
  return this.prisma.preReservation.create({
    data: { travelId, ...dto }
  });
}

// ATTACK: Submit twice due to network retry → 2 reservations created
```

**Required Protections:**
- Unique constraint on `(travelId, orgCodeId)` or similar
- Idempotency key validation on create endpoints
- Transactional check-then-create pattern

**Schema Fix Needed:**
```prisma
model PreReservation {
  // ... existing fields ...

  @@unique([travelId, orgCodeId]) // Prevent duplicates
}
```

---

### CRITICAL-3: Financial Data Exposure in Error Messages

**Risk:** Deposit amounts, pricing leakage through error responses.

```typescript
// VULNERABLE (example):
try {
  // Process payment
} catch (e) {
  // ❌ Returns full entity with depositAmountTTC
  throw new BadRequestException(
    `Pre-reservation update failed: ${JSON.stringify(preRes)}`
  );
}
```

**Fix:**
```typescript
throw new BadRequestException(
  'Unable to update pre-reservation. Contact support if this persists.'
);
```

---

### HIGH-1: Unvalidated Pagination in Bulk Endpoints

**Risk:** If a list endpoint exists without limit validation, attackers could extract all waitlist emails/pre-reservation data.

```typescript
// VULNERABLE (example):
async listPreReservations(travelId: string, skip?: number, take?: number) {
  return this.prisma.preReservation.findMany({
    where: { travelId },
    skip: skip || 0,
    take: take || 10000  // ❌ No max enforced
  });
}

// ATTACK: ?skip=0&take=999999 → dumps all data
```

**Fix:**
```typescript
const PAGINATION_MAX_TAKE = 100;

async listPreReservations(travelId: string, skip = 0, take = 10) {
  const validTake = Math.min(Math.max(take, 1), PAGINATION_MAX_TAKE);

  return this.prisma.preReservation.findMany({
    where: { travelId },
    skip: Math.max(skip, 0),
    take: validTake,
    orderBy: { createdAt: 'desc' }
  });
}
```

---

### HIGH-2: Unchecked External Calls (Email/SMS Notifications)

**Risk:** If services call external notification APIs without try/catch, failures cascade.

```typescript
// VULNERABLE (example):
async notifyWaitlistEntry(entry: WaitlistEntry) {
  // ❌ No error handling
  await this.emailService.send({
    to: entry.email,
    template: 'waitlist-confirmation'
  });

  return this.prisma.waitlistEntry.update({
    where: { id: entry.id },
    data: { notifiedAt: new Date() }
  });
}
```

**Fix:**
```typescript
async notifyWaitlistEntry(entry: WaitlistEntry) {
  try {
    await this.emailService.send({
      to: entry.email,
      template: 'waitlist-confirmation'
    });
  } catch (error) {
    this.logger.error(
      `Failed to notify waitlist entry ${entry.id}`,
      error
    );
    // Don't fail the request — retry via cron/queue
    return entry;
  }

  return this.prisma.waitlistEntry.update({
    where: { id: entry.id },
    data: { notifiedAt: new Date() }
  });
}
```

---

### HIGH-3: Inline Admin Role Checks Without Guard

**Risk:** If admin logic is scattered across services without centralized guards, enforcement is inconsistent.

```typescript
// VULNERABLE (example):
async approvePreReservation(id: string, userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId }
  });

  // ❌ Inline check, not protected by @UseGuards
  if (user.role !== 'ADMIN') {
    throw new ForbiddenException();
  }

  // Logic continues...
}
```

**Fix:**
```typescript
// In controller:
@UseGuards(RolesGuard)
@Roles('ADMIN')
@Post(':id/approve')
async approvePreReservation(@Param('id') id: string) {
  return this.preResService.approvePreReservation(id);
}

// Service trusts the guard:
async approvePreReservation(id: string) {
  // No role check here — guard ensures ADMIN
  return this.prisma.preReservation.update({
    where: { id },
    data: { status: 'APPROVED' }
  });
}
```

---

## Security Checklist for Future Service Implementation

When `WaitlistService` and `PreReservationService` are created, ensure:

### **1. Access Control**
- [ ] All endpoints check user ownership via proProfileId (for PRO)
- [ ] Admin endpoints use `@UseGuards(RolesGuard)` + `@Roles('ADMIN')`
- [ ] No inline role checks — only guards
- [ ] Middleware validates JWT before service execution

### **2. Input Validation**
- [ ] All DTOs validated with Zod/class-validator
- [ ] Pagination: max `take` = 100, default `take` = 10
- [ ] Email format validated (RFC 5321)
- [ ] Phone format validated or rejected
- [ ] Dates: `holdExpiresAt` must be future, not past

### **3. Idempotency**
- [ ] POST /pre-reservations checks for existing `(travelId, orgCodeId)`
- [ ] POST /waitlist checks for existing `(travelId, email)` pair
- [ ] Idempotency-Key header supported for retries

### **4. Error Handling**
- [ ] No sensitive data in error messages
- [ ] No `JSON.stringify(entity)` in exceptions
- [ ] Generic responses: "Operation failed. Contact support."
- [ ] Try/catch around external calls (email, SMS, payment APIs)

### **5. Data Protection**
- [ ] Encrypt PII at rest: email, phone (if required by GDPR)
- [ ] Audit trail: createdBy, updatedBy fields (add to schema)
- [ ] Soft-delete support (add isDeleted flag)
- [ ] No financial data in logs

### **6. Testing**
- [ ] IDOR tests: User A cannot access User B's data
- [ ] Duplicate creation blocked
- [ ] Pagination limits enforced
- [ ] External call failures handled gracefully

---

## Current State by Component

| Component | Status | Location | Risk |
|-----------|--------|----------|------|
| **PreReservation Model** | ✓ Defined | schema.prisma:1606 | HIGH (no service) |
| **WaitlistEntry Model** | ✓ Defined | schema.prisma:1647 | HIGH (no service) |
| **Service Layer** | ✗ Missing | — | CRITICAL |
| **Controllers** | ✗ Missing | — | CRITICAL |
| **Tests** | ✗ Missing | — | N/A |
| **Guards/Middleware** | ✓ Existing | auth/ | GOOD (reusable) |

---

## Recommendations (Priority Order)

### P0 — BLOCKING (Must do before adding services)
1. Add `createdBy` field to PreReservation model (audit trail)
2. Add unique constraint `@@unique([travelId, orgCodeId])` to PreReservation
3. Add unique constraint `@@unique([travelId, email])` to WaitlistEntry
4. Create `RolesGuard` and `OwnershipGuard` utilities (if not already done)

### P1 — HIGH (Required for safe service implementation)
5. Define DTOs with Zod schemas for all Create/Update operations
6. Implement `PreReservationService` with IDOR checks
7. Implement `WaitlistService` with duplicate prevention
8. Add middleware to validate pagination parameters globally

### P2 — MEDIUM (Before production)
9. Add soft-delete support (isDeleted flag + where clauses)
10. Encrypt email/phone fields for GDPR compliance
11. Implement audit logging (who created/updated/deleted)

### P3 — LOW (Post-launch monitoring)
12. Add rate limiting on create endpoints
13. Set up alerts for suspicious bulk operations

---

## Files Affected / To Be Created

### Schema Changes Required
- `/backend/prisma/schema.prisma` — Add createdBy, unique constraints

### Services to Create
- `/backend/src/modules/pre-reservations/pre-reservations.service.ts`
- `/backend/src/modules/pre-reservations/pre-reservations.controller.ts`
- `/backend/src/modules/pre-reservations/dto/*.ts`
- `/backend/src/modules/waitlist/waitlist.service.ts`
- `/backend/src/modules/waitlist/waitlist.controller.ts`
- `/backend/src/modules/waitlist/dto/*.ts`

### Test Files
- `/backend/src/modules/pre-reservations/*.spec.ts`
- `/backend/src/modules/waitlist/*.spec.ts`

---

## Conclusion

**Current Status:** Models defined but unimplemented. **Risk is manageable if security measures are built in from day one.**

Once services are added:
1. **Copy the ownership check pattern** from `travels.service.ts` (lines 265-279)
2. **Use Zod schemas** like `CreateTravelInputSchema` (lines 14-24)
3. **Avoid inline role checks** — use guards consistently
4. **Test IDOR and pagination** before merging

The backend's existing architecture (guards, validation patterns, error handling) is solid. Apply those patterns consistently to these new services.

---

**Audit Completed:** 2026-03-13
**Next Review:** When services are implemented
**Auditor:** Security Audit Agent
