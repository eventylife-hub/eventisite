# TODO Législation & Conformité — Eventy
> Audit complet 25/04/2026 — Priorités P0 (bloquant lancement), P1 (critique), P2 (important)

---

## P0 — BLOQUANT LANCEMENT (impossibilité légale de vendre des voyages sans ces éléments)

### [LC-01] Immatriculation Atout France (P0 — CRITIQUE)
- **Statut actuel** : "En cours d'obtention" — NON OBTENUE
- **Obligation légale** : Art. L.211-18 Code du tourisme — Interdiction de vendre des voyages sans immatriculation
- **Risque** : Exercice illégal de la profession d'agent de voyages (amende + fermeture)
- **Actions** :
  - [ ] Déposer dossier complet auprès d'Atout France (79-81 rue de Clichy, 75009 Paris)
  - [ ] Joindre : justificatif garantie financière APST + RC Pro + extrait Kbis + casier judiciaire gérant
  - [ ] Délai traitement : 2-4 semaines après dossier complet
- **Dès obtention** : Mettre à jour CGV Art. 12, mentions légales, fiche précontractuelle avec le numéro
- **Pages à mettre à jour** :
  - `frontend/app/(public)/cgv/page.tsx` — Art. 12 : remplacer "En cours"
  - `frontend/app/(public)/mentions-legales/page.tsx` — Section activité réglementée
  - `frontend/app/(public)/fiche-precontractuelle/page.tsx` — Section 1

### [LC-02] Garantie financière APST (P0 — CRITIQUE)
- **Statut actuel** : "En cours" — NON SOUSCRITE
- **Obligation légale** : Art. L.211-18 et R.211-26 Code du tourisme — garantie minimum 200 000 €
- **Risque** : Immatriculation Atout France impossible sans garantie financière
- **Organisme** : APST (Association Professionnelle de Solidarité du Tourisme)
- **Démarches** :
  - [ ] Adhésion APST (cotisation annuelle selon CA)
  - [ ] Montant garantie : min 200 000 € pour agence < 1M€ CA
- **Pages** :
  - `frontend/app/(admin)/admin/compliance/page.tsx` — mettre à jour statut
  - `frontend/app/(admin)/admin/finance/avances-hra/page.tsx` — référencer garantie APST

### [LC-03] RC Professionnelle tourisme (P0 — CRITIQUE)
- **Statut actuel** : "En cours" — NON SOUSCRITE
- **Obligation légale** : Art. R.211-29 Code du tourisme — RC Pro obligatoire
- **Couverture minimum** : 500 000 € par sinistre / 1 M€ par an
- **Actions** :
  - [ ] Souscrire auprès d'un assureur agréé (Hiscox, Allianz, AXA, Gras Savoye)
  - [ ] Attestation à joindre au dossier Atout France
- **Pages** :
  - `frontend/app/(public)/cgv/page.tsx` — Art. 7 Pack Sérénité : préciser assureur RC
  - `frontend/app/(admin)/admin/compliance/page.tsx` — statut

### [LC-04] SIRET & TVA intracommunautaire (P0 — CRITIQUE)
- **Statut actuel** : "En cours d'immatriculation"
- **Obligation** : Aucune facturation légale sans SIRET
- **Actions** :
  - [ ] Dépôt statuts SAS au greffe du tribunal de commerce
  - [ ] Immatriculation INSEE (SIRET automatique)
  - [ ] Demande numéro TVA intracommunautaire (SIE dont relève la société)
- **Pages à mettre à jour** :
  - `frontend/app/(public)/mentions-legales/page.tsx`
  - `frontend/app/(public)/cgv/page.tsx`
  - Toutes les factures générées

---

## P1 — CRITIQUE (< 30 jours après obtention SIRET)

### [LC-05] CGV — Précisions TVA marge (P1)
- **Problème** : CGV ne détaillent pas le régime TVA marge pour la transparence client
- **À ajouter dans CGV** :
  - Mention explicite du régime TVA sur la marge (Art. 306 bis CGI)
  - "Le prix affiché est un prix forfaitaire TTC — la TVA n'est pas récupérable par le client"
  - Explication que les achats sous-jacents (transport, hébergement) sont des coûts du forfait
- **Fichier** : `frontend/app/(public)/cgv/page.tsx`

### [LC-06] Droit de rétractation — précisions nécessaires (P1)
- **Statut actuel** : Absence de rétractation mentionnée (Art. L.221-28 12°) ✅
- **À vérifier/compléter** :
  - [ ] Distinction vente en ligne vs. hors établissement (même exclusion applicable)
  - [ ] Cas des réservations à distance non couvertes par la directive UE 2015/2302
  - [ ] Formulaire de confirmation de commande mentionnant explicitement l'absence de rétractation
  - [ ] Accusé de réception email automatique avec mention légale
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` + emails confirmation

### [LC-07] RGPD — DPA Sous-traitants à signer (P1)
- **Statut actuel** : Dashboard avocat montre plusieurs DPA non signés
- **Actions urgentes** :
  - [ ] Vercel (hébergeur frontend) — DPA à signer
  - [ ] Scaleway (hébergeur backend) — DPA à signer
  - [ ] Resend (emails transactionnels) — DPA en attente
  - [ ] Stripe — DPA à vérifier (normalement signé automatiquement)
- **Risque** : Transfert données sans DPA = violation RGPD Art. 28
- **Fichier** : `frontend/app/(avocat)/avocat/rgpd/page.tsx`

### [LC-08] Mentions légales — Compléter après immatriculation (P1)
- **À compléter** :
  - [ ] SIRET : _______________
  - [ ] RCS : Metz B _______________
  - [ ] N° TVA intracommunautaire : FR_______________
  - [ ] Capital social réel (après versement)
  - [ ] Numéro Atout France : IM_______________
  - [ ] Assureur RC Pro : Nom + numéro police
- **Fichier** : `frontend/app/(public)/mentions-legales/page.tsx`

### [LC-09] Politique cookies — Conformité CNIL (P1)
- **Problème** : Page existe mais conformité CNIL non vérifiée
- **Requis** :
  - [ ] Bannière consent obligatoire (opt-in, pas opt-out) — CNIL délibération 2020-091
  - [ ] Catégories cookies : essentiels / analytics / marketing avec descriptions
  - [ ] Durée de conservation par cookie (max 13 mois CNIL)
  - [ ] Bouton "Tout refuser" aussi visible que "Tout accepter"
  - [ ] Solution : Axeptio, Didomi, Tarteaucitron, ou CookieYes
- **Fichier** : `frontend/app/(public)/politique-cookies/page.tsx`

---

## P2 — IMPORTANT (< 60 jours)

### [LC-10] Fiche information précontractuelle — Immatriculation (P2)
- **Statut actuel** : Page complète mais sans numéro Atout France
- **À compléter dès obtention** :
  - [ ] Numéro Atout France dans Section 1
  - [ ] Adresse complète société (après enregistrement)
  - [ ] Assureur RC Pro avec numéro police
- **Fichier** : `frontend/app/(public)/fiche-precontractuelle/page.tsx`

### [LC-11] CGV — Nombre minimum participants (P2)
- **Incohérence détectée** : Fiche précontractuelle mentionne "10 participants minimum" mais CGV Art. 6.2 dit "voyages viables"
- **À clarifier** :
  - [ ] Définir seuil contractuel exact (ex: 8 personnes minimum)
  - [ ] Mention dans CGV Art. 6.2 avec délai de prévenance (ex: J-30)
  - [ ] Engagement Eventy : "on part même si le bus n'est pas plein" (âme Eventy) — à concilier avec obligation légale d'information

### [LC-12] Accessibilité RGAA (P2)
- **Obligation** : Loi n°2005-102 + RGAA 4.1 pour services numériques
- **Actions** :
  - [ ] Audit d'accessibilité des pages publiques
  - [ ] Déclaration d'accessibilité (obligatoire si CA > 250M€ — non bloquant actuellement)
  - [ ] Bonnes pratiques : contraste, navigation clavier, alt texts

### [LC-13] Médiation tourisme (P2)
- **Obligation** : Art. L.612-1 Code consommation — information médiateur obligatoire
- **Statut actuel** : CGV Art. 11 mentionne MTV (Médiateur du Tourisme et du Voyage) ✅
- **À vérifier** :
  - [ ] Adhésion formelle à MTV (cotisation annuelle)
  - [ ] Affichage lien plateforme EU ODR sur le site
  - [ ] Process interne traitement réclamations avant médiation

### [LC-14] Conditions assurance partenaire (P2)
- **Problème** : Pack Sérénité mentionné mais assureur non nommé dans CGV
- **Actions** :
  - [ ] Nommer l'assureur dans CGV Art. 7 (ex: "souscrit auprès de [Assureur], police n°XX")
  - [ ] Mettre à disposition fiche d'information détaillée (FID) sur site
  - [ ] Lien vers tableau de garanties téléchargeable
- **Fichier** : `frontend/app/(public)/cgv/page.tsx` Art. 7

### [LC-15] Protection des mineurs (P2)
- **Problème** : Voyages de groupe peuvent inclure mineurs — obligations légales spécifiques
- **À ajouter** :
  - [ ] Clause CGV : conditions d'inscription mineurs (accord parental écrit)
  - [ ] Formulaire autorisation parentale téléchargeable
  - [ ] Assurance spécifique mineurs si applicable

---

## P3 — AMÉLIORATION

### [LC-16] Contrats indépendants (P3)
- Contrat type à signer par chaque indépendant avant première mission
- Clauses : statut indépendant (pas salarié), responsabilité, obligations assurance, RGPD
- **Fichier** : `pdg-eventy/01-legal/CONTRAT-PARTENAIRE-TYPE.md` (existe, à faire signer numériquement)

### [LC-17] CGV B2B / CSE (P3)
- CGV spécifiques pour les ventes aux entreprises (CSE, collectivités)
- Mentions : TVA déductible par le client B2B, délais paiement légaux (LME 60 jours max)

### [LC-18] Conformité réseaux sociaux (P3)
- Mentions légales dans bio Instagram/Facebook/LinkedIn
- Conditions jeux-concours sur réseaux (loi LCEN)

---

## Récapitulatif — Chemin critique légal

```
SIRET → KBIS → Atout France + APST + RC Pro → LANCEMENT LÉGAL
  ↓         ↓          ↓
Mentions   TVA        CGV complètes
légales   intra       + numéros
```

| ID | Description | Priorité | Bloquant |
|----|-------------|----------|---------|
| LC-01 | Atout France | **P0** | Oui |
| LC-02 | Garantie APST | **P0** | Oui |
| LC-03 | RC Pro | **P0** | Oui |
| LC-04 | SIRET + TVA | **P0** | Oui |
| LC-05 | CGV TVA marge | **P1** | Non |
| LC-06 | Rétractation précisions | **P1** | Non |
| LC-07 | RGPD DPA sous-traitants | **P1** | Oui RGPD |
| LC-08 | Mentions légales MAJ | **P1** | Après SIRET |
| LC-09 | Cookies CNIL | **P1** | Oui RGPD |
| LC-10 | Fiche précontractuelle | **P2** | Non |
| LC-11 | Nb participants | **P2** | Non |
| LC-12 | Accessibilité RGAA | **P2** | Non |
| LC-13 | Médiation MTV | **P2** | Non |
| LC-14 | Assurance assureur nommé | **P2** | Non |
| LC-15 | Protection mineurs | **P2** | Non |

---
*Audit réalisé le 25/04/2026 — Mise à jour à chaque avancée administrative*
