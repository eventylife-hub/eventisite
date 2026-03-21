# Rapport Déploiement Backend — 21 mars 2026

> Résumé pour David au réveil

---

## Ce qui a été fait cette nuit

### 1. Serveur DEV1-M créé et running
- **Instance** : `eventy-backend`
- **Type** : DEV1-M (3 vCPU, **4 Go RAM**, 300 Mbps)
- **IP publique** : `163.172.189.137`
- **Zone** : fr-par-1 (Paris)
- **OS** : Ubuntu 24.04 Noble Numbat
- **Stockage** : Block Storage 5K — 25 Go
- **Coût** : ~€19,50/mois (~€0,027/h)
- **SSH** : `ssh root@163.172.189.137`

### 2. Cloud-init automatisé
Le script cloud-init a été injecté et s'exécute au boot. Il fait :
- Swap 2 Go (filet de sécurité mémoire)
- Node.js 20 LTS
- PM2 (process manager)
- Clone du repo GitHub
- `npm ci` avec NODE_OPTIONS=3072 Mo
- `npx prisma generate`
- `npm run build` (NestJS)
- PM2 start + startup
- Nginx reverse proxy (port 80 → 3000)
- Redis démarré

### 3. Fichiers projet mis à jour
- `PLAN-DEPLOIEMENT.md` — infos serveur DEV1-M, checklist cochée, historique des 3 tentatives
- `DASHBOARD-PDG.md` — Cowork-25 ajouté, bloqueur passé en "en cours de résolution"

### 4. Historique des tentatives
| # | Instance | RAM | Résultat |
|---|----------|-----|----------|
| 1 | DEV1-S Docker | 2 Go | ❌ OOM pendant build (30+ min) |
| 2 | DEV1-S natif | 2 Go | ❌ OOM pendant build (20+ min) |
| 3 | **DEV1-M natif** | **4 Go** | ✅ Instance créée, cloud-init lancé |

---

## Ce qu'il reste à faire (5 minutes)

### Problème identifié : PostgreSQL manquant
Le cloud-init n'inclut **pas PostgreSQL** dans les packages. Le build NestJS a probablement réussi, mais l'app crashe au démarrage faute de BDD.

### Solution — Exécuter le script de fix

```bash
# 1. Se connecter en SSH
ssh root@163.172.189.137

# 2. Vérifier d'abord que le build est terminé
tail -50 /var/log/eventy-deploy.log
# Tu dois voir "Eventy Deploy COMPLETE" à la fin

# 3. Télécharger et exécuter le script de fix
# Option A : copier le script depuis ton PC
scp pdg-eventy/09-site-beta/fix-deploy.sh root@163.172.189.137:/tmp/
ssh root@163.172.189.137 'chmod +x /tmp/fix-deploy.sh && /tmp/fix-deploy.sh'

# Option B : exécuter les commandes manuellement
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql && systemctl start postgresql
sudo -u postgres psql -c "CREATE USER eventy WITH PASSWORD 'eventy-prod-2026!' CREATEDB;"
sudo -u postgres createdb -O eventy eventy
sed -i 's|DATABASE_URL=postgresql://localhost:5432/eventy|DATABASE_URL=postgresql://eventy:eventy-prod-2026!@localhost:5432/eventy|' /opt/eventy/app/backend/.env
cd /opt/eventy/app/backend
npx prisma migrate deploy
pm2 restart eventy-backend
curl http://localhost:3000/api/health
```

### Test final
```bash
# Depuis n'importe où
curl http://163.172.189.137/api/health
```

Si ça répond `{"status":"ok"}` → le backend est live !

---

## Prochaines étapes après le backend live

1. **Configurer le DNS** : `api.eventylife.fr` → `163.172.189.137` (A record dans Cloudflare)
2. **HTTPS** : Installer Certbot (Let's Encrypt) ou passer par Cloudflare proxy
3. **Tester le site complet** : Login, dashboard, réservation
4. **PostgreSQL managé** (optionnel) : Migrer vers Scaleway DB managée pour les backups auto
5. **Supprimer l'ancien serveur** : Vérifier dans Scaleway Console s'il reste un DEV1-S

---

## Infos techniques de référence

| Info | Valeur |
|------|--------|
| IP serveur | `163.172.189.137` |
| Instance ID | `ef205b78-aca3-4e52-9c39-29f48beab90e` |
| SSH | `ssh root@163.172.189.137` |
| Log cloud-init | `/var/log/eventy-deploy.log` |
| Log fix | `/var/log/eventy-fix.log` |
| App backend | `/opt/eventy/app/backend/` |
| .env | `/opt/eventy/app/backend/.env` |
| PM2 status | `pm2 status` |
| PM2 logs | `pm2 logs eventy-backend` |
| Nginx config | `/etc/nginx/sites-available/eventy` |
| DB user | `eventy` |
| DB password | `eventy-prod-2026!` |
| DB name | `eventy` |
