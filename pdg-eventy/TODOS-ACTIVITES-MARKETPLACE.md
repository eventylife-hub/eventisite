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

## MARGE — Marge activités vendues (`/admin/activites/marges`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-MARGE-001 | P1 | % marge cible paramétrable par type activité (laser 20%, musée 15%, spa 25%) |
| TODO-MARGE-002 | P1 | Grille tarifaire négociée auto par partenaire (prix public vs contrat) |
| TODO-MARGE-003 | P1 | Alerte temps réel si marge < cible (email, Slack, dashboard) |
| TODO-MARGE-004 | P1 | Recharts marge par activité (courbe 12M, comparatif partenaires) |
| TODO-MARGE-005 | P1 | Classement partenaires par rentabilité mensuelle (top + flop) |
| TODO-MARGE-006 | P2 | Simulation marge : "si je négocie -5%, impact mensuel ?" |
| TODO-MARGE-007 | P2 | Export CSV comptable mensuel (fournisseurs + ventes + marge) |
| TODO-MARGE-008 | P2 | Scoring partenaire : marge + volume + NPS + ponctualité |
| TODO-MARGE-009 | P2 | Reversement auto partenaire (Stripe Connect split) |
| TODO-MARGE-010 | P2 | Calcul marge dual : CA voyage vs gaming par activité |
| TODO-MARGE-011 | P3 | Prédictif IA : marges futures selon tendance + saison |
| TODO-MARGE-012 | P3 | Marge gap analyzer : écart prix public marché vs nos ventes |

## NEGO — Négociation partenaires (`/admin/activites/negociation`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-NEGO-001 | P1 | Paliers volume auto : 10-50 (-10%), 50-200 (-20%), 200+ (-30%) |
| TODO-NEGO-002 | P1 | Dashboard : palier actuel, volume restant pour palier suivant |
| TODO-NEGO-003 | P1 | Templates emails négo (proposition, relance, signature) voyage+gaming |
| TODO-NEGO-004 | P1 | Contrat cadre volumétrique auto-réévalué |
| TODO-NEGO-005 | P2 | Simulation impact financier tarifaire |
| TODO-NEGO-006 | P2 | Historique négo (versions, changements tarifs) |
| TODO-NEGO-007 | P2 | Scoring partenaire (volume + marge + NPS + ponctualité) |
| TODO-NEGO-008 | P2 | Alertes opportunités (partenaires près palier supérieur) |
| TODO-NEGO-009 | P2 | Clauses cross-portal : bonus palier si actif voyage + gaming |
| TODO-NEGO-010 | P3 | IA recommande meilleure offre (marché + historique) |
| TODO-NEGO-011 | P3 | Compétition interne team partenariats |
| TODO-NEGO-012 | P3 | Benchmarking externe (Airbnb 15% → viser 18%) |

## CONTRAT — Contrats activités (`/admin/activites/contrats`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-CONTRAT-001 | P1 | Template contrat validé avocat tourisme (Me Dubois) |
| TODO-CONTRAT-002 | P1 | 8 clauses auto (commission, annulation, assurance, respo, durée, excl., confid., volume) |
| TODO-CONTRAT-003 | P1 | Signature électronique DocuSign + S3 + archive 10 ans |
| TODO-CONTRAT-004 | P1 | Contrat couvre voyage + gaming (clauses dual) |
| TODO-CONTRAT-005 | P1 | Alerte 90j/60j/30j avant expiration |
| TODO-CONTRAT-006 | P2 | Versioning contrats (diff clauses) |
| TODO-CONTRAT-007 | P2 | Renouvellement 1-clic si conditions inchangées |
| TODO-CONTRAT-008 | P2 | Clauses volumétriques auto-ajustées selon palier |
| TODO-CONTRAT-009 | P2 | Multi-langues FR/EN/IT/ES |
| TODO-CONTRAT-010 | P2 | Intégration outil juridique (Legalfly, PandaDoc) |
| TODO-CONTRAT-011 | P3 | IA analyse contrat (clauses abusives/manquantes) |
| TODO-CONTRAT-012 | P3 | Avocat-bot FAQ partenaires (RGPD, respo) |

## COMPTA-ACT — Flux comptables activités (`/comptable/activites`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-COMPTA-ACT-001 | P1 | Écriture auto : 7015 ventes + 6041 achats + TVA sur marge |
| TODO-COMPTA-ACT-002 | P1 | Split Stripe Connect : reversement partenaire auto |
| TODO-COMPTA-ACT-003 | P1 | TVA sur marge : calcul auto régime tourisme |
| TODO-COMPTA-ACT-004 | P1 | Export FEC mensuel réglementaire |
| TODO-COMPTA-ACT-005 | P1 | Ventilation voyage vs gaming (analytique) |
| TODO-COMPTA-ACT-006 | P2 | Rapprochement bancaire auto Stripe ↔ banque |
| TODO-COMPTA-ACT-007 | P2 | Facturation partenaires mensuelle (Pennylane) |
| TODO-COMPTA-ACT-008 | P2 | Déclaration TVA trimestrielle pré-remplie |
| TODO-COMPTA-ACT-009 | P2 | Suivi encours clients (réservé non facturé) |
| TODO-COMPTA-ACT-010 | P2 | Alerte avoirs / remboursements > seuil |
| TODO-COMPTA-ACT-011 | P3 | Prévisionnel trésorerie activités (3M rolling) |
| TODO-COMPTA-ACT-012 | P3 | DAS2 auto partenaires > 1200€/an |

## HRA-VENTE — Connexion systèmes HRA (`/admin/hra/systemes-connectes`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-HRA-VENTE-001 | P1 | Import calendrier externe (Google Calendar OAuth, iCal, Calendly API) |
| TODO-HRA-VENTE-002 | P1 | Lien site/Insta/FB du HRA sur sa fiche publique |
| TODO-HRA-VENTE-003 | P1 | API Calendly / Booksy / Airtable → sync dispos 2-way |
| TODO-HRA-VENTE-004 | P1 | Détection conflits planning (vente directe vs Eventy) |
| TODO-HRA-VENTE-005 | P1 | Commission conditionnelle : % si vente Eventy, 0 si HRA direct |
| TODO-HRA-VENTE-006 | P2 | Webhook temps réel : résa HRA → blocage créneau Eventy |
| TODO-HRA-VENTE-007 | P2 | Widget embed Eventy sur site HRA |
| TODO-HRA-VENTE-008 | P2 | WhatsApp Business API : détails résa au HRA |
| TODO-HRA-VENTE-009 | P2 | OAuth Meta (Insta/FB) : lire dispos stories |
| TODO-HRA-VENTE-010 | P2 | Onboarding connecteur wizard 3 étapes non-tech |
| TODO-HRA-VENTE-011 | P3 | Scraping léger site HRA (fallback si pas d'API) |
| TODO-HRA-VENTE-012 | P3 | Zapier / Make.com pour stacks exotiques |

## HRA-CROSS — Ventes croisées HRA (`/admin/hra/ventes-croisees`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-HRA-CROSS-001 | P1 | Dashboard HRA "Ventes Eventy vs Directes" temps réel |
| TODO-HRA-CROSS-002 | P1 | Push notif HRA nouvelle résa Eventy (mobile + email) |
| TODO-HRA-CROSS-003 | P1 | Chat direct HRA ↔ client (pré/jour J/post) |
| TODO-HRA-CROSS-004 | P1 | Ajustement prix/dispos/description par HRA (portail) |
| TODO-HRA-CROSS-005 | P1 | Détails client transmis HRA (allergies, accessibilité) |
| TODO-HRA-CROSS-006 | P2 | Scoring HRA : top Eventy vs inactifs |
| TODO-HRA-CROSS-007 | P2 | Alertes conflit planning simultané |
| TODO-HRA-CROSS-008 | P2 | Bonus HRA premium si ≥ 60% ventes Eventy |
| TODO-HRA-CROSS-009 | P2 | Coaching auto HRA sous-performants (tips, vidéos) |
| TODO-HRA-CROSS-010 | P2 | Dashboard partenariat HRA exportable PDF mensuel |
| TODO-HRA-CROSS-011 | P3 | Simulation HRA : "si 50% Eventy, CA = ?" |
| TODO-HRA-CROSS-012 | P3 | Challenge trimestriel HRA top Eventy (prize) |

## HRA-CREA — Création self-service HRA (`/createur/activites/creation`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-HRA-CREA-001 | P1 | Wizard 5 étapes mobile-first (85% HRA créent depuis mobile) |
| TODO-HRA-CREA-002 | P1 | Upload photos compressé + stripping EXIF + preview instantané |
| TODO-HRA-CREA-003 | P1 | Autocomplete Mapbox adresse + map interactive |
| TODO-HRA-CREA-004 | P1 | Calendrier dispos intégré (récurrent / one-shot) + sync GCal |
| TODO-HRA-CREA-005 | P1 | Publication dual : 1 activité = 2 rendus (voyage + gaming) auto |
| TODO-HRA-CREA-006 | P2 | IA copywriter : brief 3 lignes → titre + description ton Eventy |
| TODO-HRA-CREA-007 | P2 | Banque photos royalty-free si pas de photo |
| TODO-HRA-CREA-008 | P2 | Auto-traduction FR/EN/IT/ES |
| TODO-HRA-CREA-009 | P2 | Checklist inclus/non-inclus + matériel requis |
| TODO-HRA-CREA-010 | P2 | Suggestion prix concurrence locale + marge cible |
| TODO-HRA-CREA-011 | P3 | Détection visages + floutage auto non-consentants |
| TODO-HRA-CREA-012 | P3 | Génération vidéo shorts auto (photos + musique libre) |

## HRA-VENTE-DASH — Dashboard vente HRA (`/createur/activites/ventes`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-HRA-VENTE-DASH-001 | P1 | Consolidation Eventy voyage + gaming + ventes directes |
| TODO-HRA-VENTE-DASH-002 | P1 | Calcul auto commission (18% sur Eventy, 0% sur direct) |
| TODO-HRA-VENTE-DASH-003 | P1 | Export PDF mensuel pour comptable HRA |
| TODO-HRA-VENTE-DASH-004 | P1 | Graphique comparatif canaux (Eventy/site/Insta/bouche) |
| TODO-HRA-VENTE-DASH-005 | P1 | Revenus nets par activité (commission + TVA + net) |
| TODO-HRA-VENTE-DASH-006 | P2 | Prédictif : estimation ventes/mois avant publication |
| TODO-HRA-VENTE-DASH-007 | P2 | Notification paiements reçus (mail + push) |
| TODO-HRA-VENTE-DASH-008 | P2 | Historique transactions + reçus téléchargeables |
| TODO-HRA-VENTE-DASH-009 | P2 | Comparaison anonyme vs moyenne HRA similaires |
| TODO-HRA-VENTE-DASH-010 | P3 | Widget embed Eventy pour site HRA (génération auto) |
| TODO-HRA-VENTE-DASH-011 | P3 | Parrainage HRA : invite collègue → bonus commission 1 mois |
| TODO-HRA-VENTE-DASH-012 | P3 | Lien bio Eventy pour Insta (comme Linktree) |

## HRA-SYS — Systèmes self-service HRA (`/createur/activites/systemes`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-HRA-SYS-001 | P1 | OAuth flow 1-clic : GCal, Calendly, Facebook, Insta |
| TODO-HRA-SYS-002 | P1 | Sync 2-way : résa Eventy → bloque externe + inverse |
| TODO-HRA-SYS-003 | P1 | Widget embed auto-généré (script à coller sur site) |
| TODO-HRA-SYS-004 | P1 | Health check quotidien + alerte HRA si token expiré |
| TODO-HRA-SYS-005 | P1 | Logs sync visibles par HRA (transparence totale) |
| TODO-HRA-SYS-006 | P2 | WhatsApp Business : notifs résa + chat client |
| TODO-HRA-SYS-007 | P2 | Import historique 6 mois à la connexion |
| TODO-HRA-SYS-008 | P2 | Multi-calendriers (pro + perso en lecture seule) |
| TODO-HRA-SYS-009 | P2 | Détection conflits + proposition résolution auto |
| TODO-HRA-SYS-010 | P2 | Export .ics de toutes résas Eventy vers agenda perso |
| TODO-HRA-SYS-011 | P3 | Zapier / Make.com : recipes HRA (Trello, Notion, Airtable) |
| TODO-HRA-SYS-012 | P3 | Scraping fallback site HRA si pas d'API |

## HRA-RESA — Réservations + chat HRA (`/createur/activites/reservations`)

| ID | Priorité | Description |
|----|----------|-------------|
| TODO-HRA-RESA-001 | P1 | Inbox unifiée toutes sources (Eventy voyage + gaming + directs) |
| TODO-HRA-RESA-002 | P1 | Chat temps réel client ↔ HRA (WebSocket) avec historique |
| TODO-HRA-RESA-003 | P1 | Push notif nouvelle résa + message (mobile + email) |
| TODO-HRA-RESA-004 | P1 | Détails client transmis (allergies, accessibilité, occasion) |
| TODO-HRA-RESA-005 | P1 | Actions rapides : confirmer / annuler / demander info |
| TODO-HRA-RESA-006 | P2 | Templates messages (conf J-7, rappel J-1, post avis) |
| TODO-HRA-RESA-007 | P2 | Pièces jointes chat (photos lieu, menu, itinéraire PDF) |
| TODO-HRA-RESA-008 | P2 | Appel audio/vidéo dans l'app (brief complexe) |
| TODO-HRA-RESA-009 | P2 | Traduction auto messages FR/EN/IT/ES |
| TODO-HRA-RESA-010 | P2 | Tags conversation (VIP, rappeler, allergies) |
| TODO-HRA-RESA-011 | P3 | Suggestions IA réponses contextuelles |
| TODO-HRA-RESA-012 | P3 | Résumé automatique longue conversation (points clés) |

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
| MARGE (marge activités) | 12 | 5 | 5 | 2 |
| NEGO (négociation) | 12 | 4 | 5 | 3 |
| CONTRAT (contrats) | 12 | 5 | 5 | 2 |
| COMPTA-ACT (compta) | 12 | 5 | 5 | 2 |
| HRA-VENTE (admin systèmes) | 12 | 5 | 5 | 2 |
| HRA-CROSS (admin ventes HRA) | 12 | 5 | 5 | 2 |
| HRA-CREA (création self-service) | 12 | 5 | 5 | 2 |
| HRA-VENTE-DASH (dashboard HRA) | 12 | 5 | 5 | 2 |
| HRA-SYS (systèmes self-service) | 12 | 5 | 5 | 2 |
| HRA-RESA (résas + chat) | 12 | 5 | 5 | 2 |
| DUAL (interface duale) | 8 | 4 | 3 | 1 |
| **TOTAL** | **268** | **102** | **113** | **53** |

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
