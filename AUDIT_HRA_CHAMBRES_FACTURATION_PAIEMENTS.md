# Audit HRA — Chambres, Réservations, Facturation, Paiements Stripe Connect & Interventions équipe

**Date** : 2026-05-04 · **Branche** : `claude/affectionate-villani-df57bc` · **PDG** : David Eventy

> **TL;DR** — Eventy automatise toute la chaîne HRA (Hôtel/Restaurant/Activité) :
> sync chambres en live via PMS, réservations bi-directionnelles, factures
> reçues OCRisées, paiement Stripe Connect programmé J+3 après retour voyage
> validé par les voyageurs, et un cockpit équipe pour traiter les exceptions
> (annulations, surbooking, litiges, ajustements). Mode **AUTO** par défaut,
> avec basculement **MANUEL/HYBRIDE** quand l'humain doit trancher.

---

## 1. Vision PDG : « le client doit se sentir aimé »

Cette opération est le **cœur silencieux** d'Eventy. Le voyageur ne doit jamais
voir cette plomberie. Mais c'est ce qui permet à l'accompagnateur de promettre
*« quoi qu'il arrive, on s'en occupe »* — parce qu'effectivement on s'en occupe.

Côté HRA partenaires, la philosophie est la même : on ne les traite pas en
prestataires, on les traite en partenaires. **Paiement à J+3 garanti et
automatique**, factures à émettre en deux clics, négociation transparente,
zéro surprise.

---

## 2. Audit de l'existant — état des lieux 2026-05-04

### 2.1 Pages présentes avant ce chantier

| Portail   | Chemin                                  | Lignes | Couvre |
|-----------|-----------------------------------------|-------:|--------|
| Équipe    | `equipe/hra/page.tsx`                   |    136 | Dashboard pipeline partenaires |
| Équipe    | `equipe/hra/listing/page.tsx`           |    n/a | Listing HRA |
| Équipe    | `equipe/hra/onboarding/page.tsx`        |    n/a | Onboarding HRA |
| Équipe    | `equipe/hra/negociations/page.tsx`      |    n/a | Négociations |
| Comptable | `comptable/factures/page.tsx`           |    278 | Factures émises + reçues |
| Comptable | `comptable/ecritures/page.tsx`          |    n/a | Écritures comptables |
| Maisons   | `maisons/finance/page.tsx`              |    513 | Vue finance HRA |
| Maisons   | `maisons/paiements/page.tsx`            |    646 | Paiements reçus côté HRA |

### 2.2 Helpers et données présents

- `frontend/lib/finance/cascade-hra-distribuee.ts` — cascade financière 18 % / 82 %
- `frontend/lib/booking/room-optimizer.ts` — optimisation chambres
- `frontend/lib/demo-data/hra-{hotels,restaurants,activities}.ts` — datasets demo

### 2.3 **GAPS identifiés (avant ce chantier)**

| Domaine | Gap | Impact |
|---------|-----|--------|
| Sync PMS | Aucun helper pour interpréter les statuts de sync (Mews, Cloudbeds, Sirvoy, Apaleo) | Impossible de savoir si la dispo affichée est fraîche |
| Workflow réservation | Aucun helper de décision auto-confirmation HRA ↔ Eventy | Toutes les confirmations doivent être manuelles |
| Factures HRA reçues | Aucune logique de validation auto + extras + ajustement | Comptable doit tout relire à la main |
| Paiement post-voyage | Pas de calcul de date programmée J+3 ni validation voyageurs | Risque de payer un HRA avant validation voyage |
| Interventions équipe | Aucun catalogue typé d'interventions, aucun chat de négociation | Échanges éclatés sur email/Slack |
| Stripe Connect | Aucun type ni helper côté front | Impossible de prévisualiser KYC, transfers, signatures |
| Comptabilité | Aucune vue calendrier des paiements programmés | Pas de pilotage trésorerie |

---

## 3. Architecture cible — vue d'ensemble

```
┌───────────────────────┐         ┌───────────────────────┐         ┌───────────────────────┐
│   PMS HRA partenaires │  webhook│   Eventy back NestJS  │  Stripe │  Stripe Connect       │
│  Mews · Cloudbeds ·   │◀──────▶│  module @eventy/hra   │◀──────▶│  Express / Custom     │
│  Sirvoy · Apaleo      │  + cron │  module @eventy/pay   │ webhooks│  acct_xxx             │
└───────────┬───────────┘         └───────────┬───────────┘         └─────────┬─────────────┘
            │                                 │                               │
            │ chambres + reservations         │ factures + transfers          │ payouts HRA
            ▼                                 ▼                               ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│  Frontend Next.js (4 portails impactés)                                                   │
│                                                                                            │
│  /equipe/hra-operations  ────────  Cockpit AUTO/MANUEL (#8b5cf6 violet)                   │
│  /equipe/hra-operations/[id]/intervention  ────────  Page dédiée intervention             │
│                                                                                            │
│  /comptable/paiements-programmes  ────────  Calendrier transfers (#D4A853 gold)           │
│  /comptable/factures (existant)   ────────  Factures reçues HRA                           │
│                                                                                            │
│  /maisons/factures-emises  ────────  Côté HRA, mes factures (#b45309 ocre)                │
│  /maisons/operations       ────────  Côté HRA, mes opérations Eventy                      │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Workflow détaillé

### 4.1 Sync chambres LIVE (PMS → Eventy)

| Étape | Acteur | Mécanisme |
|-------|--------|-----------|
| 1 | HRA | Configure ses tarifs Eventy dans son PMS (Mews/Cloudbeds/Sirvoy/Apaleo) |
| 2 | PMS | Push webhook à Eventy lors d'un changement de dispo OU cron Eventy 5 min |
| 3 | Eventy back | Stocke `ChambreLive[]` avec `syncedAt` et `source` |
| 4 | Eventy front | Affiche la dispo via `evaluerFraicheurPms()` (vert/ambre/rouge) |
| 5 | Cockpit équipe | Bandeau "Sync PMS Live" indique le ratio Fraîches/Tièdes/Périmées |

**Helper clé** : `evaluerFraicheurPms(syncedAt) → 'FRAICHE' | 'TIEDE' | 'PERIMEE'`
(seuils 5 min × 1.5 / 30 min).

### 4.2 Workflow réservation Eventy → HRA

```
voyageur réserve voyage Eventy
        │
        ▼
Eventy crée Reservation (statut = BROUILLON, modeOperation = AUTO|HYBRIDE|MANUEL)
        │
        ▼
peutAutoConfirmerReservation(res, chambres)
        │
   ┌────┴────┐
   │ TRUE    │ FALSE
   ▼         ▼
push PMS    push PMS + ouvrir intervention
auto        + statut = EN_ATTENTE_HRA
   │         │
   ▼         ▼
CONFIRMEE   équipe valide manuellement
```

**Conditions auto-confirmation** :
- HRA connecté à un PMS (≠ NONE)
- Capacité dispo ≥ pax demandés
- Mode AUTO ou HYBRIDE
- Montant ≤ seuil double signature (5 000 €) ou mode AUTO explicite

### 4.3 Workflow facturation HRA → Eventy → Comptable → Paiement

```
HRA émet facture (PDF + meta)
        │
        ▼
Eventy reçoit + OCR auto-extraction (score 0→1)
        │
        ▼
peutAutoValiderFacture(facture, reservation, hasIntervention)
        │
   ┌────┴────┐
   │ TRUE    │ FALSE
   ▼         ▼
VALIDEE    À_VALIDER → équipe valide / refuse
        │
        ▼
calculerDatePaiementProgramme(facture)  → J+3 retour voyage OU validation voyageurs
        │
        ▼
preparerTransfer(facture, reservation, account)
        │
        ▼
PROGRAMMEE → en attente double signature si > 5 000 €
        │
        ▼
peutDeclencherTransfer(transfer, account, interventions)
        │
   ┌────┴────┐
   │ TRUE    │ FALSE
   ▼         ▼
Stripe.transfers.create()    BLOQUE → résolution intervention
        │
        ▼
webhook transfer.created → PAYEE
```

**Conditions auto-validation facture** :
- Aucune intervention ouverte sur la résa
- Voyage validé par les voyageurs (`validationVoyageursAt` rempli)
- Score OCR ≥ 92 %
- Montant facture ≤ montant accordé + 2 % de marge
- Statut résa ≠ LITIGE

### 4.4 Catalogue d'interventions équipe

| Type | Quand l'ouvrir | Action attendue |
|------|----------------|-----------------|
| `ANNULATION_VOYAGE` | Voyage annulé (météo, sous-effectif, force majeure) | Remboursement voyageurs + négociation no-show fees HRA |
| `SURBOOKING_HRA` | HRA n'a plus de chambres alors qu'il y avait confirmation | Relogement urgent voyageurs + compensation HRA |
| `LITIGE_VOYAGEUR` | Voyageur mécontent (qualité chambre, hygiène, accueil) | Médiation Eventy entre voyageur et HRA |
| `MODIFICATION_DATES` | Voyage avancé/repoussé (transport, événement local) | Ajustement chambres + refacturation |
| `VOYAGEUR_LAST_MINUTE` | Voyageur supplémentaire à J-7 | Ajout chambre + extension facture |
| `AJUSTEMENT_FACTURE` | Extras commandés (plateau fromages, late checkout, dégâts) | Ajout ligne facture avec raison + auteur |
| `NEGOCIATION_TARIF` | Saison haute, tension marché, volume | Discussion équipe ↔ HRA + impact contrat |
| `AUTRE` | Cas non couvert | Annotation libre + escalade si nécessaire |

**Escalade auto** (`doitEtreEscaladee`) : priorité CRITIQUE OU ajustement > 5 000 € OU statut OUVERTE depuis > 48 h.

---

## 5. Mode AUTO vs MANUEL vs HYBRIDE

| Mode | Quand l'utiliser | Comportement |
|------|------------------|--------------|
| **AUTO** | HRA fiable + PMS connecté + voyage standard | Confirmation, validation facture et transfer 100 % automatiques |
| **HYBRIDE** | Cas par défaut | Confirmations auto, mais montants > 5 000 € passent en double signature |
| **MANUEL** | Nouveau HRA, contentieux, pays sensible | Tout passe par l'équipe avant action |

Visuellement, le badge mode est affiché sur chaque carte d'opération avec
une icône distincte (Sparkles / Activity / Wand2) et une couleur (vert /
violet / ambre).

---

## 6. Côté ÉQUIPE Eventy — `/equipe/hra-operations`

### 6.1 Cockpit principal

5 onglets :
- **Vue d'ensemble** : KPIs + grille opérations + interventions urgentes + transfers à venir
- **Réservations** : occupation HRA jour J + tableau filtré + lien intervention
- **Factures** : tableau OCR + statut + paiement programmé
- **Interventions** : catalogue des interventions ouvertes
- **Stripe Connect** : statut KYC + transfers programmés/déclenchés

### 6.2 Page intervention `/equipe/hra-operations/[id]/intervention`

- Description complète + chat HRA ↔ Eventy
- Ajustement montant (raison obligatoire + trace auteur)
- Annotation interne équipe (jamais transmise au HRA)
- Actions : Approuver / Escalader admin / Refuser
- Side-bar : liens directs vers HRA / Voyage / Facture / Transfer + journal d'audit

### 6.3 Filtres rapides

- Par mode (TOUS / AUTO / HYBRIDE / MANUEL)
- Par statut intervention
- Par fraîcheur PMS

---

## 7. Côté COMPTABLE — `/comptable/paiements-programmes`

### 7.1 Calendrier des transfers

Vue calendaire des prochains transfers Stripe Connect groupés par jour, avec
montant total et nombre de transfers, calculés automatiquement à
J+3 retour voyage.

### 7.2 Statistiques

- Total programmé (€)
- Total réussi cumulé (€)
- Bloqués (count)
- Double signature manquante (count)

### 7.3 Actions par transfer

- **Signer** (passe `signaturesObtenues` de 1 à 2 si nécessaire)
- **Déclencher** (lance `stripe.transfers.create({...})` côté backend)
- **Bloquer** (passe en `BLOQUE` + escalade équipe)

### 7.4 Export FEC

Lien direct vers `/comptable/exports` (page existante) qui consomme le
journal des transfers + factures + écritures conformes au plan comptable
général français (article 242 nonies A CGI).

---

## 8. Côté HRA — Maisons

### 8.1 `/maisons/factures-emises`

- Bouton "Émettre nouvelle facture" → modale + upload PDF (OCR auto-extraction)
- Liste de mes factures avec statut Eventy + lignes extras éventuelles ajoutées par l'équipe
- Encart "Mon Stripe Connect" : statut KYC, payouts enabled, IBAN masqué
- Encart "Comment ça marche ?" pour transparence sur le J+3

### 8.2 `/maisons/operations`

- Mes réservations Eventy (cartes synthétiques)
- Mes interventions ouvertes avec accès au chat de négociation
- Sync PMS de chacune de mes résas (ratio fraîcheur)
- Notes équipe Eventy partagées

---

## 9. Stripe Connect — détails techniques

### 9.1 Types de comptes

| Type     | Quand | Onboarding | Avantage |
|----------|-------|-----------|----------|
| EXPRESS  | Défaut (~80 % des HRA) | Stripe-hosted, 5 min | KYC géré par Stripe |
| CUSTOM   | Gros HRA volume | UI Eventy, KYC géré par nous | UX intégrée |
| STANDARD | HRA déjà sur Stripe | Lien existant | Pas de re-KYC |
| NONE     | Pré-onboarding | n/a | Paiement par virement manuel |

### 9.2 Statuts KYC trackés

`NOT_STARTED` · `PENDING_INFO` · `PENDING_VERIFICATION` · `ACTIVE` · `RESTRICTED` · `REJECTED`

### 9.3 Statuts transfer

`PROGRAMME` · `EN_COURS` · `REUSSI` · `ECHEC` · `BLOQUE` · `ANNULE`

### 9.4 Cas d'usage

| Situation | Comportement |
|-----------|--------------|
| Voyage validé voyageurs OK | transfer auto à J+3 |
| Voyage validé partiellement | transfer ajusté au prorata |
| Voyage litigieux | transfer bloqué, escalade équipe |
| Voyage annulé | pas de transfer, remboursement voyageurs |
| HRA KYC restreint | transfer bloqué, message explicite côté équipe + côté HRA |
| Montant > 5 000 € | double signature (comptable + admin) |

---

## 10. Audit AUTO vs MANUEL — exemples

### 10.1 Cas AUTO réussi (Pestana Hôtels Porto, voyage Lisbonne)

```
J-30  : Eventy crée résa (auto-confirmée car PMS Cloudbeds OK + cap dispo)
J+0   : voyage réalisé, voyageurs valident à 18:32
J+1   : HRA émet facture FR-RIAD-2026-0188 (PDF + OCR 96 %)
J+1   : auto-validation Eventy car aucun litige + score OCR ≥ 92 %
J+3   : transfer Stripe 15 620 € PROGRAMME → REUSSI
```

Aucune intervention humaine. Le PDG voit ces opérations dans la colonne
« automatique ».

### 10.2 Cas MANUEL avec intervention (Domaine Murtoli, voyage Corse)

```
J-90  : Eventy crée résa pour 24 chambres (mode MANUEL, PMS Apaleo)
J-21  : HRA annonce 8 chambres bloquées (mariage privé)
        → intervention SURBOOKING_HRA priorité CRITIQUE
        → transfer Stripe BLOQUE
        → équipe ouvre négociation : relogement Cala di Roccapina + transfer privé + dîner
J-19  : compensation 2 000 € HT actée → ajustement facture
J-0   : voyage réalisé sans incident
J+3   : transfer débloqué après résolution intervention
```

L'équipe a tracé chaque étape dans le chat de négociation (côté Eventy + côté HRA).

### 10.3 Cas HYBRIDE (Riad Al Waha, voyage Marrakech)

```
J-60  : auto-confirmation (mode AUTO)
J+1   : facture FR-MAM-2026-0042 OCR 88 % → seuil 92 % non atteint
        + différence 60 € HT entre montant accordé et facture
        → intervention AJUSTEMENT_FACTURE priorité NORMALE
J+2   : Karim (équipe finance) vérifie : extras plateau fromages validés par accompagnateur
        → ajustement +280 € + libellé "Plateaux fromages soirée gala"
J+3   : facture VALIDEE manuellement → transfer programmé
J+5   : double signature obtenue (montant 7 590 € > 5 000 €)
J+5   : transfer REUSSI
```

---

## 11. Livrables de ce chantier

### 11.1 Helpers

- `frontend/lib/hra/operations.ts` — types + workflow + demo data + libellés FR
- `frontend/lib/hra/stripe-connect.ts` — Stripe Connect types + helpers + demo accounts/transfers

### 11.2 Composants partagés

- `frontend/components/hra-operations/HraOperationCard.tsx`
- `frontend/components/hra-operations/InterventionDrawer.tsx`
- `frontend/components/hra-operations/PaiementProgrammeCard.tsx`
- `frontend/components/hra-operations/NegociationChat.tsx`
- `frontend/components/hra-operations/StripeConnectStatusCard.tsx`

### 11.3 Pages

- `frontend/app/(equipe)/equipe/hra-operations/layout.tsx`
- `frontend/app/(equipe)/equipe/hra-operations/page.tsx` (cockpit 5 onglets)
- `frontend/app/(equipe)/equipe/hra-operations/[id]/intervention/page.tsx`
- `frontend/app/(comptable)/comptable/paiements-programmes/page.tsx`
- `frontend/app/(maisons)/maisons/factures-emises/page.tsx`
- `frontend/app/(maisons)/maisons/operations/page.tsx`

### 11.4 Documentation

- `AUDIT_HRA_CHAMBRES_FACTURATION_PAIEMENTS.md` (ce document)

---

## 12. TODO restants — backend NestJS

Marqués en commentaire `// TODO Eventy:` dans le code :

- [ ] **Stripe Connect onboarding** : `account_links.create` pour générer les liens KYC
- [ ] **Webhook Stripe** : `/api/webhooks/stripe` pour `transfer.created` / `transfer.failed` / `account.updated`
- [ ] **Génération PDF factures voyageurs** : template Eventy Life + TVA marge directive EU
- [ ] **OCR auto-extraction factures HRA** : seuil 92 %, pré-remplissage des champs
- [ ] **Workflow double signature > 5 000 €** : logique back + UI signatures
- [ ] **Tableau de bord temps réel comptable** : Server-Sent Events ou WebSocket
- [ ] **API PMS sync auto** : intégrations Mews / Cloudbeds / Sirvoy / Apaleo
- [ ] **Notifications surbooking** : push HRA + équipe Eventy temps réel
- [ ] **AI détection anomalies factures** : montants atypiques, nuit en double, formats suspects
- [ ] **SEPA Direct Debit** : alternative à Stripe Connect pour HRA UE

---

## 13. Métriques cibles

| Métrique | Cible | Comment mesurer |
|----------|-------|-----------------|
| Taux d'opérations en mode AUTO | > 80 % | `reservations.filter(r => r.modeOperation === 'AUTO').length / total` |
| Délai moyen paiement HRA après retour voyage | ≤ 3 j | calculé via `paiementEffectueAt - dateRetourVoyage` |
| Score OCR moyen factures HRA | > 92 % | moyenne `factures.ocrConfiance` |
| Interventions ouvertes > 48 h | < 5 % | escalade auto si dépassement |
| Sync PMS fraîche | > 95 % | `evaluerFraicheurPms === 'FRAICHE'` |
| KYC HRA actifs | > 90 % | `accounts.filter(a => a.kycStatus === 'ACTIVE')` |

---

## 14. Sécurité & conformité

- **Aucun secret Stripe en front** : toutes les clés `sk_*` côté backend NestJS
- **Webhook signature verification** : `Stripe-Signature` obligatoire
- **PCI-DSS** : déléguer toute manipulation carte à Stripe (Hosted Checkout, Stripe Elements)
- **RGPD** : factures HRA contiennent données prestataire pas voyageurs → pas de données perso voyageurs dans les transfers
- **Article 242 nonies A CGI** : numérotation séquentielle factures Eventy → reçues
- **Facturation électronique 2026** : Chorus Pro + Factur-X + Peppol — tracé en TODO COMPT-FAC-03

---

## 15. Lien avec l'âme d'Eventy

> *"On dit : on s'occupe de tout. Toi, tu profites."* — `AME-EVENTY.md`

Cette page d'audit est exactement ça :
- Le voyageur ne voit pas le PMS, l'OCR, le J+3, la double signature, le webhook Stripe.
- Le HRA partenaire est payé sans tirer une seule facture de relance.
- L'équipe Eventy tranche en quelques clics les rares cas d'exception.
- Le comptable a une vue calendrier limpide, exportable FEC.

**Le client se sent aimé. Le HRA partenaire se sent respecté. L'équipe se sent armée.**
C'est ça, l'opération HRA Eventy.

---

*Document vivant — toute évolution du workflow doit être reflétée ici.*
