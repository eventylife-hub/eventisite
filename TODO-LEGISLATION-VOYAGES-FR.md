# TODO Législation Voyages — Normes Françaises
> Audit complet 25/04/2026 — Code du tourisme, CGI, CNIL, Code consommation

---

## Code du tourisme — Obligations Agence de Voyages

### [FR-01] Immatriculation Atout France obligatoire (L.211-18 Code tourisme) — P0
- **Obligation** : Toute vente de forfaits touristiques = immatriculation obligatoire
- **Statut** : En cours d'obtention — **BLOQUANT** (voir LC-01)
- **Numéro** : Format IM0XXXXXXXXXX — à obtenir avant toute vente
- **Où afficher le numéro** (Art. R.211-37) :
  - [ ] En-tête de TOUS les documents commerciaux (devis, factures, contrats)
  - [ ] Site web : footer + mentions légales + CGV Art. 12
  - [ ] Fiche précontractuelle Section 1
  - [ ] Emails commerciaux et transactionnels
- **Fichiers** :
  - `frontend/app/(public)/mentions-legales/page.tsx`
  - `frontend/app/(public)/cgv/page.tsx`
  - `frontend/app/(public)/fiche-precontractuelle/page.tsx`

### [FR-02] Garantie financière APST (R.211-26 Code tourisme) — P0
- **Obligation** : Min. 200 000 € pour CA < 1M€ — couvre remboursements + rapatriement
- **Statut** : Non souscrite — **BLOQUANT** (voir LC-02)
- **Organisme** : APST — 15 avenue Carnot, 75017 Paris — apst.travel
- **Ce qu'elle couvre** :
  - Remboursement intégral des acomptes versés si faillite Eventy
  - Prise en charge rapatriement des voyageurs en cours de voyage
  - Complément si assurance partenaire insuffisante
- **Publication** : APST publie la liste des membres sur son site (transparence client)
- **Actions** :
  - [ ] Adhérer à l'APST avant dépôt dossier Atout France
  - [ ] Cotisation annuelle : environ 500-2000€ selon CA
  - [ ] Obtenir attestation de garantie (nécessaire pour dossier Atout France)
- **Fichiers** : `frontend/app/(admin)/admin/compliance/page.tsx`

### [FR-03] RC Professionnelle Tourisme (R.211-29 Code tourisme) — P0
- **Obligation** : Assurance RC Pro spécifique activité touristique
- **Couverture minimum légale** : 500 000 € par sinistre / 1 M€ par an
- **Statut** : Non souscrite — **BLOQUANT** (voir LC-03)
- **Assureurs spécialisés tourisme** : Hiscox, Allianz, AXA, Gras Savoye, MAIF Pro
- **Ce qu'elle couvre** :
  - Dommages corporels aux clients pendant le voyage
  - Fautes professionnelles (erreur de réservation, mauvaise information)
  - Dommages causés par prestataires tiers sous responsabilité Eventy
- **Attention** : La RC Pro couvre Eventy — les partenaires indépendants doivent avoir LEUR PROPRE RC Pro
- **Actions** :
  - [ ] Souscrire RC Pro spécifique tourisme (pas une RC Pro générique)
  - [ ] Mentionner l'assureur + n° police dans CGV Art. 7 et 8
  - [ ] Exiger attestation RC Pro de chaque partenaire indépendant

### [FR-04] Contrat de voyage — Mentions obligatoires (R.211-3 à R.211-11 Code tourisme) — P0
- **Le contrat doit contenir** :
  - [ ] Nom, adresse, n° immatriculation Atout France de l'organisateur
  - [ ] Description du voyage + itinéraire
  - [ ] Moyen de transport (type, classe, horaires si connus)
  - [ ] Hébergement (type, localisation, catégorie, repas inclus)
  - [ ] Prix TTC et modalités de paiement
  - [ ] Conditions de modification et d'annulation
  - [ ] Informations sur les visas et formalités sanitaires requises
  - [ ] Couverture d'assurance souscrite
  - [ ] Information sur la garantie financière
- **Format** : Doit être remis sur support durable (PDF + email)
- **Délai** : Au plus tard à la conclusion du contrat (au moment de la réservation)
- **Fichiers** : `frontend/app/(public)/cgv/page.tsx` + confirmation email

### [FR-05] Acompte et délais de paiement (R.211-5 Code tourisme) — P1
- **Règle** : Acompte versé à la réservation (pas de dépôt sans contrat)
- **Montant acompte** : Légalement libre mais pratique courante = 25-30%
- **Solde** : Généralement J-30 avant départ (Eventy pratique J-30 ✅)
- **Remboursement annulation par client** (barème recommandé Art. L.211-15) :
  - Plus de 60 jours avant départ : 0% (ou frais de dossier max 3%)
  - 30 à 60 jours : 25% du prix total
  - 15 à 30 jours : 35%
  - 7 à 15 jours : 50%
  - Moins de 7 jours : 75%
  - Moins de 48h / non-présentation : 100%
- **Vérifier que CGV Art. 9 est aligné sur ce barème légal**
- **Fichier** : `frontend/app/(public)/cgv/page.tsx`

### [FR-06] Voyages en groupe — Obligations spécifiques (P1)
- **Nombre minimum de participants** :
  - [ ] Obligation d'informer précontractuellement le nombre minimum
  - [ ] Délais légaux de notification annulation : J-20 (>6 jours), J-7 (2-6 jours), J-48h (<2 jours)
  - [ ] "L'âme Eventy : on part même si le bus n'est pas plein" → compatible avec droit de résiliation sans pénalité si annulation par Eventy
- **Accompagnateur/guide obligatoire** selon les voyages :
  - [ ] Guide conférencier : carte professionnelle obligatoire pour sites classés
  - [ ] Accompagnateur groupes : pas de carte obligatoire mais contrat de prestation
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` Art. 6.2

### [FR-07] Informations formalités obligatoires (R.211-7 Code tourisme) — P1
- **L'organisateur DOIT informer** :
  - Conditions de passeport/visa pour la destination
  - Délais d'obtention recommandés
  - Formalités sanitaires requises (vaccinations, médicaments)
  - Conditions d'entrée pour les ressortissants UE et non-UE
- **Mise à jour** : L'organisateur doit indiquer que ces informations peuvent changer et inviter le client à se renseigner auprès des ambassades
- **Responsabilité** : Organisateur responsable si informations inexactes causent préjudice
- **Actions** :
  - [ ] Chaque fiche voyage : section formalités (passeport, visa, santé)
  - [ ] Disclaimer : "Informations vérifiées au [date] — consultez l'ambassade pour confirmation"
  - [ ] Lien vers France Diplomatie (diplomatie.gouv.fr) pour chaque destination
- **Fichier** : `frontend/app/(public)/fiche-precontractuelle/page.tsx` + pages voyage

---

## TVA et Fiscalité Spécifique Tourisme

### [FR-08] TVA sur la marge — Régime obligatoire (Art. 306 bis CGI) — P0
- **Principe** : Agence de voyages organisant des forfaits = TVA sur la MARGE (pas sur le chiffre d'affaires)
- **Marge** = Prix de vente TTC − Coûts des services achetés TTC (hotel, transport, guides)
- **Taux** : 20% sur la marge (méthode d'extraction : TVA = marge × 20/120)
- **IMPOSSIBLE** de déduire la TVA sur les achats de voyages (art. 206 Annexe II CGI)
- **Méthode de calcul** :
  - Globale (trimestrielle ou annuelle) : somme des marges, puis TVA globale
  - Voyage par voyage : calcul à chaque prestation
  - Eventy doit choisir et s'y tenir
- **Obligations déclaratives** :
  - [ ] CA3 mensuel/trimestriel : lignes dédiées TVA marge
  - [ ] Justificatifs DGFiP : ventilation coûts par voyage archivés 6 ans
  - [ ] Mention factures : "TVA calculée sur la marge — non récupérable"
  - [ ] NE PAS indiquer le montant de TVA sur les factures (régime marge = TVA invisible)
- **Fichiers** : `frontend/app/(admin)/admin/finance/tva/page.tsx` + factures

### [FR-09] Taxe de séjour — Collecte et versement (CGCT Art. L.2333-26+) — P1
- **Obligation** : Eventy collecte la taxe de séjour pour le compte des communes
- **Taux 2026 par commune** :
  | Commune | Tarif/pers/nuit |
  |---------|----------------|
  | Paris | 3,75€ max (catégorie selon hôtel) |
  | Nice | 5,00€ max |
  | Lyon | 2,88€ max |
  | Bordeaux | 1,50€ max |
  | Marseille | 2,50€ max |
  | Metz | 1,10€ max |
  | Strasbourg | 2,20€ max |
  | Toulouse | 1,65€ max |
- **Déclaration** : Trimestrielle auprès de chaque commune visitée
- **Affichage** : Taxe de séjour doit être séparée du prix du voyage sur la facture
- **Actions** :
  - [ ] Implémenter calcul automatique taxe séjour à la réservation
  - [ ] Déclaration trimestrielle par commune (formulaire Cerfa spécifique)
  - [ ] Versement effectif à chaque commune dans les délais légaux
- **Fichier** : `frontend/app/(admin)/admin/taxes/page.tsx`

### [FR-10] Taxe jeux-concours (Art. 302 bis ZG CGI) — P2
- **Si Eventy organise des jeux** :
  - Prélèvement 7,5% sur les mises (pas sur les gains)
  - Gains > 1 500€ : IFU (imprimé fiscal unique) pour le gagnant + déclaration DGFiP
  - Gains > 300€ en nature : évaluation à la valeur vénale + déclaration
  - Formulaire 2777 mensuel avant le 15 du mois suivant
- **Fichier** : `frontend/app/(admin)/admin/finance/jeux-taxes/page.tsx`

---

## Protection des Consommateurs

### [FR-11] Médiation obligatoire (Art. L.612-1 Code consommation) — P1
- **Obligation** : Tout professionnel doit proposer un médiateur de la consommation
- **Pour le tourisme** : MTV (Médiateur du Tourisme et du Voyage)
- **Statut** : CGV Art. 11 mentionne MTV ✅
- **À compléter** :
  - [ ] Adhérer formellement à MTV (cotisation annuelle ~100-500€)
  - [ ] Afficher sur CHAQUE page web : lien vers plateforme EU ODR (ec.europa.eu/consumers/odr)
  - [ ] Afficher coordonnées MTV : BP 80 303 — 75823 Paris Cedex 17
  - [ ] Délai avant saisine médiateur : 2 mois après réclamation écrite non résolue
  - [ ] Process interne : accusé réception 10 jours, réponse définitive 2 mois
- **Fichiers** :
  - `frontend/app/(public)/cgv/page.tsx` Art. 11 (à compléter)
  - `frontend/app/(public)/mentions-legales/page.tsx` (section médiation à ajouter)
  - Footer du site

### [FR-12] Information sur la plateforme EU ODR (Règlement UE 524/2013) — P1
- **Obligation** : Tous les e-commerçants UE doivent afficher un lien vers la plateforme ODR
- **URL** : https://ec.europa.eu/consumers/odr
- **Où afficher** :
  - [ ] CGV (mentionné ou lien cliquable)
  - [ ] Email de confirmation de commande
  - [ ] Page contact
- **Fichiers** : `frontend/app/(public)/cgv/page.tsx` + emails

### [FR-13] Protection des mineurs (Art. L.211-2 Code tourisme + Code civil) — P1
- **Obligations** :
  - [ ] Autorisation parentale écrite obligatoire pour mineur voyageant sans parents
  - [ ] Fiche sanitaire de liaison pour les moins de 18 ans (séjours collectifs)
  - [ ] Assurance spécifique couverture mineurs
  - [ ] CGV : clause séparée pour réservations incluant des mineurs
  - [ ] RGPD : données mineurs = données sensibles → consentement parental obligatoire
  - [ ] Majeur accompagnateur obligatoire (1 adulte pour x mineurs selon réglementation)
- **Séjours collectifs mineurs** (si applicable) :
  - Déclaration préfectorale obligatoire si > 7 mineurs + > 3 nuits
  - Organisateur = Accueil Collectif de Mineurs (ACM) → réglementation spécifique
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` (clause mineurs à ajouter)

---

## LCEN & Obligations Numériques

### [FR-14] Loi LCEN — Mentions légales obligatoires (Loi n°2004-575) — P1
- **Éditeur professionnel** : obligations renforcées
- **À afficher** :
  - [ ] Nom de l'entreprise + forme juridique (SAS Eventy)
  - [ ] Capital social + adresse siège social
  - [ ] RCS + SIRET + TVA intracommunautaire
  - [ ] Directeur de publication : David [Nom de famille]
  - [ ] Hébergeur : Vercel Inc. (San Francisco, CA, USA) — adresse + contact
  - [ ] Éditeur site : Eventy SAS
- **Signalement contenu illicite** :
  - [ ] Lien/bouton "Signaler un contenu illicite" sur le site (obligation LCEN)
  - [ ] Procédure de traitement des signalements (délai 24h pour contenu manifestement illicite)
- **Fichier** : `frontend/app/(public)/mentions-legales/page.tsx`

### [FR-15] Droit à l'image et propriété intellectuelle — P2
- **Photos et vidéos clients** :
  - [ ] Formulaire consentement collecte images (voyageurs, guides, activités)
  - [ ] Durée exploitation photos : 5 ans maximum recommandé
  - [ ] Droit de retrait : client peut retirer son consentement
  - [ ] Consentement séparé pour usage commercial (réseaux sociaux, publicité)
- **Propriété Eventy** :
  - [ ] Marque Eventy déposée INPI (voir LC-INPI)
  - [ ] Mentions copyright sur toutes les photos du site
  - [ ] Mentions photos : crédit photographe obligatoire

### [FR-16] Accessibilité numérique (Loi n°2005-102 + RGAA 4.1) — P2
- **Obligation** :
  - RGAA 4.1 obligatoire pour services publics ET recommandé fortement pour privé
  - European Accessibility Act (Directive 2019/882) : applicable aux entreprises privées dès juin 2025
- **Actions** :
  - [ ] Audit RGAA des pages publiques (pages prioritaires : accueil, catalogue, réservation, CGV)
  - [ ] Déclaration d'accessibilité publiée sur le site
  - [ ] Schéma pluriannuel de mise en accessibilité
  - [ ] Page "Accessibilité" ou section dans mentions légales
- **Critères prioritaires** :
  - Textes alternatifs images (alt)
  - Navigation clavier complète
  - Contraste minimum 4.5:1
  - Structure sémantique HTML (h1, h2, nav, main, footer)
  - Pas de contenu uniquement en couleur
- **Fichier** : `frontend/app/(public)/mentions-legales/page.tsx` (section accessibilité)

---

## Obligations Employeurs & Indépendants

### [FR-17] Anti-requalification (Art. L.8221-6 Code travail) — P1
- **Risque** : Si un indépendant Eventy est requalifié en salarié → cotisations patronales + dommages-intérêts
- **Critères de requalification** :
  - Exclusivité économique (> 75% CA avec Eventy)
  - Intégration dans l'organisation d'Eventy (horaires imposés, matériel fourni)
  - Absence d'autonomie dans l'exécution des missions
- **Protections contractuelles** :
  - [ ] Contrat précisant explicitement la liberté d'organisation
  - [ ] Pas d'exclusivité (ou clause expliquant pourquoi elle ne crée pas de lien de subordination)
  - [ ] Indépendant facture Eventy (pas salaire déguisé)
- **Fichier** : `pdg-eventy/01-legal/CONTRAT-PARTENAIRE-TYPE.md`

### [FR-18] DAS2 — Déclaration indépendants (Art. 240 CGI) — P1
- **Obligation** : Déclarer à l'administration fiscale tous paiements > 1 200€/an à des indépendants
- **Format** : EDI-TDFC2 — transmission DGFiP avant le 15 février de l'année suivante
- **Contenu** : SIRET/NIF bénéficiaire + montant annuel versé + nature de la prestation
- **Fichier** : `frontend/app/(comptable)/comptable/cotisations/page.tsx`

---

## Récapitulatif Priorités Législation FR

| ID | Loi française | Criticité | Statut |
|----|--------------|-----------|--------|
| FR-01 | Atout France L.211-18 | **P0** | En cours |
| FR-02 | APST R.211-26 | **P0** | Non souscrite |
| FR-03 | RC Pro R.211-29 | **P0** | Non souscrite |
| FR-04 | Contrat mentions obligatoires R.211-3+ | **P0** | Partiel |
| FR-05 | Acompte + barème annulation | **P1** | À vérifier |
| FR-06 | Voyages groupe + délais légaux | **P1** | Incomplet |
| FR-07 | Formalités + informations visa | **P1** | Partiel |
| FR-08 | TVA marge Art. 306 bis CGI | **P0** | Non implémenté |
| FR-09 | Taxe de séjour CGCT | **P1** | Non implémenté |
| FR-10 | Taxe jeux 302 bis ZG CGI | **P2** | Manquant |
| FR-11 | Médiation MTV L.612-1 | **P1** | Partiel |
| FR-12 | ODR UE 524/2013 | **P1** | Manquant |
| FR-13 | Protection mineurs | **P1** | Manquant |
| FR-14 | LCEN mentions légales | **P1** | Partiel |
| FR-15 | Droit image + propriété intellectuelle | **P2** | Manquant |
| FR-16 | Accessibilité RGAA 4.1 | **P2** | Non fait |
| FR-17 | Anti-requalification indépendants | **P1** | Partiel |
| FR-18 | DAS2 indépendants | **P1** | Non implémenté |

---

*Audit réalisé le 25/04/2026 — Sources : Code du tourisme, CGI, LCEN, Code consommation, Code travail*
