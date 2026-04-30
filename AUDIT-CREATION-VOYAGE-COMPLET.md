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

**Audit terminé. Aucune ligne de code modifiée.**

**Prochaine action recommandée** (validation PDG requise) : démarrer P0.1 (bouton soumission) + P0.3 (notif HRA) + P0.4 (catalogue créateur) en parallèle.
