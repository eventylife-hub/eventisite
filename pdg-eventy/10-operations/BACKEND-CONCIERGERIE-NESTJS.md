# Spécification backend NestJS — Conciergerie Eventy

> Date : 2026-05-06 · Branche : claude/quizzical-hopper-20cfdc
> Cf. `AUDIT_CONCIERGERIE_INTERNE_EXTERNE.md` §9 Stack & implémentation
> Frontend déjà livré : `frontend/lib/conciergerie/`, pages 8 portails, tests 83/83.
> Backend repo : `eventy-backend` (submodule), branche : nouvelle `feat/conciergerie`.

---

## Vue d'ensemble

3 modules NestJS livrés conjointement :

| Module | Responsabilité | Tables Prisma |
|--------|----------------|----------------|
| `concierge-requests` | CRUD demandes + routage + SLA enforcement | `ConciergerieDemand`, `ConciergerieMessage`, `ConciergerieAssignment`, `ConciergerieGuardSlot` |
| `concierge-providers` | CRUD sociétés externes + KYC | `ConciergerieProvider`, `ConciergerieProviderKycEvent` |
| `concierge-quality` | Audits + scorecards + mystery shoppers | `QualityAudit`, `QualityCriterionScore`, `MysteryShopperRun` |
| `concierge-reporting` | Rapports + détecteur anomalies + cron | `ConciergerieReport`, `AnomalyAlert` |

Tous les helpers TypeScript (lib/conciergerie/*) sont **partagés** entre
frontend (Next.js) et backend (NestJS) via package monorepo
`@eventy/shared-conciergerie` (à créer).

---

## 1. Module `concierge-requests`

### 1.1 Endpoints REST

```ts
// CRUD demandes
GET    /api/conciergerie/demands              // liste filtrée
GET    /api/conciergerie/demands/:id          // détail
POST   /api/conciergerie/demands              // création par voyageur
PATCH  /api/conciergerie/demands/:id          // update statut

// Actions
POST   /api/conciergerie/demands/:id/ack       // acquittement créateur/indé/ext
POST   /api/conciergerie/demands/:id/forward   // réassignation
POST   /api/conciergerie/demands/:id/messages  // poster message
POST   /api/conciergerie/demands/:id/nps       // soumettre NPS voyageur
POST   /api/conciergerie/demands/:id/resolve   // marquer résolue (créateur/ext)
POST   /api/conciergerie/demands/:id/cancel    // annuler (voyageur)
POST   /api/conciergerie/demands/:id/take-over // équipe prend la main

// Routage
POST   /api/conciergerie/routing/preview       // simulation routage
GET    /api/conciergerie/guard-slots           // liste créneaux garde
POST   /api/conciergerie/guard-slots           // créer créneau
PATCH  /api/conciergerie/guard-slots/:id       // modif (pause, etc.)
DELETE /api/conciergerie/guard-slots/:id       // suppression
```

### 1.2 WebSocket gateway

```ts
// /ws/conciergerie
events:
  - 'demand.created'    → toutes parties prenantes
  - 'demand.ack'        → voyageur + équipe
  - 'demand.message'    → conversation temps réel
  - 'demand.escalated'  → équipe ops
  - 'demand.resolved'   → voyageur (déclenche modal NPS)
  - 'sla.breach.warn'   → équipe
  - 'sla.breach.fired'  → équipe + Slack #conciergerie-alerts
```

### 1.3 Logique métier critique

- **Routing à la création** : appelle `routeDemand()` (helper partagé)
- **SLA enforcement** : cron worker (cf. CRON-CONCIERGERIE.md §1)
- **Validation 2-personnes** : status `pending_dual_approval` → 2 utilisateurs
  Eventy doivent approver via `/dual-approval` workflow (existant audit-trail)
- **Audit-trail** : chaque mutation insère ligne dans `lib/admin/audit-trail.ts`
- **Anti-fraude** : flag AI Claude Sonnet 4.6 si message suspect

### 1.4 Schéma Prisma (extrait)

```prisma
model ConciergerieDemand {
  id                          String   @id @default(cuid())
  travelId                    String
  travel                      Travel   @relation(fields: [travelId], references: [id])
  travelerId                  String
  traveler                    User     @relation("DemandTraveler", fields: [travelerId], references: [id])
  tier                        ConciergerieTier
  category                    ConciergerieCategory
  urgency                     ConciergerieUrgency
  status                      ConciergerieStatus @default(open)
  title                       String
  description                 String   @db.Text
  travelerLanguage            String?
  estimatedCostEur            Float?
  finalCostEur                Float?
  eventyMarginEur             Float?
  externalProviderId          String?
  externalProvider            ConciergerieProvider? @relation(fields: [externalProviderId], references: [id])
  slaResponseDueAt            DateTime
  slaResolutionDueAt          DateTime
  slaResponseBreachedAt       DateTime?
  slaResolutionBreachedAt     DateTime?
  npsScore                    Int?
  npsComment                  String?
  npsReminderSentAt           DateTime?
  requiresDualApproval        Boolean  @default(false)
  approvals                   ConciergerieDualApproval[]
  assignments                 ConciergerieAssignment[]
  messages                    ConciergerieMessage[]
  audits                      QualityAudit[]
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt
  resolvedAt                  DateTime?

  @@index([travelId])
  @@index([status])
  @@index([tier, status])
  @@index([createdAt])
}

enum ConciergerieTier {
  standard
  premium
  luxe
}

enum ConciergerieStatus {
  open
  assigned
  in_progress
  awaiting_traveler
  resolved
  cancelled
  refused
}

model ConciergerieMessage {
  id           String   @id @default(cuid())
  demandId     String
  demand       ConciergerieDemand @relation(fields: [demandId], references: [id])
  authorKind   String
  authorId     String
  authorName   String
  body         String   @db.Text
  attachments  String[]
  aiSuggested  Boolean  @default(false)
  createdAt    DateTime @default(now())

  @@index([demandId])
}

model ConciergerieAssignment {
  id              String   @id @default(cuid())
  demandId        String
  demand          ConciergerieDemand @relation(fields: [demandId], references: [id])
  kind            String   // createur | independant | equipe_eventy | societe_externe | ai_assistant
  assigneeId      String
  displayName     String
  assignedAt      DateTime @default(now())
  acknowledgedAt  DateTime?
  rerouteReason   String?

  @@index([demandId])
  @@index([assigneeId])
}

model ConciergerieGuardSlot {
  id                  String   @id @default(cuid())
  ownerKind           String   // createur | independant
  ownerId             String
  ownerName           String
  travelId            String?
  startAt             DateTime
  endAt               DateTime
  fallbackProviderId  String?
  active              Boolean  @default(true)
  pausedUntil         DateTime?

  @@index([ownerId])
  @@index([active, startAt, endAt])
}
```

### 1.5 RBAC

| Rôle | Lecture | Écriture |
|------|---------|----------|
| Voyageur | Ses demandes | Créer + cancel + NPS |
| Créateur | Demandes de ses voyages | Ack + message + forward + resolve |
| Indépendant | Demandes assignées | Ack + message + resolve |
| Équipe Eventy ops | Toutes | Take-over + tout |
| Admin Eventy | Toutes + config | Tout |
| Société externe | Demandes assignées au provider | Ack + message + resolve + soumettre devis |

Garanti via `Guards` + middleware `roles.guard.ts` existant.

---

## 2. Module `concierge-providers`

### 2.1 Endpoints

```ts
GET    /api/conciergerie/providers
GET    /api/conciergerie/providers/:id
POST   /api/conciergerie/providers              // admin only
PATCH  /api/conciergerie/providers/:id          // admin only
POST   /api/conciergerie/providers/:id/activate // admin (active=true)
POST   /api/conciergerie/providers/:id/kyc      // event KYC
GET    /api/conciergerie/providers/:id/scorecard
```

### 2.2 KYC pipeline

1. Admin invite partenaire (lien magic link Resend)
2. Partenaire upload documents (Kbis, RC Pro, RGPD policy, DPA)
3. Pôle Conformité valide (workflow approbation)
4. KYC `verified` → partenaire peut être activé sur tier(s)
5. Cron renouvellement (cf. CRON-CONCIERGERIE.md §6)

### 2.3 Scorecard partenaire

Calculé en temps réel (pas de cache trop long, max 1h) :
- Note Eventy équipe (manuel)
- Note moyenne créateurs (NPS internes)
- NPS récent voyageurs (sur 30 dernières demandes)
- Volume + coût total
- Verdict moyen audits qualité

---

## 3. Module `concierge-quality`

### 3.1 Endpoints

```ts
GET    /api/conciergerie/audits                  // liste filtrée
GET    /api/conciergerie/audits/:id
POST   /api/conciergerie/audits                  // créer audit
POST   /api/conciergerie/audits/:id/ack          // créateur acquitte audit
POST   /api/conciergerie/audits/:id/contest      // créateur conteste audit (5j)

GET    /api/conciergerie/scorecards/:actorKind/:actorId
GET    /api/conciergerie/scorecards/team-summary // top + underperforming

GET    /api/conciergerie/mystery-runs            // liste runs trimestriels
POST   /api/conciergerie/mystery-runs            // déclencher manuellement
PATCH  /api/conciergerie/mystery-runs/:id        // débriefer + scorer
```

### 3.2 AI scoring assistant

- Quand auditeur ouvre `/equipe/conciergerie-controle-qualite/[id]`
- Backend lance prompt Claude Sonnet 4.6 :
  - Lit la conversation complète
  - Lit les 7 critères + leur description
  - Propose une note initiale 0-5 par critère + commentaire
- Auditeur valide ou ajuste manuellement
- Trace dans `audit.ai_initial_scores` JSON pour comparaison

Coût estimé : ~$0.05 par audit (Sonnet 4.6 input ~3k tokens output ~500 tokens)

### 3.3 Sanctions RH

Workflow distinct :
1. Audit avec verdict `alerte` ou `critique` → trigger automatique
2. Insert dans table `hr_actions` (warn/coaching/suspension/rupture)
3. Notification créateur + RDV planning (Cal.com integration)
4. Acquittement obligatoire dans 7j sinon escalade direction

---

## 4. Module `concierge-reporting`

### 4.1 Endpoints

```ts
POST   /api/conciergerie/reports/generate    // génère rapport pour période
GET    /api/conciergerie/reports/:id         // récup rapport
POST   /api/conciergerie/reports/:id/send    // envoyer au PDG
GET    /api/conciergerie/anomalies           // anomalies actives
PATCH  /api/conciergerie/anomalies/:id/ack   // acquitter anomalie
```

### 4.2 Cron jobs

Tous documentés dans `CRON-CONCIERGERIE.md`. Implémentation NestJS :

```ts
@Injectable()
export class ConciergeCronService {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly slaService: SlaService,
    private readonly slack: SlackNotificationService,
    private readonly resend: ResendEmailService,
  ) {}

  @Cron('*/30 * * * * *')
  async slaWatcher() { /* … */ }

  @Cron('0 8 * * 1', { timeZone: 'Europe/Paris' })
  async weeklyPdgReport() { /* … */ }

  // … 8 autres jobs
}
```

---

## 5. Intégrations externes

### 5.1 John Paul (API REST)

```ts
@Injectable()
export class JohnPaulApiClient {
  postDemand(demand: ConciergerieDemand): Promise<JohnPaulTicket>
  getStatus(ticketId: string): Promise<JohnPaulStatus>
  postMessage(ticketId: string, message: string): Promise<void>
  webhookHandler(payload: JohnPaulWebhookPayload): Promise<void>
}
```

Auth : OAuth 2.0 client credentials. API key dans Vault.

### 5.2 Quintessentially (à demander)

À ce jour pas d'API publique. Solution intermédiaire : portail
`/partenaire-conciergerie` côté Eventy (déjà livré frontend), et
le partenaire utilise l'interface web. Webhooks bilatéraux à négocier.

### 5.3 Knok Healthcare

API REST documentée. Intégration similaire à John Paul.

### 5.4 Notifications

| Canal | Service | Cas d'usage |
|-------|---------|-------------|
| Push mobile | Capacitor + FCM | Alertes créateur/indé sur smartphone |
| SMS | Twilio | Escalade créateur si pas de réponse push |
| Email | Resend | Rapports PDG, factures, NPS reminders |
| Slack | Webhooks | Alertes équipe (#conciergerie-alerts) |
| Phone (voicebot) | Twilio + AI | Escalade Luxe critique |

---

## 6. Sécurité & RGPD

- Toutes les données voyageurs chiffrées at-rest (PostgreSQL + AWS KMS / Scaleway IAM)
- Communication TLS 1.3 obligatoire
- DPA signé avec chaque partenaire externe (cf. `01-legal/CONTRAT-PARTENAIRE-CONCIERGERIE.md`)
- Anonymisation automatique selon §17 audit MD (cron archivage)
- Logs audit-trail signés (HMAC) → tamper-evident
- Endpoint export RGPD voyageur : `/api/users/:id/conciergerie-export` (DSAR)
- Endpoint suppression : `/api/users/:id/conciergerie-delete` → anonymise PII conservant audit-trail anonymisé

---

## 7. Tests

### 7.1 Tests unitaires (Jest)

- Helper de routing (déjà fait côté frontend, miroir backend)
- SLA computation
- Quality scoring
- Anomaly detection

### 7.2 Tests intégration (NestJS Testing)

- Endpoint POST /demands (création + routage automatique)
- WebSocket : 'demand.message' propage à voyageur + créateur
- Cron SLA : démontrer escalade auto

### 7.3 Tests E2E (Playwright)

- Voyageur dépose demande sur app voyage Tribu
- Créateur reçoit push + répond via `/pro/conciergerie/[id]`
- Voyageur reçoit message
- Voyageur note NPS

---

## 8. Roadmap implémentation Sprint 2 (~5 j-h)

| Jour | Livrable |
|------|----------|
| J1 | Migration Prisma (4 modules + tables) |
| J2 | Module `concierge-requests` (endpoints + tests) |
| J3 | WebSocket gateway + cron SLA + tests |
| J4 | Modules `concierge-providers` + `concierge-quality` |
| J5 | Module `concierge-reporting` + cron jobs + intégration John Paul stub |

---

*Document livré : 2026-05-06 — David / Claude Opus 4.7 (1M)*
*À implémenter en backend NestJS submodule eventy-backend, branche feat/conciergerie.*
