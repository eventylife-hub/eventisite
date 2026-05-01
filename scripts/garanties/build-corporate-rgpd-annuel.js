/**
 * Eventy Life — Trois documents corporate / RGPD annuels
 *
 *   1. DPA — Contrat de sous-traitance RGPD article 28 (modèle type)
 *   2. PV d'assemblée générale ordinaire annuelle (modèle type)
 *   3. Rapport de gestion annuel (modèle type — Code commerce L232-1)
 *
 * Usage : node scripts/garanties/build-corporate-rgpd-annuel.js
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
// DOCUMENT 1 — DPA (Contrat sous-traitance RGPD article 28)
// ============================================================
function dpaSousTraitance() {
  return [
    bandeauTitre(
      "CONTRAT DE SOUS-TRAITANCE RGPD",
      "Modèle conforme à l'article 28 du Règlement (UE) 2016/679",
    ),
    Spacer(160),

    P("Le présent contrat de sous-traitance RGPD (« DPA » — Data Processing Agreement) formalise les engagements du Sous-traitant lorsqu'il traite des données à caractère personnel pour le compte d'EVENTY LIFE SAS, agissant en qualité de responsable de traitement, conformément à l'article 28 du Règlement général sur la protection des données (RGPD) — Règlement (UE) 2016/679.", { italics: true }),

    P("Ce document est un modèle-type qui sera annexé à tout contrat de prestation impliquant un traitement de données à caractère personnel pour le compte d'Eventy. Les principaux sous-traitants concernés sont notamment : Stripe Payments Europe, Scaleway, Google Workspace, l'expert-comptable, le DPO externe, le prestataire d'envoi d'emails, l'éditeur de logiciels CRM, les outils analytics.", { italics: true }),

    H1("Entre les soussignés"),
    Bullet("EVENTY LIFE SAS, société par actions simplifiée au capital de 3 000 €, immatriculée au RCS de [Ville] sous le numéro [SIREN], dont le siège social est situé [adresse], représentée par David Eventy en qualité de Président, ci-après dénommée le « Responsable de traitement »."),
    Bullet("[Dénomination du Sous-traitant], société [forme juridique] au capital de [montant], immatriculée au RCS de [Ville] sous le numéro [SIREN], dont le siège social est situé [adresse], représentée par [Nom et qualité], ci-après dénommé le « Sous-traitant »."),

    H1("Article 1 — Objet"),
    P("Le présent contrat a pour objet de définir les conditions dans lesquelles le Sous-traitant traite, pour le compte d'EVENTY, les données à caractère personnel nécessaires à l'exécution du Contrat principal."),
    P("Il complète le Contrat principal entré en vigueur le [date]. En cas de contradiction, les stipulations du présent DPA prévalent sur celles du Contrat principal sur les points relatifs à la protection des données."),

    H1("Article 2 — Définitions"),
    Bullet("« Données à caractère personnel », « traitement », « responsable de traitement », « sous-traitant », « personne concernée », « violation de données » : tels que définis à l'article 4 du RGPD."),
    Bullet("« Tiers » : toute personne autre qu'EVENTY, le Sous-traitant ou les personnes concernées."),
    Bullet("« Sous-traitant ultérieur » : tiers auquel le Sous-traitant fait appel pour exécuter tout ou partie de son traitement."),

    H1("Article 3 — Description du traitement"),
    H2("3.1. Nature et finalité"),
    Bullet("Nature du traitement : [collecte / hébergement / transmission / archivage / suppression / etc.]."),
    Bullet("Finalité du traitement : [exécution de la prestation prévue au Contrat principal — ex : encaissement de paiements, hébergement de la base de données voyageurs, envoi d'emails transactionnels, etc.]."),

    H2("3.2. Catégories de données"),
    Bullet("Données d'identification (nom, prénom, date de naissance, adresse postale)."),
    Bullet("Données de contact (email, téléphone)."),
    Bullet("Données de paiement (uniquement les 4 derniers chiffres de carte si nécessaire — jamais le PAN ni le CVC, qui sont gérés directement par Stripe)."),
    Bullet("Données techniques (adresse IP, log de connexion — uniquement pour les sous-traitants techniques)."),
    Bullet("Le cas échéant : données médicales (allergies, mobilité réduite — uniquement en cas de nécessité opérationnelle pour le voyage)."),

    H2("3.3. Catégories de personnes concernées"),
    Bullet("Voyageurs et prospects voyageurs."),
    Bullet("Partenaires HRA, créateurs, vendeurs, accompagnateurs."),
    Bullet("Collaborateurs salariés et non-salariés Eventy."),
    Bullet("Visiteurs du site eventylife.fr."),

    H2("3.4. Durée du traitement"),
    P("Le Sous-traitant traite les données pendant toute la durée du Contrat principal. À l'issue, il restitue ou supprime les données conformément à l'article 9 du présent DPA."),

    H1("Article 4 — Obligations du Sous-traitant"),
    P("Conformément à l'article 28 du RGPD, le Sous-traitant s'engage à :"),
    Numbered("Traiter les données personnelles uniquement sur instruction documentée d'EVENTY, y compris en ce qui concerne les transferts hors UE — sauf obligation légale impérative."),
    Numbered("Garantir que les personnes autorisées à traiter les données s'engagent à la confidentialité ou sont soumises à une obligation légale de confidentialité."),
    Numbered("Mettre en œuvre toutes les mesures techniques et organisationnelles requises (article 32 RGPD) — voir Article 6 ci-dessous."),
    Numbered("Respecter les conditions visées à l'article 5 pour le recours à un sous-traitant ultérieur."),
    Numbered("Aider EVENTY, dans la mesure du possible, à répondre aux demandes des personnes concernées (droit d'accès, rectification, effacement, opposition, portabilité, limitation)."),
    Numbered("Aider EVENTY à respecter les obligations des articles 32 à 36 du RGPD (sécurité, notification, AIPD, consultation préalable)."),
    Numbered("Au choix d'EVENTY, supprimer ou restituer toutes les données à la fin du Contrat — voir Article 9."),
    Numbered("Mettre à disposition d'EVENTY toutes les informations nécessaires pour démontrer le respect des obligations RGPD et permettre des audits."),

    H1("Article 5 — Recours à un sous-traitant ultérieur"),
    Bullet("Le Sous-traitant ne peut recourir à un sous-traitant ultérieur qu'avec l'autorisation écrite préalable spécifique ou générale d'EVENTY."),
    Bullet("Une autorisation générale est accordée pour les sous-traitants ultérieurs déjà listés en annexe au jour de la signature."),
    Bullet("Toute modification (ajout, remplacement) doit faire l'objet d'une notification écrite à EVENTY au moins 30 jours avant le changement."),
    Bullet("EVENTY peut s'opposer au changement, auquel cas le Sous-traitant doit proposer une solution alternative — à défaut, EVENTY peut résilier le Contrat principal sans indemnité."),
    Bullet("Le Sous-traitant impose au sous-traitant ultérieur des obligations identiques à celles du présent DPA."),
    Bullet("Le Sous-traitant reste pleinement responsable envers EVENTY de l'exécution par le sous-traitant ultérieur de ses obligations."),

    H1("Article 6 — Mesures de sécurité (article 32 RGPD)"),
    P("Le Sous-traitant met en œuvre, compte tenu de l'état de l'art et des risques, les mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté, notamment :"),

    H2("6.1. Mesures techniques"),
    Bullet("Chiffrement des données au repos (AES-256 ou équivalent) et en transit (TLS 1.2 ou supérieur)."),
    Bullet("Pseudonymisation des données dès que techniquement possible."),
    Bullet("Authentification forte pour les accès administrateurs (MFA obligatoire)."),
    Bullet("Cloisonnement strict des environnements (dev / staging / prod)."),
    Bullet("Sauvegardes régulières et tests de restauration documentés."),
    Bullet("Protection contre les intrusions (WAF, IDS/IPS, monitoring 24/7)."),
    Bullet("Tests d'intrusion (pentest) au minimum annuels."),

    H2("6.2. Mesures organisationnelles"),
    Bullet("Politique de sécurité des systèmes d'information écrite et tenue à jour."),
    Bullet("Habilitations nominatives, principe du moindre privilège."),
    Bullet("Sensibilisation et formation annuelle du personnel à la sécurité et au RGPD."),
    Bullet("Procédure documentée de gestion des incidents de sécurité."),
    Bullet("Registre des activités de traitement (article 30 RGPD)."),

    H1("Article 7 — Notification des violations de données"),
    Bullet("Le Sous-traitant notifie à EVENTY toute violation de données à caractère personnel dans un délai maximum de 24 heures après en avoir pris connaissance."),
    Bullet("La notification contient au minimum : nature de la violation, catégories et nombre approximatif de personnes concernées, conséquences probables, mesures prises ou envisagées."),
    Bullet("Le Sous-traitant assiste EVENTY dans la notification à l'autorité de contrôle (CNIL — délai 72 h article 33 RGPD) et, le cas échéant, à l'information des personnes concernées (article 34 RGPD)."),
    Bullet("Tous les frais de notification, de communication aux personnes concernées et de remédiation sont à la charge du Sous-traitant si la violation lui est imputable."),

    H1("Article 8 — Transferts hors Union européenne"),
    Bullet("Les données ne peuvent faire l'objet d'un transfert hors UE qu'avec autorisation écrite préalable d'EVENTY."),
    Bullet("Si un transfert est autorisé, il est encadré par des garanties appropriées (article 46 RGPD) : Clauses Contractuelles Types (décision UE 2021/914), règles d'entreprise contraignantes (BCR), ou pays bénéficiant d'une décision d'adéquation."),
    Bullet("Eventy privilégie systématiquement les sous-traitants situés dans l'Union européenne (politique de souveraineté numérique)."),
    Bullet("Liste des transferts hors UE actuels : néant à la signature (Stripe Payments Europe = Irlande, Scaleway = France, Google Workspace = UE pour les comptes UE souscrits)."),

    H1("Article 9 — Sort des données à la fin du Contrat"),
    Bullet("À la fin du Contrat, EVENTY notifie au Sous-traitant son choix : restitution ou suppression."),
    Bullet("En cas de restitution : remise des données dans un format structuré, couramment utilisé et lisible par machine, dans un délai de 30 jours."),
    Bullet("En cas de suppression : suppression définitive et irrécupérable de toutes les copies, dans un délai de 30 jours."),
    Bullet("Le Sous-traitant fournit une attestation écrite de suppression."),
    Bullet("Exception : conservation autorisée des données pour durée minimale légale (comptabilité 10 ans, etc.) — sous condition de cloisonnement strict et d'accès limité."),

    H1("Article 10 — Audit"),
    Bullet("EVENTY se réserve le droit de procéder, à ses frais et préavis raisonnable (30 jours minimum, sauf urgence justifiée), à des audits sur pièces ou sur place."),
    Bullet("L'audit peut être réalisé par un tiers indépendant désigné par EVENTY."),
    Bullet("Le Sous-traitant met à disposition les éléments nécessaires (politique de sécurité, registre, journaux d'accès, certifications)."),
    Bullet("Les certifications ISO 27001, SOC 2, ou équivalent (datant de moins de 12 mois) peuvent valoir audit dans la limite du périmètre couvert."),

    H1("Article 11 — Responsabilité et indemnisation"),
    Bullet("Le Sous-traitant est responsable des dommages causés par son non-respect du présent DPA conformément à l'article 82 RGPD."),
    Bullet("Le Sous-traitant indemnise EVENTY pour toute condamnation administrative (CNIL), civile ou pénale, à raison d'un manquement imputable au Sous-traitant ou à un sous-traitant ultérieur."),
    Bullet("Plafond de responsabilité : sans plafond pour les manquements graves (violation des droits, transfert illégal, sécurité défaillante caractérisée). Plafonné au montant annuel HT du contrat pour les manquements ordinaires."),

    H1("Article 12 — Durée et résiliation"),
    Bullet("Le présent DPA prend effet à la date de signature et reste en vigueur tant que le Contrat principal est en cours."),
    Bullet("EVENTY peut résilier le DPA et le Contrat principal de plein droit, sans préavis ni indemnité, en cas de manquement grave du Sous-traitant aux obligations RGPD (violation de données non notifiée, refus d'audit, transfert hors UE non autorisé)."),

    H1("Article 13 — Loi applicable et juridiction"),
    Bullet("Le présent DPA est soumis au droit français."),
    Bullet("Tout litige relève de la compétence exclusive du Tribunal de Commerce de [siège social Eventy]."),

    H1("Annexe 1 — Liste des sous-traitants ultérieurs autorisés"),
    P("(À compléter au cas par cas selon le sous-traitant contracté — exemple ci-dessous)"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Sous-traitant ultérieur", "Localisation", "Finalité"],
      rows: [
        ["[À compléter]", "[Pays UE/hors UE]", "[Finalité précise]"],
        ["[À compléter]", "[Pays UE/hors UE]", "[Finalité précise]"],
      ],
    }),

    Spacer(200),
    P("Fait en deux exemplaires originaux à [Lieu], le [Date].", { italics: true, size: 18 }),
    Spacer(280),
    P("Pour EVENTY LIFE SAS                                                          Pour [Sous-traitant]", { size: 18 }),
    P("David Eventy, Président                                                       [Nom et qualité]", { size: 18 }),
    P("(« Bon pour accord »)                                                         (« Bon pour accord »)", { size: 18 }),

    Spacer(160),
    P("Document de référence — Modèle DPA Version 1.0 — 30 avril 2026. À adapter au cas par cas selon le Sous-traitant.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique de confidentialité RGPD, Politique cookies, Mentions légales, Statuts SAS, CGV.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PV ASSEMBLÉE GÉNÉRALE ORDINAIRE ANNUELLE
// ============================================================
function pvAssembleeGenerale() {
  return [
    bandeauTitre(
      "PV D'ASSEMBLÉE GÉNÉRALE ORDINAIRE ANNUELLE",
      "Modèle type — approbation des comptes annuels Eventy Life SAS",
    ),
    Spacer(160),

    P("Le présent document est un modèle de procès-verbal (PV) d'assemblée générale ordinaire annuelle d'EVENTY LIFE SAS, à adapter chaque année lors de l'approbation des comptes annuels. Il respecte les obligations du Code de commerce (articles L227-9 et L232-1 et suivants) et les statuts de la SAS.", { italics: true }),

    P("Conformément aux statuts d'EVENTY LIFE SAS, l'assemblée générale ordinaire annuelle se tient dans les six (6) mois suivant la clôture de l'exercice (soit avant le 30 juin pour un exercice clos le 31 décembre). Elle approuve les comptes annuels, donne quitus au Président, statue sur l'affectation du résultat, et procède aux nominations / renouvellements éventuels.", { italics: true }),

    H1("EVENTY LIFE SAS"),
    Bullet("Société par actions simplifiée au capital de [Capital] €."),
    Bullet("Siège social : [Adresse]."),
    Bullet("RCS [Ville] [N° SIREN]."),
    Bullet("(Ci-après dénommée « la Société »)."),

    Spacer(200),
    P("PROCÈS-VERBAL DE L'ASSEMBLÉE GÉNÉRALE ORDINAIRE ANNUELLE", { bold: true, align: AlignmentType.CENTER, size: 22 }),
    P("DU [JJ/MM/AAAA]", { bold: true, align: AlignmentType.CENTER, size: 20 }),
    P("(Approbation des comptes de l'exercice clos le [31 décembre AAAA])", { italics: true, align: AlignmentType.CENTER, size: 18 }),
    Spacer(200),

    H1("Préambule"),
    P("Le [date], à [heure], les associés de la société EVENTY LIFE SAS se sont réunis en assemblée générale ordinaire annuelle au siège social, sur convocation du Président faite par [lettre simple / email avec accusé réception / autre selon statuts], conformément aux statuts."),

    H2("Composition de l'assemblée"),
    P("Sont présents ou représentés :"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Associé", "Nb actions", "% capital", "Présent / représenté"],
      rows: [
        ["David Eventy", "[Nb]", "[%]", "Présent"],
        ["[Associé 2 si applicable]", "[Nb]", "[%]", "[Présent / Représenté par...]"],
        ["[Associé 3 si applicable]", "[Nb]", "[%]", "[Présent / Représenté par...]"],
        ["TOTAL", "[Nb total]", "100 %", "—"],
      ],
    }),

    P("Le quorum requis par les statuts étant atteint (majorité simple ou autre selon clauses), l'assemblée peut valablement délibérer."),

    H2("Bureau de l'assemblée"),
    Bullet("Présidence : David Eventy, Président de la Société."),
    Bullet("Secrétariat : [Nom — généralement un associé ou un tiers de confiance]."),
    Bullet("Scrutateurs (si applicable) : [Noms]."),

    H2("Documents tenus à disposition"),
    P("Conformément aux articles L225-115 et L225-116 du Code de commerce (par renvoi des statuts SAS), ont été tenus à la disposition des associés au siège social pendant les 15 jours précédant l'assemblée :"),
    Bullet("Comptes annuels (bilan, compte de résultat, annexe)."),
    Bullet("Rapport de gestion du Président."),
    Bullet("Texte des résolutions proposées."),
    Bullet("Le cas échéant : rapport spécial du commissaire aux comptes."),
    Bullet("Tableau des résultats des cinq derniers exercices (le cas échéant)."),

    H2("Ordre du jour"),
    Numbered("Lecture du rapport de gestion du Président."),
    Numbered("Lecture du rapport spécial du commissaire aux comptes (le cas échéant)."),
    Numbered("Approbation des comptes annuels de l'exercice clos le [31 décembre AAAA]."),
    Numbered("Quitus au Président pour sa gestion de l'exercice écoulé."),
    Numbered("Affectation du résultat."),
    Numbered("Approbation des conventions réglementées (si applicable — article L227-10)."),
    Numbered("Renouvellement / nomination du commissaire aux comptes (si applicable)."),
    Numbered("Pouvoirs pour les formalités."),
    Numbered("Questions diverses."),

    H1("Délibérations et résolutions"),

    H2("Première résolution — Approbation des comptes annuels"),
    P("L'assemblée générale, après avoir entendu la lecture du rapport de gestion du Président [et du rapport spécial du commissaire aux comptes le cas échéant], approuve dans toutes leurs parties les comptes annuels de l'exercice clos le [31 décembre AAAA], tels qu'ils lui sont présentés, ainsi que les opérations traduites dans ces comptes ou résumées dans ces rapports."),
    P("Ces comptes font ressortir :"),
    Bullet("Total du bilan : [Montant] €."),
    Bullet("Capitaux propres : [Montant] €."),
    Bullet("Chiffre d'affaires HT : [Montant] €."),
    Bullet("Résultat net : [Bénéfice / Perte] de [Montant] €."),
    P("Cette résolution est adoptée à [l'unanimité / la majorité de [%]].", { italics: true }),

    H2("Deuxième résolution — Quitus au Président"),
    P("L'assemblée générale donne au Président, pour l'exercice clos le [31 décembre AAAA], quitus entier et sans réserve de l'exécution de son mandat."),
    P("Cette résolution est adoptée à [l'unanimité / la majorité de [%]].", { italics: true }),

    H2("Troisième résolution — Affectation du résultat"),
    P("L'assemblée générale décide d'affecter le résultat de l'exercice [bénéficiaire / déficitaire] de [Montant] € comme suit :"),
    makeTable({
      widths: [4680, 4680],
      header: ["Affectation", "Montant"],
      rows: [
        ["Réserve légale (5 % du bénéfice tant que < 10 % capital)", "[Montant] €"],
        ["Réserve volontaire 5 % CA risques tourisme (statutaire)", "[Montant] €"],
        ["Report à nouveau créditeur / débiteur", "[Montant] €"],
        ["Distribution de dividendes", "[Montant] € (ou Néant)"],
        ["TOTAL", "[Montant total] €"],
      ],
    }),
    P("Cette résolution est adoptée à [l'unanimité / la majorité de [%]].", { italics: true }),

    H2("Quatrième résolution — Conventions réglementées (le cas échéant)"),
    P("L'assemblée générale, statuant en application de l'article L227-10 du Code de commerce, après avoir pris connaissance du rapport du Président [et le cas échéant du commissaire aux comptes], approuve les conventions réglementées suivantes :"),
    Bullet("[Description précise de chaque convention — par ex. : « Convention de prestations de services entre la Société et la société [X] dont David Eventy est dirigeant — Montant annuel : [Y] € HT »]."),
    P("Cette résolution est adoptée à [l'unanimité / la majorité de [%]].", { italics: true }),

    H2("Cinquième résolution — Renouvellement du commissaire aux comptes (si applicable)"),
    P("[Si la Société atteint deux des trois seuils de l'article L227-9-1 du Code de commerce — bilan > 5 M€, CA HT > 10 M€, salariés > 50 — la nomination d'un commissaire aux comptes est obligatoire.]"),
    P("L'assemblée générale décide [de nommer / de renouveler / de ne pas renouveler] [Cabinet — N° d'inscription], en qualité de commissaire aux comptes titulaire, pour une durée de six (6) exercices."),
    P("Cette résolution est adoptée à [l'unanimité / la majorité de [%]].", { italics: true }),

    H2("Sixième résolution — Pouvoirs pour les formalités"),
    P("L'assemblée générale donne tous pouvoirs au porteur d'un original, d'une copie ou d'un extrait du présent procès-verbal pour effectuer toutes les formalités légales de dépôt, publicité et autres."),
    P("Cette résolution est adoptée à l'unanimité.", { italics: true }),

    H1("Clôture"),
    P("L'ordre du jour étant épuisé et personne ne demandant plus la parole, la séance est levée à [heure]."),
    P("De tout ce qui précède, il a été dressé le présent procès-verbal qui, après lecture, a été signé par le Président et le Secrétaire."),

    Spacer(280),
    P("Le Président                                                                  Le Secrétaire", { size: 18 }),
    P("David Eventy                                                                  [Nom]", { size: 18 }),
    Spacer(200),

    H1("Annexe — Comptes annuels et rapport de gestion"),
    Bullet("Bilan détaillé (actif/passif)."),
    Bullet("Compte de résultat détaillé."),
    Bullet("Annexe légale aux comptes annuels."),
    Bullet("Rapport de gestion du Président (document séparé — voir modèle dédié)."),
    Bullet("Le cas échéant : rapport spécial du commissaire aux comptes sur les conventions réglementées."),

    H1("Formalités post-AG"),
    Bullet("Dépôt des comptes annuels au greffe du tribunal de commerce dans le mois suivant l'approbation (article L232-21 Code commerce)."),
    Bullet("Publication d'un avis dans un journal d'annonces légales (si distribution de dividendes)."),
    Bullet("Mise à jour du registre des assemblées (registre coté et paraphé)."),
    Bullet("Conservation du PV original au siège social pendant 5 ans minimum (recommandé : durée de vie de la Société)."),
    Bullet("Si commissaire aux comptes nommé : déclaration auprès du H3C dans le mois."),

    Spacer(160),
    P("Document de référence — Modèle PV AGOA Version 1.0 — 30 avril 2026. À adapter chaque année.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Statuts SAS, Pacte d'associés, Rapport de gestion annuel, Comptes annuels, Note expert-comptable.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — RAPPORT DE GESTION ANNUEL
// ============================================================
function rapportGestionAnnuel() {
  return [
    bandeauTitre(
      "RAPPORT DE GESTION ANNUEL",
      "Modèle type — exercice clos le 31 décembre — Eventy Life SAS",
    ),
    Spacer(160),

    P("Le présent rapport de gestion est établi conformément aux articles L232-1 et suivants du Code de commerce. Il est présenté chaque année à l'assemblée générale ordinaire annuelle des associés de EVENTY LIFE SAS, en accompagnement des comptes annuels de l'exercice clos le 31 décembre.", { italics: true }),

    P("Ce document est un modèle-type, à adapter chaque année avec les chiffres réels et les événements propres à l'exercice écoulé. Il intègre les obligations spécifiques aux PME (article L232-1, version simplifiée) ainsi que les recommandations Atout France et APST en matière de transparence opérateur de voyages.", { italics: true }),

    H1("Identité de la Société"),
    Bullet("Dénomination : EVENTY LIFE SAS."),
    Bullet("Forme juridique : Société par actions simplifiée."),
    Bullet("Capital social : [Montant] € — [Nb actions] actions de [Nominal] € chacune."),
    Bullet("Siège social : [Adresse]."),
    Bullet("RCS : [Ville] [N° SIREN]."),
    Bullet("Activité : agence de voyages et plateforme SaaS — opérateur de voyages immatriculé Atout France n° [IM]."),
    Bullet("Garantie financière : APST — n° [Référence]."),
    Bullet("Président : David Eventy."),
    Bullet("Date de clôture : 31 décembre [Année]."),

    H1("1. Situation et évolution de la Société"),

    H2("1.1. Faits marquants de l'exercice"),
    P("Les faits marquants de l'exercice clos le 31 décembre [Année] sont les suivants :"),
    Bullet("[À compléter — par exemple : obtention de l'immatriculation Atout France le [date]]."),
    Bullet("[Adhésion à l'APST avec garantie initiale [Montant] le [date]]."),
    Bullet("[Souscription de la RC Pro Tourisme auprès de [Assureur] le [date]]."),
    Bullet("[Lancement commercial du catalogue le [date]]."),
    Bullet("[Premier voyage opéré le [date] — destination [Lieu]]."),
    Bullet("[Levée de fonds Seed de [Montant] € auprès de [Investisseurs] en [Mois]]."),
    Bullet("[Recrutements clés : [Nombre] collaborateurs salariés, [Nombre] partenaires créateurs, [Nombre] partenaires HRA]."),

    H2("1.2. Activité et chiffres clés"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Indicateur", "Exercice N", "Exercice N-1", "Variation"],
      rows: [
        ["Nombre de voyages opérés", "[Nb]", "[Nb]", "[%]"],
        ["Nombre de voyageurs", "[Nb]", "[Nb]", "[%]"],
        ["Chiffre d'affaires HT", "[Montant] €", "[Montant] €", "[%]"],
        ["Marge brute", "[Montant] €", "[Montant] €", "[%]"],
        ["Résultat d'exploitation", "[Montant] €", "[Montant] €", "[%]"],
        ["Résultat net", "[Montant] €", "[Montant] €", "[%]"],
        ["Effectif moyen", "[Nb]", "[Nb]", "[%]"],
      ],
    }),

    H2("1.3. Marchés et concurrence"),
    P("[À compléter — analyse synthétique du marché du voyage de groupe en France, position d'Eventy, concurrence directe (3-5 acteurs identifiés), avantages compétitifs maintenus / consolidés.]"),

    H1("2. Analyse de la situation financière"),

    H2("2.1. Bilan synthétique"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "31/12/N", "31/12/N-1"],
      rows: [
        ["Actif immobilisé", "[Montant] €", "[Montant] €"],
        ["Actif circulant", "[Montant] €", "[Montant] €"],
        ["Trésorerie", "[Montant] €", "[Montant] €"],
        ["TOTAL ACTIF", "[Montant] €", "[Montant] €"],
        ["Capitaux propres", "[Montant] €", "[Montant] €"],
        ["Provisions", "[Montant] €", "[Montant] €"],
        ["Dettes financières", "[Montant] €", "[Montant] €"],
        ["Dettes d'exploitation", "[Montant] €", "[Montant] €"],
        ["Fonds en transit (compte cantonné)", "[Montant] €", "[Montant] €"],
        ["TOTAL PASSIF", "[Montant] €", "[Montant] €"],
      ],
    }),

    H2("2.2. Compte de résultat synthétique"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Poste", "Exercice N", "Exercice N-1"],
      rows: [
        ["Chiffre d'affaires HT", "[Montant] €", "[Montant] €"],
        ["Achats consommés (HRA, transport, etc.)", "[Montant] €", "[Montant] €"],
        ["Marge brute", "[Montant] €", "[Montant] €"],
        ["Charges externes", "[Montant] €", "[Montant] €"],
        ["Charges de personnel", "[Montant] €", "[Montant] €"],
        ["Impôts et taxes", "[Montant] €", "[Montant] €"],
        ["Dotations amortissements et provisions", "[Montant] €", "[Montant] €"],
        ["Résultat d'exploitation", "[Montant] €", "[Montant] €"],
        ["Résultat financier", "[Montant] €", "[Montant] €"],
        ["Résultat exceptionnel", "[Montant] €", "[Montant] €"],
        ["Impôt sur les sociétés", "[Montant] €", "[Montant] €"],
        ["Résultat net", "[Montant] €", "[Montant] €"],
      ],
    }),

    H2("2.3. Indicateurs financiers clés"),
    Bullet("Marge brute / CA : [%]."),
    Bullet("Résultat net / CA : [%]."),
    Bullet("Trésorerie nette : [Montant] € soit [Nb] mois de charges."),
    Bullet("Dettes financières / capitaux propres : [Ratio]."),
    Bullet("Délai moyen client : [Nb jours]."),
    Bullet("Délai moyen fournisseur : [Nb jours]."),

    H1("3. Activité tourisme — indicateurs réglementaires"),

    H2("3.1. Fonds en transit (compte cantonné APST)"),
    Bullet("Solde au 31/12/N : [Montant] €."),
    Bullet("Pic de l'année (jour de pic) : [Montant] € (le [date])."),
    Bullet("Garantie APST en vigueur : [Montant] €."),
    Bullet("Marge de sécurité : pic / garantie = [%] (cible ≤ 100 %)."),

    H2("3.2. Volumétrie opérationnelle"),
    Bullet("Voyages opérés sur l'exercice : [Nb]."),
    Bullet("Voyageurs accueillis : [Nb]."),
    Bullet("Destinations distinctes : [Nb]."),
    Bullet("Partenaires HRA actifs : [Nb]."),
    Bullet("Créateurs et vendeurs actifs : [Nb] / [Nb]."),

    H2("3.3. Qualité et e-réputation"),
    Bullet("NPS moyen voyageurs : [+ XX]."),
    Bullet("Taux de réclamation : [%]."),
    Bullet("Délai moyen résolution réclamation : [Nb jours]."),
    Bullet("Note moyenne Trustpilot : [X.X / 5]."),
    Bullet("Audits qualité HRA réalisés : [Nb]."),

    H2("3.4. Conformité"),
    Bullet("Renouvellement IM Atout France : [Statut]."),
    Bullet("Renouvellement adhésion APST : [Statut]."),
    Bullet("RC Pro Tourisme : [Statut, plafonds en vigueur]."),
    Bullet("Audit annuel APST passé le [date] — décision : [maintien / ajustement] de la garantie."),
    Bullet("Aucune réclamation officielle voyageur déposée à la MTV / Aucun litige judiciaire."),

    H1("4. Recherche et développement / innovation"),
    Bullet("Statut JEI : [actif / en demande / non applicable]."),
    Bullet("Investissements R&D plateforme : [Montant] € — [%] du CA."),
    Bullet("Crédit Impôt Recherche obtenu : [Montant] € (sous réserve du contrôle fiscal)."),
    Bullet("Fonctionnalités majeures déployées : [Liste]."),
    Bullet("Fonctionnalités prévues N+1 : [Liste]."),

    H1("5. Risques et incertitudes"),
    P("Les principaux risques auxquels la Société est exposée sont :"),
    Bullet("Risque de marché (volatilité de la demande, sensibilité aux crises géopolitiques et sanitaires)."),
    Bullet("Risque opérationnel (incident voyage, défaillance fournisseur HRA)."),
    Bullet("Risque réglementaire (évolution Code Tourisme, RGPD, loi influenceurs)."),
    Bullet("Risque financier (volatilité de la trésorerie en transit, BFR)."),
    Bullet("Risque cyber (attaque sur la plateforme, fuite de données)."),
    P("Le détail de la cartographie des risques et des mesures de mitigation figure dans le Plan de continuité d'activité (document séparé, mis à jour annuellement)."),

    H1("6. Événements postérieurs à la clôture"),
    P("[À compléter — événements survenus entre le 31/12/N et la date de signature du présent rapport. Si néant : « Aucun événement postérieur significatif n'est à signaler. »]"),

    H1("7. Évolution prévisible et perspectives N+1"),
    Bullet("CA cible N+1 : [Montant] € soit [%] de croissance."),
    Bullet("Voyages cibles N+1 : [Nb]."),
    Bullet("Garantie APST cible N+1 : [Montant] €."),
    Bullet("Recrutements N+1 : [Détail]."),
    Bullet("Investissements technologiques N+1 : [Détail]."),
    Bullet("Initiatives commerciales / marketing : [Détail]."),
    Bullet("Levées de fonds prévues : [Statut, montant cible]."),

    H1("8. Affectation du résultat — proposition"),
    P("Le Président propose à l'assemblée générale d'affecter le résultat [bénéficiaire / déficitaire] de [Montant] € comme suit :"),
    Bullet("Réserve légale (5 % du bénéfice tant que < 10 % capital) : [Montant] €."),
    Bullet("Réserve volontaire 5 % CA risques tourisme (clause statutaire) : [Montant] €."),
    Bullet("Report à nouveau : [Montant] €."),
    Bullet("Distribution de dividendes : [Montant] € (ou Néant)."),

    H1("9. Conventions réglementées"),
    P("Conformément à l'article L227-10 du Code de commerce, le Président informe les associés des conventions intervenues directement ou par personne interposée entre la Société et :"),
    Bullet("Le Président."),
    Bullet("Tout autre dirigeant."),
    Bullet("Tout associé disposant de plus de 10 % des droits de vote."),
    Bullet("Toute société contrôlant la Société."),
    P("Conventions de l'exercice : [Liste détaillée — ou « Néant » si aucune convention »]."),

    H1("10. Tableaux annexes obligatoires"),
    Bullet("Tableau des résultats des cinq derniers exercices (le cas échéant — première publication progressive)."),
    Bullet("Tableau des affectations du résultat."),
    Bullet("État des cautions, avals et garanties (article R225-83)."),
    Bullet("Liste des participations dans d'autres sociétés (article L233-6)."),
    Bullet("État des immobilisations et amortissements."),

    Spacer(280),
    P("Fait à [Lieu], le [Date].", { italics: true, size: 18 }),
    Spacer(200),
    P("Le Président", { size: 18 }),
    P("David Eventy", { size: 18 }),

    Spacer(160),
    P("Document de référence — Modèle Rapport de gestion Version 1.0 — 30 avril 2026. À adapter chaque exercice.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Statuts SAS, PV d'AG ordinaire annuelle, Comptes annuels, Note expert-comptable, Tableau de bord opérationnel, Plan de continuité d'activité.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-DPA-Sous-Traitance-RGPD.docx",
      title: "Eventy Life — DPA Contrat de sous-traitance RGPD",
      description: "Modèle DPA conforme article 28 RGPD pour les sous-traitants Eventy Life.",
      footer: "EVENTY LIFE SAS — DPA Sous-traitance RGPD",
      children: dpaSousTraitance(),
    },
    {
      file: "docs/garanties/Eventy-Life-PV-Assemblee-Generale.docx",
      title: "Eventy Life — Modèle PV d'assemblée générale ordinaire annuelle",
      description: "Modèle PV AGOA pour approbation des comptes annuels.",
      footer: "EVENTY LIFE SAS — PV AGOA · Modèle type",
      children: pvAssembleeGenerale(),
    },
    {
      file: "docs/garanties/Eventy-Life-Rapport-Gestion-Annuel.docx",
      title: "Eventy Life — Modèle de rapport de gestion annuel",
      description: "Modèle rapport de gestion annuel conforme Code commerce L232-1.",
      footer: "EVENTY LIFE SAS — Rapport de gestion annuel · Modèle type",
      children: rapportGestionAnnuel(),
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
