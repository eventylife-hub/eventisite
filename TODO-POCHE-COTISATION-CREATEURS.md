# TODO — Poche Cotisation Créateurs → Market Budget Gaming
> Module : `frontend/app/(admin)/admin/finance/cotisation-gaming/`  
>          `frontend/app/(independant)/independant/finance/`  
>          `frontend/app/(pro)/pro/finance/`  
> Style : dark `bg-[#0A0E14]` · gold `#D4A853` · Framer Motion · Recharts  
> Date audit : 2026-04-25

---

## Concept du flux

```
Créateur vend voyages
       ↓
Brut voyage → 8 poches (voir indie-cotisations)
       ↓
Poche Marketing (5% du brut) = X €
       ↓
Config admin : 50% de la poche marketing → Gaming
       ↓
X/2 € injectés dans le Market Budget Gaming
       ↓
Points énergie distribués aux joueurs
       ↓
Joueurs utilisent l&apos;énergie → réduction sur les voyages du créateur
       ↓
Créateur vend plus → cotise plus → gaming se renforce → cercle vertueux
```

---

## Structure existante

La poche marketing est déjà calculée dans `admin/finance/indie-cotisations/page.tsx` :

```ts
interface IndieCotisation {
  summaryByPocket: {
    marketingTotalCents: number; // 5% du brut → c'est la SOURCE
    // ...
  }
}
```

**Nouveau champ à introduire** (configurable par admin) :
- `gamingPctOfMarketing` : % de la poche marketing qui va au gaming (ex: 50%)
- `gamingInjectedCents` = `marketingTotalCents × gamingPctOfMarketing / 100`

---

## Page admin : `/admin/finance/cotisation-gaming`

**Route** : `admin/finance/cotisation-gaming/page.tsx`

### Section 1 — Vue d&apos;ensemble

```tsx
const KPIS = [
  { label: 'Total poche marketing ce mois', value: '8 250 €', desc: '5% brut de 47 créateurs', color: GOLD },
  { label: 'Part injectée gaming', value: '4 125 €', desc: '50% de la poche marketing', color: '#a855f7' },
  { label: 'Pts énergie générés', value: '412 500 pts', desc: '4 125 € × 100 pts/€', color: '#67e8f9' },
  { label: 'Joueurs touchés', value: '847', desc: 'bénéficiaires énergie gaming', color: '#4ade80' },
  { label: 'Voyages générés', value: '23', desc: 'réservations via énergie gaming', color: '#fbbf24' },
  { label: 'ROI gaming sur cotisation', value: '×5.6', desc: 'CA généré / cotisation injectée', color: '#f87171' },
]
```

### Section 2 — Configuration

```tsx
// Slider admin : quel % de la poche marketing → gaming
const [gamingPct, setGamingPct] = useState(50) // 50% par défaut

// Affichage temps réel :
// Poche marketing totale : 8 250 €
// → Gaming : 8 250 × 50% = 4 125 €
// → Marketing direct : 8 250 × 50% = 4 125 €

// Impact simulé :
// 4 125 € × 100 pts/€ = 412 500 pts distribués
// 412 500 pts → ~4 125 voyageurs touchés (100 pts/joueur moyen)
// Taux conversion gaming→résa : 2.7%
// → Estimé : 4 125 × 2.7% = ~111 réservations
```

### Section 3 — Par créateur (tableau)

| Créateur | Brut ce mois | Poche Marketing | Injecté Gaming | Joueurs touchés | Voyages via gaming | ROI |
|----------|-------------|-----------------|----------------|-----------------|-------------------|-----|
| Marie D. | 5 500 € | 275 € | 138 € | 138 | 3 | ×6.2 |
| Pierre M. | 3 800 € | 190 € | 95 € | 95 | 2 | ×4.8 |
| Sophie L. | 7 200 € | 360 € | 180 € | 180 | 5 | ×7.1 |

### Section 4 — Historique injections gaming

BarChart mensuel :
- X : 12 derniers mois
- Y : montant injecté en gaming (€)
- Superposé : voyages générés via gaming

### Section 5 — Cercle vertueux (visualisation)

Schéma flow :
```
Créateur → Cotisation → Poche Marketing → 50% Gaming
                                          ↓
Joueurs ← Énergie ← Market Budget Gaming ← 50% Gaming
    ↓
Réservations voyage ← Créateur ← +CA
```

---

## Page indépendant : `/independant/gaming-impact` (À CRÉER)

> ⚠️ CORRECTION 2026-04-25 : Les indépendants N&apos;ONT PAS accès aux poches financières.  
> Ils voient un ENCART FORCE DE VENTE positif, pas un dashboard financier.

**Fichier** : `independant/gaming-impact/page.tsx` (nouvelle page)  
ou encart embarqué dans `/independant/page.tsx` (dashboard principal)

### Ce que l&apos;indépendant VOIT

#### 1. Bannière motivante (PAS de chiffres internes)

```tsx
// Affichage :
"Grâce à votre engagement sur Eventy, vos futurs voyageurs
 accumulent déjà de l&apos;énergie dans Eventy Game 🎮"

"Ce mois, X clients ont gagné de l&apos;énergie sur l&apos;écosystème Eventy.
 Ils pourront l&apos;utiliser sur VOS prochains voyages."

// Stats publiques (agrégées, pas liées au créateur spécifique) :
- Joueurs actifs ce mois sur Eventy Game
- Énergie totale distribuée (en pts)
- Réservations via énergie (toute plateforme)
```

#### 2. Argument de vente — Kit créateur

```
Message clé pour le créateur :
"Dites à vos prospects : En réservant chez moi via Eventy,
 vous participez à un écosystème où vous gagnez toujours.
 Chaque voyage vous rapporte de l&apos;énergie → réductions futures."

Différenciation concurrence :
"Chez Eventy, votre voyage VOUS RAPPORTE.
 C&apos;est ça, notre promesse différenciante."
```

#### 3. Kit argumentaire téléchargeable

- PDF 1 page : "Pourquoi voyager avec moi ?" (Eventy Game + énergie)
- Image Canva-ready pour Instagram/WhatsApp (1080×1080)
- Message WhatsApp pré-rédigé à copier-coller
- Badge "Gaming Partner" à afficher sur les réseaux

#### 4. Pas de chiffres financiers internes

✅ Stats publiques agrégées : OK  
❌ Poches financières : NON  
❌ Cotisations : NON  
❌ Montants injectés gaming : NON (gestion interne Eventy)

---

## Page Pro : `/pro/marketing` (ENRICHISSEMENT — force de vente)

Ajouter dans le portail pro une section "Argument Gaming" :
- Même message positif que l&apos;indépendant
- Kit de communication (images, textes, landing page)
- Statistiques publiques Eventy Game

---

## Calcul du ROI (formule)

```
Cotisation gaming mensuelle = Brut × 5% marketing × 50% gaming
Ex : 5 500 € × 5% × 50% = 137,50 €

Points distribués = cotisation × 100 pts/€
Ex : 137,50 € × 100 = 13 750 pts

Joueurs touchés (estimation) = pts / 100 pts moyens par joueur
Ex : 13 750 / 100 = 138 joueurs

Taux conversion joueur → résa via gaming = ~2.7%
Réservations estimées = 138 × 2.7% = ~4 réservations

CA généré = 4 × panier moyen voyage (1 200 €) = 4 800 €

ROI = CA généré / Cotisation gaming
    = 4 800 € / 137,50 € = ×34.9
```

> Note : le ROI est très élevé car le gaming crée de la fidélisation → le même client revient.

---

## Pages à créer / modifier (sprint)

| Page | Route | Action | Priorité |
|------|-------|--------|----------|
| Dashboard cotisation gaming | `admin/finance/cotisation-gaming` | Créer | P0 |
| Encart force de vente gaming | `independant/gaming-impact` | Créer (pas de finance, juste argument vente) | P0 |
| Section gaming pro marketing | `pro/marketing` | Ajouter encart argument gaming | P1 |

---

## Amélioration indie-cotisations (admin)

Dans `admin/finance/indie-cotisations/page.tsx`, **ajouter** :
- Colonne "Gaming" dans le tableau (montant injecté gaming par indé)
- Lien → `/admin/finance/cotisation-gaming` depuis le KPI marketing
- Badge "Gaming activé/désactivé" par indépendant
