# TODO — Système Énergie Eventy (Refonte Complète)

> **Audit réalisé le 2026-04-25**
> David vise une refonte totale du cœur du système énergie.
> Ce fichier liste **toutes les pages à créer ou modifier**, avec maquette textuelle et priorité.

---

## VISION SYNTHÈSE

```
SOURCES → CAGNOTTE CENTRALE → REDISTRIBUTION

Sources :
  ① Négociations HRA    → avantages gratuits (chambres/repas) convertis en pts
  ② Budget marketing    → Eventy injecte ses propres fonds en énergie
  ③ Plateforme de jeux  → joueurs gagnent de l'énergie en jouant
  ④ Codes créateurs     → QR codes indépendants redistribuent vers leur communauté

Cagnotte centrale :
  - 1 seul solde par client (voyage + gaming unified)
  - Ajustable manuellement par l'admin
  - Panel d'activité temps réel

Redistribution :
  - Réduction voyage (max 40% prix)
  - Cadeaux entre clients
  - Activités HRA
  - Entry fees championnats
  - Via codes créateurs / QR
```

---

## ÉTAT ACTUEL (audit pages existantes)

| Portail | Page | État |
|---------|------|------|
| client/energie | Dashboard solde + paliers | ✅ Existe (mock) |
| client/energie/acheter | Achat cartes cadeaux | ✅ Existe (mock) |
| client/energie/offrir | Offrir des pts à un ami | ✅ Existe (mock) |
| client/energie/deduction | Simulateur déduction voyage | ✅ Existe (mock) |
| admin/gamification/energie | Pilotage paliers + budget | ✅ Existe (mock) |
| admin/sponsors/energie | Circulation voyage ↔ gaming | ✅ Existe (mock) |
| admin/hra/negociations | Suivi négociations prix HRA | ✅ Existe — **SANS conversion énergie** |
| jeux/grattage | Carte à gratter (200 pts = 1 ticket) | ✅ Existe (mock) |
| pro/marque/codes | Codes bonus marques sponsors | ✅ Existe (mock, pour marques) |
| equipe/gamification/energie | Distribution pts équipe | ✅ Existe (mock) |
| independant/* | Codes QR / redistribution énergie | ❌ **MANQUANT** |
| admin/energie/cagnotte | Cagnotte centrale + injections | ❌ **MANQUANT** |
| admin/energie/activite | Panel activité temps réel | ❌ **MANQUANT** |
| admin/energie/jeux-config | Config gains par jeu | ❌ **MANQUANT** |
| admin/hra/negociations | Conversion avantages → énergie | ❌ **MANQUANT** |

---

## PAGES À CRÉER

---

### P0 — CAGNOTTE ADMIN (CŒUR DU SYSTÈME)

---

#### PAGE-01 · `admin/energie/cagnotte` — Cagnotte centrale Eventy

**Priorité : P0 — CRITIQUE**
**Route** : `/admin/energie/cagnotte`
**Ce qui manque** : Page inexistante. C'est le pilier du système.

**Maquette textuelle :**

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Cagnotte Energie — Admin                              │
│ Pilotez la masse monétaire énergie d'Eventy             │
├─────────────────────────────────────────────────────────┤
│ [KPIs en haut]                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ 8.4M pts │ │ 3 842    │ │ 77% usage│ │ ~84 000€ │   │
│ │ en circ. │ │ actifs   │ │ taux     │ │ valeur   │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────────────────┤
│ SOURCES DE LA CAGNOTTE                                  │
│                                                         │
│ ① Négociations HRA          [+350 000 pts ce mois]     │
│ ② Budget marketing Eventy   [+284 500 pts ce mois]     │
│ ③ Plateforme de jeux        [+186 200 pts ce mois]     │
│ ④ Codes créateurs           [+74 800 pts ce mois]      │
│                                                         │
│ Total injecté ce mois : 895 500 pts (+22% M-1)         │
├─────────────────────────────────────────────────────────┤
│ INJECTION MANUELLE                                      │
│                                                         │
│ Source : [▼ Sélectionner source]                        │
│           - Budget marketing Eventy                     │
│           - Négociation HRA (lier à une négociation)   │
│           - Promotion exceptionnelle                    │
│           - Correction / Rectification                  │
│           - Jeu exceptionnel activé                     │
│                                                         │
│ Montant : [_____ pts]  ou  [_____ EUR × taux palier]   │
│ Destinataire : ○ Tous  ○ Segment  ○ Client spécifique  │
│ Motif (interne) : [_________________________________]   │
│ Visibilité client : ○ Visible ○ Silencieux              │
│                                                         │
│           [  Prévisualiser  ]  [▶ Injecter ]            │
├─────────────────────────────────────────────────────────┤
│ SOUSTRACTION / CORRECTION                               │
│                                                         │
│ Montant : [-_____ pts]                                  │
│ Client : [search email / pseudo]                        │
│ Motif : [_________________________________]             │
│           [  Imputer  ]                                 │
├─────────────────────────────────────────────────────────┤
│ HISTORIQUE DES OPÉRATIONS (30 derniers jours)           │
│                                                         │
│ Date       Source                Montant  Destinataire  │
│ 25/04      Budget marketing      +50 000  Tous          │
│ 23/04      HRA — Riad Marrakech  +12 000  Tous          │
│ 22/04      Jeu exceptionnel      +25 000  Actifs 7j     │
│ 20/04      Correction thomas@    -500     thomas@..     │
│ ...                                                     │
│                            [Exporter CSV]               │
└─────────────────────────────────────────────────────────┘
```

**Données à modéliser :**
```typescript
interface InjectionEnergie {
  id: string
  source: 'BUDGET_MARKETING' | 'NEGOCIATION_HRA' | 'PROMO_EXCEP' | 'CORRECTION' | 'JEU_EXCEP'
  negociationHraId?: string  // si source = NEGOCIATION_HRA
  montantPts: number
  montantEur?: number        // si converti depuis EUR
  destinataire: 'TOUS' | 'SEGMENT' | 'CLIENT'
  segmentId?: string
  clientId?: string
  motif: string
  visibleClient: boolean
  createdAt: string
  createdBy: string         // admin qui a fait l'action
}
```

**APIs à créer :**
- `GET /admin/energie/stats` — KPIs globaux
- `GET /admin/energie/injections` — historique avec filtres
- `POST /admin/energie/injection` — injecter des pts
- `POST /admin/energie/imputation` — soustraire des pts

---

#### PAGE-02 · `admin/energie/activite` — Panel activité temps réel

**Priorité : P0 — CRITIQUE**
**Route** : `/admin/energie/activite`

**Maquette textuelle :**

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Activité Énergie — Temps Réel                         │
├─────────────────────────────────────────────────────────┤
│ [Live] 23 joueurs actifs maintenant                     │
│                                                         │
│ Taux redistribution :                                   │
│   Cette semaine : 68% (pts utilisés / pts distribués)   │
│   Ce mois : 77%                                         │
├─────────────────────────────────────────────────────────┤
│ FLUX EN DIRECT (dernières 5 min — auto-refresh 10s)     │
│                                                         │
│ ● 14:32  marine@..  +200 pts  Grattage (🍒)            │
│ ● 14:31  theo@..    +50 pts   Streak 7j                 │
│ ● 14:30  julie@..   -3000 pts Réduction voyage Maroc    │
│ ● 14:29  alex@..    +300 pts  Code NIKE2026             │
│ ● 14:28  sarah@..   +500 pts  Parrainage ami            │
│ [Voir tout] [Pause refresh]                             │
├─────────────────────────────────────────────────────────┤
│ GRAPHES SEMAINE                                         │
│                                                         │
│ [AreaChart : Émise vs Consommée par jour — 7 jours]     │
│                                                         │
│ Par source (barres empilées) :                          │
│   Jeux ████████ 38%                                    │
│   Codes créateurs ██████ 28%                           │
│   Budget Eventy ████ 22%                               │
│   HRA ██ 12%                                           │
├─────────────────────────────────────────────────────────┤
│ TOP JOUEURS (actifs cette semaine)                      │
│                                                         │
│ 1. @marine_v    12 400 pts  Legend  🔥 streak 14j       │
│ 2. @theobolt    9 800 pts   Elite                       │
│ 3. @julietravel 8 200 pts   Elite                       │
│ [Voir classement complet →]                             │
├─────────────────────────────────────────────────────────┤
│ ALERTES AUTOMATIQUES                                    │
│                                                         │
│ ⚠️ Budget marketing : 36% consommé (37 j restants)      │
│ ⚠️ Code NIKEWINTER épuisé — 0 pts restants              │
│ ✅ Taux usage semaine en hausse (+9 pts vs S-1)         │
└─────────────────────────────────────────────────────────┘
```

**APIs à créer :**
- `GET /admin/energie/activite/live` — flux transactions récentes (SSE ou polling)
- `GET /admin/energie/activite/stats-semaine` — graphes hebdo
- `GET /admin/energie/activite/top-joueurs` — classement actifs

---

### P0 — NÉGOCIATIONS HRA → ÉNERGIE

---

#### PAGE-03 · Modifier `admin/hra/negociations` — Ajouter conversion énergie

**Priorité : P0**
**Route existante** : `/admin/hra/negociations` — **MODIFIER**
**Ce qui manque** : quand une négociation passe en statut CONFIRMÉ, il faut pouvoir convertir la valeur de l'avantage (repas offert, chambre offerte) en points d'énergie et les injecter dans la cagnotte.

**Modifications à apporter :**

Ajouter dans chaque négociation confirmée (statut = CONFIRME) :

```
┌─────────────────────────────────────────────────────────┐
│ Riad Al Jazira — Suite Riad — CONFIRMÉ ✅               │
│ Prix négocié : 165€/nuit (était 185€) → gain : 20€/nuit │
├─────────────────────────────────────────────────────────┤
│ CONVERSION EN ÉNERGIE                                   │
│                                                         │
│ Avantage obtenu :                                       │
│ ○ Remise tarifaire (20€ × nb nuits estimées = 400€)    │
│ ○ Nuits gratuites [___] nuits à [165€] = [___]€       │
│ ○ Repas gratuits [___] repas à [___]€ = [___]€        │
│ ○ Valeur libre : [_____]€                               │
│                                                         │
│ Taux conversion : 100 pts / EUR (palier admin)          │
│ → Énergie à injecter : 40 000 pts                       │
│                                                         │
│ Distribution :                                          │
│ ○ Cagnotte globale (tous clients)                       │
│ ○ Voyageurs de ce partenaire uniquement                 │
│ ○ Clients ayant visité [ville]                          │
│                                                         │
│ [💾 Enregistrer sans injecter] [⚡ Injecter maintenant] │
└─────────────────────────────────────────────────────────┘
```

**Données supplémentaires :**
```typescript
interface ConversionHraEnergie {
  negociationId: string
  typeAvantage: 'REMISE' | 'NUITS_GRATUITES' | 'REPAS_GRATUITS' | 'VALEUR_LIBRE'
  valeurEur: number
  tauxConversion: number      // pts par EUR
  ptsInjectes: number
  distribution: 'GLOBAL' | 'PARTENAIRE' | 'VILLE'
  injectedAt?: string
  injectedBy?: string
}
```

---

#### PAGE-04 · `admin/hra/energie-negociations` — Suivi conversions HRA

**Priorité : P0**
**Route** : `/admin/hra/energie-negociations`

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ HRA → Énergie — Suivi des conversions                 │
├─────────────────────────────────────────────────────────┤
│ Total injecté via HRA : 1 240 000 pts (12 400€ d'avant.)│
├─────────────────────────────────────────────────────────┤
│ Partenaire            Avantage      Pts injectés  Date  │
│ Riad Al Jazira        2 nuits grat  33 000 pts   15/04  │
│ La Mamounia           Dîner gala    18 500 pts   12/04  │
│ Ibis Marrakech        Remise 8€/nuit 42 000 pts  01/04  │
│ Oasis Spa Paris       Soin 30min    9 900 pts    28/03  │
│ ...                                                     │
│                                   [+ Nouvelle conversion]│
├─────────────────────────────────────────────────────────┤
│ Négociations CONFIRMÉES sans conversion énergie (3)     │
│ ⚠️ Escape Masters Lyon — 22% remise — en attente inject │
│ ⚠️ Karting Sud Marseille — 7€/pers — en attente inject  │
│ ⚠️ Louvre groupes — 7€/pers — en attente inject         │
└─────────────────────────────────────────────────────────┘
```

---

### P0 — BUDGET MARKETING → ÉNERGIE

---

#### PAGE-05 · Modifier `admin/gamification/energie` tab Budget — Injections budget marketing

**Priorité : P0**
**Route existante** : `/admin/gamification/energie` — **MODIFIER le tab "Budget"**
**Ce qui manque** : actuellement le tab Budget affiche juste une jauge de consommation. Il faut pouvoir **injecter** du budget marketing en énergie et voir l'historique.

**Modifications à apporter dans le tab Budget :**

```
Tab Budget (enrichi) :

┌─ Budget marketing → Énergie ───────────────────────────┐
│                                                         │
│ Budget annuel alloué : 50 000 EUR                       │
│ ████████████░░░░░░░░ 36.8% consommé (18 420 EUR)       │
│ Restant : 31 580 EUR                                    │
├─────────────────────────────────────────────────────────┤
│ NOUVELLE INJECTION BUDGET MARKETING                     │
│                                                         │
│ Montant EUR : [_______]  → [_______ pts] (taux × palier)│
│ Campagne : [Nom de la campagne ___________________]     │
│ Public : ○ Tous les clients  ○ Clients actifs 30j      │
│          ○ Palier ≥ [▼]      ○ Ville [_____]           │
│ Planifier : ○ Maintenant  ○ Date [____] heure [__:__]  │
│                                                         │
│           [Aperçu] [⚡ Injecter]                         │
├─────────────────────────────────────────────────────────┤
│ JEUX EXCEPTIONNELS (activables ponctuellement)          │
│                                                         │
│ [Toggle] Black Friday x2 ⚡         OFF  (Économise pts)│
│ [Toggle] Weekend Flash +50%          OFF                │
│ [Toggle] Lancement nouveau voyage x3 OFF                │
│ [+ Créer un jeu exceptionnel]                           │
├─────────────────────────────────────────────────────────┤
│ HISTORIQUE INJECTIONS BUDGET                            │
│                                                         │
│ 20/04  Campagne printemps    +50 000 pts (500€ budget)  │
│ 15/04  Lancement Maroc       +80 000 pts (800€ budget)  │
│ 01/04  Newsletter Mars       +30 000 pts (300€ budget)  │
│ ...                              [Voir tout] [Export CSV]│
└─────────────────────────────────────────────────────────┘
```

---

### P1 — CODES CRÉATEURS (indépendants)

> Voir aussi fichier dédié : **TODO-CODES-CREATEURS.md**

---

#### PAGE-06 · `independant/energie` — Hub énergie du créateur

**Priorité : P1**
**Route** : `/independant/energie`
**Ce qui manque** : page inexistante. Les indépendants n'ont aucune interface énergie.

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Mon Énergie Créateur                                  │
│ Redistribuez de l'énergie à votre communauté            │
├─────────────────────────────────────────────────────────┤
│ MON QUOTA DE REDISTRIBUTION                             │
│                                                         │
│ ┌────────────────────────────────┐                      │
│ │ Quota mensuel : 50 000 pts     │                      │
│ │ ████████████████░░░░ 68% util.│                      │
│ │ Restant : 16 000 pts           │                      │
│ │ Renouvelé le 01/05/2026        │                      │
│ └────────────────────────────────┘                      │
│                                                         │
│ Redistribué ce mois : 34 000 pts                        │
│ Bénéficiaires : 127 personnes                           │
│ Impact estimé (voyages déclenchés) : 4                  │
├─────────────────────────────────────────────────────────┤
│ MES CODES QR (→ voir TODO-CODES-CREATEURS.md)           │
│                                                         │
│ Code: EVT-CREATOR-JEAN12   500 pts / scan  Actif ●      │
│ Code: EVT-PROMO-MAROC      200 pts / scan  Actif ●      │
│ [+ Créer un code] [📋 Gérer mes codes →]               │
├─────────────────────────────────────────────────────────┤
│ DISTRIBUTION MANUELLE                                   │
│                                                         │
│ À qui : ○ Toute ma communauté (127 personnes)           │
│         ○ Voyageurs de mes voyages (42 personnes)       │
│         ○ Email spécifique [_______________]            │
│                                                         │
│ Montant : [500 pts]  [1000 pts]  [2000 pts]  [Autre]   │
│                                                         │
│ Message (optionnel) : [________________________]        │
│                                                         │
│           [Envoyer]                                     │
├─────────────────────────────────────────────────────────┤
│ HISTORIQUE (30j)                                        │
│                                                         │
│ 23/04  Code EVT-MAROC     +200 pts  → @marine_v        │
│ 23/04  Code EVT-MAROC     +200 pts  → @alex_t          │
│ 22/04  Distribution manuelle +1000  → Toute communauté  │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

---

#### PAGE-07 · `independant/energie/codes` — Gestion codes QR créateur

**Priorité : P1**
**Route** : `/independant/energie/codes`
Détail dans **TODO-CODES-CREATEURS.md**

---

### P1 — JEUX → ÉNERGIE (configuration admin)

---

#### PAGE-08 · `admin/jeux/energie-config` — Configuration gains énergie par jeu

**Priorité : P1**
**Route** : `/admin/jeux/energie-config`
**Ce qui manque** : les jeux existent (grattage, tournois, championnats, mini-jeux) mais il n'y a aucun panneau admin pour définir combien de pts chaque jeu distribue, ni pour activer/désactiver des jeux exceptionnels.

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Configuration Gains Énergie — Jeux                    │
├─────────────────────────────────────────────────────────┤
│ JEUX STANDARDS (toujours actifs)                        │
│                                                         │
│ Jeu                Gain         Coût    Fréq   Toggle   │
│ ─────────────────────────────────────────────────────── │
│ Grattage           50-890 pts   200 pts /infini  [ON ]  │
│ Mini-jeu quotidien 10-100 pts   0 pts   1/jour   [ON ]  │
│ Streak connexion   200 pts      0 pts   /7j      [ON ]  │
│ Championnat finale 500-2000 pts 2000 pts /saison [ON ]  │
│ Quiz voyage        20-50 pts    0 pts   /voyage  [ON ]  │
│                                                         │
│ [Modifier chaque ligne] [Sauvegarder]                   │
├─────────────────────────────────────────────────────────┤
│ JEUX EXCEPTIONNELS (à activer manuellement)             │
│                                                         │
│ ┌─── Black Friday x2 ⚡ ───────────────────────── [OFF]─┐│
│ │ Double énergie sur TOUS les gains                     ││
│ │ Du : [24/11/2026] au [25/11/2026]                     ││
│ │ Budget estimé : +340 000 pts supplémentaires         ││
│ │ Imputation : Budget marketing                         ││
│ └───────────────────────────────────────────────────────┘│
│                                                          │
│ ┌─── Lancement nouveau voyage x3 ──────────────── [OFF]─┐│
│ │ Triple énergie pendant 48h au lancement d'un voyage   ││
│ │ Voyage ciblé : [▼ Sélectionner voyage]                ││
│ └───────────────────────────────────────────────────────┘│
│                                                          │
│ [+ Créer un jeu exceptionnel]                           │
├─────────────────────────────────────────────────────────┤
│ BUDGET JEUX CE MOIS                                      │
│                                                         │
│ Distribué via jeux : 186 200 pts (1 862€ équivalent)   │
│ Dont grattage : 82 400 pts  Dont mini-jeux : 54 800 pts │
│ Dont championnats : 49 000 pts                          │
└─────────────────────────────────────────────────────────┘
```

**Données :**
```typescript
interface ConfigJeuEnergie {
  jeuId: string
  jeuLabel: string
  gainMin: number
  gainMax: number
  coutPts: number        // coût pour jouer
  frequence: 'INFINI' | 'JOUR' | 'SEMAINE' | 'SAISON'
  actif: boolean
  updatedAt: string
}

interface JeuExceptionnel {
  id: string
  label: string
  type: 'MULTIPLICATEUR' | 'BONUS_FIXE'
  valeur: number         // ex: 2 pour x2, ou 500 pour +500 pts
  voyageId?: string
  dateDebut: string
  dateFin: string
  actif: boolean
  budgetImputation: string
}
```

---

### P1 — REDISTRIBUTION CRÉATEURS (admin)

---

#### PAGE-09 · `admin/createurs/energie` — Panel admin redistribution créateurs

**Priorité : P1**
**Route** : `/admin/createurs/energie`
**Ce qui manque** : l'admin ne peut pas voir ni piloter la redistribution des créateurs.

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Redistribution Énergie — Créateurs Indépendants       │
├─────────────────────────────────────────────────────────┤
│ Total redistribué via créateurs ce mois : 74 800 pts    │
│ Créateurs actifs : 18 / 34 inscrits                     │
│ Bénéficiaires uniques : 1 247 clients                   │
├─────────────────────────────────────────────────────────┤
│ QUOTAS GLOBAUX                                          │
│                                                         │
│ Quota mensuel par créateur (défaut) : [50 000 pts]      │
│ Quota VIP créateur : [200 000 pts]                      │
│ [Modifier défaut]                                       │
├─────────────────────────────────────────────────────────┤
│ CRÉATEURS (classé par redistribution)                   │
│                                                         │
│ Créateur       Quota    Utilisé  Bénéf.  Top code       │
│ Jean Dupont    50 000   34 200   127     EVT-JEAN12     │
│ Marie Martin   200 000  187 400  2 340   EVT-MARIE-VIP  │
│ Alex Bon       50 000   12 800   48      EVT-ALEX01     │
│ ...                                                     │
│                    [Modifier quota] [Voir détail]       │
├─────────────────────────────────────────────────────────┤
│ ALERTES                                                 │
│ ⚠️ Marie Martin : 93.7% quota utilisé (6 j avant reset) │
│ ✅ Tous les codes créateurs actifs sont valides          │
└─────────────────────────────────────────────────────────┘
```

---

### P1 — CLIENT : enrichir le dashboard énergie

---

#### PAGE-10 · Modifier `client/energie` — Ajouter sources visibles

**Priorité : P1**
**Route existante** : `/client/energie` — **MODIFIER**
**Ce qui manque** : le dashboard client existe mais n'indique pas **comment gagner de l'énergie** ni ne distingue les sources.

**Modifications à apporter :**

```
[Ajouter une section "Comment gagner de l'énergie" sous le solde]

┌─── GAGNER DE L'ÉNERGIE ────────────────────────────────┐
│                                                         │
│ ① Scannez un QR créateur         +200 pts disponible   │
│   → Code d'un indépendant Eventy [Scanner] [Entrer code]│
│                                                         │
│ ② Jouez sur la plateforme jeux    gains quotidiens      │
│   Grattage du jour : disponible ● [Jouer →]            │
│   Mini-jeu quotidien : disponible ● [Jouer →]          │
│                                                         │
│ ③ Parrainez un ami               +1 000 pts            │
│   [Mon lien de parrainage]                              │
│                                                         │
│ ④ Réservez un voyage             +variable             │
│   Chaque EUR dépensé = [taux palier] pts               │
│                                                         │
│ ⑤ Activités HRA partenaires      2% du ticket en pts   │
│   → Participer à un karting, spa, escape game, etc.    │
└─────────────────────────────────────────────────────────┘

[Ajouter une section "Scanner un QR code créateur"]

┌─── SCANNER UN CODE CRÉATEUR ───────────────────────────┐
│                                                         │
│ Votre créateur indépendant vous a donné un code Eventy ?│
│                                                         │
│ Code : [EVT-____________]  [Valider]                    │
│                                                         │
│ ou  [📷 Scanner le QR code]                            │
│                                                         │
│ Derniers codes scannés :                                │
│ EVT-JEAN12   +500 pts   23/04  Jean Dupont             │
└─────────────────────────────────────────────────────────┘
```

---

### P2 — VISUELS ET STATS

---

#### PAGE-11 · `admin/energie` — Hub admin énergie (index)

**Priorité : P2**
**Route** : `/admin/energie`
Page d'entrée qui centralise tous les outils énergie admin.

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Système Énergie — Admin Central                       │
├─────────────────────────────────────────────────────────┤
│ [→ Cagnotte centrale]  ← injecter, soustraire, historiq │
│ [→ Activité temps réel] ← flux live, taux, top joueurs  │
│ [→ Jeux — config gains] ← pts par jeu, jeux excep.     │
│ [→ Créateurs — redistrib] ← quotas, codes, suivi       │
│ [→ HRA — conversions]   ← avantages négociés → énergie  │
│ [→ Pilotage paliers]    ← taux de conversion par palier │
│ [→ Circulation complète] ← vue voyage ↔ gaming          │
└─────────────────────────────────────────────────────────┘
```

---

#### PAGE-12 · `admin/energie/stats-publiques` — Modifier pour données réelles

**Priorité : P2**
**Route existante** : `/admin/analytics/hra` (possible doublon)
**Action** : s'assurer que les KPIs de `admin/sponsors/energie` sont branchés sur des données réelles, pas juste 8.4M hardcodés.

---

#### PAGE-13 · `client/energie` — Ajouter historique filtrable complet

**Priorité : P2**
**Route existante** : `/client/energie` — **ENRICHIR**
**Ce qui manque** : l'historique transactions actuel est mock. Il faut :
- Filtrer par source (jeux / code créateur / achat / offrir / déduire)
- Pagination infinie
- Export CSV
- Détail cliquable (qui a offert, quel jeu, quel voyage)

---

## RÉCAPITULATIF PRIORISÉ

| Priorité | Page | Action |
|----------|------|--------|
| P0 | `admin/energie/cagnotte` | CRÉER — cœur injection/imputation |
| P0 | `admin/energie/activite` | CRÉER — panel temps réel |
| P0 | `admin/hra/negociations` | MODIFIER — ajouter conversion énergie |
| P0 | `admin/hra/energie-negociations` | CRÉER — suivi conversions HRA |
| P0 | `admin/gamification/energie` tab Budget | MODIFIER — injections + jeux exceptionnels |
| P1 | `independant/energie` | CRÉER — hub énergie créateur |
| P1 | `independant/energie/codes` | CRÉER — gestion codes QR |
| P1 | `admin/jeux/energie-config` | CRÉER — config gains par jeu |
| P1 | `admin/createurs/energie` | CRÉER — panel admin redistribution |
| P1 | `client/energie` | MODIFIER — scanner QR, sources visibles |
| P2 | `admin/energie` | CRÉER — hub index admin |
| P2 | `admin/sponsors/energie` | MODIFIER — brancher données réelles |
| P2 | `client/energie` | ENRICHIR — historique filtrable complet |

---

## ARCHITECTURE BACKEND REQUISE

### Nouveau module `energie` (NestJS)

```
backend/src/modules/energie/
  energie.module.ts
  energie.controller.ts
  energie.service.ts
  dto/
    inject-energie.dto.ts
    impute-energie.dto.ts
    energie-filter.dto.ts
  interfaces/
    injection.interface.ts
    transaction.interface.ts
```

### Routes API à créer

```
# Cagnotte admin
GET    /admin/energie/stats
GET    /admin/energie/injections
POST   /admin/energie/injection
POST   /admin/energie/imputation

# Activité temps réel
GET    /admin/energie/activite/live      (SSE)
GET    /admin/energie/activite/stats

# HRA → énergie
POST   /admin/hra/:id/convert-energie
GET    /admin/hra/energie-conversions

# Jeux config
GET    /admin/jeux/energie-config
PUT    /admin/jeux/energie-config/:jeuId
POST   /admin/jeux/exceptionnel
PUT    /admin/jeux/exceptionnel/:id/toggle

# Créateurs
GET    /admin/createurs/energie
PUT    /admin/createurs/:id/quota

# Indépendant
GET    /independant/energie/stats
GET    /independant/energie/codes
POST   /independant/energie/codes
POST   /independant/energie/distribute
GET    /independant/energie/historique

# Client
GET    /client/energie/stats
GET    /client/energie/transactions
POST   /client/energie/scan-code        (scanner un code créateur)
```

### Table Prisma à ajouter

```prisma
model EnergieTransaction {
  id            String   @id @default(cuid())
  clientId      String
  montantPts    Int      // positif = gain, négatif = dépense
  source        EnergieSource
  sourceRefId   String?  // id de la négociation HRA, du jeu, du code, etc.
  motif         String?
  visibleClient Boolean  @default(true)
  createdAt     DateTime @default(now())
  createdBy     String?  // admin si manuel
}

enum EnergieSource {
  NEGOCIATION_HRA
  BUDGET_MARKETING
  JEU_GRATTAGE
  JEU_MINI_QUOTIDIEN
  JEU_TOURNOI
  JEU_STREAK
  CODE_CREATEUR
  PARRAINAGE
  ACHAT_CARTE_CADEAU
  REDUCTION_VOYAGE
  DON_AMI
  CORRECTION_ADMIN
  JEU_EXCEPTIONNEL
}
```

---

*Audit réalisé le 2026-04-25 | David Eventy*
