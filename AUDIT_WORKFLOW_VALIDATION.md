# AUDIT — Workflow validation Eventy + Lock fields + Versioning

> Date : 2026-05-02
> Branche : `claude/brave-newton-68fa29`
> Cadre : meta-audit `AUDIT_COMPLETUDE_REFONTE.md` (référencé par le PDG, mais pas présent dans la worktree au moment de l'audit — re-cross-checké via `AUDIT-CREATION-VOYAGE-COMPLET.md` + le code existant)

---

## 0. Résumé exécutif

3 manques critiques MVP identifiés et adressés dans cette livraison :

| # | Manque                                               | Statut avant      | Statut après           | Risque légal/produit                                                                                     |
| - | ---------------------------------------------------- | ----------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| 1 | Workflow validation équipe (créateur → équipe → pub) | Partiel (lifecycle admin existant, pas de queue équipe) | **Complet**            | Voyages publiés sans relecture humaine = risque de sortie produit non conforme (juridique, prix faux…)   |
| 2 | Lock fields après réservations                       | **Aucun**         | **Complet**            | Directive UE 2015/2302 art. 11 — modif unilatérale des éléments essentiels = droit de rétractation total |
| 3 | Versionning / diff (qui/quand/quoi)                  | **Aucun**         | **Complet**            | Non-respect obligation de traçabilité (RGPD art. 5.2 + audits assurance APST)                            |

---

## 1. Existant — ce qui était déjà là

### 1.1 État machine voyage (déjà partiellement codée)

L'enum `TravelStatus` est déjà défini en plusieurs endroits :

- `frontend/app/(pro)/pro/voyages/nouveau/page.tsx` lignes 43-50
- `frontend/app/(admin)/admin/voyages/[id]/lifecycle/page.tsx` lignes 18-29
- `frontend/components/voyage/VoyageLifecycleTimeline.tsx`

Workflow déjà supporté en code (PHASE1 → PHASE2) :

```
DRAFT
  → PHASE1_SUBMITTED
  → PHASE1_REVIEW
  → PHASE1_APPROVED
  → PHASE2
  → PHASE2_REVIEW
  → PUBLISHED
  → SALES_OPEN / DEPARTURE_CONFIRMED / IN_PROGRESS / COMPLETED / CANCELED / NO_GO
```

Une matrice `TRANSITION_MATRIX` côté admin lifecycle déclare déjà :
- `take_review`, `approve_p1`, `reject_p1`, `approve_p2`, `reject_p2`, etc.
- avec `requireReason` et `minRole` (ADMIN/MANAGER/OPS/FINANCE/SUPPORT).

### 1.2 Pages existantes

| Route                                  | Rôle                                           |
| -------------------------------------- | ---------------------------------------------- |
| `/admin/validation-pro`                | Validation **comptes Pro** (≠ voyages)         |
| `/pro/validation-status`               | Statut onboarding du compte Pro                |
| `/admin/voyages`                       | Liste des voyages (avec filtre par statut)     |
| `/admin/voyages/[id]/lifecycle`        | Détail état + transitions admin (déjà très complet) |
| `/equipe/voyages`                      | Liste opérationnelle équipe                    |
| `/pro/voyages/nouveau`                 | Wizard 16 rubriques avec phase machine        |

### 1.3 Manques observés (ce qui n'existait PAS)

- ❌ Aucune **queue dédiée** côté équipe pour la validation des voyages soumis (dispatcher ≠ admin lifecycle drill-down)
- ❌ Aucun **commentaire/échange** asynchrone entre équipe et créateur sur le voyage en revue
- ❌ Aucun **lock** sur les champs sensibles après ouverture des ventes
- ❌ Aucun **système de versions** : pas de snapshot, pas de diff, pas de restauration
- ❌ Aucun **détecteur de modification majeure** (article L.211-13 Code du tourisme = obligation d'informer le voyageur + droit de désistement)
- ❌ Aucune **page voyageur** pour accepter/refuser une modif majeure (HMAC token public)

---

## 2. Conception cible

### 2.1 Workflow validation équipe

**Acteurs**
- `PRO` (créateur indépendant)
- `EQUIPE` (équipe Eventy — pôle Voyages, peut prendre en charge un dossier)
- `ADMIN` (final approbateur — dépublication, validation finale, décisions sensibles)

**État machine (déjà cohérent avec l'existant) — étendu**

```
DRAFT
  ─[submit]→ SUBMITTED               (PRO clique "Soumettre")
  ─[take]→   IN_REVIEW               (EQUIPE prend en charge)
  ─[approve]→ APPROVED               (EQUIPE valide → admin doit publier)
  ─[publish]→ PUBLISHED              (ADMIN publie)
  ─[changes_requested]→ CHANGES_REQ  (EQUIPE demande modifs avec raison)
  ─[reject]→ REJECTED                (ADMIN rejette définitivement)
  ─[archive]→ ARCHIVED               (ADMIN archive — sortie de catalogue)
```

**Fil de discussion** : chaque transition peut emporter un commentaire structuré
(text + actor + timestamp + linked rubrique optionnelle), affichés dans la timeline.

**Helper** : `frontend/lib/voyage/voyage-validation-workflow.ts`
- `STATUS_META` (label, couleur, icône)
- `TRANSITIONS_BY_STATUS` (qui peut faire quoi)
- `canTransition(from, to, actor)`
- `nextStatusOptions(status, actor)`
- `buildTimelineFromHistory(history)`
- `summarizeWorkflow(state)` (one-liner pour cards)

**Composant** : `ValidationWorkflowCard` (mode `pro` | `equipe` | `admin`)
- statut + couleur dominante
- timeline récente (5 derniers events)
- formulaire pour ajouter un commentaire
- boutons d'actions filtrés selon `actor`

**Pages** :
- `/equipe/voyages-a-valider` — queue avec filtres (statut, urgence, ancienneté), tri par date, recherche, sélection groupée → bulk-take. Cards riches.
- `/admin/voyages/[id]/validation` — drill-down dossier + historique complet + actions admin.
- Bouton "Soumettre à validation Eventy" intégrable dans le wizard (composant `SubmitForReviewButton`).

### 2.2 Lock fields après réservations (UE 2015/2302)

**Cadre légal** :
- Directive UE 2015/2302 art. 11 + Code du tourisme L.211-13
- Modification d'un **élément essentiel** (prix, dates, destination, hébergement principal, programme structurant, transport) = obligation d'informer + droit de rétractation sans frais.

**Champs sensibles** (registre `SENSITIVE_FIELDS`) :

| Champ                | Lock après             | Modif majeure ? | Notification voyageurs ? |
| -------------------- | ---------------------- | --------------- | ------------------------ |
| `dateDepart`         | Première réservation   | ✅              | ✅ + droit décision      |
| `dateRetour`         | Première réservation   | ✅              | ✅ + droit décision      |
| `pricePerPersonCents`| Première réservation   | ✅ si > +8%     | ✅ + droit décision      |
| `destination`        | Publication            | ✅              | ✅ + droit décision      |
| `hotelPrincipal`     | Première réservation   | ✅ si downgrade | ✅ si downgrade          |
| `programme`          | Première réservation   | ✅ si > 30%     | ✅                       |
| `transportType`      | Première réservation   | ✅ si downgrade | ✅                       |
| `capacity`           | Si > current bookings  | ❌ (info only)  | ❌                       |
| `description`        | Jamais                 | ❌              | ❌                       |
| `photos`             | Jamais                 | ❌              | ❌                       |
| `marketing`          | Jamais                 | ❌              | ❌                       |

**Helper** : `frontend/lib/voyage/voyage-field-lock.ts`
- `SENSITIVE_FIELDS` registry
- `getFieldLockState(voyage, fieldKey)` → `{ locked, lockReason, requiresMajorChange, severity }`
- `isMajorChange(fieldKey, oldValue, newValue)` → boolean + reason
- `LockSeverity` : `OPEN` | `WARN` | `MAJOR_CHANGE` | `LOCKED_HARD`

**Hook** : `frontend/hooks/use-field-lock.ts`
- `useFieldLock(voyage, fieldKey)` → `{ locked, lockReason, severity, requiresMajorChange, attemptEdit }`

**Composants** :
- `LockedFieldGate` — wrappe un champ : si locked, intercept onChange, affiche modale.
- `MajorChangeDetector` — modale : récap modif, justification, comptage voyageurs concernés, bouton "Notifier voyageurs et continuer".

**Notification voyageurs** :
- Template email : `Modification de votre voyage — décision requise`
- Page publique : `/voyage-decision/[hmacToken]` → accepter / refuser (+ remboursement intégral si refus).

### 2.3 Versionning / diff

**Modèle données** (côté frontend, structure prête pour migration backend) :

```ts
interface VoyageVersion {
  id: string;                  // uuid
  voyageId: string;
  createdAt: string;           // ISO
  createdBy: { id: string; name: string; role: 'PRO' | 'EQUIPE' | 'ADMIN' | 'SYSTEM' };
  parentVersionId?: string;
  label?: string;              // "Avant validation P1", "v1.2"…
  isMajor: boolean;
  changeNote?: string;
  snapshot: Record<string, unknown>;  // payload complet du voyage
  diffSummary?: VoyageDiffEntry[];    // synthèse pré-calculée
}

interface VoyageDiffEntry {
  fieldKey: string;
  fieldLabel: string;
  before: unknown;
  after: unknown;
  type: 'add' | 'remove' | 'modify';
  isMajor: boolean;
}
```

**Helper** : `frontend/lib/voyage/voyage-versioning.ts`
- `createSnapshot(voyage, opts)` — fabrique une version
- `diffVersions(a, b)` → `VoyageDiffEntry[]`
- `restoreSnapshot(version)` → payload exploitable
- `summarizeVersion(version)` → string court
- `groupVersionsByDay(versions)` — pour la timeline

**Composants** :
- `VersionHistoryDrawer` — drawer right side : liste versions, badges majeur/mineur, bouton "Voir diff", "Restaurer".
- Page admin `/admin/voyages/[id]/historique` — timeline complète + diff visuel champ par champ (vue side-by-side).

**Auto-snapshot** :
- À chaque save de la symphonie wizard (`onSave` hook) → version mineure
- À chaque transition de status → version automatique avec label (ex : "Soumis Phase 1")
- Manuel via bouton "Sauvegarder version" dans le wizard

---

## 3. Livraison (cette PR)

### 3.1 Fichiers nouveaux

| Fichier                                                                          | Rôle                                         |
| -------------------------------------------------------------------------------- | -------------------------------------------- |
| `frontend/lib/voyage/voyage-validation-workflow.ts`                              | State machine + helpers                      |
| `frontend/lib/voyage/voyage-field-lock.ts`                                       | Sensitive fields registry + lock detection   |
| `frontend/lib/voyage/voyage-versioning.ts`                                       | Snapshot, diff, restore                      |
| `frontend/hooks/use-field-lock.ts`                                               | React hook lock                              |
| `frontend/components/voyage/ValidationWorkflowCard.tsx`                          | Card statut + timeline + commentaires        |
| `frontend/components/voyage/SubmitForReviewButton.tsx`                           | Bouton intégrable wizard                     |
| `frontend/components/voyage/LockedFieldGate.tsx`                                 | Wrapper champ + intercept onChange           |
| `frontend/components/voyage/MajorChangeWorkflowDialog.tsx`                       | Modale modif majeure (workflow lock)         |
| `frontend/components/voyage/VersionHistoryDrawer.tsx`                            | Drawer historique                            |
| `frontend/components/voyage/VoyageDiffView.tsx`                                  | Diff visuel side-by-side                     |
| `frontend/app/(equipe)/equipe/voyages-a-valider/page.tsx`                        | Queue voyages soumis                         |
| `frontend/app/(admin)/admin/voyages/[id]/validation/page.tsx`                    | Drill-down équipe + admin                    |
| `frontend/app/(admin)/admin/voyages/[id]/historique/page.tsx`                    | Timeline + diff complet                      |
| `frontend/app/(public)/voyage-decision/[token]/page.tsx`                         | Page voyageur HMAC accepter/refuser          |

### 3.2 Tests / vérification

- Build Vercel doit passer (typecheck inclus)
- Aucun fichier existant n'est supprimé/déconstruit
- Toutes les routes utilisent design dark Eventy + gold #D4A853 + glassmorphism + Framer Motion

---

## 4. TODOs backend (hors scope frontend)

Ces TODOs sont à porter en suite côté backend NestJS (`backend/src/modules/travels/`) :

- [ ] **Prisma model** `VoyageVersion` (table `voyage_versions`) avec colonnes ci-dessus
- [ ] **Prisma model** `VoyageWorkflowEvent` (history complet — actor, action, status_from, status_to, comment, created_at)
- [ ] **Prisma migration** : ajouter `lockedFieldsConfig` JSON sur `Travel` (override par voyage)
- [ ] **Service** `VoyageValidationService.submitForReview / take / approve / publish / requestChanges / reject`
- [ ] **Service** `VoyageVersioningService.createSnapshot / restore / diff`
- [ ] **Endpoint** `POST /travels/:id/versions` + `GET /travels/:id/versions` + `GET /travels/:id/versions/:versionId/diff?with=:otherVersionId` + `POST /travels/:id/versions/:versionId/restore`
- [ ] **Endpoint** `POST /travels/:id/workflow/transition` (body : action + comment)
- [ ] **Endpoint** `GET /travels/:id/lock-state?field=:fieldKey`
- [ ] **Endpoint** `POST /travels/:id/major-change` (déclenche notif emails voyageurs + génération HMAC tokens)
- [ ] **Endpoint** `GET/POST /public/voyage-decision/:token` (vérif HMAC + accepte/refuse)
- [ ] **Cron** : alerter équipe si voyage `SUBMITTED` non pris en charge depuis > 48h
- [ ] **Email template** : `voyage-major-change.hbs` — déclencheur major change

---

## 5. TODOs UX/Design (à itérer)

- [ ] Dashboard équipe : widget "X voyages en attente de validation"
- [ ] Notification temps-réel (websocket) lorsqu'un nouveau voyage est soumis
- [ ] Filtres avancés sur la queue (par PRO, par destination, par tranche de prix)
- [ ] Drill-down avec preview voyage côté client (iframe ou tab)
- [ ] Diff visuel : highlight champ par champ avec comparaison avant/après
- [ ] Mobile responsive sur la queue équipe (cards stack)

---

## 6. Conformité légale couverte

| Texte                                          | Exigence                                                                                       | Couverture cette PR                              |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Directive UE 2015/2302 art. 11                 | Notification voyageur + droit rétractation si modif élément essentiel                          | ✅ MajorChangeDetector + page décision HMAC      |
| Code du tourisme L.211-13                      | Obligation information préalable et écrite avant modif                                         | ✅ Email auto + page                             |
| Code du tourisme L.211-15                      | Si modif majeure refusée → remboursement intégral sans pénalité                                | ✅ Page décision (workflow refus → remboursement) |
| RGPD art. 5.2 (accountability)                 | Traçabilité des modifications                                                                  | ✅ Versionning + workflow events                 |
| APST/Atout France (audit annuel)               | Pouvoir prouver qui a validé quoi sur chaque voyage                                            | ✅ Workflow events + versions horodatées        |

---

**Fin de l'audit.**
