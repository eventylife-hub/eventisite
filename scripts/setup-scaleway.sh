#!/bin/bash

################################################################################
# SETUP SCALEWAY DEV1-S — EVENTY LIFE PRODUCTION SERVER
# ============================================================================
# Script de configuration d'une instance Scaleway DEV1-S (Ubuntu 22.04)
# pour déployer Eventy Life en production.
#
# USAGE:
#   ssh root@YOUR_SCALEWAY_IP
#   curl -fsSL https://raw.githubusercontent.com/eventy/eventy-life/main/scripts/setup-scaleway.sh | bash
#
# OU localement:
#   bash ./scripts/setup-scaleway.sh
#
# Idempotent: peut être exécuté plusieurs fois sans risque.
################################################################################

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────

EVENTY_USER="eventy"
EVENTY_HOME="/home/${EVENTY_USER}"
EVENTY_APP="${EVENTY_HOME}/eventy-life"
DOMAINS=(eventy.life api.eventy.life www.eventy.life)
ADMIN_EMAIL="eventylife@gmail.com"
GIT_REPO_URL="https://github.com/eventy/eventy-life.git"

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ──────────────────────────────────────────────────────────────────────────
# FONCTIONS UTILITAIRES
# ──────────────────────────────────────────────────────────────────────────

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si en tant que root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        exit 1
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# 1. MISE À JOUR SYSTÈME
# ──────────────────────────────────────────────────────────────────────────

update_system() {
    log_info "Mise à jour du système..."
    apt-get update -qq
    apt-get upgrade -y -qq
    apt-get install -y curl wget git vim htop net-tools unzip 2>/dev/null
    log_success "Système mis à jour"
}

# ──────────────────────────────────────────────────────────────────────────
# 2. INSTALLATION DOCKER
# ──────────────────────────────────────────────────────────────────────────

install_docker() {
    log_info "Installation de Docker..."

    if command -v docker &> /dev/null; then
        log_warn "Docker déjà installé"
        return 0
    fi

    # Installer Docker depuis le repo officiel
    apt-get install -y docker.io docker-compose-plugin 2>/dev/null
    systemctl enable docker
    systemctl start docker

    log_success "Docker installé"
}

# ──────────────────────────────────────────────────────────────────────────
# 3. INSTALLATION CERTBOT (Let's Encrypt)
# ──────────────────────────────────────────────────────────────────────────

install_certbot() {
    log_info "Installation de Certbot..."

    if command -v certbot &> /dev/null; then
        log_warn "Certbot déjà installé"
        return 0
    fi

    apt-get install -y certbot python3-certbot-nginx 2>/dev/null
    log_success "Certbot installé"
}

# ──────────────────────────────────────────────────────────────────────────
# 4. CRÉER UTILISATEUR EVENTY (NON-ROOT)
# ──────────────────────────────────────────────────────────────────────────

create_eventy_user() {
    log_info "Création de l'utilisateur '${EVENTY_USER}'..."

    if id "${EVENTY_USER}" &>/dev/null; then
        log_warn "Utilisateur ${EVENTY_USER} existe déjà"
        return 0
    fi

    useradd -m -s /bin/bash "${EVENTY_USER}"
    usermod -aG docker "${EVENTY_USER}"

    # Créer le dossier SSH pour connexions futures
    mkdir -p "${EVENTY_HOME}/.ssh"
    chmod 700 "${EVENTY_HOME}/.ssh"

    log_success "Utilisateur ${EVENTY_USER} créé (membre du groupe docker)"
}

# ──────────────────────────────────────────────────────────────────────────
# 5. CONFIGURATION FIREWALL UFW
# ──────────────────────────────────────────────────────────────────────────

setup_firewall() {
    log_info "Configuration du firewall UFW..."

    if ! command -v ufw &> /dev/null; then
        apt-get install -y ufw 2>/dev/null
    fi

    # Reset et règles de base
    echo "y" | ufw reset 2>/dev/null || true
    ufw default deny incoming
    ufw default allow outgoing

    # Ouvrir les ports
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS

    # Activer UFW
    echo "y" | ufw enable 2>/dev/null || true

    log_success "Firewall UFW configuré (SSH, HTTP, HTTPS)"
}

# ──────────────────────────────────────────────────────────────────────────
# 6. CRÉER LA STRUCTURE DE RÉPERTOIRES
# ──────────────────────────────────────────────────────────────────────────

create_directory_structure() {
    log_info "Création de la structure de répertoires..."

    mkdir -p "${EVENTY_APP}/nginx/certs"
    mkdir -p "${EVENTY_APP}/backups"
    mkdir -p "${EVENTY_APP}/logs"

    # Définir les permissions
    chown -R "${EVENTY_USER}:${EVENTY_USER}" "${EVENTY_APP}"
    chmod 755 "${EVENTY_APP}"
    chmod 755 "${EVENTY_APP}/nginx"
    chmod 755 "${EVENTY_APP}/nginx/certs"
    chmod 755 "${EVENTY_APP}/backups"
    chmod 755 "${EVENTY_APP}/logs"

    log_success "Structure de répertoires créée"
}

# ──────────────────────────────────────────────────────────────────────────
# 7. GÉNÉRER LE CERTIFICAT SSL (Let's Encrypt)
# ──────────────────────────────────────────────────────────────────────────

generate_ssl_cert() {
    log_info "Génération du certificat SSL Let's Encrypt..."

    # Construire les domaines pour certbot
    local domain_args=""
    for domain in "${DOMAINS[@]}"; do
        domain_args="${domain_args} -d ${domain}"
    done

    # Créer le certificat si non existant
    if [[ ! -f "/etc/letsencrypt/live/eventy.life/fullchain.pem" ]]; then
        certbot certonly \
            --standalone \
            ${domain_args} \
            --email "${ADMIN_EMAIL}" \
            --agree-tos \
            --non-interactive \
            --preferred-challenges http

        log_success "Certificat SSL généré"
    else
        log_warn "Certificat SSL existe déjà"
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# 8. CONFIGURATION DU RENOUVELLEMENT AUTOMATIQUE (CRON)
# ──────────────────────────────────────────────────────────────────────────

setup_ssl_renewal() {
    log_info "Configuration du renouvellement automatique SSL..."

    # Créer le script de renouvellement
    local renewal_script="${EVENTY_APP}/scripts/ssl-renew.sh"
    mkdir -p "${EVENTY_APP}/scripts"

    # Le contenu sera créé séparément (voir ssl-renew.sh)

    # Ajouter la tâche cron (renouvellement 2x par jour)
    local cron_job="0 0,12 * * * root ${renewal_script} >> /var/log/eventy-ssl-renew.log 2>&1"
    local cron_file="/etc/cron.d/eventy-ssl-renew"

    if [[ ! -f "${cron_file}" ]]; then
        echo "${cron_job}" > "${cron_file}"
        chmod 644 "${cron_file}"
        log_success "Tâche cron configurée pour renouvellement SSL"
    else
        log_warn "Tâche cron SSL existe déjà"
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# 9. CLONER LE REPOSITORY
# ──────────────────────────────────────────────────────────────────────────

clone_repository() {
    log_info "Clonage du repository Eventy Life..."

    if [[ -d "${EVENTY_APP}/.git" ]]; then
        log_warn "Repository déjà cloné, mise à jour..."
        cd "${EVENTY_APP}"
        sudo -u "${EVENTY_USER}" git pull origin main
        return 0
    fi

    cd "${EVENTY_HOME}"
    sudo -u "${EVENTY_USER}" git clone "${GIT_REPO_URL}" eventy-life

    log_success "Repository cloné"
}

# ──────────────────────────────────────────────────────────────────────────
# 10. CRÉER .ENV.PRODUCTION
# ──────────────────────────────────────────────────────────────────────────

setup_env_production() {
    log_info "Création du fichier .env.production..."

    local env_file="${EVENTY_APP}/backend/.env.production"
    local example_file="${EVENTY_APP}/backend/.env.production.example"

    if [[ -f "${env_file}" ]]; then
        log_warn ".env.production existe déjà (non écrasé)"
        return 0
    fi

    if [[ ! -f "${example_file}" ]]; then
        log_error "Fichier .env.production.example introuvable"
        return 1
    fi

    # Copier l'exemple et remplacer les valeurs de placeholder
    cp "${example_file}" "${env_file}"

    # Générer des secrets JWT aléatoires
    local jwt_secret_1=$(openssl rand -base64 64)
    local jwt_secret_2=$(openssl rand -base64 64)
    local jwt_secret_3=$(openssl rand -base64 64)
    local jwt_secret_4=$(openssl rand -base64 64)
    local redis_password=$(openssl rand -base64 32)

    # Remplacer les secrets (fonction utilitaire pour macOS/Linux)
    if command -v sed &> /dev/null; then
        sed -i "s|CHANGEME_ACCESS_SECRET_MIN_64_CHARS|${jwt_secret_1}|g" "${env_file}"
        sed -i "s|CHANGEME_REFRESH_SECRET_MIN_64_CHARS|${jwt_secret_2}|g" "${env_file}"
        sed -i "s|CHANGEME_VERIF_SECRET_MIN_64_CHARS|${jwt_secret_3}|g" "${env_file}"
        sed -i "s|CHANGEME_RESET_SECRET_MIN_64_CHARS|${jwt_secret_4}|g" "${env_file}"
        sed -i "s|CHANGEME_REDIS_PASSWORD|${redis_password}|g" "${env_file}"
    fi

    chown "${EVENTY_USER}:${EVENTY_USER}" "${env_file}"
    chmod 600 "${env_file}"

    log_success ".env.production créé (secrets générés)"
    log_warn "⚠️  ÉDITER MANUELLEMENT LES VALEURS SENSIBLES:"
    log_warn "   - DATABASE_URL (PostgreSQL Scaleway)"
    log_warn "   - STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET"
    log_warn "   - AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY (S3)"
    log_warn "   - RESEND_API_KEY (Email)"
    log_warn "   - Sentry DSN"
}

# ──────────────────────────────────────────────────────────────────────────
# 11. DOCKER LOGIN GHCR (GitHub Container Registry)
# ──────────────────────────────────────────────────────────────────────────

docker_login_ghcr() {
    log_info "Configuration Docker login GHCR..."

    log_warn "ℹ️  Une authentification GHCR est nécessaire pour les images privées"
    log_warn "   Créer un Personal Access Token (PAT) sur GitHub :"
    log_warn "   https://github.com/settings/tokens (scope: read:packages)"

    read -p "Voulez-vous configurer GHCR maintenant? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "GitHub username: " gh_username
        read -sp "PAT (ne sera pas affiché): " gh_token
        echo

        echo "${gh_token}" | sudo -u "${EVENTY_USER}" docker login ghcr.io -u "${gh_username}" --password-stdin
        log_success "GHCR login effectué"
    else
        log_warn "Configuration GHCR ignorée (à faire manuellement)"
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# 12. AFFICHER LA CHECKLIST FINALE
# ──────────────────────────────────────────────────────────────────────────

print_final_checklist() {
    cat << 'EOF'

╔════════════════════════════════════════════════════════════════════════════╗
║                    SETUP SCALEWAY COMPLÉTÉ ✓                              ║
╚════════════════════════════════════════════════════════════════════════════╝

🎯 PROCHAINES ÉTAPES MANUELLES :

1️⃣  COMPLÉTER LES VARIABLES D'ENVIRONNEMENT
   Éditer le fichier (en tant qu'utilisateur eventy) :
   $ sudo -u eventy nano /home/eventy/eventy-life/backend/.env.production

   Obligatoires:
   - DATABASE_URL        (PostgreSQL Scaleway RDB)
   - STRIPE_*_KEY        (Clés LIVE Stripe)
   - AWS_*_KEY_ID        (Scaleway Object Storage)
   - RESEND_API_KEY      (Email service)
   - SENTRY_DSN          (Error tracking)

2️⃣  VÉRIFIER LES CERTIFICATS SSL
   $ ls -la /etc/letsencrypt/live/eventy.life/

   Certificats attendus:
   ✓ fullchain.pem
   ✓ privkey.pem

3️⃣  CONFIGURER DOCKER COMPOSE
   Placer docker-compose.yml dans:
   /home/eventy/eventy-life/docker-compose.yml

   Services attendus:
   - backend (NestJS 4000)
   - frontend (Next.js 3000)
   - nginx (reverse proxy 80/443)
   - postgres (BD, optionnel - utiliser RDB Scaleway)
   - redis (cache)

4️⃣  LANCER LES SERVICES
   $ sudo -u eventy docker compose -f /home/eventy/eventy-life/docker-compose.yml up -d

5️⃣  VÉRIFIER LA SANTÉ DE L'APPLICATION
   $ docker ps
   $ docker logs eventy_backend_1 (ou nom du conteneur)
   $ curl https://api.eventy.life/api/health

6️⃣  CONFIGURER LES DOMAINES (DNS)
   Pointer A records vers l'IP Scaleway:
   eventy.life       → 51.xxx.xxx.xxx
   www.eventy.life   → 51.xxx.xxx.xxx
   api.eventy.life   → 51.xxx.xxx.xxx

7️⃣  RENOUVELLEMENT SSL AUTOMATIQUE
   Vérifié via cron:
   0 0,12 * * * root /home/eventy/eventy-life/scripts/ssl-renew.sh

8️⃣  BACKUP AUTOMATIQUE (OPTIONNEL)
   Créer une tâche cron pour les backups BD/data:
   $ crontab -e
   # Exemple: 0 3 * * * mysqldump ... > /home/eventy/eventy-life/backups/...

═════════════════════════════════════════════════════════════════════════════

📋 RÉSUMÉ DES CONFIGURATIONS

  Utilisateur:           eventy
  Home directory:        /home/eventy
  Application:           /home/eventy/eventy-life
  SSL certs:             /etc/letsencrypt/live/eventy.life/
  Firewall:              UFW (SSH 22, HTTP 80, HTTPS 443)
  Docker:                Installé et activé
  Certbot:               Installé + auto-renew cron (2x/jour)

═════════════════════════════════════════════════════════════════════════════

📞 CONTACTS SUPPORT
  Admin email:           eventylife@gmail.com
  Documentation:         https://github.com/eventy/eventy-life
  Scaleway dashboard:    https://console.scaleway.com

EOF
}

# ──────────────────────────────────────────────────────────────────────────
# ORCHESTRATION PRINCIPALE
# ──────────────────────────────────────────────────────────────────────────

main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  SETUP SCALEWAY DEV1-S — EVENTY LIFE PRODUCTION           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo

    check_root

    update_system
    install_docker
    install_certbot
    create_eventy_user
    setup_firewall
    create_directory_structure
    generate_ssl_cert
    setup_ssl_renewal
    clone_repository
    setup_env_production
    docker_login_ghcr

    echo
    print_final_checklist

    log_success "Setup termciné ! Prêt pour la production ✨"
}

# Exécution
main "$@"
