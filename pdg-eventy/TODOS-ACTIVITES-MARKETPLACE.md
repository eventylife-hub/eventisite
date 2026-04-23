# 📋 Archive TODOs — Module Activités, Sponsors, Championnats, Bons, Énergie, Défis

> **Créé le 2026-04-23** · Mis à jour le 2026-04-23 (v2 — ajout sponsors/énergie/dual portal)
> Tous les TODOs identifiés pour : création activités HRA, vente places partenaires, liberté créateur,
> championnats sponsors, bons chiffrés, énergie partout, défis groupes, kit partenaire, validation équipe.
> **PRINCIPE CLÉ** : tout vit sur l'interface duale = `/client/voyages` (Voyage) ET `/jeux` (Gaming/Trophées).
> Chaque TODO : ID unique + description + priorité P1/P2/P3.

## Légende priorités

- **P1** — Critique / bloquant pour le lancement ou le revenu. À faire en premier.
- **P2** — Important, impact fort sur l'expérience ou le scaling. À faire après les P1.
- **P3** — Nice-to-have, améliorations confort / long terme.

---

## ACT — Création d'activité HRA (`/admin/activites/creation`)

### Templates d'activités

| ID | Priorité | Description |
|----|----------|-------------|
| ACT-TPL-001 | P2 | IA suggère un template selon ville/saison du voyage |
| ACT-TPL-002 | P3 | Templates communautaires — partage entre HRA |
| ACT-TPL-003 | P2 | Version premium / signature / essentiel pour chaque template |
| ACT-TPL-004 | P3 | Multi-langues FR / EN / ES / IT / DE |

### Contenu & éditeur

| ID | Priorité | Description |
|----|----------|-------------|
| ACT-CNT-001 | P1 | Éditeur riche (gras, italique, listes, emojis) |
| ACT-CNT-002 | P1 | IA copywriter : titre + description à partir d'un brief |
| ACT-CNT-003 | P2 | Ton automatique Eventy (chaleureux, direct, honnête) |
| ACT-CNT-004 | P2 | Traduction auto FR ↔ EN |
| ACT-CNT-005 | P1 | Checklist d'inclusion (inclus / non inclus) |
| ACT-CNT-006 | P2 | Programme minute par minute |

### Médias (photos / vidéos)

| ID | Priorité | Description |
|----|----------|-------------|
| ACT-MED-001 | P1 | Upload drag & drop multiple + preview |
| ACT-MED-002 | P1 | Compression client + stripping EXIF |
| ACT-MED-003 | P2 | Banque d'images royalty-free par catégorie |
| ACT-MED-004 | P3 | Génération IA d'images pour créateur sans photo |
| ACT-MED-005 | P2 | Recadrage intelligent 16:9 / 1:1 / 9:16 |
| ACT-MED-006 | P3 | Vidéo shorts auto-générée photos + musique libre |
| ACT-MED-007 | P1 | Détection visages + floutage auto non-consentants |

### Logistique avancée

| ID | Priorité | Description |
|----|----------|-------------|
| ACT-LOG-001 | P1 | Géolocalisation Mapbox (autocomplete + pinpoint) |
| ACT-LOG-002 | P1 | Créneaux récurrents ou one-shot |
| ACT-LOG-003 | P2 | Jauge dynamique ouverture auto si full |
| ACT-LOG-004 | P2 | Matériel requis / fourni (checklist) |
| ACT-LOG-005 | P2 | Points de RDV multiples (A, B, C) |
| ACT-LOG-006 | P3 | Calcul énergie ECO / CONFORT / PREMIUM carbone |
| ACT-LOG-007 | P2 | Conditions météo : annulation / repli auto |

---

## EQP — Workflow équipe (`/equipe/activites/creation`)

| ID | Priorité | Description |
|----|----------|-------------|
| EQP-WRK-001 | P1 | Système de suggestions entre employés (upvotes, threads) |
| EQP-WRK-002 | P1 | Workflow validation chef de pôle — SLA 24h |
| EQP-WRK-003 | P2 | Bot Slack/Discord canal #ideas-activites |
| EQP-WRK-004 | P1 | Transformation idée → activité HRA en 1 clic (handoff) |
| EQP-WRK-005 | P2 | Board kanban idées / en cours / validées / refusées |
| EQP-WRK-006 | P2 | Matching auto : idée + destination + voyage à venir |
| EQP-WRK-007 | P3 | Gamification XP / trophée "créateur d'idées" |
| EQP-WRK-008 | P2 | Thread de discussion par idée (commentaires) |
| EQP-WRK-009 | P2 | Tag automatique chef de pôle si idée valide |
| EQP-WRK-010 | P3 | Récompense XP pour idée adoptée |
| EQP-WRK-011 | P2 | Filtre par pôle / destination / saison |

---

## MKT — Marketplace activités (`/admin/activites/marketplace`)

| ID | Priorité | Description |
|----|----------|-------------|
| MKT-MOD-001 | P1 | Modération IA + humaine (contenu, image, prix) |
| MKT-ALG-001 | P1 | Algorithme de recommandation contextuel |
| MKT-PCK-001 | P1 | Packs combo configurables par voyage |
| MKT-NEG-001 | P2 | Négociation tarifs en gros (volume) |
| MKT-AB-001  | P2 | A/B testing titres / photos / prix |
| MKT-MAP-001 | P2 | Carte interactive des activités |
| MKT-CAL-001 | P1 | Calendrier de disponibilité temps réel |
| MKT-FIL-001 | P2 | Filtres avancés : date, prix, places, partenaire |
| MKT-BLK-001 | P2 | Bulk-actions : suspendre, approuver, archiver |
| MKT-EXP-001 | P2 | Export CSV / comptable par activité |
| MKT-STA-001 | P2 | Statistiques individuelles par activité (funnel) |
| MKT-VCH-001 | P3 | Système de vouchers / cadeaux activités |
| MKT-FRD-001 | P1 | Scoring fraude activités douteuses |
| MKT-FTR-001 | P3 | Featured activities : mise en avant payante HRA |

---

## PRT — Partenaires lieux (`/admin/activites/partenaires`)

### Intégrations techniques

| ID | Priorité | Description |
|----|----------|-------------|
| PRT-API-001 | P1 | API connection partenaire (REST, webhooks) — syncro dispos |
| PRT-QR-001  | P1 | QR code unique voyageur + scan mobile app partenaire |
| PRT-PAY-001 | P1 | Paiement compte bloqué jusqu'à validation QR |
| PRT-FAC-001 | P1 | Facturation auto mensuelle (Pennylane) |
| PRT-MAP-001 | P2 | Intégration Google Maps + itinéraire depuis hôtel |

### Portail & self-service

| ID | Priorité | Description |
|----|----------|-------------|
| PRT-SLF-001 | P1 | Portail partenaire self-service (tarifs, dispos, packs) |
| PRT-UPL-001 | P2 | Upload menus / fiches techniques (PDF, photos) |
| PRT-I18N-001 | P3 | Multi-langues partenaires internationaux |
| PRT-CTR-001 | P1 | Contrats signés électroniquement (DocuSign) |

### Business & commercial

| ID | Priorité | Description |
|----|----------|-------------|
| PRT-NEG-001 | P2 | Négociation tarifs en gros (volumes, early bird) |
| PRT-PCK-001 | P1 | Packs combo : lieu + resto + transport en 1 résa |
| PRT-DSP-001 | P1 | Dashboard dispos live (calendrier coloré) |
| PRT-REL-001 | P2 | Relances partenaires inactifs |
| PRT-CAU-001 | P3 | Système de caution pour partenaires premium |
| PRT-ASS-001 | P2 | Assurance annulation partenaire (risque Eventy) |

### Qualité & SLA

| ID | Priorité | Description |
|----|----------|-------------|
| PRT-SLA-001 | P1 | SLA partenaire : check-in < 30sec, réponse < 2h |
| PRT-NPS-001 | P2 | Scoring NPS partenaire + dashboard qualité |
| PRT-ALT-001 | P2 | Alerte auto : partenaire sans résa 30 jours |
| PRT-REV-001 | P2 | Avis + photos après activité (social proof) |

---

## SPONSOR — Championnats sponsorisés (`/admin/sponsors/championnats`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-SPONSOR-001 | P1 | Forfaits Bronze 500€ / Silver 2000€ / Gold 5000€ — facturation Stripe Connect |
| TODO-SPONSOR-002 | P1 | Dashboard sponsor dédié (portail self-service temps réel) |
| TODO-SPONSOR-003 | P1 | Générateur brackets auto (single/double elim, round robin) |
| TODO-SPONSOR-004 | P1 | Upload logo + couleurs sponsor → branding auto championnat |
| TODO-SPONSOR-005 | P2 | Inscription équipes + paiement entry fee |
| TODO-SPONSOR-006 | P2 | Scoring en direct + push notifs aux fans |
| TODO-SPONSOR-007 | P2 | Stream vidéo finales + intégration YouTube/Twitch |
| TODO-SPONSOR-008 | P2 | Système de paris / pronostics (fun, pas argent) |
| TODO-SPONSOR-009 | P2 | Export PDF rapport fin de championnat |
| TODO-SPONSOR-010 | P3 | Co-création vidéo promo avec équipe Eventy (forfait Gold) |
| TODO-SPONSOR-011 | P3 | Marketplace championnats sponsors self-service |
| TODO-SPONSOR-012 | P3 | Multi-format : tournois, ligues, saisons régulières |

## BON — Bons chiffrés & coupons proximité (`/admin/sponsors/bons`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-BON-001 | P1 | Générateur codes uniques (format PREFIX-ENERGIE-HASH, collision check) |
| TODO-BON-002 | P1 | QR code PNG + PDF téléchargeable par sponsor (logo Eventy) |
| TODO-BON-003 | P1 | Saisie code + scan QR côté client mobile native |
| TODO-BON-004 | P1 | Crédit auto énergie wallet client + notification |
| TODO-BON-005 | P1 | Géolocalisation "Magasins partenaires près de moi" (rayon 5km) |
| TODO-BON-006 | P2 | Anti-abus : 1 code/client/sponsor/24h |
| TODO-BON-007 | P2 | Analytics sponsor : qui scanne quand où, funnel complet |
| TODO-BON-008 | P2 | Batch print : PDF prêt 1000 codes uniques |
| TODO-BON-009 | P2 | Intégration NFC + Apple Wallet / Google Wallet |
| TODO-BON-010 | P2 | Code éphémère vs multi-usage |
| TODO-BON-011 | P3 | A/B testing formats codes, valeurs, durées |
| TODO-BON-012 | P3 | Boost campagne : x2 énergie sur un weekend |
| TODO-BON-013 | P3 | Chaîne de codes : scanner 3 sponsors = bonus 500 énergie |

## KIT — Kit partenaire téléchargeable (`/admin/sponsors/kit-partenaire`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-KIT-001 | P1 | Kit PDF auto-généré par partenaire (QR, logo, ville) — voyage + gaming |
| TODO-KIT-002 | P1 | QR redirige vers page partenaire dédiée (2 univers dans un écran) |
| TODO-KIT-003 | P1 | Carte interactive "Partenaires près de moi" Mapbox |
| TODO-KIT-004 | P1 | Workflow validation nouveau partenaire (équipe modère sous 24h) |
| TODO-KIT-005 | P2 | Envoi physique du kit par La Poste (API Canva) |
| TODO-KIT-006 | P2 | Renvoi automatique kit si rupture stock flyers |
| TODO-KIT-007 | P2 | Dashboard partenaire (scans, conversions, revenus) |
| TODO-KIT-008 | P2 | Classement mensuel partenaires + récompense Eventy |
| TODO-KIT-009 | P3 | Version enseignes chaînes (Carrefour...) — master + déclinaisons |
| TODO-KIT-010 | P3 | Formation vidéo partenaire (60 sec pitch Eventy) |
| TODO-KIT-011 | P3 | Objectif 1000 partenaires physiques France fin 2026 |

## ENER — Énergie partout (`/admin/sponsors/energie`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-ENER-001 | P1 | Wallet énergie unifié voyage + gaming (1 seul solde) |
| TODO-ENER-002 | P1 | Taux conversion paramétrables par source |
| TODO-ENER-003 | P1 | Historique transactions énergie horodatées |
| TODO-ENER-004 | P1 | Anti-fraude : multi-comptes, abus codes |
| TODO-ENER-005 | P2 | Expiration : inactif 6 mois → perte 50% |
| TODO-ENER-006 | P2 | Boost période : x2 énergie black friday |
| TODO-ENER-007 | P2 | Revente énergie entre amis (frais 10%) |
| TODO-ENER-008 | P2 | Push notifs gain énergie + CTA retour |
| TODO-ENER-009 | P2 | Dashboard sponsor : énergie distribuée, conversion |
| TODO-ENER-010 | P3 | Leaderboard top gagneurs énergie par ville |
| TODO-ENER-011 | P3 | Énergie héritée : offrir stock à un ami avant voyage |
| TODO-ENER-012 | P3 | NFT énergie rare : badges collectibles |

## DEFI — Défis entre groupes (`/admin/sponsors/defis-groupes`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-DEFI-001 | P1 | Création défi 1-clic (groupe A challenge groupe B) voyage+gaming |
| TODO-DEFI-002 | P1 | Réservation groupée auto chez partenaire (laser, escape, bowling) |
| TODO-DEFI-003 | P1 | API scoring partenaires temps réel (Lazergame, Escape) |
| TODO-DEFI-004 | P1 | Trophée gaming + énergie voyage (dual portal) |
| TODO-DEFI-005 | P1 | Notifs push : défi reçu, score live, résultat |
| TODO-DEFI-006 | P2 | Chat temps réel pendant le défi |
| TODO-DEFI-007 | P2 | Stream live des défis majeurs |
| TODO-DEFI-008 | P2 | Défis sponsorisés (Decathlon offre 2000 énergie) |
| TODO-DEFI-009 | P2 | Classement mensuel équipes victorieuses |
| TODO-DEFI-010 | P3 | Tournoi défis cross-groupes (bracket 8 équipes) |
| TODO-DEFI-011 | P3 | Replay vidéo auto 4K avec musique |
| TODO-DEFI-012 | P3 | NFT badge défi épique |

## VAL — Workflow validation équipe (`/equipe/sponsors/validation`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-VAL-001 | P1 | Workflow 5 étapes (Réception → KYC → Contrat → Kit → Livré) |
| TODO-VAL-002 | P1 | SLA 4j max par étape, alerte auto si dépassé |
| TODO-VAL-003 | P1 | Score qualité auto (fiabilité, volume, réputation) — voyage+gaming |
| TODO-VAL-004 | P1 | Vérification KYC API Infogreffe + SIREN |
| TODO-VAL-005 | P2 | Signature électronique contrat DocuSign |
| TODO-VAL-006 | P2 | Checklist KYC auto (RIB, Kbis, assurance) |
| TODO-VAL-007 | P2 | Templates emails par étape (relance, validation, refus) |
| TODO-VAL-008 | P2 | Impression kit + étiquette Colissimo 1-clic |
| TODO-VAL-009 | P2 | Assignation candidat à membre équipe (pôle partenariats) |
| TODO-VAL-010 | P3 | Visite physique optionnelle (salarié local vérifie lieu) |
| TODO-VAL-011 | P3 | Scoring auto a posteriori (ventes vs estimé) |
| TODO-VAL-012 | P3 | Onboarding gaming : quel trophée pour ce partenaire ? |

## DUAL — Interface duale Voyage + Gaming (transversal)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-DUAL-001 | P1 | Sync data unique : une activité = 2 rendus (voyage + gaming) |
| TODO-DUAL-002 | P1 | Router transparent : QR scan → landing dual portal au choix client |
| TODO-DUAL-003 | P1 | Prix sponsor = pack voyage OU bonus gaming (élection gagnant) |
| TODO-DUAL-004 | P1 | Un bon chiffré fonctionne sur les 2 univers sans friction |
| TODO-DUAL-005 | P2 | Dashboard sponsor unifié : stats voyage + gaming côte à côte |
| TODO-DUAL-006 | P2 | A/B testing positionnement : voyage-first vs gaming-first par segment |
| TODO-DUAL-007 | P2 | Cross-promo auto : client gaming inactif → push voyage avec énergie |
| TODO-DUAL-008 | P3 | Personnalisation homepage selon historique (voyage-centric vs gaming) |

---

## 📊 Récapitulatif

| Catégorie | Total | P1 | P2 | P3 |
|-----------|-------|----|----|----|
| ACT (création HRA) | 24 | 7 | 12 | 5 |
| EQP (équipe idées) | 11 | 3 | 5 | 3 |
| MKT (marketplace) | 14 | 4 | 7 | 3 |
| PRT (partenaires lieux) | 19 | 8 | 8 | 3 |
| SPONSOR (championnats) | 12 | 4 | 5 | 3 |
| BON (bons chiffrés) | 13 | 5 | 5 | 3 |
| KIT (kit partenaire) | 11 | 4 | 4 | 3 |
| ENER (énergie partout) | 12 | 4 | 5 | 3 |
| DEFI (défis groupes) | 12 | 5 | 4 | 3 |
| VAL (validation équipe) | 12 | 4 | 5 | 3 |
| DUAL (interface duale) | 8 | 4 | 3 | 1 |
| **TOTAL** | **148** | **52** | **63** | **33** |

---

## 🚀 Ordre d'exécution recommandé

### Sprint 1 (P1 critiques — revenue + compliance)
1. MKT-MOD-001 — Modération contenu activités
2. PRT-API-001 — API partenaires
3. PRT-QR-001 — QR code validation
4. PRT-PAY-001 — Paiement bloqué jusqu'à validation
5. PRT-PCK-001 — Packs combo
6. ACT-MED-001 — Upload photos/vidéos
7. ACT-LOG-001 — Géolocalisation

### Sprint 2 (P1 expérience)
8. EQP-WRK-001 à 004 — Workflow équipe complet
9. MKT-ALG-001 — Reco contextuelle
10. MKT-CAL-001 — Calendrier dispo live

### Sprint 3 (P2 scaling)
11. A/B tests, exports, maps, négociation tarifs, NPS

### Sprint 4+ (P3 confort)
12. Multi-langues, featured, vouchers, IA images

---

*Archive maintenue à jour à chaque itération. Chaque TODO complété → date de complétion ajoutée.*
