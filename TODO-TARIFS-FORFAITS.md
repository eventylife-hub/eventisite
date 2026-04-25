# TODO — Tarifs, Forfaits & Wallet Énergie
> Audit réalisé le 2026-04-25 — David Eventy  
> Chemin : `frontend/app/` (repo principal `/c/Users/paco6/eventisite/`)

---

## 🔴 BUG CRITIQUE — À corriger IMMÉDIATEMENT

### BUG-001 — Page `/tarifs` cassée (composant manquant)
**Route** : `/tarifs` → `frontend/app/(public)/tarifs/page.tsx`  
**Problème** : La page importe `TarifsClient` depuis `./_components/tarifs-client` qui **n'existe pas**.  
La page publique `/tarifs` crash au build.  
**Action** : Créer `frontend/app/(public)/tarifs/_components/tarifs-client.tsx`  
**Priorité** : P0 — bloque le SEO et le tunnel commercial

---

## 📊 État de l'existant (audit réel)

| Page | Route | Lignes | État | Données |
|------|-------|--------|------|---------|
| Tarifs publics | `/tarifs` | ~30 | ❌ CRASH (composant manquant) | — |
| Wallet Énergie | `/client/energie` | 886 | ✅ Complet | Mock |
| Acheter Énergie | `/client/energie/acheter` | 241 | ✅ Complet | Mock |
| Déduction Énergie | `/client/energie/deduction` | 681 | ✅ Complet | Mock |
| Offrir Énergie | `/client/energie/offrir` | 263 | ✅ Complet | Mock |
| Mes voyages client | `/client/voyages` | 437 | ✅ Complet | Mock |
| Détail voyage | `/client/voyages/[id]` | 1265 | ✅ Complet | Mock |
| Forfaits Admin | `/admin/forfaits` | 427 | ✅ Complet | Mock |
| Forfaits Pro | `/pro/forfaits` | 383 | ✅ Complet | Mock |
| Forfait Comptable | `/comptable/cotisation-forfait` | ~200 | ✅ Complet | Demo |

### Ce qui est déjà implémenté côté Énergie

**Système de paliers** (dans `/client/energie/page.tsx`) :
```
STARTER  : 0 – 4 999 pts   → 100 pts = 1 € · max 10 % réduction
EXPLORER : 5 000 – 19 999  →  80 pts = 1 € · max 15 %
VOYAGEUR : 20 000 – 49 999 →  60 pts = 1 € · max 20 %
ELITE    : 50 000 – 99 999 →  50 pts = 1 € · max 25 %
LEGEND   : 100 000+        →  40 pts = 1 € · max 30 %
```

**Sources d'énergie implémentées** :
- Jeux & défis : +100–600 pts
- Activités voyage : +150–500 pts
- Codes marques (Decathlon, SNCF…) : +500–2 000 pts
- Tag NFC départ/retour : +150 pts
- Parrainage : +2 000 pts
- Trophées fidélité : +1 000–5 000 pts

**Cartes cadeaux** (`/client/energie/acheter`) :
- 25 € → pts selon taux palier (sans bonus)
- 50 € → pts palier + 500 pts bonus
- 100 € → pts palier + 1 500 pts bonus

---

## 🏗️ CE QUI MANQUE — TODOs détaillés

---

### TODO-TAR-001 — Créer `tarifs-client.tsx` (page publique tarifs)
**Route** : `/tarifs`  
**Fichier à créer** : `frontend/app/(public)/tarifs/_components/tarifs-client.tsx`  
**Priorité** : P0

#### Contenu attendu — sections dans l'ordre

**Section 1 — Hero**
- Titre : "Des prix honnêtes, zéro surprise"
- Sous-titre : "Pack Sérénité inclus dans chaque voyage"
- Badge : "Paiement en plusieurs fois sans frais"

**Section 2 — Grille des destinations (tarifs réels)**

| Destination | Durée | Prix/pers. (base 20 pers.) | Fourchette |
|-------------|-------|---------------------------|------------|
| Week-end Europe (Barcelone, Lisbonne, Rome…) | 3–4 jours | 349 – 599 € | Économique |
| Méditerranée (Grèce, Turquie, Maroc…) | 5–7 jours | 599 – 999 € | Confort |
| Moyen-Orient / Asie du Sud-Est | 7–10 jours | 999 – 1 699 € | Premium |
| Long courrier (Bali, Japon, Dubaï…) | 8–14 jours | 1 699 – 3 499 € | Luxe |

> Note pour dev : prix moyens issus du seed (`seed-travels.ts`) :  
> Barcelone 790 €, Lisbonne 890 €, Marrakech 899 €, Grèce 990–1 290 €,  
> Istanbul 1 390 €, Bali 2 190 €, Dubaï 2 890 €, Tokyo 3 490 €.

**Section 3 — Ce qui est TOUJOURS inclus (Pack Sérénité)**
- Transport aller-retour
- Hébergement (chambre double partagée)
- Petit-déjeuner
- Accompagnateur Eventy dédié
- Assurance annulation
- Application mobile voyage
- 0 frais cachés, 0 commission de dossier

**Section 4 — Options à la carte (suppléments)**
- Chambre individuelle : +80–150 €
- Chambre vue mer/premium : +50–120 €
- Transfert privé aéroport : +40–80 €
- Extension séjour (+2 nuits) : sur devis
- Assurance premium (tous risques) : +35–75 €
- Activités premium (excursion privée, cours de cuisine…) : 25–120 €/activité

**Section 5 — Paiement fractionné**
- 30 % à la réservation
- 40 % à J-60
- 30 % à J-30
- Ou paiement en 3×, 4× sans frais (Stripe)

**Section 6 — FAQ rapide**
- "Le bus part-il même si le groupe est petit ?" → Oui, seuil minimal garanti
- "Puis-je payer avec mon Énergie ?" → Oui, jusqu'à 30 % selon palier
- "Qu'est-ce que le Pack Sérénité ?" → Voir liste inclus

**Section 7 — CTA**
- Bouton "Voir les voyages disponibles" → `/catalogue`
- Bouton "Calculer mon forfait" → `#calculateur` (ancre vers TODO-TAR-003)

---

### TODO-TAR-002 — Forfaits mensuels d'abonnement
**Route à créer** : `/public/abonnements` ou `/tarifs#abonnements`  
**Route client** : `/client/abonnement` (gestion et suivi de l'abonnement actif)  
**Priorité** : P1

#### Grille tarifaire forfaits mensuels

| Forfait | Prix/mois | Prix/an (−15%) | Profil | Inclus |
|---------|-----------|-----------------|--------|--------|
| **Solo Starter** | 99 € | 1 009 € | Voyageur solo 1×/an | 1 voyage jusqu'à 799 €, 5 000 pts énergie offerts, paiement en 10× sans frais |
| **Duo Explore** | 139 € | 1 418 € | Couple ou 2 amis | 1 voyage jusqu'à 1 399 € pour 2, 8 000 pts, accès early-bird |
| **Family Pack** | 199 € | 2 030 € | Famille (2 adultes + enfants) | 1 voyage famille, 12 000 pts, assurance famille offerte |
| **Group Leader** | 299 € | 3 050 € | Organisateur de groupe | 1 voyage jusqu'à 3 500 € pour 1 pers. (complément possible), 20 000 pts, CRM groupe, accès Pro |

> **Principe de base David** : ~1 600 €/personne/an → ~133 €/mois arrondi  
> Les forfaits ci-dessus permettent d'étaler le coût en mensualités et de gagner des points énergie.

#### Énergie incluse par forfait (automatique chaque mois)
- Solo Starter → +500 pts/mois
- Duo Explore → +800 pts/mois
- Family Pack → +1 200 pts/mois
- Group Leader → +2 000 pts/mois

#### Règles métier à implémenter
1. Crédit points automatique le 1er du mois
2. Points non utilisés = rollover (pas d'expiration si abonnement actif)
3. Pause abonnement possible 1×/an (congé maladie, maternité…)
4. Résiliation → 30 jours de préavis, points conservés 6 mois

#### Fichiers à créer
```
frontend/app/(public)/abonnements/page.tsx          ← Page commerciale forfaits
frontend/app/(client)/client/abonnement/page.tsx    ← Dashboard abonnement client
frontend/app/(client)/client/abonnement/modifier/page.tsx
frontend/app/(admin)/admin/abonnements/page.tsx     ← Suivi admin
```

---

### TODO-TAR-003 — Calculateur de voyage interactif
**Intégrer dans** : `/tarifs` (section dédiée) + standalone `/calculateur`  
**Priorité** : P1

#### Maquette textuelle du calculateur

```
┌─────────────────────────────────────────────────────────────┐
│  🧮 Calculez le prix de votre voyage                        │
│                                                             │
│  1. Combien de voyageurs ?                                  │
│     [Solo (1)] [Duo (2)] [Groupe (3-5)] [Grande tribu (6+)] │
│                                                             │
│  2. Quelle destination ?                                    │
│     [Europe courte] [Méditerranée] [Moyen-Orient/Asie]     │
│     [Long courrier]                                         │
│                                                             │
│  3. Durée du séjour                                         │
│     ◄────────────● ────────────────────► (3–14 jours)      │
│                  7 jours                                     │
│                                                             │
│  4. Niveau de confort                                        │
│     [Économique] [Confort ⭐] [Premium ⭐⭐] [Luxe ⭐⭐⭐]   │
│                                                             │
│  5. Options supplémentaires (cocher)                        │
│     ☐ Chambre individuelle (+80 €)                          │
│     ☐ Activités premium (+60 €/pers.)                       │
│     ☐ Assurance tous risques (+45 €)                        │
│     ☐ Transfert privé aéroport (+50 €)                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💰 Estimation pour votre voyage                            │
│                                                             │
│  Prix total (1 pers.)     : 999 €                          │
│  Soit en forfait mensuel  : ~ 83 €/mois sur 12 mois        │
│                                                             │
│  Avec votre Énergie ⚡    : − 150 € (15 %)                 │
│  Prix net estimé          : 849 €                          │
│                                                             │
│  [Voir les voyages correspondants →]   [Réserver →]        │
└─────────────────────────────────────────────────────────────┘
```

#### Logique de calcul

```typescript
// Prix de base par zone et durée
const BASE_PRICES = {
  'europe-courte': { min: 349, max: 599, pricePerDay: 90 },
  'mediteranee':   { min: 599, max: 999, pricePerDay: 130 },
  'asie-moyen-orient': { min: 999, max: 1699, pricePerDay: 160 },
  'long-courrier': { min: 1699, max: 3499, pricePerDay: 220 },
};

// Multiplicateur confort
const CONFORT_MULT = {
  economique: 0.85,
  confort: 1.0,
  premium: 1.35,
  luxe: 1.75,
};

// Réduction groupe (prix par personne)
const GROUP_DISCOUNT = {
  1: 0,      // Solo : plein tarif
  2: 0.03,   // Duo  : -3%
  '3-5': 0.08, // Groupe : -8%
  '6+': 0.12,  // Grande tribu : -12%
};

// Formule
const prixBase = BASE_PRICES[zone].pricePerDay * duree;
const prixConfort = prixBase * CONFORT_MULT[confort];
const prixAvantOptions = prixConfort * (1 - GROUP_DISCOUNT[nbPersonnes]);
const prixOptions = options.reduce((acc, opt) => acc + opt.price, 0);
const prixTotal = prixAvantOptions + prixOptions;

// Équivalent mensuel
const forfaitMensuel = Math.round(prixTotal / 12);

// Réduction énergie max (selon palier)
const reductionEnergieMax = prixTotal * (palierMaxPct / 100);
const prixNet = prixTotal - reductionEnergieMax;
```

#### Fichiers à créer
```
frontend/app/(public)/calculateur/page.tsx
frontend/components/ui/VoyageCalculateur.tsx   ← composant réutilisable
```

---

### TODO-TAR-004 — Intégration Énergie ↔ Voyage (choix joueur vs épargnant)
**Contexte** : David veut que le client choisisse d'utiliser ses points pour jouer OU pour financer son voyage.  
**Priorité** : P1

#### Pages à modifier

**`/client/energie/page.tsx`** (existe, 886 lignes) — Ajouter :
- Switch visible "Mode jeux" / "Mode voyage" en haut de page
- En mode voyage : afficher la jauge de progression vers le prochain voyage
- En mode jeux : afficher les défis actifs et le leaderboard
- La barre d'énergie dépensable reste la même quel que soit le mode

**`/client/dashboard`** — Ajouter widget permanent :
- Mini barre énergie toujours visible (comme une batterie)
- Solde pts + équivalent EUR + prochain palier
- Bouton "Utiliser" rapide

#### Nouveau composant global
```
frontend/components/ui/EnergyBar.tsx   ← Barre d'énergie persistante (header ou sidebar)
```
Affichée sur toutes les pages `/client/**`.

---

### TODO-TAR-005 — Page forfaits à la carte (pay-as-you-go)
**Route** : `/tarifs#a-la-carte` ou `/reservations`  
**Priorité** : P2

Pour les clients qui ne veulent pas d'abonnement :
- Paiement unique par voyage
- Prix catalogue sans réduction d'abonnement
- Énergie gagnée normalement (paliers)
- Option d'évoluer vers un abonnement après 1 voyage

---

### TODO-TAR-006 — Page abonnements annuels avec réduction
**Priorité** : P2

Intégrer à TODO-TAR-002. Les forfaits annuels sont −15% vs mensuel.  
Ajouter toggle "Mensuel / Annuel" sur la page `/abonnements`.

---

### TODO-TAR-007 — Forfaits par profil (solo, couple, famille, groupe)
**Priorité** : P2

Déjà défini dans TODO-TAR-002. Ajouter une page landing par profil :
- `/abonnements/solo`
- `/abonnements/duo`
- `/abonnements/famille`
- `/abonnements/groupe`

Chaque page = témoignages + simulateur + CTA.

---

### TODO-TAR-008 — Connexion Énergie → page deduction au checkout
**Priorité** : P1

La page `/client/energie/deduction` (681 lignes) existe.  
Elle doit être appelable depuis le checkout (`/checkout/[id]`).  
**Action** : Ajouter un lien/bouton "Utiliser mon Énergie" dans le tunnel de réservation.

---

## 🗂️ Récapitulatif des fichiers à créer

| Fichier | Priorité | Dépendance |
|---------|----------|------------|
| `frontend/app/(public)/tarifs/_components/tarifs-client.tsx` | **P0** | Aucune |
| `frontend/components/ui/VoyageCalculateur.tsx` | P1 | — |
| `frontend/app/(public)/calculateur/page.tsx` | P1 | VoyageCalculateur |
| `frontend/app/(public)/abonnements/page.tsx` | P1 | — |
| `frontend/app/(client)/client/abonnement/page.tsx` | P1 | API abonnements |
| `frontend/components/ui/EnergyBar.tsx` | P1 | /client/energie |
| `frontend/app/(admin)/admin/abonnements/page.tsx` | P2 | — |
| `frontend/app/(public)/abonnements/solo/page.tsx` | P2 | abonnements |
| `frontend/app/(public)/abonnements/duo/page.tsx` | P2 | abonnements |
| `frontend/app/(public)/abonnements/famille/page.tsx` | P2 | abonnements |
| `frontend/app/(public)/abonnements/groupe/page.tsx` | P2 | abonnements |
| `frontend/app/(client)/client/abonnement/modifier/page.tsx` | P2 | abonnement |

---

## 🎯 Ordre de développement recommandé

### Sprint 1 — Fix critique + fondations (3–4 jours)
1. **BUG-001** : Créer `tarifs-client.tsx` (page tarifs fonctionnelle)
2. **TODO-TAR-003** : Créer `VoyageCalculateur.tsx` + page `/calculateur`

### Sprint 2 — Forfaits abonnements (5–7 jours)
3. **TODO-TAR-002** : Page publique `/abonnements` (grille 4 forfaits)
4. **TODO-TAR-006** : Toggle mensuel/annuel
5. **TODO-TAR-005** : Section à la carte

### Sprint 3 — Énergie wallet avancé (4–5 jours)
6. **TODO-TAR-004** : Switch jeux/voyage dans `/client/energie`
7. **TODO-TAR-004** : Composant `EnergyBar` global client
8. **TODO-TAR-008** : Lien énergie dans le checkout

### Sprint 4 — Pages abonnement client (3–4 jours)
9. **TODO-TAR-002** : `/client/abonnement` (gestion)
10. **TODO-TAR-007** : Pages landing par profil

---

## 📐 Notes de conception

### Règle d'or des tarifs Eventy
> "Le prix juste : marge honnête, zéro surprise, Pack Sérénité inclus"  
> Source : `AME-EVENTY.md`

### Taux de conversion Énergie
- Les taux sont inversement proportionnels au palier (plus tu voyages, moins tu as besoin de points)
- Le palier LEGEND encourage la fidélité extrême : 40 pts = 1€ → très avantageux
- Maximum de réduction : 30% du prix voyage (protège la marge)

### Marge modèle 82/18
> Rappel (mémoire projet) : 82% = marge Eventy, 18% = brut indépendant  
> S'applique sur la marge, pas sur le coût total.  
> Les prix affichés aux clients incluent cette marge. Ne jamais l'afficher.

### Énergie = vraie monnaie (pas juste des points)
- Afficher toujours l'équivalent EUR à côté des points
- Formule : `pts_solde / taux_palier = EUR_utilisables`
- Exemple : 8 240 pts palier VOYAGEUR (60) = 137,33 €

---

*Dernière mise à jour : 2026-04-25*
