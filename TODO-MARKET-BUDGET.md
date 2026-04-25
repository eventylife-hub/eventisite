# TODO — Market Budget Gaming (Énergie Marketing)
> Module : `frontend/app/(admin)/admin/gamification/market-budget/`  
> Style : dark `bg-[#0A0E14]` · gold `#D4A853` · Framer Motion · Recharts  
> Date audit : 2026-04-25

---

## Concept

Le **Market Budget** est le budget énergie qu&apos;Eventy alloue pour faire jouer les clients.  
C&apos;est du marketing déguisé en divertissement : les clients pensent gagner des points, Eventy fidélise.

**Clé économique** :
- 1 point énergie ≈ 0,01 € (taux configurable)
- Donner 5 points/coup × 1 000 joueurs × 3 coups/jour = 150 €/jour = ~4 500 €/mois
- ROI vs publicité classique : **x10 à x50** (fidélisation + engagement direct)

---

## Sources du Market Budget

### Entrées (ce qui alimente le budget)

| Source | Mécanisme | Configurable |
|--------|-----------|-------------|
| Budget marketing mensuel Eventy | Injection directe admin | ✅ |
| Revenus sponsors gaming | % des contrats sponsors → market budget | ✅ |
| Avantages HRA négociés | Valeur des avantages convertis en énergie | ✅ |
| Commission sur ventes voyages | % du CA voyages → market budget | ✅ |
| Cartes cadeaux vendues | 100% de la valeur → market budget | — |
| Événements partenaires | Budget événementiel dédié | ✅ |

### Dépenses (ce qui consomme le budget)

| Poste | Description | Coût moyen |
|-------|-------------|------------|
| Énergie garantie par coup | Min pts à chaque frappe boss | Configurable |
| Cartes énergie lootées | Petites (< 100 pts) | Fréquent |
| Cartes énergie moyennes | 100–500 pts | Rare |
| Cartes énergie grosses | 500–2 000 pts | Très rare |
| Jackpot boss final | 2 000+ pts | Jackpot 1% |
| Codes créateurs QR | Points fixes par scan | Fixe |
| Jeux exceptionnels | Événements spéciaux, événements saisonniers | Ponctuel |
| Campagnes marketing énergie | Injections masse (newsletter, anniv, etc.) | Ponctuel |

---

## Interface Admin — Dashboard Market Budget

**Route** : `/admin/gamification/market-budget`

### Section 1 — Vue d&apos;ensemble (KPIs)

```tsx
const KPIS = [
  { label: 'Budget mensuel alloué', value: '15 000 €', color: '#60a5fa' },
  { label: 'Dépensé ce mois', value: '8 420 €', color: '#D4A853', pct: '56%' },
  { label: 'Restant', value: '6 580 €', color: '#4ade80' },
  { label: 'Projection fin de mois', value: '12 300 €', color: '#fbbf24' },
  { label: 'Pts distribués ce mois', value: '842 000 pts', color: '#a78bfa' },
  { label: 'Valeur € distribuée', value: '8 420 €', color: '#f87171' },
]
```

### Section 2 — Répartition par poste (PieChart)

```
Camembert des dépenses :
  - Boss (énergie garantie/coup) : ~40%
  - Loots cartes énergie : ~30%
  - Jackpots : ~10%
  - Codes QR créateurs : ~12%
  - Campagnes marketing : ~8%

Interactif : hover tooltip avec valeur € et pts
```

### Section 3 — Sources du budget (BarChart)

```
BarChart horizontal :
  - Budget Eventy injecté
  - Revenus sponsors gaming (part allouée)
  - Avantages HRA convertis
  - Commissions voyages
```

### Section 4 — Historique dépenses (AreaChart)

```
AreaChart 30 jours :
  - Budget alloué (ligne pointillée)
  - Budget dépensé cumulé (area gold)
  - Projection fin de mois (line rouge si dépassement)

Tooltip : date, dépense du jour, cumulé, restant
```

### Section 5 — Simulateur Budget

```tsx
// Paramètres sliders
const PARAMS = {
  joueursActifs: 847,        // slider 100-5000
  coupsParJourMoyen: 3,      // slider 1-10
  energieGarantieParCoup: 5, // slider 1-20
  tauxConversion: 0.01,      // € par point (configurable)
}

// Calculs automatiques
const cout_jour = joueursActifs × coupsParJour × energieGarantie × tauxConversion
// = 847 × 3 × 5 × 0.01 = 127.05 €/jour

const cout_mois = cout_jour × 30
// = 3 811.5 €/mois (juste pour l&apos;énergie de base)

// Plus les loots (estimés à +40%) → ~5 336 €/mois total

// Affichage :
// Budget consommé par 1 joueur/mois : X €
// Budget total pour N joueurs : X €
// Budget restant après boss : X €
// Marge de manœuvre pour campagnes : X €
```

### Section 6 — Configuration

```tsx
// Paramètres configurables
const CONFIG = {
  budgetMensuel: 15000,            // € injectés par mois
  plafondParJour: 600,             // € max dépensés par jour
  plafondParClientParJour: 0.25,   // € max gagné par client par jour
  tauxConversionPts: 0.01,         // € par point énergie
  repartitionAuto: {
    boss: 40,         // % du budget
    loots: 30,
    jackpots: 10,
    codesCrateurs: 12,
    campagnes: 8,
  },
  alertes: {
    seuilOrange: 80, // % budget consommé → alerte orange
    seuilRouge: 95,  // % budget consommé → alerte rouge + blocage auto
  }
}
```

### Section 7 — Alertes

```
- Budget > 80% : alerte orange dans la sidebar admin
- Budget > 95% : alerte rouge + email admin + suspension automatique nouvelles campagnes
- Budget épuisé : boss continuent (énergie minimale garantie) mais plus de jackpots ni campagnes
- Projection dépassement J+7 : alerte préventive
```

---

## Pyramide de Gains (Principe économique)

> ⚠️ NE PAS afficher côté client — données admin uniquement

```
Objectif : donner la SENSATION de gagner souvent
Principe : 60 clients gagnent 2€ > 1 client gagne 120€

Pyramide cible :
  - 80% des interactions → petit gain (< 100 pts = < 1€)
  - 15% des interactions → gain moyen (100-500 pts = 1-5€)
  -  4% des interactions → gros gain (500-2000 pts = 5-20€)
  -  1% des interactions → jackpot (2000+ pts = 20€+)

Impact psychologique :
  - Client tape 5 coups/jour = 4 petits gains + probabilité 1 moyen
  - 30 jours × 5 coups = 150 interactions → ressent ~160 pts/jour
  - Après 60 jours, il "sent" avoir gagné 9 600 pts ≈ 96€
  - Sur 12 voyages → il croit avoir une "réduction" importante
  - Il repart → fidélisation organique

Config admin pour pyramide :
  - Ajuster les % par tranche
  - Preview simulation : "X joueurs × Y jours = Z gains/tranche"
  - Recharts BarChart distribution gains
```

---

## Sources & Calculs Revenus Sponsoring → Market Budget

```
Exemple config :
  - Société Générale paie 4 500€/mois
  - 20% → market budget = 900€
  - 80% → marge Eventy = 3 600€

  - AXA paie 3 200€/mois
  - 20% → market budget = 640€
  - 80% → marge = 2 560€

  Total sponsors → market budget : 900 + 640 + 560 + 360 = 2 460€/mois

Config admin :
  - % de chaque contrat sponsor qui va au market budget
  - Vue récapitulative : total entrant market budget vs total dépensé
```

---

## Pages admin à créer (sprint)

| Page | Route | Priorité | Description |
|------|-------|----------|-------------|
| Dashboard Market Budget | `admin/gamification/market-budget` | P0 | Vue complète avec tous les KPIs |
| Configuration Boss | `admin/gamification/boss-config` | P0 | Config boss + simulateur |
| Historique dépenses | Intégré au dashboard | P0 | AreaChart 30j |
| Pyramide gains config | Intégré à boss-config | P0 | Camembert + sliders |

---

## Calcul coût réel — Table de référence

| Énergie/coup | Joueurs | Coups/j | Coût/j | Coût/mois |
|-------------|---------|---------|--------|-----------|
| 2 pts | 500 | 3 | 30 € | 900 € |
| 5 pts | 500 | 3 | 75 € | 2 250 € |
| 5 pts | 1 000 | 3 | 150 € | 4 500 € |
| 8 pts | 1 000 | 5 | 400 € | 12 000 € |
| 10 pts | 2 000 | 3 | 600 € | 18 000 € |

*Taux : 1 pt = 0,01 €. Plus loots (+40% en moyenne).*
