/**
 * Eventy Life — Trois documents stratégie externe
 *
 *   1. Plan d'expansion internationale
 *   2. Stratégie relations presse et médias
 *   3. Plan de partenariats institutionnels
 *
 * Usage : node scripts/garanties/build-strategie-expansion-rp-partenariats.js
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
// DOCUMENT 1 — PLAN D'EXPANSION INTERNATIONALE
// ============================================================
function planExpansionInternationale() {
  return [
    bandeauTitre(
      "PLAN D'EXPANSION INTERNATIONALE EVENTY",
      "Stratégie pluriannuelle de déploiement Europe et international",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'expansion internationale d'EVENTY LIFE SAS sur une trajectoire pluriannuelle. Il complète le Dossier investisseur (volet expansion) et la Roadmap technique (volet internationalisation). L'expansion est progressive, prudente, alignée avec les valeurs Eventy.", { italics: true }),

    P("Eventy refuse une expansion mécanique : nous ne dupliquons pas le modèle pour exister sur une carte. Nous ouvrons un nouveau marché quand les conditions humaines, opérationnelles et économiques sont réunies, pas avant. La rentabilité durable prime sur la croissance vaniteuse.", { italics: true }),

    H1("1. Principes directeurs"),

    H2("1.1. Cinq principes"),
    Bullet("Maîtrise avant croissance — consolider la France avant l'international."),
    Bullet("Partenariats locaux avant tout — refus du modèle parachutage."),
    Bullet("Conformité absolue — adaptation aux cadres juridiques locaux."),
    Bullet("Cohérence éthique — refus des marchés où nos valeurs ne peuvent s'appliquer."),
    Bullet("Profitabilité prouvée — chaque marché doit être rentable au bout de 24 mois."),

    H2("1.2. Refus structurés"),
    Bullet("Pas d'expansion en pays autoritaires ou de non-droit."),
    Bullet("Pas de modèle franchise / licence (cohérence âme Eventy)."),
    Bullet("Pas d'acquisition d'opérateur concurrent en An 1-3 (croissance organique)."),
    Bullet("Pas de marché où nous ne pouvons garantir le Pack Sérénité."),

    H1("2. Phases d'expansion"),

    H2("2.1. Phase 0 — Fondation France (An 1-2, 2026-2028)"),
    Bullet("Consolidation du marché français (HRA, créateurs, voyageurs)."),
    Bullet("Validation du modèle économique (rentabilité An 2)."),
    Bullet("Documentation processus stabilisée (cohérence ensemble du dispositif)."),
    Bullet("Atteinte ≥ 1 000 voyages opérés / an, ≥ 30 000 voyageurs cumul."),

    H2("2.2. Phase 1 — Frontaliers Europe (An 2-3, 2028-2029)"),
    Bullet("Belgique francophone — proximité culturelle, base voyageur Eventy déjà active."),
    Bullet("Suisse romande — segment premium, fort pouvoir d'achat."),
    Bullet("Luxembourg — petit marché mais pouvoir d'achat élevé."),
    Bullet("Site disponible en français + EN."),
    Bullet("Capacité de réservation depuis ces 3 pays (paiement local, support email)."),

    H2("2.3. Phase 2 — Europe étendue (An 3-4, 2029-2030)"),
    Bullet("Espagne — gros marché, langue ES, accès direct."),
    Bullet("Italie — gros marché, complémentaire avec destinations italiennes du catalogue."),
    Bullet("Portugal — petit marché mais croissance forte."),
    Bullet("Pays-Bas — anglophone, francophile, segment premium."),
    Bullet("Site multilingue EN + ES + IT + PT + NL."),
    Bullet("Création d'antennes locales (1 personne dédiée par pays cible)."),

    H2("2.4. Phase 3 — Europe totale (An 5-6, 2031-2032)"),
    Bullet("Allemagne — gros marché B2B."),
    Bullet("Royaume-Uni (post-Brexit, encadrement spécifique)."),
    Bullet("Pays nordiques (Danemark, Suède, Norvège)."),
    Bullet("Europe centrale (Pologne, République tchèque, Autriche)."),

    H2("2.5. Phase 4 — Marchés extra-européens (An 7+, 2033+)"),
    Bullet("Canada (Québec francophone en priorité)."),
    Bullet("Marchés émergents asiatiques (à étudier)."),
    Bullet("Pas d'États-Unis avant maturation totale du modèle (cadre fragmenté)."),

    H1("3. Adaptation par marché"),

    H2("3.1. Adaptation linguistique"),
    Bullet("Site multilingue (cohérence Roadmap technique)."),
    Bullet("Traductions humaines (pas de machine translation pour les contenus contractuels)."),
    Bullet("Adaptation culturelle des contenus (ton, références, exemples)."),
    Bullet("Support client multilingue (priorité : EN, ES, IT, DE)."),

    H2("3.2. Adaptation juridique"),
    Bullet("Conformité aux réglementations tourisme locales (équivalents Atout France)."),
    Bullet("Garanties financières locales (équivalents APST)."),
    Bullet("CGV adaptées par pays (avec validation avocat local)."),
    Bullet("Droit applicable : droit français pour le contrat principal, droit local pour les recours consommateurs."),
    Bullet("Cohérence avec directive UE 2015/2302 (forfaits touristiques)."),

    H2("3.3. Adaptation fiscale"),
    Bullet("TVA marge applicable dans tous les pays UE (régime tourisme)."),
    Bullet("Accompagnement expert-comptable spécialisé international (cohérence Note expert-comptable)."),
    Bullet("Transfer pricing si entités juridiques distinctes créées."),
    Bullet("Conventions fiscales internationales respectées."),

    H2("3.4. Adaptation paiement"),
    Bullet("Stripe Connect multi-devise."),
    Bullet("Modes locaux (iDEAL Pays-Bas, Bancontact Belgique, etc.)."),
    Bullet("RIB local possible pour les voyageurs."),

    H1("4. Modèle organisationnel international"),

    H2("4.1. Phase 1 (frontaliers)"),
    Bullet("Pas de filiale locale — opérations depuis France."),
    Bullet("Site multilingue, support multilingue."),
    Bullet("Partenariats HRA locaux via les créateurs Eventy."),

    H2("4.2. Phase 2 (Europe étendue)"),
    Bullet("Antennes locales : 1 country manager + 1 chargé(e) opérations par pays cible."),
    Bullet("Pas encore de filiale juridique — bureau de représentation."),
    Bullet("Recrutement local prioritaire (cohérence Procédure de recrutement)."),

    H2("4.3. Phase 3-4 (Europe totale + extra-européen)"),
    Bullet("Filiales juridiques par pays ou région."),
    Bullet("Équipes locales étoffées."),
    Bullet("Maintien de la cohérence opérationnelle via charte commune."),

    H1("5. Indicateurs d'expansion"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Indicateur", "An 3", "An 5", "An 7"],
      rows: [
        ["Pays opérés", "1", "5-7", "10-12"],
        ["% CA international", "≥ 5 %", "≥ 25 %", "≥ 40 %"],
        ["Antennes locales", "0", "3-5", "8-10"],
        ["Voyageurs étrangers / an", "≥ 500", "≥ 5 000", "≥ 25 000"],
        ["Langues du site", "FR + EN", "5 langues", "8 langues"],
        ["Délai rentabilité par marché", "—", "≤ 24 mois", "≤ 18 mois"],
      ],
    }),

    H1("6. Risques et mitigations"),

    H2("6.1. Risques identifiés"),
    Bullet("Diversion managériale (équipe trop sollicitée par l'international au détriment de la France)."),
    Bullet("Risque réglementaire (méconnaissance droit local)."),
    Bullet("Risque culturel (modèle Eventy mal adapté à un marché)."),
    Bullet("Risque financier (BFR augmenté, trésorerie mobilisée)."),
    Bullet("Risque sécurité (Pack Sérénité difficile à assurer dans certaines zones)."),

    H2("6.2. Mitigations"),
    Bullet("Consolidation France avant chaque nouvelle phase."),
    Bullet("Avocat tourisme spécialisé par grand marché (consultation préalable systématique)."),
    Bullet("Recrutement local avec compréhension culturelle."),
    Bullet("Levées de fonds adaptées aux phases (cohérence Pacte associés Seed et Term Sheet)."),
    Bullet("Refus pré-validé des marchés où le Pack Sérénité ne peut être garanti."),

    H1("7. Engagements éthiques d'expansion"),
    Bullet("Refus de l'expansion à tout prix — la rentabilité durable prime."),
    Bullet("Refus des marchés autoritaires ou en non-respect des droits humains."),
    Bullet("Refus du dumping social ou fiscal entre filiales."),
    Bullet("Refus des pratiques de néo-colonialisme touristique (extraction sans réinvestissement local)."),
    Bullet("Engagement à recruter localement et à payer juste."),
    Bullet("Engagement à respecter les législations locales (sans optimisation agressive)."),

    H1("8. Suivi et gouvernance"),
    Bullet("Comité d'expansion trimestriel (Président + investisseurs principaux + 1 expert externe)."),
    Bullet("Revue annuelle du plan."),
    Bullet("Décisions GO/NOGO formelles à chaque nouvelle phase."),
    Bullet("Reporting mensuel par marché actif."),
    Bullet("Cohérence avec Pacte associés Seed (décisions de gouvernance soumises à droit de veto)."),

    Spacer(160),
    P("Document de référence interne et investisseur — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Dossier investisseur, Roadmap technique, Pacte associés Seed, Term Sheet Seed, Politique RSE, Note expert-comptable, Politique anti-corruption.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — STRATÉGIE RELATIONS PRESSE
// ============================================================
function strategieRelationsPress() {
  return [
    bandeauTitre(
      "STRATÉGIE RELATIONS PRESSE EVENTY LIFE",
      "Approche médias et plan de communication corporate",
    ),
    Spacer(160),

    P("La présente stratégie formalise l'approche d'EVENTY LIFE SAS en matière de relations presse et médias. Elle complète le Dossier presse Eventy (kit de référence), la Procédure de gestion de crise communication et la Charte éditoriale. Elle vise à construire une notoriété médiatique sincère, durable, et alignée sur les valeurs Eventy.", { italics: true }),

    P("Eventy ne cherche pas la couverture médiatique pour la couverture. Nous parlons aux journalistes quand nous avons quelque chose d'utile, vrai, et qui sert nos voyageurs et notre écosystème. Nous refusons les coups médiatiques creux et les annonces gonflées.", { italics: true }),

    H1("1. Objectifs"),

    H2("1.1. Objectifs prioritaires"),
    Bullet("Faire connaître l'offre Eventy au grand public (média grand public et tourisme)."),
    Bullet("Établir la crédibilité d'Eventy auprès des partenaires institutionnels."),
    Bullet("Soutenir la levée de fonds (média économique et professionnel)."),
    Bullet("Recruter (visibilité employeur)."),
    Bullet("Faire entendre une voix singulière sur le tourisme durable et solidaire."),

    H2("1.2. Objectifs secondaires"),
    Bullet("Influencer le débat sectoriel (transparence des prix, économie circulaire)."),
    Bullet("Dialoguer avec les autorités (Atout France, ministère, parlementaires)."),
    Bullet("Construire un réseau de journalistes alignés."),

    H1("2. Audiences cibles"),

    H2("2.1. Médias prioritaires (5 segments)"),
    makeTable({
      widths: [2496, 3744, 3120],
      header: ["Segment", "Exemples", "Angle pour Eventy"],
      rows: [
        ["Tourisme", "TourMaG, l'Écho touristique, Voyages-d'affaires", "Modèle distribué, transparence prix, modèle voyage de groupe"],
        ["Économique", "Les Échos, La Tribune, Maddyness, BFM Business", "Levée de fonds, modèle économique, JEI, souveraineté numérique"],
        ["Grand public", "Le Monde, Libération, Le Parisien, Ouest-France", "Voyage solidaire, lutte contre la solitude, économie circulaire"],
        ["Lifestyle / voyage", "Géo, National Geographic FR, Voyages SNCF, blogs voyage", "Témoignages voyageurs, destinations originales"],
        ["Tech / startup", "FrenchWeb, Maddyness, Numerama", "Plateforme propriétaire, JEI, cybersécurité, RGPD"],
      ],
    }),

    H2("2.2. Influenceurs cibles"),
    Bullet("Influenceurs voyage (cohérence Code conduite ambassadeurs)."),
    Bullet("Journalistes spécialisés tourisme."),
    Bullet("Personnalités économie sociale et solidaire."),
    Bullet("Élus territoriaux engagés (départements ruraux, économie locale)."),

    H1("3. Cinq angles éditoriaux"),
    P("Cohérence avec le Dossier presse Eventy. Cinq récits différenciants :"),
    Numbered("**Souveraineté économique** — Eventy soutient les indépendants français (HRA, créateurs, vendeurs) plutôt que les grands tour-opérateurs internationaux."),
    Numbered("**Transparence radicale des prix** — chaque euro tracé sur la fiche voyage, position rare dans le secteur."),
    Numbered("**Voyage comme bien public** — accessibilité (PMR, ANCV), refus du surtourisme, économie redistributive."),
    Numbered("**Autodidacte 1M+ lignes de code** — David Eventy a construit la plateforme propriétaire, posture singulière dans le tourisme."),
    Numbered("**Tourisme social et redistributif** — modèle 5 % HT vendeurs + 3 pts créateurs, marges socle Eventy raisonnables, refus extractif."),

    H1("4. Plan d'actions presse"),

    H2("4.1. An 1 (2026-2027) — Émergence"),
    Bullet("Communiqué de presse de lancement (T2 An 1) — destiné aux médias tourisme et économie."),
    Bullet("Tribune signée David Eventy sur transparence des prix (média grand public)."),
    Bullet("Interview David Eventy en podcast tech ou tourisme (1-2 par trimestre)."),
    Bullet("Présence à 1-2 salons tourisme (IFTM Top Resa principalement)."),
    Bullet("Couverture de levée de fonds Seed (T3-T4 An 1)."),

    H2("4.2. An 2 (2027-2028) — Notoriété"),
    Bullet("Voyages presse organisés (1 par trimestre, format light)."),
    Bullet("Interview/portrait David Eventy dans média majeur (Les Échos, Le Monde, etc.)."),
    Bullet("Organisation de l'anniversaire 1 an Eventy (événement public)."),
    Bullet("Soutien à des événements sectoriels (conférences tourisme durable)."),

    H2("4.3. An 3+ (2028+) — Voix d'autorité"),
    Bullet("Tribunes régulières du Président sur sujets sectoriels."),
    Bullet("Auditions parlementaires éventuelles."),
    Bullet("Publications de rapports thématiques (transparence prix, surtourisme)."),
    Bullet("Présence comme orateur à des conférences internationales."),

    H1("5. Modalités de communication presse"),

    H2("5.1. Communiqué de presse"),
    Bullet("Format court (1-2 pages maximum)."),
    Bullet("Information factuelle, citée, sourcée."),
    Bullet("Citations courtes du Président."),
    Bullet("Embargo si nécessaire (négocié au cas par cas)."),
    Bullet("Diffusion par email aux journalistes ciblés (pas de mass mailing)."),
    Bullet("Téléchargement disponible sur eventylife.fr/presse."),

    H2("5.2. Interview / portrait"),
    Bullet("Préparation systématique (briefing, anticipation des questions)."),
    Bullet("Validation des citations avant publication (sauf clause contraire négociée)."),
    Bullet("Disponibilité du Président pour les médias (priorité haute)."),
    Bullet("Cohérence avec Charte éditoriale (ton, vocabulaire)."),

    H2("5.3. Voyage presse"),
    Bullet("Format light : 2-3 nuits, 1 destination Eventy."),
    Bullet("Invitation 4-6 journalistes maximum."),
    Bullet("Coût pris en charge par Eventy."),
    Bullet("Mention transparente « voyage offert par Eventy »."),
    Bullet("Pas d'obligation de publication positive."),

    H2("5.4. Événement presse"),
    Bullet("Anniversaire annuel Eventy (juin) — événement ouvert à la presse."),
    Bullet("Organisation conférence de presse à chaque grande annonce (levée, partenariat majeur)."),
    Bullet("Cohérence avec Plan marketing An 1."),

    H1("6. Gestion des demandes média"),
    Bullet("Email dédié : presse@eventylife.fr."),
    Bullet("Réponse sous 24 h ouvrées."),
    Bullet("Prise en charge directe par le Président (jusqu'à recrutement RP)."),
    Bullet("Recrutement responsable RP en An 2 (interne ou agence externe)."),

    H1("7. Mesure de l'impact"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Articles dans la presse / an", "≥ 20", "≥ 100"],
        ["Tribunes signées par David Eventy", "≥ 2", "≥ 6"],
        ["Voyages presse organisés", "≥ 1", "≥ 4"],
        ["Interventions audiovisuelles", "≥ 5", "≥ 20"],
        ["Mentions positives / mentions totales", "≥ 80 %", "≥ 90 %"],
        ["Trafic site issu de la presse", "≥ 5 %", "≥ 12 %"],
      ],
    }),

    H1("8. Liens avec les autres dispositifs"),
    Bullet("Cohérence Charte éditoriale (ton)."),
    Bullet("Cohérence Procédure de gestion de crise communication (gestion des sujets sensibles)."),
    Bullet("Cohérence Code de conduite ambassadeurs (programme parallèle)."),
    Bullet("Cohérence Politique RSE (engagement sociétal mis en avant)."),
    Bullet("Cohérence Politique avis voyageurs (témoignages)."),

    H1("9. Engagements éthiques RP"),
    Bullet("Refus du publi-rédactionnel camouflé."),
    Bullet("Refus de l'achat d'articles."),
    Bullet("Refus des partenariats avec médias contraires aux valeurs."),
    Bullet("Transparence sur les voyages presse (mention obligatoire)."),
    Bullet("Honnêteté absolue dans les informations transmises (pas de chiffres gonflés, pas de promesses non tenues)."),
    Bullet("Refus du off the record manipulateur (off informant uniquement)."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Dossier presse Eventy, Charte éditoriale, Procédure gestion de crise communication, Code conduite ambassadeurs, Politique RSE, Plan marketing An 1, Politique avis voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN DE PARTENARIATS INSTITUTIONNELS
// ============================================================
function planPartenariatsInstitutionnels() {
  return [
    bandeauTitre(
      "PLAN DE PARTENARIATS INSTITUTIONNELS",
      "Cartographie et stratégie d'alliances avec les acteurs publics et professionnels",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'EVENTY LIFE SAS en matière de partenariats avec les acteurs institutionnels du tourisme et de l'économie en France et au-delà. Il s'inscrit dans une logique de cohérence avec les engagements RSE, la Politique d'achats responsables et la Stratégie de relations presse.", { italics: true }),

    P("Pour Eventy, un partenariat institutionnel n'est pas un effet d'annonce. C'est une relation durable, construite sur la confiance, l'utilité réciproque et l'alignement de valeurs. Nous privilégions la qualité à la quantité — un partenariat actif vaut mieux que dix partenariats endormis.", { italics: true }),

    H1("1. Cartographie des acteurs cibles"),

    H2("1.1. Régulateurs et autorités"),
    Bullet("Atout France — agence de développement touristique (cohérence IM)."),
    Bullet("APST — garant financier (cohérence garantie)."),
    Bullet("DGCCRF — Direction concurrence consommation (veille réglementaire)."),
    Bullet("CNIL — protection des données (cohérence RGPD)."),
    Bullet("Ministère du Tourisme / Ministère de l'Économie."),

    H2("1.2. Syndicats professionnels"),
    Bullet("UMIH — Union des Métiers et des Industries de l'Hôtellerie (HRA hôteliers)."),
    Bullet("GNI — Groupement National des Indépendants (restaurants)."),
    Bullet("ENTREPRISES DU VOYAGE — fédération opérateurs."),
    Bullet("Syndicat National des Agences de Voyages (SNAV)."),
    Bullet("API — Association Pour l'Insertion (économie sociale et solidaire)."),

    H2("1.3. Offices de tourisme et collectivités"),
    Bullet("ADN Tourisme — fédération des offices de tourisme et CRT."),
    Bullet("Comités Régionaux du Tourisme (CRT) — partenaires régionaux."),
    Bullet("Comités Départementaux du Tourisme (CDT)."),
    Bullet("Régions Île-de-France, Occitanie, PACA, Bretagne (priorités An 1-2)."),
    Bullet("Métropoles d'accueil voyages Eventy (Paris, Lyon, Marseille, Bordeaux)."),

    H2("1.4. Tourisme social et associations"),
    Bullet("ANCV — Agence Nationale pour les Chèques-Vacances."),
    Bullet("Tourisme et Handicap (label national)."),
    Bullet("APF France handicap (cohérence Politique accessibilité PMR)."),
    Bullet("UNAT — Union Nationale des Associations de Tourisme."),
    Bullet("Acteurs Tourisme Durable (ATR — fédération éco-tourisme)."),

    H2("1.5. Acteurs économiques territoriaux"),
    Bullet("Bpifrance (cohérence Dossier subventions publiques)."),
    Bullet("CCI — Chambres de Commerce et d'Industrie."),
    Bullet("CMA — Chambres de Métiers et de l'Artisanat."),
    Bullet("Banque des Territoires."),
    Bullet("FrenchTech (cohérence statut JEI)."),

    H2("1.6. Acteurs européens et internationaux"),
    Bullet("ETOA — European Tourism Association."),
    Bullet("ECTAA — European Travel Agents and Tour Operators Associations."),
    Bullet("OMT — Organisation Mondiale du Tourisme (long terme)."),
    Bullet("UNESCO — pour destinations classées (long terme)."),

    H1("2. Niveaux d'engagement"),

    H2("2.1. Niveau 1 — Adhésion / représentation"),
    Bullet("Adhésion en tant que membre (cotisation annuelle)."),
    Bullet("Présence aux assemblées générales et événements."),
    Bullet("Réception des publications et veille."),
    Bullet("Participation à des groupes de travail thématiques."),

    H2("2.2. Niveau 2 — Partenariat opérationnel"),
    Bullet("Convention de partenariat formalisée."),
    Bullet("Échanges de visibilité (logo réciproque, mention sur supports)."),
    Bullet("Co-construction de programmes voyage (ex : avec un CRT)."),
    Bullet("Participation à des actions communes (salons, conférences)."),

    H2("2.3. Niveau 3 — Partenariat stratégique"),
    Bullet("Convention de partenariat structurée pluriannuelle."),
    Bullet("Engagement de volumes (ex : ≥ N voyageurs/an sur région partenaire)."),
    Bullet("Co-marketing (campagnes partagées, événements communs)."),
    Bullet("Représentation d'Eventy dans les instances décisionnelles du partenaire."),

    H1("3. Plan d'actions par grand acteur"),

    H2("3.1. Atout France"),
    Bullet("Phase 1 — Immatriculation (cohérence document IM, T2 An 1)."),
    Bullet("Phase 2 — Présence aux Workshops Atout France (an 1+)."),
    Bullet("Phase 3 — Contribution aux études sectorielles (an 2+)."),
    Bullet("Phase 4 — Représentation dans groupes de travail (an 3+)."),

    H2("3.2. APST"),
    Bullet("Phase 1 — Adhésion et garantie financière (T2 An 1)."),
    Bullet("Phase 2 — Reporting trimestriel rigoureux."),
    Bullet("Phase 3 — Participation aux commissions APST (an 3+)."),

    H2("3.3. UMIH et GNI"),
    Bullet("Approche au lancement avec présentation Eventy (T3 An 1)."),
    Bullet("Adhésion aux fédérations partenaires en An 2."),
    Bullet("Co-construction de bonnes pratiques voyages de groupe."),

    H2("3.4. CRT régionaux"),
    Bullet("Approche systématique pour chaque région ayant ≥ 2 voyages Eventy."),
    Bullet("Convention de partenariat pour 5 régions prioritaires en An 1-2."),
    Bullet("Cohérence avec stratégie destinations (cohérence Grille de décision destinations)."),

    H2("3.5. ANCV"),
    Bullet("Demande d'agrément acceptation chèques-vacances en An 2."),
    Bullet("Communication sur l'acceptation auprès des voyageurs."),
    Bullet("Cohérence avec engagement social Eventy (cohérence Politique RSE)."),

    H2("3.6. Tourisme et Handicap"),
    Bullet("Demande de label national en An 2 (cohérence Politique accessibilité PMR)."),
    Bullet("Audit obligatoire pour obtention."),
    Bullet("Communication transparente sur le niveau de label obtenu."),

    H2("3.7. Bpifrance"),
    Bullet("Approche dès la création SAS (cohérence Dossier subventions publiques)."),
    Bullet("Demandes de prêts et subventions selon dispositifs adaptés."),
    Bullet("Participation aux événements écosystème Bpifrance."),

    H1("4. Calendrier 3 ans"),
    makeTable({
      widths: [3744, 5616],
      header: ["Période", "Partenariats à formaliser"],
      rows: [
        ["T2 An 1", "Atout France IM, APST, RC Pro Tourisme, Bpifrance contact initial"],
        ["T3 An 1", "Approche UMIH, GNI, premier CRT régional, FrenchTech (JEI)"],
        ["T4 An 1", "Adhésion CCI / CMA, demandes subventions"],
        ["An 2 (T1-T2)", "ANCV agrément, Tourisme et Handicap audit, ATR adhésion"],
        ["An 2 (T3-T4)", "Conventions CRT 3-5 régions prioritaires, UNAT"],
        ["An 3", "ETOA Europe, partenariats internationaux, conventions stratégiques régionales"],
      ],
    }),

    H1("5. Indicateurs partenariats"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Adhésions actives", "≥ 5", "≥ 15"],
        ["Conventions formalisées", "≥ 1", "≥ 8"],
        ["Régions partenaires (CRT)", "0", "≥ 5"],
        ["Labels obtenus", "0", "≥ 2 (Tourisme et Handicap, ATR)"],
        ["Acceptation ANCV", "—", "Oui"],
        ["Représentation dans instances", "0", "≥ 3"],
      ],
    }),

    H1("6. Modalités d'engagement"),

    H2("6.1. Validation"),
    Bullet("Toute nouvelle adhésion / convention validée par le Président."),
    Bullet("Au-delà de 5 K€ annuels : information préalable au Comité de direction."),
    Bullet("Au-delà de 25 K€ annuels : information aux investisseurs (cohérence Pacte associés Seed)."),

    H2("6.2. Suivi"),
    Bullet("Tableau de bord trimestriel des partenariats actifs."),
    Bullet("Évaluation annuelle de l'utilité (rapport coût/bénéfice)."),
    Bullet("Possibilité de désengagement si partenariat dormant."),

    H2("6.3. Représentation"),
    Bullet("Le Président David Eventy représente Eventy aux assemblées et instances stratégiques."),
    Bullet("Délégation possible à un membre équipe pour les groupes de travail opérationnels."),

    H1("7. Engagements éthiques"),
    Bullet("Refus de toute pratique de lobbying contraire à l'intérêt général."),
    Bullet("Refus des partenariats utilitaires sans alignement de valeurs."),
    Bullet("Transparence sur les conventions signées (publication sur site si demande)."),
    Bullet("Refus du favoritisme et des conflits d'intérêts (cohérence Politique conflits d'intérêts)."),
    Bullet("Engagement à signaler les pratiques contraires aux règles dans les instances partenaires."),

    H1("8. Outils support"),
    Bullet("Convention-type de partenariat (à élaborer en An 1)."),
    Bullet("Mémo de présentation Eventy (résumé 1 page)."),
    Bullet("Pitch-deck partenariats (variante du Dossier investisseur)."),
    Bullet("Rapport d'impact social et économique annuel (à partir An 2)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Dossier subventions publiques, Politique RSE, Politique d'achats responsables, Politique accessibilité PMR, Stratégie relations presse, Pacte associés Seed, Politique conflits d'intérêts.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Plan-Expansion-Internationale.docx",
      title: "Eventy Life — Plan d'expansion internationale",
      description: "Stratégie pluriannuelle d'expansion Europe et international.",
      footer: "EVENTY LIFE SAS — Plan expansion internationale",
      children: planExpansionInternationale(),
    },
    {
      file: "docs/garanties/Eventy-Life-Strategie-Relations-Presse.docx",
      title: "Eventy Life — Stratégie relations presse et médias",
      description: "Approche médias et plan de communication corporate.",
      footer: "EVENTY LIFE SAS — Stratégie relations presse",
      children: strategieRelationsPress(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Partenariats-Institutionnels.docx",
      title: "Eventy Life — Plan de partenariats institutionnels",
      description: "Stratégie d'alliances avec acteurs publics et professionnels.",
      footer: "EVENTY LIFE SAS — Plan partenariats institutionnels",
      children: planPartenariatsInstitutionnels(),
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
