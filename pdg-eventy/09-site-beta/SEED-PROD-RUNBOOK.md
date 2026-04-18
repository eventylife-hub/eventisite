# Seed prod — 10 voyages + 10 Créateurs

**Créé** : 2026-04-18
**Contexte** : `/api/travels` prod renvoie `{ total: 0 }` → base vide. Cette procédure seed 10 voyages réels + 10 profils Créateurs + 30 occurrences de manière idempotente.

## Deux chemins — choisir le plus rapide

### Option A — Route API `POST /api/admin/seed-travels` (recommandé si SSH casse la tête)

La route est **incluse dans le commit** `claude/seed-travels-route` du repo `eventy-backend`.
Fichiers : `src/modules/admin/seed.controller.ts`, `src/modules/admin/seed-travels.data.ts`, `admin.module.ts`.

**Deploy** (SSH Scaleway `163.172.189.137`) :

```bash
ssh root@163.172.189.137
cd /opt/eventy/backend
git fetch origin
git checkout claude/seed-travels-route   # ou merger dans master puis pull
npm install --omit=dev                    # re-install au cas où
# ajouter SEED_TOKEN dans .env
echo 'SEED_TOKEN=<token-long-aléatoire>' >> .env
npx prisma generate
npm run build   # ou : npx swc src -d dist --strip-leading-paths
pm2 restart eventy-backend
pm2 logs eventy-backend --lines 50
```

**Call** (depuis n'importe où) :

```bash
curl -X POST https://api.eventylife.fr/api/admin/seed-travels \
     -H "x-seed-token: <token-long-aléatoire>" \
     -w "\nHTTP=%{http_code}\n"
```

Réponse attendue :
```json
{ "status":"ok","durationMs":2345,"creatorsCreated":10,"creatorsUpdated":0,"travelsCreated":10,"travelsUpdated":0,"occurrencesUpserted":30 }
```

**Vérif** : `curl https://api.eventylife.fr/api/travels` → `total: 10`.

### Option B — SSH direct + script racine (plus court)

```bash
ssh root@163.172.189.137
cd /opt/eventy                            # ou le répertoire qui contient scripts/
# DATABASE_URL doit être exportée (cf .env backend)
export $(grep -v '^#' /opt/eventy/backend/.env | xargs)
cd /opt/eventy/backend                    # pour utiliser son node_modules
npx ts-node ../scripts/seed-travels.ts    # si le script est au même niveau
```

Note : ce script vit à la racine du repo principal, pas dans le backend. Si le backend est cloné séparément sur le serveur, transférer `scripts/seed-travels.ts` manuellement puis lancer avec le node_modules du backend (il a `@prisma/client` + `argon2`).

## Sécurité

- La route exige `x-seed-token` non vide correspondant à `SEED_TOKEN` env. Sans token serveur → `503`. Token KO → `401`.
- La route est **idempotente** : tous les upserts sur email (User) / slug (Travel) / proSlug (ProProfile) / (travelId, occurrenceNumber) (Occurrence). Re-run = safe.
- À supprimer quand la base est peuplée (ou laisser avec `SEED_TOKEN` unset).

## Données seedées

10 voyages : Marrakech Express, Santorin Sunset, Bali Découverte, Lisbonne Gourmande, Tokyo Mystique, Rome Éternelle, Istanbul Oriental, Dubaï Luxe, Barcelone Vibrante, Essaouira Zen.

10 Créateurs : Sarah Dumont, Sofia P., Ahmed Bensaid, Marie Lefevre, Yuki Tanaka, Giulia Rossi, Emre Yilmaz, Fatima Al Rashid, Carlos Garcia, Karim Benali.

Password créateurs (tous) : `Eventy2026!` (hash argon2id).
