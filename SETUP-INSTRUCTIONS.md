# Instructions de Setup — Eventy Life

## Problème actuel

Les `node_modules` étaient corrompus. Le registre npm n'est pas accessible depuis l'environnement Cowork.
David doit exécuter ces commandes sur sa machine locale.

## Étapes à suivre (5 minutes)

### 1. Réinstaller les dépendances (racine du monorepo)

```bash
cd eventisite
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json
npm install
```

### 2. Générer le client Prisma + migration

```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Option A : Base de données vide (recommandé en dev)
# Ceci va créer automatiquement toutes les 80 tables manquantes
npx prisma migrate dev --name sync_schema_v3

# Option B : Base avec données existantes
# Si la migration échoue à cause de tables avec données (ContractTemplate, LegalDocumentVersion) :
npx prisma migrate dev --create-only --name sync_schema_v3
# Puis éditer le fichier SQL généré dans prisma/migrations/[timestamp]_sync_schema_v3/migration.sql
# Ajouter DEFAULT now() aux colonnes updatedAt :
#   ALTER TABLE "ContractTemplate" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
#   ALTER TABLE "LegalDocumentVersion" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
# Puis appliquer :
npx prisma migrate dev
```

### 3. Vérifier le build

```bash
# Backend
cd backend
npm run build
# Doit afficher 0 erreurs

# Frontend
cd ../frontend
npm run build
# Doit compiler ~139 pages
```

### 4. Lancer les tests

```bash
cd ../backend
npm test
```

## Résumé des changements depuis la dernière session

### Backend
- ✅ 79 erreurs TypeScript pré-existantes corrigées
- ✅ 29 erreurs Sprint V4 corrigées
- ✅ 14 nouveaux endpoints admin ajoutés
- ✅ 6 DTOs créés
- ✅ Relations Prisma corrigées (LedgerEntry↔Travel, DisputeHold↔PaymentContribution, DisputeHold↔User)
- ✅ Correction audit.log() → syntax positionnelle
- ✅ Correction user.sub → user.id
- ✅ Correction JwtUserPayload types

### Frontend
- ✅ 11 chemins API corrigés (alignement frontend↔backend)
- ✅ CSP headers mis à jour
- ✅ Build frontend : 0 erreurs, 139 pages

### Infrastructure
- ✅ Docker multi-stage configuré
- ✅ CI/CD GitHub Actions
- ✅ docker-compose avec 4 services
- ✅ Health check endpoint

### À noter
- 80 modèles Prisma n'ont pas encore de tables en base (migration nécessaire)
- La migration `prisma migrate dev` va créer automatiquement toutes les tables manquantes
