# Contrat type — Partenaire conciergerie externe Eventy

> Date : 2026-05-05 · Branche : claude/quizzical-hopper-20cfdc
> Cf. AUDIT_CONCIERGERIE_INTERNE_EXTERNE.md (racine projet) §5 Procédure routage,
> §11 KPIs, §14 Procédure contrôle, §15 Suivi.
>
> **Statut** : modèle pré-juridique. À FAIRE VALIDER PAR AVOCAT TOURISME
> avant signature (cf. `01-legal/CHECKLIST-AVOCAT.md`).

---

## 1. Identification des parties

**ENTRE LES SOUSSIGNÉS :**

**Eventy SAS** (ci-après « Eventy »)
- SIREN : ……………… (en cours d'immatriculation 2026)
- Siège social : ………………
- Représentée par : David ……………… , Président
- Email : eventylife@gmail.com
- Immatriculation Atout France : ……………… (en cours)
- Garantie financière : APST ………………
- RC Pro : Allianz Travel ………………

**ET**

**…………………** (ci-après « le Partenaire »)
- SIREN / N° d'enregistrement local : ………………
- Siège social : ………………
- Représenté par : ………………
- Email opérationnel 24/7 : ………………
- Référent commercial Eventy : ………………

---

## 2. Objet du contrat

Le Partenaire s'engage à fournir des prestations de conciergerie pour les
voyageurs Eventy en mode **backup** :

- Quand le créateur ou l'indépendant Eventy interne est indisponible
  (hors créneau de garde, repos, congé, autre voyage en cours)
- Quand la demande sort du périmètre de compétence interne
  (palace dernière minute, jet privé, événement exclusif, etc.)
- Pour les voyages tier **Luxe** : 24/7 garanti par défaut

Le Partenaire intervient **en sous-traitance** d'Eventy, sans relation
directe contractuelle avec le voyageur final. Eventy reste l'agence de
voyages responsable au titre du Code du tourisme.

---

## 3. Périmètre des prestations

### 3.1 Tiers couverts

À cocher : ☐ Standard ☐ Premium ☐ Luxe

### 3.2 Catégories couvertes (cocher)

- ☐ Restaurant / réservation table
- ☐ Activité / billetterie / événements
- ☐ Transport (transfert privé, limousine, jet, hélico)
- ☐ Hébergement (palace, suite, surclassement)
- ☐ Expérience sur-mesure (chef privé, fleuriste, photographe)
- ☐ Santé (téléconsultation, pharmacie de garde, médecin)
- ☐ Sécurité personnelle / escorte
- ☐ Bagage (perte, retard, retrouvailles)

### 3.3 Pays couverts

ISO 3166-1 alpha-2 : ……………………………………

### 3.4 Langues couvertes (24/7)

………………………………………

### 3.5 Disponibilité

- ☐ 24/7/365 garanti (obligatoire pour Luxe)
- ☐ 9h-22h CET (Premium acceptable)
- ☐ Heures ouvrées 9h-18h (Standard acceptable)

---

## 4. SLA contractuels

| Tier | Réponse | Résolution |
|------|---------|------------|
| Standard | ≤ 60 min | ≤ 8 h |
| Premium | ≤ 30 min | ≤ 4 h |
| Luxe | ≤ 15 min | ≤ 2 h |

### 4.1 Indemnités si SLA non respecté

| Dépassement | Indemnité |
|-------------|-----------|
| < 25 % au-delà du SLA | 0 € (zone tolérance) |
| 25-50 % au-delà | -10 % sur la facture du mois |
| 50-100 % au-delà | -25 % sur la facture du mois + revue trimestrielle |
| > 100 % | -50 % + plan correctif sous 30 j ou rupture contrat |

### 4.2 Mesure des SLA

- Eventy mesure les SLA via son système (timestamps audit-trail immuable)
- Le Partenaire reçoit un rapport mensuel SLA (annexe transmise par email)
- Désaccord : conciliation Pôle Qualité Eventy + Partenaire sous 5 j ouvrés

---

## 5. Tarification

### 5.1 Retainer mensuel

Montant : ……………… €/mois (hors taxes)

Inclus dans le retainer :
- Disponibilité 24/7 (selon §3.5)
- Compte dédié Eventy (1 manager opérationnel + 2 backups)
- Reporting mensuel
- Réunion trimestrielle de pilotage

### 5.2 Marge sur prestations

Le Partenaire facture Eventy au coût réel + ……………… % de marge.
Eventy ajoute sa propre marge (transparente) avant facturation au voyageur.

### 5.3 Plafond engagement sans validation

Toute prestation > **5 000 €** doit être validée par 2 personnes Eventy
avant exécution (workflow `/admin/conciergerie-config`). Pour le tier Luxe,
le seuil est abaissé à **3 000 €**.

### 5.4 Modalités de paiement

- Eventy paie le Partenaire mensuellement, à J+5 ouvrés du mois suivant
- Facture détaillée par demande (pivot ID demande Eventy)
- Mode : virement SEPA ou Stripe Connect (au choix du Partenaire)
- Refacturation TVA marge tourisme : Eventy applique le régime TVA marge
  (cf. `13-comptabilite/GUIDE-COMPTABLE.md`)

---

## 6. KYC & conformité

### 6.1 Documents exigés à la signature

- ☐ Extrait Kbis (ou équivalent local) < 3 mois
- ☐ Statuts à jour
- ☐ Attestation RC Pro ≥ 1,6 M€ (recommandé 5 M€ pour Luxe)
- ☐ Attestation garantie financière (si le Partenaire encaisse pour le compte d'Eventy)
- ☐ Politique RGPD du Partenaire
- ☐ DPA RGPD signé (annexe 1 du présent contrat)
- ☐ Liste des sous-traitants ultimes (chaîne de prestation)
- ☐ Attestation honorabilité dirigeants (casier judiciaire)
- ☐ Justificatif de propriété intellectuelle des marques utilisées

### 6.2 Renouvellement KYC

- RC Pro et garantie financière vérifiées annuellement
- Audit complet KYC tous les 3 ans
- Eventy se réserve le droit de demander toute mise à jour à tout moment
- Audit ad hoc en cas d'incident

---

## 7. Protection des données voyageurs (RGPD)

### 7.1 Qualification

Eventy = **responsable de traitement**.
Le Partenaire = **sous-traitant** au sens RGPD art. 28.

### 7.2 Données transmises

- Identité voyageur : prénom, nom, langue
- Coordonnées : email, téléphone (si nécessaire à la prestation)
- Données voyage : destination, dates, hôtel, vol
- Données prestation : catégorie, urgence, message libre
- Données médicales / santé : transmises uniquement avec consentement
  explicite voyageur, à un partenaire santé qualifié (Knok ou équivalent)

### 7.3 Durée de conservation

Le Partenaire conserve les données nécessaires à la prestation pendant :
- 3 ans (Standard / Premium)
- 7 ans (Luxe — exigence compliance)

Au-delà : suppression ou anonymisation irréversible.

### 7.4 Sous-traitance ultérieure

Le Partenaire ne peut sous-traiter qu'avec accord préalable écrit d'Eventy.
Liste des sous-traitants validés en annexe 2.

### 7.5 Notifications de violation

En cas de violation de données, le Partenaire notifie Eventy sous **24h**
(avant les obligations légales CNIL 72h pour Eventy).

---

## 8. Confidentialité (NDA)

- NDA strict sur identité voyageurs Luxe (clientèle sensible)
- Interdiction de toute communication marketing du Partenaire mentionnant
  Eventy ou ses voyageurs sans accord écrit préalable
- Interdiction d'utilisation des contacts voyageurs en dehors de la
  prestation Eventy (anti-démarchage)
- Pénalité : 50 000 € par infraction + dommages-intérêts éventuels

---

## 9. Contrôle qualité Eventy

### 9.1 Audits aléatoires

Eventy auditera **100 % des demandes Luxe** et **25 % des demandes Premium**
prises en charge par le Partenaire. Critères d'évaluation conformes à
`lib/conciergerie/quality-control.ts` (7 critères pondérés).

### 9.2 Mystery shopper

Eventy se réserve le droit d'organiser des mystery shoppers trimestriels
(faux voyageurs déposant demandes-test). Le Partenaire ne peut être informé
à l'avance.

### 9.3 Score qualité minimum

| Score moyen trimestre | Conséquence |
|------------------------|-------------|
| ≥ 75 / 100 | Conforme |
| 60-74 | Plan correctif demandé (30 j) |
| < 60 | Rupture du contrat (préavis 30 j possible) |
| Récidive < 60 | Rupture immédiate |

### 9.4 Notation publique côté Eventy

La note partenaire (rating équipe + créateurs + NPS) est affichée :
- Côté admin Eventy : `/admin/conciergerie-config`
- Côté créateurs Eventy : catalogue partenaires `/pro/conciergerie`
- Côté partenaire : son propre dashboard `/partenaire-conciergerie`

Le Partenaire peut contester un audit dans les 5 j ouvrés.

---

## 10. Responsabilités

### 10.1 Du Partenaire

- Exécuter les prestations conformément au brief Eventy
- Respecter les SLA contractuels
- Tenir Eventy informé en temps réel (statut acceptée → en cours → résolue)
- Garantir la confidentialité voyageur
- Respecter la législation locale du pays d'intervention
- Souscrire et maintenir RC Pro adéquate

### 10.2 D'Eventy

- Briefing complet et exact des demandes
- Paiement à échéance
- Information préalable de toute modification de procédure
- Confidentialité sur les conditions tarifaires négociées avec d'autres
  partenaires (NDA réciproque)

### 10.3 Limitation

La responsabilité du Partenaire est limitée au montant des prestations
facturées sur les 12 derniers mois, hors faute lourde, dol, ou violation
de confidentialité.

---

## 11. Durée et résiliation

### 11.1 Durée

Contrat conclu pour **12 mois**, à compter du …………………… , renouvelable
tacitement par périodes de 12 mois.

### 11.2 Résiliation amiable

Préavis 90 jours par lettre recommandée avec AR.

### 11.3 Résiliation pour faute

Effet immédiat sans indemnité en cas de :
- Manquement grave aux SLA (cf. §4.1 récidive)
- Violation confidentialité
- Manquement RGPD
- Non-paiement (Partenaire) ou retard > 60 j
- Manquement KYC (refus de fournir documents demandés)
- Score qualité < 40 sur trimestre

### 11.4 Conséquences résiliation

- Reverse des données voyageurs sous 7 j (export CSV chiffré)
- Suppression définitive sous 30 j supplémentaires
- Audit final SLA + paiement solde final J+15

---

## 12. Litiges et droit applicable

- Droit français
- Tribunal compétent : Commerce de Paris (sauf si Partenaire B2C non
  professionnel : tribunal du domicile du Partenaire)
- Médiation préalable obligatoire (Médiateur du Tourisme et du Voyage)
  avant action judiciaire

---

## 13. Annexes

- **Annexe 1** : DPA RGPD (Data Processing Agreement)
- **Annexe 2** : Liste des sous-traitants ultimes du Partenaire
- **Annexe 3** : Modèle de brief demande Eventy → Partenaire
- **Annexe 4** : Modèle de retour statut Partenaire → Eventy
- **Annexe 5** : Grille tarifaire négociée (confidentielle)
- **Annexe 6** : Charte Eventy "le voyageur doit se sentir aimé" (extrait AME-EVENTY.md)

---

## 14. Signatures

Fait à ……………… , le ……………… , en deux exemplaires originaux.

| Pour Eventy SAS | Pour le Partenaire |
|-----------------|--------------------|
| David ……………… , Président | ……………… , ……………… |
| Signature : | Signature : |

---

## ⚠️ Points à valider avec l'avocat tourisme

- [ ] Conformité avec l'art. L. 211-16 du Code du tourisme (responsabilité
  agence) et la sous-traitance autorisée
- [ ] Clauses RC Pro et garantie financière — articulation avec celles d'Eventy
- [ ] Régime TVA marge tourisme et facturation inter-Partenaire
- [ ] Validité internationale (Quintessentially au RU post-Brexit, John Paul
  multiscope, etc.)
- [ ] Clauses pénalités SLA — proportionnalité pour éviter requalification
- [ ] Médiation préalable — choix du médiateur obligatoire
- [ ] Compatibilité RGPD avec partenaires hors UE (clauses contractuelles
  types CNIL ou décision d'adéquation)
- [ ] Validité NDA (50 000 € — proportionnalité)

---

## 📋 Checklist activation partenaire

| Étape | Statut | Date | Responsable |
|-------|--------|------|-------------|
| KYC initial reçu et validé | ☐ | | Pôle Conformité |
| RC Pro vérifiée (≥ 1,6 M€) | ☐ | | Avocat |
| DPA signé | ☐ | | DPO Eventy |
| Contrat signé | ☐ | | David / Partenaire |
| Onboarding portail `/partenaire-conciergerie` | ☐ | | Tech Eventy |
| Test demande pilote (mystery shopper) | ☐ | | Pôle Qualité |
| Activation production (`active = true`) | ☐ | | Admin Eventy |
| Annonce créateurs (sidebar `/pro/conciergerie`) | ☐ | | Marketing |

---

*Document livré : 2026-05-05 — David / Claude Opus 4.7 (1M)*
*Branche : claude/quizzical-hopper-20cfdc*
*À VALIDER PAR AVOCAT TOURISME AVANT TOUTE SIGNATURE*
