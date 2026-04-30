/**
 * Eventy Life — Manuel d'incident voyage (cellule de crise)
 *
 * Document opérationnel pour les accompagnateurs et l'équipe terrain.
 * Procédures détaillées par niveau de gravité, ligne 24/7, plan de continuité.
 *
 * Usage : node scripts/garanties/build-manuel-incident.js [output.docx]
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
  red: "C0392B",
  redLt: "FADBD8",
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

function H1(text) {
  return new Paragraph({
    spacing: { before: 480, after: 200 },
    pageBreakBefore: true,
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H1First(text) {
  return new Paragraph({
    spacing: { before: 240, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
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
function Quote(text) {
  return new Paragraph({
    spacing: { before: 160, after: 160, line: 300 },
    indent: { left: 720, right: 720 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange, space: 12 } },
    children: [new TextRun({ text, size: 22, italics: true, font: "Calibri", color: COLOR.blue })],
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
function makeTable({ widths, header, rows, headerColor = COLOR.blue }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map((h, i) =>
      tCell(h, { width: widths[i], shade: headerColor, color: "FFFFFF", bold: true, size: 19 }),
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
      children: [new TextRun({ text: "MANUEL D'INCIDENT VOYAGE", size: 44, bold: true, color: COLOR.red, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: "Procédures opérationnelles · Cellule de crise · Ligne d'urgence 24/7", size: 22, color: COLOR.gray, font: "Calibri" })],
    }),
    Spacer(400),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 },
      children: [new TextRun({ text: "Document opérationnel — usage interne", size: 22, bold: true, font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "EVENTY LIFE SAS · Version 1.0 · 30 avril 2026", size: 18, italics: true, color: COLOR.gray, font: "Calibri" })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

const docContent = [
  ...coverPage(),

  // ============================================================
  // PARTIE 1 — Vue d'ensemble
  // ============================================================
  H1First("1. Vue d'ensemble — pourquoi ce manuel"),
  Quote("Un incident bien géré devient une histoire que les voyageurs racontent avec gratitude. Un incident mal géré devient un litige. La différence tient au manuel, à la formation et au sang-froid de l'équipe."),

  H2("1.1. Périmètre du manuel"),
  P("Le présent manuel décrit, niveau de gravité par niveau de gravité, les procédures opérationnelles à appliquer en cas d'incident voyage chez Eventy Life. Il couvre :"),
  Bullet("Les incidents mineurs (plaintes, retards courts, malentendus) — niveau 1."),
  Bullet("Les incidents significatifs (panne autocar, défaillance restaurant, sur-réservation partielle) — niveau 2."),
  Bullet("Les incidents graves (sur-réservation totale, perte de bagages massive, malaise voyageur) — niveau 3."),
  Bullet("Les incidents critiques (accident corporel grave, événement géopolitique, catastrophe naturelle, panne avion) — niveau 4."),
  P("Il est destiné aux accompagnateurs Eventy, à l'équipe support, au responsable opérations et au président. Il est mis à jour annuellement par le comité de pilotage opérationnel."),

  H2("1.2. Principes directeurs"),
  Numbered("Sécurité du voyageur avant tout — aucune décision opérationnelle ne doit jamais compromettre la sécurité physique d'un voyageur."),
  Numbered("Communication transparente et continue — le voyageur n'est jamais laissé sans information."),
  Numbered("Décision rapide, escalade documentée — chaque niveau a sa hiérarchie d'intervention."),
  Numbered("Tracabilité totale — chaque incident est journalisé en temps réel via la plateforme Eventy."),
  Numbered("Apprentissage post-incident — chaque incident donne lieu à un débriefing et une mise à jour des procédures."),
  Numbered("Coopération avec les autorités locales — police, secours, autorités diplomatiques le cas échéant."),

  // ============================================================
  // PARTIE 2 — Ligne d'urgence 24/7
  // ============================================================
  H1("2. La ligne d'urgence 24/7"),
  Quote("La ligne 24/7 est le cœur du dispositif. Elle est joignable par tout voyageur, à tout moment, dans toutes les langues principales utiles à la destination."),

  H2("2.1. Caractéristiques de la ligne"),
  makeTable({
    widths: [3500, 5860],
    header: ["Caractéristique", "Détail"],
    rows: [
      ["Numéro principal", "[À renseigner — numéro français +33]"],
      ["Disponibilité", "24 heures sur 24, 7 jours sur 7, week-ends et jours fériés inclus"],
      ["Période d'activation", "Pendant la durée du voyage et 48 heures après le retour"],
      ["Langues principales", "Français + anglais en permanence"],
      ["Langues additionnelles selon destination", "Espagnol, portugais, italien, arabe (selon couverture saison)"],
      ["Type d'opérateur (heures de bureau)", "Équipe Eventy interne — Responsable opérations + support"],
      ["Type d'opérateur (hors heures bureau / nuit / WE)", "Plateforme assistance 24/7 de l'assureur Pack Sérénité"],
      ["Communication aux voyageurs", "Numéro unique sur le contrat, l'espace voyageur, la pochette voyage"],
    ],
  }),

  H2("2.2. Compétences attendues de l'opérateur 24/7"),
  Bullet("Maîtrise du français parfait + anglais courant."),
  Bullet("Connaissance approfondie des programmes Eventy en cours."),
  Bullet("Accès au manuel d'incident (le présent document)."),
  Bullet("Capacité de mobiliser le Responsable opérations sous 15 minutes."),
  Bullet("Capacité de mobiliser le Président sous 30 minutes pour gravité ≥ 3."),
  Bullet("Sang-froid et empathie — le voyageur en difficulté a besoin d'être entendu avant tout."),

  H2("2.3. Premier contact — script de référence"),
  P("Tout appel reçu sur la ligne 24/7 commence par les éléments suivants :", { italics: true }),
  Bullet("« Eventy Life, [Prénom de l'opérateur] à votre écoute. Comment puis-je vous aider ? »"),
  Bullet("Identification voyageur : nom, numéro de réservation, voyage en cours."),
  Bullet("Localisation actuelle : ville, pays, point précis si possible."),
  Bullet("Nature du problème : laisser le voyageur s'exprimer sans l'interrompre."),
  Bullet("Reformulation et qualification de la gravité (1 à 4)."),
  Bullet("Action immédiate annoncée : « Je vous propose [action]. Je vous rappelle dans [délai] si nécessaire. »"),
  Bullet("Promesse de suivi : « Je consigne votre appel et nous restons en contact. »"),

  // ============================================================
  // PARTIE 3 — Niveaux de gravité et procédures
  // ============================================================
  H1("3. Les 4 niveaux de gravité — tableau de référence"),

  H2("3.1. Synthèse"),
  makeTable({
    widths: [800, 2400, 2400, 1500, 2260],
    header: ["Niv.", "Type d'incident type", "Délai de réaction cible", "Mobilisation", "Décideur final"],
    rows: [
      ["1", "Plainte, malentendu, retard < 1 h", "≤ 30 min", "Opérateur 24/7 seul", "Opérateur 24/7"],
      ["2", "Panne autocar < 4 h, restaurant défaillant, hôtel sur-réservé partiellement", "≤ 1 h", "Opérateur 24/7 + Resp. ops", "Resp. opérations"],
      ["3", "Hôtel sur-réservé en intégralité, perte bagages massive, malaise voyageur", "≤ 30 min", "Cellule de crise activée", "Président + Resp. ops"],
      ["4", "Accident grave, événement géopolitique, catastrophe naturelle", "Immédiat", "Cellule complète + autorités", "Président"],
    ],
  }),

  H2("3.2. Niveau 1 — Mineur"),
  H3("Exemples typiques"),
  Bullet("Plainte sur la qualité d'un repas (« Le déjeuner d'hier n'était pas à la hauteur »)."),
  Bullet("Retard d'autocar inférieur à 1 heure."),
  Bullet("Malentendu sur le programme du jour."),
  Bullet("Demande de renseignement non urgente."),
  H3("Procédure"),
  Numbered("Écouter le voyageur sans l'interrompre."),
  Numbered("Reformuler pour valider la compréhension."),
  Numbered("Apporter une réponse immédiate ou un geste commercial proportionné (réduction de prix, voucher, attention) selon barème opérateur."),
  Numbered("Consigner l'incident dans le journal Eventy avec qualification N1."),
  Numbered("Suivre la satisfaction post-résolution sous 24 heures."),
  H3("Décision typique"),
  P("Geste commercial direct sans escalade : remise de 5 à 10 % du prix de la prestation concernée, ou voucher voyage suivant. Validation immédiate possible jusqu'à 100 € par voyageur sans autorisation."),

  H2("3.3. Niveau 2 — Significatif"),
  H3("Exemples typiques"),
  Bullet("Panne d'autocar nécessitant un car de remplacement (durée 1 à 4 heures)."),
  Bullet("Restaurant défaillant à l'arrivée (mauvaise prestation, service inacceptable)."),
  Bullet("Hôtel sur-réservé partiellement (quelques chambres manquantes)."),
  Bullet("Voyageur en difficulté médicale légère (mal de voyage, problème mineur)."),
  H3("Procédure"),
  Numbered("Activation du plan B local par l'accompagnateur (autocar de remplacement, restaurant alternatif, redistribution chambres)."),
  Numbered("Communication immédiate au groupe par l'accompagnateur — explication transparente, geste commercial annoncé."),
  Numbered("Notification au Responsable opérations Eventy sous 1 heure."),
  Numbered("Si médical : mise en relation avec la plateforme médicale de l'assureur Pack Sérénité."),
  Numbered("Documentation détaillée de l'incident dans le journal Eventy."),
  Numbered("Si fournisseur défaillant : courrier formel au fournisseur + retenue éventuelle sur paiement (article 3 du contrat HRA)."),
  H3("Décision typique"),
  P("Geste commercial proportionné — remboursement de la prestation défaillante + supplément qualité de service (jusqu'à 200 € par voyageur). Décision Responsable opérations."),

  H2("3.4. Niveau 3 — Grave"),
  H3("Exemples typiques"),
  Bullet("Hôtel intégralement sur-réservé à l'arrivée du groupe."),
  Bullet("Accident corporel d'un voyageur nécessitant une prise en charge médicale."),
  Bullet("Vol ou perte massive de bagages."),
  Bullet("Annulation imprévue d'une activité phare du programme."),
  Bullet("Désaccord majeur entre voyageurs nécessitant un arbitrage."),
  H3("Procédure (cellule de crise activée)"),
  Numbered("Activation immédiate de la cellule de crise (sous 30 minutes)."),
  Numbered("Activation du plan B avec partenaires de back-up — hébergement de secours, transport, prestations alternatives."),
  Numbered("Si médical : déclenchement immédiat du Pack Sérénité (assureur tiers — médecin régulateur, transport sanitaire, accompagnement médical si nécessaire)."),
  Numbered("Communication transparente au groupe par l'accompagnateur — information continue sur la situation et les solutions mises en œuvre."),
  Numbered("Information des proches du voyageur concerné (avec son consentement) — coordonnées d'urgence renseignées au moment de la réservation."),
  Numbered("Documentation horodatée de chaque action dans le journal de crise."),
  Numbered("Geste commercial proportionné au préjudice — peut atteindre 50 % du prix du voyage selon gravité."),
  Numbered("Débriefing post-incident sous 48 heures par la cellule de crise."),
  H3("Décision typique"),
  P("Décision concertée Président + Responsable opérations. Mobilisation de la trésorerie d'urgence ou du fonds de réserve volontaire (5 % du CA) si nécessaire."),

  H2("3.5. Niveau 4 — Critique"),
  H3("Exemples typiques"),
  Bullet("Accident corporel grave d'un ou plusieurs voyageurs (traumatologie, urgence vitale)."),
  Bullet("Événement géopolitique rendant la zone dangereuse (coup d'État, attentat, manifestation violente)."),
  Bullet("Catastrophe naturelle sur la zone (séisme, inondation, incendie)."),
  Bullet("Pandémie ou crise sanitaire bloquant les voyageurs ou nécessitant un rapatriement."),
  Bullet("Panne aérienne grave (avion immobilisé, vol annulé sans alternative)."),
  Bullet("Décès d'un voyageur — situation à part, traitement spécial."),
  H3("Procédure (cellule de crise complète)"),
  Numbered("Activation immédiate (sous 1 heure max) de la cellule de crise complète."),
  Numbered("Information immédiate du Président d'Eventy."),
  Numbered("Contact des autorités locales : police, services de secours, ambassade ou consulat français le cas échéant."),
  Numbered("Mobilisation immédiate du Pack Sérénité (assureur) pour l'organisation logistique (rapatriement, hébergement de transit, prise en charge médicale)."),
  Numbered("Information des proches des voyageurs concernés — avec respect strict du consentement et de la dignité (pour décès : procédure spécifique avec accompagnement humain)."),
  Numbered("Communication groupe + communication externe (médias, réseaux sociaux) — coordonnée par le responsable communication d'Eventy avec validation Président."),
  Numbered("Si insolvabilité Eventy menacée par l'incident : information immédiate de l'APST sous 24 heures."),
  Numbered("Documentation détaillée de l'incident — registre obligatoire, rapport DGCCRF si requis."),
  Numbered("Débriefing post-incident sous 7 jours, avec mise à jour du manuel et formation renforcée si nécessaire."),
  H3("Décision typique"),
  P("Décision exclusive du Président. Mobilisation possible de l'ensemble des dispositifs financiers : trésorerie, fonds de réserve, garantie APST, RC Pro, Pack Sérénité externe. La sécurité physique du voyageur prime sur toute considération financière."),

  // ============================================================
  // PARTIE 4 — Composition de la cellule de crise
  // ============================================================
  H1("4. Composition de la cellule de crise"),
  P("La cellule de crise est activée à partir du niveau 3 de gravité. Sa composition varie selon la nature de l'incident."),

  H2("4.1. Membres permanents"),
  makeTable({
    widths: [3000, 3500, 2860],
    header: ["Rôle", "Mission", "Délai d'activation"],
    rows: [
      ["Pilote", "Président d'Eventy ou Responsable opérations en délégation", "Sous 30 min (niv. 3) ou immédiat (niv. 4)"],
      ["Coordination terrain", "Responsable de l'accompagnement du voyage concerné", "Immédiat — déjà sur place"],
      ["Communication", "Responsable marketing & communication ou délégué", "Sous 1 heure (niv. 3) ou 30 min (niv. 4)"],
      ["Conformité", "Avocat tourisme partenaire", "Sous 4 heures pour avis express"],
      ["Garant financier", "Représentant APST informé en parallèle", "Information sous 24 h pour niv. 4"],
      ["Assureur Pack Sérénité", "Plateforme d'assistance 24/7 de l'assureur", "Mobilisation immédiate"],
    ],
  }),

  H2("4.2. Délais d'activation"),
  Bullet("Sous 1 heure : information du Président, première évaluation de la situation."),
  Bullet("Sous 4 heures : cellule constituée, premières mesures opérationnelles décidées."),
  Bullet("Sous 24 heures : communication consolidée aux voyageurs et aux familles."),
  Bullet("Sous 72 heures : retour à la normale ou plan B opérationnel mis en œuvre."),

  H2("4.3. Outils mobilisés"),
  Bullet("Salle de crise virtuelle (visio, partage d'écran, documents partagés)."),
  Bullet("Journal de crise horodaté — enregistrement de toutes les décisions et actions."),
  Bullet("Liste à jour des contacts d'urgence (autorités locales, ambassades, plateformes assurance)."),
  Bullet("Base de partenaires de back-up activable en moins de 6 heures."),
  Bullet("Procédures pré-rédigées de communication aux voyageurs et aux familles."),
  Bullet("Modèles de communiqués externes (médias, réseaux sociaux)."),

  // ============================================================
  // PARTIE 5 — Procédures spécifiques
  // ============================================================
  H1("5. Procédures spécifiques par scénario"),

  H2("5.1. Rapatriement médical individuel"),
  Numbered("Le voyageur ou l'accompagnateur signale l'événement médical à la ligne 24/7."),
  Numbered("L'opérateur 24/7 met en relation le voyageur avec la plateforme médicale de l'assureur Pack Sérénité (médecin régulateur)."),
  Numbered("Le médecin régulateur évalue la situation à distance et décide du protocole : soins sur place / rapatriement médicalisé / rapatriement simple."),
  Numbered("L'assureur organise les prestations : avance des frais médicaux locaux, transport sanitaire, accompagnement médical."),
  Numbered("L'accompagnateur sur place coordonne avec l'assureur — gestion des bagages, hébergement éventuel, communication aux proches."),
  Numbered("Eventy informe la famille (avec consentement)."),
  Numbered("Suivi post-rapatriement — état du voyageur, démarches administratives (certificats, attestations)."),

  H2("5.2. Hébergement de secours collectif"),
  Numbered("L'accompagnateur ou le voyageur signale la défaillance hôtelière."),
  Numbered("L'opérateur 24/7 active la base de partenaires de back-up — hôtel de secours en catégorie équivalente ou supérieure dans la même ville."),
  Numbered("Réservation immédiate des chambres — paiement par la trésorerie d'urgence ou via le compte de paiement Eventy."),
  Numbered("Transport des voyageurs vers le nouvel hôtel — autocar, taxis groupés ou navette."),
  Numbered("Information du groupe — explication transparente, geste commercial proposé."),
  Numbered("Documentation de l'incident — courrier formel à l'hôtel défaillant, mise à jour de la fiche partenaire."),
  Numbered("Compensation voyageurs — réduction de prix proportionnée selon impact."),

  H2("5.3. Retard de transport (autocar, vol)"),
  Numbered("Notification Eventy par le transporteur ou par l'accompagnateur."),
  Numbered("Communication immédiate au groupe (SMS, voix de l'accompagnateur)."),
  Numbered("Si retard > 4 h : organisation d'une collation ou d'un repas selon le moment."),
  Numbered("Si retard > 8 h : possible hébergement de transit ou activité d'attente organisée."),
  Numbered("Si retard rend le voyage impraticable : activation du plan B (annulation, report, remboursement partiel)."),
  Numbered("Documentation de l'incident pour suivi qualité et indemnisation par le transporteur."),

  H2("5.4. Crise géopolitique sur la zone"),
  Numbered("Veille permanente du Conseil aux voyageurs France Diplomatie pour toutes les destinations Eventy."),
  Numbered("Si dégradation de la situation pendant un voyage : activation immédiate de la cellule de crise."),
  Numbered("Évaluation du risque par la cellule + contact ambassade ou consulat de France."),
  Numbered("Décision : poursuite du voyage avec adaptations / repli vers zone sûre / rapatriement anticipé."),
  Numbered("Coordination avec le Pack Sérénité pour le rapatriement collectif si décidé."),
  Numbered("Communication continue au groupe et aux familles."),
  Numbered("Si insolvabilité Eventy menacée par les coûts du rapatriement : mobilisation de la garantie APST."),

  H2("5.5. Décès d'un voyageur (procédure spéciale)"),
  P("La procédure en cas de décès d'un voyageur fait l'objet d'un protocole humain et juridique distinct, supervisé directement par le Président d'Eventy. Elle inclut :"),
  Bullet("Information immédiate des autorités locales (police, médecin légiste)."),
  Bullet("Information de l'ambassade ou du consulat de France."),
  Bullet("Information des proches désignés au contrat avec accompagnement humain (jamais par téléphone seul, idéalement en présence d'un proche déjà informé)."),
  Bullet("Coordination avec l'assureur Pack Sérénité pour le rapatriement de la dépouille."),
  Bullet("Soutien aux autres voyageurs du groupe, qui peuvent être eux-mêmes en état de choc."),
  Bullet("Reportage à l'APST sous 48 h conformément aux engagements."),
  Bullet("Procédure de communication externe avec le plus grand respect — pas de communication médias sans accord exprès des proches."),

  // ============================================================
  // PARTIE 6 — Trousse opérationnelle
  // ============================================================
  H1("6. Trousse de secours opérationnelle"),
  Quote("L'accompagnateur Eventy est équipé pour faire face — pas pour improviser."),

  H2("6.1. Équipement matériel"),
  Bullet("Téléphone professionnel avec ligne européenne illimitée + numéros internationaux selon destination."),
  Bullet("Carte bancaire d'entreprise avec plafond d'urgence (5 000 € sous délégation simple, plus avec validation Président)."),
  Bullet("Trousse de premiers secours physique (pansements, désinfectant, paracétamol, attelles d'immobilisation, etc.)."),
  Bullet("Liste papier et numérique des partenaires HRA de la destination + back-up."),
  Bullet("Liste papier et numérique des contacts d'urgence : ligne 24/7 Eventy, assureur Pack Sérénité, ambassades / consulats français à destination."),
  Bullet("Manuel d'incident Eventy (le présent document — version imprimée + version numérique)."),

  H2("6.2. Documentation voyageurs"),
  Bullet("Liste exhaustive des voyageurs avec coordonnées d'urgence renseignées."),
  Bullet("Besoins spécifiques signalés (PMR, allergies, conditions médicales)."),
  Bullet("Numéros de réservation Pack Sérénité par voyageur."),
  Bullet("Coordonnées des proches désignés par chaque voyageur (information de crise)."),

  H2("6.3. Pièces administratives"),
  Bullet("Copie de l'attestation APST de garantie financière."),
  Bullet("Copie de l'attestation RC Pro Tourisme."),
  Bullet("Copie du numéro IM Atout France."),
  Bullet("Copie du contrat-cadre du transporteur en cours de mission."),

  // ============================================================
  // PARTIE 7 — Débriefing post-incident
  // ============================================================
  H1("7. Débriefing post-incident"),
  Quote("Un incident sans débriefing est un incident perdu. Chaque incident enseigne quelque chose et améliore le manuel."),

  H2("7.1. Délai et participants"),
  Bullet("Niveau 1 : débriefing du jour même par l'opérateur 24/7."),
  Bullet("Niveau 2 : débriefing sous 48 heures par le Responsable opérations."),
  Bullet("Niveau 3 : débriefing sous 7 jours par la cellule de crise complète."),
  Bullet("Niveau 4 : débriefing sous 7 jours + revue à 30 jours par le Président."),

  H2("7.2. Contenu du débriefing"),
  Numbered("Récit factuel de l'incident — chronologie horodatée."),
  Numbered("Décisions prises — fondement, conséquences, alternatives non retenues."),
  Numbered("Évaluation : ce qui a bien fonctionné / ce qui aurait pu mieux se passer."),
  Numbered("Mesures correctives — mise à jour du manuel, formation supplémentaire, ajustement procédure."),
  Numbered("Communication aux voyageurs concernés — courrier de suivi, retour de satisfaction."),
  Numbered("Reporting — APST le cas échéant, RC Pro si déclenchée, autorités si requis."),

  H2("7.3. Mise à jour annuelle du manuel"),
  P("Le présent manuel est révisé annuellement par le comité de pilotage opérationnel d'Eventy. Toute évolution réglementaire (Code du Tourisme, directive UE, RGPD) ou opérationnelle (nouveaux partenaires, nouveaux scénarios identifiés) est intégrée. Les mises à jour sont diffusées à tous les accompagnateurs via leur espace pro et tracées dans le registre de versions."),

  Spacer(180),
  Encart({
    title: "RAPPEL FONDAMENTAL",
    color: COLOR.red,
    fill: COLOR.redLt,
    lines: [
      { text: "La sécurité physique du voyageur prime toujours.", align: AlignmentType.CENTER, bold: true, size: 24, color: COLOR.red },
      { text: "Aucune décision opérationnelle, aucune contrainte budgétaire, aucune considération de réputation ne peut justifier de mettre en danger un voyageur.", align: AlignmentType.JUSTIFIED, italics: true },
      { text: "En cas de doute, mobilisez immédiatement la cellule de crise et le Président. Le surcoût d'une décision prudente est toujours préférable au risque humain.", align: AlignmentType.JUSTIFIED },
    ],
  }),
  Spacer(160),
  P("Document opérationnel interne — Version 1.0 — 30 avril 2026. Prochaine révision : 30 avril 2027.", { italics: true, color: COLOR.gray }),
  P("Toute modification de ce manuel requiert l'accord du Président d'Eventy Life SAS.", { italics: true, color: COLOR.gray }),
];

const doc = new Document({
  creator: "David Eventy — Eventy Life SAS",
  title: "Eventy Life — Manuel d'incident voyage",
  description: "Procédures opérationnelles détaillées pour la cellule de crise et l'équipe terrain Eventy.",
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
                new TextRun({ text: "EVENTY LIFE SAS — Manuel d'incident voyage · Confidentiel interne", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
              ],
            }),
          ],
        }),
      },
      children: docContent,
    },
  ],
});

const outputPath = process.argv[2] || "Eventy-Life-Manuel-Incident-Voyage.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`✓ Manuel d'incident généré : ${outputPath} (${sizeKB} KB)`);
});
