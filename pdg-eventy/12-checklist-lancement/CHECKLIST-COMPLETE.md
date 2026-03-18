# Checklist Complète de Lancement — Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Phase actuelle** : Pré-création — Préparation des dossiers
> **Objectif** : Lancement en production en 8-12 semaines
> **Domaine** : eventylife.fr
> Cocher chaque item au fur et à mesure. Ordre recommandé de haut en bas.

---

## PHASE 1 — Création juridique (Semaine 1-2)

### Société
- [ ] Choisir un avocat droit du tourisme (voir CHECKLIST-AVOCAT.md — budget pack 3 000€-5 000€)
- [ ] Rédiger les statuts SAS personnalisés (objet social large : agence voyages + plateforme + intermédiation assurance)
- [ ] Définir le capital social : **5 000€** (libération 50% à la création, solde sous 5 ans)
- [ ] Ouvrir un compte de dépôt de capital (Qonto : dépôt en ligne 0€)
- [ ] Déposer le capital social (2 500€ minimum à la création)
- [ ] Publier l'annonce légale (JAL) — coût ~150€ - 200€
- [ ] Déposer le dossier au greffe via Inpi.fr (guichet unique) — coût ~66€
- [ ] Recevoir le Kbis (délai ~1-2 semaines)
- [ ] Obtenir le numéro SIRET
- [ ] Inscrire l'activité : Code APE **7911Z** (activités des agences de voyages)

### Compte bancaire professionnel
- [ ] Ouvrir le compte pro Qonto (Essentiel 9€/mois) — dépôt capital inclus
- [ ] Commander la carte bancaire professionnelle
- [ ] Configurer les virements SEPA fournisseurs
- [ ] Connecter Qonto à Pennylane (rapprochement bancaire automatique)
- [ ] Créer le compte Stripe (CB + SEPA) — lier au compte Qonto

### Expert-comptable
- [ ] Choisir l'expert-comptable (spécialisé tourisme + TVA sur la marge)
- [ ] Signer la lettre de mission (~165€-300€ HT/mois)
- [ ] Configurer Pennylane (accès comptable dès J1)
- [ ] Valider le régime fiscal : IS (taux réduit 15% jusqu'à 42 500€ de bénéfice)
- [ ] Confirmer l'application de la TVA sur la marge (Art. 266-1-b du CGI)

---

## PHASE 2 — Obligations agence de voyages (Semaine 2-4)

### Garantie financière APST
- [ ] Contacter l'APST (info@apst.travel) — **email template prêt** dans EMAILS-ADMINISTRATIF.md
- [ ] Préparer le dossier de candidature (Kbis, statuts, business plan, prévisionnel, attestation RC Pro)
- [ ] Fournir le PITCH-BANQUE.md comme base du dossier
- [ ] Constituer la contre-garantie si demandée (~10 000€ — nantissement ou caution bancaire)
- [ ] Soumettre le dossier + passage en commission
- [ ] Obtenir l'attestation de garantie financière APST
- [ ] Payer la cotisation annuelle (~2 100€/an)

### RC Pro (Responsabilité Civile Professionnelle)
- [ ] Demander devis sur CMB Assurances (agréé Atout France), Hiscox, Orus, Coover, Assurup
- [ ] Comparer : prix (cible 780€-1 200€/an), franchise, plafonds, exclusions
- [ ] Argument Pack Sérénité : "100% des voyageurs assurés → risque sinistre réduit pour la RC Pro"
- [ ] Souscrire le contrat RC Pro (minimum légal : 500 000€)
- [ ] Obtenir l'attestation RC Pro (nécessaire pour Atout France)

### Pack Sérénité — Assureur voyage
- [ ] Contacter Mutuaide (Groupama), Europ Assistance, Allianz Travel, Chapka, AXA Partners
- [ ] Négocier le tarif contrat groupe annuel (cible : 2-3% du prix voyage)
- [ ] Argument : 100% souscription (pas d'anti-sélection), profil bas risque, volume 500-5 000/an
- [ ] Valider les garanties : annulation toutes causes 100%, rapatriement frais réels, assistance 24h, bagages 1 500€, frais médicaux 50 000€, RC voyage 500 000€
- [ ] Vérifier si immatriculation ORIAS (IAS) nécessaire — question prioritaire pour l'avocat
- [ ] Signer le contrat groupe annuel
- [ ] Intégrer les conditions Pack Sérénité dans les CGV et le site

### Immatriculation Atout France
- [ ] Vérifier la capacité professionnelle (options : licence pro tourisme, expérience 1 an, VAE)
- [ ] Préparer le dossier complet (cf. IMMATRICULATION-ATOUT-FRANCE.md)
- [ ] Joindre : Kbis, attestation garantie APST, attestation RC Pro, justificatif capacité pro
- [ ] Déposer le dossier sur teleservices.atout-france.fr (frais ~100€)
- [ ] Attendre la validation (~1 mois)
- [ ] Recevoir le numéro **IM0XXXXX**
- [ ] Afficher le numéro sur le site (footer, CGV, factures, devis, emails)

---

## PHASE 3 — Juridique & conformité (Semaine 3-6, en parallèle)

### CGV / CGU / Documents juridiques
- [ ] Fournir les templates enrichis à l'avocat (CGV-TEMPLATE.md, CONTRAT-PARTENAIRE-TYPE.md, MENTIONS-LEGALES.md) — économie 30-50%
- [ ] Faire valider les CGV conformes au Code du Tourisme (Art. L.211-1 à L.211-18)
- [ ] Inclure la fiche d'information standardisée (directive UE 2015/2302)
- [ ] Inclure les mentions Pack Sérénité dans les CGV
- [ ] Inclure le barème d'annulation progressif
- [ ] Inclure la clause split payment (responsabilité solidaire ou organisateur seul ?)
- [ ] Faire rédiger les CGU de la plateforme eventylife.fr
- [ ] Faire rédiger les mentions légales complètes (LCEN + Code du Tourisme)
- [ ] Faire rédiger la politique de confidentialité RGPD
- [ ] Faire rédiger le contrat-cadre partenaire (à partir de CONTRAT-PARTENAIRE-TYPE.md)
- [ ] Faire rédiger le DPA sous-traitants (Stripe, Scaleway, Brevo, assureur)
- [ ] Vérifier la clause médiation MTV (Médiation Tourisme et Voyage)
- [ ] Publier tous les documents juridiques sur eventylife.fr

### RGPD
- [x] Nommer le responsable de traitement : David, PDG
- [x] Rédiger le registre des traitements (RGPD-CONFORMITE.md)
- [x] Développer le module DSAR backend (accès, rectification, suppression, portabilité)
- [ ] Configurer Tarteaucitron.js (bandeau cookies opt-in, consentement granulaire)
- [ ] Signer les DPA avec sous-traitants (Stripe, Scaleway, Brevo, assureur Pack Sérénité)
- [x] Configurer la suppression automatique des passeports J+30 (cron job backend)
- [x] Configurer la suppression automatique des données de santé fin voyage +30j
- [ ] Réaliser l'AIPD (Analyse d'Impact) si données de santé traitées — valider avec l'avocat

---

## PHASE 4 — Tech & déploiement (Semaine 3-6, en parallèle)

### Infrastructure Scaleway (tout France, RGPD compliant)
- [ ] Créer le compte Scaleway (Paris DC2)
- [ ] Provisionner DEV1-S backend (2 vCPU, 2 Go RAM — 6,42€/mois)
- [ ] Configurer PostgreSQL managé (DB-DEV-S — 7,68€/mois)
- [ ] Configurer Object Storage S3 (75 Go inclus — 0€)
- [ ] Configurer Upstash Redis (Free tier — 10K commandes/jour)
- [ ] Configurer le domaine **eventylife.fr** (DNS Cloudflare)
- [ ] Configurer CNAME : api.eventylife.fr → backend Scaleway
- [ ] Activer HTTPS (Cloudflare + Let's Encrypt — TLS 1.3)
- [ ] Configurer les headers sécurité (CORS, CSP strict, HSTS)
- [ ] Activer le rate limiting (10 req/15s par IP — module throttler NestJS)
- [ ] Configurer Cloudflare (CDN + WAF + anti-DDoS)

### Backend NestJS
- [ ] Déployer le backend sur Scaleway (Node.js 20 LTS + PM2)
- [ ] Configurer toutes les variables d'environnement (cf. PLAN-DEPLOIEMENT.md)
- [ ] Exécuter `npx prisma migrate deploy` en production
- [ ] Configurer PM2 (auto-restart, logs, monitoring)
- [ ] Configurer Nginx reverse proxy (→ port 3000)
- [ ] Configurer le webhook Stripe production
- [ ] Vérifier healthcheck : `GET https://api.eventylife.fr/health`
- [ ] Configurer les cron jobs (suppression passeports, relances auto, purges)

### Frontend Next.js
- [ ] Déployer le frontend (Scaleway Container ou Cloudflare Pages)
- [ ] Configurer les variables d'env (`NEXT_PUBLIC_API_URL=https://api.eventylife.fr`)
- [ ] Vérifier build production + SSR/SSG OK
- [ ] Tester les 134 pages + 134 composants (MAJ 18/03 — chiffres corrigés)
- [ ] Vérifier mobile responsive
- [x] App Admin PWA standalone créée (1 566 lignes, 20 pages, Chart.js, dark mode) — 17/03/2026
- [x] App Pro PWA standalone créée (771 lignes, 15 pages, Chart.js, dark mode) — 18/03/2026
- [x] Checklist déploiement Jour J créée (DEPLOY-CHECKLIST-JOUR-J.md) — 18/03/2026
- [x] Audit sécurité backend réalisé (AUDIT-SECURITE-2026-03-18.md) — 18/03/2026

### CI/CD
- [x] Repo GitHub existant avec 4 workflows GitHub Actions
- [ ] Configurer les environnements (staging + production)
- [ ] Configurer les secrets GitHub (DATABASE_URL, STRIPE keys, etc.)
- [ ] Mettre en place les backups automatiques DB (quotidien, rétention 30 jours)

### Corrections pre-production
- [ ] Corriger les 5 tests setAvatar
- [ ] Exécuter `npm audit` et corriger les vulnérabilités critiques
- [ ] Vérifier tous les endpoints admin protégés
- [ ] Vérifier hashage mots de passe : **Argon2id** (pas bcrypt)
- [ ] Vérifier chiffrement documents S3 : **AES-256**
- [ ] Tester la suppression automatique des passeports J+30
- [ ] Tester les webhooks Stripe en mode live

### Email
- [ ] Configurer Google Workspace (contact@eventylife.fr, sinistre@eventylife.fr, comptabilite@eventylife.fr) — 7€/mois
- [ ] Configurer Brevo (emails transactionnels — Free 300/jour)
- [ ] Configurer SPF + DKIM + DMARC pour eventylife.fr
- [ ] Tester tous les emails : confirmation, devis, facture, relance, sinistre, satisfaction

### Monitoring
- [ ] Configurer UptimeRobot : eventylife.fr + api.eventylife.fr/health
- [ ] Configurer Sentry (frontend + backend) — alertes email erreurs 500+
- [ ] Configurer les alertes email → contact@eventylife.fr

---

## PHASE 5 — Partenaires (Semaine 4-8, en parallèle)

### Prospection — Objectif : 100 contacts → 14+ contrats signés
- [ ] Identifier 10 hébergements cibles (5 régions : Provence, Dordogne, Pays Basque, Normandie, Ardèche)
- [ ] Identifier 10 prestataires activités cibles
- [ ] Identifier 5 autocaristes/transporteurs
- [ ] Identifier 5 restaurants/traiteurs partenaires
- [ ] Envoyer les emails de premier contact (templates EMAILS-PARTENAIRES.md — 9 templates prêts)
- [ ] Relancer à J+7 si pas de réponse (template relance prêt)
- [ ] Programmer les appels / visites (RDV 15 min)

### Négociation — Leviers : volume 500-5 000/an + Pack Sérénité + auto-entrepreneurs
- [ ] Obtenir les grilles tarifaires (remise 8-15% selon volume)
- [ ] Négocier les conditions (paiement J+30, annulation flexible, privatisation)
- [ ] Signer les contrats-cadre partenaires (CONTRAT-PARTENAIRE-TYPE.md validé par avocat)
- [ ] Intégrer les prestataires dans le module HRA backend
- [ ] Créer les fiches partenaires sur eventylife.fr

---

## PHASE 6 — Marketing (Semaine 4-8, en parallèle)

### Présence en ligne
- [ ] Créer la page Instagram **@eventylife.fr**
- [ ] Créer la page LinkedIn **Eventy**
- [ ] Créer la page Facebook **Eventy**
- [ ] Revendiquer la fiche Google Business Profile
- [ ] Créer le profil TripAdvisor
- [ ] Créer le profil Trustpilot

### Contenu
- [x] Rédiger 10 articles SEO fondation — **FAIT** 18/03 (`marketing/articles-seo/` — 10 articles .md)
- [x] Préparer 20 posts réseaux sociaux — **FAIT** 18/03 (`marketing/posts-sociaux/POSTS-RESEAUX-SOCIAUX.md`)
- [ ] Créer les visuels de lancement (Canva Pro — 12€/mois)
- [x] Rédiger le communiqué de presse lancement — **FAIT** 18/03 (`marketing/communique-presse/`)
- [x] Créer la landing page Pack Sérénité — **FAIT** 18/03 (`marketing/landing-pages/pack-serenite.html`)
- [x] Créer le pitch deck investisseur — **FAIT** 18/03 (`marketing/PITCH-DECK-EVENTY.html` — 10 slides interactif)
- [x] Créer 8 templates emails HTML transactionnels — **FAIT** 18/03 (`marketing/emails-html/` — 8 fichiers)
- [x] Créer le manifeste fondateur AME-EVENTY.md — **FAIT** 18/03 (racine projet)

### Publicité (budget lancement : 500€-1 000€/mois)
- [ ] Créer le compte Google Ads
- [ ] Préparer les campagnes (mots-clés : "voyage groupe", "team building", "EVG/EVJF")
- [ ] Créer les landing pages de conversion (devis gratuit en 24h)
- [ ] Configurer Google Analytics 4 + pixel de suivi
- [ ] Planifier les publications Buffer (gratuit — 3 comptes)

---

## PHASE 7 — Pré-lancement (Semaine 7-8)

### Tests fonctionnels (smoke test complet)
- [ ] Parcours client : inscription → recherche → devis → paiement acompte 30% → split payment → confirmation
- [ ] Parcours pro : inscription partenaire → listing prestations → réponse disponibilité → dashboard réservations
- [ ] Parcours admin : dashboard → gestion voyages → génération facture (TVA marge) → module DSAR
- [ ] Paiement Stripe live : CB (petit montant test) + SEPA
- [ ] Split payment : chaque participant paie sa part
- [ ] Pack Sérénité visible sur le devis, la confirmation, l'espace client
- [ ] Emails transactionnels OK (confirmation, facture, rappel, sinistre)

### Vérifications conformité
- [ ] Numéro Atout France affiché (site + CGV + factures + emails)
- [ ] CGV publiées et accessibles
- [ ] Mentions légales publiées
- [ ] Politique de confidentialité publiée
- [ ] Bandeau cookies fonctionnel (Tarteaucitron.js)
- [ ] Pack Sérénité : conditions complètes accessibles en ligne

### Tests utilisateurs
- [ ] Faire tester par 3-5 personnes extérieures (amis, famille, contacts)
- [ ] Corriger les bugs remontés
- [ ] Vérifier l'affichage mobile responsive (iPhone, Android, tablette)
- [ ] Lighthouse > 80 sur toutes les pages clés
- [ ] Scanner sécurité : securityheaders.com → objectif A+

---

## PHASE 8 — LANCEMENT (Semaine 8-12)

- [ ] Publier le site en production (eventylife.fr)
- [ ] Activer les paiements Stripe en mode live
- [ ] Publier le communiqué de presse
- [ ] Lancer les campagnes Google Ads (budget 500€-1 000€/mois)
- [ ] Publier sur les réseaux sociaux (Instagram, LinkedIn, Facebook)
- [ ] Envoyer les emails de lancement (réseau personnel + partenaires)
- [ ] Proposer l'offre de lancement aux premiers clients (-10% early bird)
- [ ] Préparer le premier voyage test (gratuit ou à prix coûtant → contenu photo/vidéo + premiers avis)
- [ ] Surveiller le monitoring 24h/24 les 3 premiers jours (Sentry + UptimeRobot)

---

## POST-LANCEMENT (M+1 à M+3)

- [ ] Analyser les KPIs hebdomadaires (remplir le tableau PROCESS-QUOTIDIEN.md chaque vendredi)
- [ ] Recueillir les premiers avis clients (Google, TripAdvisor, Trustpilot)
- [ ] Ajuster les prix si nécessaire (grille tarifaire dans GRILLE-TARIFAIRE.md)
- [ ] Développer le réseau de partenaires (objectif M3 : 14+ actifs)
- [ ] Planifier les voyages du mois suivant
- [ ] Point mensuel avec l'expert-comptable (TVA marge, trésorerie)
- [ ] Préparer le recrutement Phase 2 (coordinateur terrain M6-M12 — voir ORGANIGRAMME.md)
- [ ] Réactiver le réseau auto-entrepreneurs Phase 2 (commissions sur recommandations)

---

## Récapitulatif des documents PDG préparés

> Tous les documents ci-dessous sont enrichis avec les données réelles 2026, les coûts vérifiés, le Pack Sérénité intégré, et les leviers de négociation.

| Document | Statut | Localisation |
|----------|--------|-------------|
| Structure juridique SAS | ✅ Enrichi | `01-legal/STRUCTURE-JURIDIQUE.md` |
| Immatriculation Atout France | ✅ Enrichi | `01-legal/IMMATRICULATION-ATOUT-FRANCE.md` |
| CGV Template | ✅ Enrichi (validation avocat requise) | `01-legal/CGV-TEMPLATE.md` |
| Contrat partenaire type | ✅ Enrichi (validation avocat requise) | `01-legal/CONTRAT-PARTENAIRE-TYPE.md` |
| Mentions légales | ✅ Enrichi | `01-legal/MENTIONS-LEGALES.md` |
| RGPD Conformité | ✅ Enrichi | `01-legal/RGPD-CONFORMITE.md` |
| Checklist avocat | ✅ Enrichi (13 questions, cabinets, budget) | `01-legal/CHECKLIST-AVOCAT.md` |
| Budget prévisionnel | ✅ Enrichi (3 scénarios réels) | `02-finance/BUDGET-PREVISIONNEL.md` |
| Plan trésorerie | ✅ Enrichi (M0-M12 réel) | `02-finance/PLAN-TRESORERIE.md` |
| Grille tarifaire | ✅ Enrichi | `02-finance/GRILLE-TARIFAIRE.md` |
| Comparatif transport | ✅ Enrichi (prestataires réels) | `03-transport/COMPARATIF-TRANSPORT.md` |
| Comparatif cloud | ✅ Enrichi (tarifs 2026) | `04-hebergement-infra/COMPARATIF-CLOUD.md` |
| Stratégie partenaires | ✅ Enrichi (leviers négo + assureurs) | `05-partenaires/STRATEGIE-PARTENAIRES.md` |
| Suivi partenaires | ✅ Enrichi (dashboard + workflow) | `05-partenaires/SUIVI-PARTENAIRES.md` |
| Organigramme | ✅ Enrichi (coûts salariaux réels) | `06-rh-organisation/ORGANIGRAMME.md` |
| Plan lancement marketing | ✅ Enrichi (budget réel + KPIs) | `07-marketing-commercial/PLAN-LANCEMENT.md` |
| Garantie financière APST | ✅ Enrichi | `08-assurance-conformite/GARANTIE-FINANCIERE.md` |
| RC Pro | ✅ Enrichi | `08-assurance-conformite/RC-PRO.md` |
| Plan déploiement | ✅ Enrichi (Scaleway + checklist Go/No-Go) | `09-site-beta/PLAN-DEPLOIEMENT.md` |
| Process quotidien | ✅ Enrichi (routines + KPIs + automatisations) | `10-operations/PROCESS-QUOTIDIEN.md` |
| Emails partenaires | ✅ Enrichi (9 templates) | `11-templates-emails/EMAILS-PARTENAIRES.md` |
| Emails clients | ✅ Enrichi (10 templates) | `11-templates-emails/EMAILS-CLIENTS.md` |
| Emails administratif | ✅ Enrichi (7 templates) | `11-templates-emails/EMAILS-ADMINISTRATIF.md` |
| Guide comptable TVA marge | ✅ Enrichi | `13-comptabilite/GUIDE-COMPTABLE.md` |
| Modèle facture | ✅ Enrichi (exemple concret) | `13-comptabilite/MODELE-FACTURE.md` |
| Pitch banque | ✅ Enrichi (chiffres réels) | `14-pitch/PITCH-BANQUE.md` |

---

## Décisions PDG (05/03/2026)

- **Tous les documents PDG sont enrichis** avec données réelles 2026, Pack Sérénité intégré, leviers de négociation (volume, auto-entrepreneurs, plateforme tech)
- **Templates emails prêts** : 26 templates total (9 partenaires + 10 clients + 7 administratifs) — tous avec domaine eventylife.fr et Pack Sérénité
- **Prochain steps immédiats** : Envoyer les 6 brouillons Gmail (APST, CMB, Hiscox, Chevalier Conseil, Nexco, Mutuaide) puis relancer sous 7 jours
- **Score minimum 3,5/5** pour tout partenaire — aucun compromis sur la qualité
- **Go/No-Go légal = bloquant** : Pas de mise en production sans Atout France + APST + RC Pro + CGV publiées
