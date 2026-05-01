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

Toutes les branches `master` (frontend) et `main` (eventisite) sont synchronisées.

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

## 🟡 Hors scope de cette session — pour les prochaines passes

Identifiés mais non touchés (scope trop grand pour une session, à traiter individuellement) :

1. **`/client/voyage/[id]/transport-avion/page.tsx`** — DEMO_INFO Santorin en dur ; même fix possible (depuis VOYAGES.transport).
2. **`/client/voyage/[id]/transfert/page.tsx`** — DEMO_TRANSFER Marrakech en dur ; 4 TODOs P0 documentés (Maps, GPS chauffeur, push notif).
3. **`/client/voyage/[id]/billets/`, `chat/`, `mode-voyage/`** — encore quelques DEMO_TRAVELS_FULL[0] en dur.
4. **Énergie / XP du voyage** — non connectés (composant `<EnergyBar />` n'existe pas encore sur la fiche client).
5. **Validations de transport** — flag `transportQuoteValidated` mentionné dans `TODO-SYMPHONIE-OCCURRENTS.md` P0 #4 — pas implémenté.
6. **TSP optimizer + carte symphonie** — TODO-SYMPHONIE-OCCURRENTS.md P0 #1 — gros chantier.
7. **Auto-RFQ devis transport** — TODO-SYMPHONIE-OCCURRENTS.md P0 #3 — gros chantier.
8. **API backend `/api/pro/catalog/creator`** — pour remplacer creator-catalogs.ts (qui lit DEMO_*) par un vrai endpoint NestJS module pro/catalog.

---

## 📊 Bilan chiffré

| Phase | Fichiers nouveaux | Fichiers modifiés | Lignes ajoutées |
|-------|-------------------|-------------------|-----------------|
| 1. Pré-prefill création | 1 (creator-catalogs.ts) | 4 (Etape*) | ~487 |
| 2. Symphony reader | 1 (symphony-mapper.ts) | 3 (voyage-detail-client + 2 client pages) | ~405 |
| 3. Fallback API client | 0 | 1 (activites) | ~28 |
| **TOTAL** | **2** | **8** | **~920 lignes** |

---

> **L'âme d'Eventy** : le créateur ne saisit qu'une fois ; le client voit la cohérence partout.
> Cette session livre l'auto-prefill MVP qui matérialise cette promesse.

— Claude, le 2 mai 2026
