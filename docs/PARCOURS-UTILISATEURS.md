# 🛤️ Parcours utilisateurs — End to End

> **Dernière mise à jour** : 16 avril 2026
> Documente les flux complets des 5 populations qui interagissent avec Eventy : Voyageur, Créateur, Ambassadeur, Maison HRA, Équipe (14 Pôles).
>
> Vocabulaire : voir [`VOCABULAIRE-EVENTY.md`](./VOCABULAIRE-EVENTY.md).

---

## 1. 👤 Voyageur — *Découvre, réserve, part, revient, recommande*

### Étape 1 — Découverte
- **Canal 1 — Recherche Google** → `/` (home) → `/voyages` (catalogue 360°, filtres) → `/voyages/[slug]` (fiche Netflix immersive avec tabs, vidéo, carte, balade virtuelle)
- **Canal 2 — Réseaux sociaux** → pub Instagram/TikTok → landing spécifique ou `/voyages/[slug]`
- **Canal 3 — Ambassadeur local** (tabac, coiffeur, CE) → QR code ou shortlink `/p/[proSlug]` → fiche voyage
- **Canal 4 — Bouche à oreille / Groupe** → invitation WhatsApp → `/v/[code]` (lien viral) → preview groupe → rejoindre
- **Canal 5 — SEO villes** → `/depart/[ville]` (page SEO par ville de départ, 100+ villes)
- **Canal 6 — Blog / Contenu** → `/blog/[slug]` → CTA voyage

### Étape 2 — Considération
- Fiche voyage enrichie : **prix tout compris** (taxes internationales incluses), photos du Créateur, itinéraire jour par jour, arrêts bus, Maisons d'accueil, avis Voyageurs précédents, vidéo immersive, carte interactive, balade virtuelle
- **Fiche Créateur** : vitrine publique `/createur/[slug]` avec biographie, voyages passés, avis photos
- **Favoris** (si connecté) → `/client/favoris`
- **Mode démo** : toutes les fiches ont un fallback si l'API est down — jamais d'écran blanc

### Étape 3 — Réservation
Checkout en 3 étapes :
1. **`/checkout/step-1`** — Choix chambre (single / double / triple / quadruple) + nombre de Voyageurs
2. **`/checkout/step-2`** — Choix arrêt de ramassage (carte interactive Leaflet, 100+ arrêts)
3. **`/checkout/step-3`** — Paiement Stripe 3DS (carte, Apple Pay, Google Pay). Pack Sérénité inclus **automatiquement**. Échelonné optionnel (acompte 30% + solde J-30).
- **Confirmation** → `/checkout/confirmation` + email transactionnel (14 templates)

### Étape 4 — Pré-voyage
- **Espace Voyageur** `/client/*` (33 pages) — dashboard, réservations, groupe, favoris, wallet, messages
- **Fiche voyage personnelle** `/client/voyage/[id]` — countdown, documents (billet, itinéraire, fiche sécurité), chat groupe, cagnotte
- **Invitation groupe** `/client/groupes/[id]/inviter` — 4 canaux : amis, email, code-lien, QR
- **Rooming** `/client/reservations/[id]/rooming` — choix des colocs chambre
- **Préférences** — régime alimentaire, accessibilité, notifications
- **Manifeste J-7** — envoyé automatiquement (liste passagers, horaires, arrêts)

### Étape 5 — Pendant le voyage
- **Cocktail de départ** — accueil au point de ramassage par le Créateur (règle : dès le 1er km)
- **Suivi temps réel** — WebSocket notifs, position bus, horaires actualisés
- **Chat groupe** — ouvert pendant le voyage (feature flag à activer Phase 2)
- **SOS GPS** — bouton urgence avec géolocalisation → Pôle Support + Créateur accompagnateur
- **Pack Sérénité actif** — annulation, rapatriement, bagages, médical, remplacement Créateur

### Étape 6 — Retour & fidélisation
- **Avis post-voyage** — `/client/reservations/[id]/avis` (modération IA + humaine)
- **Cookies de Fidélité** — gagné sur ce voyage → solde `/client/cookies-fidelite`
- **Photos du voyage** — album partagé groupe (Phase 2)
- **Pourboire** — `/client/pourboire` pour le Créateur
- **Suggestions prochains voyages** — based on historique
- **Parrainage** — code Voyageur → Rays ☀️ si un ami réserve

### Étape 7 — Recommandation
- **Réseau social** — partage `/v/[code]` (K-factor visé 6-10)
- **Créer un groupe** — pour le prochain voyage, inviter amis/famille
- **Ambassadeur informel** — certains Voyageurs deviennent de véritables Ambassadeurs (proposition post-voyage)

---

## 2. 🎨 Créateur — *S'inscrit, crée, publie, reçoit, accompagne, est payé*

### Étape 1 — Inscription
- **`/pro/inscription`** — email + mot de passe + SIRET + statut (AE, SASU, SARL)
- **Upload documents** : KBIS, RIB, attestation AE, justificatif identité
- **Onboarding 6 étapes** `/pro/onboarding` — profil, compétences, destinations, photo, bio, convention
- **Validation Eventy** par Pôle Talents → passage `INVITED → ACTIVE`

### Étape 2 — Découverte du portail
- **Dashboard** `/pro` — 60+ widgets organisés par métier (Créateur, Activités, Transport, Marketing, Terrain), gamification XP, filtre par rôle
- **Formation** `/pro/formation` — modules vidéo, progression, certification Eventy
- **Annuaire** — voir les autres Créateurs, leurs voyages
- **Boutique Rays** `/pro/marketing/boutique` — échanger Rays contre services marketing

### Étape 3 — Création d'un voyage (wizard 8 rubriques)
1. **Identité** — titre, destination, dates, nombre de jours
2. **Itinéraire** — jour par jour avec arrêts, Maisons (auto-sélection IA)
3. **Hébergement** — choix Maisons d'accueil (favoris `/pro/hra/favorites`)
4. **Restauration** — menus, allergènes, Maisons
5. **Activités** — catalogue premium + communauté (adopt)
6. **Transport** — bus/avion/train, arrêts, devis fournisseurs
7. **Médias** — auto-sélection depuis bibliothèque `/pro/medias/` + upload
8. **Marketing** — prospectus, affiches, flyers QR, cartes visite (commande auto imprimeur)
9. **Tarification** (étape finale) — cascade coût complète HRA → assurance → transport → marge 15% (7% Eventy + 3% Créateur + 5% vendeur) → TVA

### Étape 4 — Validation & publication
- **Soumission Pôle Qualité** → validation Phase 1 (audit auto IA + relecture humaine)
- **Statut** : `DRAFT → PHASE1 → PHASE2 → PUBLISHED`
- **Publication** → voyage visible sur `/voyages`, partageable par Ambassadeurs

### Étape 5 — Vente & marketing
- **Dashboard marketing** `/pro/marketing` (17 sous-pages)
  - Analytics, boost, studio IA (Claude), QR, shortlinks, content, funnel, campagnes, segments, acquisition, rétention, referral, advocacy, presse
- **Kit média** — packs téléchargeables pour Ambassadeurs et réseau personnel
- **Campagne Rays** — challenges, badges, gains
- **Vendre directement** `/pro/vendre` (10 sous-pages) — devis, widget, landing pages, lien paiement, notifications ventes

### Étape 6 — Réservations & groupes
- **Voyages en cours** `/pro/voyages` — vue cockpit/liste/calendrier
- **Voyage détail** `/pro/voyages/[id]` — 30+ sous-pages :
  - Réservations, groupes, rooming, hôtellerie, restauration, activités, transport, médias, marketing, finance voyage, bilan, remplissage
- **Messages Voyageurs** `/pro/messagerie`
- **Missions terrain** `/pro/voyages/[id]/terrain/*` — appel, contacts, incidents, sécurité, déclarations, fiche sécurité

### Étape 7 — Accompagnement (le jour J)
- **Cocktail de départ** — accueil Voyageurs au point de ramassage
- **Porte-à-porte** — présent du 1er au dernier km
- **Checklist opérationnelle** — `pdg-eventy/10-operations/GUIDE-PREMIER-VOYAGE.md` J-90 à J+7
- **Incidents / Urgences** — formulaire terrain, escalade Pôle Support, SOS GPS
- **Manifeste** — liste passagers, préférences, allergènes, régimes

### Étape 8 — Finance & rémunération
- **Revenus** `/pro/revenus` — config commissions, relevé de compte, simulation
- **Finance voyage** `/pro/finance` — KPIs, graphiques, détail par voyage, ClosePack
- **Paiements** `/pro/paiements` — stats, historique
- **Cotisations indépendant** — automatisation URSSAF
- **Payout** — Stripe Connect (en cours de câblage) → virement mensuel automatique
- **Finance clôture** `/pro/finance/cloture` — ClosePack post-retour (bilan définitif)

### Étape 9 — Fidélisation Créateur
- **Gamification** — XP, niveaux, badges
- **Formation continue** — nouvelles compétences, certifications
- **Réseau Créateurs** — annuaire, partage de tips
- **Passage Premium** (`isPremium=true`) — auto-validation devis, accès avancé
- **Proposition co-fondateur** (si excellence) — parts sociales d'un Pôle

---

## 3. 🤝 Ambassadeur — *S'inscrit, vend le catalogue, touche commission*

### Étape 1 — Inscription
- **`/ambassadeur/inscription`** (ou flow par invitation) — nom, adresse pro, type (tabac, coiffeur, CE, AE, association)
- **Validation Pôle Commercial** — contrôle SIRET + éventuelle rencontre
- **Signature convention Ambassadeur**

### Étape 2 — Découverte du portail
- **`/ambassadeur/dashboard`** — KPIs (ventes du mois, commissions à recevoir, classement), alertes, filtrage
- **`/ambassadeur/catalogue`** — liste des voyages Eventy à vendre, filtres par destination/saison/prix
- **Profil Ambassadeur** `/ambassadeur/profil` — coordonnées, RIB, photo

### Étape 3 — Outils de vente
- **`/ambassadeur/outils`** — générateur QR, liens trackés (`AMB-XXX`), templates WhatsApp/Email prêts
- **Partage catalogue** — chaque vente via lien Ambassadeur = commission automatique (cookie last-click-wins, 30 jours)
- **Kit média** — flyers imprimables, bannières numériques, visuels social

### Étape 4 — Ventes & commissions
- **Tracking** — chaque réservation via son code `AMB-XXX` est attribuée à l'Ambassadeur
- **`/ambassadeur/ventes`** — historique détaillé, statut (réservé / confirmé / voyagé)
- **`/ambassadeur/commissions`** — cumul, à payer, payé. Par défaut 5% du CA TTC.
- **Payout** — virement mensuel (via Stripe Connect) + facture automatique

### Étape 5 — Pilotage par Pôle Commercial
- **Relation** — interlocuteur dédié au Pôle Commercial
- **Challenges mensuels** — top vendeurs, primes bonus
- **Formation Ambassadeur** — sessions en ligne sur les nouveautés

### Étape 6 — Évolution
- **Montée en gamme** — si gros volumes → statut Ambassadeur Premium, commissions majorées
- **Réseau multi-points** — CE / association avec plusieurs sous-Ambassadeurs
- **Ambassadeur international** (Phase 2+) — multi-pays

---

## 4. 🏛️ Maison HRA — *S'inscrit, reçoit demandes, prépare, est payée*

### Étape 1 — Onboarding
- **Canal 1 — Invitation Créateur** : un Créateur a besoin d'une Maison pour son voyage → envoie invitation
- **Canal 2 — Inscription directe** : Maison s'inscrit via landing dédiée
- **Workflow statuts** : `INVITED → PENDING → UNDER_REVIEW → ACTIVE`
  - `INVITED` — invitation envoyée, en attente réponse
  - `PENDING` — Maison a accepté, doit compléter profil
  - `UNDER_REVIEW` — profil complet, Pôle Maisons valide
  - `ACTIVE` — Maison validée, reçoit les demandes

### Étape 2 — Configuration (queue admin)
- **Catégorie** — 1 des 8 (Hébergement, Restauration, Activités, Transport luxe, Image/Souvenirs, Décoration, Coordination VIP, Sécurité VIP)
- **Profil** — adresse, capacité, photos, certifications
- **Rate cards** — tarifs négociés par Pôle Maisons (remises volume, saisonnalité)
- **Calendrier disponibilités** — connection PMS (stub prêt, intégration Phase 1+)

### Étape 3 — Réception des demandes (portail Maisons)
- **`/maisons/hebergement`** (ou autre catégorie) — missions entrantes, KPIs, checklist, timeline
- **Pattern commun 9 pages** — redirect root → catégorie, chaque catégorie affiche : KPIs, missions, checklist, timeline, accepter/refuser
- **Notifications** — email + push mobile à chaque nouvelle demande

### Étape 4 — Acceptation & préparation
- **Accepter/refuser** — avec persistance API (partielle au 15/04, backend endpoints à finaliser)
- **Timeline J-X** — étapes préparation (confirmation chambres, menu validé, matériel livré)
- **Checklist opérationnelle** — par catégorie (ex : allergies pour restauration, accessibilité pour hébergement)
- **Rooming reçu** — depuis le Créateur pour la répartition des chambres

### Étape 5 — Jour J
- **Arrivée groupe** — reconnaissance Voyageurs Eventy (bracelets Phase 2)
- **Service** — exécution de la prestation
- **Feedback instantané** — Créateur valide la prestation sur place

### Étape 6 — Facturation & paiement
- **Facture Maison** — émise automatiquement depuis rate card + extras
- **Validation Créateur + Pôle Finance**
- **Paiement Eventy** — virement selon conditions négociées (J+30 par défaut)
- **Close Pack voyage** — reconciliation finale (Pôle Finance)

### Étape 7 — Relation long terme
- **Négociations HRA** `/admin/hra/negociations` — Pôle Maisons optimise tarifs selon volume
- **Rating Maison** — score qualité basé sur feedback Créateurs + Voyageurs
- **Exclusivités** — Maisons phares deviennent partenaires exclusifs (Phase 2)
- **Co-branding** — certaines Maisons ont leur page dédiée sur le site public

---

## 5. 🏢 Équipe Eventy — *14 Pôles*

L'équipe Eventy pilote la plateforme depuis `/equipe/*` (cockpits) et `/admin/*` (opérations).

### Architecture du portail Équipe
- **Layout commun** `PoleLayout` — dark HUD, couleur accent par Pôle
- **Components partagés** : `IAValidationQueue`, `KpiCard`, `CSSBarChart`, `VolumeWidget`
- **Data** — API `/equipe/{pole}` + fallback demo
- **Accès** — rôle `ADMIN` ou rôle Pôle-spécifique (RBAC 14 rôles)

### Les 14 Pôles & leurs responsabilités

#### 🎯 Direction
- **Cockpit** `/equipe` — meta-dashboard, vue consolidée tous Pôles
- **Responsable** : PDG (David)
- **KPIs** : CA total, marge, satisfaction Voyageur, NPS, nb voyages ON_GOING, burn rate
- **Missions** : stratégie, investisseurs, arbitrages inter-Pôles, Go/No-Go stratégiques
- **Outils dédiés** : `/admin/investisseur` (read-only dashboard investisseurs)

#### 💰 Finance
- **Cockpit** `/equipe/finance` (~512 lignes)
- **Admin** `/admin/finance/*` (21 sous-pages)
- **Missions** :
  - Comptabilité (intégration **Pennylane** — sync + exports FEC)
  - TVA marge (régime fiscal spécifique agence de voyages)
  - Payouts Créateurs (**Stripe Connect** Express)
  - Cotisations indépendants (auto URSSAF)
  - Cagnotte admin, allocation lots & prix
  - Réconciliation fournisseurs
  - Comptes bancaires, dashboard cash
  - ClosePack voyage (clôture financière post-retour)
- **Outils** : ledger, exports comptable, Stripe delays, HRA cascade, indie-cotisations, payout batch, supplier reconciliation

#### ✈️ Voyage
- **Cockpit** `/equipe/voyage` (~474 lignes)
- **Admin** `/admin/voyages/*` (17 sous-pages)
- **Missions** :
  - Lifecycle voyages (DRAFT → PHASE1 → PHASE2 → PUBLISHED → SALES_OPEN → ON_GOING → COMPLETED → CANCELLED)
  - Décisions **Go/No-Go** J-X (basé sur remplissage, météo, incidents)
  - Rooming (algo auto + manuel admin)
  - Feedback voyage (post-retour)
  - Santé voyage (remplissage temps réel)

#### 🚌 Transport
- **Cockpit** `/equipe/transport` (~470 lignes)
- **Admin** `/admin/transport/*` (12 sous-pages)
- **Missions** :
  - Flotte : bus (4 types), avions (charter + allotement), train, véhicules prestige
  - Routes, stops (arrêts de bus collective)
  - Loueurs : devis, horaires auto, validation, overrides
  - Route packs (charters, multi-bus)
  - Chauffeurs, manifests
  - **Règle business** : Créateurs proposent / demandent, Équipe Transport **valide et opère** (sauf Créateurs Premium avec `isPremium=true` qui auto-valident)

#### 💼 Commercial
- **Cockpit** `/equipe/commercial` (~515 lignes)
- **Admin** `/admin/ce-asso/*`, `/admin/pros/*`
- **Missions** :
  - Acquisition B2B (CE, associations, séminaires entreprise) — 15% remise
  - Acquisition Créateurs (pipeline, scripts commerciaux, 5 scripts templates)
  - Acquisition Ambassadeurs (tabacs, coiffeurs, AE)
  - Gestion contrats partenaires
  - CRM, suivi leads, devis B2B
  - URSSAF settings CE

#### 🧑‍💼 Talents
- **Cockpit** `/equipe/talents` (~318 lignes)
- **Admin** `/admin/utilisateurs`, `/admin/validation-pro`, `/admin/rbac`
- **Missions** :
  - Recrutement Créateurs (validation, onboarding)
  - Formation Créateurs (modules, certifications)
  - RH co-fondateurs & salariés
  - RBAC (14 rôles backend)
  - Gestion users/permissions

#### 📣 Marketing
- **Cockpit** `/equipe/marketing` (~320 lignes)
- **Admin** `/admin/marketing/*` (15 sous-pages)
- **Missions** :
  - Acquisition : SEO, ads, réseaux sociaux
  - Rétention : emailing, cookies fidélité
  - Referral : programme parrainage, K-factor
  - Content : blog, articles SEO, landing pages
  - Rays ☀️ : monnaie marketing, challenges, lots
  - Presse : dossier, press room, communiqués, contacts
  - Messagerie Pros (campagnes Créateurs)
  - Planner campagnes, advocacy, segments
  - Funnel, analytics

#### 🎧 Support
- **Cockpit** `/equipe/support` (~396 lignes)
- **Admin** `/admin/support`, `/admin/messagerie`, `/admin/communications`
- **Missions** :
  - Tickets Voyageurs (via formulaire contact, chat, email)
  - Support niveau 1 — assisté par Claude Sonnet 4.6
  - Support niveau 2 — humain
  - SOS terrain (voyages en cours) — escalade Pôle Sécurité + Pôle Voyage
  - Alertes & incidents

#### ⚖️ Juridique
- **Cockpit** `/equipe/juridique` (~405 lignes)
- **Admin** `/admin/legal/*`, `/admin/compliance`, `/admin/dsar`
- **Missions** :
  - CGV, mentions légales, politique cookies
  - Atout France (immatriculation, renouvellement)
  - RGPD : DSAR (demandes d'accès), retention, consent
  - Contrats Créateurs, Maisons, Ambassadeurs
  - Contrats Voyageurs (CGV, bon de commande)
  - Compliance globale

#### 🔒 Sécurité
- **Cockpit** `/equipe/securite` (~450 lignes)
- **Admin** `/admin/monitoring`, `/admin/incidents`
- **Missions** :
  - Sécurité données (authentification, chiffrement, audit logs)
  - Sécurité terrain (safety voyages, checklists, équipements)
  - Incidents (déclaration, suivi, résolution)
  - Audit sécurité (pentests, revues périodiques)
  - Monitoring prod (Sentry, Prometheus)

#### 🛠️ Tech
- **Cockpit** `/equipe/tech` (~424 lignes)
- **Admin** `/admin/monitoring`, `/admin/feature-flags`
- **Missions** :
  - Plateforme : ~296 500 lignes de code, 31 modules NestJS, 360 pages frontend
  - Infra Scaleway (backend) + Vercel (frontend)
  - CI/CD GitHub Actions (4 workflows)
  - Feature flags (avec break-glass, 4-eyes approval)
  - Monitoring Sentry
  - Health checks, cron jobs
  - DB migrations Prisma
  - API contracts (OpenAPI/Swagger)

#### 📊 Data
- **Cockpit** `/equipe/data` (~298 lignes)
- **Admin** `/admin/statistiques/*` (4 pages)
- **Missions** :
  - Analytics voyages (remplissage, conversion, churn)
  - BI Créateurs (top performers, LTV)
  - BI financière (CA prévisionnel, cohortes)
  - Dashboards investisseurs
  - Exports data
  - K-factor viral, tracking Ambassadeurs

#### ✨ Qualité
- **Cockpit** `/equipe/qualite` (~314 lignes)
- **Admin** `/admin/voyages/[id]/controle/*` (quality gate)
- **Missions** :
  - Validation **Phase 1** des voyages avant publication
  - Validation **Phase 2** avant SALES_OPEN
  - Relecture fiches voyage (auto-IA Claude + humain)
  - Audits qualité aléatoires
  - Scoring voyages (Quality Gate)
  - Conformité standards Eventy (âme, ton, promesse)

#### 🏛️ Maisons
- **Cockpit** `/equipe/maisons` (~498 lignes)
- **Admin** `/admin/hra/*`, `/admin/restauration`, `/admin/rooming`
- **Missions** :
  - Pilotage relation Maisons (8 catégories)
  - Négociations HRA (taux, volumes, exclusivités)
  - Rate cards (par Maison, saisonnalité)
  - Cascade tarifaire HRA → Créateur → Voyageur
  - Onboarding Maisons (INVITED → ACTIVE)
  - Rooming global (algo + manuel)
  - Restauration (menus, allergènes)

#### 🛒 Achats
- **Cockpit** `/equipe/achats` (~360 lignes)
- **Admin** `/admin/fournisseurs`, `/admin/transport/loueurs`
- **Missions** :
  - Fournisseurs transport (bus, avion) — hors Maisons
  - Matériel Eventy (cocktail départ, goodies, bracelets Phase 2)
  - Imprimerie (prospectus, flyers, cartes visite Créateurs)
  - Services externes (Pennylane, Stripe, Sentry, Mapbox)
  - Négociation contrats fournisseurs

---

## 6. 🔄 Interactions entre acteurs

```
                       ┌──────────────────┐
                       │  Voyageur        │
                       └────────┬─────────┘
                                │ réserve, paie
                                ▼
                       ┌──────────────────┐
       partage  ┌──────┤  Groupe (famille │◄── invite ──┐
        viral   │      │  /amis/CE/event) │             │
                ▼      └────────┬─────────┘             │
      Voyageurs                 │ réservations           │ vend
      supplémentaires           ▼                        │
                       ┌──────────────────┐        ┌─────┴──────┐
                       │  Voyage Eventy   │◄───────│Ambassadeur │
                       └────────┬─────────┘        └─────┬──────┘
                                │                        │ touche
                                │                        │ commission
              crée & accompagne │                        ▼
                                ▼                  ┌──────────────┐
                       ┌──────────────────┐        │ Pôle         │
                       │  Créateur        │        │ Commercial   │
                       └────────┬─────────┘        └──────────────┘
                                │ utilise
                  ┌─────────────┼─────────────┐
                  ▼             ▼             ▼
           ┌──────────┐  ┌──────────┐  ┌──────────┐
           │ Maison   │  │ Bus /    │  │ Activité │
           │ Hôtel    │  │ Charter  │  │ Guide    │
           └────┬─────┘  └────┬─────┘  └────┬─────┘
                │              │              │
                └──────────────┴──────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │  14 Pôles Eventy │
                       │  (Équipe)        │
                       └──────────────────┘
```

### Flux financier (simplifié)
```
Voyageur paie TTC ──► Stripe ──► Eventy (agence)
                                    │
                                    ├──► Pennylane (compta)
                                    ├──► Maisons (factures Maisons J+30)
                                    ├──► Loueurs transport (factures)
                                    ├──► Créateur (Stripe Connect payout mensuel)
                                    └──► Ambassadeur (Stripe Connect, commission)
                                                      ↑
                                              cookie last-click-wins 5%

TVA marge (régime spécifique agence de voyages) appliquée à la marge Eventy.
```

---

*Document maintenu par le Pôle Produit + IA PDG. À actualiser à chaque nouveau flux utilisateur ou nouvelle intégration.*
