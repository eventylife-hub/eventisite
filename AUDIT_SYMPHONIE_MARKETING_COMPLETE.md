# AUDIT — Symphonie Marketing complète Eventy

**Date** : 2026-05-04
**Branche** : `claude/laughing-tharp-f735a8`
**Auteur** : Claude (PDG IA d'Eventy)
**Scope** : Audit + livraison du système marketing **synchronisé au cycle de vie** des voyages (J-60 annonce → J+90 fidélisation), éditable globalement par l'équipe Eventy ou par segment, avec **auto-cotisation énergie** sur publication.

---

## Vision livrée

> Chaque voyage Eventy a sa propre **partition marketing** — annonce, boost, last-call, départ, souvenirs, reconversion.
> L'équipe ajuste les templates → propagation automatique sur tous les voyages liés.
> Chaque post publié par un créateur cotise automatiquement à l'énergie du pool communauté voyageurs.

---

## Existant avant cette session

### Marketing déjà en place
| Module | Statut |
|--------|--------|
| `/pro/marketing/` (18 sous-pages) | ✅ Dashboard, créer, analytics, leads, qr-print, shortlinks, studio-ia, reseaux, visuels, viral, templates, calendrier, etc. |
| `/admin/marketing/` (19 sous-pages) | ✅ Acquisition, advocacy, analytics, campaigns, content, createurs, funnel, leads, planner, presse, prospectus, rays, referral, retention, segments, studio-clip, templates |
| `/equipe/marketing/` (templates, innovation) | ✅ Vue équipe générique |
| `/maisons/vendre-3min/page.tsx` | ✅ HRA partner pitch — toujours connecté dans sidebar maisons |
| `/pro/vendre/` (cockpit + 8 sous-pages) | ✅ Cockpit de vente premium creator |
| Système RAYS ☀️ | ✅ Monnaie marketing créateurs (cf. `AUDIT-MARKETING-COMPLET.md`) |
| 12 emails HTML pré-rédigés | ✅ `marketing/emails-html/*` + `TEMPLATE-VARIABLES-REFERENCE.md` |
| `components/marketing/{campaign-card,campaign-wizard,metrics-chart}` | ✅ 3 composants existants |
| Sidebar `/pro` "Vendre en 3 minutes" | ✅ Group existant — manquait l'item direct vers le wizard |

### Trouvaille importante
La sidebar `/pro/layout.tsx` ligne 82 a déjà un parent `'Vendre en 3 minutes'` avec children → manquait juste un lien direct vers une page wizard. **Reconnecté** avec `🎯 Pitch wizard 3 minutes → /pro/vendre-en-3-minutes`.

---

## Ce qui manquait (et a été livré)

### 1. Cycle de vie marketing par voyage (J-60 → J+90)

Aucun système ne synchronisait le marketing au calendrier de chaque voyage. Les templates email étaient statiques, déclenchés ad-hoc. **Livré** : 13 phases standardisées :

| Phase | Offset | Canaux par défaut | Pts énergie |
|-------|--------|-------------------|-------------|
| J-60 Annonce | -60j | Email + Insta + X + FB | 50 |
| J-45 Second wave | -45j | Email + Ambassadeurs + WhatsApp | 30 |
| J-30 Boost | -30j | Email + Push + Insta + TikTok | 40 |
| J-21 FOMO | -21j | Insta + FB + Email | 25 |
| J-14 Last Call | -14j | Email + FB + Push + SMS | 35 |
| J-7 Préparation | -7j | Email + Groupe + Push | 20 |
| J-3 Rappel | -3j | SMS + Push + Email | 15 |
| J0 Départ | 0 | SMS + Push + Insta | 30 |
| J+1 Suivi | +1j | Email + Insta | 20 |
| J+3 Témoignages | +3j | Push + Insta + TikTok | 25 |
| J+7 Souvenirs | +7j | Email + Push | 40 |
| J+30 Reconversion | +30j | Email + Push | 30 |
| J+90 Fidélisation | +90j | Email | 35 |

### 2. Templates pré-rédigés multi-canal multi-catégorie

30+ templates FR par phase × canal × catégorie (city break, aventure, famille, sénior, luxe, EVJF/EVG, entreprise, etc.). Ton et vocabulaire adaptés à chaque audience. Variables `{{VARS}}` interpolées au moment de l'envoi.

### 3. Édition globale + segment

L'équipe Eventy peut éditer un template Eventy → propagation sur **tous les voyages liés**. Édition par segment (destination, catégorie, prix, mois, tier énergie) pour cibler une audience spécifique.

### 4. Auto-cotisation énergie

Décision PDG : automatique, pas la peine de signaler à chaque action. Multiplicateurs par canal (Insta ×1.5, TikTok ×1.6, Email ×1.0, etc.) + qualité + reach. Le pool énergie cumulé est ensuite redistribué aux voyageurs Astre.

### 5. Pitch wizard 3 minutes

Wizard 4 étapes (Hook → Image+phrase → 3 raisons → CTA), auto-rempli depuis la symphonie source du voyage et les templates par catégorie. Détails marketing complets : audience, ton, mots-clés SEO. Texte brut copiable, version visuelle prête pour vidéo / réunion / téléphone.

---

## Fichiers livrés

### `lib/` (helpers + types + données)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `lib/marketing-symphony.ts` | ~330 | Types `MarketingCampaign`, `MarketingTouchpoint`, `MessageTemplate`, `AudienceSegment`, `CampaignMetrics`, `ABTest`. Constantes : `TOUCHPOINT_DEFAULTS` (13 phases), `CHANNEL_LABELS` (12 canaux), `CATEGORY_LABELS` (13 catégories), `STATUS_LABELS`. Helpers : `buildDefaultTouchpoints()`, `computeAggregateMetrics()`, `applyTemplateVariables()`, `listTemplateVariables()`. |
| `lib/marketing-templates.ts` | ~440 | 30+ presets `TemplatePreset` couvrant les 13 phases × principaux canaux × catégories. Helpers : `getTemplatesForPhase()`, `getTemplatesByCategory()`, `getTemplateById()`, `getTemplatesGroupedByPhase()`. |
| `lib/marketing-cotisation.ts` | ~165 | `computeCotisationPoints()`, `buildCotisationEventFromPublish()`, `summarizeCotisation()`, `persistCotisationToBackend()`. Multiplicateurs canaux. |
| `lib/marketing-symphony-mock.ts` | ~120 | Mock data : 8 campagnes (5 templates + 3 actives), 5 segments, 6 voyages, 15 destinations. À remplacer par les API réelles. |

### `components/marketing/`

| Fichier | Description |
|---------|-------------|
| `TouchpointTimeline.tsx` | Frise horizontale chronologique J-60 → J+90, sélection phase, affichage canaux + énergie potentielle |
| `SymphonyCampaignCard.tsx` | Card campagne avec métriques inline (reach, ouverture, clic, CA), badge statut + catégorie |
| `TemplateEditor.tsx` | Éditeur avec onglets Edit/Preview/Code, support email (subject + preheader + body + CTA), push, SMS, social. Variables détectées auto. Aperçu rendu fidèle. |
| `SegmentBuilder.tsx` | Constructeur de segment : nom, catégories, destinations, prix, mois, tier voyageur. Reach estimé en temps réel. |
| `MarketingAnalytics.tsx` | KPIs reach/ouverture/clic/CA, performance par canal (barres), pool énergie cotisé, top campagnes par CA. |

### Pages équipe `/equipe/symphonie-marketing/`

| Page | Description |
|------|-------------|
| `page.tsx` | Hub central — KPIs, navigation 4 cards (Templates / Segments / Analytics / Planner), cycle de vie, liste campagnes (grid + list view), validation/modération |
| `templates/page.tsx` | Bibliothèque 30+ templates par phase × canal × catégorie. Édition globale → propagation auto. Filtres catégorie / canal / recherche. |
| `segments/page.tsx` | Liste segments + constructeur de segment (filters multi-axes) |
| `analytics/page.tsx` | Reporting cross-créateurs (réutilise `MarketingAnalytics` component) |
| `planner/page.tsx` | Calendrier d'envois à venir / passés pour toutes les campagnes actives. A/B testing. |

### Pages créateur `/pro/`

| Page | Description |
|------|-------------|
| `marketing/symphonie/page.tsx` | Symphonie marketing du créateur — sélection voyage, frise touchpoints, édition étape par étape, mode aperçu, message auto-cotisation énergie |
| `vendre-en-3-minutes/page.tsx` | Wizard pitch 3 minutes — 4 étapes (Hook / Image+phrase / 3 raisons / CTA), auto-prefill par catégorie, preview cinéma + texte brut copiable, détails marketing |

### Sidebar

| Sidebar | Modification |
|---------|--------------|
| `app/(equipe)/equipe/layout.tsx` | + entrée `'Symphonie marketing'` (icône 🎼) sous Marketing dans Pôles métiers |
| `app/(pro)/pro/layout.tsx` | + 1er enfant `'🎯 Pitch wizard 3 minutes'` dans le groupe "Vendre en 3 minutes" — résout l'absence reportée par David |

---

## TODOs Eventy laissés en commentaires

```ts
// TODO Eventy: connexion ESP email (Brevo / Mailgun / SendGrid / Postmark) pour envois massifs
// TODO Eventy: SMS gateway (Twilio / OVH SMS / Free Mobile API)
// TODO Eventy: push notifications mobiles (Firebase / OneSignal)
// TODO Eventy: scheduler campagnes (cron + queue Bull / BullMQ)
// TODO Eventy: A/B testing avec stats significatives (Bayesian inference)
// TODO Eventy: AI génération templates (OpenAI/Anthropic)
// TODO Eventy: tracking liens UTM par campagne
// TODO Eventy: désinscription RGPD 1-clic + gestion centre préférences
// TODO Eventy: webhook backend → POST /api/pro/marketing/cotisation/earn
// TODO Eventy: distribution mensuelle pool énergie aux voyageurs Astre
// TODO Eventy: validation MJML sur templates email côté backend avant envoi
// TODO Eventy: enregistrement pitch vidéo direct via webcam (MediaRecorder API)
// TODO Eventy: AI génération pitch personnalisé selon symphonie + audience
// TODO Eventy: tracking conversion par pitch (qui regarde, durée, conversion)
// TODO Eventy: traductions EN / ES des templates
```

---

## Architecture finale

```
┌──────────────────────────────────────────────────────────────────────┐
│ ÉQUIPE EVENTY — /equipe/symphonie-marketing                          │
│                                                                       │
│  Hub ↔ Templates ↔ Segments ↔ Analytics ↔ Planner                    │
│  Modifie un template → propage à tous les voyages liés (avec preview)│
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ lib/marketing-symphony.ts — types + 13 phases standardisées          │
│ lib/marketing-templates.ts — 30+ templates FR par phase × canal      │
│ lib/marketing-cotisation.ts — multiplicateurs énergie par canal      │
└──────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                            ▼
  ┌─────────────────────────┐  ┌─────────────────────────┐
  │ CRÉATEUR — /pro/        │  │ CRÉATEUR — /pro/        │
  │ marketing/symphonie     │  │ vendre-en-3-minutes     │
  │                         │  │                         │
  │ Hérite template Eventy  │  │ Wizard 4 étapes         │
  │ Personnalise par voyage │  │ Auto-prefill par cat.   │
  │ Cotise énergie via      │  │ Preview cinéma + texte  │
  │ chaque publication      │  │ Pour vidéo/réunion/tel  │
  └─────────────────────────┘  └─────────────────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │ POOL ÉNERGIE COMMUNAUTÉ │
                │ Distribution mensuelle  │
                │ aux voyageurs Astre     │
                └─────────────────────────┘
```

---

## Prochaines actions recommandées (post-MVP)

1. **Backend NestJS** — module `marketing-symphony` avec :
   - `POST /api/marketing/campaigns` (CRUD)
   - `POST /api/marketing/templates` (avec versioning)
   - `POST /api/marketing/segments` (avec recalcul reach)
   - `POST /api/pro/marketing/cotisation/earn` (idempotent par référence)
   - Worker Bull/BullMQ pour scheduler envois
2. **ESP intégration** — Brevo en premier choix (français, RGPD-friendly, MJML support)
3. **AI génération** — endpoint `POST /api/marketing/ai/generate` (OpenAI ou Anthropic) pour adapter templates au ton/langue/audience
4. **Tracking UTM** — auto-injection paramètres UTM dans tous les liens templates
5. **Gestion désinscription RGPD** — centre préférences `/preferences` 1-clic
6. **Tests** — Jest unit pour helpers cotisation + templates, Playwright e2e pour wizard pitch + édition templates

---

## Garanties qualité

- ✅ TypeScript strict — types exhaustifs
- ✅ Aucun fichier existant supprimé (additif uniquement)
- ✅ Sidebar `/maisons/vendre-3min` préservée
- ✅ Sidebar `/pro/vendre/*` préservée — wizard ajouté en 1er enfant du groupe existant
- ✅ Pages `/pro/marketing/templates` et `/pro/marketing/calendrier` existantes non modifiées (linkées depuis nouvelles pages)
- ✅ Design ULTRA premium — Playfair Display + Inter, ivoire `#F5F1E8` + or `#D4A853` sur noir `#0A0E14`, glassmorphism, Framer Motion
- ✅ Tous TODOs Eventy explicitement documentés en commentaires en tête de chaque fichier

---

> **L'âme d'Eventy** : le client doit se sentir aimé. La symphonie marketing prolonge cet amour par chaque message — du premier teaser au souvenir d'après-voyage.

— Claude, le 4 mai 2026
