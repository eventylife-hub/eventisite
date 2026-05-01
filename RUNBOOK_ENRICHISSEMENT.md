# RUNBOOK — Enrichissement progressif & Transfert d'aéroport

**Dernière mise à jour** : 2026-05-02
**Audience** : Équipe ops Eventy (Pôle Conformité, Support, Admin)
**Conformité** : Article 11 §2/§3 + 12 §6 Directive UE 2015/2302

---

## 🎯 Objectif

Ce runbook documente les procédures opérationnelles à suivre par l'équipe Eventy pour :
1. **Surveiller** la conformité légale des voyages publiés
2. **Réagir** à une modification majeure d'un voyage avec bookings actifs
3. **Exécuter** un transfert d'aéroport en toute sécurité
4. **Gérer** les voyageurs qui n'accusent pas réception (relances, J+7 tacite)
5. **Auditer** un litige : récupérer toutes les preuves légales

---

## 📋 Vue d'ensemble du système

### Routes UI

| Rôle | Route | Description |
|---|---|---|
| Pro | `/pro/voyages/[id]/enrichissement` | Timeline + versions + notifications créateur |
| Pro | `/pro/voyages/[id]/transfert-aeroport` | Wizard transfert aéroport |
| Pro | `/pro/voyages/[id]/transfert-aeroport/historique` | Audit historique (export HTML) |
| Pro | `/pro/parametres/webhooks` | Config webhook outbound ERP |
| Client | `/client/voyage/[id]/notifications` | Liste accept/refuse modifications |
| Public | `/public/notifications/[id]/[decision]?token=...` | Ack via lien email signé |
| Admin | `/admin/enrichissements` | Vue globale ops |
| Admin | `/admin/transferts-voyages` | Vue globale transferts |
| Équipe | `/equipe/conformite-voyages` | Pôle Conformité (RED/YELLOW/GREEN) |

### API endpoints

| Méthode | Route | Description |
|---|---|---|
| GET | `/pro/travels/:id/enrichment` | Dashboard enrichissement |
| POST | `/pro/travels/:id/enrichment/events` | Ajout event partenariat |
| POST | `/pro/travels/:id/enrichment/notify` | Déclenche notification voyageurs |
| POST | `/pro/travels/:id/transfer-airport` | Exécute transfert aéroport |
| GET | `/pro/travels/:id/transfers` | Historique transferts |
| GET | `/pro/travels/:id/transfers/export` | Export HTML preuve légale |
| GET | `/airports/suggested?travelId=` | Suggestions par densité |
| GET | `/client/voyages/:id/notifications` | Notifs voyageur (auth) |
| POST | `/client/voyages/:id/notifications/:nid/respond` | Ack auth |
| POST | `/public/notifications/:nid/respond` | Ack public via token signé |
| GET | `/admin/enrichments?filter=` | Vue globale admin |
| GET | `/admin/transfers?filter=` | Vue globale transferts |
| GET | `/pro/settings/webhooks` | Config webhook |
| POST | `/pro/settings/webhooks` | Sauvegarde config |
| POST | `/pro/settings/webhooks/test` | Test endpoint |

---

## 🚨 Procédure 1 — Modification majeure d'un voyage publié

### Déclencheurs (auto-détection)
Modification d'un des champs suivants déclenche le flow majeur :
- `departureDate` (date départ)
- `returnDate` (date retour)
- `destination`
- `transportMode` (avion/bus/train)
- `pricing.basePrice` avec **+8% ou plus** d'augmentation
- `capacity` avec **réduction** (jamais augmentation)
- `departureAirport` (via FlightAllotment)

### Flow opérationnel

1. **Le créateur modifie** un champ via `/pro/voyages/[id]/edit`.
2. Le composant `MajorChangeDetector` détecte automatiquement et **bloque le PATCH**.
3. Une modale demande :
   - Liste des changements détectés (with before/after)
   - Justification obligatoire (sera affichée aux voyageurs)
   - Checkbox "Envoyer notifications immédiatement"
4. Au submit, deux choses se produisent :
   - PATCH `/pro/travels/:id` avec metadata `_changeReason` + `_sendNotifications`
   - POST `/pro/travels/:id/enrichment/notify` qui crée la notification
5. Le service `dispatchMajorChangeEmails` envoie un email à chaque booker actif :
   - Template `travel-major-change` (ou `travel-airport-transfer` si applicable)
   - Liens signés HMAC `acceptUrl` + `refuseUrl`
   - Mention légale Article 11 §2 + délai 7 jours

### Action ops requise
- ❌ **Aucune** : le système est entièrement automatisé.
- 👀 **Surveillance** : `/equipe/conformite-voyages` doit afficher le voyage en YELLOW ou RED selon le délai.

---

## ✈️ Procédure 2 — Transfert d'aéroport

### Quand l'utiliser ?
Le créateur veut **dupliquer** un voyage publié vers un autre aéroport départ tout en
conservant la "symphonie" HRA (hôtel, restaurants, activités, équipe, programme).

### Flow opérationnel

1. **Le créateur clique** "✈️ Transférer aéroport" depuis `/pro/voyages/[id]/transport/avion` ou Quick Link.
2. **Wizard 4 étapes** (`/pro/voyages/[id]/transfert-aeroport`) :
   1. **Cible** : sélection aéroport (suggestions par densité waitlist)
   2. **Symphonie** : checkboxes conservé / réinitialisé (par défaut HRA conservée, transport reset)
   3. **Confirmation** : preview side-by-side + raison obligatoire
   4. **Succès** : 2 voyages liés (source = OUTGOING, target = INCOMING)
3. **Backend** :
   - `TravelTransferService.transferToAirport` crée un `Travel` cible (DRAFT)
   - Copie de marginConfig/costConfig si `preservePricing=true`
   - Si `bookingCount > 0` côté source → déclenche notification automatique (transfert = TOUJOURS modif majeure)
   - Fire webhook `voyage.transferred` vers ERP créateur (si configuré)
4. **Suivi** : `/pro/voyages/[id]/transfert-aeroport/historique` montre le journal.

### Action ops requise
- ❌ **Aucune** sur le flow de base.
- 👀 **Vérifier** : si > 50 bookings impactés, un check manuel est recommandé (appel ou email personnalisé).

---

## 🟡 Procédure 3 — Voyageurs qui n'accusent pas réception

### Cycle de vie d'une notification (J = jour d'envoi)

| Date | Action automatique | Statut notification |
|---|---|---|
| J | Email envoyé via `dispatchMajorChangeEmails` | `SENT` |
| J+3 | Cron `enrichmentAckReminder` (9h00) envoie relance #1 | `SENT` ou `PARTIALLY_ACK` |
| J+5 | Cron envoie relance finale (urgence) | `SENT` ou `PARTIALLY_ACK` |
| J+7 | Cron déclenche acceptation tacite pour les non-répondants | `EXPIRED` (Article 11 §3) |

### Surveillance Pôle Conformité

**Page `/equipe/conformite-voyages`** affiche les voyages avec niveaux risque :
- 🟢 **GREEN** : ack ≥ 80% ou aucune modif majeure
- 🟡 **YELLOW** : ack < 80% mais oldestPendingDays ≤ 5
- 🔴 **RED** : oldestPendingDays > 5 → auto-acceptation imminente

### Action ops requise sur RED

1. **Identifier** les voyageurs qui n'ont pas répondu :
   ```bash
   # Via API
   curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
     "${API}/admin/enrichments?filter=OVERDUE"
   ```
2. **Décider** :
   - Option A : **Appel téléphonique** personnalisé (recommandé pour modifs critiques)
   - Option B : **Laisser tacite** (acceptation par défaut J+7)
   - Option C : **Forcer une nouvelle notification** (admin endpoint Phase 2)
3. **Tracer** la décision dans le ticket support pour audit.

---

## 📜 Procédure 4 — Litige / Recours voyageur

### Cas d'usage
Un voyageur conteste avoir reçu la notification, ou prétend avoir refusé alors
qu'on a tacit-accept.

### Pièces à recueillir

1. **Notification originale** :
   ```sql
   SELECT * FROM travel_change_notifications
   WHERE id = '${notificationId}';
   ```
   Vérifier `sentAt`, `oldValue`, `newValue`, `reason`.

2. **Accusé de réception** :
   ```sql
   SELECT * FROM travel_change_acks
   WHERE notificationId = '${notificationId}'
     AND bookingGroupId = '${bookingGroupId}';
   ```
   Vérifier `decision`, `acknowledgedAt`, `ipAddress`, `userAgent`, `signedToken`.

3. **Email Outbox** (preuve d'envoi) :
   ```sql
   SELECT * FROM "Outbox"
   WHERE templateId IN ('travel-major-change', 'travel-airport-transfer')
     AND idempotencyKey LIKE '%${notificationId}%';
   ```
   Vérifier `sentAt`, `status` (DELIVERED), `recipientEmail`.

4. **Snapshot Travel pre/post modif** :
   ```sql
   SELECT snapshotJson FROM travel_versions
   WHERE travelId = '${travelId}'
   ORDER BY versionNumber DESC LIMIT 5;
   ```

5. **Export HTML preuve légale** :
   ```
   GET /pro/travels/${travelId}/transfers/export
   ```
   Document A4 print-ready avec mention légale + cachet d'audit.

### Conservation légale
- `travel_change_notifications` + `travel_change_acks` : **illimitée** (preuve juridique)
- `travel_versions` + `travel_enrichment_events` : **5 ans** après date retour voyage (Code du tourisme art. R211-9)

---

## 🔧 Procédure 5 — Configuration ENV en production

### Variables d'environnement requises

```bash
# Signature des liens email (HMAC-SHA256, 14j TTL)
NOTIFICATION_SIGNING_SECRET="<32+ chars random>"
NOTIFICATION_TOKEN_TTL_MS="1209600000"  # 14 jours

# Webhook outbound ERP créateur
WEBHOOK_OUTBOUND_ENABLED="true"

# URL publique pour les liens email
PUBLIC_APP_URL="https://eventy.life"

# Email expéditeur
EMAIL_SENDER_ADDRESS="noreply@eventylife.fr"
EMAIL_SENDER_NAME="Eventy Life"
EMAIL_COMPANY_ADDRESS="123 Rue de la Innovation, 75000 Paris, France"
EMAIL_COMPANY_WEBSITE="https://eventy.life"
```

### Activation cron J+3/J+5/J+7

Le cron `TravelEnrichmentCronService.sendAckReminders` est en **stub mode** par défaut.
Pour l'activer en production :
1. Appliquer la migration `20260502_voyage_enrichment_models`
2. Décommenter le bloc Phase 2 dans `travel-enrichment-cron.service.ts`
3. Vérifier `@nestjs/schedule` est bien dans `app.module.ts` imports

---

## 📞 Escalade

| Sévérité | Action |
|---|---|
| 🟢 Routine | Surveillance `/equipe/conformite-voyages` |
| 🟡 Vigilance | Notifier le créateur (chat pro) |
| 🔴 Critique | Appel téléphonique direct au créateur + voyageurs |
| ⚫ Litige | Recueillir pièces (Procédure 4) → escalade Légal |

**Contacts** :
- Pôle Conformité : `conformite@eventy.life`
- Pôle Support : `support@eventy.life`
- Avocat tourisme : (cf. `pdg-eventy/01-legal/CHECKLIST-AVOCAT.md`)

---

## 🧪 Test du flow end-to-end

### En staging

```bash
# 1. Créer un voyage publié avec 1+ booking
POST /api/admin/seed-travels?count=1&withBookings=true

# 2. Modifier la destination (modif majeure)
PATCH /api/pro/travels/${id} { "destinationCity": "Casablanca" }

# 3. Vérifier notification créée
curl /api/pro/travels/${id}/enrichment | jq '.notifications'

# 4. Suivre l'email Outbox
SELECT * FROM "Outbox" WHERE recipientEmail = ... ORDER BY createdAt DESC LIMIT 1;

# 5. Cliquer sur le lien dans l'email → page /public/notifications/...

# 6. Vérifier ack tracé
curl /api/pro/travels/${id}/enrichment | jq '.notifications[0].acknowledgedCount'
```

---

## 📚 Références

- `AUDIT_ENRICHISSEMENT_VOYAGE.md` — audit complet + 12 TODOs détaillés
- `AUDIT_TRANSFERT_AEROPORT.md` — audit complet + 12 TODOs détaillés
- `RECAP_CODE_ENRICHISSEMENT_TRANSFERTS.md` — récap technique 5 batches
- `pdg-eventy/01-legal/RGPD-CONFORMITE.md` — conformité RGPD
- Directive UE 2015/2302 (texte officiel) — https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32015L2302
- Code du tourisme art. L.211-13 + R.211-9
