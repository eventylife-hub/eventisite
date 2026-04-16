# Refonte Client — Groupes, Social, Amis (avril 2026)

> Branche: `claude/laughing-brattain` · Date: 2026-04-16
> Briefing PDG David — "Occuper le Voyageur + Vendre via les Créateurs + Activer le réseau"

---

## 🎯 Objectifs stratégiques

Trois objectifs (AME-EVENTY) :

1. **Occuper le Voyageur entre 2 voyages** — rétention
2. **Vendre plus de voyages** — créer un groupe en 1 clic, embarquer ses proches
3. **Valoriser les Créateurs (indépendants)** — animateurs du réseau, créateurs de contenu

---

## 📄 Pages refondues

### 1. `/client/social` — Communauté Eventy
Le **Netflix+Instagram du voyage**. Le Voyageur y vit entre 2 voyages.

- **Stories 24h** (Créateurs + amis) en carrousel haut de page
- **Fil d'actualité** 4 onglets : Pour toi · Amis · Créateurs · Éventy
- **20 posts** mockés avec textes, photos, location, likes/comments/shares
- **Engagement** : like, commentaire, partage, bookmark, ajout wishlist
- **Défi hebdo** (gamification_groups_enabled) → badge + Rays
- **CTA vente embarqués** dans chaque post : "Réserver ce voyage", "Créer groupe", "Suivre ce Créateur"
- **Destinations trending** en grille

### 2. `/client/groupes` — Mes groupes
Le tableau de bord de la **vie en groupe**.

- **Hero warm** + bandeau démo quand API indispo
- **4 parcours de création** mis en avant :
  1. *Depuis un voyage publié* (`?mode=travel`) — le plus rapide
  2. *À partir d'une envie* (`?mode=wish`) — "Partir au Maroc en mai"
  3. *Via une Tribu existante* (`?mode=tribu&tribuId=…`) — 1 clic
  4. *Groupe spontané* (`?mode=spontaneous`) — on fixe le voyage après
- **3 onglets** : Mes groupes · Invitations (badge compteur) · Découvrir (public_groups_discovery)
- **Tribus shortcut** (3 premières) + lien vers `/client/amis?tab=tribus`
- **"Tes amis partent aussi"** — suggestion vente par réseau

### 3. `/client/amis` — Mon réseau
Gestion complète du réseau social Voyageur.

- **Hero warm** avec résumé amis/Tribus
- **Panel d'invitation multi-canal** : WhatsApp · SMS · Email · lien copiable
- **4 onglets** : Mes amis · Mes Tribus · Invitations · Suggestions IA
- **FriendCard** : avatar, ville, compatibilité %, voyages en commun, badge "Vérifié" (co-voyageur 5★), bouton message rapide
- **TribuCard** : couleur unique, membres, voyages ensemble, prochain voyage planifié, CTA "Partir ensemble" (active la Tribu sur nouveau voyage)
- **SuggestionCard** (IA) : amis d'amis, raison de la reco, score compatibilité, intérêts communs, badge vérifié
- **Recherche utilisateurs** live via `/client/friends/search`

---

## 🎨 Direction artistique — Sub-theme "warm"

Créé `frontend/styles/warm-theme.css` — cohabite avec le HUD dark existant via la classe racine `.warm-root`.

### Palette
| Token | Valeur | Usage |
|---|---|---|
| `--warm-cream` | #FAF7F2 | Surface primaire (warm-card) |
| `--warm-sand` | #EADBC7 | Surface secondaire (warm-card-sand) |
| `--warm-terra` | #C75B39 | Accent primaire (boutons, badges) |
| `--warm-gold` | #D4A853 | Accent secondaire (badges, avatars) |
| `--warm-ink` | #2A1F17 | Texte primaire (WCAG AA sur cream) |
| `--warm-ink-soft` | #5C4A3D | Texte secondaire |

### Composants CSS
- `warm-card` / `warm-card-hero` / `warm-card-sand` / `warm-feed-card`
- `warm-btn-primary` / `warm-btn-gold` / `warm-btn-ghost`
- `warm-badge` + variantes `-terra` / `-gold` / `-creator` / `-live`
- `warm-input` / `warm-tab` / `warm-tab-active`
- `warm-progress` / `warm-avatar-ring` / `warm-crossnav`
- `warm-animate-in` / `warm-stagger` (animations subtiles)

Accessibilité : contrastes vérifiés WCAG AA. Focus ring dédié en terra.

---

## 🧭 Navigation transversale

`frontend/components/client/WarmCrossNav.tsx` — 6 items :
`Voyages · Communauté · Groupes · Amis · Messages · Profil`

Sticky en haut des 3 pages refondues, active state via `usePathname`.

---

## 🚩 Feature flags (défaut ON en démo)

Étendus dans `frontend/lib/hooks/use-feature-flags.ts` :

| Flag | Rôle |
|---|---|
| `social_feed_enabled` | Affichage du fil social |
| `creator_posts_enabled` | Posts Créateurs + CTAs vente |
| `gamification_groups_enabled` | Défi hebdo + Rays |
| `tribus_enabled` | Onglet Tribus + raccourcis |
| `public_groups_discovery` | Onglet Découvrir (groupes publics) |
| `friend_recommendations_ai` | Onglet Suggestions IA |
| `group_chat_enabled` | Chat intra-groupe |
| `sales_from_social_enabled` | CTAs vente embarqués |

Le portail admin `/admin/groupes/controles` peut les éteindre — tous sont `true` par défaut pour la démo.

---

## 📦 Données mockées (`frontend/lib/demo-data/`)

### `social-feed.ts` (~430 lignes)
- `DEMO_FEED_POSTS` — 20 posts (Sarah Dumont Créatrice Maroc, Alexandre Petit Méditerranée, Maya Benali, Théo Mercier, amis, éditorial Eventy)
- `DEMO_FEED_STORIES` / `DEMO_FEED_REGULAR`
- Types : `FeedPost`, `FeedMedia`, `FeedCTA`, `FeedCTAType`, `FeedAuthorRole`
- CTAs : `book_travel`, `create_group`, `join_group`, `follow_creator`, `add_to_wishlist`, `vote`

### `tribus.ts` (~240 lignes)
- `DEMO_TRIBUS` (5) : Aventuriers du Soleil · Gourmets Voyageurs · Famille Dupont · Team Office · EVJF Amélie
- `DEMO_FRIEND_RECOMMENDATIONS` (4) avec `compatibilityScore`, `verifiedCoTraveler`, `commonInterests`
- `DEMO_FRIENDS_TRAVELING` (2) : amis partant à Marrakech/Rome avec places restantes
- `DEMO_PUBLIC_GROUPS` (4) avec `matchScore`, `vibe`

---

## 💰 Intégration vente

Les CTAs vente sont **embarqués dans le contenu** (pas des bannières à part) :

- Post Créateur "Médina de Marrakech" → CTA `book_travel` vers `/voyages/marrakech-express`
- Post ami "On part à Barcelone" → CTA `create_group` vers `/client/groupes/creer?travelId=…`
- Post Créateur "Sarah est en live" → CTA `follow_creator` vers sa page
- "Tes amis partent aussi" (page Groupes) → lien direct vers voyage avec places restantes
- Tribu active → bouton "Partir ensemble" lance création groupe préconfiguré

**Objectif** : chaque scroll doit pouvoir déclencher un achat en 2 clics.

---

## 🧪 Fichiers modifiés

### Créés
- `frontend/styles/warm-theme.css`
- `frontend/components/client/WarmCrossNav.tsx`
- `frontend/lib/demo-data/social-feed.ts`
- `frontend/lib/demo-data/tribus.ts`
- `docs/refonte-client-groupes-social-amis-2026-04.md` (ce fichier)

### Refondus (réécriture complète)
- `frontend/app/(client)/client/social/page.tsx`
- `frontend/app/(client)/client/groupes/page.tsx`
- `frontend/app/(client)/client/amis/page.tsx`

### Modifiés
- `frontend/lib/demo-data/index.ts` — exports social-feed + tribus
- `frontend/lib/hooks/use-feature-flags.ts` — 8 nouveaux flags

---

## 🔜 Prochaines étapes suggérées

1. **Brancher l'API réelle** — endpoints `/client/friends/*`, `/client/groups/*`, `/client/social/feed`, `/client/tribus/*`
2. **Modèle Prisma `Tribu`** — groupe permanent distinct d'un `TravelGroup`
3. **Admin settings** — exposer les 8 feature flags dans `/admin/groupes/controles`
4. **Créer les routes** : `/client/amis/tribus/[id]`, `/client/amis/tribus/nouvelle`
5. **Notifications push/email** : "Léa a publié", "Ta Tribu Gourmets t'attend sur Lisbonne"
6. **Analytics** : tracker les conversions groupe → voyage par source (post, story, tribu, suggestion)

---

**Auteur** : Refonte pilotée par David (PDG Eventy) · Exécution IA · 2026-04-16
