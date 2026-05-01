# AUDIT — Transfert d'Aéroport pour un Voyage

**Date** : 2026-05-01
**Périmètre** : Bouton "Transférer ce voyage à un autre aéroport" — duplication intelligente conservant la symphonie HRA + transport, changement de hub aérien + bus longue distance, historique des transferts
**Auteur** : IA PDG (David Eventy)
**Statut** : audit + roadmap d'implémentation

---

## 1. Contexte business

Un créateur a publié un voyage "Marrakech Express" depuis CDG. Il identifie une demande forte depuis Lyon (LYS) : il veut **transférer** ce voyage vers LYS sans tout recréer.

**Différence avec `clone-season`** :
- `clone-season` = nouveau voyage, nouvelle saison (date différente)
- `transfert-aeroport` = même voyage, **autre aéroport départ** (donc autre vol, autre bus longue distance, mais **mêmes** : hôtel, programme, restos, activités, équipe terrain)

**Concept "symphonie"** (terminologie Eventy) :
- ✅ Conservée : HRA hôtel/resto/activité, programme jour-par-jour, équipe, pricing structure
- 🔄 Modifiée : aéroport départ, vol, bus longue distance pickup → aéroport, transferts arrivée
- ❌ Réinitialisée : ramassage régional (dépend du hub), arrêts bus locaux côté FR

---

## 2. État actuel du code

### 2.1 Modèle Prisma `Travel`
- ✅ Champs : `departureCity`, `transportMode`, `programJson`, `marginConfig`, `costConfig`
- ✅ Relations : `flightAllotments`, `buses`, `routeAssignments`
- ❌ Pas de notion d'`originalTravelId` ni de `transferredFromTravelId`
- ❌ Pas d'historique de transferts

### 2.2 Frontend
- ✅ `/pro/voyages/[id]/clone-season` — duplication saison
- ✅ `/pro/voyages/[id]/transport/avion` — gestion vols
- ✅ `/pro/voyages/[id]/transport/avion/bus-aeroport` — bus → aéroport
- ❌ **AUCUN** bouton "Transférer ce voyage à un autre aéroport"
- ❌ Pas d'UI symphonie / pas de visualisation comparative source vs cible

### 2.3 Backend
- ✅ Endpoint `POST /pro/travels/:id/duplicate` (clone)
- ❌ Pas d'endpoint `POST /pro/travels/:id/transfer-airport`
- ❌ Pas de logique de duplication intelligente avec mapping d'aéroport

---

## 3. TODOs identifiés

### TODO-TRANS-1 — Modèle `TravelAirportTransfer` (P0)
- **Schema** :
  ```prisma
  model TravelAirportTransfer {
    id                String   @id @default(cuid())
    sourceTravelId    String   // Le voyage d'origine
    targetTravelId    String   // Le nouveau voyage créé par transfert
    sourceAirport     String   @db.VarChar(10) // CDG, LYS, NCE...
    targetAirport     String   @db.VarChar(10)
    sourceCity        String   @db.VarChar(100)
    targetCity        String   @db.VarChar(100)
    preservedSymphony Json     // {hra: true, program: true, team: true, pricing: true}
    resetItems        Json     // {flights: true, busLongDistance: true, regionalPickup: true}
    transferredBy     String   // userId
    reason            String?  @db.Text
    createdAt         DateTime @default(now())

    @@index([sourceTravelId])
    @@index([targetTravelId])
    @@index([transferredBy])
  }
  ```

### TODO-TRANS-2 — Service backend `TravelTransferService` (P0)
- **Fichier** : `backend/src/modules/travels/travel-transfer.service.ts`
- **Méthodes** :
  - `transferToAirport(travelId, targetAirportCode, options, userId)` — orchestrateur
  - `dispatchSymphony(sourceTravel)` — détermine quoi conserver (HRA, programme, équipe)
  - `resetTransport(targetTravel, targetAirport)` — vide vols + bus longue distance, demande nouveau quote
  - `recomputePricing(targetTravel)` — recalcule cascade margin avec nouveau coût transport
  - `logTransferHistory(sourceId, targetId, options, userId)` — audit

### TODO-TRANS-3 — Controller backend (P0)
- **Fichier** : `backend/src/modules/travels/travel-transfer.controller.ts`
- **Routes** :
  - `POST /pro/travels/:id/transfer-airport` — exécuter transfert
  - `GET /pro/travels/:id/transfers` — historique transferts (source ou cible)
  - `GET /airports/suggested?from=:airport` — aéroports candidats (top 10 par densité voyageurs)

### TODO-TRANS-4 — Page frontend `/pro/voyages/[id]/transfert-aeroport` (P0)
- **Layout** : 4 étapes wizard
  1. **Choix aéroport cible** : autocomplete IATA + suggestions (top 10 hubs FR)
  2. **Symphonie** : checkboxes "Conserver HRA / Programme / Équipe / Pricing"
  3. **Réinitialisation** : "Vider vols / Vider bus longue distance / Garder transferts arrivée"
  4. **Confirmation** : preview side-by-side + log raison

### TODO-TRANS-5 — UI Bouton "Transférer aéroport" (P0)
- **Fichier** : `/pro/voyages/[id]/transport/avion/page.tsx`
- **Action** : ajouter bouton primary "✈️ Transférer ce voyage vers un autre aéroport" en header
- **Aussi** : Quick Link dans voyage détail + entrée dans QUICK_LINKS

### TODO-TRANS-6 — Composant comparatif Source vs Target (P1)
- **Fichier** : `/pro/voyages/[id]/transfert-aeroport/components/SymphonyDiff.tsx`
- **UI** : 2 colonnes (source / target preview)
- **Items conservés** : ✅ vert, items réinitialisés : 🔄 orange, items modifiés : ⚠️ jaune

### TODO-TRANS-7 — Historique transferts (P0)
- **Fichier** : `/pro/voyages/[id]/transfert-aeroport/historique/page.tsx`
- **UI** : timeline tous les transferts (source ou cible) avec :
  - Aéroport source → cible
  - Date + auteur
  - Lien vers les 2 voyages liés
  - Status (DRAFT | PUBLISHED | CANCELLED)

### TODO-TRANS-8 — Suggestions aéroports candidats (P1)
- **Fichier** : `backend/src/modules/travels/airport-suggestions.service.ts`
- **Logique** :
  1. Analyser preannounceInterests + waitlistEntries → comptage par ville
  2. Cartographier ville → aéroport principal (Lyon→LYS, Marseille→MRS)
  3. Top 10 par densité de demande
- **API** : `GET /airports/suggested?travelId=:id`

### TODO-TRANS-9 — Recalcul marge automatique (P1)
- **Fichier** : `travel-transfer.service.ts`
- **Logique** : après transfert, déclencher `recomputePricing` qui :
  - Vide `marginConfig.transport`
  - Marque voyage cible comme `PRICING_PENDING` (ne peut pas être publié sans nouveau quote transport)
  - Trigger event `transport.quote.requested`

### TODO-TRANS-10 — Conservation symphonie HRA (P0)
- **Fichier** : `travel-transfer.service.ts`
- **Logique** : copier intégralement
  - `hotelBlocks` (lien HRA hôtel + nuits)
  - `mealPlans` + `mealFormula` (HRA restos)
  - `mktActivityBookings` (HRA activités)
  - `teamMembers` (équipe terrain locale)
  - `programJson` (programme jour-par-jour)
- **Lien** : `targetTravel.transferredFromTravelId = sourceTravel.id`

### TODO-TRANS-11 — Quick Link + UI dashboard (P0)
- **Fichier** : `/pro/voyages/[id]/page.tsx`
- **Action** : entrée QUICK_LINKS "✈️ Transfert aéroport" + badge si historique non vide
- **Aussi** : afficher "Transferé depuis CDG" sur voyage cible

### TODO-TRANS-12 — Notification voyageurs (P0 — Légal)
- **Lien** : cf. AUDIT_ENRICHISSEMENT_VOYAGE.md TODO-ENR-3
- **Cas** : transfert d'aéroport est **TOUJOURS** une modification majeure (Directive UE 2015/2302)
- **Action** : déclencher automatiquement `TravelChangeNotification` sur le voyage source si bookings existants

---

## 4. Périmètre livré dans cette session

✅ **Livré (MVP)** :
1. Page `/pro/voyages/[id]/transfert-aeroport/page.tsx` — wizard 4 étapes
2. Page `/pro/voyages/[id]/transfert-aeroport/historique/page.tsx` — timeline
3. Service stub backend `travel-transfer.service.ts`
4. Controller `travel-transfer.controller.ts`
5. Service `airport-suggestions.service.ts`
6. Bouton "Transférer aéroport" dans transport avion
7. Quick Link voyage détail
8. Démo data + format Eventy gold #D4A853 + glassmorphism + Framer Motion

🔜 **Reporté (Phase 2)** :
- Migration Prisma `TravelAirportTransfer` (nécessite review DBA)
- Recalcul marge automatique (lien marginConfig)
- Lien réel HRA copy (dépend de finalisation HRA module)
- Notification automatique voyageurs (dépend de TODO-ENR-3)

---

## 5. Aéroports français de référence (constants frontend)

```ts
export const FR_AIRPORTS = [
  { code: 'CDG', city: 'Paris', name: 'Paris Charles-de-Gaulle', region: 'Île-de-France' },
  { code: 'ORY', city: 'Paris', name: 'Paris Orly', region: 'Île-de-France' },
  { code: 'LYS', city: 'Lyon', name: 'Lyon Saint-Exupéry', region: 'AURA' },
  { code: 'MRS', city: 'Marseille', name: 'Marseille Provence', region: 'PACA' },
  { code: 'NCE', city: 'Nice', name: 'Nice Côte d\'Azur', region: 'PACA' },
  { code: 'TLS', city: 'Toulouse', name: 'Toulouse Blagnac', region: 'Occitanie' },
  { code: 'BOD', city: 'Bordeaux', name: 'Bordeaux Mérignac', region: 'Nouvelle-Aquitaine' },
  { code: 'NTE', city: 'Nantes', name: 'Nantes Atlantique', region: 'Pays de la Loire' },
  { code: 'MPL', city: 'Montpellier', name: 'Montpellier Méditerranée', region: 'Occitanie' },
  { code: 'BES', city: 'Brest', name: 'Brest Bretagne', region: 'Bretagne' },
  { code: 'LIL', city: 'Lille', name: 'Lille Lesquin', region: 'Hauts-de-France' },
  { code: 'SXB', city: 'Strasbourg', name: 'Strasbourg-Entzheim', region: 'Grand Est' },
];
```
