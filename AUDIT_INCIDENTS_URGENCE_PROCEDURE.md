# 🚨 AUDIT — Procédure Incidents & Urgence Eventy

**Date** : 2026-05-05
**Auteur** : PDG IA — David Eventy
**Scope** : Procédure complète de gestion des incidents et urgences côté équipe Eventy + admin + créateur + indépendant + voyageur
**Objectif #1** : **SÉCURITÉ DES VOYAGEURS** — rattraper en urgence n'importe quelle situation, partout dans le monde, 24/7

---

## 📋 Sommaire

1. [Contexte philosophique Eventy](#1-contexte-philosophique-eventy)
2. [Audit de l'existant](#2-audit-de-lexistant)
3. [Catalogue exhaustif des incidents possibles](#3-catalogue-exhaustif-des-incidents-possibles)
4. [Procédure de gestion d'incident](#4-procédure-de-gestion-dincident)
5. [Architecture des pages livrées](#5-architecture-des-pages-livrées)
6. [Helpers techniques livrés](#6-helpers-techniques-livrés)
7. [Composants UI livrés](#7-composants-ui-livrés)
8. [Mode CRISE — War Room](#8-mode-crise--war-room)
9. [Backlog technique TODO Eventy](#9-backlog-technique-todo-eventy)
10. [Plan d'activation et SLA](#10-plan-dactivation-et-sla)

---

## 1. Contexte philosophique Eventy

> *« Le client doit se sentir aimé. »* — AME-EVENTY.md
>
> *« Pack Sérénité : Quoi qu'il arrive, on s'en occupe. Annulation, rapatriement, bagages perdus, souci médical — le voyageur ne gère rien. On gère pour lui. »*

### Modèle d'intervention

```
┌────────────────────────────────────────────────────────────────────┐
│                      MODÈLE D'INTERVENTION                          │
│                                                                      │
│   Niveau 0 : Indépendant terrain (résolution immédiate)             │
│             ↓ (échec après SLA — 5 à 30 min selon gravité)          │
│   Niveau 1 : Créateur du voyage (organise, mobilise réseau local)   │
│             ↓ (échec après SLA — 15 min à 2h)                       │
│   Niveau 2 : Équipe Eventy 24/7 (cellule support + astreinte)       │
│             ↓ (escalade si vie en danger ou impact >10 voyageurs)   │
│   Niveau 3 : Admin / PDG (cellule de crise)                         │
│             ↓ (mobilisation totale)                                  │
│   Niveau 4 : Mode CRISE + War Room + Concierge Luxe 24/7            │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

**Principe directeur** : Les créateurs gèrent leurs indépendants et leurs voyages. Eventy intervient JUSTE en cas de problème — mais quand on intervient, on intervient avec **toute la puissance** de la plateforme. Pas de bricolage. Pas d'attente. **Action immédiate, traçable, documentée.**

---

## 2. Audit de l'existant

### Ce qui existe déjà (préservé, jamais supprimé)

| Page / fichier | Couverture | Lacune identifiée |
|---|---|---|
| `app/(admin)/admin/incidents/page.tsx` | Liste fiches incidents (récurrence indé, décisions WARN/SUSPEND/TERMINATE) | ❌ Pas d'overview KPI PDG, pas de heatmap, pas de SLA timer |
| `app/(admin)/admin/incidents/playbooks/page.tsx` | Playbooks par catégorie | ❌ Pas de runbooks pas-à-pas exécutables |
| `app/(admin)/admin/alertes/page.tsx` | Alertes système | ❌ Pas relié au moteur d'incident |
| `app/(admin)/admin/securite/incidents-voyageurs/page.tsx` | Vue admin sécurité voyageurs | ❌ Pas de drill-down par incident |
| `app/(equipe)/equipe/securite/incidents-voyageurs/page.tsx` | Console équipe sécurité | ✅ Correcte — augmentée par le centre de commande temps réel |
| `app/(equipe)/equipe/alertes/page.tsx` | Alertes équipe | ❌ Pas relié au moteur d'incident |
| `app/(equipe)/equipe/risques/page.tsx` | Risques | ❌ Vue analytique, pas opérationnelle |
| `app/(pro)/pro/incidents/page.tsx` | Liste incidents créateur | ❌ Pas de wizard signalement |
| `app/(independant)/independant/urgence/page.tsx` | Urgence indé | ❌ Pas de geoloc, pas de hotline 24/7 |
| `app/(independant)/independant/groupes/[id]/urgence/page.tsx` | Urgence par groupe | ✅ Correcte — augmentée par bouton sticky |

### Ce qui manque — livré dans ce sprint

| Page / fichier | Livré ? | Priorité |
|---|---|---|
| `lib/incidents-management.ts` (modèle Incident) | ✅ | P0 |
| `lib/incidents-runbooks.ts` (procédures par type) | ✅ | P0 |
| `lib/incidents-escalation.ts` (règles SLA + escalade auto) | ✅ | P0 |
| `app/(equipe)/equipe/incidents/page.tsx` (centre de commande temps réel) | ✅ | P0 |
| `app/(equipe)/equipe/incidents/[id]/page.tsx` (drill-down) | ✅ | P0 |
| `app/(equipe)/equipe/incidents/post-mortem/page.tsx` | ✅ | P1 |
| `app/(equipe)/equipe/incidents/war-room/page.tsx` (mode CRISE) | ✅ | P0 |
| `app/(admin)/admin/incidents-overview/page.tsx` (vue PDG KPIs) | ✅ | P0 |
| `app/(admin)/admin/incidents/runbooks/page.tsx` (runbooks exécutables) | ✅ | P0 |
| `app/(pro)/pro/incidents/signaler/page.tsx` (wizard créateur) | ✅ | P0 |
| `app/(independant)/independant/incidents/page.tsx` (24/7 + geoloc) | ✅ | P0 |
| `app/(voyageur)/voyageur/incidents/page.tsx` (signalement voyageur) | ✅ | P0 |
| `components/incidents/IncidentCard.tsx` | ✅ | P0 |
| `components/incidents/IncidentTimeline.tsx` | ✅ | P0 |
| `components/incidents/RunbookViewer.tsx` | ✅ | P0 |
| `components/incidents/EmergencyButton.tsx` | ✅ | P0 |
| `components/incidents/CrisisWarRoom.tsx` | ✅ | P0 |

---

## 3. Catalogue exhaustif des incidents possibles

### 3.1 Voyageur (santé / sécurité / personnel)

| Code | Type | Gravité par défaut | Action immédiate |
|---|---|---|---|
| `VOY-MAL-LEGER` | Voyageur malade léger (rhume, fatigue) | P3 | Indé prend soin, pharmacie locale |
| `VOY-MAL-GRAVE` | Voyageur malade grave (fièvre forte, douleur intense) | P1 | Médecin local + assurance assistance |
| `VOY-ACCIDENT` | Accident corporel | P0 | Samu / hôpital local + assurance |
| `VOY-PERTE-DOC` | Passeport / CNI perdu | P2 | Ambassade + commissariat + photo doc backup |
| `VOY-VOL` | Vol effets personnels | P2 | Police locale + déclaration sinistre assurance |
| `VOY-CONFLIT` | Conflit entre voyageurs | P2 | Médiation indé + remontée créateur |
| `VOY-COMPORTEMENT` | Comportement inapproprié (alcool, agressivité) | P2 | Avertissement, exclusion si récidive |
| `VOY-PERTE` | Voyageur perdu / disparu | P0 | Recherche immédiate + police si > 1h |
| `VOY-RAPATRIEMENT` | Urgence familiale → rapatriement | P1 | Pack Sérénité + agence retour |
| `VOY-PSY` | Crise psychologique | P1 | Soutien immédiat + médecin |

### 3.2 Indépendant (terrain)

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `IND-MAL` | Indépendant malade en mission | P1 | Remplacement urgent par créateur + Eventy |
| `IND-ACCIDENT` | Accident indépendant | P0 | Soins + remplacement + RC pro |
| `IND-DEMISSION-LM` | Démission last minute (< 48h départ) | P1 | Créateur active backup, sinon Eventy |
| `IND-NOSHOW` | No-show au point de RDV | P0 | Hotline créateur + remplacement express |
| `IND-INAPPROPRIE` | Comportement inapproprié | P1 | Suspension + enquête + voyageurs prévenus |
| `IND-QUALITE` | Qualité dégradée signalée | P3 | Note suivi, formation, audit |

### 3.3 HRA (hôtels, restos, activités)

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `HRA-SURBOOK` | Surbooking hôtel | P1 | Relogement équivalent + dédommagement |
| `HRA-FERME` | Fermeture imprévue | P1 | Solution alternative + remboursement |
| `HRA-QUALITE` | Qualité dégradée (propreté, service) | P2 | Audit + dédommagement + sortie roster si récurrent |
| `HRA-REFUS` | Refus accueil voyageurs (discrimination) | P0 | Action légale + sortie immédiate roster + alternative |
| `HRA-PANNE` | Panne (eau, élec, climat) | P2 | Délai résolution ou alternative |

### 3.4 Transport

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `TRA-RETARD-AVION` | Retard avion > 2h | P1 | Communication voyageurs + replanning aval |
| `TRA-ANNULATION-AVION` | Annulation vol | P0 | Solution alternative immédiate (autre vol, train) |
| `TRA-PANNE-BUS` | Panne bus en route | P0 | Bus de remplacement + boissons/snacks |
| `TRA-ACCIDENT-BUS` | Accident bus | P0 | Samu + bus de secours + assistance psy |
| `TRA-GREVE` | Grève transport | P1 | Replanning + communication |
| `TRA-METEO` | Météo extrême (annulation) | P1 | Reprogrammation ou remboursement |

### 3.5 Créateur

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `CRE-INDISPO` | Créateur indisponible (maladie, urgence) | P1 | Eventy reprend, indé sénior backup |
| `CRE-ABANDON` | Créateur abandonne voyage | P0 | Eventy reprend totalement + audit |
| `CRE-COMM` | Communication défaillante voyageurs | P2 | Eventy intervient comms + formation |
| `CRE-PRIX` | Prix mal calculé (perte ou trop-perçu) | P2 | Audit finance + ajustement |

### 3.6 Météo / Catastrophe naturelle

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `CAT-METEO` | Tempête, orage majeur | P1 | Mise à l'abri + replanning |
| `CAT-INONDATION` | Inondation | P0 | Évacuation + relogement |
| `CAT-SEISME` | Tremblement de terre | P0 | Évacuation + ambassade + rapatriement |
| `CAT-ATTENTAT` | Attentat / attaque | P0 | Confinement + ambassade + rapatriement immédiat |
| `CAT-SANITAIRE` | Alerte sanitaire (épidémie) | P0 | Confinement + autorités + rapatriement médicalisé |

### 3.7 Légal / Réglementaire

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `LEG-REGLEMENT` | Changement réglementation in-tempore | P2 | Avocat + adaptation contrats |
| `LEG-AUTORITE` | Conflit autorités locales | P1 | Avocat local + ambassade |
| `LEG-FRAUDE` | Fraude détectée (carte, identité) | P1 | Suspension + signalement TRACFIN |
| `LEG-BLANCHIMENT` | Suspicion blanchiment | P0 | Signalement TRACFIN + gel |

### 3.8 Tech (plateforme)

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `TEC-PANNE` | Panne plateforme partielle | P1 | DevOps + dégradé serviced + status page |
| `TEC-PANNE-TOT` | Panne plateforme totale | P0 | War room tech + bascule DR |
| `TEC-FUITE` | Fuite données suspectée | P0 | Containment + CNIL 72h + RGPD |
| `TEC-CYBER` | Attaque cyber active | P0 | Isolation + ANSSI + cellule crise |

### 3.9 Financier

| Code | Type | Gravité | Action immédiate |
|---|---|---|---|
| `FIN-NONPAIE-HRA` | Non-paiement HRA prestataire | P2 | Médiation + escalade compta |
| `FIN-DEFAUT-STRIPE` | Défaut paiement Stripe | P1 | Relance + plan paiement + alternative |
| `FIN-FRAUDE-CB` | Fraude carte bancaire | P1 | Stripe Radar + opposition + remboursement victime |

---

## 4. Procédure de gestion d'incident

### 4.1 Détection

3 voies d'entrée :

1. **Voyageur signale** : bouton "J'ai un problème" sur app voyage (Tribu)
2. **Indépendant / Créateur signale** : wizard rapide (type → gravité → desc → photos)
3. **Monitoring auto** : retard avion API, fuite Stripe, météo API, panne tech

→ Tout incident génère un événement `IncidentCreated` avec ID immutable, horodatage, source.

### 4.2 Triage (gravité)

| Niveau | Définition | Critère |
|---|---|---|
| **P0** | Vie en danger / crise majeure | Décès possible, blessure grave, attentat, panne totale, fuite RGPD |
| **P1** | Voyage perturbé sévèrement | > 30% voyageurs impactés, financier > 5 k€, réputation |
| **P2** | Inconfort significatif | < 30% voyageurs, financier 500 € – 5 k€ |
| **P3** | Mineur, gérable terrain | 1 voyageur, < 500 €, résolu < 30 min |

### 4.3 Escalade automatique

Règle d'escalade fondée sur le SLA :

| Niveau | SLA prise en charge | SLA résolution | Auto-escalade si dépassé |
|---|---|---|---|
| P0 | 2 min | 30 min | → Admin + Mode CRISE |
| P1 | 10 min | 2 h | → Équipe Eventy senior |
| P2 | 30 min | 24 h | → Équipe Eventy junior |
| P3 | 2 h | 72 h | → Indé / Créateur |

**Override manuel** : un membre équipe peut escalader / désescalader avec justification.

### 4.4 Action

Chaque type d'incident a un **runbook** : checklist pas-à-pas avec scripts d'appels, templates email/SMS, contacts d'urgence par destination.

### 4.5 Communication

Selon gravité :

- **P0** : voyageurs concernés + créateur + admin + assurance + ambassade (si étranger) — multi-canal (Push + SMS + Email + WhatsApp)
- **P1** : voyageurs + créateur + admin (Slack)
- **P2** : créateur + équipe (chat plateforme)
- **P3** : indé + créateur (interne)

### 4.6 Trace immutable (audit log)

Toute action sur un incident est logguée :
- Horodatage (ISO 8601 UTC)
- Acteur (user ID)
- Action (`status_changed`, `assigned`, `escalated`, `comment_added`, `resolved`)
- Avant / Après (JSON diff)
- IP, User-Agent

→ Stocké en append-only, exportable PDF pour assurance / autorités / litiges.

### 4.7 Post-mortem

Après résolution :
- Cause racine (5 Whys)
- Leçons apprises
- Mise à jour du runbook si nécessaire
- Mise à jour des templates si nécessaire
- KPI (temps détection, temps résolution, satisfaction post)
- Diffusion à l'équipe

---

## 5. Architecture des pages livrées

### 5.1 Côté ÉQUIPE (centre opérationnel)

```
/equipe/incidents              → Centre de commande temps réel (P0 en haut, SLA timer)
/equipe/incidents/[id]         → Drill-down : timeline, comms, actions, docs
/equipe/incidents/post-mortem  → Post-mortems publiés
/equipe/incidents/war-room     → Mode CRISE (chat live, timeline live)
```

### 5.2 Côté ADMIN (PDG)

```
/admin/incidents-overview      → KPIs globaux + heatmap par créateur/HRA/destination
/admin/incidents/runbooks      → Bibliothèque runbooks exécutables
```
*(Préservé : `/admin/incidents/page.tsx` + `/admin/incidents/playbooks/page.tsx`)*

### 5.3 Côté CRÉATEUR (`/pro`)

```
/pro/incidents                 → Liste incidents de mes voyages (existant)
/pro/incidents/signaler        → Wizard : type → gravité → desc → photos
```

### 5.4 Côté INDÉPENDANT

```
/independant/urgence              → Hotline 24/7 (existant, préservé)
/independant/groupes/[id]/urgence → Urgence groupe (existant, préservé)
/independant/incidents            → Bouton URGENCE 24/7 sticky + geoloc + templates
```

### 5.5 Côté VOYAGEUR

```
/voyageur/incidents            → "J'ai un problème" — catégorisation auto
```

---

## 6. Helpers techniques livrés

| Fichier | Rôle |
|---|---|
| `lib/incidents-management.ts` | Modèle `Incident`, `IncidentSeverity`, `IncidentType`, `IncidentStatus`, helpers création / mise à jour |
| `lib/incidents-runbooks.ts` | Catalogue runbooks (50+ procédures), templates email/SMS, contacts urgence par destination |
| `lib/incidents-escalation.ts` | Règles SLA, calcul de l'auto-escalade, mode CRISE trigger |

---

## 7. Composants UI livrés

| Composant | Usage |
|---|---|
| `<IncidentCard>` | Carte incident avec gravité + SLA timer + actions rapides |
| `<IncidentTimeline>` | Timeline événements / actions / comms |
| `<RunbookViewer>` | Affichage pas-à-pas runbook avec checkboxes + scripts |
| `<EmergencyButton>` | Bouton sticky 24/7 (geoloc + appel hotline) |
| `<CrisisWarRoom>` | War room virtuelle (chat live + timeline live) |

---

## 8. Mode CRISE — War Room

Déclenchement :
- **Auto** : tout incident P0 ou impact > 10 voyageurs
- **Manuel** : bouton "Activer mode crise" (équipe + admin)

Effets :
- Notification multi-canal : Slack + SMS + Email + WhatsApp à l'équipe astreinte + admin + concierge luxe 24/7
- Cellule de crise virtuelle ouverte (chat temps réel)
- War room : timeline live, actions visibles en direct, live cursors équipe
- Enregistrement auto (vocal + chat) pour preuves
- Workflow remboursement automatique post-validation

---

## 9. Backlog technique TODO Eventy

```
// TODO Eventy: hotline 24/7 (Twilio + équipe astreinte)
// TODO Eventy: notifications push critique multi-canal (Slack + SMS + Email + WhatsApp)
// TODO Eventy: intégration assurances (RC pro, assistance voyage, rapatriement)
// TODO Eventy: contacts urgence par destination (ambassades, hôpitaux, police, samu)
// TODO Eventy: AI triage auto incidents (NLP description → type + sévérité)
// TODO Eventy: live cursors équipe sur même incident (collaboration)
// TODO Eventy: enregistrement auto échanges (vocal + chat) pour preuves
// TODO Eventy: workflow remboursement automatique post-incident validé
// TODO Eventy: rapport satisfaction post-incident voyageur (NPS)
// TODO Eventy: auto-blacklist créateur/HRA/indé après X incidents graves
```

---

## 10. Plan d'activation et SLA

### Phase 1 (immédiate — sprint actuel)
- ✅ Pages livrées en mode démo (données mockées)
- ✅ Structure de données prête pour backend

### Phase 2 (Sprint +1)
- Backend NestJS : module `incidents` (CRUD + escalade + audit log)
- Webhook Twilio (SMS hotline)
- Slack webhook équipe astreinte

### Phase 3 (Sprint +2)
- Intégrations assureurs (API RC pro, assistance voyage, rapatriement)
- Catalogue contacts urgence (ambassades, samu international)

### Phase 4 (Sprint +3)
- AI triage NLP (Claude API)
- Live cursors collaboration
- Auto-blacklist après X incidents graves

### SLA cible
- **P0** : 100% prise en charge ≤ 2 min · 95% résolution ≤ 30 min
- **P1** : 100% prise en charge ≤ 10 min · 95% résolution ≤ 2 h
- **P2** : 100% prise en charge ≤ 30 min · 95% résolution ≤ 24 h
- **P3** : 100% prise en charge ≤ 2 h · 95% résolution ≤ 72 h

### Indicateurs de succès
- Score satisfaction post-incident ≥ 4,5/5
- Taux d'escalade non-justifiée ≤ 5%
- Zéro incident P0 non détecté dans les 5 min
- Conformité audit assurance 100%

---

**Sécurité voyageurs = OBJECTIF #1.**
**On prend soin des gens. Quoi qu'il arrive, on s'en occupe.**

— *David Eventy, PDG — Mai 2026*
