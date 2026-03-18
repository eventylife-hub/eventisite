#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# smoke-test.sh — Test de fumée post-déploiement
#
# Vérifie que les services critiques fonctionnent après un déploiement.
# Retourne 0 si tout OK, 1 si un test échoue.
#
# Usage:
#   ./scripts/smoke-test.sh                              # Test local
#   ./scripts/smoke-test.sh https://api.eventylife.fr    # Test production
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

API_URL="${1:-http://localhost:4000}"
FRONTEND_URL="${2:-http://localhost:3000}"
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  local expected_body="${4:-}"
  TESTS_TOTAL=$((TESTS_TOTAL + 1))

  local response
  local http_code

  http_code=$(curl -sf -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

  if [ "$http_code" = "$expected_status" ]; then
    if [ -n "$expected_body" ]; then
      response=$(curl -sf --max-time 10 "$url" 2>/dev/null || echo "")
      if echo "$response" | grep -q "$expected_body"; then
        echo -e "  ${GREEN}✓${NC} $name (HTTP $http_code, body OK)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
      else
        echo -e "  ${RED}✗${NC} $name (HTTP $http_code, body manquant: '$expected_body')"
        TESTS_FAILED=$((TESTS_FAILED + 1))
      fi
    else
      echo -e "  ${GREEN}✓${NC} $name (HTTP $http_code)"
      TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
  else
    echo -e "  ${RED}✗${NC} $name (HTTP $http_code, attendu $expected_status)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║    🔬 Smoke Test — Eventy Life                   ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║  API:      $API_URL"
echo "║  Frontend: $FRONTEND_URL"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# ── 1. Health checks ──
echo "📡 Health checks :"
check "Backend health"         "${API_URL}/api/health"         "200" "healthy"
check "Backend readiness"      "${API_URL}/api/health/ready"   "200"
check "Backend liveness"       "${API_URL}/api/health/live"    "200"
check "Frontend health"        "${FRONTEND_URL}/api/health"    "200" "ok"

# ── 2. API publiques ──
echo ""
echo "🌍 API publiques :"
check "Liste voyages"          "${API_URL}/api/public/travels"  "200"
check "SEO sitemap data"       "${API_URL}/api/seo/sitemap-data" "200"

# ── 3. Auth ──
echo ""
echo "🔐 Auth :"
check "Register (sans body)"   "${API_URL}/api/auth/register"  "422"
check "Login (sans body)"      "${API_URL}/api/auth/login"     "422"

# ── 4. Sécurité ──
echo ""
echo "🛡️ Sécurité :"
check "Endpoint protégé sans token"  "${API_URL}/api/client/profile" "401"
check "Admin sans token"       "${API_URL}/api/admin/dashboard" "401"
check "Swagger désactivé prod" "${API_URL}/api/docs"           "403"

# ── 5. Webhook ──
echo ""
echo "💳 Stripe webhook :"
check "Webhook sans signature" "${API_URL}/api/payments/webhook" "400"

# ── 6. Headers sécurité ──
echo ""
echo "🔒 Headers sécurité :"
HEADERS=$(curl -sI --max-time 10 "${API_URL}/api/health" 2>/dev/null || echo "")
TESTS_TOTAL=$((TESTS_TOTAL + 1))
if echo "$HEADERS" | grep -qi "strict-transport-security"; then
  echo -e "  ${GREEN}✓${NC} HSTS header présent"
  TESTS_PASSED=$((TESTS_PASSED + 1))
else
  echo -e "  ${YELLOW}⚠${NC} HSTS header absent (normal en HTTP local)"
  TESTS_PASSED=$((TESTS_PASSED + 1))  # Pas un échec en local
fi

TESTS_TOTAL=$((TESTS_TOTAL + 1))
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
  echo -e "  ${GREEN}✓${NC} X-Content-Type-Options présent"
  TESTS_PASSED=$((TESTS_PASSED + 1))
else
  echo -e "  ${RED}✗${NC} X-Content-Type-Options absent"
  TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# ── 7. Frontend pages ──
echo ""
echo "🖥️ Frontend pages :"
check "Page d'accueil"         "${FRONTEND_URL}/"             "200"
check "Page voyages"           "${FRONTEND_URL}/voyages"      "200"
check "Page 404"               "${FRONTEND_URL}/page-inexistante-xyz" "404"

# ── Résultat ──
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Résultat: ${TESTS_PASSED}/${TESTS_TOTAL} passés, ${TESTS_FAILED} échoué(s)"

if [ "$TESTS_FAILED" -eq 0 ]; then
  echo -e "  ${GREEN}✅ SMOKE TEST PASSÉ — Le déploiement est OK${NC}"
  exit 0
else
  echo -e "  ${RED}❌ SMOKE TEST ÉCHOUÉ — ${TESTS_FAILED} test(s) en échec${NC}"
  echo ""
  echo "  Vérifiez :"
  echo "    - docker compose -f docker-compose.prod.yml logs app"
  echo "    - docker compose -f docker-compose.prod.yml logs frontend"
  echo "    - ./deploy.sh --status"
  exit 1
fi
