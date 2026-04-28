# Automatisations Eventy — code de référence P0

> Code prêt à intégrer dans les submodules `backend/` (NestJS 10) et
> `frontend/` (Next.js 14). Les chemins reproduisent l'arborescence cible.

## Structure

```
automatisations/
├── backend/
│   ├── automations/                     ← Module orchestrateur
│   │   ├── automations.module.ts
│   │   ├── automation-runner.service.ts (cron + idempotence + audit)
│   │   ├── audit-log.service.ts
│   │   └── automations.controller.ts
│   ├── travels/
│   │   ├── itinerary/
│   │   │   └── itinerary-generator.service.ts   P0 ✅
│   │   └── pricing/
│   │       └── pricing-engine.service.ts        P0 ✅
│   ├── bookings/
│   │   └── lifecycle/
│   │       └── booking-lifecycle.service.ts     P0 ✅
│   ├── notifications/
│   │   └── scheduled/
│   │       └── scheduled-notifications.service.ts P0 ✅
│   ├── nfc/
│   │   └── orders/
│   │       └── nfc-order.service.ts             P0 ✅
│   ├── accounting/
│   │   ├── creator-invoicing/
│   │   │   └── creator-invoicing.service.ts     P0 ✅
│   │   ├── vat-margin/
│   │   │   └── vat-margin.service.ts            P0 ✅
│   │   └── fec-export/
│   │       └── fec-export.service.ts            P0 ✅
│   └── prisma/
│       └── schema.automations.prisma            ← À fusionner
└── frontend/
    └── app/(admin)/admin/automations/
        ├── page.tsx                             ← Dashboard dark gold
        ├── runs/page.tsx
        ├── settings/page.tsx
        └── components/
            └── automation-card.tsx
```

## Intégration

### 1. Backend

```bash
# 1. Copier les fichiers dans backend/src/modules/
cp -r automatisations/backend/* backend/src/modules/

# 2. Fusionner le schéma Prisma
cat automatisations/backend/prisma/schema.automations.prisma >> backend/prisma/schema.prisma

# 3. Migrate
cd backend && npx prisma migrate dev --name add-automations

# 4. Importer le module dans app.module.ts
# imports: [..., AutomationsModule]
```

### 2. Frontend

```bash
cp -r automatisations/frontend/app/* frontend/app/
```

### 3. Variables d'environnement

```env
# .env
NFC_SUPPLIER=mock
NFC_SUPPLIER_API_KEY=
NFC_SUPPLIER_ENDPOINT=
```

## Règles de conception

- **Idempotence** : chaque action critique a une clé `automation_dedupe`.
- **Audit** : tout est loggé dans `audit_log_automations`.
- **Toggle** : chaque automatisation peut être désactivée via
  `automation_settings.enabled`.
- **Modèle 82/18** : appliqué *uniquement* sur la marge nette,
  jamais sur le coût total (cf. memory `project_8218_model.md`).

## Tests

Voir `backend/test/automations/*.spec.ts` à créer pour chaque service.
Targets unitaires :
- `pricing-engine.service.spec.ts` — vérifie 82/18 sur marge
- `itinerary-generator.service.spec.ts` — pauses chauffeur respectées
- `vat-margin.service.spec.ts` — TVA = marge × 20/120
- `fec-export.service.spec.ts` — format FEC valide (test-conformite.exe)

## Cron actifs

| Cron | Quand | Service |
|------|-------|---------|
| `0 3 1 * *` | 1er du mois 03:00 | CreatorInvoicing |
| `0 2 19 * *` | 19 du mois 02:00 | VatMargin |
| `0 0 31 12 *` | 31/12 minuit | FecExport |
| `0 18 * * *` | 18:00 chaque jour | SMS J-1 |
| `*/15 * * * *` | Toutes 15min | Notifications dispatch |
| `0 9 * * *` | 09:00 chaque jour | Digest créateurs |
