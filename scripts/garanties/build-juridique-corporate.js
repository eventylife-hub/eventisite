/**
 * Eventy Life — Trois documents juridiques corporate
 *
 *   1. Statuts SAS Eventy Life (version standalone complète)
 *   2. Pacte d'associés type — pour la levée Seed
 *   3. Onboarding partenaires Eventy (créateur · vendeur · HRA)
 *
 * Usage : node scripts/garanties/build-juridique-corporate.js
 */

const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Footer,
  AlignmentType,
  LevelFormat,
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

function H1(text) {
  return new Paragraph({
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 20, color: COLOR.blue, font: "Calibri" })],
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text, size: opts.size || 20, font: "Calibri",
        color: opts.color || COLOR.black, bold: opts.bold, italics: opts.italics,
      }),
    ],
  });
}
function Bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
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
function Spacer(after = 120) { return new Paragraph({ spacing: { after }, children: [new TextRun("")] }); }

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
            text, size: opts.size || 18, bold: opts.bold,
            color: opts.color || COLOR.black, font: "Calibri",
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
  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((c, i) =>
        tCell(c, { width: widths[i], shade: ri % 2 === 0 ? COLOR.grayLt : undefined }),
      ),
    }),
  );
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}
function bandeauTitre(title, sous) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
              left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
              bottom: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
              right: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: COLOR.cream, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: title, size: 28, bold: true, color: COLOR.orange, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: sous, size: 18, italics: true, color: COLOR.blue, font: "Calibri" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function blocSignature(roleA, roleB) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
            width: { size: 4680, type: WidthType.DXA },
            margins: { top: 100, bottom: 200, left: 120, right: 120 },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: roleA, bold: true, size: 20, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "[Nom Prénom + qualité]", size: 18, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + date)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
            ],
          }),
          new TableCell({
            borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
            width: { size: 4680, type: WidthType.DXA },
            margins: { top: 100, bottom: 200, left: 120, right: 120 },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: roleB, bold: true, size: 20, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "[Nom Prénom + qualité]", size: 18, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + mention « Lu et approuvé »)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ============================================================
// DOCUMENT 1 — STATUTS SAS EVENTY LIFE
// ============================================================
function statutsSAS() {
  return [
    bandeauTitre(
      "STATUTS DE LA SOCIÉTÉ EVENTY LIFE",
      "Société par Actions Simplifiée (SAS) — Articles 1 à 22",
    ),
    Spacer(160),

    P("Les soussignés constituent une société par actions simplifiée (SAS) régie par les articles L227-1 et suivants du Code de commerce, par les présents statuts et par les lois et règlements en vigueur. Le présent document constitue les statuts originaux de la société.", { italics: true }),

    H2("Article 1 — Forme"),
    P("La société est constituée sous forme de Société par Actions Simplifiée (SAS) régie par les dispositions légales et réglementaires applicables, notamment les articles L227-1 et suivants du Code de commerce, et par les présents statuts."),

    H2("Article 2 — Dénomination sociale"),
    P("La dénomination sociale de la société est : EVENTY LIFE."),
    P("Tous les actes et documents émanant de la société et destinés aux tiers doivent indiquer la dénomination sociale, précédée ou suivie immédiatement et lisiblement des mots « société par actions simplifiée » ou des initiales « SAS », de l'énonciation du capital social, du siège social et du numéro d'immatriculation au registre du commerce et des sociétés."),

    H2("Article 3 — Objet social"),
    P("La société a pour objet, en France et à l'étranger :"),
    Bullet("L'organisation, la promotion, la commercialisation et la vente de voyages, séjours et prestations touristiques à forfait au sens des articles L211-1 et suivants du Code du Tourisme."),
    Bullet("La conception et l'exploitation d'une plateforme numérique de mise en relation entre voyageurs et créateurs de voyages indépendants."),
    Bullet("La fourniture de services connexes d'assistance, d'accompagnement, d'animation, d'assurance dans le cadre des séjours organisés."),
    Bullet("L'achat, la vente, la location, la gestion et l'exploitation de tous biens mobiliers et immobiliers utiles à l'objet social."),
    Bullet("Toutes opérations commerciales, industrielles, financières, mobilières ou immobilières se rapportant directement ou indirectement à l'objet social ou de nature à favoriser son développement."),
    P("L'activité d'opérateur de voyages s'exerce sous immatriculation au registre des opérateurs de voyages et de séjours d'Atout France et bénéficie d'une garantie financière conforme à l'article L211-18 du Code du Tourisme."),

    H2("Article 4 — Siège social"),
    P("Le siège social est fixé à : [adresse postale complète à compléter]. Il pourra être transféré en tout autre endroit du territoire français par simple décision du Président, qui est habilité à modifier les statuts en conséquence et à effectuer les formalités correspondantes."),

    H2("Article 5 — Durée"),
    P("La durée de la société est fixée à quatre-vingt-dix-neuf (99) années à compter de son immatriculation au Registre du Commerce et des Sociétés, sauf cas de dissolution anticipée ou de prorogation décidée selon les conditions prévues par la loi et les présents statuts."),

    H2("Article 6 — Apports"),
    P("Il est apporté à la société, en numéraire :"),
    P("Par M. David Eventy, demeurant [adresse], la somme de [TROIS MILLE EUROS (3 000 €)] correspondant à 3 000 actions ordinaires entièrement libérées et souscrites à la constitution.", { italics: true }),
    P("Total des apports en numéraire : 3 000 €. Ces apports ont été déposés à la banque [Nom de la banque domiciliataire], conformément à un certificat de dépôt joint en annexe aux présents statuts."),

    H2("Article 7 — Capital social"),
    P("Le capital social est fixé à TROIS MILLE EUROS (3 000 €). Il est divisé en 3 000 actions ordinaires d'UN EURO (1 €) de nominal chacune, intégralement libérées."),
    P("Le capital pourra être porté à 10 000 € au plus tard à l'issue de la première levée de fonds ou de la fin de la première année d'exercice, selon décision de l'associé unique ou de la collectivité des associés."),

    H2("Article 8 — Augmentations et réductions de capital"),
    P("Le capital peut être augmenté par tout moyen et selon toute modalité prévue par la loi, par décision de l'associé unique ou par décision collective des associés à la majorité simple, après rapport du Président. Le capital peut être réduit par décision collective des associés à la majorité de deux tiers, après rapport du Président, dans les conditions prévues par la loi."),

    H2("Article 9 — Forme et libération des actions"),
    P("Les actions sont nominatives. Leur transmission est soumise aux modalités prévues à l'article 10. Toute action conserve son individualité ; les actions sont indivisibles à l'égard de la société."),

    H2("Article 10 — Cession et transmission des actions"),
    P("Les cessions d'actions, à titre onéreux ou gratuit, par voie de mutation entre vifs ou par voie de succession, sont soumises à l'agrément préalable du Président, qui statue souverainement sans avoir à motiver sa décision."),
    P("Toute cession projetée doit faire l'objet d'une notification au Président par lettre recommandée avec accusé de réception, indiquant l'identité du cessionnaire, le nombre d'actions concernées et le prix proposé. Le Président dispose d'un délai de trois (3) mois pour notifier sa décision. À défaut de réponse dans ce délai, l'agrément est réputé acquis."),
    P("Les présentes dispositions s'appliquent à l'ensemble des cessions, y compris celles entre associés, à l'exception des transmissions au profit du conjoint, ascendants ou descendants directs."),

    H2("Article 11 — Direction de la société : le Président"),
    P("La société est dirigée par un Président, personne physique ou morale, désigné par décision de l'associé unique ou par décision collective des associés à la majorité simple. Le Président est nommé pour une durée déterminée ou indéterminée. Il peut être révoqué à tout moment, ad nutum, par décision de l'associé unique ou de la collectivité des associés à la majorité simple, sans qu'il y ait lieu d'invoquer un motif de révocation."),
    P("Le Président représente la société à l'égard des tiers et est investi des pouvoirs les plus étendus pour agir en toute circonstance au nom de la société, dans la limite de l'objet social et sous réserve des pouvoirs expressément attribués aux associés par la loi ou par les présents statuts."),
    P("Le Président peut consentir à toute personne de son choix toutes délégations de pouvoirs qu'il jugera nécessaires, dans la limite de ceux qui lui sont conférés par la loi et les présents statuts."),

    H2("Article 12 — Direction Générale"),
    P("Le Président peut nommer un ou plusieurs Directeurs Généraux, personnes physiques ou morales, dont les pouvoirs, la rémunération et la durée du mandat sont fixés par décision du Président. Les Directeurs Généraux disposent à l'égard des tiers des mêmes pouvoirs que le Président."),

    H2("Article 13 — Engagement du Président — réserve volontaire « risques tourisme »"),
    P("Le Président s'engage personnellement à ne pas verser de dividendes tant que le résultat distribuable n'aura pas reconstitué un fonds de réserve dédié à la couverture des risques tourisme à hauteur de cinq pour cent (5 %) du chiffre d'affaires annuel de la société. Cette clause de réserve volontaire renforce la protection des voyageurs au-delà des obligations légales et constitue un engagement statutaire opposable à la société et à ses associés."),
    P("Cette réserve volontaire est dotée par prélèvement prioritaire sur le résultat distribuable. Elle ne peut être mobilisée que pour : (i) le financement d'une indemnisation voyageur dans le cadre d'un sinistre non couvert par les assurances en vigueur ; (ii) le maintien de la trésorerie d'exploitation en cas d'événement exceptionnel ; (iii) le renforcement de la garantie financière APST si nécessaire. Toute mobilisation est documentée dans le rapport annuel et notifiée à l'organisme garant de la garantie financière."),

    H2("Article 14 — Décisions collectives des associés"),
    P("Les décisions collectives des associés sont prises soit en assemblée, soit par consultation écrite, soit par acte unanime, à l'initiative du Président. Sont prises en assemblée les décisions relatives à : approbation des comptes annuels, affectation du résultat, dissolution, modification des statuts, transformation de la société, désignation et révocation du Président."),
    P("Les autres décisions peuvent être prises par consultation écrite, sur initiative du Président, qui adresse à chaque associé un texte de résolutions accompagné des informations utiles. Les associés disposent d'un délai de quinze (15) jours pour répondre. Le silence vaut abstention."),

    H2("Article 15 — Quorum et majorités"),
    P("Sauf dispositions contraires de la loi ou des présents statuts, les décisions collectives sont valablement prises à la majorité simple des voix exprimées. Les décisions suivantes requièrent une majorité qualifiée :"),
    Bullet("Modification des statuts : majorité des deux tiers des actions composant le capital social."),
    Bullet("Transformation de la société : unanimité."),
    Bullet("Dissolution anticipée : majorité des deux tiers."),
    Bullet("Augmentation des engagements des associés : unanimité."),

    H2("Article 16 — Droit de vote — droit d'information"),
    P("Chaque action confère à son titulaire le droit à une voix dans les décisions collectives. L'associé unique exerce seul l'ensemble des prérogatives attribuées par la loi à la collectivité des associés."),
    P("Les associés disposent d'un droit permanent d'information sur la marche de la société. Ils peuvent à tout moment consulter au siège social les documents prévus par la loi (rapport de gestion, comptes annuels, procès-verbaux des décisions). Pour la préparation des décisions collectives, les documents sont communiqués au moins quinze (15) jours avant la date prévue de la décision."),

    H2("Article 17 — Exercice social"),
    P("L'exercice social commence le 1er janvier et se termine le 31 décembre de chaque année. Par exception, le premier exercice social commencera à la date d'immatriculation de la société au Registre du Commerce et des Sociétés et se terminera le 31 décembre de l'année [à compléter]."),

    H2("Article 18 — Comptes annuels"),
    P("À la clôture de chaque exercice, le Président établit l'inventaire, le bilan, le compte de résultat et l'annexe, conformément aux règles comptables applicables. Il établit également un rapport de gestion présentant la situation et l'activité de la société pendant l'exercice écoulé, les résultats, l'évolution prévisible et les événements importants survenus depuis la clôture."),
    P("Les comptes annuels sont arrêtés par le Président et soumis à l'approbation de l'associé unique ou de la collectivité des associés dans les six (6) mois suivant la clôture de l'exercice."),

    H2("Article 19 — Affectation du résultat"),
    P("Sur le bénéfice de l'exercice, diminué le cas échéant des pertes antérieures, il est prélevé :"),
    Numbered("Cinq pour cent (5 %) au moins pour constituer le fonds de réserve légale, jusqu'à ce qu'il atteigne le dixième du capital social."),
    Numbered("Toutes sommes nécessaires pour doter la réserve volontaire « risques tourisme » à hauteur de 5 % du chiffre d'affaires annuel (article 13), jusqu'à ce que cette réserve soit reconstituée."),
    P("Le solde, constituant le bénéfice distribuable, est affecté selon décision de l'associé unique ou de la collectivité des associés : distribution sous forme de dividendes, mise en réserves libres, report à nouveau, dans les conditions prévues par la loi."),

    H2("Article 20 — Commissaire aux comptes"),
    P("La désignation d'un commissaire aux comptes est obligatoire dès lors que la société dépasse, à la clôture d'un exercice, deux des seuils suivants : total du bilan de 5 millions d'euros, chiffre d'affaires hors taxes de 10 millions d'euros, nombre moyen de salariés de 50. Tant que ces seuils ne sont pas franchis, la désignation d'un commissaire aux comptes est facultative."),

    H2("Article 21 — Dissolution — liquidation"),
    P("La société est dissoute dans les cas prévus par la loi ou par décision collective des associés à la majorité des deux tiers. La liquidation est effectuée par un ou plusieurs liquidateurs nommés par l'associé unique ou la collectivité des associés, qui en fixent la rémunération et les pouvoirs. Le boni de liquidation est réparti entre les associés au prorata de leur participation au capital."),

    H2("Article 22 — Loi applicable et juridiction"),
    P("Les présents statuts sont soumis au droit français. Toute contestation susceptible de naître entre les associés ou entre la société et les associés à raison de l'exécution des présents statuts sera soumise aux tribunaux compétents conformément au Code de procédure civile."),

    Spacer(180),
    P("Fait à [Ville], le [Date], en autant d'originaux que nécessaire pour les formalités d'immatriculation et de dépôt légal.", { italics: true, after: 200 }),
    blocSignature("M. David Eventy, Président", "Associé unique"),

    Spacer(160),
    P("Document de référence — voir aussi : Annexe K du dossier de garantie financière (squelette de référence).", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PACTE D'ASSOCIÉS TYPE SEED
// ============================================================
function pacteAssocies() {
  return [
    bandeauTitre(
      "PACTE D'ASSOCIÉS — TOUR SEED",
      "Modèle type pour la levée Seed Eventy Life — version finalisable avec avocat",
    ),
    Spacer(160),

    P("Le présent pacte d'associés est un modèle type destiné à être finalisé entre EVENTY LIFE SAS, son fondateur et les investisseurs Seed lors de la première levée de fonds. Il complète les statuts de la société et organise les relations entre associés. Il doit être impérativement validé par un avocat spécialisé en droit des sociétés et en capital-risque avant signature.", { italics: true }),

    H2("Article 1 — Parties au pacte"),
    P("Sont parties au présent pacte :"),
    Bullet("M. David Eventy, fondateur, président et associé majoritaire d'EVENTY LIFE SAS, ci-après dénommé « le Fondateur »."),
    Bullet("Les investisseurs participant à la levée Seed, listés en Annexe 1, ci-après dénommés collectivement « les Investisseurs Seed » ou individuellement « l'Investisseur »."),
    Bullet("EVENTY LIFE SAS, ci-après dénommée « la Société », pour les engagements pris en propre."),

    H2("Article 2 — Objet du pacte"),
    P("Le présent pacte a pour objet d'organiser les relations entre les Parties pendant toute la durée de leur participation au capital de la Société. Il complète les statuts sociaux sans s'y substituer. En cas de contradiction entre le pacte et les statuts, les statuts prévalent. Le pacte est destiné à protéger les intérêts respectifs du Fondateur et des Investisseurs et à organiser la gouvernance, les transferts d'actions, les liquidités et la sortie."),

    H2("Article 3 — Investissement et valorisation"),
    makeTable({
      widths: [3500, 5860],
      header: ["Paramètre", "Valeur de référence"],
      rows: [
        ["Montant total levé Seed", "Entre 200 000 € et 300 000 € (à finaliser)"],
        ["Valorisation pré-money", "Cible : 5 000 000 € (fourchette 4 à 6 M€ selon traction)"],
        ["Valorisation post-money", "Entre 5 200 000 € et 5 300 000 €"],
        ["Dilution Fondateur", "Entre 4 % et 6 %"],
        ["Forme d'investissement", "Augmentation de capital OU BSA-AIR (à arbitrer)"],
        ["Liquidation préférence", "1× non-participating (standard early-stage)"],
        ["Anti-dilution", "Weighted average broad-based"],
      ],
    }),

    H2("Article 4 — Gouvernance"),
    P("Pendant la durée du pacte :"),
    Bullet("Le Fondateur conserve la présidence de la Société et le contrôle des décisions opérationnelles courantes."),
    Bullet("Un comité d'investissement informel est constitué entre le Fondateur et les Investisseurs Seed représentant ensemble au moins 5 % du capital. Il se réunit trimestriellement (visio acceptée)."),
    Bullet("Les Investisseurs disposent d'un droit d'information renforcé : reporting trimestriel financier et opérationnel, accès aux comptes annuels et aux principaux indicateurs (CA, marge brute, voyageurs, trésorerie, ETP, indicateurs qualité)."),
    Bullet("Aucun siège d'administrateur n'est attribué de droit aux Investisseurs Seed (gouvernance simplifiée à ce stade)."),
    Bullet("La désignation d'un commissaire aux comptes facultatif peut être demandée par les Investisseurs détenant ensemble au moins 10 % du capital."),

    H2("Article 5 — Décisions soumises à droit de veto"),
    P("Sans préjudice des compétences du Président, les décisions suivantes ne peuvent être prises sans l'accord préalable des Investisseurs Seed représentant au moins 50 % du capital détenu par les Investisseurs :"),
    Bullet("Modification de l'objet social ou cessation d'une branche significative d'activité."),
    Bullet("Ouverture du capital à un nouvel investisseur (Série A et au-delà) — préalable d'information requis."),
    Bullet("Émission de toute valeur mobilière donnant accès au capital."),
    Bullet("Cession d'actifs significatifs (> 25 % du total bilan)."),
    Bullet("Prise ou cession de participation > 10 % dans une société tierce."),
    Bullet("Endettement bancaire significatif (> 500 K€ ou > 10 % du CA prévisionnel annuel)."),
    Bullet("Changement de Président ou de Directeur Général."),
    Bullet("Distribution exceptionnelle de dividendes (au-delà de la politique standard de réinvestissement)."),
    Bullet("Toute opération de restructuration, fusion, scission, dissolution."),

    H2("Article 6 — Cession des actions"),
    H3("6.1. Inaliénabilité du Fondateur"),
    P("Le Fondateur s'engage à ne pas céder tout ou partie de ses actions de la Société pendant une durée minimale de trente-six (36) mois à compter de la signature du pacte, sauf accord exprès et écrit des Investisseurs Seed représentant au moins 75 % du capital détenu par eux."),
    H3("6.2. Droit de préemption"),
    P("Toute cession projetée par un associé fait l'objet d'une notification préalable aux autres associés, qui disposent d'un droit de préemption proportionnel à leur participation au capital, à exercer dans un délai de trente (30) jours."),
    H3("6.3. Droit de sortie conjointe (Tag-along)"),
    P("Si le Fondateur projette de céder à un tiers plus de 25 % de ses actions, les Investisseurs Seed disposent d'un droit de sortie conjointe leur permettant de céder leurs propres actions au même tiers, aux mêmes conditions et au prorata."),
    H3("6.4. Droit d'entraînement (Drag-along)"),
    P("En cas d'offre tierce de bonne foi portant sur 100 % du capital de la Société, à un prix au moins égal à la valorisation post-money de la levée Seed multipliée par cinq (5×), les associés représentant ensemble plus de 75 % du capital peuvent contraindre les associés minoritaires à céder leurs actions au tiers acquéreur, aux mêmes conditions."),

    H2("Article 7 — Anti-dilution"),
    P("En cas d'augmentation de capital ultérieure (Série A, Série B, etc.) à un prix par action inférieur au prix de souscription du tour Seed, les Investisseurs Seed bénéficieront d'un mécanisme d'anti-dilution dit « weighted average broad-based » permettant de réajuster leur participation pour limiter la dilution."),

    H2("Article 8 — Liquidation préférence"),
    P("En cas d'opération de liquidation, vente, fusion, ou tout événement assimilé entraînant une distribution aux associés, les Investisseurs Seed bénéficieront d'une préférence de liquidation égale à une (1) fois leur investissement, en non-participating (« 1× non-participating »). Au-delà de ce seuil, le solde est réparti entre tous les associés au prorata de leur participation au capital."),

    H2("Article 9 — Engagement du Fondateur"),
    Bullet("Engagement de plein temps : le Fondateur s'engage à consacrer la totalité de son temps professionnel à la Société pendant toute la durée du pacte (sauf activité accessoire mineure préalablement notifiée et acceptée)."),
    Bullet("Non-concurrence : le Fondateur s'interdit d'exercer une activité concurrente de la Société pendant toute la durée du pacte et pendant douze (12) mois après la cessation de ses fonctions."),
    Bullet("Engagement de cession en cas de manquement grave : en cas de faute grave caractérisée du Fondateur entraînant sa révocation, les Investisseurs peuvent racheter ses actions à la valeur déterminée par expertise indépendante."),
    Bullet("Maintien de la garantie financière APST et de la RC Pro : engagement personnel du Fondateur de veiller au maintien permanent des garanties réglementaires."),

    H2("Article 10 — Confidentialité"),
    P("Les Parties s'engagent à respecter la stricte confidentialité du présent pacte, des informations commerciales, financières et techniques échangées dans le cadre de la levée et du suivi de l'investissement. Cette obligation perdure cinq (5) ans après la cessation de la qualité d'associé."),

    H2("Article 11 — Durée et résiliation"),
    P("Le présent pacte est conclu pour la durée d'existence de la Société et tant qu'au moins un Investisseur Seed reste associé de la Société. Il prend fin de plein droit à l'égard d'un Investisseur dès qu'il cesse d'être associé. Le pacte peut être renouvelé ou modifié par avenant unanime des Parties."),

    H2("Article 12 — Loi applicable et juridiction"),
    P("Le présent pacte est soumis au droit français. Tout litige sera soumis, à défaut d'accord amiable préalable, aux tribunaux compétents conformément au Code de procédure civile. Les Parties privilégieront la médiation préalable."),

    Spacer(180),
    P("Fait à [Ville], le [Date], en autant d'originaux que de Parties signataires.", { italics: true, after: 200 }),
    blocSignature("Le Fondateur", "Les Investisseurs Seed"),

    Spacer(160),
    P("Modèle TYPE — à finaliser et adapter avec un avocat spécialisé en droit des sociétés et capital-risque avant signature. Les clauses précises (taux d'intérêt sur BSA-AIR, ratchet, etc.) sont à compléter au moment de la levée effective.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — ONBOARDING PARTENAIRES (CRÉATEUR · VENDEUR · HRA)
// ============================================================
function onboardingPartenaires() {
  return [
    bandeauTitre(
      "ONBOARDING PARTENAIRES EVENTY",
      "Guide pratique d'accueil — Créateur · Vendeur · HRA",
    ),
    Spacer(160),

    P("Bienvenue dans l'écosystème Eventy Life. Ce guide pratique a été conçu pour accompagner pas à pas chaque nouveau partenaire — créateur de voyages, vendeur indépendant ou partenaire HRA — depuis le premier contact jusqu'à la première mission opérationnelle. Il complète les contrats-cadres et la charte qualité.", { italics: true }),

    // ============================================================
    // PARTIE A — Onboarding Créateur de voyages
    // ============================================================
    H1("Partie A — Onboarding Créateur de voyages"),
    P("Le Créateur de voyages Eventy conçoit et programme des voyages à forfait pour le compte d'EVENTY LIFE SAS. Il est rémunéré à hauteur de la marge HRA + 3 points sur HRA refacturé, cumulable avec la commission Vendeur de 5 % HT s'il vend lui-même son voyage."),

    H2("A.1. Les 6 étapes de l'onboarding Créateur"),
    Numbered("Premier contact — discussion d'orientation, vérification de la motivation et de la compatibilité avec la charte qualité Eventy."),
    Numbered("Constitution du dossier personnel — Kbis ou attestation INSEE, attestation URSSAF à jour, RIB du compte professionnel, justificatif d'identité, le cas échéant attestation de formation aux premiers secours et casier judiciaire B3."),
    Numbered("Signature du Contrat Créateur Eventy (voir Eventy-Life-Contrat-Createur.pdf) et de la Charte Qualité Eventy en annexe."),
    Numbered("Formation initiale — découverte de la plateforme technique, du manuel d'incident, des programmes-types et des standards Eventy. Durée moyenne : 1 journée."),
    Numbered("Conception du premier voyage — accompagnement par le Responsable opérations Eventy, validation du programme, sélection des partenaires HRA."),
    Numbered("Lancement commercial — mise en ligne du voyage, première communication, premiers placements via le réseau Vendeurs."),

    H2("A.2. Documents à fournir par le Créateur"),
    Bullet("Kbis ou attestation INSEE de moins de 3 mois."),
    Bullet("Attestation URSSAF à jour."),
    Bullet("RIB du compte bancaire professionnel."),
    Bullet("Justificatif d'identité (CNI ou passeport)."),
    Bullet("CV / parcours professionnel (utile pour la charte qualité et la mention de paternité sur les fiches voyage)."),
    Bullet("Le cas échéant, attestation PSC1 (premiers secours) si désigné accompagnateur."),
    Bullet("Le cas échéant, casier judiciaire B3 vierge si désigné accompagnateur."),

    H2("A.3. Outils mis à disposition par Eventy"),
    Bullet("Espace pro sur eventylife.fr (catalogue, conception de voyage, suivi de placements et de commissions)."),
    Bullet("Manuel d'incident voyage (le cas échéant si désigné accompagnateur)."),
    Bullet("Charte qualité Eventy (annexée au contrat)."),
    Bullet("Documentation commerciale (programmes-types, fiches voyage modèle, photos partenaires)."),
    Bullet("Accès à la base partenaires HRA pour la conception."),
    Bullet("Support dédié — Responsable opérations Eventy joignable en heures ouvrées."),

    H2("A.4. Rémunération Créateur — rappel"),
    P("Le Créateur perçoit, pour chaque voyage qu'il a conçu et qui est livré aux voyageurs :"),
    Bullet("Commission Créateur : 3 % sur le total HRA refacturé au voyageur dans le voyage concerné."),
    Bullet("Commission Vendeur (si placement direct) : 5 % HT du chiffre d'affaires voyage placé (cumulable)."),
    Bullet("Forfait d'accompagnement (si désigné) : 600 € à 800 € par voyage de 4-5 jours."),
    P("Les commissions sont versées sous 21 jours à compter de la livraison du voyage et de l'émission de la facture du Créateur."),

    // ============================================================
    // PARTIE B — Onboarding Vendeur indépendant
    // ============================================================
    H1("Partie B — Onboarding Vendeur indépendant"),
    P("Le Vendeur Eventy place des inscriptions à des voyages auprès de voyageurs identifiés. Il est rémunéré 5 % HT du chiffre d'affaires voyage placé. Toute personne peut devenir Vendeur — créateur, ambassadeur, influenceur, partenaire HRA partageant à sa clientèle, indépendant local — sous réserve de signer le Contrat Vendeur."),

    H2("B.1. Les 4 étapes de l'onboarding Vendeur"),
    Numbered("Premier contact — discussion d'orientation, présentation de l'offre Eventy et du modèle de rémunération 5 % HT."),
    Numbered("Constitution du dossier personnel — Kbis ou attestation INSEE, attestation URSSAF à jour, RIB du compte professionnel, justificatif d'identité."),
    Numbered("Signature du Contrat Vendeur Eventy (voir Eventy-Life-Contrat-Vendeur.pdf)."),
    Numbered("Activation du compte Vendeur sur eventylife.fr — accès au catalogue, génération de liens de placement personnalisés, suivi des inscriptions et des commissions."),

    H2("B.2. Documents à fournir par le Vendeur"),
    Bullet("Kbis ou attestation INSEE de moins de 3 mois."),
    Bullet("Attestation URSSAF à jour."),
    Bullet("RIB du compte bancaire professionnel."),
    Bullet("Justificatif d'identité (CNI ou passeport)."),

    H2("B.3. Outils mis à disposition par Eventy"),
    Bullet("Espace pro sur eventylife.fr (catalogue, génération de liens personnalisés, suivi des placements et des commissions)."),
    Bullet("Documentation commerciale (descriptifs de voyages, photos, vidéos, posts sociaux modèles)."),
    Bullet("Tracking automatique des placements via cookie d'attribution."),
    Bullet("Support commercial dédié — Responsable marketing Eventy joignable en heures ouvrées."),
    Bullet("Mention de la qualité de Vendeur Eventy autorisée dans la communication, sous réserve du respect strict des standards (pas de qualité d'opérateur, pas de promesses non autorisées)."),

    H2("B.4. Rémunération Vendeur — rappel"),
    P("Le Vendeur perçoit, pour chaque inscription effectivement placée et menée à bonne fin :"),
    Bullet("Commission Vendeur : 5 % HT du chiffre d'affaires voyage placé."),
    P("Le paiement est effectué par virement bancaire dans un délai de 21 jours à compter de la livraison du voyage et de l'émission de la facture du Vendeur. En cas d'annulation du voyage par EVENTY (seuil minimum non atteint), aucune commission n'est due."),

    H2("B.5. Bonnes pratiques commerciales attendues"),
    Bullet("Communication transparente et honnête — pas de promesses qui ne pourront être tenues."),
    Bullet("Mention obligatoire d'EVENTY comme opérateur officiel et du numéro IM Atout France."),
    Bullet("Respect strict de la confidentialité des données personnelles des voyageurs."),
    Bullet("Pas de prospection auprès de mineurs ou de personnes vulnérables sans accompagnement adulte."),
    Bullet("Pas de pression à la vente ni de techniques manipulatoires."),
    Bullet("Signalement immédiat à EVENTY de tout comportement suspect ou problématique."),

    // ============================================================
    // PARTIE C — Onboarding Partenaire HRA
    // ============================================================
    H1("Partie C — Onboarding Partenaire HRA (Hôtel · Restaurant · Activité)"),
    P("Le Partenaire HRA fournit, dans le cadre des voyages organisés par EVENTY, les prestations correspondant à son cœur de métier : hébergement, restauration, activité touristique. Il est rémunéré au prix négocié figurant sur le bon de commande Eventy et peut, s'il le souhaite, cumuler la qualité de Vendeur (5 % HT)."),

    H2("C.1. Les 5 étapes de l'onboarding HRA"),
    Numbered("Premier contact — visite ou échange à distance, présentation d'Eventy et du modèle économique."),
    Numbered("Constitution du dossier établissement — Kbis ou équivalent local, attestation URSSAF, attestation RC Pro, attestation HACCP (restauration) ou classement officiel (hôtellerie), capacité d'accueil minimum 38 voyageurs."),
    Numbered("Audit qualité initial — visite du Responsable opérations Eventy ou d'un partenaire mandaté, vérification des standards d'accueil, hygiène, sécurité, accessibilité."),
    Numbered("Signature du Contrat HRA Partenaire Eventy (voir Eventy-Life-Contrat-HRA-Partenaire.pdf) — référencement officiel dans le catalogue Eventy."),
    Numbered("Premier bon de commande — première mission opérationnelle, suivie d'un retour de satisfaction par les voyageurs et l'accompagnateur."),

    H2("C.2. Documents à fournir par le HRA"),
    Bullet("Kbis ou équivalent local de moins de 3 mois."),
    Bullet("Attestation URSSAF (ou équivalent local) à jour."),
    Bullet("Attestation d'assurance Responsabilité Civile Professionnelle."),
    Bullet("Pour la restauration : attestation HACCP ou équivalent local + fiche allergènes type."),
    Bullet("Pour l'hôtellerie : classement officiel (étoiles, Atout France ou équivalent) + photos des chambres et espaces communs."),
    Bullet("Pour les activités : agrément spécifique selon la nature (guide, sportif, etc.)."),
    Bullet("RIB du compte bancaire professionnel."),

    H2("C.3. Audit qualité initial — points vérifiés"),
    Bullet("Conformité aux normes d'hygiène et sécurité applicables localement."),
    Bullet("Capacité d'accueil simultanée minimum 38 voyageurs (avec souplesse possible pour prestations partielles)."),
    Bullet("Accessibilité PMR signalée le cas échéant."),
    Bullet("Documentation des allergènes pour la restauration."),
    Bullet("Capacité opérationnelle à tenir le rythme d'un voyage de groupe (timing repas, gestion arrivées/départs simultanés)."),
    Bullet("Photos professionnelles des espaces."),
    Bullet("Évaluation de la qualité globale de l'accueil et du service."),

    H2("C.4. Mécanique de marge — rappel"),
    P("Le HRA facture EVENTY au prix négocié (« HRA acheté »). EVENTY refacture au voyageur dans le prix total du voyage à un montant légèrement supérieur (« HRA refacturé »), le différentiel constituant la marge socle d'EVENTY (≈ 8 % sur HRA refacturé). Cette mécanique respecte intégralement le régime de TVA marge tourisme (BOI-TVA-SECT-60). Le HRA n'a aucun droit ni regard sur le prix de refacturation au voyageur."),

    H2("C.5. Modalités de paiement"),
    Bullet("EVENTY règle les prestations à 30 jours fin de mois date de fin de séjour, par virement bancaire."),
    Bullet("Aucun acompte n'est versé au HRA avant exécution effective de la prestation, sauf accord spécifique écrit."),
    Bullet("Cette discipline garantit que les fonds clients en transit demeurent sous contrôle d'EVENTY et donc de la garantie financière APST."),

    H2("C.6. Possibilité « Vendeur » offerte au HRA"),
    P("Le Partenaire HRA peut, s'il le souhaite, devenir simultanément Vendeur Eventy en partageant les voyages d'EVENTY à sa propre clientèle. Il bénéficie alors de la commission « Vendeur » de 5 % HT du CA voyage placé. Ce cumul fait l'objet d'un avenant spécifique au contrat-cadre HRA."),

    // ============================================================
    // PARTIE D — Engagements communs et synthèse
    // ============================================================
    H1("Partie D — Engagements communs et points de contact"),

    H2("D.1. Engagements communs à tous les partenaires"),
    Bullet("Maintien à jour de l'immatriculation et des obligations sociales / fiscales."),
    Bullet("Respect strict de la charte qualité Eventy applicable au rôle exercé."),
    Bullet("Respect intégral de la confidentialité des données personnelles des voyageurs (RGPD)."),
    Bullet("Mention obligatoire d'EVENTY comme opérateur officiel et du numéro IM Atout France."),
    Bullet("Refus catégorique de toute qualité d'opérateur de voyages ou d'intermédiaire au sens du Code du Tourisme — EVENTY conserve seul cette qualité."),
    Bullet("Coopération active en cas de contrôle ou d'audit (interne ou externe)."),

    H2("D.2. Points de contact Eventy"),
    makeTable({
      widths: [3500, 5860],
      header: ["Sujet", "Contact"],
      rows: [
        ["Question opérationnelle (programme, partenaires, voyage en cours)", "Responsable opérations — operations@eventylife.fr"],
        ["Question commerciale (placement, commissions, communication)", "Responsable marketing — marketing@eventylife.fr"],
        ["Question financière (paiement, facture, RIB)", "DAF / finance — finance@eventylife.fr"],
        ["Réclamation voyageur ou incident voyage", "Cellule réclamations — reclamation@eventylife.fr"],
        ["Question juridique ou contractuelle", "Présidence — eventylife@gmail.com"],
        ["Urgence pendant un voyage en cours", "Ligne d'urgence 24/7 (numéro communiqué dans la pochette voyage)"],
        ["Données personnelles / RGPD", "DPO — dpo@eventylife.fr"],
      ],
    }),

    H2("D.3. Documents de référence"),
    Bullet("Contrat Vendeur Eventy (Eventy-Life-Contrat-Vendeur.pdf)"),
    Bullet("Contrat Créateur Eventy (Eventy-Life-Contrat-Createur.pdf)"),
    Bullet("Contrat HRA Partenaire (Eventy-Life-Contrat-HRA-Partenaire.pdf)"),
    Bullet("Charte qualité accompagnateur (annexe au dossier APST)"),
    Bullet("Bon de commande HRA modèle (Eventy-Life-Bon-De-Commande-HRA.pdf)"),
    Bullet("CGV applicables aux voyageurs (Eventy-Life-CGV.pdf)"),
    Bullet("Politique de Confidentialité RGPD (Eventy-Life-Politique-Confidentialite-RGPD.pdf)"),
    Bullet("Manuel d'incident voyage (Eventy-Life-Manuel-Incident-Voyage.pdf — pour les accompagnateurs)"),

    H2("D.4. Bienvenue dans l'écosystème"),
    P("EVENTY LIFE SAS porte une vision profondément humaine du voyage de groupe. Notre conviction : faire tourner la valeur entre tous les acteurs de la chaîne, plutôt que l'extraire. Sur 100 € payés par un voyageur, près de 89 € retournent à l'économie réelle (vous, vos confrères HRA, les autocaristes, les partenaires locaux). C'est cela, l'écosystème Eventy. Bienvenue."),

    Spacer(160),
    P("Document opérationnel — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray }),
  ];
}

// ============================================================
// Document commun
// ============================================================
function makeDoc({ title, description, footerLeft, children }) {
  return new Document({
    creator: "David Eventy — Eventy Life SAS",
    title,
    description,
    styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
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
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                children: [
                  new TextRun({ text: footerLeft, size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

async function generate() {
  const outputs = [
    {
      file: "docs/garanties/Eventy-Life-Statuts-SAS.docx",
      title: "Eventy Life — Statuts SAS",
      description: "Statuts complets de la SAS Eventy Life, version standalone.",
      footer: "EVENTY LIFE SAS — Statuts",
      children: statutsSAS(),
    },
    {
      file: "docs/garanties/Eventy-Life-Pacte-Associes-Seed.docx",
      title: "Eventy Life — Pacte d'associés type Seed",
      description: "Modèle de pacte d'associés pour la levée Seed Eventy Life.",
      footer: "EVENTY LIFE SAS — Pacte d'associés Seed",
      children: pacteAssocies(),
    },
    {
      file: "docs/garanties/Eventy-Life-Onboarding-Partenaires.docx",
      title: "Eventy Life — Onboarding Partenaires",
      description: "Guide pratique d'accueil pour Créateur, Vendeur et HRA partenaire.",
      footer: "EVENTY LIFE SAS — Onboarding Partenaires",
      children: onboardingPartenaires(),
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
