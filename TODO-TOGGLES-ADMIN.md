# TODO — Système de TOGGLES Admin (ON/OFF de toutes les fonctionnalités)

> **Date** : 2026-04-26
> **Auteur** : Claude (assistant PDG IA)
> **Statut** : Vision validée par David — audit terminé, roadmap prête à exécuter
> **Ame Eventy** : *« Le jour de la création, on doit pouvoir lancer Eventy avec ou sans certaines fonctionnalités. Chaque option = un toggle ON/OFF dans l'admin. Pas de surprise, zéro friction. »*

---

## 🌟 Vision PDG (David)

Le **jour J de la création de la SAS Eventy**, le PDG doit pouvoir, depuis l'admin, **activer ou désactiver chaque fonctionnalité** sans toucher à une ligne de code, sans redéploiement, sans dépendance technique.

**Pourquoi ?**

1. **Lancement progressif** — On démarre minimaliste (réservation + paiement + bus). On allume Gaming/Sponsors/Guildes plus tard, quand le métier est rodé.
2. **Risque maîtrisé** — Si une fonctionnalité bug en prod (gaming, partage social, marketplace), un OFF immédiat protège l'expérience client.
3. **A/B testing & rollout progressif** — Activer une feature pour 25 % des utilisateurs avant de basculer à 100 %.
4. **Conformité juridique** — Désactiver instantanément une feature non-conforme (RGPD, Atout France, fiscalité) en attendant la mise en règle.
5. **Mode démo / mode prod** — Le portail démo peut tout afficher, le portail prod peut masquer les modules pas encore lancés.

### 💎 La règle d'or

> **Quand un toggle est OFF : la fonctionnalité disparaît proprement de l'UI. Pas d'erreur, pas de bouton mort, pas de page 404 — juste masquée comme si elle n'existait pas.**

---

## 📊 Audit de l'existant (2026-04-26)

### ✅ Ce qui existe déjà

| Page admin | Chemin | Statut |
|---|---|---|
| Page Paramètres (settings + flags basiques) | `/admin/parametres` | ✅ Fonctionnelle (3 settings, 3 flags démo) |
| Page Feature Flags (avancée, 26 flags) | `/admin/feature-flags` | ✅ Fonctionnelle (filtres, audit, break-glass) |
| Audit trail des flags | `/admin/feature-flags/audit` | ✅ Page existe |

### 📋 Flags déjà présents dans `/admin/feature-flags` (26)

| Catégorie | Flag key | Label | État | Couvre |
|---|---|---|---|---|
| Checkout | `checkout_enabled` | Checkout actif | ✅ ON | Réservation + paiement |
| Checkout | `new_booking_flow_rollout` | Nouveau flow réservation | ✅ ON 25% | Rollout progressif |
| Paiement | `split_pay_enabled` | Paiement fractionné | ✅ ON | Split groupes |
| Paiement | `stripe_live_enabled` | Stripe LIVE | ❌ OFF | Bascule LIVE/sandbox |
| Paiement | `cotisation_avocat_enabled` | Cotisation avocat 1€ | ✅ ON | Fonds juridique |
| Sécurité | `two_factor_auth` | 2FA Pro/Admin | ✅ ON | Sécurité comptes |
| Sécurité | `impersonate_enabled` | Impersonate admin | ✅ ON | Support |
| Marketing | `marketing_campaigns` | Campagnes marketing | ✅ ON | Création campagnes |
| Marketing | `recharge_cards_enabled` | Cartes rechargeables | ❌ OFF | Cartes cadeau |
| Client | `reviews_enabled` | Avis clients | ✅ ON | Notation voyages |
| Transport | `qr_code_checkin` | Check-in QR Code | ❌ OFF | Embarquement bus |
| Transport | `bus_stops_visibility` | Arrêts de bus visibles | ✅ ON | Affichage public |
| Transport | `devis_combine_enabled` | Devis combiné transport | ✅ ON | Multi-transporteurs |
| Gamification | `gamification_enabled` | Gamification (MASTER) | ❌ OFF | Master switch |
| Gamification | `rays_enabled` | Système RAYS | ❌ OFF | Monnaie gamifiée |
| Gamification | `cookies_enabled` | Cookies (viralité) | ❌ OFF | Récompense partage |
| Gamification | `badges_enabled` | Badges | ❌ OFF | Collection client |
| Gamification | `xp_points_enabled` | Points XP | ❌ OFF | Niveaux |
| Gamification | `social_feed_enabled` | Fil social | ❌ OFF | Posts amis / stories |
| Système | `maintenance_mode` | Mode maintenance | ❌ OFF | Page maintenance |
| B2B | `marketplace_events_enabled` | Marketplace événements B2B | ❌ OFF | CE / corpo |
| B2B | `maison_events_enabled` | Événements Maisons | ✅ ON | Maisons partenaires |
| B2B | `createur_events_enabled` | Événements Créateurs | ❌ OFF | Influenceurs |
| Portails | `portail_pro_enabled` | Portail Pro | ✅ ON | Agences partenaires |
| Portails | `portail_ambassadeur_enabled` | Portail Ambassadeur | ✅ ON | Réseau ambassadeurs |
| Portails | `portail_independant_enabled` | Portail Indépendant | ❌ OFF | Chauffeurs / guides |

---

## 🚨 Toggles MANQUANTS à créer (priorité PDG)

### 🎮 Gaming & Social (sous-flags du master `gamification_enabled`)

| # | Flag key (à créer) | Label | Catégorie | Priorité | Notes |
|---|---|---|---|---|---|
| 1 | `gaming_raids_enabled` | Raids & boss collectifs | Gaming | P1 | Nouveau — non couvert |
| 2 | `gaming_boss_enabled` | Boss épisodiques | Gaming | P1 | Nouveau — non couvert |
| 3 | `gaming_guilds_enabled` | Guildes / clans | Gaming | P1 | Nouveau — non couvert |
| 4 | `gaming_energy_enabled` | Énergie gaming (charge / cooldown) | Gaming | P1 | Lié module `energie` |
| 5 | `gaming_sponsors_enabled` | Sponsors Gaming (héros sponsorisés) | Gaming | P1 | Module `TODO-GAMING-SPONSORS-HEROS.md` |
| 6 | `gaming_worlds_enabled` | Mondes Gaming (territoires) | Gaming | P2 | Module `TODO-GAMING-MONDES.md` |
| 7 | `wallet_enabled` | Wallet / portefeuille client | Client | P0 | Nouveau — argent réel + RAYS |
| 8 | `social_share_enabled` | Partage social (réseaux sociaux) | Client | P0 | Distinct de `cookies_enabled` (récompense) |

### 🎯 Activités, Forfaits, Cartes

| # | Flag key (à créer) | Label | Catégorie | Priorité | Notes |
|---|---|---|---|---|---|
| 9 | `activities_options_enabled` | Activités optionnelles voyage | Voyages | P0 | Lié `TODO-ACTIVITES-CREATEUR.md` (82/18) |
| 10 | `forfaits_subscriptions_enabled` | Forfaits / abonnements | Marketing | P1 | Lié `TODO-TARIFS-FORFAITS.md` |
| 11 | `scratch_cards_enabled` | Cartes à gratter | Gaming | P2 | Lié `frontend/TODO-CARTES-GRATTER.md` |

### 🔗 Codes, QR, Communication

| # | Flag key (à créer) | Label | Catégorie | Priorité | Notes |
|---|---|---|---|---|---|
| 12 | `creator_qr_codes_enabled` | Codes QR Créateurs (parrainage) | Marketing | P1 | Lié `TODO-CODES-CREATEURS.md` |
| 13 | `chat_messaging_enabled` | Chat / messagerie interne | Client | P1 | Module `messagerie` existe |
| 14 | `voyage_social_mode_enabled` | Mode voyage social (groupe public) | Client | P2 | Voyageurs partagent en direct |

### 🛒 Marketplace & Futur

| # | Flag key (à créer) | Label | Catégorie | Priorité | Notes |
|---|---|---|---|---|---|
| 15 | `onsite_marketplace_enabled` | Marketplace sur place (futur) | B2B | P3 | Achat sur place pendant voyage |

---

## 🧱 Architecture cible

### Modèle de données (extension Prisma — backend)

```prisma
model FeatureFlag {
  id            String   @id @default(cuid())
  key           String   @unique
  label         String
  description   String?
  category      String   // Gaming, Wallet, Marketing, ...
  enabled       Boolean  @default(false)
  rollout       Int      @default(100) // 0–100 % des users
  isBreakGlass  Boolean  @default(false) // Confirmation requise
  isMaster      Boolean  @default(false) // Désactive les sous-flags
  parentKey     String?  // Sous-flag d'un master
  activatedAt   DateTime?
  updatedAt     DateTime @updatedAt
  updatedBy     String   // userId admin qui a basculé
  audit         FeatureFlagAudit[]
}

model FeatureFlagAudit {
  id        String   @id @default(cuid())
  flagId    String
  flag      FeatureFlag @relation(fields: [flagId], references: [id])
  action    String   // "ENABLED" | "DISABLED" | "ROLLOUT_CHANGED"
  oldValue  String?
  newValue  String?
  changedBy String   // userId
  changedAt DateTime @default(now())
  reason    String?  // Raison admin (optionnel)
}
```

### API backend (NestJS — module `admin`)

| Endpoint | Méthode | Rôle | Description |
|---|---|---|---|
| `/admin/feature-flags` | GET | Admin | Liste tous les flags + état |
| `/admin/feature-flags/:key` | GET | Admin | Détail d'un flag + audit |
| `/admin/feature-flags/:key` | PATCH | Admin | Modifie `enabled` + `rollout` (audit auto) |
| `/admin/feature-flags/:key/audit` | GET | Admin | Historique des changements |
| `/feature-flags/public` | GET | Public | Flags publics (pour frontend client) |

### Helper frontend (`useFeatureFlag`)

```ts
// hooks/use-feature-flag.ts
import { useFlagsContext } from '@/contexts/flags-context';

export function useFeatureFlag(key: string): boolean {
  const flags = useFlagsContext();
  return flags[key]?.enabled === true;
}

// Usage
const showGaming = useFeatureFlag('gamification_enabled');
if (!showGaming) return null;
```

### Composant `<FeatureGate>`

```tsx
<FeatureGate flag="gaming_raids_enabled">
  <RaidsBoardPanel />
</FeatureGate>
```

---

## 📋 Catégorisation des toggles dans l'UI admin

L'écran `/admin/parametres` expose un panneau **« Toggles fonctionnels »** organisé par catégorie :

### 🎮 Gaming
- gamification_enabled (MASTER)
- gaming_raids_enabled
- gaming_boss_enabled
- gaming_guilds_enabled
- gaming_energy_enabled
- gaming_sponsors_enabled
- gaming_worlds_enabled
- rays_enabled
- cookies_enabled
- badges_enabled
- xp_points_enabled
- social_feed_enabled
- scratch_cards_enabled

### 💰 Wallet & Paiement
- wallet_enabled
- split_pay_enabled
- stripe_live_enabled
- cotisation_avocat_enabled

### 📲 Social & Communication
- social_share_enabled
- chat_messaging_enabled
- voyage_social_mode_enabled
- creator_qr_codes_enabled

### 🎁 Marketing & Fidélisation
- marketing_campaigns
- recharge_cards_enabled
- forfaits_subscriptions_enabled

### 🚌 Voyages & Transport
- activities_options_enabled
- bus_stops_visibility
- qr_code_checkin
- devis_combine_enabled

### 🏪 Marketplace & B2B
- marketplace_events_enabled
- maison_events_enabled
- createur_events_enabled
- onsite_marketplace_enabled

### 🛡 Système & Sécurité
- maintenance_mode (BREAK GLASS)
- two_factor_auth
- impersonate_enabled

### 🌐 Portails
- portail_pro_enabled
- portail_ambassadeur_enabled
- portail_independant_enabled

### 🛒 Checkout & Réservation
- checkout_enabled
- new_booking_flow_rollout
- reviews_enabled

---

## 🎯 Roadmap de mise en œuvre

### Phase 1 — Foundation (J0 → J+7)
- [ ] **Backend** — Migrer modèle `FeatureFlag` + `FeatureFlagAudit` dans Prisma
- [ ] **Backend** — Endpoint `/admin/feature-flags` PATCH avec audit auto
- [ ] **Backend** — Endpoint `/feature-flags/public` (lecture seule, no auth)
- [ ] **Frontend** — Hook `useFeatureFlag(key)` + `FlagsContext`
- [ ] **Frontend** — Composant `<FeatureGate flag="...">`
- [ ] **Seed** — Insérer les 26 flags actuels + 15 nouveaux flags listés ci-dessus

### Phase 2 — UI admin enrichie (J+7 → J+14)
- [ ] **Page `/admin/parametres`** — Ajouter panneau « Toggles fonctionnels » avec catégories
- [ ] **Page `/admin/feature-flags`** — Ajouter les 15 flags manquants
- [ ] **Page `/admin/feature-flags/[key]`** — Détail + audit + rollout slider 0-100 %
- [ ] **Recherche** — Barre de recherche cross-categories
- [ ] **Filtres** — État (ON/OFF), catégorie, rollout < 100 %
- [ ] **Indicateurs visuels** — Badges « Master », « Break-glass », « Sous-flag de XYZ »

### Phase 3 — Intégration dans toutes les pages (J+14 → J+30)
- [ ] **Gaming** — Wrapper `<FeatureGate flag="gamification_enabled">` autour de toutes les pages `/jeux/*`, `/admin/gamification/*`, etc.
- [ ] **Wallet** — Masquer `/client/wallet` si `wallet_enabled === false`
- [ ] **Social** — Masquer boutons partage si `social_share_enabled === false`
- [ ] **Activités options** — Masquer onglet « Activités optionnelles » dans création voyage
- [ ] **Forfaits** — Masquer page `/pro/forfaits` + bandeau client
- [ ] **Cartes à gratter** — Masquer onglet `/jeux/cartes-gratter`
- [ ] **QR Créateurs** — Masquer génération QR dans `/createur/codes`
- [ ] **Chat** — Masquer icône messagerie navbar + page `/admin/messagerie`
- [ ] **Mode voyage social** — Masquer feed temps réel pendant voyage
- [ ] **Marketplace sur place** — Masquer onglet « Marketplace » pendant voyage (futur)

### Phase 4 — Audit & sécurité (J+30 → J+45)
- [ ] **Audit trail UI** — Améliorer `/admin/feature-flags/audit` avec filtres
- [ ] **Notification Slack** — Ping admins quand un break-glass flag est basculé
- [ ] **Rate limit** — Max 10 toggles / heure pour éviter les changements à la chaîne
- [ ] **Permissions RBAC** — Seul `SUPER_ADMIN` peut toggle break-glass
- [ ] **Cache distribué** — Redis cache 30s pour flags publics (perf)

### Phase 5 — Avancé (J+45 → J+60)
- [ ] **Rollout progressif** — Slider 0-100 % par flag (hash userId pour stabilité)
- [ ] **Targeting par segment** — Activer un flag uniquement pour un segment (ex. « clients premium »)
- [ ] **Schedule on/off** — Programmer un flag à activer le 2026-06-15 à 09:00
- [ ] **Webhook out** — Notifier un système externe quand un flag change
- [ ] **Export config** — Bouton « Export YAML » de la config flags pour backup

---

## 🛡 Règles de sécurité & gouvernance

1. **Tout toggle est auditable** — `updatedBy`, `updatedAt`, raison optionnelle.
2. **Break-glass = confirmation explicite** — `maintenance_mode`, `stripe_live_enabled`.
3. **Master kill-switch hiérarchique** — Désactiver `gamification_enabled` masque tous les sous-flags Gaming, sans toucher à leur état stocké.
4. **Pas de cache long** — TTL maximum 60 secondes pour propagation rapide.
5. **Logs immuables** — Audit trail dans table append-only, jamais de DELETE.
6. **Règle PDG** — Aucun flag ne doit *bloquer* une réservation ou un paiement en cours. Si un flag passe OFF, on termine la session client puis on bloque les nouvelles.

---

## 💎 L'avantage stratégique Eventy

> **Pourquoi un système de toggles complet est un atout PDG :**

| Avantage | Impact business |
|---|---|
| **Lancer minimaliste** | MVP en 2 semaines : checkout + bus + Atout France, le reste OFF |
| **Tester en interne** | Activer Gaming pour 1 % d'utilisateurs (employés) avant ouverture |
| **Réagir à un bug** | OFF en 5 secondes, pas de hotfix nuit, pas de stress équipe |
| **Argumenter face APST/Atout France** | « Voyez : si vous trouvez non-conforme, je désactive en 1 clic » |
| **Démo investisseurs** | Activer toutes les features pour pitch, désactiver pour démo client réelle |
| **Économie tech** | Pas besoin de redéployer pour activer/désactiver une feature |

---

## 📝 Liens connexes

- **Page admin existante** : `/admin/parametres` (à enrichir)
- **Page admin avancée** : `/admin/feature-flags` (à compléter avec 15 flags)
- **TODO Gaming** : `TODO-GAMING-RAIDS-BOSS.md`, `TODO-GAMING-SPONSORS-HEROS.md`, `TODO-GAMING-MONDES.md`, `TODO-GAMING-SOCIAL.md`, `TODO-GAMING-FIDÉLISATION.md`
- **TODO Cartes** : `frontend/TODO-CARTES-GRATTER.md`
- **TODO Codes Créateurs** : `TODO-CODES-CREATEURS.md`
- **TODO Activités** : `TODO-ACTIVITES-CREATEUR.md`
- **TODO Forfaits** : `TODO-TARIFS-FORFAITS.md`
- **TODO Énergie** : `TODO-ENERGIE-SYSTEME.md`

---

## ✅ Prochaines actions immédiates

1. **Aujourd'hui** — Améliorer `/admin/parametres` pour exposer les 15 nouveaux toggles (UI catégorisée, lien vers `/admin/feature-flags` pour management avancé)
2. **Cette semaine** — Backend : ajouter les 15 nouveaux flags en seed
3. **J+7** — Frontend : créer `<FeatureGate>` + `useFeatureFlag` + brancher les 5 modules les plus critiques (Gaming master, Wallet, Social, Activités, Chat)
4. **J+14** — Brancher tous les modules restants (10 toggles)
5. **J+30** — Audit trail enrichi + permissions RBAC

---

> **Âme Eventy** : *« Un PDG doit pouvoir piloter son produit comme un capitaine pilote son bateau — chaque levier doit répondre instantanément, sans avoir à descendre en salle des machines. Les toggles, c'est ça : la barre du capitaine. »*
