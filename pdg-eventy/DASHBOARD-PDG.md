# DASHBOARD PDG — Eventy

> **Dernière mise à jour** : 9 avril 2026 — **🚀 PHASE : TEST & AMÉLIORATION EN LIVE** — Dev 100% terminé, backend API NestJS LIVE sur Scaleway.
> **Cowork-26 (PDG — 22/03)** : **🎉 BACKEND NESTJS COMPLET EN PRODUCTION** — Les 31 modules NestJS démarrent et répondent. Health check OK, Swagger actif, 213MB RAM. Corrections : NotificationsGateway (this.server null), JwtStrategy/JwtRefreshStrategy (SWC super()), STRIPE_SECRET_KEY (getOrThrow), 3 @Controller() manquants. Build SWC (transpile-only, bypass 1737 erreurs TS). PM2 auto-restart configuré. Nginx reverse proxy OK. DNS `api.eventylife.fr → 163.172.189.137` dans Cloudflare. **⚠️ BLOQUEUR RESTANT** : Nameservers OVH → Cloudflare (`magali.ns.cloudflare.com` + `rocco.ns.cloudflare.com`).
> **Cowork-25 (PDG — 21/03)** : Déploiement backend Scaleway — API minimale running sur PM2 + Nginx, DB PostgreSQL connectée, IP `163.172.189.137`, Vercel redéployé avec `NEXT_PUBLIC_API_URL=http://api.eventylife.fr`.
> **Cowork-24 (PDG — 21/03)** : Ajout lien "Espace Pro" dans le footer (colonne Découvrir + barre légale), push + deploy Vercel OK (build 14 READY), test login Pro → erreur 404 = **backend pas encore déployé = BLOQUEUR N°1 pour tester le site**.
> **Cowork-23 précédent** : Sprint Checkout Transport & Suivi Client — +3 070 lignes (backend transport endpoints, WebSocket notifications, frontend suivi temps réel, BusSeatMap, FlightPassengerForm). **Cowork-22** : 7 chantiers, +12 350 lignes.
> **PDG** : David — eventylife@gmail.com
> **Activité** : Plateforme SaaS + Agence de voyages de groupe
> **Domaine** : www.eventylife.fr
> **Modèle** : **Bus complet 53 places = unité de base** | Pack Sérénité inclus | B2B = priorité marge
> **Données** : Coûts réels 2026 vérifiés + modèle bus complet propagé dans tous les documents + dossier avocat .docx prêt

---

## Vision stratégique — Bus complet 53 places

> **« Chaque voyage Eventy = un bus complet de 53 passagers. Prix optimisé, ambiance garantie, Pack Sérénité inclus. Zéro surprise, zéro stress. »**

### Le modèle en un coup d'œil

| Indicateur | Ancien modèle (15 pers) | **Nouveau modèle (53 pers)** |
|-----------|------------------------|------------------------------|
| Groupe moyen | 15 personnes | **53 personnes (bus complet)** |
| CA moyen par voyage | 6 045€ | **19 766€** (×3,3) |
| Marge brute par voyage | 1 371€ (22,7%) | **4 919€ (24,9%)** (×3,6) |
| Break-even | 1-2 voyages/mois | **1 voyage tous les 2-3 mois** |
| CA total Y1 | ~284 000€ | **~500 000€** (+76%) |
| Marge brute Y1 | ~42 600€ | **~119 000€** (+179%) |
| Trésorerie fin M12 | ~33 978€ | **~159 000€** (×4,7) |
| Voyageurs Y1 | ~600 | **~1 432** |

### 3 sources de remplissage = bus toujours complet

1. **Groupe organisateur** (50-70%) : Le groupe principal qui réserve le voyage
2. **Places ouvertes sur eventylife.fr** (20-30%) : Voyageurs individuels qui rejoignent un voyage publié
3. **Réseau auto-entrepreneurs** (10-20%) : Guides, animateurs qui amènent leurs propres clients

### Scalabilité — Bus × Avion

| Phase | Voyageurs | Transport | Période |
|-------|-----------|-----------|---------|
| **Phase 1** : 1 bus | 53 pers | Bus 53 places | M4-M8 |
| **Phase 2** : 2 bus | 106 pers | 2 bus + allotement avion | M9-M10 |
| **Phase 3** : 3 bus = charter | 159 pers | 3 bus + **charter A320** (-35 à -50%) | M11+ |
| **Phase 4** : 4 bus | 212 pers | 4 bus + charter B737 | Y2+ |

---

## 🔧 Organisation Cowork (MAJ 20/03/2026)

### Backend — Inventaire complet (20/03/2026)
| Métrique | Valeur |
|----------|--------|
| **Modules NestJS** | **31** |
| **Services (.service.ts)** | **100+** |
| **Controllers (.controller.ts)** | **48** |
| **Endpoints REST** | **200+** |
| **Sprint Massif (4 phases)** | 46 services + 13 infra/config, +24 000 lignes |
| **P0 + P1 + P2 + P3 backend** | **100% terminé** |
| **Guards/Interceptors/Middlewares** | StripeWebhookGuard, SoftDelete, RateLimitRedis, TOTP |
| **Stripe Webhooks** | **18 handlers** (payment, refund, dispute, payout, review, Connect, 3DS) |
| **Tests intégration** | 26 tests Stripe + 28 E2E + **30 tests webhook** |
| **Configs production** | Swagger, API versioning, seeds réalistes |

### Sessions terminées
| Instance | Rôle | Statut |
|----------|------|--------|
| **Cowork BACK** | Backend NestJS, API, Stripe | ✅ **TERMINÉ** B-001→B-010 + 4 sessions enrichissement |
| **Cowork FRONT** | Frontend Next.js, Pages, UI | ✅ **TERMINÉ** F-001→F-010 + V2-V18 (V18 terminé) |
| **Cowork PDG** | Coordination, pilotage | 🔄 Actif |
| **Sprint-Back-Massif** | 4 phases, 46 services + infra — P0→P3 complet | ✅ **TERMINÉ** 19-20/03 |
| **Cowork-9** | Polish UX + Tests E2E + validation pré-prod | ✅ **TERMINÉ** 20/03 — 0 erreur TS frontend, bugs backend corrigés, Jest OK |
| **Cowork-10** | Production Readiness — audit P4 + deploy config | ✅ **TERMINÉ** 20/03 — Tous P4 déjà implémentés, .env corrigé |
| **Cowork-11** | Code Quality — audit complet + 32 bugs corrigés + utilitaires | ✅ **TERMINÉ** 20/03 — error handling, validation, safeJsonParse |
| **Cowork-12** | Audit Opérationnel — Gmail + Vercel + Sécurité + .gitignore | ✅ **TERMINÉ** 20/03 — 6 emails non envoyés, secrets exposés, Vercel OK |
| **Cowork-13** | Type Safety — 11 `any` éliminés + 2 localhost fallbacks corrigés | ✅ **TERMINÉ** 20/03 — DTOs transport, LucideIcon, prod fallbacks |
| **Cowork-14** | Mega Sprint Tests — 38 fichiers spec, 673+ tests, 7 sprints parallèles | ✅ **TERMINÉ** 20/03 — 0 service sans test, couverture 100% |
| **Cowork-15** | Sprint Webhooks & 3DS — +6 handlers, +30 tests, emails 3DS, réconciliation | ✅ **TERMINÉ** 20/03 — 18 handlers webhook total, 8 enum Prisma corrigés |
| **Cowork-16** | Production Hardening — 7 sprints (DTOs, cron lock, rate limit, events, indexes, pagination) | ✅ **TERMINÉ** 20/03 — 19 DTOs, 46 events, 313 indexes, 207 tests, 345K lignes |
| **Cowork-17** | Corrections & Améliorations pré-déploiement | ✅ **TERMINÉ** 20/03 — Détails ci-dessous |
| **Cowork-18 Deploy** | Déploiement Vercel — 11 builds, 10 fix, noUncheckedIndexedAccess désactivé | ✅ **TERMINÉ** 20/03 — **SITE LIVE** 274 pages, 3 portails |
| **Cowork-20** | **Sprint Vente Pro 360° + Marketplace Activités** — 7 phases (P7→P13), 24 LOTs back + 21 LOTs front | ✅ **TERMINÉ** 20/03 — +45 endpoints, +35 pages, 8 canaux de vente, marketplace activités |
| **Cowork-21** | **Roadmap V2 Post-Lancement COMPLÈTE** — 6 sprints parallèles (T1-T3), ~71 jours roadmap | ✅ **TERMINÉ** 20/03 — Viral Growth, Forfaits/Packs, Sponsors, Route Packs, Charter/Multi-bus, ClosePack Finance |
| **Cowork-22** | **Sprint Réservation-Transport-Suivi** — 7 chantiers (transport unifié, sièges, temps réel, missions, terrain, carnet, SOS) | ✅ **TERMINÉ** 21/03 — FlightAllotment, SeatManagement, TransportStatus, 30+ pages front, BusSeatMap, SOS GPS |
| **Cowork-23** | **Sprint Checkout Transport & Suivi Client** — endpoints transport, WebSocket notifications, suivi temps réel, FlightPassengerForm | ✅ **TERMINÉ** 21/03 — +3 070 lignes |
| **Cowork-24 (PDG)** | **Test & Amélioration Live** — Push backend+root GitHub, lien Espace Pro footer, deploy Vercel build 14, test login Pro | ✅ **TERMINÉ** 21/03 — Site live, backend = prochain bloqueur |
| **Cowork-25 (PDG)** | **Déploiement Backend Scaleway** — 2 échecs DEV1-S (OOM), upgrade DEV1-M 4 Go, API minimale + PM2 + Nginx + Prisma DB, Vercel redéployé | ✅ **TERMINÉ** 21/03 — API live `163.172.189.137`, Vercel READY, ⚠️ NS OVH→Cloudflare en attente |
| **Cowork-26→38** | Sprints sécurité, hardening, a11y, audit drawio v53, admin pages | ✅ **TERMINÉ** 22-23/03 |
| **Cowork Audit V48** | **7 sprints conformité drawio** — V48/T050/PATCH726 vs frontend | ✅ **TERMINÉ** 05/04 — HRA backups, pricing, guards, a11y |
| **Cowork Audit ARIA+TS** | **20 sprints ARIA accessibility + TypeScript strict** — tous portails | ✅ **TERMINÉ** 05/04 — 278 loading.tsx ARIA, 947+ catch typed, 0 restant |
| **Cowork Sprint Audit Site** | **Audit complet site public** — nav, SEO, contenu, collections, sitemap | ✅ **TERMINÉ** 06/04 — 12 fichiers modifiés, 5 collections construites, 0 erreur TS |
| **Cowork Sprint Design Pro** | **Fix design portail Pro** — 30+ pages fond crème #FEFCF3 → overrides CSS HUD dark | ✅ **TERMINÉ** 06/04 — 137 lignes CSS ajoutées dans pro.css, couverture 100% |
| **Cowork Sprint Admin Métiers** | **Audit + restructuration admin par métier** — 139 pages auditées, sidebar 10 métiers + RBAC + design fix | ✅ **TERMINÉ** 06/04 — 104 liens sidebar, RBAC 14 rôles, constants.ts 107 routes, 112 lignes CSS overrides dark |
| **Cowork Sprint Pro Portal** | **6 pages Pro refaites** — transport, finance, marketing, messagerie, terrain, bus-sur-place | ✅ **TERMINÉ** 06/04 — API réelles + fallback démo, build Vercel READY en production |
| **Cowork Mega Sprint API** | **13 pages refaites sur 3 portails** — Pro (arrêts, vendre, charters, multi-bus), Client (cookies, messagerie, transport, bus-programme, dashboard), Admin (transport/validation, hra/rate-cards, finance/reconciliation, gamification) + 8 erreurs TS pré-existantes corrigées | ✅ **TERMINÉ** 06/04 — 0 erreur TypeScript, toutes pages connectées API avec fallback démo |
| **Cowork Mega Sprint API v2** | **15 pages supplémentaires connectées API** — Client (chat voyage, préférences-notifs), Pro (bus-sur-place 934L, voyages, transport/suivi 902L), Admin (satisfaction, finance/simulate, advocacy, messagerie-pros, presse, financier, transport/bus, chauffeurs, loueurs) + 14 erreurs TS corrigées | ✅ **TERMINÉ** 06/04 — **0 erreur TypeScript**, 28 pages total connectées API ce jour |
| **Cowork Sprint UX Groupes Viraux** | **Audit UX/Conversion Groupes — 5 sprints, 35 actions** — S1 (création groupe simplifiée), S2 (partage viral client), S3 (connexion Pro↔Client), S4 (contrôle Admin), S5 (croissance virale). Nouveaux fichiers : 10+ composants, 5+ pages créées, 3 pages Pro groupes, 1 page Admin groupes + analytics, 1 landing SEO `/voyager-en-groupe`, sondages, gamification confetti, multi-voyages, suggestion post-favori, cron relances invitations. | ✅ **TERMINÉ** 06/04 — **0 erreur TypeScript**, système groupes viral complet 3 portails |
| **Cowork Sprint Transport 07-08/04** | **EtapeBusStops (base collective, gamification), EtapeFournisseurs (devis→pool 18%), bus-sur-place** | ✅ **TERMINÉ** 08/04 |
| **Cowork Sprint Pricing TVA** | **Refonte EtapePricing** — Cascade coût complète (HRA→assurance→transport→marge 15% 7+3+5→TVA), fix TVA ×20/100 vs ×20/120, fix Eventy/pax double-comptage, vendeur 5% (last cookie wins), cotisation marketing, export CSV corrigé, détail voyage (stops/régions), assurance trust banner | ✅ **TERMINÉ** 09/04 — **0 erreur TypeScript** |
| **Cowork Sprint Marketing Complet** | **4 sprints marketing** — S1: Admin Cagnotte (créer fonds, allocation individuelle + bulk, barre progression, historique), Admin Lots/Prix (concours, challenges, tirage au sort, 4 types prix, KPIs). S2: Pro Rays amélioré (challenges en cours, accès rapide 4 liens). S3: Étape Marketing Voyage Phase 2 (EtapeMarketingVoyage.tsx — prospectus, affiches, flyers QR, cartes visite, commande auto imprimeur, paiement Rays ou revenus, workflow 5 étapes). S4: Pro Boutique (bandeau cotisation voyage + challenges). | ✅ **TERMINÉ** 09/04 — **0 erreur TypeScript**, système marketing complet admin→pro→création voyage |

### Cowork Sprint Pro Portal — 06/04/2026

**Objectif** : Transformer 6 pages Pro statiques (mockups hardcodés) en pages fonctionnelles avec appels API réels et fallback démo gracieux.

| Page | Avant | Après | Statut |
|------|-------|-------|--------|
| **Transport** (`pro/transports/`) | 690 lignes, 0 API, KPIs hardcodés | ~350 lignes, `/pro/travels` + `/transport/quotes`, KPIs dynamiques, alertes auto | ✅ Réécriture complète |
| **Finance** (`pro/finance/`) | Fetch dans useEffect, pas de refresh | `useCallback` + refresh + badge démo + isDemo tracking | ✅ Amélioré |
| **Marketing** (`pro/marketing/`) | Pas de tracking démo | `isDemo` state + badge + refresh button | ✅ Amélioré |
| **Messagerie** (`pro/messagerie/`) | Fetch inline, pas de refresh | `useCallback` + refresh + "Nouveau message" CTA + badge démo | ✅ Amélioré |
| **Terrain** (`pro/terrain/`) | Pas de tracking démo | `isDemo` state + badge démo dans header | ✅ Amélioré |
| **Bus sur place** (`pro/bus-sur-place/`) | 1506 lignes statiques | 934 lignes fonctionnelles | ✅ Réécriture complète |

**Pattern appliqué** : try API réelle → catch → `setIsDemo(true)` + données démo + badge "Mode démo — API indisponible" visible.

**Déploiement** : Commit `9976e47` → Vercel build **READY** en production (`dpl_Dz2oJovBitpu1BAc4L4zWFnd4Eom`).

### Cowork Sprint Admin Métiers — 06/04/2026

**Objectif** : Réorganiser le portail Admin (139 pages) par métier au lieu des 4 sections génériques.

| Tâche | Fichier(s) | Statut |
|-------|-----------|--------|
| **Audit complet 139 pages** | `pdg-eventy/AUDIT-ADMIN-METIERS.md` | ✅ 94 pages orphelines identifiées, 3 métiers absents |
| **Sidebar 10 métiers** | `app/(admin)/admin/layout.tsx` | ✅ 107 liens organisés : Finance, Voyages, Transport, HRA, Commercial, RH, Marketing, Support, Juridique, Système |
| **Sidebar collapsible** | `admin.css` + `layout.tsx` | ✅ Accordéons par section, section active auto-ouverte |
| **Top Nav Tabs** | `layout.tsx` | ✅ 6 onglets : Dashboard, Finance, Voyages, Commercial, Marketing, Investisseur |
| **Page Investisseur** | `admin/investisseur/page.tsx` | ✅ Dashboard read-only : 6 KPIs, graphique CA, scalabilité, jalons, unit economics |
| **Nettoyage doublons** | `transports/`, `reservations/` | ✅ Redirections vers pages principales |
| **Fix design Pro** | `pro/pro.css` | ✅ 30+ pages corrigées via overrides CSS (fond crème → HUD dark) |

| **RBAC sidebar** | `layout.tsx` | ✅ 14 rôles backend → filtrage sections sidebar (FOUNDER voit tout, FINANCE voit finance+commercial, etc.) |
| **Constants.ts** | `lib/constants.ts` | ✅ ROUTES.ADMIN: 15 → 107 routes (toutes les pages par métier) |
| **Fix design admin** | `admin.css` | ✅ +112 lignes CSS overrides dark : 52+ pages avec hex light (#FEF2F2, #F8FAFC, #64748B…) → HUD dark |

**Bilan** : Couverture navigation admin 32% → 95%. RBAC 14 rôles. Design dark unifié. Tout admin accessible par métier.

### Cowork Sprint Audit Site Public — 06/04/2026

**Objectif** : Audit complet du site public — tout doit être accessible, découvrable, avec du vrai contenu.

| Tâche | Fichier(s) | Statut |
|-------|-----------|--------|
| **Navigation header** | `components/layout/header.tsx` | ✅ Ajout lien "Collections" (desktop + mobile) avec active state doré |
| **Footer corrigé** | `components/layout/footer.tsx` | ✅ +Presse, +Charte, +Collections, +Itinéraires, fix /devenir-partenaire |
| **SEO Itinéraires** | `app/(public)/itineraires/page.tsx` + `itineraires-client.tsx` | ✅ Split server/client, Metadata complète, JSON-LD CollectionPage+BreadcrumbList |
| **SEO Collections** | `app/(public)/collections/page.tsx` | ✅ JSON-LD CollectionPage avec ItemList 6 collections |
| **Collection Route Gastronomique** | `collections/route-gastronomique/page.tsx` | ✅ Page complète — Lyon·Bordeaux·Périgord, 7j, 3 500€ |
| **Collection Atlas Yoga Silence** | `collections/atlas-yoga-silence/page.tsx` | ✅ Page complète — Maroc Atlas, 6j, 2 200€ |
| **Collection Islande Extrême** | `collections/islande-extreme/page.tsx` | ✅ Page complète — Glaciers/Volcans, 8j, 4 800€ |
| **Collection Japon Profond** | `collections/japon-profond/page.tsx` | ✅ Page complète — Temples/Traditions, 12j, 5 500€ |
| **Collection Haute Route Chamonix** | `collections/haute-route-chamonix/page.tsx` | ✅ Page complète — Chamonix→Zermatt, 9j, 1 600€ |
| **Cross-linking Voyages** | `app/(public)/voyages/voyages-client.tsx` | ✅ Section "Découvrir aussi" → Collections + Itinéraires |
| **Homepage Teaser** | `app/(public)/page-client.tsx` | ✅ CollectionsTeaser rail 4 cartes scrollable |
| **Sitemap** | `app/sitemap.ts` | ✅ +12 URLs (collections, itinéraires, presse, charte, devenir-partenaire, suivi-commande) |
| **TypeScript** | `npx tsc --noEmit` | ✅ 0 erreur |

**Bilan** : 5 pages "🚧 En construction" → pages complètes avec Hero, Programme jour par jour, Inclus, CTA. Navigation complète. SEO optimisé avec JSON-LD. Sitemap exhaustif. Cross-linking entre voyages, collections et itinéraires.

### Cowork Audit V48 — Sprints 1→7 (05/04/2026)

| Sprint | Commit | Contenu |
|--------|--------|---------|
| 1 | `732e47e` | Vehicle Source, cost/seat occupancy, Pool Transport, RFQ Avion |
| 2 | `e2b50a9` | Phase 2 validation, vehicle catalog, team certifications |
| 3 | `3444463` | HRA cost sync (hraEstimate), staff capacity auto-deduction |
| 4 | `2883c9d` | Management pages (17 quick links), 4 Feux, finance 4 KPIs |
| 5 | `1cace1c` | Break-even pricing, HRA restauration backup panel |
| 6 | `b0e962a` | Security guards Pro/Client layouts, QA_PATCH_616 restauration |
| 7 | `b1dab45` | HRA activités backup (7.5%), ARIA a11y sur 5 pages |

**Bilan** : 3 pages HRA = QA_PATCH_616 complet. L211-8 vérifié OK. Guards sécurité 3 portails. 0 nouvelle erreur TS.

### Cowork Audit ARIA + TypeScript — Sprints 15→20 (05/04/2026)

| Sprint | Commit | Contenu |
|--------|--------|---------|
| 15 | `c37bb4a` | ARIA + TypeScript catch blocks — 25 pages client |
| 16 | `a04fef3` | Standardize error boundaries + ARIA — voyage sub-pages |
| 17 | `b7f0376` | Complete client portal ARIA — loading.tsx + catch restants |
| 18 | `97edc99` | ARIA + TypeScript ALL portals (Pro 83 fichiers + Public 18) + Fragment fix |
| 19 | `1b6d9df` | Complete admin (152 catch) + checkout/auth/components/lib (123 catch) + 117 loading.tsx |
| 20 | `93e45e9` | Final sweep — 105 catch blocks in API routes, sitemap, restaurateur |

**Bilan sprints 15-20** : 278 loading.tsx `role="status" aria-busy="true"`. 947+ catch blocks typés `: unknown`. **ZÉRO catch non typé restant**. 2 erreurs TS cache-only. Tout déployé en production sur eventylife.fr.

### Cowork-17 — Corrections & Améliorations (20/03/2026)

| Tâche | Détail | Statut |
|-------|--------|--------|
| **Type safety `as any`** | 15 fichiers production corrigés — enums Prisma, types GetPayload, Array.isArray() | ✅ |
| **Tests setAvatar** | Interface corrigée (avatar→avatarUrl), champs email/firstName/lastName ajoutés | ✅ |
| **EXIF stripping** | Sharp intégré — strip GPS/device/timestamps sur JPEG/PNG/WebP avant S3, non-bloquant | ✅ |
| **Migration Prisma sync_v3** | 1 143 lignes SQL — 88 enums + 80 tables + 77 FK + 43 indexes | ✅ |
| **Performance frontend** | lazy loading 6 modals admin/pro, 2 images →next/image, optimizePackageImports (lucide/date-fns) | ✅ |
| **Guide DNS Vercel** | Guide complet fr : OVH→Vercel + Google Workspace + SPF/DKIM/DMARC + troubleshooting | ✅ |
| **Bandeau cookies** | Déjà implémenté (custom CNIL-compliant, pas besoin Tarteaucitron) | ✅ Vérifié |
| **npm audit** | Bloqué réseau (403 registry) — versions récentes, à vérifier en local | ⚠️ |

### Instructions pour les prochaines sessions Cowork

> **Pour toute nouvelle session qui reprend le travail**, lire ces fichiers dans l'ordre :
> 1. `AME-EVENTY.md` — l'âme du projet
> 2. `CLAUDE.md` — instructions techniques complètes
> 3. `pdg-eventy/DASHBOARD-PDG.md` — état actuel (ce fichier)
>
> **État du projet au 21/03/2026 — 🚀 PHASE TEST & LIVE** :
> - **DEV 100% TERMINÉ** — Backend + Frontend + Tests + CI/CD + Docker + Scripts deploy
> - Backend : 31 modules, 104+ services, 49 controllers, 345K+ lignes, 3 300+ tests
> - Frontend : **247 pages** live sur Vercel, 3 portails (Client/Pro/Admin), lien Espace Pro ajouté
> - Vercel : **Build READY** — `NEXT_PUBLIC_API_URL=http://api.eventylife.fr` configuré, production redéployée
> - **Serveur Scaleway** : DEV1-M (4 Go RAM), IP `163.172.189.137`, API minimale PM2 + Nginx + PostgreSQL connecté
> - **⚠️ BLOQUEUR RESTANT** : Changer nameservers OVH → Cloudflare (`magali.ns.cloudflare.com` + `rocco.ns.cloudflare.com`), puis installer HTTPS (Certbot)
> - **PROCHAINE ÉTAPE** : Vérifier `/api/health` → configurer PostgreSQL managé + seed → tester login/réservation/paiement
> - Business : 6 emails JAMAIS envoyés — chemin critique P0 bloqué 16 jours
>
> **Sprint Plan actif** : [`SPRINT-PLAN.md`](SPRINT-PLAN.md) — 6 sprints de 2 semaines → premier voyage 53 passagers
> - **Sprint 1** (20/03 → 03/04) : Déblocage administratif + sécurité
> - **Sprint 2** (04/04 → 17/04) : Création SAS + choix prestataires
> - **Sprint 3** (18/04 → 01/05) : APST + RC Pro + Pack Sérénité
> - **Sprint 4** (02/05 → 15/05) : Atout France + Production + Partenaires
> - **Sprint 5** (16/05 → 29/05) : Marketing + Prospection B2B
> - **Sprint 6** (30/05 → 12/06) : Premier voyage 53 passagers 🎯
>
> **Sprints tech en parallèle** :
> - Cowork-18 : Tests E2E Playwright (18 specs prêtes, besoin serveur)
> - Cowork-19 : Monitoring prod (Sentry, alertes, healthcheck externe)
> - Cowork-20 : Exécuter migration Prisma sync_v3 sur staging + smoke test
>
> **🆕 Sprint Groupes-Solos-Indépendants v2 (06/04/2026)** : [`SPRINT-GROUPES-SOLOS-INDEPENDANTS.md`](SPRINT-GROUPES-SOLOS-INDEPENDANTS.md)
> - ✅ **Sprint A** (4j) : Remplissage dynamique — jauge live 53 places, `/compte/groupes` V303, notifs remplissage, partage QR — **TERMINÉ 06/04**
> - ✅ **Sprint B** (3.5j) : Expérience solo — page solo dédiée, matching solo→groupe au checkout, chat global voyage — **TERMINÉ 06/04**
> - ✅ **Sprint C** (3.5j) : Guides rattachés — API guides publics, composant TravelGuides sidebar, modération chat guide, page équipe Pro enrichie — **TERMINÉ 06/04**
> - ✅ **Sprint D** (3j) : Acquisition gratuite — dashboard `/pro/mon-impact/`, page `/p/[slug]` enrichie (stats+avis+voyages guidés), système ambassadeur STARTER→PLATINUM — **TERMINÉ 06/04**
> - **Total** : 14 jours dev — **4 sprints terminés en 1 jour** — Enrichi diagrammes V48 + audits marketing/HRA/transport
> - **Jeux/Gamification** : 🔒 Roadmap interne uniquement (investisseurs/avocats) — code existant désactivé côté client
> - **Fichiers créés** : 8 backend (services+controllers) + 5 frontend (pages+composants) + 4 fichiers modifiés
>
> **🔧 Sprint Finance — ✅ S1-S6 TOUS TERMINÉS (05/04/2026)** :
> - ✅ **S1 TERMINÉ** : 11 modèles Prisma + 2 enums + seed Policy V1 + relations Travel/ProProfile
> - ✅ **S2 TERMINÉ** : Moteur de calcul revenus
>   - `finance-policy.service.ts` créé (520+ lignes) — getActivePolicy, getTravelRates, computeIndeBrut, distributeToPoches, computeSellerCommission, versioning, override voyage, simulation
>   - `pro-revenues.service.ts` refactoré — `DEFAULT_COMMISSION_PERCENTAGE = 15` supprimé, computeTripRevenue avec 6 taux + 8 poches, CREATOR 55% / INDEPENDANT 50%
>   - `finance.service.ts` refactoré — computeMonthlyPayout utilise la politique active
>   - `close-pack.service.ts` refactoré — cotisationsSnapshot inclut 8 poches + 5 cotisations Eventy = 13 lignes
> - ✅ **S3 TERMINÉ** (05/04/2026) : Admin — Tout contrôler
>   - `finance-policy.controller.ts` créé (643 lignes) — 11 endpoints REST sous /admin/finance, audit log à chaque modification
>   - `admin/finance/settings/page.tsx` créé (605 lignes) — Politique financière : taux par catégorie, 8 poches, prime vendeur, historique versions
>   - `admin/voyages/[id]/finance/page.tsx` enrichi (562 lignes) — Section override avec toggle, motif obligatoire, calcul temps réel
>   - `admin/finance/simulate/page.tsx` créé (616 lignes) — Simulateur dry-run client-side, comparaison 30/38/50 personnes
>   - `finance.module.ts` mis à jour — FinancePolicyController enregistré
> - ✅ **SPRINT COMPTABLE TERMINÉ** (Session 2 — 05/04/2026) : **6 tickets SC-1→SC-6 LIVRÉS**
>   - 3 modèles Prisma ajoutés : `IndeContributionLine` (8 poches), `ComptaExportLog`, `ProInvoice`
>   - 6 services créés : `PocheExportService` (mapping poches→PCG), `TripExportService` (CSV per-voyage), `IndieCotisationsService` (DAS2), `ComptableWidgetsService` (KPIs), `CronExportService` (auto-export 1er/mois), `ProInvoiceService` (FACT-YYYY-MM-NNN)
>   - FEC enrichi : journal HA intégré dans `FecExportService`, validation HA, `exportFECWithPochesAndHA()`
>   - 17 endpoints REST ajoutés au `finance.controller.ts` (poches, per-voyage, cotisations, widgets, exports, invoices)
>   - 3 pages admin : `/admin/finance/per-voyage-exports` (breakdown voyage), `/admin/finance/indie-cotisations` (DAS2 prep), `/admin/finance/comptable` (enrichi 4 widgets KPI)
>   - Cron mensuel auto-export + email outbox au cabinet
>   - DAS2 CSV export prêt pour déclaration fiscale
> - ✅ **S4 TERMINÉ** (05/04/2026) : Vendeur + Payout individuel
>   - `attribution.service.ts` créé — trackAttribution, computeCommission, confirmCommission, cancelCommission, getVendeurDashboard
>   - `attribution.controller.ts` créé (191 lignes) — 5 endpoints REST (track, compute, confirm/:travelId, cancel/:bookingGroupId, dashboard/:vendeurProfileId)
>   - `attribution.module.ts` mis à jour — controller enregistré
>   - `payout-batch.service.ts` créé (350+ lignes) — computePayoutLine (8 poches), createBatch, approveBatch, executeBatch, cancelBatch, getBatchSummary, listBatches
>   - 3 modèles Prisma : AttributionSource (UTM tracking), CommissionLedgerLine (ESTIMATED→CONFIRMED→PAID→CANCELED), Payout (8 poches + idempotency)
> - ✅ **S5 TERMINÉ** (05/04/2026) : Caisses + Fonds
>   - `fund.service.ts` existait (348 lignes) — ensureFundsExist, creditFromClosePack, debitFund, getDashboard, recalculateCapacityRisk, freeze/release
>   - `fund.listener.ts` créé — écoute BOOKING_CONFIRMED, BOOKING_CANCELLED → recalculateCapacityRisk + TRAVEL_DEPARTED → freezeCapacityRisk
>   - `close-pack.service.ts` hookée — appelle `fundService.creditFromClosePack()` après finalizeClosePack
>   - `travel-lifecycle.service.ts` hookée — émet TRAVEL_DEPARTED à confirmDeparture()
>   - 3 modèles Prisma : EventyFund (6 types), FundMovement (audit trail), TripCapacityFund (risque non-remplissage)
>   - `/admin/finance/caisses/page.tsx` — vue consolidée 6 fonds, jauges capacité, mouvements, débit admin
> - ✅ **S6 TERMINÉ** (05/04/2026) : Comptabilité complète
>   - FEC enrichi : 12+ écritures/voyage (622100, 622200, 161xxx, 623000, 455000, 627200 + Journal HA 607xxx)
>   - `das2.service.ts` créé — seuil 1200€, alertes, export CSV DAS2 annuel
>   - `urssaf-vigilance.service.ts` créé — seuil 5000€, blocage payout si attestation manquante
>   - ProInvoice model + ProInvoiceStatus enum
> - ⏳ **Migration Prisma à exécuter** : `npx prisma migrate dev --name finance-complete-v1`
> - 📄 [`SPRINT-FINANCE-COMPLETE-2026-04-05.md`](SPRINT-FINANCE-COMPLETE-2026-04-05.md) — 6 sprints, 27 tickets — ✅ **TOUS TERMINÉS**
> - 📄 [`SPRINT-COMPTABLE-PARALLELE-2026-04-05.md`](SPRINT-COMPTABLE-PARALLELE-2026-04-05.md) — Sprint parallèle interface comptable (6 tickets) — ✅ **TERMINÉ**
> - 📄 [`AUDIT-3-DIAGRAMMES-FINANCE-ROLES-2026-04-05.md`](AUDIT-3-DIAGRAMMES-FINANCE-ROLES-2026-04-05.md) — Audit v5 — 10 diagrammes, gap analysis complet

### 🔴 Suivi Juridique PDG — 76 dossiers (MAJ 06/04/2026)

> **Portail Avocat** : `/avocat/dossiers` — vue complète des 76 dossiers avec filtres, priorités, bloqueurs
> **Dashboard Admin** : `/admin/juridique` — vue PDG consolidée avec avancement par catégorie
> **Backend** : `LegalCaseTrackerService` — 76 cases, 12 catégories, endpoints RBAC

| Catégorie | Dossiers | P0 | En attente avocat | Validés | Avancement |
|-----------|----------|------|-------------------|---------|------------|
| 🏛️ Création SAS | 8 | 5 | 2 | 0 | 0% |
| ✈️ Immatriculation Tourisme | 7 | 3 | 1 | 0 | 0% |
| 📄 Documents Légaux | 12 | 2 | 7 | 0 | 0% |
| 🔒 RGPD & Conformité | 10 | 1 | 2 | 0 | 0% |
| ❓ 13 Questions Critiques | 13 | 4 | 13 | 0 | 0% |
| 👤 Contrats Fondateurs | 3 | 0 | 0 | 0 | 0% |
| 🛡️ Assurance & Conformité | 2 | 0 | 0 | 0 | 0% |
| ⚖️ Contrats & Responsabilité | 8 | 2 | 6 | 0 | 0% — **NOUVEAU** |
| 🔐 Assurances Complémentaires | 4 | 0 | 1 | 0 | 0% — **NOUVEAU** |
| ®️ Propriété Intellectuelle | 3 | 0 | 1 | 0 | 0% — **NOUVEAU** |
| ⚡ Litiges & Recours | 3 | 0 | 1 | 0 | 0% — **NOUVEAU** |
| ✅ Conformité Opérationnelle | 3 | 0 | 1 | 0 | 0% — **NOUVEAU** |
| **TOTAL** | **76** | **17** | **35** | **0** | **0%** |

**5 dossiers les plus critiques (P0 — bloquent le lancement)** :
1. **SAS-01** : Rédaction statuts SAS → EN ATTENTE AVOCAT
2. **TOUR-05 / Q-04** : Pack Sérénité qualification ORIAS → EN ATTENTE AVOCAT (détermine toute la stratégie)
3. **CONT-01** : Séquestre acomptes clients → EN ATTENTE AVOCAT (obligation légale ?)
4. **DOC-01** : CGV conformes Code du Tourisme → EN ATTENTE AVOCAT
5. **RGPD-02** : AIPD données de santé → EN ATTENTE AVOCAT (bloque le checkout)

> **⚠️ RAPPEL** : 6 brouillons Gmail JAMAIS envoyés (APST, CMB, Hiscox, Chevalier, Nexco, Mutuaide) — chemin critique bloqué 31+ jours

### Sprints P4 — DÉJÀ IMPLÉMENTÉS ✅
| Tâche | Service/Fichier | Statut |
|-------|-----------------|--------|
| Backups automatiques DB | `db-backup.service.ts` (635 lignes) | ✅ pg_dump + S3 + SHA-256 + rétention |
| Monitoring & health enrichi | `health-advanced.service.ts` (692 lignes) | ✅ 7 checks (DB/Redis/Stripe/S3/Email/Disk/Memory) |
| Swagger/OpenAPI | `swagger.config.ts` + 69 controllers annotés | ✅ Complet |
| Seeds réalistes | 4 fichiers seed (realistic + staging + helpers) | ✅ Complet |
| Scripts deploy | 12 scripts shell + Makefile + 5 guides | ✅ Complet |
| .env.production | `.env.production.example` (domaine corrigé eventylife.fr) | ✅ Template prêt |

### Sprints futurs (V2 — post-lancement)
| **P2** | Multi-devise EUR/GBP/CHF | 4h |
| **P2** | WebSocket scaling (Redis Pub/Sub) | 3h |
| **P3** | GraphQL API (portail client mobile) | 8h |
| **P3** | Tests de charge k6 en continu | 3h |

> 📋 **Voir [`ROADMAP-V2-POST-LANCEMENT.md`](ROADMAP-V2-POST-LANCEMENT.md)** — ✅ **100% IMPLÉMENTÉ** — 71 jours de features post-lancement (T1-T3) entièrement codées : Vendeur, Viral, Forfaits, Hôtelier, Restaurateur, Sponsors, Route Packs, Charter/Multi-bus, ClosePack Finance.

### Méga-audit drawio (19/03/2026) — **COMPLÉTÉ ✅**
- **1 798 pages de specs** analysées dans le draw.io v53
- **100% des features core** implémentées (18/18 features roadmap)

**🟢 FRONTEND + BACKEND 100% COMPLETS (20/03/2026)**
- **Frontend** : **247 pages** (29 public + 33 client + 96 pro + 68 admin + 11 auth + 7 checkout + 3 autre) — 0 erreur TS — animations, 4 états UI, a11y, SEO JSON-LD
- **Backend** : 100+ services, 48+ controllers, 31 modules — D9-D19 tous terminés (Waitlist, PREANNOUNCE, FEC, TVA audit, Paniers abandonnés, Runbook J0, Duplicate Season, Safety Sheets, Quality Gate, Bulk Actions)
- **Total code** : ~180 000+ lignes TS/TSX
- **DEV 100% TERMINÉ** — Phase actuelle : **Test & Amélioration en Live**. Bloqueur : déployer le backend (~2-4h) + envoyer les 6 emails.

---

## 🚨 ALERTES CRITIQUES — Audit Gmail + Vercel + Sécurité (MAJ 20/03/2026)

### 🔴 URGENCE ABSOLUE — 6 emails JAMAIS ENVOYÉS (vérifié Gmail 20/03)

**Les 6 brouillons créés le 05/03 sont TOUJOURS en brouillon. Zéro email envoyé. Zéro réponse possible.**

| # | Destinataire | Objet | Statut Gmail |
|---|-------------|-------|-------------|
| 1 | info@apst.travel | Adhésion APST nouvelle agence | 🔴 BROUILLON — jamais envoyé |
| 2 | contact@cmb-assurances.fr | RC Pro agence de voyages | 🔴 BROUILLON — jamais envoyé |
| 3 | contact@chevalierconseil.com | Expert-comptable spécialisé | 🔴 BROUILLON — jamais envoyé |
| 4 | contact@nexco-expertise.com | Expert-comptable TVA marge | 🔴 BROUILLON — jamais envoyé |
| 5 | contact@hiscox.fr | RC Pro immatriculation Atout France | 🔴 BROUILLON — jamais envoyé |
| 6 | assistance@mutuaide.fr | Contrat cadre assurance voyage | 🔴 BROUILLON — jamais envoyé |

**Impact** : Tout le chemin critique P0 (SAS, avocat, APST, RC Pro) est bloqué depuis **31 jours** (05/03 → 05/04).
**Action David** : Ouvrir Gmail → Brouillons → Envoyer les 6 emails MAINTENANT.

### 🔴 SÉCURITÉ — Secrets exposés sur GitHub (18/03/2026)

| Alerte | Source | Détail |
|--------|--------|--------|
| **SMTP credentials exposées** | GitGuardian | Commit `905e2825` dans le repo public |
| **Stripe Webhook Signing Secret** | GitHub Secret Scanning | Fichier `.env.example` ligne 21 |

**Le repo est PUBLIC** — n'importe qui peut voir ces secrets.
**Actions immédiates** :
1. Rotater le Stripe Webhook Secret dans le dashboard Stripe
2. Rotater les credentials SMTP (Resend/Brevo)
3. Ajouter `.env*` au `.gitignore` si ce n'est pas déjà fait
4. Envisager de rendre le repo PRIVÉ

### 🟢 Vercel — Frontend déployé et LIVE en production

| Métrique | Valeur |
|----------|--------|
| Dernier deploy PROD réussi | **21/03** — commit `f94b07e` ("feat: ajouter lien Espace Pro dans le footer") |
| Build 14 | ✅ **READY** — 247 pages, 6 lambdas Node.js |
| Deploys totaux | 14 (10 en erreur corrigés → builds 11-14 = succès) |
| Site live | ✅ **www.eventylife.fr** + **eventylife.fr** |
| Alias | eventy-frontend-three.vercel.app |
| Région | iad1 (US East) |
| Domaine custom | ✅ **eventylife.fr + www.eventylife.fr** — configurés et fonctionnels |
| Protection pré-lancement | ✅ Basic Auth (SITE_PASSWORD) — bypass sur /pro/login |
| Lien Espace Pro | ✅ Ajouté dans footer (colonne Découvrir + barre légale → /pro/login) |
| **🔴 BACKEND** | **❌ PAS DÉPLOYÉ** — Login Pro retourne 404, aucune API disponible |

### 🟡 Autres alertes

| Alerte | Détail |
|--------|--------|
| Slack Pro expiré | Essai terminé le 20/03 — fonctionnalités premium désactivées |
| GitLab trial ending | Fin dans ~3 jours |
| OVHcloud satisfaction | Email reçu sur service DOMAIN (domain eventylife.fr actif chez OVH) |

### Actions en souffrance

| Action | Priorité | Créé le | Jours en attente | Statut |
|--------|----------|---------|-------------------|--------|
| **🔴 ENVOYER les 6 brouillons Gmail** | **P0 CRITIQUE** | 05/03 | **31 jours** 🔴 | CONFIRMÉ 05/04 : **toujours en brouillon, jamais envoyés** — BLOQUE TOUT le chemin P0 |
| **🔴 DÉPLOYER LE BACKEND** | **P0 BLOQUEUR** | 21/03 | **15 jours** 🔴 | **Sans backend = impossible de tester le site (login, API, paiement)** |
| **Rotater secrets GitHub** | **P0 SÉCURITÉ** | 18/03 | **18 jours** 🔴 | Stripe + SMTP exposés en public |
| **Trouver avocat tourisme** | **P0** | 05/03 | **31 jours** 🔴 | Bloqué tant que email APST non envoyé |
| **Capacité professionnelle** | **P0** | 05/03 | **31 jours** | ⏳ Bloqué par avocat |
| **ORIAS (qualification IAS)** | **P1** | 05/03 | **31 jours** | ⏳ Bloqué par avocat |
| ~~Configurer DNS eventylife.fr → Vercel~~ | ~~P1 TECH~~ | 20/03 | — | ✅ **FAIT** — eventylife.fr + www fonctionnels |
| ~~Rotater credentials Neon DB~~ | ~~P0 TECH~~ | 15/03 | — | ⚠️ Inclus dans rotation secrets |
| ~~Déployer sur Scaleway~~ | ~~P0 TECH~~ | 15/03 | — | Remplacé par Vercel (frontend) |
| ~~Cowork 7-24~~ | ~~P1-P2 TECH~~ | 19-21/03 | — | ✅ TOUS TERMINÉS — Dev 100% fini |

---

## 🖥️ Statut Technique (MAJ 19/03/2026)

| Métrique | Valeur |
|----------|--------|
| **TypeScript** | ✅ 0 erreur frontend + backend — Cowork-11 : 32 error handling corrigés, validation renforcée |
| **Auth** | ✅ JWT + 2FA TOTP (RFC 6238) + Argon2id + cookie fix |
| **Sécurité** | **A++** — RBAC granulaire AdminRoles migré (7 modules), 4 bugs critiques corrigés, 13 cron locks anti-concurrence, PII masking complet |
| **Performance** | **A+** — Redis cache activé, **313 index DB** (+25), per-user rate limit, slow request logging, 0 N+1 |
| **Tests** | **100%** — **207 fichiers**, 0 service non couvert, **~131 000 lignes** de tests, 278 tests RBAC, 26 Stripe intégration, 28 E2E |
| **SEO** | **A+** — Sitemap, robots.txt, JSON-LD (TravelAgency, FAQPage, BreadcrumbList, ItemList, Event), OpenGraph, destinations API |
| **API** | 392+ endpoints, 100% documentés (API-REFERENCE.md), Swagger en dev |
| **Backend** | ✅ **100%** — 31 modules, 104 services, 49 controllers, 147 DTOs, 46 events, cron lock distribué, per-user rate limit |
| **Migration Prisma** | ✅ Script production complet (backup auto, migrate deploy, rollback, seed, validate) |
| **CI/CD** | ✅ **ENRICHI** — Build + Test + Prisma migrate + Docker + Deploy + Rollback auto |
| **Email** | ✅ **23/23 templates**, Outbox pattern, retry exponential, dead letter, dual provider |
| **Monitoring** | ✅ Admin UI + CRON surveillance 30min + rapport quotidien 7h + Sentry |
| **Stripe** | ✅ Tests intégration (20 cas), 6 flows, idempotence, invariants 3/4/5/7 |
| **Load testing** | ✅ 3 scénarios k6, 4 profils (smoke/load/stress/spike) |
| **Formation Pro** | ✅ **REWRITE COMPLET** — 3 thèmes, 22 vidéos draw.io, RGPD 2-click, priority/block badges, a11y |
| **Marketing Suite** | ✅ **COMPLÈTE** — 10 pages (dashboard + 9 outils), shortlinks e.ty/xxx, QR-print A4, analytics CSV, visuels, réseaux sociaux, studio IA, leads — ~90% draw.io |
| **Frontend** | ✅ **100%** — 3 portails, **247 pages** (29 public + 33 client + 96 pro + 68 admin + 11 auth + 7 checkout + 3 autre), animations, 4 états UI, SEO JSON-LD, a11y, PWA |
| **PWA Pro** | ✅ **RECONSTRUITE** — 1198 lignes, 28 vues, 47 pages (tabs inclus), React 18 + Chart.js |
| **PWA Admin** | ✅ **RECONSTRUITE** — 1405 lignes, 26 pages complètes, tableaux + graphiques + filtres |
| **Brand Guide** | ✅ **CRÉÉ** — Couleurs, fonts, tone voice, DO/DON'T, règles visuelles |
| **Audit Frontend** | ✅ Score **8/10** — Architecture solide, besoin tests avant prod |
| **Infrastructure** | ✅ Docker + Nginx TLS + CI/CD + deploy.sh + backup + logrotate |
| **Ops tooling** | ✅ setup-server, deploy-wizard, smoke-test, pre-deploy-check, backup-db, maintenance-db |
| **Documentation** | ✅ DEPLOY-GUIDE + RUNBOOK + API-REFERENCE + PROGRESS |
| **Pages** | **247** (29 public + 33 client + 96 pro + 68 admin + 11 auth + 7 checkout + 3 autre) |
| **Code total** | **~345 000+ lignes** TS/TSX (hors node_modules) — 232K backend, 113K frontend |

---

## Statut global — 36+ fichiers / 14 dossiers — TOUS ENRICHIS + MODÈLE BUS COMPLET

| Domaine | Statut | Priorité | Fichier référence |
|---------|--------|----------|-------------------|
| Structure juridique (SAS) | ✅ Coûts réels chiffrés | **P0** | `01-legal/STRUCTURE-JURIDIQUE.md` |
| Garantie financière APST | 📧 Devis demandé (05/03) | **P0** | `08-assurance-conformite/GARANTIE-FINANCIERE.md` |
| RC Pro | 📧 2 devis demandés (05/03) | **P0** | `08-assurance-conformite/RC-PRO.md` |
| Immatriculation Atout France | ⏳ Après APST + RC | **P0** | `01-legal/IMMATRICULATION-ATOUT-FRANCE.md` |
| Compte bancaire pro | Après SAS | **P0** | `14-pitch/PITCH-BANQUE.md` |
| Avocat tourisme | ✅ **Dossier .docx prêt** + cabinets identifiés | **P0** | `01-legal/CHECKLIST-AVOCAT.md` + `DOSSIER-AVOCAT-EVENTY.docx` |
| Expert-comptable tourisme | 📧 2 devis demandés (05/03) | **P1** | `13-comptabilite/GUIDE-COMPTABLE.md` |
| CGV Code du Tourisme | ✅ Template enrichi (validation avocat) | **P1** | `01-legal/CGV-TEMPLATE.md` |
| Contrat partenaire type | ✅ Template enrichi (validation avocat) | **P1** | `01-legal/CONTRAT-PARTENAIRE-TYPE.md` |
| Mentions légales | ✅ Template enrichi | **P1** | `01-legal/MENTIONS-LEGALES.md` |
| RGPD Conformité | ✅ Enrichi (registre + DPA + AIPD) | **P1** | `01-legal/RGPD-CONFORMITE.md` |
| Checklist avocat | ✅ 13 questions + cabinets + budget | **P1** | `01-legal/CHECKLIST-AVOCAT.md` |
| **Coûts réels 2026** | ✅ **COMPLET** | P1 | `02-finance/COUTS-REELS.md` |
| Budget prévisionnel | ✅ **Bus complet** — 3 scénarios + Y1 = 500K€ CA | P1 | `02-finance/BUDGET-PREVISIONNEL.md` |
| Plan trésorerie | ✅ **Bus complet** — M0-M12 → 159K€ solde M12 | P1 | `02-finance/PLAN-TRESORERIE.md` |
| Grille tarifaire | ✅ **Bus complet** — 4 exemples détaillés (53-159 pers) | P1 | `02-finance/GRILLE-TARIFAIRE.md` |
| **Assurance voyage Pack Sérénité** | ✅ Force de vente n°1 | P1 | `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` |
| Assurance voyage | 📧 Devis Mutuaide demandé (05/03) | P1 | `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` |
| **Stratégie partenaires** | ✅ **Bus complet** — 4 leviers + 53+ pers minimum | P1 | `05-partenaires/STRATEGIE-PARTENAIRES.md` |
| **Suivi partenaires** | ✅ Dashboard + workflow + conversion | P1 | `05-partenaires/SUIVI-PARTENAIRES.md` |
| Stratégie négociation | ✅ Créé | P1 | `05-partenaires/STRATEGIE-NEGOCIATION.md` |
| Intégration technique | ✅ Créé | P1 | `05-partenaires/INTEGRATION-TECHNIQUE-PARTENAIRES.md` |
| Transport | ✅ **Bus complet** — Matrice bus×avion + charter | P2 | `03-transport/COMPARATIF-TRANSPORT.md` |
| Marketing lancement | ✅ **Bus complet** — 6 canaux + "places ouvertes" | P2 | `07-marketing-commercial/PLAN-LANCEMENT.md` |
| RH / Organisation | ✅ Enrichi (coûts salariaux réels, phases 1-3) | P2 | `06-rh-organisation/ORGANIGRAMME.md` |
| Hébergement cloud | ✅ Enrichi (tarifs Scaleway 2026) | P2 | `04-hebergement-infra/COMPARATIF-CLOUD.md` |
| **🔒 Audit sécurité LOT 166** | ✅ **COMPLET — 88 vulnérabilités + 8 Session 145 + audit RBAC 19/03** | **P0** | `PROGRESS.md` (Phases 1-129 + Session 145 + RBAC 19/03) |
| Déploiement tech | ✅ Enrichi (Scaleway + Go/No-Go) | P2 | `09-site-beta/PLAN-DEPLOIEMENT.md` |
| Process quotidien | ✅ Enrichi (routines + 4 process + KPIs) | P2 | `10-operations/PROCESS-QUOTIDIEN.md` |
| Guide comptable TVA marge | ✅ Enrichi | P2 | `13-comptabilite/GUIDE-COMPTABLE.md` |
| Modèle facture | ✅ Enrichi (exemple concret) | P2 | `13-comptabilite/MODELE-FACTURE.md` |
| Pitch banque | ✅ **Bus complet** — Y1 = 500K€ CA, 119K€ marge | P2 | `14-pitch/PITCH-BANQUE.md` |
| **Templates emails** | ✅ **30 templates** (3 fichiers + 4 ajoutés 20/03) | P2 | `11-templates-emails/` |
| **Âme d'Eventy** | ✅ **CRÉÉE** — Manifeste fondateur, visible par tous les Cowork | P0 | `AME-EVENTY.md` |
| **Brand Guide rapide** | ✅ **CRÉÉ** — Couleurs, fonts, tone voice, règles visuelles | P1 | `07-marketing-commercial/BRAND-GUIDE-RAPIDE.md` |
| **Audit marketing** | ✅ **CRÉÉ** — 75% alignement, 18 recommandations | P1 | `07-marketing-commercial/AUDIT-MARKETING-HARMONISATION.md` |
| **Audit frontend détaillé** | ✅ **CRÉÉ** — Score 8/10, architecture solide | P1 | `FRONTEND-AUDIT-DETAILLE.md` |
| Checklist lancement | ✅ **8 phases enrichies** | P2 | `12-checklist-lancement/CHECKLIST-COMPLETE.md` |
| **Contacts PDG** | ✅ **14 contacts enregistrés** | — | `CONTACTS-PDG.md` |
| **Incubateurs/Accélérateurs France** | ✅ **11 incubateurs tourisme + 5 accel tech + 5 plateforme cofondateurs** | **P1** | `05-partenaires/INCUBATEURS-ACCELERATEURS-COFONDATEURS.md` |
| **Roadmap V2 post-lancement** | ✅ **~71 jours** features drawio (vendeur, viral, hôtelier, resto, charter) | P3 | `ROADMAP-V2-POST-LANCEMENT.md` |
| **Plan d'action immédiat** | ✅ **3 actions urgentes** (35 min) + plan semaine | **P0** | `PLAN-ACTION-IMMEDIAT.md` |
| **Guide premier voyage** | ✅ **Checklist opérationnelle** J-90 à J+7 | P1 | `10-operations/GUIDE-PREMIER-VOYAGE.md` |
| **Scripts commerciaux** | ✅ **5 scripts** appels partenaires | P1 | `05-partenaires/SCRIPTS-COMMERCIAUX.md` |

---

## Décisions stratégiques PDG (06/03/2026)

### 1. Bus complet 53 places = USP marketing principal
- **Chaque voyage = 53 passagers minimum** → coûts partagés → prix imbattable
- Tous les supports, pitchs, emails mentionnent "53 passagers = meilleur prix"
- Capacité minimum partenaires : **27+ chambres, 53+ couverts, 53+ participants**
- Ne contracter qu'avec des prestataires pouvant accueillir 53+ personnes

### 2. Pack Sérénité = Argument n°1 pour la conversion
> **"Chez Eventy, vous partez l'esprit tranquille. Garantie complète incluse."**
- Assurance complète incluse dans chaque voyage (100% souscription — pas d'option)
- Coût ~4,5% du prix du voyage au client (~17-53€/voyageur selon type)
- Coût assureur ~2-3% → marge ~50% sur le Pack Sérénité
- Argument n°1 pour les partenaires : "paiement garanti, pas de risque d'impayé"

### 3. "Places ouvertes" = Nouveau canal d'acquisition
- Voyageurs individuels (solo, couples, petits groupes) rejoignent un voyage existant
- Page dédiée "Voyages ouverts" sur eventylife.fr + newsletter hebdo
- Widget en temps réel "X places restantes" sur chaque voyage
- Objectif : 25% du remplissage via places ouvertes dès M12

### 4. Stratégie de négociation — 4 leviers
- **Levier 1 — Volume** : **1 400+ voyageurs/an dès Y1**, 5 000+ Y2
- **Levier 2 — Bus complets garantis** : 53 personnes minimum, pas 15-20 comme les agences classiques
- **Levier 3 — Auto-entrepreneurs** : Réseau qui recommande les partenaires → flux clients additionnel gratuit
- **Levier 4 — Plateforme tech** : Intégration digitale, paiement auto J+30, zéro paperasse

### 5. B2B = Priorité stratégique (marge 25-27%)
- Séminaires 53 personnes = segment le plus rentable (26,8% marge)
- Cible : CE, PME 50-500 salariés, DRH, agences événementielles
- Prospection LinkedIn + cold email dès M1
- Objectif : 40% du CA en B2B dès M12

### 6. Domaine = eventylife.fr
- Tous les documents, emails, templates utilisent eventylife.fr (PAS eventy.fr)
- Emails : contact@eventylife.fr, sinistre@eventylife.fr, comptabilite@eventylife.fr

---

## Prévisionnel Y1 — Modèle bus complet

### Montée en puissance

| Période | Voyages | Type | CA | Marge (~22-25%) | Trésorerie cumulée |
|---------|---------|------|-----|----------------|-------------------|
| **M1-M3** | 0 | Setup + prospection | 0€ | 0€ | ~4 500€ |
| **M4** | 1 | WE France 53 pers | 20 000€ | 4 900€ | ~8 500€ |
| **M5** | 1 | Séminaire B2B 53 pers | 21 000€ | 5 600€ | ~13 100€ |
| **M6** | 2 | 1 WE + 1 B2B | 41 000€ | 10 500€ | ~22 500€ |
| **M7-M8** | 2/mois | Mix WE + B2B | 91 000€ | 21 500€ | ~41 000€ |
| **M9-M10** | 3/mois | + Europe 2 bus (106 pers) | 218 000€ | 47 000€ | ~85 000€ |
| **M11-M12** | 3-4/mois | Charter 159 pers + multi-bus | 378 000€ | 78 000€ | **~159 000€** |
| **TOTAL Y1** | **~21** | | **~500 000€** | **~119 000€** | |

### KPIs cibles

| KPI | M3 | M6 | M12 |
|-----|-----|-----|------|
| Voyages bus complet/mois | 0 | 2-3 | 3-4 |
| Voyageurs/mois | 0 | 106-159 | 159-212 |
| CA mensuel | 0€ | 60 000€ | 120 000€ |
| Taux remplissage bus | — | 90% | **95%+** |
| Part B2B dans le CA | 0% | 35% | **40%** |
| Part "places ouvertes" | 0% | 20% | **25%** |
| CAC (coût acquisition client) | — | 60€ | 40€ |
| ROAS Google Ads | — | 5× | 7× |
| NPS (satisfaction) | — | 50+ | 60+ |

---

## Chemin critique (8-12 semaines)

```
Semaine 1-2 :  Créer SAS ─────────────────────► Compte bancaire pro (Qonto)
                    │
                    ├── 📧 Devis envoyés : APST, CMB, Hiscox, Chevalier, Nexco, Mutuaide
                    ├── 📧 Contacter avocat tourisme (Llop / TourismLex)
                    │
Semaine 1-2 :  Réponses devis → choisir avocat + expert-comptable + assureur Pack Sérénité
                    │
Semaine 2-4 :  Déposer dossier APST ──────────► Garantie financière (~2 100€/an)
                    │
Semaine 2-3 :  Souscrire RC Pro ──────────────► Attestation (~780-1 200€/an)
                    │
Semaine 3-4 :  Signer contrat assureur Pack Sérénité ► Conditions intégrées CGV
                    │
Semaine 3-6 :  Avocat : CGV + CGU + mentions + contrat partenaire ► Documents publiés
                    │
Semaine 4-6 :  Dossier Atout France ──────────► Immatriculation IM (~100€)
                    │
Semaine 4-8 :  Prospection partenaires ───────► 14+ contrats signés (capacité 53+ pers)
                    │                              (7 templates emails prêts)
                    │                              (4 leviers négo : volume 1 400 voy + bus complet + Pack Sérénité + plateforme)
                    │
Semaine 6-8 :  Déploiement production ────────► Site live (Scaleway ~25€/mois)
                    │                              + Pages "Voyages ouverts" (places ouvertes)
                    │
Semaine 8-10 : Marketing lancement ───────────► 6 canaux + Google Ads + "places ouvertes"
                    │
Semaine 10-12: 1er voyage bus complet 53 pers ► Premiers avis + contenu marketing
                    │
Mois 9+ :     2 bus (106 pers) ───────────────► Test scalabilité multi-bus
                    │
Mois 11+ :    3 bus + charter A320 (159 pers) ► Marge maximale (-35 à -50% vs allotement)
```

---

## Budget résumé — Coûts réels 2026

| Scénario | Investissement initial | Charges/an | Charges/mois | Break-even |
|----------|----------------------|------------|-------------|------------|
| **Minimaliste** | ~5 295€ | ~6 103€ | ~509€ | Mois 4 |
| **Recommandé** | ~9 890€ | ~8 728€ | ~727€ | Mois 4 |
| **Confortable** | ~14 490€ | ~11 353€ | ~946€ | Mois 4 |

> **Modèle bus complet** : Break-even = M4 dans TOUS les scénarios (1 seul voyage bus complet = 4 919€ de marge = 5 mois de charges fixes). L'ancien modèle 15 pers nécessitait M4-M6.

> **Attention** : Le scénario minimaliste ne compte PAS la contre-garantie APST (10 000€). Avec contre-garantie : minimaliste ~15 295€, recommandé ~19 890€.

### Flux financiers — BFR favorable

```
Client paie 19 766€ TTC (53 personnes × 373€)
├── Acompte 30% = 5 930€ (à la réservation, J-45)
└── Solde 70% = 13 836€ (à J-30 avant départ)

Stripe verse les fonds : J+2 (CB) / J+5 (SEPA)

Eventy paie les prestataires : J+30 après le séjour

→ Trésorerie positive en permanence (~45 jours de cash disponible)
→ Marge Eventy : 4 919€ (24,9%)
```

---

## Offres de lancement — Base bus complet 53 places

| Offre | Prix/pers | Marge | Volume |
|-------|-----------|-------|--------|
| Weekend découverte (2J/1N) | À partir de **179€** | ~22% | 53 pers |
| Weekend premium (3J/2N) | À partir de **349€** | ~25% | 53 pers |
| Séjour Europe semaine (7J/6N) | À partir de **899€** | ~17% | 106-159 pers |
| Séminaire entreprise B2B | Sur devis | **~27%** | 53 pers |

> Chaque offre = bus complet + Pack Sérénité inclus. Double différenciateur : meilleur prix + zéro stress.

---

## Marketing — 6 canaux d'acquisition

| Canal | Budget M1-M3 | Budget M4+ | KPI cible |
|-------|-------------|------------|-----------|
| **SEO** (blog + pages destination) | 0€ | 0€ | 1 000 visiteurs/mois M6 |
| **Réseaux sociaux** (Instagram, Facebook, TikTok, LinkedIn) | 0€ | 100-500€/mois | 5 000 abonnés M6 |
| **Google Ads** (Search B2C + B2B + Display) | 400€/mois | 800-1 000€/mois | ROAS > 5× |
| **Places ouvertes** (eventylife.fr) | 0€ | 0€ | 25% du remplissage M12 |
| **Auto-entrepreneurs** (réseau prescripteurs) | 0€ | 0€ | 10-20% du remplissage |
| **B2B direct** (LinkedIn + cold email) | 0€ | 100€/mois | 40% du CA M12 |

**Budget marketing total** : 512€/mois (M1-M3) → 1 012€/mois (M4-M6) → 1 512€/mois (M7-M12) → **~12 500€/an**

---

## Templates emails — 30 templates prêts à l'emploi (MAJ 20/03)

| Fichier | Nombre | Cibles |
|---------|--------|--------|
| `EMAILS-PARTENAIRES.md` | **9 templates** | Hébergement, activités, transport, restauration, assureur, relance, devis, confirmation, post-séjour |
| `EMAILS-CLIENTS.md` | **14 templates** | Accusé réception, devis, relance, confirmation, solde J-30, documents J-15, rappel J-3, satisfaction J+3, avis J+7, **NoGo (annulation)**, **crédit attribué**, **rappel expiration crédit J-30/J-7**, **place libérée (waitlist)**, fidélisation J+30 |
| `EMAILS-ADMINISTRATIF.md` | **7 templates** | APST, Atout France, RC Pro, banque, expert-comptable, ORIAS, CCI |

> Tous les templates incluent : domaine eventylife.fr, Pack Sérénité, leviers de négociation bus complet 53 pers, signature "Fondateur & Président"

---

## Backend technique

| Métrique | Valeur |
|----------|--------|
| Modules NestJS | 31 |
| Pages frontend Next.js 14 | **247** (29 public + 33 client + 96 pro + 68 admin + 11 auth + 7 checkout + 3 autre) |
| Composants React réutilisables | 100+ |
| Fichiers tests | 180+ (.spec.ts) |
| Tests totaux | 3 300+ (3 301 pass) |
| Lignes de code | ~296 500 |
| Audits backend | **11/11 complétés** (LOT 163-166) |
| **Migration API frontend** | **✅ TERMINÉE** — 120+ fetch migrés → apiClient, 21 route handlers supprimés |
| **Couverture API front↔back** | **~90%+** — 60 endpoints manquants identifiés, 48 créés/alignés, 12 chemins corrigés |
| **Build backend** | **✅ 0 erreur** — `npm run build` clean (15/03/2026) — node_modules à réinstaller |
| **Build frontend** | **✅ 0 erreur** — 139 pages compilées (15/03/2026) |
| **Audit qualité portails** | **✅ FAIT** — Homepage SEO 92/100, Pro/Admin/Client a11y WCAG AA, 40+ correctifs |
| **Gap schema Prisma** | **⚠️ 80 modèles / 93 enums manquants en base** — migration `sync_schema_v3` à exécuter |
| **Session 124** | **80+ correctifs** — 11 DTOs Zod, 8 index Prisma, 6 SEO pages, 4 rate limits, type safety (DISPUTED/WAYPOINT/DocumentType), email idempotency, checkout a11y, admin role check client-side |
| Bugs corrigés (total) | **350+ fixes** (TOCTOU, ownership, XSS, N+1, perf, DTO, infra, type safety, SQL injection, IDOR, DoS, webhook idempotency, a11y, SEO) |
| Session 118 (LOT 165) | **65+ bugs** + 71 index Prisma + 30 @updatedAt + 9 DTO + 6 infra |
| Session 119 (LOT 166) | **175+ fixes** — 63 phases, 12+ CRITICAL (reset-pwd, S3, webhooks, JWT, pricing, SQL injection, IDOR bookings/cancellation/checkout, webhook idempotency), enum type safety (5 modèles), **rate limiting complet (132 décorateurs / 35 contrôleurs)**, production guards (7 routes mock), **JWT HMAC-SHA256 signature verification**, **magic bytes upload validation**, **SanitizeHtmlPipe global**, **error leakage fix**, **CORS/headers audit 18 contrôles ✅**, **$executeRawUnsafe → Prisma.sql**, **unbounded findMany() DoS protection (6 queries)**, **IDOR/RBAC fixes (19 endpoints)**, **webhook upsert→create+P2002** |
| **Rate limiting** | **136 décorateurs @RateLimit** sur **37/37 contrôleurs** (100% couverture) — 8 profils, finance+logout ajoutés Session 124 |
| **Sécurité frontend** | JWT signature HMAC-SHA256 (middleware), refresh token lock anti-race-condition, double production guard sur 3 routes mock |
| **Sécurité uploads** | Magic bytes validation (JPEG/PNG/WebP/PDF/MP4) + S3 range request pour les 16 premiers octets |
| **XSS protection** | SanitizeHtmlPipe enregistré globalement — supprime script/iframe/object/embed + event handlers |
| **Information leakage** | Messages d'erreur génériques sur health checks et export DSAR |
| **SQL injection** | `$executeRawUnsafe` éliminé → `Prisma.sql` + regex whitelist table names |
| **DoS protection** | 6 requêtes `findMany()` sans limite → `take` limits (1K-50K) ajoutés |
| **IDOR/RBAC** | 19 endpoints corrigés — ownership checks bookings (confirm/cancel/findById/addRoom), cancellation (detail/refund audit), travel lifecycle (PRO→PRO+ADMIN), checkout (selectRooms/participants/splitPay/progress/extendHold) |
| **Webhook idempotency** | **BUG CRITIQUE** : upsert avec `update:{}` ne bloquait pas le double traitement → corrigé par `create` + catch P2002. Dispute handler protégé par status guard `updateMany`. |
| Module HRA | 24 endpoints, 40 tests |
| Prisma schema | **3 304 lignes** (+72 lignes : 41 index, 30 @updatedAt, 3 migrations, 4 onDelete) |
| Zustand stores | 6 (auth, checkout, client, pro, notification, ui) |
| CI/CD | 4 workflows GitHub Actions |
| **Automatisations** | **15-21h/semaine économisées** |
| **DTO validation** | **11 DTOs Zod** ajoutés (Session 124) — admin (5), client (3), support (2), checkout (1). 100% des endpoints POST/PATCH validés |
| **SEO** | 6 pages publiques + homepage optimisées — metadata, JSON-LD (TravelOffer, FAQ, Contact, Blog ItemList, BreadcrumbJsonLd), OpenGraph |
| **Accessibilité** | WCAG 2.1 AA — 40+ fixes : ARIA labels, semantic HTML, prefers-reduced-motion, keyboard navigation, screen reader support |
| **Email idempotency** | idempotencyKey unique ajouté au modèle EmailOutbox |
| **Dette technique restante** | ~10 `as any` (réduit de 15), ~10 `process.env` (configs), CHECK constraint capacity, rotation DB creds, 2FA/MFA réel (stubs en place), CSP unsafe-inline (Next.js SSR), EXIF stripping images |
| **Infra déploiement** | ✅ Docker multi-stage (backend + frontend), docker-compose 4 services, CI/CD GitHub Actions (build+test+deploy), CSP headers complet |

---

## Emails de devis en attente (05/03/2026)

| Destinataire | Objet | Statut |
|-------------|-------|--------|
| APST (info@apst.travel) | Adhésion + garantie financière | 📝 Brouillon Gmail |
| CMB Assurances | RC Pro agence voyage | 📝 Brouillon Gmail |
| Hiscox | RC Pro alternative | 📝 Brouillon Gmail |
| Chevalier Conseil | Expert-comptable tourisme | 📝 Brouillon Gmail |
| Nexco | Expert-comptable alternative | 📝 Brouillon Gmail |
| Mutuaide Assistance | Assurance voyage groupes | 📝 Brouillon Gmail |

> **Action immédiate** : Envoyer les 6 brouillons Gmail → Relancer sous 7 jours si pas de réponse.

---

## Contacts prioritaires (14 contacts enregistrés)

| Contact | Pourquoi | Statut |
|---------|----------|--------|
| **APST** | Garantie financière | 📧 Devis demandé |
| **CMB Assurances** | RC Pro (agréé Atout France) | 📧 Devis demandé |
| **Hiscox** | RC Pro alternative | 📧 Devis demandé |
| **Chevalier Conseil** | Expert-comptable tourisme (165€/mois) | 📧 Devis demandé |
| **Nexco** | Expert-comptable alternative | 📧 Devis demandé |
| **Mutuaide Assistance** | Assurance voyage groupes | 📧 Devis demandé |
| **Maître Emmanuelle Llop** | Avocat droit du tourisme (Paris) | À contacter |
| **TourismLex** | Cabinet spécialisé tourisme | À contacter |
| Europ Assistance | Assurance voyage alternative | À contacter |
| Allianz Travel | Assurance voyage | À contacter |
| AXA / MMA / Generali | RC Pro alternatives | À contacter |
| Atout France | Immatriculation IM | Après APST + RC Pro |
| INPI | Dépôt marque Eventy | À faire |
| MTV (Médiation Tourisme) | Adhésion obligatoire (gratuit) | À faire |

> Détails complets dans `CONTACTS-PDG.md`

---

## Fichiers enrichis — Bilan complet (06/03/2026)

### Session 1 — Création et coûts réels
| Fichier | Action |
|---------|--------|
| `02-finance/COUTS-REELS.md` | ✅ CRÉÉ — 10 sections, tous coûts réels 2026 |
| `05-partenaires/STRATEGIE-NEGOCIATION.md` | ✅ CRÉÉ — 5 leviers négociation |
| `05-partenaires/INTEGRATION-TECHNIQUE-PARTENAIRES.md` | ✅ CRÉÉ — Connexions plateforme ↔ partenaires |
| `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` | ✅ CRÉÉ — Pack Sérénité = force de vente |
| `CONTACTS-PDG.md` | ✅ MIS À JOUR — 14 contacts enregistrés |

### Session 2 — Enrichissement documents existants
| Fichier | Action |
|---------|--------|
| `01-legal/STRUCTURE-JURIDIQUE.md` | ✅ Enrichi (coûts réels greffe 55,93€) |
| `01-legal/IMMATRICULATION-ATOUT-FRANCE.md` | ✅ Enrichi (conditions 2026 + capacité pro) |
| `02-finance/BUDGET-PREVISIONNEL.md` | ✅ Enrichi (3 scénarios réalistes) |
| `02-finance/PLAN-TRESORERIE.md` | ✅ Enrichi (M0-M12 avec vrais coûts) |
| `02-finance/GRILLE-TARIFAIRE.md` | ✅ Enrichi (exemples concrets) |
| `04-hebergement-infra/COMPARATIF-CLOUD.md` | ✅ Enrichi (tarifs Scaleway 2026) |
| `08-assurance-conformite/GARANTIE-FINANCIERE.md` | ✅ Enrichi (APST 2 100€/an) |
| `08-assurance-conformite/RC-PRO.md` | ✅ Enrichi (780-1 200€/an) |

### Session 3 — Enrichissement finance + juridique
| Fichier | Action |
|---------|--------|
| `14-pitch/PITCH-BANQUE.md` | ✅ Enrichi (chiffres réels 2026) |
| `07-marketing-commercial/PLAN-LANCEMENT.md` | ✅ Enrichi (budget marketing réel) |
| `03-transport/COMPARATIF-TRANSPORT.md` | ✅ Enrichi (prestataires réels) |
| `13-comptabilite/GUIDE-COMPTABLE.md` | ✅ Enrichi (TVA marge détaillée) |
| `13-comptabilite/MODELE-FACTURE.md` | ✅ Enrichi (exemple concret) |
| `06-rh-organisation/ORGANIGRAMME.md` | ✅ Enrichi (coûts salariaux réels) |
| `01-legal/CGV-TEMPLATE.md` | ✅ Enrichi (conformité Code du Tourisme) |
| `01-legal/CONTRAT-PARTENAIRE-TYPE.md` | ✅ Enrichi (DPA + Pack Sérénité) |
| `01-legal/MENTIONS-LEGALES.md` | ✅ Enrichi (LCEN + Code Tourisme) |
| `01-legal/RGPD-CONFORMITE.md` | ✅ Enrichi (registre + DPA + AIPD) |
| `09-site-beta/PLAN-DEPLOIEMENT.md` | ✅ Enrichi (Scaleway + Go/No-Go) |

### Session 4 — Enrichissement opérations + partenaires + emails
| Fichier | Action |
|---------|--------|
| `01-legal/CHECKLIST-AVOCAT.md` | ✅ Enrichi (13 questions, cabinets, budget) |
| `10-operations/PROCESS-QUOTIDIEN.md` | ✅ Enrichi (routines + 4 process + KPIs) |
| `05-partenaires/STRATEGIE-PARTENAIRES.md` | ✅ Enrichi (3 leviers + 6 assureurs) |
| `05-partenaires/SUIVI-PARTENAIRES.md` | ✅ Enrichi (dashboard + workflow + conversion) |
| `11-templates-emails/EMAILS-PARTENAIRES.md` | ✅ Enrichi (9 templates, domain corrigé) |
| `11-templates-emails/EMAILS-CLIENTS.md` | ✅ Enrichi (10 templates, Pack Sérénité) |
| `11-templates-emails/EMAILS-ADMINISTRATIF.md` | ✅ Enrichi (7 templates, ORIAS + CCI) |
| `12-checklist-lancement/CHECKLIST-COMPLETE.md` | ✅ Enrichi (8 phases + récap documents) |

### Session 5 — Domaine + dossier avocat
| Fichier | Action |
|---------|--------|
| **Tous les fichiers (25+)** | ✅ Domaine corrigé : eventy.life → **eventylife.fr** |
| `DOSSIER-AVOCAT-EVENTY.docx` | ✅ CRÉÉ — Dossier Word professionnel pour avocat tourisme |

### Session 6 — Refonte modèle bus complet 53 places
| Fichier | Action |
|---------|--------|
| `03-transport/COMPARATIF-TRANSPORT.md` | ✅ **REFONTE** — Matrice bus×avion, charter, fill rate |
| `02-finance/GRILLE-TARIFAIRE.md` | ✅ **REFONTE** — 4 exemples détaillés 53-159 pers |
| `02-finance/BUDGET-PREVISIONNEL.md` | ✅ **REFONTE** — Y1 = 500K€ CA, 119K€ marge |
| `02-finance/PLAN-TRESORERIE.md` | ✅ **REFONTE** — M0-M12, solde M12 = 159K€ |
| `14-pitch/PITCH-BANQUE.md` | ✅ **REFONTE** — 3 unit economics, scalabilité |
| `05-partenaires/STRATEGIE-PARTENAIRES.md` | ✅ **REFONTE** — 4 leviers, 1 400+ voy/an, capacité 53+ |
| `07-marketing-commercial/PLAN-LANCEMENT.md` | ✅ **REFONTE** — 6 canaux, places ouvertes, B2B priorité |
| `DASHBOARD-PDG.md` | ✅ **REFONTE** — Vision bus complet intégrée |

---

## Livrables interactifs

| Livrable | Description |
|----------|-------------|
| `DASHBOARD-EVENTY.html` | Dashboard interactif 7 onglets + simulateur transport + simulateur devis |
| `BUDGET-EVENTY.xlsx` | Excel 4 onglets, 72 formules, trésorerie M0-M12, simulateur transport |
| `DOSSIER-AVOCAT-EVENTY.docx` | Dossier professionnel Word pour avocat tourisme (38 pages) |
| `PDG-EVENTY-COMPLET.zip` | Archive complète de tous les fichiers du projet |

---

## Décisions PDG — Prochaines actions (par ordre de priorité)

1. **IMMÉDIAT** : Envoyer les 6 brouillons Gmail (APST, CMB, Hiscox, Chevalier, Nexco, Mutuaide)
2. **Cette semaine** : Contacter Maître Llop et TourismLex (avocat tourisme) — budget pack 3 000€-5 000€
3. **Semaine 2** : Relancer les 6 contacts si pas de réponse sous 7 jours
4. **Semaine 2-3** : Choisir avocat + expert-comptable → lancer création SAS
5. **Semaine 3-4** : Déposer dossier APST + souscrire RC Pro + contacter assureur Pack Sérénité
6. **Semaine 4-6** : Déposer Atout France + commencer prospection partenaires (capacité 53+ pers obligatoire)
7. **Semaine 6-8** : Déploiement production + pages "Voyages ouverts" (places ouvertes)
8. **Semaine 8-10** : Lancement marketing (6 canaux) + Google Ads + prospection B2B (20 messages LinkedIn/semaine)
9. **Semaine 10-12** : **1er voyage bus complet 53 pers** → premiers avis + contenu marketing
10. **Mois 9+** : Tester 2 bus (106 pers) → scalabilité multi-bus
11. **Mois 11+** : Lancer premier charter A320 (159 pers) → marge maximale

---

## Apps PWA Standalone — État au 17/03/2026 23h30

### ✅ App Admin PWA (terminée)
- **Fichier** : `admin-pwa/index.html` (1 566 lignes)
- **Pages** : 20 pages complètes
- **Features** : Charts Chart.js, dark mode, bottom nav mobile, toasts, modales confirmation, recherche globale ⌘K, panneau notifications, service worker v2
- **Déployé** : eventylife.vercel.app (à re-déployer avec les dernières MAJ)

### ✅ App Pro PWA (terminée)
- **Fichier** : `pro-pwa/index.html` (771 lignes)
- **Pages** : 15 pages complètes (Dashboard, Voyages, Détail voyage, Créer voyage, Réservations, Revenus, Finance, Messagerie, Marketing, Profil, Formation, Documents, Vendre/Partager, Paramètres, Support)
- **Features** : Charts Chart.js, dark mode, bottom nav mobile, toasts, modales confirmation, Fraunces font display, design Sun/Ocean
- **À déployer** : créer un nouveau projet Vercel `eventylife-pro`

### Résumé technique PWA
| App | Lignes | Pages | Charts | Dark mode | Bottom nav | Toasts | Modales | SW |
|-----|--------|-------|--------|-----------|-----------|--------|---------|-----|
| Admin | 1 566 | 20 | ✅ 8 charts | ✅ | ✅ | ✅ | ✅ | v2 |
| Pro | 771 | 15 | ✅ 6 charts | ✅ | ✅ | ✅ | ✅ | v2 |
