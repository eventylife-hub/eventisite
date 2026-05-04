# AUDIT PRO DASHBOARD — `/pro` (sidebar + widgets)

**Date** : 2026-05-04
**Worktree** : `focused-lehmann-8834ea`
**Branche** : `claude/focused-lehmann-8834ea`
**Demande PDG** : audit profond + ajout entrée Symphonies + montage clip + réparation widgets

---

## 1. Sidebar `/pro` (frontend/app/(pro)/pro/layout.tsx)

### Structure actuelle (12 catégories accordéon)

| # | Catégorie | Icône | # enfants | État |
|---|-----------|-------|-----------|------|
| 1 | Tableau de bord | LayoutDashboard | 3 | OK |
| 2 | Mes Voyages | Plane | 7 | OK (contient « Créer un voyage (symphonie) ») |
| 3 | Vendre en 3 minutes | Zap | 6 | OK |
| 4 | Mes HRA | Hotel | 5 | OK |
| 5 | Transport | Bus | 5 | OK |
| 6 | Activités | Target | 5 | OK |
| 7 | Mon Équipe | Users | 5 | OK |
| 8 | Énergie & Codes | Sparkles | 5 | OK |
| 9 | Revenus | Wallet | 6 | OK |
| 10 | Marketing | Megaphone | 7 | OK |
| 11 | Documents | FileText | 3 | OK |
| 12 | Paramètres | Settings | 4 | OK |

### Manquant (demande PDG 2026-05-04)

- **Symphonies (montage clip)** — geste créatif principal, MUST avoir entrée propre + badge « Nouveau »
- **Communauté** — voyageurs, followers, messagerie, chat, satisfaction (regroupés)
- **Aide & Formation** — `/pro/formation` + `/pro/aide` + tutoriels

### Routes existantes mais non liées dans sidebar

| Route | Usage |
|-------|-------|
| `/pro/voyageurs` | Liste voyageurs créateur |
| `/pro/messagerie` | Boîte de réception |
| `/pro/chat` | Chat live |
| `/pro/followers` | Communauté abonnés |
| `/pro/satisfaction` | NPS + avis |
| `/pro/formation` | Vidéos formation créateur |
| `/pro/medias` | Bibliothèque médias |
| `/pro/jeux` | Gamification créateur |
| `/pro/sponsors` | Sponsoring partenaires |
| `/pro/marque` | Identité de marque créateur |
| `/pro/page-publique` | Page publique du créateur |
| `/pro/wallet` | Wallet (déjà dans Revenus mais à renforcer) |

---

## 2. Widgets dashboard `/pro/page.tsx`

### Inventaire des widgets

| # | Widget | Type | Source données | État | Routes liées |
|---|--------|------|----------------|------|--------------|
| 1 | `ProQuickDock` | Ribbon top | `pro-store` + `metiers.ts` | OK | toutes |
| 2 | Hero greeting | Banner | `auth-store` + `pro-store` | OK | `/pro/voyages/nouveau`, `/pro/messagerie` |
| 3 | KPIs (4 cards) | Grid | **MOCK** | OK visuel | `/pro/revenus`, `/pro/groupes`, `/pro/voyages`, `/pro/satisfaction` |
| 4 | Mes voyages en cours (4 cards) | Grid | **MOCK** | OK visuel | `/pro/voyages/[id]` |
| 5 | CA du mois (chart SVG 30j) | Sparkline | **MOCK** (REVENUE_DAYS) | OK | `/pro/revenus` |
| 6 | Réservations récentes (timeline 5) | List | **MOCK** | OK | `/pro/reservations` |
| 7 | Partition prochain voyage | Bars | **MOCK** | OK | `/pro/voyages/[id]` |
| 8 | Notifications (5 items) | List | **MOCK** | OK | `/pro/notifications` |
| 9 | Actions rapides (6 tiles) | Grid | static | OK | `/pro/voyages/nouveau`, `/pro/reservations`, `/pro/studio-clip`, `/pro/campagnes`, `/pro/messagerie`, `/pro/marketing` |
| 10 | Floating help button | FAB | static | OK | `/pro/support` |

### Bugs identifiés (visuels & routage)

1. **KPI « Voyageurs embarqués »** pointe vers `/pro/groupes` — page `/pro/groupes` existe (oui : `groupes/`), donc OK. Mais le label « Voyageurs » serait plus cohérent avec `/pro/voyageurs`. → CORRECTION : pointer vers `/pro/voyageurs`.
2. **KPI « Note moyenne »** pointe vers `/pro/satisfaction` — OK.
3. **Action « Studio Clip »** pointe vers `/pro/studio-clip` — OK (page existe), mais sa logique est d'éditer une **vidéo**, pas la **symphonie voyage**. → AJOUT : action dédiée « Mes symphonies » qui pointe vers `/pro/symphonies`.
4. **Aucune mention de la symphonie depuis le dashboard** — le concept central du produit. → AJOUT widget « Mes symphonies » entre voyages et CA du mois.
5. **Lien Réservations récentes** : OK.
6. **Pas de wiring vers proStore/auth** : les KPIs/Trips/Bookings sont 100% mock — TODO à brancher backend (déjà existant pour stats créateur). À documenter en TODO Eventy.

### Ce qui marche bien
- Animations Framer Motion fluides, niveau premium
- Hero responsive, glassmorphism cohérent
- Greeting heure-aware
- Useful inline stats (CA, voyageurs, note, départ)
- Charts SVG perfs
- KPI delta indicators

---

## 3. Roadmap — fix 2026-05-04

### A. Sidebar (layout.tsx)
1. Ajouter catégorie **Symphonies (montage clip)** avec badge `Nouveau`, entre « Mes Voyages » et « Vendre en 3 min »
2. Ajouter catégorie **Communauté** entre « Marketing » et « Documents »
3. Ajouter catégorie **Aide & Formation** entre « Documents » et « Paramètres »
4. Renommer « Mes Voyages > Créer un voyage (symphonie) » en « Création voyage V2 » pour clarté
5. Ajouter dans Mes Voyages → « Mes voyageurs » `/pro/voyageurs`
6. Ajouter dans Marketing → « Médias » `/pro/medias` (déjà présent ✓)

### B. Dashboard widgets (page.tsx)
1. Corriger KPI Voyageurs → `/pro/voyageurs`
2. Ajouter section « Mes symphonies récentes » (nouvelle, entre voyages et CA mois) — affiche 3 symphonies en cours de montage avec timeline visuelle
3. Ajouter Action rapide « Mes symphonies » (gold gradient) en plus de Studio Clip
4. TODO Eventy en commentaires pour wiring backend

### C. Nouvelles pages

#### `/pro/symphonies/page.tsx`
- Header premium « Mes Symphonies » (Playfair Display)
- Cards style timeline (cover + nom + nb pistes + nb voyageurs + CTA Ouvrir / Dupliquer)
- Bouton primaire « + Nouvelle symphonie » → wizard léger
- 3 sections : En cours / Publiées / Templates
- Format dark gold, glassmorphism subtle

#### `/pro/symphonies/[id]/montage/page.tsx`
- Header : titre symphonie éditable + Sauvegarder + « Créer un voyage à partir de cette symphonie »
- Layout 3 colonnes :
  - **Bibliothèque (gauche)** : tabs HRA / Arrêts / Activités / Partenaires / Médias — items draggables
  - **Preview (centre/droite)** : aperçu visuel en temps réel (poster + résumé)
  - **Inspector (droite repliable)** : edit clip sélectionné
- **Timeline (bas)** : 4 pistes (Hébergement, Transport, Activités, Restauration) — drag & drop
- Format premium : gold + ivoire, terracotta/emerald rythme, Framer Motion

### D. TODO Eventy en code (commentaires)
```
// TODO Eventy: brancher backend symphonies réelles (CRUD)
// TODO Eventy: rendu vidéo de la symphonie (preview animé)
// TODO Eventy: collaboration multi-créateur sur symphonie partagée
// TODO Eventy: templates symphonies premium
```

---

## 4. Plan d'exécution

| Étape | Fichier | Action |
|-------|---------|--------|
| 1 | `frontend/app/(pro)/pro/layout.tsx` | +3 catégories sidebar + badge « Nouveau » sur Symphonies |
| 2 | `frontend/app/(pro)/pro/page.tsx` | +section Symphonies + KPI Voyageurs corrigé + action dédiée |
| 3 | `frontend/app/(pro)/pro/symphonies/page.tsx` | NOUVEAU — listing + bouton CTA |
| 4 | `frontend/app/(pro)/pro/symphonies/[id]/montage/page.tsx` | NOUVEAU — éditeur visuel |
| 5 | git commit + push frontend submodule + bump parent | déploiement Vercel |

---

## 5. Garde-fous

- **NE RIEN EFFACER** : ajouts uniquement dans NAV, KPIS, ACTIONS
- **Format premium** : Fraunces / Playfair Display titres, ivoire `rgba(255,255,255,0.92)` textes, accent `#D4A853` ponctuel
- **Glassmorphism** : `rgba(255,255,255,0.04)` + `backdrop-blur(14px)` + `border-white/8`
- **Framer Motion** : transitions 0.4-0.6s, easeOut, stagger 0.05s
- **TODO PDG** : tous les nouveaux éléments commentés `// TODO Eventy: ...` pour wiring backend

---

**Auteur** : Claude (bras droit IA David)
**Pour validation** : David Anciaux, PDG Eventy
