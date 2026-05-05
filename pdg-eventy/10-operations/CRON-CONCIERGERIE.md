# Spécification CRON — Conciergerie Eventy

> Date : 2026-05-06 · Branche : claude/quizzical-hopper-20cfdc
> Cf. `AUDIT_CONCIERGERIE_INTERNE_EXTERNE.md` (racine projet) §15 Suivi PDG.
> Backend : NestJS module `concierge-requests` + `concierge-quality-audits`
>           (Sprint 2, à livrer).

---

## Vue d'ensemble

10 cron jobs orchestrent la conciergerie en arrière-plan. Tous tournent
sur le worker NestJS (image Docker dédiée, scaling horizontal possible).
Tous les jobs écrivent leur exécution dans la table `cron_logs` (audit-trail).

---

## 1. SLA Watcher (toutes les 30 secondes)

```
@Cron('*/30 * * * * *')   // every 30 seconds
```

**Rôle** : surveille toutes les demandes ouvertes/assignées et déclenche
les escalades automatiques.

**Logique** :
1. SELECT demands WHERE status IN ('open', 'assigned', 'in_progress')
2. Pour chaque demande : `nextEscalationStep(demand)` (lib/conciergerie/sla.ts)
3. Si étape à appliquer ET pas déjà escaladée :
   - Insert nouvel `assignee` dans la pile
   - Notifier (push / SMS / email / phone selon notification)
4. Marquer `slaResponseBreachedAt` ou `slaResolutionBreachedAt` si dépassé

**Notif PDG** : si un Luxe dépasse 5 min sans acknowledge → Slack
#conciergerie-alerts critical.

---

## 2. Rapport hebdo PDG (lundi 8h Europe/Paris)

```
@Cron('0 8 * * 1', { timeZone: 'Europe/Paris' })
```

**Rôle** : génère et envoie le rapport hebdomadaire au PDG (David).

**Logique** :
1. `currentWeekPeriod()` → période lundi-dimanche écoulée
2. `buildReport(demands, audits, period, "Cron PDG")`
3. Render PDF (Puppeteer) à partir de `/admin/conciergerie-rapports`
4. Email via Resend → eventylife@gmail.com (PJ : PDF)
5. Slack #pdg-eventy : résumé textuel + lien vers PDF + lien dashboard

**Anomalies critiques** : si rapport contient ≥ 1 anomalie critical,
Slack mention @david direct + push notification mobile.

---

## 3. Rapport mensuel direction (1er du mois 8h)

```
@Cron('0 8 1 * *', { timeZone: 'Europe/Paris' })
```

**Rôle** : rapport mensuel détaillé pour comité de direction.

**Logique** :
- Période : mois précédent
- Comparaison vs mois M-1 (delta + tendance)
- Évolution NPS courbe 12 mois
- Coût conciergerie / valeur générée (ROI)
- Synthèse mystery shoppers trimestriels (si applicable)
- Email : direction@eventy.life (David, CFO, Pôle Qualité)

---

## 4. Audit qualité auto-échantillonnage (toutes les heures)

```
@Cron('0 * * * *')
```

**Rôle** : crée des entrées dans la file d'audit qualité pour les
demandes éligibles selon politique d'échantillonnage.

**Logique** :
1. SELECT demands WHERE status='resolved' AND resolved_at > now() - 24h
2. Filtre `shouldAuditDemand(d.id, d.tier)` (déterministe)
3. Filtre : aucun audit existant + délai 7j depuis dernier audit du même créateur
4. Insert dans `quality_audit_queue` table
5. Notifier Pôle Qualité Slack #conciergerie-qualite si > 10 nouveaux

**Politique anti-bias** : pas plus de 1 audit par créateur tous les 7 jours
(`MIN_DAYS_BETWEEN_AUDITS_SAME_ACTOR`).

---

## 5. Mystery shopper trimestriel (1er jan, 1er avr, 1er juil, 1er oct, 9h)

```
@Cron('0 9 1 1,4,7,10 *', { timeZone: 'Europe/Paris' })
```

**Rôle** : déclenche les mystery shoppers pour le trimestre.

**Logique** :
1. Pour chaque créateur actif + chaque société externe active :
2. Choisir 1 scénario aléatoire dans `MYSTERY_SHOPPER_SCENARIOS`
3. Créer ticket dans `mystery_shopper_runs` table avec deadline 30j
4. Notifier Pôle Qualité avec liste à exécuter

**Pôle Qualité** exécute manuellement sur 30 jours, débrief + score.

---

## 6. Renouvellement KYC partenaire (tous les jours à 6h)

```
@Cron('0 6 * * *')
```

**Rôle** : vérifie expiration KYC / RC Pro / RGPD partenaires externes.

**Logique** :
1. SELECT providers WHERE active=true
2. Pour chaque partenaire :
   - Si `kycLastVerifiedAt` > 1 an → alerte Pôle Conformité
   - Si RC Pro expirant < 60 j → alerte
   - Si DPA non signé → bloquer activation Luxe
3. Email pôle Conformité + slack #conciergerie-config

---

## 7. NPS reminder voyageur (1× par jour, 18h)

```
@Cron('0 18 * * *')
```

**Rôle** : envoie un rappel NPS aux voyageurs dont la demande a été
résolue depuis ≥ 24h sans NPS.

**Logique** :
1. SELECT demands WHERE status='resolved' AND resolved_at < now() - 24h
   AND nps_score IS NULL AND nps_reminder_sent_at IS NULL
2. Pour chacune : push + email "Comment était cette expérience ?"
3. UPDATE nps_reminder_sent_at = now()
4. Pas plus de 1 rappel par voyageur

---

## 8. Anomaly detector temps réel (toutes les 5 min)

```
@Cron('*/5 * * * *')
```

**Rôle** : exécute `detectAnomalies()` sur les 24 dernières heures.

**Logique** :
1. `period = last 24h`
2. `detectAnomalies(demands, period)`
3. Pour chaque anomalie nouvelle (pas déjà notifiée) :
   - Insert `anomaly_alerts` table
   - Slack #conciergerie-alerts (severity color-coded)
   - Si critical : email équipe ops + push mobile @on-call
4. Dédoublonne : 1 anomalie identique pas re-notifiée < 6h

---

## 9. Facturation auto société externe (1er du mois 7h)

```
@Cron('0 7 1 * *', { timeZone: 'Europe/Paris' })
```

**Rôle** : génère les factures Eventy → société externe pour le mois écoulé.

**Logique** :
1. Pour chaque partenaire actif :
2. SELECT demands WHERE final_cost_eur IS NOT NULL AND resolved_at IN dernier mois
3. Calculer total (retainer + somme prestations × marge)
4. Générer facture PDF (template Pennylane ou local)
5. Trigger Stripe Connect ou virement SEPA
6. Email partenaire avec facture

**Réconciliation** : si désaccord partenaire dans 5j ouvrés, conciliation
Pôle Qualité.

---

## 10. Archivage RGPD (tous les jours à 3h)

```
@Cron('0 3 * * *')
```

**Rôle** : applique la rétention RGPD selon §17 audit MD.

**Logique** :
1. Demands Standard/Premium : anonymise après 3 ans (suppression PII voyageur,
   conserve audit-trail anonymisé)
2. Demands Luxe : conserve 7 ans intégralement (compliance)
3. NPS individuels : anonymise après 2 ans (conserve agrégats statistiques)
4. Audits qualité : conserve 7 ans
5. Audit-trail (cron_logs, action_logs) : conserve 10 ans
6. Données partenaires : conserve durée contrat + 5 ans

**Procédure** : script SQL paramétré + log d'exécution. Test en dry-run
mensuel par DPO Eventy avant exécution réelle.

---

## Configuration

```bash
# Variables ENV NestJS
CONCIERGERIE_CRON_ENABLED=true
CONCIERGERIE_PDG_EMAIL=eventylife@gmail.com
CONCIERGERIE_SLACK_WEBHOOK_PDG=https://hooks.slack.com/...
CONCIERGERIE_SLACK_WEBHOOK_ALERTS=https://hooks.slack.com/...
CONCIERGERIE_SLACK_WEBHOOK_QUALITE=https://hooks.slack.com/...
CONCIERGERIE_RESEND_API_KEY=re_xxx
CONCIERGERIE_TIMEZONE=Europe/Paris

# Quotas anti-spam
CONCIERGERIE_NPS_REMINDER_MAX_PER_DAY=200
CONCIERGERIE_ANOMALY_DEDUPE_HOURS=6
```

---

## Monitoring

- Tous les cron loggent dans `cron_logs` (timestamp, durée, succès, items traités)
- Dashboard Grafana : `grafana.eventylife.fr/d/conciergerie-cron`
- Alerte si cron rate limit atteint ou erreur consécutive 3×
- Healthcheck `/api/health/cron-conciergerie` → 200 si tous les jobs ont
  tourné dans leur fenêtre attendue

---

## Tests

Chaque cron a un test unitaire NestJS qui :
1. Mock le clock (`@nestjs/schedule` testing utilities)
2. Mock le repo (Prisma)
3. Vérifie comportement avec différents états DB
4. Vérifie que les notifications partent bien (Slack/email mock)

Test d'intégration trimestriel : exécuter cron job en environnement
staging avec données réelles, valider rapport généré.

---

## TODO sprint 2 (~5 j-h)

- [ ] Module NestJS `concierge-cron` avec 10 jobs ci-dessus
- [ ] Repository `cron_logs` + table audit
- [ ] Healthcheck endpoint
- [ ] Tests unitaires (1 par cron)
- [ ] Configuration Slack webhooks (3 canaux)
- [ ] Script archivage RGPD avec dry-run
- [ ] Dashboard Grafana
- [ ] Doc opérationnelle ops Eventy (qui regarde quoi quand)

---

*Document livré : 2026-05-06 — David / Claude Opus 4.7 (1M)*
*À implémenter en backend NestJS Sprint 2.*
