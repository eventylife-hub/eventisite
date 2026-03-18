#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# setup-logrotate.sh — Configuration logrotate + Docker log limits
#
# Usage (à exécuter une fois sur le serveur de production) :
#   sudo ./scripts/setup-logrotate.sh
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

echo "🔧 Configuration logrotate pour Eventy Life..."

# ── 1. Logrotate pour les logs applicatifs ──
cat > /etc/logrotate.d/eventy <<'EOF'
# Logs backend NestJS (Winston)
/opt/eventy/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 nodejs nodejs
    dateext
    dateformat -%Y%m%d
    sharedscripts
    postrotate
        # Signaler à Winston de rouvrir les fichiers
        docker compose -f /opt/eventy/docker-compose.prod.yml exec -T app kill -USR2 1 2>/dev/null || true
    endscript
}

# Logs nginx
/opt/eventy/nginx/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 root root
    dateext
    dateformat -%Y%m%d
    sharedscripts
    postrotate
        docker compose -f /opt/eventy/docker-compose.prod.yml exec -T nginx nginx -s reopen 2>/dev/null || true
    endscript
}

# Logs backup
/var/log/eventy-backup.log {
    weekly
    missingok
    rotate 4
    compress
    notifempty
    create 0644 root root
}
EOF

echo "✓ Logrotate configuré dans /etc/logrotate.d/eventy"

# ── 2. Docker daemon log limits ──
# Limiter la taille des logs Docker (JSON file driver)
mkdir -p /etc/docker
if [ -f /etc/docker/daemon.json ]; then
  # Vérifier si log-opts existe déjà
  if grep -q "log-opts" /etc/docker/daemon.json; then
    echo "⚠ Docker daemon.json existe déjà avec log-opts — pas de modification"
  else
    echo "⚠ Docker daemon.json existe — ajoutez manuellement les log-opts"
  fi
else
  cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "5"
  }
}
EOF
  echo "✓ Docker log limits configurés (50MB × 5 fichiers par container)"
  echo "  Redémarrer Docker : systemctl restart docker"
fi

# ── 3. Créer les répertoires de logs ──
mkdir -p /opt/eventy/backend/logs
mkdir -p /opt/eventy/nginx/logs

echo ""
echo "✅ Logrotate configuré !"
echo ""
echo "Vérification : logrotate -d /etc/logrotate.d/eventy"
echo "Test forcé   : logrotate -f /etc/logrotate.d/eventy"
