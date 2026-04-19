# AUDIT ASSURANCES & SÉCURITÉ EVENTY — Avril 2026

> **Date** : 2026-04-19  
> **Périmètre** : Frontend Next.js (247 pages) + Backend NestJS (31 modules) + Fichiers PDG  
> **Auteur** : Claude (PDG assistant) — mandaté par David Eventy  
> **Objectif** : Cartographie exhaustive de l'existant + plan d'implémentation complet

---

## 1. SYNTHÈSE EXÉCUTIVE

| Domaine | Statut | Score |
|---------|--------|-------|
| Stratégie & modèle assurance | ✅ Documenté | 5/5 |
| Backend insurance module | ✅ Implémenté | 4/5 |
| Checkout — souscription | ✅ Fonctionnel | 4/5 |
| Portail client assurance | ⚠️ Incomplet | 2/5 |
| Portail admin sinistres | ❌ Inexistant | 0/5 |
| **Portail assureur dédié** | ✅ Partiellement | 3/5 |
| Contrats & signatures | ❌ Inexistant | 0/5 |
| Connexion API assureur | ❌ Inexistant | 0/5 |
| Automatisation sinistres | ⚠️ Partielle | 2/5 |
| Sécurité technique | ✅ Excellente | 4.5/5 |
| Module SOS/géolocalisation | ❌ Inexistant | 0/5 |

**Verdict global** : Le backend assurance est bien construit (module complet, workflow sinistres 7 statuts, portail assureur). Le frontend est lacunaire (pas de page admin sinistres, API client manquante). Les fonctions avancées (contrats numériques, API bidirectionnelle, SOS) sont toutes à créer.

---

## 2. ÉTAT ACTUEL — BACKEND

### 2.1 Module Insurance (`/backend/src/modules/insurance/`)

Le module existe et est **bien structuré** :

```
insurance/
├── insurance.service.ts        — Gestion options & souscriptions
├── insurance.controller.ts     — Endpoints publics/client
├── claims.service.ts           — Gestion sinistres complets
├── claims.controller.ts        — Endpoints client/admin/assureur
├── assureur-access.service.ts  — Portail assureur externe
├── insurance.module.ts
└── dto/
    ├── subscribe-insurance.dto.ts
    ├── submit-claim.dto.ts
    └── update-claim-status.dto.ts
```

#### Endpoints Insurance (souscription)

```
GET  /insurance/travel/:travelId/options           [PUBLIC]
POST /insurance/booking/:bookingGroupId/subscribe  [CLIENT/PRO/ADMIN]
GET  /insurance/mine                               [CLIENT]
POST /insurance/booking/:bookingGroupId/cancel     [CLIENT]
GET  /insurance/:subscriptionId/certificate        [CLIENT]
```

**État** : ✅ Fonctionnel. INVARIANT 5 respecté (verrouillage post-paiement). Délai légal 14 jours. Certificat PDF généré en mémoire.

#### Endpoints Claims (sinistres)

```
POST /insurance/claims/travel/:travelId            [CLIENT/PRO/ADMIN]  — Déclarer sinistre
GET  /insurance/claims/mine                        [CLIENT]            — Mes sinistres
GET  /insurance/claims/:claimId                    [CLIENT]
POST /insurance/claims/:claimId/documents          [CLIENT]            — Pièces jointes
GET  /insurance/claims/admin/all                   [ADMIN]             — Vue admin
GET  /insurance/claims/admin/stats                 [ADMIN]             — Statistiques
PATCH /insurance/claims/admin/:claimId/status     [ADMIN]             — Changer statut
```

#### Endpoints Portail Assureur (RBAC AdminRole.ASSUREUR)

```
GET    /insurance/claims/assureur/dashboard        — Vue synthèse
GET    /insurance/claims/assureur/claims           — Liste sinistres
GET    /insurance/claims/assureur/claims/:claimId  — Détail sinistre
PATCH  /insurance/claims/assureur/claims/:claimId  — Mettre à jour
GET    /insurance/claims/assureur/policies         — Polices actives
GET    /insurance/claims/assureur/policies/:id     — Détail police
GET    /insurance/claims/assureur/export/claims    — Export CSV sinistres
GET    /insurance/claims/assureur/export/policies  — Export CSV polices
```

**État** : ✅ Backend assureur fonctionnel. Rôle dédié `AdminRole.ASSUREUR`.

### 2.2 Schéma Prisma

```prisma
InsuranceClaim {
  id, clientId, travelId, bookingGroupId
  claimType: InsuranceClaimType   // 7 types (voir ci-dessous)
  status: InsuranceClaimStatus    // 7 statuts
  description, incidentDate, incidentLocation
  claimAmountCents, refundedCents
  attachments: Json
  insurerReference, insurerResponse
  handledByUserId, internalNotes
  submittedAt, resolvedAt, updatedAt
}

InsuranceClaimDocument {
  id, claimId, url, filename, mimeType, sizeBytes, uploadedAt
}

InsurancePolicy {
  id, travelId (unique)
  policyNumber, insurer
  coverageType: InsuranceCoverageType  // PACK_SERENITE | PREMIUM | CUSTOM
  startDate, endDate
  coverageDetails: Json               // ⚠️ Structure non définie
  premiumCents
}
```

**Enums** :
- `InsuranceClaimType` : CANCELLATION | REPATRIATION | BAGGAGE | MEDICAL | LIABILITY | DELAY | OTHER
- `InsuranceClaimStatus` : SUBMITTED → UNDER_REVIEW → DOCS_REQUESTED → APPROVED/REJECTED → PAID → CLOSED
- `InsuranceCoverageType` : PACK_SERENITE | PREMIUM | CUSTOM

### 2.3 Intégration Bookings & Finance

Dans `RoomBooking` : champs `insuranceSelected`, `insuranceProductId`, `insuranceAmountPerPersonTTC`, `insuranceTotalAmountTTC`.

Dans `ClosePack` : cotisations incluses (`URSSAF`, `TVA_MARGE`, `RC_PRO`, `APST`, `FONDS_POOL`). Distribution 8 poches inclut `POCHE_ASSURANCE_1/2/3`.

### 2.4 Constantes business

```typescript
// /backend/src/common/constants/business.constants.ts
INSURANCE_PRICING = {
  BASIC_CENTS: 3500,       // 35€
  STANDARD_CENTS: 6500,    // 65€
  PREMIUM_CENTS: 12000,    // 120€
}
INSURANCE.WITHDRAWAL_PERIOD_DAYS = 14  // Délai légal
```

### 2.5 Module Safety Sheets (Pro)

Dans `/backend/src/modules/pro/safety-sheets.service.ts` : fiches sécurité destination (numéros urgence, hôpital, ambassade, police locale, hotline assurance, protocoles allergies, plan évacuation). **Pas lié aux assurances voyage**.

---

## 3. ÉTAT ACTUEL — FRONTEND

### 3.1 Checkout — Assurance voyage

**Route** : `/app/checkout/` (étape 1/5)  
**État** : ✅ Toggle assurance inclus dans le flux d'achat  
**API** : `PATCH /checkout/:id/insurance`  
**Validation** : Schema Zod `ToggleInsuranceDtoSchema`, ownership check, rate-limit appliqué

Le client peut activer/désactiver l'assurance à l'étape 1 du checkout. Le prix s'ajuste (~35-120€ selon niveau). Certificat généré post-paiement.

### 3.2 Portail Client

| Page | Route | Statut |
|------|-------|--------|
| Mes assurances | `/client/assurance` | ⚠️ UI existe, **API `GET /client/insurance` manquante** |
| Certificats | Sous `/client/assurance` | ⚠️ Endpoint certificat OK, page d'accès manquante |
| Déclaration sinistre | Aucune page | ❌ Inexistante |
| Suivi dossier sinistre | Aucune page | ❌ Inexistante |

### 3.3 Wizard Création Voyage (Pro)

Dans `EtapePricing.tsx` : le Pack Sérénité est **informationnel uniquement** — le pro ne peut pas configurer l'assurance. Section "Pack Sérénité centralisé" avec description, pas d'options.

**Manque** : ligne assurance dans le tableau de tarification, coût assurance visible dans le calcul du prix.

### 3.4 Portail Admin

| Page | Route | Statut |
|------|-------|--------|
| Dashboard sinistres | `/admin/sinistres` | ❌ **Inexistante** |
| Gestion polices | `/admin/assurances` | ❌ **Inexistante** |
| Déclarations automatiques | — | ❌ Inexistante |
| Audit logs | `/admin/audit-logs` | ✅ Fonctionnel |
| Annulations | `/admin/annulations` | ⚠️ Page existe, API manquante |

### 3.5 Portail Assureur — Interface dédiée

Le backend a le rôle `AdminRole.ASSUREUR` et les endpoints correspondants. **Mais il n'existe pas de portail frontend dédié** `/assureur/...`.

L'assureur doit aujourd'hui utiliser l'interface admin générique, ce qui est insuffisant pour une utilisation opérationnelle quotidienne.

---

## 4. CONTEXTE BUSINESS & JURIDIQUE (Fichiers PDG)

### 4.1 Pack Sérénité — Décisions actées

- **Modèle** : Inclus dans TOUS les voyages (100% souscription — pas d'opt-in)
- **Partenaires à contacter** : Mutuaide (Groupama), Europ Assistance, Allianz Travel, Chapka, AXA Partners
- **Coût assureur** : ~2-3% du prix voyage (~15€/pax moyen)
- **Prix intégré** : ~4,5% (~35€/pax)
- **Marge Eventy** : ~50% de la prime (~17€/pax en moyenne)
- **Contrat** : Contrat groupe annuel (pas police individuelle)

**Garanties Pack Sérénité** :
| Garantie | Plafond |
|----------|---------|
| Annulation toutes causes | 100% |
| Rapatriement sanitaire | Frais réels |
| Assistance 24h/24 | Illimitée |
| Bagages (perte/vol/retard) | 1 500€ |
| Responsabilité civile voyage | 500 000€ |
| Frais médicaux étrangers | 50 000€ |
| Interruption séjour | 100% pro-rata |
| Retard transport (+4h) | 100€/pers |

### 4.2 RC Pro — État des démarches

- Assureurs contactés (05/03/2026) : CMB Assurances, Hiscox
- Budget estimé Y1 : 780€-1 200€/an
- Plafond recommandé : 1 500 000€ (vs minimum légal 300 000€)
- **Statut** : ⏳ Devis en attente, à relancer

### 4.3 Garantie Financière APST

- Contact établi (05/03/2026) : info@apst.travel — 01 44 09 25 35
- Cotisation annuelle : ~2 100€
- Contre-garantie personnelle recommandée : 10 000€
- **Statut** : ⏳ Dossier à déposer (délai 2-4 semaines post-dossier complet)

### 4.4 Bloqueur juridique

**GO/NO-GO = BLOQUANT** : pas de mise en production sans :
1. Garantie APST
2. RC Pro (attestation)
3. Immatriculation Atout France (IM0XXXXX)
4. CGV publiées et validées avocat

---

## 5. PORTAIL ASSUREUR — Interface dédiée

### 5.1 État actuel

Le backend expose un portail assureur complet (8 endpoints, rôle ASSUREUR). **Frontend inexistant.**

L'assureur ne peut pas se connecter à une interface dédiée aujourd'hui.

### 5.2 Ce qui manque — Interface Assureur

**Route suggérée** : `/assureur/` (portail distinct, pas sous `/admin/`)

Pages à créer :

| Page | Route | Priorité |
|------|-------|----------|
| Dashboard assureur | `/assureur/dashboard` | P0 |
| Liste sinistres | `/assureur/sinistres` | P0 |
| Détail sinistre | `/assureur/sinistres/[id]` | P0 |
| Polices actives | `/assureur/polices` | P0 |
| Détail police | `/assureur/polices/[id]` | P1 |
| Exports | `/assureur/exports` | P1 |
| Statistiques | `/assureur/stats` | P2 |

**Fonctionnalités dashboard assureur** :
- Vue de toutes les polices actives (par voyage, par date, par type)
- Sinistres en cours classés par urgence
- Taux de sinistralité par type et par destination
- Alertes : polices qui expirent dans 30/60 jours
- Export CSV sinistres + polices pour comptabilité assureur

**Auth assureur** :
- Compte séparé (pas d'accès aux données client complètes)
- RBAC `AdminRole.ASSUREUR` déjà implémenté backend
- Login dédié ou subdomain assureur (ex : `assureur.eventy.fr`)

---

## 6. CONTRATS & PRÉ-CONTRATS

### 6.1 État actuel

Aucun système de gestion de contrats numérique. Les contrats sont gérés manuellement (PDF email).

### 6.2 Ce qui manque — Cycle de vie des contrats

**Cycle de vie proposé** :

```
BROUILLON → ENVOYÉ → SIGNÉ → ACTIF → RENOUVELÉ / RÉSILIÉ
```

**Système à implémenter** :

| Composant | Description | Outil |
|-----------|-------------|-------|
| Stockage documents | Upload + versioning contrats | S3/Scaleway Object Storage |
| Signature électronique | E-signature légale | YouSign (français, RGPD) ou DocuSign |
| Partage sécurisé | Lien signé temporaire | AWS Presigned URL / Scaleway |
| Notifications | Email à chaque changement de statut | Brevo (déjà configuré) |
| Archive | Contrats signés immuables 10 ans | Stockage cold (légal) |

**Types de contrats à gérer** :
- Contrat cadre assureur (Mutuaide, Groupama...) — géré par Eventy
- Polices individuelles par voyage — générées automatiquement
- Avenant de résiliation — si changement de programme
- Contrat partenaire HRA — déjà dans `pdg-eventy/CONTRAT-PARTENAIRE-TYPE.md`
- CGV Eventy — déjà templateé, à publier

**Modèle Prisma à créer** :

```prisma
ContractDocument {
  id, type: ContractType, status: ContractStatus
  title, version
  fileUrl, fileSize, mimeType
  uploadedByUserId
  parties: Json   // [{ name, email, role, signedAt }]
  expiresAt
  signatureRequestId  // ID YouSign/DocuSign
  signedAt, revokedAt
  createdAt, updatedAt
}

enum ContractType { ASSUREUR_CADRE | POLICE_VOYAGE | AVENANT | PARTENAIRE_HRA | CGV | RC_PRO | APST }
enum ContractStatus { DRAFT | SENT | PARTIALLY_SIGNED | SIGNED | ACTIVE | RENEWED | REVOKED }
```

---

## 7. CONNEXION BIDIRECTIONNELLE AVEC LES ASSUREURS

### 7.1 Standards du marché assurance voyage

| Standard | Description | Pertinence Eventy |
|----------|-------------|-------------------|
| **ACORD XML** | Standard mondial échange données assurance | Moyen (lourd pour startup) |
| **Open Insurance (OPIN)** | Initiative API ouverte Europe (2023+) | Moyen (en cours de déploiement) |
| **REST API propriétaires** | APIs spécifiques par assureur | ✅ Le plus pratique |
| **EDI assurance** | Échange données informatisées | ❌ Obsolète |
| **Webhooks mutuels** | Notifications temps réel | ✅ À implémenter |

**Recommandation** : APIs REST propriétaires + webhooks. Pas besoin d'ACORD pour une startup.

### 7.2 Option A — Eventy se connecte à l'assureur

Eventy appelle l'API de l'assureur :

```typescript
// Exemple flux Option A (Mutuaide/AXA Partners)
async subscribeGroupPolicy(travelId: string, paxCount: number): Promise<PolicyRef> {
  // POST https://api.mutuaide.fr/v1/group-policies
  // Headers: Authorization: Bearer ${MUTUAIDE_API_KEY}
  // Body: { travelId, paxCount, coverageType, startDate, endDate }
  // Response: { policyNumber, certificateUrl, premiumTotal }
}

async declareClaim(claim: InsuranceClaim): Promise<ClaimRef> {
  // POST https://api.mutuaide.fr/v1/claims
  // Déclaration automatique à la souscription par le client
}
```

**Assureurs avec APIs disponibles** :
- **Europ Assistance** : API REST + webhook callbacks (le plus mature)
- **Allianz Travel** : API partenaires documentée
- **AXA Partners** : API B2B disponible sur demande
- **Mutuaide (Groupama)** : À confirmer lors de la négociation contrat

### 7.3 Option B — L'assureur se connecte à Eventy

Eventy ouvre une API + webhooks pour les assureurs :

```typescript
// Webhook Eventy → Assureur (envoyé par Eventy)
POST https://webhook.assureur.fr/eventy-events
{
  "event": "claim.submitted",  // ou policy.created, booking.cancelled
  "claimId": "clm_xxx",
  "travelId": "trv_xxx",
  "clientEmail": "...",
  "incidentDate": "2026-06-15",
  "claimType": "CANCELLATION",
  "documents": ["url1", "url2"]
}

// Webhook Assureur → Eventy (reçu par Eventy)
POST https://api.eventy.fr/webhooks/assureur
{
  "event": "claim.approved",  // ou claim.rejected, payment.sent
  "claimId": "clm_xxx",
  "insurerReference": "REF-2026-XXXX",
  "refundAmountCents": 45000,
  "paymentDate": "2026-06-20"
}
```

**Backend à créer** :
```
/backend/src/modules/insurance/webhooks/
├── insurer-webhook.controller.ts   — Reçoit les webhooks assureur
├── insurer-webhook.service.ts      — Traitement + mise à jour statuts
└── insurer-webhook.guard.ts        — Validation HMAC signature
```

### 7.4 Recommandation

Implémenter les DEUX options en parallèle :
1. **Option B d'abord** (Eventy reçoit les webhooks) : plus simple, l'assureur peut envoyer des mises à jour automatiques
2. **Option A ensuite** (Eventy appelle l'assureur) : nécessite un contrat API avec l'assureur

---

## 8. AUTOMATISATION TOTALE

### 8.1 Flux automatisé cible

```
RÉSERVATION CONFIRMÉE
       ↓
[Auto] Souscription assurance → Police créée → Certificat généré → Email client
       ↓
CLIENT DÉCLARE SINISTRE (via app)
       ↓
[Auto] Ticket créé → Webhook envoyé à l'assureur → Email confirmation client
       ↓
[Auto si pas de réponse J+3] Relance assureur
[Auto si pas de réponse J+7] Alerte admin Eventy
       ↓
ASSUREUR RÉPOND (via webhook ou portail)
       ↓
[Auto si APPROVED] Remboursement déclenché → Stripe refund → Email client
[Auto si REJECTED] Email explication → Proposition médiation
       ↓
CLÔTURE DOSSIER → Notification client → Archivage
```

### 8.2 Ce qui existe vs ce qui manque

| Étape | Statut | À faire |
|-------|--------|---------|
| Souscription auto à la réservation | ⚠️ Partielle — toggle checkout | Rendre auto (sans opt-in) |
| Génération certificat auto | ✅ `GET /insurance/:id/certificate` | — |
| Email certificat post-paiement | ⚠️ À vérifier dans module email | Vérifier template |
| Déclaration sinistre client (app) | ✅ API OK | Créer page frontend |
| Webhook automatique vers assureur | ❌ Inexistant | Créer |
| Suivi statut temps réel (client) | ❌ Aucune page | Créer |
| Relance auto si pas de réponse | ❌ Inexistant | Créer cron job |
| Remboursement auto via Stripe | ❌ Inexistant | Créer webhook handler |
| Email de résolution (client) | ❌ Template manquant | Créer template |

### 8.3 Relances automatiques — Cron job proposé

```typescript
// Cron quotidien : relances assureur
@Cron('0 9 * * 1-5')  // Lundi-vendredi 9h
async checkPendingClaims(): Promise<void> {
  const pending = await this.prisma.insuranceClaim.findMany({
    where: {
      status: { in: ['SUBMITTED', 'UNDER_REVIEW'] },
      updatedAt: { lt: subDays(new Date(), 3) },  // Pas de mise à jour depuis 3j
    },
  });
  
  for (const claim of pending) {
    if (daysSince(claim.updatedAt) >= 7) {
      await this.alertAdmin(claim);  // Alerte admin Eventy
    } else {
      await this.sendInsurerReminder(claim);  // Relance assureur
    }
  }
}
```

---

## 9. SUIVI DES ASSURANCES — Dashboard Admin

### 9.1 Ce qui manque

Aucun dashboard admin pour le suivi des assurances. L'admin doit appeler directement les endpoints API sans interface.

### 9.2 Dashboard admin à créer

**Route** : `/admin/assurances/` (nouvelle section)

| Page | Contenu |
|------|---------|
| `/admin/assurances` | Vue synthèse : polices actives, sinistres en cours, taux sinistralité |
| `/admin/assurances/sinistres` | Liste tous sinistres + filtres (statut, type, voyage, date) |
| `/admin/assurances/sinistres/[id]` | Détail sinistre + timeline + documents + actions |
| `/admin/assurances/polices` | Toutes les polices actives par voyage |
| `/admin/assurances/rapprochement` | Rapprochement comptable assurance/paiements |

**KPIs à afficher** :
- Nombre de polices actives (par mois)
- Nombre de sinistres (en cours / résolus / rejetés)
- Taux de sinistralité (sinistres / voyageurs assurés)
- Montant total remboursé (ce mois / cumul)
- Revenus assurance (primes collectées − primes versées)
- Alertes : polices expirant dans 30 jours, sinistres non traités > 7 jours

**Alertes automatiques** :
```
⚠️ 3 sinistres non traités depuis plus de 7 jours
⚠️ Police voyage "Maroc Juillet" expire dans 12 jours  
✅ 2 remboursements validés ce matin (1 250€ total)
```

### 9.3 Rapprochement comptable

Tableau de rapprochement :
```
Voyage | Pax | Primes collectées | Primes versées assureur | Marge | Sinistres
----------------------------------------------------------------------
Maroc Été 26 | 53 | 1 855€ | 795€ | 1 060€ | 1 (BAGGAGE, 150€)
Barcelone | 47 | 1 645€ | 705€ | 940€   | 0
...
```

---

## 10. SÉCURITÉ GLOBALE — AUDIT TECHNIQUE

### 10.1 Authentification & Autorisation (A+)

| Aspect | Statut | Détails |
|--------|--------|---------|
| JWT Flow | ✅ | Access 15 min, refresh httpOnly + SameSite=strict |
| Rate limiting | ✅ | 5 req/60s auth (login/register/forgot) |
| Email enumeration | ✅ | Dummy Argon2 hash si user non trouvé |
| RBAC 6 rôles | ✅ | ADMIN/PRO/CLIENT/EMPLOYEE + ASSUREUR |
| 2FA/TOTP | ❌ | Non implémenté — recommandé pour ADMIN/PRO |

### 10.2 Validation & Injection (A+)

| Vecteur | Statut |
|---------|--------|
| SQL injection | ✅ 0 risque (Prisma ORM uniquement) |
| XSS | ✅ sanitizeHtml() + Helmet CSP |
| CSRF | ✅ Double-submit cookie timing-safe |
| Path traversal | ✅ Multi-layer (normalize + basename + regex) |
| Object prototype | ✅ Middleware bloque `__proto__` / `constructor` |

### 10.3 Sécurité des paiements (A+)

- Stripe PCI-DSS : jamais de données carte côté serveur
- Argon2id (memory 65536, time 3, parallelism 4)
- URL validation Stripe : vérifie `https://` + `endsWith('stripe.com')`

### 10.4 Issues à corriger (issues connues)

| Risque | Sévérité | Correction |
|--------|----------|------------|
| JWT fallback hardcodé (`dev-access-secret-NOT-FOR-PRODUCTION`) | HIGH | Throw error si env var manquante |
| `PGPASSWORD` en env var (pg_dump) | MEDIUM | Utiliser `.pgpass` ou pipe stdin |
| 2FA absent | MEDIUM | TOTP recommandé pour ADMIN/PRO |

### 10.5 Incidents voyageurs — Ce qui manque

| Fonction | Statut |
|----------|--------|
| Module SOS/urgence 24h | ❌ Inexistant |
| Bouton panique/géolocalisation | ❌ Inexistant |
| Bracelets connectés | ❌ Inexistant |
| Gestion incident de groupe | ❌ Inexistant |
| Communication d'urgence groupe | ❌ Inexistant |
| Alertes ambassade/santé (SafetySheet) | ✅ Partiellement |

**Note** : Les fiches SafetySheet existent (numéros urgence, protocoles). Un module SOS serait un différenciateur fort pour le futur mais n'est pas bloquant pour le lancement.

---

## 11. MODÈLE EVENTY DE BASE + OPTIONS

### 11.1 Pack Sérénité (inclus)

Automatiquement inclus dans TOUS les voyages. Le client ne peut pas le décocher.

| Garantie | Incluse | Plafond |
|----------|---------|---------|
| Annulation toutes causes | ✅ | 100% |
| Rapatriement sanitaire | ✅ | Frais réels |
| Assistance 24h/24 | ✅ | Illimitée |
| Bagages | ✅ | 1 500€ |
| RC voyage | ✅ | 500 000€ |
| Frais médicaux étrangers | ✅ | 50 000€ |

**Prix** : ~15€/pax (coût assureur) — Intégré dans le prix public sans ligne séparée.

### 11.2 Options supplémentaires (non implémentées)

À proposer en option payante au checkout :

| Option | Description | Prix estimé |
|--------|-------------|-------------|
| Annulation+ | Annulation jusqu'à J-1 | +12€/pax |
| Sport/Aventure | Couverture activités à risque (ski, surf, escalade) | +8€/pax |
| Bagages premium | 3 000€ au lieu de 1 500€ | +5€/pax |
| Santé renforcée | 100 000€ au lieu de 50 000€ | +7€/pax |
| Multi-destination | Voyages multi-pays | +10€/pax |

---

## 12. ARCHITECTURE PROPOSÉE — SYSTÈME ASSURANCE COMPLET

### 12.1 Nouveaux modules backend à créer

```
/backend/src/modules/insurance/
├── [EXISTANT] insurance.service.ts
├── [EXISTANT] claims.service.ts
├── [EXISTANT] assureur-access.service.ts
├── [CRÉER] insurer-webhook.controller.ts  — Webhooks assureur → Eventy
├── [CRÉER] insurer-webhook.service.ts
├── [CRÉER] insurer-api.service.ts         — Option A : Eventy → API assureur
├── [CRÉER] claim-automation.service.ts    — Relances + remboursements auto
└── [CRÉER] insurance-dashboard.service.ts — Stats admin enrichies

/backend/src/modules/contracts/  ← NOUVEAU MODULE
├── contracts.service.ts
├── contracts.controller.ts
├── signature.service.ts          — YouSign/DocuSign integration
└── dto/
```

### 12.2 Nouvelles tables Prisma à créer

```prisma
ContractDocument { ... }          // Contrats avec cycle de vie
InsurerWebhookEvent { ... }       // Log des webhooks entrants
ClaimReminder { ... }             // Relances automatiques tracées
InsuranceOption { ... }           // Options supplémentaires par voyage
```

### 12.3 Nouvelles pages frontend à créer

```
/app/(admin)/admin/assurances/
├── page.tsx                      — Dashboard KPIs assurance
├── sinistres/page.tsx            — Liste sinistres admin
├── sinistres/[id]/page.tsx       — Détail + actions
├── polices/page.tsx              — Polices actives
└── rapprochement/page.tsx        — Rapprochement comptable

/app/(client)/client/assurance/
├── page.tsx                      — Mes assurances (CONNECT API MANQUANTE)
├── [id]/page.tsx                 — Détail + certificat
└── sinistre/page.tsx             — Déclarer un sinistre (self-service)

/app/(assureur)/assureur/         ← NOUVEAU PORTAIL
├── dashboard/page.tsx
├── sinistres/page.tsx
├── sinistres/[id]/page.tsx
├── polices/page.tsx
└── exports/page.tsx
```

---

## 13. PLAN D'ACTION PRIORISÉ

### P0 — Avant lancement (BLOQUANTS)

1. **API `GET /client/insurance`** — Connecter page `/client/assurance` (1 endpoint backend manquant)
2. **Page `/client/assurance`** — Afficher assurances souscrites + certificats PDF
3. **Pack Sérénité dans EtapePricing** — Intégrer la ligne coût assurance dans le tableau de tarification

### P1 — Semaine 1 post-lancement

4. **Page admin sinistres** — `/admin/assurances/sinistres` avec liste + statuts (branché sur API existante)
5. **Page déclaration sinistre client** — Formulaire self-service (API existe, page manque)
6. **Webhook assureur → Eventy** — Réception des mises à jour de statut sinistre
7. **Email résolution sinistre** — Template email client quand sinistre résolu

### P2 — Mois 1-2

8. **Portail assureur frontend** — `/assureur/` complet (RBAC déjà implémenté backend)
9. **Dashboard admin KPIs** — Taux sinistralité, revenus assurance, alertes
10. **Cron relances** — Relance automatique si assureur ne répond pas sous 3 jours
11. **2FA pour ADMIN/PRO** — TOTP (sécurité renforcée)

### P3 — Trimestre 1

12. **Option A API assureur** — Se connecter à l'API Europ Assistance / Allianz Travel
13. **Contrats & signatures** — Module YouSign pour contrats assureur
14. **Options assurance supplémentaires** — Annulation+, Sport, Bagages premium
15. **Module SOS/géolocalisation** — Bouton urgence dans app client

---

## 14. CORRECTION DU MODÈLE FINANCIER

> ⚠️ **Correction importante (2026-04-19)** : Le fichier `lib/finance/cascade.ts` utilise un modèle **82/18 sur TOUS les postes HRA** (hébergement, restauration, activités + transport). Ce modèle est INCORRECT.

### Le vrai modèle Eventy (validé David)

```
PRIX DE REVIENT
  = hébergement + restauration + transport + activités + assurance + taxes

PRIX PUBLIC
  = prix de revient × 1.15

DÉTAIL DE LA MARGE 15% :
  ├─ 5% → Gamification / Vendeur (ambassadeur, vendeur magasin)
  ├─ 7% → Eventy (plateforme)
  └─ 3% → Créateur indépendant + Stripe
```

### Le 82/18 ne s'applique QU'AU TRANSPORT

```
Transport :
  ├─ 82% → Transporteur (coût réel payé au prestataire bus/train)
  └─ 18% → Marge Eventy sur le transport

Formule : prix public transport/pax = coût transporter / 0.82
```

### Modèle HRA (cascade interne)

Pour Hébergement, Restauration, Activités — modèle de négociation B2B :
- Remise négociée 25% sur le prix public partenaire
- 15% → Eventy (du prix public partenaire)
- 10% → Indépendant brut (puis 8 poches : 50% net indé + 50% charges)
- 75% → Partenaire (paiement réel)

**Ce modèle HRA est interne et n'est pas exposé au créateur.** Le créateur voit uniquement le modèle global 15%.

### Action requise

Le fichier `lib/finance/cascade.ts` doit être mis à jour pour :
1. Supprimer `EVENTY_SHARE_PERCENT = 82` sur les postes HRA
2. Utiliser le split HRA 25/15/10 pour les postes hébergement/restauration/activités
3. Garder 82/18 UNIQUEMENT sur le poste transport (avec la bonne sémantique : 82% coût transporter, 18% marge Eventy)
4. Ajouter le calcul global 15% = 5%+7%+3%

---

*Audit réalisé le 2026-04-19 — Fichiers analysés : 35+ (modules backend, pages frontend, fichiers PDG, schéma Prisma, constantes business)*
