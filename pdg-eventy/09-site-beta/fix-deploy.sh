#!/bin/bash
# =============================================================
# Eventy Backend — Script de finalisation post-cloud-init
# À exécuter en SSH sur le serveur : ssh root@163.172.189.137
# Créé le 21/03/2026
# =============================================================
set -e
exec > >(tee -a /var/log/eventy-fix.log) 2>&1
echo "=== Eventy Fix Start: $(date) ==="

# -------------------------------------------------------
# 1. Vérifier que le build cloud-init est terminé
# -------------------------------------------------------
echo "--- Vérification du build cloud-init ---"
if [ -f /opt/eventy/app/backend/dist/main.js ]; then
    echo "✅ Build NestJS OK — dist/main.js existe"
else
    echo "❌ Build pas encore terminé ou échoué !"
    echo "Vérifiez : tail -100 /var/log/eventy-deploy.log"
    echo "Si le build est encore en cours, attendez et relancez ce script."
    exit 1
fi

# -------------------------------------------------------
# 2. Installer PostgreSQL
# -------------------------------------------------------
echo "--- Installation PostgreSQL ---"
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL déjà installé"
else
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    echo "✅ PostgreSQL installé et démarré"
fi

# -------------------------------------------------------
# 3. Créer la base de données et l'utilisateur
# -------------------------------------------------------
echo "--- Configuration base de données ---"
# Vérifier si l'utilisateur existe déjà
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='eventy'" | grep -q 1; then
    echo "✅ Utilisateur 'eventy' existe déjà"
else
    sudo -u postgres psql -c "CREATE USER eventy WITH PASSWORD 'eventy-prod-2026!' CREATEDB;"
    echo "✅ Utilisateur 'eventy' créé"
fi

# Vérifier si la base existe déjà
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='eventy'" | grep -q 1; then
    echo "✅ Base de données 'eventy' existe déjà"
else
    sudo -u postgres createdb -O eventy eventy
    echo "✅ Base de données 'eventy' créée"
fi

# -------------------------------------------------------
# 4. Mettre à jour le .env avec la bonne DATABASE_URL
# -------------------------------------------------------
echo "--- Mise à jour .env ---"
ENV_FILE="/opt/eventy/app/backend/.env"

if [ -f "$ENV_FILE" ]; then
    # Remplacer la DATABASE_URL
    sed -i 's|DATABASE_URL=postgresql://localhost:5432/eventy|DATABASE_URL=postgresql://eventy:eventy-prod-2026!@localhost:5432/eventy|' "$ENV_FILE"

    # Vérifier que JWT_SECRET n'est pas trop simple — le remplacer par un vrai secret
    NEW_JWT_SECRET=$(openssl rand -hex 32)
    sed -i "s|JWT_SECRET=eventy-jwt-secret-prod-2026|JWT_SECRET=${NEW_JWT_SECRET}|" "$ENV_FILE"

    echo "✅ .env mis à jour (DATABASE_URL + JWT_SECRET sécurisé)"
    echo "   JWT_SECRET généré : ${NEW_JWT_SECRET:0:8}... (tronqué pour sécurité)"
else
    echo "❌ Fichier .env non trouvé à ${ENV_FILE}"
    echo "Copie depuis le template cloud-init..."
    cp /opt/eventy/.env.production "$ENV_FILE"
    sed -i 's|DATABASE_URL=postgresql://localhost:5432/eventy|DATABASE_URL=postgresql://eventy:eventy-prod-2026!@localhost:5432/eventy|' "$ENV_FILE"
    NEW_JWT_SECRET=$(openssl rand -hex 32)
    sed -i "s|JWT_SECRET=eventy-jwt-secret-prod-2026|JWT_SECRET=${NEW_JWT_SECRET}|" "$ENV_FILE"
    echo "✅ .env créé et configuré"
fi

# -------------------------------------------------------
# 5. Lancer les migrations Prisma
# -------------------------------------------------------
echo "--- Migrations Prisma ---"
cd /opt/eventy/app/backend
export NODE_OPTIONS="--max-old-space-size=3072"

# Charger les variables d'env pour Prisma
export $(grep -v '^#' .env | xargs)

npx prisma migrate deploy 2>&1 || {
    echo "⚠️ prisma migrate deploy a échoué — tentative avec db push"
    npx prisma db push --accept-data-loss 2>&1 || {
        echo "❌ Prisma db push aussi échoué. Vérifiez les logs."
        exit 1
    }
}
echo "✅ Migrations Prisma appliquées"

# -------------------------------------------------------
# 6. Seed de la base (données initiales)
# -------------------------------------------------------
echo "--- Seed base de données ---"
npx prisma db seed 2>&1 || {
    echo "⚠️ Seed échoué (peut-être pas de script seed configuré) — on continue"
}

# -------------------------------------------------------
# 7. Redémarrer PM2
# -------------------------------------------------------
echo "--- Redémarrage PM2 ---"
cd /opt/eventy/app/backend

# Arrêter l'ancien process s'il existe
pm2 delete eventy-backend 2>/dev/null || true

# Démarrer avec les bonnes variables d'environnement
pm2 start dist/main.js \
    --name eventy-backend \
    -i 1 \
    --max-memory-restart 2G \
    --env production

pm2 save
echo "✅ PM2 redémarré"

# -------------------------------------------------------
# 8. Attendre que le serveur démarre
# -------------------------------------------------------
echo "--- Attente démarrage NestJS (max 30s) ---"
for i in $(seq 1 30); do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ NestJS répond sur /api/health !"
        curl -s http://localhost:3000/api/health
        echo ""
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️ NestJS ne répond pas encore après 30s"
        echo "Vérifiez les logs : pm2 logs eventy-backend"
    fi
    sleep 1
done

# -------------------------------------------------------
# 9. Vérifier Nginx
# -------------------------------------------------------
echo "--- Vérification Nginx ---"
nginx -t 2>&1 && {
    systemctl reload nginx
    echo "✅ Nginx OK et rechargé"
} || {
    echo "⚠️ Erreur config Nginx"
}

# -------------------------------------------------------
# 10. Test final via Nginx (port 80)
# -------------------------------------------------------
echo ""
echo "=== TEST FINAL ==="
echo "--- Test via localhost:3000 (direct) ---"
curl -s http://localhost:3000/api/health 2>&1 || echo "❌ Port 3000 ne répond pas"

echo ""
echo "--- Test via localhost:80 (Nginx) ---"
curl -s http://localhost/api/health 2>&1 || echo "❌ Port 80 ne répond pas"

echo ""
echo "=== Eventy Fix COMPLETE: $(date) ==="
echo ""
echo "📋 RÉCAPITULATIF :"
echo "   IP publique  : 163.172.189.137"
echo "   Test externe : curl http://163.172.189.137/api/health"
echo "   Logs PM2     : pm2 logs eventy-backend"
echo "   Logs deploy  : tail -100 /var/log/eventy-deploy.log"
echo "   Logs fix     : tail -100 /var/log/eventy-fix.log"
echo "   Status PM2   : pm2 status"
