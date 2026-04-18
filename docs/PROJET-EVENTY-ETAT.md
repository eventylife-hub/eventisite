# 🚀 État du Projet Eventy — Document maître

> **Dernière mise à jour** : 18 avril 2026
> **Statut global** : 🟢 **Production-ready** — backend live sur Scaleway, frontend live sur Vercel, **529 pages frontend** auditées, 0 bug critique.
> **Phase** : Lancement Gamme Standard imminent (preset MVP feature-flags actif). Gamme Luxe = Phase 2.
> **PDG** : David — eventylife@gmail.com

Ce document est le **tableau de bord produit** d'Eventy. Il rassemble vision, chiffres, architecture, IA, features livrées et à venir. À lire par tout nouveau co-fondateur, Ambassadeur, investisseur.

Pour l'âme du projet → [`../AME-EVENTY.md`](../AME-EVENTY.md)
Pour le vocabulaire → [`VOCABULAIRE-EVENTY.md`](./VOCABULAIRE-EVENTY.md)

---

## 1. Vision

**Eventy Life**, c'est le voyage de groupe où tu n'as **rien à gérer, tout à vivre**.

> « 0 stress. Il clique, il voyage. Dynamique et libre. »

### Pourquoi on existe
- Le monde a besoin de plus de gens qui voyagent ensemble.
- Des milliers d'indépendants talentueux veulent vivre du voyage sans structure corporate.
- Le Voyageur doit se sentir **aimé** (pas satisfait — *aimé*).

### Ce qu'on construit
1. Une **plateforme SaaS** (Next.js + NestJS + Prisma + PostgreSQL) qui automatise 90% de la logistique.
2. Une **agence de voyages** (Atout France, garantie APST, RC Pro) qui opère les voyages.
3. Un **réseau** de Créateurs indépendants (auto-entrepreneurs passionnés), de Maisons HRA (hôtels, restos, activités) et d'Ambassadeurs (revendeurs locaux).
4. Une **équipe Eventy** structurée en 14 Pôles qui pilotent la qualité, la finance, la tech, le marketing.
5. Une **stack IA centrée sur Claude** (Opus 4.6 + Sonnet 4.6) qui assiste sur la création, la modération, l'opérationnel.

### Les 3 sources de remplissage
1. **Groupe organisateur** (50-70%) — famille/amis/CE qui réservent ensemble
2. **Places ouvertes publiques** (20-30%) — Voyageurs individuels qui rejoignent via `/voyages`
3. **Réseau Créateurs/Ambassadeurs** (10-20%) — chacun amène ses propres clients

### Vision de scale — 200+ voyages/semaine/pays
- Phase 1 : 1 bus / mois (53 pax) — lancement
- Phase 2 : 2 bus + allotement avion (106 pax)
- Phase 3 : Charter A320 complet (159 pax) — 1 charter/mois par destination
- Phase 4 : 200+ voyages/semaine/pays, charter B737, Maisons VIP, gamme Luxe

---

## 2. Chiffres clés

### Business
| Indicateur | Phase 1 (Bus 53) |
|-----------|------------------|
| CA moyen par voyage | **~19 766€** |
| Marge brute par voyage | **~4 919€ (24,9%)** |
| CA Y1 visé | **~500 000€** |
| Marge brute Y1 | **~119 000€** (+179% vs ancien modèle) |
| Voyageurs Y1 | **~1 432** |
| Break-even | ~1 voyage tous les 2-3 mois |
| Seuil minimal de départ | **40-45 pax** (on part quand même) |

### Technique
| Indicateur | Valeur |
|-----------|--------|
| **Lignes de code** | ~296 500+ |
| **Backend — modules NestJS** | **31** |
| **Backend — endpoints REST** | 200+ |
| **Backend — services** | 100+ |
| **Backend — controllers** | 48 |
| **Backend — webhooks Stripe** | 18 handlers |
| **Backend — tests** | 3 300+ passants |
| **Backend — DTOs validés** | 19+ |
| **Backend — indexes DB** | 313 |
| **Backend — events émis** | 46 |
| **Prisma — lignes de schema** | 3 232 |
| **Frontend — pages** | **529** (360 + 169 enrichissements 17-18 avril : gamification hub, univers, CRM pro, /independant/, /admin/securite, /admin/gamification, /pro/evenements, bus-sur-place refonte, arrêts Leaflet) |
| **Frontend — error boundaries** | ~320 |
| **Frontend — Next.js App Router** | 14.x |
| **Frontend — `'use client'`** | 95%+ (ISR sélectif sur public) |
| **Frontend — SEO** | metadata + JSON-LD sur tous les points d'entrée publics (TravelAgency, TouristTrip, Product+AggregateRating, FAQPage, BreadcrumbList, ProfilePage, WebSite, Organization), sitemap.xml dynamique, robots.txt avec crawlers IA autorisés |
| **Frontend — Perf** | 35 `next/dynamic` (voyage/[slug] tabs, cartes, NewsletterCTA), 41 `loading="lazy"`, images AVIF/WebP, tree-shaking barrel exports (lucide-react, date-fns, zod, zustand, recharts), cache immuable `/_next/static`, `output: standalone` |

### Utilisateurs (portails) — inventaire 18/04/2026
| Portail | Pages | Rôle |
|---------|-------|------|
| **Public** | 49 | Tout le monde (SEO, marketing, checkout) |
| **Voyageur** (`/client/*`) | 70 | Voyageurs connectés — inclut `/client/gamification`, `/client/univers`, `/client/evenements`, `/client/hauts-faits`, `/client/challenges`, `/client/tribus`, `/client/social` |
| **Créateur** (`/pro/*`) | 172 | Créateurs (PRO) + Admin (staff) — inclut `/pro/voyageurs` (CRM), `/pro/incidents`, `/pro/evenements`, `/pro/bus-sur-place` (rotations + devis combiné), `/pro/arrets` (Leaflet) |
| **Admin / Équipe Eventy** (`/admin/*`) | 182 | Équipe Eventy uniquement — inclut `/admin/securite/incidents-voyageurs`, `/admin/gamification/{hauts-faits,trophees,evenements}` |
| **Maisons** (`/maisons/*`) | 15 | Maisons HRA partenaires |
| **Ambassadeur** (`/ambassadeur/*`) | 10 | Revendeurs du réseau |
| **Équipe — 14 Pôles** (`/equipe/*`) | 22 | Cockpit interne par Pôle — inclut `/equipe/securite/incidents-voyageurs`, `/equipe/qualite/hauts-faits` |
| **Indépendant** (`/independant/*`) | 9 | **Nouveau portail mobile-first** (stubs — feature flag OFF) |
| **Auth / Checkout** | 18 | Tout le monde |

---

## 3. Architecture technique

### Stack
```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND — Vercel                      │
│  Next.js 14 App Router · TypeScript · Tailwind · Zustand    │
│  3 thèmes : Public (sunset), Pro (cream/terra), HUD (dark)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND — Scaleway (DEV1-M 4Go)             │
│  NestJS 10 · PM2 · Nginx reverse proxy · Swagger actif      │
│  31 modules · 200+ endpoints REST · WebSocket notifs        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│   PostgreSQL 15 (Scaleway FR) · 3 232 lignes schema         │
└─────────────────────────────────────────────────────────────┘

Services externes :
- Stripe Connect (payouts Créateurs, 3DS, 18 webhooks)
- Pennylane (compta, TVA marge, export FEC) — intégration Phase 1+
- Mailjet / SMTP (transactionnel)
- Sentry (monitoring)
- Scaleway S3 (uploads médias : eventy-uploads-prod.s3.fr-par.scw.cloud)
- Cloudflare (DNS, CDN, WAF) — NS : magali + rocco
- Mapbox/Leaflet (cartes, arrêts bus, géocoding)
```

### Submodules Git
- `backend/` → `eventylife-hub/eventy-backend`
- `frontend/` → `eventylife-hub/eventy-frontend`

### Backend — 31 modules NestJS
`admin · auth · bookings · cancellation · checkout · client · cron · documents · email · exports · finance · groups · health · hra · insurance · legal · marketing · notifications · payments · post-sale · pro · public · restauration · reviews · rooming · seo · support · transport · travels · uploads · users`

### Frontend — 3 thèmes distincts
| Portail | Thème | Police | Accent |
|---------|-------|--------|--------|
| Public | Sunset gradient (crème/terra) | Fraunces + Inter | Orange sunset |
| Voyageur (client) | Dark HUD immersif | Space Grotesk | — |
| Créateur (pro) | Crème chaleureux | Fraunces + Inter | Orange pro |
| Maisons | Dark luxury | Space Grotesk | Amber #b45309 |
| Ambassadeur | Dark | Space Grotesk | Cyan #06b6d4 |
| Équipe / Pôles | Dark HUD | Space Grotesk | Par Pôle |
| Admin | Dark HUD | Space Grotesk | Indigo |

### Infrastructure
- **Hébergement** : Frontend Vercel · Backend Scaleway Paris (FR) · DB PostgreSQL Scaleway Paris
- **CI/CD** : GitHub Actions (4 workflows : CI, deploy, E2E, security)
- **DNS** : Cloudflare (eventylife.fr → Vercel, api.eventylife.fr → Scaleway 163.172.189.137)
- **Monitoring** : Sentry (frontend + backend), Prometheus health, uptime 99.9% cible
- **Sauvegardes** : DB daily + pre-migration, S3 versioning

### Conformité
- Code du Tourisme français — immatriculation Atout France en cours
- Garantie financière APST (en cours)
- RC Pro (en cours)
- RGPD complet (consent banner, DSAR, export/delete)
- CGV + mentions légales + politique cookies publiés
- Données hébergées en France (Scaleway Paris)

---

## 4. Stack IA Eventy — **Claude au cœur**

L'IA fait partie du moteur d'Eventy. Ce n'est pas un gadget — c'est une capacité qui nous permet de tenir la promesse "0 stress" à une échelle qu'aucune agence classique ne peut atteindre.

### Cœur — Claude (Anthropic)
| Modèle | Usage |
|--------|-------|
| **Claude Opus 4.6** | Raisonnement long, rédaction fiches voyages, audits qualité, décisions Go/No-Go assistées |
| **Claude Sonnet 4.6** | Rédaction marketing, modération avis, support Voyageur niveau 1, reformulation |
| **Claude Haiku 4.5** | Classification, tagging, suggestions rapides, autocomplete wizard |

Intégration via API Anthropic + SDK TS. Prompt caching activé pour réduire les coûts.

### Cas d'usage IA actuels
- **Génération fiches voyage** (wizard Créateur) — description, accroche, SEO depuis itinéraire
- **Auto-sélection médias** — bibliothèque `/pro/medias/` : suggère les bonnes photos selon le voyage
- **Modération avis** — détection de contenu hors-sujet / insulte
- **Réponse support niveau 1** — redirection intelligente vers le bon Pôle
- **Rédaction marketing** — studio IA `/pro/marketing/studio-ia` (visuels + textes campagnes)
- **Estimation tarification** — wizard Pricing étape 2 avec provisions taxes, marges
- **Assistance PDG** — David utilise Claude Code CLI pour piloter le projet (voir [`../CLAUDE.md`](../CLAUDE.md))

### Compléments IA
- **Mapbox** (géocoding, routing, arrêts bus)
- **OpenAI embeddings** (recherche sémantique catalogue voyages) — expérimental
- **Stripe Radar** (ML anti-fraude paiement)
- **Sentry Spotlight** (détection anomalies prod)

### Principes IA
1. **Claude-first** — tout nouveau cas d'usage IA passe d'abord par Claude.
2. **Humain dans la boucle** — l'IA propose, l'humain décide (Pôle Qualité valide toute génération produit).
3. **Transparence** — on dit au Voyageur quand un contenu est généré par IA.
4. **Pas de PII dans les prompts** — jamais de nom/email/tel dans les requêtes IA non-essentielles.
5. **Prompt caching** — toujours activé sur appels récurrents.

---

## 5. Features livrées — chronologie

Liste exhaustive des features en production, ordonnée chronologiquement par chantier. Dates approximatives avec commit hash principal.

### Février 2026 — Bases plateforme
- **Sessions 120-151** : Quality Audit, Security Hardening, Performance, PWA admin + pro, tests massifs (3 300+ tests) — _commits `984370a`, `c35a1e9`, `22ae606`, `f7a37ff`, `9dc5c97`_
- **Migration Zod** forms (phases 16-18) — validation partout
- **PWA Admin + Pro** — QR installation, design spatial hexagonal — _`81d938a`, `6396daa`_
- **Sprint V15-V31** frontend — UI library, CSS vars, Zod forms

### Mars 2026 — Hardening + Déploiement
- **Cowork-14 Mega Sprint Tests** — 38 fichiers spec, 673+ tests — _20/03_
- **Cowork-15 Webhooks & 3DS** — 18 handlers Stripe, 30 tests webhook, emails 3DS — _20/03_
- **Cowork-16 Production Hardening** — 19 DTOs, 46 events, 313 indexes, 207 tests — _20/03_
- **Cowork-18 Deploy** — Site live Vercel (274 pages, 3 portails) — _20/03_
- **Cowork-20 Vente Pro 360°** — marketplace activités, 8 canaux vente, 45 endpoints, 35 pages — _20/03_
- **Cowork-21 Roadmap V2** — Viral Growth, Forfaits/Packs, Sponsors, Route Packs, Charter/Multi-bus, ClosePack Finance — _20/03_
- **Cowork-22 Réservation-Transport-Suivi** — FlightAllotment, SeatManagement, TransportStatus, BusSeatMap, SOS GPS — _21/03_
- **Cowork-23 Checkout Transport & Suivi Client** — +3 070 lignes, WebSocket notifs temps réel — _21/03_
- **Cowork-25 Backend Live Scaleway** — API `163.172.189.137` PM2 + Nginx + Prisma + Postgres — _21/03_
- **Cowork-26 Backend complet prod** — 31 modules NestJS, health + Swagger OK — _22/03_
- **Sessions 120+ Zod Migration** — validation forms Zod partout
- **Audit ARIA + TS strict** — 278 loading.tsx ARIA, 947 catch typed — _05/04_

### Avril 2026 — Enrichissement produit
- **Sprint Audit Site** — 12 fichiers modifiés, 5 collections SEO, sitemap — _06/04_
- **Sprint Design Pro** — 30+ pages HUD dark, 137 lignes CSS — _06/04_
- **Sprint Admin Métiers** — Sidebar 10 métiers, RBAC 14 rôles, 107 routes — _06/04_
- **Sprint Pro Portal** — 6 pages API réelles + fallback démo — _06/04_
- **Mega Sprint API v1+v2** — 28 pages connectées API, 0 erreur TS — _06/04_
- **Sprint UX Groupes Viraux** — 5 sprints, 35 actions, 10+ composants, landing SEO `/voyager-en-groupe`, sondages, confetti, cron relances invitations — _06/04_
- **Sprint Transport** — EtapeBusStops (base collective, gamification), EtapeFournisseurs (devis → pool 18%), bus-sur-place — _07-08/04_
- **Sprint Pricing TVA** — cascade coût complète (HRA → assurance → transport → marge 15% 7+3+5 → TVA), fix TVA ×20/100, vendeur 5% last-cookie-wins, cotisation marketing, export CSV — _09/04_, _commit `c5xxx`
- **Sprint Marketing Complet** — 4 sprints (S1 Admin Cagnotte + Lots/Prix, S2 Pro Rays, S3 Étape Marketing Voyage Phase 2 avec prospectus/affiches/flyers QR/cartes visite + commande auto imprimeur, S4 Pro Boutique) — _09/04_
- **Mega-nav Admin** — 5 groupes + command palette ⌘K + badges + switch pays/gamme + recently visited — _commits `b43b702`, `5830ff5`, `cea5e4f`, `62371ba`_
- **Sprint Cockpits Pôles** — 14/14 cockpits pôles complets avec VolumeWidget — _commits `9c9b952`, `74b40dd`_
- **Sprint Marketing Niveau 2+3** — câblage voyages, funnel, campaigns, content, acquisition, rétention, referral, advocacy, segments — _commits `977b103`, `062ffbd`, `347145f`_
- **Système HRA / Maisons** — Onboarding `INVITED → PENDING → UNDER_REVIEW → ACTIVE`, queue admin, négociations, rate cards, cascades tarifaires — _commits `f57c314`, `5195a23`, `8e4e0e3`, `f8d61b7` (audit 2 201 lignes)_
- **Rooming auto** — algorithme répartition chambres connecté au RoomingBoard — _commit `ca9ba0e`_
- **Audit HRA final exhaustif** — 169 Ko, 2 201 lignes, 5 diagrammes drawio — _`pdg-eventy/AUDIT-HRA-FINAL-EXHAUSTIF.md`_
- **Vitrine Créateur publique** — aperçu live, auto-stats, photos avis — _commits `69e79c4`, `d82f088`_
- **Tarification wizard Phase 2** — transport en estimation, gain net Créateur, file d'attente devis — _commits `d3ddd1a`, `5339713`_
- **Taxes internationales** — 12 pays, calcul auto, provisions, manifeste J-7, prix tout compris Voyageur — _commits `72e1c32`, `c8d8984`, `a5ca76c`_
- **Refonte wizard création voyage** — 8 rubriques ergonomique, auto-sélection HRA, flux complet — _commits `0de0797`, `17d9c02`, `3a1086e`_
- **Bus sur place** — refonte wizard, rotations, flux loueur sur place, horaires auto — _commits `c6c11fc`, `be3b91d`_
- **Refonte fiche voyage Netflix** `/voyages/[slug]` — UI interactive tabs + video + carte + balade virtuelle — _commits `45a0333`, `0cf0d85`, `8da031b`_
- **Refonte Netflix dark home** — destinations + groupes — _commit `1c67244`_
- **Auto-sélection médias wizard + bibliothèque `/pro/medias/`** — _commit `b570b31`_
- **Validation Phase 1 Pôle Qualité** — _commit `b570b31`_
- **Audit complet 360 pages** — 5 portails pro/maisons/ambassadeur/équipe/admin, verdict production-ready — _commit `c695a90`, `ba60dcb`_
- **Seed 10 voyages réels + 10 profils Créateurs** — _commit `acb543c`_
- **Fix bugs CSS** : var navy, opacity 0 voyage cards, /pro crash, /equipe crash, tarification wizard bloc média blanc — _commits `0adf571`, `8f2002a`, `4eb03cc`_
- **RBAC complet** — 14 rôles backend, filtrage sidebar, gamification endpoints — _commits `307dbd2`, `67504b5`_
- **Feature Flags système groupes** — backend + admin UI + 23 flags, break-glass, audit log — _commit `f255497`_

### Avril 2026 — Sprint 17-18 (Gamification + MVP lancement + portails latéraux + toile virale)

- **Toile virale Eventy** — `ShareToolkit` universel (frontend@1dbd059) : 4 portails Partager, générateurs sociaux IA (`lib/ia/prompts/social.ts`), tracking partage (`lib/share/tracking.ts`, `generators.ts`)
- **Bus-stops live** — `BusStopLiveCard`, API `/api/pro/bus-stops/[id]/{hra,parcours,pois,updates}`, `lib/types/arrets-live.ts`
- **Cascade loueurs transport** — `lib/transport/cascade-loueurs.ts`, `email-loueur.ts`, `tarification-lines.ts`, `CascadeTransportPreview` composant
- **Gamification hub Voyageur** — `/client/gamification` (hauts-faits, défis, Rays, Cookies, classement, trophées 5 tiers, saisons, points partenaires) + `/client/hauts-faits` + `/client/challenges` + `/client/classement` — _commit `6e8b6fb`_
- **Univers d'activités** — `/client/univers` : 10 univers thématiques (sport, culture, soirées, bien-être, tournois, éphémères, famille, pro, créatif, nature) — _commit `6e8b6fb`_
- **Événements sur-mesure** — `/client/evenements` (demande Voyageur) + `/pro/evenements` (manifeste liberté de création + formulaire type libre) — _commit `6e8b6fb`_
- **CRM Pro voyageurs** — `/pro/voyageurs` (fiches, segments, interactions), `/pro/incidents`, validation hauts-faits depuis `groupes/[id]` — _commit `9ee657c`_
- **Incidents voyageurs** — `/admin/securite/incidents-voyageurs` + `/equipe/securite/incidents-voyageurs` + `/equipe/qualite/hauts-faits` — _commit `9ee657c`_
- **Admin Gamification** — `/admin/gamification/{hauts-faits,trophees,evenements}` — _commit `9ee657c`_
- **Nouveau portail Indépendant** — `/independant/*` mobile-first, 9 pages stubs (feature flag OFF) — _commit `9ee657c`_
- **Preset MVP Lancement (feature flags)** — 22 nouveaux toggles (gamif / finance / B2B / portails), ComingSoonPlaceholder partout, guards gamif pro, preset "MVP Lancement" gamif OFF désactivable 1-click depuis `/admin/feature-flags`, fix `equipe/finance` Math.max — _commit `f8a44f8`_
- **Refonte `/pro/arrets`** — carte Leaflet dark + toggle liste/carte + breadcrumb "Préparation Bus > Arrêts" — _commit `44cb8fb`_
- **Refonte `/pro/bus-sur-place`** — rotation planner (auto-boucle + manuel, pattern sur N semaines), devis combiné loueurs 2 lignes (A/R + sur-place) avec auto-sélection par destination — _commit `44cb8fb`_
- **Bibliothèque partagée bus-sur-place** — trajets partagés entre Créateurs, réutilisation mutualisée — _commit `b64e059`, frontend@179da0e_
- **Passe contraste WCAG AA** — `bg-white` bannis du dark HUD, doc règle globale — _commit `2daa65e`_
- **Audit finance poches** — `docs/audit-finance-poches-2026-04.md`, trajectoire euro par euro — _commit `8d700fb`_
- **SEO renforcé** — ProfilePage JSON-LD + BreadcrumbList sur `/createur/[slug]`, schémas TouristTrip/Product/AggregateRating/FAQPage sur `/voyages/[slug]`, schémas TravelAgency/FAQPage/Breadcrumb sur `/` — _commit courant_

### En cours (avril 2026)
- Câblage **Stripe Connect payouts Créateurs** (~8h)
- Implémentation **upload photos modal** voyages/[id]/medias (~3h)
- **Export rooming PDF/CSV** (~2h)
- Câblage **Pennylane** (sync compta, exports FEC) (~6h)
- **Skeleton loading batch** sur ~80 pages /pro restantes (~4h)
- **Backend endpoints Maisons/Ambassadeur** (remplacer demo data) (~12h)
- **Endpoints manquants** : `GET /public/creators/:slug`, `GET /hra/catalog`, `GET /hra/loueurs`, `GET /pro/independents`

---

## 6. Features futures — Phase 2+

### Phase 2 — Luxe + Gamification + Bracelets (H2 2026)
- **Gamme Luxe** — Maisons 5★, expériences privées, chauffeurs, petits groupes 15-25 pax, 2 000-5 000€/pax
- **Bracelets restaurateur** — identification Voyageurs Eventy dans restos partenaires
- **Tribus** — communautés de Voyageurs qui refont des voyages ensemble (moteur rétention)
- **Salon Voyage annuel** — événement physique Créateurs + Maisons + Voyageurs
- **Voyage co-créé** — mariage, EVJF, séminaire, voyage sur-mesure avec le Voyageur
- **Gamification poussée** — Rays avancés, niveaux Voyageur, badges, quêtes
- **Charter avion A320** — 159 pax, -35% à -50% vs régulier
- **Chat de groupe** (feature flag OFF au lancement)
- **Cagnotte groupe** (feature flag OFF au lancement)
- **Arbre viral** — qui a invité qui, top parrains (pitch investisseur)
- **Prix dégressifs groupe** — -5% à 10 pax, -10% à 20 pax
- **Personnalisation groupe** — thème, couleur, playlist, photo cover

### Phase 3 — International + Fondation (2027+)
- **Destinations intercontinentales** — Asie, Amérique, Afrique
- **Fondation Eventy .org** — voyages pour jeunes / seniors isolés / associations
- **Marketplace international Ambassadeurs** — multi-pays
- **Mega-nav switch pays/gamme** (déjà cablé UI, à activer)
- **Business Intelligence** — Pôle Data, cohortes, forecasting, LTV
- **200+ voyages/semaine/pays** — opérations industrialisées

---

## 7. Équipe — Plan 14 co-fondateurs

> **Décision structurante** (avril 2026) : Eventy ne recrute pas des salariés pour les fonctions clés — elle recrute **14 co-fondateurs**, chacun à la tête d'un Pôle, rémunérés en **parts sociales** plutôt qu'en salaire.

### Modèle
- **Parts sociales** : chaque co-fondateur reçoit un % d'actions de la SAS.
- **Salaire = reversement Créateurs** : le revenu de base du co-fondateur vient de sa propre activité de Créateur sur Eventy (si applicable) ou d'une allocation minimale temporaire.
- **Objectif** : aligner intérêts, réduire masse salariale en phase d'amorçage, créer un noyau dur motivé.

### Les 14 Pôles & co-fondateurs
1. Direction (David — PDG)
2. Finance
3. Voyage
4. Transport
5. Commercial
6. Talents
7. Marketing
8. Support
9. Juridique
10. Sécurité
11. Tech
12. Data
13. Qualité
14. Maisons
15. Achats

> _Voir [`../pdg-eventy/06-rh-organisation/ORGANIGRAMME.md`](../pdg-eventy/06-rh-organisation/ORGANIGRAMME.md) pour les fiches de poste détaillées._

---

## 8. Faisabilité

**Audit faisabilité** (réalisé avril 2026) : **6.5/10 → 9+/10**
- Passage de 6.5 à 9+ grâce à :
  - Plan d'action réparti entre les 14 co-fondateurs
  - Claude au cœur de la stack (efficacité × 3 sur production contenu + support)
  - Seuil minimal de départ assumé (on part à 40-45)
  - Intégrations finance (Pennylane, Stripe Connect) qui réduisent friction admin
  - Backend déjà en prod → pas de risque tech majeur

---

## 9. Liens

- **Site live** : https://www.eventylife.fr
- **API backend** : http://api.eventylife.fr (DNS Cloudflare en finalisation)
- **GitHub backend** : https://github.com/eventylife-hub/eventy-backend
- **GitHub frontend** : https://github.com/eventylife-hub/eventy-frontend
- **PDG contact** : eventylife@gmail.com

---

*Document maître maintenu par l'IA PDG. Toute feature majeure livrée ou décidée doit être ajoutée ici.*
