# TODO — Portail Maisons HRA (Hôtels / Restos / Activités)
> Portail : `frontend/app/(maisons)/maisons/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · glassmorphism · Framer Motion  
> Date audit : 2026-04-25

---

## Vision Eventy — PLATEFORME MARKETPLACE

> **Eventy = plateforme d'organisation**, pas un employeur.  
> La Maison HRA est un **établissement partenaire indépendant** (hôtel, resort, riad…).  
> Elle accueille les groupes Eventy et gère sur cette plateforme : hébergement, restauration, activités, coordination.  
> Ce portail = **son espace de gestion sur la marketplace** — réservations, déclarations, facturation.

---

## Modèle organisationnel

| Niveau | Rôle |
|--------|------|
| **Gérant Maison HRA** | Gère son établissement, déclare les prestations, facture |
| **Responsable HRA** | Supervise toutes les maisons, valide, planifie les attributions |
| **Admin** | Config globale, onboarding nouveaux partenaires, reporting CA |

---

## Résumé des travaux

| Page | Statut actuel | Action requise | Priorité |
|------|---------------|----------------|----------|
| `page.tsx` | Stub (2L) | Redirect → dashboard (garder) | — |
| `dashboard/page.tsx` | **Complet** (276L) — amber, sans Framer | **Restyling gold + Framer Motion** | P0 |
| `reservations/page.tsx` | Stub (2L) | **À construire** | P0 |
| `reservations/[id]/page.tsx` | **Complet** (589L) — amber, sans Framer | **Ajouter Framer Motion** | P0 |
| `hebergement/page.tsx` | **Complet** (352L) — amber, sans Framer | **Ajouter Framer Motion** | P0 |
| `restauration/page.tsx` | **Complet** (~200+L) — amber, sans Framer | **Ajouter Framer Motion** | P0 |
| `activites/page.tsx` | **Complet** (450L) — amber, sans Framer | **Ajouter Framer Motion** | P0 |
| `finance/page.tsx` | **Complet** (504L) — amber, sans Framer | **Ajouter Framer Motion** | P1 |
| `coordination/page.tsx` | **Complet** (165L) — amber, sans Framer | **Ajouter Framer Motion** | P1 |
| `equipe/page.tsx` | **Complet** (287L) — amber, sans Framer | **Ajouter Framer Motion** | P1 |
| `rooming/page.tsx` | **Complet** (323L) — amber, sans Framer | **Ajouter Framer Motion** | P1 |
| `transport/page.tsx` | **Complet** (165L) — amber, sans Framer | **Ajouter Framer Motion** | P1 |
| `configuration/page.tsx` | **Complet** (491L) — amber, sans Framer | **Ajouter Framer Motion** | P1 |
| `analytics/page.tsx` | **Complet** (182L) — VERT ❌ | **Restyling gold + Framer Motion** | P1 |
| `securite/page.tsx` | **Complet** (165L) — amber, sans Framer | **Ajouter Framer Motion** | P2 |
| `documents/page.tsx` | Stub (2L) | **À construire** | P2 |
| `clients/page.tsx` | Peut-être stub | **Vérifier / construire** | P2 |
| `notifications/page.tsx` | Peut-être stub | **Vérifier / construire** | P2 |
| `bracelets/page.tsx` | Peut-être stub | **Phase 2 — optionnel** | P3 |
| `decoration/page.tsx` | Peut-être stub | **Phase 2 — optionnel** | P3 |
| `image-souvenirs/page.tsx` | Peut-être stub | **Phase 2 — optionnel** | P3 |

---

## Style — Migration Amber → Gold

```tsx
// Avant (amber — thème actuel Maisons)
color: '#b45309'
background: '#080c12'
accent: '#fcd34d'
border: 'rgba(180,83,9,0.3)'

// Après (gold standard Eventy)
const GOLD = '#D4A853'
const BG = '#0A0E14'
const CARD = 'rgba(255,255,255,0.04)'
color: GOLD
background: BG
border: `rgba(212,168,83,0.25)`
```

> Note : l'amber actuel (`#b45309`/`#fcd34d`) est proche du gold mais pas identique.  
> Standardiser sur `#D4A853` pour cohérence avec tous les autres portails.

---

## P0 — dashboard/page.tsx (RESTYLING + Framer Motion)

**Statut** : Complet 276L, amber → gold + Framer Motion  
**Contenu existant à garder** : KPIs, alertes urgentes, missions actives, prochaines arrivées, revenus 30j, raccourcis

### Maquette enrichie

```
┌─────────────────────────────────────────────────────────────────┐
│  🏨 Riad Yasmine — Marrakech         [Mode: Gérant ●]           │
│  Maison HRA Partenaire · 4.8★ · 234 groupes accueillis          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Groupes auj. │ │ Taux occup.  │ │ Note moy.    │ │ CA mois │ │
│  │ 3 actifs     │ │ 87% (78/90)  │ │ ⭐ 4.8 / 5   │ │ 34 200€ │ │
│  │ 186 voyageurs│ │ ▓▓▓▓▓▓▓▓░░   │ │ 234 groupes  │ │ +14% ↑  │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌───────────────────────────────┐  ┌────────────────────────┐   │
│  │ MISSIONS ACTIVES              │  │ ALERTES                │   │
│  │                               │  │ 🔴 Chambre 12 — panne  │   │
│  │ 🟢 Groupe Marseille (38 pax)  │  │    clim. signalée      │   │
│  │    Check-in 24/04 ✅          │  │    [Assigner tech]     │   │
│  │    Check-out 30/04            │  │                        │   │
│  │    Chambres : 12-19, 22-31    │  │ 🟡 Facture mars        │   │
│  │                               │  │    non générée         │   │
│  │ 🟢 Groupe Lyon (85 pax)       │  │    [Générer maintenant]│   │
│  │    Check-in 25/04 ✅          │  │                        │   │
│  │    Check-out 01/05            │  │ ✅ Rooming groupe juin  │   │
│  │    Chambres : 101-148         │  │    synchronisé depuis  │   │
│  │                               │  │    Eventy              │   │
│  │ ⏳ Groupe Paris (62 pax)      │  └────────────────────────┘   │
│  │    Check-in 02/05 — dans 7j   │                               │
│  └───────────────────────────────┘  ┌────────────────────────┐   │
│                                     │ PROCHAINES ARRIVÉES    │   │
│                                     │ 02/05 · Paris · 62 pax │   │
│                                     │ 08/05 · Bordeaux · 45p │   │
│                                     │ 15/05 · Nantes · 78 p  │   │
│                                     └────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Framer Motion** : stagger KPIs (delay index*0.1), barres taux occup. animées, pulse alertes rouges

---

## P0 — reservations/page.tsx (À CONSTRUIRE)

**Concept** : Liste de toutes les réservations de groupes passées, en cours, à venir

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Réservations                [Filtrer] [Mois ▾] [Exporter]  │
│  [En cours] [À venir] [Terminées] [Annulées]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EN COURS (2)                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ GROUPE MARSEILLE · #RES-2025-045          [Détails →]    │    │
│  │ 24 → 30 Avril 2025 · 38 voyageurs · 6 nuits              │    │
│  │ Chambres : 19 chambres (12 doubles, 7 simples)           │    │
│  │ Services : PDJ + Dîner incl. · Activités : 2 opt.        │    │
│  │ Montant total : 12 400€ · Acompte 30% reçu ✅            │    │
│  │ Contact : Eventy Ops · Sophie M. — +33 6 12 34 56 78    │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ GROUPE LYON · #RES-2025-048                [Détails →]   │    │
│  │ 25 Avril → 01 Mai · 85 voyageurs · 6 nuits               │    │
│  │ Chambres : 43 chambres (full occupancy)                  │    │
│  │ Services : PDJ + Déj + Dîner gala · Activités : 4 opt.  │    │
│  │ Montant total : 38 200€ · Acompte 30% reçu ✅            │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  À VENIR (4)                                                      │
│  📅 02/05 — Groupe Paris · 62 pax · 5 nuits · 22 400€           │
│  📅 08/05 — Groupe Bordeaux · 45 pax · 4 nuits · 14 800€        │
│  [2 autres →]                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## P0 — reservations/[id]/page.tsx (Framer Motion)

**Statut** : Complet 589L — multi-onglets (manifeste, rooming, facture)  
**Travail** : Ajouter Framer Motion sur onglets, animations entrée sections, hover tableaux  
**Framer Motion** : AnimatePresence sur changement d'onglet, stagger sur rows tableau

---

## P0 — hebergement/page.tsx (Framer Motion)

**Statut** : Complet 352L — missions hébergement, partenaires, checklists expandables  
**Travail** : Ajouter Framer Motion sur expandables, liste missions, hover cards

---

## P0 — restauration/page.tsx (Framer Motion)

**Statut** : Complet ~200+L — gestion repas partenaires, variantes régimes, slots service  
**Travail** : Ajouter Framer Motion + restyling gold si amber trop prononcé

---

## P0 — activites/page.tsx (Framer Motion)

**Statut** : Complet 450L — catalogue activités, partenaires, missions checklists, breakdown financier  
**Travail** : Ajouter Framer Motion sur filtres, cartes activités, expandables

---

## P1 — finance/page.tsx (Framer Motion)

**Statut** : Complet 504L — onglets (versements, factures, réconciliation, acomptes, conditions)  
**Travail** : Ajouter Framer Motion sur onglets, tableaux, barres de statut

---

## P1 — coordination/page.tsx (Framer Motion)

**Statut** : Complet 165L — partenaires coordinateurs, KPIs, attribution IA  
**Travail** : Ajouter Framer Motion + enrichir avec mini-timeline missions

---

## P1 — equipe/page.tsx (Framer Motion)

**Statut** : Complet 287L — membres équipe, rôles, permissions, invitation  
**Travail** : Ajouter Framer Motion sur cartes membres, modal invitation

---

## P1 — rooming/page.tsx (Framer Motion)

**Statut** : Complet 323L — attribution chambres, sync Eventy, préférences, allergies  
**Travail** : Ajouter Framer Motion sur tableau attribution, glisser-déposer (futur)

---

## P1 — transport/page.tsx (Framer Motion)

**Statut** : Complet 165L — partenaires transport luxe, flotte, analytics transferts  
**Travail** : Ajouter Framer Motion + enrichir avec timeline trajets du jour

---

## P1 — configuration/page.tsx (Framer Motion)

**Statut** : Complet 491L — config chambres, menus, blackout dates, conditions paiement, IBAN  
**Travail** : Ajouter Framer Motion sur accordéons, transitions entre sections

---

## P1 — analytics/page.tsx (RESTYLING complet)

**Statut** : Complet 182L — THÈME VERT ❌ → restyling gold urgent  
**Contenu existant** : CA, clients, notes, saisonnalité, comparaison marché  
**Travail** : Remplacer vert → gold, ajouter Framer Motion, enrichir avec Recharts

### Maquette enrichie

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Analytics                       [Période ▾] [Exporter]     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ CA 2025      │ │ Taux occup.  │ │ Note moy.    │ │ Groupes │ │
│  │ 184 000€     │ │ 78% annuel   │ │ ⭐ 4.8        │ │ 42 accueil│
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  [Recharts LineChart CA mensuel 12 mois]                         │
│  [Recharts BarChart taux occup. par mois]                        │
│  [Recharts PieChart répartition services : héberg/resto/activ]   │
│                                                                   │
│  SAISONNALITÉ · Top mois : Juin-Juillet (92% occup.)            │
│  COMPARAISON MARCHÉ · Votre note 4.8 vs moy. partenaires 4.5   │
└─────────────────────────────────────────────────────────────────┘
```

---

## P2 — documents/page.tsx (À CONSTRUIRE)

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 Documents                                  [Uploader]        │
│  [Contrats] [Classements] [Assurances] [Factures]               │
├─────────────────────────────────────────────────────────────────┤
│  CONTRATS PLATEFORME                                              │
│  📄 Convention HRA Partenaire 2025     ✅ Signé — 01/01/2025   │
│  📄 Grille tarifaire 2025              ✅ Signé — 01/01/2025   │
│                                                                   │
│  DOCUMENTS LÉGAUX ÉTABLISSEMENT                                   │
│  📄 Licence hôtelière                  ✅ Valide               │
│  📄 Classement étoiles                 ✅ 4★ — 2023            │
│  📄 Assurance RC Pro établissement     ✅ Valide — exp. 12/25  │
│  📄 Certificat hygiène / HACCP         ✅ 2025                  │
│  📄 Autorisation d'exploitation        ✅ Valide               │
└─────────────────────────────────────────────────────────────────┘
```

---

## P2 — securite/page.tsx (Framer Motion)

**Statut** : Complet 165L — équipe sécurité, KPIs, partenaires qualité  
**Travail** : Ajouter Framer Motion + enrichir avec incidents récents

---

## À CRÉER : Vue Responsable HRA (portail équipe)

> Route : `frontend/app/(equipe)/equipe/hra/` (existe — stub avec sous-pages listing, négociations, onboarding)

### Maquette responsable

```
┌─────────────────────────────────────────────────────────────────┐
│  🏨 Supervision Maisons HRA          [Export] [+ Onboard]       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Maisons act. │ │ Groupes auj. │ │ Note moy.    │ │ CA mois │ │
│  │ 12 actives   │ │ 28 groupes   │ │ ⭐ 4.7        │ │ 184 000€│ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  CARTE DES MAISONS (vue géographique ou liste)                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🏨 Riad Yasmine — Marrakech · 4.8★ · 3 groupes actifs  │    │
│  │    Taux occup: 87% · CA mois: 34 200€ · [→ Détails]    │    │
│  │ 🏨 Hôtel Atlas — Agadir · 4.6★ · 1 groupe actif         │    │
│  │    Taux occup: 65% · CA mois: 18 400€ · [→ Détails]    │    │
│  │ 🏨 Riad Salam — Fès · 4.9★ · 2 groupes actifs           │    │
│  │    Taux occup: 95% · CA mois: 42 100€ · [→ Détails]    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ALERTES RESPONSABLE                                              │
│  ⚠️ Riad Yasmine — Anomalie déclaration resto 22/04            │ │
│  ⏳ Hôtel Atlas — Contrat en cours de renouvellement             │
│  🔴 Riad Marrakech — Note < 4.0 sur 3 derniers groupes !        │
│     [Plan d'action qualité] [Contacter gérant]                  │
│                                                                   │
│  NÉGOCIATIONS EN COURS (3 partenaires)                           │
│  [Voir tableau négociations →]                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Sous-pages existantes à enrichir** :
- `hra/listing/page.tsx` — liste toutes les maisons avec filtres, statuts, actions
- `hra/negociations/page.tsx` — suivi tarifs, conditions, renouvellements
- `hra/onboarding/page.tsx` — pipeline intégration nouveaux partenaires

---

## À CRÉER : Vue Admin HRA (portail équipe)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Admin — Maisons HRA             [Config] [Permissions]      │
├─────────────────────────────────────────────────────────────────┤
│  REPORTING GLOBAL                                                 │
│  CA HRA 2025 : 1 840 000€   Maisons actives : 12               │
│  Groupes hébergés : 234   Note moy. : 4.7★   Incidents : 8     │
│                                                                   │
│  CONFIGURATION PLATEFORME                                         │
│  ● Grilles tarifaires par destination et catégorie               │
│  ● Critères classement et notation partenaires                   │
│  ● Règles d'attribution groupes → maisons (algo)                │
│  ● Seuils d'alerte (taux occup., notes, incidents)              │
│  ● Accès / suspension / onboarding partenaires                  │
│  ● Templates contrats partenaires                                │
│  ● Exporter base HRA + historique complet                       │
│                                                                   │
│  ANALYTICS GLOBALES                                               │
│  ● Heatmap destinations (groupes par ville)                      │
│  ● Comparatif performance maisons                                │
│  ● Projections CA par destination (6 mois)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## P3 — Pages optionnelles (Phase 2)

### bracelets/page.tsx
**Concept** : Gestion des bracelets NFC/RFID pour accès activités, cashless, tracking  
**Maquette** : Tableau bracelets actifs, scan/activation, incidents, solde cashless, stats

### decoration/page.tsx
**Concept** : Gestion déco thématique de l'établissement pour les groupes (service décoratif optionnel)  
**Maquette** : Catalogue thèmes, devis, timeline installation, photos avant/après

### image-souvenirs/page.tsx
**Concept** : Galerie photos/vidéos groupes, vente tirages, accès voyageurs  
**Maquette** : Upload photos, galerie avec tag groupe, lien partage voyageurs, commandes tirages

---

## Notes d'implémentation

- `'use client'` sur toutes les pages
- Framer Motion : `import { motion, AnimatePresence } from 'framer-motion'`
- Pages déjà complètes (amber) → chercher `#b45309` / `#fcd34d` / `#080c12` et remplacer par or
- Stagger sur listes : `transition={{ delay: index * 0.05 }}`
- Barres de progression (taux occup.) : `useEffect` + `animate` Framer Motion
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Pages P3 sont pour Phase 2 — ne pas coder avant validation produit
