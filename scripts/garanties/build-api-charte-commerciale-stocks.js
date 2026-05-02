/**
 * Eventy Life — Trois documents commercial & ressources
 *
 *   1. Documentation API publique (vision technique partenaires)
 *   2. Charte commerciale (posture commerciale globale)
 *   3. Plan de gestion des stocks et ressources (photos, kits, merch)
 *
 * Usage : node scripts/garanties/build-api-charte-commerciale-stocks.js
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
// DOCUMENT 1 — DOCUMENTATION API PUBLIQUE
// ============================================================
function documentationAPIPublique() {
  return [
    bandeauTitre(
      "DOCUMENTATION API PUBLIQUE EVENTY",
      "Vision technique pour partenaires officiels — déploiement An 3",
    ),
    Spacer(160),

    P("Le présent document formalise la vision et le cadre de l'API publique d'EVENTY LIFE SAS, prévue pour déploiement à partir d'An 3 (cohérence Roadmap technique). Il s'adresse aux futurs partenaires officiels (CSE, agences de voyages, plateformes de tourisme, ambassadeurs structurés) qui souhaiteraient intégrer le catalogue Eventy à leurs propres systèmes.", { italics: true }),

    P("L'API publique Eventy n'est pas une marketplace ouverte. C'est une porte d'entrée maîtrisée pour les partenaires alignés. Notre approche : contrôle de l'accès, qualité du service, refus de l'extraction de données voyageurs par des tiers, refus de la gratuité totale qui crée une dépendance non viable.", { italics: true }),

    H1("1. Objectifs de l'API publique"),
    Bullet("Permettre aux partenaires officiels d'intégrer le catalogue Eventy."),
    Bullet("Faciliter la réservation par des canaux partenaires (CSE, agences alignées)."),
    Bullet("Soutenir l'expansion internationale (cohérence Plan d'expansion internationale)."),
    Bullet("Maintenir le contrôle de l'expérience voyageur Eventy."),
    Bullet("Refuser l'extraction de données par tiers."),

    H1("2. Cadre"),

    H2("2.1. Calendrier de déploiement"),
    Bullet("An 1-2 : pas d'API publique (focus stabilisation interne)."),
    Bullet("An 3 (T2) : alpha avec 5-10 partenaires sélectionnés."),
    Bullet("An 4 (T1) : beta avec 30-50 partenaires."),
    Bullet("An 5+ : ouverture progressive (sur application validée)."),

    H2("2.2. Refus structurés"),
    Bullet("Refus de l'API ouverte sans contrôle (refus du modèle « API key publique »)."),
    Bullet("Refus de l'API gratuite illimitée (tarification raisonnable An 3+)."),
    Bullet("Refus de la cession des données voyageurs aux tiers via API."),
    Bullet("Refus de la mise à disposition de données concurrentielles sensibles."),
    Bullet("Refus des partenaires non alignés (cohérence Politique conflits d'intérêts)."),

    H1("3. Périmètre fonctionnel"),

    H2("3.1. Endpoints en lecture (priorité An 3)"),
    Bullet("`GET /trips` — liste des voyages disponibles (avec filtres)."),
    Bullet("`GET /trips/{id}` — détail d'un voyage."),
    Bullet("`GET /destinations` — liste des destinations Eventy."),
    Bullet("`GET /availability/{trip_id}` — disponibilités en temps réel."),
    Bullet("`GET /pricing/{trip_id}` — prix transparent décomposé."),

    H2("3.2. Endpoints en écriture (An 4+)"),
    Bullet("`POST /reservations` — création d'une réservation."),
    Bullet("`PATCH /reservations/{id}` — modification."),
    Bullet("`DELETE /reservations/{id}` — annulation (avec barème CGV)."),
    Bullet("`POST /quote` — devis B2B / CSE (cohérence Offre CSE / B2B)."),

    H2("3.3. Endpoints d'authentification"),
    Bullet("`POST /auth/token` — OAuth 2.0 client credentials."),
    Bullet("`POST /auth/refresh` — refresh token."),
    Bullet("Rate limiting par partenaire."),
    Bullet("Refus de l'authentification par API key statique simple (sécurité insuffisante)."),

    H1("4. Modalités d'accès"),

    H2("4.1. Critères de sélection partenaires"),
    Bullet("Cohérence valeurs Eventy (cohérence Politique RSE, Politique conflits d'intérêts)."),
    Bullet("Solidité financière vérifiée."),
    Bullet("Alignement éthique (refus des concurrents directs, opérateurs aux pratiques contraires)."),
    Bullet("Engagement de volume minimum (à partir d'An 4)."),
    Bullet("Acceptation du contrat partenariat API."),

    H2("4.2. Process d'inscription"),
    Numbered("Demande via api@eventylife.fr."),
    Numbered("Étude par le Président + référent technique."),
    Numbered("Validation et envoi du contrat partenariat API."),
    Numbered("Signature du contrat (DPA RGPD inclus, cohérence DPA Sous-traitance RGPD)."),
    Numbered("Émission des credentials et accès sandbox."),
    Numbered("Tests sandbox (1-2 mois)."),
    Numbered("Mise en production avec monitoring."),

    H2("4.3. Tarification (An 3+)"),
    Bullet("Tarif partenaires : commission sur conversions (5-10 % selon volume)."),
    Bullet("Forfait technique annuel ≥ 1 200 €/an (couverture infrastructure)."),
    Bullet("Refus de la gratuité illimitée (modèle non viable)."),
    Bullet("Tarif progressif favorisant la croissance partenaires."),

    H1("5. Sécurité et conformité"),

    H2("5.1. Authentification et autorisation"),
    Bullet("OAuth 2.0 (industry standard)."),
    Bullet("Tokens à durée limitée (≤ 1 h)."),
    Bullet("Rate limiting par partenaire (1 000 requêtes/min par défaut)."),
    Bullet("Cohérence avec Politique cybersécurité."),

    H2("5.2. Protection des données"),
    Bullet("Refus de l'exposition de données personnelles voyageurs sans nécessité."),
    Bullet("Accord du voyageur requis pour partage avec partenaire (cohérence RGPD)."),
    Bullet("DPA signé entre Eventy et partenaire (cohérence DPA Sous-traitance RGPD)."),
    Bullet("Logs d'accès conservés 12 mois."),

    H2("5.3. SLA"),
    Bullet("Disponibilité ≥ 99,5 % An 3 → 99,9 % An 5."),
    Bullet("Délai de réponse moyen ≤ 500 ms An 3 → ≤ 200 ms An 5."),
    Bullet("Notification incidents sous 4 h."),
    Bullet("Cohérence avec Politique cybersécurité."),

    H1("6. Documentation technique"),
    Bullet("Documentation OpenAPI 3.0 publique."),
    Bullet("Sandbox accessible aux partenaires acceptés."),
    Bullet("Exemples de code (JS, Python, PHP)."),
    Bullet("Webhooks pour notifications événements (réservation, modification, annulation)."),
    Bullet("Versioning sémantique (vMajor.Minor.Patch)."),
    Bullet("Période de support des anciennes versions : 12 mois après nouvelle version."),

    H1("7. Engagements opposables"),
    Bullet("Refus de la cession de données voyageurs sans accord exprès."),
    Bullet("Refus du favoritisme entre partenaires (égalité de traitement)."),
    Bullet("Refus de la dépréciation soudaine d'API (préavis minimum 6 mois)."),
    Bullet("Engagement de stabilité et continuité du service."),
    Bullet("Engagement de transparence sur les changements de tarification (préavis 6 mois)."),
    Bullet("Engagement de mise à jour de la documentation."),

    H1("8. Indicateurs cibles"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "An 3", "An 5"],
      rows: [
        ["Partenaires API actifs", "≥ 5", "≥ 30"],
        ["Disponibilité API", "≥ 99,5 %", "≥ 99,9 %"],
        ["Délai réponse moyen", "≤ 500 ms", "≤ 200 ms"],
        ["Volume requêtes / jour", "≥ 10 K", "≥ 1 M"],
        ["Conversions via API", "≥ 5 % CA", "≥ 20 % CA"],
        ["Plaintes partenaires API", "≤ 5 %", "≤ 1 %"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Souveraineté numérique préservée (cohérence Roadmap technique)."),
    Bullet("Refus de la dépendance critique aux partenaires API (Eventy reste maître)."),
    Bullet("Refus de l'open API extractive."),
    Bullet("Égalité de traitement entre partenaires."),
    Bullet("Transparence sur les conditions d'accès."),
    Bullet("Engagement RSE également imposé aux partenaires API."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour à chaque évolution majeure.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Roadmap technique, Plan d'expansion internationale, Politique cybersécurité, Politique RGPD, DPA Sous-traitance RGPD, Politique d'achats responsables, Politique conflits d'intérêts, Plan stratégique 5 ans, Offre CSE et B2B.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — CHARTE COMMERCIALE
// ============================================================
function charteCommerciale() {
  return [
    bandeauTitre(
      "CHARTE COMMERCIALE EVENTY LIFE",
      "Posture commerciale globale et règles de vente",
    ),
    Spacer(160),

    P("La présente charte formalise la posture commerciale d'EVENTY LIFE SAS et les règles de vente applicables à toute démarche commerciale au nom d'Eventy. Elle complète l'Argumentaire commercial vendeurs, l'Offre CSE/B2B, le Code de conduite ambassadeurs et la Charte éditoriale. Elle s'applique à l'équipe interne, aux vendeurs, aux ambassadeurs et à toute personne représentant Eventy dans un contexte commercial.", { italics: true }),

    P("Eventy refuse les pratiques commerciales agressives ou manipulatrices. Notre approche : vente sincère, refus de la pression, respect de la liberté du voyageur, engagement à dire la vérité même si cela coûte une vente. Vendre sans aimer est impossible chez Eventy — un voyage est une aventure humaine, pas une transaction.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Périmètre"),
    Bullet("Toute démarche commerciale au nom d'Eventy."),
    Bullet("Communication publique commerciale."),
    Bullet("Vente directe et indirecte (vendeurs, ambassadeurs)."),
    Bullet("Vente B2B (CSE, entreprises)."),
    Bullet("Communication promotionnelle (campagnes, soldes)."),

    H2("1.2. Cinq principes fondamentaux"),
    Bullet("Sincérité — vendre ce qui est, pas ce qu'on imagine vouloir entendre."),
    Bullet("Liberté du voyageur — refus de la pression, de l'urgence factice."),
    Bullet("Transparence — prix décomposés, conditions claires."),
    Bullet("Respect — refus de la condescendance, de la manipulation."),
    Bullet("Cohérence — l'âme Eventy traverse toute démarche commerciale."),

    H1("2. Refus structurés"),

    H2("2.1. Pratiques commerciales interdites"),
    Bullet("Refus de l'urgence factice (« plus que 3 places ! » non vérifié)."),
    Bullet("Refus de la scarcité simulée (« offre limitée » non limitée)."),
    Bullet("Refus du confirmshaming (« non, je ne veux pas économiser »)."),
    Bullet("Refus du prix-piège (frais cachés ajoutés en dernière minute)."),
    Bullet("Refus de la pression émotionnelle abusive."),
    Bullet("Refus de la sous-information sur les caractéristiques du voyage."),
    Bullet("Refus de la promesse non tenable."),
    Bullet("Refus du dénigrement des concurrents."),
    Bullet("Refus de l'exploitation de la méconnaissance du voyageur."),

    H2("2.2. Pratiques commerciales tolérées avec encadrement"),
    Bullet("Promotions saisonnières (printemps, fin d'année) avec dates fixes."),
    Bullet("Offres de bienvenue pour nouveaux voyageurs (transparentes)."),
    Bullet("Avantages programme Eventy Famille (à vie, sans déclassement)."),
    Bullet("Offres flash exceptionnelles (rares, transparentes)."),

    H1("3. Honnêteté commerciale"),

    H2("3.1. Description du voyage"),
    Bullet("Cohérence avec Méthodologie de création de voyage."),
    Bullet("Programme jour par jour précis."),
    Bullet("Hébergements identifiés (pas de « hôtel équivalent »)."),
    Bullet("Restaurants et activités précisés."),
    Bullet("Niveau de difficulté physique honnête."),
    Bullet("Niveau d'accessibilité PMR transparent."),

    H2("3.2. Prix décomposé"),
    Bullet("Cohérence avec promesse Eventy « chaque euro est tracé »."),
    Bullet("Décomposition publique sur la fiche voyage (transport, hébergement, restauration, activités, accompagnement, marge Eventy)."),
    Bullet("Frais inclus / non inclus clairement."),
    Bullet("Refus du prix « à partir de » trompeur."),

    H2("3.3. Limites du voyage"),
    Bullet("Information sur les éventuelles contraintes (escaliers, marche, climat)."),
    Bullet("Information sur les exigences spécifiques."),
    Bullet("Refus de minimiser les difficultés."),

    H2("3.4. Risques voyage"),
    Bullet("Information sur les éventuels risques sanitaires (cohérence Fiche santé voyageur)."),
    Bullet("Information sur les éventuels risques sécuritaires (cohérence Consignes sécurité destination)."),
    Bullet("Niveau de vigilance MEAE indiqué."),

    H1("4. Conduite avec le voyageur"),

    H2("4.1. Premier contact"),
    Bullet("Présentation honnête (qui je suis, mon rôle)."),
    Bullet("Écoute active des besoins du voyageur."),
    Bullet("Questions ouvertes, pas orientées."),
    Bullet("Refus de la précipitation (« réserve maintenant »)."),

    H2("4.2. Conseil"),
    Bullet("Conseil sincère, même si cela coûte une vente."),
    Bullet("Possibilité de recommander de ne pas voyager (« ce voyage n'est pas adapté à toi »)."),
    Bullet("Refus de la sur-vente (vendre plus que nécessaire)."),
    Bullet("Refus de la sous-vente (vendre moins par paresse)."),

    H2("4.3. Closing"),
    Bullet("Cohérence avec Argumentaire commercial vendeurs."),
    Bullet("Refus du closing manipulateur."),
    Bullet("Confirmation du choix sans pression."),
    Bullet("Délai de réflexion accepté."),

    H2("4.4. Suivi"),
    Bullet("Pas de relance abusive."),
    Bullet("Disponibilité pour répondre aux questions."),
    Bullet("Cohérence avec Plan de communication interne."),

    H1("5. Promotions et campagnes"),

    H2("5.1. Calendrier promotionnel type"),
    makeTable({
      widths: [3744, 5616],
      header: ["Période", "Type de promotion"],
      rows: [
        ["Janvier", "Vœux + remise 5 % vœux pour nouveaux voyages annoncés"],
        ["Mars-mai", "Promotions printemps (early booking)"],
        ["Juin", "Anniversaire Eventy (offre famille)"],
        ["Septembre-octobre", "Rentrée + ponts d'octobre"],
        ["Novembre", "Black Friday encadré (refus du Black Friday classique)"],
        ["Décembre", "Vœux fin d'année"],
      ],
    }),

    H2("5.2. Black Friday encadré"),
    Bullet("Eventy participe avec une approche différenciée."),
    Bullet("Refus des « -70 % gonflés »."),
    Bullet("Possibilité d'avoir voyage 50-100 € pour réservations dans la fenêtre."),
    Bullet("Communication transparente sur la mécanique."),
    Bullet("Refus de la pression « plus que 24 h » manipulatrice."),

    H1("6. Engagement commercial post-vente"),
    Bullet("Cohérence avec Onboarding voyageur."),
    Bullet("Cohérence avec Politique de communication post-incident."),
    Bullet("Cohérence avec Programme de fidélisation Eventy Famille."),
    Bullet("Engagement à respecter ce qui a été vendu."),
    Bullet("Refus de la dégradation après vente."),

    H1("7. Sanctions en cas de manquement"),

    H2("7.1. Manquements internes (équipe, vendeurs)"),
    Bullet("Avertissement pour manquement mineur."),
    Bullet("Sanction disciplinaire pour manquement majeur."),
    Bullet("Résiliation contrat vendeur en cas de manquement caractérisé."),
    Bullet("Cohérence avec Code de conduite ambassadeurs et Procédure de signalement."),

    H2("7.2. Manquements partenaires API"),
    Bullet("Suspension de l'accès API."),
    Bullet("Cohérence avec Documentation API publique."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Plaintes pratiques commerciales abusives", "0", "0"],
        ["NPS post-réservation", "≥ + 60", "≥ + 75"],
        ["Taux de rétractation 14 j", "≤ 3 %", "≤ 1 %"],
        ["Taux de fidélisation 2e voyage", "≥ 25 %", "≥ 50 %"],
        ["Conversions via communications honnêtes", "Suivi", "Suivi"],
        ["Sanctions internes pour manquement", "0 cas grave", "0 cas grave"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Refus systématique des pratiques commerciales manipulatrices."),
    Bullet("Sincérité absolue dans la description des voyages."),
    Bullet("Transparence des prix (chaque euro tracé)."),
    Bullet("Refus du dénigrement des concurrents."),
    Bullet("Engagement à respecter ce qui a été vendu."),
    Bullet("Refus de la sur-promesse, refus de la sous-promesse."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Argumentaire commercial vendeurs, Offre CSE et B2B, Code de conduite ambassadeurs, Charte éditoriale, Méthodologie de création de voyage, Onboarding voyageur, Programme de fidélisation Eventy Famille, Politique de communication post-incident, Procédure de signalement.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN GESTION STOCKS ET RESSOURCES
// ============================================================
function planGestionStocksRessources() {
  return [
    bandeauTitre(
      "PLAN DE GESTION DES STOCKS ET RESSOURCES",
      "Photos, kits voyageurs, contenus et marchandise Eventy Life",
    ),
    Spacer(160),

    P("Le présent plan formalise la gestion des stocks et ressources d'EVENTY LIFE SAS : photos et vidéos, kits voyageurs (badges, programmes imprimés, goodies), contenus marketing, marchandise éventuelle (merch). Il complète la Politique de gestion documentaire (qui couvre les documents) et la Politique d'achats responsables (qui couvre les fournisseurs).", { italics: true }),

    P("Eventy refuse l'accumulation et le gaspillage. Notre approche : sobriété (juste ce qu'il faut), durabilité (refus du jetable), traçabilité (savoir ce qu'on a), partage (mutualiser quand possible). Une organisation économe est aussi une organisation sereine.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Périmètre"),
    Bullet("Photothèque et vidéothèque."),
    Bullet("Kits voyageurs physiques (badges, programmes, goodies)."),
    Bullet("Supports marketing imprimés (catalogue, brochures)."),
    Bullet("Stocks bureau (fournitures, matériel d'équipe)."),
    Bullet("Marchandise (merch) éventuelle pour anniversaire Eventy / événements."),

    H2("1.2. Cinq principes"),
    Bullet("Sobriété — refus de l'accumulation excessive."),
    Bullet("Durabilité — préférence aux ressources réutilisables."),
    Bullet("Traçabilité — savoir ce qu'on a, où, en quelle quantité."),
    Bullet("Mutualisation — partage de ressources quand possible."),
    Bullet("Cohérence RSE (cohérence Politique RSE, Politique d'achats responsables)."),

    H1("2. Photothèque et vidéothèque"),

    H2("2.1. Stockage"),
    Bullet("Hébergement : Scaleway Object Storage France (cohérence Politique cybersécurité)."),
    Bullet("Organisation par dossier : /destination/voyage/année/."),
    Bullet("Cohérence avec Politique image et droit à l'image (accords liés)."),
    Bullet("Sauvegarde quotidienne (cohérence Politique de gestion documentaire)."),

    H2("2.2. Volume estimé"),
    Bullet("An 1 : ≈ 500 GB (1 000 voyages × 100 photos/vidéo HD)."),
    Bullet("An 3 : ≈ 5 TB."),
    Bullet("An 5 : ≈ 30 TB."),

    H2("2.3. Conventions de nommage"),
    Bullet("Format : YYYYMMDD_destination_voyage_index.[ext]."),
    Bullet("Métadonnées EXIF préservées."),
    Bullet("Tags par destination, par voyage, par accord (oui/non)."),

    H2("2.4. Archivage"),
    Bullet("Photos > 5 ans : archive long terme (compression supplémentaire si volume)."),
    Bullet("Suppression définitive selon accord (cohérence Politique image et droit à l'image)."),

    H1("3. Kits voyageurs"),

    H2("3.1. Composition d'un kit type"),
    Bullet("Badge voyageur (réutilisable An 2-3 : matériau durable)."),
    Bullet("Programme imprimé (1-2 pages recyclées)."),
    Bullet("Carnet de voyage léger (optionnel — promotion ATR)."),
    Bullet("Stylo (réutilisable, non plastique)."),
    Bullet("Carte de pochette transport (avec info clés)."),
    Bullet("Petit cadeau (savon local ou cartes postales)."),

    H2("3.2. Volumes prévisionnels"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Élément kit", "An 1 (1 K voyages)", "An 5 (30 K voyages)"],
      rows: [
        ["Badges (réutilisables)", "300", "1 500"],
        ["Programmes imprimés", "30 K", "900 K"],
        ["Stylos", "30 K", "900 K"],
        ["Cartes pochette", "30 K", "900 K"],
        ["Cadeaux locaux", "30 K", "900 K"],
      ],
    }),

    H2("3.3. Approvisionnement"),
    Bullet("Préférence aux fournisseurs locaux ESS (cohérence Politique d'achats responsables)."),
    Bullet("Refus du plastique à usage unique."),
    Bullet("Préférence au papier recyclé certifié (FSC, PEFC)."),
    Bullet("Stockage minimal (commande 30-60 j avant voyage)."),
    Bullet("Refus du sur-stock (refus de produire pour la poubelle)."),

    H1("4. Supports marketing imprimés"),

    H2("4.1. Catalogue annuel"),
    Bullet("Tirage limité (5 000 exemplaires An 1, 50 000 An 3)."),
    Bullet("Distribution ciblée (CSE, salons, partenaires)."),
    Bullet("Papier recyclé certifié."),
    Bullet("Imprimerie locale ESS de préférence."),

    H2("4.2. Brochures voyages"),
    Bullet("Préférence à la version numérique (PDF)."),
    Bullet("Impression à la demande pour rendez-vous physiques."),
    Bullet("Refus du tirage massif sans usage prévu."),

    H1("5. Stocks bureau et matériel équipe"),

    H2("5.1. Fournitures bureau"),
    Bullet("Achat groupé chez fournisseur ESS local."),
    Bullet("Préférence aux produits durables (refus du jetable)."),
    Bullet("Cohérence avec Politique d'achats responsables."),

    H2("5.2. Matériel équipe (PC, casques, etc.)"),
    Bullet("Cohérence avec Charte télétravail."),
    Bullet("Préférence aux refurbished (équipements reconditionnés)."),
    Bullet("Cycle de vie : 4-5 ans minimum."),
    Bullet("Don ou recyclage en fin de vie (refus de la mise au rebut)."),

    H1("6. Marchandise (merch)"),

    H2("6.1. Position Eventy"),
    Bullet("Refus du merch envahissant (refus du logo partout)."),
    Bullet("Edition limitée pour événements signature (anniversaire Eventy)."),
    Bullet("Préférence aux pièces utiles et durables (gourdes, sacs)."),
    Bullet("Refus du t-shirt fast-fashion."),

    H2("6.2. Si production de merch"),
    Bullet("Fabrication France ou Europe."),
    Bullet("Matériaux durables."),
    Bullet("Tirage limité (≤ 500 exemplaires par série)."),
    Bullet("Vente à prix coûtant + petit don (cohérence Politique de sponsoring et mécénat)."),

    H1("7. Outils de gestion"),
    Bullet("Tableur partagé (An 1) pour suivi simple."),
    Bullet("Outil dédié de gestion stock (Pennylane modules, ou solution dédiée An 2-3)."),
    Bullet("Inventaire annuel obligatoire (T1, cohérence Plan d'audit interne)."),
    Bullet("Refus du sur-investissement outil pour volume modeste."),

    H1("8. Engagements RSE et environnement"),
    Bullet("Cohérence avec Charte engagement carbone (mesure de l'empreinte stocks)."),
    Bullet("Cohérence avec Politique d'achats responsables (90 % France/Europe)."),
    Bullet("Bilan annuel des achats / consommations / déchets (T1)."),
    Bullet("Recyclage et don des stocks obsolètes."),
    Bullet("Refus du gaspillage."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Stocks France/Europe", "≥ 90 %", "≥ 95 %"],
        ["Plastique à usage unique", "0", "0"],
        ["Papier recyclé certifié", "100 %", "100 %"],
        ["Inventaire annuel", "1", "1"],
        ["Pertes / casses (% volume)", "≤ 2 %", "≤ 1 %"],
        ["Don / recyclage stocks obsolètes", "100 %", "100 %"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Sobriété systématique."),
    Bullet("Refus du gaspillage."),
    Bullet("Refus du jetable."),
    Bullet("Préférence aux fournisseurs ESS et locaux."),
    Bullet("Don et recyclage en fin de vie."),
    Bullet("Cohérence avec engagements RSE Eventy."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique de gestion documentaire, Politique d'achats responsables, Charte engagement carbone, Politique RSE, Politique image et droit à l'image, Politique cybersécurité, Plan de mobilité durable, Charte télétravail, Plan d'audit interne, Plan d'événements.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Documentation-API-Publique.docx",
      title: "Eventy Life — Documentation API publique",
      description: "Vision technique et cadre de l'API publique Eventy pour partenaires.",
      footer: "EVENTY LIFE SAS — Documentation API publique",
      children: documentationAPIPublique(),
    },
    {
      file: "docs/garanties/Eventy-Life-Charte-Commerciale.docx",
      title: "Eventy Life — Charte commerciale",
      description: "Posture commerciale globale et règles de vente Eventy.",
      footer: "EVENTY LIFE SAS — Charte commerciale",
      children: charteCommerciale(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Gestion-Stocks-Ressources.docx",
      title: "Eventy Life — Plan de gestion des stocks et ressources",
      description: "Photos, kits voyageurs, contenus marketing et marchandise.",
      footer: "EVENTY LIFE SAS — Plan gestion stocks et ressources",
      children: planGestionStocksRessources(),
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
