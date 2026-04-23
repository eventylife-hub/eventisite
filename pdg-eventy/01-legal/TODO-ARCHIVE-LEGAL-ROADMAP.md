# Roadmap juridique Eventy Life — Archive TODOs par phase

> **Principe fondateur** : Chaque phase peut etre activee INDEPENDAMMENT selon l'avancement.
> Le site est PRET pour tout, on active etape par etape.
>
> **Derniere mise a jour** : 2026-04-23
> **Source** : `/avocat/roadmap` (frontend) — page de reference unique.
> **Nomenclature** : `TODO-LEGAL-P{phase}-{numero}`

---

## Priorites

| Code | Niveau | Usage |
|------|--------|-------|
| **P1** | Critique — bloquant activation de la phase | La phase ne peut pas etre activee sans ces elements valides |
| **P2** | Important — necessaire avant scale | Acceptable dans les 30 jours suivant l'activation |
| **P3** | A prevoir — amelioration continue | Evolutions et edge-cases |

## Statuts d'un TODO

- `pas_commence` : aucun travail demarre
- `en_cours` : redaction ou validation en cours
- `valide` : acheve et approuve
- `bloque` : en attente d'un input externe (decision, document, tiers)

## Statuts d'une phase

- `pas_commence` : aucun P1 valide
- `en_cours` : des P1 valides, mais pas tous
- `pret` : tous les P1 valides — peut etre activee juridiquement
- `actif` : phase activee et operationnelle

---

# PHASE 1 — Lancement vitrine

> **Activation** : avant toute mise en ligne publique du site.
> **Prerequis** : aucun.
> **Condition bloquante** : tous les P1 de cette phase valides.
> **Cadre legal** : LCEN 2004-575, RGPD + Loi Info & Libertes, Code conso L.121, Recommandations CNIL 2020, Loi 11 fevrier 2005.

## 1.1 Documents legaux site

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P1-001 | P1 | Mentions legales completes (editeur, hebergeur, directeur publication) | LCEN art. 6-III | en_cours |
| TODO-LEGAL-P1-002 | P1 | CGU plateforme (utilisation site, comportement, sanctions) | Code conso L.221 | en_cours |
| TODO-LEGAL-P1-003 | P1 | Politique de confidentialite RGPD complete | RGPD art. 12-14 | valide |
| TODO-LEGAL-P1-004 | P1 | Politique cookies + banner consentement CNIL | Recommandations CNIL 2020 | valide |
| TODO-LEGAL-P1-005 | P2 | Accessibilite — declaration RGAA niveau AA | Loi 11 fev 2005 | pas_commence |
| TODO-LEGAL-P1-006 | P2 | Charte moderation contenus (avis, commentaires) | LCEN art. 6 | pas_commence |

## 1.2 RGPD fondations

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P1-010 | P1 | Registre des traitements Art. 30 (fiches par finalite) | RGPD art. 30 | en_cours |
| TODO-LEGAL-P1-011 | P1 | Designation DPO ou justification formelle | RGPD art. 37 | pas_commence |
| TODO-LEGAL-P1-012 | P1 | Procedure DSAR operationnelle (SLA 30j, circuit valide) | RGPD art. 12 | en_cours |
| TODO-LEGAL-P1-013 | P1 | DPA Stripe signe (sous-traitant paiement) | RGPD art. 28 | valide |
| TODO-LEGAL-P1-014 | P1 | DPA Vercel signe (hebergeur) | RGPD art. 28 | pas_commence |
| TODO-LEGAL-P1-015 | P1 | DPA Scaleway signe (hebergeur donnees UE) | RGPD art. 28 | pas_commence |
| TODO-LEGAL-P1-016 | P1 | Duree conservation par type de donnee (matrice) | RGPD art. 5.1.e | en_cours |
| TODO-LEGAL-P1-017 | P1 | Chiffrement donnees sensibles (TLS + at-rest) | RGPD art. 32 | valide |
| TODO-LEGAL-P1-018 | P2 | Template notification CNIL violation donnees | RGPD art. 33 | pas_commence |
| TODO-LEGAL-P1-019 | P1 | Consentement marketing DISSOCIE consentement compte | RGPD art. 7 | pas_commence |
| TODO-LEGAL-P1-020 | P1 | Droit oubli implemente (suppression compte + archivage legal) | RGPD art. 17 | pas_commence |

## 1.3 Information consommateur

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P1-030 | P2 | Page contact + formulaire reclamation accessible | Code conso L.611 | pas_commence |
| TODO-LEGAL-P1-031 | P2 | Mention mediation consommation (preparation phase 2) | Code conso L.616 | pas_commence |
| TODO-LEGAL-P1-032 | P3 | FAQ juridique voyageur (droits, recours) | — | pas_commence |

**Total Phase 1** : 20 TODOs (P1=13, P2=6, P3=1)

---

# PHASE 2 — Premiers clients voyageurs

> **Activation** : avant 1ere reservation payante client.
> **Prerequis** : Phase 1.
> **Condition bloquante** : Atout France + APST + RC Pro + CGV voyages + 6 contrats pros.
> **Cadre legal** : Code Tourisme L.211, Directive 2015/2302 UE, Arrete 23 dec 2009, C. Trav. L.8221, DSP2.

## 2.1 Immatriculation et garanties

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P2-001 | P1 | Immatriculation Atout France — numero IM delivre | CT art. L.211-18 | pas_commence |
| TODO-LEGAL-P2-002 | P1 | Adhesion APST + garantie financiere active | CT art. L.211-18 II | pas_commence |
| TODO-LEGAL-P2-003 | P1 | RC Professionnelle tourisme — police signee | CT art. L.211-18 III | pas_commence |
| TODO-LEGAL-P2-004 | P1 | Calcul garantie basee sur CA previsionnel 12 mois | Arrete 23 dec 2009 | pas_commence |
| TODO-LEGAL-P2-005 | P1 | Affichage numero IM sur tous supports commerciaux | CT art. R.211-19 | pas_commence |

## 2.2 Documents contractuels voyageurs

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P2-010 | P1 | CGV voyages conformes art. L.211-1 et s. | Code Tourisme | en_cours |
| TODO-LEGAL-P2-011 | P1 | Fiche info precontractuelle standardisee (arrete 2018) | Directive 2015/2302 | pas_commence |
| TODO-LEGAL-P2-012 | P1 | Contrat voyage — mentions obligatoires art. R.211-4 | CT art. R.211-4 | pas_commence |
| TODO-LEGAL-P2-013 | P1 | Clause retractation ou absence justifiee (exception voyage) | Code conso L.221-28 | pas_commence |
| TODO-LEGAL-P2-014 | P1 | Procedure modification prix post-contrat (>8% = resiliation) | CT art. L.211-12 | pas_commence |
| TODO-LEGAL-P2-015 | P1 | Procedure annulation voyageur + baremes | CT art. L.211-14 | pas_commence |
| TODO-LEGAL-P2-016 | P1 | Procedure annulation organisateur (sous-effectif, cas force majeure) | CT art. L.211-13 | pas_commence |
| TODO-LEGAL-P2-017 | P1 | Affichage prix TTC + details composants (transport, heb., etc.) | Code conso L.112 | pas_commence |
| TODO-LEGAL-P2-018 | P2 | Documents voyage remis avant depart (horaires, bons, contacts) | CT art. L.211-10 | pas_commence |

## 2.3 Contrats professionnels

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P2-020 | P1 | Contrat pro organisateur voyage (mandat) | Code civ. art. 1984 | pas_commence |
| TODO-LEGAL-P2-021 | P1 | Contrat accompagnateur independant — anti-requalif | C. Trav. L.8221 | en_cours |
| TODO-LEGAL-P2-022 | P1 | Contrat chauffeur independant — anti-requalif | C. Trav. L.8221 | en_cours |
| TODO-LEGAL-P2-023 | P1 | Contrat coordinateur independant — anti-requalif | C. Trav. L.8221 | en_cours |
| TODO-LEGAL-P2-024 | P1 | Contrat transporteur — LOTI + assurance voyageurs | Loi 82-1153 LOTI | pas_commence |
| TODO-LEGAL-P2-025 | P2 | Contrats hebergeurs HRA — convention partenariat | Code civ. contrats | pas_commence |
| TODO-LEGAL-P2-026 | P2 | Contrats restaurateurs HRA — convention partenariat | Code civ. contrats | pas_commence |
| TODO-LEGAL-P2-027 | P1 | Audit anti-requalification (vocabulaire, livrables, ordres) | C. Trav. L.8221-3 | pas_commence |

## 2.4 Conformite metier agence voyages

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P2-030 | P1 | Adhesion mediateur consommation tourisme | Code conso L.612 | pas_commence |
| TODO-LEGAL-P2-031 | P2 | Pack assurance voyage clients (Pack Serenite) | — | pas_commence |
| TODO-LEGAL-P2-032 | P2 | Anti-blanchiment — KYC voyageurs si seuil atteint | Code mon. fin. L.561 | pas_commence |
| TODO-LEGAL-P2-033 | P1 | Conformite DSP2 / 3DS / SCA via Stripe | DSP2 | valide |
| TODO-LEGAL-P2-034 | P2 | Responsabilite solidaire art. L.211-16 — couverte par RC Pro | CT art. L.211-16 | pas_commence |
| TODO-LEGAL-P2-035 | P2 | TVA marge agence voyages (art. 266-1 CGI) | CGI art. 266-1 | pas_commence |
| TODO-LEGAL-P2-036 | P2 | Fiches RGPD specifiques voyages (passeport, sante) | RGPD art. 9 | pas_commence |

**Total Phase 2** : 29 TODOs (P1=22, P2=7, P3=0)

---

# PHASE 3 — Jeux et activites

> **Activation** : avant ouverture 1er jeu ou 1ere activite independante.
> **Prerequis** : Phase 1 + Phase 2.
> **Condition bloquante** : reglements deposes + huissier + contrats activites + RGPD jeux.
> **Cadre legal** : Loi 21 mai 1836, Code conso L.121-36 a L.121-41, CSI L.320-1, CGI art. 92, RGPD.

## 3.1 Reglements des jeux

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P3-001 | P1 | Reglement quiz culturels (adresse, sans hasard) | C. conso L.121-36 | pas_commence |
| TODO-LEGAL-P3-002 | P1 | Reglement defis photo/video (cession droits image) | Code prop. intel. | pas_commence |
| TODO-LEGAL-P3-003 | P1 | Reglement tournoi groupe (classement, ex-aequo) | C. conso L.121-36 | pas_commence |
| TODO-LEGAL-P3-004 | P2 | Reglement championnat saison (points, titre annuel) | C. conso L.121-36 | pas_commence |
| TODO-LEGAL-P3-005 | P1 | Reglement tirage au sort — lot >100 EUR = depot huissier | Loi 21 mai 1836 | pas_commence |
| TODO-LEGAL-P3-006 | P2 | Reglement programme ambassadeurs (points, expiration) | C. conso L.121 | pas_commence |

## 3.2 Conformite jeux-concours

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P3-010 | P1 | Huissier de justice partenaire identifie + convention | Loi 21 mai 1836 | pas_commence |
| TODO-LEGAL-P3-011 | P1 | Verification absence jeu argent L.320-1 (NPAI + pas de mise) | CSI L.320-1 | pas_commence |
| TODO-LEGAL-P3-012 | P1 | Remboursement frais participation sur demande | C. conso L.121-41 | pas_commence |
| TODO-LEGAL-P3-013 | P1 | Conditions participation (18+, exclusions, residence) | — | pas_commence |
| TODO-LEGAL-P3-014 | P1 | Protection mineurs (contenus, photos, votes) | C. civ. art. 9 | pas_commence |
| TODO-LEGAL-P3-015 | P2 | Procedure exclusion joueur fraude/triche | — | pas_commence |

## 3.3 RGPD jeux-concours

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P3-020 | P1 | Fiche registre traitement dediee jeux | RGPD art. 30 | pas_commence |
| TODO-LEGAL-P3-021 | P1 | Consentement marketing DISSOCIE du consentement jeu | RGPD art. 7 | pas_commence |
| TODO-LEGAL-P3-022 | P1 | Duree conservation 12 mois max apres fin jeu | RGPD art. 5.1.e | pas_commence |
| TODO-LEGAL-P3-023 | P2 | Publication gagnants avec consentement specifique | RGPD art. 7 | pas_commence |
| TODO-LEGAL-P3-024 | P1 | Cession droits image defis — document ecrit | CPI L.121 | pas_commence |

## 3.4 Activites independantes

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P3-030 | P1 | Contrat type createur activite independant | C. Trav. L.8221 | pas_commence |
| TODO-LEGAL-P3-031 | P2 | Contrat decorateur independant | C. Trav. L.8221 | pas_commence |
| TODO-LEGAL-P3-032 | P2 | Contrat animateur independant | C. Trav. L.8221 | pas_commence |
| TODO-LEGAL-P3-033 | P2 | Contrat photographe independant — cession droits | Code prop. intel. | pas_commence |
| TODO-LEGAL-P3-034 | P2 | Extension RC Pro pour activites annexes | — | pas_commence |
| TODO-LEGAL-P3-035 | P1 | Modele 82/18 marge — documente contractuellement | — | pas_commence |

## 3.5 Fiscalite jeux et lots

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P3-040 | P1 | DAS2 a deposer si lot >1500 EUR par beneficiaire | CGI art. 240 | pas_commence |
| TODO-LEGAL-P3-041 | P2 | Evaluation valeur voyage offert — reportable BNC | CGI art. 92 | pas_commence |
| TODO-LEGAL-P3-042 | P2 | TVA sur lots (recuperation ou cout) | CGI art. 256 | pas_commence |

## 3.6 Contrats sponsors lots

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P3-050 | P2 | Contrat sponsor fourniture lot (visibilite + lot en nature) | — | pas_commence |
| TODO-LEGAL-P3-051 | P2 | Clause responsabilite en cas defaut sponsor | — | pas_commence |
| TODO-LEGAL-P3-052 | P3 | Reporting au sponsor (vues, participations, gagnant) | RGPD agrege | pas_commence |

**Total Phase 3** : 28 TODOs (P1=14, P2=13, P3=1)

---

# PHASE 4 — Packs et partenaires magasins

> **Activation** : avant 1er pack vendu ou 1er partenaire magasin signe.
> **Prerequis** : Phase 1 + Phase 2.
> **Condition bloquante** : contrats magasins + bons chiffres conformes + tracabilite.
> **Cadre legal** : Code conso L.121-20, CGI art. 271, Ordonnance 2019-36, Code comm. L.441, Code conso L.611.

## 4.1 Contrats magasins partenaires

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P4-001 | P1 | Contrat type partenaire magasin — achat places pack | C. comm. L.441 | pas_commence |
| TODO-LEGAL-P4-002 | P2 | Clause sponsoring jeux concours du magasin | — | pas_commence |
| TODO-LEGAL-P4-003 | P1 | Clause responsabilite en cas annulation magasin | Code civ. 1231 | pas_commence |
| TODO-LEGAL-P4-004 | P2 | Clause exclusivite territoriale (si applicable) | Droit concurrence | pas_commence |
| TODO-LEGAL-P4-005 | P2 | Duree + resiliation + preavis partenaire | C. comm. L.442-1 | pas_commence |
| TODO-LEGAL-P4-006 | P2 | Clause propriete intellectuelle visuels partages | CPI art. L.111 | pas_commence |
| TODO-LEGAL-P4-007 | P3 | Clause anti-concurrence reciproque | Code civ. liberte | pas_commence |

## 4.2 Bons chiffres / vouchers

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P4-010 | P1 | Regime TVA bons (single-purpose vs multi-purpose) | CGI art. 271 | pas_commence |
| TODO-LEGAL-P4-011 | P1 | CGV bons chiffres — conditions utilisation, expiration | C. conso L.221-5 | pas_commence |
| TODO-LEGAL-P4-012 | P1 | Tracabilite emission + consommation bons | CGI art. 289 | pas_commence |
| TODO-LEGAL-P4-013 | P1 | Duree validite affichee + mention expiration | C. conso L.221-6 | pas_commence |
| TODO-LEGAL-P4-014 | P2 | Gestion bons prescrits (comptabilisation + remise) | CGI 38-2 | pas_commence |
| TODO-LEGAL-P4-015 | P2 | Protection anti-fraude bons (codes uniques, signature) | — | pas_commence |
| TODO-LEGAL-P4-016 | P2 | Remboursement / substitution si service indisponible | C. conso L.221-18 | pas_commence |

## 4.3 Revenus partenaires et comptabilite

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P4-020 | P1 | Comptabilisation revenus indirects partenaires | PCG | pas_commence |
| TODO-LEGAL-P4-021 | P2 | Facturation commissions partenaires (TVA 20%) | CGI | pas_commence |
| TODO-LEGAL-P4-022 | P2 | Reporting chiffres volume partenaires (transparence) | C. comm. L.441 | pas_commence |
| TODO-LEGAL-P4-023 | P3 | Audit annuel revenus croises | — | pas_commence |

## 4.4 Litiges B2B partenaires

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P4-030 | P2 | Clause attributive juridiction tribunal commerce | CPC art. 48 | pas_commence |
| TODO-LEGAL-P4-031 | P2 | Procedure reclamation B2B (15j reponse) | C. comm. L.441 | pas_commence |
| TODO-LEGAL-P4-032 | P3 | Mediation commerciale si litige | CPC art. 131 | pas_commence |

**Total Phase 4** : 21 TODOs (P1=7, P2=11, P3=3)

---

# PHASE 5 — B2B, marques, evenementiel, fondation

> **Activation** : avant 1er contrat B2B entreprise ou 1er depot marque.
> **Prerequis** : Phase 1 + Phase 2.
> **Condition bloquante** : contrats B2B types + depots marques + structure groupe definie.
> **Cadre legal** : Code comm. L.123, CPI L.711, Loi 1901 + Loi Aillagon 2003, Loi Sapin 2 (2016-1691), Directive CSRD 2022/2464, Loi 27 mars 2017.

## 5.1 Contrats B2B entreprises

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P5-001 | P1 | Contrat type voyage B2B entreprise (team building) | C. civ. contrats | pas_commence |
| TODO-LEGAL-P5-002 | P2 | Contrat evenementiel marque (product launch, activation) | — | pas_commence |
| TODO-LEGAL-P5-003 | P2 | Convention teambuilding — responsabilites employeur / Eventy | Code Travail | pas_commence |
| TODO-LEGAL-P5-004 | P1 | NDA B2B standardise pour negociations | — | pas_commence |
| TODO-LEGAL-P5-005 | P2 | Contrat influenceur / ambassadeur B2B | ARPP | pas_commence |
| TODO-LEGAL-P5-006 | P2 | Facturation B2B TVA + mentions obligatoires | CGI art. 289 | pas_commence |

## 5.2 Protection marques Eventy

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P5-010 | P1 | Depot marque Eventy Life INPI (France) classe 39/41/43 | CPI L.711 | pas_commence |
| TODO-LEGAL-P5-011 | P2 | Depot marque EUIPO (Union Europeenne) | Reglement UE 2017/1001 | pas_commence |
| TODO-LEGAL-P5-012 | P3 | Depot marque WIPO international (si expansion hors UE) | Arrangement Madrid | pas_commence |
| TODO-LEGAL-P5-013 | P2 | Depot noms de domaine proteger (Eventy.life, .fr, .com) | — | pas_commence |
| TODO-LEGAL-P5-014 | P2 | Surveillance depots marques tiers concurrents | — | pas_commence |
| TODO-LEGAL-P5-015 | P3 | Procedure opposition si atteinte marque detectee | CPI L.712 | pas_commence |

## 5.3 Fondation et mecenat

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P5-020 | P2 | Choix structure : fondation, fonds dotation, association | Loi 1987 + 2008 | pas_commence |
| TODO-LEGAL-P5-021 | P2 | Statuts fondation / fonds dotation | Loi 2008-776 | pas_commence |
| TODO-LEGAL-P5-022 | P2 | Reconnaissance utilite publique (si applicable) | Decret 1901 | pas_commence |
| TODO-LEGAL-P5-023 | P2 | Mecenat — emission recus fiscaux 66% | CGI art. 238 bis | pas_commence |
| TODO-LEGAL-P5-024 | P3 | Gouvernance fondation (conseil, president, bureau) | Statuts fondation | pas_commence |
| TODO-LEGAL-P5-025 | P3 | Convention mecenat avec Eventy SAS (refacturation) | — | pas_commence |

## 5.4 Structure et gouvernance groupe

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P5-030 | P3 | Etude faisabilite holding / structure groupe | — | pas_commence |
| TODO-LEGAL-P5-031 | P3 | Pacte associes fondateur + futurs investisseurs | C. comm. L.227 | pas_commence |
| TODO-LEGAL-P5-032 | P3 | Convention intra-groupe (refacturation, prestations) | CGI art. 57 | pas_commence |
| TODO-LEGAL-P5-033 | P3 | Gouvernance COMEX / Comite strategique | Statuts | pas_commence |

## 5.5 Conformite scale-up

| ID | Prio | Description | Reference | Statut |
|----|------|-------------|-----------|--------|
| TODO-LEGAL-P5-040 | P3 | Sapin 2 : cartographie risques + code conduite (si seuil) | Loi 2016-1691 | pas_commence |
| TODO-LEGAL-P5-041 | P3 | CSRD : reporting extra-financier (si seuils) | Directive 2022/2464 | pas_commence |
| TODO-LEGAL-P5-042 | P3 | Devoir vigilance (si > 5000 salaries) | Loi 27 mars 2017 | pas_commence |
| TODO-LEGAL-P5-043 | P3 | Conformite marches publics (appels d'offres) | Code comm. publ. | pas_commence |

**Total Phase 5** : 27 TODOs (P1=4, P2=12, P3=11)

---

# Recapitulatif global

| Phase | Nom                                  | TODOs | P1 | P2 | P3 | Statut       |
|-------|--------------------------------------|-------|----|----|----|--------------|
| 1     | Lancement vitrine                    | 20    | 13 | 6  | 1  | en_cours     |
| 2     | Premiers clients voyageurs           | 29    | 22 | 7  | 0  | pas_commence |
| 3     | Jeux et activites                    | 28    | 14 | 13 | 1  | pas_commence |
| 4     | Packs et partenaires magasins        | 21    | 7  | 11 | 3  | pas_commence |
| 5     | B2B, marques, evenementiel, fondation| 27    | 4  | 12 | 11 | pas_commence |
| **Total** |                                  | **125** | **60** | **49** | **16** |        |

---

# Ordre de bataille recommande

## Sprint immediat (2 semaines) — Debloquer Phase 1
Finaliser tous les P1 de la Phase 1 (13 items). Le site vitrine doit etre conforme avant toute ouverture publique.

**Priorite** : P1-001, P1-002, P1-010 a P1-020 (documents legaux + RGPD fondations).

## Sprint 2 (1 mois) — Debloquer Phase 2
Attaquer les P1 de la Phase 2 (22 items). Atout France + APST + RC Pro + contrats pros. 
Sans cela, aucune reservation payante possible.

**Prerequis** : SAS creee, comptes pro ouverts.

## Sprint 3 (1 mois) — Debloquer Phase 3
Ouvrir les jeux et activites. 14 P1. Focus sur reglements + huissier + RGPD jeux.

**Prerequis** : au moins 1er voyage en cours de commercialisation.

## Sprint 4 (a chaud) — Phases 4 & 5
Activees selon opportunite commerciale :
- Phase 4 des 1er partenaire magasin en negociation
- Phase 5 des 1er depot marque ou 1er contrat B2B en negociation

---

# Liens croises portail avocat

| Section portail | Route | Contenu |
|-----------------|-------|---------|
| Roadmap juridique (central) | `/avocat/roadmap` | Cette archive dynamiquement rendue |
| Tableau de bord | `/avocat` | Widget resume 5 phases avec progress |
| Dossier Jeux | `/avocat/jeux` | Detail Phase 3 — jeux-concours |
| Revenus avocat | `/avocat/revenus` | Bareme forfaitaire par phase |
| Contrats | `/avocat/contrats` | Liste contrats (toutes phases) |
| Conformite | `/avocat/conformite` | Checklist (toutes phases) |
| Dossiers | `/avocat/dossiers` | Dossiers par priorite |

Les anciens IDs `TODO-JEUX-###`, `TODO-CONTRAT-###`, `TODO-CONFO-###`, `TODO-DOSSIER-###`, `TODO-REVENU-###` restent utilises sur leurs pages respectives pour la granularite operationnelle. La nomenclature `TODO-LEGAL-PX-###` est la **reference canonique** pour la roadmap juridique.
