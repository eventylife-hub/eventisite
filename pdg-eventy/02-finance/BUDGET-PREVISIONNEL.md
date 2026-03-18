# Budget Prévisionnel — Eventy

> **Dernière mise à jour** : 6 mars 2026
> **Sources** : Coûts réels recherchés (voir COUTS-REELS.md)
> **Budget enveloppe PDG** : 15 000€ - 50 000€
> **Modèle** : Bus complet 53 places = unité de base

---

## 1. Coûts de création (one-shot)

| Poste | Min (réel 2026) | Max (réel 2026) | Priorité |
|-------|-----------------|-----------------|----------|
| Frais greffe + bénéficiaires | **55,93€** | 55,93€ | P0 |
| Annonce légale SAS | **238,80€** | 238,80€ | P0 |
| Rédaction statuts (avocat tourisme) | 1 000€ | 2 000€ | P0 |
| Pack juridique avocat (CGV + contrats) | 2 500€ | 5 000€ | P0 |
| Capital social (dépôt) | 1 000€ | 5 000€ | P0 |
| Dépôt marque INPI (3 classes) | **270€** | 540€ | P1 |
| Matériel informatique | **1 200€** | 2 600€ | P1 |
| Marketing lancement | **930€** | 2 250€ | P2 |
| **Sous-total création** | **~7 195€** | **~17 685€** | |

## 2. Coûts obligatoires agence (annuels)

| Poste | Réel 2026/an | Notes |
|-------|-------------|-------|
| Garantie financière APST (cotisation) | **2 100 - 2 520€** | +20% si contre-garantie perso |
| Contre-garantie personnelle | **10 000€** (one-shot) | Caution dirigeant |
| RC Pro assurance | **780 - 1 200€** | CMB ou Hiscox |
| Immatriculation Atout France | **100€** | Renouvelable / 3 ans |
| MTV (Médiation Tourisme) | **0€** | Adhésion gratuite |
| **Sous-total agence/an** | **~2 980 - 3 820€** | + 10K€ contre-garantie Y1 |

## 3. Coûts techniques (mensuels)

| Poste | Réel 2026/mois | Annuel |
|-------|---------------|--------|
| Scaleway DEV1-S (backend) | **6,42€** | 77€ |
| Scaleway DB-DEV-S (PostgreSQL) | **12€** | 144€ |
| Vercel Pro (frontend) | **18,50€** (~20$) | 222€ |
| Stockage S3 | ~3€ | 36€ |
| Cloudflare CDN | **0€** | 0€ |
| Google Workspace | **7€** | 84€ |
| Domaine(s) eventylife.fr + .fr | ~2€ | 25€ |
| **Sous-total tech/mois** | **~49€** | **~588€** |

## 4. Coûts récurrents business (mensuels)

| Poste | Réel 2026/mois | Annuel |
|-------|---------------|--------|
| Expert-comptable tourisme | **165 - 300€ HT** | 1 980 - 3 600€ |
| Stripe (commissions) | 1,5% + 0,25€/tx | Variable |
| Logiciels SaaS (Brevo, Crisp...) | **0 - 25€** | 0 - 300€ |
| Domiciliation | **0€** (chez soi) | 0€ |
| Téléphonie mobile pro | **15 - 30€** | 180 - 360€ |
| CFE (exonéré Y1) | **0€** | 0€ Y1 / 200-1500€ Y2+ |
| **Sous-total business/mois** | **~180 - 355€** | **~2 160 - 4 260€** |

---

## Scénarios budget total Année 1

### Scénario A — Minimaliste (~20 000€)

| Catégorie | Montant |
|-----------|---------|
| Création SAS (statuts maison + greffe) | 295€ |
| Capital social | 1 000€ |
| Avocat tourisme (CGV seules) | 1 000€ |
| APST (cotisation + contre-garantie) | 12 100€ |
| RC Pro | 780€ |
| Atout France + INPI | 370€ |
| Tech (12 mois × 49€) | 588€ |
| Business (12 mois × 180€) | 2 160€ |
| Trésorerie de sécurité | 2 000€ |
| **TOTAL** | **~20 293€** |

### Scénario B — Recommandé (~32 000€)

| Catégorie | Montant |
|-----------|---------|
| Création SAS (avocat tourisme) | 2 295€ |
| Capital social | 3 000€ |
| Pack juridique (CGV + contrats) | 3 000€ |
| APST (cotisation + contre-garantie) | 12 520€ |
| RC Pro | 1 000€ |
| Atout France + INPI | 470€ |
| Matériel informatique | 1 500€ |
| Tech (12 mois × 49€) | 588€ |
| Business (12 mois × 250€) | 3 000€ |
| Marketing lancement | 1 500€ |
| Trésorerie de sécurité | 3 000€ |
| **TOTAL** | **~31 873€** |

### Scénario C — Confortable (~43 000€)

| Catégorie | Montant |
|-----------|---------|
| Création SAS (avocat premium) | 3 500€ |
| Capital social | 5 000€ |
| Pack juridique complet | 5 000€ |
| APST (cotisation + contre-garantie) | 12 520€ |
| RC Pro (plafond élevé) | 1 200€ |
| Atout France + INPI + recherche | 640€ |
| Matériel informatique | 2 600€ |
| Tech (12 mois × 49€) | 588€ |
| Business (12 mois × 355€) | 4 260€ |
| Marketing lancement complet | 2 250€ |
| Trésorerie de sécurité | 5 000€ |
| **TOTAL** | **~42 558€** |

---

## Seuil de rentabilité — Modèle bus complet 53 places

| Hypothèse | Ancien modèle (15 pers) | **Nouveau modèle (53 pers)** |
|-----------|------------------------|------------------------------|
| Groupe moyen | 15 personnes | **53 personnes (bus complet)** |
| Panier moyen / personne | 400€ (WE France) | **373€ (WE France, prix optimisé)** |
| CA moyen par voyage | 6 045€ | **19 766€** |
| Marge brute par voyage | 1 371€ (22,7%) | **4 919€ (24,9%)** |
| Coûts fixes mensuels | ~509 - 946€/mois | ~509 - 946€/mois |
| **Break-even** | ~1 voyage/mois | **1 voyage tous les 2-3 mois suffit** |

> **Impact majeur** : Avec le modèle bus complet, UN SEUL voyage de 53 personnes génère **4 919€ de marge** — soit 5 mois de charges fixes. Le seuil de rentabilité est atteint beaucoup plus vite.

### Prévisionnel CA Année 1 — Modèle bus complet

| Période | Voyages | Type | CA estimé | Marge (~22%) |
|---------|---------|------|-----------|-------------|
| M1-M3 | 0 | Setup + prospection | 0€ | 0€ |
| M4 | 1 | Weekend France 53 pers | 20 000€ | 4 900€ |
| M5 | 1 | Séminaire B2B 53 pers | 21 000€ | 5 600€ |
| M6 | 2 | 1 WE France + 1 B2B | 41 000€ | 10 500€ |
| M7-M8 | 2/mois | Mix WE + B2B | 82 000€ | 20 000€ |
| M9-M10 | 3/mois | + 1 Europe (2 bus) | 156 000€ | 36 000€ |
| M11-M12 | 3-4/mois | Rythme de croisière | 180 000€ | 42 000€ |
| **TOTAL Y1** | **~20 voyages** | | **~500 000€** | **~119 000€** |

> **Comparaison ancien modèle** : Y1 ancien = ~284 000€ CA / ~42 600€ marge → Nouveau modèle = **~500 000€ CA / ~119 000€ marge** (+76% CA, +179% marge)

### Voyageurs Année 1

| Période | Voyages | Voyageurs/voyage | Total voyageurs |
|---------|---------|-----------------|-----------------|
| M4-M6 | 4 | 53 | 212 |
| M7-M10 | 10 | 53-106 | 690 |
| M11-M12 | 7 | 53-159 | 530 |
| **TOTAL Y1** | **~21** | | **~1 432 voyageurs** |

> **Levier négociation** : "Nous amenons 1 400+ voyageurs par an" = argument majeur pour tarifs préférentiels chez les fournisseurs, comptables, assureurs.

---

## 🧠 Notes PDG (06/03/2026)

- La contre-garantie APST (10K€) est le plus gros poste → budget minimum réaliste ~20K€
- Scénario recommandé : ~32K€ (bon compromis sécurité/coût)
- **Bus complet 53 places = game changer** : CA ×3,3 par voyage, marge ×3,6
- **Break-even en 1 seul voyage** au lieu de 1-2 voyages/mois
- **Levier négociation** : 53 voyageurs minimum par voyage → tarifs préférentiels partout
- **Force de vente** : assurance voyage complète incluse → différenciation forte
- **Levier auto-entrepreneurs** : recommander nos prestataires au réseau → tarifs négociés + remplissage
- **B2B prioritaire** : séminaires 53 pers = 26,8% marge, volume garanti, 1 interlocuteur
- **Multi-bus** : objectif M9+ = 2 bus (106 pers), M12+ = 3 bus + charter (159 pers)
