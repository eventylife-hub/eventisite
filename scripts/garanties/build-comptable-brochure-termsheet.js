/**
 * Eventy Life — Trois documents complémentaires
 *
 *   1. Note de référence pour l'expert-comptable (pendant à la note avocat)
 *   2. Brochure commerciale grand public voyageurs (B2C)
 *   3. Term sheet / Lettre d'intention investisseur (modèle type Seed)
 *
 * Usage : node scripts/garanties/build-comptable-brochure-termsheet.js
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
function bandeauTitre(title, sous, color = COLOR.orange) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 18, color },
              left: { style: BorderStyle.SINGLE, size: 18, color },
              bottom: { style: BorderStyle.SINGLE, size: 18, color },
              right: { style: BorderStyle.SINGLE, size: 18, color },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: COLOR.cream, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: title, size: 28, bold: true, color, font: "Calibri" })],
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

// ============================================================
// DOCUMENT 1 — NOTE EXPERT-COMPTABLE
// ============================================================
function noteExpertComptable() {
  return [
    bandeauTitre(
      "NOTE DE RÉFÉRENCE — EXPERT-COMPTABLE",
      "Synthèse des points comptables et fiscaux à valider · pendant à la note avocat tourisme",
      COLOR.green,
    ),
    Spacer(160),

    P("La présente note est rédigée à l'attention de l'expert-comptable spécialisé tourisme partenaire d'EVENTY LIFE SAS. Elle synthétise les enjeux comptables, fiscaux et sociaux du projet en vue du mandat d'expertise comptable annuel et de l'attestation comptable destinée à l'APST.", { italics: true }),

    P("Elle est complémentaire à la note de référence avocat tourisme (Eventy-Life-Note-Avocat-Tourisme.pdf) — l'avocat valide le juridique, l'expert-comptable valide le comptable et le fiscal. La double validation est attendue avant le dépôt officiel du dossier de garantie financière APST.", { italics: true }),

    H1("1. Cadre comptable applicable"),

    H2("1.1. Forme juridique et obligations"),
    Bullet("Société par Actions Simplifiée (SAS) au capital initial de 3 000 €, en cours de création."),
    Bullet("Activité : opérateur de voyages à forfait — code NAF 7912Z."),
    Bullet("Régime comptable : système comptable normal (sauf option pour le système simplifié si seuils respectés)."),
    Bullet("Référentiel : Plan Comptable Général applicable + spécificités tourisme (compte 658 sur frais d'organisation, etc.)."),
    Bullet("Exercice social : du 1er janvier au 31 décembre · premier exercice de moins de 12 mois prévu."),
    Bullet("Désignation Commissaire aux comptes obligatoire au franchissement de 2 des seuils suivants : total bilan 5 M€, CA HT 10 M€, effectif moyen 50."),

    H2("1.2. Spécificités tourisme à anticiper"),
    Bullet("Compte 467 « Acomptes voyageurs reçus » — fonds clients en transit, à provisionner à chaque clôture."),
    Bullet("Comptes de tiers spécifiques pour HRA, transporteurs, créateurs et vendeurs (créances et dettes croisées)."),
    Bullet("Engagements hors bilan : caution APST 10 K€, garantie financière implicite des fonds en transit."),
    Bullet("Comptabilité analytique par voyage recommandée — utile pour le contrôle de gestion et la reporting trimestriel APST."),

    H1("2. TVA — régime tourisme à valider"),

    H2("2.1. TVA marge tourisme"),
    P("Référence : article 266-1-e du Code Général des Impôts · BOI-TVA-SECT-60. Le régime de TVA marge s'applique aux agences de voyages et opérateurs de voyages à forfait pour les prestations de voyage achetées et revendues."),
    Bullet("Assiette taxable = marge bénéficiaire (CA voyage HT - prix d'achat des prestations refacturées)."),
    Bullet("Taux : 20 % standard."),
    Bullet("Pas de récupération de TVA sur les achats de prestations refacturées (sauf cas spécifiques)."),
    Bullet("Comptabilité distincte requise par voyage (registre TVA marge tourisme)."),

    H2("2.2. Mécanique de marge distribuée — point de vigilance"),
    P("Eventy applique un modèle distribué qui doit être correctement traité fiscalement :"),
    Bullet("Marge socle Eventy (≈ 8 % HRA refacturé) — entre dans l'assiette de TVA marge tourisme."),
    Bullet("Commission Vendeur (5 % HT) — facturée par les Vendeurs auto-entrepreneurs à Eventy en franchise de TVA si < seuil franchise (article 293 B CGI), ou en TVA standard si > seuil."),
    Bullet("Commission Créateur (3 % HRA) — même régime que la commission Vendeur (selon statut juridique du Créateur)."),
    Bullet("Forfait accompagnement — facturé par l'accompagnateur en TVA franchise ou TVA standard selon statut."),
    Bullet("Vigilance : éviter la double imposition entre la marge socle Eventy et les commissions versées."),

    H2("2.3. Questions ouvertes pour l'expert-comptable"),
    Numbered("Comment traiter la commission Vendeur de 5 % HT du CA voyage ? Charge externe pour Eventy (compte 622X) ou réduction de l'assiette de TVA marge ?"),
    Numbered("Comment traiter la commission Créateur de 3 % sur HRA ? Charge externe (compte 622X) ou cession partielle de la marge HRA ?"),
    Numbered("Quel rythme de déclaration TVA recommandé : mensuel ou trimestriel selon le CA ?"),
    Numbered("Faut-il opter pour le régime du réel normal ou du réel simplifié ?"),
    Numbered("Modalités de la TVA intracommunautaire pour les prestations achetées dans d'autres pays UE (Espagne, Portugal, Italie, etc.) ?"),
    Numbered("Quel traitement pour les voyageurs résidents hors UE ?"),

    H1("3. Impôt sur les sociétés — optimisation"),

    H2("3.1. Régime applicable"),
    Bullet("PME éligible au taux réduit IS 15 % sur les premiers 42 500 € de bénéfice (sous conditions de capital intégralement libéré et de détention par personnes physiques pour 75 % au moins)."),
    Bullet("Au-delà : taux IS standard 25 %."),
    Bullet("Acompte IS : trimestriel selon montant de l'IS de l'exercice précédent."),

    H2("3.2. Statut JEI — Jeune Entreprise Innovante"),
    P("Référence : article 44 sexies-0 A du CGI. Eventy peut viser le statut JEI dès le 1er exercice."),
    Bullet("Conditions cumulatives : PME < 8 ans · CA < 50 M€ · indépendance capitalistique · dépenses R&D ≥ 15 % des charges totales."),
    Bullet("Avantage IS : exonération totale d'IS sur le 1er exercice bénéficiaire, puis 50 % sur le 2nd."),
    Bullet("Avantage social : exonération de cotisations patronales sur les rémunérations chercheurs, techniciens R&D, gestionnaires de projet R&D, juristes industrie (jusqu'à 4,5 SMIC)."),
    Bullet("Avantage local : exonération possible CFE et taxe foncière (sur délibération communale)."),

    H2("3.3. Statut JEC — Jeune Entreprise de Croissance (introduit 2024)"),
    Bullet("Cible : PME en forte croissance (croissance > 100 % entre 2 exercices)."),
    Bullet("Avantages similaires JEI mais seuil R&D abaissé à 5 à 15 %."),
    Bullet("Eventy y prétend dès l'An 2 (croissance prévue +400 % : 16 M€ → 80 M€)."),

    H2("3.4. Crédits d'impôt"),
    H3("Crédit d'Impôt Recherche (CIR)"),
    Bullet("Référence : article 244 quater B CGI."),
    Bullet("Taux : 30 % des dépenses éligibles jusqu'à 100 M€."),
    Bullet("Restitution immédiate pour PME, JEI et JEC."),
    Bullet("Estimation Eventy An 1 : si dépenses R&D ≈ 250 K€ → CIR ≈ 75 K€."),
    H3("Crédit d'Impôt Innovation (CII)"),
    Bullet("Cible : PME au sens européen."),
    Bullet("Taux : 20 % des dépenses éligibles à compter de 2025 · plafond 400 K€ · CII max 80 K€/an."),
    Bullet("Estimation Eventy An 1 : ≈ 20 K€."),

    H2("3.5. Synthèse économie fiscale An 1 anticipée"),
    Encart({
      title: "ÉCONOMIE FISCALE PRÉVISIONNELLE EVENTY AN 1",
      color: COLOR.green,
      fill: COLOR.greenLt,
      lines: [
        { text: "Sous réserve d'éligibilité confirmée :", italics: true },
        { text: "JEI — Exonération IS : ≈ 107 K€ (100 % de l'IS sur résultat 322 K€)", align: AlignmentType.JUSTIFIED },
        { text: "JEI — Exonération cotisations patronales R&D : ≈ 30-40 K€", align: AlignmentType.JUSTIFIED },
        { text: "CIR sur dépenses R&D ≈ 250 K€ × 30 % = ≈ 75 K€", align: AlignmentType.JUSTIFIED },
        { text: "CII sur dépenses innovation ≈ 100 K€ × 20 % = ≈ 20 K€", align: AlignmentType.JUSTIFIED },
        { text: "TOTAL économie fiscale potentielle An 1 : ≈ 230 K€ à 250 K€", align: AlignmentType.CENTER, bold: true, size: 24, color: COLOR.green },
      ],
    }),

    H1("4. Charges sociales et rémunération du dirigeant"),

    H2("4.1. Statut social du Président SAS"),
    Bullet("Régime général de la sécurité sociale (assimilé salarié)."),
    Bullet("Cotisations sociales sur rémunération versée — pas de cotisation si pas de rémunération versée (mais option mutuelle obligatoire)."),
    Bullet("Pas d'allocations chômage."),

    H2("4.2. Politique de rémunération recommandée"),
    Bullet("Rémunération mensuelle plafonnée pendant l'An 1 (en cohérence avec démarrage et autofinancement)."),
    Bullet("Pas de dividendes tant que la réserve volontaire 5 % CA n'est pas constituée — clause statutaire (Article 13 des Statuts)."),
    Bullet("Pas de prime variable indexée sur les fonds clients en transit."),
    Bullet("Transparence intégrale envers l'APST : politique communiquée annuellement avec le bilan."),

    H1("5. Déclarations annuelles et reporting APST"),

    H2("5.1. Calendrier comptable et fiscal annuel"),
    makeTable({
      widths: [2000, 4500, 2860],
      header: ["Échéance", "Déclaration / Action", "Destinataire"],
      rows: [
        ["31 mars N+1", "Déclaration TVA marge annuelle (si option)", "DGFIP"],
        ["3 mai N+1", "Déclaration de résultat (formulaire 2065 + annexes)", "DGFIP"],
        ["15 mai N+1", "Paiement IS (solde + 1er acompte N+1)", "DGFIP"],
        ["30 avril N+1", "Comptes annuels validés et approuvés", "Associé unique / collectivité associés"],
        ["31 mai N+1", "Dépôt des comptes au greffe (BODACC)", "Greffe TC"],
        ["Trimestrielle", "Déclaration des fonds en transit + cotisation variable", "APST"],
        ["Annuelle (avec bilan)", "Attestation expert-comptable + comptes certifiés + politique rémunération dirigeant", "APST"],
      ],
    }),

    H2("5.2. Attestation comptable annuelle pour l'APST"),
    P("Conformément à l'engagement pris dans les statuts (article 13) et dans le dossier APST (Annexe N), l'expert-comptable établit annuellement une attestation reprenant :"),
    Bullet("La cohérence entre les comptes annuels et le prévisionnel ayant servi de base à l'octroi de la garantie financière."),
    Bullet("Le respect du ratio de marge brute, du résultat net, et de la trésorerie cumulée."),
    Bullet("La constitution effective de la réserve volontaire 5 % CA (engagement statutaire)."),
    Bullet("L'absence de difficulté de paiement caractérisée à la date de la présente attestation."),
    Bullet("L'engagement à informer l'APST sans délai de toute évolution significative."),

    H1("6. Mandat de l'expert-comptable — modalités"),

    H2("6.1. Périmètre de la mission proposée"),
    Bullet("Tenue de la comptabilité (saisie ou supervision selon volume)."),
    Bullet("Établissement des déclarations TVA mensuelles ou trimestrielles."),
    Bullet("Établissement de la déclaration annuelle de résultat (2065 + annexes)."),
    Bullet("Établissement des comptes annuels (bilan, compte de résultat, annexe)."),
    Bullet("Sécurisation du statut JEI / JEC + dossier CIR + CII."),
    Bullet("Attestation comptable annuelle pour l'APST."),
    Bullet("Conseil fiscal et social courant."),

    H2("6.2. Honoraires cibles"),
    Bullet("Estimation An 1 : 2 400 à 3 600 € HT/an (≈ 200 à 300 € HT/mois selon volume)."),
    Bullet("Tarification au temps passé OU au forfait selon préférence."),
    Bullet("Suppléments éventuels : montage CIR (300 à 500 € HT), rescrit JEI (500 à 800 € HT), audit interne (300 à 500 € HT)."),

    H2("6.3. Durée et résiliation"),
    Bullet("Mandat conclu pour une durée d'un an, renouvelable tacitement par périodes d'un an."),
    Bullet("Préavis de résiliation : 3 mois (côté Eventy) ou 6 mois (côté expert-comptable, en cas de cessation de la mission)."),

    Spacer(180),
    P("Contact direct : David Eventy — Président, Fondateur — eventylife@gmail.com — disponibilité 7j/7.", { bold: true, color: COLOR.blue, size: 22 }),
    Spacer(80),
    P("Document confidentiel — usage strictement réservé à l'expert-comptable spécialisé tourisme partenaire dans le cadre du mandat d'expertise comptable.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — BROCHURE COMMERCIALE GRAND PUBLIC
// ============================================================
function brochureCommerciale() {
  return [
    bandeauTitre(
      "EVENTY LIFE — VOYAGER ENSEMBLE",
      "La promesse Eventy en quatre questions",
    ),
    Spacer(160),

    Encart({
      title: "« On ne vend pas des voyages. On réunit des gens. »",
      color: COLOR.orange,
      fill: COLOR.cream,
      lines: [
        { text: "Bienvenue chez Eventy Life. Nous organisons des voyages de groupe en autocar et en avion à destination de la France et de l'Europe. Notre métier, c'est de réunir 38 personnes inconnues le matin du départ et de leur faire vivre, en quatre jours, quelque chose qu'elles n'auraient pas vécu seules.", align: AlignmentType.CENTER, italics: true, size: 22 },
      ],
    }),
    Spacer(160),

    H1("Pourquoi Eventy ?"),
    P("Parce que voyager seul coûte cher. Parce que voyager en groupe peut être inconfortable. Parce que la plupart des agences vendent des voyages en passant à côté de l'essentiel : la rencontre, l'humain, la chaleur partagée.", { size: 22 }),
    P("Eventy propose une troisième voie. Des voyages de groupe organisés où vous n'avez rien à gérer — et tout à vivre.", { size: 22 }),

    H1("Comment ça marche, concrètement ?"),
    H2("1. Vous choisissez votre voyage"),
    P("Sur eventylife.fr, vous découvrez nos voyages avec, pour chacun : la destination, les dates, le programme jour par jour, l'hôtel, les repas inclus, les activités proposées et le prix. Tout est compris dans le prix affiché. Aucune surcharge cachée. Vous voyez aussi, en toute transparence, comment se décompose le prix que vous payez."),

    H2("2. Vous réservez en ligne"),
    P("Une réservation en ligne, sécurisée par Stripe (carte bancaire 3D Secure, Apple Pay, Google Pay). Vous versez 30 % d'acompte au moment de la réservation. Le solde est dû 30 jours avant le départ. Vous recevez une confirmation immédiate et un accès à votre espace voyageur personnel."),

    H2("3. Vous partez l'esprit léger"),
    P("Le jour du départ, un accompagnateur Eventy vous attend au point de ramassage. Il sera avec vous du premier au dernier kilomètre. Pendant tout le voyage, une ligne d'urgence 24h/24, 7j/7 est joignable. Le Pack Sérénité (assurance annulation, rapatriement médical, frais médicaux à l'étranger, bagages) est INCLUS dans votre prix."),

    H2("4. Vous racontez"),
    P("Au retour, vous repartez avec un groupe WhatsApp, des photos partagées, et l'envie de remettre ça avec un autre voyage. Vous pouvez aussi devenir Ambassadeur Eventy : 5 % de commission sur chaque inscription que vous placez auprès de vos proches. Sans pression — juste si l'envie vous prend de partager."),

    H1("Ce qui rend Eventy différent"),
    makeTable({
      widths: [4680, 4680],
      header: ["Les autres", "Eventy Life"],
      rows: [
        ["L'assurance est en option, payante, complexe", "Pack Sérénité INCLUS, gratuit, simple"],
        ["Un seul payeur gère la cagnotte du groupe", "Chaque voyageur paie sa part en ligne"],
        ["Vous organisez tout seul", "Un humain vous accompagne de A à Z"],
        ["Groupes de 15-20 personnes max", "Bus complet de 53 — prix imbattable"],
        ["Marge agence opaque", "Décomposition publique du prix sur chaque fiche"],
        ["Voyageur = volume à transformer", "Voyageur = personne à accueillir, à appeler par son prénom"],
      ],
    }),

    H1("Vos garanties"),
    Bullet("Eventy Life est immatriculée Atout France au registre des opérateurs de voyages et de séjours (numéro IM ###-###-###)."),
    Bullet("La garantie financière de l'APST (Association Professionnelle de Solidarité du Tourisme) couvre vos paiements et votre rapatriement en cas de défaillance."),
    Bullet("Une assurance Responsabilité Civile Professionnelle Tourisme avec un plafond de 1,5 M€ par sinistre."),
    Bullet("La Médiation Tourisme et Voyage (MTV) est gratuite en cas de litige non résolu."),
    Bullet("Vos données personnelles sont hébergées en France et protégées par le RGPD."),

    H1("La transparence prix"),
    P("Sur chaque fiche voyage, vous trouvez la décomposition simplifiée du prix. Sur 100 € que vous payez :"),
    Bullet("≈ 35 € reviennent aux hôteliers."),
    Bullet("≈ 17 € reviennent aux restaurants locaux."),
    Bullet("≈ 7 € rémunèrent les guides et activités."),
    Bullet("≈ 23 € reviennent à l'autocariste français et ses chauffeurs."),
    Bullet("≈ 5 € rémunèrent le vendeur indépendant français qui a placé votre voyage."),
    Bullet("≈ 2 € rémunèrent le créateur indépendant qui a conçu le voyage."),
    Bullet("≈ 4,5 € paient l'assurance Pack Sérénité et les taxes locales."),
    Bullet("≈ 6,5 € reviennent à Eventy Life pour les charges et l'investissement plateforme."),
    P("Aucun euro ne transite par une plateforme extra-européenne. La valeur reste dans l'écosystème français et européen.", { bold: true, size: 22, color: COLOR.orange }),

    H1("Quelques destinations populaires"),
    makeTable({
      widths: [3000, 1500, 4860],
      header: ["Destination", "Prix TTC", "Format"],
      rows: [
        ["Lisbonne, weekend", "599 €", "4 jours / 3 nuits — autocar ou vol"],
        ["Marrakech, sourire des médinas", "749 €", "5 jours — vol charter ou groupe"],
        ["Barcelone, Costa Brava", "549 €", "5 jours — autocar"],
        ["Pays-Bas, tulipes féeriques", "679 €", "4 jours — autocar"],
        ["Prague la magnifique", "729 €", "4 jours — vol"],
        ["Bruxelles, Bruges, Gand", "399 €", "3 jours — autocar"],
        ["Andalousie blanche", "899 €", "6 jours — vol + autocar local"],
        ["Toscane gourmande", "849 €", "5 jours — vol + autocar local"],
      ],
    }),
    P("Catalogue complet (24 voyages sur 12 destinations) sur eventylife.fr.", { italics: true }),

    H1("Comment réserver ?"),
    Numbered("Visitez eventylife.fr et choisissez votre voyage."),
    Numbered("Lisez la fiche détaillée et la décomposition du prix."),
    Numbered("Cliquez sur « Réserver » et créez votre compte voyageur."),
    Numbered("Versez l'acompte de 30 % par carte bancaire."),
    Numbered("Recevez votre confirmation et préparez vos valises."),
    Numbered("Partez l'esprit léger — on s'occupe de tout."),

    Spacer(180),
    Encart({
      title: "PRÊT À VOYAGER AVEC NOUS ?",
      color: COLOR.blue,
      fill: COLOR.blueLt,
      lines: [
        { text: "Rendez-vous sur eventylife.fr", align: AlignmentType.CENTER, bold: true, size: 28, color: COLOR.orange },
        { text: "Pour toute question : eventylife@gmail.com", align: AlignmentType.CENTER, size: 22 },
        { text: "Ligne d'urgence 24/7 disponible pendant votre voyage.", align: AlignmentType.CENTER, italics: true, size: 18 },
        { text: "Eventy Life — Le voyage de groupe où tu n'as rien à gérer, tout à vivre.", align: AlignmentType.CENTER, italics: true, size: 20, color: COLOR.blue },
      ],
    }),
  ];
}

// ============================================================
// DOCUMENT 3 — TERM SHEET / LETTRE D'INTENTION INVESTISSEUR
// ============================================================
function termSheet() {
  return [
    bandeauTitre(
      "TERM SHEET — TOUR SEED",
      "Lettre d'intention d'investissement · modèle type · non engageante hors mention contraire",
      COLOR.blue,
    ),
    Spacer(160),

    P("La présente lettre d'intention (« Term Sheet ») expose les principaux termes et conditions de l'investissement envisagé par les Investisseurs Seed (ci-après « les Investisseurs ») dans la société EVENTY LIFE SAS (ci-après « la Société »). Elle a vocation à servir de base à la rédaction des documents définitifs (pacte d'associés, contrat de souscription, statuts mis à jour) et à encadrer la phase de due diligence préalable au closing.", { italics: true }),

    P("Sauf mentions expressément qualifiées d'engageantes (clauses 9, 10 et 11 — exclusivité, confidentialité, frais), la présente Term Sheet n'a pas valeur d'engagement contractuel. Les engagements définitifs résulteront de la documentation finale signée à l'issue de la due diligence.", { italics: true, color: COLOR.gray }),

    H1("1. Société et Fondateur"),
    makeTable({
      widths: [3000, 6360],
      header: ["Élément", "Information"],
      rows: [
        ["Dénomination", "EVENTY LIFE SAS (en cours de création / récemment immatriculée)"],
        ["Siège social", "[Adresse à compléter à l'immatriculation]"],
        ["Forme juridique", "Société par Actions Simplifiée"],
        ["Capital social actuel", "3 000 € (intégralement libéré)"],
        ["Activité", "Opérateur de voyages à forfait (NAF 7912Z) — IM Atout France [###-###-###]"],
        ["Fondateur, Président", "M. David Eventy"],
        ["Engagement Fondateur", "Plein temps · contre-garantie personnelle 10 K€ APST"],
      ],
    }),

    H1("2. Investissement projeté"),
    makeTable({
      widths: [3500, 5860],
      header: ["Paramètre", "Valeur cible"],
      rows: [
        ["Montant total levé", "200 000 € à 300 000 €"],
        ["Valorisation pré-money", "5 000 000 € (fourchette 4 à 6 M€ selon traction)"],
        ["Valorisation post-money", "5 200 000 € à 5 300 000 €"],
        ["Dilution Fondateur", "4 % à 6 %"],
        ["Forme d'investissement", "Augmentation de capital classique OU BSA-AIR (à arbitrer)"],
        ["Type d'actions", "Actions ordinaires (avec droits préférentiels limités)"],
        ["Calendrier cible closing", "T2-T3 An 2026"],
      ],
    }),

    H1("3. Utilisation des fonds"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Montant cible", "% de la levée"],
      rows: [
        ["Recrutement Resp. opérations + CTO délégué (M2-M3)", "100 K€", "≈ 35-50 %"],
        ["Marketing acquisition (campagnes lancement public)", "60 K€", "≈ 20-30 %"],
        ["Frais juridiques (avocat tourisme + propriété intellectuelle)", "20 K€", "≈ 7-10 %"],
        ["Renforcement contre-garantie APST si volume > prévu", "30 K€", "≈ 10-15 %"],
        ["Trésorerie de sécurité opérationnelle", "40 K€", "≈ 13-20 %"],
        ["TOTAL", "200-300 K€", "100 %"],
      ],
    }),

    H1("4. Gouvernance"),
    Bullet("Le Fondateur conserve la présidence de la Société et le contrôle des décisions opérationnelles courantes."),
    Bullet("Constitution d'un comité d'investissement informel trimestriel ouvert aux Investisseurs représentant ensemble au moins 5 % du capital. Visioconférence acceptée."),
    Bullet("Droit d'information renforcé pour les Investisseurs : reporting trimestriel financier et opérationnel ; accès aux comptes annuels et aux principaux indicateurs (CA, marge brute, voyageurs, trésorerie, ETP, NPS)."),
    Bullet("Aucun siège d'administrateur n'est attribué de droit aux Investisseurs Seed (gouvernance simplifiée à ce stade)."),
    Bullet("Désignation d'un Commissaire aux comptes facultatif possible sur demande des Investisseurs représentant ensemble au moins 10 % du capital."),

    H1("5. Décisions soumises à droit de veto"),
    P("Sans préjudice des compétences du Président, les décisions suivantes ne peuvent être prises sans l'accord préalable des Investisseurs Seed représentant au moins 50 % du capital détenu par eux :"),
    Bullet("Modification de l'objet social ou cessation d'une branche significative d'activité."),
    Bullet("Émission de toute valeur mobilière donnant accès au capital."),
    Bullet("Cession d'actifs significatifs (> 25 % du total bilan)."),
    Bullet("Endettement bancaire significatif (> 500 K€ ou > 10 % du CA prévisionnel annuel)."),
    Bullet("Changement de Président ou de Directeur Général."),
    Bullet("Distribution exceptionnelle de dividendes."),
    Bullet("Toute opération de restructuration, fusion, scission, dissolution."),

    H1("6. Droits des Investisseurs"),
    H2("6.1. Anti-dilution"),
    P("En cas d'augmentation de capital ultérieure (Série A ou suivantes) à un prix par action inférieur au prix de souscription du tour Seed, les Investisseurs bénéficient d'un mécanisme d'anti-dilution dit « weighted average broad-based » permettant de réajuster leur participation."),

    H2("6.2. Liquidation préférence"),
    P("En cas d'opération de liquidation, vente, fusion, ou tout événement assimilé entraînant une distribution aux associés, les Investisseurs Seed bénéficient d'une préférence de liquidation égale à une (1) fois leur investissement, en non-participating (« 1× non-participating »). Au-delà, le solde est réparti au prorata de la participation au capital."),

    H2("6.3. Droits de cession"),
    Bullet("Droit de préemption proportionnel sur toute cession d'actions par un autre associé · délai 30 jours."),
    Bullet("Tag-along (sortie conjointe) : si le Fondateur cède plus de 25 % de ses actions à un tiers, les Investisseurs peuvent céder leurs propres actions au même tiers, aux mêmes conditions."),
    Bullet("Drag-along (entraînement) : en cas d'offre tierce de bonne foi portant sur 100 % du capital à un prix au moins égal à 5× la valorisation post-money Seed, les associés détenant > 75 % du capital peuvent contraindre les minoritaires à céder."),

    H1("7. Engagements du Fondateur"),
    Bullet("Engagement de plein temps : consacrer la totalité de son temps professionnel à la Société (sauf activité accessoire mineure préalablement notifiée et acceptée)."),
    Bullet("Inaliénabilité : ne pas céder tout ou partie de ses actions pendant 36 mois minimum à compter de la signature du pacte, sauf accord exprès des Investisseurs représentant ≥ 75 % du capital qu'ils détiennent."),
    Bullet("Non-concurrence : pas d'activité concurrente pendant la durée du pacte et 12 mois après cessation des fonctions."),
    Bullet("Maintien permanent de la garantie financière APST et de la RC Pro Tourisme."),
    Bullet("Maintien de la réserve volontaire 5 % CA conformément à l'article 13 des statuts."),

    H1("8. Due diligence"),
    P("L'investissement est conditionné à la réalisation, à la satisfaction des Investisseurs, d'une due diligence financière, juridique, fiscale et opérationnelle de la Société. La due diligence portera notamment sur :"),
    Bullet("Conformité réglementaire (Atout France, APST, RC Pro, RGPD)."),
    Bullet("Plateforme technique (audit code, architecture, sécurité)."),
    Bullet("Comptes prévisionnels et hypothèses sous-jacentes."),
    Bullet("Statut juridique des partenaires (créateurs, vendeurs, HRA)."),
    Bullet("Risques identifiés et plan de continuité."),
    P("La due diligence sera conduite par les conseils des Investisseurs (avocat, expert-comptable) avec le concours du Fondateur. Durée estimée : 4 à 6 semaines."),

    H1("9. Exclusivité (clause engageante)"),
    P("Le Fondateur s'engage, à compter de la signature de la présente Term Sheet et pour une durée de soixante (60) jours calendaires, à ne pas négocier ou conclure avec un tiers tout investissement, levée de fonds, cession d'actions ou opération assimilée susceptible de remettre en cause l'opération projetée, sauf accord exprès et écrit des Investisseurs."),

    H1("10. Confidentialité (clause engageante)"),
    P("Les Parties s'engagent à respecter la stricte confidentialité des informations échangées dans le cadre de la présente négociation et de la due diligence. Cette obligation perdure deux (2) ans à compter de la signature de la Term Sheet, qu'un closing intervienne ou non."),

    H1("11. Frais (clause engageante)"),
    Bullet("Chaque Partie supporte ses propres frais de conseil (avocat, expert-comptable, etc.)."),
    Bullet("En cas de closing effectif, la Société remboursera aux Investisseurs Seed leurs frais de due diligence dans la limite globale de 10 K€ (vingt mille euros)."),
    Bullet("En cas de non-closing imputable au Fondateur (rupture unilatérale, manquement à l'exclusivité), la Société remboursera aux Investisseurs leurs frais effectifs dans la limite globale de 5 K€."),

    H1("12. Calendrier indicatif"),
    makeTable({
      widths: [2500, 4500, 2360],
      header: ["Étape", "Action", "Délai indicatif"],
      rows: [
        ["J0", "Signature de la Term Sheet", "T0"],
        ["J + 7", "Mise à disposition de la data room", "Semaine 1"],
        ["J + 7 à J + 35", "Due diligence", "Semaines 1 à 5"],
        ["J + 35 à J + 50", "Rédaction documentation finale", "Semaines 5 à 7"],
        ["J + 50 à J + 60", "Closing : signature + virement", "Semaine 8-9"],
      ],
    }),

    H1("13. Acceptation"),
    P("La présente Term Sheet est valable jusqu'à la date du [date à compléter]. Au-delà, elle est réputée caduque sauf renouvellement exprès. La signature de la Term Sheet par le Fondateur et chacun des Investisseurs vaut acceptation des termes ci-dessus, étant rappelé que seules les clauses 9, 10 et 11 sont engageantes."),

    Spacer(200),
    P("Fait à [Ville], le [Date], en autant d'originaux que de Parties.", { italics: true, after: 200 }),
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
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour la Société et le Fondateur", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "M. David Eventy, Président", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + date)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
            new TableCell({
              borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
              width: { size: 4680, type: WidthType.DXA },
              margins: { top: 100, bottom: 200, left: 120, right: 120 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour les Investisseurs Seed", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "[Nom Prénom + qualité]", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + date + cachet)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
          ],
        }),
      ],
    }),

    Spacer(160),
    P("Modèle TYPE — à finaliser avec un avocat spécialisé en capital-risque avant signature. Les clauses précises (taux d'intérêt sur BSA-AIR, ratchet, vesting éventuel, options pool) sont à compléter au moment de la levée effective.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Document de référence : voir Eventy-Life-Pacte-Associes-Seed.pdf pour la déclinaison complète des clauses post-closing.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Note-Expert-Comptable.docx",
      title: "Eventy Life — Note de référence expert-comptable",
      description: "Synthèse des points comptables et fiscaux à valider avec l'expert-comptable spécialisé tourisme.",
      footer: "EVENTY LIFE SAS — Note expert-comptable · Confidentiel",
      children: noteExpertComptable(),
    },
    {
      file: "docs/garanties/Eventy-Life-Brochure-Commerciale.docx",
      title: "Eventy Life — Brochure commerciale grand public",
      description: "Présentation de la marque Eventy Life pour les voyageurs B2C.",
      footer: "EVENTY LIFE SAS — Brochure commerciale",
      children: brochureCommerciale(),
    },
    {
      file: "docs/garanties/Eventy-Life-Term-Sheet-Seed.docx",
      title: "Eventy Life — Term Sheet Seed (lettre d'intention investisseur)",
      description: "Modèle de Term Sheet pour la levée de fonds Seed Eventy Life.",
      footer: "EVENTY LIFE SAS — Term Sheet Seed · Confidentiel",
      children: termSheet(),
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
