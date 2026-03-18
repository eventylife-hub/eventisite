# Comparatif Hébergement Cloud — Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Données** : Tarifs réels 2026 (scaleway.com, vercel.com, cloudflare.com)

## Stack technique confirmée
- **Backend** : NestJS 10 (29 modules) + Prisma + PostgreSQL
- **Frontend** : Next.js 14 (102 pages, 72 composants)
- **Paiement** : Stripe (CB + SEPA + gestion litiges)
- **Stockage fichiers** : S3 compatible
- **Emails** : Brevo / Mailjet

---

## Comparatif fournisseurs — Tarifs réels 2026

### Option A : Scaleway (✅ RECOMMANDÉ pour le lancement)

| Service | Offre | Prix/mois | Notes |
|---------|-------|-----------|-------|
| Instance **DEV1-S** | 2 vCPU, 2 Go RAM | **6,42€ HT** | Backend NestJS |
| PostgreSQL managé **DB-DEV-S** | Essential, 1 nœud | **~12€ HT** | Database managée |
| Object Storage S3 | Uploads, documents | **~2-5€ HT** | Selon volume |
| **TOTAL Phase 1** | | **~25-42€ HT/mois** | |

**Avantages** : Cloud-native, datacenters **France (Paris)** = RGPD ✅, API moderne, facturation à la seconde, bonne DX, scaling facile

### Option B : OVHcloud

| Service | Offre | Prix/mois | Notes |
|---------|-------|-----------|-------|
| VPS Value | 2 vCPU, 4 Go RAM | ~5,75€ | |
| CloudDB PostgreSQL | Starter | ~15€ | |
| **TOTAL démarrage** | | **~20-25€/mois** | |

**Avantages** : Prix compétitifs, datacenters France, souverain
**⚠️ Attention** : Hausses de prix annoncées 2026 (jusqu'à +45%), DX moins moderne

### Option C : Vercel + Neon (JAMstack)

| Service | Offre | Prix/mois | Notes |
|---------|-------|-----------|-------|
| Vercel Pro | Frontend Next.js | **20$/mois** (~18,50€) | Push-to-deploy |
| Neon PostgreSQL | Free tier puis Pro | 0€ - 19€ | Serverless PostgreSQL |
| Railway | Backend NestJS | 5€ - 20€ | |
| **TOTAL démarrage** | | **~25-60€/mois** | |

**Avantages** : DX excellente, déploiement automatique
**⚠️ Données USA** : RGPD potentiellement problématique pour agence voyage

### Option D : Hetzner (économique)

| Service | Offre | Prix/mois | Notes |
|---------|-------|-----------|-------|
| VPS CX22 | 2 vCPU, 4 Go RAM | 5,19€ | |
| PostgreSQL | Auto-géré | 0€ | À installer soi-même |
| **TOTAL** | | **~5-10€/mois** | |

**Avantages** : Le moins cher, datacenter Allemagne (RGPD OK)
**⚠️ Attention** : +37% hausse annoncée 2026, pas de DB managée

---

## Décision recommandée

### Phase 1 (lancement) — **Scaleway**
**Scaleway DEV1-S + PostgreSQL managé** = **~25€ HT/mois**
- Hébergé en France (RGPD ++ pour agence voyage)
- Services managés (pas de DevOps nécessaire)
- Scaling facile si besoin
- Budget annuel : **~300€**

### Phase 2 (croissance — 500+ voyageurs/mois)
**Scaleway GP1-S + PostgreSQL HA + Redis** = **~60-85€ HT/mois**
- Plus de ressources (upgrade instance)
- Redis managé pour cache sessions
- Budget annuel : **~720-1 020€**

### Phase 3 (scale — 2 000+ voyageurs/mois)
**Kubernetes managé (Scaleway Kapsule)** = 200-500€/mois
- Orchestration automatique
- Auto-scaling
- Multi-instances

---

## Services complémentaires — Coûts réels 2026

| Service | Fournisseur | Prix/an | Notes |
|---------|-------------|---------|-------|
| Domaine eventylife.fr | (déjà possédé) | ~15-30€ | Renouvellement |
| Domaine eventylife.fr | OVH / Gandi | ~10-15€ | Si disponible |
| Email pro | Google Workspace Business Starter | **84€** (7€/mois) | |
| DNS + CDN | **Cloudflare Free** | **0€** | Performance + sécurité |
| SSL | Let's Encrypt | **0€** | Via Caddy ou Cloudflare |
| Monitoring uptime | UptimeRobot Free | **0€** | Alertes uptime |
| Logs | Grafana Cloud Free | **0€** | 50 Go logs/mois |
| Erreurs | **Sentry Free** | **0€** | 5k events/mois |
| CI/CD | GitHub Actions | **0€** | 2000 min/mois free |
| Emails transactionnels | **Brevo** | **0-25€/mois** | 300 emails/jour gratuit |
| Chat client | Crisp | **0-25€/mois** | Plan gratuit disponible |

**Total complémentaires** : ~84-250€/an

---

## Checklist infra

- [ ] Créer compte Scaleway
- [ ] Provisionner instance DEV1-S (2 vCPU, 2GB RAM)
- [ ] Créer instance PostgreSQL managée DB-DEV-S
- [ ] Configurer Object Storage S3
- [ ] Configurer le domaine eventylife.fr (DNS Cloudflare)
- [ ] Mettre en place CI/CD (GitHub Actions → Scaleway)
- [ ] Configurer monitoring (UptimeRobot + Sentry)
- [ ] Configurer les backups automatiques de la DB
- [ ] Mettre en place les certificats SSL (Let's Encrypt)
- [ ] Configurer les emails transactionnels (Brevo)
- [ ] Configurer SPF + DKIM + DMARC pour @eventylife.fr
