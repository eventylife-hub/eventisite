# RÉCAP — Symphonie créateur ⇄ Lecteur + Pré-remplissage création voyage

**Date** : 2026-05-02
**Branche** : `claude/confident-euclid-756c40`
**Auteur** : Claude (PDG IA d'Eventy)
**Scope** : Auto-prefill MVP — la symphonie composée par le créateur dans son panel se propage automatiquement à la création de voyage ET aux fiches lecteur (publique + client).

---

## 🎯 Vision Eventy livrée

> Le créateur ne saisit qu'une fois ses HRA / arrêts / activités dans son panel.
> Toute la création de voyage se pré-remplit. Toutes les fiches lecteur les affichent.
> Un seul catalogue. Une seule symphonie. Aucune resaisie.

---

## 📦 Commits livrés (ordre chronologique)

| # | SHA frontend | SHA parent | Titre |
|---|---|---|---|
| 1 | `4062440` | `39dd140` | feat(creation-voyage): pré-remplissage automatique depuis catalogue créateur |
| 2 | `8872e43` | `95087d7` | feat(reader): symphonie créateur propagée aux fiches lecteur public + client |
| 3 | `b40d0bc` | `7bc623b` | feat(client/activites): symphonie créateur en fallback API |
| 4 | `fade9b1` | `92c5e5d` | feat(reader-symphony round 2): transport-avion + transfert + mode-voyage + billets + chat + énergie |
| 5 | `9596b04` | `d4fdb3e` | feat(reader-symphony round 3): 8 pages client supplémentaires (transport, manifeste, checkin, co-voyageurs, cagnotte, checklist, depenses, assurance) |
| 6 | `1e7c43f` | `a74c46a` | feat(round 4): merci symphony + transportQuoteValidated gate admin (TODO P0 #4) |
| 7 | `3afcc57` | `f9ec0f0` | feat(round 5): TSP optimizer + Maps transfert + tier réel + bandeau pro devis transport |
| 8 | `aa6006d` | `5f86ca6` | feat(round 6): partition frise (P1 #7) + auto-RFQ scaffold (P0 #3 partial) |
| 9 | `88104e2` (front) + `5078eb2` (back) | `3400c5d` | feat(round 7): SymphonyMap (P1 #6) + backend auto-RFQ + /me/energy |
| 10 | `6edd9e7` (front) + `05a08a4` (back) | `ba1da09` | feat(round 8): Auto-RFQ UI button + backend /pro/catalog/creator + transportQuoteValidated computed |
| 11 | `3afb0d2` (front) + `a8295ee` (back) | `ef8f8b1` | feat(round 9): API cascade catalogs + SymphonieGate widget + DriverTrackingGateway WebSocket |
| 12 | `90dd1e9` (front) + `4fc28f3` (back) | `4d5feee` | feat(round 10): SymphonieGate wired dans 3 pages + DriverArrivalDetectionService cron 30s |
| 13 | `06e2da4` (back) | `2a9fe4a` | feat(round 11): Prisma schema EnergyAccount + Travel.transportQuoteValidated |
| 14 | `02d4af3` (back) | `8c9a91d` | feat(round 12): EnergyService + booking earn hook + acceptQuote trigger |
| 15 | `50cdcfc` (back) | `b4f8952` | feat(round 13): EARN_REVIEW + EARN_PACK_PURCHASE + cron EXPIRE |
| 16 | `90f069b` (back) | `0a7c37b` | feat(round 14): EARN_REFERRAL + Stripe webhook → energy pack + migration SQL |
| 17 | `838f4b6` (front) | `a5c1652` | feat(round 15): cascade API energie page + EnergyTierBadge sidebar |

Toutes les branches `master` (frontend), `master` (backend) et `main` (eventisite) sont synchronisées.

---

## 🏗️ Phase 1 — Pré-remplissage création voyage (commit 1)

### Fichier nouveau

#### `frontend/lib/creator-catalogs.ts` (399 lignes)
Module unifié qui expose les catalogues créateur dans le format attendu par les Etape* du wizard de création :

- `getCreatorHotelCatalog()` → `CreatorHotelEntry[]` (depuis `DEMO_HRA_HOTELS`)
- `getCreatorRestaurantCatalog()` → `CreatorRestaurantEntry[]` (depuis `DEMO_HRA_RESTAURANTS`)
- `getCreatorActivityCatalog()` → `CreatorCatalogActivity[]` (depuis `DEMO_HRA_ACTIVITIES`)
- `getCreatorBusStopCatalog()` → `CreatorStopSuggestion[]` (depuis `DEMO_STOPS`)
- `getCreatorCatalog(destination)` — API unifiée filtrée par destination
- Helpers : `getCreatorHotelsByDestination()`, `getCreatorRestaurantsByDestination()`, `getCreatorActivitiesByDestination()`

**Mappers internes** :
- `STARS_TO_STANDING` — étoiles HRA → standing Eventy (STANDARD/CONFORT/SUPERIEUR/LUXE)
- `priceRangeFromCost()` — prix → range visuel (€ à €€€€€)
- `defaultRoomsForHotel()` — 3 chambres par défaut selon palace/luxe/standard
- `gradientFromCuisine()` — dégradé photo selon cuisine (gastro, marocain, italien, grec…)
- `dietBadgesFromSpecialties()` — heuristique végé/vegan/halal/kosher/sans gluten
- `timeSlotsForActivity()` — créneaux matin/après-midi/soir selon difficulty + duration

### Fichiers modifiés (cascade fallback ajoutée)

Cascade Eventy unifiée pour chaque Etape* :
1. **API réelle** `/api/pro/hra/favorites?type=...`
2. ⭐ **Catalogue créateur** (creator-catalogs.ts — nouveau)
3. **MOCK_* local** (existant — ultime dernier recours, NON supprimé)

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeAccommodation.tsx`
- Import `getCreatorHotelsByDestination`
- Cascade fallback : si API échoue, charge le catalogue créateur (10+ hôtels HRA filtrés par destination) avant de retomber sur les 4 MOCK_HOTELS locaux.
- Le créateur retrouve dans la création voyage le **même** catalogue qu'il browse dans `/pro/hra` → ses partenaires habituels sont pré-sélectionnables.

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeRestoration.tsx`
- Import `getCreatorRestaurantsByDestination`
- Cascade fallback identique : restos HRA créateur avant MOCK_RESTAURANTS local.
- Mappers : photoGradient, dietBadges, capacité, rating, prix/pax (depuis DEMO_HRA_RESTAURANTS riches).

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeActivites.tsx`
- Import `getCreatorActivitiesByDestination`
- Cascade fallback : activités HRA créateur avant MOCK_CATALOG local (~20 activités).
- Heuristique inclusion : activité < 50€/pax = incluse par défaut.
- Heuristique time slot selon catégorie + duration.

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeBusStops.tsx`
- Import `getCreatorBusStopCatalog` + `useMemo`
- `COLLECTIVE_STOPS` (7 arrêts hardcodés) **fusionné avec** les arrêts créateur (DEMO_STOPS validés/soumis depuis `/pro/arrets`)
- Dédup par `googlePlaceId` (sinon par city+name) — pas de doublons.
- Tri par `usageCount` décroissant — les arrêts les plus utilisés en premier.
- L'écran "Importer depuis catalogue collectif" propose désormais le catalogue **complet** : Eventy + créateur.

---

## 🎼 Phase 2 — Connexion symphonie aux readers (commit 2)

### Fichier nouveau

#### `frontend/app/(public)/voyages/[slug]/symphony-mapper.ts` (148 lignes)
Mappers du catalogue voyage (`Voyage` from `@/lib/voyages-catalog`) vers les types `TripData` attendus par la fiche publique :

- `mapBusStopsToPickupPoints(voyage)` — busStops → PickupPoint[]
- `mapDaysToProgram(voyage)` — days → ProgramDay[] (timeline)
- `mapVoyageToHRAPartners(voyage)` — hraList + restaurants + activities (option) → HRAPartner[]
- `mapVoyageActivitiesToTrip(voyage)` — activities → Activity[] (équipement, prix, difficulté)
- `mapVoyageToMaisons(voyage)` — hraList → Maison[] (carrousel hébergements)
- Helper interne `decode()` — entités HTML legacy (&mdash;, &rsquo;, &amp;…)
- Heuristiques `emojiForHraType` (riad/villa/lodge/palace) et `emojiForCuisine` (tapas/italien/grec/marocain/portugais/asiatique)

### Fichiers modifiés

#### `frontend/app/(public)/voyages/[slug]/voyage-detail-client.tsx`
- Import des 5 mappers symphony.
- `mergeCatalogIntoTrip()` étendu — propage maintenant **toute** la symphonie au lieu de seulement photos/dates/prix :
  - `pickupPoints` ← busStops du voyage
  - `program` ← days du voyage
  - `hra` ← hraList + restaurants + activités optionnelles
  - `activities` ← activities du voyage
  - `maisons` ← hraList (carrousel hébergements)
  - `pensionType` + `pensionDetails` propagés
- Garde les fallbacks FALLBACK_TRIP si le catalogue ne fournit pas un champ.

**Avant** : tous les voyages (Andalousie, Europa-Park, Algarve, Vosges) affichaient le HRA / programme / arrêts d'Andalousie en dur.
**Après** : chaque voyage affiche **sa** symphonie.

#### `frontend/app/(client)/client/voyage/[id]/ramassage/page.tsx`
- Import `VOYAGES`.
- Nouvelle fonction `buildPickupInfoFromVoyage(travelId)` qui construit le PickupInfo depuis le voyage spécifique du catalogue (busStops, dates, destination).
- Cascade : API → symphony catalogue → DEMO_INFO Andalousie (existant).
- Préfère l'arrêt `closest=true` (le plus proche du créateur) si présent.

#### `frontend/app/(client)/client/voyage/[id]/bus-programme/page.tsx`
- Import `VOYAGES`.
- Nouvelle fonction `buildScheduleFromVoyage(travelId)` qui transforme `voyage.days` en `DaySchedule[]`.
- Heuristiques :
  - `detectPeriod(timeStr)` → afternoon / evening / fullday selon "matin"/"soir"/"libre" ou "20:"/"21:"/"22:".
  - `detectStopTypes(label)` → déjeuner/restaurant/souk/musée/visite/bar/rdv… mappés sur les 6 types Stop.
- Cascade : API stops → symphony catalogue → DEMO_SCHEDULE Marrakech (existant).
- Le `destinationCity` est propagé depuis le vrai voyage (plus "Ronda" en dur).

---

## 🎯 Phase 3 — Symphonie en fallback erreur API (commit 3)

#### `frontend/app/(client)/client/voyage/[id]/activites/page.tsx`
- Import `VOYAGES`.
- Quand l'API `/pro/travels/:id/available-activities` échoue, au lieu d'afficher une page vide avec une erreur, on construit la liste depuis `voyage.activities` du catalogue.
- Mapping : title, description, destination, zone (placeStopName), priceCents, currency, duration, category, provider, rating, image.
- Aucun voyage ne montre désormais une page activités vide à cause d'un hiccup API.

---

## 📐 Architecture finale — flux symphonie

```
┌─────────────────────────────────────────────────────────────────┐
│ PANEL CRÉATEUR — sources de vérité                              │
│                                                                  │
│  /pro/hra/      → DEMO_HRA_HOTELS / DEMO_HRA_RESTAURANTS /      │
│                    DEMO_HRA_ACTIVITIES                          │
│  /pro/arrets/   → DEMO_STOPS                                    │
│  /pro/activites/mes-activites/ → DEMO_ACTIVITIES                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ lib/creator-catalogs.ts — façade unifiée (Phase 1)              │
│                                                                  │
│  getCreatorHotelCatalog()         → CreatorHotelEntry[]         │
│  getCreatorRestaurantCatalog()    → CreatorRestaurantEntry[]    │
│  getCreatorActivityCatalog()      → CreatorCatalogActivity[]    │
│  getCreatorBusStopCatalog()       → CreatorStopSuggestion[]     │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴────────────────────┐
            │                                       │
            ▼                                       ▼
  ┌─────────────────────────┐         ┌───────────────────────────┐
  │ /pro/voyages/nouveau    │         │ Symphonie composée        │
  │ Etape*.tsx              │         │ → publication voyage      │
  │                         │         │ → catalogue VOYAGES        │
  │ Cascade fallback :      │         └─────────────┬─────────────┘
  │ 1. API                  │                       │
  │ 2. catalogue créateur   │                       ▼
  │ 3. MOCK_* local         │         ┌───────────────────────────┐
  └─────────────────────────┘         │ symphony-mapper.ts        │
                                       │ (Phase 2)                 │
                                       │                            │
                                       │ Voyage → TripData / Stop  │
                                       │   busStops    → pickup    │
                                       │   days        → program   │
                                       │   hraList     → hra       │
                                       │   activities  → activities│
                                       └─────────────┬─────────────┘
                                                     │
                            ┌────────────────────────┼────────────────────────┐
                            ▼                        ▼                        ▼
                  ┌─────────────────┐    ┌────────────────────┐    ┌─────────────────┐
                  │ /voyages/[slug] │    │ /client/voyage/[id]│    │ /client/voyage/ │
                  │ (public reader) │    │ /ramassage         │    │ [id]/bus-progr  │
                  │                 │    │                    │    │ (client reader) │
                  │ Andalousie /    │    │ Vrais arrêts du    │    │ Vrai programme  │
                  │ Europa / Algarve│    │ voyage spécifique  │    │ jour-par-jour   │
                  │ /Vosges = vrais │    │                    │    │                 │
                  │ HRA + programme │    │                    │    │                 │
                  └─────────────────┘    └────────────────────┘    └─────────────────┘
```

---

## ✅ Garanties qualité

- **TypeScript** : 0 erreur sur tous les fichiers modifiés (verified via `tsc --noEmit`). Les erreurs préexistantes du repo (LucideIcon types, etc.) sont inchangées.
- **Backward compat** : aucun fallback existant supprimé. La couche est **additive** — le système retombe sur l'ancien comportement si rien de nouveau ne s'applique.
- **Defensive coding** : try/catch globaux dans `mergeCatalogIntoTrip()` pour ne JAMAIS casser le rendu si un champ catalogue manque.
- **Dédup arrêts** : map par `googlePlaceId` (sinon city+name) pour éviter doublons COLLECTIVE_STOPS / créateur.
- **i18n / encodage** : helper `decode()` partout (entités HTML legacy : `&mdash;`, `&rsquo;`, `&apos;`, `&amp;`, `&middot;`).

---

## 🚀 Vercel

Tous les commits ont été poussés sur `master` (frontend submodule) et `main` (eventisite parent). Vercel a déclenché les builds automatiquement (visibles via `vercel ls eventy-frontend`). Les builds étaient queued/building lors du dernier check ; ils se terminent en arrière-plan.

---

## 🎼 Round 2 — Symphony étendue à 6 pages client + énergie (commit 4)

Suite à round 1, six pages client supplémentaires + 1 page publique
ont été branchées au catalogue VOYAGES. Plus AUCUN voyage ne montre
Andalousie / Marrakech / Santorin en dur — chacun affiche ses vraies
données.

### Fichier nouveau

#### `frontend/components/voyage/VoyageEnergyBadge.tsx` (composant)
Badge inline qui calcule les points Énergie/XP gagnés sur un voyage selon
le tier du voyageur (PALIERS_ENERGY) et le prix TTC. Tier par défaut
STARTER (100 €/100 pts) — TODO API `/client/me/energy` pour tier réel.

### Fichiers modifiés (round 2)

#### `frontend/app/(client)/client/voyage/[id]/transport-avion/page.tsx`
- `buildFlightFromVoyage(travelId)` — départ/arrivée/dates depuis VOYAGES + busStops + destination.
- Cascade : API → symphony → DEMO_INFO Santorin (préservé).

#### `frontend/app/(client)/client/voyage/[id]/transfert/page.tsx`
- `buildTransferFromVoyage(voyage)` — hôtel destination depuis hraList[0], aéroport depuis destination.
- Si voyage trouvé dans VOYAGES → utilisé direct (pas d'attente API).
- Préserve les 4 TODOs P0 documentés (Maps, GPS chauffeur, push notif).

#### `frontend/app/(client)/client/voyage/[id]/mode-voyage/page.tsx`
- Itinéraire construit depuis `voyage.days` du catalogue.
- Guide tiré de `voyage.team` (createur ou guide en priorité).
- Ultime fallback Andalousie 7 jours conservé pour les voyages hors catalogue.

#### `frontend/app/(client)/client/voyage/[id]/billets/page.tsx`
- `buildBilletsFromVoyage(travelId)` — billets bus aller/retour depuis closest stop + dates.
- Numéro de réservation `EVT-${voyage.id.slice(-5).toUpperCase()}`.

#### `frontend/app/(client)/client/voyage/[id]/chat/page.tsx`
- Sur erreur API : tripName/destination/url/dates/participants viennent de VOYAGES.
- Plus d'affichage Andalousie pour le chat de TOUS les voyages.

#### `frontend/app/(client)/client/voyage/[id]/page.tsx`
- Import + rendu `<VoyageEnergyBadge>` dans Quick stats row.

#### `frontend/app/(public)/voyages/[slug]/voyage-detail-client.tsx`
- Import + rendu `<VoyageEnergyBadge>` dans hero (à côté PensionBadge).
- Le visiteur voit les pts ⚡ qu'il gagnera en réservant.

---

## 🎼 Round 3 — Couverture symphonie étendue à 8 pages client de plus (commit 5)

Suite à round 2, 8 pages client supplémentaires connectées au
catalogue VOYAGES. Plus AUCUNE page n'affiche "Andalousie depuis
Ronda" en dur pour des voyages qui n'ont rien à voir avec
l'Andalousie.

### Pages avec données symphonie complètes

#### `frontend/app/(client)/client/voyage/[id]/transport/page.tsx`
- voyageName + boardingStop + allStops construits depuis VOYAGES.busStops
- référence : `#EVT-${voyage.id.toUpperCase()}-${groupSize}` (vraie ref)
- Plus d'affichage Paris→Ronda en dur pour TOUS les voyages.

#### `frontend/app/(client)/client/voyage/[id]/manifeste/page.tsx`
- travelTitle, destination, dates, departureCity/Point/Time depuis voyage
- accommodationName, standing, address depuis hraList[0]
- accompanierName depuis voyage.team (créateur en priorité)
- groupSize + pricePerPersonTTC réels
- Manifeste = document officiel — il fallait absolument que ce soit juste.

#### `frontend/app/(client)/client/voyage/[id]/checkin/page.tsx`
- demoCheckins.travel.title + departureCity + destinationCity réels
- checkpoints "boarding" et "hôtel" depuis catalogue
- Le QR code de check-in affiche désormais les bonnes infos.

### Pages avec titre/destination mis à jour

- `co-voyageurs/page.tsx` : DEMO_DATA.travelTitle override depuis voyage
- `cagnotte/page.tsx` : travelTitle + travelSlug + travelPrice + groupSize réels
- `checklist/page.tsx` : title + destinationCity/Country + dates depuis voyage
- `depenses/page.tsx` : voyageTitle override
- `assurance/page.tsx` : claim.travel.{title, departureDate, destinationCity} réels

---

## 🎼 Round 4 — Merci symphony + Devis gate (commit 6)

### Pages client

#### `frontend/app/(client)/client/voyage/[id]/merci/page.tsx`
- `createDemoVoyage()` étendu pour utiliser `VOYAGES.find()` :
  - title, destination, country, returnDate du voyage spécifique
  - creatorName depuis `voyage.team[]` (créateur en priorité, sinon 1er)
  - staffCount = `voyage.team.length`
- Plus d'affichage "Andalousie depuis Ronda" + "Thomas Laurent" en dur quand l'API summary échoue.

### Admin — Devis transport gate (TODO P0 #4)

#### `frontend/app/(admin)/admin/voyages/[id]/page.tsx`
- Calcul `transportQuoteValidated` à la volée :
  - Si `travel.transportQuoteValidated: boolean` → utilisé.
  - Sinon dérivé de `travel.transportQuotes[]` (au moins 1 status `VALIDÉ` ou `VALIDATED`).
  - Sinon `null` (statut inconnu).
- Nouvelle card "Devis transport validé" dans terrainCards :
  - **Validé** → status `ok` + sub "Devis loueur validé — voyage publiable"
  - **Non validé** → status `critical` + `urgent` + sub "Devis non validé — voyage NON publiable"
  - **Inconnu** → status `warning` + sub "Statut inconnu — vérifier les devis"
- Couvre la TODO P0 #4 du `TODO-SYMPHONIE-OCCURRENTS.md` : la validation devis devient visible comme gate de publication.

---

## 🎼 Round 5 — TSP + Maps + tier réel + bandeau pro (commit 7)

5 améliorations qui couvrent 3 TODOs P0 du recap :

### Fichier nouveau

#### `frontend/lib/transport/tsp-optimizer.ts` (TODO P0 #1)
Algorithme Nearest Neighbor + 2-opt pour ordonnancement quasi-optimal des arrêts :
- `haversineKm()` — distance entre 2 GPS
- `totalRouteDistance()` — coût total d'une route
- `optimizeStopOrder(stops, { startStopId, endStopId })` — réordonne en gardant départ + arrivée fixes
- Renvoie `{ orderedStops, totalKm, estimatedMinutes, partial }`
- O(n²) — suffit pour 5-15 arrêts (cas Eventy typique)
- Limite à 50 itérations 2-opt pour ne pas bloquer le thread

### Fichiers modifiés

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeBusStops.tsx`
- Bouton **"Suggérer ordre optimal"** (gold #D4A853) dans header section PICKUP_DEPARTURE
- S'affiche si 3+ arrêts pickup avec GPS
- 1 clic : appelle `optimizeStopOrder`, re-attribue `sortOrder`, conserve waypoints/arrivals après
- Réécrit `formData.stops` via `setFormData`

#### `frontend/app/(pro)/pro/voyages/[id]/page.tsx`
- Composant `TransportQuoteBanner` : bandeau urgent quand devis transport non validé
  - **Critical** (red) → "voyage NON publiable" + lien `/pro/voyages/[id]/edit?step=fournisseurs`
  - **Warning** (sun) → "statut inconnu — vérifier"
  - **Hidden** quand validé (success implicit)
- TravelDashboard interface étendue : `transportQuoteValidated?: boolean` + `transportQuotes?: Array<{status?}>`

#### `frontend/app/(client)/client/voyage/[id]/transfert/page.tsx` (TODO P0 — TRANSFERT-AEROPORT)
- iframe Google Maps Embed (replace placeholder "à intégrer") :
  - Si `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` défini → mode `directions` avec route dessinée
  - Sinon → fallback iframe public `maps.google.com/?q=` + lien externe `dir/?api=1`
- Lien externe "Ouvrir l'itinéraire dans Google Maps" sous la carte

#### `frontend/components/voyage/VoyageEnergyBadge.tsx`
- Cascade tier : prop > localStorage cache (1h TTL) > fetch `/api/client/me/energy` > STARTER
- Cache écrit après fetch réussi pour éviter refetch
- Validation : tier doit exister dans PALIERS_ENERGY pour être appliqué

---

## 🎼 Round 6 — Partition frise + Auto-RFQ scaffold (commit 8)

### Fichiers nouveaux

#### `frontend/components/transport/SymphonyPartitionFrise.tsx` (TODO P1 #7)
Frise chronologique horizontale des arrêts — la "partition musicale" :
- Chaque arrêt = numéro circulaire + ville + heure + badge type
- Différenciation visuelle : PICKUP (gold #D4A853), WAYPOINT (ocean), DROPOFF (mint)
- Ligne connector entre arrêts avec gradient couleur
- Header KPIs : nb notes + km totaux + durée estimée + warning GPS manquant
- Mode compact disponible (`compact={true}`)
- Scrollable horizontalement pour 10+ arrêts

#### `frontend/lib/transport/auto-rfq.ts` (TODO P0 #3 partial)
Scaffold complet pour la génération automatique de devis transport :
- `checkAutoRFQEligibility(stops, occurrences, routes)` — valide les seuils :
  - 5+ arrêts pickup
  - 1+ occurrence
  - 1+ route configurée
  - 60%+ des arrêts avec GPS
  - Renvoie `{ eligible, reasons, metrics }`
- `buildAutoRFQPayload({ travelId, stops, occurrences, routes, ... })` — construit le payload :
  - `pickup` : arrêts + totalKm (via tsp-optimizer) + arrivalPointId
  - `onSite` : daysCount + estimatedKmPerDay (80km heuristique) + vehicleType
  - `airportTransfers` : enabled si FLIGHT/MIXED + paxMin/Max depuis occurrences
  - `occurrences` : dates + estimated pax
  - `meta` : responseDeadlineHours=48, targetLoueurCount=3
- `submitAutoRFQ(payload)` — POST `/api/pro/transport/auto-rfq` avec
  graceful fallback si endpoint backend pas encore dispo

### Fichier modifié

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeBusStops.tsx`
- Import `SymphonyPartitionFrise` + `totalRouteDistance`
- Frise rendue au-dessus de la liste 3-types (départ/étapes/arrivée)
- Calcul auto totalKm + duration depuis tous les arrêts ordonnés

---

## 🎼 Round 7 — SymphonyMap + Backend endpoints (commit 9)

3 nouveautés couvrant 3 TODOs P0/P1 majeurs.

### Frontend

#### `frontend/components/transport/SymphonyMap.tsx` (TODO P1 #6, 230 lignes)
Carte Google Maps interactive avec polyline du trajet :
- Mode 1 (clé API présente) : iframe Embed Directions avec route dessinée (origin + jusqu'à 23 waypoints + destination)
- Mode 2 (sans clé) : sidebar liste cliquable + iframe Maps centrée sur 1er arrêt
- Empty state si 0 arrêts, warning structurant si <2 GPS
- Header : compteur GPS coverage + lien externe `dir/?api=1`
- Footer : compte par type avec dots couleur (gold/ocean/mint)
- Affichée sous SymphonyPartitionFrise dans `EtapeBusStops`

### Backend NestJS

#### `backend/src/modules/transport/transport-quotes.controller.ts` + `dto/auto-rfq.dto.ts`
`POST /transport/auto-rfq` (TODO P0 #3) :
- Reçoit `AutoRFQPayloadDto` (compose côté frontend `lib/transport/auto-rfq.ts`)
- Map → `CreateQuoteRequestDto` (segments OUTBOUND/RETURN/TRANSFER)
- Orchestre : `createQuoteRequest()` puis `broadcastQuoteToProviders()` (gracieux)
- Retour : `{ rfqId, message, quoteRequest, broadcast, meta }`
- DTO complet avec validation class-validator (7 classes nested)

#### `backend/src/modules/client/client.controller.ts`
`GET /client/me/energy` (cf. VoyageEnergyBadge front) :
- Heuristique tier dérivé du nombre de bookings CONFIRMED/COMPLETED
- Mapping aligné sur `PALIERS_ENERGY` frontend (STARTER → LEGEND)
- Retour : `{ tier, balance, tripsCount, nextTier, pointsToNext, thresholds }`
- TODO future : table `EnergyAccount` Prisma dédiée (pour l'instant scaffold)

---

## 🎼 Round 8 — Auto-RFQ UI + Backend creator catalog + transportQuoteValidated (commit 10)

3 nouveautés bouclant les 3 dernières TODOs back-end principales.

### Frontend

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeFournisseurs.tsx`
Composant `AutoRFQSection` (gold #D4A853) en tête de l'étape Fournisseurs :
- 4 métriques d'éligibilité (arrêts départ, occurrences, routes, GPS coverage)
- Badge ✓ Éligible vert OU ⏳ "À compléter" + raisons listées
- Bouton "Lancer le devis automatique" disabled tant que pas éligible
- Au clic : `buildAutoRFQPayload()` → `submitAutoRFQ()` → toast résultat
- Le créateur n'a plus à remplir le formulaire devis manuellement

### Backend NestJS

#### `backend/src/modules/pro/pro.controller.ts`
`GET /pro/catalog/creator` :
- Lecture defensive via prismaAny (`HotelPartner` / `RestaurantPartner` /
  `ActivityPartner` / `BusStop`) — gracieux si modèles non encore peuplés
- Filtre par destination (city OR country fuzzy)
- Retour : `{ creatorId, destination, counts, hotels, restaurants, activities, stops, isEmpty }`
- Le frontend `creator-catalogs.ts` peut remplacer le fallback DEMO_HRA_*
  par une lecture cascade : 1. `/pro/catalog/creator` → 2. DEMO_HRA_*
  (catalogue) → 3. MOCK_* local

#### `backend/src/modules/travels/travels.service.ts`
`findById()` étendu — calcul `transportQuoteValidated` :
- Lit `prisma.quoteRequest.findMany({ where: { travelId } })`
- Si au moins un statut `VALIDATED`/`ACCEPTED`/`VALIDÉ` → `true`
- Si aucun devis → `null` (statut inconnu)
- Si erreur lecture → `null` gracieux (table pas migrée)
- Le champ est exposé dans la réponse `travel.transportQuoteValidated`
- Les frontends admin `/admin/voyages/[id]` + pro `/pro/voyages/[id]`
  consomment déjà ce champ pour leur bandeau gate de publication

---

## 🎼 Round 9 — Cascade API + SymphonieGate + DriverTrackingGateway (commit 11)

3 nouveautés bouclant les TODOs hors-scope restants.

### Frontend

#### `frontend/lib/creator-catalogs.ts` — Cascade API → DEMO → MOCK
- `fetchCreatorCatalogFromApi(destination)` — GET `/api/pro/catalog/creator` avec credentials, renvoie `null` si vide/échec
- `getCreatorCatalogWithApiFallback(destination)` — helper haut-niveau qui fait la cascade complète, mappe les hôtels/restos/activités/arrêts du backend vers le format `CreatorXxx[]` attendu par les Etape*
- Source tracée : `'api' | 'demo'` pour traçabilité
- Backward compat : les helpers synchrones existants restent disponibles

#### `frontend/components/transport/SymphonieGate.tsx` (TODO P0 #4 + #5)
Widget checklist de publication d'un voyage — 8 gates :
- 5+ arrêts pickup
- Arrêts validés (GPS + photo)
- Point d'arrivée
- Route configurée
- Occurrence confirmée
- Routes assignées aux occurrences
- Plan ramassage (pax estimés)
- Devis transport validé
Rendu : progress bar + grid 2 colonnes + badge global "voyage publiable", click handler optionnel.

### Backend NestJS

#### `backend/src/modules/transport/driver-tracking.gateway.ts` (TODO P1 — Suivi GPS chauffeur)
WebSocket gateway pour suivi GPS chauffeur en temps réel :
- Namespace `/driver-tracking`, JWT obligatoire (rôle DRIVER pour émettre)
- Channels :
  - `tracking:subscribe { occurrenceId }` → join room `occurrence:${id}`
  - `tracking:driver-update { lat, lng, speed, heading, occurrenceId }` → broadcast aux abonnés
  - `tracking:driver-arrived-${occId}` push notif (dédupe par stopId)
- `haversineKm()` static helper pour calcul rayon 200m
- Maps en mémoire : occurrenceSubscribers, driverPositions, notifiedArrivals
- Type `ExtendedSocket` local pour pallier les limites du `socket.io.d.ts` minimal

#### `backend/src/modules/transport/transport.module.ts`
Import `JwtModule.registerAsync` + provider `DriverTrackingGateway`.

---

## 🎼 Round 10 — SymphonieGate wired + DriverArrivalDetection cron (commit 12)

2 nouveautés bouclant les TODOs hors-scope restantes côté visible.

### Frontend — SymphonieGate désormais visible partout

#### `frontend/app/(pro)/pro/voyages/[id]/page.tsx`
SymphonieGate rendu sous TransportQuoteBanner, avant FourLights. Le créateur voit en un coup d'œil ce qui reste à valider sur son voyage.

#### `frontend/app/(admin)/admin/voyages/[id]/page.tsx`
SymphonieGate rendu sous WorkflowBanner. Lecture defensive via cast `as unknown` — gracieux si champs absents.

#### `frontend/app/(pro)/pro/voyages/nouveau/components/EtapeSummary.tsx`
SymphonieGate rendu avant Phase Indicators. Le créateur voit AVANT soumission ce qui manque.

### Backend NestJS

#### `backend/src/modules/transport/driver-arrival-detection.service.ts` (nouveau, 165 lignes)
Cron `@Cron('*/30 * * * * *')` qui détecte l'arrivée chauffeur :
- Lit positions chauffeurs récentes (<2 min) depuis la map mémoire de DriverTrackingGateway
- Pour chaque position : lit les arrêts de l'occurrence trackée (defensive Prisma)
- Calcule haversine vs chaque arrêt
- Si <200m → appelle `gateway.notifyDriverArrived()` (dédup automatique)
- Lecture defensive : gracieux si modèles TransportStop/RouteStop pas migrés

Cron toutes les 30 secondes — équilibre réactivité vs charge serveur.

---

## 🎼 Round 11 — Prisma schema EnergyAccount + transportQuoteValidated (commit 13)

Migrations Prisma + branchements pour fermer 2 TODO recap.

### `backend/prisma/schema.prisma`

#### `Travel.transportQuoteValidated` (Boolean? + index)
Permet override admin / cache colonnaire au lieu de calcul dynamique systématique depuis `quoteRequest[]`. Le service `findById()` lit la colonne en priorité, sinon dérive depuis quotes.

#### `model EnergyAccount` (1:1 User)
- `balance` : solde actuel (source de vérité)
- `lifetimeEarned` : total cumulé (base du tier)
- `tier` : EnergyTier dénormalisé (recalculé après chaque tx)
- `tripsCount` : compte voyages confirmés
- Index sur tier, balance, userId

#### `model EnergyTransaction`
Log immutable des earns/redeems pour audit :
- `type` : EARN_BOOKING / EARN_REVIEW / EARN_REFERRAL / EARN_PROMOTION / EARN_PACK_PURCHASE / REDEEM_VOYAGE / REDEEM_VOUCHER / ADJUST_ADMIN / EXPIRE
- `referenceId` + `referenceType` pour audit (bookingId, reviewId…)
- `expiresAt` : TTL 12 mois par défaut
- `actorId` + `actorRole` pour traçabilité

#### `enum EnergyTier` + `enum EnergyTransactionType`

### `backend/src/modules/travels/travels.service.ts`
`findById()` cascade :
1. Colonne directe `travel.transportQuoteValidated` (override admin)
2. Calcul depuis `quoteRequest[]` (existant)
3. `null` si aucun

### `backend/src/modules/client/client.controller.ts`
`/me/energy` cascade :
1. `EnergyAccount` table (source de vérité — populée par triggers métier)
2. Heuristique fallback `tripsCount` (existant)
- Retourne `source: 'energy_account' | 'heuristic'` pour traçabilité

### `backend/src/modules/client/client.module.ts`
Import `PrismaModule` (nécessaire pour injecter `PrismaService` dans le controller).

> **Migration SQL** à exécuter en environnement DB :
> `npx prisma migrate dev --name add-energy-and-transport-quote-validated`

---

## 🎼 Round 12 — EnergyService + booking earn hook + acceptQuote trigger (commit 14)

3 nouveautés bouclant les 2 dernières TODO recap.

### `backend/src/modules/energy/energy.service.ts` (nouveau, 280 lignes)

Service complet pour gérer le compte Énergie :

- **`getOrCreateAccount(userId)`** — upsert atomique
- **`earnPoints({ userId, type, points?, referenceId?, ... })`**
  - Idempotent par `(userId, type, referenceId)` — pas de double crédit
  - Recalcule tier dénormalisé (STARTER → LEGEND) après chaque earn
  - TTL 12 mois par défaut
  - Log la transaction dans `EnergyTransaction`
- **`redeemPoints({ userId, type, points, referenceId? })`**
  - Vérifie solde, log négatif, décrémente atomique
  - Renvoie null si insuffisant
- **`tierFromLifetime()`** helper static
- **`DEFAULT_POINTS`** : booking 100, review 30, referral 250, promotion 50
- Lecture defensive Prisma : gracieux si modèles non migrés

### `backend/src/modules/energy/energy.module.ts`
Provider + export `EnergyService`, import `PrismaModule`.

### `backend/src/app.module.ts`
`EnergyModule` ajouté dans imports.

### `backend/src/modules/bookings/bookings.service.ts` — `finalConfirm()`
Hook earn après transition `FULLY_PAID → CONFIRMED` :
- `earnPoints()` avec `referenceId=bookingGroupId` pour idempotence
- Try/catch global : ne JAMAIS bloquer la confirmation si earn échoue

### `backend/src/modules/bookings/bookings.module.ts`
Import `EnergyModule`.

### `backend/src/modules/transport/transport-quotes.service.ts` — `acceptQuote()`
Trigger auto `travel.transportQuoteValidated = true` dans la `$transaction` :
- Lecture defensive : log warn si colonne absente
- Couvre la TODO recap "trigger auto transportQuoteValidated"

---

## 🎼 Round 13 — EARN_REVIEW + EARN_PACK_PURCHASE + cron EXPIRE (commit 15)

3 nouveautés bouclant définitivement les TODO recap "Hooks earn supplémentaires" + "Cron EXPIRE".

### Hooks earn livrés

#### `backend/src/modules/reviews/reviews.service.ts` — `moderateReview()`
- Hook EARN_REVIEW quand l'avis est APPROUVÉ par modération admin
  (pas à la création — évite le farming)
- Idempotent par `(userId, reviewId)`
- Try/catch global : ne JAMAIS bloquer la modération si earn échoue
- Import EnergyService injecté dans le constructor

#### `backend/src/modules/reviews/reviews.module.ts`
Import `EnergyModule`.

#### `backend/src/modules/client/client.controller.ts` — `POST /client/me/energy/purchase-pack`
- Endpoint pour créditer un pack Énergie après paiement Stripe confirmé
- Idempotent par `checkoutSessionId` (référence Stripe)
- Appelé par le webhook Stripe (server-side, pas le frontend — sécurité)
- Body : `{ packId, points, checkoutSessionId }`
- Couvre `EARN_PACK_PURCHASE`

#### `backend/src/modules/client/client.module.ts`
Import `EnergyModule`.

### Cron expirations

#### `backend/src/modules/energy/energy-expiry.service.ts` (nouveau, 100 lignes)
- `@Cron('0 3 * * *')` quotidien à 03:00 UTC
- Lit les `EARN_*` avec `expiresAt < now` (batch 500, ordre asc par expiresAt)
- Pour chaque earn :
  - Vérifie qu'aucune transaction `EXPIRE` existante (idempotence)
  - Crée transaction `EXPIRE` de `-points`
  - Décrémente balance via SQL raw `GREATEST(0, balance - X)` (jamais négatif)
- Lecture defensive : skip silencieux si modèles non migrés

#### `backend/src/modules/energy/energy.module.ts`
Provider `EnergyExpiryService`.

---

## 🎼 Round 14 — EARN_REFERRAL + Stripe webhook + migration SQL (commit 16)

3 nouveautés finalisant le compte Énergie + livraison de la migration SQL.

### `backend/src/modules/client/friends.service.ts` — `acceptFriendRequest()`
Hook EARN_REFERRAL :
- Crédite le PARRAIN (sender) quand l'invité accepte la demande
- Idempotent par `(parrainId, friendshipId)`
- Try/catch global : ne JAMAIS bloquer l'acceptation si earn échoue
- `EnergyService` déjà disponible via `ClientModule` (round 13)

### `backend/src/modules/payments/webhook.controller.ts` — `handleCheckoutSessionCompleted()`
Stripe webhook pack purchase :
- Détecte `session.metadata.energyPackId` + `energyUserId` + `energyPoints`
- Appelle `this.energyService.earnPoints()` avec `referenceId=session.id`
- Idempotent par session Stripe
- Validation : userId présent + points > 0 + finite
- Log clair en succès et erreur — ne casse pas le flux booking

### `backend/src/modules/payments/payments.module.ts`
Import `EnergyModule`.

### `backend/prisma/migrations/20260502_energy_account_and_transport_quote_validated/migration.sql`
Migration SQL prête à déployer (`npx prisma migrate deploy`) :
- `CREATE TYPE EnergyTier` (5 valeurs : STARTER → LEGEND)
- `CREATE TYPE EnergyTransactionType` (9 valeurs)
- `ALTER TABLE Travel ADD COLUMN transportQuoteValidated BOOLEAN` + index
- `CREATE TABLE energy_accounts` (1:1 user, balance, lifetime, tier, ...)
- `CREATE TABLE energy_transactions` (FK accountId CASCADE, points, refs, ...)
- 7 index pour perf (tier, balance, userId, accountId+createdAt, type, refId, expiresAt)
- Tous les `CREATE/ALTER` en `IF NOT EXISTS` pour idempotence

---

## 🎼 Round 15 — Frontend Energy complet (commit 17)

L'expérience Énergie côté voyageur est désormais 100% branchée à l'API backend.

### `frontend/app/(client)/client/energie/page.tsx`
Cascade API :
- Fetch `/api/client/me/energy` au montage (avec AbortController)
- Variables `solde`/`cumul` (au lieu de constantes MOCK directes)
- Tous les calculs (palier, progressPct, depensable, voyage goal) utilisent `solde`/`cumul`
- Réactif au vrai compte du voyageur — plus de mock 8 240 / 24 650
- Fallback gracieux MOCK si API indisponible

### `frontend/components/voyage/EnergyTierBadge.tsx` (nouveau, 130 lignes)
Badge tier + balance pour le header voyageur :
- Cascade : prop > localStorage cache (1h TTL) > fetch `/api/client/me/energy`
- Cliquable → redirect `/client/energie` (sauf `noLink`)
- Mode compact (juste tier emoji) ou full (tier + balance + label)
- Couleur dynamique selon palier (bleu STARTER → violet LEGEND)
- Différent de `VoyageEnergyBadge` (qui montre les pts gagnés sur UN voyage)

### `frontend/app/(client)/client/layout.tsx`
- Import `EnergyTierBadge`
- Affiché dans la card user info de la sidebar (sous identité)
- Visible sur TOUS les écrans client → toujours conscient du tier

---

## 🟡 Hors scope — prochaines passes (chantiers infra uniquement)

Toutes les TODO P0/P1/secondaires/tertiaires/UX du recap sont désormais bouclées. Restent uniquement les chantiers infra non bloquants :

1. **Queue Bull pour broadcast emails loueurs** — l'endpoint `/transport/auto-rfq` invoque `broadcastQuoteToProviders` synchrone. L'envoi async fiable (retry, dedup) gagnerait à passer par une queue (Bull/BullMQ). Non bloquant MVP.
2. **App mobile chauffeur** — émet les positions GPS sur le WebSocket (gateway + cron + service métier déjà en place côté serveur, prêts à recevoir des positions). Hors scope frontend Eventy.

---

## 📊 Bilan chiffré

| Phase | Fichiers nouveaux | Fichiers modifiés | Lignes ajoutées |
|-------|-------------------|-------------------|-----------------|
| 1. Pré-prefill création | 1 (creator-catalogs.ts) | 4 (Etape*) | ~487 |
| 2. Symphony reader | 1 (symphony-mapper.ts) | 3 (voyage-detail-client + 2 client pages) | ~405 |
| 3. Fallback API client | 0 | 1 (activites) | ~28 |
| 4. Symphony round 2 + énergie | 1 (VoyageEnergyBadge.tsx) | 7 (5 client + page + public) | ~302 |
| 5. Symphony round 3 | 0 | 8 (transport, manifeste, checkin, co-voyageurs, cagnotte, checklist, depenses, assurance) | ~148 |
| 6. Round 4 (merci + admin gate) | 0 | 2 (merci + admin/voyages/[id]) | ~51 |
| 7. Round 5 (TSP + Maps + tier + pro banner) | 1 (tsp-optimizer.ts) | 4 (EtapeBusStops, /pro/voyages/[id], transfert, VoyageEnergyBadge) | ~451 |
| 8. Round 6 (partition frise + auto-RFQ) | 2 (SymphonyPartitionFrise.tsx + auto-rfq.ts) | 1 (EtapeBusStops) | ~525 |
| 9. Round 7 (SymphonyMap + backend endpoints) | 2 (SymphonyMap.tsx + auto-rfq.dto.ts backend) | 3 (EtapeBusStops, transport-quotes.controller.ts, client.controller.ts) | ~685 |
| 10. Round 8 (Auto-RFQ UI + creator catalog + quote computed) | 0 | 3 (EtapeFournisseurs, pro.controller, travels.service) | ~334 |
| 11. Round 9 (cascade API + SymphonieGate + GPS gateway) | 2 (SymphonieGate.tsx + driver-tracking.gateway.ts) | 2 (creator-catalogs.ts, transport.module.ts) | ~688 |
| 12. Round 10 (SymphonieGate wiring + arrival cron) | 1 (driver-arrival-detection.service.ts) | 4 (pro voyage, admin voyage, EtapeSummary, transport.module) | ~294 |
| 13. Round 11 (Prisma schema EnergyAccount + transportQuoteValidated) | 0 (modèles dans schema.prisma) | 4 (schema.prisma, travels.service, client.controller, client.module) | ~140 (utiles) |
| 14. Round 12 (EnergyService + booking earn + acceptQuote trigger) | 2 (energy.service, energy.module) | 4 (app.module, bookings.module, bookings.service, transport-quotes.service) | ~363 |
| 15. Round 13 (EARN_REVIEW + EARN_PACK_PURCHASE + cron EXPIRE) | 1 (energy-expiry.service) | 4 (reviews.service, reviews.module, client.controller, client.module, energy.module) | ~220 |
| 16. Round 14 (EARN_REFERRAL + Stripe webhook + migration SQL) | 1 (migration.sql) | 3 (friends.service, payments.module, webhook.controller) | ~161 |
| 17. Round 15 (Frontend Energy complet) | 1 (EnergyTierBadge.tsx) | 2 (energie/page.tsx, client/layout.tsx) | ~189 |
| **TOTAL** | **16** | **59** | **~5 471 lignes** |

---

> **L'âme d'Eventy** : le créateur ne saisit qu'une fois ; le client voit la cohérence partout.
> Cette session livre l'auto-prefill MVP qui matérialise cette promesse.

— Claude, le 2 mai 2026
