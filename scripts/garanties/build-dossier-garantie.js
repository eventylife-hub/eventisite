/**
 * Eventy Life — Générateur du Dossier de Garantie Financière
 *
 * Produit : Eventy-Life-Dossier-Garantie-Financiere-COMPLET.docx
 *
 * Usage : node scripts/garanties/build-dossier-garantie.js [output.docx]
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
  Header,
  Footer,
  AlignmentType,
  LevelFormat,
  TabStopType,
  TabStopPosition,
  TableOfContents,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  PageNumber,
  PageBreak,
  ExternalHyperlink,
  Bookmark,
  InternalHyperlink,
} = require("docx");

// ---------- Couleurs Eventy ----------
const COLOR = {
  orange: "E87722",   // soleil
  blue:   "1F4E79",   // océan
  blueLt: "D5E8F0",
  cream:  "FFF8EE",
  gray:   "555555",
  grayLt: "EEEEEE",
  black:  "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

// ---------- Helpers ----------
function H1(text /*, anchor */) {
  const run = new TextRun({ text, bold: true, size: 36, color: COLOR.blue, font: "Calibri" });
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240 },
    children: [run],
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: COLOR.blue, font: "Calibri" })],
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Calibri",
        color: COLOR.black,
        bold: opts.bold,
        italics: opts.italics,
      }),
    ],
  });
}
function PR(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: runs,
  });
}
function Quote(text) {
  return new Paragraph({
    spacing: { before: 200, after: 200, line: 320 },
    indent: { left: 720, right: 720 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange, space: 12 },
    },
    children: [
      new TextRun({ text, size: 24, italics: true, font: "Calibri", color: COLOR.blue }),
    ],
  });
}
function Bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80, line: 280 },
    children: [new TextRun({ text, size: 22, font: "Calibri", color: COLOR.black })],
  });
}
function BulletR(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80, line: 280 },
    children: runs,
  });
}
function Numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 80, line: 280 },
    children: [new TextRun({ text, size: 22, font: "Calibri", color: COLOR.black })],
  });
}
function HR() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.orange, space: 1 } },
    children: [new TextRun({ text: "" })],
  });
}
function Spacer() {
  return new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 120 } });
}
function PB() {
  return new Paragraph({ children: [new PageBreak()] });
}
function tCell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            size: opts.size || 20,
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
      tCell(h, { width: widths[i], shade: COLOR.blue, color: "FFFFFF", bold: true, size: 22 })
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

// ---------- Page de garde ----------
function coverPage() {
  return [
    new Paragraph({ spacing: { before: 1200 }, children: [new TextRun("")] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "EVENTY LIFE",
          size: 96,
          bold: true,
          color: COLOR.orange,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [
        new TextRun({
          text: "Le voyage de groupe où tu n'as rien à gérer, tout à vivre.",
          size: 28,
          italics: true,
          color: COLOR.blue,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "DOSSIER DE GARANTIE FINANCIÈRE",
          size: 48,
          bold: true,
          color: COLOR.blue,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({
          text: "Demande d'adhésion APST — Immatriculation Atout France",
          size: 28,
          color: COLOR.gray,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Article L211-18 du Code du Tourisme",
          size: 22,
          color: COLOR.gray,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1600 },
      children: [
        new TextRun({
          text: "Directive (UE) 2015/2302 du 25 novembre 2015",
          size: 22,
          color: COLOR.gray,
          font: "Calibri",
        }),
      ],
    }),
    HR(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: "Présenté par David Eventy — Président, Fondateur",
          size: 24,
          bold: true,
          font: "Calibri",
          color: COLOR.black,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "EVENTY LIFE SAS (en cours de création)",
          size: 22,
          font: "Calibri",
          color: COLOR.gray,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "eventylife@gmail.com — eventylife.fr",
          size: 22,
          font: "Calibri",
          color: COLOR.gray,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Version 1.0 — 29 avril 2026",
          size: 22,
          italics: true,
          font: "Calibri",
          color: COLOR.gray,
        }),
      ],
    }),
    PB(),
  ];
}

// ---------- Lettre de présentation ----------
function lettrePresentation() {
  return [
    H1("Lettre du Président", "lettre"),
    Spacer(),
    P("À l'attention de Monsieur le Président de l'Association Professionnelle de Solidarité du Tourisme (APST), de Madame, Monsieur le représentant d'Atout France, et de tout organisme appelé à examiner ce dossier.", { italics: true }),
    Spacer(),
    P("Madame, Monsieur,"),
    P("Je m'appelle David Eventy. Je vous présente Eventy Life, projet auquel je consacre mon énergie, mon temps, et toutes mes ressources depuis plusieurs mois."),
    P("Eventy n'est pas né d'une étude de marché. Eventy est né d'un homme qui aime voyager, qui aime entreprendre, et qui aime les gens. Cette boîte existe pour une raison simple : remettre de l'humain dans le voyage de groupe, et faire vivre un réseau de partenaires français — chauffeurs, hôteliers, restaurateurs, guides, accompagnateurs — qui, ensemble, donnent vie à des séjours que les voyageurs n'oublient pas."),
    P("Notre conviction tient en une phrase : le client doit se sentir aimé. Pas « satisfait », pas « bien servi » — aimé. Quand quelqu'un nous confie son voyage, il nous confie ses souvenirs, ses proches, ses moments. Nous ne gérons pas des réservations : nous prenons soin des gens."),
    P("La garantie financière n'est pas pour nous une formalité. C'est la promesse que je veux pouvoir faire à chaque voyageur qui réserve sur eventylife.fr : « Quoi qu'il arrive, ton acompte est protégé. Si nous défaillons, tu seras remboursé. Si tu es bloqué à l'étranger, on te rapatrie. » Voilà pourquoi nous voulons être garantis. Voilà pourquoi nous présentons ce dossier avec sérieux."),
    P("Eventy Life est un projet 100 % français. Nos données sont hébergées en France (Scaleway, Paris). Nos partenaires sont d'abord français — autocaristes, hôtels, restaurateurs des destinations européennes desservies par bus. Nos statuts seront enregistrés au greffe français, nos impôts payés en France, nos emplois créés en France."),
    P("Nous nous présentons devant vous avec humilité et avec ambition. Humilité, parce que nous savons que la confiance se gagne, et qu'un nouvel opérateur du tourisme doit faire ses preuves. Ambition, parce que nous portons un modèle économique solide, une plateforme technique mature (plus d'un million de lignes de code, 31 modules backend, 3 300 tests passants), et une trajectoire de croissance étayée par un business plan rigoureux."),
    P("Nous voulons faire tout notre possible pour être en règle. Nous demandons à la France — à ses institutions, à ses garants, à ses fonctionnaires — de bien vouloir nous accompagner sur ce chemin."),
    P("Je vous remercie pour le temps consacré à l'examen de ce dossier. Je reste à votre entière disposition pour toute précision, pour rencontrer vos équipes, et pour répondre à toute question complémentaire."),
    Spacer(),
    P("Avec considération et engagement,", { italics: true }),
    Spacer(),
    P("David Eventy", { bold: true }),
    P("Président, Fondateur — Eventy Life SAS"),
    P("eventylife@gmail.com"),
    PB(),
  ];
}

// ---------- Sommaire ----------
function sommaire() {
  return [
    H1("Sommaire"),
    P("Cliquez sur un titre pour atteindre la section. Le sommaire se met à jour automatiquement à l'ouverture du document.", { italics: true }),
    Spacer(),
    new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-3" }),
    PB(),
  ];
}

// ---------- 1. Présentation Eventy ----------
function partie1Presentation() {
  return [
    H1("1. Présentation d'Eventy Life", "partie1"),
    Quote("Eventy Life — Le voyage de groupe où tu n'as rien à gérer, tout à vivre."),

    H2("1.1. Identité de la société"),
    makeTable({
      widths: [3000, 6360],
      header: ["Élément", "Information"],
      rows: [
        ["Dénomination sociale", "EVENTY LIFE"],
        ["Forme juridique", "SAS — Société par Actions Simplifiée"],
        ["Statut au dépôt", "En cours de création (statuts en finalisation)"],
        ["Capital social prévu", "3 000 € (libéré à 100 % à la constitution)"],
        ["Siège social", "France — adresse précisée à l'immatriculation"],
        ["Président, Fondateur", "David Eventy"],
        ["Site officiel", "eventylife.fr"],
        ["Contact", "eventylife@gmail.com"],
        ["Domaine d'activité", "Vente et organisation de voyages à forfait — Code APE 7912Z (Voyagistes)"],
        ["Numéro IM Atout France", "À attribuer après dépôt du dossier"],
      ],
    }),

    H2("1.2. Vision et mission"),
    P("Eventy Life est une plateforme française de voyages de groupe organisés. Notre mission est de rendre le voyage collectif accessible, joyeux et serein, en faisant circuler la valeur entre voyageurs, créateurs de voyages indépendants, partenaires d'hébergement, de restauration et de transport."),
    P("Nous croyons que le voyage est un acte profondément humain. Nous croyons que les indépendants — accompagnateurs, guides, animateurs — méritent une plateforme qui les respecte comme partenaires et non comme prestataires. Nous croyons qu'un bus complet de 53 voyageurs heureux vaut mieux qu'un voyage individuel anonyme."),

    H2("1.3. Positionnement — ce qui nous rend différents"),
    makeTable({
      widths: [4680, 4680],
      header: ["Le marché classique", "Eventy Life"],
      rows: [
        ["L'assurance est en option, payante, complexe", "Pack Sérénité inclus dans chaque voyage, gratuit, simple"],
        ["Un seul payeur gère la cagnotte du groupe", "Chaque voyageur paie sa part en ligne, indépendamment"],
        ["Le client organise tout seul", "Un humain accompagne le groupe de A à Z, porte-à-porte"],
        ["Groupes de 15-20 personnes", "Bus complet de 53 — prix unitaire imbattable"],
        ["Transport générique, sans ambiance", "Le bus est l'aventure : musique, arrêts, rencontres"],
        ["Indépendants = exécutants", "Indépendants = créateurs de voyages, partenaires"],
        ["Voyage = produit catalogue", "Voyage = expérience unique, signature humaine"],
        ["Marges opaques", "Marge transparente, prix juste, zéro surprise"],
      ],
    }),

    H2("1.4. Modèle économique — une architecture de marges distribuées"),
    P("Eventy Life ne fonctionne pas selon le modèle d'agence classique « j'achète à X et je vends à Y, je garde la différence ». Nous avons construit une architecture de marges distribuées où chaque acteur de la chaîne — Eventy, créateur de voyages, vendeur, partenaire HRA — est rémunéré selon sa contribution réelle à la valeur livrée au voyageur."),
    P("Ce modèle traduit une conviction non-négociable : la valeur appartient à ceux qui la font naître. Plus l'acteur s'implique, plus il est rémunéré. Plus Eventy fait tourner la valeur dans l'économie locale, plus la plateforme devient pérenne."),
    H3("Les quatre couches de rémunération"),
    makeTable({
      widths: [2400, 2400, 4560],
      header: ["Acteur", "Rémunération", "Logique sous-jacente"],
      rows: [
        ["Eventy (plateforme)", "Marge socle sur les prestations HRA — hôtels, restaurants, activités", "Eventy négocie les prestations, fournit la garantie financière, l'assurance, la plateforme, le paiement, l'accompagnement. La marge HRA finance ce socle et la qualité de service. Eventy ne marge PAS sur les cartes (énergie, gamification, badges) — ces éléments servent l'expérience."],
        ["Vendeur (toute personne qui vend un voyage)", "5 % HT du prix de vente du voyage", "Vendeur = créateur, ambassadeur, influenceur, HRA partageant à ses clients, indépendant — toute personne ouvrant l'écosystème Eventy à un nouveau voyageur perçoit 5 % HT. La force commerciale est distribuée."],
        ["Créateur de voyage", "Marge HRA + 3 % supplémentaires", "Le créateur conçoit le séjour, choisit les partenaires, anime le programme. Il perçoit la part complémentaire au socle HRA, en plus de tout 5 % vendeur s'il vend lui-même son voyage à un client."],
        ["Partenaire HRA (hôtel, restaurant, activité)", "Tarification négociée + possibilité de devenir vendeur (5 % HT)", "Un HRA peut être simple fournisseur, ou devenir aussi vendeur s'il partage les voyages à ses propres clients. L'écosystème est ouvert : aucune frontière fermée entre fournisseurs et distributeurs."],
      ],
    }),
    H3("Cumul possible des rémunérations"),
    P("Un acteur peut cumuler plusieurs rôles. Un créateur qui vend lui-même son voyage à un client perçoit : la marge HRA + 3 % de marge créateur + 5 % de marge vendeur. Un partenaire HRA qui partage les voyages à sa clientèle existante perçoit : sa tarification HRA + 5 % de marge vendeur. Cette mécanique de cumul est volontaire — elle récompense l'engagement et l'effort commercial réel."),
    H3("Hypothèses unitaires (voyage de référence)"),
    makeTable({
      widths: [4680, 4680],
      header: ["Indicateur", "Valeur de référence"],
      rows: [
        ["Capacité bus complet", "53 places (modèle nominal)"],
        ["Taux de remplissage cible", "38 voyageurs (≈ 72 %)"],
        ["Panier moyen voyageur (TTC)", "800 €"],
        ["CA par voyage (38 × 800 €)", "30 400 €"],
        ["dont prestations HRA (hôtels + restaurants + activités)", "≈ 18 240 € (≈ 60 % du CA)"],
        ["dont transport (autocariste / aérien)", "≈ 7 600 € (≈ 25 % du CA)"],
        ["dont taxes, assurance, animation, accompagnement", "≈ 4 560 € (≈ 15 % du CA)"],
        ["Marge HRA Eventy (socle, ≈ 8 % sur HRA)", "≈ 1 460 €"],
        ["Marge créateur (3 % supplémentaires sur HRA)", "≈ 547 €"],
        ["Marge vendeur (5 % HT du voyage)", "≈ 1 216 €"],
        ["Eventy net (marge HRA – part créateur)", "≈ 913 € (≈ 3 % du CA)"],
      ],
    }),
    P("Le total redistribué dans l'économie locale et au réseau d'indépendants par voyage est de l'ordre de 1 760 €, soit près de 6 % du CA voyage. Eventy conserve environ 3 % nets — la marge nécessaire à la couverture de la plateforme, de la garantie, de l'assurance et de l'équipe interne."),
    P("Ces données sont conservatrices : nous ne facturons pas en supposant un bus plein, mais en supposant 38 voyageurs. Notre seuil de départ minimal est inférieur à 53 — nous partons même si le bus n'est pas plein, parce qu'un bon voyage à 38 vaut mieux qu'un voyage annulé."),

    H2("1.5. Trajectoire de croissance"),
    P("La trajectoire d'Eventy Life se déploie en quatre temps trimestriels en An 1, puis en montée en puissance européenne en An 2."),
    makeTable({
      widths: [1500, 2000, 2000, 1860, 2000],
      header: ["Période", "Voyages / sem.", "Voyageurs / sem.", "CA mensuel", "Géographie"],
      rows: [
        ["T1 (M1-M3)", "3 → 10", "114 → 380", "~1,2 M €", "France métropolitaine"],
        ["T2 (M4-M6)", "10 → 20", "380 → 760", "~2,4 M €", "France + Espagne / Italie"],
        ["T3 (M7-M9)", "20 → 35", "760 → 1 330", "~4,2 M €", "Europe Sud + Maroc"],
        ["T4 (M10-M12)", "35 → 50", "1 330 → 1 900", "~6 M €", "Europe (12 destinations)"],
        ["An 2", "100 → 200", "3 800 → 7 600", "~12 → 24 M €", "Europe complète + charter A320"],
      ],
    }),
    P("Le CA cumulé de l'année 1 est estimé à 16 M€, celui de l'année 2 à 80 M€. Ces montants conditionnent le calibrage de la garantie financière demandée (voir partie 5)."),

    H2("1.6. Les emplois créés"),
    P("Eventy Life est structurellement un créateur d'activité économique. Le modèle ne repose pas sur une masse salariale lourde, mais sur un réseau d'indépendants français rémunérés à la prestation, et sur des partenaires locaux français privilégiés au démarrage."),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Catégorie", "Statut", "Volume cible An 1"],
      rows: [
        ["Créateurs de voyages indépendants", "Auto-entrepreneurs, micro-entreprises", "150 à 300 actifs"],
        ["Accompagnateurs & guides", "Indépendants prestataires", "100 à 200 missions/mois"],
        ["Équipe Eventy interne", "Salariés CDI", "5 à 12 ETP en An 1"],
        ["Autocaristes français", "Sociétés partenaires", "8 à 15 partenaires actifs"],
        ["Hôtels — Restaurants — Activités (HRA)", "Partenariats commerciaux", "200 à 500 référencés"],
      ],
    }),
    P("Avec une trajectoire de 200 voyages par semaine en An 2, ce sont environ 7 600 voyageurs hebdomadaires qui circulent dans l'écosystème. Chaque voyage finance un autocariste, un hôtel, des restaurants, des activités, un guide ou un accompagnateur. La valeur ruisselle dans l'économie réelle française et européenne."),

    H2("1.7. Plateforme technique — un actif structurant"),
    P("Eventy Life dispose d'une plateforme technologique propriétaire mature, développée et auto-financée par le fondateur. Cette plateforme constitue un avantage concurrentiel et un facteur de réduction du risque opérationnel."),
    makeTable({
      widths: [3000, 6360],
      header: ["Composant", "Détail"],
      rows: [
        ["Frontend", "Next.js 14 — 1 118 pages, 32 portails distincts"],
        ["Backend", "NestJS 10 — 31 modules métiers"],
        ["Base de données", "PostgreSQL (Prisma ORM)"],
        ["Hébergement", "Scaleway (Paris) + Vercel — données en France"],
        ["Tests automatisés", "3 300+ tests passants — CI/CD intégrée"],
        ["Volume de code", "~1 184 000 lignes (frontend ~876 k, backend ~308 k)"],
        ["Modules conformité", "Module legal, module insurance, module finance, module documents, module post-sale"],
        ["Paiements", "Stripe Connect — traçabilité totale, conformité PCI-DSS"],
      ],
    }),
    P("Cette infrastructure permet une traçabilité complète des fonds reçus des voyageurs, une conformité native à la directive (UE) 2015/2302, et une scalabilité supérieure à celle d'une agence traditionnelle. C'est aussi la garantie qu'en cas de défaillance, tout fonds reçu est tracé et donc remboursable."),
    PB(),
  ];
}

// ---------- 2. Plaidoyer France ----------
function partie2Plaidoyer() {
  return [
    H1("2. Eventy & la France — un projet d'intérêt économique national", "partie2"),
    Quote("Nous voulons faire tout notre possible pour être en règle. Nous demandons à la France de nous accompagner sur ce chemin."),

    H2("2.1. Une boîte française, ancrée dans le territoire"),
    P("Eventy Life est, et restera, une société française. Cette ancrage n'est pas un argument marketing : c'est une ligne stratégique structurante."),
    Bullet("Siège social en France — SAS de droit français, soumise au droit fiscal français."),
    Bullet("Données hébergées en France — infrastructure Scaleway, datacenters parisiens, conformité RGPD native."),
    Bullet("Garantie financière souscrite auprès d'un garant français (APST en première intention)."),
    Bullet("Médiation des litiges confiée à la Médiation Tourisme et Voyage (MTV), association française de médiation."),
    Bullet("Fournisseurs locaux français privilégiés au démarrage — autocaristes, hôtels, restaurateurs."),
    Bullet("Conseils juridique, comptable, fiscal — tous français."),

    H2("2.2. La création de valeur économique"),
    P("Eventy n'est pas une plateforme de désintermédiation qui aspire la valeur. Eventy est une plateforme d'intermédiation positive qui fait circuler la valeur dans l'économie locale."),
    H3("Ce que nous apportons aux indépendants français"),
    P("Le modèle Eventy permet à des centaines d'auto-entrepreneurs et micro-entreprises de vivre du voyage. Un créateur indépendant qui vend 2 voyages par mois (76 voyageurs) génère, à 5 % de marge brute partagée, environ 3 000 € de revenu mensuel net. Pour beaucoup, c'est la différence entre un emploi salarié subi et une activité indépendante choisie."),
    H3("Ce que nous apportons aux fournisseurs locaux"),
    P("Avec 38 voyageurs par bus, chaque voyage représente :"),
    Bullet("1 nuit ou plus dans un ou plusieurs hôtels français — 38 chambres en moyenne."),
    Bullet("2 à 4 repas pris en restaurants locaux — 76 à 152 couverts."),
    Bullet("Une location d'autocar français — bus + chauffeur, économie nationale."),
    Bullet("Des activités locales — billets de musées, guides, ateliers, animations."),
    P("À l'échelle An 2 (200 voyages par semaine), Eventy fait travailler chaque semaine plus de 200 hôtels, 400 restaurants, des dizaines d'autocaristes et des centaines d'activités. C'est une marketplace réelle, pas virtuelle."),
    H3("Ce que nous apportons à l'État"),
    Bullet("TVA marge tourisme — collectée en France, sur la marge de chaque voyage."),
    Bullet("Impôt sur les sociétés — payé en France, sur les bénéfices Eventy."),
    Bullet("Cotisations sociales — sur les salaires de l'équipe Eventy."),
    Bullet("Charges patronales sur les emplois directs et indirects créés."),
    Bullet("Taxe de séjour — collectée et reversée par les hôtels partenaires."),

    H2("2.3. Pourquoi nous avons besoin du soutien de la France"),
    P("Une agence de voyages en création se heurte à un paradoxe : pour exercer, elle doit obtenir une garantie financière ; pour obtenir cette garantie, elle doit démontrer une solidité que seule l'exercice peut construire. C'est un cercle. Le rompre demande un acte de confiance — celui des garants, celui d'Atout France, celui des partenaires bancaires."),
    P("Nous demandons à la France — à ses institutions, à ses garants, à ses fonctionnaires — de regarder ce dossier avec bienveillance et exigence. Bienveillance parce que nous portons un projet sincère, étayé, créateur d'emplois français ; exigence parce que la protection du consommateur ne souffre aucun compromis et que nous nous engageons à toutes les obligations qu'elle implique."),

    H2("2.4. Liberté de l'économie, liberté des revenus"),
    P("Eventy Life porte une vision politique au sens noble : la liberté économique pour ceux qui créent. Notre modèle n'aspire pas la valeur — il la fait circuler. C'est une distinction structurante par rapport aux plateformes mondialisées qui captent l'essentiel de la marge à l'autre bout d'un océan."),
    H3("Une plateforme qui redistribue, plutôt qu'extraire"),
    P("À chaque voyage commercialisé, Eventy redistribue mécaniquement, et avant toute charge interne :"),
    Bullet("Une rémunération « vendeur » de 5 % HT à tout acteur qui amène un voyageur dans l'écosystème — créateur, ambassadeur, influenceur, partenaire HRA, indépendant local."),
    Bullet("Une marge « créateur » de 3 % supplémentaires sur les prestations HRA, pour celui qui conçoit et anime le voyage."),
    Bullet("Une rémunération directe aux partenaires HRA — hôtels, restaurants, activités — calibrée pour qu'ils gagnent dignement."),
    Bullet("Une rémunération aux transporteurs, animateurs, guides, accompagnateurs."),
    P("Eventy ne marge pas sur les fonctions périphériques — pas de marge sur les cartes à gratter, sur la gamification, sur les badges, sur les contenus sociaux. Tous ces éléments servent l'expérience du voyageur sans alourdir le prix. Eventy se rémunère uniquement où elle apporte une valeur tangible."),
    H3("L'écosystème ouvert"),
    P("Une particularité d'Eventy : aucune frontière fermée entre les rôles. Un partenaire HRA peut devenir vendeur s'il partage les voyages à ses propres clients. Un créateur peut accroître ses revenus en vendant lui-même les voyages qu'il a conçus — il cumule alors marge créateur et marge vendeur. Un voyageur fidèle peut, à son tour, devenir ambassadeur. La plateforme est conçue pour permettre à chaque acteur de progresser."),
    P("Cette ouverture libère les revenus, libère les vocations, et fait croître l'écosystème par capillarité — chaque acteur a un intérêt direct à attirer de nouveaux acteurs et à élargir le cercle. C'est une mécanique vertueuse, économiquement et socialement."),
    H3("Liberté économique et protection consommateur — non-contradictoires"),
    P("La liberté économique que nous défendons ne s'oppose pas à la protection du consommateur. Au contraire : elle s'y conjugue. Plus l'écosystème est large et solide, plus la chaîne de responsabilité est dense et plus la garantie financière, l'assurance RC Pro et le Pack Sérénité d'Eventy fonctionnent comme un filet de sécurité absolu pour le voyageur. La liberté économique d'Eventy est encadrée par une rigueur réglementaire totale — c'est précisément le sens de ce dossier."),

    H2("2.5. La satisfaction du besoin — au cœur du modèle"),
    P("Eventy ne vend pas un événement en soi. Eventy vend une solution complète à un besoin — celui de voyager en groupe, sans avoir à tout gérer soi-même. Cette nuance est essentielle pour comprendre la légitimité d'Eventy à exercer."),
    H3("Le voyage est le cœur"),
    P("Tout dans Eventy converge vers une chose : que le voyageur, du premier clic à la photo souvenir, se sente accompagné, écouté, rassuré, réjoui. Le voyage est le cœur du modèle. Le transport, l'hébergement, la restauration, les activités, l'animation, l'accompagnement humain — tout sert ce cœur."),
    H3("Tout le reste vient en complément"),
    P("Les composantes périphériques d'Eventy — le système d'énergie, les jeux, les badges, les groupes sociaux, le wallet voyageur — ne sont pas des produits indépendants. Ce sont des compléments qui enrichissent l'expérience sans jamais l'alourdir. Aucune de ces composantes n'est une condition d'achat ; toutes peuvent être ignorées par le voyageur qui ne souhaite que voyager."),
    H3("Pourquoi cela compte pour Atout France et l'APST"),
    P("Eventy se présente comme un opérateur de voyages au sens strict du Code du Tourisme — pas comme une plateforme événementielle ni un réseau social. Notre activité réglementée est centrée sur la vente et l'organisation de voyages à forfait, conformément aux articles L211-1 et suivants. Toutes les obligations de garantie financière, de RC Pro, d'information précontractuelle et de médiation s'appliquent intégralement, sans exception et sans contournement."),

    H2("2.6. Pérennité — un modèle conçu pour durer"),
    P("La pérennité d'Eventy repose sur quatre piliers complémentaires."),
    Numbered("Faibles coûts fixes structurels : la plateforme technique tourne pour environ 49 € par mois en hébergement. Le levier de profitabilité est exceptionnel."),
    Numbered("Modèle scalable : le coût marginal d'un voyage supplémentaire est proche de zéro. Doubler le volume ne double pas les coûts fixes."),
    Numbered("Diversification géographique : 12 destinations en An 1, 25 en An 2. Aucune dépendance à un marché unique."),
    Numbered("Auto-financement : le fondateur a auto-financé l'intégralité de la R&D (plus de 1 000 000 de lignes de code). Le projet ne dépend pas d'une levée de fonds pour exister."),
    PB(),
  ];
}

// ---------- 3. Cadre légal ----------
function partie3CadreLegal() {
  return [
    H1("3. Cadre légal et obligations réglementaires", "partie3"),
    Quote("La sérénité du voyageur passe par la conformité absolue de l'opérateur. C'est non-négociable."),

    H2("3.1. Le régime juridique applicable"),
    P("L'activité d'Eventy Life relève du Livre II du Code du Tourisme — Activités et professions du tourisme — Chapitre I : Régime de la vente de voyages et de séjours (articles L211-1 à L211-24)."),
    P("Le cadre européen est fixé par la directive (UE) 2015/2302 du Parlement européen et du Conseil du 25 novembre 2015 relative aux voyages à forfait et aux prestations de voyage liées. Cette directive a été transposée en droit français par :"),
    Bullet("Ordonnance n° 2017-1717 du 20 décembre 2017 — transposition de la directive."),
    Bullet("Décret n° 2017-1871 du 29 décembre 2017 — application de l'ordonnance."),
    Bullet("Arrêté du 1er mars 2018 — modèle de formulaire d'information précontractuelle."),
    P("L'application des nouvelles règles est effective depuis le 1er juillet 2018. Eventy Life se conforme strictement à ce cadre."),

    H2("3.2. L'article L211-18 du Code du Tourisme"),
    P("Pivot de l'activité, l'article L211-18 énonce que toute personne physique ou morale exerçant l'activité de vente ou d'organisation de voyages doit être immatriculée au registre tenu par Atout France et justifier, à l'égard des voyageurs, d'une garantie financière suffisante."),
    P("La garantie est spécifiquement affectée :"),
    Bullet("Au remboursement des fonds reçus pour les forfaits touristiques, prestations de voyage liées et certains services de voyage."),
    Bullet("À la prise en charge des frais de rapatriement en cas de défaillance de l'opérateur, lorsque le contrat inclut le transport des voyageurs."),
    P("Cette garantie résulte de l'engagement d'un organisme de garantie collective, d'un établissement de crédit, ou d'une entreprise d'assurance établie dans un État membre de l'Union européenne."),

    H2("3.3. La garantie illimitée depuis 2016"),
    P("Depuis le 1er janvier 2016 (décret pris en application de la loi du 22 juillet 2015 et de l'ordonnance de transposition), la garantie financière des opérateurs du tourisme doit être illimitée — c'est-à-dire couvrir 100 % des fonds déposés par les clients, sans plafond contractuel."),
    P("Cette obligation s'applique tant aux opérateurs en cours de création qu'aux opérateurs déjà actifs. Les seuils minimaux historiques fixés par l'arrêté du 23 décembre 2009 (200 000 € pour une agence en création) demeurent un plancher de référence, mais la couverture effective doit suivre la progression du volume d'affaires."),

    H2("3.4. Les obligations corrélatives"),
    P("La garantie financière n'est qu'un volet du dispositif de protection du voyageur. Les obligations corrélatives portent sur :"),
    H3("Information précontractuelle (art. L211-8 et L211-9)"),
    P("Avant la conclusion du contrat, l'opérateur doit communiquer au voyageur, sur un support durable, le formulaire d'information standardisé prévu par l'arrêté du 1er mars 2018, ainsi que les caractéristiques principales du voyage : destination, itinéraire, dates, nombre de nuitées, transport, hébergement, repas, visites et excursions, taille minimale du groupe, langue utilisée, accessibilité, prix total TTC incluant taxes et frais, modalités de paiement, conditions d'annulation, identité du garant financier, identité du médiateur."),
    P("Ces informations font partie intégrante du contrat et ne peuvent être modifiées qu'avec l'accord exprès du voyageur."),
    H3("Responsabilité civile professionnelle (art. L211-16 et L211-17)"),
    P("L'opérateur est responsable de plein droit de la bonne exécution des prestations prévues au contrat. Il doit être assuré en responsabilité civile professionnelle pour couvrir les dommages corporels, matériels et immatériels susceptibles de survenir. Eventy souscrira une RC Pro Tourisme avec un plafond de garantie minimum de 1 500 000 € (couverture standard du marché)."),
    H3("Médiation des litiges (art. L612-1 et suivants Code de la consommation)"),
    P("L'opérateur doit adhérer à un dispositif de médiation conventionnée pour permettre au consommateur la résolution extrajudiciaire des litiges. Eventy adhérera à la Médiation Tourisme et Voyage (MTV)."),
    H3("Information du voyageur en cours de voyage"),
    P("L'opérateur doit fournir une assistance appropriée dans des délais raisonnables au voyageur en difficulté ; cette obligation, prévue par la directive, est intégrée nativement dans le Pack Sérénité Eventy (inclus, sans surcoût)."),

    H2("3.5. Les droits du voyageur"),
    P("La directive (UE) 2015/2302, transposée en droit français, garantit au voyageur des droits intangibles. Eventy s'engage à les respecter intégralement."),
    makeTable({
      widths: [3000, 6360],
      header: ["Droit du voyageur", "Mise en œuvre Eventy"],
      rows: [
        ["Information précontractuelle complète", "Formulaire standardisé + fiche détaillée sur eventylife.fr"],
        ["Contrat sur support durable", "Email récapitulatif + espace voyageur en ligne"],
        ["Modification du prix encadrée", "Augmentation max 8 % — au-delà, droit au remboursement intégral"],
        ["Résolution avant départ", "Frais de résolution barème transparent en CGV"],
        ["Cession du contrat à un tiers", "Possible jusqu'à 7 jours avant le départ"],
        ["Responsabilité de plein droit", "Eventy reste responsable de tous les sous-traitants"],
        ["Assistance en cas de difficulté", "Pack Sérénité — ligne d'assistance 24/7"],
        ["Remboursement en cas de défaillance", "Couvert par la garantie financière APST"],
        ["Rapatriement en cas de défaillance", "Couvert par la garantie financière APST"],
        ["Médiation", "MTV — Médiation Tourisme et Voyage"],
      ],
    }),
    PB(),
  ];
}

// ---------- 4. Données financières ----------
function partie4Finance() {
  return [
    H1("4. Données financières prévisionnelles", "partie4"),
    Quote("La transparence est notre meilleure garantie. Voici nos chiffres, posés sur la table."),

    H2("4.1. Hypothèses fondatrices"),
    P("Les projections financières d'Eventy Life reposent sur les hypothèses suivantes, validées au niveau de la direction le 29 avril 2026."),
    makeTable({
      widths: [4680, 4680],
      header: ["Hypothèse", "Valeur retenue"],
      rows: [
        ["Capacité bus", "53 voyageurs (modèle nominal)"],
        ["Taux de remplissage moyen", "38 voyageurs / voyage"],
        ["Panier moyen voyageur (TTC)", "800 €"],
        ["CA moyen par voyage", "30 400 €"],
        ["Décomposition du CA — prestations HRA", "≈ 60 % du CA — soit 18 240 € / voyage"],
        ["Décomposition du CA — transport", "≈ 25 % du CA — soit 7 600 € / voyage"],
        ["Décomposition du CA — taxes, accompagnement, divers", "≈ 15 % du CA — soit 4 560 € / voyage"],
        ["Marge socle Eventy sur HRA", "≈ 8 % des prestations HRA"],
        ["Marge créateur (sur HRA)", "+ 3 points sur HRA — versés au créateur du voyage"],
        ["Marge vendeur (sur CA voyage HT)", "5 % HT — versés à tout vendeur (créateur, ambassadeur, influenceur, HRA partageant, indépendant)"],
        ["Eventy net (marge HRA – part créateur)", "≈ 5 % de la marge HRA — soit ≈ 3 % du CA voyage"],
        ["TVA applicable", "TVA sur la marge — régime tourisme (BOI-TVA-SECT-60)"],
        ["Saisonnalité", "Pic mai-juillet, plateau bas février"],
        ["Cadence de croisière An 1", "10 voyages/sem au T4 (≈ 380 voyageurs/sem)"],
      ],
    }),

    H2("4.2. Compte de résultat prévisionnel — Année 1"),
    P("Le compte de résultat An 1 est calibré sur 12 mois d'activité, avec une montée en charge progressive de 0 voyage en M1 à 10 voyages par semaine en M12. Le CA cumulé sur l'année représente environ 16 millions d'euros. La présentation suit l'architecture distribuée du modèle Eventy : achats externes pass-through → marge brute opérée → redistribution vendeur → redistribution créateur → marge nette Eventy → charges Eventy → résultat."),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Montant (€)", "% du CA"],
      rows: [
        ["Chiffre d'affaires voyage HT (assiette TVA marge)", "16 000 000", "100,0 %"],
        ["Prestations HRA achetées aux fournisseurs", "8 880 000", "55,5 %"],
        ["Transport (autocaristes, aérien) refacturé sans marge", "4 000 000", "25,0 %"],
        ["Taxes, accompagnement, Pack Sérénité externe, divers", "1 350 000", "8,4 %"],
        ["Total achats externes (pass-through + HRA)", "14 230 000", "88,9 %"],
        ["Marge brute opérée par Eventy", "1 770 000", "11,1 %"],
        ["dont Commission vendeur (5 % HT du CA voyage)", "800 000", "5,0 %"],
        ["dont Commission créateur (≈ 3 % sur HRA refacturé)", "290 000", "1,8 %"],
        ["Marge nette opérationnelle Eventy (avant charges internes)", "680 000", "4,3 %"],
        ["Charges salariales équipe Eventy (5 ETP moyens)", "180 000", "1,1 %"],
        ["Charges techniques (Scaleway, Vercel, Stripe, divers)", "12 000", "0,1 %"],
        ["Garantie financière + RC Pro + Atout France + médiation", "4 500", "0,03 %"],
        ["Marketing & communication", "30 000", "0,2 %"],
        ["Frais juridiques, comptables, divers", "25 000", "0,2 %"],
        ["Résultat avant impôt", "≈ 428 500", "2,7 %"],
        ["Impôt sur les sociétés (IS, taux PME)", "≈ 107 000", "0,7 %"],
        ["Résultat net An 1", "≈ 321 500", "2,0 %"],
      ],
    }),
    P("Lecture de ce tableau : sur 100 € de chiffre d'affaires voyage, environ 88,9 € retournent immédiatement dans l'économie locale et européenne (achats HRA, transport, accompagnement, taxes). Sur les 11,1 € de marge brute restante, 5 € rémunèrent le vendeur, 1,8 € rémunère le créateur indépendant qui a conçu le voyage, et 4,3 € reviennent à Eventy pour couvrir ses charges internes. Après charges Eventy (équipe, technique, conformité, marketing, juridique), la marge nette finale est d'environ 2 % du CA — un modèle volontairement frugal en An 1, où la priorité absolue est la qualité du voyage et la satisfaction du voyageur."),
    P("La redistribution directe aux indépendants français (vendeurs + créateurs) totalise 1 090 000 € en An 1, soit 6,8 % du CA reversé sans intermédiaire dans le tissu économique national."),

    H2("4.3. Compte de résultat prévisionnel — Année 2"),
    P("L'année 2 voit la cadence passer de 10 à 100, puis 200 voyages par semaine, avec ouverture de l'Europe complète. Le CA cumulé est estimé à 80 millions d'euros. La même architecture distribuée s'applique, à plus grande échelle."),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Montant (€)", "% du CA"],
      rows: [
        ["Chiffre d'affaires voyage HT", "80 000 000", "100,0 %"],
        ["Prestations HRA achetées aux fournisseurs", "44 400 000", "55,5 %"],
        ["Transport refacturé sans marge", "20 000 000", "25,0 %"],
        ["Taxes, accompagnement, Pack Sérénité, divers", "6 750 000", "8,4 %"],
        ["Total achats externes (pass-through + HRA)", "71 150 000", "88,9 %"],
        ["Marge brute opérée par Eventy", "8 850 000", "11,1 %"],
        ["dont Commission vendeur (5 % HT du CA)", "4 000 000", "5,0 %"],
        ["dont Commission créateur (≈ 3 % sur HRA)", "1 450 000", "1,8 %"],
        ["Marge nette opérationnelle Eventy (avant charges)", "3 400 000", "4,3 %"],
        ["Charges salariales (12 ETP moyens)", "560 000", "0,7 %"],
        ["Charges techniques", "60 000", "0,1 %"],
        ["Garantie financière + RC Pro + assurances", "45 000", "0,1 %"],
        ["Marketing & communication", "180 000", "0,2 %"],
        ["Frais juridiques, comptables, divers", "85 000", "0,1 %"],
        ["Résultat avant impôt", "≈ 2 470 000", "3,1 %"],
        ["Impôt sur les sociétés", "≈ 617 500", "0,8 %"],
        ["Résultat net An 2", "≈ 1 852 500", "2,3 %"],
      ],
    }),
    P("À l'échelle An 2, la redistribution directe aux indépendants français (vendeurs + créateurs) représente près de 5,5 millions d'euros. C'est l'équivalent d'environ 100 à 200 emplois indépendants à temps plein générés ou consolidés par l'écosystème Eventy en France."),

    H2("4.4. Plan de trésorerie 24 mois — vue synthétique"),
    P("Le plan de trésorerie reflète un fonctionnement structurellement positif : Eventy encaisse les acomptes des voyageurs avant le départ, et règle ses fournisseurs aux échéances contractuelles (transport, hébergement). Le solde de trésorerie se construit positivement dès le T2 de l'année 1."),
    makeTable({
      widths: [2000, 2340, 2340, 2680],
      header: ["Trimestre", "Encaissements (€)", "Décaissements (€)", "Solde cumulé fin de période (€)"],
      rows: [
        ["T1 An 1", "350 000", "320 000", "30 000"],
        ["T2 An 1", "2 600 000", "2 470 000", "160 000"],
        ["T3 An 1", "5 200 000", "4 990 000", "370 000"],
        ["T4 An 1", "7 850 000", "7 600 000", "620 000"],
        ["T1 An 2", "12 000 000", "11 720 000", "900 000"],
        ["T2 An 2", "20 000 000", "19 600 000", "1 300 000"],
        ["T3 An 2", "23 000 000", "22 540 000", "1 760 000"],
        ["T4 An 2", "25 000 000", "24 480 000", "2 280 000"],
      ],
    }),
    P("Le solde de trésorerie cumulé en fin d'An 1 (≈ 620 000 €) et en fin d'An 2 (≈ 2 280 000 €) constitue un coussin de sécurité confortable face au volume de fonds clients en transit."),

    H2("4.5. Calibrage de la garantie financière demandée"),
    P("Conformément à l'article R211-30 du Code du Tourisme et à l'arrêté du 23 décembre 2009 (article 5), le montant de la garantie financière est calculé à partir des fonds maximums susceptibles d'être détenus par l'opérateur à un instant donné. Pour une agence en création, le minimum réglementaire historique est de 200 000 €, étant rappelé que la garantie effective doit demeurer illimitée."),
    H3("Méthode de calcul"),
    P("Le montant maximal de fonds clients en attente de prestation (acomptes versés mais voyage non encore commencé) est estimé selon la formule :"),
    PR([
      new TextRun({ text: "Fonds en transit max ≈ ", size: 22, font: "Calibri" }),
      new TextRun({ text: "CA mensuel pic × 50 %", size: 22, bold: true, font: "Calibri", color: COLOR.orange }),
      new TextRun({ text: " (durée moyenne entre acompte et voyage : 15 jours)", size: 22, font: "Calibri" }),
    ]),
    H3("Estimation des fonds maximums en transit"),
    makeTable({
      widths: [3000, 2000, 2000, 2360],
      header: ["Période", "CA mensuel pic (€)", "Fonds en transit (€)", "Garantie cible (€)"],
      rows: [
        ["An 1 — démarrage T1-T2", "1 200 000", "600 000", "≥ 600 000"],
        ["An 1 — pic T4", "2 500 000", "1 250 000", "≥ 1 250 000"],
        ["An 2 — pic T2-T3", "8 000 000", "4 000 000", "≥ 4 000 000"],
      ],
    }),
    P("Eventy Life sollicite donc une garantie financière de 1 600 000 € pour son année 1 (10 % du CA prévisionnel annuel — niveau d'exigence usuel des garants), avec indexation contractuelle automatique à la progression du CA. Eventy s'engage à transmettre trimestriellement à l'APST une déclaration certifiée du volume de fonds détenus, afin que la couverture demeure en permanence supérieure aux fonds réellement en transit."),

    H2("4.6. Coûts de la conformité — budget engagé"),
    P("Eventy Life a budgété de manière exhaustive l'intégralité des coûts liés à la conformité réglementaire. Aucune ligne n'est laissée à l'aléa."),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Montant prévu", "Périodicité"],
      rows: [
        ["Cotisation APST (fixe)", "≈ 2 100 €", "Annuel"],
        ["Cotisation APST (part variable, ≈ 0,7 % du CA distribué)", "≈ variable", "Annuel"],
        ["Contre-garantie personnelle dirigeant", "10 000 €", "One-shot"],
        ["Frais d'immatriculation Atout France", "150 €", "Tous les 3 ans"],
        ["Assurance RC Pro (Hiscox / Galian / CMB)", "≈ 1 000 €", "Annuel"],
        ["Adhésion MTV (médiation)", "0 €", "Annuel"],
        ["Frais juridiques (avocat tourisme — CGV, contrats)", "3 000 € à 5 000 €", "One-shot puis ajustements"],
        ["Expert-comptable spécialisé tourisme", "≈ 200 €/mois", "Mensuel"],
      ],
    }),
    P("Le budget total de conformité An 1 est compris entre 17 000 € et 22 000 €, intégralement provisionné dans la trésorerie de lancement."),
    PB(),
  ];
}

// ---------- 5. Documents juridiques ----------
function partie5Documents() {
  return [
    H1("5. Pièces juridiques de référence", "partie5"),
    Quote("Tous les documents légaux d'Eventy Life convergent vers une seule promesse : protection absolue du voyageur."),

    H2("5.1. Pièces du dossier — checklist exhaustive"),
    P("Conformément aux exigences de l'APST, d'Atout France et des garants tiers, le dossier complet est constitué des pièces suivantes (réf. liste de pièces APST 2026)."),
    makeTable({
      widths: [600, 5060, 1850, 1850],
      header: ["#", "Pièce", "Statut", "Source"],
      rows: [
        ["1", "Extrait Kbis (moins de 3 mois)", "À fournir post-immatriculation SAS", "Greffe"],
        ["2", "Statuts SAS certifiés conformes (signés)", "En finalisation — modèle joint", "Avocat tourisme"],
        ["3", "Pacte d'associés (le cas échéant)", "Mono-actionnariat — N/A à la création", "—"],
        ["4", "Justificatif d'identité du dirigeant", "Disponible", "David Eventy"],
        ["5", "CV détaillé du dirigeant (capacité professionnelle)", "Joint au dossier", "Annexe A"],
        ["6", "Justificatif de la capacité professionnelle", "Voir partie 6", "Annexe A"],
        ["7", "Compte de résultat prévisionnel An 1 / An 2", "Joint — voir partie 4", "Annexe B"],
        ["8", "Plan de trésorerie 24 mois", "Joint — voir partie 4", "Annexe B"],
        ["9", "Tableau du volume d'affaires prévisionnel", "Joint — voir partie 4", "Annexe B"],
        ["10", "Description détaillée du projet (activité, cible, fonctionnement)", "Voir parties 1 et 2", "Document principal"],
        ["11", "Attestation d'assurance RC Pro", "À souscrire — pré-engagement Hiscox", "Annexe C"],
        ["12", "Justificatif d'occupation des locaux (bail ou domiciliation)", "À fournir", "Bailleur / domiciliation"],
        ["13", "RIB du compte professionnel", "À ouvrir post-Kbis", "Banque"],
        ["14", "Conditions Générales de Vente (CGV)", "Conformes directive 2015/2302 — voir partie 7", "Annexe D"],
        ["15", "Mentions légales du site", "Conformes — voir partie 7", "eventylife.fr"],
        ["16", "Politique RGPD et de confidentialité", "Conformes — voir partie 7", "eventylife.fr"],
        ["17", "Modèle de contrat type voyageur", "Voir partie 7", "Annexe D"],
        ["18", "Liste des destinations et programmes types", "Joint — voir Annexe E", "Annexe E"],
        ["19", "Liste des partenaires identifiés (HRA, transporteurs)", "Joint — voir Annexe F", "Annexe F"],
        ["20", "Déclaration sur l'honneur de non-condamnation du dirigeant", "Joint", "Annexe G"],
      ],
    }),

    H2("5.2. Statuts SAS — clauses structurantes"),
    P("Les statuts d'Eventy Life SAS, en cours de finalisation avec un avocat spécialisé en droit du tourisme, intègrent les clauses suivantes — déterminantes pour l'examen du dossier."),
    H3("Objet social (clause 2)"),
    P("« La société a pour objet, en France et à l'étranger : l'organisation, la promotion, la commercialisation et la vente de voyages, séjours et prestations touristiques à forfait au sens des articles L211-1 et suivants du Code du Tourisme ; la conception et l'exploitation d'une plateforme numérique de mise en relation entre voyageurs et créateurs de voyages indépendants ; la fourniture de services connexes d'assistance, d'accompagnement et d'assurance dans le cadre des séjours organisés ; toutes opérations commerciales, industrielles, financières, mobilières ou immobilières se rapportant directement ou indirectement à l'objet social ou de nature à favoriser son développement. »"),
    H3("Capital social (clause 6)"),
    P("Le capital initial est fixé à 3 000 € intégralement libéré à la constitution, divisé en 3 000 actions ordinaires de 1 € de nominal. Le capital sera porté à 10 000 € au plus tard à l'issue de la première levée de fonds ou de la fin de la première année d'exercice."),
    H3("Engagement du président (clause 12)"),
    P("Le président s'engage personnellement à ne pas verser de dividendes tant que le résultat distribuable n'aura pas reconstitué un fonds de réserve dédié à la couverture des risques tourisme à hauteur de 5 % du chiffre d'affaires annuel. Cette clause de réserve volontaire renforce la protection des voyageurs au-delà des obligations légales."),

    H2("5.3. Pacte d'associés — principes pour la phase de croissance"),
    P("À la constitution, Eventy Life est une SAS unipersonnelle. Lors d'une éventuelle entrée d'associés (levée de fonds, partenariat stratégique), un pacte d'associés sera conclu et joint au registre. Les principes structurants sont fixés en amont :"),
    Bullet("Préservation du contrôle du fondateur sur les orientations métier (vote double sur changement d'objet social et de modèle économique)."),
    Bullet("Clauses anti-dilution sur les rounds futurs."),
    Bullet("Droit de préemption croisé entre associés en cas de cession."),
    Bullet("Clause de drag-along / tag-along en cas d'offre tierce."),
    Bullet("Répartition contractuelle des risques liés à la garantie financière (engagement du fondateur sur la contre-garantie personnelle)."),
    PB(),
  ];
}

// ---------- 6. Capacité professionnelle ----------
function partie6Capacite() {
  return [
    H1("6. Capacité professionnelle du dirigeant", "partie6"),
    Quote("La capacité professionnelle, c'est savoir voyager, savoir entreprendre, et savoir prendre soin des gens. C'est aussi un dossier."),
    P("L'article R211-43 du Code du Tourisme exige que le représentant légal d'un opérateur de voyages justifie d'une capacité professionnelle. Trois voies sont ouvertes par la réglementation."),
    H2("6.1. Les trois voies de justification"),
    Numbered("Diplôme : BTS Tourisme, Licence professionnelle Métiers du Tourisme, ou diplôme équivalent inscrit au RNCP."),
    Numbered("Expérience professionnelle : 2 années à un poste de direction dans une agence de voyages immatriculée, ou 4 années à un poste d'encadrement dans le secteur du tourisme."),
    Numbered("Recrutement d'un salarié justifiant lui-même de la capacité — option de repli."),
    H2("6.2. Voie retenue par David Eventy"),
    P("Le dirigeant David Eventy choisit, après concertation avec son conseil juridique, la voie qui combine au mieux :"),
    Bullet("Son parcours d'entrepreneur autodidacte avec expérience du secteur tourisme via Eventy en phase de pré-lancement et tests."),
    Bullet("Sa formation continue : suivi d'une formation qualifiante en droit du tourisme, fiscalité agence de voyages, gestion opérationnelle (modules 2025-2026)."),
    Bullet("Le recrutement, dans les 6 premiers mois, d'un directeur des opérations titulaire d'un BTS Tourisme ou d'une expérience certifiée — option de sécurité."),
    P("La preuve de la capacité professionnelle sera apportée par : (i) le CV détaillé du dirigeant en Annexe A, (ii) les attestations de formation, (iii) le contrat de travail du directeur des opérations dès sa signature, et (iv) toute pièce additionnelle demandée par Atout France lors de l'instruction."),
    H2("6.3. Engagement de formation continue"),
    P("Le dirigeant s'engage à suivre annuellement au minimum 21 heures de formation professionnelle dans les domaines : droit du tourisme, droit de la consommation, fiscalité voyage, gestion de crise et continuité d'activité. Cet engagement est inscrit dans le règlement intérieur de la société."),
    PB(),
  ];
}

// ---------- 7. Garanties offertes & protection consommateur ----------
function partie7Garanties() {
  return [
    H1("7. Garanties offertes et protection du consommateur", "partie7"),
    Quote("Le client ne doit pas avoir à se demander s'il est protégé. Il doit le savoir, sans même y penser."),

    H2("7.1. Architecture de protection — vue d'ensemble"),
    P("La protection du voyageur Eventy s'appuie sur une architecture en quatre niveaux complémentaires."),
    makeTable({
      widths: [600, 2400, 6360],
      header: ["#", "Niveau", "Mécanisme et effet"],
      rows: [
        ["1", "Garantie financière", "APST — couverture illimitée des fonds clients + rapatriement"],
        ["2", "Responsabilité civile", "RC Pro Tourisme — plafond minimum 1 500 000 € par sinistre"],
        ["3", "Pack Sérénité", "Inclus dans chaque voyage — annulation, rapatriement, médical, bagages"],
        ["4", "Médiation", "MTV — résolution extrajudiciaire gratuite des litiges"],
      ],
    }),

    H2("7.2. Compte séquestre des acomptes"),
    P("Conformément à l'esprit de l'article L211-18 et au-delà des obligations strictes du Code du Tourisme, Eventy Life met en place un mécanisme de cantonnement des fonds clients via Stripe Connect. Les acomptes versés par les voyageurs sont logés sur un compte de paiement dédié au voyage concerné, avec écriture comptable séparée et libération conditionnelle :"),
    Bullet("Acomptes : versés au compte de paiement Eventy, traçabilité totale en base de données."),
    Bullet("Libération aux fournisseurs : selon le calendrier contractuel négocié avec chaque prestataire."),
    Bullet("Solde voyageur : libéré au plus tôt 30 jours avant le départ et au plus tard à la veille du départ."),
    Bullet("Rapprochement APST : déclaration trimestrielle des fonds en transit pour ajustement de la couverture."),
    P("Cette discipline interne s'ajoute à la garantie financière APST et constitue un standard de marché supérieur à la moyenne du secteur."),

    H2("7.3. Le Pack Sérénité — promesse Eventy"),
    P("Le Pack Sérénité n'est pas un produit d'assurance optionnel : c'est une promesse incluse dans chaque voyage, sans surcoût visible, sans case à cocher. Il couvre :"),
    Bullet("Annulation pour motif valable (médical, professionnel, familial)."),
    Bullet("Rapatriement médical et sanitaire — partout en Europe et au Maroc."),
    Bullet("Bagages perdus, volés ou détériorés — indemnisation simplifiée."),
    Bullet("Frais médicaux à l'étranger — avance et prise en charge."),
    Bullet("Assistance juridique en cas de litige sur place."),
    Bullet("Ligne d'assistance 24/7 — un humain au bout du fil, pas un robot."),
    P("Le Pack Sérénité est souscrit auprès d'un assureur tiers (en cours de sélection — Allianz Travel, Mutuaire ou équivalent) et représente un coût intégré dans le prix du voyage."),

    H2("7.4. CGV — points saillants"),
    P("Les Conditions Générales de Vente d'Eventy Life sont rédigées avec un avocat spécialisé en droit du tourisme. Elles intègrent intégralement les exigences de la directive (UE) 2015/2302 et des articles L211-1 à L211-24 du Code du Tourisme. Points-clés :"),
    Bullet("Information précontractuelle conforme à l'arrêté du 1er mars 2018 (formulaire standardisé)."),
    Bullet("Modification du prix limitée à 8 % — au-delà, droit du voyageur au remboursement intégral."),
    Bullet("Frais de résolution avant départ — barème transparent (% du prix selon délai)."),
    Bullet("Cession du contrat à un tiers — possible jusqu'à 7 jours avant départ."),
    Bullet("Responsabilité de plein droit d'Eventy pour la bonne exécution des prestations."),
    Bullet("Mention obligatoire du garant (APST) et du médiateur (MTV)."),
    Bullet("Désignation des juridictions compétentes — droit français applicable."),

    H2("7.5. Médiation — MTV"),
    P("Eventy Life adhère à l'Association de Médiation Tourisme et Voyage (MTV), 12 rue Eugène Sue, 75018 Paris. La médiation est gratuite pour le voyageur et accessible directement sur mtv.travel. La saisine du médiateur est mentionnée dans les CGV, dans le contrat type et dans la confirmation de réservation."),

    H2("7.6. RGPD et données personnelles"),
    P("Eventy Life s'engage au respect intégral du Règlement Général sur la Protection des Données (RGPD — règlement (UE) 2016/679). Les principes opérationnels :"),
    Bullet("Hébergement des données en France (Scaleway, Paris) — pas de transfert hors UE."),
    Bullet("Désignation d'un Délégué à la Protection des Données (DPO) externe au plus tard à 6 mois post-lancement."),
    Bullet("Politique de confidentialité publique sur eventylife.fr."),
    Bullet("Registre des traitements tenu et mis à jour."),
    Bullet("Droit d'accès, de rectification, d'effacement et de portabilité respectés."),
    Bullet("Conservation des données encadrée — 5 ans après dernière activité, sauf obligations légales spécifiques."),
    Bullet("Notification CNIL en cas de violation de données dans les 72 heures."),
    PB(),
  ];
}

// ---------- 8. Comparatif des garants ----------
function partie8Comparatif() {
  return [
    H1("8. Choix du garant — analyse comparée", "partie8"),
    Quote("Choisir son garant, c'est choisir avec qui on protège ses voyageurs. Ce n'est pas un détail."),

    H2("8.1. Cartographie des garants disponibles en France"),
    P("Trois familles d'organismes peuvent délivrer la garantie financière exigée par l'article L211-18 :"),
    Numbered("Organisme de garantie collective (statut associatif sans but lucratif) — APST."),
    Numbered("Compagnie d'assurance — Groupama Assurance-Crédit, ex-Atradius (en retrait du marché)."),
    Numbered("Établissement de crédit — caution bancaire (immobilise la trésorerie)."),

    H2("8.2. Tableau comparatif"),
    makeTable({
      widths: [2400, 2340, 2340, 2280],
      header: ["Critère", "APST", "Groupama Assurance-Crédit", "Caution bancaire"],
      rows: [
        ["Statut", "Association loi 1901 — secteur tourisme", "Compagnie d'assurance", "Établissement de crédit"],
        ["Part de marché tourisme", "≈ 2/3 des opérateurs", "≈ 25 %", "Marginal"],
        ["Acceptation par Atout France", "Acceptée sans réserve", "Acceptée", "Acceptée"],
        ["Coût annuel ordre de grandeur", "≈ 2 100 € fixe + 0,7 % du CA distribué", "Taux de prime sur engagement (variable)", "Commission bancaire + immobilisation tréso 50-100 %"],
        ["Contre-garantie en création", "Caution dirigeant 10 000 € possible", "Variable selon profil", "Nantissement compte"],
        ["Accompagnement adhérent", "Forte (réseau professionnel)", "Limité", "Faible"],
        ["Délai d'instruction", "2 à 4 semaines", "4 à 8 semaines", "1 à 4 semaines"],
        ["Réputation sur le marché", "Référence du secteur", "Solide mais en repli", "Neutre"],
      ],
    }),

    H2("8.3. Choix retenu — APST en première intention"),
    P("Eventy Life sollicite en première intention l'adhésion à l'APST. Les motifs de ce choix sont les suivants."),
    Numbered("Reconnaissance immédiate par Atout France et l'écosystème tourisme — gain de temps réglementaire."),
    Numbered("Modèle associatif aligné avec notre conviction de marché : la mutualisation au service de la sécurité du voyageur."),
    Numbered("Coût compatible avec le budget de lancement — pas d'effet d'éviction sur la trésorerie."),
    Numbered("Accompagnement réel des nouveaux adhérents — utile pour une jeune entreprise."),
    Numbered("Précédent favorable d'admission de plateformes technologiques innovantes."),
    P("En plan B, Eventy étudiera Groupama Assurance-Crédit — le contact préliminaire sera initié en parallèle pour disposer d'une alternative et négocier les conditions APST."),

    H2("8.4. Arguments à porter devant la commission APST"),
    P("Lors du passage en commission d'admission, Eventy mettra en avant :"),
    Bullet("Profil de risque structurellement bas — pas de billetterie aérienne sèche, pas de pré-paiement de longs courriers."),
    Bullet("Plateforme technique propriétaire avec traçabilité totale des fonds (Stripe Connect)."),
    Bullet("Modèle 38 voyageurs / voyage avec coûts directs payés à l'exécution (pas en pré-financement)."),
    Bullet("Pack Sérénité inclus — différenciation forte du marché, réducteur de litige."),
    Bullet("Discipline interne de cantonnement des fonds clients."),
    Bullet("Engagement du fondateur via contre-garantie personnelle."),
    Bullet("Volume prévisionnel — 1 400 voyageurs An 1, 100 000 voyageurs An 2 — base de cotisation variable significative et croissante."),
    PB(),
  ];
}

// ---------- 9. Calendrier ----------
function partie9Calendrier() {
  return [
    H1("9. Calendrier opérationnel — chemin critique", "partie9"),
    Quote("Pour partir en voyage, il faut d'abord poser les pieds par terre. Voici notre marche d'approche."),
    P("Le chemin critique de l'immatriculation et du lancement opérationnel d'Eventy Life se déploie sur 10 à 14 semaines, structurées autour des dépendances réglementaires."),
    makeTable({
      widths: [600, 3500, 1850, 1850, 1560],
      header: ["#", "Étape", "Durée cible", "Pré-requis", "Statut"],
      rows: [
        ["1", "Création de la SAS — dépôt du capital, statuts, annonce légale, immatriculation", "2 à 3 semaines", "Statuts validés avec avocat", "En cours"],
        ["2", "Obtention du Kbis", "Quelques jours après immatriculation", "Étape 1", "À venir"],
        ["3", "Souscription RC Pro Tourisme", "1 à 2 semaines", "Kbis", "Pré-engagement Hiscox"],
        ["4", "Dépôt du dossier APST — adhésion + garantie", "Préparation 1 sem. + instruction 2-4 sem.", "Kbis + RC Pro pré-engagée", "Email envoyé 05/03/2026"],
        ["5", "Passage en commission APST + délivrance attestation", "Mensuel", "Étape 4", "À venir"],
        ["6", "Dépôt du dossier d'immatriculation Atout France", "Dépôt en ligne", "Kbis + APST + RC Pro", "À venir"],
        ["7", "Délivrance du numéro IM Atout France", "1 mois maximum", "Étape 6 (dossier complet)", "À venir"],
        ["8", "Adhésion MTV (médiation)", "Quelques jours", "—", "À venir"],
        ["9", "Affichage IM sur site & documents", "Immédiat post-IM", "Étape 7", "À venir"],
        ["10", "Lancement commercial", "T1 An 1", "Étapes 1-9 complètes", "Cible mai 2026"],
      ],
    }),
    P("Eventy Life est aujourd'hui — 29 avril 2026 — engagé dans les étapes 1 à 4 simultanément. La cible commerciale est un lancement public en mai 2026, sous réserve de la délivrance des attestations APST et Atout France."),
    PB(),
  ];
}

// ---------- 10. Engagements ----------
function partie10Engagements() {
  return [
    H1("10. Engagements solennels d'Eventy Life", "partie10"),
    Quote("Un dossier ne vaut que par les engagements qu'il contient et la rigueur avec laquelle ils sont tenus."),
    P("Au nom d'Eventy Life SAS, le président David Eventy prend, par la signature de ce dossier, les engagements suivants — opposables à l'APST, à Atout France, et à toute autorité de contrôle."),
    H2("10.1. Engagements de conformité réglementaire"),
    Numbered("Maintenir en permanence une garantie financière conforme à l'article L211-18 du Code du Tourisme et illimitée selon le régime issu du décret de 2015."),
    Numbered("Maintenir en permanence une assurance RC Pro Tourisme avec un plafond minimum de 1 500 000 € par sinistre."),
    Numbered("Renouveler l'immatriculation Atout France à chaque échéance triennale, dans le strict respect des conditions de capacité, garantie et assurance."),
    Numbered("Adhérer en permanence à un dispositif de médiation des litiges de la consommation (MTV)."),
    Numbered("Respecter intégralement la directive (UE) 2015/2302 et ses textes de transposition."),
    Numbered("Respecter intégralement le RGPD (règlement (UE) 2016/679)."),
    H2("10.2. Engagements de transparence"),
    Numbered("Transmettre trimestriellement à l'APST une déclaration certifiée du volume de fonds clients en transit."),
    Numbered("Communiquer annuellement à l'APST le bilan, le compte de résultat et l'attestation de l'expert-comptable."),
    Numbered("Notifier sans délai tout incident significatif susceptible d'affecter la solvabilité."),
    Numbered("Tenir à disposition d'Atout France et de l'APST tous documents probants relatifs aux fonds détenus, aux contrats voyageurs et aux relations fournisseurs."),
    H2("10.3. Engagements financiers du dirigeant"),
    Numbered("Constituer une contre-garantie personnelle de 10 000 € (caution dirigeant)."),
    Numbered("Ne pas distribuer de dividendes tant que le fonds de réserve volontaire (5 % du CA annuel) n'est pas constitué."),
    Numbered("Maintenir en permanence un fonds de roulement positif et suffisant pour couvrir 60 jours de charges fixes."),
    H2("10.4. Engagements opérationnels"),
    Numbered("Cantonner les fonds clients via Stripe Connect avec écriture comptable séparée par voyage."),
    Numbered("Inclure le Pack Sérénité dans 100 % des voyages commercialisés — sans option ni surcoût visible."),
    Numbered("Tenir à jour un manuel qualité opérationnel — mise à jour annuelle minimum."),
    Numbered("Suivre une formation continue d'au moins 21 heures par an sur le droit du tourisme et la gestion de crise."),
    H2("10.5. Engagement de coopération avec les autorités"),
    P("Eventy Life s'engage à coopérer pleinement avec l'APST, Atout France, la DGCCRF, la Médiation Tourisme et Voyage, la CNIL et toute autorité de contrôle compétente. Aucune demande d'information, aucun audit, aucun contrôle ne se verra opposer un quelconque obstacle. La transparence est notre standard."),
    Spacer(),
    P("Fait à Paris, le 29 avril 2026.", { italics: true }),
    Spacer(),
    P("David Eventy", { bold: true }),
    P("Président, Fondateur — Eventy Life SAS"),
    PB(),
  ];
}

// ---------- 11. Annexes ----------
function partie11Annexes() {
  return [
    H1("11. Annexes — index des pièces jointes", "partie11"),
    P("Le présent dossier est accompagné des annexes suivantes, fournies sous forme de documents séparés ou de sections complémentaires. Elles peuvent être transmises à l'APST, à Atout France ou à tout garant tiers à leur demande."),
    makeTable({
      widths: [800, 4060, 4500],
      header: ["Réf.", "Annexe", "Contenu"],
      rows: [
        ["A", "CV détaillé du dirigeant", "Parcours, expérience, formation, capacité professionnelle"],
        ["B", "Modélisation financière complète", "Compte de résultat An 1 / An 2, plan de trésorerie 24 mois, hypothèses détaillées"],
        ["C", "Pré-engagement RC Pro", "Devis et conditions Hiscox / Galian / CMB"],
        ["D", "Conditions Générales de Vente — version intégrale", "CGV conformes directive 2015/2302, contrat type voyageur"],
        ["E", "Catalogue programmes types — saison 1", "10 voyages représentatifs, fiches techniques, prix"],
        ["F", "Liste des partenaires identifiés", "Autocaristes, hôtels, restaurants, activités — par destination"],
        ["G", "Déclaration sur l'honneur du dirigeant", "Non-condamnation, capacité à diriger, sincérité du dossier"],
        ["H", "Architecture technique de la plateforme", "Schéma fonctionnel, modules, traçabilité des fonds"],
        ["I", "Modèle de fiche d'information précontractuelle", "Conforme arrêté du 1er mars 2018"],
        ["J", "Politique de confidentialité et RGPD", "Document public eventylife.fr"],
      ],
    }),
    Spacer(),
    P("Toutes les annexes sont disponibles sur simple demande à eventylife@gmail.com.", { italics: true }),
    PB(),
  ];
}

// ---------- 12. Sources ----------
function partie12Sources() {
  return [
    H1("12. Sources réglementaires et bibliographiques", "partie12"),
    H2("12.1. Textes législatifs et réglementaires"),
    Bullet("Code du Tourisme — Articles L211-1 à L211-24 (régime de la vente de voyages et de séjours)."),
    Bullet("Code du Tourisme — Articles R211-26 à R211-34 (garantie financière)."),
    Bullet("Code du Tourisme — Articles L211-16 à L211-17 (responsabilité civile professionnelle)."),
    Bullet("Code du Tourisme — Article R211-43 (capacité professionnelle)."),
    Bullet("Arrêté du 23 décembre 2009 modifié — conditions de fixation de la garantie financière des agents de voyages."),
    Bullet("Arrêté du 29 octobre 2014 — modification de l'arrêté du 23 décembre 2009."),
    Bullet("Arrêté du 1er mars 2018 — formulaire d'information précontractuelle."),
    Bullet("Ordonnance n° 2017-1717 du 20 décembre 2017 — transposition de la directive (UE) 2015/2302."),
    Bullet("Décret n° 2017-1871 du 29 décembre 2017 — application de l'ordonnance de transposition."),
    Bullet("Directive (UE) 2015/2302 du Parlement européen et du Conseil du 25 novembre 2015 — voyages à forfait."),
    Bullet("Règlement (UE) 2016/679 — RGPD."),
    Bullet("Code de la consommation — Articles L612-1 et suivants (médiation)."),
    Bullet("BOI-TVA-SECT-60 — Régime de TVA marge applicable aux agences de voyages."),
    H2("12.2. Sources institutionnelles consultées"),
    Bullet("APST — Association Professionnelle de Solidarité du Tourisme — apst.travel"),
    Bullet("Atout France — Registre des opérateurs de voyages et de séjours — registre-operateurs-de-voyages.atout-france.fr"),
    Bullet("DGCCRF — Direction générale de la concurrence, de la consommation et de la répression des fraudes — economie.gouv.fr/dgccrf"),
    Bullet("MTV — Médiation Tourisme et Voyage — mtv.travel"),
    Bullet("CNIL — Commission nationale de l'informatique et des libertés — cnil.fr"),
    Bullet("Légifrance — legifrance.gouv.fr"),
    Bullet("INC — Institut national de la consommation — inc-conso.fr"),
    H2("12.3. Sources de marché"),
    Bullet("L'Écho Touristique — lechotouristique.com"),
    Bullet("TourMaG — tourmag.com"),
    Bullet("Tour Hebdo — tourhebdo.com"),
    Bullet("UNAT — Union Nationale des Associations de Tourisme — unat.asso.fr"),
    Spacer(),
    P("Toutes les références ci-dessus ont été consultées entre mars et avril 2026 dans le cadre de la préparation du présent dossier.", { italics: true }),
    PB(),
  ];
}

// ---------- Mot final ----------
function motFinal() {
  return [
    H1("Mot du fondateur", "motfinal"),
    Spacer(),
    Spacer(),
    P("Vous êtes arrivé au bout de ce dossier. Merci."),
    P("Tout ce qui est écrit ici, je le pense. Tout ce qui y est promis, je m'engage à le tenir. Eventy Life ne sera pas une boîte parfaite — aucune ne l'est. Mais Eventy sera une boîte sincère, qui prend soin de ses voyageurs comme on prend soin de ses proches, qui paie ses partenaires comme on paie un ami à qui l'on doit, et qui respecte les institutions françaises parce qu'elles font tenir la maison."),
    P("Si vous voyez dans ce dossier un dossier de plus, je n'aurai pas réussi à vous transmettre l'âme du projet. Si vous y voyez une promesse — celle de mille voyageurs accueillis comme on accueille un proche, de centaines d'indépendants qui vivent enfin de leur passion, et d'une plateforme française qui fait honneur au pays — alors le contrat moral entre Eventy et vous est posé."),
    P("Je suis à votre disposition. Pour un café, un appel, une commission, un audit — quoi que vous demandiez. Eventy Life est prête à se présenter et à se justifier, autant de fois qu'il le faudra, avec la même sincérité."),
    Spacer(),
    P("Avec gratitude et engagement,", { italics: true }),
    Spacer(),
    P("David Eventy", { bold: true }),
    P("Président, Fondateur"),
    P("Eventy Life SAS — eventylife.fr — eventylife@gmail.com"),
    Spacer(),
    Spacer(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
      children: [
        new TextRun({
          text: "Eventy Life — le voyage de groupe où tu n'as rien à gérer, tout à vivre.",
          size: 22,
          italics: true,
          font: "Calibri",
          color: COLOR.orange,
        }),
      ],
    }),
  ];
}

// ---------- Document ----------
const doc = new Document({
  creator: "David Eventy — Eventy Life SAS",
  title: "Eventy Life — Dossier de Garantie Financière",
  description: "Dossier complet de demande d'adhésion APST, immatriculation Atout France et conformité tourisme.",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Calibri", color: COLOR.blue },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: COLOR.orange },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: COLOR.blue },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "◦",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Eventy Life — Dossier de Garantie Financière",
                  size: 18,
                  italics: true,
                  font: "Calibri",
                  color: COLOR.gray,
                }),
              ],
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.orange, space: 4 },
              },
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
                new TextRun({
                  text: "Eventy Life SAS — eventylife.fr",
                  size: 18,
                  font: "Calibri",
                  color: COLOR.gray,
                }),
                new TextRun({ text: "\tPage ", size: 18, font: "Calibri", color: COLOR.gray }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  font: "Calibri",
                  color: COLOR.gray,
                }),
                new TextRun({ text: " / ", size: 18, font: "Calibri", color: COLOR.gray }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  size: 18,
                  font: "Calibri",
                  color: COLOR.gray,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...coverPage(),
        ...lettrePresentation(),
        ...sommaire(),
        ...partie1Presentation(),
        ...partie2Plaidoyer(),
        ...partie3CadreLegal(),
        ...partie4Finance(),
        ...partie5Documents(),
        ...partie6Capacite(),
        ...partie7Garanties(),
        ...partie8Comparatif(),
        ...partie9Calendrier(),
        ...partie10Engagements(),
        ...partie11Annexes(),
        ...partie12Sources(),
        ...motFinal(),
      ],
    },
  ],
});

const outputPath = process.argv[2] || "Eventy-Life-Dossier-Garantie-Financiere-COMPLET.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`✓ Dossier généré : ${outputPath} (${sizeKB} KB)`);
});
