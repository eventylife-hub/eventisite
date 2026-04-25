# TODO — Portail Guide Local & Moniteur d'activités
> Portal : `frontend/app/(guide)/guide/`  
> Hub générique : `frontend/app/(employes)/employes/guide/dashboard/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · mobile-first · Framer Motion  
> Date audit : 2026-04-25

---

## Positionnement — Qui est le guide / moniteur ?

> Le guide/moniteur est un **professionnel indépendant** ou **employé du créateur**.  
> Deux cas :
> - **Guide indépendant** : prestataire libre qui accepte des missions Eventy
> - **Moniteur employé** : recruté par le créateur pour animer des activités spécifiques
>
> Dans les deux cas, son responsable terrain = le **créateur du voyage**.  
> Eventy lui fournit l'interface pour gérer ses missions et se faire payer.

**Rôles couverts** :
- Guide touristique (visite médina, monuments, randonnée)
- Moniteur activités (surf, yoga, cuisine marocaine, trekking)
- Guide nature / aventure
- Coordinateur culturel

---

## Principes UI

```
✅ Mobile-first (terrain, souvent en extérieur)
✅ Mode hors-ligne : infos du groupe cachées localement
✅ Grande lisibilité (soleil direct)
✅ Checklist missions simple
✅ Évaluations visibles (motivation)
❌ Pas d'accès données financières Eventy
```

---

## Architecture Navigation

```
Bottom Nav :
[🏠 Aujourd'hui] [📋 Missions] [✅ Checklist] [⭐ Évals] [👤 Profil]
```

---

## Résumé des travaux

| Page | Statut actuel | Action | Priorité |
|------|---------------|--------|----------|
| `page.tsx` | Stub 15L amber | Remplacer redirect propre | — |
| `dashboard/page.tsx` | Stub (?) | **À construire** — cockpit jour | P0 |
| `missions/page.tsx` | Stub (?) | **À construire** — liste missions | P0 |
| `missions/[id]/page.tsx` | Stub (?) | **À construire** — détail mission | P0 |
| `planning/page.tsx` | Stub (?) | **À construire** — calendrier | P0 |
| `checklist/page.tsx` | Stub (?) | **À construire** — checklist terrain | P0 |
| `evaluations/page.tsx` | Stub (?) | **À construire** — mes notes | P1 |
| `facturation/page.tsx` | Stub (?) | **À construire** — mes paiements | P1 |
| `rapports/page.tsx` | Stub (?) | **À construire** — rapport mission | P1 |
| `compte/page.tsx` | Stub (?) | **À construire** — profil + spécialités | P2 |
| `login/page.tsx` | Stub (?) | **À construire** — connexion | P0 |

---

## P0 — dashboard/page.tsx — Cockpit du jour

```
📱
┌──────────────────────────────────────┐
│  Bonjour Mohammed !    Dim 27 avril  │
│  Guide · Marrakech & Région          │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ MISSION EN COURS               │  │
│  │ 🧭 Visite Médina — Groupe Lyon │  │
│  │ 85 voyageurs · Départ : 14:30  │  │
│  │ Point RDV : Djemaa el-Fna      │  │
│  │ Durée : 3h · Fin prévue 17:30  │  │
│  │ [✅ Check-in groupe]            │  │
│  │ [📋 Checklist] [⚠️ Signaler]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  AUJOURD'HUI (2 missions)            │
│  ✅ 09:00 Excursion Atlas — Terminé  │
│  🔵 14:30 Visite Médina — En cours   │
│                                      │
│  MON GROUPE ACTUEL                   │
│  85 voyageurs · 2 PMR · 1 enfant     │
│  Accompagnateur : Thomas (+33 6...) │
│                                      │
│  [💬 Messagerie] [🆘 Urgence]       │
└──────────────────────────────────────┘
```

---

## P0 — missions/page.tsx — Liste missions

**Concept** : Toutes les missions passées/en cours/à venir avec recherche et filtres

```
📱
┌──────────────────────────────────────┐
│  ← Mes Missions         [Filtrer]   │
│  Proposées (2) · En cours (1) · Hist.│
├──────────────────────────────────────┤
│                                      │
│  PROPOSÉES — Répondre avant 28/04   │
│  ┌──────────────────────────────┐    │
│  │ 🔵 30 Avril · Excursion Agadir│    │
│  │ Groupe 42 pax · 4h · 180€   │    │
│  │ Créateur : Jean-Pierre L.    │    │
│  │ [✅ Accepter] [❌ Refuser]   │    │
│  └──────────────────────────────┘    │
│                                      │
│  EN COURS                            │
│  ┌──────────────────────────────┐    │
│  │ 🟢 27/04 · Visite Médina     │    │
│  │ Groupe Lyon · 85 pax · 3h    │    │
│  │ Départ 14:30 · Point Djemaa  │    │
│  │ [Voir détails →]             │    │
│  └──────────────────────────────┘    │
│                                      │
│  À VENIR                             │
│  🟡 01/05 · Trekking Atlas · 62 pax  │
│  🟡 03/05 · Atelier tajine · 38 pax  │
│                                      │
│  TERMINÉES (18 ce mois)              │
│  [Voir historique →]                 │
└──────────────────────────────────────┘
```

---

## P0 — missions/[id]/page.tsx — Détail mission

```
📱
┌──────────────────────────────────────┐
│  ← Mission #GDE-2025-047             │
│  Visite Médina · 27 Avril 2025       │
├──────────────────────────────────────┤
│                                      │
│  🟢 EN COURS                         │
│  Départ : 14:30 · Djemaa el-Fna     │
│  Fin prévue : 17:30                  │
│  Durée : 3h                          │
│                                      │
│  GROUPE                              │
│  85 voyageurs · Groupe Lyon          │
│  Accompagnateur : Thomas M.          │
│  📞 +33 6 12 34 56 78               │
│                                      │
│  PROGRAMME VISITE                    │
│  ✅ 14:30 — Djemaa el-Fna            │
│  🔵 15:15 — Souks (spices, cuir)     │
│  🟡 16:00 — Medersa Ben Youssef      │
│  🟡 16:45 — Panorama remparts        │
│  🟡 17:15 — Retour Djemaa            │
│                                      │
│  NOTES IMPORTANTES                   │
│  ⚠️ 3 personnes allergiques → épices │
│  ♿ 2 PMR → éviter les pavés          │
│                                      │
│  RÉMUNÉRATION                        │
│  180€ · Paiement fin de mois        │
│                                      │
│  [⚠️ Signaler] [📋 Checklist]        │
└──────────────────────────────────────┘
```

---

## P0 — planning/page.tsx — Calendrier missions

```
📱
┌──────────────────────────────────────┐
│  ← Planning · Mai 2025               │
│  [◀] Mai 2025 [▶]  [+ Bloquer dispo] │
├──────────────────────────────────────┤
│  L  M  M  J  V  S  D                 │
│           1  2  3  4                 │
│  5  6  7  8  9  10 11               │
│  12 13 14 [15 🧭] 16 17 18          │
│  [19🧭][20🧭]21 22 23 24 25         │
│  26 27 28 29 30 31                   │
│                                      │
│  LÉGENDE :  🧭 Mission  🔴 Indispo  │
│             🔵 Proposée ⏳ Attente   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 15 Mai — Mission sélectionnée│    │
│  │ 🧭 Excursion Ourika          │    │
│  │ 38 pax · 09:00-17:00 · 250€  │    │
│  └──────────────────────────────┘    │
│                                      │
│  DISPONIBILITÉS                      │
│  [Marquer indisponible]  [Voir tout] │
└──────────────────────────────────────┘
```

---

## P0 — checklist/page.tsx — Checklist terrain

**Concept** : Liste de vérification avant/pendant/après chaque mission

```
📱
┌──────────────────────────────────────┐
│  ← Checklist · Visite Médina         │
│  Mission #GDE-2025-047               │
├──────────────────────────────────────┤
│  [Avant départ] [Pendant] [Fin]      │
├──────────────────────────────────────┤
│                                      │
│  AVANT DÉPART (6/8 ✓)               │
│  ✅ Confirmation groupe reçue        │
│  ✅ Programme final validé           │
│  ✅ Contacts accompagnateur          │
│  ✅ Vérifier entrées payantes (medersa)│
│  ○ Eau et snacks disponibles         │
│  ✅ Trousse premiers secours         │
│  ○ Briefing PMR / besoins spéciaux   │
│  ✅ Point RDV confirmé               │
│                                      │
│  [Marquer restants ✓]                │
│                                      │
│  PENDANT VISITE                      │
│  ○ Appel présence à chaque étape    │
│  ○ Respecter horaires               │
│  ○ Pas de retardataires au retour   │
│                                      │
│  FIN DE MISSION                      │
│  ○ Retour groupe complet confirmé   │
│  ○ Rapport incidents                 │
│  ○ Évaluer prestataires locaux       │
└──────────────────────────────────────┘
```

**Checklists** : personnalisées par type de mission (visite urbaine / randonnée / atelier / excursion)  
**Framer Motion** : check animation (scale + couleur), progress bar en haut

---

## P1 — evaluations/page.tsx — Mes évaluations reçues

```
📱
┌──────────────────────────────────────┐
│  ← Mes Évaluations                   │
│  Note globale : ⭐ 4.9 / 5           │
│  89 missions · 1 240 avis            │
├──────────────────────────────────────┤
│                                      │
│  DERNIÈRE MISSION — Médina 27/04     │
│  ⭐⭐⭐⭐⭐ 4.9 · 85 avis               │
│  "Mohammed est passionnant !"        │
│  "Le meilleur guide qu'on ait eu"    │
│                                      │
│  CRITÈRES                            │
│  Connaissance   █████████  5.0       │
│  Communication  █████████  4.9       │
│  Ponctualité    ████████░  4.8       │
│  Sécurité       █████████  5.0       │
│  Convivialité   █████████  4.9       │
│                                      │
│  ÉVOLUTION ANNUELLE                  │
│  [Recharts LineChart 12 mois]        │
│                                      │
│  [Voir tous les avis →]             │
└──────────────────────────────────────┘
```

---

## P1 — facturation/page.tsx — Mes paiements

**Concept** : Vue paiements reçus — guide indépendant ou salarié selon cas

```
📱
┌──────────────────────────────────────┐
│  ← Mes Paiements                     │
│  [Avril 2025 ▾]                      │
├──────────────────────────────────────┤
│                                      │
│  AVRIL 2025                          │
│  8 missions · 1 440€ brut            │
│  Paiement : ✅ Virement 30/04        │
│                                      │
│  DÉTAIL PAR MISSION                  │
│  ┌──────────────────────────────┐    │
│  │ 27/04 Visite Médina · 3h     │    │
│  │ 85 pax · 180€ · ✅           │    │
│  │ 27/04 Atlas matin · 4h       │    │
│  │ 62 pax · 220€ · ✅           │    │
│  └──────────────────────────────┘    │
│                                      │
│  ℹ️  Guide indépendant :              │
│     Paiement par le créateur, fin M  │
│  ℹ️  Guide salarié :                  │
│     Via fiche de paie de l'employeur │
└──────────────────────────────────────┘
```

---

## P1 — rapports/page.tsx — Rapport de mission

Même structure que accompagnateur/rapports — résumé mission, incidents, notes prestataires, envoi au créateur.

---

## À CRÉER côté Créateur

Depuis le portail Pro, le créateur voit :
- Ses guides affectés avec disponibilités
- Affecter guide → activité/excursion
- Recevoir incidents en temps réel
- Valider checklists terrain
- Évaluer guide après mission

---

## Notes d'implémentation

- `'use client'` · Framer Motion · Dark gold
- Checklist : état persisté en `localStorage` (hors-ligne)
- Missions proposées : délai réponse affiché en compte à rebours
- Navigation bottom bar `fixed bottom-0`
- PMR/allergies toujours affichés en premier dans le groupe
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
