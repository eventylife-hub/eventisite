# Taxes Touristiques — Plan d'implémentation en 3 étapes

> **Statut** : ÉTAPE 1 terminée (2026-04-12)
> **Prochaine étape** : ÉTAPE 2 — Paiements automatiques + Manifeste

---

## ✅ ÉTAPE 1 — Terminée (2026-04-12)

### Ce qui est fait

**Frontend :**
- `frontend/data/destination-taxes.ts` — Table de référence statique (12 pays, 20+ villes, 30+ taxes)
- `EtapePricing.tsx` — Section "Taxes incluses automatiquement" dans le wizard création voyage
  - Auto-détection pays/ville depuis la destination
  - Affichage des taxes applicables + montant/pax calculé
  - Bouton "Signaler une taxe manquante" (formulaire → console.log, ÉTAPE 2 = API)
- `TaxesIncluses.tsx` — Composant public-facing collapsible "Prix tout compris"
  - Intégré dans `voyage-detail-client.tsx` (section Inclus/Non inclus)
- `/admin/finance/taxes/page.tsx` — Page admin de consultation de la table de référence

**Types :**
- `DestinationTaxSnapshot` + `AppliedTaxEntry` ajoutés à `types.ts`
- `destinationTaxes?: DestinationTaxSnapshot` dans `TravelFormData`

---

## 🔧 ÉTAPE 2 — À implémenter (priorité HAUTE)

### 2.1 Backend — Modèle TaxReference

```prisma
model TaxReference {
  id          String   @id @default(cuid())
  countryCode String   // ISO 3166-1 alpha-2
  cityName    String?  // null = tout le pays
  name        String
  description String
  amountCents Int      // 0 si percentValue
  percentValue Float?
  unit        TaxUnit
  paidBy      TaxPayer
  category    TaxCategory
  active      Boolean  @default(true)
  notes       String?
  source      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([countryCode])
  @@map("tax_references")
}

enum TaxUnit {
  PER_PERSON_PER_NIGHT
  PER_PERSON
  PER_PERSON_PER_TRIP
  PERCENT_OF_ACCOMMODATION
  FIXED_PER_BOOKING
}

enum TaxPayer {
  EVENTY_DIRECT
  VIA_HRA
  VIA_TRANSPORT
  CLIENT_SUR_PLACE
}

enum TaxCategory {
  SEJOUR
  AEROPORT
  SOLIDARITE
  TOURISME
  VISA
  ASSURANCE
  TVA
  DIVERS
}
```

**Module backend :** `backend/src/modules/taxes/`
- `taxes.service.ts` — CRUD + calcul automatique
- `taxes.controller.ts` — GET /api/taxes, POST /api/admin/taxes, PUT, DELETE
- `taxes.seed.ts` — Migration initiale depuis destination-taxes.ts

### 2.2 Signalements de taxes manquantes

**Backend :**
```prisma
model TaxSignalement {
  id          String   @id @default(cuid())
  destination String
  taxName     String
  taxAmount   String?
  taxSource   String?
  proProfileId String
  status      SignalementStatus @default(PENDING)
  createdAt   DateTime @default(now())
  processedAt DateTime?
  processedBy String?  // adminId
  notes       String?
  
  @@map("tax_signalements")
}

enum SignalementStatus {
  PENDING
  IN_REVIEW
  APPLIED
  REJECTED
}
```

**Frontend :**
- Activer `POST /api/pro/taxes/signalement` dans `EtapePricing.tsx` (TODO déjà marqué)
- Page admin `/admin/finance/taxes` — section signalements (TODO déjà marqué)

### 2.3 Provisions paiements automatiques

**Principe :** Pour chaque voyage confirmé, créer automatiquement une provision par taxe "EVENTY_DIRECT".

```
Voyage confirmé (X pax, N nuits, destination "Bali") →
  → Taxe touristique Bali : 9,50€ × X pax = provision 950€
  → Visa VoA : 33€ × X pax = provision 3300€
  → Total provisions taxes = 4250€
```

**Backend :**
```prisma
model TaxProvision {
  id              String   @id @default(cuid())
  travelId        String
  taxReferenceId  String
  paxCount        Int
  durationNights  Int
  amountCents     Int      // total (unitaire × pax × nuits si applicable)
  currency        String   @default("EUR")
  status          ProvisionStatus @default(PENDING)
  dueDate         DateTime?
  paidAt          DateTime?
  paymentRef      String?  // Pennylane reference
  createdAt       DateTime @default(now())
  
  travel          Travel         @relation(fields: [travelId], references: [id])
  taxReference    TaxReference   @relation(fields: [taxReferenceId], references: [id])
  
  @@index([travelId])
  @@map("tax_provisions")
}

enum ProvisionStatus {
  PENDING
  SCHEDULED
  PAID
  CANCELLED
}
```

**Page admin :** `/admin/finance/taxes/provisions`
- Tableau des provisions par voyage
- Statut : PENDING → SCHEDULED → PAID
- Date d'échéance par autorité/pays
- Export Pennylane

---

## 📋 ÉTAPE 3 — Manifeste + Documents légaux

### 3.1 Manifeste Client

Obligatoire pour : bus charter, avion charter, croisière

**Données requises par voyageur :**
- Nom + Prénom
- Date de naissance
- Nationalité
- N° passeport (voyages internationaux)
- Contact d'urgence

**Implémentation :**
- Auto-généré à J-7 depuis les réservations confirmées
- Page `/pro/voyages/[id]/manifeste`
- Page `/admin/voyages/[id]/manifeste` (validation + envoi)
- Export PDF avec logo Eventy
- Alerte si infos passager incomplètes
- Envoi automatique au transporteur + HRA

**Backend :** `backend/src/modules/documents/manifeste.service.ts`

### 3.2 Documents légaux obligatoires (UE)

| Document | Obligatoire | Statut |
|----------|-------------|--------|
| Fiche d'information précontractuelle | ✅ Oui | TODO |
| Formulaire de rétractation (14 jours) | ✅ Oui (vente à distance) | TODO |
| Contrat de voyage (conditions, annulation) | ✅ Oui | Partiel (CGV) |
| Attestation d'assurance voyage | ✅ Oui | TODO |
| Bon de commande / confirmation réservation | ✅ Oui | Partiel |
| Facture client (TVA détaillée) | ✅ Oui | Partiel |
| Certificat ATOUT France (affichage) | ✅ Oui | TODO |

### 3.3 Intégration Pennylane

- Export automatique des provisions de taxes
- Catégories comptables : "Taxes et redevances locales"
- Rapprochement bancaire
- Déclaration TVA sur marge (TOMS)

---

## 📊 Pays à ajouter en priorité

| Pays | Urgence | Raison |
|------|---------|--------|
| Thaïlande | HAUTE | Taxe touriste 300 THB — officielle dès 2025 |
| Croatie | HAUTE | 1,50€/nuit, destination populaire |
| Mexique | HAUTE | DNA fee ~30 USD |
| République Dominicaine | MOYENNE | MITUR tax ~10 USD |
| USA (New York) | MOYENNE | 5,875% hotel tax + 3,50% NYC tax |
| Malte | FAIBLE | 0,50-5€/nuit |
| Chypre | FAIBLE | 2-7€/nuit |

---

## ⚠️ Points d'attention

1. **TVA sur marge voyagiste** : Régime TOMS (Tour Operator Margin Scheme) — applicable en France.
   La TVA est calculée sur la MARGE d'Eventy, pas sur le prix total client. À valider avec l'expert-comptable.

2. **Taxe de séjour France** : Depuis 2024, les OTAs (plateformes en ligne) doivent collecter et reverser 
   la taxe de séjour directement à la collectivité (Art. L. 2333-34 CGCT). Eventy pourrait être concerné 
   en tant que plateforme → À valider avec l'avocat.

3. **Bali Love Bali Levy** : Active depuis fév. 2024. Eventy doit la payer pour chaque voyageur.
   Budget annuel estimé à calculer selon volume prévu.

4. **Alerts barèmes périmés** : Mettre en place un système d'alertes annuelles pour réviser les barèmes 
   (les taxes évoluent souvent en janvier ou en saison haute).
