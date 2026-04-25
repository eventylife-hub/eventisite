# TODO — Portail RESTAURATEUR

> Audit du 2026-04-25
> Style cible : dark `#0A0E14` · gold `#D4A853` · glassmorphism
> Apostrophes JSX : `&apos;` dans le texte, `'` dans le code JS
>
> **MODÈLE MARKETPLACE** : les restaurateurs sont des **indépendants partenaires** à leur compte (propriétaires/gérants de restaurant), pas des employés Eventy. Eventy leur confie les services repas pour les groupes de voyageurs. Modèle 82/18 (82% marge Eventy, 18% reversé sur la marge).
> Les 3 niveaux sont :
> 1. **Indépendant / Pro** — le portail du restaurateur partenaire (portail actuel `/restaurateur/`)
> 2. **Coordinateur Eventy** — employé Eventy qui supervise le réseau de partenaires restaurateurs
> 3. **Admin Eventy** — accès total, config, reporting, RBAC

---

## État actuel

| Page | Fichier | État |
|------|---------|------|
| Layout sidebar | `restaurateur/layout.tsx` | ⚠️ Thème amber `#D97706`, sidebar incomplète |
| Login | `restaurateur/login/page.tsx` | ⚠️ Thème à corriger |
| Dashboard | `restaurateur/dashboard/page.tsx` | ✅ Complet (vert `#22c55e`) — conserver la logique, corriger le thème gold |
| Déclarations | `restaurateur/declarations/page.tsx` | ✅ Complet — corriger thème |
| Déclaration [date] | `restaurateur/declarations/[date]/page.tsx` | ✅ Complet — corriger thème |
| Historique | `restaurateur/historique/page.tsx` | ✅ Complet — corriger thème |
| Incidents | `restaurateur/incidents/page.tsx` | ✅ Complet — corriger thème |
| Facturation | `restaurateur/facturation/page.tsx` | ✅ Complet — corriger thème |
| Menus | `restaurateur/menus/page.tsx` | ❌ Placeholder vide |
| Commandes | `restaurateur/commandes/page.tsx` | ❌ Placeholder vide |
| Réservations | `restaurateur/reservations/page.tsx` | ❌ Placeholder vide |
| Revenus | `restaurateur/revenus/page.tsx` | ❌ Placeholder vide |
| Documents | `restaurateur/documents/page.tsx` | ❌ Placeholder vide |
| Support | `restaurateur/support/page.tsx` | ❌ Placeholder vide |
| Compte | `restaurateur/compte/page.tsx` | ⚠️ À vérifier + thème |
| **Stocks** | — | ❌ Page manquante (à créer) |
| **Planning** | — | ❌ Page manquante (à créer) |

---

## 1. layout.tsx — Navigation sidebar

### Problèmes
- `ACCENT = '#D97706'` (amber) → doit être `'#D4A853'` (gold)
- `SIDEBAR_BG = '#1A0F00'` → `'#12151C'`
- `MAIN_BG = '#100A00'` → `'#0A0E14'`
- Sidebar liste uniquement 5 sections — manquent : Déclarations, Historique, Incidents, Stocks, Planning, Facturation, Compte

### Nouvelle structure sidebar

```
Principal
  🏠 Dashboard             /restaurateur
  📋 Déclarations          /restaurateur/declarations
  📅 Planning              /restaurateur/planning

Service
  🍽️  Menus                /restaurateur/menus
  🛒 Commandes             /restaurateur/commandes
  🪑 Réservations          /restaurateur/reservations
  📦 Stocks                /restaurateur/stocks

Historique & Qualité
  🗂️  Historique           /restaurateur/historique
  ⚠️  Incidents            /restaurateur/incidents

Finance & Compte
  💰 Revenus               /restaurateur/revenus
  🧾 Facturation           /restaurateur/facturation
  📄 Documents             /restaurateur/documents
  👤 Mon compte            /restaurateur/compte

Aide
  🛟 Support               /restaurateur/support
```

---

## 2. menus/page.tsx — Mes Menus (❌ à coder)

### Objectif
Gestion des menus et formules proposés aux groupes Eventy. Afficher, activer/désactiver, voir le détail par formule.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Mes Menus & Formules              [+ Nouveau menu]      │
│  4 menus actifs · 1 archivé                              │
├─────────────────────────────────────────────────────────┤
│  [Tous] [Petit-déjeuner] [Déjeuner] [Dîner] [Buffet]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ☀️ Menu Petit-déjeuner Marrakech · ACTIF        │    │
│  │ 📍 Riad El Fenn · 22 € / pers. HT               │    │
│  │ Inclus : jus frais, viennoiseries, œufs, fruits │    │
│  │ Allergènes : gluten, œufs, lait                 │    │
│  │ Voyages liés : 3 · Dernière commande : 12 mai   │    │
│  │ [Modifier] [Voir commandes] [Désactiver]         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🌞 Menu Déjeuner Tajine Premium · ACTIF          │    │
│  │ 📍 Riad El Fenn · 38 € / pers. HT               │    │
│  │ Inclus : entrée, tajine au choix, dessert, thé   │    │
│  │ Allergènes : gluten, sésame                      │    │
│  │ Voyages liés : 2 · Dernière commande : 12 mai    │    │
│  │ [Modifier] [Voir commandes] [Désactiver]         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🌙 Menu Dîner Marocain · ACTIF                  │    │
│  │ 📍 Riad El Fenn · 55 € / pers. HT               │    │
│  │ Inclus : mezze, pastilla, couscous royal, pastry │    │
│  │ Allergènes : gluten, fruits à coque              │    │
│  │ Voyages liés : 2 · Dernière commande : 12 mai    │    │
│  │ [Modifier] [Voir commandes] [Désactiver]         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Données démo

```ts
const MENUS = [
  { id:'m1', type:'BREAKFAST', name:'Petit-déjeuner Marrakech', priceHT:2200, includes:['jus frais','viennoiseries','œufs brouillés','plateau de fruits'], allergens:['gluten','œufs','lait'], active:true, linkedTravels:3, lastOrder:'2026-05-12' },
  { id:'m2', type:'LUNCH', name:'Déjeuner Tajine Premium', priceHT:3800, includes:['soupe harira','tajine au choix x3','corbeille de pain','dessert pastry','thé à la menthe'], allergens:['gluten','sésame'], active:true, linkedTravels:2, lastOrder:'2026-05-12' },
  { id:'m3', type:'DINNER', name:'Dîner Marocain Royal', priceHT:5500, includes:['mezze 6 pièces','pastilla poulet','couscous royal 7 légumes','pastries maison','thé'], allergens:['gluten','fruits à coque'], active:true, linkedTravels:2, lastOrder:'2026-05-12' },
  { id:'m4', type:'BUFFET', name:'Buffet Découverte', priceHT:4500, includes:['12 plats chauds et froids','salades','desserts variés'], allergens:['gluten','lait'], active:true, linkedTravels:1, lastOrder:'2026-04-20' },
  { id:'m5', type:'LUNCH', name:'Menu Ramadan (archivé)', priceHT:3500, includes:['soupe','dattes','plat'], allergens:['gluten'], active:false, linkedTravels:0, lastOrder:'2026-03-15' },
]
```

---

## 3. commandes/page.tsx — Commandes Eventy (❌ à coder)

### Objectif
Liste des commandes de repas reçues d'Eventy, par voyage et par service.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Commandes Eventy                                        │
│  3 commandes actives · 2 voyages en cours                │
├─────────────────────────────────────────────────────────┤
│  [Toutes] [Actives] [Terminées]                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📦 Marrakech — Riad & Médina · 12–19 mai 2026          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Service    Menu                    PAX  Montant  │   │
│  │ Petit-déj  Petit-déjeuner Marrakech  22  484 €   │   │
│  │ Déjeuner   Tajine Premium            22  836 €   │   │
│  │ Dîner      Dîner Marocain Royal      22  1 210 € │   │
│  │                          Total voyage : 2 530 €  │   │
│  │ [Confirmer réception] [Voir détails]              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  📦 Porto Summer Vibes · 18–25 mai 2026                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Service    Menu                    PAX  Montant  │   │
│  │ Dîner      Menu Dîner Porto (Quinta) 35  1 925 € │   │
│  │                          Total voyage :  1 925 € │   │
│  │ [En attente confirmation Eventy]                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Données démo

```ts
const ORDERS = [
  {
    id:'o1', travelTitle:'Marrakech — Riad & Médina', travelDates:'12–19 mai 2026', status:'CONFIRMED',
    lines:[
      { service:'BREAKFAST', menuName:'Petit-déjeuner Marrakech', pax:22, unitPriceHT:2200, totalHT:48400 },
      { service:'LUNCH',     menuName:'Déjeuner Tajine Premium',  pax:22, unitPriceHT:3800, totalHT:83600 },
      { service:'DINNER',    menuName:'Dîner Marocain Royal',     pax:22, unitPriceHT:5500, totalHT:121000 },
    ]
  },
  {
    id:'o2', travelTitle:'Porto Summer Vibes', travelDates:'18–25 mai 2026', status:'PENDING_CONFIRMATION',
    lines:[
      { service:'DINNER', menuName:'Menu Dîner Porto (Quinta do Crasto)', pax:35, unitPriceHT:5500, totalHT:192500 },
    ]
  },
]
```

---

## 4. reservations/page.tsx — Réservations (❌ à coder)

### Objectif
Vue des réservations de tables/salles liées aux groupes de voyageurs Eventy.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Réservations de tables                                  │
│  5 réservations · 3 à venir                              │
├─────────────────────────────────────────────────────────┤
│  [À venir] [Passées] [Annulées]                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📅 12 mai 2026 · 08h00  Petit-déjeuner           │   │
│  │ 👥 22 personnes · Salle Jasmin (capacité 30)     │   │
│  │ Voyage : Marrakech — Riad & Médina               │   │
│  │ Référence : EVT-2026-MAR-001 · [CONFIRMÉE ✓]    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📅 12 mai 2026 · 13h00  Déjeuner                 │   │
│  │ 👥 22 personnes · Terrasse Palmeraie (cap. 40)   │   │
│  │ Voyage : Marrakech — Riad & Médina               │   │
│  │ Référence : EVT-2026-MAR-002 · [CONFIRMÉE ✓]    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📅 18 mai 2026 · 20h00  Dîner                    │   │
│  │ 👥 35 personnes · Grande salle (capacité 50)     │   │
│  │ Voyage : Porto Summer Vibes                      │   │
│  │ Référence : EVT-2026-POR-001 · [EN ATTENTE]     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 5. revenus/page.tsx — Revenus (❌ à coder)

### Objectif
Vue financière : CA mensuel, comparaison N-1, ventilation par type de service, calendrier des paiements.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Revenus · Avril 2026                [< Mois] [Mois >]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Ce mois  │ │ Cumul    │ │ Repas    │ │Prochain  │  │
│  │ 1 840 €  │ │ 9 200 €  │ │ servis   │ │paiement  │  │
│  │ NET HT   │ │ YTD      │ │  1 240   │ │  5 mai   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Répartition par service (avril)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                     │
│  ☀️ Petit-déjeuner ████░░░░░░  22 % · 405 €            │
│  🌞 Déjeuner       ████████░░  45 % · 828 €            │
│  🌙 Dîner          ██████░░░░  33 % · 607 €            │
│                                                          │
│  Historique des paiements (NET30 FDM)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Période    Montant NET   Statut    Date paiement │   │
│  │ Mars 2026   1 640 €      ✓ Payé    5 avr. 2026  │   │
│  │ Avr. 2026   1 840 €      ⏳ Prévu  5 mai 2026   │   │
│  │ Mai 2026    2 240 €      📋 Estimé  5 juin 2026  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  IBAN : FR76 ···· ···· ···· 7293                        │
└─────────────────────────────────────────────────────────┘
```

### Données démo

```ts
const MONTHLY_REVENUE = [
  { month:'Janv.', amountCents:142000 },
  { month:'Févr.', amountCents:168000 },
  { month:'Mars',  amountCents:164000 },
  { month:'Avr.',  amountCents:184000 },
]
const PAYMENTS = [
  { period:'Mars 2026', amountCents:164000, status:'PAID', paymentDate:'2026-04-05' },
  { period:'Avr. 2026', amountCents:184000, status:'UPCOMING', paymentDate:'2026-05-05' },
  { period:'Mai 2026',  amountCents:224000, status:'ESTIMATED', paymentDate:'2026-06-05' },
]
const SERVICE_BREAKDOWN = [
  { service:'BREAKFAST', pct:22, amountCents:40480 },
  { service:'LUNCH',     pct:45, amountCents:82800 },
  { service:'DINNER',    pct:33, amountCents:60720 },
]
```

---

## 6. stocks/page.tsx — Stocks (❌ page à créer)

### Objectif
Suivi des stocks alimentaires pour préparer les commandes Eventy. Alertes de seuil bas.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Gestion des stocks                      [+ Mouvement]  │
│  ⚠️ 2 produits sous le seuil d'alerte                   │
├─────────────────────────────────────────────────────────┤
│  [Tous] [Frais] [Sec] [Boissons] [Consommables]         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Produits · Frais                                        │
│  ┌────────────────────────────────────────────────┐     │
│  │ Produit          Qté    Unité   Seuil  Statut  │     │
│  │ Œufs frais       180    unité     50    ✓ OK   │     │
│  │ Lait entier        8    litre      5    ✓ OK   │     │
│  │ Yaourt nature    ⚠️ 3  kg         10   ⚠️ BAS │     │
│  │ Poulet (filets)   12    kg         8    ✓ OK   │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Produits · Sec                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ Farine               ⚠️ 2  kg       5   ⚠️ BAS │     │
│  │ Riz basmati           15  kg       8    ✓ OK   │     │
│  │ Pois chiches          10  kg       5    ✓ OK   │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Prochain réapprovisionnement suggéré                    │
│  → Yaourt nature : commander 20 kg minimum              │
│  → Farine : commander 15 kg minimum                     │
└─────────────────────────────────────────────────────────┘
```

### Données démo

```ts
const STOCKS = [
  { id:'s1', name:'Œufs frais', category:'FRAIS', qty:180, unit:'unité', threshold:50, status:'OK' },
  { id:'s2', name:'Lait entier', category:'FRAIS', qty:8, unit:'litre', threshold:5, status:'OK' },
  { id:'s3', name:'Yaourt nature', category:'FRAIS', qty:3, unit:'kg', threshold:10, status:'LOW' },
  { id:'s4', name:'Poulet (filets)', category:'FRAIS', qty:12, unit:'kg', threshold:8, status:'OK' },
  { id:'s5', name:'Farine', category:'SEC', qty:2, unit:'kg', threshold:5, status:'LOW' },
  { id:'s6', name:'Riz basmati', category:'SEC', qty:15, unit:'kg', threshold:8, status:'OK' },
  { id:'s7', name:'Pois chiches', category:'SEC', qty:10, unit:'kg', threshold:5, status:'OK' },
  { id:'s8', name:'Eau minérale', category:'BOISSONS', qty:48, unit:'bouteille', threshold:24, status:'OK' },
  { id:'s9', name:'Jus d\'orange', category:'BOISSONS', qty:12, unit:'litre', threshold:6, status:'OK' },
]
```

---

## 7. planning/page.tsx — Planning (❌ page à créer)

### Objectif
Calendrier mensuel des services planifiés : quels jours, quels services (PDJ/Déjeuner/Dîner), combien de PAX.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Planning · Mai 2026                 [< Mois] [Mois >]  │
│  12 services planifiés · 2 voyages                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Lun  Mar  Mer  Jeu  Ven  Sam  Dim                      │
│                              1    2    3                 │
│                                                          │
│    4    5    6    7    8    9   10                       │
│                                                          │
│   11  [12]  13   14   15   16   17                      │
│       ☀️🌞🌙                                             │
│       (PDJ+Dej+Din)                                     │
│                                                          │
│   18  [19]  20   21   22   23   24                      │
│        🌙                                               │
│        (Dîner seulement)                                │
│                                                          │
│   25   26   27   28   29   30   31                      │
├─────────────────────────────────────────────────────────┤
│  Détail : 12 mai 2026                                    │
│  ─────────────────────────────────────                  │
│  ☀️ 08h00 Petit-déjeuner · 22 pax · Menu Marrakech      │
│  🌞 13h00 Déjeuner        · 22 pax · Menu Tajine        │
│  🌙 20h00 Dîner           · 22 pax · Menu Dîner Royal   │
└─────────────────────────────────────────────────────────┘
```

### Implémentation
- Même logique que le calendrier animateur
- Légende icônes : ☀️ PDJ · 🌞 Déjeuner · 🌙 Dîner
- Clic sur un jour → panneau latéral ou section en bas avec le détail des services
- Badge en coin de chaque case : nombre de services prévus ce jour

---

## 8. documents/page.tsx — Documents (❌ à coder)

### Objectif
Accès aux contrats partenaire Eventy, attestations, fiches techniques.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Documents officiels                                     │
├─────────────────────────────────────────────────────────┤
│  [Tous] [Contrats] [Attestations] [Fiches techniques]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📋 Contrats partenaire                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📄 Contrat partenaire Eventy 2026               │   │
│  │    Signé le 15 janv. 2026 · Validité : 31 déc.  │   │
│  │    [PDF ↓] [Voir en ligne]                       │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ 📄 Avenant N°1 — Extension capacité              │   │
│  │    Signé le 1 mars 2026 · [PDF ↓]               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  📜 Attestations & certifications                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ✅ Attestation hygiène HACCP · Valide 2026       │   │
│  │ ✅ Certificat assurance RC Pro · Valide 2026     │   │
│  │ ⚠️  Attestation TVA · Expire le 30 juin 2026    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  🔧 Fiches techniques menus                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📋 Fiche allergènes — Menus Marrakech · [PDF ↓] │   │
│  │ 📋 Fiche valeurs nutritionnelles · [PDF ↓]       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 9. support/page.tsx — Support (❌ à coder)

### Objectif
FAQ accordéon + formulaire de contact Eventy + numéro d'urgence.

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────┐
│  Support Restaurateur                                    │
│  Réponse sous 24h ouvrées                                │
├─────────────────────────────────────────────────────────┤
│  📞 Urgence le jour du service : +33 1 XX XX XX XX      │
├─────────────────────────────────────────────────────────┤
│  FAQ — Questions fréquentes                              │
│  ─────────────────────────────────────                  │
│  ▼ Comment signaler une anomalie de PAX ?               │
│    Allez dans Déclarations > sélectionnez le service >  │
│    cliquez "Signaler une anomalie". Notre équipe         │
│    recontactera le voyageur et mettra à jour le PAX.    │
│                                                          │
│  ▶ Comment modifier un menu après validation ?           │
│  ▶ Quand suis-je payé (NET30 FDM) ?                     │
│  ▶ Comment ajouter un menu à mon catalogue ?             │
│  ▶ Que faire en cas d'allergie non déclarée ?           │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Nous contacter                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Sujet : [_________________________ ▼]            │   │
│  │ Message :                                        │   │
│  │ [________________________________________]       │   │
│  │ [________________________________________]       │   │
│  │                             [Envoyer →]          │   │
│  └──────────────────────────────────────────────────┘   │
│  ✉️ restaurateurs@eventy.life                           │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Pages existantes — corrections thème

Remplacer dans **toutes** les pages suivantes :
- `ACCENT` amber/vert → `'#D4A853'` (gold)
- `MAIN_BG` variante marron → `'#0A0E14'`
- `SIDEBAR_BG` variante marron → `'#12151C'`
- Conserver la logique métier (déclarations, incidents, facturation)

Pages concernées :
- `layout.tsx` (sidebar couleurs + items manquants)
- `login/page.tsx`
- `dashboard/page.tsx` (KPI cards : conserver logique, changer couleur d'accent de vert→gold sauf alertes)
- `declarations/page.tsx`
- `declarations/[date]/page.tsx`
- `historique/page.tsx`
- `incidents/page.tsx`
- `facturation/page.tsx`
- `compte/page.tsx`

---

## Ordre d'implémentation suggéré (niveau INDÉPENDANT)

1. `layout.tsx` — thème gold + sidebar complète avec tous les liens
2. `menus/page.tsx` — cœur du portail
3. `commandes/page.tsx` — commandes reçues d'Eventy
4. `stocks/page.tsx` — nouveau fichier à créer
5. `planning/page.tsx` — nouveau fichier à créer
6. `reservations/page.tsx`
7. `revenus/page.tsx`
8. `documents/page.tsx`
9. `support/page.tsx`
10. Correction thème pages existantes (batch)

---

## NIVEAU 2 — Vue COORDINATEUR RESTAURATION (Eventy interne)

> Route : `/restaurateur/responsable/`
> Qui : coordinateur interne Eventy avec rôle `RESPONSABLE_RESTAURATION`
> Rôle : supervise le réseau de restaurateurs partenaires indépendants, valide les déclarations, gère les incidents, pilote la qualité
> ⚠️ Ce n'est PAS un manager de restaurant — c'est un employé Eventy qui coordonne les partenaires

### État actuel
Inexistant — tout est à créer.

### Pages à créer (5)

| Page | Route | Priorité |
|------|-------|---------|
| Dashboard superviseur | `/restaurateur/responsable` | P0 |
| Validation déclarations | `/restaurateur/responsable/validation` | P0 |
| Partenaires | `/restaurateur/responsable/partenaires` | P1 |
| Incidents | `/restaurateur/responsable/incidents` | P1 |
| Reporting | `/restaurateur/responsable/reporting` | P2 |

### Layout COORDINATEUR

```
Coordination
  📊 Dashboard          /restaurateur/responsable
  ✅ Validation          /restaurateur/responsable/validation
  ⚠️  Incidents          /restaurateur/responsable/incidents

Réseau partenaires
  🍽️  Partenaires        /restaurateur/responsable/partenaires
  📈 Reporting           /restaurateur/responsable/reporting

→ Retour vue standard
```

---

### C1. Dashboard coordinateur restauration

```
┌─────────────────────────────────────────────────────────┐
│  Coordination Restauration · Mai 2026                    │
│  Coordinatrice : Amélie Blanc                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Partenaires│ │ Déclarat.│ │Anomalies │ │ CA mois  │  │
│  │ actifs   │ │ à valider│ │ ouvertes │ │          │  │
│  │    8     │ │    6     │ │    2     │ │ 14 800 € │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Services du jour — Vue globale                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Restaurant           Voyage         PAX   Statut │   │
│  │ Riad El Fenn         Marrakech       22   ✓ OK   │   │
│  │ Quinta do Crasto     Porto           35   ⏳ PEN │   │
│  │ Acqua e Farina       Rome            28   ✓ OK   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Alertes urgentes                                        │
│  → Quinta do Crasto : déjeuner non déclaré (délai 30m)  │
│  → Riad El Fenn : anomalie PAX dîner à traiter          │
└─────────────────────────────────────────────────────────┘
```

---

### C2. Validation déclarations

```
┌─────────────────────────────────────────────────────────┐
│  Validation des déclarations · 6 en attente              │
├─────────────────────────────────────────────────────────┤
│  [En attente (6)] [Validées (48)] [Anomalies (2)]        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🌙 Riad El Fenn — Dîner · 12 mai 2026           │   │
│  │    Attendus : 22 · Déclarés : 20 (écart -2)      │   │
│  │    Voyage : Marrakech — Riad & Médina             │   │
│  │    [✓ Valider 20] [⚠️ Créer anomalie] [Contacter]│   │
│  ├──────────────────────────────────────────────────┤   │
│  │ ☀️ Quinta do Crasto — PDJ · 18 mai 2026          │   │
│  │    Attendus : 35 · Déclarés : 35                 │   │
│  │    Voyage : Porto Summer Vibes                   │   │
│  │    [✓ Valider] [Voir détails]                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### C3. Partenaires restaurateurs

```
┌─────────────────────────────────────────────────────────┐
│  Réseau restaurateurs · 8 partenaires actifs  [+ Inviter]│
├─────────────────────────────────────────────────────────┤
│  [Actifs] [En période d'essai] [Suspendus]               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Nom               Ville        Voyages  Note  Statut   │
│  ──────────────────────────────────────────────────────  │
│  Riad El Fenn      Marrakech      12     ★4.9  🟢 Actif │
│  Quinta do Crasto  Porto           8     ★4.7  🟢 Actif │
│  Acqua e Farina    Rome            6     ★4.8  🟢 Actif │
│  Hotel Arts (rest) Barcelone       4     ★4.5  🟡 Essai │
│                                                          │
│  [Voir profil] [Planning] [Contacter] [Suspendre]        │
└─────────────────────────────────────────────────────────┘
```

---

### C4. Reporting qualité restauration

```
┌─────────────────────────────────────────────────────────┐
│  Reporting Restauration · T2 2026            [Export]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Repas servis : 1 240 · Anomalies : 8 (0.6%)            │
│  Taux validation J0 : 94%                               │
│  Note moyenne clients : 4.78 / 5                        │
│  CA réseau : 44 400 € · Marge Eventy 82% : 36 408 €    │
│                                                          │
│  Top performers                                          │
│  ① Riad El Fenn — ★ 4.90 — 12 voyages — 0 incident     │
│  ② Acqua e Farina — ★ 4.80 — 6 voyages — 1 incident    │
│  ③ Quinta do Crasto — ★ 4.70 — 8 voyages — 2 incidents │
│                                                          │
│  Alertes qualité                                         │
│  → Hotel Arts (Barcelone) : note en baisse (4.45)       │
│  → 2 anomalies de PAX non résolues > 48h                │
│                                                          │
│  [Export CSV] [Rapport mensuel PDF]                     │
└─────────────────────────────────────────────────────────┘
```

**Données démo :**
```ts
const PARTNERS = [
  { id:'r1', name:'Riad El Fenn', city:'Marrakech', country:'MA', travelsTotal:12, rating:4.9, status:'ACTIF', incidents:0 },
  { id:'r2', name:'Quinta do Crasto', city:'Porto', country:'PT', travelsTotal:8, rating:4.7, status:'ACTIF', incidents:2 },
  { id:'r3', name:'Acqua e Farina', city:'Rome', country:'IT', travelsTotal:6, rating:4.8, status:'ACTIF', incidents:1 },
  { id:'r4', name:'Restaurant Hotel Arts', city:'Barcelone', country:'ES', travelsTotal:4, rating:4.5, status:'TRIAL', incidents:1 },
]
```

---

## NIVEAU 3 — Vue ADMIN

> Route : `/admin/metiers/restaurateur/` (portail admin Eventy)
> Qui : administrateur Eventy — accès total, configuration, reporting financier, RBAC
> **État actuel** : ❌ Aucune page n'existe — à créer entièrement
> (À la différence de l'animateur qui a déjà 1 page admin)

### Pages à créer (5)

| Page | Route | Contenu |
|------|-------|---------|
| Vue principale | `/admin/metiers/restaurateur` | Dashboard admin : réseau partenaires, KPIs, alertes, planning global |
| Tarifs & grilles | `/admin/metiers/restaurateur/tarifs` | Tarifs par type de service, marges, TVA restauration |
| Permissions | `/admin/metiers/restaurateur/permissions` | RBAC : qui valide les déclarations, qui gère les incidents |
| Config | `/admin/metiers/restaurateur/config` | Délais déclaration, seuils anomalie, types de service autorisés |
| Reporting financier | `/admin/metiers/restaurateur/reporting` | CA total, marge 82/18, top partenaires, analyse qualité |

---

### A1. Page principale admin restaurateur

```
┌─────────────────────────────────────────────────────────┐
│  Admin — Métier Restaurateur                             │
│  [Partenaires] [Planning] [Finance] [Config]             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ─── Onglet Partenaires ───                             │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Partenaires│ │ Actifs   │ │Voyages   │ │ CA total │  │
│  │  total   │ │          │ │ ce mois  │ │  YTD     │  │
│  │   8      │ │    7     │ │    5     │ │ 44 400 € │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Partenaires par statut                                  │
│  Actifs : 7 · Essai : 1 · Suspendus : 0 · Blacklist : 0│
│                                                          │
│  Voyages à couvrir sans restaurant assigné               │
│  → Islande 25 mai : restaurant non assigné              │
│  → Santorin 5 juin : restaurant non assigné             │
│  [Assigner un partenaire →]                              │
└─────────────────────────────────────────────────────────┘
```

---

### A2. Tarifs & grilles tarifaires

```
┌─────────────────────────────────────────────────────────┐
│  Grilles tarifaires — Restauration        [+ Nouvelle]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Service             Tarif/pers HT  TVA   Inclus        │
│  ──────────────────────────────────────────────────────  │
│  Petit-déjeuner          15–25 €     10%  Boissons      │
│  Déjeuner (formule)      25–45 €     10%  Eau, café     │
│  Dîner (formule)         40–70 €     10%  Eau, café     │
│  Buffet découverte       35–60 €     10%  Boissons      │
│  Dîner gastronomique     70–120 €    10%  Eau, vins     │
│                                                          │
│  Modèle reversement : 82% Eventy / 18% partenaire       │
│  (marge nette Eventy après reversement)                  │
│  [Modifier] [Historique]                                 │
└─────────────────────────────────────────────────────────┘
```

---

### A3. Config métier

```
┌─────────────────────────────────────────────────────────┐
│  Configuration — Métier Restaurateur                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Délais de déclaration                                   │
│  Petit-déjeuner : déclarer avant [10]h00                 │
│  Déjeuner       : déclarer avant [15]h00                 │
│  Dîner          : déclarer avant [23]h00                 │
│  Tolérance écart PAX sans anomalie : [± 2] personnes     │
│                                                          │
│  Seuils d'alerte                                         │
│  Note moyenne minimum acceptable   : [4.0] / 5          │
│  Anomalies max/mois avant examen   : [3]                 │
│  Taux déclaration J0 minimum       : [90] %              │
│                                                          │
│  Services activés                                        │
│  ☑ Petit-déjeuner  ☑ Déjeuner  ☑ Dîner  ☑ Buffet      │
│  ☐ Brunch (désactivé)  ☐ Cocktail (désactivé)           │
│                                                          │
│  [Sauvegarder]                                           │
└─────────────────────────────────────────────────────────┘
```

**Données démo :**
```ts
const TARIFS_RESTO = [
  { type:'BREAKFAST', labelFR:'Petit-déjeuner', minHT:1500, maxHT:2500, tva:10, drinksIncluded:true },
  { type:'LUNCH',     labelFR:'Déjeuner',       minHT:2500, maxHT:4500, tva:10, drinksIncluded:false },
  { type:'DINNER',    labelFR:'Dîner',           minHT:4000, maxHT:7000, tva:10, drinksIncluded:false },
  { type:'BUFFET',    labelFR:'Buffet',          minHT:3500, maxHT:6000, tva:10, drinksIncluded:true },
  { type:'GASTRO',    labelFR:'Dîner gastro',    minHT:7000, maxHT:12000, tva:10, drinksIncluded:true },
]
```

---

## Ordre d'implémentation global (3 niveaux)

### Phase A — Indépendant partenaire (priorité max)
1. `layout.tsx` — thème gold + sidebar complète
2. `menus/page.tsx`
3. `commandes/page.tsx`
4. `stocks/page.tsx` (nouveau)
5. `planning/page.tsx` (nouveau)
6. `reservations/page.tsx`
7. `revenus/page.tsx`
8. `documents/page.tsx`
9. `support/page.tsx`
10. Correction thème pages existantes

### Phase B — Coordinateur Eventy
11. `restaurateur/responsable/layout.tsx`
12. `restaurateur/responsable/page.tsx` — dashboard
13. `restaurateur/responsable/validation/page.tsx`
14. `restaurateur/responsable/partenaires/page.tsx`
15. `restaurateur/responsable/incidents/page.tsx`
16. `restaurateur/responsable/reporting/page.tsx`

### Phase C — Admin Eventy
17. `admin/metiers/restaurateur/page.tsx` (créer)
18. `admin/metiers/restaurateur/tarifs/page.tsx`
19. `admin/metiers/restaurateur/config/page.tsx`
20. `admin/metiers/restaurateur/reporting/page.tsx`
21. `admin/metiers/restaurateur/permissions/page.tsx`
