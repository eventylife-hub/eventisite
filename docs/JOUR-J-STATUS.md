# 📊 Statut Jour J — Eventy

> **Version** : 1.0 — 2026-04-18
> **Source de vérité** : ce document + `docs/CHECKLIST-JOUR-J.md`
> **Mise à jour** : à chaque chantier terminé

Statut consolidé des 8 chantiers du brief « Préparation Jour J » (2026-04-18).

---

## 🟢 Fait aujourd'hui (2026-04-18)

### Chantier 1 — Stripe Connect : SDK initialisé
- **Fichier** : `backend/src/modules/payments/stripe-connect.service.ts:35`
- **Changement** : décommenté l'init Stripe (`this.stripe = require('stripe')(stripeSecretKey, ...)`)
- **Impact** : les 26 erreurs TS préexistantes du fichier ne sont pas aggravées (validé par diff tsc avant/après). Nest build tolère, runtime était auparavant cassé (TypeError sur premier appel `this.stripe.*`).
- **À faire côté David** : fournir `STRIPE_SECRET_KEY` (Test d'abord, puis Live) en variable d'env Scaleway.

### Chantier 2 — Cascade David implémentée
- **Fichier** : `backend/src/modules/finance/cascade-v2.service.ts` (nouveau, ~280 lignes)
- **Spec** : `backend/src/modules/finance/cascade-v2.service.spec.ts` (12 tests — **12/12 passants**)
- **Règles codées** (validées par David) :
  1. Seuil minimum : en dessous → 0 marge, tout en coût. Au-dessus → cascade 82/18 enclenchée.
  2. Split marge : 82% Eventy / 18% Créateur (sur marge nette après TVA marge).
  3. Transport : coût / minThreshold → prix transport par pax au seuil minimum (exposé dans l'output).
  4. Vendeurs : 5% HT déduits de la part Eventy.
  5. Maisons : mode `PUBLIC_PCT` (% CA TTC) ou `NEGOCIE` (montant fixé admin).
  6. Co-fondateurs : utilitaire `distributeFoundersShare(...)` — 3% par défaut au prorata des parts.
  7. Automatique : Math.floor partout + reliquat absorbé pour zéro perte centime (INVARIANT 3).
- **Module** : enregistré dans `FinanceModule` (providers + exports).
- **À faire ensuite** : page `/admin/finance/cascade/:travelId` qui visualise la cascade, et intégration au wizard Pro pricing.

### Chantier 3 — PayoutBatch → Stripe transfers
- **Fichier** : `backend/src/modules/finance/payout-batch.service.ts`
- **Changement** : `executeBatch()` tente désormais des `stripe.transfers.create(...)` si `STRIPE_PAYOUTS_ENABLED=true`.
  - Feature flag OFF par défaut → comportement DB-only inchangé, aucun risque de régression.
  - Transfer hors transaction DB (appels réseau externes).
  - Idempotency key par payout (`payout_<payoutId>`).
  - Fallback silencieux + log si Pro sans `stripeAccountId` ou si Stripe down.
- **Variables d'env** nécessaires : `STRIPE_PAYOUTS_ENABLED`, `STRIPE_SECRET_KEY`.
- **À faire côté David** : onboarding Stripe Connect pour les 10 Créateurs (chacun doit avoir un `stripeAccountId` en metadata user).

---

## 🟡 Partiellement traité (décisions nécessaires de David)

### Chantier 3bis — Pennylane
- **État réel** : l'intégration Pennylane est **déjà codée et réelle** (pas un stub) : `backend/src/modules/finance/pennylane.service.ts` (255 lignes). Le brief initial mentionnait "stub" par erreur.
- **Fonctionnalités actives** : `checkConnection`, `createInvoice`, `getInvoices`, `getPayments`, `syncPrestataire`, `exportVoyage`, `handleWebhook`.
- **Bloqueur** : David n'a pas encore de SIRET → pas de compte Pennylane.
- **Décision nécessaire** : Pennylane offre-t-il un sandbox ? Si oui → créer compte test, renseigner `PENNYLANE_API_KEY`. Sinon → attendre SIRET.
- **Feature flag suggéré** : `PENNYLANE_LIVE_ENABLED` (off par défaut, à créer côté env).

### Chantier 4 — Seed production
- **Hors scope de cette session** : pas d'accès DB Scaleway depuis ce worktree local.
- **Artefact existant** : seed 10 voyages + 10 Créateurs déjà commité (`acb543c feat(seed): 10 voyages réels + 10 profils Créateurs`).
- **Action David** : exécuter sur Scaleway avec `npx prisma db seed` (à programmer sur la prod + vérifier via `curl https://api.eventylife.fr/public/travels`).

### Chantier 7 — Monitoring / Sécurité
- **Hors scope de cette session** : nécessite accès infra (Vercel dashboard, Scaleway panel, Sentry org).
- **Déjà présent en code** : interceptor Sentry (`common/monitoring/sentry.interceptor.ts`), PII masking (`common/interceptors/pii-masking.interceptor.ts`), rate limit guards.
- **Action David** : activer DSN Sentry prod, positionner headers CSP/HSTS dans Vercel, créer le dashboard uptime monitoring.

---

## 🔴 Non traité (décisions explicites)

### Chantier 5 — Merge branches + cleanup git
- **État** : **50+ branches `claude/*`** + 50+ worktrees actifs (voir `git worktree list`).
- **Décision** : **pas de merge automatique**. Chaque branche est un sprint autonome — un merge aveugle dans master risquerait d'introduire des conflits non résolus et casser la prod.
- **Recommandation** : David passe chaque branche en revue avec l'IA PDG en session dédiée, décide merge / delete / keep. Voir les 4-5 branches les plus récentes en priorité.
- **Commande diagnostic** :
  ```bash
  for b in $(git branch -r | grep claude/); do
    echo "=== $b ==="
    git log --oneline master..$b | head -3
  done
  ```

### Chantier 6 — Tests E2E manuels critiques
- **État** : nécessite un humain + un navigateur + un compte Stripe Test.
- **Tests listés** dans `docs/CHECKLIST-JOUR-J.md` section 1.
- **Action** : session dédiée avec David, l'IA PDG prend des notes flux par flux.

### Chantier 8 — Livrable
- **Fait** : `docs/CHECKLIST-JOUR-J.md` (ce sprint).
- **Fait** : `docs/JOUR-J-STATUS.md` (ce doc).

---

## 🧭 Prochaines actions (ordre recommandé)

1. **David** : ouvrir un compte Stripe → récupérer clés `sk_test_*` → poser sur Scaleway.
2. **David** : tester `STRIPE_PAYOUTS_ENABLED=true` sur 1 payout test de 1€.
3. **David** : enchaîner création SAS → SIRET → Pennylane sandbox/prod.
4. **IA PDG** : créer la page `/admin/finance/cascade/:travelId` (visualisation cascade).
5. **IA PDG** : intégrer `CascadeV2Service` dans le wizard Pro pricing (étape 2 : afficher gain net Créateur en temps réel).
6. **IA PDG + David** : session revue des 50+ branches `claude/*` pour merge / delete.
7. **IA PDG + David** : session E2E manuels — 5 flux critiques.

---

## 📎 Commits de cette session

À vérifier via `git log --oneline` après push :
- `feat(finance): CascadeV2Service — règles David (82/18, seuil min, vendeur 5%, Maisons)`
- `fix(payments): initialise Stripe Connect SDK + câblage PayoutBatch→transfers (flag gated)`
- `docs: CHECKLIST-JOUR-J + JOUR-J-STATUS`

---

*Document consolidé — toute décision David fait avancer un statut ici.*
