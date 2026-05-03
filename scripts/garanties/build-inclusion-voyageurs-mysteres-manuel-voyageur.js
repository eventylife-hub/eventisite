/**
 * Eventy Life — Trois documents inclusion / qualité voyageur
 *
 *   1. Charte d'inclusion et diversité
 *   2. Plan d'audit voyageurs-mystères
 *   3. Manuel voyageur autonome (handbook pratique)
 *
 * Usage : node scripts/garanties/build-inclusion-voyageurs-mysteres-manuel-voyageur.js
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
// DOCUMENT 1 — CHARTE D'INCLUSION ET DIVERSITÉ
// ============================================================
function charteInclusionDiversite() {
  return [
    bandeauTitre(
      "CHARTE D'INCLUSION ET DIVERSITÉ EVENTY",
      "Engagements pour une équipe et une communauté ouvertes",
    ),
    Spacer(160),

    P("La présente charte formalise les engagements d'EVENTY LIFE SAS en matière d'inclusion et de diversité. Elle s'applique à toutes les parties prenantes : équipe interne, partenaires (créateurs, vendeurs, ambassadeurs, HRA), voyageurs. Elle complète la Politique RSE (pilier social), la Procédure de recrutement, la Politique accessibilité PMR et la Charte télétravail.", { italics: true }),

    P("Eventy considère que la diversité est une richesse — pas une contrainte ni un argument marketing. Une équipe diverse imagine des voyages pour davantage de monde. Une communauté inclusive s'enrichit de la rencontre entre profils. Cette charte n'est pas un texte de communication : c'est un cadre concret d'action.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Article L1132-1 du Code du travail — non-discrimination (25 critères)."),
    Bullet("Loi du 11 février 2005 — égalité des droits et des chances."),
    Bullet("Loi du 27 mai 2008 — non-discrimination."),
    Bullet("Loi Climat et Résilience — pilier social."),
    Bullet("Politique RSE Eventy (cohérence)."),
    Bullet("Convention OIT n° 100 et 111 — égalité de rémunération et non-discrimination emploi."),

    H1("2. Engagements généraux"),

    H2("2.1. Six principes"),
    Bullet("Égalité de traitement absolue — aucun des 25 critères discriminatoires."),
    Bullet("Transparence salariale — fourchettes publiées dans annonces (cohérence Procédure de recrutement)."),
    Bullet("Accessibilité — voyages, locaux, plateforme (cohérence Politique accessibilité PMR + Plan accessibilité numérique)."),
    Bullet("Représentation — équipe et communication reflètent la diversité de la société."),
    Bullet("Bienveillance — refus de tout harcèlement, discrimination ou comportement excluant."),
    Bullet("Action concrète — au-delà des mots, des engagements chiffrés et mesurés."),

    H2("2.2. Refus structurés"),
    Bullet("Refus de la discrimination par origine, sexe, orientation, identité de genre, religion."),
    Bullet("Refus de la discrimination par âge (jeune ou senior)."),
    Bullet("Refus du validisme (discrimination des personnes en situation de handicap)."),
    Bullet("Refus de la discrimination économique (par patronyme, lieu de résidence, domiciliation bancaire)."),
    Bullet("Refus du token-isme (mettre en avant des minorités sans engagement réel)."),
    Bullet("Refus du performatif sans actions concrètes."),

    H1("3. Engagements équipe interne"),

    H2("3.1. Recrutement"),
    Bullet("Annonces épicènes (cohérence Procédure de recrutement)."),
    Bullet("Refus des photos / âge / situation familiale dans les CV reçus."),
    Bullet("Diversité de la short-list (au moins 30 % candidats issus de profils sous-représentés)."),
    Bullet("Tests blancs si possible (CV anonyme pour le tri initial)."),
    Bullet("Cible parité H/F minimum 40 % An 1 → 45-55 % An 3."),
    Bullet("Cible recrutements personnes en situation de handicap : ≥ 6 % à terme (obligation légale ≥ 11 salariés)."),

    H2("3.2. Carrière et rémunération"),
    Bullet("Égalité salariale stricte (analyse annuelle des écarts H/F)."),
    Bullet("Refus de l'écart de salaire à compétences et expérience égales."),
    Bullet("Rapport max/min salaire ≤ 5 (engagement Charte télétravail)."),
    Bullet("Promotion interne sur compétences, pas sur affinités."),
    Bullet("Égalité d'accès à la formation (cohérence Plan de formation interne)."),

    H2("3.3. Climat de travail"),
    Bullet("Référent harcèlement et discrimination dès le 1er salarié (au-delà de l'obligation légale 11 salariés)."),
    Bullet("Procédure de signalement bienveillant (cohérence Procédure de signalement)."),
    Bullet("Confidentialité absolue des signalements."),
    Bullet("Sanctions claires et appliquées en cas de comportement discriminant."),
    Bullet("Sensibilisation annuelle (cohérence Plan de formation interne)."),

    H1("4. Engagements voyageurs"),

    H2("4.1. Accueil"),
    Bullet("Aucun voyageur refusé en raison d'un critère discriminatoire."),
    Bullet("Refus de la sélection à l'entrée (sauf nécessité opérationnelle absolue justifiée)."),
    Bullet("Accompagnateur formé à l'accueil de la diversité."),

    H2("4.2. Accessibilité"),
    Bullet("Cohérence avec Politique accessibilité PMR (engagements détaillés)."),
    Bullet("Cohérence avec Plan accessibilité numérique (WCAG 2.1 AA)."),
    Bullet("Information précontractuelle sur le niveau d'accessibilité de chaque voyage."),

    H2("4.3. Tarification"),
    Bullet("Aucun surcoût pour critère discriminatoire (handicap, animal d'assistance, etc.)."),
    Bullet("Acceptation chèques ANCV (cohérence Politique RSE — cible An 2)."),
    Bullet("Possibilité de paiement en plusieurs fois sans frais."),

    H2("4.4. Représentation"),
    Bullet("Photos et vidéos communication reflétant la diversité réelle des voyageurs."),
    Bullet("Témoignages de profils variés (avec accord — cohérence Politique image)."),
    Bullet("Refus du marketing stéréotypé (« le voyage senior », « le voyage jeune »)."),

    H1("5. Engagements partenaires"),
    Bullet("Égalité de traitement de tous les partenaires HRA, créateurs, vendeurs, ambassadeurs."),
    Bullet("Refus du favoritisme (cohérence Politique conflits d'intérêts)."),
    Bullet("Critères objectifs et publics pour le référencement (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Refus du dumping social via prestataires (cohérence Politique d'achats responsables)."),

    H1("6. Représentation et inclusion dans les contenus"),

    H2("6.1. Communication"),
    Bullet("Refus des stéréotypes (cohérence Charte éditoriale)."),
    Bullet("Visuels reflétant la diversité (âge, origines, morphologies, situations)."),
    Bullet("Langage épicène quand possible."),
    Bullet("Refus de la « tokenisation » (mettre en avant uniquement à des fins de communication)."),

    H2("6.2. Catalogue voyages"),
    Bullet("Voyages adaptés à différents profils, budgets, capacités physiques."),
    Bullet("Information transparente sur les contraintes."),
    Bullet("Cohérence avec Grille de décision destinations (refus destinations contraires aux droits humains)."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Parité H/F équipe", "≥ 40 %", "≥ 45 %"],
        ["Recrutements personnes en situation de handicap", "≥ 3 %", "≥ 6 %"],
        ["Écart salarial H/F (compétences égales)", "≤ 3 %", "0 %"],
        ["Plaintes harcèlement / discrimination internes", "0", "0"],
        ["Voyages accessibles PMR fauteuil roulant", "≥ 30 %", "≥ 60 %"],
        ["Diversité représentation contenus", "Audité annuellement", "Audité annuellement"],
        ["Formation diversité équipe", "100 %", "100 %"],
      ],
    }),

    H1("8. Mesures et sanctions"),

    H2("8.1. Discrimination interne"),
    Bullet("Avertissement pour comportement inapproprié non intentionnel."),
    Bullet("Mise à pied disciplinaire pour comportement répété."),
    Bullet("Licenciement pour faute grave en cas de discrimination caractérisée."),
    Bullet("Cohérence avec Procédure de signalement et Politique conflits d'intérêts."),

    H2("8.2. Discrimination par partenaire"),
    Bullet("Avertissement et plan d'amélioration."),
    Bullet("Suspension de la relation commerciale."),
    Bullet("Résiliation immédiate en cas de discrimination caractérisée."),

    H2("8.3. Recours pour les victimes"),
    Bullet("Signalement à : alerte@eventylife.fr (cohérence Procédure de signalement)."),
    Bullet("Référent harcèlement et discrimination."),
    Bullet("Possibilité de saisine du Défenseur des droits."),
    Bullet("Soutien juridique et psychologique."),

    H1("9. Gouvernance"),
    Bullet("Référent inclusion et diversité : Président en An 1, recrutement An 2-3."),
    Bullet("Comité diversité trimestriel (Président + référent + 1 collaborateur volontaire)."),
    Bullet("Reporting annuel public (cohérence Politique RSE)."),
    Bullet("Audit externe diversité tous les 3 ans (cible An 4)."),

    H1("10. Engagements opposables"),
    Bullet("Reporting annuel public des indicateurs."),
    Bullet("Maintien de la parité H/F minimum 40 %."),
    Bullet("Recrutement progressif des personnes en situation de handicap (≥ 6 % à terme)."),
    Bullet("Refus de toute pratique discriminatoire en interne et chez nos partenaires."),
    Bullet("Sanction immédiate des comportements caractérisés."),
    Bullet("Refus du performatif — actions concrètes prioritaires."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE, Procédure de recrutement, Politique accessibilité PMR, Plan d'accessibilité numérique, Charte télétravail, Procédure de signalement, Politique conflits d'intérêts, Charte éditoriale, Grille de décision destinations, Politique d'achats responsables.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN D'AUDIT VOYAGEURS-MYSTÈRES
// ============================================================
function planVoyageursMysteres() {
  return [
    bandeauTitre(
      "PLAN D'AUDIT VOYAGEURS-MYSTÈRES EVENTY",
      "Méthodologie d'évaluation qualité par observateurs intégrés",
    ),
    Spacer(160),

    P("Le présent plan formalise le programme de voyageurs-mystères d'EVENTY LIFE SAS. Il complète la Procédure d'audit qualité HRA (audits programmés annuels) en y ajoutant des audits inopinés intégrés dans le déroulé normal d'un voyage. Il vise à mesurer la qualité réelle de l'expérience voyageur, sans biais lié à la programmation.", { italics: true }),

    P("Les voyageurs-mystères sont des observateurs neutres et bienveillants. Ils ne sont pas des espions punitifs : leur rôle est d'apporter des données factuelles utilisables pour l'amélioration continue. Cette démarche est cohérente avec notre Procédure d'amélioration continue (« cause pas coupable »).", { italics: true }),

    H1("1. Objectifs"),
    Bullet("Mesurer la qualité réelle de l'expérience voyageur (non biaisée)."),
    Bullet("Identifier les écarts entre procédures et pratiques."),
    Bullet("Détecter les opportunités d'amélioration concrètes."),
    Bullet("Compléter les audits programmés HRA (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Alimenter le tableau de bord opérationnel (cohérence Tableau de bord opérationnel)."),

    H1("2. Cadrage"),

    H2("2.1. Qui sont les voyageurs-mystères ?"),
    Bullet("Profils variés (homme, femme, jeune, senior, solo, couple, etc.) reflétant la diversité des voyageurs Eventy."),
    Bullet("Personnes externes recrutées et formées par Eventy (refus de l'audit interne sur soi)."),
    Bullet("Possibilité d'audit par voyageurs Famille volontaires (avec accord et formation préalable)."),
    Bullet("Refus de l'audit par concurrents ou opportunistes."),

    H2("2.2. Engagement contractuel"),
    Bullet("Contrat de prestation auditrice signé."),
    Bullet("Confidentialité absolue (NDA)."),
    Bullet("Indemnité forfaitaire (200-500 € selon mission) en plus du voyage offert."),
    Bullet("Engagement de neutralité et d'objectivité."),

    H2("2.3. Anonymat"),
    Bullet("Le voyageur-mystère n'est pas identifié des autres voyageurs."),
    Bullet("Il ne révèle son rôle ni à l'accompagnateur, ni aux HRA, ni aux autres voyageurs."),
    Bullet("Identité connue uniquement du Président."),
    Bullet("Confidentialité maintenue après l'audit (sauf accord exprès)."),

    H1("3. Périmètre des audits"),

    H2("3.1. Périmètre voyageur"),
    Bullet("Parcours en ligne (réservation, paiement, espace voyageur)."),
    Bullet("Communication pré-voyage (roadbook, reconfirmations)."),
    Bullet("Accueil et démarrage du voyage."),
    Bullet("Hébergement (chambre, services, propreté)."),
    Bullet("Restauration (qualité, accueil, allergies)."),
    Bullet("Activités (organisation, qualité, accompagnement)."),
    Bullet("Transport (autocar, ponctualité, confort)."),
    Bullet("Accompagnateur (disponibilité, qualité de l'accueil, gestion conflits)."),
    Bullet("Gestion incidents (si survenue)."),
    Bullet("Communication post-voyage (remerciement, NPS, programme fidélisation)."),

    H2("3.2. Critères d'évaluation"),
    Bullet("Cohérence avec promesse Eventy (« voyage tout inclus, rien à gérer »)."),
    Bullet("Qualité de service (HRA, accompagnement)."),
    Bullet("Respect des engagements (Pack Sérénité, Charte qualité accompagnateur)."),
    Bullet("Climat humain (chaleur, bienveillance)."),
    Bullet("Respect des principes RSE (transports bas-carbone, achats locaux)."),
    Bullet("Accessibilité (cohérence Politique PMR si voyageur-mystère PMR)."),

    H1("4. Méthodologie d'audit"),

    H2("4.1. Phase 1 — Préparation (T-30 jours)"),
    Bullet("Sélection du voyage à auditer (rotation entre voyages, créateurs, accompagnateurs)."),
    Bullet("Recrutement et formation du voyageur-mystère (4 h, en visio)."),
    Bullet("Remise de la grille d'évaluation détaillée."),
    Bullet("Réservation faite normalement (sans révéler le rôle)."),

    H2("4.2. Phase 2 — Audit en condition réelle"),
    Bullet("Voyageur participe normalement au voyage."),
    Bullet("Observation discrète et factuelle."),
    Bullet("Notes prises au fil de l'eau (téléphone, journal)."),
    Bullet("Aucune intervention ou manipulation."),

    H2("4.3. Phase 3 — Restitution (J+15 max)"),
    Bullet("Rapport d'audit structuré (10-15 pages)."),
    Bullet("Notes par critère (échelle 1-5)."),
    Bullet("Verbatim et exemples concrets."),
    Bullet("Identification points forts."),
    Bullet("Identification points d'amélioration concrets."),
    Bullet("Recommandations actionnables."),

    H2("4.4. Phase 4 — Plan d'action (J+30)"),
    Bullet("Étude des recommandations par le Président + équipe."),
    Bullet("Mise à jour des procédures concernées."),
    Bullet("Communication aux parties prenantes (sans dévoiler l'identité du voyageur-mystère)."),
    Bullet("Cohérence avec Procédure d'amélioration continue."),

    H1("5. Calendrier"),
    makeTable({
      widths: [3744, 5616],
      header: ["Période", "Plan d'audit"],
      rows: [
        ["An 1", "Programme pilote — 2-3 audits voyageurs-mystères / an"],
        ["An 2", "≥ 6 audits / an, couverture sur 50 % des voyages opérés"],
        ["An 3", "≥ 12 audits / an, couverture sur 75 % des voyages"],
        ["An 5+", "Audits réguliers, programme mature avec ≥ 50 audits / an"],
      ],
    }),

    H1("6. Gouvernance"),

    H2("6.1. Sélection des voyages auditer"),
    Bullet("Rotation systématique (refus de toujours auditer les mêmes voyages)."),
    Bullet("Priorité aux voyages avec NPS récent < + 60 (alerte qualité)."),
    Bullet("Priorité aux nouveaux voyages (validation initiale)."),
    Bullet("Priorité aux nouveaux créateurs (premier voyage opéré)."),
    Bullet("Aucune transparence avec les créateurs et accompagnateurs sur les audits programmés."),

    H2("6.2. Confidentialité"),
    Bullet("Identité du voyageur-mystère : confidentielle absolue."),
    Bullet("Rapport d'audit : accès restreint au Président + référent qualité."),
    Bullet("Communication des recommandations : anonymisée pour les concernés."),

    H2("6.3. Refus structurés"),
    Bullet("Refus de l'audit punitif (objectif amélioration, pas sanction)."),
    Bullet("Refus de la communication publique des notes d'audits voyageurs-mystères."),
    Bullet("Refus de l'utilisation des audits comme outil de pression."),
    Bullet("Refus du double standard (audit appliqué uniformément, pas seulement aux 'cibles')."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Audits voyageurs-mystères / an", "≥ 2", "≥ 12"],
        ["Note moyenne audit", "≥ 4 / 5", "≥ 4,5 / 5"],
        ["Taux de mise en œuvre recommandations", "≥ 80 %", "≥ 95 %"],
        ["Délai restitution rapport", "≤ 15 j", "≤ 10 j"],
        ["Confidentialité préservée (audits sans fuite)", "100 %", "100 %"],
        ["Diversité voyageurs-mystères (profils variés)", "Suivi", "≥ 5 profils"],
      ],
    }),

    H1("8. Engagements éthiques"),
    Bullet("Bienveillance dans la formulation (cohérence Procédure d'amélioration continue)."),
    Bullet("Confidentialité absolue de l'identité voyageur-mystère."),
    Bullet("Refus du double standard."),
    Bullet("Refus de l'utilisation punitive des audits."),
    Bullet("Indemnité juste du voyageur-mystère (refus du bénévolat extractif)."),
    Bullet("Engagement de mise à jour des procédures suite aux recommandations."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Procédure d'audit qualité HRA, Charte qualité accompagnateur, Tableau de bord opérationnel, Procédure d'amélioration continue, Politique avis voyageurs, Politique image et droit à l'image, Plan d'audit interne.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — MANUEL VOYAGEUR AUTONOME
// ============================================================
function manuelVoyageurAutonome() {
  return [
    bandeauTitre(
      "MANUEL VOYAGEUR AUTONOME EVENTY",
      "Handbook pratique du voyageur en cours de voyage Eventy",
    ),
    Spacer(160),

    P("Ce manuel est un compagnon pratique pour le voyageur Eventy pendant son voyage. Il complète l'Onboarding voyageur (qui couvre tout le parcours de la découverte à la fidélisation) en se concentrant sur ce qui est utile en situation : pendant le voyage et juste avant.", { italics: true }),

    P("Eventy s'occupe de tout — mais quelques repères pratiques rendent l'expérience plus fluide. Ce manuel est conçu pour tenir dans une pochette ou être consulté sur le téléphone. Il est optionnel : si tu préfères ne pas l'avoir, l'accompagnateur connaît tout par cœur.", { italics: true }),

    H1("1. Avant de partir"),

    H2("1.1. Liste de vérification (J-1)"),
    Bullet("☐ Pièce d'identité valide (CNI ou passeport selon destination — cohérence Document administratif voyageur)."),
    Bullet("☐ Carte vitale + CEAM si UE."),
    Bullet("☐ Médicaments personnels avec ordonnance (cohérence Fiche santé voyageur international)."),
    Bullet("☐ Trousse de pharmacie minimale."),
    Bullet("☐ Coordonnées d'urgence enregistrées dans le téléphone."),
    Bullet("☐ Application bancaire opérationnelle à l'étranger."),
    Bullet("☐ Adaptateur électrique si nécessaire."),
    Bullet("☐ Sac correspondant aux conditions du voyage."),
    Bullet("☐ Téléphone chargé + chargeur."),
    Bullet("☐ Roadbook lu (envoyé J-30)."),

    H2("1.2. Documents à imprimer ou avoir sur soi"),
    Bullet("Confirmation de réservation Eventy."),
    Bullet("Voucher Pack Sérénité (numéro et contacts)."),
    Bullet("Réservation hôtel(s) le cas échéant."),
    Bullet("Numéros d'urgence Eventy."),
    Bullet("Photocopie de la pièce d'identité."),

    H1("2. Le jour du départ"),

    H2("2.1. Avant de quitter ton domicile"),
    Bullet("Vérifie l'heure du RDV (envoyée J-7) et le lieu exact."),
    Bullet("Garde du temps pour ne pas être stressé."),
    Bullet("Active la fonction « hors connexion » sur ton téléphone si destination internationale."),
    Bullet("Prends une bouteille d'eau et un en-cas."),

    H2("2.2. Au lieu de RDV"),
    Bullet("L'accompagnateur Eventy t'attend (mention « Eventy Life » et badge identifiable)."),
    Bullet("Présente-toi avec ton nom de réservation."),
    Bullet("Reçois ton kit voyageur (badge, programme imprimé, petits goodies)."),
    Bullet("Café d'accueil offert dans la mesure du possible."),
    Bullet("Briefing rapide du voyage par l'accompagnateur (15 min)."),

    H2("2.3. Pendant le trajet"),
    Bullet("Sièges confortables (autocar Grand Tourisme), prévois ton confort (oreiller cervical, plaid)."),
    Bullet("Pauses prévues toutes les 2 h (sanitaires, café)."),
    Bullet("Possibilité de discuter ou de se reposer (à ton rythme)."),

    H1("3. Pendant le voyage"),

    H2("3.1. Rythme quotidien type"),
    Bullet("Petit déjeuner buffet à l'hôtel (entre 7h et 10h selon destination)."),
    Bullet("Activité matinale (visite, randonnée, atelier)."),
    Bullet("Déjeuner (selon programme : restaurant, panier-repas, etc.)."),
    Bullet("Activité après-midi ou temps libre."),
    Bullet("Dîner (généralement restaurant local typique)."),
    Bullet("Soirée libre ou animation optionnelle."),

    H2("3.2. Liberté préservée"),
    Bullet("Tu peux choisir de skipper une activité sans surcoût."),
    Bullet("Tu peux te reposer à l'hôtel pendant qu'une partie du groupe découvre."),
    Bullet("Préviens simplement l'accompagnateur."),
    Bullet("Ton rythme est respecté."),

    H2("3.3. Disponibilité accompagnateur"),
    Bullet("Accompagnateur joignable 24/7 (excepté ses heures de sommeil)."),
    Bullet("Numéro WhatsApp partagé en groupe à J0."),
    Bullet("Disponible pour questions, conseils, urgences."),
    Bullet("Médiateur en cas de tension dans le groupe (rare mais arrive)."),

    H1("4. Pack Sérénité — comment l'utiliser"),

    H2("4.1. Quand activer"),
    Bullet("Médical (problème de santé, accident, hospitalisation)."),
    Bullet("Hébergement de secours (problème inattendu avec ton hôtel)."),
    Bullet("Perte de papiers (cohérence Document administratif voyageur)."),
    Bullet("Rapatriement médical."),
    Bullet("Soutien psychologique post-incident."),

    H2("4.2. Comment activer"),
    Numbered("Préviens l'accompagnateur Eventy en premier."),
    Numbered("L'accompagnateur appelle le numéro Pack Sérénité 24/7."),
    Numbered("Communique tes informations (nom, voyage Eventy, situation)."),
    Numbered("Tu es pris en charge directement."),
    Numbered("Aucune avance financière à faire dans la plupart des cas."),

    H2("4.3. À ne pas oublier"),
    Bullet("Conserve sur toi le numéro Pack Sérénité (sur le voucher reçu)."),
    Bullet("La Pack Sérénité ne couvre pas les achats personnels (souvenirs perdus, etc.)."),
    Bullet("Pour des dépenses gardées en option (ex : assurance annulation), elles sont indiquées dans ton contrat."),

    H1("5. Bonnes pratiques en groupe"),

    H2("5.1. Respect des autres voyageurs"),
    Bullet("Silence en chambre voisine la nuit."),
    Bullet("Tabagisme dans les zones autorisées uniquement."),
    Bullet("Photos des autres voyageurs : demande l'accord avant de publier (cohérence Politique image et droit à l'image)."),
    Bullet("Ouverture d'esprit aux autres (le voyage est aussi rencontre)."),

    H2("5.2. Respect des destinations"),
    Bullet("Respect des coutumes locales (tenue, comportement)."),
    Bullet("Respect des sites visités (pas de gravage, pas de vol de souvenirs)."),
    Bullet("Pourboires inclus pour les prestataires (chauffeurs, guides, accompagnateurs)."),
    Bullet("Refus du tourisme prédateur."),

    H2("5.3. Éco-gestes"),
    Bullet("Eau : pas de gaspillage (douches courtes, robinet fermé)."),
    Bullet("Énergie : éteindre lumière et clim en quittant la chambre."),
    Bullet("Déchets : tri quand disponible."),
    Bullet("Plastique : refuser les emballages inutiles, gourde réutilisable."),
    Bullet("Cohérence avec Charte engagement carbone Eventy."),

    H1("6. En cas de problème"),

    H2("6.1. Problème mineur (chambre, repas)"),
    Bullet("Préviens l'accompagnateur Eventy."),
    Bullet("Solution recherchée immédiatement (changement chambre, plat, etc.)."),
    Bullet("Pas d'escalade nécessaire."),

    H2("6.2. Problème modéré (santé, retard)"),
    Bullet("Activation Pack Sérénité (médical) ou alerte accompagnateur (logistique)."),
    Bullet("Communication transparente sur la situation."),
    Bullet("Information à tes proches si besoin."),

    H2("6.3. Problème majeur (accident, perte papiers)"),
    Bullet("Activation immédiate Pack Sérénité."),
    Bullet("Coordination avec l'accompagnateur Eventy."),
    Bullet("Prise en charge complète (médical, hébergement, rapatriement si nécessaire)."),
    Bullet("Information à tes proches via Eventy."),

    H1("7. Au retour"),
    Bullet("Tu reçois un email de remerciement J+1."),
    Bullet("Lien vers formulaire NPS / avis (5 questions, 3 min)."),
    Bullet("Photos du voyage partagées (avec accord)."),
    Bullet("Carte postale digitale J+15 (récap photos / temps forts)."),
    Bullet("Réflexion possible : que faire de ces souvenirs ? les partager ? proposer un futur voyage ?"),

    H1("8. Si tu veux aller plus loin"),
    Bullet("Programme Eventy Famille — paliers à vie selon nombre de voyages."),
    Bullet("Code parrainage — fais découvrir Eventy à tes proches (10 % de remise pour eux, avoir 50 € pour toi)."),
    Bullet("Programme Voix Eventy An 2 — partage ton expérience."),
    Bullet("Programme ambassadeur (si tu fais du contenu sur les voyages)."),
    Bullet("Réunions communautaires (apéros trimestriels Paris + province)."),

    H1("9. Contacts utiles"),
    Bullet("Numéro Eventy 24/7 : [À compléter]."),
    Bullet("Email général : contact@eventylife.fr."),
    Bullet("Pack Sérénité : voir voucher reçu."),
    Bullet("Accompagnateur Eventy : numéro envoyé J-7."),
    Bullet("En cas d'urgence vitale (à l'étranger) : 112 (UE), équivalent local sinon."),

    H1("10. Petit mot d'Eventy"),
    P("Voyager, c'est rencontrer le monde et les autres. Eventy s'occupe de tout pour que tu puisses te concentrer sur l'essentiel : vivre. Si quelque chose ne va pas, dis-le-nous. Si quelque chose t'a touché, partage-le. Si tu as une idée, on la lit. Tu n'es pas un client de plus dans une base — tu es de la famille Eventy.", { italics: true }),

    Spacer(160),
    P("Document voyageur — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Onboarding voyageur, Pack Sérénité, Manuel d'incident voyage, Glossaire voyage, Programme de fidélisation Eventy Famille, Politique image et droit à l'image, Charte engagement carbone, Politique accessibilité PMR, Document administratif voyageur, Fiche santé voyageur international.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Inclusion-Diversite.docx",
      title: "Eventy Life — Charte d'inclusion et diversité",
      description: "Engagements pour une équipe et une communauté ouvertes.",
      footer: "EVENTY LIFE SAS — Charte inclusion et diversité",
      children: charteInclusionDiversite(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Voyageurs-Mysteres.docx",
      title: "Eventy Life — Plan d'audit voyageurs-mystères",
      description: "Méthodologie d'évaluation qualité par observateurs intégrés.",
      footer: "EVENTY LIFE SAS — Plan voyageurs-mystères",
      children: planVoyageursMysteres(),
    },
    {
      file: "docs/garanties/Eventy-Life-Manuel-Voyageur-Autonome.docx",
      title: "Eventy Life — Manuel voyageur autonome",
      description: "Handbook pratique du voyageur en cours de voyage.",
      footer: "EVENTY LIFE SAS — Manuel voyageur autonome",
      children: manuelVoyageurAutonome(),
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
