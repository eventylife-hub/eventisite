# 📜 Historique des décisions structurantes

> **Dernière mise à jour** : 16 avril 2026
> Ce document consigne les décisions **structurantes** d'Eventy — celles qui engagent la direction du produit, du modèle économique, de la stack, du vocabulaire, et qu'il faut pouvoir retrouver pour comprendre "pourquoi c'est comme ça".
>
> Format : date · décision · contexte · conséquences · statut.

---

## 2026-04 — Vocabulaire pro officialisé

**Décision** : adopter un vocabulaire humain et fidèle à l'âme d'Eventy, remplaçant les termes transactionnels classiques.

| Avant | Après |
|-------|-------|
| client / utilisateur | **Voyageur** |
| partenaire pro / indépendant / prestataire | **Créateur** |
| vendeur / revendeur | **Ambassadeur** |
| fournisseur hôtel/resto/activité | **Maison HRA** |
| service / département / team | **Pôle** |
| 14 métiers internes | **14 Pôles** |

**Contexte** : audit 360 pages d'avril 2026 a révélé une forte disparité de termes dans les UI (client, utilisateur, partenaire, pro, indé). Incohérent avec la promesse Eventy "on prend soin des gens" et avec l'âme "les indépendants sont des créateurs".

**Conséquences** :
- Tous les contenus marketing + UI doivent migrer vers ce vocabulaire.
- Les routes `/pro`, `/client`, `/admin` restent en anglais/neutre pour raisons techniques, mais les strings UI doivent utiliser les nouveaux termes.
- Voir [`VOCABULAIRE-EVENTY.md`](./VOCABULAIRE-EVENTY.md) pour le référentiel complet.

**Statut** : ✅ Décidé · 🟡 Migration UI en cours.

---

## 2026-04 — Pennylane comme backend comptable

**Décision** : intégrer **Pennylane** pour la comptabilité (remplace la comptabilité manuelle + exports CSV vers expert-comptable).

**Contexte** :
- Le régime TVA marge (spécifique agence de voyages) nécessite une compta rigoureuse.
- L'expert-comptable Chevalier Conseil facture 200€/mois en travaillant manuellement.
- Pennylane permet une sync automatique banque + Stripe + export FEC compliant.

**Conséquences** :
- Ping test fonctionnel au 15/04/2026.
- Intégration complète (sync bancaire, écritures auto, exports FEC) à câbler (~6h, Pôle Finance + Pôle Tech).
- Pages admin concernées : `/admin/finance/ledger`, `/admin/finance/exports-comptable`, `/equipe/finance`.

**Statut** : 🟡 En cours — UI prête, sync à câbler.

---

## 2026-04 — Stack IA : Claude-first

**Décision** : **Claude (Anthropic)** est le moteur IA principal d'Eventy. Tout nouveau cas d'usage IA commence par Claude.

**Modèles** :
- **Opus 4.6** pour le raisonnement long, audit qualité, rédaction fiches voyages, décisions Go/No-Go assistées.
- **Sonnet 4.6** pour rédaction marketing, modération avis, support niveau 1.
- **Haiku 4.5** pour classification, tagging, autocomplete.

**Compléments** :
- Mapbox (géocoding, routes)
- OpenAI embeddings (expérimental, recherche sémantique catalogue)
- Stripe Radar (anti-fraude)

**Contexte** : besoin d'efficacité × 3 sur production contenu + support pour tenir la promesse "0 stress" à grande échelle. Anthropic offre la meilleure qualité de raisonnement + prompt caching + compliance (enterprise).

**Conséquences** :
- Studio IA `/pro/marketing/studio-ia` utilise Claude Sonnet 4.6.
- Auto-sélection médias dans wizard → Claude Haiku (classification).
- Modération avis + support niveau 1 → Claude Sonnet.
- David utilise Claude Code CLI pour piloter le projet (voir [`../CLAUDE.md`](../CLAUDE.md)).
- Pas de PII (nom/email/tel) dans les prompts non-essentiels.

**Statut** : ✅ Adopté · Déployé sur studio-ia, modération, PDG. Extension en cours.

---

## 2026-04 — Modèle 14 co-fondateurs (parts sociales, pas salaire)

**Décision** : Eventy ne recrute pas des salariés pour les 14 fonctions clés — elle recrute **14 co-fondateurs**, rémunérés en **parts sociales** de la SAS.

**Modèle** :
- Chaque co-fondateur = 1 Pôle.
- Rémunération = **parts sociales** (allocation % actions).
- Revenu de base = **activité de Créateur** sur Eventy (si applicable) + éventuelle allocation minimale temporaire.
- Objectif : aligner intérêts, réduire masse salariale en amorçage, créer un noyau dur motivé.

**Contexte** :
- Masse salariale classique Phase 3 (voir `pdg-eventy/06-rh-organisation/ORGANIGRAMME.md`) : ~31 690€/mois. Impossible en amorçage.
- David croit aux partenariats long terme : les meilleurs ne viennent pas pour un salaire, ils viennent pour construire quelque chose de grand.
- Le modèle Eventy (plateforme + indépendants) s'y prête : les co-fondateurs sont eux-mêmes des Créateurs.

**Conséquences** :
- Les 14 Pôles sont des "postes co-fondateurs" à pourvoir.
- Les salaires fixes ne démarrent qu'à partir de CA > 80 000€/mois (Phase 3).
- Plan de recrutement : prospection active dans réseau pro + réseau voyage + tech.
- Pacte d'actionnaires nécessaire (avocat).

**Statut** : ✅ Décidé · 🟡 Recrutement en cours des premiers co-fondateurs.

---

## 2026-04 — Double gamme Standard / Luxe

**Décision** : Eventy propose deux gammes, mais **lance uniquement la gamme Standard en Phase 1**. Luxe = Phase 2.

| Gamme | Phase | Prix/pax | Taille groupe | Maisons | Transport |
|-------|-------|----------|---------------|---------|-----------|
| **Standard** | **Phase 1 (actuelle)** | 500-1 200€ | 53 (bus complet) | 3-4★ | Bus 53 places |
| **Luxe** | Phase 2 (H2 2026) | 2 000-5 000€ | 15-25 | 5★, Maisons VIP | Charter, voitures privées |

**Contexte** :
- Le marché Eventy cible d'abord le **grand public** (bus 53, prix accessible) pour lancer à grande échelle.
- La gamme Luxe est un marché plus petit mais plus marge (meilleure rentabilité par voyage).
- Lancer les deux en même temps diluerait le message et compliquerait les opérations.

**Conséquences** :
- Site public, wizard Créateur, fiche voyage = orientés Standard en Phase 1.
- Mega-nav admin a déjà un **switch gamme** prêt (cablé UI, activation Phase 2).
- Maisons VIP (Coordination VIP, Sécurité VIP, Transport luxe) sont configurées mais masquées côté Voyageur Phase 1.
- Bracelets restaurateur = Phase 2 Luxe principalement.

**Statut** : ✅ Décidé · 🟡 Standard live · ⏳ Luxe = Phase 2.

---

## 2026-03 — Seuil minimal de départ assumé (40-45 pax)

**Décision** : Eventy **part même si le bus n'est pas plein**. Seuil minimal de rentabilité = 40-45 Voyageurs selon le voyage. Bus plein à 53 = sweet spot, pas obligatoire.

**Contexte** :
- Le modèle de seuil = 53 rigoureux provoque des annulations fréquentes (si manque 5 places).
- Annulation = perte de confiance + coûts opérationnels + perte Voyageurs sur la saison.
- L'âme d'Eventy (cf. AME-EVENTY.md) : "on ne laisse pas des Voyageurs enthousiastes sur le carreau parce qu'il manque 5 places".

**Conséquences** :
- Promesse Voyageur : *"On part — et on part bien."*
- Décisions Go/No-Go `/admin/voyages/[id]/go-no-go` s'adaptent au seuil minimum par voyage.
- Places ouvertes publiques (`/voyages`) restent ouvertes jusqu'au dernier moment.
- Impact financier : marge × 0.8 environ si bus à 45 vs 53, mais ROI global positif (fidélité + réputation).

**Statut** : ✅ Décidé · ✅ Implémenté dans wizard Go/No-Go + communications.

---

## 2026-03 — Pack Sérénité **toujours inclus, jamais une option**

**Décision** : l'assurance + assistance Eventy (Pack Sérénité) est **incluse, gratuite, sans case à cocher**, pour 100% des Voyageurs.

**Contexte** :
- Les concurrents proposent l'assurance en option payante complexe, avec clauses cachées.
- L'âme Eventy : "zéro surprise, zéro stress".
- Le coût d'assurance est absorbé dans la marge (~3-5% du CA).

**Conséquences** :
- Pas de case à cocher pendant le checkout.
- Pas de petites lignes.
- Pas de supplément caché.
- Communication simple : *"Quoi qu'il arrive, on s'en occupe."*
- Intégré dans la cascade de prix du wizard tarification.

**Statut** : ✅ Décidé · ✅ Implémenté partout.

---

## 2026-03 — Transport opéré par Équipe Eventy (pas par les Créateurs)

**Décision** : les Créateurs **proposent** / **demandent** du transport, mais c'est le **Pôle Transport Eventy** qui opère (négocie, valide, planifie).

**Détail** :
- **Créateurs Standard** : génèrent une demande transport → Pôle Transport valide le devis.
- **Créateurs Premium** (`isPremium=true` sur `ProProfile`) : peuvent auto-valider leurs devis sans intervention Pôle.
- **13 types de transport** dont 6 prestige : BUS_STANDARD, BUS_VIP, MINIBUS, VAN, FLIGHT, CHARTER, TRAIN, VAN_VIP, LIMOUSINE, LUXURY_CAR, PRIVATE_JET, HELICOPTER, YACHT.

**Contexte** :
- Les indépendants sont autonomes sur l'expérience voyage, mais la logistique transport nécessite expertise + négociations volume + responsabilité juridique.
- Eventy porte la responsabilité finale (immatriculation Atout France).

**Conséquences** :
- Portail Pro : affiche estimations + statuts devis + demandes.
- Portail Admin : outils complets (gestion loueurs, flotte, validation devis).
- Modèle `TransportProvider` étendu en 2026-03-23 avec SIRET, specialties, vehicleTypes, certifications, rating.
- Modèle `TransportProviderInvoice` créé.

**Statut** : ✅ Décidé · ✅ Implémenté.

---

## 2026-03 — Déploiement Backend Scaleway (pas AWS)

**Décision** : backend hébergé sur **Scaleway** (Paris), pas sur AWS.

**Contexte** :
- Promesse Eventy : "une boîte française, données en France".
- Scaleway = offre cloud française, performante, prix compétitif.
- Concurrence AWS/GCP : moins chère sur petits volumes mais complexité RGPD + image.
- Serveur DEV1-M 4Go après tentative DEV1-S 2Go insuffisante (OOM au démarrage NestJS).

**Conséquences** :
- API live sur `163.172.189.137` (IP statique).
- PM2 + Nginx reverse proxy.
- DB PostgreSQL 15 sur Scaleway Paris.
- S3 Scaleway (`eventy-uploads-prod.s3.fr-par.scw.cloud`) pour uploads.
- DNS : Cloudflare (NS `magali.ns.cloudflare.com` + `rocco.ns.cloudflare.com`).
- `api.eventylife.fr` → `163.172.189.137`.

**Statut** : ✅ Décidé · ✅ Live · ⏳ Finalisation DNS Cloudflare.

---

## 2026-03 — Frontend sur Vercel

**Décision** : frontend Next.js 14 déployé sur **Vercel**.

**Contexte** :
- Next.js est optimisé pour Vercel (ISR, image optimization, edge runtime).
- Coût faible (gratuit hobby puis pro).
- Alternative envisagée : Scaleway/Cloudflare Pages. Choix Vercel pour stabilité + DX.

**Conséquences** :
- Build automatique sur push `main`.
- 3 portails en un seul déploiement.
- Domaine `www.eventylife.fr` → Vercel via Cloudflare.
- CI/CD : 4 workflows GitHub Actions.

**Statut** : ✅ Décidé · ✅ Live.

---

## 2026-03 — Unité de base : le bus complet 53 places

**Décision** : l'unité économique de référence d'un voyage Eventy = un **bus de 53 places**.

**Contexte** :
- Les agences classiques opèrent avec des groupes 15-20 pers → prix unitaire élevé, marge moyenne.
- Le bus 53 complet divise le coût transport, permet des négociations hôtels (-15%) et restos (-20%) sur volume.
- CA moyen × 3,3 vs ancien modèle, marge brute × 3,6.

**Conséquences** :
- Schema Prisma, wizard création, UI, checkout = tous calibrés pour bus 53.
- Phase 2 : 2 bus + allotement avion (106 pax).
- Phase 3 : charter A320 complet (159 pax) = 3 bus.

**Statut** : ✅ Décidé · ✅ Implémenté.

---

## 2026-02 — Architecture 3 portails distincts

**Décision** : 3 portails frontaux **avec layouts, designs et composants distincts** — pas de réutilisation transverse.

| Portail | Route | Design | Police |
|---------|-------|--------|--------|
| Public | `/` | Sunset gradient | Fraunces + Inter |
| Voyageur | `/client` | Dark HUD | Space Grotesk |
| Créateur | `/pro` | Cream/terra chaleureux | Fraunces + Inter |
| Admin / Équipe / Maisons / Ambassadeur | `/admin`, `/equipe`, `/maisons`, `/ambassadeur` | Dark HUD variants | Space Grotesk |

**Contexte** :
- Chaque population a des besoins, une culture, une émotion différente.
- Voyageur veut l'émerveillement → dark immersif.
- Créateur veut chaleur artisanale → cream/terra.
- Équipe veut efficacité → dark HUD.
- Réutiliser les composants entre portails dilue l'émotion.

**Conséquences** :
- Composants UI répliqués avec adaptations par portail.
- CSS variables par portail (`--pro-sun`, `--pro-ocean`, etc.).
- Code CSS légèrement dupliqué → acceptable pour l'identité.

**Statut** : ✅ Décidé · ✅ Implémenté.

---

## 2026-02 — `isPremium` flag sur ProProfile

**Décision** : ajout d'un flag booléen `isPremium` sur le modèle `ProProfile` pour distinguer Créateurs Standard vs Premium.

**Contexte** :
- Certains Créateurs expérimentés méritent plus d'autonomie (auto-validation devis transport, accès avancés).
- Différencier dans le rôle `PRO` sans créer un nouveau rôle RBAC.

**Conséquences** :
- Créateurs Premium = auto-validation devis transport sans Pôle.
- Gating UI (boutons, pages avancées) selon `isPremium`.
- Upgrade Premium décidé par Pôle Talents.

**Statut** : ✅ Décidé · ✅ Implémenté.

---

## 2026-02 — Eventy = agence Atout France (pas place de marché)

**Décision** : Eventy est **juridiquement l'agence** responsable des voyages — pas une place de marché qui met en relation.

**Contexte** :
- Place de marché (Airbnb-like) = pas de responsabilité sur le voyage → expérience Voyageur dégradée, pas de marge.
- Agence Atout France = Eventy garantit les voyages, touche la marge, assume les risques.
- Les Créateurs facturent Eventy (en tant que sous-traitants / partenaires), Eventy facture le Voyageur.

**Conséquences** :
- Immatriculation Atout France nécessaire.
- Garantie financière APST (prix en fonction du CA).
- RC Pro.
- Régime TVA marge (spécifique agences).
- Dossier juridique complet (voir `pdg-eventy/01-legal/`).

**Statut** : ✅ Décidé · 🟡 Immatriculation en cours.

---

## 2026-02 — Stripe Connect (Express) pour payouts

**Décision** : utiliser **Stripe Connect Express** pour payouts automatiques (Créateurs, Ambassadeurs, Maisons).

**Contexte** :
- Virements manuels mensuels = trop de friction admin + erreurs.
- Stripe Connect Express = onboarding simple pour les bénéficiaires, payouts automatiques.
- 18 webhooks Stripe implémentés (payment, refund, dispute, payout, review, Connect, 3DS).

**Conséquences** :
- Chaque Créateur a un compte Stripe Connect lié.
- Cotisations indé (URSSAF) automatisées.
- Commission Ambassadeur (5% cookie last-click-wins) payée automatiquement.
- **Câblage final en cours** (avril 2026).

**Statut** : 🟡 En cours — webhooks OK, payouts à finaliser.

---

## 2026-02 — Promesse principale normalisée

**Décision** : la promesse Eventy est **normalisée** en un message unique :

> *« 0 stress. Il clique, il voyage. Dynamique et libre. »*

Complétée par la promesse longue :

> *« Eventy Life : le voyage de groupe où tu n'as rien à gérer, tout à vivre. »*

**Contexte** : avant, plusieurs variantes circulaient (« groupe serein », « tout inclus », etc.). Incohérent. Le PDG a tranché pour une formule courte et virale.

**Conséquences** :
- Apparaît en header, footer, fiches voyage, réseaux sociaux.
- Formation Créateurs pour apprendre cette phrase.
- Ambassadeurs formés à la formule.

**Statut** : ✅ Décidé · 🟡 Déploiement UI en cours.

---

## 2026-02 — Feature flags + break-glass + 4-eyes approval

**Décision** : toutes les features risquées sont derrière des **feature flags** avec workflow break-glass + 4-eyes.

**Contexte** :
- Risque : une feature partiellement testée bugue en prod → impact Voyageurs.
- Solution : feature flag + rollback instantané + approbation 2 personnes pour les flags critiques.

**Conséquences** :
- Système `FeatureFlagsService` backend.
- Admin UI `/admin/feature-flags/` : toggles, presets, audit log.
- 23+ feature flags pour le système de groupes (voir [`groupes-admin-controls.md`](./groupes-admin-controls.md)).
- Lancement avec preset "MVP" (groupes Amis + Famille, paiements individuels + groupés, invitations lien + QR + WhatsApp + Email + Réseaux).

**Statut** : ✅ Décidé · ✅ Implémenté.

---

## 2025-Q4 — Monorepo avec submodules Git

**Décision** : code organisé en monorepo racine avec `backend/` et `frontend/` en **submodules Git**.

**Contexte** :
- Besoin de déploiements indépendants backend vs frontend.
- Historique Git lisible par projet.
- Collaboration : équipes distinctes peuvent travailler sur backend ou frontend.

**Conséquences** :
- `backend/` → `eventylife-hub/eventy-backend.git`
- `frontend/` → `eventylife-hub/eventy-frontend.git`
- Root repo contient : docs, pdg-eventy, Makefile, CI/CD, scripts deploy.
- Workflow : faire les commits dans les submodules + `git submodule update` au root.

**Statut** : ✅ Adopté · ✅ Actif.

---

## Template pour nouvelle décision

```markdown
## AAAA-MM — Titre court

**Décision** : <la décision en une phrase>

**Contexte** : <pourquoi, quel problème, quelles alternatives>

**Conséquences** :
- <liste des impacts concrets>

**Statut** : ✅ Décidé · 🟡 En cours · ⏳ À implémenter · ❌ Abandonné
```

---

*Document maintenu par l'IA PDG + David. Toute nouvelle décision structurante doit être ajoutée ici avec la date.*
