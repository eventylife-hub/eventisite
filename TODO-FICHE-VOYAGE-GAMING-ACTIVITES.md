# TODO — Fiche Voyage : Gaming Optionnel & Activités
> Portails concernés : `(public)/` · `(client)/` · `(pro)/` · `(jeux)/` · App mobile  
> Principe : **Gaming = toggle ON/OFF** — le voyage fonctionne PARFAITEMENT sans gaming  
> Date : 2026-04-25

---

## Vision — Gaming Optionnel

> **Règle absolue** : la fiche voyage et toutes les pages DOIVENT fonctionner sans gaming.  
> Le gaming est une **couche optionnelle** qui s'active par toggle.  
> Au lancement, le gaming est **OFF par défaut**. Le créateur l'active s'il le souhaite.

### 3 niveaux d'activation

| Niveau | Qui contrôle | Portée |
|--------|-------------|--------|
| **Global Eventy** | Admin | Active/désactive le gaming sur toute la plateforme |
| **Créateur** | Toggle dans son portail | Active pour ses voyages uniquement |
| **Par voyage** | Toggle dans config voyage | Override au niveau du voyage |

### Règle d'affichage

```
Si gaming = OFF (défaut lancement) :
  → Fiche voyage = activités normales uniquement
  → Aucune mention de défis, énergie, points, classements

Si gaming = ON (activé par le créateur) :
  → Fiche voyage = activités normales
  → + Section additionnelle "Défis & Gaming"
  → + Points d'énergie à gagner sur chaque activité
  → + Classement en temps réel
  → + Badges à débloquer
```

---

## PARTIE 1 — Activités sur la Fiche Voyage (SANS gaming)

> Fonctionne toujours, que le gaming soit ON ou OFF.

### Page vente `(public)/public/voyages/[slug]/`

#### Maquette — Section Activités (mode standard)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🎯 ACTIVITÉS AU PROGRAMME                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  Incluses dans le voyage                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [Photo]  🏔️ Excursion Atlas & Ourika                    │   │
│  │  Journée complète · Guide certifié · Déjeuner inclus    │   │
│  │  "Les panoramas les plus époustouflants du Maroc"        │   │
│  │  ⭐ Note créateur  ✅ Incluse  📅 J+1                    │   │
│  │                           [+ Détails]                    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ [Photo]  🏙️ Visite Médina & Souks guidée                │   │
│  │  3h · Guide Mohammed B. · Boutiques de qualité          │   │
│  │  "Découvrez les secrets des souks avec un expert"        │   │
│  │  ⭐ Note créateur  ✅ Incluse  📅 J+2                    │   │
│  │                           [+ Détails]                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Optionnelles — À votre guise                                    │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │ [Photo]                 │  │ [Photo]                 │       │
│  │ 🏄 Cours de surf Agadir  │  │ 🍳 Atelier cuisine      │       │
│  │ Optionnel · ~60€/pers   │  │ Optionnel · ~45€/pers   │       │
│  │ 📅 J+3 · 3h             │  │ 📅 J+2 · 2h             │       │
│  │ [Réserver sur place]    │  │ [Réserver sur place]    │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Structure données Activité

```typescript
interface Activite {
  id: string
  titre: string
  description: string
  type: 'aventure' | 'culture' | 'gastronomie' | 'sport' | 'detente' | 'soiree' | 'libre'
  incluse: boolean               // Dans le prix ou optionnelle
  prixOptionnel?: string         // "~60€/pers" si optionnelle
  duree: string                  // "3h", "Journée complète"
  jour?: number                  // Jour du séjour (J+1, J+2...)
  heureDebut?: string
  photos: string[]
  noteCreateur: string           // Recommandation du créateur
  difficulte?: 'facile' | 'modere' | 'difficile'  // Pour activités physiques
  convientA: string[]            // ['enfants', 'seniors', 'PMR', 'tous']
  
  // Champs gaming (null si gaming OFF)
  gamingPoints?: number          // Points énergie à gagner
  gamingDefi?: string            // Description du défi associé
  gamingBadge?: string           // Badge à débloquer
}
```

---

## PARTIE 2 — Toggle Gaming : Configuration Créateur

> Route : `frontend/app/(pro)/pro/voyages/[id]/gaming/page.tsx`  
> **À CRÉER** — page dédiée config gaming du voyage

### Maquette — Page config gaming créateur

```
┌─────────────────────────────────────────────────────────────────┐
│  🎮 Configuration Gaming — Voyage Maroc Mai 2025                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ACTIVATION GAMING CE VOYAGE                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  Gaming : [━━━━━━━●━━━] OFF           Toggle ON/OFF      │   │
│  │                                                           │   │
│  │  ℹ️ Si désactivé : vos voyageurs voient les activités    │   │
│  │     normalement, sans défis ni points.                   │   │
│  │                                                           │   │
│  │  ℹ️ Si activé : une section Défis & Gaming apparaît      │   │
│  │     sur la fiche voyage. Les voyageurs peuvent gagner     │   │
│  │     des points, relever des défis, voir un classement.   │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ──────── [Section visible seulement si gaming = ON] ─────────  │
│                                                                   │
│  CONFIG GAMING (désactivé — section grisée)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔒 Activez le gaming pour configurer ces options        │   │
│  │                                                           │   │
│  │  Thème gaming voyage : [________________ ▾]             │   │
│  │  Points max à gagner : [1000] par voyageur               │   │
│  │  Classement visible : ○ Oui  ● Non (privé)              │   │
│  │  Défis auto-générés : ☑ Oui (basés sur le programme)   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  DÉFIS PAR ACTIVITÉ                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔒 Activez le gaming pour ajouter des défis             │   │
│  │ (Excursion Atlas — Visite Médina — Soirée Gala...)       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Maquette — Config gaming activé

```
┌─────────────────────────────────────────────────────────────────┐
│  🎮 Gaming : [●━━━━━━━━━━] ON                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CONFIG GLOBALE GAMING                                           │
│  Thème : [Explorateur Marocain ▾]                               │
│  Points max : [1000] / voyageur                                  │
│  Classement : ● Public (visible par le groupe)                  │
│               ○ Privé (chaque voyageur voit sa position)        │
│                                                                   │
│  DÉFIS PAR ACTIVITÉ — Configurer les points & défis             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🏔️ Excursion Atlas                                       │   │
│  │ Points inclus : [100] ⚡ (participation)                  │   │
│  │ Défi bonus : [Prendre une photo au sommet] → [+50 ⚡]    │   │
│  │ Badge : [🏔️ Conquérant de l'Atlas]                       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 🏙️ Visite Médina                                         │   │
│  │ Points inclus : [80] ⚡                                   │   │
│  │ Défi bonus : [Trouver la fontaine cachée] → [+30 ⚡]     │   │
│  │ Badge : [🧭 Explorateur des Souks]                        │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 🎭 Soirée Gala Orientale                                  │   │
│  │ Points inclus : [120] ⚡                                  │   │
│  │ Défi bonus : [Apprendre une danse orientale] → [+80 ⚡]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Aperçu : ce que verront vos voyageurs →]                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 3 — Section Gaming sur Fiche Voyage (si ON)

> S'ajoute conditionnellement après la section Activités.  
> `if (voyage.gamingActif) <TripGamingSection />`

### Page vente avec gaming ON

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ⚡ DÉFIS & GAMING — Explorez, Gagnez, Grimpez !                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  Jean-Pierre a activé le gaming sur ce voyage.                  │
│  Relevez des défis, gagnez des points, montez dans le           │
│  classement du groupe. Totalement optionnel, toujours fun.      │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 🎯 8         │  │ ⚡ 1 000      │  │ 🏆 Classement │          │
│  │ défis        │  │ points max   │  │ groupe visible │          │
│  │ disponibles  │  │ à gagner     │  │               │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  EXEMPLES DE DÉFIS                                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🏔️ Conquérant de l'Atlas                                 │   │
│  │ "Prendre une photo au sommet panoramique"                │   │
│  │ Jour 1 · +50 ⚡                                          │   │
│  │                                                           │   │
│  │ 🧭 Explorateur des Souks                                  │   │
│  │ "Trouver la fontaine cachée dans la Médina"              │   │
│  │ Jour 2 · +30 ⚡                                          │   │
│  │                                                           │   │
│  │ 💃 Danseur Oriental                                       │   │
│  │ "Apprendre un pas de danse avec l'animatrice"            │   │
│  │ Soirée J+3 · +80 ⚡                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Voir tous les défis (8) →]                                    │
│                                                                   │
│  ℹ️ Le gaming est 100% optionnel. Vous participez si vous       │
│     voulez. Le voyage est complet sans.                          │
└─────────────────────────────────────────────────────────────────┘
```

### Page client (après achat) avec gaming ON

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ MES DÉFIS — Voyage Maroc                  [Classement →]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Ma progression : 230 / 1 000 ⚡     ▓▓▓░░░░░░░  23%           │
│  Mon rang : 🥈 3e / 52 voyageurs                                │
│                                                                   │
│  DÉFIS DU JOUR (J+1 — Atlas)                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ✅ 🏔️ Conquérant de l'Atlas            +50 ⚡ · Validé  │   │
│  │    "Photo au sommet panoramique"                          │   │
│  │                                                           │   │
│  │ ⏳ 🌿 Botaniste en herbe               +30 ⚡             │   │
│  │    "Identifier 3 plantes de l'Atlas"  En cours           │   │
│  │    [Valider avec photo]                                   │   │
│  │                                                           │   │
│  │ 🔒 🦅 L'Œil du Faucon                  +80 ⚡             │   │
│  │    "Spot le plus haut du circuit"      Disponible J+2     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  BADGES GAGNÉS (3 / 8)                                          │
│  🏔️ Conquérant  🌅 Lève-tôt  🍽️ Gastronome                    │
│  [5 badges à débloquer →]                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 4 — Classement Groupe (si gaming ON)

> Route : `(client)/client/voyages/[id]/classement/page.tsx`  
> Aussi visible depuis l'app mobile

### Maquette — Page classement

```
📱
┌──────────────────────────────────────┐
│  🏆 Classement Maroc                 │
│  Voyage 24-30 Avril · 52 voyageurs   │
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │ 🥇 1er  Sophie M.     820 ⚡ │    │
│  │ 🥈 2e   Jean D.       710 ⚡ │    │
│  │ ▶ 3e   Vous           230 ⚡ │    │  ← surligné or
│  │    4e   Hélène B.     180 ⚡ │    │
│  │    5e   Marc L.       170 ⚡ │    │
│  │   ...                        │    │
│  │   52e   Thomas K.     10 ⚡  │    │
│  └──────────────────────────────┘    │
│                                      │
│  PROCHAINS POINTS À GAGNER           │
│  🌿 Botaniste : +30 ⚡ (J+1 actif)   │
│  🎭 Danseur : +80 ⚡ (J+3 soirée)    │
│                                      │
│  BADGES DU GROUPE                    │
│  🏆 Sophie M. a 6 badges             │
│  [Voir les badges →]                 │
└──────────────────────────────────────┘
```

---

## PARTIE 5 — App Jeux / Portail Gaming (si ON)

> Route existante : `frontend/app/(jeux)/` — 26 pages existantes  
> Ces pages s'activent uniquement si le gaming est ON pour au moins un voyage actif

### Pages clés `(jeux)/` à enrichir

| Page | Description | Action |
|------|-------------|--------|
| `jeux/page.tsx` | Hub gaming du client | Vérifier et enrichir |
| `jeux/defis/page.tsx` | Liste tous les défis | Créer si manquant |
| `jeux/classements/page.tsx` | Classements multi-voyages | Créer si manquant |
| `jeux/badges/page.tsx` | Collection badges | Créer si manquant |
| `jeux/energie/page.tsx` | Solde énergie total | Créer si manquant |

### Structure données Défi

```typescript
interface Defi {
  id: string
  titre: string
  description: string
  icone: string                  // emoji ou URL icon
  pointsBase: number             // Points participation
  pointsBonus?: number           // Points si défi bonus accompli
  badge?: Badge                  // Badge à débloquer
  type: 'photo' | 'question' | 'action' | 'social' | 'exploration'
  jour?: number                  // Jour du voyage (null = tous les jours)
  activiteId?: string            // Associé à une activité
  statutPourMoi: 'verrouille' | 'disponible' | 'en_cours' | 'valide' | 'expire'
  dateDisponible?: Date
  dateExpiration?: Date
  validationAuto: boolean        // Validation auto (présence) ou manuelle (photo)
  preuveRequise?: 'photo' | 'qrcode' | 'aucune'
}

interface Badge {
  id: string
  titre: string
  description: string
  icone: string                  // URL image badge
  rarete: 'commun' | 'rare' | 'epique' | 'legendaire'
  conditionDeblocage: string
}
```

---

## PARTIE 6 — Portail Équipe — Modération Gaming (si ON)

> Route : `frontend/app/(equipe)/equipe/gamification/jeux-moderation/page.tsx`  
> **Existe déjà** — enrichir avec gestion par voyage + validation défis photo

### Maquette — Modération défis (équipe)

```
┌─────────────────────────────────────────────────────────────────┐
│  🎮 Modération Gaming — Voyage Maroc Mai 2025   [Tous voyages ▾]│
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ Gaming ON  │ │ Défis actifs│ │ En attente │ │ Points distrib│ │
│  │ 3 voyages  │ │ 24 défis   │ │ 8 à valider│ │ 12 400 ⚡    │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
│                                                                   │
│  DÉFIS EN ATTENTE DE VALIDATION (8)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [Photo] Marc L. — "Botaniste en herbe" — Excursion Atlas │   │
│  │ "J'ai trouvé le thym sauvage et la lavande !"            │   │
│  │ Reçu il y a 2h                                            │   │
│  │           [✅ Valider +30⚡] [❌ Refuser] [💬 Message]   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ [Photo] Sophie M. — "L'Œil du Faucon" — Panorama Atlas  │   │
│  │ [Photo soumise visible]                                   │   │
│  │           [✅ Valider +80⚡] [❌ Refuser] [💬 Message]   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Composants à créer

### `TripActivitesSection.tsx` (toujours visible)
```tsx
// frontend/components/trip/TripActivitesSection.tsx
interface Props {
  activites: Activite[]
  context: 'vente' | 'client'
  gamingActif: boolean          // Affiche ou masque les points/défis
}
```

### `TripGamingSection.tsx` (conditionnelle)
```tsx
// frontend/components/trip/TripGamingSection.tsx
// Ne render rien si gamingActif = false
interface Props {
  gamingActif: boolean
  defis: Defi[]
  context: 'vente' | 'client'
  maProgression?: { points: number; rang: number }  // client uniquement
}
```

### `GamingToggle.tsx` (portail créateur)
```tsx
// frontend/components/pro/GamingToggle.tsx
interface Props {
  voyageId: string
  gamingActif: boolean
  onChange: (actif: boolean) => void
}
```

### `DefiCard.tsx`
```tsx
// frontend/components/gaming/DefiCard.tsx
interface Props {
  defi: Defi
  variant: 'preview' | 'client-actif' | 'moderation'
  onValider?: () => void
  onSoumettre?: (preuve: File) => void
}
```

---

## Pages à créer / modifier — Récapitulatif

| Fichier | Statut | Action |
|---------|--------|--------|
| `(public)/public/voyages/[slug]/page.tsx` | Existant | Ajouter `<TripActivitesSection>` + `<TripGamingSection gamingActif={...}>` |
| `(client)/client/reservations/[id]/page.tsx` | Existant | Ajouter sections activités + gaming conditionnel |
| `(client)/client/voyages/[id]/classement/page.tsx` | **À créer** | Page classement groupe |
| `(pro)/pro/voyages/[id]/gaming/page.tsx` | **À créer** | Config gaming par voyage |
| `(pro)/pro/voyages/[id]/activites/page.tsx` | **À créer ou enrichir** | Gestion activités |
| `(equipe)/equipe/gamification/jeux-moderation/page.tsx` | Existe | Enrichir validation photo |
| `components/trip/TripActivitesSection.tsx` | **À créer** | Section activités universelle |
| `components/trip/TripGamingSection.tsx` | **À créer** | Section gaming conditionnelle |
| `components/pro/GamingToggle.tsx` | **À créer** | Toggle simple ON/OFF |
| `components/gaming/DefiCard.tsx` | **À créer** | Card défi réutilisable |

---

## Logique conditionnelle — Pattern à adopter

```tsx
// ✅ CORRECT — gaming conditionnel propre
export default function FicheVoyage({ voyage }) {
  return (
    <div>
      <TripHeroSection voyage={voyage} />
      <TripTransportSection arrets={voyage.arrets} />
      <TripActivitesSection activites={voyage.activites} gamingActif={voyage.gamingActif} />
      
      {voyage.gamingActif && (
        <TripGamingSection defis={voyage.defis} context="vente" />
      )}
      
      <TripTeamSection membres={voyage.equipe} context="vente" />
    </div>
  )
}

// ✅ CORRECT — hook useGaming
function useGaming(voyageId: string) {
  const { gaming } = useVoyage(voyageId)
  return {
    actif: gaming?.actif ?? false,
    defis: gaming?.defis ?? [],
    maProgression: gaming?.maProgression ?? null,
  }
}
```

---

## Backend — Endpoints gaming

```
GET  /api/voyages/:id/gaming              → config + toggle
PUT  /api/voyages/:id/gaming/toggle       → ON/OFF (créateur)
GET  /api/voyages/:id/gaming/defis        → liste défis
POST /api/voyages/:id/gaming/defis        → créer défi (créateur)
GET  /api/voyages/:id/gaming/classement   → top 50 + ma position
GET  /api/gaming/defis/:id/statut         → statut pour moi
POST /api/gaming/defis/:id/soumettre      → soumettre preuve
PUT  /api/gaming/defis/:id/valider        → validation équipe
GET  /api/gaming/mes-badges               → ma collection badges
GET  /api/gaming/mon-energie              → total énergie tout temps
```

---

## Notes d'implémentation

- `'use client'` sur tous les composants avec état
- Gaming toggle → `useState` + optimistic update côté créateur
- Défis photo → upload via FormData + stockage S3/Cloudflare R2
- Classement → polling toutes les 60s (pas de WebSocket pour ça)
- Validation défi → queue backend (éviter spam)
- Points énergie → décrémentés selon modèle Eventy (voir `project_8218_model.md`)
- Animation points gagnés → confetti + sound optionnel (si préférence user)
- Framer Motion : spring animation sur progression bar, stagger défis
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal

---

## Règle essentielle — Dégradation gracieuse

```
Si gaming = OFF :
  ✅ Toutes les pages fonctionnent normalement
  ✅ Aucune erreur, aucune section vide, aucune référence aux points
  ✅ Les données gaming ne sont pas chargées (pas de requête inutile)
  ✅ Le code n'est pas conditionné par les points partout

Si gaming = ON mais backend en erreur :
  ✅ La page charge quand même
  ✅ La section gaming affiche "Gaming temporairement indisponible"
  ✅ Les activités normales restent visibles
```
