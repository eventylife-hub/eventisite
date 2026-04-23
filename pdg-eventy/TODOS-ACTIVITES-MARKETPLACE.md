# 📋 Archive TODOs — Module Activités & Marketplace Partenaires

> **Créé le 2026-04-23**
> Tous les TODOs identifiés lors de l'audit "Création activités HRA + Vente places partenaires + Liberté créateur".
> Chaque TODO : ID unique + description + priorité P1/P2/P3 + page source.
> On lance les améliorations dans la foulée, une par une.

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

## 📊 Récapitulatif

| Catégorie | Total | P1 | P2 | P3 |
|-----------|-------|----|----|----|
| ACT (création HRA) | 24 | 7 | 12 | 5 |
| EQP (équipe) | 11 | 3 | 5 | 3 |
| MKT (marketplace) | 14 | 4 | 7 | 3 |
| PRT (partenaires) | 19 | 8 | 8 | 3 |
| **TOTAL** | **68** | **22** | **32** | **14** |

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
