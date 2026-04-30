/**
 * Eventy Life — Trois documents complémentaires
 *
 *   1. Catalogue programmes types saison 1 (10 voyages représentatifs)
 *   2. Plan marketing & go-to-market An 1
 *   3. Note de référence pour l'avocat tourisme (points juridiques à valider)
 *
 * Usage : node scripts/garanties/build-catalogue-marketing-avocat.js
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

// Voyage card helper
function voyageCard(num, voyage) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({ text: `${num}. ${voyage.titre}`, bold: true, size: 26, color: COLOR.blue, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: voyage.accroche, italics: true, size: 20, color: COLOR.orange, font: "Calibri" }),
      ],
    }),
    makeTable({
      widths: [3000, 6360],
      header: ["Élément", "Détail"],
      rows: voyage.specs,
    }),
  ];
}

// ============================================================
// DOCUMENT 1 — CATALOGUE PROGRAMMES TYPES SAISON 1
// ============================================================
function catalogueProgrammes() {
  const voyages = [
    {
      titre: "Marrakech, le sourire des médinas (5 jours)",
      accroche: "L'Atlas, les souks, le hammam — un classique qui ne déçoit jamais.",
      specs: [
        ["Durée", "5 jours / 4 nuits — départ vendredi soir, retour mardi matin"],
        ["Période", "Avril à octobre · saison creuse novembre-mars"],
        ["Transport", "Vol charter Paris-Marrakech ou vol régulier groupe + transferts privés"],
        ["Hébergement", "Riad de charme 4* dans la médina — pension complète"],
        ["Programme", "Souks · Jardin Majorelle · Atlas · Essaouira optionnelle · soirées tagines · hammam"],
        ["Capacité", "38 voyageurs cibles (capacité minimum 28)"],
        ["Prix par voyageur", "749 € TTC tout inclus"],
        ["Public cible", "Tout public · accessibilité PMR partielle (à signaler à la réservation)"],
      ],
    },
    {
      titre: "Lisbonne et la côte de l'Estoril (4 jours)",
      accroche: "Pasteis, Alfama, fado — le Portugal en weekend.",
      specs: [
        ["Durée", "4 jours / 3 nuits — départ jeudi soir, retour dimanche soir"],
        ["Période", "Mars à novembre"],
        ["Transport", "Autocar Grand Tourisme depuis Paris (≈ 22 h) OU vol charter (selon saison)"],
        ["Hébergement", "Hôtel 4* centre-ville — petits-déjeuners + 2 dîners"],
        ["Programme", "Alfama · Belém · Cascais · Sintra · dégustation pasteis et fado"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "599 € TTC"],
        ["Public cible", "Tout public · accessibilité PMR oui sur demande"],
      ],
    },
    {
      titre: "Barcelone et la Costa Brava (5 jours)",
      accroche: "Sagrada, plages catalanes, tapas — l'Espagne version XXL.",
      specs: [
        ["Durée", "5 jours / 4 nuits"],
        ["Période", "Mai à septembre"],
        ["Transport", "Autocar Grand Tourisme avec accompagnement humain depuis Paris"],
        ["Hébergement", "Hôtel 4* Barcelone — demi-pension + tapas une soirée"],
        ["Programme", "Sagrada Familia · Park Güell · plages Lloret de Mar · Gérone · Tossa de Mar"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "549 € TTC"],
        ["Public cible", "Tout public"],
      ],
    },
    {
      titre: "Pays-Bas féerique : Amsterdam et les tulipes (4 jours)",
      accroche: "Pleine floraison de Keukenhof — un printemps en couleurs.",
      specs: [
        ["Durée", "4 jours / 3 nuits"],
        ["Période", "Avril à mai (pleine floraison) · marchés de Noël en décembre"],
        ["Transport", "Autocar Grand Tourisme depuis Paris"],
        ["Hébergement", "Hôtel 4* Amsterdam centre"],
        ["Programme", "Keukenhof · croisière sur les canaux · Van Gogh + Rijksmuseum · balade à vélo"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "679 € TTC"],
        ["Public cible", "Tout public · accessibilité PMR oui"],
      ],
    },
    {
      titre: "Prague la magnifique (4 jours)",
      accroche: "Pont Charles, château, bières tchèques — l'Europe centrale rêvée.",
      specs: [
        ["Durée", "4 jours / 3 nuits"],
        ["Période", "Avril à octobre · marché de Noël décembre"],
        ["Transport", "Vol charter ou vol régulier groupe"],
        ["Hébergement", "Hôtel 4* Vieille Ville"],
        ["Programme", "Pont Charles · château · soirée musique classique · croisière Vltava · dégustation bières"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "729 € TTC"],
        ["Public cible", "Tout public"],
      ],
    },
    {
      titre: "Andalousie blanche : Séville · Cordoue · Grenade (6 jours)",
      accroche: "Flamenco, Alhambra, ruelles fleuries — le sud de l'Espagne en immersion.",
      specs: [
        ["Durée", "6 jours / 5 nuits"],
        ["Période", "Mars à juin · septembre à octobre"],
        ["Transport", "Vol charter Paris-Séville + autocar local"],
        ["Hébergement", "Hôtels 4* alternés (Séville · Cordoue · Grenade)"],
        ["Programme", "Cathédrale Séville · Alcazar · Alhambra · Mezquita Cordoue · soirée flamenco · Sierra Nevada optionnelle"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "899 € TTC"],
        ["Public cible", "Tout public · adultes recommandé"],
      ],
    },
    {
      titre: "Côte d'Azur autrement : Nice · Cannes · Monaco (4 jours)",
      accroche: "Le glamour méditerranéen sans les pièges à touristes.",
      specs: [
        ["Durée", "4 jours / 3 nuits"],
        ["Période", "Avril à octobre"],
        ["Transport", "Train SNCF groupe Paris-Nice + autocar local"],
        ["Hébergement", "Hôtel 4* Nice — demi-pension"],
        ["Programme", "Promenade des Anglais · Cannes · Monaco · Èze village · marché provençal · dégustation socca"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "639 € TTC"],
        ["Public cible", "Tout public · accessibilité PMR oui"],
      ],
    },
    {
      titre: "Toscane gourmande : Florence · Sienne · Pise (5 jours)",
      accroche: "Œuvres d'art, vins du Chianti, pâtes fraîches — l'Italie qui se goûte.",
      specs: [
        ["Durée", "5 jours / 4 nuits"],
        ["Période", "Avril à octobre"],
        ["Transport", "Vol charter Paris-Florence + autocar local"],
        ["Hébergement", "Hôtel 4* Florence + 1 nuit en Chianti (agriturismo)"],
        ["Programme", "Galerie des Offices · Duomo · Tour de Pise · Sienne · dégustation vins Chianti · cours de cuisine optionnel"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "849 € TTC"],
        ["Public cible", "Tout public · adultes recommandé"],
      ],
    },
    {
      titre: "Bruxelles · Bruges · Gand : la Belgique en perles (3 jours)",
      accroche: "Manneken Pis, canaux, gaufres — un weekend hors du temps.",
      specs: [
        ["Durée", "3 jours / 2 nuits — vendredi-dimanche"],
        ["Période", "Mars à novembre · marchés de Noël décembre"],
        ["Transport", "Autocar Grand Tourisme depuis Paris (≈ 4 h)"],
        ["Hébergement", "Hôtel 4* Bruxelles centre"],
        ["Programme", "Grand-Place · Manneken Pis · Bruges canaux · Gand · brasserie traditionnelle · dégustation chocolats"],
        ["Capacité", "38 voyageurs"],
        ["Prix par voyageur", "399 € TTC"],
        ["Public cible", "Tout public · accessibilité PMR oui · idéal weekend découverte"],
      ],
    },
    {
      titre: "Séminaire d'entreprise Côte d'Azur (3 jours, B2B)",
      accroche: "Cohésion équipe + cadre exceptionnel — formule premium B2B.",
      specs: [
        ["Durée", "3 jours / 2 nuits — adaptable"],
        ["Période", "Toute l'année · pic septembre à juin"],
        ["Transport", "Train SNCF groupe + transferts privés OU autocar premium"],
        ["Hébergement", "Hôtel 4-5* Cap d'Antibes ou Saint-Tropez"],
        ["Programme", "Activités team-building (régate, escape game) · gastronomie étoilée · soirée privatisée · plénière"],
        ["Capacité", "38 voyageurs B2B"],
        ["Prix par voyageur", "1 200 € HT (B2B, hors TVA)"],
        ["Public cible", "Comités de direction, équipes commerciales, séminaires d'entreprise"],
      ],
    },
  ];

  return [
    bandeauTitre(
      "CATALOGUE PROGRAMMES TYPES — SAISON 1",
      "10 voyages représentatifs de l'offre Eventy Life",
    ),
    Spacer(160),

    P("Le présent catalogue présente 10 programmes types représentatifs de l'offre Eventy Life pour la saison 1. Ces voyages sont destinés à servir de référence pour les voyageurs, les vendeurs partenaires, les créateurs indépendants et l'équipe interne. Le catalogue complet (24 programmes répartis sur 12 destinations) est disponible sur eventylife.fr et dans l'espace pro de chaque partenaire.", { italics: true }),

    H2("Caractéristiques communes à tous les programmes"),
    Bullet("Capacité nominale 38 voyageurs (cible) · seuil minimum de départ 28 voyageurs (en deçà : annulation et remboursement intégral)."),
    Bullet("Pack Sérénité INCLUS dans tous les voyages (assurance annulation, rapatriement médical, ligne 24/7)."),
    Bullet("Accompagnateur Eventy présent du premier au dernier kilomètre."),
    Bullet("Prix tout compris TTC affiché — aucune surcharge cachée."),
    Bullet("Acompte 30 % à la réservation, solde 30 jours avant le départ."),
    Bullet("Décomposition publique du prix sur la fiche voyage (charte transparence)."),
    Bullet("Garantie financière APST · RC Pro Tourisme · médiation MTV gratuite."),

    H2("Les 10 programmes représentatifs"),
    P("Chaque fiche présente la durée, la période, le transport, l'hébergement, le programme synthétique, la capacité, le prix TTC par voyageur et le public cible.", { italics: true }),

    ...voyages.flatMap((v, i) => voyageCard(i + 1, v)),

    Spacer(180),

    H2("Synthèse — répartition prix et types"),
    makeTable({
      widths: [3500, 5860],
      header: ["Tranche de prix par voyageur", "Voyages concernés"],
      rows: [
        ["≤ 500 € TTC", "Bruxelles · Bruges · Gand (3 jours, 399 €)"],
        ["500 — 700 € TTC", "Barcelone (549 €) · Lisbonne (599 €) · Côte d'Azur (639 €) · Pays-Bas (679 €)"],
        ["700 — 900 € TTC", "Prague (729 €) · Marrakech (749 €) · Toscane (849 €) · Andalousie (899 €)"],
        ["B2B premium", "Séminaire d'entreprise Côte d'Azur (1 200 € HT par voyageur)"],
      ],
    }),

    P("Panier moyen pondéré : ≈ 800 € TTC par voyageur, conforme aux hypothèses financières Eventy. Le mix de prix permet d'atteindre tous les segments de marché du voyage de groupe organisé.", { italics: true, after: 60 }),

    H2("Saisonnalité"),
    Bullet("Avril à octobre : pic d'activité (≈ 70 % des voyages programmés)."),
    Bullet("Mars et novembre : épaule (15 %)."),
    Bullet("Décembre à février : creux + marchés de Noël (15 %)."),
    Bullet("Activité B2B : répartie toute l'année avec pic septembre-juin."),

    Spacer(160),
    P("Catalogue complet (24 programmes répartis sur 12 destinations) : disponible sur eventylife.fr et dans l'espace pro des partenaires.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Document de référence : Annexe E du dossier de garantie financière (catalogue programmes types) + Partie 4 (analyse financière voyage 700 € de référence).", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN MARKETING & GO-TO-MARKET An 1
// ============================================================
function planMarketing() {
  return [
    bandeauTitre(
      "PLAN MARKETING & GO-TO-MARKET",
      "Stratégie d'acquisition voyageurs et de mobilisation du réseau — Année 1",
      COLOR.green,
    ),
    Spacer(160),

    P("Le présent plan marketing décrit la stratégie d'acquisition voyageurs et de mobilisation du réseau Eventy Life pour l'année 1. Il complète le dossier investisseur (Partie 4 — projections financières) et le dossier subventions publiques en explicitant le « comment » de la trajectoire commerciale (T1 : 3 voyages/sem → T4 : 50 voyages/sem · 16 M€ CA An 1).", { italics: true }),

    H1("1. Cibles voyageurs — segmentation"),

    H2("1.1. Trois segments cibles principaux"),
    makeTable({
      widths: [2500, 3500, 3360],
      header: ["Segment", "Profil type", "Stratégie d'acquisition"],
      rows: [
        ["B2C grand public 35-55 ans", "Couples actifs, urbains, CSP+, recherche convivialité + qualité", "Réseau créateurs/vendeurs · contenu social · partenariats CE"],
        ["B2C seniors 55+ ans", "Retraités actifs, voyages programmés, valeur sécurité et accompagnement", "Partenariats associations seniors · presse écrite · bouche-à-oreille"],
        ["B2B séminaires d'entreprise", "DRH, directions, comités, recherche cohésion + cadre", "Démarchage direct · LinkedIn Ads · partenariats CSE et organismes formation"],
      ],
    }),

    H2("1.2. Segments secondaires"),
    Bullet("Voyages célibataires / solo confidents — segment de niche en croissance."),
    Bullet("Voyages thématiques (œnotourisme, randonnée, culturel) — saisonnalité."),
    Bullet("Voyages multi-générationnels (3 générations) — qualité du programme et accessibilité PMR."),

    H1("2. Stratégie d'acquisition voyageurs"),

    H2("2.1. Levier principal — réseau distribué de vendeurs (5 % HT)"),
    P("Le levier d'acquisition principal d'Eventy est le réseau distribué de Vendeurs indépendants. Chaque vendeur place des inscriptions auprès de sa propre audience (proches, communauté, réseaux pro) en échange d'une commission de 5 % HT du CA voyage placé. Cette mécanique offre un coût d'acquisition variable, scalable et aligné sur la performance."),
    Bullet("Cible An 1 : 300 vendeurs actifs cumulés."),
    Bullet("Productivité moyenne attendue : 1 à 3 placements / mois / vendeur."),
    Bullet("Volume cible An 1 : ≈ 8 000 voyageurs placés via le réseau (50 % du CA)."),
    Bullet("Coût d'acquisition unitaire : ≈ 5-15 € (5 % HT de 100 à 300 €)."),

    H2("2.2. Levier secondaire — communication digitale directe"),
    Bullet("Site eventylife.fr — SEO et contenus de marque (blog, fiches voyage)."),
    Bullet("Réseaux sociaux : Instagram (cible 35-55 ans), Facebook (cible 55+ ans), LinkedIn (B2B)."),
    Bullet("Campagnes Meta Ads (avec consentement RGPD) — ciblage géographique + intérêts."),
    Bullet("Campagnes Google Ads — recherche « voyage de groupe + destination »."),
    Bullet("Email marketing — newsletter mensuelle aux inscrits avec consentement."),
    Bullet("Budget marketing An 1 : 30 K€ (0,2 % du CA · cible 30 K€/an, montée en An 2-3)."),

    H2("2.3. Partenariats institutionnels"),
    Bullet("Comités d'entreprise (CSE) — démarchage direct par notre force commerciale."),
    Bullet("Associations seniors locales (UFC, UNRPA, Notre Temps) — présentations en réunion."),
    Bullet("Mutuelles et caisses de retraite — diffusion auprès de leurs adhérents."),
    Bullet("Atout France — participation aux contrats de destination."),
    Bullet("ANCV — acceptation des chèques-vacances + visibilité auprès de 4,5 M de bénéficiaires."),

    H1("3. Mobilisation du réseau partenaires"),

    H2("3.1. Cibles à mobiliser An 1"),
    makeTable({
      widths: [3500, 2200, 3660],
      header: ["Catégorie", "Volume cible An 1", "Canaux d'acquisition"],
      rows: [
        ["Créateurs indépendants", "150 à 300 actifs", "Salons tourisme · LinkedIn · cooptation · French Tech locale"],
        ["Vendeurs (toutes catégories)", "300 actifs", "Réseaux sociaux · ambassadeurs voyageurs satisfaits · démarchage"],
        ["Partenaires HRA", "200 à 500 référencés", "Démarchage direct · salons hôteliers · réseaux UMIH/GNI"],
        ["Autocaristes français", "8 à 15 partenaires", "Démarchage direct · réseau IRU · recommandations"],
        ["Influenceurs voyage", "5 à 10 ambassadeurs payés", "Outreach Instagram/YouTube · partenariats stratégiques"],
      ],
    }),

    H2("3.2. Programme « ambassadeur voyageur satisfait »"),
    P("Tout voyageur ayant effectué un voyage Eventy peut devenir ambassadeur en signant le Contrat Vendeur. Il bénéficie alors :"),
    Bullet("Commission Vendeur 5 % HT sur tout voyage placé auprès d'un proche."),
    Bullet("Code parrainage personnel (réduction 5 % pour le filleul + bonus pour l'ambassadeur)."),
    Bullet("Accès à un espace pro simplifié (catalogue, génération de liens, suivi commissions)."),
    Bullet("Pas d'objectif de vente — pas de pression — la qualité du voyage vendu prime sur le volume."),

    H1("4. Calendrier marketing An 1"),

    H2("4.1. Phasage trimestriel"),
    makeTable({
      widths: [1500, 4000, 3860],
      header: ["Trimestre", "Activités principales", "Indicateurs cibles"],
      rows: [
        ["T1 (M1-M3)", "Soft launch · 3 voyages tests · onboarding 50 vendeurs · 50 créateurs", "300 voyageurs · ≈ 240 K€ CA"],
        ["T2 (M4-M6)", "Lancement public · campagnes Meta + Google · partenariats CSE", "1 800 voyageurs · ≈ 1,4 M€ CA cumulé"],
        ["T3 (M7-M9)", "Montée en charge · 5 voyages/sem · saison estivale · presse", "5 000 voyageurs · ≈ 5 M€ CA cumulé"],
        ["T4 (M10-M12)", "Plein régime · 10 voyages/sem · mobilisation B2B séminaires", "16 000 voyageurs · 16 M€ CA An 1 ✓"],
      ],
    }),

    H1("5. Indicateurs clés de pilotage marketing"),

    H2("5.1. Tableau de bord mensuel"),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Indicateur", "Cible An 1", "Seuil d'alerte"],
      rows: [
        ["Voyageurs inscrits / mois (T4)", "≥ 1 800", "< 1 200"],
        ["Coût d'acquisition voyageur (CAC)", "≤ 15 €", "> 25 €"],
        ["Taux de remplissage moyen / voyage", "≥ 38 / 53 places", "< 30 places"],
        ["Net Promoter Score (NPS) post-voyage", "≥ + 60", "< + 40"],
        ["Taux d'annulation voyageur", "≤ 5 %", "> 10 %"],
        ["Vendeurs actifs (placement / mois)", "≥ 200", "< 100"],
        ["Conversion site (visiteurs → réservations)", "≥ 1,5 %", "< 0,8 %"],
        ["Taux d'ouverture newsletter", "≥ 25 %", "< 15 %"],
      ],
    }),

    H1("6. Budget marketing An 1"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Budget An 1", "% du budget marketing"],
      rows: [
        ["Campagnes Meta Ads (Instagram + Facebook)", "12 K€", "40 %"],
        ["Campagnes Google Ads (search + display)", "9 K€", "30 %"],
        ["LinkedIn Ads (B2B séminaires)", "3 K€", "10 %"],
        ["Influenceurs ambassadeurs", "2 K€", "7 %"],
        ["Salons et événements professionnels", "2 K€", "7 %"],
        ["Production de contenus (photos, vidéos, blog)", "1,5 K€", "5 %"],
        ["Outils marketing (CRM, emailing, analytics)", "0,5 K€", "1 %"],
        ["TOTAL Budget marketing An 1", "30 K€", "100 %"],
      ],
    }),
    P("Ratio budget marketing / CA An 1 : ≈ 0,2 % — particulièrement frugal grâce au levier réseau distribué (5 % HT vendeurs). Comparaison concurrents agences traditionnelles : 3 à 8 % du CA.", { italics: true }),

    H1("7. Stratégie de contenu et marque"),
    Bullet("Ton de marque : chaleureux, authentique, transparent — l'humain prime sur le marketing."),
    Bullet("Charte transparence prix radicale — décomposition publique sur chaque fiche voyage."),
    Bullet("Mise en avant des créateurs indépendants (mention de paternité, photos, courtes biographies)."),
    Bullet("Mise en avant des partenaires français (autocaristes, hôteliers locaux)."),
    Bullet("Production régulière de contenus voyageurs satisfaits (avec consentement) — récits, photos, vidéos courtes."),
    Bullet("Partenariats presse spécialisée tourisme et entrepreneuriat français."),

    H1("8. Tests et apprentissages"),
    Bullet("Tests A/B sur les fiches voyage (titres, photos, prix d'appel)."),
    Bullet("Tests de canaux d'acquisition (Meta vs Google vs LinkedIn)."),
    Bullet("Tests de prix sur des destinations équivalentes."),
    Bullet("Tests de formats de communication (vidéo courte vs photo + texte vs carrousel)."),
    Bullet("Revue mensuelle des indicateurs et ajustements continus."),

    Spacer(180),
    P("Document de référence : voir Partie 7 du dossier APST (analyse de risques marketing) + Partie 11 (indicateurs de pilotage).", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — NOTE AVOCAT TOURISME
// ============================================================
function noteAvocat() {
  return [
    bandeauTitre(
      "NOTE DE RÉFÉRENCE — AVOCAT TOURISME",
      "Synthèse des points juridiques à valider avant dépôt officiel",
      COLOR.blue,
    ),
    Spacer(160),

    P("La présente note a été rédigée à l'attention de l'avocat tourisme partenaire d'Eventy Life. Elle synthétise les points juridiques structurants du dossier de garantie financière et de l'écosystème contractuel, en vue de la relecture finale avant dépôt officiel à l'APST et à Atout France.", { italics: true }),

    P("L'objectif de cette note est de faciliter le travail de l'avocat en identifiant, point par point, les éléments à valider, les questions ouvertes, et les pièces à joindre. Elle doit permettre une relecture efficace en 4 à 6 heures de travail concentré.", { italics: true }),

    H1("1. Documents à relire (par ordre de priorité)"),

    H2("1.1. Documents critiques (relecture intégrale)"),
    Numbered("Statuts SAS Eventy Life (Eventy-Life-Statuts-SAS.docx) — version standalone à finaliser avant signature au greffe."),
    Numbered("Conditions Générales de Vente (Eventy-Life-CGV.docx) — opposables au voyageur · risque litige direct."),
    Numbered("Information précontractuelle voyageur (Eventy-Life-Information-Precontractuelle.docx) — formulaire conforme arrêté 1er mars 2018."),
    Numbered("Pacte d'associés Seed (Eventy-Life-Pacte-Associes-Seed.docx) — modèle finalisable avant levée."),
    Numbered("Politique RGPD (Eventy-Life-Politique-Confidentialite-RGPD.docx) — responsabilité de traitement Eventy."),

    H2("1.2. Contrats partenaires (relecture clauses-clés)"),
    Bullet("Contrat Vendeur (5 % HT) — Eventy-Life-Contrat-Vendeur.docx"),
    Bullet("Contrat Créateur (3 % HRA) — Eventy-Life-Contrat-Createur.docx"),
    Bullet("Contrat HRA Partenaire — Eventy-Life-Contrat-HRA-Partenaire.docx"),
    Bullet("Bon de commande HRA — Eventy-Life-Bon-De-Commande-HRA.docx"),

    H2("1.3. Documents secondaires (validation ciblée)"),
    Bullet("Mentions légales eventylife.fr — Eventy-Life-Mentions-Legales.docx"),
    Bullet("Politique cookies — Eventy-Life-Politique-Cookies.docx"),
    Bullet("Courriers Atout France + APST — Eventy-Life-Courriers-APST-AtoutFrance.docx"),

    H1("2. Points juridiques à valider"),

    H2("2.1. Conformité Code du Tourisme"),
    Numbered("Affirmation de la qualité d'opérateur de voyages au sens article L211-1 (Statuts art. 3 + CGV art. 1)."),
    Numbered("Respect intégral de l'obligation d'information précontractuelle (article L211-9 + arrêté 1er mars 2018)."),
    Numbered("Limitation de modification du prix à 8 % conformément à l'article L211-12."),
    Numbered("Délai de 20 jours minimum avant départ pour toute modification de prix."),
    Numbered("Cession du contrat à un tiers possible jusqu'à 7 jours avant départ (article L211-11)."),
    Numbered("Barème de résolution avant départ raisonnable et justifiable (CGV art. 9)."),
    Numbered("Responsabilité de plein droit assumée par Eventy (article L211-16) — vérifier rédaction CGV art. 11."),
    Numbered("Médiation MTV gratuite mentionnée dans CGV, mentions légales, information précontractuelle."),
    Numbered("Garantie financière APST citée explicitement comme couvrant la défaillance et le rapatriement."),

    H2("2.2. Conformité directive (UE) 2015/2302"),
    Numbered("Toutes les obligations directive sont reprises dans les CGV (vérifier mise en correspondance)."),
    Numbered("Aucune clause des CGV ne renonce ni ne réduit les droits du voyageur (article 23 directive)."),
    Numbered("Délai de prescription de 2 ans minimum respecté."),
    Numbered("Droits du voyageur en cas de défaillance opérateur (insolvabilité) bien encadrés."),
    Numbered("Définition « voyage à forfait » conforme à l'article 3 (1) directive — pas de prestation de voyage liée."),

    H2("2.3. Conformité RGPD"),
    Numbered("Politique de confidentialité conforme aux articles 12 à 22 du RGPD."),
    Numbered("DPO externe désigné dans les 6 mois — modalités de désignation à valider."),
    Numbered("Bandeau de consentement cookies conforme aux lignes directrices CNIL (refus aussi simple que l'acceptation)."),
    Numbered("Sous-traitance encadrée (Stripe, assureur, partenaires HRA) — vérifier accords article 28."),
    Numbered("Procédure de notification CNIL sous 72 heures en cas de violation."),
    Numbered("Durées de conservation justifiées et proportionnées."),

    H2("2.4. Conformité Code de la consommation"),
    Numbered("Mention explicite de la médiation gratuite (articles L612-1 et suivants)."),
    Numbered("Pas de clause abusive au sens de l'article L212-1."),
    Numbered("Information précontractuelle conforme à l'article L221-5."),
    Numbered("Modalités de paiement transparentes."),
    Numbered("Réception du contrat sur support durable."),

    H2("2.5. Conformité Code de commerce (Statuts SAS)"),
    Numbered("Mentions obligatoires des statuts conformes aux articles L227-1 et suivants."),
    Numbered("Capital social et apports correctement décrits."),
    Numbered("Présidence et révocation ad nutum bien encadrées."),
    Numbered("Cession soumise à agrément Président — clause valide."),
    Numbered("Réserve volontaire 5 % CA — clause statutaire opposable, vérifier l'absence de blocage légal."),
    Numbered("Quorum et majorités cohérents avec la loi (modification statuts, transformation, dissolution)."),

    H2("2.6. Conformité fiscale"),
    Numbered("Régime TVA marge tourisme (BOI-TVA-SECT-60, article 266-1-e CGI) bien identifié dans la mécanique de marge HRA."),
    Numbered("Absence de double imposition entre marge socle Eventy et commissions Vendeur/Créateur."),
    Numbered("Mentions « TVA non applicable, art. 293 B CGI » pour vendeurs auto-entrepreneurs en franchise."),
    Numbered("Statut JEI éligible (à valider avec rescrit fiscal)."),
    Numbered("CIR et CII éligibles sur dépenses R&D et innovation."),

    H1("3. Questions ouvertes pour l'avocat"),

    H2("3.1. Questions structurantes"),
    Bullet("Forme finale de la levée Seed : augmentation de capital classique OU BSA-AIR ? Implications juridiques et fiscales pour le Fondateur ?"),
    Bullet("Pacte d'associés : niveau de protection optimal pour le Fondateur (anti-dilution, drag-along threshold) ?"),
    Bullet("Statuts : opportunité d'introduire des actions de préférence dès la constitution ?"),
    Bullet("Clause de non-concurrence Fondateur : durée et géographie à finaliser."),
    Bullet("Réserve volontaire 5 % CA : opposabilité aux Investisseurs futurs ?"),

    H2("3.2. Questions opérationnelles"),
    Bullet("Modalités de la TVA marge tourisme face à la mécanique distribuée Vendeur/Créateur — schéma à valider avec l'expert-comptable."),
    Bullet("Risque de requalification des Vendeurs/Créateurs en VRP ou en salariés — comment sécuriser l'indépendance ?"),
    Bullet("Statut juridique des données médicales (allergènes, conditions médicales voyageur) — base légale article 9 (2) RGPD ?"),
    Bullet("Acceptation des chèques-vacances ANCV — démarche à entreprendre auprès de l'ANCV ?"),
    Bullet("Couverture RC Pro Tourisme — plafond 1 500 000 € suffisant ou recommander 3 000 000 € ?"),

    H2("3.3. Questions stratégiques"),
    Bullet("Anticipation Européenne : quelles adaptations contractuelles si voyages organisés depuis un autre pays UE ?"),
    Bullet("Évolutions réglementaires anticipées (révision directive 2015/2302, AI Act, DSA, etc.)."),
    Bullet("Médiation conventionnelle MTV : opter pour MTV ou autre médiateur (UNAT, Médiation Tourisme et Voyage) ?"),
    Bullet("Risque réputationnel : politique de gestion des avis voyageurs (Trustpilot, Google) ?"),

    H1("4. Pièces complémentaires à produire"),
    P("Pour faciliter la relecture, l'avocat tourisme peut demander la transmission complémentaire des pièces suivantes :"),
    Bullet("Dossier de garantie financière complet (Eventy-Life-Dossier-Garantie-Financiere-COMPLET.pdf · 119 pages)."),
    Bullet("Dossier investisseur (Eventy-Life-Dossier-Investisseur.pdf · 15 pages)."),
    Bullet("Manuel d'incident voyage (Eventy-Life-Manuel-Incident-Voyage.pdf · 7 pages)."),
    Bullet("Onboarding partenaires (Eventy-Life-Onboarding-Partenaires.pdf · 4 pages)."),
    Bullet("Catalogue programmes types saison 1 (Eventy-Life-Catalogue-Programmes-Saison-1.pdf · 10 voyages)."),
    Bullet("Plan marketing An 1 (Eventy-Life-Plan-Marketing-An-1.pdf)."),
    Bullet("Documents techniques de la plateforme (sur demande)."),
    Bullet("Devis pré-engagement RC Pro Tourisme (Cabinet Vallois — Galian)."),
    Bullet("Mandat expert-comptable spécialisé tourisme (à signer)."),

    H1("5. Calendrier et livrables attendus"),
    makeTable({
      widths: [2500, 4500, 2360],
      header: ["Délai", "Livrable attendu de l'avocat", "Statut"],
      rows: [
        ["J + 7", "Note de relecture des CGV avec corrections suggérées", "À planifier"],
        ["J + 14", "Note de relecture des Statuts SAS finalisés", "À planifier"],
        ["J + 21", "Note de relecture des contrats partenaires (Vendeur, Créateur, HRA)", "À planifier"],
        ["J + 28", "Note de relecture du Pacte d'associés Seed", "À planifier"],
        ["J + 35", "Synthèse des points juridiques validés + recommandations finales", "À planifier"],
        ["J + 42", "Lettre de validation pour transmission au dossier APST", "À planifier"],
      ],
    }),

    H1("6. Modalités de la mission"),
    Bullet("Honoraires : à convenir au temps passé OU au forfait, selon préférence."),
    Bullet("Confidentialité : engagement de l'avocat à ne pas divulguer les éléments du dossier (couverte par le secret professionnel)."),
    Bullet("Disponibilité : prévoir 4 à 6 heures de travail concentré + 1 à 2 réunions de validation."),
    Bullet("Suivi annuel : prévoir un audit annuel léger (mise à jour CGV, suivi des évolutions réglementaires)."),

    Spacer(180),
    P("Contact direct : David Eventy — Président, Fondateur — eventylife@gmail.com — disponibilité 7j/7.", { bold: true, color: COLOR.blue, size: 22 }),
    Spacer(80),
    P("Document confidentiel — usage strictement réservé à l'avocat tourisme partenaire dans le cadre de la mission de relecture du dossier de garantie financière.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Catalogue-Programmes-Saison-1.docx",
      title: "Eventy Life — Catalogue programmes types saison 1",
      description: "10 voyages représentatifs de l'offre Eventy Life pour la saison de lancement.",
      footer: "EVENTY LIFE SAS — Catalogue programmes saison 1",
      children: catalogueProgrammes(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Marketing-An-1.docx",
      title: "Eventy Life — Plan marketing & go-to-market An 1",
      description: "Stratégie d'acquisition voyageurs et de mobilisation du réseau pour l'année 1.",
      footer: "EVENTY LIFE SAS — Plan marketing An 1",
      children: planMarketing(),
    },
    {
      file: "docs/garanties/Eventy-Life-Note-Avocat-Tourisme.docx",
      title: "Eventy Life — Note de référence avocat tourisme",
      description: "Synthèse des points juridiques à valider avant dépôt officiel APST/Atout France.",
      footer: "EVENTY LIFE SAS — Note avocat tourisme",
      children: noteAvocat(),
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
