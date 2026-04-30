/**
 * Eventy Life — Dossier Subventions Publiques
 *
 * Identifie les dispositifs publics ciblés pour Eventy Life :
 *   - Bpifrance (subventions, prêts d'honneur, garanties, concours)
 *   - FEDER (Fonds Européen de Développement Régional)
 *   - Dispositifs régionaux
 *   - Dispositifs sectoriels tourisme
 *   - Statut JEI · CIR · CII
 *
 * Produit : Eventy-Life-Dossier-Subventions-Publiques.docx
 * Usage   : node scripts/garanties/build-dossier-subventions.js [output.docx]
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
  green: "2C5F2D",
  greenLt: "E5EDD9",
  gray: "555555",
  grayLt: "EEEEEE",
  black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

// === Helpers ===
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
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
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.green, space: 12 } },
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
function makeTable({ widths, header, rows, headerColor = COLOR.blue }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map((h, i) =>
      tCell(h, { width: widths[i], shade: headerColor, color: "FFFFFF", bold: true, size: 19 }),
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
function Encart({ title, lines, color = COLOR.green, fill = COLOR.greenLt }) {
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

// === Cover ===
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
      children: [new TextRun({ text: "DOSSIER SUBVENTIONS PUBLIQUES", size: 44, bold: true, color: COLOR.green, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: "Bpifrance · FEDER · Dispositifs régionaux · Statut JEI · CIR/CII", size: 22, color: COLOR.gray, font: "Calibri" })],
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
      children: [new TextRun({ text: "eventylife@gmail.com · eventylife.fr · 30 avril 2026", size: 18, color: COLOR.gray, font: "Calibri" })],
    }),
    PB(),
  ];
}

// ============================================================
// 1. Vue d'ensemble
// ============================================================
function partie1Vue() {
  return [
    H1("1. Vue d'ensemble — pourquoi Eventy peut viser des dispositifs publics"),
    Quote("Eventy Life réunit plusieurs caractéristiques qui rendent l'entreprise éligible à de nombreux dispositifs publics français et européens : projet innovant, plateforme propriétaire, création d'emplois indépendants, ancrage territorial, structuration d'un secteur tourisme français face aux plateformes mondialisées."),

    H2("1.1. Caractéristiques d'éligibilité d'Eventy"),
    P("Eventy Life présente plusieurs attributs convergents qui ouvrent l'accès aux dispositifs publics :"),
    Bullet("Société française de droit français (SAS), siège en France, données hébergées en France."),
    Bullet("Projet innovant — plateforme technique propriétaire (1 M+ lignes de code, 31 modules backend, 3 300+ tests automatisés), modèle économique distribué inédit dans le secteur tourisme français."),
    Bullet("PME au sens européen (effectifs < 250, CA < 50 M€, total bilan < 43 M€) — éligible aux dispositifs PME."),
    Bullet("Création d'emplois directs (5 ETP An 1 → 35 ETP An 5) et indirects (150 → 1 600 créateurs indépendants, 8 → 70 autocaristes partenaires)."),
    Bullet("Investissement R&D significatif (auto-financement plateforme propriétaire, dépenses R&D supérieures à 15 % du CA en An 1)."),
    Bullet("Modèle redistributif (6,8 % du CA reversés aux indépendants français) — politique RSE intrinsèque."),
    Bullet("Secteur stratégique français (tourisme = 8 % du PIB, 1ère destination touristique mondiale)."),
    Bullet("Conformité réglementaire native (Code du Tourisme, directive UE 2015/2302, RGPD)."),

    H2("1.2. Cartographie des dispositifs visés"),
    P("Les dispositifs ciblés sont organisés en six familles complémentaires. Chaque dispositif est décrit dans la suite du dossier."),
    makeTable({
      widths: [3500, 5860],
      header: ["Famille", "Dispositifs visés"],
      rows: [
        ["Bpifrance — subventions et prêts", "French Tech Tremplin · French Tech Émergence · AFI · ADI · Prêt Amorçage · Prêt Innovation · Garantie Création · Concours i-Nov / i-Lab"],
        ["FEDER — fonds européens", "Programmes opérationnels régionaux 2021-2027 — axe Innovation et axe Économie numérique"],
        ["Dispositifs régionaux", "Aides régionales à l'innovation (ARI), Fonds Régionaux d'Aide à l'Innovation, dispositifs Région Île-de-France ou autre selon siège"],
        ["Tourisme — sectoriel", "Plan Destination France · Banque des Territoires (Caisse des Dépôts) · France Tourisme · ATD Quart Monde · ANCV (Agence Nationale Chèques-Vacances)"],
        ["Statut fiscal", "Jeune Entreprise Innovante (JEI) · Jeune Entreprise de Croissance (JEC)"],
        ["Crédits d'impôt", "Crédit d'Impôt Recherche (CIR) · Crédit d'Impôt Innovation (CII)"],
      ],
    }),

    H2("1.3. Synthèse des montants potentiels — fourchette de mobilisation"),
    Encart({
      title: "FOURCHETTE GLOBALE DE FINANCEMENTS PUBLICS POTENTIELS",
      lines: [
        { text: "Les fourchettes ci-dessous sont indicatives, fonction de la qualité du dossier, du calendrier de demande et de l'éligibilité effective. Elles doivent être confirmées avec un conseil spécialisé en aides publiques.", italics: true, align: AlignmentType.JUSTIFIED },
        { text: "Subventions non remboursables — fourchette cumulée An 1-3 : 80 K€ à 250 K€", align: AlignmentType.CENTER, bold: true, size: 22, color: COLOR.green },
        { text: "Avances remboursables — fourchette cumulée An 1-3 : 100 K€ à 500 K€", align: AlignmentType.CENTER, bold: true, size: 22, color: COLOR.green },
        { text: "Prêts à taux zéro ou bonifié — fourchette cumulée An 1-3 : 200 K€ à 800 K€", align: AlignmentType.CENTER, bold: true, size: 22, color: COLOR.green },
        { text: "Garanties bancaires — fourchette cumulée : jusqu'à 1 M€ d'emprunt couvert", align: AlignmentType.CENTER, bold: true, size: 22, color: COLOR.green },
        { text: "Crédits d'impôt récurrents (CIR + CII + JEI) An 1 : 50 K€ à 100 K€", align: AlignmentType.CENTER, bold: true, size: 22, color: COLOR.green },
      ],
    }),
    P("Total cumulé maximal théorique sur 3 ans : entre 500 K€ et 2,5 M€ — fonction des candidatures retenues. Cette enveloppe complète et sécurise la levée de fonds privée Seed (200-300 K€) et Série A (500 K€-1 M€) décrite dans le dossier investisseur."),
    PB(),
  ];
}

// ============================================================
// 2. Bpifrance
// ============================================================
function partie2Bpifrance() {
  return [
    H1("2. Bpifrance — dispositifs ciblés"),
    Quote("Bpifrance est le bras armé du financement de l'innovation et de l'amorçage en France. Ses dispositifs couvrent l'intégralité du parcours d'une jeune entreprise innovante."),

    H2("2.1. Bourse French Tech Émergence (BFTE)"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Subvention non remboursable"],
        ["Montant", "Jusqu'à 30 000 € (taux d'intervention 70 % des dépenses éligibles)"],
        ["Cible Eventy", "Étude de faisabilité pré-lancement, validation des hypothèses, prototypage"],
        ["Conditions", "PME française < 8 ans, projet innovant, dépenses < 50 K€"],
        ["Calendrier de candidature", "Toute l'année, instruction 6 à 12 semaines"],
        ["Estimation Eventy", "20 K€ à 30 K€ (probabilité de retenue : modérée)"],
      ],
    }),

    H2("2.2. French Tech Tremplin (FTT)"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Bourse + accompagnement (cible : entrepreneurs autodidactes ou issus de la diversité)"],
        ["Montant", "Jusqu'à 30 000 € + accompagnement 12 mois"],
        ["Cible Eventy", "Soutien au fondateur autodidacte, accélération réseau"],
        ["Conditions", "Profil non-diplômé ou issu de la diversité, projet innovant"],
        ["Probabilité Eventy", "Modérée — alignement avec le profil autodidacte du fondateur"],
      ],
    }),

    H2("2.3. AFI — Aide pour la Faisabilité de l'Innovation"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Subvention non remboursable"],
        ["Montant", "Jusqu'à 50 000 € (taux 50 à 70 %)"],
        ["Cible Eventy", "Étude technique pré-développement, validation R&D"],
        ["Conditions", "PME, projet innovant, dépenses éligibles internes ou prestations externes"],
        ["Probabilité Eventy", "Modérée — la plateforme étant déjà développée, l'AFI conviendrait à un module additionnel"],
      ],
    }),

    H2("2.4. ADI — Aide pour le Développement de l'Innovation"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Avance remboursable (taux zéro)"],
        ["Montant", "Jusqu'à 500 000 € (taux 25 à 65 % des dépenses)"],
        ["Cible Eventy", "Développement de modules avancés (charter A320 An 3, IA recommandation, app mobile)"],
        ["Conditions", "PME, projet de développement innovant, programme défini sur 18-24 mois"],
        ["Remboursement", "5 à 10 ans après mise sur le marché ; remboursement modulé selon succès commercial"],
        ["Probabilité Eventy", "Forte si dossier bien construit avec composante R&D claire (estimation 100-200 K€)"],
      ],
    }),

    H2("2.5. Prêt d'Amorçage Investissement"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Prêt à taux bonifié, sans garantie personnelle"],
        ["Montant", "50 000 € à 100 000 €"],
        ["Cible Eventy", "Renforcement de la trésorerie de démarrage"],
        ["Conditions", "Création récente, fonds propres min. 30 K€"],
        ["Durée", "8 ans dont 3 de différé"],
        ["Probabilité Eventy", "Forte si combiné avec une levée de fonds privée"],
      ],
    }),

    H2("2.6. Prêt Innovation"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Prêt à taux bonifié"],
        ["Montant", "50 000 € à 5 000 000 €"],
        ["Cible Eventy", "Financement de l'expansion européenne et du charter A320 An 3"],
        ["Conditions", "PME innovante, projet bien construit"],
        ["Durée", "7 à 8 ans, différé partiel"],
        ["Probabilité Eventy", "À étudier en An 2-3 lors de l'expansion"],
      ],
    }),

    H2("2.7. Garantie Création"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Nature", "Garantie sur prêt bancaire — Bpifrance se porte caution"],
        ["Couverture", "60 % du prêt bancaire (jusqu'à 70 % en cas de QPV ou ZRR)"],
        ["Cible Eventy", "Faciliter l'obtention d'un prêt bancaire commercial pour BFR ou investissement"],
        ["Conditions", "Création / reprise / développement, pas de cumul avec d'autres garanties Bpifrance"],
        ["Probabilité Eventy", "Forte — dispositif standard, dossier rapide"],
      ],
    }),

    H2("2.8. Concours i-Lab et i-Nov"),
    Bullet("i-Lab — concours national d'aide à la création d'entreprises de technologies innovantes. Lauréats : jusqu'à 600 K€ subvention."),
    Bullet("i-Nov — concours d'innovation pour PME, jusqu'à 5 M€ d'aides cumulées (subventions + avances remboursables)."),
    Bullet("Vague annuelle, sélectivité élevée. Nécessite un dossier substantiel et un projet R&D clairement identifié."),
    Bullet("Eventy candidaterait au concours i-Nov 2027 sur la thématique « Numérique au service du tourisme français »."),
    PB(),
  ];
}

// ============================================================
// 3. FEDER
// ============================================================
function partie3FEDER() {
  return [
    H1("3. FEDER — Fonds Européen de Développement Régional"),
    Quote("Le FEDER finance les stratégies régionales d'innovation et de transition numérique. Les programmes opérationnels 2021-2027 ouvrent à Eventy plusieurs axes pertinents."),

    H2("3.1. Programmation FEDER 2021-2027"),
    P("La programmation FEDER en cours, dotée de 9,1 milliards d'euros pour la France métropolitaine + ultramarine, s'articule autour de 5 objectifs stratégiques (OS) :"),
    Numbered("OS1 — Une Europe plus intelligente (innovation, numérisation, compétitivité PME)"),
    Numbered("OS2 — Une Europe plus verte (transition écologique)"),
    Numbered("OS3 — Une Europe plus connectée (mobilité, numérique territorial)"),
    Numbered("OS4 — Une Europe plus sociale (emploi, formation)"),
    Numbered("OS5 — Une Europe plus proche de ses citoyens (développement local, tourisme durable)"),
    P("Eventy Life est éligible aux Objectifs Stratégiques 1 (innovation PME) et 5 (tourisme durable territorial) du programme régional dont relève le siège social."),

    H2("3.2. Axes pertinents pour Eventy"),
    makeTable({
      widths: [3000, 6360],
      header: ["Axe FEDER", "Pertinence Eventy"],
      rows: [
        ["1.1 — Soutien à la R&D et à l'innovation", "Plateforme tech propriétaire, modules R&D futurs (IA recommandation, app mobile, charter A320)"],
        ["1.2 — Numérisation des PME", "Plateforme SaaS interne, écosystème indépendants, transformation numérique du secteur"],
        ["1.3 — Compétitivité des PME", "Modèle économique distribué, création d'emplois, structuration d'un secteur français"],
        ["5.1 — Tourisme durable territorial", "Maillage 8 régions françaises, voyage de groupe en bus (vs aérien), partenariats HRA locaux"],
      ],
    }),

    H2("3.3. Modalités de candidature"),
    Bullet("Le FEDER est piloté par les Conseils Régionaux — chaque Région a son propre programme opérationnel et ses appels à projets."),
    Bullet("Le taux de cofinancement FEDER est typiquement de 40 à 60 % des dépenses éligibles."),
    Bullet("Les appels à projets sont publiés régulièrement par le Conseil Régional siège — calendrier mensuel ou trimestriel selon la Région."),
    Bullet("Le dossier requiert un montage technique précis (description du projet, plan financier, indicateurs de réalisation et de résultat, mesure d'impact territorial)."),
    Bullet("Délai d'instruction : 4 à 8 mois en moyenne."),

    H2("3.4. Estimation pour Eventy"),
    P("Selon la Région du siège social et la qualité du montage de dossier :"),
    Bullet("Subvention FEDER potentielle pour Eventy An 1-2 : 50 K€ à 200 K€ (taux 40-60 %)."),
    Bullet("Cible : projet « Plateforme numérique de structuration du tourisme de groupe français » (axe Numérisation PME + Tourisme durable)."),
    Bullet("Probabilité de retenue : modérée à forte si dossier robuste et candidature bien préparée avec le service Europe du Conseil Régional."),
    PB(),
  ];
}

// ============================================================
// 4. Dispositifs régionaux
// ============================================================
function partie4Regional() {
  return [
    H1("4. Dispositifs régionaux"),
    Quote("Chaque Région française dispose d'une boîte à outils d'aides à l'innovation, à la création d'emplois et au tourisme. Le siège d'Eventy déterminera les dispositifs précisément applicables."),

    H2("4.1. Aides Régionales à l'Innovation (ARI) — vue générique"),
    P("Présentes dans la plupart des Régions françaises, les ARI prennent généralement la forme d'avances remboursables ou de subventions pour les PME engagées dans un projet d'innovation. Elles sont gérées en partenariat avec Bpifrance et le Conseil Régional."),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique standard", "Détail"],
      rows: [
        ["Montant typique", "30 000 € à 200 000 €"],
        ["Forme", "Subvention OU avance remboursable selon la Région"],
        ["Taux d'intervention", "30 à 70 % des dépenses éligibles"],
        ["Dépenses éligibles", "R&D, prestations externes, salaires affectés, investissements matériels et logiciels"],
        ["Cofinancement Bpifrance possible", "Oui, pour les projets > 100 K€"],
        ["Calendrier", "Toute l'année selon la Région ; instruction 3 à 6 mois"],
      ],
    }),

    H2("4.2. Île-de-France — dispositifs phares (si siège IDF)"),
    Bullet("Innov'Up Faisabilité — subvention jusqu'à 100 K€ pour étude de faisabilité (taux 40-50 %)."),
    Bullet("Innov'Up Développement — avance remboursable jusqu'à 500 K€ pour développement de produit/service innovant."),
    Bullet("Innov'Up Leader PIA — pour projets très ambitieux > 1 M€."),
    Bullet("Pacte Innovation IDF — accompagnement et mise en réseau."),
    Bullet("Aides à l'embauche de cadres en R&D (jusqu'à 30 K€ par poste sur 3 ans)."),

    H2("4.3. Auvergne-Rhône-Alpes — dispositifs phares (si siège AURA)"),
    Bullet("AURA Entreprises — fonds régional d'investissement pour PME innovantes."),
    Bullet("Pack Tourisme AURA — soutien aux projets touristiques structurants."),
    Bullet("CAP Innov & Co — accompagnement à la R&D et au développement de produits innovants."),

    H2("4.4. Autres Régions — dispositifs équivalents"),
    P("Toutes les Régions françaises disposent d'équivalents (Hauts-de-France, Grand Est, Bretagne, Nouvelle-Aquitaine, Occitanie, PACA, Pays de la Loire, Centre-Val de Loire, Bourgogne-Franche-Comté, Normandie). Le périmètre exact, les montants et les modalités de candidature varient. Eventy cartographiera précisément les dispositifs de la Région siège après création de la SAS."),

    H2("4.5. Dispositifs métropolitains et locaux"),
    Bullet("Métropoles (Paris Métropole, Métropole de Lyon, Métropole Européenne de Lille, etc.) — dispositifs économiques propres."),
    Bullet("Communautés d'agglomération — soutien à l'implantation d'entreprises innovantes."),
    Bullet("Pôles de compétitivité (selon thématique) — accompagnement collaboratif et accès à des financements."),
    Bullet("French Tech locale — communautés régionales (French Tech Paris, Lyon, Bordeaux, Lille, etc.)."),
    PB(),
  ];
}

// ============================================================
// 5. Dispositifs sectoriels tourisme
// ============================================================
function partie5Tourisme() {
  return [
    H1("5. Dispositifs sectoriels tourisme"),
    Quote("Le secteur tourisme français bénéficie de dispositifs spécifiques portés par l'État, la Banque des Territoires et certaines collectivités."),

    H2("5.1. Plan Destination France"),
    P("Lancé en 2021, le Plan Destination France mobilise 1,9 Md€ pour reconquérir la première place mondiale du tourisme. Il finance notamment :"),
    Bullet("La transformation numérique du secteur — Eventy s'inscrit naturellement dans cet axe."),
    Bullet("L'attractivité des territoires touristiques."),
    Bullet("La montée en gamme et la diversification de l'offre française."),
    Bullet("La formation professionnelle dans les métiers du tourisme."),
    P("Eventy candidatera aux appels à projets du plan, notamment sur les axes Numérique et Tourisme durable, en partenariat avec Atout France et la Banque des Territoires."),

    H2("5.2. Banque des Territoires (Caisse des Dépôts)"),
    makeTable({
      widths: [3000, 6360],
      header: ["Dispositif", "Modalités"],
      rows: [
        ["Foncière du Tourisme", "Prises de participation dans projets touristiques structurants"],
        ["Prêt Tourisme Bpifrance/BdT", "Prêt à taux bonifié 100 K€ à 5 M€ pour PME tourisme"],
        ["Investissements en fonds propres", "Tickets 200 K€ à 2 M€ via fonds tourisme dédiés"],
        ["Accompagnement non financier", "Mise en réseau, conseil, mise à disposition d'expertise"],
      ],
    }),

    H2("5.3. France Tourisme et Atout France"),
    P("Atout France pilote la promotion touristique de la France à l'international. Au-delà du registre des opérateurs, Atout France propose :"),
    Bullet("Des appels à projets thématiques (Œnotourisme, Tourisme rural, etc.)."),
    Bullet("Un accompagnement marketing à l'export pour les opérateurs français."),
    Bullet("Des contrats de destination où Eventy peut s'inscrire comme partenaire opérateur."),

    H2("5.4. ANCV — Agence Nationale pour les Chèques-Vacances"),
    P("L'ANCV gère les chèques-vacances, levier de paiement pour de nombreux voyageurs Eventy. Au-delà de l'acceptation des chèques (à étudier en An 1), l'ANCV propose :"),
    Bullet("Des programmes d'aide au départ en vacances pour publics fragiles."),
    Bullet("Des partenariats tarifaires avec opérateurs agréés."),
    Bullet("Une visibilité auprès de 4,5 millions de bénéficiaires de chèques-vacances."),

    H2("5.5. Tourisme social et solidaire"),
    P("Eventy peut s'inscrire dans la dynamique du tourisme social et solidaire (UNAT, FNOTSI, ATD Quart Monde) — segments souvent éligibles à des cofinancements publics et générant un volume significatif (groupes seniors, comités d'entreprise, associations)."),
    PB(),
  ];
}

// ============================================================
// 6. Statut JEI et crédits d'impôt
// ============================================================
function partie6Statut() {
  return [
    H1("6. Statut Jeune Entreprise Innovante (JEI) et crédits d'impôt"),
    Quote("Le statut JEI et les crédits d'impôt CIR/CII sont les outils fiscaux les plus puissants pour les jeunes entreprises innovantes en France. Eventy peut viser ces statuts dès l'année 1."),

    H2("6.1. Statut Jeune Entreprise Innovante (JEI)"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Cadre légal", "Article 44 sexies-0 A du Code Général des Impôts"],
        ["Conditions cumulatives", "PME < 8 ans · CA < 50 M€ · indépendance capitalistique · dépenses R&D ≥ 15 % des charges totales"],
        ["Avantage fiscal — IS", "Exonération totale d'IS sur le 1er exercice bénéficiaire, puis 50 % sur le 2nd"],
        ["Avantage social", "Exonération de cotisations patronales sur les rémunérations des chercheurs, techniciens R&D, gestionnaires de projet R&D, juristes industrie (jusqu'à 4,5 SMIC)"],
        ["Avantage local", "Exonération possible de CFE et de taxe foncière (sur délibération de la commune)"],
        ["Cumul", "Cumulable avec le CIR et le CII"],
      ],
    }),
    P("Eventy Life peut prétendre au statut JEI dès le 1er exercice si les dépenses R&D représentent au moins 15 % des charges totales. Compte tenu de l'effort R&D continue (maintenance plateforme, modules avancés, IA, mobile), la condition est tenable. L'attestation se demande à l'administration fiscale ou via rescrit fiscal préalable."),

    H2("6.2. Statut Jeune Entreprise de Croissance (JEC)"),
    P("Statut introduit en 2024 pour les PME en forte croissance (croissance > 100 % entre 2 exercices). Avantages similaires au JEI mais avec un seuil de R&D abaissé à 5 à 15 %. Eventy pourrait y prétendre dès l'An 2, étant donné la croissance prévisionnelle An 2 de + 400 % (16 M€ → 80 M€)."),

    H2("6.3. Crédit d'Impôt Recherche (CIR)"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Cadre légal", "Article 244 quater B du Code Général des Impôts"],
        ["Taux", "30 % des dépenses éligibles jusqu'à 100 M€ (5 % au-delà)"],
        ["Dépenses éligibles", "Salaires R&D, dotations aux amortissements R&D, prestations sous-traitées à organismes agréés, frais de fonctionnement (plafonnés)"],
        ["Modalité de versement", "Imputation sur l'IS dû, restitution immédiate pour PME, JEI et JEC"],
        ["Cumul", "Cumulable avec subventions (mais subventions à déduire de l'assiette CIR)"],
        ["Estimation Eventy An 1", "Si dépenses R&D ≈ 250 K€ × 30 % = 75 K€ de CIR"],
      ],
    }),

    H2("6.4. Crédit d'Impôt Innovation (CII)"),
    makeTable({
      widths: [3000, 6360],
      header: ["Caractéristique", "Détail"],
      rows: [
        ["Cible", "PME au sens européen (effectifs < 250, CA < 50 M€)"],
        ["Taux", "20 % des dépenses éligibles à compter de 2025"],
        ["Plafond annuel des dépenses", "400 000 €"],
        ["CII annuel maximum", "80 000 €"],
        ["Dépenses éligibles", "Conception et réalisation de prototypes ou installations pilotes de produits ou services nouveaux"],
        ["Estimation Eventy", "Probable maximum 80 K€ par exercice si développement continu de modules nouveaux"],
      ],
    }),

    H2("6.5. Synthèse fiscale An 1"),
    Encart({
      title: "ÉCONOMIE FISCALE PRÉVISIONNELLE EVENTY AN 1",
      lines: [
        { text: "Sous réserve d'éligibilité confirmée, Eventy peut viser :", italics: true, align: AlignmentType.JUSTIFIED },
        { text: "Statut JEI — Exonération IS : ≈ 0 € sur An 1 (résultat net 322 K€) → économie potentielle 100 % de l'IS, soit ≈ 107 K€", align: AlignmentType.JUSTIFIED },
        { text: "Statut JEI — Exonération cotisations patronales chercheurs : ≈ 30-40 K€ sur 5 ETP", align: AlignmentType.JUSTIFIED },
        { text: "CIR sur dépenses R&D ≈ 250 K€ × 30 % = ≈ 75 K€ (versement direct PME)", align: AlignmentType.JUSTIFIED },
        { text: "CII sur dépenses innovation ≈ 100 K€ × 20 % = ≈ 20 K€", align: AlignmentType.JUSTIFIED },
        { text: "TOTAL économie fiscale potentielle An 1 : ≈ 230 K€ à 250 K€", align: AlignmentType.CENTER, bold: true, size: 24, color: COLOR.green },
      ],
    }),
    P("Cette économie fiscale, si elle est intégralement mobilisée, équivaut à plus de 70 % du résultat net An 1 et constitue un levier majeur pour l'autofinancement de la croissance. Elle requiert un montage rigoureux (rescrit JEI, dossier CIR avec time-tracking, justification des dépenses)."),
    PB(),
  ];
}

// ============================================================
// 7. Stratégie de candidature
// ============================================================
function partie7Strategie() {
  return [
    H1("7. Stratégie de candidature et calendrier"),
    Quote("Une stratégie d'aides publiques ne s'improvise pas. Eventy adopte un séquencement priorisé pour maximiser le taux de retenue tout en préservant le temps du fondateur."),

    H2("7.1. Priorisation des candidatures (matrice impact / effort)"),
    makeTable({
      widths: [3500, 1500, 1500, 1500, 1360],
      header: ["Dispositif", "Probabilité", "Montant", "Effort", "Priorité"],
      rows: [
        ["Statut JEI", "Forte", "≈ 100 K€/an", "Faible", "🟢 P1"],
        ["CIR", "Forte", "≈ 75 K€/an", "Modéré", "🟢 P1"],
        ["CII", "Forte", "≈ 20 K€/an", "Faible", "🟢 P1"],
        ["Garantie Création Bpifrance", "Forte", "Garantie", "Faible", "🟢 P1"],
        ["Prêt d'Amorçage Bpifrance", "Forte", "≈ 100 K€", "Modéré", "🟢 P1"],
        ["French Tech Émergence (BFTE)", "Modérée", "≈ 30 K€", "Modéré", "🟡 P2"],
        ["French Tech Tremplin (FTT)", "Modérée", "≈ 30 K€", "Modéré", "🟡 P2"],
        ["AFI Bpifrance", "Modérée", "≈ 50 K€", "Modéré", "🟡 P2"],
        ["ARI régionale", "Modérée", "≈ 100 K€", "Modéré", "🟡 P2"],
        ["FEDER programmation 2021-2027", "Modérée", "≈ 100-200 K€", "Élevé", "🟡 P2"],
        ["ADI Bpifrance", "Forte (An 2-3)", "≈ 200 K€", "Élevé", "🟡 P3"],
        ["Concours i-Nov", "Faible-Modérée", "≈ 500 K€", "Très élevé", "🔵 P3"],
        ["Plan Destination France", "Modérée", "Variable", "Modéré", "🔵 P3"],
      ],
    }),
    P("Légende : 🟢 P1 = à activer dès la création (avantages quasi-automatiques), 🟡 P2 = à activer en An 1 (effort modéré), 🔵 P3 = à activer en An 2-3 (projets structurants)."),

    H2("7.2. Calendrier de candidature recommandé"),
    makeTable({
      widths: [1500, 4000, 3860],
      header: ["Période", "Candidatures à activer", "Livrables internes"],
      rows: [
        ["M0-M1 (création)", "Statut JEI (rescrit fiscal) · Garantie Création Bpifrance", "Dossier JEI · attestation expert-comptable"],
        ["M1-M3", "Prêt d'Amorçage Bpifrance · BFTE", "Demande Bpifrance en ligne"],
        ["M3-M6", "AFI Bpifrance · ARI régionale", "Dossiers techniques R&D"],
        ["M6-M9", "FEDER axe Numérisation PME / Tourisme", "Dossier FEDER en partenariat avec service Europe Région"],
        ["M9-M12", "CIR/CII An 1 (déclaration au moment de l'IS)", "Time-tracking R&D + dossier CIR validé par expert-comptable"],
        ["An 2", "ADI Bpifrance · Concours i-Nov · Plan Destination France", "Dossiers structurants pour modules charter A320, IA, mobile"],
      ],
    }),

    H2("7.3. Conseils externes mobilisés"),
    Bullet("Cabinet de conseil en aides publiques (consultant spécialisé) — pour la priorisation et le montage des dossiers les plus complexes (FEDER, ADI, i-Nov)."),
    Bullet("Expert-comptable spécialisé — pour la sécurisation du CIR/CII et du statut JEI (rescrits, time-tracking, justification)."),
    Bullet("Avocat tourisme — pour la conformité réglementaire des candidatures sectorielles (Plan Destination France, ATD)."),
    Bullet("Service Europe du Conseil Régional — pour le montage du dossier FEDER (gratuit, à mobiliser tôt)."),
    Bullet("French Tech locale — pour la mise en réseau et l'accès facilité aux dispositifs Bpifrance."),

    H2("7.4. Risques et points de vigilance"),
    Bullet("Cumul des dispositifs — certaines aides sont incompatibles (vérifier réglementation européenne sur les aides d'État, plafond de minimis 200 K€ sur 3 ans)."),
    Bullet("Restitution en cas de défaillance — les avances remboursables et certaines subventions peuvent être réclamées en cas de non-tenue des engagements."),
    Bullet("Instruction longue — délais réels souvent supérieurs aux délais affichés (FEDER en particulier)."),
    Bullet("Justification des dépenses — exigence de traçabilité forte (factures, time-tracking, livrables)."),
    Bullet("Risque de communication : ne pas annoncer de subvention non encore notifiée."),

    H2("7.5. Engagements d'Eventy en cas d'obtention"),
    Numbered("Affichage du logo et de la mention « Avec le soutien de [organisme] » sur les supports de communication appropriés."),
    Numbered("Reporting d'avancement à l'organisme financeur selon le calendrier convenu."),
    Numbered("Respect des indicateurs de réalisation et de résultat fixés au dossier."),
    Numbered("Conservation des pièces justificatives pendant la durée légale (10 ans pour le FEDER)."),
    Numbered("Coopération pleine en cas de contrôle ou audit."),
    PB(),
  ];
}

// ============================================================
// 8. Synthèse globale
// ============================================================
function partie8Synthese() {
  return [
    H1("8. Synthèse globale et recommandation"),

    H2("8.1. Total des dispositifs visés et hiérarchisation"),
    P("Eventy Life dispose d'un éventail riche de dispositifs publics complémentaires. La stratégie consiste à activer en priorité les dispositifs à fort ratio impact/effort (statut JEI, CIR/CII, Garantie Création), puis à mobiliser progressivement les dispositifs plus structurants (ADI, FEDER, i-Nov) au fur et à mesure du développement."),
    makeTable({
      widths: [3500, 2200, 2200, 1460],
      header: ["Catégorie", "Fourchette An 1", "Fourchette An 1-3", "Format"],
      rows: [
        ["Subventions non remboursables", "30-100 K€", "80-250 K€", "Aides directes"],
        ["Avances remboursables", "0 K€", "100-500 K€", "Remboursable selon succès"],
        ["Prêts à taux zéro / bonifié", "100 K€", "200-800 K€", "Remboursable"],
        ["Garanties bancaires", "—", "Jusqu'à 1 M€", "Garantie sur emprunt"],
        ["Crédits d'impôt JEI/CIR/CII", "200-250 K€", "600-750 K€ cumulés", "Économie fiscale"],
        ["TOTAL THÉORIQUE MAXIMAL", "350-450 K€", "1,2-3,3 M€", "Tous formats confondus"],
      ],
    }),

    H2("8.2. Effet sur le plan de financement Eventy"),
    P("L'apport public, combiné à la levée de fonds privée prévue (Seed 200-300 K€, Série A 500 K€-1 M€), porte le plan de financement total disponible sur 3 ans à entre 1,9 M€ et 4,6 M€ — largement supérieur aux besoins prévisionnels. Eventy disposera d'une marge de manœuvre stratégique significative pour accélérer l'expansion européenne ou pour résister à des aléas de conjoncture."),

    H2("8.3. Engagement d'Eventy"),
    Encart({
      title: "ENGAGEMENT D'EVENTY VIS-À-VIS DES FINANCEURS PUBLICS",
      lines: [
        { text: "Eventy Life s'engage, en cas d'obtention de financements publics :", align: AlignmentType.JUSTIFIED, italics: true },
        { text: "1. À utiliser les fonds strictement aux fins prévues dans la candidature.", align: AlignmentType.JUSTIFIED },
        { text: "2. À tenir une comptabilité analytique distincte permettant la traçabilité des dépenses subventionnées.", align: AlignmentType.JUSTIFIED },
        { text: "3. À reporter aux organismes financeurs selon le calendrier convenu, en toute transparence.", align: AlignmentType.JUSTIFIED },
        { text: "4. À mettre en avant les soutiens publics dans la communication et la documentation officielle.", align: AlignmentType.JUSTIFIED },
        { text: "5. À coopérer pleinement avec les autorités de contrôle et d'audit.", align: AlignmentType.JUSTIFIED },
        { text: "6. À rembourser sans délai les éventuelles avances remboursables selon les conditions de remboursement contractuelles.", align: AlignmentType.JUSTIFIED },
        { text: "7. À conserver les justificatifs pendant la durée légale.", align: AlignmentType.JUSTIFIED },
      ],
    }),

    H2("8.4. Prochaines étapes"),
    Numbered("Création de la SAS Eventy Life et obtention du Kbis."),
    Numbered("Demande du statut JEI par rescrit fiscal (sous 30 jours après création)."),
    Numbered("Activation de la Garantie Création Bpifrance et préparation du Prêt d'Amorçage."),
    Numbered("Cartographie précise des dispositifs régionaux selon le siège.")  ,
    Numbered("Mandat d'un consultant aides publiques pour les dossiers complexes (M3-M6)."),
    Numbered("Premières candidatures FEDER et ARI régionale (M6-M9)."),
    Numbered("Préparation du dossier ADI Bpifrance pour An 2 (modules charter / IA / mobile)."),

    Spacer(240),
    P("Document de référence interne — à actualiser semestriellement et à confirmer avec un consultant en aides publiques avant tout dépôt officiel.", { italics: true, color: COLOR.gray }),
    Spacer(160),
    P("Document confidentiel — usage strictement réservé aux destinataires habilités.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// Document
// ============================================================
const doc = new Document({
  creator: "David Eventy — Eventy Life SAS",
  title: "Eventy Life — Dossier Subventions Publiques",
  description: "Cartographie des dispositifs publics ciblés par Eventy Life (Bpifrance, FEDER, régional, JEI, CIR, CII).",
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: COLOR.blue },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: COLOR.orange },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: COLOR.blue },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ]},
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ]},
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Eventy Life — Dossier Subventions Publiques", size: 16, italics: true, font: "Calibri", color: COLOR.gray }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.green, space: 4 } },
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
                new TextRun({ text: "Eventy Life SAS — Dossier Subventions Publiques · Confidentiel", size: 14, color: COLOR.gray, font: "Calibri" }),
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
        ...partie1Vue(),
        ...partie2Bpifrance(),
        ...partie3FEDER(),
        ...partie4Regional(),
        ...partie5Tourisme(),
        ...partie6Statut(),
        ...partie7Strategie(),
        ...partie8Synthese(),
      ],
    },
  ],
});

const outputPath = process.argv[2] || "Eventy-Life-Dossier-Subventions-Publiques.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`✓ Dossier subventions généré : ${outputPath} (${sizeKB} KB)`);
});
