# LOGIN — Comptes de test Eventy

Mis à jour : 2026-05-04 — fix login client (`client@eventylife.fr`)

## Accès au site (mot de passe global)

Le site est protégé par un mot de passe global tant que la SAS n'est pas créée.

| Champ | Valeur |
|---|---|
| URL | https://www.eventylife.fr |
| Mot de passe | `Eventy2026!` |
| Désactiver | définir `SITE_PASSWORD_DISABLED=true` côté Vercel |

Le formulaire est sur `/site-password`. POST `/api/site-auth` `{ password }` → cookie httpOnly `site-auth` (30 jours).

## Comptes de connexion (formulaire `/connexion`)

Tous les comptes utilisent le **même mot de passe** : `Eventy2026!`

Le formulaire `/connexion` poste désormais sur `/api/auth/login` (Session 152) qui :
1. Reconnaît la liste de comptes démo ci-dessous
2. Accepte aussi **n'importe quel email** + `Eventy2026!` → rôle `CLIENT` par défaut (mot de passe universel)
3. Sinon proxy vers le backend NestJS (si configuré)

Cookies posés au login : `access_token` (7j) + `refresh_token` (30j) en httpOnly.

### Compte client principal (à donner à David pour test)

| Champ | Valeur |
|---|---|
| Email | `client@eventylife.fr` |
| Mot de passe | `Eventy2026!` |
| Rôle | `CLIENT` |
| URL login | https://www.eventylife.fr/connexion |
| Redirige vers | `/client` |

### Autres comptes démo

| Email | Mot de passe | Rôle | Redirige vers |
|---|---|---|---|
| `admin@eventylife.fr` | `Eventy2026!` | ADMIN | `/admin` |
| `eventylife@gmail.com` | `Eventy2026!` | ADMIN | `/admin` |
| `pro@eventylife.fr` | `Eventy2026!` | PRO | `/pro/dashboard` |
| `pro2@eventylife.fr` | `Eventy2026!` | PRO | `/pro/dashboard` |
| `pro3@eventylife.fr` | `Eventy2026!` | PRO | `/pro/dashboard` |
| `client@eventylife.fr` | `Eventy2026!` | CLIENT | `/client` |
| _n'importe quel email_ | `Eventy2026!` | CLIENT | `/client` |

### Comptes partenaires HRA (rôle PRO)

Hébergement : `riad.andalous@`, `villa.orangers@`, `kasbah.tamadot@`, `royal.mansour@partner.eventylife.fr`
Restauration : `le.foundouk@`, `dar.moha@`, `mamounia.resto@partner.eventylife.fr`
Activités : `atlas.trekking@`, `desert.luxury@`, `quad.palmeraie@`, `hammam.royal@partner.eventylife.fr`

## Test curl prod

```bash
# 1) Passer la grille site-password
curl -s -c jar.txt -X POST -H 'Content-Type: application/json' \
  -d '{"password":"Eventy2026!"}' \
  https://www.eventylife.fr/api/site-auth

# 2) Login client
curl -s -b jar.txt -c jar.txt -X POST -H 'Content-Type: application/json' \
  -d '{"email":"client@eventylife.fr","password":"Eventy2026!"}' \
  https://www.eventylife.fr/api/auth/login
# → 200 + accessToken + refreshToken + user.role=CLIENT

# 3) Charger l'espace client
curl -s -b jar.txt -o /dev/null -w "%{http_code}\n" \
  https://www.eventylife.fr/client
# → 200
```

## Détails techniques

- Source démo : `frontend/app/api/auth/login/route.ts` (`DEMO_ACCOUNTS`)
- Formulaire : `frontend/app/(public)/connexion/_components/connexion-client.tsx`
- Middleware : `frontend/middleware.ts` (auto-issue de demo JWT en mode beta sans `JWT_SECRET`)
- Site password gate : `frontend/middleware.ts` + `frontend/app/api/site-auth/route.ts`
