#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# setup-server.sh — Installation complète serveur Scaleway DEV1-S
#
# Exécuter UNE SEULE FOIS sur un serveur Ubuntu 22.04 fraîchement provisionné.
# Configure tout ce qu'il faut pour déployer Eventy Life.
#
# Usage:
#   ssh root@IP_SERVEUR
#   curl -fsSL https://raw.githubusercontent.com/REPO/main/scripts/setup-server.sh | bash
#   # OU
#   scp scripts/setup-server.sh root@IP_SERVEUR:/tmp/ && ssh root@IP_SERVEUR "bash /tmp/setup-server.sh"
#
# Ce script installe :
# 1. Docker + Docker Compose
# 2. PostgreSQL client (pour pg_dump/pg_restore)
# 3. Certbot (Let's Encrypt)
# 4. Fail2Ban (protection SSH brute force)
# 5. UFW (firewall)
# 6. Logrotate config
# 7. Swap (2GB — utile pour DEV1-S avec 2GB RAM)
# 8. Utilisateur deploy (non-root)
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠ $1${NC}"; }
error() { echo -e "${RED}[$(date '+%H:%M:%S')] ✗ $1${NC}"; exit 1; }

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║    🚀 Eventy Life — Installation serveur         ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║    Scaleway DEV1-S — Ubuntu 22.04                ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Vérifier qu'on est root
if [ "$(id -u)" -ne 0 ]; then
  error "Ce script doit être exécuté en tant que root"
fi

# ── 1. Mise à jour système ──
log "[1/8] Mise à jour du système..."
apt update -qq && apt upgrade -y -qq
apt install -y -qq curl git wget unzip htop nano

# ── 2. Docker ──
log "[2/8] Installation de Docker..."
if command -v docker >/dev/null 2>&1; then
  log "  Docker déjà installé ($(docker --version | cut -d' ' -f3 | tr -d ','))"
else
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "  ✓ Docker installé"
fi

# Docker Compose plugin
if docker compose version >/dev/null 2>&1; then
  log "  Docker Compose déjà installé"
else
  apt install -y -qq docker-compose-plugin
  log "  ✓ Docker Compose installé"
fi

# Docker daemon config (log limits)
if [ ! -f /etc/docker/daemon.json ]; then
  cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "5"
  }
}
EOF
  systemctl restart docker
  log "  ✓ Docker log limits configurés"
fi

# ── 3. PostgreSQL client ──
log "[3/8] Installation de PostgreSQL client..."
apt install -y -qq postgresql-client-14
log "  ✓ pg_dump / pg_restore disponibles"

# ── 4. Certbot ──
log "[4/8] Installation de Certbot..."
apt install -y -qq certbot
log "  ✓ Certbot installé"

# ── 5. Fail2Ban ──
log "[5/8] Installation de Fail2Ban..."
apt install -y -qq fail2ban

cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200
EOF

systemctl enable fail2ban
systemctl restart fail2ban
log "  ✓ Fail2Ban configuré (SSH: 3 tentatives max, ban 2h)"

# ── 6. UFW Firewall ──
log "[6/8] Configuration du firewall (UFW)..."
apt install -y -qq ufw

ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Activer UFW sans prompt
echo "y" | ufw enable
log "  ✓ UFW configuré (SSH + HTTP + HTTPS uniquement)"

# ── 7. Swap (2GB) ──
log "[7/8] Configuration du swap..."
if swapon --show | grep -q "/swapfile"; then
  log "  Swap déjà configuré"
else
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab

  # Optimiser le swappiness pour un serveur web
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  log "  ✓ 2GB swap activé (swappiness=10)"
fi

# ── 8. Répertoire de déploiement ──
log "[8/8] Préparation du répertoire de déploiement..."
mkdir -p /opt/eventy
mkdir -p /opt/eventy/backups/db/{daily,weekly,monthly}
mkdir -p /opt/eventy/backend/logs
mkdir -p /opt/eventy/nginx/{logs,certs}

# ── Résumé ──
echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║    ✅ Installation terminée !                    ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║                                                   ║"
echo "║  Docker:     $(docker --version | cut -d' ' -f3 | tr -d ',')                            ║"
echo "║  Compose:    $(docker compose version | cut -d' ' -f4)                           ║"
echo "║  PostgreSQL: $(psql --version | cut -d' ' -f3)                            ║"
echo "║  Fail2Ban:   Activé                               ║"
echo "║  UFW:        SSH + 80 + 443                       ║"
echo "║  Swap:       2GB                                  ║"
echo "║                                                   ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║  Prochaines étapes :                              ║"
echo "║                                                   ║"
echo "║  1. Cloner le repo dans /opt/eventy               ║"
echo "║     git clone URL /opt/eventy                     ║"
echo "║                                                   ║"
echo "║  2. Configurer SSL                                ║"
echo "║     certbot certonly --standalone \\               ║"
echo "║       -d eventylife.fr \\                          ║"
echo "║       -d api.eventylife.fr                        ║"
echo "║                                                   ║"
echo "║  3. Remplir .env.production                       ║"
echo "║     cp backend/.env.production.example \\          ║"
echo "║        backend/.env.production                    ║"
echo "║     nano backend/.env.production                  ║"
echo "║                                                   ║"
echo "║  4. Déployer                                      ║"
echo "║     cd /opt/eventy && ./deploy.sh                 ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
