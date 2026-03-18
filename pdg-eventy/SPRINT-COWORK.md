# SPRINT COWORK — Plan de Coordination Front / Back

> **Dernière MAJ** : 2026-03-13 — Sprint F-001→F-010 TERMINÉ ✅
> **Objectif** : MVP fonctionnel complet — 1er voyage réservable et payable
> **Organisation** : 2 instances Cowork en parallèle

---

## Règle d'or

> **On ne code QUE ce qui mène à : un client peut chercher un voyage, le réserver, payer, et recevoir sa confirmation.**
> Tout le reste est V2.

---

## Architecture des 2 Cowork

| Instance | Périmètre | Fichier de référence |
|----------|-----------|---------------------|
| **Cowork BACK** | NestJS, Prisma, PostgreSQL, Stripe, Auth, API | `CONTRAT-API-COWORK.md` |
| **Cowork FRONT** | Next.js 14, Pages, Composants, Intégration API | `CONTRAT-API-COWORK.md` |
| **Cowork PDG** (ce Cowork) | Coordination, pilotage, non-technique | Ce fichier |

---

## PHASE 1 — AUTH & FONDATIONS (Semaine 1)

### Cowork BACK
- [x] **LOT B-001** : Vérifier/compléter le module Auth
  - POST /auth/register (avec validation email)
  - POST /auth/login (JWT access 15min + refresh 7j)
  - POST /auth/logout
  - POST /auth/refresh
  - GET /auth/me
  - Middleware guards (JwtAuthGuard, RolesGuard)
  - **Livrable** : 8 endpoints auth fonctionnels + tests
- [x] **LOT B-002** : Seed de données de démo
  - 5 voyages (bus + avion), 3 destinations, chambres, prix
  - 2 users (client + pro), 1 admin
  - **Livrable** : `prisma/seed.ts` complet

### Cowork FRONT
- [x] **LOT F-001** : Pages Auth complètes câblées sur l'API
  - /connexion → POST /auth/login
  - /inscription → POST /auth/register
  - /mot-de-passe-oublie → POST /auth/forgot-password
  - /verification-email → POST /auth/verify-email
  - Middleware Next.js pour routes protégées
  - **Livrable** : Auth flow complet fonctionnel
- [x] **LOT F-002** : Layout client connecté
  - Header avec user info (GET /auth/me)
  - Sidebar navigation
  - Redirect si non-connecté
  - **Livrable** : Layout client prêt

### Point de synchro
> À la fin de Phase 1 : un utilisateur peut s'inscrire, se connecter, voir son espace client.

---

## PHASE 2 — CATALOGUE VOYAGES (Semaine 1-2)

### Cowork BACK
- [x] **LOT B-003** : API Voyages publique
  - GET /travels (liste + filtres : destination, date, prix, transport)
  - GET /travels/:slug (détail complet avec chambres et prix)
  - GET /travels/:slug/rooms (types de chambres + dispo)
  - Pagination cursor-based
  - **Livrable** : 3 endpoints voyage fonctionnels
- [x] **LOT B-004** : API Recherche
  - GET /travels/search?q=&destination=&dateFrom=&dateTo=&priceMin=&priceMax=&transport=
  - **Livrable** : Recherche avec filtres combinés

### Cowork FRONT
- [x] **LOT F-003** : Page recherche voyages
  - /voyages → câblée sur GET /travels + filtres
  - Composant SearchBar + Filtres (destination, date, prix, transport)
  - Cards voyage avec prix, dates, places restantes
  - **Livrable** : Page recherche fonctionnelle
- [x] **LOT F-004** : Page détail voyage
  - /voyages/[slug] → câblée sur GET /travels/:slug
  - Galerie photos, description, itinéraire
  - Section chambres avec prix par personne
  - Bouton "Réserver" → redirige vers checkout
  - **Livrable** : Page détail complète

### Point de synchro
> À la fin de Phase 2 : un visiteur peut chercher des voyages, filtrer, voir les détails et les prix.

---

## PHASE 3 — RÉSERVATION & CHECKOUT (Semaine 2-3)

### Cowork BACK
- [x] **LOT B-005** : API Booking complète
  - POST /bookings (créer réservation DRAFT)
  - POST /bookings/:id/rooms (ajouter chambre + occupants)
  - POST /bookings/:id/confirm (DRAFT → HELD, hold 24h sur stock)
  - GET /bookings/:id (détail réservation)
  - Vérification stock temps réel (RoomInventory)
  - **Livrable** : Flow booking DRAFT → HELD
- [x] **LOT B-006** : API Checkout Stripe
  - POST /checkout/initiate (crée session Stripe)
  - POST /payments/webhook (gère les événements Stripe)
  - GET /payments/:id (statut paiement)
  - Idempotency keys sur tous les endpoints paiement
  - **Livrable** : Paiement Stripe fonctionnel en mode test

### Cowork FRONT
- [x] **LOT F-005** : Tunnel Checkout 3 étapes
  - /checkout/start → POST /bookings (init réservation)
  - /checkout/step-1 → Sélection chambre + occupants
  - /checkout/step-2 → Infos voyageurs (nom, email, tel, date naissance)
  - /checkout/step-3 → Récap + redirection Stripe Checkout
  - /checkout/confirmation → Page succès post-paiement
  - Zustand store pour état checkout persistant
  - **Livrable** : Tunnel 5 pages fonctionnel
- [x] **LOT F-006** : Page Mes Réservations
  - /client/reservations → GET /bookings (liste)
  - /client/reservations/[id] → GET /bookings/:id (détail)
  - Statuts visuels (DRAFT, HELD, PAID, CONFIRMED, CANCELLED)
  - **Livrable** : Suivi réservations client

### Point de synchro
> À la fin de Phase 3 : un client peut réserver un voyage, payer par carte (Stripe test), et voir sa réservation confirmée. **C'est le MVP.**

---

## PHASE 4 — PORTAIL PRO (Semaine 3-4)

### Cowork BACK
- [x] **LOT B-007** : API Pro
  - GET /pro/travels (mes voyages créés)
  - POST /pro/travels (créer un voyage)
  - PUT /pro/travels/:id (modifier)
  - GET /pro/travels/:id/bookings (réservations pour mon voyage)
  - GET /pro/revenues (mes revenus)
  - **Livrable** : CRUD Pro complet
- [x] **LOT B-008** : API Rooming Pro
  - GET /pro/travels/:id/rooming (plan de rooming)
  - PUT /pro/travels/:id/rooming/assign (assigner chambres)
  - **Livrable** : Rooming fonctionnel

### Cowork FRONT
- [x] **LOT F-007** : Dashboard Pro
  - /pro/dashboard → Stats (revenus, réservations, voyages)
  - /pro/voyages → Liste mes voyages + création
  - /pro/voyages/[id] → Détail + gestion
  - **Livrable** : Dashboard Pro fonctionnel
- [x] **LOT F-008** : Gestion réservations Pro
  - /pro/voyages/[id]/reservations → Liste résa pour ce voyage
  - /pro/voyages/[id]/rooming → Plan de chambres
  - /pro/revenus → Historique revenus
  - **Livrable** : Gestion Pro complète

### Point de synchro
> À la fin de Phase 4 : un pro peut créer un voyage, voir ses réservations et ses revenus.

---

## PHASE 5 — PORTAIL ADMIN (Semaine 4-5)

### Cowork BACK
- [x] **LOT B-009** : API Admin
  - GET /admin/travels (tous les voyages + pending)
  - POST /admin/travels/:id/approve (approuver voyage)
  - POST /admin/travels/:id/reject (rejeter)
  - GET /admin/bookings (toutes les réservations)
  - GET /admin/users (gestion utilisateurs)
  - GET /admin/finance (vue financière globale)
  - **Livrable** : Back-office admin complet

### Cowork FRONT
- [x] **LOT F-009** : Dashboard Admin
  - /admin/dashboard → KPIs globaux
  - /admin/voyages → Modération (approuver/rejeter)
  - /admin/utilisateurs → Gestion RBAC
  - /admin/finance → Vue CA, marges, TVA
  - **Livrable** : Admin opérationnel

---

## PHASE 6 — PRODUCTION (Semaine 5-6)

### Cowork BACK
- [x] **LOT B-010** : Déploiement production ✅ (2026-03-15)
  - Docker compose production (`docker-compose.prod.yml`) ✅
  - Variables d'environnement Scaleway (`backend/.env.production.example`) ✅
  - Migration Prisma production (via `docker-entrypoint.sh`) ✅
  - Stripe mode live (documenté + validé dans deploy script) ✅
  - Sentry backend (SentryModule global déjà intégré) ✅
  - Nginx TLS + rate limiting (`nginx/nginx.prod.conf`) ✅
  - Script déploiement rolling update (`scripts/deploy-prod.sh`) ✅
  - GitHub Actions CI/CD (`.github/workflows/deploy.yml`) ✅
  - **Livrable** : Infrastructure production complète ✅

### Cowork FRONT
- [x] **LOT F-010** : Déploiement production
  - Build Next.js optimisé
  - Vercel ou Scaleway
  - Domaine eventy.life
  - Sentry frontend
  - **Livrable** : Site en production

---

## Résumé Timing

| Phase | Semaine | Résultat |
|-------|---------|----------|
| 1. Auth | S1 | Inscription + Connexion ✅ |
| 2. Catalogue | S1-2 | Recherche + Détail voyage ✅ |
| 3. Checkout | S2-3 | **Réservation + Paiement = MVP** ✅ |
| 4. Pro | S3-4 | Portail professionnel ✅ |
| 5. Admin | S4-5 | Back-office admin ✅ |
| 6. Production | S5-6 | Site en ligne ✅ |

---

## Règles de communication entre Cowork

1. **Le Back livre un endpoint** → il met à jour `CONTRAT-API-COWORK.md` avec le format exact de la requête/réponse
2. **Le Front consomme l'endpoint** → il confirme que ça marche ou signale un bug
3. **Conflit** → le PDG Cowork arbitre
4. **Jamais de mock côté Front** pour un endpoint que le Back a déjà livré
5. **Chaque LOT terminé** → mettre à jour ce fichier (cocher la case)
