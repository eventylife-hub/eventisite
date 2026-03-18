# Scaleway Server Setup Scripts — Complete Index

**Project**: Eventy Life Production Deployment
**Created**: 2026-03-16
**Version**: 1.0.0
**Status**: Ready for production use

---

## 📦 Deliverables Package

This `/scripts/` directory contains a complete, production-ready deployment package for Scaleway DEV1-S (Ubuntu 22.04).

### Files in this directory:

```
scripts/
├── setup-scaleway.sh              (20 KB) — MAIN SETUP SCRIPT
├── ssl-renew.sh                   (10 KB) — SSL RENEWAL + NGINX RELOAD
├── README-SCALEWAY-SETUP.md       (19 KB) — COMPLETE DEPLOYMENT GUIDE
├── SCALEWAY-CHECKLIST.md          (11 KB) — VALIDATION CHECKLIST
├── SETUP-SUMMARY.md               (11 KB) — DELIVERABLES OVERVIEW
├── QUICK-REFERENCE.txt            (11 KB) — QUICK START CARD
├── INDEX.md                       (THIS FILE) — DIRECTORY INDEX
└── deploy-prod.sh                 (7 KB)  — ALTERNATIVE DEPLOY SCRIPT
```

**Total documentation**: ~62 KB
**Total executable scripts**: ~30 KB

---

## 🎯 Quick Start

### For first-time deployment:

1. **Read this**: `QUICK-REFERENCE.txt` (5 minutes)
2. **Run this**: `setup-scaleway.sh` (5 minutes)
3. **Follow this**: `README-SCALEWAY-SETUP.md` (30 minutes manual config)
4. **Validate this**: `SCALEWAY-CHECKLIST.md` (10 minutes)

**Total time: ~50 minutes**

---

## 📋 Documentation Map

### Executive Summary

**→ Start here if you want the 2-minute overview**
- **File**: `QUICK-REFERENCE.txt`
- **Purpose**: One-page quick reference with phases, commands, and checklists
- **Audience**: David (PDG), Project managers
- **Contains**: 4-phase deployment process, troubleshooting commands, timeline

### Complete Deployment Guide

**→ Start here if you're deploying or operating the server**
- **File**: `README-SCALEWAY-SETUP.md`
- **Purpose**: Comprehensive step-by-step guide with explanations
- **Audience**: DevOps, SRE, System Administrators
- **Sections**:
  - Overview of what gets configured
  - Prerequisites checklist
  - How to run the setup script
  - Post-setup manual configuration
  - Docker Compose deployment
  - SSL renewal management
  - Monitoring and logs
  - Troubleshooting guide

### Detailed Validation Checklist

**→ Use this to track deployment progress**
- **File**: `SCALEWAY-CHECKLIST.md`
- **Purpose**: 70-point validation checklist for all phases
- **Audience**: Project managers, QA, DevOps
- **Covers**:
  - Pre-deployment preparation
  - Script execution verification
  - Manual configuration validation
  - Service deployment checks
  - HTTPS accessibility tests
  - SSL certificate validation
  - Monitoring and alerting setup
  - Security hardening
  - Backup configuration
  - Documentation handover

### Deliverables Overview

**→ Use this to understand what's included**
- **File**: `SETUP-SUMMARY.md`
- **Purpose**: Summary of scripts, automation level, requirements
- **Audience**: Technical leads, decision makers
- **Contains**:
  - What each script does
  - Automation vs. manual tasks
  - Configuration requirements
  - Security features
  - File structure

---

## 🔧 Scripts Overview

### 1. setup-scaleway.sh

**Purpose**: One-command production server setup

**What it does** (12 automated steps):
1. System updates (apt update/upgrade)
2. Docker installation (docker.io + docker-compose-plugin)
3. Certbot installation (Let's Encrypt)
4. Create non-root `eventy` user
5. Setup UFW firewall (allow 22, 80, 443)
6. Create directory structure (`/home/eventy/eventy-life/`)
7. Generate SSL certificate (3 domains: eventy.life, api.eventy.life, www.eventy.life)
8. Setup SSL auto-renewal cron (2x daily: 00:00, 12:00 UTC)
9. Clone Git repository
10. Create `.env.production` from template
11. Generate random secrets (JWT, Redis)
12. Configure GHCR login (optional)

**How to use**:
```bash
# Method 1: Direct (one-liner)
curl -fsSL https://raw.githubusercontent.com/eventy/eventy-life/main/scripts/setup-scaleway.sh | bash

# Method 2: Local
bash scripts/setup-scaleway.sh

# Method 3: Copy to server
scp scripts/setup-scaleway.sh root@YOUR_IP:/tmp/
ssh root@YOUR_IP "bash /tmp/setup-scaleway.sh"
```

**Features**:
- ✅ Idempotent (safe to run multiple times)
- ✅ Error handling (`set -euo pipefail`)
- ✅ French comments
- ✅ Colored output
- ✅ Auto-generates secrets
- ✅ Final checklist with next steps

**Runtime**: 5-10 minutes
**Prerequisites**: Root access to Scaleway instance, Ubuntu 22.04

**Output**:
- All services configured and ready
- `.env.production` created (values need manual fill)
- Cron job for SSL renewal configured
- Git repository cloned

---

### 2. ssl-renew.sh

**Purpose**: Automatic SSL renewal + Nginx reload (zero downtime)

**What it does**:
1. Runs certbot renewal in non-interactive mode
2. Reloads Nginx (Docker or systemctl)
3. Verifies certificate health
4. Sends notifications on failure
5. Logs all actions

**How it's used**:
- Automatically called by cron job (created by setup-scaleway.sh)
- Can be executed manually for testing
- Run: `sudo /home/eventy/eventy-life/scripts/ssl-renew.sh`

**Cron entry** (auto-created):
```
0 0,12 * * * root /home/eventy/eventy-life/scripts/ssl-renew.sh >> /var/log/eventy-ssl-renew.log 2>&1
```

**Features**:
- ✅ Non-blocking background execution
- ✅ Docker + systemctl support
- ✅ Certificate health monitoring
- ✅ Failure notifications
- ✅ Comprehensive logging

**Logs**: `/var/log/eventy-ssl-renew.log`

**No manual intervention needed** — fully automated

---

## 🚀 Deployment Workflow

### Step 1: Provision Scaleway Instance
```
Create DEV1-S (Ubuntu 22.04) → Get IP → SSH as root
```

### Step 2: Run Setup Script
```bash
bash scripts/setup-scaleway.sh
# Takes 5-10 minutes
# Outputs final checklist
```

### Step 3: Manual Configuration (30 min)
```bash
# Edit environment variables
nano backend/.env.production
# Add: Stripe keys, Resend API, Sentry DSN, S3 credentials, DB URL

# Create Docker Compose
# File: docker-compose.yml
# Template in README-SCALEWAY-SETUP.md

# Create Nginx config
# File: nginx/conf.d/eventy.conf
# Template in README-SCALEWAY-SETUP.md

# Configure DNS
# At your domain registrar (Gandi, OVH, etc.)
# Point A records to Scaleway IP
```

### Step 4: Deploy Services
```bash
cd /home/eventy/eventy-life
docker compose up -d
```

### Step 5: Validate
```bash
# Check HTTPS
curl -I https://eventy.life
curl -I https://api.eventy.life/api/health

# Check certificate
openssl x509 -enddate -noout -in /etc/letsencrypt/live/eventy.life/fullchain.pem

# Check logs
docker logs eventy_backend_1
docker logs eventy_frontend_1
```

**Total time: ~50 minutes**

---

## 📊 What's Automated vs. Manual

| Task | Automated | Manual | Notes |
|------|-----------|--------|-------|
| System updates | ✅ | | apt update/upgrade |
| Docker install | ✅ | | Full setup |
| Certbot install | ✅ | | Let's Encrypt ready |
| SSL certificate | ✅ | | 3 domains |
| SSL auto-renewal | ✅ | | Cron 2x/day |
| Firewall config | ✅ | | UFW rules |
| User creation | ✅ | | `eventy` user |
| Directory structure | ✅ | | `/home/eventy/eventy-life/` |
| Git clone | ✅ | | Repository ready |
| `.env.production` | ⚠️ | ✅ | Template created, values filled manually |
| **docker-compose.yml** | | ✅ | Must create (template provided) |
| **Nginx config** | | ✅ | Must create (template provided) |
| **DNS records** | | ✅ | Must configure at registrar |
| **Service deploy** | | ✅ | `docker compose up -d` |

---

## 🔐 Security Features Built-In

✅ **In scripts**:
- Non-root user (`eventy`) with minimal privileges
- Docker group isolation
- UFW firewall (whitelist 22, 80, 443 only)
- HTTPS/TLS enforced
- SSL auto-renewal (prevents expiry)
- Random secret generation (JWT, Redis)
- Secure file permissions (.env 600)

✅ **In templates**:
- Nginx security headers (HSTS, X-Frame-Options, etc.)
- Docker resource limits
- PostgreSQL SSL enforcement
- CORS configuration
- Cookie security settings

---

## 📞 Support & Maintenance

### For setup questions:
- See `README-SCALEWAY-SETUP.md` → "Dépannage" section
- Consult `QUICK-REFERENCE.txt` → "Troubleshooting Commands"

### For deployment progress:
- Use `SCALEWAY-CHECKLIST.md` to track phases
- Each phase has validation steps

### For ongoing maintenance:
- SSL renewal is **fully automatic** (cron job)
- Docker logs: `docker logs SERVICE_NAME`
- SSL renewal logs: `/var/log/eventy-ssl-renew.log`
- Manual task list in `README-SCALEWAY-SETUP.md` → "Monitoring et logs"

### For emergency:
- David: eventylife@gmail.com
- GitHub Issues: https://github.com/eventy/eventy-life/issues

---

## 📁 Related Files in Project

### Backend configuration
- `/backend/.env.production.example` — Template (already referenced by setup script)
- `/backend/.env.production` — Created by setup, manually filled

### Frontend configuration
- `/frontend/.env.example` — Frontend env template

### Architecture documentation
- `/backend/ARCHITECTURE.md` — Backend system design
- `/frontend/ARCHITECTURE_OVERVIEW.md` — Frontend design
- `/PROGRESS.md` — Technical progress history

### PDG tracking (for David)
- `/pdg-eventy/DASHBOARD-PDG.md` — Update with deployment status
- `/pdg-eventy/04-hebergement-infra/COMPARATIF-CLOUD.md` — Scaleway details
- `/pdg-eventy/05-partenaires/SUIVI-PARTENAIRES.md` — Infrastructure partners

---

## 🎯 Success Criteria

✅ **Setup is successful when**:
- All 4 containers running (backend, frontend, nginx, redis)
- `https://eventy.life` loads completely (no 404s)
- `https://api.eventy.life/api/health` returns 200
- SSL certificate valid (> 60 days before expiry)
- Cron job for SSL renewal configured and working
- `.env.production` filled with all required variables
- Docker logs show no critical errors
- Frontend loads in browser without console errors

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-16 | Initial release: setup-scaleway.sh, ssl-renew.sh, complete documentation |

---

## 📚 How to Use This Index

1. **New to this deployment?**
   → Read `QUICK-REFERENCE.txt` first (5 min)

2. **Ready to deploy?**
   → Follow `README-SCALEWAY-SETUP.md` step-by-step

3. **Tracking progress?**
   → Use `SCALEWAY-CHECKLIST.md` to mark off phases

4. **Need technical overview?**
   → See `SETUP-SUMMARY.md`

5. **Scripts not working?**
   → Check "Troubleshooting" in `README-SCALEWAY-SETUP.md`

---

## ✨ Key Highlights

🎯 **One-command setup** — Entire server configured in 5-10 minutes
🔄 **Idempotent scripts** — Safe to run multiple times
📋 **Comprehensive docs** — 62 KB of documentation
🔒 **Production-hardened** — Security best practices built-in
🤖 **Auto-renewal** — SSL certificates renewed automatically
📊 **Complete validation** — 70-point checklist included
🔧 **Troubleshooting** — Common issues covered
📞 **Support ready** — Contact info and escalation path

---

**Maintained by**: Eventy Life Development Team
**For support**: eventylife@gmail.com
**Repository**: https://github.com/eventy/eventy-life

---

**Last updated**: 2026-03-16
**Status**: ✅ Production Ready
