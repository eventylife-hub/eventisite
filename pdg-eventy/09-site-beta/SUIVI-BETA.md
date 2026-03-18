# Suivi Beta — Eventy

## Statut actuel : Beta Test

> **ATTENTION SÉCURITÉ** : Le site est en beta test et n'est PAS protégé. Pas de données réelles sensibles tant que la sécurité n'est pas renforcée.

---

## État du backend

### Modules opérationnels (37 modules, 3 300+ tests)

| Module | Tests | Statut |
|--------|-------|--------|
| Auth (JWT, stratégies) | ✅ | Production-ready |
| Users (profils, avatar) | ⚠️ 5 tests échoués (setAvatar) | À corriger |
| Client (espace client) | 120 ✅ | Production-ready |
| Bookings | ✅ | Production-ready |
| Checkout (paiement, split) | ✅ | Production-ready |
| Payments (Stripe, webhooks) | ✅ | Production-ready |
| Groups (gestion groupes) | ✅ | Production-ready |
| Travels (voyages) | ✅ | Production-ready |
| Admin (back-office, RBAC, audit) | ✅ | Production-ready |
| Documents (PDF, factures) | ✅ | Production-ready |
| Reviews (avis clients) | ✅ | Production-ready |
| SEO (meta, sitemap) | ✅ | Production-ready |
| Uploads (S3) | ✅ | Production-ready |
| Pro (espace pro) | ✅ | Production-ready |
| HRA (hébergement, resto, activités) | 40 ✅ | Production-ready |
| Finance | ✅ | Production-ready |
| Insurance | ✅ | Production-ready |
| Marketing (campagnes) | ✅ | Production-ready |
| Notifications | ✅ | Production-ready |
| Cancellation | ✅ | Production-ready |
| Legal / DSAR | ✅ | Production-ready |
| Exports | ✅ | Production-ready |
| Rooming | ✅ | Production-ready |
| Transport | ✅ | Production-ready |
| Post-sale | ✅ | Production-ready |
| Quick-sell | ✅ | Production-ready |
| Revenues (pro) | ✅ | Production-ready |

### Audits backend complétés (7/7)

1. ✅ Guards & Security
2. ✅ DTOs & Validation
3. ✅ Error Handling (10 corrections)
4. ✅ Prisma Queries (9 optimisations)
5. ✅ REST Conventions (25+ @HttpCode)
6. ✅ Modules & Dependencies (2 doublons supprimés)
7. ✅ Code Consistency (42 imports normalisés)

---

## Avant mise en production — Checklist sécurité

- [ ] Activer HTTPS obligatoire
- [ ] Configurer les headers de sécurité (CORS, CSP, HSTS)
- [ ] Mettre en place le rate limiting
- [ ] Vérifier que tous les endpoints admin sont protégés
- [ ] Activer les logs d'audit
- [ ] Configurer les backups automatiques de la DB
- [ ] Mettre en place le monitoring (uptime, erreurs)
- [ ] Tester les webhooks Stripe en production
- [ ] Vérifier le module DSAR (conformité RGPD)
- [ ] Ajouter un WAF (Cloudflare)
- [ ] Scanner les dépendances (npm audit)

---

## Roadmap technique

### Version 1.0 (Lancement)
- [ ] Corriger les 5 tests setAvatar
- [ ] Déployer sur Scaleway/OVH
- [ ] Configurer le domaine eventylife.fr
- [ ] Mettre en place CI/CD
- [ ] Activer les emails transactionnels

### Version 1.1 (M+1)
- [ ] Dashboard admin complet
- [ ] Notifications push (mobile)
- [ ] Intégration Google Analytics / Plausible

### Version 1.2 (M+3)
- [ ] Application mobile (React Native ou PWA)
- [ ] Chat en temps réel (support client)
- [ ] Intégration APIs transport (SNCF, autocars)

### Version 2.0 (M+6)
- [ ] Marketplace prestataires
- [ ] Réservation en ligne sans intervention humaine
- [ ] Multi-langue (FR, EN, ES)
