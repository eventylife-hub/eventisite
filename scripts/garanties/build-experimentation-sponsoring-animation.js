/**
 * Eventy Life — Trois documents méthodologiques opérationnels
 *
 *   1. Plan d'expérimentation et tests A/B
 *   2. Politique de sponsoring et mécénat
 *   3. Méthodologie d'animation accompagnateur en groupe
 *
 * Usage : node scripts/garanties/build-experimentation-sponsoring-animation.js
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
// DOCUMENT 1 — PLAN D'EXPÉRIMENTATION ET TESTS A/B
// ============================================================
function planExperimentation() {
  return [
    bandeauTitre(
      "PLAN D'EXPÉRIMENTATION ET TESTS EVENTY",
      "Méthodologie sobre des tests A/B et expérimentations produit",
    ),
    Spacer(160),

    P("Le présent plan formalise la méthodologie d'expérimentation et de tests A/B chez EVENTY LIFE SAS. Il complète la Roadmap technique (volet R&D) et la Procédure d'amélioration continue. Il pose un cadre pour expérimenter de manière sobre, éthique et utile aux voyageurs.", { italics: true }),

    P("Eventy refuse l'expérimentation extractive : tester pour manipuler le voyageur, exploiter ses biais cognitifs, optimiser un dark pattern. Notre approche : tester pour mieux comprendre, améliorer ce qui ne fonctionne pas, valider une hypothèse avec respect. L'expérimentation est un outil au service du voyageur, pas un outil pour mieux le manipuler.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Roadmap technique Eventy (cohérence)."),
    Bullet("Procédure d'amélioration continue (cohérence)."),
    Bullet("Politique RGPD et consentement (cohérence)."),
    Bullet("Charte éditoriale (refus dark patterns, cohérence)."),
    Bullet("Programme de gamification voyageur (refus dark patterns)."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes éthiques"),
    Bullet("Respect — l'expérimentation ne doit pas dégrader l'expérience voyageur."),
    Bullet("Transparence — possibilité de désactiver les expérimentations dans les préférences."),
    Bullet("Sobriété — ne pas tester pour tester."),
    Bullet("Apprentissage — toute expérimentation est documentée, partagée."),
    Bullet("Refus du dark pattern — pas d'optimisation contre le voyageur."),

    H2("2.2. Refus structurés"),
    Bullet("Refus des tests créant de l'urgence factice (« plus que 3 places ! » non vérifié)."),
    Bullet("Refus de la scarcité simulée."),
    Bullet("Refus du roach motel (facilité d'inscription, difficulté de désinscription)."),
    Bullet("Refus du confirmshaming (« non, je ne veux pas économiser »)."),
    Bullet("Refus du prix-piège (ajout de frais en dernière minute)."),
    Bullet("Refus de l'A/B test sur prix opaque (manque de transparence)."),

    H1("3. Domaines d'expérimentation autorisés"),

    H2("3.1. UX et ergonomie"),
    Bullet("Position et libellé des CTA (boutons d'action)."),
    Bullet("Hiérarchisation des informations sur la fiche voyage."),
    Bullet("Disposition des images et vidéos."),
    Bullet("Lisibilité et accessibilité (cohérence Plan accessibilité numérique)."),
    Bullet("Parcours mobile vs desktop."),

    H2("3.2. Contenu éditorial"),
    Bullet("Titres et accroches voyages (avec respect Charte éditoriale)."),
    Bullet("Photo principale fiche voyage."),
    Bullet("Format des avis voyageurs (témoignages textuels vs vidéos)."),
    Bullet("Newsletter (objet, structure, fréquence)."),

    H2("3.3. Recommandations"),
    Bullet("Suggestion de voyages similaires (sans tracking abusif)."),
    Bullet("Suggestion de voyages saisonniers."),
    Bullet("Mise en avant de voyages avec dates limitées."),

    H2("3.4. Communication transactionnelle"),
    Bullet("Email de confirmation (structure, ton)."),
    Bullet("Email de relance avant voyage (J-30, J-7)."),
    Bullet("Email de remerciement post-voyage."),

    H1("4. Domaines INTERDITS d'expérimentation"),
    Bullet("Prix (transparence absolue maintenue, prix unique pour tous)."),
    Bullet("Modèle économique (5 % HT vendeurs, 3 pts créateurs — engagement opposable)."),
    Bullet("Couvertures Pack Sérénité (pas de réduction par test)."),
    Bullet("Engagements RSE (pas d'A/B test sur engagement)."),
    Bullet("Politique RGPD et consentement (consentement pleinement informé toujours)."),
    Bullet("Affichage des labels et garanties (APST, Atout France, RC Pro)."),

    H1("5. Méthodologie d'expérimentation"),

    H2("5.1. Phase 1 — Hypothèse"),
    Bullet("Formulation claire d'une hypothèse (« si je fais X, alors Y se produira »)."),
    Bullet("Justification : pourquoi cette hypothèse mérite d'être testée."),
    Bullet("Estimation de l'impact attendu (chiffré)."),
    Bullet("Identification des risques éventuels."),

    H2("5.2. Phase 2 — Conception"),
    Bullet("Design de la variante (A vs B)."),
    Bullet("Échantillonnage (taille, durée minimum)."),
    Bullet("Métriques de mesure (primaire + secondaires)."),
    Bullet("Validation Président avant lancement."),
    Bullet("Validation DPO si données personnelles concernées."),

    H2("5.3. Phase 3 — Lancement"),
    Bullet("Allocation aléatoire des voyageurs entre variantes."),
    Bullet("Information transparente disponible (FAQ technique sur eventylife.fr)."),
    Bullet("Possibilité de désactivation dans les préférences voyageur."),
    Bullet("Suivi temps réel des indicateurs."),

    H2("5.4. Phase 4 — Analyse"),
    Bullet("Calcul de la significativité statistique (p-value < 0,05)."),
    Bullet("Vérification absence d'effet de bord négatif."),
    Bullet("Analyse qualitative complémentaire (verbatim, retours)."),
    Bullet("Documentation des résultats (succès / échec / non-conclusif)."),

    H2("5.5. Phase 5 — Décision"),
    Bullet("Si succès : déploiement à 100 %."),
    Bullet("Si échec : retour à la version initiale, documentation des apprentissages."),
    Bullet("Si non-conclusif : nouvelle expérimentation ou abandon."),
    Bullet("Communication à l'équipe (cohérence Procédure d'amélioration continue)."),

    H1("6. Outils et stack"),
    Bullet("Outil interne (cohérence Roadmap technique) ou GrowthBook (open source) en An 2-3."),
    Bullet("Refus des outils américains exposant données voyageurs (refus Optimizely, VWO, etc.)."),
    Bullet("Préférence pour outils EU et open source (cohérence Politique d'achats responsables)."),

    H1("7. Cas d'usage non concernés"),
    Bullet("Tests techniques (régressions, performance) — méthodologie classique QA."),
    Bullet("Tests utilisateurs qualitatifs (interviews, observations) — protocole spécifique."),
    Bullet("Tests d'accessibilité (cohérence Plan accessibilité numérique) — audit dédié."),
    Bullet("Tests de sécurité (cohérence Politique cybersécurité) — pentest, audits."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Expérimentations / an", "≥ 3", "≥ 12"],
        ["Taux d'expérimentations concluantes", "≥ 30 %", "≥ 40 %"],
        ["Délai moyen expérimentation", "≤ 30 j", "≤ 21 j"],
        ["Voyageurs informés / total", "100 %", "100 %"],
        ["Taux d'opt-out expérimentations", "Suivi", "Suivi"],
        ["Plaintes liées aux expérimentations", "0", "0"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Refus systématique des dark patterns."),
    Bullet("Information transparente sur les expérimentations en cours (FAQ technique)."),
    Bullet("Possibilité de désactivation."),
    Bullet("Refus de l'optimisation contre le voyageur."),
    Bullet("Documentation publique partielle des résultats majeurs (transparence)."),
    Bullet("Refus du tracking abusif (cohérence Politique RGPD, Politique cookies)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Roadmap technique, Procédure d'amélioration continue, Politique RGPD, Politique cookies, Charte éditoriale, Programme de gamification voyageur, Plan accessibilité numérique, Politique cybersécurité.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE DE SPONSORING ET MÉCÉNAT
// ============================================================
function politiqueSponsoringMecenat() {
  return [
    bandeauTitre(
      "POLITIQUE DE SPONSORING ET MÉCÉNAT EVENTY",
      "Règles d'engagement Eventy auprès de causes, événements et associations",
    ),
    Spacer(160),

    P("La présente politique formalise les règles d'EVENTY LIFE SAS en matière de sponsoring (commercial) et de mécénat (philanthropique). Elle complète le Plan de partenariats institutionnels (qui couvre les acteurs sectoriels) et la Politique RSE (qui couvre les engagements globaux). Elle pose un cadre pour décider d'engager Eventy auprès d'une cause, d'un événement, d'une association.", { italics: true }),

    P("Eventy refuse le sponsoring opportuniste ou cosmétique. Notre approche : engager Eventy uniquement sur des causes alignées avec nos valeurs, dans la durée, avec impact mesurable. Le mécénat est aussi un engagement humain et économique réel, pas un argument marketing.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Loi Aillagon (2003) — mécénat et fondations."),
    Bullet("Articles 238 bis et 238 bis A du CGI — déductibilité fiscale du mécénat."),
    Bullet("Code de la consommation — mention obligatoire publicité/sponsoring."),
    Bullet("Politique RSE Eventy (cohérence)."),
    Bullet("Plan de partenariats institutionnels (cohérence)."),

    H1("2. Distinction sponsoring vs mécénat"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Aspect", "Sponsoring", "Mécénat"],
      rows: [
        ["Nature", "Commercial", "Philanthropique"],
        ["Contrepartie pour Eventy", "Visibilité explicite", "Limitée (≤ 25 % don)"],
        ["Traitement comptable", "Charge déductible", "Réduction d'impôt 60 % (jusqu'à 0,5 % CA)"],
        ["Communication", "Mention sponsor obligatoire", "Discrétion possible"],
        ["Bénéficiaire", "Tout type", "Organisme d'intérêt général"],
      ],
    }),

    H1("3. Principes directeurs"),

    H2("3.1. Cinq principes"),
    Bullet("Alignement valeurs — refus des engagements opportunistes."),
    Bullet("Durée — préférence aux engagements pluriannuels (≥ 3 ans)."),
    Bullet("Mesurabilité — impact concret évaluable."),
    Bullet("Transparence — communication honnête sans gonflement."),
    Bullet("Cohérence interne — communication cohérente avec valeurs réelles."),

    H2("3.2. Refus structurés"),
    Bullet("Refus du sponsoring pur greenwashing."),
    Bullet("Refus des associations en conflit éthique avec valeurs Eventy."),
    Bullet("Refus du mécénat sans suivi (don aveugle)."),
    Bullet("Refus du sponsoring d'événements contraires à la diversité."),
    Bullet("Refus de toute exigence de contrepartie démesurée."),
    Bullet("Refus du conflit d'intérêts (cohérence Politique conflits d'intérêts)."),

    H1("4. Causes et thématiques prioritaires Eventy"),

    H2("4.1. Tourisme social et solidaire"),
    Bullet("Associations de tourisme adapté."),
    Bullet("Soutien aux personnes en situation de précarité."),
    Bullet("Programmes de découverte pour publics éloignés du tourisme classique."),

    H2("4.2. Écologie et biodiversité"),
    Bullet("Cohérence Charte engagement carbone."),
    Bullet("Associations de protection de la biodiversité."),
    Bullet("Projets de reforestation, préservation locale."),
    Bullet("Programmes de tourisme durable."),

    H2("4.3. Inclusion et handicap"),
    Bullet("Cohérence Politique accessibilité PMR + Charte d'inclusion et diversité."),
    Bullet("Associations de personnes en situation de handicap."),
    Bullet("Programmes d'accès au voyage pour PMR."),

    H2("4.4. Économie sociale et solidaire"),
    Bullet("Soutien aux acteurs de l'ESS."),
    Bullet("Cohérence Politique RSE (économie redistributive)."),
    Bullet("Refus du capitalisme extractif."),

    H2("4.5. Culture et patrimoine local"),
    Bullet("Sauvegarde du patrimoine local."),
    Bullet("Soutien aux artisans et créateurs locaux."),
    Bullet("Festivals régionaux respectueux."),

    H1("5. Modalités du sponsoring"),

    H2("5.1. Critères d'éligibilité"),
    Bullet("Cohérence valeurs Eventy (cohérence Politique RSE)."),
    Bullet("Impact mesurable et reportable."),
    Bullet("Audit possible des fonds engagés."),
    Bullet("Alignement avec les engagements Eventy (transparence, redistribution)."),
    Bullet("Refus des structures sous procédure judiciaire ou en redressement."),

    H2("5.2. Plafonds annuels"),
    Bullet("An 1 : Budget sponsoring + mécénat ≤ 0,5 % du CA prévisionnel."),
    Bullet("An 3 : Budget ≤ 1 % du CA, dont ≥ 50 % en mécénat."),
    Bullet("An 5 : Budget ≤ 1 % du CA, dont ≥ 70 % en mécénat."),
    Bullet("Validation Président obligatoire au-delà de 5 K€."),
    Bullet("Validation associés au-delà de 25 K€ (cohérence Pacte associés Seed)."),

    H2("5.3. Durée des engagements"),
    Bullet("Préférence pour engagements pluriannuels (3-5 ans)."),
    Bullet("Engagements ponctuels possibles pour événements alignés."),
    Bullet("Refus du sponsoring « one-shot » sans cohérence stratégique."),

    H1("6. Modalités du mécénat"),

    H2("6.1. Bénéficiaires éligibles"),
    Bullet("Organismes reconnus d'intérêt général (article 200 et 238 bis CGI)."),
    Bullet("Fondations reconnues d'utilité publique."),
    Bullet("Associations loi 1901 d'intérêt général."),
    Bullet("Vérification du statut auprès de l'administration fiscale."),

    H2("6.2. Types de mécénat"),
    Bullet("Mécénat financier (don en numéraire)."),
    Bullet("Mécénat en nature (don de biens)."),
    Bullet("Mécénat de compétences (mise à disposition d'équipe — 1 j/mois max An 2+)."),

    H2("6.3. Avantages fiscaux"),
    Bullet("Réduction d'impôt 60 % du don, dans la limite de 0,5 % du CA."),
    Bullet("Possibilité de contrepartie limitée à 25 % du don."),
    Bullet("Cohérence avec Note expert-comptable."),

    H1("7. Process de décision"),

    H2("7.1. Étape 1 — Identification"),
    Bullet("Identification d'une cause alignée (sources : équipe, voyageurs, partenaires)."),
    Bullet("Vérification éligibilité (statut juridique, valeurs, impact)."),
    Bullet("Cohérence avec Plan stratégique 5 ans."),

    H2("7.2. Étape 2 — Évaluation"),
    Bullet("Étude du projet (objectif, budget, impact attendu)."),
    Bullet("Vérification de la solidité de la structure."),
    Bullet("Vérification absence de conflit d'intérêts (cohérence Politique conflits d'intérêts)."),
    Bullet("Calcul de l'impact financier pour Eventy."),

    H2("7.3. Étape 3 — Décision"),
    Bullet("Décision Président (≤ 5 K€)."),
    Bullet("Décision Comité (5-25 K€)."),
    Bullet("Décision associés (> 25 K€)."),
    Bullet("Décision documentée (date, motivation, contrepartie)."),

    H2("7.4. Étape 4 — Contractualisation"),
    Bullet("Convention de sponsoring ou mécénat formalisée."),
    Bullet("Plan de paiement défini."),
    Bullet("Modalités de communication."),
    Bullet("Modalités de reporting et d'évaluation."),

    H2("7.5. Étape 5 — Suivi"),
    Bullet("Reporting annuel demandé au bénéficiaire."),
    Bullet("Évaluation impact réel vs prévu."),
    Bullet("Décision renouvellement / arrêt."),
    Bullet("Communication transparente sur résultats (cohérence Politique RSE)."),

    H1("8. Communication et transparence"),
    Bullet("Liste des partenariats sponsoring/mécénat publiée annuellement (rapport RSE)."),
    Bullet("Mention transparente lors de la communication associée."),
    Bullet("Refus de la sur-communication (mécénat doit rester discret)."),
    Bullet("Refus de l'instrumentalisation marketing du mécénat."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Budget total / CA", "≤ 0,5 %", "≤ 1 %"],
        ["Part mécénat dans budget total", "≥ 30 %", "≥ 50 %"],
        ["Engagements pluriannuels actifs", "≥ 1", "≥ 3"],
        ["Reporting bénéficiaires reçus", "100 %", "100 %"],
        ["Taux engagements renouvelés", "Suivi", "≥ 70 %"],
        ["Plaintes liées aux partenariats", "0", "0"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Refus du greenwashing par sponsoring."),
    Bullet("Refus du token-isme (sponsoring symbolique sans engagement réel)."),
    Bullet("Refus de la sur-communication."),
    Bullet("Engagement à mesurer l'impact réel."),
    Bullet("Refus du conflit d'intérêts."),
    Bullet("Refus du paiement de causes contraires aux valeurs Eventy."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE, Plan de partenariats institutionnels, Note expert-comptable, Politique conflits d'intérêts, Politique anti-corruption, Charte engagement carbone, Politique accessibilité PMR, Charte d'inclusion et diversité.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — MÉTHODOLOGIE D'ANIMATION ACCOMPAGNATEUR
// ============================================================
function methodologieAnimationAccompagnateur() {
  return [
    bandeauTitre(
      "MÉTHODOLOGIE D'ANIMATION ACCOMPAGNATEUR EVENTY",
      "Animer un groupe de voyageurs avec chaleur et bienveillance",
    ),
    Spacer(160),

    P("Le présent document formalise la méthodologie d'animation des groupes de voyageurs par les accompagnateurs Eventy. Il complète la Charte qualité accompagnateur (qui pose les engagements éthiques) et le Plan de formation accompagnateur (qui pose le programme de formation) en se concentrant sur les pratiques concrètes d'animation au quotidien d'un voyage.", { italics: true }),

    P("Animer, ce n'est pas faire le clown ni donner un cours. C'est créer un climat humain où chaque voyageur peut se sentir à sa place — sans pression, sans imposition, avec l'assurance qu'on s'occupe du collectif tout en respectant chacun. Cette méthodologie est le fruit d'expériences de groupes réussis et capitalise sur les bonnes pratiques.", { italics: true }),

    H1("1. Posture de l'accompagnateur"),

    H2("1.1. Cinq principes"),
    Bullet("Présence — disponible, attentif, joignable 24/7."),
    Bullet("Bienveillance — accueil chaleureux, respect des rythmes."),
    Bullet("Humilité — refus du « je sais tout » professoral."),
    Bullet("Médiation — gérer les éventuelles tensions sans prendre parti."),
    Bullet("Transparence — informer honnêtement sur le programme et les éventuels imprévus."),

    H2("1.2. Refus structurés"),
    Bullet("Refus du « copain trop familier »."),
    Bullet("Refus du « professeur » donnant la leçon."),
    Bullet("Refus de l'animation forcée (« obligatoire que tout le monde participe »)."),
    Bullet("Refus de la gestion paternaliste des voyageurs séniors."),
    Bullet("Refus du favoritisme entre voyageurs."),
    Bullet("Refus de toute relation inappropriée avec un voyageur (cohérence Charte qualité accompagnateur)."),

    H1("2. Phases de l'animation"),

    H2("2.1. J0 — Accueil et rassemblement"),
    Bullet("Arrivée 30 min avant les voyageurs au point RDV."),
    Bullet("Repérage des voyageurs en consultant la liste."),
    Bullet("Salutation chaleureuse personnalisée pour chacun."),
    Bullet("Distribution kit voyageur (badge, programme, goodies)."),
    Bullet("Café offert si possible (cohérence Plan d'événements)."),
    Bullet("Briefing rapide (15 min) — cadre, programme, règles de groupe."),
    Bullet("Présentations rapides (jeu de présentation léger, optionnel)."),

    H2("2.2. Journée 1 — Création du climat"),
    Bullet("Petit déjeuner d'accueil convivial."),
    Bullet("Première activité : préférer une activité accessible et fédératrice."),
    Bullet("Photo de groupe (avec accord — cohérence Politique image)."),
    Bullet("Premier dîner ensemble (occasion d'échanges)."),
    Bullet("Briefing du lendemain en fin de soirée (5 min)."),

    H2("2.3. Journées intermédiaires — Rythme de croisière"),
    Bullet("Briefing matinal court (5 min) — programme du jour."),
    Bullet("Disponibilité pour questions, requêtes."),
    Bullet("Médiation si besoin (cf. point 4)."),
    Bullet("Sondage rapide quotidien (1 question — humeur du jour, optionnel)."),
    Bullet("Briefing soir avant dîner (5 min) — programme du lendemain."),

    H2("2.4. Dernier jour — Bilan collectif"),
    Bullet("Activité ou repas convivial."),
    Bullet("Tour de table optionnel (« quel est ton moment fort ? »)."),
    Bullet("Distribution photos / vidéos collectives (cohérence Politique image)."),
    Bullet("Échange des coordonnées entre voyageurs (sous accord — cohérence RGPD)."),
    Bullet("Au revoir personnalisé."),

    H1("3. Communication avec le groupe"),

    H2("3.1. Briefings"),
    Bullet("Court (5-15 min selon contexte)."),
    Bullet("Clair (programme + heure + lieu RDV + tenue conseillée)."),
    Bullet("Chaleureux (un ton humain, pas militaire)."),
    Bullet("Possibilité de questions."),

    H2("3.2. Communication individuelle"),
    Bullet("Disponibilité réelle (pas de « rendez-vous, on verra »)."),
    Bullet("Écoute active (laisser parler avant de répondre)."),
    Bullet("Confidentialité absolue des confidences voyageurs."),
    Bullet("Cohérence avec Charte qualité accompagnateur."),

    H2("3.3. Outils de communication"),
    Bullet("WhatsApp / Signal pour les messages courts au groupe."),
    Bullet("Téléphone pour les urgences."),
    Bullet("Pas de communication tardive (avant 8h, après 22h sauf urgence)."),

    H1("4. Médiation et gestion des tensions"),

    H2("4.1. Tensions courantes"),
    Bullet("Désaccord sur le rythme (lent / rapide)."),
    Bullet("Conflits de personnalité entre voyageurs."),
    Bullet("Plaintes sur l'hébergement ou la restauration."),
    Bullet("Problème personnel d'un voyageur (santé, fatigue, mal du pays)."),

    H2("4.2. Méthodologie de médiation"),
    Numbered("Écoute neutre des parties (séparément si nécessaire)."),
    Numbered("Reformulation pour validation."),
    Numbered("Recherche de solution opérationnelle."),
    Numbered("Vérification accord des parties."),
    Numbered("Suivi sur la suite du voyage."),

    H2("4.3. Quand escalader"),
    Bullet("Si tension non résolue après 2 essais : information Président Eventy."),
    Bullet("Si tension grave (agressivité, harcèlement) : escalade immédiate."),
    Bullet("Si problème médical : activation Pack Sérénité."),
    Bullet("Cohérence avec Manuel d'incident voyage."),

    H1("5. Inclusion et diversité dans l'animation"),

    H2("5.1. Profils variés"),
    Bullet("Adaptation au mix âge (jeunes/seniors)."),
    Bullet("Adaptation au mix solo/couple/famille."),
    Bullet("Adaptation au mix premier voyage / habitué."),
    Bullet("Inclusion des voyageurs PMR (cohérence Politique accessibilité PMR)."),
    Bullet("Refus des stéréotypes (cohérence Charte d'inclusion et diversité)."),

    H2("5.2. Voyageurs solo"),
    Bullet("Vigilance pour qu'ils ne se sentent pas isolés."),
    Bullet("Présentation à d'autres voyageurs aux profils complémentaires."),
    Bullet("Pas de pression à « se trouver quelqu'un »."),

    H2("5.3. Voyageurs avec besoins spécifiques"),
    Bullet("Cohérence avec Politique accessibilité PMR."),
    Bullet("Information préalable de l'accompagnateur (J-7) sur les besoins."),
    Bullet("Adaptation discrète sans stigmatisation."),

    H1("6. Bonnes pratiques quotidiennes"),

    H2("6.1. Le matin"),
    Bullet("Bonjour personnalisé à chacun."),
    Bullet("Vérification de l'humeur (visuel)."),
    Bullet("Briefing court."),

    H2("6.2. Pendant la journée"),
    Bullet("Disponibilité physique (pas dans le bus / téléphone)."),
    Bullet("Anticipation des besoins (eau, pauses, fatigue)."),
    Bullet("Petites attentions (un mot personnalisé, une attention)."),

    H2("6.3. Le soir"),
    Bullet("Conclusion conviviale de la journée."),
    Bullet("Briefing du lendemain."),
    Bullet("Disponibilité pour les confidences (sans en chercher)."),

    H1("7. Animations optionnelles"),

    H2("7.1. Glaces-brisées (icebreakers)"),
    Bullet("Jeux légers de présentation (5-10 min, J0)."),
    Bullet("Refus des jeux infantilisants ou ridiculisants."),
    Bullet("Possibilité de ne pas participer sans pression."),

    H2("7.2. Soirées thématiques"),
    Bullet("Soirée typique régionale (musique, cuisine locale)."),
    Bullet("Soirée jeux de société (proposée, pas imposée)."),
    Bullet("Soirée libre (les voyageurs s'organisent eux-mêmes)."),

    H2("7.3. Activités fédératrices"),
    Bullet("Atelier cuisine local."),
    Bullet("Visite avec dégustation."),
    Bullet("Activités de groupe douces (randonnée, vélo)."),

    H1("8. Refus structurés"),
    Bullet("Refus de l'animation infantilisante."),
    Bullet("Refus du jeu de groupe forcé."),
    Bullet("Refus du favoritisme."),
    Bullet("Refus de la promotion personnelle (l'accompagnateur sert le groupe)."),
    Bullet("Refus du commentaire sur les choix individuels (régime, sortie, vie privée)."),
    Bullet("Refus de la pression à parler ou à participer."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["NPS animation accompagnateur", "≥ + 70", "≥ + 80"],
        ["Note moyenne accompagnement", "≥ 4,5/5", "≥ 4,8/5"],
        ["Conflits dans le groupe", "≤ 5 % voyages", "≤ 2 %"],
        ["Voyageurs solo se déclarant 'à l'aise'", "≥ 90 %", "≥ 95 %"],
        ["Plaintes accompagnement", "≤ 1 %", "≤ 0,5 %"],
        ["Reformations accompagnateurs / an", "≥ 1", "≥ 2"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Confidentialité absolue des confidences voyageurs."),
    Bullet("Refus de toute relation inappropriée."),
    Bullet("Égalité d'attention entre tous les voyageurs."),
    Bullet("Refus du jugement moral sur les choix individuels."),
    Bullet("Refus du commentaire sur l'apparence physique."),
    Bullet("Engagement à signaler les manquements observés."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte qualité accompagnateur, Plan de formation accompagnateur, Manuel voyageur autonome, Manuel d'incident voyage, Politique accessibilité PMR, Charte d'inclusion et diversité, Politique image et droit à l'image, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Plan-Experimentation.docx",
      title: "Eventy Life — Plan d'expérimentation et tests",
      description: "Méthodologie sobre des tests A/B et expérimentations produit.",
      footer: "EVENTY LIFE SAS — Plan d'expérimentation et tests",
      children: planExperimentation(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Sponsoring-Mecenat.docx",
      title: "Eventy Life — Politique de sponsoring et mécénat",
      description: "Règles d'engagement Eventy auprès de causes et associations.",
      footer: "EVENTY LIFE SAS — Politique sponsoring et mécénat",
      children: politiqueSponsoringMecenat(),
    },
    {
      file: "docs/garanties/Eventy-Life-Methodologie-Animation-Accompagnateur.docx",
      title: "Eventy Life — Méthodologie d'animation accompagnateur",
      description: "Bonnes pratiques d'animation de groupes de voyageurs.",
      footer: "EVENTY LIFE SAS — Méthodologie animation accompagnateur",
      children: methodologieAnimationAccompagnateur(),
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
