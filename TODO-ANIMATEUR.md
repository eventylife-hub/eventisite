# TODO — Portail ANIMATEUR

> Audit du 2026-04-25
> Style cible : dark `#0A0E14` · gold `#D4A853` · glassmorphism
> Apostrophes JSX : `&apos;` dans le texte, `'` dans le code JS

---

## État actuel

| Page | Fichier | État |
|------|---------|------|
| Layout sidebar | `animateur/layout.tsx` | ⚠️ Thème orange `#F97316`, manque items nav |
| Login | `animateur/login/page.tsx` | ⚠️ Thème à corriger, fonctionnel |
| Dashboard | `animateur/dashboard/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Animations | `animateur/animations/page.tsx` | ❌ Placeholder vide |
| Planning | `animateur/planning/page.tsx` | ❌ Placeholder vide |
| Shows | `animateur/shows/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Setlists | `animateur/setlists/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Répertoire | `animateur/repertoire/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Rider | `animateur/rider/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Revenus | `animateur/revenus/page.tsx` | ❌ Placeholder vide |
| Facturation | `animateur/facturation/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Documents | `animateur/documents/page.tsx` | ❌ Placeholder vide |
| Compte | `animateur/compte/page.tsx` | ⚠️ Thème à corriger, contenu OK |
| Support | `animateur/support/page.tsx` | ❌ Placeholder vide |

---

## 1. layout.tsx — Navigation sidebar

### Problèmes
- `ACCENT = '#F97316'` (orange) → doit être `'#D4A853'` (gold)
- `SIDEBAR_BG = '#1A0B00'` → `'#12151C'`
- `MAIN_BG = '#100700'` → `'#0A0E14'`
- Sidebar ne liste que 6 liens → manquent : Shows, Setlists, Rider, Répertoire, Facturation, Compte

### Nouvelle structure sidebar

```
Principal
  🏠 Dashboard          /animateur
  🎪 Animations         /animateur/animations
  📅 Planning           /animateur/planning
  🎭 Shows              /animateur/shows

Artistique
  🎵 Setlists           /animateur/setlists
  🎸 Répertoire         /animateur/repertoire
  🔧 Rider technique    /animateur/rider

Finance & Compte
  💰 Revenus            /animateur/revenus
  🧾 Facturation        /animateur/facturation
  📄 Documents          /animateur/documents
  👤 Mon compte         /animateur/compte

Aide
  🛟 Support            /animateur/support
```

---

## 2. animations/page.tsx — Mes Animations (❌ à coder)

### Objectif
Liste complète des animations assignées par Eventy, avec filtres et statuts.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Mes Animations                              [+ Proposer] │
│  7 animations · 3 à venir · 4 terminées                  │
├─────────────────────────────────────────────────────────┤
│  [Toutes] [À venir] [En cours] [Terminées]               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🎪 SOIRÉE DISCO · Marrakech — Riad & Médina     │    │
│  │ 📅 12 mai 2026 · 21h00–00h00 (3h)               │    │
│  │ 👥 22 voyageurs · 🏨 Riad El Fenn               │    │
│  │ Type: DJ Set · [CONFIRMÉ ✓]                     │    │
│  │ [Préparer setlist] [Voir brief] [Rider]          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🎵 QUIZ MUSICAL · Porto Summer Vibes             │    │
│  │ 📅 18 mai 2026 · 19h30–21h00 (1h30)             │    │
│  │ 👥 35 voyageurs · 🏨 Hotel Infante Sagres        │    │
│  │ Type: Quiz Musical · [EN ATTENTE]                │    │
│  │ [Voir détails]                                   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🎤 KARAOKÉ · Islande Mystica                    │    │
│  │ 📅 25 mai 2026 · 22h00–01h00 (3h)               │    │
│  │ 👥 18 voyageurs · 🏨 Center Hotels Reykjavik    │    │
│  │ Type: Karaoké · [À CONFIRMER]                   │    │
│  │ [Confirmer disponibilité]                        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Types de statuts
- `CONFIRMED` → badge gold — "Confirmé ✓"
- `PENDING` → badge amber — "En attente"
- `TO_CONFIRM` → badge blue — "À confirmer"
- `DONE` → badge gray — "Terminé"
- `CANCELLED` → badge red — "Annulé"

### Données démo (5 animations)

```ts
const ANIMATIONS = [
  { id:'a1', type:'DJ_SET', travelTitle:'Marrakech — Riad & Médina', destination:'Marrakech', date:'2026-05-12T21:00:00Z', durationHours:3, pax:22, venue:'Riad El Fenn', status:'CONFIRMED', rating:null },
  { id:'a2', type:'QUIZ_MUSICAL', travelTitle:'Porto Summer Vibes', destination:'Porto', date:'2026-05-18T19:30:00Z', durationHours:1.5, pax:35, venue:'Hotel Infante Sagres', status:'PENDING', rating:null },
  { id:'a3', type:'KARAOKE', travelTitle:'Islande Mystica', destination:'Reykjavik', date:'2026-05-25T22:00:00Z', durationHours:3, pax:18, venue:'Center Hotels Reykjavik', status:'TO_CONFIRM', rating:null },
  { id:'a4', type:'DJ_SET', travelTitle:'Rome Bella Vita', destination:'Rome', date:'2026-04-20T22:00:00Z', durationHours:4, pax:28, venue:'Hotel Splendide Royal', status:'DONE', rating:4.8 },
  { id:'a5', type:'INITIATION_DANSE', travelTitle:'Barcelona Latin Night', destination:'Barcelone', date:'2026-04-05T20:00:00Z', durationHours:2, pax:40, venue:'Hotel Arts Barcelona', status:'DONE', rating:4.9 },
]
```

---

## 3. planning/page.tsx — Planning (❌ à coder)

### Objectif
Vue calendrier mensuelle + liste semaine des interventions.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Planning · Mai 2026                 [< Mois] [Mois >]  │
│  [Vue mois] [Vue semaine] [Vue liste]                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Lun  Mar  Mer  Jeu  Ven  Sam  Dim                      │
│   27   28   29   30    1    2    3                       │
│                         🎵        🎪                     │
│    4    5    6    7    8    9   10                       │
│                                                         │
│   11   12   13   14   15   16   17                      │
│         🎵                                              │
│   18   19   20   21   22   23   24                      │
│    🎵                                                   │
│   25   26   27   28   29   30   31                      │
│    🎤                                                   │
├─────────────────────────────────────────────────────────┤
│  Prochains événements                                    │
│  ─────────────────────────────────────────              │
│  📅 12 mai · 21h00  Marrakech — DJ Set · Confirmé       │
│  📅 18 mai · 19h30  Porto — Quiz Musical · En attente    │
│  📅 25 mai · 22h00  Islande — Karaoké · À confirmer      │
└─────────────────────────────────────────────────────────┘
```

### Implémentation
- Grille CSS 7 colonnes pour calendrier
- Points colorés sur les jours avec événement (gold si confirmé, amber si pending)
- Clic sur un jour → liste des événements de ce jour dans un panneau latéral ou modal
- Liste "prochains" en bas : 5 prochains événements triés par date

---

## 4. revenus/page.tsx — Revenus (❌ à coder)

### Objectif
Vue financière complète : KPIs, tableau de paiements, cumul annuel.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Revenus · Avril 2026                [< Mois] [Mois >]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Ce mois  │ │  Cumul   │ │Prochain  │ │  Note    │  │
│  │  3 200 € │ │  8 400 € │ │virement  │ │ moy.     │  │
│  │  2 shows │ │  7 shows │ │  5 mai   │ │  ★ 4.85  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Détail des paiements                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Date       Voyage           Montant   Statut     │   │
│  │ 20 avr.   Rome Bella Vita   1 200 €   ✓ Payé    │   │
│  │  5 avr.   Barcelona Latin   2 000 €   ✓ Payé    │   │
│  │ 12 mai    Marrakech DJ      1 200 €   ⏳ À venir │   │
│  │ 18 mai    Porto Quiz          800 €   ⏳ À venir │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Prochains virements                                     │
│  IBAN : FR76 ···· ···· ···· 4821                        │
│  Le 5 mai : 2 000 € (Marrakech + Porto)                 │
└─────────────────────────────────────────────────────────┘
```

### Données démo

```ts
const PAYMENTS = [
  { id:'p1', showTitle:'Rome Bella Vita', date:'2026-04-20', amountCents:120000, status:'PAID' },
  { id:'p2', showTitle:'Barcelona Latin Night', date:'2026-04-05', amountCents:200000, status:'PAID' },
  { id:'p3', showTitle:'Marrakech — DJ Set', date:'2026-05-12', amountCents:120000, status:'UPCOMING' },
  { id:'p4', showTitle:'Porto — Quiz Musical', date:'2026-05-18', amountCents:80000, status:'UPCOMING' },
  { id:'p5', showTitle:'Islande — Karaoké', date:'2026-05-25', amountCents:150000, status:'UPCOMING' },
]
const IBAN_MASKED = 'FR76 ···· ···· ···· 4821'
const NEXT_TRANSFER_DATE = '5 mai 2026'
const NEXT_TRANSFER_AMOUNT = 200000 // 2 000 €
```

---

## 5. documents/page.tsx — Documents (❌ à coder)

### Objectif
Accès à tous les documents officiels : contrats, riders PDF, avenants.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Documents officiels                                     │
├─────────────────────────────────────────────────────────┤
│  [Tous] [Contrats] [Riders] [Avenants] [Divers]         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📋 Contrats de prestation                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📄 Contrat — Marrakech · Signé le 10 avr.       │   │
│  │    Validité : 12 mai 2026 · [PDF ↓] [Voir]      │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ 📄 Contrat — Porto · Signé le 15 avr.           │   │
│  │    Validité : 18 mai 2026 · [PDF ↓] [Voir]      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  🔧 Riders techniques                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📋 Rider DJ Maverick v3 · Mis à jour 1 avr.     │   │
│  │    Statut : Validé par Eventy · [PDF ↓]          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  📜 Avenants & divers                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ aucun document pour le moment                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Données démo

```ts
const DOCUMENTS = [
  { id:'d1', type:'CONTRACT', title:'Contrat prestation — Marrakech', voyage:'Marrakech — Riad & Médina', signedAt:'2026-04-10', validUntil:'2026-05-12', status:'SIGNED' },
  { id:'d2', type:'CONTRACT', title:'Contrat prestation — Porto', voyage:'Porto Summer Vibes', signedAt:'2026-04-15', validUntil:'2026-05-18', status:'SIGNED' },
  { id:'d3', type:'RIDER', title:'Rider DJ Maverick v3', updatedAt:'2026-04-01', status:'VALIDATED_BY_EVENTY' },
  { id:'d4', type:'AVENANT', title:'Avenant durée — Rome (annulé)', signedAt:'2026-03-01', status:'CANCELLED' },
]
```

---

## 6. support/page.tsx — Support (❌ à coder)

### Objectif
Page d'aide avec FAQ accordéon + formulaire de contact.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Support Animateur                                       │
│  Notre équipe répond sous 24h                            │
├─────────────────────────────────────────────────────────┤
│  📞 Urgence le jour J : +33 1 XX XX XX XX               │
│     (réservé aux jours de prestation)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FAQ — Questions fréquentes                              │
│  ─────────────────────────────────────                  │
│  ▼ Comment mettre à jour mon rider technique ?           │
│    Allez dans Rider technique > cliquez Modifier >       │
│    enregistrer. Eventy revalidera sous 48h.              │
│                                                          │
│  ▶ Comment signaler un problème le jour J ?              │
│  ▶ Comment modifier une setlist confirmée ?              │
│  ▶ Quand sont effectués les virements ?                  │
│  ▶ Comment ajouter un show à mon répertoire ?            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Contacter l'équipe Eventy                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Sujet : [___________________________ ▼]          │   │
│  │ Message :                                        │   │
│  │ [________________________________________]       │   │
│  │ [________________________________________]       │   │
│  │ [________________________________________]       │   │
│  │                              [Envoyer →]         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ✉️ Ou par email : animateurs@eventy.life               │
└─────────────────────────────────────────────────────────┘
```

### Sujets du select
- "Problème avec un paiement"
- "Modification de planning"
- "Rider / matériel"
- "Problème le jour J"
- "Autre"

---

## 7. Pages existantes — corrections thème

Pour **toutes** les pages suivantes, remplacer :
- `ACCENT` : `'#ec4899'` ou `'#F97316'` → `'#D4A853'`
- `MAIN_BG` : toute variante → `'#0A0E14'`
- `SIDEBAR_BG` : toute variante → `'#12151C'`
- `CARD_BG` : `'#131820'` → `'rgba(255,255,255,0.04)'`

Pages concernées :
- `dashboard/page.tsx`
- `shows/page.tsx`
- `setlists/page.tsx`
- `rider/page.tsx`
- `repertoire/page.tsx`
- `facturation/page.tsx`
- `compte/page.tsx`
- `login/page.tsx`
- `layout.tsx`

---

## Ordre d'implémentation suggéré

1. `layout.tsx` — thème + sidebar complète (débloque la navigation)
2. `animations/page.tsx` — page principale du portail
3. `planning/page.tsx` — calendrier
4. `revenus/page.tsx` — finance
5. `documents/page.tsx` — documents
6. `support/page.tsx` — support
7. Correction thème des pages existantes (batch)
