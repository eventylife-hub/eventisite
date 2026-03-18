# Scaleway Setup Scripts — Summary

**Created**: 2026-03-16
**Eventy Life Production Deployment Package**

---

## 📦 Deliverables

### Main Scripts

#### 1. `setup-scaleway.sh` (20 KB)
**Main server setup automation script**

**Purpose**: One-command deployment of Scaleway DEV1-S instance for production

**What it does**:
- System updates (apt update/upgrade)
- Docker installation + docker-compose
- Certbot + Let's Encrypt SSL
- UFW firewall configuration
- Non-root user `eventy` with docker group
- Directory structure creation
- SSL certificate generation (3 domains)
- Cron job for SSL auto-renewal (2x/day)
- Repository cloning (Git)
- `.env.production` creation with auto-generated secrets
- GHCR login configuration

**How to use**:
```bash
# Method 1: Direct curl (recommended)
ssh root@YOUR_SCALEWAY_IP
curl -fsSL https://raw.githubusercontent.com/eventy/eventy-life/main/scripts/setup-scaleway.sh | bash

# Method 2: Local execution
bash scripts/setup-scaleway.sh

# Method 3: Copy and run
scp scripts/setup-scaleway.sh root@YOUR_SCALEWAY_IP:/tmp/
ssh root@YOUR_SCALEWAY_IP "bash /tmp/setup-scaleway.sh"
```

**Features**:
- ✅ Idempotent (safe to run multiple times)
- ✅ Comprehensive error handling (`set -euo pipefail`)
- ✅ French comments for team comprehension
- ✅ Colored output (info/success/warn/error)
- ✅ 5-10 minute runtime
- ✅ Automatic secret generation (JWT, Redis)
- ✅ UFW firewall (SSH 22, HTTP 80, HTTPS 443)
- ✅ Health checks built-in

**Outputs**:
- Final checklist with next manual steps
- Ready for Docker Compose deployment
- SSL certificates auto-renewed via cron

---

#### 2. `ssl-renew.sh` (10 KB)
**Let's Encrypt SSL renewal + Nginx reload script**

**Purpose**: Automatic SSL certificate renewal with zero downtime

**What it does**:
- Runs Certbot renewal (silent, non-interactive)
- Reloads Nginx via Docker Compose
- Verifies certificate health
- Sends notifications on failure
- Logs all actions for audit trail

**How it's used**:
- Automatically called by cron (2x daily: 00:00 and 12:00 UTC)
- Can be executed manually for testing
- Integrated into docker-compose deploy hook

**Cron entry**:
```
0 0,12 * * * root /home/eventy/eventy-life/scripts/ssl-renew.sh >> /var/log/eventy-ssl-renew.log 2>&1
```

**Features**:
- ✅ Non-blocking (runs in background)
- ✅ Comprehensive logging
- ✅ Certificate health checks
- ✅ Docker and systemctl support
- ✅ Error notifications
- ✅ Safe for production

---

### Documentation

#### 3. `README-SCALEWAY-SETUP.md` (19 KB)
**Comprehensive deployment guide (your current document)**

**Sections**:
1. Vue d'ensemble (overview)
2. Prérequis (prerequisites)
3. Lancement du script (how to run)
4. Configuration post-setup (manual steps)
5. Déploiement avec Docker Compose (app deployment)
6. Renouvellement SSL automatique (SSL management)
7. Monitoring et logs (operations)
8. Dépannage (troubleshooting)

**Contents**:
- Detailed explanations of each setup step
- Configuration instructions for `.env.production`
- Docker Compose example (full YAML)
- Nginx configuration template
- DNS setup guide
- Troubleshooting procedures
- References & resources

---

#### 4. `SCALEWAY-CHECKLIST.md` (11 KB)
**Deployment validation checklist**

**10 Phases**:
1. Préparation (10 items)
2. Exécution du script (10 items)
3. Configuration manuelle (10 items)
4. Déploiement Docker Compose (3 items)
5. Validation de l'accès (9 items)
6. Renouvellement SSL & Maintenance (6 items)
7. Monitoring & Alertes (3 items)
8. Sécurité & Hardening (3 items)
9. Backups (2 items)
10. Documentation & Handover (4 items)

**Features**:
- ✅ Checkbox format (print-friendly)
- ✅ Quick reference commands
- ✅ Status tracking table
- ✅ Copy-paste verification script
- ✅ ~70 validation points

---

## 📋 Quick Start

### For David (PDG)

1. **Provision Scaleway instance**
   - DEV1-S (1 core, 2GB RAM, 20GB SSD)
   - Ubuntu 22.04
   - Paris region (fr-par)

2. **Run the setup script** (5 minutes)
   ```bash
   ssh root@YOUR_IP
   curl -fsSL https://raw.githubusercontent.com/eventy/eventy-life/main/scripts/setup-scaleway.sh | bash
   ```

3. **Complete manual configuration** (30 minutes)
   - Edit `.env.production` with your secrets
   - Configure DNS A records
   - Create docker-compose.yml (template provided)
   - Create nginx config (template provided)

4. **Deploy services**
   ```bash
   cd /home/eventy/eventy-life
   sudo -u eventy docker compose up -d
   ```

5. **Verify**
   - Check `https://eventy.life` loads
   - Check `https://api.eventy.life/api/health` returns 200
   - Check SSL certificate is valid

**Total time**: ~1 hour (mostly manual configuration)

---

### For DevOps Team

**Installation files**:
- `setup-scaleway.sh` — Main orchestration
- `ssl-renew.sh` — Maintenance automation
- `README-SCALEWAY-SETUP.md` — Complete guide
- `SCALEWAY-CHECKLIST.md` — Validation checklist

**Deployment workflow**:
1. Run `setup-scaleway.sh` (idempotent)
2. Complete manual `.env.production` + docker-compose
3. Use checklist to validate each phase
4. Monitor via logs + Sentry
5. SSL auto-renews via cron (no intervention needed)

---

## 🔧 Configuration Requirements

### Before running setup:

- ✅ Scaleway instance IP address
- ✅ Domains: eventy.life, api.eventy.life, www.eventy.life
- ✅ Stripe LIVE keys (sk_live_*, pk_live_*)
- ✅ Resend API key (email service)
- ✅ Sentry DSN (error tracking) × 2 (backend + frontend)
- ✅ PostgreSQL Scaleway RDB connection string
- ✅ Scaleway Object Storage credentials (AWS_*_KEY)
- ✅ GitHub PAT (Personal Access Token) for GHCR

### After setup:

- All above variables in `.env.production`
- Docker Compose YAML
- Nginx configuration
- DNS A records pointing to Scaleway IP

---

## 📊 What Gets Automated

| Component | Automated | Manual | Notes |
|-----------|-----------|--------|-------|
| System updates | ✅ | | apt update/upgrade |
| Docker install | ✅ | | docker.io + docker-compose |
| Certbot install | ✅ | | Let's Encrypt |
| SSL cert generation | ✅ | | 3 domains |
| SSL auto-renewal | ✅ | | Cron 2x/day |
| Firewall config | ✅ | | UFW (22, 80, 443) |
| User creation | ✅ | | `eventy` user |
| Git clone | ✅ | | Repository download |
| .env.production | ⚠️ | ✅ | Generated template, values filled manually |
| docker-compose.yml | | ✅ | Must create + upload |
| Nginx config | | ✅ | Must create + upload |
| DNS records | | ✅ | Must configure at registrar |
| Service deployment | | ✅ | docker compose up -d |

---

## 🚀 Production Readiness

### Automated by script:
- [x] Ubuntu 22.04 configured
- [x] Docker + compose installed
- [x] SSL certificates (Let's Encrypt)
- [x] SSL auto-renewal cron job
- [x] Firewall hardening
- [x] Non-root user setup
- [x] Directory structure
- [x] Secrets generation (JWT, Redis)

### Requires manual completion:
- [ ] Environment variables (Stripe, Resend, Sentry, S3)
- [ ] Database connection (Scaleway RDB)
- [ ] Docker Compose configuration
- [ ] Nginx reverse proxy config
- [ ] DNS records (A records)
- [ ] Service deployment (docker compose up)

### Post-deployment validation:
- [ ] HTTPS accessibility (all 3 domains)
- [ ] SSL certificate validity
- [ ] Backend API health check
- [ ] Frontend loads completely
- [ ] No console errors
- [ ] Email notifications work
- [ ] Stripe webhooks connected
- [ ] Error tracking (Sentry) active

---

## 🔐 Security Features

✅ **Implemented in script**:
- Non-root user (eventy) with minimal privileges
- Docker group isolation
- UFW firewall (whitelist 22, 80, 443)
- SSL/TLS on all traffic (HTTPS)
- Auto-renewal prevents expiry
- Secrets auto-generated (JWT, Redis)
- `.env.production` 600 permissions
- No hardcoded credentials

✅ **Available in documentation**:
- Nginx security headers (HSTS, X-Frame-Options, etc.)
- Docker compose resource limits
- PostgreSQL SSL enforcement
- CORS configuration
- Cookie security settings

---

## 📞 Support & Maintenance

### For operational questions:
- See `README-SCALEWAY-SETUP.md` section "Dépannage"
- Review logs: `/var/log/eventy-ssl-renew.log`
- Docker logs: `docker logs eventy_SERVICENAME_1`

### For script improvements:
- All scripts located in `/scripts/`
- Both use `set -euo pipefail` for safety
- Comments in French for team
- Can be run multiple times (idempotent)

### Maintenance tasks:
- SSL renewal: Automatic (cron) ← no action needed
- Backups: Configure separately (template provided)
- Docker updates: Manual (docker pull + restart)
- OS updates: Manual (apt upgrade)

---

## 📁 File Structure

```
/home/eventy/eventy-life/
├── backend/
│   ├── .env.production          ← CREATED by script, VALUES filled manually
│   ├── .env.production.example  ← Template (unchanged)
│   └── ...
├── frontend/
│   └── ...
├── docker-compose.yml           ← MUST create + upload
├── nginx/
│   ├── certs/                   ← SSL certificates (Let's Encrypt)
│   ├── conf.d/
│   │   └── eventy.conf          ← MUST create + upload
│   └── nginx.conf               ← MUST create + upload
├── backups/                      ← For database backups
├── logs/                         ← Application logs
├── scripts/
│   ├── setup-scaleway.sh        ← Main setup (ALREADY RUN)
│   ├── ssl-renew.sh             ← SSL renewal (called by cron)
│   ├── deploy-prod.sh           ← Alternative deploy script
│   └── README-SCALEWAY-SETUP.md ← This documentation
└── .git/                        ← Git repository
```

---

## ✨ Next Steps

### Immediate (after script execution):

1. Complete `.env.production` with all required variables
2. Create `docker-compose.yml` at `/home/eventy/eventy-life/`
3. Create Nginx config at `/home/eventy/eventy-life/nginx/conf.d/eventy.conf`
4. Configure DNS A records at your registrar
5. Deploy: `docker compose up -d`

### Within 1 hour:

6. Verify HTTPS is working (https://eventy.life)
7. Check SSL certificate expiry date
8. Test backend API (/api/health)
9. Validate email sending
10. Test Stripe webhook

### Ongoing:

- Monitor logs daily
- Check Sentry for errors
- Validate SSL renews (logs checked monthly)
- Review Docker stats (memory, CPU)
- Plan backup strategy

---

## 📝 Documentation Status

| Document | Status | Audience | Purpose |
|----------|--------|----------|---------|
| `setup-scaleway.sh` | ✅ | DevOps/Ops | Automated setup |
| `ssl-renew.sh` | ✅ | DevOps/Cron | Maintenance |
| `README-SCALEWAY-SETUP.md` | ✅ | David + Team | Complete guide |
| `SCALEWAY-CHECKLIST.md` | ✅ | Project Manager | Validation |
| `SETUP-SUMMARY.md` | ✅ | Decision makers | This overview |

---

**Created**: 2026-03-16
**For**: Eventy Life (David, eventylife@gmail.com)
**Version**: 1.0.0
**Status**: Ready for production deployment
