# TODO — Système Sponsors & Héros Eventy
> Vision long terme (post-MVP) — Document investisseurs
> Créé le 2026-04-25

---

## 1. VISION GLOBALE

Les sponsors deviennent des acteurs du jeu, pas de simples annonceurs. Chaque marque crée **un Héros** (allié) ET **un Boss** (ennemi) que les clients combattent. La pub devient du gameplay — la marque apparaît naturellement en deux rôles complémentaires.

**Cercle vertueux** : Sponsor paie → Héros + Boss créés → Client suit la marque → Héros disponible → Client invoque → Boss battu → Loot reçu → Voyage gagné → Client satisfait → Sponsor visible → Sponsor renouvelle.

---

## 1.1 DOUBLE RÔLE SPONSOR — MIS À JOUR 2026-04-25

### Héros (côté gentil)
- Le sponsor crée un héros avec son branding (nom, visuel, capacité)
- Les clients l'invoquent en combat pour obtenir des bonus (×1.5 à ×3.0 dégâts)
- Pour invoquer un héros : le client SUIT le sponsor sur Eventy Social
- L'interaction sponsor = condition pour l'invocation = engagement réel

### Boss (côté méchant)
- Le MÊME sponsor a aussi un Boss dans un monde/instance
- Les clients doivent battre ce boss pour gagner du loot sponsor
- Pour battre le boss d'un sponsor → invoquer les héros des AUTRES sponsors
- Double facturation : un seul pack couvre héros + boss

### Règle anti-auto-invocation (FONDAMENTALE)
- Un héros NE PEUT PAS combattre le boss de son propre sponsor
- Raison : force les joueurs à suivre PLUSIEURS sponsors, pas un seul
- Chaque sponsor bénéficie ainsi des interactions générées par les autres

### Boss Level proportionnel au pack
| Pack | Prix | Boss Level | Loot | Héros Rareté |
|------|------|-----------|------|-------------|
| Bronze | 99€/mois | Facile (10–20) | Commun+Rare | Commun |
| Silver | 299€/mois | Moyen (30–50) | Rare+Épique | Rare |
| Gold | 990€/mois | Difficile (60–80) | Épique+Légendaire | Épique |
| Platinum | 2990€/mois | Légendaire (90–100) | Légendaire Exclusif | Légendaire |

Boss difficile → plus de joueurs requis → plus de visibilité → sponsor incité à upgrader.

---

## 2. PAGES & MAQUETTES TEXTUELLES

### 2.1 Page Publique Héros — `/jeux/heros`

```
╔══════════════════════════════════════════════════════════╗
║  🦸 LES HÉROS D'EVENTY                                   ║
║  Invoque les héros de tes marques préférées en combat !  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  HÉROS DISPONIBLES (tu suis ces marques)                 ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐                 ║
║  │ 🏃 NIKE  │ │ 🧗 DECATH│ │ 🛡️ AXA   │                 ║
║  │ Le Sprint│ │ L'Alpini │ │ Le Gardien│                 ║
║  │ ★★★★☆   │ │ ★★★★★   │ │ ★★★☆☆   │                 ║
║  │ ⚡ +80%  │ │ 🗡️ +120% │ │ 🛡️ -50% │                 ║
║  │ [INVOQUER]│ │[INVOQUER]│ │ [INVOQUER]│                 ║
║  └──────────┘ └──────────┘ └──────────┘                 ║
║                                                          ║
║  HÉROS À DÉBLOQUER (suis la marque pour débloquer)       ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐                 ║
║  │ 🔒 AIRBN │ │ 🔒 AIRFR │ │ 🔒 ACCOR │                 ║
║  │ L'Hôte   │ │ L'Ailier │ │ L'Hôtelier│                ║
║  │ [SUIVRE] │ │ [SUIVRE] │ │ [SUIVRE] │                 ║
║  └──────────┘ └──────────┘ └──────────┘                 ║
║                                                          ║
║  🔍 FILTRES : [Tous] [Combat] [Défense] [Support] [Epic] ║
╚══════════════════════════════════════════════════════════╝
```

### 2.2 Page Profil Héros — `/jeux/heros/[heroId]`

```
╔══════════════════════════════════════════════════════════╗
║  🦸 LE SPRINT — Héros Nike                               ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌─────────────────┐  STATS DU HÉROS                     ║
║  │                 │  ⚡ Puissance    : ████████░░ 80/100║
║  │  [ILLUSTRATION  │  🏃 Vitesse      : █████████░ 90/100║
║  │   HÉROS NIKE]   │  🛡️ Endurance   : ██████░░░░ 60/100║
║  │                 │  ✨ Charisme     : ███████░░░ 70/100║
║  └─────────────────┘                                     ║
║                                                          ║
║  CAPACITÉ SPÉCIALE                                       ║
║  "Just Win It" — Pendant 30s, tous les dégâts du groupe  ║
║  sont multipliés par 1.8. Rechargement : 4h              ║
║                                                          ║
║  COMMENT DÉBLOQUER                                       ║
║  → Suivre @Nike sur le réseau Eventy                     ║
║  → Avoir participé à 1 raid minimum                      ║
║                                                          ║
║  STATISTIQUES                                            ║
║  👥 12 450 invocations ce mois                          ║
║  🏆 Taux victoire avec ce héros : 73%                   ║
║  🎯 Boss préféré : El Toro Dorado (+120% efficacité)    ║
║                                                          ║
║  À PROPOS DE NIKE                                        ║
║  "Sponsor Gold Eventy depuis juin 2026"                  ║
║  [Voir le profil Nike] [Suivre Nike (+5⚡)]              ║
╚══════════════════════════════════════════════════════════╝
```

### 2.3 Dashboard Sponsor — `/pro/gaming/sponsors`

```
╔══════════════════════════════════════════════════════════╗
║  🎯 MON DASHBOARD SPONSOR — NIKE                         ║
║  Pack : GOLD  |  Renouvellement : 15/07/2026             ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  📊 STATS CE MOIS                                        ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        ║
║  │ 12 450      │ │ 47 230      │ │ 892         │        ║
║  │ Invocations │ │ Vues héros  │ │ Nouveaux    │        ║
║  │ +23% vs M-1 │ │ +45% vs M-1 │ │ abonnés     │        ║
║  └─────────────┘ └─────────────┘ └─────────────┘        ║
║                                                          ║
║  MON HÉROS — Le Sprint                                   ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  Statut : ✅ ACTIF    |  Raids ce mois : 8          │ ║
║  │  Invocations : 12 450 | Taux victoire  : 73%        │ ║
║  │  Énergie redistribuée aux joueurs : 124 500 pts ⚡  │ ║
║  │                                                     │ ║
║  │  [✏️ Modifier héros] [📊 Stats détaillées]          │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                          ║
║  💰 FACTURATION                                          ║
║  Pack Gold : 990€/mois (HT)                              ║
║  Prochaine facture : 01/06/2026                          ║
║  [📄 Télécharger factures] [↗️ Upgrader vers Platinum]  ║
║                                                          ║
║  📅 ÉVÉNEMENTS AVEC MON HÉROS                            ║
║  • Raid Halloween (31/10) — Mon héros disponible ✅      ║
║  • World Event Égypte (01/12) — [S'inscrire]            ║
╚══════════════════════════════════════════════════════════╝
```

### 2.4 Page Création Héros (Sponsor) — `/pro/gaming/sponsors/create-hero`

```
╔══════════════════════════════════════════════════════════╗
║  ✨ CRÉER MON HÉROS — Étape 2/4                          ║
║  [1 Infos] → [2 Design] → [3 Stats] → [4 Validation]    ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  DESIGN DU HÉROS                                         ║
║                                                          ║
║  Nom du héros *                                          ║
║  ┌─────────────────────────────────────────────┐        ║
║  │ Le Sprint                                   │        ║
║  └─────────────────────────────────────────────┘        ║
║                                                          ║
║  Avatar du héros (PNG 512x512 min, fond transparent)     ║
║  ┌───────────────────┐  ← Upload ou choisir parmi        ║
║  │  [Drag & Drop]   │     nos templates stylisés         ║
║  │  ou [Parcourir]  │                                    ║
║  └───────────────────┘                                   ║
║                                                          ║
║  Couleurs de marque                                      ║
║  Primaire : [████] #111111    Secondaire : [████] #FF0000║
║                                                          ║
║  Message d'invocation (max 80 caractères)                ║
║  ┌─────────────────────────────────────────────┐        ║
║  │ "Le Champion Nike vous rejoint ! Just Win It"│        ║
║  └─────────────────────────────────────────────┘        ║
║                                                          ║
║  Capacité spéciale (selon votre pack)                   ║
║  ○ Boost Vitesse (+X% dégâts groupe 30s)                ║
║  ○ Bouclier Collectif (-X% dégâts reçus 60s)            ║
║  ● Combo Ultime (multiplicateur x1.8 | Pack Gold requis)║
║                                                          ║
║  [← Précédent]                    [Suivant : Stats →]   ║
╚══════════════════════════════════════════════════════════╝
```

### 2.5 Page Offres Sponsors — `/sponsors` (page publique)

```
╔══════════════════════════════════════════════════════════╗
║  🤝 DEVENEZ SPONSOR EVENTY                               ║
║  Touchez 50 000+ voyageurs passionnés via le jeu         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   ║
║  │ 🥉 BRONZE│ │ 🥈 SILVER│ │ 🥇 GOLD  │ │ 💎 PLAT. │   ║
║  │ 99€/mois │ │ 299€/mois│ │ 990€/mois│ │ 2990€/mois│  ║
║  │──────────│ │──────────│ │──────────│ │──────────│   ║
║  │ Héros    │ │ Héros    │ │ Héros    │ │ Boss     │   ║
║  │ Basique  │ │ Amélioré │ │ Épique   │ │ Sponsorisé│  ║
║  │          │ │          │ │          │ │          │   ║
║  │ 1 capacité│ │ 2 capac. │ │ 3 capac. │ │ Capacité │   ║
║  │ std      │ │          │ │ dont ultime│ │ exclusive│  ║
║  │          │ │ Bannière │ │ Monde    │ │ Monde     │  ║
║  │          │ │ 1 monde  │ │ dédié    │ │ brandé    │  ║
║  │          │ │          │ │          │ │ entièrement│ ║
║  │          │ │          │ │ Événement│ │ Événement │  ║
║  │          │ │          │ │ spécial  │ │ saisonnier│  ║
║  │          │ │          │ │          │ │ exclusif  │  ║
║  │ Dashboard│ │ Dashboard│ │ Dashboard│ │ Dashboard │  ║
║  │ basique  │ │ standard │ │ avancé   │ │ premium   │  ║
║  │          │ │          │ │          │ │ + Account │  ║
║  │          │ │          │ │          │ │ manager   │  ║
║  │[DÉMARRER]│ │[DÉMARRER]│ │[DÉMARRER]│ │[CONTACTER]│  ║
║  └──────────┘ └──────────┘ └──────────┘ └──────────┘   ║
║                                                          ║
║  ✅ Facturation automatique   ✅ Sans engagement 3 mois  ║
║  ✅ Stats temps réel          ✅ Annulation facile        ║
╚══════════════════════════════════════════════════════════╝
```

---

## 3. COMPOSANTS FRONTEND NÉCESSAIRES

```
app/(public)/sponsors/
├── page.tsx                        — Page offres sponsors (marketing)
├── [pack]/page.tsx                 — Page détail pack

app/(pro)/gaming/sponsors/
├── page.tsx                        — Dashboard sponsor
├── create-hero/page.tsx            — Wizard création héros (4 étapes)
├── hero/[heroId]/
│   ├── page.tsx                    — Stats détaillées héros
│   └── edit/page.tsx               — Modifier le héros
├── events/page.tsx                 — Événements sponsorisables
├── factures/page.tsx               — Historique facturation
└── stats/page.tsx                  — Analytics avancées

app/(jeux)/heros/
├── page.tsx                        — Galerie tous les héros
└── [heroId]/page.tsx               — Profil héros public

components/gaming/sponsors/
├── SponsorHeroCard.tsx             — Carte héros (locked/unlocked)
├── HeroInvokeButton.tsx            — Bouton invocation avec animation
├── SponsorPackCard.tsx             — Carte offre sponsor (pricing)
├── HeroCreationWizard.tsx          — Wizard 4 étapes
├── HeroStatsEditor.tsx             — Éditeur stats (sliders)
├── SponsorDashboard.tsx            — Dashboard principal sponsor
├── InvocationCounter.tsx          — Compteur invocations temps réel
├── SponsorEventCalendar.tsx       — Calendrier événements
└── HeroPreview3D.tsx               — Aperçu héros (Canvas/Lottie)
```

---

## 4. FLUX UTILISATEUR — DÉBLOQUER ET INVOQUER UN HÉROS

```
1. Client joue un raid → voit "Héros disponibles : Nike, Decathlon"
2. Héros Nike est 🔒 → message "Suis Nike pour débloquer Le Sprint"
3. Client clique "Suivre Nike (+5⚡)" → suit automatiquement sur réseau Eventy
4. Héros débloqué → animation déblocage
5. En combat → client clique [INVOQUER LE SPRINT]
6. Animation : héros apparaît à l'écran (branding Nike visible)
7. Buff activé : dégâts x1.8 pendant 30s pour tout le groupe
8. Stats enregistrées pour Nike : +1 invocation, +vues
9. Rechargement héros : 4h (encourage fidélisation + retour app)
```

---

## 5. FLUX SPONSOR — ONBOARDING & ACTIVATION

```
1. Sponsor visite /sponsors → sélectionne pack
2. Inscription via Stripe → paiement mensuel automatique
3. Accès dashboard pro créé → email de bienvenue
4. Wizard création héros (30 min guidées) :
   Step 1 : Infos marque (nom, description, URL)
   Step 2 : Design héros (upload avatar, couleurs, message)
   Step 3 : Stats et capacité (selon pack)
   Step 4 : Validation et prévisualisation
5. Soumis pour modération Eventy (48h max)
6. Héros activé → disponible dans tous les raids actifs
7. Notifications automatiques :
   - Chaque lundi : rapport hebdo (invocations, vues)
   - Chaque mois : facture + stats complètes
   - Événements à venir : invitation à sponsoriser
```

---

## 6. ARCHITECTURE DONNÉES

### Modèles Prisma

```prisma
model Sponsor {
  id              String          @id @default(cuid())
  companyName     String
  logoUrl         String?
  websiteUrl      String?
  description     String?
  pack            SponsorPack     @default(BRONZE)
  status          SponsorStatus   @default(PENDING)
  stripeCustomerId String?
  stripeSubId     String?
  monthlyPrice    Int
  heroes          SponsorHero[]
  events          SponsorEvent[]
  invoices        SponsorInvoice[]
  createdAt       DateTime        @default(now())
  renewsAt        DateTime?
}

model SponsorHero {
  id              String          @id @default(cuid())
  sponsorId       String
  sponsor         Sponsor         @relation(fields: [sponsorId], references: [id])
  name            String
  description     String?
  avatarUrl       String
  primaryColor    String          @default("#000000")
  secondaryColor  String          @default("#FFFFFF")
  invokeMessage   String
  abilityType     HeroAbilityType
  abilityDuration Int             @default(30)
  abilityMultiplier Float         @default(1.5)
  cooldownHours   Int             @default(4)
  rarity          HeroRarity      @default(COMMON)
  status          HeroStatus      @default(PENDING_REVIEW)
  stats           Json
  invocations     HeroInvocation[]
  followers       UserHeroUnlock[]
  createdAt       DateTime        @default(now())
}

model UserHeroUnlock {
  id              String      @id @default(cuid())
  userId          String
  heroId          String
  user            User        @relation(fields: [userId], references: [id])
  hero            SponsorHero @relation(fields: [heroId], references: [id])
  unlockedAt      DateTime    @default(now())
  @@unique([userId, heroId])
}

model HeroInvocation {
  id              String          @id @default(cuid())
  heroId          String
  userId          String
  raidInstanceId  String
  hero            SponsorHero     @relation(fields: [heroId], references: [id])
  effectiveness   Float
  damageBoosted   Int
  invokedAt       DateTime        @default(now())
}

model SponsorInvoice {
  id              String      @id @default(cuid())
  sponsorId       String
  sponsor         Sponsor     @relation(fields: [sponsorId], references: [id])
  amount          Int
  stripeInvoiceId String?
  pdfUrl          String?
  status          InvoiceStatus @default(PENDING)
  issuedAt        DateTime    @default(now())
  paidAt          DateTime?
}

enum SponsorPack   { BRONZE SILVER GOLD PLATINUM }
enum SponsorStatus { PENDING ACTIVE SUSPENDED CANCELLED }
enum HeroAbilityType { SPEED_BOOST SHIELD GROUP_HEAL COMBO_ULTIMATE EXCLUSIVE }
enum HeroRarity    { COMMON UNCOMMON RARE EPIC LEGENDARY }
enum HeroStatus    { PENDING_REVIEW ACTIVE SUSPENDED ARCHIVED }
enum InvoiceStatus { PENDING PAID FAILED }
```

---

## 7. API BACKEND NÉCESSAIRE

```
# Public
GET  /sponsors/packs                      — Offres (bronze/silver/gold/platinum)
GET  /heroes                              — Tous les héros actifs
GET  /heroes/:id                          — Détail héros
GET  /heroes/:id/stats                    — Stats publiques héros

# Client (authentifié)
GET  /heroes/me/unlocked                  — Mes héros débloqués
POST /heroes/:id/unlock                   — Suivre sponsor = débloquer héros
POST /heroes/:id/invoke                   — Invoquer un héros en raid

# Sponsor (authentifié, rôle SPONSOR)
POST /sponsors/onboard                    — Inscription sponsor
GET  /sponsors/me                         — Mon profil sponsor
PUT  /sponsors/me                         — Mettre à jour profil
POST /sponsors/me/heroes                  — Créer un héros
PUT  /sponsors/me/heroes/:id              — Modifier héros
GET  /sponsors/me/heroes/:id/stats        — Stats héros
GET  /sponsors/me/invoices                — Mes factures
GET  /sponsors/me/stats                   — Dashboard analytics
GET  /sponsors/me/events                  — Événements disponibles
POST /sponsors/me/events/:id/register     — S'inscrire à un événement

# Admin
GET  /admin/sponsors                      — Liste tous les sponsors
PUT  /admin/heroes/:id/review             — Approuver/rejeter héros
POST /admin/sponsors/:id/suspend          — Suspendre sponsor
```

---

## 8. SYSTÈME DE FACTURATION AUTOMATIQUE

```typescript
// Webhook Stripe — abonnement mensuel sponsor
async function handleStripeSubscriptionRenewed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const sponsor = await findSponsorByStripeCustomer(invoice.customer);
  
  // 1. Créer facture dans notre système
  await createSponsorInvoice({
    sponsorId: sponsor.id,
    amount: invoice.amount_paid,
    stripeInvoiceId: invoice.id,
    pdfUrl: invoice.invoice_pdf,
    status: 'PAID'
  });
  
  // 2. Calculer redistribution énergie aux joueurs
  const energyPool = Math.floor(invoice.amount_paid * 0.1); // 10% → joueurs
  await distributeEnergyToActivePlayers(energyPool);
  
  // 3. Envoyer rapport mensuel au sponsor
  await sendSponsorMonthlyReport(sponsor.id);
}
```

---

## 9. REDISTRIBUTION ÉNERGIE AUX JOUEURS

```
Sponsor Bronze   (99€/mois)  → 9 900 pts ⚡ redistribués aux invocateurs
Sponsor Silver  (299€/mois)  → 29 900 pts ⚡ redistribués
Sponsor Gold    (990€/mois)  → 99 000 pts ⚡ redistribués
Sponsor Platinum(2990€/mois) → 299 000 pts ⚡ redistribués

Distribution : proportionnelle au nombre d'invocations du héros ce mois
```

---

## 10. PRIORITÉ & ESTIMATION

- **Priorité** : Post-MVP (Phase 3+)
- **Complexité** : Élevée (Stripe, modération, animations)
- **Prérequis** : Raids/Boss actifs, réseau social Eventy, Stripe Connect
- **Estimation équipe** : 4-6 semaines full-stack
- **Impact business** : Très fort — revenu récurrent B2B + viralité B2C

---

## 11. CONNEXIONS AVEC AUTRES SYSTÈMES

- `TODO-GAMING-RAIDS-BOSS.md` — Héros invoqués pendant les raids
- `TODO-GAMING-SOCIAL.md` — Suivre un sponsor = l'avoir dans son réseau
- `TODO-ENERGIE-SYSTEME.md` — Redistribution énergie via sponsors
- `TODO-GAMING-FIDÉLISATION.md` — Plus de sponsors = plus de voyages gagnables
