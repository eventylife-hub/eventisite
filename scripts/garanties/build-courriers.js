/**
 * Eventy Life — Courriers d'accompagnement formels
 *
 * Lettres formelles de demande à transmettre :
 *   1. À Atout France — demande d'immatriculation au registre des opérateurs de voyages
 *   2. À l'APST — demande d'adhésion + octroi d'une garantie financière
 *
 * Produit : Eventy-Life-Courriers-APST-AtoutFrance.docx (2 lettres, 1 page chacune)
 *
 * Usage : node scripts/garanties/build-courriers.js [output.docx]
 */

const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Footer,
  AlignmentType,
  HeadingLevel,
  PageNumber,
  PageBreak,
  TabStopType,
  TabStopPosition,
} = require("docx");

const COLOR = {
  blue: "1F4E79",
  orange: "E87722",
  black: "1A1A1A",
  gray: "555555",
};

// Helpers
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after !== undefined ? opts.after : 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    indent: opts.indent,
    children: [
      new TextRun({
        text,
        size: opts.size || 22,
        font: "Calibri",
        color: opts.color || COLOR.black,
        bold: opts.bold,
        italics: opts.italics,
      }),
    ],
  });
}
function PR(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after !== undefined ? opts.after : 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: runs,
  });
}
function Spacer(after = 200) {
  return new Paragraph({ spacing: { after }, children: [new TextRun("")] });
}

function blocExpediteur() {
  return [
    P("EVENTY LIFE SAS (en cours de constitution)", { bold: true, after: 60 }),
    P("Représentée par M. David Eventy", { after: 60 }),
    P("Président, Fondateur", { after: 60 }),
    P("Adresse : [adresse postale du siège social — à compléter]", { after: 60 }),
    P("Adresse électronique : eventylife@gmail.com", { after: 60 }),
    P("Site internet : eventylife.fr", { after: 60 }),
    P("SIREN : [à attribuer post-immatriculation]", { after: 60 }),
  ];
}

function blocDestinataire(lignes) {
  return lignes.map((l, i) => P(l, { after: i === lignes.length - 1 ? 100 : 40, align: AlignmentType.LEFT, indent: { left: 5400 } }));
}

function blocLieuDate(lieu) {
  return [
    Spacer(60),
    P(lieu, { align: AlignmentType.RIGHT, indent: { left: 5400 } }),
    Spacer(120),
  ];
}

function blocObjet(text) {
  return PR([
    new TextRun({ text: "Objet : ", bold: true, size: 22, font: "Calibri" }),
    new TextRun({ text, size: 22, font: "Calibri" }),
  ], { after: 100 });
}

function blocReferences(refs) {
  return refs.map((r) =>
    PR([
      new TextRun({ text: "Réf. : ", bold: true, size: 20, font: "Calibri", color: COLOR.gray }),
      new TextRun({ text: r, size: 20, font: "Calibri", color: COLOR.gray }),
    ], { after: 60 }),
  );
}

function blocSignature() {
  return [
    Spacer(180),
    P("Avec mes respectueuses salutations,", { italics: true, after: 60 }),
    Spacer(180),
    P("David Eventy", { bold: true, after: 60 }),
    P("Président, Fondateur — Eventy Life SAS", { after: 60 }),
    P("(signature manuscrite)", { italics: true, color: COLOR.gray, after: 60 }),
  ];
}

// =====================================================================
// LETTRE 1 — ATOUT FRANCE
// =====================================================================

const lettreAtoutFrance = [
  // En-tête expéditeur
  ...blocExpediteur(),
  Spacer(120),
  // Destinataire
  ...blocDestinataire([
    "ATOUT FRANCE",
    "Agence française de développement touristique",
    "Service Immatriculation",
    "Registre des opérateurs de voyages et de séjours",
    "79-81, rue de Clichy",
    "75009 Paris",
  ]),
  // Lieu / date
  ...blocLieuDate("Paris, le 30 avril 2026"),
  // Objet + références
  blocObjet("Demande d'immatriculation au registre des opérateurs de voyages et de séjours — EVENTY LIFE SAS"),
  ...blocReferences([
    "Articles L211-18 et R211-26 à R211-34 du Code du Tourisme",
    "Directive (UE) 2015/2302 du 25 novembre 2015 relative aux voyages à forfait",
    "Ordonnance n° 2017-1717 du 20 décembre 2017 et décret n° 2017-1871 du 29 décembre 2017",
  ]),
  Spacer(120),
  // Corps
  P("Madame, Monsieur,", { after: 120 }),
  P("J'ai l'honneur de vous adresser, par la présente, la demande d'immatriculation au registre des opérateurs de voyages et de séjours tenu par votre agence, au titre de la société EVENTY LIFE SAS, dont je suis le fondateur et président."),
  P("EVENTY LIFE SAS exerce, dès son immatriculation au Registre du Commerce et des Sociétés, l'activité de vente et d'organisation de voyages à forfait au sens des articles L211-1 et suivants du Code du Tourisme. La société se positionne sur le segment des voyages de groupe en autocar et en charter aérien à destination de la France métropolitaine, du Maghreb et de l'Europe à portée de bus, avec un panier moyen de 800 € TTC par voyageur et une cible de 38 voyageurs par voyage."),
  P("Conformément aux dispositions précitées, le présent dossier d'immatriculation est constitué de l'ensemble des pièces justificatives requises, à savoir : extrait Kbis de moins de trois mois, copie certifiée des statuts, attestation de garantie financière délivrée par l'Association Professionnelle de Solidarité du Tourisme (APST), attestation d'assurance de responsabilité civile professionnelle, justificatif de capacité professionnelle du dirigeant, descriptif détaillé de l'activité, prévisionnel de chiffre d'affaires, justificatif d'occupation des locaux et règlement des frais d'immatriculation d'un montant de cent cinquante euros (150 €)."),
  P("Je joins à la présente le dossier complet de demande de garantie financière, lequel reprend in extenso les éléments d'identification, le modèle économique distribué (architecture marge HRA + commissions vendeur 5 % HT et créateur 3 % sur HRA), la trajectoire prévisionnelle (16 M€ de chiffre d'affaires en année 1, 80 M€ en année 2), les engagements solennels d'EVENTY LIFE SAS et l'ensemble des annexes documentaires (CV du dirigeant, statuts SAS, RIB du compte cantonné, modèles de CGV, charte qualité, procédure de réclamation, attestation comptable et autres pièces de référence)."),
  P("Je m'engage, au nom d'EVENTY LIFE SAS et au mien propre, à respecter strictement l'ensemble des obligations réglementaires applicables aux opérateurs de voyages et de séjours, à coopérer pleinement avec votre agence en cas d'audit ou de contrôle, à renouveler l'immatriculation à chaque échéance triennale et à informer sans délai votre service de toute évolution susceptible d'affecter la conformité de la société."),
  P("Je vous remercie par avance de l'attention que vous voudrez bien porter à cette demande et reste à votre entière disposition pour toute pièce complémentaire ou audition que vous jugeriez utile."),
  P("Je vous prie de croire, Madame, Monsieur, à l'assurance de ma considération distinguée."),
  // Signature
  ...blocSignature(),
  // Pièces jointes
  Spacer(120),
  P("Pièces jointes :", { bold: true, after: 60 }),
  P("— Dossier complet de demande de garantie financière (16 parties, 119 pages)", { after: 30, size: 20 }),
  P("— Note de processus opérationnel Atout France (PROCESSUS-ATOUT-FRANCE.md)", { after: 30, size: 20 }),
  P("— Annexes A à S (CV, statuts, RIB cantonné, attestation comptable, CGV, etc.)", { after: 30, size: 20 }),
  P("— Attestation APST de garantie financière", { after: 30, size: 20 }),
  P("— Attestation d'assurance RC Pro Tourisme", { after: 30, size: 20 }),
  P("— Justificatif de capacité professionnelle du dirigeant", { after: 30, size: 20 }),
  P("— Justificatif d'occupation des locaux", { after: 30, size: 20 }),
  P("— Règlement des frais d'immatriculation (150 €)", { after: 30, size: 20 }),
  // Saut de page pour la 2e lettre
  new Paragraph({ children: [new PageBreak()] }),
];

// =====================================================================
// LETTRE 2 — APST
// =====================================================================

const lettreAPST = [
  // En-tête expéditeur
  ...blocExpediteur(),
  Spacer(120),
  // Destinataire
  ...blocDestinataire([
    "APST — Association Professionnelle de Solidarité du Tourisme",
    "À l'attention de la Présidence et de la Commission d'Adhésion",
    "15, avenue Carnot",
    "75017 Paris",
    "info@apst.travel",
  ]),
  // Lieu / date
  ...blocLieuDate("Paris, le 30 avril 2026"),
  // Objet + références
  blocObjet("Demande d'adhésion à l'APST et d'octroi d'une garantie financière au titre du Code du Tourisme — EVENTY LIFE SAS"),
  ...blocReferences([
    "Article L211-18 du Code du Tourisme — obligation de garantie financière",
    "Articles R211-26 à R211-34 du Code du Tourisme — modalités de la garantie",
    "Statuts de l'APST et règlement intérieur de la commission d'adhésion",
    "Premier contact pris par voie électronique le 5 mars 2026",
  ]),
  Spacer(120),
  // Corps
  P("Madame la Présidente, Monsieur le Président,", { after: 100 }),
  P("Mesdames et Messieurs les membres de la Commission d'Adhésion,", { after: 120 }),
  P("J'ai l'honneur de vous adresser, par la présente, la demande formelle d'adhésion à l'Association Professionnelle de Solidarité du Tourisme et d'octroi d'une garantie financière au titre du Code du Tourisme, au nom de la société EVENTY LIFE SAS, dont je suis le fondateur et président."),
  P("EVENTY LIFE SAS porte un projet de plateforme française de voyages de groupe organisés à destination de la France métropolitaine, du Maghreb et de l'Europe à portée de bus. Notre modèle économique repose sur une architecture distribuée (marge socle Eventy sur prestations HRA, commission vendeur 5 % HT du chiffre d'affaires voyage, commission créateur 3 points supplémentaires sur HRA refacturé), articulée autour d'un panier moyen de 800 € TTC par voyageur et d'une cible de 38 voyageurs par voyage."),
  P("La trajectoire financière prévisionnelle s'établit à 16 millions d'euros de chiffre d'affaires HT en année 1, 80 millions d'euros en année 2, avec une marge brute opérée constante de 11,1 % du chiffre d'affaires, dont 6,8 % redistribués aux indépendants français (créateurs et vendeurs). Le pic des fonds clients en transit est estimé à 1,25 million d'euros en année 1 et 4,25 millions d'euros en année 2."),
  P("À ce titre, EVENTY LIFE SAS sollicite l'octroi d'une garantie financière d'un montant initial d'un million six cent mille euros (1 600 000 €), correspondant à 10 % du chiffre d'affaires prévisionnel de l'année 1 et à 128 % du pic des fonds en transit estimé. La société s'engage à transmettre trimestriellement à votre association une déclaration certifiée du volume réel des fonds clients en transit, et à indexer le montant de la garantie en cohérence avec ladite déclaration."),
  P("EVENTY LIFE SAS s'engage par ailleurs à constituer une contre-garantie personnelle du dirigeant d'un montant de dix mille euros (10 000 €) sur compte bancaire bloqué dédié, à acquitter la cotisation annuelle fixe et la part variable, à respecter scrupuleusement les statuts de l'APST et son règlement intérieur, et à coopérer pleinement avec votre association à chaque demande d'information, audit ou contrôle."),
  P("Je joins à la présente l'intégralité du dossier de garantie financière (16 parties, 119 pages, accompagné de 19 annexes documentaires de A à S), lequel comprend notamment : la présentation détaillée d'EVENTY LIFE SAS et de son modèle économique, le cadre légal et les obligations corrélatives, les données financières prévisionnelles complètes (compte de résultat, plan de trésorerie 24 mois, bilan, capacité d'autofinancement), l'analyse de risques et le plan de continuité d'activité, la gouvernance et les procédures de contrôle interne, ainsi que les pièces juridiques de référence (statuts SAS, projet de RIB du compte cantonné, modèles de contrats partenaires, charte qualité, procédure de réclamation voyageur)."),
  P("Je vous remercie sincèrement de l'attention que vous voudrez bien porter à cette demande. Je me tiens à la disposition de votre Commission pour toute audition, présentation orale, audit sur place ou complément documentaire que vous jugeriez utile dans le cadre de l'instruction."),
  P("Je vous prie de croire, Madame la Présidente, Monsieur le Président, Mesdames et Messieurs les membres de la Commission, à l'assurance de ma considération la plus distinguée et de mon engagement personnel et professionnel à servir, par mon adhésion à votre association, la sécurité du voyageur français."),
  // Signature
  ...blocSignature(),
  // Pièces jointes
  Spacer(120),
  P("Pièces jointes :", { bold: true, after: 60 }),
  P("— Dossier complet de demande de garantie financière (16 parties, 119 pages, ≈ 47 500 mots)", { after: 30, size: 20 }),
  P("— Annexes A à S (CV dirigeant, statuts SAS, RIB compte cantonné, attestation comptable, contrats-cadres créateur et HRA, charte qualité, procédure de réclamation, charte de transparence des prix, etc.)", { after: 30, size: 20 }),
  P("— Attestation pré-engagement RC Pro Tourisme", { after: 30, size: 20 }),
  P("— Justificatif de capacité professionnelle du dirigeant", { after: 30, size: 20 }),
  P("— Compte de résultat prévisionnel et plan de trésorerie 24 mois", { after: 30, size: 20 }),
  P("— Liste des partenaires identifiés et catalogue des programmes types saison 1", { after: 30, size: 20 }),
  P("— Déclaration sur l'honneur du dirigeant", { after: 30, size: 20 }),
  P("— Résumé exécutif 2 pages (à toutes fins utiles)", { after: 30, size: 20 }),
];

// =====================================================================
// Document
// =====================================================================

const doc = new Document({
  creator: "David Eventy — Eventy Life SAS",
  title: "Eventy Life — Courriers d'accompagnement (Atout France + APST)",
  description: "Lettres formelles de demande d'immatriculation et d'adhésion APST.",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({ text: "EVENTY LIFE SAS — Courriers d'accompagnement", size: 16, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: "\tPage ", size: 16, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: " / ", size: 16, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: COLOR.gray, font: "Calibri" }),
              ],
            }),
          ],
        }),
      },
      children: [...lettreAtoutFrance, ...lettreAPST],
    },
  ],
});

const outputPath = process.argv[2] || "Eventy-Life-Courriers-APST-AtoutFrance.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`✓ Courriers générés : ${outputPath} (${sizeKB} KB)`);
});
