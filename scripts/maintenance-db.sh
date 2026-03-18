#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# maintenance-db.sh — Maintenance PostgreSQL automatisée
#
# Exécute les tâches de maintenance périodiques :
# 1. VACUUM ANALYZE (récupérer l'espace, mettre à jour les statistiques)
# 2. REINDEX des tables critiques
# 3. Rapport de taille des tables
# 4. Vérification des connexions actives
# 5. Purge des données expirées (sessions, events anciens)
#
# Usage:
#   ./scripts/maintenance-db.sh              # Maintenance complète
#   ./scripts/maintenance-db.sh --stats      # Stats uniquement
#   ./scripts/maintenance-db.sh --purge      # Purge données anciennes
#
# CRON (hebdomadaire, dimanche 2h) :
#   0 2 * * 0 /opt/eventy/scripts/maintenance-db.sh >> /var/log/eventy-maintenance.log 2>&1
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_DIR=$(dirname "$SCRIPT_DIR")
ENV_FILE="${PROJECT_DIR}/backend/.env.production"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# Charger DATABASE_URL
if [ -f "$ENV_FILE" ]; then
  DATABASE_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
fi
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERREUR: DATABASE_URL non trouvée" >&2
  exit 1
fi

DB_USER=$(echo "$DATABASE_URL" | sed -n 's|.*://\([^:]*\):.*|\1|p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
export PGPASSWORD="$DB_PASS"

run_sql() {
  psql -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -t -A -c "$1" 2>/dev/null
}

# ── Stats de la base ──
show_stats() {
  log "📊 Statistiques de la base de données"
  echo ""

  log "Taille totale de la base :"
  run_sql "SELECT pg_size_pretty(pg_database_size('${DB_NAME}'));"

  echo ""
  log "Top 10 tables par taille :"
  run_sql "
    SELECT
      schemaname || '.' || tablename AS table_name,
      pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
      pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS data_size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
    LIMIT 10;
  " | column -t -s '|'

  echo ""
  log "Nombre de lignes par table :"
  run_sql "
    SELECT
      relname AS table_name,
      n_live_tup AS row_count
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY n_live_tup DESC
    LIMIT 15;
  " | column -t -s '|'

  echo ""
  log "Connexions actives :"
  run_sql "
    SELECT count(*) AS total,
           count(*) FILTER (WHERE state = 'active') AS active,
           count(*) FILTER (WHERE state = 'idle') AS idle
    FROM pg_stat_activity
    WHERE datname = '${DB_NAME}';
  "

  echo ""
  log "Index inutilisés (0 scans) :"
  run_sql "
    SELECT
      schemaname || '.' || relname AS table_name,
      indexrelname AS index_name,
      pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
      AND schemaname = 'public'
    ORDER BY pg_relation_size(indexrelid) DESC
    LIMIT 10;
  " | column -t -s '|'
}

# ── VACUUM ANALYZE ──
vacuum_analyze() {
  log "🧹 VACUUM ANALYZE en cours..."

  local start_time
  start_time=$(date +%s)

  # VACUUM ANALYZE sur toutes les tables
  run_sql "VACUUM ANALYZE;" 2>/dev/null || {
    log "${YELLOW}⚠ VACUUM global échoué — essai table par table${NC}"
    for table in $(run_sql "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"); do
      run_sql "VACUUM ANALYZE public.\"${table}\";" 2>/dev/null || true
    done
  }

  local duration=$(( $(date +%s) - start_time ))
  log "${GREEN}✓ VACUUM ANALYZE terminé en ${duration}s${NC}"
}

# ── REINDEX tables critiques ──
reindex_critical() {
  log "🔧 REINDEX des tables critiques..."

  local critical_tables=(
    "BookingGroup"
    "PaymentContribution"
    "User"
    "Travel"
    "StripeEvent"
    "EmailOutbox"
    "JobRun"
  )

  for table in "${critical_tables[@]}"; do
    if run_sql "SELECT 1 FROM pg_tables WHERE tablename = '${table}' AND schemaname = 'public';" | grep -q "1"; then
      run_sql "REINDEX TABLE CONCURRENTLY public.\"${table}\";" 2>/dev/null || {
        # CONCURRENTLY pas supporté sur certaines versions — fallback
        run_sql "REINDEX TABLE public.\"${table}\";" 2>/dev/null || true
      }
      log "  ✓ ${table}"
    fi
  done

  log "${GREEN}✓ REINDEX terminé${NC}"
}

# ── Purge données anciennes ──
purge_old_data() {
  log "🗑️ Purge des données anciennes..."

  # Purger les StripeEvents >90 jours (gardés pour l'idempotence, pas besoin au-delà)
  local deleted_events
  deleted_events=$(run_sql "DELETE FROM public.\"StripeEvent\" WHERE \"processedAt\" < NOW() - INTERVAL '90 days' RETURNING id;" | wc -l)
  log "  StripeEvent: ${deleted_events} supprimé(s) (>90 jours)"

  # Purger les JobRun SUCCESS >30 jours (garder les FAILED pour investigation)
  local deleted_jobs
  deleted_jobs=$(run_sql "DELETE FROM public.\"JobRun\" WHERE status = 'SUCCESS' AND \"startedAt\" < NOW() - INTERVAL '30 days' RETURNING id;" | wc -l)
  log "  JobRun SUCCESS: ${deleted_jobs} supprimé(s) (>30 jours)"

  # Purger les EmailOutbox SENT >60 jours
  local deleted_emails
  deleted_emails=$(run_sql "DELETE FROM public.\"EmailOutbox\" WHERE status = 'SENT' AND \"sentAt\" < NOW() - INTERVAL '60 days' RETURNING id;" | wc -l)
  log "  EmailOutbox SENT: ${deleted_emails} supprimé(s) (>60 jours)"

  log "${GREEN}✓ Purge terminée${NC}"
}

# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

log "═══ Maintenance PostgreSQL — Eventy Life ═══"
log "Base: ${DB_NAME}@${DB_HOST}:${DB_PORT:-5432}"
echo ""

case "${1:-}" in
  --stats)
    show_stats
    ;;
  --purge)
    purge_old_data
    vacuum_analyze
    ;;
  *)
    # Maintenance complète
    show_stats
    echo ""
    vacuum_analyze
    echo ""
    reindex_critical
    echo ""
    purge_old_data
    echo ""
    log "═══ Maintenance terminée ═══"
    ;;
esac
