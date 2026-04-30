/**
 * Eventy Life — Trois contrats types séparés et cohérents
 *
 * 1. Contrat Vendeur Eventy        (5 % HT du CA voyage placé)
 * 2. Contrat Créateur Eventy       (marge HRA + 3 points sur HRA refacturé)
 * 3. Contrat HRA Partenaire Eventy (tarif négocié, marge socle Eventy 8 % sur HRA refacturé)
 *
 * Chaque contrat est un document autonome, prêt à signer après personnalisation.
 *
 * Usage : node scripts/garanties/build-contrats-types.js
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
function blocSignature(roleEventy, rolePartenaire) {
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
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour EVENTY LIFE SAS", bold: true, size: 20, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: roleEventy, size: 18, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + date + cachet)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
            ],
          }),
          new TableCell({
            borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
            width: { size: 4680, type: WidthType.DXA },
            margins: { top: 100, bottom: 200, left: 120, right: 120 },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: rolePartenaire, bold: true, size: 20, font: "Calibri" })] }),
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
// CONTRAT 1 — VENDEUR EVENTY (5 % HT du CA voyage placé)
// ============================================================
function contratVendeur() {
  return [
    bandeauTitre("CONTRAT VENDEUR EVENTY", "Commission de 5 % HT du CA voyage placé"),
    Spacer(160),

    P("ENTRE LES SOUSSIGNÉS :", { bold: true, size: 20 }),
    P("D'une part, EVENTY LIFE SAS au capital de [montant] €, dont le siège social est sis [adresse], immatriculée au RCS de [ville] sous le numéro [SIREN], immatriculée au registre des opérateurs de voyages et de séjours d'Atout France sous le numéro IM [###-###-###], représentée par M. David Eventy, Président, ci-après dénommée « EVENTY » ;"),
    P("D'autre part, [Nom Prénom], demeurant [adresse], auto-entrepreneur ou société immatriculée au répertoire SIRENE sous le numéro [SIRET], ci-après dénommé(e) « le VENDEUR » ;"),
    P("Il a été préalablement exposé ce qui suit. EVENTY est un opérateur de voyages à forfait au sens des articles L211-1 et suivants du Code du Tourisme. Le VENDEUR souhaite contribuer à la commercialisation des voyages organisés par EVENTY, en plaçant des inscriptions auprès de voyageurs, contre rémunération forfaitaire. Les parties sont indépendantes l'une de l'autre. Aucun lien de subordination juridique caractérisant un contrat de travail n'existe ni n'existera entre elles. Sur ces bases, il a été convenu ce qui suit."),

    H2("Article 1 — Objet"),
    P("Le présent contrat a pour objet de définir les conditions selon lesquelles le VENDEUR place, pour le compte d'EVENTY, des inscriptions à des voyages à forfait organisés par EVENTY auprès de voyageurs identifiés. Le VENDEUR n'a aucune qualité d'opérateur de voyages, d'organisateur ou d'intermédiaire au sens du Code du Tourisme. Toute inscription est conclue par EVENTY directement avec le voyageur, sur la base des Conditions Générales de Vente d'EVENTY."),

    H2("Article 2 — Obligations du VENDEUR"),
    Bullet("Maintenir à jour son immatriculation au répertoire SIRENE et l'ensemble de ses obligations sociales et fiscales (URSSAF, déclarations TVA si applicable, etc.)."),
    Bullet("Respecter scrupuleusement les obligations d'information précontractuelle envers le voyageur, sous le contrôle d'EVENTY (formulaire d'information standardisé issu de l'arrêté du 1er mars 2018, programmes types, prix tout compris)."),
    Bullet("Communiquer aux voyageurs uniquement les informations approuvées par EVENTY (descriptifs, photographies, prix, dates) et n'apporter aucune modification, promesse ou réduction non autorisée."),
    Bullet("Respecter strictement la confidentialité des données personnelles des voyageurs, conformément au règlement (UE) 2016/679 (RGPD)."),
    Bullet("Mentionner EVENTY comme opérateur officiel sur tout support de promotion utilisé (numéro IM Atout France, garant APST)."),
    Bullet("Ne pas se prévaloir d'une qualité d'opérateur de voyages ni laisser entendre une telle qualité à un tiers."),

    H2("Article 3 — Obligations d'EVENTY"),
    Bullet("Mettre à disposition du VENDEUR la plateforme technique permettant le placement et le suivi des inscriptions (espace pro, catalogue, génération automatique des contrats voyageurs)."),
    Bullet("Souscrire et maintenir en vigueur la garantie financière APST et l'assurance RC Pro Tourisme couvrant l'intégralité des voyages commercialisés."),
    Bullet("Verser au VENDEUR les commissions contractuelles dans les délais convenus (Article 4)."),
    Bullet("Fournir au VENDEUR la documentation commerciale, les fiches voyage, les programmes-types et toute mise à jour utile à son activité."),
    Bullet("Assumer la responsabilité de plein droit envers le voyageur pour la bonne exécution de l'ensemble des prestations prévues au contrat de voyage."),

    H2("Article 4 — Rémunération du VENDEUR"),
    P("Le VENDEUR perçoit, pour chaque inscription effectivement placée et menée à bonne fin, une commission de :", { bold: true }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
      children: [new TextRun({ text: "5 % HT du chiffre d'affaires voyage placé", size: 28, bold: true, color: COLOR.orange, font: "Calibri" })],
    }),
    P("Cette commission s'applique sur le montant hors taxes du voyage, calculé sur l'assiette de TVA marge tourisme (article 266-1-e du Code Général des Impôts), correspondant au prix payé par le voyageur diminué de la TVA marge le cas échéant."),

    H2("Article 5 — Modalités de paiement"),
    Bullet("Les commissions sont décomptées par EVENTY à l'issue de chaque voyage livré et acceptées par le VENDEUR via son espace pro."),
    Bullet("Le décompte mensuel est mis à disposition du VENDEUR au plus tard le 5 du mois suivant la livraison des voyages."),
    Bullet("Le paiement est effectué par virement bancaire sur le compte renseigné en annexe, dans un délai de 21 jours à compter de la livraison du voyage et de l'établissement du décompte."),
    Bullet("Le VENDEUR émet une facture à l'attention d'EVENTY conformément à ses obligations fiscales (mention « TVA non applicable, art. 293 B du CGI » pour les auto-entrepreneurs en franchise de TVA)."),
    Bullet("En cas d'annulation du voyage par EVENTY (seuil minimum non atteint, force majeure), aucune commission n'est due, l'ensemble des fonds étant restitué aux voyageurs."),
    Bullet("En cas de désistement du voyageur, le sort de la commission suit la règle suivante : si le voyageur est intégralement remboursé, la commission n'est pas due ; si le voyageur a versé des frais de résolution conservés par EVENTY, la commission est calculée au prorata des sommes effectivement conservées."),

    H2("Article 6 — Cumul possible avec d'autres rôles"),
    P("Le VENDEUR peut, par avenant écrit, cumuler la qualité de vendeur avec celle de créateur de voyage Eventy (commission additionnelle de 3 points sur HRA refacturé) ou avec celle de partenaire HRA (tarif négocié distinct). Tout cumul fait l'objet d'un avenant spécifique précisant les droits et obligations de chaque qualité."),

    H2("Article 7 — Indépendance et non-exclusivité"),
    P("Le VENDEUR conserve sa pleine indépendance économique et juridique. Il est libre de collaborer simultanément avec d'autres opérateurs de voyages, sous réserve de ne pas porter atteinte à la réputation, aux intérêts commerciaux ou aux secrets d'affaires d'EVENTY. Aucune clause d'exclusivité ne s'applique au présent contrat sauf accord exprès, écrit et explicitement rémunéré, formalisé par avenant."),

    H2("Article 8 — Engagements de qualité et sanctions"),
    P("Tout manquement avéré aux obligations contractuelles peut entraîner, après mise en demeure adressée au VENDEUR par lettre recommandée avec accusé de réception et restée sans effet pendant un délai de quinze (15) jours :"),
    Bullet("Suspension temporaire du compte VENDEUR sur la plateforme."),
    Bullet("Déréférencement définitif en cas de récidive ou de manquement grave."),
    Bullet("Retenue ou répétition des commissions perçues en cas de fraude avérée (fausse identité voyageur, double-vente, etc.)."),
    Bullet("Le cas échéant, action en dommages-intérêts."),

    H2("Article 9 — Confidentialité et protection des données"),
    P("Le VENDEUR s'engage à respecter strictement la confidentialité des données personnelles des voyageurs et de toute information professionnelle à laquelle il a accès dans le cadre du présent contrat, conformément au règlement (UE) 2016/679 (RGPD). Cette obligation perdure cinq (5) ans après la cessation du présent contrat. EVENTY est responsable de traitement ; le VENDEUR est sous-traitant au sens de l'article 28 du RGPD."),

    H2("Article 10 — Durée et résiliation"),
    P("Le présent contrat est conclu pour une durée d'un (1) an à compter de sa signature, renouvelable tacitement par périodes successives d'un an. Chaque partie peut le résilier à tout moment, sans motif, moyennant un préavis écrit de trente (30) jours notifié par lettre recommandée avec accusé de réception ou par email avec accusé de réception électronique. La résiliation ne porte pas atteinte aux voyages déjà placés et confirmés ; les commissions correspondantes restent dues jusqu'à leur livraison effective."),

    H2("Article 11 — Loi applicable et juridiction"),
    P("Le présent contrat est soumis au droit français. Tout litige relatif à son interprétation ou à son exécution sera soumis, à défaut d'accord amiable préalable, aux tribunaux compétents du ressort du siège social d'EVENTY."),

    H2("Article 12 — Acceptation"),
    P("Le VENDEUR déclare avoir pris connaissance et accepté sans réserve l'ensemble des stipulations du présent contrat. Il reconnaît avoir reçu un exemplaire signé pour ses archives."),

    Spacer(140),
    P("Fait à [Ville], le [Date], en deux exemplaires originaux dont un pour chaque partie.", { italics: true, after: 200 }),
    blocSignature("M. David Eventy, Président", "Le VENDEUR"),

    Spacer(180),
    P("Annexes au présent contrat (à joindre au moment de la signature) :", { bold: true }),
    Bullet("Annexe 1 — RIB du compte bancaire professionnel du VENDEUR"),
    Bullet("Annexe 2 — Justificatif d'immatriculation INSEE (Kbis ou attestation INSEE)"),
    Bullet("Annexe 3 — Attestation URSSAF de moins de 3 mois"),
    Bullet("Annexe 4 — Carte d'identité ou passeport du VENDEUR (recto/verso)"),
  ];
}

// ============================================================
// CONTRAT 2 — CRÉATEUR EVENTY (marge HRA + 3 % sur HRA refacturé)
// ============================================================
function contratCreateur() {
  return [
    bandeauTitre("CONTRAT CRÉATEUR EVENTY", "Marge HRA + 3 points sur HRA refacturé"),
    Spacer(160),

    P("ENTRE LES SOUSSIGNÉS :", { bold: true, size: 20 }),
    P("D'une part, EVENTY LIFE SAS au capital de [montant] €, dont le siège social est sis [adresse], immatriculée au RCS de [ville] sous le numéro [SIREN], immatriculée au registre des opérateurs de voyages et de séjours d'Atout France sous le numéro IM [###-###-###], représentée par M. David Eventy, Président, ci-après dénommée « EVENTY » ;"),
    P("D'autre part, [Nom Prénom], demeurant [adresse], auto-entrepreneur ou société immatriculée au répertoire SIRENE sous le numéro [SIRET], ci-après dénommé(e) « le CRÉATEUR » ;"),
    P("Il a été préalablement exposé ce qui suit. EVENTY est un opérateur de voyages à forfait au sens des articles L211-1 et suivants du Code du Tourisme. Le CRÉATEUR souhaite intervenir au profit d'EVENTY en qualité de concepteur de voyages : itinéraires, programmes, sélection des partenaires, animation et accompagnement éventuel. Les parties sont indépendantes l'une de l'autre. Aucun lien de subordination juridique caractérisant un contrat de travail n'existe ni n'existera entre elles. Sur ces bases, il a été convenu ce qui suit."),

    H2("Article 1 — Objet"),
    P("Le présent contrat a pour objet de définir les conditions selon lesquelles le CRÉATEUR conçoit, programme et, le cas échéant, accompagne des voyages à forfait organisés et commercialisés par EVENTY. Le CRÉATEUR n'a aucune qualité d'opérateur de voyages au sens du Code du Tourisme. Tout contrat de voyage est conclu entre EVENTY et le voyageur, EVENTY assumant la responsabilité de plein droit prévue à l'article L211-16 du Code du Tourisme."),

    H2("Article 2 — Obligations du CRÉATEUR"),
    Bullet("Concevoir des programmes de voyage cohérents avec la charte qualité Eventy et les standards de la marque (durée, public, prix, sécurité)."),
    Bullet("Sélectionner les partenaires HRA (hôtels, restaurants, activités) en respectant les critères Eventy : qualité, sécurité, hygiène, capacité d'accueil 38 voyageurs, conformité fiscale et sociale."),
    Bullet("Soumettre chaque programme à validation préalable d'EVENTY avant toute commercialisation."),
    Bullet("Tenir à jour le programme face aux évolutions des partenaires terrain et signaler à EVENTY toute défaillance ou évolution majeure."),
    Bullet("Si désigné accompagnateur du voyage : être présent en continu du début à la fin du séjour, respecter strictement la charte qualité accompagnateur (formation premiers secours valide, casier judiciaire B3 vierge, langues utiles à la destination), être joignable 24/7 par les voyageurs et par la ligne d'urgence d'EVENTY."),
    Bullet("Respecter scrupuleusement la confidentialité des données personnelles des voyageurs et des partenaires (RGPD)."),
    Bullet("Maintenir à jour son immatriculation au répertoire SIRENE et l'ensemble de ses obligations sociales et fiscales."),

    H2("Article 3 — Obligations d'EVENTY"),
    Bullet("Mettre à disposition du CRÉATEUR la plateforme technique de conception et de gestion (catalogue partenaires, outils de programmation, génération du contrat voyageur)."),
    Bullet("Souscrire et maintenir en vigueur la garantie financière APST et la RC Pro Tourisme couvrant l'intégralité des voyages."),
    Bullet("Former le CRÉATEUR à l'utilisation de la plateforme et au manuel d'incident Eventy."),
    Bullet("Verser les rémunérations contractuelles dans les délais convenus (Article 4)."),
    Bullet("Assumer la responsabilité de plein droit envers les voyageurs."),

    H2("Article 4 — Rémunération du CRÉATEUR"),
    P("Le CRÉATEUR perçoit, pour chaque voyage qu'il a conçu et qui est effectivement livré aux voyageurs, les rémunérations suivantes :", { bold: true }),
    makeTable({
      widths: [4680, 4680],
      header: ["Composante", "Montant"],
      rows: [
        ["Commission Créateur — sur HRA refacturé", "3 % (trois pour cent) sur le total des prestations HRA refacturées au voyageur dans le voyage concerné"],
        ["Commission Vendeur — si le CRÉATEUR a placé tout ou partie des inscriptions", "5 % HT du chiffre d'affaires voyage placé (cumulable avec la commission Créateur)"],
        ["Forfait d'accompagnement — si désigné accompagnateur", "Forfait par voyage selon barème Eventy (≈ 600 à 800 € pour un voyage de 4-5 jours)"],
      ],
    }),
    P("Précisions de calcul :"),
    Bullet("La commission Créateur (3 %) s'applique sur le total HRA refacturé au voyageur dans le voyage concerné — c'est-à-dire le montant total payé par les voyageurs pour les prestations Hôtel + Restaurants + Activités dans le voyage."),
    Bullet("La commission Vendeur (5 % HT) s'applique sur le chiffre d'affaires hors taxes total du voyage placé."),
    Bullet("Les commissions Créateur et Vendeur sont cumulables : un CRÉATEUR qui vend lui-même son voyage à un voyageur perçoit la somme des deux commissions sur la part vendue."),
    Bullet("Le forfait d'accompagnement est dû si et seulement si le CRÉATEUR est officiellement désigné accompagnateur du voyage par EVENTY, sur la base d'une lettre de mission spécifique."),

    H2("Article 5 — Modalités de paiement"),
    Bullet("Les rémunérations sont décomptées par EVENTY à l'issue de chaque voyage livré, sur la base d'un état détaillé transmis au CRÉATEUR via son espace pro."),
    Bullet("Le paiement est effectué par virement bancaire dans un délai de vingt-et-un (21) jours à compter de la livraison du voyage et de l'émission de la facture du CRÉATEUR."),
    Bullet("En cas d'annulation du voyage par EVENTY pour seuil minimum non atteint, aucune rémunération n'est due ; les voyageurs sont intégralement remboursés."),

    H2("Article 6 — Engagements de qualité"),
    P("Le CRÉATEUR est évalué à l'issue de chaque voyage par les voyageurs (note moyenne sur 5 + commentaires libres). Une note moyenne inférieure à 4/5 sur deux voyages consécutifs déclenche un entretien qualité avec le Responsable opérations Eventy. Trois alertes consécutives entraînent un déréférencement définitif. EVENTY conserve un droit d'audit permanent sur l'exécution des programmes."),

    H2("Article 7 — Propriété intellectuelle"),
    P("Les programmes de voyage conçus par le CRÉATEUR dans le cadre du présent contrat constituent une œuvre commune dont les droits patrimoniaux sont co-titularisés par EVENTY et le CRÉATEUR. EVENTY conserve un droit d'usage perpétuel et non-exclusif sur les programmes pour la commercialisation. Le CRÉATEUR conserve la mention de paternité, qui apparaît sur la fiche voyage publique sous la forme « Voyage conçu par [nom du CRÉATEUR] »."),

    H2("Article 8 — Indépendance et non-exclusivité"),
    P("Le CRÉATEUR conserve sa pleine indépendance économique et juridique. Aucune clause d'exclusivité ne s'applique sauf avenant exprès, écrit et explicitement rémunéré. Le CRÉATEUR est libre de collaborer avec d'autres opérateurs de voyages, sous réserve de ne pas commercialiser un même programme conçu pour Eventy auprès d'un concurrent direct."),

    H2("Article 9 — Confidentialité et RGPD"),
    P("Le CRÉATEUR s'engage à respecter la confidentialité des données personnelles des voyageurs et toute information professionnelle confiée par EVENTY, conformément au règlement (UE) 2016/679 (RGPD). Cette obligation perdure cinq (5) ans après la cessation du contrat. EVENTY est responsable de traitement ; le CRÉATEUR est sous-traitant au sens de l'article 28 du RGPD."),

    H2("Article 10 — Durée et résiliation"),
    P("Le présent contrat est conclu pour une durée d'un (1) an à compter de sa signature, renouvelable tacitement par périodes d'un an. Chaque partie peut le résilier à tout moment moyennant un préavis écrit de trente (30) jours, sans préjudice des voyages déjà programmés qui doivent être menés à terme. Toute résiliation pour faute du CRÉATEUR (manquement grave constaté à la charte qualité, fraude, défaut de communication) prend effet immédiatement après mise en demeure restée sans effet quinze (15) jours."),

    H2("Article 11 — Loi applicable et juridiction"),
    P("Le présent contrat est soumis au droit français. Tout litige sera soumis, à défaut d'accord amiable, aux tribunaux compétents du ressort du siège social d'EVENTY."),

    Spacer(140),
    P("Fait à [Ville], le [Date], en deux exemplaires originaux dont un pour chaque partie.", { italics: true, after: 200 }),
    blocSignature("M. David Eventy, Président", "Le CRÉATEUR"),

    Spacer(180),
    P("Annexes au présent contrat (à joindre au moment de la signature) :", { bold: true }),
    Bullet("Annexe 1 — Charte qualité Eventy applicable au CRÉATEUR (et le cas échéant à l'accompagnateur)"),
    Bullet("Annexe 2 — RIB du compte bancaire professionnel du CRÉATEUR"),
    Bullet("Annexe 3 — Justificatif d'immatriculation INSEE (Kbis ou attestation INSEE)"),
    Bullet("Annexe 4 — Attestation URSSAF de moins de 3 mois"),
    Bullet("Annexe 5 — Le cas échéant, attestation de formation aux premiers secours (PSC1) si désigné accompagnateur"),
    Bullet("Annexe 6 — Le cas échéant, casier judiciaire B3 vierge si désigné accompagnateur"),
  ];
}

// ============================================================
// CONTRAT 3 — HRA PARTENAIRE EVENTY
// ============================================================
function contratHRA() {
  return [
    bandeauTitre("CONTRAT HRA PARTENAIRE EVENTY", "Hôtels · Restaurants · Activités — tarif négocié et marge socle Eventy"),
    Spacer(160),

    P("ENTRE LES SOUSSIGNÉS :", { bold: true, size: 20 }),
    P("D'une part, EVENTY LIFE SAS au capital de [montant] €, dont le siège social est sis [adresse], immatriculée au RCS de [ville] sous le numéro [SIREN], immatriculée au registre des opérateurs de voyages et de séjours d'Atout France sous le numéro IM [###-###-###], représentée par M. David Eventy, Président, ci-après dénommée « EVENTY » ;"),
    P("D'autre part, [Raison sociale du HRA], dont le siège est sis [adresse complète], immatriculé au [RCS de … / équivalent local] sous le numéro [SIREN ou équivalent], représenté par [Nom Prénom du dirigeant], en qualité de [fonction], ci-après dénommé « le PARTENAIRE HRA » ou « le HRA » ;"),
    P("Il a été préalablement exposé ce qui suit. EVENTY est un opérateur de voyages à forfait au sens des articles L211-1 et suivants du Code du Tourisme. Le HRA exerce une activité d'[hôtellerie / restauration / activité touristique — préciser] et souhaite fournir, dans le cadre des voyages organisés par EVENTY, les prestations correspondant à son cœur de métier. Sur ces bases, il a été convenu ce qui suit."),

    H2("Article 1 — Objet"),
    P("Le présent contrat a pour objet de définir les conditions générales de référencement et de fourniture des prestations du HRA dans les voyages organisés par EVENTY. Chaque voyage donnera lieu à un bon de commande spécifique précisant les dates, le nombre de voyageurs, les prestations et le prix négocié. Le HRA n'a aucune qualité d'opérateur de voyages au sens du Code du Tourisme."),

    H2("Article 2 — Référencement"),
    P("Le référencement du HRA dans le catalogue Eventy est conditionné à la production des pièces justificatives suivantes (préalablement à toute commande) :"),
    Bullet("Justificatif d'immatriculation (Kbis ou équivalent local de moins de 3 mois)."),
    Bullet("Attestation URSSAF (ou équivalent local) à jour."),
    Bullet("Justificatif d'assurance responsabilité civile professionnelle (RC Pro)."),
    Bullet("Pour la restauration : attestation de conformité hygiène et sécurité (HACCP ou équivalent)."),
    Bullet("Pour l'hôtellerie : classement officiel (étoiles, Atout France ou équivalent local)."),
    Bullet("Pour les activités : agrément spécifique selon la nature de l'activité (guide, sportif, etc.)."),
    Bullet("Capacité d'accueil simultanée minimum : 38 voyageurs sur la prestation concernée (sauf accord spécifique pour des prestations partielles)."),

    H2("Article 3 — Modalités de commande"),
    Bullet("EVENTY adresse au HRA un bon de commande pour chaque voyage : date(s), nombre exact de voyageurs, prestations attendues, prix unitaire et total négocié, allergènes et besoins spécifiques signalés."),
    Bullet("Le HRA confirme la commande par retour écrit (email ou plateforme Eventy) sous quarante-huit (48) heures."),
    Bullet("Toute modification du bon de commande postérieure à la confirmation requiert l'accord exprès des deux parties, formalisé par écrit."),
    Bullet("L'annulation par EVENTY moins de trente (30) jours avant la prestation ouvre droit à indemnisation forfaitaire selon le barème suivant : 15 % du montant entre J-30 et J-15 ; 30 % entre J-14 et J-7 ; 50 % entre J-6 et J-1 ; 100 % le jour J. L'annulation pour cause de seuil minimum voyageurs non atteint ou pour cause de force majeure suit un régime spécifique défini en annexe."),

    H2("Article 4 — Standards de qualité"),
    Bullet("Conformité permanente aux normes d'hygiène, sécurité et accessibilité applicables localement."),
    Bullet("Communication systématique des allergènes et restrictions alimentaires (restauration)."),
    Bullet("Respect strict du programme communiqué au voyageur ; toute substitution requiert l'accord écrit préalable d'EVENTY."),
    Bullet("Capacité de tenir le rythme opérationnel des voyages de groupe (timing des repas, gestion des arrivées/départs simultanés, etc.)."),
    Bullet("Signalement immédiat à EVENTY de tout incident affectant l'exécution de la prestation."),
    Bullet("Audit qualité possible par EVENTY (annuel ou ponctuel selon retours voyageurs)."),

    H2("Article 5 — Modalités de paiement et mécanique de marge"),
    P("Le HRA facture EVENTY au prix négocié figurant sur le bon de commande. Ce prix correspond au coût d'achat des prestations par EVENTY (« HRA acheté »). EVENTY refacture ces prestations au voyageur dans le prix total du voyage à un montant légèrement supérieur (« HRA refacturé »), le différentiel constituant la marge socle d'EVENTY."),
    P("Cette mécanique respecte intégralement le régime de TVA marge tourisme prévu par l'article 266-1-e du Code Général des Impôts (BOI-TVA-SECT-60). Le HRA n'a aucun droit ni regard sur le prix de refacturation au voyageur, qui relève de la libre détermination commerciale d'EVENTY."),
    P("Les modalités de paiement sont les suivantes :"),
    Bullet("EVENTY règle les prestations à trente (30) jours fin de mois à compter de la date de fin de séjour, par virement bancaire sur le compte renseigné par le HRA."),
    Bullet("Aucun acompte n'est versé au HRA avant l'exécution effective de la prestation, sauf accord spécifique écrit. Cette discipline garantit que les fonds clients en transit demeurent sous le contrôle d'EVENTY (et donc de la garantie financière APST) jusqu'à l'exécution effective des prestations au profit du voyageur."),
    Bullet("Les pénalités prévues à l'article 3 sont versées par EVENTY au HRA selon le même calendrier que les paiements ordinaires."),

    H2("Article 6 — Possibilité « vendeur » offerte au HRA"),
    P("Le HRA peut, s'il le souhaite, devenir simultanément vendeur Eventy en partageant les voyages d'EVENTY à sa propre clientèle. Il bénéficie alors de la commission « vendeur » de 5 % HT du CA voyage placé. Ce cumul fait l'objet d'un avenant spécifique au présent contrat-cadre, formalisé entre les parties. La qualité de vendeur n'altère en rien le régime de tarification applicable aux prestations HRA fournies au titre du présent contrat."),

    H2("Article 7 — Indépendance et non-exclusivité"),
    P("Le HRA conserve sa pleine indépendance commerciale et juridique. Aucune clause d'exclusivité ne s'applique sauf avenant exprès et explicitement rémunéré. Le HRA est libre de servir simultanément d'autres opérateurs de voyages ou des clients individuels."),

    H2("Article 8 — Confidentialité et RGPD"),
    P("Le HRA s'engage à respecter strictement la confidentialité des données personnelles des voyageurs auxquelles il a accès dans le cadre de l'exécution du présent contrat (listes de noms, allergènes, conditions médicales signalées), conformément au règlement (UE) 2016/679 (RGPD). Cette obligation perdure cinq (5) ans après la cessation du contrat. EVENTY est responsable de traitement ; le HRA est sous-traitant au sens de l'article 28 du RGPD."),

    H2("Article 9 — Durée et résiliation"),
    P("Le présent contrat est conclu pour une durée d'un (1) an à compter de sa signature, renouvelable tacitement par périodes d'un an. Chaque partie peut le résilier à tout moment, sans motif, moyennant un préavis écrit de trente (30) jours, sans préjudice des voyages déjà programmés qui doivent être menés à terme. La résiliation pour faute (manquement grave caractérisé) prend effet immédiatement après mise en demeure restée sans effet quinze (15) jours."),

    H2("Article 10 — Loi applicable et juridiction"),
    P("Le présent contrat est soumis au droit français. Tout litige relatif à son interprétation ou à son exécution sera soumis, à défaut d'accord amiable, aux tribunaux compétents du ressort du siège social d'EVENTY."),

    Spacer(140),
    P("Fait à [Ville], le [Date], en deux exemplaires originaux dont un pour chaque partie.", { italics: true, after: 200 }),
    blocSignature("M. David Eventy, Président", "Le PARTENAIRE HRA"),

    Spacer(180),
    P("Annexes au présent contrat (à joindre au moment de la signature) :", { bold: true }),
    Bullet("Annexe 1 — Justificatif d'immatriculation du HRA (Kbis ou équivalent local de moins de 3 mois)"),
    Bullet("Annexe 2 — Attestation URSSAF (ou équivalent local) à jour"),
    Bullet("Annexe 3 — Attestation d'assurance RC Pro du HRA"),
    Bullet("Annexe 4 — Le cas échéant, attestation HACCP (restauration) ou classement officiel (hôtellerie)"),
    Bullet("Annexe 5 — RIB du compte bancaire professionnel du HRA"),
    Bullet("Annexe 6 — Régime spécifique d'annulation pour seuil minimum non atteint et force majeure"),
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

// === Génération ===
async function generate() {
  const outputs = [
    {
      file: "docs/garanties/Eventy-Life-Contrat-Vendeur.docx",
      title: "Eventy Life — Contrat Vendeur",
      description: "Contrat type pour vendeur indépendant Eventy (commission 5 % HT).",
      footer: "EVENTY LIFE SAS — Contrat Vendeur",
      children: contratVendeur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Contrat-Createur.docx",
      title: "Eventy Life — Contrat Créateur",
      description: "Contrat type pour créateur de voyages indépendant Eventy (3 % sur HRA refacturé).",
      footer: "EVENTY LIFE SAS — Contrat Créateur",
      children: contratCreateur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Contrat-HRA-Partenaire.docx",
      title: "Eventy Life — Contrat HRA Partenaire",
      description: "Contrat-cadre pour partenaire HRA (Hôtel · Restaurant · Activité).",
      footer: "EVENTY LIFE SAS — Contrat HRA Partenaire",
      children: contratHRA(),
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
