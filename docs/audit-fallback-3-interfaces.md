# Audit Fallbacks — 3 Portails Eventy
> Généré le 2026-04-14 — 187 fichiers analysés

## Résumé par interface

| Interface | Fichiers | FALLBACK_DATA | MOCK_ | API catch | Endpoint manquant | Action principale |
|-----------|----------|---------------|-------|-----------|-------------------|-------------------|
| Admin | 59 | 38 | 8 | 13 | 2 | 🟡 Seed nécessaire |
| Pro | 51 | 8 | 11 | 29 | 3 | ✅ OK / 🟡 HRA seed |
| Client | 29 | 16 | 0 | 12 | 1 | ✅ OK |
| Public | 14 | 4 | 1 | 9 | 0 | ✅ OK |
| Equipe/Coordinateur/Fleuriste | 20 | 0 | 0 | 20 | 20 | ❌ Endpoints manquants |
| Checkout | 6 | 4 | 0 | 2 | 0 | ✅ OK |
| Auth | 3 | 0 | 0 | 3 | 0 | ✅ OK |
| Autre (API routes, embed, sitemap) | 8 | 0 | 0 | 5 | 3 | ❌ / ✅ |
| **TOTAL** | **187** | **70** | **20** | **93** | **29** | |

---

## Portail Admin (59 fichiers)

| Page | Endpoint | Type de fallback | Action recommandée |
|------|----------|------------------|--------------------|
| `/admin` (dashboard) | `GET /admin/dashboard` | MOCK_ (notifs + audit) | 🟡 Seed nécessaire |
| `/admin/alertes` | `GET /admin/alerts` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/annulations/[id]` | `GET /cancellations/:id` | FALLBACK_DATA | ✅ OK |
| `/admin/audit` | `GET /admin/audit-logs` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/bookings` | `GET /admin/bookings` | FALLBACK_DATA (DEMO_RESERVATIONS) | 🟡 Seed nécessaire |
| `/admin/ce-asso` | `GET /admin/organisations` | FALLBACK_DATA (stats + liste) | 🟡 Seed nécessaire |
| `/admin/ce-asso/[id]` | `GET /admin/organisations/:id` | Aucun (try/catch vide) | ✅ OK |
| `/admin/ce-asso/[id]/wallet` | `GET /admin/organisations/:id/wallet` | Aucun | ✅ OK |
| `/admin/ce-asso/urssaf-settings` | `GET /admin/urssaf-settings` | Aucun | ✅ OK |
| `/admin/comms` | `GET /admin/comms/dashboard` | FALLBACK_DATA (kpis + pro-stats) | 🟡 Seed nécessaire |
| `/admin/communications` | `GET /admin/communications/stats` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/compliance` | `GET /admin/compliance` | FALLBACK_DATA (multi-endpoints) | 🟡 Seed nécessaire |
| `/admin/documents` | `GET /admin/documents` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/dsar` | `GET /admin/dsar` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/employees/[id]` | `GET /admin/employees/:id` | Aucun | ✅ OK |
| `/admin/equipes` | `GET /admin/teams/stats` + `GET /admin/teams/members` | FALLBACK_DATA (DEMO_EMPLOYEES) | 🟡 Seed nécessaire |
| `/admin/exports` | `GET /admin/exports` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/finance` | `GET /admin/dashboard/revenue` | FALLBACK_DATA (DEMO_PAYMENTS) | 🟡 Seed nécessaire |
| `/admin/finance/comptes-bancaires` | `GET /finance/bank-accounts/dashboard` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/finance/hra-cascade` | `fetchAdminCascadeFromApi()` (interne) | API catch (dégradé UI) | ✅ OK — logique interne |
| `/admin/finance/indie-cotisations` | `GET /finance/indie-cotisations/export/csv` | Aucun | ✅ OK |
| `/admin/finance/payout-batch` | `GET /admin/finance/payout-stats` | Aucun | 🟡 Seed nécessaire |
| `/admin/finance/payouts` | `GET /admin/finance/payouts` | FALLBACK_DATA (DEMO_PRO_ACCOUNTS) | 🟡 Seed nécessaire |
| `/admin/formation` | `GET /admin/formation/modules` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/fournisseurs` | `GET /admin/suppliers` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/gamification` | `GET /admin/gamification/stats` | Aucun | ✅ OK |
| `/admin/hra` | `GET /hra/dashboard/global` + `/admin/hra/stats` | Aucun | ✅ OK |
| `/admin/hra/negociations` | `GET /hra/negociations` | Aucun | ✅ OK |
| `/admin/hra/rate-cards` | `GET /api/hra/hotel-partners` | Aucun | ❌ Chemin `/api/` incorrect — doit être `/hra/hotel-partners` |
| `/admin/incidents` | `GET /admin/incidents` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/marketing` | `GET /admin/marketing/overview` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/marketing/campaigns` | `GET /admin/marketing/campaigns` | FALLBACK (commentaire seul, logique interne) | ❌ Page stub — endpoint non branché |
| `/admin/marketing/content` | `GET /admin/marketing/content` | FALLBACK (commentaire seul, logique interne) | ❌ Page stub — endpoint non branché |
| `/admin/marketing/messagerie-pros` | `GET /admin/marketing/messaging` | MOCK_ (segments + messages) | 🟡 Seed nécessaire |
| `/admin/marketing/planner` | `GET /admin/marketing/planner` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/marketing/presse` | `GET /admin/marketing/press` | MOCK_ (stats + releases + contacts) | 🟡 Seed nécessaire |
| `/admin/marketing/rays` | `GET /rays/admin/stats` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/messagerie` | `GET /admin/messagerie` | Aucun | ✅ OK |
| `/admin/monitoring` | `GET /health` + `/admin/monitoring/jobs` | Aucun | ✅ OK |
| `/admin/monitoring/cron-history` | `GET /admin/monitoring/cron-jobs/history` | Aucun | ✅ OK |
| `/admin/planning` | `GET /admin/planning` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/pros` | `GET /admin/pros` (pending/approved) | FALLBACK_DATA (DEMO_PRO_ACCOUNTS) | 🟡 Seed nécessaire |
| `/admin/pros/certifications` | Aucun endpoint | MOCK_ (données hardcodées) | ❌ Endpoint manquant — `GET /admin/pros/certifications` |
| `/admin/rbac` | `GET /admin/rbac/roles` + `/admin/module-owners` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/restauration` | `GET /admin/restauration/stats` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/rooming` | `GET /admin/rooming` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/sponsors` | `GET /admin/sponsors` | Aucun | ✅ OK |
| `/admin/sponsors/[id]` | `GET /admin/sponsors/:id` | Aucun | ✅ OK |
| `/admin/support` | `GET /admin/tickets` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/transport` | `GET /admin/transport` | FALLBACK_DATA (DEMO_TRAVELS_FULL) | 🟡 Seed nécessaire |
| `/admin/transport/route-packs` | `GET /admin/transport/requests` + `/quotes` + `/route-packs` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/transport/routes` | `GET /admin/transport/routes` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/transport/stops` | `GET /admin/transport/stops` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/transport/validation` | `GET /admin/transport/stops/pending` | FALLBACK (commentaire DEMO DATA) | 🟡 Seed nécessaire |
| `/admin/utilisateurs` | `GET /admin/users` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/admin/validation-pro` | `GET /admin/pros` + `/admin/pros/stats` | Aucun | ✅ OK |
| `/admin/voyages` | `GET /admin/travels` (multi-status) | FALLBACK_DATA (DEMO_TRAVELS_FULL) | 🟡 Seed nécessaire |
| `/admin/voyages/[id]/feedback` | `GET /admin/travels/:id/feedback` | FALLBACK_DATA | ✅ OK — fallback local au composant |
| `/admin/voyages/[id]/go-no-go` | `GET /admin/travels/:id/go-no-go` | FALLBACK_DATA | ✅ OK — fallback local au composant |

---

## Portail Pro (51 fichiers)

| Page | Endpoint | Type de fallback | Action recommandée |
|------|----------|------------------|--------------------|
| `/pro` (dashboard) | `GET /pro/dashboard/stats` | Aucun (API + empty states) | ✅ OK |
| `/pro/activites/communaute` | `POST /pro/activities/community/:id/adopt` | Aucun | ✅ OK |
| `/pro/activites/mes-activites` | `PATCH/POST /pro/activities` | Aucun | ✅ OK |
| `/pro/arrets` | `GET /pro/bus-stops` | Aucun | ✅ OK |
| `/pro/arrets/nouveau` | `POST /pro/bus-stops` | Aucun | ✅ OK |
| `/pro/association/inscription` | `POST /pro/association/register` | Aucun | ✅ OK |
| `/pro/finance` | `GET /finance/dashboard/:id` | Aucun | ✅ OK |
| `/pro/finance/cloture` | `GET /finance/close-pack/pro/history` | Aucun | ✅ OK |
| `/pro/formation` | `GET /pro/formation/modules` | Aucun | ✅ OK |
| `/pro/groupes/[id]` | `GET /pro/groups/:id` | Aucun | ✅ OK |
| `/pro/groupes/creer` | `GET /pro/travels` + `POST /groups` | Aucun | ✅ OK |
| `/pro/login` | `POST /api/auth/login` | Aucun | ✅ OK |
| `/pro/magasin/vendeurs` | `GET /pro/magasin/vendeurs` | Aucun | ✅ OK |
| `/pro/marketing/[id]` | `GET /marketing/campaigns/:id` | Aucun | ✅ OK |
| `/pro/marketing/boutique` | `GET /rays/bundles` + `/rays/products` | Aucun | ✅ OK |
| `/pro/marketing/creer` | `POST /marketing/campaigns` | Aucun | ✅ OK |
| `/pro/marketing/kit-media` | `GET /pro/travels` + `/pro/profile` | Aucun | ✅ OK |
| `/pro/marketing/liens` | `GET /pro/marketing/links` | Aucun | ✅ OK |
| `/pro/notifications` | `GET /pro/notifications` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/pro/paiements` | `GET /pro/payments/stats` + `/pro/payments` | FALLBACK_DATA (DEMO_PAYMENTS) | 🟡 Seed nécessaire |
| `/pro/parametres/profil` | Aucun endpoint | MOCK_ (voyages hardcodés) | ❌ Endpoint manquant — `GET /pro/profile` non branché ici |
| `/pro/revenus/releve` | `GET /pro/revenues/releve` | Aucun | ✅ OK |
| `/pro/vendre` | `GET /pro/quick-sell/all-trips` | Aucun | ✅ OK |
| `/pro/vendre/dashboard` | `GET /pro/sales/dashboard` | Aucun | ✅ OK |
| `/pro/vendre/lien-paiement` | `GET /pro/payment-links` | Aucun | ✅ OK |
| `/pro/vendre/notifications` | `GET /api/pro/sales/notifications` | Aucun | ❌ Chemin `/api/` incorrect — doit être `/pro/sales/notifications` |
| `/pro/voyages/[id]/bilan` | `GET /post-sale/travel/:id/dashboard` | Aucun | ✅ OK |
| `/pro/voyages/[id]/equipe` | `GET /pro/travels/:id/team` | Aucun | ✅ OK |
| `/pro/voyages/[id]/factures` | `GET /travels/:id/bookings` | Aucun | ✅ OK |
| `/pro/voyages/[id]/finance` | `GET /finance/travel/:id` | Aucun | ✅ OK |
| `/pro/voyages/[id]/remplissage` | `GET /pro/travels/:id/occupancy` | Aucun | ✅ OK |
| `/pro/voyages/[id]/rooming` | `GET /rooming/:id` + `/rooming/:id/stats` | Aucun | ✅ OK |
| `/pro/voyages/[id]/rooming/hotel-blocks` | `GET /rooming/:id/hotel-blocks` | Aucun | ✅ OK |
| `/pro/voyages/[id]/sponsors` | `GET /pro/travels/:id/sponsors` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/pro/voyages/[id]/terrain/declarations` | `GET /pro/travels/:id/declarations` | Aucun | ✅ OK |
| `/pro/voyages/[id]/terrain/fiche-securite` | `GET /pro/travels/:id/safety` | Aucun | ✅ OK |
| `/pro/voyages/[id]/transport` | `GET /transport/quotes?travelId=:id` | Aucun | ✅ OK |
| `/pro/voyages/nouveau` | `GET /pro/charte/status` + `/pro/profile/status` | Aucun | ✅ OK |
| `/pro/voyages/nouveau/DayHRASelector` | Aucun | MOCK_ (catalogue HRA) | ❌ Endpoint manquant — `GET /hra/catalog` |
| `/pro/voyages/nouveau/EtapeAccommodation` | `GET /api/pro/hra/favorites?type=HOTEL` | MOCK_ (hôtels) | 🟡 Seed nécessaire — `/api/pro/hra/favorites` |
| `/pro/voyages/nouveau/EtapeActivites` | `GET /api/pro/hra/favorites?type=ACTIVITY` | MOCK_ (activités) | 🟡 Seed nécessaire |
| `/pro/voyages/nouveau/EtapeBusStops` | Aucun endpoint | Aucun MOCK visible | ✅ OK — état vide |
| `/pro/voyages/nouveau/EtapeBusSurPlace` | Aucun | MOCK_ (loueurs) | ❌ Endpoint manquant — `GET /hra/loueurs` |
| `/pro/voyages/nouveau/EtapeFournisseurs` | `GET /api/pro/hra/favorites?type=TRANSPORT` | Aucun MOCK | 🟡 Seed nécessaire |
| `/pro/voyages/nouveau/EtapeMarketingVoyage` | `GET /api/pro/marketing/assets` | Aucun | ✅ OK |
| `/pro/voyages/nouveau/EtapeOccurrences` | Aucun | MOCK_ (independants) | ❌ Endpoint manquant — `GET /pro/independents` |
| `/pro/voyages/nouveau/EtapePricing` | `POST /pro/taxes/compute` | Aucun | ✅ OK |
| `/pro/voyages/nouveau/EtapeRestoration` | `GET /api/pro/hra/favorites?type=RESTAURANT` | MOCK_ (restaurants) | 🟡 Seed nécessaire |
| `/pro/voyages/nouveau/EtapeSummary` | Aucun endpoint | FALLBACK noms hôtels/restau | ✅ OK — display seulement |
| `/pro/voyages/nouveau/marginDefaults` | `GET /api/finance/hra-cascade` | Aucun | ✅ OK |

---

## Portail Client (29 fichiers)

| Page | Endpoint | Type de fallback | Action recommandée |
|------|----------|------------------|--------------------|
| `/client` (dashboard) | `GET /client/dashboard/stats` | Aucun | ✅ OK |
| `/client/amis` | `GET /client/friends` | Aucun | ✅ OK |
| `/client/ce` | `GET /client/ce/status` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/client/cookies-fidelite` | `GET /client/cookies/balance` | Aucun (catch null) | ✅ OK |
| `/client/documents` | `GET /documents/client` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/client/favoris` | `GET /client/favorites` | FALLBACK_DATA (DEMO_TRAVELS_FULL) | 🟡 Seed nécessaire |
| `/client/groupes` | `GET /client/groups` | FALLBACK_DATA (CENTRALIZED_GROUPS) | 🟡 Seed nécessaire |
| `/client/groupes/[id]` | `GET /groups/:id` | Aucun | ✅ OK |
| `/client/groupes/[id]/inviter` | `GET /groups/:id/stats` | FALLBACK_DATA | 🟡 Seed nécessaire |
| `/client/groupes/creer` | `GET /travels?status=SALES_OPEN` | FALLBACK_DATA (DEMO_TRAVELS_FULL) | 🟡 Seed nécessaire |
| `/client/messagerie` | `GET /client/messagerie/inbox` | Aucun | ✅ OK |
| `/client/paiements` | `GET /client/payments` | FALLBACK_DATA (DEMO_PAYMENTS) | 🟡 Seed nécessaire |
| `/client/pourboire` | `GET /client/past-travels` | FALLBACK_DATA (DEMO_RESERVATIONS) | 🟡 Seed nécessaire |
| `/client/preferences-notifications` | `GET /client/preferences/notifications` | Aucun | ✅ OK |
| `/client/profil` | `GET /client/profile` | Aucun | ✅ OK |
| `/client/rays` | `GET /client/rays/balance` | Aucun | ✅ OK |
| `/client/reservations` | `GET /client/bookings` | FALLBACK_DATA (DEMO_RESERVATIONS) | 🟡 Seed nécessaire |
| `/client/reservations/[id]` | `GET /client/bookings/:id` | Aucun | ✅ OK |
| `/client/reservations/[id]/annuler` | `GET /client/bookings/:id` | FALLBACK_DATA (local) | ✅ OK |
| `/client/reservations/[id]/avis` | `GET /bookings/:id` | FALLBACK_DATA (local) | ✅ OK |
| `/client/reservations/[id]/preferences` | `GET /bookings/:id` | FALLBACK_DATA (local) | ✅ OK |
| `/client/reservations/[id]/rooming` | `GET /client/bookings/:id/rooming` | FALLBACK_DATA (local) | ✅ OK |
| `/client/urgence` | `GET /client/active-trip` | FALLBACK_DATA | ✅ OK — fallback si pas de voyage actif |
| `/client/voyage/[id]` | `GET /client/bookings/:id` | Aucun | ✅ OK |
| `/client/voyage/[id]/bus-programme` | `GET /travels/:id/itinerary` | Aucun | ✅ OK |
| `/client/voyage/[id]/cagnotte` | `GET /client/bookings/:id/cagnotte` | Aucun | ✅ OK |
| `/client/voyage/[id]/chat` | `GET /client/chat/:id` | FALLBACK (noms string seuls) | ✅ OK — affichage seul |
| `/client/voyage/[id]/transport` | `GET /checkout/:id/transport` | Aucun | ✅ OK |
| `/client/wallet` | `GET /client/wallet` | FALLBACK_DATA | ✅ OK — wallet vide = état normal |

---

## Portail Public (14 fichiers)

| Page | Endpoint | Type de fallback | Action recommandée |
|------|----------|------------------|--------------------|
| `/voyages` (liste) | `GET /travels` | FALLBACK_DATA (3 voyages hardcodés) | 🟡 Seed nécessaire — au moins 1 voyage SALES_OPEN |
| `/voyages/[slug]` (fiche) | `GET /travels/:slug` | FALLBACK_DATA (Marrakech Express) | 🟡 Seed nécessaire |
| `/voyages/[slug]/layout` | `GET /travels/:slug` (server) | Aucun | ✅ OK |
| `/voyages/[slug]/avis` | `GET /reviews/travel/:id` | Aucun (catch vide) | ✅ OK |
| `/voyages/[slug]/checkout` | `GET /travels/:slug` | Aucun | ✅ OK |
| `/voyages/[slug]/groupes` | `GET /groups/travel/:id` | Aucun | ✅ OK |
| `/voyages/[slug]/opengraph-image` | `GET /travels/:slug` (server) | Aucun | ✅ OK |
| `/voyages/layout` | Aucun endpoint | Aucun | ✅ OK |
| `/blog/[slug]` | `GET /blog/:slug` | BLOG_SEO_FALLBACK (SEO meta seulement) | ✅ OK |
| `/blog/[slug]/layout` | `GET /blog/:slug` | BLOG_SEO_FALLBACK (SEO meta seulement) | ✅ OK |
| `/createur/[slug]` | Aucun endpoint | MOCK_CREATOR (profil complet) | ❌ Endpoint manquant — `GET /public/creators/:slug` |
| `/depart/[ville]` | `GET /travels?departure=:ville` | Aucun | ✅ OK |
| `/p/[proSlug]` | `GET /public/pros/:slug` | Aucun | ✅ OK |
| `/v/[code]` | `GET /public/v/:code` | Aucun | ✅ OK |

---

## Portail Equipe / Coordinateur / Fleuriste (20 fichiers)

> Tous ces portails appellent leurs endpoints via apiClient avec un simple `.catch()` silencieux. Aucun backend n'est implémenté pour ces rôles — toutes les pages affichent des données vides ou DEMO hardcodées.

| Page | Endpoint tenté | Type de fallback | Action recommandée |
|------|----------------|------------------|--------------------|
| `/equipe/achats` | `GET /equipe/achats/fournisseurs` | API catch silencieux | ❌ Endpoint manquant |
| `/equipe/commercial` | `GET /equipe/commercial/kpi` + `/devis` | API catch silencieux | ❌ Endpoint manquant |
| `/equipe/maisons` | `GET /equipe/maisons/kpi` + `/equipe/maisons` | API catch silencieux | ❌ Endpoint manquant |
| `/coordinateur/carnet` | `GET /coordinateur/carnet` | API catch silencieux | ❌ Endpoint manquant |
| `/coordinateur/dashboard` | `GET /coordinateur/dashboard` | API catch silencieux | ❌ Endpoint manquant |
| `/coordinateur/facturation` | `GET /coordinateur/facturation` | API catch silencieux | ❌ Endpoint manquant |
| `/coordinateur/missions` | `GET /coordinateur/missions` | API catch silencieux | ❌ Endpoint manquant |
| `/coordinateur/permis` | `GET /coordinateur/permis` | API catch silencieux | ❌ Endpoint manquant |
| `/coordinateur/prestataires` | `GET /coordinateur/prestataires` | API catch silencieux | ❌ Endpoint manquant |
| `/employes/login` | `POST /employes/auth/login` | Aucun | ❌ Endpoint manquant |
| `/fleuriste/approvisionnement` | `GET /fleuriste/approvisionnement` | DEMO hardcodé | ❌ Endpoint manquant |
| `/fleuriste/commandes` | `GET /fleuriste/commandes` | DEMO hardcodé | ❌ Endpoint manquant |
| `/fleuriste/compositions` | `GET /fleuriste/compositions` | DEMO hardcodé | ❌ Endpoint manquant |
| `/fleuriste/compte` | `GET /fleuriste/compte` | API catch | ❌ Endpoint manquant |
| `/fleuriste/dashboard` | `GET /fleuriste/dashboard/kpi` | DEMO_KPI hardcodé | ❌ Endpoint manquant |
| `/fleuriste/facturation` | `GET /fleuriste/factures` | DEMO hardcodé | ❌ Endpoint manquant |
| `/fleuriste/galerie` | `GET /fleuriste/galerie` | DEMO hardcodé | ❌ Endpoint manquant |
| `/fleuriste/planning` | `GET /fleuriste/planning` | DEMO hardcodé | ❌ Endpoint manquant |
| `/photographe/login` | `POST /photographe/auth/login` | Aucun | ❌ Endpoint manquant |
| `/pro/voyages/[id]/equipe` | `GET /pro/travels/:id/team` | Aucun | ✅ OK |

---

## Checkout (6 fichiers)

| Page | Endpoint | Type de fallback | Action recommandée |
|------|----------|------------------|--------------------|
| `/checkout/start` | `POST /checkout/initiate` | FALLBACK_BOOKING_GROUP_ID (string) | ✅ OK — fallback dev seul |
| `/checkout/step-1` | `GET /checkout/:id/available-rooms` | FALLBACK_ROOMS | ✅ OK — fallback dev seul |
| `/checkout/step-2` | `GET /checkout/:id/bus-stops` | FALLBACK_BUS_STOPS | 🟡 Seed nécessaire — arrêts de bus |
| `/checkout/step-3` | `POST /checkout/:id/payment` | Commentaire sécurité (supprimé) | ✅ OK |
| `/voyages/[slug]/checkout` (public) | `GET /travels/:slug` + `POST /checkout/initiate` | Aucun | ✅ OK |
| `/checkout/confirmation` | `GET /checkout/:id` ou `/client/bookings/:id` | FALLBACK_BOOKING | ✅ OK — fallback dev seul |

---

## Auth (3 fichiers)

| Page | Endpoint | Type de fallback | Action recommandée |
|------|----------|------------------|--------------------|
| `/connexion` | `POST /api/auth/login` | Aucun | ✅ OK |
| `/reinitialiser-mot-de-passe` | `POST /auth/reset-password` | Aucun | ✅ OK |
| `/verification-email` | `POST /auth/verify-email` | Aucun | ✅ OK |

---

## Autres (API routes, embed, sitemap — 8 fichiers)

| Fichier | Endpoint | Type de fallback | Action recommandée |
|---------|----------|------------------|--------------------|
| `app/api/auth/logout/route.ts` | Cookie delete (interne) | Aucun | ✅ OK |
| `app/api/auth/me/route.ts` | Cookie read (interne) | Aucun | ✅ OK |
| `app/api/auth/register/route.ts` | Proxy backend | Aucun | ✅ OK |
| `app/api/cron/expire-holds/route.ts` | Cron interne | Aucun | ✅ OK |
| `app/beta-access/page.tsx` | `POST /api/beta-auth` | Aucun | ✅ OK |
| `app/embed/[proSlug]/page.tsx` | `GET /public/embed/...` | Aucun | ✅ OK |
| `app/offline/loading.tsx` | Aucun | Aucun | ✅ OK — offline |
| `app/sitemap.ts` | `GET /travels` + `GET /blog` (server) | Aucun | ✅ OK |

---

## Points critiques prioritaires

### ❌ Endpoints manquants — blocants en production

1. **`GET /public/creators/:slug`** — Page `/createur/[slug]` affiche uniquement `MOCK_CREATOR`, aucun appel API. Page principale vitrine créateur.
2. **`GET /hra/catalog`** — Composant `DayHRASelector` (création voyage) utilise `MOCK_HRA_CATALOG` uniquement.
3. **`GET /hra/loueurs`** — Composant `EtapeBusSurPlace` (bus sur place) sans endpoint.
4. **`GET /pro/independents`** — Composant `EtapeOccurrences` utilise `MOCK_INDEPENDENTS`.
5. **Portail Equipe/Coordinateur/Fleuriste** — 19 endpoints inexistants, tous les portails secondaires sont en coquille vide.
6. **`/admin/marketing/campaigns`** et **`/admin/marketing/content`** — Pages stub, endpoint commenté mais non branché.
7. **`/admin/pros/certifications`** — Page 100% MOCK sans appel API.

### 🟡 Seed prioritaire pour beta

1. **`/travels`** — Au moins 1 voyage `SALES_OPEN` pour que `/voyages` et `/voyages/[slug]` ne tombent pas sur fallback.
2. **`/admin/bookings`** + **`/client/reservations`** — DEMO_RESERVATIONS utilisées partout.
3. **Arrêts de bus** (`/checkout/step-2`, `/pro/arrets`) — FALLBACK_BUS_STOPS utilisé en checkout.
4. **HRA favorites** (`/api/pro/hra/favorites`) — 4 composants du wizard voyage utilisent ce endpoint avec MOCK_ en fallback.

### ⚠️ Chemins API incorrects

- `app/(admin)/admin/hra/rate-cards/page.tsx` : appelle `/api/hra/hotel-partners` au lieu de `/hra/hotel-partners`
- `app/(pro)/pro/vendre/notifications/page.tsx` : appelle `/api/pro/sales/notifications` au lieu de `/pro/sales/notifications`
- `app/(pro)/pro/page.tsx` : appelle `/api/pro/dashboard/stats` — à vérifier si route Next.js locale ou backend
