/**
 * Eventy Life — Trois documents éducation / RH / data
 *
 *   1. Plan de partenariat universitaire et formation tourisme
 *   2. Politique des stagiaires et alternants
 *   3. Politique de valorisation des données (data éthique)
 *
 * Usage : node scripts/garanties/build-universites-stagiaires-data.js
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
// DOCUMENT 1 — PLAN DE PARTENARIAT UNIVERSITAIRE ET FORMATION TOURISME
// ============================================================
function planPartenariatUniversitaire() {
  return [
    bandeauTitre(
      "PLAN DE PARTENARIAT UNIVERSITAIRE EVENTY",
      "Engagement Eventy avec écoles, universités et formations tourisme",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'EVENTY LIFE SAS en matière de partenariats avec les établissements d'enseignement supérieur et les centres de formation au tourisme. Il complète le Plan de partenariats institutionnels (qui couvre les acteurs publics et professionnels), la Politique des stagiaires et alternants (qui couvre l'accueil RH) et la Politique de sponsoring et mécénat.", { italics: true }),

    P("Eventy croit que la formation des futurs acteurs du tourisme est un enjeu collectif. Notre approche : engagement durable avec les écoles, contributions concrètes (interventions, stages qualitatifs, projets pédagogiques), refus de l'instrumentalisation académique. Nous voulons aussi apprendre des étudiants — ils sont l'avenir du secteur.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Objectifs"),
    Bullet("Contribuer à la formation des futurs acteurs du tourisme."),
    Bullet("Faire connaître les valeurs Eventy aux nouvelles générations."),
    Bullet("Recruter des profils alignés (cohérence Procédure de recrutement)."),
    Bullet("Apprendre des étudiants (tendances, attentes, idées)."),
    Bullet("Soutenir la recherche tourisme durable."),

    H2("1.2. Cinq principes"),
    Bullet("Engagement durable — préférence aux partenariats pluriannuels."),
    Bullet("Réciprocité — Eventy donne et reçoit."),
    Bullet("Qualité — refus des stages d'observation passive."),
    Bullet("Diversité — partenariats avec écoles publiques et privées."),
    Bullet("Refus de l'instrumentalisation — pas d'utilisation marketing exclusive."),

    H1("2. Établissements cibles"),

    H2("2.1. Universités tourisme et hôtellerie"),
    Bullet("Université Paris 1 Panthéon-Sorbonne — Master Tourisme."),
    Bullet("Université Toulouse Jean Jaurès — ISTHIA."),
    Bullet("Université d'Angers — UFR ESTHUA."),
    Bullet("Université Côte d'Azur — Master Tourisme."),
    Bullet("Universités régionales avec parcours tourisme."),

    H2("2.2. Écoles de commerce avec spécialisation tourisme"),
    Bullet("ESSEC — Chaire Tourisme."),
    Bullet("Vatel."),
    Bullet("Excelia La Rochelle."),
    Bullet("Kedge Business School (Bordeaux/Marseille)."),

    H2("2.3. Écoles spécialisées hôtellerie/restauration"),
    Bullet("Institut Paul Bocuse."),
    Bullet("Ferrandi Paris."),
    Bullet("École hôtelière de Lausanne (Suisse — cohérence Plan d'expansion internationale)."),

    H2("2.4. Formations digitales et tech"),
    Bullet("Écoles dev (École 42, Epitech, etc.)."),
    Bullet("Bootcamps tech (Le Wagon, Ironhack)."),
    Bullet("Cohérence avec Roadmap technique (recrutement profils dev)."),

    H1("3. Types d'engagement"),

    H2("3.1. Niveau 1 — Interventions ponctuelles"),
    Bullet("Conférences invitées sur le tourisme durable."),
    Bullet("Études de cas Eventy en cours."),
    Bullet("Tables rondes sur les enjeux tourisme."),
    Bullet("Pas de rémunération mais pris en charge des frais."),

    H2("3.2. Niveau 2 — Accueil de stagiaires et alternants"),
    Bullet("Cohérence avec Politique des stagiaires et alternants."),
    Bullet("Sujets concrets, mentorat de qualité."),
    Bullet("Refus des stages d'observation passive."),
    Bullet("Possibilité d'embauche post-stage."),

    H2("3.3. Niveau 3 — Projets pédagogiques structurés"),
    Bullet("Projets de fin d'études confiés à des groupes d'étudiants."),
    Bullet("Sujets : étude marché, conception voyage, audit RSE."),
    Bullet("Restitution finale avec implication équipe Eventy."),
    Bullet("Indemnisation collective (1 000-3 000 € par projet)."),

    H2("3.4. Niveau 4 — Chaire ou partenariat structurant"),
    Bullet("Cible An 4-5 : possibilité de chaire Eventy / Tourisme transparent."),
    Bullet("Co-financement de bourses pour étudiants méritants."),
    Bullet("Soutien à des programmes de recherche."),
    Bullet("Validation associés (cohérence Pacte associés Seed) — engagement pluriannuel."),

    H1("4. Calendrier de déploiement"),
    makeTable({
      widths: [3744, 5616],
      header: ["Période", "Engagements"],
      rows: [
        ["An 1", "1-2 conférences invitées / an, premiers stages qualitatifs"],
        ["An 2", "Convention avec 2-3 universités, alternants tech (cohérence Roadmap technique)"],
        ["An 3", "5 universités partenaires, projets pédagogiques structurés"],
        ["An 4", "Étude chaire Eventy / Tourisme transparent"],
        ["An 5", "Chaire active + bourses étudiantes"],
      ],
    }),

    H1("5. Engagements éthiques"),
    Bullet("Refus de l'instrumentalisation marketing du partenariat."),
    Bullet("Refus du recrutement déguisé via stages."),
    Bullet("Stages indemnisés équitablement (≥ minimum légal)."),
    Bullet("Encadrement de qualité par des collaborateurs disponibles."),
    Bullet("Refus des partenariats avec écoles aux pratiques discriminatoires."),
    Bullet("Refus de l'imposition d'orientations académiques."),

    H1("6. Modalités contractuelles"),
    Bullet("Convention de partenariat formalisée."),
    Bullet("Cohérence avec Plan de partenariats institutionnels."),
    Bullet("Renouvellement annuel (cohérence Procédure d'amélioration continue)."),
    Bullet("Reporting annuel des actions menées."),
    Bullet("Clause de confidentialité (NDA) si information sensible."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Universités partenaires actives", "≥ 1", "≥ 5"],
        ["Conférences / interventions / an", "≥ 2", "≥ 10"],
        ["Stagiaires accueillis / an", "≥ 1", "≥ 5"],
        ["Alternants / an", "0", "≥ 3"],
        ["Projets pédagogiques structurés", "0", "≥ 2"],
        ["Embauches post-stage / alternance", "Suivi", "≥ 30 % conversion"],
      ],
    }),

    H1("8. Engagements opposables"),
    Bullet("Pluriannualité des partenariats majeurs (≥ 3 ans)."),
    Bullet("Indemnisation juste des stagiaires/alternants."),
    Bullet("Refus des stages low-cost extractifs."),
    Bullet("Encadrement de qualité (mentor dédié)."),
    Bullet("Reporting annuel transparent."),
    Bullet("Diversité des partenaires (publics / privés / professionnels)."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan de partenariats institutionnels, Politique des stagiaires et alternants, Politique de sponsoring et mécénat, Procédure de recrutement, Roadmap technique, Plan stratégique 5 ans, Pacte d'associés Seed, Politique RSE, Charte d'inclusion et diversité.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE DES STAGIAIRES ET ALTERNANTS
// ============================================================
function politiqueStagiairesAlternants() {
  return [
    bandeauTitre(
      "POLITIQUE DES STAGIAIRES ET ALTERNANTS EVENTY",
      "Encadrement éthique de l'accueil des étudiants en formation",
    ),
    Spacer(160),

    P("La présente politique formalise les règles d'EVENTY LIFE SAS pour l'accueil des stagiaires (du collège au master) et alternants (BTS, licence pro, master, formations tech). Elle complète le Plan de partenariat universitaire, la Procédure de recrutement, la Charte télétravail, le Modèle d'entretien annuel et la Charte des valeurs et code éthique équipe.", { italics: true }),

    P("Eventy refuse l'exploitation des stagiaires et alternants. Notre approche : sujets concrets, mentorat de qualité, indemnisation équitable, refus du stagiaire-photocopieur. Un stage chez Eventy est une opportunité d'apprentissage réel, pas un travail gratuit déguisé. La qualité de l'accueil reflète notre engagement RSE social.", { italics: true }),

    H1("1. Cadre légal"),
    Bullet("Articles L124-1 à L124-20 du Code de l'éducation (stages)."),
    Bullet("Loi Cherpion 2011 et Loi Travail 2014 (encadrement renforcé)."),
    Bullet("Articles L6211-1 à L6232-9 du Code du travail (alternance)."),
    Bullet("Convention de stage tripartite (étudiant, école, entreprise)."),
    Bullet("Procédure de recrutement Eventy (cohérence)."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes"),
    Bullet("Apprentissage réel — refus du stagiaire-photocopieur."),
    Bullet("Mentorat de qualité — un encadrant dédié et disponible."),
    Bullet("Indemnisation équitable — au-delà du minimum légal."),
    Bullet("Inclusion — pas de différence de traitement avec les salariés."),
    Bullet("Engagement durable — préférence à l'embauche post-stage si profil aligné."),

    H2("2.2. Refus structurés"),
    Bullet("Refus du stage longue durée sur des tâches répétitives sans intérêt formateur."),
    Bullet("Refus de la gratification minimale pour des tâches qualifiées."),
    Bullet("Refus du stage de remplacement de poste salarié."),
    Bullet("Refus du non-respect des conventions de stage."),
    Bullet("Refus du recrutement caché par stage low-cost."),

    H1("3. Catégories accueillies"),

    H2("3.1. Stages courts (1-2 semaines)"),
    Bullet("Élèves de 3e (stage d'observation)."),
    Bullet("Étudiants en orientation."),
    Bullet("Format découverte — pas d'attente productive."),
    Bullet("Indemnité forfaitaire 50 € (cadeau non obligatoire mais Eventy choisit)."),

    H2("3.2. Stages moyens (1-3 mois)"),
    Bullet("Étudiants en BTS, licence, parcours universitaires."),
    Bullet("Sujet concret avec livrable."),
    Bullet("Gratification légale + 30 % bonus Eventy."),
    Bullet("Tickets restaurant et frais de transport pris en charge."),

    H2("3.3. Stages longs (4-6 mois)"),
    Bullet("Étudiants en master, écoles de commerce, écoles spécialisées."),
    Bullet("Mission stratégique avec livrable d'envergure."),
    Bullet("Gratification légale + 50 % bonus Eventy."),
    Bullet("Possibilité de télétravail (cohérence Charte télétravail)."),
    Bullet("Possibilité d'embauche post-stage."),

    H2("3.4. Alternants (12-24 mois)"),
    Bullet("BTS, licence pro, master, formations tech (Wagon, etc.)."),
    Bullet("Salaire conforme à la convention collective + 10 % bonus Eventy."),
    Bullet("Statut équivalent salarié pour avantages (mutuelle, ticket resto, etc.)."),
    Bullet("Plan de formation individuel (cohérence Plan de formation interne)."),

    H1("4. Indemnisation et avantages"),

    H2("4.1. Gratification stagiaires (2026)"),
    Bullet("Minimum légal (≥ 308 h consécutives) : 4,35 €/h × 35h × 22 j ≈ 670 €/mois."),
    Bullet("Bonus Eventy : +30 % stages 1-3 mois, +50 % stages 4-6 mois."),
    Bullet("Soit ≈ 870 €/mois (stage 1-3 mois) ou ≈ 1 005 €/mois (4-6 mois)."),

    H2("4.2. Avantages"),
    Bullet("Tickets restaurant (10 €/jour ouvré, prise en charge 60 % Eventy)."),
    Bullet("Frais de transport (50 % abonnement transports en commun)."),
    Bullet("Mutuelle prise en charge à 70 % (cohérence Charte télétravail)."),
    Bullet("Forfait Mobilités Durables (proratisé — cohérence Plan de mobilité durable)."),

    H2("4.3. Salaire alternants"),
    Bullet("Conforme à la convention collective applicable."),
    Bullet("Bonus Eventy +10 %."),
    Bullet("Évolution annuelle prévue."),

    H1("5. Encadrement"),

    H2("5.1. Mentor dédié"),
    Bullet("Désigné dès l'arrivée."),
    Bullet("Disponible : ≥ 2 h/semaine de point individuel."),
    Bullet("Formé à l'encadrement (cohérence Plan de formation interne)."),
    Bullet("Référent qualité du stage."),

    H2("5.2. Onboarding"),
    Bullet("Cohérence avec Procédure de recrutement (onboarding J0 → J+30)."),
    Bullet("Lecture âme Eventy avec mentor (45 min)."),
    Bullet("Découverte de l'équipe et des partenaires."),
    Bullet("Module sécurité et RGPD."),
    Bullet("Plan d'objectifs 30/60/90 jours."),

    H2("5.3. Suivi"),
    Bullet("Point hebdomadaire avec mentor."),
    Bullet("Point mensuel avec Président."),
    Bullet("Évaluation à mi-parcours (avec école pour les conventions)."),
    Bullet("Évaluation finale avec restitution livrable."),

    H1("6. Sujets de stage / alternance"),

    H2("6.1. Domaines prioritaires"),
    Bullet("Marketing digital et SEO."),
    Bullet("Développement web (cohérence Roadmap technique)."),
    Bullet("Communication et réseaux sociaux."),
    Bullet("Opérations voyage (cohérence Méthodologie de création de voyage)."),
    Bullet("Études de marché et veille (cohérence Plan d'études et veille marché)."),
    Bullet("RSE et carbone (cohérence Charte engagement carbone)."),

    H2("6.2. Sujets refusés"),
    Bullet("Tâches purement administratives répétitives."),
    Bullet("Remplacement d'un poste salarié vacant."),
    Bullet("Sujets sans valeur formatrice."),
    Bullet("Sujets sans livrable concret."),

    H1("7. Inclusion et diversité"),
    Bullet("Cohérence avec Charte d'inclusion et diversité."),
    Bullet("Refus de la discrimination dans la sélection."),
    Bullet("Stages accessibles aux étudiants handicapés (avec aménagements)."),
    Bullet("Préférence aux étudiants venant d'horizons divers."),
    Bullet("Pas de pré-requis discriminants (école précise, niveau d'études élevé pour tâches simples)."),

    H1("8. Possibilité d'embauche post-stage / alternance"),
    Bullet("Évaluation à mi-parcours et fin de période."),
    Bullet("Possibilité d'offre d'embauche pour profils alignés."),
    Bullet("Cohérence avec Procédure de recrutement (priorité aux candidats internes)."),
    Bullet("Refus de la promesse non tenue (« si tu fais bien, on t'embauche »)."),
    Bullet("Communication transparente sur les opportunités réelles."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Stagiaires accueillis / an", "≥ 1", "≥ 5"],
        ["Alternants / an", "0", "≥ 3"],
        ["Évaluation moyenne stagiaires", "≥ 4/5", "≥ 4,5/5"],
        ["NPS stagiaires post-stage", "≥ + 70", "≥ + 80"],
        ["Taux d'embauche post-stage", "Suivi", "≥ 30 %"],
        ["Plaintes stagiaires", "0", "0"],
      ],
    }),

    H1("10. Engagements opposables"),
    Bullet("Indemnisation au-delà du minimum légal."),
    Bullet("Mentor dédié à chaque stagiaire."),
    Bullet("Sujet formateur et concret."),
    Bullet("Refus de l'exploitation."),
    Bullet("Égalité de traitement avec les salariés."),
    Bullet("Refus du stage cosmétique pour image RSE."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan de partenariat universitaire, Procédure de recrutement, Charte télétravail, Modèle d'entretien annuel, Plan de formation interne, Charte des valeurs et code éthique équipe, Charte d'inclusion et diversité, Plan de mobilité durable, Politique RSE.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — POLITIQUE DE VALORISATION DES DONNÉES
// ============================================================
function politiqueValorisationDonnees() {
  return [
    bandeauTitre(
      "POLITIQUE DE VALORISATION DES DONNÉES EVENTY",
      "Data éthique et utilisation responsable des données voyageurs",
    ),
    Spacer(160),

    P("La présente politique formalise la position d'EVENTY LIFE SAS sur l'utilisation et la valorisation des données générées par son activité (données voyageurs, partenaires, opérationnelles). Elle complète et précise la Politique de confidentialité RGPD, la Politique cybersécurité, le DPA Sous-traitance RGPD, la Politique cookies et la Roadmap technique.", { italics: true }),

    P("Eventy refuse la monétisation des données voyageurs. Notre approche : données utilisées strictement pour la finalité voyage, pas de revente ni de partage commercial, transparence absolue, refus du tracking abusif. Les données voyageurs ne sont pas un actif à exploiter — c'est une responsabilité.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Cadre juridique"),
    Bullet("RGPD (Règlement (UE) 2016/679)."),
    Bullet("Loi Informatique et Libertés (1978 modifiée)."),
    Bullet("CNIL — recommandations et sanctions."),
    Bullet("ePrivacy (cookies et traceurs)."),
    Bullet("Politique RGPD Eventy (cohérence)."),

    H2("1.2. Catégories de données Eventy"),
    Bullet("Données identité civile (voyageurs, partenaires)."),
    Bullet("Données contact (email, téléphone, adresse)."),
    Bullet("Données de paiement (gérées par Stripe — Eventy ne stocke pas le PAN)."),
    Bullet("Données médicales (allergies, mobilité — chiffrement applicatif renforcé)."),
    Bullet("Données comportementales (parcours sur le site, voyages effectués)."),
    Bullet("Données opérationnelles (volumes voyages, marges, NPS, etc.)."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes"),
    Bullet("Finalité voyage — données utilisées pour rendre le service voyage."),
    Bullet("Minimisation — collecter le strict nécessaire."),
    Bullet("Souveraineté — refus de la cession à des tiers."),
    Bullet("Transparence — le voyageur sait ce qu'on fait avec ses données."),
    Bullet("Sobriété — refus du tout-data extractif."),

    H2("2.2. Refus structurés"),
    Bullet("**Refus absolu de la vente ou cession des données voyageurs à des tiers.**"),
    Bullet("Refus de la monétisation publicitaire des données."),
    Bullet("Refus du tracking comportemental tiers (Facebook Pixel, Google Analytics 4 invasif)."),
    Bullet("Refus de l'IA générative entraînée sur données voyageurs."),
    Bullet("Refus des cookies non essentiels imposés."),
    Bullet("Refus de la profilage publicitaire abusif."),

    H1("3. Utilisations autorisées des données voyageurs"),

    H2("3.1. Finalité voyage (cœur)"),
    Bullet("Réservation, paiement, exécution du voyage."),
    Bullet("Communication transactionnelle (confirmation, roadbook, NPS)."),
    Bullet("Pack Sérénité (assistance, rapatriement)."),
    Bullet("Cohérence avec CGV et Politique RGPD."),

    H2("3.2. Finalité gestion contractuelle"),
    Bullet("Comptabilité (10 ans légal)."),
    Bullet("Réclamations (cohérence Procédure de réclamation détaillée)."),
    Bullet("Audit qualité voyage."),

    H2("3.3. Finalité communication (consentement requis)"),
    Bullet("Newsletter mensuelle (opt-in)."),
    Bullet("Programme de fidélisation Eventy Famille."),
    Bullet("Communication ciblée sur destinations similaires."),

    H2("3.4. Finalité statistique anonymisée"),
    Bullet("Analyses internes (NPS, taux conversion, etc.)."),
    Bullet("Reporting RSE et investisseurs (anonymisé)."),
    Bullet("Bilan annuel public (anonymisé)."),
    Bullet("Étude de marché (anonymisée et agrégée)."),

    H1("4. Refus structurels"),

    H2("4.1. Refus de la cession à tiers"),
    Bullet("Aucune vente de données voyageurs."),
    Bullet("Aucun partage à des fins commerciales tierces."),
    Bullet("Aucun transfert hors UE non encadré (cohérence DPA Sous-traitance RGPD)."),
    Bullet("Refus de l'API publique exposant des données voyageurs (cohérence Documentation API publique)."),

    H2("4.2. Refus du tracking abusif"),
    Bullet("Refus de Facebook Pixel."),
    Bullet("Refus de Google Analytics standard (préférence Plausible / Matomo / GA4 sans cookies)."),
    Bullet("Refus du fingerprinting."),
    Bullet("Refus du tracking inter-sites."),
    Bullet("Cohérence avec Politique cookies."),

    H2("4.3. Refus de l'IA générative invasive"),
    Bullet("Refus d'entraîner des modèles d'IA sur données voyageurs."),
    Bullet("Refus de transmettre des données voyageurs à OpenAI, Anthropic, etc."),
    Bullet("Refus du chatbot IA non maîtrisé (cohérence Politique support multicanal)."),
    Bullet("Cohérence avec Roadmap technique (refus tout-IA)."),

    H1("5. Anonymisation et pseudonymisation"),

    H2("5.1. Anonymisation"),
    Bullet("Suppression des identifiants directs (nom, email, etc.)."),
    Bullet("Aggregation par groupes pour statistiques publiques."),
    Bullet("Validation que la ré-identification n'est pas possible."),
    Bullet("Conservation possible long terme (cohérence Politique de gestion documentaire)."),

    H2("5.2. Pseudonymisation"),
    Bullet("Remplacement des identifiants par des codes."),
    Bullet("Table de correspondance protégée séparément."),
    Bullet("Possibilité de ré-identification si justifiée."),
    Bullet("Préférable à l'anonymisation pour les analyses internes."),

    H2("5.3. Calendrier"),
    Bullet("Pseudonymisation après 3 ans pour les analyses internes."),
    Bullet("Anonymisation totale après 5 ans (sauf comptabilité 10 ans)."),
    Bullet("Cohérence avec Politique de gestion documentaire."),

    H1("6. Droits des voyageurs"),

    H2("6.1. Droits RGPD"),
    Bullet("Droit d'accès (export JSON des données)."),
    Bullet("Droit de rectification."),
    Bullet("Droit à l'effacement (sous réserves légales)."),
    Bullet("Droit à la portabilité."),
    Bullet("Droit d'opposition."),
    Bullet("Droit à la limitation."),
    Bullet("Cohérence avec Politique RGPD."),

    H2("6.2. Modalités d'exercice"),
    Bullet("Email à : dpo@eventylife.fr."),
    Bullet("Réponse sous 30 jours maximum (RGPD article 12)."),
    Bullet("Pas de frais pour l'exercice des droits."),
    Bullet("Recours possible auprès de la CNIL."),

    H1("7. Sécurité des données"),
    Bullet("Cohérence avec Politique cybersécurité."),
    Bullet("Hébergement Scaleway France (souveraineté numérique)."),
    Bullet("Chiffrement AES-256 au repos, TLS 1.3 en transit."),
    Bullet("MFA obligatoire pour accès admin."),
    Bullet("Audit annuel (cohérence Plan d'audit interne)."),

    H1("8. Cas particulier — données médicales"),
    Bullet("Catégorie spéciale RGPD article 9."),
    Bullet("Chiffrement applicatif renforcé (champs colonne chiffrés)."),
    Bullet("Accès strictement limité (Pack Sérénité, accompagnateur briefé)."),
    Bullet("Suppression après le voyage (sauf comptabilité)."),

    H1("9. Engagements éthiques opposables"),
    Bullet("Refus absolu de la vente de données."),
    Bullet("Refus du tracking comportemental tiers."),
    Bullet("Souveraineté numérique préservée (hébergement France)."),
    Bullet("Transparence absolue sur les utilisations."),
    Bullet("Réponse aux demandes d'exercice des droits sous 30 j."),
    Bullet("Audit annuel de la politique."),
    Bullet("Refus de l'IA générative non maîtrisée sur données voyageurs."),

    H1("10. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Demandes RGPD traitées sous 30 j", "100 %", "100 %"],
        ["Cessions de données voyageurs", "0", "0"],
        ["Cookies tiers non essentiels", "0", "0"],
        ["Trackers Facebook Pixel / GA invasif", "0", "0"],
        ["Plaintes CNIL", "0", "0"],
        ["Audit annuel data éthique", "1", "1"],
      ],
    }),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique de confidentialité RGPD, Politique cybersécurité, DPA Sous-traitance RGPD, Politique cookies, Roadmap technique, Documentation API publique, Politique de gestion documentaire, Politique support multicanal, Plan d'audit interne, Plan d'expérimentation et tests, Politique de communication interne.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Plan-Partenariat-Universitaire.docx",
      title: "Eventy Life — Plan de partenariat universitaire et formation tourisme",
      description: "Engagement Eventy avec écoles, universités et formations tourisme.",
      footer: "EVENTY LIFE SAS — Plan partenariat universitaire",
      children: planPartenariatUniversitaire(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Stagiaires-Alternants.docx",
      title: "Eventy Life — Politique des stagiaires et alternants",
      description: "Encadrement éthique de l'accueil des étudiants en formation.",
      footer: "EVENTY LIFE SAS — Politique stagiaires et alternants",
      children: politiqueStagiairesAlternants(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Valorisation-Donnees.docx",
      title: "Eventy Life — Politique de valorisation des données",
      description: "Data éthique et utilisation responsable des données voyageurs.",
      footer: "EVENTY LIFE SAS — Politique data éthique",
      children: politiqueValorisationDonnees(),
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
