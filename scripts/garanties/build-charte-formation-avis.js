/**
 * Eventy Life — Trois documents complémentaires
 *
 *   1. Charte qualité accompagnateur Eventy Life (standalone)
 *   2. Plan de formation accompagnateur Eventy Life
 *   3. Politique de gestion des avis voyageurs (e-réputation)
 *
 * Usage : node scripts/garanties/build-charte-formation-avis.js
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
  gray: "555555", grayLt: "EEEEEE", black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function H1(text) {
  return new Paragraph({ spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })] });
}
function H2(text) {
  return new Paragraph({ spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: COLOR.orange, font: "Calibri" })] });
}
function H3(text) {
  return new Paragraph({ spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 20, color: COLOR.blue, font: "Calibri" })] });
}
function P(text, opts = {}) {
  return new Paragraph({ spacing: { after: opts.after || 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: opts.size || 20, font: "Calibri",
      color: opts.color || COLOR.black, bold: opts.bold, italics: opts.italics })] });
}
function Bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })] });
}
function Numbered(text) {
  return new Paragraph({ numbering: { reference: "numbers", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })] });
}
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
// DOCUMENT 1 — CHARTE QUALITÉ ACCOMPAGNATEUR
// ============================================================
function charteAccompagnateur() {
  return [
    bandeauTitre(
      "CHARTE QUALITÉ ACCOMPAGNATEUR EVENTY LIFE",
      "Engagements opposables à tout accompagnateur Eventy Life",
    ),
    Spacer(160),

    P("L'accompagnateur Eventy Life est le visage humain du voyage. Il porte la promesse de la marque sur le terrain, du premier au dernier kilomètre. La présente charte définit les standards qualité opposables à tout accompagnateur — qu'il soit créateur indépendant accompagnant son propre voyage, accompagnateur dédié sur un voyage spécifique, ou collaborateur permanent d'Eventy Life.", { italics: true }),

    P("Cette charte est annexée au contrat de prestation de chaque accompagnateur et signée à la prise de poste. Tout manquement avéré peut entraîner, après mise en demeure, le déréférencement définitif de l'accompagnateur.", { italics: true }),

    H1("Article 1 — Éthique professionnelle"),

    H2("1.1. Probité absolue"),
    Bullet("Aucun avantage personnel sollicité ou accepté auprès des partenaires terrain (HRA, transporteurs, guides locaux) en échange d'une orientation des voyageurs."),
    Bullet("Aucune commission occulte sur des achats voyageurs (boutiques, restaurants supplémentaires, etc.) — sauf accord écrit préalable d'Eventy Life."),
    Bullet("Aucune transaction financière directe avec un voyageur en dehors de l'encadrement contractuel."),
    Bullet("Refus poli et ferme de tout cadeau d'une valeur supérieure à 30 € (sauf attentions courantes : café, fleurs, dégustation officielle)."),

    H2("1.2. Discrétion et confidentialité"),
    Bullet("Confidentialité totale sur les données personnelles, médicales ou sensibles des voyageurs — RGPD, article 28 (sous-traitance)."),
    Bullet("Pas de photographie ou enregistrement vidéo d'un voyageur sans son consentement explicite."),
    Bullet("Pas de divulgation à des tiers (familles non concernées, médias, réseaux sociaux personnels) des informations recueillies pendant le voyage."),
    Bullet("Conservation et destruction de la liste voyageurs selon protocole Eventy après chaque voyage."),

    H2("1.3. Égalité de traitement"),
    Bullet("Service équivalent rendu à tous les voyageurs du groupe, sans favoritisme."),
    Bullet("Refus de toute forme de discrimination (origine, religion, orientation sexuelle, handicap, situation familiale, opinion politique, niveau social)."),
    Bullet("Attention particulière portée aux voyageurs PMR, isolés, ou en situation médicale signalée."),
    Bullet("Médiation neutre et bienveillante en cas de tension entre voyageurs."),

    H2("1.4. Sobriété et professionnalisme"),
    Bullet("Tenue vestimentaire correcte et adaptée à la situation (sportive lors d'une rando, urbaine en ville, élégante au dîner)."),
    Bullet("Ponctualité absolue — l'accompagnateur arrive systématiquement 30 minutes avant l'heure prévue."),
    Bullet("Sobriété en service direct — aucune consommation d'alcool pendant les heures de mission ; consommation modérée admise au dîner du soir si invitée."),
    Bullet("Aucune consommation de stupéfiants — en aucune circonstance."),
    Bullet("Téléphone professionnel allumé en permanence — répondre dans la minute pendant la mission."),

    H1("Article 2 — Disponibilité"),

    H2("2.1. Présence permanente pendant le voyage"),
    Bullet("Présence physique du début à la fin du voyage — porte-à-porte si applicable."),
    Bullet("Hébergement de l'accompagnateur dans le même établissement que les voyageurs (sauf accord spécifique)."),
    Bullet("Aucune absence non planifiée d'une durée supérieure à 4 heures pendant la durée du voyage."),

    H2("2.2. Joignable 24/7 par les voyageurs"),
    Bullet("Téléphone professionnel allumé en permanence pendant la durée du voyage et 24 heures après le retour."),
    Bullet("Réactivité : réponse à toute sollicitation voyageur sous 30 minutes en journée, sous 2 heures la nuit pour les urgences."),
    Bullet("Ligne d'urgence Eventy 24/7 communiquée à tous les voyageurs en plus du numéro accompagnateur."),

    H2("2.3. Coordination avec Eventy"),
    Bullet("Compte-rendu quotidien à la cellule opérationnelle Eventy via la plateforme dédiée (5 minutes maximum)."),
    Bullet("Signalement immédiat de tout incident (niveau 2 et au-delà selon manuel d'incident)."),
    Bullet("Reporting fin de voyage sous 48 heures — synthèse du déroulement, incidents éventuels, recommandations partenaires."),

    H1("Article 3 — Compétences attendues"),

    H2("3.1. Connaissance approfondie"),
    Bullet("Connaissance détaillée de la destination — histoire, géographie, culture, gastronomie, anecdotes pertinentes."),
    Bullet("Connaissance approfondie du programme du voyage — capacité à présenter chaque étape avec précision."),
    Bullet("Connaissance des partenaires HRA — interlocuteurs nominaux, particularités, allergènes signalés."),
    Bullet("Connaissance des procédures d'urgence locales — hôpitaux, ambassade, police, pompiers."),

    H2("3.2. Maîtrise linguistique"),
    Bullet("Français parfait — exigence non-négociable."),
    Bullet("Au minimum une langue étrangère utile à la destination (anglais a minima ; espagnol pour Espagne, portugais pour Portugal, arabe pour Maroc, italien pour Italie)."),
    Bullet("Capacité de communication simple en cas d'urgence dans la langue locale (formules de premiers secours)."),

    H2("3.3. Premiers secours"),
    Bullet("Formation aux premiers secours obligatoire (PSC1 — Prévention et Secours Civiques de niveau 1)."),
    Bullet("Recyclage triennal obligatoire (PSC1 valide à la prise de mission)."),
    Bullet("Capacité de pratiquer les gestes essentiels : massage cardiaque, position latérale de sécurité, alerte SAMU/15."),
    Bullet("Trousse de premiers secours obligatoire à disposition (cf. Article 6)."),

    H2("3.4. Manuel d'incident"),
    Bullet("Maîtrise du manuel d'incident voyage Eventy (4 niveaux de gravité)."),
    Bullet("Capacité à appliquer les procédures pas à pas selon le niveau de gravité."),
    Bullet("Connaissance des contacts d'urgence et des protocoles d'escalade."),

    H2("3.5. Capacité humaine"),
    Bullet("Empathie, écoute, sens de la médiation — l'accompagnateur est avant tout un humain qui prend soin d'autres humains."),
    Bullet("Sang-froid en situation de stress."),
    Bullet("Capacité à animer un groupe — proposer des activités, créer du lien, gérer les egos."),
    Bullet("Sens de l'humour bienveillant — détendre l'atmosphère sans manquer de respect."),

    H1("Article 4 — Obligations préalables"),

    H2("4.1. Justificatifs à produire avant la première mission"),
    Bullet("Justificatif d'identité valide (carte nationale d'identité ou passeport)."),
    Bullet("Casier judiciaire (extrait B3) vierge — exigence non-négociable."),
    Bullet("Attestation PSC1 valide (premiers secours)."),
    Bullet("Attestation d'assurance responsabilité civile vie privée."),
    Bullet("Numéro de téléphone professionnel valide pour la durée de la mission (autre que personnel)."),
    Bullet("RIB du compte bancaire professionnel (paiement sous 21 jours après mission)."),
    Bullet("Le cas échéant, attestation INSEE / Kbis (auto-entrepreneurs et indépendants)."),
    Bullet("Le cas échéant, attestation URSSAF à jour."),

    H2("4.2. Validation initiale par Eventy"),
    Bullet("Vérification administrative complète des pièces."),
    Bullet("Entretien de présentation avec le Responsable opérations."),
    Bullet("Suivi de la formation initiale Eventy (1 journée minimum, voir Plan de formation accompagnateur)."),
    Bullet("Première mission en binôme avec un accompagnateur expérimenté (dans la mesure du possible)."),

    H1("Article 5 — Évaluation continue"),

    H2("5.1. Notation post-voyage par les voyageurs"),
    P("À l'issue de chaque voyage, les voyageurs sont invités à noter et commenter l'accompagnateur via une enquête de satisfaction Eventy intégrée à la plateforme. Les éléments évalués :"),
    Bullet("Qualité de l'accueil et de la disponibilité."),
    Bullet("Connaissance du programme et de la destination."),
    Bullet("Sang-froid en situation imprévue."),
    Bullet("Bienveillance, écoute, médiation."),
    Bullet("Note globale sur 5."),

    H2("5.2. Seuils d'alerte et conséquences"),
    makeTable({
      widths: [3500, 5860],
      header: ["Indicateur", "Action déclenchée"],
      rows: [
        ["Note moyenne ≥ 4,5/5", "Évaluation excellente — éligibilité à des missions premium"],
        ["Note moyenne entre 4,0 et 4,5", "Évaluation satisfaisante — feedback constructif"],
        ["Note moyenne < 4,0 sur un voyage", "Entretien qualité avec Responsable opérations"],
        ["Note moyenne < 4,0 sur deux voyages consécutifs", "Mise sous surveillance — formation complémentaire"],
        ["Note moyenne < 4,0 sur trois voyages consécutifs", "Déréférencement définitif"],
        ["Plainte voyageur grave (manquement éthique, sécurité)", "Suspension immédiate · enquête interne"],
      ],
    }),

    H2("5.3. Audit qualité par Eventy"),
    Bullet("Eventy peut mandater un voyageur-mystère (auditeur incognito) sur un voyage à tout moment."),
    Bullet("Audits documentaires : reporting fin de voyage, journal d'incident, satisfaction voyageurs."),
    Bullet("Visites terrain ponctuelles du Responsable opérations sur les voyages en cours."),

    H1("Article 6 — Trousse opérationnelle de l'accompagnateur"),
    Bullet("Téléphone professionnel avec ligne européenne illimitée + numéros internationaux selon destination."),
    Bullet("Carte bancaire d'entreprise avec plafond d'urgence (5 000 € sous délégation simple, plus avec validation Président)."),
    Bullet("Trousse de premiers secours physique (pansements, désinfectant, paracétamol, attelles d'immobilisation, bandages)."),
    Bullet("Liste papier et numérique des partenaires HRA de la destination + back-up."),
    Bullet("Liste papier et numérique des contacts d'urgence (ligne 24/7 Eventy, assureur Pack Sérénité, ambassade/consulat français)."),
    Bullet("Manuel d'incident Eventy (version imprimée + version numérique)."),
    Bullet("Liste exhaustive des voyageurs avec coordonnées d'urgence et besoins spécifiques signalés."),
    Bullet("Pochette voyage personnelle (bons d'échange, programmes détaillés, plans, etc.)."),

    H1("Article 7 — Engagement de l'accompagnateur"),
    P("Je soussigné(e), [Nom Prénom de l'accompagnateur], reconnais avoir pris connaissance de la présente Charte qualité accompagnateur Eventy Life. J'en accepte sans réserve l'ensemble des stipulations et m'engage à les appliquer scrupuleusement à toute mission qui me sera confiée par Eventy Life SAS.", { italics: true }),
    P("Je suis conscient(e) que tout manquement avéré pourra entraîner, après mise en demeure restée sans effet sous 15 jours, ma suspension ou mon déréférencement définitif. En cas de manquement grave caractérisé (atteinte à la sécurité d'un voyageur, fraude, comportement éthique inacceptable), la suspension est immédiate.", { italics: true }),

    Spacer(160),
    P("Fait à [Ville], le [Date], en deux exemplaires originaux.", { italics: true, after: 200 }),

    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [new TableRow({ children: [
        new TableCell({ borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA },
          margins: { top: 100, bottom: 200, left: 120, right: 120 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour EVENTY LIFE SAS", bold: true, size: 20, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "M. David Eventy, Président", size: 18, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + cachet)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
          ] }),
        new TableCell({ borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA },
          margins: { top: 100, bottom: 200, left: 120, right: 120 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "L'accompagnateur", bold: true, size: 20, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "[Nom Prénom]", size: 18, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature + mention « Lu et approuvé »)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
          ] }),
      ] })],
    }),

    Spacer(160),
    P("Document de référence : Annexe Q du dossier APST + Manuel d'incident voyage + Plan de formation accompagnateur.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN DE FORMATION ACCOMPAGNATEUR
// ============================================================
function planFormation() {
  return [
    bandeauTitre(
      "PLAN DE FORMATION ACCOMPAGNATEUR EVENTY LIFE",
      "Programme initial 1 jour + formation continue 21h/an",
    ),
    Spacer(160),

    P("Le présent plan de formation organise la montée en compétences des accompagnateurs Eventy Life — créateurs indépendants ou accompagnateurs dédiés. Il est conforme aux engagements pris dans la Charte qualité accompagnateur (Article 3) et assure le respect des standards qualité du modèle Eventy.", { italics: true }),

    H1("1. Objectifs pédagogiques"),
    P("À l'issue du parcours de formation, l'accompagnateur Eventy doit être capable de :"),
    Numbered("Connaître l'écosystème Eventy (modèle économique distribué, charte qualité, manuel d'incident)."),
    Numbered("Maîtriser la plateforme technique (espace pro, reporting, gestion incidents)."),
    Numbered("Animer un groupe de 38 voyageurs avec bienveillance et professionnalisme."),
    Numbered("Identifier et qualifier un incident voyage selon les 4 niveaux de gravité."),
    Numbered("Appliquer les procédures opérationnelles d'urgence (rapatriement médical, hébergement de secours, retard transport)."),
    Numbered("Pratiquer les gestes de premiers secours (PSC1)."),
    Numbered("Communiquer en crise avec sang-froid (avec les voyageurs, les partenaires HRA, les autorités)."),

    H1("2. Formation initiale — 1 journée"),

    H2("2.1. Programme détaillé"),
    makeTable({
      widths: [1500, 4500, 3360],
      header: ["Horaires", "Module", "Animateur"],
      rows: [
        ["09h00-09h30", "Accueil et présentation des participants", "Responsable opérations"],
        ["09h30-10h30", "Vision et modèle Eventy Life — manifeste « rassembleurs »", "Président (visio possible)"],
        ["10h30-12h30", "Charte qualité accompagnateur — chaque article décortiqué", "Responsable opérations"],
        ["12h30-13h30", "Déjeuner partagé · networking", "—"],
        ["13h30-15h00", "Manuel d'incident voyage — 4 niveaux et procédures", "Responsable opérations"],
        ["15h00-15h15", "Pause", "—"],
        ["15h15-16h45", "Plateforme technique Eventy — démonstration et exercices pratiques", "CTO délégué"],
        ["16h45-17h30", "Ligne d'urgence 24/7 — script et mise en situation", "Responsable support"],
        ["17h30-18h00", "Questions/réponses · validation des connaissances · clôture", "Responsable opérations"],
      ],
    }),

    H2("2.2. Supports remis à l'issue"),
    Bullet("Charte qualité accompagnateur (PDF imprimable + version numérique)."),
    Bullet("Manuel d'incident voyage (PDF imprimable, à conserver dans la trousse)."),
    Bullet("Guide de la plateforme technique (PDF + tutoriels vidéo)."),
    Bullet("Liste des contacts d'urgence Eventy."),
    Bullet("Trousse opérationnelle de base (téléphone pro, carte bancaire d'entreprise, kit premiers secours)."),

    H2("2.3. Validation"),
    P("La formation initiale est validée par :"),
    Bullet("Présence effective sur l'intégralité du programme (8 heures)."),
    Bullet("Réussite à un quiz de validation (20 questions sur la charte, le manuel d'incident et la plateforme)."),
    Bullet("Validation orale par le Responsable opérations sur les compétences observées."),

    H1("3. Première mission en binôme (recommandée)"),

    H2("3.1. Principe"),
    P("Dans la mesure du possible, la première mission de l'accompagnateur nouvellement formé se fait en binôme avec un accompagnateur expérimenté. Le nouveau apprend par observation et participation guidée. Cela rassure les voyageurs et accélère la montée en compétences."),

    H2("3.2. Objectifs"),
    Bullet("Observer le comportement et les pratiques d'un accompagnateur expérimenté."),
    Bullet("Prendre en charge progressivement des micro-missions (animation d'un repas, présentation d'une activité)."),
    Bullet("Bénéficier d'un retour d'expérience direct et personnalisé."),
    Bullet("Construire un réseau professionnel au sein de l'équipe Eventy."),

    H2("3.3. Évaluation post-binôme"),
    Bullet("Compte-rendu écrit de l'accompagnateur expérimenté sur la prise de poste du nouveau."),
    Bullet("Échange de feedback bilatéral."),
    Bullet("Décision finale du Responsable opérations sur l'autorisation de prise de mission solo."),

    H1("4. Formation continue — minimum 21 heures par an"),

    H2("4.1. Modules disponibles"),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Module", "Durée typique", "Format"],
      rows: [
        ["Recyclage Manuel d'incident voyage", "3 heures/an", "Visio · semestriel"],
        ["Recyclage PSC1 (premiers secours)", "7 heures/3 ans", "Présentiel · organisme agréé"],
        ["Formation continue droit du tourisme", "3 heures/an", "Visio · annuel"],
        ["Formation RGPD et données personnelles", "2 heures/an", "Visio · annuel"],
        ["Formation animation de groupe", "3 heures/an", "Présentiel ou visio"],
        ["Formation langue étrangère (perfectionnement)", "Variable selon besoin", "Plateforme partenaire"],
        ["Module nouvelle destination (par destination)", "2 heures par destination", "Visio + documentation"],
        ["Retours d'expérience inter-accompagnateurs", "1 heure trimestrielle", "Visio collective"],
      ],
    }),

    H2("4.2. Volume minimum annuel"),
    P("L'accompagnateur s'engage à suivre un minimum de 21 heures de formation continue par an. Eventy Life prend en charge financièrement les modules officiels. Les modules suivis sont tracés dans le compte personnel de l'accompagnateur."),

    H2("4.3. Intervenants"),
    Bullet("Responsable opérations Eventy."),
    Bullet("Avocat tourisme partenaire (modules juridiques)."),
    Bullet("Expert-comptable spécialisé tourisme (modules fiscaux, le cas échéant)."),
    Bullet("Organismes de formation agréés (PSC1, langues)."),
    Bullet("Pairs accompagnateurs expérimentés (retours d'expérience)."),

    H1("5. Évaluation continue et évolution"),

    H2("5.1. Suivi annuel"),
    Bullet("Bilan annuel des compétences avec le Responsable opérations."),
    Bullet("Revue des notes voyageurs sur l'année écoulée."),
    Bullet("Plan de formation personnalisé pour l'année suivante."),

    H2("5.2. Évolution professionnelle"),
    Bullet("Accès à des missions premium (séminaires B2B, voyages haut de gamme) pour les accompagnateurs notés ≥ 4,5/5."),
    Bullet("Possibilité de devenir formateur Eventy après 2 ans d'expérience et 50 voyages."),
    Bullet("Possibilité d'évoluer vers un poste interne (Responsable opérations adjoint, formateur)."),
    Bullet("Possibilité de cumuler avec un rôle de Créateur (conception de voyages)."),

    H1("6. Coût et financement"),
    Bullet("Formation initiale (1 journée) : prise en charge intégrale par Eventy Life."),
    Bullet("Recyclage PSC1 triennal : prise en charge intégrale par Eventy Life."),
    Bullet("Modules continus officiels Eventy (manuel d'incident, droit, RGPD) : pris en charge."),
    Bullet("Modules d'évolution (langues, animation) : pris en charge à 50 % à hauteur de 500 €/an/accompagnateur."),
    Bullet("Modules personnels supplémentaires : à la charge de l'accompagnateur (auto-entrepreneur)."),
    Bullet("Possibilité de mobiliser le CPF (Compte Personnel de Formation) pour les modules certifiants."),

    Spacer(160),
    P("Document opérationnel — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Document de référence : Charte qualité accompagnateur · Manuel d'incident voyage · Annexe Q du dossier APST.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — POLITIQUE DE GESTION DES AVIS VOYAGEURS
// ============================================================
function politiqueAvis() {
  return [
    bandeauTitre(
      "POLITIQUE DE GESTION DES AVIS VOYAGEURS",
      "E-réputation Eventy Life — transparence et amélioration continue",
    ),
    Spacer(160),

    P("La présente politique formalise l'approche d'Eventy Life vis-à-vis des avis voyageurs publiés sur les plateformes externes (Trustpilot, Google, plateformes de voyages, réseaux sociaux). Elle vise à garantir la transparence, l'authenticité et l'apprentissage continu à partir des retours voyageurs.", { italics: true }),

    H1("1. Principes fondateurs"),

    H2("1.1. Authenticité avant tout"),
    Bullet("Eventy Life ne sollicite jamais d'avis fictifs, ne rémunère jamais d'avis, ne suscite jamais d'avis biaisés."),
    Bullet("Eventy Life ne supprime jamais d'avis négatif sur les plateformes externes — tous les retours sont traités de manière équivalente."),
    Bullet("Eventy Life ne cherche pas à surreprésenter les avis positifs — la moyenne reflète la réalité du service rendu."),
    Bullet("L'authenticité prime sur la communication marketing."),

    H2("1.2. Apprentissage continu"),
    Bullet("Chaque avis, positif ou négatif, est une opportunité d'apprentissage."),
    Bullet("Les avis sont analysés systématiquement par l'équipe qualité (mensuellement)."),
    Bullet("Les enseignements alimentent les mises à jour des programmes, la formation accompagnateur et les procédures."),

    H2("1.3. Réponse systématique"),
    Bullet("Eventy répond à 100 % des avis publiés (positifs comme négatifs)."),
    Bullet("Délai cible de réponse : 7 jours ouvrés maximum."),
    Bullet("Ton de réponse : chaleureux pour les positifs, factuel et apaisant pour les négatifs."),
    Bullet("Pas de réponse défensive ou polémique — reconnaissance des points légitimes."),

    H1("2. Plateformes suivies"),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Plateforme", "Fréquence de suivi", "Responsable"],
      rows: [
        ["Trustpilot (à activer An 1)", "Hebdomadaire", "Responsable marketing"],
        ["Google Business Profile", "Quotidien (notification)", "Responsable marketing"],
        ["Facebook (page Eventy Life)", "Quotidien (notification)", "Responsable marketing"],
        ["Instagram (commentaires)", "Quotidien", "Responsable marketing"],
        ["TripAdvisor", "Hebdomadaire", "Responsable marketing"],
        ["Plateformes presse spécialisée tourisme", "Mensuel", "Responsable marketing"],
        ["Forums voyageurs (Routard, etc.)", "Mensuel", "Responsable marketing"],
      ],
    }),

    H1("3. Process de réponse"),

    H2("3.1. Étape 1 — Détection de l'avis"),
    Bullet("Notification automatique au Responsable marketing pour Trustpilot, Google, Facebook, Instagram."),
    Bullet("Veille manuelle hebdomadaire pour les autres plateformes."),
    Bullet("Tracking dans un tableau de bord interne (date, plateforme, note, voyage concerné, statut traitement)."),

    H2("3.2. Étape 2 — Qualification"),
    Bullet("Note ≥ 4 étoiles : avis positif → réponse de remerciement."),
    Bullet("Note 3 étoiles : avis neutre → réponse de reconnaissance + invitation au feedback détaillé."),
    Bullet("Note ≤ 2 étoiles : avis négatif → réponse de prise en charge + escalade vers le service réclamations."),
    Bullet("Avis manifestement faux ou diffamatoire : signalement à la plateforme + conservation des preuves."),

    H2("3.3. Étape 3 — Rédaction de la réponse"),
    P("Templates de référence (à personnaliser) :"),

    H3("Réponse à un avis positif (5 étoiles)"),
    P("« Merci [prénom] pour ce retour si chaleureux ! Nous sommes ravis que [point spécifique mentionné] vous ait plu. Notre accompagnateur [prénom si mentionné] sera très heureux de lire votre message. À bientôt pour un nouveau voyage Eventy ! L'équipe Eventy Life. »", { italics: true }),

    H3("Réponse à un avis neutre (3 étoiles)"),
    P("« Bonjour [prénom], merci d'avoir pris le temps de partager votre retour. Vous mentionnez [point soulevé], et nous prenons cela au sérieux. Si vous le souhaitez, nous serions ravis d'en discuter plus en détail à reclamation@eventylife.fr — votre retour nous aidera à améliorer nos voyages. Bien cordialement, L'équipe Eventy Life. »", { italics: true }),

    H3("Réponse à un avis négatif (≤ 2 étoiles)"),
    P("« Bonjour [prénom], nous sommes sincèrement désolés que votre voyage ne soit pas à la hauteur de vos attentes — c'est exactement le type de retour qui nous fait progresser. Nous prenons très au sérieux les points que vous soulevez sur [points soulevés]. Pourriez-vous nous écrire à reclamation@eventylife.fr afin que nous étudiions votre dossier en détail et trouvions ensemble une solution ? Avec notre considération, L'équipe Eventy Life. »", { italics: true }),

    H2("3.4. Étape 4 — Suivi opérationnel"),
    Bullet("Si l'avis pointe un problème opérationnel récurrent : escalade au Responsable opérations pour analyse et action corrective."),
    Bullet("Si l'avis pointe un partenaire HRA défaillant : audit qualité du partenaire."),
    Bullet("Si l'avis pointe un accompagnateur : entretien qualité avec l'accompagnateur."),
    Bullet("Tracking dans le dashboard mensuel des avis voyageurs."),

    H1("4. Indicateurs de pilotage e-réputation"),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Indicateur", "Cible An 1", "Seuil d'alerte"],
      rows: [
        ["Note moyenne Trustpilot", "≥ 4,5/5", "< 4,2"],
        ["Note moyenne Google", "≥ 4,5/5", "< 4,2"],
        ["Volume d'avis cumulés An 1", "≥ 500", "< 200"],
        ["Taux de réponse aux avis", "100 %", "< 95 %"],
        ["Délai moyen de réponse", "≤ 5 jours", "> 10 jours"],
        ["Taux d'avis négatifs (≤ 2 étoiles)", "≤ 5 %", "> 10 %"],
        ["NPS post-voyage interne", "≥ + 60", "< + 40"],
      ],
    }),

    H1("5. Politique anti-faux avis"),

    H2("5.1. Côté Eventy"),
    Bullet("Eventy Life ne sollicite jamais d'avis fictifs."),
    Bullet("Eventy Life ne rémunère jamais un voyageur en échange d'un avis."),
    Bullet("Eventy Life ne propose jamais d'avantage commercial conditionné à un avis (réduction sur prochain voyage si avis positif)."),

    H2("5.2. Vis-à-vis des concurrents"),
    Bullet("En cas d'avis négatif manifestement faux (fraude, voyage inexistant, descriptions impossibles) : signalement à la plateforme avec preuves."),
    Bullet("En cas d'attaque coordonnée détectée : signalement DGCCRF + démarche juridique avec avocat."),
    Bullet("Conservation systématique des preuves de fraude (captures d'écran, identifiants, métadonnées)."),

    H2("5.3. Vis-à-vis des voyageurs"),
    Bullet("Mentions légales claires : seuls les voyageurs effectifs sont éligibles à laisser un avis."),
    Bullet("Vérification d'identité possible pour les avis très négatifs douteux."),
    Bullet("Demande de droit de réponse loyale en cas de diffamation manifeste."),

    H1("6. Communication transparente sur les avis"),
    Bullet("Affichage de la note moyenne et du nombre total d'avis sur eventylife.fr (page d'accueil)."),
    Bullet("Affichage des avis récents sur chaque fiche voyage (sans tri biaisé)."),
    Bullet("Lien direct vers les plateformes externes pour vérification."),
    Bullet("Rapport annuel d'activité incluant un volet « Voix du voyageur » (synthèse des retours)."),
    Bullet("Communication transparente sur les actions correctives prises suite aux retours."),

    Spacer(160),
    P("Document opérationnel — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : politique RSE Eventy (engagement transparence), procédure de réclamation détaillée, charte qualité accompagnateur.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Qualite-Accompagnateur.docx",
      title: "Eventy Life — Charte qualité accompagnateur",
      description: "Engagements opposables à tout accompagnateur Eventy Life.",
      footer: "EVENTY LIFE SAS — Charte qualité accompagnateur",
      children: charteAccompagnateur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Formation-Accompagnateur.docx",
      title: "Eventy Life — Plan de formation accompagnateur",
      description: "Programme de formation initiale et continue pour les accompagnateurs Eventy.",
      footer: "EVENTY LIFE SAS — Plan formation accompagnateur",
      children: planFormation(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Avis-Voyageurs.docx",
      title: "Eventy Life — Politique de gestion des avis voyageurs",
      description: "Politique d'e-réputation et de gestion des avis voyageurs sur les plateformes externes.",
      footer: "EVENTY LIFE SAS — Politique avis voyageurs",
      children: politiqueAvis(),
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
