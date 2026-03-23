# AUDIT & AMÉLIORATION MARKETING — EventyLife
## Rapport complet — 2026-03-23

---

## 🎯 CONCEPT CHOISI : RAYS ☀️

**"Les Rayons de soleil"** — La monnaie marketing d'EventyLife.

Cohérent avec le design gradient sunset premium d'EventyLife. Dynamique, visuel, gamifié.

> "Plus tu as de Rays, plus tes voyages brillent."

### Pourquoi RAYS ?
1. **Dynamique** — "Tu as 50 Rays !" donne envie d'en gagner plus
2. **Visuel** — Jauge soleil, animations amber/orange, badges étoiles
3. **Gamifié** — Niveaux : Soleil Levant → Plein Soleil → Soleil de Midi → Astre ⭐
4. **Simple** — Même un non-tech comprend en 2 secondes
5. **Unique** — Aucun concurrent n'a ce système
6. **Cohérent** — ☀️ = thème sunset premium d'EventyLife

---

## 📊 CE QUI EXISTAIT AVANT

### Backend
- ✅ CRUD campagnes marketing (6 endpoints, machine d'état complète)
- ✅ QR codes trackables + analytics clics
- ✅ Lead capture (email + métadonnées)
- ✅ Dashboard pro marketing (KPIs + campagnes)
- ✅ Dashboard admin marketing (KPIs + tableau + leads)
- ✅ Attribution models (First/Last/Linear)
- ✅ Sponsors & Sponsorships (CRUD complet)
- ❌ Système de tokens/Rays
- ❌ Kits marketing
- ❌ Boutique (achat de tokens)
- ❌ Distribution manuelle par employés
- ❌ Gamification

### Frontend Pro
- ✅ /pro/marketing/page.tsx — Dashboard (8 outils)
- ✅ /pro/marketing/[id]/page.tsx — Détail campagne
- ✅ /pro/marketing/creer/page.tsx — Création campagne
- ✅ /pro/marketing/analytics/page.tsx — Analytics
- ✅ /pro/marketing/leads/page.tsx — Gestion leads
- ✅ /pro/marketing/qr-print/page.tsx — QR codes
- ✅ /pro/marketing/shortlinks/page.tsx — Liens courts
- ✅ /pro/marketing/studio-ia/page.tsx — Studio IA
- ✅ /pro/marketing/reseaux/page.tsx — Réseaux sociaux
- ✅ /pro/marketing/visuels/page.tsx — Visuels
- ✅ /pro/marketing/viral/page.tsx — Viral
- ❌ /pro/marketing/rays/ — Dashboard Rays
- ❌ /pro/marketing/boutique/ — Boutique
- ❌ /pro/marketing/boost/ — Booster un voyage

### Frontend Admin
- ✅ /admin/marketing/page.tsx — Dashboard admin
- ✅ /admin/marketing/leads/page.tsx — Leads
- ✅ /admin/marketing/planner/page.tsx — Calendrier
- ❌ /admin/marketing/rays/ — Gestion Rays

---

## 🚀 CE QUI A ÉTÉ AJOUTÉ

### Sprint 1 — Prisma Schema (backend/prisma/schema.prisma)

**Nouveaux enums :**
```prisma
enum RayTransactionType {
  WELCOME | PURCHASE | KIT_PURCHASE | GRANTED | SPENT
  REFUND | BONUS | EXPIRY | PROMOTION
}

enum RayProductType {
  BOOST_VISIBILITY | FEATURED_COUP_DE_COEUR | SOCIAL_KIT
  EMAIL_CAMPAIGN | LANDING_PAGE | VIDEO_KIT | SEO_BOOST
  ANALYTICS_PRO | PRINT_KIT | PREMIUM_BADGE | CUSTOM
}

enum MarketingKitType {
  STARTER | PRO | PREMIUM | ULTRA
}
```

**Nouveaux modèles :**

| Modèle | Description |
|--------|-------------|
| `ProRayBalance` | Solde Rays d'un pro (1 par pro, lié à ProProfile) |
| `RayTransaction` | Historique de chaque mouvement (crédit/débit) |
| `RayProduct` | Catalogue produits configurables sans toucher au code |
| `MarketingKit` | Kits STARTER/PRO/PREMIUM/ULTRA |
| `RayBundle` | Packs de Rays à acheter (Pack Aurore/Soleil/Midi/Zénith) |
| `RayPromotion` | Promos créées par employés (ex: double Rays ce mois-ci) |

### Sprint 2 — Backend (backend/src/modules/marketing/)

**Nouveaux fichiers :**
- `rays.service.ts` — Service complet RAYS (~350 lignes)
- `rays.controller.ts` — Controller avec 18 endpoints (~320 lignes)
- `marketing.module.ts` — Mis à jour (RaysService + RaysController)

**Endpoints API (/api/rays):**

| Méthode | Route | Rôle | Auth |
|---------|-------|------|------|
| GET | /rays/balance | Mon solde + transactions récentes | Pro |
| GET | /rays/transactions | Historique paginé | Pro |
| POST | /rays/spend | Dépenser des Rays | Pro |
| GET | /rays/products | Catalogue produits | Public |
| GET | /rays/products/:slug | Détail produit | Public |
| GET | /rays/kits | Catalogue kits | Public |
| GET | /rays/bundles | Packs à acheter | Public |
| GET | /rays/promotions/active | Promos actives | Public |
| POST | /rays/grant | Accorder des Rays manuellement | Employé/Admin |
| POST | /rays/products | Créer un produit | Admin |
| PATCH | /rays/products/:id | Modifier un produit | Admin |
| POST | /rays/kits | Créer un kit | Admin |
| POST | /rays/bundles | Créer un bundle | Admin |
| POST | /rays/promotions | Créer une promo | Employé/Admin |
| GET | /rays/admin/stats | Stats globales | Admin |
| GET | /rays/admin/top-pros | Top pros par dépenses | Admin |
| POST | /rays/admin/seed | Init catalogue par défaut | Admin |

**Fonctionnalités clés du service :**
- `getOrCreateBalance()` — Crée automatiquement avec 15 WELCOME Rays
- `spendRays()` — Vérification solde + débit transactionnel
- `grantRays()` — Attribution manuelle par employés
- `creditPurchase()` — Crédit après achat Stripe
- `seedDefaultCatalog()` — Init catalogue complet si vide
- `getAdminStats()` — KPIs globaux pour admin
- `getTopProsBySpend()` — Classement pros les plus actifs

### Sprint 3 — Frontend Pro

**Nouvelles pages :**

#### `/pro/marketing/rays/page.tsx`
- Dashboard Rays avec solde animé (gradient sunset)
- Jauge de progression par niveaux (Soleil Levant → Astre)
- Stats: Total gagné / Total dépensé / Transactions ce mois
- 3 actions rapides: Acheter / Booster / Kits
- Historique transactions avec badges colorés par type
- Section promotions actives

#### `/pro/marketing/boutique/page.tsx`
- **Tab 1 — Packs de Rays**: Pack Aurore (20R/4,90€), Pack Soleil (55R/9,90€), Pack Midi (140R/19,90€), Pack Zénith (375R/39,90€)
- **Tab 2 — Outils Marketing**: 10 produits (Boost, Featured, Social, Email, Landing, Vidéo, SEO, Analytics, Print, Badge Premium) avec solde temps réel
- **Tab 3 — Kits Marketing**: Starter (gratuit), Pro (29,90€), Premium (79,90€), Ultra (sur devis)
- Modal "Choisir un voyage" pour activer un produit sur un voyage
- Balance en temps réel dans le header

#### `/pro/marketing/boost/page.tsx`
- Sélection du voyage à booster
- Panel de boost avec 4 produits (Boost Visibilité, Coup de Cœur, Analytics Pro, Badge Premium)
- Historique des boosts récents
- Gestion des Rays insuffisants (redirect vers boutique)

### Sprint 4 — Frontend Admin

#### `/admin/marketing/rays/page.tsx`
- **4 KPIs**: Pros avec Rays, Total Rays distribués, Total dépensés, Transactions
- **Tab Distribuer**: Formulaire attribution manuelle + historique distributions récentes
- **Tab Catalogue**: Gestion produits (toggle actif/inactif) + gestion bundles
- **Tab Promotions**: Créer promo (multiplicateur, bonus, dates, kit ciblé) + promos actives
- **Tab Top Pros**: Classement par Rays dépensés avec médailles top 3

---

## 📦 CATALOGUE PAR DÉFAUT (seedDefaultCatalog)

### Produits Marketing
| Produit | Type | Coût | Durée |
|---------|------|------|-------|
| 🚀 Boost Visibilité | BOOST_VISIBILITY | 5 Rays | 7 jours |
| ❤️ Coup de Cœur Eventy | FEATURED | 8 Rays | 14 jours |
| 📱 Kit Social Media | SOCIAL_KIT | 3 Rays | — |
| 📧 Campagne Email | EMAIL_CAMPAIGN | 10 Rays | — |
| 🌐 Mini Landing Page | LANDING_PAGE | 6 Rays | — |
| 🎬 Kit Vidéo | VIDEO_KIT | 7 Rays | — |
| 🔍 Boost SEO | SEO_BOOST | 4 Rays | — |
| 📊 Analytics Pro | ANALYTICS_PRO | 5 Rays | 30 jours |
| 🖨️ Kit Print | PRINT_KIT | 4 Rays | — |
| ⭐ Badge Premium | PREMIUM_BADGE | 15 Rays | 90 jours |

### Packs de Rays (Bundles)
| Pack | Rays | Bonus | Prix |
|------|------|-------|------|
| Pack Aurore | 20 | 0 | 4,90€ |
| Pack Soleil ⭐ | 50 | +5 | 9,90€ |
| Pack Midi | 120 | +20 | 19,90€ |
| Pack Zénith 🏆 | 300 | +75 | 39,90€ |

### Kits Marketing
| Kit | Type | Rays | Prix |
|-----|------|------|------|
| Kit Starter | STARTER | 15 Rays | Gratuit |
| Kit Pro ⭐ | PRO | 50 Rays | 29,90€ (9,90€/mois) |
| Kit Premium 🏆 | PREMIUM | 150 Rays | 79,90€ (24,90€/mois) |
| Kit Ultra 🌟 | ULTRA | 500 Rays | Sur devis |

---

## 🗺️ LIBERTÉ DES EMPLOYÉS

Les employés Eventy peuvent maintenant :
- **Distribuer des Rays** à tout moment via `/admin/marketing/rays`
- **Créer de nouveaux produits** sans toucher au code (via API `POST /rays/products`)
- **Modifier les prix** (Rays) des produits existants (via `PATCH /rays/products/:id`)
- **Créer des promotions** avec multiplicateurs (ex: "Double Rays ce week-end")
- **Cibler une promotion** sur un kit spécifique (ex: "Bonus pour Kit Pro seulement")
- **Voir les stats globales** et le classement des pros les plus actifs

---

## 🔄 CE QUI RESTE À FAIRE

### Priorité Haute
- [ ] Migration Prisma (`prisma migrate dev --name add-rays-system`)
- [ ] Intégration Stripe pour l'achat de bundles et kits (webhooks Stripe → `creditPurchase()`)
- [ ] Route API `/api/rays/purchase/bundle` pour déclencher le paiement Stripe
- [ ] Route API `/api/rays/purchase/kit` pour les kits payants

### Priorité Moyenne
- [ ] Affichage du solde Rays dans le menu latéral pro (badge orange)
- [ ] Notification push quand un employé accorde des Rays
- [ ] Email automatique "Tu as reçu X Rays !" après attribution
- [ ] Page `/pro/marketing/social` — Générateur de visuels Social Media (via Kit Social)
- [ ] Page `/pro/marketing/email` — Créateur de campagne email (via Token Email)
- [ ] Page `/pro/marketing/landing` — Créateur de landing page (via Token Landing)
- [ ] Page `/pro/marketing/print` — Générateur supports print (PDF)
- [ ] Tracking actif des boosts (quels voyages sont boostés, jusqu'à quand)

### Priorité Basse
- [ ] Programme de parrainage (gagner des Rays en parrainant d'autres pros)
- [ ] Leaderboard public des pros les plus actifs marketing
- [ ] Expiration des Rays (facultatif — décision business)
- [ ] Abonnements mensuels Stripe (Kit Pro/Premium mensuels)

---

## 📁 FICHIERS MODIFIÉS/CRÉÉS

### Backend
```
backend/prisma/schema.prisma          — Modifié (+enums +modèles RAYS)
backend/src/modules/marketing/
  rays.service.ts                     — CRÉÉ
  rays.controller.ts                  — CRÉÉ
  marketing.module.ts                 — Modifié (+ RaysService, RaysController)
```

### Frontend
```
frontend/app/(pro)/pro/marketing/
  rays/page.tsx                       — CRÉÉ
  boutique/page.tsx                   — CRÉÉ
  boost/page.tsx                      — CRÉÉ

frontend/app/(admin)/admin/marketing/
  rays/page.tsx                       — CRÉÉ
```

---

## ⚡ AVANTAGE COMPÉTITIF

Le système RAYS est **unique dans le secteur du voyage de groupe**.

| Concurrent | Système marketing pour pros |
|------------|---------------------------|
| Viator | Pas de monnaie marketing, juste des badges |
| GetYourGuide | Promotions gérées en central, pas par les pros |
| Airbnb Experiences | Boost payant direct (€), pas gamifié |
| Booking.com | Programme de partenariat rigide |
| **EventyLife RAYS** | **Monnaie gamifiée, distributée par l'équipe, achetable, dépensable sur 10+ outils** ☀️ |

L'avantage : les indépendants EventyLife ont **l'autonomie marketing** que les autres plateformes ne donnent pas. Ils peuvent choisir comment investir leurs Rays, gagner des Rays via l'équipe, et voir clairement le retour sur leur investissement marketing.

---

*Rapport généré le 2026-03-23 — Sprint Marketing RAYS*
