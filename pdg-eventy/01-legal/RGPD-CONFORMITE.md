# Conformité RGPD — Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Statut** : En cours de mise en conformité
> **Référent RGPD** : David (PDG) — privacy@eventylife.fr
> **Module DSAR backend** : Opérationnel (4 endpoints : accès, rectification, suppression, export)

---

## Obligations en tant que plateforme tech + agence de voyages

Eventy collecte et traite des données personnelles de clients (voyageurs B2C + B2B), de partenaires professionnels et de prospects. Le RGPD (Règlement UE 2016/679) s'applique intégralement.

**Double casquette** :
- **Responsable de traitement** : pour les données collectées directement (clients, prospects, navigation)
- **Sous-traitant** : vis-à-vis des prestataires quand Eventy transmet les données voyageurs pour l'exécution des prestations

---

## Données collectées — Registre des traitements (Art. 30 RGPD)

### Traitement 1 : Gestion des réservations (clients / voyageurs)

| Donnée | Finalité | Base légale (Art. 6) | Conservation |
|--------|----------|---------------------|-------------|
| Nom, prénom | Identification, réservation | Contrat (6.1.b) | 3 ans après dernier voyage |
| Date de naissance | Réservation transport/hébergement | Contrat (6.1.b) | 3 ans après dernier voyage |
| Email | Communication, documents voyage | Contrat (6.1.b) | 3 ans après dernier contact |
| Téléphone | Contact urgent pendant voyage | Contrat (6.1.b) | 3 ans après dernier voyage |
| Adresse postale | Facturation | Obligation légale fiscale (6.1.c) | **10 ans** (obligation comptable) |
| Passeport / CNI | Réservation transport, formalités | Contrat (6.1.b) | **J+30 après retour** (suppression auto) |
| Données bancaires | Paiement | Contrat (6.1.b) | **Jamais stockées** (Stripe tokenisation) |
| Préférences voyage | Personnalisation offres | Intérêt légitime (6.1.f) | 3 ans après dernier contact |

### Traitement 2 : Données de santé (catégorie spéciale — Art. 9)

| Donnée | Finalité | Base légale | Conservation |
|--------|----------|-------------|-------------|
| Allergies alimentaires | Adaptation restauration | **Consentement explicite** (Art. 9.2.a) | Durée du voyage + 30 jours |
| Régimes alimentaires | Adaptation restauration | Consentement explicite (Art. 9.2.a) | Durée du voyage + 30 jours |
| Mobilité réduite | Adaptation prestations | Consentement explicite (Art. 9.2.a) | Durée du voyage + 30 jours |
| Informations médicales urgence | Sécurité voyageur | Consentement explicite (Art. 9.2.a) | Durée du voyage + 30 jours |

> **IMPORTANT** : Les données de santé nécessitent un **consentement explicite, libre, spécifique et éclairé**. Case à cocher dédiée dans le formulaire de réservation (pas de case pré-cochée). Le refus ne doit pas bloquer la réservation.

### Traitement 3 : Pack Sérénité (données assurance)

| Donnée | Finalité | Base légale | Conservation |
|--------|----------|-------------|-------------|
| Données sinistre | Déclaration et gestion sinistre | Contrat (6.1.b) | **5 ans** (prescription assurance) |
| Justificatifs sinistre | Prise en charge assureur | Contrat (6.1.b) | 5 ans |
| Données médicales sinistre | Rapatriement, frais médicaux | Consentement explicite (Art. 9.2.a) | 5 ans |

### Traitement 4 : Prospection commerciale

| Donnée | Finalité | Base légale | Conservation |
|--------|----------|-------------|-------------|
| Email prospect B2C | Newsletter, offres | **Consentement** (6.1.a) — opt-in obligatoire | 3 ans après dernier contact |
| Email prospect B2B | Prospection séminaires | **Intérêt légitime** (6.1.f) — opt-out | 3 ans après dernier contact |
| Données navigation | Retargeting (Meta, Google) | Consentement cookies (6.1.a) | 13 mois max |

> **B2B vs B2C** : La prospection B2B par email est permise sans consentement préalable si liée à la fonction professionnelle (Art. L.34-5 CPCE). Le B2C nécessite un opt-in.

### Traitement 5 : Professionnels / Partenaires

| Donnée | Finalité | Base légale | Conservation |
|--------|----------|-------------|-------------|
| Identité du représentant | Gestion contrat partenaire | Contrat (6.1.b) | Durée contrat + 5 ans |
| Coordonnées entreprise | Communication commerciale | Intérêt légitime (6.1.f) | Durée contrat + 3 ans |
| SIRET, Kbis | Vérification légale due diligence | Obligation légale (6.1.c) | Durée contrat + 5 ans |
| RIB | Paiement des prestations | Contrat (6.1.b) | Durée contrat + 10 ans (comptable) |
| Évaluations qualité | Suivi performance partenaire | Intérêt légitime (6.1.f) | Durée contrat + 2 ans |

### Traitement 6 : Données techniques

| Donnée | Finalité | Base légale | Conservation |
|--------|----------|-------------|-------------|
| Adresse IP | Sécurité, logs LCEN | Obligation légale (6.1.c) | **1 an** |
| Logs de connexion | Sécurité, audit | Obligation légale (6.1.c) | 1 an |
| Cookies analytics | Statistiques audience | Consentement (6.1.a) | 13 mois |
| User Agent / Device | Compatibilité technique | Intérêt légitime (6.1.f) | Session |

---

## Actions obligatoires — Checklist conformité

### Avant lancement (P0 — BLOQUANT)

- [ ] Désigner un référent RGPD interne (David en Phase 1, DPO externe à prévoir Phase 3)
- [ ] Finaliser le **registre des traitements** (Art. 30) — utiliser ce document comme base
- [ ] Rédiger et publier la **politique de confidentialité** sur eventylife.fr/confidentialite (→ voir MENTIONS-LEGALES.md)
- [ ] Implémenter le **bandeau cookies** conforme CNIL (Tarteaucitron.js) — pas de tracking avant consentement
- [ ] Publier les **mentions légales** (→ voir MENTIONS-LEGALES.md)
- [ ] Publier les **CGV** avec mentions RGPD (→ voir CGV-TEMPLATE.md, Art. 11)
- [ ] Vérifier le module **DSAR** backend (droit d'accès / rectification / suppression / portabilité)
- [ ] Implémenter la **suppression automatique** des pièces d'identité à J+30 (cron job backend)
- [ ] Implémenter la **purge automatique** des données de santé à fin de voyage + 30 jours
- [ ] Configurer le formulaire de **consentement explicite** pour les données de santé (case non pré-cochée)
- [ ] Configurer le formulaire d'**opt-in newsletter** B2C (double opt-in recommandé)
- [ ] **Signer les DPA** avec tous les sous-traitants (voir liste ci-dessous)
- [ ] Ajouter une clause RGPD dans le **contrat partenaire** (→ Art. 11 du CONTRAT-PARTENAIRE-TYPE.md ✅)
- [ ] Chiffrer les données sensibles en base (passeports, données santé — Argon2id pour mots de passe, AES-256 pour documents)

### Après lancement (P1 — 3 premiers mois)

- [ ] Effectuer une **Analyse d'Impact (AIPD/DPIA)** sur les traitements à risque (données santé, sinistres Pack Sérénité)
- [ ] Documenter les **flux de données** vers les sous-traitants hors UE (Stripe US → SCC, Google → DPF)
- [ ] Former l'équipe aux bonnes pratiques RGPD (quand recrutements Phase 2)
- [ ] Mettre en place un process de **notification de violation** (Art. 33 — 72h pour CNIL, sans délai si risque élevé pour les personnes)
- [ ] Tester le process DSAR complet (demande → réponse en < 30 jours)

### En continu

- [ ] Revue annuelle du registre des traitements
- [ ] Vérification des durées de conservation (purges automatiques)
- [ ] Mise à jour de la politique de confidentialité si nouveau traitement
- [ ] Audit des accès aux données personnelles (logs)

---

## Sous-traitants nécessitant un DPA (Art. 28 RGPD)

| Sous-traitant | Service | Données transmises | Localisation | DPA | Statut |
|--------------|---------|-------------------|-------------|-----|--------|
| **Scaleway** (Iliad) | Hébergement serveurs + BDD | Toutes les données | **France** (Paris DC2/DC5) | DPA Scaleway standard | [ ] À signer |
| **Stripe** | Paiement CB + SEPA | Données paiement tokenisées | UE (Dublin) / US | DPA intégré aux CGU Stripe | [✓] Inclus |
| **Brevo** (ex-Sendinblue) | Emails transactionnels + marketing | Email, nom, prénom | **France** (Paris) | DPA Brevo standard | [ ] À signer |
| **Google** (Analytics 4) | Statistiques audience | Données navigation anonymisées | US | SCC + DPF | [ ] À configurer |
| **[Assureur Pack Sérénité]** | Gestion sinistres | Données sinistre, médicales | France | DPA spécifique à rédiger | [ ] À signer |
| **Prestataires voyage** (hôtels, transporteurs, activités) | Exécution prestations | Noms, dates, nb personnes, allergies | Variable (UE principal) | Clause Art. 11 contrat partenaire | [ ] Par contrat |

> **Principe de minimisation** (Art. 5.1.c) : Ne transmettre aux prestataires QUE les données nécessaires à l'exécution de la prestation (noms, dates, nombre de personnes, allergies si pertinent). Jamais d'email, téléphone ou adresse sauf nécessité absolue.

---

## Module DSAR (déjà implémenté dans le backend)

Le module `dsar` du backend NestJS gère les droits des personnes :

| Droit | Endpoint | Délai légal | Implémentation |
|-------|----------|------------|----------------|
| Accès (Art. 15) | `GET /dsar/access` | 30 jours | Export JSON/PDF des données personnelles |
| Rectification (Art. 16) | `PATCH /dsar/rectify` | 30 jours | Modification des données en base |
| Suppression (Art. 17) | `DELETE /dsar/erase` | 30 jours | Anonymisation (pas suppression physique si obligation comptable) |
| Portabilité (Art. 20) | `GET /dsar/export` | 30 jours | Export JSON structuré |
| Opposition (Art. 21) | `POST /dsar/object` | Immédiat pour prospection | Désabonnement newsletter, suppression cookies |

> **Anonymisation vs suppression** : Pour les données soumises à obligation de conservation comptable (10 ans), on anonymise le nom/email mais on conserve les montants et références pour la comptabilité. Les données de santé et pièces d'identité sont supprimées physiquement.

---

## Durées de conservation — Synthèse

| Donnée | Durée | Déclencheur purge | Méthode |
|--------|-------|-------------------|---------|
| Pièce d'identité (passeport/CNI) | J+30 après retour | Cron job quotidien | Suppression physique |
| Données de santé (allergies, régimes) | Fin voyage + 30 jours | Cron job quotidien | Suppression physique |
| Données client actif | Durée relation + 3 ans | Inactivité 3 ans | Anonymisation |
| Données prospect | 3 ans après dernier contact | Inactivité 3 ans | Suppression |
| Données comptables | 10 ans | Fin exercice fiscal | Archivage puis suppression |
| Données sinistre Pack Sérénité | 5 ans | Date sinistre | Archivage puis suppression |
| Cookies analytics | 13 mois | Expiration automatique | Suppression automatique navigateur |
| Logs de connexion | 1 an | Date du log | Rotation automatique |

---

## Sanctions CNIL — Rappel

- **Amende maximale** : 20 M€ ou **4% du CA annuel mondial** (le plus élevé des deux)
- **Mise en demeure publique** : Impact réputationnel majeur pour une agence de voyage
- **Sanctions récentes tourisme (2024-2025)** : Plusieurs agences sanctionnées pour défaut de consentement cookies et conservation excessive de données d'identité

---

## Décisions PDG (05/03/2026)

- **Scaleway = hébergeur unique** : Données 100% en France, simplifie la conformité RGPD (pas de transfert hors UE pour l'hébergement)
- **Google Analytics avec consentement strict** : Pas de tracking tant que le visiteur n'a pas accepté les cookies analytics
- **Suppression automatique passeports J+30** : Implémenter en priorité dans le backend (cron job)
- **DPA en priorité** : Scaleway + Brevo avant le lancement, assureur dès signature du contrat
- **Pack Sérénité = attention données santé** : Le traitement de données de sinistres médicaux peut nécessiter une AIPD (Analyse d'Impact — Art. 35 RGPD). À planifier dans les 3 premiers mois.
- **Minimisation stricte vers prestataires** : Limiter les données transmises aux hôtels/transporteurs au strict minimum (noms, dates, effectif, allergies alimentaires si repas inclus)
