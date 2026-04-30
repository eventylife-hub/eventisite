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
