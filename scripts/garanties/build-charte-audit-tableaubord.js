/**
 * Eventy Life — Trois documents complémentaires
 *
 *   1. Charte fournisseurs / code de conduite partenaires HRA
 *   2. Procédure d'audit qualité HRA détaillée (initial + récurrent)
 *   3. Tableau de bord opérationnel KPIs (hebdomadaire + mensuel)
 *
 * Usage : node scripts/garanties/build-charte-audit-tableaubord.js
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
// DOCUMENT 1 — CHARTE FOURNISSEURS / CODE DE CONDUITE PARTENAIRES
// ============================================================
function charteFournisseurs() {
  return [
    bandeauTitre(
      "CHARTE FOURNISSEURS EVENTY LIFE",
      "Code de conduite des partenaires HRA, transporteurs et prestataires terrain",
    ),
    Spacer(160),

    P("La présente charte fournisseurs formalise les engagements éthiques, environnementaux, sociaux et opérationnels que tout partenaire HRA, transporteur ou prestataire terrain s'engage à respecter dans le cadre de sa relation avec EVENTY LIFE SAS. Elle complète le Contrat-cadre HRA Partenaire (Article 4 — Standards de qualité) et la Politique RSE Eventy.", { italics: true }),

    P("La signature de la présente charte est une condition préalable au référencement dans le catalogue Eventy. Tout manquement avéré peut entraîner, après mise en demeure restée sans effet sous 15 jours, le déréférencement définitif du partenaire.", { italics: true }),

    H1("1. Engagement éthique"),

    H2("1.1. Probité et intégrité"),
    Bullet("Refus de toute pratique de corruption, de concussion ou de trafic d'influence (loi Sapin 2 et au-delà)."),
    Bullet("Aucun cadeau ni avantage sollicité ou accepté en contrepartie d'un référencement préférentiel."),
    Bullet("Refus de toute pratique commerciale trompeuse (descriptions fausses, photos non conformes, prix factices)."),
    Bullet("Tarification loyale — pas de surfacturation, pas de double facturation."),

    H2("1.2. Respect des lois locales"),
    Bullet("Conformité avec les lois et règlements applicables localement (hygiène, sécurité, fiscalité, droit du travail)."),
    Bullet("Détention des autorisations, agréments et certifications requis (HACCP restauration, classement étoiles hôtellerie, agréments activités)."),
    Bullet("Déclaration et paiement effectifs des cotisations sociales et fiscales."),
    Bullet("Respect du droit du travail (rémunération, durée, congés, sécurité)."),

    H2("1.3. Conformité réglementaire tourisme"),
    Bullet("Reconnaissance d'EVENTY LIFE SAS comme l'opérateur de voyages exclusif au sens du Code du Tourisme — refus catégorique de toute qualité d'opérateur ou d'intermédiaire au sens de l'article L211-1."),
    Bullet("Strict respect des informations communiquées au voyageur par EVENTY (programme, prix, prestations) — toute substitution requiert l'accord écrit préalable d'EVENTY."),
    Bullet("Coopération en cas d'audit de l'APST, d'Atout France ou de la DGCCRF."),

    H1("2. Engagement social"),

    H2("2.1. Respect des droits humains"),
    Bullet("Refus catégorique du travail des enfants et du travail forcé."),
    Bullet("Respect strict de la liberté d'association et du droit syndical."),
    Bullet("Politique anti-discrimination (origine, religion, orientation sexuelle, handicap, situation familiale, opinion politique)."),
    Bullet("Refus du harcèlement sous toutes ses formes (moral, sexuel)."),

    H2("2.2. Conditions de travail"),
    Bullet("Rémunération conforme aux minima légaux locaux et aux conventions collectives applicables."),
    Bullet("Durée du travail conforme aux dispositions légales et conventionnelles."),
    Bullet("Sécurité physique et psychologique des travailleurs (équipements, formation, prévention)."),
    Bullet("Couverture sociale (sécurité sociale, retraite, chômage le cas échéant)."),

    H2("2.3. Diversité et inclusion"),
    Bullet("Recrutement et promotion sans discrimination."),
    Bullet("Accessibilité des établissements aux personnes à mobilité réduite (déclaration honnête de l'accessibilité réelle)."),
    Bullet("Formation continue des équipes."),

    H1("3. Engagement environnemental"),

    H2("3.1. Hygiène et qualité"),
    Bullet("Conformité HACCP pour la restauration (traçabilité, températures, hygiène, allergènes)."),
    Bullet("Classement officiel à jour pour l'hôtellerie (étoiles, normes locales)."),
    Bullet("Maintenance régulière des équipements (chaudières, climatisation, ascenseurs, ventilation)."),
    Bullet("Gestion responsable des déchets (tri sélectif, recyclage, compostage si possible)."),

    H2("3.2. Sourcing responsable (recommandations)"),
    Bullet("Privilège donné aux produits frais et locaux (restauration)."),
    Bullet("Privilège donné aux producteurs régionaux et aux circuits courts."),
    Bullet("Limitation du gaspillage alimentaire — adaptation des quantités au nombre exact de voyageurs."),
    Bullet("Limitation des emballages individuels superflus."),
    Bullet("Refus des produits à empreinte carbone manifestement excessive (espèces protégées, produits hors saison transportés par avion)."),

    H2("3.3. Énergie et eau"),
    Bullet("Pratiques d'économie d'énergie raisonnables (éclairage, chauffage, climatisation)."),
    Bullet("Utilisation préférentielle d'énergies renouvelables si disponibles."),
    Bullet("Gestion responsable de la consommation d'eau (équipements à débit limité, limitation du gaspillage)."),

    H1("4. Engagement opérationnel"),

    H2("4.1. Capacité d'accueil"),
    Bullet("Capacité minimum d'accueil simultané : 38 voyageurs sur la prestation concernée (sauf accord spécifique pour prestations partielles)."),
    Bullet("Disponibilité confirmée pour chaque bon de commande dans le délai contractuel (48 heures)."),
    Bullet("Maintien de la capacité d'accueil tout au long de la durée du contrat-cadre."),

    H2("4.2. Qualité de service"),
    Bullet("Respect strict du programme communiqué au voyageur (timing repas, gestion arrivées/départs, qualité prestations)."),
    Bullet("Communication sans délai de tout incident affectant l'exécution de la prestation."),
    Bullet("Documentation complète des allergènes et restrictions alimentaires (restauration)."),
    Bullet("Accueil chaleureux et professionnel des voyageurs Eventy."),

    H2("4.3. Confidentialité"),
    Bullet("Respect strict de la confidentialité des données personnelles des voyageurs (RGPD, accord article 28)."),
    Bullet("Pas de divulgation à des tiers (concurrents Eventy, médias) des informations contractuelles."),
    Bullet("Conservation et destruction des listes voyageurs selon protocole Eventy."),

    H1("5. Modalités de mise en œuvre et contrôle"),

    H2("5.1. Audit qualité initial et récurrent"),
    Bullet("Audit qualité initial sur place avant le premier référencement (voir Procédure d'audit qualité HRA détaillée)."),
    Bullet("Audit récurrent annuel — sur place ou documentaire selon volume d'activité."),
    Bullet("Audits inopinés possibles à tout moment (voyageurs-mystères, visites Responsable opérations Eventy)."),

    H2("5.2. Conséquences d'un manquement"),
    Bullet("Manquement mineur : avertissement écrit et plan de correction sous 30 jours."),
    Bullet("Manquement avéré : mise en demeure de se conformer sous 15 jours, sous peine de déréférencement temporaire."),
    Bullet("Manquement grave : déréférencement définitif et action en dommages-intérêts si préjudice voyageur."),
    Bullet("Manquement éthique caractérisé (corruption, travail des enfants, discrimination) : déréférencement immédiat sans préavis."),

    H2("5.3. Engagement de progrès"),
    Bullet("Le Partenaire HRA s'engage à progresser annuellement sur les indicateurs RSE de la présente charte."),
    Bullet("Bilan annuel partagé entre Eventy et le Partenaire — identification des axes de progrès."),
    Bullet("Partage de bonnes pratiques entre partenaires (groupe de travail Eventy annuel)."),

    H1("6. Acceptation"),
    P("Je soussigné(e), [Nom Prénom + qualité du représentant légal du Partenaire HRA], reconnais avoir pris connaissance de la présente Charte fournisseurs Eventy Life. J'en accepte sans réserve l'ensemble des stipulations et m'engage, au nom de [Raison sociale du Partenaire], à les appliquer scrupuleusement dans le cadre de notre relation contractuelle avec Eventy Life SAS.", { italics: true }),

    Spacer(160),
    P("Fait à [Ville], le [Date], en deux exemplaires originaux.", { italics: true, after: 200 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [new TableRow({ children: [
        new TableCell({ borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA },
          margins: { top: 100, bottom: 200, left: 120, right: 120 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour EVENTY LIFE SAS", bold: true, size: 20, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "M. David Eventy, Président", size: 18, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature manuscrite + cachet)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
          ] }),
        new TableCell({ borders: cellBorders,
          width: { size: 4680, type: WidthType.DXA },
          margins: { top: 100, bottom: 200, left: 120, right: 120 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour le PARTENAIRE", bold: true, size: 20, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 360 }, children: [new TextRun({ text: "[Nom Prénom + qualité]", size: 18, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(signature + cachet + mention « Lu et approuvé »)", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
          ] }),
      ] })],
    }),

    Spacer(160),
    P("Document de référence : Contrat-cadre HRA Partenaire · Politique RSE Eventy · Procédure d'audit qualité HRA détaillée.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PROCÉDURE D'AUDIT QUALITÉ HRA DÉTAILLÉE
// ============================================================
function procedureAudit() {
  return [
    bandeauTitre(
      "PROCÉDURE D'AUDIT QUALITÉ HRA",
      "Audit initial avant référencement + audits récurrents annuels",
    ),
    Spacer(160),

    P("La présente procédure formalise le processus d'audit qualité des partenaires HRA d'Eventy Life. Elle distingue l'audit initial préalable au référencement et l'audit récurrent annuel. Elle est appliquée par le Responsable opérations Eventy ou par un auditeur tiers mandaté.", { italics: true }),

    P("L'objectif est de garantir le respect permanent des standards Eventy par les partenaires hôteliers, restaurateurs et activités, dans l'intérêt des voyageurs et de la marque.", { italics: true }),

    H1("1. Champ d'application"),
    Bullet("Hôteliers : audit complet (chambres, espaces communs, restauration éventuelle, sécurité)."),
    Bullet("Restaurateurs : audit centré hygiène, capacité, qualité culinaire."),
    Bullet("Activités touristiques : audit centré sécurité, conformité réglementaire, qualité du service."),
    Bullet("Tous les partenaires HRA référencés ou en cours de référencement."),

    H1("2. Audit initial — préalable au référencement"),

    H2("2.1. Phase 1 — Préparation (J-7)"),
    Bullet("Notification du Partenaire HRA d'une visite d'audit avec date proposée (préavis minimum 7 jours)."),
    Bullet("Transmission par le Partenaire HRA des pièces administratives (Kbis, URSSAF, RC Pro, HACCP, classement)."),
    Bullet("Vérification administrative préalable par Eventy (cohérence des pièces, vérification publique le cas échéant)."),
    Bullet("Préparation par l'auditeur de la grille d'audit type adaptée à la catégorie HRA."),

    H2("2.2. Phase 2 — Visite sur place (J0, durée 2 à 4 heures)"),
    Bullet("Accueil par le représentant légal ou directeur d'établissement."),
    Bullet("Présentation de l'auditeur et de l'objectif de l'audit."),
    Bullet("Visite guidée de l'établissement (chambres, espaces communs, cuisine, salle de restauration, etc.)."),
    Bullet("Vérification des pièces administratives (originales)."),
    Bullet("Vérification des conditions d'hygiène et de sécurité."),
    Bullet("Vérification de la capacité d'accueil simultanée pour 38 voyageurs."),
    Bullet("Échange avec le personnel sur les pratiques opérationnelles."),
    Bullet("Test pratique le cas échéant (dégustation pour restauration, vérification chambre type pour hôtellerie)."),
    Bullet("Photographies pour le dossier interne (avec accord du Partenaire)."),

    H2("2.3. Grille d'audit type — Hôtellerie"),
    makeTable({
      widths: [3500, 1500, 4360],
      header: ["Critère", "Note /5", "Observations attendues"],
      rows: [
        ["Conformité administrative (Kbis, URSSAF, RC Pro)", "—", "Pièces fournies et à jour"],
        ["Classement officiel (étoiles)", "—", "Conforme aux normes Atout France"],
        ["Sécurité incendie (commission)", "—", "PV de commission de sécurité valide"],
        ["État général de l'établissement", "5", "Propreté, entretien, fraîcheur"],
        ["Qualité des chambres (échantillon)", "5", "Literie, sanitaires, isolation phonique"],
        ["Espaces communs", "5", "Convivialité, propreté, esthétique"],
        ["Capacité d'accueil simultanée 38 voyageurs", "OK/NOK", "Vérifiée concrètement"],
        ["Accessibilité PMR", "—", "Déclaration honnête de l'accessibilité réelle"],
        ["Restauration (si applicable)", "5", "Voir grille restauration"],
        ["Personnel (formation, langues)", "5", "Niveau professionnel adapté"],
        ["Localisation et accès groupe", "5", "Stationnement autocar, proximité activités"],
        ["Tarification proposée", "—", "Cohérente avec le marché"],
      ],
    }),

    H2("2.4. Grille d'audit type — Restauration"),
    makeTable({
      widths: [3500, 1500, 4360],
      header: ["Critère", "Note /5", "Observations attendues"],
      rows: [
        ["Attestation HACCP à jour", "—", "Document fourni"],
        ["Hygiène cuisine", "5", "Propreté, traçabilité, températures"],
        ["Hygiène salle", "5", "Propreté, sanitaires"],
        ["Capacité simultanée 38 couverts", "OK/NOK", "Vérifiée concrètement"],
        ["Allergènes documentés", "—", "Fiche allergènes par plat"],
        ["Qualité culinaire (dégustation)", "5", "Saveur, présentation, fraîcheur"],
        ["Diversité menu groupe", "—", "Options carnée/végétarienne/sans gluten"],
        ["Service (timing, professionnalisme)", "5", "Capacité à gérer un groupe"],
        ["Sourcing local (recommandé)", "—", "Privilège produits frais et locaux"],
        ["Tarification groupe", "—", "Cohérente avec offres équivalentes"],
      ],
    }),

    H2("2.5. Grille d'audit type — Activités"),
    makeTable({
      widths: [3500, 1500, 4360],
      header: ["Critère", "Note /5", "Observations attendues"],
      rows: [
        ["Agrément spécifique (guide, sportif, etc.)", "—", "Document fourni"],
        ["Sécurité (équipements, formation, secours)", "5", "Conforme aux normes"],
        ["Capacité simultanée 38 personnes", "OK/NOK", "Vérifiée concrètement"],
        ["Qualité prestation (test si possible)", "5", "Professionnalisme, intérêt voyageur"],
        ["Personnel (langues, formation)", "5", "Niveau adapté"],
        ["Tarification groupe", "—", "Cohérente"],
        ["Accessibilité PMR", "—", "Déclaration honnête"],
      ],
    }),

    H2("2.6. Phase 3 — Synthèse et décision"),
    Bullet("Rédaction d'un rapport d'audit sous 7 jours après la visite."),
    Bullet("Note globale sur 5 (moyenne pondérée des critères)."),
    Bullet("Décision Eventy : référencement validé / référencement conditionné / refus de référencement."),
    Bullet("Référencement validé : signature contrat-cadre HRA + charte fournisseurs."),
    Bullet("Référencement conditionné : plan d'amélioration sous 30 jours puis nouvel audit."),
    Bullet("Refus : notification motivée au Partenaire."),

    H1("3. Audits récurrents annuels"),

    H2("3.1. Modalités"),
    Bullet("Audit récurrent annuel pour tous les Partenaires HRA actifs."),
    Bullet("Modalité : visite sur place pour les Partenaires majeurs (≥ 5 voyages/an), audit documentaire pour les autres."),
    Bullet("Préavis 7 jours pour les visites sur place."),
    Bullet("Coût supporté par Eventy (pas de facturation au Partenaire)."),

    H2("3.2. Critères d'évaluation continue"),
    Bullet("Maintien de la note ≥ 4/5 sur les critères audités initialement."),
    Bullet("Notes voyageurs sur les voyages de l'année écoulée (NPS partenaire HRA)."),
    Bullet("Nombre de réclamations voyageurs imputables au Partenaire."),
    Bullet("Respect des bons de commande (pénalités d'annulation, capacité confirmée)."),
    Bullet("Évolution des pièces administratives (à jour)."),
    Bullet("Engagement de progrès sur les indicateurs RSE."),

    H2("3.3. Audits inopinés"),
    Bullet("Voyageur-mystère : audit incognito sur un voyage Eventy en cours (1 à 2 fois par an pour les Partenaires majeurs)."),
    Bullet("Visite ponctuelle Responsable opérations Eventy : déclenchée en cas de signal faible (réclamation, retour accompagnateur)."),
    Bullet("Audit déclenché en cas de plainte voyageur grave (sous 7 jours)."),

    H1("4. Conséquences"),
    makeTable({
      widths: [3500, 5860],
      header: ["Note moyenne audit", "Décision Eventy"],
      rows: [
        ["≥ 4,5/5", "Partenaire premium · éligible à des voyages haut de gamme · mise en avant sur eventylife.fr"],
        ["≥ 4,0/5 et < 4,5/5", "Partenaire validé · maintien du référencement"],
        ["≥ 3,5/5 et < 4,0/5", "Partenaire sous surveillance · plan d'amélioration sous 30 jours"],
        ["≥ 3,0/5 et < 3,5/5", "Partenaire suspendu temporairement · audit complémentaire à 60 jours"],
        ["< 3,0/5", "Déréférencement définitif"],
        ["Manquement éthique caractérisé", "Déréférencement immédiat sans préavis"],
      ],
    }),

    H1("5. Documentation et archivage"),
    Bullet("Tous les rapports d'audit sont archivés dans la fiche partenaire de la plateforme Eventy."),
    Bullet("Conservation 10 ans (durée légale + bonne pratique)."),
    Bullet("Accès limité au Responsable opérations, au Président, et aux auditeurs autorisés."),
    Bullet("Le Partenaire reçoit copie de son propre rapport d'audit."),

    Spacer(160),
    P("Document opérationnel interne — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Contrat-cadre HRA Partenaire (Article 4) · Charte fournisseurs · Onboarding partenaires.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — TABLEAU DE BORD OPÉRATIONNEL KPIS
// ============================================================
function tableauBord() {
  return [
    bandeauTitre(
      "TABLEAU DE BORD OPÉRATIONNEL",
      "KPIs hebdomadaires + KPIs mensuels · outil de pilotage Eventy Life",
    ),
    Spacer(160),

    P("Le présent tableau de bord opérationnel formalise les indicateurs clés de pilotage de l'activité d'Eventy Life. Il distingue :", { italics: true }),
    Bullet("Les KPIs hebdomadaires — suivis le lundi matin par le Responsable opérations · revue avec le Président."),
    Bullet("Les KPIs mensuels — consolidés le 5 du mois suivant · revue Comité de pilotage opérationnel."),
    Bullet("Les KPIs trimestriels — déclaration formelle à l'APST + revue Comité conformité & risques."),
    Bullet("Les KPIs annuels — bilan annuel certifié + rapport d'activité."),

    P("Ce tableau de bord est un outil opérationnel concret, complémentaire à la Partie 11 du dossier APST (Indicateurs de pilotage et reporting).", { italics: true }),

    H1("1. KPIs hebdomadaires (revue lundi matin)"),

    H2("1.1. Activité commerciale"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible An 1 T4", "Seuil alerte", "Mesure"],
      rows: [
        ["Inscriptions de la semaine", "≥ 200", "< 100", "Plateforme Stripe"],
        ["Chiffre d'affaires de la semaine (€)", "≥ 160 K€", "< 100 K€", "Plateforme Stripe"],
        ["Voyages programmés / semaine", "≥ 10", "< 7", "Plateforme Eventy"],
        ["Taux remplissage moyen / voyage", "≥ 38/53", "< 30/53", "Plateforme Eventy"],
        ["Voyages annulés cette semaine (seuil non atteint)", "0", "≥ 2", "Plateforme Eventy"],
        ["Nouveaux vendeurs activés", "≥ 5", "0", "Plateforme Eventy"],
      ],
    }),

    H2("1.2. Opérationnel terrain"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible", "Seuil alerte", "Mesure"],
      rows: [
        ["Voyages en cours (semaine S)", "≥ 5", "—", "Plateforme Eventy"],
        ["Incidents niveau 1-2 cette semaine", "≤ 3", "> 5", "Manuel d'incident"],
        ["Incidents niveau 3-4 cette semaine", "0", "≥ 1", "Manuel d'incident"],
        ["Réclamations reçues cette semaine", "≤ 5", "> 10", "Procédure réclamation"],
        ["Délai moyen réponse réclamation", "≤ 7 jours", "> 14 jours", "Procédure réclamation"],
      ],
    }),

    H2("1.3. Trésorerie"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible An 1 T4", "Seuil alerte", "Mesure"],
      rows: [
        ["Solde compte d'exploitation (€)", "≥ 200 K€", "< 100 K€", "Banque"],
        ["Fonds clients en transit (€)", "Suivi continu", "Alerte > 130 % couverture APST", "Plateforme Eventy"],
        ["Versements indépendants effectués (€)", "≈ commissions dues", "Retard > 7 jours", "Compta"],
        ["Versements fournisseurs effectués (€)", "≈ factures dues", "Retard > 7 jours", "Compta"],
      ],
    }),

    H1("2. KPIs mensuels (revue le 5 du mois suivant)"),

    H2("2.1. Vue financière consolidée"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible An 1", "Seuil alerte", "Mesure"],
      rows: [
        ["CA HT mensuel (€)", "Variable selon mois", "< 70 % cible mensuelle", "Compta"],
        ["Marge brute opérée mensuelle (€)", "≈ 11,1 % CA", "< 9 % CA", "Compta"],
        ["Eventy net avant charges mensuel (€)", "≈ 4,3 % CA", "< 3 %", "Compta"],
        ["Charges Eventy mensuelles (€)", "Variable", "+ 20 % vs budget", "Compta"],
        ["Trésorerie cumulée fin de mois (€)", "Selon plan", "< 80 % du plan", "Banque"],
        ["BFR (en jours de CA)", "- 30 à - 33 jours", "> - 20 jours (dégradation)", "Compta"],
      ],
    }),

    H2("2.2. Qualité du service voyageur"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible An 1", "Seuil alerte", "Mesure"],
      rows: [
        ["Net Promoter Score (NPS) mensuel", "≥ + 60", "< + 40", "Enquête post-voyage"],
        ["Note moyenne voyage / 5", "≥ 4,5", "< 4,0", "Enquête post-voyage"],
        ["Taux d'annulation voyageur", "≤ 5 %", "> 10 %", "Plateforme Eventy"],
        ["Taux d'incident opérationnel", "≤ 2 %", "> 5 %", "Manuel d'incident"],
        ["Taux saisine MTV (cumul)", "≤ 0,2 %", "> 1 %", "MTV"],
        ["Délai moyen indemnisation réclamation", "≤ 14 jours", "> 30 jours", "Procédure réclamation"],
      ],
    }),

    H2("2.3. Écosystème partenaires"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible An 1 fin", "Seuil alerte", "Mesure"],
      rows: [
        ["Créateurs indépendants actifs", "≥ 100", "< 50", "Plateforme Eventy"],
        ["Vendeurs actifs (placement / mois)", "≥ 200", "< 100", "Plateforme Eventy"],
        ["HRA référencés cumulés", "≥ 200", "< 100", "Plateforme Eventy"],
        ["Autocaristes partenaires actifs", "≥ 8", "< 4", "Plateforme Eventy"],
        ["Note moyenne audits HRA", "≥ 4/5", "< 3,5/5", "Audits qualité"],
        ["Concentration top 5 fournisseurs HRA / CA", "≤ 25 %", "> 40 %", "Compta analytique"],
      ],
    }),

    H2("2.4. Marketing et acquisition"),
    makeTable({
      widths: [3500, 2000, 2000, 1860],
      header: ["Indicateur", "Cible An 1", "Seuil alerte", "Mesure"],
      rows: [
        ["Coût d'acquisition voyageur (CAC)", "≤ 15 €", "> 25 €", "Marketing"],
        ["Conversion site (visiteurs → réservations)", "≥ 1,5 %", "< 0,8 %", "Analytics"],
        ["Taux d'ouverture newsletter", "≥ 25 %", "< 15 %", "Brevo / Mailchimp"],
        ["Note moyenne Trustpilot", "≥ 4,5/5", "< 4,2", "Trustpilot"],
        ["Note moyenne Google", "≥ 4,5/5", "< 4,2", "Google Business"],
      ],
    }),

    H1("3. KPIs trimestriels (déclaration APST + revue conformité)"),

    H2("3.1. Reporting APST"),
    Bullet("Déclaration certifiée des fonds clients en transit (montant max trimestriel)."),
    Bullet("Cotisation variable APST (≈ 0,7 % du CA distribué)."),
    Bullet("Mise à jour de la couverture (garantie / fonds en transit) — cible ≥ 130 %."),
    Bullet("Notification de tout incident significatif."),
    Bullet("Bilan d'activité du trimestre."),

    H2("3.2. Revue Comité conformité & risques"),
    Bullet("Revue des incidents trimestriels (volume, nature, gravité)."),
    Bullet("Revue de la conformité réglementaire (Code Tourisme, RGPD, fiscalité)."),
    Bullet("Revue des risques émergents."),
    Bullet("Mise à jour du PCA si besoin."),
    Bullet("Validation du calibrage de la garantie financière pour le trimestre suivant."),

    H1("4. KPIs annuels (bilan + rapport d'activité)"),

    H2("4.1. Bilan financier annuel"),
    Bullet("Compte de résultat annuel certifié par expert-comptable."),
    Bullet("Bilan annuel."),
    Bullet("Comparaison avec le prévisionnel ayant servi à l'octroi de la garantie APST."),
    Bullet("Calcul de la capacité d'autofinancement (CAF)."),
    Bullet("Constitution effective de la réserve volontaire 5 % CA."),

    H2("4.2. Rapport d'activité annuel"),
    Bullet("Synthèse de l'année écoulée (volume, satisfaction, incidents, croissance)."),
    Bullet("Volet RSE (engagements chiffrés vs réalisations)."),
    Bullet("Volet équipe (recrutements, formations)."),
    Bullet("Volet écosystème (partenaires actifs, redistribution aux indépendants)."),
    Bullet("Perspectives pour l'année suivante."),

    H1("5. Outils et automatisation"),
    Bullet("Plateforme Eventy : extraction automatique des KPIs métier (voyages, voyageurs, partenaires)."),
    Bullet("Stripe Connect : extraction automatique des KPIs financiers (encaissements, décaissements, fonds en transit)."),
    Bullet("Logiciel comptable : extraction automatique des KPIs fiscaux et financiers consolidés."),
    Bullet("Google Business / Trustpilot : monitoring automatique des notes moyennes."),
    Bullet("Tableau de bord visuel : dashboard interne (Notion, Looker Studio, ou équivalent) consolidé."),

    H1("6. Cadence de revue"),
    makeTable({
      widths: [2500, 4500, 2360],
      header: ["Cadence", "Participants", "Format"],
      rows: [
        ["Hebdomadaire (lundi 9h)", "Responsable ops + Président", "Visio 30 min"],
        ["Mensuelle (le 5 du mois suivant)", "Comité de pilotage opérationnel (5 ETP)", "Visio + dashboard 1 h"],
        ["Trimestrielle", "Comité conformité & risques + APST sur invitation", "Présentiel ou visio 2 h"],
        ["Annuelle", "Présidence + équipe + conseils externes + investisseurs", "Bilan annuel + rapport"],
      ],
    }),

    Spacer(160),
    P("Document opérationnel interne — Version 1.0 — 30 avril 2026. Mise à jour selon évolutions plateforme et besoins de pilotage.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Partie 11 du dossier APST (Indicateurs de pilotage), Politique RSE, Manuel d'incident voyage, Procédure de réclamation détaillée.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Fournisseurs.docx",
      title: "Eventy Life — Charte fournisseurs",
      description: "Code de conduite des partenaires HRA, transporteurs et prestataires terrain.",
      footer: "EVENTY LIFE SAS — Charte fournisseurs",
      children: charteFournisseurs(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Audit-Qualite-HRA.docx",
      title: "Eventy Life — Procédure d'audit qualité HRA",
      description: "Procédure d'audit qualité initial et récurrent des partenaires HRA.",
      footer: "EVENTY LIFE SAS — Procédure audit qualité HRA",
      children: procedureAudit(),
    },
    {
      file: "docs/garanties/Eventy-Life-Tableau-Bord-Operationnel.docx",
      title: "Eventy Life — Tableau de bord opérationnel",
      description: "KPIs hebdomadaires, mensuels, trimestriels et annuels.",
      footer: "EVENTY LIFE SAS — Tableau de bord opérationnel",
      children: tableauBord(),
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
