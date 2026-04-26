# TODO — Activités & Options du voyage (côté Créateur / Indépendant / Client)

> **Date** : 2026-04-26
> **Auteur** : Claude (assistant PDG IA)
> **Statut** : Vision validée par David — prêt à implémenter

---

## 🌟 Vision PDG (David)

Les **créateurs Eventy** organisent un voyage. Pendant ce voyage, des **sorties / activités** ponctuent l'aventure :

- ☕ **Petit goûter de 4 h** sur un point d'arrêt de bus (HRA partenaire — café, salon de thé)
- 🏛️ **Visite guidée d'un village** menée par le créateur lui-même
- 🌅 **Après-midi libre** sur un point d'arrêt avec **activité optionnelle** (atelier, dégustation)
- 🍷 **Dégustation de vins** chez un viticulteur partenaire
- 🥘 **Atelier cuisine** dans un restaurant HRA
- 🥾 **Randonnée guidée** par un indépendant Eventy

### 💎 L'avantage différenciant Eventy

> **Nos créateurs passionnés sont vos guides.**

- Pas besoin d'appeler des guides extérieurs → **économie pour le client** (-30 à -50 % vs visite guidée externe).
- Le **créateur du voyage fait lui-même la visite** ou un autre **indépendant Eventy validé**.
- Argument de vente client : *"Vous voyagez avec un passionné qui connaît chaque ruelle."*
- Argument de marge Eventy : on capte la valeur du guide, qui était auparavant payée à un externe.

---

## 🧱 Modèle de données (cible)

### Entité `Activity`

| Champ | Type | Exemple |
|---|---|---|
| `id` | string | `act-marrakech-medina-001` |
| `voyageId` | string (FK) | `trip-2026-marrakech-mai` |
| `title` | string | `Visite guidée Médina + thé à la menthe` |
| `description` | string (500c) | "Découvrez les souks avec votre créateur, suivi d'un thé chez Café Argan." |
| `category` | enum | `Visite\|Dégustation\|Atelier\|Goûter\|Randonnée\|Soirée\|Spectacle\|Bien-être` |
| `duration` | string | `4h` |
| `participantsMin` | number | 8 |
| `participantsMax` | number | 30 |
| **`inclusion`** | enum | `INCLUS` / `OPTION` |
| **`busStopId`** | string (FK) | `stop-marrakech-jamaa-elfna` (nullable) |
| **`hraPartnerId`** | string (FK) | `hra-cafe-argan-marrakech` (nullable) |
| **`provider`** | enum | `CREATOR_SELF` / `EVENTY_INDEP` / `EXTERNAL_PARTNER` |
| **`providerId`** | string | userId du créateur ou indé Eventy |
| `costBase` | number | 5.50 (coût HRA / fournisseur, € HT) |
| `costExtras` | number | 0 (matériel, transport spécifique) |
| **`creatorMargin`** | number | 4.00 (marge brute créateur/indé, 18 %) |
| **`eventyMargin`** | number | 18.00 (marge Eventy, 82 %) |
| `priceClient` | number | 27.50 (prix TTC affiché au client) |
| `currency` | string | `EUR` |
| `isPublished` | bool | true |
| `imageUrl` | string | `/uploads/activities/medina.jpg` |
| `tags` | string[] | `['Culturel', 'Plein air', 'Local']` |
| `createdAt` | datetime | … |
| `updatedAt` | datetime | … |

### Relations
- `Activity → Voyage` (n:1) — l'activité appartient à un voyage
- `Activity → BusStop` (n:1, optionnel) — l'activité a lieu sur un arrêt de bus
- `Activity → HRAPartner` (n:1, optionnel) — l'activité se déroule chez un partenaire HRA
- `Activity → User (creator/indep)` (n:1) — fait par qui
- `Reservation → Activity[]` (n:n) — quelles options le client a sélectionnées

---

## 💰 Logique de marge (modèle 82/18 validé PDG)

> **RAPPEL CRITIQUE** (cf. memory feedback) : 82 % = marge Eventy / 18 % = brut indépendant.
> Le 82/18 s'applique **sur la marge** (priceClient − costBase − costExtras), **pas** sur le coût total.

### Formule

```
marge_totale = priceClient − costBase − costExtras
eventyMargin = marge_totale × 0.82
creatorMargin = marge_totale × 0.18
```

### Exemple : visite Médina + goûter Café Argan

| Poste | Montant |
|---|---|
| Coût HRA (thé à la menthe + pâtisserie, 1 personne) | **5,50 €** |
| Coût matériel (carte papier, livret) | **0,50 €** |
| **Total coûts** | **6,00 €** |
| Prix client TTC affiché | **27,50 €** |
| **Marge totale** | **21,50 €** |
| → Marge Eventy (82 %) | **17,63 €** |
| → Marge créateur (18 %) | **3,87 €** |

### Cas particulier : activité INCLUSE

Quand l'activité est marquée `INCLUS`, son `priceClient = 0` côté ligne client, mais les coûts et marges sont **intégrés au prix global** du voyage (à répartir au prorata sur le P&L du voyage).

---

## 📋 TODOs détaillées

### 🔧 Backend (NestJS)

- [ ] `TODO-ACT-B01` — Créer migration Prisma `Activity` avec relations `voyage / busStop / hraPartner / providerUser`
- [ ] `TODO-ACT-B02` — Module `activities` : CRUD, RBAC créateur (lecture/écriture sur ses voyages uniquement)
- [ ] `TODO-ACT-B03` — Endpoint `POST /pro/voyages/:id/activities` (créateur)
- [ ] `TODO-ACT-B04` — Endpoint `POST /independants/activities` (indépendant — visible par les créateurs Eventy)
- [ ] `TODO-ACT-B05` — Endpoint `GET /client/voyages/:id/options` — liste des activités `OPTION` pour la page de réservation
- [ ] `TODO-ACT-B06` — Calcul automatique `eventyMargin` / `creatorMargin` à la sauvegarde (server-side, pas client-side)
- [ ] `TODO-ACT-B07` — Lien `Reservation.selectedActivities[]` (table de jointure)
- [ ] `TODO-ACT-B08` — Webhook `activity.booked` → notif au créateur/indé concerné
- [ ] `TODO-ACT-B09` — Validation : si `inclusion = INCLUS`, `priceClient` doit être 0 (mais coûts > 0 OK)
- [ ] `TODO-ACT-B10` — Module `revenues` : intégrer marges activités dans le P&L voyage

### 🎨 Frontend — Côté Créateur (`/pro`)

- [ ] `TODO-ACT-F01` — Étendre form `pro/activites/mes-activites` avec champs :
  - [ ] Type inclusion : **Inclus** / **Option payante** (toggle dark gold)
  - [ ] Sélecteur arrêt de bus (relié au voyage en cours)
  - [ ] Sélecteur HRA partenaire (relié au catalogue HRA)
  - [ ] Provider : **Moi (créateur)** / **Indé Eventy** / **Partenaire externe**
- [ ] `TODO-ACT-F02` — Calculateur de marge live (input coût + prix → affiche 82/18 + marge totale)
- [ ] `TODO-ACT-F03` — Aperçu carte activité tel qu'affiché côté client
- [ ] `TODO-ACT-F04` — Vue tableau P&L par activité dans `/pro/finance/activites`
- [ ] `TODO-ACT-F05` — Lien rapide depuis `/pro/voyages/[id]` → "+ Ajouter activité à ce voyage"
- [ ] `TODO-ACT-F06` — Drag & drop pour ordonner les activités sur la timeline du voyage

### 🎨 Frontend — Côté Indépendant (`/independant`)

- [ ] `TODO-ACT-F07` — Form `independant/activites/creer` : ajouter sélecteur "voyages des créateurs où je suis dispo"
- [ ] `TODO-ACT-F08` — Vue "Activités proposées sur les voyages partenaires" (catalogue cross-créateur)
- [ ] `TODO-ACT-F09` — Stats marge brute indé sur ses activités (18 %)
- [ ] `TODO-ACT-F10` — Indicateur "Activité validée par X créateurs"

### 🎨 Frontend — Côté Client (`/client`)

- [ ] `TODO-ACT-F11` — `client/voyages/[id]/reserver` Step 1 : remplacer `ActivityOption` hardcodé par fetch dynamique `/client/voyages/:id/options`
- [ ] `TODO-ACT-F12` — Carte activité client avec :
  - [ ] Photo
  - [ ] Durée + lieu (arrêt + HRA)
  - [ ] Badge **"Fait par votre créateur"** (or) ou **"Partenaire local"** (gris)
  - [ ] Description (modale détaillée au clic)
  - [ ] Prix par personne / "Inclus dans le voyage"
- [ ] `TODO-ACT-F13` — Mini-carte arrêt de bus quand activité tied à un stop
- [ ] `TODO-ACT-F14` — Recap step : ligne par activité optionnelle sélectionnée avec sous-total
- [ ] `TODO-ACT-F15` — Page `/client/voyages/[id]/programme` : timeline complète J1, J2, J3 avec activités incluses + options dispo

### 🔗 Liens transverses (activité → HRA → bus → voyage)

- [ ] `TODO-ACT-X01` — Quand un client réserve une activité OPTION : créer auto une `HRABooking` côté HRA partenaire
- [ ] `TODO-ACT-X02` — Quand un arrêt de bus est sélectionné, filtrer les activités proposées sur cet arrêt
- [ ] `TODO-ACT-X03` — Affichage côté HRA `/hra/reservations` : voir les activités Eventy qui amènent du flux
- [ ] `TODO-ACT-X04` — Statistique créateur : "Vos activités ont généré X € pour vos partenaires HRA"

---

## ✅ Definition of Done

Une activité est **complète** quand :

1. ✅ Elle est créée côté créateur ou indépendant avec tous les champs obligatoires
2. ✅ Son P&L est calculé automatiquement (82/18 sur la marge)
3. ✅ Elle apparaît dans la page `/client/voyages/[id]/reserver` si `OPTION`, ou dans le programme si `INCLUS`
4. ✅ Le client peut la sélectionner / désélectionner et le total est mis à jour en temps réel
5. ✅ La réservation crée une ligne dans la table de jointure et notifie le provider
6. ✅ Le partenaire HRA (si lié) reçoit l'info dans son portail

---

## 🎯 Priorité PDG

| Priorité | Tâche | Justification |
|---|---|---|
| **P0** | F01, F02, F11, F12, B01, B02 | Activités = cœur de l'expérience voyage. Sans ça, pas de différenciation Eventy. |
| **P1** | F05, F07, F13, F14, B05, B06 | Connexion arrêts/HRA = avantage compétitif. |
| **P2** | F03, F04, F08, F09, F15, B07-B10 | Polish et P&L détaillé. |
| **P3** | F06, F10, X01-X04 | Optimisations et automatisations cross-portail. |

---

## 📝 Notes techniques

- **Style** : dark gold partout (`#D4A853` accent, `#0F1520` surface, `#0A0E14` background). Pas d'emoji dans les noms de fichiers/composants.
- **Apostrophes JSX** : `&apos;` obligatoire dans le texte JSX (pas de `'` brut).
- **Tests** : couverture minimum 80 % sur le module `activities` (calcul de marge critique).
- **Cohérence âme Eventy** : ton chaleureux dans les descriptions, jamais de marketing creux. *"Une visite menée par votre créateur passionné."*

---

> **Prochaine étape** : implémenter F01 (form étendu) + F11/F12 (UX client) en parallèle.
> Le backend (B01-B06) peut être démarré par un dev parallèle pendant que le front avance sur des données mockées.
