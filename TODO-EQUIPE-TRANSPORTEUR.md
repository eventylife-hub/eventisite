# TODO — Portail Transporteur
> Portail : `frontend/app/(transporteur)/transporteur/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · glassmorphism · Framer Motion  
> Date audit : 2026-04-25

---

## Vision Eventy — PLATEFORME MARKETPLACE

> **Eventy = plateforme d'organisation**, pas un employeur.  
> Le transporteur est un **professionnel indépendant** (auto-entrepreneur, société de transport, loueur de bus…).  
> Eventy lui attribue des missions de transport pour les groupes voyageurs.  
> Ce portail = **son espace de travail sur la marketplace** : voir ses missions, gérer sa flotte, se faire payer.

---

## Modèle organisationnel

| Niveau | Rôle |
|--------|------|
| **Transporteur indépendant** | Réalise les trajets, gère sa flotte, déclare les incidents |
| **Responsable transport** | Supervise les missions, valide les trajets, gère les incidents critiques |
| **Admin** | Config tarifaire, attribution algo, reporting global, permissions |

---

## Résumé des travaux

| Page | Statut actuel | Action requise | Priorité |
|------|---------------|----------------|----------|
| `page.tsx` | Stub (2L) | **À construire** dashboard | P0 |
| `missions/page.tsx` | Stub (2L) | **À construire** | P0 |
| `planning/page.tsx` | Stub (2L) | **À construire** | P0 |
| `trajets/page.tsx` | **COMPLET ✅** (1276L) — gold + Framer Motion | Vérifier cohérence, enrichir | P1 |
| `vehicules/page.tsx` | Stub (2L) | **À construire** | P0 |
| `revenus/page.tsx` | Stub (2L) | **À construire** | P0 |
| `documents/page.tsx` | Stub (2L) | **À construire** | P1 |
| `support/page.tsx` | Stub (3L) | **À construire** | P2 |

> `trajets/page.tsx` est la seule page complète et sert de **référence de style** pour tout le reste.

---

## P0 — page.tsx → Dashboard principal (À CONSTRUIRE)

**Concept** : Hub central du transporteur indépendant — état de la flotte, missions du jour, revenus

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🚌 Bonjour Transport Dupont !      [Disponible ●] [Statut ▾]  │
│  Transporteur partenaire · 4.8★ · 234 trajets réalisés          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Missions auj.│ │ Véhicules OK │ │ Note globale │ │ Revenus │ │
│  │ 3 trajets    │ │ 4 / 5 ✅     │ │ ⭐ 4.8 / 5   │ │ 6 200€  │ │
│  │ 186 passagers│ │ 1 maintenance│ │ 234 trajets  │ │ ce mois │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌─────────────────────────────────┐  ┌────────────────────────┐ │
│  │ MISSIONS DU JOUR                │  │ ALERTES                │ │
│  │                                 │  │ ⚠️ CT Bus #3 expire    │ │
│  │ 🟢 08:15 — Aéroport CDG        │  │   dans 15 jours        │ │
│  │    Paris → Hôtel Marrakech      │  │   [Programmer CT]      │ │
│  │    42 pax · Mercedes Sprinter   │  │                        │ │
│  │    ✅ En cours · +2 min retard  │  │ ✅ Paiement mars reçu  │ │
│  │                                 │  │   6 000€ — 28/03       │ │
│  │ 🟡 14:30 — Transfer hôtel       │  │                        │ │
│  │    Medina → Aéroport            │  │ ⏳ 2 nouvelles missions │ │
│  │    38 pax · Iveco Daily         │  │   proposées → [Voir]   │ │
│  │    ⏳ Prévu — 2h                │  └────────────────────────┘ │
│  │                                 │                             │
│  │ 🟡 19:00 — Accueil groupe Lyon  │  ┌────────────────────────┐ │
│  │    Aéroport → Riad              │  │ FLOTTE RAPIDE          │ │
│  │    106 pax · 2 bus              │  │ 🚌 Bus 1 — En service  │ │
│  │    ⏳ Prévu — 4h                │  │ 🚌 Bus 2 — En service  │ │
│  └─────────────────────────────────┘  │ 🚌 Bus 3 — En service  │ │
│                                       │ 🚐 Van — Disponible    │ │
│                                       │ ⚙️ Bus 5 — Maintenance │ │
│                                       └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**KPIs** : missions jour, véhicules opérationnels, note globale, revenus mois  
**Sections** : timeline missions du jour (statut temps réel), alertes (CT/assurance), flotte rapide  
**Framer Motion** : stagger KPIs, pulse sur alertes urgentes, hover missions

---

## P0 — missions/page.tsx (À CONSTRUIRE)

**Concept** : Catalogue de toutes les missions attribuées — en cours, à venir, historique

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 Mes Missions                 [Filtrer] [Mois ▾] [Exporter] │
│  [En cours] [À venir] [Proposées] [Terminées] [Annulées]        │
│  Trier par : [Date ▾] [Destination] [Nb pax] [Montant]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EN COURS (1)                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🟢 MISSION #TRP-2025-089                     [Détails →] │    │
│  │ 25 Avril · Aéroport CDG → Marrakech          EN COURS   │    │
│  │ 42 passagers · Mercedes Sprinter · 2h30 trajet           │    │
│  │ Contact groupe : Sophie M. (+33 6 12 34 56 78)           │    │
│  │ Montant : 380€ · Paiement : fin de mois                  │    │
│  │ [Signaler incident] [Voir passagers] [Navigation GPS]    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  PROPOSÉES — ACCEPTER AVANT 26/04 18:00 (2)                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🔵 PROPOSITION #TRP-2025-094                              │    │
│  │ 28 Avril · Paris CDG → Barcelone · 85 pax                │    │
│  │ Véhicule requis : Grand tourisme ≥ 85 places             │    │
│  │ Montant proposé : 740€              [Accepter] [Refuser] │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  À VENIR (4)                                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 2 Mai · Marrakech Aérop. → Ibiza · 106 pax · 2 bus      │    │
│  │ 5 Mai · Transfer hôtel Barcelone · 52 pax · 1 bus        │    │
│  │ 8 Mai · CDG → Amsterdam · 72 pax · 1 bus grand tourisme  │    │
│  │ [3 autres missions →]                                     │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Actions** : accepter/refuser proposition, signaler incident, voir liste passagers, GPS  
**Framer Motion** : AnimatePresence sur filtres, layout animation sur tri, stagger liste

---

## P0 — planning/page.tsx (À CONSTRUIRE)

**Concept** : Vue calendrier des missions + disponibilités du transporteur

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Planning · Mai 2025          [◀ Avril] [Mai ▾] [Juin ▶]    │
│                         [Vue Mois] [Vue Semaine] [+ Indispo]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Lun    Mar    Mer    Jeu    Ven    Sam    Dim                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │    │ │    │ │    │ │  1 │ │  2 │ │🚌3 │ │  4 │              │
│  │    │ │    │ │    │ │    │ │    │ │MAR │ │    │              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │  5 │ │🚌6 │ │  7 │ │🚌8 │ │  9 │ │ 10 │ │ 11 │              │
│  │    │ │BCN │ │    │ │AMS │ │    │ │    │ │    │              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘              │
│                                                                   │
│  LÉGENDE :  🚌 Mission confirmée  🔴 Indisponible               │
│             🔵 Mission proposée   ⚙️ Véhicule en maintenance     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ DÉTAIL — Sam 3 mai (click)                                  │ │
│  │ 🚌 Transfer Marrakech Aérop. → Ibiza                        │ │
│  │ 106 passagers · 2 bus (Grand tourisme + Minibus)            │ │
│  │ Départ : 09:00 · Arrivée estimée : 14:30                    │ │
│  │ Contact Eventy : +33 1 23 45 67 89 · Code mission : TRP-092 │ │
│  │ [Voir mission complète] [Navigation] [Passagers]            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [Bloquer une période] — ex: congés, maintenance longue durée    │
└─────────────────────────────────────────────────────────────────┘
```

**Types d'events** : mission confirmée, mission proposée, indisponibilité, maintenance  
**Framer Motion** : slide calendrier gauche/droite, fade détail drawer

---

## P0 — vehicules/page.tsx (À CONSTRUIRE)

**Concept** : Gestion de la flotte — état, maintenance, documents, capacités

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🚌 Ma Flotte                     [+ Ajouter véhicule]          │
│  5 véhicules · 4 opérationnels · 1 en maintenance               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🚌 MERCEDES TOURISMO · AB-123-CD          ● OPÉRATIONNEL │    │
│  │ Grand tourisme · 55 places · 2018 · 187 000 km           │    │
│  │                                                           │    │
│  │ Kilométrage  ████████████░░  187 000 / 220 000 km         │    │
│  │ Carburant    ██████████░░░░  75% · Diesel                 │    │
│  │                                                           │    │
│  │ ┌─────────────────────┐  ┌────────────────────────────┐  │    │
│  │ │ DOCUMENTS           │  │ PROCHAINE MAINTENANCE      │  │    │
│  │ │ ✅ CT valide 08/26   │  │ Révision : dans 13 000 km  │  │    │
│  │ │ ✅ Assurance 12/25   │  │ CT prochain : Août 2026    │  │    │
│  │ │ ✅ Taxe 2025         │  │ Pneus : ✅ Bonne usure      │  │    │
│  │ └─────────────────────┘  └────────────────────────────┘  │    │
│  │                          [Modifier] [Voir historique]     │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ 🚐 FORD TRANSIT · EF-456-GH               ● OPÉRATIONNEL │    │
│  │ Minibus · 19 places · 2020 · 94 000 km                   │    │
│  │ ⚠️ Assurance expire dans 22 jours !       [Renouveler]   │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ ⚙️ BUS IVECO DAILY · IJ-789-KL         🔴 MAINTENANCE    │    │
│  │ Minibus · 22 places · 2019 · 143 000 km                   │    │
│  │ En révision depuis 24/04 · Retour estimé : 27/04          │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Champs** : marque/modèle, immatriculation, capacité, km, carburant, CT, assurance, taxe  
**Alertes auto** : CT < 30 jours, assurance < 30 jours, révision < 5000 km  
**Framer Motion** : barres km/carburant animées à l'entrée, hover cards, pulse alertes

---

## P0 — revenus/page.tsx (À CONSTRUIRE)

**Concept** : Dashboard financier transporteur — modèle 18% brut sur marge Eventy

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Mes Revenus                     [Avril 2025 ▾] [Exporter]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Avril 2025   │ │ En attente   │ │ Année 2025   │ │ Moyen   │ │
│  │ 6 200 €      │ │ 1 480 €      │ │ 28 400 €     │ │ par traj│ │
│  │ +8% vs mars  │ │ 4 trajets    │ │ 234 trajets  │ │ 121 €   │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌──────────────────────────────────┐  ┌─────────────────────┐   │
│  │ ÉVOLUTION 6 MOIS (Recharts Bar)  │  │ PAR TYPE TRAJET     │   │
│  │                                  │  │ Transfert aérop. 52%│   │
│  │  Nov  Déc  Jan  Fév  Mar  Avr    │  │ Transport groupe 35%│   │
│  │  ███  ██   ████ ███  ████ █████  │  │ Transfer inter  13% │   │
│  └──────────────────────────────────┘  └─────────────────────┘   │
│                                                                   │
│  DÉTAIL DES PAIEMENTS                                             │
│  ┌──────┬───────────────────────┬─────────┬───────┬────────────┐  │
│  │ Date │ Mission               │ Brut    │ 18%   │ Statut     │  │
│  ├──────┼───────────────────────┼─────────┼───────┼────────────┤  │
│  │ 30/04│ CDG → Marrakech ×42  │ 380 €   │ 68 €  │ ✅ Payé    │  │
│  │ 30/04│ Transfer hôtel Marr. │ 120 €   │ 22 €  │ ✅ Payé    │  │
│  │ 30/04│ Marrakech → CDG ×38  │ 340 €   │ 61 €  │ ⏳ En cours│  │
│  │ 15/05│ CDG → Barcelone ×85  │ 740 €   │133 €  │ ⏳ À venir │  │
│  └──────┴───────────────────────┴─────────┴───────┴────────────┘  │
│                                                                   │
│  ℹ️  Rémunération : 18% de la marge Eventy sur chaque mission    │
│     Paiement : virement mensuel le dernier jour du mois          │
└─────────────────────────────────────────────────────────────────┘
```

**Note** : Modèle 82/18 — 18% = part brut transporteur sur marge Eventy  
**Chart** : Recharts BarChart 6 mois + PieChart par type de trajet  

---

## P1 — documents/page.tsx (À CONSTRUIRE)

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 Documents                                  [Uploader]        │
│  [Contrats] [Véhicules] [Assurances] [Facturation]              │
├─────────────────────────────────────────────────────────────────┤
│  CONTRATS PLATEFORME                                              │
│  📄 Convention transporteur Eventy 2025    ✅ Signé — 01/01     │
│                                                                   │
│  DOCUMENTS VÉHICULES (par véhicule)                               │
│  📄 CT Bus AB-123-CD         ✅ Valide — exp. 08/2026           │
│  📄 Assurance Bus AB-123-CD  ✅ Valide — exp. 12/2025           │
│  📄 Carte grise AB-123-CD    ✅ À jour                          │
│  📄 CT Van EF-456-GH         ⚠️ Expire dans 22 jours !         │
│                                                                   │
│  DOCUMENTS TRANSPORTEUR                                           │
│  📄 Kbis / Registre transport  ✅ Valide                        │
│  📄 Licence transport voyageurs ✅ Valide — exp. 06/2026        │
│  📄 Attestation RC Pro         ✅ Valide — exp. 12/2025         │
└─────────────────────────────────────────────────────────────────┘
```

---

## À CRÉER : Vue Responsable Transport (portail équipe)

> Route existante : `frontend/app/(equipe)/equipe/transport/` — stub 137L thème orange → **À enrichir**

### Maquette responsable

```
┌─────────────────────────────────────────────────────────────────┐
│  🚌 Supervision Transport            [Export] [+ Attribuer]     │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ Transporteurs│ │ Missions j.│ │ Incidents  │ │ CA mois      │ │
│  │ 6 actifs   │ │ 18 trajets │ │ 1 en cours │ │ 28 400€      │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
│                                                                   │
│  MISSIONS AUJOURD'HUI (tous transporteurs)                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Transport Dupont — CDG → Marrakech · 42 pax · 🟢 En cours│    │
│  │ Transports Martin — Barcelone → Ibiza · 85 pax · ✅ Livré│    │
│  │ Bus Leroy — Transfer Riad · 38 pax · ⏳ Départ dans 2h   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  MISSIONS NON ATTRIBUÉES (2)                                      │
│  ⚠️ 28/04 CDG → Barcelone · 85 pax · Aucun transporteur !        │
│     [Attribuer manuellement] [Envoyer aux disponibles]           │
│                                                                   │
│  INCIDENTS ACTIFS                                                 │
│  🔴 Transport Dupont — Bus en retard 45 min (23/04) · [Traiter]  │
└─────────────────────────────────────────────────────────────────┘
```

**Actions** : attribuer mission, contacter transporteur, traiter incidents, reporting

---

## À CRÉER : Vue Admin Transport (portail équipe)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Admin — Transport               [Config] [Permissions]      │
├─────────────────────────────────────────────────────────────────┤
│  REPORTING GLOBAL                                                 │
│  CA transport 2025 : 284 000€   Transporteurs actifs : 6        │
│  Trajets réalisés : 234   Incidents : 4 (3 résolus)             │
│  Part brut (18%) versée : 51 120€                                │
│                                                                   │
│  CONFIGURATION MÉTIER                                             │
│  ● Grille tarifaire transport (€/pax/km, types véhicules)        │
│  ● Règles d'attribution automatique (proximité, capacité, note) │
│  ● Paramétrer alertes retard (seuil déclenchement SMS)          │
│  ● Accès/suspension transporteurs                                │
│  ● Exporter base transporteurs + historique missions             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Notes d'implémentation

- Page de référence style : `trajets/page.tsx` (1276L) — déjà gold + Framer Motion ✅
- Copier la palette de `trajets/page.tsx` pour toutes les nouvelles pages
- `'use client'` sur toutes les pages
- Framer Motion : stagger listes, animate barres flotte, hover cards
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Modèle 82/18 : 18% = part brut transporteur sur marge Eventy
- trajets/page.tsx ne nécessite que vérification + éventuels petits enrichissements
