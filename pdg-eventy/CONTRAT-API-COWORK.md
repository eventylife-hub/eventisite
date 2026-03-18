# CONTRAT API COWORK — Interface Front ↔ Back

> **MAJ** : 2026-03-15 — Aligné sur backend V70
> **Dernière MAJ** : 2026-03-12
> **Règle** : Le Back définit le contrat, le Front le consomme. Toute modification = MAJ de ce fichier.
> **Base URL** : `http://localhost:4000/api` (dev) | `https://api.eventy.life/api` (prod)

---

## Convention globale

- **Auth** : Bearer JWT dans header `Authorization: Bearer <token>`
- **Cookies** : `refreshToken` httpOnly secure
- **Pagination** : cursor-based `?cursor=<id>&limit=20`
- **Erreurs** : `{ statusCode: number, message: string, error: string }`
- **Money** : toujours en **centimes entiers** (ex: 15900 = 159,00€)
- **Dates** : ISO 8601 (`2026-03-12T10:00:00.000Z`)

---

## PHASE 1 — AUTH

### POST /auth/register
```
Request:
{
  "email": "client@example.com",
  "password": "MinChars12!@",     // min 12 chars, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+33612345678"         // optionnel
}

Response 201:
{
  "message": "Un email de vérification a été envoyé.",
  "userId": "clx..."
}

Erreurs:
- 409: "Un compte existe déjà avec cet email."
- 422: "Le mot de passe doit contenir au moins 12 caractères..."
- 429: "Trop de tentatives. Réessayez dans X minutes."
```
**Statut** : ✅ Existant — à vérifier | **Back LOT** : B-001

### POST /auth/login
```
Request:
{
  "email": "client@example.com",
  "password": "MinChars12!@"
}

Response 200:
{
  "user": {
    "id": "clx...",
    "email": "client@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "CLIENT",              // CLIENT | PRO | ADMIN
    "emailVerified": true,
    "avatarUrl": null
  }
}
+ Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict; Max-Age=900
+ Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800

Erreurs:
- 401: "Email ou mot de passe incorrect."
- 403: "Votre email n'est pas encore vérifié."
- 429: "Compte temporairement bloqué après 5 tentatives."
```
**Statut** : ✅ Existant — à vérifier | **Back LOT** : B-001

### POST /auth/refresh
```
Request: (cookie refreshToken envoyé automatiquement)

Response 200:
{
  "accessToken": "eyJhbG...",      // nouveau JWT 15min (pour compatibilité)
  "refreshToken": "eyJhbG..."      // optionnel (si envoyé en body)
}
+ Set-Cookie: access_token=<new>; HttpOnly; Secure; SameSite=Strict; Max-Age=900
+ Set-Cookie: refresh_token=<new>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800

Erreurs:
- 401: "Session expirée. Veuillez vous reconnecter."
```
**Statut** : ✅ Existant | **Back LOT** : B-001

### GET /auth/me
```
Headers: Authorization: Bearer <accessToken>

Response 200:
{
  "id": "clx...",
  "email": "client@example.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "CLIENT",
  "emailVerified": true,
  "phone": "+33612345678",
  "avatarUrl": "https://...",
  "createdAt": "2026-01-15T..."
}
```
**Statut** : ✅ Existant | **Back LOT** : B-001

### POST /auth/logout
```
Headers: Authorization: Bearer <accessToken>

Response 200:
{ "message": "Déconnexion réussie." }
+ Clear-Cookie: refreshToken
```
**Statut** : ✅ Existant | **Back LOT** : B-001

---

## PHASE 2 — VOYAGES (PUBLIC)

### GET /travels
```
Query params:
  ?destination=paris          // filtre destination
  &dateFrom=2026-06-01        // date départ min
  &dateTo=2026-08-31          // date départ max
  &priceMin=50000             // prix min en centimes (500€)
  &priceMax=200000            // prix max en centimes (2000€)
  &transport=BUS|AVION        // type transport
  &cursor=clx...              // pagination
  &limit=12                   // items par page

Response 200:
{
  "data": [
    {
      "id": "clx...",
      "slug": "week-end-amsterdam-juin-2026",
      "title": "Week-end Amsterdam",
      "description": "Découvrez Amsterdam...",
      "destination": "Amsterdam, Pays-Bas",
      "departureCity": "Paris",
      "departureDate": "2026-06-15T06:00:00.000Z",
      "returnDate": "2026-06-17T22:00:00.000Z",
      "duration": 3,                            // jours
      "transport": "BUS",
      "priceFromCents": 29900,                   // à partir de 299€
      "capacity": 53,
      "occupancy": 31,                           // places prises
      "availableSeats": 22,
      "coverImageUrl": "https://...",
      "status": "PUBLISHED",
      "rating": 4.5,
      "reviewCount": 12
    }
  ],
  "nextCursor": "clx...",                        // null si dernière page
  "total": 47
}
```
**Statut** : ⚠️ Partiellement existant — compléter filtres | **Back LOT** : B-003

### GET /travels/:slug
```
Response 200:
{
  "id": "clx...",
  "slug": "week-end-amsterdam-juin-2026",
  "title": "Week-end Amsterdam",
  "description": "Description longue...",
  "destination": "Amsterdam, Pays-Bas",
  "departureCity": "Paris",
  "departureDate": "2026-06-15T06:00:00.000Z",
  "returnDate": "2026-06-17T22:00:00.000Z",
  "duration": 3,
  "transport": "BUS",
  "itinerary": [
    { "day": 1, "title": "Départ & Arrivée", "description": "..." },
    { "day": 2, "title": "Visite guidée", "description": "..." },
    { "day": 3, "title": "Temps libre & Retour", "description": "..." }
  ],
  "images": ["https://...1.jpg", "https://...2.jpg"],
  "includes": ["Transport A/R", "Hôtel 3★", "Petit-déjeuner"],
  "excludes": ["Repas midi/soir", "Activités optionnelles"],
  "rooms": [
    {
      "id": "clx...",
      "type": "DOUBLE",
      "label": "Chambre Double",
      "pricePerPersonCents": 29900,
      "capacity": 2,
      "available": 8
    },
    {
      "id": "clx...",
      "type": "SINGLE",
      "label": "Chambre Single",
      "pricePerPersonCents": 39900,
      "capacity": 1,
      "available": 5
    },
    {
      "id": "clx...",
      "type": "TRIPLE",
      "label": "Chambre Triple",
      "pricePerPersonCents": 25900,
      "capacity": 3,
      "available": 3
    }
  ],
  "organizer": {
    "name": "Aventures & Découvertes",
    "avatarUrl": "https://...",
    "rating": 4.7,
    "tripCount": 28
  },
  "status": "PUBLISHED",
  "capacity": 53,
  "occupancy": 31,
  "availableSeats": 22
}
```
**Statut** : ⚠️ Partiellement existant — enrichir response | **Back LOT** : B-003

---

## PHASE 3 — BOOKING & CHECKOUT

### Flux checkout V70 (4 étapes)
**Étape 1** : POST /checkout/initiate — Crée un DRAFT booking group
**Étape 2** : POST /checkout/:id/rooms — Sélectionne les chambres
**Étape 3** : POST /checkout/:id/participants — Enregistre les détails des participants
**Étape 4** : POST /checkout/:id/payment — Crée la session Stripe et redirige

Alternatives:
- POST /checkout/groups (one-shot, inclut rooms + participants en 1 appel)
- POST /payments/checkout (deprecated, à éviter)

### POST /bookings
```
Headers: Authorization: Bearer <accessToken>

Request:
{
  "travelId": "clx...",
  "rooms": [
    {
      "roomTypeId": "clx...",
      "occupants": [
        { "firstName": "Jean", "lastName": "Dupont", "email": "jean@mail.com", "birthDate": "1990-05-15" },
        { "firstName": "Marie", "lastName": "Dupont", "email": "marie@mail.com", "birthDate": "1992-08-20" }
      ]
    }
  ]
}

Response 201:
{
  "id": "clx...",
  "status": "DRAFT",
  "travelId": "clx...",
  "totalCents": 59800,          // 2 × 299€
  "rooms": [...],
  "createdAt": "2026-03-12T..."
}
```
**Statut** : ✅ Existant — à vérifier | **Back LOT** : B-005

### POST /bookings/:id/confirm
```
Headers: Authorization: Bearer <accessToken>

Response 200:
{
  "id": "clx...",
  "status": "HELD",              // stock bloqué 24h
  "holdExpiresAt": "2026-03-13T10:00:00.000Z",
  "totalCents": 59800
}

Erreurs:
- 409: "Plus de places disponibles pour cette chambre."
- 400: "La réservation n'est pas en statut DRAFT."
```
**Statut** : ✅ Existant | **Back LOT** : B-005

### POST /checkout/initiate
```
Headers: Authorization: Bearer <accessToken>

Request:
{
  "travelId": "clx..."
}

Response 201:
{
  "bookingGroupId": "clx..."
}

Erreurs:
- 400: "Travel non trouvé ou non disponible."
```
**Statut** : ✅ Existant (ÉTAPE 1) | **Back LOT** : B-006

### POST /checkout/groups
```
Headers: Authorization: Bearer <accessToken>

Request:
{
  "travelId": "clx...",
  "rooms": [
    { "roomTypeId": "clx...", "occupants": [...] }
  ]
}

Response 201:
{
  "groupId": "clx...",
  "expiresAt": "2026-03-13T10:00:00.000Z",
  "roomBookings": [...],
  "totals": { "roomsTotalAmountTTC": 59800, "insuranceTotalAmountTTC": 0, "grandTotalAmountTTC": 59800 }
}
```
**Statut** : ✅ Existant (ONE-SHOT) | **Back LOT** : B-006

### POST /checkout/:id/rooms
```
Headers: Authorization: Bearer <accessToken>

Request:
{
  "rooms": [
    { "roomTypeId": "clx...", "occupants": [...] }
  ]
}

Response 200:
{
  "success": true,
  "roomBookings": [...]
}
```
**Statut** : ✅ Existant (ÉTAPE 2) | **Back LOT** : B-006

### POST /checkout/:id/participants
```
Headers: Authorization: Bearer <accessToken>

Request:
{
  "participants": [
    {
      "roomBookingId": "clx...",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean@mail.com",
      "phone": "+33612345678",
      "busStopId": "clx...",
      "insuranceSelected": true,
      "insuranceAmountPerPersonTTC": 1200
    }
  ]
}

Response 200:
{
  "success": true
}
```
**Statut** : ✅ Existant (ÉTAPE 3) | **Back LOT** : B-006

### POST /checkout/:id/payment
```
Headers: Authorization: Bearer <accessToken>

Response 201:
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "provider": "STRIPE"
}

Erreurs:
- 400: "Données incomplètes."
- 409: "Le hold a expiré. Veuillez recommencer."
- 429: "Trop de tentatives de paiement."
```
**Statut** : ✅ Existant (ÉTAPE 4) | **Back LOT** : B-006

### GET /bookings (liste mes réservations)
```
Headers: Authorization: Bearer <accessToken>
Query: ?status=CONFIRMED&cursor=...&limit=10

Response 200:
{
  "data": [
    {
      "id": "clx...",
      "status": "CONFIRMED",
      "travel": {
        "title": "Week-end Amsterdam",
        "slug": "week-end-amsterdam-juin-2026",
        "departureDate": "2026-06-15T...",
        "coverImageUrl": "https://..."
      },
      "totalCents": 59800,
      "roomCount": 1,
      "travelerCount": 2,
      "createdAt": "2026-03-12T...",
      "paidAt": "2026-03-12T..."
    }
  ],
  "nextCursor": null,
  "total": 3
}
```
**Statut** : ✅ Existant | **Back LOT** : B-005

---

## PHASE 4 — PRO

### GET /pro/travels
```
Headers: Authorization: Bearer <accessToken> (role: PRO)

Response 200:
{
  "data": [
    {
      "id": "clx...",
      "title": "Week-end Amsterdam",
      "status": "PUBLISHED",       // DRAFT | PENDING | PUBLISHED | CANCELLED
      "departureDate": "2026-06-15T...",
      "capacity": 53,
      "occupancy": 31,
      "revenueCents": 1749400,     // total revenus
      "createdAt": "2026-02-01T..."
    }
  ],
  "nextCursor": null,
  "total": 5
}
```
**Statut** : ⚠️ À compléter | **Back LOT** : B-007

### GET /pro/revenues
```
Headers: Authorization: Bearer <accessToken> (role: PRO)

Response 200:
{
  "totalRevenueCents": 4520000,
  "pendingPayoutCents": 890000,
  "paidOutCents": 3630000,
  "byTravel": [
    {
      "travelId": "clx...",
      "title": "Week-end Amsterdam",
      "revenueCents": 1749400,
      "commissionCents": 174940,   // 10%
      "netCents": 1574460
    }
  ]
}
```
**Statut** : ⚠️ À compléter | **Back LOT** : B-007

---

## PHASE 5 — ADMIN

### GET /admin/travels?status=PENDING
```
Headers: Authorization: Bearer <accessToken> (role: ADMIN)

Response 200:
{
  "data": [
    {
      "id": "clx...",
      "title": "Week-end Rome",
      "status": "PENDING",
      "organizer": { "name": "Pro Travel", "email": "pro@travel.com" },
      "submittedAt": "2026-03-10T...",
      "departureDate": "2026-07-01T...",
      "capacity": 53,
      "priceFromCents": 34900
    }
  ],
  "total": 3
}
```
**Statut** : ⚠️ À compléter | **Back LOT** : B-009

### POST /admin/travels/:id/approve-p1
```
Headers: Authorization: Bearer <accessToken> (role: ADMIN)

Request:
{ "comment": "Phase 1 — Documentation acceptée." }

Response 200:
{
  "id": "clx...",
  "status": "APPROVE_P1_PENDING",
  "approvedAt": "2026-03-12T..."
}
```
**Statut** : ✅ Existant (PHASE 1) | **Back LOT** : B-009

### POST /admin/travels/:id/approve-p2
```
Headers: Authorization: Bearer <accessToken> (role: ADMIN)

Request:
{ "comment": "Phase 2 — Contrôle final approuvé." }

Response 200:
{
  "id": "clx...",
  "status": "PUBLISHED",
  "approvedAt": "2026-03-12T...",
  "approvedBy": "admin@eventy.life"
}
```
**Statut** : ✅ Existant (PHASE 2) | **Back LOT** : B-009

### POST /admin/travels/:id/reject
```
Headers: Authorization: Bearer <accessToken> (role: ADMIN)

Request:
{ "reason": "Documentation incomplète." }

Response 200:
{
  "id": "clx...",
  "status": "REJECTED"
}

Erreurs:
- 400: "Raison de rejet requise."
```
**Statut** : ✅ Existant | **Back LOT** : B-009

---

## Légende Statut

| Icône | Signification |
|-------|---------------|
| ✅ | Endpoint existant dans le code — à vérifier/tester |
| ⚠️ | Partiellement existant — à compléter |
| ❌ | N'existe pas encore — à créer |

---

## Instructions pour les Cowork

### Cowork BACK : quand tu livres un endpoint
1. Vérifie qu'il match exactement le contrat ci-dessus
2. Si tu dois modifier le format → dis-le au PDG Cowork pour MAJ
3. Teste avec `curl` ou Postman
4. Mets à jour le statut dans ce fichier (✅)

### Cowork FRONT : quand tu câbles une page
1. Lis le contrat pour cet endpoint AVANT de coder
2. Utilise les types exacts du contrat (pas de "any")
3. Gère les 4 états : Loading / Empty / Error / Data
4. Si l'API ne répond pas encore → utilise le fallback demo, mais commente `// TODO: remove fallback when API ready`
5. Mets à jour le statut dans SPRINT-COWORK.md (coche la case)
