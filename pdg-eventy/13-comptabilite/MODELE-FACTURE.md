# Modèle de Facture — Eventy

> **Dernière mise à jour** : 5 mars 2026
> **Usage** : Template à implémenter dans le module documents du backend
> **Régime TVA** : TVA sur la marge — Art. 266-1-b du CGI

---

## Facture client — Voyage (TVA sur la marge)

### Template ASCII

```
╔══════════════════════════════════════════════════════════════════╗
║                           EVENTY                                 ║
║  SAS au capital de 5 000€                                        ║
║  [Adresse siège social — à définir]                              ║
║  SIRET : [en cours] — RCS [Ville] B [numéro]                    ║
║  TVA intracommunautaire : FR[XX][SIREN]                          ║
║  Immatriculation Atout France : IM[XXX]XXXXX                     ║
║  Garant financier : APST — apst.travel                           ║
║  RC Pro : [Hiscox/Orus] — Police n°[XXXXX]                       ║
║  Email : contact@eventylife.fr | Site : eventylife.fr                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  FACTURE N° EV-2026-0001            Date : 15/04/2026            ║
║                                                                   ║
║  Client :                                                         ║
║  Mme Sophie MARTIN                                                ║
║  12 rue de la Paix, 75002 Paris                                   ║
║  sophie.martin@email.com                                          ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║  VOYAGE : Weekend Château de la Loire                             ║
║  Dates : 25-27 avril 2026 (3J/2N) — 15 participants              ║
║  Référence voyage : VOY-2026-0001                                 ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Désignation                      Qté    P.U. TTC    Total TTC   ║
║  ──────────────────────────────────────────────────────────────── ║
║  Hébergement Château Hôtel***     2 nuits  60,00€      120,00€   ║
║  Transport autocar A/R Paris      1        50,00€       50,00€   ║
║  Activité : Visite guidée         1        40,00€       40,00€   ║
║  Activité : Dégustation vins      1        40,00€       40,00€   ║
║  Restauration (4 repas)           4        25,00€      100,00€   ║
║  Pack Sérénité Eventy (inclus)    1        18,00€       18,00€   ║
║    • Annulation toutes causes                                     ║
║    • Rapatriement + assistance 24h                                ║
║    • Bagages 1 500€ + RC 500 000€                                ║
║  Frais de dossier                 1        35,00€       35,00€   ║
║  ──────────────────────────────────────────────────────────────── ║
║                                                                   ║
║                    TOTAL TTC PAR PERSONNE :       403,00€         ║
║                    × 15 participants                               ║
║                    TOTAL TTC GROUPE :           6 045,00€         ║
║                                                                   ║
║  ┌──────────────────────────────────────────────────────────┐    ║
║  │ TVA sur la marge — Art. 266-1-b du CGI                   │    ║
║  │ TVA non détaillée conformément au régime de TVA sur      │    ║
║  │ la marge applicable aux agences de voyages.              │    ║
║  └──────────────────────────────────────────────────────────┘    ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║  ÉCHÉANCIER DE PAIEMENT                                           ║
║  ──────────────────────────────────────────────────────────────── ║
║  Acompte 30% à la réservation :     1 813,50€  payé le 01/03/26  ║
║  Solde 70% au plus tard J-30 :      4 231,50€  dû le 25/03/26   ║
║  ──────────────────────────────────────────────────────────────── ║
║  Mode de paiement : Carte bancaire / SEPA via Stripe              ║
║  Référence paiement : pi_3P1a2b3c4d5e6f                          ║
║  Paiement split disponible : chaque participant peut payer        ║
║  sa part directement sur eventylife.fr/paiement/VOY-2026-0001      ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║  CONDITIONS GÉNÉRALES                                             ║
║  ──────────────────────────────────────────────────────────────── ║
║  • Acompte de 30% non remboursable sauf Pack Sérénité             ║
║  • Solde dû 30 jours avant le départ                              ║
║  • Annulation couverte par le Pack Sérénité (inclus)              ║
║  • CGV complètes : eventylife.fr/cgv                                ║
║  • Médiation : MTV — www.mtv.travel                               ║
║                                                                   ║
║  En cas de retard de paiement :                                   ║
║  Pénalités = 3× taux d'intérêt légal en vigueur                  ║
║  Indemnité forfaitaire de recouvrement = 40€                      ║
║                                                                   ║
║  Loi applicable : Droit français                                  ║
║  Tribunal compétent : Tribunal de commerce de [Ville]             ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Facture B2B — Séminaire entreprise

> **Note** : Pour les ventes B2B entre agences/TO, la TVA classique s'applique (pas la TVA sur la marge). Pour les ventes B2B à des entreprises clientes (séminaires), le régime marge s'applique.

```
╔══════════════════════════════════════════════════════════════════╗
║                           EVENTY                                 ║
║  [En-tête identique au modèle B2C]                               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  FACTURE N° EV-2026-0015            Date : 20/05/2026            ║
║                                                                   ║
║  Client :                                                         ║
║  ACME SAS                                                         ║
║  45 avenue des Champs-Élysées, 75008 Paris                        ║
║  SIRET : 123 456 789 00012                                        ║
║  TVA : FR12345678900                                              ║
║  Contact : Marie DUPONT — rh@acme.fr                              ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║  SÉMINAIRE : Team Building Normandie                              ║
║  Dates : 15-16 juin 2026 (2J/1N) — 40 collaborateurs             ║
║  Référence : SEM-2026-0003                                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Désignation                      Qté    P.U. TTC    Total TTC   ║
║  ──────────────────────────────────────────────────────────────── ║
║  Hébergement + salle séminaire    1 nuit  120,00€    4 800,00€   ║
║  Transport autocar A/R Paris      1        30,00€    1 200,00€   ║
║  Team building : Course orient.   1        50,00€    2 000,00€   ║
║  Team building : Escape game      1        50,00€    2 000,00€   ║
║  Restauration (3 repas + pause)   1        80,00€    3 200,00€   ║
║  Pack Sérénité Eventy (inclus)    1        15,00€      600,00€   ║
║  Frais de dossier                 1        40,00€    1 600,00€   ║
║  ──────────────────────────────────────────────────────────────── ║
║                                                                   ║
║                    TOTAL TTC :                   15 400,00€       ║
║                                                                   ║
║  TVA sur la marge — Art. 266-1-b du CGI                           ║
║                                                                   ║
║  Bon de commande entreprise : BC-ACME-2026-042                    ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║  PAIEMENT — Conditions entreprise                                 ║
║  ──────────────────────────────────────────────────────────────── ║
║  Acompte 30% :                     4 620,00€  à la commande      ║
║  Solde 70% :                      10 780,00€  J-30 avant sémin.  ║
║  ──────────────────────────────────────────────────────────────── ║
║  Mode : Virement bancaire / CB via Stripe                         ║
║  RIB : [IBAN Eventy — à renseigner]                               ║
║  Référence : SEM-2026-0003                                        ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Avoir client (remboursement)

```
╔══════════════════════════════════════════════════════════════════╗
║                           EVENTY                                 ║
║  [En-tête identique]                                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  AVOIR N° AV-2026-0001              Date : 10/04/2026            ║
║  Réf. facture d'origine : EV-2026-0001                            ║
║                                                                   ║
║  Client : Mme Sophie MARTIN                                       ║
║                                                                   ║
║  Motif : Annulation voyage — Pack Sérénité activé                 ║
║  Sinistre déclaré le : 08/04/2026                                 ║
║  Prise en charge assureur : OUI — Dossier n° [XXXXX]             ║
║                                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Désignation                                     Montant          ║
║  ──────────────────────────────────────────────────────────────── ║
║  Remboursement intégral voyage (Pack Sérénité)    403,00€        ║
║  Frais de dossier (non remboursables)             -35,00€        ║
║  ──────────────────────────────────────────────────────────────── ║
║  TOTAL AVOIR :                                    368,00€         ║
║                                                                   ║
║  Remboursement via Stripe sur le moyen de paiement d'origine     ║
║  Délai : 5-10 jours ouvrés                                       ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Numérotation des factures

| Type | Format | Exemple | Série |
|------|--------|---------|-------|
| Facture client B2C | EV-AAAA-XXXX | EV-2026-0001 | Unique |
| Facture client B2B | EV-AAAA-XXXX | EV-2026-0015 | Même série |
| Avoir client | AV-AAAA-XXXX | AV-2026-0001 | Série séparée |
| Facture proforma (devis) | PF-AAAA-XXXX | PF-2026-0001 | Série séparée |

**Règles** :
- Séquentiel, **sans trou** (obligation légale)
- Remise à 0001 chaque année civile
- Un seul système de numérotation (pas 2 séries pour B2C/B2B)
- Archivage PDF automatique dans le backend Eventy (module `documents`)
- Conservation **10 ans minimum**

---

## Facture prestataire (achat) — Archivage

La facture reçue du prestataire doit contenir :
- Montant TTC (base de calcul de la marge)
- Référence du voyage Eventy (VOY-2026-XXXX ou SEM-2026-XXXX)
- Dates de prestation
- Détail des prestations fournies

**Classement** : Par voyage → Par type de prestataire → Chronologique
**Stockage** : Module `documents` backend + backup S3 Scaleway

---

## Implémentation backend

Le module `documents` du backend Eventy doit générer automatiquement :

| Document | Déclencheur | Format |
|----------|------------|--------|
| Facture proforma (devis) | Création devis | PDF |
| Facture client | Confirmation réservation + paiement acompte | PDF |
| Facture solde | Paiement solde | PDF (ou mise à jour facture initiale) |
| Avoir | Annulation + validation Pack Sérénité | PDF |
| Récapitulatif voyage | J-15 avant départ | PDF |
| Facture annuelle récapitulative | 31 décembre | PDF (pour B2B) |
