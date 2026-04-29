# Dossier Garantie Financière — Eventy Life

> Dossier complet de demande d'adhésion APST, immatriculation Atout France et conformité tourisme.
> Préparé pour validation par avocat tourisme avant dépôt officiel.

---

## Fichiers

| Fichier | Description |
|---------|-------------|
| `Eventy-Life-Dossier-Garantie-Financiere-COMPLET.docx` | Dossier final, prêt à dépôt après validation avocat |
| `PROCESSUS-ATOUT-FRANCE.md` | Détail opérationnel du processus Atout France (chronologie, pièces, coûts, contacts) |
| `../../scripts/garanties/build-dossier-garantie.js` | Générateur Node.js du dossier |

## Régénération

```bash
NODE_PATH="$(npm root -g)" node scripts/garanties/build-dossier-garantie.js \
  docs/garanties/Eventy-Life-Dossier-Garantie-Financiere-COMPLET.docx
```

Pré-requis : `npm install -g docx` (déjà installé sur le poste PDG).

## Enrichissements v6 (par rapport à v5)

- **Cas de référence Atout France** : voyage type 700 € TTC + vérification croisée euro par euro (1.4)
- **Encart visuel "Liberté de l'économie"** (Table avec bordures double orange + ombrage crème) + tableau comparatif extractif vs distributif (2.4)
- **Engagements chiffrés opposables** : plafond marge 12 %, plancher redistribution 6 %, délais versements (2.4.1)
- **Chronologie officielle J0 / J+30 / J+60** détaillée + variante d'urgence 45 jours + suite post-IM (12.0, 12.0.1, 12.0.2)
- **Plan de rapatriement et continuité voyageurs** : 8 étapes en cas de défaillance (9.2.1)
- **Cellule de crise voyageurs** : composition, délais d'activation (9.2.2)
- **Quatre scénarios concrets de rapatriement** (9.2.3)
- **Barème indicatif APST d'indemnisation des voyageurs** (9.2.4)
- **6 fiches profil de gouvernance** (Président, Resp. opérations, CTO, DAF, Marketing, Support) avec statut, périmètre, profil, mois cible, rémunération, rôle conformité (10.1.1)
- **Synthèse équipe-cible** M0 / M6 / M12 / M24 (10.1.2)

## Enrichissements v5 (par rapport à v2)

- **Manifeste Eventy** + genèse + promesse-cadre (1.0, 1.0.1, 1.0.2)
- **Anatomie d'un voyage** : décomposition euro par euro de l'argent (2.3.1)
- **Témoignages-types** : 4 profils d'indépendants concernés (2.3.2)
- **Maillage géographique** : 8 régions françaises (2.3.3)
- **Trois exemples chiffrés** détaillés (Lisbonne / Marrakech / B2B Côte d'Azur) + comparaison concurrence (1.4 enrichi)
- **Plan de trésorerie mensualisé 24 mois** (M01 → M24, encaissements / décaissements / fonds en transit / solde)
- **Bilan prévisionnel fin An 2** + calcul détaillé de la CAF (4.4.2, 4.4.3)
- **Conformité directive UE 2015/2302 article par article** (Art. 3 → Art. 24)
- **Procédure Atout France** détaillée (10 étapes opérationnelles)
- **Calendrier APST** détaillé (10 étapes, J+0 à J+90)
- **Compte séquestre** mécanique technique (architecture + différence avec séquestre notarial)
- **Compte bloqué de garantie** dirigeant (10 000 €, conditions, modalités)
- **RC Pro** : plafonds détaillés + comparatif Hiscox / Galian / CMB
- **Assurance annulation client** : causes couvertes + modalités
- **Procédure médiation MTV** pas-à-pas (6 étapes voyageur)
- **Tableau des recours du voyageur** : 7 niveaux hiérarchisés
- **Droits voyageur par étape** (avant / pendant / après le voyage)
- **Transparence prix** Eventy (décomposition publique sur fiche voyage)

## Sommaire du dossier (16 parties + cover + lettre + sommaire + mot final)

1. **Présentation d'Eventy Life** — identité, vision, positionnement, modèle économique distribué (HRA + 5% vendeur + 3% créateur), trajectoire de croissance, plateforme technique, **architecture de traçabilité des fonds**
2. **Eventy & la France** — ancrage territorial, création de valeur économique, liberté de l'économie, satisfaction du besoin client, **secteur tourisme français (8% PIB, 2M emplois)**, pérennité
3. **Cadre légal et obligations réglementaires** — Code du Tourisme, directive UE 2015/2302, garantie illimitée, obligations corrélatives, droits du voyageur
4. **Données financières prévisionnelles** — hypothèses, CR An 1 (16 M€) et An 2 (80 M€), plan de trésorerie 24 mois, calibrage de la garantie (1,6 M€), budget conformité, **scénarios pessimiste/central/optimiste**, **ratios financiers**, **bilan prévisionnel synthétique**, **CAF**
5. **Pièces juridiques de référence** — checklist 20 pièces, statuts SAS, clauses structurantes, pacte d'associés
6. **Capacité professionnelle du dirigeant** — voies de justification, choix retenu, engagement formation
7. **Garanties offertes et protection du consommateur** — 4 niveaux de protection, compte séquestre, Pack Sérénité, CGV, médiation MTV, RGPD, **politique LCB-FT et KYC**
8. **Choix du garant — analyse comparée** — APST vs Groupama vs caution bancaire, choix retenu et arguments
9. **Analyse de risques et plan de continuité d'activité** — cartographie 7 familles de risques, PCA 4 scénarios, fonds de réserve volontaire
10. **Gouvernance et contrôle interne** — organes, plan de recrutement, conseils externes, procédures, rémunération dirigeant
11. **Indicateurs de pilotage et reporting** — KPIs financiers / qualité / écosystème, cadence rapports
12. **Calendrier opérationnel** — chemin critique 10-14 semaines
13. **Engagements solennels** — conformité, transparence, financiers, opérationnels, coopération
14. **FAQ APST anticipée** — 12 questions classiques de commission d'admission
15. **Annexes** — index + contenu réel : A (CV dirigeant), D (extraits CGV), E (catalogue 5 voyages), F (liste partenaires types), G (déclaration sur l'honneur), H (schéma plateforme), I (formulaire info précontractuelle)
16. **Sources réglementaires et bibliographiques**

## Cadre légal de référence

- **Article L211-18 Code du Tourisme** — obligation de garantie financière
- **Articles R211-26 à R211-34** — modalités de la garantie
- **Articles L211-16 et L211-17** — RC Pro obligatoire
- **Arrêté 23 décembre 2009 modifié** — fixation de la garantie
- **Directive (UE) 2015/2302** — voyages à forfait
- **Ordonnance 2017-1717 du 20 décembre 2017** — transposition
- **Règlement (UE) 2016/679** — RGPD

## Modèle économique intégré (validé PDG 2026-04-29)

- **Eventy** : marge socle sur prestations HRA (hôtels, restaurants, activités)
- **Vendeur** : 5 % HT du CA voyage pour tout vendeur (créateur, ambassadeur, influenceur, HRA partageant, indépendant)
- **Créateur** : marge HRA + 3 points supplémentaires sur HRA (cumulable avec 5 % vendeur s'il vend)
- **Cartes / énergie / gamification** : pas de marge — répercuté sur voyage/activité

## Prochaines actions PDG

1. Faire relire le dossier par un avocat spécialisé en droit du tourisme
2. Compléter les annexes A à J (CV, devis RC Pro, CGV intégrales, catalogue, partenaires…)
3. Créer la SAS et obtenir le Kbis
4. Soumettre le dossier à l'APST (email envoyé 2026-03-05)
5. Souscrire la RC Pro Tourisme (Hiscox / Galian / CMB)
6. Déposer le dossier d'immatriculation Atout France
7. Adhérer à la MTV
8. Lancement commercial (cible mai 2026)

## Notes sur la production

- Format A4, 2 780 paragraphes, ~31 400 mots, ~108 KB (v6 — phase d'enrichissement profonde finale)
- Validé schéma OOXML (validate.py PASSED)
- Versions successives : v1 (~11 k mots) → v2 (~20 k) → v3 (~22 k) → v4 (~25 k) → v5 (~27,6 k) → v6 (~31,4 k)
- Police Calibri, palette Eventy (orange #E87722, bleu #1F4E79)
- Sommaire automatique cliquable (TOC champs Word/LibreOffice)
- Header + footer avec pagination

## Mise à jour

Pour modifier le dossier : éditer `scripts/garanties/build-dossier-garantie.js` puis régénérer.
Le contenu, les chiffres et la structure sont définis dans ce fichier unique.
