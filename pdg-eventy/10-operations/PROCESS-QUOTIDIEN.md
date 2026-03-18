# Process Quotidiens — Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Phase** : Phase 1 (PDG seul — David fait tout)
> **Automatisations backend** : 15-20h/semaine économisées grâce aux modules NestJS
> **Objectif** : Maximum 10h/jour, 5,5j/semaine — éviter le burnout

---

## Routine journalière PDG — Phase 1

### 🌅 Matin (8h30-9h00) — Check rapide (30 min)

| Action | Outil | Durée |
|--------|-------|-------|
| Vérifier uptime site + API | UptimeRobot (app mobile) | 2 min |
| Vérifier alertes Sentry (erreurs 500) | Sentry (email + app) | 5 min |
| Scanner emails urgents (clients, partenaires, Stripe) | Gmail / Google Workspace (7€/mois) | 10 min |
| Vérifier paiements Stripe (acomptes reçus, échecs) | Dashboard Stripe | 5 min |
| Consulter dashboard admin Eventy | eventylife.fr/admin | 8 min |

### 🏗️ Matin (9h00-12h00) — Production (3h)

| Créneau | Action | Priorité |
|---------|--------|----------|
| 9h-10h | **Traiter les demandes de devis** (objectif : réponse < 24h) | P0 |
| 10h-11h | **Relancer les clients** en attente de paiement (solde J-30, split payment) | P0 |
| 11h-12h | **Gérer les réservations confirmées** (confirmer prestataires, envoyer documents) | P0 |

### 🍽️ Pause déjeuner (12h-13h30)

### 📈 Après-midi (13h30-17h00) — Développement (3h30)

| Créneau | Action | Priorité |
|---------|--------|----------|
| 13h30-14h30 | **Prospection partenaires** (5 contacts/semaine minimum) | P1 |
| 14h30-15h30 | **Contenu marketing** (1 post LinkedIn/semaine, 1 article blog/mois) | P1 |
| 15h30-17h00 | **Développement plateforme** (features, bugs, améliorations UX) | P2 |

### 📋 Fin de journée (17h00-18h00) — Admin (1h)

| Action | Outil | Durée |
|--------|-------|-------|
| Mettre à jour suivi partenaires | SUIVI-PARTENAIRES.md ou Notion | 15 min |
| Mettre à jour trésorerie (entrées/sorties du jour) | Pennylane / tableur | 15 min |
| Répondre aux emails non urgents | Gmail | 15 min |
| Préparer la to-do du lendemain | Notion / papier | 15 min |

---

## Routine hebdomadaire

### Lundi — Planification
- Revoir les KPIs de la semaine précédente
- Fixer les objectifs de la semaine (max 3 priorités)
- Planifier les RDV partenaires et prospects

### Mercredi — Point finances
- Vérifier solde compte pro (Qonto)
- Rapprocher les paiements Stripe vs réservations
- Envoyer les relances de paiement en retard
- Point rapide avec l'expert-comptable si besoin (15 min)

### Vendredi — Bilan & Marketing
- Bilan KPIs hebdomadaires (remplir le tableau ci-dessous)
- Préparer le contenu marketing de la semaine suivante
- Envoyer la newsletter si prévue (Brevo)
- Backup manuel du dashboard et des données critiques

---

## 4 Process clés détaillés

### Process 1 — Nouveau devis client (objectif : envoi < 24h)

| Étape | Action | Délai | Outil | Auto |
|-------|--------|-------|-------|------|
| 1 | Réception demande (formulaire site / email / téléphone) | J0 | Notification email + admin | ✅ |
| 2 | Qualification : nb personnes, dates, destination, budget, type (EVG/EVJF/séminaire/loisir) | J0, < 2h | Dashboard admin | Manuel |
| 3 | Vérification disponibilité prestataires (hébergement + transport + activités) | J0 | Module HRA backend | Semi-auto |
| 4 | Calcul prix : coût prestataires + marge Eventy (25-40%) + Pack Sérénité (~4,5%) | J0 | Module Pricing backend | ✅ |
| 5 | Génération devis PDF détaillé (avec Pack Sérénité mis en avant) | J0-J1 | Module Documents backend | ✅ |
| 6 | **Envoi devis au client** avec explication Pack Sérénité inclus | J1 max | Email template EMAILS-CLIENTS.md | Manuel |
| 7 | Relance 1 si pas de réponse | J+5 | Email template auto | ✅ Programmé |
| 8 | Relance 2 (téléphone recommandé) | J+10 | Téléphone + email | Manuel |
| 9 | Relance 3 (dernière chance, offre spéciale -5% si possible) | J+15 | Email template | Manuel |
| 10 | Clôture si pas de réponse (archivage prospect) | J+21 | Dashboard admin | ✅ |

**Objectif Phase 1** : Devis envoyé sous 24h (max 48h le week-end)
**Taux de conversion cible** : 15-25% (devis → réservation confirmée)

### Process 2 — Réservation confirmée (12 étapes)

| Étape | Action | Délai | Responsable |
|-------|--------|-------|-------------|
| 1 | **Réception acompte 30%** via Stripe (CB ou SEPA) | J0 | Auto (Stripe webhook) |
| 2 | Email confirmation automatique au client + récap Pack Sérénité | J0 | ✅ Auto (module emails) |
| 3 | **Confirmation prestataires** (hébergement, transport, activités) | J0-J1 | Manuel (email + téléphone) |
| 4 | Création dossier voyage dans le dashboard | J1 | ✅ Auto (backend) |
| 5 | Envoi lien split payment aux participants du groupe | J1-J3 | ✅ Auto (module paiements) |
| 6 | Collecte pièces d'identité (passeports si nécessaire) | J1-J15 | Espace client (upload sécurisé S3 Scaleway, chiffré AES-256) |
| 7 | **Demande solde** 70% (relance automatique) | J-30 | ✅ Auto (cron job + email) |
| 8 | Envoi documents voyage (convocation, programme détaillé, contacts urgence) | J-15 | Semi-auto (génération PDF) |
| 9 | Envoi conditions Pack Sérénité complètes (obligation légale assurance) | J-15 | ✅ Auto (email + PDF) |
| 10 | **Rappel pratique** (lieu RDV, horaires, checklist bagages) | J-3 | ✅ Auto (email template) |
| 11 | **Enquête satisfaction** post-voyage | J+3 | ✅ Auto (email + formulaire) |
| 12 | Relance avis en ligne + proposition voyage suivant | J+7 / J+30 | ✅ Auto (emails programmés) |

**Post-voyage automatique** : Suppression passeports J+30 (cron job backend), suppression données santé fin voyage +30j

### Process 3 — Gestion des réclamations (4 niveaux)

| Sévérité | Exemple | Délai réponse | Action | Compensation | Escalade |
|----------|---------|---------------|--------|-------------|----------|
| **Faible** | Chambre pas conforme, retard mineur | 48h max | Excuses + geste commercial (bon de réduction 5-10%) | 5-10% remise prochaine résa | Non |
| **Moyenne** | Activité annulée, changement hébergement | 24h max | Remplacement OU remboursement partiel | Remboursement au prorata + geste 10% | Non |
| **Haute** | Problème sécurité, rapatriement nécessaire | Immédiat (< 2h) | Intervention Pack Sérénité (assistance 24h) + relogement | Pack Sérénité couvre | Oui → assureur |
| **Critique** | Accident, blessure, urgence médicale | Immédiat (< 30 min) | Urgences locales + **Pack Sérénité** (rapatriement sanitaire) + communication crise | Pack Sérénité couvre intégralement | Oui → assureur + APST si nécessaire |

**Process réclamation** :
1. Réception réclamation → accusé de réception automatique
2. Classification sévérité (PDG en Phase 1)
3. Contact prestataire concerné (dans les 24h)
4. Proposition solution au client (dans le délai de la sévérité)
5. Suivi résolution + archivage
6. Si sinistre Pack Sérénité → Process 4

### Process 4 — Sinistre Pack Sérénité (6 étapes)

| Étape | Action | Délai | Responsable |
|-------|--------|-------|-------------|
| 1 | Réception déclaration sinistre (site sinistre@eventylife.fr ou espace client) | J0 | Client |
| 2 | Vérification éligibilité Pack Sérénité | J0, < 4h | PDG + vérification auto backend |
| 3 | Transmission dossier à l'assureur | J0-J1 | PDG → email assureur |
| 4 | Collecte justificatifs (certificat médical, attestation police, billets) | J1-J5 | Client (upload espace client) |
| 5 | Suivi traitement assureur | J5-J30 | PDG (relance hebdomadaire) |
| 6 | Confirmation indemnisation au client | Variable (assureur) | PDG → email client |

**Délai légal déclaration sinistre** : 5 jours (Art. L.113-2 Code des assurances)
**Conservation données sinistre** : 5 ans (prescription assurance)

---

## KPIs — Objectifs par phase

| KPI | M1-M3 (lancement) | M4-M6 (croissance) | M7-M12 (stabilisation) |
|-----|-------------------|--------------------|-----------------------|
| Devis envoyés / semaine | 3-5 | 5-10 | 10-15 |
| Taux conversion devis → résa | 10-15% | 15-20% | 20-25% |
| Délai moyen envoi devis | < 48h | < 24h | < 12h |
| Nouveaux partenaires contactés / semaine | 5+ | 3-5 (qualité > quantité) | 2-3 (maintenance) |
| Réponse client < 24h | 95% | 98% | 100% |
| Note satisfaction post-voyage | > 3,5/5 | > 4/5 | > 4,2/5 |
| Trésorerie disponible | > 3 mois charges | > 4 mois charges | > 6 mois charges |
| Taux de réachat (client revient) | N/A | 5% | 10-15% |
| Uptime site | > 99% | > 99,5% | > 99,9% |
| Erreurs 500 / semaine | < 5 | < 2 | 0 |
| Nombre voyages réalisés / mois | 1-2 | 3-5 | 5-10 |
| CA mensuel | 5K-15K€ | 15K-40K€ | 40K-80K€ |

---

## Stack outils opérationnels — Phase 1

| Usage | Outil | Coût HT/mois | Indispensable |
|-------|-------|-------------|---------------|
| Email pro | Google Workspace Business Starter | 7€ | ✅ Oui |
| Banque pro | Qonto (Essentiel) | 9€ | ✅ Oui |
| Comptabilité | Pennylane (Essentiel) | 30€ | ✅ Oui |
| Paiement en ligne | Stripe | 0€ (commissions 1,4%+0,25€ par tx) | ✅ Oui |
| Email transactionnel | Brevo (Free, 300/jour) | 0€ | ✅ Oui |
| CRM / Gestion | Notion (Free ou Team 8€/mois) | 0-8€ | ✅ Oui |
| Design marketing | Canva Pro | 12€ | Recommandé |
| Réseaux sociaux | Buffer (Free, 3 comptes) | 0€ | Recommandé |
| Visio partenaires | Google Meet (inclus Workspace) | 0€ | ✅ Inclus |
| Monitoring site | UptimeRobot (Free, 50 monitors) | 0€ | ✅ Oui |
| Monitoring erreurs | Sentry (Developer, free) | 0€ | ✅ Oui |
| Hébergement | Scaleway (Phase 1) | ~25€ | ✅ Oui |
| **TOTAL outils** | | **~83-91€ HT/mois** | |

### Phase 2 — Outils supplémentaires (> 5 voyages/mois)

| Usage | Outil | Coût HT/mois |
|-------|-------|-------------|
| Brevo Starter (20K emails/mois) | Brevo | 9€ |
| Notion Team (collaboration) | Notion | 8€ |
| Canva Pro (templates avancés) | Canva | 12€ |
| Buffer Essentials (planification avancée) | Buffer | 6€ |
| Pennylane Standard | Pennylane | 50€ |
| **TOTAL supplémentaire Phase 2** | | **+35-85€/mois** |

---

## Automatisations backend — Gain de temps Phase 1

Le backend NestJS (29 modules, 290 477 lignes de code) automatise une grande partie des tâches opérationnelles :

| Module backend | Tâche automatisée | Temps économisé / semaine |
|----------------|-------------------|--------------------------|
| Module **Documents** | Génération devis PDF, factures, convocations | 3-4h |
| Module **Emails** | Emails transactionnels (confirmation, relance, rappel) | 2-3h |
| Module **Paiements** (Stripe) | Gestion acomptes, soldes, split payment, webhooks | 2-3h |
| Module **HRA** (Hébergement-Restauration-Activités) | Vérification disponibilité, calcul prix | 1-2h |
| Module **Pricing** | Calcul automatique marge + TVA marge + Pack Sérénité | 1-2h |
| Module **DSAR** | Gestion droits RGPD (accès, suppression, export) | 1h |
| Module **Cron jobs** | Suppression passeports J+30, relances auto, purges données | 2-3h |
| Module **Satisfaction** | Envoi enquêtes post-voyage, agrégation notes | 1h |
| Module **Admin** | Dashboard temps réel, alertes, KPIs | 2-3h |
| **TOTAL économisé** | | **15-21h/semaine** |

> **Sans ces automatisations**, il faudrait embaucher 1 personne supplémentaire dès le M1. Grâce au backend, le PDG peut gérer seul jusqu'à **5-8 voyages/mois** avant de recruter.

---

## Décisions PDG (05/03/2026)

- **10h/jour max** : Discipline de ne pas dépasser pour éviter le burnout en Phase 1
- **Devis < 24h** : C'est notre avantage compétitif vs agences traditionnelles (48-72h)
- **Pack Sérénité = argument n°1** dans chaque interaction client (devis, relance, confirmation)
- **Automatiser tout ce qui peut l'être** : Chaque tâche manuelle répétitive doit être remplacée par un module backend
- **KPIs hebdomadaires** : Remplir le tableau chaque vendredi — pas d'amélioration sans mesure
- **Pennylane dès J1** : Pas de retard sur la comptabilité, l'expert-comptable doit avoir accès dès le début
- **Scaleway monitoring** : Configurer les alertes Sentry + UptimeRobot AVANT le lancement, pas après
