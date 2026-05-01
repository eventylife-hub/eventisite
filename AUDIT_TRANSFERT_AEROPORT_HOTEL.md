# AUDIT — Transferts Aéroport ↔ Hôtel

> **Demande PDG (David)** — pour les voyages en avion, le transfert aéroport ↔ hôtel doit être **mieux géré que le bus sur place actuel**, **automatisé**, avec **devis automatique** et **validation accélérée**. C'est le **CŒUR DU MVP avion**.
>
> **Date audit** : 2026-05-01 · **Worktree** : `dazzling-shockley-1dd0a1` · **Branche** : `claude/dazzling-shockley-1dd0a1`
>
> **Lecture obligatoire** : `AME-EVENTY.md` — ce module incarne *« Le client doit se sentir aimé »* + *« Le voyage où tu n'as rien à gérer, tout à vivre »*.

---

## 0. TL;DR

L'existant gère le **ramassage France → CDG** (`/pro/voyages/[id]/transport/avion/bus-aeroport` — ✅ bien fait, 750 lignes), mais **NE GÈRE PAS** le **transfert à destination** (RAK → Riad, BCN → Hotel) qui est **LA pièce manquante** pour un voyage avion serein.

Le type `AirportTransfer` existait déjà dans `types.ts` (l. 1272) mais en version **minimaliste** : juste les heures et le type de véhicule auto-sélectionné selon la capacité. **Aucun prestataire**, **aucun devis chiffré**, **aucune validation**, **aucun point de RDV**, **aucun contact chauffeur**, **aucun affichage client**.

**Livré dans cette session** :
1. ✅ Audit complet (ce fichier)
2. ✅ TODOs placés dans les 4 fichiers clés (types, page wizard, backend module, Prisma schema)
3. ✅ Type `AirportTransferQuote` ajouté + extension `AirportTransfer` (champs prestataire, devis, validation, point de RDV, retard de vol, PMR)
4. ✅ 4 pages squelettes créées (admin catalogue, équipe validation, pro sélection, client affichage)
5. ⏳ Backend modèles Prisma + endpoints API → **à câbler** (TODO P0)

---

## 1. Inventaire — Où est géré le transfert aujourd'hui ?

### 1.1 Frontend — wizard création voyage Pro

**Fichier principal** : `frontend/app/(pro)/pro/voyages/nouveau/page.tsx` (2 793 → 2 813 lignes après TODOs)
**Types** : `frontend/app/(pro)/pro/voyages/nouveau/types.ts` (1 656 → 1 800 lignes après extension)

**Ce qui existe** :
- `types.ts` l. 1272 — interface `AirportTransfer { enabled, arrivalAirport, flightArrivalTime, arrivalTransferTime, arrivalVehicleType, departureFlightTime, departureTransferTime, departureVehicleType }`
- `types.ts` l. 1261 — `TransferVehicleType = 'VAN' | 'MINIBUS' | 'BUS'`
- `page.tsx` l. 88 — fonction `buildAirportTransfer()` qui calcule les heures (atterrissage + 1h, décollage – 2h) et choisit le véhicule (≤8 = VAN, ≤19 = MINIBUS, ≥20 = BUS)
- `page.tsx` l. 920 — `useEffect` auto-déclenché : si `arrivalMode === 'FLIGHT'` ET hôtel sélectionné → génère/met à jour `formData.airportTransfer`
- `page.tsx` l. 2065+ — UI panneau "Transfert aéroport ↔ hôtel" dans la rubrique 14 du wizard, avec édition des heures vol

**Ce qui manque (cf §2)** :
- ❌ Aucun prestataire attribué (juste "VAN" sans nom de loueur)
- ❌ Aucun devis chiffré (pas de `totalAmountTTC`)
- ❌ Aucun lien occurrence-par-occurrence (1 seul `AirportTransfer` par voyage, pas un par départ)
- ❌ Aucun point de RDV (terminal, hall, panneau)
- ❌ Aucun contact chauffeur
- ❌ Aucune carte/distance/ETA
- ❌ Aucune politique retard de vol

### 1.2 Backend NestJS

**Module** : `backend/src/modules/transport/` (40 fichiers · ~5 500 lignes)
**Schéma Prisma** : `backend/prisma/schema.prisma`

**Ce qui existe** :
- `model TransportProvider` (l. 3083) — contact, status, pas de catégorie
- `model QuoteRequest` (l. 3101) — mode `BUS_ONLY | FLIGHT_ONLY | COMBINED`
- `model QuoteSegment` (l. 3131) — `segmentType: "OUTBOUND" | "RETURN" | "TRANSFER"` (commentaire), donc le type `TRANSFER` est **modélisé en string brute**, pas en enum
- `model FlightAllotment` (l. 5470) — vols charter avec `arrivalAirport` (IATA)
- `enum CheckinType` (l. 6196) — `TRANSFER` existe pour les check-ins de transfert privé

**Ce qui manque** :
- ❌ Pas de `model AirportTransferProvider` dédié (le `TransportProvider` est trop générique)
- ❌ Pas de `model AirportTransferQuote` (les devis transferts sont noyés dans `QuoteRequest`/`QuoteSegment`)
- ❌ Pas d'enum `AirportTransferStatus` pour le workflow
- ❌ Pas de `model AirportTransferZone` (mapping IATA → prestataires éligibles)
- ❌ Pas de service backend `AirportTransferQuoteService`

### 1.3 Côté admin

**Existant** : `frontend/app/(admin)/admin/transport/loueurs/page.tsx` (1 492 lignes — loueurs FR)
+ `loueurs/international/page.tsx` (258 lignes — loueurs internationaux Maroc/Espagne/Portugal/Italie/Grèce)

Ces pages gèrent les **loueurs de bus** au sens large, mais **rien de spécifique aux spécialistes transferts aéroport** (ex: Welcome Pickups, BlackLane VTC, Mozio…). Le système ne distingue pas un loueur "ramassage régional" d'un "spécialiste transfert aéroport" alors que ce sont 2 métiers différents.

**Nouvelle page créée** : `frontend/app/(admin)/admin/transferts-aeroport/page.tsx` ✅

### 1.4 Côté équipe Eventy

**Existant** : `frontend/app/(equipe)/equipe/transport/page.tsx` (cockpit transport général)

**Manque** : pas de cockpit spécifique pour valider les devis transferts aéroport en attente, suivre les transferts du jour J, escalader les anomalies.

**Nouvelle page créée** : `frontend/app/(equipe)/equipe/transferts/page.tsx` ✅

### 1.5 Côté client

**Existant** :
- `frontend/app/(client)/client/voyage/[id]/transport/page.tsx` (786 lignes — vue transport globale)
- `frontend/app/(client)/client/voyage/[id]/transport-avion/page.tsx` (350 lignes — détails vol seul, pas de transfert)
- `frontend/app/(client)/client/voyage/[id]/ramassage/page.tsx` (sélection arrêt départ FR)

**Manque** : aucune page dédiée "Mon transfert" qui mettrait en avant **le point de RDV à l'aéroport**, **le contact chauffeur**, **la rassurance retard de vol**. Or c'est précisément le moment où le voyageur a le plus besoin d'être tenu par la main : il sort d'un vol, il est fatigué, il est dans un pays qu'il ne connaît pas, il cherche son contact.

**Nouvelle page créée** : `frontend/app/(client)/client/voyage/[id]/transfert/page.tsx` ✅

### 1.6 Cas du `bus-aeroport` (existant côté pro — INVERSE de notre besoin)

`frontend/app/(pro)/pro/voyages/[id]/transport/avion/bus-aeroport/page.tsx` (750 lignes) gère **France → aéroport départ** (ex : ramassage Paris/Versailles → CDG T2F pour vol vers Marrakech). **Très bien fait** : 3 onglets (Unités Bus / Plan transfert / Timeline Gantt), KPIs, statut workflow, distribution auto.

⚠️ **Ce n'est PAS le transfert à destination** (RAK → Riad). C'est l'INVERSE. Cette page ne couvre que le **côté départ France**.

Le transfert à destination est **structurellement différent** :
- Côté France : on a notre flotte habituelle + nos lieux de ramassage standardisés
- Côté destination : on dépend d'un **prestataire local** (qu'on connaît mal, dans un pays différent, avec une langue différente)
- C'est pourquoi le **catalogue prestataires international** + **devis automatique** + **validation accélérée** est le cœur du sujet.

---

## 2. Ce qui manque — liste exhaustive

### 2.1 Modèle de données

| Manque | Priorité | Fichier cible |
|---|---|---|
| Modèle `AirportTransferProvider` (catégorie, IATA desservis, tarifs, rating, qualityScore, autoApproveEligible) | **P0** | `backend/prisma/schema.prisma` (TODO posé l. 3082) |
| Modèle `AirportTransferQuote` (provider, direction, prix, statut, point RDV, chauffeur) | **P0** | `backend/prisma/schema.prisma` |
| Modèle `AirportTransferZone` (mapping IATA → providers éligibles + radius hôtels) | **P1** | idem |
| Enum `AirportTransferQuoteStatus` (DRAFT/REQUESTED/RECEIVED/AUTO_APPROVED/PENDING_REVIEW/APPROVED/REJECTED/EXPIRED) | **P0** | idem |
| Enum `TransferProviderCategory` (AIRPORT_SPECIALIST, LOCAL_BUS_COMPANY, TAXI_FLEET, VTC_NETWORK, HOTEL_OWN_SHUTTLE, INTERNAL_FLEET) | **P0** | idem |
| Champs `AirportTransfer` étendus (déjà ajoutés au type frontend) | **P0** | `frontend/.../types.ts` ✅ |

### 2.2 Logique métier (backend)

| Manque | Priorité |
|---|---|
| Endpoint `POST /api/pro/voyages/:id/transferts/rfq` — déclenche RFQ multi-prestataires | **P0** |
| Endpoint `GET /api/pro/voyages/:id/transferts` — liste devis reçus | **P0** |
| Endpoint `POST /api/pro/voyages/:id/transferts/:quoteId/select` — sélection devis | **P0** |
| Endpoint `POST /api/equipe/transferts/:id/approve` + `/reject` | **P0** |
| Service `AirportTransferQuoteService` — RFQ auto sur création voyage avion + recalc si occurrences changent | **P0** |
| Service `AirportTransferValidationService` — règles auto-approve (prix < seuil + délai > J-7 + provider premium) | **P0** |
| Cron `airport-transfer-rfq-timeout` — relance après 24h sans réponse | **P1** |
| Service `AirportTransferTrackingService` — webhook chauffeur GPS jour J | **P1** |
| Intégration Google Distance Matrix (ou OSM/Mapbox) pour distance/ETA | **P0** |

### 2.3 Frontend Pro

| Manque | État |
|---|---|
| Page `/pro/voyages/[id]/transferts-aeroport` (sélection prestataire + comparateur 3 devis) | ✅ Squelette créé |
| Composant `EtapeTransfertAeroport.tsx` à extraire de la rubrique 14 actuelle (page.tsx l. 2067-2200) | ❌ TODO P0 |
| Lien "Configurer transferts" dans le wizard quand mode AVION détecté | ❌ TODO P0 |
| Per-occurrence config (1 transfert par départ) | ❌ TODO P1 |

### 2.4 Frontend Admin / Équipe

| Manque | État |
|---|---|
| Page `/admin/transferts-aeroport` (catalogue prestataires) | ✅ Squelette créé |
| Modal "Nouveau prestataire" (CRUD) | ❌ TODO P0 |
| Cartographie zones aéroports (heatmap couverture mondiale) | ❌ TODO P1 |
| Page `/equipe/transferts` (validation + suivi jour J) | ✅ Squelette créé |
| Comparateur 3 devis côte à côte (modal détail) | ❌ TODO P0 |
| Carte temps réel chauffeurs (GPS) | ❌ TODO P1 |

### 2.5 Frontend Client

| Manque | État |
|---|---|
| Page `/client/voyage/[id]/transfert` (point RDV + chauffeur + retard vol) | ✅ Squelette créé |
| Carte Google Maps trajet aéroport → hôtel | ❌ TODO P0 |
| Push notif quand chauffeur en route + arrivé à l'aéroport | ❌ TODO P1 |
| Possibilité d'envoyer message rapide au chauffeur via plateforme | ❌ TODO P2 |

### 2.6 Symphonie / Timeline

| Manque | Priorité |
|---|---|
| Injection automatique d'événements dans la symphonie : `J0 — atterrissage → transfert → check-in hôtel` | **P0** |
| Idem pour le retour : `J-final — checkout hôtel → transfert → décollage` | **P0** |
| Validation symphonie qui flag absence de transfert si voyage avion + hôtel | **P0** |

### 2.7 Workflow validation auto

**Critères auto-approve à coder dans `AirportTransferValidationService`** :
1. Prestataire `autoApproveEligible === true` (case dans catalogue admin)
2. Prix par pax ≤ seuil configuré (ex: 4,50€/pax pour Maroc, 7€/pax pour Europe occidentale)
3. Délai d'envoi RFQ → réception devis < 6h
4. Devis reçu plus de 7 jours avant le départ
5. Pas d'options chiffrées (PMR, bagages spéciaux, attente longue)
6. Capacité véhicule = nombre de pax (pas de gaspillage ni de tight-fit)

→ Si **tous** les critères passent : `AUTO_APPROVED`. Sinon → `PENDING_REVIEW` (escalade équipe).

---

## 3. Recommandations / TODOs concrètes

### 3.1 TODOs placés dans le code (cette session)

Les fichiers ci-dessous contiennent maintenant des **commentaires `// TODO Eventy [TRANSFERT-AEROPORT P0/P1] : ...`** qui pointent vers ce document :

| Fichier | Lignes affectées | Contenu |
|---|---|---|
| `frontend/app/(pro)/pro/voyages/nouveau/types.ts` | l. 1258, 1261, 1264-1289 | Bandeau audit, élargissement véhicules, type `AirportTransferQuote`, extension `AirportTransfer` |
| `frontend/app/(pro)/pro/voyages/nouveau/page.tsx` | l. 68, 918-928, 2063-2078 | Bandeau audit + TODO useEffect cascade RFQ + TODO refonte panneau cockpit |
| `backend/src/modules/transport/transport.module.ts` | l. 51 | TODO sous-module dédié `AirportTransferModule` |
| `backend/prisma/schema.prisma` | l. 3082 | TODO modèle dédié `AirportTransferProvider` |

### 3.2 Pages squelettes créées (cette session)

Toutes au format **dark Eventy gold #D4A853**, **glassmorphism**, **Framer Motion**, **lucide-react**.

| Page | Path |
|---|---|
| **Admin** — Catalogue prestataires transferts | `frontend/app/(admin)/admin/transferts-aeroport/page.tsx` |
| **Équipe** — Validation devis + suivi jour J | `frontend/app/(equipe)/equipe/transferts/page.tsx` |
| **Pro** — Sélection prestataire pour un voyage | `frontend/app/(pro)/pro/voyages/[id]/transferts-aeroport/page.tsx` |
| **Client** — Mon transfert (chaleureux) | `frontend/app/(client)/client/voyage/[id]/transfert/page.tsx` |

Chaque page contient des données démo (DEMO_PROVIDERS, DEMO_QUOTES, DEMO_TRANSFER) **à remplacer par des fetchs API**. Tous les boutons d'action ont des commentaires `// TODO Eventy [TRANSFERT-AEROPORT P0]` indiquant l'endpoint API à câbler.

### 3.3 Plan d'attaque recommandé (10 jours-homme estimés)

#### Sprint 1 — Backend P0 (5 jours)
1. Ajouter modèles Prisma : `AirportTransferProvider`, `AirportTransferQuote`, `AirportTransferZone` (1j)
2. Migration + seed catalogue initial (Marrakech, Barcelone, Lisbonne, Casablanca, Athènes…) (0,5j)
3. Service `AirportTransferQuoteService` + endpoints RFQ + select + approve/reject (1,5j)
4. Service `AirportTransferValidationService` + règles auto-approve (1j)
5. Tests + intégration Google Distance Matrix (1j)

#### Sprint 2 — Frontend P0 (3 jours)
1. Câbler les 4 squelettes aux endpoints API (1,5j)
2. Modal "Nouveau prestataire" (admin) + comparateur 3 devis (équipe) (1j)
3. Intégration Google Maps Embed côté client (0,5j)

#### Sprint 3 — Symphonie + occurrences (2 jours)
1. Injection auto J0 / J-final dans la symphonie (1j)
2. Per-occurrence config (1 paire transfert par départ) (1j)

#### Sprint 4 (P1 plus tard) — Suivi temps réel + push notif (3 jours)
1. Webhook chauffeur GPS + carte temps réel équipe
2. Push notif client (chauffeur arrivé, retard détecté)
3. Cron timeout RFQ + relance auto

---

## 4. Catalogue prestataires recommandé (seed initial)

Pour un seeding pertinent du catalogue admin, voici les prestataires à intégrer en priorité (par destination Eventy), à câbler dans la migration Prisma :

| Pays | Aéroport | Prestataires recommandés | Catégorie |
|---|---|---|---|
| 🇲🇦 Maroc | RAK, FEZ, CMN, AGA | Marrakech Airport Transfers, CTM, Atlas Voyages, Riad Shuttle Network | AIRPORT_SPECIALIST + LOCAL_BUS |
| 🇪🇸 Espagne | BCN, MAD, AGP | Welcome Pickups, AeroBus Barcelona, Civitatis Transfers | AIRPORT_SPECIALIST |
| 🇵🇹 Portugal | LIS, OPO | Lisboa Shuttle, Yellow Bus Lisboa, Tour Group Transfers | AIRPORT_SPECIALIST + LOCAL_BUS |
| 🇮🇹 Italie | FCO, MXP, NAP | RomeCabs, Welcome Pickups Milan, Goldcar Tours | VTC_NETWORK + AIRPORT_SPECIALIST |
| 🇬🇷 Grèce | ATH, JTR, HER | Welcome Pickups Athens, Athens Airport Taxi, Santorini View Transfers | VTC + AIRPORT_SPECIALIST |
| 🇨🇿 Tchéquie | PRG | Prague Airport Transfers, Mercedes Prague | AIRPORT_SPECIALIST |
| 🌐 Premium global | CDG, LHR, FCO… | BlackLane, Mozio, Daytrip | VTC_NETWORK |

---

## 5. Cohérence avec l'âme Eventy

**Promesse** : *« Le voyage où tu n'as rien à gérer, tout à vivre. »*

Le transfert aéroport → hôtel est **LE moment de vérité** d'un voyage avion :
- Le voyageur sort d'un vol, fatigué, dans un pays inconnu
- Il cherche une pancarte, un contact, un repère
- C'est là qu'il décide si Eventy a tenu sa promesse de **prendre soin de lui**

**3 principes non-négociables** pour ce module :

1. **L'humain est visible** — le voyageur voit le prénom de Karim, sa photo si possible, ses langues parlées. Pas un numéro de taxi anonyme.
2. **Zéro stress, zéro surprise** — la politique retard de vol est affichée en gros, en vert, rassurante. Pas de petites lignes.
3. **Le prix juste, transparent** — si le transfert est inclus, on le dit. Si en option, on dit combien et pourquoi. Pas de supplément caché à l'arrivée.

---

## 6. Vérification post-implémentation (checklist)

Une fois les 4 sprints terminés, vérifier :

- [ ] Un voyage créé avec mode AVION + hôtel déclenche **automatiquement** une RFQ
- [ ] Les 3 prestataires les mieux notés sur la zone IATA reçoivent la RFQ par email
- [ ] À réception, le devis le plus compétitif passe en `AUTO_APPROVED` si tous les critères OK
- [ ] Sinon escalade `PENDING_REVIEW` visible dans `/equipe/transferts`
- [ ] Le créateur Pro voit le devis sélectionné dans `/pro/voyages/:id/transferts-aeroport`
- [ ] Le voyageur voit son transfert + RDV + contact chauffeur dans `/client/voyage/:id/transfert`
- [ ] La symphonie inclut les événements J0 (atterrissage → transfert → check-in)
- [ ] À J-1, le contact chauffeur est mis à jour automatiquement et notifié au client
- [ ] En cas de retard vol > 30min, le système notifie le chauffeur et le client

---

## 7. Liens utiles

- **Document fondateur** : [`AME-EVENTY.md`](AME-EVENTY.md)
- **Audit création voyage complet** : [`AUDIT-CREATION-VOYAGE-COMPLET.md`](AUDIT-CREATION-VOYAGE-COMPLET.md)
- **Symphonie occurrences** : [`TODO-SYMPHONIE-OCCURRENTS.md`](TODO-SYMPHONIE-OCCURRENTS.md)
- **Multi-bus sprint** : [`CHARTER-MULTIBUS-SPRINT.md`](CHARTER-MULTIBUS-SPRINT.md)
- **TODO transport carte (existant)** : [`TODO-FICHE-VOYAGE-TRANSPORT-CARTE.md`](TODO-FICHE-VOYAGE-TRANSPORT-CARTE.md)

---

*Audit livré 2026-05-01 par l'assistant IA PDG · branche `claude/dazzling-shockley-1dd0a1`*
