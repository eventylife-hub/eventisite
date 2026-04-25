# TODO — Portails Métiers HRA Terrain
> Portails : `(decorateur)/` · `(fleuriste)/` · `(traiteur)/` + Staff HRA (serveurs, réceptionnistes, femmes de chambre)  
> Hub générique : `frontend/app/(employes)/employes/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · mobile-first · Framer Motion  
> Date audit : 2026-04-25

---

## Positionnement — Qui sont ces métiers terrain ?

> Tous ces professionnels sont **embauchés par la Maison HRA** (hôtel/riad/resort), pas par Eventy.  
> La Maison HRA elle-même est un **partenaire indépendant** d'Eventy.  
> Eventy leur fournit une interface légère pour recevoir les briefs, pointer, signaler.

| Métier | Qui les emploie | Responsable direct |
|--------|-----------------|-------------------|
| Serveur / Réceptionniste / Femme de chambre | La Maison HRA | Gérant de la maison |
| Décorateur | La Maison HRA ou le Créateur | Gérant ou Créateur |
| Fleuriste | La Maison HRA | Gérant de la maison |
| Traiteur | La Maison HRA ou indépendant | Gérant ou Créateur |

---

## PARTIE 1 — Staff HRA Générique (serveurs, réceptionnistes, femmes de chambre)

> Pas de portail dédié actuellement — géré via `(employes)/employes/`  
> Interface ULTRA-légère : 3 écrans max

### Concept : Interface minimaliste d'équipe HRA

```
3 fonctions essentielles :
1. Voir MON planning du jour (chambres à faire, services à assurer)
2. Pointer ma présence + check-in de service
3. Signaler un problème
```

### Pages à créer dans `(employes)/employes/`

| Page | À créer | Priorité |
|------|---------|----------|
| `dashboard/page.tsx` | Hub général tous métiers | P0 |
| `planning/page.tsx` | Planning du jour personnalisé | P0 |
| `missions/page.tsx` | Mes tâches du jour | P0 |
| `profil/page.tsx` | Mon profil employé | P1 |

### Maquette — Dashboard employé HRA

```
📱
┌──────────────────────────────────────┐
│  Bonjour Fatima !      Sam 3 mai     │
│  Femme de chambre · Riad Yasmine     │
├──────────────────────────────────────┤
│                                      │
│  MON PLANNING AUJOURD'HUI            │
│  ┌──────────────────────────────┐    │
│  │ 🛏️ CHAMBRES À PRÉPARER (8h)  │    │
│  │ ● Ch. 12 — Départ / arrivée  │    │
│  │ ● Ch. 13 — Recouche seule    │    │
│  │ ● Ch. 14 — Départ (check-out)│    │
│  │ ● Ch. 15, 16, 17 — Recouche  │    │
│  │ ● Ch. 22-31 — Arrivée groupe │    │
│  └──────────────────────────────┘    │
│                                      │
│  ALERTES                             │
│  ⚠️ Ch. 12 — PMR → draps spéciaux   │
│  ⚠️ Ch. 22-31 — Arrivée groupe 14h  │
│     Toutes prêtes avant 13h30 !      │
│                                      │
│  [✅ Pointer présence]               │
│  [⚠️ Signaler problème]             │
│  [💬 Contacter responsable]          │
└──────────────────────────────────────┘
```

---

### Maquette — Dashboard réceptionniste HRA

```
📱
┌──────────────────────────────────────┐
│  Bonjour Ahmed !       Sam 3 mai     │
│  Réception · Riad Yasmine · 8h-20h   │
├──────────────────────────────────────┤
│                                      │
│  ARRIVÉES AUJOURD'HUI                │
│  ✅ 10:00 — Groupe Marseille (38 pax)│
│     Chambres : 12-19, 22-31          │
│     Accompagnateur : Thomas M.       │
│  🟡 14:00 — Groupe Lyon (85 pax)    │
│     Chambres : 101-148 (toutes)      │
│     Accompagnateur : Sarah L.        │
│                                      │
│  DÉPARTS AUJOURD'HUI                 │
│  ✅ 11:00 — Groupe Bordeaux (42 pax) │
│     Bagagerie jusqu'à 12h            │
│                                      │
│  CHECK-IN DEMANDES SPÉCIALES         │
│  ⚠️ Groupe Lyon : ch. PMR × 2       │
│  ⚠️ Groupe Lyon : allergie noix × 4  │
│     (info restaurant transmise ✅)   │
│                                      │
│  [⚠️ Signaler] [💬 Responsable]     │
└──────────────────────────────────────┘
```

---

## PARTIE 2 — Portail Décorateur

> Portal : `frontend/app/(decorateur)/decorateur/`  
> Hub générique : `frontend/app/(employes)/employes/decorateur/dashboard/`

### Résumé travaux

| Page | Statut | Action | Priorité |
|------|--------|--------|----------|
| `page.tsx` | Stub (8L) | Redirect propre | — |
| `dashboard/page.tsx` | Stub | **À construire** | P0 |
| `prestations/page.tsx` | Stub | **À construire** | P0 |
| `moodboards/page.tsx` | Stub | **À construire** | P0 |
| `logistique/page.tsx` | Stub | **À construire** | P1 |
| `stock/page.tsx` | Stub | **À construire** | P1 |
| `photos/page.tsx` | Stub | **À construire** | P1 |
| `facturation/page.tsx` | Stub | **À construire** | P1 |
| `compte/page.tsx` | Stub | **À construire** | P2 |
| `login/page.tsx` | Stub | **À construire** | P0 |

### Maquette — Dashboard décorateur

```
📱
┌──────────────────────────────────────┐
│  Bonjour Nadia !       Ven 2 mai     │
│  Décoratrice · Marrakech & Région    │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ MISSION EN COURS               │  │
│  │ 🌸 Soirée Orientale · Riad Sal.│  │
│  │ Montage : 14:00-18:00          │  │
│  │ Démontage : 23:30-01:00        │  │
│  │ Thème : Nuit des mille et une  │  │
│  │ [Voir moodboard] [Checklist]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  AUJOURD'HUI                         │
│  ✅ 08:00 Livraison matériel          │
│  🔵 14:00 Montage EN COURS           │
│  🟡 18:30 Validation créateur        │
│  🟡 23:30 Démontage                  │
│                                      │
│  MATÉRIEL SORTI DU STOCK             │
│  ● 50 lanternes marocaines ✅        │
│  ● 20 candélabres cuivre ✅          │
│  ● 200m tissu décoratif ✅            │
│  [Voir inventaire complet]           │
└──────────────────────────────────────┘
```

### Maquette — moodboards/page.tsx

```
📱
┌──────────────────────────────────────┐
│  ← Moodboards & Thèmes               │
│  [Tous] [Orientaux] [Modernes] [Féeriques]│
├──────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────┐     │
│  │ 🌙 Nuit des 1001 nuits       │     │
│  │ [Moodboard Photo]            │     │
│  │ 5 fois réalisé · ⭐ 4.9      │     │
│  │ Matériel : voir inventaire   │     │
│  │ [Voir + proposer créateur]   │     │
│  └─────────────────────────────┘     │
│  ┌─────────────────────────────┐     │
│  │ 🌸 Soirée Rose Florale       │     │
│  │ [Moodboard Photo]            │     │
│  │ 3 fois réalisé · ⭐ 5.0      │     │
│  │ [Voir + proposer]            │     │
│  └─────────────────────────────┘     │
│                                      │
│  [+ Créer nouveau thème]             │
└──────────────────────────────────────┘
```

---

## PARTIE 3 — Portail Fleuriste

> Portal : `frontend/app/(fleuriste)/fleuriste/`

### Résumé travaux

| Page | Statut | Action | Priorité |
|------|--------|--------|----------|
| `dashboard/page.tsx` | Stub | **À construire** | P0 |
| `commandes/page.tsx` | Stub | **À construire** | P0 |
| `compositions/page.tsx` | Stub | **À construire** | P0 |
| `planning/page.tsx` | Stub | **À construire** | P0 |
| `approvisionnement/page.tsx` | Stub | **À construire** | P1 |
| `galerie/page.tsx` | Stub | **À construire** | P1 |
| `facturation/page.tsx` | Stub | **À construire** | P1 |
| `compte/page.tsx` | Stub | **À construire** | P2 |
| `login/page.tsx` | Stub | **À construire** | P0 |

### Maquette — Dashboard fleuriste

```
📱
┌──────────────────────────────────────┐
│  Bonjour Aicha !       Sam 3 mai     │
│  Fleuriste · Marrakech               │
├──────────────────────────────────────┤
│                                      │
│  COMMANDES DU JOUR (3)               │
│  ┌──────────────────────────────┐    │
│  │ 🌹 Soirée Orientale          │    │
│  │ Riad Yasmine · Livraison 17h │    │
│  │ 12 centres de table roses    │    │
│  │ 50 bouquets déco orientaux   │    │
│  │ Statut : 🔵 En préparation   │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 🌸 Décoration suite VIP      │    │
│  │ Riad Yasmine · Livraison 14h │    │
│  │ 1 composition pétales lit    │    │
│  │ Statut : ✅ Livré 13:45      │    │
│  └──────────────────────────────┘    │
│                                      │
│  STOCK ALERTE                        │
│  ⚠️ Roses rouges : 30 restantes      │
│     Commander avant 18h demain       │
│  [⚠️ Signaler] [📞 Responsable]     │
└──────────────────────────────────────┘
```

### Maquette — compositions/page.tsx

```
📱
┌──────────────────────────────────────┐
│  ← Mes Compositions                  │
│  Catalogue de mes créations          │
├──────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────┐     │
│  │ 🌹 Centre de table oriental  │     │
│  │ [Photo composition]          │     │
│  │ Prix : 45€ / unité           │     │
│  │ Délai : 2h de préparation    │     │
│  │ 28 fois réalisé · ⭐ 4.9     │     │
│  │ [Modifier] [Proposer]        │     │
│  └─────────────────────────────┘     │
│                                      │
│  [+ Nouvelle composition]            │
│  Photo · Nom · Prix · Délai          │
└──────────────────────────────────────┘
```

---

## PARTIE 4 — Portail Traiteur

> Portal : `frontend/app/(traiteur)/traiteur/`  
> Hub générique : `frontend/app/(employes)/employes/traiteur/dashboard/`

### Résumé travaux

| Page | Statut | Action | Priorité |
|------|--------|--------|----------|
| `dashboard/page.tsx` | Stub | **À construire** | P0 |
| `prestations/page.tsx` | Stub | **À construire** | P0 |
| `menus/page.tsx` | Stub | **À construire** | P0 |
| `logistique/page.tsx` | Stub | **À construire** | P1 |
| `materiel/page.tsx` | Stub | **À construire** | P1 |
| `equipe/page.tsx` | Stub | **À construire** | P1 |
| `facturation/page.tsx` | Stub | **À construire** | P1 |
| `compte/page.tsx` | Stub | **À construire** | P2 |
| `login/page.tsx` | Stub | **À construire** | P0 |

### Maquette — Dashboard traiteur

```
📱
┌──────────────────────────────────────┐
│  Bonjour Rachid Traiteur !  Dim 4 mai│
│  Traiteur · Marrakech                │
├──────────────────────────────────────┤
│                                      │
│  PRESTATION DU JOUR                  │
│  ┌──────────────────────────────┐    │
│  │ 🍽️ Dîner Gala Orientale      │    │
│  │ Riad Yasmine · 85 pax · 19:30│    │
│  │ Menu : Méchoui + Couscous    │    │
│  │ Montage buffet : 17:00-19:00 │    │
│  │                              │    │
│  │ ⚠️ Allergènes :              │    │
│  │ - 4 sans gluten              │    │
│  │ - 2 végétariens              │    │
│  │ - 1 halal strict             │    │
│  │ [Voir liste complète]        │    │
│  └──────────────────────────────┘    │
│                                      │
│  MON ÉQUIPE DU SOIR (4 personnes)    │
│  ● Omar — Service                    │
│  ● Karim — Service                   │
│  ● Samira — Cuisine/chaud            │
│  ● Nadia — Pâtisseries               │
│                                      │
│  [✅ Pointer équipe] [⚠️ Signaler]   │
└──────────────────────────────────────┘
```

---

## Portail `(employes)` — Hub central

> `frontend/app/(employes)/employes/`  
> Sert de **point d'entrée unique** pour TOUS les types d'employés terrain.  
> Après login, redirige vers le dashboard de son type de poste.

### Architecture flow

```
Login /employes/login
    ↓
Auth → détecte le rôle
    ↓
Redirige vers :
  accompagnateur → /employes/accompagnateur/dashboard
  chauffeur      → /employes/chauffeur/dashboard
  guide          → /employes/guide/dashboard
  photographe    → /employes/photographe/dashboard
  decorateur     → /employes/decorateur/dashboard
  fleuriste      → /employes/fleuriste/dashboard
  traiteur       → /employes/traiteur/dashboard
  securite       → /employes/securite/dashboard
  animateur      → /employes/animateur/dashboard
  coordinateur   → /employes/coordinateur/dashboard
```

### Pages hub à enrichir

| Page | Statut | Action |
|------|--------|--------|
| `login/page.tsx` | Stub | **À construire** — login universel |
| `dashboard/page.tsx` | Stub | Redirect selon rôle |
| `planning/page.tsx` | Stub | Planning partagé |
| `missions/page.tsx` | Stub | Mes missions (tous types) |
| `formation/page.tsx` | Stub | Formation Eventy |
| `profil/page.tsx` | Stub | Profil employé |

### Maquette — Login universel employé terrain

```
📱
┌──────────────────────────────────────┐
│  🌟 Eventy Terrain                   │
│  Interface équipe                    │
├──────────────────────────────────────┤
│                                      │
│  Email professionnel                 │
│  [________________________________]  │
│                                      │
│  Code PIN 4 chiffres                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │  │ │  │ │  │ │  │               │
│  └──┘ └──┘ └──┘ └──┘               │
│                                      │
│  [Connexion →]                       │
│                                      │
│  Pas de compte ?                     │
│  Contactez votre responsable         │
└──────────────────────────────────────┘
```

---

## Notes d'implémentation communes

- `'use client'` · Framer Motion · Dark gold `#D4A853`
- Bottom nav fixed 4-5 onglets (pas plus)
- Design ULTRA-simple → ouvriers de terrain, pas des techniciens
- Pointer présence → un seul bouton, animation confetti
- Signaler incident → 3 taps max (type + gravité + message court)
- Données voyageurs limitées : nom + chambre + contraintes médicales uniquement
- Pas d'accès aux tarifs, marges ou données commerciales Eventy
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
