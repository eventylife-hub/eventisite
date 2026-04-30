/**
 * Eventy Life — Trois documents complémentaires à destination du voyageur
 *
 *   1. Politique de Confidentialité RGPD complète
 *   2. Politique Cookies
 *   3. Information précontractuelle voyageur (formulaire arrêté du 1er mars 2018)
 *
 * Usage : node scripts/garanties/build-voyageur-docs.js
 */

const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Footer,
  AlignmentType,
  LevelFormat,
  PageNumber,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  TabStopType,
  TabStopPosition,
} = require("docx");

const COLOR = {
  orange: "E87722",
  blue: "1F4E79",
  blueLt: "D5E8F0",
  cream: "FFF8EE",
  gray: "555555",
  grayLt: "EEEEEE",
  black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function H1(text) {
  return new Paragraph({
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 20, color: COLOR.blue, font: "Calibri" })],
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text, size: opts.size || 20, font: "Calibri",
        color: opts.color || COLOR.black, bold: opts.bold, italics: opts.italics,
      }),
    ],
  });
}
function Bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
  });
}
function Numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
  });
}
function Spacer(after = 120) { return new Paragraph({ spacing: { after }, children: [new TextRun("")] }); }

function tCell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text, size: opts.size || 18, bold: opts.bold,
            color: opts.color || COLOR.black, font: "Calibri",
          }),
        ],
      }),
    ],
  });
}
function makeTable({ widths, header, rows }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map((h, i) =>
      tCell(h, { width: widths[i], shade: COLOR.blue, color: "FFFFFF", bold: true, size: 19 }),
    ),
  });
  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((c, i) =>
        tCell(c, { width: widths[i], shade: ri % 2 === 0 ? COLOR.grayLt : undefined }),
      ),
    }),
  );
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}
function bandeauTitre(title, sous) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
              left: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
              bottom: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
              right: { style: BorderStyle.SINGLE, size: 18, color: COLOR.orange },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: COLOR.cream, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: title, size: 28, bold: true, color: COLOR.orange, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: sous, size: 18, italics: true, color: COLOR.blue, font: "Calibri" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ============================================================
// DOCUMENT 1 — POLITIQUE DE CONFIDENTIALITÉ RGPD
// ============================================================
function politiqueRGPD() {
  return [
    bandeauTitre(
      "POLITIQUE DE CONFIDENTIALITÉ",
      "Conforme au règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 modifiée",
    ),
    Spacer(160),

    P("EVENTY LIFE SAS attache une importance fondamentale à la protection des données personnelles de ses voyageurs, partenaires et utilisateurs du site eventylife.fr. La présente politique de confidentialité décrit, en application du règlement (UE) 2016/679 dit RGPD et de la loi n° 78-17 du 6 janvier 1978 modifiée, les conditions dans lesquelles les données personnelles sont collectées, traitées, conservées et protégées.", { italics: true }),

    H2("1. Responsable de traitement"),
    P("EVENTY LIFE SAS, [adresse], immatriculée au RCS de [ville] sous le numéro [SIREN], représentée par M. David Eventy, Président, est responsable de traitement au sens de l'article 4 (7) du RGPD."),

    H2("2. Délégué à la Protection des Données (DPO)"),
    P("Eventy Life désigne un Délégué à la Protection des Données externe dans les six (6) mois suivant son lancement commercial. Le DPO peut être contacté à dpo@eventylife.fr ou par courrier au siège social, à l'attention du DPO. Il est l'interlocuteur unique pour toute question relative au traitement des données personnelles et à l'exercice des droits du voyageur."),

    H2("3. Catégories de données collectées"),
    makeTable({
      widths: [3500, 5860],
      header: ["Catégorie", "Exemples de données collectées"],
      rows: [
        ["Données d'identification", "Nom, prénom, date de naissance, adresse postale, numéro de téléphone, adresse email"],
        ["Données contractuelles", "Numéro de réservation, voyage choisi, dates, montants payés, historique des achats"],
        ["Données de paiement", "Néant directement (délégation intégrale à Stripe — PCI-DSS) ; seuls les jetons de paiement sont conservés"],
        ["Données techniques", "Adresse IP, type de navigateur, système d'exploitation, pages visitées, cookies"],
        ["Données médicales (le cas échéant)", "Allergènes alimentaires, conditions médicales signalées par le voyageur (consentement explicite)"],
        ["Données spéciales (PMR)", "Besoins d'accessibilité signalés (consentement explicite)"],
        ["Données de communication", "Échanges avec le service client, réclamations, retours de satisfaction"],
        ["Données de marketing (avec consentement)", "Préférences de destinations, historique d'ouverture des emails, opt-in newsletter"],
      ],
    }),

    H2("4. Finalités des traitements et bases légales"),
    makeTable({
      widths: [3500, 3000, 2860],
      header: ["Finalité", "Base légale (RGPD)", "Durée de conservation"],
      rows: [
        ["Exécution du Contrat de voyage", "Article 6 (1) (b) — exécution contractuelle", "5 ans après la dernière transaction"],
        ["Information précontractuelle", "Article 6 (1) (b) — mesures précontractuelles", "3 ans après la dernière interaction"],
        ["Gestion administrative et comptable", "Article 6 (1) (c) — obligation légale (Code commerce, Code fiscal)", "10 ans (durée légale comptable)"],
        ["Sécurité des paiements et lutte contre la fraude", "Article 6 (1) (f) — intérêt légitime", "13 mois après la transaction"],
        ["Satisfaction post-voyage et qualité", "Article 6 (1) (f) — intérêt légitime", "3 ans"],
        ["Communication marketing", "Article 6 (1) (a) — consentement explicite", "3 ans à compter du dernier contact"],
        ["Données médicales et accessibilité", "Article 9 (2) (a) — consentement explicite + intérêt vital", "Durée du voyage uniquement, suppression sous 30 jours"],
        ["Réponse aux réclamations", "Article 6 (1) (b) + (c)", "Durée de la réclamation + 5 ans archivage"],
      ],
    }),

    H2("5. Destinataires des données"),
    P("Les données personnelles ne sont communiquées qu'aux destinataires strictement nécessaires à l'exécution du Contrat ou au respect des obligations légales :"),
    Bullet("Personnel interne d'Eventy habilité (équipe opérations, support, finance, conformité)."),
    Bullet("Partenaires HRA — uniquement les données nécessaires à l'exécution de la prestation (nom, allergènes, accessibilité). Engagement de confidentialité contractuel."),
    Bullet("Transporteurs (autocaristes, compagnies aériennes) — données minimales (nom, prénom, numéro réservation)."),
    Bullet("Accompagnateurs Eventy désignés (sous-traitants au sens de l'article 28 du RGPD) — accès limité à la durée du voyage."),
    Bullet("Stripe (sous-traitant ultime du paiement) — strictement les jetons de paiement, sous certification PCI-DSS niveau 1."),
    Bullet("Assureur Pack Sérénité (sous-traitant) — uniquement en cas de sinistre."),
    Bullet("Administrations et autorités compétentes — sur réquisition légale uniquement (juge, DGCCRF, administration fiscale, etc.)."),
    P("Aucune donnée n'est vendue, louée ou cédée à des tiers à des fins commerciales sans consentement explicite et révocable du voyageur."),

    H2("6. Transferts hors Union Européenne"),
    P("Les données personnelles des voyageurs sont hébergées en France (Scaleway, datacenters parisiens) et ne font l'objet d'aucun transfert hors Union Européenne, à l'exception :"),
    Bullet("Des transferts strictement nécessaires à l'exécution du voyage à destination d'un pays tiers (informations communiquées aux partenaires HRA locaux)."),
    Bullet("De Stripe (États-Unis) pour les jetons de paiement, sous décision d'adéquation Data Privacy Framework (DPF) ou clauses contractuelles types."),
    Bullet("De Vercel (États-Unis) pour le front-end public — pas de données voyageur sensible (uniquement contenus marketing publics)."),

    H2("7. Droits du voyageur"),
    P("Conformément aux articles 15 à 22 du RGPD, le voyageur dispose des droits suivants :"),
    Bullet("Droit d'accès — obtenir la copie de ses données personnelles."),
    Bullet("Droit de rectification — corriger des données inexactes ou incomplètes."),
    Bullet("Droit à l'effacement (« droit à l'oubli ») — sous réserve des obligations légales de conservation comptable."),
    Bullet("Droit à la limitation du traitement."),
    Bullet("Droit à la portabilité — récupérer ses données dans un format structuré, couramment utilisé et lisible par machine."),
    Bullet("Droit d'opposition — au traitement de ses données pour motifs légitimes ou à des fins de prospection."),
    Bullet("Droit de retirer son consentement à tout moment, sans remettre en cause la licéité du traitement antérieur."),
    Bullet("Droit de définir des directives post-mortem sur le sort de ses données."),
    P("Ces droits s'exercent par simple demande à dpo@eventylife.fr ou par courrier au siège social. Eventy s'engage à répondre dans un délai d'un (1) mois maximum, prolongeable de deux (2) mois en cas de complexité justifiée. La justification d'identité peut être demandée si un doute raisonnable existe sur l'identité du demandeur."),

    H2("8. Réclamation auprès de la CNIL"),
    P("En cas de désaccord avec la réponse d'Eventy ou avec un traitement de ses données, le voyageur peut introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) — 3 Place de Fontenoy, 75007 Paris — cnil.fr — Téléphone : 01 53 73 22 22."),

    H2("9. Sécurité des données"),
    P("Eventy met en œuvre les mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté au risque, conformément à l'article 32 du RGPD :"),
    Bullet("Chiffrement des données au repos (PostgreSQL chiffré côté infrastructure)."),
    Bullet("Chiffrement des données en transit (TLS 1.3, certificats automatisés)."),
    Bullet("Hébergement en France (Scaleway, certifié ISO 27001 / HDS pour les données de santé)."),
    Bullet("Sauvegardes journalières chiffrées vers un second site européen."),
    Bullet("Procédure de restauration testée trimestriellement."),
    Bullet("Authentification forte des accès administratifs (2FA obligatoire)."),
    Bullet("Journalisation et audit des accès aux données sensibles."),
    Bullet("Formation et sensibilisation de l'équipe Eventy à la protection des données."),

    H2("10. Notification de violation de données"),
    P("En cas de violation de données personnelles susceptible d'engendrer un risque pour les droits et libertés des personnes concernées, Eventy s'engage à notifier la CNIL sous 72 heures au plus tard à compter de la prise de connaissance, conformément à l'article 33 du RGPD. Si le risque est élevé, les voyageurs concernés sont également informés sans délai conformément à l'article 34."),

    H2("11. Cookies et traceurs"),
    P("Le site eventylife.fr utilise des cookies dont le fonctionnement est détaillé dans la Politique Cookies dédiée, accessible sur eventylife.fr/cookies."),

    H2("12. Modifications de la politique de confidentialité"),
    P("La présente politique peut être modifiée à tout moment pour refléter une évolution réglementaire ou des modifications opérationnelles. Toute modification substantielle sera notifiée aux voyageurs ayant un Contrat en cours par email, et publiée sur eventylife.fr avec mention de la date d'entrée en vigueur."),

    Spacer(180),
    P("Date d'entrée en vigueur : 30 avril 2026.", { italics: true, color: COLOR.gray }),
    P("Version 1.0 — La présente politique se veut intelligible. Pour toute question, contacter dpo@eventylife.fr.", { italics: true, color: COLOR.gray }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE COOKIES
// ============================================================
function politiqueCookies() {
  return [
    bandeauTitre(
      "POLITIQUE COOKIES",
      "Cookies et traceurs sur eventylife.fr — conforme RGPD et lignes directrices CNIL",
    ),
    Spacer(160),

    P("La présente politique cookies décrit, en toute transparence, l'usage que fait le site eventylife.fr des cookies et traceurs, conformément au règlement (UE) 2016/679 (RGPD), à la directive ePrivacy 2002/58/CE et aux lignes directrices et recommandations de la CNIL relatives aux cookies (délibération du 17 septembre 2020).", { italics: true }),

    H2("1. Qu'est-ce qu'un cookie ?"),
    P("Un cookie est un petit fichier texte déposé par un site internet sur le terminal d'un utilisateur (ordinateur, tablette, smartphone) lors de sa visite. Il permet au site de reconnaître l'utilisateur lors d'une visite ultérieure, de stocker des préférences ou de mesurer l'audience. Les cookies peuvent être déposés par le site lui-même (cookies internes ou « first-party ») ou par des tiers (cookies tiers ou « third-party »)."),

    H2("2. Catégories de cookies utilisés sur eventylife.fr"),
    makeTable({
      widths: [2500, 2500, 4360],
      header: ["Catégorie", "Consentement requis ?", "Finalité"],
      rows: [
        ["Strictement nécessaires", "Non (article 82 LIL)", "Permettent le fonctionnement du site (gestion de la session, panier de réservation, sécurité, authentification, équilibrage de charge). Sans ces cookies, le site ne peut fonctionner."],
        ["Préférences", "Non (équivalent fonctionnel)", "Mémorisent les préférences de l'utilisateur (langue, devise, accessibilité). Améliorent l'expérience sans collecter de données personnelles identifiantes."],
        ["Mesure d'audience anonyme", "Non si exemption CNIL", "Mesure de fréquentation du site avec configuration conforme aux exemptions CNIL (anonymisation IP, durée de vie limitée, pas de suivi inter-sites). Outil retenu : Matomo en mode auto-hébergé France."],
        ["Mesure d'audience tiers", "Oui (consentement)", "Si Google Analytics ou équivalent activé — uniquement avec consentement préalable explicite."],
        ["Marketing et publicité", "Oui (consentement)", "Cookies tiers (Meta, LinkedIn, Google Ads) pour mesurer la performance des campagnes. Désactivés par défaut, activés sur consentement opt-in explicite."],
        ["Réseaux sociaux", "Oui (consentement)", "Boutons de partage Facebook, Instagram, LinkedIn — désactivés par défaut, déclenchés sur action explicite de l'utilisateur."],
      ],
    }),

    H2("3. Liste exhaustive des cookies déposés"),
    makeTable({
      widths: [2200, 2200, 2200, 2760],
      header: ["Cookie", "Émetteur", "Durée de vie", "Finalité"],
      rows: [
        ["session_id", "eventylife.fr (interne)", "Session", "Identification de la session voyageur"],
        ["cart_token", "eventylife.fr", "30 jours", "Conservation du panier de réservation"],
        ["consent_state", "eventylife.fr", "13 mois", "Mémorisation du choix de consentement cookies"],
        ["lang_pref", "eventylife.fr", "1 an", "Préférence de langue"],
        ["matomo_*", "eventylife.fr (Matomo auto-hébergé)", "13 mois", "Mesure d'audience anonyme (IP anonymisée)"],
        ["_ga, _gid (Google Analytics)", "Google (sur consentement)", "26 mois", "Mesure d'audience marketing — opt-in"],
        ["_fbp (Meta Pixel)", "Meta (sur consentement)", "3 mois", "Mesure performance campagnes Meta — opt-in"],
        ["li_at (LinkedIn Insight)", "LinkedIn (sur consentement)", "1 an", "Mesure performance campagnes LinkedIn — opt-in"],
      ],
    }),

    H2("4. Bandeau de consentement"),
    P("Lors de la première visite sur eventylife.fr, l'utilisateur se voit présenter un bandeau de consentement clair, conforme aux lignes directrices CNIL. Ce bandeau permet :"),
    Bullet("D'accepter tous les cookies."),
    Bullet("De refuser tous les cookies non strictement nécessaires (refus aussi simple à exercer que l'acceptation)."),
    Bullet("De personnaliser le consentement par catégorie."),
    Bullet("De consulter la présente politique avant de choisir."),
    P("Le refus du consentement n'a aucune conséquence sur l'accès au site ni sur la possibilité de réserver un voyage. Les fonctionnalités strictement nécessaires fonctionnent sans cookie publicitaire."),

    H2("5. Modifier ses préférences cookies"),
    P("L'utilisateur peut à tout moment modifier ses préférences cookies via le lien « Préférences cookies » situé en bas de chaque page du site. Le bandeau réapparaît à chaque demande pour permettre une nouvelle consultation."),
    P("Les utilisateurs peuvent également configurer leur navigateur pour bloquer ou supprimer les cookies. Voici les liens vers les paramètres des navigateurs principaux : Firefox, Chrome, Safari, Edge — disponibles dans la documentation de chaque navigateur."),

    H2("6. Durée de conservation du consentement"),
    P("Conformément aux recommandations CNIL, le consentement de l'utilisateur est conservé pour une durée maximale de treize (13) mois. Au terme de cette période, l'utilisateur est de nouveau invité à se prononcer."),

    H2("7. Droits du voyageur"),
    P("Le voyageur dispose, sur ses cookies et traceurs, des mêmes droits que sur ses autres données personnelles (accès, rectification, opposition, retrait du consentement). Ces droits s'exercent à dpo@eventylife.fr ou via le bandeau de gestion des cookies. Voir la Politique de Confidentialité RGPD pour les modalités complètes."),

    H2("8. Modifications de la politique cookies"),
    P("La présente politique peut être modifiée pour refléter une évolution technique ou réglementaire. Toute modification substantielle est notifiée par un nouveau bandeau de consentement. La date de dernière mise à jour est indiquée ci-dessous."),

    Spacer(180),
    P("Date d'entrée en vigueur : 30 avril 2026.", { italics: true, color: COLOR.gray }),
    P("Version 1.0 — Pour toute question : dpo@eventylife.fr.", { italics: true, color: COLOR.gray }),
  ];
}

// ============================================================
// DOCUMENT 3 — INFORMATION PRÉCONTRACTUELLE VOYAGEUR
// ============================================================
function informationPrecontractuelle() {
  return [
    bandeauTitre(
      "INFORMATION PRÉCONTRACTUELLE VOYAGEUR",
      "Formulaire conforme arrêté du 1er mars 2018 — directive (UE) 2015/2302",
    ),
    Spacer(160),

    P("Le présent formulaire d'information précontractuelle est remis au Voyageur avant la conclusion du Contrat, conformément à l'article L211-9 du Code du Tourisme et à l'arrêté du 1er mars 2018 fixant le formulaire d'information standardisé. Il fait partie intégrante du Contrat de voyage à forfait.", { italics: true }),

    H2("Information standardisée — voyage à forfait"),
    P("La combinaison de services de voyage qui vous est proposée est un forfait au sens de la directive (UE) 2015/2302 et de l'article L211-2 du Code du Tourisme. Vous bénéficierez de tous les droits octroyés par l'Union européenne applicables aux forfaits, tels que transposés dans le Code du Tourisme. EVENTY LIFE SAS sera entièrement responsable de la bonne exécution du forfait dans son ensemble. En outre, comme l'exige la loi, EVENTY LIFE SAS dispose d'une protection afin de rembourser vos paiements et, si le transport est compris dans le forfait, d'assurer votre rapatriement, au cas où elle deviendrait insolvable.", { italics: true }),

    H2("Droits essentiels prévus par le Code du Tourisme"),
    Bullet("Vous recevrez toutes les informations essentielles sur le forfait avant de conclure le contrat."),
    Bullet("Le prestataire responsable de la bonne exécution de toutes les prestations comprises dans le contrat est toujours désigné."),
    Bullet("Vous recevrez un numéro de téléphone d'urgence ou les coordonnées d'un point de contact."),
    Bullet("Vous pouvez transférer le forfait à une autre personne, moyennant un préavis raisonnable et éventuellement le paiement de frais supplémentaires."),
    Bullet("Le prix du forfait ne peut être augmenté que si des coûts spécifiques augmentent (carburant, taxes) et si cette possibilité est explicitement prévue dans le contrat ; il ne peut en aucun cas être modifié moins de 20 jours avant le début du forfait. Si la majoration de prix dépasse 8 % du prix du forfait, vous pouvez résilier le contrat."),
    Bullet("Si l'organisateur du voyage modifie de manière significative un des éléments essentiels du forfait, vous pouvez accepter la modification ou résilier le contrat sans frais."),
    Bullet("Vous pouvez résilier le contrat sans payer de frais en cas de circonstances exceptionnelles."),
    Bullet("Vous pouvez, à tout moment avant le début du forfait, résilier le contrat moyennant le paiement de frais de résolution appropriés et justifiables."),
    Bullet("Si, après le début du voyage, des éléments essentiels ne peuvent être fournis, d'autres prestations appropriées devront vous être proposées sans supplément de prix."),
    Bullet("Vous pouvez résilier le contrat sans payer de frais lorsque les services ne sont pas exécutés conformément au contrat, que cela perturbe considérablement le voyage et que l'organisateur ne remédie pas au problème."),
    Bullet("Vous avez droit à une réduction de prix ou à un dédommagement lorsque les services de voyage ne sont pas exécutés ou sont mal exécutés."),
    Bullet("L'organisateur doit apporter une aide si vous êtes en difficulté."),
    Bullet("Si l'organisateur devient insolvable, les montants versés seront remboursés. Si l'organisateur devient insolvable après le début du forfait et si le transport est compris dans le forfait, le rapatriement des voyageurs est garanti par la garantie financière APST."),

    H2("Caractéristiques principales du voyage à forfait proposé"),
    P("Les caractéristiques ci-dessous sont à compléter pour chaque voyage commercialisé. Elles font partie intégrante du Contrat conclu avec le Voyageur.", { italics: true }),
    makeTable({
      widths: [3500, 5860],
      header: ["Caractéristique", "À compléter pour chaque voyage"],
      rows: [
        ["Nom et adresse de l'organisateur", "EVENTY LIFE SAS — [adresse complète] — IM [###-###-###]"],
        ["Destination(s)", "[Pays + ville(s) ; itinéraire si plusieurs étapes]"],
        ["Itinéraire et périodes de séjour", "[Programme jour par jour avec dates]"],
        ["Nombre de nuitées", "[X] nuits"],
        ["Moyens de transport", "[Autocar Grand Tourisme / vol charter / vol régulier groupe]"],
        ["Caractéristiques du transport", "[Catégorie autocar / classe vol / horaires connus]"],
        ["Hébergement", "[Type, classement étoiles, localisation, nom partenaire si confirmé]"],
        ["Repas inclus", "[Petit-déjeuner / demi-pension / pension complète / nombre de repas]"],
        ["Visites, excursions et autres services inclus", "[Liste détaillée]"],
        ["Taille minimale du groupe", "28 voyageurs (en deçà : annulation et remboursement intégral)"],
        ["Langue(s) du voyage", "Français (langue principale ; autres langues selon accompagnement)"],
        ["Accessibilité PMR", "[Accessible / accessible sur demande / non accessible — préciser]"],
        ["Voyageurs concernés", "Tout public, sauf restrictions précisées (ex. âge minimum)"],
      ],
    }),

    H2("Prix et modalités de paiement"),
    Bullet("Prix total TTC : [X] € par voyageur, tout compris (transport, hébergement, repas inclus, taxes locales obligatoires, Pack Sérénité)."),
    Bullet("Acompte exigible à la réservation : 30 % du prix total."),
    Bullet("Solde dû au plus tard 30 jours avant le départ."),
    Bullet("Modalités de paiement acceptées : carte bancaire (avec authentification forte SCA), Apple Pay, Google Pay."),

    H2("Garantie financière et assurance Pack Sérénité"),
    P("Le présent voyage à forfait bénéficie de la garantie financière de l'APST — Association Professionnelle de Solidarité du Tourisme, 15 avenue Carnot 75017 Paris — qui rembourse les fonds versés et organise le rapatriement en cas de défaillance d'EVENTY LIFE SAS. EVENTY LIFE SAS est par ailleurs couverte par une assurance de responsabilité civile professionnelle [nom de l'assureur — contrat n°] avec un plafond minimum de 1 500 000 € par sinistre."),
    P("Le Pack Sérénité INCLUS dans tous les voyages couvre l'annulation pour motif valable, l'assistance et le rapatriement médical, les frais médicaux à l'étranger, l'indemnisation des bagages perdus ou endommagés, et l'accès à une ligne d'urgence 24h/24 et 7j/7 pendant la durée du voyage et 48 heures après le retour."),

    H2("Médiation des litiges"),
    P("Conformément aux articles L612-1 et suivants du Code de la consommation, en cas de litige non résolu par contact préalable avec EVENTY LIFE SAS, le Voyageur peut saisir gratuitement le médiateur compétent : Médiation Tourisme et Voyage (MTV) — 12 rue Eugène Sue, 75018 Paris — saisine en ligne sur mtv.travel/demande-saisine."),

    H2("Coordonnées d'urgence"),
    P("Pendant toute la durée du voyage et jusqu'à 48 heures après le retour, le Voyageur peut joindre EVENTY LIFE SAS via la ligne d'urgence 24/7 dont le numéro est communiqué dans la confirmation de réservation et inscrit sur la pochette voyage remise au point de départ."),

    H2("Contrat et CGV"),
    P("Le Contrat de voyage est conclu entre EVENTY LIFE SAS et le Voyageur dès la double condition de l'acceptation explicite des Conditions Générales de Vente d'EVENTY LIFE SAS (consultables sur eventylife.fr/cgv) et du paiement effectif de l'acompte requis. Une copie du Contrat (dont la présente information précontractuelle fait partie intégrante) est adressée au Voyageur sur support durable (PDF par email + accès permanent dans l'espace voyageur)."),

    H2("Acceptation horodatée"),
    P("Je soussigné(e), [Nom Prénom du Voyageur], reconnais avoir reçu la présente information précontractuelle et avoir pris connaissance des Conditions Générales de Vente d'EVENTY LIFE SAS avant la formation du Contrat. Je déclare avoir compris et accepté l'ensemble des éléments présentés.", { italics: true }),

    Spacer(140),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
              width: { size: 4680, type: WidthType.DXA },
              margins: { top: 100, bottom: 200, left: 120, right: 120 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pour EVENTY LIFE SAS", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 240 }, children: [new TextRun({ text: "M. David Eventy, Président", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Date · signature électronique horodatée", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
            new TableCell({
              borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
              width: { size: 4680, type: WidthType.DXA },
              margins: { top: 100, bottom: 200, left: 120, right: 120 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Le Voyageur", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 240 }, children: [new TextRun({ text: "[Nom Prénom]", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Acceptation explicite (case à cocher) + horodatage plateforme", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
          ],
        }),
      ],
    }),

    Spacer(160),
    P("Document généré automatiquement par la plateforme Eventy Life avant chaque réservation, conformément à l'article L211-9 du Code du Tourisme et à l'arrêté du 1er mars 2018.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Garantie financière : APST · Adresse : 15 avenue Carnot, 75017 Paris · info@apst.travel", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// Document commun
// ============================================================
function makeDoc({ title, description, footerLeft, children }) {
  return new Document({
    creator: "David Eventy — Eventy Life SAS",
    title,
    description,
    styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
    numbering: {
      config: [
        { reference: "bullets", levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]},
        { reference: "numbers", levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]},
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                children: [
                  new TextRun({ text: footerLeft, size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

async function generate() {
  const outputs = [
    {
      file: "docs/garanties/Eventy-Life-Politique-Confidentialite-RGPD.docx",
      title: "Eventy Life — Politique de Confidentialité RGPD",
      description: "Politique de confidentialité conforme RGPD et loi Informatique et Libertés.",
      footer: "EVENTY LIFE SAS — Politique de Confidentialité RGPD",
      children: politiqueRGPD(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Cookies.docx",
      title: "Eventy Life — Politique Cookies",
      description: "Politique cookies conforme RGPD et lignes directrices CNIL.",
      footer: "EVENTY LIFE SAS — Politique Cookies",
      children: politiqueCookies(),
    },
    {
      file: "docs/garanties/Eventy-Life-Information-Precontractuelle.docx",
      title: "Eventy Life — Information précontractuelle voyageur",
      description: "Formulaire d'information précontractuelle conforme arrêté du 1er mars 2018.",
      footer: "EVENTY LIFE SAS — Information précontractuelle voyageur",
      children: informationPrecontractuelle(),
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
