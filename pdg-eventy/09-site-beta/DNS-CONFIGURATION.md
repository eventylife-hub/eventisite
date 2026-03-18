# Configuration DNS - eventylife.fr

> **Date** : 2026-03-06
> **Statut** : ✅ DNS CONFIGURES - SSL en cours de generation

---

## Site en ligne

Le site Eventy Life est deploye et accessible a :
- **https://eventylife.vercel.app** (fonctionne deja)

## Enregistrements DNS a configurer

**Registrar** : OVHcloud (identifiant ml1244863-ovh)
**Configures le** : 2026-03-06 via API OVH

### 1. Domaine racine : eventylife.fr

| Type | Name | Value | Statut |
|------|------|-------|--------|
| **A** | **@** | **76.76.21.21** | ✅ Configure |

### 2. Sous-domaine www : www.eventylife.fr

| Type | Name | Value | Statut |
|------|------|-------|--------|
| **CNAME** | **www** | **cname.vercel-dns.com.** | ✅ Configure |

## Historique

- 2026-03-06 : DNS configures via API OVH (ancien A record 213.186.33.5 remplace)
- 2026-03-06 : Certificats SSL en cours de generation par Vercel

## URLs finales

- `https://eventylife.fr` -> redirige vers `https://www.eventylife.fr`
- `https://www.eventylife.fr` -> site en production
- `https://eventylife.vercel.app` -> site en production (backup)

## Vercel Project

- **Team** : eventylife-hub's projects
- **Project** : eventylife
- **Repo GitHub** : eventylife-hub/Eventylife
- **Framework** : Next.js 14
