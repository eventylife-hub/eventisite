/**
 * Eventy Life — Trois documents finance / comptabilité
 *
 *   1. Guide TVA marge tourisme (BOI-TVA-SECT-60)
 *   2. Plan comptable et processus comptable mensuel
 *   3. Plan d'audit interne
 *
 * Usage : node scripts/garanties/build-tva-marge-comptable-audit-interne.js
 */

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Footer,
  AlignmentType, LevelFormat, PageNumber, BorderStyle, WidthType, ShadingType,
  VerticalAlign, TabStopType, TabStopPosition,
} = require("docx");

const COLOR = {
  orange: "E87722", blue: "1F4E79", blueLt: "D5E8F0", cream: "FFF8EE",
  green: "2C5F2D", greenLt: "E5EDD9",
  gray: "555555", grayLt: "EEEEEE", black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function H1(text) { return new Paragraph({ spacing: { before: 240, after: 160 },
  children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })] }); }
function H2(text) { return new Paragraph({ spacing: { before: 220, after: 100 },
  children: [new TextRun({ text, bold: true, size: 22, color: COLOR.orange, font: "Calibri" })] }); }
function H3(text) { return new Paragraph({ spacing: { before: 180, after: 80 },
  children: [new TextRun({ text, bold: true, size: 20, color: COLOR.blue, font: "Calibri" })] }); }
function P(text, opts = {}) { return new Paragraph({ spacing: { after: opts.after || 100, line: 280 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, size: opts.size || 20, font: "Calibri",
    color: opts.color || COLOR.black, bold: opts.bold, italics: opts.italics })] }); }
function Bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 },
  spacing: { after: 60, line: 260 }, children: [new TextRun({ text, size: 20, font: "Calibri" })] }); }
function Numbered(text) { return new Paragraph({ numbering: { reference: "numbers", level: 0 },
  spacing: { after: 60, line: 260 }, children: [new TextRun({ text, size: 20, font: "Calibri" })] }); }
function Spacer(after = 120) { return new Paragraph({ spacing: { after }, children: [new TextRun("")] }); }
function tCell(text, opts = {}) {
  return new TableCell({ borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, size: opts.size || 18, bold: opts.bold,
        color: opts.color || COLOR.black, font: "Calibri" })] })] });
}
function makeTable({ widths, header, rows }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({ tableHeader: true,
    children: header.map((h, i) => tCell(h, { width: widths[i], shade: COLOR.blue, color: "FFFFFF", bold: true, size: 19 })) });
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((c, i) => tCell(c, { width: widths[i], shade: ri % 2 === 0 ? COLOR.grayLt : undefined })) }));
  return new Table({ width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths, rows: [headerRow, ...dataRows] });
}
function bandeauTitre(title, sous, color = COLOR.orange) {
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 18, color },
        left: { style: BorderStyle.SINGLE, size: 18, color },
        bottom: { style: BorderStyle.SINGLE, size: 18, color },
        right: { style: BorderStyle.SINGLE, size: 18, color } },
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: COLOR.cream, type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 240, right: 240 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: title, size: 28, bold: true, color, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
          children: [new TextRun({ text: sous, size: 18, italics: true, color: COLOR.blue, font: "Calibri" })] }),
      ] })] })] });
}

// ============================================================
// DOCUMENT 1 — GUIDE TVA MARGE TOURISME
// ============================================================
function guideTVAMarge() {
  return [
    bandeauTitre(
      "GUIDE TVA MARGE TOURISME EVENTY",
      "Régime spécial agence de voyages — BOI-TVA-SECT-60 — application opérationnelle",
    ),
    Spacer(160),

    P("Le présent guide formalise l'application du régime spécial de TVA marge applicable aux agences de voyages et opérateurs touristiques chez EVENTY LIFE SAS. Il complète la Note expert-comptable et le Guide comptable pdg-eventy/13-comptabilite/. Il s'adresse au Président, à l'expert-comptable et à toute personne en interne traitant la fiscalité.", { italics: true }),

    P("Le régime de TVA marge tourisme est défini par l'article 266-1-e du CGI et par le BOI-TVA-SECT-60 (BOFIP). Il s'applique de plein droit à toute opération d'achat-revente de prestations touristiques par un opérateur agissant en son nom propre — ce qui est le cas d'Eventy. Ce guide est pédagogique et opérationnel, mais ne se substitue pas à un avis fiscal personnalisé de l'expert-comptable.", { italics: true }),

    H1("1. Cadre légal et référentiels"),
    Bullet("Article 266-1-e du Code Général des Impôts (CGI) — base d'imposition TVA marge tourisme."),
    Bullet("Articles 268 à 270 du CGI — modalités de calcul."),
    Bullet("BOI-TVA-SECT-60 (BOFIP) — doctrine fiscale applicable."),
    Bullet("Directive (UE) 2006/112/CE article 306 et suivants — régime UE de la marge."),
    Bullet("Note expert-comptable Eventy (cohérence)."),
    Bullet("Guide comptable Eventy (cohérence pdg-eventy/13-comptabilite/)."),

    H1("2. Principe général"),

    H2("2.1. Différence avec la TVA classique"),
    Bullet("**TVA classique** : la TVA s'applique sur le prix de vente total. L'opérateur déduit la TVA payée sur les achats."),
    Bullet("**TVA marge tourisme** : la TVA s'applique uniquement sur la marge réalisée (prix de vente - coût d'achat des prestations refacturées)."),
    Bullet("Conséquence : la TVA non récupérée sur les achats devient un coût pour l'opérateur, qui le répercute dans son prix de vente HT."),

    H2("2.2. Conditions d'application"),
    Bullet("L'opérateur agit en son nom propre vis-à-vis du voyageur (cas d'Eventy)."),
    Bullet("L'opérateur achète les prestations à des tiers (HRA, transporteurs, etc.)."),
    Bullet("Les prestations sont fournies dans l'UE ou en dehors selon règles spécifiques."),

    H1("3. Application chez Eventy"),

    H2("3.1. Périmètre TVA marge"),
    Bullet("Tout voyage Eventy = ensemble de prestations achetées à des HRA/transporteurs et refacturées au voyageur."),
    Bullet("La TVA s'applique sur la marge brute du voyage (prix vente - coût HRA - coût transport)."),
    Bullet("Taux de TVA applicable : 20 % sur la marge (taux normal France)."),

    H2("3.2. Périmètre HORS TVA marge"),
    Bullet("Cartes énergie / cartes voyageurs : si non incluses dans la marge, refacturées à l'identique au coût."),
    Bullet("Frais de livraison documents : refacturés au coût (pas de marge cachée)."),
    Bullet("Cohérence avec la promesse de transparence prix Eventy."),

    H2("3.3. Cas particulier — prestations hors UE"),
    Bullet("Pour les prestations exécutées hors UE (vols hors UE, hébergement hors UE) : régime de la marge à 0 % de TVA."),
    Bullet("Conséquence : voyages à destinations hors UE plus avantageux fiscalement (à coût égal)."),

    H1("4. Exemple chiffré (voyage type Eventy 800 € TTC)"),
    makeTable({
      widths: [4680, 4680],
      header: ["Élément", "Montant"],
      rows: [
        ["Prix voyage TTC (voyageur paie)", "800,00 €"],
        ["Coût HRA (hébergement + repas + activités)", "550,00 €"],
        ["Coût transport (autocar)", "120,00 €"],
        ["Marge brute Eventy (avant impôts)", "130,00 €"],
        ["TVA marge à 20 % sur marge brute (130 / 1,20)", "21,67 €"],
        ["Marge brute HT après TVA", "108,33 €"],
        ["Commission vendeur 5 % HT du CA voyage (800/1,20 × 5 %)", "33,33 €"],
        ["Marge créateur 3 pts HT sur HRA (550/1,20 × 3 %)", "13,75 €"],
        ["Eventy net après commissions et marges partenaires", "61,25 €"],
        ["Marge nette Eventy / CA TTC", "7,66 %"],
      ],
    }),

    H1("5. Calcul concret de la marge"),

    H2("5.1. Formule"),
    P("Marge imposable = Prix de vente TTC - Achats refacturables HT (yc TVA non déductible)"),
    P("TVA marge = Marge imposable × 20 % / 120 %"),

    H2("5.2. Périmètre des achats refacturables"),
    Bullet("Hébergement : oui."),
    Bullet("Restauration : oui."),
    Bullet("Activités et excursions : oui."),
    Bullet("Transport voyageurs : oui."),
    Bullet("Honoraires accompagnateur : oui (si refacturé au voyageur)."),
    Bullet("Pack Sérénité (assurance prestations) : oui (si refacturé)."),
    Bullet("**Frais généraux Eventy (siège, marketing, équipe)** : NON — ces dépenses suivent le régime TVA classique."),

    H2("5.3. Périmètre des frais généraux (régime TVA classique)"),
    Bullet("Loyers bureaux."),
    Bullet("Salaires et charges équipe."),
    Bullet("Outils SaaS (Stripe fees, Scaleway, Google Workspace, etc.)."),
    Bullet("Marketing et communication."),
    Bullet("Honoraires conseils (avocat, expert-comptable, DPO)."),
    Bullet("Pour ces dépenses : TVA déductible sur factures fournisseurs (récupération normale)."),

    H1("6. Périodicité et déclarations"),

    H2("6.1. Régime déclaratif"),
    Bullet("Régime réel normal (CA HT > 840 K€) ou réel simplifié (CA HT < 840 K€)."),
    Bullet("Eventy An 1 : régime réel simplifié probable (à confirmer avec expert-comptable selon réel)."),
    Bullet("Eventy An 2+ : passage probable au régime réel normal."),

    H2("6.2. Déclarations (régime réel simplifié)"),
    Bullet("CA12 — déclaration annuelle (mai N+1)."),
    Bullet("Acomptes semestriels (juillet et décembre)."),
    Bullet("Régularisation lors de la déclaration annuelle."),

    H2("6.3. Déclarations (régime réel normal)"),
    Bullet("CA3 — déclaration mensuelle ou trimestrielle (selon CA)."),
    Bullet("Déclaration et paiement le 15 du mois M+1 (mensuel) ou 15 du mois suivant le trimestre."),
    Bullet("Eventy : préférence mensuelle pour suivi rigoureux du cash."),

    H1("7. Tenue comptable spécifique"),

    H2("7.1. Comptes dédiés"),
    Bullet("Compte 6044 — Achats de prestations touristiques refacturables (TVA marge)."),
    Bullet("Compte 7041 — Ventes de voyages (TVA marge)."),
    Bullet("Compte 4456 — TVA déductible (achats classiques)."),
    Bullet("Compte 4457 — TVA collectée (sur la marge)."),
    Bullet("Compte 467 — Compte cantonné voyageurs (séquestre APST)."),

    H2("7.2. Pièces justificatives"),
    Bullet("Facture HRA détaillée pour chaque prestation refacturée."),
    Bullet("Facture transporteur."),
    Bullet("Bon de commande Eventy → voyageur (cohérence Bon de commande HRA)."),
    Bullet("Facture émise au voyageur (si demande)."),
    Bullet("Conservation 10 ans (cohérence article L123-22 Code commerce)."),

    H1("8. Optimisation et pièges"),

    H2("8.1. Optimisations légitimes"),
    Bullet("Bon découpage entre marge tourisme et frais généraux (maximise la TVA récupérable sur frais généraux)."),
    Bullet("Choix du régime (mensuel vs trimestriel) selon trésorerie."),
    Bullet("Utilisation cohérente des comptes dédiés pour traçabilité."),

    H2("8.2. Pièges à éviter"),
    Bullet("Refacturer une prestation hors marge (Eventy = en son nom propre, donc dans la marge)."),
    Bullet("Confondre TVA marge et TVA classique — comptes séparés stricts."),
    Bullet("Oublier des prestations dans le calcul de la marge."),
    Bullet("Mal qualifier un achat hors UE (taux 0 % au lieu de 20 %)."),
    Bullet("Refus systématique du dumping fiscal ou de l'optimisation agressive (cohérence Politique anti-corruption)."),

    H1("9. Cas particuliers à valider avec l'expert-comptable"),
    Bullet("Voyages mixtes UE + hors UE (calcul prorata)."),
    Bullet("Voyageurs étrangers (cas spécifiques)."),
    Bullet("Voyages B2B (CSE, entreprises) — règles spécifiques de facturation."),
    Bullet("Avoirs voyageurs et remboursements (régularisation TVA)."),
    Bullet("Annulations Eventy (force majeure) — traitement TVA."),

    H1("10. Calendrier déclaratif annuel type"),
    makeTable({
      widths: [3744, 5616],
      header: ["Mois", "Action déclarative"],
      rows: [
        ["Janvier", "Bilan préliminaire An précédent (avec expert-comptable)"],
        ["Février", "Préparation comptes annuels"],
        ["Mars", "Validation comptes annuels par AG (cohérence PV AGOA)"],
        ["Avril", "Liasse fiscale (3 mois après clôture si déc 31)"],
        ["Mai", "Déclaration annuelle CA12 (régime réel simplifié)"],
        ["Juin", "Premier acompte semestriel TVA (régime simplifié)"],
        ["Juillet-Octobre", "Tenue comptable courante, déclarations mensuelles si réel normal"],
        ["Novembre", "Préparation clôture exercice"],
        ["Décembre", "Second acompte semestriel TVA (régime simplifié), arrêté comptable"],
      ],
    }),

    H1("11. Reporting comptable périodique"),
    Bullet("Mensuel — situation comptable + prévisionnel (cohérence Tableau de bord opérationnel)."),
    Bullet("Trimestriel — reporting investisseurs et APST (cohérence Pacte associés Seed)."),
    Bullet("Annuel — bilan, compte de résultat, annexe (cohérence Rapport de gestion annuel)."),
    Bullet("Reporting fiscal annuel auprès de la DGFIP (liasse fiscale, IS, TVA)."),

    H1("12. Engagements éthiques fiscaux"),
    Bullet("Refus du dumping fiscal."),
    Bullet("Refus des montages d'optimisation agressive."),
    Bullet("Paiement des cotisations sociales en France."),
    Bullet("Paiement de l'IS en France."),
    Bullet("Cohérence Politique RSE (pilier économique)."),
    Bullet("Cohérence Politique anti-corruption."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. À valider par l'expert-comptable et mettre à jour annuellement.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Note expert-comptable, Plan comptable et processus mensuel, Plan d'audit interne, Statuts SAS, PV AGOA, Rapport de gestion annuel, Politique anti-corruption.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN COMPTABLE ET PROCESSUS MENSUEL
// ============================================================
function planComptable() {
  return [
    bandeauTitre(
      "PLAN COMPTABLE ET PROCESSUS COMPTABLE EVENTY",
      "Référentiel comptable Eventy Life — plan de comptes et processus mensuel",
    ),
    Spacer(160),

    P("Le présent document formalise le référentiel comptable d'EVENTY LIFE SAS : plan de comptes adapté à l'activité d'opérateur de voyages, processus comptable mensuel, contrôles internes. Il complète la Note expert-comptable, le Guide TVA marge et le Manuel des opérations quotidiennes.", { italics: true }),

    P("Eventy adopte le Plan Comptable Général (PCG) avec adaptations spécifiques au tourisme. La rigueur comptable est essentielle pour le suivi de la trésorerie en transit, l'audit APST trimestriel et la confiance des investisseurs.", { italics: true }),

    H1("1. Cadre comptable de référence"),
    Bullet("Plan Comptable Général (PCG) — règlement ANC 2014-03 modifié."),
    Bullet("Code de commerce — articles L123-12 à L123-28."),
    Bullet("Adaptations sectorielles tourisme (BOI-TVA-SECT-60)."),
    Bullet("IFRS non applicables (Eventy non cotée)."),
    Bullet("Logiciel comptable préconisé : Pennylane, Tiime, ou équivalent (à confirmer avec expert-comptable)."),

    H1("2. Plan de comptes adapté Eventy"),

    H2("2.1. Comptes de bilan (classes 1-5)"),
    Bullet("**101** Capital social (3 000 € minimum SAS)."),
    Bullet("**106** Réserves (légale 5 % bénéfice + réserve volontaire 5 % CA risques tourisme — cohérence Statuts SAS)."),
    Bullet("**110** Report à nouveau."),
    Bullet("**165** Dépôts et cautionnements (ex : caution garantie financière APST)."),
    Bullet("**218** Immobilisations incorporelles (logiciel propriétaire activable, R&D activée si JEI)."),
    Bullet("**281** Amortissements des immobilisations."),
    Bullet("**411** Clients voyageurs (créances voyages confirmés non encore voyagés)."),
    Bullet("**420** Personnel (salaires, charges)."),
    Bullet("**445** TVA (TVA déductible 4456, TVA collectée 4457, TVA marge tourisme spécifique)."),
    Bullet("**461** Compte cantonné voyageurs (séquestre APST — visible en pdg-eventy/02-finance/PLAN-TRESORERIE)."),
    Bullet("**467** Comptes courants associés."),
    Bullet("**512** Banque (compte courant Eventy)."),
    Bullet("**513** Banque (compte cantonné dédié)."),

    H2("2.2. Comptes de résultat (classes 6-7)"),
    Bullet("**6044** Achats de prestations touristiques refacturables (TVA marge tourisme)."),
    Bullet("**6045** Achats de transports (refacturables, TVA marge)."),
    Bullet("**606** Achats non stockés (frais généraux)."),
    Bullet("**613** Locations bureaux."),
    Bullet("**616** Primes d'assurance (RC Pro, Pack Sérénité, multirisque)."),
    Bullet("**622** Honoraires (avocat, expert-comptable, DPO, audit)."),
    Bullet("**623** Publicité, publications."),
    Bullet("**625** Déplacements professionnels."),
    Bullet("**641** Rémunérations du personnel."),
    Bullet("**645** Charges sociales."),
    Bullet("**6711** Charges exceptionnelles (litiges, indemnités voyageurs)."),
    Bullet("**695** Impôt sur les sociétés."),
    Bullet("**7041** Ventes de voyages (CA voyages, TVA marge)."),
    Bullet("**7042** Ventes de prestations annexes."),
    Bullet("**708** Produits accessoires."),
    Bullet("**74** Subventions reçues (cohérence Dossier subventions publiques)."),

    H1("3. Comptes spécifiques tourisme à connaître"),
    makeTable({
      widths: [2496, 4368, 2496],
      header: ["Compte", "Description", "Particularité"],
      rows: [
        ["411 voyageur", "Créances voyageurs (voyage à venir)", "Solde = TTC encaissé non encore consommé"],
        ["461 cantonné", "Fonds en transit (séquestre)", "Doit être strictement séparé du 512"],
        ["6044 TVA marge", "Achats refacturables", "Sortie séparée pour calcul TVA marge"],
        ["7041 TVA marge", "Ventes voyages", "Entrée TTC, marge calculée"],
        ["165 garantie APST", "Caution APST", "Mise en garantie (suivi trimestriel)"],
        ["403 Stripe", "Compte transit Stripe", "Solde quotidien rapproché"],
      ],
    }),

    H1("4. Processus comptable mensuel"),

    H2("4.1. Quotidien (cohérence Manuel des opérations quotidiennes)"),
    Bullet("Saisie des factures fournisseurs sous 7 jours."),
    Bullet("Saisie des factures clients dès l'émission (lien automatique avec Stripe)."),
    Bullet("Sauvegarde des justificatifs (cloud sécurisé France)."),
    Bullet("Vérification compte cantonné (mouvements 24h)."),

    H2("4.2. Hebdomadaire"),
    Bullet("Rapprochement bancaire (compte courant + compte cantonné)."),
    Bullet("Suivi cash flow rolling 13 semaines."),
    Bullet("Vérification flux Stripe vs comptabilité."),

    H2("4.3. Mensuel — clôture préliminaire"),
    Numbered("Première semaine du mois M+1 : revue des écritures du mois M."),
    Numbered("Saisie de toutes les factures fournisseurs reçues."),
    Numbered("Émission des factures clients en attente."),
    Numbered("Calcul des charges à payer (loyer, salaires, sous-traitants)."),
    Numbered("Calcul des produits à recevoir."),
    Numbered("Provision pour commissions (vendeur 5 % HT, créateur 3 pts HT)."),
    Numbered("Provision pour charges (audit APST, conseils externes)."),
    Numbered("Calcul TVA marge sur les voyages retournés du mois."),
    Numbered("Validation préliminaire avec expert-comptable."),

    H2("4.4. Mensuel — clôture validée"),
    Bullet("Comptes annuels mis à jour."),
    Bullet("Reporting tableau de bord (cohérence Tableau de bord opérationnel)."),
    Bullet("Reporting investisseurs (cohérence Pacte associés Seed)."),
    Bullet("Mise à jour Plan trésorerie M0-M12 (cohérence pdg-eventy/02-finance/)."),
    Bullet("Verrouillage des écritures du mois clos."),

    H1("5. Reporting financier"),

    H2("5.1. Reporting interne mensuel"),
    Bullet("CA mois M (réalisé vs prévisionnel)."),
    Bullet("Marge brute mois M (réalisé vs prévisionnel)."),
    Bullet("Charges mois M par grande catégorie."),
    Bullet("Résultat net mois M."),
    Bullet("Trésorerie disponible (compte courant)."),
    Bullet("Solde compte cantonné."),
    Bullet("Indicateurs clés (NPS, voyageurs, conversions)."),

    H2("5.2. Reporting trimestriel APST"),
    Bullet("Cohérence Note expert-comptable."),
    Bullet("Trésorerie en transit (compte cantonné — pic et solde fin de période)."),
    Bullet("Volumes opérationnels (voyageurs accueillis, voyages opérés)."),
    Bullet("Sinistralité (réclamations, litiges, indemnités versées)."),
    Bullet("Conformité opérationnelle."),

    H2("5.3. Reporting annuel"),
    Bullet("Bilan, compte de résultat, annexe."),
    Bullet("Rapport de gestion (cohérence document dédié)."),
    Bullet("Rapport spécial commissaire aux comptes (si nommé)."),
    Bullet("Reporting RSE (cohérence Politique RSE)."),
    Bullet("Reporting CSRD si seuils atteints (cible An 4-5)."),

    H1("6. Contrôles internes"),

    H2("6.1. Séparation des tâches (à terme)"),
    Bullet("An 1 : Président + expert-comptable (taille équipe limitée)."),
    Bullet("An 2-3 : recrutement comptable interne — séparation initiation / validation."),
    Bullet("An 4+ : DAF + comptable interne — séparation complète des tâches."),

    H2("6.2. Contrôles automatiques"),
    Bullet("Rapprochement automatique Stripe ↔ comptabilité."),
    Bullet("Alertes solde compte cantonné anormal."),
    Bullet("Alertes mouvements bancaires non rapprochés."),
    Bullet("Alerte cohérence TVA marge / TVA classique."),

    H2("6.3. Audits"),
    Bullet("Audit annuel obligatoire (CAC à partir des seuils L227-9-1) — cohérence PV AGOA."),
    Bullet("Audit interne trimestriel (cohérence Plan d'audit interne)."),
    Bullet("Audits APST trimestriels."),

    H1("7. Conservation des pièces"),
    Bullet("Pièces comptables : 10 ans (article L123-22 Code commerce)."),
    Bullet("Bulletins de paie : 5 ans (Code travail)."),
    Bullet("Documents fiscaux : 6 ans (Livre des procédures fiscales)."),
    Bullet("Contrats commerciaux : durée du contrat + 5 ans."),
    Bullet("Données voyageurs : 5 ans après dernier voyage (RGPD), sauf comptabilité 10 ans."),
    Bullet("Conservation cloud sécurisé France + sauvegarde mensuelle long terme."),

    H1("8. Indicateurs financiers clés"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Délai clôture mensuelle (jours)", "≤ 10 j", "≤ 5 j"],
        ["Délai clôture annuelle (jours)", "≤ 90 j", "≤ 45 j"],
        ["Rapprochement bancaire à jour", "Hebdomadaire", "Quotidien"],
        ["Marge brute / CA", "10-14 %", "12-15 %"],
        ["Marge nette / CA", "≥ 2 %", "≥ 5 %"],
        ["Trésorerie disponible (mois charges)", "≥ 1 mois", "≥ 3 mois"],
        ["Pic compte cantonné / garantie APST", "≤ 100 %", "≤ 90 %"],
        ["Délai paiement fournisseurs (LME)", "≤ 25 j", "≤ 15 j"],
      ],
    }),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. À valider par l'expert-comptable et mettre à jour annuellement.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Note expert-comptable, Guide TVA marge tourisme, Plan d'audit interne, Statuts SAS, Tableau de bord opérationnel, Plan de continuité d'activité, Politique d'achats responsables, Rapport de gestion annuel.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN D'AUDIT INTERNE
// ============================================================
function planAuditInterne() {
  return [
    bandeauTitre(
      "PLAN D'AUDIT INTERNE EVENTY LIFE",
      "Méthodologie d'audits financiers, conformité et opérationnels — référentiel équipe",
    ),
    Spacer(160),

    P("Le présent plan formalise le dispositif d'audit interne d'EVENTY LIFE SAS. Il vise à garantir la maîtrise des risques (financiers, opérationnels, conformité), la fiabilité des informations et la performance globale. Il complète la Procédure d'audit qualité HRA (qui couvre les partenaires) et le Plan de continuité d'activité (qui couvre la résilience).", { italics: true }),

    P("L'audit interne Eventy n'est pas un dispositif bureaucratique. C'est un outil de pilotage qui permet de prévenir les défaillances, d'apprendre des erreurs et d'améliorer en continu. Il est mené avec rigueur mais aussi avec bienveillance — chercher la cause racine, pas le coupable.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Norme ISO 19011 (lignes directrices pour l'audit des systèmes de management)."),
    Bullet("IFACI — Institut Français de l'Audit et du Contrôle Internes (référentiel)."),
    Bullet("Code Monétaire et Financier (pour les obligations APST)."),
    Bullet("RGPD — audits de conformité données."),
    Bullet("ANSSI — audits de cybersécurité."),
    Bullet("Politique RSE Eventy (cohérence)."),

    H1("2. Objectifs"),
    Bullet("Vérifier l'application des procédures Eventy."),
    Bullet("Identifier les risques opérationnels et les zones de fragilité."),
    Bullet("Mesurer la conformité réglementaire (Atout France, APST, RGPD, fiscalité)."),
    Bullet("Évaluer l'efficacité des contrôles internes."),
    Bullet("Proposer des améliorations concrètes."),
    Bullet("Préparer les audits externes (CAC, APST, prestataires)."),

    H1("3. Périmètre des audits internes"),

    H2("3.1. Audit financier"),
    Bullet("Tenue comptable (cohérence Plan comptable et processus mensuel)."),
    Bullet("Rapprochements bancaires."),
    Bullet("TVA marge tourisme (cohérence Guide TVA marge)."),
    Bullet("Compte cantonné (cohérence engagement APST)."),
    Bullet("Délais de paiement fournisseurs (cohérence Politique d'achats responsables)."),

    H2("3.2. Audit opérationnel"),
    Bullet("Procédures de réservation et paiement (cohérence Manuel des opérations quotidiennes)."),
    Bullet("Gestion des voyages en cours (cohérence Méthodologie de création de voyage)."),
    Bullet("Audit qualité HRA (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Procédure de réclamation (cohérence Procédure de réclamation détaillée)."),
    Bullet("Pack Sérénité — délai d'activation et résolution."),

    H2("3.3. Audit conformité"),
    Bullet("Conformité Code du tourisme (Atout France, IM, RC Pro)."),
    Bullet("Conformité APST (compte cantonné, garantie financière, reporting trimestriel)."),
    Bullet("Conformité RGPD (cohérence Politique de confidentialité, DPA sous-traitance)."),
    Bullet("Conformité fiscale (cohérence Guide TVA marge)."),
    Bullet("Conformité Code consommation (CGV, information précontractuelle)."),

    H2("3.4. Audit cybersécurité"),
    Bullet("Cohérence avec Politique cybersécurité."),
    Bullet("Pentest annuel externe (cohérence document dédié)."),
    Bullet("Audit configuration cloud."),
    Bullet("Audit habilitations RBAC."),
    Bullet("Phishing test trimestriel."),

    H2("3.5. Audit RSE"),
    Bullet("Cohérence avec Politique RSE."),
    Bullet("Indicateurs RSE chiffrés An 1/An 5."),
    Bullet("Bilan carbone (cohérence Charte engagement carbone)."),
    Bullet("Achats responsables (cohérence Politique d'achats responsables)."),
    Bullet("Mobilité durable (cohérence Plan de mobilité durable)."),

    H1("4. Calendrier d'audit annuel type"),
    makeTable({
      widths: [3744, 5616],
      header: ["Période", "Audits programmés"],
      rows: [
        ["T1 (janv-mars)", "Audit financier annuel (préparation comptes), audit RSE annuel, audit conformité Atout France/APST"],
        ["T2 (avr-juin)", "Audit cybersécurité (pentest), audit RGPD avec DPO, phishing test"],
        ["T3 (juil-sept)", "Audit opérationnel (réservations, voyages en cours), audit qualité HRA récurrent"],
        ["T4 (oct-déc)", "Audit accessibilité numérique, audit conflits d'intérêts, préparation clôture"],
      ],
    }),

    H1("5. Méthodologie d'audit"),

    H2("5.1. Phase 1 — Préparation (T-30 jours)"),
    Bullet("Définition du périmètre et des objectifs de l'audit."),
    Bullet("Désignation de l'auditeur (interne ou externe selon nature)."),
    Bullet("Constitution du référentiel d'audit (procédures, indicateurs, normes)."),
    Bullet("Notification aux parties prenantes."),

    H2("5.2. Phase 2 — Collecte (T-30 à T-7 jours)"),
    Bullet("Demande de documents (procédures, registres, rapports)."),
    Bullet("Examen documentaire."),
    Bullet("Préparation de la grille d'évaluation."),

    H2("5.3. Phase 3 — Réalisation sur site (1-3 jours)"),
    Bullet("Réunion d'ouverture (objectifs, déroulement, calendrier)."),
    Bullet("Entretiens avec les parties prenantes."),
    Bullet("Tests de procédures (échantillonnage représentatif)."),
    Bullet("Vérifications de conformité."),
    Bullet("Réunion de clôture (premiers retours)."),

    H2("5.4. Phase 4 — Restitution (T+15 jours)"),
    Bullet("Rapport d'audit formalisé."),
    Bullet("Constat des points forts."),
    Bullet("Constat des écarts (mineur, majeur, critique)."),
    Bullet("Recommandations chiffrées et priorisées."),
    Bullet("Délais d'action proposés."),

    H2("5.5. Phase 5 — Suivi des actions (T+15 à T+90)"),
    Bullet("Plan d'action validé par le Président."),
    Bullet("Suivi de l'implémentation."),
    Bullet("Revue à 30, 60, 90 jours."),
    Bullet("Bilan formel à la fin de la période."),

    H1("6. Niveaux de criticité des écarts"),
    makeTable({
      widths: [2496, 3744, 3120],
      header: ["Niveau", "Description", "Délai d'action"],
      rows: [
        ["Mineur", "Écart sans impact direct sur la qualité ou la conformité", "≤ 90 jours"],
        ["Modéré", "Écart susceptible d'affecter la qualité ou la conformité", "≤ 30 jours"],
        ["Majeur", "Écart compromettant la qualité ou la conformité", "≤ 14 jours"],
        ["Critique", "Écart mettant en cause la sécurité voyageur ou la viabilité", "Action immédiate"],
      ],
    }),

    H1("7. Auditeurs"),

    H2("7.1. Auditeurs internes"),
    Bullet("Président (audits stratégiques)."),
    Bullet("Référent sécurité (audits cyber, à partir An 2)."),
    Bullet("Référent RSE (audits RSE et carbone, à partir An 2)."),
    Bullet("Comptable interne (audits financiers, à partir An 2)."),

    H2("7.2. Auditeurs externes"),
    Bullet("Commissaire aux comptes (CAC) — audit financier annuel à partir des seuils L227-9-1."),
    Bullet("Cabinet certifié PASSI — pentest annuel."),
    Bullet("DPO externe — audit RGPD."),
    Bullet("Cabinet RSE — audit ISO 26000 (cible An 3)."),
    Bullet("Cabinet ISO 27001 — audit cybersécurité (cible An 3)."),

    H2("7.3. Indépendance"),
    Bullet("L'auditeur ne peut pas auditer son propre travail (sauf An 1 avec validation Président)."),
    Bullet("Cohérence avec Politique conflits d'intérêts."),
    Bullet("Confidentialité absolue des informations partagées."),
    Bullet("Refus de toute pression sur les conclusions."),

    H1("8. Suivi des recommandations"),
    Bullet("Tableau de suivi des actions (centralisé, mis à jour mensuellement)."),
    Bullet("Reporting trimestriel au Président."),
    Bullet("Reporting annuel aux investisseurs (cohérence Pacte associés Seed)."),
    Bullet("Réception des actions clôturées validée par l'auditeur."),

    H1("9. Indicateurs d'audit"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Audits internes réalisés / an", "≥ 8", "≥ 20"],
        ["Audits externes / an", "≥ 2", "≥ 6"],
        ["Délai moyen restitution (jours)", "≤ 21 j", "≤ 14 j"],
        ["Taux d'écarts critiques", "0", "0"],
        ["Taux d'écarts majeurs résolus < 14 j", "100 %", "100 %"],
        ["Taux de mise en œuvre recommandations", "≥ 90 %", "≥ 95 %"],
      ],
    }),

    H1("10. Engagements éthiques d'audit"),
    Bullet("Vérité absolue dans les constats (refus du maquillage, refus de l'omission)."),
    Bullet("Bienveillance dans la formulation (chercher la cause racine, pas le coupable)."),
    Bullet("Confidentialité absolue."),
    Bullet("Non-représailles contre les auditeurs ou les audités."),
    Bullet("Indépendance de jugement."),
    Bullet("Restitution publique partielle (rapport synthétique aux investisseurs et partenaires)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan comptable et processus mensuel, Guide TVA marge tourisme, Procédure d'audit qualité HRA, Politique cybersécurité, Politique RSE, Politique RGPD, Plan de continuité d'activité, Politique conflits d'intérêts.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// Document commun
// ============================================================
function makeDoc({ title, description, footerLeft, children }) {
  return new Document({
    creator: "David Eventy — Eventy Life SAS",
    title, description,
    styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
    numbering: { config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      footers: { default: new Footer({ children: [new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: footerLeft, size: 14, color: COLOR.gray, font: "Calibri" }),
          new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
          new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
        ],
      })] }) },
      children,
    }],
  });
}

async function generate() {
  const outputs = [
    {
      file: "docs/garanties/Eventy-Life-Guide-TVA-Marge-Tourisme.docx",
      title: "Eventy Life — Guide TVA marge tourisme",
      description: "Régime spécial TVA marge tourisme — application opérationnelle Eventy.",
      footer: "EVENTY LIFE SAS — Guide TVA marge tourisme",
      children: guideTVAMarge(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Comptable-Processus.docx",
      title: "Eventy Life — Plan comptable et processus comptable",
      description: "Plan de comptes adapté tourisme et processus comptable mensuel.",
      footer: "EVENTY LIFE SAS — Plan comptable et processus",
      children: planComptable(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Audit-Interne.docx",
      title: "Eventy Life — Plan d'audit interne",
      description: "Méthodologie d'audits financiers, conformité, opérationnels.",
      footer: "EVENTY LIFE SAS — Plan d'audit interne",
      children: planAuditInterne(),
    },
  ];

  for (const out of outputs) {
    const doc = makeDoc({ title: out.title, description: out.description, footerLeft: out.footer, children: out.children });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(out.file, buffer);
    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`✓ ${path.basename(out.file)} (${sizeKB} KB)`);
  }
}

generate().catch((err) => {
  console.error("ERREUR :", err);
  process.exit(1);
});
