# Archive TODO — Phase 2 juridique Eventy Life

> **Objet** : Registre centralise de tous les TODOs juridiques generes pour la phase 2 (jeux + activites + HRA).
> **Derniere mise a jour** : 2026-04-23
> **Source** : Portail avocat `/avocat` — pages Dashboard, Jeux, Revenus, Contrats, Conformite, Dossiers.
> **Convention** : Chaque TODO a un identifiant unique + priorite P1 (critique, bloquant) / P2 (important, non bloquant) / P3 (a prevoir).

---

## Legende priorites

| Priorite | Signification | Impact |
|----------|---------------|--------|
| **P1**   | Critique — bloquant lancement Phase 2 | Aucun jeu/activite ne peut ouvrir sans ces elements |
| **P2**   | Important — necessaire avant volume | Acceptable 30j apres lancement mais requis avant scale |
| **P3**   | A prevoir — amelioration continue | Optimisations, edge cases, evolution |

---

## 1. Dossier juridique JEUX — `/avocat/jeux`

### 1.1 Reglements types par categorie de jeu (TODO-JEUX-001 a 006)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-001 | P1 | Reglement quiz culturels (gratuit, sans obligation achat) |
| TODO-JEUX-002 | P1 | Reglement defis photo/video (cession droits image) |
| TODO-JEUX-003 | P1 | Reglement tournois groupes (modalites classement, ex-aequo) |
| TODO-JEUX-004 | P2 | Reglement championnat saison (duree, points, titre annuel) |
| TODO-JEUX-005 | P1 | Reglement tirage au sort (lot > 100 EUR = depot huissier) |
| TODO-JEUX-006 | P2 | Reglement programme ambassadeurs (bareme points, expiration) |

### 1.2 Conditions de participation (TODO-JEUX-010 a 015)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-010 | P1 | Age minimum 18 ans (ou parents pour mineurs accompagnes) |
| TODO-JEUX-011 | P2 | Clause residence France metropolitaine + DROM-COM ? |
| TODO-JEUX-012 | P1 | Exclusions : salaries Eventy, partenaires, famille directe |
| TODO-JEUX-013 | P2 | Une participation par personne / par voyage ? |
| TODO-JEUX-014 | P1 | Verification identite au moment de la remise du lot |
| TODO-JEUX-015 | P2 | Gestion participations multiples comptes / fraude |

### 1.3 Modalites de designation des gagnants (TODO-JEUX-020 a 025)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-020 | P1 | Merite pur (adresse, connaissance) : criteres de notation objectifs |
| TODO-JEUX-021 | P1 | Tirage au sort : outil certifie (RandomOrg / huissier) |
| TODO-JEUX-022 | P2 | Vote communautaire : regles anti-fraude et anti-triche |
| TODO-JEUX-023 | P2 | Mixte : part merite / part hasard a expliciter dans reglement |
| TODO-JEUX-024 | P2 | Procedure depart ex-aequo (rapidite, chronologie, re-tirage) |
| TODO-JEUX-025 | P1 | Publication des gagnants avec consentement RGPD |

### 1.4 Declaration huissier et validation SPEL (TODO-JEUX-030 a 035)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-030 | P1 | Identifier huissier de justice partenaire (Paris + province) |
| TODO-JEUX-031 | P1 | Grille tarifaire huissier (depot reglement + PV tirage) |
| TODO-JEUX-032 | P1 | Quand depot obligatoire : lot > 100 EUR unitaire ? |
| TODO-JEUX-033 | P2 | Archivage electronique des reglements deposes |
| TODO-JEUX-034 | P2 | Procedure urgence (tirage dernier moment sur voyage) |
| TODO-JEUX-035 | P3 | Alternative notaire si huissier indisponible |

### 1.5 RGPD et collecte donnees joueurs (TODO-JEUX-040 a 047)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-040 | P1 | Base legale : consentement explicite pour jeux concours |
| TODO-JEUX-041 | P1 | Finalites listees : participation, tirage, remise lot, communication |
| TODO-JEUX-042 | P1 | Duree conservation : 12 mois apres fin du jeu |
| TODO-JEUX-043 | P1 | Droit acces / rectification / effacement / portabilite |
| TODO-JEUX-044 | P2 | Transfert UE-only ou DPA explicites |
| TODO-JEUX-045 | P2 | Mention specifique pour photos/videos des joueurs |
| TODO-JEUX-046 | P1 | Consentement marketing DISTINCT du consentement jeu |
| TODO-JEUX-047 | P2 | Registre des traitements — fiche dediee jeux concours |

### 1.6 Fiscalite des gains et des lots (TODO-JEUX-050 a 056)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-050 | P2 | Lots < 1 500 EUR : pas de declaration du gagnant |
| TODO-JEUX-051 | P1 | Lots > 1 500 EUR : DAS2 a deposer par Eventy |
| TODO-JEUX-052 | P2 | Voyages offerts : evaluation valeur, BNC ou cadeau non imposable ? |
| TODO-JEUX-053 | P2 | TVA sur les lots : recuperation ou integration cout |
| TODO-JEUX-054 | P3 | Bons achat partenaires : qui emet, qui comptabilise |
| TODO-JEUX-055 | P3 | Credits fidelite : expiration, caducite, provisions |
| TODO-JEUX-056 | P2 | Montage fiscal championnat annuel (lot > 5 000 EUR) |

### 1.7 Frontiere jeux d'argent — interdits (TODO-JEUX-060 a 065)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-060 | P1 | Aucun achat requis pour participer (au besoin : NPAI) |
| TODO-JEUX-061 | P1 | Aucune mise financiere (ni directe ni deguisee) |
| TODO-JEUX-062 | P1 | Remboursement frais de participation sur demande |
| TODO-JEUX-063 | P1 | Pas de paris sportifs ou cotes sans agrement ANJ |
| TODO-JEUX-064 | P1 | Pas de machines sous / paris en ligne |
| TODO-JEUX-065 | P1 | Verification conformite : jeux ne doivent pas tomber sous L.320-1 |

### 1.8 Droits image et contenus generes par joueurs (TODO-JEUX-070 a 075)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-070 | P1 | Cession droits photo/video defis — forme ecrite |
| TODO-JEUX-071 | P2 | Duree utilisation (reseaux, site, supports commerciaux) |
| TODO-JEUX-072 | P2 | Territoires : France / UE / Monde |
| TODO-JEUX-073 | P2 | Droit de retrait par le joueur a tout moment |
| TODO-JEUX-074 | P1 | Protection mineurs presents sur contenus |
| TODO-JEUX-075 | P2 | Moderation contenus inappropries / diffamatoires |

### 1.9 Resolution des litiges et reclamations (TODO-JEUX-080 a 085)

| ID | Prio | Description |
|----|------|-------------|
| TODO-JEUX-080 | P2 | Point contact unique reclamations jeux (email dedie) |
| TODO-JEUX-081 | P1 | Delai reponse maximum (15 jours recommande) |
| TODO-JEUX-082 | P1 | Mediation consommation designee pour litiges jeux |
| TODO-JEUX-083 | P2 | Clause attributive juridiction (consommateur = residence) |
| TODO-JEUX-084 | P2 | Archivage preuves participation + resultats |
| TODO-JEUX-085 | P3 | Procedure exclusion joueur (fraude, triche, incivilites) |

**Total JEUX** : 54 articles (P1=26, P2=22, P3=6)

---

## 2. Revenus avocat — `/avocat/revenus`

### 2.1 Cotisation juridique 1.1% (TODO-REVENU-001 a 004)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-001 | P1 | Bareme 1.1% applique sur la marge brute, pas sur CA — **VALIDE** |
| TODO-REVENU-002 | P2 | Plafond mensuel applicable ? (ex : 3 500 EUR/mois) |
| TODO-REVENU-003 | P2 | Seuil declenchement : a partir de quel CA ? |
| TODO-REVENU-004 | P3 | Redistribution si 2eme avocat / consultant externe |

### 2.2 Contrats HRA (TODO-REVENU-010 a 014)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-010 | P1 | Forfait redaction contrat type HRA (450 EUR suggere) |
| TODO-REVENU-011 | P1 | Forfait validation contrat partenaire ponctuel (180 EUR) |
| TODO-REVENU-012 | P2 | Avenant / renouvellement : 50% forfait initial ? |
| TODO-REVENU-013 | P2 | Urgence (< 48h) : majoration 30% ? |
| TODO-REVENU-014 | P3 | Pack 10 contrats negocie avec remise |

### 2.3 Contrats activites independantes (TODO-REVENU-020 a 023)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-020 | P1 | Modele type par metier (9 roles independants) |
| TODO-REVENU-021 | P1 | Forfait redaction initial (350 EUR/modele) |
| TODO-REVENU-022 | P2 | Commission continue : 1% marge activite possible |
| TODO-REVENU-023 | P2 | Validation anti-requalification : forfait audit annuel |

### 2.4 Reglements jeux et concours (TODO-REVENU-030 a 034)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-030 | P1 | Reglement simple (quiz, defi) : 280 EUR suggere |
| TODO-REVENU-031 | P1 | Reglement complexe (tournoi, championnat) : 650 EUR |
| TODO-REVENU-032 | P1 | Reglement tirage au sort + depot huissier : 900 EUR |
| TODO-REVENU-033 | P2 | Commission continue sur jeux recurrents ? |
| TODO-REVENU-034 | P2 | Validation conformite saisonniere : 200 EUR/trimestre |

### 2.5 Traitement DSAR et RGPD (TODO-REVENU-040 a 043)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-040 | P2 | DSAR simple (acces donnees) : 120 EUR |
| TODO-REVENU-041 | P2 | DSAR complexe (effacement + reproduction) : 280 EUR |
| TODO-REVENU-042 | P1 | Violation CNIL notification : 450 EUR urgence |
| TODO-REVENU-043 | P2 | Mise a jour registre traitements : forfait trimestriel |

### 2.6 Gestion litiges clients (TODO-REVENU-050 a 053)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-050 | P1 | Taux horaire : 150 a 220 EUR/h selon complexite |
| TODO-REVENU-051 | P2 | Forfait mediation consommation : 350 EUR |
| TODO-REVENU-052 | P2 | Forfait procedure amiable ecrite : 280 EUR |
| TODO-REVENU-053 | P1 | Contentieux : devis au cas par cas, provision 1 500 EUR |

### 2.7 Audit conformite continue (TODO-REVENU-060 a 063)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-060 | P1 | Forfait audit complet semestriel (1 500 EUR) |
| TODO-REVENU-061 | P2 | Rapport synthese + plan action : inclus |
| TODO-REVENU-062 | P2 | Support email entre 2 audits : inclus 5h |
| TODO-REVENU-063 | P3 | Heures supp : 180 EUR/h |

### 2.8 Missions ponctuelles (TODO-REVENU-070 a 073)

| ID | Prio | Description |
|----|------|-------------|
| TODO-REVENU-070 | P1 | Taux horaire standard a confirmer (180 EUR suggere) |
| TODO-REVENU-071 | P2 | Consultation telephonique express : forfait 60 EUR |
| TODO-REVENU-072 | P2 | Avis ecrit court : forfait 250 EUR |
| TODO-REVENU-073 | P3 | Deplacement : facturation temps + frais |

**Total REVENUS** : 33 articles (P1=14, P2=15, P3=4)

---

## 3. Contrats — `/avocat/contrats`

| ID | Prio | Description | Statut |
|----|------|-------------|--------|
| TODO-CONTRAT-001 | P1 | Contrat pro organisateur voyage | brouillon |
| TODO-CONTRAT-002 | P1 | Contrat partenaire/magasin (places + sponsoring jeux) | todo |
| TODO-CONTRAT-003 | P1 | Contrat indep. HRA (accompagnateur, chauffeur, coord, createur, decorateur) | todo |
| TODO-CONTRAT-004 | P1 | Contrat createur activites independantes | en_redaction |
| TODO-CONTRAT-005 | P2 | Contrat ambassadeur + parrainage | todo |
| TODO-CONTRAT-006 | P1 | Contrat transporteur | brouillon |
| TODO-CONTRAT-007 | P1 | CGV client (reservation, annulation, remboursement) | en_redaction |
| TODO-CONTRAT-008 | P2 | CGU plateforme | todo |
| TODO-CONTRAT-009 | P1 | Politique de confidentialite | valide (maintenir a jour) |
| TODO-CONTRAT-010 | P1 | Mentions legales | valide (+ Atout France + APST) |
| TODO-CONTRAT-011 | P1 | Reglement jeux concours Eventy Life | todo |

**Total CONTRATS** : 11 contrats (P1=9, P2=2, P3=0)

---

## 4. Conformite — `/avocat/conformite`

| ID | Prio | Description | Statut |
|----|------|-------------|--------|
| TODO-CONFO-001 | P1 | RGPD complet (DPO, registre, DSAR) | orange |
| TODO-CONFO-002 | P1 | Directive voyage a forfait 2015/2302 | rouge |
| TODO-CONFO-003 | P1 | Assurance RC Pro tourisme | rouge |
| TODO-CONFO-004 | P1 | Immatriculation Atout France | rouge |
| TODO-CONFO-005 | P1 | Garantie financiere voyagiste (APST) | rouge |
| TODO-CONFO-006 | P2 | Mediation consommation designee | orange |
| TODO-CONFO-007 | P2 | Anti-blanchiment (KYC TRACFIN) | orange |
| TODO-CONFO-008 | P2 | Conformite paiement (DSP2, PCI-DSS) | vert |
| TODO-CONFO-009 | P1 | Reglementation jeux concours | rouge |

**Total CONFORMITE** : 9 dossiers (P1=6, P2=3, P3=0)

---

## 5. Dossiers juridiques — `/avocat/dossiers`

| ID | Prio | Titre | Deadline |
|----|------|-------|----------|
| TODO-DOSSIER-001 | P1 | Reglements jeux concours (6 types) | 2026-06-15 |
| TODO-DOSSIER-002 | P1 | Contrats HRA hebergement | 2026-05-30 |
| TODO-DOSSIER-003 | P1 | Contrats HRA restauration | 2026-05-30 |
| TODO-DOSSIER-004 | P1 | Contrats HRA activites | 2026-05-30 |
| TODO-DOSSIER-005 | P1 | Contrats independants 9 metiers | 2026-06-01 |
| TODO-DOSSIER-006 | P1 | Depot huissier reglements jeux | 2026-06-30 |
| TODO-DOSSIER-007 | P2 | Cession droits image defis photo/video | 2026-06-15 |
| TODO-DOSSIER-008 | P2 | Contrat ambassadeur + parrainage | 2026-07-01 |
| TODO-DOSSIER-009 | P2 | Partenaires sponsors jeux / voyages | 2026-07-15 |
| TODO-DOSSIER-010 | P1 | Audit requalification independants | 2026-06-01 |
| TODO-DOSSIER-011 | P1 | Extension RC Pro activites + jeux | 2026-05-30 |
| TODO-DOSSIER-012 | P2 | Registre traitements — fiches nouvelles | 2026-06-20 |

**Total DOSSIERS** : 12 dossiers (P1=8, P2=4, P3=0)

---

## Recapitulatif global

| Page                 | Total TODOs | P1 | P2 | P3 |
|----------------------|-------------|----|----|----|
| JEUX                 | 54          | 26 | 22 | 6  |
| REVENUS              | 33          | 14 | 15 | 4  |
| CONTRATS             | 11          | 9  | 2  | 0  |
| CONFORMITE           | 9           | 6  | 3  | 0  |
| DOSSIERS             | 12          | 8  | 4  | 0  |
| **TOTAL**            | **119**     | **63** | **46** | **10** |

---

## Plan d'attaque suggere

### Sprint 1 — Deblocage lancement Phase 2 (P1 critiques, 63 articles)
1. Contrats HRA types + activites independantes (anti-requalif)
2. Reglements 6 types de jeux + depot huissier
3. Atout France + garantie APST + RC Pro elargie
4. CGV v3 + mentions legales complets
5. RGPD finalites jeux + consentement dissocie

### Sprint 2 — Scale-up (P2, 46 articles)
1. Bareme honoraires forfaitaires complet
2. Mediation consommation
3. Ambassadeurs + sponsors partenaires
4. Audit semestriel conformite

### Sprint 3 — Maturite (P3, 10 articles)
1. Edge cases + alternatives
2. Remises volumes + optimisations
3. Procedures d'exclusion et litiges rares

---

## Emplacement des TODOs dans le portail

| ID pattern | Page | Route |
|------------|------|-------|
| TODO-JEUX-*    | Dossier juridique JEUX      | `/avocat/jeux`       |
| TODO-REVENU-*  | Revenus avocat              | `/avocat/revenus`    |
| TODO-CONTRAT-* | Gestion contrats            | `/avocat/contrats`   |
| TODO-CONFO-*   | Conformite juridique        | `/avocat/conformite` |
| TODO-DOSSIER-* | Dossiers juridiques         | `/avocat/dossiers`   |

Tout TODO doit etre resolu dans l'interface, puis retire de cette archive.
