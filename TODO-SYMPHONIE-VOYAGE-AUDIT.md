# TODO — Audit Symphonie Création de Voyage (frontend)

**Date** : 2026-04-26
**Périmètre** : `frontend/app/(pro)/pro/voyages/nouveau/` + `components/assistant/`
**Verdict global** : **~80% complète** — architecture solide, types complets, mais chaînage HRA → programme → prix partiellement implémenté.

---

## Synthèse score par point

| # | Point fonctionnel | Score | Manques majeurs |
|---|-------------------|-------|-----------------|
| 1 | Infos voyage | 70% | description, slug/SEO, photos hero |
| 2 | Arrêts bus ramassage (occurrents) | 85% | type PORT, mode transferts/ramassage explicite |
| 3 | HRA Hôtel | 60% | check-in/out, modale custom, flag breakfast inclus |
| 4 | Restaurants | 55% | lien hôtel↔resto, 2ème choix, UI resto par arrêt bus |
| 5 | Bus sur place | 95% | OK |
| 6 | Activités | 65% | liens arrêts bus, flag créateur/partenaire |
| 7 | Programme jour par jour | 60% | génération intelligente, DayHRASelector, calendrier |
| 8 | Calculateur prix | 80% | activités payantes, tarif guide, Pack Sérénité visible |
| 9 | Équipe terrain | 95% | OK (rôles complets, tarifs, dispos) |
| 10 | Devis transport auto | 50% | API réelle, itinéraire km, lien arrêts→circuit |

---

## TODOs détaillés (ordre de priorité)

### P0 — Bloquants MVP

#### TODO-1 — Check-in / Check-out hôtel manquant
- **Fichier** : `EtapeAccommodation.tsx`, interface `HotelEntry`
- **Action** : ajouter `checkInTime: string` (HH:mm) et `checkOutTime: string` (HH:mm)
- **UI** : 2 inputs heure dans le panneau de configuration de l'hôtel sélectionné
- **Lien** : reflow auto vers `EtapeProgram` (J1 = check-in, JN = check-out)

#### TODO-2 — UI hôtel custom (fallback hors HRA)
- **Fichier** : `EtapeAccommodation.tsx`
- **Action** : modale "Ajouter un hôtel hors catalogue" avec champs : nom, adresse, GPS, prix/nuit/pax, services[], photos[]
- **Trigger** : bouton "Hôtel hors HRA" sous la liste filtrée
- **Stocker** : `formData.selectedHotelId === 'custom'` + `formData.customHotel`

#### TODO-3 — Lien hôtel ↔ restaurant
- **Fichier** : `EtapeRestoration.tsx`, interface `RestaurantEntry`
- **Action** : ajouter `linkedHotelId?: string` + UI badge "Resto de l'hôtel sélectionné"
- **Auto** : quand on choisit un hôtel HRA avec resto associé, pré-cocher ce resto dans `EtapeRestoration`

#### TODO-4 — Activités payantes manquantes du calcul prix
- **Fichier** : `EtapePricing.tsx` (cascade)
- **Action** : ajouter ligne "Activités optionnelles (jusqu'à +X €/pax)" basée sur `standaloneActivities[].optionalPriceCents` quand `inclusionMode === 'OPTIONAL'`
- ✅ **DÉJÀ PRÉVU** dans `VoyagePriceCalculator.tsx` (assistant) — reporter dans `EtapePricing.tsx` officiel

#### TODO-5 — Tarif guide / accompagnateur intégré au prix
- **Fichier** : `EtapePricing.tsx` + `marginDefaults.ts`
- **Action** : créer une catégorie `EQUIPE_TERRAIN` dans `categoryTotals` qui agrège `formData.equipe[].dailyRate * assignedDays` et l'ajoute à la cascade
- **Lien** : `EtapeEquipe.tsx` calcule déjà `cost = dailyRate * assignedDays` (ligne 501) — il faut juste reporter dans `marginConfig`

### P1 — Importants

#### TODO-6 — Type d'arrivée PORT
- **Fichier** : `EtapeBusStops.tsx`, constante `ARRIVAL_MODES`
- **Action** : ajouter `{ value: 'PORT', label: 'Port maritime', icon: 'Anchor' }`
- **Lien** : champ `attachedPortName?: string` dans `TransportStop`

#### TODO-7 — Distinction transferts ⇄ ramassage régional
- **Fichier** : `EtapeBusStops.tsx`
- **Action** : flag `tripMode: 'TRANSFERTS' | 'RAMASSAGE_REGIONAL' | 'MIXTE'` au niveau du voyage
- **TRANSFERTS** = aéroport/gare/port ⇄ hôtel uniquement (pas de circuits collectifs)
- **RAMASSAGE_REGIONAL** = collecte multi-villes vers point d'embarquement

#### TODO-8 — Activités liées aux arrêts bus
- **Fichier** : `EtapeActivites.tsx` + `EtapeBusSurPlace.tsx`
- **Action** : ajouter `linkedBusStopId?: string` dans `StandaloneActivity`
- **UI** : sélecteur "Cet arrêt fait partie de quel circuit ?" lors de l'ajout d'activité
- **Affichage** : dans la timeline programme, regrouper activités par arrêt

#### TODO-9 — Flag créateur vs partenaire pour activités
- **Fichier** : `EtapeActivites.tsx`, interface `StandaloneActivity`
- **Action** : ajouter `providerType: 'CREATOR' | 'HRA_PARTNER' | 'EXTERNAL'`
- **UI** : badge "Faite par toi" (créateur) vs "Partenaire HRA" vs "Externe"
- **Impact pricing** : si CREATOR → marge créateur boostée

#### TODO-10 — DayHRASelector incomplet (resto/hôtel par jour)
- **Fichier** : `DayHRASelector.tsx`
- **Action** : compléter UI pour exposer choix `lunchRestaurantId`, `dinnerRestaurantId` par jour (types existent dans `DayHRAConfig`)
- **Cas d'usage** : voyage 7 jours avec resto différent chaque soir

#### TODO-11 — Génération auto programme intelligente
- **Fichier** : `VoyageProgramAutoBuilder.tsx` (assistant) + `EtapeProgram.tsx`
- **Action** : injecter automatiquement :
  - Petit-déj selon `mealConfig.breakfast`
  - Déjeuner / dîner selon resto sélectionné
  - Activités incluses du `standaloneActivities` (vraies, pas démo)
  - Check-in/out aux dates correctes
- ✅ Partiellement fait dans assistant — étendre avec mealConfig

### P2 — Importants mais non bloquants

#### TODO-12 — Devis transport API réelle
- **Fichier** : `EtapeFournisseurs.tsx`
- **Action** : remplacer `simulateReceiveQuote()` par appel `POST /api/pro/transport/devis-request` (backend NestJS module `transport`)
- **Backend** : créer endpoint qui broadcast vers transporteurs partenaires (queue email + dashboard)

#### TODO-13 — Itinéraire kilométrique
- **Fichier** : `EtapeFournisseurs.tsx` ou nouveau `VoyageRouteEstimator.tsx`
- **Action** : calculer km total depuis arrêts ramassage → destination → tournées sur place → retour
- **API** : OpenRouteService ou Google Directions
- **Affichage** : km par jour, cumul, coût carburant estimé

#### TODO-14 — Champ description/accroche voyage
- **Fichier** : `EtapeInfo.tsx`
- **Action** : ajouter textarea `description` (max 500 char) + champ `tagline` (accroche 80 char)
- **Suggestion** : générer auto via title + destination + dates

#### TODO-15 — Slug/SEO/Photos hero
- **Fichier** : `EtapeInfo.tsx` ou `EtapeMedias.tsx`
- **Action** : 
  - `slug` auto-généré depuis titre (kebab-case)
  - `seoKeywords[]` (tags)
  - `heroImageUrl` upload (Cloudinary ou S3)

#### TODO-16 — Petit-déjeuner inclus flag explicite
- **Fichier** : `EtapeAccommodation.tsx`, interface `HotelEntry`
- **Action** : `breakfastIncluded: boolean` (au lieu d'un texte dans `services[]`)
- **Déjà implicite** dans config Eventy (FULL_BOARD par défaut) — formaliser

#### TODO-17 — Pack Sérénité prix client visible
- **Fichier** : `EtapePricing.tsx` + `VoyagePriceCalculator.tsx`
- **Action** : afficher `clientPricePerPaxCents` (ex: "+35 €/pax inclus") en plus du coût assureur

#### TODO-18 — UI 2ème choix resto (Phase 2)
- **Fichier** : `EtapeRestoration.tsx`
- **Action** : activer `PHASE_2_MULTI_PARTNERS_ENABLED = true` une fois la modélisation 1-2 restos par jour validée
- **UI** : permettre 2 choix resto par soir (vote client ou choix créateur)

#### TODO-19 — Affecter resto à arrêt bus
- **Fichier** : `EtapeRestoration.tsx`
- **Action** : compléter UI pour `availability: 'STOP_BASED'` + `stopDayIndex` — actuellement flag existe mais pas d'éditeur
- **UX** : dropdown "Sur quel arrêt de bus ?" lors de la sélection resto

### P3 — Nice to have

#### TODO-20 — Affichage timeline / calendrier programme
- **Fichier** : `EtapeProgram.tsx`
- **Action** : vue calendrier (FullCalendar ou custom)
- **Existant** : vue jour par jour seulement

#### TODO-21 — Capacité par arrêt ramassage
- **Fichier** : `EtapeBusStops.tsx`, interface `TransportStop`
- **Action** : ajouter `capacity?: number` pour gérer flux par point (utile si bus mutualisé)

#### TODO-22 — Galerie photos hôtel inline
- **Fichier** : `EtapeAccommodation.tsx`
- **Action** : carousel d'images dans la carte hôtel sélectionné (déjà des `services` mais pas de visuels)

---

## Améliorations déjà appliquées (cette passe)

- ✅ `VoyagePriceCalculator.tsx` (assistant) : déjà capture les activités optionnelles via `optionalActivitiesCents`
- ✅ `VoyageProgramAutoBuilder.tsx` (assistant) : déjà gère J1=arrivée, JN=retour, avec petit-déj/déjeuner/dîner
- ✅ Cascade marges 82/18 correctement appliquée TRANSPORT uniquement (HRA = 25/15/10/50)

## Prochaines actions recommandées

1. **Sprint P0** (1 semaine) : TODO-1 à TODO-5 (fix bloquants prix + hôtel custom)
2. **Sprint P1** (1 semaine) : TODO-6 à TODO-11 (compléter HRA + activités + programme)
3. **Sprint P2** (1 semaine) : TODO-12 à TODO-19 (devis + SEO + UI restos)
4. **Sprint P3** : TODO-20 à TODO-22 (calendrier + capacités + galeries)

---

## Référence types existants (types.ts)

`TravelFormData` couvre déjà :
- Dates : `startDate`, `endDate`
- Transport : `stops`, `transportMode`, `transportPool`, `routes`, `busOnSite`
- Hébergement : `selectedHotelId`, `backupHotelId1/2`, `rooms`
- Restauration : `mealConfig`, `selectedRestaurantId`, `weeklyMealPlan`
- Activités : `standaloneActivities`, `selectedActivityIds`
- Programme : `program` (DayProgram[])
- Capacité : `capacity`, `minimumPassengers`
- Marges : `marginConfig`, `costConfig`
- Multi-voyage : `voyageCount`, `voyageConfigs`

→ La couche données est solide ; les manques sont surtout côté UI et orchestration.
