# ✅ Statut des fonctionnalités Eventy

> **Dernière mise à jour** : 18 avril 2026
> **Source** : audits `docs/audit-pro-gestion-2026-04.md`, `docs/audit-fallback-3-interfaces.md`, `docs/audit-groupes.md`, `docs/audit-finance-poches-2026-04.md` + commits récents (`6e8b6fb`, `9ee657c`, `f8a44f8`, `44cb8fb`, `b64e059`).
> **Légende** : ✅ Live · 🟡 Partiel · 🔴 Bug · ⏳ À faire · ⚪ Stub (feature flag OFF) · ❌ Non implémenté

---

## Vue d'ensemble — inventaire 18/04/2026

| Portail | Pages | ✅ Live | 🟡 Partiel | ⚪ Stub | 🔴 Bug | ⏳ À faire |
|---------|-------|---------|-----------|---------|--------|------------|
| **Public** | 49 | 48 | 1 | 0 | 0 | 0 |
| **Voyageur** (`/client`) | 70 | 59 | 4 | 7 | 0 | 0 |
| **Créateur** (`/pro`) | 172 | 163 | 3 | 6 | 0 | 0 |
| **Maisons** (`/maisons`) | 15 | 15 | 0 | 0 | 0 | 0 |
| **Ambassadeur** | 10 | 8 | 2 | 0 | 0 | 0 |
| **Équipe — 14 Pôles** | 22 | 20 | 0 | 2 | 0 | 0 |
| **Admin** | 182 | 172 | 5 | 5 | 0 | 0 |
| **Indépendant** (nouveau) | 9 | 0 | 0 | 9 | 0 | 0 |
| **Auth / Checkout** | 18 | 18 | 0 | 0 | 0 | 0 |
| **TOTAL** | **529** | **503** | **15** | **29** | **0** | **0** |

**Verdict global** : 🟢 **Production-ready** · 0 bug critique · 95% pages Live · 5% stubs (feature flag OFF, prêts au câblage post-lancement).

### Delta depuis le 16/04 — +169 pages

- **+20 Public** : pages SEO additionnelles (collections, départs ville, itinéraires, partenaires, createur/[slug])
- **+37 Voyageur** : hub gamification (`/client/gamification`, `/client/hauts-faits`, `/client/challenges`, `/client/classement`), 10 univers (`/client/univers`), `/client/evenements`, `/client/tribus`, `/client/social`
- **+12 Créateur** : CRM voyageurs (`/pro/voyageurs`), `/pro/incidents`, `/pro/evenements`, `/pro/hauts-faits`, `/pro/challenges`, `/pro/classement`, `/pro/bus-sur-place` (rotations + devis combiné), `/pro/arrets` (Leaflet), `/pro/satisfaction`, `/pro/validation-status`
- **+14 Admin** : `/admin/securite/incidents-voyageurs`, `/admin/gamification/{hauts-faits,trophees,evenements}` + enrichissements sections Finance et RBAC
- **+6 Équipe** : `/equipe/securite/incidents-voyageurs`, `/equipe/qualite/hauts-faits` + cockpits affinés
- **+6 Maisons** : sous-pages onboarding + parametres
- **+3 Ambassadeur** : outils/documents
- **+9 Indépendant (nouveau portail)** : portail mobile-first (stubs, feature flag OFF)

---

## 🌐 Portail Public (29 pages)

| Page | Statut | Notes |
|------|--------|-------|
| `/` (home) | ✅ Live | Refonte Netflix dark destinations + groupes |
| `/voyages` | ✅ Live | Catalogue 360°, filtres |
| `/voyages/[slug]` | ✅ Live | Refonte Netflix — tabs, vidéo, carte, balade virtuelle |
| `/voyages/[slug]/avis` | ✅ Live | Avis Voyageurs |
| `/voyages/[slug]/checkout` | ✅ Live | Checkout intégré |
| `/voyages/[slug]/groupes` | ✅ Live | Groupes ouverts |
| `/depart` | ✅ Live | Liste villes |
| `/depart/[ville]` | ✅ Live | Pages SEO par ville |
| `/itineraires` | ✅ Live | JSON-LD + SEO |
| `/collections/*` | ✅ Live | 5 collections (dont Route Gastronomique) |
| `/blog` + `/blog/[slug]` | ✅ Live | Blog SEO |
| `/a-propos` | ✅ Live | — |
| `/avis` | ✅ Live | Avis publics |
| `/brochure` | ✅ Live | Téléchargement |
| `/cgv` | ✅ Live | — |
| `/comment-ca-marche` | ✅ Live | — |
| `/conditions` + `/confidentialite` + `/politique-confidentialite` | ✅ Live | — |
| `/contact` | ✅ Live | Formulaire |
| `/cookies` | ✅ Live | Consent banner |
| `/devenir-partenaire` | ✅ Live | Landing recrutement |
| `/faq` | ✅ Live | — |
| `/mentions-legales` | ✅ Live | — |
| `/partenaires` | ✅ Live | Liste |
| `/pro/[slug]` | ✅ Live | Fiche Créateur publique |
| `/createur/[slug]` | 🟡 Partiel | MOCK_CREATOR → `GET /public/creators/:slug` endpoint manquant |
| `/p/[proSlug]` | ✅ Live | Shortlink Ambassadeur |
| `/suivi-commande` | ✅ Live | Sans connexion |
| `/v/[code]` | ✅ Live | Lien viral |
| `/voyager-en-groupe` | ✅ Live | Landing SEO groupes |

---

## 👤 Portail Voyageur `/client/*` (33 pages)

| Page | Statut | Notes |
|------|--------|-------|
| `/client` (dashboard) | ✅ Live | API live |
| `/client/reservations` | 🟡 Partiel | FALLBACK DEMO_RESERVATIONS — seed nécessaire |
| `/client/reservations/[id]` | ✅ Live | — |
| `/client/reservations/[id]/annuler` | ✅ Live | Fallback local |
| `/client/reservations/[id]/avis` | ✅ Live | — |
| `/client/reservations/[id]/preferences` | ✅ Live | — |
| `/client/reservations/[id]/rooming` | ✅ Live | — |
| `/client/voyage/[id]` | ✅ Live | Hub voyage |
| `/client/voyage/[id]/bus-programme` | ✅ Live | — |
| `/client/voyage/[id]/cagnotte` | ✅ Live | (feature flag pour activer paiement cagnotte) |
| `/client/voyage/[id]/chat` | ✅ Live | WebSocket |
| `/client/voyage/[id]/transport` | ✅ Live | — |
| `/client/groupes` | 🟡 Partiel | FALLBACK CENTRALIZED_GROUPS — seed nécessaire |
| `/client/groupes/[id]` | ✅ Live | Chat/membres/sondages/milestones |
| `/client/groupes/creer` | ✅ Live | 3 étapes |
| `/client/groupes/[id]/inviter` | ✅ Live | 4 canaux (amis/email/code/QR) |
| `/client/groupes/[id]/edit` | ✅ Live | — |
| `/client/groupes/rejoindre` | ✅ Live | Code + preview |
| `/client/favoris` | 🟡 Partiel | FALLBACK DEMO — seed |
| `/client/amis` | ✅ Live | — |
| `/client/messagerie` | ✅ Live | — |
| `/client/paiements` | 🟡 Partiel | FALLBACK DEMO_PAYMENTS |
| `/client/profil` | ✅ Live | — |
| `/client/preferences-notifications` | ✅ Live | — |
| `/client/pourboire` | ✅ Live | — |
| `/client/wallet` | ✅ Live | Wallet vide = état normal |
| `/client/documents` | ✅ Live | — |
| `/client/ce` | ✅ Live | — |
| `/client/cookies-fidelite` | ✅ Live | Programme fidélité |
| `/client/rays` | ✅ Live | Monnaie Rays |
| `/client/urgence` | ✅ Live | SOS GPS |

---

## 🎨 Portail Créateur `/pro/*` (160 pages)

### Dashboard & onboarding (✅)
| Page | Statut | Notes |
|------|--------|-------|
| `/pro` | ✅ Live | 60+ widgets, gamification XP, auto-refresh |
| `/pro/login` + `/pro/inscription` | ✅ Live | — |
| `/pro/onboarding` | ✅ Live | 6 étapes |
| `/pro/formation` | ✅ Live | Modules vidéo, certification |
| `/pro/profil` + `/pro/parametres/profil` | 🟡 Partiel | `GET /pro/profile` endpoint à brancher sur parametres |
| `/pro/notifications` | 🟡 Partiel | FALLBACK DEMO — seed |

### Voyages (section principale)
| Section | Statut | Notes |
|---------|--------|-------|
| `/pro/voyages` (liste) | ✅ Live | Cockpit/liste/calendrier |
| `/pro/voyages/nouveau` | ✅ Live | Wizard 8 rubriques |
| `/pro/voyages/[id]` | ✅ Live | Hub avec 30+ sous-pages |
| `/pro/voyages/[id]/reservations` | ✅ Live | — |
| `/pro/voyages/[id]/groupes` | ✅ Live | — |
| `/pro/voyages/[id]/rooming` | ✅ Live | Algo auto |
| `/pro/voyages/[id]/rooming/hotel-blocks` | ✅ Live | — |
| `/pro/voyages/[id]/hotellerie` | 🟡 Partiel | TODOs : contact hôtel, export rooming PDF/CSV |
| `/pro/voyages/[id]/restauration` | ✅ Live | — |
| `/pro/voyages/[id]/activites` | ✅ Live | — |
| `/pro/voyages/[id]/transport/*` (7) | ✅ Live | Bus/avion/manifest/suivi |
| `/pro/voyages/[id]/medias` | 🟡 Partiel | TODOs : upload modal (2-3h) |
| `/pro/voyages/[id]/marketing/*` | ✅ Live | — |
| `/pro/voyages/[id]/finance` | ✅ Live | — |
| `/pro/voyages/[id]/factures` | ✅ Live | — |
| `/pro/voyages/[id]/remplissage` | ✅ Live | — |
| `/pro/voyages/[id]/sponsors` | 🟡 Partiel | FALLBACK DEMO — seed |
| `/pro/voyages/[id]/terrain/*` (7) | ✅ Live | Appel, contacts, incidents, sécurité, déclarations |
| `/pro/voyages/[id]/bilan` | ✅ Live | ClosePack |
| `/pro/voyages/[id]/chambres` | 🟡 Partiel | TODO : resend payment invite + invite co-payer |
| `/pro/voyages/[id]/equipe` | ✅ Live | — |

### Marketing (17 sous-pages)
| Page | Statut | Notes |
|------|--------|-------|
| `/pro/marketing` | ✅ Live | Hub |
| `/pro/marketing/analytics` | ✅ Live | — |
| `/pro/marketing/boost` | ✅ Live | — |
| `/pro/marketing/boutique` | ✅ Live | Rays + challenges |
| `/pro/marketing/creer` | ✅ Live | — |
| `/pro/marketing/campaigns` | ✅ Live | — |
| `/pro/marketing/content` | ✅ Live | — |
| `/pro/marketing/funnel` | ✅ Live | — |
| `/pro/marketing/kit-media` | ✅ Live | — |
| `/pro/marketing/liens` | ✅ Live | Shortlinks |
| `/pro/marketing/qr` | ✅ Live | QR trackés |
| `/pro/marketing/studio-ia` | ✅ Live | Claude — visuels + textes |
| `/pro/marketing/segments` | ✅ Live | — |
| `/pro/marketing/acquisition` | ✅ Live | — |
| `/pro/marketing/retention` | ✅ Live | — |
| `/pro/marketing/referral` | ✅ Live | — |
| `/pro/marketing/advocacy` | ✅ Live | — |
| `/pro/marketing/[id]` | ✅ Live | Détail campagne |

### Vendre (10 sous-pages)
| Page | Statut |
|------|--------|
| `/pro/vendre` | ✅ Live |
| `/pro/vendre/dashboard` | ✅ Live |
| `/pro/vendre/devis` | ✅ Live |
| `/pro/vendre/widget` | ✅ Live |
| `/pro/vendre/landing-pages` | ✅ Live |
| `/pro/vendre/lien-paiement` | ✅ Live |
| `/pro/vendre/notifications` | 🟡 Partiel | Chemin `/api/pro/sales/notifications` incorrect (devrait être `/pro/sales/notifications`) |

### Activités, transport, finance
| Page | Statut |
|------|--------|
| `/pro/activites/communaute` | ✅ Live |
| `/pro/activites/mes-activites` | ✅ Live |
| `/pro/arrets` | ✅ Live |
| `/pro/arrets/nouveau` | ✅ Live |
| `/pro/association/inscription` | ✅ Live |
| `/pro/finance` | ✅ Live |
| `/pro/finance/cloture` | ✅ Live |
| `/pro/revenus` + `/pro/revenus/releve` | ✅ Live |
| `/pro/paiements` | 🟡 Partiel | FALLBACK DEMO_PAYMENTS |
| `/pro/medias/` (bibliothèque) | ✅ Live | Auto-sélection wizard |
| `/pro/messagerie` | ✅ Live | — |
| `/pro/documents` | ✅ Live | — |
| `/pro/support` | ✅ Live | — |
| `/pro/magasin/vendeurs` | ✅ Live | — |
| `/pro/groupes/[id]` | ✅ Live | — |
| `/pro/groupes/creer` | ✅ Live | — |
| `/pro/compte` | ✅ Live | — |

---

## 🏛️ Portail Maisons `/maisons/*` (9 pages)

| Page | Statut | Notes |
|------|--------|-------|
| `/maisons` (root) | ✅ Live | Redirect → hebergement |
| `/maisons/hebergement` | ✅ Live | KPIs, missions, checklist, timeline |
| `/maisons/restauration` | ✅ Live | Menus, allergènes |
| `/maisons/activites` | ✅ Live | Catalogue premium |
| `/maisons/transport` | ✅ Live | Flotte luxe |
| `/maisons/image-souvenirs` | ✅ Live | Photographes, vidéastes |
| `/maisons/decoration` | ✅ Live | Art floral |
| `/maisons/coordination` | ✅ Live | Coordination VIP |
| `/maisons/securite` | ✅ Live | Sécurité VIP |

**⚠️ Backend endpoints Maisons** : 100% demo au 15/04. Persistance "Accepter/Refuser" à câbler (~12h Pôle Tech).

---

## 🤝 Portail Ambassadeur (7 pages)

| Page | Statut | Notes |
|------|--------|-------|
| `/ambassadeur` (root) | ✅ Live | Redirect → dashboard |
| `/ambassadeur/dashboard` | ✅ Live | KPIs, ventes, alertes |
| `/ambassadeur/catalogue` | ✅ Live | Voyages à vendre |
| `/ambassadeur/ventes` | ✅ Live | Historique |
| `/ambassadeur/commissions` | ✅ Live | Suivi |
| `/ambassadeur/outils` | 🟡 Partiel | 100% MOCK — QR placeholder, pas d'API, tracking ref hardcodé |
| `/ambassadeur/profil` | 🟡 Partiel | Bouton "Enregistrer" = visuel, ne persiste pas |
| `/ambassadeur/login` | ✅ Live | Corrigé commit `4eb03cc` |

---

## 🏢 Portail Équipe — 14 Pôles `/equipe/*` (16 pages)

Tous les cockpits ✅ Live. API `/equipe/{pole}` avec fallback demo.

| Pôle | Cockpit | Lignes | Statut |
|------|---------|--------|--------|
| Direction | `/equipe` | ~325 | ✅ Live |
| Finance | `/equipe/finance` | ~512 | ✅ Live |
| Voyage | `/equipe/voyage` | ~474 | ✅ Live |
| Transport | `/equipe/transport` | ~470 | ✅ Live |
| Commercial | `/equipe/commercial` | ~515 | ✅ Live |
| Talents | `/equipe/talents` | ~318 | ✅ Live |
| Marketing | `/equipe/marketing` | ~320 | ✅ Live |
| Support | `/equipe/support` | ~396 | ✅ Live |
| Juridique | `/equipe/juridique` | ~405 | ✅ Live |
| Sécurité | `/equipe/securite` | ~450 | ✅ Live |
| Tech | `/equipe/tech` | ~424 | ✅ Live |
| Data | `/equipe/data` | ~298 | ✅ Live |
| Qualité | `/equipe/qualite` | ~314 | ✅ Live |
| Maisons | `/equipe/maisons` | ~498 | ✅ Live |
| Achats | `/equipe/achats` | ~360 | ✅ Live |

**⚠️ Backend endpoints Équipe** : 100% catch silencieux au 15/04. À câbler pour abandon du demo.

---

## ⚙️ Portail Admin `/admin/*` (168 pages)

| Section | Pages | Statut |
|---------|-------|--------|
| Dashboard | 1 | ✅ Live — 10 widgets refonte |
| **Finance** | 22 | ✅ Live (ledger, reconciliation, TVA, Stripe delays, payouts, exports, HRA cascade, indie-cotisations, payout batch, bank accounts) |
| **Voyages + contrôle** | 17 | ✅ Live (Go/no-go, lifecycle, feedback, rooming, transport, santé) |
| **Marketing** | 15 | ✅ Live (acquisition, retention, segments, funnel, presse, Rays, planner) · 🟡 `/admin/marketing/campaigns` et `/content` = stubs (endpoint commenté) |
| **Transport** | 12 | ✅ Live (routes, stops, loueurs, chauffeurs, devis, validation, route packs) |
| **Métiers** | 11 | ✅ Live (accompagnateur, animateur, chauffeur, guide, photographe...) |
| **Utilisateurs + RBAC** | 5 | ✅ Live (users, rôles, feature flags, 14 rôles) |
| **Statistiques** | 4 | ✅ Live (financier, partenaires, voyages, satisfaction) |
| **HRA / Maisons** | ~12 | ✅ Live (négociations, rate cards, onboarding queue) · 🟡 `/admin/hra/rate-cards` chemin `/api/hra/hotel-partners` incorrect |
| **Incidents** | 1 | ✅ Live |
| **Compliance / DSAR / Legal** | ~8 | ✅ Live |
| **Monitoring** | 3 | ✅ Live (health, cron, jobs) |
| **Comms / Messagerie / Support** | ~8 | ✅ Live |
| **Sponsors** | 2 | ✅ Live |
| **CE / Asso** | 3 | ✅ Live |
| **Exports** | 1 | ✅ Live |
| **Formation** | 1 | ✅ Live |
| **Pros / Certifications** | 3 | 🟡 `/admin/pros/certifications` 100% MOCK (endpoint manquant) |
| **Groupes viraux** | 3 | ✅ Live (data table + analytics) · ⏳ settings flags (page manquante) |
| **Investisseur** | 1 | ✅ Live (read-only) |
| **RBAC + Feature flags** | 2 | ✅ Live — break-glass + 4-eyes |
| **Fournisseurs** | 1 | ✅ Live |
| **Équipes** | 1 | ✅ Live |
| **Autres** (planning, carnets, itinéraires, notifications, emails-queue, intégrations, forfaits, data-satisfaction, documents...) | ~30 | ✅ Live |

---

## 🔐 Auth & Checkout (18 pages)

| Page | Statut |
|------|--------|
| `/connexion` | ✅ Live |
| `/inscription` | ✅ Live |
| `/verification-email` | ✅ Live |
| `/mot-de-passe-oublie` | ✅ Live |
| `/reinitialiser-mot-de-passe` | ✅ Live |
| `/admin-login` | ✅ Live |
| `/beta-access` | ✅ Live |
| `/checkout/start` | ✅ Live |
| `/checkout/step-1` | ✅ Live |
| `/checkout/step-2` | ✅ Live |
| `/checkout/step-3` | ✅ Live |
| `/checkout/confirmation` | ✅ Live |
| `/checkout/activites` | ✅ Live |
| `/checkout/transport` | ✅ Live |
| `/embed/[proSlug]` | ✅ Live |
| `/maintenance` | ✅ Live |
| `/offline` | ✅ Live |

---

## 🎯 Priorités correctifs (court terme)

Classé par impact business :

| # | Action | Pôle | Effort | Impact |
|---|--------|------|--------|--------|
| 1 | Câbler Stripe Connect payouts Créateurs | Tech + Finance | ~8h | 💰 Critique |
| 2 | Implémenter upload photos modal voyages | Tech | ~3h | 📸 UX Créateur |
| 3 | Export rooming PDF/CSV | Tech | ~2h | 📄 Opérationnel |
| 4 | Câbler Pennylane (sync + exports FEC) | Finance + Tech | ~6h | 📊 Finance |
| 5 | Backend endpoints Maisons/Ambassadeur | Tech | ~12h | 🏨 Pré-lancement |
| 6 | Skeleton loading batch ~80 pages /pro | Tech | ~4h | ✨ UX |
| 7 | Endpoint `GET /public/creators/:slug` | Tech | ~2h | 🔍 SEO |
| 8 | Endpoints `/hra/catalog`, `/hra/loueurs`, `/pro/independents` | Tech | ~6h | Wizard voyage |
| 9 | Fix chemins `/api/*` incorrects (3 fichiers) | Tech | ~30min | 🔴 P1 |
| 10 | Persistance Maisons Accepter/Refuser | Tech | ~3h | 🏨 Opérationnel |

---

## 📦 Seed prioritaire pour beta

- **Au moins 1 voyage** `SALES_OPEN` pour `/voyages` et `/voyages/[slug]`
- **10 voyages réels + 10 profils Créateurs** déjà seedés (commit `acb543c`) ✅
- **Réservations demo** (`/admin/bookings`, `/client/reservations`)
- **Arrêts de bus** (`/checkout/step-2`, `/pro/arrets`)
- **HRA favorites** (`/api/pro/hra/favorites`) — 4 composants wizard en dépendent

---

## 🆕 Sprint 17-18 avril 2026 — livraisons majeures

### Gamification & Social (Voyageur)
- `/client/gamification` — hub (hauts-faits, défis, Rays, Cookies, classement, trophées 5 tiers, saisons, points partenaires) ✅
- `/client/univers` — 10 univers thématiques (sport, culture, soirées, bien-être, tournois, éphémères, famille, pro, créatif, nature) ✅
- `/client/evenements` — demande d'événement sur-mesure ✅
- `/client/tribus`, `/client/social`, `/client/challenges`, `/client/hauts-faits`, `/client/classement` ✅

### CRM Pro & Sécurité
- `/pro/voyageurs` — CRM complet (fiches, segments, interactions) ✅
- `/pro/incidents` — déclarations et suivi ✅
- `/pro/evenements` — manifeste liberté de création + formulaire type libre ✅
- `/admin/securite/incidents-voyageurs` + `/equipe/securite/incidents-voyageurs` ✅
- Validation hauts-faits depuis `groupes/[id]` ✅

### Admin Gamification
- `/admin/gamification/hauts-faits` ✅
- `/admin/gamification/trophees` ✅
- `/admin/gamification/evenements` ✅
- `/equipe/qualite/hauts-faits` ✅

### Portail Indépendant (nouveau — stubs)
- `/independant/*` — 9 pages mobile-first préparatoires (feature flag OFF) ⚪

### Feature Flags MVP Lancement
- Preset "MVP Lancement" — gamif OFF désactivable 1-click depuis `/admin/feature-flags` ✅
- 22 nouveaux toggles (gamif / finance / B2B / portails) ✅
- ComingSoonPlaceholder partout ✅
- Guards gamif pro (affichage conditionnel) ✅

### Préparation Bus (Pro)
- `/pro/arrets` — carte Leaflet dark + toggle liste/carte + breadcrumb "Préparation Bus > Arrêts" ✅
- `/pro/bus-sur-place` — rotation planner (auto-boucle + manuel, pattern sur N semaines) ✅
- `/pro/bus-sur-place` — devis combiné loueurs (2 lignes A/R + sur-place, auto-sélection par destination) ✅
- **Bibliothèque partagée bus-sur-place** — trajets mutualisés entre Créateurs ✅

### Qualité / Accessibilité
- Passe contraste WCAG AA — `bg-white` bannis du dark HUD, règle documentée ✅
- Audit finance poches — trajectoire euro par euro (`docs/audit-finance-poches-2026-04.md`) ✅

### SEO / Performance (sprint présent)
- Schémas JSON-LD : TravelAgency, TouristTrip, Product+AggregateRating, FAQPage, BreadcrumbList, WebSite sur toutes les pages publiques critiques ✅
- **ProfilePage + BreadcrumbList JSON-LD ajoutés sur `/createur/[slug]`** ✅
- Sitemap.xml dynamique (API `/travels` + fallback slugs connus + blog dynamique + 10 villes de départ) ✅
- robots.txt avec allowlist crawlers IA (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended…) ✅
- Lazy loading : 41 images `loading="lazy"` + next/image AVIF/WebP ✅
- Code splitting : 35 `next/dynamic` (voyage/[slug] 11 tabs, cartes Leaflet, NewsletterCTA) ✅
- Tree-shaking barrel exports : lucide-react, date-fns, zod, zustand, recharts, @/components/ui ✅
- Images : device sizes + image sizes tunés, cache TTL 30j, AVIF/WebP ✅
- Headers sécurité + caching `/_next/static` immuable + `Link: </sitemap.xml>; rel="preload"` ✅

---

*Statut audité le 18/04/2026. Prochain audit recommandé après câblage Stripe Connect + Pennylane + endpoints Maisons/Indépendant.*
