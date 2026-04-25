# TODO — Portail Photographe & Technicien Événementiel
> Portal : `frontend/app/(photographe)/photographe/`  
> Hub générique : `frontend/app/(employes)/employes/photographe/dashboard/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · mobile-first · Framer Motion  
> Date audit : 2026-04-25

---

## Positionnement — Qui est le photographe / technicien ?

> **Photographe** : indépendant ou employé du créateur. Couvre les voyages en photos/vidéos.  
> **Technicien événementiel** : son/lumières/scène pour les soirées thématiques.  
> Son responsable = le créateur du voyage.  
> Eventy lui fournit l'espace pour livrer son travail et se faire payer.

**Rôles couverts** :
- Photographe voyage (reportage complet du séjour)
- Vidéaste (teaser/film souvenir)
- Technicien son/lumières (soirées animées)
- Régisseur scène (montage/démontage)

---

## Principes UI

```
✅ Mobile-first — smartphone comme outil de travail principal
✅ Galerie visuelle riche (thumbnails photos)
✅ Upload photos direct depuis mobile
✅ Livraison structurée par séquences (PDJ, visite, soirée...)
✅ Brief facilement accessible en mission
❌ Pas d'accès aux données voyageurs privées (sauf noms pour légendes)
```

---

## Architecture Navigation

```
Bottom Nav :
[🏠 Aujourd'hui] [📸 Missions] [🖼️ Galerie] [📦 Livrables] [👤 Profil]
```

---

## Résumé des travaux

| Page | Statut | Action | Priorité |
|------|--------|--------|----------|
| `page.tsx` | Stub (5L) redirect | Garder | — |
| `dashboard/page.tsx` | Stub (?) | **À construire** — hub du jour | P0 |
| `missions/page.tsx` | Stub (?) | **À construire** — liste missions | P0 |
| `brief/page.tsx` | Stub (?) | **À construire** — brief mission | P0 |
| `galerie/page.tsx` | Stub (?) | **À construire** — mes photos | P0 |
| `livrables/page.tsx` | Stub (?) | **À construire** — livraison | P0 |
| `droits/page.tsx` | Stub (?) | **À construire** — droits image | P1 |
| `facturation/page.tsx` | Stub (?) | **À construire** — paiements | P1 |
| `compte/page.tsx` | Stub (?) | **À construire** — profil | P2 |
| `login/page.tsx` | Stub (?) | **À construire** — connexion | P0 |

---

## P0 — dashboard/page.tsx — Hub du jour

```
📱
┌──────────────────────────────────────┐
│  Bonjour Lucas !       Sam 3 mai     │
│  Photographe · Voyage Maroc 04/25    │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ MISSION EN COURS               │  │
│  │ 📸 Soirée Orientale            │  │
│  │ Riad Yasmine · 19:30 → 23:00   │  │
│  │ 85 personnes · Scène ext.      │  │
│  │ Style : Reportage ambiance     │  │
│  │ [Voir brief complet]           │  │
│  └────────────────────────────────┘  │
│                                      │
│  AUJOURD'HUI — 3 séquences           │
│  ✅ 07:30 PDJ buffet  48 photos ✓    │
│  ✅ 14:30 Visite médina 127 photos ✓ │
│  🔵 19:30 Soirée gala  EN COURS      │
│                                      │
│  LIVRABLES DU VOYAGE                 │
│  Photos : 347 / objectif ~500        │
│  ████████████░░░░  69%               │
│  Délai livraison : 03/05 (dans 6j)  │
│                                      │
│  [💬 Créateur] [📤 Uploader photos]  │
└──────────────────────────────────────┘
```

---

## P0 — missions/page.tsx — Mes missions

```
📱
┌──────────────────────────────────────┐
│  ← Mes Missions                      │
│  [En cours] [À venir] [Terminées]    │
├──────────────────────────────────────┤
│                                      │
│  EN COURS — Voyage Maroc (24→30/04)  │
│  ┌──────────────────────────────┐    │
│  │ 📸 Reportage complet voyage  │    │
│  │ 7 jours · 85 voyageurs       │    │
│  │ Format : JPG 4K + RAW        │    │
│  │ Livrables : avant 03/05      │    │
│  │ Montant : 1 200€             │    │
│  │ [Brief] [Galerie] [Livrer]   │    │
│  └──────────────────────────────┘    │
│                                      │
│  À VENIR                             │
│  🟡 10/05 · Soirée gala Barcelone    │
│     Technicien son/lumières · 3h     │
│     480€ · [Voir brief]              │
│                                      │
│  TERMINÉES — ce mois (4)             │
│  [Voir historique →]                 │
└──────────────────────────────────────┘
```

---

## P0 — brief/page.tsx — Brief de mission

**Concept** : Toutes les infos créatives et techniques pour la mission — référence rapide sur le terrain

```
📱
┌──────────────────────────────────────┐
│  ← Brief · Voyage Maroc 04/25        │
│  Mis à jour par créateur : 24/04     │
├──────────────────────────────────────┤
│                                      │
│  🎯 OBJECTIF CRÉATIF                 │
│  Capturer l'âme du voyage : couleurs │
│  locales, émotions des voyageurs,    │
│  moments de partage & découverte.    │
│                                      │
│  📋 SÉQUENCES DEMANDÉES              │
│  ✅ Petit-déjeuner buffet (ambiance) │
│  ✅ Excursion Atlas (paysages + pax) │
│  🔵 Soirée orientale (danse + scène) │
│  🟡 Check-out et au revoir           │
│                                      │
│  📸 FORMATS DEMANDÉS                 │
│  Photos : JPG + RAW · min 500 shots  │
│  Vidéo : 90s teaser · format 16:9    │
│  Stories : 10 verticales 9:16        │
│                                      │
│  🚫 À ÉVITER                         │
│  Personnes en tenue légère           │
│  Intérieur des chambres sans accord  │
│  Enfants en gros plan (RGPD)         │
│                                      │
│  📞 CONTACT CRÉATEUR                 │
│  Jean-Pierre L. · +33 6 XX XX XX XX  │
│  [💬 Message] [📞 Appel]             │
└──────────────────────────────────────┘
```

---

## P0 — galerie/page.tsx — Mes photos

**Concept** : Galerie des photos prises, organisées par séquence, avec upload direct

```
📱
┌──────────────────────────────────────┐
│  ← Galerie · Voyage Maroc            │
│  347 photos · 7 séquences            │
│                       [+ Uploader]   │
├──────────────────────────────────────┤
│  [Toutes] [PDJ] [Atlas] [Médina]     │
│  [Soirée] [Portraits] [Landscapes]   │
├──────────────────────────────────────┤
│                                      │
│  SOIRÉE ORIENTALE · 27/04 (en cours) │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ 📷  │ │ 📷  │ │ 📷  │ │ 📷  │    │
│  │ IMG │ │ IMG │ │ IMG │ │ IMG │    │
│  └─────┘ └─────┘ └─────┘ └─────┘    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌──+──┐    │
│  │ 📷  │ │ 📷  │ │ 📷  │ │     │    │
│  │ IMG │ │ IMG │ │ IMG │ │ADD  │    │
│  └─────┘ └─────┘ └─────┘ └──+──┘    │
│  54 photos · 2.3 GB                  │
│                                      │
│  EXCURSION ATLAS · 27/04 ✅           │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ 📷  │ │ 📷  │ │ 📷  │ │ ... │    │
│  └─────┘ └─────┘ └─────┘ └─────┘    │
│  127 photos · 5.4 GB ✅ Uploadées    │
└──────────────────────────────────────┘
```

---

## P0 — livrables/page.tsx — Livraison au créateur

**Concept** : Organiser et livrer les photos/vidéos finales au créateur

```
📱
┌──────────────────────────────────────┐
│  ← Livrables · Voyage Maroc          │
│  Délai : 03/05 2025 (dans 6 jours)  │
├──────────────────────────────────────┤
│                                      │
│  PROGRESSION GLOBALE                 │
│  ████████████░░░░  347/500 photos    │
│  ░░░░░░░░░░░░░░░░  0/1 teaser vidéo  │
│                                      │
│  PAR LIVRABLE                        │
│  ┌──────────────────────────────┐    │
│  │ 📸 Sélection photos (150)    │    │
│  │ Remettre : 150 meilleures    │    │
│  │ Format : JPG 4K retouchées   │    │
│  │ Statut : 🟡 En cours 80/150  │    │
│  │ [Sélectionner + Livrer →]    │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 🎬 Teaser vidéo 90s          │    │
│  │ Format : MP4 1080p           │    │
│  │ Statut : 🔴 Pas commencé     │    │
│  │ [Uploader quand prêt →]      │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 📱 Stories 10x 9:16          │    │
│  │ Statut : ✅ Livré 25/04      │    │
│  │ [Voir livraison →]           │    │
│  └──────────────────────────────┘    │
│                                      │
│  [📤 Livraison finale au créateur]   │
└──────────────────────────────────────┘
```

---

## P1 — droits/page.tsx — Gestion droits image

**Concept** : Consentements voyageurs pour utilisation commerciale des photos

```
📱
┌──────────────────────────────────────┐
│  ← Droits image                      │
│  Voyage Maroc · 85 voyageurs         │
├──────────────────────────────────────┤
│  [Tous] [Accordé ✅] [Refusé ❌] [?]  │
├──────────────────────────────────────┤
│                                      │
│  ⚠️ RGPD — Droits image               │
│  Consentements collectés via Eventy  │
│  lors de la réservation              │
│                                      │
│  ✅ 71 voyageurs — Accord commercial  │
│  ❌ 8 voyageurs — Refus total         │
│  ❓ 6 voyageurs — Usage perso seul    │
│                                      │
│  VOYAGEURS SANS DROIT COMMERCIAL     │
│  ⚠️ Martin Sophie — Refus total      │
│  ⚠️ Petit Jean — Mineurs (floutage)  │
│  [8 autres →]                        │
│                                      │
│  ℹ️ Les refus sont auto-signalés dans │
│  la galerie pour éviter les erreurs  │
└──────────────────────────────────────┘
```

---

## P1 — facturation/page.tsx — Mes paiements

```
📱
┌──────────────────────────────────────┐
│  ← Mes Paiements                     │
│  [Avril 2025 ▾]                      │
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │ Voyage Maroc 04/25           │    │
│  │ Reportage 7j · 1 200€        │    │
│  │ ⏳ En attente livraison finale│    │
│  │ Paiement : à réception       │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ Soirée Barcelone 03/25       │    │
│  │ Technicien son · 480€        │    │
│  │ ✅ Virement reçu 31/03       │    │
│  └──────────────────────────────┘    │
│                                      │
│  TOTAL ENCAISSÉ 2025 : 6 840€        │
│  En attente : 1 200€                 │
└──────────────────────────────────────┘
```

---

## Technicien événementiel — spécificités

Pour les techniciens son/lumières/scène, les pages `brief` et `dashboard` doivent aussi afficher :

```
📱 — BRIEF TECHNIQUE (en plus du brief créatif)
┌──────────────────────────────────────┐
│  SETUP TECHNIQUE — Soirée Orientale  │
│  Scène : 8m × 5m · Extérieure       │
│  Son : 2 enceintes 2000W + régie     │
│  Lumières : 8 PARS + 2 moving heads │
│  Montage : 16:00 · Show : 19:30      │
│  Démontage : 23:30 → fin             │
│                                      │
│  ⚡ Alimentation : 2× 32A triphasé   │
│  📏 Plan de scène : [Voir PDF]       │
│  📞 Régisseur : Ahmed +212...        │
└──────────────────────────────────────┘
```

---

## Notes d'implémentation

- `'use client'` · Framer Motion · Dark gold
- Galerie : lazy loading images, `next/image` avec blurhash
- Upload photos : `FormData` multipart, barre de progression animée
- Brief : PDF viewer intégré (React PDF Viewer) pour les plans techniques
- Droits image : données lues depuis le backend (consentements réservation)
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Performance galerie : virtualisation liste avec `react-virtual` pour 500+ photos
