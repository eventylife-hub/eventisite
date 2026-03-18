# API Reference — Eventy Life

> **Base URL** : `https://api.eventylife.fr/api`
> **Auth** : JWT Bearer Token (access 15min + refresh 7j)
> **Format** : JSON, réponses standardisées `{ success, data, error }`
> **Rate Limiting** : 60 req/min (API), 10 req/min (auth)
> **Total** : 377 endpoints, 30 modules

---

## Authentification

Toutes les routes protégées nécessitent un header `Authorization: Bearer <accessToken>`.

### Obtenir un token

```
POST /api/auth/register     — Inscription (retourne accessToken + refreshToken)
POST /api/auth/login         — Connexion
POST /api/auth/refresh       — Renouveler l'access token (via refreshToken en cookie httpOnly)
POST /api/auth/logout        — Déconnexion (invalide le refresh token)
```

### Rôles

| Rôle | Accès |
|------|-------|
| CLIENT | Portail client (`/api/client/*`, `/api/bookings/*`, `/api/checkout/*`) |
| PRO | Portail pro (`/api/pro/*`) + client |
| ADMIN | Tout (`/api/admin/*`) |

---

## Modules API (30)

### Public (sans auth)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Health check (DB, Redis, mémoire) |
| GET | `/api/health/ready` | Readiness probe |
| GET | `/api/health/live` | Liveness probe |
| GET | `/api/public/travels` | Liste des voyages publiés |
| GET | `/api/public/travels/:slug` | Détail d'un voyage |
| GET | `/api/seo/sitemap-data` | Données sitemap |
| GET | `/api/seo/robots` | Robots.txt |
| GET | `/api/seo/structured-data/:type` | JSON-LD schema |
| GET | `/api/reviews/public` | Avis publics |
| GET | `/api/travels` | Catalogue voyages (paginé) |
| GET | `/api/travels/:slug` | Détail voyage public |

### Auth (13 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| POST | `/api/auth/refresh` | Non | Refresh token |
| POST | `/api/auth/forgot-password` | Non | Demande reset |
| POST | `/api/auth/reset-password` | Non | Reset mot de passe |
| GET | `/api/auth/verify-email` | Non | Vérification email |
| POST | `/api/auth/logout` | Oui | Déconnexion |
| GET | `/api/auth/me` | Oui | Profil utilisateur |
| PATCH | `/api/auth/me` | Oui | Modifier profil |
| POST | `/api/auth/2fa/enable` | Oui | Activer 2FA TOTP |
| POST | `/api/auth/2fa/verify` | Oui | Vérifier code 2FA |
| POST | `/api/auth/2fa/disable` | Oui | Désactiver 2FA |
| PATCH | `/api/auth/change-password` | Oui | Changer mot de passe |

### Client (14 endpoints)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/client/profile` | Profil client |
| PATCH | `/api/client/profile` | Modifier profil |
| GET | `/api/client/bookings` | Mes réservations |
| GET | `/api/client/bookings/:id` | Détail réservation |
| GET | `/api/client/payments` | Mes paiements |
| GET | `/api/client/documents` | Mes documents |
| GET | `/api/client/notifications` | Mes notifications |
| PATCH | `/api/client/notifications/:id/read` | Marquer lue |
| GET | `/api/client/wallet` | Portefeuille |
| GET | `/api/client/reviews` | Mes avis |
| POST | `/api/client/support` | Créer ticket |
| GET | `/api/client/support` | Mes tickets |
| GET | `/api/client/insurance` | Mes assurances |
| GET | `/api/client/dashboard` | Dashboard client |

### Checkout (18 endpoints)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/checkout/init` | Initier un checkout |
| GET | `/api/checkout/:id` | État du checkout |
| POST | `/api/checkout/:id/rooms` | Configurer chambres |
| GET | `/api/checkout/:id/totals` | Calculer totaux |
| POST | `/api/checkout/:id/pay` | Créer session Stripe |
| POST | `/api/checkout/:id/insurance` | Ajouter assurance |
| POST | `/api/checkout/:id/participants` | Ajouter participants |
| PATCH | `/api/checkout/:id/validate` | Valider le panier |

### Payments (4 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/payments` | Oui | Historique paiements |
| GET | `/api/payments/:id` | Oui | Détail paiement |
| POST | `/api/payments/webhook` | Non | Webhook Stripe |
| POST | `/api/payments/:id/refund` | Admin | Rembourser |

### Pro (64 endpoints)

Le portail Pro couvre la gestion complète des voyages par les professionnels.

**Sous-modules** : voyages (création, édition, publication), réservations, finance, formation, messagerie, onboarding, bus-stops, quick-sell, revenues.

### Admin (65 endpoints)

Le portail Admin couvre la gestion complète de la plateforme.

**Sous-modules** : dashboard, statistiques, validation pro, gestion utilisateurs, finance, documents, transport, rooming, marketing, support, audit, exports, monitoring CRON/emails.

**Monitoring spécifique** :

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/monitoring/jobs` | Résumé CRON 24h |
| GET | `/api/admin/monitoring/emails` | Résumé outbox emails |
| GET | `/api/admin/monitoring/cron-history` | Historique CRON paginé |

---

## Format de réponse

### Succès

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
```

### Erreur

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Données invalides",
    "code": "BAD_REQUEST",
    "details": null
  },
  "timestamp": "2026-03-17T23:00:00.000Z",
  "path": "/api/checkout/init"
}
```

### Codes d'erreur

| Code | HTTP | Description |
|------|------|-------------|
| BAD_REQUEST | 400 | Données invalides |
| UNAUTHORIZED | 401 | Token manquant ou expiré |
| FORBIDDEN | 403 | Rôle insuffisant |
| NOT_FOUND | 404 | Ressource introuvable |
| CONFLICT | 409 | Doublon (email, etc.) |
| VALIDATION_ERROR | 422 | Erreur de validation DTO |
| TOO_MANY_REQUESTS | 429 | Rate limit dépassé |
| INTERNAL_ERROR | 500 | Erreur serveur |
| DUPLICATE_ENTRY | 409 | Contrainte unique violée |
| FOREIGN_KEY_VIOLATION | 400 | Référence invalide |
| DATABASE_TIMEOUT | 503 | Timeout DB |
| DATABASE_UNAVAILABLE | 503 | DB inaccessible |

---

## Webhooks Stripe

| Événement | Action |
|-----------|--------|
| `checkout.session.completed` | Paiement → SUCCEEDED, booking → CONFIRMED |
| `checkout.session.expired` | Booking HELD → EXPIRED (sauf si payé) |
| `payment_intent.payment_failed` | Paiement → FAILED + email |
| `charge.refunded` | Paiement → REFUNDED + booking → CANCELED |
| `charge.dispute.created` | Alerte admin + paiement → FAILED |

---

## Invariants financiers

1. `pricingParts = occupancyCount` (JAMAIS capacity)
2. `perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC`
3. Montants en centimes Int (JAMAIS Float)
4. Idempotency sur tout (webhooks, uploads, opérations financières)
5. Lock post-paiement (chambre/occupation verrouillés)
6. TVA marge = `(CA_TTC − coûts_TTC) × 20/120`
7. Paiement reçu ≠ annulé par hold expiré
8. TravelGroupMember JOINED ≠ place consommée
