# TODO Finance & Comptabilité — Eventy
> Audit complet 25/04/2026 — Priorités P0 (bloquant lancement), P1 (critique), P2 (important), P3 (amélioration)

---

## P0 — BLOQUANT LANCEMENT

### [FC-01] Génération PDF factures légales (P0)
- **Problème** : Aucune génération PDF de factures conformes au droit français
- **Requis** :
  - En-tête société (nom, SIRET, adresse, n° TVA intracommunautaire)
  - Numérotation séquentielle sans saut (Art. 242 nonies A CGI)
  - Mention "TVA non applicable — régime marge Art. 306 bis CGI" ou ventilation TVA si applicable
  - IBAN pour virement bancaire
  - Conditions de règlement & pénalités de retard (LME 2008)
  - Date d'émission + date de prestation
  - Coordonnées client (nom, adresse)
- **Fichiers concernés** : `frontend/app/(comptable)/comptable/factures/page.tsx`
- **Backend** : Endpoint `/admin/finance/invoices/:id/pdf` à créer

### [FC-02] Numérotation séquentielle factures (P0)
- **Problème** : Pas de contrôle de séquence — trous dans la numérotation illégaux
- **Requis** :
  - Séquence EV-2026-XXXX sans interruption
  - Validation serveur avant attribution du numéro
  - Alerte admin si numéro manquant détecté
- **Backend** : Séquence PostgreSQL + contrainte UNIQUE

### [FC-03] Factures électroniques 2026 (P0)
- **Problème** : Obligation facture électronique pour B2B (loi finances 2024, report sept. 2026)
- **Requis** :
  - Export Factur-X / ZUGFeRD (format mixte PDF + XML)
  - Connexion Chorus Pro (marché public)
  - Support Peppol (Europe)
- **Priorité** : Avant sept. 2026 pour B2B

---

## P1 — CRITIQUE (< 30 jours)

### [FC-04] TVA sur la marge — implémentation comptable (P1)
- **Problème** : Le régime est documenté mais le calcul comptable n'est pas implémenté end-to-end
- **Requis** :
  - Calcul automatique marge = Prix vente TTC − Coûts directs TTC
  - TVA = Marge × (taux / 1 + taux) — méthode globale trimestrielle
  - Ventilation par voyage pour justificatif DGFiP
  - Impossibilité de déduire TVA sur achats (règle forfaits)
  - Export format DGFiP pour déclaration CA3/CA12
- **Régime** : Art. 306 bis CGI — Directive 2006/112/CE Art. 306-310
- **Fichiers** : `frontend/app/(admin)/admin/finance/tva/page.tsx`

### [FC-05] Rapprochement bancaire automatique (P1)
- **Problème** : Rapprochement manuel uniquement — risque d'erreurs et perte de temps
- **Requis** :
  - Import relevé bancaire (CSV, OFX, CAMT.053, MT940)
  - Algorithme de matching automatique (montant + date ± 3 jours + libellé)
  - Validation manuelle des exceptions
  - Export écarts non rapprochés
- **Fichiers** : `frontend/app/(equipe)/equipe/finance/rapprochement/page.tsx`

### [FC-06] Audit trail financial (P1)
- **Problème** : Aucun log immuable de QUI a fait QUOI sur les transactions
- **Requis** :
  - Log signé (user_id + timestamp + action + valeur avant/après)
  - Lecture seule — aucune modification possible après enregistrement
  - Export audit trail (CSV, PDF signé)
  - Alertes sur modifications d'écritures déjà validées
- **Backend** : Table `finance_audit_log` avec trigger PostgreSQL

### [FC-07] Déclaration DAS2 (P1)
- **Problème** : Pas de génération automatique DAS2 pour indépendants
- **Requis** :
  - Extraction annuelle des versements > 1 200 €/an par bénéficiaire
  - Format EDI-TDFC2 pour transmission DGFiP
  - Agrégation par SIRET/NIF du bénéficiaire
- **Fichiers** : `frontend/app/(comptable)/comptable/cotisations/page.tsx`

### [FC-08] Clôture mensuelle formalisée (P1)
- **Problème** : Workflow de clôture existe mais pas de validation finale avec signature
- **Requis** :
  - Checklist 8 points obligatoires avant validation
  - Double validation (comptable + PDG) avec signature numérique
  - Verrouillage des écritures après clôture (immutabilité)
  - Archivage automatique ZIP (factures + journal + FEC + TVA)
- **Fichiers** : `frontend/app/(admin)/admin/finance/closing/page.tsx`

---

## P2 — IMPORTANT (< 60 jours)

### [FC-09] Taxe de séjour — gestion par commune (P2)
- **Problème** : Taxe de séjour trackée globalement mais pas par commune avec tarifs officiels
- **Requis** :
  - Table des tarifs officiels 2026 par commune (Paris, Nice, Lyon, Marseille, etc.)
  - Calcul automatique à la réservation selon destination + durée + nb personnes
  - Déclaration trimestrielle par commune (formulaire Cerfa)
  - Versement à la collectivité (calendrier automatique)
- **Tarifs 2026** : Paris 3,75%, Nice 5%, Lyon 2,88%, Bordeaux 1,50%

### [FC-10] Taxe jeux-concours — obligations déclaratives (P2)
- **Problème** : Taxe collectée mais sans génération des déclarations fiscales
- **Requis** :
  - Prélèvement 7,5% sur mises (Art. 302 bis ZG CGI)
  - Gains > 1 500 € : obligation déclarative IFU (imprimé fiscal unique)
  - Gains > 300 € en nature : évaluation et déclaration
  - Formulaire 2777 mensuel
- **Fichiers** : `frontend/app/(admin)/admin/finance/jeux-taxes/page.tsx`

### [FC-11] Bilan comptable réglementaire (P2)
- **Problème** : Bilan existe mais format non conforme Plan Comptable Général (PCG 82)
- **Requis** :
  - Structure ACTIF/PASSIF selon liasse fiscale 2050
  - Compte de résultat format 2052
  - Annexe comptable
  - Export Excel liasse fiscale (compatible EDI-TDFC2)
- **Fichiers** : `frontend/app/(comptable)/comptable/bilan/page.tsx`

### [FC-12] Export comptable format expert-comptable (P2)
- **Problème** : Exports existent mais pas dans tous les formats standards
- **Requis** :
  - FEC (Fichier des Écritures Comptables) — format DGFiP obligatoire
  - Export CSV Pennylane, Cegid, Sage, QuickBooks
  - Export Grand Livre format PCG
  - Export Balance générale
- **Fichiers** : `frontend/app/(admin)/admin/finance/exports-comptable/page.tsx`

### [FC-13] Modèle 82/18 — traçabilité comptable (P2)
- **Problème** : Le modèle 82/18 est implémenté fonctionnellement mais les écritures comptables ne reflètent pas la ventilation
- **Requis** :
  - Écriture débit/crédit automatique à chaque paiement selon le split
  - 82% → compte Eventy
  - 18% → compte provision indépendant (passif)
  - Versement effectif → débit provision + crédit trésorerie
- **Référence mémoire** : project_8218_model.md

### [FC-14] Provisions & amortissements (P2)
- **Manque** : Aucune gestion des provisions comptables
- **Requis** :
  - Provision pour créances douteuses (clients en litige)
  - Provision annulation voyages (remboursements futurs probables)
  - Amortissement des actifs immatériels (développement logiciel Art. 721-1 PCG)

---

## P3 — AMÉLIORATION

### [FC-15] Prévisionnel vs Réalisé (P3)
- Comparaison budget/réalisé par voyage et global
- Variance analysis avec alertes dépassement

### [FC-16] Tableau de trésorerie (P3)
- Trésorerie prévisionnelle 90 jours glissants
- Alertes BFR (besoin en fonds de roulement)
- Simulation impact scénarios (annulation voyage, retard paiement)

### [FC-17] Intégration comptable automatique (P3)
- API Pennylane (comptabilité SaaS)
- Sync automatique des écritures via webhook
- Validation comptable depuis Pennylane

### [FC-18] Multi-devises (P3)
- Voyages à l'étranger avec coûts en devises étrangères
- Taux de change temps réel (ECB API)
- Rapport d'exposition forex

---

## Récapitulatif priorités

| ID | Description | Priorité | Délai |
|----|-------------|----------|-------|
| FC-01 | PDF factures légales | **P0** | Avant tout lancement |
| FC-02 | Numérotation séquentielle | **P0** | Avant tout lancement |
| FC-03 | Factures électroniques | **P0** | Avant sept. 2026 B2B |
| FC-04 | TVA marge comptable | **P1** | < 30 jours |
| FC-05 | Rapprochement bancaire auto | **P1** | < 30 jours |
| FC-06 | Audit trail financier | **P1** | < 30 jours |
| FC-07 | DAS2 indépendants | **P1** | Avant 01/02/2027 |
| FC-08 | Clôture mensuelle | **P1** | < 30 jours |
| FC-09 | Taxe séjour communes | **P2** | < 60 jours |
| FC-10 | Taxe jeux déclarations | **P2** | < 60 jours |
| FC-11 | Bilan PCG conforme | **P2** | < 60 jours |
| FC-12 | Exports expert-comptable | **P2** | < 60 jours |
| FC-13 | 82/18 écritures comptables | **P2** | < 60 jours |
| FC-14 | Provisions & amortissements | **P2** | < 60 jours |
| FC-15 | Prévisionnel vs Réalisé | P3 | Roadmap |
| FC-16 | Tableau trésorerie | P3 | Roadmap |
| FC-17 | Intégration Pennylane | P3 | Roadmap |
| FC-18 | Multi-devises | P3 | Roadmap |

---
*Audit réalisé le 25/04/2026 — Mise à jour à chaque validation d'étape*
