# Guide Pension — Référence interne PDG

> Document de référence pour la gestion des types de pension Eventy.
> Utilisateurs cibles : PDG, équipe ops, créateurs Pro, partenaires HRA.
>
> Dernière mise à jour : 2026-04-30

---

## 1. Les 4 types de pension Eventy

Eventy publie sur la fiche client **4 types** de pension simples et clairs.
Le créateur Pro garde 6 modes internes plus fins (`MealPlanMode`) pour la
configuration restauration, mais le client ne voit que ces 4 types publiés.

| Code | Label client | Repas inclus | Bonus énergie | Quand l'utiliser |
|------|--------------|--------------|---------------|------------------|
| `FULL_BOARD` | **Pension complète** | PDJ + Déjeuner + Dîner | **+20 %** | Défaut Eventy (Pack Sérénité) |
| `HALF_BOARD` | **Demi-pension** | PDJ + Dîner | **+10 %** | City breaks, randos, circuits |
| `BREAKFAST_ONLY` | **Hôtel + petit-déjeuner** | PDJ uniquement | standard | Courts séjours, gastronomie locale |
| `ALL_INCLUSIVE` | **Tout inclus** *(V2)* | PDJ + Déj + Dîner + Boissons + Collations | **+30 %** | À venir, validation partenaires resort en cours |

**Source de vérité unique** : `components/voyage/PensionBadge.tsx` (`PENSION_META`).
Tous les portails (public, client, pro, ambassadeur, embed) consomment ce
même module.

---

## 2. Décision matrix pour les créateurs

| Situation | Pension recommandée | Raison |
|-----------|---------------------|--------|
| Voyage 1-2j (week-end, festival, parc) | BREAKFAST_ONLY | Voyageur explore vite, pas de 3 repas/jour |
| City break 3-5j (Lisbonne, Rome, Barcelone) | HALF_BOARD | Liberté du midi pour goûter local |
| Long séjour 6j+ avec hôtel-base | FULL_BOARD | Esprit Eventy zéro charge mentale |
| Circuit avec changements d'hôtel | HALF_BOARD | Déjeuners en route, dîners à l'étape |
| Voyage gastronomique (Toscane, Pays basque) | BREAKFAST_ONLY | Les repas SONT l'expérience |
| Rando/montagne (Vosges, Atlas, Alpes) | HALF_BOARD | PDJ + dîner ferme-auberge |
| Resort tropical / kasbah / lodge isolé | FULL_BOARD | Pas d'alternatives autour |
| Voyage famille (3-5j) avec enfants | FULL_BOARD | Ne pas chercher 3 restos/jour |
| Voyage senior accompagné | FULL_BOARD | Repas heure fixe + régimes gérés |

Le suggester (`lib/voyage/pension-suggester.ts`) calcule automatiquement la
recommandation sur 8 signaux pondérés. Si la confiance est `high`,
l'application est silencieuse (pré-remplissage). Sinon, le créateur valide.

---

## 3. Conventions techniques

### Défaut Eventy
Si `formData.publishedPensionType` est absent, le système publie
`FULL_BOARD` (Pack Sérénité). Voir `AME-EVENTY.md` pour la philosophie.

### Items personnalisés
Le créateur peut overrider la liste d'items inclus via `publishedPensionDetails`.
Cette liste **remplace** les défauts de `PENSION_META[type].details`,
elle ne s'y ajoute pas.

### Tags de classification
Les regex `/libre/i` et `/option/i` dans le texte des items déclenchent
les couleurs visuelles :
- `'Petit-déjeuner inclus'` → ✓ couleur du type pension
- `'Déjeuner libre'` → 🆓 gris (#94A3B8)
- `'Vins en option'` → ⊕ or (#D4A853)

Pour EN/ES, on utilise des tags techniques entre crochets pour préserver
la classification : `'Lunch free [libre]'`. Le tag est strippé à l'affichage.

### Snapshot pension figé après publication
Les voyages déjà publiés gardent leur **snapshot pension** au moment de la
publication. Modifier la pension d'un hôtel HRA n'altère **pas** rétroactivement
les voyages existants. Pour appliquer un changement, utiliser l'override
admin sur chaque voyage concerné depuis `/admin/pension`.

---

## 4. Multiplicateur énergie pension

Plus la pension est immersive, plus le voyageur "investit" dans
l'expérience Eventy → on récompense proportionnellement le gain énergie.
**Aucun malus** : minimum = 1.0 (BREAKFAST_ONLY = standard).

```typescript
PENSION_ENERGY_MULTIPLIERS = {
  FULL_BOARD:     1.20,  // +20 %
  HALF_BOARD:     1.10,  // +10 %
  BREAKFAST_ONLY: 1.00,  // standard
  ALL_INCLUSIVE:  1.30,  // +30 % (V2)
}
```

**Exemple** : voyage à 734 € palier Starter (rate 100 pts/€).
- Base : `10 % × 734 € × 100 pts/€ = 7 340 pts`
- FULL_BOARD : `7 340 × 1.20 = 8 808 pts` (+ 1 468 pts de bonus pension)
- HALF_BOARD : `7 340 × 1.10 = 8 074 pts` (+ 734 pts)
- BREAKFAST_ONLY : `7 340 × 1.00 = 7 340 pts` (pas de bonus)
- + bonus fidélité 500 pts/voyage

---

## 5. Catalogue voyages — pensions assignées

| Voyage | Type | Pourquoi | Items perso |
|--------|------|----------|-------------|
| Andalousie (6j) | FULL_BOARD | 6-10j → défaut + Espagne resort | Gastronomie andalouse, vins Jerez |
| Algarve (5j) | HALF_BOARD | 3-5j + Portugal city break | Poisson frais marina, vins Alentejo |
| Vosges (3j rando) | HALF_BOARD | Rando + ferme-auberge | Tofailles + munster, vin d'Alsace |
| Europa-Park (2j) | BREAKFAST_ONLY | ≤2j parc d'attractions | Buffet PDJ, Pack Resto Parc option |

Tous les voyages ont leurs items perso définis sur `voyage-data.ts` (public)
et `_data/voyages.ts` (client) pour cohérence cross-portail.

---

## 6. Surfaces affichant la pension

13+ surfaces utilisent le composant `PensionBadge` :

**Public**
- Homepage (TripCard)
- Catalogue collections (`VoyageCatalogCard`)
- Fiche voyage (`/voyages/[slug]`) : badge hero + `PensionDetailCard`
- Checkout (`/voyages/[slug]/checkout`) : récap badge
- Page créateur (`/pro/[slug]`) : TripCard upcoming
- All-trips créateur (`/pro/[slug]/all-trips`)
- Embed iframe (`/embed/[proSlug]`)
- Page pédagogique (`/pension`)

**Client**
- Liste voyages (`/client/voyages`)
- Fiche voyage (`/client/voyages/[id]`) : badge hero + PensionSection
- Post-booking (`/client/voyage/[id]`)
- Manifeste J-7 (`/client/voyage/[id]/manifeste`)

**Pro**
- Dashboard voyage (`/pro/voyages/[id]`)
- Création voyage (`/pro/voyages/nouveau` EtapeRestoration + EtapeSummary)
- Reporting analytics (`/pro/analytics`)

**Ambassadeur**
- Catalogue revente (`/ambassadeur/catalogue`)

**Admin**
- Stats analytics (`/admin/analytics`)
- Configuration (`/admin/pension`)
- Gallery composants (`/admin/pension/gallery`)

---

## 7. Email + facture + PDF

L'envoi automatique d'emails (`lib/emails/templates.ts`) injecte la pension :

- **Booking confirmation** : bloc HTML stylé après l'info-box principale
- **Email facture** : ligne « Pension : <label localisé> » dans le récap
- **PDF preview** (`InvoicePreview`) : sous-ligne sous le titre du voyage

Localisation FR/EN/ES via `clientLocale?` (défaut `'fr'`).
Anti-XSS systématique sur les strings utilisateur.

---

## 8. i18n FR/EN/ES

Module : `lib/voyage/pension-i18n.ts`

```typescript
type PensionLocale = 'fr' | 'en' | 'es';

getLocalizedPensionMeta('FULL_BOARD', 'en')
// → { label: 'Full board', short: 'Full board', tagline: 'Everything is taken care of...', ... }

detectBrowserPensionLocale()
// → fallback 'fr' si navigator.language inconnue
```

Les composants `PensionBadge`, `PensionDetailCard`, `PensionTooltip`
acceptent un prop `locale?` optionnel (défaut `'fr'`). Anciens consommateurs
sans `locale` continuent à afficher FR.

---

## 9. Tests & QA

**Suite Jest** : 85 tests (4 fichiers)
- `lib/voyage/__tests__/pension-suggester.test.ts` — heuristiques (25 tests)
- `lib/voyage/__tests__/pension-i18n.test.ts` — locales (23 tests)
- `lib/voyage/__tests__/pension-email-snippet.test.ts` — XSS + locale (18 tests)
- `lib/__tests__/energy-helpers-pension.test.ts` — multiplicateurs (19 tests)

**E2E Playwright** : `e2e/pension.spec.ts` (11 tests)
- Page `/pension` complète
- Comparator interactif
- Fiche voyage avec badge
- A11y (aria-label, radiogroup)

**Gallery visuelle** : `/admin/pension/gallery` — toutes les variantes
en live, switcher locale FR/EN/ES.

---

## 10. Liens utiles

- Composant principal : `components/voyage/PensionBadge.tsx`
- Suggester : `lib/voyage/pension-suggester.ts`
- i18n : `lib/voyage/pension-i18n.ts`
- Email snippets : `lib/voyage/pension-email-snippet.ts`
- Multiplicateur énergie : `lib/energy-helpers.ts`
- Page pédagogique client : `app/(public)/pension/page.tsx`
- Guide créateur : `app/(pro)/pro/aide/pension/page.tsx`
- Dashboard admin : `app/(admin)/admin/pension/page.tsx`

---

## Changelog

- **2026-04-30** : Initial guide. Couverture complète : 4 types × 13+ surfaces ×
  3 locales + suggester + analytics + reporting + emails + tests.
