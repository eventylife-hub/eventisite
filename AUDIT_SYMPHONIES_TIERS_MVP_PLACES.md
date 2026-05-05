# AUDIT — Symphonies × Tiers Eventy × MVP Places

> **Date** : 2026-05-05
> **Auteur** : Claude (assistant PDG Eventy)
> **Branche** : `claude/bold-kowalevski-c8da8e` (worktree `bold-kowalevski-c8da8e`)
> **Statut** : audit + premières adaptations code (sprint MVP places)
> **Règle absolue (CLAUDE.md)** : NE JAMAIS DÉCONSTRUIRE L'EXISTANT — toute amélioration s'ajoute aux composants V2 Standard / Premium / Luxe déjà déposés.
> **Confidentialité marges** : les pros voient UNIQUEMENT leur net (3% / 5% / 7% selon tier). La marge plateforme Eventy n'est JAMAIS exposée côté pro — visibilité complète uniquement côté admin/équipe.

---

## 0 · Demande PDG (rappel cadré ce 2026-05-05)

> *« Audit aussi pour les symphonies de création de voyage, les symphonies transport, côté premium et côté vue luxe. Ajuste les symphonies par rapport au mode du type de voyage. Normal eventy, premium, ou luxe. Beaucoup de réservations de places, d'avions, très peu d'avions complets, pratiquement pas. Si on arrive à réunir plusieurs symphonies ensemble, il faut que les équipes puissent intervenir sur une destination, un nombre de voyages. En MVP, focus sur la vente de place et la réservation de billets d'avion par place. »*

### Trois constats PDG à graver dans le code

1. **Réalité du marché aérien Eventy** : on vend des **places** sur des **vols réguliers commerciaux**. L'avion privatisé/charter complet est une **exception luxe** ou un cas multi-symphonies très bien rempli — **pas le MVP**.
2. **Symphonies = source de vérité unique** — pas de catalogue créateur séparé. On part TOUJOURS d'une symphonie existante (template Eventy ou symphonie précédente du créateur). Voyage = instance d'une symphonie + ajustements ponctuels.
3. **Hooks équipe Eventy** : quand plusieurs symphonies convergent sur même destination / même semaine → l'équipe doit pouvoir **regrouper**, **fusionner** ou **négocier en lot** (achats groupés vols, hôtels). Ce hook n'existait pas — il est créé dans ce sprint.

---

## 1 · État actuel du code (audit factuel)

### 1.1 Pages création voyage existantes

| Route | Capacité | Tier(s) | Composants clés | Statut |
|-------|----------|---------|-----------------|--------|
| `/pro/voyages/nouveau` (V1) | toutes | mix legacy | (page legacy historique) | ⚠️ legacy — préservée |
| `/pro/voyages/nouveau-v2` | 12-53 | **Standard + Premium** (toggle) | `TierSwitch`, `tier-presets.ts`, `PhaseSymphonySource`, `PhaseTwo`, `CapacityCalculator`, `BusSymphonyDrawer`, `PremiumOccurrencesMatrix` | ✅ refonte 2026-05-05 — toggle binaire |
| `/pro/voyages/nouveau-v2-luxe` | 4-12 | **Luxe** | `LuxeStepper`, `LuxeQuoteIA`, `LuxeConciergeValidation`, `LuxePhasePlaceholder`, `LuxeOccurrencesPanel`, `voyage-luxe-billing.ts` (capa jet ÷ pax réels) | 🟡 squelette — phases Palace/Transport/Activités placeholders |
| `/pro/voyages/multi` | — | multi-départs Premium | (existante) | 🟡 |

### 1.2 Helpers tier déjà déposés

- `nouveau-v2/_lib/tier-presets.ts` : presets capacité, marges, bus, pension par tier — Standard 38pax, Premium 16pax (capa jet/yacht côté Luxe).
- `nouveau-v2/_lib/voyage-margins-tiers.ts` : marges nets pro 3% / 5% / 7%.
- `nouveau-v2/_lib/voyage-premium-multi-departures.ts` : multi-départs Premium (existant).
- `nouveau-v2-luxe/_lib/voyage-luxe-billing.ts` : facturation Luxe = `coût total ÷ pax réels`.
- `nouveau-v2-luxe/_lib/voyage-luxe-capacity.ts` : capa jet/yacht.

### 1.3 Symphonies transport — état actuel par mode

| Mode | Standard (V2) | Premium (V2 toggle) | Luxe (V2-luxe) |
|------|---------------|---------------------|----------------|
| **Bus longue distance** | Bus 53/50/35/20p · `busFleetLongueDistance` · `BusSymphonyDrawer` · tournées sur place 40-42min | Minibus 20p · même mécanique · service VIP | Limousine + escorte · pas de bus |
| **Aérien** | `transportMode: 'avion'` · `avionCapacite` (1 vol entier !) · `FlightCard` mocké | idem Standard (toggle ne change rien) | `LuxeTransportPicker` (placeholder) — jets entiers |
| **Mixte avion + bus** | Logique `computeCapacity` aligne avion + bus locaux | idem | — |
| **Multi-modal** | partiel | partiel | — |
| **Réservation par place (vols réguliers)** | ❌ **NON IMPLÉMENTÉ** | ❌ **NON IMPLÉMENTÉ** | non pertinent (jets privés) |
| **Allotement / charter privatisé** | TODO seulement | TODO | jets entiers OK |

> **Trou critique identifié** : la totalité de la logique `transportMode: 'avion'` part du principe que l'avion **entier** est privatisé (`avionCapacite` = nombre de places de l'avion privatisé). C'est l'**inverse** de la réalité Eventy MVP : on vend N places sur un vol commercial où Air France/Iberia/Ryanair vend les autres places à leurs clients.

### 1.4 Symphonies transport — ce qui existe vs ce qu'il faut

**Existe déjà** ✅
- Bus longue distance multi-tailles (20/35/50/53)
- Tournées sur place configurables (Matin 1-N / Aprem 1-3 / Soir 1-2 — `bus-tournees-auto.ts`)
- Hubs de transport (`transport-hubs.ts`) — aéroport / port / gare / dépôt bus
- Capacity calculator avion ↔ bus locaux
- Multi-départs Premium
- Facturation Luxe capa jet ÷ pax réels
- Page équipe `/equipe/transport/billets-surplus` (revente places non remplies)

**Manque pour MVP places** ❌
- Mode `flight` distinct du mode `avion-prive` (vol commercial vs charter)
- Modèle de **réservation par siège** sur vols réguliers (PNR allotement / GDS)
- Affichage net pro masqué de la marge Eventy sur les billets achetés à l'unité
- Hook équipe pour **agréger plusieurs symphonies** sur même destination / même semaine
- Page équipe `/equipe/symphonies-multi` permettant de :
  - lister voyages convergents
  - proposer fusion / regroupement achat
  - négocier blocs de sièges (10+, 20+, 50+)
  - basculer entre "places sur vol commercial" → "charter complet" si seuil atteint

---

## 2 · Architecture proposée — 3 modes transport × 3 tiers

### 2.1 Matrice des modes transport selon tier

| Mode transport | Standard | Premium | Luxe | Notes |
|----------------|----------|---------|------|-------|
| `bus-longue-distance` | ✅ par défaut | ✅ minibus VIP 20p | ❌ | bus négocié forfait par Eventy |
| `train-1ere` | ✅ option | ✅ par défaut | ✅ option | SNCF Pro (TGV Pro), TGV Lyria, Eurostar Business |
| `flight-seats` (places sur vol commercial) | ✅ **MVP** | ✅ **MVP** | ❌ | **MODE PRINCIPAL MVP — NEW** |
| `flight-charter` (avion entier privatisé) | 🟡 exception multi-symphonies | 🟡 exception | ❌ | déclenchable par équipe Eventy si seuil atteint |
| `private-jet` | ❌ | ❌ | ✅ **par défaut** | jet entier 4-12 places |
| `helicoptere-prive` | ❌ | ❌ | ✅ option | transferts spectacle |
| `yacht` | ❌ | ❌ | ✅ option | méditerranée — Burgess / Camper |
| `limousine-escorte` | ❌ | 🟡 transferts | ✅ par défaut | sur place luxe |
| `voiture-prive` | ❌ | ✅ transfert | ✅ ✓ | UberX, Carey, Diva |
| `bus-sur-place` | ✅ tournées | ✅ minibus VIP | ❌ | tournées 40-42min Eventy |

### 2.2 Différences options **par tier** (synthèse vue créateur)

| Options affichées | Standard | Premium | Luxe |
|-------------------|----------|---------|------|
| Toggle "vol entier ↔ places" | ❌ — verrouillé "places" | ❌ — verrouillé "places" | n/a (jets) |
| Catalogue vols commerciaux | Air France · Vueling · Ryanair · Volotea · Easyjet | + Iberia · Lufthansa · Swiss · British Airways · Air Europa | n/a |
| Allotement (N places sur vol) | 1-30 places suggéré | 1-20 places suggéré | n/a |
| Class booking | éco | éco premium / business | first / private |
| Bagages inclus | option (cabine seul) | toujours soute | toujours soute + soute supplémentaire |
| Remboursable | rarement | option flexi+ | toujours flexi+ |
| Délai de blocage des sièges | 48h | 24h | n/a (jet exclusif) |
| Marge plateforme visible | ❌ jamais | ❌ jamais | ❌ jamais |
| Net créateur visible | 3% net brut | 5% net brut | 7% net brut |

> **Règle confidentialité PDG** rappelée : seuls les pourcentages **nets pro** sont visibles côté créateur. La marge plateforme (différence entre prix vol acheté Eventy vs prix vol facturé voyageur) n'apparaît JAMAIS dans `/pro/...`. Côté admin/équipe (`/admin/...`, `/equipe/...`) la marge est entièrement visible et négociable.

### 2.3 Modèle de symphonie transport (nouveau type)

Le helper proposé (`symphonie-transport-tiers.ts`) modélise une **symphonie transport** comme un objet avec :
- `mode` : type de transport principal (cf. matrice 2.1)
- `tier` : standard | premium | luxe
- `seatStrategy` : `'seats-on-commercial'` | `'whole-bus'` | `'whole-flight'` | `'private-jet'` | `'private-yacht'`
- `seatAllotment` : { min, recommended, max } pour les modes seats
- `aggregationHooks` : flags pour détecter si l'équipe Eventy peut fusionner avec d'autres symphonies (même destination, même semaine)
- `displayLevel` : ce que voit le créateur vs ce que voit l'équipe (filtres confidentialité)

---

## 3 · Mode "MVP places" — réservation par siège

### 3.1 Workflow MVP

```
Créateur (Standard ou Premium)
  └─ Symphonie transport "flight-seats"
       ├─ Aéroport départ (hub) + Aéroport arrivée (hub)
       ├─ Compagnie souhaitée (Air France | Iberia | Ryanair | …)
       ├─ Allotement souhaité : 12 places (par exemple)
       ├─ Date(s) souhaitée(s)
       └─ Validation auto → équipe Eventy bookée backend
                                ↓
                  ┌─────────────┴─────────────┐
                  ↓                           ↓
         Cas A — vol commercial      Cas B — Eventy détecte
         (cas par défaut MVP)        plusieurs symphonies
         Eventy achète N places      sur même rotation
         à l'unité via GDS           → propose fusion charter
                                       (si N total ≥ seuil)
```

### 3.2 Tarification MVP

- **Vue créateur** : prix vol pax = prix moyen pondéré du marché × marge appliquée (helper `voyage-margins-tiers.ts`).
- **Vue équipe** : prix vol pax négocié réel + marge Eventy + commission créateur 3% (Standard) ou 5% (Premium).
- **Hook réfaction** : si Eventy bascule en charter (seuil atteint), le coût unitaire baisse mécaniquement → l'équipe peut soit garder la marge (rentabilité accrue) soit baisser le prix public (attractivité).

### 3.3 Statuts de places à modéliser (TODO backend)

```ts
type SeatBookingStatus =
  | 'wishlist'      // créateur a juste exprimé l'envie
  | 'requested'     // équipe Eventy a reçu la demande
  | 'allocated'     // équipe a réservé N places auprès de la compagnie
  | 'confirmed'     // PNR généré, places fermes
  | 'partially_sold'
  | 'fully_sold'
  | 'overbooked'    // plus de demandes que de places réservées → escalade équipe
  | 'released';     // équipe relâche les places non vendues (J-7)
```

### 3.4 Hooks équipe Eventy — agrégation multi-symphonies

L'équipe doit voir, dans une seule page (`/equipe/symphonies-multi`) :
- Toutes les symphonies actives convergent vers même `destination + semaine`
- Total places demandées agrégé
- Recommandation auto : "fusion bénéfique" ou "garder séparé"
- Action 1-clic : "négocier en bloc" (génère email/template fournisseur)
- Bascule possible : `flight-seats` × N symphonies → `flight-charter` (si total ≥ 80 places, par exemple)

---

## 4 · Plan code — sprint actuel

### 4.1 Fichiers créés / modifiés ce sprint

| Fichier | Type | Description |
|---------|------|-------------|
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/symphonie-transport-tiers.ts` | NEW | Modélise les variations transport par tier + helper agrégation MVP places |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/FlightSeatBookingPanel.tsx` | NEW | Composant UI Standard/Premium pour réservation par place sur vol commercial |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-premium/page.tsx` | NEW | Page Premium dédiée (réutilise V2 mais oriente UX Premium) |
| `frontend/app/(equipe)/equipe/symphonies-multi/page.tsx` | NEW | Cockpit équipe : agrégation multi-symphonies, négociation bloc, fusion charter |

### 4.2 Pages préservées (RÈGLE PDG : ne rien effacer)

- `/pro/voyages/nouveau-v2/page.tsx` → conservée intégralement
- `/pro/voyages/nouveau-v2-luxe/page.tsx` → conservée intégralement
- `_lib/tier-presets.ts` → conservé, exporte VoyageTier toujours `'standard' | 'premium'`
- Toutes les pages `(pro)/pro/voyages/*` legacy → conservées

### 4.3 Pages futures (à dérouler en sprints suivants)

| Sprint | Page | Description |
|--------|------|-------------|
| S1 | `/pro/voyages/nouveau-v2/_components/PhaseTwo.tsx` | Brancher `FlightSeatBookingPanel` quand mode = avion |
| S1 | `/equipe/transport/seat-allotments` | Pipeline équipe : demandes places créateurs |
| S2 | `/equipe/symphonies-multi/[destinationId]` | Détail fusion par destination |
| S2 | Backend : `POST /pro/symphonies/transport/seat-request` | API demande allotement |
| S3 | Backend : intégration GDS (Amadeus / Sabre) | Réservation auto places vols commerciaux |
| S3 | `/admin/transport/marges` | Vue marge globale Eventy par voyage (admin only) |
| S4 | Backend : ML pour prédire seuil charter rentable | Reco auto fusion charter à l'équipe |

---

## 5 · Confidentialité marges — vérifications

| Vue | Voit la marge Eventy ? | Voit son net | Voit le coût négocié | Notes |
|-----|------------------------|--------------|----------------------|-------|
| Créateur Standard | ❌ | ✅ 3% net | ❌ | seul son net brut |
| Créateur Premium | ❌ | ✅ 5% net | ❌ | idem |
| Créateur Luxe | ❌ | ✅ 7% net | ❌ | idem (même règle, montants plus gros) |
| Vendeur (5%) | ❌ | ✅ 5% net | ❌ | idem |
| Ambassadeur | ❌ | ✅ commission | ❌ | idem |
| HRA / loueur | ❌ | ✅ son prix négocié uniquement | partiellement | il voit son propre coût, pas la marge HRA Eventy |
| Équipe Eventy | ✅ complet | ✅ tout | ✅ tout | accès finance complet |
| Admin / PDG | ✅ complet | ✅ tout | ✅ tout | écosystème complet |

> **Vérifié à l'audit 2026-05-05** : `voyage-margins-tiers.ts` retourne uniquement le champ `netCreatorPercent` côté pro. Les helpers cascade Eventy (`lib/finance/cascade.ts`) ne sont pas importés dans les composants `(pro)/...`.

---

## 6 · TODO Eventy détaillé (backend + intégrations)

```ts
// TODO Eventy: API GDS Amadeus/Sabre pour booking places vols commerciaux
// TODO Eventy: API IATA/BSP pour règlement compagnies
// TODO Eventy: webhook airlines pour statut PNR (confirmé / annulé / surclassé)
// TODO Eventy: algo ML reco seuil charter (à partir de combien de places agrégées on bascule)
// TODO Eventy: contrat allotement-cadre avec compagnies récurrentes (Air France, Vueling)
// TODO Eventy: workflow équipe demande allotement → réponse compagnie 24h
// TODO Eventy: pipeline d'agrégation symphonies par (destination, semaine, tier)
// TODO Eventy: notifications équipe quand seuil agrégation atteint (Slack + email)
// TODO Eventy: vue admin marge globale par voyage (jamais visible côté pro)
// TODO Eventy: relâchement auto places non vendues à J-7 (revente billets-surplus)
// TODO Eventy: passerelle billets-surplus ↔ marketplace clients (revente automatique)
// TODO Eventy: tarification dynamique selon demande agrégée (yield management Eventy)
// TODO Eventy: calendrier équipe prévisionnel achats blocs vols (rolling 90 jours)
// TODO Eventy: KPI équipe — taux de remplissage / taux de fusion charter / marge moyenne
// TODO Eventy: i18n EN/ES/IT/DE pour pages allotement (clientèle européenne phase 2)
```

---

## 7 · Risques et points d'attention

- **Réglementation** : revente de places vols commerciaux soumise aux conditions des compagnies (cession PNR souvent interdite hors agrément IATA/Atout France) → garantir que le contrat allotement Eventy autorise la sous-vente nominative.
- **Trésorerie** : payer Air France à 30 jours mais encaisser voyageur à J-90 → cash positif, mais risque d'annulations massives = remboursement.
- **Fusion charter** : si Eventy bascule en charter mais ne remplit pas → perte sèche. Le seuil de bascule doit être **conservateur** (150% du minimum charter).
- **Confidentialité** : un ingénieur qui copie un helper backend dans un composant `(pro)/...` peut accidentellement exposer la marge → mettre un lint custom (`no-eventy-margin-in-pro`) en sprint sécurité.
- **Ne pas casser V2 Standard** : règle absolue CLAUDE.md — chaque ajout est additif.

---

## 8 · Liens

- [V2 Standard actuelle](frontend/app/(pro)/pro/voyages/nouveau-v2/page.tsx)
- [V2 Luxe actuelle](frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/page.tsx)
- [Helper tier presets](frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/tier-presets.ts)
- [Helper symphonie transport tiers (NEW)](frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/symphonie-transport-tiers.ts)
- [Page Premium dédiée (NEW)](frontend/app/(pro)/pro/voyages/nouveau-v2-premium/page.tsx)
- [Cockpit équipe symphonies-multi (NEW)](frontend/app/(equipe)/equipe/symphonies-multi/page.tsx)
- [Audit V2 Premium/Luxe préparation](AUDIT_V2_PREMIUM_LUXE_PREPARATION.md)
- [Audit création voyage complet](AUDIT-CREATION-VOYAGE-COMPLET.md)
- [Audit symphonie marketing](AUDIT_SYMPHONIE_MARKETING_COMPLETE.md)
- [Charter multibus sprint](CHARTER-MULTIBUS-SPRINT.md)

---

## 9 · Décisions PDG actées 2026-05-05

1. ✅ MVP transport aérien = **réservation par place sur vol commercial**, pas charter.
2. ✅ Symphonies = source de vérité unique, pas de catalogue créateur séparé.
3. ✅ Hook équipe `/equipe/symphonies-multi` créé pour agrégation multi-voyages.
4. ✅ Page Premium séparée `/pro/voyages/nouveau-v2-premium` — facilite l'orientation UX et permet de trier les analytics par tier sans changer V2 standard.
5. ✅ Confidentialité marges : pros voient uniquement leur net (3% / 5% / 7%) — règle absolue.
6. ✅ Charter privatisé = exception luxe ou multi-symphonies très rentables — décision équipe Eventy uniquement.

---
*Audit pré-MVP — adapté au modèle voyage en groupes Eventy 2026.*
