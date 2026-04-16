# Audit Groupes & Réseau Social — Côté Voyageur

> Date : 2026-04-16 · Auteur : IA PDG (David)
> Demande : « Tout ce qu'on a fait côté groupe et réseau social pour les clients, je vois rien. Audit et répare. »

---

## TL;DR

Côté Voyageur (`/client/*`), **tout est construit ou presque**. Le ressenti « je vois rien »
venait de **deux causes invisibles** :

1. Le hook `useFeatureFlags()` n'exposait que 2 flags (`cookies_enabled`, `rays_enabled`)
   alors que le code référence ~25 flags (social_feed, gamification_groups, tous les
   `groups_*`, `invite_*`, `payment_mode_*`, `group_*`). Tout retombait sur `undefined`,
   donc **toutes les sections derrière feature flag étaient muettes en démo**.
2. La page `/client/tribus` (Tribus permanentes — concept-clé Eventy : l'équipe qui se
   retrouve à chaque voyage) **n'existait pas** alors que le contrat AME-EVENTY l'évoque.

Ces deux trous ont été refermés. Le sidebar pointe maintenant aussi vers Tribus, et
l'écran social affiche désormais ses widgets en mode démo.

---

## 1. Inventaire — ce qui existe côté Voyageur

| Page                                  | Statut    | Accessible nav    | Fonctionne | Notes |
| ------------------------------------- | --------- | ----------------- | ---------- | ----- |
| `/client` (dashboard)                 | ✅ Existe | Oui (logo)        | Oui        | Affiche déjà bandeau « Mes groupes » + alertes invitations |
| `/client/groupes` (liste)             | ✅ Existe | Sidebar Social    | Oui        | HUD dark, filtre par type, dual progress bars, fallback démo OK |
| `/client/groupes/creer`               | ✅ Existe | Bouton + URL      | Oui        | Wizard 3 étapes, pré-remplissage `?travelId=&travelTitle=&groupType=` |
| `/client/groupes/rejoindre`           | ✅ Existe | Bouton liste      | Oui        | Saisie code + preview groupe |
| `/client/groupes/[id]`                | ✅ Existe | Liste / nav       | Oui        | Tabs chat / membres / voyage / sondages |
| `/client/groupes/[id]/edit`           | ✅ Existe | Détail            | Oui        | Édition propriétaire |
| `/client/groupes/[id]/inviter`        | ✅ Existe | Détail            | Oui        | 4 onglets : amis / email / code-lien / QR |
| `/client/social` (hub social)         | ✅ Existe | Sidebar Social    | Oui (réparé) | Affiche maintenant gamification + fil teaser car flags définis |
| `/client/amis`                        | ✅ Existe | Sidebar Social    | Oui        | Liste, recherche, invitations envoyées/reçues |
| `/client/messagerie`                  | ✅ Existe | Sidebar Social    | Oui        | Threads voyages + groupes |
| `/client/notifications`               | ✅ Existe | Sidebar Compte    | Oui        | Liste notifs + préférences |
| `/client/notifications/preferences`   | ✅ Existe | Lien interne      | Oui        | Granulaire par canal |
| `/client/voyage/[id]/chat`            | ✅ Existe | Détail réservation | Oui      | Chat embarqué dans la fiche voyage Voyageur |
| `/client/challenges`                  | ✅ Existe | Sidebar (gam)     | Oui        | Gamification — défis collectifs |
| `/client/classement`                  | ✅ Existe | Sidebar (gam)     | Oui        | Classement entre amis |
| `/client/hauts-faits`                 | ✅ Existe | Sidebar Social    | Oui        | Trophées / badges |
| `/client/cookies-fidelite`            | ✅ Existe | Sidebar Social    | Oui        | Programme fidélité Cookies 🍪 |
| `/client/rays`                        | ✅ Existe | Sidebar Finance   | Oui        | Monnaie Eventy ☀️ |
| **`/client/tribus`** (liste)          | 🆕 Créé   | **Sidebar Social** | Oui (démo)| **Tribus permanentes** — créé par cet audit |
| **`/client/tribus/[id]`** (détail)    | 🆕 Créé   | Liste / FAB       | Oui (démo)| **Détail Tribu** : membres, voyages passés, prochain |

### Composants groupe utilisés

`QuickGroupModal` (création express depuis fiche voyage publique), `GroupCard`,
`GroupPollWidget`, `FillMilestoneOverlay`, `MultiTravelSelector`, `SoloMatchWidget`,
`SuggestGroupAfterFav`, `ShareCardVisual`, `invite-form`, `member-list`. Tous en place.

### Wiring transverse

- **Fiche voyage publique** `/voyages/[slug]` → bouton « Créer un groupe pour ce voyage »
  ouvre `QuickGroupModal`, qui POST `/groups` ou retombe sur
  `/client/groupes/creer?travelId=…&travelTitle=…&groupType=voyage` ✅
- **Fiche voyage Voyageur** `/client/voyage/[id]` → CTA « Créer un groupe » →
  `/client/groupes/creer?travelId=…&travelTitle=…` ✅
- **Sidebar client** : section **Social** = Réseau social, Mes groupes, **Mes Tribus
  (nouveau)**, Mes amis, Messagerie, Favoris, Cookies, Hauts Faits, Classement
- **FAB mobile** : Créer un groupe, **Mes Tribus (nouveau)**, Explorer voyages, Mes amis,
  Mes favoris

---

## 2. Causes du « je vois rien »

### 2.1 Hook `useFeatureFlags` incomplet

**Avant** : seuls `cookies_enabled` et `rays_enabled` étaient connus du hook. Tout
appel à `flags.social_feed_enabled`, `flags.gamification_groups_enabled`,
`flags.tribus_enabled`, `flags.group_chat_enabled`, etc. retournait `undefined` →
falsy → **bloc invisible**.

**Après** : le hook expose les **27 flags** réellement utilisés (alignés sur
`lib/groups/constants.ts`) et applique un **preset démo Voyageur** où le MVP est ON
par défaut :

| Famille        | ON par défaut                                                                | OFF par défaut                                |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| Gamification   | `cookies_enabled`, `rays_enabled`, `gamification_groups_enabled`             | —                                             |
| Social         | `social_feed_enabled`, `tribus_enabled`, `community_explore_enabled`         | —                                             |
| Types groupes  | `friends`, `family`                                                          | `ce`, `event`                                 |
| Invitations    | `link`, `qr`, `whatsapp`, `email`, `social`                                  | `sms` (coût Twilio)                           |
| Paiement       | `individual`, `group`, `mixed`, `installment`                                | `pot` (juridique fonds tiers)                 |
| Fonctionnalités| `group_chat`, `group_personalization`, `group_rooming`, `viral_tree`, `post_voyage` | `groups_public`, `degressive_pricing` |
| Modération     | —                                                                            | `auto_suspend_on_reports`                     |

David peut basculer chaque flag depuis le panel admin existant
(`/admin/feature-flags` + `/admin/groupes/settings` documenté dans
`docs/groupes-admin-controls.md`). Le `localStorage` éventuellement déjà set
par l'admin **prime** sur ces defaults — comportement inchangé.

### 2.2 Page Tribus inexistante

`AME-EVENTY.md` parle de communautés qui se retrouvent voyage après voyage. Le système
de Groupes (un Groupe = un voyage, fermé à la fin) ne couvrait pas ce besoin. **Création
de `/client/tribus/` et `/client/tribus/[id]/`** :

- Liste : pitch « C'est quoi une Tribu ? » + cards par Tribu (membres empilés, dernier
  voyage, prochain), bouton « Créer une Tribu »
- Détail : hero (emoji + thème), actions « Proposer un voyage à la Tribu » et
  « Messagerie Tribu », prochain voyage, brainstorm, membres, historique voyages
- Fallback démo riche : 3 Tribus (Aventuriers du Soleil, Famille Dupont, Team Bureau)
- **Derrière `tribus_enabled`** — si OFF, page de teaser propre au lieu d'une 404
- API ciblée : `/client/tribus`, `/client/tribus/:id` (à implémenter backend)

---

## 3. Modifications appliquées

| Fichier                                                              | Action  | Description |
| -------------------------------------------------------------------- | ------- | ----------- |
| `frontend/lib/hooks/use-feature-flags.ts`                            | Étendu  | 2 flags → 27 flags + preset démo Voyageur |
| `frontend/app/(client)/client/tribus/page.tsx`                       | Créé    | Liste Tribus avec démo riche, gating `tribus_enabled` |
| `frontend/app/(client)/client/tribus/[id]/page.tsx`                  | Créé    | Détail Tribu : membres, voyages, prochain, brainstorm |
| `frontend/app/(client)/client/layout.tsx`                            | Modifié | Sidebar Social : ajout entrée « Mes Tribus » entre Groupes et Amis ; FAB mobile : ajout raccourci Tribus |
| `docs/audit-groupes-social-client-2026-04.md`                        | Créé    | Ce document |

Aucun fichier supprimé. Aucun composant cassé. Design conforme au système HUD dark
existant du portail Voyageur (accent `#ff906a` = chaleur Eventy).

---

## 4. Ce qui reste hors scope (à faire ensuite)

- **Backend Tribus** : créer modèle Prisma `Tribu` + `TribuMember` + endpoints
  `/client/tribus` (CRUD). En attendant, l'UI tombe sur le démo.
- **Page `/client/tribus/nouvelle`** : wizard de création de Tribu (3 étapes : nom +
  emoji + couleur, inviter des membres, premier voyage). Pour l'instant, le bouton
  pointe vers la même URL → 404 propre via `not-found.tsx` racine. À construire dans
  un sprint dédié.
- **Brancher `useFeatureFlags` sur l'API `/feature-flags/effective`** côté serveur
  (au lieu du localStorage) pour que David puisse réellement piloter en prod sans
  toucher au navigateur de chaque utilisateur. Sprint séparé — voir
  `docs/groupes-admin-controls.md`.
- **Page `/client/communaute`** (groupes publics) : derrière `groups_public_enabled`
  qui reste OFF par défaut. À ouvrir quand la modération est prête.

---

## 5. Tableau récapitulatif demandé

| Page Voyageur          | Existe | Accessible | Fonctionne | Statut         |
| ---------------------- | :----: | :--------: | :--------: | -------------- |
| `/client/groupes/`     | ✅     | ✅          | ✅         | OK (existant)  |
| `/client/groupes/[id]/`| ✅     | ✅          | ✅         | OK (existant)  |
| `/client/groupes/creer`| ✅     | ✅          | ✅         | OK (existant)  |
| `/client/groupes/rejoindre`| ✅ | ✅          | ✅         | OK (existant)  |
| `/client/tribus/`      | ✅ 🆕  | ✅ 🆕       | ✅ démo    | **CRÉÉ**       |
| `/client/tribus/[id]/` | ✅ 🆕  | ✅ 🆕       | ✅ démo    | **CRÉÉ**       |
| `/client/social`       | ✅     | ✅          | ✅ réparé  | flags activés  |
| `/client/amis`         | ✅     | ✅          | ✅         | OK (existant)  |
| `/client/notifications`| ✅     | ✅          | ✅         | OK (existant)  |
| Widget « Créer groupe » sur fiche voyage | ✅ | ✅ | ✅ | OK (existant)  |

---

*Audit clôturé — 2026-04-16. Voir aussi `docs/audit-groupes.md` (audit système global)
et `docs/groupes-admin-controls.md` (guide flags pour David).*
