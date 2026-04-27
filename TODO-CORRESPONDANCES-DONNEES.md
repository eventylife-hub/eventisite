# TODO — Correspondances de données entre portails

> **Audit** : 2026-04-27 · **Auditeur** : IA bras droit PDG
> **Périmètre** : 32 portails Eventy · 1118 pages · 6 domaines (voyages, HRA, pros, transport, activités, prix)
> **Règle absolue** : ne rien détruire. On ajoute, on centralise, on fait pointer.

---

## TL;DR exécutif

Eventy a déjà **deux sources centralisées** :

1. **Source A (publique / client / pro)** — `frontend/app/(client)/client/voyages/[id]/_data/voyages.ts`
   → 4 voyages publics réels du catalogue + 1 voyage archivé (Maroc/Chefchaouen)
   → **Données canoniques** : Andalousie 734 €, Europa-Park 289 €, Algarve 645 €, Vosges 299 €
   → Riche : HRA, restaurants, activités, équipe, météo, reviews, breakdown prix

2. **Source B (admin / équipe / scenarios riches)** — `frontend/lib/demo-data/`
   → Voyages internes/scenarios : Marrakech, Bali, Rome, Barcelone, Santorin
   → Type `DemoTravelFull` (cents, slugs, occurrences, programme)
   → HRA centralisés : `hra-hotels.ts`, `hra-restaurants.ts`, `hra-activities.ts`
   → Pros : `pro-accounts.ts`

**Le problème** : ces deux sources ne se croisent jamais et plusieurs pages ont leurs propres mocks locaux qui dérivent en prix, noms, IDs.

---

## 🚨 P0 — Conflits visibles client (à corriger en urgence)

### P0-1 — Prix incohérents : portail public vs portail client privé

| Voyage | Public (homepage + catalogue) | Client privé (dashboard + mes voyages) | Source de vérité |
|---|---|---|---|
| Andalousie | **734 €** ✅ | 1290 € ❌ | 734 € (`_data/voyages.ts`) |
| Europa-Park | **289 €** ✅ | 389 € ❌ | 289 € |
| Algarve | **645 €** ✅ | 1149 € ❌ | 645 € |
| Vosges | **299 €** ✅ | 449 € ❌ | 299 € |

**Pages concernées** :
- `frontend/app/(client)/client/page.tsx` → const `NEARBY` (lignes 48-101) — prix erronés
- `frontend/app/(client)/client/voyages/page.tsx` → const `MOCK_TRAVELS` (lignes 49-106) — prix erronés

**Source canonique** : `frontend/app/(client)/client/voyages/[id]/_data/voyages.ts` → `VOYAGES`

**Action de cette session** : remplacer les arrays hardcodés par dérivation depuis `VOYAGES` (déjà importé en haut des deux fichiers).

---

## 🟠 P1 — Conflits internes (priorité haute, pas visibles directement client)

### P1-1 — HRA Hôtels : duplication en local côté Pro

| Page | Source | Données |
|---|---|---|
| `app/(pro)/pro/hra/hotels/page.tsx` | ✅ central `DEMO_HRA_HOTELS` | Riad Al Andalous, Villa des Orangers, Kasbah Tamadot |
| `app/(pro)/pro/hotelier/page.tsx` | ❌ local `DEMO_HOTELS` | Riad Atlas Garden, Hôtel Mareterra, Santorini Caldera, Auberge Pyrénées |

**Source de vérité** : `lib/demo-data/hra-hotels.ts`
**Action** : remplacer le mock local par un import central, ou justifier la séparation par un commentaire si c'est un autre périmètre.

### P1-2 — HRA Activités : nom collisionnant

| Page | Source | Données |
|---|---|---|
| `app/(pro)/pro/activites/catalogue/page.tsx` | ✅ central `DEMO_HRA_ACTIVITIES` | Atlas Trekking VIP, Cours de cuisine, Visite guidée Marrakech, Hammam |
| `app/(admin)/admin/activites/hra/page.tsx` | ❌ local `DEMO_HRA_ACTIVITES` | CrossFit, Escape Masters, Karting Sud Loisirs, Bowling |

**Constat** : `DEMO_HRA_ACTIVITIES` (central, voyage) ≠ `DEMO_HRA_ACTIVITES` (local, métier sport/loisirs). Collision de naming dangereuse.
**Action** : renommer l'un des deux pour clarifier (ex. `DEMO_HRA_VOYAGE_ACTIVITIES` vs `DEMO_HRA_LOCAL_ACTIVITES`).

### P1-3 — Créateurs publics : MOCK_CREATORS désynchronisé

| Page | Source |
|---|---|
| `app/(public)/createurs/_components/createurs-catalog.tsx` | ❌ local `MOCK_CREATORS` (6-8 créateurs hardcodés) |
| `app/(admin)/admin/pros/page.tsx` | ✅ central `DEMO_PRO_ACCOUNTS` (4 pros) |
| `app/(admin)/admin/pros/[id]/page.tsx` | ✅ central `DEMO_PRO_ACCOUNTS` |

**Source de vérité** : `lib/demo-data/pro-accounts.ts` (Sarah Dumont, Alexandre Dubois, Yasmine Benali, Paul Martin).
**Note** : il existe déjà un commentaire TODO dans le fichier : « remplacer MOCK_CREATORS par vrai fetch API ».
**Action** : projeter `DEMO_PRO_ACCOUNTS.filter(p => p.status === 'APPROVED')` vers le format card public (slug, cover, gamingTitles).

### P1-4 — voyage-data.ts (public slug) : voyages parallèles

| Page | Source |
|---|---|
| `app/(public)/voyages/[slug]/voyage-data.ts` | ❌ tableau local de 12 voyages avec `creator: 'Sarah Dumont'` (string, pas ref) |
| `app/(public)/voyages/[slug]/page.tsx` | utilise voyage-data.ts |

**Source de vérité visée** : `_data/voyages.ts` ou `lib/demo-data/travels.ts`
**Action** : aligner le slug du voyage-data sur les slugs canoniques des deux sources, et lier `creator` à `proId` via `getTravelsByPro()`.

### P1-5 — activityIds non résolus dans la fiche voyage

**Constat** : `DEMO_TRAVELS_FULL[].activityIds: string[]` (ex. `['act_atlas_trekking_vip', ...]`) référence `lib/demo-data/hra-activities.ts`, mais **aucune page ne fait le lookup**. Les pages client utilisent `voyage.activities[]` (array inline) à la place.
**Effet** : Rome (`travel_rome`) a `activityIds: []` vide → invisible.
**Action** : créer un helper `resolveTravelActivities(travel)` dans `lib/demo-data/index.ts` qui fait le lookup et le retourne dans le format `Activity` attendu par les pages client.

---

## 🟡 P2 — Conflits secondaires (à traiter en sprint dédié)

### P2-1 — Pro dashboard : KPIs/TRIPS/BOOKINGS hardcodés

| Page | Données |
|---|---|
| `app/(pro)/pro/page.tsx` | KPIS, TRIPS, BOOKINGS = consts locales |
| `app/(pro)/pro/profil/page.tsx` | profil "David Eventy" hardcodé en useState |

**Acceptable pour MVP** (le pro voit son propre dashboard, pas besoin de centraliser). À documenter comme « volontairement local — propre à la session pro ».

### P2-2 — Transport pool admin isolé

**Constat** : `app/(admin)/admin/transport/{stops,routes,route-packs}` gère un pool de stops via API, indépendamment des `pickupStops[]` définis dans chaque voyage.
**Effet** : un Pro peut créer un voyage avec un arrêt qui n'est pas dans le pool admin.
**Action** : faire valider les `pickupStops[]` du voyage contre le pool admin, ou unifier le modèle (stops globaux référencés par ID).

### P2-3 — JSON-LD voyages publics : prix hardcodés

**Constat** : `app/(public)/voyages/page.tsx` a 9 voyages dans son JSON-LD (Toscane, Bali, Val Thorens, Croisière, Tokyo en plus des 4 réels).
**Effet** : 5 prix SEO sont des leurres → si Google indexe, faux espoir client.
**Action** : soit générer le JSON-LD dynamiquement depuis `VOYAGES`, soit les marquer `availability: PreOrder` ou `OutOfStock` pour signaler qu'ils ne sont pas réservables.

### P2-4 — voyages-client.tsx : FALLBACK_TRAVELS divergeant

**Constat** : `frontend/app/(public)/voyages/voyages-client.tsx` a un `FALLBACK_TRAVELS` (lignes 113-200) avec des voyages additionnels (Maroc circuit, etc.).
**Source** : prix en **cents** (29900, 28900, 73400, 64500) — corrects et alignés sur `_data/voyages.ts`.
**Action** : remplacer par dérivation runtime depuis `VOYAGES` pour éviter la double source.

---

## ⚪ Reste à clarifier

### Deux sources de voyages : faut-il fusionner ?

**Source A** (`_data/voyages.ts`) — 4 voyages réels publics au catalogue, prix EUR, type local `Voyage`
**Source B** (`lib/demo-data/travels.ts`) — 5+ scenarios riches (Marrakech, Rome, Bali, Barcelone, Santorin), prix cents, type `DemoTravelFull`

**Constat** : leur contenu est différent — A = vrai catalogue, B = scenarios démo pour pages internes (admin/équipe). Pas vraiment un conflit, mais le risque est :
- Si on ajoute Marrakech comme vrai voyage public, il faudra le dupliquer dans A
- Si on retire Andalousie, il faudra l'effacer dans A et tous les mocks dérivés

**Recommandation** : à terme, **fusionner** dans un seul format `Voyage` (en EUR) sous `lib/demo-data/voyages-catalog.ts`, avec un flag `isPublicCatalog: boolean`. Mais **pas dans cette session** — ça touche trop de fichiers.

### Pros : profiles.ts dans lib/demo/ vs pro-accounts.ts

| Fichier | Rôle |
|---|---|
| `lib/demo-data/pro-accounts.ts` | DEMO_PRO_ACCOUNTS — comptes pros pour login/admin |
| `lib/demo/profiles.ts` | persona showcase — différent ? |

**Action** : ouvrir `lib/demo/profiles.ts` et soit l'effacer si redondant, soit le documenter comme couche distincte.

---

## Source de vérité — par domaine

| Domaine | Fichier canonique |
|---|---|
| Voyages publics (4 du catalogue) | `frontend/app/(client)/client/voyages/[id]/_data/voyages.ts` → `VOYAGES` |
| Voyages internes / scenarios riches | `frontend/lib/demo-data/travels.ts` → `DEMO_TRAVELS_FULL` |
| HRA Hôtels | `frontend/lib/demo-data/hra-hotels.ts` → `DEMO_HRA_HOTELS` |
| HRA Restaurants | `frontend/lib/demo-data/hra-restaurants.ts` → `DEMO_HRA_RESTAURANTS` |
| HRA Activités voyage | `frontend/lib/demo-data/hra-activities.ts` → `DEMO_HRA_ACTIVITIES` |
| Pros / Créateurs | `frontend/lib/demo-data/pro-accounts.ts` → `DEMO_PRO_ACCOUNTS` |
| Clients démo | `frontend/lib/demo-data/clients.ts` → `DEMO_CLIENTS` |
| Sponsors | `frontend/lib/demo-data/sponsors.ts` → `DEMO_SPONSORS` |
| Énergie / paliers | `frontend/lib/demo-data/energy.ts` → `PALIERS_ENERGY` |
| Gaming | `frontend/lib/demo-data/gaming.ts` → `GAME_CATALOG` |

Tous re-exportés via `frontend/lib/demo-data.ts` et `frontend/lib/demo-data/index.ts`. **Importer toujours depuis `@/lib/demo-data`.**

---

## Ce qui a été corrigé dans cette session (2026-04-27)

- ✅ **P0-1** : `frontend/app/(client)/client/page.tsx` — `NEARBY` dérive maintenant de `VOYAGES`, prix alignés (289/299/734/645).
- ✅ **P0-2** : `frontend/app/(client)/client/voyages/page.tsx` — `MOCK_TRAVELS` dérive maintenant de `VOYAGES`, prix alignés.
- ✅ Document `TODO-CORRESPONDANCES-DONNEES.md` créé avec la liste complète des P1/P2 à traiter.

## Prochaines étapes à planifier (sprints suivants)

1. **Sprint correspondances P1 (5 jours)**
   - Aligner P1-1 (hotelier hardcodé)
   - Aligner P1-2 (renommer DEMO_HRA_ACTIVITES local)
   - Aligner P1-3 (MOCK_CREATORS → DEMO_PRO_ACCOUNTS)
   - Créer helper `resolveTravelActivities()` (P1-5)
   - Aligner voyage-data.ts (P1-4)

2. **Sprint correspondances P2 (3 jours)**
   - Documenter pro dashboard local (P2-1)
   - Validation transport pool (P2-2)
   - JSON-LD dynamique catalogue public (P2-3)
   - voyages-client.tsx FALLBACK → dérivation (P2-4)

3. **Sprint fusion sources (sprint dédié, pré-API)**
   - Fusionner Source A + Source B dans `lib/demo-data/voyages-catalog.ts`
   - Flag `isPublicCatalog`
   - Migration progressive des imports

---

**Date de mise à jour** : 2026-04-27
**À relire avant** chaque commit qui touche aux mocks ou aux pages voyages/HRA/pros.
