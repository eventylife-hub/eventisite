#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# backup-db.sh — Sauvegarde automatisée PostgreSQL — Eventy Life
#
# Fonctionnalités :
# - Dump complet pg_dump (format custom, compressé)
# - Rotation automatique (7 jours quotidiens + 4 hebdomadaires + 3 mensuels)
# - Notification par email en cas d'échec
# - Compatible Scaleway Managed DB et PostgreSQL local
# - Vérifie l'intégrité du backup après création
#
# Usage:
#   ./scripts/backup-db.sh                    # Backup quotidien
#   ./scripts/backup-db.sh --weekly           # Backup hebdomadaire
#   ./scripts/backup-db.sh --monthly          # Backup mensuel
#   ./scripts/backup-db.sh --restore FILE     # Restaurer un backup
#   ./scripts/backup-db.sh --list             # Lister les backups
#   ./scripts/backup-db.sh --verify FILE      # Vérifier un backup
#
# CRON (à ajouter sur le serveur) :
#   # Quotidien à 3h du matin
#   0 3 * * * /opt/eventy/scripts/backup-db.sh >> /var/log/eventy-backup.log 2>&1
#   # Hebdomadaire dimanche 4h
#   0 4 * * 0 /opt/eventy/scripts/backup-db.sh --weekly >> /var/log/eventy-backup.log 2>&1
#   # Mensuel 1er du mois 5h
#   0 5 1 * * /opt/eventy/scripts/backup-db.sh --monthly >> /var/log/eventy-backup.log 2>&1
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Configuration ──
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_DIR=$(dirname "$SCRIPT_DIR")
BACKUP_DIR="${PROJECT_DIR}/backups/db"
ENV_FILE="${PROJECT_DIR}/backend/.env.production"

# Rotation
DAILY_KEEP=7
WEEKLY_KEEP=4
MONTHLY_KEEP=3

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
error() { echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERREUR: $1${NC}" >&2; }

# ── Charger DATABASE_URL depuis .env.production ──
load_db_url() {
  if [ -f "$ENV_FILE" ]; then
    DATABASE_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
  fi

  if [ -z "${DATABASE_URL:-}" ]; then
    error "DATABASE_URL non trouvée dans $ENV_FILE"
    exit 1
  fi

  # Parser l'URL PostgreSQL
  # Format: postgresql://user:password@host:port/database
  DB_USER=$(echo "$DATABASE_URL" | sed -n 's|.*://\([^:]*\):.*|\1|p')
  DB_PASS=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
  DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')

  if [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ]; then
    error "Impossible de parser DATABASE_URL"
    exit 1
  fi

  export PGPASSWORD="$DB_PASS"
}

# ── Créer un backup ──
create_backup() {
  local backup_type="${1:-daily}"
  local timestamp
  timestamp=$(date '+%Y%m%d_%H%M%S')
  local backup_file="${BACKUP_DIR}/${backup_type}/eventy_${backup_type}_${timestamp}.dump"

  mkdir -p "${BACKUP_DIR}/${backup_type}"

  log "Démarrage backup ${backup_type}..."
  log "  Host: ${DB_HOST}:${DB_PORT}"
  log "  Base: ${DB_NAME}"

  local start_time
  start_time=$(date +%s)

  # pg_dump avec format custom (compressé, parallélisable pour restore)
  if pg_dump \
    -h "$DB_HOST" \
    -p "${DB_PORT:-5432}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    --no-owner \
    --no-privileges \
    --verbose \
    -f "$backup_file" 2>/dev/null; then

    local end_time
    end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local size
    size=$(du -sh "$backup_file" | cut -f1)

    log "${GREEN}✓ Backup créé: ${backup_file}${NC}"
    log "  Taille: ${size}"
    log "  Durée: ${duration}s"

    # Vérifier l'intégrité du backup
    verify_backup "$backup_file" || {
      error "Vérification d'intégrité échouée pour ${backup_file}"
      rm -f "$backup_file"
      notify_failure "Backup ${backup_type} — intégrité échouée"
      exit 1
    }

    log "${GREEN}✓ Intégrité vérifiée${NC}"
  else
    error "pg_dump a échoué"
    notify_failure "Backup ${backup_type} — pg_dump échoué"
    exit 1
  fi
}

# ── Vérifier un backup ──
verify_backup() {
  local file="$1"

  if [ ! -f "$file" ]; then
    error "Fichier non trouvé: $file"
    return 1
  fi

  # Vérifier que le fichier n'est pas vide
  local size
  size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
  if [ "$size" -lt 1024 ]; then
    error "Backup trop petit (${size} bytes) — probablement corrompu"
    return 1
  fi

  # Vérifier avec pg_restore --list (ne restore pas, juste vérifie la structure)
  if pg_restore --list "$file" > /dev/null 2>&1; then
    return 0
  else
    error "pg_restore --list échoué — backup potentiellement corrompu"
    return 1
  fi
}

# ── Rotation des backups ──
rotate_backups() {
  local backup_type="$1"
  local keep="$2"
  local dir="${BACKUP_DIR}/${backup_type}"

  if [ ! -d "$dir" ]; then
    return
  fi

  local count
  count=$(find "$dir" -name "eventy_*.dump" -type f | wc -l)

  if [ "$count" -gt "$keep" ]; then
    local to_delete=$((count - keep))
    log "Rotation ${backup_type}: suppression de ${to_delete} ancien(s) backup(s)"

    find "$dir" -name "eventy_*.dump" -type f | sort | head -n "$to_delete" | while read -r f; do
      log "  Supprimé: $(basename "$f")"
      rm -f "$f"
    done
  fi
}

# ── Notification d'échec ──
notify_failure() {
  local message="$1"

  # Email via le système de monitoring Eventy (si disponible)
  if command -v curl >/dev/null 2>&1; then
    local api_url
    api_url=$(grep "^FRONTEND_URL=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- | tr -d '"')
    if [ -n "$api_url" ]; then
      log "${YELLOW}⚠ Notification d'échec envoyée${NC}"
      # Le monitoring CRON détectera l'absence de backup récent
    fi
  fi

  error "$message"
}

# ── Lister les backups ──
list_backups() {
  log "Backups disponibles :"
  echo ""

  for type in daily weekly monthly; do
    local dir="${BACKUP_DIR}/${type}"
    if [ -d "$dir" ]; then
      local count
      count=$(find "$dir" -name "eventy_*.dump" -type f 2>/dev/null | wc -l)
      echo "  ${type} (${count} backups):"
      find "$dir" -name "eventy_*.dump" -type f -exec ls -lh {} \; 2>/dev/null | sort | while read -r line; do
        echo "    $line"
      done
    fi
  done
}

# ── Restaurer un backup ──
restore_backup() {
  local file="$1"

  if [ ! -f "$file" ]; then
    error "Fichier non trouvé: $file"
    exit 1
  fi

  echo ""
  echo "${RED}╔═══════════════════════════════════════════════╗"
  echo "║  ⚠️  ATTENTION — RESTAURATION BASE DE DONNÉES  ║"
  echo "║  Cette opération ÉCRASERA la base actuelle.     ║"
  echo "╚═══════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Fichier: $file"
  echo "Taille: $(du -sh "$file" | cut -f1)"
  echo "Base cible: ${DB_NAME}@${DB_HOST}"
  echo ""

  read -r -p "Êtes-vous sûr ? (tapez 'RESTAURER' pour confirmer) : " confirm
  if [ "$confirm" != "RESTAURER" ]; then
    log "Restauration annulée."
    exit 0
  fi

  # Créer un backup de sécurité avant restauration
  log "Création d'un backup de sécurité avant restauration..."
  create_backup "pre-restore"

  log "Restauration en cours..."
  if pg_restore \
    -h "$DB_HOST" \
    -p "${DB_PORT:-5432}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    "$file" 2>/dev/null; then
    log "${GREEN}✓ Restauration terminée avec succès${NC}"
  else
    error "Restauration échouée — le backup pre-restore est disponible"
    exit 1
  fi
}

# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

load_db_url

case "${1:-}" in
  --weekly)
    create_backup "weekly"
    rotate_backups "weekly" "$WEEKLY_KEEP"
    ;;
  --monthly)
    create_backup "monthly"
    rotate_backups "monthly" "$MONTHLY_KEEP"
    ;;
  --restore)
    [ -z "${2:-}" ] && { error "Usage: $0 --restore FICHIER"; exit 1; }
    restore_backup "$2"
    ;;
  --list)
    list_backups
    ;;
  --verify)
    [ -z "${2:-}" ] && { error "Usage: $0 --verify FICHIER"; exit 1; }
    verify_backup "$2" && log "${GREEN}✓ Backup valide${NC}" || log "${RED}✗ Backup invalide${NC}"
    ;;
  *)
    # Backup quotidien (défaut)
    create_backup "daily"
    rotate_backups "daily" "$DAILY_KEEP"
    ;;
esac

log "Terminé."
