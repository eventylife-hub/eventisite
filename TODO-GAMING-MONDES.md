# TODO — Système de Mondes Eventy
> Vision long terme (post-MVP) — Document investisseurs
> Créé le 2026-04-25

---

## 1. VISION GLOBALE

Les Mondes sont l'architecture narrative et géographique de l'univers gaming Eventy. Chaque monde correspond à une destination de voyage réelle, avec un thème, une histoire, des raids et des activités préparatoires. La progression entre mondes crée une aspiration à voyager : pour "débloquer" un monde, le joueur est incité à s'y rendre — ou à rêver de le faire.

**Principe fondateur** : Jouer à Eventy, c'est déjà vivre le voyage avant de partir.

---

## 2. CATALOGUE DES MONDES (Vision)

| # | Monde | Destination | Thème | Boss Final |
|---|-------|------------|-------|------------|
| 1 | Les Cimes d'Andalousie | Séville / Granada | Soleil, flamenco, taureaux | El Rey del Sur |
| 2 | Les Sables du Pharaon | Égypte / Marrakech | Mystères anciens | Le Pharaon Éternel |
| 3 | L'Empire du Samouraï | Japon / Kyoto | Honneur et cerisiers | Le Samouraï des Dieux |
| 4 | La Crypte des Vikings | Islande / Norwège | Glace, aurores, mythes | Le Seigneur des Glaces |
| 5 | La Forêt des Esprits | Thaïlande / Bali | Jungle, temples | Le Grand Esprit |
| 6 | Le Carnaval Dorado | Brésil / Rio | Samba, couleurs, fête | O Rei do Carnaval |
| 7 | La Route de la Soie | Turquie / Ouzbékistan | Épices, caravanes | Khan des Mille Sables |
| 8 | Monde Ouvert (futur) | Monde entier | MMO — fusion tous mondes | BOSS ULTIME |

---

## 3. PAGES & MAQUETTES TEXTUELLES

### 3.1 Page Carte des Mondes — `/jeux/mondes`

```
╔══════════════════════════════════════════════════════════╗
║  🌍 CARTE DES MONDES EVENTY                              ║
║  Explore, conquiers, voyage !                            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ╔═══════════════════════════════════════════════════╗   ║
║  ║  [CARTE MONDE INTERACTIVE — illustration stylisée]║   ║
║  ║                                                   ║   ║
║  ║  🌟 Andalousie (toi : Niveau 12)                  ║   ║
║  ║  📍 Égypte (débloqué — Niveau 0)                  ║   ║
║  ║  🔒 Japon (verrouillé — complète Égypte d'abord) ║   ║
║  ║  🔒 Islande (verrouillée)                         ║   ║
║  ║  🌀 Monde Ouvert (légende — FUTUR)                ║   ║
║  ╚═══════════════════════════════════════════════════╝   ║
║                                                          ║
║  TON PROGRESSION                                         ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        ║
║  │ 🌟 Andalous │ │ 📍 Égypte   │ │ 🔒 Japon    │        ║
║  │ Niveau 12   │ │ Non commencé│ │ Verrouillé  │        ║
║  │ ████████░░  │ │ ░░░░░░░░░░ │ │ 🔒 Complète │        ║
║  │ 4/5 boss    │ │             │ │ Égypte D'ABORD│      ║
║  │ [CONTINUER] │ │ [COMMENCER] │ │ [VOIR]      │        ║
║  └─────────────┘ └─────────────┘ └─────────────┘        ║
╚══════════════════════════════════════════════════════════╝
```

### 3.2 Page Monde Détail — `/jeux/mondes/[worldSlug]`

```
╔══════════════════════════════════════════════════════════╗
║  🌟 LES CIMES D'ANDALOUSIE                               ║
║  Niveau recommandé : 5+ | Participants : 8 450 joueurs   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ╔═════════════════════════════════════════════════╗     ║
║  ║  [ILLUSTRATION SÉVILLE — Giralda, coucher soleil]║     ║
║  ║  "Au pays du soleil et du flamenco, seuls les   ║     ║
║  ║  plus courageux survivront à El Rey del Sur..."  ║     ║
║  ╚═════════════════════════════════════════════════╝     ║
║                                                          ║
║  📖 HISTOIRE DU MONDE                                    ║
║  "Les Cimes d'Andalousie cachent un ancien trésor...     ║
║   Trois gardiens protègent le chemin vers El Rey del Sur,║
║   le roi mythique qui n'a jamais été vaincu."            ║
║                                                          ║
║  🗺️ PROGRESSION DANS CE MONDE                           ║
║  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────┐  ║
║  │Gardien   │ → │L'Ombre   │ → │El Diablo │ → │🔥    │  ║
║  │Alpujarras│   │de Grenade│   │de Málaga │   │EL REY│  ║
║  │✅ Vaincu │   │✅ Vaincu │   │⏳ En cours│  │🔒    │  ║
║  └──────────┘   └──────────┘   └──────────┘   └──────┘  ║
║                                                          ║
║  🎯 ACTIVITÉS PRÉPARATOIRES                              ║
║  ✅ Quiz Culture Andalousie (10/10) → +200 ⚡ bonus raid ║
║  ✅ Découverte virtuelle Alhambra → +héros débloqqué    ║
║  ⬜ Défi Flamenco (mini-game rythmique) → +slot héros    ║
║  ⬜ Route des Tapas (quiz gastronomie) → +réduction 5%  ║
║                                                          ║
║  🏆 HAUTS FAITS DE CE MONDE                              ║
║  ✅ Premier Pas — Participer à 1 raid Andalousie         ║
║  ✅ Explorateur — Compléter toutes les activités         ║
║  ⬜ Conquistador — Vaincre tous les boss                 ║
║  ⬜ Légende — Vaincre El Rey del Sur                     ║
║                                                          ║
║  ✈️ LE VRAI VOYAGE                                       ║
║  "Tu as exploré l'Andalousie en jeu. Vis-le pour de vrai!"║
║  [🌍 Voir les voyages Séville/Granada sur Eventy →]     ║
╚══════════════════════════════════════════════════════════╝
```

### 3.3 Page Monde Ouvert — `/jeux/monde-ouvert` (FUTUR MMO)

```
╔══════════════════════════════════════════════════════════╗
║  🌀 MONDE OUVERT — COMING SOON                           ║
║  La fusion de tous les mondes en une expérience unique   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ╔═════════════════════════════════════════════════╗     ║
║  ║                                                 ║     ║
║  ║     🌍  LE GRAND VOYAGE COMMENCE               ║     ║
║  ║                                                 ║     ║
║  ║   Imagine : tous les mondes connectés,          ║     ║
║  ║   des milliers de joueurs, un seul BOSS ULTIME, ║     ║
║  ║   un voyage de groupe offert comme Grand Prix.  ║     ║
║  ║                                                 ║     ║
║  ╚═════════════════════════════════════════════════╝     ║
║                                                          ║
║  CE QUI ARRIVE                                           ║
║  🔮 Libre exploration entre tous les mondes              ║
║  🔮 Rencontres avec d'autres joueurs (social temps réel) ║
║  🔮 Quêtes permanentes + événements mondiaux             ║
║  🔮 Guildes de voyageurs                                 ║
║  🔮 Boss Ultime — 1 GRAND VOYAGE OFFERT pour le vainqueur║
║                                                          ║
║  ⏳ DISPONIBLE QUAND ?                                   ║
║  "Quand 100 000 voyageurs auront rejoint Eventy."        ║
║  Compteur actuel : 8 450 / 100 000                      ║
║  [Barre de progression]                                  ║
║  [Partager pour accélérer 🚀]                            ║
╚══════════════════════════════════════════════════════════╝
```

### 3.4 Page Activité Préparatoire — `/jeux/mondes/[worldSlug]/activites/[activityId]`

```
╔══════════════════════════════════════════════════════════╗
║  🎯 QUIZ CULTURE ANDALOUSIE                              ║
║  Monde : Les Cimes d'Andalousie | Durée : ~5 min         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Question 3/10                                           ║
║  ────────────────────────────────────────────────────    ║
║  Dans quelle ville se trouve la célèbre Alhambra ?       ║
║                                                          ║
║  🅐  Séville                                             ║
║  🅑  Grenade                                             ║
║  🅒  Córdoba                                             ║
║  🅓  Málaga                                              ║
║                                                          ║
║  ────────────────────────────────────────────────────    ║
║  [Répondre]                                              ║
║                                                          ║
║  🎁 Récompense si 10/10 : +200 ⚡ bonus pour les raids  ║
║     de ce monde + badge "Expert Andalousie"              ║
╚══════════════════════════════════════════════════════════╝
```

---

## 4. COMPOSANTS FRONTEND NÉCESSAIRES

```
app/(jeux)/mondes/
├── page.tsx                        — Carte des mondes interactive
├── [worldSlug]/
│   ├── page.tsx                    — Détail monde (histoire, boss, activités)
│   ├── activites/
│   │   ├── page.tsx                — Liste activités préparatoires
│   │   └── [activityId]/page.tsx   — Activité spécifique (quiz, mini-game)
│   └── hauts-faits/page.tsx        — Hauts faits du monde
└── monde-ouvert/page.tsx           — Teaser MMO futur

components/gaming/mondes/
├── WorldMap.tsx                    — Carte monde interactive (SVG/Canvas)
├── WorldCard.tsx                   — Carte monde (locked/active/completed)
├── WorldProgressBar.tsx            — Barre progression dans un monde
├── BossSequenceTimeline.tsx        — Timeline des boss (1→2→3→Final)
├── WorldLore.tsx                   — Récit/histoire du monde
├── WorldActivities.tsx             — Liste activités préparatoires
├── ActivityCard.tsx                — Carte activité (quiz, mini-game)
├── WorldAchievements.tsx           — Hauts faits du monde
├── TravelCTA.tsx                   — CTA "Fais le vrai voyage"
├── OpenWorldTeaser.tsx             — Teaser monde ouvert + compteur
└── WorldUnlockAnimation.tsx        — Animation déblocage nouveau monde
```

---

## 5. FLUX UTILISATEUR — PROGRESSION DANS LES MONDES

```
1. Client crée son compte Eventy
2. Monde #1 "Andalousie" débloqué par défaut
3. Activités préparatoires :
   - Quiz culture → +200 points bonus raid
   - Visite virtuelle → déblocage héros bonus
4. Premier raid lancé → boss phase 1 actif
5. Après victoire phase 1 → phase 2 débloquée
6. Après victoire boss final → Haut Fait "Légende d'Andalousie"
7. Monde #2 "Égypte" débloqué → notification push
8. CTA apparu sur profil : "Tu as conquis l'Andalousie en jeu.
   Maintenant vis-le pour de vrai — voir les voyages Séville"
9. Boucle recommence pour Égypte
```

---

## 6. FLUX SPONSOR — BRANDING D'UN MONDE

```
Pack Platinum uniquement — "Monde Brandé"
1. Sponsor signe Pack Platinum (2990€/mois)
2. Sélectionne un monde disponible (ou propose un thème)
3. Eventy configure :
   - Logo sponsor sur la carte du monde
   - Héros sponsor = boss sponsorisé (design co-brandé)
   - Bannière "En partenariat avec [Marque]" dans le monde
   - Événement saisonnier exclusif dans ce monde
4. Dashboard sponsor : stats du monde (visiteurs, raids, engagement)
5. Contrat minimum 3 mois pour un monde
```

---

## 7. ARCHITECTURE DONNÉES

### Modèles Prisma

```prisma
model World {
  id              String          @id @default(cuid())
  slug            String          @unique
  name            String
  destination     String
  theme           String
  lore            String          @db.Text
  illustrationUrl String?
  mapPosition     Json            // {x, y} sur la carte
  order           Int             @unique
  isUnlocked      Boolean         @default(false)
  prerequisiteWorldId String?
  prerequisiteWorld   World?      @relation("WorldPrereqs", fields: [prerequisiteWorldId], references: [id])
  nextWorlds      World[]         @relation("WorldPrereqs")
  raidInstances   RaidInstance[]
  activities      WorldActivity[]
  achievements    WorldAchievement[]
  sponsorWorldId  String?         // Platinum sponsor
  createdAt       DateTime        @default(now())
}

model UserWorldProgress {
  id              String    @id @default(cuid())
  userId          String
  worldId         String
  user            User      @relation(fields: [userId], references: [id])
  world           World     @relation(fields: [worldId], references: [id])
  level           Int       @default(0)
  bossesDefeated  Int       @default(0)
  activitiesDone  Int       @default(0)
  isCompleted     Boolean   @default(false)
  unlockedAt      DateTime  @default(now())
  completedAt     DateTime?
  @@unique([userId, worldId])
}

model WorldActivity {
  id              String          @id @default(cuid())
  worldId         String
  world           World           @relation(fields: [worldId], references: [id])
  name            String
  type            ActivityType
  description     String
  rewardEnergy    Int             @default(0)
  rewardBadgeKey  String?
  rewardDiscount  Int?
  durationMinutes Int             @default(5)
  order           Int
  completions     ActivityCompletion[]
}

model ActivityCompletion {
  id              String          @id @default(cuid())
  activityId      String
  userId          String
  activity        WorldActivity   @relation(fields: [activityId], references: [id])
  user            User            @relation(fields: [userId], references: [id])
  score           Int?
  completedAt     DateTime        @default(now())
  @@unique([activityId, userId])
}

model WorldAchievement {
  id              String    @id @default(cuid())
  worldId         String
  world           World     @relation(fields: [worldId], references: [id])
  key             String    @unique
  name            String
  description     String
  iconUrl         String
  condition       Json      // { type: "BOSS_COUNT", value: 4 }
}

enum ActivityType { QUIZ MINI_GAME VIRTUAL_TOUR VIDEO CHALLENGE }
```

---

## 8. API BACKEND NÉCESSAIRE

```
GET  /worlds                              — Tous les mondes (avec progression user)
GET  /worlds/:slug                        — Détail monde
GET  /worlds/:slug/activities             — Activités du monde
GET  /worlds/:slug/activities/:id         — Détail activité
POST /worlds/:slug/activities/:id/start   — Démarrer activité
POST /worlds/:slug/activities/:id/complete — Soumettre résultat activité
GET  /worlds/:slug/achievements           — Hauts faits du monde
GET  /worlds/me/progress                  — Ma progression tous mondes
GET  /worlds/open-world/status            — Compteur monde ouvert
```

---

## 9. MONDE OUVERT — VISION TECHNIQUE LONG TERME

```
Phase 1 (actuelle) : Mondes isolés avec raids instance
Phase 2 : Connexions entre mondes (quêtes cross-monde)
Phase 3 : Monde Ouvert MMO léger :
  - Lobby temps réel (WebSocket / Partykit)
  - Avatars personnalisés sur la carte monde
  - Guildes de voyageurs (5-20 personnes)
  - Quêtes permanentes + événements mondiaux live
  - Boss Ultime trimestriel (1 voyage de groupe offert)
  - Marketplace : échange items entre joueurs

Stack technique envisagée Phase 3 :
  - WebSocket via Partykit ou Socket.io clusters
  - State management distribué
  - Canvas/WebGL pour carte interactive (Pixi.js ou Babylon.js)
  - CDN pour assets monde (images haute résolution)
```

---

## 10. PRIORITÉ & ESTIMATION

- **Priorité** : Post-MVP — Phase 2 (mondes basiques) + Phase 4 (monde ouvert)
- **Complexité** : Moyenne (Phase 2) / Très élevée (Monde Ouvert)
- **Prérequis Phase 2** : Raids actifs, système énergie
- **Prérequis Phase 4** : 50 000+ utilisateurs, infra scalable, équipe dédiée
- **Estimation Phase 2** : 3-4 semaines full-stack
- **Impact** : Très fort narratif — "Joue l'Espagne, puis pars en Espagne"

---

## 11. CONNEXIONS AVEC AUTRES SYSTÈMES

- `TODO-GAMING-RAIDS-BOSS.md` — Raids appartiennent à des mondes
- `TODO-GAMING-SPONSORS-HEROS.md` — Pack Platinum = monde brandé
- `TODO-GAMING-SOCIAL.md` — Partage progression monde sur réseau social
- `TODO-GAMING-FIDÉLISATION.md` — Compléter un monde → CTA vrai voyage
