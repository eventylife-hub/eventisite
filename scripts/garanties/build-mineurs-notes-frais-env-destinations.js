/**
 * Eventy Life — Trois documents opérationnels pratiques
 *
 *   1. Charte mineurs voyageurs (encadrement spécifique)
 *   2. Politique de gestion des notes de frais
 *   3. Plan de gestion environnementale par destination
 *
 * Usage : node scripts/garanties/build-mineurs-notes-frais-env-destinations.js
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
// DOCUMENT 1 — CHARTE MINEURS VOYAGEURS
// ============================================================
function charteMineursVoyageurs() {
  return [
    bandeauTitre(
      "CHARTE MINEURS VOYAGEURS EVENTY",
      "Encadrement spécifique des voyages avec voyageurs mineurs",
    ),
    Spacer(160),

    P("La présente charte formalise les règles d'EVENTY LIFE SAS pour l'accueil et l'encadrement de mineurs voyageurs (≤ 17 ans). Elle complète la Politique image et droit à l'image, la Politique RGPD, la Charte qualité accompagnateur et la Politique accessibilité PMR. Elle s'applique aux voyages familiaux (mineurs accompagnés de représentant légal) et aux voyages où des mineurs participeraient sans représentant légal direct (cas exceptionnel).", { italics: true }),

    P("Eventy considère que la présence de mineurs implique une responsabilité accrue. Notre approche : encadrement renforcé, transparence totale envers les représentants légaux, refus de toute pratique inappropriée, conformité stricte aux protections légales. La sécurité des mineurs n'est pas négociable.", { italics: true }),

    H1("1. Cadre légal de référence"),
    Bullet("Code civil — articles 371 à 387 (autorité parentale)."),
    Bullet("Code pénal — articles 222-22 à 222-32 (protection des mineurs)."),
    Bullet("Loi du 26 janvier 2017 — Autorisation de Sortie du Territoire (AST) pour mineurs voyageant à l'étranger sans représentant légal."),
    Bullet("Articles L211-7 à L211-13 du Code du tourisme (voyages collectifs de mineurs)."),
    Bullet("RGPD — protection renforcée des données de mineurs (article 8)."),
    Bullet("Convention internationale des droits de l'enfant."),

    H1("2. Catégories de mineurs voyageurs"),

    H2("2.1. Catégorie A — Mineur accompagné de représentant légal"),
    Bullet("Voyage familial : mineur(s) avec parent(s) ou représentant légal."),
    Bullet("Cas le plus fréquent dans le catalogue Eventy."),
    Bullet("Encadrement principal : représentant légal."),
    Bullet("Eventy est responsable du voyage, le représentant légal est responsable du mineur."),

    H2("2.2. Catégorie B — Mineur ≥ 16 ans avec accord parental"),
    Bullet("Voyage entre amis avec accord parental écrit."),
    Bullet("Encadrement renforcé Eventy."),
    Bullet("Acceptation au cas par cas après évaluation."),
    Bullet("AST obligatoire si voyage hors France."),

    H2("2.3. Catégorie C — Voyage de groupe pédagogique avec mineurs (refus structurel)"),
    Bullet("Voyages scolaires, séjours de mineurs sans représentant légal."),
    Bullet("**Eventy refuse ce type de voyage en An 1-3** (compétence et structure dédiée requises)."),
    Bullet("Possibilité d'étudier en An 4-5 avec partenariat structuré et compétences adaptées."),

    H1("3. Conditions d'acceptation"),

    H2("3.1. Catégorie A (mineur avec représentant légal)"),
    Bullet("Acceptation systématique sous réserve disponibilités voyage."),
    Bullet("Renseignement de l'identité civile du mineur lors de la réservation."),
    Bullet("Information sur les prestations adaptées aux mineurs (chambre, restauration)."),
    Bullet("Signalement préalable d'allergies ou besoins spécifiques."),

    H2("3.2. Catégorie B (mineur ≥ 16 ans avec accord parental)"),
    Bullet("Demande préalable au Président Eventy."),
    Bullet("Vérification de la cohérence avec le programme de voyage."),
    Bullet("Documents requis avant validation : autorisation parentale écrite + AST + photocopies CNI."),
    Bullet("Décision motivée sous 14 jours."),
    Bullet("Possibilité de refus si voyage non adapté."),

    H1("4. Documents obligatoires"),

    H2("4.1. Pour tous les mineurs voyageurs"),
    Bullet("Pièce d'identité du mineur (CNI ou passeport selon destination)."),
    Bullet("Photocopie pièce d'identité du(des) représentant(s) légal(aux)."),
    Bullet("Le cas échéant : autorisation médicale pour traitements spécifiques."),
    Bullet("Le cas échéant : justificatif allergies sévères avec EpiPen."),

    H2("4.2. Pour mineur catégorie B"),
    Bullet("Autorisation parentale écrite (signée par les deux représentants légaux)."),
    Bullet("Autorisation de Sortie du Territoire (AST) si voyage hors France (formulaire CERFA n° 15646*01)."),
    Bullet("Photocopie de la pièce d'identité de chaque représentant légal."),
    Bullet("Coordonnées d'urgence (numéros joignables 24/7)."),

    H1("5. Encadrement spécifique pendant le voyage"),

    H2("5.1. Briefing accompagnateur"),
    Bullet("Information de l'accompagnateur sur la présence de mineurs (nombre, âge)."),
    Bullet("Briefing dédié sur les obligations spécifiques."),
    Bullet("Numéros d'urgence des représentants légaux conservés."),
    Bullet("Cohérence avec Charte qualité accompagnateur."),

    H2("5.2. Hébergement"),
    Bullet("Mineurs catégorie A : chambre familiale ou avec représentant légal."),
    Bullet("Mineurs catégorie B (≥ 16 ans) : chambre individuelle ou avec autre voyageur du même groupe consenti."),
    Bullet("Refus systématique de chambre partagée avec adulte non représentant légal."),
    Bullet("Vérification de la conformité de l'hôtel (séparation chambres, sécurité)."),

    H2("5.3. Restauration"),
    Bullet("Adaptation des menus selon âge et préférences."),
    Bullet("Vigilance sur les allergies (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Boissons alcoolisées : refus systématique pour les mineurs (loi Évin)."),

    H2("5.4. Activités"),
    Bullet("Vérification de la conformité des activités à l'âge."),
    Bullet("Refus des activités à risque non adaptées."),
    Bullet("Encadrement renforcé pour activités physiques."),
    Bullet("Possibilité d'activités alternatives si activité principale non adaptée."),

    H1("6. Communication avec les représentants légaux"),

    H2("6.1. Avant le voyage"),
    Bullet("Information détaillée du programme et des éventuelles activités à risque."),
    Bullet("Conditions de communication (téléphone, internet sur place)."),
    Bullet("Coordonnées de l'accompagnateur."),
    Bullet("Procédures en cas d'incident."),

    H2("6.2. Pendant le voyage"),
    Bullet("Communication quotidienne possible avec mineur (selon accord et destination)."),
    Bullet("Information immédiate des représentants légaux en cas d'incident (cohérence Manuel d'incident voyage)."),
    Bullet("Disponibilité de l'accompagnateur 24/7."),

    H2("6.3. Au retour"),
    Bullet("Compte-rendu informel à la remise du mineur."),
    Bullet("Photos / vidéos du voyage selon Politique image et droit à l'image."),
    Bullet("NPS et retour spécifique sollicités."),

    H1("7. Protection contre les pratiques inappropriées"),

    H2("7.1. Engagement Eventy"),
    Bullet("Refus absolu de toute pratique inappropriée vis-à-vis des mineurs."),
    Bullet("Vérification des antécédents des accompagnateurs (casier judiciaire B3 vierge — cohérence Charte qualité accompagnateur)."),
    Bullet("Formation accompagnateurs à l'encadrement de mineurs."),
    Bullet("Refus de tout contact physique inapproprié."),

    H2("7.2. Procédure de signalement renforcée"),
    Bullet("En cas de soupçon ou témoignage : signalement immédiat aux autorités compétentes."),
    Bullet("Cohérence avec Procédure de signalement (lanceurs d'alerte)."),
    Bullet("Suspension immédiate de l'accompagnateur concerné si nécessaire."),
    Bullet("Coopération pleine et entière avec autorités judiciaires."),

    H2("7.3. Confidentialité renforcée"),
    Bullet("Données mineurs traitées avec protection RGPD article 8 renforcée."),
    Bullet("Pas d'utilisation marketing des photos / témoignages mineurs sans accord parental écrit (cohérence Politique image et droit à l'image)."),
    Bullet("Suppression des données sensibles selon délais légaux."),

    H1("8. Cas particuliers"),

    H2("8.1. Mineur seul (orphelin, etc.)"),
    Bullet("Acceptation au cas par cas avec validation Président + avocat partenaire."),
    Bullet("Coordination avec aide sociale à l'enfance si applicable."),
    Bullet("Encadrement maximal."),

    H2("8.2. Voyage à l'étranger sans représentant légal"),
    Bullet("AST obligatoire (formulaire CERFA n° 15646*01)."),
    Bullet("Photocopies certifiées des CNI des représentants légaux."),
    Bullet("Copie du livret de famille."),
    Bullet("Vérification des règles spécifiques du pays de destination."),

    H2("8.3. Mineur en situation de handicap"),
    Bullet("Cohérence avec Politique accessibilité PMR + Fiche santé voyageur."),
    Bullet("Coordination renforcée avec représentant légal."),
    Bullet("Possibilité d'aide humaine voyageant avec le mineur."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Voyages avec mineurs / an", "Suivi", "Suivi"],
        ["NPS représentants légaux", "≥ + 70", "≥ + 80"],
        ["Incidents impliquant mineurs", "0", "0"],
        ["Plaintes pratiques inappropriées", "0", "0"],
        ["Documents complets fournis", "100 %", "100 %"],
        ["Formation accompagnateurs accueil mineurs", "100 %", "100 %"],
      ],
    }),

    H1("10. Engagements opposables"),
    Bullet("Sécurité des mineurs prioritaire en toutes circonstances."),
    Bullet("Refus absolu de toute pratique inappropriée."),
    Bullet("Vérification antécédents accompagnateurs (casier B3 vierge)."),
    Bullet("Formation continue à l'encadrement de mineurs."),
    Bullet("Communication transparente avec représentants légaux."),
    Bullet("Refus du voyage scolaire / collectif de mineurs en An 1-3 (manque structure)."),
    Bullet("Coopération pleine avec autorités en cas de signalement."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte qualité accompagnateur, Politique image et droit à l'image, Politique RGPD, Politique accessibilité PMR, Fiche santé voyageur international, Document administratif voyageur, Manuel d'incident voyage, Procédure de signalement.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE NOTES DE FRAIS
// ============================================================
function politiqueNotesDeFrais() {
  return [
    bandeauTitre(
      "POLITIQUE DE GESTION DES NOTES DE FRAIS EVENTY",
      "Règles internes de remboursement de frais professionnels",
    ),
    Spacer(160),

    P("La présente politique formalise les règles d'EVENTY LIFE SAS en matière de notes de frais professionnels. Elle complète le Plan comptable et processus mensuel, la Politique d'achats responsables, le Plan de mobilité durable et la Politique anti-corruption. Elle s'applique à tous les collaborateurs salariés engageant des frais au nom d'Eventy.", { italics: true }),

    P("Eventy adopte une approche simple et juste : les frais professionnels engagés sont remboursés rapidement et sans formalités excessives. La transparence et la confiance sont la base — pas le contrôle bureaucratique. En contrepartie, chaque collaborateur engage sa responsabilité sur la sincérité de ses notes de frais.", { italics: true }),

    H1("1. Cadre légal de référence"),
    Bullet("Code du travail — articles L3261-1 à L3261-5 (frais professionnels)."),
    Bullet("BOFIP-RSA-CHAMP-20-50-10-20 (régime fiscal des frais professionnels)."),
    Bullet("Plan comptable Eventy (cohérence)."),
    Bullet("Politique anti-corruption Eventy (cohérence)."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes"),
    Bullet("Sincérité — déclaration honnête, refus de la fraude."),
    Bullet("Sobriété — choix raisonnables au regard du marché."),
    Bullet("Justification — pièce justificative pour chaque frais."),
    Bullet("Cohérence valeurs — frais alignés avec les engagements Eventy (RSE, mobilité durable)."),
    Bullet("Rapidité — remboursement sous 14 jours."),

    H2("2.2. Refus structurés"),
    Bullet("Refus des frais somptuaires (vins très chers, restaurants étoilés sans justification)."),
    Bullet("Refus du remboursement à crédit illimité."),
    Bullet("Refus de la fraude (fausse facture, frais privés requalifiés en pro)."),
    Bullet("Refus du remboursement de frais de complaisance ou de cadeaux non autorisés (cohérence Politique anti-corruption)."),
    Bullet("Refus du remboursement de frais personnels (smoking, vacances, parfums...)."),

    H1("3. Catégories de frais remboursables"),

    H2("3.1. Frais de transport professionnel"),
    Bullet("Train (privilégier 2e classe sauf trajets > 4 h justifiés)."),
    Bullet("Vol (uniquement si train > 4 h, classe économique)."),
    Bullet("Voiture personnelle : barème kilométrique fiscal (hors agglomération)."),
    Bullet("Taxi / VTC (justifié, pas de Uber Premium / Berline sauf nécessité)."),
    Bullet("Transports en commun (toujours préférés en zone urbaine)."),
    Bullet("Parking et péages (justifiés)."),
    Bullet("Cohérence Plan de mobilité durable."),

    H2("3.2. Frais d'hébergement"),
    Bullet("Hôtel ≤ 4* en France, ≤ 5* à l'étranger (selon contexte)."),
    Bullet("Plafond indicatif : 150 €/nuit Paris, 120 €/nuit province, ajusté à l'étranger."),
    Bullet("Préférence pour établissements certifiés énergétiquement (cohérence Charte engagement carbone)."),
    Bullet("Refus de Airbnb sauf situation justifiée."),

    H2("3.3. Frais de restauration"),
    Bullet("Repas pris en déplacement (≤ 25 € midi, ≤ 35 € soir)."),
    Bullet("Repas client : justification du contexte (qui, pourquoi, plafond 60 €/personne)."),
    Bullet("Pourboires inclus (jusqu'à 10 % en France, plus à l'international selon usage)."),
    Bullet("Refus alcools forts en repas client (cohérence sobriété)."),

    H2("3.4. Frais télécom"),
    Bullet("Forfait téléphonique professionnel pris en charge."),
    Bullet("Itinérance internationale justifiée."),
    Bullet("Refus du forfait excessif sans usage proportionné."),

    H2("3.5. Fournitures et matériel"),
    Bullet("Fournitures bureau (papeterie, etc.)."),
    Bullet("Petit matériel professionnel (souris, casque, etc.)."),
    Bullet("Au-delà de 200 € : achat via Eventy directement, pas en note de frais."),

    H2("3.6. Conférences et formations"),
    Bullet("Inscription à conférences professionnelles (cohérence Plan de formation interne)."),
    Bullet("Frais de déplacement et hébergement associés."),
    Bullet("Validation préalable du Président pour > 500 €."),

    H1("4. Modalités de soumission"),

    H2("4.1. Outil"),
    Bullet("Outil dédié : Pennylane, Tiime, Spendesk ou équivalent (à confirmer avec expert-comptable)."),
    Bullet("Cohérence avec Plan comptable et processus mensuel."),
    Bullet("Refus de la note de frais Excel manuelle (perte de temps)."),

    H2("4.2. Pièces justificatives"),
    Bullet("Tout frais ≥ 1 € : justificatif obligatoire (facture, ticket, photo)."),
    Bullet("Justificatif lisible (montant, date, fournisseur)."),
    Bullet("Conservation justificatifs 6 ans (cohérence comptable)."),
    Bullet("Possibilité de scan / photo (e-justificatif accepté)."),

    H2("4.3. Délai de soumission"),
    Bullet("Soumission au plus tard 30 jours après l'engagement de la dépense."),
    Bullet("Au-delà : justification requise, possibilité de refus."),

    H1("5. Validation et remboursement"),

    H2("5.1. Validation"),
    Bullet("Première validation : manager direct (le cas échéant)."),
    Bullet("Validation Président pour notes > 500 €."),
    Bullet("Délai de validation : ≤ 7 jours ouvrés."),

    H2("5.2. Remboursement"),
    Bullet("Versement par virement sous 14 jours après validation."),
    Bullet("Mention sur fiche de paie ou sur compte distinct selon préférence."),
    Bullet("Refus motivé écrit en cas de non-validation."),

    H1("6. Frais spécifiques à valider en amont"),
    Bullet("Tout déplacement à l'étranger (validation préalable Président)."),
    Bullet("Conférences ou formations > 500 €."),
    Bullet("Hébergement > 200 €/nuit."),
    Bullet("Repas client > 100 €/personne."),
    Bullet("Tout frais inhabituel."),

    H1("7. Cas particuliers"),

    H2("7.1. Forfait Mobilités Durables (FMD)"),
    Bullet("Cohérence avec Plan de mobilité durable."),
    Bullet("Forfait jusqu'à 800 €/an exonéré (vélo, covoiturage, transports en commun)."),
    Bullet("Géré séparément des notes de frais classiques."),

    H2("7.2. Frais de séminaire d'équipe"),
    Bullet("Pris en charge directement par Eventy (pas en note de frais individuelle)."),
    Bullet("Cohérence avec Plan d'événements."),

    H2("7.3. Frais représentation Président"),
    Bullet("Politique spécifique encadrée par Statuts SAS."),
    Bullet("Plafond annuel défini par les associés."),
    Bullet("Justification systématique."),

    H1("8. Sanctions en cas de fraude"),
    Bullet("Note de frais fictive ou gonflée : refus + avertissement."),
    Bullet("Récidive : sanction disciplinaire."),
    Bullet("Fraude caractérisée : licenciement pour faute grave + action en justice."),
    Bullet("Cohérence avec Politique anti-corruption et Procédure de signalement."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Délai validation moyen (jours)", "≤ 7 j", "≤ 3 j"],
        ["Délai remboursement (jours)", "≤ 14 j", "≤ 7 j"],
        ["Taux notes de frais avec justificatif", "100 %", "100 %"],
        ["Taux notes refusées", "Suivi", "Suivi"],
        ["Frais somptuaires détectés", "0", "0"],
        ["Coût total NDF / CA", "≤ 1 %", "≤ 0,8 %"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Confiance par défaut, contrôle léger."),
    Bullet("Refus de la bureaucratisation des notes de frais."),
    Bullet("Sincérité absolue (refus de la fraude tolérée)."),
    Bullet("Cohérence avec valeurs RSE (sobriété, mobilité durable)."),
    Bullet("Égalité de traitement (mêmes règles pour tous, dirigeant inclus)."),
    Bullet("Refus de l'avantage en nature non déclaré."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan comptable et processus mensuel, Plan de mobilité durable, Politique d'achats responsables, Politique anti-corruption, Politique conflits d'intérêts, Charte télétravail, Plan de formation interne, Plan d'événements.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN GESTION ENVIRONNEMENTALE DESTINATIONS
// ============================================================
function planGestionEnvironnementaleDestinations() {
  return [
    bandeauTitre(
      "PLAN DE GESTION ENVIRONNEMENTALE PAR DESTINATION",
      "Éco-responsabilité destination par destination du catalogue Eventy",
    ),
    Spacer(160),

    P("Le présent plan formalise la gestion environnementale d'EVENTY LIFE SAS destination par destination. Il complète et opérationnalise la Charte engagement carbone, la Politique RSE et le Plan de mobilité durable en posant un cadre concret pour évaluer et améliorer l'empreinte environnementale de chaque voyage du catalogue.", { italics: true }),

    P("Notre approche : chaque destination a sa propre empreinte, ses propres opportunités d'amélioration, ses propres défis. Plutôt qu'une politique générique, ce plan crée une fiche environnementale par destination, mise à jour annuellement. C'est aussi un outil d'éducation des voyageurs (cohérence transparence radicale).", { italics: true }),

    H1("1. Objectifs"),
    Bullet("Mesurer l'empreinte environnementale réelle de chaque voyage."),
    Bullet("Identifier les opportunités d'amélioration concrètes."),
    Bullet("Éduquer les voyageurs sur l'impact de leur voyage."),
    Bullet("Comparer entre voyages pour orienter les choix éditoriaux (cohérence Grille de décision destinations)."),
    Bullet("Documenter pour le Bilan Carbone annuel (cohérence Charte engagement carbone)."),

    H1("2. Cadre méthodologique"),
    Bullet("Bilan Carbone ADEME (cohérence Charte engagement carbone)."),
    Bullet("Facteurs d'émission ADEME (mis à jour annuellement)."),
    Bullet("Périmètre Scope 3 voyageurs (transport, hébergement, restauration, activités)."),
    Bullet("Cohérence avec Plan de mobilité durable."),
    Bullet("Cohérence avec Politique d'achats responsables."),

    H1("3. Fiche environnementale type d'une destination"),

    H2("3.1. Données de base"),
    Bullet("Nom du voyage et destination."),
    Bullet("Durée."),
    Bullet("Capacité (4-38 voyageurs)."),
    Bullet("Mode de transport principal (autocar, train, avion exceptionnel)."),
    Bullet("Distance aller-retour."),

    H2("3.2. Empreinte carbone détaillée"),
    Bullet("Émissions transport voyageurs (kg CO2eq / voyageur)."),
    Bullet("Émissions hébergement (kg CO2eq / nuit / voyageur selon classement énergétique)."),
    Bullet("Émissions restauration (kg CO2eq selon menus, viande/végétarien)."),
    Bullet("Émissions activités (transferts internes, énergie sites)."),
    Bullet("Total estimé (kg CO2eq / voyageur)."),
    Bullet("Comparaison vs voyage similaire individuel (sans groupe)."),

    H2("3.3. Critères RSE des partenaires"),
    Bullet("Hébergement : classement énergétique, labels (Clef Verte, Écolabel)."),
    Bullet("Restauration : approvisionnement local, saisonnier, options végétariennes."),
    Bullet("Activités : impact écosystème, respect biodiversité."),
    Bullet("Transport : performance énergétique flotte autocariste."),

    H2("3.4. Risques environnementaux locaux"),
    Bullet("Surtourisme (densité touristique vs population)."),
    Bullet("Pression hydrique (régions en stress hydrique)."),
    Bullet("Biodiversité menacée (zones protégées)."),
    Bullet("Pollution atmosphérique."),
    Bullet("Risques climatiques émergents."),

    H2("3.5. Opportunités locales"),
    Bullet("Acteurs économiques locaux à privilégier (artisans, agriculteurs)."),
    Bullet("Initiatives écologiques à soutenir (associations locales)."),
    Bullet("Sites d'intérêt environnemental à promouvoir."),
    Bullet("Bonnes pratiques locales à respecter."),

    H1("4. Méthodologie de calcul"),

    H2("4.1. Données collectées"),
    Bullet("Distance précise (Google Maps ou outil routier)."),
    Bullet("Type de transport (autocar Euro 6, train TGV, avion court-courrier, etc.)."),
    Bullet("Type d'hébergement (classement énergétique demandé au HRA)."),
    Bullet("Composition des menus (% viande, % végétarien, % local)."),
    Bullet("Activités (durées, transferts associés)."),

    H2("4.2. Facteurs d'émission utilisés (ADEME 2026)"),
    makeTable({
      widths: [3744, 2808, 2808],
      header: ["Mode / catégorie", "Émissions", "Source"],
      rows: [
        ["Autocar Grand Tourisme (par km/voyageur)", "≈ 30 g CO2eq", "ADEME"],
        ["TGV (par km/voyageur)", "≈ 4 g CO2eq", "ADEME"],
        ["Avion court-courrier (par km/voyageur)", "≈ 285 g CO2eq", "ADEME"],
        ["Voiture (par km/voyageur)", "≈ 200 g CO2eq", "ADEME"],
        ["Hôtel énergie standard (par nuit)", "≈ 8-15 kg CO2eq", "ADEME"],
        ["Hôtel énergie efficace (par nuit)", "≈ 4-8 kg CO2eq", "ADEME"],
        ["Repas viande rouge", "≈ 7-10 kg CO2eq", "ADEME"],
        ["Repas végétarien", "≈ 1-2 kg CO2eq", "ADEME"],
      ],
    }),

    H2("4.3. Restitution publique"),
    Bullet("Émissions totales estimées affichées sur la fiche voyage."),
    Bullet("Émissions par voyageur."),
    Bullet("Comparaison transparente avec voyage individuel."),
    Bullet("Cohérence avec Charte éditoriale (refus du greenwashing)."),

    H1("5. Plan d'amélioration par destination"),

    H2("5.1. Voyage à fort impact (> 200 kg CO2eq / voyageur)"),
    Bullet("Étude de faisabilité d'un mode de transport alternatif."),
    Bullet("Renégociation avec HRA pour améliorer classement énergétique."),
    Bullet("Augmentation des options végétariennes / végétaliennes."),
    Bullet("Compensation carbone systématique des émissions résiduelles (cohérence Charte engagement carbone)."),

    H2("5.2. Voyage à impact modéré (100-200 kg CO2eq / voyageur)"),
    Bullet("Optimisation du taux de remplissage autocar."),
    Bullet("Substitution viande rouge → volaille / poisson local."),
    Bullet("Recommandations éco-gestes voyageurs."),

    H2("5.3. Voyage à faible impact (< 100 kg CO2eq / voyageur)"),
    Bullet("Mise en avant comme « voyage bas-carbone » sur le catalogue."),
    Bullet("Compensation carbone optionnelle à coût raisonnable."),
    Bullet("Communication transparente."),

    H1("6. Mise à jour des fiches"),
    Bullet("Fiche environnementale créée à la conception du voyage (cohérence Méthodologie de création de voyage)."),
    Bullet("Mise à jour annuelle (T1, lors du Bilan Carbone)."),
    Bullet("Mise à jour exceptionnelle si évolution majeure (changement HRA, transport)."),
    Bullet("Restitution publique sur la fiche voyage du catalogue."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Voyages avec fiche environnementale", "100 %", "100 %"],
        ["Voyages bas-carbone (< 100 kg CO2eq)", "≥ 30 %", "≥ 50 %"],
        ["Voyages avec compensation systématique", "Cible An 2", "100 %"],
        ["Réduction émissions / voyageur (vs An 1)", "Référence", "−30 %"],
        ["Restitution publique des émissions", "100 %", "100 %"],
        ["Audit annuel des fiches", "1", "1"],
      ],
    }),

    H1("8. Outils et ressources"),
    Bullet("Calculateur ADEME Bilan Carbone."),
    Bullet("Greenly ou MyClimate (outils sectoriels)."),
    Bullet("Référentiel Tourisme Durable ATR."),
    Bullet("Guide Routard responsable (référence pratique)."),
    Bullet("Outil interne dédié à partir de An 2-3 (cohérence Roadmap technique)."),

    H1("9. Engagements éthiques"),
    Bullet("Transparence absolue sur les chiffres (refus greenwashing)."),
    Bullet("Refus de la promotion exagérée d'un voyage comme « écologique »."),
    Bullet("Engagement à mesurer même quand ça révèle un impact élevé."),
    Bullet("Engagement à publier annuellement les résultats."),
    Bullet("Engagement à améliorer chaque voyage chaque année."),
    Bullet("Refus de la communication marketing « voyage neutre carbone » avant An 5."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle (T1).", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte engagement carbone, Politique RSE, Plan de mobilité durable, Politique d'achats responsables, Méthodologie de création de voyage, Grille de décision destinations, Procédure d'audit qualité HRA.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Mineurs-Voyageurs.docx",
      title: "Eventy Life — Charte mineurs voyageurs",
      description: "Encadrement spécifique des voyages avec voyageurs mineurs.",
      footer: "EVENTY LIFE SAS — Charte mineurs voyageurs",
      children: charteMineursVoyageurs(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Notes-De-Frais.docx",
      title: "Eventy Life — Politique de gestion des notes de frais",
      description: "Règles internes de remboursement de frais professionnels.",
      footer: "EVENTY LIFE SAS — Politique notes de frais",
      children: politiqueNotesDeFrais(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Gestion-Env-Destinations.docx",
      title: "Eventy Life — Plan de gestion environnementale par destination",
      description: "Éco-responsabilité destination par destination.",
      footer: "EVENTY LIFE SAS — Gestion env. par destination",
      children: planGestionEnvironnementaleDestinations(),
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
