# TODO — Portail Accompagnateur de voyage
> Portal : `frontend/app/(accompagnateur)/accompagnateur/`  
> Hub générique : `frontend/app/(employes)/employes/accompagnateur/dashboard/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · mobile-first · Framer Motion  
> Date audit : 2026-04-25

---

## Positionnement — Qui est l'accompagnateur ?

> L'accompagnateur est **embauché par le CRÉATEUR** du voyage, pas par Eventy.  
> Eventy lui fournit une interface légère pour gérer son rôle terrain.  
> Son responsable direct = le créateur/organisateur du voyage.

**Rôle** : Encadre physiquement un groupe de voyageurs pendant le séjour.  
**Mission** : Check-in/out, gestion du groupe, coordination prestataires locaux, incidents, rapports.  
**Accès** : Limité à SES voyages assignés. Pas de données financières Eventy.

---

## Principes UI — Interface Légère Mobile-First

```
✅ Mobile-first (375px — utilisé en terrain avec son téléphone)
✅ Navigation bottom bar (5 onglets max)
✅ Grandes zones tactiles (min 48px hauteur)
✅ Info essentielle en premier, détails en accordéon
✅ Mode offline-friendly (données du jour en cache)
✅ Dark gold — même charte que tous les portails
❌ Pas de tableaux complexes
❌ Pas de graphiques financiers
❌ Pas d'accès aux données commerciales Eventy
```

---

## Architecture Navigation

```
Bottom Nav :
[🏠 Aujourd'hui] [👥 Mon Groupe] [📋 Programme] [⚠️ Signaler] [👤 Profil]
```

---

## Résumé des travaux

| Page | Statut | Action | Priorité |
|------|--------|--------|----------|
| `page.tsx` | Stub (5L) redirect | Garder redirect → cockpit | — |
| `cockpit/page.tsx` | Stub (?) | **À construire** — dashboard jour | P0 |
| `groupe/page.tsx` | Stub (?) | **À construire** — liste voyageurs | P0 |
| `programme/page.tsx` | Stub (?) | **À construire** — planning du séjour | P0 |
| `incidents/page.tsx` | Stub (?) | **À construire** — signalement | P0 |
| `prestataires/page.tsx` | Stub (?) | **À construire** — contacts terrain | P1 |
| `evaluations/page.tsx` | Stub (?) | **À construire** — mes notes reçues | P1 |
| `rapports/page.tsx` | Stub (?) | **À construire** — rapport de fin | P1 |
| `profil/page.tsx` | Stub (?) | **À construire** — compte | P2 |
| `login/page.tsx` | Stub (?) | **À construire** — login simple | P0 |

---

## P0 — login/page.tsx

**Concept** : Login minimaliste, pas de formulaire long — email + code PIN ou lien magique

```
📱
┌──────────────────────┐
│  🌟 Eventy           │
│                      │
│  Accompagnateur      │
│                      │
│  Email               │
│  [________________]  │
│                      │
│  Code PIN (4 chiffres)│
│  [__] [__] [__] [__] │
│                      │
│  [Connexion →]       │
│                      │
│  Lien magique ?      │
│  [Recevoir par email]│
└──────────────────────┘
```

---

## P0 — cockpit/page.tsx — Dashboard du jour

**Concept** : Vue synthétique de la journée en cours — ce qui compte MAINTENANT

```
📱
┌──────────────────────────────────────┐
│  Bonjour Thomas !    Sam 3 mai 2025  │
│  Groupe Marseille · Marrakech        │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ MAINTENANT                     │  │
│  │ 🍽️ 12:30 — Déjeuner Riad Salam │  │
│  │ 52 voyageurs · Salle Jasmin    │  │
│  │ Contact resto : Yassir +212... │  │
│  │ [Voir détails] [Signaler →]    │  │
│  └────────────────────────────────┘  │
│                                      │
│  AUJOURD'HUI                         │
│  ✅ 07:30 PDJ buffet — Terminé       │
│  🟡 14:30 Visite souks — Dans 2h    │
│  🟡 19:30 Dîner gala — Dans 7h      │
│                                      │
│  MON GROUPE                          │
│  52 voyageurs · 2 SR · 1 PMR         │
│  [Voir liste] [Messagerie groupe]    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ⚠️ ALERTES                     │  │
│  │ 🔴 Voyageur #14 — allergie noix│  │
│  │    Rappeler au resto ce soir   │  │
│  └────────────────────────────────┘  │
│                                      │
│  Contacter le créateur : [💬 Chat]   │
│  Urgence : [📞 Appel direct]         │
└──────────────────────────────────────┘

Bottom Nav : [🏠●] [👥] [📋] [⚠️] [👤]
```

**KPIs** : activité en cours, timeline jour, alertes critiques (allergies, incidents), contact rapide créateur  
**Framer Motion** : pulse sur alerte rouge, fade entrée sections

---

## P0 — groupe/page.tsx — Mon groupe voyageurs

**Concept** : Liste des voyageurs du séjour, infos utiles pour l'accompagnateur

```
📱
┌──────────────────────────────────────┐
│  ← Groupe Marseille    🔍            │
│  52 voyageurs · Riad Yasmine         │
├──────────────────────────────────────┤
│  [Tous] [SR] [PMR] [Allergies] [VIP] │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 👤 Martin Sophie             │    │
│  │ Chambre 12 · Adulte          │    │
│  │ ⚠️ Allergie : noix, arachides│    │
│  │ Tel : +33 6 12 34 56 78     │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 👤 Dupont Jean               │    │
│  │ Chambre 13 · PMR ♿           │    │
│  │ Chambre adaptée · Fauteuil   │    │
│  │ Tel : +33 6 98 76 54 32     │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ 👤 Bernard Hélène            │    │
│  │ Chambre 12 · Adulte          │    │
│  │ ✅ Aucune contrainte          │    │
│  └──────────────────────────────┘    │
│                                      │
│  [Exporter liste PDF] [Partager]     │
└──────────────────────────────────────┘
```

**Champs visibles** : nom, chambre, catégorie (adulte/enfant/SR/PMR), allergies, tel  
**Pas visible** : montant payé, données financières, données commerciales  
**Framer Motion** : stagger liste, slide filtres

---

## P0 — programme/page.tsx — Planning du séjour

**Concept** : Programme complet du voyage — vue agenda simple et claire

```
📱
┌──────────────────────────────────────┐
│  ← Programme complet                 │
│  Marrakech · 24 avril → 30 avril     │
├──────────────────────────────────────┤
│                                      │
│  ● AUJOURD'HUI — Samedi 26 avril     │
│  ┌──────────────────────────────┐    │
│  │ 07:30 🌅 PDJ buffet          │    │
│  │    Riad Yasmine · 52 pax ✅  │    │
│  │ 12:30 🍽️ Déjeuner            │    │
│  │    Riad Salam · 52 pax 🟡    │    │
│  │ 14:30 🚶 Visite souks Médina  │    │
│  │    Guide : Mohammed +212...  │    │
│  │ 19:30 🌙 Dîner gala oriental │    │
│  │    La Mamounia · 52 pax      │    │
│  └──────────────────────────────┘    │
│                                      │
│  Dimanche 27 avril                   │
│  ┌──────────────────────────────┐    │
│  │ 09:00 🏔️ Excursion Atlas      │    │
│  │    Transport : Bus AB-123    │    │
│  │    Guide : Karim +212...     │    │
│  │ 19:00 🍽️ Dîner libre (optionnel)│  │
│  └──────────────────────────────┘    │
│                                      │
│  [Télécharger PDF] [Partager groupe] │
└──────────────────────────────────────┘
```

**Données** : heure, activité, lieu, prestataire, contact, statut (passé/en cours/à venir)  
**Framer Motion** : highlight jour courant, fade smooth entre jours

---

## P0 — incidents/page.tsx — Signaler un incident

**Concept** : Interface rapide pour signaler TOUT incident — s'envoie au créateur immédiatement

```
📱
┌──────────────────────────────────────┐
│  ← Signaler un incident               │
│  Groupe Marseille · 26 avril          │
├──────────────────────────────────────┤
│                                      │
│  Type d'incident                     │
│  ┌──────────┐ ┌──────────┐           │
│  │ 🏥 Santé │ │ 🚌 Transp │           │
│  └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐           │
│  │ 🍽️ Repas │ │ 🏨 Héberg │           │
│  └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐           │
│  │ 👥 Conflit│ │ 🔒 Sécu  │           │
│  └──────────┘ └──────────┘           │
│  [Autre →]                           │
│                                      │
│  Gravité                             │
│  ○ Mineur  ○ Sérieux  ● Urgent       │
│                                      │
│  Décrivez brièvement                 │
│  [________________________________]  │
│  [________________________________]  │
│                                      │
│  Voyageur concerné (optionnel)        │
│  [Rechercher dans le groupe... 🔍]   │
│                                      │
│  📷 Ajouter une photo                │
│                                      │
│  [🚨 Envoyer au créateur]            │
│  Envoi immédiat + notification push  │
├──────────────────────────────────────┤
│  INCIDENTS DU VOYAGE (2)             │
│  ✅ 24/04 · Transport retard 30min   │
│  ✅ 25/04 · Voyageur allergie réact. │
└──────────────────────────────────────┘
```

**Workflow** : incident créé → notif push au créateur → créateur traite ou escalade Eventy  
**Framer Motion** : slide sélection type, shake sur envoi urgent

---

## P1 — prestataires/page.tsx — Contacts terrain

**Concept** : Carnet de contacts rapides pour l'accompagnateur sur le terrain

```
📱
┌──────────────────────────────────────┐
│  ← Prestataires & Contacts           │
│  Marrakech · Voyage en cours         │
├──────────────────────────────────────┤
│  🔍 Rechercher...                    │
├──────────────────────────────────────┤
│  HÔTEL                               │
│  🏨 Riad Yasmine · Réception         │
│  📞 +212 524 38 14 XX                │
│  24h/24 · Contact: Ahmed (manager)   │
│                                      │
│  RESTAURANTS                         │
│  🍽️ Riad Salam · Yassir              │
│  📞 +212 524 44 XX XX                │
│  🍽️ La Mamounia · Service groupes    │
│  📞 +212 524 38 86 00                │
│                                      │
│  GUIDES                              │
│  🧭 Mohammed — Médina                │
│  📞 +212 6 XX XX XX XX               │
│  🧭 Karim — Atlas / Palmeraie        │
│  📞 +212 6 XX XX XX XX               │
│                                      │
│  TRANSPORT                           │
│  🚌 Bus AB-123 — Conducteur Rachid   │
│  📞 +212 6 XX XX XX XX               │
│                                      │
│  MON CRÉATEUR (responsable)          │
│  👤 Jean-Pierre L. · Organisateur    │
│  💬 [Chat] 📞 [Appel] 📧 [Email]    │
└──────────────────────────────────────┘
```

---

## P1 — evaluations/page.tsx — Mes évaluations

**Concept** : Notes reçues des voyageurs et du créateur sur les voyages passés

```
📱
┌──────────────────────────────────────┐
│  ← Mes évaluations                   │
│  Note globale : ⭐ 4.8 / 5           │
│  Sur 24 voyages                      │
├──────────────────────────────────────┤
│  DERNIER VOYAGE — Maroc Dés. 04/25   │
│  ⭐⭐⭐⭐⭐ 5.0 — 38 avis               │
│  "Thomas est exceptionnel !"         │
│  Créateur : ⭐ 5.0 · "Top !"          │
│                                      │
│  VOYAGE PRÉCÉDENT — Grèce 03/25      │
│  ⭐⭐⭐⭐ 4.7 — 45 avis                │
│  "Très professionnel, disponible"    │
│                                      │
│  CRITÈRES (moyennes)                 │
│  Disponibilité  ████████░  4.9       │
│  Connaissance   ███████░░  4.6       │
│  Gestion crises ████████░  4.8       │
│  Communication  █████████  5.0       │
└──────────────────────────────────────┘
```

---

## P1 — rapports/page.tsx — Rapport de voyage

**Concept** : Compte-rendu de fin de voyage à remettre au créateur

```
📱
┌──────────────────────────────────────┐
│  ← Rapport de voyage                 │
│  Groupe Marseille · 24-30 Avril      │
├──────────────────────────────────────┤
│  [En cours] [Brouillon ●] [Envoyés]  │
│                                      │
│  RAPPORT — Marrakech 04/2025         │
│  Statut : 🟡 Brouillon               │
│                                      │
│  Résumé séjour                       │
│  [________________________________]  │
│  [________________________________]  │
│                                      │
│  Incidents signalés : 2              │
│  ✅ Transport retard 24/04           │
│  ✅ Voyageur allergie 25/04          │
│  [Inclus automatiquement]            │
│                                      │
│  Note globale du groupe              │
│  ⭐ ⭐ ⭐ ⭐ ⭐  (votre ressenti)       │
│                                      │
│  Prestataires à noter                │
│  Riad Yasmine ⭐⭐⭐⭐⭐                │
│  La Mamounia  ⭐⭐⭐⭐⭐                │
│                                      │
│  [Enregistrer brouillon]             │
│  [📤 Envoyer au créateur]            │
└──────────────────────────────────────┘
```

---

## À CRÉER côté Créateur (portail Pro)

> Le créateur voit ses accompagnateurs depuis `frontend/app/(pro)/pro/`

**Dashboard créateur — section accompagnateurs** :
- Voir ses accompagnateurs affectés aux voyages
- Recevoir les incidents en temps réel (notif push)
- Valider les rapports
- Évaluer les accompagnateurs après voyage
- Gérer les plannings et affectations

---

## Notes d'implémentation

- `'use client'` sur toutes les pages
- Framer Motion : `import { motion, AnimatePresence } from 'framer-motion'`
- Navigation bottom bar : `fixed bottom-0` avec 5 onglets
- Incidents → envoi via WebSocket ou polling toutes 30s
- Cache local (localStorage) pour données du jour en cas de perte réseau
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- L'accompagnateur NE VOIT PAS les données financières Eventy ni les marges
- Son responsable = le créateur du voyage (rôle Pro sur Eventy)
