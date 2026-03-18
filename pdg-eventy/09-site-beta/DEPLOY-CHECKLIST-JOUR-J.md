# Checklist Déploiement Jour J — Eventy

> **Date de création** : 18 mars 2026
> **Objectif** : Liste pas-à-pas pour le jour du déploiement en production
> **Pré-requis** : SAS créée, Kbis obtenu, APST validée, RC Pro souscrite, Atout France OK
> **Durée estimée** : 4-6 heures

---

## Avant de commencer (J-1)

- [ ] Vérifier que tous les secrets sont prêts (pas dans le code, dans un gestionnaire de secrets)
- [ ] Faire un backup complet du repo Git
- [ ] Vérifier que `npm run build` passe sur frontend ET backend
- [ ] Vérifier que `npx prisma validate` passe
- [ ] Vérifier que `npm run test` passe (3 300+ tests)
- [ ] Préparer le fichier `.env.production` (NE PAS le committer)

---

## Étape 1 — Infrastructure Scaleway (30 min)

```bash
# 1. Créer le compte Scaleway (Paris DC2)
# → https://console.scaleway.com

# 2. Provisionner l'instance backend
# DEV1-S : 2 vCPU, 2 Go RAM — 6,42€/mois
scw instance server create type=DEV1-S image=ubuntu_jammy name=eventy-backend

# 3. PostgreSQL managé
# DB-DEV-S : 7,68€/mois
scw rdb instance create node-type=DB-DEV-S engine=PostgreSQL-15 name=eventy-db

# 4. Object Storage S3
# 75 Go inclus gratuit
scw object-storage bucket create name=eventy-uploads region=fr-par

# 5. Noter les credentials
# → DATABASE_URL, S3_ACCESS_KEY, S3_SECRET_KEY, IP du serveur
```

## Étape 2 — Configuration serveur (45 min)

```bash
# SSH sur le serveur
ssh root@<IP_SERVEUR>

# Installer Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs nginx certbot python3-certbot-nginx

# Installer PM2
npm install -g pm2

# Créer l'utilisateur eventy
adduser eventy
usermod -aG sudo eventy

# Configurer le firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## Étape 3 — DNS Cloudflare (15 min)

```
# Ajouter dans Cloudflare (DNS de eventylife.fr)
A    eventylife.fr        → <IP_SCALEWAY>      (proxied)
A    www.eventylife.fr    → <IP_SCALEWAY>      (proxied)
A    api.eventylife.fr    → <IP_SCALEWAY>      (proxied)

# Activer :
# - SSL/TLS : Full (strict)
# - Always use HTTPS : ON
# - HSTS : ON (max-age 31536000, includeSubDomains)
# - Minimum TLS : 1.2
# - WAF : ON (managed rules)
```

## Étape 4 — Backend NestJS (45 min)

```bash
# En tant qu'utilisateur eventy
su - eventy
mkdir -p /home/eventy/app
cd /home/eventy/app

# Cloner le repo
git clone <REPO_URL> backend
cd backend

# Installer les dépendances
npm ci --production

# Créer .env.production
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://eventy:<PASSWORD>@<DB_HOST>:5432/eventy?schema=public
JWT_SECRET=<GENERER_64_CHARS_ALEATOIRES>
JWT_REFRESH_SECRET=<GENERER_64_CHARS_ALEATOIRES>
STRIPE_SECRET_KEY=sk_live_<CLÉ>
STRIPE_WEBHOOK_SECRET=whsec_<CLÉ>
S3_ENDPOINT=https://s3.fr-par.scw.cloud
S3_ACCESS_KEY=<CLÉ>
S3_SECRET_KEY=<CLÉ>
S3_BUCKET=eventy-uploads
CORS_ORIGIN=https://www.eventylife.fr,https://eventylife.fr
EMAIL_FROM=contact@eventylife.fr
BREVO_API_KEY=<CLÉ>
SENTRY_DSN=<CLÉ>
EOF

# Migrer la base de données
npx prisma migrate deploy

# Build
npm run build

# Lancer avec PM2
pm2 start dist/main.js --name eventy-api -i 2 --max-memory-restart 1500M
pm2 save
pm2 startup
```

## Étape 5 — Nginx reverse proxy (15 min)

```nginx
# /etc/nginx/sites-available/eventylife
server {
    listen 80;
    server_name api.eventylife.fr;

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
        client_max_body_size 10M;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/eventylife /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL avec Let's Encrypt
certbot --nginx -d api.eventylife.fr
```

## Étape 6 — Frontend Next.js (30 min)

```bash
# Option A : Scaleway Container
cd /home/eventy/app
git clone <REPO_URL> frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=https://api.eventylife.fr" > .env.production
npm ci
npm run build
pm2 start npm --name eventy-front -- start -- -p 3001

# Option B : Vercel (plus simple)
# → cd frontend && npx vercel --prod
# → Configurer NEXT_PUBLIC_API_URL dans les env vars Vercel
```

## Étape 7 — Stripe production (20 min)

- [ ] Activer le mode live dans le dashboard Stripe
- [ ] Copier la clé live `sk_live_...` dans `.env.production`
- [ ] Créer le webhook endpoint : `https://api.eventylife.fr/webhooks/stripe`
- [ ] Sélectionner les événements : `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- [ ] Copier le secret webhook `whsec_...` dans `.env.production`
- [ ] Faire un paiement test de 1€ pour vérifier

## Étape 8 — Email Brevo (15 min)

- [ ] Créer le compte Brevo (free tier : 300 emails/jour)
- [ ] Configurer l'expéditeur : `contact@eventylife.fr`
- [ ] Ajouter les enregistrements DNS (SPF, DKIM, DMARC) dans Cloudflare
- [ ] Copier la clé API dans `.env.production`
- [ ] Tester l'envoi d'un email de confirmation

## Étape 9 — Monitoring (15 min)

- [ ] Configurer Sentry : `npx @sentry/wizard@latest -i nestjs` + copier DSN
- [ ] Créer le check UptimeRobot : `https://api.eventylife.fr/health` (intervalle 5 min)
- [ ] Créer le check UptimeRobot : `https://www.eventylife.fr` (intervalle 5 min)
- [ ] Configurer les alertes email sur `contact@eventylife.fr`

## Étape 10 — Vérifications post-déploiement (30 min)

- [ ] `curl https://api.eventylife.fr/health` → doit retourner `{ "status": "ok" }`
- [ ] Tester l'inscription client
- [ ] Tester l'inscription Pro
- [ ] Tester la création de voyage (Pro)
- [ ] Tester la réservation + paiement Stripe
- [ ] Vérifier que les emails arrivent
- [ ] Vérifier le numéro Atout France dans le footer
- [ ] Vérifier les CGV, mentions légales, politique confidentialité
- [ ] Scanner securityheaders.com → objectif A+
- [ ] Lighthouse > 80 sur la homepage
- [ ] Test mobile responsive (iPhone, Android)

---

## Après le déploiement (J+1)

- [ ] Configurer les backups automatiques PostgreSQL (cron quotidien)
- [ ] Activer les cron jobs backend (suppression passeports J+30, relances)
- [ ] Vérifier les logs PM2 : `pm2 logs eventy-api`
- [ ] Surveiller Sentry les 48 premières heures
- [ ] Partager l'URL de production avec les beta-testeurs

---

## Coûts mensuels production

| Service | Coût HT/mois |
|---------|-------------|
| Scaleway DEV1-S (backend) | 6,42€ |
| Scaleway PostgreSQL managé | 7,68€ |
| Scaleway S3 (75 Go inclus) | 0€ |
| Cloudflare (plan gratuit) | 0€ |
| Brevo (300 emails/jour) | 0€ |
| UptimeRobot (gratuit) | 0€ |
| Sentry (gratuit dev) | 0€ |
| Vercel (frontend, gratuit) | 0€ |
| **TOTAL** | **~14€ HT/mois** |

*Scalable : passage à DEV1-M (4 vCPU, 4 Go) à ~12€/mois quand le trafic augmente.*
