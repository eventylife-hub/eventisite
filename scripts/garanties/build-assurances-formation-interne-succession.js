/**
 * Eventy Life — Trois documents résilience corporate
 *
 *   1. Politique d'assurance globale Eventy
 *   2. Plan de formation interne équipe
 *   3. Plan de succession dirigeant et continuité
 *
 * Usage : node scripts/garanties/build-assurances-formation-interne-succession.js
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
// DOCUMENT 1 — POLITIQUE D'ASSURANCE GLOBALE
// ============================================================
function politiqueAssuranceGlobale() {
  return [
    bandeauTitre(
      "POLITIQUE D'ASSURANCE GLOBALE EVENTY",
      "Cartographie des couvertures et stratégie de gestion des risques",
    ),
    Spacer(160),

    P("La présente politique formalise la stratégie d'assurance d'EVENTY LIFE SAS sur l'ensemble de son périmètre d'activité. Elle complète et synthétise les couvertures spécifiques (RC Pro Tourisme, garantie financière APST, Pack Sérénité voyageurs) en une vue d'ensemble cohérente. Elle s'inscrit dans la cohérence du Plan de continuité d'activité et de la Politique de gestion des conflits d'intérêts.", { italics: true }),

    P("L'approche Eventy en matière d'assurance : couvrir suffisamment pour protéger l'activité et les voyageurs, sans surcouvrance excessive. Chaque souscription est justifiée par une analyse de risque chiffrée. La transparence sur ces couvertures est un signal de confiance auprès des partenaires et des voyageurs.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Code des assurances français."),
    Bullet("Articles L211-16 et L211-17 du Code du tourisme — RC Pro obligatoire."),
    Bullet("Article L211-18 du Code du tourisme — garantie financière obligatoire."),
    Bullet("Recommandations APST (cohérence Dossier garantie financière)."),
    Bullet("Plan de continuité d'activité Eventy (cohérence)."),

    H1("2. Cartographie des couvertures Eventy"),

    H2("2.1. Vue d'ensemble — 7 couvertures structurelles"),
    makeTable({
      widths: [2496, 2496, 2496, 1872],
      header: ["Couverture", "Cible An 1", "Plafond / engagement", "Coût annuel estimé"],
      rows: [
        ["Garantie financière APST", "1,6 M€", "100 % fonds voyageurs", "≈ 2 100 €"],
        ["RC Pro Tourisme", "Hiscox/Galian/CMB", "≥ 2 M€/sinistre, ≥ 5 M€/an", "780-1 200 €"],
        ["Multirisque locaux", "Tous risques bureau", "Selon valeur biens", "300-600 €"],
        ["Cyber risque", "Sinistres SI/données", "≥ 500 K€", "1 000-2 500 €"],
        ["Pack Sérénité voyageurs", "Assistance + rapatriement", "Inclus dans voyage", "Refacturé voyageur"],
        ["Mutuelle équipe (santé)", "Mutuelle entreprise", "70 % part Eventy", "Selon effectif"],
        ["RC dirigeant (D&O)", "Resp. civile dirigeants", "≥ 1 M€/sinistre", "1 500-3 000 €"],
      ],
    }),

    H1("3. Détail par couverture"),

    H2("3.1. Garantie financière APST (priorité absolue)"),
    Bullet("Cohérence avec Dossier garantie financière APST."),
    Bullet("Garantit 100 % des fonds versés par les voyageurs en cas de défaillance Eventy."),
    Bullet("Activée par : compte cantonné voyageurs + adhésion APST."),
    Bullet("Volume cible : 1,6 M€ An 1, ajusté trimestriellement selon pic des fonds en transit."),
    Bullet("Reporting trimestriel APST obligatoire."),
    Bullet("Coût annuel : ~2 100 € en An 1, évolutif selon volume."),

    H2("3.2. RC Pro Tourisme (priorité réglementaire)"),
    Bullet("Obligatoire (article L211-18 Code du tourisme)."),
    Bullet("Couvre la responsabilité civile professionnelle (dommages causés aux voyageurs et tiers)."),
    Bullet("Plafonds Eventy An 1 : ≥ 2 M€ par sinistre, ≥ 5 M€ par année d'assurance."),
    Bullet("Assureurs envisagés : Hiscox, Galian, CMB Assurances (cohérence Dossier garantie financière)."),
    Bullet("Coût : 780-1 200 €/an en An 1."),
    Bullet("Évolution : ajustement annuel selon CA et sinistralité."),

    H2("3.3. Multirisque locaux"),
    Bullet("Couvre les locaux Eventy (siège, espaces de coworking)."),
    Bullet("Périls couverts : incendie, dégâts des eaux, vol, bris, responsabilité occupant."),
    Bullet("Matériel informatique inclus."),
    Bullet("Coût : 300-600 €/an selon surface et matériel."),

    H2("3.4. Cyber risque"),
    Bullet("Couvre les sinistres liés au système d'information : cyberattaque, ransomware, fuite de données."),
    Bullet("Cohérence avec la Politique cybersécurité."),
    Bullet("Inclus : frais de gestion de crise, notification CNIL, indemnités voyageurs (limites prévues)."),
    Bullet("Plafond : ≥ 500 K€ par sinistre."),
    Bullet("Coût : 1 000-2 500 €/an en An 1, évolutif selon CA et données traitées."),

    H2("3.5. Pack Sérénité voyageurs"),
    Bullet("Inclus dans tout voyage Eventy (cohérence Glossaire voyage et CGV)."),
    Bullet("Assistance médicale 24/7, hébergement de secours, rapatriement, soutien psychologique."),
    Bullet("Souscrit auprès d'un assureur d'assistance (ex : Mondial Assistance, Europ Assistance)."),
    Bullet("Coût refacturé au voyageur dans le prix du voyage."),
    Bullet("Cohérence Dossier garantie financière (4 niveaux de protection)."),

    H2("3.6. Mutuelle santé équipe"),
    Bullet("Mutuelle d'entreprise obligatoire dès le 1er salarié (loi ANI 2016)."),
    Bullet("Eventy : prise en charge à 70 % (vs 50 % obligatoire) — cohérence Charte télétravail."),
    Bullet("Coût total selon effectif et niveau de garantie choisi."),

    H2("3.7. RC dirigeant (D&O — Directors & Officers)"),
    Bullet("Couvre la responsabilité civile et personnelle du dirigeant."),
    Bullet("Indispensable dès la levée de fonds Seed (cohérence Pacte associés Seed)."),
    Bullet("Plafond : ≥ 1 M€ par sinistre en An 1, ≥ 5 M€ en An 3."),
    Bullet("Coût : 1 500-3 000 €/an selon plafond."),
    Bullet("Étend la couverture aux administrateurs et représentants légaux."),

    H1("4. Couvertures complémentaires à étudier (An 2-3)"),

    H2("4.1. Pertes d'exploitation"),
    Bullet("Couvre la perte de marge brute en cas d'arrêt forcé d'activité."),
    Bullet("Pertinent à partir d'An 2 (CA > 2 M€)."),
    Bullet("Coût : ≈ 0,5 % du CA annuel."),

    H2("4.2. Garantie homme-clé"),
    Bullet("Couvre la perte financière en cas d'incapacité ou décès du dirigeant."),
    Bullet("Pertinent dès An 2 (Eventy fortement dépendante du Président)."),
    Bullet("Plafond : ≥ 500 K€."),
    Bullet("Coût : 1 500-3 000 €/an."),

    H2("4.3. Crédit-export"),
    Bullet("Pour la phase d'expansion internationale (cohérence Plan d'expansion internationale)."),
    Bullet("Couvre les impayés voyageurs étrangers."),
    Bullet("À étudier en An 3+."),

    H1("5. Gouvernance des assurances"),

    H2("5.1. Référent"),
    Bullet("Président en An 1."),
    Bullet("DAF / RAF en An 3+ (recrutement progressif)."),
    Bullet("Conseil externe : courtier d'assurance spécialisé tourisme."),

    H2("5.2. Revue annuelle"),
    Bullet("Audit annuel de toutes les couvertures (T1)."),
    Bullet("Renégociation des contrats à échéance."),
    Bullet("Ajustement plafonds selon évolution CA et risques."),
    Bullet("Cohérence avec audit interne (cohérence Plan d'audit interne)."),

    H2("5.3. Sinistre — procédure"),
    Bullet("Déclaration immédiate à l'assureur (sous 5 jours ouvrés)."),
    Bullet("Documentation rigoureuse (faits, preuves, témoins)."),
    Bullet("Coordination avec avocat tourisme (cohérence Note avocat tourisme)."),
    Bullet("Reporting Atout France et APST si applicable."),
    Bullet("Activation du Plan de continuité d'activité si critique."),

    H1("6. Choix d'assureurs"),

    H2("6.1. Critères de sélection"),
    Bullet("Spécialisation tourisme (compréhension du métier)."),
    Bullet("Solidité financière (rating agences notation)."),
    Bullet("Qualité du service sinistre (réactivité, expérience clients)."),
    Bullet("Compétitivité tarifaire."),
    Bullet("Souveraineté européenne (préférence assureurs UE)."),
    Bullet("Engagements RSE de l'assureur (cohérence Politique d'achats responsables)."),

    H2("6.2. Refus de courtage à enjeux"),
    Bullet("Refus des courtiers exigeant des commissions cachées."),
    Bullet("Refus des assureurs ne disposant pas d'agrément ACPR."),
    Bullet("Cohérence avec Politique anti-corruption."),

    H1("7. Indicateurs assurances"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Couvertures actives / minimum requis", "100 %", "100 %"],
        ["Plafonds adéquats au CA", "Audité annuellement", "Audité annuellement"],
        ["Délai déclaration sinistre", "≤ 5 j ouvrés", "≤ 48 h ouvrées"],
        ["Coût total assurances / CA", "≤ 0,8 %", "≤ 0,5 %"],
        ["Sinistres déclarés / an", "Suivi", "Suivi"],
        ["Sinistralité moyenne", "Suivi", "Suivi"],
      ],
    }),

    H1("8. Engagements éthiques"),
    Bullet("Transparence sur les couvertures (publication synthétique sur eventylife.fr)."),
    Bullet("Refus de la sous-couverture pour économies (sécurité voyageur prime)."),
    Bullet("Refus de la sur-couverture excessive (gestion sobre)."),
    Bullet("Refus du courtage opaque ou des commissions cachées."),
    Bullet("Engagement à payer les sinistres légitimes (refus des contestations abusives)."),
    Bullet("Engagement de bonne foi dans les déclarations."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Dossier garantie financière APST, RC Pro, Pack Sérénité, Plan de continuité d'activité, Politique cybersécurité, Politique d'achats responsables, Politique anti-corruption, Manuel d'incident voyage.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN DE FORMATION INTERNE ÉQUIPE
// ============================================================
function planFormationInterne() {
  return [
    bandeauTitre(
      "PLAN DE FORMATION INTERNE ÉQUIPE EVENTY",
      "Référentiel formation continue des collaborateurs salariés",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie de formation continue d'EVENTY LIFE SAS pour ses collaborateurs salariés. Il complète et se distingue du Plan de formation accompagnateur (qui couvre les accompagnateurs partenaires) en se concentrant sur l'équipe interne. Il s'inscrit dans la cohérence avec la Charte télétravail, la Procédure de recrutement et le Modèle d'entretien annuel.", { italics: true }),

    P("Eventy investit dans le développement de chaque collaborateur. Le budget formation est minimum 2 % de la masse salariale en An 1 (vs 1 % obligation légale), avec cible 5 % en An 3. La formation est un droit, pas une faveur. Chaque collaborateur dispose d'un parcours individualisé.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Articles L6321-1 à L6321-12 du Code du travail — obligation de formation employeur."),
    Bullet("Article L6315-1 — entretien professionnel obligatoire tous les 2 ans."),
    Bullet("Compte Personnel de Formation (CPF) — droit individuel."),
    Bullet("Formation Professionnelle Continue (FPC)."),
    Bullet("Charte télétravail Eventy (cohérence)."),
    Bullet("Modèle d'entretien annuel Eventy (cohérence)."),

    H1("2. Engagements Eventy"),

    H2("2.1. Budget formation"),
    Bullet("An 1 : ≥ 2 % de la masse salariale brute."),
    Bullet("An 3 : ≥ 5 % de la masse salariale brute."),
    Bullet("Au-delà du minimum légal (1 % pour entreprises < 11 salariés)."),
    Bullet("Toute formation métier (tourisme, juridique, technique) prise en charge à 100 %."),

    H2("2.2. Engagement temps"),
    Bullet("Au moins 21 heures de formation par an et par collaborateur (équivalent 3 j)."),
    Bullet("Formation sur le temps de travail (pas hors heures)."),
    Bullet("Cible An 3 : 35 heures par an et par collaborateur."),

    H2("2.3. Engagement qualité"),
    Bullet("Choix de formations agréées et reconnues."),
    Bullet("Évaluation post-formation (utilité ressentie, mise en pratique)."),
    Bullet("Refus des formations « bidons » sans valeur ajoutée."),

    H1("3. Catégories de formation"),

    H2("3.1. Formations obligatoires (réglementaires)"),
    Bullet("Sécurité au travail (formation initiale + recyclage)."),
    Bullet("Sensibilisation RGPD (annuelle, 1 h, cohérence Politique RGPD)."),
    Bullet("Sensibilisation cybersécurité (annuelle, 1 h, cohérence Politique cybersécurité)."),
    Bullet("Sensibilisation conflits d'intérêts (annuelle, 30 min, cohérence Politique conflits d'intérêts)."),
    Bullet("Sensibilisation anti-corruption (annuelle, 30 min, cohérence Politique anti-corruption)."),
    Bullet("Sensibilisation accessibilité (annuelle, 30 min, cohérence Politique accessibilité PMR)."),

    H2("3.2. Formations métier (tourisme)"),
    Bullet("Code du tourisme et obligations opérateur."),
    Bullet("Directive UE 2015/2302 (forfaits touristiques)."),
    Bullet("TVA marge tourisme (cohérence Guide TVA marge tourisme)."),
    Bullet("Audit qualité HRA (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Manuel d'incident voyage (cohérence document dédié)."),
    Bullet("Formations institutionnelles (Atout France, APST, ETOA selon)."),

    H2("3.3. Formations techniques"),
    Bullet("Stack technique Next.js / NestJS (équipe dev)."),
    Bullet("Cybersécurité avancée (référent sécurité)."),
    Bullet("Comptabilité tourisme (équipe finance)."),
    Bullet("Outils SaaS internes (Stripe, Google Workspace, etc.)."),
    Bullet("Accessibilité numérique WCAG (équipe dev/UX)."),

    H2("3.4. Formations transverses"),
    Bullet("Communication écrite et orale."),
    Bullet("Prise de parole en public."),
    Bullet("Management (pour collaborateurs avec encadrement)."),
    Bullet("Gestion du temps et priorités."),
    Bullet("Bien-être au travail et risques psycho-sociaux."),
    Bullet("Langues (anglais prioritaire, espagnol secondaire)."),

    H2("3.5. Formations stratégiques"),
    Bullet("Innovation produit / UX."),
    Bullet("Économie sociale et solidaire (cohérence Politique RSE)."),
    Bullet("Tourisme durable (cohérence Charte engagement carbone)."),
    Bullet("Conférences professionnelles externes (1-2 j/an)."),

    H1("4. Modalités de formation"),

    H2("4.1. Formations internes Eventy"),
    Bullet("Onboarding nouveau collaborateur (1 semaine — cohérence Procédure de recrutement)."),
    Bullet("Modules courts internes (« lunch & learn ») — 30-60 min, périodicité mensuelle."),
    Bullet("Partage d'expérience post-conférence externe (10 min)."),
    Bullet("Mentorat interne (collaborateur ancien accompagne nouveau)."),

    H2("4.2. Formations externes"),
    Bullet("Organisme de formation agréé (vérification certification Qualiopi)."),
    Bullet("MOOCs et e-learning de qualité (cf. liste recommandée)."),
    Bullet("Conférences sectorielles (IFTM, Web Summit, etc.)."),
    Bullet("Formations diplômantes (CPF mobilisable)."),

    H2("4.3. Conférences et événements"),
    Bullet("Budget conférences professionnelles : 500-1 500 €/an/collaborateur."),
    Bullet("Restitution équipe obligatoire (5-10 min) après chaque conférence."),
    Bullet("Cohérence avec Plan d'événements (présence Eventy à certains salons)."),

    H1("5. Parcours individualisés"),

    H2("5.1. Cadre"),
    Bullet("Plan de formation individuel défini lors de l'entretien annuel (cohérence Modèle d'entretien annuel)."),
    Bullet("Adapté au poste, à la séniorité et aux aspirations du collaborateur."),
    Bullet("Validation par le Président."),
    Bullet("Suivi semestriel."),

    H2("5.2. Exemples par profil"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Profil", "Focus formation An 1", "Budget annuel cible"],
      rows: [
        ["Junior dev", "Stack technique + cybersécurité", "1 500 €"],
        ["Confirmé dev", "Architecture + accessibilité", "2 500 €"],
        ["Communication / marketing", "Tourisme + RSE", "2 000 €"],
        ["Opérations / support", "Tourisme + relations clients", "1 500 €"],
        ["Finance / admin", "Comptabilité tourisme + audit", "2 500 €"],
        ["Manager", "Management + leadership", "3 500 €"],
      ],
    }),

    H1("6. Reporting et suivi"),
    Bullet("Suivi heures de formation par collaborateur (registre interne)."),
    Bullet("Reporting annuel à l'OPCO (financement formation)."),
    Bullet("Indicateurs internes mensuels (cohérence Tableau de bord opérationnel)."),
    Bullet("Évaluation utilité formation (questionnaire post-formation)."),

    H1("7. Indicateurs formation"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Heures formation moyenne / collaborateur / an", "≥ 21", "≥ 35"],
        ["Budget formation / masse salariale", "≥ 2 %", "≥ 5 %"],
        ["Taux de formation obligatoire", "100 %", "100 %"],
        ["Taux de satisfaction formation", "≥ 75 %", "≥ 90 %"],
        ["Taux de mise en pratique post-formation", "≥ 60 %", "≥ 80 %"],
        ["Plan de formation individualisé établi", "100 %", "100 %"],
      ],
    }),

    H1("8. Engagements"),
    Bullet("Refus de la formation « gadget » sans utilité réelle."),
    Bullet("Refus de la formation comme outil de pression managériale."),
    Bullet("Égalité d'accès à la formation (refus discrimination)."),
    Bullet("Adaptation à la situation personnelle (parents, charges familiales)."),
    Bullet("Possibilité de formation diplômante (CPF + abondement Eventy)."),
    Bullet("Maintien de la rémunération pendant les formations."),

    H1("9. Mobilité interne et évolution"),
    Bullet("Possibilité de mobilité fonctionnelle accompagnée par formation dédiée."),
    Bullet("Promotion interne préférée à recrutement externe pour postes seniors."),
    Bullet("Cohérence avec Procédure de recrutement (priorité candidature interne)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte télétravail, Procédure de recrutement, Modèle d'entretien annuel, Politique RSE (pilier social), Plan de formation accompagnateur, ensemble du dispositif documentaire Eventy.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN DE SUCCESSION DIRIGEANT
// ============================================================
function planSuccessionDirigeant() {
  return [
    bandeauTitre(
      "PLAN DE SUCCESSION DIRIGEANT EVENTY",
      "Continuité du dirigeant et résilience corporate",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie de continuité d'EVENTY LIFE SAS en cas d'indisponibilité, démission ou disparition du dirigeant (Président David Eventy). Il complète le Plan de continuité d'activité (qui couvre la résilience opérationnelle), le Pacte d'associés Seed (qui couvre la gouvernance) et la Procédure de gestion de crise communication.", { italics: true }),

    P("Eventy reconnaît que sa dépendance au dirigeant est forte (modèle « founder-led »). Plutôt que d'éluder ce risque, nous l'anticipons. La continuité d'activité ne dépend pas que d'une personne — elle dépend d'un système documenté, d'une équipe formée et d'un dispositif juridique solide.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Statuts SAS Eventy Life (cohérence Statuts SAS)."),
    Bullet("Pacte d'associés Seed (cohérence)."),
    Bullet("Code commerce — articles L227-6 et suivants."),
    Bullet("Plan de continuité d'activité Eventy."),
    Bullet("Procédure de gestion de crise communication."),

    H1("2. Niveaux d'indisponibilité"),

    H2("2.1. Niveau 1 — Indisponibilité courte (< 7 jours)"),
    Bullet("Vacances, déplacement, maladie courte."),
    Bullet("Continuité opérationnelle assurée par l'équipe sans formalisme particulier."),
    Bullet("Délégation tacite des décisions opérationnelles à l'équipe."),
    Bullet("Aucune décision stratégique sans le Président (sauf urgence)."),

    H2("2.2. Niveau 2 — Indisponibilité moyenne (1 semaine à 3 mois)"),
    Bullet("Maladie longue, congé parental, convalescence."),
    Bullet("Activation du dispositif de délégation (cohérence statuts SAS)."),
    Bullet("Information aux investisseurs et associés."),
    Bullet("Communication équipe interne."),

    H2("2.3. Niveau 3 — Indisponibilité longue (> 3 mois)"),
    Bullet("Maladie grave, incapacité prolongée, indisponibilité ≥ 3 mois."),
    Bullet("Activation du Conseil de surveillance ad hoc (cohérence Pacte associés Seed)."),
    Bullet("Désignation d'un Directeur Général par intérim."),
    Bullet("Communication transparente aux parties prenantes."),

    H2("2.4. Niveau 4 — Disparition / décès"),
    Bullet("Activation immédiate du dispositif de succession."),
    Bullet("Convocation Assemblée générale extraordinaire."),
    Bullet("Désignation nouveau Président (modalités prévues par les statuts)."),
    Bullet("Coordination avec la famille du dirigeant (cohérence émotionnelle)."),

    H1("3. Architecture de la continuité"),

    H2("3.1. Délégation pour décisions courantes"),
    Bullet("Désignation d'un référent intérim au sein de l'équipe (à formaliser dès An 1)."),
    Bullet("Profil cible : salarié senior, ancienneté ≥ 12 mois, compréhension globale Eventy."),
    Bullet("Périmètre : décisions opérationnelles courantes (réservations, partenaires, équipe)."),
    Bullet("Limites : pas de décisions stratégiques (catalogue, partenariats majeurs, finance > 10 K€)."),

    H2("3.2. Conseil de surveillance ad hoc (Niveaux 3-4)"),
    Bullet("Composition prévue dans le Pacte associés Seed : 1-3 personnes."),
    Bullet("Activation par décision des associés (50 % des voix)."),
    Bullet("Mission : superviser la gestion intérimaire."),
    Bullet("Désignation du Directeur Général par intérim."),

    H2("3.3. Direction Générale par intérim (Niveau 3-4)"),
    Bullet("Désignation par le Conseil de surveillance ad hoc ou les associés."),
    Bullet("Profil cible : externe ou interne avec maturité de gestion."),
    Bullet("Mandat : 6-12 mois maximum, renouvelable une fois."),
    Bullet("Pouvoirs : tous les pouvoirs nécessaires à la gestion courante et stratégique."),
    Bullet("Limites : pas de cession de la société, pas de modification des statuts (sauf accord associés)."),

    H1("4. Documentation indispensable"),

    H2("4.1. Connaissance critique à documenter"),
    Bullet("Architecture technique de la plateforme (cohérence Roadmap technique)."),
    Bullet("Identifiants critiques (registres centralisés sécurisés)."),
    Bullet("Contrats stratégiques (HRA, transporteurs, banque, assurance)."),
    Bullet("Réseau de partenaires clés (cohérence Plan de partenariats institutionnels)."),
    Bullet("Vision stratégique 5 ans (cohérence Roadmap technique + Plan d'expansion internationale)."),
    Bullet("Procédures opérationnelles (cohérence Manuel des opérations quotidiennes)."),

    H2("4.2. Coffre-fort numérique sécurisé"),
    Bullet("Identifiants des outils critiques (Stripe, Scaleway, Google Workspace, etc.)."),
    Bullet("Accès chiffré, à 2 personnes minimum (Président + 1 référent)."),
    Bullet("Mise à jour mensuelle."),
    Bullet("Cohérence avec Politique cybersécurité."),
    Bullet("Procédure d'urgence pour activation en cas d'indisponibilité."),

    H2("4.3. Carnet de bord du dirigeant"),
    Bullet("Document tenu à jour par le Président."),
    Bullet("Décisions stratégiques en cours."),
    Bullet("Engagements pris (oraux et écrits)."),
    Bullet("Réflexions et orientations."),
    Bullet("Confidentiel mais accessible au Conseil de surveillance ad hoc en cas de besoin."),

    H1("5. Préparation préventive"),

    H2("5.1. Formations spécifiques"),
    Bullet("Formation continue de 1-2 collaborateurs senior à la gestion globale Eventy."),
    Bullet("Modules dédiés : finance, juridique, opérationnel, stratégie."),
    Bullet("Possibilité de simulation d'indisponibilité courte (1-2 j sans Président)."),

    H2("5.2. Communication des informations critiques"),
    Bullet("Réunion mensuelle de l'équipe avec partage transversal (cohérence Mardi de l'équipe)."),
    Bullet("Documentation systématique des décisions et discussions."),
    Bullet("Refus de la concentration excessive d'informations sur le dirigeant."),

    H2("5.3. Réseau externe"),
    Bullet("Relation maintenue avec avocat tourisme (cohérence Note avocat tourisme)."),
    Bullet("Relation maintenue avec expert-comptable (cohérence Note expert-comptable)."),
    Bullet("Relation avec banque domiciliataire (cohérence Document banque domiciliataire)."),
    Bullet("Relation avec investisseurs (reporting régulier)."),

    H1("6. Procédures spécifiques par niveau"),

    H2("6.1. Niveau 1 — Indisponibilité courte"),
    Numbered("Information préalable de l'équipe sur la durée et les contacts d'urgence."),
    Numbered("Délégation tacite des décisions opérationnelles courantes."),
    Numbered("Référent intérim disponible."),
    Numbered("Au retour : briefing rapide sur les événements de la période."),

    H2("6.2. Niveau 2 — Indisponibilité moyenne"),
    Numbered("Activation formelle du référent intérim."),
    Numbered("Information écrite aux investisseurs et associés."),
    Numbered("Communication interne et externe coordonnée."),
    Numbered("Reporting hebdomadaire à l'équipe et aux associés."),
    Numbered("Limitation des décisions stratégiques."),

    H2("6.3. Niveau 3 — Indisponibilité longue"),
    Numbered("Activation du Conseil de surveillance ad hoc."),
    Numbered("Désignation Directeur Général par intérim."),
    Numbered("Communication aux parties prenantes (équipe, partenaires, voyageurs si nécessaire)."),
    Numbered("Activation du Plan de continuité d'activité (cohérence document dédié)."),
    Numbered("Reporting mensuel investisseurs."),
    Numbered("Évaluation à 3 et 6 mois."),

    H2("6.4. Niveau 4 — Disparition / décès"),
    Numbered("Communication immédiate à la famille (priorité humaine)."),
    Numbered("Information confidentielle aux investisseurs et associés."),
    Numbered("Activation Conseil de surveillance ad hoc."),
    Numbered("Convocation AGE pour décision stratégique."),
    Numbered("Communication mesurée à l'équipe et aux partenaires (avec accord famille)."),
    Numbered("Communication mesurée publique (cohérence Procédure de gestion de crise communication)."),
    Numbered("Décision sur l'avenir de la société (continuité, vente, dissolution)."),

    H1("7. Décisions stratégiques en cas de Niveau 4"),

    H2("7.1. Continuité avec nouveau dirigeant"),
    Bullet("Recherche d'un dirigeant aligné avec les valeurs Eventy."),
    Bullet("Profil cible : tourisme, économie sociale, gestion d'entreprise."),
    Bullet("Période transition 6-12 mois."),
    Bullet("Maintien des engagements clients existants."),

    H2("7.2. Cession à un acteur aligné"),
    Bullet("Recherche d'un repreneur partageant les valeurs."),
    Bullet("Refus de cession à un acteur aux pratiques contraires (extraction, dumping)."),
    Bullet("Négociation pour préserver les engagements voyageurs et partenaires."),

    H2("7.3. Dissolution ordonnée"),
    Bullet("Si aucun repreneur aligné, liquidation préservant les voyageurs."),
    Bullet("Activation de la garantie financière APST pour rembourser les voyageurs."),
    Bullet("Cession des actifs résiduels."),
    Bullet("Communication transparente."),

    H1("8. Engagements opposables"),
    Bullet("Mise à jour annuelle du présent plan."),
    Bullet("Tests pratiques annuels (simulation de Niveau 1 ou 2)."),
    Bullet("Information annuelle des associés sur l'état du dispositif."),
    Bullet("Maintien de la documentation à jour (coffre-fort numérique sécurisé)."),
    Bullet("Préservation des engagements voyageurs en toutes circonstances."),
    Bullet("Refus de la dissolution chaotique en cas de Niveau 4."),

    Spacer(160),
    P("Document de référence interne et investisseur — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Statuts SAS, Pacte d'associés Seed, Plan de continuité d'activité, Procédure de gestion de crise communication, Politique d'assurance globale (RC dirigeant D&O, garantie homme-clé), Manuel des opérations quotidiennes, Roadmap technique.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Assurance-Globale.docx",
      title: "Eventy Life — Politique d'assurance globale",
      description: "Cartographie des couvertures et stratégie de gestion des risques.",
      footer: "EVENTY LIFE SAS — Politique assurance globale",
      children: politiqueAssuranceGlobale(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Formation-Interne.docx",
      title: "Eventy Life — Plan de formation interne équipe",
      description: "Référentiel formation continue des collaborateurs salariés.",
      footer: "EVENTY LIFE SAS — Plan formation interne équipe",
      children: planFormationInterne(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Succession-Dirigeant.docx",
      title: "Eventy Life — Plan de succession dirigeant",
      description: "Continuité du dirigeant et résilience corporate.",
      footer: "EVENTY LIFE SAS — Plan succession dirigeant",
      children: planSuccessionDirigeant(),
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
