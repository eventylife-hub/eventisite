# Scaleway Server Setup Guide — Eventy Life

Cette documentation couvre la configuration d'une instance Scaleway DEV1-S (Ubuntu 22.04) pour exécuter Eventy Life en production.

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Lancement du script setup](#lancement-du-script-setup)
4. [Configuration post-setup](#configuration-post-setup)
5. [Déploiement avec Docker Compose](#déploiement-avec-docker-compose)
6. [Renouvellement SSL automatique](#renouvellement-ssl-automatique)
7. [Monitoring et logs](#monitoring-et-logs)
8. [Dépannage](#dépannage)

---

## Vue d'ensemble

### Ce que le script configure automatiquement

✅ **Système**
- Mise à jour complète (apt update/upgrade)
- Installation des dépendances essentielles (curl, wget, git, htop, etc.)

✅ **Conteneurisation**
- Docker (docker.io + docker-compose-plugin)
- Configuration groupe docker pour utilisateur `eventy`

✅ **Sécurité SSL/TLS**
- Certbot (Let's Encrypt)
- Certificat généré pour : `eventy.life`, `api.eventy.life`, `www.eventy.life`
- Renouvellement automatique via cron (2x par jour)

✅ **Réseau & Firewall**
- UFW: SSH (22), HTTP (80), HTTPS (443)
- Autres ports fermés par défaut

✅ **Utilisateur & répertoires**
- Utilisateur non-root `eventy` avec accès Docker
- Structure de répertoires : `/home/eventy/eventy-life/`
- Sous-dossiers : `nginx/certs/`, `backups/`, `logs/`

✅ **Application**
- Clonage du repository Git
- Création du fichier `.env.production` avec secrets générés

### Ce qui nécessite configuration manuelle

⚠️  Variables d'environnement sensibles (voir section 4)
⚠️  Configuration Docker Compose (yaml)
⚠️  Domaines DNS (A records)
⚠️  Services externes (Stripe, Sentry, Resend, Scaleway RDB, S3)

---

## Prérequis

### Avant de lancer le script

1. **Instance Scaleway DEV1-S**
   - OS: Ubuntu 22.04 (image standard)
   - vCPU: 1 core
   - RAM: 2 GB
   - SSD: 20 GB
   - Région: Paris (fr-par) recommandée

2. **Accès SSH root**
   ```bash
   # Depuis votre machine locale
   ssh root@YOUR_SCALEWAY_IP
   ```

3. **Domaines DNS**
   - Registered & ready (pointe vers l'IP Scaleway)
   - eventy.life
   - www.eventy.life
   - api.eventy.life

4. **Secrets & clés**
   - Stripe LIVE keys (sk_live_*, pk_live_*)
   - Resend API key
   - Sentry DSN
   - Scaleway RDB credentials
   - Scaleway Object Storage credentials

---

## Lancement du script setup

### Option 1: Depuis le serveur (recommandé)

```bash
# SSH sur votre instance Scaleway
ssh root@YOUR_SCALEWAY_IP

# Télécharger et exécuter le script
curl -fsSL https://raw.githubusercontent.com/eventy/eventy-life/main/scripts/setup-scaleway.sh | bash
```

### Option 2: Depuis votre machine locale

```bash
# Depuis le repo Eventy Life
cd /path/to/eventy-life
bash scripts/setup-scaleway.sh
```

### Option 3: Manuelle étape par étape

```bash
# Copier le script vers le serveur
scp scripts/setup-scaleway.sh root@YOUR_SCALEWAY_IP:/tmp/

# Exécuter
ssh root@YOUR_SCALEWAY_IP "bash /tmp/setup-scaleway.sh"
```

### Durée estimée

⏱️  **5-10 minutes** (selon la vitesse de la connexion internet)

### Pendant l'exécution

Le script affichera :
- ✓ pour chaque étape réussie
- ⚠️  pour les warnings (ex: "Docker déjà installé")
- Les secrets JWT/Redis générés aléatoirement

---

## Configuration post-setup

### 1. Compléter le fichier `.env.production`

```bash
# En tant qu'utilisateur eventy
sudo -u eventy nano /home/eventy/eventy-life/backend/.env.production
```

**Variables OBLIGATOIRES à remplir:**

```env
# Base de données — Scaleway RDB
DATABASE_URL=postgresql://eventy_prod:YOUR_PASSWORD@YOUR_RDB_HOST:5432/eventy_prod?sslmode=require

# Stripe LIVE (pas test_)
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY_HERE

# Email — Resend
RESEND_API_KEY=re_YOUR_API_KEY
EMAIL_FROM=noreply@eventy.life
EMAIL_FROM_NAME=Eventy Life
ADMIN_ALERT_EMAIL=david@eventy.life

# S3/Object Storage — Scaleway
AWS_BUCKET=eventy-uploads-prod
AWS_REGION=fr-par
AWS_ACCESS_KEY_ID=YOUR_SCALEWAY_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SCALEWAY_SECRET_KEY
AWS_ENDPOINT=https://s3.fr-par.scw.cloud

# Sentry — Error tracking
SENTRY_DSN=https://YOUR_SENTRY_TOKEN@SENTRY_HOST.ingest.sentry.io/YOUR_PROJECT_ID
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_SENTRY_TOKEN@SENTRY_HOST.ingest.sentry.io/YOUR_FRONT_PROJECT_ID
```

**Variables optionnelles** (déjà remplies par le script):
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, etc. (générés)
- `REDIS_PASSWORD` (généré)
- `FRONTEND_URL=https://eventy.life`
- `NEXT_PUBLIC_API_URL=https://api.eventy.life/api`

**Sauvegarder (Ctrl+X → Y → Enter)**

### 2. Vérifier les certificats SSL

```bash
# Vérifier que Let's Encrypt a créé les certs
ls -la /etc/letsencrypt/live/eventy.life/

# Affichage attendu:
# lrwxrwxrwx  1 root root    cert.pem -> ../../../archive/eventy.life/cert1.pem
# lrwxrwxrwx  1 root root    fullchain.pem -> ../../../archive/eventy.life/fullchain1.pem
# lrwxrwxrwx  1 root root    privkey.pem -> ../../../archive/eventy.life/privkey1.pem
```

### 3. Configurer les DNS

Pointer les domaines vers l'IP Scaleway via votre registrar (Gandi, OVH, etc.):

| Domaine | Type | Valeur |
|---------|------|--------|
| eventy.life | A | YOUR_SCALEWAY_IP |
| www.eventy.life | CNAME | eventy.life. |
| api.eventy.life | A | YOUR_SCALEWAY_IP |

**Vérifier la propagation DNS:**
```bash
nslookup eventy.life
# Doit retourner YOUR_SCALEWAY_IP après quelques minutes
```

---

## Déploiement avec Docker Compose

### 1. Créer le fichier `docker-compose.yml`

Placer à la racine : `/home/eventy/eventy-life/docker-compose.yml`

**Exemple minimaliste:**

```yaml
version: '3.9'

services:
  # ─────────────────────────────────────────────────
  # Backend NestJS (API)
  # ─────────────────────────────────────────────────
  backend:
    image: ghcr.io/eventy/eventy-life/backend:latest
    container_name: eventy_backend_1
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env.production
    ports:
      - "4000:4000"
    volumes:
      - ./logs:/app/logs
    depends_on:
      - redis
    networks:
      - eventy_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ─────────────────────────────────────────────────
  # Frontend Next.js
  # ─────────────────────────────────────────────────
  frontend:
    image: ghcr.io/eventy/eventy-life/frontend:latest
    container_name: eventy_frontend_1
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env.production  # Partage pour les variables NEXT_PUBLIC_*
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - eventy_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ─────────────────────────────────────────────────
  # Nginx (reverse proxy + SSL)
  # ─────────────────────────────────────────────────
  nginx:
    image: nginx:alpine
    container_name: eventy_nginx_1
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro  # Certs Let's Encrypt
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - backend
      - frontend
    networks:
      - eventy_network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ─────────────────────────────────────────────────
  # Redis (cache, sessions)
  # ─────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: eventy_redis_1
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - eventy_network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  eventy_network:
    driver: bridge

volumes:
  redis_data:
    driver: local
```

### 2. Créer la config Nginx

Placer à `/home/eventy/eventy-life/nginx/conf.d/eventy.conf`

```nginx
# ────────────────────────────────────────────────────
# EVENTY LIFE — Configuration Nginx
# ────────────────────────────────────────────────────

# Redirection HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name eventy.life api.eventy.life www.eventy.life;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# ────────────────────────────────────────────────────
# EVENTY.LIFE — Frontend (www + racine)
# ────────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name eventy.life www.eventy.life;

    ssl_certificate /etc/letsencrypt/live/eventy.life/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eventy.life/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}

# ────────────────────────────────────────────────────
# API.EVENTY.LIFE — Backend (API NestJS)
# ────────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.eventy.life;

    ssl_certificate /etc/letsencrypt/live/eventy.life/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eventy.life/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }

    # WebSocket support (si utilisé)
    location /socket.io {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend:4000/api/health;
    }
}
```

### 3. Démarrer les services

```bash
# Naviguer vers l'app
cd /home/eventy/eventy-life

# Démarrer tous les services
sudo -u eventy docker compose up -d

# Vérifier que tous les conteneurs tournent
docker ps

# Affichage attendu:
# CONTAINER ID   IMAGE                                    STATUS
# xxxxxxxx       ghcr.io/eventy/eventy-life/backend      Up X seconds (healthy)
# xxxxxxxx       ghcr.io/eventy/eventy-life/frontend     Up X seconds (healthy)
# xxxxxxxx       nginx:alpine                            Up X seconds (healthy)
# xxxxxxxx       redis:7-alpine                          Up X seconds (healthy)
```

### 4. Vérifier l'accès

```bash
# Frontend (HTTP → HTTPS redirect)
curl -I https://eventy.life
# Doit retourner 200 OK

# Backend API
curl -I https://api.eventy.life/api/health
# Doit retourner 200 OK

# Certificat SSL
openssl s_client -connect api.eventy.life:443 -showcerts
# Doit montrer le certificat Let's Encrypt
```

---

## Renouvellement SSL automatique

### Vérification du cron

```bash
# Afficher la tâche cron
cat /etc/cron.d/eventy-ssl-renew

# Affichage attendu:
# 0 0,12 * * * root /home/eventy/eventy-life/scripts/ssl-renew.sh >> /var/log/eventy-ssl-renew.log 2>&1
```

### Logs du renouvellement

```bash
# Consulter les logs de renouvellement SSL
tail -f /var/log/eventy-ssl-renew.log

# Exemple de sortie:
# [2026-03-16 00:00:01] [INFO] Démarrage du renouvellement SSL...
# [2026-03-16 00:00:15] [✓] Renouvellement SSL effectué avec succès
# [2026-03-16 00:00:20] [✓] Nginx rechargé via docker compose
# [2026-03-16 00:00:21] [✓] Certificat valide pour 89 jours
```

### Test manuel du renouvellement

```bash
# Tester le renouvellement sans attendre le cron
sudo /home/eventy/eventy-life/scripts/ssl-renew.sh

# Vérifier les logs immédiatement
tail /var/log/eventy-ssl-renew.log
```

### Vérifier la validité du certificat

```bash
# Date d'expiration
openssl x509 -enddate -noout -in /etc/letsencrypt/live/eventy.life/fullchain.pem

# Affichage:
# notAfter=Jun 14 12:34:56 2026 GMT
```

---

## Monitoring et logs

### Logs Docker

```bash
# Backend logs (dernières 50 lignes)
docker logs -n 50 eventy_backend_1

# Frontend logs
docker logs -n 50 eventy_frontend_1

# Nginx logs
docker logs -n 50 eventy_nginx_1

# Redis logs
docker logs -n 50 eventy_redis_1

# Tous les logs en temps réel
docker compose logs -f --tail=50
```

### Utilisation des ressources

```bash
# CPU, RAM, Network des conteneurs
docker stats

# Espace disque
df -h /home/eventy/eventy-life

# Taille des images
docker images --format "table {{.Repository}}\t{{.Size}}"
```

### Health checks

```bash
# Vérifier la santé globale
docker compose ps

# Inspect détaillé
docker inspect eventy_backend_1 | grep -A 20 "Health"
```

### Logs des certificats

```bash
# Certbot logs
tail -f /var/log/letsencrypt/letsencrypt.log

# SSL renewal logs
tail -f /var/log/eventy-ssl-renew.log
```

---

## Dépannage

### 1. Port déjà utilisé

```bash
# Erreur: bind: address already in use [:]:80

# Identifier le processus
lsof -i :80
# Terminer si possible
kill -9 PID

# Ou modifier docker-compose.yml pour utiliser d'autres ports (3080, 3443)
```

### 2. Certificat SSL non généré

```bash
# Vérifier que les domaines sont accessibles sur le port 80
curl -v http://eventy.life/.well-known/acme-challenge/test

# Si firewall bloque :
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# Relancer la génération manuelle
sudo certbot certonly --standalone -d eventy.life -d api.eventy.life -d www.eventy.life \
  --email eventylife@gmail.com --agree-tos --non-interactive
```

### 3. Docker images non trouvées

```bash
# Erreur: failed to pull image ghcr.io/eventy/eventy-life/backend:latest

# Vérifier le login GHCR
docker login ghcr.io

# Utiliser le token PAT GitHub
# Username: YOUR_GITHUB_USERNAME
# Token: YOUR_PAT_TOKEN

# Ensuite réessayer
docker compose pull
```

### 4. PostgreSQL timeout

```bash
# Erreur: connection timeout to DATABASE_URL

# Vérifier que Scaleway RDB est accessible
psql "postgresql://eventy_prod:PASSWORD@host:5432/eventy_prod?sslmode=require"

# Si RDB est dans VPC privé, s'assurer que le firewall Scaleway autorise la connexion
```

### 5. Nginx retourne 502 Bad Gateway

```bash
# Vérifier que le backend tourne
docker logs eventy_backend_1 | tail -50

# Vérifier la résolution des noms
docker exec eventy_nginx_1 nslookup backend

# Vérifier les droits sur les fichiers SSL
ls -la /etc/letsencrypt/live/eventy.life/
```

### 6. Redis connection refused

```bash
# Erreur: connection refused (6379)

# Vérifier que Redis tourne
docker ps | grep redis

# Vérifier le password dans .env.production
grep REDIS_PASSWORD /home/eventy/eventy-life/backend/.env.production

# Tester la connexion
docker exec eventy_redis_1 redis-cli ping
# Doit retourner: PONG
```

### 7. Cron job ne s'exécute pas

```bash
# Vérifier la tâche cron
grep eventy /var/log/syslog | tail -20

# Tester le script directement
bash -x /home/eventy/eventy-life/scripts/ssl-renew.sh

# Vérifier les permissions
ls -la /home/eventy/eventy-life/scripts/ssl-renew.sh
# Doit avoir chmod 755
```

---

## Références & ressources

- **Scaleway Console**: https://console.scaleway.com
- **Let's Encrypt Certbot**: https://certbot.eff.org/
- **Docker Compose**: https://docs.docker.com/compose/
- **Nginx**: https://nginx.org/en/docs/

---

## Support

Pour toute question ou problème :

📧 **Email**: eventylife@gmail.com
🔗 **Documentation**: https://github.com/eventy/eventy-life
📱 **Issues**: https://github.com/eventy/eventy-life/issues

---

**Dernière mise à jour**: 2026-03-16
**Version script**: 1.0.0
