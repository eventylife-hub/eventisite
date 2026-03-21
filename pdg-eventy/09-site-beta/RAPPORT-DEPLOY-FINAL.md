# Rapport Déploiement Backend — 21 mars 2026 (FINAL)

> Résumé pour David au réveil

---

## Statut : 🔄 DÉPLOIEMENT EN COURS — SERVEUR CRÉÉ, BUILD EN COURS

L'instance DEV1-M a été créée avec succès avec un cloud-init **complet** (v2) qui inclut **tout** — y compris PostgreSQL qui manquait dans la tentative précédente.

**Constat au moment de ce rapport** : Après ~30 minutes, Nginx répond (page Welcome) mais le script de déploiement n'a pas encore terminé le build NestJS. C'est normal pour un projet de 300K+ lignes — le build TypeScript + npm ci prennent du temps sur un DEV1-M. Le serveur n'a pas OOM (sinon il ne répondrait plus du tout).

---

## ⚡ Ce que David doit faire au réveil (2 minutes)

### Étape 1 — Vérifier si le backend est live

```bash
curl http://163.172.189.137/api/health
```

**Si ça répond `{"status":"ok"}`** → Le backend est live ! Passe à l'Étape 3.

**Si ça ne répond pas ou 404/502** → Passe à l'Étape 2.

### Étape 2 — Diagnostiquer en SSH

```bash
# Se connecter au serveur
ssh root@163.172.189.137

# Vérifier si le cloud-init est terminé
tail -50 /var/log/eventy-deploy.log
# Chercher "Eventy Deploy COMPLETE" à la fin

# Si le build a réussi, vérifier PM2
pm2 status
pm2 logs eventy-backend --lines 50

# Si PM2 montre "errored" ou "stopped" :
cd /opt/eventy/app/backend
pm2 delete eventy-backend 2>/dev/null
pm2 start dist/main.js --name eventy-backend -i 1 --max-memory-restart 2G
pm2 save

# Vérifier Nginx
nginx -t
systemctl status nginx
cat /etc/nginx/sites-enabled/eventy    # doit exister et proxyer vers 3000

# Si Nginx n'a pas la config eventy (encore le default) :
cat > /etc/nginx/sites-available/eventy << 'NGINX'
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/eventy /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Test final
curl http://localhost:3000/api/health    # direct NestJS
curl http://localhost/api/health          # via Nginx
```

### Étape 3 — Configurer le DNS (si backend live)

Dans Cloudflare (https://dash.cloudflare.com) :
1. Aller dans le domaine `eventylife.fr`
2. DNS → Add Record
3. Type: **A**, Name: **api**, Content: **163.172.189.137**, Proxy: **ON** (orange cloud = HTTPS auto)
4. Sauvegarder

Ensuite dans Vercel :
1. Aller dans le projet eventylife
2. Settings → Environment Variables
3. Ajouter/modifier `NEXT_PUBLIC_API_URL` = `https://api.eventylife.fr`
4. Redeploy

---

## Historique des tentatives

| # | Instance | RAM | Méthode | Résultat |
|---|----------|-----|---------|----------|
| 1 | DEV1-S | 2 Go | Docker | ❌ OOM pendant build (30+ min) |
| 2 | DEV1-S | 2 Go | Natif | ❌ OOM pendant build (20+ min) |
| 3 | DEV1-M | 4 Go | Cloud-init v1 | ❌ PostgreSQL manquant — NestJS crash |
| 4 | **DEV1-M** | **4 Go** | **Cloud-init v2 COMPLET** | 🔄 EN COURS — Nginx up, build en cours |

---

## Infos serveur actuel (Tentative 4)

| Info | Valeur |
|------|--------|
| **Instance** | `eventy-backend` — DEV1-M |
| **IP publique** | `163.172.189.137` |
| **Instance ID** | `6533166a-8396-4558-a955-8b49902e8989` |
| **Zone** | fr-par-1 (Paris) |
| **OS** | Ubuntu 24.04 Noble Numbat |
| **Specs** | 3 vCPU, 4 Go RAM, 300 Mbps |
| **Stockage** | Block Storage 5K — 25 Go |
| **SSH** | `ssh root@163.172.189.137` |
| **Coût** | €0.02675/h (~€19.50/mois) |
| **Public DNS** | `6533166a-8396-4558-a955-8b49902e8989.pub.instances.scw.cloud` |

---

## Ce que fait le cloud-init v2

Le script s'exécute automatiquement au premier boot :

1. **Swap 2 Go** — filet de sécurité mémoire pour le build
2. **Node.js 20 LTS** — via NodeSource
3. **PM2** — process manager (auto-restart, startup)
4. **PostgreSQL** — installation + création user `eventy` + base `eventy`
5. **JWT Secret** — généré automatiquement avec `openssl rand -hex 32`
6. **Clone GitHub** — repo Eventylife complet
7. **npm ci** — installation dépendances (NODE_OPTIONS=3072 Mo)
8. **Prisma generate** — génération du client Prisma
9. **npm run build** — build NestJS (étape la plus longue ~10-15 min)
10. **Copie .env** — variables d'environnement production
11. **Prisma migrate deploy** — migrations BDD (avec fallback `db push`)
12. **PM2 start** — démarrage backend sur port 3000
13. **Nginx** — reconfiguration reverse proxy port 80 → 3000
14. **Redis** — cache et sessions

**Durée estimée** : 20-30 minutes (projet de 300K+ lignes)

---

## Variables d'environnement configurées

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://eventy:eventy2026@localhost:5432/eventy
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=[auto-généré au boot]
JWT_EXPIRATION=7d
CORS_ORIGINS=https://eventylife.fr,https://www.eventylife.fr
UPLOAD_DIR=/opt/eventy/uploads
LOG_LEVEL=info
```

---

## Chemins importants sur le serveur

| Chemin | Description |
|--------|-------------|
| `/opt/eventy/app/backend/` | Code source backend |
| `/opt/eventy/app/backend/.env` | Variables d'environnement |
| `/opt/eventy/app/backend/dist/` | Build NestJS compilé |
| `/var/log/eventy-deploy.log` | Log du cloud-init/déploiement |
| `/etc/nginx/sites-available/eventy` | Config Nginx |
| `/swapfile` | Fichier swap 2 Go |

---

## Prochaines étapes après backend live

1. **DNS** : `api.eventylife.fr` → `163.172.189.137` (A record Cloudflare, proxy ON)
2. **HTTPS** : Automatique via Cloudflare proxy (orange cloud)
3. **Frontend Vercel** : `NEXT_PUBLIC_API_URL` = `https://api.eventylife.fr`
4. **Test complet** : Login, dashboard pro, réservation, paiement Stripe test
5. **Optionnel** : Migrer vers PostgreSQL managé Scaleway pour backups auto
6. **Nettoyer** : Supprimer les anciens fichiers de tentatives (fix-deploy.sh, RAPPORT-DEPLOY-21-03.md)
