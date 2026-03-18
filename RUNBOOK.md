# Runbook Production — Eventy Life

> **Dernière mise à jour** : 17 mars 2026
> **Responsable** : David — eventylife@gmail.com
> **Infrastructure** : Scaleway DEV1-S + PostgreSQL + Redis

---

## Accès rapides

| Service | URL | Identifiant |
|---------|-----|-------------|
| Frontend | https://eventylife.fr | — |
| API | https://api.eventylife.fr/api/health | — |
| Stripe Dashboard | https://dashboard.stripe.com | eventylife@gmail.com |
| Sentry | https://sentry.io | eventylife@gmail.com |
| Scaleway Console | https://console.scaleway.com | eventylife@gmail.com |
| SSH | `ssh root@IP_SERVEUR` | clé SSH |

---

## Commandes d'urgence

### Redémarrer tout
```bash
cd /opt/eventy
docker compose -f docker-compose.prod.yml restart
```

### Rollback immédiat
```bash
./deploy.sh --rollback
```

### Vérifier le statut
```bash
./deploy.sh --status
curl https://api.eventylife.fr/api/health
```

### Logs en temps réel
```bash
# Tous les services
docker compose -f docker-compose.prod.yml logs -f

# Backend seulement
docker compose -f docker-compose.prod.yml logs -f app

# 100 dernières lignes d'erreur
docker compose -f docker-compose.prod.yml logs app 2>&1 | grep -i "error\|critical" | tail -100
```

---

## Incidents courants

### 1. Site inaccessible (502/503)

**Diagnostic :**
```bash
docker compose -f docker-compose.prod.yml ps
curl -v http://localhost:4000/api/health
curl -v http://localhost:3000/api/health
```

**Actions :**
1. Vérifier que les containers tournent : `docker ps`
2. Si backend DOWN → `docker compose -f docker-compose.prod.yml restart app`
3. Si frontend DOWN → `docker compose -f docker-compose.prod.yml restart frontend`
4. Si nginx DOWN → `docker compose -f docker-compose.prod.yml restart nginx`
5. Si tout DOWN → `docker compose -f docker-compose.prod.yml up -d`

**Si ça ne marche pas :**
- Vérifier l'espace disque : `df -h`
- Vérifier la RAM : `free -h`
- Vérifier les logs Docker : `journalctl -u docker --since "1 hour ago"`

---

### 2. Base de données inaccessible

**Diagnostic :**
```bash
docker compose -f docker-compose.prod.yml exec app npx prisma db execute --stdin <<< "SELECT 1"
```

**Actions :**
1. Si DB managée Scaleway → vérifier la console Scaleway
2. Si DB locale → `systemctl status postgresql`
3. Vérifier `DATABASE_URL` dans `.env.production`
4. Redémarrer le backend : `docker compose -f docker-compose.prod.yml restart app`

---

### 3. Paiement Stripe bloqué

**Diagnostic :**
1. Stripe Dashboard → Payments → chercher le paiement
2. Vérifier les webhooks : Stripe Dashboard → Developers → Webhooks → Recent events
3. Vérifier en DB :
```bash
docker compose -f docker-compose.prod.yml exec app \
  npx prisma db execute --stdin <<< "SELECT id, status, \"providerRef\" FROM \"PaymentContribution\" WHERE status = 'PENDING' ORDER BY \"createdAt\" DESC LIMIT 10"
```

**Actions :**
1. Si webhook non reçu → vérifier la configuration webhook Stripe
2. Si webhook reçu mais paiement PENDING → vérifier les logs : `docker compose -f docker-compose.prod.yml logs app | grep "WEBHOOK"`
3. Si erreur Stripe → attendre 1h (Stripe retente automatiquement 3 fois)
4. En dernier recours → traitement manuel :
```bash
# Passer un paiement en SUCCEEDED manuellement
docker compose -f docker-compose.prod.yml exec app \
  npx prisma db execute --stdin <<< "UPDATE \"PaymentContribution\" SET status = 'SUCCEEDED', \"paidAt\" = NOW() WHERE id = 'PAYMENT_ID'"
```

---

### 4. Emails non envoyés

**Diagnostic :**
```bash
# Compter les emails en attente
docker compose -f docker-compose.prod.yml exec app \
  npx prisma db execute --stdin <<< "SELECT status, COUNT(*) FROM \"EmailOutbox\" GROUP BY status"
```

**Actions :**
1. Si beaucoup de PENDING → le CRON outbox tourne toutes les 30s, attendre
2. Si beaucoup de FAILED → vérifier la clé API email (Resend/Brevo)
3. Si PROCESSING depuis >5min → le CRON va les reset automatiquement
4. Pour forcer le flush : redémarrer le backend

**Vérifier les clés API :**
```bash
# Tester l'envoi Resend
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer VOTRE_CLE_RESEND" \
  -H "Content-Type: application/json" \
  -d '{"from":"noreply@eventylife.fr","to":"eventylife@gmail.com","subject":"Test","text":"Test"}'
```

---

### 5. CRON job échoué

**Diagnostic :**
```bash
docker compose -f docker-compose.prod.yml exec app \
  npx prisma db execute --stdin <<< "SELECT \"jobName\", status, \"errorMessage\", \"startedAt\" FROM \"JobRun\" WHERE status = 'FAILED' ORDER BY \"startedAt\" DESC LIMIT 5"
```

**Actions :**
1. Lire le message d'erreur
2. Le monitoring CRON envoie un email automatique toutes les 30min si des jobs échouent
3. Si le job était `handleHoldExpiry` → vérifier les réservations HELD : elles seront nettoyées au prochain cycle (5min)
4. Si le job était `handlePayoutCompute` → les payouts seront calculés au prochain cycle (mensuel)

---

### 6. Contestation Stripe (Dispute)

**Urgence : Répondre sous 7 jours**

**Actions :**
1. Un email d'alerte est envoyé automatiquement à `ADMIN_ALERT_EMAIL`
2. Aller sur Stripe Dashboard → Disputes
3. Rassembler les preuves : confirmation de réservation, emails échangés, CGV signées
4. Soumettre la réponse via Stripe
5. Contacter le client si possible

---

### 7. Espace disque plein

**Diagnostic :**
```bash
df -h
du -sh /opt/eventy/backend/logs/*
docker system df
```

**Actions :**
```bash
# Nettoyer les logs anciens (>30 jours)
find /opt/eventy/backend/logs -name "*.log" -mtime +30 -delete

# Nettoyer Docker
docker system prune -f
docker volume prune -f

# Nettoyer les backups anciens
ls -la /opt/eventy/backups/
# Supprimer les plus anciens si nécessaire
```

---

### 8. Certificat SSL expiré

**Diagnostic :**
```bash
certbot certificates
```

**Actions :**
```bash
certbot renew
# Copier les nouveaux certificats
cp /etc/letsencrypt/live/eventylife.fr/* /opt/eventy/nginx/certs/eventylife.fr/
cp /etc/letsencrypt/live/api.eventylife.fr/* /opt/eventy/nginx/certs/api.eventylife.fr/
# Recharger nginx
docker compose -f docker-compose.prod.yml restart nginx
```

---

## Monitoring automatique

Le backend inclut un système de surveillance intégré :

| CRON | Fréquence | Vérifie |
|------|-----------|---------|
| `handleSystemMonitoring` | 30 min | CRON échoués, jobs bloqués, emails dead letter, holds expirés, paiements bloqués |
| `handleDailyReport` | 7h/jour | CA, réservations, utilisateurs, tickets, santé technique |
| `processOutbox` | 30 sec | Flush emails en attente |
| `retryFailed` | 1h | Relance emails échoués |
| `handleHoldExpiry` | 5 min | Expiration des holds de réservation |

Les alertes sont envoyées à `ADMIN_ALERT_EMAIL` (configurable dans `.env.production`).

---

## Contacts d'urgence

| Rôle | Contact |
|------|---------|
| PDG / Technique | David — eventylife@gmail.com |
| Stripe Support | https://support.stripe.com |
| Scaleway Support | https://console.scaleway.com/support |
| Resend Support | https://resend.com/support |

---

## Maintenance planifiée

### Hebdomadaire
- Vérifier les logs d'erreur Sentry
- Vérifier l'espace disque
- Vérifier les rapports quotidiens email

### Mensuelle
- Renouveler les certificats SSL (automatique via crontab)
- Vérifier les mises à jour de sécurité : `apt update && apt list --upgradable`
- Vérifier les backups Docker

### Trimestrielle
- Mise à jour des dépendances npm (backend + frontend)
- Rotation des secrets (JWT_SECRET, API keys)
- Audit de sécurité complet
