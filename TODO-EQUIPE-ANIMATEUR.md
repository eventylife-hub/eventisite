# TODO — Portail Animateur
> Portail : `frontend/app/(animateur)/animateur/`  
> Style cible : dark `bg-[#0A0E14]` · gold `#D4A853` · glassmorphism · Framer Motion  
> Date audit : 2026-04-25

---

## Résumé des travaux

| Page | Statut actuel | Action requise | Priorité |
|------|---------------|----------------|----------|
| `page.tsx` | Stub (2L) | Redirect → dashboard (OK, laisser) | — |
| `dashboard/page.tsx` | Complet (130L) — thème ROSE | **Restyling gold + Framer Motion** | P0 |
| `planning/page.tsx` | Stub (3L) | **À construire** | P0 |
| `shows/page.tsx` | Complet (86L) — thème ROSE | **Restyling gold + Framer Motion** | P0 |
| `animations/page.tsx` | Stub (3L) | **À construire** | P0 |
| `revenus/page.tsx` | Stub (3L) | **À construire** | P0 |
| `compte/page.tsx` | Complet (149L) — thème ROSE | **Restyling gold + Framer Motion** | P1 |
| `documents/page.tsx` | Stub (2L) | **À construire** | P1 |
| `facturation/page.tsx` | Complet (71L) — thème ROSE | **Restyling gold + Framer Motion** | P1 |
| `login/page.tsx` | Complet (60L) — thème ROSE | **Restyling gold + Framer Motion** | P1 |
| `repertoire/page.tsx` | Complet (100L) — thème ROSE | **Restyling gold + Framer Motion** | P1 |
| `rider/page.tsx` | Complet (88L) — thème ROSE | **Restyling gold + Framer Motion** | P2 |
| `setlists/page.tsx` | Complet (126L) — thème ROSE | **Restyling gold + Framer Motion** | P2 |
| `support/page.tsx` | Stub (2L) | **À construire** | P2 |

---

## Style standard à appliquer (TOUTES les pages)

```tsx
// Palette
const GOLD = '#D4A853'
const GOLD_BG = 'rgba(212,168,83,0.08)'
const GOLD_BORDER = 'rgba(212,168,83,0.2)'
const BG = '#0A0E14'
const CARD = 'rgba(255,255,255,0.04)'

// Layout de base
<div style={{ minHeight: '100vh', background: BG, fontFamily: 'Space Grotesk, sans-serif' }}>

// Carte glass
<motion.div style={{
  background: CARD,
  border: `1px solid rgba(255,255,255,0.08)`,
  borderRadius: 12,
  backdropFilter: 'blur(8px)',
}} whileHover={{ scale: 1.01, borderColor: GOLD_BORDER }}>

// Animation entry standard
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
```

---

## P0 — dashboard/page.tsx (RESTYLING)

**Statut** : Complet logique, thème rose → gold  
**Travail** : Remplacer `#ec4899` → `#D4A853`, ajouter Framer Motion, enrichir données

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🎭 Bonjour Sofia !          [Disponible ●]    [Modifier statut] │
│  Animatrice de soirées · 4.9★ · 127 shows                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Prochain show│ │ Ce mois      │ │ Note globale │ │ Revenus │ │
│  │ Sam 3 mai    │ │ 8 shows      │ │ ⭐ 4.9 / 5   │ │ 4 200€  │ │
│  │ Marrakech    │ │ +2 vs mois-1 │ │ 127 avis     │ │ +18% ↑  │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐   │
│  │ PROCHAINS SHOWS (7 jours)   │  │ ALERTES                  │   │
│  │                             │  │ ● Rider manquant         │   │
│  │ ▶ Sam 03/05 — Marrakech     │  │   Show Athens 10/05      │   │
│  │   Soirée Orientale · 22:00  │  │ ● Paiement en attente    │   │
│  │   120 pax · Scène ext.      │  │   Facture #ANI-2025-031  │   │
│  │                             │  │ ○ Setlist à valider      │   │
│  │ ▶ Jeu 08/05 — Athènes       │  │   Greek Night 08/05      │   │
│  │   Greek Night · 21:30       │  └──────────────────────────┘   │
│  │   95 pax · Salle de bal     │                                  │
│  │                             │  ┌──────────────────────────┐   │
│  │ ▶ Ven 16/05 — Barcelone     │  │ CALENDRIER (semaine)     │   │
│  │   Soirée Flamenco · 22:00   │  │ Lun Mar Mer Jeu Ven Sam  │   │
│  │   200 pax · Terrasse        │  │  .   .   .  [8]  .  [3] │   │
│  └─────────────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**KPIs** : prochain show (date + destination), shows ce mois, note globale, revenus mois  
**Sections** : liste prochains shows (7j), alertes actives, mini-calendrier semaine  
**Framer Motion** : stagger entry sur KPIs, hover sur cartes shows  

---

## P0 — planning/page.tsx (À CONSTRUIRE)

**Statut** : Stub 3L → page complète  
**Concept** : Planning mensuel des shows + indisponibilités

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Planning · Mai 2025         [◀ Avril] [Mai ▾] [Juin ▶]      │
│                          [Vue Mois] [Vue Semaine] [+ Indispo]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Lun    Mar    Mer    Jeu    Ven    Sam    Dim                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │    │ │    │ │    │ │  1 │ │  2 │ │🎭3 │ │  4 │              │
│  │    │ │    │ │    │ │    │ │    │ │MAR │ │    │              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │  5 │ │  6 │ │  7 │ │🎭8 │ │  9 │ │ 10 │ │ 11 │              │
│  │    │ │    │ │    │ │ATH │ │    │ │PREP│ │    │              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘              │
│  ... (suite calendrier) ...                                       │
│                                                                   │
│  LÉGENDE : 🎭 Show confirmé  ✈ Déplacement  🔒 Indisponible     │
│            📋 Préparation    ⏳ En attente confirmation           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ DÉTAIL — Sam 3 mai (click sur jour)                         │ │
│  │ 🎭 Soirée Orientale · Marrakech · 22:00-02:00               │ │
│  │ 120 participants · Scène extérieure · Coordinateur : Yassir │ │
│  │ Rider : ✅ soumis · Setlist : ✅ validée · Tenue : ✅        │ │
│  │ [Voir détails complets]  [Télécharger rider]                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Types d'événements** : Show confirmé, Préparation, Déplacement, Indisponibilité perso  
**Interactions** : click jour → drawer détail, toggle vue mois/semaine, marquer indispo  
**Framer Motion** : slide calendrier gauche/droite, fade détail  

---

## P0 — shows/page.tsx (RESTYLING)

**Statut** : Complet logique, thème rose → gold  
**Travail** : Remplacer `#ec4899` → gold, ajouter Framer Motion

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🎭 Mes Shows                                   [+ Proposer]    │
│  [Tous] [À venir] [Terminés] [En attente]       🔍 Rechercher   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ SAM 3 MAI 2025 · MARRAKECH                    ● CONFIRMÉ  │  │
│  │ Soirée Orientale — Riad Salam                              │  │
│  │ 22:00-02:00 · 120 pax · 450€ brut · 81€ Eventy/18%        │  │
│  │ Note prévisionnelle : — · Rider : ✅ · Setlist : ✅         │  │
│  │                              [Rider PDF] [Détails] [→]     │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ JEU 8 MAI 2025 · ATHÈNES                      ● CONFIRMÉ  │  │
│  │ Greek Night — Hôtel Electra Palace                         │  │
│  │ 21:30-01:00 · 95 pax · 380€ brut · 68.4€ Eventy/18%       │  │
│  │ Note prévisionnelle : — · Rider : ⚠️ manquant · Setlist : ✅│  │
│  │                              [Rider PDF] [Détails] [→]     │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ VEN 21 AVR 2025 · BARCELONE                  ✅ TERMINÉ    │  │
│  │ Soirée Flamenco — Hôtel Arts Barcelona                     │  │
│  │ 22:00-02:00 · 200 pax · 560€ brut · 100.8€ Eventy/18%     │  │
│  │ Note reçue : ⭐⭐⭐⭐⭐ 5.0 · Commentaire client : "Parfait!" │  │
│  │                              [Voir avis] [Télécharger]     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Page 1/4 · 12 shows                  [◀] [1] [2] [3] [4] [▶]  │
└─────────────────────────────────────────────────────────────────┘
```

**Colonnes** : date/destination, nom show, durée/pax, montants (brut 82/18), statut rider, note reçue  
**Actions** : télécharger rider PDF, voir détails, noter show terminé  

---

## P0 — animations/page.tsx (À CONSTRUIRE)

**Statut** : Stub 3L → page complète  
**Concept** : Répertoire des types d'animations proposées + gestion des offres

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🌟 Mes Animations                              [+ Ajouter]     │
│  Définissez vos spécialités pour recevoir les bons shows        │
├─────────────────────────────────────────────────────────────────┤
│  [Toutes] [Soirées thématiques] [DJ Sets] [Anima enfants] [Autre]│
│                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ 🌙 SOIRÉE ORIENTALE │  │ 🎶 DJ SET            │               │
│  │ ★ Spécialité #1     │  │ ★ Spécialité #2      │               │
│  │ Durée : 2h-4h       │  │ Durée : 3h-5h        │               │
│  │ Pax : 50-300        │  │ Pax : 100-500        │               │
│  │ Tarif : 300-600€    │  │ Tarif : 400-800€     │               │
│  │ 23 shows réalisés   │  │ 18 shows réalisés    │               │
│  │ Note : ⭐ 4.9        │  │ Note : ⭐ 4.8         │               │
│  │ [Modifier] [Actif ●]│  │ [Modifier] [Actif ●] │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ 💃 SOIRÉE FLAMENCO  │  │ + NOUVELLE ANIMATION │               │
│  │ ★ Spécialité #3     │  │                      │               │
│  │ Durée : 1h30-3h     │  │ Décrivez une nouvelle│               │
│  │ Pax : 50-200        │  │ spécialité pour      │               │
│  │ Tarif : 250-500€    │  │ élargir vos offres   │               │
│  │ 12 shows réalisés   │  │                      │               │
│  │ Note : ⭐ 4.7        │  │ [+ Créer]            │               │
│  │ [Modifier] [Actif ●]│  │                      │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ STATS GLOBALES                                               │ │
│  │ 3 spécialités actives · 53 shows · Note moyenne 4.8★        │ │
│  │ Thématique la + demandée : Soirées Orientales (43%)          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Champs** : nom, durée min/max, pax min/max, tarif fourchette, notes reçues, nb shows  
**Actions** : activer/désactiver, modifier, stats globales  

---

## P0 — revenus/page.tsx (À CONSTRUIRE)

**Statut** : Stub 3L → page complète  
**Concept** : Dashboard financier animateur (modèle 18% brut Eventy)

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Mes Revenus                     [Avril 2025 ▾] [Exporter]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Ce mois      │ │ En attente   │ │ Année 2025   │ │ Moyen   │ │
│  │ 4 200 €      │ │ 1 140 €      │ │ 18 600 €     │ │ par show│ │
│  │ +18% vs mars │ │ 3 shows      │ │ 42 shows     │ │ 443 €   │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│                                                                   │
│  ┌──────────────────────────────────┐                            │
│  │ ÉVOLUTION 6 MOIS (barres)        │  ┌──────────────────────┐  │
│  │  5000│        ████              │  │ RÉPARTITION          │  │
│  │  4000│   ████ ████ ████         │  │ Soirées Orient. 43%  │  │
│  │  3000│ █ ████ ████ ████         │  │ DJ Sets      35%     │  │
│  │  2000│ █ ████ ████ ████         │  │ Flamenco     22%     │  │
│  │   Nov  Dec  Jan  Fev  Mar  Avr  │  └──────────────────────┘  │
│  └──────────────────────────────────┘                            │
│                                                                   │
│  DÉTAIL DES PAIEMENTS                                            │
│  ┌──────┬──────────────┬───────┬────────┬───────┬─────────────┐  │
│  │ Date │ Show         │ Ville │ Brut   │ 18%   │ Statut      │  │
│  ├──────┼──────────────┼───────┼────────┼───────┼─────────────┤  │
│  │ 30/04│ Soirée Orient│ Marra.│ 450 €  │ 81 €  │ ✅ Payé     │  │
│  │ 30/04│ Greek Night  │ Athèn.│ 380 €  │ 68 €  │ ✅ Payé     │  │
│  │ 30/04│ Soirée Feste │ Barce.│ 560 €  │101 €  │ ⏳ En cours │  │
│  │ 15/05│ Beach Party  │ Ibiza │ 620 €  │112 €  │ ⏳ À venir  │  │
│  └──────┴──────────────┴───────┴────────┴───────┴─────────────┘  │
│                                                                   │
│  ℹ️  Rémunération : 18% de la marge Eventy sur chaque show       │
│     Paiement : virement mensuel le dernier jour du mois          │
└─────────────────────────────────────────────────────────────────┘
```

**Note** : Appliquer modèle 82/18 — 18% = part brut animateur sur marge Eventy  
**Chart** : Recharts BarChart 6 mois + PieChart répartition par type  
**Tableau** : date, show, ville, montant brut, part animateur 18%, statut paiement  

---

## P1 — documents/page.tsx (À CONSTRUIRE)

**Concept** : Contrats, fiches techniques, attestations, CGU

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 Mes Documents                              [Uploader]        │
│  [Contrats] [Riders tech.] [Attestations] [Facturation]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CONTRATS ACTIFS                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 📄 Contrat cadre Eventy 2025     [PDF] ✅ Signé — 01/01  │    │
│  │ 📄 Avenant conditions spéciales  [PDF] ✅ Signé — 15/03  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  RIDERS TECHNIQUES (par show)                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 📄 Rider — Soirée Orientale v3   [PDF] · Modifié 20/04   │    │
│  │ 📄 Rider — DJ Set standard v2    [PDF] · Modifié 10/03   │    │
│  │ 📄 Rider — Flamenco v1          [PDF] · Modifié 05/01   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ATTESTATIONS & CERTIFICATIONS                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 📄 Kbis / Statut auto-entrepreneur  ✅ Valide             │    │
│  │ 📄 Assurance RC Pro                 ✅ Valide — exp. 12/25│    │
│  │ 📄 Casier judiciaire               ✅ 2024                │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## P1 — compte/page.tsx (RESTYLING)

**Statut** : Complet 149L, thème rose → gold  
**Travail** : Remplacer rose → or, ajouter Framer Motion, enrichir profil artiste

Sections existantes à garder : genres musicaux, types d'animation, langues, réseaux sociaux, biographie  
Ajouter : photo profil, stats rapides (note, shows), carte bancaire (IBAN masqué)

---

## P1 — facturation/page.tsx (RESTYLING)

**Statut** : Complet 71L, thème rose → gold  
**Travail** : Remplacer rose → or, ajouter Framer Motion, enrichir données

Données actuelles : liste factures + montants + statuts → enrichir avec breakdown show-par-show, date paiement prévisionnelle

---

## P2 — rider/page.tsx (RESTYLING)

**Statut** : Complet 88L, thème rose → gold  
**Sections existantes** : équipement son, lumières, loge, restauration artiste  
**Travail** : Restyling gold + Framer Motion + ajouter bouton export PDF

---

## P2 — setlists/page.tsx (RESTYLING)

**Statut** : Complet 126L, thème rose → gold  
**Sections existantes** : tracks, BPM, énergie par piste, durée totale  
**Travail** : Restyling gold + Framer Motion + couleur énergie (basse/med/haute)

---

## P2 — support/page.tsx (À CONSTRUIRE)

### Maquette textuelle

```
┌─────────────────────────────────────────────────────────────────┐
│  🎧 Support Animateur                                            │
│  Une question ? Notre équipe répond en moins de 2h              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌───────────────────────────────────┐ │
│  │ AIDE RAPIDE          │  │ CONTACTER L'ÉQUIPE                │ │
│  │ ● Modifier mon rider │  │ Sujet : [_____________________▾]  │ │
│  │ ● Annuler un show    │  │                                   │ │
│  │ ● Problème paiement  │  │ Message :                         │ │
│  │ ● Changer mes dispo  │  │ [                              ]  │ │
│  │ ● Contrat / CGU      │  │ [                              ]  │ │
│  └──────────────────────┘  │                     [Envoyer →]  │ │
│                            └───────────────────────────────────┘ │
│                                                                   │
│  MES TICKETS OUVERTS                                              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ #TKT-456 · Paiement manquant mars    🟡 En cours · 2j    │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

---

## Vision Eventy — PLATEFORME MARKETPLACE

> **Eventy = plateforme d'organisation**, pas un employeur.  
> L'animateur est un **professionnel indépendant à son propre compte**.  
> Eventy lui fournit les outils pour trouver des missions, gérer son planning et se faire payer.  
> Ce portail = **son espace de travail sur la marketplace Eventy**.

---

## Modèle organisationnel Eventy — IMPORTANT

> ⚠️ Eventy n'a **pas d'employés terrain**. 100% indépendants.

| Niveau | Rôle | Accès |
|--------|------|-------|
| **Indépendant / Créateur** | Réalise les shows, voyages, activités | Son portail métier (ce portail animateur) |
| **Responsable** | Supervision, validation, planning | Vue élargie sur son périmètre |
| **Admin** | Config, permissions, reporting global | Accès total + outils admin |

Les vues "équipier terrain employé" sont une **option future uniquement**.

---

## À CRÉER : Pages Responsable Animateur

> Route suggérée : `frontend/app/(equipe)/equipe/activites/` (déjà existant) ou nouveau sous-portail

### responsable-animateurs/page.tsx (À CRÉER dans portail équipe)

```
┌─────────────────────────────────────────────────────────────────┐
│  🎭 Supervision Animateurs         [Exporter] [+ Attribuer show] │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ Actifs     │ │ Shows mois │ │ Note moy.  │ │ Incidents    │  │
│  │ 12 anim.   │ │ 34 shows   │ │ ⭐ 4.8      │ │ 1 en cours  │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
│                                                                   │
│  LISTE ANIMATEURS + DISPONIBILITÉS                               │
│  ┌──────┬───────────────┬────────────┬───────┬────────┬────────┐ │
│  │ Nom  │ Spécialité    │ Prochain   │ Note  │ Statut │ Action │ │
│  ├──────┼───────────────┼────────────┼───────┼────────┼────────┤ │
│  │Sofia │ Soirées Ori.  │ 3 mai MAR  │ 4.9★  │ ✅Dispo │ [→]   │ │
│  │Marco │ DJ / Electro  │ 8 mai ATH  │ 4.7★  │ ✅Dispo │ [→]   │ │
│  │Elena │ Flamenco      │ Indispo    │ 4.8★  │ 🔴Indis │ [→]   │ │
│  └──────┴───────────────┴────────────┴───────┴────────┴────────┘ │
│                                                                   │
│  VALIDATION EN ATTENTE                                            │
│  ● Rider manquant : Sofia — Show Athens 10/05  [Relancer] [→]   │
│  ● Setlist non validée : Marco — Beach Party   [Valider]  [→]   │
└─────────────────────────────────────────────────────────────────┘
```

**Actions** : attribuer show à animateur, valider riders, relancer indisponibilités, planning global

---

### admin-animateurs/page.tsx (À CRÉER dans portail équipe)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Admin — Animateurs             [Config] [Permissions] [Logs] │
├─────────────────────────────────────────────────────────────────┤
│  REPORTING GLOBAL                                                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ CA animateurs 2025 : 78 400 €   Part Eventy : 82%         │    │
│  │ Part brut animateurs : 18% → 14 112 € versés             │    │
│  │ Retards paiement : 0   Incidents : 3 (résolus)           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  GESTION DES ACCÈS                                                │
│  ● Activer / suspendre compte animateur                          │
│  ● Modifier taux de rémunération (override 18%)                  │
│  ● Logs de connexion et activité                                 │
│  ● Exporter base animateurs (CSV/PDF)                            │
│                                                                   │
│  CONFIGURATION MÉTIER                                             │
│  ● Types d'animations disponibles (catalogue)                    │
│  ● Critères de notation et pondération                          │
│  ● Templates emails animateurs                                   │
│  ● Règles d'attribution automatique shows                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Notes d'implémentation

- Utiliser `'use client'` sur toutes les pages
- Import Framer Motion : `import { motion, AnimatePresence } from 'framer-motion'`
- Stagger animation sur les listes : `transition={{ delay: index * 0.05 }}`
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Modèle 82/18 : toujours afficher "18% brut Eventy" — jamais "82% Eventy"
- Pages Responsable/Admin : à créer dans `frontend/app/(equipe)/equipe/activites/`
