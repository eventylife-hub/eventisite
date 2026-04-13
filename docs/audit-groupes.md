# Audit Système de Groupes — Eventy Life

> Date : 2026-04-13 · Auteur : IA PDG · Statut : Complet

---

## Résumé exécutif

Le système de groupes Eventy est **fonctionnel à ~70%**. L'ossature backend est solide (17 endpoints, guards, transactions). Le frontend couvre les 3 portails (client, pro, admin) avec mock data réaliste. Les lacunes principales : pas de `groupType` dans le modèle Prisma, pas de page admin settings pour feature flags granulaires, pas de personnalisation groupe premium, et pas d'intégration virale avancée.

---

## 1. Backend (NestJS)

### Modèles Prisma existants
| Modèle | Champs clés | Statut |
|--------|-------------|--------|
| `TravelGroup` | id, code (@unique, 8-char hex), travelId, leaderUserId, shareToken, status, maxRooms, holdExpiresAt | ✅ Complet |
| `TravelGroupMember` | id, groupId, userId, role (LEADER/MEMBER/ASSOCIATION), roomBookingId | ✅ Complet |
| `TravelGroupInvite` | id, groupId, sentToEmail, tokenHash, status, expiresAt | ✅ Complet |
| `GroupMessage` | id, groupId, senderUserId, senderRole, messageType, content (max 2000) | ✅ Complet |
| `BookingGroup` | id, travelId, travelGroupId (nullable FK), totalAmountTTC | ✅ Complet |

### Champs ABSENTS des modèles (à ajouter côté frontend via types)
- `groupType` (amis/famille/collegues/evenement/voyage)
- `paymentMode` (individual/group/mixed/pot)
- `isPrivate` (boolean)
- `themeColor`, `coverImage`, `description` (personnalisation)
- `invitedBy` (arbre de parrainage)

### Endpoints API (17 routes)
- CRUD groupe : create, close, stats
- Membres : join, leave, promote, kick
- Invitations : invite (email), accept, decline, join-by-code
- Messages : send, get (cursor pagination)
- CE/Asso : liste dédiée avec réduction 15%

### Sécurité
- ✅ UUID validation sur tous les params
- ✅ Transactions TOCTOU
- ✅ Rate limiting
- ✅ Guards : GroupMemberGuard, GroupLeaderGuard
- ✅ Pagination cappée (200 groupes, 100 messages)

---

## 2. Frontend — Portail Client

| Page | Lignes | Statut | Design |
|------|--------|--------|--------|
| `/client/groupes` (liste) | ~340 | ✅ | HUD dark, filtre par type, dual progress bars |
| `/client/groupes/[id]` (détail) | ~400+ | ✅ | Tabs chat/membres/voyage/sondages, milestones |
| `/client/groupes/creer` | ~500 | ✅ | 3 étapes, deep-link, recherche voyage |
| `/client/groupes/[id]/inviter` | ~300+ | ✅ | 4 tabs : amis/email/code-lien/QR |
| `/client/groupes/rejoindre` | ~200+ | ✅ | Saisie code, preview groupe |
| `/client/groupes/[id]/edit` | Existe | ⚠️ Non audité en détail |

### Composants dédiés (10)
- `GroupCard`, `GroupPollWidget`, `FillMilestoneOverlay`, `QuickGroupModal`
- `MultiTravelSelector`, `SoloMatchWidget`, `SuggestGroupAfterFav`
- `ShareCardVisual`, `invite-form`, `member-list`

---

## 3. Frontend — Portail Pro

| Page | Statut |
|------|--------|
| `/pro/groupes` (liste) | ✅ Filtre statut, recherche, KPIs |
| `/pro/groupes/creer` | ✅ |
| `/pro/groupes/[id]` | ✅ |

---

## 4. Frontend — Portail Admin

| Page | Statut |
|------|--------|
| `/admin/groupes` (DataTable) | ✅ 6 KPIs, modération, export CSV |
| `/admin/groupes/analytics` | ✅ Analytics viral |
| `/admin/groupes/settings` | ❌ **MANQUANT** — feature flags groupes |

### Feature Flags System
- ✅ Backend : `FeatureFlagsService` avec rollout hash, break-glass, audit log
- ✅ Admin UI : `/admin/feature-flags/` — toggles, presets, 4-eyes approval
- ❌ Pas de flags spécifiques aux groupes créés

---

## 5. Navigation
- ✅ Sidebar client : "Mes groupes" dans section Social
- ✅ Sidebar admin : "Groupes viraux" + "Analytics viral" dans section Voyages
- ✅ Mega-nav admin : "Groupes viraux" dans Opérations

---

## 6. Ce qui MANQUE (à construire)

### Priorité 1 — Feature Flags Admin Groupes
- [ ] Page `/admin/groupes/settings/` avec 18+ toggles granulaires
- [ ] Flags par type de groupe, par canal d'invitation, par mode de paiement
- [ ] Paramètres numériques (délai hold, taille max override)
- [ ] Audit log des changements de flags

### Priorité 2 — Enrichissement Modèle Groupe
- [ ] Types partagés avec constantes feature flags
- [ ] Personnalisation groupe (thème, couleur, cover, description)
- [ ] Modes de paiement configurables
- [ ] Arbre viral (qui a invité qui)

### Priorité 3 — UX Premium
- [ ] Design "Series A" sur la création de groupe (storytelling, animations)
- [ ] Dashboard groupe enrichi (timeline, rooming, cagnotte)
- [ ] Intégration fiche voyage (CTA "Créer un groupe")
- [ ] Prix dégressifs groupe

### Priorité 4 — Documentation
- [ ] `docs/groupes-admin-controls.md` — guide David pour chaque flag

---

## 7. Recommandation

Construire par blocs atomiques :
1. Types/constantes partagés → 2. Admin settings page → 3. Enrichissement UI → 4. Intégrations → 5. Documentation

Tout derrière feature flags. Ne rien casser de l'existant.
