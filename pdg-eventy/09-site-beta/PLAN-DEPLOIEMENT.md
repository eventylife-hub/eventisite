# Plan de Déploiement Technique — Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Objectif** : Passer du développement local à la production
> **Hébergeur retenu** : Scaleway (Paris, France) — données 100% françaises, conforme RGPD
> **Budget infra Phase 1** : ~25-50€ HT/mois

---

## Architecture cible — Scaleway (tout-en-un France)

```
                    ┌─────────────┐
                    │   Cloudflare │ (DNS + CDN + WAF + cache statique)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
    ┌──────────────┐          ┌──────────────┐
    │   Scaleway    │          │   Scaleway    │
    │   Container   │          │   DEV1-S      │
    │   (Frontend)  │          │   (Backend)   │
    │   Next.js 14  │◄────────►│   NestJS 10   │
    │   SSR + Static│   API    │   31 modules  │
    └──────────────┘          └──────┬───────┘
                                     │
                          ┌──────────┼──────────┐
                          ▼                     ▼
                ┌──────────────┐      ┌──────────────┐
                │  PostgreSQL   │      │    Redis      │
                │  Managé       │      │  Scaleway     │
                │  Scaleway     │      │  (ou Upstash) │
                │  (Paris DC2)  │      │               │
                └──────────────┘      └──────────────┘
                          │
                    ┌─────┴──────┐
                    │  S3 Object  │ (Stockage fichiers,
                    │  Storage    │  documents, backups)
                    │  Scaleway   │
                    └────────────┘
```

> **Pourquoi Scaleway** : Datacenter Paris (DC2/DC5), données 100% en France, RGPD by design, certifié ISO 27001/HDS, prix compétitifs, support en français. Pas de transfert hors UE pour l'hébergement.

---

## Phase 1 — Budget minimal (~25€ HT/mois)

| Service | Fournisseur | Plan | Coût HT/mois |
|---------|------------|------|-------------|
| Backend (NestJS) | Scaleway DEV1-M | 3 vCPU, 4 Go RAM, 25 Go Block | **~19,50€** (réel, OOM sur DEV1-S) |
| Frontend (Next.js) | Scaleway DEV1-S ou Container | 2 vCPU, 2 Go RAM | **6,42€** |
| BDD PostgreSQL | Scaleway Managed Database | DB-DEV-S (1 Go RAM, 10 Go) | **7,68€** |
| Redis (cache + sessions) | Upstash | Free tier (10K commandes/jour) | **0€** |
| Stockage S3 | Scaleway Object Storage | 75 Go inclus | **0€** (inclus) |
| DNS + CDN + WAF | Cloudflare | Free plan | **0€** |
| Email transactionnel | Brevo | Free (300 emails/jour) | **0€** |
| Monitoring erreurs | Sentry | Developer (free) | **0€** |
| Uptime monitoring | UptimeRobot | Free (50 monitors) | **0€** |
| Domaine eventylife.fr | Cloudflare Registrar | Renouvellement annuel | ~**2€/mois** amorti |
| SSL/TLS | Cloudflare / Let's Encrypt | Automatique | **0€** |
| **TOTAL Phase 1** | | | **~23-25€ HT/mois** |

## Phase 2 — Croissance (~80€ HT/mois)

Déclencheur : > 5 voyages/mois OU > 2 000 visiteurs/jour

| Service | Fournisseur | Plan | Coût HT/mois |
|---------|------------|------|-------------|
| Backend | Scaleway GP1-XS | 4 vCPU, 16 Go RAM | **21,42€** |
| Frontend | Scaleway Container ou DEV1-M | 3 vCPU, 4 Go RAM | **12,18€** |
| BDD PostgreSQL | Scaleway Managed DB | DB-GP-XS (2 Go RAM, 25 Go) | **24,84€** |
| Redis | Scaleway Managed Redis ou Upstash Pro | | **10€** |
| Stockage S3 | Scaleway Object Storage | 250 Go | **~3€** |
| Email transactionnel | Brevo Starter | 20K emails/mois | **9€** |
| CDN + WAF | Cloudflare Pro | WAF rules avancées | **0€** (Free suffisant) |
| Monitoring | Sentry Team | 50K events/mois | **0€** (free) |
| **TOTAL Phase 2** | | | **~80€ HT/mois** |

## Phase 3 — Scale (~200€ HT/mois)

Déclencheur : > 20 voyages/mois OU > 10 000 visiteurs/jour

| Service | Évolution |
|---------|----------|
| Backend | Scaleway GP1-S (8 vCPU, 32 Go) ou conteneurs avec auto-scaling |
| BDD | Scaleway HA (haute disponibilité, 2 nœuds) |
| Redis | Managed Redis dédié |
| CDN | Cloudflare Pro si nécessaire |
| Email | Brevo Business (100K/mois) |
| Monitoring | Sentry Business + alertes PagerDuty |

---

## Étapes de déploiement — Checklist

### Phase 1 — Infrastructure (Jour 1-2)

**1.1 Domaine et DNS**
- [ ] Vérifier propriété domaine eventylife.fr (Cloudflare Registrar)
- [ ] Configurer DNS Cloudflare : `A` record vers IP Scaleway backend
- [ ] Configurer CNAME : `api.eventylife.fr` → backend Scaleway
- [ ] Configurer CNAME : `www.eventylife.fr` → frontend Scaleway ou Cloudflare Pages
- [ ] Activer HTTPS automatique (Cloudflare + Let's Encrypt sur Scaleway)
- [ ] Configurer redirect `www` → `eventylife.fr` (ou inverse)
- [ ] Configurer sous-domaines emails : MX + SPF + DKIM + DMARC pour Brevo

**1.2 Base de données PostgreSQL**
- [ ] Créer instance PostgreSQL managé Scaleway (DB-DEV-S, Paris DC2)
- [ ] Configurer accès sécurisé (SSL obligatoire, IP whitelist Scaleway)
- [ ] Exécuter `npx prisma migrate deploy` en production
- [ ] Exécuter `npx prisma db seed` (données de base : rôles, paramètres, templates)
- [ ] Configurer backups automatiques (Scaleway : quotidien, rétention 7 jours par défaut → augmenter à 30)
- [ ] Tester restauration backup (dry run)

**1.3 Redis**
- [ ] Créer instance Upstash Redis (Free tier) ou Scaleway Managed Redis
- [ ] Configurer URL Redis dans les variables d'environnement
- [ ] Tester rate limiting (module `throttler` NestJS)
- [ ] Tester cache sessions (JWT refresh tokens)

**1.4 Stockage S3**
- [ ] Créer bucket Scaleway Object Storage (75 Go inclus)
- [ ] Configurer accès (API key + secret)
- [ ] Tester upload documents (factures PDF, pièces d'identité)
- [ ] Configurer politique de rétention (suppression auto des documents expirants — passeports J+30)

### Phase 2 — Backend NestJS (Jour 2-3)

**2.1 Variables d'environnement (CRITIQUES — ne jamais commiter)**
```env
# Base de données
DATABASE_URL=postgresql://user:pass@[scaleway-host]:5432/eventy?sslmode=require

# JWT
JWT_SECRET=[générer 64 chars aléatoires : openssl rand -hex 32]
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_[...]
STRIPE_WEBHOOK_SECRET=whsec_[...]
STRIPE_PUBLISHABLE_KEY=pk_live_[...]

# Email (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=[clé API Brevo]
SMTP_PASS=[clé API Brevo]
EMAIL_FROM=contact@eventylife.fr
EMAIL_SINISTRE=sinistre@eventylife.fr

# Redis
REDIS_URL=rediss://default:[pass]@[host]:6379

# Scaleway S3
S3_ACCESS_KEY=[access key]
S3_SECRET_KEY=[secret key]
S3_REGION=fr-par
S3_BUCKET=eventy-documents
S3_ENDPOINT=https://s3.fr-par.scw.cloud

# App
NODE_ENV=production
APP_URL=https://eventylife.fr
API_URL=https://api.eventylife.fr
CORS_ORIGINS=https://eventylife.fr,https://www.eventylife.fr
UPLOAD_MAX_SIZE=10485760

# Pack Sérénité
PACK_SERENITE_ENABLED=true
PACK_SERENITE_EMAIL=sinistre@eventylife.fr
```

**2.2 Déploiement backend sur Scaleway**
- [x] Provisionner instance DEV1-M (Scaleway Console) — `163.172.189.137` — 21/03/2026
- [x] Installer Node.js 20 LTS + PM2 (process manager) — via cloud-init
- [x] Cloner le repo GitHub (branche `main`) sur l'instance — via cloud-init
- [x] Installer les dépendances (`npm ci`) — via cloud-init (avec swap 2 Go + NODE_OPTIONS 3072)
- [x] Configurer PM2 (`pm2 start dist/main.js --name eventy-backend`) — via cloud-init
- [x] Configurer auto-restart PM2 au boot (`pm2 startup`) — via cloud-init
- [x] Configurer le reverse proxy Nginx (→ port 3000 NestJS) — via cloud-init
- [ ] Configurer Stripe webhook production : `POST https://api.eventylife.fr/webhooks/stripe`
- [ ] Vérifier healthcheck : `GET https://api.eventylife.fr/health`
- [ ] Configurer les cron jobs (suppression passeports J+30, relances email automatiques)

> **Alternative** : Déployer via Docker sur Scaleway Container Registry + Serverless Containers (plus simple à scaler mais légèrement plus cher).

### Phase 3 — Frontend Next.js (Jour 3-4)

**3.1 Déploiement frontend**
- [ ] Option A : Scaleway Container (hébergement statique + SSR)
- [ ] Option B : Cloudflare Pages (CDN mondial, gratuit, mais hors Scaleway)
- [ ] Configurer les variables d'env (`NEXT_PUBLIC_API_URL=https://api.eventylife.fr`, etc.)
- [ ] Lier le domaine eventylife.fr
- [ ] Vérifier build production + SSR/SSG OK
- [ ] Tester navigation complète (165+ pages, 100+ composants)
- [ ] Vérifier les images et assets (optimisation Next.js Image)

### Phase 4 — Sécurité (Jour 4-5)

- [ ] Activer Cloudflare WAF (règles basiques anti-bot, anti-DDoS)
- [ ] Vérifier rate limiting backend (module `throttler` — 10 req/15s par IP)
- [ ] Tester auth flow complet (inscription → login → refresh token → logout)
- [ ] Vérifier CORS (seuls `eventylife.fr` et `www.eventylife.fr` autorisés)
- [ ] Scanner sécurité : `npm audit` → corriger toutes les vulnérabilités critiques
- [ ] Tester les headers HTTP (securityheaders.com → objectif A+)
- [ ] Configurer CSP (Content Security Policy) stricte
- [ ] Vérifier que les données Stripe ne sont **jamais loguées** (ni en logs, ni en console)
- [ ] Vérifier hashage mots de passe : **Argon2id** (pas bcrypt)
- [ ] Vérifier que les pièces d'identité sont stockées chiffrées (AES-256) dans S3 Scaleway
- [ ] Tester la suppression automatique des passeports à J+30

### Phase 5 — Monitoring (Jour 5)

- [ ] Configurer Sentry (frontend + backend) — error tracking
- [ ] Configurer alertes email pour erreurs 500+ (Sentry → contact@eventylife.fr)
- [ ] Mettre en place UptimeRobot : surveiller `https://eventylife.fr` + `https://api.eventylife.fr/health`
- [ ] Configurer les cron jobs backend via PM2 ou système cron Linux
- [ ] Configurer les backups quotidiens PostgreSQL (vérifier rétention 30 jours)
- [ ] Mettre en place le monitoring Scaleway (CPU, RAM, disque, réseau)

### Phase 6 — Test final (Jour 5-7)

**Parcours utilisateur complet (smoke test)**
- [ ] Inscription nouveau client
- [ ] Recherche destination → sélection voyage
- [ ] Génération devis instantané (avec Pack Sérénité visible)
- [ ] Réservation → paiement acompte 30% (Stripe live, petit montant)
- [ ] Split payment → chaque participant paie sa part
- [ ] Réception email confirmation + récap Pack Sérénité
- [ ] Dashboard groupe → vérifier qui a payé

**Parcours PRO**
- [ ] Inscription partenaire (espace pro)
- [ ] Gestion des prestations (ajout, modification, prix)
- [ ] Réponse à une demande de disponibilité (bloc hôtel)

**Parcours ADMIN**
- [ ] Dashboard admin → gestion voyages → validation
- [ ] Génération facture PDF (TVA sur la marge, Pack Sérénité en ligne)
- [ ] Test module DSAR (export données personnelles)

**Tests techniques**
- [ ] Mobile responsive (iPhone, Android, tablette)
- [ ] Performance : Lighthouse > 80 sur toutes les pages clés
- [ ] Emails transactionnels (confirmation, facture, rappel, sinistre)
- [ ] Paiement Stripe mode live (CB + SEPA)
- [ ] Webhook Stripe (confirmation paiement → mise à jour réservation)
- [ ] 404 pages et gestion erreurs gracieuse

---

## Checklist Go/No-Go — Avant mise en production

| Critère | Type | Statut |
|---------|------|--------|
| **Immatriculation Atout France** | Obligatoire légal | [ ] |
| **RC Pro active** | Obligatoire légal | [ ] |
| **Garantie financière APST** | Obligatoire légal | [ ] |
| **Mentions légales publiées** | Obligatoire légal | [ ] |
| **CGV publiées** | Obligatoire légal | [ ] |
| **Politique confidentialité RGPD** | Obligatoire légal | [ ] |
| **Bandeau cookies fonctionnel** (Tarteaucitron.js) | Obligatoire légal | [ ] |
| **Pack Sérénité visible** sur le site | Business | [ ] |
| Paiement Stripe CB fonctionnel | Critique | [ ] |
| Paiement Stripe SEPA fonctionnel | Critique | [ ] |
| Split payment fonctionnel | Critique | [ ] |
| Emails transactionnels OK | Critique | [ ] |
| SSL/HTTPS partout (TLS 1.3) | Critique | [ ] |
| Backup BDD automatique (quotidien, 30 jours) | Critique | [ ] |
| Monitoring erreurs (Sentry) | Important | [ ] |
| Uptime monitoring (UptimeRobot) | Important | [ ] |
| Mobile responsive | Important | [ ] |
| Lighthouse > 80 | Souhaitable | [ ] |
| 3 300+ tests passants en CI | Souhaitable | [ ] |

---

## Post-déploiement

### Semaine 1 — Surveillance intensive
- Surveiller les logs Sentry **quotidiennement** (objectif : 0 erreur 500)
- Vérifier les paiements Stripe dans le dashboard (acomptes bien reçus)
- Répondre aux premiers contacts en moins de **2h** (impression première critique)
- Vérifier les emails transactionnels (délivrabilité, pas de spam)

### Semaine 2-4 — Stabilisation
- Analyser le trafic (Cloudflare Analytics + Google Analytics 4)
- Optimiser les pages lentes (> 3s au chargement)
- Corriger les bugs remontés par les premiers utilisateurs
- Premier voyage test → contenu photo/vidéo + premiers avis

### Mensuel — Maintenance
- Mise à jour dépendances (`npm audit fix` + mises à jour sécurité)
- Revue des coûts infrastructure (ajuster si sous/sur-provisionné)
- Backup test de restauration (dry run mensuel)
- Revue des métriques : uptime, temps de réponse API, taux d'erreur

---

## Décisions PDG

### 05/03/2026
- **Scaleway tout-en-un** : Hébergement, BDD, S3 — tout chez Scaleway France. Simplicité + conformité RGPD
- **Cloudflare DNS+CDN gratuit** : Performance mondiale pour le frontend, protection DDoS, WAF basique
- **Budget infra Phase 1 : ~25€ HT/mois** : Ultra-compétitif grâce à Scaleway
- **PM2 en Phase 1** : Simple et efficace pour gérer le processus Node.js. Migration vers Docker/conteneurs en Phase 2 si besoin

### 21/03/2026 — Décision : Tester AVANT de créer la société
- **Frontend** : ✅ Déjà déployé sur Vercel (eventylife.fr + www.eventylife.fr) — Build 14 READY
- **Backend** : 🔴 **À DÉPLOYER EN URGENCE** pour pouvoir tester le site complet
- **Approche "Test d'abord"** : Valider que le produit fonctionne (login, réservation, paiement Stripe test) AVANT d'investir dans la SAS + APST + RC Pro
- **Go/No-Go légal = bloquant pour VRAI lancement commercial** (pas pour les tests internes)
- **Options backend rapide** : Railway (~5€/mois) + Neon PostgreSQL (gratuit) OU Scaleway directement

### 21/03/2026 — Déploiement Backend Scaleway DEV1-M
- **Tentative 1 (DEV1-S, 2 Go RAM)** : ❌ ÉCHEC — OOM pendant `npm run build` (projet trop gros pour 2 Go)
- **Tentative 2 (DEV1-S natif, sans Docker)** : ❌ ÉCHEC — même problème OOM après 20+ min
- **Tentative 3 (DEV1-M, 4 Go RAM)** : ❌ ÉCHEC — PostgreSQL absent du cloud-init, NestJS crashe au démarrage (pas de BDD). Instance supprimée.
- **Tentative 4 (DEV1-M, 4 Go RAM, cloud-init COMPLET)** : 🔄 EN COURS — serveur up (Nginx répond), build NestJS en cours (35+ min, projet 300K+ lignes). Vérifier avec `ssh root@163.172.189.137` puis `tail -50 /var/log/eventy-deploy.log`
  - **Instance** : `eventy-backend` — DEV1-M (3 vCPU, 4 Go RAM, 300 Mbps)
  - **IP publique** : `163.172.189.137`
  - **Instance ID** : `6533166a-8396-4558-a955-8b49902e8989`
  - **Zone** : fr-par-1 (Paris)
  - **Image** : Ubuntu 24.04 Noble Numbat
  - **Stockage** : Block Storage 5K — 25 Go
  - **SSH** : `ssh root@163.172.189.137`
  - **Coût** : €0.02675/h (~€19.50/mois)
  - **Cloud-init V2 COMPLET** : PostgreSQL + Node.js 20 + PM2 + Nginx + Redis + swap 2 Go + clone GitHub + npm ci + prisma generate + build NestJS + prisma migrate deploy + démarrage PM2 + JWT secret auto-généré
  - **NODE_OPTIONS** : `--max-old-space-size=3072` (heap 3 Go pour le build)
  - **Log déploiement** : `/var/log/eventy-deploy.log`
  - **DB user** : `eventy` / **DB name** : `eventy`
  - **Vérification** : `curl http://163.172.189.137/api/health`
