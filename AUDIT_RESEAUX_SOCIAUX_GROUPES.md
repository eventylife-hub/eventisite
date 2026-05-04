# AUDIT — Réseaux Sociaux & Communication Groupes
## Côté Créateurs et Indépendants

> **Date** : 2026-05-04
> **Demandeur** : David (PDG Eventy)
> **Branche** : claude/fervent-mclean-1f79f8
> **Périmètre** : Frontend Next.js — portails `/pro/*` (Créateur) et `/independant/*` (Indépendant)
> **Contexte** : David a signalé un manque d'options sur les réseaux sociaux côté créateurs/indépendants. Cet audit recense l'existant et livre les ajouts (types, helpers, composants, pages).

---

## 1. État de l'existant — avant ce sprint

### 1.1 Côté Créateur (`/pro/*`)

| Page | Statut avant | Notes |
|------|-------------|------|
| `/pro/groupes` | ✅ Existante (1007 l.) | Tour de contrôle des groupes, KPI, drawer chat, templates messages |
| `/pro/groupes/[id]` | ✅ Existante (1046 l.) | Détail groupe : chat, membres, polls, docs, photos |
| `/pro/groupes/creer` | ✅ Existante (266 l.) | Création manuelle d'un groupe |
| `/pro/groupes/social` | ✅ Existante (562 l.) | Réseau social du Créateur (timeline, Tribus, badges) |
| `/pro/marketing/reseaux` | ✅ Existante | Hub Insta/TikTok/FB/X/WA/LinkedIn pour partage tracké (vendeur 5 %) |
| `/pro/marketing/calendrier` | ✅ Existante | Calendrier marketing existant (focus campagnes, pas posts groupes) |
| `/pro/marketing/templates` | ✅ Existante | Templates marketing |
| `/pro/marketing/partager` | ✅ Existante | Page partage générique |
| `/pro/messagerie` + `/pro/chat` | ✅ Existantes | Messagerie 1-to-1 |

**Composants existants pertinents** :
- `components/groups/group-card.tsx`, `member-list.tsx`, `invite-form.tsx`, `GroupPollWidget.tsx`, `QuickGroupModal.tsx`, `ShareCardVisual.tsx`, `SuggestGroupAfterFav.tsx`
- `components/share/ShareToolkit.tsx`, `ShareButton.tsx` — partage tracké multi-canal
- `lib/share/{generators.ts, tracking.ts}` — générateurs de contenu et UTM
- `lib/groups/constants.ts` — feature flags groupes

### 1.2 Côté Indépendant (`/independant/*`)

| Page | Statut avant |
|------|-------------|
| `/independant/groupes` | ❌ **MANQUANTE** |
| `/independant/groupes/[id]` | ❌ **MANQUANTE** |
| `/independant/groupes/[id]/jour-J` | ❌ **MANQUANTE** |
| `/independant/groupes/[id]/urgence` | ❌ **MANQUANTE** |
| `/independant/urgence` | ✅ Existante (mode urgence générique) |
| `/independant/tribus` | ✅ Existante |
| `/independant/chat` | ✅ Existante |
| `/independant/missions/[id]` | ✅ Existante |

**Constat** — l'indépendant n'avait **aucune vue centrée sur les groupes des occurrences qu'il opère**, ni de cockpit terrain Jour-J avec push voyageurs.

### 1.3 Feed / posts / modération

| Fonctionnalité | Avant ce sprint |
|----------------|----------------|
| Feed de posts dans un groupe (texte/photo/vidéo/poll/event) | ⚠️ Partiel — drawer chat oui, vrai feed unifié non |
| Composer multi-type avec preview multi-canal | ❌ Manquant |
| Modération créateur (signaler/masquer/supprimer/bannir) | ❌ Manquant |
| Connexion/statut comptes externes (OAuth) | ⚠️ Partage tracké présent, mais pas page dédiée comptes connectés |
| Calendrier éditorial publications cross-réseaux | ⚠️ Calendrier marketing oui, pas focus groupes |
| Filtre IA modération (spam, propos haineux) | ❌ Manquant |
| Mode urgence indé avec catégories + niveaux | ❌ Manquant (page générique seulement) |

---

## 2. Ce qui a été livré dans ce sprint (2026-05-04)

### 2.1 Types & helpers (lib/)

- ✅ `lib/groupes-voyage.ts` (504 l.) — Modèle de données complet :
  - `GroupeScope` : `TRAVEL` (communauté large) / `OCCURRENCE` (bus précis)
  - `GroupeStatus`, `GroupeVisibility`, `GroupeMemberRole`, `PostType`, `PostModerationStatus`, `TravelPhase`
  - `GroupeVoyage`, `GroupeMember`, `GroupePost`, `PostMedia`, `PostPoll`, `PostEvent`, `PostComment`, `PostReaction`, `SosAlert`
  - `POST_TEMPLATES` — 7 templates pré-rédigés Eventy par phase voyage (J-60 → J+30)
  - Helpers `filterGroupesForPro()`, `fillRate()`, `currentTravelPhase()`, `formatCount()`
- ✅ `lib/social-channels.ts` (343 l.) — Connexion + publication multi-canal :
  - `SOCIAL_CHANNELS` (8 canaux : Insta, TikTok, FB, X, LinkedIn, WA Business, YouTube, Pinterest)
  - `SocialAccountConnection`, `MultiChannelPublishRequest/Result`, `ScheduledPublication`
  - `adaptTextForChannel()` — adapte texte/hashtags par canal (limite chars X, etc.)
  - `validatePostForChannel()` — vérifie compatibilité (vidéo, sondage, carrousel)
  - `suggestBestTimeSlots()` — créneaux optimaux par canal (best practices)
  - `MOCK_CONNECTIONS` — état mock pour démo
- ✅ `lib/groupes-voyage-mock.ts` (293 l.) — données démo pour tests UI

### 2.2 Composants (components/social-groupes/)

| Composant | Lignes | Rôle |
|-----------|--------|------|
| `GroupeCard.tsx` | 222 | Carte premium (occurrence/voyage), variant light/dark |
| `PostFeed.tsx` | 419 | Feed avec posts texte/photo/poll/event/SOS, modération inline, badges crosspost |
| `PostComposer.tsx` | 510 | Composeur multi-type, preview multi-vues (Eventy + Insta/FB/WA…), templates suggérés |
| `SocialChannelsCard.tsx` | 215 | Carte connexion compte externe (status, followers, OAuth flow) |
| `PublicationCalendar.tsx` | 300 | Calendrier mois + détails jour, drag-friendly visuellement |
| `AnalyticsCard.tsx` | 130 | KPI premium avec sparkline, deltas verts/rouges |
| `index.ts` | 8 | Barrel d'export |

**Design system** : ivoire `#FAF6EE` / gold `#C9A55B` / terracotta `#C25E3A` / emerald `#1F7A57` / ink `#1B1F23`
**Typographie** : Playfair Display sur titres, Inter sur corps
**Animations** : Framer Motion (transitions douces, easings Apple-like `[0.22, 1, 0.36, 1]`)
**Glassmorphism** : `backdropFilter: blur(14px)` subtil, surfaces semi-transparentes

### 2.3 Pages Créateur (/pro/*)

| Page | Lignes | Description |
|------|--------|-------------|
| `/pro/groupes/[id]/moderation` | 269 | Vue modération avec filtres tabs (Tous / IA suspect / Signalés / Masqués / Supprimés), actions par post (masquer / supprimer / OK / bannir / escalader Eventy), explication filtre IA |
| `/pro/groupes/[id]/posts/nouveau` | 130 | Composeur de post complet pour le groupe, avec preview multi-vues + crosspost réseaux externes + programmation |
| `/pro/social/comptes-connectes` | 213 | Hub OAuth de tous les comptes externes (8 réseaux), KPI followers cumulés, info sécurité Scaleway/KMS |
| `/pro/social/calendrier-publication` | 216 | Calendrier éditorial mensuel + suggestions IA meilleurs créneaux par canal |

### 2.4 Pages Indépendant (/independant/*)

| Page | Lignes | Description |
|------|--------|-------------|
| `/independant/groupes` | 251 | Liste des occurrences opérées (filtres statut, recherche, KPI ambiance/voyageurs/in-progress), bouton SOS + lien rapide pilotage J0 |
| `/independant/groupes/[id]` | 192 | Détail groupe (vue light, focus terrain), composer light, lien direct J0/urgence |
| `/independant/groupes/[id]/jour-J` | 297 | Cockpit J0 mobile-first : 6 push voyageurs en 1 clic (matin, repas, retard, photo, quartier libre, briefing soir), capture photo/vidéo/story Insta, feed live, alerte SOS visible |
| `/independant/groupes/[id]/urgence` | 327 | Mode urgence 4 étapes (catégorie / niveau / description / scope), CTA appel Eventy 24/7, géo auto, animation pulseGlow |

---

## 3. Concept architectural validé

### 3.1 Deux niveaux de groupes

```
TRAVEL (communauté large)              OCCURRENCE (bus précis)
─────────────────────────              ─────────────────────────
"Andalousie" — toutes éditions         "Andalousie #3 — Avril 2026"
PUBLIC, ouvert                         PRIVATE, voyageurs payés
312 membres lifetime                   47 voyageurs
Pas de date départ                     Date + plaque bus + opérateur
                                       └─ Indépendant assigné
└─ enfants : occurrences               └─ parent : groupe travel
```

### 3.2 Permissions par rôle

| Rôle | Voit | Peut publier | Peut modérer | Peut SOS |
|------|------|-------------|-------------|---------|
| **CREATEUR** | Tous ses voyages (travel + occurrences) | Oui | Oui (suppr/bannir) | Indirect |
| **INDEPENDANT** | Occurrences qu'il opère | Oui | Limité (épingler) | **Oui (sa spécialité)** |
| **EQUIPE EVENTY** | Tout (modération centrale) | Annonces officielles | Oui (escalade) | Reçoit alertes |
| **LEADER (voyageur)** | Son groupe occurrence | Oui | Non | Non |
| **VIP** | Son groupe + accès anticipé | Oui | Non | Non |
| **MEMBER** | Son groupe occurrence | Oui | Signaler seulement | Non |

### 3.3 Phases voyage & templates

7 phases de parcours voyageur, chacune avec un template pré-rédigé Eventy au ton humain :

1. **J-60 Annonce** — ouverture des places ✈️
2. **J-30 Boost** — remplir le bus 🔥 (rappel : on part même non plein)
3. **J-14 Compte à rebours** — hype départ
4. **J-7 Last call** — équipement à prévoir ⏰
5. **J0 Départ** — meeting points, plaque bus 🚌
6. **JN Pendant** — photos terrain (indépendant) 📸
7. **J+1 Retour** — débrief
8. **J+7 Souvenirs** — album, demande d'avis 💛
9. **J+30 Fidélité** — promo réservée communauté 🎁

---

## 4. Manques / TODO Eventy backend

Marqués `// TODO Eventy:` dans le code pour suivi :

- ⚠️ **API Meta Graph** (Facebook + Instagram + WhatsApp Business) — OAuth + publication
- ⚠️ **API TikTok for Business** — OAuth + publication vidéos
- ⚠️ **API LinkedIn Marketing** — OAuth + publication B2B
- ⚠️ **API Twitter/X v2** — OAuth + publication
- ⚠️ **Chat temps réel** (Pusher / Socket.io / Ably) pour le drawer chat existant + commentaires de posts
- ⚠️ **Push notifications mobiles** (Firebase Cloud Messaging) pour annonces J0 + alertes SOS
- ⚠️ **Modération auto IA** (filtrage propos haineux / spam / liens malveillants) — actuellement mock
- ⚠️ **Analytics cross-réseaux unifiés** — agrégation impressions/likes/clics/conversions par post
- ⚠️ **Stockage chiffré tokens OAuth** — vault Scaleway / KMS

Les endpoints REST attendus (à créer côté NestJS backend) :
- `GET /pro/groupes?view=tour` — tour de contrôle
- `GET /pro/groupes/:id` — détail
- `POST /pro/groupes/:id/posts` — créer post (instantané ou programmé)
- `GET /pro/groupes/:id/posts` — feed
- `PATCH /pro/groupes/:id/posts/:postId/moderation` — actions modération
- `GET /pro/social/connections` — état comptes externes
- `POST /pro/social/connections/:channel/oauth-start` — initier OAuth
- `DELETE /pro/social/connections/:channel` — révoquer
- `POST /pro/social/publications` — programmer pub multi-canal
- `GET /pro/social/publications` — calendrier
- `GET /independant/groupes` — occurrences opérées
- `POST /independant/groupes/:id/sos` — alerte urgence

---

## 5. Roadmap suggérée

### Sprint 1 (à venir) — Backend OAuth
- Connexion Meta Graph (Insta + FB + WA Business — un seul flow OAuth)
- Module `social/oauth` côté NestJS, vault Scaleway, refresh tokens

### Sprint 2 — Push notifications
- Firebase Cloud Messaging — tokens device par voyageur
- Routing notif : `/groupes/:id/announcement` → tout le groupe
- Bouton SOS : push prioritaire + SMS fallback équipe Eventy

### Sprint 3 — Chat temps réel
- Pusher Channels (déjà présent côté frontend dans certaines fonctionnalités) ou Ably
- Présence (qui est en ligne dans le groupe)
- Typing indicators

### Sprint 4 — Modération IA
- Service Mistral / Claude pour scoring posts (spam, hate, harcèlement)
- Faux positifs &lt; 3 % avant rollout production

### Sprint 5 — Analytics cross-réseaux
- Worker hourly qui pull stats Meta Graph + TikTok + LinkedIn API
- Dashboard `/pro/social/analytics` avec ROI par post
- Liaison commission vendeur (tracking UTM existant)

---

## 6. Fichiers livrés — récap

```
frontend/
├── lib/
│   ├── groupes-voyage.ts          [NEW · 504 l.]
│   ├── groupes-voyage-mock.ts     [NEW · 293 l.]
│   └── social-channels.ts         [NEW · 343 l.]
├── components/
│   └── social-groupes/
│       ├── GroupeCard.tsx          [NEW · 222 l.]
│       ├── PostFeed.tsx            [NEW · 419 l.]
│       ├── PostComposer.tsx        [NEW · 510 l.]
│       ├── SocialChannelsCard.tsx  [NEW · 215 l.]
│       ├── PublicationCalendar.tsx [NEW · 300 l.]
│       ├── AnalyticsCard.tsx       [NEW · 130 l.]
│       └── index.ts                [NEW · 8 l.]
└── app/
    ├── (pro)/pro/
    │   ├── groupes/[id]/
    │   │   ├── moderation/page.tsx              [NEW · 269 l.]
    │   │   └── posts/nouveau/page.tsx           [NEW · 130 l.]
    │   └── social/
    │       ├── comptes-connectes/page.tsx       [NEW · 213 l.]
    │       └── calendrier-publication/page.tsx  [NEW · 216 l.]
    └── (independant)/independant/
        └── groupes/
            ├── page.tsx                          [NEW · 251 l.]
            └── [id]/
                ├── page.tsx                      [NEW · 192 l.]
                ├── jour-J/page.tsx               [NEW · 297 l.]
                └── urgence/page.tsx              [NEW · 327 l.]
```

**Total : ~5 040 lignes ajoutées, 0 fichier supprimé.**

---

## 7. Tonalité Eventy respectée

Chaque copy a été passée au crible de l'AME-EVENTY.md :

- ✅ Tutoiement quand c'est naturel
- ✅ « On » plutôt que « nous »
- ✅ Promesse Pack Sérénité incluse, transparence prix
- ✅ Indépendants = partenaires, pas exécutants
- ✅ « On part même si pas plein » mentionné dans templates
- ✅ Couleurs chaudes (terracotta + gold) sur boutons primaires
- ✅ Photos cinématographiques imaginées, glassmorphism subtil, jamais flashy
- ✅ Aucun jargon corporate

---

*Audit livré 2026-05-04 — Claude assistant PDG.*
