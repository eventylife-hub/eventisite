# Audit Finance — Poches, Flux & Traçabilité

> **Date** : 2026-04-16
> **Scope** : Tout le flux financier Eventy — de l'euro payé par le Voyageur jusqu'aux destinataires finaux (Créateur, Maisons HRA, Transport, Taxes, Assurance, Commissions, Eventy)
> **Nature** : Audit PUR — aucune modification de code, uniquement observation du code/schéma/UI
> **Scellés de confidentialité** : marge Eventy = secret interne, jamais exposée Créateur ni Voyageur

---

## 0. TL;DR pour le PDG

- **12 poches identifiées** — 7 tracées correctement, 3 partielles, 2 absentes
- **Problème critique #1** : `StripeConnectService` existe mais **le client Stripe n'est PAS initialisé** (ligne commentée) → aucun transfer réel possible aujourd'hui
- **Problème critique #2** : `PayoutBatchService` change les statuts en base mais **n'exécute aucun transfer Stripe** — les Pros ne sont pas payés automatiquement
- **Problème critique #3** : Pennylane est câblé en API mais **aucun sync automatique** déclenché après vente/paiement — tout est manuel
- **Problème critique #4** : Les **Maisons HRA (hôtels/restos/activités) n'ont pas de compte Stripe Connect** — paiement externe, non tracé dans notre SI
- **Problème critique #5** : `/admin/finance/taxes-internationales` affiche des données qui n'existent **pas dans le schéma Prisma** (TaxReference/TaxProvision absents)

État brut : **la plomberie comptable est posée** (modèles, caisses, politiques, ClosePack, FEC, TVA marge) **mais les tuyaux qui font circuler l'argent vers les partenaires ne sont pas connectés**.

---

## 1. Exemple concret — Marrakech Express 20 voyageurs × 1798€ = 35 960€

Voyage type : 5 nuits Marrakech, bus depuis Paris, 10 repas, 4 activités, 1 Créateur + 0 Indépendants (cascade standard).

### 1.1 Tableau cascade ligne par ligne

| # | Poche | Montant (€) | % CA | Destinataire | Tracé | Modèle / Fichier |
|---|-------|-------------|------|--------------|-------|------------------|
| 0 | **CA brut voyageurs** | 35 960,00 | 100,0% | Stripe (encaisse Eventy) | ✅ | `PaymentContribution` |
| 0.bis | Frais Stripe (~1,4% + 0,25€/paiement) | -508,00 | -1,4% | Stripe | 🟡 | Non modélisé séparément — uniquement visible via Stripe dashboard |
| 1 | **Hébergement Maison** (5 nuits × 80€/pax) | -8 000,00 | -22,2% | HotelPartner (Maison) | 🟡 | `HotelBlock.pricePerNightTTC` existe ; paiement Maison = manuel |
| 2 | **Restauration Maisons** (~280€/pax) | -5 600,00 | -15,6% | RestaurantPartner (Maison) | 🟡 | `MealDeclaration.costAmountTTC` + `invoicedAt`/`paidAt` — statuts manuels |
| 3 | **Activités Maisons** (4 × ~50€/pax) | -4 000,00 | -11,1% | ActivityPartner | 🟡 | `TravelActivityCost.costAmountTTC` existe ; payout manuel |
| 4a | **Transport Phase 1** — bus sur place (loueur local) | -1 500,00 | -4,2% | TransportProvider local | 🟡 | `TravelBus.providerId` + `QuoteRequest.quotedAmountTTC` ; paiement externe |
| 4b | **Transport Phase 2** — vol A/R Paris-Marrakech | -6 000,00 | -16,7% | Compagnie aérienne / loueur | 🟡 | `FlightAllotment` + `QuoteSegment.amountTTC` ; paiement externe |
| 5a | **Taxe de séjour** (2€ × 5 nuits × 20) | -200,00 | -0,6% | Commune (ou hôtel reverseur) | ❌ | `HotelBlock.taxeSejourAmountCents` existe MAIS `TaxProvision` absent du schéma |
| 5b | **Taxes aéroport + solidarité** | -400,00 | -1,1% | DGAC / trésor public | ❌ | Aucun modèle dédié |
| 5c | **TVA marge voyagiste** (art. 266 CGI, ~20% sur marge) | -900,00 | -2,5% | DGFiP | ✅ | `TvaMarginCalc` + `TvaAuditEntry` + `TvaPeriod` |
| 5d | TVA restauration (10%) / hébergement (10%) | inclus dans les coûts TTC | — | DGFiP via Maisons | 🟡 | Les Maisons la reversent, Eventy la subit |
| 6 | **Assurance Pack Sérénité** (~25€/pax) | -500,00 | -1,4% | Courtier/Assureur partenaire | ❌ | `InsurancePolicy` pour le contrat client, mais aucune ligne "versé courtier" |
| 7 | **Provisions APST + RC Pro + Atout France** | -200,00 | -0,6% | APST, assureur RC Pro | ❌ | Aucun modèle dédié ; `EventyFund[INSURANCE_RESERVE]` existe mais non alimenté |
| 8 | **Commission Ambassadeur/Vendeur** (si vente tracée) | -300,00 | -0,8% | ProProfile vendeur | ✅ | `AttributionSource` + `CommissionLedgerLine` |
| 9 | **Commission apporteur pub** (lien tracké) | variable (0€ si direct) | — | Campagne / affilié | 🟡 | `TrackingLink` + `AttributionEvent` existent, pas de ligne commission auto |
| 10a | **Gain NET Créateur** (poche 1 sur enveloppe indé, ~50%) | -3 400,00 | -9,5% | Créateur (CreatorRevenueConfig) | ✅ | `Payout.netIndeCents` + 8 poches |
| 10b | Créateur bonus (poche 8) | inclus 10a pour CREATOR | — | Créateur | ✅ | `Payout.createurBonusCents` |
| 11 | **Frais plateformes** (Vercel, Scaleway, Pennylane abo) | -150,00 | -0,4% | Prestataires SaaS | ❌ | Hors schéma (charges d'exploitation Pennylane) |
| 12 | **IS + CFE + CVAE** (provisionné) | -300,00 | -0,8% | Trésor public (annuel) | ❌ | Non modélisé ; à sortir au bilan annuel |
| **13** | **MARGE EVENTY nette** (= 0 − somme) | **≈ 4 712,00** | **~13,1%** | Eventy (compte pro) | ✅ | `ClosePack.balanceCents` + politique `MarginPolicyLine` |

**Vérif arithmétique** : 35 960 − 508 − 8 000 − 5 600 − 4 000 − 1 500 − 6 000 − 200 − 400 − 900 − 500 − 200 − 300 − 3 400 − 150 − 300 = **4 702€** (≈ marge cible 13%).

> **⚠️ Important** : cet exemple est **mocké** — les vrais taux dépendent de `HraCascadeConfig` (cascade verrouillée admin) et de `TripFinanceOverride` pour ce voyage.

### 1.2 La ligne "Marge Eventy" n'est jamais exposée

- Frontend Créateur (`/pro/voyages/[id]/finance`) : montre le net du Créateur, pas la marge.
- Frontend Voyageur : voit uniquement le prix TTC. Jamais de breakdown.
- Cascade admin verrouillable via `HraCascadeConfig.lockedByAdmin` — garantit que le Pro ne peut modifier ni voir les taux internes.
- **RBAC côté backend** : l'ensemble des endpoints `FINANCE_ADMIN` est protégé par `@Roles('ADMIN', 'FINANCE')`. Aucune fuite identifiée dans le code lu.

---

## 2. Cascade visuelle — ASCII

```
┌──────────────────────────────────────────────────────────────────────┐
│  20 Voyageurs × 1 798€ = 35 960€  (paiement Stripe Checkout)         │
│  ↓ Model: PaymentContribution                                         │
│  ↓ Webhook: stripe-webhooks-advanced → LedgerEntry (PENDING)          │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                   ╔═════════════════════════╗
                   ║  Compte bancaire Eventy ║  ← BankAccount (isEscrow?)
                   ║  (via Stripe Payouts)   ║
                   ╚═════════════════════════╝
                                │
           ┌────────────────────┼─────────────────────────────────────┐
           │                    │                                     │
           ▼                    ▼                                     ▼
  ┌─────────────────┐  ┌─────────────────┐              ┌───────────────────────┐
  │ Maisons HRA     │  │ Transporteurs   │              │ Taxes / Autorités     │
  │ (3 types)       │  │ (2 phases)      │              │                       │
  ├─────────────────┤  ├─────────────────┤              ├───────────────────────┤
  │ HotelPartner    │  │ Phase 1 (bus)   │              │ Taxe séjour → commune │
  │   8 000€ 🟡     │  │   1 500€ 🟡     │              │ Taxe aéroport 🟡      │
  │ RestoPartner    │  │ Phase 2 (vol)   │              │ TVA marge → DGFiP ✅  │
  │   5 600€ 🟡     │  │   6 000€ 🟡     │              │   via TvaMarginCalc   │
  │ ActivityPartner │  │                 │              │ Taxe solidarité ❌    │
  │   4 000€ 🟡     │  │ Stripe Connect? │              │                       │
  │                 │  │ ❌ NON câblé    │              │ → TaxProvision        │
  │ Stripe Connect? │  │                 │              │   ❌ absent schema    │
  │ ❌ NON câblé    │  │                 │              │                       │
  └─────────────────┘  └─────────────────┘              └───────────────────────┘
           │                    │                                     │
           └────────────────────┼─────────────────────────────────────┘
                                │
                                ▼
           ┌────────────────────────────────────────────────────┐
           │  PayoutBatch → Payout (ventilation 8 poches)       │
           │  ✅ modèles + UI /admin/finance/payout-batch        │
           │  ❌ MAIS : n'appelle jamais Stripe transfer.create  │
           ├────────────────────────────────────────────────────┤
           │  Créateur/Indé — 8 poches par payout :             │
           │   1. netIndeCents        → IBAN Créateur           │
           │   2. eventyCents         → EventyFund[FONDS_POOL]  │
           │   3. fondateurCents      → EventyFund[FONDATEUR]   │
           │   4. marketingCents      → EventyFund[MARKETING]   │
           │   5-7. assurance1-2-3    → EventyFund[INSUR_RESRV] │
           │   8. createurBonus       → IBAN Créateur (si CREATOR) │
           └────────────────────────────────────────────────────┘
                                │
                                ▼
           ┌────────────────────────────────────────────────────┐
           │  Commissions Vendeur (si vente attribuée)          │
           │  ✅ AttributionSource + CommissionLedgerLine       │
           │  🟡 Pas de génération auto depuis AttributionEvent │
           └────────────────────────────────────────────────────┘
                                │
                                ▼
           ┌────────────────────────────────────────────────────┐
           │  ClosePack — clôture voyage (J+7)                  │
           │  ✅ totalRevenueCents / totalCostCents /           │
           │     totalCommissionsCents / balanceCents           │
           │  ✅ Transfert comptable → Pennylane (manuel)       │
           └────────────────────────────────────────────────────┘
                                │
                                ▼
           ┌────────────────────────────────────────────────────┐
           │  Pennylane (comptabilité + TVA marge)              │
           │  🟡 API branchée (PennylaneService)                │
           │  ❌ Aucun sync auto après paiement                 │
           │  ❌ handleWebhook stub (TODO: update booking)      │
           │  ❌ Aucun cron de rapprochement                    │
           └────────────────────────────────────────────────────┘
```

---

## 3. Traçabilité détaillée — poche par poche

### 3.1 ✅ POCHE 0 — Entrée Voyageur (TRACÉ)

- **Modèle** : `PaymentContribution` (schema.prisma:2348)
  - `amountTTC`, `provider`, `providerRef`, `status`, `idempotencyKey`
  - Contrainte `@@unique([provider, providerRef])` = pas de double-processing
  - Refunds via `Refund`, disputes via `DisputeHold`
- **Service** : `PaymentsService.createCheckoutSession` (backend/payments/payments.service.ts:53)
- **Webhook** : `WebhookController` + `StripeWebhooksAdvancedService` → `StripeEvent` + `LedgerEntry`
- **UI** : `/admin/finance` (liste paiements), `/admin/finance/ledger` (grand livre)
- **Export** : `LedgerEntry` → `FecExportService.generateFEC()` (FEC réglementaire)
- **Statut** : **✅ TRACÉ** — pipeline complet paiement → ledger → FEC.

### 3.2 🟡 POCHE 1 — Hébergement Maison (PARTIEL)

- **Modèle** : `HotelBlock` (schema.prisma:3177)
  - `pricePerNightTTC`, `roomsConfirmed`, `checkInDate`, `checkOutDate`
  - `taxeSejourType` + `taxeSejourAmountCents` — taxe séjour encore mélangée à la prestation
  - Suppléments : single, vue mer, half-board, etc.
- **Compte Maison** : `HotelPartner.iban` existe (schema.prisma:3248), `siret`, `onboardingCompletedAt`
- **Payout Maison** : **❌ AUCUN** — pas de Stripe Connect pour hôtels (voir 4.1)
- **UI Admin** : aucune page dédiée "Paiements Maisons"
- **Statut** : **🟡 PARTIEL** — le coût est tracé dans HotelBlock, mais le **paiement effectif vers la Maison n'est pas modélisé** (ni Payout dédié, ni transfer Stripe). Le PDG doit payer manuellement les hôtels par virement bancaire.

### 3.3 🟡 POCHE 2 — Restauration Maisons (PARTIEL)

- **Modèle** : `MealDeclaration` (schema.prisma:3358)
  - `expectedCount`, `servedCount`, `costAmountTTC`
  - Workflow statut : `OPEN → CLOSED → INVOICED → PAID`
  - `invoicedAt`, `paidAt` — **simple statut, pas de mouvement d'argent tracé**
- **Litiges** : `MealDisputeTicket` (schema.prisma:3387) — OK
- **Compte Resto** : `RestaurantPartner.iban` (schema.prisma:3314), `payoutSchedule` (END_OF_TRIP, DAILY, WEEKLY)
- **Payout Resto** : **❌ AUCUN** — pas de Stripe Connect, pas de génération de virement SEPA automatique
- **UI Admin** : aucune vue dédiée "Facturation restaurants"
- **Statut** : **🟡 PARTIEL** — comptabilisation repas OK (declaration+dispute), paiement = manuel hors SI.

### 3.4 🟡 POCHE 3 — Activités Maisons (PARTIEL)

- **Modèle** : `TravelActivityCost` (schema.prisma:2652) + `ActivityPartner` (schema.prisma:2629)
  - `costAmountHT`, `vatRateBps`, `costAmountTTC`
  - `purchaseMode` : `EVENTY_BUYS` / `CREATOR_BUYS` / `PROVIDER_BILLS` — important pour qui paie qui
  - `purchaseStatus` : `PLANNED / BOOKED / PAID / CANCELLED`
- **Stripe Connect activités** : `MktStripeConnect` (schema.prisma:5804) — **uniquement marketplace activités** (pas Maisons principales)
- **UI** : `/pro/activites/finance` et `/admin/finance/taxes-internationales`
- **Statut** : **🟡 PARTIEL** — un système Stripe Connect existe **uniquement pour les providers d'activités marketplace** (`MktActivityProvider`), pas pour les Maisons HRA principales.

### 3.5 🟡 POCHE 4 — Transport (PARTIEL)

- **Phase 1 (bus sur place)** :
  - `TravelBus.providerId` → `TransportProvider`
  - `QuoteRequest.quotedAmountTTC` + `QuoteSegment.amountTTC`
  - ❌ `TransportProvider` n'a **pas de champ IBAN** (contrairement à HotelPartner/RestaurantPartner) → aucun payout possible depuis Eventy
- **Phase 2 (vols/trains longue distance)** :
  - `FlightAllotment` + `FlightPassengerAssignment`
  - Aucun lien IBAN loueur / compagnie
- **UI Admin** : `/admin/finance/tva-transport` existe
- **Statut** : **🟡 PARTIEL** — les devis et coûts sont tracés, mais **le paiement aux loueurs/compagnies n'a aucun modèle** (tout manuel).

### 3.6 ❌ POCHE 5a — Taxe de séjour (NON TRACÉ)

- **Modèle** : `HotelBlock.taxeSejourAmountCents` existe mais c'est un **attribut de l'hébergement**, pas une provision.
- **Provision** : **❌ aucun modèle `TaxProvision` dans le schéma** — pourtant l'UI `/admin/finance/taxes-internationales` affiche des `TaxReference` / `TaxProvision` inexistants côté backend.
- **Reversement** : généralement collecté par l'hôtel puis reversé à la commune — donc hors compta Eventy ; mais dans certains cas (Atout France strict) Eventy doit provisionner et déclarer.
- **Statut** : **❌ NON TRACÉ** — feature UI partielle sans backing data.

### 3.7 ❌ POCHE 5b — Taxes aéroport / solidarité (NON TRACÉ)

- Aucun modèle dédié.
- UI `/admin/finance/taxes-internationales` référence ces taxes mais sans support DB.
- Sur un vol charter A320 : taxe solidarité + taxes d'aéroport = ~20-40€/pax → significatif.
- **Statut** : **❌ NON TRACÉ**.

### 3.8 ✅ POCHE 5c — TVA marge voyagiste (TRACÉ)

- **Modèle** : `TvaMarginCalc` (schema.prisma:3848) + `TvaAuditEntry` (schema.prisma:3865) + `TvaPeriod` (schema.prisma:5096)
- **Formule** : `(CA_TTC − coûts_TTC) × 20/120` — conforme INVARIANT 6
- **Audit trail** : déclencheurs tracés (`BOOKING_CREATED`, `PAYMENT_RECEIVED`, etc.)
- **Service** : `TvaAuditTrailService` + `FinanceService.computeTravelFinance`
- **UI** : `/admin/finance/tva` + `/admin/finance/tva-transport`
- **Export** : `FecExportService` → écritures FEC pour le cabinet comptable
- **Statut** : **✅ TRACÉ** — implémentation solide avec audit trail et double écriture.

### 3.9 ❌ POCHE 6 — Assurance Pack Sérénité (NON TRACÉ)

- **Modèle client** : `InsurancePolicy` (schema.prisma:5898) + `InsuranceClaim` (schema.prisma:5848) — concerne le voyageur couvert, pas le paiement au courtier.
- **Paiement au courtier** : **❌ aucun modèle** — Eventy achète la couverture pour chaque pax et paie l'assureur mais rien ne le trace.
- **Provision** : `EventyFund[INSURANCE_RESERVE]` existe (schema.prisma:7239) **mais n'est alimenté par aucun job automatique**.
- **Statut** : **❌ NON TRACÉ** — poche critique côté confiance (Pack Sérénité = promesse forte).

### 3.10 ❌ POCHE 7 — APST / RC Pro / Atout France (NON TRACÉ)

- Aucun modèle dédié `GarantieFinanciere`, `RcProProvision`, `AtoutFranceFee`.
- Ces provisions sont **annuelles et obligatoires légalement**.
- Docs existent dans `pdg-eventy/01-legal/` mais pas de trace en base.
- **Statut** : **❌ NON TRACÉ** — à faire avant lancement production.

### 3.11 ✅ POCHE 8 — Commission Ambassadeur / Vendeur (TRACÉ)

- **Modèle** : `AttributionSource` (schema.prisma:7311) + `CommissionLedgerLine` (schema.prisma:7331)
  - `commissionBps`, `ratioVendeurBps`, `vendeurShareCents`, `eventyShareCents`
  - Statut : `ESTIMATED → CONFIRMED → PAID`
- **Politique** : `SellerCommissionPolicy` avec taux évolutif T1→T8+ (schema.prisma:7019)
- **Exécution** : via `PayoutBatchService.executeBatch` qui marque `CommissionLedgerLine` → PAID
- **Ambassadeur** : `ambassador.service.ts` gère les tiers (STARTER → PLATINUM) mais c'est **uniquement pts d'impact**, pas de cashback
- **UI** : `/admin/finance/payout-batch`
- **Statut** : **✅ TRACÉ** — pipeline commission vendeur complet.

### 3.12 🟡 POCHE 9 — Commission apporteurs pub / affiliés (PARTIEL)

- **Modèle tracking** : `TrackingLink` + `AttributionEvent` (schema.prisma:4514, 4533)
- **Campagnes** : `Campaign` + `CampaignMarketing` — OK
- **Commission générée auto** : **❌ pas de lien entre `AttributionEvent` et `CommissionLedgerLine`** — il faudrait un job qui, lors d'une conversion, crée une ligne commission pour l'affilié.
- **Statut** : **🟡 PARTIEL** — tracking OK, monétisation manuelle.

### 3.13 ✅ POCHE 10 — Gain NET Créateur / Indépendant (TRACÉ côté modèle, ❌ côté exécution)

- **Modèle** : `Payout` (schema.prisma:7357) + `PayoutBatch` (schema.prisma:5061) + `IndeContributionLine` (schema.prisma:7117)
  - 8 poches ventilées : `netIndeCents`, `eventyCents`, `fondateurCents`, `marketingCents`, `assurance1Cents`, `assurance2Cents`, `assurance3Cents`, `createurBonusCents`
- **Service** : `PayoutBatchService.computePayoutLine` calcule correctement (backend/finance/payout-batch.service.ts:85)
- **Politique** : `IndeEnvelopeSplitPolicy` (défaut 50/15/10/5/5/5/5/5 = 100%)
- **Config Créateur** : `CreatorRevenueConfig` (perso / asso / split) — OK
- **UI** : `/admin/finance/payout-batch`, `/admin/finance/indie-cotisations`, `/pro/finance`
- **⚠️ Problème exécution** : `executeBatch` **change le statut Payout → EXECUTED** mais ne déclenche **aucun virement Stripe** (voir 4.2)
- **Statut** : **✅ TRACÉ modèle / ❌ NON EXÉCUTÉ réel** — l'argent ne sort jamais vraiment tant qu'un humain ne fait pas le virement.

### 3.14 ❌ POCHE 11 — Frais plateformes (NON TRACÉ)

- Stripe, Pennylane, Vercel, Scaleway = charges d'exploitation
- Aucun modèle dédié — à sortir via banque Pennylane au bilan
- **Statut** : **❌ NON TRACÉ** — acceptable si Pennylane sync bancaire fonctionne ; aujourd'hui ce n'est pas le cas.

### 3.15 ❌ POCHE 12 — IS / CFE / CVAE (NON TRACÉ)

- Taxes sur bénéfices annuelles.
- Aucun modèle dédié — normal à ce stade, mais à **intégrer via Pennylane** pour simulation budgétaire.
- **Statut** : **❌ NON TRACÉ** — à monitorer dès le 1er exercice clôturé.

### 3.16 ✅ POCHE 13 — Marge Eventy (TRACÉ & CONFIDENTIELLE)

- **Modèle** : `ClosePack.balanceCents` (schema.prisma:3985) + `MarginPolicyLine.eventyRateBps`
- **Calcul** : `balance = totalRevenueCents - totalCostCents - totalCommissionsCents`
- **Confidentialité** :
  - `HraCascadeConfig.lockedByAdmin = true` empêche le Créateur de voir/modifier les taux
  - Endpoints protégés `@Roles('ADMIN', 'FINANCE')`
  - Aucune fuite identifiée dans le lecture du code
- **UI Admin** : `/admin/finance/closing`, `/admin/finance/cloture`, `/admin/finance/hra-cascade`
- **Statut** : **✅ TRACÉ & confidentialité respectée**.

---

## 4. Problèmes identifiés (ordre de gravité)

### 4.1 ❌ CRITIQUE — Stripe Connect pour Maisons/Transporteurs pas câblé

**Fichier** : `backend/src/modules/payments/stripe-connect.service.ts:35`
```ts
// this.stripe = require('stripe')(stripeSecretKey);
```
La ligne d'initialisation du client Stripe est **commentée**. Toutes les méthodes (`createConnectAccount`, `createTransfer`, `createPayout`, `getBalance`) **lèveront une erreur runtime** `Cannot read property 'accounts' of undefined`.

**Impact** : impossible aujourd'hui d'onboarder un Pro/Créateur en Stripe Connect, impossible de faire un transfer automatique.

**Cumul** : `HotelPartner`, `RestaurantPartner` ont un champ `iban` mais pas de `stripeConnectAccountId`. `TransportProvider` n'a même pas d'IBAN.

### 4.2 ❌ CRITIQUE — PayoutBatch n'exécute aucun transfer Stripe

**Fichier** : `backend/src/modules/finance/payout-batch.service.ts:298`

`executeBatch()` fait un `prisma.$transaction` qui :
1. Update `PayoutBatch.status = EXECUTED`
2. Update `Payout.status = EXECUTED`
3. Marque `CommissionLedgerLine.status = PAID`

Mais **aucun appel à Stripe transfer.create, aucun ordre SEPA, aucun fichier virement généré**. Les Pros sont marqués "payés" dans la base sans que l'argent ait bougé.

### 4.3 ❌ CRITIQUE — Pennylane branché mais non utilisé dans le flux

**Fichier** : `backend/src/modules/finance/pennylane.service.ts` + `pennylane.controller.ts`

- Le service appelle bien l'API Pennylane v2 avec `PENNYLANE_API_KEY`.
- Le controller expose `/api/finance/pennylane/sync`, `/invoices`, etc.
- Mais **aucun hook n'appelle ce service** après :
  - la confirmation d'un `PaymentContribution`
  - la clôture d'un `ClosePack`
  - l'exécution d'un `PayoutBatch`
- `handleWebhook` contient `// TODO: Mettre à jour le statut de la réservation dans Prisma` → pas de rapprochement auto.
- Aucun cron dans `cron-export.service.ts` qui pousse vers Pennylane.

**Conséquence** : Eventy utilise Pennylane **comme un outil externe que le comptable ouvre en parallèle**, pas comme la source de vérité comptable intégrée.

### 4.4 ❌ IMPORTANT — UI `/admin/finance/taxes-internationales` sans backing data

**Fichier** : `frontend/app/(admin)/admin/finance/taxes-internationales/page.tsx` référence les types `TaxReference`, `TaxReport`, `TaxProvision`.

Aucun de ces modèles n'existe dans `backend/prisma/schema.prisma`. Aucun endpoint `/api/admin/taxes-internationales` dans le backend. La page affiche des données fallback ou des appels qui retournent du vide.

**Impact** : poche 5a/5b/5c non tracée au-delà de la TVA marge.

### 4.5 ❌ IMPORTANT — Aucune provision automatique des 6 EventyFund

**Modèle** : `EventyFund` + `FundMovement` (6 caisses : INSURANCE_RESERVE, MARKETING, FONDATEUR, FONDS_POOL, STAFF_TIPS, CAPACITY_RISK)

**UI** : `/admin/finance/caisses` fonctionne en lecture/écriture manuelle.

**Manque** : aucun hook qui, lors d'un paiement réussi, crédite automatiquement les EventyFund selon la répartition `IndeEnvelopeSplitPolicy`. Le mécanisme existe côté **calcul des poches sur chaque `Payout`** mais **les montants ne sont jamais virés dans les `EventyFund`**.

**Conséquence** : les caisses affichent un solde de 0€ même après plusieurs voyages clôturés.

### 4.6 🟡 IMPORTANT — LedgerEntry alimenté uniquement par Stripe webhooks

**Fichier** : grep `ledgerEntry.create` → **1 seul résultat** (`stripe-webhooks-advanced.service.ts:1094`).

Tous les autres mouvements financiers (refunds hors Stripe, ajustements, commissions payées, payouts, mouvements EventyFund) ne créent **pas** de ligne de grand livre. Le FEC exporté est donc incomplet.

### 4.7 🟡 IMPORTANT — Ambassadeur = points uniquement, pas de cashback monétaire

**Fichier** : `backend/src/modules/pro/ambassador.service.ts`

Le système Ambassadeur (STARTER → PLATINUM) calcule des **impact points** (avis, voyages guidés, shares) mais **ne génère aucune ligne de commission**. Pour un "apporteur d'affaires" qui recommande activement, la monétisation passe uniquement par `AttributionSource → CommissionLedgerLine` (rôle vendeur).

C'est un **choix produit** mais doit être clair avec les partenaires.

### 4.8 🟡 MINEUR — Frais Stripe non séparés des revenus

`PaymentContribution.amountTTC` = montant payé par le voyageur **avant** déduction des frais Stripe (~1,4% + 0,25€). Ces frais ne sont pas dans le schéma — ils sont déduits par Stripe puis remontent via rapprochement Pennylane.

**Impact** : `ClosePack.totalRevenueCents` peut être ~1,5% au-dessus du vrai net encaissé.

### 4.9 🟡 MINEUR — Absence audit log dédié mouvement financier

`AuditLog` + `AdminActionLog` existent mais logguent surtout les actions CRUD. Pour les mouvements financiers (création payout, validation closepack, déblocage dispute), il faudrait un log dédié **signé et horodaté** (compliance-grade).

### 4.10 🟡 MINEUR — Pas de rapport "flux de trésorerie prévisionnel"

Le schéma a tout ce qu'il faut (`BankAccount.balanceCents`, `Payout`, `SepaMandate`) mais aucune vue "cashflow J+30 / J+60 / J+90" pour anticiper les sorties Maisons/Pros.

---

## 5. Top 10 corrections prioritaires

| # | Correction | Effort | Impact | Fichiers |
|---|------------|--------|--------|----------|
| 1 | Décommenter + initialiser vrai client Stripe dans StripeConnectService, ajouter tests e2e | S | **critique** | `payments/stripe-connect.service.ts:35` |
| 2 | Câbler Stripe transfer dans `PayoutBatchService.executeBatch` (transfer par Pro avec idempotence) | M | **critique** | `finance/payout-batch.service.ts:298` |
| 3 | Créer modèles `TaxProvision` / `TaxReference` + endpoints + seed 12 pays | M | **critique** | `prisma/schema.prisma` + nouveau module |
| 4 | Ajouter hook post-ClosePack → sync Pennylane (facture + TVA marge) automatique | S | **critique** | `finance/close-pack/close-pack.service.ts` |
| 5 | Champ `iban` + `stripeConnectAccountId` sur `HotelPartner`, `RestaurantPartner`, `TransportProvider` + onboarding Maisons | L | **important** | `prisma/schema.prisma` + `hra/onboarding.service.ts` |
| 6 | Job cron post-paiement → crédite les 6 `EventyFund` selon `IndeEnvelopeSplitPolicy` | S | **important** | `cron/finance-funds.cron.ts` (à créer) |
| 7 | Généraliser création `LedgerEntry` sur chaque mouvement financier (refund, payout, fund movement, commission paid) | M | **important** | Tous les services finance |
| 8 | `ProviderPayout` modèle (distinct de `Payout`) pour payer les Maisons HRA + workflow INVOICED → PAID | L | **important** | `prisma/schema.prisma` |
| 9 | Modèles provisions annuelles : `GarantieFinanciereAPST`, `RcProPayment`, `AtoutFranceImmatriculation` | S | nice | `prisma/schema.prisma` (legal section) |
| 10 | Audit log dédié financier `FinanceAuditLog` (WORM, signature, horodatage) | M | nice | Nouveau module |

Légende effort : **XS** < 1j · **S** 1-3j · **M** 3-7j · **L** > 7j

---

## 6. Roadmap de fiabilisation

### Phase 1 — Immédiat (avant 1ère facture client réelle)

1. **Pennylane en vrai** (Top10 #4) — sync auto post-ClosePack + webhook réel + cron de réconciliation quotidien
2. **Stripe Connect initialisé** (Top10 #1) — onboarding Pros fonctionnel
3. **PayoutBatch déclenche transfer Stripe** (Top10 #2) — les Pros sont réellement payés
4. **EventyFund alimenté automatiquement** (Top10 #6) — les caisses reflètent la réalité

### Phase 2 — Scale (avant partenariats volume)

5. **Stripe Connect Maisons + transporteurs** (Top10 #5) — supprime toute intervention manuelle
6. **Taxes internationales modélisées** (Top10 #3) — conformité multi-pays
7. **ProviderPayout + workflow HRA** (Top10 #8) — chaque euro Maison tracé
8. **LedgerEntry généralisé** (Top10 #7) — FEC 100% complet

### Phase 3 — Conformité avancée

9. **FinanceAuditLog WORM** (Top10 #10) — traçabilité compliance-grade
10. **Provisions légales annuelles modélisées** (Top10 #9) — budget prévisionnel clair
11. **Rapprochement automatique** bancaire ↔ Stripe ↔ Pennylane — réconciliation quotidienne cron

---

## 7. Annexes — Inventaire des modèles finance

### 7.1 Modèles identifiés (43 modèles Prisma finance-related)

**Paiements voyageurs** : `PaymentContribution`, `PaymentInviteToken`, `Refund`, `DisputeHold`, `StripeEvent`, `StripeWebhookEvent`, `AdjustmentLine`, `CreditVoucher`

**Factures & comptabilité** : `Invoice`, `InvoiceLine`, `LedgerEntry`, `BankReconciliation`, `TvaMarginCalc`, `TvaAuditEntry`, `TvaPeriod`, `ProInvoice`, `ProQuote`, `ProPaymentLink`, `ComptaExportLog`

**Politique finance** : `FinancePolicyVersion`, `MarginPolicyLine`, `IndeEnvelopeSplitPolicy`, `SellerCommissionPolicy`, `HraCascadeConfig`, `TripFinanceOverride`, `UrssafSettings`

**Payouts** : `PayoutBatch`, `Payout`, `TripIndeAllocation`, `IndeContributionLine`, `CreatorRevenueConfig`, `PayoutProfile`, `PayoutBlockReason`

**Caisses** : `EventyFund`, `FundMovement`, `TripCapacityFund`

**Pourboires** : `Tip`, `StaffTipPool`, `StaffTipPoolMovement`, `TipPayoutLine`, `TipSplitPolicy`

**Commissions** : `AttributionSource`, `CommissionLedgerLine`, `AttributionEvent`, `TrackingLink`

**Clôture** : `ClosePack`

**Banque & SEPA** : `BankAccount`, `BankStatement`, `BankTransaction`, `SepaMandate`

**Prestataires** : `Supplier`, `HotelPartner`, `RestaurantPartner`, `ActivityPartner`, `TransportProvider`, `MktStripeConnect`

**Assurance** : `InsurancePolicy`, `InsuranceClaim`

### 7.2 Services finance identifiés (21 services)

Dans `backend/src/modules/finance/` :
- `finance.service.ts`, `finance-advanced.controller.ts`, `finance-policy.service.ts`
- `payout-batch.service.ts`
- `pennylane.service.ts`, `pennylane.controller.ts`
- `fec-export.service.ts`, `cron-export.service.ts`, `trip-export.service.ts`, `poche-export.service.ts`
- `invoice-pdf.service.ts`, `pro-invoice.service.ts`
- `ledger-analytics.service.ts`, `bank-reconciliation.service.ts`, `bank-import.service.ts`
- `tva-audit-trail.service.ts`
- `indie-cotisations.service.ts`, `urssaf-vigilance.service.ts`, `das2.service.ts`
- `supplier-reconciliation.service.ts`, `comptable-access.service.ts`, `comptable-widgets.service.ts`
- `close-pack/close-pack.service.ts`
- `hra-cascade.service.ts`, `hra-cascade.controller.ts`

Dans `backend/src/modules/payments/` :
- `payments.service.ts`, `stripe.service.ts`, `stripe-connect.service.ts`, `stripe-3dsecure.service.ts`, `stripe-webhooks-advanced.service.ts`
- `webhook.controller.ts`

### 7.3 Pages frontend finance (24 pages identifiées)

**Admin** (`/admin/finance/*`) :
- Dashboard (`page.tsx`)
- `accounting-dashboard`, `caisses`, `closing`, `cloture`, `comptable`, `comptes-bancaires`
- `exports-comptable`, `hra-cascade`, `indie-cotisations`, `ledger`
- `payout-batch`, `payouts`, `per-voyage-exports`, `reconciliation`
- `settings`, `simulate`, `stripe-delays`, `supplier-invoices`
- `taxes-internationales`, `tva`, `tva-transport`

**Pro** (`/pro/finance/*`) : `page.tsx`, `cloture`, `activites/finance`, `voyages/[id]/finance`

**Équipe & Staff** : `/equipe/finance`, `/staff/finance`, `/createur/finance`

---

## 8. Règles d'or pour la suite

1. **Un euro qui entre, un euro qui ressort, un euro qui est taxé → trois écritures LedgerEntry minimum**.
2. **Tout Payout doit avoir une contrepartie SEPA/Stripe Connect réelle** — jamais de statut EXECUTED sans trace externe.
3. **Confidentialité marge Eventy** : le code doit rendre physiquement impossible l'exposition de `eventyRateBps` à un rôle autre que `ADMIN` ou `FINANCE`. À auditer par code review.
4. **Atout France / APST** : toute provision légale doit avoir un modèle dédié ET un job cron qui vérifie l'alimentation.
5. **Pennylane = source de vérité comptable** — toute écriture interne doit se retrouver dans Pennylane dans un délai <24h (cron quotidien minimum).

---

*Document généré automatiquement par audit exhaustif code + schéma + UI — 2026-04-16*
*À mettre à jour à chaque correction prioritaire terminée.*
