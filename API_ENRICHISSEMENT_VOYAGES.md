# API — Enrichissement Voyages & Transfert d'Aéroport

**Version** : 1.0 — 2026-05-02
**Audience** : Développeurs intégrant l'API Eventy ou consommant les webhooks
**Conformité** : Article 11 §2/§3 + 12 §6 Directive UE 2015/2302

---

## Table des matières

1. [Authentification](#authentification)
2. [Enrichissement progressif](#enrichissement-progressif)
3. [Notifications voyageurs](#notifications-voyageurs)
4. [Transfert d'aéroport](#transfert-daéroport)
5. [Configuration webhook outbound](#configuration-webhook-outbound)
6. [Webhooks reçus côté créateur](#webhooks-reçus-côté-créateur)
7. [Endpoints admin/équipe](#endpoints-adminéquipe)
8. [Conventions](#conventions)
9. [Codes d'erreur](#codes-derreur)

---

## Authentification

### Bearer JWT (utilisateurs authentifiés)

```http
Authorization: Bearer eyJhbGc...
```

### Token signé HMAC (liens email publics)

```
?token=base64url(payload).base64url(hmacSHA256)
```

Validation côté serveur via `NotificationTokenService.verifyToken`. TTL par défaut : 14 jours. Configurable via `NOTIFICATION_TOKEN_TTL_MS`.

---

## Enrichissement progressif

### `GET /pro/travels/:id/enrichment`

Récupère le dashboard enrichissement d'un voyage.

**Auth** : PRO / ADMIN
**Rate limit** : READ

**Réponse 200** :
```json
{
  "travelId": "trip-123",
  "travelTitle": "Marrakech Express",
  "travelStatus": "PUBLISHED",
  "bookingCount": 28,
  "publishedAt": "2026-03-20T10:00:00Z",
  "events": [
    {
      "id": "ev_123_456",
      "type": "HOTEL_ADDED",
      "label": "Riad Lotus 5★",
      "description": "Nouveau partenaire premium",
      "addedBy": "user-pro-1",
      "addedAt": "2026-04-25T14:30:00Z",
      "isMajor": false,
      "visibility": "PUBLIC"
    }
  ],
  "versions": [
    {
      "id": "v_123_3",
      "versionNumber": 3,
      "changedFields": ["program.day3", "standaloneActivities"],
      "isMajor": false,
      "reason": "Ajout activité optionnelle",
      "createdBy": "user-pro-1",
      "createdAt": "2026-04-25T14:30:00Z",
      "affectedBookings": 0
    }
  ],
  "notifications": [...]
}
```

### `POST /pro/travels/:id/enrichment/events`

Ajoute un événement d'enrichissement (partenariat, photo, programme).

**Auth** : PRO / ADMIN
**Rate limit** : WRITE

**Request body** :
```json
{
  "type": "HOTEL_ADDED",
  "label": "Riad Lotus 5★",
  "description": "Nouveau partenaire premium HRA",
  "visibility": "PUBLIC",
  "payload": { "hotelName": "Riad Lotus", "stars": 5 }
}
```

Types supportés : `HOTEL_ADDED`, `RESTAURANT_ADDED`, `ACTIVITY_ADDED`, `PARTNER_LINKED`, `PHOTO_ADDED`, `PROGRAM_UPDATED`, `PRICING_ADJUSTED`, `TEAM_UPDATED`.

**Side effect** : déclenche webhook `voyage.enrichment.added` côté ERP créateur si configuré.

### `POST /pro/travels/:id/enrichment/notify`

Déclenche manuellement la notification voyageurs (UE 2015/2302 art. 11 §2).

**Auth** : PRO / ADMIN
**Rate limit** : WRITE

**Request body** :
```json
{
  "versionId": "v_123_4",
  "changeType": "AIRPORT_TRANSFER",
  "oldValue": "Paris CDG",
  "newValue": "Lyon LYS",
  "reason": "Forte demande depuis Lyon (14 voyageurs en waitlist)"
}
```

**Side effect** : envoie un email à chaque booker actif via `EmailService.queueEmail` (template `travel-major-change` ou `travel-airport-transfer`).

---

## Notifications voyageurs

### `GET /client/voyages/:travelId/notifications`

Liste les notifications de modification pour le voyageur authentifié.

**Auth** : CLIENT / PRO / ADMIN
**Rate limit** : READ

**Réponse 200** :
```json
[
  {
    "id": "n_456",
    "travelId": "trip-123",
    "travelTitle": "Marrakech Express",
    "changeType": "AIRPORT_TRANSFER",
    "oldValue": "Paris CDG",
    "newValue": "Lyon LYS",
    "reason": "Forte demande Lyon",
    "status": "PENDING",
    "createdAt": "2026-04-28T14:30:00Z",
    "responseDeadline": "2026-05-05T14:30:00Z",
    "legalNotice": "Conformément à l'article 11 §3..."
  }
]
```

### `POST /client/voyages/:travelId/notifications/:notificationId/respond`

Acquittement authentifié (depuis l'espace voyageur).

**Auth** : CLIENT (ou tout rôle authentifié)
**Rate limit** : WRITE

**Request body** :
```json
{ "accept": true, "notes": "Optionnel" }
```

### `POST /public/notifications/:notificationId/respond`

Acquittement via lien email signé (sans connexion préalable).

**Auth** : Public (token signé requis)
**Rate limit** : AUTH (anti-bruteforce)

**Request body** :
```json
{
  "accept": true,
  "signedToken": "base64.signature",
  "travelId": "trip-123"
}
```

---

## Transfert d'aéroport

### `POST /pro/travels/:id/transfer-airport`

Exécute le transfert d'un voyage vers un autre aéroport (création voyage cible).

**Auth** : PRO / ADMIN
**Rate limit** : WRITE

**Request body** :
```json
{
  "targetAirport": "LYS",
  "symphony": {
    "preserveHotel": true,
    "preserveRestaurants": true,
    "preserveActivities": true,
    "preserveTeam": true,
    "preserveProgram": true,
    "preservePricing": false,
    "resetFlights": true,
    "resetBusLongDistance": true,
    "resetRegionalPickup": true,
    "resetArrivalTransfers": false
  },
  "reason": "Forte demande depuis Lyon"
}
```

**Réponse 200** :
```json
{
  "newTravelId": "trip-123-lys",
  "record": { ...TransferRecord... }
}
```

**Side effects** :
- Crée un nouveau Travel en DRAFT
- Si bookings actifs côté source → notification automatique (transfert = TOUJOURS modif majeure)
- Webhook `voyage.transferred` fire vers ERP créateur

### `GET /pro/travels/:id/transfers`

Historique des transferts (source ou cible).

### `GET /pro/travels/:id/transfers/export`

Export HTML A4 print-ready (preuve légale).

**Content-Type** : `text/html; charset=utf-8`

Le client peut Ctrl+P pour générer un PDF.

### `GET /airports/suggested?travelId=...`

Suggestions d'aéroports candidats par densité de demande (top 10 hubs FR).

**Auth** : Public
**Rate limit** : READ

---

## Configuration webhook outbound

### `GET /pro/settings/webhooks`

Récupère la config webhook du créateur (génère un secret si absent).

**Auth** : PRO / ADMIN

### `POST /pro/settings/webhooks`

Sauvegarde config.

**Request body** :
```json
{
  "url": "https://erp.example.com/webhooks/eventy",
  "secret": "wh_secret_xxxxxxxxxxxxxxxxxxxx",
  "events": [
    "voyage.modified",
    "voyage.transferred",
    "voyage.notification.acknowledged"
  ],
  "isActive": true
}
```

**Validation** : URL doit commencer par `https://` en production.

### `POST /pro/settings/webhooks/test`

Envoie un event factice à l'URL configurée pour tester.

---

## Webhooks reçus côté créateur

### Format de payload

```http
POST {creatorUrl}
Content-Type: application/json
X-Eventy-Signature: <hex(HMAC-SHA256(body, secret))>
X-Eventy-Event: voyage.transferred
```

Body :
```json
{
  "event": "voyage.transferred",
  "occurredAt": "2026-05-02T14:30:00Z",
  "travelId": "trip-123",
  "data": {
    "targetTravelId": "trip-123-lys",
    "sourceAirport": "CDG",
    "targetAirport": "LYS",
    "affectedBookings": 28
  }
}
```

### Events disponibles

| Event | Quand ? | Champs `data` |
|---|---|---|
| `voyage.modified` | PATCH voyage avec changement majeur | `changedFields[]`, `versionNumber`, `isMajor` |
| `voyage.transferred` | Transfert d'aéroport exécuté | `targetTravelId`, `sourceAirport`, `targetAirport`, `affectedBookings` |
| `voyage.notification.sent` | Email notification envoyé | `notificationId`, `affectedBookings` |
| `voyage.notification.acknowledged` | Voyageur a répondu | `notificationId`, `decision`, `bookingGroupId` |
| `voyage.enrichment.added` | Event partenariat ajouté | `type`, `label` |

### Vérification de signature (Node.js)

```js
import { createHmac, timingSafeEqual } from 'crypto';

function verify(body, signature, secret) {
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

app.post('/webhooks/eventy', (req, res) => {
  const sig = req.headers['x-eventy-signature'];
  const body = JSON.stringify(req.body);
  if (!verify(body, sig, WEBHOOK_SECRET)) {
    return res.status(401).end();
  }
  // Process payload...
  res.status(200).end();
});
```

### Vérification de signature (Python)

```python
import hmac
import hashlib

def verify(body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)
```

---

## Endpoints admin/équipe

| Méthode | Route | Description |
|---|---|---|
| GET | `/admin/enrichments?filter=ALL\|MAJOR\|OVERDUE\|PENDING` | Vue globale ops |
| GET | `/admin/transfers?filter=ALL\|PUBLISHED\|...` | Vue globale transferts |
| GET | `/admin/enrichments/stats` | KPIs agrégés plateforme |
| POST | `/admin/travels/:id/notifications/:nid/manual-remind` | Relance manuelle ack |
| POST | `/admin/travels/:id/seed-demo-enrichment` | Seed demo (staging) |
| POST | `/admin/enrichments/cron/run-ack-reminders` | Trigger manuel cron |

---

## Conventions

### Ack tacite J+7

Si un voyageur ne répond pas à une notification dans les 7 jours, son acceptation est considérée comme tacite (Article 11 §3 Directive UE 2015/2302). Le statut passe à `EXPIRED` et un `TravelChangeAck` est créé avec `decision: TACIT_ACCEPT`.

### Idempotency keys

Les emails utilisent un idempotency key au format `enrichment-{notifId}-{bookingGroupId}` pour éviter les doublons.

### Conservation légale

| Table | Conservation |
|---|---|
| `travel_change_notifications` | Illimitée (preuve juridique) |
| `travel_change_acks` | Illimitée |
| `travel_versions` | 5 ans après date retour voyage |
| `travel_enrichment_events` | 5 ans après date retour voyage |
| `travel_airport_transfers` | 5 ans après date retour voyage |

Réf : Code du tourisme art. R211-9.

---

## Codes d'erreur

| Code | Signification |
|---|---|
| `200` | OK |
| `201` | Created (event ajouté) |
| `400` | Bad request (URL non-HTTPS en prod, etc.) |
| `401` | Token signé invalide |
| `403` | Rôle insuffisant |
| `404` | Voyage / notification introuvable |
| `429` | Rate limit dépassé (notamment AUTH sur public ack) |

---

## Variables d'environnement requises

```bash
NOTIFICATION_SIGNING_SECRET="<32+ chars random>"
NOTIFICATION_TOKEN_TTL_MS="1209600000"
WEBHOOK_OUTBOUND_ENABLED="true"
PUBLIC_APP_URL="https://eventy.life"
ALLOW_DEMO_SEED="false"  # production
```

---

## Voir aussi

- `RUNBOOK_ENRICHISSEMENT.md` — procédures ops
- `RECAP_CODE_ENRICHISSEMENT_TRANSFERTS.md` — récap technique
- `AUDIT_ENRICHISSEMENT_VOYAGE.md` — audit + TODOs
- `AUDIT_TRANSFERT_AEROPORT.md` — audit + TODOs
