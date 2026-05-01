# AUDIT — Plannings de voyages (Admin & Équipe)

> **Demande PDG (David, 2026-04-30)** : audit en profondeur des plannings de voyages côté **Admin** et **Équipe**.
> Objectifs :
> - État des voyages **semaine par semaine** (quantité, détails)
> - Filtres : par **localité**, par **zone**, statut, créateur, places restantes…
> - Au clic d'un voyage : panel de contrôle complet (modifier, suivre, intervenir)
> - Vue d'ensemble globale **réductible/expansible**

Ce document recense **ce qui existe déjà**, **ce qui manque**, et les **TODOs concrets** placés dans le code (`// TODO Eventy: …`).

> **Mise à jour 2026-05-02** : implémentation livrée en 18 commits. Voir §7 — État d'avancement.

---

## 1. INVENTAIRE — pages existantes

### 1.1 Côté ADMIN

| Page | Chemin | Rôle |
|---|---|---|
| Catalogue voyages | `frontend/app/(admin)/admin/voyages/page.tsx` (≈2735 l) | Liste maître des voyages : 8 onglets (Catalogue, Urgents, P1, P2, Publiés, En cours, Terminés, Annulés), 3 vues (Dense / Confort / Grille), filtres pays/gamme/statut/pôle/pro, sélection multiple + bulk actions, side panel détail (5 sections), timeline départs, raccourcis clavier. |
| **Planning Global** | `frontend/app/(admin)/admin/planning/page.tsx` (≈2128 l) | Centre opérationnel : **5 vues** (jour/semaine/mois/trimestre/Gantt), filtres avancés (statut/gamme/destination/pro/équipe), presets, alertes globales, conflits HRA détectés, KPIs (cette semaine, ce mois, remplissage, alertes, CA, prochain départ), 24 quick-links, side panel avec workflow + checklist + HRA + transport + hébergement. |
| Détail / Hub contrôle voyage | `frontend/app/(admin)/admin/voyages/[id]/page.tsx` (≈944 l) | Panneau de pilotage par voyage : workflow V309 (machine à états), 4 KPIs (réservations, CA, occupation, paiements), stats panel (fill rate / revenus / NPS), sales detail panel (ventes hebdo, paiements timeline, options), 4 sections de cartes : Validation, Gestion, Terrain, Suivis (15+ sous-pages). |
| Contrôle terrain | `…/[id]/controle/page.tsx` (≈399 l) | Live ops : bus en route, RollCall (appel), incidents en cours, contacts chauffeurs. |
| Appel nominal | `…/[id]/controle/appel/page.tsx` | Roll-call clients par bus. |
| Incidents | `…/[id]/controle/incidents/page.tsx` | Signalements terrain. |
| Override admin | `…/[id]/controle/override/page.tsx` | Force-modifications. |
| Coût détail | `…/[id]/cout-detail/page.tsx` | Calculateur 82/18, marge, répartition Stripe. |
| Documents | `…/[id]/documents/page.tsx` | Signatures, contrats, CGV. |
| Feedback | `…/[id]/feedback/page.tsx` | NPS, avis, notation pro. |
| Finance | `…/[id]/finance/page.tsx` (≈561 l) | Paiements, factures, soldes. |
| Go/No-Go | `…/[id]/go-no-go/page.tsx` | Checklist J-0. |
| HRA | `…/[id]/hra/page.tsx` | Hôtel/Resto/Activités confirmées. |
| Lifecycle | `…/[id]/lifecycle/page.tsx` (≈603 l) | Audit log + transitions. |
| Réservations | `…/[id]/reservations/page.tsx` | Liste clients inscrits. |
| Rooming | `…/[id]/rooming/page.tsx` | Affectation chambres. |
| Santé | `…/[id]/sante/page.tsx` | Score global 6 modules. |
| Transport (voyage) | `…/[id]/transport/page.tsx` | Manifeste bus du voyage. |
| Création voyage | `…/voyages/creer/page.tsx` (+ 10 étapes) | Wizard de création. |
| Board NoGo | `…/voyages/nogo-board/page.tsx` | Board des voyages bloqués. |
| Risques | `…/voyages/risques/page.tsx` | Carto des risques. |
| Thèmes | `…/voyages/themes/page.tsx` | Tags/Thèmes. |
| Statistiques voyages | `…/statistiques/voyages/page.tsx` | Dashboards data. |
| **Transport — Planning** | `…/transport/planning/page.tsx` (≈618 l) | Calendrier trajets bus/avion : assignations chauffeurs, véhicules, conflits. |
| **Pension — Planning** | `…/pension/planning/page.tsx` (≈266 l) | Comparatif 4 types pension, conflits activités. |

### 1.2 Côté ÉQUIPE

| Page | Chemin | Rôle |
|---|---|---|
| Voyages à gérer | `frontend/app/(equipe)/equipe/voyages/page.tsx` (≈878 l) | Liste filtrable (statut), 6 KPIs, panel performance ventes (CA/remplissage/options/NPS), bouton détail "Ouvrir" + "Coûts" + "Actions". **Aucune vue calendrier.** |
| **Planning équipe** | `frontend/app/(equipe)/equipe/planning/page.tsx` (≈566 l) | **Vue semaine uniquement** — grille 7 jours × 12 heures, événements VOYAGE/RÉUNION/FORMATION/CONGE/ASTREINTE, filtre par membre + type. |
| Planning des départs | `frontend/app/(equipe)/equipe/voyage/planning/page.tsx` (≈137 l) | Liste de **4 départs en dur** + filtres confirmé/en attente/problème. Très minimaliste. |
| Symphonies en cours | `…/voyages/symphonies-en-cours/page.tsx` | Voyages en cours de création par les pros (assistance, validation). |
| Cockpit symphonies | `…/symphonies-en-cours/cockpit/page.tsx` (≈664 l) | Cockpit live des créations. |
| Dashboard symphonies | `…/symphonies-en-cours/dashboard/page.tsx` (≈494 l) | Synthèse symphonies. |
| Alertes symphonies | `…/symphonies-en-cours/alertes/page.tsx` | Alertes blocage création. |
| Bracelets production | `…/symphonies-en-cours/bracelets-production/page.tsx` | Production bracelets. |
| Modération avis | `…/symphonies-en-cours/moderation-avis/page.tsx` | Modération. |
| Validation queue | `…/symphonies-en-cours/validation-queue/page.tsx` | File de validation. |
| Assister créateur | `…/[voyageId]/assister/page.tsx` | Aide live à un créateur. |
| Review voyage | `…/[voyageId]/review/page.tsx` | Review équipe. |
| Coût détail (équipe) | `…/voyages/[id]/cout-detail/page.tsx` | Coûts vue équipe. |
| Activités — planning | `…/equipe/activites/planning/page.tsx` | Planning activités. |

---

## 2. ANALYSE par page — critères du PDG

Légende : ✅ présent · ⚠️ partiel · ❌ absent

| Page | Vue calendrier sem./mois | Filtres localité / zone / statut / créateur / places rest. | Drill-down panel contrôle complet | Vue d'ensemble réductible/expansible |
|---|:---:|:---:|:---:|:---:|
| **admin/voyages** | ❌ (Dense / Confort / Grille uniquement, pas de calendrier) | ⚠️ Pays ✅, Gamme ✅, Statut ✅, Pôle ✅, Pro ✅, **Zone ❌**, **Places restantes ❌**, **Période/semaine ❌** | ⚠️ Side panel 5 sections (Vue globale, Tâches, Occurrences, Réservations, Stats) — pas d'actions admin "punch" type forcer-modif/transférer/annuler-avec-refund | ❌ pas de collapse/expand global |
| **admin/planning** | ✅ Jour / Semaine / Mois / Trimestre / **Gantt** | ⚠️ Statut ✅, Gamme ✅, Destination ✅, Pro ✅, Équipe ✅, **Zone ❌**, **Places restantes ❌**, presets ✅ | ⚠️ Panel détaillé avec HRA, transport, hébergement, checklist, alertes — actions limitées à un toast `onAction(...)` non câblé API | ⚠️ Alertes globales toggle ✅, mais pas de collapse par voyage |
| **admin/voyages/[id]** | n/a (page voyage spécifique) | n/a | ✅ Hub complet : workflow V309, 4 sections cartes, 15+ sous-pages, KPIs + 2 panels stats | ⚠️ Pas de quick-actions "punch" en haut (forcer modif, transférer, annuler+refund) |
| **admin/voyages/[id]/controle** | n/a | n/a | ✅ Bus, RollCall, incidents, contacts | ⚠️ Manque interventions admin (re-routing, urgence, marquer absent → SAV auto) |
| **admin/transport/planning** | ✅ Calendrier trajets sem./mois | ⚠️ Mode (BUS/AVION/VAN) ✅, Statut ✅, **Zone ❌**, **Voyage source ❌** | ⚠️ Détail trajet — pas de drill-down vers le voyage source | ❌ |
| **admin/pension/planning** | ✅ Comparaison journée | ⚠️ Type pension uniquement | ❌ pas de drill-down voyage | ❌ |
| **equipe/voyages** | ❌ Liste seule | ⚠️ Statut ✅, search ✅, **Zone ❌**, **Localité ❌**, **Période ❌**, **Places restantes ❌** | ❌ "Ouvrir" pointe vers `/equipe/voyage/:id` qui n'a pas un panel de contrôle équivalent à l'admin | ❌ |
| **equipe/planning** | ⚠️ Semaine uniquement | ⚠️ Type événement + membre, **Zone ❌**, **Localité ❌**, voyages affichés comme événements 1-jour (faux : un voyage dure plusieurs jours) | ❌ Blocs non cliquables, pas de panel | ❌ Pas de jour/mois/trimestre |
| **equipe/voyage/planning** | ❌ Liste 4 départs en dur | ⚠️ Statut uniquement, **Zone/Localité/Période ❌** | ❌ "Detail" pointe vers `/equipe/voyage/:id` — panel non équivalent admin | ❌ |

---

## 3. CE QUI MANQUE (synthèse)

### 3.1 Vues calendrier manquantes

- **admin/voyages** : aucune vue calendrier (uniquement Dense/Confort/Grille). À ajouter : `ViewMode = 'calendar' | 'timeline'` (semaine/mois) directement dans la page, synchronisée avec `/admin/planning` (mêmes filtres, mêmes données).
- **equipe/voyages** : aucune vue calendrier — la page est purement liste.
- **equipe/planning** : uniquement vue semaine. Manque jour, mois, trimestre, vue par membre (1 personne × 4 semaines).
- **equipe/voyage/planning** : ne comporte qu'une liste statique de 4 départs — pas de calendrier du tout.
- **Vue heatmap** (intensité voyages × remplissage par semaine × zone) absente partout. Demandée par David pour repérer d'un coup d'œil les semaines surchargées ou creuses.
- **Vue année** (12 mois sur 1 page) absente — utile pour planification stratégique annuelle.

### 3.2 Filtres incomplets

| Filtre | admin/voyages | admin/planning | equipe/voyages | equipe/planning |
|---|:---:|:---:|:---:|:---:|
| Localité (pays / ville) | ✅ Pays | ✅ Destination | ⚠️ search seulement | ❌ |
| **Zone géographique** (Europe Sud, Maghreb, Asie, Amériques…) | ❌ | ❌ | ❌ | ❌ |
| Statut | ✅ | ✅ | ✅ | ⚠️ type événement |
| Créateur (pro) | ✅ | ✅ | ⚠️ search | n/a |
| Places restantes (range) | ❌ | ❌ | ❌ | ❌ |
| Période / fenêtre temporelle (S+0, S+1, M+1) | ❌ | navigation cursor | ❌ | navigation cursor |
| Taux remplissage | tri ✅, filtre ❌ | ❌ | ❌ | ❌ |
| Niveau de risque | onglet "Urgents" ✅ | tri ✅ | alertes ✅ visualisation | ❌ |
| Avec/sans guide assigné | ❌ | ❌ | ❌ | ❌ |
| Alertes oui/non | ❌ | toggle global ✅ | colonne ✅ filtre ❌ | ❌ |
| Conflits HRA | n/a | détecté ✅ | ❌ | ❌ |
| Presets sauvegardés | ❌ | ✅ (3 presets) | ❌ | ❌ |

**Action :** créer un dictionnaire `ZONES_GEO` partagé (`frontend/lib/geo-zones.ts` à créer) et l'injecter dans tous les filtres pages voyages.

### 3.3 Panel de contrôle au clic — actions manquantes

Le hub `/admin/voyages/[id]` est très complet (workflow V309, 4 sections × 15+ cartes, stats + ventes panels, sous-pages dédiées). **Mais il manque un bandeau d'actions admin "punch" en haut de page** :

- **Forcer modification** sur voyage publié (override avec audit log)
- **Annuler avec remboursement automatique** (refund Stripe batch + email clients)
- **Transférer à un autre pro créateur** (re-assignation avec migration historique)
- **Reporter de N jours** (shift toutes occurrences avec emails clients automatiques)
- **Ajouter une nouvelle occurrence** (date) sans refaire la création
- **Forcer Go** (override checklist J-7 si conditions non remplies — décision manuelle PDG)
- **Quick-call urgence** : appel direct pro + accompagnateur en 1 clic
- **Onglet "suivi semaine par semaine"** (S-12 → S-0 : ventes/sem, encaissements/sem, alertes/sem, trajectoire commerciale)

Dans `admin/planning` le side-panel `VoyagePanel` ne fait que des `toast onAction(...)` non câblés — il faut brancher sur l'API admin.

Côté **équipe**, `/equipe/voyage/:id` n'existe pas en tant que panel équivalent admin filtré sur les actions équipe (suivi terrain, communication, intervention, GoNoGo, incidents) sans les actions purement admin (delete, transfer, force-publish).

### 3.4 KPIs manquants

| KPI | admin/voyages | admin/planning | equipe/voyages |
|---|:---:|:---:|:---:|
| Voyages actifs / total | ✅ | ✅ | ✅ |
| Remplissage moyen | ✅ | ✅ | ⚠️ via panel |
| Départs ce mois | ✅ | ✅ | ❌ |
| CA | ✅ | ✅ | ✅ |
| Voyages urgents | ✅ | ⚠️ | ❌ |
| **Taux remplissage par ZONE** | ❌ | ❌ | ❌ |
| **Voyages par SEMAINE** (12 prochaines, sparkline) | ❌ | ❌ | ❌ |
| **Capacité utilisée par PRO** (top 5 chargés) | ❌ | ❌ | ❌ |
| **CA prévisionnel rolling 90j** | ❌ | ❌ | ❌ |
| Conflits HRA détectés | n/a | ✅ | ❌ |
| Trajets sans chauffeur | n/a | n/a | n/a (admin/transport/planning ❌) |

### 3.5 Actions admin manquantes (au-delà du panel)

- **Bulk operations** sur sélection multiple : `admin/voyages` a la barre de bulk (Publier/Archiver/Exporter/Supprimer) mais **pas** : transférer en lot, reporter en lot, annuler + refund en lot.
- **Drag & drop** d'un voyage entre 2 jours dans la vue semaine pour reporter (avec confirmation + emails auto).
- **Détection automatique de conflits** : `admin/planning` détecte les conflits HRA (✅) mais pas : conflits transport (même bus 2 trajets), conflits hébergement (même hôtel double-booké), conflits créateur (1 pro sur 3 voyages simultanés).
- **Intervention live terrain** : `admin/voyages/[id]/controle` ne propose pas de boutons "déclencher protocole urgence" / "ré-router le bus en live" / "marquer voyageur absent → SAV auto".
- **Gestion d'occurrences** : il n'y a pas de page dédiée à la gestion des dates de départ d'un voyage (ajouter / supprimer / dupliquer / déplacer une occurrence). Cf. `SectionOccurrences` dans le side panel d'admin/voyages qui montre les occurrences mais ne permet d'en ajouter.

---

## 4. RECOMMANDATIONS — TODOs placés dans le code

Tous les TODOs sont préfixés `// TODO Eventy: …`. Aucun fichier n'a été supprimé ou refactoré — uniquement des **commentaires ajoutés**.

### 4.1 TODOs placés (par fichier)

| Fichier | Nb TODOs | Sujets |
|---|---:|---|
| `frontend/app/(admin)/admin/voyages/page.tsx` | 6 | Vue calendrier/timeline manquante, sort key `placesRestantes`, dictionnaire `ZONES_GEO`, filtre période, brancher API admin, vue réductible |
| `frontend/app/(admin)/admin/planning/page.tsx` | 5 | ViewMode `annee`/`heatmap`, statuts `annule`/`reporte`, filtres zone/places/semaine/risque, KPIs par zone + sparkline 12 sem., actions admin "punch" du panel, WeekView limites |
| `frontend/app/(admin)/admin/voyages/[id]/page.tsx` | 1 | Bandeau quick-actions admin + onglet "suivi semaine par semaine" |
| `frontend/app/(admin)/admin/voyages/[id]/controle/page.tsx` | 1 | Actions intervention admin (urgence, re-routing, absent → SAV, GPS) |
| `frontend/app/(admin)/admin/transport/planning/page.tsx` | 1 | Filtres zone, drill-down vers voyage, vue par voyage, KPI sans-chauffeur, heatmap flotte |
| `frontend/app/(admin)/admin/pension/planning/page.tsx` | 1 | Drill-down voyage, filtre zone, vue semaine par voyage, alerte menu manquant |
| `frontend/app/(equipe)/equipe/voyages/page.tsx` | 4 | Toggle Liste/Calendrier, zone géo, filtres temporels, panel équipe équivalent à `/admin/voyages/[id]` |
| `frontend/app/(equipe)/equipe/planning/page.tsx` | 4 | Modèle voyage multi-jours, vues jour/mois/membre, filtres zone/remplissage/statut, blocs cliquables → side panel |
| `frontend/app/(equipe)/equipe/voyage/planning/page.tsx` | 1 | Vue calendrier, filtres, KPIs, drill-down checklist, branchement API |

### 4.2 Pages à CRÉER (ne pas modifier l'existant)

Recommandation : créer ces fichiers **seulement après validation PDG**.

| Page à créer | Chemin proposé | Rôle |
|---|---|---|
| Composant partagé calendrier | `frontend/components/voyages/CalendarViews.tsx` | Extraire `WeekView` / `MonthView` / `QuarterView` / `GanttView` de `admin/planning/page.tsx` pour réutilisation côté équipe et `admin/voyages` |
| Dictionnaire zones géo | `frontend/lib/geo-zones.ts` | `ZONES_GEO`, `countryToZone()`, `zoneLabel()`, drapeaux/couleurs partagées |
| Quick-actions admin | `frontend/components/admin/AdminQuickActionsBar.tsx` | Bandeau actions punch (forcer modif, transférer, annuler+refund, reporter, ajouter occurrence, force go, urgence) |
| Panel contrôle équipe | `frontend/app/(equipe)/equipe/voyage/[id]/page.tsx` | Hub équipe filtré sur intervention terrain (équivalent admin sans actions destructives) |
| KPIs zone × semaine | `frontend/components/admin/KpisZoneSemaine.tsx` | `<KpisSemaineParZone />` + `<SparkLineSemaines weeks={12} />` |
| Heatmap voyages | `frontend/components/admin/VoyagesHeatmap.tsx` | Intensité par semaine × zone × taux remplissage |
| Gestion occurrences | `frontend/app/(admin)/admin/voyages/[id]/occurrences/page.tsx` | Add/edit/delete/duplicate dates de départ |
| Suivi sem. par sem. | `frontend/app/(admin)/admin/voyages/[id]/suivi-hebdo/page.tsx` | Trajectoire S-12 → S-0 par voyage |

### 4.3 Améliorations sans création (TODOs en place)

- Ajouter `Calendar` / `Timeline` dans le toggle de vues de `admin/voyages/page.tsx` (réutiliser `CalendarViews.tsx` une fois extrait).
- Ajouter le filtre `activeZone` dans `admin/voyages` et `admin/planning` (même API : `Set<ZoneCode>`).
- Brancher les `onAction(...)` du panel de `admin/planning` sur l'API admin réelle (aujourd'hui = toast).
- Ajouter sur le `VoyageRowDense` / `VoyageRowComfort` un indicateur visuel "places restantes" + countdown départ déjà calculés mais pas filtrables.
- Côté équipe : transformer `equipe/planning/page.tsx` pour que les blocs VOYAGE s'étendent sur plusieurs colonnes (départ → retour) au lieu d'un seul jour, et soient cliquables.

---

## 5. PRIORITÉS D'EXÉCUTION (suggestion)

Classement P0 → P3 selon impact PDG / dette tech.

| P | Action | Impact | Effort |
|:---:|---|:---:|:---:|
| **P0** | Créer `lib/geo-zones.ts` + ajouter filtre zone partout | 🔥🔥🔥 | S |
| **P0** | Brancher `onAction(...)` du panel `admin/planning` sur API admin | 🔥🔥🔥 | M |
| **P0** | Ajouter quick-actions admin (forcer modif / annuler+refund / transférer / reporter) sur `admin/voyages/[id]` | 🔥🔥🔥 | M |
| **P1** | Extraire `CalendarViews.tsx` partagé + l'ajouter dans `admin/voyages` et `equipe/voyages` | 🔥🔥 | M |
| **P1** | Filtres "période" (S+0, S+1, S+2, M+1) + "places restantes" dans `admin/voyages` et `equipe/voyages` | 🔥🔥 | S |
| **P1** | Modèle voyage multi-jours + cliquable dans `equipe/planning` | 🔥🔥 | S |
| **P1** | KPIs par zone × semaine (composant `KpisZoneSemaine`) | 🔥🔥 | M |
| **P2** | Page gestion occurrences `[id]/occurrences` | 🔥 | M |
| **P2** | Heatmap voyages (12 sem × zone × remplissage) | 🔥 | M |
| **P2** | Panel équipe `/equipe/voyage/[id]` équivalent admin filtré | 🔥 | L |
| **P3** | Drag & drop report voyage entre 2 jours | ✨ | L |
| **P3** | Vue année (12 mois sur 1 page) | ✨ | M |
| **P3** | Détection auto conflits transport / hébergement / créateur (en plus de HRA) | ✨ | M |

---

## 6. NOTES

- L'âme d'Eventy demande que **chaque ligne respire la chaleur et le service** (cf. `AME-EVENTY.md`). Les actions "punch" (annuler + refund, reporter, urgence) doivent rester accessibles **mais protégées par confirmation explicite** (modal "êtes-vous sûr ?") pour éviter les fausses manips qui briseraient la confiance des voyageurs.
- Eventy = marketplace SaaS (cf. mémoire `project_equipe_roles.md`) : l'équipe interne pilote, les créateurs sont indépendants. Les actions "transfert pro" et "annulation forcée" doivent toujours laisser une **trace audit log** + **notification automatique au pro concerné** (le pro est partenaire, pas employé).
- Le PDG (David) demande une **vue d'ensemble réductible/expansible** : interpréter ça comme :
  1. Bandeau alertes globales pliable (✅ déjà fait dans `admin/planning`)
  2. Sections KPIs pliables (à ajouter)
  3. Cartes voyage pliables avec leurs occurrences (à créer)
  4. Side panel détail (✅ déjà fait — gardons cette UX)

---

_Audit généré le 2026-04-30. Tous les TODOs sont en place dans le code (préfixe `// TODO Eventy:`)._

---

## 7. ÉTAT D'AVANCEMENT (mise à jour 2026-05-02)

Implémentation livrée en **18 commits** sur la branche `claude/inspiring-pascal-76b5bb` (frontend `master` + `main` + bumps repo principal).

### 7.1 Composants partagés créés

| Composant | Chemin | Statut |
|---|---|:---:|
| Dictionnaire zones géo | `frontend/lib/geo-zones.ts` | ✅ |
| Calendrier voyages | `frontend/components/voyage/VoyagesCalendarView.tsx` | ✅ |
| Heatmap KPIs zone × sem | `frontend/components/admin/KpisZoneSemaine.tsx` | ✅ |
| Quick-actions admin | `frontend/components/admin/AdminQuickActionsBar.tsx` | ✅ |
| Live interventions terrain | `frontend/components/admin/LiveInterventionsBar.tsx` | ✅ |
| Quick-actions équipe | `frontend/components/equipe/EquipeQuickActionsBar.tsx` | ✅ |

### 7.2 Pages mises à jour

| Page | Améliorations livrées | Statut |
|---|---|:---:|
| `admin/voyages/page.tsx` | ViewMode 'calendar', filtres zone/période/places restantes, sort places, indicateurs zone+restantes dans rows | ✅ |
| `admin/planning/page.tsx` | KPIs zone × sem (heatmap 12 sem), filtre zone, AdminQuickActionsBar dans panel, ViewMode 'annee' (12 mois), statuts 'annule'/'reporte', WeekView expand all + indicateurs zone+remplissage | ✅ |
| `admin/voyages/[id]/page.tsx` | AdminQuickActionsBar + cartes "Dates de départ" et "Suivi hebdomadaire" | ✅ |
| `admin/voyages/[id]/controle/page.tsx` | LiveInterventionsBar (6 actions terrain temps réel) | ✅ |
| `admin/transport/planning/page.tsx` | Filtre zone géo (départ/destination), drill-down voyage, badges zone | ✅ |
| `admin/pension/planning/page.tsx` | Filtre zone, drill-down voyages affectés | ✅ |
| `equipe/voyages/page.tsx` | Toggle Liste/Calendrier, 3 filtres zone/période/places, KPIs zone | ✅ |
| `equipe/planning/page.tsx` | Voyages multi-jours (joursDuree), drill-down side-panel, filtre zone | ✅ |
| `equipe/voyage/planning/page.tsx` | Toggle Liste/Calendrier, 6 KPIs, filtres zone/période, drill-down | ✅ |
| `equipe/voyage/[id]/page.tsx` | EquipeQuickActionsBar + badge zone géo | ✅ |

### 7.3 Pages CRÉÉES

| Nouvelle page | Chemin | Rôle | Statut |
|---|---|---|:---:|
| Gestion occurrences | `app/(admin)/admin/voyages/[id]/occurrences/page.tsx` | Add/edit/duplicate/delete dates de départ + shift en lot | ✅ |
| Suivi hebdomadaire | `app/(admin)/admin/voyages/[id]/suivi-hebdo/page.tsx` | Trajectoire S-12 → S-0 + benchmark historique | ✅ |

### 7.4 Priorités initiales — bilan

| P | Action | Statut |
|:---:|---|:---:|
| **P0** | Créer `lib/geo-zones.ts` + ajouter filtre zone partout | ✅ |
| **P0** | Brancher actions du panel `admin/planning` (via AdminQuickActionsBar) | ✅ |
| **P0** | Quick-actions admin (forcer modif / annuler+refund / transférer / reporter) sur `admin/voyages/[id]` | ✅ |
| **P1** | Extraire `CalendarViews.tsx` partagé + l'ajouter dans `admin/voyages` et `equipe/voyages` | ✅ |
| **P1** | Filtres "période" (S+0, S+1, S+2, M+1) + "places restantes" | ✅ |
| **P1** | Modèle voyage multi-jours + cliquable dans `equipe/planning` | ✅ |
| **P1** | KPIs par zone × semaine (composant `KpisZoneSemaine`) | ✅ |
| **P2** | Page gestion occurrences `[id]/occurrences` | ✅ |
| **P2** | Heatmap voyages (12 sem × zone × remplissage) — intégré dans `KpisZoneSemaine` | ✅ |
| **P2** | Panel équipe `/equipe/voyage/[id]` équivalent admin filtré | ✅ |
| **P3** | Vue année (12 mois sur 1 page) | ✅ |
| **P3** | Drag & drop report voyage entre 2 jours | ⏳ |
| **P3** | Détection auto conflits transport / hébergement / créateur (en plus de HRA) | ⏳ |

### 7.5 Restant à faire

**Câblage API (placeholders)** : toutes les actions `AdminQuickActionsBar`, `LiveInterventionsBar`, `EquipeQuickActionsBar` et la page `occurrences` loggent + toast en attendant les endpoints backend (`POST /admin/travels/:id/{action}`, `POST /admin/travels/:id/interventions/{id}`, `POST /admin/travels/:id/occurrences/shift`, etc.).

**P3 reportés** :
- Drag & drop report voyage entre 2 jours dans `WeekView`
- Détection automatique conflits transport (même bus 2 trajets), hébergement (double-booking hôtel), créateur (1 pro sur 3 voyages simultanés)
- Vue "membre" 4 semaines dans `equipe/planning`
- API tracking GPS externe (placeholder dans `LiveInterventionsBar`)

### 7.6 Commits livrés

1. `6d6bac85` Foundation : `lib/geo-zones.ts` + TODOs audit
2. `17560ce9` admin/voyages : filtres zone/période/places + tri
3. `ce8a78d6` `VoyagesCalendarView` + intégration admin/voyages
4. `8f15d609` admin/planning : KPIs zone × sem + filtre zone
5. `352c4803` `AdminQuickActionsBar` + intégration voyages/[id]
6. `c71045c7` equipe/voyages : calendar + filtres + KPIs zone
7. `a380c224` equipe/planning : multi-jours + drill-down + zone
8. `53892c2f` admin/planning : `AdminQuickActionsBar` dans panel
9. `50fcbe33` admin/transport/planning : filtre zone + drill-down
10. `65934f6d` admin/pension/planning : filtre zone + drill-down
11. `dc572ed5` `LiveInterventionsBar` + intégration controle
12. `8d9a9452` equipe/voyage/planning : calendar + filtres + KPIs
13. `11542e97` equipe/voyage/[id] : `EquipeQuickActionsBar` + zone
14. `dbeb9b30` admin/voyages/[id]/occurrences : nouvelle page
15. `aa508b4e` admin/voyages/[id]/suivi-hebdo : nouvelle page
16. `983472a7` admin/planning : vue année + statuts annule/reporte
17. `30abdc98` admin/planning : WeekView expand all + indicateurs
18. `245e4ed8` admin/voyages : indicateurs places restantes + zone

---

_Mise à jour 2026-05-02. Implémentation livrée — câblage API restant à brancher selon priorités backend._
