/**
 * Eventy Life — Trois documents éthique / conformité
 *
 *   1. Politique anti-corruption (esprit Sapin 2 — adapté PME)
 *   2. Procédure de signalement / lanceurs d'alerte (loi Waserman)
 *   3. Politique d'accessibilité PMR détaillée
 *
 * Usage : node scripts/garanties/build-conformite-ethique.js
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
// DOCUMENT 1 — POLITIQUE ANTI-CORRUPTION
// ============================================================
function politiqueAntiCorruption() {
  return [
    bandeauTitre(
      "POLITIQUE ANTI-CORRUPTION EVENTY LIFE",
      "Engagements éthiques inspirés de la loi Sapin 2 — adaptés PME",
    ),
    Spacer(160),

    P("La présente politique anti-corruption formalise les engagements d'EVENTY LIFE SAS contre toute forme de corruption, de trafic d'influence, de concussion et de favoritisme. Bien qu'EVENTY LIFE ne soit pas formellement assujettie à la loi n° 2016-1691 du 9 décembre 2016 dite « Sapin 2 » (qui s'applique aux entreprises de plus de 500 salariés et de plus de 100 M€ de CA), elle souhaite intégrer dès sa création les principes structurants de cette loi.", { italics: true }),

    P("Cette posture exigeante est cohérente avec les valeurs éthiques de l'entreprise (politique RSE, charte fournisseurs) et elle est attendue par les partenaires institutionnels (APST, Atout France, banque domiciliataire, investisseurs ESG, organismes de subventions publiques).", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Loi n° 2016-1691 du 9 décembre 2016 dite « Sapin 2 » (esprit, sans assujettissement formel)."),
    Bullet("Articles 433-1 à 433-25 du Code pénal — corruption d'agent public et privé, trafic d'influence, prise illégale d'intérêts."),
    Bullet("Convention OCDE sur la lutte contre la corruption d'agents publics étrangers."),
    Bullet("UN Global Compact — principe 10 sur la lutte contre la corruption."),
    Bullet("Politique RSE Eventy Life (pilier gouvernance)."),

    H1("2. Définitions"),

    H2("2.1. Corruption"),
    P("La corruption désigne le fait, pour une personne, de proposer, donner ou recevoir un avantage indu en contrepartie d'un acte ou d'une abstention dans le cadre de ses fonctions. Elle peut être active (proposer) ou passive (recevoir)."),

    H2("2.2. Trafic d'influence"),
    P("Le trafic d'influence désigne le fait de monnayer une influence, réelle ou supposée, sur une décision publique ou privée."),

    H2("2.3. Concussion"),
    P("La concussion désigne l'exigence ou la perception d'un avantage indu par un agent public dans l'exercice de ses fonctions."),

    H2("2.4. Favoritisme"),
    P("Le favoritisme désigne le fait d'accorder un avantage indu à un tiers (fournisseur, partenaire, client) en dehors des règles applicables."),

    H1("3. Engagements d'Eventy Life"),

    H2("3.1. Tolérance zéro"),
    P("EVENTY LIFE SAS adopte une politique de tolérance zéro vis-à-vis de toute pratique de corruption, de trafic d'influence, de concussion ou de favoritisme. Tout fait avéré entraîne :"),
    Bullet("Pour un collaborateur ou prestataire interne : sanction disciplinaire pouvant aller jusqu'au licenciement pour faute grave et signalement aux autorités compétentes."),
    Bullet("Pour un partenaire HRA, transporteur ou indépendant : déréférencement immédiat et action en dommages-intérêts."),
    Bullet("Pour le dirigeant lui-même : action en justice et démission ad nutum."),

    H2("3.2. Cas d'usage et règles précises"),

    H3("3.2.1. Cadeaux et invitations"),
    Bullet("Aucun cadeau ni invitation d'une valeur supérieure à 30 € ne peut être accepté ou offert sans autorisation écrite préalable du Président."),
    Bullet("Sont autorisés sans formalité : cafés, déjeuners professionnels (jusqu'à 50 €/personne), petits attentions de courtoisie (fleurs, cartes de visite, échantillons)."),
    Bullet("Sont interdits : invitations à des événements personnels (week-ends, voyages d'agrément), cadeaux en espèces ou équivalent, cadeaux pendant une procédure de référencement ou de négociation."),

    H3("3.2.2. Paiements de facilitation"),
    Bullet("Refus catégorique de tout paiement de facilitation à un agent public ou privé pour accélérer une procédure ordinaire."),
    Bullet("En cas de sollicitation d'un tel paiement (pratique parfois rencontrée à l'étranger) : refus immédiat, signalement au Président, signalement aux autorités françaises (DGCCRF, ambassade)."),

    H3("3.2.3. Sponsoring et mécénat"),
    Bullet("Sponsoring uniquement avec partenaires loyaux et publics, jamais en lien avec une procédure réglementaire en cours."),
    Bullet("Mécénat conforme aux dispositions du Code général des impôts (article 238 bis)."),
    Bullet("Aucun versement à des partis politiques ou candidats à des fonctions publiques."),

    H3("3.2.4. Conflits d'intérêts"),
    Bullet("Tout collaborateur ou dirigeant déclare au Président tout conflit d'intérêts potentiel (lien familial avec un fournisseur, intérêt financier dans une entreprise tierce)."),
    Bullet("Le Président prend les mesures appropriées (récusation, transparence, supervision)."),
    Bullet("Tenue d'un registre interne des conflits d'intérêts déclarés."),

    H3("3.2.5. Recrutement et carrière"),
    Bullet("Recrutement basé exclusivement sur les compétences et l'adéquation au poste, sans favoritisme familial ou amical."),
    Bullet("Promotions et primes basées sur des critères objectifs documentés."),
    Bullet("Pas d'embauche de proche d'un fournisseur, partenaire ou autorité de contrôle sans information préalable du Président."),

    H1("4. Cartographie des risques de corruption"),
    makeTable({
      widths: [3500, 1500, 1500, 2860],
      header: ["Risque", "Probabilité", "Impact", "Mesures de prévention"],
      rows: [
        ["Sollicitation d'un cadeau par un partenaire HRA pour référencement préférentiel", "Faible", "Modéré", "Procédure d'audit qualité formalisée · pluralité de fournisseurs · refus écrit"],
        ["Paiement de facilitation à un fonctionnaire local (visa, autorisation tourisme)", "Très faible", "Élevé", "Refus immédiat · signalement Président · documentation"],
        ["Conflit d'intérêts non déclaré (proche du dirigeant fournisseur Eventy)", "Faible", "Modéré", "Registre des conflits · déclaration obligatoire annuelle"],
        ["Sponsoring déguisé en contrepartie d'un avantage", "Très faible", "Élevé", "Validation Président pour tout sponsoring > 1 K€"],
        ["Cadeau personnel à un voyageur en échange d'un avis positif", "Très faible", "Élevé", "Politique avis voyageurs (zéro avis rémunéré)"],
        ["Détournement de fonds clients", "Très faible", "Critique", "Cantonnement Stripe Connect · double signature > 5 K€ · audit"],
      ],
    }),

    H1("5. Dispositif de prévention"),

    H2("5.1. Code de conduite"),
    Bullet("La présente politique est annexée à tout contrat de travail Eventy."),
    Bullet("La charte fournisseurs reprend les engagements anti-corruption (Article 1 — Probité)."),
    Bullet("Les contrats partenaires (Vendeur, Créateur, HRA) intègrent une clause anti-corruption."),

    H2("5.2. Formation et sensibilisation"),
    Bullet("Sensibilisation lors de l'onboarding de tout collaborateur."),
    Bullet("Module dédié dans la formation continue annuelle (1 heure)."),
    Bullet("Communication interne en cas d'évolution réglementaire."),

    H2("5.3. Procédure de signalement"),
    P("Tout collaborateur, prestataire ou tiers ayant connaissance d'un fait pouvant relever de la corruption ou d'une infraction connexe est invité à le signaler conformément à la procédure de signalement / lanceurs d'alerte (document dédié)."),

    H1("6. Sanctions"),
    Bullet("Manquement avéré : sanction disciplinaire proportionnée (avertissement, suspension, licenciement pour faute grave)."),
    Bullet("Faute pénalement répréhensible : signalement aux autorités (procureur de la République)."),
    Bullet("Préjudice financier subi par Eventy ou par un tiers : action en réparation."),
    Bullet("Pour les partenaires : déréférencement immédiat et résiliation du contrat-cadre."),

    H1("7. Engagement du dirigeant"),
    P("Le dirigeant d'EVENTY LIFE SAS s'engage personnellement à :"),
    Bullet("Promouvoir activement la culture éthique au sein de l'entreprise et auprès des partenaires."),
    Bullet("Faire respecter la présente politique sans exception, y compris à son propre niveau."),
    Bullet("Coopérer pleinement avec toute autorité de contrôle ou enquête."),
    Bullet("Réviser annuellement la présente politique en fonction des évolutions réglementaires et des incidents constatés."),

    Spacer(160),
    P("Document de référence interne et externe — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE (pilier gouvernance) · Charte fournisseurs (Article 1) · Procédure de signalement / lanceurs d'alerte.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PROCÉDURE DE SIGNALEMENT / LANCEURS D'ALERTE
// ============================================================
function procedureSignalement() {
  return [
    bandeauTitre(
      "PROCÉDURE DE SIGNALEMENT EVENTY LIFE",
      "Lanceurs d'alerte · loi Waserman du 21 mars 2022 · directive UE 2019/1937",
    ),
    Spacer(160),

    P("La présente procédure de signalement formalise le dispositif d'EVENTY LIFE SAS pour permettre à tout lanceur d'alerte de signaler, en toute sécurité, un fait délictueux ou contraire à l'éthique. Elle est conforme à la loi n° 2022-401 du 21 mars 2022 dite « loi Waserman » et à la directive (UE) 2019/1937 sur la protection des personnes signalant des violations.", { italics: true }),

    H1("1. Cadre légal"),
    Bullet("Loi n° 2022-401 du 21 mars 2022 visant à améliorer la protection des lanceurs d'alerte (loi Waserman)."),
    Bullet("Loi n° 2016-1691 du 9 décembre 2016 dite « Sapin 2 » (esprit)."),
    Bullet("Directive (UE) 2019/1937 du 23 octobre 2019 sur la protection des personnes signalant des violations du droit de l'Union."),
    Bullet("Décret n° 2022-1284 du 3 octobre 2022 — modalités d'application."),

    H1("2. Champ d'application"),

    H2("2.1. Personnes protégées"),
    Bullet("Collaborateurs salariés et non salariés d'EVENTY LIFE SAS."),
    Bullet("Anciens collaborateurs (jusqu'à 12 mois après la fin du contrat)."),
    Bullet("Candidats à un emploi qui auraient eu connaissance de faits dans le cadre du recrutement."),
    Bullet("Partenaires HRA, transporteurs, indépendants (créateurs, vendeurs, accompagnateurs) liés contractuellement."),
    Bullet("Stagiaires, alternants, intervenants ponctuels."),
    Bullet("Toute personne ayant eu accès aux informations dans le cadre de sa relation avec Eventy."),

    H2("2.2. Faits pouvant être signalés"),
    Bullet("Crime ou délit (corruption, trafic d'influence, fraude, abus de confiance, etc.)."),
    Bullet("Violation grave et manifeste d'une loi ou d'un règlement (Code Tourisme, Code consommation, RGPD, droit du travail, droit fiscal)."),
    Bullet("Menace pour l'intérêt général (sécurité, santé, environnement)."),
    Bullet("Menace pour les voyageurs (sécurité physique, données personnelles, droits)."),
    Bullet("Manquement éthique caractérisé (corruption, discrimination, harcèlement, atteinte aux droits humains)."),
    Bullet("Menace pour la stabilité financière d'Eventy (détournement de fonds, fraude comptable)."),

    H2("2.3. Faits ne pouvant pas être signalés"),
    Bullet("Désaccord opérationnel courant (préfèrer la voie hiérarchique habituelle)."),
    Bullet("Plainte personnelle non liée à un manquement éthique ou légal."),
    Bullet("Information couverte par le secret de la défense nationale, le secret médical, le secret de l'avocat."),

    H1("3. Canaux de signalement"),

    H2("3.1. Canal interne (préféré)"),
    P("Le canal interne est le premier recours. Il garantit la traçabilité, la confidentialité et le traitement rapide."),
    Bullet("Email dédié : alerte@eventylife.fr (boîte aux lettres confidentielle, accès restreint au Président)."),
    Bullet("Courrier postal au siège social, à l'attention du Président, sous double enveloppe avec mention « Confidentiel — alerte »."),
    Bullet("Possibilité d'anonymat — Eventy s'engage à traiter les signalements anonymes avec la même diligence."),

    H2("3.2. Canal externe (en cas de blocage du canal interne)"),
    P("Si le canal interne est bloqué, défaillant ou inaccessible, le lanceur d'alerte peut saisir directement les autorités compétentes :"),
    Bullet("Défenseur des droits — defenseurdesdroits.fr/lanceur-alerte."),
    Bullet("Autorité compétente selon la nature du fait : DGCCRF (concurrence/consommation), CNIL (RGPD), AFA (Agence française anticorruption), procureur de la République."),
    Bullet("Médiation Tourisme et Voyage (MTV) pour les manquements liés à un voyage."),

    H2("3.3. Divulgation publique (recours ultime)"),
    P("Le lanceur d'alerte peut, en dernier recours et sous certaines conditions strictes (loi Waserman article 8), procéder à une divulgation publique. Cette voie est réservée aux situations où les canaux interne et externe ont échoué ou présentent un risque imminent."),

    H1("4. Traitement du signalement"),

    H2("4.1. Étape 1 — Accusé de réception (sous 7 jours)"),
    P("EVENTY accuse réception de tout signalement dans un délai de 7 jours ouvrés à compter de sa réception. L'accusé de réception est confidentiel et indique :"),
    Bullet("La date de réception."),
    Bullet("L'identité de l'agent en charge (par défaut : Président d'Eventy ; en cas de conflit d'intérêt impliquant le Président, l'avocat tourisme partenaire)."),
    Bullet("Le rappel des protections légales du lanceur d'alerte."),

    H2("4.2. Étape 2 — Évaluation et instruction (sous 30 jours)"),
    Bullet("Évaluation préliminaire de la recevabilité du signalement (champ d'application, fondement)."),
    Bullet("Si recevable : ouverture d'un dossier interne avec numéro ALERTE-[YYYYMM]-[####]."),
    Bullet("Collecte de pièces (avec respect strict de la confidentialité)."),
    Bullet("Le cas échéant, investigations complémentaires (entretiens confidentiels, vérifications documentaires)."),
    Bullet("Si nécessaire, conseil de l'avocat tourisme partenaire ou d'un avocat pénaliste."),

    H2("4.3. Étape 3 — Décision et action (sous 90 jours)"),
    Bullet("Décision sur le fondement du signalement (avéré, partiellement avéré, non avéré)."),
    Bullet("Si avéré : prise des mesures appropriées (sanction disciplinaire, déréférencement partenaire, action en justice, signalement aux autorités compétentes)."),
    Bullet("Si non avéré : classement motivé du dossier."),
    Bullet("Information du lanceur d'alerte sur la suite donnée (sans dévoiler les sanctions individuelles si tiers concernés)."),

    H1("5. Protection du lanceur d'alerte"),

    H2("5.1. Confidentialité"),
    Bullet("L'identité du lanceur d'alerte est strictement confidentielle. Elle ne peut être divulguée qu'avec son consentement, sauf obligation légale (autorité judiciaire)."),
    Bullet("Tout document contenant l'identité du lanceur d'alerte est conservé dans un dossier sécurisé à accès restreint."),
    Bullet("Toute violation de la confidentialité par un collaborateur Eventy entraîne une sanction disciplinaire."),

    H2("5.2. Protection contre les représailles"),
    P("Conformément à la loi Waserman, EVENTY garantit l'absence de représailles à l'encontre du lanceur d'alerte de bonne foi. Sont notamment interdits :"),
    Bullet("Le licenciement, la non-reconduction du contrat, la non-titularisation."),
    Bullet("La mutation, la rétrogradation, la baisse de salaire."),
    Bullet("Les sanctions disciplinaires injustifiées."),
    Bullet("L'intimidation, le harcèlement, la mise à l'écart."),
    Bullet("La résiliation d'un contrat de partenariat (HRA, vendeur, créateur, accompagnateur) en raison du signalement."),
    P("Toute mesure de représailles donnera lieu à indemnisation et est nulle de plein droit."),

    H2("5.3. Aide et soutien"),
    Bullet("Aide juridique possible via l'avocat tourisme partenaire."),
    Bullet("Soutien psychologique : orientation vers des structures spécialisées (Maison des Lanceurs d'Alerte, etc.)."),
    Bullet("Maintien de la rémunération en cas de procédure judiciaire."),

    H1("6. Sanctions des fausses alertes"),
    P("La protection des lanceurs d'alerte est conditionnée à leur bonne foi. En cas de signalement manifestement abusif (fausse accusation pour nuire à un tiers, intention de chantage), EVENTY se réserve la possibilité d'engager des actions disciplinaires et/ou judiciaires contre l'auteur du signalement abusif."),
    P("La bonne foi est présumée — c'est à EVENTY de prouver l'abus le cas échéant."),

    H1("7. Tenue d'un registre confidentiel"),
    Bullet("Tous les signalements reçus sont enregistrés dans un registre confidentiel tenu par le Président."),
    Bullet("Le registre comprend : numéro de dossier, date, nature, statut, décision finale."),
    Bullet("Conservation : 5 ans après la clôture du dossier."),
    Bullet("Accès restreint : Président + avocat tourisme partenaire (en cas de conflit d'intérêt)."),

    H1("8. Communication et formation"),
    Bullet("La présente procédure est communiquée à tout nouveau collaborateur lors de l'onboarding."),
    Bullet("Elle est annexée aux contrats partenaires (Vendeur, Créateur, HRA)."),
    Bullet("Elle est publiée sur eventylife.fr (rubrique « Éthique et conformité »)."),
    Bullet("Sensibilisation annuelle de l'équipe interne et des accompagnateurs (module 30 minutes)."),

    Spacer(160),
    P("Document de référence interne et externe — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Contact : alerte@eventylife.fr — Confidentialité garantie — Anonymat possible.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — POLITIQUE D'ACCESSIBILITÉ PMR
// ============================================================
function politiqueAccessibilite() {
  return [
    bandeauTitre(
      "POLITIQUE D'ACCESSIBILITÉ PMR EVENTY LIFE",
      "Engagement pour les voyageurs en situation de handicap ou à mobilité réduite",
    ),
    Spacer(160),

    P("EVENTY LIFE SAS s'engage à rendre le voyage de groupe accessible aux personnes en situation de handicap ou à mobilité réduite (PMR), dans la mesure du possible compte tenu des contraintes spécifiques au transport collectif et aux destinations. La présente politique formalise cet engagement et les modalités opérationnelles correspondantes.", { italics: true }),

    P("Cette politique est cohérente avec la loi n° 2005-102 du 11 février 2005 pour l'égalité des droits et des chances, la directive européenne sur les voyages à forfait (UE) 2015/2302 (article 5 — information précontractuelle sur l'accessibilité), et la convention des Nations Unies relative aux droits des personnes handicapées.", { italics: true }),

    H1("1. Engagement général"),
    Bullet("Aucun voyageur n'est refusé en raison de son handicap ou de sa mobilité réduite — sauf circonstance exceptionnelle dûment motivée et préalablement notifiée."),
    Bullet("Information transparente et honnête sur le niveau d'accessibilité réel de chaque voyage (article L211-9 du Code du Tourisme)."),
    Bullet("Mise en place de mesures d'accommodement raisonnables pour permettre la participation au voyage."),
    Bullet("Respect de la dignité et de la confidentialité des informations sensibles relatives au handicap."),

    H1("2. Information précontractuelle sur l'accessibilité"),

    H2("2.1. Sur chaque fiche voyage"),
    Bullet("Pictogramme synthétique d'accessibilité (« accessible PMR fauteuil roulant », « accessible PMR avec accompagnement », « accessibilité limitée »)."),
    Bullet("Description détaillée des points d'attention par étape (transport, hébergement, restauration, activités)."),
    Bullet("Mention explicite des éventuelles contraintes (escaliers, sentiers escarpés, distance à pied, etc.)."),
    Bullet("Information sur la possibilité ou non d'accueillir un fauteuil roulant manuel ou électrique."),
    Bullet("Information sur la possibilité d'accueillir une aide humaine (accompagnant)."),

    H2("2.2. Lors de la réservation"),
    Bullet("Champ obligatoire pour signaler tout besoin spécifique (fauteuil, aide humaine, animal d'assistance, traitement médical, etc.)."),
    Bullet("Confirmation par l'équipe Eventy de la faisabilité du voyage compte tenu des besoins signalés (sous 48 h)."),
    Bullet("Le cas échéant, propositions d'adaptation ou orientation vers un voyage alternatif plus adapté."),

    H2("2.3. Avant le départ"),
    Bullet("Information détaillée sur le déroulement (horaires, hébergement, repas, activités) avec niveau d'accessibilité confirmé."),
    Bullet("Mise en relation directe avec l'accompagnateur en cas de besoin spécifique."),
    Bullet("Information sur les contacts d'urgence locaux (hôpitaux, services d'aide à mobilité)."),

    H1("3. Mesures opérationnelles"),

    H2("3.1. Transport"),
    Bullet("Privilège donné aux autocars Grand Tourisme équipés de plateformes élévatrices (sur destinations le permettant)."),
    Bullet("Sièges adaptés réservables pour les voyageurs en situation de handicap."),
    Bullet("Cale-bagages spéciaux pour fauteuils roulants démontables."),
    Bullet("Sur les vols charter ou groupes : coordination avec la compagnie aérienne pour assistance PMR."),
    Bullet("Sur les transferts locaux : prévision de véhicules adaptés si nécessaire (véhicules à plancher abaissé, taxis PMR)."),

    H2("3.2. Hébergement"),
    Bullet("Référencement prioritaire des hôtels disposant de chambres PMR conformes (douche italienne, barres d'appui, ascenseur, accès au lobby)."),
    Bullet("Vérification systématique en audit qualité initial du HRA (voir Procédure d'audit qualité HRA)."),
    Bullet("Communication transparente sur le nombre de chambres PMR disponibles par hôtel partenaire."),
    Bullet("En cas de séjour multi-hôtels : vérification de la chaîne d'accessibilité complète."),

    H2("3.3. Restauration"),
    Bullet("Accessibilité des restaurants partenaires vérifiée en audit qualité."),
    Bullet("Adaptation des régimes alimentaires aux pathologies signalées (diabète, allergies sévères, intolérances)."),
    Bullet("Coordination avec le restaurateur en amont du voyage."),

    H2("3.4. Activités et excursions"),
    Bullet("Information précise sur le niveau de difficulté physique de chaque activité."),
    Bullet("Proposition d'activités alternatives accessibles à chaque étape du programme."),
    Bullet("Aucune activité n'est imposée — le voyageur peut toujours choisir de s'abstenir sans surcoût."),
    Bullet("Encouragement à la participation, mais respect du rythme de chacun."),

    H2("3.5. Accompagnement humain"),
    Bullet("L'accompagnateur Eventy est sensibilisé à l'accueil des voyageurs PMR."),
    Bullet("En cas de besoin spécifique signalé, briefing dédié de l'accompagnateur avant le départ."),
    Bullet("Disponibilité accrue de l'accompagnateur pour les voyageurs en situation de handicap (sans surcoût)."),
    Bullet("Possibilité pour le voyageur d'être accompagné d'un aidant familial (à signaler, conditions à confirmer)."),

    H1("4. Animaux d'assistance"),
    Bullet("Les animaux d'assistance (chiens guides, chiens d'aveugle, chiens d'aide aux personnes en situation de handicap) sont acceptés sans surcoût."),
    Bullet("Le voyageur signale la présence de l'animal au moment de la réservation."),
    Bullet("Vérification préalable de la compatibilité avec les hébergements et transports prévus."),
    Bullet("Document à fournir : certificat d'éducation de l'animal (pour les chiens guides, par exemple)."),

    H1("5. Tarification et accessibilité financière"),
    Bullet("Aucun surcoût appliqué au voyageur en raison de son handicap ou de sa mobilité réduite."),
    Bullet("L'aidant familial éventuel paie le voyage au tarif normal (pas de réduction systématique, sauf cas exceptionnel à étudier)."),
    Bullet("Acceptation des chèques ANCV (à compter de leur intégration dans le dispositif Eventy)."),
    Bullet("Études de solutions de financement avec partenaires institutionnels (mutuelles, MDPH, etc.) en An 2-3."),

    H1("6. Limites et transparence"),
    P("Eventy reconnaît honnêtement que tous les voyages ne sont pas accessibles à toutes les situations de handicap. Cette transparence est essentielle :"),
    Bullet("Certaines destinations comportent des contraintes physiques incompatibles avec une mobilité très réduite (médinas pavées, sentiers escarpés, monuments avec escaliers)."),
    Bullet("Certains pays disposent d'infrastructures PMR moins développées que la France."),
    Bullet("La capacité d'accueil PMR par voyage est limitée (généralement 2 à 3 voyageurs PMR par bus)."),
    P("Plutôt que d'afficher une accessibilité fictive, Eventy préfère communiquer honnêtement et orienter chaque voyageur vers le voyage le plus adapté à sa situation."),

    H1("7. Indicateurs et engagement de progrès"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 5"],
      rows: [
        ["% de voyages avec accessibilité PMR documentée", "100 %", "100 %"],
        ["% de voyages accessibles PMR fauteuil roulant", "≥ 30 %", "≥ 60 %"],
        ["Voyageurs PMR ayant participé à un voyage", "≥ 50/an", "≥ 1 000/an"],
        ["Note de satisfaction voyageurs PMR (NPS)", "≥ + 60", "≥ + 70"],
        ["Réclamations voyageurs PMR", "≤ 2 % des voyageurs PMR", "≤ 1 %"],
        ["Hôtels partenaires avec chambres PMR conformes", "≥ 50 %", "≥ 80 %"],
        ["Formation accompagnateurs accueil PMR", "100 %", "100 %"],
      ],
    }),

    H1("8. Partenariats et certifications"),
    Bullet("Étude d'adhésion à l'organisation Tourisme et Handicap (label national) à compter de l'An 2."),
    Bullet("Partenariats potentiels avec associations de personnes handicapées (APF France handicap, etc.)."),
    Bullet("Sensibilisation et formation des accompagnateurs en partenariat avec ces associations."),

    H1("9. Recours et médiation"),
    Bullet("En cas de difficulté ou de mécontentement, le voyageur peut adresser une réclamation à reclamation@eventylife.fr (procédure standard)."),
    Bullet("Médiation gratuite via la Médiation Tourisme et Voyage (MTV)."),
    Bullet("Le cas échéant, signalement au Défenseur des droits (saisine pour discrimination)."),

    Spacer(160),
    P("Document de référence interne et externe — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RSE Eventy (pilier social), Charte qualité accompagnateur, Procédure d'audit qualité HRA, CGV Article 12 (Pack Sérénité).", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Anti-Corruption.docx",
      title: "Eventy Life — Politique anti-corruption",
      description: "Politique anti-corruption inspirée de la loi Sapin 2.",
      footer: "EVENTY LIFE SAS — Politique anti-corruption",
      children: politiqueAntiCorruption(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Signalement.docx",
      title: "Eventy Life — Procédure de signalement / lanceurs d'alerte",
      description: "Procédure de signalement conforme à la loi Waserman.",
      footer: "EVENTY LIFE SAS — Procédure signalement · Confidentielle",
      children: procedureSignalement(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Accessibilite-PMR.docx",
      title: "Eventy Life — Politique d'accessibilité PMR",
      description: "Politique d'accessibilité pour les voyageurs en situation de handicap ou à mobilité réduite.",
      footer: "EVENTY LIFE SAS — Politique accessibilité PMR",
      children: politiqueAccessibilite(),
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
