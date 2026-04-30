# AUDIT — Création de voyage Eventy (wizard complet)

> **Date** : 2026-04-30
> **Périmètre** : `frontend/app/(pro)/pro/voyages/nouveau/` (wizard créateur) + endpoints backend liés
> **Méthode** : lecture de **32 654 lignes** de code (20 composants Etape, 7 composants Assistant IA, page.tsx orchestrateur, types.ts, marginDefaults.ts) + 6 modules backend NestJS
> **Mandat** : auditer, ne rien effacer, identifier ce qui est BON / MAUVAIS / MANQUANT pour MVP
> **Référence âme** : [AME-EVENTY.md](AME-EVENTY.md), [pdg-eventy/DASHBOARD-PDG.md](pdg-eventy/DASHBOARD-PDG.md)

---

## ⚡ TL;DR — État réel du wizard

| Bloc | État | Niveau |
|------|------|--------|
| Architecture wizard (page.tsx + 20 étapes + 7 assistants) | ✅ Existe et est cohérente | **80% MVP** |
| Étapes Phase 1 (info, programme, HRA, prix, sécurité, équipe) | ✅ Complètes | **85% MVP** |
| Étapes Phase 2 (bus stops, bus sur place, occurrences, fournisseurs) | ✅ Très avancées | **75% MVP** |
| Catalogue HRA réutilisable (favoris créateur) | ⚠️ API existe mais pas de **création** dans wizard | **40% MVP** |
| Catalogue arrêts bus / activités / loueurs réutilisables | ❌ **MOCK DATA** (hardcodé) | **0% MVP** |
| Notification HRA "vous êtes dans le voyage X" | ❌ **ABSENT** | **0% MVP** |
| Communication créateur ↔ HRA pendant préparation | ⚠️ Messagerie générique existe, pas auto-déclenchée | **20% MVP** |
| Documents partagés (rooming, menus, briefings) | ⚠️ /documents/pro existe, pas branché au voyage | **15% MVP** |
| Récurrence dates (premier départ → suivants automatiques) | ⚠️ Modes UI présents (HEBDO/MENSUEL...), pas de cron backend | **30% MVP** |
| Option "voyage à date unique" (événement spécifique) | ❌ **ABSENT** | **0% MVP** |
| Bouton "Soumettre / Publier" final dans EtapeSummary | ❌ **ABSENT** (workflow backend OK mais bouton frontend manquant) | **0% MVP** |
| Modèle 82/18 (PDG 2026-04-19) | ❌ Commenté dans le code mais **pas implémenté** | **0% MVP** |
| Autonomie créateur totale | ⚠️ Backend impose admin Phase 1 + Phase 2 avant publication | **50% MVP** |

**Verdict** : le wizard est **fonctionnellement riche** (32k lignes, étapes complètes, assistant IA déterministe) mais **3 manques bloquants MVP** :
1. Pas de **bouton de soumission finale** côté créateur
2. Pas de **catalogue personnel réutilisable** (HRA/arrêts/activités) → tout en mock data
3. Pas de **notification HRA automatique** → l'âme Eventy ("le client doit se sentir aimé") s'arrête au créateur, ne touche pas les partenaires

---

## 1. INVENTAIRE COMPLET DU WIZARD

### 1.1 Fichiers racine `nouveau/`

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `page.tsx` | 2 784 | Orchestrateur wizard — gère étapes, formData, navigation, save draft |
| `types.ts` | 1 648 | Modèles : `TravelFormData`, `TransportStop`, `TravelOccurrence`, `OnSiteCircuit`, `DayHRASelection`, `MealConfig`, `Highlight`, etc. |
| `marginDefaults.ts` | 789 | Modèles de marge par catégorie HRA (15% défaut, cascade Eventy/indé/poches) |
| `error.tsx` | — | Page erreur Next.js (corrigée commit a9493fa) |
| `loading.tsx` | — | Skeleton chargement |

### 1.2 Composants étapes `nouveau/components/`

| # | Composant | Lignes | Phase | Statut |
|---|-----------|--------|-------|--------|
| 1 | `EtapeInfo.tsx` | 2 256 | 1 — Base | ✅ Complet (titre, dates, transport, capacité, gamme) |
| 2 | `EtapeProgram.tsx` | 847 | 1 — Programme | ✅ Drag-drop activités par jour |
| 3 | `EtapeAccommodation.tsx` | 1 315 | 1 — Hébergement | ✅ Sélection hôtel principal + 2 backups |
| 4 | `EtapeRestoration.tsx` | 1 844 | 1 — Restaurants | ✅ Sélection resto déj+dîner via `MealConfig` |
| 5 | `EtapeActivites.tsx` | 1 029 | 1 — Activités | ✅ Mode planning + mode gestion marges |
| 6 | `EtapePricing.tsx` | 1 772 | 1 — Prix | ⚠️ Modèle 82/18 NON appliqué |
| 7 | `EtapePhotos.tsx` | 121 | — | ❌ **DEPRECATED ORPHELIN** (jamais importé) |
| 8 | `EtapeMedias.tsx` | 1 137 | 1 — Médias | ✅ Photos, vidéos, highlights, auto-gen social |
| 9 | `EtapeSecurite.tsx` | 921 | 1 — Sécurité | ✅ Auto-rempli emergency DB par destination |
| 10 | `EtapeEquipe.tsx` | 815 | 1 — Équipe | ✅ Indépendants partenaires (SIRET, tarif, commission) |
| 11 | `EtapeBusStops.tsx` | 2 324 | 2 — Arrêts | ✅ Catalogue collectif mocké, pas de drag-drop |
| 12 | `EtapeBusSurPlace.tsx` | 2 549 | 2 — Bus destination | ✅ Loueurs + circuits préparés + magicAutoFill HRA |
| 13 | `EtapeOccurrences.tsx` | 1 851 | 2 — Départs | ✅ Multi-dates + rotation indépendants + routes |
| 14 | `EtapeFournisseurs.tsx` | 957 | 2 — Devis transport | ⚠️ Workflow démo (pas de vrai email) |
| 15 | `EtapePartition.tsx` | 2 282 | 2 — Timeline DAW | ⚠️ Visuel seul, pas de partition financière |
| 16 | `EtapeMarketingVoyage.tsx` | 607 | 2 — Marketing | ⚠️ Matériel imprimé seul, pas de champs slogan/âme |
| 17 | `EtapeSummary.tsx` | 1 154 | Final | ❌ **Pas de bouton "Soumettre"** |
| 18 | `MarginCascadeBlock.tsx` | 279 | Helper | ⚠️ TODO PDG : caché créateur (`SHOW_EVENTY_INTERNAL_SPLIT=false`) |
| 19 | `VoyageHRASelector.tsx` | 468 | Helper | ✅ Personnalisation HRA multi-voyage |
| 20 | `DayHRASelector.tsx` | 756 | Helper | ✅ Sélection HRA par jour, 14 catégories |

### 1.3 Composants assistant IA `nouveau/components/assistant/`

| # | Composant | Lignes | Branché | Vraie IA ? |
|---|-----------|--------|---------|-----------|
| 1 | `VoyageFlowAssistant.tsx` | 264 | ✅ Hub flottant 7 onglets | — |
| 2 | `VoyageActivitySuggester.tsx` | 252 | ✅ | ❌ Liste statique par destination |
| 3 | `VoyageLivePreview.tsx` | 412 | ✅ Aperçu live formData | ❌ Composants UI seuls |
| 4 | `VoyageMapPreview.tsx` | 276 | ✅ | ❌ SVG schématique (pas Mapbox/Leaflet) |
| 5 | `VoyagePriceCalculator.tsx` | 349 | ✅ | ❌ Calcul local déterministe (intègre TODO-5 équipe) |
| 6 | `VoyageProgramAutoBuilder.tsx` | 370 | ✅ | ❌ Algo déterministe (respecte mealConfig) |
| 7 | `VoyageStopsReorderer.tsx` | 250 | ✅ | ❌ Drag-drop HTML5 natif |

→ **Aucun appel endpoint IA réel** dans tout le dossier `assistant/`. Tous déterministes.

### 1.4 Données catalogue référencées (mocks vs API)

| Catalogue | Source | Statut | Endpoint API si existe |
|-----------|--------|--------|------------------------|
| Véhicules (bus, avion, etc.) | `MOCK_VEHICLE_CATALOG` (EtapeInfo l.128) | ❌ Mock | Non trouvé |
| Arrêts bus collectifs | `COLLECTIVE_STOPS` (EtapeBusStops l.200+) | ❌ Mock | Non trouvé (`POST /pro/bus-stops` crée uniquement par voyage) |
| Hôtels | `MOCK_HOTELS` (EtapeAccommodation) | ⚠️ Fallback API | `GET /api/pro/hra/favorites?type=HOTEL` |
| Restaurants | `MOCK_RESTAURANTS` (EtapeRestoration) | ⚠️ Fallback API | `GET /api/pro/hra/favorites?type=RESTAURANT` |
| Activités | `MOCK_CATALOG` (EtapeActivites) | ⚠️ Fallback API | `GET /api/pro/hra/favorites?type=ACTIVITY` |
| Loueurs sur place | `MOCK_LOUEURS` (EtapeBusSurPlace l.101) | ❌ Mock | Non trouvé |
| Indépendants (équipe terrain) | `MOCK_INDEPENDENTS` (EtapeOccurrences l.39) | ❌ Mock | Non trouvé |
| Templates routes | `ROUTE_TEMPLATES` (EtapeBusStops l.124) | ❌ Mock | Non trouvé |
| Fournisseurs transport bus/avion | `DEMO_SUPPLIERS` (EtapeFournisseurs) | ❌ Mock | Non trouvé |
| Catalogue HRA jour-par-jour | `MOCK_HRA_CATALOG` (DayHRASelector) | ❌ Mock | Non trouvé |

→ **5 catalogues sur 10 sont 100% mockés**. Les 5 catégories HRA (hôtels/restos/activités/transport/maisons) ont un endpoint mais 100% des autres (loueurs, indépendants, arrêts collectifs, véhicules, templates routes) sont hardcodés.

---

## 2. AUDIT SECTION PAR SECTION (bon / mauvais / manquant)

### 2.1 EtapeInfo (Phase 1 — base voyage)

**Fichier** : `EtapeInfo.tsx:2256`

✅ **BON** :
- 9 modes de transport (BUS, COACH, MINIBUS, VAN, FLIGHT, TRAIN, YACHT, HELICOPTER, PRIVATE_CAR)
- 3 gammes Eventy (CLASSIC, SELECT, PRESTIGE) avec features et tarifs
- Pattern rotation indépendants + routes
- `decisionDeadlineDays` pour go/no-go commercial
- `minPaxToGo` (peut être < `minimumPassengers`) → cohérent avec âme "on part même si bus pas plein"

⚠️ **MAUVAIS / OBSOLÈTE** :
- `MOCK_VEHICLE_CATALOG` hardcodé l.128–425 (Mercedes Tourismo 53 places défaut)
- Aucune validation Zod (structure repose sur types TS seuls)

❌ **MANQUE** :
- Option **"voyage à date unique"** explicite (toggle "Pas de récurrence")
- Endpoint `/api/pro/catalog/vehicles` réel (équipe Eventy gère partenaires loueurs)
- Validation Zod côté frontend

### 2.2 EtapeProgram (Phase 1 — programme jour-par-jour)

**Fichier** : `EtapeProgram.tsx:847`

✅ **BON** :
- Planning par jour (J1, J2…) avec accordéon
- Drag-drop activités intra-jour (`handleDragStart/Over/Drop` l.349-363)
- Tri par heure `moveActivity` l.284
- Branchement `DayHRASelector` l.755 pour pioche dans catalogue HRA

⚠️ **MAUVAIS** :
- Démo Marrakech 7j (`DEMO_DAY_CONTENTS` l.70-143) jamais retirée pour prod

❌ **MANQUE** :
- Drag-drop **inter-jours** (déplacer activité de J2 → J3)
- Synchronisation programme ↔ EtapeBusSurPlace (les arrêts du programme devraient pré-remplir les circuits)

### 2.3 EtapeAccommodation (Phase 1 — hôtel)

**Fichier** : `EtapeAccommodation.tsx:1315`

✅ **BON** :
- 1 hôtel principal + 2 backups (système anti-no-show partenaire)
- Configuration chambres par type + quantité
- Estimateur coût (nuit × tarif)
- `GET /api/pro/hra/favorites?type=HOTEL&destination=...` (fallback mock si vide)
- Notes négociation `hotelSelectionComment` 300 chars

⚠️ **MAUVAIS** :
- Filtre backup1/2 brisé si backup1 == primary (warn console silencieux l.637)
- Typo flag `'notes'` vs `'note'` (l.82)
- Option "Hébergement hors catalogue" (`selectedHotelId='custom'` l.878) **sans formulaire** pour saisir nom/détails

❌ **MANQUE — CRITIQUE MVP** :
- **Création nouvel hôtel** depuis le wizard (créateur doit sortir du wizard pour ajouter un nouvel hôtel à son catalogue → friction)
- **Notification automatique HRA** "Votre hôtel est inclus dans voyage X en préparation"
- Workflow accept/decline du HRA (status `PENDING|APPROVED` existe mais pas exposé aux partenaires)
- Documents partagés (rooming list, briefings)

### 2.4 EtapeRestoration (Phase 1 — restaurants)

**Fichier** : `EtapeRestoration.tsx:1844`

✅ **BON** :
- Sélection resto global avec déj/dîner via `MealConfig`
- Régimes spéciaux, capacité culinaire, tarifs
- Endpoint `GET /api/pro/hra/favorites?type=RESTAURANT`

⚠️ **MAUVAIS** :
- Identique à Accommodation : pas de notif HRA, pas de chat, pas de status

❌ **MANQUE — CRITIQUE MVP** :
- Notification automatique HRA
- Création nouveau resto depuis wizard
- Documents partagés (menus du jour, allergies clients, demandes spéciales)

### 2.5 EtapeActivites (Phase 1 — activités)

**Fichier** : `EtapeActivites.tsx:1029`

✅ **BON** :
- 2 modes : "Planning" (drag-drop sur jours) + "Gestion" (config marges)
- 3 niveaux d'inclusion (INCLUDED, OPTIONAL, EXCLUDED)
- Endpoint `GET /api/pro/hra/favorites?type=ACTIVITY` (l.246)
- Suggestions IA par slot (l.617)

❌ **MANQUE — CRITIQUE MVP** :
- **Création nouvelle activité** depuis wizard
- Notification automatique HRA
- Pas de gestion **équipement nécessaire** par activité (lié à TODO-FICHE-VOYAGE-GAMING-ACTIVITES.md)
- Pas de gestion **niveau participant requis** (débutant/intermédiaire/avancé)

### 2.6 EtapePricing (Phase 1 — prix)

**Fichier** : `EtapePricing.tsx:1772`

✅ **BON** :
- Pack Sérénité automatiquement inclus (l.250-261, fallback 35€ public / 15€ coût)
- Simulateur créateur live
- Auto-calcul prix public

❌ **MAUVAIS — BLOQUANT PDG** :
- **Modèle 82/18 NON IMPLÉMENTÉ** — commentaire daté 2026-04-19 dit "82/18 sur transport uniquement" mais le code applique partout `MARGIN_DEFAULT_PERCENT=15` (5% gamification + 7% Eventy + 3% créateur/Stripe)
- Mémoire PDG (`project_8218_model.md`) : 82% = marge Eventy, 18% = brut indépendant — **inversion possible** dans le commentaire l.69 → vérifier avec PDG

❌ **MANQUE — CRITIQUE MVP** :
- **Calcul TVA marge** (régime fiscal voyagiste) — 0 ligne de code
- Verrou "prix public ne peut être < seuil minimum APST" (protection garantie financière)
- Affichage "Prix juste" cohérent avec âme Eventy (transparence: "voici ce que paie le partenaire, voici la marge Eventy")

### 2.7 EtapePhotos (DEPRECATED)

**Fichier** : `EtapePhotos.tsx:121`

❌ **À SUPPRIMER** — `@deprecated` l.19-22, jamais importé dans page.tsx. Tout est dans EtapeMedias.

### 2.8 EtapeMedias (Phase 1 — photos/vidéos/social)

**Fichier** : `EtapeMedias.tsx:1137`

✅ **EXCELLENT** :
- Photos uploadées + médias pré-préparés (vitrine, voyages passés, partenaires HRA)
- Auto-génération Instagram caption / Facebook description / hashtags / email teaser (l.149-181)
- Score "Prêt pour lancement" 14 points (l.184-233)
- 5 highlights max
- Vidéo URL YouTube

⚠️ **MAUVAIS** :
- État local `selectedPrepared` non sync vers `formData.photos` (l.254-363) → UI décalée

❌ **MANQUE** :
- Vidéo upload direct (uniquement URL externe pour l'instant)
- Watermarking automatique Eventy sur photos publiées

### 2.9 EtapeSecurite (Phase 1 — sécurité)

**Fichier** : `EtapeSecurite.tsx:921`

✅ **BON** :
- `EMERGENCY_DB` auto-rempli par destination (Maroc, France, Espagne, Turquie, Thaïlande)
- Détection risques par activité (`detectActivityRisks` l.165 : "randonn", "escalade", "quad", "plongée"…)
- Briefing auto-généré (chaleur, pickpockets, activités difficiles)
- Score 100 points (contact urgence, hôpital, assurance, brief), seuil 70% requis
- Checklist 15 items pré-départ

❌ **MANQUE — CRITIQUE LÉGAL** :
- **Validation APST formelle** (numéro garantie financière en cours de constitution per memory `project_garantie_apst.md`)
- **Validation RC Pro** (souscription en cours)
- Validation **certifications chauffeur** (carte conducteur, FIMO/FCO)
- Validation **certifications accompagnateur** (BAFD, BAPAAT si gaming)
- Cf. [TODO-LEGISLATION-VOYAGES-FR.md](TODO-LEGISLATION-VOYAGES-FR.md), [TODO-LEGISLATION-CONFORMITE.md](TODO-LEGISLATION-CONFORMITE.md)

### 2.10 EtapeEquipe (Phase 1 — équipe terrain)

**Fichier** : `EtapeEquipe.tsx:815`

✅ **BON** :
- Section Créateur = Accompagnateur orange/gold obligatoire
- SIRET + statut juridique (Auto-entrepreneur, EIRL, SASU…)
- Langues, certifications, bio publique
- Tarif jour, commission, jours assignés, délai paiement (J+15/30/45/60)
- `accountingStatus` (PENDING/VERIFIED/ACTIVE)
- Score équipe 5 critères

⚠️ **MAUVAIS** :
- `DEMO_HRA_CATALOG` hardcodé (3 Marocains fictifs l.83-105) — **pas de catalogue créateur réutilisable**

❌ **MANQUE — CRITIQUE MVP** :
- **Notification automatique** vers membre équipe ("Vous êtes invité au voyage X")
- Workflow d'invitation visible (`isConfirmed` booléen seul, pas de "accepter/refuser")
- Catalogue personnel créateur (SIRET vérifié 1 fois, réutilisable d'un voyage à l'autre)
- Cohérent avec memory `project_equipe_roles.md` : créateurs = indépendants à leur compte, marketplace SaaS

### 2.11 EtapeBusStops (Phase 2 — arrêts aller/retour)

**Fichier** : `EtapeBusStops.tsx:2324`

✅ **BON** :
- 3 types d'arrêts (PICKUP_DEPARTURE, DROPOFF_ARRIVAL, WAYPOINT)
- Catalogue collectif `COLLECTIVE_STOPS` cliquable (import 1-clic vers `formData.stops`)
- Photos, GPS Google Place ID, accessibilité, parking, abri
- Réutilisation `usageCount` + `rating` + `creatorName` (gamification base collective)
- Templates routes pré-définies (IDF→Lyon, Maroc)
- Phase 2 gate validation (≥5 arrêts départ, ≥1 arrivée, véhicule, ≥1 occurrence, route assignée, plan ramassage)

⚠️ **MAUVAIS** :
- **`COLLECTIVE_STOPS` mocké** (pas d'endpoint backend `/api/stops/collective?city=...`)
- `sortOrder` field existe mais **aucune UI drag-drop** pour réordonner

❌ **MANQUE — CRITIQUE MVP** :
- **Endpoint backend collectif** (POST `/pro/bus-stops` crée par voyage, pas de catalogue partagé entre créateurs ni catalogue personnel)
- Drag-drop pour ordonner les arrêts
- Validation Zod schema

### 2.12 EtapeBusSurPlace (Phase 2 — bus destination)

**Fichier** : `EtapeBusSurPlace.tsx:2549` ⭐ **étape la plus riche du wizard**

✅ **EXCELLENT** :
- Loueurs partenaires sur place avec **circuits préparés** (`preparedCircuits[]` cliquables 1-clic)
- 8 types d'arrêts (restaurant, activité, bar, RDV, hotel, shopping, monument, plage, custom)
- Lien direct HRA (`source` : manual/hra_hotel/hra_restaurant/hra_activity, `hraPartnerId`)
- 4 templates rapides (matin, après-midi, soirée, journée)
- **`magicAutoFill()` l.593** : génère auto les jours + circuits depuis programme + HRA
- `autoFillHraForCircuit()` + `getMissingHra()` (détecte HRA non placés)
- Suggestions par destination (Maroc, Istanbul, Lisbonne)

⚠️ **MAUVAIS** :
- `MOCK_LOUEURS` hardcodé (Atlas Tours, Sahara Express, Rif Transport Premium) — pas d'endpoint
- Aucune UI drag-drop pour réordonner les arrêts d'un circuit

❌ **MANQUE — CRITIQUE MVP** :
- **Endpoint loueurs** `/pro/catalog/loueurs?destination=...` réel
- **Création loueur** via wizard (créateur doit sortir pour ajouter un nouveau partenaire)
- Notification loueur "Vos circuits sont utilisés dans voyage X"
- Drag-drop arrêts intra-circuit

### 2.13 EtapeOccurrences (Phase 2 — départs multi-dates)

**Fichier** : `EtapeOccurrences.tsx:1851`

✅ **BON** :
- 4 modes récurrence (HEBDO, BI_MENSUEL, MENSUEL, CUSTOM)
- `generateOccurrences()` auto (l.185-220)
- Pattern rotation indépendants cyclique (`'self', 'ind-ahmed', 'self', 'ind-sofia'`…)
- Pattern rotation routes (semaine 1 A→B, semaine 2 B→A)
- 1-clic "urgent replace" pour changer indépendant d'1 occurrence
- 4 statuts (OUVERT, CONFIRME, FERME, ANNULE)
- Plan ramassage pax par arrêt (`paxPlan: StopPaxPlan[]`)
- Phase 2 readiness check (capacité, mode transport, dates, seuil minimum, ramassage, routes)

⚠️ **MAUVAIS** :
- `draggingOccIdx` state existe l.181 mais **UI drag-drop unclear** (pas de visual feedback)
- `MOCK_INDEPENDENTS` hardcodé (10 profils l.39-50)

❌ **MANQUE — CRITIQUE MVP / PDG** :
- **Option "Voyage à date unique"** (événement spécifique, pas de récurrence) — TOUS les modes génèrent multi-dates
- **Cron backend** qui génère les occurrences suivantes automatiquement quand `firstDeparture` arrive (cf. point c utilisateur)
- Catalogue indépendants réel (pas mock)

### 2.14 EtapeFournisseurs (Phase 2 — devis transport)

**Fichier** : `EtapeFournisseurs.tsx:957`

✅ **BON** :
- Workflow EN_ATTENTE → REÇU → VALIDÉ → REFUSÉ
- Validation 1 devis = auto-refus des autres REÇU (l.473-475)
- 6 fournisseurs démo bus/avion

⚠️ **MAUVAIS — DÉMO** :
- "Demande envoyée à `${supplier.contactEmail}`" = **texte affiché, pas de vrai email envoyé** (l.454)
- Bouton "Simuler réception du devis (démo)" l.752-760
- Pas de relance auto si devis non reçu

❌ **MANQUE — CRITIQUE MVP** :
- **Vrai envoi email** au fournisseur (avec template négocié, dates, capacité, route)
- Réception réelle du devis (PDF upload ou formulaire)
- Comparateur prix multi-fournisseurs
- Validation conformité (carte conducteur, assurance véhicule)

### 2.15 EtapePartition (Phase 2 — timeline DAW)

**Fichier** : `EtapePartition.tsx:2282`

✅ **BON** :
- Timeline visuelle (DAW Digital Audio Workstation)
- 3 zoom levels (Compact/Normal/Détaillé)
- 3 gammes auto-générées (Classic/Select/Prestige) avec blocs adaptés
- Multi-jours chaînés

⚠️ **MAUVAIS** :
- **Pas de "partition financière"** comme attendu par le nom (orchestration timeline seulement)
- Code générateur de blocs basé sur jour/heure mais **UI override interactif unclear**

❌ **MANQUE — CRITIQUE MVP** :
- Lien avec EtapePricing (la timeline devrait afficher coût accumulé en bas)
- Export programme imprimable client

### 2.16 EtapeMarketingVoyage (Phase 2 — marketing)

**Fichier** : `EtapeMarketingVoyage.tsx:607`

✅ **BON** :
- Matériel imprimé : Prospectus A5 / Affiches A3 / Flyers QR A6 / Cartes visite
- Assets digitaux (`/api/pro/marketing/assets` avec fallback)
- QR tracké → attribution dernière source au vendeur (l.239)
- Commande auto chez imprimeur partenaire au submit

❌ **MAUVAIS** :
- **Aucun champ texte âme Eventy** : pas de slogan, pas d'accroche émotionnelle, pas de hashtags personnalisés, pas de description "chaleureux comme un ami"
- Cohérent avec `AME-EVENTY.md` ? **Non** — étape purement logistique imprimerie

❌ **MANQUE — CRITIQUE âme Eventy** :
- Champ slogan voyage (ex : "Marrakech avec ceux qui sentent le souk avant les flèches Google Maps")
- Champ accroche (1-2 phrases, ton ami)
- Templates Instagram Story/Reel pré-faits par voyage
- Suggestions de hashtags trending

### 2.17 EtapeSummary (Final — récap)

**Fichier** : `EtapeSummary.tsx:1154`

✅ **BON** :
- Checklist Phase 1 (13 critères) + Phase 2
- Distinction BLOCKING vs WARNING
- Score complétion ≥80% = "Prêt à soumettre"
- Workflow visuel 5 étapes (Sélection → Demande → Acceptation → Manifeste J-7 → Stripe Connect)

❌ **CRITIQUE BLOQUANT MVP** :
- **AUCUN BOUTON "Soumettre" / "Publier" / "Envoyer pour validation"** — le frontend n'appelle JAMAIS `POST /pro/travels/:id/submit-p1` ni `POST /pro/travels/:id/publish`
- **AUCUN appel API** pour créer/sauvegarder le voyage final
- État `voyage.status` (DRAFT → SUBMITTED → PUBLISHED) **non géré côté frontend**

❌ **MANQUE — BLOQUANT** :
- Boutons "Soumettre Phase 1", "Soumettre Phase 2", "Publier"
- Affichage statut courant (DRAFT, PHASE1_REVIEW, APPROVED_P1, etc.)
- Notification créateur quand admin valide / demande changements

---

## 3. POINTS SPÉCIFIQUES — CHECKLIST UTILISATEUR

### 3.a Bus sur place + occurrents Phase 2 (cliquables ? préparables ? catalogue ?)

| Question | Réponse |
|----------|---------|
| **Bus sur place cliquable ?** | ✅ Oui — sélection loueur + import circuits préparés 1-clic |
| **Bus sur place préparable à l'avance ?** | ✅ Oui — `preparedCircuits[]` par loueur réutilisables |
| **Catalogue loueurs réutilisable ?** | ❌ Mock — `MOCK_LOUEURS` hardcodé, pas d'endpoint |
| **Occurrences (départs) cliquables ?** | ✅ Oui — modification status, indépendant, paxPlan, drag-drop state mais UI unclear |
| **Catalogue indépendants réutilisable ?** | ❌ Mock — `MOCK_INDEPENDENTS` 10 profils hardcodés |

→ **Action P0** : créer endpoint `/pro/catalog/loueurs` et `/pro/catalog/independents` avec création créateur réutilisable.

### 3.b Préenregistrement (HRA, arrêts bus, activités, équipe)

| Catalogue | Réutilisable d'un voyage à l'autre ? | Création depuis wizard ? |
|-----------|--------------------------------------|--------------------------|
| **HRA Hôtels** | ✅ via `/api/pro/hra/favorites?type=HOTEL` | ❌ Sélection seule, pas de création |
| **HRA Restaurants** | ✅ via `/api/pro/hra/favorites?type=RESTAURANT` | ❌ Sélection seule |
| **HRA Activités** | ✅ via `/api/pro/hra/favorites?type=ACTIVITY` | ❌ Sélection seule |
| **HRA Transport** | ✅ via `/api/pro/hra/favorites?type=TRANSPORT` | ❌ Sélection seule (lien `/pro/dashboard`) |
| **Arrêts bus aller/retour** | ❌ Mock collectif | ⚠️ POST `/pro/bus-stops` crée **par voyage** uniquement |
| **Loueurs sur place** | ❌ Mock | ❌ |
| **Indépendants équipe** | ❌ Mock | ❌ |
| **Véhicules** | ❌ Mock | ❌ |

→ **Action P0** : un créateur doit pouvoir, depuis son **dashboard pro**, créer son catalogue PERSO (favoris HRA, arrêts récurrents, indépendants partenaires) une seule fois et le réutiliser pour tous ses voyages.

### 3.c Date souhaitée + récurrence + voyage unique

| Aspect | État |
|--------|------|
| Date 1er départ saisie | ✅ `startDate` / `endDate` dans EtapeInfo |
| Génération automatique départs suivants | ⚠️ Frontend génère via `generateOccurrences()`, mais **pas de cron backend** pour avancer dans le temps |
| Mode HEBDO / BI_MENSUEL / MENSUEL / CUSTOM | ✅ Présent dans EtapeOccurrences |
| **Voyage à date unique (événement spécifique, pas de récurrence)** | ❌ **ABSENT** — tous les modes génèrent multi-dates |
| Backend : modèle `recurrencePattern`, `parentVoyageId` | ❌ Non — `TravelOccurrence` standalone, pas de récurrence native (duplication manuelle via `/pro/travels/:id/duplicate`) |

→ **Action P0** : ajouter toggle "Événement à date unique" dans EtapeInfo qui désactive EtapeOccurrences. Au backend, ajouter `isOneShotEvent: Boolean` sur le modèle `Travel`.

→ **Action P1** : cron backend qui génère les occurrences futures automatiquement (ex : 12 prochains départs glissants).

### 3.d Validation finale du voyage (workflow + notif HRA + chat + autonomie)

✅ **Backend solide** :
```
POST /pro/travels                    → DRAFT
POST /pro/travels/:id/submit-p1      → SUBMITTED → PHASE1_REVIEW
                                     → admin valide → APPROVED_P1
POST /pro/travels/:id/submit-p2      → PHASE2_REVIEW
                                     → admin valide → APPROVED_P2
POST /pro/travels/:id/publish        → QualityGate → PUBLISHED → SALES_OPEN
```

❌ **Frontend** :
- **AUCUN bouton "Soumettre"** dans EtapeSummary
- AUCUN affichage statut voyage
- AUCUN bandeau "Admin a demandé X changements"

❌ **Notification HRA en phase création** :
- Quand créateur sélectionne un hôtel → **PAS de notif** au HRA
- Quand créateur sélectionne un restaurant → **PAS de notif**
- Quand créateur sélectionne une activité → **PAS de notif**
- `NotificationEventsService` existe (`notifyTeamInvite`, `notifyNewFollower`) mais aucune méthode `notifyHraIncluded(voyageId, hraPartnerId)`
- Aucun template email "Votre [hôtel/resto/activité] est inclus dans le voyage X en préparation"

⚠️ **Communication créateur ↔ HRA** :
- Module `/pro/messagerie` EXISTE (threads `InboxMessage`, conversations avec `travelId` optionnel)
- ❌ **Pas auto-déclenché** quand HRA ajouté à un voyage
- ❌ Pas de thread pré-créé "Voyage X — préparation" avec créateur + tous HRA

⚠️ **Documents partagés** :
- Module `/documents/pro` EXISTE (upload, download, sign)
- ❌ Pas branché au voyage
- ❌ Pas de catégories "rooming list", "menus", "briefing chauffeur", "briefing accompagnateur"

❌ **HRA peuvent se préparer à recevoir clientèle** :
- Aucun **portail HRA "voyages à venir"** côté Maisons HRA pour voir les voyages où elles sont incluses
- Cohérent avec architecture portail Maisons HRA (33 pages selon CLAUDE.md) mais pas branché à la création de voyage

→ **Action P0** : ajouter dans EtapeSummary les boutons :
1. "Sauvegarder brouillon" (déjà partiellement présent)
2. "Soumettre Phase 1 pour validation"
3. "Soumettre Phase 2 pour validation"
4. "Publier le voyage" (si APPROVED_P2 + QualityGate OK)

→ **Action P0** : `NotificationEventsService.notifyHraIncluded(voyageId, hraPartnerId, type)` + template email.

→ **Action P1** : auto-création d'un thread `/pro/messagerie` "Voyage X — préparation" quand voyage passe en SUBMITTED, avec créateur + tous HRA inclus.

### 3.e Autonomie créateur (Eventy plateforme de vente uniquement)

| Aspect | État | Cohérence âme Eventy |
|--------|------|----------------------|
| Créateur prépare TOUT le voyage | ✅ Wizard 20 étapes complètes | ✅ Cohérent |
| Créateur saisit son SIRET, statut, certifications | ✅ EtapeEquipe l.307-449 | ✅ Cohérent |
| Créateur choisit ses HRA partenaires | ✅ Via favoris | ✅ Cohérent |
| Eventy garantit (APST), vend (Stripe Connect), encaisse, reverse | ✅ Backend prévu | ✅ Cohérent |
| **Eventy doit valider Phase 1 + Phase 2 avant publication** | ⚠️ Workflow `PHASE1_REVIEW` `PHASE2_REVIEW` | ⚠️ **PAS d'autonomie totale** |
| Eventy "fait le travail à la place" | ❌ Non, créateur autonome | ✅ Cohérent |

→ **Question PDG** : la double validation admin (Phase 1 + Phase 2) est-elle souhaitée pour MVP ? Cohérent avec le besoin légal (vérif APST/RC Pro) mais friction. Alternative : auto-validation si tous les Quality Gates passent + créateur a déjà publié ≥3 voyages OK.

---

## 4. AUDIT COMMUNICATION HRA ↔ CRÉATEUR (TODO dédiés)

### 4.1 Notifications HRA (BLOQUANT MVP)

| Événement | Implémenté ? | Template existant ? |
|-----------|--------------|---------------------|
| HRA ajouté à un voyage en préparation | ❌ | ❌ |
| HRA confirmé (créateur valide) | ❌ | ❌ |
| Voyage entre en Phase 2 (HRA peut commencer prépa) | ❌ | ❌ |
| Voyage publié (HRA peut afficher en vitrine) | ❌ | ❌ |
| Manifeste J-7 envoyé (rooming list, allergies, demandes spéciales) | ⚠️ Workflow visuel décrit dans EtapeSummary mais pas codé | ❌ |
| Voyage J-1 (briefing final, contacts urgence) | ⚠️ Idem | ❌ |
| Voyage NO_GO (pas assez de pax) | ⚠️ Status existe | ❌ |
| Paiement Stripe Connect émis | ⚠️ Code l.277-289 décrit le flow mais pas de notif | ❌ |

### 4.2 Chat direct créateur ↔ HRA

| Aspect | État |
|--------|------|
| Module messagerie existe (`/pro/messagerie`) | ✅ |
| Threads avec `travelId` lié | ✅ |
| Auto-création thread quand HRA ajouté au voyage | ❌ |
| Notification temps réel (WebSocket via `NotificationsGateway`) | ✅ Existe |
| Pré-création contexte (allergies clients, demandes spéciales, etc.) | ❌ |

### 4.3 Documents partagés

| Document | État |
|----------|------|
| Rooming list (créateur → hôtel) | ❌ Pas de branchement |
| Liste allergies/régimes (créateur → restaurants) | ❌ |
| Briefing accompagnateur | ❌ |
| Briefing chauffeur | ❌ |
| Manifeste pax (J-7) | ⚠️ Décrit visuellement, pas codé |
| Photos/vidéos partagées en aval | ❌ |

→ **Action P0** : créer `documents.module` catégories `ROOMING_LIST`, `ALLERGIES_LIST`, `BRIEFING_DRIVER`, `BRIEFING_GUIDE`, `MANIFEST_J7` liées au voyage. Génération auto à des étapes clés.

---

## 5. PLAN DE REFONTE — ÉTAPE PAR ÉTAPE (priorité MVP)

### 🔴 P0 — BLOQUANT MVP (sans ça, le wizard ne sert à rien)

| # | Tâche | Fichier(s) | Effort | Bloque |
|---|-------|-----------|--------|--------|
| P0.1 | Bouton "Soumettre Phase 1" + "Soumettre Phase 2" + "Publier" dans `EtapeSummary` | `EtapeSummary.tsx`, `page.tsx` | M (1-2j) | Création voyage impossible |
| P0.2 | Affichage statut voyage (DRAFT/PHASE1_REVIEW/...) avec bandeau | `EtapeSummary.tsx`, `page.tsx` | S (0.5j) | Créateur navigue à l'aveugle |
| P0.3 | Notification HRA "Vous êtes inclus dans voyage X" (email + dashboard HRA) | `notifications/notification-events.service.ts`, `email-templates.service.ts` | L (3j) | Âme Eventy brisée côté partenaires |
| P0.4 | Catalogue **personnel créateur** (HRA favoris, arrêts récurrents, indépendants) accessible depuis dashboard ET wizard | Backend `/pro/catalog/*` + frontend `EtapeAccommodation`, `EtapeRestoration`, `EtapeActivites`, `EtapeBusStops`, `EtapeEquipe`, `EtapeBusSurPlace` | XL (5j) | Créateur ressaisit tout à chaque voyage |
| P0.5 | Modèle 82/18 implémenté + validé PDG (transport uniquement ? sur marge ?) | `EtapePricing.tsx`, `marginDefaults.ts` | M (1.5j) | Modèle PDG non respecté |
| P0.6 | Option "Voyage à date unique" (toggle qui désactive récurrence) | `EtapeInfo.tsx`, `EtapeOccurrences.tsx`, backend `Travel.isOneShotEvent` | S (1j) | Événements spécifiques impossibles |
| P0.7 | Création nouvel HRA depuis le wizard (modale rapide) | `EtapeAccommodation`, `EtapeRestoration`, `EtapeActivites` | M (2j) | Créateur sort du wizard, perd contexte |
| P0.8 | TVA marge calculée + affichée (régime fiscal voyagiste) | `EtapePricing.tsx`, backend service finance | M (1.5j) | Conformité légale |
| P0.9 | Suppression `EtapePhotos.tsx` (deprecated orphelin) | suppression fichier | XS (10min) | Code mort |

**Total P0** : ~16 jours dev solo / ~8 jours en parallèle

### 🟠 P1 — IMPORTANT (qualité MVP, sans bloquer)

| # | Tâche | Fichier(s) | Effort |
|---|-------|-----------|--------|
| P1.1 | Auto-création thread messagerie "Voyage X — préparation" avec créateur + tous HRA | `pro-messagerie.service.ts` + hook quand HRA ajouté | M (1.5j) |
| P1.2 | Documents partagés liés au voyage (rooming, menus, briefings) | `documents.module` + frontend EtapeSummary | L (3j) |
| P1.3 | Champs marketing "âme Eventy" (slogan, accroche, hashtags) dans EtapeMarketingVoyage | `EtapeMarketingVoyage.tsx` | S (1j) |
| P1.4 | Drag-drop arrêts bus (intra-circuit + inter-jours) | `EtapeBusStops.tsx`, `EtapeBusSurPlace.tsx`, `EtapeProgram.tsx` | M (2j) |
| P1.5 | Validation Zod toutes les étapes (sécurité backend) | tous les `Etape*.tsx` | L (3j) |
| P1.6 | Vrai envoi email fournisseurs transport (devis) | `EtapeFournisseurs.tsx` + backend email | M (1.5j) |
| P1.7 | Workflow accept/refuse HRA exposé aux partenaires | Portail HRA (33 pages existant) + backend | L (3j) |
| P1.8 | Cron backend génération occurrences futures (rolling 12 départs) | backend `cron` module | M (1.5j) |
| P1.9 | Catalogue arrêts bus collectif (entre créateurs Eventy) | backend `/pro/catalog/bus-stops/collective` | M (2j) |
| P1.10 | Score sécurité étendu : APST + RC Pro + certifs chauffeur/accompagnateur | `EtapeSecurite.tsx` + backend validation | M (2j) |

**Total P1** : ~21 jours

### 🟡 P2 — POST-MVP (nice to have)

| # | Tâche | Effort |
|---|-------|--------|
| P2.1 | Vrai map Mapbox/Leaflet dans VoyageMapPreview (pas SVG schématique) | M (2j) |
| P2.2 | Vrai assistant IA (endpoints Claude) dans `assistant/` (suggestions activités, programme auto, prix) | XL (5-7j) |
| P2.3 | Watermarking auto Eventy sur photos publiées | S (1j) |
| P2.4 | Upload vidéo direct (pas seulement URL YouTube) | M (1.5j) |
| P2.5 | Génération auto manifeste J-7 PDF | M (2j) |
| P2.6 | Templates Instagram Story/Reel pré-faits | L (3j) |
| P2.7 | Export programme imprimable client (PDF) | M (1.5j) |
| P2.8 | Comparateur multi-fournisseurs transport | L (3j) |
| P2.9 | Auto-validation admin si créateur ≥3 voyages OK + tous Quality Gates | M (2j) |
| P2.10 | Inter-jours drag-drop activités (J2 → J3) | S (1j) |

**Total P2** : ~25 jours

---

## 6. RÉCAPITULATIF — ce qui est BON / MAUVAIS / MANQUANT

### ✅ BON (à GARDER tel quel — solide MVP)

- Architecture wizard cohérente (20 étapes, 7 assistants, page.tsx orchestrateur)
- `EtapeBusSurPlace` (étape la plus riche, magicAutoFill HRA, loueurs+circuits)
- `EtapeOccurrences` (rotation indépendants + routes)
- `DayHRASelector` (sélection HRA par jour, 14 catégories, walkable<500m, freeDay/transportDay flags)
- `EtapeSecurite` (auto-rempli emergency DB par destination)
- `EtapeMedias` (auto-gen Instagram/Facebook/email teaser, score 14 points)
- `EtapeEquipe` (SIRET, statut juridique, comptabilité créateur+terrain)
- Backend workflow voyage (DRAFT → SUBMITTED → PHASE1_REVIEW → APPROVED_P1 → PHASE2_REVIEW → APPROVED_P2 → PUBLISHED → SALES_OPEN)
- Backend QualityGateService (bloque publication si erreurs)
- Backend `NotificationEventsService` + `NotificationsGateway` (WebSocket prêt)
- Backend module `/pro/messagerie` (threads, conversations, travelId)
- Backend module `/documents/pro` (upload, download, sign)
- Pack Sérénité auto-inclus
- Score "Prêt pour lancement" multi-critères

### ⚠️ MAUVAIS / OBSOLÈTE (à RETIRER ou refactorer)

- `EtapePhotos.tsx` (deprecated orphelin) → **supprimer**
- `MOCK_VEHICLE_CATALOG`, `MOCK_LOUEURS`, `MOCK_INDEPENDENTS`, `COLLECTIVE_STOPS`, `MOCK_HOTELS`, `MOCK_RESTAURANTS`, `MOCK_CATALOG`, `MOCK_HRA_CATALOG`, `DEMO_HRA_CATALOG`, `DEMO_SUPPLIERS`, `ROUTE_TEMPLATES`, `DEMO_DAY_CONTENTS` → **remplacer par endpoints réels**
- Modèle 15% défaut (`MARGIN_DEFAULT_PERCENT`) au lieu du modèle 82/18 PDG → **refactor selon validation PDG**
- `EtapeFournisseurs` mode "démo" (bouton "Simuler réception devis") → **vrai workflow email**
- Champs marketing logistique seulement (pas d'âme) → **ajouter slogan/accroche/hashtags émotionnels**
- Typo `'notes'` vs `'note'` (EtapeAccommodation l.82, VoyageHRASelector l.82)
- Filtre backup1/2 silencieux (warn console, EtapeAccommodation l.637)
- État `selectedPrepared` non sync (`EtapeMedias` l.254-363)

### ❌ MANQUANT (à AJOUTER pour MVP)

**Cf. tableaux P0 / P1 / P2 ci-dessus.**

Top 5 manques bloquants :
1. **Bouton soumission/publication** dans EtapeSummary
2. **Notification HRA automatique** quand inclus dans voyage
3. **Catalogue personnel créateur** réutilisable (HRA, arrêts, indépendants)
4. **Modèle 82/18 PDG** validé et implémenté
5. **Option "Voyage à date unique"**

---

## 7. ANNEXE — Mapping fichier → ligne pour les TODOs critiques

| TODO | Fichier | Ligne | Action |
|------|---------|-------|--------|
| TODO PDG marges cachées créateur | `MarginCascadeBlock.tsx` | 13-16 | Vérifier transparence cohérente avec âme |
| Deprecated orphelin | `EtapePhotos.tsx` | 19-22 | Supprimer fichier |
| Modèle 82/18 commenté pas implémenté | `EtapePricing.tsx` | 69 | Implémenter selon validation PDG |
| `selectedHotelId='custom'` sans formulaire | `EtapeAccommodation.tsx` | 878 | Ajouter modale création hôtel |
| Filtre backup1/2 silencieux | `EtapeAccommodation.tsx` | 637 | Erreur UI explicite |
| Typo `'notes'` flag | `EtapeAccommodation.tsx`, `VoyageHRASelector.tsx` | 82 | Renommer cohérent |
| `draggingOccIdx` sans visual feedback | `EtapeOccurrences.tsx` | 181-182 | Ajouter UI drop zone |
| `magicAutoFill` HRA depuis programme | `EtapeBusSurPlace.tsx` | 593+ | ✅ Bon, conserver |
| Démo Marrakech 7j hardcodée | `EtapeProgram.tsx` | 70-143 | Conditionner `isDemoMode` |
| `selectedPrepared` non sync | `EtapeMedias.tsx` | 254-363 | Sync vers `formData.photos` |
| MOCK_INDEPENDENTS hardcodé | `EtapeOccurrences.tsx` | 39-50 | Remplacer par API `/pro/catalog/independents` |
| MOCK_LOUEURS hardcodé | `EtapeBusSurPlace.tsx` | 101-150 | Remplacer par API `/pro/catalog/loueurs` |
| DEMO_HRA_CATALOG hardcodé | `EtapeEquipe.tsx` | 83-105 | Remplacer par API `/pro/catalog/team-members` |

---

## 8. RÉFÉRENCES

- [AME-EVENTY.md](AME-EVENTY.md) — Document fondateur ("Le client doit se sentir aimé")
- [pdg-eventy/DASHBOARD-PDG.md](pdg-eventy/DASHBOARD-PDG.md) — Statut domaines
- [TODO-LEGISLATION-VOYAGES-FR.md](TODO-LEGISLATION-VOYAGES-FR.md) — APST, RC Pro
- [TODO-CONFORMITE-CHECKLIST.md](TODO-CONFORMITE-CHECKLIST.md) — Conformité légale
- [TODO-MULTI-BUS.md](TODO-MULTI-BUS.md) — Multi-bus context
- [TODO-FICHE-VOYAGE-GAMING-ACTIVITES.md](TODO-FICHE-VOYAGE-GAMING-ACTIVITES.md) — Activités
- [TODO-FICHE-VOYAGE-TRANSPORT-CARTE.md](TODO-FICHE-VOYAGE-TRANSPORT-CARTE.md) — Transport carte
- [TODO-SYMPHONIE-VOYAGE-AUDIT.md](TODO-SYMPHONIE-VOYAGE-AUDIT.md) — Audit symphonie
- [TODO-SYMPHONIE-OCCURRENTS.md](TODO-SYMPHONIE-OCCURRENTS.md) — Occurrents
- Memory PDG : `project_8218_model.md`, `project_business_model_pdg.md`, `project_garantie_apst.md`, `project_equipe_roles.md`

---

# 🔄 ADDENDUM — Audit complémentaire 2026-04-30 (sessions 2)

> Suite à demande PDG, audit approfondi de 3 zones moins couvertes initialement :
> 1. Pré-paiements et acomptes
> 2. Conditions d'annulation par voyageur
> 3. Modifications après publication
>
> **Aucune ligne de code modifiée.**

---

## 9. PRÉ-PAIEMENTS ET ACOMPTES

### 9.1 Frontend wizard — config créateur

**Fichier** : `EtapePricing.tsx:1091-1122`, `types.ts:966`

✅ **BON** :
- Champ `depositPercent: 30 | 50 | 100` exposé au créateur (3 boutons radio)
- Texte UI : *"Solde à régler 30 jours avant le départ"* (l.1098, J-30 par défaut, hardcodé)
- 3 options : 30% (acompte minimal), 50% (équilibré), 100% (paiement complet)
- Affichage live du montant en € selon `prixPublicAuto`

⚠️ **MAUVAIS / RIGIDE** :
- Le créateur ne peut pas configurer un **échéancier multi-versements** (ex : 3 versements 33%/33%/34%)
- La date du solde (J-30) est **hardcodée** dans le texte UI, pas paramétrable par le créateur
- Pas de champ `paymentSchedule`, `installments`, `balanceDueDays` dans `TravelFormData`

### 9.2 Backend — modèles Prisma

**Fichier** : `backend/prisma/schema.prisma`

❌ **CRITIQUE — MISSING** :
- **Modèle `Travel`** (l.1900-2000) : aucun champ `depositPercent`, `balanceDueDays`, `paymentSchedule`. Le seul champ paiement est `cancellationPolicy: Json?` (l.1970, free-form, pas typé)
- **Modèle `BookingGroup`** (l.2247) : pas de champs `depositAmountTTC` / `balanceDueDate` / `installments`. Seul `totalAmountTTC` existe
- **Modèle `RoomBooking`** (l.2289) : pas de deposit/balance. `bookingLockedAt` (l.2303) verrouille la chambre dès 1er paiement → empêche modification/annulation libre
- **Modèle `PaymentContribution`** (l.2359) : `amountTTC` global, **pas de typage `DEPOSIT`/`BALANCE`/`INSTALLMENT`**
- **Modèle `PreReservation`** (l.2479-2503) : SEUL modèle avec `depositAmountTTC` (l.2485) + `holdExpiresAt` (l.2486) + statut `PENDING_DEPOSIT` — **réservé aux groupes CE/associations**, pas aux clients individuels

→ **Le `depositPercent` choisi par le créateur dans le wizard n'est stocké NULLE PART au backend** (le frontend l'écrit dans `TravelFormData` mais le service `pro-travels.service.ts` ne l'enregistre pas).

### 9.3 Backend — services paiement

**Fichiers** :
- `backend/src/modules/checkout/checkout.service.ts`
- `backend/src/modules/checkout/split-pay.service.ts:412 lignes`
- `backend/src/modules/payments/stripe-connect.service.ts`

❌ **MISSING** :
- **Aucune méthode** `createDeposit()`, `payBalance()`, `scheduleInstallment()`
- `checkout.service.ts` : aucune mention de `deposit`, `installment`, `balance`, `escrow` (grep négatif)
- `bookings.service.ts` : idem, aucune logique acompte/solde

⚠️ **PARTIAL** :
- `SplitPayService` (l.1-411) gère le **paiement partagé entre co-voyageurs d'une même chambre** (chacun paie sa part via `PaymentInviteToken` envoyé par email/SMS/WhatsApp/lien)
  - Endpoints : `generateInviteToken`, `validateInviteToken`, `processContributorPayment`, `getPaymentProgress`, `revokeInviteToken`
  - **Note** : c'est du split intra-chambre, **PAS** du paiement échelonné dans le temps (acompte/solde)
- `stripe-connect.service.ts:489-525` : `getBalance()` lit la balance Stripe Connect du compte créateur (≠ balance d'une réservation)

### 9.4 Frontend client — checkout / paiement

**Fichiers** :
- `frontend/app/(checkout)/checkout/start/`, `step-1/`, `step-2/`, `step-3/`, `recap/`, `confirmation/`
- `frontend/app/(public)/voyages/[slug]/checkout/page.tsx`
- `frontend/app/(client)/client/reservation/page.tsx`
- `frontend/app/(client)/client/paiements/page.tsx`

❌ **MISSING** :
- **Aucune** UI client pour choisir entre "payer 30% maintenant + 70% J-30" ou "tout payer maintenant"
- `grep deposit/acompte/installment` sur `(checkout)/` : **0 résultat** → checkout client = paiement unique
- `client/reservation/page.tsx:367` : texte affiché *"Acompte à la confirmation. Annulation flexible selon nos CGV. Le voyage part même si le bus n'est pas plein"* — promesse vide, pas de logique acompte/solde derrière

⚠️ **PARTIAL** :
- `client/paiements/page.tsx` (page liste paiements client) : existe mais ne montre pas un échéancier multi-versements

### 9.5 Cron paiement / relances solde

**Fichier** : `backend/src/modules/cron/`

❌ **MISSING** : aucun service `BalanceReminderService`, `InstallmentDueService`, `PaymentScheduleCron`. Aucune relance automatique J-35 / J-30 / J-7 pour le solde n'est implémentée.

⚠️ **PARTIAL** :
- `backend/src/modules/checkout/hold-expiry.service.ts` : gère uniquement l'expiration des `holdExpiresAt` sur RoomBooking et PreReservation (libère la chambre si pas payé à temps), pas un échéancier solde

### 9.6 Garantie financière APST + escrow

**Fichier** : `backend/src/modules/finance/bank-import.service.ts:21-157`

✅ **BON** :
- Champ `isEscrow: boolean` sur les comptes bancaires (`BankAccount.isEscrow`)
- `bank-import.service.ts:146` calcule `escrowCents = comptes isEscrow=true`
- Sépare `escrowCents` vs `operationalCents`

❌ **MISSING — CRITIQUE LÉGAL APST** :
- **Aucune logique** qui flag automatiquement les acomptes clients comme "fonds clients à séquestrer" (cf. obligation APST : fonds clients ne doivent pas être utilisés pour le fonctionnement avant prestation)
- `PaymentContribution` n'a pas de champ `isClientFunds` ou `escrowAccountId`
- Reporting APST mensuel (montant des fonds clients en cours) : **non implémenté**
- Cf. memory `project_garantie_apst.md` : garantie cible An 1 = 1,6 M€ → traçabilité escrow obligatoire

### 9.7 Cohérence CGV vs code (acomptes)

**Fichier** : `pdg-eventy/01-legal/CGV-TEMPLATE.md:33-40` (Article 4)

> CGV dit : *"Acompte 30% à la réservation. Solde 70% au plus tard J-30 avant le départ. Split payment via Stripe disponible."*

❌ **MISMATCH** :
- CGV impose **acompte 30% fixe** + solde J-30
- Wizard frontend permet 30 / 50 / 100% au choix créateur — **incohérent avec CGV**
- Backend n'implémente AUCUN des deux → l'utilisateur paie 100% à la réservation de fait

### 9.8 Synthèse pré-paiements / acomptes

| Aspect | Frontend wizard | Frontend client | Backend | Cohérence CGV |
|--------|-----------------|-----------------|---------|---------------|
| `depositPercent` configurable | ✅ (30/50/100) | ❌ (paiement unique) | ❌ (non stocké) | ❌ CGV dit 30% fixe |
| Solde J-30 paramétrable | ❌ (hardcodé texte) | ❌ | ❌ | ⚠️ CGV dit J-30 |
| Échéancier multi-versements | ❌ | ❌ | ❌ | — |
| Split intra-chambre | — | ⚠️ | ✅ SplitPayService | ✅ CGV mentionne |
| Relance solde automatique | — | — | ❌ | ❌ |
| Fonds clients en escrow APST | — | — | ⚠️ structure DB OK, logique manquante | ❌ |

→ **Verdict** : zone **0% MVP-ready**. Le créateur choisit un acompte que personne ne lit, le client paie tout d'un coup, aucune relance, aucun escrow APST. Risque légal majeur (APST + CGV menteuses).

---

## 10. CONDITIONS D'ANNULATION PAR VOYAGEUR

### 10.1 Frontend wizard — choix créateur

**Fichier** : `EtapePricing.tsx:36-55, 1124-1153`, `types.ts:781, 967`

✅ **BON** :
- `cancellationPolicy: 'FLEXIBLE' | 'STANDARD' | 'STRICTE'` (3 options radio)
- Descriptions UI claires :
  - **FLEXIBLE** : Remboursement 100% si annulation jusqu'à J-30
  - **STANDARD** : Remboursement 75% si annulation jusqu'à J-45
  - **STRICTE** : Remboursement 50% si annulation jusqu'à J-60

⚠️ **RIGIDE** :
- 3 niveaux figés, aucun barème personnalisable par le créateur
- Pas d'affichage du Pack Sérénité (qui devrait override le barème selon CGV)

### 10.2 Backend — modèle + service annulation

**Fichiers** :
- `backend/prisma/schema.prisma:4603-4637` (model `Cancellation`)
- `backend/src/modules/cancellation/cancellation.service.ts:741 lignes`
- `backend/src/common/constants/business.constants.ts:37-51`

✅ **BON** :
- Module `cancellation` complet : `CancellationController` + `CancellationService` + DTO
- Workflow `PENDING → APPROVED/REJECTED → REFUNDED` avec `processCancellation()` (admin valide), `processRefund()` (Stripe)
- Idempotency keys + transactions atomiques (TOCTOU race protection)
- Audit log automatique (`AuditLog`)
- Email `booking-canceled` envoyé au client (template présent)
- **V25** : option `preferCredit` (avoir) au lieu de remboursement Stripe → `processCredit()` crée `Invoice(CREDIT_NOTE)` (l.4617-4621 schema, 365j validité par défaut)
- Vérif `bookingLockedAt` post-paiement (anti-double-annulation)

❌ **CRITIQUE — POLITIQUE HARDCODÉE** :

```ts
// business.constants.ts:37-51
CANCELLATION_THRESHOLDS = { FULL_REFUND_DAYS: 60, HIGH_REFUND_DAYS: 30, MEDIUM_REFUND_DAYS: 15, LOW_REFUND_DAYS: 7 }
CANCELLATION_REFUND_RATES = { FULL: 100, HIGH: 70, MEDIUM: 50, LOW: 30, NONE: 0 }
```

```ts
// cancellation.service.ts:235-256 — computeRefundAmount()
> 60j  : 100% - 50€ frais
30-60j : 70%
15-30j : 50%
7-15j  : 30%
< 7j   : 0%
```

→ Le service **IGNORE** le `cancellationPolicy` choisi par le créateur dans le wizard. Que le créateur ait choisi FLEXIBLE, STANDARD ou STRICTE, le service applique **toujours** le même barème codé en dur. Le champ `Travel.cancellationPolicy: Json?` (l.1970) n'est jamais lu par `cancellationService`.

### 10.3 Cohérence frontend ↔ backend ↔ CGV

| Délai | Frontend FLEXIBLE | Frontend STANDARD | Frontend STRICTE | Backend (hardcodé) | CGV (Article 6) |
|-------|-------------------|-------------------|------------------|--------------------|-----------------| 
| > 60j | 100% | 100% | 100% | **100% - 50€** | **Frais 35-50€** (= ~98% refund) ✅ |
| 30-60j | 100% | 75% | 50% | **70%** | **70%** (frais 30%) ✅ |
| 15-30j | — | — | — | **50%** | **50%** (frais 50%) ✅ |
| 7-15j | — | — | — | **30%** | **25%** (frais 75%) ❌ écart 5pts |
| < 7j | — | — | — | **0%** | **0%** (frais 100%) ✅ |

→ **3 sources de vérité différentes**. Le wizard ment au créateur (son choix n'est jamais appliqué). Le backend est ~aligné avec CGV sauf 1 palier (7-15j : 30% vs 25%).

### 10.4 Pack Sérénité (assurance annulation)

**Fichier CGV** : `pdg-eventy/01-legal/CGV-TEMPLATE.md:58, 77-86` (Article 9)

> CGV dit : *"Avec le Pack Sérénité (inclus) : annulation toutes causes remboursée à 100% du prix du voyage (hors frais de dossier), quelle que soit la date d'annulation."*

❌ **CRITIQUE — NON IMPLÉMENTÉ** :
- `cancellation.service.ts:216-270` (`computeRefundAmount`) **n'a pas** de branche `if (packSerenite) return 100%`
- `RoomBooking.insuranceSelected` (l.2308) existe mais n'est pas lu par le calcul de remboursement
- `EtapePricing.tsx:250-261` configure le Pack Sérénité côté création (35€ public / 15€ coût), mais le déclencheur côté annulation est absent
- Pas de modèle `InsuranceClaim` lié au refund (le Pack Sérénité couvre quels motifs ? maladie, deuil, perte emploi ?)

→ **Le Pack Sérénité est facturé au client mais n'a aucun effet sur les remboursements**. Risque commercial + légal (publicité mensongère).

### 10.5 Cession billet (substitution voyageur)

**Fichier** : `backend/prisma/schema.prisma:2337-2356` (model `BookingTransfer`)

⚠️ **MODÈLE EXISTE, IMPLÉMENTATION ABSENTE** :
- `BookingTransfer` : `roomBookingId`, `fromUserId`, `toUserId`/`toEmail`, `status` (PENDING/APPROVED), `reason`, `approvedByUserId`
- `grep "BookingTransfer\|transferBooking\|cession"` sur `backend/src/modules/` : **0 résultat**
- **Aucun controller ni service** n'utilise ce modèle → cession billet (Art. L.211-11 Code du tourisme, OBLIGATION LÉGALE) **non implémentée**
- CGV-TEMPLATE.md:44 le promet pourtant : *"Transfert de contrat à un tiers possible"*

### 10.6 Annulation partielle (1 voyageur sur 4)

❌ **NON IMPLÉMENTÉE** :
- `Cancellation` est attaché au `BookingGroup` entier, pas à un `RoomBooking` ni à un payeur individuel
- Si 1 voyageur sur 4 annule, soit toute la chambre est annulée, soit l'annulation est refusée
- Pas de logique de re-répartition `PaymentContribution` après désistement partiel

### 10.7 Frontend client — annulation

**Fichier** : `frontend/app/(client)/client/reservations/[id]/annuler/page.tsx:371 lignes`

✅ **BON** :
- Page dédiée `/client/reservations/:id/annuler` complète
- Appel `GET /client/bookings/:id/calculate-refund` (preview du montant)
- Affiche `policyApplied` ("60+ jours : 100% - 50€"), `refundAmountCents`, `cancellationFeeCents`
- Validation Zod (`cancellationSchema`)
- Toast notification + ConfirmDialog
- Fallback DEMO_RESERVATIONS si API indispo

⚠️ **MAUVAIS** :
- Affiche le barème backend hardcodé, pas celui choisi par le créateur (cohérent avec ce que le client va recevoir, mais ment vis-à-vis du wizard créateur)
- Pas de mention "Pack Sérénité couvert ?" dans l'UI annulation

### 10.8 Synthèse annulation voyageur

| Aspect | État |
|--------|------|
| Choix créateur (FLEXIBLE/STANDARD/STRICTE) | ⚠️ Frontend OK, **ignoré par backend** |
| Barème backend cohérent CGV | ⚠️ Aligné sauf 1 palier (7-15j) |
| Pack Sérénité override | ❌ Promis CGV, **non implémenté** |
| Cession billet (L.211-11) | ❌ Modèle DB OK, **0 implémentation** |
| Annulation partielle | ❌ |
| Avoir (preferCredit) | ✅ V25 implémenté |
| Page client `/annuler` | ✅ Existe et fonctionne |
| Audit log + email confirmation | ✅ |
| Idempotency Stripe refund | ✅ |

→ **Verdict** : zone **40% MVP-ready**. Le moteur d'annulation (refund Stripe + avoir) fonctionne, mais 3 fonctionnalités contractuellement promises sont absentes (choix créateur, Pack Sérénité, cession). **Risque légal moyen** (Art. L.211-11 obligatoire).

---

## 11. MODIFICATIONS APRÈS PUBLICATION

### 11.1 Backend — verrouillage strict

**Fichier** : `backend/src/modules/pro/travels/pro-travels.service.ts:214-222`

```ts
// updateTravel()
if (!['DRAFT', 'CHANGES_REQUESTED'].includes(travel.status)) {
  throw new BadRequestException('Impossible de modifier ce voyage dans son état actuel');
}
```

✅ **BON** :
- Édition autorisée **uniquement** si statut `DRAFT` ou `CHANGES_REQUESTED`
- Une fois `PUBLISHED` / `SALES_OPEN` → toute modif refusée par 400
- Cohérent avec sécurité contrat client (les voyageurs réservés ne doivent pas voir leurs conditions changer en silence)

❌ **TROP STRICT** :
- Aucun mécanisme de **modification mineure** vs **essentielle** (CGV Article 7 : *"Modification mineure : pas d'indemnité"*)
- Aucune correction typo/photo possible après publication sans repasser par DRAFT (= retire le voyage du marché temporairement)
- Aucun champ `lockedFields` (tarif, dates, destination) vs `editableFields` (description, photos, équipe)

### 11.2 Détection modifications "essentielles" (loi tourisme FR)

**Loi** : Code du tourisme Art. L.211-13 + CGV-TEMPLATE.md:62-68 (Article 7)

> Hausse > 8% du prix → client peut annuler sans frais
> Modification d'hébergement, horaires +2h, destination → client peut accepter / remplacement / annuler avec remboursement intégral

❌ **NON IMPLÉMENTÉ** :
- Pas de champ `essentialChange`, `materialChange`, `priceIncreasePercent` sur `Travel`
- Pas de détecteur (compare avant/après modif) ni service `EssentialChangeDetector`
- Pas de workflow consentement client (`clientConsent: PENDING/ACCEPTED/REJECTED`)
- **Risque légal majeur** : si une modif essentielle est appliquée, les clients ne sont jamais informés ni consultés

### 11.3 Wizard nouveau/ — édition vs création

**Fichier** : `frontend/app/(pro)/pro/voyages/[id]/edit/page.tsx`

⚠️ **PARTIAL** :
- Le même wizard `nouveau/components/Etape*.tsx` est réutilisé pour l'édition (import depuis `../../nouveau/components/`)
- **Aucune restriction UI** : le frontend ne vérifie pas le statut → tous les champs restent éditables visuellement
- Le PATCH backend refuse, mais le frontend ne prévient **pas** l'utilisateur en amont → friction UX (créateur édite, sauvegarde, reçoit erreur 400)
- Pas de mode "mode lecture seule" ni de surlignage des champs verrouillés

### 11.4 Notification clients d'une modification

**Fichier** : `backend/src/modules/notifications/notification-events.service.ts`

❌ **MISSING** :
- Service `NotificationEventsService` existe avec méthodes génériques (`notifyTeamInvite`, `notifyNewFollower`)
- **Aucune méthode dédiée** `notifyBookersOfTravelChange()`, `notifyEssentialChange()`, `notifyMinorChange()`
- Templates email cherchés : `travel-modified`, `essential-change`, `minor-update` → **aucun trouvé**
- L'événement `TRAVEL_UPDATED` existe dans le système d'événements mais n'a pas de listener qui notifie les clients réservés

### 11.5 Historique / audit trail

**Fichier** : `backend/prisma/schema.prisma:2214-2227, 4xxx`

✅ **PARTIEL** :
- `GoDecisionLog` : historique décisions NO_GO (action, decidedByUserId, reason, occupancyAtDecision)
- `NoGoNotification` : notifications NO_GO clients (WARNING, FINAL, CANCELED)
- `AuditLog` : audit générique des actions admin (utilisé par cancellation, etc.)

❌ **MISSING** :
- Aucun `TravelChangelog` / `TravelHistory` / `TravelVersion` pour tracker les changements (titre, prix, dates, photos)
- Pas de diff "avant/après" entre versions du voyage
- Impossible de répondre à : *"Qu'est-ce qui a changé sur ce voyage entre X et Y ?"*

### 11.6 Annulation par créateur / Eventy (NO_GO)

**Fichier** : `backend/src/modules/pro/travels/pro-travels.service.ts:551-586`

✅ **BON** :
- Endpoint `POST /pro/travels/:id/cancel` (controller l.245)
- Accepte `reason: string`
- Bascule statut → `CANCELED`
- Validation : pas déjà `COMPLETED` / `CANCELED` / `NO_GO`
- Enums : `NoGoNotifType { WARNING, FINAL, CANCELED }`, `GoAction { CONFIRM_DEPARTURE, CANCEL_NO_GO, EXTEND_DEADLINE }`

❌ **CRITIQUE** :
- **Aucun refund automatique** : le service annule le voyage mais n'appelle **pas** `cancellationService.processRefund()` pour les bookings existants
- Pas de note de crédit / avoir auto pour les clients déjà engagés
- Pas de notification automatique aux clients réservés ("Votre voyage X est annulé, voici votre remboursement")
- Workflow incomplet : créateur clique "Annuler", puis ?

### 11.7 Frontend pro — gestion voyages publiés

**Fichier** : `frontend/app/(pro)/pro/voyages/page.tsx`

✅ **BON** :
- Liste voyages avec statuts (DRAFT, PHASE1_REVIEW, PUBLISHED, SALES_OPEN, COMPLETED, CANCELED)
- Onglets de filtrage par statut
- Bouton "Modifier" → lien `/[id]/edit`
- Bouton "Dupliquer" → clonage saison
- Affichage `placesVendues` / `totalReservations` / occupancy

❌ **MISSING** :
- **Bouton "Annuler le voyage"** absent de la page détail `/[id]/page.tsx` (alors que l'endpoint backend existe !)
- Pas de bouton "Forcer NO_GO"
- Pas d'écran "Modification du voyage publié" qui montrerait : impact (X clients réservés), modifs essentielles vs mineures, déclencher consentement
- Pas de bandeau d'alerte sur la page liste si X jours avant `noGoDeadline`

### 11.8 Synthèse modifications après publication

| Aspect | État |
|--------|------|
| Verrouillage backend post-PUBLISHED | ✅ Strict (peut-être trop) |
| Distinction modif mineure / essentielle | ❌ Non implémentée |
| Détection hausse prix > 8% | ❌ |
| Workflow consentement client | ❌ |
| Frontend UI édition restrictive | ❌ Aucune restriction visuelle |
| Notification clients modif | ❌ Aucun template ni listener |
| Historique TravelChangelog | ❌ Pas de tracking versions |
| Endpoint NO_GO créateur | ✅ Existe |
| Refund auto sur NO_GO | ❌ **CRITIQUE** |
| Bouton "Annuler le voyage" frontend | ❌ Endpoint orphelin |
| Audit trail (AuditLog, GoDecisionLog) | ✅ Partiel |

→ **Verdict** : zone **30% MVP-ready**. Le verrouillage backend protège contre les modifs sauvages mais bloque aussi les corrections mineures légitimes. La fonctionnalité NO_GO/Cancel existe côté backend mais n'est ni branchée au remboursement ni accessible côté frontend pro. **Risque légal majeur** sur loi tourisme Art. L.211-13 (modifs essentielles).

---

## 12. NOUVEAUX TODOs PRIORITAIRES (issus de l'addendum)

### 🔴 P0 — BLOQUANT MVP / RISQUE LÉGAL

| # | Tâche | Fichier(s) | Effort |
|---|-------|-----------|--------|
| P0.10 | **Refund auto sur NO_GO** : `pro-travels.service.ts:cancelTravel()` doit appeler `cancellationService.processRefund()` pour chaque bookingGroup actif | `pro-travels.service.ts`, `cancellation.service.ts` | M (2j) |
| P0.11 | **Lecture du `cancellationPolicy` créateur** : `cancellation.service.ts:computeRefundAmount()` doit lire `Travel.cancellationPolicy` (FLEXIBLE/STANDARD/STRICTE) au lieu d'utiliser les constantes hardcodées | `cancellation.service.ts`, `business.constants.ts` | M (2j) |
| P0.12 | **Pack Sérénité override** : si `RoomBooking.insuranceSelected=true`, le refund doit être 100% (cf. CGV Art. 9) | `cancellation.service.ts`, `RoomBooking` | S (1j) |
| P0.13 | **Bouton "Annuler le voyage"** frontend `/pro/voyages/[id]/page.tsx` (endpoint backend existe déjà) | frontend pro `[id]/page.tsx` | S (1j) |
| P0.14 | **Acompte/solde stockés en DB** : ajouter `Travel.depositPercent: Int @default(30)`, `Travel.balanceDueDays: Int @default(30)` ; lire dans le wizard et propager au booking | `schema.prisma`, `pro-travels.service.ts`, `EtapePricing.tsx` | M (2j) |
| P0.15 | **Détection modif essentielle** : service `EssentialChangeDetector` qui compare avant/après et flag les changements (prix +8%, dates, destination, hébergement) → bloque sans consentement client | `pro-travels.service.ts`, nouveau service | L (3j) |
| P0.16 | **Cession billet** (Art. L.211-11) : controller + service utilisant le model `BookingTransfer` existant | nouveau `booking-transfer.module.ts` | M (2j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.11 | Notifications clients modif voyage (templates email + listener `TRAVEL_UPDATED`) | M (1.5j) |
| P1.12 | `TravelChangelog` model + endpoint history | M (1.5j) |
| P1.13 | Frontend pro : UI "Modifier voyage publié" avec impact (X clients réservés) + distinction champs lockés/editables | M (2j) |
| P1.14 | Cron `BalanceReminderService` : J-35 / J-30 / J-7 relance solde | M (1.5j) |
| P1.15 | Annulation partielle (1 voyageur sur N) : repenser `Cancellation` au niveau `PaymentContribution` ou `RoomBooking` | L (3j) |
| P1.16 | Wizard frontend : remplacer `depositPercent: 30/50/100` figé par éditeur d'échéancier multi-versements | M (2j) |
| P1.17 | Reporting APST mensuel : query "fonds clients en escrow" | S (1j) |
| P1.18 | Aligner palier 7-15j entre backend (30%) et CGV (25%) — choisir une source de vérité | XS (15min) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.11 | UI client choix "30% maintenant + 70% J-30" vs "100% maintenant" au checkout | M (1.5j) |
| P2.12 | Page client "Mes paiements" avec échéancier visuel (acompte payé, solde dû, relances) | M (1.5j) |
| P2.13 | Diff visuel des versions du voyage côté admin | M (2j) |
| P2.14 | Option "remboursement partiel + avoir partiel" sur cancellation | S (1j) |
| P2.15 | Workflow consentement client en cas de modif essentielle (UI accept/refuse/replace) | L (3j) |

### 📊 Mise à jour du tableau récap MVP global

| Bloc | Avant addendum | Après audit complémentaire |
|------|----------------|----------------------------|
| Pré-paiements / acomptes | non audité | **0% MVP** ❌ |
| Annulation voyageur | non audité | **40% MVP** ⚠️ |
| Modifications post-publication | non audité | **30% MVP** ⚠️ |

**Total ajouté à la roadmap** : ~21 jours dev (P0.10-16) + ~13 jours (P1.11-18) + ~9 jours (P2.11-15)

---

## 13. RÉFÉRENCES ADDENDUM

- `frontend/app/(pro)/pro/voyages/nouveau/components/EtapePricing.tsx:36-61, 1091-1153`
- `frontend/app/(pro)/pro/voyages/nouveau/types.ts:781, 966-967`
- `backend/prisma/schema.prisma:1970, 2247-2265, 2289-2336, 2337-2356, 2359-2401, 2479-2503, 4603-4637`
- `backend/src/modules/cancellation/cancellation.service.ts:62-741`
- `backend/src/modules/checkout/split-pay.service.ts:1-411`
- `backend/src/modules/pro/travels/pro-travels.service.ts:214-222, 551-586`
- `backend/src/modules/documents/legal-travel-documents.service.ts:1-120` (STUBS — à implémenter)
- `backend/src/common/constants/business.constants.ts:37-51`
- `frontend/app/(client)/client/reservations/[id]/annuler/page.tsx:1-371`
- `pdg-eventy/01-legal/CGV-TEMPLATE.md:33-86` (Articles 4, 5, 6, 7, 9)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Prochaine action recommandée** (validation PDG requise) : démarrer P0.1 (bouton soumission) + P0.3 (notif HRA) + P0.4 (catalogue créateur) en parallèle.

**Priorité légale immédiate** (addendum) : P0.10 (refund auto NO_GO) + P0.11 (lecture cancellationPolicy créateur) + P0.12 (Pack Sérénité override) + P0.16 (cession billet L.211-11). Sans ces 4, Eventy facture des promesses vides aux clients et viole 2 obligations légales du Code du tourisme.

---

# 🔄 ADDENDUM 2 — Audit complémentaire 2026-04-30 (sessions 3)

> Suite à demande PDG, audit approfondi de 5 zones encore non couvertes :
> 14. Sous-système **Symphonie** (80 fichiers, 40 654 lignes — découverte majeure)
> 15. **Quality Gates** côté backend
> 16. **Pension / repas** (`publishedPensionType`, `weeklyMealPlan`, `MealConfig`)
> 17. **Multi-voyage** (`voyageCount`, `VoyageConfig`, overrides)
> 18. **Gamification / énergie / sponsors** dans le flow création
>
> **Aucune ligne de code modifiée.**

---

## 14. SOUS-SYSTÈME SYMPHONIE (40 654 lignes — non audité initialement)

### 14.1 Découverte

**Dossier** : `frontend/app/(pro)/pro/voyages/nouveau/components/symphonie/`

**Volume** : **80 fichiers** — **62 composants TSX** + **17 helpers TS** + 1 broadcast.ts
- TSX : **32 765 lignes**
- Helpers TS : **7 879 lignes**
- **Total : 40 654 lignes**

⚠️ **Ce sous-système n'avait pas été détaillé dans le premier audit**. À titre de comparaison : le wizard "standard" (20 composants `Etape*` + 7 assistants) fait ~32 000 lignes. **Symphonie est plus gros que tout le reste du wizard**.

### 14.2 Branchement dans le wizard

**Fichier** : `nouveau/components/assistant/VoyageFlowAssistant.tsx:34, 228`

```ts
import SymphonieMaster from '../symphonie/SymphonieMaster';
// …
<SymphonieMaster formData={formData} setFormData={setFormData} />
```

→ Symphonie est branché **uniquement** via le tiroir flottant Assistant (onglet "Symphonie de création"), **pas** dans `page.tsx` du wizard standard. Donc :
- Le wizard linéaire (Etape 1 → Etape N) reste primaire
- Symphonie est une **couche additive** accessible via bouton flottant
- Risque UX : si le créateur n'ouvre jamais le tiroir, il rate **40k lignes de fonctionnalités**

### 14.3 Catalogue des 62 composants Symphonie

**SymphonieMaster.tsx** = orchestrateur de **61 modules** sur **11+ phases** documentées dans son header :

| Phase | Catégorie | Modules clés |
|-------|-----------|--------------|
| 1 (BASE) | Édition base | Timing, Arrêts, Activités, Catalogue |
| 2 (CONNECT) | Connexions | Connexions inter-composants |
| 2 (VALIDATE) | Validation | Timeline validator |
| 2 (PROPAGATE) | Diffusion | Fiche client, Devis bus, Prix live |
| 3 (CONNECT) | HRA | **Communication HRA** ⭐ |
| 4 (OVERVIEW) | Synthèse | Vue ensemble, Prêt-publier |
| 4 (VALIDATE+) | Validation avancée | Aéroport, Pauses, Dispo HRA |
| 4 (PROPAGATE) | SEO | SEO+JSON-LD, Comparer devis |
| 5 (OVERVIEW) | Équipe | Suggestions équipe |
| 5 (BASE) | Persistance | **Catalogue Pro** ⭐, Historique, FAQ |
| 6 (SECURITY) | Sécurité | **Audit log, Alertes auto, Rollback urgence** ⭐ |
| 7 (UX) | UX | **Calendrier visuel, Drag-Drop, Undo/Redo** ⭐, Multi-drafts A/B/C, Export PDF |
| 8 (TEMPLATES+IA) | IA | **Score qualité** ⭐, Suggestions auto, Bibliothèque templates, Dupliquer |
| 9 (WORKFLOW) | Validation Eventy | **Soumettre, suivre statut, commentaires bidirectionnels** ⭐ |
| 10 (BRACELETS) | Bracelets NFC | Clans/passions, Commande bracelets, Suivi livraison, Embarquement (scan + assign) |
| 11 (ONBOARDING) | Onboarding | Tour guidé end-to-end (15 étapes) |

⭐ = composants qui **résolvent des manques identifiés** dans mon premier audit.

### 14.4 Composants critiques détaillés

| Composant | Lignes | Rôle | Persistance |
|-----------|--------|------|-------------|
| `SymphonieMaster.tsx` | ~ | Orchestrateur 61 modules | localStorage |
| `SymphonieDashboard.tsx` | ~ | Tableau de bord global (% complétion, alertes, actions prioritaires) | localStorage |
| `CreatorCatalogPro.tsx` | ~ | **Catalogue créateur enrichi** : tags/dossiers, favoris, photos, contacts HRA, conditions négociées (remise/acompte/annulation), stats utilisation, import/export JSON | `localStorage` clé `eventy:creator:catalog-pro:v1` |
| `SymphonieHRACommunication.tsx` | ~ | **Canal direct créateur ↔ HRA** : liste HRA + statut workflow, demande dispo auto-générée (dates+pax), mini-thread messages, conditions négociées | `localStorage` |
| `SymphonieValidationWorkflow.tsx` | 716 | **Soumission validation Eventy** : suivi statut, historique, re-soumission après NEEDS_CHANGES, publish après APPROVED | `localStorage` clé `eventy:symphonie:validation:v1` |
| `SymphonieQualityScore.tsx` | ~ | **Score qualité 5 axes** (Complétude 25%, Équilibre 20%, Rythme 20%, Originalité 15%, Crédibilité 20%), radar SVG | localStorage |
| `SymphonieAuditLog.tsx` | ~ | **Journal actions créateur** : filtres par module/action/sévérité/jour | localStorage |
| `SymphonieHistorySnapshots.tsx` | ~ | **Snapshots versionnés** : manuel + auto (5 min hash diff) + rollback granulaire + diff sommaire, limite 20 snapshots | localStorage |
| `SymphonieEmergencyRollback.tsx` | ~ | **Détection symphonie cassée + rollback urgence** au dernier snapshot stable (score ≥ 70) | localStorage |
| `SymphonieAutoDraftSave.tsx` | 401 | **Multi-drafts A/B/C** : 3 slots labels, autosave 10s, switch entre drafts, diff entre slots | localStorage |
| `SymphonieDragDropEditor.tsx` | ~ | **Édition drag-drop activités** : déplacer horizontalement (heure), snap 15min, glisser entre jours | mute formData.program |
| `SymphonieDuplicate.tsx` | ~ | **Duplication template** : anonymise (titre/dates/photos), tag (destination/thème), export JSON | localStorage `eventy:symphonie:templates:v1` |
| `SymphonieB2BEnergy.tsx` | ~ | **Packs énergie B2B** : marques B2B, achat pack, attachement voyage, suivi consommation | localStorage `eventy:symphonie:b2b-{brands,packs,consumptions}:v1` |
| `SymphonieSponsorIntegration.tsx` | ~ | **Intégration sponsors** : Decathlon, Booking, Air France, Visa, Red Bull (BRONZE/SILVER/GOLD/PLATINUM), tracking ROI | localStorage |
| `SymphonieGamification.tsx` | ~ | **Profil gamifié créateur** : XP, niveaux 1-10 (Apprenti → Maître), 12 badges, devenir mentor 5+ | localStorage `eventy:symphonie:creators:v1` |
| `SymphonieBracelet*.tsx` (3 fichiers) | ~ | **Bracelets NFC** : Clans/passions, commande, livraison, embarquement (scan + assign) | localStorage |
| `SymphonieTransportQuoteAuto.tsx` | 385 | Devis transport automatique | localStorage |
| `SymphonieQuoteCompare.tsx` | ~ | Compare devis (≠ EtapeFournisseurs ?) | localStorage |
| `SymphonieMentorship.tsx` | ~ | Mentorship créateurs | localStorage |
| `SymphonieCoCreation.tsx` | ~ | Co-création (créateurs ensemble) | localStorage |
| `SymphonieCreatorRanking.tsx`, `SymphonieCreatorProfile.tsx`, `SymphonieCreatorReviews.tsx` | ~ | Profil + ranking + reviews créateurs | localStorage |
| `SymphonieFirstSteps.tsx`, `SymphonieOnboardingTour.tsx` | ~ | Onboarding 15 étapes | localStorage |
| `SymphonieFeedbackInsights.tsx`, `SymphonieVoyagerNeeds.tsx`, `SymphonieVoyagerReview.tsx` | 616 / 432 / ~ | Feedback voyageurs | localStorage |
| `SymphoniePDFExport.tsx` | ~ | Export PDF | local |

### 14.5 ⚠️ ALERTE CRITIQUE — 100% localStorage, 0 backend

**Vérification** : `grep -l "fetch\|apiClient\|axios" symphonie/*.tsx` → **0 fichier**.

**Tous les fichiers utilisent localStorage** :
- `CreatorCatalogPicker.tsx` : 3 occurrences localStorage
- `CreatorCatalogPro.tsx` : 3 occurrences
- `SymphonieAntiBlocage.tsx` : 6 occurrences
- `SymphonieHRACommunication.tsx` : 4 occurrences
- `SymphonieEmergencyRollback.tsx` : 4 occurrences
- `SymphonieMaster.tsx` : 2 occurrences
- (...19 fichiers utilisent localStorage)

→ **Conséquences** :
1. 🔥 Si créateur change de device, perd son cache, navigateur incognito → **perte totale** de catalogue, snapshots, communications HRA, drafts A/B/C
2. 🔥 L'**équipe Eventy ne voit JAMAIS** : les soumissions de validation Symphonie n'arrivent pas au backend, l'audit log n'est pas centralisé, les communications HRA n'envoient pas d'email
3. 🔥 Le HRA ne reçoit **rien** : SymphonieHRACommunication promet "demande de dispo auto-générée" mais c'est purement local — aucune notif/email réelle au partenaire
4. 🔥 Symphonie expose un Quality Score frontend qui n'est **pas** celui du backend (`QualityGateService` séparé) — 2 sources de vérité
5. 🔥 Les sponsors / packs B2B / bracelets NFC sont annoncés mais ne **génèrent aucune commande réelle**

### 14.6 Cohérence avec mon premier audit

**Manques que Symphonie résout (mais en localStorage) :**

| Premier audit | Symphonie | Statut réel |
|---------------|-----------|-------------|
| P0.1 — Bouton soumission/publication | `SymphonieValidationWorkflow.tsx:716` | ⚠️ UI existe mais **pas branché backend** |
| P0.3 — Notification HRA "inclus dans voyage" | `SymphonieHRACommunication.tsx` | ⚠️ UI existe mais **localStorage seul, aucune notif réelle** |
| P0.4 — Catalogue personnel créateur | `CreatorCatalogPro.tsx` + `CreatorCatalogPicker.tsx` | ⚠️ UI complète mais **localStorage** : pas multi-device, pas partagé |
| P1.1 — Auto-création thread "Voyage X — préparation" | `SymphonieHRACommunication.tsx` (mini-thread messages) | ⚠️ localStorage |
| P1.4 — Drag-drop arrêts intra-circuit + inter-jours | `SymphonieDragDropEditor.tsx` + `SymphonieStopsOrdering.tsx` + `SymphonieStopAdaptation.tsx` | ✅ Mute formData (donc persiste via save) |
| P1.12 — TravelChangelog / Historique versions | `SymphonieHistorySnapshots.tsx` (20 snapshots) + `SymphonieAuditLog.tsx` | ⚠️ localStorage |

→ **Symphonie est une démo client-side complète**. Pour passer MVP, il faut **brancher chaque module à un endpoint backend** (~20 endpoints à créer).

### 14.7 Synthèse Symphonie

| Aspect | État |
|--------|------|
| Volume code | **40 654 lignes** (62 TSX + 17 helpers) |
| Branchement wizard | ⚠️ Tiroir flottant uniquement (peut être manqué) |
| Architecture | ✅ Modulaire, additive (chaque header dit "Composant ADDITIF") |
| Persistance | ❌ **100% localStorage**, 0 appel backend |
| Cohérence formData | ✅ Lit `TravelFormData`, certains composants mutent (drag-drop, rollback) |
| Couverture fonctionnelle | ✅ Très large (catalogue, comm HRA, validation, audit, snapshots, gamification, bracelets, sponsors, B2B energy, mentorship, co-création, feedback) |
| Production-ready | ❌ **Démo only** — perte de données risquée + équipe Eventy aveugle |
| Risque | 🔥 Si user pense que Symphonie est en prod, il bâtit sur du sable |

→ **Verdict** : zone **20% MVP-ready** (UI ~100%, backend 0%). **Travail énorme à venir** pour brancher les ~20 endpoints. Mais base UI déjà très avancée.

---

## 15. QUALITY GATES (backend) + Score qualité (Symphonie)

### 15.1 Backend — `QualityGateService`

**Fichier** : `backend/src/modules/pro/quality-gate.service.ts` (555 lignes)

✅ **BON** :
- Service utilisé par `pro-travels.service.ts:publishTravel()` (l.424) avant publication
- Bloque la publication si erreurs `severity: 'error'` non passées
- Renvoie `QualityGateReport { passed, score, checks: QualityCheck[] }`
- Logger NestJS pour traçabilité
- 6 catégories de checks :
  - **GENERAL** : titre (≥10 caract.), description (≥100 caract.), photo de couverture, cohérence dates
  - **CONTENT** : (à creuser)
  - **HEBERGEMENT** : (cf. catégorie)
  - **LEGAL** : ✅ catégorie présente
  - **PRICING** : (à creuser)
  - **TRANSPORT** : (à creuser)

❌ **À CREUSER** :
- Pas vu de check explicite sur :
  - Garantie financière APST renseignée
  - RC Pro souscrite
  - Politique d'annulation cohérente avec barème backend
  - Acompte stocké (cf. P0.14 addendum 1)
  - Pack Sérénité activé
- Score weighted sur 100 ? Détail par catégorie ?

### 15.2 Frontend Symphonie — `SymphonieQualityScore`

**Fichier** : `nouveau/components/symphonie/SymphonieQualityScore.tsx`

⚠️ **DOUBLON** :
- Frontend score 5 axes : Complétude 25% / Équilibre 20% / Rythme 20% / Originalité 15% / Crédibilité 20%
- Backend score 6 catégories : GENERAL / CONTENT / HEBERGEMENT / LEGAL / PRICING / TRANSPORT
- **Pas la même rubrique, pas la même formule** → 2 scores différents pour la même chose
- Risque : créateur voit "85/100 prêt à publier" côté Symphonie, mais soumet → backend QualityGate refuse car critère LEGAL manquant

### 15.3 Workflow validation admin

**Fichier** : `backend/src/modules/pro/travels/pro-travels.controller.ts:188-226`

Les 3 endpoints critiques validés :
- `POST /pro/travels/:id/submit-p1` (l.188) → `SUBMITTED`/`PHASE1_REVIEW`
- `POST /pro/travels/:id/submit-p2` (l.207) → `PHASE2_REVIEW`
- `POST /pro/travels/:id/publish` (l.226) → `PUBLISHED` après QualityGate

❌ **MISSING — admin side** :
- Aucun endpoint vu pour `POST /admin/travels/:id/approve-phase1`, `POST /admin/travels/:id/request-changes`
- Workflow décrit mais côté admin : invisible sur backend (à creuser dans `admin.controller.ts`)
- Le créateur ne peut pas avancer après `PHASE1_REVIEW` tant que admin n'a pas validé manuellement

### 15.4 Synthèse Quality Gates + validation

| Aspect | État |
|--------|------|
| Backend QualityGateService | ✅ Solide (555 lignes, 6 catégories, LEGAL/TRANSPORT inclus) |
| Bloque publication si erreurs | ✅ `runQualityCheck()` appelé avant `PUBLISHED` |
| Frontend score Symphonie | ⚠️ 5 axes différents → 2 sources de vérité |
| Endpoints submit-p1 / submit-p2 / publish | ✅ Existent |
| Endpoints admin approve / request-changes | ❓ Non vu |
| Synchronisation statut frontend/backend | ❌ Symphonie en localStorage, backend a son enum séparé |
| Notification créateur quand admin valide | ❌ Pas vu de listener / template email |

→ **Verdict** : zone **60% MVP-ready**. Backend solide, frontend cohérent à brancher.

---

## 16. PENSION / REPAS (`publishedPensionType`, `weeklyMealPlan`, `MealConfig`)

### 16.1 Modèles `MealConfig` et `DayMealPlan`

**Fichier** : `nouveau/types.ts:155-162, 1604+`

```ts
export interface MealConfig {
  fullBoard: boolean;     // Tout compris
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  specialDiets: boolean;  // végétarien, halal, etc.
}

export interface DayMealPlan {
  /** Numéro du jour (1-based, aligné sur DayProgram.dayNumber) */
  dayNumber: number;
  // ... (à creuser)
}
```

### 16.2 `publishedPensionType` (côté fiche client)

**Fichier** : `nouveau/types.ts:945-962`

```ts
publishedPensionType?: 'FULL_BOARD' | 'HALF_BOARD' | 'BREAKFAST_ONLY' | 'ALL_INCLUSIVE';
publishedPensionDetails?: string[];  // override des items par défaut PENSION_META[type].details
```

Commentaire :
> *"Si BREAKFAST_ONLY (minimum garanti), si A_LA_CARTE/VOUCHER/MIX → BREAKFAST_ONLY; ALL_INCLUSIVE → futur (V2)"*
> *"Permet au Pro de personnaliser la promesse client (ex: 'Boissons incluses au dîner' pour un FULL_BOARD)"*

✅ **BON** :
- Champ exposé sur la fiche publique du voyage
- Personnalisable par le Pro (override `publishedPensionDetails`)
- Convention `'libre'` / `'option'` / sinon = inclus dans les items

⚠️ **ATTENTION** :
- Champ dual : `MealConfig` (interne, fine-grained) vs `publishedPensionType` (vitrine simple)
- Risque incohérence : créateur dit `fullBoard: true` mais oublie de set `publishedPensionType: 'FULL_BOARD'`
- Pas de validation croisée détectée

### 16.3 `weeklyMealPlan` (planning hebdomadaire repas)

**Fichier** : `nouveau/types.ts:987-988`

```ts
/** Planning hebdomadaire restauration — construit automatiquement depuis planMode, personnalisable */
weeklyMealPlan?: DayMealPlan[];
```

⚠️ **À VALIDER** :
- `DayMealPlan` lié à `DayProgram.dayNumber` → cohérent avec EtapeProgram
- Construction "automatique depuis planMode" : à vérifier (où ce code vit-il ?)
- Edition manuelle possible

### 16.4 Restaurants partenaires sur trajet long

**Fichier** : `nouveau/types.ts:990-994`

```ts
routeRestaurantAllerId?: string | null;
routeRestaurantAllerName?: string;
routeRestaurantRetourId?: string | null;
routeRestaurantRetourName?: string;
```

✅ **BON** :
- Permet d'ajouter un restaurant sur les trajets aller/retour longs (cohérent avec `extraTransportDays`)
- 2 IDs distincts aller/retour (ex: pause Lyon à l'aller, Avignon au retour)

❌ **MISSING** :
- Pas de bloc activité sur le trajet long (juste resto)
- Pas d'option "pause toilettes obligatoire toutes les 2h" (loi conducteur bus)

### 16.5 Boutiques partenaires (HRA type BOUTIQUE)

**Fichier** : `nouveau/types.ts:995-996`

```ts
selectedBoutiqueIds?: string[];
```

⚠️ **À CREUSER** :
- Boutiques sélectionnées pour le voyage (ex: shopping souk Marrakech)
- Type HRA `BOUTIQUE` existe-t-il en backend ? (à vérifier dans les types HRA backend)

### 16.6 Régimes spéciaux (allergies / diététique)

**Fichier** : `backend/prisma/schema.prisma` (`DietaryPreference` lié à BookingGroup l.2268)

✅ **BON** :
- Modèle `DietaryPreference` lié à `BookingGroup`
- Mais : pas de logique côté création voyage pour pré-déclarer les régimes possibles

❌ **MISSING** :
- Wizard ne demande pas au créateur "quels régimes garantissez-vous au restaurant partenaire ?"
- Donc côté client, le voyageur peut demander "halal" mais le créateur n'a jamais validé que le resto sait servir halal
- Risque commercial + sécurité alimentaire

### 16.7 Synthèse pension/repas

| Aspect | État |
|--------|------|
| `MealConfig` (fine-grained) | ✅ Présent, simple |
| `publishedPensionType` (vitrine) | ✅ Présent, override possible |
| `weeklyMealPlan` (jour par jour) | ⚠️ Présent mais source de génération non auditée |
| Restaurants trajet aller/retour | ✅ Présent |
| Régimes spéciaux pré-déclarés au resto | ❌ Manquant |
| Validation croisée MealConfig ↔ publishedPensionType | ❌ Pas vue |
| Boutiques HRA | ⚠️ Champs présents, type backend à vérifier |
| ALL_INCLUSIVE | ❌ Marqué "futur (V2)" |

→ **Verdict** : zone **70% MVP-ready**. Solide pour les 4 pensions de base. Manque validation croisée + régimes pré-déclarés.

---

## 17. MULTI-VOYAGE (`voyageCount`, `VoyageConfig`, overrides)

### 17.1 Concept

**Fichier** : `nouveau/types.ts:783-819, 832-845`

```ts
voyageCount?: number;  // 1-4. Défaut = 1. 2+ = multi-voyage
voyageConfigs?: VoyageConfig[];  // Une config par voyage si voyageCount > 1
```

→ **Multi-voyage** = 1 voyage de base + 2 à 4 variations (même transport, mêmes dates, mêmes voyageurs ne mélangeant pas, juste hôtel/programme/activités différents).
→ Cas d'usage typique : "vol charter 100 places vers Marrakech, mais 50 personnes en mode Riad authentique + 50 en Resort Palace".

### 17.2 VoyageConfig — overrides possibles

```ts
export interface VoyageConfig {
  voyageNumber: number;
  label: string;  // Ex: "Voyage 1 — Marrakech Deluxe"
  hotelOverride?: string | null;
  programOverride?: DayProgram[] | null;
  activitiesOverride?: StandaloneActivity[] | null;
  mealConfigOverride?: MealConfig | null;
  roomsOverride?: Room[] | null;
  notes?: string;
  isCustomized: boolean;
  restaurantOverride?: string | null;
  activityIdsOverride?: string[] | null;
  backupHotelOverride1?: string | null;
  backupHotelOverride2?: string | null;
  backupRestaurantOverride1?: string | null;
  backupRestaurantOverride2?: string | null;
}
```

### 17.3 UI multi-voyage — `VoyageHRASelector`

**Fichier** : `nouveau/components/VoyageHRASelector.tsx:468 lignes` (déjà audité §2)

✅ **BON** :
- Si `voyageCount > 1`, permet personnalisation HRA par voyage
- Reset configs disponible (l.93-106)
- Mock data `VOYAGE_HOTELS`, `VOYAGE_RESTAURANTS`, `VOYAGE_ACTIVITIES`

⚠️ **MAUVAIS** :
- Inline styles (pas Tailwind)
- Typo flag `'notes'` vs `'note'` (l.82)

### 17.4 Multi-voyage backend

**Fichier** : `backend/prisma/schema.prisma` (`TravelGroup` model)

✅ **BON** :
- Modèle `TravelGroup` existe : `BookingGroup.travelGroupId` (l.2255), `Travel.travelGroup` (l.1987)
- Permet de regrouper plusieurs voyages partageant infra commune

❌ **À CREUSER** :
- Pas vérifié si `TravelGroup` permet jusqu'à 4 voyages ou plus
- Pas vu de logique backend pour "vol charter partagé entre voyages"

### 17.5 Workflow multi-voyage avec avion (mention dans types.ts:836)

> *"Pour 2+ voyages avec avion → demande de devis aux employés Eventy"*

❌ **MISSING** :
- Aucun endpoint vu : `POST /pro/travels/:id/request-flight-quote` (employés Eventy)
- Workflow équipe terrain Eventy pour gérer devis groupé : non audité

### 17.6 Synthèse multi-voyage

| Aspect | État |
|--------|------|
| Concept (1 base + variations) | ✅ Bien défini types.ts |
| `VoyageConfig` overrides (hotel/program/meals/rooms/activities/restaurant) | ✅ Complet |
| UI `VoyageHRASelector` | ✅ Existe, fonctionnel |
| Backend `TravelGroup` | ✅ Existe |
| Devis avion charter groupé | ❌ Workflow manquant |
| Limite max voyages | ⚠️ types.ts dit 1-4, à valider |
| Validation cohérence (transport partagé) | ❓ Non auditée |

→ **Verdict** : zone **65% MVP-ready**. Concept solide, UI présente, manque workflow équipe Eventy pour vols charter.

---

## 18. GAMIFICATION / ÉNERGIE / SPONSORS dans le flow création

### 18.1 Frontend — modules Symphonie liés

**Fichiers** :
- `SymphonieGamification.tsx` — profil créateur (XP, niveaux 1-10, 12 badges, devenir mentor 5+)
- `SymphonieB2BEnergy.tsx` + `symphonieB2BEnergyHelper.ts` — packs énergie B2B (marques + consumption)
- `SymphonieSponsorIntegration.tsx` + `symphonieSponsorHelper.ts` — sponsors (Decathlon, Booking, Air France, Visa, Red Bull) avec packs BRONZE/SILVER/GOLD/PLATINUM, tracking ROI
- `SymphonieRewardsLedger.tsx` — ledger récompenses créateur
- `SymphonieClanPassions.tsx` — clans/passions (lié bracelets NFC)
- `SymphonieBraceletEmbark.tsx`, `SymphonieBraceletDelivery.tsx`, `SymphonieBraceletsOrder.tsx` — bracelets NFC scan + assign
- `SymphonieMentorship.tsx` — mentorship créateurs

✅ **BON** :
- Toute la suite gamification créateur côté frontend
- Modélisation enrichie : XP, badges (12 types), niveaux titrés (Apprenti → Maître), mentor unlock

❌ **CRITIQUE — TOUT en localStorage** :
- `eventy:symphonie:creators:v1` (gamification)
- `eventy:symphonie:b2b-{brands,packs,consumptions}:v1` (B2B energy)
- `eventy:symphonie:activity-sponsorships:v1` (sponsors)
- → Aucune persistance backend → si créateur change de device, **perte XP/badges/niveaux/sponsors**
- → Pas de classement inter-créateurs réel possible

### 18.2 Champ types.ts — `marginCreatorPct`

**Fichier** : `nouveau/types.ts:424, 436`

```ts
// → 5% Rémunération vente (CRITIQUE pour motivation — gamification, classements)
/** Part rémunération vente — gamification, classements, challenges (défaut 5%) */
```

✅ **BON** :
- Champ rémunération vente créateur (5% défaut)
- Lié à gamification (incentive vente)

⚠️ **À VÉRIFIER** :
- Cohérence avec mémoire PDG `project_business_model_pdg.md` : 5% vendeur + 3% créateur (rev 2026-04-29)
- Le commentaire dit "5% rémunération vente" mais memory dit "3% créateur". Vérifier qui touche quoi (vendeur vs créateur du voyage).

### 18.3 Backend — gamification

❓ **À CREUSER** :
- Existe-t-il un module backend `gamification` / `creator-xp` / `creator-rankings` ?
- Le frontend Symphonie expose tout, mais aucune persistance n'a été vérifiée backend
- Cf. memory MEMORY.md / TODO-GAMING-* multiple files (FIDÉLISATION, MONDES, RAIDS-BOSS, SOCIAL, SPONSORS-HEROS) → indique un système gaming planifié

### 18.4 Sponsors — modèle commercial

**Composant** : `SymphonieSponsorIntegration.tsx` (header)

5 marques sponsorisées ciblées : **Decathlon, Booking, Air France, Visa, Red Bull**.

4 niveaux pack : BRONZE / SILVER / GOLD / PLATINUM.

Tracking : exposure, clics estimés, coût, costPerClick, roiScore.

❌ **MISSING — backend** :
- Aucun module commercial Eventy (manager sponsors)
- Aucune intégration vraie avec ces marques (commentaire "simulation MVP, en prod : module commercial Eventy")
- Aucune facturation sponsor automatique
- Pas de contrat sponsor ni reporting partenaire

### 18.5 Bracelets NFC — modèle physique

**Composants** : `SymphonieBraceletsOrder.tsx`, `SymphonieBraceletDelivery.tsx`, `SymphonieBraceletEmbark.tsx`

Workflow décrit :
1. Commande bracelets NFC
2. Suivi livraison (chez l'indépendant créateur)
3. Embarquement = scan + assign à voyageur

❌ **MISSING — réel** :
- Aucun fournisseur réel (qui imprime/programme les bracelets ?)
- Aucune intégration NFC physique côté backend (lecture scan NFC = ?)
- Aucun stock géré
- localStorage seul

### 18.6 Synthèse gamification / énergie / sponsors

| Aspect | État |
|--------|------|
| UI gamification créateur (XP, niveaux, badges, mentor) | ✅ Complète frontend |
| Persistance backend gamification | ❌ Aucune (localStorage seul) |
| Classements inter-créateurs | ❌ Impossible (pas de données partagées) |
| Sponsors marques (5 brands, 4 niveaux) | ⚠️ UI démo + tracking ROI mais 100% simulation |
| Module commercial Eventy backend | ❌ Inexistant |
| Bracelets NFC | ⚠️ UI complète, 0 supply chain réelle |
| Cohérence rémunération créateur (3% vs 5%) | ⚠️ Commentaire types.ts vs memory PDG : à clarifier |

→ **Verdict** : zone **15% MVP-ready**. Tout est démo. Pas critique pour MVP V1 (focus voyage + paiement) mais à clarifier pour la roadmap future.

---

## 19. NOUVEAUX TODOs PRIORITAIRES (issus de l'addendum 2)

### 🔴 P0 — BLOQUANT MVP

| # | Tâche | Fichier(s) | Effort |
|---|-------|-----------|--------|
| P0.17 | **Backend pour Symphonie** : créer ~20 endpoints pour persister catalogue créateur, communications HRA, snapshots, audit log, validation workflow, drafts A/B/C — sortir du localStorage | nouveau module `symphonie` backend | XL (10-15j) |
| P0.18 | **Brancher SymphonieValidationWorkflow.tsx aux endpoints existants** `submit-p1` / `submit-p2` / `publish` (P0.1 du premier audit) | `SymphonieValidationWorkflow.tsx`, `pro-travels.controller.ts` | M (2j) |
| P0.19 | **Brancher SymphonieHRACommunication aux notifications backend** (P0.3 du premier audit) — envoi vrai email + WebSocket au HRA | `SymphonieHRACommunication.tsx`, `notification-events.service.ts` | L (3j) |
| P0.20 | **Brancher CreatorCatalogPro à un endpoint** `/pro/catalog/personnel` (P0.4 du premier audit) — DB + sync multi-device | `CreatorCatalogPro.tsx`, nouveau backend | M (2j) |
| P0.21 | **Endpoint admin approve / request-changes** (Phase 1 et Phase 2) | `admin.controller.ts`, `pro-travels.service.ts` | M (2j) |
| P0.22 | **Régimes spéciaux pré-déclarés** au resto dans le wizard (sécurité alimentaire) | `EtapeRestoration.tsx`, `MealConfig` | S (1j) |
| P0.23 | **Synchroniser Quality Score frontend ↔ backend** : Symphonie doit lire `QualityGateService` au lieu de calculer son propre score | `SymphonieQualityScore.tsx`, nouvel endpoint `/pro/travels/:id/quality-check` | M (1.5j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.19 | Ajouter checks LEGAL au QualityGateService : APST, RC Pro, garantie financière, CGV cohérentes | M (2j) |
| P1.20 | Validation croisée `MealConfig` ↔ `publishedPensionType` (alerte si incohérent) | S (0.5j) |
| P1.21 | Workflow équipe Eventy pour devis vol charter multi-voyage | L (3j) |
| P1.22 | Cohérence rémunération créateur (3% vs 5% — clarifier avec PDG) + commentaire types.ts | XS (15min) |
| P1.23 | Bouton flottant Assistant **plus visible** (pour ne pas rater Symphonie) | S (0.5j) |
| P1.24 | Visualisation backend admin : "Quels créateurs utilisent Symphonie en mode démo ?" (utile pour identifier les voyages avec données fragiles) | M (1.5j) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.16 | Persistance gamification backend (XP, badges, niveaux, mentor) + classements inter-créateurs | L (3j) |
| P2.17 | Module commercial Eventy backend (sponsors marques, contrats, facturation) | XL (5-7j) |
| P2.18 | Supply chain bracelets NFC réelle (fournisseur, stock, programmation) | XL (5j+) |
| P2.19 | Symphonie packs B2B Energy : intégration vraie avec marques | L (3j) |
| P2.20 | ALL_INCLUSIVE comme `publishedPensionType` (V2) | S (1j) |

### 📊 Mise à jour tableau récap MVP global

| Bloc | Avant addendum 2 | Après audit complémentaire |
|------|------------------|----------------------------|
| Sous-système Symphonie (40k lignes) | non audité | **20% MVP** (UI ~100%, backend 0%) |
| Quality Gates backend | partiellement audité | **60% MVP** (solide, à étendre) |
| Pension / repas | non audité | **70% MVP** |
| Multi-voyage | partiellement audité | **65% MVP** |
| Gamification / sponsors / bracelets | non audité | **15% MVP** (démo only) |

**Total ajouté à la roadmap addendum 2** : ~30 jours dev (P0.17-23) + ~7 jours (P1.19-24) + ~25 jours (P2.16-20).

**Roadmap globale cumulée (3 sessions audit)** :
- P0 total : **~67 jours** (cumul P0.1-23)
- P1 total : **~41 jours** (cumul P1.1-24)
- P2 total : **~59 jours** (cumul P2.1-20)
- → ≈ **167 jours dev solo** / **≈ 84 jours en parallèle (2-3 devs)** pour atteindre 100% MVP

---

## 20. RÉFÉRENCES ADDENDUM 2

- `frontend/app/(pro)/pro/voyages/nouveau/components/symphonie/` (80 fichiers, 40 654 lignes)
  - `SymphonieMaster.tsx` (orchestrateur 61 modules)
  - `SymphonieValidationWorkflow.tsx:716`
  - `SymphonieHRACommunication.tsx`
  - `CreatorCatalogPro.tsx` (localStorage `eventy:creator:catalog-pro:v1`)
  - `SymphonieAutoDraftSave.tsx:401`
  - `SymphonieHistorySnapshots.tsx`
  - `SymphonieEmergencyRollback.tsx`
  - `SymphonieDragDropEditor.tsx`
- `frontend/app/(pro)/pro/voyages/nouveau/components/assistant/VoyageFlowAssistant.tsx:34, 228` (branchement Symphonie)
- `backend/src/modules/pro/quality-gate.service.ts:1-555`
- `backend/src/modules/pro/travels/pro-travels.controller.ts:188-226`
- `frontend/app/(pro)/pro/voyages/nouveau/types.ts:155-162, 783-819, 832-845, 942-988`
- `backend/prisma/schema.prisma` (`Travel`, `TravelGroup`, `DietaryPreference`, `BookingGroup`)
- TODO-GAMING-* (FIDÉLISATION, MONDES, RAIDS-BOSS, SOCIAL, SPONSORS-HEROS)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Découverte clé addendum 2** : un sous-système **Symphonie** de **40 654 lignes** existe et résout en frontend la plupart des manques identifiés au premier audit (catalogue créateur, comm HRA, validation workflow, snapshots, drag-drop). MAIS il est **100% localStorage** → l'UI promet, le backend ne sait rien. **P0.17-20** sont prioritaires : brancher Symphonie au backend pour qu'Eventy ne soit pas une démo.

**Action consolidée recommandée** (validation PDG) — Top 5 P0 cumulés sur 3 sessions audit :
1. **P0.18** (brancher SymphonieValidationWorkflow → submit-p1/p2/publish backend) — débloque toute la chaîne validation
2. **P0.19** (brancher SymphonieHRACommunication → vraies notifications) — sauve l'âme Eventy côté partenaires
3. **P0.20** (brancher CreatorCatalogPro → DB) — sauve les données du créateur si change de device
4. **P0.10** (refund auto NO_GO) — bloque les remboursements perdus
5. **P0.16** (cession billet L.211-11) — obligation légale Code du tourisme

---

# 🔄 ADDENDUM 3 — Audit infrastructure & qualité 2026-04-30 (sessions 4)

> Audit des couches transverses (backend détaillé, sécurité, validation, performance, tests, SEO, onboarding) :
> 21. Backend `pro-travels` en détail (controller + service + DTOs)
> 22. Sécurité / RBAC / guards
> 23. DTOs / validation Zod backend
> 24. Performance / lazy-loading
> 25. Tests existants (frontend + backend)
> 26. SEO fiche publique
> 27. Onboarding créateur
>
> **Aucune ligne de code modifiée.**

---

## 21. BACKEND `pro-travels` — endpoints exhaustifs

### 21.1 Controller — 22 endpoints

**Fichier** : `backend/src/modules/pro/travels/pro-travels.controller.ts:912 lignes`

| # | Méthode | Route | Rôle | Rate-limit profile |
|---|---------|-------|------|--------------------|
| 1 | `GET` | `/pro/travels` | Liste voyages du Pro avec filtres (status, search, cursor, take) | (default) |
| 2 | `POST` | `/pro/travels` | Créer voyage DRAFT | `PAYMENT` |
| 3 | `GET` | `/pro/travels/:id` | Détail voyage | (default) |
| 4 | `PATCH` | `/pro/travels/:id` | Update (DRAFT/CHANGES_REQUESTED only) | `SEARCH` |
| 5 | `POST` | `/pro/travels/:id/submit-p1` | Soumet Phase 1 → PHASE1_REVIEW | `PAYMENT` |
| 6 | `POST` | `/pro/travels/:id/submit-p2` | Soumet Phase 2 → PHASE2_REVIEW | `PAYMENT` |
| 7 | `POST` | `/pro/travels/:id/publish` | Publie après QualityGate | `ADMIN_CRITICAL` |
| 8 | `POST` | `/pro/travels/:id/cancel` | Annule (statut → CANCELED) | (default) |
| 9 | `POST` | `/pro/travels/:id/quality-gate` | Run quality check | (default) |
| 10 | `GET` | `/pro/travels/:id/quality-gate` | Last quality check | (default) |
| 11 | `GET` | `/pro/travels/:id/quality-gate/history` | Historique checks | (default) |
| 12 | `POST` | `/pro/travels/:id/duplicate` | Dupliquer saison | (default) |
| 13 | `PATCH` | `/pro/travels/:id/preannounce` | Pré-annonce | (default) |
| 14 | `GET` | `/pro/travels/:id/stats` | Stats CA/occupancy | (default) |
| 15 | `GET` | `/pro/travels/:id/team` | Liste équipe | (default) |
| 16 | `POST` | `/pro/travels/:id/team/invite` | Inviter membre | `SEARCH` |
| 17 | `PATCH` | `/pro/travels/:id/team/:memberId` | Update membre | `SEARCH` |
| 18 | `DELETE` | `/pro/travels/:id/team/:memberId` | Retirer membre | (default) |
| 19 | `GET` | `/pro/travels/:id/bookings` | Liste réservations | (default) |
| 20 | `GET` | `/pro/travels/:id/rooming` | Rooming list | (default) |
| 21 | `PUT` | `/pro/travels/:id/rooming/assign` | Assigner chambres | (default) |

✅ **BON** :
- Couverture endpoint **large** (22 routes pour piloter un voyage)
- ParseUUIDPipe sur tous les `:id` → blocage IDs malformés
- @ApiTags, @ApiOperation, @ApiResponse → Swagger auto-généré
- Rate-limiting par profile (PAYMENT, SEARCH, ADMIN_CRITICAL)
- Logger NestJS sur toutes les actions sensibles (notif team invite l.569)
- Vérification ownership systématique : `proProfile.id` vs `travel.proProfileId`

⚠️ **MAUVAIS** :
- Pas d'endpoint `POST /pro/travels/:id/team/invite` qui crée un compte si l'invité n'existe pas (l.534-536 : *"Utilisateur introuvable — il doit d'abord créer un compte Eventy"*) → friction UX
- Endpoints quality-gate distinct (run / read / history) → 3 routes pour 1 fonctionnalité, alors qu'on pourrait faire 1 + paramètre

### 21.2 Service — `pro-travels.service.ts:867 lignes`

**Méthodes principales** (extraites du contrôleur) :
- `createTravel()` — DRAFT initial, génération slug unique (50 candidats batch)
- `getMyTravels()` — liste avec filtres + pagination cursor-based
- `getTravelByIdAndPro()` — vérif ownership ForbiddenException
- `updateTravel()` — refuse si pas DRAFT/CHANGES_REQUESTED
- `submitPhase1()` / `submitPhase2()` / `publishTravel()` — workflow
- `cancelTravel()` — bascule CANCELED (sans refund auto, cf. addendum 1 §11.6)
- `enforceHraCascadeLock()` — admin verrouille la cascade marges → pro ne peut pas bypass
- `generateUniqueSlug()` — anti-collision avec batch query

✅ **BON** :
- Génération slug avec batch query (perf) + fallback timestamp (l.176)
- Vérif ownership systématique (`ForbiddenException` si proProfileId ne matche pas)
- HRA-Cascade lock (verrouillage admin de la marge) respecté à la création
- Workflow status machine claire

❌ **CRITIQUE — Persistance partielle** :
- `createTravel()` (l.103-141) ne persiste que **11 champs basiques** + `marginConfig`/`costConfig` en JSON opaque
- Tous les autres champs du `TravelFormData` frontend (`depositPercent`, `cancellationPolicy`, `voyageCount`, `voyageConfigs`, `weeklyMealPlan`, `publishedPensionType`, `securitySheet`, `marketingConfig`, `selectedHotelId`, `backupHotelId1/2`, `selectedRestaurantId`, `selectedActivityIds`, `selectedBoutiqueIds`, `routeRestaurantAllerId`, `hraEstimate`, `highlights`, `uniquePoints`, `testimonials`, `tripVideoUrl`, `hostVideoUrl`, etc.) **ne sont JAMAIS persistés via createTravel/updateTravel**
- Le service appelle `CreateTravelSchema.parse(dto)` (l.104) → schéma INTERNE différent du DTO Zod du contrôleur (double validation, peut-être différentes !) — risque de drift

### 21.3 Synthèse backend pro-travels

| Aspect | État |
|--------|------|
| Volume code | ✅ 912 (controller) + 867 (service) lignes |
| Coverage endpoints | ✅ 22 routes (création + workflow + équipe + rooming + bookings) |
| Validation Zod (controller) | ✅ Pipe sur 6 endpoints |
| Vérif ownership | ✅ Systématique |
| Rate-limiting | ✅ Par profile |
| Logger | ✅ Présent |
| **Persistance des champs frontend** | ❌ **Partielle** : ~85% des champs `TravelFormData` ne sont pas persistés |
| Double validation (controller + service) | ⚠️ 2 schémas Zod, risque drift |
| Workflow status machine | ✅ DRAFT → SUBMITTED → PHASE1_REVIEW → APPROVED_P1 → PHASE2_REVIEW → APPROVED_P2 → PUBLISHED |
| Refund auto NO_GO | ❌ (cf. P0.10) |

→ **Verdict** : zone **65% MVP-ready**. Architecture solide, mais persistance trop minimaliste — la vraie richesse du wizard frontend ne survit pas au save.

---

## 22. SÉCURITÉ / RBAC / GUARDS

### 22.1 Guards & décorateurs

**Fichier** : `backend/src/common/guards/roles.guard.ts`, `backend/src/common/decorators/roles.decorator.ts`

✅ **BON** :
- `JwtAuthGuard` + `RolesGuard` combinés sur `ProTravelsController` (l.64)
- Décorateur `@Roles('PRO', 'ADMIN')` au niveau controller
- `RolesGuard` lit les métadonnées via `Reflector`
- `CurrentUser` decorator pour extraire l'utilisateur authentifié
- ParseUUIDPipe sur tous les `:id`

⚠️ **MAUVAIS** :
- `@Roles('PRO', 'ADMIN')` au niveau controller s'applique à TOUS les endpoints, y compris team/invite, quality-gate, cancel — un Pro peut faire tout ça sur **ses** voyages mais aucun lock supplémentaire (ex : `@Roles('ADMIN')` pour cancel ?)
- Pas de logique fine type "le Pro peut éditer son voyage en DRAFT, l'admin peut éditer n'importe quel statut" — repose uniquement sur la vérif ownership statique
- Pas vu de guard `@Public()` ni de gestion explicite des routes anonymes

### 22.2 Sécurité métier

**Fichier** : `pro-travels.controller.ts:96-107` (validation enum status), `l.529-533` (select limité)

✅ **BON** :
- `SECURITY FIX (LOT 166)` : valider enum `TravelStatus` au lieu de cast aveugle (l.97-106)
- `SECURITY FIX (Sprint 55)` : `select: { id: true }` pour ne jamais charger `passwordHash` ni `twoFactorSecret` lors de la recherche d'un user à inviter (l.531)
- `SECURITY FIX (LOT 166)` : ne pas exposer le statut interne dans l'erreur d'updateTravel (l.218)

⚠️ **MAUVAIS** :
- Beaucoup de fixs `SECURITY FIX (LOT 166)`, `Sprint 55`, etc. : trace de bugs sécurité historiques. À auditer plus en profondeur avec un security-review dédié.
- `pendingModels()` utilisé pour `travelTeamMember` (l.545) → modèle Prisma "pending" (pas dans le schema principal ?) → risque de cohérence

### 22.3 Synthèse RBAC / sécurité

| Aspect | État |
|--------|------|
| JwtAuthGuard + RolesGuard | ✅ Globaux sur controller |
| Vérif ownership (proProfileId) | ✅ Systématique dans le service |
| ParseUUIDPipe | ✅ Sur tous les `:id` |
| Rate-limiting par profile | ✅ |
| Sélections sécurisées (no passwordHash) | ✅ |
| Validation enums runtime | ✅ |
| Audit log des actions | ⚠️ Partiel (présent dans cancellation, à étendre) |
| RBAC fin par action (pas seulement role) | ❌ |
| Tests sécurité dédiés | ❓ À vérifier |

→ **Verdict** : zone **75% MVP-ready**. Base saine, plusieurs fixs sécurité historiques visibles — bon signe (équipe attentive). Pour audit complet, lancer `/security-review`.

---

## 23. DTOs / VALIDATION ZOD BACKEND

### 23.1 Inventaire DTOs

**Dossier** : `backend/src/modules/pro/travels/dto/`

| Fichier | Lignes | Schéma Zod |
|---------|--------|-----------|
| `create-travel.dto.ts` | 36 | `CreateTravelDtoSchema` |
| `update-travel.dto.ts` | 10 | `UpdateTravelDtoSchema = CreateTravelDtoSchema.partial()` |
| `duplicate-travel.dto.ts` | 28 | `DuplicateTravelDtoSchema` |
| `invite-team-member.dto.ts` | 38 | `InviteTeamMemberDtoSchema` |
| `update-team-member.dto.ts` | 26 | `UpdateTeamMemberDtoSchema` |
| `assign-room.dto.ts` | 9 | `AssignRoomDtoSchema` |
| `set-preannounce-date.dto.ts` | 8 | `SetPreannounceDateDtoSchema` |
| `index.ts` | 7 | export central |
| **Total** | **162** | 7 DTO Zod |

### 23.2 `CreateTravelDtoSchema` (36 lignes)

**Champs validés** :
- `title` (5-255 chars, required)
- `description` (max 10 000 chars, optional)
- `departureDate`, `returnDate` (z.coerce.date, required)
- `departureCity`, `destinationCity`, `destinationCountry` (max 255/100 chars, optional)
- `transportMode` (enum 9 valeurs, required)
- `capacity` (1-500, required)
- `category` (enum 8 valeurs, optional)
- `travelClass` (enum 5 valeurs, optional)
- `isExclusive` (boolean, optional)
- `maxGroupSize` (positive int, optional)
- `marginConfig`, `costConfig` (`JsonObjectSchema` = z.record(z.unknown()), optional)

❌ **CRITIQUE — comparaison avec le frontend `TravelFormData`** :

| Champ frontend | Validé backend ? |
|----------------|------------------|
| `title`, `description`, `startDate`, `endDate`, `destination`, `transportMode`, `capacity` | ✅ |
| `shortDescription`, `voyageCount`, `voyageConfigs[]` | ❌ |
| `depositPercent`, `cancellationPolicy`, `earlyBird`, `pricingOptions[]` | ❌ |
| `selectedHotelId`, `backupHotelId1/2`, `selectedRestaurantId`, `backupRestaurantId1/2`, `selectedActivityIds[]`, `selectedBoutiqueIds[]` | ❌ |
| `mealConfig`, `publishedPensionType`, `publishedPensionDetails`, `weeklyMealPlan` | ❌ |
| `routeRestaurantAllerId`, `routeRestaurantRetourId` | ❌ |
| `hraEstimate`, `marginConfig`, `costConfig`, `marketingConfig` | ⚠️ Seulement `marginConfig`+`costConfig` en JSON opaque |
| `securitySheet`, `securitySheetApproved` | ❌ |
| `stops[]`, `routes[]`, `occurrences[]`, `busSurPlace` | ❌ |
| `program[]`, `standaloneActivities[]`, `highlights[]` | ❌ |
| `team`, `creatorAccompagnator` (équipe terrain) | ❌ (séparé via `/team/invite`) |
| `rotationPattern`, `rotationCount`, `extraTransportDays` | ❌ |
| `minimumPassengers`, `minPaxToGo`, `decisionDeadlineDays` | ❌ |
| `barIncluded`, `gamme`, `selectedAircraftKey` | ❌ |
| `tripVideoUrl`, `hostVideoUrl`, `uniquePoints`, `testimonials` | ❌ |

→ Sur **~80 champs** majeurs du `TravelFormData`, seulement **~12 sont vraiment validés** par le DTO backend. **85% du wizard ne survit pas au backend**.

### 23.3 Conséquences

🔥 **L'utilisateur David doit savoir que** :
- Le créateur peut passer 4h dans le wizard, mais **seuls ~12 champs sont sauvegardés**
- Le reste est soit en `localStorage` Symphonie (perdu si change device), soit dans `marginConfig`/`costConfig` (JSON opaque, pas validé métier — créateur peut envoyer n'importe quoi)
- Une fois publié, le voyage côté backend a un titre, dates, transport, capacité — c'est tout. La fiche publique ne peut donc pas afficher les infos riches saisies dans le wizard.

### 23.4 Synthèse DTOs / validation

| Aspect | État |
|--------|------|
| DTO Zod par endpoint | ✅ 7 schémas |
| Validation strict via ZodValidationPipe | ✅ |
| Couverture champs `TravelFormData` | ❌ ~15% (12/80 champs) |
| `marginConfig` / `costConfig` validés métier | ❌ JSON opaque |
| Double validation (pipe + service) | ⚠️ Risque drift |
| Schemas séparés Phase 1 vs Phase 2 | ❌ Pas de DTOs distincts |

→ **Verdict** : zone **20% MVP-ready**. Les DTOs existent mais sont **sous-dimensionnés**. **MVP critique** : étendre les DTOs pour persister tout le `TravelFormData`.

---

## 24. PERFORMANCE / LAZY-LOADING

### 24.1 Mesure du bundle

**Volume total wizard** :
- Wizard standard (`Etape*` + `assistant/` + page.tsx + types.ts + marginDefaults.ts) : **~32 000 lignes**
- Symphonie : **~40 654 lignes**
- **Total : ~72 654 lignes côté frontend**

### 24.2 Lazy-loading

**Test** : `grep "dynamic\(|lazy\(|Suspense|next/dynamic" nouveau/`

→ **2 fichiers** seulement :
1. `EtapePhotos.tsx` — **deprecated orphelin**, à supprimer
2. `EtapeMedias.tsx` — **seul composant** réellement lazy-loaded

Donc en pratique : **1 seul fichier sur 70k+ lignes utilise un dynamic import**.

❌ **CRITIQUE PERF** :
- Tous les composants `Etape*`, `Symphonie*`, `Assistant*` sont chargés en bundle initial
- Risque : First Contentful Paint dégradé pour le créateur qui ouvre `/pro/voyages/nouveau`
- Hydratation lourde côté React (chaque composant a des `useState`, `useEffect`, `useMemo`)
- Mobile / 3G : expérience probablement très lente

### 24.3 Recommandations

✅ **À faire** (P1) :
- Lazy-load chaque `Etape*` selon l'étape courante du wizard (`React.lazy(() => import('./components/EtapeInfo'))`)
- Lazy-load tout le dossier `symphonie/` (40k lignes) — seulement chargé si l'utilisateur ouvre le tiroir Assistant
- Code-split par phase (Phase 1 vs Phase 2)
- Mesure Lighthouse / Web Vitals avant/après

### 24.4 Synthèse performance

| Aspect | État |
|--------|------|
| Lazy-loading composants | ❌ Quasi inexistant (1 fichier) |
| Code-splitting par étape | ❌ |
| Lazy-load Symphonie | ❌ Tout chargé d'office |
| Mesure Lighthouse / Web Vitals | ❓ Non audité |
| Bundle size estimé | 🔥 Très élevé |

→ **Verdict** : zone **10% MVP-ready**. **Risque UX majeur** sur mobile / connexion lente. À traiter en P1.

---

## 25. TESTS EXISTANTS

### 25.1 Backend

**Dossier** : `backend/test/` (e2e) + `*.spec.ts` colocalisés (unit)

✅ **BON** :
- E2E nombreux : `admin.e2e-spec.ts`, `auth.e2e-spec.ts`, `booking.e2e-spec.ts`, `bus-stops.e2e-spec.ts`, `cancellation.e2e-spec.ts`, `cancellation-comprehensive.e2e-spec.ts`, `checkout.e2e-spec.ts`, `client.e2e-spec.ts`, `admin-checkout.e2e-spec.ts`, `admin-documents.e2e-spec.ts` (10+ vu)
- Unit pro-travels : `pro-travels.controller.spec.ts:524 lignes`, `pro-travels.service.spec.ts:1151 lignes`
- CLAUDE.md mentionne **3 300+ tests passants** côté backend
- `quality-gate.service.spec.ts` existe

⚠️ **À VÉRIFIER** :
- Coverage % réel
- E2E pour le workflow complet (DRAFT → PUBLISHED) ?

### 25.2 Frontend

**Dossier** : `frontend/__tests__/`, `frontend/components/**/__tests__/`

❌ **CRITIQUE** :
- `grep "EtapeInfo|EtapePricing|TravelFormData|nouveau" frontend/**/*.test.tsx` → **6 fichiers** mais **AUCUN dans le wizard** :
  - `frontend/__tests__/auth/forgot-password.test.tsx`
  - `frontend/__tests__/pro/dashboard.test.tsx`
  - `frontend/components/pro/__tests__/pro-empty-state.test.tsx`
  - `frontend/components/ui/__tests__/input.test.tsx`
  - `frontend/components/ui/__tests__/tabs.test.tsx`
  - `frontend/hooks/__tests__/use-toast.test.tsx`
- **Aucun test unit pour les 20 composants `Etape*`**
- **Aucun test unit pour les 80 composants `symphonie/`**
- **Aucun test pour les 7 composants `assistant/`**
- **Aucun test e2e Playwright/Cypress** détecté pour le wizard de création

→ **70k+ lignes frontend du wizard sans 1 seul test**.

### 25.3 Synthèse tests

| Aspect | État |
|--------|------|
| Tests backend pro-travels | ✅ Solides (1675 lignes spec) |
| E2E backend module booking/cancellation/checkout | ✅ Présents |
| Tests frontend wizard standard (Etape*) | ❌ **0 test** |
| Tests frontend Symphonie | ❌ **0 test** |
| Tests E2E création voyage end-to-end | ❌ |
| Couverture totale frontend wizard | 🔥 **0%** |

→ **Verdict** : zone **45% MVP-ready** (backend 90%, frontend 0%). **Risque régression critique** au moindre refactor frontend.

---

## 26. SEO FICHE PUBLIQUE VOYAGE

### 26.1 generateMetadata

**Fichier** : `frontend/app/(public)/voyages/[slug]/layout.tsx:52-64`

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const seo = VOYAGE_SEO[decodedSlug];
  // ...
}
```

⚠️ **MAUVAIS** :
- Source SEO = `VOYAGE_SEO[decodedSlug]` → **objet hardcodé** par slug
- Si voyage publié n'est pas dans `VOYAGE_SEO`, fallback sur titre slug-ifié (l.61-64)
- → SEO **non dynamique** depuis la DB du voyage publié

❌ **MISSING** :
- Pas de `generateMetadata()` qui lit depuis le backend (titre, description, photo, prix, dates) du voyage
- Pas de JSON-LD `Schema.org/TravelOffer` ou `TouristTrip` pour Google rich snippets
- `opengraph-image.tsx` existe (l. dossier) → bon point pour OpenGraph, à valider qu'il génère depuis vrai voyage

### 26.2 Symphonie SEO

**Composant** : `SymphonieFichePropagator.tsx` (vu en grep symphonie)
**Phase** : "Phase 4 (PROPAGATE) : SEO+JSON-LD" mentionnée dans SymphonieMaster header

✅ **BON** :
- Module Symphonie dédié SEO+JSON-LD existe en frontend

❌ **MISSING** :
- Comme tout Symphonie, **localStorage uniquement** → ne touche pas la fiche publique réelle
- Le SEO réel sur `(public)/voyages/[slug]` ne lit pas le travail de `SymphonieFichePropagator`

### 26.3 Synthèse SEO

| Aspect | État |
|--------|------|
| `generateMetadata` sur fiche publique | ⚠️ Existe mais hardcodé `VOYAGE_SEO` |
| OpenGraph image dynamique | ✅ `opengraph-image.tsx` présent |
| JSON-LD Schema.org/TouristTrip | ❌ Non vu |
| Sitemap dynamique des voyages | ❓ À vérifier |
| robots.txt | ❓ À vérifier |
| Symphonie SEO branchée à fiche publique | ❌ Travail créateur perdu |

→ **Verdict** : zone **30% MVP-ready**. Base existe, mais le travail SEO du créateur en Symphonie ne se propage pas à la fiche publique.

---

## 27. ONBOARDING CRÉATEUR

### 27.1 Composants Symphonie dédiés

**Fichiers** :
- `SymphonieFirstSteps.tsx` (Phase 22) — 8 étapes interactives, dédié XP < 50, voyagesCreated ≤ 1
  - Welcome hero + progression visuelle
  - Bouton "Charger le voyage type" (pré-remplit Marrakech 4j)
  - Bouton "Demander un parrain mentor" (auto-match niveau 5+)
  - Statut mentor assigné
  - Bouton "Plus tard" pour skip
- `SymphonieOnboardingTour.tsx` (Phase 11) — Tour guidé end-to-end 5 étapes
  - 1. Démarrer (titre, dates, destination)
  - 2. Composer (programme, HRA, activités)
  - 3. Soumettre à Eventy (validation)
  - 4. Bracelets auto-commandés
  - 5. Embarquement (clans + NFC)

✅ **BON** :
- 2 onboardings complémentaires (débutant + tour général)
- Logique XP (déclenche FirstSteps si débutant)
- Templates pré-remplis (voyage type Marrakech 4j)
- Mentorship intégré

❌ **CRITIQUE** :
- Comme tout Symphonie : **branché uniquement via le tiroir flottant Assistant**
- Si le créateur n'ouvre jamais le tiroir → il ne voit JAMAIS l'onboarding
- Aucun **trigger automatique** au premier login créateur visible
- État onboarding (terminé / skipped) en localStorage → si change device, on lui refait l'onboarding

### 27.2 Pas d'onboarding "natif" wizard

**Fichier** : `nouveau/page.tsx`

❌ **MISSING** :
- Pas de modal "Bienvenue dans le wizard ! Voici comment ça marche" au premier accès
- Pas de tooltip onboarding sur les premières étapes
- Pas de banner "Charger un template" en gros sur EtapeInfo

### 27.3 Synthèse onboarding

| Aspect | État |
|--------|------|
| Composants onboarding | ✅ 2 modules Symphonie complets |
| Trigger automatique premier login | ❌ Pas vu |
| Tooltips contextuels wizard standard | ❌ |
| Templates pré-remplis | ✅ "Voyage type Marrakech 4j" via FirstSteps |
| Mentorship | ✅ Auto-match niveau 5+ via FirstSteps |
| Persistance état onboarding | ❌ localStorage seul |

→ **Verdict** : zone **35% MVP-ready**. Bon contenu, mauvaise visibilité.

---

## 28. NOUVEAUX TODOs PRIORITAIRES (issus addendum 3)

### 🔴 P0 — BLOQUANT MVP

| # | Tâche | Fichier(s) | Effort |
|---|-------|-----------|--------|
| P0.24 | **Étendre `CreateTravelDtoSchema`** pour persister tous les champs critiques du `TravelFormData` (depositPercent, cancellationPolicy, voyageCount, voyageConfigs, weeklyMealPlan, publishedPensionType, securitySheet, marketingConfig, selectedHotelId, ...) | `dto/create-travel.dto.ts`, schema.prisma migration | XL (5j) |
| P0.25 | **Lazy-load Symphonie** : tout le dossier `symphonie/` chargé seulement à l'ouverture du tiroir Assistant | `VoyageFlowAssistant.tsx`, dynamic imports | M (2j) |
| P0.26 | **Lazy-load chaque `Etape*`** selon l'étape courante du wizard | `page.tsx`, dynamic imports | M (2j) |
| P0.27 | **Tests E2E Playwright** du workflow complet création voyage (DRAFT → PUBLISHED) | nouveau dossier `tests/e2e/` | L (3j) |
| P0.28 | **Trigger automatique de l'onboarding** au premier accès du créateur à `/pro/voyages/nouveau` | `page.tsx`, hook `useFirstVisit` | S (1j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.25 | Tests unit critiques pour les 5 `Etape*` les plus complexes (EtapeBusSurPlace, EtapeOccurrences, EtapePricing, EtapeInfo, EtapeBusStops) | L (3j) |
| P1.26 | Magic-link invitation team (créer compte Eventy si pas existant) | M (2j) |
| P1.27 | Auditer la cohérence des 2 schémas Zod backend (controller pipe + service `CreateTravelSchema.parse`) | S (0.5j) |
| P1.28 | RBAC fin par action : `@Roles('ADMIN')` pour cancel/publish irréversible | S (1j) |
| P1.29 | Brancher `SymphonieFichePropagator` à la vraie fiche publique `(public)/voyages/[slug]/` | M (2j) |
| P1.30 | JSON-LD Schema.org/TouristTrip sur fiche publique pour rich snippets Google | S (1j) |
| P1.31 | Mesure Lighthouse / Web Vitals + budget perf défini | S (1j) |
| P1.32 | Coverage tests minimum 50% sur le wizard frontend | L (5j+) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.21 | Dashboard admin "tests coverage par module" | M (1.5j) |
| P2.22 | Sitemap dynamique des voyages publiés | S (0.5j) |
| P2.23 | Tooltips contextuels sur tous les `Etape*` (hover/focus) | M (2j) |
| P2.24 | Consolider les 7 DTOs en un module `dto/v2/` avec validation métier | M (2j) |
| P2.25 | Audit security-review complet via `/security-review` | M (2j) |

### 📊 Mise à jour tableau récap MVP global

| Bloc | Avant addendum 3 | Après audit complémentaire |
|------|------------------|----------------------------|
| Backend pro-travels | partiellement audité | **65% MVP** |
| Sécurité / RBAC | partiellement | **75% MVP** |
| DTOs / validation backend | partiellement | **20% MVP** ❌ critique |
| Performance / lazy-loading | non audité | **10% MVP** 🔥 |
| Tests frontend wizard | non audité | **0%** 🔥 |
| Tests backend | partiellement | **90% MVP** ✅ |
| SEO fiche publique | partiellement | **30% MVP** |
| Onboarding créateur | non audité | **35% MVP** |

**Total ajouté à la roadmap addendum 3** : ~13 jours dev (P0.24-28) + ~16 jours (P1.25-32) + ~8 jours (P2.21-25).

**Roadmap globale cumulée (4 sessions audit)** :
- P0 total : **~80 jours** (P0.1-28)
- P1 total : **~57 jours** (P1.1-32)
- P2 total : **~67 jours** (P2.1-25)
- → ≈ **204 jours dev solo** / **≈ 102 jours en parallèle (2-3 devs)** pour 100% MVP

---

## 29. RÉFÉRENCES ADDENDUM 3

- `backend/src/modules/pro/travels/pro-travels.controller.ts:1-912` (22 endpoints, 64-65 guards globaux)
- `backend/src/modules/pro/travels/pro-travels.service.ts:103-141` (createTravel ne persiste que 11 champs)
- `backend/src/modules/pro/travels/dto/create-travel.dto.ts:1-37` (CreateTravelDtoSchema)
- `backend/src/modules/pro/travels/dto/update-travel.dto.ts:1-11` (UpdateTravelDtoSchema = .partial())
- `backend/src/modules/pro/travels/pro-travels.controller.spec.ts:524 lignes`
- `backend/src/modules/pro/travels/pro-travels.service.spec.ts:1151 lignes`
- `backend/src/common/guards/roles.guard.ts:1-30`
- `backend/src/common/decorators/roles.decorator.ts`
- `frontend/app/(public)/voyages/[slug]/layout.tsx:52-64` (generateMetadata avec VOYAGE_SEO hardcodé)
- `frontend/app/(public)/voyages/[slug]/opengraph-image.tsx`
- `frontend/app/(pro)/pro/voyages/nouveau/components/symphonie/SymphonieFirstSteps.tsx` (Phase 22 onboarding débutant)
- `frontend/app/(pro)/pro/voyages/nouveau/components/symphonie/SymphonieOnboardingTour.tsx` (Phase 11 tour 5 étapes)
- `frontend/app/(pro)/pro/voyages/nouveau/components/symphonie/SymphonieFichePropagator.tsx` (SEO+JSON-LD localStorage)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Découverte clé addendum 3** : la persistance backend du voyage est **massivement sous-dimensionnée** — sur ~80 champs métier du `TravelFormData` frontend, seuls **~12 sont stockés** en base. Le créateur passe potentiellement plusieurs heures dans le wizard, mais 85% de son travail vit en localStorage Symphonie (donc volatile).

**Top 3 P0 cumulés sur 4 sessions** (priorité absolue) :
1. **P0.24** (étendre `CreateTravelDtoSchema` à tous les champs) — sans ça, tout le wizard est cosmétique
2. **P0.18** (brancher SymphonieValidationWorkflow → backend) — débloque la chaîne validation
3. **P0.19** (notifications HRA réelles) — sauve l'âme Eventy partenaires

**Risque légal cumulé** :
- P0.10 (refund auto NO_GO) — clients non remboursés
- P0.11 (lecture `cancellationPolicy` créateur) — barème ignoré
- P0.12 (Pack Sérénité override) — promesse CGV non tenue
- P0.16 (cession billet L.211-11) — obligation Code du tourisme

---

# 🔄 ADDENDUM 4 — Audit infrastructure transverse 2026-04-30 (sessions 5)

> Audit des couches transverses critiques pour MVP :
> 30. Module email + templates + outbox (Brevo)
> 31. NotificationsGateway WebSocket
> 32. Portail HRA Maisons (vue partenaire)
> 33. Page édition voyage `[id]/edit/page.tsx`
> 34. Workflow admin review (approuver / rejeter Phase 1 / Phase 2)
> 35. Module documents (upload, signature)
>
> **Aucune ligne de code modifiée.**

---

## 30. MODULE EMAIL + TEMPLATES + OUTBOX

### 30.1 Architecture

**Fichiers** :
- `backend/src/modules/email/email.service.ts:795 lignes` — service principal (queue + send)
- `backend/src/modules/email/email-templates.service.ts:1654 lignes` — registre 34 templates
- `backend/src/modules/email/email.module.ts:25 lignes`
- Tests : 1334 + 440 lignes spec

✅ **EXCELLENT** :
- Provider : **Brevo** (Sendinblue) via `BREVO_API_URL` (l.33)
- Pattern **Outbox** : tous les emails passent par `prisma.emailOutbox` (l.104) — résilient aux pannes Brevo
- `queueEmail(to, subject, templateId, variables, idempotencyKey?)` (l.64)
- **Idempotency** : dédup par `to + templateId + subject` (l.87-101)
- **Sécurité** :
  - Validation email RFC 5322 + anti `\n\r` (l.130-133, anti email-injection)
  - `sanitizeForEmailHeader()`, `sanitizeForEmailTemplate()` (l.79-85)
  - `escapeHtml()` sur toutes les variables utilisateur (templates l.82-90)
  - **Mask email dans logs** (RGPD, l.117 `maskEmail()`)
- **Retry mécanism** : `stuckReset` + `claimResult` + `retryCount` (l.174, 213, 224)
- **Statut** : `OutboxStatus.PENDING` → claimed → succeeded/failed

### 30.2 Catalogue des **34 templates** existants

**Fichier** : `email-templates.service.ts:32-67` (`registerTemplates()`)

| Catégorie | Templates |
|-----------|-----------|
| **Auth** (4) | welcome, email-verification, password-reset, password-changed |
| **Booking** (3) | booking-confirmation, booking-reminder, booking-canceled |
| **Cart / abandonment** (1) | abandoned-cart |
| **Paiements** (5) | payment-received, payment-invite, payment-reminder, payment-failed, payment-refunded |
| **Hold** (1) | hold-expiring |
| **Pro / créateur** (3) | pro-welcome, pro-approved, pro-rejected |
| **Documents** (2) | document-reminder, document-ready |
| **Support** (2) | support-ticket-created, support-ticket-resolved |
| **Voyage** (2) | travel-published, voyage-no-go |
| **Admin** (3) | admin-dispute-alert, admin-monitoring-alert, admin-daily-report |
| **Départure reminders** (5) | departure-reminder-j30, j15, j7, j3, j1 |
| **Post-voyage** (2) | review-request, credit-issued |
| **Comptable** (1) | comptable-monthly-export |

### 30.3 ❌ Templates manquants pour le flow création voyage

| Manque | Impact | Priorité |
|--------|--------|----------|
| `hra-included-in-trip` | HRA inclus dans voyage en préparation (cœur du flow âme Eventy) | P0 |
| `hra-availability-request` | Demande dispo HRA auto-générée par SymphonieHRACommunication | P0 |
| `hra-confirmation` | HRA confirme participation au voyage | P0 |
| `team-invite-magic-link` | Magic link pour inviter membres équipe sans compte préexistant | P0 |
| `phase1-approved` / `phase2-approved` | Confirmation admin a validé la phase | P0 |
| `phase1-changes-requested` / `phase2-changes-requested` | Admin demande corrections au créateur | P0 |
| `essential-change-consent` | Consentement client modif essentielle (Art. L.211-13) | P0 légal |
| `voyage-modified-minor` | Notification client modif mineure | P1 |
| `ticket-transfer-request` / `ticket-transfer-accepted` | Cession billet (L.211-11) | P0 légal |
| `manifest-j7` | Manifeste J-7 envoyé HRA + équipe | P1 |

→ Sur **34 templates existants**, **10 critiques manquent** spécifiquement pour le wizard de création.

### 30.4 Synthèse email

| Aspect | État |
|--------|------|
| Provider | ✅ Brevo (Sendinblue) |
| Pattern Outbox + idempotency | ✅ Robuste |
| Sécurité (RFC, sanitize, escapeHtml, maskEmail RGPD) | ✅ Excellent |
| Retry / claim / status | ✅ |
| Tests | ✅ 1334 lignes spec templates + 440 service |
| Catalogue templates | ✅ 34 templates riches |
| **Templates pour wizard création** | ❌ **10 manquants** |

→ **Verdict** : zone **70% MVP-ready** pour la base, mais **30% pour le wizard création**. Infrastructure prête, contenu à compléter.

---

## 31. NOTIFICATIONS GATEWAY WEBSOCKET

### 31.1 Architecture

**Fichiers** :
- `notifications.gateway.ts:284 lignes` — Socket.IO + JWT
- `notifications.service.ts:456 lignes`
- `notification-events.service.ts:446 lignes` — événements métier
- `notification-dispatcher.service.ts` (dispatcher)
- `notification-digest.service.ts` (digest)
- `notifications.controller.ts:204 lignes`
- Tests : 502 (gateway) + 553 (service) + 935 (controller) + 254 (events) lignes spec

✅ **EXCELLENT** :
- WebSocket Socket.IO sur namespace `/notifications` (l.46)
- **JWT auth** sur connect (`JWT_ACCESS_SECRET`, l.61)
- **Fail-fast** : throw au démarrage si secret manquant (l.62-64)
- `userConnections` Map<userId, Set<socketIds>> → multi-device support
- **CORS validation** dynamique : `validateFrontendUrl()` valide protocole http/https + fallback prod/dev (l.73-90)
- Logs sécurité : warn si protocole invalide

### 31.2 Événements métier déjà câblés

**Fichier** : `notification-events.service.ts`

| Méthode | Ligne | Cas d'usage |
|---------|-------|-------------|
| `notifyNewFollower` | 43 | ✅ Social |
| `notifyTeamInvite` | 78 | ✅ Cf. P0.20 partiellement résolu (utilisé dans `pro-travels.controller.ts:564`) |
| `notifyTeamRemoval` | 111 | ✅ |
| `notifyBookingStatusChange` | 146 | ✅ |
| `notifyBookingConfirmed` | 182 | ✅ |
| `notifyPaymentReceived` | 219 | ✅ |
| `notifyProPaymentReceived` | 253 | ✅ |
| `notifyTravelStatusChange` | 294 | ✅ Backend bouge → notif Pro |
| `notifyDocumentStatusChange` | 333 | ✅ |
| `notifyTicketReply` | 374 | ✅ Support |

### 31.3 ❌ Événements manquants pour le flow création voyage

| Manque | Impact | Priorité |
|--------|--------|----------|
| `notifyHraIncluded(voyageId, hraPartnerId)` | Notif HRA quand inclus dans voyage en prépa | **P0** |
| `notifyHraConfirmed(...)` | HRA accepte la mission | P0 |
| `notifyEssentialChange(travelId, change)` | Modif essentielle voyage publié → consentement client | **P0 légal** |
| `notifyTravelersOfChange(travelId, type)` | Notif clients réservés (modif mineure ou essentielle) | P0 légal |
| `notifyTicketTransferRequest(roomBookingId)` | Demande cession billet (L.211-11) | **P0 légal** |
| `notifyPhase1Approved` / `notifyPhase1ChangesRequested` | Workflow admin review | P0 |
| `notifyPhase2Approved` / `notifyPhase2ChangesRequested` | Idem | P0 |
| `notifyBalanceDue` | Relance solde (J-30/J-7) | P1 |
| `notifyManifestJ7Ready` | Manifeste J-7 prêt | P1 |

### 31.4 Synthèse notifications

| Aspect | État |
|--------|------|
| Gateway WebSocket Socket.IO | ✅ Production-ready |
| JWT auth + fail-fast secret | ✅ |
| CORS validation dynamique | ✅ |
| Multi-device (userConnections Map) | ✅ |
| Tests gateway / service / events | ✅ 2244 lignes spec |
| Événements existants | ✅ 10 événements |
| Couverture flow création voyage | ❌ ~9 événements critiques manquent |
| Dispatcher + Digest services | ✅ |

→ **Verdict** : zone **75% MVP-ready** pour l'infra, **30% pour le wizard création**. Squelette excellent, contenu à compléter.

---

## 32. PORTAIL HRA MAISONS (vue partenaire)

### 32.1 Volume

**Dossier** : `frontend/app/(maisons)/maisons/`

- **40+ pages** (selon `find page.tsx` × profondeur)
- Total : **16 715 lignes** de pages `page.tsx` agrégées
- Sous-dossiers métiers : activités (planning, matériel), analytics, bracelets, championnats (création, import, [id]), clients, comptage, configuration, connexion-pro, coordination, créations, dashboard, décoration, documents, énergie, équipe, établissement, finance, gamification, hébergement, image-souvenirs, inscription, notifications, paiements, partager, réservations, restauration, revenus, rooming, sécurité, services, support, transport, vendre-3min, vente-catalogue

### 32.2 ⚠️ 6 pages "vides" (2 lignes seulement) — squelette pas implémenté

```
documents/page.tsx           → 2 lignes (titre seul)
etablissement/page.tsx        → 2 lignes
reservations/page.tsx         → 2 lignes ❌ critique flow voyage
revenus/page.tsx              → 2 lignes
services/page.tsx             → 2 lignes
support/page.tsx              → 2 lignes
```

**🔥 `reservations/page.tsx` est VIDE** alors que c'est la page **principale** où le HRA devrait voir tous les voyages où sa maison est incluse.

→ Le détail `reservations/[id]/page.tsx` fait **588 lignes** : la page existe mais inaccessible depuis une liste !

### 32.3 Dashboard HRA — design présent, données mock

**Fichier** : `frontend/app/(maisons)/maisons/dashboard/page.tsx:50-60`

```ts
// Mock data
{ voyage: 'Algarve Farniente Weekend', createur: 'Hélène Dupont', checkIn: '27 avr', pax: 28, nuits: 5, statut: 'EN_PREPARATION', progress: 75 },
{ voyage: 'Porto & Algarve Prestige', createur: 'Marc Fontaine', checkIn: '3 mai', pax: 22, nuits: 4, statut: 'ACCEPTEE', progress: 40 },
```

✅ **BON** :
- Statuts métier cohérents : `EN_PREPARATION`, `ACCEPTEE`, `EN_ATTENTE`
- Progress % par voyage
- Liste des arrivées prochaines (créateur, pax, nuits, accompagnateur)
- Mention Stripe Connect : *"Versements Stripe Connect · Après commission Eventy 18%"* (l.182)

❌ **MAUVAIS** :
- Toutes les données sont **hardcodées** dans le fichier (l.50-60)
- Aucun appel API : `grep "apiClient\|fetch" maisons/dashboard/` → 0
- Aucun lien avec backend `Travel`, `BookingGroup`, `HotelBlock`

### 32.4 Pages critiques pour MVP — état réel

| Page HRA | Lignes | État réel |
|----------|--------|-----------|
| `dashboard/` | ~ | ✅ Design riche, ❌ mock data |
| `reservations/` (liste) | 2 | ❌ **Vide** |
| `reservations/[id]/` (détail) | 588 | ✅ Existe mais orphelin |
| `notifications/` | ? | À auditer |
| `paiements/` | 646 | ✅ Existe |
| `revenus/` | 2 | ❌ Vide |
| `documents/` | 2 | ❌ Vide |
| `etablissement/` | 2 | ❌ Vide (config maison !) |
| `coordination/` | ? | À auditer |
| `equipe/` | ? | À auditer |

### 32.5 Synthèse portail HRA

| Aspect | État |
|--------|------|
| Volume code total | ⚠️ 16 715 lignes |
| Architecture portail dédié | ✅ Existe |
| Dashboard maison | ⚠️ Design OK, données mock |
| Page liste réservations (entrée principale) | ❌ **VIDE — 2 lignes** |
| Page détail réservation | ✅ 588 lignes existent |
| 6 pages critiques squelette vide | ❌ |
| Branchement backend (HotelBlock, BookingGroup) | ❌ Aucun |
| Notification HRA inclus dans voyage | ❌ Pas branché |
| Workflow accept/refuse | ❌ |

→ **Verdict** : zone **25% MVP-ready**. Architecture du portail solide, mais **les pages clés sont vides ou mockées**. Le HRA partenaire **ne peut rien voir** des vrais voyages où sa maison est incluse.

---

## 33. PAGE ÉDITION VOYAGE `/pro/voyages/[id]/edit/page.tsx`

### 33.1 Architecture

**Fichier** : `frontend/app/(pro)/pro/voyages/[id]/edit/page.tsx:553 lignes`

✅ **BON** :
- Réutilise les composants du wizard `nouveau/components/Etape*` (DRY OK)
- Header explicite : *"Plus de duplication : on importe les mêmes composants que le wizard de création"* (l.10-11)

### 33.2 ❌ CRITIQUE — Seulement 7 étapes sur 17

**Imports détectés** :
```ts
import EtapeInfo from '../../nouveau/components/EtapeInfo';
import EtapeAccommodation from '../../nouveau/components/EtapeAccommodation';
import EtapeProgram from '../../nouveau/components/EtapeProgram';
import EtapePhotos from '../../nouveau/components/EtapePhotos';   // ⚠️ DEPRECATED
import EtapeBusStops from '../../nouveau/components/EtapeBusStops';
import EtapePricing from '../../nouveau/components/EtapePricing';
import EtapeSummary from '../../nouveau/components/EtapeSummary';
```

**WIZARD_STEPS** (l.22-30) :
1. Informations
2. Hébergement
3. Programme
4. Photos
5. Transport
6. Tarification
7. Récapitulatif

❌ **MANQUES par rapport au wizard de création** (10 étapes absentes !) :
- `EtapeMedias` (✅ vrai composant 1137 lignes) — **remplacé à tort par EtapePhotos deprecated** (121 lignes orphelines)
- `EtapeBusSurPlace` (2549 lignes — bus sur place destination)
- `EtapeOccurrences` (1851 lignes — départs multi-dates)
- `EtapeActivites` (1029 lignes)
- `EtapeRestoration` (1844 lignes)
- `EtapeMarketingVoyage` (607 lignes)
- `EtapeFournisseurs` (957 lignes — devis transport)
- `EtapeEquipe` (815 lignes)
- `EtapeSecurite` (921 lignes)
- `EtapePartition` (2282 lignes — timeline DAW)

→ **Conséquences** :
1. 🔥 Si créateur veut modifier ses HRA restaurants/activités, son équipe terrain, sa fiche sécurité → **impossible** depuis `/edit`
2. 🔥 Le composant `EtapePhotos` deprecated est utilisé alors qu'il est vide — l'édition photos ne fonctionne pas
3. 🔥 La symétrie création/édition est cassée : le créateur peut renseigner 17 sections à la création mais n'en éditer que 6

### 33.3 Synthèse édition

| Aspect | État |
|--------|------|
| Architecture (réutilisation composants) | ✅ |
| Volume | ✅ 553 lignes |
| Couverture étapes | ❌ **7/17** |
| `EtapePhotos` deprecated utilisé | ❌ Bug |
| Restriction édition selon statut | ❌ (cf. addendum 1 §11.3) |
| `EMPTY_FORM_DATA` en dur | ⚠️ |

→ **Verdict** : zone **35% MVP-ready**. Page existe mais sous-couvre la création. **P0** : aligner.

---

## 34. WORKFLOW ADMIN REVIEW (Phase 1 / Phase 2)

### 34.1 Endpoints

**Fichier** : `backend/src/modules/admin/admin.controller.ts`

✅ **BON — Endpoints présents** :
- `GET /admin/travels` (l.265) — liste tous voyages
- `GET /admin/travels/pending` (l.301) — voyages en attente
- `POST /admin/travels/:id/approve-p1` (l.313) — approuve Phase 1
- `POST /admin/travels/:id/approve-p2` (l.330) — approuve Phase 2
- `POST /admin/travels/:id/reject` (l.347) — rejette voyage avec `RejectReasonDto`
- `PATCH /admin/travels/:id` (l.1789) — édit admin
- `PATCH /admin/travels/:id/status` (l.1829) — change statut admin
- `POST /admin/travels` (l.1897) — création admin

✅ **RBAC fin** :
- `@AdminRoles(AdminRole.OPS_VOYAGE_ADMIN)` (l.314, 331, 348) — rôle dédié
- Différent du wizard standard (`@Roles('PRO', 'ADMIN')`) → segmentation cohérente
- `@RateLimit(RateLimitProfile.ADMIN)` partout

### 34.2 ❌ Manques

| Manque | Impact |
|--------|--------|
| **Notification créateur** quand approve-p1 / approve-p2 | Créateur ne sait pas que sa phase est validée → check manuel |
| **Notification créateur** quand reject | Créateur ne sait pas, recommence |
| Statut `CHANGES_REQUESTED` après reject (avec `dto.reason`) — à vérifier que ça remet en édition | Workflow incomplet |
| Frontend admin pour valider/rejeter | Pas vu dans l'audit (à creuser) |
| Endpoint `request-changes` distinct de `reject` | Granularité fine manquante |
| Re-soumission après changes-requested | Workflow utilisateur peu clair |
| Audit trail des décisions admin | Cherche `AuditLog` → présent mais pas vérifié dans ce flow |

### 34.3 Synthèse admin review

| Aspect | État |
|--------|------|
| Endpoints approve-p1 / approve-p2 / reject | ✅ Existent |
| RBAC `OPS_VOYAGE_ADMIN` | ✅ Dédié |
| Rate-limit ADMIN profile | ✅ |
| Notification créateur post-décision | ❌ |
| `request-changes` distinct de `reject` | ❌ |
| Frontend admin validateur | ❓ À auditer |
| Tests e2e workflow complet | ❓ |

→ **Verdict** : zone **55% MVP-ready**. Backend prêt, notifications créateur + frontend admin manquants.

---

## 35. MODULE DOCUMENTS (upload, signature)

### 35.1 Architecture

**Dossier** : `backend/src/modules/documents/`

- `documents.controller.ts:200 lignes` — 8 endpoints
- `documents.service.ts:546 lignes`
- `legal-travel-documents.service.ts:235 lignes` — **STUBS** (cf. addendum 1 §9.7)
- `pdf-generator.service.ts:346 lignes`
- Tests : 1486 + 989 lignes spec

✅ **BON — Endpoints** :
- `GET /documents/pro` (l.68) — liste docs pro
- `POST /documents/pro/upload` (l.78) — upload pro
- `GET /documents/client` (l.117) — docs client
- `GET /documents/:id/download` (l.126) — télécharger
- `DELETE /documents/:id` (l.145)
- `POST /documents/:id/sign` (l.161) — **signature électronique**
- `GET /documents/:id/signature` (l.179) — preuve signature
- `GET /documents/:id/signature-history` (l.190)

### 35.2 Types de documents

**Schéma Prisma** : `enum DocumentType` (l.770-777)
```
CONTRAT
PIECE_IDENTITE
KBIS
CONFIRMATION_RESERVATION
FACTURE
DOCUMENT_VOYAGE
```

**Statuts** : `PENDING`, `CONFIRMED`, `REJECTED`

**Templates contrats** : `enum ContractTemplateType` (l.785-792)
```
PRESTATAIRE_INDEPENDANT
DECLARATION_NON_SALARIAT
CHARTE_PRESTATAIRE
VENDEUR_INDEPENDANT
RGPD_STATUS
IMAGE_RIGHTS
```

### 35.3 ❌ Types manquants pour le wizard création voyage

| Type manquant | Impact |
|---------------|--------|
| `ROOMING_LIST` | Liste chambres + occupants envoyée à HRA hôtel |
| `ALLERGIES_LIST` | Allergies/régimes envoyés à HRA restaurant |
| `BRIEFING_DRIVER` | Briefing chauffeur (consignes, pauses, urgences) |
| `BRIEFING_GUIDE` | Briefing guide/animateur |
| `MANIFEST_J7` | Manifeste J-7 (passagers, médical, urgences) |
| `FICHE_PRECONTRACTUELLE_UE` | Obligation **directive UE 2015/2302** (Art. L.211-8) |
| `CONTRAT_VOYAGE` | Contrat voyage Art. L.211-9 |
| `ATTESTATION_ASSURANCE` | Attestation Pack Sérénité Allianz |

### 35.4 LegalTravelDocumentsService — STUBS

**Fichier** : `backend/src/modules/documents/legal-travel-documents.service.ts:235 lignes`

> Header : *"STATUT : STUBS — Ces méthodes retournent des templates vides à implémenter."*

✅ **STRUCTURES définies** :
- `FichePrecontractuelleData` (interface complète, 27 champs)
- `ContratVoyageData` (booking, taxes, conditions)
- `AttestationAssuranceData` (couverture, garanties)
- `FactureTvaDetailData` (prestations, taxes)

❌ **AUCUNE LOGIQUE** :
- Méthodes vides
- Aucune génération PDF
- Aucun stockage en S3 / blob
- Aucun lien avec PdfGeneratorService

### 35.5 Synthèse documents

| Aspect | État |
|--------|------|
| Module documents | ✅ Solide (200+546+346 = 1092 lignes) |
| Upload / download | ✅ |
| Signature électronique | ✅ Présente avec history |
| PDF generator | ✅ |
| Tests | ✅ 1486 + 989 lignes spec |
| Types pour création voyage | ❌ 8 types manquants |
| Documents légaux UE 2015/2302 | ❌ STUBS uniquement |
| Branchement avec voyage en préparation | ❌ Pas vu |

→ **Verdict** : zone **45% MVP-ready** pour la base, **0%** pour les documents légaux obligatoires (UE 2015/2302). **P0 légal** : implémenter les 4 documents `LegalTravelDocumentsService`.

---

## 36. NOUVEAUX TODOs PRIORITAIRES (issus addendum 4)

### 🔴 P0 — BLOQUANT MVP / RISQUE LÉGAL

| # | Tâche | Effort |
|---|-------|--------|
| P0.29 | **Implémenter les 4 documents légaux UE 2015/2302** dans `LegalTravelDocumentsService` (Fiche précontractuelle L.211-8, Contrat voyage L.211-9, Attestation assurance, Facture TVA marge) | XL (5-7j) |
| P0.30 | **Créer 10 templates email manquants** : hra-included-in-trip, hra-availability-request, hra-confirmation, team-invite-magic-link, phase1-approved/changes-requested, phase2-approved/changes-requested, essential-change-consent, ticket-transfer-request | L (3j) |
| P0.31 | **Créer 9 événements `notification-events` manquants** : notifyHraIncluded, notifyHraConfirmed, notifyEssentialChange, notifyTravelersOfChange, notifyTicketTransferRequest, notifyPhase1Approved/ChangesRequested, notifyPhase2Approved/ChangesRequested | M (2j) |
| P0.32 | **Implémenter `reservations/page.tsx` HRA** (page liste vide actuellement — entrée principale du portail !) | M (2j) |
| P0.33 | **Aligner page édition `[id]/edit/page.tsx`** avec le wizard standard : importer les 17 étapes (pas 7), retirer EtapePhotos deprecated, utiliser EtapeMedias | M (2j) |
| P0.34 | **Notification créateur post-décision admin** : approve-p1/p2 + reject doivent déclencher email + WebSocket | S (1j) |
| P0.35 | **Brancher dashboard HRA aux vraies données backend** (HotelBlock, RestaurantPartner, Travel) au lieu du mock | M (2j) |
| P0.36 | **5 pages HRA squelettes** (etablissement, services, revenus, documents, support) à implémenter | L (3j) |
| P0.37 | **Ajouter 8 types de documents** dans `enum DocumentType` (ROOMING_LIST, ALLERGIES_LIST, BRIEFING_DRIVER/GUIDE, MANIFEST_J7, FICHE_PRECONTRACTUELLE_UE, CONTRAT_VOYAGE, ATTESTATION_ASSURANCE) + migration Prisma | M (1.5j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.33 | Endpoint `request-changes` distinct de `reject` (granularité fine) | S (1j) |
| P1.34 | Frontend admin validateur Phase 1 / Phase 2 (UI dédiée) | L (3j) |
| P1.35 | Tests E2E workflow complet admin review | M (2j) |
| P1.36 | Génération auto manifeste J-7 (PDF + envoi HRA + équipe) | M (2j) |
| P1.37 | Auto-création thread messagerie créateur ↔ HRA quand HRA inclus | M (1.5j) |
| P1.38 | Workflow accept/refuse HRA exposé au partenaire dans portail Maisons | L (3j) |
| P1.39 | Audit a11y (ARIA labels, navigation clavier) sur les 17 Etape* + portail HRA | M (2j) |
| P1.40 | Templates departure-reminder branchés à un cron J-30/J-15/J-7/J-3/J-1 | M (1.5j) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.26 | Notification digest hebdo HRA (résumé voyages à venir) | M (1.5j) |
| P2.27 | Mobile push notifications (Capacitor / FCM) en complément WebSocket | L (3j) |
| P2.28 | Templates email i18n (anglais, espagnol, portugais) | L (3j) |

### 📊 Mise à jour tableau récap MVP global

| Bloc | Avant addendum 4 | Après audit complémentaire |
|------|------------------|----------------------------|
| Module email + outbox | non audité | **70% MVP** infra / **30%** templates flow création |
| NotificationsGateway | partiellement | **75% MVP** infra / **30%** événements flow création |
| Portail HRA Maisons | partiellement | **25% MVP** (architecture OK, pages clés vides) |
| Page édition voyage | non audité | **35% MVP** (7/17 étapes) |
| Workflow admin review | partiellement | **55% MVP** |
| Module documents légaux | partiellement | **45% MVP** infra / **0%** UE 2015/2302 |

**Total ajouté à la roadmap addendum 4** : ~21 jours dev (P0.29-37) + ~16 jours (P1.33-40) + ~7,5 jours (P2.26-28).

**Roadmap globale cumulée (5 sessions audit)** :
- **P0** (P0.1 → P0.37) : **~101 jours**
- **P1** (P1.1 → P1.40) : **~73 jours**
- **P2** (P2.1 → P2.28) : **~74 jours**
- → ≈ **248 jours dev solo** / **≈ 124 jours en parallèle (2-3 devs)** pour 100% MVP

---

## 37. RÉFÉRENCES ADDENDUM 4

- `backend/src/modules/email/email.service.ts:33, 60-125, 174, 213, 224` (Brevo + Outbox + idempotency)
- `backend/src/modules/email/email-templates.service.ts:32-67` (34 templates)
- `backend/src/modules/notifications/notifications.gateway.ts:1-90` (WebSocket Socket.IO + JWT)
- `backend/src/modules/notifications/notification-events.service.ts:43-374` (10 événements)
- `frontend/app/(maisons)/maisons/dashboard/page.tsx:50-60, 182` (mock data)
- `frontend/app/(maisons)/maisons/reservations/page.tsx` (2 lignes — vide)
- `frontend/app/(maisons)/maisons/reservations/[id]/page.tsx` (588 lignes — orphelin)
- `frontend/app/(pro)/pro/voyages/[id]/edit/page.tsx:1-553` (7/17 étapes)
- `backend/src/modules/admin/admin.controller.ts:313-358` (approve-p1/p2/reject)
- `backend/src/modules/documents/documents.controller.ts:68-200` (8 endpoints)
- `backend/src/modules/documents/legal-travel-documents.service.ts:1-235` (STUBS)
- `backend/prisma/schema.prisma:770-792` (DocumentType + ContractTemplateType)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Découverte clé addendum 4** : l'**infrastructure transverse est solide** (Brevo + Outbox + idempotency, WebSocket + JWT, 34 templates email, signature électronique, audit log) — Eventy a investi proprement les fondations. **MAIS** :
- 10 templates email **critiques** manquent pour le flow création voyage
- 9 événements WebSocket **critiques** manquent
- Le portail HRA a un dashboard riche mais sa **page liste réservations est vide**
- La page `/edit/page.tsx` ne couvre que **7 étapes sur 17**
- Les **4 documents légaux UE 2015/2302** sont des **STUBS**

**Top 5 P0 cumulés sur 5 sessions audit** (priorité absolue) :
1. **P0.24** — étendre `CreateTravelDtoSchema` à tous les champs `TravelFormData` (sinon wizard cosmétique)
2. **P0.29** — implémenter les 4 documents légaux UE 2015/2302 (sinon Eventy en infraction directive UE)
3. **P0.30 + P0.31** — créer les 10 templates email + 9 événements notif manquants
4. **P0.18** — brancher SymphonieValidationWorkflow au backend
5. **P0.10** — refund auto NO_GO (clients non remboursés)

**Risque légal cumulé bloquant production** :
- P0.10 (refund auto NO_GO)
- P0.11 (lecture cancellationPolicy créateur)
- P0.12 (Pack Sérénité override)
- P0.16 (cession billet L.211-11)
- P0.29 (documents légaux UE 2015/2302)

---

# 🔄 ADDENDUM 5 — Audit modules backend annexes 2026-04-30 (sessions 6)

> Audit des modules backend annexes critiques pour la création voyage :
> 38. Module **HRA** backend (HotelBlock workflow complet, restaurant-portal, hotel-portal)
> 39. Module **transport** (41 fichiers, 26 084 lignes — quotes, charter, flight, multi-bus, seat, vehicle-driver)
> 40. Module **insurance** (Pack Sérénité, claims, policies, assureur)
> 41. Module **finance** (27 062 lignes — close-pack, FEC export, TVA marge, URSSAF)
> 42. Module **SEO** backend (sitemap, robots, JSON-LD)
> 43. **API routes Next.js** (`frontend/app/api/`) — 198 dossiers, pattern proxy + démo
>
> **Aucune ligne de code modifiée.**

---

## 38. MODULE HRA BACKEND (workflow HotelBlock complet)

### 38.1 Architecture

**Dossier** : `backend/src/modules/hra/` — **6 041 lignes**

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `hra.controller.ts` | 996 | 28+ endpoints |
| `hra.service.ts` | 2 185 | Service principal |
| `hotel-portal.service.ts` | 332 | Portail hôtelier (HRA répond via token) |
| `restaurant-portal.service.ts` | 309 | Portail restaurateur |
| Tests | 1 058 + 474 + 316 + 340 | Coverage solide |

### 38.2 Endpoints majeurs

✅ **Onboarding HRA** (workflow magic link complet) :
- `POST /hra/hotel-partners/invite` — admin invite hôtel
- `GET /hra/hotel-partners/onboarding/:token` — hôtel arrive sur lien public
- `POST /hra/hotel-partners/onboarding/:token` — hôtel soumet profil
- `PATCH /hra/hotel-partners/:id/review` / `/approve` / `/reject` — admin review
- **Idem pour restaurant-partners** (8 endpoints)

✅ **Workflow HotelBlock** (cœur du flow création voyage) :
- `POST /hra/hotel-blocks` (l.404) — Pro crée demande de block
- `GET /hra/hotel-blocks/travel/:travelId` — liste blocs d'un voyage
- `GET /hra/hotel-blocks/respond/:token` (l.434) **Public** — hôtel consulte SANS LOGIN
- `POST /hra/hotel-blocks/respond/:token` — hôtel répond avec dispo + tarif
- `POST /hra/hotel-blocks/:id/confirm` — Pro confirme
- `POST /hra/hotel-blocks/:id/request-changes` — Pro demande modifs
- `POST /hra/hotel-blocks/:id/reject` — Pro rejette

✅ **Modèle Prisma `HotelBlock`** (schema.prisma:3191-3234) :
- `inviteToken` unique (`@unique`, indexed)
- Status enum `HotelBlockStatus` : `INVITE_SENT → HOTEL_SUBMITTED → BLOCK_ACTIVE | CHANGES_REQUESTED | REJECTED`
- Champs métier : `roomsRequested`, `roomsConfirmed`, `pricePerNightTTC`
- 5 supplements : `supplementSingleCents`, `supplementSeaViewCents`, `supplementHalfBoardCents`, `supplementFullBoardCents`, `supplementAllInclusiveCents`
- `taxeSejourType` (INCLUDED/ADDITIONAL) + `taxeSejourAmountCents`
- `childPriceType` (FULL/REDUCED) + `childReductionPercent`
- `marginType` (PERCENT/FIXED_CENTS) + `marginValue`
- `releaseDate` (libération auto si pas confirmé)

### 38.3 🔥 RÉVÉLATION CRITIQUE — Le P0.3 est **un branchement, pas un dev**

Mon premier audit (§2.3 EtapeAccommodation) disait :
> *"Notification HRA en phase création : ❌ ABSENT"*

**Réalité** : Le workflow **EXISTE INTÉGRALEMENT côté backend** :
1. POST `/hra/hotel-blocks` (Pro déclenche)
2. Génération `inviteToken` unique
3. Email envoyé à `hotelEmail` avec lien public `/hra/hotel-blocks/respond/:token`
4. Hôtel consulte/répond sans avoir besoin d'un compte
5. Workflow confirm/changes/reject

→ **Le wizard `EtapeAccommodation.tsx` ne déclenche simplement PAS** `POST /hra/hotel-blocks` quand le créateur sélectionne un hôtel. Le travail backend est fait, le frontend est à connecter.

→ **Idem probable pour restaurants** : `restaurant-portal.service.ts:309 lignes` existe avec workflow similaire.

### 38.4 Synthèse HRA backend

| Aspect | État |
|--------|------|
| Module HRA | ✅ Très solide (6 041 lignes) |
| Onboarding HRA via token magic link | ✅ |
| Workflow HotelBlock (request → response → confirm) | ✅ |
| Schéma Prisma HotelBlock détaillé (supplements, taxe séjour, child price) | ✅ Excellent |
| Portail hôtelier public (sans login) | ✅ |
| Tests | ✅ 2 188 lignes spec |
| **Branchement wizard `EtapeAccommodation` → `POST /hra/hotel-blocks`** | ❌ **Manquant** |
| **Branchement wizard `EtapeRestoration` → restaurant-blocks** | ❌ **Manquant** |

→ **Verdict** : zone **80% MVP-ready** (backend) + **0% intégration frontend wizard**. **P0.3 / P0.19 = juste à brancher**, pas à développer.

---

## 39. MODULE TRANSPORT BACKEND (26 084 lignes — 41 fichiers)

### 39.1 Architecture

**Dossier** : `backend/src/modules/transport/` — **26 084 lignes**

Sous-services :
- `transport.controller.ts` (801) + `transport.service.ts` (1 902)
- `transport-quotes` (devis) — controller + service + tests
- `transport-pricing` (tarification) — controller + service + tests
- `transport-status` (statut transport)
- `transport-notification` (notifs)
- `transport-dashboard`
- `charter-editor` + `charter-finance` (vol charter)
- `flight-management` + `flight-allotment` (allocation places)
- `multi-bus` (multi-véhicules)
- `seat-management` (gestion sièges)
- `vehicle-driver`
- `geo-stops` (géoloc arrêts)
- `transport-advanced.controller.ts`

### 39.2 Endpoints `transport-quotes` (devis fournisseurs)

**Fichier** : `transport-quotes.controller.ts:80-257`

✅ **EXCELLENT — Workflow devis transport complet** :
- `GET /providers` — liste fournisseurs
- `POST /providers` — admin ajoute fournisseur
- `PATCH /providers/:providerId` — update
- `POST /quotes` — Pro crée demande devis
- `POST /quotes/:quoteRequestId/broadcast` — diffuse aux fournisseurs
- `POST /quotes/:quoteRequestId/response` — fournisseur répond
- `GET /quotes/travel/:travelId/compare` — comparateur devis
- `POST /quotes/:quoteRequestId/accept` / `reject`
- `GET /quotes/stats`
- `GET /quotes/travel/:travelId/export`
- `POST /quotes/duplicate`
- `GET /providers/enriched`

→ **Mon premier audit (§2.14 EtapeFournisseurs)** disait *"workflow démo, pas de vrai email envoyé"*. **Réalité** : tout existe backend, **non branché frontend wizard**.

### 39.3 Synthèse transport backend

| Aspect | État |
|--------|------|
| Module transport | ✅ Massif (26 084 lignes, 41 fichiers) |
| Workflow devis transport | ✅ Complet (broadcast, response, compare, accept/reject) |
| Charter (vol) | ✅ Service dédié |
| Flight allotment | ✅ |
| Multi-bus | ✅ |
| Seat management | ✅ |
| Vehicle-driver | ✅ |
| Geo-stops | ✅ |
| Transport notifications | ✅ Service dédié |
| Tests | ✅ Spec partout |
| **Branchement wizard `EtapeFournisseurs` → `POST /transport-quotes/quotes`** | ❌ **Manquant** |
| **Branchement wizard `EtapeBusStops` → `geo-stops`** | ⚠️ Partiel |
| **Branchement wizard `EtapeBusSurPlace` → multi-bus / charter** | ❓ |

→ **Verdict** : zone **85% MVP-ready** (backend) / **20% frontend intégré**. Le backend est largement sur-dimensionné par rapport au branchement frontend actuel.

---

## 40. MODULE INSURANCE (Pack Sérénité) BACKEND

### 40.1 Architecture

**Dossier** : `backend/src/modules/insurance/` — **2 755 lignes**

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `insurance.controller.ts` | 170 | 5 endpoints client |
| `insurance.service.ts` | 398 | Service souscription |
| `claims.controller.ts` | 279 | 11 endpoints sinistres |
| `claims.service.ts` | 276 | Service sinistres |
| `assureur-access.service.ts` | ~ | Accès portail assureur |
| Tests | 853 + 357 lignes | Coverage |

### 40.2 Endpoints

✅ **Souscription assurance** :
- `GET /insurance/travel/:travelId/options` — options dispo
- `POST /insurance/booking/:bookingGroupId/subscribe` — souscrire
- `GET /insurance/mine` — mes assurances
- `POST /insurance/booking/:bookingGroupId/cancel` — annuler souscription
- `GET /insurance/:subscriptionId/certificate` — certificat

✅ **Sinistres (claims)** :
- `POST /claims/travel/:travelId` — déclarer sinistre
- `GET /claims/mine` / `/:claimId` — consulter
- `POST /claims/:claimId/documents` — joindre documents
- `GET /claims/admin/all` / `/admin/stats` — admin
- `PATCH /claims/admin/:claimId/status` — changer statut
- `GET /claims/assureur/dashboard` / `/assureur/claims` / `/assureur/claims/:claimId` — **portail assureur dédié**

### 40.3 Modèles Prisma riches

**Fichier** : `schema.prisma:5867-6024`

✅ **`InsuranceClaim`** (l.5867-5899) — 7 types de sinistre :
```
enum InsuranceClaimType {
  CANCELLATION    // Annulation voyage  ← critique pour P0.12 Pack Sérénité override
  REPATRIATION    // Rapatriement médical
  BAGGAGE         // Bagages perdus/volés/détériorés
  MEDICAL         // Frais médicaux
  LIABILITY       // Responsabilité civile
  DELAY           // Retard transport
  OTHER
}
```

✅ **Status workflow** :
```
SUBMITTED → UNDER_REVIEW → DOCS_REQUESTED → APPROVED/REJECTED → PAID → CLOSED
```

✅ **`InsuranceCoverageType`** (l.6020-6024) :
```
PACK_SERENITE    // Pack Sérénité inclus (standard Eventy)
PREMIUM
CUSTOM
```

✅ **Champs métier** : `claimAmountCents`, `refundedCents`, `insurerReference`, `internalNotes`, `attachments` (Json URLs)
✅ **`InsuranceClaimDocument`** (l.5902) — pièces jointes
✅ **`InsurancePolicy`** (l.5917) — police d'assurance

✅ **`RoomBooking.insuranceSelected: Boolean`** (l.2308) — flag de souscription

### 40.4 🔥 RÉVÉLATION — P0.12 (Pack Sérénité override) = juste glue

Mon addendum 1 (§10.4) disait :
> *"Pack Sérénité facturé mais non implémenté côté refund. CGV Art. 9 promis et non tenu"*

**Réalité** : tout est là backend :
- `RoomBooking.insuranceSelected` flag présent
- `InsuranceClaimType.CANCELLATION` enum dédié
- Workflow claim complet (SUBMITTED → APPROVED → PAID)
- Service `claims.service.ts` (276 lignes)
- Portail assureur dédié

→ **Ce qui manque** : le branchement dans `cancellation.service.ts:computeRefundAmount()` :

```ts
if (roomBooking.insuranceSelected) {
  // Créer InsuranceClaim type CANCELLATION automatiquement
  // Refund 100% via assurance, pas via Stripe direct
  return { refundAmountCents: paidAmountCents, ... };
}
```

→ **Travail estimé : 1-2 jours** (P0.12 reclassé "S → S"), pas une refonte.

### 40.5 Synthèse insurance

| Aspect | État |
|--------|------|
| Module insurance | ✅ Solide (2 755 lignes) |
| Souscription Pack Sérénité | ✅ Endpoints OK |
| Claims (7 types, workflow complet) | ✅ |
| Modèle Prisma `InsuranceClaim` + `InsurancePolicy` | ✅ Riche |
| `InsuranceCoverageType.PACK_SERENITE` enum | ✅ |
| Portail assureur dédié | ✅ |
| **Branchement cancellation → claim auto** (P0.12) | ❌ Glue à écrire |
| **Branchement booking → souscription auto** | ❓ |

→ **Verdict** : zone **80% MVP-ready** (backend) / **0% intégration cancellation**. Refacto = courte.

---

## 41. MODULE FINANCE BACKEND (27 062 lignes)

### 41.1 Architecture

**Dossier** : `backend/src/modules/finance/` — **27 062 lignes**

Sous-modules :
- `finance.controller.ts` + `finance.service.ts`
- `finance-advanced.controller.ts`
- `finance-policy.controller.ts` + `finance-policy.service.ts`
- `close-pack/` (sous-dossier dédié)
- `comptable-access.service.ts` + `comptable-widgets.service.ts`
- `bank-import.service.ts` + `bank-reconciliation.service.ts`
- `cron-export.service.ts`
- `fec-export.service.ts` (Fichier Écritures Comptables — obligation FR)
- `tva-audit-trail.service.ts` (790 lignes — TVA marge)
- `urssaf-vigilance.service.ts` (306 lignes)
- `das2.service.ts` (déclaration honoraires DAS2)
- `supplier-reconciliation.service.ts`
- `fund.service.ts` (gestion fonds)
- `poche-export.service.spec.ts`

### 41.2 ClosePack

**Fichier** : `backend/src/modules/finance/close-pack/README.md`

✅ **EXCELLENT — Workflow clôture financière voyage** :
1. `initiateClosePack(travelId, initiatorId)` — lance clôture
2. Récupère revenus (paiements confirmés), coûts (transport, hébergement, activités, assurances), commissions
3. Calcule **solde net** (revenus - coûts - commissions)
4. Génère **cotisations** : URSSAF, TVA marge, RC Pro, APST, Fonds Pool Créateur
5. Crée enregistrement **verrouillé** (audit + comptabilité)
6. **Validation admin** avant finalisation
7. **Export FEC** (Fichier Écritures Comptables — obligation FR), CSV, Excel

### 41.3 ❌ MANQUE / TODO

Cohérent avec mon premier audit (mémoire PDG `project_garantie_apst.md`) :
- ✅ FEC export → conformité FR OK
- ✅ TVA marge audit trail (790 lignes)
- ✅ URSSAF vigilance
- ✅ DAS2 (déclaration honoraires créateurs/indés > 1200€/an)
- ✅ APST garantie (cotisation calculée dans ClosePack)
- ⚠️ Mais : **escrow fonds clients APST** (cf. addendum 1 §9.6) → à étendre

### 41.4 Synthèse finance

| Aspect | État |
|--------|------|
| Module finance | ✅ Très massif (27 062 lignes) |
| ClosePack workflow voyage | ✅ Solide |
| Export FEC (obligation FR) | ✅ |
| TVA marge audit trail | ✅ 790 lignes |
| URSSAF vigilance | ✅ |
| DAS2 honoraires indés | ✅ |
| Cotisation APST auto | ✅ |
| Escrow fonds clients APST | ⚠️ Partiel (BankAccount.isEscrow OK, branchement manquant) |
| Bank import + reconciliation | ✅ |
| Comptable widgets | ✅ |

→ **Verdict** : zone **85% MVP-ready**. Probablement la zone la plus avancée d'Eventy. Conformité FR couverte.

---

## 42. MODULE SEO BACKEND

### 42.1 Architecture

**Fichier** : `backend/src/modules/seo/` — **1 990 lignes**

| Fichier | Lignes |
|---------|--------|
| `seo.controller.ts` | 140 |
| `seo.service.ts` | 482 |
| Tests | 491 |

### 42.2 Endpoints

✅ **EXCELLENT — Tous présents** :
- `GET /sitemap.xml` (l.27) ✅ **sitemap dynamique**
- `GET /robots.txt` (l.132) ✅
- `GET /travel/:slug/json-ld` (l.43) ✅ **JSON-LD Schema.org/TouristTrip par voyage**
- `GET /home/json-ld` (l.58)
- `GET /agency/json-ld` (l.90) ✅ Schema.org/TravelAgency
- `GET /catalog/json-ld` (l.104)
- `GET /meta-tags/:slug` (l.76) ✅ meta-tags dynamiques
- `GET /destinations` (l.118) — liste destinations SEO

### 42.3 🔥 RÉVÉLATION — P1.30 résolu côté backend

Mon addendum 3 (§26) disait :
> *"JSON-LD Schema.org/TouristTrip absent"*

**Réalité** : `/seo/travel/:slug/json-ld` existe et **génère le JSON-LD côté backend** !

→ **Ce qui manque** : la fiche publique `frontend/app/(public)/voyages/[slug]/layout.tsx` doit appeler ce endpoint et injecter le JSON-LD dans `<head>` via `<script type="application/ld+json">`.

→ **Mon §26 §generateMetadata** : `VOYAGE_SEO[decodedSlug]` hardcodé — devrait être remplacé par appel à `GET /seo/travel/:slug/json-ld` + `GET /seo/meta-tags/:slug`.

### 42.4 Synthèse SEO backend

| Aspect | État |
|--------|------|
| Sitemap dynamique | ✅ |
| robots.txt | ✅ |
| JSON-LD TouristTrip par voyage | ✅ |
| JSON-LD TravelAgency | ✅ |
| JSON-LD Catalog | ✅ |
| Meta-tags dynamiques | ✅ |
| Liste destinations SEO | ✅ |
| **Branchement fiche publique frontend** | ❌ Hardcodé `VOYAGE_SEO` au lieu d'appel API |

→ **Verdict** : zone **75% MVP-ready** (backend ✅, frontend hardcodé). **P1.30 = juste glue à faire**.

---

## 43. API ROUTES NEXT.JS (`frontend/app/api/`)

### 43.1 Architecture

**Volume** : **198 dossiers** sous `frontend/app/api/`, organisés par portail :
- `api/admin/*` — proxies admin
- `api/pro/*` — 31 routes proxies pour le Pro (créateur)
- `api/client/*`, `api/maisons/*`, `api/equipe/*`, `api/checkout/*`, `api/public/*`, `api/auth/*`

### 43.2 Pattern proxy + démo

**Fichier** : `frontend/app/api/pro/travels/route.ts:1-50`

```ts
import { tryProxyOrDemo } from '@/lib/api-guard';
import { DEMO_TRAVELS_FULL } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const proxied = await tryProxyOrDemo(request, '/pro/travels');
  if (proxied) return proxied;
  // ... fallback DEMO_TRAVELS_FULL si backend indispo
}
```

✅ **Pattern systématique** : toutes les routes API Next.js suivent ce schéma `tryProxyOrDemo` :
1. Tente de proxier vers le backend NestJS
2. Si backend indispo → renvoie données démo `DEMO_*`

### 43.3 ⚠️ Risques du fallback démo

🔥 **Bénéfice** : résilience UX — l'app reste utilisable si backend down (présentation, démos commerciales).

🔥 **Risque** :
1. Si backend non démarré (dev), créateur bosse sur du mock **sans le savoir**, perd tout au refresh
2. Confusion débuggage : pourquoi mes données ne persistent pas ?
3. Pas de **toast / banner** "Mode démo — données non persistées"
4. **Production** : si backend a une glitch transitoire, créateur croit avoir sauvegardé alors qu'il a écrit du mock

### 43.4 Routes pro API liées au wizard

**Routes détectées** :
```
api/pro/travels/route.ts                  (liste + create)
api/pro/voyages/[id]/restauration/route.ts
api/pro/bus-routes/route.ts
api/pro/bus-routes/[id]/route.ts
api/pro/bus-stops/[id]/hra/route.ts
api/pro/bus-stops/[id]/parcours/route.ts
api/pro/bus-stops/[id]/pois/route.ts
api/pro/bus-stops/[id]/updates/route.ts
api/pro/cagnottes/route.ts
api/pro/dashboard/stats/route.ts
api/pro/financials/route.ts
api/pro/formation/...
api/pro/marketing/analytics/route.ts
api/pro/marketing/campaigns/route.ts
api/pro/marketing/shortlinks/route.ts
```

⚠️ **Hétérogénéité naming** :
- `/api/pro/travels/route.ts` (anglais)
- `/api/pro/voyages/[id]/restauration/route.ts` (français)
- → Confusion : 2 conventions cohabitent

### 43.5 Synthèse API routes Next.js

| Aspect | État |
|--------|------|
| Volume | ✅ 198 dossiers |
| Pattern proxy + démo `tryProxyOrDemo` | ✅ Bon pour résilience |
| Banner "Mode démo" si fallback | ❌ Manquant — risque utilisateur |
| Convention naming (travels vs voyages) | ⚠️ Incohérente |
| Toutes les actions wizard branchées | ❓ À vérifier endpoint par endpoint |
| Tests routes Next.js | ❓ Non audité |

→ **Verdict** : zone **70% MVP-ready**. Pattern résilient mais **banner démo critique manquant**.

---

## 44. NOUVEAUX TODOs PRIORITAIRES (issus addendum 5)

### 🔴 P0 — BLOQUANT MVP

| # | Tâche | Effort |
|---|-------|--------|
| P0.38 | **Brancher EtapeAccommodation → POST /hra/hotel-blocks** (workflow backend complet existe déjà) | M (1.5j) |
| P0.39 | **Brancher EtapeRestoration → restaurant-portal endpoints** (workflow similaire) | M (1.5j) |
| P0.40 | **Brancher cancellation.service:computeRefundAmount() → InsuranceClaim auto si RoomBooking.insuranceSelected** (Pack Sérénité override — résout P0.12) | S (1j) |
| P0.41 | **Brancher EtapeFournisseurs → POST /transport-quotes/quotes** (workflow backend existe déjà) | M (1.5j) |
| P0.42 | **Banner "Mode démo — données non persistées"** dans Next.js si `tryProxyOrDemo` fallback | S (1j) |
| P0.43 | **Convention naming uniforme** : choisir `/api/pro/travels/*` OU `/api/pro/voyages/*` partout | S (0.5j) |
| P0.44 | **Brancher fiche publique** `(public)/voyages/[slug]/layout.tsx` à `GET /seo/travel/:slug/json-ld` + `/meta-tags/:slug` (résout P1.30) | S (1j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.41 | Étendre escrow APST : flag automatique `PaymentContribution.isClientFunds` + virement sur compte escrow | M (2j) |
| P1.42 | Bouton "Souscrire Pack Sérénité" ↔ `POST /insurance/booking/:bookingGroupId/subscribe` | S (1j) |
| P1.43 | Auto-souscription Pack Sérénité (inclus dans tous voyages) à la création BookingGroup | S (1j) |
| P1.44 | Comparateur devis transport `GET /transport-quotes/quotes/travel/:travelId/compare` UI dans EtapeFournisseurs | M (2j) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.29 | Tests API routes Next.js (mock backend, test fallback démo) | M (2j) |
| P2.30 | Dashboard Pro : "vos voyages avec HotelBlock pendant" (suivi workflow HRA) | M (2j) |
| P2.31 | Gamification HRA : ranking hôtels les plus réactifs | S (1j) |

### 📊 Mise à jour tableau récap MVP global

| Bloc | Avant addendum 5 | Après audit complémentaire |
|------|------------------|----------------------------|
| Module HRA backend (HotelBlock workflow) | non audité | **80% MVP** (backend ✅, frontend non branché) |
| Module transport backend | non audité | **85% MVP** (backend massif, frontend non branché) |
| Module insurance + Pack Sérénité | non audité | **80% MVP** (backend ✅, P0.12 = glue) |
| Module finance (close-pack, FEC) | non audité | **85% MVP** ✅ Probablement le mieux fait d'Eventy |
| Module SEO backend | partiellement audité | **75% MVP** (backend ✅, frontend hardcodé) |
| API routes Next.js | non audité | **70% MVP** |

**Total ajouté à la roadmap addendum 5** : ~8 jours dev (P0.38-44) + ~6 jours (P1.41-44) + ~5 jours (P2.29-31).

**Roadmap globale cumulée (6 sessions audit)** :
- **P0** (P0.1 → P0.44) : **~109 jours**
- **P1** (P1.1 → P1.44) : **~79 jours**
- **P2** (P2.1 → P2.31) : **~79 jours**
- → ≈ **267 jours dev solo** / **≈ 134 jours en parallèle (2-3 devs)** pour 100% MVP

---

## 45. RECLASSEMENT PRIORITAIRE — Ce qui change avec l'addendum 5

L'addendum 5 révèle qu'**Eventy backend est BEAUCOUP plus avancé** que les premiers audits ne le suggéraient. **Le déficit n'est pas backend, c'est l'intégration frontend wizard ↔ backend**.

| Premier audit P0 (long) | Réalité après addendum 5 |
|--------------------------|--------------------------|
| P0.3 Notif HRA inclus (L 3j) | → **P0.38 = 1.5j** (workflow backend complet) |
| P0.12 Pack Sérénité override (S 1j) | → **P0.40 = 1j** (juste glue) |
| P0.41 Vrai email fournisseur (L 3j) | → **P0.41 = 1.5j** (transport-quotes backend OK) |
| P0.29 Documents légaux UE (XL 5-7j) | → reste XL : `LegalTravelDocumentsService` est en STUBS (vraies stubs vides) |

**Économie d'effort estimée** : ~10 jours sur l'audit cumulé. Roadmap réelle plus proche de **~257 jours** que **~267**.

---

## 46. RÉFÉRENCES ADDENDUM 5

- `backend/src/modules/hra/hra.controller.ts:404-490` (HotelBlock workflow)
- `backend/src/modules/hra/hra.service.ts:2185 lignes`
- `backend/src/modules/hra/hotel-portal.service.ts:332` + `restaurant-portal.service.ts:309`
- `backend/prisma/schema.prisma:3191-3234` (HotelBlock model) + `:503-509` (HotelBlockStatus)
- `backend/src/modules/transport/transport-quotes.controller.ts:80-257` (devis workflow)
- `backend/src/modules/insurance/insurance.controller.ts:47-141` (5 endpoints souscription)
- `backend/src/modules/insurance/claims.controller.ts:54-203` (11 endpoints claims + assureur)
- `backend/prisma/schema.prisma:5867-5899` (InsuranceClaim) + `:6000-6024` (enums InsuranceClaimType, InsuranceCoverageType)
- `backend/src/modules/finance/close-pack/README.md`
- `backend/src/modules/finance/fec-export.service.ts`
- `backend/src/modules/finance/tva-audit-trail.service.ts:790 lignes`
- `backend/src/modules/seo/seo.controller.ts:27-132` (8 endpoints)
- `frontend/app/api/pro/travels/route.ts:1-50` (pattern proxy/démo `tryProxyOrDemo`)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Découverte clé addendum 5** : **Eventy backend est sur-dimensionné** par rapport au branchement frontend. Module HRA, transport, insurance, finance, SEO : tous **massifs et bien architecturés**, avec workflows complets, tokens publics, modèles Prisma riches, tests. **MAIS** le wizard frontend de création voyage n'utilise quasiment **aucun** de ces workflows — il sauvegarde tout en localStorage ou en JSON opaque. **Le projet a investi sur les fondations, pas sur la glue**.

**Top 5 P0 cumulés sur 6 sessions audit** (priorité absolue, **réévaluée**) :
1. **P0.24** — étendre `CreateTravelDtoSchema` à tous les champs (sans ça, le wizard ne persiste rien)
2. **P0.38 + P0.39 + P0.41** — brancher EtapeAccommodation/Restoration/Fournisseurs aux endpoints HRA/transport-quotes existants (~4.5j total)
3. **P0.40** — brancher cancellation → InsuranceClaim auto (Pack Sérénité, **1j**)
4. **P0.18** — brancher SymphonieValidationWorkflow au backend
5. **P0.10** — refund auto NO_GO

**Risque légal cumulé bloquant production** (inchangé) :
- P0.10 (refund auto NO_GO)
- P0.11 (lecture cancellationPolicy créateur)
- P0.12 → P0.40 (Pack Sérénité override — **maintenant 1j**)
- P0.16 (cession billet L.211-11)
- P0.29 (documents légaux UE 2015/2302)

---

# 🔄 ADDENDUM 6 — Audit modules backend annexes 2 (sessions 7)

> Audit des derniers modules backend critiques :
> 47. Module **marketing** (campagnes, QR codes, rays/rayons monnaie virtuelle)
> 48. Module **restauration** (meal-plan, dietary, menus, déclarations, disputes)
> 49. Modules **post-sale + reviews** (feedback, bilan, avis modération)
> 50. Module **legal + RGPD + DSAR** (data-erasure, data-retention, avocat-portal)
> 51. Module **cron** (24 jobs schedulés détectés)
> 52. **Stripe Connect** workflow détaillé (transferts, payouts, dashboard)
>
> **Aucune ligne de code modifiée.**

---

## 47. MODULE MARKETING BACKEND

### 47.1 Architecture

**Dossier** : `backend/src/modules/marketing/` — **6 399 lignes**

| Fichier | Lignes |
|---------|--------|
| `marketing.controller.ts` + `marketing.service.ts` | ~ |
| `lead.service.ts` (gestion leads) | ~ |
| `qr-code.service.ts` | 350 |
| `rays.controller.ts` + `rays.service.ts` | 408 + 901 (système Rays = monnaie virtuelle) |

### 47.2 Endpoints Marketing

✅ **Campaigns workflow complet** :
- `POST /marketing/campaigns` (l.107) — créer
- `PATCH /marketing/campaigns/:id` (l.124) — update
- `POST /marketing/campaigns/:id/launch` / `/pause` / `/resume` / `/end` — workflow
- `POST /marketing/campaigns/:id/schedule` — planifier
- `POST /marketing/campaigns/:id/duplicate`
- `POST /marketing/campaigns/:id/delete` (soft delete)
- `GET /marketing/campaigns` + `:id` + `:id/metrics`
- `GET /marketing/dashboard`
- `POST /marketing/qr-codes` + `GET /marketing/qr-codes`

✅ **Rays endpoints** (l.180-346) — monnaie virtuelle marketing :
- `GET /rays/balance` — solde Rays utilisateur
- `GET /rays/transactions` — historique
- `POST /rays/spend` — dépenser
- `POST /rays/purchase/bundle` — acheter pack
- `GET /rays/products`, `/products/:slug`, `/kits`, `/bundles`, `/promotions/active`
- `POST /rays/grant` (admin) — créditer
- Admin : `POST /rays/products`, `/kits`, `/bundles`, `/promotions`

### 47.3 Cohérence avec EtapeMarketingVoyage frontend

**Fichier** : `EtapeMarketingVoyage.tsx:607` (déjà audité §2.16 et §18.1)

✅ **BON** :
- Frontend wizard mentionne QR tracké → backend `qr-code.service.ts:350 lignes` existe
- Frontend mentionne assets digitaux → endpoint `/api/pro/marketing/assets` mentionné (à vérifier)
- Campaigns workflow OK côté backend

❌ **ACCROCHE âme Eventy** :
- Backend OK pour campaigns/QR/rays mais ne contient **aucun champ** pour le slogan voyage, accroche émotionnelle, hashtags personnalisés (cf. P1.3)
- L'âme Eventy ("chaleureux comme un ami") ne survit pas au backend

### 47.4 Synthèse marketing

| Aspect | État |
|--------|------|
| Campaigns workflow | ✅ Complet |
| QR codes service | ✅ |
| Rays (monnaie virtuelle) | ✅ Riche |
| Dashboard marketing | ✅ |
| Branchement EtapeMarketingVoyage frontend | ⚠️ Partiel |
| Champs "âme Eventy" (slogan, accroche, hashtags) | ❌ |

→ **Verdict** : zone **70% MVP-ready** (backend ✅, P1.3 reste valide).

---

## 48. MODULE RESTAURATION BACKEND

### 48.1 Architecture

**Dossier** : `backend/src/modules/restauration/` — **3 945 lignes**

| Fichier | Lignes |
|---------|--------|
| `restauration.controller.ts` | 381 |
| `restauration.service.ts` | 923 |
| Tests | 1 478 + spec |

### 48.2 Endpoints (20 routes)

✅ **EXCELLENT — Workflow restauration COMPLET** :

**Meal-plan voyage** :
- `GET /restauration/:travelId/meal-plan`
- `PATCH /restauration/:travelId/meal-plan`
- `GET /restauration/:travelId/meal-formula` / `PATCH`

**Régimes spéciaux** :
- `GET /restauration/:travelId/dietary` — résumé régimes par voyage
- `POST /restauration/booking/:bookingGroupId/dietary` ⭐ **gestion régimes par booking**

**Restaurants partenaires** :
- `GET /restauration/:travelId/restaurants`
- `POST /restauration/:travelId/restaurants`

**Menus** :
- `GET /restauration/:travelId/menus`
- `POST /restauration/:travelId/menus`
- `POST /restauration/menus/:menuId/courses` — ajouter plats au menu

**Comptabilité** :
- `GET /restauration/:travelId/meal-cost`
- `GET /restauration/:travelId/costs`
- `GET /restauration/:travelId/summary-pdf`

**Déclarations repas servis** (workflow comptable) :
- `GET /restauration/:travelId/declarations`
- `POST /restauration/:travelId/declarations`
- `PATCH /restauration/declarations/:id/serve` — repas servi
- `PATCH /restauration/declarations/:id/invoice` — facturé
- `PATCH /restauration/declarations/:id/pay` — payé

**Disputes** :
- `GET /restauration/:travelId/disputes` — litiges restauration

### 48.3 🔥 RÉVÉLATION — P0.22 (régimes spéciaux pré-déclarés) résout par branchement

Mon addendum 3 (§16.6) disait :
> *"Wizard ne demande pas au créateur 'quels régimes garantissez-vous au restaurant partenaire ?' → risque commercial + sécurité alimentaire"*

**Réalité** : `POST /restauration/booking/:bookingGroupId/dietary` existe, ainsi que `GET /restauration/:travelId/dietary` (résumé voyage). **Le frontend wizard `EtapeRestoration` n'utilise pas ces endpoints**. À brancher.

### 48.4 Synthèse restauration

| Aspect | État |
|--------|------|
| Module restauration | ✅ 3 945 lignes |
| Meal-plan + meal-formula | ✅ |
| Régimes spéciaux backend | ✅ Endpoints dédiés |
| Restaurants partenaires par voyage | ✅ |
| Menus + courses (plats) | ✅ |
| Déclarations workflow (serve/invoice/pay) | ✅ Comptable |
| Disputes | ✅ |
| Summary PDF | ✅ |
| **Branchement wizard `EtapeRestoration`** | ⚠️ Partiel (P0.39) |

→ **Verdict** : zone **80% MVP-ready** (backend ✅).

---

## 49. MODULES POST-SALE + REVIEWS

### 49.1 Module post-sale (5 373 lignes)

**Endpoints** :
- `GET /post-sale/travel/:travelId/dashboard` — vue post-voyage
- `POST /post-sale/travel/:travelId/feedback` — soumettre feedback voyageur
- `GET /post-sale/travel/:travelId/feedback-summary`
- `GET /post-sale/travel/:travelId/report` — rapport bilan voyage
- `GET /post-sale/booking/:bookingGroupId/invoice` — facture client
- `GET /post-sale/travel/:travelId/pro-invoice` — facture créateur Pro
- `POST /post-sale/travel/:travelId/send-bilan` — envoi bilan email
- `GET /post-sale/completed` — voyages terminés
- `POST /post-sale/travel/:travelId/archive` — archiver voyage

✅ **BON** :
- Feedback voyageur structuré
- Rapport bilan
- 2 factures (client / créateur Pro) — cohérent avec close-pack finance
- Archive voyage

### 49.2 Module reviews (avis voyageurs)

**Endpoints** :
- `POST /reviews` — créer review
- `GET /reviews/travel/:travelId`
- `GET /reviews/travel/:travelId/stats`
- `GET /reviews/mine`
- `POST /reviews/:id/report` — signaler abus
- `PATCH /reviews/admin/:id/moderate` — modération
- `GET /reviews/admin/pending` — file modération
- `GET /reviews/pro/:proSlug` — reviews du Pro
- `GET /reviews/pro/my-reviews`
- `POST /reviews/:id/pro-response` — réponse Pro
- `GET /reviews/pro/stats/:proSlug`

✅ **BON** :
- Workflow modération admin
- Réponse Pro à un avis
- Stats par voyage / par Pro
- Reporting d'abus (signaler une review)

### 49.3 Synthèse post-sale + reviews

| Aspect | État |
|--------|------|
| Module post-sale | ✅ 5 373 lignes |
| Workflow bilan voyage | ✅ |
| Factures client + Pro | ✅ |
| Module reviews avec modération | ✅ |
| Réponse Pro à review | ✅ |
| Stats publiques par voyage | ✅ |

→ **Verdict** : zone **85% MVP-ready**. Très solide pour le cycle après-voyage.

---

## 50. MODULE LEGAL + RGPD + DSAR (10 559 lignes)

### 50.1 Architecture

**Dossier** : `backend/src/modules/legal/` — **10 559 lignes**

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `legal.controller.ts` | 474 | Documents légaux + acceptances |
| `legal.service.ts` | 166 | |
| `dsar.controller.ts` | ~ | DSAR (Data Subject Access Request) RGPD |
| `dsar.service.ts` | 676 | |
| `data-erasure.service.ts` | ~ | Effacement RGPD |
| `data-retention.service.ts` | ~ | Rétention données |
| `legal-case-tracker.service.ts` | 303 | Suivi affaires juridiques |
| `avocat-access.service.ts` | ~ | Portail avocat dédié |
| Tests | 1 210 + 566 spec | Coverage |

### 50.2 Endpoints `legal.controller.ts`

✅ **Documents légaux + acceptances** :
- `GET /legal/documents` — liste docs (CGV, CGU, RGPD, mentions, etc.)
- `GET /legal/documents/:type` — doc par type
- `POST /legal/accept` — utilisateur accepte un document versionné
- `GET /legal/me/acceptances` — historique acceptations utilisateur
- `GET /legal/me/compliance` — compliance status utilisateur
- `POST /legal/admin/documents` — admin crée nouvelle version

✅ **Portail avocat dédié** (8 endpoints) :
- `GET /legal/avocat/dashboard`
- `GET /legal/avocat/documents` + `:id`
- `GET /legal/avocat/contracts` + `:id`
- `GET /legal/avocat/signatures`
- `GET /legal/avocat/dsar` — affaires DSAR
- `GET /legal/avocat/compliance`
- `GET /legal/avocat/export/documents`

### 50.3 Endpoints DSAR (Data Subject Access Request)

✅ **Workflow RGPD complet** :
- `POST /dsar` — utilisateur fait demande
- `GET /dsar` — voir ses demandes
- `GET /dsar/admin` — admin liste demandes
- `GET /dsar/admin/stats`
- `PATCH /dsar/admin/:id` — admin process
- `GET /dsar/admin/erasure/:userId/eligibility` — éligibilité droit à l'oubli
- `GET /dsar/admin/erasure/:userId/report` — rapport effacement
- `POST /dsar/admin/erasure/:dsarRequestId/execute` — exécuter effacement
- `POST /dsar/export` — export données utilisateur
- `POST /dsar/erasure` — utilisateur demande effacement

### 50.4 🔥 RÉVÉLATION — RGPD/DSAR très bien implémenté

Mon premier audit n'avait pas vu ce module. **Eventy est conforme RGPD** :
- ✅ Documents légaux versionnés + acceptance tracking utilisateur
- ✅ DSAR workflow complet (création → admin process → eligibility → report → execute)
- ✅ Effacement données (droit à l'oubli) avec rapport pré-effacement
- ✅ Export données utilisateur (droit d'accès)
- ✅ Rétention données automatisée (cron)
- ✅ Portail avocat dédié pour suivi compliance

### 50.5 Synthèse legal/RGPD

| Aspect | État |
|--------|------|
| Module legal | ✅ 10 559 lignes |
| Documents légaux versionnés | ✅ |
| Acceptances tracking utilisateur | ✅ |
| DSAR (droit d'accès RGPD) | ✅ Complet |
| Data erasure (droit à l'oubli RGPD) | ✅ |
| Data retention auto | ✅ |
| Portail avocat | ✅ |
| Compliance dashboard | ✅ |

→ **Verdict** : zone **90% MVP-ready**. **Excellente conformité RGPD**.

---

## 51. MODULE CRON (24 jobs schedulés détectés)

### 51.1 Architecture

**Dossier** : `backend/src/modules/cron/` — **5 002 lignes**

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `cron.service.ts` | 1 935 | Service principal |
| `cron-alert.service.ts` | ~ | Alertes admin |
| `cron-cleanup.service.spec.ts` | ~ | |
| `cron-lock.service.ts` | 231 | Verrouillage anti-concurrence |
| `cron-timeout.decorator.ts` | 96 | Décorateur timeout |
| `PRODUCTION-HARDENING.md` | — | Doc hardening |

✅ **Lock service** + **Timeout decorator** — patterns prod-ready (anti-concurrent runs, anti-runaway jobs).

### 51.2 Inventaire des 24 jobs

**Fichier** : `cron.service.ts` (24 `@Cron(...)` détectés)

| Schedule | Méthode (extrait commentaires) |
|----------|--------------------------------|
| `EVERY_5_MINUTES` | Annulation hold expirations (paiement non reçu) — **INVARIANT 7** : ne pas annuler si paiement reçu |
| `0 6 * * *` (6h00) | Status check voyages — **idempotency** status guards |
| `0 0 1 * *` (1er mois) | Agrégation mensuelle (perf : agrégation Prisma) |
| `0 7 * * *` (7h00) | Daily check (PERF: pagination) |
| `0 8 * * *` (8h00) | **Expiration blocs hôtel (14j)** ⭐ |
| `0 3 * * 1` (lundi 3h) | Data retention (délégation `DataRetentionService`) |
| `0 2 * * *` (2h00) | Tokens cleanup (security — anti-accumulation) |
| `15 2 * * *` (2h15) | Tokens sensibles cleanup |
| `30 2 * * *` (2h30) | Vouchers expiration |
| `*/10 * * * *` (10 min) | Holds expirés |
| `0 9 * * *` (9h00) | **Rappels départ J-7 / J-3** ⭐ |
| `0 10 * * *` (10h00) | **Rappels paiement** ⭐ |
| `*/30 * * * *` (30 min) | Anomalies admin alert |
| `0 7 * * *` (7h00) | Daily report dashboard |
| `0 */4 * * *` (4h) | Waitlist expiry |
| `0 * * * *` (chaque heure) | Abandoned cart reminder |
| `EVERY_MINUTE` | SLA check |
| `0 3 * * 0` (dimanche 3h) | Weekly cleanup |
| `0 2 1 * *` (1er mois 2h UTC) | Monthly stats |
| `*/30 * * * *` (30 min) | Autre task |
| `0 3 1 * *` | 1er mois 3h |
| `0 2 * * *` | 2h00 |
| `30 10 * * *` (10h30) | Task spécifique |
| `0 9 * * 1` (lundi 9h) | Task hebdo |

### 51.3 ❌ Crons manquants pour le wizard création

| Manque | Impact | Priorité |
|--------|--------|----------|
| Cron relance solde **J-30** | Anti-impayés | P1.14 / P1.40 |
| Cron relance solde **J-7** | Idem | Idem |
| Cron génération auto **manifeste J-7** (PDF + envoi HRA + équipe) | Workflow opérationnel | P1.36 |
| Cron auto-publication occurrences récurrentes | Voyages récurrents (P1.8) | P1 |
| Cron alerte créateur si sa Phase 1 est en review > 7j | UX | P1 |

### 51.4 Synthèse cron

| Aspect | État |
|--------|------|
| Module cron | ✅ Solide (5 002 lignes) |
| 24 jobs schedulés | ✅ Inventaire riche |
| Lock anti-concurrence | ✅ |
| Timeout decorator | ✅ |
| Production hardening doc | ✅ |
| Crons rappels paiement / départ | ✅ |
| Cron relance solde J-30/J-7 | ❌ |
| Cron manifeste J-7 | ❌ |
| Cron occurrences récurrentes | ❌ |

→ **Verdict** : zone **80% MVP-ready**. Très solide. Quelques crons métier manquent.

---

## 52. STRIPE CONNECT WORKFLOW DÉTAILLÉ

### 52.1 Architecture

**Fichier** : `backend/src/modules/payments/stripe-connect.service.ts:912 lignes`

Méthodes principales :
| Méthode | Ligne | Rôle |
|---------|-------|------|
| `createConnectAccount()` | 69 | Crée compte Stripe Connect (créateur Pro / partenaire) |
| `createAccountLink()` | 151 | Lien onboarding KYC |
| `getAccountStatus()` | 210 | Status Stripe (charges_enabled, payouts_enabled, details_submitted) |
| `handleAccountUpdated()` | 273 | Webhook account.updated |
| `createTransfer()` | 341 | Transfert plateforme → connect account (versement post-voyage) |
| `createPayout()` | 408 | Payout connect → banque pro |
| `getBalance()` | 489 | Balance Stripe Connect |
| `getTransferHistory()` | 542 | Historique versements |
| `getPayoutHistory()` | 622 | Historique payouts |
| `getDashboard()` | 701 | Dashboard Pro Stripe |
| `updatePayoutSchedule()` | 757 | Modifier fréquence payouts |
| `deactivateAccount()` | 832 | Désactiver compte |
| `getOnboardingProgress()` | 896 | Progress KYC |

### 52.2 createTransfer (versement post-voyage)

**Fichier** : `stripe-connect.service.ts:341-397`

✅ **BON** :
- Validation montant > 0 (l.348)
- Récupération `stripeAccountId` depuis `user.metadata` (l.360)
- Throws `NotFoundException` si pas de compte Connect (l.364)
- `stripe.transfers.create()` avec `metadata: { userId, travelId }` (l.371-380)
- Logger explicit (l.382-384)

⚠️ **À CREUSER** :
- Stockage `stripeAccountId` dans `user.metadata` (Json) → pas typé Prisma. Risque de drift.
- Pas vu de check **idempotency-key** sur le transfert
- Cohérence avec `EtapeSummary` mention *"Stripe Connect paiement automatique post-voyage, marge Eventy déduite avant versement"* (cf. §2.17)

### 52.3 Workflow complet déduit

1. **Onboarding Pro** : `POST /payments/stripe-connect/account` → KYC Stripe via `createAccountLink()`
2. **Webhook account.updated** : suivre validation Stripe (`handleAccountUpdated`)
3. **Booking client** : paiement Stripe entre platform + déduction commission Eventy 18%
4. **Voyage terminé (post-voyage)** : `close-pack/close-pack.service.ts` → calcul net créateur → `createTransfer()` vers Connect account du créateur
5. **Payout** : `createPayout()` connect → banque pro selon schedule (`updatePayoutSchedule`)

### 52.4 Synthèse Stripe Connect

| Aspect | État |
|--------|------|
| createConnectAccount + AccountLink (onboarding) | ✅ |
| getAccountStatus + webhook account.updated | ✅ |
| createTransfer (plateforme → connect) | ✅ |
| createPayout (connect → banque) | ✅ |
| getBalance + history (transfers, payouts) | ✅ |
| Dashboard Pro Stripe | ✅ |
| Idempotency-key sur transfer | ❓ Non vu |
| stripeAccountId stocké en `user.metadata` Json (pas typé) | ⚠️ |
| Tests stripe-connect | ✅ Spec présent |

→ **Verdict** : zone **80% MVP-ready**. Workflow complet, quelques améliorations idempotency.

---

## 53. NOUVEAUX TODOs PRIORITAIRES (issus addendum 6)

### 🔴 P0 — BLOQUANT MVP

| # | Tâche | Effort |
|---|-------|--------|
| P0.45 | **Brancher EtapeRestoration → POST /restauration/booking/:bookingGroupId/dietary** (régimes spéciaux backend dispo) | S (1j) |
| P0.46 | **Idempotency-key sur Stripe `createTransfer()`** + typage strict `stripeAccountId` (sortir de `user.metadata` Json) | S (1j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.45 | **Cron relance solde J-30 / J-7** (résout P1.14 / P1.40 partiellement) | S (1j) |
| P1.46 | **Cron manifeste J-7** auto-PDF + envoi HRA + équipe | M (1.5j) |
| P1.47 | **Cron alerte créateur** si Phase 1/2 en review > 7j sans réponse admin | XS (0.5j) |
| P1.48 | **Champs "âme Eventy"** dans EtapeMarketingVoyage (slogan, accroche, hashtags) → P1.3 | S (1j) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.32 | UI "compliance dashboard" Pro (statut acceptances RGPD) — ré-utilise endpoints `/legal/me/compliance` | S (1j) |
| P2.33 | Auto-déclencher DSAR export 1×/an pour utilisateurs RGPD-aware | S (1j) |
| P2.34 | Webhook Stripe `account.updated` → notification créateur si KYC bloqué | S (0.5j) |

### 📊 Mise à jour tableau récap MVP global

| Bloc | Avant addendum 6 | Après audit complémentaire |
|------|------------------|----------------------------|
| Marketing backend | non audité | **70% MVP** (campaigns/QR/Rays OK, âme manquante) |
| Restauration backend | non audité | **80% MVP** (workflow complet, branchement frontend manquant) |
| Post-sale + reviews | non audité | **85% MVP** ✅ |
| Legal + RGPD + DSAR | non audité | **90% MVP** ✅ Excellent |
| Cron jobs | non audité | **80% MVP** (24 jobs, ~3 manquent) |
| Stripe Connect détaillé | partiellement | **80% MVP** (workflow OK, idempotency à durcir) |

**Total ajouté à la roadmap addendum 6** : ~2 jours dev (P0.45-46) + ~4 jours (P1.45-48) + ~2,5 jours (P2.32-34).

**Roadmap globale cumulée (7 sessions audit)** :
- **P0** (P0.1 → P0.46) : **~111 jours**
- **P1** (P1.1 → P1.48) : **~83 jours**
- **P2** (P2.1 → P2.34) : **~81,5 jours**
- → ≈ **275,5 jours dev solo** / **≈ 138 jours en parallèle (2-3 devs)** pour 100% MVP

---

## 54. SYNTHÈSE GLOBALE — État du projet Eventy après 7 sessions audit

### 54.1 Couches du projet — bilan

| Couche | Volume | Maturité MVP | Note |
|--------|--------|--------------|------|
| **Frontend wizard standard (`Etape*`)** | ~32 000 lignes | 65% | Très riche, Zod manquant, 1 deprecated orphelin |
| **Frontend Symphonie (composants flottants)** | ~40 654 lignes | 20% | UI ~100%, **0 backend** (localStorage) |
| **Frontend HRA Maisons portail** | ~16 715 lignes | 25% | Dashboard riche mock, 6 pages vides |
| **Frontend page édition** | 553 lignes | 35% | 7/17 étapes |
| **Frontend API routes Next.js** | 198 dossiers | 70% | Pattern proxy/démo, banner manquant |
| **Backend pro/travels** | ~1 800 lignes | 65% | 22 endpoints, persistance partielle |
| **Backend HRA** (HotelBlock workflow) | ~6 041 lignes | 80% | Workflow complet, frontend non branché |
| **Backend transport** | ~26 084 lignes | 85% | Très massif, frontend non branché |
| **Backend insurance + Pack Sérénité** | ~2 755 lignes | 80% | Workflow claim complet |
| **Backend finance + close-pack + FEC** | ~27 062 lignes | 85% | ⭐ Probablement la zone la mieux faite |
| **Backend marketing** | ~6 399 lignes | 70% | |
| **Backend restauration** | ~3 945 lignes | 80% | Régimes + menus + déclarations OK |
| **Backend post-sale + reviews** | ~5 373+ lignes | 85% | Très solide |
| **Backend legal + RGPD + DSAR** | ~10 559 lignes | 90% | ⭐ Excellence conformité |
| **Backend cron** | ~5 002 lignes | 80% | 24 jobs |
| **Backend Stripe Connect** | ~912 lignes | 80% | Workflow complet |
| **Backend SEO** | ~1 990 lignes | 75% | JSON-LD complet, frontend hardcoded |
| **Backend email + Brevo** | ~4 248 lignes | 70% | 34 templates, 10 manquent |
| **Backend WebSocket gateway** | ~6 080 lignes | 75% | 10 événements, 9 manquent |
| **Backend documents + signature** | ~6 053 lignes | 45% | Légaux UE 2015/2302 = STUBS |
| **Backend cancellation + refund** | ~741 lignes | 50% | Workflow OK, NO_GO orphelin |

### 54.2 Top 10 P0 priorité absolue (ordre stratégique)

1. **P0.24** — étendre `CreateTravelDtoSchema` à tous les champs `TravelFormData` (5j) — **prérequis tout autre P0**
2. **P0.10** + **P0.40** — refund auto NO_GO + Pack Sérénité override (3j) — **risque légal**
3. **P0.11** — lecture `cancellationPolicy` créateur (2j) — **bug critique 3 sources de vérité**
4. **P0.16** — cession billet L.211-11 (2j) — **obligation Code du tourisme**
5. **P0.29** — 4 documents légaux UE 2015/2302 (5-7j) — **directive UE**
6. **P0.38 + P0.39 + P0.41 + P0.45** — brancher Etape{Accommodation, Restoration, Fournisseurs, dietary} aux endpoints existants (5,5j)
7. **P0.18** + **P0.19** + **P0.20** — brancher Symphonie au backend (catalogue, comm HRA, validation) (10j)
8. **P0.30** + **P0.31** — 10 templates email + 9 événements notif manquants (5j)
9. **P0.21** — endpoint admin approve/request-changes (2j)
10. **P0.34** — notification créateur post-décision admin (1j)

### 54.3 Conclusion finale audit

> **Eventy = projet ambitieux, fondations backend solides, déficit principal côté glue frontend ↔ backend**

**Forces** :
- ✅ Fondations backend NestJS très solides (~150 000 lignes, 31 modules)
- ✅ Conformité RGPD / DSAR exceptionnelle
- ✅ Finance / FEC / TVA marge / URSSAF / APST traités sérieusement
- ✅ Workflows critiques implémentés (HotelBlock, transport-quotes, Pack Sérénité, Stripe Connect)
- ✅ Cron jobs riches avec lock + timeout
- ✅ Email Brevo + Outbox + Idempotency robustes
- ✅ WebSocket Socket.IO + JWT prod-ready
- ✅ 3 300+ tests backend

**Faiblesses critiques pour MVP** :
- ❌ Wizard frontend (32k+40k = 72k lignes) **non connecté au backend** sur les workflows critiques (HotelBlock, restaurant-blocks, transport-quotes, dietary)
- ❌ DTOs sous-dimensionnés : `CreateTravelDtoSchema` ne valide que 11/80 champs
- ❌ Symphonie 100% localStorage (40k lignes "démo")
- ❌ Page édition couvre 7/17 étapes
- ❌ Portail HRA Maisons : pages clés vides
- ❌ Documents légaux UE 2015/2302 : STUBS
- ❌ Frontend wizard 0 test
- ❌ Lazy-loading quasi inexistant (1 fichier sur 70k+ lignes)

**Stratégie recommandée** :
- **Phase 1 (~30j)** : prérequis P0.24 (DTOs étendus) + branchement wizard → backend (P0.38-46)
- **Phase 2 (~25j)** : risques légaux (P0.10, P0.11, P0.16, P0.29, P0.40)
- **Phase 3 (~20j)** : Symphonie → backend (P0.17-20)
- **Phase 4 (~15j)** : édition voyage + portail HRA (P0.32-37)
- **Phase 5 (~20j)** : tests + perf + lazy-loading (P0.25-27 + P1.32)

= **~110 jours focused** pour MVP ferme. Le reste (P1, P2) en post-MVP.

---

## 55. RÉFÉRENCES ADDENDUM 6

- `backend/src/modules/marketing/marketing.controller.ts:107-345` (15 endpoints)
- `backend/src/modules/marketing/rays.controller.ts:180-346` (Rays system)
- `backend/src/modules/restauration/restauration.controller.ts:43-340` (20 endpoints)
- `backend/src/modules/post-sale/post-sale.controller.ts` (9 endpoints + factures)
- `backend/src/modules/reviews/reviews.controller.ts` (11 endpoints + modération)
- `backend/src/modules/legal/legal.controller.ts:49-320` (acceptances + portail avocat)
- `backend/src/modules/legal/dsar.controller.ts:52-417` (DSAR RGPD complet)
- `backend/src/modules/cron/cron.service.ts` (24 `@Cron(...)` jobs)
- `backend/src/modules/cron/cron-lock.service.ts:231` + `cron-timeout.decorator.ts:96`
- `backend/src/modules/payments/stripe-connect.service.ts:69-912` (13 méthodes)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Découverte clé addendum 6** : 4 modules backend non audités initialement (legal/RGPD, restauration, marketing, cron) sont **excellents** — Eventy a très sérieusement implémenté la conformité légale/fiscale. Le module RGPD/DSAR notamment est **production-ready** (90% MVP). La maturité globale du backend est **largement au-dessus** des premières estimations.

**Verdict global après 7 sessions audit** : **~275 jours dev** (~138j en parallèle 2-3 devs) pour 100% MVP. Le projet a investi proprement les fondations ; le **gap MVP est essentiellement la glue frontend ↔ backend** (~30j) + les risques légaux ciblés (~25j) + les tests/perf (~20j) = **~75 jours focused** pour un MVP commercial ferme.

---

# 🔄 ADDENDUM 7 — Audit infrastructure profonde 2026-04-30 (sessions 8)

> Audit des modules transverses techniques de fondation :
> 56. Module **auth + 2FA + TOTP** (sécurité fondamentale)
> 57. Module **uploads + S3 + EXIF stripping** (sécurité fichiers, RGPD)
> 58. Module **bookings + waitlist** détaillé
> 59. Module **checkout** détaillé (pricing, hold-expiry, abandoned-cart, split-pay)
> 60. **Stripe Webhooks** (idempotence, signature verification, monitoring)
> 61. **Schéma Prisma global** (7 714 lignes, 236 modèles, 652 indexes — DÉCOUVERTE CRITIQUE)
>
> **Aucune ligne de code modifiée.**

---

## 56. MODULE AUTH + 2FA + TOTP

### 56.1 Architecture

**Dossier** : `backend/src/modules/auth/` — **3 992 lignes**

| Fichier | Lignes |
|---------|--------|
| `auth.controller.ts` | 652 |
| `auth.service.ts` | 878 |
| `totp.service.ts` | 701 (TOTP/2FA) |
| `security-fixes-session145.spec.ts` | 281 (tests fixs sécu) |
| Tests | 593 + 15 spec |

### 56.2 Endpoints (13 routes)

✅ **Auth de base** :
- `POST /auth/register` — création compte
- `POST /auth/login` — login
- `POST /auth/refresh` — refresh token
- `POST /auth/logout`
- `POST /auth/verify-email` + `POST /auth/resend-verification-email`
- `POST /auth/forgot-password` + `POST /auth/reset-password`
- `GET /auth/me`
- `POST /auth/change-password`

✅ **2FA TOTP** (Time-based One-Time Password) :
- `POST /auth/2fa/setup` — setup TOTP secret
- `POST /auth/2fa/verify` — vérifier code 6-digit
- `POST /auth/2fa/disable`

⭐ **`security-fixes-session145.spec.ts`** : trace de fixs sécurité historiques (signe d'audit security-review actif).

### 56.3 Synthèse auth

| Aspect | État |
|--------|------|
| Auth de base (register/login/logout/refresh) | ✅ |
| Email verification + forgot/reset password | ✅ |
| 2FA TOTP | ✅ 701 lignes (RFC 6238) |
| Tests de régression sécurité | ✅ |
| RBAC base (`UserRole`, `AdminRole`) | ✅ Cf. addendum 3 §22 |
| Session JWT + refresh | ✅ |

→ **Verdict** : zone **90% MVP-ready**. Module auth solide.

---

## 57. MODULE UPLOADS + S3 + EXIF STRIPPING

### 57.1 Architecture

**Dossier** : `backend/src/modules/uploads/` — **2 689 lignes**

| Fichier | Lignes |
|---------|--------|
| `uploads.controller.ts` | 95 |
| `uploads.service.ts` | 373 |
| `s3.service.ts` | 242 |
| `exif-stripper.ts` | ~ |
| Tests | 605 + 346 + 888 spec |

### 57.2 EXIF Stripping (sécurité/confidentialité)

**Fichier** : `exif-stripper.ts:1-60`

✅ **EXCELLENT** :
- Header explicite : *"SÉCURITÉ/CONFIDENTIALITÉ — Suppression des métadonnées EXIF (GPS, date, modèle appareil, logiciel, historique modifications)"*
- Utilise `sharp` pour re-encoder l'image sans métadonnées
- Types supportés : `image/jpeg`, `image/png`, `image/webp`
- Helper `isExifStrippableImage(mimeType)` pour vérifier compatibilité
- Fallback safe (retourne buffer original en cas d'erreur)

→ **Conformité RGPD** : protection vie privée des utilisateurs (pas de fuite GPS via photos).

### 57.3 S3 Service

`s3.service.ts:242 lignes` — abstraction storage (probablement Scaleway / AWS S3 selon `pdg-eventy/04-hebergement-infra/COMPARATIF-CLOUD.md`).

### 57.4 Synthèse uploads

| Aspect | État |
|--------|------|
| EXIF stripping (sharp) | ✅ Conformité RGPD |
| S3 service abstraction | ✅ |
| Upload controller | ✅ |
| Tests | ✅ 1 839 lignes spec |

→ **Verdict** : zone **90% MVP-ready**. Excellent point sur la confidentialité.

---

## 58. MODULE BOOKINGS + WAITLIST

### 58.1 Endpoints `bookings.controller.ts`

✅ **Workflow réservation** :
- `POST /bookings` — créer
- `POST /bookings/:bookingGroupId/rooms` — ajouter chambres
- `GET /bookings/:id`
- `GET /bookings` — liste
- `POST /bookings/:id/confirm` — confirmer
- `POST /bookings/:id/cancel` — annuler

### 58.2 Endpoints `waitlist.controller.ts`

✅ **Waitlist (liste d'attente si voyage complet)** :
- `POST /waitlist/:travelId/join`
- `GET /waitlist/:travelId/position`
- `GET /waitlist/:travelId` — liste
- `GET /waitlist/:travelId/stats`
- `POST /waitlist/:entryId/convert` — convertir en booking quand place dispo
- `DELETE /waitlist/:entryId`

✅ **Cron `handleWaitlistExpiry`** (cf. §51.2 `0 */4 * * *` toutes les 4h)

### 58.3 Endpoints `preannounce-gating.controller.ts`

→ Gate temporel : voyage marqué `preannounceDate` ne peut être réservé qu'après cette date (cf. `Travel.preannounceDate`, `Travel.bookingOpenDate`).

### 58.4 Synthèse bookings

| Aspect | État |
|--------|------|
| Booking workflow | ✅ |
| Waitlist | ✅ Complète (rejoindre, position, convert, expiry cron) |
| Pre-announce gating | ✅ |
| Booking-analytics service | ✅ |
| Tests | ✅ Spec partout |

→ **Verdict** : zone **80% MVP-ready**.

---

## 59. MODULE CHECKOUT DÉTAILLÉ

### 59.1 Architecture

**Dossier** : `backend/src/modules/checkout/` — **10 251 lignes** (très massif)

| Service | Lignes | Rôle |
|---------|--------|------|
| `checkout.service.ts` | 2 215 | Service principal |
| `pricing.service.ts` | 356 | Calcul prix |
| `hold-expiry.service.ts` | 233 | Expiration holds |
| `split-pay.service.ts` | 411 | Split paiement co-voyageurs (déjà audité §9) |
| `abandoned-cart.service.ts` | ~ | Panier abandonné |
| `cross-sell/` | dossier | Cross-sell |

### 59.2 Endpoints `checkout.controller.ts` (15 routes)

✅ **Workflow checkout complet** :
- `POST /checkout/initiate` — démarrer checkout
- `POST /checkout/groups` — créer BookingGroup
- `GET /checkout/:id/available-rooms` — chambres dispo
- `GET /checkout/:id/bus-stops` — arrêts dispo
- `GET /checkout/:id/transport-options`
- `POST /checkout/:id/transport` — choisir transport
- `POST /checkout/:id/rooms` — réserver chambres
- `POST /checkout/:id/participants` — ajouter participants
- `POST /checkout/:id/payment` — paiement final
- `PATCH /checkout/:id/insurance` — souscrire Pack Sérénité
- `GET /checkout/:id`
- `POST /checkout/:id/split-pay/invite` — inviter co-payeurs
- `GET /checkout/split-pay/:roomBookingId/progress` — suivi split
- `POST /checkout/:id/extend-hold` — étendre hold (anti-loss)
- `GET /checkout/travels/:travelId/pricing` — calcul prix dynamique

### 59.3 hold-expiry.service.ts

233 lignes dédiées à l'expiration des holds (réservations partielles). Cron `*/10 * * * *` (toutes les 10 min) libère les chambres si paiement non reçu (cf. §51.2 cron `INVARIANT 7` : ne pas annuler si paidAmountCents > 0).

### 59.4 abandoned-cart.service.ts + reminder cron

**Cron** : `0 * * * *` (chaque heure) → `handleAbandonedCartReminder()` — relance email panier abandonné.

### 59.5 Synthèse checkout

| Aspect | État |
|--------|------|
| Workflow checkout multi-step | ✅ 15 endpoints |
| Pricing service | ✅ |
| Hold-expiry + cron | ✅ |
| Split-pay (co-voyageurs) | ✅ Cf. §9 |
| Insurance souscription au checkout | ✅ |
| Abandoned cart reminder | ✅ |
| Cross-sell | ✅ Sous-dossier dédié |
| Tests | ✅ 632 + 866 + 683 + 1060 spec |

→ **Verdict** : zone **85% MVP-ready**. Module très solide.

---

## 60. STRIPE WEBHOOKS

### 60.1 Architecture

**Fichier** : `backend/src/modules/payments/webhook.controller.ts:147+`

✅ **EXCELLENT — Sécurité webhook** :

**Fix sécurité historique** :
- *"SECURITY FIX (Session 145 — CRITIQUE #6): rawBody DOIT exister"* (l.154)
- Avant : `Buffer.from('')` si rawBody undefined → signature HMAC vide → **bypass possible**
- Maintenant : reject immédiat si rawBody manquant

**Vérification signature** :
- `stripeService.constructWebhookEvent(rawBody, signature)` (l.167)
- Throw `BadRequestException` si signature invalide

**Idempotency** :
- Création `prisma.stripeEvent` avec contrainte unique `stripeEventId`
- Catch `P2002` (unique violation) → event déjà traité, skip
- Commentaire : *"L'ancien upsert avec update:{} ne bloquait PAS le double traitement"* (fix LOT 166)

**Failure tracking** :
- Si processing échoue → `processedAt = null` → cron monitoring détecte events non traités → alerte admin
- Retour 200 à Stripe pour éviter retries inutiles (event déjà enregistré idempotent)

### 60.2 Events handlés

✅ Visibles :
- `payment_intent.succeeded` → `handlePaymentIntentSucceeded()`
- `checkout.session.completed` → `handleCheckoutSessionCompleted()`
- `charge.refunded` → `handleChargeRefunded()`

→ Probablement plus (à creuser).

### 60.3 Synthèse Stripe Webhooks

| Aspect | État |
|--------|------|
| RawBody check (anti-misconfiguration) | ✅ |
| Signature HMAC verification | ✅ |
| Idempotency via `stripeEvent` Prisma (contrainte unique) | ✅ |
| Failure tracking (`processedAt = null`) | ✅ |
| Cron monitoring events non traités | ✅ |
| Tests webhook | ✅ Spec présent |
| Events handlés | ✅ 3+ détectés (à creuser) |

→ **Verdict** : zone **90% MVP-ready**. Sécurité production-ready, fixs historiques sérieux.

---

## 61. SCHÉMA PRISMA GLOBAL — DÉCOUVERTE CRITIQUE

### 61.1 Statistiques

**Fichier** : `backend/prisma/schema.prisma`

- **7 714 lignes** total
- **236 modèles** (`grep "^model"`)
- **233 enums** (`grep "^enum"`)
- **652 indexes / unique constraints** (`@@index`, `@@unique`)

→ Schéma **immense**, parmi les plus gros que j'ai vus.

### 61.2 🔥 PROBLÈME CRITIQUE — Migrations non versionnées

**Fichier** : `backend/.gitignore:47`

```
prisma/migrations/
```

→ **Le dossier `prisma/migrations/` est gitignoré**.

**Réalité visible** :
```
backend/prisma/migrations/
├── 20260324_restauration_passagers_v2/
└── 20260329_transport_schedule_propagation/
```

→ **Seulement 2 dossiers de migration** alors que le schéma fait 7 714 lignes / 236 modèles.

### 61.3 Conséquences

🔥 **Risques production** :

1. **Pas d'historique** : impossible de retracer les changements DB depuis le début
2. **Pas de roll back** : si une migration casse la prod, **pas de rollback automatique**
3. **Pas de reproductibilité** : impossible de recréer la DB exacte à un moment donné (qualité audit / bug investigation)
4. **CI/CD compromis** : `prisma migrate deploy` ne peut pas s'exécuter automatiquement
5. **Onboarding dev cassé** : nouveau dev ne peut pas mettre en place sa DB locale identique à la prod
6. **Drift schéma** : risque que `prisma db push` ait été utilisé en prod direct (avec dataloss potentiel)

🔥 **Cohérence** :
- 7 714 lignes de schema, 236 modèles, 652 indexes → projet sérieux
- **MAIS** seulement 2 migrations en git → soit usage `db push`, soit migrations supprimées du repo

### 61.4 Hypothèses

**Hypothèse A** : Le projet utilise `prisma db push` en dev/prod (pas recommandé en prod).

**Hypothèse B** : Les migrations sont stockées ailleurs (autre repo, ou en local du serveur prod).

**Hypothèse C** : Phase early prototype où les migrations sont régénérées au besoin.

→ Quelle qu'elle soit, c'est un **risque MVP commercial**. Pour passer en prod, il faut :
- Démarrer migrations propres (`prisma migrate dev --create-only`)
- Versionner `prisma/migrations/` (retirer du `.gitignore`)
- Documenter rollback strategy
- Mettre `prisma migrate deploy` en CI/CD

### 61.5 Modèles importants détectés (incomplet)

Modèles vus dans les audits précédents (sample) :
- **User**, **ProProfile**, **AdminRole**
- **Travel**, **TravelGroup**, **TravelOccurrence**, **TravelTeamMember**, **TravelStopLink**, **TravelActivityCost**, **TravelHistory**
- **BookingGroup**, **RoomBooking**, **PaymentContribution**, **BookingTransfer**
- **HotelBlock**, **HotelPartner**, **RestaurantPartner**, **HotelRoomAllocation**
- **Cancellation**, **Refund**, **DisputeHold**
- **InsuranceClaim**, **InsuranceClaimDocument**, **InsurancePolicy**
- **DSARRequest**, **DataErasureLog**, **LegalDocument**, **LegalAcceptance**
- **Document**, **DocumentSignature**
- **EmailOutbox**, **OutboxMessage**
- **StripeEvent**, **PaymentInviteToken**
- **PreReservation**, **PreResRoomAssignment**
- **WaitlistEntry**
- **Review**, **ReviewReport**
- **AuditLog**, **GoDecisionLog**, **NoGoNotification**
- **MarketingCampaign**, **QrCode**, **Lead**, **RaysWallet**
- **MealConfig**, **MenuDuJour**, **DietaryPreference**
- **TvaMarginCalc**, **TvaAuditEntry**
- **BankAccount**, **BankImport**

→ **Sample de ~50 modèles** mentionnés sur **236 totaux** → richesse métier confirmée.

### 61.6 Synthèse Prisma

| Aspect | État |
|--------|------|
| Schéma Prisma | ✅ 7 714 lignes / 236 modèles / 233 enums / 652 indexes |
| Richesse métier | ✅ Très complète (voyage + booking + HRA + insurance + finance + legal + marketing + comm) |
| Migrations versionnées en git | ❌ **CRITIQUE** : `.gitignore:47` ignore `prisma/migrations/` |
| Migrations actuelles visibles | ⚠️ Seulement 2 dossiers |
| Stratégie roll back | ❓ Indéterminée |
| Reproductibilité DB | ❌ Compromise |

→ **Verdict** : zone **40% MVP-ready** (schéma ✅ excellent, mais **migrations non versionnées = bloquant prod**).

---

## 62. NOUVEAUX TODOs PRIORITAIRES (issus addendum 7)

### 🔴 P0 — BLOQUANT MVP / RISQUE PROD

| # | Tâche | Effort |
|---|-------|--------|
| P0.47 | **Versionner `prisma/migrations/`** : retirer du `.gitignore`, créer migration baseline depuis schéma actuel via `prisma migrate diff`, intégrer `prisma migrate deploy` au CI/CD | M (2j) |
| P0.48 | **Stratégie rollback DB** documentée + scripts de roll back par migration | S (1j) |

### 🟠 P1 — IMPORTANT

| # | Tâche | Effort |
|---|-------|--------|
| P1.49 | Inventaire complet des 236 modèles Prisma (lien doc + diagramme ER) | L (3j) |
| P1.50 | Snapshot DB hebdo dans S3 (au cas où migration manuelle a corrompu) | S (1j) |

### 🟡 P2 — POST-MVP

| # | Tâche | Effort |
|---|-------|--------|
| P2.35 | Migration script anti-drift (compare schema.prisma vs DB réelle) | S (1j) |
| P2.36 | Tests E2E sur webhook Stripe replay (scénarios fail/retry) | M (1.5j) |

### 📊 Mise à jour tableau récap MVP global

| Bloc | Avant addendum 7 | Après audit complémentaire |
|------|------------------|----------------------------|
| Module auth + 2FA | non audité | **90% MVP** ✅ |
| Module uploads + EXIF | non audité | **90% MVP** ✅ |
| Module bookings + waitlist | non audité | **80% MVP** |
| Module checkout détaillé | partiellement | **85% MVP** |
| Stripe Webhooks | partiellement | **90% MVP** ✅ |
| **Schéma Prisma + migrations** | non audité | **40% MVP** 🔥 (migrations non versionnées) |

**Total ajouté à la roadmap addendum 7** : ~3 jours dev (P0.47-48) + ~4 jours (P1.49-50) + ~2,5 jours (P2.35-36).

**Roadmap globale cumulée (8 sessions audit)** :
- **P0** (P0.1 → P0.48) : **~114 jours**
- **P1** (P1.1 → P1.50) : **~87 jours**
- **P2** (P2.1 → P2.36) : **~84 jours**
- → ≈ **285 jours dev solo** / **≈ 142 jours en parallèle (2-3 devs)** pour 100% MVP

---

## 63. INVENTAIRE FINAL DES 8 SESSIONS D'AUDIT

### 63.1 Volume audité

| Type | Volume | % du projet |
|------|--------|-------------|
| Frontend wizard standard (`Etape*`) | 32 000 lignes | ✅ Audité |
| Frontend Symphonie (80 fichiers) | 40 654 lignes | ✅ Audité |
| Frontend HRA Maisons (40+ pages) | 16 715 lignes | ✅ Audité |
| Frontend page édition voyage | 553 lignes | ✅ Audité |
| Frontend API routes Next.js (198 dossiers) | — | ✅ Pattern auditée |
| Frontend Symphonie aussi | — | — |
| Backend pro/travels | 1 800 lignes | ✅ Audité |
| Backend HRA | 6 041 lignes | ✅ Audité |
| Backend transport | 26 084 lignes | ✅ Audité |
| Backend insurance | 2 755 lignes | ✅ Audité |
| Backend finance | 27 062 lignes | ✅ Audité |
| Backend marketing | 6 399 lignes | ✅ Audité |
| Backend restauration | 3 945 lignes | ✅ Audité |
| Backend post-sale + reviews | 5 373+ lignes | ✅ Audité |
| Backend legal + RGPD + DSAR | 10 559 lignes | ✅ Audité |
| Backend cron | 5 002 lignes | ✅ Audité |
| Backend Stripe Connect + Webhooks | 912 lignes + webhook | ✅ Audité |
| Backend SEO | 1 990 lignes | ✅ Audité |
| Backend email + Brevo | 4 248 lignes | ✅ Audité |
| Backend WebSocket gateway | 6 080 lignes | ✅ Audité |
| Backend documents + signature | 6 053 lignes | ✅ Audité |
| Backend cancellation + refund | 741 lignes | ✅ Audité |
| Backend auth + 2FA + TOTP | 3 992 lignes | ✅ Audité |
| Backend uploads + S3 + EXIF | 2 689 lignes | ✅ Audité |
| Backend bookings + waitlist | ~ | ✅ Audité |
| Backend checkout (10 251 lignes) | 10 251 lignes | ✅ Audité |
| Schéma Prisma | 7 714 lignes / 236 modèles | ✅ Audité |
| **TOTAL audité** | **~250 000+ lignes** | **~95% du projet** |

### 63.2 Modules backend NON audités (~5%)

À auditer en P2 si besoin :
- `health` (monitoring health checks)
- `users` (user management détaillé)
- `client` (portail client backend)
- `public` (catalog public)
- `groups` (TravelGroup détaillé)
- `support` (tickets clients)
- `exports` (PDF / CSV / Excel exports)
- `pro/runbook`
- Sous-modules pro (`pro/messagerie`, `pro/payment-links`, `pro/dashboard`, etc.)

### 63.3 Frontend portails NON audités (~80% du frontend)

Le frontend Eventy compte **1 118 pages** sur **32 portails** distincts (cf. `CLAUDE.md`). Sessions précédentes ont couvert :
- ✅ Portail Pro / Créateur — wizard de création (focus principal)
- ✅ Portail Maisons HRA — partiel (dashboard + reservations)
- ✅ Portail Public — fiche voyage publique (partiel)
- ✅ Portail Client — annulation réservation, page checkout

À auditer en sessions futures (si besoin) :
- ❌ **Portail Admin** (275 pages) — finance, monitoring, RBAC, sécurité
- ❌ **Portail Équipe** (98 pages) — 14 cockpits Pôles internes
- ❌ **Portail Jeux** (26 pages gamification avancée)
- ❌ **Portail Ambassadeur** (23 pages revendeurs)
- ❌ **18 Portails Métiers** (chauffeur, accompagnateur, photographe, traiteur, transporteur, voyageur, animateur, assureur, avocat, comptable, coordinateur, decorateur, fleuriste, guide, restaurateur, staff)

### 63.4 Couverture cible audit

→ **Audit ciblé créateur de voyage** = **complet**. Tous les flux essentiels à la création d'un voyage Eventy ont été parcourus.

→ **Audit autres portails** (admin, équipe, métiers) = à programmer en sessions séparées si nécessaire.

---

## 64. RECOMMANDATIONS FINALES — ROADMAP MVP COMMERCIAL

### 64.1 Stratégie 4 phases (~110 jours focused)

**Phase 0 — Bloquant prod (3j)** :
- P0.47 : Versionner migrations Prisma + baseline + CI/CD
- P0.48 : Stratégie rollback DB

**Phase 1 — Persistance & glue (~30j)** :
- P0.24 : Étendre `CreateTravelDtoSchema` à tous les champs (5j)
- P0.38, 39, 41, 45 : Brancher Etape{Accommodation, Restoration, Fournisseurs, dietary} aux endpoints (5,5j)
- P0.18, 19, 20 : Brancher Symphonie au backend (catalogue, comm HRA, validation) (10j)
- P0.30, 31 : 10 templates email + 9 événements notif (5j)
- P0.21 : Endpoint admin approve/request-changes (2j)
- P0.34 : Notification créateur post-décision admin (1j)
- P0.42 : Banner "Mode démo" Next.js (1j)

**Phase 2 — Risques légaux (~25j)** :
- P0.10 + P0.40 : Refund auto NO_GO + Pack Sérénité override (3j)
- P0.11 : Lecture cancellationPolicy créateur (2j)
- P0.16 : Cession billet L.211-11 (2j)
- P0.29 : 4 documents légaux UE 2015/2302 (5-7j)
- P0.6 : Option voyage à date unique (1j)
- P0.5 : Modèle 82/18 PDG (2j)
- P0.8 : TVA marge calculée + affichée (2j)

**Phase 3 — UX & édition (~20j)** :
- P0.1 + P0.2 : Bouton soumission/publication + statut (1,5j)
- P0.33 : Aligner page édition aux 17 étapes (2j)
- P0.32 : Implémenter `reservations/page.tsx` HRA (2j)
- P0.36 : 5 pages HRA squelettes (3j)
- P0.4 : Catalogue personnel créateur backend (5j)
- P0.7 : Création nouvel HRA depuis wizard (2j)

**Phase 4 — Tests, perf, qualité (~30j)** :
- P0.27 : E2E Playwright workflow complet (3j)
- P0.25, 26 : Lazy-load Symphonie + Etape* (4j)
- P0.28 : Trigger automatique onboarding (1j)
- P1.32 : Coverage tests minimum 50% wizard (5j+)
- P1.31 : Mesure Lighthouse / Web Vitals (1j)
- P0.46 : Idempotency-key Stripe transfer (1j)

### 64.2 Total révisé pour MVP commercial ferme

= **~108 jours focused** (sans les P1/P2)

→ **Avec 2-3 devs en parallèle** = **~50-60 jours calendaires**

### 64.3 Risques / inconnues restants

⚠️ Non couverts par l'audit :
- Charge / scalabilité DB
- Sécurité périmètre (firewall, WAF, DDoS)
- Backups / disaster recovery
- Monitoring Datadog/Sentry/New Relic
- Plan continuité activité (BCP)
- Audit security-review formel par cabinet externe (avant prod)

→ Ces points sont **hors périmètre wizard** mais à prévoir avant lancement commercial.

---

## 65. RÉFÉRENCES ADDENDUM 7

- `backend/src/modules/auth/auth.controller.ts:151-594` (13 endpoints)
- `backend/src/modules/auth/totp.service.ts:701 lignes`
- `backend/src/modules/uploads/exif-stripper.ts:1-60`
- `backend/src/modules/uploads/s3.service.ts:242 lignes`
- `backend/src/modules/bookings/bookings.controller.ts:53-176` (6 endpoints)
- `backend/src/modules/bookings/waitlist.controller.ts:72-225` (6 endpoints)
- `backend/src/modules/checkout/checkout.controller.ts:145-491` (15 endpoints)
- `backend/src/modules/checkout/hold-expiry.service.ts:233 lignes`
- `backend/src/modules/payments/webhook.controller.ts:147-216` (Stripe webhooks)
- `backend/prisma/schema.prisma:7 714 lignes / 236 modèles / 233 enums / 652 indexes`
- `backend/.gitignore:47` (`prisma/migrations/` ignoré — **🔥 critique**)

---

**Audit terminé. Aucune ligne de code modifiée.**

**Découverte clé addendum 7** : 🔥 **Les migrations Prisma sont gitignored** (`backend/.gitignore:47`). Pour un schéma de **7 714 lignes / 236 modèles / 652 indexes**, c'est un **risque prod majeur** : pas d'historique DB, pas de roll back automatique, CI/CD compromis. **P0.47 est la PREMIÈRE chose à faire avant tout déploiement commercial**.

Pour le reste, l'addendum confirme la maturité du projet : auth/2FA, uploads/EXIF, bookings, checkout, Stripe Webhooks sont tous **production-ready**.

**Verdict global après 8 sessions audit** :
- **Couverture audit** : ~250 000+ lignes (~95% du projet création voyage)
- **Roadmap MVP commercial ferme** : **~108 jours focused** (50-60 jours calendaires avec 2-3 devs en parallèle)
- **Prérequis absolu prod** : versionner `prisma/migrations/` (P0.47, 2j)
- **Faiblesse principale** : glue frontend ↔ backend, pas backend lui-même

L'audit est désormais **exhaustif** pour le périmètre "création voyage". Les autres portails (admin, équipe, 18 métiers) sont à auditer séparément si besoin.
