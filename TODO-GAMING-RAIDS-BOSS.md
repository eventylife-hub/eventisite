# TODO — Système de Raids & Boss Eventy
> Vision long terme (post-MVP) — Document investisseurs
> Créé le 2026-04-25

---

## 1. VISION GLOBALE

Le système de Raids est le cœur de l'engagement gaming d'Eventy. Les clients se rassemblent pour vaincre collectivement des Boss dans des Instances thématiques liées aux voyages. Chaque victoire génère du loot aléatoire à forte valeur (réductions voyages, nuits offertes, upgrades, cadeaux sponsors).

---

## 1.1 MÉCANIQUES CORE — MIS À JOUR 2026-04-25

### Difficulté croissante = sponsors obligatoires
- **Normal** : 0 héros sponsor requis
- **Héroïque** : 1 héros sponsor minimum
- **Mythique** : 3 héros sponsors minimum
- **Légendaire** : 5 héros sponsors, héros rares requis
Plus le boss est puissant, plus il faut invoquer de héros sponsors. C'est la mécanique centrale de monétisation.

### Double rôle sponsor (CLEF ÉCONOMIQUE)
- Chaque sponsor a UN HÉROS (allié) ET UN BOSS (ennemi)
- Le même pack sponsor finance les deux présences dans le jeu
- Le héros aide les joueurs dans les raids des AUTRES sponsors
- Le boss de ce sponsor doit être vaincu par les joueurs — avec les héros des AUTRES sponsors

### Règle anti-auto-invocation (RÈGLE FONDAMENTALE)
- Un héros NE PEUT PAS combattre le boss de son propre sponsor
- Pour vaincre le boss Nike → invoquer Decathlon, AXA, Air France — pas Le Sprint
- Cette règle FORCE les joueurs à suivre PLUSIEURS sponsors, pas un seul
- Résultat : chaque sponsor génère de l'engagement pour les autres → réseau mutuel

### Boss Level proportionnel au pack sponsor
- Pack Bronze (99€/mois) → Boss Facile (Niv. 10–20) → Loot : Commun + Rare
- Pack Silver (299€/mois) → Boss Moyen (Niv. 30–50) → Loot : Rare + Épique
- Pack Gold (990€/mois) → Boss Difficile (Niv. 60–80) → Loot : Épique + Légendaire
- Pack Platinum (2990€/mois) → Boss Légendaire (Niv. 90–100) → Loot : Légendaire Exclusif
Un boss difficile = plus de joueurs nécessaires = plus de visibilité sponsor = incitation à upgrader le pack.

---

## 1.2 WORLD BOSS — BOSS PERSISTANT COMMUNAUTAIRE

### Vision
Pour les voyages premium et lointains (valeur élevée), le boss est un **World Boss** persistant. Il ne meurt pas en un seul raid — il reste actif sur **plusieurs jours ou semaines**. Des centaines de joueurs contribuent à descendre sa barre de vie, chacun à leur tour.

### Mécaniques World Boss
- Barre de vie gigantesque (ex: 500 000 000 HP) — visible en temps réel par TOUS
- Chaque joueur dépense son énergie pour attaquer : chaque coup coûte X énergie
- Plus le coup est fort (énergie dépensée), plus les dégâts sont grands
- Tous les joueurs ayant attaqué au moins une fois sont **participants au loot**
- Classement en direct des plus gros contributeurs (HP infligés)

### Explosion finale
- Quand la barre de vie atteint 0 → ANIMATION EXPLOSION ÉPIQUE
- Pluie de cartes d'énergie qui tombent sur l'écran (animation spectaculaire)
- Distribution ALÉATOIRE pondérée par les dégâts totaux infligés
- **Cartes d'énergie** : Petite (100⚡), Moyenne (500⚡), Grosse (2000⚡), **JACKPOT** (voyage offert ou -50%)
- Notification push à TOUS les participants : "Le World Boss est mort ! Tes récompenses t'attendent..."

### World Boss vs Raid Standard
| Critère | Raid Standard | World Boss |
|---------|-------------|------------|
| Durée | 2–7 jours | 2–6 semaines |
| Joueurs | 100–5 000 | 10 000–100 000 |
| Loot | Bon | Légendaire exclusif |
| Boss HP | Millions | Centaines de millions |
| Sponsors requis | 1–5 | 8–15 |
| Déclencheur | Automatique | Événement spécial |

### Page World Boss — `/jeux/world-boss`
Maquette :
```
╔══════════════════════════════════════════════════════════╗
║  💥 WORLD BOSS — LE TITAN DU DÉSERT                      ║
║  Actif depuis 5 jours · Reste 21 jours                   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  HP : ██████████████████░░░░░░░░░░ 64% restant           ║
║  320 000 000 / 500 000 000 HP                            ║
║  34 230 joueurs ont attaqué                              ║
║                                                          ║
║  MON COUP                                                ║
║  [⚡ 20 → dégâts : 200] [⚡ 100 → dégâts : 1 500]       ║
║  [⚡ 500 → dégâts : 10 000] [⚡ MAX → DÉGÂTS CRITIQUES]  ║
║                                                          ║
║  🎁 LOOT POOL WORLD BOSS                                 ║
║  JACKPOT : x2 Voyage Marrakech (1800€)                  ║
║  x50 Grosses cartes énergie (2000⚡)                     ║
║  x500 Cartes moyennes (500⚡)                            ║
║  x5 000 Petites cartes (100⚡)                           ║
║                                                          ║
║  🏆 TOP CONTRIBUTORS                                     ║
║  #1 SkyWalker_94 — 2 450 000 HP infligés                ║
║  #2 NomadeElite — 1 890 000 HP infligés                 ║
║  #234 Toi — 45 230 HP infligés                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## 2. PAGES & MAQUETTES TEXTUELLES

### 2.1 Page Hub Raids — `/jeux/raids`

```
╔══════════════════════════════════════════════════════════╗
║  ⚔️  RAIDS EVENTY — Monde : Les Cimes d'Andalousie       ║
║  [Boss actif] [Calendrier raids] [Mes hauts faits]       ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🔥 RAID EN COURS — Se termine dans 2j 14h               ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  BOSS : El Toro Dorado  ████████░░░░ 67% HP restant │ ║
║  │  Participants : 1 247 voyageurs actifs               │ ║
║  │  Loot pool : 3 voyages Séville offerts + 200 cadeaux │ ║
║  │  [ REJOINDRE LE RAID → ]                            │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  📅 PROCHAINS RAIDS                                      ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     ║
║  │ 🎃 Halloween │ │ ❄️ Noël      │ │ 🌸 Printemps │     ║
║  │ 31 Oct       │ │ 24 Déc       │ │ 20 Mars      │     ║
║  │ Monde: Crypt │ │ Monde: Laponie│ │ Monde: Sakura│     ║
║  │ [S'inscrire] │ │ [S'inscrire] │ │ [S'inscrire] │     ║
║  └──────────────┘ └──────────────┘ └──────────────┘     ║
║                                                          ║
║  🏆 MES HAUTS FAITS                                      ║
║  [Vainqueur El Toro ✓] [Raid de Noël ✗] [Boss Final ✗]  ║
╚══════════════════════════════════════════════════════════╝
```

### 2.2 Page Instance de Raid — `/jeux/raids/[instanceId]`

```
╔══════════════════════════════════════════════════════════╗
║  🌍 MONDE : LES CIMES D'ANDALOUSIE                       ║
║  Instance #42 — Difficulté : Légendaire                  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  PHASE 1/3 — Gardien des Alpujarras         [ACTIF]      ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  🐉 BOSS HP: ████████████████░░░░ 80%               │ ║
║  │  Attaque spéciale dans : 4h 32min                   │ ║
║  │                                                     │ ║
║  │  [ ATTAQUER ] [ INVOQUER HÉROS ] [ MINI-GAME ]      │ ║
║  │                                                     │ ║
║  │  Mes dégâts : 2 450 pts  |  Rang : #234 / 1247      │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  PHASES DU RAID                                          ║
║  [1. Gardien ✅ 80%] → [2. L'Ombre ⏳] → [3. Boss Final 🔒]║
║                                                          ║
║  👥 TOP COMBATTANTS                                      ║
║  🥇 Martin_V   45 230 pts  🗡️ Invocateur (Nike Hero)    ║
║  🥈 Sofia_R    38 100 pts  🗡️ Guerrière                 ║
║  🥉 Karim_B    31 500 pts  🗡️ Mage (Decathlon Hero)     ║
║                                                          ║
║  💬 CHAT RAID  [Écrire un message...]                    ║
╚══════════════════════════════════════════════════════════╝
```

### 2.3 Page Boss Final — `/jeux/raids/[instanceId]/boss-final`

```
╔══════════════════════════════════════════════════════════╗
║  ⚡ BOSS FINAL — EL REY DEL SUR                          ║
║  Monde : Les Cimes d'Andalousie | Instance #42           ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ╔═══════════════════════════════════════════════════╗   ║
║  ║  [ANIMATION BOSS — design unique par monde]       ║   ║
║  ║  HP: ██████████████████████░░ 92%                 ║   ║
║  ║  RAGE MODE dans : 1h 12min                        ║   ║
║  ╚═══════════════════════════════════════════════════╝   ║
║                                                          ║
║  🎯 MÉCANIQUES BOSS FINAL                                ║
║  • Phase 1 (100-60% HP) : Attaques normales              ║
║  • Phase 2 (60-30% HP)  : Invocations de monstres        ║
║  • Phase 3 (30-0% HP)   : RAGE — mini-game obligatoire   ║
║                                                          ║
║  ⚡ MINI-GAME ACTIVÉ — Déchiffre le code de voyage!      ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  🇪🇸  S _ V _ L _ E   (7 lettres)                  │ ║
║  │  [A][B][C][D][E][F][G][H][I][J]                    │ ║
║  │  Lettres restantes : 3/5  |  Temps : 45s            │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  🎁 LOOT POOL SI VICTOIRE                                ║
║  🏆 x3  Voyage Séville 7j offert (valeur 1 200€)        ║
║  🎟️ x50 Réduction -30% sur tout séjour                  ║
║  💎 x20 Pack Sérénité Premium offert                     ║
║  🎁 x15 Cadeau Adidas (sponsor Gold)                     ║
║                                                          ║
║  [ 💥 ATTAQUE FINALE ] [ 🦸 INVOQUER HÉROS ULTIME ]     ║
╚══════════════════════════════════════════════════════════╝
```

### 2.4 Page Loot Distribution — `/jeux/raids/[instanceId]/loot`

```
╔══════════════════════════════════════════════════════════╗
║  🎉 BOSS VAINCU ! — El Rey del Sur est tombé !           ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🎊 DISTRIBUTION DES GAINS EN COURS...                   ║
║                                                          ║
║  TU AS REÇU :                                            ║
║  ╔═══════════════════════════════════════════════════╗   ║
║  ║                                                   ║   ║
║  ║   ✨ FÉLICITATIONS !                              ║   ║
║  ║                                                   ║   ║
║  ║   🎟️ BON DE RÉDUCTION -20% sur ton prochain       ║   ║
║  ║      voyage Eventy (valeur 180€)                  ║   ║
║  ║                                                   ║   ║
║  ║   + 500 ⚡ POINTS D'ÉNERGIE                       ║   ║
║  ║   + 🏆 HAUT FAIT : "Pourfendeur d'Andalousie"    ║   ║
║  ║                                                   ║   ║
║  ║   [ VOIR MON BUTIN ] [ RELANCER UN RAID ]         ║   ║
║  ╚═══════════════════════════════════════════════════╝   ║
║                                                          ║
║  GAGNANTS DU GRAND LOOT (tirage random)                  ║
║  🥇 Marie_L   → VOYAGE SÉVILLE OFFERT ! (1 200€)        ║
║  🥈 Thomas_M  → VOYAGE SÉVILLE OFFERT ! (1 200€)        ║
║  🥉 Fatima_K  → VOYAGE SÉVILLE OFFERT ! (1 200€)        ║
║                                                          ║
║  📊 TES STATS DU RAID                                    ║
║  Dégâts infligés : 12 450 pts | Rang final : #87/1247   ║
║  Héros invoqués : 3 | Mini-games gagnés : 2/3            ║
╚══════════════════════════════════════════════════════════╝
```

### 2.5 Page Hauts Faits — `/jeux/hauts-faits`

```
╔══════════════════════════════════════════════════════════╗
║  🏆 MES HAUTS FAITS                                      ║
║  Complétés : 12/87  |  Points prestige : 2 450           ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  RAIDS & BOSS                                            ║
║  ✅ Premier Sang        — Participer à 1 raid           ║
║  ✅ Pourfendeur          — Vaincre un boss de raid       ║
║  ✅ Invocateur           — Invoquer 5 héros en combat    ║
║  ⬜ Légende d'Andalousie — Compléter le Monde #1         ║
║  ⬜ Maître de Raid       — Vaincre 10 boss               ║
║  ⬜ Chasseur Saisonnier  — Compléter 1 raid saisonnier   ║
║                                                          ║
║  ÉVÉNEMENTS SAISONNIERS                                  ║
║  ⬜ 🎃 Nuit des Citrouilles — Raid Halloween 2026        ║
║  ⬜ ❄️ Père des Glaces      — Raid Noël 2026             ║
║  ⬜ 🌸 Éveil du Printemps   — Raid Printemps 2027        ║
║                                                          ║
║  BOSS FINAUX                                             ║
║  ✅ El Rey del Sur       — Boss Final Andalousie ⚔️       ║
║  ⬜ Le Pharaon           — Boss Final Égypte 🔒           ║
║  ⬜ Le Samouraï Éternel  — Boss Final Japon 🔒            ║
╚══════════════════════════════════════════════════════════╝
```

---

## 3. COMPOSANTS FRONTEND NÉCESSAIRES

### Composants Raid
```
app/(jeux)/raids/
├── page.tsx                        — Hub raids (liste instances actives)
├── [instanceId]/
│   ├── page.tsx                    — Vue instance avec phases
│   ├── boss-final/page.tsx         — Vue boss final (mécaniques spéciales)
│   ├── loot/page.tsx               — Distribution loot post-victoire
│   └── mini-game/[type]/page.tsx   — Mini-games embarqués
├── calendrier/page.tsx             — Calendrier raids saisonniers
└── hauts-faits/page.tsx            — Achievements personnels

components/gaming/raids/
├── BossHealthBar.tsx               — Barre HP animée avec effets
├── RaidProgressPhases.tsx          — Timeline phases (1→2→3→Boss Final)
├── RaidLeaderboard.tsx             — Classement temps réel
├── LootChest.tsx                   — Animation ouverture coffre (wow factor)
├── LootItemCard.tsx                — Carte item looted (rareté, valeur)
├── RaidChat.tsx                    — Chat temps réel du raid
├── BossAttackWarning.tsx           — Alerte "attaque spéciale imminente"
├── MiniGameWrapper.tsx             — Container mini-game générique
├── HautFaitBadge.tsx               — Badge achievement stylisé
├── SeasonalEventBanner.tsx         — Bannière événement saisonnier
└── RaidCountdown.tsx               — Compte à rebours fin de raid
```

### Mini-Games Types
```
components/gaming/mini-games/
├── WordGuesser.tsx                 — Devine le mot (pays, villes)
├── QuizGeography.tsx              — Quiz géographique (capitales, etc.)
├── MemoryCards.tsx                 — Jeu de mémoire (monuments)
├── TapSequence.tsx                 — Séquence de taps rythmés
├── PuzzleAssembly.tsx              — Puzzle photo destination
└── SpeedTyping.tsx                 — Frappe rapide (codes)
```

---

## 4. FLUX UTILISATEUR — PARTICIPER À UN RAID

```
1. Client voit notification "Raid en cours — El Toro Dorado attaqué !"
2. Ouvre /jeux/raids → voit boss HP à 67%
3. Clique "Rejoindre le Raid"
4. Choisit son action :
   a. ATTAQUER → consomme Énergie → inflige dégâts → monte classement
   b. INVOQUER HÉROS → choisit sponsor héros → bonus dégâts x2
   c. MINI-GAME → joue quiz/puzzle → bonus dégâts + points énergie
5. Notifications push à chaque phase franchie
6. Boss vaincu → animation loot chest → tirage random → récompense
7. Haut fait débloqué → badge sur profil
8. Invitation raid suivant
```

---

## 5. FLUX SPONSOR — CRÉER UN HÉROS DE RAID

```
1. Sponsor ouvre dashboard sponsor
2. Sélectionne "Créer mon Héros de Raid" (Pack Silver+)
3. Configure le héros :
   - Nom du héros (ex: "Le Champion Adidas")
   - Upload assets visuels (avatar héros, effets spéciaux)
   - Stats : Puissance, Vitesse, Charisme (3 curseurs)
   - Capacité spéciale (ex: "Sprint +50% dégâts 30s")
   - Message d'invocation (ex: "Le Champion vous rejoint !")
4. Valide → héros disponible dans tous les raids actifs
5. Stats dashboard : nb invocations / jour, vues, engagement
6. Renouvellement automatique mensuel
```

---

## 6. ARCHITECTURE DONNÉES

### Modèles Prisma

```prisma
model RaidInstance {
  id              String          @id @default(cuid())
  worldId         String
  world           World           @relation(fields: [worldId], references: [id])
  name            String
  status          RaidStatus      @default(UPCOMING)
  difficulty      RaidDifficulty  @default(NORMAL)
  startsAt        DateTime
  endsAt          DateTime
  phases          RaidPhase[]
  participants    RaidParticipant[]
  lootPool        LootItem[]
  seasonalEvent   String?
  createdAt       DateTime        @default(now())
}

model RaidPhase {
  id              String        @id @default(cuid())
  raidInstanceId  String
  raidInstance    RaidInstance  @relation(fields: [raidInstanceId], references: [id])
  order           Int
  name            String
  bossName        String
  isFinalBoss     Boolean       @default(false)
  maxHP           Int
  currentHP       Int
  sponsorId       String?
  miniGameType    String?
  status          PhaseStatus   @default(LOCKED)
}

model RaidParticipant {
  id              String        @id @default(cuid())
  raidInstanceId  String
  userId          String
  raidInstance    RaidInstance  @relation(fields: [raidInstanceId], references: [id])
  user            User          @relation(fields: [userId], references: [id])
  damageDealt     Int           @default(0)
  heroesInvoked   Int           @default(0)
  miniGamesWon    Int           @default(0)
  joinedAt        DateTime      @default(now())
  loot            LootDrop[]
}

model LootItem {
  id              String        @id @default(cuid())
  raidInstanceId  String
  raidInstance    RaidInstance  @relation(fields: [raidInstanceId], references: [id])
  type            LootType
  label           String
  value           Int
  quantity        Int
  rarity          LootRarity    @default(COMMON)
  sponsorId       String?
  drops           LootDrop[]
}

model LootDrop {
  id              String          @id @default(cuid())
  participantId   String
  lootItemId      String
  participant     RaidParticipant @relation(fields: [participantId], references: [id])
  lootItem        LootItem        @relation(fields: [lootItemId], references: [id])
  droppedAt       DateTime        @default(now())
}

model Achievement {
  id              String            @id @default(cuid())
  key             String            @unique
  name            String
  description     String
  iconUrl         String
  category        AchievementCategory
  userAchievements UserAchievement[]
}

model UserAchievement {
  id              String      @id @default(cuid())
  userId          String
  achievementId   String
  user            User        @relation(fields: [userId], references: [id])
  achievement     Achievement @relation(fields: [achievementId], references: [id])
  unlockedAt      DateTime    @default(now())
}

enum RaidStatus     { UPCOMING ACTIVE BOSS_FINAL COMPLETED EXPIRED }
enum RaidDifficulty { NORMAL HARD LEGENDARY }
enum PhaseStatus    { LOCKED ACTIVE COMPLETED }
enum LootType       { VOYAGE_OFFERT REDUCTION ENERGIE CADEAU_SPONSOR UPGRADE }
enum LootRarity     { COMMON UNCOMMON RARE EPIC LEGENDARY }
enum AchievementCategory { RAID BOSS SEASONAL SOCIAL TRAVEL }
```

---

## 7. API BACKEND NÉCESSAIRE

```
GET  /raids/active                    — Raids en cours
GET  /raids/upcoming                  — Raids à venir
GET  /raids/:id                       — Détail instance
POST /raids/:id/join                  — Rejoindre un raid
POST /raids/:id/attack                — Attaque standard (coût énergie)
POST /raids/:id/invoke-hero           — Invoquer un héros sponsor
POST /raids/:id/mini-game/result      — Soumettre résultat mini-game
GET  /raids/:id/leaderboard           — Classement temps réel
GET  /raids/:id/loot-pool             — Pool loot disponible
POST /raids/:id/distribute-loot       — [ADMIN] Déclencher distribution
GET  /achievements                    — Tous les hauts faits
GET  /achievements/me                 — Mes hauts faits
WebSocket: /raids/:id/live            — Flux temps réel HP boss, chat, events
```

---

## 8. LOGIQUE LOOT RANDOM

```typescript
// Algorithme distribution loot
function distributeLoot(raid: RaidInstance, participants: RaidParticipant[]) {
  const lootPool = raid.lootPool;
  
  for (const item of lootPool) {
    // Tirage pondéré par dégâts infligés (top dégâts = +chance mais pas garanti)
    const weights = participants.map(p => Math.sqrt(p.damageDealt));
    const winners = weightedRandomPick(participants, weights, item.quantity);
    
    for (const winner of winners) {
      createLootDrop(winner, item);
      notifyUser(winner.userId, item);
      // Si voyage offert → créer bon de réduction avec expiration 6 mois
    }
  }
}
```

---

## 9. PRIORITÉ & ESTIMATION

- **Priorité** : Post-MVP (Phase 3+)
- **Complexité** : Élevée (temps réel, animations, loot distribué)
- **Prérequis** : Système d'énergie ✅, Système héros sponsors, WebSockets
- **Estimation équipe** : 6-8 semaines full-stack
- **Impact investisseurs** : Fort — différenciateur unique marché

---

## 10. CONNEXIONS AVEC AUTRES SYSTÈMES

- `TODO-ENERGIE-SYSTEME.md` — Les attaques consomment de l'énergie
- `TODO-GAMING-SPONSORS-HEROS.md` — Les héros sont créés par les sponsors
- `TODO-GAMING-MONDES.md` — Chaque raid appartient à un monde
- `TODO-GAMING-SOCIAL.md` — Classements partagés, chat raid
- `TODO-GAMING-FIDÉLISATION.md` — Les loots alimentent la boucle de rétention
