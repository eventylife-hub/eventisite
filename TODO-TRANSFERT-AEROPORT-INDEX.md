# Index TODOs — Module Transferts Aéroport

> Centralise tous les `// TODO Eventy [TRANSFERT-AEROPORT P0/P1]` placés dans le code
> pendant l'audit. Permet de tracker l'avancement de l'implémentation.
>
> Dernière maj : 2026-05-02 (après vague 3 — module NestJS, tests, API client, emails, intégration symphonie).

---

## P0 — Critique pour MVP avion

### Backend

| # | Fichier | Ligne | Description |
|---|---|---|---|
| B-01 | `backend/src/modules/transport/transport.module.ts` | ~51 | Brancher `AirportTransferModule` dans `imports: [...]` une fois Prisma migré |
| B-02 | `backend/src/modules/transport/airport-transfer/airport-transfer.module.ts` | — | NestJS module créé, à importer dans transport.module.ts ou inliner |
| B-03 | `backend/prisma/schema.prisma` | (à ajouter) | Créer `model AirportTransferProvider` (catégorie, IATA, tarifs, rating) |
| B-04 | `backend/prisma/schema.prisma` | (à ajouter) | Créer `model AirportTransferQuote` (provider, direction, prix, statut, point RDV, chauffeur) |
| B-05 | `backend/prisma/schema.prisma` | (à ajouter) | Créer `model AirportTransferZone` (mapping IATA → providers + radius hôtels) |
| B-06 | `backend/prisma/schema.prisma` | (à ajouter) | Créer enums `AirportTransferQuoteStatus`, `TransferProviderCategory`, `TransferDirection` |
| B-07 | `airport-transfer.service.ts:createRfq` | ~71 | Implémenter — appel Google Distance Matrix + création N quotes en bulk + send emails RFQ |
| B-08 | `airport-transfer.service.ts:approveQuote` | ~127 | Implémenter — passage à APPROVED + push notif client + audit log |
| B-09 | `airport-transfer.service.ts:rejectQuote` | ~136 | Implémenter — passage à REJECTED + email provider + relance autres |
| B-10 | `airport-transfer.service.ts:compareQuotes` | ~158 | Implémenter — tri top 3 par score combiné (qualité 40 + prix 30 + délai 15 + retard vol 15) |
| B-11 | `airport-transfer.service.ts:listProviders` | ~170 | Implémenter — query Prisma + filtres (airportIATA, category) |
| B-12 | `airport-transfer.service.ts:updateDriverInfo` | ~191 | Implémenter — update + push notif client + trigger email J-1 |
| B-13 | `airport-transfer.service.ts:calculateRoute` | ~209 | Intégrer `@googlemaps/google-maps-services-js` + cache Redis 24h |
| B-14 | `airport-transfer.controller.ts:createProvider` | ~106 | Implémenter dans le service + ajouter à controller |
| B-15 | Email service | — | Câbler `buildRfqProviderEmail` + `buildClientTransferEmail` dans `EmailService.send()` |
| B-16 | Cron | — | Créer cron `airport-transfer-rfq-timeout` — relance providers 24h sans réponse |
| B-17 | Cron | — | Créer cron `airport-transfer-j-minus-1` — envoie email client J-1 sur transferts APPROVED |
| B-18 | Tests | — | Étendre `airport-transfer.service.spec.ts` quand chaque méthode est implémentée |

### Frontend

| # | Fichier | Description |
|---|---|---|
| F-01 | `frontend/app/(admin)/admin/transferts-aeroport/page.tsx` | Remplacer `DEMO_PROVIDERS` par `airportTransferApi.listProviders()` |
| F-02 | `frontend/app/(admin)/admin/transferts-aeroport/page.tsx` | Modal "Nouveau prestataire" — POST `/api/admin/transferts-aeroport/providers` |
| F-03 | `frontend/app/(equipe)/equipe/transferts/page.tsx` | Remplacer `DEMO_QUOTES` par `airportTransferApi.listForEquipe()` |
| F-04 | `frontend/app/(equipe)/equipe/transferts/page.tsx` | Brancher boutons Valider/Refuser sur `airportTransferApi.approveQuote/rejectQuote` |
| F-05 | `frontend/app/(equipe)/equipe/transferts/page.tsx` | Ouvrir `<ComparateurDevisModal>` sur clic "Comparer 3 devis" |
| F-06 | `frontend/app/(pro)/pro/voyages/[id]/transferts-aeroport/page.tsx` | Remplacer `DEMO_QUOTES` par `airportTransferApi.compareQuotes()` |
| F-07 | `frontend/app/(pro)/pro/voyages/[id]/transferts-aeroport/page.tsx` | Bouton "Sélectionner ce devis" → `airportTransferApi.selectQuote()` |
| F-08 | `frontend/app/(client)/client/voyage/[id]/transfert/page.tsx` | Remplacer `DEMO_TRANSFER` par `airportTransferApi.getClientTransfer()` |
| F-09 | `frontend/app/(client)/client/voyage/[id]/transfert/page.tsx` | Intégrer carte Google Maps Embed (route aéroport → hôtel) |
| F-10 | `frontend/.../symphonie/SymphonieAirportTransferStep.tsx` | Câbler à `formData.airportTransfer.quotes` (lecture statut devis) |
| F-11 | `frontend/lib/transport/transferts-aeroport-api.ts` | Mettre `USE_MOCK_DATA = false` quand backend câblé |
| F-12 | `frontend/.../nouveau/page.tsx:useEffect auto-transfert` | Déclencher auto `airportTransferApi.createRfq()` sur création voyage avion |

### Symphonie / Workflow

| # | Description |
|---|---|
| S-01 | Injection auto dans EtapeProgram.activities (J0 / J-final) |
| S-02 | Validation symphonie : flag obligatoire si voyage avion + hôtel mais pas de transfert APPROVED |
| S-03 | Per-occurrence config (1 paire transfert ARRIVAL/DEPARTURE par départ) |

---

## P1 — Important non-bloquant

| # | Description |
|---|---|
| P1-01 | Carte temps réel chauffeurs côté équipe (GPS) |
| P1-02 | Push notification mobile client : "chauffeur en route", "chauffeur arrivé" |
| P1-03 | Versions email FR/EN/ES selon préférence client |
| P1-04 | Fallback Mapbox / OSM si quota Google Distance Matrix atteint |
| P1-05 | Tooltip "Comment est calculé le score ?" dans le comparateur |
| P1-06 | Élargir `TransferVehicleType` à `BERLINE`, `TAXI`, `VTC`, `NAVETTE_PARTAGEE` |
| P1-07 | Possibilité messagerie client ↔ chauffeur via plateforme (anonymisée) |
| P1-08 | Heatmap couverture mondiale dans /admin/transferts-aeroport |
| P1-09 | Import bulk CSV pour seed massif providers internationaux |
| P1-10 | Optimistic updates pour approve/reject (UX immédiate avant retour API) |

---

## P2 — Nice-to-have

| # | Description |
|---|---|
| P2-01 | Webhook callback prestataire (réception devis via API au lieu de form) |
| P2-02 | Auto-RFQ relance si délai > 24h sans réponse |
| P2-03 | Scoring qualité auto post-voyage (avis voyageurs → recompute qualityScore) |
| P2-04 | Recommandations auto basées sur historique (ce prestataire a fait 50 transferts à RAK avec 4.8★) |

---

## Avancement total

| Catégorie | Total | Faits | Restant |
|---|---|---|---|
| **Backend P0** | 18 | 4 (evaluateAutoApprove, calcCombinedScore, rankAndBadge, generateAuditNotes) | 14 |
| **Frontend P0** | 12 | 0 | 12 |
| **Symphonie P0** | 3 | 0 (composant fait, pas câblé data) | 3 |
| **P1** | 10 | 0 | 10 |
| **P2** | 4 | 0 | 4 |
| **TOTAL** | **47** | **4** | **43** |

## Vague 4 (2026-05-02) — fonctions pures + squelettes implémentés

| Item | Lignes | Tests |
|---|---|---|
| `airport-transfer-scoring.helper.ts:calcCombinedScore` | implémenté | ✓ 3 tests |
| `airport-transfer-scoring.helper.ts:rankAndBadge` | implémenté | ✓ 4 tests |
| `airport-transfer-scoring.helper.ts:generateAuditNotes` | implémenté | ✓ 6 tests |
| Page `/transferts/repondre/[token]` | squelette | (UI uniquement) |
| `airport-transfer-cron.service.ts` (5 crons) | squelette | — |
| `TransfertsKpiWidget.tsx` | squelette | (UI uniquement) |
| `PRISMA-MODELS.md` | proposition | — |

## Vague 5 (2026-05-02) — pages opérationnelles + emails + migration SQL

| Item | Lignes | Type |
|---|---|---|
| Page `/chauffeur/transferts-aeroport` | 341 | Frontend mission jour J |
| Page `/equipe/transferts/live` | 367 | Frontend tracking temps réel |
| `email-templates/flight-delay.template.ts` | 180 | 2 templates (client + driver) |
| `email-templates/quote-rejected.template.ts` | 120 | template refus poli |
| `migration.sql` | 223 | UP+DOWN complets, ref DBA |
| `airport-transfer-analytics.service.ts` (7 méthodes) | 134 | service squelette KPIs historiques |

## Vague 6 (2026-05-02) — webhooks, fallback, recrutement, dashboards, feedback

| Item | Lignes | Type |
|---|---|---|
| `webhooks/airport-transfer-webhooks.controller.ts` | 178 | 3 endpoints HMAC-protégés (status/incident/driver-info) |
| `airport-transfer-fallback.service.ts` (8 méthodes) | 217 | gestion crise no-show/panne/annulation/retard |
| `email-templates/transfer-cancelled.template.ts` | 89 | email annulation client |
| Page `/transferts/devenir-partenaire` | 393 | landing + form recrutement prestataires |
| Page `/equipe/transferts/performance` | 411 | dashboard analytique 30/60/90j |
| Page `/client/voyage/[id]/transfert/feedback` | 254 | feedback post-voyage 4 critères + recommend |

## Vague 7 (2026-05-02) — finalisation : OpenAPI, RGPD, tests, panneau, synthèse

| Item | Lignes | Type |
|---|---|---|
| `openapi.yaml` | 592 | spec OpenAPI 3.0 (14 endpoints + 17 schemas) |
| `RGPD-COMPLIANCE.md` | 193 | Article 30 RGPD (sous-traitants + rétention) |
| `airport-transfer.controller.spec.ts` | 146 | 8 tests intégration NestJS |
| `index.ts` (barrel export) | 64 | imports propres `@/modules/transport/airport-transfer` |
| `PanneauAeroportPreview.tsx` | 163 | composant visuel panneau gold |
| `AUDIT_TRANSFERT_AEROPORT_HOTEL_FINAL.md` | 255 | synthèse PDG des 7 vagues |

## Vague 8 (2026-05-02) — outillage QA + i18n + monitoring + manifest

| Item | Lignes | Type |
|---|---|---|
| `postman-collection.json` | ~360 | collection import-ready 14 requêtes 6 dossiers |
| `seed-data.json` | ~150 | 8 providers + 13 zones aéroports |
| `airport-transfer-health.controller.ts` | 60 | endpoint /health/airport-transfer |
| `MANIFEST.md` | 220 | inventaire complet + quick start dev |
| Page `/admin/transferts-aeroport/emails-preview` | 244 | outil QA preview 6 templates email |
| `lib/transport/transferts-aeroport-i18n.ts` | 194 | strings client FR/EN/ES (22 clés) |

---

## Comment retrouver un TODO dans le code

```bash
# Tous les TODOs transferts aéroport
grep -rn "TRANSFERT-AEROPORT" frontend/ backend/

# Uniquement P0
grep -rn "TRANSFERT-AEROPORT P0" frontend/ backend/

# Compter par fichier
grep -rl "TRANSFERT-AEROPORT" frontend/ backend/ | xargs -I {} sh -c 'echo "$(grep -c TRANSFERT-AEROPORT {}) {}"'
```

---

*Index créé 2026-05-02 par l'audit IA PDG · branche `claude/dazzling-shockley-1dd0a1`*
