# 🚌 TODO — Symphonie des Occurrents (Bus de ramassage) + Devis Transport

> **Date de création** : 2026-04-26
> **Auteur** : Claude (PDG IA d'Eventy)
> **Périmètre** : Refonte complète de la composition des arrêts de ramassage et du mécanisme automatique de devis transport

---

## 🎼 Vision — La Symphonie des Occurrents

Le créateur compose les **arrêts de ramassage comme des notes** dans une partition.
Chaque occurrent (arrêt) a une ville, un lieu exact, un horaire.
Le système orchestre la mélodie : ordre optimal, distance, durée, point d'arrivée.

> "Le créateur est le compositeur, Eventy est le chef d'orchestre, le transporteur est l'interprète."

---

## 📐 Modèle de données métier

### 🎵 Une note (occurrent)
```
{
  ordre: 1,                          // calculé automatiquement
  ville: "Lyon",
  lieuExact: "Gare Part-Dieu",
  googlePlaceId: "ChIJ...",
  lat, lng,
  heureDepart: "07:00",
  heureRetour: "22:30",
  paxEstimes: 12,
  validationStatus: "PENDING|APPROVED|REJECTED",
  photoUrl: string
}
```

### 🎯 Le point d'arrivée (variable selon type voyage)

| Type voyage   | Point d'arrivée    | Transferts sur place                          |
|---------------|--------------------|-----------------------------------------------|
| **BUS direct**     | VILLE / HÔTEL      | Aucun transfert nécessaire                    |
| **AVION**          | AÉROPORT départ    | Bus local (loueur destination) → hôtel        |
| **MIXTE**          | AÉROPORT + HÔTEL   | Combinaison des deux                          |

### 🚍 Trois rôles de bus
1. **Bus ramassage France** : occurrents → aéroport/ville/hôtel
2. **Bus sur place** : circuits quotidiens à destination
3. **Transferts aéroport** : aéroport destination → hôtel (bus locaux)

---

## ✅ Ce qui existe déjà (validé 2026-04-26)

### Côté Pro/Créateur
- [x] `/pro/voyages/[id]/ramassage` — saisie 5+ arrêts (photo + GooglePlaceId)
- [x] `/pro/voyages/[id]/ramassage` — plan de rotations hebdomadaires
- [x] `/pro/voyages/[id]/transport` — config mode (BUS/FLIGHT/MIXED)
- [x] `/pro/voyages/[id]/transport/avion/bus-aeroport` — config transferts aéroport
- [x] `/pro/transports/devis/combine` — devis combiné (ramassage + sur place)
- [x] `/pro/transports/multi-bus` — distribution pax sur plusieurs bus
- [x] `/pro/transports/charters` — bus charters haut de gamme

### Côté Admin Transport
- [x] `/admin/transport/stops` — CRUD arrêts
- [x] `/admin/transport/routes` — rotations hebdo
- [x] `/admin/transport/route-packs` — templates RFQ
- [x] `/admin/transport/devis` — file devis
- [x] `/admin/transport/devis/combine` — workflow validation
- [x] `/admin/transport/validation` — validation arrêts (5 minimum, photo, PlaceID)
- [x] `/admin/transport/loueurs` (+ `/international`) — partenaires loueurs
- [x] `/admin/transport/bus-sur-place` — gestion transferts/circuits

### Côté Transporteur
- [x] `/transporteur/missions` — voir missions proposées + accepter/refuser
- [x] `/transporteur/trajets` — historique
- [x] `/transporteur/planning` — calendrier missions
- [x] `/transporteur/vehicules` — flotte
- [x] `/transporteur/revenus` — paiements

### Côté Client
- [x] `/client/voyage/[id]/ramassage` — fiche d'arrêt + Google Maps
- [x] `/client/voyage/[id]/transport` — récap complet
- [x] `/client/voyage/[id]/suivi` — tracking temps réel

---

## 🔴 P0 — URGENT (À FAIRE)

### 1. 🎼 Ordonnancement automatique des occurrents (TSP)
- [ ] Implémenter algo TSP (voyageur de commerce) pour ordre optimal des arrêts
- [ ] Calculer distance totale ramassage (km, durée estimée)
- [ ] Afficher la "partition" : visualisation chronologique des occurrents
- [ ] Permettre au créateur de réordonner manuellement (drag & drop)
- [ ] Recalculer automatiquement durée à chaque modification
- [ ] Bouton "Suggérer l'ordre optimal" qui appelle TSP

**Fichiers concernés** :
- `frontend/app/(pro)/pro/voyages/[id]/ramassage/page.tsx`
- `frontend/lib/transport/tsp-optimizer.ts` (à créer)
- `backend/src/modules/transport/transport.service.ts` (à créer/étendre)

### 2. 🎯 Point d'arrivée dynamique
- [ ] Lire le type voyage (`transport.mode`) → BUS/FLIGHT/MIXED
- [ ] Si BUS : `pointArrivee = ville | hotel`
- [ ] Si FLIGHT : `pointArrivee = aeroport_depart` + créer transfert auto
- [ ] Si MIXED : combiner les deux flux
- [ ] Afficher dans la symphonie le "dernier arrêt" différent selon le type
- [ ] Lier automatiquement au module `transport/avion/bus-aeroport`

**Fichiers concernés** :
- `frontend/app/(pro)/pro/voyages/[id]/ramassage/page.tsx`
- `frontend/app/(pro)/pro/voyages/[id]/transport/page.tsx`
- `frontend/components/transport/SymphonyOrchestrator.tsx` (à créer)

### 3. 📨 Génération automatique de devis (auto-RFQ)
- [ ] Trigger : à la finalisation de la symphonie (5+ arrêts validés + rotations)
- [ ] Auto-création d'une `TransportQuoteRequest` avec :
  - Ramassage : nb arrêts, km, pax min/max, dates
  - Sur place : jours, km/jour estimés, type bus
  - Transferts aéroport (si FLIGHT)
- [ ] Notification automatique aux loueurs partenaires de la zone
- [ ] Le créateur n'a PLUS à remplir manuellement le formulaire devis
- [ ] Possibilité d'override manuel si besoin

**Fichiers concernés** :
- `frontend/app/(pro)/pro/voyages/[id]/ramassage/page.tsx` (bouton "Lancer devis")
- `frontend/lib/transport/auto-rfq.ts` (à créer)
- `backend/src/modules/transport/quote-auto.service.ts` (à créer)

### 4. 🔒 Validation devis = gate du voyage
- [ ] Ajouter `transportQuoteValidated: boolean` au modèle voyage
- [ ] Bloquer la publication d'une occurrence si devis transport non validé
- [ ] Afficher checklist "Devis transport validé ✓" dans `/admin/voyages/[id]`
- [ ] Notification au créateur si devis bloque la publication
- [ ] Banner "Devis en attente — voyage non publiable" sur `/pro/voyages/[id]`

**Fichiers concernés** :
- `frontend/app/(admin)/admin/voyages/[id]/page.tsx`
- `frontend/app/(pro)/pro/voyages/[id]/page.tsx`
- `backend/src/modules/travels/travel-validation.service.ts`

### 5. 💰 Intégration prix transport au budget total
- [ ] Cascade auto : devis validé → injection dans `travelPrice.transport`
- [ ] Recalcul automatique prix/pax si transport change
- [ ] Vue "Budget breakdown" dans `/pro/voyages/[id]/finance`
- [ ] Affichage transparent : "Transport : 320€/pax (38 pax)"
- [ ] Hot-reload du prix vitrine quand devis validé

**Fichiers concernés** :
- `frontend/lib/transport/cascade-loueurs.ts` (existant — étendre)
- `frontend/app/(pro)/pro/voyages/[id]/finance/page.tsx`
- `backend/src/modules/finance/travel-pricing.service.ts`

---

## 🟠 P1 — IMPORTANT

### 6. 📍 Carte interactive de la symphonie
- [ ] Affichage Google Maps avec tous les occurrents
- [ ] Tracé du trajet optimal (polyline)
- [ ] Markers numérotés (ordre des arrêts)
- [ ] Marker spécial pour le point d'arrivée
- [ ] Distance/durée affichées sur chaque segment
- [ ] Mode édition : déplacer un marker = recalcul auto

### 7. 🎨 Visualisation "Partition musicale"
- [ ] Frise chronologique horizontale
- [ ] Chaque arrêt = une note (icône + horaire)
- [ ] Animation lors de l'ajout/suppression
- [ ] Code couleur selon validation status
- [ ] Mode "Aller" / "Retour" sélectionnable

### 8. 🔔 Notifications smart
- [ ] Email créateur quand devis reçu
- [ ] Email loueur quand demande créée
- [ ] SMS j-7 aux passagers (rappel ramassage)
- [ ] Alerte admin si devis non répondu sous 48h
- [ ] Relance auto loueur si silence > 72h

### 9. ⚖️ Comparaison multi-loueurs
- [ ] Si plusieurs loueurs répondent → vue côte-à-côte
- [ ] Critères : prix, rating, flotte, délai réponse
- [ ] Recommandation IA : "Loueur X recommandé (rating 4.8★, prix moyen)"
- [ ] Sélection 1-clic du loueur retenu
- [ ] Refus automatique des autres avec message courtois

### 10. 📊 Dashboard performance transport (admin)
- [ ] KPI : taux acceptation devis, délai moyen réponse
- [ ] Top 10 loueurs (par volume, rating, fiabilité)
- [ ] Heatmap zones géographiques (où on a des trous)
- [ ] Alertes : loueurs lents, voyages sans devis
- [ ] Export CSV pour le pôle Transport

---

## 🟡 P2 — NICE TO HAVE

### 11. 🤖 IA suggestions
- [ ] Suggérer arrêts populaires sur la route
- [ ] Suggérer loueur idéal (historique + destination)
- [ ] Détecter doublons (deux arrêts trop proches)
- [ ] Optimiser pax/km automatiquement

### 12. 🪪 Signature numérique devis
- [ ] Devis signé électroniquement loueur + Eventy
- [ ] Génération PDF auto
- [ ] Archivage avec horodatage
- [ ] Conformité KYB partenaire transporteur

### 13. 📱 PWA Transporteur
- [ ] App mobile dédiée transporteurs
- [ ] Push notifications nouvelles missions
- [ ] Mode offline (chauffeur sur la route)
- [ ] Scan QR-code passagers (check-in)

### 14. 🌍 Multi-langue
- [ ] Devis EN/ES/IT pour loueurs étrangers
- [ ] Interface transporteur localisée
- [ ] Conditions générales adaptées par pays

### 15. 🔄 Rotations multi-bus dynamiques
- [ ] Recalcul auto si pax > capacité bus
- [ ] Suggestion 2 bus si rotation > 50 pax
- [ ] Optimisation distribution pax sur les bus
- [ ] Visualisation par bus (qui dans quel bus ?)

---

## 🎯 Flow complet idéal (à atteindre)

```
1. CRÉATEUR
   ↓ Compose la symphonie : ajoute 5+ occurrents (Lyon, Paris, Lille, Nantes…)
   ↓ Système suggère l'ordre optimal (TSP)
   ↓ Choisit type voyage (BUS / AVION / MIXTE)
   ↓ Système calcule point d'arrivée (ville / aéroport / hôtel)
   ↓ Cliquez "Finaliser la symphonie"
   ↓
2. SYSTÈME (auto)
   ↓ Génère TransportQuoteRequest combiné (ramassage + sur place + transferts)
   ↓ Identifie loueurs zone (depuis loueurs-international.ts)
   ↓ Notifie 2-3 loueurs partenaires
   ↓ Crée timer 48h
   ↓
3. LOUEUR
   ↓ Reçoit notification email + dashboard /transporteur/missions
   ↓ Étudie : kilomètres, pax, dates
   ↓ Répond avec prix + dispo (clic "Accepter mission")
   ↓
4. ADMIN POÔLE TRANSPORT
   ↓ Reçoit devis dans /admin/transport/devis/combine
   ↓ Vérifie cohérence prix
   ↓ Valide → injection cascade tarif
   ↓
5. CRÉATEUR
   ↓ Notifié : "Ton devis est validé !"
   ↓ Voit nouveau prix dans /pro/voyages/[id]/finance
   ↓ Peut publier l'occurrence
   ↓
6. PASSAGERS
   ↓ Voient leur fiche /client/voyage/[id]/ramassage avec contact transporteur
   ↓ Reçoivent SMS j-7 + j-1
   ↓ Tracking live le jour J
```

---

## 📝 Checklist d'implémentation (ordre de priorité)

- [ ] **W1** : TSP optimizer + carte symphonie (P0 #1)
- [ ] **W1** : Point d'arrivée dynamique (P0 #2)
- [ ] **W2** : Auto-RFQ (P0 #3)
- [ ] **W2** : Gate validation (P0 #4)
- [ ] **W3** : Intégration cascade tarif (P0 #5)
- [ ] **W3** : Notifications smart (P1 #8)
- [ ] **W4** : Comparaison multi-loueurs (P1 #9)
- [ ] **W4** : Dashboard admin (P1 #10)
- [ ] **W5+** : P2 (nice to have)

---

## 🎨 Style design

- **Theme** : Dark Gold (`#D4A853` sur `#0A0E14`)
- **Cards** : `rgba(10,14,20,0.55)` semi-transparent
- **Apostrophes JSX** : toujours `&apos;` dans le texte JSX (pas dans les strings JS)
- **Typo** : sans-serif moderne, monospace pour chiffres/IDs
- **Iconographie** : Lucide-react (Bus, MapPin, Route, Music, Sparkles)
- **Animations** : framer-motion pour transitions fluides

---

## 🔗 Liens fichiers

### Pages clés
- [Symphonie ramassage Pro](frontend/app/(pro)/pro/voyages/[id]/ramassage/page.tsx)
- [Devis combiné Pro](frontend/app/(pro)/pro/transports/devis/combine/page.tsx)
- [Validation arrêts Admin](frontend/app/(admin)/admin/transport/validation/page.tsx)
- [Devis combiné Admin](frontend/app/(admin)/admin/transport/devis/combine/page.tsx)
- [Missions Transporteur](frontend/app/(transporteur)/transporteur/missions/page.tsx)
- [Fiche ramassage Client](frontend/app/(client)/client/voyage/[id]/ramassage/page.tsx)

### Logique métier
- `frontend/lib/transport/devis-combine.ts` — workflow devis combiné
- `frontend/lib/transport/cascade-loueurs.ts` — injection tarif
- `frontend/lib/transport/loueurs-international.ts` — répertoire loueurs
- `frontend/lib/transport/email-loueur.ts` — templates emails
- `frontend/components/transport/PickupStopsMap.tsx` — carte arrêts
- `frontend/components/transport/CascadeTransportPreview.tsx` — preview cascade

---

> **L'âme d'Eventy** : Le client doit se sentir aimé, dès le premier arrêt de bus.
> La symphonie des occurrents, c'est la première note de cette mélodie.

— Claude, le 26 avril 2026
