#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# deploy.sh — Script de déploiement Eventy Life
# Cible: Scaleway DEV1-S (Ubuntu 22.04)
#
# Usage:
#   ./deploy.sh                    # Déploiement complet
#   ./deploy.sh --backend-only     # Backend uniquement
#   ./deploy.sh --frontend-only    # Frontend uniquement
#   ./deploy.sh --migrate          # Migrations DB uniquement
#   ./deploy.sh --rollback         # Rollback dernière version
#   ./deploy.sh --status           # Vérifier le statut
#
# Prérequis:
#   - Docker + Docker Compose installés
#   - .env.production rempli
#   - Certificats SSL Let's Encrypt
#   - Accès SSH à la machine Scaleway
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Configuration ──
DEPLOY_DIR=$(cd "$(dirname "$0")" && pwd)
APP_NAME="eventy"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="${DEPLOY_DIR}/backups"
LOG_FILE="${DEPLOY_DIR}/deploy.log"
MAX_BACKUPS=5

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Fonctions utilitaires ──
log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠ $1${NC}" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}[$(date '+%H:%M:%S')] ✖ $1${NC}" | tee -a "$LOG_FILE"; exit 1; }
info() { echo -e "${BLUE}[$(date '+%H:%M:%S')] ℹ $1${NC}" | tee -a "$LOG_FILE"; }

# ── Vérifications préalables ──
check_prerequisites() {
  log "Vérification des prérequis..."

  command -v docker >/dev/null 2>&1 || error "Docker non installé"
  command -v docker compose >/dev/null 2>&1 && COMPOSE_CMD="docker compose" || {
    command -v docker-compose >/dev/null 2>&1 && COMPOSE_CMD="docker-compose" || error "Docker Compose non installé"
  }

  [ -f "${DEPLOY_DIR}/backend/.env.production" ] || error "Fichier backend/.env.production manquant"
  [ -f "${DEPLOY_DIR}/${COMPOSE_FILE}" ] || error "Fichier ${COMPOSE_FILE} manquant"
  [ -f "${DEPLOY_DIR}/backend/Dockerfile" ] || error "backend/Dockerfile manquant"
  [ -f "${DEPLOY_DIR}/frontend/Dockerfile" ] || error "frontend/Dockerfile manquant"

  # Vérifier les certificats SSL
  if [ ! -d "${DEPLOY_DIR}/nginx/certs" ]; then
    warn "Répertoire nginx/certs manquant — SSL désactivé"
    warn "Pour activer SSL: certbot certonly --standalone -d eventylife.fr -d api.eventylife.fr"
  fi

  # Vérifier l'espace disque (>2GB requis)
  local free_space
  free_space=$(df -BG "${DEPLOY_DIR}" | tail -1 | awk '{print $4}' | tr -d 'G')
  if [ "$free_space" -lt 2 ]; then
    error "Espace disque insuffisant: ${free_space}GB libre (2GB minimum)"
  fi

  log "✓ Prérequis validés"
}

# ── Backup ──
backup_current() {
  log "Sauvegarde de la version actuelle..."
  mkdir -p "${BACKUP_DIR}"

  local timestamp
  timestamp=$(date '+%Y%m%d_%H%M%S')
  local backup_name="backup_${timestamp}"

  # Sauvegarder les images Docker actuelles
  if docker images | grep -q "${APP_NAME}-backend"; then
    docker save "${APP_NAME}-backend:latest" | gzip > "${BACKUP_DIR}/${backup_name}_backend.tar.gz" 2>/dev/null || true
  fi
  if docker images | grep -q "${APP_NAME}-frontend"; then
    docker save "${APP_NAME}-frontend:latest" | gzip > "${BACKUP_DIR}/${backup_name}_frontend.tar.gz" 2>/dev/null || true
  fi

  # Sauvegarder le .env.production
  cp "${DEPLOY_DIR}/backend/.env.production" "${BACKUP_DIR}/${backup_name}.env.production" 2>/dev/null || true

  # Rotation des backups (garder les MAX_BACKUPS plus récents)
  local count
  count=$(ls -1 "${BACKUP_DIR}"/backup_*.tar.gz 2>/dev/null | wc -l)
  if [ "$count" -gt "$((MAX_BACKUPS * 2))" ]; then
    ls -1t "${BACKUP_DIR}"/backup_*.tar.gz | tail -n +$((MAX_BACKUPS * 2 + 1)) | xargs rm -f
  fi

  log "✓ Backup créé: ${backup_name}"
}

# ── Build ──
build_images() {
  local target="${1:-all}"
  log "Construction des images Docker (${target})..."

  local version
  version=$(git describe --tags --always 2>/dev/null || echo "dev-$(date +%Y%m%d)")

  export APP_VERSION="${version}"

  case "$target" in
    backend)
      $COMPOSE_CMD -f "$COMPOSE_FILE" build --no-cache app
      ;;
    frontend)
      $COMPOSE_CMD -f "$COMPOSE_FILE" build --no-cache frontend
      ;;
    all)
      $COMPOSE_CMD -f "$COMPOSE_FILE" build --no-cache app frontend
      ;;
  esac

  log "✓ Images construites (version: ${version})"
}

# ── Migrations Prisma ──
run_migrations() {
  log "Exécution des migrations Prisma..."

  # Lancer un container temporaire pour les migrations
  $COMPOSE_CMD -f "$COMPOSE_FILE" run --rm \
    --no-deps \
    -e NODE_ENV=production \
    app npx prisma migrate deploy

  log "✓ Migrations appliquées"
}

# ── Déploiement ──
deploy_services() {
  local target="${1:-all}"
  log "Déploiement des services (${target})..."

  case "$target" in
    backend)
      $COMPOSE_CMD -f "$COMPOSE_FILE" up -d --force-recreate app
      ;;
    frontend)
      $COMPOSE_CMD -f "$COMPOSE_FILE" up -d --force-recreate frontend
      ;;
    all)
      $COMPOSE_CMD -f "$COMPOSE_FILE" up -d --force-recreate
      ;;
  esac

  log "✓ Services déployés"
}

# ── Health check ──
wait_for_health() {
  log "Vérification de la santé des services..."
  local max_retries=30
  local retry=0

  # Backend health check
  while [ "$retry" -lt "$max_retries" ]; do
    if curl -sf http://localhost:4000/api/health >/dev/null 2>&1; then
      log "✓ Backend opérationnel"
      break
    fi
    retry=$((retry + 1))
    if [ "$retry" -eq "$max_retries" ]; then
      error "Backend non disponible après ${max_retries} tentatives"
    fi
    sleep 2
  done

  # Frontend health check
  retry=0
  while [ "$retry" -lt "$max_retries" ]; do
    if curl -sf http://localhost:3000 >/dev/null 2>&1; then
      log "✓ Frontend opérationnel"
      break
    fi
    retry=$((retry + 1))
    if [ "$retry" -eq "$max_retries" ]; then
      warn "Frontend non disponible après ${max_retries} tentatives"
      break
    fi
    sleep 2
  done

  # Vérification détaillée
  local health_response
  health_response=$(curl -sf http://localhost:4000/api/health 2>/dev/null || echo '{"status":"unknown"}')
  info "Statut santé: ${health_response}"
}

# ── Rollback ──
rollback() {
  warn "Rollback vers la dernière version..."

  local latest_backend
  latest_backend=$(ls -1t "${BACKUP_DIR}"/backup_*_backend.tar.gz 2>/dev/null | head -1)

  local latest_frontend
  latest_frontend=$(ls -1t "${BACKUP_DIR}"/backup_*_frontend.tar.gz 2>/dev/null | head -1)

  if [ -z "$latest_backend" ] && [ -z "$latest_frontend" ]; then
    error "Aucun backup trouvé pour le rollback"
  fi

  # Arrêter les services
  $COMPOSE_CMD -f "$COMPOSE_FILE" down

  # Restaurer les images
  if [ -n "$latest_backend" ]; then
    docker load < "$latest_backend"
    log "✓ Image backend restaurée depuis $(basename "$latest_backend")"
  fi

  if [ -n "$latest_frontend" ]; then
    docker load < "$latest_frontend"
    log "✓ Image frontend restaurée depuis $(basename "$latest_frontend")"
  fi

  # Redémarrer
  $COMPOSE_CMD -f "$COMPOSE_FILE" up -d

  wait_for_health

  log "✓ Rollback terminé"
}

# ── Statut ──
show_status() {
  log "Statut des services Eventy:"
  echo ""
  $COMPOSE_CMD -f "$COMPOSE_FILE" ps
  echo ""

  # Health check
  if curl -sf http://localhost:4000/api/health >/dev/null 2>&1; then
    local health
    health=$(curl -sf http://localhost:4000/api/health)
    info "Backend: ${health}"
  else
    warn "Backend: NON DISPONIBLE"
  fi

  # Espace disque
  info "Espace disque: $(df -h "${DEPLOY_DIR}" | tail -1 | awk '{print $4}') libre"

  # Mémoire
  info "Mémoire: $(free -h | grep Mem | awk '{print $3"/"$2}')"

  # Logs récents
  echo ""
  info "Derniers logs backend (5 lignes):"
  $COMPOSE_CMD -f "$COMPOSE_FILE" logs --tail=5 app 2>/dev/null || true
}

# ── Nettoyage ──
cleanup() {
  log "Nettoyage Docker..."
  docker image prune -f
  docker container prune -f
  log "✓ Nettoyage terminé"
}

# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║        🚀 Eventy Life — Déploiement          ║"
echo "╠═══════════════════════════════════════════════╣"
echo "║  $(date '+%Y-%m-%d %H:%M:%S')                           ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

case "${1:-}" in
  --rollback)
    check_prerequisites
    rollback
    ;;
  --status)
    show_status
    ;;
  --migrate)
    check_prerequisites
    run_migrations
    ;;
  --backend-only)
    check_prerequisites
    backup_current
    build_images backend
    run_migrations
    deploy_services backend
    wait_for_health
    cleanup
    ;;
  --frontend-only)
    check_prerequisites
    backup_current
    build_images frontend
    deploy_services frontend
    wait_for_health
    cleanup
    ;;
  *)
    # Déploiement complet
    check_prerequisites
    backup_current
    build_images all
    run_migrations
    deploy_services all
    wait_for_health
    cleanup
    log ""
    log "═══════════════════════════════════════════════"
    log "  ✅ Déploiement terminé avec succès !"
    log "  📡 Frontend: https://eventylife.fr"
    log "  📡 API:      https://api.eventylife.fr"
    log "  📡 Health:   https://api.eventylife.fr/api/health"
    log "═══════════════════════════════════════════════"
    ;;
esac
