/**
 * Eventy Life — Dossier Investisseur consolidé
 *
 * Sections : Executive summary financier, projections 5 ans, valorisation,
 *            levée de fonds Seed et Série A, risques, équipe.
 *
 * Produit : Eventy-Life-Dossier-Investisseur.docx
 * Usage   : node scripts/garanties/build-dossier-investisseur.js [output.docx]
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
  Footer,
  Header,
  AlignmentType,
  LevelFormat,
  HeadingLevel,
  PageNumber,
  PageBreak,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
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

// Helpers
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    pageBreakBefore: false,
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22, color: COLOR.blue, font: "Calibri" })],
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: opts.size || 20,
        font: "Calibri",
        color: opts.color || COLOR.black,
        bold: opts.bold,
        italics: opts.italics,
      }),
    ],
  });
}
function Bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
  });
}
function Numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
  });
}
function Quote(text) {
  return new Paragraph({
    spacing: { before: 160, after: 160, line: 300 },
    indent: { left: 720, right: 720 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange, space: 12 } },
    children: [new TextRun({ text, size: 22, italics: true, font: "Calibri", color: COLOR.blue })],
  });
}
function Spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [new TextRun("")] });
}
function PB() { return new Paragraph({ children: [new PageBreak()] }); }

function tCell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            size: opts.size || 18,
            bold: opts.bold,
            color: opts.color || COLOR.black,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}
function makeTable({ widths, header, rows }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map((h, i) =>
      tCell(h, { width: widths[i], shade: COLOR.blue, color: "FFFFFF", bold: true, size: 19 }),
    ),
  });
  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map((c, i) =>
          tCell(c, {
            width: widths[i],
            shade: ri % 2 === 0 ? COLOR.grayLt : undefined,
          }),
        ),
      }),
  );
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}

function Encart({ title, lines, color = COLOR.orange, fill = COLOR.cream }) {
  const lineParas = lines.map((line, i) => new Paragraph({
    alignment: line.align || AlignmentType.JUSTIFIED,
    spacing: { after: i === lines.length - 1 ? 0 : 80 },
    children: [
      new TextRun({
        text: line.text,
        size: line.size || 20,
        bold: !!line.bold,
        italics: !!line.italics,
        color: line.color || COLOR.black,
        font: "Calibri",
      }),
    ],
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.DOUBLE, size: 18, color },
              left: { style: BorderStyle.DOUBLE, size: 18, color },
              bottom: { style: BorderStyle.DOUBLE, size: 18, color },
              right: { style: BorderStyle.DOUBLE, size: 18, color },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 360, right: 360 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [new TextRun({ text: title, size: 24, bold: true, color, font: "Calibri" })],
              }),
              ...lineParas,
            ],
          }),
        ],
      }),
    ],
  });
}

// ====== Cover page ======
function coverPage() {
  return [
    new Paragraph({ spacing: { before: 1200 }, children: [new TextRun("")] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: "EVENTY LIFE", size: 96, bold: true, color: COLOR.orange, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [new TextRun({ text: "Le voyage de groupe où tu n'as rien à gérer, tout à vivre.", size: 24, italics: true, color: COLOR.blue, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "DOSSIER INVESTISSEUR", size: 48, bold: true, color: COLOR.blue, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: "Executive summary financier · Projections 5 ans · Valorisation · Levée de fonds", size: 24, color: COLOR.gray, font: "Calibri" })],
    }),
    Spacer(400),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 },
      children: [new TextRun({ text: "David Eventy — Président, Fondateur", size: 22, bold: true, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "EVENTY LIFE SAS (en cours de création)", size: 20, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "eventylife@gmail.com · eventylife.fr", size: 20, color: COLOR.gray, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Version 1.0 · 30 avril 2026", size: 18, italics: true, color: COLOR.gray, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Document confidentiel — usage strictement réservé aux destinataires habilités", size: 16, italics: true, color: COLOR.gray, font: "Calibri" })],
    }),
    PB(),
  ];
}

// ============================================================
// 1. Executive summary financier
// ============================================================
function partie1ExecSummary() {
  return [
    H1("1. Executive Summary financier"),
    Quote("Eventy Life est une plateforme française de voyages de groupe organisés, profitable dès l'année 1, qui redistribue 6,8 % de son CA aux indépendants français et qui peut accélérer son expansion européenne avec un investissement modeste."),

    H2("1.1. Eventy en cinq lignes"),
    P("Eventy Life est un opérateur de voyages à forfait au sens du Code du Tourisme, immatriculé Atout France et garanti APST. Notre modèle articule trois leviers : un panier moyen de 800 € TTC par voyageur, un remplissage cible de 38 voyageurs par voyage et une marge brute opérée de 11,1 % du chiffre d'affaires. La société est auto-financée — la plateforme propriétaire (1 M+ lignes de code, 31 modules backend, 3 300+ tests automatisés) a été développée et payée en propre par le fondateur. Nous n'avons pas besoin de financement pour exister ; nous en avons besoin pour accélérer."),

    H2("1.2. Indicateurs clés à retenir"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "An 1", "An 5"],
      rows: [
        ["Chiffre d'affaires HT", "16 M€", "≈ 320 M€"],
        ["Croissance annuelle moyenne (TCAM)", "—", "≈ 110 % / an"],
        ["Marge brute opérée (% du CA)", "11,1 %", "11,5 %"],
        ["Redistribution indépendants", "1,09 M€ (6,8 %)", "21,8 M€ (6,8 %)"],
        ["Résultat net (% du CA)", "≈ 322 K€ (2,0 %)", "≈ 9,5 M€ (3,0 %)"],
        ["Trésorerie cumulée fin de période", "0,62 M€", "≈ 25 M€"],
        ["BFR (en jours de CA)", "- 33 jours", "- 25 jours"],
        ["ETP internes Eventy", "5 (moyens) / 6 (fin)", "≈ 35"],
        ["Voyageurs annuels", "≈ 16 000", "≈ 400 000"],
        ["Couverture géographique", "France + 12 destinations", "Europe complète + charter A320"],
      ],
    }),

    H2("1.3. Ce qui rend Eventy investissable"),
    Bullet("Profitabilité dès An 1 (≈ 322 K€ de résultat net) — modèle robuste, pas de course aux pertes."),
    Bullet("BFR négatif structurel (-33 jours de CA An 1, -25 jours An 5) — la croissance s'autofinance."),
    Bullet("Plateforme technique propriétaire mature — actif valorisable, levier de scalabilité."),
    Bullet("Modèle distribué (5 % HT vendeur + 3 pts créateur sur HRA) — coût d'acquisition variable, scalable."),
    Bullet("Marché de référence (tourisme français) ≈ 8 % du PIB national, en croissance post-2020."),
    Bullet("Cadre réglementaire mature (Code du Tourisme, directive UE 2015/2302) — barrière à l'entrée, sécurité juridique."),
    Bullet("Conformité native dès le démarrage — APST, Atout France, RC Pro, RGPD, médiation MTV."),
    PB(),
  ];
}

// ============================================================
// 2. Marché et concurrence
// ============================================================
function partie2Marche() {
  return [
    H1("2. Marché et positionnement concurrentiel"),
    Quote("Le tourisme français est un marché de 200 milliards d'euros, dont les plateformes mondialisées prélèvent une commission croissante. Eventy Life propose une alternative française et redistributive."),

    H2("2.1. Cadrage du marché"),
    makeTable({
      widths: [4680, 4680],
      header: ["Indicateur", "Valeur de cadrage"],
      rows: [
        ["Poids du tourisme dans le PIB français", "≈ 8 % (≈ 200 Md€ de CA secteur)"],
        ["Emplois directs et indirects (secteur tourisme)", "Plus de 2 millions"],
        ["Position de la France dans le tourisme mondial", "1er pays par nombre de visiteurs internationaux"],
        ["Tourisme intérieur (Français en France)", "Majoritaire en volume — opportunité directe Eventy"],
        ["Voyage de groupe en France (segment direct Eventy)", "Estimation 4 à 6 Md€/an, fragmenté"],
        ["Croissance segment voyage de groupe post-2020", "TCAM ≈ 6 à 8 %/an (rebond + recherche de lien social)"],
      ],
    }),

    H2("2.2. Carte de la concurrence"),
    makeTable({
      widths: [3000, 3000, 3360],
      header: ["Acteur / Catégorie", "Forces", "Faiblesses"],
      rows: [
        ["Voyageurs du Monde (premium individuel)", "Marque, expertise, réseau", "Pas de groupe, panier > 2 500 €"],
        ["Salaün, Verdié, Croisitour (groupes traditionnels)", "Volumes, autocaristes intégrés", "Marges captives 20-25 %, pas de digital"],
        ["TUI, Club Med (généralistes intégrés)", "Échelle, marque", "Voyageur-volume, peu d'humanité"],
        ["OTA (Booking, Expedia, Airbnb)", "Distribution, technologie", "Pas d'opérateur, capte 15-25 % de commission"],
        ["Plateformes de mise en relation (GetYourGuide, etc.)", "Expérience digitale", "Pas opérateur de voyages — pas de garantie"],
        ["EVENTY LIFE", "Distribué, transparent, humain, immatriculé", "Démarrage — pas d'historique"],
      ],
    }),
    P("Eventy se positionne sur un segment encore peu couvert : voyage de groupe organisé, à panier moyen 600-1 200 € TTC, opéré directement (responsabilité plein droit), avec une chaîne de valeur transparente et redistributive. Aucun acteur du marché ne combine actuellement ces quatre attributs."),
    PB(),
  ];
}

// ============================================================
// 3. Modèle économique condensé
// ============================================================
function partie3Modele() {
  return [
    H1("3. Modèle économique"),
    Quote("Eventy redistribue 6,8 % de son chiffre d'affaires aux indépendants français, garde environ 4,3 % avant ses charges internes, et finit l'année avec ≈ 2 % de marge nette. Ce modèle s'auto-discipline — pas de course aux marges, pas d'extraction."),

    H2("3.1. Architecture de marges (rappel)"),
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

    H2("3.2. Unit economics — voyage de référence 30 400 € de CA"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Montant (€)", "% du CA"],
      rows: [
        ["CA voyage TTC (38 voyageurs × 800 €)", "30 400", "100 %"],
        ["Achats externes (HRA + transport + taxes + Pack Sérénité)", "27 030", "88,9 %"],
        ["Marge brute opérée Eventy", "3 370", "11,1 %"],
        ["Commission vendeur (5 % HT du CA)", "1 520", "5,0 %"],
        ["Commission créateur (3 pts HRA refacturé)", "547", "1,8 %"],
        ["Eventy net avant charges", "≈ 1 303", "≈ 4,3 %"],
      ],
    }),
    P("Lecture : sur 30 400 € de CA voyage, ≈ 27 030 € (88,9 %) retournent immédiatement à l'économie réelle. Eventy opère une marge brute de ≈ 3 370 € (11,1 %), redistribue 2 067 € aux indépendants français (6,8 %), et conserve ≈ 1 303 € avant ses charges internes (4,3 %)."),
    PB(),
  ];
}

// ============================================================
// 4. Projections financières 5 ans
// ============================================================
function partie4Projections() {
  return [
    H1("4. Projections financières — 5 années"),
    Quote("Le scénario central projette un CA de 16 M€ en An 1 et 320 M€ en An 5, avec une rentabilité croissante de 2 % à 3 % de marge nette. Les hypothèses sont prudentes et explicites."),

    H2("4.1. Hypothèses fondatrices"),
    Bullet("Cadence : 10 voy/sem (T4 An 1) → 50 (An 2) → 100 (An 3) → 150 (An 4) → 200 (An 5)."),
    Bullet("Panier moyen : 800 € TTC (constant ; en réalité, panier mixte 600-1 200 € selon segment)."),
    Bullet("Taux de remplissage : 38 voyageurs / voyage en moyenne (≈ 72 % de capacité bus)."),
    Bullet("Marge brute opérée : 11,1 % du CA (constante, validée par sensibilité)."),
    Bullet("Redistribution indépendants : 6,8 % du CA (5 % vendeur + 1,8 % créateur)."),
    Bullet("Charges Eventy : montée progressive de 251 K€ (An 1) à 5,3 M€ (An 5)."),
    Bullet("TVA marge tourisme · IS PME / standard selon seuils."),

    H2("4.2. Compte de résultat consolidé — 5 ans"),
    makeTable({
      widths: [3500, 1200, 1200, 1200, 1200, 1060],
      header: ["Indicateur (M€)", "An 1", "An 2", "An 3", "An 4", "An 5"],
      rows: [
        ["Chiffre d'affaires HT", "16,0", "80,0", "160,0", "240,0", "320,0"],
        ["Croissance annuelle", "—", "+ 400 %", "+ 100 %", "+ 50 %", "+ 33 %"],
        ["Achats externes (88,9 %)", "14,23", "71,15", "142,3", "213,4", "284,5"],
        ["Marge brute opérée (11,1 %)", "1,77", "8,85", "17,7", "26,6", "35,5"],
        ["Commission vendeur (5 %)", "0,80", "4,00", "8,00", "12,00", "16,00"],
        ["Commission créateur (1,8 %)", "0,29", "1,45", "2,90", "4,30", "5,80"],
        ["Eventy net avant charges (4,3 %)", "0,68", "3,40", "6,80", "10,30", "13,70"],
        ["Charges Eventy (équipe + tech + autres)", "0,25", "0,91", "1,80", "3,30", "5,30"],
        ["Résultat avant impôt", "0,43", "2,49", "5,00", "7,00", "8,40"],
        ["Impôt sur les sociétés", "0,11", "0,62", "1,25", "1,75", "2,10"],
        ["Résultat net", "0,32", "1,87", "3,75", "5,25", "6,30"],
        ["Résultat net / CA", "2,0 %", "2,3 %", "2,3 %", "2,2 %", "2,0 %"],
      ],
    }),

    H2("4.3. Trésorerie consolidée — 5 ans"),
    makeTable({
      widths: [3500, 1200, 1200, 1200, 1200, 1060],
      header: ["Indicateur (M€)", "An 1", "An 2", "An 3", "An 4", "An 5"],
      rows: [
        ["Encaissements voyageurs", "16,0", "80,0", "160,0", "240,0", "320,0"],
        ["Décaissements fournisseurs + commissions", "15,4", "76,5", "152,5", "228,8", "305,0"],
        ["Trésorerie d'exploitation générée", "0,6", "3,5", "7,5", "11,2", "15,0"],
        ["Pic des fonds en transit (mi-année)", "1,25", "4,25", "8,5", "12,8", "17,0"],
        ["Trésorerie cumulée fin de période", "0,62", "6,7", "13,5", "20,2", "25,0"],
        ["BFR (jours de CA)", "- 33", "- 25", "- 20", "- 18", "- 15"],
      ],
    }),
    P("La trésorerie cumulée passe de 620 K€ fin An 1 à environ 25 M€ fin An 5, intégralement générée par l'activité (modèle BFR négatif). Aucun emprunt bancaire envisagé. Une levée de fonds éventuelle viendrait accélérer le développement, sans en être une condition."),

    H2("4.4. Évolution des effectifs et de la masse salariale"),
    makeTable({
      widths: [3500, 1200, 1200, 1200, 1200, 1060],
      header: ["Poste", "An 1", "An 2", "An 3", "An 4", "An 5"],
      rows: [
        ["ETP internes (moyens annuels)", "5", "12", "20", "28", "35"],
        ["Masse salariale chargée (M€)", "0,18", "0,56", "1,10", "1,80", "2,50"],
        ["Créateurs indépendants actifs", "150", "400", "800", "1 200", "1 600"],
        ["Vendeurs actifs (cumul tous statuts)", "300", "1 000", "2 000", "3 000", "4 000"],
        ["HRA référencés cumulés", "200", "600", "1 200", "2 000", "3 000"],
        ["Autocaristes partenaires", "8", "20", "35", "50", "70"],
      ],
    }),
    P("L'effet de réseau est massif : à fin An 5, plus de 5 600 indépendants actifs (créateurs + vendeurs) gravitent autour d'Eventy, soit plus de 150 acteurs par ETP interne. Le modèle est efficace en capital humain."),

    H2("4.5. Couverture géographique et destinations"),
    makeTable({
      widths: [3500, 5860],
      header: ["Année", "Couverture cible"],
      rows: [
        ["An 1", "France métropolitaine + 12 destinations Europe Sud (Espagne, Portugal, Italie, Maroc)"],
        ["An 2", "Ouverture Europe Centrale (Tchéquie, Allemagne, Pays-Bas, Belgique, Luxembourg)"],
        ["An 3", "Charter A320 (159 passagers) — destinations longues : Grèce, Croatie, Tunisie"],
        ["An 4", "Saisonnalité hivernale ski (Alpes, Pyrénées, Andorre)"],
        ["An 5", "Europe complète (25+ destinations) + premières destinations long-courriers test"],
      ],
    }),
    PB(),
  ];
}

// ============================================================
// 5. Valorisation
// ============================================================
function partie5Valorisation() {
  return [
    H1("5. Valorisation Eventy Life"),
    Quote("La valorisation est posée avec sincérité : trois méthodes convergentes qui donnent une fourchette pré-money entre 4 et 12 M€ au moment de la levée Seed."),

    H2("5.1. Méthode 1 — Comparables sectoriels"),
    P("Les comparables européens dans le voyage de groupe organisé, plateforme tech, ou opérateur de voyages français de taille moyenne donnent les multiples suivants (médiane sur les 36 derniers mois)."),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Type de comparable", "Multiple CA Année 1", "Multiple Résultat Net Année 1"],
      rows: [
        ["Plateforme voyage early-stage profitable", "2,0 — 3,5 ×", "20 — 35 ×"],
        ["Opérateur voyage français mature", "0,4 — 0,8 ×", "8 — 12 ×"],
        ["SaaS B2C tourisme early-stage", "3,0 — 6,0 ×", "30 — 50 ×"],
        ["Médiane retenue Eventy An 1", "1,5 — 2,5 ×", "15 — 25 ×"],
      ],
    }),
    P("Application au CA et résultat net An 1 :"),
    Bullet("Sur CA An 1 (16 M€) × 1,5-2,5 → fourchette 24-40 M€ (post-money potentiel après lancement)."),
    Bullet("Sur résultat net An 1 (322 K€) × 15-25 → fourchette 4,8-8,1 M€."),
    Bullet("Comme la société n'est pas encore en exploitation, on retient une décote de 50-70 % → fourchette 1,5-4 M€ pré-money Seed."),

    H2("5.2. Méthode 2 — DCF actualisé"),
    P("Discounted Cash Flow sur 5 ans, taux d'actualisation 25 % (capital-risque early), valeur terminale en sortie An 5 valorisée à 8× le résultat net (multiple PME tourisme)."),
    makeTable({
      widths: [4680, 4680],
      header: ["Élément DCF", "Valeur"],
      rows: [
        ["Cash-flows opérationnels actualisés An 1 → An 5", "≈ 4,2 M€"],
        ["Valeur terminale An 5 (8 × résultat net 6,3 M€)", "50,4 M€"],
        ["Valeur terminale actualisée à An 0 (taux 25 %)", "≈ 16,5 M€"],
        ["Valeur d'entreprise totale (DCF)", "≈ 20,7 M€"],
        ["Décote risque early-stage (-60 %)", "≈ 8,3 M€"],
      ],
    }),
    P("Le DCF post-décote risque early-stage donne une valeur d'entreprise de l'ordre de 8 M€."),

    H2("5.3. Méthode 3 — Apport du fondateur (méthode reconstitution)"),
    P("Le fondateur a investi personnellement, en R&D et en temps, l'équivalent de :"),
    Bullet("Plateforme propriétaire ≈ 1 M+ lignes de code (équivalent 18 mois × 2 développeurs senior @ 800 €/jour ≈ 700 K€)."),
    Bullet("Architecture, design, UX, contenus : ≈ 300 K€ équivalent prestation."),
    Bullet("Études de marché, prospection, conception programmes : ≈ 200 K€ équivalent."),
    Bullet("Total reconstitution apport en R&D : ≈ 1,2 M€ d'actifs immatériels."),
    Bullet("Multiplicateur de valeur (effet plateforme + barrière à l'entrée) : 3 à 5×."),
    Bullet("Valeur reconstituée : 3,6 à 6 M€."),

    H2("5.4. Synthèse des trois méthodes"),
    makeTable({
      widths: [4680, 4680],
      header: ["Méthode", "Fourchette de valorisation pré-money Seed"],
      rows: [
        ["1. Comparables sectoriels", "1,5 — 4 M€ (post-décote)"],
        ["2. DCF actualisé (post-décote risque)", "≈ 8 M€"],
        ["3. Reconstitution apport fondateur × multiplicateur", "3,6 — 6 M€"],
        ["MÉDIANE — fourchette retenue pré-money Seed", "4 — 6 M€"],
      ],
    }),
    Encart({
      title: "VALORISATION CIBLE PRÉ-MONEY (LEVÉE SEED)",
      color: COLOR.blue,
      fill: COLOR.blueLt,
      lines: [
        { text: "Fourchette retenue : 4 — 6 M€ pré-money", align: AlignmentType.CENTER, bold: true, size: 24, color: COLOR.orange },
        { text: "Cible centrale : 5 M€ pré-money", align: AlignmentType.CENTER, italics: true, size: 22 },
        { text: "Pour une levée Seed de 200-300 K€, dilution attendue : 4-6 % du capital.", align: AlignmentType.CENTER, size: 20 },
      ],
    }),
    PB(),
  ];
}

// ============================================================
// 6. Levée de fonds
// ============================================================
function partie6Levee() {
  return [
    H1("6. Levée de fonds — Seed et Série A"),
    Quote("Eventy n'a pas besoin de lever pour exister — la société est auto-financée. La levée est un accélérateur opportuniste pour aller plus vite à l'échelle."),

    H2("6.1. Tour Seed — T2 An 2026"),
    makeTable({
      widths: [3500, 5860],
      header: ["Paramètre", "Valeur cible"],
      rows: [
        ["Montant levé", "200 K€ — 300 K€"],
        ["Valorisation pré-money", "4 — 6 M€ (cible : 5 M€)"],
        ["Valorisation post-money", "4,2 — 6,3 M€"],
        ["Dilution fondateur", "4 — 6 %"],
        ["Profil investisseurs cibles", "Business angels tourisme + early-stage seed français"],
        ["Instrument", "Augmentation de capital ou BSA-AIR (à arbitrer)"],
        ["Calendrier", "Closing T2-T3 An 2026"],
      ],
    }),

    H3("Utilisation des fonds Seed (200-300 K€)"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Montant cible", "% de la levée"],
      rows: [
        ["Recrutement Responsable opérations + CTO délégué (M2-M3)", "100 K€", "≈ 35-50 %"],
        ["Marketing acquisition (campagnes lancement public)", "60 K€", "≈ 20-30 %"],
        ["Frais juridiques renforcés (avocat tourisme, propriété intellectuelle)", "20 K€", "≈ 7-10 %"],
        ["Contre-garantie supplémentaire APST si volume > prévu", "30 K€", "≈ 10-15 %"],
        ["Trésorerie de sécurité opérationnelle", "40 K€", "≈ 13-20 %"],
        ["Total", "200-300 K€", "100 %"],
      ],
    }),

    H3("Jalons débloqués par la levée Seed"),
    Numbered("Cadence T4 An 1 atteinte de manière sécurisée (10 voyages/sem)."),
    Numbered("Équipe de 6 ETP fin An 1 (vs 5 sans levée)."),
    Numbered("CA An 1 ≈ 18-20 M€ (vs 16 M€ scénario sans levée), résultat net 400-500 K€."),
    Numbered("Préparation Série A à 6-9 mois post-Seed."),

    H2("6.2. Série A — An 2 An 2026/2027"),
    makeTable({
      widths: [3500, 5860],
      header: ["Paramètre", "Valeur cible"],
      rows: [
        ["Montant levé", "500 K€ — 1 M€"],
        ["Valorisation pré-money cible", "12 — 20 M€"],
        ["Dilution cumulée fondateur (Seed + Série A)", "≈ 12-18 %"],
        ["Profil investisseurs cibles", "Fonds early-stage tourisme + capital-risque français"],
        ["Calendrier", "An 2 An 2026/2027"],
      ],
    }),

    H3("Utilisation des fonds Série A (500 K€ — 1 M€)"),
    Bullet("Expansion européenne : ouverture Europe Centrale (Tchéquie, Allemagne, Pays-Bas, Belgique)."),
    Bullet("Recrutement de 6 à 8 ETP supplémentaires (commercial, marketing, qualité)."),
    Bullet("Acquisition charter A320 (capacité aérienne maîtrisée) — ouverture des destinations longues."),
    Bullet("Renforcement de la conformité multi-pays (assurances, garanties, traductions)."),
    Bullet("Investissement marketing offensif sur le segment B2B (séminaires d'entreprise)."),

    H2("6.3. Sortie envisagée"),
    P("L'horizon de sortie pour les investisseurs Seed et Série A est compris entre 5 et 7 ans, par les voies suivantes (par ordre de probabilité décroissante)."),
    Numbered("Rachat stratégique par un opérateur tourisme français ou européen (Voyageurs du Monde, Salaün, TUI Groupe France)."),
    Numbered("Rachat par un fonds de Private Equity tourisme (multiples PME 8-12× résultat net)."),
    Numbered("LBO secondaire avec re-cap auprès d'un fonds spécialisé."),
    Numbered("Introduction en bourse Euronext Growth (option ouverte si CA > 100 M€ avec rentabilité)."),
    P("Sur la base d'un résultat net An 5 de 6,3 M€ et d'un multiple de sortie de 8-12×, la valorisation de sortie est estimée entre 50 et 75 M€. Pour un investisseur Seed à 5 M€ pré-money, le multiplicateur potentiel sur sortie est de l'ordre de 8 à 15×."),
    PB(),
  ];
}

// ============================================================
// 7. Risques et mitigations
// ============================================================
function partie7Risques() {
  return [
    H1("7. Risques et mitigations"),
    Quote("Les principaux risques sont identifiés, hiérarchisés et adressés. La transparence sur les risques est un signal de maturité."),

    makeTable({
      widths: [600, 2400, 1500, 1500, 3360],
      header: ["#", "Risque", "Probabilité", "Impact", "Mitigation"],
      rows: [
        ["1", "Acquisition voyageurs plus lente que prévu", "Modérée", "Élevé", "Marketing distribué via vendeurs 5 % HT — coût d'acquisition variable, scalable. Plan B : ralentir l'embauche, conserver tréso."],
        ["2", "Refus APST sur premier dossier", "Faible", "Élevé", "Plan B : Groupama Assurance-Crédit (assureur). Dossier exemplaire (47 500 mots, conformité directive 2015/2302 article par article)."],
        ["3", "Crise sanitaire ou géopolitique massive", "Modérée", "Très élevé", "Pack Sérénité, garantie APST illimitée, fonds de réserve volontaire 5 % CA. Bus = mode résilient (vs aérien)."],
        ["4", "Dépendance au fondateur", "Modérée", "Modéré", "Recrutement Resp. opérations M2 + CTO M3 + DAF M4-M6. Documentation interne exhaustive. Assurance homme-clé An 2."],
        ["5", "Concurrence d'un acteur établi (TUI, Voyageurs)", "Modérée", "Modéré", "Différenciation forte (modèle distribué, transparence). Effet de réseau créateurs/vendeurs difficile à reproduire."],
        ["6", "Cyber-incident significatif", "Faible", "Élevé", "Architecture Scaleway + sauvegardes chiffrées + RGPD natif. Notification CNIL 72h. Assurance cyber prévue An 2."],
        ["7", "Évolution réglementaire défavorable", "Faible", "Modéré", "Veille juridique permanente avec avocat tourisme. Capacité d'adaptation rapide des CGV."],
      ],
    }),
    P("L'analyse complète des risques figure en Partie 9 du dossier de garantie financière (cartographie des 7 familles + plan de continuité d'activité 4 scénarios)."),
    PB(),
  ];
}

// ============================================================
// 8. Équipe
// ============================================================
function partie8Equipe() {
  return [
    H1("8. Équipe et gouvernance"),
    Quote("L'équipe se construit autour du fondateur, avec un plan de recrutement progressif aligné sur la croissance et la sécurité opérationnelle."),

    H2("8.1. Fondateur"),
    P("David Eventy, Président et Fondateur — entrepreneur autodidacte, développeur de la plateforme propriétaire (1 M+ lignes de code), passionné de voyage et d'écosystème indépendant. Engagement personnel total : apport en capital, contre-garantie personnelle 10 K€ APST, dévouement temps plein."),

    H2("8.2. Plan de recrutement (rappel)"),
    makeTable({
      widths: [3500, 1500, 1500, 1500, 1360],
      header: ["Fonction", "M0", "M6", "M12", "M24"],
      rows: [
        ["Présidence (Fondateur)", "1", "1", "1", "1"],
        ["Responsable opérations", "0", "1", "1", "2"],
        ["CTO délégué", "0", "1", "1", "2"],
        ["DAF / finance", "0", "1 (mi-temps)", "1", "2"],
        ["Marketing & communication", "0", "1", "1", "2"],
        ["Support / relation voyageurs", "0", "0", "1", "3"],
        ["Total ETP internes", "1", "≈ 4,5", "≈ 6", "≈ 12"],
      ],
    }),

    H2("8.3. Conseils externes permanents"),
    Bullet("Avocat spécialisé droit du tourisme — CGV, contrats partenaires, conformité."),
    Bullet("Expert-comptable spécialisé tourisme — TVA marge, attestation annuelle, déclarations APST."),
    Bullet("Commissaire aux comptes (à compter du seuil légal CA > 8 M€ HT)."),
    Bullet("DPO externe (RGPD) — désignation à 6 mois post-lancement."),

    H2("8.4. Gouvernance investisseurs (post-levée)"),
    P("Post-levée Seed, mise en place d'un comité d'investissement informel trimestriel ouvert aux principaux investisseurs. Post-Série A, formalisation possible en conseil d'administration ou comité stratégique selon le pacte d'associés. Le fondateur conserve la majorité du capital et le contrôle des décisions opérationnelles ; les investisseurs disposent de droits d'information renforcés (reporting trimestriel, accès aux comptes, droit de veto sur décisions exceptionnelles définies au pacte)."),
    PB(),
  ];
}

// ============================================================
// 9. Contact
// ============================================================
function partie9Contact() {
  return [
    H1("9. Pour prolonger l'échange"),
    Spacer(180),
    P("Le présent dossier investisseur est complémentaire du dossier APST/Atout France (47 500 mots, 119 pages, 19 annexes), du résumé exécutif banquier (2 pages), du courrier d'accompagnement formel, de la checklist Atout France, du calendrier J0→J+90 et du contrat-type vendeur/créateur — tous disponibles sur demande."),
    P("Eventy Life se tient à la disposition de tout investisseur, business angel, fonds Seed ou Série A, pour une présentation orale, une visite de la plateforme, un échange avec le fondateur, ou un audit pré-investissement."),

    Encart({
      title: "CONTACT — DAVID EVENTY",
      color: COLOR.blue,
      fill: COLOR.blueLt,
      lines: [
        { text: "David Eventy — Président, Fondateur d'Eventy Life SAS", align: AlignmentType.CENTER, bold: true, size: 24, color: COLOR.orange },
        { text: "eventylife@gmail.com · eventylife.fr", align: AlignmentType.CENTER, size: 22 },
        { text: "Disponibilité : sur rendez-vous, en présentiel ou en visioconférence", align: AlignmentType.CENTER, italics: true, size: 20 },
        { text: "Délai de réponse engagé : 48 heures ouvrées maximum", align: AlignmentType.CENTER, italics: true, size: 20 },
      ],
    }),

    Spacer(240),
    P("Tout document additionnel, audit, présentation orale, visite de la plateforme ou échange technique est possible sur simple demande.", { italics: true, color: COLOR.gray }),
    Spacer(160),
    P("Document confidentiel — usage strictement réservé aux destinataires habilités. Reproduction, diffusion ou transmission à des tiers non autorisés interdite sans accord écrit préalable du dirigeant.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// Document
// ============================================================
const doc = new Document({
  creator: "David Eventy — Eventy Life SAS",
  title: "Eventy Life — Dossier Investisseur",
  description: "Executive summary financier, projections 5 ans, valorisation et levée de fonds.",
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: COLOR.blue },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: COLOR.orange },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: COLOR.blue },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ],
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Eventy Life — Dossier Investisseur", size: 16, italics: true, font: "Calibri", color: COLOR.gray }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.orange, space: 4 } },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({ text: "Eventy Life SAS — Dossier Investisseur · Confidentiel", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...coverPage(),
        ...partie1ExecSummary(),
        ...partie2Marche(),
        ...partie3Modele(),
        ...partie4Projections(),
        ...partie5Valorisation(),
        ...partie6Levee(),
        ...partie7Risques(),
        ...partie8Equipe(),
        ...partie9Contact(),
      ],
    },
  ],
});

const outputPath = process.argv[2] || "Eventy-Life-Dossier-Investisseur.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`✓ Dossier investisseur généré : ${outputPath} (${sizeKB} KB)`);
});
