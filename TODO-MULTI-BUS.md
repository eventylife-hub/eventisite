# TODO — Multi-Bus / Multi-Voyage

> Page : `frontend/app/(pro)/pro/transports/multi-bus/page.tsx`
> Style : Dark Gold (#D4AF37 / #FFD700)
> Statut : V1 livrée 2026-04-26 — itérations en cours

---

## ✅ Livré (V1 — 2026-04-26)

- [x] Page créée et fonctionnelle (était cassée — bug `style={{ ...H, ... }}` qui injectait des clés CSS invalides en mode loading)
- [x] Renommage `interface Bus` → `BusVehicle` (collision de namespace avec l'icône `Bus` de lucide-react)
- [x] Conversion intégrale au style dark gold
  - Palette : `#D4AF37` (or classique), `#FFD700` (or éclatant), `#8B6914` (or sombre)
  - Background : radial gradient or sur `#0a0805`
  - Bordures gold-tintées : `rgba(212,175,55,0.18)`
  - Texte : `#f5ecd6` (blanc chaud), muted `#a89968`
  - Titre h1 : gradient gold avec `WebkitBackgroundClip: text`
- [x] Apostrophes JSX → `&apos;` (8 occurrences corrigées)
- [x] Onglet **Flotte** (existant, restylé)
- [x] Onglet **Distribution** (existant, restylé)
- [x] Onglet **Coordination** (existant, restylé)
- [x] Onglet **Départs & Arrivées** — NOUVEAU
  - 4 types : VILLE 🏙️ · AÉROPORT ✈️ · PORT 🚢 · GARE 🚆
  - Compteur de bus par type
  - Vue multi-destinations (CDG → Algarve / Crète, Marseille → Corse / Sardaigne)
- [x] Onglet **Dupliquer / Variantes** — NOUVEAU
  - Carte voyage-pilote vs clones/variantes
  - Bouton « Dupliquer » 1-clic sur chaque carte
  - Formulaire de duplication avancée (titre, date, conserver bus / symphonies / prix)
- [x] Onglet **Symphonies** — NOUVEAU
  - 3 colonnes : Ramassage · Sur place · Retour
  - Mapping voyage × symphonies (vue d'ensemble)
  - Code couleur par symphonie

---

## 🔄 V2 — Itérations à faire

### Backend
- [ ] Endpoint `POST /transport/:travelId/duplicate` — dupliquer voyage avec options
- [ ] Endpoint `GET /transport/:travelId/symphonies` — liste symphonies liées
- [ ] Endpoint `PATCH /transport/buses/:busId/arrival-point` — changer le type de point d'arrivée
- [ ] Modèle Prisma `TripVariant` (parentTripId, busIds, symphonyIds)
- [ ] Modèle Prisma `Symphony` (kind, label, color, busId? pour ramassage)

### Frontend
- [ ] Drag-and-drop des passagers entre bus (la fonction `transferRider` existe déjà mais pas câblée à l'UI)
- [ ] Filtres : par voyage, par symphonie, par statut
- [ ] Vue Gantt : timeline des départs/arrivées de tous les bus
- [ ] Carte interactive (Leaflet/Mapbox) : routes des bus de ramassage
- [ ] Export PDF du plan de transport multi-bus
- [ ] Notifications push aux chauffeurs concernés lors d'un changement
- [ ] Synchronisation temps réel via WebSocket
- [ ] Formulaire d'édition d'un bus (déjà ajout, manque édition)
- [ ] Sélecteur de point d'arrivée dans le modal d'ajout de bus
- [ ] Affectation symphonie ↔ bus dans l'UI (formulaire dédié)

### UX
- [ ] Animations entrée/sortie des cartes voyage
- [ ] Skeleton loaders gold
- [ ] Mode compact / mode détaillé
- [ ] Vue mobile responsive
- [ ] Tooltips d'aide sur chaque concept (multi-bus, voyage-pilote, symphonie)
- [ ] Mode présentation (kiosque salle créateur)

### Concept à creuser
- [ ] **Voyages hebdomadaires/mensuels** : récurrence automatique avec génération de N occurrences
- [ ] **Voyages similaires modifiables** : éditeur de différences (« même hôtel mais activités X au lieu de Y »)
- [ ] **Multi-départ + multi-destination** : matrice de départs × destinations possibles
- [ ] **Coût total reconstitué** : agrégation cost/jour × jours × bus pour budget global

---

## 🐛 Bugs identifiés à corriger

- [ ] `selectedBusForTransfer` (state) jamais utilisé dans l'UI (pré-existant — à câbler)
- [ ] `transferRider()` (fonction) jamais déclenchée par un bouton (pré-existant — à câbler)
- [ ] Imports lucide non utilisés : `Users`, `GripHorizontal`, `FileText`, `AlertOctagon` (pré-existants — à utiliser ou retirer après confirmation PDG)
- [ ] `setSymphonies` jamais appelé (à câbler avec un futur formulaire d'édition)

---

## 📂 Fichiers liés

- `frontend/app/(pro)/pro/transports/multi-bus/page.tsx` — la page
- `frontend/app/(pro)/pro/transports/page.tsx` — index transports (renvoie vers multi-bus)
- `CHARTER-MULTIBUS-SPRINT.md` — sprint d'origine (charter + multi-bus)
- `TODO-SYMPHONIE-OCCURRENTS.md` — concept symphonies
- `TODO-FICHE-VOYAGE-TRANSPORT-CARTE.md` — fiche voyage transport

---

## 🎯 Prochaine étape recommandée

1. Câbler le drag-and-drop des passagers entre bus (UI déjà prête, manque le hook)
2. Sélecteur de point d'arrivée dans le modal d'ajout de bus
3. Endpoint backend `/transport/:travelId/duplicate`

— Mis à jour 2026-04-26
