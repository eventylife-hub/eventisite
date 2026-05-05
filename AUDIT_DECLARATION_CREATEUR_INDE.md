# Audit — Mécanisme de déclaration d'incident côté Créateur & Indépendant

> Date : 2026-05-05 · auteur : Claude (mandaté par David PDG)
> Périmètre : système de déclaration d'incident depuis le terrain (indé) ou le portail (créateur)
> But : recenser l'existant + proposer des améliorations actionnables

---

## 1. Existant — Cartographie

### 1.1 Pages existantes

| Portail | Route | Fichier | Lignes | Statut |
|---|---|---|---|---|
| **Pro** | `/pro/incidents` | `app/(pro)/pro/incidents/page.tsx` | 459 | Lecture · filtres · timeline. Pas de formulaire de déclaration |
| **Pro** | `/pro/voyages/[id]/terrain/incidents` | `app/(pro)/pro/voyages/[id]/terrain/incidents/page.tsx` | 766 | Déclaration terrain live (géoloc · catégories ISO 31030) |
| **Équipe** | `/equipe/incidents` | `app/(equipe)/equipe/incidents/page.tsx` | 385 | Command center temps réel · SLA timers · actions rapides |
| **Équipe** | `/equipe/risques/incidents` | — | — | Incidents par risques |
| **Équipe** | `/equipe/securite/incidents-voyageurs` | — | — | Incidents voyageurs |
| **Équipe** | `/equipe/tech/incidents` | — | — | Incidents tech |
| **Indépendant** | — | **AUCUNE PAGE** | — | ❌ Zéro page de déclaration côté indé |

### 1.2 Composants existants

| Composant | Fichier | Lignes | Rôle |
|---|---|---|---|
| `<EmergencyButton>` | `components/EmergencyButton.tsx` | 205 | Bouton sticky 24/7 · géoloc · deeplink hotline · `reportUrl` custom |
| `<IncidentCard>` | `components/IncidentCard.tsx` | 216 | Card visuelle incident (gravité · statut · timeline) |
| `<IncidentTimeline>` | `components/IncidentTimeline.tsx` | 94 | Timeline des actions |
| `<CrisisWarRoom>` | `components/CrisisWarRoom.tsx` | 231 | Vue crisis mode (multi-incidents simultanés) |
| `<RunbookViewer>` | `components/RunbookViewer.tsx` | 307 | Affichage procédures d'escalade |
| `<IncidentPlaybook>` | — | — | Admin playbooks |

### 1.3 Helpers / lib

| Helper | Fichier | Lignes | Rôle |
|---|---|---|---|
| Types & filtres | `lib/incidents-management.ts` | 485 | Severity P0-P3 · Category (9) · TypeCode (50+) · stats |
| Escalade & SLA | `lib/incidents-escalation.ts` | 220 | SLA timers · triggers crisis mode · plans notification |
| Runbooks | `lib/incidents-runbooks.ts` | 934 | Procédures détaillées par type/sévérité |
| Demo data | `lib/incidents-demo.ts` | 188 | Données de test |
| Quick actions API | `lib/equipe-quick-actions-api.ts` | 53 | Client `POST /equipe/voyages/:id/actions/:actionId` |
| Match assurance | `lib/insurance-claim-matcher.ts` | 350 | NEW Push 39 : incident → polices à activer |

### 1.4 Backend

- ✅ Module **support** (`backend/src/modules/support/`) : tickets support (workflow OPEN → IN_PROGRESS → RESOLVED → CLOSED).
- ✅ Module **insurance** : claims service complet (workflow SUBMITTED → UNDER_REVIEW → APPROVED → PAID).
- ✅ Webhook **transport** : `POST /webhooks/airport-transfer/:quoteId/incident` (uniquement transferts aéroport).
- ❌ **PAS de module `incidents` dédié** — endpoints `POST /incidents` manquants.
- ❌ Stub `equipe-quick-actions.controller.ts` mentionne `signaler-incident` mais incomplet.

---

## 2. Diagnostic

### Ce qui marche
- Pages **lecture** incidents Pro & Équipe avec filtres riches.
- Modélisation **types** très détaillée (50+ TypeCode · 9 catégories · 4 sévérités).
- **SLA timers + escalade** auto en frontend (pas backend).
- **EmergencyButton réutilisable** avec géoloc + deeplink téléphonique.
- **Page terrain créateur** déjà bien faite (766 lignes) pour déclarer en live.

### Ce qui manque (priorité créateur/indé)

1. **Zéro point d'entrée déclaration côté indépendant** — l'indé sur le terrain ne peut PAS déclarer un incident depuis son portail.
2. **Backend `POST /incidents`** absent — pas de persistance API · pas de routage.
3. **Wizard mobile-first** : pas de UI 3-écrans optimisée smartphone.
4. **Transcription vocale** non implémentée (utile pour indé qui ne peut pas taper en plein incident).
5. **Mode offline** absent — un indé en zone basse couverture perd sa déclaration.
6. **Templates pré-remplis** côté créateur : zéro choix rapide selon type incident.
7. **Notifications cross-portail** : créateur n'est PAS notifié auto quand son indé déclare.
8. **Synergie incidents ↔ assurances ↔ conciergerie** : matcher (Push 39) existe mais pas branché à la création d'incident.

---

## 3. Propositions — Plan d'amélioration

### Phase 1 — Foundations (Push 40-41)

- **Helper `lib/incident-declaration.ts`** — domain logic pour orchestrer le flow déclaration (création locale → upload photos → sync API → trigger matcher assurance).
- **Composant `<DeclarationWizardMobile>`** — wizard 3 écrans premium (Type → Description vocale/texte → Photos), mobile-first, gros boutons, peu de saisie.
- **Page `/independant/declarer-incident`** — refonte premium dark + ivoire + accents urgence.

### Phase 2 — Routes & branchements (Push 42)

- **`/pro/incidents` enrichi** — vue temps réel + actions rapides (appeler indé, escalader, contacter voyageur, déclarer assurance) + templates pré-remplis selon type.
- **`<EmergencyButton>` enrichi** — sticky permanent en mode "voyage actif" indé.
- **Notification cross-portail** : indé déclare → équipe + créateur reçoivent push (mock pour MVP).

### Phase 3 — Backend & sync (hors scope V2 frontend)

- Module backend `incidents` avec entité Prisma (id, type, severity, status, location, photos, voiceTranscript, declaredBy, declaredAt, voyageId, indieId, creatorId).
- Endpoints `POST /incidents/declare` + `GET /incidents/me` + `WebSocket /incidents/live`.
- Webhook auto matcher : incident créé → matcher Push 39 → suggestion claim → équipe valide.

### Phase 4 — UX & robustesse

- **Mode offline** : sauvegarde IndexedDB + sync background quand réseau revient.
- **Transcription vocale** : Web Speech API en fallback · Whisper API si dispo.
- **PWA** : install prompt sur mobile pour indés terrain.
- **AI suggestion type incident** depuis description (NLP côté serveur).

---

## 4. Glossaire (pour créateur/indé non-jargon)

| Mot technique | À dire au créateur/indé |
|---|---|
| Incident | Problème · souci |
| Déclaration | Signalement |
| Sinistre | Dossier assurance |
| Severity P0/P1/P2/P3 | Très grave / Grave / Moyen / Léger |
| Coverage | Garantie |
| SLA | Délai de réponse |

Le wizard mobile utilise le langage simple (« J'ai un problème » → catégorie visuelle → description ou photos → envoyé).

---

## 5. Suivi

| Push | Contenu | Statut |
|---|---|---|
| 39 | `lib/insurance-claim-matcher.ts` | ✅ `b044c6f6` |
| 40 | `lib/incident-declaration.ts` + audit doc | À pousser |
| 41 | `<DeclarationWizardMobile>` + page indé | À pousser |
| 42 | `/pro/incidents` enrichi + `<EmergencyButton>` v2 | À pousser |
| 43+ | Backend incidents + insurance-claim-builder | À planifier |

— Audit livré le 2026-05-05 · à mettre à jour après chaque push.
