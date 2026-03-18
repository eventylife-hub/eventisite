#!/bin/bash

################################################################################
# SSL RENEWAL ET NGINX RELOAD — EVENTY LIFE
# ============================================================================
# Script de renouvellement SSL Let's Encrypt avec rechargement Nginx
# Conçu pour être appelé par cron (2x par jour)
#
# CRON: 0 0,12 * * * root /home/eventy/eventy-life/scripts/ssl-renew.sh
#
# Log: /var/log/eventy-ssl-renew.log
################################################################################

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────

CERTBOT_PATH="/usr/bin/certbot"
DOCKER_COMPOSE_PATH="/home/eventy/eventy-life/docker-compose.yml"
EVENTY_CONTAINER_NAME="eventy_nginx_1"  # Adapter si nécessaire
LOG_FILE="/var/log/eventy-ssl-renew.log"
DOMAINS=(eventy.life api.eventy.life www.eventy.life)

# Couleurs (optionnelles, utiles pour debug)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ──────────────────────────────────────────────────────────────────────────
# FONCTIONS DE LOG
# ──────────────────────────────────────────────────────────────────────────

log_timestamp() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')]"
}

log_info() {
    echo "$(log_timestamp) [INFO] $1" >> "${LOG_FILE}"
}

log_success() {
    echo "$(log_timestamp) [✓] $1" >> "${LOG_FILE}"
}

log_error() {
    echo "$(log_timestamp) [ERROR] $1" >> "${LOG_FILE}"
}

log_warn() {
    echo "$(log_timestamp) [WARN] $1" >> "${LOG_FILE}"
}

# ──────────────────────────────────────────────────────────────────────────
# RENOUVELLEMENT SSL
# ──────────────────────────────────────────────────────────────────────────

renew_ssl() {
    log_info "Démarrage du renouvellement SSL..."

    if [[ ! -f "${CERTBOT_PATH}" ]]; then
        log_error "Certbot introuvable à ${CERTBOT_PATH}"
        return 1
    fi

    # Utiliser le mode non-interactif avec hooks de renouvellement
    if ${CERTBOT_PATH} renew \
        --non-interactive \
        --quiet \
        --deploy-hook "/home/eventy/eventy-life/scripts/ssl-renew.sh.d/post-renew.sh"; then
        log_success "Renouvellement SSL effectué avec succès"
        return 0
    else
        log_warn "Aucun certificat n'avait besoin de renouvellement"
        return 0
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# RECHARGEMENT NGINX (via Docker Compose)
# ──────────────────────────────────────────────────────────────────────────

reload_nginx() {
    log_info "Rechargement de Nginx..."

    # Méthode 1: Via Docker Compose (si Nginx est en conteneur)
    if [[ -f "${DOCKER_COMPOSE_PATH}" ]]; then
        cd "/home/eventy/eventy-life"

        # Recharger Nginx via docker exec (sans redémarrage)
        if docker compose exec -T "${EVENTY_CONTAINER_NAME}" nginx -s reload 2>/dev/null; then
            log_success "Nginx rechargé via docker compose"
            return 0
        else
            log_warn "Docker Compose Nginx exec échoué, tentative avec systemctl..."
        fi
    fi

    # Méthode 2: Via systemctl (si Nginx est sur l'hôte)
    if systemctl is-active --quiet nginx; then
        if systemctl reload nginx; then
            log_success "Nginx rechargé via systemctl"
            return 0
        else
            log_error "Erreur lors du rechargement Nginx (systemctl)"
            return 1
        fi
    fi

    log_error "Nginx introuvable (Docker ni systemctl)"
    return 1
}

# ──────────────────────────────────────────────────────────────────────────
# VÉRIFICATION SANTÉ CERTIFICAT
# ──────────────────────────────────────────────────────────────────────────

check_certificate_health() {
    log_info "Vérification de la santé du certificat..."

    local cert_path="/etc/letsencrypt/live/eventy.life/fullchain.pem"

    if [[ ! -f "${cert_path}" ]]; then
        log_error "Certificat introuvable: ${cert_path}"
        return 1
    fi

    # Extraire la date d'expiration
    local expiry_date=$(openssl x509 -enddate -noout -in "${cert_path}" | cut -d= -f2)
    local expiry_epoch=$(date -d "${expiry_date}" +%s)
    local now_epoch=$(date +%s)
    local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))

    if [[ ${days_left} -lt 0 ]]; then
        log_error "Certificat EXPIRÉ depuis $((days_left * -1)) jours !"
        return 1
    elif [[ ${days_left} -lt 7 ]]; then
        log_warn "Certificat expire dans ${days_left} jours (CRITIQUE)"
        return 2
    elif [[ ${days_left} -lt 30 ]]; then
        log_warn "Certificat expire dans ${days_left} jours"
        return 0
    else
        log_success "Certificat valide pour ${days_left} jours"
        return 0
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# NOTIFICATION (OPTIONNEL)
# ──────────────────────────────────────────────────────────────────────────

send_notification() {
    local subject=$1
    local message=$2

    # Optionnel: envoyer un email si mail est configuré
    if command -v mail &> /dev/null; then
        echo "${message}" | mail -s "[Eventy] ${subject}" eventylife@gmail.com
        log_info "Notification email envoyée"
    fi
}

# ──────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────

main() {
    {
        log_info "╔════════════════════════════════════════════╗"
        log_info "║  SSL RENEWAL & NGINX RELOAD - EVENTY LIFE  ║"
        log_info "╚════════════════════════════════════════════╝"
        log_info "Exécuté par cron - $(date)"

        # Étape 1: Renouvellement
        if ! renew_ssl; then
            log_error "Renouvellement SSL échoué"
            send_notification "SSL Renewal FAILED" "Le renouvellement du certificat SSL a échoué. Intervention manuelle requise."
            exit 1
        fi

        # Étape 2: Rechargement Nginx
        if ! reload_nginx; then
            log_error "Rechargement Nginx échoué"
            send_notification "Nginx Reload FAILED" "Le rechargement de Nginx a échoué après renouvellement SSL."
            exit 1
        fi

        # Étape 3: Vérification santé
        check_certificate_health
        cert_status=$?

        if [[ ${cert_status} -eq 1 ]]; then
            log_error "Certificat invalide détecté"
            send_notification "Certificate Health CHECK FAILED" "Le certificat est invalide ou expiré."
            exit 1
        fi

        if [[ ${cert_status} -eq 2 ]]; then
            send_notification "Certificate Expiring Soon" "Le certificat expire bientôt. Vérifier le processus de renouvellement."
        fi

        log_success "╔════════════════════════════════════════════╗"
        log_success "║  SSL RENEWAL & NGINX RELOAD - SUCCÈS ✓    ║"
        log_success "╚════════════════════════════════════════════╝"

    } 2>&1 | tee -a "${LOG_FILE}"
}

# ──────────────────────────────────────────────────────────────────────────
# EXÉCUTION
# ──────────────────────────────────────────────────────────────────────────

# S'assurer que le fichier log existe
mkdir -p "$(dirname "${LOG_FILE}")"
touch "${LOG_FILE}"

main "$@"
