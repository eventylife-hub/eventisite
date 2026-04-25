# TODO Conformité — Checklist Complète Avant Lancement
> Audit 25/04/2026 — Vision binaire GO / NO-GO par domaine

---

## DOMAINE 1 : STRUCTURE JURIDIQUE

| # | Exigence | Statut | Bloquant |
|---|----------|--------|---------|
| J-01 | SAS immatriculée au RCS (SIRET obtenu) | ❌ En cours | **OUI** |
| J-02 | Statuts SAS signés par les associés | ❌ En cours | **OUI** |
| J-03 | Capital social versé (min. 1€ légal, recommandé 5 000€+) | ❌ En cours | **OUI** |
| J-04 | K-bis obtenu | ❌ Après J-01 | **OUI** |
| J-05 | N° TVA intracommunautaire obtenu | ❌ Après J-01 | **OUI** |
| J-06 | Compte bancaire professionnel ouvert | ❌ Après J-01 | **OUI** |
| J-07 | Marque INPI "Eventy" déposée (classe 39 voyages) | ❌ Non fait | Non (mais urgent) |
| J-08 | Domaine eventy.fr sécurisé + variantes typo | ✅ À vérifier | Recommandé |

---

## DOMAINE 2 : AGRÉMENTS TOURISME

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| T-01 | Garantie financière APST (min. 200 000€) | R.211-26 C.tour | ❌ Non souscrite | **OUI** |
| T-02 | RC Pro tourisme (min. 500K€/sinistre, 1M€/an) | R.211-29 C.tour | ❌ Non souscrite | **OUI** |
| T-03 | Dossier Atout France déposé | L.211-18 C.tour | ❌ Non déposé | **OUI** |
| T-04 | N° immatriculation Atout France reçu (IM...) | L.211-18 C.tour | ❌ Après T-01/T-02 | **OUI** |
| T-05 | N° Atout France affiché sur tous les documents | R.211-37 | ❌ Après T-04 | **OUI** |
| T-06 | Adhésion formelle MTV (Médiateur Tourisme Voyage) | L.612-1 C.conso | ❌ Non fait | OUI RGPD |

---

## DOMAINE 3 : CGV & DOCUMENTS CONTRACTUELS

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| C-01 | CGV avec toutes les mentions obligatoires Code tourisme | R.211-3 à 11 | ⚠️ Partiel | **OUI** |
| C-02 | CGV : article cession du contrat (Art. L.211-11) | L.211-11 | ❌ Manquant | **OUI** |
| C-03 | CGV : délais légaux modifications substantielles | L.211-13 | ❌ Manquant | **OUI** |
| C-04 | CGV : résiliation organisateur avec délais J-20/J-7/J-48h | L.211-14 | ❌ Incomplet | **OUI** |
| C-05 | CGV : barème annulation aligné sur recommandation légale | L.211-15 | ⚠️ À vérifier | **OUI** |
| C-06 | CGV : mention TVA sur la marge (Art. 306 bis CGI) | 306 bis CGI | ❌ Manquant | OUI fiscal |
| C-07 | CGV : assureur RC Pro nommé + n° police | R.211-29 | ❌ Manquant | **OUI** |
| C-08 | CGV : numéro Atout France (après obtention) | R.211-37 | ❌ Manquant | **OUI** |
| C-09 | CGV : garantie insolvabilité APST détaillée | L.211-18 | ⚠️ Incomplet | **OUI** |
| C-10 | CGV : protection mineurs (accord parental) | L.211-2 C.tour | ❌ Manquant | OUI si mineurs |
| C-11 | CGV : droit à l'image (photos voyages) | Art. 9 C.civil | ❌ Manquant | Recommandé |
| C-12 | CGV : lien plateforme EU ODR | R. UE 524/2013 | ❌ Manquant | **OUI** |
| C-13 | CGV : révision de prix (facteurs légaux + seuil 8%) | L.211-12 | ❌ Incomplet | **OUI** |
| C-14 | Fiche précontractuelle conforme Annexe I Directive | L.211-9 | ✅ Partiel | **OUI** |
| C-15 | N° Atout France dans fiche précontractuelle | R.211-37 | ❌ Après T-04 | **OUI** |

---

## DOMAINE 4 : MENTIONS LÉGALES & SITE

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| ML-01 | Mentions légales LCEN complètes | Loi 2004-575 | ⚠️ Partiel | **OUI** |
| ML-02 | SIRET + RCS + TVA dans mentions légales | LCEN | ❌ Manquant | **OUI** |
| ML-03 | Hébergeur Vercel (adresse complète) dans ML | LCEN | ✅ Présent | **OUI** |
| ML-04 | Directeur de publication nommé | LCEN | ✅ David | OUI |
| ML-05 | Section accessibilité numérique | Loi 2005-102 | ❌ Manquant | Recommandé |
| ML-06 | Section médiation consommateur (MTV + ODR) | L.612-1 | ❌ Manquant | **OUI** |
| ML-07 | Lien "Signaler un contenu illicite" | LCEN | ❌ Manquant | OUI LCEN |
| ML-08 | N° Atout France dans mentions légales | R.211-37 | ❌ Après T-04 | **OUI** |

---

## DOMAINE 5 : RGPD & DONNÉES PERSONNELLES

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| R-01 | Politique de confidentialité publiée | RGPD Art. 13/14 | ✅ Présent | **OUI** |
| R-02 | Registre des traitements rédigé | RGPD Art. 30 | ⚠️ Partiel | **OUI** |
| R-03 | DPA Vercel signé | RGPD Art. 28 | ❌ Manquant | **OUI** |
| R-04 | DPA Scaleway signé | RGPD Art. 28 | ❌ Manquant | **OUI** |
| R-05 | DPA Resend signé | RGPD Art. 28 | ❌ Manquant | **OUI** |
| R-06 | DPA Stripe vérifié | RGPD Art. 28 | ⚠️ À vérifier | **OUI** |
| R-07 | Bannière cookies CNIL conforme (opt-in) | CNIL 2020-091 | ❌ Manquant | **OUI** |
| R-08 | Consentement explicite données santé voyageurs | RGPD Art. 9 | ❌ Manquant | **OUI** |
| R-09 | Données passeport chiffrées + purge J+30 | RGPD Art. 5 | ❌ Manquant | **OUI** |
| R-10 | Droits RGPD (accès, rectification, suppression) implémentés | RGPD Art. 15-22 | ✅ DSAR existe | OUI |
| R-11 | Consentement marketing distinct du contrat | RGPD Art. 7 | ⚠️ À vérifier | **OUI** |
| R-12 | Durées de conservation définies + purge automatique | RGPD Art. 5 | ❌ Manquant | **OUI** |
| R-13 | Transferts hors UE documentés (Stripe/Vercel USA) | RGPD Art. 44-49 | ❌ Manquant | **OUI** |

---

## DOMAINE 6 : FINANCE & COMPTABILITÉ

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| F-01 | Compte bancaire professionnel ouvert | — | ❌ Après J-01 | **OUI** |
| F-02 | Expert-comptable désigné | — | ❌ Non fait | **OUI** |
| F-03 | Régime TVA marge enregistré auprès du SIE | Art. 306 bis CGI | ❌ Après J-01 | OUI fiscal |
| F-04 | Numérotation factures séquentielle configurée | Art. 242 nonies A CGI | ❌ Manquant | **OUI** |
| F-05 | Factures conformes droit français (SIRET, TVA marge) | Art. 289 CGI | ❌ Manquant | **OUI** |
| F-06 | Logiciel comptable caisse anti-fraude certifié (NF525) | Art. 286 bis CGI | ❌ À vérifier | **OUI** |
| F-07 | IBAN professionnel sur toutes les factures | — | ❌ Après F-01 | **OUI** |
| F-08 | Plan comptable général (PCG) configuré | PCG 82 | ❌ Manquant | **OUI** |
| F-09 | Collecte taxe de séjour configurée | CGCT | ❌ Manquant | OUI si séjours |
| F-10 | Archivage légal factures 10 ans configuré | Art. L.123-22 | ❌ Manquant | **OUI** |

---

## DOMAINE 7 : ASSURANCE & PROTECTION CLIENTS

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| A-01 | RC Pro tourisme active (voir T-02) | R.211-29 C.tour | ❌ Non souscrite | **OUI** |
| A-02 | Garantie financière APST active (voir T-01) | R.211-26 C.tour | ❌ Non souscrite | **OUI** |
| A-03 | Pack Sérénité : assureur nommé dans CGV | — | ❌ Manquant | Recommandé |
| A-04 | FID (Fiche Information Détaillée) assurance disponible | Code assurances | ❌ Manquant | OUI si assurance |
| A-05 | Informations rapatriement/urgence pendant voyage | L.211-17-1 | ❌ Manquant | **OUI** |
| A-06 | Numéro d'urgence 24/7 pendant voyages | L.211-17-1 | ❌ Non opérationnel | **OUI** |
| A-07 | Couverture insolvabilité affichée sur site | L.211-18 | ❌ Incomplet | **OUI** |

---

## DOMAINE 8 : OPÉRATIONNEL & TECHNIQUE

| # | Exigence | Base légale | Statut | Bloquant |
|---|----------|-------------|--------|---------|
| O-01 | Processus réclamation pendant voyage documenté | L.211-16 | ❌ Manquant | **OUI** |
| O-02 | Process réclamation post-voyage < 2 mois avant MTV | L.612-1 | ❌ Manquant | **OUI** |
| O-03 | Informations formalités (visa/passeport) sur chaque voyage | R.211-7 | ❌ Manquant | **OUI** |
| O-04 | Contrats partenaires indépendants signés (anti-requalification) | L.8221-6 | ❌ Manquant | **OUI** |
| O-05 | Attestation RC Pro demandée à chaque partenaire | — | ❌ Manquant | **OUI** |
| O-06 | Procédure gestion mineurs documentée | L.211-2 | ❌ Manquant | OUI si mineurs |
| O-07 | Tests restauration archivage (FEC, ZIP) | LPF Art. L.47 A | ❌ Manquant | **OUI** |

---

## RÉSUMÉ GO / NO-GO

### Bloquants absolus (doivent être ✅ avant premier voyage commercialisé)

```
STRUCTURE LÉGALE
  ✅ SIRET + K-bis → ✅ Compte bancaire pro → ✅ Expert-comptable

AGRÉMENTS TOURISME
  ✅ RC Pro → ✅ APST → ✅ Atout France IM...

DOCUMENTS CONTRACTUELS
  ✅ CGV complètes → ✅ Fiche précontractuelle → ✅ Mentions légales LCEN

RGPD
  ✅ DPA Vercel/Scaleway/Resend → ✅ Cookies CNIL → ✅ Données santé/passeport

FINANCE
  ✅ Factures conformes (SIRET + TVA marge) → ✅ Archivage légal
```

### Score de conformité actuel (25/04/2026)

| Domaine | Total items | ✅ OK | ⚠️ Partiel | ❌ Manquant |
|---------|------------|------|-----------|------------|
| Structure juridique | 8 | 1 | 0 | 7 |
| Agréments tourisme | 6 | 0 | 0 | 6 |
| CGV & contractuel | 15 | 1 | 3 | 11 |
| Mentions légales | 8 | 2 | 1 | 5 |
| RGPD | 13 | 2 | 2 | 9 |
| Finance | 10 | 0 | 0 | 10 |
| Assurance | 7 | 0 | 1 | 6 |
| Opérationnel | 7 | 0 | 0 | 7 |
| **TOTAL** | **74** | **6 (8%)** | **7 (9%)** | **61 (82%)** |

> **⚠️ NIVEAU DE CONFORMITÉ : 8% — LANCEMENT ILLÉGAL EN L'ÉTAT**
> Objectif : 100% des bloquants résolus avant premier voyage commercialisé.

---

*Audit réalisé le 25/04/2026 — À mettre à jour après chaque étape administrative complétée*
