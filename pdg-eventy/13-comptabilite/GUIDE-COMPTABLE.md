# Guide Comptable — Agence de Voyages Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Important** : À valider avec un expert-comptable spécialisé tourisme
> **Expert-comptable visé** : Chevalier Conseil (devis demandé — 165-300€ HT/mois)

---

## 1. Régime fiscal applicable

### TVA sur la marge (Article 266-1-b du CGI)

Les agences de voyages sont soumises au **régime de TVA sur la marge** pour les prestations achetées à des tiers et revendues aux clients.

| Élément | Règle |
|---------|-------|
| **Base imposable** | CA TTC − Coûts TTC des prestataires = Marge brute |
| **Taux TVA** | 20% (sur la marge uniquement) |
| **Formule** | **TVA = Marge TTC × 20/120** |
| **Facture client** | Prix TTC global, **jamais de TVA détaillée** |
| **Droit à déduction** | **Aucune déduction** de TVA sur les achats voyage |
| **Mention obligatoire** | « TVA sur la marge — Art. 266-1-b du CGI » |

### Exemples concrets — 3 cas Eventy

#### Cas 1 : Weekend France 15 personnes (B2C)
```
Voyage vendu au client :                    6 045€ TTC
Coûts prestataires (hébergement, transport,
  activités, restauration) :               -4 539€ TTC
Coût assurance Pack Sérénité :               -135€ TTC
= Marge brute TTC :                         1 371€
Frais Stripe (1,4% + 0,25€) :                -85€
= Marge nette avant TVA :                   1 286€
TVA sur la marge : 1 286 × 20/120 =          214€
= Marge nette HT :                          1 072€
```

#### Cas 2 : Séjour Europe 25 personnes (B2C)
```
Voyage vendu :                             28 550€ TTC
Coûts prestataires :                      -22 969€ TTC
Coût assurance Pack Sérénité :               -588€ TTC
= Marge brute TTC :                         4 993€
Frais Stripe :                               -400€
= Marge nette avant TVA :                   4 593€
TVA sur la marge : 4 593 × 20/120 =          766€
= Marge nette HT :                          3 827€
```

#### Cas 3 : Séminaire B2B 40 personnes
```
Séminaire vendu :                          15 400€ TTC
Coûts prestataires :                       -10 976€ TTC
Coût assurance :                              -300€ TTC
= Marge brute TTC :                         4 124€
Frais Stripe :                               -216€
= Marge nette avant TVA :                   3 908€
TVA sur la marge : 3 908 × 20/120 =          651€
= Marge nette HT :                          3 257€
```

### Exceptions — TVA classique (pas sur la marge)

| Situation | TVA applicable | Détail |
|-----------|---------------|--------|
| Prestations réalisées en propre | TVA classique 20% | Si Eventy exploite directement un hébergement |
| Ventes B2B entre agences | TVA classique 20% | Vente à un autre professionnel du tourisme |
| Revenus SaaS (Phase 2) | TVA classique 20% | Abonnements plateforme Pro (29-99€/mois) |
| Frais de dossier | **TVA sur la marge** | Inclus dans le forfait voyage |
| Commission assurance | **Exonéré de TVA** | Art. 261 C du CGI |

> ⚠️ **Attention Pack Sérénité** : La marge sur l'assurance est potentiellement exonérée de TVA si qualifiée de « courtage d'assurance ». Point à valider avec l'expert-comptable et l'avocat.

---

## 2. Plan comptable détaillé

### Comptes de produits (classe 7)

| N° Compte | Libellé | Usage | Exemple |
|-----------|---------|-------|---------|
| **706000** | Prestations de services voyage | CA global voyages | Total facture client |
| **706100** | Commissions hébergement | Marge hébergement | 216€ sur weekend |
| **706200** | Commissions transport | Marge transport | 75€ sur weekend |
| **706300** | Commissions activités | Marge activités | 240€ sur weekend |
| **706400** | Frais de dossier | 35-50€/personne | 525€ sur 15 pers |
| **706500** | Revenus assurance (Pack Sérénité) | Marge ~50% sur prime | 135€ sur weekend |
| **706600** | Revenus plateforme SaaS | Phase 2 | Abonnements Pro |
| **706700** | Revenus parrainage | Commissions apporteurs | Si programme affiliés |

### Comptes de charges (classe 6)

| N° Compte | Libellé | Usage | Budget/mois |
|-----------|---------|-------|-------------|
| **607100** | Achats hébergement | Factures hôtels | Variable |
| **607200** | Achats transport | Factures autocaristes | Variable |
| **607300** | Achats activités | Factures prestataires | Variable |
| **607400** | Achats restauration | Factures restaurants | Variable |
| **607500** | Achats assurance voyage | Primes assureur | ~2-3% du CA |
| **613100** | Cloud & hébergement web | Scaleway | 25€ |
| **613200** | Logiciels SaaS | Google Workspace, outils | 30-50€ |
| **616100** | RC Professionnelle | Hiscox/Orus | 75€ (900€/an) |
| **616200** | Garantie financière APST | Cotisation annuelle | 175€ (2 100€/an) |
| **617000** | Immatriculation Atout France | Frais 3 ans | ~3€ (100€/3 ans) |
| **622100** | Expert-comptable | Chevalier Conseil | 200€ |
| **623000** | Publicité & marketing | Google Ads, social ads | 500-1 000€ |
| **626100** | Emails transactionnels | Brevo | 0-25€ |
| **626200** | Téléphonie mobile | Forfait pro | 20€ |
| **627100** | Frais bancaires | Compte pro | 10-30€ |
| **627200** | Commissions Stripe | 1,4% + 0,25€/tx | Variable |
| **641000** | Rémunération du personnel | Salaires (Phase 2) | 0€ (Phase 1) |
| **455000** | Compte courant associé David | Apports fondateur | 30 000€ initial |

### Journaux comptables

| Journal | Code | Contenu |
|---------|------|---------|
| Ventes | VE | Factures clients (EV-2026-XXXX) |
| Achats | HA | Factures prestataires |
| Banque | BQ | Mouvements bancaires + Stripe |
| Opérations diverses | OD | TVA, provisions, écritures fin de mois |

---

## 3. Facturation — Règles spécifiques agence de voyages

### Facture client (TVA sur la marge)

**Mentions obligatoires** :
- Numéro de facture séquentiel : **EV-2026-XXXX**
- Date d'émission
- Identité complète : EVENTY SAS, adresse, SIRET, RCS, n° TVA intracommunautaire
- **N° immatriculation Atout France : IMXXXXXXXXX**
- **Garant financier : APST**
- **Assureur RC Pro : [Nom] — Police n° [X]**
- Identité du client (nom, adresse, email)
- Description détaillée du voyage (destination, dates, participants, prestations)
- **Prix TTC global** — ne JAMAIS détailler la TVA
- **Mention obligatoire** : « TVA sur la marge — Art. 266-1-b du CGI »
- Conditions de paiement (acompte 30%, solde J-30)
- Mention pénalités de retard

### Facture prestataire (achat)

- Conserver TOUTES les factures reçues (obligation **10 ans**)
- Les montants TTC servent de base de calcul de la marge
- **Aucune déduction de TVA** (régime marge)
- Classement : Par voyage → Par prestataire → Chronologique
- Référencer le n° de voyage Eventy sur chaque facture prestataire

### Numérotation des factures

| Type | Format | Exemple |
|------|--------|---------|
| Facture client | EV-AAAA-XXXX | EV-2026-0001 |
| Avoir client | AV-AAAA-XXXX | AV-2026-0001 |
| Facture proforma (devis) | PF-AAAA-XXXX | PF-2026-0001 |

**Règles** : séquentiel, sans trou, remise à 0001 chaque année civile, un seul système de numérotation.

---

## 4. Obligations déclaratives

### Déclarations périodiques

| Déclaration | Fréquence | Échéance | Notes |
|------------|-----------|----------|-------|
| **TVA (CA3)** | Mensuelle ou trimestrielle | 15-24 du mois suivant | Ligne spécifique TVA marge |
| **IS (acomptes)** | Trimestrielle | 15 mars, 15 juin, 15 sept, 15 déc | |
| **IS (solde)** | Annuelle | 15 mai N+1 | |
| **Liasse fiscale** | Annuelle | 2e jour ouvré suivant le 1er mai | |
| **DAS2** | Annuelle | 1er mai | Si honoraires > 1 200€ |
| **CFE** | Annuelle | 15 décembre | Exonéré la 1ère année |
| **CVAE** | Annuelle | Si CA > 500K€ | Pas concerné en Phase 1 |

### Taux IS applicable (SAS — Eventy)

| Tranche de bénéfice | Taux IS | Pour Eventy Y1 |
|---------------------|---------|-----------------|
| 0 — 42 500€ | **15%** (taux PME) | ~28 350€ de résultat → IS ~4 253€ |
| Au-delà de 42 500€ | 25% | Pas concerné en Y1 |

**Condition PME** : CA < 10M€, capital détenu à 75%+ par des personnes physiques → ✅ Eventy éligible

### Déclaration TVA sur la marge — Mode opératoire

```
Chaque mois (ou trimestre) :

1. Calculer le CA TTC encaissé sur la période
2. Soustraire les coûts TTC prestataires payés
3. = Marge TTC de la période
4. TVA à reverser = Marge TTC × 20/120

Exemple M4 :
CA TTC encaissé :       8 000€
Coûts prestataires :   -6 200€
Marge TTC :             1 800€
TVA marge :  1 800 × 20/120 = 300€ à reverser
```

> **Point important** : Si la marge est négative sur une période (annulation, remboursement), la TVA sur la marge est nulle. Pas de crédit de TVA sur la marge.

---

## 5. Gestion de trésorerie — Spécificités agence

### Flux financiers types (voyage 15 pers — 6 045€)

```
J-45 : Client paie acompte 30% = 1 814€ via Stripe
       → Fonds disponibles J+2 (CB) ou J+5 (SEPA)
       → Commission Stripe : ~26€

J-30 : Client paie solde 70% = 4 231€ via Stripe
       → Fonds disponibles J+2
       → Commission Stripe : ~60€

J+0  : Voyage réalisé

J+30 : Eventy paie les prestataires :
       ├── Hébergement :    1 584€
       ├── Transport :        675€
       ├── Activités :        960€
       ├── Restauration :   1 320€
       └── Assureur :         135€
       Total paiements :   4 674€

       → Marge Eventy : 6 045 - 4 674 - 86 (Stripe) = 1 285€ TTC
       → TVA marge : 1 285 × 20/120 = 214€
       → Marge nette HT : 1 071€
```

### Règles de gestion trésorerie

1. **Encaisser l'acompte** (30%) AVANT de confirmer les prestataires
2. **Encaisser le solde** (70%) à J-30 AVANT le départ
3. **Payer les prestataires** à J+30 APRÈS le séjour (négocier ce délai)
4. **Trésorerie minimum** : toujours 3 mois de charges fixes en réserve (~3 000€)
5. **Provisionner la TVA** : mettre de côté 20/120 de la marge chaque mois
6. **Provisionner l'IS** : mettre de côté 15% du résultat estimé chaque trimestre
7. **Séparer les comptes** : compte opérationnel / compte de réserve (TVA + IS + APST)

### Frais Stripe — Coûts réels 2026

| Type | Coût | Exemple sur 6 045€ |
|------|------|---------------------|
| Paiement CB (Europe) | 1,4% + 0,25€ | ~85€ |
| Paiement SEPA | 0,35€ | ~0,35€ |
| Remboursement | Frais initiaux non restitués | ~85€ perdus |
| Litige/chargeback | 15€ par litige | 15€ |
| Stripe Connect (split) | +0,25% par bénéficiaire | Si split payment |

> **Stratégie** : Encourager le paiement SEPA (0,35€) vs CB (85€) pour les gros montants → économie ~84€ par voyage de 6 000€.

---

## 6. Logiciel comptable recommandé

| Logiciel | Prix/mois | Points forts | TVA marge | Recommandation |
|----------|-----------|-------------|-----------|----------------|
| **Pennylane** | 49€ | Moderne, API, collab EC, multi-devises | Paramétrable | ⭐ Recommandé |
| **Tiime** | 0€ (avec EC partenaire) | Gratuit, synchro bancaire | Basique | Si EC compatible |
| Indy | 22€ | Simple, auto-catégorisation | Limité | Trop basique |
| QuickBooks | 15€ | International | Pas adapté | Non recommandé |

**Décision PDG** : Pennylane ou Tiime selon le choix de l'expert-comptable (Chevalier Conseil). Priorité = gestion native de la TVA sur la marge.

---

## 7. Documents à conserver

| Document | Durée légale | Format |
|----------|-------------|--------|
| Factures émises et reçues | **10 ans** | PDF + papier |
| Relevés bancaires | **10 ans** | PDF |
| Déclarations fiscales | **6 ans** | PDF |
| Contrats clients et prestataires | 5 ans après fin | PDF |
| Bulletins de paie | Durée illimitée | PDF |
| Registre des traitements RGPD | Tant que l'activité dure | Digital |
| Dossiers voyages (devis, confirmations) | **10 ans** | Automatisé dans Eventy |
| Attestations APST et RC Pro | Tant qu'en vigueur + 5 ans | PDF |

---

## 8. Checklist comptable — Lancement

- [ ] Choisir expert-comptable spécialisé tourisme (Chevalier Conseil — devis demandé)
- [ ] Ouvrir le compte pro bancaire (avec comptabilité Stripe)
- [ ] Paramétrer le logiciel comptable (Pennylane ou Tiime)
- [ ] Créer le plan comptable personnalisé (voir section 2)
- [ ] Configurer la déclaration TVA marge dans le logiciel
- [ ] Paramétrer la facturation automatique dans le backend Eventy
- [ ] Vérifier le traitement TVA du Pack Sérénité avec l'expert-comptable
- [ ] Définir la périodicité TVA (mensuelle recommandée pour maîtriser la tréso)
