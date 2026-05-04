# AUDIT — Activités : types, classification, base de données, lien Game

> **Date** : 2026-05-04
> **Branche** : `claude/intelligent-spence-676cbd`
> **Scope** : taxonomie activités, base de données centralisée, interfaces création créateurs/indépendants, pages équipe, lien futur module Game.
> **Règle absolue respectée** : NE RIEN DÉTRUIRE — uniquement ajout sur l'existant.

---

## 1. Vision PDG (David)

> *« Chaque voyage est unique. On ne fait pas du tourisme de masse. Même avec 53 personnes dans un bus, chaque voyage a sa propre âme. »* — AME-EVENTY.md

Les activités sont l'âme des voyages Eventy. Le créateur ou l'indépendant
les sélectionne et les agence pour bâtir une expérience qui correspond à
son groupe. La taxonomie doit aider :

- le **voyageur** à se projeter (type d'activité, ambiance, niveau, accessibilité)
- le **créateur** à construire vite (catégories claires, sous-catégories précises, paliers tarifaires)
- l'**équipe Eventy** à valider la qualité (checklist objective)
- le **module Game** à distribuer énergie et XP de façon équitable

---

## 2. État de l'existant (avant cette livraison)

### 2.1 Données activités

| Fichier | Contenu | Statut |
|---|---|---|
| `frontend/lib/demo-data/hra-activities.ts` | 9 activités demo HRA, 6 catégories (SPORT/CULTURE/GASTRONOMIE/NATURE/AVENTURE/BIEN_ETRE) | ✅ existait |
| `frontend/lib/creator-catalogs.ts` | Cascade : API → demo créateur → MOCK | ✅ existait |
| `frontend/lib/transport-database.ts`, `lib/hotels-database.ts` | Patterns helpers à suivre | ✅ existaient |

### 2.2 Pages créateur / indépendant

| Page | Rôle | Statut |
|---|---|---|
| `app/(pro)/pro/activites/` | Portail prestataire d'activités Phase 11 (10 sous-pages) | ✅ existait |
| `app/(pro)/pro/activites/catalogue/` | Liste activités créateur | ✅ existait |
| `app/(pro)/pro/activites/catalogue/creer/` | Formulaire création 4 étapes (12 catégories) | ✅ existait |
| `app/(pro)/pro/activites/mes-activites/` | Mes activités créées | ✅ existait |
| `app/(independant)/independant/activites/` | Portail indépendant activités (creer, brouillons, [id]) | ✅ existait |

### 2.3 Pages équipe Eventy

| Page | Rôle | Statut avant |
|---|---|---|
| `app/(equipe)/equipe/activites/` | Sous-pages : animateurs, creation, inscriptions, maisons, planning, presences | ✅ existait |
| `app/(equipe)/equipe/activites-validation/` | Queue validation activités | ❌ **manquait** |
| `app/(equipe)/equipe/activites-catalogue/` | Catalogue exhaustif équipe | ❌ **manquait** |

### 2.4 Composants

| Composant | Rôle | Statut |
|---|---|---|
| `components/activities/ActivityNetflixDeck.tsx` | Carrousel Netflix d'activités | ✅ existait |
| `components/activities/OptionalActivitiesSection.tsx` | Section activités optionnelles fiche voyage | ✅ existait |
| `components/hra/ActivityMarketplaceCard.tsx` | Carte marketplace HRA | ✅ existait |
| `components/pro/ShareActivityButton.tsx` | Bouton partage activité | ✅ existait |
| `components/travel-detail/ActivityDetails.tsx` | Bloc détail activité | ✅ existait |
| `components/activities/ActivityCard.tsx` | Carte premium réutilisable (catalog/spotlight/compact) | ❌ **manquait** |
| `components/activities/CategoryPicker.tsx` | Sélecteur catégorie premium | ❌ **manquait** |
| `components/activities/ActivityFormWizard.tsx` | Wizard 7 étapes création/édition | ❌ **manquait** |
| `components/activities/ActivityCatalogGrid.tsx` | Grille catalogue Netflix avec filtres | ❌ **manquait** |
| `components/activities/ActivityValidationQueue.tsx` | Queue validation équipe + checklist qualité | ❌ **manquait** |

### 2.5 Lien Game / Gamification

| Élément | Statut |
|---|---|
| `app/(jeux)/jeux/` | Portail gaming complet (raids, guildes, championnats…) — ✅ existait |
| `app/(equipe)/equipe/gamification/` | 4 pages équipe (game-master, jeux-moderation, energie, etc.) | ✅ existait |
| `lib/demo-data/gaming.ts` | Données gaming demo | ✅ existait |
| `lib/energy-helpers.ts` | Helpers énergie/wallet | ✅ existait |
| Schema `Activity` avec énergie/XP/badges/quêtes | ❌ **manquait** |
| Lien explicite activité → module Game | ❌ **manquait** (TODO) |

---

## 3. Livraison de cette PR

### 3.1 Helpers centralisés

#### `frontend/lib/activity-categories.ts` ✨ NOUVEAU

**Taxonomie ULTRA complète** :
- **10 catégories principales** : 🏃 Sport & Aventure, 🎨 Culture & Patrimoine, 🍴 Gastronomie, 🌿 Nature & Écologie, 🎉 Festif & Soirée, 👨‍👩‍👧 Famille & Enfants, 🧘 Bien-être & Spa, 🛍️ Shopping & Marché local, 🚌 Excursion guidée, 🎮 Game Eventy
- **97+ sous-catégories** réparties dans les 10 univers (rando, escalade, parapente, kayak, surf, ski, plongée ; musée, monument, château, atelier d'artiste, théâtre, opéra, etc.)
- **44 tags transverses** classés par groupe : Lieu (Indoor/Outdoor/Mixte), Public (Solo/Couple/Famille/Groupe/Seniors/Jeunes/Ados), Standing (Budget/Standard/Premium/Exclusif), Accessibilité (PMR/Poussette/Bébé/Animal), Régime (Halal/Casher/Végé/Vegan/Sans gluten/Sans alcool), Niveau (Aucun/Débutant/Intermédiaire/Avancé/Expert), Saison (Toute saison/Été/Hiver/Beau temps/Indoor pluie ok), Éthique (Éco/Circuit court/Artisan local/Commerce équitable), Eventy (Gamifié/Badge/XP Boost/Coup de cœur PDG)
- **Helpers** : `getCategoryById`, `getSubcategoryById`, `getTagById`, `getTagsGrouped`, `fromLegacyCategory` (mapping rétro-compatible avec les 6 catégories DEMO_HRA et les 12 du formulaire `/pro/activites/catalogue/creer`)

#### `frontend/lib/activities-database.ts` ✨ NOUVEAU

**Schema TypeScript enrichi** :
- `Activity` : id, category, subcategory, tags, title, shortDescription, description, highlights, durationMinutes, durationLabel, basePrice, priceTiers, included/notIncluded, capacity (min/max/recommanded), schedule (daysOfWeek, timeSlots, months, specialSlots, minBookingNoticeHours), geo (city, region, country, lat/lng, address, meetingPoint), media (PHOTO/VIDEO/YOUTUBE/VIRTUAL_TOUR + crédit), conditions (level, age, équipement, contre-indications, documents), **game** (energyGain, xpGain, multiplier, badges, questsUnlocked, achievementsUnlocked, isRaidEligible, gameWorld), status (DRAFT/PENDING_REVIEW/VALIDATED_EVENTY/ACTIVE/SUSPENDED/ARCHIVED), createdBy (CREATEUR/INDEPENDANT/PARTENAIRE_HRA/EVENTY_INTERNAL), validatedBy/At, stats (voyagesUsing, bookingsCount, avgRating, reviewsCount, revenueEUR), flags premium/exclusive/coup-de-cœur

**18 activités seed** sur destinations Eventy clés avec données réalistes : Andalousie (Alcázar, Alhambra nuit, Flamenco battle), Algarve (Benagil, Surf Lagos), Vosges (Hohneck, Repas marcaire), Europa-Park, Rulantica, Maroc (Chasse au trésor médina), Italie (Colisée souterrains, Pasta Florence), Grèce (Santorin sunset), Portugal (Fado Alfama), Tchéquie (Escape Prague), Pays-Bas (Vélo Amsterdam), Souk Marrakech expert, Yoga Vosges 2 jours.

**Helpers de recherche** :
- `searchActivities(criteria, options)` — recherche multi-critères + tri (popularité, note, prix, énergie, XP)
- `filterByCategory`, `byCity`, `byCreator`, `popular`, `recommended`, `gamified`, `pendingReview`, `getActivityById`
- `getCatalogStats()` — total, par statut, par catégorie, par pays, totalBookings, totalRevenue, avgRating
- `priceForGroupSize(activity, pax)` — prix unitaire selon paliers groupe

### 3.2 Composants premium (5 nouveaux)

| Composant | Lignes | Variantes / fonctions |
|---|---|---|
| `ActivityCard.tsx` | ~220 | 3 variantes : compact (grille dense), default (catalogue), spotlight (héro carrousel). Affiche statut, badges Premium/Coup de cœur, game stats (énergie/XP), bouton favoris, actions admin (valider/rejeter). |
| `CategoryPicker.tsx` | ~150 | Mode full (catégorie + sous-cat) ou compact (cat seulement), layout grid ou list. Animations Framer Motion, accent couleur par catégorie. |
| `ActivityFormWizard.tsx` | ~580 | Wizard 7 étapes : Catégorie → Détails → Tarif/paliers → Lieu → Médias → Disponibilité → Game & conditions. Stepper premium, preview récap final. |
| `ActivityCatalogGrid.tsx` | ~290 | Grille Netflix avec sections "Coup de cœur PDG", "Game Eventy", "Top destinations". Filtres : catégorie, tags, recherche. Tri 7 critères. Vue grille/liste. |
| `ActivityValidationQueue.tsx` | ~390 | Queue validation équipe : liste pending/draft, panneau détail latéral avec checklist qualité (9 critères, score %), modal action (valider/rejeter/demander changements). |

**Design system respecté** :
- Police Playfair Display pour les titres (style éditorial premium)
- Fond ivoire `#FAF7F2` / `#F5F1E8`
- Accent gold `#D4A853` (couleur signature Eventy gamification)
- Glassmorphism `backdrop-blur-md` + `bg-white/90`
- Animations Framer Motion subtle (hover, transitions step, fade in/out)
- Couleurs par catégorie : orange Sport, violet Culture, rouge Gastro, vert Nature, rose Festif, cyan Famille, teal Bien-être, ambre Shopping, indigo Excursion, **gold Game Eventy**

### 3.3 Pages équipe (2 nouvelles)

| Route | Rôle |
|---|---|
| `/equipe/activites-validation` | Queue activités à valider, panneau détail avec checklist qualité, modal validation/rejet/demande changements. Connecté au composant `ActivityValidationQueue`. |
| `/equipe/activites-catalogue` | Vue exhaustive catalogue : 4 KPIs (total, pays, note, bookings), 3 highlights (coups de cœur PDG, premium, gamifiées), répartition par univers avec barres de progression, grille Netflix complète avec filtres. |

---

## 4. Lien futur Module Game (TODOs)

### 4.1 Wiring dans le schema activité

Chaque activité a déjà un objet `game` :

```ts
game: {
  energyGain: number;     // énergie distribuée (cagnotte voyageur)
  xpGain: number;         // XP de progression
  multiplier?: number;    // ×1, ×1.5, ×2 (équipe), ×3 (raid)
  gameWorld?: 'AVENTURE' | 'CULTURE' | 'GASTRO' | 'NATURE' | 'FESTIF' | 'ZEN';
  badges?: string[];      // badges Eventy débloqués
  questsUnlocked?: string[];
  achievementsUnlocked?: string[];
  isRaidEligible?: boolean;
}
```

### 4.2 TODOs Eventy (commentés dans le code)

```ts
// TODO Eventy: brancher backend CRUD activités avec validation équipe
//   - POST   /api/activities          → DRAFT auto
//   - PATCH  /api/activities/:id      → met à jour
//   - POST   /api/activities/:id/submit  → PENDING_REVIEW
//   - POST   /api/activities/:id/validate → équipe valide
//   - POST   /api/activities/:id/publish  → ACTIVE
//   - GET    /api/activities/search   → critères ActivitySearchCriteria
//   - DELETE /api/activities/:id      → ARCHIVED (jamais hard-delete)

// TODO Eventy: interface game créateur (barèmes énergie/XP, quêtes, achievements)
//   - Page /pro/game/balance — slider energyGain (0-100), xpGain (0-200), multiplier
//   - Page /pro/game/quetes — créateur configure ses propres quêtes
//   - Page /pro/game/achievements — créateur définit ses achievements

// TODO Eventy: intégration module game existant Eventy
//   - Module backend `gaming/` (raids, héros, guildes) — schema Prisma à créer
//   - Helper côté frontend: `applyEnergyGain(userId, activityId)` après check-in

// TODO Eventy: scoring qualité activité (notation voyageurs + complétude fiche)
//   - Algo : (avgRating * 0.6) + (completenessScore * 0.4)

// TODO Eventy: marketplace activités (créateurs vendent leurs activités à d'autres créateurs)
//   - Activité visible publiquement → autres créateurs peuvent l'ajouter à leurs voyages
//   - Commission Eventy 10% sur revenu indirect

// TODO Eventy: AI suggestion catégorie/tags depuis description
//   - Endpoint /api/ai/classify-activity (Claude / OpenAI)
//   - Auto-fill au submit du wizard

// TODO Eventy: traduction multilingue activités (FR/EN/ES)
//   - Champs description_en, description_es, title_en, etc.

// TODO Eventy: réservation activité directe par voyageur (pré-paiement)
//   - Endpoint /api/activities/:id/book + Stripe Checkout

// TODO Eventy: connexion V2 création voyage (Phase 1e)
//   - EtapeActivites.tsx lit ACTIVITIES_SEED + searchActivities
//   - Pré-remplissage selon symphonie source du voyage

// TODO Eventy: notifications HRA quand activité est incluse dans un voyage
//   - Email + push : "Votre activité X est incluse dans le voyage Y"
```

### 4.3 Connexion Phase 1e Activités V2 (création voyage)

Le composant `EtapeActivites.tsx` du wizard création voyage
(`app/(pro)/pro/voyages/nuevo/components/`) doit être enrichi pour :

1. Lire `ACTIVITIES_SEED` via `searchActivities({ city, country })`
2. Pré-remplir selon les destinations du voyage (filtre auto par ville/pays)
3. Carrousels Netflix par catégorie (utiliser `<ActivityCatalogGrid showSections />`)
4. Permettre au créateur d'ajouter une activité personnalisée (ouvrir `<ActivityFormWizard />` en modal)

---

## 5. Métriques cette livraison

| Item | Quantité |
|---|---|
| **Nouveaux fichiers** | 9 |
| **Catégories d'activités** | 10 |
| **Sous-catégories** | 97+ |
| **Tags transverses** | 44 |
| **Activités seed (avec stats, géo, game)** | 18 |
| **Composants premium** | 5 |
| **Pages équipe ajoutées** | 2 |
| **Lignes ajoutées (estimation)** | ~3 800 |
| **TODOs Eventy commentés** | 12 |
| **Fichiers existants modifiés** | 0 (règle absolue : ne rien détruire) |

---

## 6. Prochaines étapes (post-livraison)

### Sprint immédiat
1. **Brancher backend** — implémenter les endpoints `/api/activities/*` (NestJS module `activities/`)
2. **Schema Prisma** — créer le model `Activity` aligné avec le type TypeScript
3. **Migration** — convertir `DEMO_HRA_ACTIVITIES` (9 entries legacy) vers le nouveau schema via `fromLegacyCategory`
4. **Connecter Phase 1e** — utiliser `searchActivities` dans `EtapeActivites.tsx`

### Sprint Game (~2 semaines)
5. **Module backend Game** — schema Prisma : Game, Quest, Achievement, EnergyGain, Hero, Raid, Guild
6. **Helper `applyEnergyGain(userId, activityId)`** — appelé au check-in voyageur
7. **Page créateur `/pro/game/balance`** — slider énergie/XP, multiplier, monde
8. **Wiring queue validation** — équipe Eventy valide aussi le balance game (anti-abus)

### Sprint Marketplace (~1 mois)
9. **Marketplace activités** — créateurs vendent leurs activités à d'autres créateurs avec commission Eventy
10. **AI classification** — endpoint Claude/OpenAI pour auto-suggérer catégorie + tags depuis description
11. **Traductions FR/EN/ES** — i18next + champs multilingues

### Long terme
12. **Réservation directe activité** — voyageur pré-paie une activité optionnelle (Stripe Checkout)
13. **Scoring qualité algorithmique** — note × complétude fiche × vélocité validation

---

## 7. Conformité

- ✅ **Règle absolue** : aucun fichier existant n'a été modifié ou supprimé
- ✅ **Design Eventy** : Playfair Display, ivoire, gold, glassmorphism, Framer Motion
- ✅ **Âme Eventy** : « le client doit se sentir aimé » — tags accessibilité, régime, niveau,
  preview détaillée, prix juste avec paliers, transparence inclus/non-inclus
- ✅ **Modèle 82/18** respecté implicitement (pas de déstructuration des règles tarifaires PDG)
- ✅ **Indépendants = partenaires** : `createdBy.type` distingue CREATEUR / INDEPENDANT / PARTENAIRE_HRA / EVENTY_INTERNAL
- ✅ **Validation équipe Eventy** : workflow obligatoire DRAFT → PENDING_REVIEW → VALIDATED_EVENTY → ACTIVE
- ✅ **Lien Game** : schema prêt, TODOs documentés, connexion future explicite

---

*Document généré 2026-05-04 — Livraison branche `claude/intelligent-spence-676cbd`*
