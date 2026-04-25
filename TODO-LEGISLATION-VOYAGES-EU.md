# TODO Législation Voyages — Normes Européennes
> Audit complet 25/04/2026 — Directive EU 2015/2302, RGPD voyageurs, insolvabilité

---

## Directive EU 2015/2302 — Voyages à Forfait
> Transposée en droit français par ordonnance n°2017-1717 du 20 décembre 2017
> Entrée en vigueur : 1er juillet 2018

### [EU-01] Définition du forfait touristique (Art. 3 Directive) — P0
- **Problème** : Les offres Eventy doivent impérativement répondre à la définition de « forfait »
- **Critères combinaison** :
  - Transport + hébergement
  - Transport + activités touristiques
  - Hébergement + activités touristiques (si > 25% du prix total)
  - ≥ 2 services si commandés en un même point de vente pendant une même visite
- **Eventy est clairement un organisateur de forfaits** (transport + hébergement + activités)
- **Conséquence** : Obligations maximales (organisateur = responsable de l'ensemble)
- **Actions** :
  - [ ] Confirmer avec avocat que TOUS les packages Eventy = forfaits (Art. L.211-2 Code tourisme)
  - [ ] Exclure tout service isolé vendu hors forfait (sinon régime intermédiaire Art. L.211-2 III)
  - [ ] Documenter la combinaison de services dans chaque fiche voyage
- **Fichier** : `frontend/app/(public)/fiche-precontractuelle/page.tsx`

### [EU-02] Information précontractuelle obligatoire (Art. 5 Directive + Annexe I) — P0
- **Problème** : L'information précontractuelle doit contenir TOUS les éléments de l'Annexe I
- **Éléments obligatoires** :
  - [ ] Destination(s), itinéraire, durée, dates
  - [ ] Type de transport + caractéristiques + classe
  - [ ] Hébergement : localisation, catégorie, caractéristiques principales
  - [ ] Repas inclus (plan de restauration)
  - [ ] Visites, excursions, autres services inclus
  - [ ] **Prix total TTC + frais** — désignation exacte de tout supplément
  - [ ] **Modalités de paiement** : acompte + solde + délais
  - [ ] **Nombre minimum de participants** + délai notification annulation
  - [ ] **Passeport/visa** : informations générales sur les formalités
  - [ ] **Couverture santé** : recommandations assurance
  - [ ] Coordonnées représentant local ou numéro d'urgence
  - [ ] Possibilité de cession du contrat (Art. L.211-11)
  - [ ] Procédure réclamations pendant voyage
- **Fichier** : `frontend/app/(public)/fiche-precontractuelle/page.tsx`

### [EU-03] Droit de rétractation — exclusion forfaits (Art. L.221-28 12° Code conso) — P0
- **Règle** : PAS de droit de rétractation de 14 jours pour les forfaits touristiques
- **Base légale** : Art. L.221-28 12° Code consommation + Directive 2011/83/UE Art. 16(l)
- **Statut** : CGV mentionnent l'exclusion ✅
- **À renforcer** :
  - [ ] Mention explicite dans CHAQUE email de confirmation de commande
  - [ ] Formulaire de commande en ligne : case à cocher "J'ai compris qu'il n'y a pas de droit de rétractation"
  - [ ] Distinction claire : annulation POSSIBLE selon barème (différent du droit de rétractation)
  - [ ] CGV Art. 9 : clarifier que les conditions d'annulation remplacent le droit de rétractation
- **Fichier** : `frontend/app/(public)/cgv/page.tsx`

### [EU-04] Modifications de prix avant départ (Art. 10 Directive = Art. L.211-12 Code tourisme) — P1
- **Règle** : Révision de prix possible uniquement si :
  - Clause expresse dans le contrat
  - Au plus tard 20 jours avant le départ
  - Facteurs limitativement énumérés : carburant, taxes/redevances, taux de change
  - Hausse > 8% → client peut refuser + remboursement intégral OU forfait équivalent
- **Problème** : CGV ne détaillent pas suffisamment les 3 facteurs de révision légaux
- **Actions** :
  - [ ] Ajouter dans CGV Art. 6 : liste exhaustive des facteurs de révision de prix
  - [ ] Préciser que toute hausse > 8% déclenche le droit de résiliation sans frais
  - [ ] Préciser délai 20 jours
  - [ ] Si baisse > 5% → restitution au client obligatoire
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` Art. 6

### [EU-05] Modifications substantielles avant départ (Art. 11 Directive = Art. L.211-13 Code tourisme) — P1
- **Règle** : Toute modification significative AVANT départ → 3 options client :
  1. Accepter la modification
  2. Résiliation sans frais + remboursement intégral
  3. Accepter forfait de remplacement (si proposé)
- **Délai légal** : Organisateur doit informer le client "sans délai excessif" (dans les meilleurs délais)
- **Modifications significatives** : changement destination, hébergement (déclassement), transport, dates
- **Problème** : CGV ne précisent pas les délais légaux de réponse du client
- **Actions** :
  - [ ] Ajouter Art. 6.3 CGV : procédure modification substantielle avec délais légaux
  - [ ] Préciser délai réponse client (≥ 3 jours ouvrables recommandé)
  - [ ] Cas de remboursement : délai 14 jours maximum (Art. L.211-13 V)
- **Fichier** : `frontend/app/(public)/cgv/page.tsx`

### [EU-06] Résiliation par l'organisateur (Art. 12 Directive = Art. L.211-14 Code tourisme) — P1
- **Règle** : Organisateur peut annuler si :
  - Nombre minimum participants non atteint : notification J-20 (voyages > 6 jours), J-7 (2-6 jours), J-48h (< 2 jours)
  - Circonstances exceptionnelles inévitables (force majeure)
- **Conséquence** : Remboursement intégral SANS frais supplémentaires
- **Problème** : CGV Art. 6.2 mentionne "voyages viables" mais sans les délais légaux précis
- **Actions** :
  - [ ] Aligner CGV Art. 6.2 sur les délais légaux J-20/J-7/J-48h
  - [ ] Préciser que la force majeure → remboursement sans pénalité MAIS sans indemnité supplémentaire
  - [ ] "On part même si le bus n'est pas plein" (âme Eventy) → compatible si remboursement garanti en cas contraire
- **Fichier** : `frontend/app/(public)/cgv/page.tsx`

### [EU-07] Cession du contrat (Art. 9 Directive = Art. L.211-11 Code tourisme) — P1
- **Règle** : Voyageur peut céder son contrat à un tiers si :
  - Information à l'organisateur "dans un délai raisonnable avant le départ" (au plus tard 7 jours)
  - Cessionnaire remplit toutes les conditions requises
  - Cédant et cessionnaire solidairement responsables des coûts supplémentaires
- **Problème** : CGV ne mentionnent pas du tout ce droit légal impératif
- **CRITIQUE** : Cette disposition est d'ordre public — impossible de l'exclure contractuellement
- **Actions** :
  - [ ] Ajouter Art. dans CGV : "Cession du contrat — droit impératif"
  - [ ] Préciser les coûts éventuels de cession (frais dossier max raisonnables)
  - [ ] Préciser conditions : mêmes exigences voyage, délai 7 jours minimum
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` (ARTICLE MANQUANT)

### [EU-08] Responsabilité de l'organisateur (Art. 13 Directive = Art. L.211-16/17 Code tourisme) — P0
- **Règle** : Organisateur responsable de l'exécution de TOUS les services du forfait
  - même s'ils sont fournis par des prestataires tiers (guides, hôtels, transporteurs)
  - Responsabilité de plein droit — pas besoin de prouver la faute
- **Exceptions limitées** :
  - Fait imputable au voyageur (faute exclusive)
  - Fait imputable à un tiers étranger à la fourniture des services
  - Circonstances exceptionnelles inévitables (force majeure)
- **Conséquence pour Eventy** : Eventy répond des fautes de SES PARTENAIRES indépendants
- **Actions** :
  - [ ] CGV Art. 8 : préciser la responsabilité de plein droit d'Eventy
  - [ ] Contrats partenaires : clause de garantie + RC Pro partenaire obligatoire
  - [ ] Procédure réclamations pendant voyage : numéro d'urgence + délais traitement
  - [ ] Plafonds indemnisation : POSSIBLE de plafonner (sauf dommages corporels ou intentionnels)
- **Fichiers** : `frontend/app/(public)/cgv/page.tsx` Art. 8 + `pdg-eventy/01-legal/CONTRAT-PARTENAIRE-TYPE.md`

### [EU-09] Assistance en cas de difficultés (Art. 16 Directive = Art. L.211-17-1 Code tourisme) — P1
- **Règle** : Obligation d'assistance ACTIVE si voyageur en difficulté pendant le voyage
  - Même si la difficulté n'est pas la faute d'Eventy
  - Renseignements sur services médicaux, autorités locales, consulat
  - Aide pour communications à distance, autre transport
- **Pas d'assistance si** : difficulté délibérément causée par le voyageur
- **Actions** :
  - [ ] Ajouter dans CGV : section "Assistance pendant le voyage"
  - [ ] Créer page/section site : numéro d'urgence 24/7 pendant voyages
  - [ ] App mobile : bouton SOS avec numéro d'urgence Eventy + contact d'urgence local
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` + portail client

### [EU-10] Protection contre l'insolvabilité (Art. 17 Directive = Art. L.211-18 Code tourisme) — P0
- **Règle** : OBLIGATION de garantie financière pour rembourser les acomptes ET rapatrier les voyageurs en cas d'insolvabilité
- **Pour Eventy** : Garantie APST couvre ce risque ✅ (mais non souscrite — LC-02)
- **Information obligatoire sur le site** :
  - [ ] Nom de l'organisme garant (APST) et coordonnées
  - [ ] Numéro de garantie
  - [ ] Montant de la garantie
  - [ ] Procédure de mise en jeu en cas de faillite
- **Où afficher** :
  - CGV Art. 12 (déjà présent mais incomplet)
  - Fiche précontractuelle Section 1
  - Mentions légales
  - Page "Pourquoi Eventy" ou "Confiance"
- **Fichiers** : `frontend/app/(public)/cgv/page.tsx`, `frontend/app/(public)/mentions-legales/page.tsx`

---

## RGPD — Données Spéciales Voyageurs

### [EU-11] Données sensibles voyageurs (Art. 9 RGPD) — P0
- **Données concernées** :
  - **Numéros de passeport/CNI** : données d'identification à fort risque
  - **Données de santé** : allergies alimentaires, handicaps, traitements médicaux, régimes spéciaux
  - **Préférences alimentaires** (sauf religieuses → Art. 9 RGPD si révèlent convictions)
  - **Mineurs** : données enfants soumises à régles renforcées
- **Obligations** :
  - [ ] Base légale explicite pour chaque catégorie (consentement explicite Art. 9§2a ou nécessité contractuelle)
  - [ ] Mention dans politique de confidentialité : durée de conservation réduite (ex: J+30 après voyage)
  - [ ] Chiffrement des données sensibles (au repos + en transit)
  - [ ] Accès limité (principe du moindre privilège) : seuls les guides/chauffeurs concernés voient ces données
  - [ ] Purge automatique : données santé et passeport supprimées J+30 après fin voyage
  - [ ] DPA avec TOUS les sous-traitants qui accèdent à ces données (hébergeurs, guides)
- **Formulaires** : distinction claire données obligatoires vs facultatives
- **Fichiers** : `frontend/app/(client)/`, politique confidentialité, `frontend/app/(avocat)/avocat/rgpd/`

### [EU-12] Registre des traitements (Art. 30 RGPD) — P1
- **Traitements spécifiques voyages** à documenter :
  - Réservations (données personnelles + paiement) — base légale : exécution du contrat
  - Données passeport/visa — base légale : obligation légale (transport international)
  - Données santé/allergies — base légale : consentement explicite
  - Géolocalisation pendant voyage (si app) — base légale : consentement
  - Photos/vidéos groupes — base légale : consentement individuel
  - Marketing — base légale : consentement DISTINCT
- **Actions** :
  - [ ] Mettre à jour registre avocat avec ces traitements spécifiques
  - [ ] Pour chaque traitement : finalité, données, durée, sous-traitants, transferts hors UE
- **Fichier** : `frontend/app/(avocat)/avocat/rgpd/page.tsx`

### [EU-13] Transferts de données hors UE — P1
- **Problème** : Certains partenaires voyage (hôtels, transporteurs) peuvent être hors UE
- **Risques** :
  - Transfert données clients à hôtels dans pays sans décision d'adéquation
  - Stripe (USA) — couvert par Privacy Shield / DPF ✅
  - APIs tiers (météo, cartographie) — à vérifier
- **Actions** :
  - [ ] Inventaire des transferts hors UE (liste des prestataires + pays)
  - [ ] Pour pays sans décision d'adéquation : CCT (Clauses Contractuelles Types)
  - [ ] Mention dans politique de confidentialité : liste des pays et garanties
  - [ ] TIA (Transfer Impact Assessment) pour transferts vers USA/UK post-Brexit si nécessaire

---

## Accessibilité & Non-discrimination

### [EU-14] Accessibilité PMR — Directive EU 2019/882 (European Accessibility Act) — P2
- **Obligation** : Services numériques accessibles aux personnes en situation de handicap
- **Application en France** : RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité)
- **Obligations pour voyages** :
  - [ ] Information claire sur accessibilité PMR de chaque voyage (Art. L.211-2 IV Code tourisme)
  - [ ] Formulaire réservation : champ "besoins d'accessibilité" obligatoire
  - [ ] Hébergements : filtrage par accessibilité PMR
  - [ ] Transport : accessibilité fauteuil roulant, accompagnateur
  - [ ] Site web : conformité WCAG 2.1 niveau AA
- **Fichiers** : `frontend/app/(public)/`, formulaires réservation

### [EU-15] Règlement EU 2021/782 — Droits passagers ferroviaires — P3
- Applicable si Eventy inclut du transport ferroviaire dans ses forfaits
- Compensation retards train > 60 min
- Droits passagers PMR

### [EU-16] Règlement EU 261/2004 — Droits passagers aériens — P2
- **Si Eventy inclut des vols** :
  - Information obligatoire sur les droits des passagers (compensation retards, annulations)
  - Compagnie opérante vs compagnie commerciale
  - Eventy comme "tour operator" peut être impacté
- **Actions** :
  - [ ] CGV : mention droits passagers aériens si vols inclus
  - [ ] Procédure réclamations vol : qui contacter (compagnie ou Eventy)

---

## Récapitulatif Directive 2015/2302

| ID | Article Directive | Droit français | Criticité | Statut |
|----|------------------|----------------|-----------|--------|
| EU-01 | Art. 3 (Définition forfait) | L.211-2 | **P0** | À vérifier |
| EU-02 | Art. 5 + Annexe I (Info précontractuelle) | L.211-9 | **P0** | Partiel ✅ |
| EU-03 | Art. 12 (Pas de rétractation) | L.221-28 12° | **P0** | Partiel ✅ |
| EU-04 | Art. 10 (Révision prix) | L.211-12 | **P1** | ❌ Incomplet |
| EU-05 | Art. 11 (Modifications substantielles) | L.211-13 | **P1** | ❌ Manquant |
| EU-06 | Art. 12 (Résiliation organisateur) | L.211-14 | **P1** | ❌ Incomplet |
| EU-07 | Art. 9 (Cession du contrat) | L.211-11 | **P1** | ❌ MANQUANT |
| EU-08 | Art. 13 (Responsabilité organisateur) | L.211-16/17 | **P0** | Partiel |
| EU-09 | Art. 16 (Assistance) | L.211-17-1 | **P1** | ❌ Manquant |
| EU-10 | Art. 17 (Insolvabilité) | L.211-18 | **P0** | En cours |
| EU-11 | — | RGPD Art. 9 | **P0** | ❌ Manquant |
| EU-12 | — | RGPD Art. 30 | **P1** | Partiel |
| EU-13 | — | RGPD Art. 44-49 | **P1** | ❌ À auditer |
| EU-14 | — | RGAA 4.1 | **P2** | ❌ Non fait |

---

*Audit réalisé le 25/04/2026 — Sources : Directive EU 2015/2302, RGPD UE 2016/679, RGAA 4.1*
