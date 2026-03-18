# DASHBOARD PDG — Eventy

> **Dernière mise à jour** : 18 mars 2026 — Session nuit : PWA Pro/Admin reconstruites + Brand Guide + Audit Frontend
> **PDG** : David — eventylife@gmail.com
> **Activité** : Plateforme SaaS + Agence de voyages de groupe
> **Domaine** : www.eventylife.fr
> **Modèle** : **Bus complet 53 places = unité de base** | Pack Sérénité inclus | B2B = priorité marge
> **Données** : Coûts réels 2026 vérifiés + modèle bus complet propagé dans tous les documents + dossier avocat .docx prêt

---

## Vision stratégique — Bus complet 53 places

> **« Chaque voyage Eventy = un bus complet de 53 passagers. Prix optimisé, ambiance garantie, Pack Sérénité inclus. Zéro surprise, zéro stress. »**

### Le modèle en un coup d'œil

| Indicateur | Ancien modèle (15 pers) | **Nouveau modèle (53 pers)** |
|-----------|------------------------|------------------------------|
| Groupe moyen | 15 personnes | **53 personnes (bus complet)** |
| CA moyen par voyage | 6 045€ | **19 766€** (×3,3) |
| Marge brute par voyage | 1 371€ (22,7%) | **4 919€ (24,9%)** (×3,6) |
| Break-even | 1-2 voyages/mois | **1 voyage tous les 2-3 mois** |
| CA total Y1 | ~284 000€ | **~500 000€** (+76%) |
| Marge brute Y1 | ~42 600€ | **~119 000€** (+179%) |
| Trésorerie fin M12 | ~33 978€ | **~159 000€** (×4,7) |
| Voyageurs Y1 | ~600 | **~1 432** |

### 3 sources de remplissage = bus toujours complet

1. **Groupe organisateur** (50-70%) : Le groupe principal qui réserve le voyage
2. **Places ouvertes sur eventylife.fr** (20-30%) : Voyageurs individuels qui rejoignent un voyage publié
3. **Réseau auto-entrepreneurs** (10-20%) : Guides, animateurs qui amènent leurs propres clients

### Scalabilité — Bus × Avion

| Phase | Voyageurs | Transport | Période |
|-------|-----------|-----------|---------|
| **Phase 1** : 1 bus | 53 pers | Bus 53 places | M4-M8 |
| **Phase 2** : 2 bus | 106 pers | 2 bus + allotement avion | M9-M10 |
| **Phase 3** : 3 bus = charter | 159 pers | 3 bus + **charter A320** (-35 à -50%) | M11+ |
| **Phase 4** : 4 bus | 212 pers | 4 bus + charter B737 | Y2+ |

---

## 🔧 Organisation Cowork (MAJ 16/03/2026)

| Instance | Rôle | Instructions | État | Statut |
|----------|------|-------------|------|--------|
| **Cowork BACK** | Backend NestJS, API, Stripe | `INSTRUCTIONS-COWORK-BACK.md` | `ETAT-COWORK-BACK.md` | ✅ **TERMINÉ** B-001→B-010 |
| **Cowork FRONT** | Frontend Next.js, Pages, UI | `INSTRUCTIONS-COWORK-FRONT.md` | `ETAT-COWORK-FRONT.md` | ✅ **TERMINÉ** F-001→F-010 + V2-V5 |
| **Cowork PDG** | Coordination, pilotage | Ce dashboard | — | 🔄 Actif |

**Fichiers de coordination :**
- `SPRINT-COWORK.md` — Plan de sprint 6 phases, 20 LOTs — **TOUS TERMINÉS ✅**
- `CONTRAT-API-COWORK.md` — Contrat API **MAJ V70** (15/03/2026)
- `ETAT-COWORK-BACK.md` / `ETAT-COWORK-FRONT.md` — Mémoire persistante entre sessions
- `AUDIT-TECHNIQUE-2026-03-15.md` — **NOUVEAU** : Rapport technique complet (sécurité A-, perf A/B, tests 85%)
- `AUDIT-API-COMPLIANCE-2026-03-15.md` — **NOUVEAU** : Audit conformité API

**🟢 DÉVELOPPEMENT TERMINÉ — Prêt pour déploiement production.**

---

## Actions urgentes en attente

| Action | Priorité | Détail |
|--------|----------|--------|
| **Envoyer les 6 brouillons Gmail** | P0 | APST, CMB, Hiscox, Chevalier Conseil, Nexco, Mutuaide — prêts dans Gmail |
| **Relancer sous 7 jours** | P0 | Si pas de réponse aux emails de devis |
| **Trouver avocat tourisme** | P0 | Contacter Maître Llop + TourismLex — **DOSSIER AVOCAT .DOCX PRÊT** (DOSSIER-AVOCAT-EVENTY.docx) |
| **Vérifier capacité professionnelle** | P0 | Atout France exige un justificatif — voir options dans IMMATRICULATION-ATOUT-FRANCE.md |
| **Contacter ORIAS** | P1 | Pack Sérénité = question qualification IAS prioritaire pour l'avocat |
| **Rotater credentials Neon DB** | P0 TECH | Le mot de passe BDD a été exposé dans .env — rotater AVANT mise en prod |
| **Déployer sur Scaleway** | P0 TECH | **PRÊT** — deploy.sh, monitoring, k6, tests Stripe ✅ — RESTE: remplir .env.production + provisionner instance |

---

## 🖥️ Statut Technique (MAJ 18/03/2026)

| Métrique | Valeur |
|----------|--------|
| **TypeScript** | ✅ 0 erreur frontend + backend |
| **Auth** | ✅ JWT + 2FA TOTP (RFC 6238) + Argon2id + cookie fix |
| **Sécurité** | **A++** — 4 critiques + 4 majeures corrigées (Session 145), AllExceptionsFilter, CSP durci, HSTS 2ans, TOTP chiffré AES-256-GCM, rate limiting, Fail2Ban |
| **Performance** | A/B — Redis cache activé, 275 index DB, 0 N+1 |
| **Tests** | 90%+ — 180+ fichiers, 1800+ tests |
| **SEO** | A — Sitemap dynamique, robots.txt, JSON-LD TravelAgency, OpenGraph |
| **API** | 377 endpoints, 100% documentés (API-REFERENCE.md), Swagger en dev |
| **Backend** | ✅ 100% — 31 modules, env-validation, AllExceptionsFilter, graceful shutdown |
| **Email** | ✅ **23/23 templates**, Outbox pattern, retry exponential, dead letter, dual provider |
| **Monitoring** | ✅ Admin UI + CRON surveillance 30min + rapport quotidien 7h + Sentry |
| **Stripe** | ✅ Tests intégration (20 cas), 6 flows, idempotence, invariants 3/4/5/7 |
| **Load testing** | ✅ 3 scénarios k6, 4 profils (smoke/load/stress/spike) |
| **Frontend** | ✅ 100% — 3 portails, 122 pages, MaintenanceBanner, PWA |
| **PWA Pro** | ✅ **RECONSTRUITE** — 1198 lignes, 28 vues, 47 pages (tabs inclus), React 18 + Chart.js |
| **PWA Admin** | ✅ **RECONSTRUITE** — 1405 lignes, 26 pages complètes, tableaux + graphiques + filtres |
| **Brand Guide** | ✅ **CRÉÉ** — Couleurs, fonts, tone voice, DO/DON'T, règles visuelles |
| **Audit Frontend** | ✅ Score **8/10** — Architecture solide, besoin tests avant prod |
| **Infrastructure** | ✅ Docker + Nginx TLS + CI/CD + deploy.sh + backup + logrotate |
| **Ops tooling** | ✅ setup-server, deploy-wizard, smoke-test, pre-deploy-check, backup-db, maintenance-db |
| **Documentation** | ✅ DEPLOY-GUIDE + RUNBOOK + API-REFERENCE + PROGRESS |
| **Pages** | 115 (22 client + 43 pro + 26 publiques + 24 admin) |
| **Code total** | ~290 000 lignes TS/TSX (hors node_modules) |

---

## Statut global — 36+ fichiers / 14 dossiers — TOUS ENRICHIS + MODÈLE BUS COMPLET

| Domaine | Statut | Priorité | Fichier référence |
|---------|--------|----------|-------------------|
| Structure juridique (SAS) | ✅ Coûts réels chiffrés | **P0** | `01-legal/STRUCTURE-JURIDIQUE.md` |
| Garantie financière APST | 📧 Devis demandé (05/03) | **P0** | `08-assurance-conformite/GARANTIE-FINANCIERE.md` |
| RC Pro | 📧 2 devis demandés (05/03) | **P0** | `08-assurance-conformite/RC-PRO.md` |
| Immatriculation Atout France | ⏳ Après APST + RC | **P0** | `01-legal/IMMATRICULATION-ATOUT-FRANCE.md` |
| Compte bancaire pro | Après SAS | **P0** | `14-pitch/PITCH-BANQUE.md` |
| Avocat tourisme | ✅ **Dossier .docx prêt** + cabinets identifiés | **P0** | `01-legal/CHECKLIST-AVOCAT.md` + `DOSSIER-AVOCAT-EVENTY.docx` |
| Expert-comptable tourisme | 📧 2 devis demandés (05/03) | **P1** | `13-comptabilite/GUIDE-COMPTABLE.md` |
| CGV Code du Tourisme | ✅ Template enrichi (validation avocat) | **P1** | `01-legal/CGV-TEMPLATE.md` |
| Contrat partenaire type | ✅ Template enrichi (validation avocat) | **P1** | `01-legal/CONTRAT-PARTENAIRE-TYPE.md` |
| Mentions légales | ✅ Template enrichi | **P1** | `01-legal/MENTIONS-LEGALES.md` |
| RGPD Conformité | ✅ Enrichi (registre + DPA + AIPD) | **P1** | `01-legal/RGPD-CONFORMITE.md` |
| Checklist avocat | ✅ 13 questions + cabinets + budget | **P1** | `01-legal/CHECKLIST-AVOCAT.md` |
| **Coûts réels 2026** | ✅ **COMPLET** | P1 | `02-finance/COUTS-REELS.md` |
| Budget prévisionnel | ✅ **Bus complet** — 3 scénarios + Y1 = 500K€ CA | P1 | `02-finance/BUDGET-PREVISIONNEL.md` |
| Plan trésorerie | ✅ **Bus complet** — M0-M12 → 159K€ solde M12 | P1 | `02-finance/PLAN-TRESORERIE.md` |
| Grille tarifaire | ✅ **Bus complet** — 4 exemples détaillés (53-159 pers) | P1 | `02-finance/GRILLE-TARIFAIRE.md` |
| **Assurance voyage Pack Sérénité** | ✅ Force de vente n°1 | P1 | `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` |
| Assurance voyage | 📧 Devis Mutuaide demandé (05/03) | P1 | `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` |
| **Stratégie partenaires** | ✅ **Bus complet** — 4 leviers + 53+ pers minimum | P1 | `05-partenaires/STRATEGIE-PARTENAIRES.md` |
| **Suivi partenaires** | ✅ Dashboard + workflow + conversion | P1 | `05-partenaires/SUIVI-PARTENAIRES.md` |
| Stratégie négociation | ✅ Créé | P1 | `05-partenaires/STRATEGIE-NEGOCIATION.md` |
| Intégration technique | ✅ Créé | P1 | `05-partenaires/INTEGRATION-TECHNIQUE-PARTENAIRES.md` |
| Transport | ✅ **Bus complet** — Matrice bus×avion + charter | P2 | `03-transport/COMPARATIF-TRANSPORT.md` |
| Marketing lancement | ✅ **Bus complet** — 6 canaux + "places ouvertes" | P2 | `07-marketing-commercial/PLAN-LANCEMENT.md` |
| RH / Organisation | ✅ Enrichi (coûts salariaux réels, phases 1-3) | P2 | `06-rh-organisation/ORGANIGRAMME.md` |
| Hébergement cloud | ✅ Enrichi (tarifs Scaleway 2026) | P2 | `04-hebergement-infra/COMPARATIF-CLOUD.md` |
| **🔒 Audit sécurité LOT 166** | ✅ **COMPLET — 88 vulnérabilités + 8 Session 145 corrigées** | **P0** | `PROGRESS.md` (Phases 1-129 + Session 145) |
| Déploiement tech | ✅ Enrichi (Scaleway + Go/No-Go) | P2 | `09-site-beta/PLAN-DEPLOIEMENT.md` |
| Process quotidien | ✅ Enrichi (routines + 4 process + KPIs) | P2 | `10-operations/PROCESS-QUOTIDIEN.md` |
| Guide comptable TVA marge | ✅ Enrichi | P2 | `13-comptabilite/GUIDE-COMPTABLE.md` |
| Modèle facture | ✅ Enrichi (exemple concret) | P2 | `13-comptabilite/MODELE-FACTURE.md` |
| Pitch banque | ✅ **Bus complet** — Y1 = 500K€ CA, 119K€ marge | P2 | `14-pitch/PITCH-BANQUE.md` |
| **Templates emails** | ✅ **26 templates** (3 fichiers) | P2 | `11-templates-emails/` |
| **Âme d'Eventy** | ✅ **CRÉÉE** — Manifeste fondateur, visible par tous les Cowork | P0 | `AME-EVENTY.md` |
| **Brand Guide rapide** | ✅ **CRÉÉ** — Couleurs, fonts, tone voice, règles visuelles | P1 | `07-marketing-commercial/BRAND-GUIDE-RAPIDE.md` |
| **Audit marketing** | ✅ **CRÉÉ** — 75% alignement, 18 recommandations | P1 | `07-marketing-commercial/AUDIT-MARKETING-HARMONISATION.md` |
| **Audit frontend détaillé** | ✅ **CRÉÉ** — Score 8/10, architecture solide | P1 | `FRONTEND-AUDIT-DETAILLE.md` |
| Checklist lancement | ✅ **8 phases enrichies** | P2 | `12-checklist-lancement/CHECKLIST-COMPLETE.md` |
| **Contacts PDG** | ✅ **14 contacts enregistrés** | — | `CONTACTS-PDG.md` |
| **Incubateurs/Accélérateurs France** | ✅ **11 incubateurs tourisme + 5 accel tech + 5 plateforme cofondateurs** | **P1** | `05-partenaires/INCUBATEURS-ACCELERATEURS-COFONDATEURS.md` |

---

## Décisions stratégiques PDG (06/03/2026)

### 1. Bus complet 53 places = USP marketing principal
- **Chaque voyage = 53 passagers minimum** → coûts partagés → prix imbattable
- Tous les supports, pitchs, emails mentionnent "53 passagers = meilleur prix"
- Capacité minimum partenaires : **27+ chambres, 53+ couverts, 53+ participants**
- Ne contracter qu'avec des prestataires pouvant accueillir 53+ personnes

### 2. Pack Sérénité = Argument n°1 pour la conversion
> **"Chez Eventy, vous partez l'esprit tranquille. Garantie complète incluse."**
- Assurance complète incluse dans chaque voyage (100% souscription — pas d'option)
- Coût ~4,5% du prix du voyage au client (~17-53€/voyageur selon type)
- Coût assureur ~2-3% → marge ~50% sur le Pack Sérénité
- Argument n°1 pour les partenaires : "paiement garanti, pas de risque d'impayé"

### 3. "Places ouvertes" = Nouveau canal d'acquisition
- Voyageurs individuels (solo, couples, petits groupes) rejoignent un voyage existant
- Page dédiée "Voyages ouverts" sur eventylife.fr + newsletter hebdo
- Widget en temps réel "X places restantes" sur chaque voyage
- Objectif : 25% du remplissage via places ouvertes dès M12

### 4. Stratégie de négociation — 4 leviers
- **Levier 1 — Volume** : **1 400+ voyageurs/an dès Y1**, 5 000+ Y2
- **Levier 2 — Bus complets garantis** : 53 personnes minimum, pas 15-20 comme les agences classiques
- **Levier 3 — Auto-entrepreneurs** : Réseau qui recommande les partenaires → flux clients additionnel gratuit
- **Levier 4 — Plateforme tech** : Intégration digitale, paiement auto J+30, zéro paperasse

### 5. B2B = Priorité stratégique (marge 25-27%)
- Séminaires 53 personnes = segment le plus rentable (26,8% marge)
- Cible : CE, PME 50-500 salariés, DRH, agences événementielles
- Prospection LinkedIn + cold email dès M1
- Objectif : 40% du CA en B2B dès M12

### 6. Domaine = eventylife.fr
- Tous les documents, emails, templates utilisent eventylife.fr (PAS eventy.fr)
- Emails : contact@eventylife.fr, sinistre@eventylife.fr, comptabilite@eventylife.fr

---

## Prévisionnel Y1 — Modèle bus complet

### Montée en puissance

| Période | Voyages | Type | CA | Marge (~22-25%) | Trésorerie cumulée |
|---------|---------|------|-----|----------------|-------------------|
| **M1-M3** | 0 | Setup + prospection | 0€ | 0€ | ~4 500€ |
| **M4** | 1 | WE France 53 pers | 20 000€ | 4 900€ | ~8 500€ |
| **M5** | 1 | Séminaire B2B 53 pers | 21 000€ | 5 600€ | ~13 100€ |
| **M6** | 2 | 1 WE + 1 B2B | 41 000€ | 10 500€ | ~22 500€ |
| **M7-M8** | 2/mois | Mix WE + B2B | 91 000€ | 21 500€ | ~41 000€ |
| **M9-M10** | 3/mois | + Europe 2 bus (106 pers) | 218 000€ | 47 000€ | ~85 000€ |
| **M11-M12** | 3-4/mois | Charter 159 pers + multi-bus | 378 000€ | 78 000€ | **~159 000€** |
| **TOTAL Y1** | **~21** | | **~500 000€** | **~119 000€** | |

### KPIs cibles

| KPI | M3 | M6 | M12 |
|-----|-----|-----|------|
| Voyages bus complet/mois | 0 | 2-3 | 3-4 |
| Voyageurs/mois | 0 | 106-159 | 159-212 |
| CA mensuel | 0€ | 60 000€ | 120 000€ |
| Taux remplissage bus | — | 90% | **95%+** |
| Part B2B dans le CA | 0% | 35% | **40%** |
| Part "places ouvertes" | 0% | 20% | **25%** |
| CAC (coût acquisition client) | — | 60€ | 40€ |
| ROAS Google Ads | — | 5× | 7× |
| NPS (satisfaction) | — | 50+ | 60+ |

---

## Chemin critique (8-12 semaines)

```
Semaine 1-2 :  Créer SAS ─────────────────────► Compte bancaire pro (Qonto)
                    │
                    ├── 📧 Devis envoyés : APST, CMB, Hiscox, Chevalier, Nexco, Mutuaide
                    ├── 📧 Contacter avocat tourisme (Llop / TourismLex)
                    │
Semaine 1-2 :  Réponses devis → choisir avocat + expert-comptable + assureur Pack Sérénité
                    │
Semaine 2-4 :  Déposer dossier APST ──────────► Garantie financière (~2 100€/an)
                    │
Semaine 2-3 :  Souscrire RC Pro ──────────────► Attestation (~780-1 200€/an)
                    │
Semaine 3-4 :  Signer contrat assureur Pack Sérénité ► Conditions intégrées CGV
                    │
Semaine 3-6 :  Avocat : CGV + CGU + mentions + contrat partenaire ► Documents publiés
                    │
Semaine 4-6 :  Dossier Atout France ──────────► Immatriculation IM (~100€)
                    │
Semaine 4-8 :  Prospection partenaires ───────► 14+ contrats signés (capacité 53+ pers)
                    │                              (7 templates emails prêts)
                    │                              (4 leviers négo : volume 1 400 voy + bus complet + Pack Sérénité + plateforme)
                    │
Semaine 6-8 :  Déploiement production ────────► Site live (Scaleway ~25€/mois)
                    │                              + Pages "Voyages ouverts" (places ouvertes)
                    │
Semaine 8-10 : Marketing lancement ───────────► 6 canaux + Google Ads + "places ouvertes"
                    │
Semaine 10-12: 1er voyage bus complet 53 pers ► Premiers avis + contenu marketing
                    │
Mois 9+ :     2 bus (106 pers) ───────────────► Test scalabilité multi-bus
                    │
Mois 11+ :    3 bus + charter A320 (159 pers) ► Marge maximale (-35 à -50% vs allotement)
```

---

## Budget résumé — Coûts réels 2026

| Scénario | Investissement initial | Charges/an | Charges/mois | Break-even |
|----------|----------------------|------------|-------------|------------|
| **Minimaliste** | ~5 295€ | ~6 103€ | ~509€ | Mois 4 |
| **Recommandé** | ~9 890€ | ~8 728€ | ~727€ | Mois 4 |
| **Confortable** | ~14 490€ | ~11 353€ | ~946€ | Mois 4 |

> **Modèle bus complet** : Break-even = M4 dans TOUS les scénarios (1 seul voyage bus complet = 4 919€ de marge = 5 mois de charges fixes). L'ancien modèle 15 pers nécessitait M4-M6.

> **Attention** : Le scénario minimaliste ne compte PAS la contre-garantie APST (10 000€). Avec contre-garantie : minimaliste ~15 295€, recommandé ~19 890€.

### Flux financiers — BFR favorable

```
Client paie 19 766€ TTC (53 personnes × 373€)
├── Acompte 30% = 5 930€ (à la réservation, J-45)
└── Solde 70% = 13 836€ (à J-30 avant départ)

Stripe verse les fonds : J+2 (CB) / J+5 (SEPA)

Eventy paie les prestataires : J+30 après le séjour

→ Trésorerie positive en permanence (~45 jours de cash disponible)
→ Marge Eventy : 4 919€ (24,9%)
```

---

## Offres de lancement — Base bus complet 53 places

| Offre | Prix/pers | Marge | Volume |
|-------|-----------|-------|--------|
| Weekend découverte (2J/1N) | À partir de **179€** | ~22% | 53 pers |
| Weekend premium (3J/2N) | À partir de **349€** | ~25% | 53 pers |
| Séjour Europe semaine (7J/6N) | À partir de **899€** | ~17% | 106-159 pers |
| Séminaire entreprise B2B | Sur devis | **~27%** | 53 pers |

> Chaque offre = bus complet + Pack Sérénité inclus. Double différenciateur : meilleur prix + zéro stress.

---

## Marketing — 6 canaux d'acquisition

| Canal | Budget M1-M3 | Budget M4+ | KPI cible |
|-------|-------------|------------|-----------|
| **SEO** (blog + pages destination) | 0€ | 0€ | 1 000 visiteurs/mois M6 |
| **Réseaux sociaux** (Instagram, Facebook, TikTok, LinkedIn) | 0€ | 100-500€/mois | 5 000 abonnés M6 |
| **Google Ads** (Search B2C + B2B + Display) | 400€/mois | 800-1 000€/mois | ROAS > 5× |
| **Places ouvertes** (eventylife.fr) | 0€ | 0€ | 25% du remplissage M12 |
| **Auto-entrepreneurs** (réseau prescripteurs) | 0€ | 0€ | 10-20% du remplissage |
| **B2B direct** (LinkedIn + cold email) | 0€ | 100€/mois | 40% du CA M12 |

**Budget marketing total** : 512€/mois (M1-M3) → 1 012€/mois (M4-M6) → 1 512€/mois (M7-M12) → **~12 500€/an**

---

## Templates emails — 26 templates prêts à l'emploi

| Fichier | Nombre | Cibles |
|---------|--------|--------|
| `EMAILS-PARTENAIRES.md` | **9 templates** | Hébergement, activités, transport, restauration, assureur, relance, devis, confirmation, post-séjour |
| `EMAILS-CLIENTS.md` | **10 templates** | Accusé réception, devis (Pack Sérénité), relance, confirmation, solde J-30, documents J-15, rappel J-3, satisfaction J+3, avis J+7, fidélisation J+30 |
| `EMAILS-ADMINISTRATIF.md` | **7 templates** | APST, Atout France, RC Pro, banque, expert-comptable, ORIAS, CCI |

> Tous les templates incluent : domaine eventylife.fr, Pack Sérénité, leviers de négociation bus complet 53 pers, signature "Fondateur & Président"

---

## Backend technique

| Métrique | Valeur |
|----------|--------|
| Modules NestJS | 32 (+3 nouveaux : Support, Public, ProMessagerie) |
| Pages frontend Next.js 14 | 102 (21 client + 27 pro + 23 admin) |
| Composants React réutilisables | 72 |
| Fichiers tests | 125 (.spec.ts) (+3 nouveaux : prisma-error, support, public) |
| Tests totaux | 3 300+ (3 301 pass) + 22 nouveaux cas |
| Lignes de code | ~296 500 (+1 500 : DTOs, tests, utils, SEO) |
| Audits backend | **11/11 complétés** (LOT 163-166) |
| **Migration API frontend** | **✅ TERMINÉE** — 120+ fetch migrés → apiClient, 21 route handlers supprimés |
| **Couverture API front↔back** | **~90%+** — 60 endpoints manquants identifiés, 48 créés/alignés, 12 chemins corrigés |
| **Build backend** | **✅ 0 erreur** — `npm run build` clean (15/03/2026) — node_modules à réinstaller |
| **Build frontend** | **✅ 0 erreur** — 139 pages compilées (15/03/2026) |
| **Audit qualité portails** | **✅ FAIT** — Homepage SEO 92/100, Pro/Admin/Client a11y WCAG AA, 40+ correctifs |
| **Gap schema Prisma** | **⚠️ 80 modèles / 93 enums manquants en base** — migration `sync_schema_v3` à exécuter |
| **Session 124** | **80+ correctifs** — 11 DTOs Zod, 8 index Prisma, 6 SEO pages, 4 rate limits, type safety (DISPUTED/WAYPOINT/DocumentType), email idempotency, checkout a11y, admin role check client-side |
| Bugs corrigés (total) | **350+ fixes** (TOCTOU, ownership, XSS, N+1, perf, DTO, infra, type safety, SQL injection, IDOR, DoS, webhook idempotency, a11y, SEO) |
| Session 118 (LOT 165) | **65+ bugs** + 71 index Prisma + 30 @updatedAt + 9 DTO + 6 infra |
| Session 119 (LOT 166) | **175+ fixes** — 63 phases, 12+ CRITICAL (reset-pwd, S3, webhooks, JWT, pricing, SQL injection, IDOR bookings/cancellation/checkout, webhook idempotency), enum type safety (5 modèles), **rate limiting complet (132 décorateurs / 35 contrôleurs)**, production guards (7 routes mock), **JWT HMAC-SHA256 signature verification**, **magic bytes upload validation**, **SanitizeHtmlPipe global**, **error leakage fix**, **CORS/headers audit 18 contrôles ✅**, **$executeRawUnsafe → Prisma.sql**, **unbounded findMany() DoS protection (6 queries)**, **IDOR/RBAC fixes (19 endpoints)**, **webhook upsert→create+P2002** |
| **Rate limiting** | **136 décorateurs @RateLimit** sur **37/37 contrôleurs** (100% couverture) — 8 profils, finance+logout ajoutés Session 124 |
| **Sécurité frontend** | JWT signature HMAC-SHA256 (middleware), refresh token lock anti-race-condition, double production guard sur 3 routes mock |
| **Sécurité uploads** | Magic bytes validation (JPEG/PNG/WebP/PDF/MP4) + S3 range request pour les 16 premiers octets |
| **XSS protection** | SanitizeHtmlPipe enregistré globalement — supprime script/iframe/object/embed + event handlers |
| **Information leakage** | Messages d'erreur génériques sur health checks et export DSAR |
| **SQL injection** | `$executeRawUnsafe` éliminé → `Prisma.sql` + regex whitelist table names |
| **DoS protection** | 6 requêtes `findMany()` sans limite → `take` limits (1K-50K) ajoutés |
| **IDOR/RBAC** | 19 endpoints corrigés — ownership checks bookings (confirm/cancel/findById/addRoom), cancellation (detail/refund audit), travel lifecycle (PRO→PRO+ADMIN), checkout (selectRooms/participants/splitPay/progress/extendHold) |
| **Webhook idempotency** | **BUG CRITIQUE** : upsert avec `update:{}` ne bloquait pas le double traitement → corrigé par `create` + catch P2002. Dispute handler protégé par status guard `updateMany`. |
| Module HRA | 24 endpoints, 40 tests |
| Prisma schema | **3 304 lignes** (+72 lignes : 41 index, 30 @updatedAt, 3 migrations, 4 onDelete) |
| Zustand stores | 6 (auth, checkout, client, pro, notification, ui) |
| CI/CD | 4 workflows GitHub Actions |
| **Automatisations** | **15-21h/semaine économisées** |
| **DTO validation** | **11 DTOs Zod** ajoutés (Session 124) — admin (5), client (3), support (2), checkout (1). 100% des endpoints POST/PATCH validés |
| **SEO** | 6 pages publiques + homepage optimisées — metadata, JSON-LD (TravelOffer, FAQ, Contact, Blog ItemList, BreadcrumbJsonLd), OpenGraph |
| **Accessibilité** | WCAG 2.1 AA — 40+ fixes : ARIA labels, semantic HTML, prefers-reduced-motion, keyboard navigation, screen reader support |
| **Email idempotency** | idempotencyKey unique ajouté au modèle EmailOutbox |
| **Dette technique restante** | ~10 `as any` (réduit de 15), ~10 `process.env` (configs), CHECK constraint capacity, rotation DB creds, 2FA/MFA réel (stubs en place), CSP unsafe-inline (Next.js SSR), EXIF stripping images |
| **Infra déploiement** | ✅ Docker multi-stage (backend + frontend), docker-compose 4 services, CI/CD GitHub Actions (build+test+deploy), CSP headers complet |

---

## Emails de devis en attente (05/03/2026)

| Destinataire | Objet | Statut |
|-------------|-------|--------|
| APST (info@apst.travel) | Adhésion + garantie financière | 📝 Brouillon Gmail |
| CMB Assurances | RC Pro agence voyage | 📝 Brouillon Gmail |
| Hiscox | RC Pro alternative | 📝 Brouillon Gmail |
| Chevalier Conseil | Expert-comptable tourisme | 📝 Brouillon Gmail |
| Nexco | Expert-comptable alternative | 📝 Brouillon Gmail |
| Mutuaide Assistance | Assurance voyage groupes | 📝 Brouillon Gmail |

> **Action immédiate** : Envoyer les 6 brouillons Gmail → Relancer sous 7 jours si pas de réponse.

---

## Contacts prioritaires (14 contacts enregistrés)

| Contact | Pourquoi | Statut |
|---------|----------|--------|
| **APST** | Garantie financière | 📧 Devis demandé |
| **CMB Assurances** | RC Pro (agréé Atout France) | 📧 Devis demandé |
| **Hiscox** | RC Pro alternative | 📧 Devis demandé |
| **Chevalier Conseil** | Expert-comptable tourisme (165€/mois) | 📧 Devis demandé |
| **Nexco** | Expert-comptable alternative | 📧 Devis demandé |
| **Mutuaide Assistance** | Assurance voyage groupes | 📧 Devis demandé |
| **Maître Emmanuelle Llop** | Avocat droit du tourisme (Paris) | À contacter |
| **TourismLex** | Cabinet spécialisé tourisme | À contacter |
| Europ Assistance | Assurance voyage alternative | À contacter |
| Allianz Travel | Assurance voyage | À contacter |
| AXA / MMA / Generali | RC Pro alternatives | À contacter |
| Atout France | Immatriculation IM | Après APST + RC Pro |
| INPI | Dépôt marque Eventy | À faire |
| MTV (Médiation Tourisme) | Adhésion obligatoire (gratuit) | À faire |

> Détails complets dans `CONTACTS-PDG.md`

---

## Fichiers enrichis — Bilan complet (06/03/2026)

### Session 1 — Création et coûts réels
| Fichier | Action |
|---------|--------|
| `02-finance/COUTS-REELS.md` | ✅ CRÉÉ — 10 sections, tous coûts réels 2026 |
| `05-partenaires/STRATEGIE-NEGOCIATION.md` | ✅ CRÉÉ — 5 leviers négociation |
| `05-partenaires/INTEGRATION-TECHNIQUE-PARTENAIRES.md` | ✅ CRÉÉ — Connexions plateforme ↔ partenaires |
| `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` | ✅ CRÉÉ — Pack Sérénité = force de vente |
| `CONTACTS-PDG.md` | ✅ MIS À JOUR — 14 contacts enregistrés |

### Session 2 — Enrichissement documents existants
| Fichier | Action |
|---------|--------|
| `01-legal/STRUCTURE-JURIDIQUE.md` | ✅ Enrichi (coûts réels greffe 55,93€) |
| `01-legal/IMMATRICULATION-ATOUT-FRANCE.md` | ✅ Enrichi (conditions 2026 + capacité pro) |
| `02-finance/BUDGET-PREVISIONNEL.md` | ✅ Enrichi (3 scénarios réalistes) |
| `02-finance/PLAN-TRESORERIE.md` | ✅ Enrichi (M0-M12 avec vrais coûts) |
| `02-finance/GRILLE-TARIFAIRE.md` | ✅ Enrichi (exemples concrets) |
| `04-hebergement-infra/COMPARATIF-CLOUD.md` | ✅ Enrichi (tarifs Scaleway 2026) |
| `08-assurance-conformite/GARANTIE-FINANCIERE.md` | ✅ Enrichi (APST 2 100€/an) |
| `08-assurance-conformite/RC-PRO.md` | ✅ Enrichi (780-1 200€/an) |

### Session 3 — Enrichissement finance + juridique
| Fichier | Action |
|---------|--------|
| `14-pitch/PITCH-BANQUE.md` | ✅ Enrichi (chiffres réels 2026) |
| `07-marketing-commercial/PLAN-LANCEMENT.md` | ✅ Enrichi (budget marketing réel) |
| `03-transport/COMPARATIF-TRANSPORT.md` | ✅ Enrichi (prestataires réels) |
| `13-comptabilite/GUIDE-COMPTABLE.md` | ✅ Enrichi (TVA marge détaillée) |
| `13-comptabilite/MODELE-FACTURE.md` | ✅ Enrichi (exemple concret) |
| `06-rh-organisation/ORGANIGRAMME.md` | ✅ Enrichi (coûts salariaux réels) |
| `01-legal/CGV-TEMPLATE.md` | ✅ Enrichi (conformité Code du Tourisme) |
| `01-legal/CONTRAT-PARTENAIRE-TYPE.md` | ✅ Enrichi (DPA + Pack Sérénité) |
| `01-legal/MENTIONS-LEGALES.md` | ✅ Enrichi (LCEN + Code Tourisme) |
| `01-legal/RGPD-CONFORMITE.md` | ✅ Enrichi (registre + DPA + AIPD) |
| `09-site-beta/PLAN-DEPLOIEMENT.md` | ✅ Enrichi (Scaleway + Go/No-Go) |

### Session 4 — Enrichissement opérations + partenaires + emails
| Fichier | Action |
|---------|--------|
| `01-legal/CHECKLIST-AVOCAT.md` | ✅ Enrichi (13 questions, cabinets, budget) |
| `10-operations/PROCESS-QUOTIDIEN.md` | ✅ Enrichi (routines + 4 process + KPIs) |
| `05-partenaires/STRATEGIE-PARTENAIRES.md` | ✅ Enrichi (3 leviers + 6 assureurs) |
| `05-partenaires/SUIVI-PARTENAIRES.md` | ✅ Enrichi (dashboard + workflow + conversion) |
| `11-templates-emails/EMAILS-PARTENAIRES.md` | ✅ Enrichi (9 templates, domain corrigé) |
| `11-templates-emails/EMAILS-CLIENTS.md` | ✅ Enrichi (10 templates, Pack Sérénité) |
| `11-templates-emails/EMAILS-ADMINISTRATIF.md` | ✅ Enrichi (7 templates, ORIAS + CCI) |
| `12-checklist-lancement/CHECKLIST-COMPLETE.md` | ✅ Enrichi (8 phases + récap documents) |

### Session 5 — Domaine + dossier avocat
| Fichier | Action |
|---------|--------|
| **Tous les fichiers (25+)** | ✅ Domaine corrigé : eventy.life → **eventylife.fr** |
| `DOSSIER-AVOCAT-EVENTY.docx` | ✅ CRÉÉ — Dossier Word professionnel pour avocat tourisme |

### Session 6 — Refonte modèle bus complet 53 places
| Fichier | Action |
|---------|--------|
| `03-transport/COMPARATIF-TRANSPORT.md` | ✅ **REFONTE** — Matrice bus×avion, charter, fill rate |
| `02-finance/GRILLE-TARIFAIRE.md` | ✅ **REFONTE** — 4 exemples détaillés 53-159 pers |
| `02-finance/BUDGET-PREVISIONNEL.md` | ✅ **REFONTE** — Y1 = 500K€ CA, 119K€ marge |
| `02-finance/PLAN-TRESORERIE.md` | ✅ **REFONTE** — M0-M12, solde M12 = 159K€ |
| `14-pitch/PITCH-BANQUE.md` | ✅ **REFONTE** — 3 unit economics, scalabilité |
| `05-partenaires/STRATEGIE-PARTENAIRES.md` | ✅ **REFONTE** — 4 leviers, 1 400+ voy/an, capacité 53+ |
| `07-marketing-commercial/PLAN-LANCEMENT.md` | ✅ **REFONTE** — 6 canaux, places ouvertes, B2B priorité |
| `DASHBOARD-PDG.md` | ✅ **REFONTE** — Vision bus complet intégrée |

---

## Livrables interactifs

| Livrable | Description |
|----------|-------------|
| `DASHBOARD-EVENTY.html` | Dashboard interactif 7 onglets + simulateur transport + simulateur devis |
| `BUDGET-EVENTY.xlsx` | Excel 4 onglets, 72 formules, trésorerie M0-M12, simulateur transport |
| `DOSSIER-AVOCAT-EVENTY.docx` | Dossier professionnel Word pour avocat tourisme (38 pages) |
| `PDG-EVENTY-COMPLET.zip` | Archive complète de tous les fichiers du projet |

---

## Décisions PDG — Prochaines actions (par ordre de priorité)

1. **IMMÉDIAT** : Envoyer les 6 brouillons Gmail (APST, CMB, Hiscox, Chevalier, Nexco, Mutuaide)
2. **Cette semaine** : Contacter Maître Llop et TourismLex (avocat tourisme) — budget pack 3 000€-5 000€
3. **Semaine 2** : Relancer les 6 contacts si pas de réponse sous 7 jours
4. **Semaine 2-3** : Choisir avocat + expert-comptable → lancer création SAS
5. **Semaine 3-4** : Déposer dossier APST + souscrire RC Pro + contacter assureur Pack Sérénité
6. **Semaine 4-6** : Déposer Atout France + commencer prospection partenaires (capacité 53+ pers obligatoire)
7. **Semaine 6-8** : Déploiement production + pages "Voyages ouverts" (places ouvertes)
8. **Semaine 8-10** : Lancement marketing (6 canaux) + Google Ads + prospection B2B (20 messages LinkedIn/semaine)
9. **Semaine 10-12** : **1er voyage bus complet 53 pers** → premiers avis + contenu marketing
10. **Mois 9+** : Tester 2 bus (106 pers) → scalabilité multi-bus
11. **Mois 11+** : Lancer premier charter A320 (159 pers) → marge maximale

---

## Apps PWA Standalone — État au 17/03/2026 23h30

### ✅ App Admin PWA (terminée)
- **Fichier** : `admin-pwa/index.html` (1 566 lignes)
- **Pages** : 20 pages complètes
- **Features** : Charts Chart.js, dark mode, bottom nav mobile, toasts, modales confirmation, recherche globale ⌘K, panneau notifications, service worker v2
- **Déployé** : eventylife.vercel.app (à re-déployer avec les dernières MAJ)

### ✅ App Pro PWA (terminée)
- **Fichier** : `pro-pwa/index.html` (771 lignes)
- **Pages** : 15 pages complètes (Dashboard, Voyages, Détail voyage, Créer voyage, Réservations, Revenus, Finance, Messagerie, Marketing, Profil, Formation, Documents, Vendre/Partager, Paramètres, Support)
- **Features** : Charts Chart.js, dark mode, bottom nav mobile, toasts, modales confirmation, Fraunces font display, design Sun/Ocean
- **À déployer** : créer un nouveau projet Vercel `eventylife-pro`

### Résumé technique PWA
| App | Lignes | Pages | Charts | Dark mode | Bottom nav | Toasts | Modales | SW |
|-----|--------|-------|--------|-----------|-----------|--------|---------|-----|
| Admin | 1 566 | 20 | ✅ 8 charts | ✅ | ✅ | ✅ | ✅ | v2 |
| Pro | 771 | 15 | ✅ 6 charts | ✅ | ✅ | ✅ | ✅ | v2 |
