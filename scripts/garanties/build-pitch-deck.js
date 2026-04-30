/**
 * Eventy Life — Pitch Deck Investisseurs (12 slides)
 *
 * Format : 16:9 widescreen · A4 paysage compatible
 * Palette : orange Eventy (#E87722), bleu marine (#1F4E79), crème (#FFF8EE)
 * Typo    : Calibri (header bold) + Calibri (body)
 *
 * Usage : node scripts/garanties/build-pitch-deck.js [output.pptx]
 */

const pptxgen = require("pptxgenjs");

const C = {
  orange: "E87722",
  blue: "1F4E79",
  blueLight: "D5E8F0",
  cream: "FFF8EE",
  white: "FFFFFF",
  gray: "555555",
  grayLight: "EEEEEE",
  black: "1A1A1A",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 × 7.5 in
pres.title = "Eventy Life — Pitch Deck Investisseurs";
pres.author = "David Eventy";
pres.subject = "Présentation aux partenaires Seed et Série A";

// --------- Helpers de mise en page ---------
function addFooter(slide, n, total) {
  slide.addText(
    [
      { text: "EVENTY LIFE — Confidentiel · ", options: { color: C.gray, fontSize: 9 } },
      { text: `${n} / ${total}`, options: { color: C.gray, fontSize: 9, bold: true } },
    ],
    { x: 0.5, y: 7.05, w: 12.3, h: 0.3, align: "center", fontFace: "Calibri" },
  );
}
function addAccent(slide) {
  // Trait orange en haut à gauche
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.25, h: 7.5, fill: { color: C.orange },
  });
}
function addTitle(slide, title) {
  slide.addText(title, {
    x: 0.6, y: 0.4, w: 12, h: 0.7,
    fontSize: 28, bold: true, color: C.blue, fontFace: "Calibri",
  });
}
function addSubtitle(slide, sub) {
  slide.addText(sub, {
    x: 0.6, y: 1.05, w: 12, h: 0.4,
    fontSize: 14, italic: true, color: C.orange, fontFace: "Calibri",
  });
}

// =============================================================
// SLIDE 1 — COVER
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.blue };

  // EVENTY LIFE en grand
  s.addText("EVENTY LIFE", {
    x: 0.5, y: 2.5, w: 12.3, h: 1.2,
    fontSize: 80, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });

  s.addText("Le voyage de groupe où tu n'as rien à gérer, tout à vivre.", {
    x: 0.5, y: 3.7, w: 12.3, h: 0.6,
    fontSize: 22, italic: true, color: C.white, fontFace: "Calibri",
    align: "center",
  });

  // Bandeau orange en bas
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 6.0, w: 13.333, h: 1.5, fill: { color: C.orange },
  });

  s.addText("PITCH INVESTISSEURS", {
    x: 0.5, y: 6.05, w: 12.3, h: 0.5,
    fontSize: 24, bold: true, color: C.white, fontFace: "Calibri",
    align: "center",
  });
  s.addText("Seed 200-300 K€ · Série A 500 K€ — 1 M€ · Sortie 5-7 ans", {
    x: 0.5, y: 6.5, w: 12.3, h: 0.4,
    fontSize: 14, color: C.cream, fontFace: "Calibri",
    align: "center",
  });
  s.addText("David Eventy — Président, Fondateur · 30 avril 2026 · eventylife.fr", {
    x: 0.5, y: 6.95, w: 12.3, h: 0.4,
    fontSize: 12, italic: true, color: C.cream, fontFace: "Calibri",
    align: "center",
  });
}

// =============================================================
// SLIDE 2 — LE PROBLÈME
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Le problème");
  addSubtitle(s, "Le voyage de groupe organisé est un marché fragmenté, opaque, qui maltraite à la fois ses voyageurs et ses indépendants.");

  // 3 colonnes : Voyageurs / Indépendants / Acteurs locaux
  const cols = [
    {
      x: 0.6, y: 1.7, w: 4.0, h: 5.0,
      header: "POUR LES VOYAGEURS",
      points: [
        "Marges agence opaques 15-25 %",
        "Assurance optionnelle, payante",
        "Process complexe (cagnotte, gestion)",
        "Aucun accompagnement humain",
        "Promesses non tenues",
      ],
    },
    {
      x: 4.7, y: 1.7, w: 4.0, h: 5.0,
      header: "POUR LES INDÉPENDANTS",
      points: [
        "Pas de plateforme, pas de garantie",
        "Pas d'assurance professionnelle",
        "Pas de paiement sécurisé",
        "Pas de visibilité ni d'outils",
        "Talents qui ne peuvent pas vivre",
      ],
    },
    {
      x: 8.8, y: 1.7, w: 4.0, h: 5.0,
      header: "POUR LES ACTEURS LOCAUX",
      points: [
        "OTA prélèvent 22 % de commission",
        "Cars à l'arrêt après crises",
        "Restaurants vides en semaine",
        "Hôtels familiaux étouffés",
        "Valeur captée hors UE",
      ],
    },
  ];

  cols.forEach((col) => {
    s.addShape(pres.ShapeType.rect, {
      x: col.x, y: col.y, w: col.w, h: col.h,
      fill: { color: C.blueLight },
      line: { color: C.blue, width: 1 },
    });
    s.addText(col.header, {
      x: col.x, y: col.y + 0.15, w: col.w, h: 0.4,
      fontSize: 14, bold: true, color: C.blue, fontFace: "Calibri",
      align: "center",
    });
    s.addText(
      col.points.map((p) => ({ text: p, options: { bullet: { code: "25CF" }, fontSize: 13 } })),
      {
        x: col.x + 0.2, y: col.y + 0.65, w: col.w - 0.4, h: col.h - 0.8,
        fontSize: 13, color: C.black, fontFace: "Calibri",
        valign: "top",
        paraSpaceAfter: 8,
      },
    );
  });

  addFooter(s, 2, 12);
}

// =============================================================
// SLIDE 3 — LA SOLUTION
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "La solution");
  addSubtitle(s, "Une plateforme française qui fait tourner la valeur entre voyageurs, indépendants et acteurs locaux — au lieu de l'extraire.");

  // Big stat à gauche, bullets à droite
  s.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.7, w: 5.0, h: 5.0,
    fill: { color: C.orange },
  });
  s.addText("11,1 %", {
    x: 0.6, y: 2.4, w: 5.0, h: 1.5,
    fontSize: 110, bold: true, color: C.white, fontFace: "Calibri",
    align: "center",
  });
  s.addText("DE MARGE BRUTE OPÉRÉE", {
    x: 0.6, y: 4.0, w: 5.0, h: 0.4,
    fontSize: 14, bold: true, color: C.white, fontFace: "Calibri",
    align: "center",
  });
  s.addText("dont 6,8 % redistribués\naux indépendants français", {
    x: 0.6, y: 4.7, w: 5.0, h: 1.0,
    fontSize: 14, italic: true, color: C.cream, fontFace: "Calibri",
    align: "center",
  });

  // Bullets droite
  s.addText(
    [
      { text: "Modèle distribué : ", options: { bold: true } },
      { text: "5 % HT vendeur · 3 pts créateur · marge socle Eventy 8 % sur HRA", options: {} },
    ],
    { x: 5.9, y: 1.8, w: 7.0, h: 0.6, fontSize: 16, color: C.black, fontFace: "Calibri" },
  );
  s.addText(
    [
      { text: "Pack Sérénité INCLUS ", options: { bold: true } },
      { text: "dans tous les voyages : assurance annulation, rapatriement, médical, ligne 24/7.", options: {} },
    ],
    { x: 5.9, y: 2.6, w: 7.0, h: 0.7, fontSize: 16, color: C.black, fontFace: "Calibri" },
  );
  s.addText(
    [
      { text: "Accompagnateur humain ", options: { bold: true } },
      { text: "présent du premier au dernier kilomètre — porte-à-porte.", options: {} },
    ],
    { x: 5.9, y: 3.5, w: 7.0, h: 0.7, fontSize: 16, color: C.black, fontFace: "Calibri" },
  );
  s.addText(
    [
      { text: "Transparence prix radicale ", options: { bold: true } },
      { text: "— décomposition publique sur chaque fiche voyage eventylife.fr", options: {} },
    ],
    { x: 5.9, y: 4.4, w: 7.0, h: 0.7, fontSize: 16, color: C.black, fontFace: "Calibri" },
  );
  s.addText(
    [
      { text: "Conformité réglementaire native ", options: { bold: true } },
      { text: "— Code Tourisme, directive UE 2015/2302, RGPD, garantie APST 1,6 M€.", options: {} },
    ],
    { x: 5.9, y: 5.3, w: 7.0, h: 0.8, fontSize: 16, color: C.black, fontFace: "Calibri" },
  );

  addFooter(s, 3, 12);
}

// =============================================================
// SLIDE 4 — MARCHÉ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Marché : le tourisme français, secteur stratégique");
  addSubtitle(s, "8 % du PIB, 1ère destination touristique mondiale, segment voyage de groupe en croissance.");

  // 4 grands chiffres en grille 2x2
  const stats = [
    { x: 0.7, y: 1.7, w: 5.9, h: 2.4, big: "200 Md€", label: "TOURISME FRANÇAIS / AN", sub: "8 % du PIB national" },
    { x: 6.8, y: 1.7, w: 5.9, h: 2.4, big: "2 M+", label: "EMPLOIS DIRECTS ET INDIRECTS", sub: "secteur tourisme français" },
    { x: 0.7, y: 4.2, w: 5.9, h: 2.4, big: "4-6 Md€", label: "VOYAGE DE GROUPE EN FRANCE", sub: "marché direct cible Eventy, fragmenté" },
    { x: 6.8, y: 4.2, w: 5.9, h: 2.4, big: "+6 à 8 %/an", label: "CROISSANCE SEGMENT POST-2020", sub: "rebond + recherche de lien social" },
  ];
  stats.forEach((stat) => {
    s.addShape(pres.ShapeType.rect, {
      x: stat.x, y: stat.y, w: stat.w, h: stat.h,
      fill: { color: C.cream },
      line: { color: C.orange, width: 2 },
    });
    s.addText(stat.big, {
      x: stat.x, y: stat.y + 0.2, w: stat.w, h: 1.0,
      fontSize: 50, bold: true, color: C.orange, fontFace: "Calibri",
      align: "center",
    });
    s.addText(stat.label, {
      x: stat.x, y: stat.y + 1.3, w: stat.w, h: 0.4,
      fontSize: 14, bold: true, color: C.blue, fontFace: "Calibri",
      align: "center",
    });
    s.addText(stat.sub, {
      x: stat.x, y: stat.y + 1.75, w: stat.w, h: 0.5,
      fontSize: 12, italic: true, color: C.gray, fontFace: "Calibri",
      align: "center",
    });
  });

  addFooter(s, 4, 12);
}

// =============================================================
// SLIDE 5 — MODÈLE ÉCONOMIQUE
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Modèle économique : architecture distribuée");
  addSubtitle(s, "Sur 100 € voyageur, 88,9 € retournent à l'économie réelle. Eventy garde ≈ 4,3 % avant charges.");

  const tableData = [
    [
      { text: "Acteur", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "Rémunération", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "Sur voyage 30 400 €", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
    ],
    [
      "EVENTY (plateforme + opérateur)",
      "Marge socle ≈ 8 % sur HRA refacturé",
      "≈ 1 459 € avant créateur",
    ],
    [
      "VENDEUR (toute personne qui place un voyage)",
      "5 % HT du CA voyage",
      "1 520 €",
    ],
    [
      "CRÉATEUR de voyage",
      "+ 3 points sur HRA refacturé",
      "≈ 547 €",
    ],
    [
      "HRA — hôtels, restaurants, activités",
      "Tarif négocié + possibilité « vendeur »",
      "Variable selon prestations",
    ],
    [
      "VOYAGEUR final",
      "Paie 800 € TTC tout compris",
      "30 400 € sur 38 voyageurs",
    ],
  ];
  s.addTable(tableData, {
    x: 0.6, y: 1.6, w: 12.1, h: 4.4,
    fontSize: 13, fontFace: "Calibri",
    border: { type: "solid", color: "BBBBBB", pt: 0.5 },
    rowH: [0.45, 0.7, 0.7, 0.7, 0.7, 0.7],
    colW: [3.5, 4.5, 4.1],
  });

  // Encadré orange en bas
  s.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 6.2, w: 12.1, h: 0.6,
    fill: { color: C.orange },
  });
  s.addText("Redistribution aux indépendants français : 6,8 % du CA · Aucun euro extra-européen · TVA marge tourisme", {
    x: 0.6, y: 6.2, w: 12.1, h: 0.6,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri",
    align: "center", valign: "middle",
  });

  addFooter(s, 5, 12);
}

// =============================================================
// SLIDE 6 — TRACTION
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Traction : plateforme propriétaire mature, auto-financée");
  addSubtitle(s, "Eventy n'attend pas une levée pour exister — la R&D est faite.");

  // Stats colonne gauche
  const colors = [C.orange, C.blue];
  const stats = [
    { y: 1.6, big: "1 M+", label: "lignes de code (frontend + backend)" },
    { y: 2.6, big: "31", label: "modules backend NestJS" },
    { y: 3.6, big: "3 300+", label: "tests automatisés CI/CD" },
    { y: 4.6, big: "32", label: "portails distincts (admin, pro, client, équipe…)" },
    { y: 5.6, big: "100 %", label: "auto-financement R&D pré-lancement" },
  ];
  stats.forEach((stat, i) => {
    s.addText(stat.big, {
      x: 0.7, y: stat.y, w: 2.5, h: 0.8,
      fontSize: 36, bold: true, color: i % 2 === 0 ? C.orange : C.blue, fontFace: "Calibri",
      align: "right",
    });
    s.addText(stat.label, {
      x: 3.3, y: stat.y + 0.15, w: 4.5, h: 0.5,
      fontSize: 14, color: C.black, fontFace: "Calibri",
      valign: "middle",
    });
  });

  // Encadré technique à droite
  s.addShape(pres.ShapeType.rect, {
    x: 8.0, y: 1.6, w: 4.7, h: 5.0,
    fill: { color: C.cream }, line: { color: C.orange, width: 1.5 },
  });
  s.addText("STACK TECHNIQUE", {
    x: 8.0, y: 1.7, w: 4.7, h: 0.4,
    fontSize: 14, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });
  s.addText(
    [
      { text: "Frontend : ", options: { bold: true } },
      { text: "Next.js 14, React, TypeScript", options: {} },
      { text: "\nBackend : ", options: { bold: true, breakLine: false } },
      { text: "NestJS 10, Prisma, PostgreSQL", options: {} },
      { text: "\nPaiements : ", options: { bold: true, breakLine: false } },
      { text: "Stripe Connect (PCI-DSS)", options: {} },
      { text: "\nHébergement : ", options: { bold: true, breakLine: false } },
      { text: "Scaleway France + Vercel", options: {} },
      { text: "\nCI/CD : ", options: { bold: true, breakLine: false } },
      { text: "GitHub Actions + tests automatisés", options: {} },
      { text: "\nSécurité : ", options: { bold: true, breakLine: false } },
      { text: "TLS 1.3, 2FA, RGPD natif", options: {} },
      { text: "\nObservabilité : ", options: { bold: true, breakLine: false } },
      { text: "logs, métriques, traces", options: {} },
    ],
    { x: 8.2, y: 2.2, w: 4.4, h: 4.3, fontSize: 13, color: C.black, fontFace: "Calibri", valign: "top" },
  );

  addFooter(s, 6, 12);
}

// =============================================================
// SLIDE 7 — ROADMAP
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Roadmap : France · Europe · Charter");
  addSubtitle(s, "Croissance organique séquencée, pas de pari technologique risqué.");

  // Timeline horizontale avec 5 jalons
  const milestones = [
    { x: 0.7, label: "T1 An 1", titre: "LANCEMENT", desc: "10 voyages/sem\nFrance + 12 destinations Europe Sud" },
    { x: 3.3, label: "T4 An 1", titre: "CROISIÈRE", desc: "50 voyages/sem\n16 M€ CA · 322 K€ net" },
    { x: 5.9, label: "An 2", titre: "EUROPE", desc: "100-200 voyages/sem\nOuverture Europe Centrale\n80 M€ CA" },
    { x: 8.5, label: "An 3", titre: "CHARTER A320", desc: "Capacité aérienne maîtrisée\nGrèce, Croatie, Tunisie\n160 M€ CA" },
    { x: 11.1, label: "An 5", titre: "MATURITÉ", desc: "Europe complète 25+ destinations\n320 M€ CA · 6,3 M€ net" },
  ];

  // Trait horizontal
  s.addShape(pres.ShapeType.line, {
    x: 0.9, y: 4.0, w: 11.5, h: 0,
    line: { color: C.orange, width: 4 },
  });

  milestones.forEach((m) => {
    // Cercle
    s.addShape(pres.ShapeType.ellipse, {
      x: m.x + 0.7, y: 3.7, w: 0.6, h: 0.6,
      fill: { color: C.orange },
      line: { color: C.white, width: 3 },
    });
    // Label année au-dessus
    s.addText(m.label, {
      x: m.x, y: 2.0, w: 2.0, h: 0.4,
      fontSize: 16, bold: true, color: C.orange, fontFace: "Calibri",
      align: "center",
    });
    // Titre
    s.addText(m.titre, {
      x: m.x, y: 2.5, w: 2.0, h: 0.4,
      fontSize: 13, bold: true, color: C.blue, fontFace: "Calibri",
      align: "center",
    });
    // Description sous le trait
    s.addText(m.desc, {
      x: m.x, y: 4.5, w: 2.0, h: 1.5,
      fontSize: 11, color: C.black, fontFace: "Calibri",
      align: "center", valign: "top",
    });
  });

  addFooter(s, 7, 12);
}

// =============================================================
// SLIDE 8 — PROJECTIONS FINANCIÈRES 5 ANS
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Projections financières — 5 ans");
  addSubtitle(s, "Profitable dès l'An 1. Pas de course aux pertes. BFR négatif structurel.");

  const tableData = [
    [
      { text: "Indicateur (M€)", options: { bold: true, fill: C.blue, color: C.white } },
      { text: "An 1", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "An 2", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "An 3", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "An 4", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "An 5", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
    ],
    ["Chiffre d'affaires HT", { text: "16,0", options: { align: "center" } }, { text: "80,0", options: { align: "center" } }, { text: "160,0", options: { align: "center" } }, { text: "240,0", options: { align: "center" } }, { text: "320,0", options: { align: "center" } }],
    ["Croissance annuelle", { text: "—", options: { align: "center" } }, { text: "+ 400 %", options: { align: "center" } }, { text: "+ 100 %", options: { align: "center" } }, { text: "+ 50 %", options: { align: "center" } }, { text: "+ 33 %", options: { align: "center" } }],
    ["Marge brute opérée (11,1 %)", { text: "1,77", options: { align: "center" } }, { text: "8,85", options: { align: "center" } }, { text: "17,7", options: { align: "center" } }, { text: "26,6", options: { align: "center" } }, { text: "35,5", options: { align: "center" } }],
    ["Redistribution indépendants (6,8 %)", { text: "1,09", options: { align: "center" } }, { text: "5,45", options: { align: "center" } }, { text: "10,90", options: { align: "center" } }, { text: "16,30", options: { align: "center" } }, { text: "21,80", options: { align: "center" } }],
    ["Résultat net", { text: "0,32", options: { align: "center" } }, { text: "1,87", options: { align: "center" } }, { text: "3,75", options: { align: "center" } }, { text: "5,25", options: { align: "center" } }, { text: "6,30", options: { align: "center" } }],
    ["Marge nette / CA", { text: "2,0 %", options: { align: "center" } }, { text: "2,3 %", options: { align: "center" } }, { text: "2,3 %", options: { align: "center" } }, { text: "2,2 %", options: { align: "center" } }, { text: "2,0 %", options: { align: "center" } }],
    ["Trésorerie cumulée fin", { text: "0,62", options: { align: "center" } }, { text: "6,7", options: { align: "center" } }, { text: "13,5", options: { align: "center" } }, { text: "20,2", options: { align: "center" } }, { text: "25,0", options: { align: "center" } }],
    ["ETP internes (fin)", { text: "6", options: { align: "center" } }, { text: "12", options: { align: "center" } }, { text: "20", options: { align: "center" } }, { text: "28", options: { align: "center" } }, { text: "35", options: { align: "center" } }],
  ];
  s.addTable(tableData, {
    x: 0.5, y: 1.6, w: 12.3, h: 4.5,
    fontSize: 13, fontFace: "Calibri",
    border: { type: "solid", color: "BBBBBB", pt: 0.5 },
    rowH: 0.5,
    colW: [4.0, 1.66, 1.66, 1.66, 1.66, 1.66],
  });

  s.addText("BFR négatif structurel : -33 jours An 1 · -25 jours An 5 · La croissance s'autofinance.", {
    x: 0.5, y: 6.3, w: 12.3, h: 0.4,
    fontSize: 14, italic: true, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });

  addFooter(s, 8, 12);
}

// =============================================================
// SLIDE 9 — CONCURRENCE
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Concurrence : un positionnement unique");
  addSubtitle(s, "Aucun acteur ne combine actuellement les 4 attributs Eventy.");

  const tableData = [
    [
      { text: "Acteur", options: { bold: true, fill: C.blue, color: C.white } },
      { text: "Opérateur (resp. plein droit)", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "Modèle redistributif", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "Transparence prix", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
      { text: "Voyage de groupe", options: { bold: true, fill: C.blue, color: C.white, align: "center" } },
    ],
    ["Voyageurs du Monde (premium individuel)", { text: "✓", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }],
    ["Salaün, Verdié (groupes traditionnels)", { text: "✓", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✓", options: { align: "center" } }],
    ["TUI / Club Med (généralistes)", { text: "✓", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "Partiel", options: { align: "center" } }],
    ["OTA (Booking, Expedia)", { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }],
    ["GetYourGuide / marketplaces", { text: "✗", options: { align: "center" } }, { text: "Partiel", options: { align: "center" } }, { text: "✗", options: { align: "center" } }, { text: "✗", options: { align: "center" } }],
    [
      { text: "EVENTY LIFE", options: { bold: true, fill: C.orange, color: C.white } },
      { text: "✓", options: { bold: true, fill: C.orange, color: C.white, align: "center" } },
      { text: "✓", options: { bold: true, fill: C.orange, color: C.white, align: "center" } },
      { text: "✓", options: { bold: true, fill: C.orange, color: C.white, align: "center" } },
      { text: "✓", options: { bold: true, fill: C.orange, color: C.white, align: "center" } },
    ],
  ];
  s.addTable(tableData, {
    x: 0.5, y: 1.6, w: 12.3, h: 4.8,
    fontSize: 13, fontFace: "Calibri",
    border: { type: "solid", color: "BBBBBB", pt: 0.5 },
    rowH: [0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7],
    colW: [4.5, 2.4, 2.0, 1.8, 1.6],
  });

  addFooter(s, 9, 12);
}

// =============================================================
// SLIDE 10 — ÉQUIPE
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Équipe : un fondateur engagé, une équipe qui se construit");
  addSubtitle(s, "5 ETP fin An 1 → 35 ETP An 5 · 1 600 indépendants actifs An 5 (créateurs + vendeurs).");

  // Encart fondateur à gauche
  s.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.6, w: 5.5, h: 5.0,
    fill: { color: C.cream },
    line: { color: C.orange, width: 2 },
  });
  s.addText("DAVID EVENTY", {
    x: 0.6, y: 1.8, w: 5.5, h: 0.5,
    fontSize: 22, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });
  s.addText("Président, Fondateur", {
    x: 0.6, y: 2.4, w: 5.5, h: 0.4,
    fontSize: 14, italic: true, color: C.blue, fontFace: "Calibri",
    align: "center",
  });
  s.addText(
    [
      { text: "• ", options: {} },
      { text: "Entrepreneur autodidacte", options: { bold: true } },
      { text: "\n• Concepteur de la plateforme propriétaire (1 M+ lignes)", options: {} },
      { text: "\n• Auto-financement R&D pré-lancement", options: {} },
      { text: "\n• Engagement personnel : capital + contre-garantie 10 K€ APST", options: {} },
      { text: "\n• Vision profondément humaine — voyageur, indépendants, partenaires français", options: {} },
      { text: "\n• Disponibilité totale temps plein", options: {} },
    ],
    { x: 0.9, y: 3.0, w: 4.9, h: 3.4, fontSize: 13, color: C.black, fontFace: "Calibri", valign: "top", paraSpaceAfter: 6 },
  );

  // Plan recrutement à droite
  s.addText("PLAN DE RECRUTEMENT", {
    x: 6.4, y: 1.7, w: 6.3, h: 0.4,
    fontSize: 16, bold: true, color: C.blue, fontFace: "Calibri",
  });

  const recruitData = [
    [{ text: "Fonction", options: { bold: true, fill: C.blue, color: C.white } }, { text: "M0", options: { bold: true, fill: C.blue, color: C.white, align: "center" } }, { text: "M6", options: { bold: true, fill: C.blue, color: C.white, align: "center" } }, { text: "M12", options: { bold: true, fill: C.blue, color: C.white, align: "center" } }, { text: "M24", options: { bold: true, fill: C.blue, color: C.white, align: "center" } }],
    ["Présidence (fondateur)", { text: "1", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "1", options: { align: "center" } }],
    ["Resp. opérations", { text: "0", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "2", options: { align: "center" } }],
    ["CTO délégué", { text: "0", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "2", options: { align: "center" } }],
    ["DAF / finance", { text: "0", options: { align: "center" } }, { text: "0,5", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "2", options: { align: "center" } }],
    ["Marketing", { text: "0", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "2", options: { align: "center" } }],
    ["Support / relation voyageurs", { text: "0", options: { align: "center" } }, { text: "0", options: { align: "center" } }, { text: "1", options: { align: "center" } }, { text: "3", options: { align: "center" } }],
    [{ text: "Total ETP", options: { bold: true, fill: C.cream } }, { text: "1", options: { bold: true, fill: C.cream, align: "center" } }, { text: "≈ 4,5", options: { bold: true, fill: C.cream, align: "center" } }, { text: "≈ 6", options: { bold: true, fill: C.cream, align: "center" } }, { text: "≈ 12", options: { bold: true, fill: C.cream, align: "center" } }],
  ];
  s.addTable(recruitData, {
    x: 6.4, y: 2.2, w: 6.3, h: 4.4,
    fontSize: 12, fontFace: "Calibri",
    border: { type: "solid", color: "BBBBBB", pt: 0.5 },
    rowH: [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.5, 0.55],
    colW: [2.7, 0.9, 0.9, 0.9, 0.9],
  });

  addFooter(s, 10, 12);
}

// =============================================================
// SLIDE 11 — DEMANDE DE FINANCEMENT
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addAccent(s);
  addTitle(s, "Demande de financement");
  addSubtitle(s, "Eventy est auto-financée. La levée est un accélérateur opportuniste, pas une condition de survie.");

  // Deux cartes : Seed + Série A
  const cards = [
    {
      x: 0.6, y: 1.7, w: 5.9, h: 4.8,
      header: "TOUR SEED — T2 An 2026",
      headerColor: C.orange,
      points: [
        { label: "Montant", value: "200 — 300 K€" },
        { label: "Pré-money", value: "4 — 6 M€ (cible 5 M€)" },
        { label: "Dilution", value: "4 — 6 %" },
        { label: "Profil", value: "Business angels tourisme + early-stage seed français" },
        { label: "Utilisation", value: "Recrutement Resp. Op. + CTO · Marketing · Frais juridiques" },
        { label: "Calendrier", value: "Closing T2-T3 An 2026" },
      ],
    },
    {
      x: 6.8, y: 1.7, w: 5.9, h: 4.8,
      header: "SÉRIE A — An 2 (2027/2028)",
      headerColor: C.blue,
      points: [
        { label: "Montant", value: "500 K€ — 1 M€" },
        { label: "Pré-money cible", value: "12 — 20 M€" },
        { label: "Dilution cumulée", value: "≈ 12 — 18 %" },
        { label: "Profil", value: "Fonds early-stage tourisme + capital-risque français" },
        { label: "Utilisation", value: "Expansion Europe · Charter A320 · 6-8 ETP supplémentaires" },
        { label: "Calendrier", value: "An 2 An 2026/2027" },
      ],
    },
  ];

  cards.forEach((c) => {
    s.addShape(pres.ShapeType.rect, {
      x: c.x, y: c.y, w: c.w, h: c.h,
      fill: { color: C.white },
      line: { color: c.headerColor, width: 2 },
    });
    s.addShape(pres.ShapeType.rect, {
      x: c.x, y: c.y, w: c.w, h: 0.6,
      fill: { color: c.headerColor },
    });
    s.addText(c.header, {
      x: c.x, y: c.y, w: c.w, h: 0.6,
      fontSize: 16, bold: true, color: C.white, fontFace: "Calibri",
      align: "center", valign: "middle",
    });

    let y = c.y + 0.85;
    c.points.forEach((p) => {
      s.addText(p.label, {
        x: c.x + 0.2, y, w: c.w - 0.4, h: 0.3,
        fontSize: 11, bold: true, color: C.gray, fontFace: "Calibri",
      });
      s.addText(p.value, {
        x: c.x + 0.2, y: y + 0.25, w: c.w - 0.4, h: 0.4,
        fontSize: 13, color: C.black, fontFace: "Calibri",
      });
      y += 0.65;
    });
  });

  s.addText("Sortie envisagée 5-7 ans : rachat stratégique opérateur tourisme · PE tourisme · multiple potentiel 8-15× pour investisseur Seed.", {
    x: 0.6, y: 6.6, w: 12.3, h: 0.4,
    fontSize: 12, italic: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });

  addFooter(s, 11, 12);
}

// =============================================================
// SLIDE 12 — CONTACT
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.blue };

  s.addText("Pour prolonger l'échange", {
    x: 0.5, y: 0.6, w: 12.3, h: 0.7,
    fontSize: 32, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });

  s.addText("« On ne vend pas des voyages. On réunit des gens. »", {
    x: 0.5, y: 1.4, w: 12.3, h: 0.6,
    fontSize: 20, italic: true, color: C.cream, fontFace: "Calibri",
    align: "center",
  });

  // Carte centrale
  s.addShape(pres.ShapeType.rect, {
    x: 2.5, y: 2.6, w: 8.3, h: 3.5,
    fill: { color: C.white },
    line: { color: C.orange, width: 3 },
  });

  s.addText("DAVID EVENTY", {
    x: 2.5, y: 2.85, w: 8.3, h: 0.5,
    fontSize: 26, bold: true, color: C.blue, fontFace: "Calibri",
    align: "center",
  });
  s.addText("Président, Fondateur — Eventy Life SAS", {
    x: 2.5, y: 3.4, w: 8.3, h: 0.4,
    fontSize: 16, italic: true, color: C.gray, fontFace: "Calibri",
    align: "center",
  });

  s.addText("eventylife@gmail.com", {
    x: 2.5, y: 4.1, w: 8.3, h: 0.5,
    fontSize: 22, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });
  s.addText("eventylife.fr", {
    x: 2.5, y: 4.7, w: 8.3, h: 0.5,
    fontSize: 22, bold: true, color: C.orange, fontFace: "Calibri",
    align: "center",
  });

  s.addText("Disponibilité : sur rendez-vous, en présentiel ou en visioconférence · Réponse sous 48 h ouvrées", {
    x: 2.5, y: 5.4, w: 8.3, h: 0.5,
    fontSize: 12, italic: true, color: C.gray, fontFace: "Calibri",
    align: "center",
  });

  s.addText("Documentation complète disponible sur demande :", {
    x: 0.5, y: 6.3, w: 12.3, h: 0.3,
    fontSize: 11, color: C.cream, fontFace: "Calibri",
    align: "center",
  });
  s.addText("Dossier APST 119 pages · Dossier investisseur 15 pages · Résumé exécutif 2 pages · Subventions publiques · Contrats types · CGV · RGPD", {
    x: 0.5, y: 6.6, w: 12.3, h: 0.4,
    fontSize: 10, color: C.cream, fontFace: "Calibri",
    align: "center",
  });
}

// =============================================================
// Sauvegarde
// =============================================================
const outputPath = process.argv[2] || "Eventy-Life-Pitch-Deck-Investisseurs.pptx";
pres.writeFile({ fileName: outputPath })
  .then((file) => {
    console.log(`✓ Pitch deck généré : ${file}`);
  })
  .catch((err) => {
    console.error("ERREUR :", err);
    process.exit(1);
  });
