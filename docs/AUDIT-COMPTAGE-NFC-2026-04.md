# Audit Système Comptage Automatique — NFC / RFID / QR

> **Date** : 2026-04-19
> **Scope** : Technologies de comptage automatique clients (restauration, activités, gamification). Architecture système, comparatif technologique, roadmap, stubs pages.
> **Auteur** : David (PDG Eventy) — assisté IA
> **Statut** : Phase 2 — Préparation MVP · **Feature flags OFF en production**

---

## 0. TL;DR pour le PDG

- **Aucun code NFC/comptage existant** dans le repo aujourd'hui — `/maisons/bracelets` est un teaser Phase 2 (143 lignes, feature flag OFF)
- **`/admin/restauration`** a déjà un champ `guestCount` dans les déclarations manuelles — base à enrichir
- **Recommandation technologique** : **NFC HF 13.56 MHz (ISO 14443) comme principal + QR code comme fallback obligatoire**
- **Coût matériel estimé** : 1-3€/bracelet · 80-150€/lecteur partenaire (smartphone Android NFC ou lecteur dédié)
- **7 pages stubs créées** ce sprint : admin comptage × 3, maisons/comptage, pro/voyages/[id]/comptage, equipe/comptage (feature flags OFF)
- **ROI estimé** : réduction fraude déclaration manuelle de ~15%, économie ~2-4h/voyage d'admin réconciliation

---

## 1. État de l'existant — Inventaire code

### Ce qui existe déjà

| Fichier | Contenu | Lien avec comptage |
|---------|---------|-------------------|
| `/maisons/bracelets/page.tsx` | Teaser Phase 2 — roadmap, features, feature flag | Stub visuel uniquement |
| `/admin/restauration/page.tsx` | Déclarations repas manuelles avec `guestCount` | Base pour relier au comptage auto |
| `/pro/voyages/[id]/restauration/page.tsx` | Menus, formulas, allergènes | Pas de comptage |
| `/maisons/restauration/page.tsx` | Menus/allergènes côté Maison | Pas de comptage |
| `RestaurantDeclaration.guestCount` | Champ int dans le modèle déclaration | À relier au scan |
| `MealType` enum (BREAKFAST/LUNCH/DINNER/FULL_BOARD) | Typage repas | Réutilisable pour les scans |
| Feature flags system — `/admin/feature-flags` | 22+ toggles existants | Prêt pour 3 nouveaux flags |

### Ce qui manque (Phase 2 MVP)

| Module | Priorité | Effort estimé |
|--------|----------|--------------|
| Backend : endpoint `POST /api/counting/scan` | P0 | ~8h |
| Backend : endpoint `GET /api/counting/stats` | P0 | ~4h |
| Backend : modèles Prisma `Bracelet`, `ScanEvent` | P0 | ~3h |
| Frontend : 7 pages stubs comptage | P1 | Sprint présent ✅ |
| Hardware : lecteurs NFC chez les Maisons pilotes | P2 | Achat matériel |

---

## 2. Comparatif Technologique — Le meilleur système pour Eventy

### 2.1 NFC HF 13.56 MHz (ISO 14443 / NTAG216) — **RECOMMANDÉ PRINCIPAL**

| Critère | Évaluation |
|---------|-----------|
| **Portée** | ~3-10 cm — fiable, intentionnel, pas de faux positifs |
| **Batterie bracelet** | Aucune — passif, résistant à l'eau, durée de vie illimitée |
| **Smartphone compatible** | iPhone 7+ (Core NFC), Android 4.0+ (80% marché actuel) |
| **Lecteur dédié** | Optionnel — peut utiliser le smartphone du partenaire |
| **Coût bracelet** | 1.50-3€/unité (silicone, waterproof) · <0.50€ en Tyvek jetable |
| **Coût lecteur** | 0€ si app Android/iPhone · 80-150€ pour lecteur fixe dédié |
| **Temps de scan** | < 300 ms |
| **Fonctionnement offline** | ✅ Oui — le bracelet stocke l'ID, sync en batch |
| **Sécurité** | NTAG216 : UID 7 octets, possible crypto AES si besoin |
| **Précédents tourisme** | Ibiza clubs, Tomorrowland, Playa Hotels (Majorque), Center Parcs |

**Recommandation** : Bracelet silicone NFC NTAG216, commande minimum ~500 unités, fournisseurs : **GoToTags** (US), **Identiv** (DE), **Seritag** (UK) ou **Netatoo/BlueStar** (FR).

### 2.2 QR Code — **FALLBACK OBLIGATOIRE**

| Critère | Évaluation |
|---------|-----------|
| **Coût** | 0€ — QR généré dans l'app Eventy du voyageur |
| **Matériel partenaire** | Smartphone avec caméra |
| **Temps de scan** | 1-3 secondes |
| **Fonctionnement offline** | ✅ Oui — QR signé JWT, validation locale possible |
| **Risque** | Screenshot, partage entre voyageurs (mitiger par expiration 24h) |

**Usage** : Fallback si bracelet perdu/oublié + voyageurs sans bracelet (voyageurs last-minute).

### 2.3 RFID UHF 915 MHz — **NON RECOMMANDÉ (Phase 1-2)**

| Critère | Évaluation |
|---------|-----------|
| **Portée** | 2-10 m — comptage automatique au passage |
| **Coût lecteur fixe** | 300-800€/lecteur + infrastructure réseau |
| **Coût bracelet** | 3-8€ (chipset UHF) |
| **Complexité** | Infrastructure lourde, installation spécialisée |
| **Usage pertinent** | Coachella (300K pax), centres de ski, parcs aquatiques |
| **Verdict Eventy** | ❌ Overkill Phase 1-2. Viable si >500 pax/jour sur site fixe. |

### 2.4 BLE (Bluetooth Low Energy) — **NON RECOMMANDÉ**

| Critère | Évaluation |
|---------|-----------|
| **Avantage** | Détection automatique sans geste |
| **Problèmes** | Bluetooth doit être actif sur le téléphone du voyageur · batterie beacon · interférences · faux positifs portée ~10m |
| **Verdict Eventy** | ❌ Trop dépendant du comportement voyageur. |

### 2.5 Comparatif Résumé

| Technologie | Coût bracelet | Coût lecteur | Geste voyageur | Offline | Verdict |
|-------------|:------------:|:------------:|:--------------:|:-------:|:-------:|
| **NFC HF** | 1.5-3€ | 0-150€ | Tap (3cm) | ✅ | **✅ Principal** |
| **QR Code** | 0€ | 0€ | Montrer téléphone | ✅ | **✅ Fallback** |
| RFID UHF | 3-8€ | 300-800€ | Aucun | ✅ | Phase 3+ |
| BLE | 5-15€ | 50-200€ | Aucun | ❌ | Non retenu |

---

## 3. Architecture Système — Comment ça marche

### 3.1 Flux NFC (principal)

```
[Bracelet NFC]
      |
      | (tap ~3cm)
      ▼
[Lecteur : smartphone Android/iPhone Maison]
  → App Eventy Maison (mode offline-first)
  → Lecture UID bracelet
  → Lookup local : bracelet_id → voyageur_id + allergies + photo
      |
      | (scan event en file locale)
      ▼
[Backend : POST /api/counting/scan]
  payload: { bracelet_id, maison_id, scan_type: MEAL|ACTIVITY|ZONE, meal_type?, timestamp }
  → Enregistrement ScanEvent
  → Incrémentation compteur Maison × Type × Voyage
  → Déclenchement webhook si anomalie (ex: scan double en < 30min)
      |
      ▼
[Dashboard temps réel]
  → /admin/comptage (vue globale)
  → /maisons/comptage (vue Maison)
  → /pro/voyages/[id]/comptage (vue Créateur)
```

### 3.2 Flux QR Code (fallback)

```
[App Voyageur] → Génère QR signé (JWT, expiration 24h, voyage_id + voyageur_id)
[App Maison] → Scan QR → Décode JWT → Valide expiration → POST /api/counting/scan
```

### 3.3 Validation par l'Indépendant

```
[Comptage auto bracelet/QR] ← source vérité
[Déclaration Maison] ← déclare ses repas servis
[Indépendant] → compare les deux dans /equipe/comptage ou /pro/voyages/[id]/comptage
  → Si écart > 10% → ticket anomalie automatique → parcours litige existant
  → Si OK → validation
  → En fin de voyage → facture auto Maison = Σ scans validés × prix négocié
```

---

## 4. Modèles de données — Prisma (à créer Phase 2)

```prisma
model Bracelet {
  id          String   @id @default(cuid())
  uid         String   @unique  // UID NFC NTAG216 (7 octets hex)
  travelId    String
  voyageurId  String
  issuedAt    DateTime @default(now())
  returnedAt  DateTime?
  status      BraceletStatus @default(ACTIVE)
  // relations
  scanEvents  ScanEvent[]
  travel      Travel   @relation(fields: [travelId], references: [id])
}

model ScanEvent {
  id          String    @id @default(cuid())
  braceletId  String?   // null si QR
  qrToken     String?   // null si NFC
  maisonsId   String
  travelId    String
  voyageurId  String
  scanType    ScanType
  mealType    MealType?
  scannedAt   DateTime  @default(now())
  validatedAt DateTime?
  validatedBy String?   // independant userId
  anomaly     Boolean   @default(false)
  anomalyNote String?
}

enum BraceletStatus { ACTIVE LOST RETURNED DAMAGED }
enum ScanType       { MEAL ACTIVITY ZONE_POOL ZONE_SPA GAME PURCHASE }
```

---

## 5. Références — Solutions tourisme existantes

### Best-in-class Phase 2 (groupe <100 pax)

- **Oveit** (oveit.com) — Plateforme NFC/RFID wearables pour hôtels et resorts. Gestion wallet cashless, accès zones, meal tracking. Référence : Center Parcs, hôtels all-inclusive Majorque.
- **CrowdPass** (crowdpass.co) — Solution NFC événementielle, SDK API disponible, compatible iPhone/Android.
- **Billfold** (billfold.tech) — Cashless wristbands festivals & resorts. ROI documenté : +15-30% dépense/voyageur.

### Architecture hybride recommandée (Eventy)

Eventy **ne sous-traite pas** la plateforme à ces fournisseurs. On utilise :
1. **Bracelets NFC NTAG216** achetés en OEM (fournisseur FR : Idesco, Netatoo)
2. **App Maison existante** enrichie d'un module NFC scan (Web NFC API sur Android Chrome)
3. **Backend Eventy** gère tout le comptage — pas de dépendance externe
4. **Fallback QR** via l'app Voyageur existante

---

## 6. Feature Flags — 3 nouveaux toggles

À ajouter dans `/admin/feature-flags` :

| Flag | Défaut | Description |
|------|--------|-------------|
| `nfc_bracelets_enabled` | OFF | Active le scan NFC dans l'app Maison + provisionnement bracelets |
| `qr_counting_enabled` | OFF | Active le QR code comme moyen de comptage (précède NFC) |
| `auto_billing_from_counting` | OFF | Génère automatiquement les factures Maison depuis les ScanEvents validés |

---

## 7. Pages Créées — Stubs Phase 2

| Route | Fichier | Statut | Feature flag |
|-------|---------|--------|-------------|
| `/admin/comptage` | `(admin)/admin/comptage/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |
| `/admin/comptage/bracelets` | `(admin)/admin/comptage/bracelets/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |
| `/admin/comptage/restauration` | `(admin)/admin/comptage/restauration/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |
| `/admin/comptage/activites` | `(admin)/admin/comptage/activites/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |
| `/maisons/comptage` | `(maisons)/maisons/comptage/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |
| `/pro/voyages/[id]/comptage` | `(pro)/pro/voyages/[id]/comptage/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |
| `/equipe/comptage` | `(equipe)/equipe/comptage/page.tsx` | ⚪ Stub | `nfc_bracelets_enabled` |

---

## 8. Plan d'action — Chemin critique Phase 2

### Sprint Pilote (Q4 2026)

| # | Action | Responsable | Durée | Prérequis |
|---|--------|-------------|-------|-----------|
| 1 | Commande 200 bracelets NFC NTAG216 silicone + 5 lecteurs USB | PDG | 1 sem | Budget ~500€ |
| 2 | Modèles Prisma `Bracelet` + `ScanEvent` | Tech | 3h | — |
| 3 | Endpoint `POST /api/counting/scan` (offline-first) | Tech | 8h | Prisma |
| 4 | Module NFC dans app Maison (Web NFC API) | Tech | 12h | Endpoint |
| 5 | Module QR fallback (camera scan) | Tech | 6h | Endpoint |
| 6 | Pilote sur 3 Maisons volontaires | Ops | Q4 2026 | Hardware |
| 7 | Dashboard comptage live (câbler pages stubs) | Tech | 8h | Endpoint stats |
| 8 | Facturation auto depuis ScanEvents | Tech | 12h | Validation indépendant |

### Fournisseurs recommandés

- **Bracelets NFC** : Netatoo.com (FR) · Seritag.com (UK, expédition EU) · GOTap.id
- **Lecteurs NFC USB/PC** : ACR122U (~35€) ou ACR1252U (~75€) — démo/pilote
- **App scan Android NFC** : Web NFC API (Chrome Android 89+) — pas d'app native à développer

---

## 9. Data & Analytics

Le comptage automatique produit ces métriques business :

| Métrique | Valeur pour Eventy |
|----------|--------------------|
| Taux d'utilisation repas | % voyageurs qui vont au restaurant Maison vs external |
| Activités les plus fréquentées | Optimisation programme |
| Pic d'affluence par heure | Gestion flux Maison |
| ROI par Maison partenaire | Renouvellement contrat |
| Écart déclaré/scanné | Détection fraude déclaration |
| Taux de fidélité Maison | Voyageurs qui reviennent dans la même Maison |

---

*Document créé le 2026-04-19. Prochain point : sélection Maisons pilotes après obtention licences Atout France.*
