# TODO — Force Commerciale Eventy (5% redistribués aux vendeurs)

> **Date** : 2026-04-26
> **Auteur** : David (PDG) + IA
> **Statut** : ✅ Frontend posé · ⏳ Backend à connecter · ⏳ Process opérationnel à formaliser
> **Importance** : ⭐⭐⭐ DIFFÉRENCIATEUR STRATÉGIQUE N°1 — à protéger absolument

---

## 🎯 Le modèle en une phrase

> Sur les ~7 % de marge totale d'Eventy (HRA + bus + activités), **5 % sont
> redistribués aux vendeurs** — n'importe qui peut vendre un voyage Eventy et
> toucher 5 %, sans coût fixe, sans engagement, sans plafond.

**Eventy garde 2 %.** Les vendeurs touchent 5 %. Soit **plus de 70 % de notre
marge** qui revient à ceux qui vendent.

**Aucune autre plateforme voyage ne fait ça.**

---

## 💎 Pourquoi c'est notre arme nucléaire

| Acteur                        | Marge gardée    | Vendeurs externes | Coût pub mensuel |
|-------------------------------|-----------------|-------------------|------------------|
| Booking / Expedia             | 15-25 % intégral | Aucun             | Massif           |
| Voyageurs du Monde            | 25-40 % intégral | Aucun             | Massif           |
| Agences classiques            | 25-40 % intégral | Salariés uniquement | Modéré         |
| **Eventy**                    | **2 %**          | **Tout le monde**  | **~ 0 €**        |

**Mécanique virale** :

- 1 influenceur 100 K abonnés × 1 % conversion × 800 € = **2 000 €/mois rien qu'avec quelques stories**
- 1 CE moyen (Renault Clichy) → 34 ventes/mois × 5 % × 800 € moyen = **3 910 €/mois**
- 1 000 vendeurs actifs × 2 ventes/mois = **2 000 voyages/mois SANS budget pub**
- Marketing gratuit : les vendeurs font la pub parce qu'ils gagnent

---

## 🛒 Qui peut vendre ?

| Profil                       | Volume potentiel              | Canal de vente                        |
|------------------------------|-------------------------------|----------------------------------------|
| **Influenceurs**             | 50 à 500 ventes/mois          | Stories, reels, posts, lives           |
| **Créateurs Eventy**         | 10 à 50 ventes/mois (revente) | Leur propre communauté                 |
| **Ambassadeurs locaux**      | 5 à 50 ventes/mois            | Tabac, coiffeur, bar, agence, garage   |
| **CE / Comités d'entreprise**| 20 à 100 ventes/mois          | Intranet, salle de repos, newsletter   |
| **Marques partenaires**      | 50 à 500 ventes/mois          | Stickers, codes promo, site            |
| **Particuliers (parrainage)**| 1 à 10 ventes/mois            | Bouche à oreille, WhatsApp             |

**Total cible An 1** : 1 000 vendeurs actifs · An 2 : 10 000 vendeurs.

---

## 🔧 Arsenal marketing fourni à chaque vendeur (gratuit)

- ✅ **Lien tracké** unique (`?ref=VENDEUR-ID`)
- ✅ **QR codes** (vitrine, comptoir, flyer, business card) — génération à la demande
- ✅ **Templates réseaux sociaux** (stories, posts, reels) personnalisables
- ✅ **Codes promo dédiés** (nom du vendeur)
- ✅ **Flyers automatisés** PDF avec QR + visuel voyage
- ✅ **Kit média** téléchargeable (visuels, vidéos, argumentaires)
- ✅ **Tableau de bord live** (clics, conversions, commissions)
- ✅ **Wallet & retraits** automatiques (SEPA / Stripe, dès 50 €)

---

## 🗺️ État du frontend (fait — 2026-04-26)

### Pages publiques
- ✅ `/devenir-vendeur` — page de recrutement vendeurs (pitch 5 % + simulateur + arsenal + 4 étapes)
- ✅ `/devenir-vendeur/layout.tsx` — métadonnées SEO
- ✅ `/investisseurs` slide 9 — bandeau **DIFFÉRENCIATEUR N°1** ajouté avec les 3 cartes 7 % / 2 % / 5 %

### Portail Ambassadeur
- ✅ `/ambassadeur/force-commerciale` — hub central : modèle 5 %, simulateur, arsenal complet
- ✅ `/ambassadeur/dashboard` — bannière 5 % ajoutée en haut, lien vers `/force-commerciale`
- ✅ `/ambassadeur/outils` — correction `8%` → `5%` dans le pied du lien tracké

### Portail Indépendant (créateurs)
- ✅ `/independant/ventes` — section ventes avec 2 onglets (mes voyages 18 % / revente 5 %), catalogue revente
- ✅ `/independant` (dashboard) — bannière 5 % ajoutée, lien vers `/ventes`

### Portail Admin
- ✅ `/admin/force-commerciale` — vue agrégée tous vendeurs (ambassadeurs + influenceurs + indépendants + marques + CE + particuliers)

---

## 🔌 TODO Backend (à faire)

### Endpoints NestJS à créer

```
GET  /admin/force-commerciale/stats
     → agrège tables commissions / ambassadeurs / influenceurs / parrainages
     → renvoie : totalCA, totalCommissions, vendeursActifs, parType[], topVendeurs[]

GET  /ambassadeur/force-commerciale
     → renvoie : KPIs perso, arsenal disponible, ventes du mois

GET  /independant/ventes
     → renvoie : { mesVoyages: [...], revente: [...] } avec commission par type

POST /tracking/click
     → enregistre un clic sur un lien tracké (?ref=VENDEUR-ID)

POST /tracking/conversion
     → enregistre une conversion (réservation confirmée) avec attribution vendeur

POST /commissions/payout
     → versement automatique des commissions confirmées (cron mensuel)
```

### Tables Prisma à créer / étendre

- `vendeur` : id, type (AMBASSADEUR | INFLUENCEUR | INDEPENDANT | MARQUE | CE | PARTICULIER), userId, refCode, statut, kycOk
- `vendeur_lien` : id, vendeurId, voyageId, slug, clicks, conversions, createdAt
- `commission` : id, vendeurId, bookingId, voyageId, montantBooking, taux (0.05), montantCommission, statut (EN_ATTENTE | CONFIRMEE | VERSE | ANNULEE), versementId
- `commission_versement` : id, vendeurId, montantTotal, methode (SEPA | STRIPE), refTransaction, dateVersement

### Logique d'attribution

1. Visite `/voyages/<id>?ref=<vendeur-ref>` → cookie `eventy_ref` (90 jours)
2. À la confirmation booking → si cookie `eventy_ref` actif → créer `commission` `EN_ATTENTE`
3. Au paiement complet du voyage → commission passe `CONFIRMEE`
4. Versement automatique mensuel (cron J+1 de chaque mois) si solde >= 50 €

---

## 📋 TODO Process opérationnel

- [ ] **Onboarding vendeur express** : 2 min, KYC simplifié (pièce d'identité + IBAN), validation auto si pas de signal rouge
- [ ] **Charte vendeur** : règles de communication (pas de spam, respect du ton Eventy, pas de fausses promesses)
- [ ] **Statut juridique** : préciser si commission = revenus complémentaires non salariés (CGI 92 BNC) — voir avec comptable
- [ ] **Plafond fiscal** : créer alerte automatique à 1 200 € / 3 000 € / 10 000 € annuel pour rappeler obligations déclaratives
- [ ] **Modèle contrat vendeur** : type apporteur d'affaires (à valider avec avocat tourisme — `pdg-eventy/01-legal/CHECKLIST-AVOCAT.md`)
- [ ] **Programme de fidélité vendeur** : badges, paliers, bonus volumes (ex. > 50 ventes/mois → bonus 1 %)
- [ ] **Parrainage 2nd niveau (V2)** : un vendeur qui recrute un vendeur touche 1 % override (à étudier — légalité MLM, attention !)

---

## 📊 KPIs à monitorer

| KPI                                  | Cible An 1  | Cible An 2  |
|--------------------------------------|-------------|-------------|
| Nombre vendeurs actifs               | 1 000       | 10 000      |
| Ventes via vendeurs / mois           | 200         | 4 000       |
| Part du CA passant par vendeurs      | 20 %        | 50 %        |
| Commission moyenne / vendeur / mois  | 80 €        | 250 €       |
| Coût d'acquisition client (CAC) via vendeurs | < 5 € | < 3 €       |
| CAC publicité directe (référence)    | 25-40 €     | 25-40 €     |

**Économie escomptée** : à 4 000 ventes/mois via vendeurs, on évite ~120 000 € de pub/mois.

---

## ⚠️ Risques à surveiller

1. **Spam et faux profils** → modération algorithmique + signalement utilisateurs
2. **Triche d'attribution** (auto-réservations) → détection cookies multiples / IP / paiements liés
3. **Réputation** : un vendeur qui ment sur le voyage = ternit Eventy → charte stricte + suspension rapide
4. **Légal MLM** : si on ajoute le parrainage 2nd niveau, **rester sous 2 niveaux max** pour éviter la qualification MLM (interdit en France au-delà de 2 niveaux)
5. **Concurrence qui copie** : notre avance = qualité du tracking + UX du dashboard vendeur. Continuer d'investir.

---

## 📁 Fichiers liés

| Fichier                                                                    | Rôle |
|----------------------------------------------------------------------------|------|
| `frontend/app/(public)/devenir-vendeur/page.tsx`                           | Page recrutement publique |
| `frontend/app/(public)/devenir-vendeur/layout.tsx`                         | SEO metadata |
| `frontend/app/(public)/investisseurs/page.tsx`                             | Slide 9 — bandeau 5 % |
| `frontend/app/(ambassadeur)/ambassadeur/force-commerciale/page.tsx`        | Hub vendeur |
| `frontend/app/(ambassadeur)/ambassadeur/dashboard/page.tsx`                | Bannière 5 % |
| `frontend/app/(ambassadeur)/ambassadeur/outils/page.tsx`                   | Outils + correction 5 % |
| `frontend/app/(independant)/independant/ventes/page.tsx`                   | Section revente créateur |
| `frontend/app/(independant)/independant/page.tsx`                          | Bannière 5 % |
| `frontend/app/(admin)/admin/force-commerciale/page.tsx`                    | Vue admin agrégée |

---

## ✅ Prochaines étapes (ordre priorité)

1. **Backend NestJS** : créer `pro/force-commerciale.module.ts` avec endpoints stats
2. **Tracking** : POST `/tracking/click` + cookie `eventy_ref` (sécurisé httpOnly)
3. **Cron versement** : `payment.cron.ts` ajouter job mensuel `payoutCommissions()`
4. **Page vendeur publique** : ajouter formulaire d'inscription rapide sur `/devenir-vendeur`
5. **Page parrainage 2nd niveau** : étudier faisabilité légale puis implémenter sur `/ambassadeur/parrainages`
6. **Dashboard PDG** : ajouter bloc "Force commerciale" sur `pdg-eventy/DASHBOARD-PDG.md` avec KPIs cibles
