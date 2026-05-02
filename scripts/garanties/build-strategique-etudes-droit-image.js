/**
 * Eventy Life — Trois documents vision / marché
 *
 *   1. Plan stratégique 5 ans Eventy
 *   2. Plan d'études et veille marché
 *   3. Politique image et droit à l'image
 *
 * Usage : node scripts/garanties/build-strategique-etudes-droit-image.js
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
  green: "2C5F2D", greenLt: "E5EDD9",
  gray: "555555", grayLt: "EEEEEE", black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function H1(text) { return new Paragraph({ spacing: { before: 240, after: 160 },
  children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })] }); }
function H2(text) { return new Paragraph({ spacing: { before: 220, after: 100 },
  children: [new TextRun({ text, bold: true, size: 22, color: COLOR.orange, font: "Calibri" })] }); }
function H3(text) { return new Paragraph({ spacing: { before: 180, after: 80 },
  children: [new TextRun({ text, bold: true, size: 20, color: COLOR.blue, font: "Calibri" })] }); }
function P(text, opts = {}) { return new Paragraph({ spacing: { after: opts.after || 100, line: 280 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, size: opts.size || 20, font: "Calibri",
    color: opts.color || COLOR.black, bold: opts.bold, italics: opts.italics })] }); }
function Bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 },
  spacing: { after: 60, line: 260 }, children: [new TextRun({ text, size: 20, font: "Calibri" })] }); }
function Numbered(text) { return new Paragraph({ numbering: { reference: "numbers", level: 0 },
  spacing: { after: 60, line: 260 }, children: [new TextRun({ text, size: 20, font: "Calibri" })] }); }
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
// DOCUMENT 1 — PLAN STRATÉGIQUE 5 ANS
// ============================================================
function planStrategique5Ans() {
  return [
    bandeauTitre(
      "PLAN STRATÉGIQUE 5 ANS EVENTY LIFE",
      "Vision long terme consolidée — 2026 → 2031",
    ),
    Spacer(160),

    P("Le présent plan formalise la vision stratégique d'EVENTY LIFE SAS sur 5 ans (2026-2031). Il consolide les engagements pris dans les autres documents stratégiques (Roadmap technique, Plan d'expansion internationale, Politique RSE, Charte engagement carbone, Dossier investisseur) et les articule dans une trajectoire cohérente. Il sert de boussole pour l'équipe, les associés, les investisseurs et les partenaires.", { italics: true }),

    P("Le présent plan est consultatif (cohérence Pacte associés Seed). Les décisions structurantes sont validées en assemblée. La stratégie n'est pas une promesse rigide — c'est une intention claire, ajustable aux réalités opérationnelles. Elle se mesure annuellement et se révise tous les 2-3 ans.", { italics: true }),

    H1("1. Vision 2031"),

    H2("1.1. Promesse"),
    P("« En 2031, Eventy Life est devenu la référence française et européenne du voyage de groupe accompagné, choisie par des centaines de milliers de voyageurs pour sa transparence radicale, sa chaleur humaine et son économie circulaire. »", { italics: true, bold: true }),

    H2("1.2. Trois ambitions structurantes"),
    Numbered("**Volume** — opérer ≥ 30 000 voyages / an, ≥ 1 M voyageurs/an cumulé en An 5."),
    Numbered("**Profitabilité** — atteindre une marge nette de 5-7 % du CA, soutenable et durable."),
    Numbered("**Impact** — devenir l'opérateur de référence pour le tourisme transparent, redistributif et bas-carbone en France et Europe."),

    H1("2. Trajectoire chiffrée"),
    makeTable({
      widths: [3744, 1404, 1404, 1404, 1404],
      header: ["Indicateur", "An 1", "An 2", "An 3", "An 5"],
      rows: [
        ["Voyages opérés", "1 000", "5 000", "15 000", "30 000+"],
        ["Voyageurs cumulés", "30 K", "230 K", "780 K", "1 M+"],
        ["CA HT (M€)", "16", "80", "240", "480+"],
        ["Marge brute (%)", "10-12", "11-13", "12-14", "13-15"],
        ["Marge nette (%)", "2-3", "3-5", "5-6", "5-7"],
        ["Effectif salariés", "3-5", "10-15", "20-30", "50-70"],
        ["Pays opérés", "1", "2-3", "5-7", "10-12"],
        ["HRA partenaires", "50", "120", "250", "500+"],
        ["Garantie APST", "1,6 M€", "5 M€", "12 M€", "25 M€"],
      ],
    }),

    H1("3. Phases stratégiques"),

    H2("3.1. Phase 1 — Lancement et validation (An 1, 2026-2027)"),
    Bullet("Création SAS, immatriculation Atout France, garantie APST."),
    Bullet("Catalogue saison 1 (10-15 voyages) et lancement commercial."),
    Bullet("Constitution du panel HRA et créateurs initiaux."),
    Bullet("Atteinte ≥ 1 000 voyages opérés, NPS ≥ + 60."),
    Bullet("Levée de fonds Seed validée."),

    H2("3.2. Phase 2 — Consolidation et croissance (An 2, 2027-2028)"),
    Bullet("Extension catalogue (20-30 voyages)."),
    Bullet("Internationalisation EN, lancement antennes BE/CH."),
    Bullet("Application mobile."),
    Bullet("Atteinte ≥ 5 000 voyages, NPS ≥ + 70, rentabilité An 2."),
    Bullet("Préparation Série A."),

    H2("3.3. Phase 3 — Expansion européenne (An 3-4, 2028-2030)"),
    Bullet("Catalogue ≥ 50 voyages, multilingue 5 langues."),
    Bullet("Marketplace ambassadeur structurée."),
    Bullet("Présence Espagne, Italie, Portugal, Pays-Bas."),
    Bullet("ISO 27001, audit RSE annuel certifié."),
    Bullet("Levée Série A 5-15 M€."),

    H2("3.4. Phase 4 — Maturité et leadership (An 5+, 2031+)"),
    Bullet("Référence tourisme français et européen."),
    Bullet("Présence ≥ 10 pays."),
    Bullet("Voix d'autorité sectorielle (transparence prix, surtourisme)."),
    Bullet("Profitabilité durable, possibilité de redistribution voyageurs."),

    H1("4. Six axes stratégiques transversaux"),

    H2("4.1. Axe 1 — Excellence opérationnelle"),
    Bullet("NPS ≥ + 75 An 5 (cohérence Procédure de réclamation détaillée)."),
    Bullet("Audit qualité HRA continu (cohérence Procédure d'audit qualité HRA)."),
    Bullet("0 incident N3-N4 en cybersécurité (cohérence Politique cybersécurité)."),
    Bullet("Délai résolution réclamation ≤ 7 j An 5."),

    H2("4.2. Axe 2 — Transparence radicale"),
    Bullet("Décomposition prix sur fiche voyage (chaque euro tracé)."),
    Bullet("Bilan Carbone annuel public (cohérence Charte engagement carbone)."),
    Bullet("Reporting RSE intégré (cible CSRD si seuils atteints An 4-5)."),
    Bullet("Glossaire et documentation publique (cohérence Glossaire voyage, ce dispositif)."),

    H2("4.3. Axe 3 — Économie redistributive"),
    Bullet("Modèle 5 % HT vendeurs + 3 pts créateurs sur HRA (cohérence Contrats partenaires)."),
    Bullet("Marges socle Eventy raisonnables (10-14 %)."),
    Bullet("Paiement 30 j fin de mois fournisseurs (cohérence Politique d'achats responsables)."),
    Bullet("Parité salariale équipe (rapport max/min ≤ 5)."),

    H2("4.4. Axe 4 — Souveraineté numérique"),
    Bullet("Hébergement France (Scaleway)."),
    Bullet("Plateforme propriétaire (refus dépendance grands acteurs)."),
    Bullet("Contribution open source (cohérence Roadmap technique)."),
    Bullet("Refus du tout-IA / tout-blockchain extractif."),

    H2("4.5. Axe 5 — Engagement RSE chiffré"),
    Bullet("Réduction émissions CO2eq −30 % par voyageur d'ici An 5."),
    Bullet("≥ 95 % achats France/Europe An 5."),
    Bullet("≥ 90 % voyages bas-carbone An 5 (autocar + train)."),
    Bullet("Label Tourisme et Handicap obtenu, cible B Corp An 4."),

    H2("4.6. Axe 6 — Communauté et chaleur humaine"),
    Bullet("Programme Eventy Famille à vie (cohérence Programme de fidélisation)."),
    Bullet("Anniversaire Eventy annuel signature (cohérence Plan d'événements)."),
    Bullet("Apéros trimestriels Paris + province."),
    Bullet("Refus de la marchandisation extractive de la communauté."),

    H1("5. Risques majeurs et mitigations"),
    makeTable({
      widths: [3744, 5616],
      header: ["Risque", "Mitigation"],
      rows: [
        ["Concentration excessive sur Président (founder-led)", "Plan de succession dirigeant (cohérence)"],
        ["Réglementaire (durcissement Code tourisme, RGPD)", "Veille trimestrielle, conseils externes"],
        ["Cyber (attaque, fuite données)", "Politique cybersécurité, RC cyber, ISO 27001 An 3"],
        ["Économique (récession, baisse demande tourisme)", "Diversification offres, BFR maîtrisé, fonds de réserve"],
        ["Réputationnel (incident voyage majeur)", "Pack Sérénité, Procédure crise comm, Manuel incident"],
        ["Opérationnel (défaillance HRA stratégique)", "Diversification HRA, audit annuel, contrats backup"],
        ["Concurrentiel (entrée de gros acteurs)", "Cohérence valeurs (transparence, redistribution), agilité"],
      ],
    }),

    H1("6. Levée de fonds"),

    H2("6.1. Calendrier"),
    Bullet("Seed (T3-T4 An 1) : 200-300 K€ (cohérence Term Sheet Seed)."),
    Bullet("Pré-Série A (An 2) : 1-2 M€."),
    Bullet("Série A (An 3) : 5-15 M€."),
    Bullet("Série B (An 5+) : si croissance internationale forte."),

    H2("6.2. Critères investisseurs"),
    Bullet("Alignement avec valeurs Eventy (refus extractif)."),
    Bullet("Solidité financière et capacité d'accompagnement."),
    Bullet("Réseau européen (pour expansion)."),
    Bullet("Engagement RSE structuré."),
    Bullet("Refus d'investisseurs en conflit de valeurs."),

    H1("7. Gouvernance du plan stratégique"),
    Bullet("Validation initiale par associés (assemblée extraordinaire)."),
    Bullet("Revue annuelle T1 (cohérence Tableau de bord opérationnel)."),
    Bullet("Révision majeure tous les 2-3 ans."),
    Bullet("Reporting trimestriel investisseurs sur l'avancement."),
    Bullet("Comité stratégique trimestriel (Président + investisseurs Lead)."),

    H1("8. Engagements stratégiques opposables"),
    Bullet("Maintien du modèle économique transparent et redistributif."),
    Bullet("Refus de dénaturer Eventy par croissance non-alignée."),
    Bullet("Engagement à mesurer et publier les indicateurs annuellement."),
    Bullet("Engagement à informer les associés en cas d'écart majeur."),
    Bullet("Engagement à préserver les voyageurs en toutes circonstances."),
    Bullet("Engagement à respecter le calendrier de levées de fonds (sauf force majeure)."),

    Spacer(160),
    P("Document de référence stratégique — Version 1.0 — 2 mai 2026. Mise à jour annuelle, révision majeure tous les 2-3 ans.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Roadmap technique, Plan d'expansion internationale, Politique RSE, Charte engagement carbone, Dossier investisseur, Pacte d'associés Seed, Term Sheet Seed, ensemble du dispositif documentaire Eventy.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN D'ÉTUDES ET VEILLE MARCHÉ
// ============================================================
function planEtudesVeille() {
  return [
    bandeauTitre(
      "PLAN D'ÉTUDES ET VEILLE MARCHÉ EVENTY",
      "Études marché, veille concurrentielle et intelligence économique",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'études et de veille marché d'EVENTY LIFE SAS. Il vise à maintenir une connaissance approfondie de l'écosystème (marché, concurrents, technologies, réglementation, voyageurs), à anticiper les évolutions et à éclairer les décisions stratégiques. Il complète le Plan stratégique 5 ans et le Plan marketing An 1.", { italics: true }),

    P("La veille Eventy n'est pas un dispositif espionnage. C'est une démarche d'apprentissage continu : comprendre nos voyageurs, respecter nos concurrents, suivre les évolutions du secteur. Notre approche : qualitatif, sourcé, partagé en équipe, transparent.", { italics: true }),

    H1("1. Objectifs"),
    Bullet("Connaître finement le marché du voyage de groupe et l'écosystème tourisme."),
    Bullet("Anticiper les évolutions (réglementaires, technologiques, comportementales)."),
    Bullet("Comprendre nos voyageurs (besoins, attentes, usages)."),
    Bullet("Respecter et apprendre des concurrents (sans dénigrement)."),
    Bullet("Identifier les opportunités stratégiques."),
    Bullet("Éclairer les décisions stratégiques avec des données factuelles."),

    H1("2. Quatre domaines de veille"),

    H2("2.1. Veille marché tourisme"),
    Bullet("Évolution du marché français (volumes, CA, tendances)."),
    Bullet("Évolution du marché européen (cohérence Plan d'expansion internationale)."),
    Bullet("Segments porteurs (voyage de groupe, voyage solo accompagné, voyage senior)."),
    Bullet("Sources : Atout France, OMT, Banque des Territoires, INSEE, Eurostat."),

    H2("2.2. Veille concurrentielle"),
    Bullet("Acteurs directs (opérateurs voyage de groupe France et Europe)."),
    Bullet("Acteurs indirects (agences de voyages classiques, plateformes B2C)."),
    Bullet("Acteurs émergents (startups tourisme)."),
    Bullet("Sources : sites concurrents, presse spécialisée, salons (cohérence Plan d'événements)."),
    Bullet("**Refus du dénigrement** : la veille observe, n'attaque pas."),

    H2("2.3. Veille technologique"),
    Bullet("Évolutions tech tourisme (PMS, CRS, marketplaces)."),
    Bullet("Cybersécurité et conformité (cohérence Politique cybersécurité)."),
    Bullet("Accessibilité numérique (cohérence Plan accessibilité numérique)."),
    Bullet("RSE et carbone (cohérence Charte engagement carbone)."),

    H2("2.4. Veille réglementaire"),
    Bullet("Code du tourisme et évolutions."),
    Bullet("Directive UE 2015/2302 et révisions."),
    Bullet("RGPD et CNIL (cohérence Politique RGPD)."),
    Bullet("Loi Climat, LOM, lois successives sur tourisme durable."),
    Bullet("Loi influenceurs (cohérence Code conduite ambassadeurs)."),

    H1("3. Études voyageurs récurrentes"),

    H2("3.1. NPS continu"),
    Bullet("Mesure NPS systématique post-voyage (cohérence Programme de fidélisation)."),
    Bullet("Analyse trimestrielle des verbatim (positifs et négatifs)."),
    Bullet("Identification des récurrences (forces, axes d'amélioration)."),

    H2("3.2. Sondage trimestriel voyageurs Famille"),
    Bullet("Cohérence Programme de fidélisation Eventy Famille."),
    Bullet("Sujets : nouveaux voyages souhaités, attentes saisonnières, retours sur Eventy."),
    Bullet("Format : 5-10 questions, 5 min."),
    Bullet("Restitution publique partielle (newsletter)."),

    H2("3.3. Étude annuelle approfondie"),
    Bullet("Étude qualitative (entretiens 20-30 voyageurs, profils variés)."),
    Bullet("Étude quantitative (sondage 500-1 000 voyageurs)."),
    Bullet("Sous-traitance possible (cabinet d'études tourisme)."),
    Bullet("Restitution équipe + investisseurs."),

    H2("3.4. Sondage post-voyage automatisé"),
    Bullet("3 questions courtes (NPS + 2 questions)."),
    Bullet("Envoi J+1 après retour de voyage."),
    Bullet("Taux de réponse cible : ≥ 50 %."),

    H1("4. Sources de veille"),

    H2("4.1. Sources institutionnelles"),
    Bullet("Atout France (publications, observatoire)."),
    Bullet("APST (publications, statistiques)."),
    Bullet("OMT (Organisation Mondiale du Tourisme)."),
    Bullet("INSEE (données démographiques et économiques)."),
    Bullet("Eurostat (données européennes)."),
    Bullet("Cour des Comptes (rapports sectoriels)."),

    H2("4.2. Médias et presse"),
    Bullet("L'Écho touristique."),
    Bullet("TourMaG."),
    Bullet("Voyages-d'affaires."),
    Bullet("Tourisme & Voyages (mensuel)."),
    Bullet("Les Échos, Le Monde, Le Figaro (sections tourisme et économie)."),

    H2("4.3. Sources sectorielles"),
    Bullet("UMIH, GNI, ENTREPRISES DU VOYAGE (cohérence Plan de partenariats institutionnels)."),
    Bullet("ATR (Acteurs du Tourisme Durable)."),
    Bullet("UNAT (tourisme social)."),
    Bullet("Salons (IFTM Top Resa, ITB Berlin, WTM Londres)."),

    H2("4.4. Outils de veille"),
    Bullet("Google Alerts (gratuit, basique)."),
    Bullet("Feedly ou Inoreader (agrégation de flux)."),
    Bullet("Mention.com ou Talkwalker (mention de marque, à étudier An 2+)."),
    Bullet("LinkedIn (suivi d'experts et de concurrents)."),
    Bullet("Rapports sectoriels payants (à étudier An 2-3)."),

    H1("5. Études ad hoc"),

    H2("5.1. Études pré-lancement"),
    Bullet("Étude de faisabilité avant chaque nouveau voyage majeur."),
    Bullet("Étude pré-expansion par pays cible."),
    Bullet("Étude positionnement avant chaque grande communication."),

    H2("5.2. Études post-incident ou crise"),
    Bullet("Bilan post-incident voyage majeur (cohérence Manuel d'incident voyage)."),
    Bullet("Bilan post-crise communication (cohérence Procédure de gestion de crise)."),
    Bullet("Adaptation des procédures suite à retour d'expérience."),

    H1("6. Reporting et partage"),

    H2("6.1. Reporting interne"),
    Bullet("Newsletter veille mensuelle (5-10 min de lecture, équipe interne)."),
    Bullet("Réunion veille trimestrielle (60 min, équipe complète)."),
    Bullet("Synthèse veille annuelle (10-15 pages, document interne)."),

    H2("6.2. Reporting investisseurs"),
    Bullet("Synthèse trimestrielle des évolutions sectorielles majeures."),
    Bullet("Identification des opportunités et menaces."),

    H2("6.3. Partage public"),
    Bullet("Tribune signée David Eventy (cohérence Stratégie relations presse)."),
    Bullet("Tableau de bord ouvert sur eventylife.fr/observatoire (cible An 3)."),
    Bullet("Possibilité de publier des rapports sectoriels (cohérence position « voix d'autorité »)."),

    H1("7. Indicateurs veille"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Newsletter veille mensuelle", "12/an", "12/an"],
        ["Études voyageurs annuelles", "≥ 1", "≥ 3"],
        ["Sondages voyageurs trimestriels", "≥ 4", "≥ 4"],
        ["Veille concurrentielle (acteurs suivis)", "≥ 10", "≥ 30"],
        ["Articles de presse veillés / mois", "≥ 50", "≥ 200"],
        ["Tribunes Eventy publiées / an", "≥ 2", "≥ 6"],
      ],
    }),

    H1("8. Engagements éthiques"),
    Bullet("Refus du dénigrement des concurrents (cohérence Charte éditoriale)."),
    Bullet("Refus de l'espionnage commercial ou industriel."),
    Bullet("Sources factuelles et sourcées."),
    Bullet("Confidentialité des informations recueillies."),
    Bullet("Refus d'utiliser des données voyageurs au-delà de leur finalité (RGPD)."),
    Bullet("Partage de la connaissance avec l'équipe (refus de la rétention)."),

    H1("9. Gouvernance"),
    Bullet("Référent veille : Président en An 1, recrutement An 2-3."),
    Bullet("Budget veille : 1 % du CA An 1, 2 % An 3+."),
    Bullet("Revue annuelle du présent plan."),
    Bullet("Cohérence avec Plan stratégique 5 ans et Roadmap technique."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan stratégique 5 ans, Plan marketing An 1, Plan d'expansion internationale, Stratégie relations presse, Politique RGPD, Politique RSE, ensemble du dispositif documentaire.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — POLITIQUE IMAGE ET DROIT À L'IMAGE
// ============================================================
function politiqueImage() {
  return [
    bandeauTitre(
      "POLITIQUE IMAGE ET DROIT À L'IMAGE EVENTY",
      "Utilisation des photos et vidéos voyageurs, partenaires et équipe",
    ),
    Spacer(160),

    P("La présente politique formalise les règles d'utilisation des photographies et vidéos chez EVENTY LIFE SAS. Elle complète et opérationnalise la Politique de confidentialité RGPD et le Code de conduite ambassadeurs en posant un cadre clair sur le droit à l'image, applicable à toutes les personnes apparaissant dans les contenus Eventy : voyageurs, partenaires HRA, créateurs, vendeurs, ambassadeurs, équipe.", { italics: true }),

    P("Eventy considère le droit à l'image comme un droit fondamental. Aucune image identifiable n'est utilisée sans accord écrit. Cette discipline n'est pas un fardeau administratif — c'est le respect de chaque personne qui partage une expérience avec nous.", { italics: true }),

    H1("1. Cadre juridique"),
    Bullet("Article 9 du Code civil — droit au respect de la vie privée et à l'image."),
    Bullet("Loi Informatique et Libertés (1978) et RGPD (Règlement (UE) 2016/679)."),
    Bullet("Article 226-1 du Code pénal — atteinte à l'intimité de la vie privée."),
    Bullet("Article 226-8 — montage trompeur de paroles ou d'image sans consentement."),
    Bullet("Loi Influenceurs n° 2023-451 (cohérence Code de conduite ambassadeurs)."),
    Bullet("Politique de confidentialité RGPD Eventy (cohérence)."),

    H1("2. Principe directeur"),
    P("**Aucune image identifiable d'une personne n'est utilisée par Eventy sans son accord écrit, libre, éclairé et révocable.**", { bold: true }),
    P("Cette règle s'applique à toutes les images : photos, captures vidéo, GIF, illustrations, montages. Elle s'applique à tous les supports : site web, réseaux sociaux, newsletter, presse, supports commerciaux, présentations.", { italics: true }),

    H1("3. Niveaux d'utilisation"),

    H2("3.1. Niveau 1 — Image non identifiable"),
    Bullet("Personne floutée ou de dos."),
    Bullet("Plan général (foule, paysage avec personnes lointaines)."),
    Bullet("Cadrage volontairement masquant."),
    Bullet("Pas d'accord nécessaire."),

    H2("3.2. Niveau 2 — Image identifiable, contexte non sensible"),
    Bullet("Photo de groupe lors d'un voyage Eventy."),
    Bullet("Photo de paysage avec personnes au premier plan."),
    Bullet("Accord écrit obligatoire (forme et contenus précisés)."),
    Bullet("Possibilité de retrait à tout moment."),

    H2("3.3. Niveau 3 — Image individuelle, valorisation"),
    Bullet("Portrait identifié (témoignage, mise en avant)."),
    Bullet("Vidéo dédiée à la personne."),
    Bullet("Accord écrit explicite, mention nominative ou non selon choix."),
    Bullet("Précision des supports et durée d'utilisation."),

    H2("3.4. Niveau 4 — Mineurs et personnes vulnérables"),
    Bullet("Mineurs : accord écrit des deux parents obligatoire."),
    Bullet("Personnes en situation de handicap : accord direct + tuteur légal si applicable."),
    Bullet("Refus systématique en cas de doute."),

    H1("4. Modalités d'accord"),

    H2("4.1. Format de l'accord"),
    Bullet("Document écrit signé (papier ou électronique)."),
    Bullet("Identification de la personne (nom, prénom, contact)."),
    Bullet("Description précise des supports d'utilisation."),
    Bullet("Durée d'utilisation (3 ans recommandé, renouvelable)."),
    Bullet("Modalités de retrait (préavis, contact)."),
    Bullet("Mention de la rémunération éventuelle (si applicable)."),

    H2("4.2. Étapes de collecte"),
    Numbered("Information préalable du sujet (objectif, supports envisagés)."),
    Numbered("Présentation du formulaire d'accord."),
    Numbered("Signature avant prise de vue (idéal) ou immédiatement après."),
    Numbered("Conservation sécurisée du formulaire (cloud chiffré)."),
    Numbered("Lien automatique entre image et accord (référence)."),

    H2("4.3. Cas particulier — voyages Eventy"),
    Bullet("Information dans le roadbook voyageur (mentionné J-30 avant départ)."),
    Bullet("Possibilité de refuser dès la réservation (case à cocher dans le profil)."),
    Bullet("Confirmation orale par l'accompagnateur en début de voyage."),
    Bullet("Accord écrit à signer pour usage post-voyage."),

    H1("5. Utilisations autorisées et interdites"),

    H2("5.1. Utilisations autorisées (avec accord)"),
    Bullet("Site eventylife.fr et blog."),
    Bullet("Réseaux sociaux Eventy (Instagram, Facebook, TikTok, LinkedIn)."),
    Bullet("Newsletters."),
    Bullet("Supports presse et institutionnels."),
    Bullet("Présentations investisseurs (interne)."),
    Bullet("Support commerciaux (catalogue, brochure)."),
    Bullet("Communication de crise (avec accord renouvelé en contexte particulier)."),

    H2("5.2. Utilisations interdites"),
    Bullet("Cession à des tiers sans accord exprès du sujet."),
    Bullet("Modification dénaturante (deep fake, montages trompeurs)."),
    Bullet("Utilisation à des fins politiques, religieuses ou commerciales hors Eventy."),
    Bullet("Vente ou échange contre rémunération à un tiers."),
    Bullet("Utilisation après retrait du consentement."),

    H1("6. Droit de retrait"),

    H2("6.1. Modalités"),
    Bullet("Possible à tout moment."),
    Bullet("Demande envoyée à : image@eventylife.fr."),
    Bullet("Effet sous 30 jours pour les supports en ligne."),
    Bullet("Retrait conservé en archive Eventy (refus du retrait des supports physiques imprimés déjà distribués sauf cas exceptionnel)."),

    H2("6.2. Limites"),
    Bullet("Pas de retrait rétroactif sur supports physiques distribués (catalogue imprimé, etc.)."),
    Bullet("Pas de retrait pour archives historiques (maintien possible avec floutage)."),
    Bullet("Pas de retrait abusif (fraude — Eventy peut conserver une trace)."),

    H1("7. Stockage et sécurité"),
    Bullet("Photos et vidéos conservées sur cloud sécurisé France (Scaleway Object Storage)."),
    Bullet("Accord lié à chaque média (métadonnées)."),
    Bullet("Accès restreint à l'équipe communication + Président."),
    Bullet("Conservation : durée du consentement + 1 an d'archive."),
    Bullet("Suppression définitive après cette période."),
    Bullet("Cohérence avec Politique cybersécurité."),

    H1("8. Cas spécifiques"),

    H2("8.1. Photos de groupe lors d'un voyage"),
    Bullet("Accompagnateur prend des photos du groupe avec accord oral systématique."),
    Bullet("Distribution post-voyage par cloud sécurisé (Drive, WeTransfer)."),
    Bullet("Utilisation ultérieure par Eventy avec accord écrit."),

    H2("8.2. Témoignages voyageurs"),
    Bullet("Cohérence avec Programme de fidélisation Eventy Famille (avec accord)."),
    Bullet("Rémunération éventuelle (avoir voyage, mention dans le Cercle des Légendes)."),
    Bullet("Refus systématique de l'achat de témoignages."),

    H2("8.3. Photos de partenaires HRA"),
    Bullet("Accord du partenaire pour utilisation marketing."),
    Bullet("Mention « © Eventy Life » et crédit du partenaire."),
    Bullet("Cohérence avec Contrat HRA Partenaire."),

    H2("8.4. Équipe Eventy"),
    Bullet("Accord à l'embauche pour utilisation interne et externe (cohérence Procédure de recrutement)."),
    Bullet("Refus possible sans conséquence."),
    Bullet("Photos professionnelles fournies à l'équipe pour usage personnel."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Taux d'accords signés / images utilisées", "100 %", "100 %"],
        ["Délai traitement demande retrait", "≤ 30 j", "≤ 14 j"],
        ["Plaintes droit à l'image", "0", "0"],
        ["Audits annuels conformité", "1", "1"],
        ["Formation équipe annuelle", "100 %", "100 %"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Respect absolu du droit à l'image."),
    Bullet("Refus du chantage à la rémunération en échange du droit à l'image."),
    Bullet("Refus de pression à signer un accord (consentement libre)."),
    Bullet("Confidentialité absolue des refus."),
    Bullet("Refus de la photo de personne en situation vulnérable (urgence, deuil) sans accord."),
    Bullet("Refus du voyeurisme (photo intime, photo gênante)."),
    Bullet("Engagement à former l'équipe et les accompagnateurs annuellement."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique de confidentialité RGPD, DPA Sous-traitance RGPD, Code de conduite ambassadeurs, Programme de fidélisation Eventy Famille, Politique avis voyageurs, Charte éditoriale, Stratégie réseaux sociaux, Politique cybersécurité.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Plan-Strategique-5-Ans.docx",
      title: "Eventy Life — Plan stratégique 5 ans",
      description: "Vision long terme consolidée 2026-2031 d'Eventy Life.",
      footer: "EVENTY LIFE SAS — Plan stratégique 5 ans",
      children: planStrategique5Ans(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Etudes-Veille-Marche.docx",
      title: "Eventy Life — Plan d'études et veille marché",
      description: "Études marché, veille concurrentielle et intelligence économique.",
      footer: "EVENTY LIFE SAS — Plan d'études et veille marché",
      children: planEtudesVeille(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Image-Droit.docx",
      title: "Eventy Life — Politique image et droit à l'image",
      description: "Règles d'utilisation des photos et vidéos voyageurs et partenaires.",
      footer: "EVENTY LIFE SAS — Politique image et droit à l'image",
      children: politiqueImage(),
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
