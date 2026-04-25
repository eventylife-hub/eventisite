# TODO — Portail Restaurateur (HRA)
> Portail : `frontend/app/(restaurateur)/restaurateur/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · glassmorphism · Framer Motion  
> Date audit : 2026-04-25

---

## Vision Eventy — PLATEFORME MARKETPLACE

> **Eventy = plateforme d'organisation**, pas un employeur.  
> Les créateurs/partenaires sont des **professionnels indépendants à leur propre compte**.  
> Eventy leur fournit les outils pour organiser, vendre et promouvoir leurs voyages/services.  
> Le portail restaurateur = **l'espace de travail du partenaire indépendant sur la marketplace**.

## Modèle organisationnel Eventy

> ⚠️ Eventy n'a **pas d'employés terrain**. Le restaurateur est un **indépendant partenaire HRA**.

| Niveau | Rôle |
|--------|------|
| **Restaurateur indépendant** | Gère son établissement, déclare les repas, facture Eventy |
| **Responsable restauration** | Supervise tous les partenaires, valide déclarations |
| **Admin** | Config tarifaire, permissions, reporting global CA restauration |

---

## Résumé des travaux

| Page | Statut actuel | Action requise | Priorité |
|------|---------------|----------------|----------|
| `page.tsx` | Stub (2L) | Redirect → dashboard (garder) | — |
| `dashboard/page.tsx` | Complet (340L) — thème VERT | **Restyling gold + Framer Motion** | P0 |
| `declarations/page.tsx` | Complet (325L) — thème VERT | **Restyling gold + Framer Motion** | P0 |
| `declarations/[date]/page.tsx` | Complet (564L) — thème VERT | **Restyling gold + Framer Motion** | P0 |
| `commandes/page.tsx` | Stub (2L) | **À construire** | P0 |
| `menus/page.tsx` | Stub (2L) | **À construire** | P0 |
| `reservations/page.tsx` | Stub (2L) | **À construire** | P0 |
| `revenus/page.tsx` | Stub (2L) | **À construire** | P0 |
| `facturation/page.tsx` | Complet (403L) — thème VERT | **Restyling gold + Framer Motion** | P1 |
| `historique/page.tsx` | Complet (301L) — thème VERT | **Restyling gold + Framer Motion** | P1 |
| `incidents/page.tsx` | Complet (412L) — thème VERT | **Restyling gold + Framer Motion** | P1 |
| `compte/page.tsx` | Complet (356L) — thème VERT | **Restyling gold + Framer Motion** | P1 |
| `inscription/page.tsx` | Complet (157L) — thème VERT | **Restyling gold + Framer Motion** | P1 |
| `login/page.tsx` | Complet (183L) — thème VERT | **Restyling gold + Framer Motion** | P1 |
| `mot-de-passe-oublie/page.tsx` | Complet (104L) — thème VERT | **Restyling gold** | P2 |
| `documents/page.tsx` | Stub (2L) | **À construire** | P2 |
| `support/page.tsx` | Stub (2L) | **À construire** | P2 |

---

## Style standard (remplacement VERT → OR)

```tsx
// Avant (vert)
color: '#22c55e'
background: 'linear-gradient(135deg, #16a34a, #22c55e)'
border: '1px solid rgba(34,197,94,0.3)'

// Après (gold)
const GOLD = '#D4A853'
color: GOLD
background: 'linear-gradient(135deg, #b8862a, #D4A853)'
border: `1px solid rgba(212,168,83,0.3)`
```

---

## P0 — dashboard/page.tsx (RESTYLING)

**Statut** : Complet 340L, thème vert → gold + Framer Motion  
**Contenu existant à garder** : services du jour, déclarations en attente, KPIs (anomalies, CA mois, repas servis), prochaine facture, liens rapides

### Enrichissements à apporter

```
┌─────────────────────────────────────────────────────────────────┐
│  🍽️ Bonjour Riad Yasmine !       [Aujourd'hui 25 avril 2025]   │
│  Restaurant HRA Partenaire · Marrakech · 4.7★                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Services auj.│ │ Décl. en att.│ │ CA ce mois   │ │ Repas   │ │
│  │ 3 services   │ │ 2 à valider  │ │ 8 400 €      │ │ 847     │ │
│  │ Déj+Dîner+Gd │ │ ⚠️ 1 anomalie│ │ +12% vs mars │ │ servis  │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌──────────────────────────────┐  ┌────────────────────────────┐│
│  │ SERVICES AUJOURD'HUI         │  │ ALERTES                    ││
│  │                              │  │ ⚠️ Anomalie — Dîner 22/04  ││
│  │ 🌅 07:30 — Petit-déjeuner    │  │    Déclaré 45, attendu 38  ││
│  │    Groupe Marseille · 38 pax │  │    [Répondre]              ││
│  │    ✅ Déclaré                 │  │                            ││
│  │                              │  │ 📄 Facture avril en attente││
│  │ 🍽️ 12:30 — Déjeuner buffet   │  │    Générer avant le 30/04  ││
│  │    Groupe Paris · 52 pax     │  │    [Générer maintenant]    ││
│  │    🟡 À déclarer             │  │                            ││
│  │                              │  │ ✅ Prochain groupe : 2 mai  ││
│  │ 🌙 19:30 — Dîner gala        │  │    Dîner 85 pax — confirmé ││
│  │    Groupe Lyon · 85 pax      │  └────────────────────────────┘│
│  │    🟡 À déclarer             │                                │
│  └──────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

**Framer Motion** : entry stagger sur KPIs, pulse sur alertes critiques, hover cards

---

## P0 — declarations/page.tsx (RESTYLING)

**Statut** : Complet 325L, thème vert → gold + Framer Motion  
**Contenu existant** : liste déclarations groupées par date, filtres, variance pax

### Enrichissements

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 Déclarations de repas          [Ce mois ▾] [Exporter CSV]  │
│  [Toutes] [En attente] [Soumises] [Validées] [Anomalie]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  JEUDI 24 AVRIL 2025                                             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🌅 Petit-déjeuner · 07:30  · Attendu: 38 · Déclaré: 38   │    │
│  │ ✅ Validée · 38 × 12€ = 456€         [Voir détails]       │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ 🍽️ Déjeuner · 12:30       · Attendu: 52 · Déclaré: 54   │    │
│  │ ⚠️ Anomalie +2 pax · En attente validation  [Justifier]  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  MERCREDI 23 AVRIL 2025                                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🌙 Dîner · 19:30          · Attendu: 45 · Déclaré: 45    │    │
│  │ ✅ Validée · 45 × 28€ = 1 260€       [Voir détails]       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  RÉSUMÉ DU MOIS : 847 repas · 18 services · 8 400€              │
└─────────────────────────────────────────────────────────────────┘
```

---

## P0 — declarations/[date]/page.tsx (RESTYLING)

**Statut** : Complet 564L, thème vert → gold + Framer Motion  
**Contenu existant** : formulaire déclaration par service (PDJ/déj/dîner), anti-surfacturation (déclaré ≤ attendu), calcul prix en temps réel, verrou après soumission  
**Framer Motion** : animation slide-in du formulaire, transitions entre services, animation du total

---

## P0 — commandes/page.tsx (À CONSTRUIRE)

**Concept** : Commandes spéciales reçues d'Eventy (repas VIP, régimes spéciaux, demandes particulières)

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📦 Commandes Spéciales             [Filtrer] [Tout marquer lu] │
│  Demandes spécifiques transmises par l'équipe Eventy            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  À TRAITER (3)                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🔴 URGENT · Dîner 2 mai · Groupe Lyon (85 pax)           │    │
│  │ → 4 végétaliens, 2 cœliaques, 1 allergie noix            │    │
│  │ → Menu gala · Service 19:30 · Décoration florale requis  │    │
│  │ Reçu le 24/04 · Délai réponse : 25/04                    │    │
│  │               [Confirmer prise en charge] [Refuser]       │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ 🟡 Déjeuner 5 mai · Groupe Bordeaux (38 pax)             │    │
│  │ → Menu enfants × 6, menu végétarien × 3                  │    │
│  │ → Service à 12:00 · Salle privée requise                 │    │
│  │               [Confirmer prise en charge] [Refuser]       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  TRAITÉES CE MOIS (12)                                           │
│  ✅ Dîner 20/04 · 45 pax · Confirmé + servi                     │
│  ✅ PDJ 18/04 · 32 pax · Confirmé + servi                       │
└─────────────────────────────────────────────────────────────────┘
```

**Champs** : urgence, date service, groupe, régimes alimentaires, spécialités demandées, délai réponse  
**Actions** : confirmer/refuser prise en charge, noter contraintes

---

## P0 — menus/page.tsx (À CONSTRUIRE)

**Concept** : Gestion du catalogue de menus proposés à Eventy (PDJ, déjeuner, dîner, gala)

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🍴 Mes Menus & Formules                         [+ Créer menu] │
│  [Petit-déjeuner] [Déjeuner] [Dîner] [Gala] [Spéciaux]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │ 🌅 PETIT-DÉJEUNER BUFFET │  │ 🍽️ DÉJEUNER TRADITIONNEL     │  │
│  │ ● Actif · 45 fois servi  │  │ ● Actif · 23 fois servi      │  │
│  │ Durée : 1h               │  │ Durée : 1h30                  │  │
│  │ Prix / pax : 12 €        │  │ Prix / pax : 22 €             │  │
│  │ Min. pax : 10            │  │ Min. pax : 15                 │  │
│  │ ─────────────────        │  │ ──────────────────────        │  │
│  │ Inclus :                 │  │ Entrée + Plat + Dessert       │  │
│  │ • Viennoiseries          │  │ + Eau + Café                  │  │
│  │ • Jus frais              │  │ Végétarien : disponible ✅    │  │
│  │ • Fruits de saison       │  │ Vegan : sur demande ⚠️        │  │
│  │ • Fromage / charcuterie  │  │ Sans gluten : non ❌          │  │
│  │ [Modifier] [Désactiver]  │  │ [Modifier] [Désactiver]       │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │ 🌙 DÎNER GALA ORIENTAL   │  │ + NOUVEAU MENU               │  │
│  │ ● Actif · 8 fois servi   │  │ Proposez une formule         │  │
│  │ Durée : 3h               │  │ supplémentaire               │  │
│  │ Prix / pax : 45 €        │  │                              │  │
│  │ Min. pax : 30            │  │ [+ Créer]                    │  │
│  │ [Modifier] [Désactiver]  │  │                              │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Champs par menu** : nom, type, prix/pax, durée, pax min/max, inclusions, régimes dispo  
**Actions** : créer, modifier, activer/désactiver, stats d'utilisation

---

## P0 — reservations/page.tsx (À CONSTRUIRE)

**Concept** : Réservations confirmées à venir — vue planning du restaurateur

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Réservations à venir            [Liste] [Calendrier] [CSV]  │
│                               [Filtrer par mois ▾] [Rechercher] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  MAI 2025                                                         │
│  ┌──────┬──────────┬────────┬──────┬────────┬──────────────────┐ │
│  │ Date │ Service  │ Groupe │ Pax  │ Menu   │ Statut           │ │
│  ├──────┼──────────┼────────┼──────┼────────┼──────────────────┤ │
│  │ 2/05 │ 🌙 Dîner │ Lyon   │ 85   │ Gala   │ ✅ Confirmé      │ │
│  │      │ 19:30    │        │      │ 45€/p  │ 2 végétal. notés │ │
│  ├──────┼──────────┼────────┼──────┼────────┼──────────────────┤ │
│  │ 5/05 │ 🍽️ Déj.  │ Bord.  │ 38   │ Trad.  │ ✅ Confirmé      │ │
│  │      │ 12:00    │        │      │ 22€/p  │ Salle privée     │ │
│  ├──────┼──────────┼────────┼──────┼────────┼──────────────────┤ │
│  │ 8/05 │ 🌅 PDJ   │ Paris  │ 62   │ Buffet │ ⏳ En attente    │ │
│  │      │ 07:30    │        │      │ 12€/p  │ Confirmation PDG │ │
│  └──────┴──────────┴────────┴──────┴────────┴──────────────────┘ │
│                                                                   │
│  Total mai : 8 services · 4 300€ CA prévisionnel                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## P0 — revenus/page.tsx (À CONSTRUIRE)

**Concept** : Dashboard financier restaurateur (modèle direct — pas de 82/18 pour restaurateurs)

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Mes Revenus                     [Avril 2025 ▾] [Exporter]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Avril 2025   │ │ En attente   │ │ Année 2025   │ │ Moyen   │ │
│  │ 8 400 €      │ │ 2 100 €      │ │ 42 800 €     │ │ par pax │ │
│  │ +12% vs mars │ │ 3 factures   │ │ 847 services │ │ 22.4€   │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌──────────────────────────────────┐  ┌─────────────────────┐   │
│  │ ÉVOLUTION 6 MOIS (Recharts Bar)  │  │ PAR TYPE DE SERVICE  │   │
│  │                                  │  │ Dîner gala  45%     │   │
│  │  Nov  Déc  Jan  Fév  Mar  Avr    │  │ Déjeuner    32%     │   │
│  │  ███  ██   ████ ███  ████ █████  │  │ Petit-déj   23%     │   │
│  └──────────────────────────────────┘  └─────────────────────┘   │
│                                                                   │
│  HISTORIQUE PAIEMENTS                                             │
│  ┌──────┬─────────────────────┬────────────┬────────────────────┐ │
│  │ Date │ Description          │ Montant    │ Statut             │ │
│  ├──────┼─────────────────────┼────────────┼────────────────────┤ │
│  │ 30/04│ Facture avril 2025  │ 8 400 €    │ ✅ Payé 30/04      │ │
│  │ 30/03│ Facture mars 2025   │ 7 500 €    │ ✅ Payé 30/03      │ │
│  │ 30/02│ Facture fév. 2025   │ 6 800 €    │ ✅ Payé 28/02      │ │
│  └──────┴─────────────────────┴────────────┴────────────────────┘ │
│                                                                   │
│  ℹ️  Paiement : virement fin de mois M+1 sur facture mensuelle   │
│     Taux TVA restauration : 10% (TVA sur marge si applicable)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## P1 — facturation/page.tsx (RESTYLING)

**Statut** : Complet 403L — riche et détaillé  
**Contenu existant** : facture mensuelle consolidée NET30, breakdown repas, téléchargement PDF, statuts  
**Travail** : vert → gold + Framer Motion sur les accordéons et tableaux

---

## P1 — historique/page.tsx (RESTYLING)

**Statut** : Complet 301L — liste par mois avec expandables  
**Travail** : vert → gold + Framer Motion sur les dépliages/animations d'entrée

---

## P1 — incidents/page.tsx (RESTYLING)

**Statut** : Complet 412L — gestion anomalies avec niveaux de sévérité  
**Contenu existant** : déclaré vs ajusté, commentaires validateur, textarea réponse restaurant  
**Travail** : vert → gold + Framer Motion + badge sévérité animé (pulse sur critique)

---

## P1 — compte/page.tsx (RESTYLING)

**Statut** : Complet 356L — profil complet  
**Contenu existant** : infos resto, contact, coordonnées bancaires (IBAN masqué), notifs email/SMS  
**Travail** : vert → gold + Framer Motion + photo établissement

---

## P2 — documents/page.tsx (À CONSTRUIRE)

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 Documents                                  [Uploader]        │
│  [Contrats] [Agréments] [Assurances] [Factures]                 │
├─────────────────────────────────────────────────────────────────┤
│  CONTRATS ACTIFS                                                  │
│  📄 Convention partenariat HRA 2025     ✅ Signé — 01/01/2025   │
│  📄 Conditions tarifaires 2025          ✅ Signé — 01/01/2025   │
│                                                                   │
│  DOCUMENTS LÉGAUX                                                 │
│  📄 Kbis restaurant                     ✅ Valide               │
│  📄 Licence IV / Grande licence         ✅ Valide — exp. 12/25  │
│  📄 Assurance RC Pro                    ✅ Valide — exp. 12/25  │
│  📄 Certificat hygiène HACCP            ✅ 2025                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## P2 — support/page.tsx (À CONSTRUIRE)

Même structure que animateur/support — formulaire contact, liens rapides, tickets ouverts.

---

## À CRÉER : Vue Responsable Restauration (dans portail équipe)

> Route : `frontend/app/(equipe)/equipe/restauration/` (existe déjà — stub 134L thème orange)

### Maquette responsable

```
┌─────────────────────────────────────────────────────────────────┐
│  🍽️ Supervision Restauration         [Export] [+ Programmer]    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Partenaires  │ │ Services auj.│ │ Anomalies    │ │ CA mois │ │
│  │ 8 actifs     │ │ 12 services  │ │ 3 ouvertes   │ │ 38 400€ │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  SERVICES AUJOURD'HUI (tous partenaires)                         │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Riad Yasmine — Dîner 19:30 · 85 pax · 🟡 À déclarer      │    │
│  │ La Mamounia — Déjeuner 12:30 · 120 pax · ✅ Déclaré       │    │
│  │ Le Nobu — PDJ 07:30 · 38 pax · ✅ Validé                  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ANOMALIES À VALIDER                                              │
│  ⚠️ Riad Yasmine — Dîner 22/04 · Déclaré 54 vs attendu 52       │
│     [Accepter ajustement] [Refuser] [Contacter partenaire]       │
│                                                                   │
│  PLANNING SEMAINE (tous établissements)                           │
│  [Vue calendrier multi-partenaires]                              │
└─────────────────────────────────────────────────────────────────┘
```

**Actions responsable** : valider anomalies, planifier groupes → restaurants, contacter partenaire, reporting mensuel

---

## À CRÉER : Vue Admin Restauration (dans portail équipe)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Admin — Restauration HRA        [Config] [Permissions]      │
├─────────────────────────────────────────────────────────────────┤
│  REPORTING GLOBAL                                                 │
│  CA restauration 2025 : 184 000€   Partenaires actifs : 8        │
│  Repas servis : 4 230   Note moy. : 4.6★   Incidents : 7 (6 rés)│
│                                                                   │
│  GESTION DES PARTENAIRES                                          │
│  ● Activer / suspendre accès partenaire                          │
│  ● Modifier tarification (override grille)                       │
│  ● Paramétrer règles anti-surfacturation                         │
│  ● Exporter base partenaires + historique                        │
│                                                                   │
│  CONFIGURATION MÉTIER                                             │
│  ● Grille tarifaire par type de service (PDJ/déj/dîner/gala)    │
│  ● Seuils d'anomalie (% variance déclenchant alerte)            │
│  ● Templates emails partenaires restauration                     │
│  ● Règles d'attribution restaurants → groupes (proximité, capa) │
└─────────────────────────────────────────────────────────────────┘
```

---

## Notes d'implémentation

- `'use client'` sur toutes les pages
- Framer Motion : `import { motion, AnimatePresence } from 'framer-motion'`
- Anti-surfacturation : règle critique — déclaré ≤ attendu (ne pas assouplir sans accord David)
- Verrou déclaration : après soumission, lecture seule sauf override responsable
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Modèle tarifaire : prix fixe/pax par type de service (pas de 82/18 pour HRA restauration)
