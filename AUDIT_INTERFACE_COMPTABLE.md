# AUDIT INTERFACE COMPTABLE — Eventy Life

> **Date** : 2026-05-04
> **Auditeur** : Bras droit IA PDG (David)
> **Périmètre** : `/comptable/*` — frontend Next.js 14 (`frontend/app/(comptable)/`)
> **Référence design** : Refonte premium pro/revenus du 2026-05-03 (commit `5e524ef6`)
> **Référence légale** : Code de Commerce, CGI Art. 266-306bis, Directive 2015/2302 EU, Atout France IM, garantie APST

---

## 1. État des lieux — pages existantes

| # | Route | État | Couverture | Audit |
|---|-------|------|-----------|-------|
| 1 | `/comptable` | ✅ Existe | Dashboard premium dark + recharts | À refondre — palette ivoire/gold + Playfair |
| 2 | `/comptable/activites` | ✅ Existe | Activités post-voyage | OK |
| 3 | `/comptable/bilan` | ✅ Existe | Bilan + compte de résultat | OK |
| 4 | `/comptable/charges` | ✅ Existe | Analyse charges par catégorie | OK |
| 5 | `/comptable/cotisation-forfait` | ✅ Existe | Cotisation forfait | OK |
| 6 | `/comptable/cotisations` | ✅ Existe | Cotisations indépendants (DAS2) | OK |
| 7 | `/comptable/dossiers` | ✅ Existe | Exercices, archivage, FEC | OK |
| 8 | `/comptable/ecritures` | ✅ Existe | Journal comptable | OK |
| 9 | `/comptable/exports` | ✅ Existe | FEC, Pennylane, Cegid | OK |
| 10 | `/comptable/factures` | ✅ Existe | Factures émises/reçues unifié | À splitter en 2 |
| 11 | `/comptable/jeux-gains` | ✅ Existe | Taxes jeux, IFU | OK |
| 12 | `/comptable/marges` | ✅ Existe | Cascade 8 poches, modèle 82/18 | OK |
| 13 | `/comptable/portails` | ✅ Existe | Vue portails Eventy | OK |
| 14 | `/comptable/produits` | ✅ Existe | Scénarios + classes 7 | OK |
| 15 | `/comptable/rapports` | ✅ Existe | Mensuel/trimestriel/annuel | OK |
| 16 | `/comptable/social` | ✅ Existe | Charges sociales URSSAF DSN | OK |
| 17 | `/comptable/support` | ✅ Existe | Support & contacts | OK |
| 18 | `/comptable/tresorerie` | ✅ Existe | Cash flow + BFR | OK |
| 19 | `/comptable/tva` | ✅ Existe | TVA marge agence (art. 266 CGI) | OK |
| 20 | `/comptable/voyages` | ✅ Existe | Suivi par voyage | OK |

**TOTAL EXISTANT** : 20 pages

---

## 2. Pages manquantes — création nécessaire

D'après les besoins du comptable Eventy (voir §3) et l'évolution du modèle (HRA + transferts + NFC + validation équipe + lock fields UE 2015/2302), il manque :

| # | Route | Catégorie | Justification |
|---|-------|-----------|---------------|
| M1 | `/comptable/facturation/emise` | Facturation | Split clair facture client / fournisseur — Chorus Pro 2026 |
| M2 | `/comptable/facturation/recue` | Facturation | OCR factures HRA + transporteurs + indépendants |
| M3 | `/comptable/encaissements` | Trésorerie | Suivi virements voyageurs + retards |
| M4 | `/comptable/paiements` | Trésorerie | Paiements pros (créateurs/vendeurs/HRA) — workflow validation > 5 000 € |
| M5 | `/comptable/rapprochement` | Banque | Rapprochement auto/manuel — Open Banking PSD2 |
| M6 | `/comptable/plan-comptable` | Référentiel | PCG 2014 + comptes auxiliaires 411/401 |
| M7 | `/comptable/reporting` | Financier | Bilan + résultat + plan trésorerie 24 mois consolidé |
| M8 | `/comptable/garantie-financiere` | Conformité | Lien dossier APST, mises à jour annuelles, monitoring 1,6 M€ |
| M9 | `/comptable/conformite` | Conformité | Atout France IM, AGS, RC Pro, Code Tourisme L211-18 |
| M10 | `/comptable/archivage` | Légal | 10 ans comptabilité (L.123-22 C.com) + 5 ans bons de commande |
| M11 | `/comptable/previsionnel` | Pilotage | Budget annuel + suivi mensuel + écarts |
| M12 | `/comptable/documents` | Documents | Kbis, statuts SAS, conventions, baux, polices RC |
| M13 | `/comptable/parametres` | Configuration | Cabinet expert-comptable, codes APE, IBAN, signature électronique |

**TOTAL À CRÉER** : 13 pages

---

## 3. Besoins du comptable Eventy — checklist exhaustive

### A. Pilotage & vue d'ensemble
- [x] Dashboard CA total / marges plateforme / charges / résultat (existant — refonte premium)
- [x] KPIs YTD + comparatif N/N-1
- [ ] Drill-down par mois / par voyage / par créateur

### B. Facturation
- [x] Numérotation séquentielle conforme Art. 242 nonies A CGI
- [ ] **Splitter** factures émises (clients voyageurs) ↔ factures reçues (HRA, transporteurs, prestataires) — pages dédiées
- [ ] Acomptes voyage 30/40/30 — 3 factures par dossier (gestion auto)
- [ ] Facturation électronique 2026 : Chorus Pro, Factur-X, Peppol
- [ ] OCR factures fournisseurs scannées
- [ ] Relances impayés J+0/J+7/J+15/J+30

### C. Encaissements & paiements
- [ ] Suivi statut : à recevoir / encaissé / en retard
- [ ] Virements voyageurs (Stripe Connect → ledger)
- [ ] Paiements pros : 5% HT vendeurs, 3% créateurs, marges HRA — échéancier
- [ ] **Workflow validation paiements > 5 000 € (double signature PDG + comptable)**

### D. TVA — régime spécial agences voyages (Art. 266 CGI / 306 bis)
- [x] Calcul TVA marge directive EU 2015/2302 (TVA = Marge × 20/120)
- [x] CA3 mensuelle pré-remplie
- [ ] Déclaration EDI-TVA (téléprocédure DGFiP)
- [ ] Audit TVA collectée vs déductible (cohérence 445710/445660)
- [ ] DEB/DES intracom (partenaires UE)
- [ ] Autoliquidation Stripe Irlande / SaaS hors UE

### E. Rapprochement bancaire
- [ ] Connexion Open Banking PSD2 (BNP Paribas Pro + Qonto + Revolut Business + Stripe)
- [ ] Import OFX/CSV en backup
- [ ] Rapprochement automatique ML (matching libellé + montant + date fuzzy)
- [ ] Pointage manuel pour exceptions

### F. Plan comptable
- [x] PCG 2014 — 7 classes (1 capitaux, 2 immo, 3 stocks, 4 tiers, 5 financier, 6 charges, 7 produits)
- [ ] Journal auxiliaire clients (411) / fournisseurs (401) détaillé par tiers
- [ ] Grand livre exportable

### G. Marges Eventy (visible côté comptable, pas côté pro)
- [x] **Modèle 82/18 transport** : 82% marge Eventy, 18% brut indep (cf. mémoire critique)
- [x] **Modèle HRA 15/10** : 15% marge sur prix unitaire, 10% commission Eventy
- [x] **Architecture HRA + 5% vendeur + 3% créateur** (cf. project_business_model_pdg)
- [x] Cascade 8 poches : ventilation auto depuis bookings (calcul par pax)
- [ ] Décomposition par voyage / par créateur / par HRA — drill-down
- [ ] Validation bloquante marge < 12% (alerte PDG)

### H. Commissions à verser
- [ ] 5 % HT vendeurs (ambassadeurs + autres) — calculé sur le brut HT
- [ ] 3 % créateurs sur leurs propres voyages — sur le brut HT
- [ ] Marges HRA partenaires (15/10) — échéancier
- [ ] Bonus performance (NPS, bus complet, conversion)

### I. Charges sociales (existant — `/comptable/social`)
- [x] DAS2 indépendants (créateurs, HRA, transporteurs)
- [ ] DSN mensuelle salariés (3 ETP M0-M12 selon BUDGET-PREVISIONNEL)
- [ ] URSSAF auto-entrepreneurs (contrôle SIRET/TVA/RC mensuel)
- [ ] Alerte dissimulation salariat (seuil 3 missions/mois)

### J. Garantie financière APST (priorité P0 du chemin critique)
- [ ] Lien `pdg-eventy/Eventy-Life-Dossier-Garantie-Financiere-COMPLET.docx`
- [ ] Mises à jour annuelles (échéance 31/03)
- [ ] Monitoring solde réserve 200 k€ minimum (compte séquestre)
- [ ] Cible An 1 : **1,6 M€** de garantie (cf. mémoire `project_garantie_apst`)
- [ ] Cotisation APST ~2 100 €/an
- [ ] Atout France 150 €/an
- [ ] RC Pro 780 — 1 200 €/an

### K. Conformité légale
- [ ] Immatriculation Atout France IM (n° d'immatriculation)
- [ ] Adhésion APST (Association Professionnelle de Solidarité du Tourisme)
- [ ] AGS (Association pour la Gestion du régime de garantie des créances des Salariés)
- [ ] RC Pro (Responsabilité Civile Professionnelle Tourisme)
- [ ] Conformité Code du Tourisme L211-18 (information préalable)
- [ ] Conformité Directive 2015/2302 EU (forfait touristique — lock fields voyage validé)
- [ ] RGPD (déjà couvert dans `pdg-eventy/01-legal/RGPD-CONFORMITE.md`)

### L. Reporting financier
- [ ] Bilan complet PCG (système base/abrégé/développé selon seuils)
- [ ] Compte de résultat mensuel/trimestriel/annuel
- [ ] Plan de trésorerie 24 mois
- [ ] Liasse fiscale 2050-2059 (régime réel)
- [ ] Annexes obligatoires (amortissements, provisions, engagements)
- [ ] Comparatif N/N-1 graphique avec variations %

### M. Export comptable
- [x] FEC mensuel/annuel (Fichier des Écritures Comptables — Art. L.47 A LPF)
- [x] CSV / Excel
- [ ] Pennylane API
- [ ] Sage / Cegid / EBP
- [ ] PDF/A-3 immuable (archivage 10 ans Scaleway Object Storage)

### N. Archivage légal
- [ ] **10 ans** : pièces comptables (Art. L.123-22 C.com)
- [ ] **10 ans** : factures émises et reçues (Art. L.102 B LPF)
- [ ] **5 ans** : bons de commande, contrats commerciaux
- [ ] **6 ans** : déclarations TVA et CA3
- [ ] **30 ans** : actes constitutifs (statuts, procès-verbaux AG)
- [ ] PDF/A-3 horodatage immuable

### O. Documents légaux
- [ ] Kbis (mise à jour trimestrielle)
- [ ] Statuts SAS Eventy Life
- [ ] Procès-verbaux AG
- [ ] Conventions partenaires (HRA, transporteurs, ambassadeurs)
- [ ] Police RC Pro
- [ ] Police IARD entreprise
- [ ] Bail commercial siège social

### P. Prévisionnel
- [ ] Budget annuel par catégorie + ventilation mensuelle
- [ ] Suivi mensuel réalisé vs prévu
- [ ] Écarts significatifs flaggés
- [ ] Simulation Monte Carlo 3 scénarios (optimiste / réaliste / pessimiste)

### Q. Lien admin/équipe
- [ ] Page comptable accessible aussi aux Admin + Équipe finance avec scope adapté
- [ ] Cloisonnement RBAC : comptable externe ne voit pas les marges détaillées par créateur (cf. `lib/pro/visibility.ts`)
- [ ] PDG voit tout

---

## 4. Évolutions récentes à intégrer (commits 2026-04-23 → 2026-05-03)

| Date | Commit | Impact comptable |
|------|--------|------------------|
| 2026-05-03 | `5e524ef6` refonte premium pro/revenus NET | **Aligner palette ivoire/gold sur portail comptable** |
| 2026-05-02 | Audit transferts aéroport | Nouvelle ligne facturation transfert privé/groupe |
| 2026-04-30 | feat voyages workflow validation équipe + lock fields UE 2015/2302 | Versioning + horodatage immuable des prix → comptable doit pouvoir tracer chaque édition |
| 2026-04-29 | Phase 1c Prix · Marges · Pension · Énergie | Nouveaux champs marge énergie, pas de marge sur cartes/énergie |
| 2026-04-28 | Phase 2 NFC commande auto | Ligne facturation cartes NFC (commande directe) |
| 2026-04-27 | Phase 0 Symphonie source + HRA | Architecture HRA partenaires + traçabilité par voyage |
| 2026-04-26 | confidentialité marge plateforme | **Comptable voit, pro non** — visibility.ts |
| 2026-04-23 | Création TODO-COMPTABLE.md (65 items) | Roadmap comptable structurée |

---

## 5. Architecture sidebar cible (15 sections)

```
┌─ TABLEAU DE BORD ─────────────────────────────┐
│  /comptable                                   │
└───────────────────────────────────────────────┘

┌─ FACTURATION ─────────────────────────────────┐
│  /comptable/facturation/emise                 │
│  /comptable/facturation/recue                 │
└───────────────────────────────────────────────┘

┌─ ENCAISSEMENTS & PAIEMENTS ───────────────────┐
│  /comptable/encaissements                     │
│  /comptable/paiements                         │
└───────────────────────────────────────────────┘

┌─ TVA & DÉCLARATIONS ──────────────────────────┐
│  /comptable/tva                               │
└───────────────────────────────────────────────┘

┌─ MARGES & COMMISSIONS ────────────────────────┐
│  /comptable/marges                            │
│  /comptable/cotisations                       │
│  /comptable/cotisation-forfait                │
└───────────────────────────────────────────────┘

┌─ RAPPROCHEMENT BANCAIRE ──────────────────────┐
│  /comptable/rapprochement                     │
│  /comptable/tresorerie                        │
└───────────────────────────────────────────────┘

┌─ PLAN COMPTABLE ──────────────────────────────┐
│  /comptable/plan-comptable                    │
│  /comptable/ecritures                         │
└───────────────────────────────────────────────┘

┌─ REPORTING FINANCIER ─────────────────────────┐
│  /comptable/reporting                         │
│  /comptable/bilan                             │
│  /comptable/rapports                          │
└───────────────────────────────────────────────┘

┌─ CHARGES SOCIALES ────────────────────────────┐
│  /comptable/social                            │
│  /comptable/charges                           │
└───────────────────────────────────────────────┘

┌─ GARANTIE FINANCIÈRE ─────────────────────────┐
│  /comptable/garantie-financiere               │
└───────────────────────────────────────────────┘

┌─ CONFORMITÉ LÉGALE ───────────────────────────┐
│  /comptable/conformite                        │
└───────────────────────────────────────────────┘

┌─ EXPORT & ARCHIVAGE ──────────────────────────┐
│  /comptable/exports                           │
│  /comptable/archivage                         │
│  /comptable/dossiers                          │
└───────────────────────────────────────────────┘

┌─ PRÉVISIONNEL ────────────────────────────────┐
│  /comptable/previsionnel                      │
│  /comptable/produits                          │
└───────────────────────────────────────────────┘

┌─ DOCUMENTS ───────────────────────────────────┐
│  /comptable/documents                         │
└───────────────────────────────────────────────┘

┌─ SUIVI ───────────────────────────────────────┐
│  /comptable/voyages                           │
│  /comptable/activites                         │
│  /comptable/portails                          │
│  /comptable/jeux-gains                        │
└───────────────────────────────────────────────┘

┌─ PARAMÈTRES ──────────────────────────────────┐
│  /comptable/parametres                        │
│  /comptable/support                           │
└───────────────────────────────────────────────┘
```

---

## 6. Design tokens — alignement portail pro premium

| Token | Valeur |
|-------|--------|
| Background | `#0A0E14` (noir profond) |
| Encre principale | `#F5F1E8` (ivoire premium) |
| Accent gold | `#D4A853` (or chaleureux) |
| Accent terracotta | `#C97D60` (terre) |
| Accent emerald | `#5B8A6E` (succès / positif) |
| Police titres | Playfair Display (500/600/700) |
| Police corps | Inter (300/400/500/600/700) |
| Glassmorphism | `rgba(245,241,232,0.03)` + `border-rgba(245,241,232,0.07)` + `backdropFilter: blur(14px)` |
| Halos ambient | radial-gradient 1200×600 px à 12% / 110% / 50% |
| Animations | Framer Motion `fadeUp` + `stagger` 0.07s |
| Border radius | 28px (hero), 24px (cards), 16px (chips) |
| Shadow premium | `0 20px 60px rgba(0,0,0,0.35)` |

---

## 7. TODO Eventy à intégrer dans chaque page (en commentaires)

```ts
// TODO Eventy: connecter API Pennylane / Sage / Cegid pour comptabilité automatisée
// TODO Eventy: import auto relevés bancaires (Open Banking PSD2 — Bridge / Budget Insight)
// TODO Eventy: génération auto FEC mensuel + horodatage TSA RFC 3161
// TODO Eventy: export Cegid / Sage / EBP pour expert-comptable externe
// TODO Eventy: rappels TVA J-3 et déclarations CA3 mensuelles (email + SMS)
// TODO Eventy: workflow validation paiements > 5 000 € (double signature PDG + comptable)
// TODO Eventy: dashboard comptable temps réel synchro avec créations voyages (event-driven)
// TODO Eventy: facturation électronique 2026 — Chorus Pro + Factur-X + Peppol
// TODO Eventy: OCR factures fournisseurs (Mindee / AWS Textract)
// TODO Eventy: rapprochement bancaire ML matching libellé + montant + date
// TODO Eventy: signature électronique conventions (Yousign / DocuSign)
// TODO Eventy: PDF/A-3 immuable archivage 10 ans (Scaleway Object Storage + Glacier)
```

---

## 8. Plan d'action (livrables)

1. ✅ Audit livré (ce document)
2. ⏳ Refonte `frontend/app/(comptable)/comptable/layout.tsx` — sidebar premium 15 sections
3. ⏳ Refonte `frontend/app/(comptable)/comptable/page.tsx` — dashboard premium
4. ⏳ Création 13 pages manquantes en placeholders premium (squelette + bientôt disponible + breadcrumb + CTAs + TODO Eventy)
5. ⏳ Push master + main
6. ⏳ Vérification Vercel READY

---

*Audit livré 2026-05-04 — Bras droit IA PDG · Eventy Life*
