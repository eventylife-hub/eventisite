#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# deploy-wizard.sh — Assistant de déploiement interactif
#
# Guide pas-à-pas pour le premier déploiement en production.
# Vérifie chaque étape et ne passe à la suivante que si OK.
#
# Usage:
#   ./scripts/deploy-wizard.sh
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

step_num=0
total_steps=9

step() {
  step_num=$((step_num + 1))
  echo ""
  echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
  echo -e "${BOLD}  Étape ${step_num}/${total_steps} — $1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
  echo ""
}

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
info() { echo -e "  ${BLUE}ℹ${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }

wait_for_user() {
  echo ""
  read -r -p "  Appuyez sur Entrée pour continuer (ou 'q' pour quitter)... " input
  if [ "$input" = "q" ]; then
    echo "Déploiement interrompu."
    exit 0
  fi
}

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║    🚀 Eventy Life — Assistant de déploiement     ║"
echo "║    Production — Scaleway DEV1-S                   ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║    Durée estimée : ~1h                            ║"
echo "║    Prérequis : accès SSH au serveur               ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
read -r -p "Prêt à commencer ? (o/n) " ready
if [ "$ready" != "o" ] && [ "$ready" != "O" ]; then
  echo "OK, revenez quand vous êtes prêt !"
  exit 0
fi

# ── Étape 1: Docker ──
step "Vérifier Docker"

if command -v docker >/dev/null 2>&1; then
  pass "Docker installé ($(docker --version | cut -d' ' -f3 | tr -d ','))"
else
  fail "Docker non installé"
  info "Installez Docker avec : curl -fsSL https://get.docker.com | sh"
  info "Ou lancez : sudo ./scripts/setup-server.sh"
  wait_for_user
fi

if command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1; then
  pass "Docker Compose disponible"
else
  fail "Docker Compose non installé"
  info "Installez avec : apt install docker-compose-plugin"
  wait_for_user
fi

# ── Étape 2: .env.production ──
step "Vérifier .env.production"

ENV_FILE="${PROJECT_DIR}/backend/.env.production"
if [ -f "$ENV_FILE" ]; then
  pass ".env.production existe"

  # Vérifier les variables critiques
  vars_ok=true
  for var in DATABASE_URL JWT_SECRET JWT_REFRESH_SECRET STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET FRONTEND_URL; do
    val=$(grep "^${var}=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- | tr -d '"')
    if [ -z "$val" ] || echo "$val" | grep -q "your_"; then
      fail "$var non configuré"
      vars_ok=false
    else
      pass "$var configuré"
    fi
  done

  if [ "$vars_ok" = false ]; then
    warn "Certaines variables ne sont pas configurées."
    info "Éditez : nano ${ENV_FILE}"
    wait_for_user
  fi
else
  fail ".env.production manquant"
  info "Créez-le : cp backend/.env.production.example backend/.env.production"
  info "Puis éditez : nano backend/.env.production"
  wait_for_user
fi

# ── Étape 3: SSL ──
step "Vérifier les certificats SSL"

CERT_DIR="${PROJECT_DIR}/nginx/certs"
if [ -d "${CERT_DIR}/eventylife.fr" ] && [ -f "${CERT_DIR}/eventylife.fr/fullchain.pem" ]; then
  pass "Certificat eventylife.fr trouvé"
else
  warn "Certificat eventylife.fr manquant"
  info "Générez-le avec :"
  info "  certbot certonly --standalone -d eventylife.fr -d www.eventylife.fr"
  info "  mkdir -p nginx/certs/eventylife.fr"
  info "  cp /etc/letsencrypt/live/eventylife.fr/* nginx/certs/eventylife.fr/"
  wait_for_user
fi

if [ -d "${CERT_DIR}/api.eventylife.fr" ] && [ -f "${CERT_DIR}/api.eventylife.fr/fullchain.pem" ]; then
  pass "Certificat api.eventylife.fr trouvé"
else
  warn "Certificat api.eventylife.fr manquant"
  info "Générez-le avec :"
  info "  certbot certonly --standalone -d api.eventylife.fr"
  info "  mkdir -p nginx/certs/api.eventylife.fr"
  info "  cp /etc/letsencrypt/live/api.eventylife.fr/* nginx/certs/api.eventylife.fr/"
  wait_for_user
fi

# ── Étape 4: Pre-deploy check ──
step "Vérification pré-déploiement"

info "Lancement du script de vérification..."
if "${PROJECT_DIR}/pre-deploy-check.sh" --quick; then
  pass "Vérification pré-déploiement OK"
else
  warn "Des erreurs ont été détectées. Corrigez-les avant de continuer."
  wait_for_user
fi

# ── Étape 5: Build + Deploy ──
step "Construction et déploiement"

echo "  Cette étape va :"
echo "    1. Construire les images Docker (backend + frontend)"
echo "    2. Exécuter les migrations Prisma"
echo "    3. Démarrer les services"
echo "    4. Vérifier la santé"
echo ""
read -r -p "  Lancer le déploiement ? (o/n) " deploy_confirm
if [ "$deploy_confirm" = "o" ] || [ "$deploy_confirm" = "O" ]; then
  "${PROJECT_DIR}/deploy.sh"
else
  warn "Déploiement sauté. Vous pouvez le lancer plus tard avec : ./deploy.sh"
  wait_for_user
fi

# ── Étape 6: Smoke test ──
step "Smoke test"

info "Lancement du smoke test..."
if "${PROJECT_DIR}/scripts/smoke-test.sh"; then
  pass "Smoke test passé"
else
  warn "Certains tests ont échoué. Vérifiez les logs."
  info "Logs backend : docker compose -f docker-compose.prod.yml logs app"
  wait_for_user
fi

# ── Étape 7: Stripe webhook ──
step "Configuration Stripe webhook"

echo "  Actions manuelles requises :"
echo ""
echo "  1. Allez sur https://dashboard.stripe.com/webhooks"
echo "  2. Cliquez 'Add endpoint'"
echo "  3. URL : https://api.eventylife.fr/api/payments/webhook"
echo "  4. Events :"
echo "     - checkout.session.completed"
echo "     - checkout.session.expired"
echo "     - payment_intent.payment_failed"
echo "     - charge.refunded"
echo "     - charge.dispute.created"
echo "  5. Copiez le 'Signing secret' (whsec_...)"
echo "  6. Mettez-le dans .env.production : STRIPE_WEBHOOK_SECRET=whsec_..."
echo "  7. Redémarrez : ./deploy.sh --backend-only"
echo ""
read -r -p "  Webhook configuré ? (o/n) " webhook_done
if [ "$webhook_done" = "o" ]; then
  pass "Webhook Stripe configuré"
else
  warn "N'oubliez pas de configurer le webhook Stripe !"
fi

# ── Étape 8: Backups ──
step "Configuration des backups"

echo "  Configurez les CRON de backup :"
echo ""
echo "  crontab -e"
echo "  # Puis ajoutez :"
echo "  0 3 * * * /opt/eventy/scripts/backup-db.sh >> /var/log/eventy-backup.log 2>&1"
echo "  0 4 * * 0 /opt/eventy/scripts/backup-db.sh --weekly >> /var/log/eventy-backup.log 2>&1"
echo "  0 5 1 * * /opt/eventy/scripts/backup-db.sh --monthly >> /var/log/eventy-backup.log 2>&1"
echo ""
read -r -p "  Backups configurés ? (o/n) " backups_done
if [ "$backups_done" = "o" ]; then
  pass "Backups configurés"
else
  warn "Configurez les backups dès que possible !"
fi

# ── Étape 9: Seed (optionnel) ──
step "Seed données de test (optionnel)"

read -r -p "  Voulez-vous injecter les données de test staging ? (o/n) " seed_confirm
if [ "$seed_confirm" = "o" ]; then
  docker compose -f "${PROJECT_DIR}/docker-compose.prod.yml" exec app npx ts-node prisma/seed-staging.ts
  pass "Données de test injectées"
else
  info "Pas de seed — la base est vide (production propre)"
fi

# ── Résumé final ──
echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║    ✅ DÉPLOIEMENT TERMINÉ !                      ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║                                                   ║"
echo "║  🌐 Frontend : https://eventylife.fr              ║"
echo "║  📡 API      : https://api.eventylife.fr          ║"
echo "║  ❤️  Health   : https://api.eventylife.fr/api/health ║"
echo "║  📊 Admin    : https://eventylife.fr/admin         ║"
echo "║                                                   ║"
echo "║  📧 Login admin : admin@eventy.life               ║"
echo "║                                                   ║"
echo "║  Commandes utiles :                               ║"
echo "║    make status   — Vérifier le statut             ║"
echo "║    make logs     — Voir les logs                  ║"
echo "║    make backup   — Backup DB                      ║"
echo "║    make rollback — Rollback urgence               ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "Bravo David ! Eventy Life est en ligne ! 🎉"
