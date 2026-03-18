# Guide de déploiement production — Eventy Life

> **Durée estimée** : 1h30 (première fois) / 10min (mises à jour)
> **Cible** : Scaleway DEV1-S (2 vCPU, 2GB RAM, 20GB SSD) — ~12€/mois
> **Date** : 17 mars 2026

---

## Prérequis

- Compte Scaleway avec carte de crédit
- Nom de domaine `eventylife.fr` configuré
- Compte Stripe avec clé live
- Compte email transactionnel (Resend ou Brevo)
- SSH clé publique/privée

---

## Étape 1 — Provisionner l'instance Scaleway (15 min)

### 1.1 Créer l'instance

1. Console Scaleway → Instances → Créer une instance
2. Choisir : **DEV1-S** (2 vCPU, 2GB RAM, 20GB SSD local)
3. Image : **Ubuntu 22.04 Jammy**
4. Ajouter votre clé SSH
5. Nom : `eventy-prod-01`
6. Créer

### 1.2 Configurer le DNS

Dans le gestionnaire de votre domaine (OVH, Gandi, etc.) :

```
eventylife.fr        A    → IP_DE_L_INSTANCE
www.eventylife.fr    CNAME → eventylife.fr
api.eventylife.fr    A    → IP_DE_L_INSTANCE
```

### 1.3 Première connexion

```bash
ssh root@IP_DE_L_INSTANCE

# Mises à jour
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y

# Vérifier
docker --version
docker compose version
```

---

## Étape 2 — Déployer le code (10 min)

### 2.1 Cloner le repo

```bash
cd /opt
git clone https://github.com/votre-repo/eventisite.git eventy
cd eventy
```

### 2.2 Remplir .env.production

```bash
cp backend/.env.production.example backend/.env.production
nano backend/.env.production
```

Variables critiques à remplir :

| Variable | Où la trouver |
|----------|--------------|
| `DATABASE_URL` | Scaleway Managed DB (ou local PostgreSQL) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Signing secret |
| `JWT_SECRET` | Générer : `openssl rand -base64 64` (>= 32 chars, OBLIGATOIRE) |
| `JWT_REFRESH_SECRET` | Générer : `openssl rand -base64 64` (>= 32 chars, OBLIGATOIRE) |
| `TOTP_ENCRYPTION_KEY` | Générer : `openssl rand -base64 48` (>= 32 chars, OBLIGATOIRE pour 2FA) |
| `CORS_ORIGINS` | `https://www.eventylife.fr,https://eventylife.fr` (OBLIGATOIRE en prod) |
| `EMAIL_API_KEY` | Resend ou Brevo API key |
| `FRONTEND_URL` | `https://eventylife.fr` |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | Scaleway Object Storage |
| `SENTRY_DSN` | Sentry → Project → DSN |
| `ADMIN_ALERT_EMAIL` | Email admin pour recevoir les alertes webhook |

**Post-déploiement — Migration TOTP (si des utilisateurs ont activé le 2FA avant la session 145) :**
```bash
cd /opt/eventy/backend
npx ts-node scripts/migrate-totp-secrets.ts
```

### 2.3 Base de données

Option A — **Scaleway Managed Database** (recommandé, ~7€/mois) :
1. Scaleway Console → Databases → Créer
2. Type : PostgreSQL 15, plan : DB-DEV-S
3. Copier l'URL de connexion dans `DATABASE_URL`

Option B — **PostgreSQL local** (pour économiser) :
```bash
apt install postgresql postgresql-contrib -y
sudo -u postgres createuser eventy
sudo -u postgres createdb eventydb -O eventy
sudo -u postgres psql -c "ALTER USER eventy PASSWORD 'MOT_DE_PASSE_FORT';"
```
→ `DATABASE_URL=postgresql://eventy:MOT_DE_PASSE_FORT@localhost:5432/eventydb`

---

## Étape 3 — SSL avec Let's Encrypt (10 min)

```bash
apt install certbot -y

# Certificats (domaine principal + API)
certbot certonly --standalone -d eventylife.fr -d www.eventylife.fr
certbot certonly --standalone -d api.eventylife.fr

# Copier dans la structure nginx
mkdir -p nginx/certs/eventylife.fr nginx/certs/api.eventylife.fr
cp /etc/letsencrypt/live/eventylife.fr/fullchain.pem nginx/certs/eventylife.fr/
cp /etc/letsencrypt/live/eventylife.fr/privkey.pem nginx/certs/eventylife.fr/
cp /etc/letsencrypt/live/api.eventylife.fr/fullchain.pem nginx/certs/api.eventylife.fr/
cp /etc/letsencrypt/live/api.eventylife.fr/privkey.pem nginx/certs/api.eventylife.fr/

# Renouvellement automatique
echo "0 0 * * 0 certbot renew --quiet && cp /etc/letsencrypt/live/eventylife.fr/* nginx/certs/eventylife.fr/ && cp /etc/letsencrypt/live/api.eventylife.fr/* nginx/certs/api.eventylife.fr/ && docker compose -f docker-compose.prod.yml restart nginx" | crontab -
```

---

## Étape 4 — Premier déploiement (10 min)

```bash
cd /opt/eventy

# Lancer le déploiement complet
chmod +x deploy.sh
./deploy.sh
```

Le script va :
1. Vérifier les prérequis
2. Sauvegarder (première fois = rien à sauvegarder)
3. Builder les images Docker
4. Exécuter les migrations Prisma
5. Démarrer les services
6. Vérifier la santé

### Vérifier

```bash
# Statut des services
./deploy.sh --status

# Health check API
curl https://api.eventylife.fr/api/health

# Logs
docker compose -f docker-compose.prod.yml logs -f app
```

---

## Étape 5 — Configurer Stripe webhook (5 min)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL : `https://api.eventylife.fr/api/payments/webhook`
3. Events à écouter :
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`
4. Copier le **Signing secret** → mettre dans `STRIPE_WEBHOOK_SECRET`
5. Redémarrer le backend : `./deploy.sh --backend-only`

---

## Étape 6 — Seed staging (optionnel, 5 min)

```bash
docker compose -f docker-compose.prod.yml exec app \
  npx ts-node prisma/seed-staging.ts
```

Crée 8 utilisateurs de test avec des voyages et réservations réalistes.

---

## Étape 7 — Smoke test k6 (10 min)

```bash
# Installer k6 (sur votre machine locale, pas le serveur)
# macOS: brew install k6
# Linux: apt install k6

# Smoke test
k6 run --env BASE_URL=https://api.eventylife.fr \
       --env PROFILE=smoke \
       backend/k6/scenarios/api-endpoints.js

# Test checkout flow
k6 run --env BASE_URL=https://api.eventylife.fr \
       --env PROFILE=smoke \
       backend/k6/scenarios/checkout-flow.js
```

---

## Commandes utiles

| Action | Commande |
|--------|----------|
| Déploiement complet | `./deploy.sh` |
| Backend seul | `./deploy.sh --backend-only` |
| Frontend seul | `./deploy.sh --frontend-only` |
| Migrations seules | `./deploy.sh --migrate` |
| Rollback | `./deploy.sh --rollback` |
| Statut | `./deploy.sh --status` |
| Logs backend | `docker compose -f docker-compose.prod.yml logs -f app` |
| Logs frontend | `docker compose -f docker-compose.prod.yml logs -f frontend` |
| Shell backend | `docker compose -f docker-compose.prod.yml exec app sh` |
| Restart tout | `docker compose -f docker-compose.prod.yml restart` |

---

## Monitoring post-déploiement

Le backend inclut un système de monitoring automatique :

- **Toutes les 30 min** : Surveillance système (CRON échoués, emails dead letter, paiements bloqués)
- **Tous les jours à 7h** : Rapport quotidien (CA, réservations, utilisateurs, tickets)
- **Alertes par email** : Envoyées à `ADMIN_ALERT_EMAIL` (à configurer dans .env)

Pour configurer l'email d'alerte admin :
```
ADMIN_ALERT_EMAIL=david@eventylife.fr
```

---

## Coûts mensuels estimés

| Service | Coût/mois |
|---------|-----------|
| Scaleway DEV1-S | ~12€ |
| Managed DB (optionnel) | ~7€ |
| Domaine .fr | ~1€ |
| Email transactionnel | 0€ (tier gratuit Resend) |
| Sentry | 0€ (tier gratuit) |
| **TOTAL** | **~13-20€/mois** |

---

## Étape 8 — Configurer backups et maintenance (5 min)

```bash
# Installer les CRON de backup et maintenance
crontab -e

# Ajouter ces lignes :
# Backup DB quotidien 3h
0 3 * * * /opt/eventy/scripts/backup-db.sh >> /var/log/eventy-backup.log 2>&1
# Backup DB hebdomadaire dimanche 4h
0 4 * * 0 /opt/eventy/scripts/backup-db.sh --weekly >> /var/log/eventy-backup.log 2>&1
# Backup DB mensuel 1er du mois 5h
0 5 1 * * /opt/eventy/scripts/backup-db.sh --monthly >> /var/log/eventy-backup.log 2>&1
# Maintenance DB hebdomadaire dimanche 2h
0 2 * * 0 /opt/eventy/scripts/maintenance-db.sh >> /var/log/eventy-maintenance.log 2>&1
# Renouvellement SSL dimanche minuit
0 0 * * 0 certbot renew --quiet && cp /etc/letsencrypt/live/eventylife.fr/* /opt/eventy/nginx/certs/eventylife.fr/ && cp /etc/letsencrypt/live/api.eventylife.fr/* /opt/eventy/nginx/certs/api.eventylife.fr/ && docker compose -f /opt/eventy/docker-compose.prod.yml restart nginx

# Configurer logrotate
sudo ./scripts/setup-logrotate.sh
```

---

## Checklist première mise en production

- [ ] Instance Scaleway provisionnée
- [ ] DNS configuré (A records)
- [ ] Docker installé
- [ ] Code cloné dans `/opt/eventy`
- [ ] `.env.production` rempli
- [ ] Base de données créée + migrée
- [ ] Certificats SSL installés
- [ ] `./deploy.sh` exécuté avec succès
- [ ] Health check OK (`/api/health`)
- [ ] Webhook Stripe configuré
- [ ] Email admin monitoring configuré
- [ ] Smoke test k6 passé
- [ ] Première connexion admin testée
- [ ] CRON backups configurés (étape 8)
- [ ] Logrotate configuré
