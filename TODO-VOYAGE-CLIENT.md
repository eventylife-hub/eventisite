# TODO — Fiche Voyage Client (Interface Immersive)

> Créé le 2026-04-25 · Après refonte complète de `frontend/app/(client)/client/voyage/[id]/page.tsx`

---

## ✅ Ce qui est codé (prêt)

- Hero parallax fullscreen + badge proximité dynamique
- Countdown animé J-XX avec barre de progression voyage
- Galerie photos avec carrousel + thumbnails
- Programme jour par jour (accordion)
- Section Hébergement (photos, étoiles, équipements)
- Section Restaurant (menu partenaire)
- Activités avec photos et durées
- Équipe terrain (profils, langues, expérience)
- Transport + comparaison proximité vs aéroport
- Météo estimée (7 jours)
- Check-list bagages interactive (cocher chaque item)
- Sécurité & Assurance (Pack Sérénité)
- Service Eventy (promesse)
- Gaming (si activé par créateur)
- Communauté (remplissage, seuil minimum)
- Avis voyageurs
- CTA final avec récapitulatif prix
- Mode voyage actif (si en cours)
- Section "Merci" post-retour

---

## 🔧 TODO — Intégrations API

### Priorité HAUTE

- [ ] **API `/client/bookings/:id`** — enrichir la réponse avec :
  - `gallery[]` — tableau d'URLs photos
  - `hotel` — objet complet (name, stars, image, amenities)
  - `restaurant` — objet (name, description, menuItems[])
  - `activities[]` — tableau activités avec images
  - `team[]` — équipe terrain avec photos
  - `pickupStop` — arrêt de ramassage avec `distanceKm` (calculé côté serveur selon GPS client)
  - `nearestAirportKm` — calculé depuis base aéroports
  - `weather[]` — intégrer API météo (OpenWeatherMap ou wttr.in)
  - `reviews[]` — avis voyageurs précédents
  - `packingList[]` — générée par le créateur ou par défaut
  - `gamingEnabled` — flag depuis settings créateur

- [ ] **Géolocalisation client** — calculer `distanceKm` arrêt/client
  - Demander permission GPS côté client
  - Fallback : code postal de l'adresse de facturation
  - API `/client/pickup-stops/nearest?lat=&lng=` → retourner les 3 arrêts les plus proches avec distance

- [ ] **Badge "Départ près de chez vous"** — afficher si `distanceKm <= 10`

---

## 🗺️ TODO — Carte Interactive

- [ ] Intégrer **Mapbox GL JS** (ou Leaflet + OpenStreetMap pour éviter les coûts Google)
  - Afficher arrêt de ramassage (pin or)
  - Afficher position client (pin bleu)
  - Afficher trajet bus (ligne pointillée)
  - Afficher destination + points d'intérêt
  - Afficher points de RDV préparés par le créateur
  - Cercle de rayon autour de l'arrêt (5km)
  - Mobile : touch/pinch zoom

- [ ] **Filtre voyages par distance** dans la liste
  - Trier par "les plus proches en premier"
  - Slider 0-50 km

---

## 🎬 TODO — Animations & UX

- [ ] **Vidéo hero** — si `coverVideoUrl` fourni, lire en autoplay muted loop
- [ ] **Parallax avancé** — sections avec `useTransform` scroll sur photos HRA
- [ ] **Confettis** au chargement si statut CONFIRMED pour la 1re fois (localStorage flag)
- [ ] **Notification push** J-30, J-7, J-1 avant départ

---

## 🎮 TODO — Gaming

- [ ] Connecter aux vraies données d'énergie/défis du système gaming
- [ ] Afficher les défis spécifiques au voyage (créés par le créateur)
- [ ] Classement en temps réel des voyageurs sur ce voyage
- [ ] Points d'énergie gagnés à chaque activité cochée

---

## 📱 TODO — Mobile

- [ ] **Swipe gesture** sur galerie (TouchEvent)
- [ ] **PWA** : installer l'app depuis la fiche voyage
- [ ] **Mode hors-ligne** : mettre en cache la fiche + programme (Service Worker)
- [ ] **Share API** native mobile pour partager la fiche

---

## 🌦️ TODO — Météo

- [ ] Intégrer API météo réelle (wttr.in gratuit ou OpenWeather)
- [ ] Afficher prévisions J+30 (estimations saisonnières si trop tôt)
- [ ] Alertes météo : "Semaine du voyage : risque de pluie J3"

---

## 💬 TODO — Communauté

- [ ] Afficher avatars des voyageurs inscrits (avec consentement)
- [ ] Widget "Qui vient ?" avec noms/prénoms opt-in
- [ ] Lien direct vers chat de groupe filtré par voyage
- [ ] "Trouvez des voyageurs near you" — matching géo

---

## 📄 TODO — Documents

- [ ] Lien vers section documents (billets, vouchers, assurance)
- [ ] Download PDF du programme
- [ ] QR code check-in bus

---

## Notes architecture

```
frontend/app/(client)/client/voyage/[id]/
├── page.tsx          ✅ Refonte complète
├── checklist/        ✅ Existant
├── bus-programme/    ✅ Existant
├── assurance/        ✅ Existant
├── chat/             ✅ Existant
├── mode-voyage/      ✅ Existant
└── ...
```

L'interface est en **mode démo** tant que l'API ne retourne pas les nouveaux champs.
La page se dégrade gracieusement : chaque section n'est rendue que si la donnée existe.
