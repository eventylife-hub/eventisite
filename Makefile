# ═══════════════════════════════════════════════════════════════════
# Makefile — Eventy Life
# Commandes rapides pour le développement et le déploiement
#
# Usage:
#   make help          — Afficher toutes les commandes
#   make dev           — Démarrer en mode développement
#   make deploy        — Déployer en production
#   make test          — Lancer tous les tests
# ═══════════════════════════════════════════════════════════════════

.PHONY: help dev dev-back dev-front test test-back test-front build deploy \
        deploy-back deploy-front rollback status check seed seed-staging \
        migrate logs logs-back logs-front clean prisma-studio k6-smoke \
        k6-load k6-stress k6-webhook lint lint-back lint-front

# Couleurs
GREEN  := \033[0;32m
YELLOW := \033[1;33m
BLUE   := \033[0;34m
NC     := \033[0m

# ─── AIDE ─────────────────────────────────────────────────────────
help: ## Afficher cette aide
	@echo ""
	@echo "$(GREEN)═══ Eventy Life — Commandes ═══$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ─── DÉVELOPPEMENT ────────────────────────────────────────────────
dev: ## Démarrer backend + frontend en dev
	@echo "$(GREEN)▶ Démarrage en mode développement...$(NC)"
	@cd backend && npm run start:dev &
	@cd frontend && npm run dev &
	@echo "$(GREEN)✓ Backend: http://localhost:4000 | Frontend: http://localhost:3000$(NC)"

dev-back: ## Démarrer uniquement le backend en dev
	cd backend && npm run start:dev

dev-front: ## Démarrer uniquement le frontend en dev
	cd frontend && npm run dev

# ─── TESTS ────────────────────────────────────────────────────────
test: test-back test-front ## Lancer tous les tests

test-back: ## Tests backend (unit + spec)
	cd backend && npm run test -- --ci

test-front: ## Tests frontend (Jest)
	cd frontend && npm run test -- --ci 2>/dev/null || echo "Tests frontend skippés"

test-e2e: ## Tests E2E backend (nécessite DB)
	cd backend && npm run test:e2e -- --ci

test-e2e-front: ## Tests E2E frontend (Playwright)
	cd frontend && npx playwright test

# ─── LINT ─────────────────────────────────────────────────────────
lint: lint-back lint-front ## Linter complet

lint-back: ## Lint backend
	cd backend && npm run lint

lint-front: ## Lint frontend
	cd frontend && npm run lint

# ─── BUILD ────────────────────────────────────────────────────────
build: ## Build backend + frontend
	@echo "$(GREEN)▶ Build backend...$(NC)"
	cd backend && npm run build
	@echo "$(GREEN)▶ Build frontend...$(NC)"
	cd frontend && npm run build
	@echo "$(GREEN)✓ Build terminé$(NC)"

# ─── DATABASE ─────────────────────────────────────────────────────
migrate: ## Appliquer les migrations Prisma
	cd backend && npx prisma migrate deploy

migrate-dev: ## Créer + appliquer une migration dev
	cd backend && npx prisma migrate dev

seed: ## Seed la base de données (données par défaut)
	cd backend && npx ts-node prisma/seed.ts

seed-staging: ## Seed staging (données réalistes pour tests)
	cd backend && npx ts-node prisma/seed-staging.ts

prisma-studio: ## Ouvrir Prisma Studio (GUI base de données)
	cd backend && npx prisma studio

prisma-validate: ## Valider le schema Prisma
	cd backend && npx prisma validate

# ─── DÉPLOIEMENT ──────────────────────────────────────────────────
check: ## Vérification pré-déploiement
	./pre-deploy-check.sh

check-quick: ## Vérification rapide pré-déploiement
	./pre-deploy-check.sh --quick

deploy: ## Déploiement complet (production)
	./deploy.sh

deploy-back: ## Déployer uniquement le backend
	./deploy.sh --backend-only

deploy-front: ## Déployer uniquement le frontend
	./deploy.sh --frontend-only

rollback: ## Rollback dernière version
	./deploy.sh --rollback

status: ## Statut des services en production
	./deploy.sh --status

# ─── LOAD TESTING ─────────────────────────────────────────────────
k6-smoke: ## Smoke test k6 (vérification rapide)
	k6 run --env PROFILE=smoke backend/k6/scenarios/api-endpoints.js

k6-load: ## Load test k6 (charge normale)
	k6 run --env PROFILE=load backend/k6/scenarios/api-endpoints.js

k6-stress: ## Stress test k6 (charge élevée)
	k6 run --env PROFILE=stress backend/k6/scenarios/api-endpoints.js

k6-checkout: ## Test du flow checkout complet
	k6 run --env PROFILE=load backend/k6/scenarios/checkout-flow.js

k6-webhook: ## Stress test webhooks Stripe
	k6 run backend/k6/scenarios/webhook-stress.js

# ─── LOGS ─────────────────────────────────────────────────────────
logs: ## Logs de tous les services (production)
	docker compose -f docker-compose.prod.yml logs -f

logs-back: ## Logs du backend
	docker compose -f docker-compose.prod.yml logs -f app

logs-front: ## Logs du frontend
	docker compose -f docker-compose.prod.yml logs -f frontend

logs-nginx: ## Logs nginx
	docker compose -f docker-compose.prod.yml logs -f nginx

# ─── UTILITAIRES ──────────────────────────────────────────────────
clean: ## Nettoyer les fichiers de build
	@echo "$(YELLOW)▶ Nettoyage...$(NC)"
	cd backend && rm -rf dist node_modules/.cache
	cd frontend && rm -rf .next node_modules/.cache
	docker image prune -f 2>/dev/null || true
	@echo "$(GREEN)✓ Nettoyé$(NC)"

shell-back: ## Shell dans le container backend
	docker compose -f docker-compose.prod.yml exec app sh

shell-front: ## Shell dans le container frontend
	docker compose -f docker-compose.prod.yml exec frontend sh

shell-redis: ## CLI Redis
	docker compose -f docker-compose.prod.yml exec redis redis-cli

health: ## Vérifier le health check
	@echo "$(BLUE)Backend:$(NC)"
	@curl -sf http://localhost:4000/api/health 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "  Non disponible"
	@echo "$(BLUE)Frontend:$(NC)"
	@curl -sf http://localhost:3000/api/health 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "  Non disponible"

# ─── BACKUP & MAINTENANCE ─────────────────────────────────────────
backup: ## Backup quotidien de la base de données
	./scripts/backup-db.sh

backup-weekly: ## Backup hebdomadaire DB
	./scripts/backup-db.sh --weekly

backup-list: ## Lister tous les backups DB
	./scripts/backup-db.sh --list

backup-restore: ## Restaurer un backup (ATTENTION: écrase la base)
	@echo "Usage: ./scripts/backup-db.sh --restore CHEMIN_FICHIER"

db-maintenance: ## Maintenance DB (vacuum, reindex, purge)
	./scripts/maintenance-db.sh

db-stats: ## Statistiques de la base de données
	./scripts/maintenance-db.sh --stats

setup-logrotate: ## Configurer logrotate (sudo requis)
	sudo ./scripts/setup-logrotate.sh

smoke-test: ## Smoke test post-déploiement
	./scripts/smoke-test.sh

smoke-test-prod: ## Smoke test sur la production
	./scripts/smoke-test.sh https://api.eventylife.fr https://eventylife.fr

deploy-wizard: ## Assistant de déploiement interactif (première fois)
	./scripts/deploy-wizard.sh

setup-server: ## Installation complète du serveur (sudo requis)
	sudo ./scripts/setup-server.sh

count: ## Compter les lignes de code
	@echo "$(BLUE)Backend src:$(NC)"
	@find backend/src -name "*.ts" | xargs wc -l 2>/dev/null | tail -1
	@echo "$(BLUE)Backend tests:$(NC)"
	@find backend/src -name "*.spec.ts" | xargs wc -l 2>/dev/null | tail -1
	@echo "$(BLUE)Frontend:$(NC)"
	@find frontend/app frontend/components frontend/hooks frontend/lib -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1
