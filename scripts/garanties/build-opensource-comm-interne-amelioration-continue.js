/**
 * Eventy Life — Trois documents culture & innovation
 *
 *   1. Politique open source et propriété intellectuelle
 *   2. Plan de communication interne
 *   3. Procédure d'amélioration continue
 *
 * Usage : node scripts/garanties/build-opensource-comm-interne-amelioration-continue.js
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
// DOCUMENT 1 — POLITIQUE OPEN SOURCE ET PROPRIÉTÉ INTELLECTUELLE
// ============================================================
function politiqueOpenSourcePI() {
  return [
    bandeauTitre(
      "POLITIQUE OPEN SOURCE ET PROPRIÉTÉ INTELLECTUELLE",
      "Engagement open source, gestion de la PI Eventy Life",
    ),
    Spacer(160),

    P("La présente politique formalise la position d'EVENTY LIFE SAS sur l'open source et la gestion de sa propriété intellectuelle. Elle complète la Roadmap technique (volet stratégie tech), la Politique cybersécurité et la Politique d'achats responsables. Elle est cohérente avec les valeurs Eventy de souveraineté numérique et de transparence.", { italics: true }),

    P("Eventy se construit sur des briques open source et entend rendre cet engagement réciproque : contribuer à l'écosystème, ouvrir progressivement les modules non stratégiques, refuser le brevetage défensif. Notre PI est un outil au service du voyageur, pas un fossé compétitif.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Code de la propriété intellectuelle (livres I et II)."),
    Bullet("Licences open source standard (MIT, Apache 2.0, GPL, AGPL, etc.)."),
    Bullet("Open Source Initiative (OSI)."),
    Bullet("Définition open source FSF (Free Software Foundation)."),
    Bullet("Roadmap technique Eventy (cohérence)."),

    H1("2. Position Eventy sur l'open source"),

    H2("2.1. Cinq principes"),
    Bullet("Reconnaissance — l'écosystème open source est un bien commun mondial."),
    Bullet("Réciprocité — recevoir et donner."),
    Bullet("Transparence — refuser de cacher le code derrière du closed-source quand inutile."),
    Bullet("Souveraineté — privilégier les outils open source européens."),
    Bullet("Refus du double standard — ne pas exiger des autres ce qu'on ne fait pas."),

    H2("2.2. Stack open source utilisé"),
    Bullet("Frontend : Next.js (MIT), React (MIT), TypeScript (Apache 2.0)."),
    Bullet("Backend : NestJS (MIT), TypeScript, Prisma (Apache 2.0)."),
    Bullet("Base de données : PostgreSQL (PostgreSQL License)."),
    Bullet("Outils dev : ESLint, Prettier, Jest, Vitest (tous MIT)."),
    Bullet("Infrastructure : Docker, Kubernetes (utilisé via Scaleway)."),

    H1("3. Contributions Eventy à l'open source"),

    H2("3.1. Engagement An 1 (modeste)"),
    Bullet("Rétro-PRs sur les outils open source utilisés (corrections bug, améliorations)."),
    Bullet("Sponsoring de mainteneurs sur GitHub Sponsors (≥ 50 €/mois An 1)."),
    Bullet("Signalement responsable de vulnérabilités."),
    Bullet("Réponses aux issues sur les projets utilisés."),

    H2("3.2. Engagement An 2-3 (croissant)"),
    Bullet("Open source progressif des modules non stratégiques (utilitaires, librairies internes)."),
    Bullet("Sponsoring augmenté (≥ 200 €/mois An 3)."),
    Bullet("Participation à des événements open source (FOSDEM, etc.)."),
    Bullet("Mentorat de contributeurs juniors."),

    H2("3.3. Engagement An 5+ (mature)"),
    Bullet("Possibilité d'ouvrir des modules métier (calculateur carbone tourisme, par exemple)."),
    Bullet("Maintenance active de projets open source."),
    Bullet("Conférences et publications techniques."),
    Bullet("Possibilité de fonder ou participer à un consortium tourisme open source."),

    H2("3.4. Refus de l'open-washing"),
    Bullet("Refus de l'« open core » trompeur (annoncer open source mais bloquer fonctionnalités essentielles)."),
    Bullet("Refus de license restrictives masquées (ex : SSPL non OSI-approved)."),
    Bullet("Engagement à respecter strictement OSI quand on annonce de l'open source."),

    H1("4. Périmètre stratégique vs ouverture"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Composant", "Statut prévu", "Justification"],
      rows: [
        ["Architecture globale plateforme", "Closed-source An 1-3", "Avantage concurrentiel"],
        ["Algorithmes recommandation voyage", "Closed-source", "Différenciation produit"],
        ["Calculateur carbone tourisme", "Open source An 3", "Bien commun sectoriel"],
        ["Librairies utilitaires internes", "Open source progressif An 2", "Pas stratégique"],
        ["Outil suivi qualité HRA", "Closed-source", "Spécifique à Eventy"],
        ["Composants UI génériques", "Open source possible An 3", "Réutilisable"],
        ["Documentation publique", "CC BY-SA 4.0", "Transparence"],
      ],
    }),

    H1("5. Gestion de la propriété intellectuelle"),

    H2("5.1. Marques et identité"),
    Bullet("Dépôt INPI de la marque « Eventy Life » (cohérence Statuts SAS)."),
    Bullet("Dépôt logo et identité visuelle."),
    Bullet("Veille concurrentielle et défense en cas de violation."),
    Bullet("Pas de marque agressive (refus de l'opposition systématique)."),

    H2("5.2. Brevets"),
    Bullet("Refus du brevetage défensif (refus des patent trolls)."),
    Bullet("Brevet uniquement si invention technique majeure et essentielle (cas exceptionnel)."),
    Bullet("Engagement à licencier sous conditions raisonnables (FRAND)."),
    Bullet("Refus du brevetage de méthodes commerciales triviales."),

    H2("5.3. Droits d'auteur"),
    Bullet("Code source : © Eventy Life SAS, par défaut closed-source."),
    Bullet("Documents publics (CGV, mentions légales) : © Eventy Life, libre consultation."),
    Bullet("Documents publiés sous licence ouverte : CC BY-SA 4.0."),
    Bullet("Photos voyageurs : cohérence Politique image et droit à l'image."),

    H2("5.4. Secrets d'affaires"),
    Bullet("Algorithmes propriétaires."),
    Bullet("Données voyageurs et partenaires (cohérence RGPD)."),
    Bullet("Stratégie commerciale détaillée."),
    Bullet("Conditions tarifaires HRA négociées."),
    Bullet("Cohérence avec NDA (Non Disclosure Agreement) systématique."),

    H1("6. Licences open source utilisées par Eventy"),
    makeTable({
      widths: [2496, 4368, 2496],
      header: ["Licence", "Utilisation Eventy", "Contraintes"],
      rows: [
        ["MIT", "Préférée pour les composants utilitaires Eventy à ouvrir", "Aucune significative"],
        ["Apache 2.0", "Acceptable pour composants intégrant brevets", "Mention attribution"],
        ["GPL v3 / AGPL", "Évitée si intégration commerciale (effet copyleft)", "Forte"],
        ["BSD 3-clause", "Acceptable", "Aucune significative"],
        ["MPL 2.0", "Possible", "Faible copyleft"],
        ["CC BY-SA 4.0", "Documentation publique Eventy", "Partage des dérivés"],
      ],
    }),

    H1("7. Compliance open source"),
    Bullet("SBOM (Software Bill of Materials) maintenu à jour pour le stack utilisé."),
    Bullet("Audit annuel des licences (cohérence Plan d'audit interne)."),
    Bullet("Vérification compatibilité licences avant intégration."),
    Bullet("Respect strict des obligations d'attribution."),
    Bullet("Outil de scan automatisé (FOSSA, Snyk License Compliance)."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Sponsoring open source mensuel (€)", "≥ 50", "≥ 200"],
        ["Rétro-PRs / an", "≥ 5", "≥ 30"],
        ["Modules ouverts", "0", "≥ 2"],
        ["Vulnérabilités open source signalées", "Selon contexte", "Selon contexte"],
        ["Conformité licences SBOM", "100 %", "100 %"],
        ["Audits open source annuels", "1", "1"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Refus de l'open-washing."),
    Bullet("Refus du brevetage défensif."),
    Bullet("Refus du fork hostile de projets open source."),
    Bullet("Reconnaissance et crédit systématique aux contributeurs."),
    Bullet("Engagement à signaler les vulnérabilités de manière responsable."),
    Bullet("Refus de monétiser des contributions communautaires sans accord."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Roadmap technique, Politique cybersécurité, Politique d'achats responsables, Politique de gestion documentaire, Charte engagement carbone, Plan d'audit interne, Statuts SAS.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN DE COMMUNICATION INTERNE
// ============================================================
function planCommunicationInterne() {
  return [
    bandeauTitre(
      "PLAN DE COMMUNICATION INTERNE EVENTY",
      "Référentiel des échanges équipe, partenaires et voyageurs",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie de communication interne d'EVENTY LIFE SAS. Il couvre les échanges entre l'équipe, avec les partenaires (créateurs, vendeurs, ambassadeurs, HRA) et avec la communauté voyageurs. Il complète la Charte télétravail, le Manuel des opérations quotidiennes et la Stratégie réseaux sociaux (qui couvrent des aspects spécifiques).", { italics: true }),

    P("Eventy croit en une communication transparente, fréquente et bidirectionnelle. Une équipe et un écosystème bien informés performent mieux et restent mobilisés. Notre approche : sobriété (pas de bruit inutile), régularité (rituels), bidirectionnalité (chacun peut s'exprimer).", { italics: true }),

    H1("1. Principes directeurs"),

    H2("1.1. Cinq principes"),
    Bullet("Transparence — partager autant que possible (sauf info confidentielle nécessaire)."),
    Bullet("Régularité — rituels prévisibles plutôt que communications anarchiques."),
    Bullet("Bidirectionnalité — chacun peut s'exprimer et être entendu."),
    Bullet("Sobriété — refus de la sur-communication anxiogène."),
    Bullet("Bienveillance — refus du dénigrement et du bashing."),

    H2("1.2. Refus structurés"),
    Bullet("Refus du flicage permanent (pas de notifications anxiogènes)."),
    Bullet("Refus des chaînes mail interminables (préférer les outils dédiés)."),
    Bullet("Refus de la communication descendante uniquement."),
    Bullet("Refus des réunions sans ordre du jour."),
    Bullet("Refus de la dictature de l'urgence (sauf vraies urgences)."),

    H1("2. Communication équipe interne"),

    H2("2.1. Rituels hebdomadaires (cohérence Charte télétravail)"),
    Bullet("Standup matinal lundi 9h30 (15 min) — focus de la semaine."),
    Bullet("Mardi de l'équipe (toute la journée en présentiel) — sujets transverses."),
    Bullet("Démo produit vendredi 16h (30 min) — ce qui a été livré."),
    Bullet("Café du jeudi 14h (45 min) — sujets libres, lectures partagées."),

    H2("2.2. Rituels mensuels"),
    Bullet("All-hands mensuel (60 min) — chiffres, priorités, retours voyageurs marquants."),
    Bullet("Revue stratégique mensuelle (90 min) — restreint aux managers."),
    Bullet("Newsletter interne mensuelle — résumé écrit pour ceux qui auraient manqué."),

    H2("2.3. Rituels trimestriels"),
    Bullet("Séminaire trimestriel (1-2 j hors locaux) — alignement stratégique."),
    Bullet("Bilan trimestriel formalisé — équipe et investisseurs."),
    Bullet("Sondage interne anonyme (20 questions, 10 min) — climat, propositions."),

    H2("2.4. Rituels annuels"),
    Bullet("Entretien annuel par collaborateur (cohérence Modèle d'entretien annuel)."),
    Bullet("Bilan annuel équipe (cohérence Rapport de gestion annuel)."),
    Bullet("Anniversaire Eventy (juin, événement signature, cohérence Plan d'événements)."),

    H2("2.5. Outils internes"),
    Bullet("Slack / équivalent (souverain) — communication asynchrone quotidienne."),
    Bullet("Google Workspace (email, agenda, documents partagés)."),
    Bullet("Notion ou Confluence — documentation et procédures."),
    Bullet("Visioconférence (Google Meet, Zoom) — réunions à distance."),
    Bullet("Refus du multi-outils anxiogène — sobriété, pas plus de 5 outils principaux."),

    H1("3. Communication avec les partenaires"),

    H2("3.1. Créateurs"),
    Bullet("Webinaire trimestriel (90 min) — performance + nouveautés."),
    Bullet("Newsletter mensuelle dédiée."),
    Bullet("Forum interne (lecture, échanges)."),
    Bullet("Réunion annuelle créateurs (visio ou présentiel)."),
    Bullet("Email dédié : createur@eventylife.fr (cohérence Guide portail créateur)."),

    H2("3.2. Vendeurs"),
    Bullet("Webinaire trimestriel (60 min) — performance + nouveautés voyages."),
    Bullet("Newsletter mensuelle vendeurs."),
    Bullet("Forum interne (entraide)."),
    Bullet("Email dédié : vendeur@eventylife.fr (cohérence Guide portail vendeur)."),

    H2("3.3. HRA partenaires"),
    Bullet("Réunion annuelle HRA (présentiel ou visio)."),
    Bullet("Newsletter trimestrielle (5-10 min de lecture)."),
    Bullet("Forum HRA partenaires."),
    Bullet("Email dédié : maisons@eventylife.fr (cohérence Guide portail HRA)."),

    H2("3.4. Ambassadeurs"),
    Bullet("Webinaire trimestriel (60 min) — nouveautés et bonnes pratiques."),
    Bullet("Newsletter trimestrielle dédiée."),
    Bullet("Email dédié : ambassadeur@eventylife.fr (cohérence Guide portail ambassadeur)."),

    H1("4. Communication avec les voyageurs"),

    H2("4.1. Communication transactionnelle"),
    Bullet("Confirmation réservation, documents J-30 / J-7, retour J+2 (cohérence Onboarding voyageur)."),
    Bullet("Cohérence avec CGV et Information précontractuelle."),

    H2("4.2. Communication communautaire"),
    Bullet("Newsletter mensuelle « Le Mensuel Eventy » (cohérence Ligne éditoriale blog)."),
    Bullet("Groupe Facebook privé Eventy Famille (cohérence Programme de fidélisation)."),
    Bullet("Apéros trimestriels Paris + province (cohérence Plan d'événements)."),
    Bullet("Anniversaire Eventy annuel (cohérence Plan d'événements)."),

    H2("4.3. Communication marketing"),
    Bullet("Réseaux sociaux (cohérence Stratégie réseaux sociaux)."),
    Bullet("Blog (cohérence Ligne éditoriale blog)."),
    Bullet("Refus du sur-marketing (max 2 emails marketing/mois)."),
    Bullet("Désinscription en un clic (RGPD)."),

    H1("5. Communication de crise"),
    Bullet("Cohérence avec Procédure de gestion de crise communication."),
    Bullet("Cellule de crise activée selon niveau."),
    Bullet("Communication coordonnée et factuelle."),
    Bullet("Cohérence Manuel d'incident voyage si crise opérationnelle."),

    H1("6. Communication ascendante (équipe → direction)"),

    H2("6.1. Boîtes mail dédiées"),
    Bullet("alerte@eventylife.fr — signalement (cohérence Procédure de signalement)."),
    Bullet("conformite@eventylife.fr — conflits d'intérêts (cohérence document dédié)."),
    Bullet("idees@eventylife.fr — propositions d'amélioration."),

    H2("6.2. Sondages anonymes"),
    Bullet("Trimestriel — climat équipe."),
    Bullet("Annuel — engagement, satisfaction."),
    Bullet("Restitution publique partielle (sans dévoiler identités)."),

    H2("6.3. Réunions ouvertes"),
    Bullet("All-hands avec questions ouvertes."),
    Bullet("Café du jeudi (sujets libres)."),
    Bullet("Entretien annuel (espace de parole formalisé)."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Taux participation all-hands", "≥ 90 %", "≥ 95 %"],
        ["Taux participation séminaires", "100 %", "100 %"],
        ["Taux participation sondage interne", "≥ 80 %", "≥ 90 %"],
        ["NPS interne (eNPS)", "≥ + 30", "≥ + 50"],
        ["Délai réponse email équipe", "≤ 48 h", "≤ 24 h"],
        ["Newsletter interne mensuelle", "12/an", "12/an"],
      ],
    }),

    H1("8. Engagements éthiques"),
    Bullet("Refus du tutoiement imposé ou interdit (libre choix)."),
    Bullet("Refus du jargon corporate (cohérence Charte éditoriale)."),
    Bullet("Refus de la communication condescendante."),
    Bullet("Refus du silence radio (information régulière même en période calme)."),
    Bullet("Refus de la rétention d'information sans raison légitime."),
    Bullet("Engagement à reconnaître les contributions de chacun."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte télétravail, Manuel des opérations quotidiennes, Charte éditoriale, Stratégie réseaux sociaux, Programme de fidélisation Eventy Famille, Plan d'événements, Procédure de gestion de crise communication, Procédure de signalement, Politique conflits d'intérêts.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PROCÉDURE D'AMÉLIORATION CONTINUE
// ============================================================
function procedureAmeliorationContinue() {
  return [
    bandeauTitre(
      "PROCÉDURE D'AMÉLIORATION CONTINUE EVENTY",
      "Méthodologie de retour d'expérience et culture d'apprentissage",
    ),
    Spacer(160),

    P("La présente procédure formalise la démarche d'amélioration continue d'EVENTY LIFE SAS. Inspirée des méthodologies Kaizen et lean (sans en reprendre le jargon corporate), elle pose un cadre simple pour apprendre, ajuster et progresser collectivement. Elle complète le Manuel d'incident voyage, la Procédure de réclamation détaillée, le Plan d'audit interne et la Procédure de signalement.", { italics: true }),

    P("Eventy refuse la culture du « zéro défaut » qui finit par étouffer toute prise de risque. Notre approche : tolérance pour l'erreur honnête, refus de l'erreur cachée, recherche systématique de la cause racine, partage des apprentissages. Une équipe qui apprend de ses échecs progresse plus vite qu'une équipe qui les masque.", { italics: true }),

    H1("1. Principes directeurs"),

    H2("1.1. Cinq principes"),
    Bullet("Bienveillance — chercher la cause, pas le coupable."),
    Bullet("Transparence — l'erreur cachée est plus dangereuse que l'erreur signalée."),
    Bullet("Apprentissage collectif — partager les retours d'expérience."),
    Bullet("Pas de double peine — refus du blame sur erreur honnête signalée."),
    Bullet("Petits pas — préférer 100 améliorations modestes à 1 transformation majeure."),

    H2("1.2. Refus structurés"),
    Bullet("Refus de la culture du blame."),
    Bullet("Refus du « zéro défaut » paralysant."),
    Bullet("Refus du dogmatisme méthodologique (lean, kaizen ne sont pas des religions)."),
    Bullet("Refus des audits punitifs."),
    Bullet("Refus de l'amélioration imposée (l'équipe co-construit)."),

    H1("2. Sources d'amélioration"),

    H2("2.1. Sources internes"),
    Bullet("Suggestions équipe (idees@eventylife.fr — cohérence Plan de communication interne)."),
    Bullet("Retours après chaque voyage (NPS, verbatim, débrief accompagnateur)."),
    Bullet("Audits internes (cohérence Plan d'audit interne)."),
    Bullet("Indicateurs (Tableau de bord opérationnel)."),
    Bullet("Bilans trimestriels et annuels."),

    H2("2.2. Sources externes"),
    Bullet("Réclamations voyageurs (cohérence Procédure de réclamation détaillée)."),
    Bullet("Avis publics (cohérence Politique avis voyageurs)."),
    Bullet("Retours partenaires HRA, créateurs, vendeurs."),
    Bullet("Veille concurrentielle (cohérence Plan d'études et veille marché)."),
    Bullet("Audits externes (CAC, PASSI, DPO, ISO)."),

    H2("2.3. Sources d'incidents"),
    Bullet("Incidents voyage (cohérence Manuel d'incident voyage)."),
    Bullet("Incidents cybersécurité (cohérence Politique cybersécurité)."),
    Bullet("Crises (cohérence Procédure de gestion de crise communication)."),
    Bullet("Signalements lanceurs d'alerte (cohérence Procédure de signalement)."),

    H1("3. Cycle d'amélioration continue (PDCA adapté)"),

    H2("3.1. Plan — identifier"),
    Bullet("Recueil des idées et signaux."),
    Bullet("Priorisation par impact / faisabilité."),
    Bullet("Cadrage de l'amélioration (objectif, périmètre, échéance)."),

    H2("3.2. Do — expérimenter"),
    Bullet("Mise en œuvre du changement (souvent à petite échelle d'abord)."),
    Bullet("Observation et collecte de données."),
    Bullet("Préférence pour les expérimentations courtes (≤ 30 j)."),

    H2("3.3. Check — mesurer"),
    Bullet("Évaluation des résultats (qualitatif + quantitatif)."),
    Bullet("Comparaison avec l'objectif initial."),
    Bullet("Identification des effets de bord."),

    H2("3.4. Act — agir"),
    Bullet("Si succès : généralisation et capitalisation."),
    Bullet("Si échec : compréhension de la cause + retour d'expérience."),
    Bullet("Documentation du changement (cohérence Politique de gestion documentaire)."),

    H1("4. Méthodes pratiques"),

    H2("4.1. Post-mortem (après incident)"),
    Bullet("Réunion 60-90 min sous 7 jours après l'incident."),
    Bullet("Format : qu'est-ce qui s'est passé ? pourquoi ? qu'apprend-on ? que change-t-on ?"),
    Bullet("Refus du blame, recherche de la cause racine."),
    Bullet("Compte-rendu écrit partagé à l'équipe."),
    Bullet("Plan d'actions concrètes."),

    H2("4.2. REX (retour d'expérience) après projet"),
    Bullet("Réunion 60 min en fin de projet majeur."),
    Bullet("Format : 3 succès, 3 axes d'amélioration, 3 enseignements clés."),
    Bullet("Compte-rendu écrit partagé."),

    H2("4.3. Idées d'amélioration"),
    Bullet("Boîte mail idees@eventylife.fr."),
    Bullet("Examen mensuel des idées par le Président."),
    Bullet("Réponse personnalisée à chaque idée (acceptée, en étude, refusée)."),
    Bullet("Reconnaissance publique des idées implementées (avec accord)."),

    H2("4.4. Sondages voyageurs"),
    Bullet("NPS post-voyage systématique."),
    Bullet("Sondage trimestriel Famille (cohérence Programme de fidélisation)."),
    Bullet("Étude annuelle approfondie (cohérence Plan d'études et veille marché)."),

    H1("5. Catégories d'améliorations"),

    H2("5.1. Améliorations opérationnelles"),
    Bullet("Procédures (Manuel des opérations, audit qualité HRA, etc.)."),
    Bullet("Outils internes."),
    Bullet("Formation équipe."),

    H2("5.2. Améliorations produit"),
    Bullet("Plateforme web (cohérence Roadmap technique)."),
    Bullet("Catalogue voyages."),
    Bullet("Pack Sérénité."),
    Bullet("Programme Eventy Famille."),

    H2("5.3. Améliorations relationnelles"),
    Bullet("Communication équipe (cohérence Plan de communication interne)."),
    Bullet("Communication voyageurs."),
    Bullet("Relations partenaires."),

    H2("5.4. Améliorations stratégiques"),
    Bullet("Validation et intégration au Plan stratégique 5 ans (cohérence)."),
    Bullet("Soumission aux associés si engagement majeur."),

    H1("6. Documentation des améliorations"),

    H2("6.1. Registre des améliorations"),
    Bullet("Toutes les améliorations majeures documentées dans un registre central."),
    Bullet("Format : date, source (incident/idée/audit), action, responsable, échéance, statut."),
    Bullet("Cohérence avec Politique de gestion documentaire."),

    H2("6.2. Mise à jour des procédures"),
    Bullet("Toute amélioration impactant une procédure entraîne sa mise à jour."),
    Bullet("Versioning systématique."),
    Bullet("Communication équipe et partenaires concernés."),

    H1("7. Reconnaissance et culture"),
    Bullet("Reconnaissance publique des contributions à l'amélioration (avec accord)."),
    Bullet("Mention dans la newsletter interne mensuelle."),
    Bullet("Pas de prime financière directe (refus de l'incentive court-termiste)."),
    Bullet("Reconnaissance dans l'entretien annuel (cohérence Modèle d'entretien annuel)."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Idées équipe collectées / an", "≥ 30", "≥ 100"],
        ["Idées implementées / an", "≥ 10", "≥ 40"],
        ["Post-mortems documentés (incidents)", "100 %", "100 %"],
        ["Délai post-mortem", "≤ 7 j", "≤ 5 j"],
        ["Mise à jour procédures / an", "≥ 5", "≥ 20"],
        ["NPS interne progression annuelle", "Suivi", "+ 5 points/an"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Refus de la culture du blame."),
    Bullet("Refus du double standard (pas exiger de l'équipe ce que la direction ne fait pas)."),
    Bullet("Confidentialité des sources d'idées et de signalements."),
    Bullet("Reconnaissance des erreurs au plus haut niveau (Président)."),
    Bullet("Engagement à publier publiquement les enseignements majeurs (transparence)."),
    Bullet("Refus des audits punitifs."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Manuel d'incident voyage, Procédure de réclamation détaillée, Plan d'audit interne, Procédure de signalement, Plan de communication interne, Politique avis voyageurs, Politique de gestion documentaire, Modèle d'entretien annuel, Tableau de bord opérationnel, Plan stratégique 5 ans.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Open-Source-PI.docx",
      title: "Eventy Life — Politique open source et propriété intellectuelle",
      description: "Engagement open source et gestion de la PI Eventy Life.",
      footer: "EVENTY LIFE SAS — Politique open source et PI",
      children: politiqueOpenSourcePI(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Communication-Interne.docx",
      title: "Eventy Life — Plan de communication interne",
      description: "Référentiel des échanges équipe, partenaires et voyageurs.",
      footer: "EVENTY LIFE SAS — Plan de communication interne",
      children: planCommunicationInterne(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Amelioration-Continue.docx",
      title: "Eventy Life — Procédure d'amélioration continue",
      description: "Méthodologie de retour d'expérience et culture d'apprentissage.",
      footer: "EVENTY LIFE SAS — Procédure d'amélioration continue",
      children: procedureAmeliorationContinue(),
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
