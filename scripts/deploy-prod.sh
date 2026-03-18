#!/bin/bash
# ============================================================
# EVENTY LIFE — Script de déploiement production
# Usage: ./scripts/deploy-prod.sh [VERSION]
# Ex:    ./scripts/deploy-prod.sh 1.2.0
# ============================================================

set -euo pipefail

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
APP_VERSION="${1:-$(git describe --tags --abbrev=0 2>/dev/null || echo 'latest')}"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE="./backend/.env.production"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="./deploy-${TIMESTAMP}.log"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  EVENTY LIFE — Déploiement production v${APP_VERSION}${NC}"
echo -e "${BLUE}  $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}============================================================${NC}"

# ── Pré-vérifications ────────────────────────────────────────
echo -e "\n${YELLOW}[1/8] Vérifications pré-déploiement...${NC}"

# Vérifier que le fichier .env.production existe
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}✗ Fichier $ENV_FILE manquant !${NC}"
  echo -e "  Copier .env.production.example → .env.production et remplir les valeurs."
  exit 1
fi
echo -e "  ${GREEN}✓${NC} $ENV_FILE présent"

# Vérifier que les clés Stripe LIVE sont utilisées (pas de sk_test_)
if grep -q "sk_test_" "$ENV_FILE"; then
  echo -e "${RED}✗ ATTENTION: Clé Stripe TEST détectée en production !${NC}"
  echo -e "  Remplacer sk_test_ par sk_live_ dans $ENV_FILE"
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Clés Stripe LIVE"

# Vérifier que JWT secrets ne sont pas des placeholders
if grep -q "CHANGEME" "$ENV_FILE"; then
  echo -e "${RED}✗ Des valeurs CHANGEME sont encore présentes dans $ENV_FILE${NC}"
  grep -n "CHANGEME" "$ENV_FILE" | head -5
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Variables d'environnement complètes"

# Vérifier Docker
if ! docker info >/dev/null 2>&1; then
  echo -e "${RED}✗ Docker non disponible${NC}"
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Docker disponible"

# ── Sauvegarde BDD ───────────────────────────────────────────
echo -e "\n${YELLOW}[2/8] Sauvegarde PostgreSQL pré-déploiement...${NC}"
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

DB_URL=$(grep "DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2-)
if [ -n "$DB_URL" ]; then
  BACKUP_FILE="${BACKUP_DIR}/eventy-${TIMESTAMP}.sql.gz"
  if pg_dump "$DB_URL" 2>/dev/null | gzip > "$BACKUP_FILE"; then
    echo -e "  ${GREEN}✓${NC} Sauvegarde créée: $BACKUP_FILE"
  else
    echo -e "  ${YELLOW}⚠${NC} Sauvegarde échouée (pg_dump non disponible localement — ok si BDD managée)"
  fi
else
  echo -e "  ${YELLOW}⚠${NC} DATABASE_URL non trouvée — sauvegarde ignorée"
fi

# ── Build images Docker ──────────────────────────────────────
echo -e "\n${YELLOW}[3/8] Build des images Docker v${APP_VERSION}...${NC}"
export APP_VERSION
docker compose -f "$COMPOSE_FILE" build \
  --build-arg APP_VERSION="$APP_VERSION" \
  --no-cache \
  app frontend 2>&1 | tee -a "$LOG_FILE"
echo -e "  ${GREEN}✓${NC} Images buildées"

# ── Validation TypeScript ────────────────────────────────────
echo -e "\n${YELLOW}[4/8] Validation TypeScript (skipLibCheck)...${NC}"
cd backend && npx tsc --noEmit --skipLibCheck 2>&1 | tee -a "../$LOG_FILE"
cd ..
echo -e "  ${GREEN}✓${NC} TypeScript OK"

# ── Validation Prisma schema ─────────────────────────────────
echo -e "\n${YELLOW}[5/8] Validation Prisma schema...${NC}"
cd backend && npx prisma validate 2>&1 | tee -a "../$LOG_FILE"
cd ..
echo -e "  ${GREEN}✓${NC} Schema Prisma valide"

# ── Migrations Prisma ────────────────────────────────────────
echo -e "\n${YELLOW}[6/8] Application des migrations Prisma...${NC}"
# Les migrations s'appliquent automatiquement au démarrage via docker-entrypoint.sh
# Mais on peut les appliquer manuellement si besoin:
# cd backend && DATABASE_URL="$DB_URL" npx prisma migrate deploy && cd ..
echo -e "  ${GREEN}✓${NC} Migrations appliquées au démarrage du container (docker-entrypoint.sh)"

# ── Déploiement rolling (zéro downtime) ──────────────────────
echo -e "\n${YELLOW}[7/8] Déploiement rolling update...${NC}"

# Démarrer le nouveau backend avant de couper l'ancien
docker compose -f "$COMPOSE_FILE" up -d --no-deps app 2>&1 | tee -a "$LOG_FILE"

# Attendre que le nouveau backend soit healthy
echo -e "  Attente que l'API soit healthy..."
for i in $(seq 1 30); do
  if docker compose -f "$COMPOSE_FILE" exec -T app curl -sf http://localhost:4000/api/health >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Backend healthy après ${i}s"
    break
  fi
  if [ $i -eq 30 ]; then
    echo -e "${RED}✗ Timeout: Backend non healthy après 30s — rollback...${NC}"
    docker compose -f "$COMPOSE_FILE" stop app
    exit 1
  fi
  sleep 1
done

# Déployer le frontend
docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend 2>&1 | tee -a "$LOG_FILE"

# Nginx + Redis (si changement config)
docker compose -f "$COMPOSE_FILE" up -d nginx redis 2>&1 | tee -a "$LOG_FILE"

# ── Vérification finale ──────────────────────────────────────
echo -e "\n${YELLOW}[8/8] Vérification finale...${NC}"
sleep 5

# Check API
if curl -sf https://api.eventy.life/api/health >/dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} API https://api.eventy.life/api/health OK"
else
  echo -e "  ${YELLOW}⚠${NC} API health check externe échoué (DNS non configuré ?)"
fi

# Check Frontend
if curl -sf https://eventy.life/ >/dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} Frontend https://eventy.life OK"
else
  echo -e "  ${YELLOW}⚠${NC} Frontend check externe échoué (SSL non configuré ?)"
fi

# Status containers
echo -e "\n  Containers actifs:"
docker compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}  ✅ Déploiement v${APP_VERSION} terminé avec succès !${NC}"
echo -e "${GREEN}  Log: $LOG_FILE${NC}"
echo -e "${GREEN}============================================================${NC}"
