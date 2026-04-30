/**
 * Eventy Life — CGV, Bon de commande HRA, Mentions légales
 *
 * Trois documents conformes au Code du Tourisme et à la directive (UE) 2015/2302.
 *
 * Usage : node scripts/garanties/build-cgv-bons-mentions.js
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
  PageBreak,
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
        text,
        size: opts.size || 20,
        font: "Calibri",
        color: opts.color || COLOR.black,
        bold: opts.bold,
        italics: opts.italics,
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
function PB() { return new Paragraph({ children: [new PageBreak()] }); }

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
            text,
            size: opts.size || 18,
            bold: opts.bold,
            color: opts.color || COLOR.black,
            font: "Calibri",
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
// DOCUMENT 1 — CONDITIONS GÉNÉRALES DE VENTE (CGV)
// ============================================================
function cgv() {
  return [
    bandeauTitre(
      "CONDITIONS GÉNÉRALES DE VENTE",
      "EVENTY LIFE SAS — Voyages à forfait — Code du Tourisme + directive (UE) 2015/2302",
    ),
    Spacer(160),

    P("Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'ensemble des relations contractuelles entre EVENTY LIFE SAS et toute personne physique ou morale (ci-après « le Voyageur ») souscrivant un voyage à forfait organisé par EVENTY LIFE SAS. Elles sont conformes aux articles L211-1 et suivants du Code du Tourisme, à la directive (UE) 2015/2302 du Parlement européen et du Conseil du 25 novembre 2015, à l'ordonnance n° 2017-1717 du 20 décembre 2017, au décret n° 2017-1871 du 29 décembre 2017 et à l'arrêté du 1er mars 2018."),

    H2("Article 1 — Identification de l'opérateur"),
    P("EVENTY LIFE est une société par actions simplifiée (SAS) au capital de [montant] €, immatriculée au Registre du Commerce et des Sociétés de [ville] sous le numéro [SIREN], dont le siège social est sis [adresse]. Elle est immatriculée au registre des opérateurs de voyages et de séjours d'Atout France sous le numéro IM [###-###-###]. Représentant légal : M. David Eventy, Président. Adresse électronique : eventylife@gmail.com. Site internet : eventylife.fr."),
    P("Garantie financière : APST — Association Professionnelle de Solidarité du Tourisme, 15 avenue Carnot, 75017 Paris (info@apst.travel — 01 44 09 25 35)."),
    P("Assurance Responsabilité Civile Professionnelle : [nom de l'assureur], contrat n° [n°], plafond minimum 1 500 000 € par sinistre."),
    P("Médiation des litiges de la consommation : Médiation Tourisme et Voyage (MTV), 12 rue Eugène Sue, 75018 Paris — mtv.travel."),

    H2("Article 2 — Définitions"),
    P("Aux fins des présentes :"),
    Bullet("« Voyage à forfait » : combinaison d'au moins deux types de services de voyage différents (transport, hébergement, location, autre service touristique), aux fins du même voyage ou séjour, vendus à un prix tout compris (article L211-2 du Code du Tourisme)."),
    Bullet("« Voyageur » : toute personne physique qui souscrit ou bénéficie d'un voyage à forfait organisé par EVENTY."),
    Bullet("« Opérateur » : EVENTY LIFE SAS, qualifiée d'opérateur de voyages et de séjours au sens des articles L211-1 et suivants du Code du Tourisme."),
    Bullet("« Contrat » : ensemble formé par les présentes CGV et le bon de réservation accepté par le Voyageur."),
    Bullet("« Pack Sérénité » : ensemble de garanties d'assistance et d'assurance souscrites par EVENTY auprès d'un assureur tiers et incluses dans chaque voyage à forfait commercialisé."),
    Bullet("« Vendeur partenaire » : tiers (créateur, ambassadeur, influenceur, partenaire HRA) qui place une inscription Eventy auprès du Voyageur. Le Vendeur partenaire n'est en aucun cas opérateur de voyages."),

    H2("Article 3 — Information précontractuelle"),
    P("Avant la conclusion du Contrat, EVENTY communique au Voyageur, sur un support durable (fiche voyage en ligne, formulaire numérique téléchargeable) et de manière claire et lisible, le formulaire d'information standardisé prévu par l'arrêté du 1er mars 2018, ainsi que les caractéristiques principales du voyage : destination, itinéraire, dates, nombre de nuitées, transport, hébergement, repas, visites et excursions, taille minimale du groupe, langue principale, accessibilité, prix total TTC incluant taxes, redevances et autres coûts supplémentaires, modalités de paiement, conditions d'annulation, identité du garant financier, identité du médiateur."),
    P("Ces informations font partie intégrante du Contrat et ne peuvent être modifiées qu'avec l'accord exprès des deux parties."),

    H2("Article 4 — Formation du Contrat"),
    P("La réservation est réalisée en ligne sur eventylife.fr. Le Voyageur se voit présenter, avant tout paiement : le formulaire d'information standardisé, les caractéristiques détaillées du voyage, les présentes CGV, le prix total et les conditions d'annulation. La réservation devient ferme et définitive à la double condition de l'acceptation explicite des CGV par le Voyageur (case à cocher) et du paiement effectif de l'acompte requis. EVENTY adresse au Voyageur, par voie électronique sur support durable, une confirmation de réservation valant Contrat."),

    H2("Article 5 — Prix et modalités de paiement"),
    Bullet("Le prix indiqué sur la fiche voyage est un prix tout compris TTC incluant les prestations décrites, les taxes et redevances obligatoires, le Pack Sérénité et les éventuels frais administratifs. Aucune surcharge cachée n'est applicable au moment du paiement."),
    Bullet("Acompte : un acompte plafonné à 30 % du prix total est exigible au moment de la réservation. Ce plafond est conforme à l'article R211-6 du Code du Tourisme."),
    Bullet("Solde : le solde du prix est dû au plus tard 30 jours avant le départ. À défaut de paiement intégral à cette échéance, EVENTY se réserve la faculté de résoudre le Contrat, l'acompte étant alors conservé à titre de frais de résolution conformément au barème prévu à l'Article 9."),
    Bullet("Modalités de paiement : carte bancaire (Stripe avec authentification forte SCA), Apple Pay, Google Pay. Les chèques-vacances ANCV pourront être acceptés selon dispositif spécifique communiqué."),

    H2("Article 6 — Modification du prix par l'opérateur"),
    P("Conformément à l'article L211-12 du Code du Tourisme, le prix peut être modifié à la hausse ou à la baisse jusqu'à 20 jours avant le départ pour tenir compte de l'évolution :"),
    Bullet("Du coût du transport (carburant, autres sources d'énergie)."),
    Bullet("Des taxes ou redevances applicables aux services compris dans le voyage à forfait, imposées par un tiers non directement impliqué dans l'exécution."),
    Bullet("Des taux de change applicables au voyage à forfait."),
    P("Toute hausse supérieure à 8 % du prix total ouvre droit, au choix du Voyageur, soit à l'acceptation de la modification, soit à la résolution sans frais du Contrat avec remboursement intégral sous 14 jours, conformément à l'article L211-13."),

    H2("Article 7 — Modification d'autres clauses du Contrat"),
    P("Si EVENTY se trouve contraint, avant le début du voyage, de modifier de manière significative un élément essentiel du Contrat (destination principale, transport, hébergement de catégorie inférieure, etc.), elle en informe sans délai le Voyageur sur support durable, avec un délai raisonnable de réponse. Le Voyageur peut alors :"),
    Numbered("Accepter la modification proposée."),
    Numbered("Résoudre le Contrat sans frais et obtenir le remboursement intégral des sommes versées sous 14 jours."),
    Numbered("Accepter un voyage de remplacement de qualité équivalente ou supérieure proposé par EVENTY."),

    H2("Article 8 — Cession du Contrat à un tiers"),
    P("Conformément à l'article L211-11 du Code du Tourisme, le Voyageur peut céder son Contrat à un tiers remplissant les conditions du voyage, sous réserve d'un préavis raisonnable de 7 jours avant le début du voyage. Le cédant et le cessionnaire sont solidairement responsables du paiement du solde et des frais administratifs résultant de la cession (frais réels et raisonnables, plafonnés selon barème transparent)."),

    H2("Article 9 — Résolution avant le départ"),
    H3("9.1. Résolution par le Voyageur"),
    P("Le Voyageur peut résoudre le Contrat à tout moment avant le début du voyage, moyennant le paiement de frais de résolution selon le barème ci-dessous, calculé sur le prix total :"),
    makeTable({
      widths: [3500, 5860],
      header: ["Délai avant le départ", "Frais de résolution (% du prix total)"],
      rows: [
        ["Plus de 60 jours", "25 % du prix total"],
        ["Entre 60 et 30 jours", "50 % du prix total"],
        ["Entre 30 et 15 jours", "75 % du prix total"],
        ["Moins de 15 jours", "90 % du prix total"],
      ],
    }),
    P("Conformément à l'article L211-14 du Code du Tourisme, le Voyageur a le droit de résoudre le Contrat avant le départ sans payer de frais de résolution si des circonstances exceptionnelles et inévitables, survenant au lieu de destination ou à proximité immédiate, ont des conséquences importantes sur l'exécution du voyage ou sur le transport des passagers vers le lieu de destination. Dans ce cas, EVENTY rembourse intégralement les paiements effectués sous 14 jours."),
    H3("9.2. Résolution par EVENTY"),
    P("EVENTY peut résoudre le Contrat avant le départ sans payer de dédommagement supplémentaire dans les cas suivants : (i) le nombre de personnes inscrites est inférieur au seuil minimum requis (28 voyageurs) et la résolution est notifiée au moins 20 jours avant le départ ; (ii) circonstances exceptionnelles et inévitables empêchant l'exécution. Dans tous les cas, EVENTY rembourse intégralement les paiements effectués sous 14 jours."),

    H2("Article 10 — Résolution pendant le voyage"),
    P("Si, après le début du voyage, des éléments essentiels du Contrat ne peuvent être fournis comme prévu, EVENTY proposera des prestations de remplacement appropriées, sans surcoût. Si ces prestations sont de qualité inférieure, le Voyageur a droit à une réduction de prix proportionnée. Si aucune prestation de remplacement n'est possible ou si le Voyageur refuse à juste titre, EVENTY assure son rapatriement sans surcoût et lui rembourse les sommes versées correspondant aux services non fournis."),

    H2("Article 11 — Responsabilité de plein droit"),
    P("Conformément à l'article L211-16 du Code du Tourisme, EVENTY est responsable de plein droit de la bonne exécution de l'ensemble des prestations prévues au Contrat, qu'elles soient exécutées par EVENTY ou par d'autres prestataires de services de voyage, sans préjudice du droit pour EVENTY d'agir en recours contre ces prestataires."),
    P("EVENTY peut s'exonérer de tout ou partie de sa responsabilité en apportant la preuve que le dommage est imputable soit au Voyageur, soit à un tiers étranger à la fourniture des services de voyage, soit à des circonstances exceptionnelles et inévitables."),

    H2("Article 12 — Pack Sérénité (inclus dans tous les voyages)"),
    P("Chaque voyage commercialisé par EVENTY inclut, sans surcoût visible, un Pack Sérénité comprenant :"),
    Bullet("Assurance annulation (motifs médicaux, professionnels, familiaux énumérés au certificat individuel)."),
    Bullet("Assistance médicale 24/7 et rapatriement médicalisé."),
    Bullet("Prise en charge des frais médicaux à l'étranger."),
    Bullet("Indemnisation des bagages perdus, volés ou endommagés."),
    Bullet("Assistance juridique en cas de litige sur place."),
    Bullet("Ligne d'urgence téléphonique 24h/24 et 7j/7 pendant toute la durée du voyage et 48 heures après le retour."),
    P("Le détail complet des garanties Pack Sérénité, les exclusions, les plafonds et les modalités de mise en jeu sont communiqués au Voyageur avec la confirmation de réservation."),

    H2("Article 13 — Réclamations"),
    P("Toute réclamation relative à l'exécution du voyage doit être adressée à EVENTY à reclamation@eventylife.fr, par courrier recommandé au siège social, ou par tout autre moyen permettant d'en attester la réception, dans un délai raisonnable et idéalement dans les 30 jours suivant la fin du voyage. EVENTY accuse réception sous 48 heures ouvrées et apporte une réponse motivée dans un délai maximum de 30 jours à compter de la réception de la réclamation."),

    H2("Article 14 — Médiation"),
    P("En cas de litige non résolu après réclamation auprès d'EVENTY, le Voyageur peut saisir gratuitement la Médiation Tourisme et Voyage (MTV) sur mtv.travel/demande-saisine. La saisine du médiateur est gratuite pour le Voyageur. Le médiateur émet un avis dans un délai de 90 jours à compter de la saisine recevable. La médiation conventionnelle ne fait pas obstacle aux voies judiciaires."),

    H2("Article 15 — Données personnelles (RGPD)"),
    P("Les données personnelles du Voyageur sont traitées conformément au règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée. EVENTY est responsable de traitement. Les données sont collectées pour les finalités suivantes : exécution du Contrat, communication précontractuelle et contractuelle, gestion administrative et comptable, sécurité des paiements, prévention de la fraude, satisfaction post-voyage, communication marketing avec consentement préalable. Les données sont hébergées en France (Scaleway, Paris) et conservées au plus 5 ans après la dernière transaction, sauf obligations légales spécifiques."),
    P("Le Voyageur dispose d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition. Ces droits s'exercent par écrit à dpo@eventylife.fr ou par courrier au siège social. Le Voyageur peut également introduire une réclamation auprès de la CNIL (cnil.fr)."),

    H2("Article 16 — Force majeure"),
    P("Aucune des parties ne peut être tenue responsable d'un manquement à ses obligations résultant d'un cas de force majeure tel que défini par la loi et la jurisprudence française. Sont notamment considérés comme constitutifs de force majeure : catastrophes naturelles, pandémies, actes de terrorisme, guerres, troubles civils, décisions des autorités publiques rendant l'exécution impossible ou dangereuse."),

    H2("Article 17 — Loi applicable et juridiction"),
    P("Les présentes CGV sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution sera, à défaut d'accord amiable préalable et après tentative de médiation, soumis aux tribunaux compétents conformément au Code de procédure civile et au Code de la consommation. Le Voyageur consommateur peut saisir indifféremment la juridiction du lieu où il demeurait au moment de la conclusion du Contrat ou de la survenance du fait dommageable."),

    H2("Article 18 — Acceptation"),
    P("Le Voyageur déclare avoir pris connaissance et accepté sans réserve l'ensemble des stipulations des présentes CGV avant la formation du Contrat. Une copie des CGV applicables au Contrat est conservée par le Voyageur sur support durable. EVENTY conserve une trace horodatée de l'acceptation sur sa plateforme technique."),

    Spacer(180),
    P("Date d'entrée en vigueur : 30 avril 2026.", { italics: true, color: COLOR.gray }),
    P("Version applicable : 1.0 — toute modification ultérieure sera publiée sur eventylife.fr/cgv et notifiée par email aux clients ayant un voyage en cours.", { italics: true, color: COLOR.gray }),
  ];
}

// ============================================================
// DOCUMENT 2 — BON DE COMMANDE HRA
// ============================================================
function bonDeCommande() {
  return [
    bandeauTitre(
      "BON DE COMMANDE PARTENAIRE HRA",
      "Modèle type — Hôtels · Restaurants · Activités",
    ),
    Spacer(140),

    P("Le présent bon de commande complète et exécute le contrat-cadre HRA Partenaire signé entre EVENTY LIFE SAS et le PARTENAIRE HRA. Il vaut commande ferme dès confirmation par retour écrit du PARTENAIRE.", { italics: true, after: 140 }),

    // En-tête bon de commande
    H2("Identification du bon de commande"),
    makeTable({
      widths: [3500, 5860],
      header: ["Champ", "Information"],
      rows: [
        ["Numéro de bon de commande", "BC-[YYYYMM]-[####]"],
        ["Date d'émission", "[JJ/MM/AAAA]"],
        ["Émetteur", "EVENTY LIFE SAS — IM [###-###-###]"],
        ["Référence voyage Eventy", "VOY-[YYYYMM]-[####]"],
        ["Intitulé du voyage", "[Ex. : Lisbonne weekend 4 jours]"],
        ["Dates du séjour", "Du [JJ/MM/AAAA] au [JJ/MM/AAAA]"],
        ["Nombre de voyageurs", "[XX] (capacité minimum 28, capacité nominale 38)"],
      ],
    }),

    H2("Identification du PARTENAIRE HRA"),
    makeTable({
      widths: [3500, 5860],
      header: ["Champ", "Information"],
      rows: [
        ["Raison sociale", "[Nom de l'établissement]"],
        ["Adresse complète", "[Adresse postale]"],
        ["SIREN / Équivalent local", "[Numéro]"],
        ["Représentant légal", "[Nom Prénom + qualité]"],
        ["Contact opérationnel", "[Nom + email + téléphone]"],
        ["Type de prestation", "☐ Hôtel · ☐ Restaurant · ☐ Activité · ☐ Combiné"],
      ],
    }),

    H2("Détail des prestations commandées"),
    makeTable({
      widths: [4000, 1500, 1500, 2360],
      header: ["Prestation", "Quantité", "Prix unitaire (€)", "Prix total (€)"],
      rows: [
        ["Nuitée chambre double standard (par chambre)", "[19]", "[Prix HT négocié]", "[Calcul]"],
        ["Petit déjeuner par personne", "[XX]", "[Prix HT]", "[Calcul]"],
        ["Demi-pension par personne (si hôtel)", "[XX]", "[Prix HT]", "[Calcul]"],
        ["Déjeuner ou dîner inclus (si restaurant)", "[XX]", "[Prix HT]", "[Calcul]"],
        ["Activité (visite guidée, croisière, etc.)", "[XX]", "[Prix HT]", "[Calcul]"],
        ["Taxes locales / taxe de séjour (refacturée)", "[XX]", "[Prix HT]", "[Calcul]"],
        ["Sous-total HT", "—", "—", "[Total HT]"],
        ["TVA (taux applicable selon prestation)", "—", "—", "[Montant TVA]"],
        ["TOTAL TTC à régler par EVENTY au PARTENAIRE", "—", "—", "[Total TTC]"],
      ],
    }),

    H2("Conditions particulières"),
    Bullet("Modalité de paiement : virement bancaire à 30 jours fin de mois date de fin de séjour."),
    Bullet("Aucun acompte versé avant exécution effective de la prestation, sauf accord spécifique écrit annexé au présent bon."),
    Bullet("Compte bancaire de règlement : IBAN [renseigné par PARTENAIRE en annexe]."),
    Bullet("Facture à émettre par le PARTENAIRE à compter de la fin du séjour, à adresser à comptabilite@eventylife.fr."),

    H2("Allergènes et besoins spécifiques signalés (si applicable)"),
    makeTable({
      widths: [4680, 4680],
      header: ["Voyageur (initiales)", "Information à respecter"],
      rows: [
        ["[VOYAGEUR-1]", "[Allergie / régime alimentaire / accessibilité PMR / autre]"],
        ["[VOYAGEUR-2]", "[À compléter le cas échéant]"],
        ["[…]", "[…]"],
      ],
    }),

    H2("Coordonnées opérationnelles voyage"),
    Bullet("Accompagnateur Eventy sur place : [Nom Prénom] — [téléphone portable] — [email]."),
    Bullet("Heure d'arrivée prévue du groupe : [HH:MM]."),
    Bullet("Heure de départ prévue : [HH:MM]."),
    Bullet("Mode de transport d'arrivée : [autocar Grand Tourisme / vol / autre]."),
    Bullet("Ligne d'urgence Eventy 24/7 : [numéro communiqué au PARTENAIRE]."),

    H2("Annulation et indemnisation"),
    P("En cas d'annulation par EVENTY, indemnisation forfaitaire selon barème du contrat-cadre HRA :"),
    Bullet("Plus de 30 jours avant la prestation : aucun frais."),
    Bullet("Entre J-30 et J-15 : 15 % du montant TTC du présent bon."),
    Bullet("Entre J-14 et J-7 : 30 % du montant TTC."),
    Bullet("Entre J-6 et J-1 : 50 % du montant TTC."),
    Bullet("Le jour J : 100 % du montant TTC."),
    Bullet("Annulation pour cause de seuil minimum voyageurs non atteint ou force majeure : régime spécifique en annexe au contrat-cadre."),

    H2("Confirmation et signature"),
    P("Le PARTENAIRE confirme la présente commande par retour écrit (email ou plateforme Eventy) sous 48 heures à compter de la réception du bon. À défaut de retour dans ce délai, le bon est réputé non confirmé et EVENTY se réserve la faculté de réorienter la commande vers un autre partenaire."),

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
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Émetteur — EVENTY LIFE SAS", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 240 }, children: [new TextRun({ text: "[Nom Prénom + fonction]", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Date · signature · cachet", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
            new TableCell({
              borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
              width: { size: 4680, type: WidthType.DXA },
              margins: { top: 100, bottom: 200, left: 120, right: 120 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Confirmation — PARTENAIRE HRA", bold: true, size: 20, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 240 }, children: [new TextRun({ text: "[Nom Prénom + fonction]", size: 18, font: "Calibri" })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Date · signature · cachet · « Bon pour accord »", italics: true, size: 16, color: COLOR.gray, font: "Calibri" })] }),
              ],
            }),
          ],
        }),
      ],
    }),

    Spacer(160),
    P("Document de référence : voir contrat-cadre HRA Partenaire (Eventy-Life-Contrat-HRA-Partenaire.docx) pour les conditions générales applicables au présent bon de commande.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — MENTIONS LÉGALES
// ============================================================
function mentionsLegales() {
  return [
    bandeauTitre(
      "MENTIONS LÉGALES — eventylife.fr",
      "Conformes au Code du Tourisme, à la LCEN et au RGPD",
    ),
    Spacer(140),

    P("Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), au Code du Tourisme et au règlement (UE) 2016/679 (RGPD), les utilisateurs du site eventylife.fr sont informés des mentions ci-après.", { italics: true }),

    H2("1. Éditeur du site"),
    makeTable({
      widths: [3500, 5860],
      header: ["Champ", "Information"],
      rows: [
        ["Raison sociale", "EVENTY LIFE — Société par Actions Simplifiée (SAS)"],
        ["Capital social", "[Montant à compléter] €"],
        ["Siège social", "[Adresse postale complète]"],
        ["RCS / SIREN", "[ville] · [Numéro SIREN]"],
        ["SIRET du siège", "[Numéro SIRET]"],
        ["Code NAF / APE", "7912Z — Activités des voyagistes"],
        ["Numéro TVA intracommunautaire", "FR[XX][SIREN]"],
        ["Représentant légal", "M. David Eventy, Président"],
        ["Adresse électronique", "eventylife@gmail.com"],
        ["Téléphone", "[À compléter]"],
        ["Site internet", "eventylife.fr"],
      ],
    }),

    H2("2. Directeur de la publication"),
    P("M. David Eventy, en qualité de Président d'EVENTY LIFE SAS."),

    H2("3. Hébergement du site"),
    makeTable({
      widths: [3500, 5860],
      header: ["Champ", "Information"],
      rows: [
        ["Hébergeur back-end (API, base de données)", "Scaleway · 8 rue de la Ville l'Évêque, 75008 Paris · scaleway.com"],
        ["Hébergeur front-end (site public)", "Vercel Inc. · 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis · vercel.com"],
        ["Localisation des données voyageurs", "France — datacenters Scaleway (Paris)"],
        ["Conformité hébergement", "ISO 27001, certifications applicables"],
      ],
    }),

    H2("4. Activité réglementée — opérateur de voyages"),
    P("EVENTY LIFE SAS exerce l'activité d'opérateur de voyages et de séjours au sens des articles L211-1 et suivants du Code du Tourisme."),
    makeTable({
      widths: [3500, 5860],
      header: ["Élément réglementaire", "Information"],
      rows: [
        ["Numéro d'immatriculation Atout France", "IM [###-###-###]"],
        ["Inscription au registre", "registre-operateurs-de-voyages.atout-france.fr"],
        ["Garant financier", "APST — Association Professionnelle de Solidarité du Tourisme"],
        ["Adresse APST", "15 avenue Carnot, 75017 Paris — info@apst.travel — 01 44 09 25 35"],
        ["Site APST", "apst.travel"],
        ["Assurance Responsabilité Civile Professionnelle", "[Nom de l'assureur] — Contrat n° [n°]"],
        ["Plafond minimum RC Pro", "1 500 000 € par sinistre"],
        ["Médiateur de la consommation", "Médiation Tourisme et Voyage (MTV)"],
        ["Adresse MTV", "12 rue Eugène Sue, 75018 Paris — mtv.travel"],
        ["Capacité professionnelle du dirigeant", "Justifiée conformément à l'article R211-43 du Code du Tourisme"],
      ],
    }),

    H2("5. Protection des données personnelles (RGPD)"),
    P("EVENTY LIFE SAS est responsable de traitement au sens du règlement (UE) 2016/679. Les données personnelles collectées sont traitées pour les finalités d'exécution du Contrat de voyage, de communication précontractuelle et contractuelle, de gestion administrative et comptable, de sécurité des paiements, de satisfaction post-voyage et, le cas échéant, de communication marketing avec consentement préalable du Voyageur."),
    P("Délégué à la Protection des Données (DPO) :"),
    Bullet("Coordonnées : dpo@eventylife.fr (DPO externe désigné dans les 6 mois suivant le lancement)."),
    Bullet("Pour toute demande relative à l'exercice des droits RGPD (accès, rectification, effacement, portabilité, limitation, opposition)."),
    Bullet("En cas de désaccord, possibilité de saisir la CNIL — cnil.fr — 3 Place de Fontenoy, 75007 Paris."),

    H2("6. Propriété intellectuelle"),
    P("L'ensemble des éléments composant le site eventylife.fr (textes, photographies, vidéos, logos, marques, charte graphique, code source, architecture de la plateforme) est la propriété exclusive d'EVENTY LIFE SAS ou fait l'objet d'autorisations d'usage. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle, par quelque procédé que ce soit, est interdite sans autorisation écrite préalable d'EVENTY LIFE SAS, sous peine de constituer une contrefaçon sanctionnée par les articles L335-2 et suivants du Code de la propriété intellectuelle."),

    H2("7. Crédits photographiques et iconographiques"),
    Bullet("Photographies de voyages : EVENTY LIFE SAS et créateurs partenaires (avec accord d'usage)."),
    Bullet("Photographies de partenaires HRA : avec accord express de chaque établissement."),
    Bullet("Iconographie et illustrations : licences appropriées (préciser les sources : Pexels, Unsplash sous licence libre, Adobe Stock licence commerciale, etc.)."),
    Bullet("Logo Eventy Life : marque déposée [INPI · numéro de dépôt à compléter]."),

    H2("8. Cookies et traceurs"),
    P("Le site eventylife.fr utilise des cookies strictement nécessaires au fonctionnement (gestion de la session, panier de réservation, sécurité), des cookies de mesure d'audience (anonymisés) et, sous réserve du consentement préalable de l'utilisateur, des cookies marketing. La politique cookies complète est accessible sur eventylife.fr/cookies. L'utilisateur peut à tout moment modifier ses préférences cookies depuis le bandeau dédié et accepter ou refuser le dépôt des cookies non strictement nécessaires."),

    H2("9. Conditions Générales de Vente"),
    P("L'ensemble des relations contractuelles entre EVENTY LIFE SAS et ses clients (Voyageurs) est régi par les Conditions Générales de Vente accessibles sur eventylife.fr/cgv. La conclusion du Contrat de voyage emporte acceptation pleine et entière des présentes mentions légales et des CGV applicables."),

    H2("10. Médiation et résolution des litiges"),
    P("Conformément aux articles L612-1 et suivants du Code de la consommation, en cas de différend non résolu par contact préalable avec EVENTY LIFE SAS, le Voyageur peut saisir gratuitement le médiateur de la consommation compétent — la Médiation Tourisme et Voyage (MTV) — sur mtv.travel/demande-saisine."),

    H2("11. Loi applicable"),
    P("Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur application sera soumis aux tribunaux compétents conformément au Code de procédure civile."),

    Spacer(180),
    P("Date de dernière mise à jour : 30 avril 2026.", { italics: true, color: COLOR.gray }),
    P("Toute modification des présentes mentions légales sera publiée sur eventylife.fr et notifiée aux utilisateurs concernés le cas échéant.", { italics: true, color: COLOR.gray }),
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
      file: "docs/garanties/Eventy-Life-CGV.docx",
      title: "Eventy Life — Conditions Générales de Vente",
      description: "CGV conformes Code du Tourisme et directive (UE) 2015/2302.",
      footer: "EVENTY LIFE SAS — Conditions Générales de Vente",
      children: cgv(),
    },
    {
      file: "docs/garanties/Eventy-Life-Bon-De-Commande-HRA.docx",
      title: "Eventy Life — Bon de commande HRA",
      description: "Modèle de bon de commande pour partenaire HRA.",
      footer: "EVENTY LIFE SAS — Bon de commande HRA",
      children: bonDeCommande(),
    },
    {
      file: "docs/garanties/Eventy-Life-Mentions-Legales.docx",
      title: "Eventy Life — Mentions légales",
      description: "Mentions légales du site eventylife.fr.",
      footer: "EVENTY LIFE SAS — Mentions légales eventylife.fr",
      children: mentionsLegales(),
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
