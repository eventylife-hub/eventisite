# Scaleway Production Setup — Checklist de déploiement

**Projet**: Eventy Life
**Instance**: Scaleway DEV1-S (Ubuntu 22.04)
**Date**: 2026-03-16
**Admin Email**: eventylife@gmail.com

---

## Phase 1: Préparation (avant d'exécuter le script)

- [ ] Instance Scaleway DEV1-S créée et accessible en SSH
- [ ] Domaines enregistrés (eventy.life, api.eventy.life, www.eventy.life)
- [ ] Clés Stripe LIVE prêtes (sk_live_*, pk_live_*)
- [ ] Clé API Resend obtenue (re_*)
- [ ] Sentry DSN pour backend et frontend
- [ ] Clés Scaleway Object Storage (AWS_*_KEY)
- [ ] Credentials PostgreSQL Scaleway RDB
- [ ] GitHub PAT (Personal Access Token) pour GHCR

---

## Phase 2: Exécution du script setup-scaleway.sh

### Lancement

```bash
# Option 1: Depuis le serveur (recommandé)
ssh root@YOUR_SCALEWAY_IP
curl -fsSL https://raw.githubusercontent.com/eventy/eventy-life/main/scripts/setup-scaleway.sh | bash

# Option 2: Depuis votre machine
scp scripts/setup-scaleway.sh root@YOUR_SCALEWAY_IP:/tmp/
ssh root@YOUR_SCALEWAY_IP "bash /tmp/setup-scaleway.sh"
```

### Vérifications pendant l'exécution

- [ ] Système mis à jour (apt update/upgrade) — ✓
- [ ] Docker installé — ✓
- [ ] Certbot installé — ✓
- [ ] Utilisateur `eventy` créé — ✓
- [ ] Groupe Docker configuré — ✓
- [ ] Firewall UFW activé (22, 80, 443) — ✓
- [ ] Répertoires créés (`/home/eventy/eventy-life/`) — ✓
- [ ] Certificat SSL généré (Let's Encrypt) — ✓
- [ ] Cron renouvellement SSL configuré — ✓
- [ ] Repository Git cloné — ✓
- [ ] `.env.production` créé avec secrets — ✓

### Après le script

- [ ] Affichage de la checklist finale (OK)
- [ ] Pas d'erreurs critiques dans les logs

---

## Phase 3: Configuration manuelle

### 3.1 Variables d'environnement

```bash
# Éditer le fichier .env.production
sudo -u eventy nano /home/eventy/eventy-life/backend/.env.production
```

**À remplir obligatoirement:**

- [ ] `DATABASE_URL` (Scaleway RDB)
- [ ] `STRIPE_SECRET_KEY` (sk_live_*)
- [ ] `STRIPE_WEBHOOK_SECRET` (whsec_*)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` (pk_live_*)
- [ ] `RESEND_API_KEY` (re_*)
- [ ] `AWS_ACCESS_KEY_ID` (Scaleway)
- [ ] `AWS_SECRET_ACCESS_KEY` (Scaleway)
- [ ] `SENTRY_DSN` (Backend)
- [ ] `NEXT_PUBLIC_SENTRY_DSN` (Frontend)
- [ ] `EMAIL_FROM` (noreply@eventy.life)
- [ ] `ADMIN_ALERT_EMAIL` (david@eventy.life)

**Déjà remplis (vérifier):**

- [ ] `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, etc.
- [ ] `REDIS_PASSWORD`
- [ ] `FRONTEND_URL=https://eventy.life`
- [ ] `NEXT_PUBLIC_API_URL=https://api.eventy.life/api`

### 3.2 Certificats SSL

```bash
# Vérifier
ls -la /etc/letsencrypt/live/eventy.life/
```

**Attendu:**

- [ ] `fullchain.pem` (le certificat)
- [ ] `privkey.pem` (la clé privée)
- [ ] `cert.pem` (certificat intermédiaire)

### 3.3 Configuration DNS

**Chez votre registrar (Gandi, OVH, etc.):**

- [ ] `eventy.life` → A record → `YOUR_SCALEWAY_IP`
- [ ] `www.eventy.life` → CNAME → `eventy.life.`
- [ ] `api.eventy.life` → A record → `YOUR_SCALEWAY_IP`

**Vérifier la propagation:**

```bash
nslookup eventy.life
# Doit retourner YOUR_SCALEWAY_IP après 5-30 min
```

**Checklist:**

- [ ] Domaines pointe vers l'IP Scaleway
- [ ] Propagation vérifiée (nslookup)

---

## Phase 4: Déploiement Docker Compose

### 4.1 Créer docker-compose.yml

**Localisation**: `/home/eventy/eventy-life/docker-compose.yml`

**Services à inclure:**

- [ ] Backend (NestJS, port 4000)
- [ ] Frontend (Next.js, port 3000)
- [ ] Nginx (reverse proxy, ports 80/443)
- [ ] Redis (cache, port 6379)
- [ ] PostgreSQL (optionnel si utilise Scaleway RDB)

### 4.2 Créer la config Nginx

**Localisation**: `/home/eventy/eventy-life/nginx/conf.d/eventy.conf`

**À configurer:**

- [ ] SSL certificates paths (`/etc/letsencrypt/live/eventy.life/`)
- [ ] Redirection HTTP → HTTPS
- [ ] Proxy vers backend (port 4000)
- [ ] Proxy vers frontend (port 3000)
- [ ] Security headers (HSTS, X-Frame-Options, etc.)
- [ ] Health check endpoints

### 4.3 Démarrer les services

```bash
cd /home/eventy/eventy-life
sudo -u eventy docker compose up -d
```

**Vérifications:**

- [ ] Tous les conteneurs démarrés: `docker ps`
- [ ] Backend healthy: `docker logs eventy_backend_1`
- [ ] Frontend healthy: `docker logs eventy_frontend_1`
- [ ] Nginx healthy: `docker logs eventy_nginx_1`
- [ ] Redis running: `docker logs eventy_redis_1`

---

## Phase 5: Validation de l'accès

### 5.1 Tests HTTPS

```bash
# Frontend
curl -I https://eventy.life
# Attendu: HTTP/2 200

curl -I https://www.eventy.life
# Attendu: HTTP/2 200

# API
curl -I https://api.eventy.life/api/health
# Attendu: HTTP/2 200
```

**Checklist:**

- [ ] Frontend accessible: `https://eventy.life`
- [ ] Redirect www: `https://www.eventy.life`
- [ ] API accessible: `https://api.eventy.life/api/health`
- [ ] Certificat SSL valide (pas d'avertissement navigateur)

### 5.2 Tests fonctionnels

```bash
# Depuis un navigateur
https://eventy.life
# Charger le site complet, vérifier console (pas d'erreurs)

# API health
curl -s https://api.eventy.life/api/health | jq
# Attendu: { "status": "ok" }
```

**Checklist:**

- [ ] Page d'accueil charge complètement
- [ ] Pas d'erreurs 404/500 dans la console
- [ ] API répond à `/api/health`
- [ ] Base de données connectée (vérifier dans logs backend)

### 5.3 Certificat SSL

```bash
# Vérifier la chaîne SSL
openssl s_client -connect api.eventy.life:443 -showcerts

# Vérifier l'expiration
openssl x509 -enddate -noout -in /etc/letsencrypt/live/eventy.life/fullchain.pem
# Attendu: notAfter=Jun XX 12:34:56 2026 GMT (> 60 jours)

# Test avec curl
curl -v https://api.eventy.life 2>&1 | grep "certificate"
# Ne doit PAS voir "certificate verify failed"
```

**Checklist:**

- [ ] Certificat valide (> 60 jours avant expiration)
- [ ] Chaîne complète installée (fullchain.pem)
- [ ] Pas d'erreur de vérification SSL
- [ ] Grade SSL Labs: A ou A+ (optionnel, https://ssllabs.com)

---

## Phase 6: Renouvellement SSL & Maintenance

### 6.1 Cron certbot

```bash
# Vérifier la tâche
cat /etc/cron.d/eventy-ssl-renew

# Affichage attendu:
# 0 0,12 * * * root /home/eventy/eventy-life/scripts/ssl-renew.sh >> /var/log/eventy-ssl-renew.log 2>&1
```

**Checklist:**

- [ ] Cron job créée (exécution 2x par jour)
- [ ] Script ssl-renew.sh executable: `chmod +x`
- [ ] Log file créé: `/var/log/eventy-ssl-renew.log`

### 6.2 Test renouvellement manuel

```bash
# Exécuter le script manuellement
sudo /home/eventy/eventy-life/scripts/ssl-renew.sh

# Vérifier les logs
tail -20 /var/log/eventy-ssl-renew.log

# Attendu:
# [✓] Renouvellement SSL effectué avec succès
# [✓] Nginx rechargé via docker compose
# [✓] Certificat valide pour XX jours
```

**Checklist:**

- [ ] Script s'exécute sans erreurs
- [ ] Logs writeable et consultables
- [ ] Nginx se recharge correctement après renouvellement

---

## Phase 7: Monitoring & Alertes (optionnel)

### 7.1 Logs centralisés

- [ ] Configurer Sentry pour les erreurs backend
- [ ] Configurer Sentry pour les erreurs frontend
- [ ] Tester l'envoi d'erreurs: vérifier dans Sentry dashboard

### 7.2 Alertes email

- [ ] Tester l'envoi d'email via Resend
- [ ] Vérifier que `ADMIN_ALERT_EMAIL` reçoit les notifications

### 7.3 Monitoring des ressources

- [ ] Configurer un monitoring (optional: Scaleway Cockpit, Datadog, New Relic)
- [ ] Alertes sur CPU > 80%
- [ ] Alertes sur RAM > 80%
- [ ] Alertes sur disque > 85%

---

## Phase 8: Sécurité & Hardening

### 8.1 Firewall

```bash
# Vérifier les règles UFW
sudo ufw status

# Attendu:
# Status: active
# 22/tcp    ALLOW
# 80/tcp    ALLOW
# 443/tcp   ALLOW
```

**Checklist:**

- [ ] UFW active
- [ ] Ports SSH (22), HTTP (80), HTTPS (443) ouverts
- [ ] Autres ports fermés

### 8.2 Permissions fichiers

```bash
# Vérifier permissions .env.production
ls -la /home/eventy/eventy-life/backend/.env.production
# Attendu: -rw------- (600) propriétaire eventy

# Vérifier permissions clés SSL
ls -la /etc/letsencrypt/live/eventy.life/
# Attendu: accessible par root + nginx
```

**Checklist:**

- [ ] `.env.production`: mode 600, propriétaire eventy
- [ ] Clés SSL: mode 644-755, lisibles par nginx
- [ ] Aucun fichier sensible en lecturepublique

### 8.3 Docker security

- [ ] Images signées (ou au minimum, de sources de confiance)
- [ ] Pas de run containers avec `--privileged`
- [ ] Pas de mount de `/var/run/docker.sock`

---

## Phase 9: Backups

### 9.1 Base de données

```bash
# Planifier un backup quotidien
crontab -e

# Ajouter (exemple):
# 0 3 * * * pg_dump postgresql://user:pass@host/db | gzip > /home/eventy/eventy-life/backups/db-$(date +\%Y\%m\%d).sql.gz
```

**Checklist:**

- [ ] Backup job créé
- [ ] Destination: `/home/eventy/eventy-life/backups/`
- [ ] Rétention: 30 jours (nettoyer les anciens backups)

### 9.2 Stockage objet (optionnel)

- [ ] Uploads utilisateurs stockés dans Scaleway Object Storage
- [ ] Backup S3 configuré (optionnel)

---

## Phase 10: Documentation & Handover

- [ ] README-SCALEWAY-SETUP.md lu et archivé
- [ ] setup-scaleway.sh et ssl-renew.sh validés
- [ ] Credentials stockés de manière sécurisée (gestionnaire de secrets)
- [ ] Documentation de maintenance créée pour l'équipe
- [ ] Points de contact définis (David, support)

---

## Liste de vérification rapide (copy-paste)

```bash
# Vérifier l'installation complète en une seule commande

echo "=== Services Docker ===" && \
docker ps && \
echo "=== Backend health ===" && \
curl -s https://api.eventy.life/api/health | jq && \
echo "=== SSL Certificate ===" && \
openssl x509 -enddate -noout -in /etc/letsencrypt/live/eventy.life/fullchain.pem && \
echo "=== Cron SSL renewal ===" && \
cat /etc/cron.d/eventy-ssl-renew && \
echo "=== .env.production ===" && \
ls -lh /home/eventy/eventy-life/backend/.env.production && \
echo "=== Firewall ===" && \
sudo ufw status && \
echo "✓ All checks completed"
```

---

## Statut du déploiement

| Composant | Status | Notes |
|-----------|--------|-------|
| Instance Scaleway | ⚪ | |
| Docker | ⚪ | |
| Certbot | ⚪ | |
| Utilisateur eventy | ⚪ | |
| UFW Firewall | ⚪ | |
| Répertoires | ⚪ | |
| Certificats SSL | ⚪ | |
| Repository Git | ⚪ | |
| .env.production | ⚪ | |
| docker-compose.yml | ⚪ | |
| Nginx config | ⚪ | |
| Services (backend+frontend+nginx+redis) | ⚪ | |
| HTTPS accessible | ⚪ | |
| Cron SSL renewal | ⚪ | |
| **PRODUCTION READY** | 🔴 → 🟡 → 🟢 | |

---

**Dernière mise à jour**: 2026-03-16
**Responsable**: David (eventylife@gmail.com)
**Escalade support**: David / Eventy SAS
