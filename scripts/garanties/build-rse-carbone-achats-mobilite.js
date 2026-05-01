/**
 * Eventy Life — Trois documents RSE détaillée
 *
 *   1. Charte d'engagement carbone Eventy
 *   2. Politique d'achats responsables
 *   3. Plan de mobilité durable (collaborateurs + voyageurs)
 *
 * Usage : node scripts/garanties/build-rse-carbone-achats-mobilite.js
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
// DOCUMENT 1 — CHARTE D'ENGAGEMENT CARBONE
// ============================================================
function charteCarbone() {
  return [
    bandeauTitre(
      "CHARTE D'ENGAGEMENT CARBONE EVENTY LIFE",
      "Mesurer, réduire, contribuer — feuille de route bas-carbone du voyage de groupe",
    ),
    Spacer(160),

    P("La présente charte formalise l'engagement carbone d'EVENTY LIFE SAS sur l'ensemble de son activité d'opérateur de voyages de groupe. Elle complète la Politique RSE Eventy (pilier environnemental) en précisant la méthodologie de mesure, la trajectoire de réduction et les modalités de contribution carbone.", { italics: true }),

    P("Eventy reconnaît que l'industrie touristique contribue significativement aux émissions de gaz à effet de serre (estimation GIEC : 8-11 % des émissions mondiales en cycle de vie). Plutôt que d'éluder ce sujet, Eventy choisit de le regarder en face, de mesurer, de réduire ce qui peut l'être structurellement, et de contribuer pour le résiduel.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Accord de Paris (2015) — limitation du réchauffement à 1,5 °C."),
    Bullet("Stratégie Nationale Bas-Carbone (SNBC) française."),
    Bullet("Loi Climat et Résilience (22 août 2021)."),
    Bullet("Méthodologie ADEME Bilan Carbone — cadre référent."),
    Bullet("Norme ISO 14064 — quantification des gaz à effet de serre."),
    Bullet("GHG Protocol — Scope 1 / 2 / 3."),
    Bullet("Référentiels secteur tourisme : ATR (Acteurs du Tourisme Durable), MyClimate, Greenly."),

    H1("2. Périmètre du Bilan Carbone Eventy"),

    H2("2.1. Scope 1 — émissions directes"),
    Bullet("Aucune émission directe significative — Eventy n'opère pas de flotte propre, ne possède pas de chaudière fioul/gaz."),
    Bullet("Estimation indicative : < 1 % des émissions totales."),

    H2("2.2. Scope 2 — émissions indirectes énergétiques"),
    Bullet("Électricité des bureaux (consommation maîtrisée — peu de bureaux, télétravail)."),
    Bullet("Cible : approvisionnement 100 % énergie renouvelable d'ici An 2 (EDF Vert ou équivalent)."),
    Bullet("Estimation indicative : < 2 % des émissions totales."),

    H2("2.3. Scope 3 — émissions indirectes de la chaîne de valeur"),
    P("La majorité (> 95 %) des émissions Eventy provient du Scope 3, principalement :"),
    Bullet("Transport des voyageurs (autocar, avion, train) — poste majeur."),
    Bullet("Hébergement (énergie des hôtels)."),
    Bullet("Restauration (cycle alimentaire des repas servis)."),
    Bullet("Activités (transport sur place, énergie des sites)."),
    Bullet("Dans une moindre mesure : déplacements équipe, hébergement plateforme numérique, consommables siège."),

    H1("3. Méthodologie de mesure"),

    H2("3.1. Mesure par voyage"),
    Bullet("Calcul automatisé pour chaque voyage opéré, dès An 1."),
    Bullet("Données collectées : km parcourus, mode de transport, type d'hébergement (étoiles, classification énergétique), nombre de repas, nature des repas, activités."),
    Bullet("Facteurs d'émission ADEME (mis à jour annuellement)."),
    Bullet("Restitution sur la fiche voyage : émissions estimées par voyageur."),

    H2("3.2. Bilan annuel consolidé"),
    Bullet("Bilan Carbone complet réalisé chaque année (avec accompagnement cabinet partenaire dès An 2)."),
    Bullet("Publication transparente sur eventylife.fr/rse."),
    Bullet("Reporting investisseurs et APST."),

    H1("4. Trajectoire de réduction (engagements chiffrés)"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Indicateur", "An 1 (réf.)", "An 3", "An 5"],
      rows: [
        ["Émissions / voyageur (kg CO2eq)", "[Réf.]", "−15 %", "−30 %"],
        ["Part transport bas-carbone (autocar, train)", "≥ 80 %", "≥ 90 %", "≥ 95 %"],
        ["Part vols dans transport voyageurs", "≤ 15 %", "≤ 8 %", "≤ 3 %"],
        ["HRA partenaires audit énergétique", "≥ 30 %", "≥ 60 %", "≥ 90 %"],
        ["Repas avec produits locaux/saison", "≥ 60 %", "≥ 80 %", "≥ 90 %"],
        ["Plateforme numérique 100 % énergie renouvelable", "Oui", "Oui", "Oui"],
        ["Bureaux énergie renouvelable", "Cible An 2", "100 %", "100 %"],
      ],
    }),

    H1("5. Plan d'action — réduire ce qui peut l'être"),

    H2("5.1. Transport voyageurs (poste prioritaire)"),
    Bullet("Privilégier l'autocar pour les destinations < 1 500 km (4× moins émetteur que l'avion par voyageur)."),
    Bullet("Promouvoir le train pour destinations européennes desservies (4× moins émetteur que l'avion)."),
    Bullet("Refuser les vols court-courriers < 4 h sur destinations accessibles autrement."),
    Bullet("Pour vols nécessaires : favoriser compagnies fuel-efficient, vols directs."),
    Bullet("Optimiser le taux de remplissage des autocars (≥ 85 % cible An 2)."),
    Bullet("Étudier le passage à l'autocar électrique / au biocarburant à partir d'An 3."),

    H2("5.2. Hébergement"),
    Bullet("Privilégier les HRA disposant d'un classement énergétique (Clef Verte, Écolabel européen, Green Globe)."),
    Bullet("Inscrire des critères environnementaux dans la procédure d'audit qualité HRA (cohérence Charte fournisseurs)."),
    Bullet("Refuser les hébergements aux pratiques manifestement énergivores (climatisation toujours active dans pays tempéré, etc.)."),
    Bullet("Encourager les HRA partenaires à passer en énergie renouvelable (programme d'accompagnement An 2-3)."),

    H2("5.3. Restauration"),
    Bullet("Privilégier les restaurants travaillant en circuit court (rayon < 100 km)."),
    Bullet("Encourager les menus alternatifs (option végétarienne / végétalienne systématique)."),
    Bullet("Lutter contre le gaspillage (portionnement adapté, dons aux associations)."),
    Bullet("Limiter les viandes rouges importées (préférer volaille, poisson local, légumes)."),

    H2("5.4. Activités"),
    Bullet("Privilégier les activités à faible empreinte (visites pédestres, vélo, randonnée)."),
    Bullet("Limiter les activités énergivores (jet-ski, quad, hélicoptère — uniquement sur demande spécifique avec information transparente)."),
    Bullet("Inclure une activité « engagement local » par voyage (rencontre artisan, visite ferme, action environnementale)."),

    H2("5.5. Plateforme numérique"),
    Bullet("Hébergement Scaleway France (data centers refroidissement adiabatique, mix énergétique faible carbone)."),
    Bullet("Optimisation de la consommation des pages (poids ≤ 1 Mo, pas de vidéos auto-play, images compressées WebP/AVIF)."),
    Bullet("Pas de cryptomonnaie, pas de NFT, pas d'IA générative gourmande sans nécessité."),
    Bullet("Cible 1by1 GHG / page chargée."),

    H2("5.6. Équipe et bureaux"),
    Bullet("Télétravail prioritaire (cohérence Charte télétravail) — réduit les déplacements quotidiens."),
    Bullet("Bureaux compacts, optimisés (flex office, mutualisation)."),
    Bullet("Déplacements professionnels en train si trajet < 4 h, vols évités, visioconférence privilégiée."),
    Bullet("Forfait mobilité durable pour collaborateurs (vélo, covoiturage)."),

    H1("6. Contribution carbone (compensation responsable)"),

    H2("6.1. Principes"),
    Bullet("Eventy refuse l'effet « blanchiment » du tout-compensation : l'objectif premier est de réduire."),
    Bullet("La compensation est une démarche complémentaire, transparente, vérifiée."),
    Bullet("Choix de projets vérifiés par standards reconnus (Verra, Gold Standard, Label Bas-Carbone français)."),

    H2("6.2. Modalités"),
    Bullet("À compter d'An 2 : compensation des émissions résiduelles non réductibles (Scope 1 + 2 + déplacements équipe)."),
    Bullet("À compter d'An 3 : option voyageur de compensation du voyage (en supplément volontaire au tarif, transparent)."),
    Bullet("Tarification transparente : prix tonne CO2eq publié, pas de marge cachée."),
    Bullet("Privilégier les projets français (Label Bas-Carbone agriculture, forêt, sols)."),

    H2("6.3. Engagement de transparence"),
    Bullet("Publication annuelle du tonnage compensé et des projets soutenus."),
    Bullet("Liens publics vers les certificats."),
    Bullet("Pas de communication marketing « voyage neutre en carbone » avant An 5 (rigueur conceptuelle)."),

    H1("7. Communication et sensibilisation"),
    Bullet("Information précontractuelle voyageur : émissions estimées du voyage choisi."),
    Bullet("Roadbook voyageur : éco-gestes simples sur place (eau, énergie, déchets)."),
    Bullet("Onboarding équipe : module sensibilisation carbone (1h) la première semaine."),
    Bullet("Newsletter mensuelle : un sujet RSE/carbone tous les trimestres."),
    Bullet("Page eventylife.fr/rse mise à jour avec bilans détaillés."),

    H1("8. Gouvernance et reporting"),
    Bullet("Référent RSE désigné en An 2 (rattaché au Président)."),
    Bullet("Comité RSE trimestriel (Président + référent + un voyageur Famille volontaire)."),
    Bullet("Rapport annuel intégré aux comptes (annexé au rapport de gestion)."),
    Bullet("Ouverture progressive du reporting (cible CSRD si seuils atteints en An 4-5)."),

    H1("9. Engagements opposables Eventy"),
    P("Eventy s'engage formellement à :"),
    Bullet("Mesurer chaque voyage en émissions CO2eq dès An 1."),
    Bullet("Publier un Bilan Carbone annuel et public dès An 2."),
    Bullet("Atteindre une réduction de 30 % des émissions / voyageur d'ici An 5 (vs An 1)."),
    Bullet("Refuser le greenwashing — pas de promesse non démontrée, pas de label sans audit."),
    Bullet("Compenser le résiduel non réductible dès An 2 sur projets vérifiés."),
    Bullet("Informer chaque voyageur des émissions estimées de son voyage."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE, Charte fournisseurs, Procédure audit qualité HRA, Politique d'achats responsables, Plan de mobilité durable.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE D'ACHATS RESPONSABLES
// ============================================================
function politiqueAchatsResponsables() {
  return [
    bandeauTitre(
      "POLITIQUE D'ACHATS RESPONSABLES EVENTY LIFE",
      "Sélection éthique et environnementale des fournisseurs et prestations",
    ),
    Spacer(160),

    P("La présente politique formalise les principes et modalités d'achats responsables d'EVENTY LIFE SAS. Elle s'applique à toutes les dépenses engagées au nom d'Eventy : prestations HRA (hôtels, restaurants, activités), services techniques (hébergement cloud, outils SaaS), achats divers (fournitures bureau, matériel équipe, événementiel).", { italics: true }),

    P("Cette politique opérationnalise les engagements RSE d'Eventy (pilier économique et environnemental) en posant des règles concrètes de sélection et d'évaluation des fournisseurs. Elle s'inscrit en cohérence avec la Charte fournisseurs et la Politique RSE.", { italics: true }),

    H1("1. Principes directeurs"),

    H2("1.1. Six principes fondamentaux"),
    Bullet("Préférence à la France et à l'Europe — souveraineté économique."),
    Bullet("Préférence aux circuits courts et aux acteurs locaux."),
    Bullet("Préférence aux entreprises avec engagement RSE structuré."),
    Bullet("Refus de toute pratique d'achat trompeuse ou de pression abusive sur les prix."),
    Bullet("Paiement à 30 jours fin de mois maximum (loi LME respectée systématiquement)."),
    Bullet("Transparence intégrale (chaque euro tracé, cohérence transparence prix Eventy)."),

    H2("1.2. Principe « équité économique »"),
    P("Eventy refuse les pratiques d'achat extractives. Pour chaque prestation HRA, Eventy applique une marge raisonnable (modèle PDG validé : pas de marge cachée, redistribution équitable). Les prix négociés laissent au partenaire HRA une marge suffisante pour vivre dignement et investir dans la qualité."),

    H1("2. Catégories d'achats Eventy"),

    H2("2.1. Achats récurrents structurants (> 80 % du volume)"),
    Bullet("Hébergement HRA (hôtels, gîtes, chambres d'hôtes)."),
    Bullet("Restauration HRA."),
    Bullet("Activités HRA (musées, guides, prestations expérientielles)."),
    Bullet("Transport voyageurs (autocaristes, transport ferroviaire, vols ponctuels)."),

    H2("2.2. Achats récurrents support (≤ 15 % du volume)"),
    Bullet("Hébergement plateforme (Scaleway France)."),
    Bullet("Outils SaaS (Stripe, Google Workspace, Slack/Teams, comptable, support client)."),
    Bullet("Honoraires des conseils externes (avocat, expert-comptable, DPO, RP)."),

    H2("2.3. Achats ponctuels (≤ 5 % du volume)"),
    Bullet("Matériel équipe (PC, casques, écrans)."),
    Bullet("Fournitures bureau."),
    Bullet("Événementiel (séminaires, soirées équipe)."),
    Bullet("Communication (impression, vidéo, site web)."),

    H1("3. Critères de sélection des fournisseurs"),

    H2("3.1. Grille de notation à 5 critères"),
    makeTable({
      widths: [2496, 2496, 2496, 1872],
      header: ["Critère", "Pondération", "Sources de notation", "Note minimale"],
      rows: [
        ["Qualité de la prestation", "30 %", "Audit qualité, références", "3/5"],
        ["Prix juste (rapport qualité/prix)", "20 %", "Comparatif marché, négociation", "3/5"],
        ["Engagement RSE", "20 %", "Charte signée, audit, certifications", "2/5"],
        ["Localisation France/Europe/local", "15 %", "Adresse siège + lieu prestation", "Obligatoire"],
        ["Solidité économique", "15 %", "Vérification Kbis, situation Banque de France", "Pas en procédure"],
      ],
    }),

    H2("3.2. Note minimale globale"),
    Bullet("Référencement initial : note pondérée minimale 3,5/5."),
    Bullet("Maintien dans le panel : note pondérée maintenue 3/5."),
    Bullet("Sortie du panel : 2 audits consécutifs < 3/5 ou défaut grave caractérisé."),

    H1("4. Critères RSE pour les fournisseurs HRA (focus)"),

    H2("4.1. Critères environnementaux"),
    Bullet("Classement énergétique de l'établissement (DPE, Clef Verte, Écolabel européen)."),
    Bullet("Politique de gestion des déchets (tri, recyclage, lutte gaspillage alimentaire)."),
    Bullet("Politique d'eau (économies, récupération eau de pluie)."),
    Bullet("Mobilier durable (provenance, longévité, réparation)."),
    Bullet("Restauration : approvisionnement local, saisonnalité, options végétariennes."),

    H2("4.2. Critères sociaux"),
    Bullet("Conditions de travail (respect Code du travail / lois locales)."),
    Bullet("Politique de non-discrimination."),
    Bullet("Salaires décents (vérification hors France au minimum salaire local + 10 %)."),
    Bullet("Engagement contre le harcèlement et les violences au travail."),

    H2("4.3. Critères de gouvernance"),
    Bullet("Engagement éthique formalisé."),
    Bullet("Lutte contre la corruption (cohérence Politique anti-corruption Eventy)."),
    Bullet("Respect des lois locales (fiscalité, urbanisme, sécurité)."),
    Bullet("Transparence sur la propriété et la gouvernance (refus paradis fiscaux)."),

    H1("5. Préférence territoriale et circuits courts"),

    H2("5.1. Hiérarchie des préférences"),
    Numbered("Local — fournisseur basé sur la destination du voyage (ex : restaurateur de la région visitée)."),
    Numbered("National (France) — fournisseur français."),
    Numbered("Européen — fournisseur dans l'UE/EEE."),
    Numbered("International — uniquement si aucune alternative locale, nationale ou européenne ne répond au besoin."),

    H2("5.2. Cas particulier — destinations internationales"),
    Bullet("Pour les voyages hors UE : sélection prioritaire de prestataires locaux (économie circulaire territoriale)."),
    Bullet("Refus des chaînes hôtelières internationales sans ancrage local pour les voyages exotiques."),
    Bullet("Préférence aux structures à taille humaine (hôtels indépendants, restaurants familiaux)."),

    H1("6. Achats numériques responsables"),
    Bullet("Hébergement plateforme : Scaleway France (préférence souveraine et bas-carbone)."),
    Bullet("Refus des outils dont les CGV impliquent un transfert des données voyageurs hors UE sans encadrement (Clauses Contractuelles Types ou décision d'adéquation)."),
    Bullet("Préférence aux outils open source ou européens chaque fois que possible."),
    Bullet("Refus des outils utilisant des modèles d'IA gourmands sans nécessité opérationnelle démontrée."),
    Bullet("Audit annuel des outils SaaS utilisés (volume, coût, alternative possible)."),

    H1("7. Modalités contractuelles avec les fournisseurs"),

    H2("7.1. Contrats"),
    Bullet("Contrat-cadre HRA Partenaire signé pour tout fournisseur récurrent (cohérence Contrat HRA Partenaire)."),
    Bullet("Devis signé pour les achats ponctuels > 1 000 € HT."),
    Bullet("Bon de commande pour les commandes opérationnelles (cohérence Bon de Commande HRA)."),
    Bullet("Annexe DPA RGPD si traitement de données personnelles (cohérence DPA Sous-traitance RGPD)."),

    H2("7.2. Engagements de paiement"),
    Bullet("Paiement à 30 jours fin de mois (loi LME — Code de commerce L441-10)."),
    Bullet("Paiement à 15 jours pour micro-entreprises locales (engagement renforcé Eventy)."),
    Bullet("Aucun retard de paiement injustifié toléré chez Eventy."),
    Bullet("Indicateur trimestriel de respect des délais de paiement (cible 100 %)."),

    H2("7.3. Anti-corruption"),
    Bullet("Aucun cadeau au moment de la négociation (cohérence Politique conflits d'intérêts)."),
    Bullet("Aucun pot-de-vin, aucune commission occulte."),
    Bullet("Refus de toute facturation gonflée ou rétro-commission illégale."),

    H1("8. Suivi et amélioration continue"),
    Bullet("Audit annuel des fournisseurs récurrents (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Tableau de bord trimestriel : fournisseurs, volumes, performance RSE, délais de paiement."),
    Bullet("Plan d'amélioration personnalisé pour les fournisseurs en deçà de 3,5/5."),
    Bullet("Programme « grow with Eventy » pour accompagner les HRA dans leur transition RSE (An 2-3)."),

    H1("9. Indicateurs achats responsables"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 5"],
      rows: [
        ["Part du volume d'achats France/Europe", "≥ 85 %", "≥ 95 %"],
        ["Part HRA avec charte fournisseurs signée", "100 %", "100 %"],
        ["Part HRA avec critère RSE ≥ 3/5", "≥ 50 %", "≥ 90 %"],
        ["Délai moyen de paiement (jours)", "≤ 25 j", "≤ 15 j"],
        ["Taux de respect engagement 30j fin mois", "≥ 98 %", "100 %"],
        ["Audits fournisseurs / an", "≥ 24", "≥ 200"],
      ],
    }),

    H1("10. Cas de désengagement fournisseur"),
    Bullet("Manquement caractérisé à la charte fournisseurs (note < 2/5)."),
    Bullet("Pratique commerciale trompeuse, fausse facture."),
    Bullet("Manquement éthique grave (corruption, discrimination, harcèlement avéré)."),
    Bullet("Procédure : audit, échange, plan d'action 90 jours, désengagement si non-conformité."),
    Bullet("Communication respectueuse, sans dénigrement public."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE, Charte fournisseurs, Procédure audit qualité HRA, Charte engagement carbone, Politique anti-corruption, Politique conflits d'intérêts, DPA Sous-traitance RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN DE MOBILITÉ DURABLE
// ============================================================
function planMobiliteDurable() {
  return [
    bandeauTitre(
      "PLAN DE MOBILITÉ DURABLE EVENTY LIFE",
      "Mobilité bas-carbone des collaborateurs et des voyageurs",
    ),
    Spacer(160),

    P("Le présent plan formalise les engagements et les actions concrètes d'EVENTY LIFE SAS pour favoriser la mobilité durable, à la fois pour ses collaborateurs (mobilité quotidienne et professionnelle) et pour ses voyageurs (transport vers les destinations).", { italics: true }),

    P("La mobilité représente le principal poste d'émissions de gaz à effet de serre d'un opérateur de voyages — c'est aussi celui sur lequel la marge d'action est la plus structurante. Eventy choisit d'être proactif : préférer le bas-carbone par défaut, refuser ce qui ne se justifie pas, et accompagner la transition de son écosystème.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Loi d'orientation des mobilités (LOM) du 24 décembre 2019."),
    Bullet("Forfait Mobilités Durables (FMD) — décret 2020-541."),
    Bullet("Plan Vélo et Marche (2018-2024) puis successeur."),
    Bullet("Stratégie Nationale Bas-Carbone (SNBC) — secteur transport."),
    Bullet("Loi Climat et Résilience (22 août 2021) — limitation des vols intérieurs court-courriers."),
    Bullet("Référentiels ADEME pour la mobilité quotidienne et professionnelle."),

    H1("2. Volet 1 — Mobilité des collaborateurs Eventy"),

    H2("2.1. Forfait Mobilités Durables (FMD)"),
    Bullet("Forfait jusqu'à 800 € net/an exonéré de cotisations sociales et IR (plafond légal)."),
    Bullet("Modes éligibles : vélo personnel ou de fonction, vélo électrique, covoiturage (en tant que conducteur ou passager), trottinette électrique en libre-service, autopartage électrique, transports en commun (cumul possible)."),
    Bullet("Pas obligatoire en deçà de 11 salariés, mais Eventy le met en place dès le 1er salarié (engagement renforcé)."),

    H2("2.2. Prise en charge transports en commun"),
    Bullet("Prise en charge à 75 % de l'abonnement transport en commun (vs 50 % obligation légale)."),
    Bullet("Cumulable avec FMD pour les modes éligibles."),

    H2("2.3. Vélo de fonction"),
    Bullet("Possibilité de vélo de fonction (location longue durée, financée par Eventy) à partir d'An 2."),
    Bullet("Inclut entretien et assurance."),
    Bullet("Réservé aux collaborateurs en CDI confirmé (post période d'essai)."),

    H2("2.4. Télétravail comme levier mobilité"),
    Bullet("Charte télétravail Eventy permet jusqu'à 3 jours/semaine de télétravail."),
    Bullet("Effet : 60 % de réduction des trajets domicile-travail vs 100 % présentiel."),
    Bullet("Cohérence Charte télétravail (référentiel équipe)."),

    H2("2.5. Déplacements professionnels"),
    Bullet("Train obligatoire pour trajets ≤ 4 h (loi Climat applicable + politique interne renforcée)."),
    Bullet("Visioconférence privilégiée pour réunions ne nécessitant pas de présence physique."),
    Bullet("Vols professionnels : uniquement si train > 4 h, et en classe économique systématique."),
    Bullet("Hébergement professionnel : préférence aux établissements certifiés énergétiquement."),
    Bullet("Compensation carbone systématique des déplacements professionnels (à compter d'An 2)."),

    H1("3. Volet 2 — Mobilité des voyageurs"),

    H2("3.1. Hiérarchie des modes pour les voyages Eventy"),
    Numbered("Autocar Grand Tourisme — mode privilégié (4× moins émetteur que l'avion par voyageur, mutualisation, capacité 38 pax)."),
    Numbered("Train (TGV, Intercités, Ouigo) — pour destinations européennes desservies."),
    Numbered("Train de nuit — réintroduit comme option attractive (Paris-Rome, Paris-Vienne, etc.)."),
    Numbered("Avion — uniquement si aucune alternative raisonnable (destinations longue distance, îles non reliées)."),

    H2("3.2. Refus structurés"),
    Bullet("Aucun vol < 4 h sur destination accessible en train (Paris-Lyon, Paris-Nice, Paris-Bordeaux exclus)."),
    Bullet("Aucun vol pour weekends courts (< 4 jours) sauf destination longue distance avec catalogue dédié."),
    Bullet("Aucune destination « surtourisme » mass-marketing reconnue (Bali, Maldives en court séjour, etc.)."),

    H2("3.3. Optimisation autocar"),
    Bullet("Taux de remplissage cible ≥ 85 % en An 2 (départ même à 4 voyageurs avec partenaires, mais bus rempli en pointe)."),
    Bullet("Étude du passage à l'autocar électrique / au biocarburant à partir d'An 3."),
    Bullet("Choix des autocaristes : critères RSE intégrés au cahier des charges."),
    Bullet("Mutualisation des bus inter-voyages (un bus déposé peut récupérer le voyage suivant)."),

    H2("3.4. Train et options ferroviaires"),
    Bullet("Partenariat envisagé avec SNCF Voyageurs / Trenitalia / OBB pour groupes."),
    Bullet("Tarifs négociés groupes (réduction 15-30 % selon volume)."),
    Bullet("Promotion des destinations train accessibles (Bruxelles, Amsterdam, Cologne, Genève, Milan, Barcelone)."),
    Bullet("Inclusion dans le catalogue saison 1 d'au moins 2 voyages 100 % train."),

    H2("3.5. Sur place — mobilité douce"),
    Bullet("Privilégier les destinations explorables à pied ou vélo."),
    Bullet("Inclure des activités de mobilité douce (visite vélo, randonnée, balade)."),
    Bullet("Limiter les transferts internes en bus / véhicule (regroupement, optimisation)."),
    Bullet("Recommander aux voyageurs les transports publics locaux (informations dans le roadbook)."),

    H1("4. Information voyageur sur la mobilité"),

    H2("4.1. Sur la fiche voyage"),
    Bullet("Mode de transport principal indiqué clairement."),
    Bullet("Émissions estimées par voyageur (kg CO2eq)."),
    Bullet("Mention « mobilité douce » si voyage 100 % bas-carbone."),
    Bullet("Comparatif visuel avec un voyage individuel équivalent (lorsque pertinent)."),

    H2("4.2. À la réservation"),
    Bullet("Information sur les modes alternatifs si pertinents (« cette destination est accessible aussi en train »)."),
    Bullet("Possibilité de prévoir des solutions d'arrivée individuelle (pour ceux qui souhaitent venir en train ou voiture)."),

    H2("4.3. Pendant le voyage"),
    Bullet("Sensibilisation douce dans le roadbook (éco-gestes mobilité)."),
    Bullet("Pas de prosélytisme — l'information prime sur l'injonction."),

    H1("5. Volet 3 — Engagement écosystème"),

    H2("5.1. Auprès des HRA partenaires"),
    Bullet("Recommandation aux HRA de mettre à disposition des vélos pour les voyageurs."),
    Bullet("Demande de critères de mobilité douce dans la sélection (proximité gare, station de transports en commun)."),
    Bullet("Bonus tarifaire pour les HRA accessibles sans voiture."),

    H2("5.2. Auprès des transporteurs"),
    Bullet("Inscription dans les contrats transporteurs de critères de performance énergétique."),
    Bullet("Engagement de progression annuelle (mix biocarburant, électrique progressif)."),
    Bullet("Audit annuel de la flotte autocaristes partenaires."),

    H2("5.3. Auprès des destinations"),
    Bullet("Privilégier les destinations engagées dans des stratégies de mobilité durable (territoires Vélo, étoiles vertes, etc.)."),
    Bullet("Refuser les destinations sur-saturées de tourisme automobile sans alternative."),

    H1("6. Indicateurs de mobilité durable"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 5"],
      rows: [
        ["Part voyages autocar", "≥ 80 %", "≥ 90 %"],
        ["Part voyages train", "≥ 5 %", "≥ 25 %"],
        ["Part voyages avion", "≤ 15 %", "≤ 3 %"],
        ["Taux de remplissage moyen autocar", "≥ 65 %", "≥ 90 %"],
        ["Voyages 100 % bas-carbone (sans avion)", "≥ 85 %", "≥ 97 %"],
        ["Émissions / voyageur (kg CO2eq) — réf. An 1", "[Réf.]", "−30 %"],
        ["Collaborateurs bénéficiant FMD", "100 %", "100 %"],
        ["Part transport collaborateurs en train pour pro", "≥ 95 %", "100 %"],
      ],
    }),

    H1("7. Communication sobre et honnête"),
    Bullet("Pas de communication marketing « voyage 100 % vert »."),
    Bullet("Reconnaissance que voyager émet des gaz à effet de serre, même responsablement."),
    Bullet("Affirmation que mieux vaut un voyage bas-carbone bien fait qu'un voyage clandestin sans encadrement."),
    Bullet("Transparence sur les chiffres : émissions, taux de remplissage, mix de modes."),

    H1("8. Gouvernance et suivi"),
    Bullet("Plan revu annuellement par le Président (et référent RSE dès An 2)."),
    Bullet("Reporting trimestriel des indicateurs."),
    Bullet("Communication publique annuelle dans le rapport RSE Eventy."),
    Bullet("Concertation des collaborateurs lors de la revue annuelle (sondage interne)."),
    Bullet("Concertation des voyageurs Famille via sondage trimestriel."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE, Charte engagement carbone, Politique d'achats responsables, Charte télétravail, Charte fournisseurs, Catalogue programmes saison 1.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Engagement-Carbone.docx",
      title: "Eventy Life — Charte d'engagement carbone",
      description: "Charte d'engagement carbone Eventy Life — méthodologie, trajectoire, contribution.",
      footer: "EVENTY LIFE SAS — Charte engagement carbone",
      children: charteCarbone(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Achats-Responsables.docx",
      title: "Eventy Life — Politique d'achats responsables",
      description: "Politique d'achats responsables : critères, fournisseurs, suivi.",
      footer: "EVENTY LIFE SAS — Politique achats responsables",
      children: politiqueAchatsResponsables(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Mobilite-Durable.docx",
      title: "Eventy Life — Plan de mobilité durable",
      description: "Plan de mobilité durable collaborateurs et voyageurs.",
      footer: "EVENTY LIFE SAS — Plan mobilité durable",
      children: planMobiliteDurable(),
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
