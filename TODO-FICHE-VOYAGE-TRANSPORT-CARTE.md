# TODO — Fiche Voyage : Transport & Carte Interactive
> Portails concernés : `(public)/public/voyages/[slug]/` · `(client)/client/reservations/[id]/` · `(pro)/pro/voyages/[id]/` · App mobile  
> Dépendances : Google Maps JS API ou Mapbox GL JS  
> Date : 2026-04-25

---

## Vision — Le Transport est une Grande Force Eventy

> **Message clé** : "On vient te chercher chez toi, on te ramène. Zéro parking, zéro stress, zéro galère."
>
> C'est LA différence d'Eventy vs un voyage classique :  
> Le client monte dans le bus à 2 rues de chez lui et descend à l'hôtel. C'est tout.  
> La carte doit lui faire **ressentir le voyage avant même d'y être**.

---

## Sections à créer / enrichir par page

| Page | Section transport | Section carte | Priorité |
|------|-------------------|---------------|----------|
| Fiche vente publique `(public)` | ✅ Accroche + arrêts | ✅ Carte interactive | P0 |
| Fiche client après achat `(client)` | ✅ Détail complet + horaires | ✅ Carte enrichie + waypoints | P0 |
| Portail créateur `(pro)` | ✅ Config arrêts + horaires | ✅ Éditeur waypoints | P0 |
| App mobile `(client)` | ✅ Arrêt le + proche, GPS | ✅ Map full-screen | P0 |

---

## PARTIE 1 — Section Transport sur la Fiche Vente Publique

> Route : `frontend/app/(public)/public/voyages/[slug]/page.tsx`  
> Ajout d'une grande section "Votre voyage commence ici"

### Maquette — Section Transport (page vente)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🚌 VOTRE VOYAGE COMMENCE ICI                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  Pas de parking aéroport. Pas de gare à trouver.                │
│  On vient vous chercher près de chez vous.                      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │         [ CARTE GOOGLE MAPS INTÉGRÉE ]                   │  │
│  │                                                           │  │
│  │   🔴 Paris 16e — Porte d'Auteuil   07:00                │  │
│  │   🔴 Paris 15e — Gare Montparnasse 07:20                │  │
│  │   🔴 Paris 13e — Place d'Italie    07:35                │  │
│  │   🔴 Paris 12e — Nation            07:50                │  │
│  │   🔴 Orly Aéroport                 08:30                │  │
│  │                          ──────────────                  │  │
│  │   ✈️  DESTINATION : MARRAKECH                            │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  LES ARRÊTS DE RAMASSAGE                                         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          │
│  │ 🔴 07:00      │ │ 🔴 07:20      │ │ 🔴 07:35      │          │
│  │ Paris 16e     │ │ Paris 15e     │ │ Paris 13e     │          │
│  │ Porte Auteuil │ │ Gare Montpar. │ │ Pl. d'Italie  │          │
│  │ [📍 Voir map] │ │ [📍 Voir map] │ │ [📍 Voir map] │          │
│  └───────────────┘ └───────────────┘ └───────────────┘          │
│  [+ 2 autres arrêts →]                                           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ✅ Zéro parking aéroport (économisez 80-120€)            │  │
│  │  ✅ Zéro stress de la navigation                          │  │
│  │  ✅ Bus confort avec WiFi et prises USB                   │  │
│  │  ✅ Retour inclus : mêmes arrêts, même confort            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  [Voir mon arrêt le plus proche 📍]   → ouvre Google Maps       │
└─────────────────────────────────────────────────────────────────┘
```

**Interactivité** : click sur arrêt → ouvre mini-map centrée sur l'arrêt, bouton "Itinéraire depuis chez moi" → Google Maps  
**Framer Motion** : scroll-reveal section, slide-in des arrêts en cascade, marqueurs map animés  
**Message éditorial** : "Votre voyage commence ici" → émotion avant même d'acheter

---

### Maquette — Bus SUR PLACE (liberté totale)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🚌 UN BUS POUR VOUS SUR PLACE                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  Pas de taxi à héler, pas de métro à comprendre.                │
│  Votre bus est là, à votre disposition, tout le séjour.         │
│                                                                   │
│  [ CARTE MARRAKECH — Points circuits préparés par le créateur ] │
│                                                                   │
│  CIRCUITS PRÉVUS SUR PLACE                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🌄 J+1 — Excursion Atlas (9h00-18h00)                    │   │
│  │ 🏙️ J+2 — Médina & Souks (14h30-17h30)                   │   │
│  │ 🌴 J+3 — Palmeraie (10h00-13h00)                        │   │
│  │ 🎭 J+3 — Retour pour soirée gala (18h30)                │   │
│  │ [Voir tous les circuits →]                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ✅ Le créateur a préparé chaque trajet en avance               │
│  ✅ Vous n'avez qu'à monter dans le bus                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 2 — Carte Interactive détaillée (Page Client après achat)

> Route : `frontend/app/(client)/client/reservations/[id]/page.tsx`  
> Section enrichie : client a acheté → voit TOUT en détail

### Maquette — Carte complète post-achat

```
┌─────────────────────────────────────────────────────────────────┐
│  🗺️ VOTRE VOYAGE EN CARTE                    [Plein écran ⛶]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [ CARTE GOOGLE MAPS / MAPBOX FULL WIDTH ~400px ]               │
│                                                                   │
│  Légende :                                                        │
│  🔴 Arrêts de ramassage   🏨 Votre hôtel                        │
│  🧭 Points d'intérêt      🍽️ Restaurants   🎯 Activités         │
│  📸 Spots photo           🎭 Soirées        🚌 Circuits bus      │
│                                                                   │
│  [Tous] [Ramassage] [Hôtel] [Circuits] [Points d'intérêt]       │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📍 MON ARRÊT                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔴 Paris 15e — Gare Montparnasse                         │   │
│  │ Bd du Montparnasse, 75015 Paris                          │   │
│  │ Départ : 07:20 — Soyez là 5 min avant                   │   │
│  │                                                           │   │
│  │ [📍 Voir sur Google Maps] [📅 Ajouter au calendrier]     │   │
│  │ [🧭 Itinéraire depuis chez moi]                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  🛤️ TRAJET ALLER — Samedi 3 mai                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 07:00 ● Paris 16e — Porte d'Auteuil                     │   │
│  │       │                                                   │   │
│  │ 07:20 ● Paris 15e — Gare Montparnasse  ← VOTRE ARRÊT   │   │
│  │       │                                                   │   │
│  │ 07:35 ● Paris 13e — Place d'Italie                      │   │
│  │       │                                                   │   │
│  │ 07:50 ● Paris 12e — Nation                              │   │
│  │       │                                                   │   │
│  │ 08:30 ● Orly Aéroport T3                                │   │
│  │       │                                                   │   │
│  │ 11:45 ✈️ DÉCOLLAGE vol AF1234                            │   │
│  │       │                                                   │   │
│  │ 14:15 ✈️ ATTERRISSAGE Marrakech RAK                     │   │
│  │       │                                                   │   │
│  │ 15:00 🏨 Riad Yasmine — Check-in                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  🏨 VOTRE HÔTEL                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Riad Yasmine ⭐⭐⭐⭐  · Marrakech Médina                  │   │
│  │ Rue Riad Laarouss, Médina 40000 Marrakech                │   │
│  │                                                           │   │
│  │ [Photo hôtel]  [Voir sur map] [Street View]             │   │
│  │                                                           │   │
│  │ À proximité : Djemaa el-Fna (8 min à pied)              │   │
│  │              Souks (5 min à pied)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Maquette — Circuits sur place (Post-achat)

```
┌─────────────────────────────────────────────────────────────────┐
│  🚌 CIRCUITS SUR PLACE                                           │
│  Préparés par Jean-Pierre, votre organisateur                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  DIMANCHE 4 MAI — Excursion Atlas                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [ MINI-CARTE : trajet Marrakech → Atlas ]                │   │
│  │                                                           │   │
│  │ 09:00 🚌 Départ Riad Yasmine                             │   │
│  │ 10:30 ⛰️ Vallée de l'Ourika — Premier arrêt              │   │
│  │       ↳ 🥾 Randonnée 1h30 (optionnel)                    │   │
│  │       ↳ 🍽️ Déjeuner Auberge Toubkal (inclus)            │   │
│  │ 14:30 📸 Point panoramique — Photos                      │   │
│  │ 16:00 🛍️ Coopérative femmes artisanes                    │   │
│  │ 18:00 🚌 Retour Riad Yasmine                              │   │
│  │                                                           │   │
│  │ Durée : 9h · Distance : 65km aller                       │   │
│  │ Guide : Mohammed B. ⭐4.9 · Transport : Bus AC            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  LUNDI 5 MAI — Médina & Souks                                    │
│  [ ... autre circuit ... ]                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 3 — Éditeur de carte pour le Créateur

> Route : `frontend/app/(pro)/pro/voyages/[id]/carte/page.tsx`  
> **À CRÉER** — page dédiée à la configuration du transport et des points d'intérêt

### Maquette — Interface créateur config carte

```
┌─────────────────────────────────────────────────────────────────┐
│  🗺️ Configuration Carte & Transport — Voyage Maroc Mai 2025     │
│                              [Aperçu client →] [Enregistrer ✓] │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────┐  ┌───────────────────┐  │
│  │                                    │  │ ONGLETS           │  │
│  │   [ CARTE INTERACTIVE ÉDITABLE ]  │  │ [🔴 Ramassage]    │  │
│  │                                    │  │ [🚌 Circuits]     │  │
│  │   Click = ajouter un marqueur     │  │ [📍 Waypoints]    │  │
│  │   Drag = déplacer                 │  │                   │  │
│  │   Click marqueur = éditer         │  │                   │  │
│  │                                    │  │                   │  │
│  └────────────────────────────────────┘  └───────────────────┘  │
│                                                                   │
│  ARRÊTS DE RAMASSAGE                            [+ Ajouter]     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔴 Paris 16e — Porte d'Auteuil            [✏️] [🗑️]    │   │
│  │    Adresse : Bd Exelmans, 75016                          │   │
│  │    Heure départ : [07:00]  Places disponibles : [12]    │   │
│  │    Ordre : [1] ↑↓                                        │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 🔴 Paris 15e — Gare Montparnasse          [✏️] [🗑️]    │   │
│  │    Adresse : Bd du Montparnasse, 75015                   │   │
│  │    Heure départ : [07:20]  Places disponibles : [15]    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [+ Ajouter un arrêt]  Rechercher adresse : [____________🔍]    │
│                                                                   │
│  ──────────────────────────────────────────────────────────────  │
│                                                                   │
│  TRANSPORT SUR PLACE — CIRCUITS                    [+ Circuit]  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Circuit 1 — Excursion Atlas (J+1)          [✏️] [🗑️]    │   │
│  │ 09:00 → 18:00 · 65km · 8 étapes configurées              │   │
│  │ [Éditer les étapes →]                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  INFORMATIONS TRANSPORT                                          │
│  Type de bus : [Grand tourisme ▾]  Capacité : [55 places]       │
│  Équipements : ☑ WiFi  ☑ Prises USB  ☑ Climatisation           │
│                ☑ Toilettes  ☐ Écrans embarqués                  │
│  Message perso : ["Pas de parking, pas de stress !__________"]  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Maquette — Éditeur de circuit (étapes)

```
┌─────────────────────────────────────────────────────────────────┐
│  ✏️ Éditer Circuit — Excursion Atlas (J+1)                      │
│                              [Aperçu] [Enregistrer]             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ÉTAPE 1                                      [🗑️ Retirer]│   │
│  │ Heure : [09:00]  Type : [🚌 Départ bus ▾]               │   │
│  │ Lieu : Riad Yasmine (auto-rempli depuis hôtel)           │   │
│  │ Description : ["Départ depuis le Riad, 5 min de marge"]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ÉTAPE 2                                      [🗑️ Retirer]│   │
│  │ Heure : [10:30]  Type : [⛰️ Arrêt activité ▾]           │   │
│  │ Lieu : [Vallée de l'Ourika___________________🔍]         │   │
│  │ Description : ["Vallée magnifique, idéale pour randon..."]│   │
│  │ Photo : [Uploader photo du lieu 📷]                      │   │
│  │ Durée sur place : [90 min]                               │   │
│  │ Activité optionnelle : ☑ Oui — [Randonnée 1h30]         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [+ Ajouter une étape]                                           │
│                                                                   │
│  Types d'étapes disponibles :                                    │
│  🚌 Départ/Arrivée bus  ⛰️ Arrêt activité  🍽️ Repas            │
│  📸 Point photo         🛍️ Shopping        🎭 Soirée             │
│  🏖️ Plage/Nature        🏛️ Culturel        🆓 Temps libre       │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 4 — Points de Rendez-vous / Waypoints créateur

> Composant : `TripWaypointCard` · visible sur carte + liste

### Structure données Waypoint

```typescript
interface Waypoint {
  id: string
  type: WaypointType
  nom: string
  description: string          // Court (100 chars max) affiché carte
  descriptionLongue?: string   // Affiché dans la modale détail
  horaire?: string             // Ex: "20:30 — libre" ou "obligatoire"
  estObligatoire: boolean      // Marqué différemment sur la carte
  photos: string[]             // URL photos
  coordonnees: { lat: number, lng: number }
  adresse: string
  lienGoogleMaps?: string
  lienReservation?: string     // Pour restos avec réservation conseillée
  prixEstime?: string          // "~15€/pers" pour info
  noteCreateur?: string        // Message perso du créateur
  tags: string[]               // ['vue panoramique', 'incontournable', 'soirée']
  jour?: number                // Jour du voyage (1-7)
}

type WaypointType =
  | 'hotel'
  | 'restaurant'
  | 'bar'
  | 'activite'
  | 'photo-spot'
  | 'shopping'
  | 'culturel'
  | 'transport'
  | 'rendez-vous'
  | 'libre'
```

### Maquette — Waypoint Card sur la carte (popup)

```
┌────────────────────────────────────────┐
│ [Photo du lieu]                         │
│ 🍽️ Déjeuner Auberge Toubkal            │
│ ⭐ Recommandé par Jean-Pierre            │
│ "Vue imprenable sur l'Atlas, tajine    │
│  maison exceptionnel. Réservez !"      │
│                                         │
│ 📅 J+1 · 12:30  ~25€/pers              │
│                                         │
│ [📍 Itinéraire]  [Voir plus]           │
└────────────────────────────────────────┘
```

### Maquette — Page waypoints sur fiche client (liste complète)

```
┌─────────────────────────────────────────────────────────────────┐
│  📍 POINTS D'INTÉRÊT — Préparés par votre créateur              │
│  Jean-Pierre a sélectionné les meilleurs spots de Marrakech     │
│                                                                   │
│  [Tous] [Restau] [Bars] [Activités] [Photos] [Shopping]         │
│                                                                   │
│  INCONTOURNABLES                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [Photo]  🌅 Djemaa el-Fna au coucher de soleil           │   │
│  │          ⭐ INCONTOURNABLE                                │   │
│  │          "La place la plus magique du monde. Arrivez      │   │
│  │           vers 18h30 pour la lumière parfaite."          │   │
│  │          📅 Tous les soirs · Libre · Gratuit              │   │
│  │                     [📍 Voir sur carte] [Partager]       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ [Photo]  🍽️ Auberge Toubkal — Déjeuner Atlas             │   │
│  │          ⭐ INCLUS J+1                                    │   │
│  │          "Vue époustouflante. Tajine maison incroyable." │   │
│  │          📅 J+1 · 12:30 · Inclus dans le voyage          │   │
│  │                     [📍 Voir sur carte]                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  SUGGESTIONS RESTO (libres)                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [Photo]  🍽️ Café des Épices — Terrasse Médina             │   │
│  │          "Idéal pour le déjeuner, vue sur la Médina.     │   │
│  │           Commandez le pastilla !"  ~20€/pers            │   │
│  │          [📍 Map] [🔗 Réserver sur TheFork]              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 5 — Carte sur App Mobile

> Route : `(client)/client/voyages/[id]/carte/page.tsx`  
> Carte full-screen avec bottom sheet pour les détails

```
📱
┌──────────────────────────────────────┐
│  [ CARTE FULL SCREEN ]               │
│                                      │
│  🔴 Mon arrêt       🏨 Mon hôtel    │
│  🧭 Waypoints        🚌 Bus          │
│  📸 Spots photo                      │
│                                      │
│  [Tous] [Arrêt] [Hôtel] [Circuits]  │
│                                      │
│  ──────────────── bottom sheet ────  │
│  ↑ Tirer pour voir la liste          │
│                                      │
│  📍 MON ARRÊT — AUJOURD'HUI          │
│  Paris 15e · Gare Montparnasse       │
│  Départ : 07:20 (dans 6h)            │
│  [🧭 Itinéraire] [📅 Calendrier]    │
│                                      │
│  PROCHAIN CIRCUIT                    │
│  🚌 Excursion Atlas — J+1 9h00      │
│  [Voir détails]                      │
└──────────────────────────────────────┘
```

---

## Composants à créer

### `TripTransportSection.tsx`
```tsx
// frontend/components/trip/TripTransportSection.tsx
// Section "Votre voyage commence ici" sur la page vente
interface Props {
  arrets: ArretRamassage[]
  busEquipements: string[]
  messageCreateur?: string
  context: 'vente' | 'client'  // client = horaires précis + numéro bus
}
```

### `TripMapInteractive.tsx`
```tsx
// frontend/components/trip/TripMapInteractive.tsx
// Carte interactive Google Maps / Mapbox
interface Props {
  arrets?: ArretRamassage[]      // Marqueurs rouges ramassage
  hotel?: HotelInfo              // Marqueur hôtel
  waypoints?: Waypoint[]         // Points d'intérêt créateur
  circuits?: Circuit[]           // Tracés des circuits bus
  userArret?: string             // Pour highlighter l'arrêt du client
  mode: 'preview' | 'full' | 'mobile-fullscreen'
  filtreActif?: WaypointType[]
}
```

### `WaypointCard.tsx`
```tsx
// frontend/components/trip/WaypointCard.tsx
// Card d'un point d'intérêt (liste + popup map)
interface Props {
  waypoint: Waypoint
  variant: 'map-popup' | 'list-card' | 'compact'
  showCreatorNote?: boolean
}
```

### `TripTimelineTransport.tsx`
```tsx
// frontend/components/trip/TripTimelineTransport.tsx
// Timeline verticale du trajet aller/retour avec arrêts
interface Props {
  arrets: ArretRamassage[]
  vol?: FlightInfo
  hotel: HotelInfo
  highlightArret?: string       // Arrêt du client en surbrillance
}
```

---

## Bibliothèque de cartographie — Choix technique

### Option A — Google Maps JavaScript API
```
✅ Familier pour les clients (même interface que Google Maps)
✅ Street View intégrable
✅ Places API pour autocomplétion adresses
✅ Directions API pour calcul itinéraires
⚠️ Facturation à l'usage (attention coûts)
⚠️ Nécessite clé API avec restrictions domaine
```

### Option B — Mapbox GL JS
```
✅ Gratuit jusqu'à 50 000 chargements/mois
✅ Personnalisable visuellement (style dark/gold)
✅ Performant (WebGL)
✅ Open source
⚠️ Moins reconnu par les clients
⚠️ Intégration itinéraires plus complexe
```

### Option C — React Leaflet (OpenStreetMap)
```
✅ 100% gratuit et open source
✅ Pas de clé API
⚠️ Cartes moins belles
⚠️ Moins de fonctionnalités avancées
```

> **Recommandation** : **Mapbox GL JS** pour les cartes principales (style premium personnalisable, coûts maîtrisés) + lien direct **Google Maps** pour les itinéraires client ("Itinéraire depuis chez moi").

---

## Structure données backend

```
GET /api/voyages/:id/transport
  → { arrets, circuits, busInfo }

GET /api/voyages/:id/waypoints
  → { waypoints[] } — filtrable par type/jour

POST /api/voyages/:id/arrets          (créateur)
PUT  /api/voyages/:id/arrets/:arretId (créateur)
DELETE /api/voyages/:id/arrets/:id    (créateur)

POST /api/voyages/:id/waypoints       (créateur)
PUT  /api/voyages/:id/waypoints/:id   (créateur)
DELETE /api/voyages/:id/waypoints/:id (créateur)

POST /api/voyages/:id/circuits        (créateur)
PUT  /api/voyages/:id/circuits/:id    (créateur)
```

---

## Pages à créer / modifier — Récapitulatif

| Fichier | Statut | Action |
|---------|--------|--------|
| `(public)/public/voyages/[slug]/page.tsx` | Existant | Ajouter `TripTransportSection` + `TripMapInteractive` |
| `(client)/client/reservations/[id]/page.tsx` | Existant | Ajouter sections transport + circuits + waypoints |
| `(pro)/pro/voyages/[id]/carte/page.tsx` | **À CRÉER** | Éditeur carte + arrêts + circuits |
| `(client)/client/voyages/[id]/carte/page.tsx` | **À CRÉER** | Map mobile full-screen |
| `components/trip/TripTransportSection.tsx` | **À CRÉER** | Composant section transport |
| `components/trip/TripMapInteractive.tsx` | **À CRÉER** | Composant carte interactive |
| `components/trip/WaypointCard.tsx` | **À CRÉER** | Card point d'intérêt |
| `components/trip/TripTimelineTransport.tsx` | **À CRÉER** | Timeline arrêts/trajet |

---

## Notes d'implémentation

- Clé Mapbox/Google Maps → variable d'env `NEXT_PUBLIC_MAPBOX_TOKEN` ou `NEXT_PUBLIC_GMAPS_KEY`
- Carte lazy-loaded (ne charge pas si hors viewport) → `IntersectionObserver` ou `next/dynamic`
- Marqueurs SVG custom : or `#D4A853` pour les arrêts Eventy, blanc pour waypoints
- Sur mobile : carte plein écran avec `position: fixed`, bottom sheet drawer
- Framer Motion sur markers (pop-in animé) et bottom sheet
- Apostrophes dans JSX : `&apos;` — dans JS : `'` normal
- Arrêts de ramassage : l'adresse exacte n'est montrée au client QU'APRÈS l'achat confirmé (anti-scraping)
