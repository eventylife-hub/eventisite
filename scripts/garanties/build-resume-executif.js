/**
 * Eventy Life — Résumé exécutif 2 pages
 * Destinataires : banquier, investisseur, partenaire institutionnel
 *
 * Produit : Eventy-Life-Resume-Executif.docx
 * Usage   : node scripts/garanties/build-resume-executif.js [output.docx]
 */

const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  LevelFormat,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  PageNumber,
  TabStopType,
  TabStopPosition,
} = require("docx");

const COLOR = {
  orange: "E87722",
  blue: "1F4E79",
  blueLt: "D5E8F0",
  cream: "FFF8EE",
  gray: "555555",
  grayLt: "EEEEEE",
  black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 80, line: 240 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: opts.size || 18,
        font: "Calibri",
        color: opts.color || COLOR.black,
        bold: opts.bold,
        italics: opts.italics,
      }),
    ],
  });
}
function H1(text) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [new TextRun({ text, bold: true, size: 20, color: COLOR.orange, font: "Calibri" })],
  });
}
function tCell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            size: opts.size || 16,
            bold: opts.bold,
            color: opts.color || COLOR.black,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}
function makeTable({ widths, header, rows, headerColor = COLOR.blue }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map((h, i) =>
      tCell(h, { width: widths[i], shade: headerColor, color: "FFFFFF", bold: true, size: 16 })
    ),
  });
  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map((c, i) =>
          tCell(c, {
            width: widths[i],
            shade: ri % 2 === 0 ? COLOR.grayLt : undefined,
          })
        ),
      })
  );
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}

// ----- Cover bandeau -----
function bandeauTete() {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 24, color: COLOR.orange },
              left: { style: BorderStyle.SINGLE, size: 24, color: COLOR.orange },
              bottom: { style: BorderStyle.SINGLE, size: 24, color: COLOR.orange },
              right: { style: BorderStyle.SINGLE, size: 24, color: COLOR.orange },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: COLOR.cream, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: "EVENTY LIFE — RÉSUMÉ EXÉCUTIF", size: 36, bold: true, color: COLOR.orange, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [new TextRun({ text: "Plateforme française de voyages de groupe organisés", size: 20, italics: true, color: COLOR.blue, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: "Document à l'attention des partenaires bancaires et investisseurs · 30 avril 2026", size: 16, color: COLOR.gray, font: "Calibri" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ----- Encart contact final -----
function bandeauContact() {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 18, color: COLOR.blue },
              left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.blue },
              bottom: { style: BorderStyle.SINGLE, size: 18, color: COLOR.blue },
              right: { style: BorderStyle.SINGLE, size: 18, color: COLOR.blue },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: COLOR.blueLt, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: "POUR PROLONGER L'ÉCHANGE", size: 22, bold: true, color: COLOR.blue, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 30 },
                children: [new TextRun({ text: "David Eventy — Président, Fondateur d'Eventy Life SAS", size: 18, bold: true, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 30 },
                children: [new TextRun({ text: "eventylife@gmail.com · eventylife.fr", size: 18, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: "Dossier APST/Atout France complet (158 KB · 122 pages) disponible sur demande.", size: 16, italics: true, color: COLOR.gray, font: "Calibri" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// =====================================================================
// PAGE 1 — Identité, vision, modèle économique, chiffres clés
// =====================================================================

const page1 = [
  bandeauTete(),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun("")] }),

  H2("EN UNE PHRASE"),
  P("Eventy Life est une plateforme française de voyages de groupe organisés (38 voyageurs / bus, 800 € panier moyen) qui redistribue 6,8 % de son chiffre d'affaires aux indépendants français — créateurs et vendeurs — et garantit au voyageur le « tout-inclus serein » (Pack Sérénité, accompagnement humain, ligne 24/7).",
    { size: 20, italics: true, color: COLOR.blue }),

  H2("IDENTITÉ"),
  makeTable({
    widths: [2800, 6560],
    header: ["Élément", "Information"],
    rows: [
      ["Forme juridique", "SAS — Société par Actions Simplifiée (en cours de création)"],
      ["Capital social initial", "3 000 € intégralement libéré + augmentation prévue à 10 000 €"],
      ["Activité (Code NAF)", "7912Z — Activités des voyagistes"],
      ["Fondateur, Président", "David Eventy — engagement personnel total + contre-garantie 10 000 €"],
      ["Statut réglementaire cible", "Immatriculé Atout France (IM ###-###-###) + adhérent APST"],
      ["Garantie financière cible", "1,6 M€ (An 1, indexée trimestriellement) — APST première intention"],
      ["Site officiel", "eventylife.fr · contact : eventylife@gmail.com"],
    ],
  }),

  H2("MODÈLE ÉCONOMIQUE — ARCHITECTURE DISTRIBUÉE"),
  P("Eventy Life ne pratique pas la marge classique d'une agence (15-25 % capté). Notre marge brute opérée est de 11 % du CA voyage, dont 6,8 % redistribués aux indépendants français, et environ 4,3 % conservés par Eventy avant ses charges internes (équipe, technique, conformité, marketing).",
    { size: 18 }),
  makeTable({
    widths: [3500, 5860],
    header: ["Acteur", "Rémunération sur le voyage"],
    rows: [
      ["Eventy (plateforme + opérateur)", "Marge socle ≈ 8 % sur HRA refacturé (hôtels, restos, activités)"],
      ["Vendeur (toute personne qui vend)", "5 % HT du CA voyage — créateur, ambassadeur, influenceur, HRA partageant"],
      ["Créateur de voyage indépendant", "+ 3 points sur HRA refacturé (cumulable avec 5 % vendeur)"],
      ["HRA — hôtels, restaurants, activités", "Tarif négocié + possibilité de devenir vendeur"],
    ],
  }),

  H2("CHIFFRES CLÉS — TRAJECTOIRE 24 MOIS"),
  makeTable({
    widths: [3500, 2940, 2920],
    header: ["Indicateur", "Année 1", "Année 2"],
    rows: [
      ["Cadence cible (T4)", "10 voyages / sem", "100-200 voyages / sem"],
      ["Voyageurs annuels", "≈ 16 000", "≈ 100 000"],
      ["Chiffre d'affaires HT", "16,0 M€", "80,0 M€"],
      ["Marge brute opérée (11,1 %)", "1,77 M€", "8,85 M€"],
      ["Redistribution aux indépendants", "1,09 M€ (6,8 %)", "5,45 M€ (6,8 %)"],
      ["Eventy net avant charges (4,3 %)", "0,68 M€", "3,40 M€"],
      ["Résultat avant impôt", "≈ 429 K€", "≈ 2 470 K€"],
      ["Résultat net", "≈ 322 K€ (2,0 %)", "≈ 1 852 K€ (2,3 %)"],
      ["Trésorerie cumulée fin de période", "≈ 620 K€", "≈ 6,7 M€"],
      ["BFR (en jours de CA)", "- 33 jours (positif)", "- 25 jours (positif)"],
      ["CAF / fonds propres fin", "≈ 105 %", "≈ 81 %"],
    ],
  }),
  new Paragraph({ pageBreakBefore: true, spacing: { after: 0 }, children: [new TextRun("")] }),
];

// =====================================================================
// PAGE 2 — Différenciation, financement, garanties, calendrier, demande
// =====================================================================

const page2 = [
  H2("CE QUI NOUS REND DIFFÉRENTS"),
  makeTable({
    widths: [4680, 4680],
    header: ["Le marché classique", "Eventy Life"],
    rows: [
      ["Marge captée 15 à 25 %, opaque", "Marge brute 11 %, transparente, redistribuée à 6,8 %"],
      ["Assurance optionnelle, payante", "Pack Sérénité INCLUS (assurance + ligne 24/7)"],
      ["Force commerciale = salariés exclusifs", "Réseau distribué à 5 % HT pour tous"],
      ["Voyageur = volume à transformer", "Voyageur = personne à accueillir (porte-à-porte)"],
      ["Plateforme = silo propriétaire", "Écosystème ouvert (HRA peuvent devenir vendeurs)"],
    ],
  }),

  H2("FINANCEMENT — DEMANDE & UTILISATION"),
  P("Eventy Life est une société auto-financée : la totalité de la R&D pré-lancement (plateforme propriétaire ≈ 1 M+ lignes de code, 31 modules backend, 3 300+ tests automatisés) a été assumée personnellement par le fondateur. La société ne dépend pas d'une levée de fonds pour exister — elle peut accélérer si elle s'en dote.",
    { size: 18 }),
  makeTable({
    widths: [3000, 3200, 3160],
    header: ["Phase", "Montant cible", "Utilisation"],
    rows: [
      ["Seed (T2 An 1)", "150 — 300 K€", "Marketing acquisition, recrutement Resp. opérations + CTO"],
      ["Série A (An 2)", "500 K€ — 1 M€", "Expansion européenne, charter A320, structuration équipe"],
      ["Crédit court terme (BFR)", "Sans objet", "BFR négatif (-33 jours) ; trésorerie générée par activité"],
    ],
  }),

  H2("GARANTIES & CONFORMITÉ"),
  P("Eventy Life sécurise le voyageur sur six niveaux cumulés : (1) trésorerie disponible, (2) fonds de réserve volontaire 5 % CA, (3) Pack Sérénité externe, (4) RC Pro Tourisme 1,5 M€/sinistre, (5) garantie financière APST 1,6 M€ illimitée par construction, (6) contre-garantie personnelle dirigeant 10 K€. Couverture > 200 % au pic des fonds en transit.",
    { size: 18 }),
  P("Conformité réglementaire intégrale : Code du Tourisme L211-1 et suivants, directive (UE) 2015/2302, RGPD. Adhésion APST en cours, médiation MTV gratuite pour le voyageur, expert-comptable spécialisé tourisme, avocat tourisme.",
    { size: 18 }),

  H2("CALENDRIER OPÉRATIONNEL"),
  makeTable({
    widths: [1500, 7860],
    header: ["Jalon", "Action — livrable"],
    rows: [
      ["J0", "Inscription Atout France · constitution dossier APST"],
      ["J+30", "Dépôt de la garantie financière APST · cotisation + contre-garantie 10 K€"],
      ["J+45", "Délivrance attestation APST · soumission Atout France"],
      ["J+60", "Obtention IM Atout France · lancement commercial"],
      ["J+365", "Cadence T4 An 1 atteinte · CA 16 M€ · résultat net ≈ 322 K€"],
      ["J+730", "Cadence T4 An 2 · CA 80 M€ · trésorerie cumulée 6,7 M€"],
    ],
  }),

  H2("CONTRIBUTION ÉCONOMIQUE FRANÇAISE"),
  P("Sur 100 € payés par un voyageur Eventy : ≈ 35 € hôteliers, ≈ 17 € restaurateurs, ≈ 7 € activités, ≈ 23 € autocaristes français, ≈ 5 € vendeur indépendant français, ≈ 2 € créateur indépendant français, ≈ 4,5 € assureur français, ≈ 6,5 € Eventy. Aucun euro extra-européen.",
    { size: 18 }),
  P("À l'échelle An 1 (16 M€ CA), 5,4 M€ restent strictement en France — équivalent de 50 emplois cumulés répartis dans le tissu indépendant national.",
    { size: 18 }),

  bandeauContact(),
];

// =====================================================================
// Document
// =====================================================================

const doc = new Document({
  creator: "David Eventy — Eventy Life SAS",
  title: "Eventy Life — Résumé Exécutif (banquier / investisseur)",
  description: "Synthèse 2 pages du projet Eventy Life à destination des partenaires bancaires et investisseurs.",
  styles: {
    default: { document: { run: { font: "Calibri", size: 18 } } },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({ text: "Eventy Life SAS — Résumé exécutif", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
              ],
            }),
          ],
        }),
      },
      children: [...page1, ...page2],
    },
  ],
});

const outputPath = process.argv[2] || "Eventy-Life-Resume-Executif.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`✓ Résumé exécutif généré : ${outputPath} (${sizeKB} KB)`);
});
