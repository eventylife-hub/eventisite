# AUDIT EN PROFONDEUR — Portail HRA `/maisons` + Plan Intégrations PMS / Channel Managers

> **Auteur** : Claude (bras droit IA PDG)
> **Date** : 2026-05-03
> **Branche** : `claude/practical-engelbart-cb2338`
> **Scope** : Audit du portail `/maisons` (Hôtels · Restaurants · Activités) + design des connecteurs vers les systèmes de gestion (PMS, channel managers, booking systems) + plan équipe Eventy de monitoring.

---

## 1. Inventaire de l'existant — Portail `/maisons`

### 1.1 Architecture (33 pages, ~8 000 LOC)

Le portail HRA Eventy est structuré autour d'un **shell sidebar accordéon** (`/maisons/layout.tsx`) en **10 sections** :

| Section | Pages clés |
|---|---|
| **Tableau de bord** | `dashboard`, `notifications`, `connexion-pro` |
| **Hébergement** | `hebergement` (chambres), `hebergement/planning`, `hebergement/tarifs`, `hebergement/checkin`, `rooming` |
| **Restauration** | `restauration` (menus), `restauration/commandes`, `restauration/stocks`, `restauration/options` |
| **Activités sur place** | `activites`, `activites/planning`, `activites/materiel` |
| **Voyages & Clients** | `reservations`, `reservations/[id]`, `clients` |
| **Énergie** | `energie`, `energie/points`, `energie/avantages` |
| **Finance** | `revenus`, `finance` (factures), `paiements` (versements) |
| **Vente de voyages** | `vendre-3min`, `vente-voyages`, `vente-clients`, `vente-qrcode`, `vente-catalogue`, `vente-commissions` |
| **Documents** | `documents`, `documents/certifications`, `documents/assurances` |
| **Configuration** | `etablissement`, `configuration`, `inscription`, `equipe`, `coordination`, `comptage`, `bracelets`, `transport`, `decoration`, `services`, `analytics`, `creations`, `image-souvenirs`, `partager`, `championnats`, `securite`, `support` |

**Identité visuelle** : dark gold premium — `BG #0A0E14` · `BG2 #0d1219` · `BG3 #141a24` · `GOLD #D4A853` · `GOLD_ACCENT #fcd34d` · ivoire `#f1f3fc`. Police **Space Grotesk**. Animations Framer-motion. Graphs Recharts (AreaChart, BarChart, PieChart).

### 1.2 Pages métier déjà capables

| Métier | Page racine | Capacités actuelles |
|---|---|---|
| **Hôtels** | `/maisons/hebergement`, `/maisons/configuration` | Liste chambres (nom, type, capacité, lits, tarif base, amenities, actif/inactif) · Pension par défaut (HALF/FULL/ROOM_ONLY) · Dates bloquées (blackout) · Tarifs saisons · Planning occupation · Check-in/out |
| **Restaurants** | `/maisons/restauration`, `/maisons/configuration` (onglet menus) | Menus par moment (PDJ/déj/dîner/cocktail), prix /pax, plats inclus, options diététiques (végé, halal, allergènes) · Commandes du jour · Stocks · Options |
| **Activités** | `/maisons/activites` | Liste activités + planning + matériel (3 pages) — moins riche que H&R aujourd'hui |
| **Transverse** | `/maisons/configuration` | Conditions paiement (IBAN, acompte %, solde J-X, mode paiement) · Réglages globaux |

### 1.3 Ce qui MANQUE aujourd'hui (gaps majeurs)

1. **Aucune intégration PMS / Channel Manager** — Toute la config (chambres, dispos, tarifs, menus, créneaux) est saisie manuellement dans Eventy. Aucune sync avec les systèmes que les Maisons utilisent déjà au quotidien.
2. **Aucun statut de connexion** — Pas de témoin "connecté/déconnecté/drift" visible côté Maison ou Équipe Eventy.
3. **Pas de webhooks bi-directionnels** — Une réservation Eventy n'est pas pushée vers le PMS de l'hôtel ; une dispo retirée dans le PMS ne remonte pas dans Eventy → **risque réel de surbooking**.
4. **Onboarding HRA** — Existe côté équipe (`/equipe/hra/onboarding`), mais aucun wizard pour brancher le PMS lors de l'arrivée d'une nouvelle Maison.
5. **Côté Équipe Eventy** — La page `/equipe/maisons` existe mais n'a aucune visibilité sur la santé technique des connexions. Pas de "feu rouge" pour une Maison déconnectée depuis 48h.
6. **Activités sous-équipées** — Pas de gestion fine de capacité/créneaux/équipement par jour, comparé à hébergement et restauration.

---

## 2. Métiers HRA — Besoins distincts

### 2.1 Hôtels (PMS — Property Management System)

**Données à syncer en LIVE** :
- Chambres : type (single/double/suite/family), capacité, lits, amenities, photos, état (clean/dirty/maintenance)
- Disponibilités jour par jour, par type de chambre
- Tarifs : base + saisonnalité + last-minute + early-bird + groupes
- Options pension : RO / BB / HB / FB / AI
- Restrictions : minimum stay, closed to arrival/departure, blackouts
- Réservations : guest, dates, chambres, services, statut
- Check-in/check-out, paiements, pré-autorisations CB

**PMS et channel managers à connecter en priorité** :
- **Mews** ⭐ (cloud, 5000+ hôtels, OAuth2 + REST + webhooks)
- **Cloudbeds** ⭐ (auberges + petits hôtels indépendants, REST + webhooks v1.2)
- **Hostfully** (gîtes + locations courtes durées)
- **Sirvoy** (petits hôtels & B&B EU/Maroc, REST API)
- **Apaleo** (hôtels modernes, GraphQL + webhooks)
- **MyAllocator** (channel manager Cloudbeds, 200+ OTAs)
- **Octorate** (channel manager IT/EU)
- **SiteMinder** (Channel manager mondial leader)
- **Beds24** (PMS + channel manager combiné, économique)
- **Smoobu** (locations courtes durées, EU)
- **Booking.com Connect XML** (intégration directe channel)
- **Opera Cloud / Opera PMS** (hôtels 4-5★ — plus complexe, partenariat Oracle)

### 2.2 Restaurants

**Données à syncer en LIVE** :
- Tables : nombre, capacité, configuration salle (intérieur/terrasse)
- Créneaux de service (déjeuner 12h-14h30, dîner 19h-22h30) avec durée moyenne d'occupation
- Menus : carte, plats, prix, allergènes, options diététiques
- Réservations table : pax, créneau, allergènes, demandes spéciales
- Capacité résiduelle par créneau

**Booking systems à connecter** :
- **TheFork (TripAdvisor)** ⭐ (leader EU, 60 000 restaurants, API B2B)
- **ZenChef** ⭐ (leader FR, 10 000 restos, API REST)
- **OpenTable** (US + UK, partenariat GuestCenter API)
- **Sevenrooms** (haut de gamme, fine dining)
- **Resy** (US, racheté par AmEx)
- **Bookatable** (Michelin)
- **Guestonline** (FR niche)

### 2.3 Activités

**Données à syncer en LIVE** :
- Catalogue activités : titre, description, durée, niveau, équipement fourni
- Créneaux : jours, heures, capacité min/max
- Tarifs : adulte/enfant/groupe, saisonnalité
- Réservations : participants, créneau, équipement attribué
- Encadrement : guides/moniteurs disponibles

**Booking platforms à connecter** :
- **Bokun (TripAdvisor)** ⭐ (leader mondial activités, API + webhooks)
- **FareHarbor** ⭐ (US/CA leader, API + iframe widgets)
- **Regiondo** ⭐ (leader EU activités, API REST)
- **GetYourGuide Supplier** (canal de distribution + API)
- **Viator (TripAdvisor) Supplier** (canal + API B2B)
- **Rezdy** (Australie + monde, leader expériences)
- **Peek Pro** (US, location vélos/kayaks)
- **Checkfront** (CA/US, polyvalent)

### 2.4 Autres types HRA (futur)

| Type | Acteurs |
|---|---|
| **Transferts** | Welcome Pickups API, Get Transfer, Suntransfers |
| **Location véhicules** | RentalCars, Booking Cars, partenaires locaux via API custom |
| **Guides indépendants** | Withlocals, ToursByLocals (channel) — ou form-based intégré Eventy |
| **Événements ponctuels** | Eventbrite Distributor API, Weezevent API |
| **Spa / Wellness** | Mindbody (US), Booker, partenaires hôtels via PMS |

---

## 3. Architecture cible — Sync bi-directionnelle

```
┌──────────────────────┐                    ┌─────────────────────┐
│  PMS / Channel Mgr   │                    │     Eventy Cloud    │
│  (Mews / Cloudbeds   │ ◄─── Webhooks ───► │  (NestJS + Postgres │
│   ZenChef / Bokun…)  │     OAuth2 token   │   + Redis cache)    │
└──────────┬───────────┘                    └──────────┬──────────┘
           │                                            │
           ▼                                            ▼
   ┌───────────────┐                          ┌─────────────────┐
   │ Source de     │                          │ Source de       │
   │ vérité dispo  │                          │ vérité résa     │
   │ + tarifs      │                          │ groupe Eventy   │
   └───────────────┘                          └─────────────────┘
                ▲                                    │
                │                                    │
                └──── push réservation groupe ◄─────┘
                      (lock chambres, options pension,
                       allergènes, créneaux activités)
```

**Principes** :
1. **PMS = source de vérité dispo + tarifs** → Eventy lit, n'écrit pas (sauf push résa).
2. **Eventy = source de vérité résa Eventy** → Lock chambres dans le PMS via API.
3. **Webhooks bi-dir** : si la Maison modifie sa dispo dans Mews → Eventy reçoit push → invalide cache.
4. **Snapshot prix** : au moment de la publication d'un voyage Eventy, le tarif PMS est figé pour ce voyage. Pas de "drift" de prix après publication.
5. **Reconciliation horaire** : un cron tourne toutes les heures pour vérifier qu'une résa Eventy a bien sa contrepartie dans le PMS.

---

## 4. Plan PMS par métier — TODO Eventy (livraison)

### 4.1 Hôtels — Sprint 1 (priorité absolue)

```ts
// TODO Eventy — priorité P0 :
//  - Connecteur Mews (OAuth2 + Webhooks resource hooks)
//  - Connecteur Cloudbeds (REST API v1.2 + webhooks)
//  - Connecteur Sirvoy (Maroc/EU petits hôtels — REST simple)
// Webhooks : reservation.created/updated/cancelled, availability.updated, rate.updated
// Endpoints proxy backend : /api/pms/hotels/{provider}/sync, /api/pms/hotels/{provider}/availability
```

**Backend NestJS** — module à créer : `backend/src/modules/integrations/pms-hotels/`
- Connecteur Mews : `mews.connector.ts` + `mews.webhooks.controller.ts`
- Connecteur Cloudbeds : `cloudbeds.connector.ts` + `cloudbeds.webhooks.controller.ts`
- Connecteur Sirvoy : `sirvoy.connector.ts` (polling, pas de webhooks natifs)
- Service unifié `PmsHotelsService` qui abstrait derrière une interface commune.

### 4.2 Restaurants — Sprint 2

```ts
// TODO Eventy — priorité P1 :
//  - Connecteur ZenChef (FR, leader)
//  - Connecteur TheFork (EU)
//  - Connecteur OpenTable (US/UK — phase 3)
// Webhooks : booking.created, booking.cancelled, capacity.updated
```

### 4.3 Activités — Sprint 3

```ts
// TODO Eventy — priorité P2 :
//  - Connecteur Bokun (mondial activités)
//  - Connecteur FareHarbor (US/CA)
//  - Connecteur Regiondo (EU activités)
// Webhooks : booking, availability, capacity
```

### 4.4 Transverse — Toujours

```ts
// TODO Eventy — toujours :
//  - Sync bi-dir prix/dispo/résa avec rate-limit et idempotency keys
//  - Job cron horaire de reconciliation (BullMQ)
//  - Alerte déconnexion PMS pour équipe Eventy (channel #ops-pms Slack + dashboard)
//  - Onboarding HRA assisté avec wizard config par métier
//  - Stockage tokens OAuth chiffrés (KMS / Vault)
//  - Audit log de chaque appel API PMS (debug + compliance)
```

---

## 5. Live UI sur Eventy — Spécification

### 5.1 Dashboard HRA — section PMS (page `/maisons`)

Bandeau ajouté en haut du dashboard avec :
- Statut des connecteurs actifs (vert/jaune/rouge)
- Compteur "X chambres synchronisées · Y dispos live · Z résas pushed aujourd'hui"
- CTA "Connecter mon PMS →" si rien n'est branché

### 5.2 Page hub `/maisons/integrations-pms` (NEW)

Vue d'ensemble de tous les connecteurs disponibles, par métier :
- Onglets Hôtels / Restaurants / Activités
- Cards `PmsConnectionCard` avec statut + bouton OAuth
- Logs de sync récents
- Lien vers wizard onboarding

### 5.3 Pages config par métier (NEW)

- `/maisons/hebergement/integrations-pms` — branche Mews/Cloudbeds/Sirvoy
- `/maisons/restauration/integrations-pms` — branche ZenChef/TheFork
- `/maisons/activites/integrations-pms` — branche Bokun/FareHarbor/Regiondo

### 5.4 Indicateur de statut

Couleur du badge :
- 🟢 **Vert** : connecté + sync < 5 min ago
- 🟡 **Jaune** : connecté + dernière sync 5-60 min ago
- 🔴 **Rouge** : déconnecté ou erreur depuis > 60 min
- ⚪ **Gris** : non configuré

---

## 6. Côté Équipe Eventy — Page `/equipe/maisons-monitoring` (NEW)

**Objectif** : permettre à l'équipe Eventy de voir l'état des connexions PMS de **toutes les Maisons partenaires** en un coup d'œil et d'intervenir vite en cas de drift.

**Sections** :
1. **KPIs en haut** : N maisons connectées / N totales, taux sync < 5 min, alertes ouvertes
2. **Tableau temps réel** : maison · métier · provider PMS · statut · dernière sync · actions (Re-connecter / Voir logs / Contacter)
3. **Alertes drift** : maison X a 3 résas Eventy non push vers Mews depuis 2h → action urgente
4. **Onboarding pipeline** : maisons en cours de connexion (étape par étape)
5. **Logs API** : trace des derniers appels avec status code

---

## 7. Recommandations PDG (priorisation)

### Phase 1 — MVP démontrable (2 sprints)
1. ✅ Page hub `/maisons/integrations-pms` avec catalogue de connecteurs (placeholders)
2. ✅ Composant `PmsConnectionCard` réutilisable (3 métiers)
3. ✅ Helper `lib/pms-integrations.ts` (types + connecteurs placeholders)
4. ✅ Page équipe `/equipe/maisons-monitoring` (UI complète, données mock)
5. ✅ Bandeau "Connectez votre PMS" sur dashboard `/maisons`
6. **Backend** : module NestJS `integrations/pms-hotels/` avec Mews + Cloudbeds (OAuth2 + read-only)

### Phase 2 — Bi-directionnel (3-4 sprints)
1. Webhooks entrants Mews + Cloudbeds → invalidation cache dispo
2. Push réservation groupe Eventy → PMS (lock chambres)
3. Reconciliation horaire (cron BullMQ)
4. ZenChef + TheFork (restos)
5. Bokun (activités)

### Phase 3 — Industrialisation (5+ sprints)
1. Tous les autres connecteurs (Sirvoy, Apaleo, Beds24, FareHarbor, Regiondo, OpenTable…)
2. Channel manager mode (SiteMinder, MyAllocator) — branchement via channel plutôt que PMS direct
3. Wizard onboarding HRA avec sélection métier + provider
4. Alertes Slack #ops-pms + dashboard équipe complet

### Phase 4 — Premium PMS Eventy (R&D)
- Si une Maison n'a aucun PMS → offrir Eventy comme PMS gratuit (sur leur catalogue Eventy uniquement)
- Permet de capter les hôtels indépendants/familiaux (cible Maroc, Algarve…) qui font tout sur tableur

---

## 8. Coûts & charges API estimés (commission Eventy)

| Provider | Coût intégration | Coût récurrent | Notes |
|---|---|---|---|
| Mews | Gratuit (programme partenaires) | 0€ + part transactionnelle 2% | Validation Mews Marketplace requise |
| Cloudbeds | Gratuit programme | 0€ | Approbation Marketplace |
| Sirvoy | Gratuit | 0€ | API ouverte |
| ZenChef | Partenariat à négocier | À discuter | Possiblement com 1-2% |
| TheFork | API B2B partenariat | Frais setup + récurrent | Contrat commercial |
| Bokun | Gratuit | 0€ | Programme partenaires actif |
| FareHarbor | Gratuit | 0€ | Approbation requise |
| SiteMinder | Frais setup | Mensuel | Channel manager |

**Budget intégration tech (DEV INTERNE)** : ~30-45 j/h dev pour MVP Phase 1+2 (Mews + Cloudbeds + ZenChef + Bokun + UI complète).

---

## 9. Risques & garde-fous

| Risque | Mitigation |
|---|---|
| **Surbooking** (résa Eventy + résa PMS sur même chambre) | Lock immédiat dans PMS au moment de la résa Eventy. Reconcile horaire. |
| **Drift de prix** | Snapshot tarif au moment publication voyage Eventy. Alerte si écart > 10% à J-30. |
| **Token OAuth expiré** | Refresh automatique + alerte email Maison + équipe Eventy à J-7. |
| **Maison se désinscrit du PMS** | Détection via webhook OAuth revoke → désactive sync, switch en mode manuel, alerte équipe. |
| **API PMS down** | Fallback cache local 24h + alerte si > 1h. Mode dégradé en lecture seule. |
| **Conformité RGPD** | Tokens chiffrés (KMS). Audit log complet. DPO Eventy à informer pour chaque nouveau provider. |
| **Sécurité OAuth** | Scopes minimaux. Rotation secrets à 90 j. Vault pour secrets. |

---

## 10. Livraison branche `claude/practical-engelbart-cb2338`

**Code livré** :
- ✅ `frontend/lib/pms-integrations.ts` — types, catalogues providers, helpers statut
- ✅ `frontend/components/maisons/PmsConnectionCard.tsx` — composant card + drawer OAuth placeholder
- ✅ `frontend/app/(maisons)/maisons/integrations-pms/page.tsx` — hub catalogue
- ✅ `frontend/app/(maisons)/maisons/hebergement/integrations-pms/page.tsx` — connecteurs hôtels
- ✅ `frontend/app/(maisons)/maisons/restauration/integrations-pms/page.tsx` — connecteurs restos
- ✅ `frontend/app/(maisons)/maisons/activites/integrations-pms/page.tsx` — connecteurs activités
- ✅ `frontend/app/(equipe)/equipe/maisons-monitoring/page.tsx` — dashboard équipe
- ✅ Bandeau "Synchronisation PMS" ajouté à `/maisons` (dashboard) **sans rien casser**
- ✅ Entrées sidebar ajoutées à `/maisons/layout.tsx` (sections Hébergement / Restauration / Activités / Configuration)
- ✅ Entrée sidebar `/equipe/layout.tsx` (section Pôles métiers)
- ✅ Doc `AUDIT_HRA_MAISONS_PMS.md` (ce fichier)

**Code à venir (backend NestJS — phase suivante)** :
- `backend/src/modules/integrations/pms-hotels/` (Mews + Cloudbeds + Sirvoy)
- `backend/src/modules/integrations/pms-restos/` (ZenChef + TheFork)
- `backend/src/modules/integrations/pms-activites/` (Bokun + FareHarbor + Regiondo)
- Webhooks entrants
- Reconciliation cron

---

**Fin du document.**
