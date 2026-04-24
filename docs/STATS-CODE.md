# Statistiques de code — Eventy

> **Audit réel** : 24 avril 2026 — comptage par `find | xargs cat | wc -l`

---

## Totaux globaux

| Métrique | Valeur |
|---------|--------|
| **Lignes de code total projet** | **~1 184 178** |
| **Frontend total** | **876 246 lignes** |
| **Backend total** | **307 932 lignes** |
| **Fichiers frontend** | **4 505 fichiers** (tsx + ts + css) |
| **Fichiers backend** | **905 fichiers ts** |

---

## Frontend détail (`frontend/`)

### Par type de fichier

| Type | Fichiers | Lignes |
|------|---------|--------|
| **tsx** | 2 733 | **640 531** |
| **ts** | 1 760 | **224 323** |
| **css** | 12 | **11 392** |
| **TOTAL** | **4 505** | **876 246** |

### Par répertoire

| Répertoire | Fichiers | Lignes |
|-----------|---------|--------|
| `app/` — tsx | 2 391 | **573 489** |
| `app/` — ts | ~179 | **18 024** |
| `app/` — css | ~8 | **10 445** |
| `components/` — tsx | 319 | **61 790** |
| `lib/` — ts+tsx | 144 | **39 475** |

### Pages Next.js

| Métrique | Valeur |
|---------|--------|
| **Fichiers page.tsx** | **1 118** |
| **Portails distincts** | **32** |
| **Fichiers tsx dans app/** | **2 391** |

### Répartition pages par portail

| Portail | page.tsx |
|---------|----------|
| (admin) | 275 |
| (pro) | 211 |
| (client) | 126 |
| (equipe) | 98 |
| (public) | 63 |
| (maisons) | 33 |
| (jeux) | 26 |
| (ambassadeur) | 23 |
| (independant) | 19 |
| (staff) | 18 |
| (comptable) | 18 |
| (employes) | 17 |
| (avocat) | 17 |
| (restaurateur) | 11 |
| (independants) | 11 |
| (guide) | 11 |
| (createur) | 11 |
| (traiteur) | 10 |
| (photographe) | 10 |
| (fleuriste) | 10 |
| (decorateur) | 10 |
| (coordinateur) | 10 |
| (chauffeur) | 10 |
| (animateur) | 10 |
| (accompagnateur) | 10 |
| (checkout) | 9 |
| (auth) | 9 |
| (influenceur) | 8 |
| (voyageur) | 6 |
| (transporteur) | 4 |
| (demo) | 4 |
| (assureur) | 4 |
| **TOTAL** | **1 118** |

---

## Backend détail (`backend/src/`)

| Métrique | Valeur |
|---------|--------|
| **Fichiers .ts** | **905** |
| **Lignes totales** | **307 932** |
| **Modules NestJS** | **31** |
| **Endpoints REST** | 200+ |
| **Tests passants** | 3 300+ |
| **Webhooks Stripe** | 18 |
| **Lignes schema Prisma** | 3 232 |
| **DTOs validés** | 19+ |
| **Indexes DB** | 313 |
| **Events émis** | 46 |

---

## Commandes de comptage

```bash
# Vrais totaux (méthode correcte : cat | wc -l évite le batching xargs)
find frontend/app -name "*.tsx" | xargs cat | wc -l          # 573 489
find frontend/app -name "*.ts" | xargs cat | wc -l           # 18 024
find frontend/app -name "*.css" | xargs cat | wc -l          # 10 445
find frontend/lib -name "*.ts" -o -name "*.tsx" | xargs cat | wc -l  # 39 475
find frontend/components -name "*.tsx" | xargs cat | wc -l   # 61 790
find frontend -name "*.tsx" | grep -v node_modules | xargs cat | wc -l  # 640 531
find frontend -name "*.ts" | grep -v node_modules | xargs cat | wc -l   # 224 323
find frontend -name "*.css" | grep -v node_modules | xargs cat | wc -l  # 11 392
find backend/src -name "*.ts" | xargs cat | wc -l            # 307 932

# Nombre de fichiers
find frontend/app -name "*.tsx" | wc -l          # 2 391
find frontend/app -name "page.tsx" | wc -l        # 1 118
find frontend -name "*.tsx" | grep -v node_modules | wc -l   # 2 733
find frontend -name "*.ts" | grep -v node_modules | wc -l    # 1 760
find backend/src -name "*.ts" | wc -l             # 905
```

---

*Généré automatiquement le 24/04/2026. Méthode : `find | xargs cat | wc -l` (précis, pas de batching).*
