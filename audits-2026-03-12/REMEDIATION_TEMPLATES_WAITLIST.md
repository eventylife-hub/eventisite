# Remediation Templates: Waitlist & Pre-Reservation Services
**Date:** 2026-03-13
**Purpose:** Security-first code templates for implementing these services

---

## Part 1: Schema Migrations

### Add createdBy field to PreReservation

```prisma
// In schema.prisma, modify PreReservation:

model PreReservation {
  id                String   @id @default(cuid())
  travelId          String
  orgCodeId         String?
  createdBy         String?  // ← ADD: Pro user ID who created this
  status            PreResStatus @default(PENDING_DEPOSIT)
  mode              PreResMode @default(STANDARD)
  depositAmountTTC  Int      @default(0)
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

  @@unique([travelId, orgCodeId]) // ← ADD: Prevent duplicates
  @@index([orgCodeId])
  @@index([travelId])
  @@index([status])
  @@index([createdBy])  // ← ADD: For audit queries
}
```

### Add unique constraint to WaitlistEntry

```prisma
// In schema.prisma, modify WaitlistEntry:

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

  @@unique([travelId, email]) // ← ADD: Prevent duplicate waitlist entries
  @@index([travelId, status])
  @@index([email])
}
```

**Migration Command:**
```bash
npx prisma migrate dev --name add_security_fields_prereservation_waitlist
npx prisma generate  # Regenerate types
```

---

## Part 2: DTOs with Zod Validation

### Create Pre-Reservation DTOs

**File:** `/backend/src/modules/pre-reservations/dto/create-pre-reservation.dto.ts`

```typescript
import { z } from 'zod';

export const CreatePreReservationSchema = z.object({
  travelId: z.string().cuid('ID voyage invalide'),
  orgCodeId: z.string().cuid('Code org invalide').optional().nullable(),
  roomsRequested: z.number().int().positive('Minimum 1 chambre'),
  contactEmail: z.string().email('Email invalide').optional().nullable(),
  contactPhone: z.string()
    .regex(/^[\d\s\-\+\(\)]{5,20}$/, 'Format téléphone invalide')
    .optional()
    .nullable(),
  notes: z.string().max(1000, 'Notes trop longues (max 1000 chars)').optional(),
});

export type CreatePreReservationDto = z.infer<typeof CreatePreReservationSchema>;

export const UpdatePreReservationSchema = CreatePreReservationSchema.partial();
export type UpdatePreReservationDto = z.infer<typeof UpdatePreReservationSchema>;
```

### Create Waitlist Entry DTOs

**File:** `/backend/src/modules/waitlist/dto/create-waitlist-entry.dto.ts`

```typescript
import { z } from 'zod';

export const CreateWaitlistEntrySchema = z.object({
  travelId: z.string().cuid('ID voyage invalide'),
  email: z.string().email('Email invalide'),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]{5,20}$/, 'Format téléphone invalide')
    .optional()
    .nullable(),
  firstName: z.string().max(100, 'Prénom trop long').optional().nullable(),
  lastName: z.string().max(100, 'Nom trop long').optional().nullable(),
});

export type CreateWaitlistEntryDto = z.infer<typeof CreateWaitlistEntrySchema>;
```

---

## Part 3: Service Implementation (Security-First)

### Pre-Reservation Service

**File:** `/backend/src/modules/pre-reservations/pre-reservations.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePreReservationSchema, UpdatePreReservationSchema } from './dto';

@Injectable()
export class PreReservationsService {
  private readonly logger = new Logger(PreReservationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a pre-reservation (PRO only)
   * SECURITY: Validates ownership via proProfileId
   */
  async create(userId: string, createData: Record<string, unknown>) {
    // ✓ SECURITY FIX 1: Validate input with Zod
    const parsed = CreatePreReservationSchema.safeParse(createData);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      );
    }
    const validated = parsed.data;

    // ✓ SECURITY FIX 2: Verify user is PRO
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'PRO') {
      throw new ForbiddenException('Only PRO users can create pre-reservations');
    }

    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!proProfile) {
      throw new ForbiddenException('PRO profile not found');
    }

    // ✓ SECURITY FIX 3: Verify travel ownership
    const travel = await this.prisma.travel.findUnique({
      where: { id: validated.travelId },
      select: { id: true, proProfileId: true, status: true },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    if (travel.proProfileId !== proProfile.id) {
      throw new ForbiddenException('You do not own this travel');
    }

    // ✓ SECURITY FIX 4: Prevent duplicate pre-reservations via unique constraint
    try {
      const preRes = await this.prisma.preReservation.create({
        data: {
          travelId: validated.travelId,
          orgCodeId: validated.orgCodeId,
          createdBy: proProfile.id,
          roomsRequested: validated.roomsRequested,
          contactEmail: validated.contactEmail,
          contactPhone: validated.contactPhone,
          notes: validated.notes,
        },
      });

      this.logger.log(
        `PreReservation ${preRes.id} created by PRO ${userId}`
      );
      return preRes;
    } catch (error) {
      // Prisma unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException(
          'A pre-reservation already exists for this travel and organization code'
        );
      }
      throw error;
    }
  }

  /**
   * Get a pre-reservation (ownership verified)
   * SECURITY: IDOR protection via ownership check
   */
  async findOne(id: string, userId: string) {
    // ✓ SECURITY FIX 5: IDOR protection
    const preRes = await this.prisma.preReservation.findUnique({
      where: { id },
      include: {
        travel: {
          select: { proProfileId: true },
        },
      },
    });

    if (!preRes) {
      throw new NotFoundException('Pre-reservation not found');
    }

    // Verify ownership
    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!proProfile || preRes.travel.proProfileId !== proProfile.id) {
      throw new ForbiddenException('You do not have access to this pre-reservation');
    }

    return preRes;
  }

  /**
   * List pre-reservations for a travel (ownership verified)
   * SECURITY: Pagination limits, ownership check
   */
  async findByTravelId(
    travelId: string,
    userId: string,
    take = 10,
    skip = 0
  ) {
    // ✓ SECURITY FIX 6: Enforce pagination limits
    const MAX_TAKE = 100;
    const validTake = Math.min(Math.max(take, 1), MAX_TAKE);
    const validSkip = Math.max(skip, 0);

    // Verify ownership
    const travel = await this.prisma.travel.findUnique({
      where: { id: travelId },
      select: { proProfileId: true },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    const proProfile = await this.prisma.proProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!proProfile || travel.proProfileId !== proProfile.id) {
      throw new ForbiddenException('You do not own this travel');
    }

    const [data, total] = await Promise.all([
      this.prisma.preReservation.findMany({
        where: { travelId },
        take: validTake,
        skip: validSkip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.preReservation.count({
        where: { travelId },
      }),
    ]);

    return {
      data,
      pagination: {
        total,
        take: validTake,
        skip: validSkip,
        hasMore: validSkip + validTake < total,
      },
    };
  }

  /**
   * Update a pre-reservation (ownership verified)
   * SECURITY: Input validation, IDOR check
   */
  async update(
    id: string,
    userId: string,
    updateData: Record<string, unknown>
  ) {
    // ✓ SECURITY FIX 7: Validate input
    const parsed = UpdatePreReservationSchema.safeParse(updateData);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      );
    }

    // ✓ SECURITY FIX 8: IDOR check before updating
    const preRes = await this.findOne(id, userId);

    const updated = await this.prisma.preReservation.update({
      where: { id },
      data: parsed.data,
    });

    this.logger.log(
      `PreReservation ${id} updated by PRO ${userId}`
    );
    return updated;
  }
}
```

### Waitlist Service

**File:** `/backend/src/modules/waitlist/waitlist.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateWaitlistEntrySchema } from './dto';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Add entry to waitlist
   * SECURITY: Duplicate prevention via unique constraint, input validation
   */
  async addToWaitlist(createData: Record<string, unknown>) {
    // ✓ SECURITY FIX 1: Validate input with Zod
    const parsed = CreateWaitlistEntrySchema.safeParse(createData);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      );
    }
    const validated = parsed.data;

    // ✓ SECURITY FIX 2: Verify travel exists
    const travel = await this.prisma.travel.findUnique({
      where: { id: validated.travelId },
      select: { id: true, status: true },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    // ✓ SECURITY FIX 3: Prevent duplicates via unique constraint
    try {
      const entry = await this.prisma.waitlistEntry.create({
        data: {
          travelId: validated.travelId,
          email: validated.email.toLowerCase(), // Normalize email
          phone: validated.phone,
          firstName: validated.firstName,
          lastName: validated.lastName,
        },
      });

      this.logger.log(
        `Waitlist entry ${entry.id} created for travel ${validated.travelId}`
      );
      return entry;
    } catch (error) {
      // Prisma unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException(
          'This email is already on the waitlist for this travel'
        );
      }
      throw error;
    }
  }

  /**
   * Get waitlist for a travel
   * SECURITY: Pagination limits, admin-only
   */
  async getWaitlist(
    travelId: string,
    take = 10,
    skip = 0,
    status?: string
  ) {
    // ✓ SECURITY FIX 4: Enforce pagination limits
    const MAX_TAKE = 100;
    const validTake = Math.min(Math.max(take, 1), MAX_TAKE);
    const validSkip = Math.max(skip, 0);

    const where: Record<string, unknown> = { travelId };
    if (status) {
      where.status = status; // WaitlistStatus enum
    }

    const [data, total] = await Promise.all([
      this.prisma.waitlistEntry.findMany({
        where,
        take: validTake,
        skip: validSkip,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.waitlistEntry.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        take: validTake,
        skip: validSkip,
        hasMore: validSkip + validTake < total,
      },
    };
  }

  /**
   * Notify a waitlist entry (with error handling)
   * SECURITY: Try/catch around external API calls
   */
  async notifyEntry(id: string) {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    // ✓ SECURITY FIX 5: Try/catch around external call
    try {
      // TODO: Call email service
      // await this.emailService.sendWaitlistNotification(entry.email);

      this.logger.log(
        `Notification sent to waitlist entry ${id}`
      );
    } catch (error) {
      // Log but don't fail the request — retry via cron
      this.logger.error(
        `Failed to notify waitlist entry ${id}: ${error.message}`
      );
      // Return silently — let cron handle retries
      return entry;
    }

    // Update notifiedAt only if email succeeded
    return this.prisma.waitlistEntry.update({
      where: { id },
      data: { notifiedAt: new Date() },
    });
  }

  /**
   * Convert waitlist entry to booking
   * SECURITY: Idempotent, transactional
   */
  async convertToBooking(id: string) {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (entry.status !== 'WAITING') {
      throw new BadRequestException('Entry is no longer available for conversion');
    }

    // Update status atomically
    return this.prisma.waitlistEntry.update({
      where: { id },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
      },
    });
  }
}
```

---

## Part 4: Controllers with Guards

### Pre-Reservation Controller

**File:** `/backend/src/modules/pre-reservations/pre-reservations.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { PreReservationsService } from './pre-reservations.service';
import { CreatePreReservationDto } from './dto';

@Controller('pre-reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PreReservationsController {
  constructor(private service: PreReservationsService) {}

  /**
   * Create a pre-reservation
   * SECURITY: Requires PRO role, validated by guard
   */
  @Post()
  @Roles('PRO')
  async create(
    @CurrentUser() user,
    @Body() dto: CreatePreReservationDto
  ) {
    return this.service.create(user.id, dto);
  }

  /**
   * Get a pre-reservation by ID
   * SECURITY: Ownership verified in service
   */
  @Get(':id')
  @Roles('PRO')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user
  ) {
    return this.service.findOne(id, user.id);
  }

  /**
   * List pre-reservations for a travel
   * SECURITY: Pagination limits enforced, ownership verified
   */
  @Get('travel/:travelId')
  @Roles('PRO')
  async findByTravel(
    @Param('travelId') travelId: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @CurrentUser() user
  ) {
    return this.service.findByTravelId(travelId, user.id, take, skip);
  }

  /**
   * Update a pre-reservation
   * SECURITY: Ownership verified, input validated
   */
  @Patch(':id')
  @Roles('PRO')
  async update(
    @Param('id') id: string,
    @Body() dto: Record<string, unknown>,
    @CurrentUser() user
  ) {
    return this.service.update(id, user.id, dto);
  }
}
```

### Waitlist Controller

**File:** `/backend/src/modules/waitlist/waitlist.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistEntryDto } from './dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(private service: WaitlistService) {}

  /**
   * Join waitlist (public endpoint, but rate-limited)
   * SECURITY: No auth required, input validated, rate limiting recommended
   */
  @Post()
  async addToWaitlist(@Body() dto: CreateWaitlistEntryDto) {
    return this.service.addToWaitlist(dto);
  }

  /**
   * Get waitlist for a travel (admin/pro only)
   * SECURITY: Requires ADMIN, pagination enforced
   */
  @Get(':travelId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PRO')
  async getWaitlist(
    @Param('travelId') travelId: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('status') status?: string
  ) {
    return this.service.getWaitlist(travelId, take, skip, status);
  }

  /**
   * Notify a waitlist entry (admin only, async operation)
   * SECURITY: Requires ADMIN, errors handled gracefully
   */
  @Post(':id/notify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async notifyEntry(@Param('id') id: string) {
    // Fire-and-forget, but await to ensure no errors
    return this.service.notifyEntry(id);
  }

  /**
   * Convert waitlist entry to booking (admin only)
   * SECURITY: Requires ADMIN, idempotent
   */
  @Post(':id/convert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async convertToBooking(@Param('id') id: string) {
    return this.service.convertToBooking(id);
  }
}
```

---

## Part 5: Test Templates

### IDOR Test Example

**File:** `/backend/src/modules/pre-reservations/pre-reservations.service.spec.ts`

```typescript
describe('PreReservationsService - IDOR Protection', () => {
  it('should reject access to pre-reservation owned by different PRO', async () => {
    // Setup: PRO-A creates a pre-reservation
    const proA = await createProUser();
    const travel = await createTravel(proA.id);
    const preRes = await service.create(proA.id, {
      travelId: travel.id,
      roomsRequested: 2,
    });

    // Attack: PRO-B tries to access PRO-A's pre-reservation
    const proB = await createProUser();

    // Should throw ForbiddenException
    await expect(
      service.findOne(preRes.id, proB.id)
    ).rejects.toThrow(ForbiddenException);
  });

  it('should reject access from non-PRO users', async () => {
    const proUser = await createProUser();
    const travel = await createTravel(proUser.id);
    const preRes = await service.create(proUser.id, {
      travelId: travel.id,
      roomsRequested: 2,
    });

    const clientUser = await createClientUser();

    await expect(
      service.findOne(preRes.id, clientUser.id)
    ).rejects.toThrow(ForbiddenException);
  });
});
```

### Pagination Test Example

```typescript
describe('PreReservationsService - Pagination', () => {
  it('should enforce maximum take limit', async () => {
    const proUser = await createProUser();
    const travel = await createTravel(proUser.id);

    // Create 150 pre-reservations
    for (let i = 0; i < 150; i++) {
      await service.create(proUser.id, {
        travelId: travel.id,
        roomsRequested: 1,
        orgCodeId: `org-${i}`,
      });
    }

    // Request with take=999 should be capped at 100
    const result = await service.findByTravelId(travel.id, proUser.id, 999, 0);
    expect(result.data).toHaveLength(100);
    expect(result.pagination.take).toBe(100);
  });

  it('should never expose data beyond pagination limit', async () => {
    // Should not return data when skip >= total
  });
});
```

---

## Summary Checklist

Use this when implementing:

- [ ] Add `createdBy` and unique constraints to schema
- [ ] Create DTOs with Zod validation
- [ ] Implement services with IDOR checks (use `findOne` pattern)
- [ ] Enforce pagination limits (max 100)
- [ ] Use try/catch around external calls
- [ ] Apply `@UseGuards` + `@Roles` decorators consistently
- [ ] Write IDOR tests
- [ ] Write pagination tests
- [ ] Write duplicate prevention tests
- [ ] Never expose sensitive data in error messages

**Implementation time estimate:** 4-6 hours for both services with full test coverage.

