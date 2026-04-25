# TODO — Réseau Social Gaming Eventy
> Vision long terme (post-MVP) — Document investisseurs
> Créé le 2026-04-25

---

## 1. VISION GLOBALE

Le réseau social Eventy est la couche communautaire qui lie le gaming, les voyages et les sponsors. Les clients suivent les marques pour débloquer des héros, les marques suivent les joueurs pour cibler leurs offres, et tout le monde partage ses victoires de raid et ses voyages. C'est le LinkedIn du voyage de groupe gamifié.

**Différence fondamentale** : Sur Eventy Social, les sponsors ne font pas de pub — ils jouent. Leur héros dans le jeu EST leur présence sociale.

---

## 2. PAGES & MAQUETTES TEXTUELLES

### 2.1 Page Feed Principal — `/social`

```
╔══════════════════════════════════════════════════════════╗
║  🌍 EVENTY SOCIAL                                        ║
║  [Feed] [Explorer] [Notifications 3] [Mon Profil]        ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  📢 À LA UNE                                             ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ 🏆 BOSS VAINCU — "El Rey del Sur" est tombé !       │ ║
║  │ 1 247 joueurs ont participé. Loot distribué.        │ ║
║  │ 🎉 Marie_L a gagné UN VOYAGE SÉVILLE (1200€) !     │ ║
║  │ [Voir le raid] [Féliciter Marie]                    │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  ─────────────────────────────────────────────────────── ║
║                                                          ║
║  👤 Thomas_M vient de rejoindre ton groupe "Barcelone 26"║
║  ──────────────────────────────────────────────────────  ║
║                                                          ║
║  🦸 NIKE a lancé un nouvel événement sponsor !           ║
║  "Le Sprint" sera disponible dans le Raid Égypte (01/12) ║
║  → 234 joueurs ont liké                                  ║
║  → [J'aime] [Commenter] [Partager]                       ║
║                                                          ║
║  ─────────────────────────────────────────────────────── ║
║                                                          ║
║  📸 Sofia_R a partagé : "J'y suis allée pour de vrai !"  ║
║  [Photo : Alhambra de Granada avec groupe de voyage]     ║
║  "On a vaincu El Rey del Sur en juin... et en septembre  ║
║   j'ai VRAIMENT vécu l'Andalousie avec Eventy. Incroyable"║
║  → 89 ❤️  → 23 💬  → 12 🔁                              ║
╚══════════════════════════════════════════════════════════╝
```

### 2.2 Profil Joueur — `/social/profil/[userId]`

```
╔══════════════════════════════════════════════════════════╗
║  👤 SOFIA RODRIGUEZ — Voyageuse Level 18                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌──────────┐  Sofia Rodriguez                           ║
║  │  [PHOTO] │  @sofia_r  |  📍 Lyon, France              ║
║  │          │  "Jouer + voyager = vivre"                 ║
║  └──────────┘  [SUIVRE] [MESSAGE]                        ║
║                                                          ║
║  📊 STATS                                                ║
║  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          ║
║  │ 892  │ │ 234  │ │  12  │ │  4   │ │ 45k  │          ║
║  │Abonnés│ │Abonnements│ │Voyages│ │Raids │ │ Énergie│  ║
║  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          ║
║                                                          ║
║  🏆 HAUTS FAITS (12 sur 87)                              ║
║  [⚔️ Pourfendeur] [🌟 Légende Andalousie] [🌍 Explorateur]║
║  [🎯 Invocateur] [🎃 Chasseur Saisonnier] ...             ║
║                                                          ║
║  🦸 HÉROS DÉBLOQUÉS                                      ║
║  [Nike ✅] [Decathlon ✅] [AXA ✅] [Airbnb 🔒]           ║
║                                                          ║
║  📸 PUBLICATIONS                    [GRID] [LIST]        ║
║  ┌──────┐ ┌──────┐ ┌──────┐                             ║
║  │Photo │ │Raid  │ │Loot  │                             ║
║  │Séville│ │win  │ │chest │                             ║
║  └──────┘ └──────┘ └──────┘                             ║
╚══════════════════════════════════════════════════════════╝
```

### 2.3 Profil Sponsor — `/social/sponsor/[sponsorId]`

```
╔══════════════════════════════════════════════════════════╗
║  🏢 NIKE — Pack Gold Eventy                              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌──────────┐  Nike                                      ║
║  │  [LOGO   │  @nike_eventy  |  Sponsor Gold ⭐           ║
║  │   NIKE]  │  "Just Do It — et gagne ton voyage !"      ║
║  └──────────┘  [SUIVRE (+5⚡)] [12 450 abonnés]          ║
║                                                          ║
║  🦸 MON HÉROS : LE SPRINT                                ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  [ILLUSTRATION HÉROS NIKE]                          │ ║
║  │  12 450 invocations ce mois  |  Taux victoire : 73% │ ║
║  │  Capacité : "Just Win It" — x1.8 dégâts 30s         │ ║
║  │  [Débloquer le héros — Suivre Nike]                 │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  📢 ACTUALITÉS NIKE                                      ║
║  • "Le Sprint rejoint le Raid Égypte ce mois !" (il y a 2j)║
║  • "Nouveau colorway disponible dans le loot pool !" (1sem)║
║  • "Nike sponsorise l'événement Halloween 2026 !" (2sem) ║
║                                                          ║
║  🏆 CLASSEMENT HÉROS NIKE                                ║
║  Top invocateurs ce mois :                               ║
║  🥇 Thomas_M — 145 invocations                          ║
║  🥈 Karim_B  — 132 invocations                          ║
║  🥉 Marie_L  — 98 invocations                           ║
╚══════════════════════════════════════════════════════════╝
```

### 2.4 Page Explorer / Découverte — `/social/explorer`

```
╔══════════════════════════════════════════════════════════╗
║  🔍 EXPLORER EVENTY SOCIAL                               ║
║  [Joueurs] [Sponsors] [Groupes de voyage] [Événements]   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🔥 TENDANCES AUJOURD'HUI                                ║
║  #RaidAndalousie  #BossVaincu  #NikeHero  #SevilleIRL    ║
║                                                          ║
║  🦸 HÉROS LES PLUS INVOQUÉS CE MOIS                      ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐                 ║
║  │🥇 NIKE   │ │🥈 DECATH │ │🥉 AIRFR  │                 ║
║  │Le Sprint │ │L'Alpiniste│ │L'Ailier  │                 ║
║  │12 450 ×  │ │ 9 230 ×  │ │ 7 120 ×  │                 ║
║  └──────────┘ └──────────┘ └──────────┘                 ║
║                                                          ║
║  📸 POSTS POPULAIRES (voyages réels + gaming)            ║
║  [Photo Alhambra par sofia_r — 89 ❤️]                    ║
║  [Vidéo boss vaincu par karim_b — 234 👀]                ║
║  [Loot chest ouverture par thomas_m — 145 ❤️]            ║
║                                                          ║
║  🎯 PROFILS SUGGÉRÉS (selon tes centres d'intérêt)       ║
║  [marie_l] [Groupe Barcelone] [DECATHLON] [david_v]      ║
╚══════════════════════════════════════════════════════════╝
```

### 2.5 Notifications — `/social/notifications`

```
╔══════════════════════════════════════════════════════════╗
║  🔔 NOTIFICATIONS                                        ║
║  [Toutes] [Gaming] [Social] [Sponsors] [Voyages]         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🆕 IL Y A 5 MIN                                         ║
║  ⚔️ RAID — El Toro Dorado à 30% HP ! Phase finale proche ║
║  [Rejoindre maintenant]                                  ║
║                                                          ║
║  🆕 IL Y A 1H                                            ║
║  🦸 NIKE a publié un post : "Nouvelle quête disponible !" ║
║  [Voir le post]                                          ║
║                                                          ║
║  HIER                                                    ║
║  👤 Thomas_M vous suit maintenant                        ║
║  🏆 Vous avez débloqué "Pourfendeur d'Andalousie" !      ║
║  💬 Sofia_R a commenté votre post de raid                ║
║  ⚡ +500 énergie reçue (redistribution sponsor Nike)     ║
║                                                          ║
║  CETTE SEMAINE                                           ║
║  🎃 Halloween Raid s'ouvre dans 12 jours — [S'inscrire]  ║
║  🎁 Vous avez reçu un loot "Réduction -20%" (raid Séville)║
╚══════════════════════════════════════════════════════════╝
```

---

## 3. COMPOSANTS FRONTEND NÉCESSAIRES

```
app/(client)/social/
├── page.tsx                        — Feed principal
├── explorer/page.tsx               — Découverte
├── notifications/page.tsx          — Centre notifications
└── profil/[userId]/page.tsx        — Profil joueur

app/(public)/social/sponsor/
└── [sponsorId]/page.tsx            — Profil sponsor public

components/social/
├── SocialFeed.tsx                  — Feed avec infinite scroll
├── FeedPost.tsx                    — Post (texte, photo, gaming event)
├── GamingEventPost.tsx             — Post spécial "boss vaincu", "loot reçu"
├── SponsorPost.tsx                 — Post sponsor (avec tag "Sponsorisé")
├── UserProfileCard.tsx             — Carte profil résumée
├── SponsorProfileCard.tsx          — Carte profil sponsor résumée
├── FollowButton.tsx                — Bouton suivre/ne plus suivre
├── HeroLeaderboard.tsx             — Classement héros invoqués
├── TrendingTags.tsx                — Tags tendances
├── NotificationCenter.tsx          — Centre de notifications
├── NotificationItem.tsx            — Item notification (types)
├── SocialStats.tsx                 — Stats profil (abonnés, etc.)
├── AchievementShowcase.tsx         — Hauts faits affichés sur profil
├── PostComposer.tsx                — Créer un post
└── ShareRaidResult.tsx             — Partage résultat raid
```

---

## 4. FLUX UTILISATEUR — SUIVRE UN SPONSOR ET DÉBLOQUER UN HÉROS

```
1. Client voit post Nike dans le feed : "Nouveau héros disponible !"
2. Clique sur profil Nike → voit "Le Sprint" hero card
3. Bouton [SUIVRE NIKE (+5⚡)] → suit automatiquement
4. Héros débloqué → notification + animation
5. 5 ⚡ points énergie crédités instantanément
6. Héros disponible lors du prochain raid
7. Nike reçoit : +1 abonné + analytics (source: feed)
8. Client voit Nike dans son "Following" + héros dans son arsenal
```

---

## 5. FLUX SPONSOR — PUBLIER ET ENGAGER

```
1. Sponsor accède au dashboard pro
2. Crée un post dans "Publications sponsorisées" :
   - Post texte : actualité héros, événement à venir
   - Post image : visuel héros mis à jour, campagne
   - Post événement : "Le Sprint rejoint le Raid Égypte !"
3. Post modéré automatiquement (filtre mots + images Eventy)
4. Publication dans le feed tous abonnés Nike sur Eventy
5. Push notification aux abonnés Nike
6. Stats : impressions, likes, clics, nouveaux abonnés générés
7. Tableau de bord : meilleurs posts, heure optimale de publication
```

---

## 6. CLASSEMENTS HÉROS

### 6.1 Classement Global Mensuel
```
Top héros les plus invoqués — Mai 2026
🥇 Le Sprint (Nike)      — 12 450 invocations
🥈 L'Alpiniste (Decathlon)— 9 230 invocations
🥉 L'Ailier (Air France)  — 7 120 invocations
4. Le Gardien (AXA)       — 5 890 invocations
5. L'Hôtelier (Accor)     — 4 230 invocations
```

### 6.2 Classement par Monde
```
Monde : Les Cimes d'Andalousie
🥇 Le Sprint (Nike)         — 4 120 invocations / efficacité 87%
🥈 L'Alpiniste (Decathlon)  — 3 450 invocations / efficacité 79%
```

---

## 7. ARCHITECTURE DONNÉES

### Modèles Prisma

```prisma
model SocialPost {
  id              String      @id @default(cuid())
  authorUserId    String?
  authorSponsorId String?
  authorUser      User?       @relation(fields: [authorUserId], references: [id])
  authorSponsor   Sponsor?    @relation(fields: [authorSponsorId], references: [id])
  type            PostType
  content         String      @db.Text
  mediaUrls       String[]
  linkedRaidId    String?
  linkedWorldId   String?
  linkedHeroId    String?
  isSponsored     Boolean     @default(false)
  isModerated     Boolean     @default(false)
  likes           PostLike[]
  comments        PostComment[]
  shares          Int         @default(0)
  createdAt       DateTime    @default(now())
}

model PostLike {
  id        String      @id @default(cuid())
  postId    String
  userId    String
  post      SocialPost  @relation(fields: [postId], references: [id])
  user      User        @relation(fields: [userId], references: [id])
  createdAt DateTime    @default(now())
  @@unique([postId, userId])
}

model PostComment {
  id        String      @id @default(cuid())
  postId    String
  userId    String
  content   String
  post      SocialPost  @relation(fields: [postId], references: [id])
  user      User        @relation(fields: [userId], references: [id])
  createdAt DateTime    @default(now())
}

model UserFollow {
  id              String    @id @default(cuid())
  followerId      String
  followingUserId String?
  followingSponsorId String?
  follower        User      @relation("UserFollowers", fields: [followerId], references: [id])
  followingUser   User?     @relation("UserFollowings", fields: [followingUserId], references: [id])
  followingSponsor Sponsor? @relation(fields: [followingSponsorId], references: [id])
  createdAt       DateTime  @default(now())
  @@unique([followerId, followingUserId])
  @@unique([followerId, followingSponsorId])
}

model SocialNotification {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id])
  type        NotificationType
  title       String
  body        String
  actionUrl   String?
  isRead      Boolean             @default(false)
  relatedPostId   String?
  relatedRaidId   String?
  relatedHeroId   String?
  createdAt   DateTime            @default(now())
}

enum PostType        { TEXT PHOTO VIDEO RAID_EVENT LOOT_DROP ACHIEVEMENT TRAVEL_PHOTO }
enum NotificationType { RAID_PHASE NEW_BOSS BOSS_DEAD LOOT_WON FOLLOWER COMMENT LIKE HERO_UNLOCK SPONSOR_EVENT ENERGY_GIFT }
```

---

## 8. API BACKEND NÉCESSAIRE

```
# Feed
GET  /social/feed                         — Feed personnalisé (abonnements)
GET  /social/explore                      — Feed exploration (populaire)
GET  /social/trending/tags                — Tags tendances

# Posts
POST /social/posts                        — Créer un post
GET  /social/posts/:id                    — Détail post
POST /social/posts/:id/like               — Liker
DELETE /social/posts/:id/like             — Unliker
POST /social/posts/:id/comment            — Commenter
GET  /social/posts/:id/comments           — Commentaires

# Profils
GET  /social/users/:id                    — Profil joueur
GET  /social/sponsors/:id                 — Profil sponsor
POST /social/follow/user/:id              — Suivre un joueur
POST /social/follow/sponsor/:id           — Suivre un sponsor (+énergie)
DELETE /social/follow/user/:id            — Ne plus suivre
DELETE /social/follow/sponsor/:id         — Ne plus suivre sponsor

# Classements
GET  /social/leaderboard/heroes           — Classement héros invoqués
GET  /social/leaderboard/heroes/world/:id — Classement héros par monde

# Notifications
GET  /social/notifications                — Mes notifications
PUT  /social/notifications/read-all       — Marquer tout lu
PUT  /social/notifications/:id/read       — Marquer lu
```

---

## 9. SYSTÈME DE NOTIFICATIONS PUSH

```typescript
// Événements déclenchant une notification push
const PUSH_TRIGGERS = {
  RAID_PHASE_CHANGE: "Phase suivante débloquée dans le raid !",
  BOSS_10_PERCENT:   "El Rey del Sur à 10% HP — MAINTENANT !",
  BOSS_DEAD:         "Boss vaincu ! Ton loot t'attend.",
  LOOT_WON:          "Tu as gagné : [item] dans le raid !",
  NEW_FOLLOWER:      "[pseudo] te suit maintenant",
  SPONSOR_EVENT:     "[Marque] : [titre événement]",
  HERO_AVAILABLE:    "Le héros [nom] est disponible dans ce raid",
  SEASONAL_RAID:     "Raid Halloween commence dans 24h !",
  ENERGY_GIFT:       "[Marque] t'offre [X] points d'énergie !",
};
```

---

## 10. PRIORITÉ & ESTIMATION

- **Priorité** : Post-MVP — Phase 3
- **Complexité** : Élevée (feed temps réel, modération, push)
- **Prérequis** : Raids actifs, sponsors actifs, profils clients
- **Estimation équipe** : 5-7 semaines full-stack
- **Impact** : Fort — viralité organique, acquisition gratuite

---

## 11. CONNEXIONS AVEC AUTRES SYSTÈMES

- `TODO-GAMING-RAIDS-BOSS.md` — Events raids publiés automatiquement dans le feed
- `TODO-GAMING-SPONSORS-HEROS.md` — Suivre sponsor = débloquer héros
- `TODO-GAMING-MONDES.md` — Progression monde partageable sur social
- `TODO-GAMING-FIDÉLISATION.md` — Partage social = acquisition organique
