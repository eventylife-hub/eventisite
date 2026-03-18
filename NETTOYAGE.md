# Nettoyage du projet — Fichiers à supprimer

> **Date** : 18 mars 2026
> **Raison** : Les prototypes HTML ont été remplacés par les PWA finales dans `admin-pwa/` et `pro-pwa/`

## Anciens prototypes à supprimer (~380 Ko)

```bash
# Lancer cette commande depuis le dossier eventisite/
rm proto-auth-premium.html
rm proto-auth-v2.html
rm proto-creation-voyage-pro.html
rm proto-creation-voyage-pro-v2.html
rm proto-creation-voyage-pro-v3.html
rm admin-home.html
rm gradient-header-preview.html
rm eventy-homepage-preview.html
```

## Ce qui reste (à garder)

| Fichier/Dossier | Rôle | Taille |
|-----------------|------|--------|
| `admin-pwa/` | App Admin PWA finale (1 566 lignes) | 142 Ko |
| `pro-pwa/` | App Pro PWA finale (771 lignes) | 72 Ko |
| `index.html` | Copie de l'admin PWA (root) | 108 Ko |
| `AME-EVENTY.md` | Manifeste fondateur | — |
| `marketing/` | Landing pages, articles SEO, posts, emails, pitch | — |
| `pdg-eventy/` | Tous les fichiers PDG | — |
| `frontend/` | Frontend Next.js (134 pages) | — |
| `backend/` | Backend NestJS (29 modules) | — |
