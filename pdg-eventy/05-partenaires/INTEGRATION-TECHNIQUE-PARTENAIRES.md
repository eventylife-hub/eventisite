# Intégration Technique Partenaires — Eventy

> **Créé** : 5 mars 2026
> **Objectif** : Montrer aux partenaires comment notre plateforme se connecte à leurs systèmes
> **Usage** : Document de présentation lors des négociations partenaires

---

## 🎯 Message clé pour les partenaires

> **"Eventy n'est pas une agence classique au téléphone. C'est une plateforme tech professionnelle qui automatise le travail pour vous et pour nous. Travailler avec nous = zéro paperasse, zéro erreur, tout est tracé."**

---

## Architecture de la plateforme

```
┌────────────────────────────────────────────────────────────────┐
│                    EVENTY.LIFE (Plateforme)                     │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   CLIENTS    │  │     PRO      │  │      ADMIN           │ │
│  │  (voyageurs) │  │(organisateurs│  │  (David + équipe)    │ │
│  │  21 pages    │  │ 27 pages)    │  │  23 pages            │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│         │                 │                      │             │
│  ┌──────┴─────────────────┴──────────────────────┘             │
│  │              API BACKEND (29 modules NestJS)                │
│  │                                                             │
│  │  AUTH │ VOYAGES │ RÉSERVATIONS │ PAIEMENTS │ HRA │ ...     │
│  └──────┬──────────────────────────────────────────────────────┘
│         │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CONNEXIONS PARTENAIRES                        │
│                                                                 │
│  🏨 Hôtels       → Système d'invitation par token (HRA Module) │
│  🍽️ Restaurants   → Déclarations repas automatiques             │
│  🎭 Activités    → Workflow approbation + preuves               │
│  🚌 Transport    → Commande + suivi intégré                     │
│  💳 Paiement     → Stripe (CB + SEPA + gestion litiges)        │
│  📧 Emails       → Brevo/Mailjet (transactionnels automatiques)│
│  🛡️ Assurance    → Intégration contrat cadre (API future)      │
│  📊 Comptabilité → Export automatique (TVA marge, factures)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏨 Connexion HÔTELS — Module HRA (déjà opérationnel)

### Comment ça fonctionne pour l'hôtelier

1. **L'hôtelier reçoit un email** avec un lien unique (token d'invitation)
2. **Il clique sur le lien** → accède à la fiche de demande (dates, nb chambres, exigences)
3. **Il répond directement** sur la plateforme (proposition de prix, disponibilité)
4. **Eventy confirme** ou demande des modifications
5. **Le bloc est activé** → les chambres sont réservées

### Avantages pour l'hôtelier

- **Pas de paperasse** : tout est digital, tracé, archivé
- **Pas d'erreur** : les quantités, dates, prix sont verrouillés dans le système
- **Paiement garanti** : Stripe sécurise les fonds, règlement sous 30j
- **Visibilité** : fiche partenaire sur eventylife.fr avec avis vérifiés

### Endpoints techniques (pour développeurs hôtelier si API)

| Action | Méthode | URL |
|--------|---------|-----|
| Consulter l'invitation | GET | `/hra/hotel-blocks/respond/:token` |
| Répondre à l'invitation | POST | `/hra/hotel-blocks/respond/:token` |
| Les deux sont **publics** (pas besoin de compte) | | |

### Machine d'états du bloc hôtel

```
INVITE_SENT → HOTEL_SUBMITTED → BLOCK_ACTIVE (réservé !)
                    ↑
              CHANGES_REQUESTED (on négocie)
                    ↓
                REJECTED (on cherche un autre)
```

---

## 🍽️ Connexion RESTAURANTS — Module Restauration

### Comment ça fonctionne pour le restaurateur

1. **Enregistrement** comme partenaire restaurant sur la plateforme
2. **Réception des déclarations de repas** (petit-déjeuner, déjeuner, dîner, snack, spécial)
3. **Informations détaillées** : nombre de couverts, régimes alimentaires, allergies
4. **Facturation automatisée** via la plateforme

### Données transmises au restaurant

- Nombre exact de convives
- Régimes alimentaires (végétarien, vegan, halal, sans gluten, etc.)
- Allergies déclarées par chaque voyageur
- Horaires et lieu de service
- Budget par couvert

---

## 🎭 Connexion ACTIVITÉS — Workflow d'approbation

### Comment ça fonctionne pour le prestataire activités

1. **Ajout du coût d'activité** sur la plateforme (mode achat ou mode coût)
2. **Upload des justificatifs** (devis, facture, bon de commande)
3. **Validation par Eventy** (confirmation ou rejet)
4. **Paiement automatique** après confirmation

### Machine d'états

```
PLANNED → PROOF_UPLOADED → CONFIRMED → Paiement
                ↓
           REJECTED → PLANNED (on recommence)
```

---

## 🚌 Connexion TRANSPORT — Commande intégrée

### Comment ça fonctionne pour l'autocariste

1. **Demande de devis** via la plateforme (itinéraire, dates, nb passagers)
2. **Réponse du transporteur** avec tarif et disponibilité
3. **Confirmation** → bon de commande automatique
4. **Jour J** : le chauffeur a toutes les infos (liste passagers, points de RDV, horaires)
5. **Facturation** automatisée post-voyage

### Informations transmises automatiquement

- Nombre exact de passagers
- Adresses de départ/arrivée + étapes
- Horaires confirmés
- Coordonnées du responsable groupe
- Besoins spéciaux (PMR, bagages volumineux)

---

## 💳 Connexion PAIEMENTS — Stripe

### Pour les clients

| Méthode | Frais | Délai |
|---------|-------|-------|
| Carte bancaire EU | 1,5% + 0,25€ | Instantané |
| Carte premium | 1,9% + 0,25€ | Instantané |
| Virement SEPA | 0,35€ | 2-3 jours |

### Pour les partenaires

- **Paiement sous 30 jours** après le voyage
- **Virement SEPA automatique** depuis le compte Eventy
- **Facture générée automatiquement** par la plateforme
- **Pas de litige** : tout est tracé (réservation, confirmation, preuve de service)

---

## 📧 Connexion EMAILS — Automatisation complète

### Emails automatiques envoyés par la plateforme

| Événement | Destinataire | Contenu |
|-----------|-------------|---------|
| Nouvelle invitation bloc | Hôtelier | Lien token + détails demande |
| Confirmation réservation | Client | Récapitulatif + certificat assurance |
| Rappel paiement | Client | Échéancier + lien paiement |
| Déclaration repas | Restaurant | Détails + allergies |
| Bon de commande transport | Autocariste | Itinéraire + passagers |
| Facture | Partenaire | Facture PDF automatique |
| Bienvenue | Client/PRO | Onboarding |

### Volume estimé

- Phase 1 : ~300 emails/jour (gratuit avec Brevo)
- Phase 2 : ~1 000 emails/jour (25€/mois Brevo)

---

## 📊 Pour l'expert-comptable — Export automatique

### Données exportables

- **Facturation** : toutes les factures au format PDF + CSV
- **TVA sur la marge** : calcul automatique (CA_TTC − coûts_TTC) × 20/120
- **Encaissements** : suivi Stripe temps réel
- **Décaissements** : paiements partenaires tracés
- **Journal comptable** : export mensuel automatisé

### Intégration possible

- Export CSV compatible Pennylane, Indy, QuickBooks
- API d'export si le cabinet utilise un logiciel compatible
- Rapprochement bancaire facilité (chaque transaction a une référence unique)

---

## 🛡️ Pour l'assureur — Intégration future

### Ce qu'on propose

- **API de souscription** : chaque réservation = un contrat d'assurance automatique
- **Données voyageur** transmises en temps réel (nom, dates, destination)
- **Certificat d'assurance** généré automatiquement et envoyé au client
- **Déclaration de sinistre** initiée depuis la plateforme
- **Reporting** mensuel automatique (nb contrats, primes, sinistres)

### Volume estimé

| Période | Contrats/mois | CA assurance/mois |
|---------|-------------|-------------------|
| Phase 1 | 30-75 | 1 080€ - 2 700€ |
| Phase 2 | 150-300 | 5 400€ - 10 800€ |
| Phase 3 | 500+ | 18 000€+ |

---

## 📋 Pour les brochures et prospectus

### Ce dont on a besoin des partenaires

| Type | Quantité | Format | Usage |
|------|----------|--------|-------|
| **Photos HD** | 10-20 par établissement | JPEG/PNG min 2000px | Fiches voyage sur eventylife.fr |
| **Descriptifs** | 1 par établissement | Texte 200-500 mots | Pages partenaires |
| **Tarifs groupes** | Grille complète | PDF ou Excel | Calcul prix voyages |
| **Brochures physiques** | Lot de 50-100 | Format A5 ou A4 | Salons, événements |
| **Vidéos** (optionnel) | 1-2 par établissement | MP4 min 720p | Réseaux sociaux |
| **Logo HD** | 1 | SVG ou PNG transparent | Site + supports |

### Commande de lots brochures

> **Message type pour demander des brochures :**
>
> "Bonjour, dans le cadre de notre partenariat, nous souhaiterions recevoir un lot de 100 brochures de votre établissement pour les distribuer lors de nos événements et salons. Pourriez-vous nous faire parvenir ce lot à l'adresse suivante : [adresse Eventy] ? Merci."

### Où afficher les brochures partenaires

- **Site eventylife.fr** : fiche partenaire dédiée avec photos, description, avis
- **Salons professionnels** : stands Eventy (distribution physique)
- **Réseaux sociaux** : posts sponsorisés avec visuels partenaires
- **Emails clients** : newsletter mensuelle avec partenaires mis en avant

---

## 🔑 Résumé — Ce qu'on dit aux partenaires

> **"Notre plateforme gère tout automatiquement :**
> - Vous recevez les demandes par email avec un lien simple
> - Vous répondez en 2 clics
> - On confirme, et c'est réglé
> - Le paiement arrive automatiquement sous 30 jours
> - Zéro paperasse, zéro erreur, tout est tracé
> - Et on vous amène un flux régulier de clients"

---

## ☎️ Spécialistes à contacter

| Besoin | Spécialiste | Pourquoi |
|--------|------------|----------|
| Intégration API assureur | Développeur backend | Connecter l'API assurance au module booking |
| Brochures + visuels | Graphiste / Canva Pro | Créer les supports marketing |
| Contrat cadre transport | Courtier transport | Négocier les tarifs groupes |
| Formation commerciale | Consultant tourisme | Former David à la vente B2B tourisme |
