# TODO — Boucle de Fidélisation Gaming Eventy
> Vision long terme (post-MVP) — Document investisseurs
> Créé le 2026-04-25

---

## 1. VISION GLOBALE

La fidélisation est le cœur du modèle économique gaming d'Eventy. La boucle vertueuse est simple :

```
Jouer → Gagner énergie → Participer raids → Loot aléatoire → Gagner voyage
    ↑                                                              ↓
    ←←←←←←←←←←←← Revenir jouer pour le prochain voyage ←←←←←←←←←
```

**Principe clé** : Le client doit *croire* qu'il peut gagner un vrai voyage en jouant. Parce que c'est vrai — et ça se passe réellement. Plus il y a de sponsors, plus il y a de voyages à gagner, plus l'attraction est forte, plus les sponsors voient des utilisateurs engagés, plus ils paient, plus il y a de voyages. Cercle vertueux parfait.

---

## 2. MÉCANIQUES DE FIDÉLISATION

### 2.1 Vue d'ensemble de l'écosystème monétaire

```
ENTRÉES D'ÉNERGIE                    SORTIES D'ÉNERGIE
─────────────────                    ─────────────────
✅ Connexion quotidienne (+10⚡)     🗡️ Attaque raid (-20⚡)
✅ Raid participation (+50⚡)        🦸 Invocation héros (-15⚡)
✅ Mini-game gagné (+30⚡)           🎯 Activité premium (-25⚡)
✅ Haut fait débloqué (+100⚡)       🎫 Entrée tournoi (-50⚡)
✅ Suivre sponsor (+5⚡)
✅ Parrainage ami (+200⚡)
✅ Cotisation mensuelle (+500⚡)     CONVERSIONS ⚡ → RÉEL
✅ Redistribution sponsors           ─────────────────────
✅ Carte à gratter (achat ou loot)   500⚡ = 1 ticket tombola voyage
✅ Championnat rangé (récompense)    1000⚡ = réduction 5% voyage
                                     5000⚡ = réduction 20% voyage
                                     10000⚡ = nuit offerte
```

### 2.2 Cotisations Mensuelles (Abonnement gaming)

```
PACK AVENTURIER — 4.99€/mois
• +500⚡ instantané
• Accès aux raids premium
• 1 carte à gratter/mois incluse
• Badge "Aventurier" sur profil

PACK CHAMPION — 9.99€/mois
• +1200⚡ instantané
• Accès tous raids + tournois
• 3 cartes à gratter/mois
• 1 slot héros supplémentaire
• Badge "Champion" sur profil

PACK LÉGENDE — 19.99€/mois
• +3000⚡ instantané
• Accès exclusif raid saisonnier
• 10 cartes à gratter/mois
• 2 slots héros supplémentaires
• Early access boss final
• Badge "Légende" sur profil
• Support prioritaire
```

---

## 3. PAGES & MAQUETTES TEXTUELLES

### 3.1 Page Wallet & Énergie — `/client/gaming/wallet`

```
╔══════════════════════════════════════════════════════════╗
║  ⚡ MON WALLET GAMING                                    ║
║  Pseudo : @sofia_r  |  Niveau : 18                       ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  SOLDE ACTUEL                                            ║
║  ╔═══════════════════════════════════════════════════╗   ║
║  ║  ⚡ 4 850 POINTS D'ÉNERGIE                        ║   ║
║  ║                                                   ║   ║
║  ║  Valeur voyage estimée : ~24€                     ║   ║
║  ║  [CONVERTIR EN BON DE VOYAGE]                     ║   ║
║  ╚═══════════════════════════════════════════════════╝   ║
║                                                          ║
║  TABLEAU DE CONVERSION                                   ║
║  500⚡  → 1 ticket tombola voyage (val. ~5€)            ║
║  1000⚡ → réduction -5% voyage (val. ~25€ moy.)         ║
║  5000⚡ → réduction -20% voyage (val. ~100€ moy.)       ║
║  10000⚡ → 1 nuit offerte (val. ~80€)                   ║
║  50000⚡ → 1 VOYAGE OFFERT (val. ~800€)                 ║
║                                                          ║
║  HISTORIQUE RÉCENT                                       ║
║  +500⚡  Connexion 7j consécutifs   (aujourd'hui)        ║
║  +200⚡  Haut fait débloqué         (hier)               ║
║  -20⚡   Attaque raid El Toro       (hier)               ║
║  +100⚡  Redistribution Nike        (lundi)              ║
║  +200⚡  Parrainage ami Thomas      (semaine dernière)   ║
║                                                          ║
║  🎟️ MES TICKETS TOMBOLA                                  ║
║  Tickets actifs : 3 | Prochain tirage : 01/06/2026      ║
║  [Voir mes tickets] [Acheter des tickets]                ║
╚══════════════════════════════════════════════════════════╝
```

### 3.2 Page Cartes à Gratter — `/client/gaming/cartes`

```
╔══════════════════════════════════════════════════════════╗
║  🎫 CARTES À GRATTER EVENTY                              ║
║  Chaque carte peut te valoir un voyage !                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  MES CARTES DISPONIBLES (3)                              ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     ║
║  │  🗺️ GRANDE  │ │  🌍 STANDARD │ │  ⚡ ÉNERGIE  │     ║
║  │    ÉVASION  │ │              │ │              │     ║
║  │  Lot max :  │ │  Lot max :   │ │  Lot max :   │     ║
║  │  1 voyage   │ │  réduction   │ │  1000⚡       │     ║
║  │  offert     │ │  -30%        │ │              │     ║
║  │  [GRATTER]  │ │  [GRATTER]  │ │  [GRATTER]  │     ║
║  └──────────────┘ └──────────────┘ └──────────────┘     ║
║                                                          ║
║  ─────────────────────────────────────────────────────── ║
║                                                          ║
║  ACHETER DES CARTES                                      ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     ║
║  │ ÉNERGIE     │ │ STANDARD     │ │ GRANDE       │     ║
║  │ 1.99€       │ │ 4.99€        │ │ ÉVASION      │     ║
║  │ ou 200⚡    │ │ ou 500⚡     │ │ 9.99€        │     ║
║  │             │ │              │ │              │     ║
║  │ Gains :     │ │ Gains :      │ │ Gains :      │     ║
║  │ 50-500⚡    │ │ 100⚡-30%   │ │ 200⚡-Voyage │     ║
║  │ [ACHETER]   │ │ [ACHETER]   │ │ [ACHETER]   │     ║
║  └──────────────┘ └──────────────┘ └──────────────┘     ║
║                                                          ║
║  📊 STATISTIQUES EVENTY                                  ║
║  Voyages offerts ce mois via cartes : 3                  ║
║  Réductions distribuées : 127   |   Total cartes : 4 230 ║
╚══════════════════════════════════════════════════════════╝
```

### 3.3 Page Tournois & Championnats — `/jeux/tournois`

```
╔══════════════════════════════════════════════════════════╗
║  🏆 TOURNOIS & CHAMPIONNATS                              ║
║  [En cours] [À venir] [Passés] [Mes participations]      ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🔥 CHAMPIONNAT DE MAI 2026 — EN COURS                   ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  4 semaines | 3 420 participants | Se termine 31/05 │ ║
║  │                                                     │ ║
║  │  🥇 1er → VOYAGE EN ANDALOUSIE (1200€) + 5000⚡     │ ║
║  │  🥈 2-5e → Réduction -50% + 2000⚡                  │ ║
║  │  🥉 6-20e → Réduction -20% + 1000⚡                 │ ║
║  │  📦 Top 100 → Carte Grande Évasion + 500⚡           │ ║
║  │                                                     │ ║
║  │  TON RANG : #234 / 3420  |  Score : 45 230 pts      │ ║
║  │  [VOIR TON CLASSEMENT]                              │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  📅 PROCHAINS TOURNOIS                                   ║
║  ┌──────────────────────┐ ┌──────────────────────┐       ║
║  │ 🎃 CUP HALLOWEEN     │ │ ❄️ CHAMPIONNAT HIVER  │       ║
║  │ 01 - 31 Oct 2026     │ │ Déc 2026 - Fév 2027   │       ║
║  │ 1er Prix :           │ │ Grand Prix :           │       ║
║  │ Voyage Marrakech     │ │ VOYAGE JAPON 15j      │       ║
║  │ (800€)               │ │ (2500€)               │       ║
║  │ [S'inscrire]         │ │ [S'inscrire]          │       ║
║  └──────────────────────┘ └──────────────────────┘       ║
╚══════════════════════════════════════════════════════════╝
```

### 3.4 Page Parrainage — `/client/parrainage`

```
╔══════════════════════════════════════════════════════════╗
║  👥 PARRAINAGE EVENTY                                    ║
║  Invite tes amis — vous gagnez tous les deux !           ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🎁 TON LIEN DE PARRAINAGE                               ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  eventy.fr/invite/SOFIA2026                         │ ║
║  │  [COPIER] [WHATSAPP] [EMAIL] [QR CODE]              │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  COMMENT ÇA MARCHE                                       ║
║  1️⃣  Tu partages ton lien à un ami                      ║
║  2️⃣  Ton ami s'inscrit et participe à son 1er raid      ║
║  3️⃣  Vous recevez CHACUN +200⚡                         ║
║  4️⃣  Si ton ami réserve un voyage : tu gagnes +500⚡     ║
║                                                          ║
║  📊 TES PARRAINAGES                                      ║
║  Amis parrainés : 4   |   Total ⚡ gagné : 1 400        ║
║  ┌──────────────────────────────────────────────────┐   ║
║  │ Thomas_M    ✅ Inscrit + Raid ✅  → +200⚡ ✅     │   ║
║  │ Karim_B     ✅ Inscrit + Raid ✅  → +200⚡ ✅     │   ║
║  │ Marie_L     ✅ Inscrit + Voyage ✅ → +700⚡ ✅     │   ║
║  │ Julie_R     ⏳ Inscrite — raid en attente          │   ║
║  └──────────────────────────────────────────────────┘   ║
║                                                          ║
║  🏆 PROGRAMME AMBASSADEUR                                ║
║  10 parrainages réussis = statut Ambassadeur             ║
║  → Héros exclusif "L'Ambassadeur" + badge doré          ║
║  [Voir programme Ambassadeur complet]                    ║
╚══════════════════════════════════════════════════════════╝
```

### 3.5 Page Abonnement Gaming — `/client/gaming/abonnement`

```
╔══════════════════════════════════════════════════════════╗
║  ⚡ PACKS GAMING EVENTY                                  ║
║  Maximise tes gains et ta chance de gagner un voyage !   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐               ║
║  │AVENTURIER│  │ CHAMPION │  │ LÉGENDE  │               ║
║  │ 4.99€/m  │  │ 9.99€/m  │  │ 19.99€/m │               ║
║  │──────────│  │──────────│  │──────────│               ║
║  │ +500⚡   │  │ +1 200⚡ │  │ +3 000⚡ │               ║
║  │ Raids    │  │ Raids+   │  │ Tous raids│               ║
║  │ premium  │  │ tournois │  │ + saisonn.│               ║
║  │ 1 carte/m│  │ 3 cartes │  │ 10 cartes│               ║
║  │          │  │ +1 slot  │  │ +2 slots │               ║
║  │          │  │ héros    │  │ héros    │               ║
║  │          │  │          │  │ Early    │               ║
║  │          │  │          │  │ access   │               ║
║  │ [CHOISIR]│  │[CHOISIR] │  │[CHOISIR] │               ║
║  └──────────┘  └──────────┘  └──────────┘               ║
║                                                          ║
║  ✅ Sans engagement   ✅ Annulation facile               ║
║  ✅ Paiement Stripe sécurisé                             ║
║                                                          ║
║  TON PACK ACTUEL : AUCUN — Gratuit                       ║
║  "Passe en Aventurier pour +500⚡ dès maintenant !"     ║
╚══════════════════════════════════════════════════════════╝
```

---

## 4. COMPOSANTS FRONTEND NÉCESSAIRES

```
app/(client)/gaming/
├── wallet/page.tsx                 — Wallet énergie + historique
├── cartes/page.tsx                 — Cartes à gratter
├── abonnement/page.tsx             — Packs gaming
└── parrainage/page.tsx             — Programme parrainage

app/(jeux)/
├── tournois/page.tsx               — Hub tournois & championnats
├── tournois/[tournamentId]/page.tsx — Détail tournoi + classement
└── tombola/page.tsx                — Tombola voyages + tickets

components/gaming/fidelisation/
├── EnergyWallet.tsx                — Affichage solde énergie
├── EnergyHistory.tsx               — Historique transactions énergie
├── EnergyConversionTable.tsx       — Table de conversion énergie → avantages
├── ScratchCard.tsx                 — Carte à gratter interactive (animation JS)
├── ScratchCardResult.tsx           — Résultat carte à gratter
├── GamingPackCard.tsx              — Carte pack gaming (aventurier/champion/légende)
├── TournamentCard.tsx              — Carte tournoi
├── TournamentLeaderboard.tsx       — Classement tournoi temps réel
├── TombolaTicket.tsx               — Ticket tombola animé
├── TombolaCountdown.tsx            — Compte à rebours tirage
├── ReferralCard.tsx                — Widget parrainage
├── ReferralStats.tsx               — Statistiques parrainages
├── DailyLoginBonus.tsx             — Popup bonus connexion quotidienne
├── StreakCounter.tsx               — Compteur jours consécutifs
└── FidelityProgressBar.tsx         — Barre progression vers récompense suivante
```

---

## 5. BOUCLE DE RÉTENTION — MÉCANIQUE QUOTIDIENNE

```
Jour 1  : Inscription → +100⚡ bienvenue + tuto
Jour 2  : Retour → +10⚡ connexion + notification "El Toro à 45% HP !"
Jour 3  : Connexion → +10⚡ + "3 jours de suite !" badge
Jour 7  : Streak 7j → +500⚡ bonus semaine
Jour 14 : Streak 14j → carte à gratter offerte
Jour 30 : Streak 30j → badge "Fidèle" + 1 slot héros bonus
Jour 1  : Si absence 48h → notification "Tu nous manques ! El Toro à 8% HP !"
Jour 1  : Si absence 7j → "Offre spéciale : 200⚡ si tu reviens aujourd'hui"
```

---

## 6. FLUX COMPLET — "DU JEU AU VOYAGE"

```
                    LE VOYAGE RÉEL
                         ↑
              Client voit CTA personnalisé
          "Tu as gagné 5000⚡ = -20% Séville !"
                         ↑
                Conversion énergie → bon
                         ↑
    Raids → Loot → Énergie accumulée progressivement
                         ↑
    Client suit sponsors → héros → invoque → dégâts → rang
                         ↑
       Notification "Boss à 30% HP — MAINTENANT !"
                         ↑
               Client se connecte quotidiennement
                         ↑
         "Rejoins le raid — un voyage est en jeu !"
                         ↑
                  ACQUISITION CLIENT
```

---

## 7. FLUX SPONSOR — CERCLE VERTUEUX

```
SPONSOR PAIE 990€/mois (Gold)
       ↓
10% redistribué → 99 000⚡ aux joueurs
       ↓
Joueurs ont plus d'énergie
       ↓
Joueurs jouent plus / font plus de raids
       ↓
Héros Nike invoqué 12 000 fois
       ↓
Nike visible massivement + 900 nouveaux abonnés
       ↓
Nike renouvelle car ROI démontré
       ↓
Eventy a plus de budget → plus de voyages à gagner
       ↓
Plus de joueurs rejoignent Eventy
       ↓
Nike visible auprès de plus de joueurs
       ↓ (retour au début)
```

---

## 8. ARCHITECTURE DONNÉES

### Modèles Prisma

```prisma
model UserEnergyWallet {
  id              String          @id @default(cuid())
  userId          String          @unique
  user            User            @relation(fields: [userId], references: [id])
  balance         Int             @default(0)
  totalEarned     Int             @default(0)
  totalSpent      Int             @default(0)
  transactions    EnergyTransaction[]
}

model EnergyTransaction {
  id              String              @id @default(cuid())
  walletId        String
  wallet          UserEnergyWallet    @relation(fields: [walletId], references: [id])
  amount          Int
  type            EnergyTxType
  description     String
  relatedRaidId   String?
  relatedSponsorId String?
  createdAt       DateTime            @default(now())
}

model ScratchCard {
  id              String          @id @default(cuid())
  userId          String
  user            User            @relation(fields: [userId], references: [id])
  type            ScratchCardType
  status          ScratchCardStatus @default(UNSCRATCHED)
  reward          Json?
  rewardType      String?
  rewardValue     Int?
  purchasedAt     DateTime        @default(now())
  scratchedAt     DateTime?
}

model GamingSubscription {
  id              String          @id @default(cuid())
  userId          String          @unique
  user            User            @relation(fields: [userId], references: [id])
  pack            GamingPack
  stripeSubId     String?
  monthlyPrice    Int
  status          SubStatus       @default(ACTIVE)
  startedAt       DateTime        @default(now())
  renewsAt        DateTime
  cancelledAt     DateTime?
}

model Tournament {
  id              String              @id @default(cuid())
  name            String
  description     String
  startDate       DateTime
  endDate         DateTime
  status          TournamentStatus    @default(UPCOMING)
  prizes          Json
  participants    TournamentParticipant[]
  seasonalTheme   String?
  createdAt       DateTime            @default(now())
}

model TournamentParticipant {
  id              String      @id @default(cuid())
  tournamentId    String
  userId          String
  tournament      Tournament  @relation(fields: [tournamentId], references: [id])
  user            User        @relation(fields: [userId], references: [id])
  score           Int         @default(0)
  rank            Int?
  joinedAt        DateTime    @default(now())
  @@unique([tournamentId, userId])
}

model UserStreak {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  currentStreak   Int       @default(0)
  longestStreak   Int       @default(0)
  lastLoginDate   DateTime
  streakMilestones Json     @default("[]")
}

model Referral {
  id              String    @id @default(cuid())
  referrerId      String
  referredUserId  String    @unique
  referrer        User      @relation("Referrals", fields: [referrerId], references: [id])
  referredUser    User      @relation("ReferredBy", fields: [referredUserId], references: [id])
  status          ReferralStatus @default(PENDING)
  rewardEnergyPaid Int      @default(0)
  createdAt       DateTime  @default(now())
  completedAt     DateTime?
}

enum EnergyTxType    { RAID_ATTACK MINI_GAME ACHIEVEMENT DAILY_BONUS STREAK_BONUS SPONSOR_GIFT REFERRAL SCRATCH_WIN PURCHASE CONVERT_VOYAGE TOURNAMENT_WIN }
enum ScratchCardType { ENERGIE STANDARD GRANDE_EVASION }
enum ScratchCardStatus { UNSCRATCHED SCRATCHED }
enum GamingPack      { AVENTURIER CHAMPION LEGENDE }
enum SubStatus       { ACTIVE CANCELLED EXPIRED }
enum TournamentStatus { UPCOMING ACTIVE ENDED }
enum ReferralStatus  { PENDING FIRST_RAID_DONE VOYAGE_BOOKED }
```

---

## 9. API BACKEND NÉCESSAIRE

```
# Wallet & Énergie
GET  /gaming/wallet                       — Mon wallet
GET  /gaming/wallet/history               — Historique transactions
POST /gaming/wallet/convert               — Convertir énergie → bon voyage

# Cartes à gratter
GET  /gaming/scratch-cards                — Mes cartes
POST /gaming/scratch-cards/buy            — Acheter carte
POST /gaming/scratch-cards/:id/scratch    — Gratter une carte

# Abonnements gaming
GET  /gaming/packs                        — Offres packs
POST /gaming/packs/subscribe              — S'abonner à un pack
DELETE /gaming/packs/cancel               — Annuler abonnement

# Streak & Daily
POST /gaming/daily-login                  — Connexion quotidienne + bonus

# Tournois
GET  /tournaments                         — Tous tournois
GET  /tournaments/:id                     — Détail tournoi
POST /tournaments/:id/join                — Rejoindre tournoi
GET  /tournaments/:id/leaderboard         — Classement

# Parrainage
GET  /referrals/me                        — Mes parrainages
POST /referrals/register                  — Enregistrer code parrain à l'inscription
GET  /referrals/link                      — Mon lien parrainage

# Tombola
GET  /tombola/active                      — Tombola active
GET  /tombola/my-tickets                  — Mes tickets
POST /tombola/buy-tickets                 — Acheter tickets
```

---

## 10. MODÈLE FINANCIER SIMPLIFIÉ

```
REVENUS GAMING (estimés pour 10 000 utilisateurs actifs)

Cotisations mensuelles :
  20% Aventurier (2000×4.99€)  =  9 980€/mois
  10% Champion   (1000×9.99€)  =  9 990€/mois
   5% Légende    (500×19.99€)  =  9 995€/mois
  Sous-total abonnements       = 29 965€/mois

Cartes à gratter (achat direct) :
  Moyenne 500 ventes/mois × 4€ = 2 000€/mois

Sponsors (10 sponsors moyens) :
  5 Bronze ×99€  = 495€/mois
  3 Silver ×299€ = 897€/mois
  2 Gold ×990€   = 1 980€/mois
  Sous-total sponsors           = 3 372€/mois

TOTAL GAMING : ~35 337€/mois
COÛTS VOYAGES OFFERTS (estimés 5% revenus gaming) : ~1 767€/mois
MARGE BRUTE GAMING : ~33 570€/mois
```

---

## 11. PRIORITÉ & ESTIMATION

- **Priorité** : Post-MVP — Phase 2-3 (énergie + wallet déjà en Phase 1)
- **Complexité** :
  - Wallet + énergie : Moyenne (base déjà posée dans TODO-ENERGIE-SYSTEME.md)
  - Cartes à gratter : Faible-Moyenne
  - Tournois : Moyenne
  - Abonnements gaming : Moyenne (Stripe existant)
  - Tombola : Faible-Moyenne
- **Estimation équipe** : 4-6 semaines full-stack
- **Impact investisseurs** : Très fort — revenu récurrent prévisible + rétention prouvée

---

## 12. CONNEXIONS AVEC AUTRES SYSTÈMES

- `TODO-ENERGIE-SYSTEME.md` — Base du wallet énergie (déjà initié)
- `TODO-GAMING-RAIDS-BOSS.md` — Raids = principale source d'énergie et de loot
- `TODO-GAMING-SPONSORS-HEROS.md` — Sponsors redistribuent énergie aux joueurs
- `TODO-GAMING-MONDES.md` — Compléter un monde = bonus énergie + CTA voyage
- `TODO-GAMING-SOCIAL.md` — Partage social = acquisition virale = + joueurs = + sponsors
