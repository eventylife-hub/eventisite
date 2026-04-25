# TODO — Fiches Métiers Terrain & Composant TeamMemberCard
> Transversal — apparaît sur : fiche voyage client · fiche voyage vente · portail créateur · app mobile  
> Composant : `frontend/components/shared/TeamMemberCard.tsx`  
> Date : 2026-04-25

---

## Objectif

> Quand un voyageur consulte son voyage, il doit voir **QUI va l'accompagner**.  
> Quand un prospect achète, il doit voir que le voyage inclut des **experts certifiés**.  
> Ça rassure, ça différencie Eventy, ça vend.

---

## Données de la fiche membre terrain

### Champs complets (tous métiers)

```typescript
interface TeamMember {
  // Identité
  id: string
  prenom: string
  nom: string                     // Affiché : Prénom N. (ex: "Mohammed B.")
  photo: string                   // URL avatar/photo pro
  metier: MetierType              // 'accompagnateur' | 'guide' | 'chauffeur' | etc.
  badgeCertifie: boolean          // "Certifié Eventy" ✅
  
  // Profil professionnel
  description: string             // Texte court (max 200 chars) visible partout
  biographie: string              // Texte long (pour la modale détail)
  specialites: string[]           // Ex: ['Enfants', 'Seniors', 'Aventure', 'Culture', 'PMR']
  langues: string[]               // Ex: ['Français', 'Anglais', 'Arabe', 'Espagnol']
  certifications: string[]        // Ex: ['BAFA', 'PSC1', 'Guide Agréé Maroc']
  
  // Expérience & stats
  nbVoyages: number               // Voyages accompagnés (tous temps)
  nbVoyagesCeCreateur?: number    // Voyages avec ce créateur spécifique
  anneeDebut: number              // Pour calculer "X ans d'expérience"
  
  // Avis voyageurs
  noteMoyenne: number             // 0-5
  nbAvis: number
  avisRecents: Avis[]             // 3 derniers avis (pour modale)
  
  // Contact urgence (visible accompagnateur seulement, pas en vente)
  telephoneUrgence?: string       // Masqué en vente, visible après achat
  
  // Disponibilité
  disponible: boolean
  prochaineDispo?: string         // "À partir du 15 mai"
}

interface Avis {
  auteur: string                  // "Sophie M." (prénom + initiale)
  note: number
  commentaire: string
  voyage: string                  // "Marrakech Avril 2025"
  date: string
}

type MetierType = 
  | 'accompagnateur'
  | 'guide'
  | 'guide-montagne'
  | 'moniteur-activites'
  | 'chauffeur'
  | 'animateur'
  | 'photographe'
  | 'decorateur'
  | 'fleuriste'
  | 'traiteur'
  | 'coordinateur'
  | 'securite'
```

---

## Composant TeamMemberCard

> Fichier : `frontend/components/shared/TeamMemberCard.tsx`  
> Utilisé partout avec des variantes de taille

### Variante COMPACT (liste équipe sur fiche voyage)

```
┌────────────────────────────────────────────────┐
│  [Photo]  Mohammed B.              ⭐ 4.9       │
│   🟡      Guide culturel           127 voyages  │
│  [avatar] Marrakech & Région        🇫🇷 🇬🇧 🇲🇦   │
│           Spéc: Culture, Médina, Atlas          │
│                             [Voir profil →]     │
└────────────────────────────────────────────────┘
```

### Variante CARD (grille équipe)

```
┌──────────────────────────────┐
│         [PHOTO 80px]         │
│     ✅ Certifié Eventy       │
│                              │
│    Mohammed B.               │
│    Guide culturel            │
│    Marrakech & Région        │
│                              │
│    ⭐ 4.9 · 127 voyages      │
│    🇫🇷 🇬🇧 🇲🇦 🇪🇸             │
│                              │
│  Culture · Médina · Atlas    │
│                              │
│  "Passionné et disponible"   │
│                              │
│     [Voir profil complet]    │
└──────────────────────────────┘
```

### Variante MODAL DÉTAIL (clic sur "Voir profil")

```
┌─────────────────────────────────────────────────────────────────┐
│  [Photo 120px] Mohammed B.                     ✅ Certifié      │
│                Guide culturel · Marrakech                        │
│                ⭐ 4.9 / 5 · 127 voyages · 8 ans d'expérience   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📝 DESCRIPTION                                                   │
│  Passionné par l'histoire et la culture marocaine depuis 8 ans,  │
│  Mohammed vous fera découvrir les secrets de la Médina et les    │
│  paysages époustouflants de l'Atlas avec chaleur et humour.      │
│                                                                   │
│  🌍 LANGUES PARLÉES                                               │
│  🇫🇷 Français (courant) · 🇬🇧 Anglais (courant)                   │
│  🇲🇦 Arabe (natif) · 🇪🇸 Espagnol (notions)                       │
│                                                                   │
│  🎯 SPÉCIALITÉS                                                   │
│  [Culture] [Médina & Souks] [Atlas & Montagne]                   │
│  [Enfants ★] [Seniors ★] [Cuisine locale]                       │
│                                                                   │
│  📋 CERTIFICATIONS                                                │
│  ✅ Guide Agréé Maroc (Ministère Tourisme)                       │
│  ✅ PSC1 — Premiers secours                                      │
│  ✅ Formation Eventy — Expérience groupe                         │
│                                                                   │
│  ⭐ AVIS RÉCENTS (127 au total)                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ ⭐⭐⭐⭐⭐ Sophie M. — Marrakech Avril 2025                 │    │
│  │ "Mohammed est exceptionnel, une encyclopédie vivante !"  │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ ⭐⭐⭐⭐⭐ Jean-Pierre D. — Maroc Désert Mars 2025          │    │
│  │ "Le meilleur guide qu'on ait jamais eu. Merci !"         │    │
│  └──────────────────────────────────────────────────────────┘    │
│  [Voir tous les avis →]                                          │
│                                                                   │
│  [Fermer]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Où apparaît le composant

### 1. Page voyage CLIENT (après achat)

> Route : `frontend/app/(client)/client/reservations/[id]/page.tsx`  
> Section : "Votre équipe terrain"

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 VOTRE ÉQUIPE TERRAIN                                         │
│  Les experts qui vont vous accompagner                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ [Photo]             │  │ [Photo]             │               │
│  │ Thomas M.           │  │ Mohammed B.         │               │
│  │ Accompagnateur ✅   │  │ Guide culturel ✅   │               │
│  │ ⭐ 4.8 · 89 voy.    │  │ ⭐ 4.9 · 127 voy.   │               │
│  │ 🇫🇷 🇬🇧 🇪🇸           │  │ 🇫🇷 🇬🇧 🇲🇦 🇪🇸         │               │
│  │ [Voir profil]       │  │ [Voir profil]       │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                   │
│  ┌─────────────────────┐                                        │
│  │ [Photo]             │                                        │
│  │ Rachid T.           │                                        │
│  │ Chauffeur ✅        │                                        │
│  │ ⭐ 4.7 · 234 traj.  │                                        │
│  │ 🇫🇷 🇦🇷               │                                        │
│  │ [Voir profil]       │                                        │
│  └─────────────────────┘                                        │
│                                                                   │
│  📞 NUMÉRO D'URGENCE : +33 1 XX XX XX XX (Eventy 24h/24)       │
│  📞 Accompagnateur Thomas : +33 6 XX XX XX XX                   │
└─────────────────────────────────────────────────────────────────┘
```

**Numéros de téléphone** : visibles uniquement APRÈS achat confirmé  
**Rôle** : rassurer le client, humaniser le voyage  

---

### 2. Page VENTE (prospect non-acheteur)

> Route : `frontend/app/(public)/public/voyages/[slug]/page.tsx`  
> Section : "Votre équipe dédiée"

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 VOTRE ÉQUIPE DÉDIÉE — Pourquoi vous êtes entre de bonnes mains│
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Sur chaque voyage Eventy, vous avez une équipe terrain certifiée│
│                                                                   │
│  [COMPACT CARDS — 3 membres, scroll horizontal]                  │
│  ← [Thomas M. Accompagnateur ⭐4.8 127 voy.] →                  │
│     [Mohammed B. Guide ⭐4.9 89 voy.]                           │
│     [Rachid T. Chauffeur ⭐4.7 234 traj.]                       │
│                                                                   │
│  ✅ Accompagnateur dédié à votre groupe                          │
│  ✅ Guide certifié par le Ministère du Tourisme                  │
│  ✅ Chauffeur professionnel, véhicule premium                    │
│  ✅ Tous certifiés Eventy — Formation & sécurité                │
│                                                                   │
│  [Réserver ce voyage →]         Numéros visibles après achat    │
└─────────────────────────────────────────────────────────────────┘
```

**Règles** : pas de numéros de téléphone sur la page vente, noms en prénom + initiale  
**Impact vente** : rassure le prospect, montre le niveau de service  

---

### 3. Portail Créateur (gestion de son équipe)

> Route : `frontend/app/(pro)/pro/voyages/[id]/equipe/page.tsx`  
> (Créer cette page si elle n'existe pas)

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 Équipe terrain — Voyage Maroc Mai 2025      [+ Ajouter]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  AFFECTÉS À CE VOYAGE                                            │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Thomas M. · Accompagnateur ✅ ⭐4.8                       │    │
│  │ Dispo : 24 → 30 Avril ✅                                  │    │
│  │ Tel : +33 6 XX XX XX XX [Copier] [Appeler]               │    │
│  │                                [Remplacer] [Retirer]      │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ Mohammed B. · Guide culturel ✅ ⭐4.9                     │    │
│  │ Dispo : Toujours Marrakech ✅                             │    │
│  │ Tel : +212 6 XX XX XX XX [Copier] [Appeler]             │    │
│  │                                [Remplacer] [Retirer]      │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  RECOMMANDÉS (selon destination + dispo)                          │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Karim L. · Guide Atlas ⭐4.8 · Dispo ✅ · [+ Ajouter]   │    │
│  │ Sofia A. · Animatrice ⭐4.9 · Dispo ✅ · [+ Ajouter]    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Envoyer planning à toute l'équipe]                             │
│  [Voir incidents signalés par l'équipe]                          │
└─────────────────────────────────────────────────────────────────┘
```

**Fonctionnalités** : affecter/retirer membre, voir disponibilités, appeler direct, envoyer planning, recevoir incidents  

---

### 4. App Mobile Client (consultation voyage)

> Tab "Mon Équipe" dans l'app voyage mobile

```
📱
┌──────────────────────────────────────┐
│  Mon Équipe                          │
│  Voyage Maroc · 24-30 Avril          │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Photo 60px]  Thomas M.        │  │
│  │ 🟢 En voyage   Accompagnateur  │  │
│  │ ⭐ 4.8          📞 [Appeler]   │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ [Photo 60px]  Mohammed B.      │  │
│  │ 🟢 Disponible  Guide Médina    │  │
│  │ ⭐ 4.9          📞 [Appeler]   │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ [Photo 60px]  Rachid T.        │  │
│  │ 🟢 En trajet   Chauffeur       │  │
│  │ ⭐ 4.7          📞 [Appeler]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  🆘 URGENCE EVENTY 24h/24           │
│  📞 +33 1 XX XX XX XX               │
└──────────────────────────────────────┘
```

---

## Implémentation technique

### Composant principal

```tsx
// frontend/components/shared/TeamMemberCard.tsx

interface TeamMemberCardProps {
  member: TeamMember
  variant: 'compact' | 'card' | 'list-row'
  showPhone?: boolean        // false par défaut (masqué avant achat)
  showModal?: boolean        // true par défaut
  context: 'vente' | 'client' | 'createur' | 'mobile'
}

export function TeamMemberCard({ member, variant, showPhone, context }: TeamMemberCardProps) {
  // Logique : si context==='vente', masquer tel + limiter infos
  // Si context==='client' ou 'createur', afficher tel + avis complets
}
```

### Sous-composants

```tsx
// Modal détail profil
export function TeamMemberModal({ member, onClose }: { member: TeamMember, onClose: () => void })

// Badge certifié Eventy
export function CertifiedBadge({ size }: { size: 'sm' | 'md' | 'lg' })

// Liste langues avec drapeaux
export function LanguageFlags({ langues }: { langues: string[] })

// Spécialités badges
export function SpecialtyBadges({ specialites }: { specialites: string[] })

// Stars rating
export function StarRating({ note, nbAvis }: { note: number, nbAvis: number })
```

### Section équipe pour fiche voyage

```tsx
// frontend/components/shared/TripTeamSection.tsx
// Wrapper qui affiche la liste d'équipe d'un voyage

interface TripTeamSectionProps {
  membres: TeamMember[]
  context: 'vente' | 'client' | 'createur'
  titre?: string
}
```

---

## Pages à créer / modifier pour intégration

| Portail | Route | Action |
|---------|-------|--------|
| Public (vente) | `(public)/public/voyages/[slug]/page.tsx` | Ajouter section `<TripTeamSection context="vente">` |
| Client | `(client)/client/reservations/[id]/page.tsx` | Ajouter section `<TripTeamSection context="client" showPhone>` |
| Pro Créateur | `(pro)/pro/voyages/[id]/equipe/page.tsx` | Créer page gestion équipe terrain |
| App mobile | `(client)/client/voyages/[id]/equipe/page.tsx` | Vue mobile équipe |

---

## Détails design du composant

```tsx
// Palette TeamMemberCard
const GOLD = '#D4A853'
const BG_CARD = 'rgba(255,255,255,0.04)'
const BORDER = 'rgba(255,255,255,0.08)'
const BORDER_HOVER = 'rgba(212,168,83,0.3)'

// Badge Certifié Eventy — style
background: 'rgba(212,168,83,0.12)'
border: '1px solid rgba(212,168,83,0.4)'
color: GOLD
text: '✅ Certifié Eventy'
fontSize: 11

// Drapeaux langues (emoji)
'Français' → '🇫🇷'
'Anglais'  → '🇬🇧'
'Arabe'    → '🇲🇦' (ou 🇸🇦 selon contexte)
'Espagnol' → '🇪🇸'
'Allemand' → '🇩🇪'
'Italien'  → '🇮🇹'
'Portugais'→ '🇵🇹'

// Spécialités badges
background: 'rgba(255,255,255,0.05)'
border: '1px solid rgba(255,255,255,0.1)'
color: '#a0a8b8'
// Spécialités spéciales (enfants, PMR) → gold background
```

---

## Framer Motion — animations

```tsx
// Card entry
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.08 }}

// Hover card
whileHover={{ scale: 1.02, borderColor: BORDER_HOVER }}

// Modal open
initial={{ opacity: 0, scale: 0.95, y: 10 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95 }}

// Stars animation (fill gauche → droite)
// animate chaque étoile avec delay index * 0.1
```

---

## Données backend — endpoints à créer

```
GET /api/voyages/:id/equipe          → liste équipe terrain du voyage
GET /api/membres/:id/profil          → profil complet + avis
GET /api/membres/:id/disponibilites  → planning dispo
PUT /api/voyages/:id/equipe          → affecter/retirer membre (créateur only)
```

---

## Règles métier importantes

| Contexte | Numéro tel | Nom complet | Avis | Badge |
|----------|-----------|-------------|------|-------|
| Page vente (avant achat) | ❌ Masqué | Prénom + initiale | 3 derniers | ✅ |
| Page client (après achat) | ✅ Visible | Prénom + initiale | Tous | ✅ |
| App mobile client | ✅ Visible | Prénom + initiale | Tous | ✅ |
| Portail créateur | ✅ Complet | Nom complet | Tous | ✅ |

---

## Notes d'implémentation

- `'use client'` sur tous les composants avec state (modal, hover)
- Composant serveur possible pour la variante statique (page vente SSG)
- RGPD : numéro de téléphone visible uniquement après authentification + achat
- Avatar fallback : initiales sur fond gold si pas de photo
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Priorité : créer d'abord le composant TeamMemberCard, puis l'intégrer page par page
