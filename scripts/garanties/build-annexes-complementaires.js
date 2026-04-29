/**
 * Eventy Life — Annexes complémentaires
 *
 * Génère trois documents autonomes :
 *   1. Checklist documents à fournir à Atout France
 *   2. Calendrier prévisionnel J0 → J+90
 *   3. Modèle de contrat type vendeur/créateur cohérent avec le modèle de marges
 *
 * Usage : node scripts/garanties/build-annexes-complementaires.js
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
  HeadingLevel,
  PageNumber,
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

// ============== Helpers ==============
function H1(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
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
function Spacer(after = 100) {
  return new Paragraph({ spacing: { after }, children: [new TextRun("")] });
}
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
function bandeauTitre(title, subtitle) {
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
                children: [new TextRun({ text: title, size: 30, bold: true, color: COLOR.orange, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: subtitle, size: 18, italics: true, color: COLOR.blue, font: "Calibri" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ============== Doc commun ==============
function makeDoc({ title, description, footerLeft, children }) {
  return new Document({
    creator: "David Eventy — Eventy Life SAS",
    title,
    description,
    styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
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

// =====================================================================
// ANNEXE 1 — CHECKLIST DOCUMENTS À FOURNIR À ATOUT FRANCE
// =====================================================================
function checklistAtoutFrance() {
  return [
    bandeauTitre(
      "CHECKLIST ATOUT FRANCE",
      "Documents à fournir au registre des opérateurs de voyages et de séjours",
    ),
    Spacer(160),

    P("Cette checklist liste, point par point, l'ensemble des documents à constituer pour la demande d'immatriculation au registre des opérateurs de voyages et de séjours d'Atout France. Elle est utilisable comme document de travail interne et comme bordereau de transmission lors du dépôt officiel.", { italics: true }),

    H2("A. Pré-requis avant dépôt"),
    P("Trois conditions cumulatives doivent être remplies avant la soumission du dossier d'immatriculation à Atout France."),
    makeTable({
      widths: [600, 4200, 2200, 2360],
      header: ["#", "Pré-requis", "Pièce attendue", "Statut Eventy"],
      rows: [
        ["1", "Société immatriculée au RCS", "Extrait Kbis < 3 mois", "À obtenir post-création SAS"],
        ["2", "Garantie financière souscrite", "Attestation APST illimitée", "Adhésion APST en cours d'instruction"],
        ["3", "Assurance RC Pro Tourisme souscrite", "Attestation assureur", "Devis Galian (Cabinet Vallois) en cours"],
      ],
    }),

    H2("B. Pièces du dossier d'immatriculation Atout France"),
    P("Le dossier d'immatriculation est entièrement dématérialisé sur registre-operateurs-de-voyages.atout-france.fr. Voici la liste exhaustive des pièces à téléverser."),
    makeTable({
      widths: [400, 5200, 1800, 1960],
      header: ["#", "Pièce", "Format attendu", "À cocher"],
      rows: [
        ["1", "Formulaire de demande d'immatriculation Atout France (signé)", "PDF + signature manuscrite", "☐"],
        ["2", "Extrait Kbis de moins de 3 mois", "PDF original", "☐"],
        ["3", "Copie certifiée conforme des statuts SAS", "PDF + paraphes président", "☐"],
        ["4", "Justificatif d'identité du dirigeant (CNI ou passeport)", "PDF recto-verso", "☐"],
        ["5", "Attestation APST de garantie financière (originale)", "PDF original", "☐"],
        ["6", "Attestation d'assurance RC Pro Tourisme (originale)", "PDF original", "☐"],
        ["7", "Justificatif de capacité professionnelle du dirigeant", "Diplôme / attestation expérience / contrat salarié qualifié", "☐"],
        ["8", "Compte de résultat prévisionnel An 1 / An 2", "PDF (extrait du dossier de garantie)", "☐"],
        ["9", "Tableau de volume d'affaires prévisionnel", "PDF (extrait du dossier de garantie)", "☐"],
        ["10", "Descriptif détaillé du projet et de l'activité", "PDF (extrait du dossier de garantie)", "☐"],
        ["11", "Justificatif d'occupation des locaux", "Bail commercial OU contrat de domiciliation", "☐"],
        ["12", "Règlement des frais d'immatriculation (150 €)", "Carte bancaire en ligne", "☐"],
      ],
    }),

    H2("C. Pièces complémentaires recommandées (non obligatoires)"),
    P("Bien que non strictement exigées par Atout France, les pièces ci-dessous renforcent la qualité du dossier et facilitent l'instruction."),
    makeTable({
      widths: [400, 5200, 1800, 1960],
      header: ["#", "Pièce", "Utilité", "À cocher"],
      rows: [
        ["13", "Dossier complet de garantie financière (119 pages)", "Cohérence avec dossier APST", "☐"],
        ["14", "Résumé exécutif 2 pages (banquier / investisseur)", "Synthèse rapide", "☐"],
        ["15", "Conditions Générales de Vente (CGV)", "Conformes directive 2015/2302", "☐"],
        ["16", "Modèle de contrat type voyageur", "Cohérence contractuelle", "☐"],
        ["17", "Charte de transparence des prix", "Engagement public", "☐"],
        ["18", "Politique de confidentialité et RGPD", "Conformité règlement (UE) 2016/679", "☐"],
        ["19", "Catalogue des programmes types saison 1", "Lisibilité du catalogue commercial", "☐"],
        ["20", "Liste des partenaires identifiés (HRA, autocaristes)", "Démonstration de la chaîne de valeur", "☐"],
      ],
    }),

    H2("D. Vérifications avant transmission"),
    P("Avant de cliquer sur « Soumettre », vérifier les points suivants."),
    Numbered("Tous les PDF sont lisibles, non corrompus, scannés en haute qualité (300 dpi minimum)."),
    Numbered("Toutes les pages requises sont présentes et numérotées."),
    Numbered("Les noms de fichiers respectent une nomenclature claire (ex. « 01-Formulaire.pdf », « 02-Kbis.pdf »)."),
    Numbered("La signature manuscrite figure sur les documents qui l'exigent (formulaire, déclaration honneur)."),
    Numbered("Les attestations APST et RC Pro sont à jour (date d'émission ≤ 3 mois)."),
    Numbered("Le règlement des 150 € a été effectué et un justificatif de paiement est conservé."),
    Numbered("Une copie complète du dossier est archivée localement (sauvegarde double)."),

    H2("E. Suivi post-transmission"),
    P("Après soumission, conserver précieusement :"),
    Bullet("Numéro de référence du dépôt généré par le portail Atout France."),
    Bullet("Email de confirmation reçu sur eventylife@gmail.com."),
    Bullet("Justificatif de paiement des frais d'immatriculation."),
    Bullet("Date de soumission (servira de référence pour le délai légal d'un mois maximum)."),
    P("Atout France instruit le dossier dans un délai légal d'un mois maximum à compter de la réception d'un dossier complet. Toute demande de pièces complémentaires interrompt ce délai jusqu'à fourniture desdites pièces."),

    H2("F. Liste de contrôle finale (à imprimer pour le dépôt physique)"),
    Bullet("Dossier complet vérifié et téléversé"),
    Bullet("Frais de 150 € réglés"),
    Bullet("Numéro de dépôt enregistré et archivé"),
    Bullet("Copie locale du dossier sauvegardée (cloud + disque externe)"),
    Bullet("Avocat tourisme informé du dépôt"),
    Bullet("Expert-comptable informé du dépôt"),
    Bullet("APST notifiée du dépôt parallèle Atout France"),
    Bullet("Calendrier de relance prévu (J+30, J+45, J+60)"),

    Spacer(160),
    P("Document de référence : voir aussi PROCESSUS-ATOUT-FRANCE.md (note opérationnelle complète) et le dossier complet de garantie financière (Partie 12 — Calendrier opérationnel + Partie 15 — Annexes).", { italics: true, color: COLOR.gray }),
  ];
}

// =====================================================================
// ANNEXE 2 — CALENDRIER PRÉVISIONNEL J0 → J+90
// =====================================================================
function calendrierJ0J90() {
  return [
    bandeauTitre(
      "CALENDRIER PRÉVISIONNEL J0 → J+90",
      "Étapes administratives — création SAS · APST · Atout France",
    ),
    Spacer(160),

    P("Ce calendrier détaille les étapes administratives d'Eventy Life SAS depuis le jalon J0 (inscription au registre Atout France) jusqu'au jalon J+90 (extinction de toutes les démarches d'immatriculation). Il intègre le scénario standard de 60 jours et la marge de sécurité de 30 jours pour absorber les aléas administratifs.", { italics: true }),

    H2("Vue synthétique — chronologie cible"),
    makeTable({
      widths: [1600, 7760],
      header: ["Jalon", "Action structurante"],
      rows: [
        ["J0", "Inscription Atout France · constitution dossier APST"],
        ["J+30", "Dépôt garantie financière APST · cotisation versée"],
        ["J+45", "Délivrance attestation APST · soumission Atout France"],
        ["J+60", "Obtention IM Atout France · lancement commercial"],
        ["J+90", "Marge de sécurité · première montée en charge"],
      ],
    }),

    H2("Détail semaine par semaine"),

    H3("Semaine 1 — J0 à J+7 (déclenchement)"),
    Numbered("J0 : création de compte sur registre-operateurs-de-voyages.atout-france.fr."),
    Numbered("J0 + 1 : téléchargement du dossier-type Atout France et étude des pré-requis."),
    Numbered("J0 + 2 à J+5 : finalisation du dossier APST (statuts signés, descriptif projet, prévisionnel)."),
    Numbered("J0 + 5 : prise de rendez-vous avec banque pour ouverture du compte cantonné."),
    Numbered("J0 + 7 : envoi du dossier complet APST à info@apst.travel + dépôt physique courrier recommandé."),

    H3("Semaine 2 — J+7 à J+14 (sécurisation des assurances)"),
    Numbered("J+7 : lancement de la procédure de souscription RC Pro Tourisme avec Cabinet Vallois (Galian)."),
    Numbered("J+8 à J+12 : transmission des pièces à l'assureur (Kbis, descriptif, prévisionnel, antécédents)."),
    Numbered("J+13 : signature du contrat RC Pro et paiement de la prime annuelle (≈ 850 €)."),
    Numbered("J+14 : réception de l'attestation RC Pro Tourisme."),

    H3("Semaine 3-4 — J+14 à J+30 (instruction APST)"),
    Numbered("J+14 à J+25 : instruction APST en cours, échanges éventuels avec l'instructeur sur pièces complémentaires."),
    Numbered("J+25 à J+28 : préparation au passage en commission d'admission APST."),
    Numbered("J+30 : passage en commission APST et décision d'admission."),
    Numbered("J+30 : versement de la cotisation annuelle APST (≈ 2 100 € fixe + part variable estimée)."),
    Numbered("J+30 : ouverture du compte bancaire cantonné et constitution de la contre-garantie personnelle 10 000 €."),

    H3("Semaine 5-6 — J+30 à J+45 (transition vers Atout France)"),
    Numbered("J+31 : réception de l'attestation APST de garantie financière."),
    Numbered("J+32 : transmission de l'attestation APST à Atout France."),
    Numbered("J+33 à J+44 : finalisation des derniers documents Atout France (justificatif locaux, capacité, etc.)."),
    Numbered("J+45 : soumission complète du dossier d'immatriculation Atout France et règlement des 150 €."),

    H3("Semaine 7-8 — J+45 à J+60 (instruction Atout France)"),
    Numbered("J+46 à J+58 : instruction Atout France · veille et réponse aux demandes de pièces complémentaires."),
    Numbered("J+59 : décision Atout France."),
    Numbered("J+60 : attribution du numéro IM ###-###-### et publication sur le registre national."),

    H3("Semaine 9 — J+60 à J+67 (mise en conformité immédiate)"),
    Numbered("J+60 + 1 : affichage du numéro IM sur eventylife.fr (footer, mentions légales, fiches voyage, CGV)."),
    Numbered("J+62 : adhésion à la Médiation Tourisme et Voyage (MTV) — gratuite."),
    Numbered("J+63 à J+65 : campagne marketing soft-launch grand public et B2B."),
    Numbered("J+67 : ouverture des premières réservations grand public."),

    H3("Semaines 10-13 — J+67 à J+90 (premières opérations + marge sécurité)"),
    Numbered("J+70 à J+85 : premiers voyages tests (3 à 5 voyages programmés sur destinations proches)."),
    Numbered("J+85 à J+90 : première déclaration trimestrielle des fonds en transit à l'APST."),
    Numbered("J+90 : bilan de la phase de lancement, ajustements éventuels, debrief APST."),

    H2("Variantes — scénario raccourci 45 jours et scénario allongé 90 jours"),
    makeTable({
      widths: [2200, 3580, 3580],
      header: ["Période", "Scénario raccourci (45 j)", "Scénario allongé (90 j)"],
      rows: [
        ["J0 - J+15", "Dossier APST déposé, RC Pro signée", "Dossier APST en finalisation"],
        ["J+15 - J+30", "Commission APST anticipée + attestation reçue", "Dossier APST déposé"],
        ["J+30 - J+45", "Soumission Atout France + obtention IM", "Commission APST + attestation"],
        ["J+45 - J+60", "Lancement commercial", "Soumission Atout France"],
        ["J+60 - J+90", "Montée en charge + reporting", "Obtention IM + lancement"],
      ],
    }),
    P("Le scénario raccourci suppose un dossier exemplaire d'emblée, une commission APST anticipée et aucune demande de pièces complémentaires. Le scénario allongé absorbe les aléas administratifs courants (commission reportée, demande de pièces, audit). Eventy Life se prépare pour le scénario standard (60 jours) en gardant 30 jours de marge."),

    H2("Acteurs mobilisés et points de coordination"),
    makeTable({
      widths: [3000, 3200, 3160],
      header: ["Acteur", "Mobilisation", "Coordination"],
      rows: [
        ["David Eventy (Président)", "Permanente", "Pilote unique"],
        ["Avocat tourisme partenaire", "Validation pré-soumission, audit CGV", "Hebdo en phase 1, ad hoc ensuite"],
        ["Expert-comptable", "Prévisionnel + attestation comptable", "Bi-mensuelle au démarrage"],
        ["APST", "Instruction + commission + attestation", "Email + courrier recommandé"],
        ["Atout France", "Instruction + délivrance IM", "Plateforme dématérialisée"],
        ["Cabinet Vallois (assureur RC Pro)", "Souscription RC Pro Tourisme", "Échanges email"],
        ["Banque domiciliataire", "Compte courant + compte cantonné", "Rendez-vous physique J+5 et J+30"],
      ],
    }),

    Spacer(160),
    P("Document de référence : voir Partie 12 du dossier complet de garantie financière (Calendrier opérationnel — chemin critique) pour la déclinaison par jalons et la chronologie post-immatriculation (J+90 → J+1095).", { italics: true, color: COLOR.gray }),
  ];
}

// =====================================================================
// ANNEXE 3 — MODÈLE DE CONTRAT TYPE VENDEUR / CRÉATEUR
// =====================================================================
function contratTypeVendeurCreateur() {
  return [
    bandeauTitre(
      "CONTRAT TYPE VENDEUR / CRÉATEUR",
      "Modèle de contrat-cadre cohérent avec le modèle de marges Eventy",
    ),
    Spacer(160),

    P("Le présent modèle est destiné à être adapté pour chaque vendeur ou créateur indépendant qui rejoint l'écosystème Eventy Life. Il intègre l'architecture de marges distribuées validée par la direction (5 % HT vendeur · 3 points créateur sur HRA refacturé) et les obligations corrélatives (qualité, responsabilités, RGPD).", { italics: true }),

    H2("CONTRAT-CADRE DE PARTENARIAT COMMERCIAL"),
    P("Article préliminaire — Identification des parties", { bold: true }),
    P("Le présent contrat est conclu entre :"),
    P("D'une part, EVENTY LIFE SAS, au capital de [montant] €, dont le siège social est sis [adresse], immatriculée au Registre du Commerce et des Sociétés sous le numéro [SIREN], immatriculée au registre des opérateurs de voyages et de séjours d'Atout France sous le numéro IM [###-###-###], représentée par Monsieur David Eventy, Président, ci-après dénommée « EVENTY » ;"),
    P("D'autre part, [Nom Prénom], auto-entrepreneur, micro-entreprise ou société, immatriculé(e) au répertoire SIRENE sous le numéro [SIRET], demeurant à [adresse], ci-après dénommé(e) « le PARTENAIRE » ;"),
    P("Il est préalablement exposé que le PARTENAIRE souhaite collaborer avec EVENTY en qualité de [vendeur indépendant / créateur de voyages / l'un et l'autre], sans qu'il existe entre les parties aucune relation de subordination juridique caractérisant un contrat de travail. Les parties se sont rapprochées et il a été convenu ce qui suit."),

    H2("Article 1 — Objet"),
    P("Le présent contrat a pour objet de définir les conditions selon lesquelles le PARTENAIRE intervient au profit d'EVENTY :"),
    Bullet("Soit en qualité de vendeur — placement d'inscriptions à des voyages organisés par EVENTY auprès de voyageurs."),
    Bullet("Soit en qualité de créateur — conception, programmation et accompagnement de voyages à forfait commercialisés par EVENTY."),
    Bullet("Soit cumulativement — exercice simultané des deux qualités, ouvrant droit aux rémunérations correspondantes cumulables."),
    P("EVENTY conserve seule la qualité d'opérateur de voyages au sens des articles L211-1 et suivants du Code du Tourisme. Le PARTENAIRE n'est, en aucun cas, opérateur, organisateur, vendeur direct ni intermédiaire au sens du Code du Tourisme."),

    H2("Article 2 — Obligations du PARTENAIRE"),
    Bullet("Respect strict des obligations légales personnelles : immatriculation à jour (URSSAF, RCS / RNE), déclarations fiscales et sociales, capacité juridique."),
    Bullet("Respect intégral de la charte qualité Eventy (jointe en annexe au présent contrat)."),
    Bullet("Respect des obligations d'information précontractuelle envers le voyageur, sous le contrôle d'EVENTY (formulaire arrêté du 1er mars 2018, programmes types)."),
    Bullet("Confidentialité totale sur les données personnelles, médicales ou sensibles des voyageurs (RGPD)."),
    Bullet("Mise à jour permanente des coordonnées et du compte de paiement professionnel."),
    Bullet("Si désigné accompagnateur : présence permanente du début à la fin du voyage, formation premiers secours valide, casier judiciaire B3 vierge, langue(s) étrangère(s) selon destination."),

    H2("Article 3 — Obligations d'EVENTY"),
    Bullet("Mise à disposition de la plateforme technique (espace pro PARTENAIRE, accès au catalogue, génération automatique des contrats voyageurs)."),
    Bullet("Souscription et maintien en vigueur de la garantie financière APST et de la RC Pro Tourisme."),
    Bullet("Versement des rémunérations contractuelles dans les délais convenus."),
    Bullet("Formation initiale du PARTENAIRE et accès au manuel d'incident Eventy."),
    Bullet("Sécurité juridique du PARTENAIRE pour les voyages réalisés sous l'égide d'EVENTY (responsabilité de plein droit assumée par EVENTY)."),

    H2("Article 4 — Rémunérations (cohérence avec le modèle de marges)"),
    P("Le PARTENAIRE perçoit, pour chaque voyage qu'il a placé ou conçu, les rémunérations suivantes — strictement conformes au modèle de marges Eventy validé en Partie 1.4 du dossier de garantie financière."),
    makeTable({
      widths: [3200, 3000, 3160],
      header: ["Qualité", "Base de calcul", "Taux"],
      rows: [
        ["Vendeur", "Chiffre d'affaires HT du voyage placé", "5 % HT"],
        ["Créateur", "HRA refacturé du voyage conçu", "+ 3 points (en sus du socle Eventy 8 %)"],
        ["Créateur cumulant le rôle de vendeur", "Cumul des deux barèmes ci-dessus", "5 % HT + 3 points HRA"],
        ["Accompagnement (si désigné)", "Forfait par voyage", "≈ 600 € à 800 € selon durée"],
      ],
    }),
    P("Les rémunérations sont versées sous 21 jours à compter de la livraison du voyage et de l'établissement du décompte par EVENTY. Les versements transitent exclusivement par le compte de paiement du PARTENAIRE référencé en annexe."),
    P("En cas d'annulation de voyage par EVENTY pour cause de seuil minimum non atteint (28 voyageurs), aucune rémunération n'est due, l'ensemble des fonds étant intégralement remboursés aux voyageurs. En cas d'annulation pour cause imputable à EVENTY, les rémunérations engagées sont versées au prorata de l'avancement, sur décision documentée du comité de pilotage opérationnel."),

    H2("Article 5 — Cas particuliers de cumul"),
    P("Un PARTENAIRE peut cumuler les qualités de vendeur et de créateur. Dans ce cas :"),
    Bullet("La commission « vendeur » 5 % HT est due au PARTENAIRE qui place effectivement le voyage auprès du voyageur."),
    Bullet("La commission « créateur » 3 points sur HRA est due au PARTENAIRE qui a conçu et programmé le voyage."),
    Bullet("Si une même personne place et conçoit le voyage, les deux commissions se cumulent."),
    Bullet("Si la conception et la vente sont assurées par deux PARTENAIRES distincts, chaque commission est due à son bénéficiaire respectif, EVENTY assurant la traçabilité technique."),

    H2("Article 6 — Engagements de qualité et sanctions"),
    P("Tout manquement avéré aux obligations contractuelles peut entraîner, après mise en demeure restée sans effet sous 15 jours :"),
    Bullet("Suspension temporaire du PARTENAIRE de l'écosystème Eventy."),
    Bullet("Déréférencement définitif en cas de récidive ou de gravité."),
    Bullet("Retenue ou remboursement des commissions versées en cas de fraude avérée."),
    Bullet("Le cas échéant, action en dommages-intérêts."),
    P("EVENTY conserve un droit d'audit sur la qualité de l'exécution. Le PARTENAIRE est noté à l'issue de chaque voyage (notation voyageur post-séjour). Une note moyenne inférieure à 4/5 sur deux voyages consécutifs déclenche un entretien qualité avec le Responsable opérations EVENTY."),

    H2("Article 7 — Indépendance et non-exclusivité"),
    P("Le PARTENAIRE conserve sa pleine indépendance économique et juridique. Il est libre de collaborer avec d'autres opérateurs de voyages, sous réserve de ne pas porter atteinte à la réputation, aux intérêts ou aux secrets d'affaires d'EVENTY. Aucune clause d'exclusivité ne s'applique sauf accord exprès et écrit, faisant l'objet d'un avenant spécifique."),

    H2("Article 8 — Durée et résiliation"),
    P("Le présent contrat est conclu pour une durée d'un an à compter de sa signature, renouvelable tacitement par périodes successives d'un an. Chaque partie peut le résilier à tout moment moyennant un préavis écrit de 30 jours, sans préjudice des voyages déjà programmés qui doivent être menés à terme."),

    H2("Article 9 — Confidentialité et protection des données"),
    P("Le PARTENAIRE s'engage à respecter strictement la confidentialité des données personnelles et professionnelles auxquelles il a accès dans le cadre de l'exécution du présent contrat, conformément au règlement (UE) 2016/679 (RGPD). Cette obligation perdure cinq ans après la cessation du contrat."),

    H2("Article 10 — Propriété intellectuelle"),
    P("Les programmes de voyage conçus par un créateur dans le cadre du présent contrat constituent une œuvre commune, dont les droits patrimoniaux sont co-titularisés par EVENTY et le créateur. EVENTY conserve un droit d'usage perpétuel sur les programmes pour la commercialisation. Le créateur conserve la mention de paternité (« voyage conçu par [nom] »)."),

    H2("Article 11 — Loi applicable et juridiction"),
    P("Le présent contrat est régi par le droit français. Tout litige relatif à son interprétation ou à son exécution sera soumis, à défaut d'accord amiable préalable, aux tribunaux compétents du ressort du siège social d'EVENTY."),

    H2("Article 12 — Acceptation"),
    P("Le PARTENAIRE déclare avoir lu et compris l'intégralité du présent contrat, dont il accepte sans réserve l'ensemble des clauses. Il reconnaît avoir reçu un exemplaire signé pour ses archives personnelles."),

    Spacer(120),
    P("Fait à [Ville], le [Date], en deux exemplaires originaux.", { italics: true, after: 200 }),

    new Table({
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
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour EVENTY LIFE SAS", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 360 }, children: [new TextRun({ text: "M. David Eventy, Président", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
            new TableCell({
              borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
              width: { size: 4680, type: WidthType.DXA },
              margins: { top: 100, bottom: 200, left: 120, right: 120 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour le PARTENAIRE", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 360 }, children: [new TextRun({ text: "[Nom Prénom du partenaire]", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
          ],
        }),
      ],
    }),

    Spacer(180),
    P("Annexes au présent contrat (à joindre au moment de la signature) :", { bold: true }),
    Bullet("Annexe 1 — Charte qualité du PARTENAIRE (créateur ou accompagnateur)"),
    Bullet("Annexe 2 — Coordonnées bancaires du PARTENAIRE et justificatif RIB"),
    Bullet("Annexe 3 — Justificatif d'immatriculation INSEE (Kbis ou attestation INSEE)"),
    Bullet("Annexe 4 — Attestation URSSAF de moins de 3 mois"),
    Bullet("Annexe 5 — Le cas échéant, contrat d'assurance civile vie privée du PARTENAIRE"),

    Spacer(160),
    P("Document de référence : voir Partie 1.4 et Annexe O du dossier complet de garantie financière pour la cohérence avec le modèle de marges et les obligations corrélatives.", { italics: true, color: COLOR.gray }),
  ];
}

// =====================================================================
// Génération des trois documents
// =====================================================================
async function generate() {
  const outputs = [
    {
      name: "docs/garanties/Eventy-Life-Checklist-Atout-France.docx",
      title: "Eventy Life — Checklist Atout France",
      description: "Checklist exhaustive des documents à fournir à Atout France pour l'immatriculation au registre des opérateurs de voyages et de séjours.",
      footer: "Eventy Life SAS — Checklist Atout France",
      children: checklistAtoutFrance(),
    },
    {
      name: "docs/garanties/Eventy-Life-Calendrier-J0-J90.docx",
      title: "Eventy Life — Calendrier prévisionnel J0 → J+90",
      description: "Calendrier détaillé des étapes administratives de la création d'Eventy Life à la première montée en charge.",
      footer: "Eventy Life SAS — Calendrier J0 → J+90",
      children: calendrierJ0J90(),
    },
    {
      name: "docs/garanties/Eventy-Life-Contrat-Type-Vendeur-Createur.docx",
      title: "Eventy Life — Contrat type vendeur / créateur",
      description: "Modèle de contrat-cadre cohérent avec le modèle de marges Eventy Life.",
      footer: "Eventy Life SAS — Contrat type vendeur / créateur",
      children: contratTypeVendeurCreateur(),
    },
  ];

  for (const out of outputs) {
    const doc = makeDoc({ title: out.title, description: out.description, footerLeft: out.footer, children: out.children });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(out.name, buffer);
    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`✓ ${path.basename(out.name)} (${sizeKB} KB)`);
  }
}

generate().catch((err) => {
  console.error("ERREUR :", err);
  process.exit(1);
});
