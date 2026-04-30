/**
 * Eventy Life — Trois documents complémentaires
 *
 *   1. Document de référence banque domiciliataire (préparation J0-J+60)
 *   2. Plan de Continuité d'Activité (PCA) global Eventy Life
 *   3. Dossier de presse Eventy Life (relations médias)
 *
 * Usage : node scripts/garanties/build-banque-pca-presse.js
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
  red: "C0392B", redLt: "FADBD8",
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
  spacing: { after: 60, line: 260 },
  children: [new TextRun({ text, size: 20, font: "Calibri" })] }); }
function Numbered(text) { return new Paragraph({ numbering: { reference: "numbers", level: 0 },
  spacing: { after: 60, line: 260 },
  children: [new TextRun({ text, size: 20, font: "Calibri" })] }); }
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
function Encart({ title, lines, color = COLOR.orange, fill = COLOR.cream }) {
  const lineParas = lines.map((line, i) => new Paragraph({
    alignment: line.align || AlignmentType.JUSTIFIED,
    spacing: { after: i === lines.length - 1 ? 0 : 80 },
    children: [new TextRun({ text: line.text, size: line.size || 20,
      bold: !!line.bold, italics: !!line.italics,
      color: line.color || COLOR.black, font: "Calibri" })],
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.DOUBLE, size: 18, color },
        left: { style: BorderStyle.DOUBLE, size: 18, color },
        bottom: { style: BorderStyle.DOUBLE, size: 18, color },
        right: { style: BorderStyle.DOUBLE, size: 18, color } },
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 360, right: 360 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
          children: [new TextRun({ text: title, size: 24, bold: true, color, font: "Calibri" })] }),
        ...lineParas,
      ] })] })] });
}

// ============================================================
// DOCUMENT 1 — DOCUMENT BANQUE DOMICILIATAIRE
// ============================================================
function documentBanque() {
  return [
    bandeauTitre(
      "DOCUMENT DE RÉFÉRENCE — BANQUE DOMICILIATAIRE",
      "Préparation à l'ouverture des comptes professionnels Eventy Life · J0 → J+60",
    ),
    Spacer(160),

    P("Le présent document a été rédigé à l'attention de la banque pressentie comme domiciliataire des comptes professionnels d'EVENTY LIFE SAS. Il synthétise l'identité de la société, son modèle économique, ses besoins bancaires précis et les flux financiers attendus, afin de faciliter l'instruction du dossier d'ouverture et la mise en place des comptes (compte d'exploitation + compte cantonné).", { italics: true }),

    H1("1. Identité de la société"),
    makeTable({
      widths: [3500, 5860],
      header: ["Élément", "Information"],
      rows: [
        ["Dénomination sociale", "EVENTY LIFE — Société par Actions Simplifiée (SAS)"],
        ["Statut", "En cours de création / récemment immatriculée au RCS"],
        ["SIREN / SIRET", "[à attribuer]"],
        ["Code NAF / APE", "7912Z — Activités des voyagistes"],
        ["Capital social initial", "3 000 € (intégralement libéré)"],
        ["Représentant légal", "M. David Eventy, Président, Fondateur"],
        ["Adresse du siège", "[adresse complète à confirmer post-immatriculation]"],
        ["Adresse électronique", "eventylife@gmail.com"],
        ["Site officiel", "eventylife.fr"],
        ["Numéro IM Atout France (cible)", "IM [###-###-###] (à attribuer post-immatriculation)"],
        ["Garantie financière (cible)", "APST — 1 600 000 € An 1, indexée"],
        ["Assurance RC Pro Tourisme (cible)", "1 500 000 € par sinistre — Galian / Hiscox / CMB"],
      ],
    }),

    H1("2. Activité et modèle économique"),
    P("EVENTY LIFE est un opérateur de voyages à forfait au sens du Code du Tourisme (articles L211-1 et suivants), en cours d'immatriculation auprès d'Atout France. La société commercialise des voyages de groupe organisés (38 voyageurs cibles, 800 € panier moyen TTC) à destination de la France et de l'Europe à portée de bus, ainsi que du Maroc."),
    P("Le modèle économique repose sur une architecture distribuée des marges :"),
    Bullet("Marge socle Eventy ≈ 8 % sur HRA refacturé (hôtels, restaurants, activités)."),
    Bullet("Commission Vendeur 5 % HT du CA voyage placé."),
    Bullet("Commission Créateur 3 points sur HRA refacturé."),
    Bullet("Total marge brute opérée : 11,1 % du CA voyage."),
    Bullet("Redistribution aux indépendants français : 6,8 % du CA."),
    Bullet("Eventy net après charges : ≈ 2 % du CA An 1, ≈ 2,3 % du CA An 5."),

    H1("3. Volumes financiers prévisionnels"),
    makeTable({
      widths: [3500, 1500, 1500, 1500, 1360],
      header: ["Indicateur (M€)", "An 1", "An 2", "An 3", "An 5"],
      rows: [
        ["Chiffre d'affaires HT cumulé", "16,0", "80,0", "160,0", "320,0"],
        ["Encaissements voyageurs", "16,0", "80,0", "160,0", "320,0"],
        ["Décaissements fournisseurs", "14,2", "71,2", "142,3", "284,5"],
        ["Pic des fonds clients en transit", "1,25", "4,25", "8,5", "17,0"],
        ["Trésorerie cumulée fin de période", "0,62", "6,7", "13,5", "25,0"],
        ["Volume mensuel pic (juillet)", "2,5", "8,5", "17,0", "34,0"],
        ["Volume mensuel creux (février)", "0,8", "4,0", "8,0", "16,0"],
      ],
    }),

    H1("4. Besoins bancaires"),

    H2("4.1. Compte d'exploitation principal"),
    Bullet("Compte courant professionnel — pour l'activité courante de la société."),
    Bullet("Encaissement automatique depuis Stripe Connect (revenu net après commission Stripe)."),
    Bullet("Décaissements vers fournisseurs (HRA, autocaristes, transporteurs aériens) — virements bancaires."),
    Bullet("Versements aux indépendants (créateurs, vendeurs, accompagnateurs) — virements bancaires sous 21 jours."),
    Bullet("Charges fixes (équipe interne, technique, conformité, marketing)."),
    Bullet("Volumes mensuels An 1 : encaissements ≈ 0,8 à 2,5 M€ · décaissements ≈ 0,7 à 2,3 M€."),

    H2("4.2. Compte cantonné — fonds de garantie et réserve volontaire"),
    P("Eventy Life souhaite ouvrir un compte cantonné dédié aux fonds de garantie, distinct du compte d'exploitation. Ce compte cantonné héberge :"),
    Bullet("Contre-garantie personnelle dirigeant 10 000 € (compte bloqué dédié) — convention avec l'APST."),
    Bullet("Réserve volontaire « risques tourisme » 5 % du CA annuel — clause statutaire (article 13 des Statuts)."),
    Bullet("Estimation An 1 : 50 K€ minimum à fin d'exercice."),
    Bullet("Estimation An 5 : 1 250 K€ minimum à fin d'exercice."),
    P("Le compte cantonné est soumis à des règles spécifiques (double signature pour sortie, reporting trimestriel à l'APST, audit annuel par expert-comptable + commissaire aux comptes le cas échéant)."),

    H2("4.3. Services attendus"),
    Bullet("Banque en ligne professionnelle (interface moderne, API pour intégration plateforme Eventy)."),
    Bullet("Virements SEPA illimités (vers indépendants, fournisseurs)."),
    Bullet("Virements internationaux (vers HRA et transporteurs hors France — Espagne, Portugal, Maroc, Italie, etc.)."),
    Bullet("Cartes bancaires d'entreprise multi-utilisateurs avec plafonds personnalisables (équipe, accompagnateurs en mission)."),
    Bullet("Encaissement carte (intégré via Stripe ou natif banque)."),
    Bullet("Ligne de découvert autorisée (facultative — BFR négatif structurel rend peu probable son besoin)."),
    Bullet("Gestion de trésorerie : compte rémunéré ou placement court terme pour la trésorerie excédentaire (à compter de l'An 2)."),

    H1("5. Garantie de prêt bancaire (le cas échéant)"),
    P("Eventy Life ne prévoit pas, dans son scénario central, de recourir à un emprunt bancaire significatif. La société est auto-financée et présente un BFR négatif structurel (-33 jours An 1, -25 jours An 5). Toutefois, en complément :"),
    Bullet("Eventy peut solliciter un prêt court terme de trésorerie pour absorber la saisonnalité (le cas échéant)."),
    Bullet("Eventy bénéficie de la Garantie Création Bpifrance, qui couvre 60 à 70 % d'un éventuel prêt bancaire."),
    Bullet("Les financements publics (Bpifrance Innovation, ADI, FEDER) sont activement sollicités en parallèle."),

    H1("6. Documents à transmettre à la banque"),
    Bullet("Extrait Kbis de moins de 3 mois (post-immatriculation)."),
    Bullet("Statuts SAS Eventy Life signés (Eventy-Life-Statuts-SAS.pdf)."),
    Bullet("Justificatif d'identité du Président (CNI ou passeport)."),
    Bullet("Justificatif de domicile du Président."),
    Bullet("Justificatif d'occupation des locaux du siège (bail commercial ou domiciliation)."),
    Bullet("Compte de résultat prévisionnel An 1 / An 2 (extrait du dossier APST)."),
    Bullet("Plan de trésorerie 24 mois (extrait du dossier APST)."),
    Bullet("Brochure commerciale Eventy Life (Eventy-Life-Brochure-Commerciale.pdf)."),
    Bullet("Le cas échéant, attestation APST de garantie financière + attestation RC Pro."),

    H1("7. Calendrier d'ouverture cible"),
    makeTable({
      widths: [2200, 4500, 2660],
      header: ["Échéance", "Action", "Statut"],
      rows: [
        ["J + 7 (post-Kbis)", "Premier rendez-vous banque · présentation projet", "À planifier"],
        ["J + 14", "Constitution du dossier complet d'ouverture", "À faire"],
        ["J + 21", "Décision banque sur l'ouverture des comptes", "Attendu"],
        ["J + 30", "Activation des comptes (exploitation + cantonné)", "Cible"],
        ["J + 30", "Versement de la contre-garantie 10 K€ sur compte bloqué", "Cible"],
        ["J + 35", "Premier prélèvement test depuis Stripe Connect", "Cible"],
        ["J + 60", "Compte opérationnel pour le lancement commercial", "Cible"],
      ],
    }),

    H1("8. Banques pressenties"),
    Bullet("Banque française traditionnelle avec offre PME tourisme — interlocuteur dédié, agence physique."),
    Bullet("Banque en ligne professionnelle (Qonto, Shine, etc.) — agilité, API, coûts maîtrisés."),
    Bullet("Banque coopérative (Crédit Coopératif, Crédit Mutuel) — sensibilité aux modèles d'économie distributive et RSE."),
    P("Eventy Life sollicitera idéalement une combinaison : banque principale traditionnelle pour le sérieux institutionnel + banque en ligne pour la fluidité opérationnelle. Le choix final dépendra des conditions tarifaires, de la qualité de l'interlocuteur et de la flexibilité opérationnelle.", { italics: true }),

    H1("9. Engagements d'Eventy"),
    Bullet("Transparence totale sur les flux financiers — accès aux extraits, reporting trimestriel possible."),
    Bullet("Coopération en cas d'audit ou de contrôle de la banque."),
    Bullet("Maintien permanent des garanties APST et RC Pro."),
    Bullet("Respect strict du cantonnement des fonds clients — distinction nette entre compte d'exploitation et compte cantonné."),
    Bullet("Notification sans délai de toute évolution significative (changement de statut, dirigeant, structure capitalistique)."),

    Spacer(180),
    P("Contact direct : David Eventy — Président, Fondateur — eventylife@gmail.com — disponibilité 7j/7.", { bold: true, color: COLOR.blue, size: 22 }),
    Spacer(80),
    P("Document confidentiel — destiné aux échanges avec la banque pressentie comme domiciliataire des comptes professionnels.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN DE CONTINUITÉ D'ACTIVITÉ (PCA) GLOBAL
// ============================================================
function pcaGlobal() {
  return [
    bandeauTitre(
      "PLAN DE CONTINUITÉ D'ACTIVITÉ EVENTY LIFE",
      "PCA global · résilience corporate · au-delà des incidents voyage",
      COLOR.blue,
    ),
    Spacer(160),

    P("Le présent Plan de Continuité d'Activité (PCA) global formalise la stratégie d'Eventy Life pour assurer la continuité de son activité face aux risques majeurs susceptibles d'affecter la société elle-même (et non un voyage spécifique, déjà couvert par le Manuel d'incident voyage).", { italics: true }),

    P("Ce PCA est complémentaire au Manuel d'incident voyage et à la Partie 9 du dossier APST. Il couvre les scénarios stratégiques de continuité corporate : cyber-incident grave, indisponibilité du dirigeant, défaillance d'un fournisseur clé, perte de la garantie financière APST, crise sanitaire ou géopolitique étendue.", { italics: true }),

    H1("1. Objectifs du PCA"),
    Numbered("Identifier les risques majeurs susceptibles d'affecter la continuité corporate d'Eventy Life."),
    Numbered("Définir des plans de réponse et des protocoles d'activation pour chaque scénario."),
    Numbered("Garantir le maintien des engagements voyageurs malgré les perturbations."),
    Numbered("Préserver la confiance des partenaires (APST, Atout France, banque, investisseurs, fournisseurs)."),
    Numbered("Assurer la résilience financière et opérationnelle de la société."),

    H1("2. Cartographie des risques majeurs (corporate)"),
    makeTable({
      widths: [600, 2500, 1500, 1500, 3260],
      header: ["#", "Risque", "Probabilité", "Impact", "Mitigation principale"],
      rows: [
        ["1", "Cyber-incident grave (intrusion, ransomware, fuite massive)", "Faible", "Très élevé", "Architecture Scaleway France ISO 27001 + sauvegardes chiffrées + assurance cyber + plan de réponse incident"],
        ["2", "Indisponibilité prolongée du dirigeant", "Faible", "Très élevé", "Documentation interne exhaustive, recrutement Resp. ops M2, procuration bancaire double signature, assurance homme-clé An 2"],
        ["3", "Défaillance d'un fournisseur clé (ex. autocariste majeur)", "Modérée", "Élevé", "Diversification 8-15 autocaristes français, contrats avec back-up, marge de réactivité 24-48 h"],
        ["4", "Perte de la garantie financière APST", "Très faible", "Critique", "Plan B Groupama Assurance-Crédit prêt, conformité APST irréprochable, contre-garantie dirigeant"],
        ["5", "Perte de l'immatriculation Atout France", "Très faible", "Critique", "Conformité réglementaire totale, audit annuel avocat tourisme, mise à jour permanente"],
        ["6", "Crise sanitaire ou géopolitique étendue", "Modérée", "Critique", "Garantie financière APST, fonds de réserve volontaire 5 % CA, capacité d'arrêt opérationnel rapide"],
        ["7", "Défaillance ou résiliation Stripe (paiements)", "Très faible", "Très élevé", "Plan B PayPlug ou Adyen pré-évalué, basculement possible sous 7 jours"],
        ["8", "Litige juridique majeur (action collective voyageurs)", "Faible", "Élevé", "RC Pro 1,5 M€/sinistre, conformité directive UE 2015/2302, médiation MTV en amont"],
        ["9", "Perte de financement (échec levée Seed)", "Modérée", "Modéré", "Auto-financement de référence — la levée est un accélérateur, pas une condition de survie"],
        ["10", "Catastrophe naturelle siège social (incendie, dégâts des eaux)", "Très faible", "Modéré", "Données dans le cloud (Scaleway), équipe en télétravail possible, assurance multirisque locale"],
      ],
    }),

    H1("3. Procédures par scénario"),

    H2("3.1. Cyber-incident grave"),
    Numbered("Détection : monitoring continu des serveurs Scaleway, alertes automatiques, notification équipe technique."),
    Numbered("Évaluation initiale dans l'heure : nature de l'incident, périmètre touché, criticité."),
    Numbered("Activation cellule de crise dans les 4 heures (Président + CTO + avocat tourisme + DPO)."),
    Numbered("Bascule sur infrastructure de secours (Scaleway Amsterdam) si nécessaire."),
    Numbered("Notification CNIL sous 72 h en cas de violation de données (art. 33 RGPD)."),
    Numbered("Information des voyageurs concernés sous 72 h en cas de risque élevé (art. 34 RGPD)."),
    Numbered("Audit forensique externe sous 7 jours."),
    Numbered("Communication transparente externe (médias, partenaires, autorités) coordonnée par Président."),
    Numbered("Mesures correctives durables et reporting CNIL final."),

    H2("3.2. Indisponibilité du dirigeant"),
    Numbered("Activation immédiate de la procuration bancaire double signature (Président + DAF)."),
    Numbered("Désignation d'un président intérimaire conformément à l'article 11 des statuts (décision collective)."),
    Numbered("Information des partenaires institutionnels (APST, Atout France, banque) sous 7 jours."),
    Numbered("Reporting renforcé aux Investisseurs Seed."),
    Numbered("Mobilisation de l'assurance « homme-clé » si souscrite (à compter de l'An 2)."),
    Numbered("Maintien de l'activité grâce à l'équipe interne (Resp. ops, CTO, DAF) et aux conseils externes."),

    H2("3.3. Défaillance d'un fournisseur clé (autocariste majeur)"),
    Numbered("Activation immédiate du plan de remplacement (autocariste partenaire de back-up)."),
    Numbered("Couverture des voyages déjà programmés sous 24-48 h."),
    Numbered("Renégociation à chaud avec autocaristes alternatifs si nécessaire."),
    Numbered("Communication transparente aux voyageurs concernés."),
    Numbered("Diversification accélérée du portefeuille autocaristes."),
    Numbered("Reporting Comité de pilotage sous 7 jours."),

    H2("3.4. Perte ou résiliation de la garantie financière APST"),
    Numbered("Notification immédiate au Président."),
    Numbered("Cellule de crise activée sous 4 heures (Président + avocat tourisme + DAF + APST si possible)."),
    Numbered("Activation immédiate du plan B Groupama Assurance-Crédit (dossier pré-préparé)."),
    Numbered("Suspension temporaire de la commercialisation de nouveaux voyages pendant la transition."),
    Numbered("Maintien des engagements pour les voyageurs déjà inscrits — couverture par fonds de réserve volontaire si besoin."),
    Numbered("Communication maîtrisée avec Atout France pour préserver l'immatriculation."),
    Numbered("Bascule effective sous 30 jours maximum."),

    H2("3.5. Crise sanitaire ou géopolitique étendue (type COVID)"),
    Numbered("Cellule de crise stratégique activée."),
    Numbered("Suspension des voyages programmés sur les zones impactées."),
    Numbered("Activation des clauses de force majeure CGV — remboursement intégral aux voyageurs sous 14 jours OU bons d'avoir refusables."),
    Numbered("Communication aux indépendants partenaires sur la durée probable de l'arrêt."),
    Numbered("Mobilisation du fonds de réserve volontaire et de la trésorerie disponible."),
    Numbered("Si crise prolongée : recours aux dispositifs publics (chômage partiel, prêts garantis)."),
    Numbered("Maintien d'une activité minimale (équipe interne) en attendant la reprise."),
    Numbered("Plan de relance progressive dès que la situation le permet."),

    H1("4. Cellule de crise corporate"),
    makeTable({
      widths: [3000, 3500, 2860],
      header: ["Membre", "Mission", "Délai mobilisation"],
      rows: [
        ["Pilote — Président", "Direction stratégique de la crise · décisions finales", "Immédiat"],
        ["Coordination — Resp. opérations", "Coordination opérationnelle · interface équipe", "Sous 2 h"],
        ["Technique — CTO", "Aspects techniques · plateforme · sécurité", "Sous 4 h"],
        ["Finance — DAF", "Trésorerie · capacité de réponse financière", "Sous 4 h"],
        ["Conformité — Avocat tourisme", "Aspects juridiques · obligations réglementaires", "Sous 24 h (avis express)"],
        ["Communication — Resp. marketing", "Communication interne et externe", "Sous 4 h"],
        ["DPO", "Aspects RGPD si données concernées", "Sous 24 h"],
        ["Garant financier APST (informé)", "Coordination si insolvabilité menacée", "Sous 24 h"],
        ["Assureurs (informés)", "RC Pro et Pack Sérénité selon nature", "Sous 24 h"],
      ],
    }),

    H1("5. Reprise après crise"),
    Bullet("Bilan post-crise sous 7 jours : récit factuel, décisions prises, conséquences, alternatives."),
    Bullet("Mesures correctives durables : mise à jour du PCA, formation supplémentaire, ajustement procédures."),
    Bullet("Communication transparente aux voyageurs et aux partenaires sur la résolution."),
    Bullet("Reporting APST, Atout France, RC Pro le cas échéant."),
    Bullet("Mise à jour annuelle du PCA par le Comité de pilotage."),

    H1("6. Tests et exercices"),
    Bullet("Test annuel du plan de bascule cyber (Scaleway Amsterdam) : 1 fois par an."),
    Bullet("Exercice de cellule de crise table-top : 1 fois par an, sur scénario fictif."),
    Bullet("Test de continuité du dirigeant : procuration bancaire validée annuellement."),
    Bullet("Test de bascule fournisseur : 1 simulation par an."),
    Bullet("Audit RGPD et plan de réponse incident : annuel."),

    Spacer(160),
    Encart({
      title: "ENGAGEMENT DE RÉSILIENCE",
      color: COLOR.blue,
      fill: COLOR.blueLt,
      lines: [
        { text: "Eventy Life s'engage à maintenir les engagements voyageurs même en situation de crise.", align: AlignmentType.CENTER, bold: true, italics: true, size: 22 },
        { text: "Aucune décision opérationnelle, aucune contrainte budgétaire ne peut justifier de manquer à la garantie financière, à la responsabilité de plein droit ou à la sécurité physique d'un voyageur.", align: AlignmentType.JUSTIFIED },
      ],
    }),
    Spacer(160),

    P("Document opérationnel interne — Version 1.0 — 30 avril 2026. Mise à jour annuelle obligatoire.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Manuel d'incident voyage (volet voyage), Partie 9 du dossier APST (analyse de risques), Politique RSE (engagements résilience).", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — DOSSIER DE PRESSE
// ============================================================
function dossierPresse() {
  return [
    bandeauTitre(
      "DOSSIER DE PRESSE EVENTY LIFE",
      "À l'attention des journalistes et médias spécialisés tourisme · entrepreneuriat · économie",
    ),
    Spacer(160),

    Encart({
      title: "EN UNE PHRASE",
      color: COLOR.orange,
      fill: COLOR.cream,
      lines: [
        { text: "Eventy Life est une plateforme française de voyages de groupe qui redistribue 6,8 % de son chiffre d'affaires aux indépendants français — une alternative aux plateformes mondialisées qui aspirent la valeur.", align: AlignmentType.CENTER, italics: true, size: 22, color: COLOR.blue },
      ],
    }),
    Spacer(160),

    H1("1. L'histoire d'Eventy Life"),

    H2("1.1. Le constat"),
    P("David Eventy a passé des années à voyager seul, à voyager en groupe, à organiser des séjours pour ses proches. À chaque fois, le même triple écueil : le coût élevé du voyage individuel, la complexité d'organiser un groupe, et l'opacité des marges des opérateurs traditionnels. Plus profondément, il a vu une autre réalité — celle de centaines d'indépendants qui pourraient vivre du voyage : guides amateurs passionnés, accompagnateurs de groupes, retraités du tourisme, animateurs talentueux — qui n'ont pas la structure, la garantie, l'assurance, la plateforme pour exercer en règle."),

    H2("1.2. La solution"),
    P("Eventy Life est née de la rencontre de ces deux réalités : faire d'une frustration consommateur (« je voudrais voyager en groupe sans rien gérer ») l'opportunité de redonner vie à un écosystème indépendant français. La plateforme propose des voyages de groupe organisés où le voyageur n'a rien à gérer — et tout à vivre."),

    H2("1.3. Le modèle économique distribué"),
    P("Eventy redistribue mécaniquement 6,8 % de son chiffre d'affaires aux indépendants français — vendeurs et créateurs — qui placent et conçoivent les voyages. Sur 100 € payés par un voyageur, environ 89 € retournent à l'économie réelle (autocaristes français, hôteliers, restaurateurs, guides). Aucun euro ne transite par une plateforme extra-européenne."),

    H1("2. Les chiffres clés"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "An 1 (2026)", "An 5 (2030)"],
      rows: [
        ["Chiffre d'affaires HT cible", "16 M€", "320 M€"],
        ["Voyageurs annuels cible", "≈ 16 000", "≈ 400 000"],
        ["Indépendants français actifs (créateurs + vendeurs)", "≈ 450", "≈ 5 600"],
        ["Partenaires HRA français référencés", "≈ 200", "≈ 3 000"],
        ["Autocaristes français partenaires", "8-15", "70"],
        ["Redistribution annuelle aux indépendants", "≈ 1,1 M€", "≈ 21,8 M€"],
        ["Effectif interne Eventy Life", "5-6 ETP", "35 ETP"],
        ["Note de satisfaction NPS cible", "≥ + 60", "≥ + 70"],
        ["Couverture géographique", "France + 12 destinations Europe", "Europe complète + charter A320"],
      ],
    }),

    H1("3. Les angles éditoriaux possibles"),

    H2("3.1. Le tourisme français face aux plateformes mondialisées"),
    P("Eventy Life propose une alternative concrète au modèle dominant des OTA (Booking, Expedia, Airbnb) qui prélèvent jusqu'à 22 % de commission sur chaque transaction et concentrent la valeur hors d'Europe. Le modèle distribué d'Eventy fait circuler la valeur dans l'écosystème français : autocaristes, hôteliers, restaurateurs, indépendants. C'est un modèle de souveraineté économique appliqué au tourisme."),

    H2("3.2. La transparence prix radicale"),
    P("Sur chaque fiche voyage de eventylife.fr, le voyageur découvre la décomposition simplifiée du prix qu'il paie : combien va à l'hôtelier, au restaurateur, à l'autocariste, à l'assureur, au vendeur, au créateur, à Eventy. Cette transparence radicale est inédite dans le secteur du voyage organisé — elle assume la marge légitime sans rien cacher."),

    H2("3.3. Le voyage comme bien public"),
    P("Eventy Life se définit comme « rassembleurs ». Le métier n'est pas de vendre des voyages — c'est de réunir 38 personnes inconnues le matin du départ et de leur faire vivre, en quatre jours, quelque chose qu'elles n'auraient pas vécu seules. Un manifeste qui place l'humain et le lien social au centre, dans une époque qui en a besoin."),

    H2("3.4. L'autodidacte qui code 1 million de lignes"),
    P("David Eventy a personnellement développé la plateforme propriétaire d'Eventy Life — plus d'un million de lignes de code, 31 modules backend, 3 300+ tests automatisés — sans investissement extérieur. Une figure d'entrepreneur autodidacte qui démontre que la French Tech peut aussi se construire en dehors des grandes écoles et des fonds de capital-risque."),

    H2("3.5. Le tourisme social et redistributif"),
    P("Le modèle Eventy permet à des centaines d'auto-entrepreneurs de vivre du voyage : créateurs qui conçoivent des séjours uniques, vendeurs qui distribuent à leur communauté, accompagnateurs qui guident sur le terrain. Un modèle de tourisme social et solidaire qui s'inscrit dans la tradition française des UNAT, ANCV et autres dispositifs de démocratisation du voyage."),

    H1("4. Les destinations phares"),
    makeTable({
      widths: [3000, 1500, 4860],
      header: ["Destination", "Prix TTC", "Caractéristiques"],
      rows: [
        ["Lisbonne · Estoril", "599 € · 4j", "Autocar ou vol · capitale qui se redécouvre"],
        ["Marrakech · Atlas", "749 € · 5j", "Vol charter · médinas et hammam"],
        ["Barcelone · Costa Brava", "549 € · 5j", "Autocar · Sagrada + plages"],
        ["Pays-Bas · tulipes", "679 € · 4j", "Autocar · Keukenhof en pleine floraison"],
        ["Prague", "729 € · 4j", "Vol · pont Charles + bières tchèques"],
        ["Andalousie blanche", "899 € · 6j", "Vol + autocar local · Alhambra et flamenco"],
        ["Belgique · Bruges · Gand", "399 € · 3j", "Autocar · weekend découverte"],
        ["Séminaire B2B Côte d'Azur", "1 200 € HT · 3j", "Train · cohésion d'équipe haut de gamme"],
      ],
    }),

    H1("5. La vision long terme"),
    Bullet("An 1 : France + 12 destinations Europe Sud (Espagne, Portugal, Italie, Maroc)."),
    Bullet("An 2 : Ouverture Europe Centrale (Tchéquie, Allemagne, Pays-Bas, Belgique, Luxembourg)."),
    Bullet("An 3 : Charter A320 propre (159 passagers) · destinations longues : Grèce, Croatie, Tunisie."),
    Bullet("An 5 : Europe complète (25+ destinations) + premières destinations long-courriers test."),

    H1("6. Le fondateur — David Eventy"),
    P("David Eventy est l'unique fondateur, président et opérateur d'Eventy Life. Entrepreneur autodidacte, il a personnellement développé la plateforme technique et auto-financé l'intégralité de la R&D pré-lancement. Sa vision est profondément humaine : « Le client doit se sentir aimé. Pas satisfait, pas bien servi — aimé. »"),
    P("Engagement personnel total : David Eventy s'engage à plein temps sur le projet, a apporté le capital initial et a constitué une contre-garantie personnelle de 10 000 € auprès de l'APST. Une posture qui démontre l'alignement avec les voyageurs, les indépendants partenaires et les futurs investisseurs."),

    H1("7. Quelques verbatim possibles"),
    P("« Eventy n'est pas né dans un incubateur ni d'une étude de marché. Eventy est né d'un homme qui aime voyager, qui aime entreprendre, et qui aime les gens. »", { italics: true }),
    P("« On ne vend pas des voyages — on réunit des gens. La différence est tout sauf cosmétique. »", { italics: true }),
    P("« 89 € sur 100 € retournent à l'économie réelle. Ce n'est pas une posture marketing — c'est notre architecture économique. Et nous avons rendu cette répartition publique, sur chaque fiche voyage. »", { italics: true }),
    P("« Notre métier consiste à faire monter dans le même bus une retraitée nantaise, un cadre lyonnais, un étudiant marseillais, et de leur faire vivre quelque chose qu'ils n'auraient pas vécu seuls. »", { italics: true }),
    P("« Les indépendants français qui rejoignent Eventy ne sont pas des prestataires — ce sont des partenaires. Et chacun d'eux peut, à son tour, devenir vendeur s'il le souhaite. L'écosystème est ouvert. »", { italics: true }),

    H1("8. Visuels disponibles"),
    Bullet("Photographies haute définition des voyages programmés (avec accord des partenaires HRA)."),
    Bullet("Portrait du fondateur David Eventy."),
    Bullet("Captures d'écran de la plateforme eventylife.fr."),
    Bullet("Logo Eventy Life en différents formats (PNG transparent, vectoriel SVG, fond clair, fond sombre)."),
    Bullet("Vidéos courtes de présentation (en cours de production)."),
    P("Tous les visuels sont libres d'utilisation pour les médias couvrant Eventy Life, sous réserve du crédit photo « © Eventy Life ».", { italics: true }),

    H1("9. Garanties professionnelles"),
    Bullet("Immatriculation Atout France au registre des opérateurs de voyages et de séjours (numéro IM cible : ###-###-###)."),
    Bullet("Garantie financière APST (Association Professionnelle de Solidarité du Tourisme)."),
    Bullet("Assurance Responsabilité Civile Professionnelle Tourisme · plafond 1 500 000 € par sinistre."),
    Bullet("Médiation Tourisme et Voyage (MTV) · gratuite pour le voyageur."),
    Bullet("Conformité directive (UE) 2015/2302 sur les voyages à forfait."),
    Bullet("Données voyageurs hébergées en France (Scaleway Paris) · RGPD."),

    Spacer(180),
    Encart({
      title: "CONTACT PRESSE",
      color: COLOR.blue,
      fill: COLOR.blueLt,
      lines: [
        { text: "David Eventy — Président, Fondateur d'Eventy Life SAS", align: AlignmentType.CENTER, bold: true, size: 24, color: COLOR.orange },
        { text: "Email : eventylife@gmail.com", align: AlignmentType.CENTER, size: 22 },
        { text: "Site : eventylife.fr", align: AlignmentType.CENTER, size: 22 },
        { text: "Disponibilité pour interviews : sur rendez-vous · réponse sous 48 h ouvrées", align: AlignmentType.CENTER, italics: true, size: 18 },
      ],
    }),

    Spacer(120),
    P("Documentation complémentaire disponible sur demande : dossier de garantie financière APST (119 pages), dossier investisseur, plan marketing, politique RSE.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Document-Banque-Domiciliataire.docx",
      title: "Eventy Life — Document de référence banque domiciliataire",
      description: "Préparation à l'ouverture des comptes professionnels Eventy Life.",
      footer: "EVENTY LIFE SAS — Document banque domiciliataire · Confidentiel",
      children: documentBanque(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Continuite-Activite.docx",
      title: "Eventy Life — Plan de Continuité d'Activité (PCA) global",
      description: "PCA global Eventy Life — résilience corporate.",
      footer: "EVENTY LIFE SAS — Plan de Continuité d'Activité",
      children: pcaGlobal(),
    },
    {
      file: "docs/garanties/Eventy-Life-Dossier-Presse.docx",
      title: "Eventy Life — Dossier de presse",
      description: "Dossier de presse à l'attention des journalistes et médias.",
      footer: "EVENTY LIFE SAS — Dossier de presse",
      children: dossierPresse(),
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
