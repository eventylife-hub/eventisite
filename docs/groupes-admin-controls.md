# Guide Feature Flags — Système de Groupes Eventy

> **Pour David** — Ce document explique chaque flag, ce qu'il contrôle, et ce qu'on recommande au lancement.
>
> Page admin : `/admin/groupes/settings/`

---

## Comment ça marche

Chaque fonctionnalité du système de groupes est derrière un **toggle indépendant**. Tu peux activer/désactiver chaque feature en un clic depuis `/admin/groupes/settings/`.

- **ON** = visible pour les utilisateurs
- **OFF** = invisible mais le code est prêt, il suffit de basculer
- Chaque changement est **loggé** (qui, quand, ancien/nouveau)
- 3 presets rapides : MVP Lancement, Phase Croissance, Tout activé

---

## 1. Types de groupes

| Flag | Label | Défaut | Lancement | Pourquoi |
|------|-------|--------|-----------|----------|
| `groups_type_friends_enabled` | Groupes Amis | ON | **ON** | Le plus simple. Invitation libre entre potes, paiement individuel. |
| `groups_type_family_enabled` | Groupes Famille | ON | **ON** | Forte demande. Chef de famille peut payer pour les enfants. |
| `groups_type_ce_enabled` | Groupes CE / Entreprise | OFF | **OFF** | Nécessite facturation entreprise et KYC. Ouvrir quand le process est rodé. |
| `groups_type_event_enabled` | Groupes Événement | OFF | **OFF** | Mariage, EVJF/EVG, anniversaire. Activer quand la cagnotte est testée. |

**Ce que ça contrôle** : les types affichés dans le sélecteur de type à la création du groupe (step 1). Si un type est OFF, il n'apparaît pas.

---

## 2. Canaux d'invitation

| Flag | Label | Défaut | Lancement | Pourquoi |
|------|-------|--------|-----------|----------|
| `invite_link_enabled` | Lien d'invitation | ON | **ON** | Le minimum vital. URL courte + preview OG. |
| `invite_qr_enabled` | QR Code | ON | **ON** | Gratuit à générer. Très pratique en personne. |
| `invite_whatsapp_enabled` | WhatsApp | ON | **ON** | Canal n°1 en France. Deep link avec message pré-rempli. |
| `invite_sms_enabled` | SMS | OFF | **OFF** | Coûteux (Twilio). Activer quand le ROI est prouvé. |
| `invite_email_enabled` | Email | ON | **ON** | Template HTML avec preview voyage. Standard. |
| `invite_social_enabled` | Réseaux sociaux | ON | **ON** | Deep links Facebook/Instagram. Fort potentiel viral. |

**Ce que ça contrôle** : les onglets/boutons visibles dans la page d'invitation (`/client/groupes/[id]/inviter`).

---

## 3. Modes de paiement

| Flag | Label | Défaut | Lancement | Pourquoi |
|------|-------|--------|-----------|----------|
| `payment_mode_individual` | Individuel | ON | **ON** | Chacun paye sa place. Mode par défaut. |
| `payment_mode_group` | Groupé | ON | **ON** | L'organisateur paye pour tout le monde. Attendu par familles/CE. |
| `payment_mode_mixed` | Mixte | ON | **ON** | L'organisateur paye pour X personnes. Maximum de flexibilité. |
| `payment_mode_pot` | Cagnotte | OFF | **OFF** | Tout le monde contribue au pot. Complexité juridique (fonds tiers). |
| `installment_enabled` | Échelonné | ON | **ON** | Acompte 30% + solde J-30. Réduit la friction. |

**Ce que ça contrôle** : les options de paiement affichées à la création du groupe (step 3).

---

## 4. Fonctionnalités avancées

| Flag | Label | Défaut | Lancement | Pourquoi |
|------|-------|--------|-----------|----------|
| `groups_public_enabled` | Groupes publics | OFF | **OFF** | N'importe qui peut rejoindre. Ouvrir quand la communauté est assez grande. |
| `group_chat_enabled` | Chat de groupe | OFF | **OFF** | Messages texte entre membres. Nécessite WebSocket. |
| `group_personalization_enabled` | Personnalisation | OFF | **OFF** | Thème, couleur, photo de couverture, playlist. Nice-to-have phase 2. |
| `group_rooming_enabled` | Rooming de groupe | OFF | **OFF** | Répartir les chambres entre membres. Famille/Événement. |
| `group_degressive_pricing_enabled` | Prix dégressifs | OFF | **OFF** | Plus le groupe est grand, moins c'est cher. Calibrage des marges nécessaire. |
| `group_viral_tree_enabled` | Arbre viral | OFF | **OFF** | Qui a invité qui. Top parrains. Feature pitch investisseur. |
| `group_post_voyage_enabled` | Souvenirs post-voyage | OFF | **OFF** | Timeline partagée, photos, vidéo récap. Feature émotionnelle phase 2. |

---

## 5. Modération

| Flag | Label | Défaut | Lancement | Pourquoi |
|------|-------|--------|-----------|----------|
| `auto_suspend_on_reports` | Suspension auto | OFF | **OFF** | Suspend un groupe après X signalements. Pas de groupes publics = pas besoin. |

---

## 6. Paramètres numériques

| Paramètre | Défaut | Plage | Description |
|-----------|--------|-------|-------------|
| `group_hold_hours` | 48h | 1-168h | Combien de temps les places sont bloquées pour le groupe |
| `max_group_size_override` | 0 (auto) | 0-200 | Taille max. 0 = lié à la capacité du bus |
| `report_threshold_suspend` | 5 | 1-50 | Nombre de signalements avant suspension auto |
| `invite_expiry_days` | 7j | 1-30j | Durée de validité des invitations |
| `degressive_threshold_5` | 10 | 5-53 | Membres pour -5% |
| `degressive_threshold_10` | 20 | 10-53 | Membres pour -10% |

---

## 7. Presets recommandés

### MVP Lancement (recommandé)
- Types : Amis ✅ + Famille ✅
- Invitations : Lien ✅ + QR ✅ + WhatsApp ✅ + Email ✅ + Réseaux ✅
- Paiement : Individuel ✅ + Groupé ✅ + Mixte ✅ + Échelonné ✅
- Tout le reste : OFF

**Pourquoi** : couvre 90% des cas d'usage sans risque. On peut tout activer en 1 clic plus tard.

### Phase Croissance
Tout le MVP + CE/Entreprise, Chat, Personnalisation, Rooming, Prix dégressifs, Arbre viral.

### Tout activé
Mode démo ou scale. Toutes les features ON.

---

## 8. Pour les investisseurs

Les groupes sont le **moat défensible** d'Eventy :
- **K-factor** : 1 groupe = 6-10 voyageurs en moyenne → CAC divisé par 6-10
- **Rétention** : les groupes refont des voyages ensemble → LTV multipliée
- **Network effects** : chaque invitation crée un nouveau point d'entrée
- **Mesurable** : taux de conversion invitation→réservation visible dans `/admin/groupes/analytics`

---

*Document généré le 2026-04-13 — Système de groupes Eventy Life*
