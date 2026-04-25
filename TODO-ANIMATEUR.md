# TODO — Portail ANIMATEUR

> Audit du 2026-04-25
> Style cible : dark `#0A0E14` · gold `#D4A853` · glassmorphism
> Apostrophes JSX : `&apos;` dans le texte, `'` dans le code JS
>
> **MODÈLE MARKETPLACE** : les animateurs sont des **indépendants partenaires** à leur compte, pas des employés Eventy. Eventy leur fournit la plateforme et les missions. Modèle 82/18 (82% marge Eventy, 18% reversé au prestataire sur la marge).
> Le terme "équipier terrain" ne s'applique PAS ici. Les 3 niveaux sont :
> 1. **Indépendant / Pro** — le portail de l'animateur partenaire (portail actuel `/animateur/`)
> 2. **Coordinateur Eventy** — employé Eventy qui supervise le réseau de partenaires
> 3. **Admin Eventy** — accès total, config, reporting, RBAC

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

## Ordre d'implémentation suggéré (niveau INDÉPENDANT)

1. `layout.tsx` — thème + sidebar complète (débloque la navigation)
2. `animations/page.tsx` — page principale du portail
3. `planning/page.tsx` — calendrier
4. `revenus/page.tsx` — finance
5. `documents/page.tsx` — documents
6. `support/page.tsx` — support
7. Correction thème des pages existantes (batch)

---

## NIVEAU 2 — Vue COORDINATEUR ANIMATION (Eventy interne)

> Route : `/animateur/responsable/`
> Qui : **employé Eventy** avec rôle `COORDINATEUR_ANIMATION` — supervise le réseau d'animateurs indépendants partenaires
> ⚠️ Ce n'est PAS un animateur — c'est un coordinateur interne Eventy qui gère les affectations et la qualité
> Architecture : sous-dossier dans le portail animateur, sidebar distincte

### État actuel
Inexistant — tout est à créer.

### Pages à créer (6)

| Page | Route | Priorité |
|------|-------|---------|
| Dashboard superviseur | `/animateur/responsable` | P0 |
| Planning global | `/animateur/responsable/planning` | P0 |
| Validation | `/animateur/responsable/validation` | P0 |
| Équipe | `/animateur/responsable/equipe` | P1 |
| Reporting | `/animateur/responsable/reporting` | P1 |
| Matching voyages | `/animateur/responsable/matching` | P2 |

### Layout COORDINATEUR

Sidebar distincte (badge "Coordinateur Animation" en haut) :

```
Coordination
  📊 Dashboard          /animateur/responsable
  🗓️  Planning global    /animateur/responsable/planning
  ✅ Validation          /animateur/responsable/validation
  🔀 Matching voyages    /animateur/responsable/matching

Réseau partenaires
  👥 Partenaires         /animateur/responsable/equipe
  📈 Reporting           /animateur/responsable/reporting

→ Retour vue standard
```

---

### R1. Dashboard superviseur

```
┌─────────────────────────────────────────────────────────┐
│  Supervision Animation · Mai 2026              [⚙️ Config]│
│  Responsable : Sophie Martin                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Animatrs │ │ Shows ce │ │ À valider│ │ Note moy.│  │
│  │ actifs   │ │ mois     │ │          │ │          │  │
│  │   12     │ │   28     │ │    4     │ │  ★ 4.82  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Voyages sans animateur assigné                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ⚠️  Islande Mystica · 25 mai · Type: Karaoké      │   │
│  │     Cherche animateur — 18 pax · Reykjavik        │   │
│  │     [Assigner] [Voir profils disponibles]         │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ ⚠️  Athènes Summer · 2 juin · Type: DJ Set        │   │
│  │     Cherche animateur — 30 pax · Athènes          │   │
│  │     [Assigner] [Voir profils disponibles]         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Alertes équipe                                          │
│  → DJ Maxime Aubert : rider non validé (délai 2j)       │
│  → DJ Nova : setlist manquante pour Marrakech 12 mai    │
└─────────────────────────────────────────────────────────┘
```

---

### R2. Planning global multi-animateurs

```
┌─────────────────────────────────────────────────────────┐
│  Planning global · Mai 2026          [< Mois] [Mois >]  │
│  [Vue Gantt] [Vue calendrier] [Vue liste]                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Animateur          1  2  3  4 ... 12 ... 18 ... 25    │
│  ─────────────────────────────────────────────────────  │
│  DJ Maxime Aubert   ·  ·  ·  ·    ███     ·     ·      │
│  DJ Nova            ·  ·  ·  ·    ·       ███   ·      │
│  Lucie Girard (MC)  ·  ·  ·  ·    ·       ·     ·      │
│  Marc Dj Bounce     ·  ·  ·  ·    ·       ·     ███    │
│  (LIBRE)            ·  ·  ·  ·    ·       ·     ·      │
│                                                          │
│  Légende : ███ Assigné · ░░░ À assigner · ··· Libre    │
│                                                          │
│  Voyage sans animateur                                   │
│  [Islande 25 mai — À assigner] → [Assigner →]           │
└─────────────────────────────────────────────────────────┘
```

---

### R3. Validation (setlists, riders, profils)

```
┌─────────────────────────────────────────────────────────┐
│  File de validation · 4 éléments                         │
├─────────────────────────────────────────────────────────┤
│  [Setlists (2)] [Riders (1)] [Profils (1)]               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ✅ Setlists à valider                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🎵 Setlist "Marrakech Oriental Night" — DJ Nova   │   │
│  │    22 tracks · 3h · BPM moy: 124 · Énergie: 4/5 │   │
│  │    [Voir détails] [✓ Valider] [✗ Refuser]        │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ 🎵 Setlist "Porto Sunset" — DJ Maxime             │   │
│  │    18 tracks · 2h30 · BPM moy: 118               │   │
│  │    [Voir détails] [✓ Valider] [✗ Refuser]        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  🔧 Riders à valider                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🔧 Rider v4 — Marc Dj Bounce                     │   │
│  │    3 exigences nouvelles vs v3 · [Voir diff]     │   │
│  │    [✓ Valider] [✗ Demander correction]           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### R4. Équipe animateurs

```
┌─────────────────────────────────────────────────────────┐
│  Équipe · 12 animateurs actifs              [+ Inviter]  │
├─────────────────────────────────────────────────────────┤
│  [Actifs] [En mission] [En congé] [Blacklistés]          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Nom              Type      Shows  Note    Statut        │
│  ────────────────────────────────────────────────────── │
│  DJ Maxime Aubert DJ        27     ★4.88   🟢 Actif     │
│  DJ Nova          DJ+MC     19     ★4.75   🟢 Actif     │
│  Lucie Girard     Animation  8     ★4.90   🟢 Disponible│
│  Marc Dj Bounce   DJ        12     ★4.60   🟡 En mission│
│                                                          │
│  [Voir profil] [Voir planning] [Contacter] [Suspendre]  │
└─────────────────────────────────────────────────────────┘
```

---

### R5. Reporting qualité

```
┌─────────────────────────────────────────────────────────┐
│  Reporting Animation · T2 2026               [Export]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  KPIs T2                                                 │
│  Shows réalisés : 28 · Annulations : 1 (3.4%)           │
│  Note moyenne clients : 4.82 / 5                        │
│  CA généré animateurs : 42 400 €                        │
│  Marge Eventy (82%) : 34 768 €                          │
│                                                          │
│  Top performers                                          │
│  ① DJ Maxime Aubert — ★ 4.88 — 27 shows               │
│  ② Lucie Girard — ★ 4.90 — 8 shows                    │
│  ③ DJ Nova — ★ 4.75 — 19 shows                        │
│                                                          │
│  Alertes qualité                                         │
│  → Marc Dj Bounce : note en baisse (4.40 ce mois)       │
│  → 1 setlist refusée (contenu inadapté)                 │
│                                                          │
│  [Export CSV] [Envoyer rapport à David]                  │
└─────────────────────────────────────────────────────────┘
```

**Données démo :**
```ts
const TEAM = [
  { id:'t1', name:'DJ Maxime Aubert', type:'DJ', showsTotal:27, showsMois:2, rating:4.88, status:'ACTIF', tauxAnnulation:4 },
  { id:'t2', name:'DJ Nova',          type:'DJ_MC', showsTotal:19, showsMois:1, rating:4.75, status:'ACTIF', tauxAnnulation:0 },
  { id:'t3', name:'Lucie Girard',     type:'ANIMATION', showsTotal:8, showsMois:1, rating:4.90, status:'ACTIF', tauxAnnulation:0 },
  { id:'t4', name:'Marc Dj Bounce',   type:'DJ', showsTotal:12, showsMois:2, rating:4.60, status:'EN_MISSION', tauxAnnulation:8 },
]
```

---

## NIVEAU 3 — Vue ADMIN

> Route : `/admin/metiers/animateur/` (portail admin Eventy)
> Qui : administrateur Eventy — accès total, configuration, reporting financier, RBAC
> **État actuel** : 1 page existe à `/admin/metiers/animateur/page.tsx` (thème rose `#ec4899`, contenu partiel — prestataires + employés + planning basique)

### Corrections à apporter à la page existante
- Changer `ACCENT = '#ec4899'` → `'#D4A853'` (gold)
- Compléter les sections existantes (prestataires, planning)
- Ajouter onglets manquants

### Sous-pages à créer

| Page | Route | Contenu |
|------|-------|---------|
| Tarifs & grilles | `/admin/metiers/animateur/tarifs` | Grilles tarifaires DJ Set / MC / Animation / Karaoké |
| Permissions | `/admin/metiers/animateur/permissions` | RBAC : qui peut valider les setlists, assigner les animateurs |
| Config | `/admin/metiers/animateur/config` | Délais validation, seuils d'alerte, types d'animation autorisés |
| Reporting financier | `/admin/metiers/animateur/reporting` | CA total, marge 82/18, top prestataires, analyse qualité |
| Blacklist | `/admin/metiers/animateur/blacklist` | Animateurs suspendus, raisons, historique |

---

### A1. Page existante — améliorations

La page actuelle a 3 onglets : Prestataires · Équipe interne · Planning.

**Ajouter l'onglet Budget/Finance** :

```
┌─────────────────────────────────────────────────────────┐
│  Admin — Métier Animateur        [Prestataires][Équipe]  │
│                             [Planning][Budget][Config]   │
├─────────────────────────────────────────────────────────┤
│  Budget · Onglet Finance                                 │
│                                                          │
│  CA Animateurs (YTD) : 84 800 €                         │
│  Marge Eventy 82%    : 69 536 €                         │
│  Reversé prestataires (18%) : 15 264 €                  │
│                                                          │
│  Top 5 par CA                                            │
│  DJ Maxime Aubert    22 000 €  27 shows  4.88           │
│  Marc Dj Bounce       9 600 €  12 shows  4.60           │
│  DJ Nova              7 200 €  19 shows  4.75           │
│                                                          │
│  [Export comptabilité] [Voir factures en attente]       │
└─────────────────────────────────────────────────────────┘
```

---

### A2. Tarifs & Grilles tarifaires

```
┌─────────────────────────────────────────────────────────┐
│  Grilles tarifaires — Animateurs          [+ Nouvelle]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Type                Tarif/h HT    Frais dépl.  Équipt  │
│  ───────────────────────────────────────────────────── │
│  DJ Set Standard       200 €         0.20 €/km   Non    │
│  DJ Set Premium        350 €         0.20 €/km   Non    │
│  DJ + MC               280 €         0.20 €/km   Non    │
│  Quiz Musical          180 €         0.20 €/km   Non    │
│  Karaoké géré          160 €         0.20 €/km   Non    │
│  Initiation danse      220 €         0.20 €/km   Non    │
│  Live musique          400 €         0.20 €/km   Oui    │
│                                                          │
│  Modèle reversement : 82% Eventy / 18% prestataire      │
│  (s'applique sur la marge, pas sur le coût total)        │
│  [Modifier] [Historique des tarifs]                      │
└─────────────────────────────────────────────────────────┘
```

---

### A3. Config métier

```
┌─────────────────────────────────────────────────────────┐
│  Configuration — Métier Animateur                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Délais de validation                                    │
│  Setlist à soumettre avant le show : [48] heures         │
│  Rider à valider avant contrat    : [72] heures          │
│  Profil complet requis avant 1er show : [oui]            │
│                                                          │
│  Seuils d'alerte                                         │
│  Note moyenne minimum acceptable  : [4.0] / 5           │
│  Taux annulation max avant sanction : [15] %             │
│  Nombre de refus setlist avant examen : [2]              │
│                                                          │
│  Types d'animation actifs                                │
│  ☑ DJ Set  ☑ DJ+MC  ☑ Quiz Musical  ☑ Karaoké          │
│  ☑ Initiation danse  ☐ Live Band (désactivé)            │
│                                                          │
│  [Sauvegarder]                                           │
└─────────────────────────────────────────────────────────┘
```

**Données démo :**
```ts
const TARIFS = [
  { type:'DJ_SET_STANDARD', labelFR:'DJ Set Standard', tarifHourHT:20000, kmRateCents:20, equipment:false },
  { type:'DJ_SET_PREMIUM',  labelFR:'DJ Set Premium',  tarifHourHT:35000, kmRateCents:20, equipment:false },
  { type:'DJ_MC',           labelFR:'DJ + MC',         tarifHourHT:28000, kmRateCents:20, equipment:false },
  { type:'QUIZ_MUSICAL',    labelFR:'Quiz Musical',    tarifHourHT:18000, kmRateCents:20, equipment:false },
  { type:'KARAOKE',         labelFR:'Karaoké géré',    tarifHourHT:16000, kmRateCents:20, equipment:false },
  { type:'DANSE',           labelFR:'Initiation danse',tarifHourHT:22000, kmRateCents:20, equipment:false },
]
```

---

## Ordre d'implémentation global (3 niveaux)

### Phase A — Indépendant partenaire (priorité max)
1. `layout.tsx` — thème gold + sidebar complète
2. `animations/page.tsx`
3. `planning/page.tsx`
4. `revenus/page.tsx`
5. `documents/page.tsx`
6. `support/page.tsx`
7. Correction thème pages existantes

### Phase B — Coordinateur Eventy
8. `animateur/responsable/layout.tsx` — sidebar coordinateur
9. `animateur/responsable/page.tsx` — dashboard coordinateur
10. `animateur/responsable/planning/page.tsx` — Gantt multi-animateurs
11. `animateur/responsable/validation/page.tsx` — file de validation
12. `animateur/responsable/equipe/page.tsx` — gestion équipe
13. `animateur/responsable/reporting/page.tsx` — reporting qualité

### Phase C — Admin
14. Corriger thème + ajouter onglet Finance sur la page admin existante
15. `admin/metiers/animateur/tarifs/page.tsx`
16. `admin/metiers/animateur/config/page.tsx`
17. `admin/metiers/animateur/reporting/page.tsx`
18. `admin/metiers/animateur/permissions/page.tsx`
19. `admin/metiers/animateur/blacklist/page.tsx`
