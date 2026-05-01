# AUDIT — Enrichissement Voyage dans le Temps

**Date** : 2026-05-01
**Périmètre** : Cycle de vie d'un voyage Eventy après publication — modifications progressives, ajout de partenariats, versionning, conformité Directive UE 2015/2302
**Auteur** : IA PDG (David Eventy)
**Statut** : audit + roadmap d'implémentation

---

## 1. Contexte business

Un voyage Eventy n'est jamais "figé" à la publication. Le créateur/indépendant continue à enrichir l'offre dans le temps :

- Ajout d'un nouvel hôtel partenaire en cours de saison (HRA)
- Signature d'un nouveau restaurant ou activité
- Mise à jour du programme jour par jour
- Ajustement du transport (vol modifié, nouveau bus)
- Changement d'aéroport départ ou arrivée (cf. AUDIT_TRANSFERT_AEROPORT.md)

**Problème actuel** : la page `/pro/voyages/[id]/edit` modifie en place sans traçabilité. Aucune notification voyageur, aucun versionning, aucun lock par champ critique. → risque légal Directive UE 2015/2302.

---

## 2. Cadre légal — Directive UE 2015/2302

> **Article 11 §2** : Lorsque l'organisateur, avant le début du voyage à forfait, est contraint de modifier de manière significative les caractéristiques principales des services de voyage, il doit en informer le voyageur dans les meilleurs délais, par écrit, sur un support durable, et de manière claire, compréhensible et apparente.

**Modifications majeures** déclenchant notification obligatoire :
- Date de départ/retour
- Aéroport de départ/arrivée
- Hôtel principal (nom, catégorie, localisation)
- Augmentation prix > 8%
- Modification programme jour-par-jour majeure
- Changement transporteur principal

**Modifications mineures** (versionning interne, pas de notification) :
- Ajout activité optionnelle
- Photo gallery
- Description marketing
- Ajout partenariat secondaire (resto alternatif, snack)

---

## 3. État actuel du code

### 3.1 Modèle Prisma `Travel`
- ✅ Champs : `publishedAt`, `salesOpenAt`, `phase1ApprovedAt`, `phase2ApprovedAt`, `cancelReason`
- ❌ **Pas** de modèle `TravelVersion` ni `TravelChangeLog`
- ❌ **Pas** de modèle `TravelEnrichmentEvent` (pour partenariats progressifs)
- ❌ **Pas** de modèle `TravelChangeNotification` (article 11 §2)

### 3.2 Frontend
- ✅ Page `/pro/voyages/[id]/edit/page.tsx` — wizard 7 étapes, PATCH brut sur travel
- ❌ Pas de prise en compte du statut publié (édition libre, sans alerte)
- ❌ Pas de différenciation "modif majeure" vs "modif mineure"
- ❌ Pas de timeline d'enrichissements

### 3.3 Backend
- ✅ Endpoint `PATCH /pro/travels/:id`
- ❌ Pas d'audit log par champ
- ❌ Pas d'envoi automatique d'email/SMS aux voyageurs en cas de modif majeure

---

## 4. TODOs identifiés

### TODO-ENR-1 — Modèle `TravelVersion` (P0)
- **Schema** : ajouter `model TravelVersion` (id, travelId, versionNumber, snapshotJson, changedFields, isMajor, createdBy, createdAt)
- **Trigger** : à chaque PATCH `/pro/travels/:id`, créer une nouvelle version avec snapshot complet du voyage avant modification
- **Conservation** : illimitée (preuve légale)

### TODO-ENR-2 — Modèle `TravelEnrichmentEvent` (P0)
- **Schema** : id, travelId, type (HOTEL_ADDED | RESTAURANT_ADDED | ACTIVITY_ADDED | PARTNER_LINKED | PHOTO_ADDED | PROGRAM_UPDATED), payload, addedBy, addedAt
- **UI** : timeline `/pro/voyages/[id]/enrichissement` avec affichage chronologique
- **Visible** côté client public (transparence ajout partenaires)

### TODO-ENR-3 — Modèle `TravelChangeNotification` (P0 — Légal)
- **Schema** : id, travelId, changeType, oldValue, newValue, isMajor, notificationStatus (PENDING | SENT | ACKNOWLEDGED), affectedBookings[], createdAt, sentAt
- **Trigger automatique** : si modif majeure (cf. liste §2), créer une notification et déclencher l'envoi mail/SMS
- **Bouton accept/refuse** voyageur (conformité art. 11 §3)

### TODO-ENR-4 — Service backend `TravelEnrichmentService` (P0)
- **Fichier** : `backend/src/modules/travels/travel-enrichment.service.ts`
- **Méthodes** :
  - `createVersion(travelId, beforeData, afterData, userId)` — diff + version
  - `detectMajorChange(beforeData, afterData)` — boolean + reason
  - `triggerNotifications(travelId, changeType, payload)` — emails affected pax
  - `addEnrichmentEvent(travelId, type, payload, userId)` — log timeline

### TODO-ENR-5 — Controller backend (P0)
- **Fichier** : `backend/src/modules/travels/travel-enrichment.controller.ts`
- **Routes** :
  - `GET /pro/travels/:id/enrichment` — liste timeline + versions
  - `GET /pro/travels/:id/enrichment/versions/:versionId` — diff version
  - `POST /pro/travels/:id/enrichment/events` — ajouter event partenariat
  - `POST /pro/travels/:id/enrichment/notify` — déclencher notif manuelle
  - `GET /pro/travels/:id/enrichment/notifications` — historique notifs

### TODO-ENR-6 — Page frontend `/pro/voyages/[id]/enrichissement` (P0)
- **Layout** : 3 sections
  1. **Timeline d'enrichissement** : versions + events partenariats
  2. **Modifications en cours** : diff vs version publiée + bouton "Notifier voyageurs"
  3. **Notifications envoyées** : historique avec taux ouverture/clic

### TODO-ENR-7 — Détection automatique modif majeure côté frontend (P1)
- **Fichier** : `/pro/voyages/[id]/edit/page.tsx`
- **Action** : avant submit, comparer `formData` vs `originalData`, afficher modale "Cette modification est majeure (changement aéroport) — voulez-vous notifier les X voyageurs concernés ?"
- **Validation** : lock si pas de raison fournie (champ `reason: string` obligatoire pour modif majeure)

### TODO-ENR-8 — UI partenariat progressif (P1)
- **Fichier** : `/pro/voyages/[id]/enrichissement/page.tsx`
- **Action** : bouton "+ Ajouter un partenaire" avec wizard
  - Type : Hôtel | Restaurant | Activité | Animateur | Photographe
  - Lien HRA existant ou création hors HRA
  - Date d'effet (immédiat ou différé)
- **Persistance** : `TravelEnrichmentEvent` avec payload typé

### TODO-ENR-9 — Lock champs critiques publiés (P1)
- **Fichier** : `EtapeInfo.tsx` + `EtapePricing.tsx`
- **Action** : si voyage `PUBLISHED` + `bookingCount > 0`, lock champs `departureDate`, `returnDate`, `pricePerPersonTTC` derrière confirmation modale "Ceci modifiera les conditions de X réservations"
- **Indicateur visuel** : icône cadenas + tooltip "Champ verrouillé après publication — débloquer ?"

### TODO-ENR-10 — Email template "Modification majeure" (P0 — Légal)
- **Fichier** : `backend/src/modules/email/templates/travel-major-change.tsx`
- **Contenu** : mentionner la modif, le droit de résolution sans frais (art. 11 §3), bouton accept/refuse
- **Pixel tracking** + lien unique signé pour acknowledgment

### TODO-ENR-11 — Cron de relance acknowledgment (P2)
- **Fichier** : `backend/src/modules/cron/jobs/travel-notif-reminder.ts`
- **Action** : si notification > 3 jours sans réponse, relancer voyageur
- **Auto-acceptation** : si > 7 jours sans réponse → considérer accepté (mais log preuve)

### TODO-ENR-12 — Quick Link voyage détail (P0)
- **Fichier** : `/pro/voyages/[id]/page.tsx`
- **Action** : ajouter card "Enrichissements" + entrée `QUICK_LINKS`
- **Compteur** : badge "3 nouveaux partenariats"

---

## 5. Périmètre livré dans cette session

✅ **Livré (MVP)** :
1. Page `/pro/voyages/[id]/enrichissement/page.tsx` — UI complète versionning + timeline + notifications
2. Service stub backend `travel-enrichment.service.ts`
3. Controller `travel-enrichment.controller.ts` avec routes
4. Quick Link dans voyage détail
5. Démo data complet en mode `NEXT_PUBLIC_DEMO_MODE=true`
6. Format Eventy gold #D4A853 + glassmorphism + Framer Motion

🔜 **Reporté (Phase 2)** :
- Migration Prisma (nécessite review DBA)
- Email template HTML/MJML production
- Cron relance
- Tracking pixel signé
