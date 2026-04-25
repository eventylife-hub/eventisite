# TODO — Portail Chauffeur Local (employé terrain)
> Portal : `frontend/app/(chauffeur)/chauffeur/`  
> Hub générique : `frontend/app/(employes)/employes/chauffeur/dashboard/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · mobile-first · Framer Motion  
> Date audit : 2026-04-25

---

## Positionnement — Qui est le chauffeur local ?

> ⚠️ **Distinction critique** :
> - **Transporteur indépendant** = le patron (son propre business, portail `/transporteur/`)
> - **Chauffeur local** = l'employé **embauché par le transporteur** (ou par le créateur)
>
> Ce portail est pour le chauffeur terrain qui **conduit** mais n'est pas propriétaire du bus.  
> Son responsable = le transporteur indépendant (ou le créateur selon le voyage).

**Rôle** : Conduit le groupe entre aéroport, hôtel, activités, restaurants.  
**Mission** : Respecter l'itinéraire, être ponctuel, signaler tout incident véhicule/route.  
**Accès** : Ses trajets du jour uniquement. Pas de données commerciales.

---

## Principes UI — Interface Légère Mobile-First

```
✅ Optimisé pour consultation rapide au volant (à l'arrêt)
✅ Navigation bottom bar simple
✅ Info trajet en gros (lisible d'un coup d'œil)
✅ Bouton d'urgence accessible en 1 tap
✅ Navigation GPS en 1 tap (ouvre Google Maps / Waze)
❌ Pas de données financières complexes
❌ Pas de tableaux longs
```

---

## Architecture Navigation

```
Bottom Nav :
[🏠 Aujourd'hui] [🗺️ Mes Trajets] [👥 Passagers] [⚠️ Signaler] [👤 Profil]
```

---

## Résumé des travaux

| Page | Statut | Action | Priorité |
|------|--------|--------|----------|
| `page.tsx` | Stub (3L) redirect | Garder | — |
| `dashboard/page.tsx` | Stub (?) | **À construire** — vue du jour | P0 |
| `trajets/page.tsx` | Stub (?) | **À construire** — mes trajets | P0 |
| `passagers/page.tsx` | Stub (?) | **À construire** — liste passagers | P0 |
| `incidents/page.tsx` | Stub (?) | **À construire** — signalement | P0 |
| `vehicule/page.tsx` | Stub (?) | **À construire** — état véhicule | P1 |
| `frais/page.tsx` | Stub (?) | **À construire** — notes de frais | P1 |
| `facturation/page.tsx` | Stub (?) | **À construire** — mes paiements | P1 |
| `compte/page.tsx` | Stub (?) | **À construire** — mon profil | P2 |
| `login/page.tsx` | Stub (?) | **À construire** — connexion | P0 |

---

## P0 — login/page.tsx

Email + code PIN 4 chiffres, même structure que accompagnateur/login.

---

## P0 — dashboard/page.tsx — Vue du jour

**Concept** : Tout ce que le chauffeur doit savoir pour sa journée, d'un seul regard

```
📱
┌──────────────────────────────────────┐
│  Bonjour Rachid !     Sam 3 mai      │
│  Chauffeur · Transport Dupont        │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ MAINTENANT                     │  │
│  │ 🚌 08:15 — Aéroport CDG        │  │
│  │ Arrivée groupe Paris · 62 pax  │  │
│  │ Terminal 2E · Porte B32        │  │
│  │ Bus AB-123-CD · 55 places      │  │
│  │                                │  │
│  │ [📍 GPS → CDG Terminal 2E]     │  │
│  │ [📞 Accompagnateur Thomas]     │  │
│  └────────────────────────────────┘  │
│                                      │
│  AUJOURD'HUI — 3 trajets             │
│  ✅ 06:00 Dépôt → CDG (vide) Fait    │
│  🔵 08:15 CDG → Riad Yasmine En cours│
│  🟡 14:30 Riad → Palmeraie  Dans 6h  │
│  🟡 19:00 Palmeraie → Riad  Dans 11h │
│                                      │
│  🚨 [Signaler urgence]  📞 [Patron]  │
└──────────────────────────────────────┘

Bottom Nav : [🏠●] [🗺️] [👥] [⚠️] [👤]
```

**Données affichées** : trajet en cours (gros plan), timeline jour, bouton GPS direct, contact responsable  
**Framer Motion** : pulse sur trajet en cours, slide in sections

---

## P0 — trajets/page.tsx — Mes trajets

**Concept** : Détail de tous les trajets assignés — aujourd'hui et à venir

```
📱
┌──────────────────────────────────────┐
│  ← Mes Trajets          [Aujourd'hui]│
│  3 trajets · 186 passagers total     │
├──────────────────────────────────────┤
│                                      │
│  SAM 3 MAI 2025                      │
│  ┌──────────────────────────────┐    │
│  │ ✅ 06:00 — Trajet à vide     │    │
│  │ Dépôt → Aéroport CDG         │    │
│  │ 45 min · Terminé 06:42       │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 🔵 08:15 — EN COURS          │    │
│  │ CDG T2E → Riad Yasmine Marr. │    │
│  │ 62 passagers · Bus AB-123-CD │    │
│  │ Durée : 3h30 · ETA : 11:45   │    │
│  │ [📍 GPS] [👥 Passagers] [⚠️] │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 🟡 14:30 — À venir           │    │
│  │ Riad Yasmine → Palmeraie     │    │
│  │ 52 passagers · Bus AB-123-CD │    │
│  │ Durée : 30 min               │    │
│  │ [📍 GPS] [Voir itinéraire]   │    │
│  └──────────────────────────────┘    │
│                                      │
│  ─── DEMAIN DIM 4 MAI ───            │
│  🟡 09:00 Riad → Atlas (62 pax)     │
│  🟡 18:00 Atlas → Riad (62 pax)     │
└──────────────────────────────────────┘
```

**Actions** : ouvrir GPS (Google Maps/Waze), voir liste passagers, signaler incident, marquer arrivé  
**Framer Motion** : highlight trajet en cours, stagger liste

---

## P0 — passagers/page.tsx — Liste passagers

**Concept** : Manifeste du trajet en cours — qui est dans mon bus

```
📱
┌──────────────────────────────────────┐
│  ← Passagers · CDG → Riad Yasmine   │
│  62 / 62 embarqués ✅               │
├──────────────────────────────────────┤
│  🔍 Rechercher...                    │
│  [Tous ✓] [PMR ♿] [Allergies ⚠️]    │
├──────────────────────────────────────┤
│                                      │
│  ⚠️ ATTENTION — 2 PMR à bord        │
│  Assistance embarquement requise    │
│                                      │
│  👤 Martin Sophie      Rangée 1-A   │
│  ⚠️ Allergie noix     Groupe Paris  │
│                                      │
│  👤 Dupont Jean ♿      Rangée 1-B   │
│  Fauteuil roulant    Groupe Paris   │
│                                      │
│  👤 Bernard Hélène     Rangée 2-A   │
│  ✅ RAS                Groupe Paris  │
│                                      │
│  [50 autres passagers →]             │
│                                      │
│  [📋 Rapport embarquement]           │
│  [⚠️ Signaler manquant]             │
└──────────────────────────────────────┘
```

**Données visibles** : nom, contraintes (PMR, allergies), placement  
**Pas visible** : données de paiement, adresses, numéros complets  
**Framer Motion** : highlight PMR/allergies en haut

---

## P0 — incidents/page.tsx — Signaler un incident

**Concept** : Signalement rapide — accident, panne, retard, problème avec passager

```
📱
┌──────────────────────────────────────┐
│  ← Signaler un incident               │
│  Trajet CDG → Riad Yasmine           │
├──────────────────────────────────────┤
│                                      │
│  Type d'incident                     │
│  ┌──────────┐ ┌──────────┐           │
│  │ 🚧 Retard│ │ 🔧 Panne │           │
│  └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐           │
│  │ 🚑 Médic.│ │ 👥 Conflit│          │
│  └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐           │
│  │ 🚗 Accid.│ │ 🔒 Autre │           │
│  └──────────┘ └──────────┘           │
│                                      │
│  Retard estimé (si applicable)        │
│  ○ 5-15 min  ● 15-30 min  ○ +30 min  │
│                                      │
│  Description                         │
│  [________________________________]  │
│                                      │
│  📍 Ma position actuelle [Inclure]   │
│  📷 Photo (optionnel)                │
│                                      │
│  [🚨 Envoyer au responsable]         │
│                                      │
│  ─── URGENCE ABSOLUE ───             │
│  [📞 Appel direct 15/112/Patron]     │
└──────────────────────────────────────┘
```

**Types** : retard, panne, accident, incident médical, conflit passager, autre  
**Envoi** : notif push immédiate au transporteur patron + accompagnateur  
**Framer Motion** : shake bouton urgence, animation envoi

---

## P1 — vehicule/page.tsx — État véhicule

**Concept** : Fiche rapide du véhicule assigné + checklist avant départ

```
📱
┌──────────────────────────────────────┐
│  ← Mon Véhicule                      │
│  Bus Mercedes AB-123-CD              │
├──────────────────────────────────────┤
│  55 places · Grand tourisme · 2018   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ CHECKLIST AVANT DÉPART       │    │
│  │ ○ Niveau carburant           │    │
│  │ ● Pneus vérifiés             │    │
│  │ ○ Climatisation fonc.        │    │
│  │ ○ Trousse premiers secours   │    │
│  │ ○ Extincteur en place        │    │
│  │ ○ Documents bord (CT, assu.) │    │
│  │                              │    │
│  │ [Valider checklist]          │    │
│  └──────────────────────────────┘    │
│                                      │
│  DOCUMENTS (info seulement)          │
│  CT : valide — exp. 08/2026          │
│  Assurance : valide — exp. 12/2025   │
│                                      │
│  [⚠️ Signaler problème véhicule]     │
└──────────────────────────────────────┘
```

---

## P1 — frais/page.tsx — Notes de frais

**Concept** : Déclarer les frais engagés (péages, parking, carburant urgent)

```
📱
┌──────────────────────────────────────┐
│  ← Notes de frais         [+ Ajouter]│
│  Avril 2025 · 3 déclarations         │
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │ ⛽ Carburant · 24/04         │    │
│  │ 65€ · Station A6 Km 312     │    │
│  │ 📷 Reçu joint ✅              │    │
│  │ Statut : ✅ Approuvé patron  │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 🅿️ Parking aéroport · 25/04  │    │
│  │ 18€ · CDG P3                 │    │
│  │ 📷 Reçu joint ✅              │    │
│  │ Statut : ⏳ En attente       │    │
│  └──────────────────────────────┘    │
│                                      │
│  [+ Ajouter une dépense]             │
│  Type · Montant · Photo reçu        │
└──────────────────────────────────────┘
```

---

## P1 — facturation/page.tsx — Mes paiements

**Concept** : Vue simple de ses paiements reçus du transporteur patron

```
📱
┌──────────────────────────────────────┐
│  ← Mes Paiements                     │
│  Versés par : Transport Dupont       │
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │ Avril 2025                   │    │
│  │ 12 trajets · 2 800€          │    │
│  │ ✅ Virement reçu le 30/04    │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ Mars 2025                    │    │
│  │ 10 trajets · 2 400€          │    │
│  │ ✅ Virement reçu le 31/03    │    │
│  └──────────────────────────────┘    │
│                                      │
│  ℹ️ Gestion de paie via votre patron │
│  Contact : Transport Dupont          │
└──────────────────────────────────────┘
```

> Le chauffeur est payé par son employeur (le transporteur), pas directement par Eventy.  
> Cette page affiche ce que le transporteur patron lui communique.

---

## À CRÉER côté Transporteur Indépendant (portail Transporteur)

> Depuis `frontend/app/(transporteur)/transporteur/`, le patron voit :

- Liste de ses chauffeurs employés
- Affecter chauffeurs → trajets
- Voir les incidents signalés par les chauffeurs
- Valider les notes de frais
- Envoyer le planning de la semaine

---

## Notes d'implémentation

- `'use client'` sur toutes les pages
- Framer Motion léger : fade, slide, pulse sur en-cours
- Bottom nav fixed · 5 onglets · icônes grandes
- GPS : `window.open('https://maps.google.com/?q=...')` ou `geo:lat,lng` sur mobile
- Incidents → push notification WebSocket côté patron
- Pas de données financières Eventy visibles
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
