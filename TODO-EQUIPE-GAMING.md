# TODO — Équipe Gaming (Employés Eventy)
> Portail : `frontend/app/(equipe)/equipe/gamification/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · glassmorphism · Framer Motion · Recharts  
> Date audit : 2026-04-25

---

## Résumé des travaux

| Page | Statut actuel | Action requise | Priorité |
|------|---------------|----------------|----------|
| `gamification/page.tsx` | Complet (278L) — badges/niveaux | **Enrichir : KPIs financiers gaming** | P0 |
| `gamification/game-master/page.tsx` | Complet (571L) — interventions/raids | ✅ Complet Framer Motion | — |
| `gamification/jeux-moderation/page.tsx` | Complet (277L) — file validation | ✅ Complet | — |
| `gamification/energie/page.tsx` | Complet (301L) — distribution énergie | **Enrichir : coût récompenses + ROI** | P1 |
| `gamification/sponsors/page.tsx` | **MANQUANT** | **À construire** | P0 |
| `gamification/analytics/page.tsx` | **MANQUANT** | **À construire** | P0 |

---

## Style standard

```tsx
const GOLD = '#D4A853'
const GOLD_BG = 'rgba(212,168,83,0.08)'
const GOLD_BORDER = 'rgba(212,168,83,0.2)'
const BG = '#0A0E14'
const GLASS = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

// Entry animation
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}

// Hover card
whileHover={{ scale: 1.01, borderColor: GOLD_BORDER }}
```

---

## P0 — gamification/sponsors/page.tsx (À CRÉER)

**Route** : `/equipe/gamification/sponsors`  
**Rôle** : Configurer les sponsors gaming — héros, boss, niveaux, stats, budget

### Fonctionnalités requises

#### 1. Liste des sponsors actifs
- Nom du sponsor + logo + secteur (banque, assurance, tech, lifestyle…)
- Héros assigné : nom, classe, niveau max, stats (ATK/DEF/VIE)
- Boss assigné : nom, difficulté, points XP, énergie reward
- Budget mensuel sponsor (€)
- ROI : % joueurs actifs qui ont cliqué/converti
- Statut : ACTIF / PAUSE / EXPIRE

#### 2. Panneau de configuration héros
```
Héros config :
  - Nom du personnage
  - Classe : GUERRIER / MAGE / RÔDEUR / SOUTIEN
  - Niveau max débloqué par le sponsor (1–10)
  - Stats par niveau (ATK, DEF, VIE, VITESSE)
  - Skin exclusif (URL image)
  - Pouvoir spécial (description texte)

Boss config :
  - Nom du boss
  - Niveau de difficulté (1–5)
  - HP du boss
  - XP récompense
  - Énergie récompense
  - Temps limite par raid (minutes)
  - Cooldown entre raids (heures)
```

#### 3. KPIs financiers sponsor
- Revenus sponsor ce mois (€)
- Revenus cumulés sur contrat
- Coût des récompenses énergie distribuées (€)
- Marge nette sur ce sponsor (€ et %)
- Nombre de joueurs exposés à ce sponsor
- Taux d&apos;engagement (joueurs actifs / exposés)
- CPE (coût par engagement) côté sponsor
- Conversion : joueurs qui ont visité la page sponsor

#### 4. Actions
- Activer / Mettre en pause un sponsor
- Éditer la config héros/boss (modal inline)
- Renouveler un contrat (marque la date d&apos;expiration)
- Export CSV : métriques par sponsor

---

## P0 — gamification/analytics/page.tsx (À CRÉER)

**Route** : `/equipe/gamification/analytics`  
**Rôle** : Analytics gaming complets — comportement joueurs, performance bosses, ROI sponsors

### Fonctionnalités requises

#### 1. KPIs en temps réel
- Joueurs actifs aujourd&apos;hui
- Raids en cours
- XP total distribué ce mois
- Énergie totale distribuée ce mois (avec valeur €)
- Nouveaux joueurs ce mois
- Rétention 7 jours (% joueurs revenus)

#### 2. Graphiques Recharts

**Boss Performance (BarChart)**
- Axe X : noms des boss
- Axe Y : nombre de raids totaux
- Couleur : gradient gold
- Tooltip : raids, XP moyen, énergie moyenne, taux complétion

**Engagement Sponsors (BarChart horizontal)**
- Axe Y : noms des sponsors
- Axe X : taux d&apos;engagement (%)
- Benchmark ligne pointillée

**Activité joueurs 30j (AreaChart)**
- X : jours
- Y : joueurs actifs quotidiens
- Couleur : gold avec fill semi-transparent

**Énergie distribuée vs Revenus (LineChart double)**
- X : semaines
- Y1 : valeur € énergie distribuée
- Y2 : revenus sponsors
- 2 couleurs : gold + cyan

#### 3. Top classements
- Top 10 boss les plus joués (avec sponsor associé)
- Top 10 sponsors par engagement
- Top 5 guildes/clans par activité
- Top 10 joueurs par XP ce mois

#### 4. Événements saisonniers — ROI
- Tableau des événements passés
- Pour chaque événement : dates, joueurs participants, XP distribué, énergie distribuée, coût total, revenus sponsors associés, marge

---

## P1 — gamification/energie/page.tsx (ENRICHISSEMENT)

**Fichier** : `gamification/energie/page.tsx` (301L existantes)  
**Ajouts** :

### Section financière à ajouter

```tsx
// Section "Coût & ROI" à insérer après les stats rapides
const COUTS = [
  { label: 'Coût 1 000 pts Starter', value: '0,10 EUR', note: '100 pts = 0,01 EUR' },
  { label: 'Coût 1 000 pts Explorer', value: '0,125 EUR', note: '80 pts = 0,01 EUR' },
  { label: 'Coût 1 000 pts Voyageur', value: '0,167 EUR', note: '60 pts = 0,01 EUR' },
  { label: 'Budget distribué ce mois', value: '4 230 EUR', note: 'vs budget 5 000 EUR' },
]

// KPIs à afficher
- Budget énergie restant ce mois
- Pts distribués manuellement ce mois (équipe)
- Pts générés automatiquement (raids/défis)
- Valeur totale en circulation (tous clients)
```

---

## P1 — gamification/page.tsx (ENRICHISSEMENT)

**Fichier** : `gamification/page.tsx` (278L existantes)  
**Ajouts** :

### Section financière gaming

```tsx
const FINANCE_KPIS = [
  { label: 'Revenus sponsors gaming', value: '12 400 EUR', sub: 'ce mois', color: '#4ade80' },
  { label: 'Coût récompenses énergie', value: '4 230 EUR', sub: 'ce mois', color: '#f87171' },
  { label: 'Marge gaming nette', value: '8 170 EUR', sub: '65.9%', color: '#D4A853' },
  { label: 'Joueurs actifs', value: '847', sub: '+12% vs mois dernier', color: '#67e8f9' },
]
```

- Insérer entre le bandeau de niveau et les KPIs existants
- 4 cartes glass en grille 2×2 (mobile) ou 4 colonnes (desktop)
- Ajouter mini-graphique tendance (7j) sous chaque valeur

---

## P2 — Événements saisonniers (FUTUR)

**Route** : `/equipe/gamification/evenements`  
**À créer** : interface configuration événements saisonniers

### Fonctionnalités
- Calendrier événements (Noël, Halloween, St-Valentin, Été, etc.)
- Pour chaque événement : dates, multiplicateur XP, boss thématique, skin exclusif
- Activation/désactivation toggle
- Preview rendu côté client
- Budget événement vs revenus sponsors thématiques

---

## P2 — Guildes/Clans (FUTUR)

**Route** : `/equipe/gamification/guildes`  
**À créer** : modération guildes et clans

### Fonctionnalités
- Liste guildes/clans (nom, taille, score total, fondateur)
- Modération : dissoudre, avertir, bannir un membre
- Support : répondre aux réclamations de guilde
- Stats : guilde la plus active, taux de rétention guilde
- Configuration : taille max par guilde, règles

---

## Mise à jour layout.tsx

```tsx
// ✅ FAIT — gamification/layout.tsx mis à jour le 2026-04-25
const TABS = [
  { label: 'Dashboard',   href: '/equipe/gamification',            icon: '📊' },
  { label: 'Sponsors',    href: '/equipe/gamification/sponsors',   icon: '🏢' },
  { label: 'Analytics',   href: '/equipe/gamification/analytics',  icon: '📈' },
  { label: 'Énergie',     href: '/equipe/gamification/energie',    icon: '⚡' },
  { label: 'Game Master', href: '/equipe/gamification/game-master', icon: '🛡️' },
  { label: 'Modération',  href: '/equipe/gamification/jeux-moderation', icon: '⚖️' },
]
```

---

## P0 — Panel Admin — Configuration Boss (À CRÉER)

**Route admin** : `/admin/gamification/boss-config`  
**Rôle** : Configurer précisément l&apos;économie de chaque boss — énergie par coup, dégâts, barres de vie, loots

### Paramètres par boss

```
Configuration économique :
  - Énergie garantie par coup (min/max) — ex: 2–8 pts
  - Énergie moyenne par coup (valeur affichée dans le simulateur)
  - Dégâts infligés par coup (HP boss descend de X)
  - HP total du boss
  - Durée de vie boss (jours actif avant disparition)
  - Chance de loot carte énergie à CHAQUE coup (%, ex: 15%)
  - Chance de jackpot quand le boss final tombe (%, ex: 5%)
  - Valeur min/max des cartes énergie (ex: 50–500 pts)
  - Valeur du jackpot final (ex: 2000–5000 pts)

Limites par client :
  - Plafond de coups par client par jour (ex: 5 coups/jour)
  - Plafond énergie gagnée par client par boss (tous ses coups cumulés)
  - Cooldown entre deux coups (ex: 2h)
```

### Simulateur économique

```
Paramètres :
  - Nombre de joueurs actifs estimés
  - Coups par joueur par jour (moyenne)
  - Durée de vie du boss (jours)

Résultats automatiques :
  - Énergie totale distribuée (min/moy/max en pts)
  - Coût total en € (pts × taux conversion)
  - Nombre estimé de loots cartes
  - Nombre estimé de jackpots
  - Budget total consommé
  - Alerte si dépassement budget mensuel

Interface :
  - Slider interactif pour chaque paramètre
  - Recharts AreaChart : projection coût/jour sur la durée du boss
  - Badge couleur : VERT si budget OK, ORANGE si tendu, ROUGE si dépassé
```

### Pyramide de distribution (CRITIQUE)

Principe fondamental : **beaucoup de petits gains, très peu de gros**.

```
Pyramide des loots (configurable) :
  - Petits gains (< 100 pts) : 80% des tirages
  - Gains moyens (100–500 pts) : 15% des tirages
  - Gros gains (500–2000 pts) : 4% des tirages
  - Jackpot (2000+ pts) : 1% des tirages

Visualisation : graphique camembert + nombre estimé par tranche
Pourquoi : distribuer 2€/jour à 60 clients > donner 120€ à 1 client
→ Sensation de gagner quotidiennement → fidélisation massive
```

### Interface admin à créer

```tsx
// Page: admin/gamification/boss-config/page.tsx
// Sections :
// 1. Liste des boss avec leur config actuelle (tableau)
// 2. Éditeur modal inline : tous les paramètres
// 3. Simulateur économique (sliders + projections Recharts)
// 4. Pyramide de gains (PieChart configurable)
// 5. Budget checker (comparer avec market budget restant)
```

---

## P0 — Market Budget (À CRÉER)

**Route admin** : `/admin/gamification/market-budget`  
**Rôle** : Piloter le budget marketing énergie — sources, dépenses, projections

> Voir aussi : `TODO-MARKET-BUDGET.md` pour la spec complète
