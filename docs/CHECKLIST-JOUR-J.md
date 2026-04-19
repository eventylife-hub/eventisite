# ✅ Checklist Jour J — Lancement Eventy

> **Version** : 1.0 — 2026-04-18
> **Cible** : lancement Gamme Standard (bus 53 pax)
> **Maître d'ouvrage** : David (PDG)
> **Owner checklist** : IA PDG + Pôle Finance + Pôle Tech

Chaque case cochée se valide avec **preuve** (lien, capture, commit, screenshot). Un item sans preuve = non fait.

---

## 1. TECHNIQUE

### Build & stabilité
- [ ] `frontend` : `npm run build` — 0 erreur Next.js, 0 warning TS critique
- [ ] `backend` : `nest build` — 0 erreur, dist généré
- [ ] Backend Scaleway : PM2 up depuis ≥ 72h sans restart inattendu
- [ ] `/api/health` répond `200 OK` en < 300ms
- [ ] Uptime monitoring actif (Sentry cron ping ou équivalent)
- [ ] Backup DB automatique quotidien (Scaleway snapshot) — dernière sauvegarde < 24h

### Paiement — Stripe
- [x] `stripe-connect.service.ts` ligne 35 : SDK **initialisé** (fix 2026-04-18)
- [ ] Variables d'env prod : `STRIPE_SECRET_KEY` (sk_live_*), `STRIPE_WEBHOOK_SECRET` posées sur Scaleway
- [ ] Test payout **1€** vers un compte Connect de test : transfer réussi (voir Stripe Dashboard → Transfers)
- [ ] `STRIPE_PAYOUTS_ENABLED=true` activé sur prod (feature flag)
- [ ] Webhook URL Stripe pointe sur `https://api.eventylife.fr/payments/webhook` — signature validée
- [ ] Les 18 handlers webhook ont été testés avec `stripe trigger <event>`
- [ ] 3DS flow testé en sandbox — carte de test `4000 0027 6000 3184`

### Cascade financière
- [x] Nouveau service `CascadeV2Service` intégré au `FinanceModule` (commit 2026-04-18)
- [x] 12/12 tests unitaires passent (règles David : seuil, 82/18, 5% vendeur, Maisons %, cofondateurs 3%)
- [ ] Page `/admin/finance/cascade/:travelId` affiche la cascade pour un voyage réel
- [ ] Wizard `/pro/voyages/nouveau` étape Pricing appelle l'endpoint cascade et affiche le gain net Créateur

### Données
- [ ] 10+ voyages publiés en base prod avec photos, description, itinéraire, prix
- [ ] 10+ profils Créateurs actifs avec bio + photo + Stripe Connect liés
- [ ] 5+ Maisons HRA validées par destination (hébergement + resto + activités)
- [ ] 3+ Ambassadeurs actifs avec code affiliation
- [ ] Toutes les pages critiques affichent des **vraies données** (plus aucun fallback démo)

### Tests fonctionnels (E2E manuels — flux critiques)
- [ ] **Réservation** : `/voyages/[slug]` → Réserver → Stripe checkout (carte test) → confirmation → email Voyageur + Créateur + Maison
- [ ] **Création voyage** : `/pro/voyages/nouveau` → 8 rubriques → publication → visible sur `/voyages/`
- [ ] **Maison** : `/maisons/inscription` → validation admin → mission → accepter → manifeste J-7
- [ ] **Groupe** : créer groupe → inviter (lien) → chaque membre paie sa part → chat de groupe OK
- [ ] **Admin** : `/admin/` → toutes les pages clés → KPI charts → aucune erreur console
- [ ] **Mobile** : flux réservation sur iPhone / Android réel (pas uniquement devtools)

### Performance & SEO
- [ ] Lighthouse home `/` : Performance ≥ 70, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95
- [ ] Sitemap.xml généré et soumis à Google Search Console
- [ ] `robots.txt` à jour (production allow, staging disallow)
- [ ] Schema.org Product sur fiches voyages (price, availability)
- [ ] OpenGraph + Twitter Card sur pages marketing
- [ ] Fonts preload + images optimisées (next/image)

### Sécurité
- [ ] Rate limiting actif sur `/auth/*`, `/payments/*`, `/checkout/*`
- [ ] CORS whitelist → `https://www.eventylife.fr` uniquement
- [ ] Headers sécurité : CSP, HSTS (max-age ≥ 1 an), X-Frame-Options DENY, X-Content-Type-Options
- [ ] Secrets rotés (jamais de `sk_test_` en prod)
- [ ] Sentry backend + frontend : clients DSN configurés, release tagging on
- [ ] PII masking sur logs (interceptor actif — `pii-masking.interceptor.ts`)

---

## 2. LÉGAL

- [ ] **SAS Eventy** immatriculée (SIRET obtenu, Kbis < 3 mois)
- [ ] **ATOUT France** : immatriculation Opérateur de Voyages & Séjours + numéro affiché dans les CGV
- [ ] **APST** : garantie financière en cours de validité (attestation annuelle téléchargée)
- [ ] **RC Pro tourisme** : contrat signé, attestation téléchargée
- [ ] **Comptable** engagé (contrat signé) — régime TVA marge confirmé
- [ ] **Avocat tourisme** identifié pour Q1/Q2 2026 (contrat conseil ou rétainer)
- [ ] **CGV** publiées `/cgv` + validées par l'avocat (version datée)
- [ ] **CGU** + politique de confidentialité `/confidentialite` à jour
- [ ] **Mentions légales** `/mentions-legales` : raison sociale, SIRET, adresse, directeur publication, hébergeur
- [ ] **Cookies** : bandeau consent actif (Tarteaucitron ou équivalent), catégorisation, preuve de consentement
- [ ] **DSAR** : procédure documentée, formulaire `/droits-rgpd` opérationnel
- [ ] **Registre des traitements** RGPD rédigé (format CNIL)
- [ ] **DPO** désigné (interne ou externe)

---

## 3. FINANCE

- [ ] **Compte bancaire pro** ouvert + carte reçue
- [ ] **Pennylane** : abonnement activé, API key prod configurée (`PENNYLANE_API_KEY` sur Scaleway)
- [ ] Import initial : plan comptable voyages/agence chargé dans Pennylane
- [ ] Premier rapprochement Stripe → Pennylane OK (1 booking test)
- [ ] **Stripe** passage Test → Live : clés rotées, webhooks Live configurés
- [ ] Export FEC : test génération sur une période fictive (1 semaine) → fichier conforme NF Z12-001
- [ ] Cascade financière David validée par David sur 3 voyages exemples (audit croisé)
- [ ] Politique `FinancePolicyVersion` active en prod : split 82/18, commission vendeur 5%, 8 poches
- [ ] Feature flag `STRIPE_PAYOUTS_ENABLED` positionné (OFF tant que David n'a pas basculé prod)

---

## 4. CONTENU

- [ ] **Home** : message d'accueil, 3 voyages en vedette, preuve sociale (témoignages / badges)
- [ ] **10 voyages** complets avec :
  - [ ] Titre + accroche + description long
  - [ ] 8+ photos HD (paysage + ambiance + hébergement + activité)
  - [ ] 1 vidéo teaser (30-60s)
  - [ ] Itinéraire jour par jour
  - [ ] Prix transparent (Pack Sérénité inclus)
  - [ ] Dates de départ (au moins 2 dates prévues)
- [ ] **Créateurs** : vitrine `/createurs/[slug]` pour chaque Créateur actif — bio + photos + voyages
- [ ] **Maisons** : présentation destination par destination
- [ ] **Blog** : 3+ articles SEO (idées de voyage, guide destination, conseils groupe)
- [ ] **FAQ** : 20+ questions / réponses (réservation, annulation, Pack Sérénité, groupes)
- [ ] **Pages légales** accessibles depuis le footer

---

## 5. MARKETING

- [ ] **Landing page** lancement prête (`/lancement` ou home adaptée)
- [ ] **Email de lancement** rédigé + template validé Mailjet
- [ ] **Liste de diffusion** chauffe (J-30, J-15, J-7, J-1) — segments : waitlist, partenaires, proches
- [ ] **Réseaux sociaux** créés et postés 3+ fois avant J :
  - [ ] Instagram `@eventylife` — bio + highlights + 12+ posts
  - [ ] Facebook Page Eventy Life — cover + posts
  - [ ] TikTok `@eventylife` — 5+ vidéos teaser
  - [ ] LinkedIn Eventy Life — page entreprise + posts fondateur
- [ ] **Ambassadeurs** : 3+ recrutés, formés, équipés (code affiliation, flyers, QR)
- [ ] **Programme parrainage** actif (code + landing `/parrainage`)
- [ ] **Feature flags de lancement** confirmés avec David :
  - [ ] `feature.chat_groupe` — OFF (prévu Phase 2)
  - [ ] `feature.cagnotte_groupe` — OFF (prévu Phase 2)
  - [ ] `feature.bracelets` — OFF
  - [ ] `feature.gamme_luxe` — OFF
  - [ ] `feature.charter_avion` — OFF
  - [ ] `feature.stripe_payouts_enabled` — décision David le jour du go-live

---

## 6. ÉQUIPE

- [ ] **Co-fondateurs** : au moins 3 recrutés et opérationnels parmi les Pôles :
  - [ ] Finance
  - [ ] Voyage / Qualité
  - [ ] Marketing / Commercial
- [ ] **Pactes d'associés** signés (répartition parts, vesting 4 ans, cliff 1 an)
- [ ] **Formation Claude Code** faite pour les co-fondateurs non-tech
- [ ] **Accès admin** distribués (comptes RBAC par Pôle — pas de compte partagé)
- [ ] **Support clients** : qui prend l'astreinte J + J+1 (téléphone + chat + email) ?
- [ ] **Runbook incident** : qui appelle qui si paiement down / site down / APST en alerte ?
- [ ] **WhatsApp / Slack** équipe Jour J actif, numéros d'urgence prestataires centralisés

---

## 7. OPÉRATIONS (premier voyage)

- [ ] **Autocariste** confirmé, contrat + licence transport vérifiée
- [ ] **Chauffeurs** identifiés (carte conducteur, horaires respectés AETR)
- [ ] **Hôtels** : réservations confirmées, rooming list envoyée J-7
- [ ] **Restaurants** : menus validés, nombre de couverts confirmé
- [ ] **Activités** : réservations + billetterie + guides locaux briefés
- [ ] **Accompagnateur Eventy** désigné, formé, roadbook en main
- [ ] **Assurance groupe** activée (attestation par voyageur)
- [ ] **Checklist J-90 → J+7** renseignée (voir `pdg-eventy/10-operations/GUIDE-PREMIER-VOYAGE.md`)
- [ ] **Plan B** : que faire si le seuil minimum n'est pas atteint 15 jours avant ?
- [ ] **Numéro d'urgence 24/7** affiché aux voyageurs dans le carnet de voyage

---

## 8. GO / NO-GO J-1

Réunion **J-1 à 18h** avec David + Pôle Finance + Pôle Tech + Pôle Qualité.

Critères **GO** (tous obligatoires) :
- [ ] SAS + ATOUT + APST + RC Pro : tous OK
- [ ] Backend + Frontend : up sans erreur critique depuis ≥ 48h
- [ ] Stripe Live actif avec au moins 1 payout test réussi
- [ ] Pennylane en mode prod, 1 écriture de test OK
- [ ] 10 voyages publiés, seuil minimum atteignable (prévision remplissage ≥ 40% pour voyages J+30)
- [ ] Équipe de garde confirmée
- [ ] Plan de communication J0 prêt (post, email, stories)

Si un seul critère manque → **NO-GO** + nouvelle date fixée, pas de contournement.

---

## Annexes

- `AME-EVENTY.md` — manifeste fondateur
- `docs/PROJET-EVENTY-ETAT.md` — état produit consolidé
- `docs/audit-finance-poches-2026-04.md` — audit finance (euro par euro)
- `docs/JOUR-J-STATUS.md` — statut d'avancement checklist (mis à jour en continu)
- `pdg-eventy/12-checklist-lancement/CHECKLIST-COMPLETE.md` — checklist détaillée 8 phases
- `pdg-eventy/10-operations/GUIDE-PREMIER-VOYAGE.md` — opérationnel J-90 → J+7

---

*Document vivant — mis à jour à chaque commit qui fait avancer une case.*
