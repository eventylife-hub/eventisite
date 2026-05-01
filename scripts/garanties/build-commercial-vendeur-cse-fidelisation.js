/**
 * Eventy Life — Trois documents commerciaux
 *
 *   1. Argumentaire commercial vendeurs détaillé
 *   2. Document commercial CSE / B2B
 *   3. Programme de fidélisation voyageurs détaillé (Eventy Famille)
 *
 * Usage : node scripts/garanties/build-commercial-vendeur-cse-fidelisation.js
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
// DOCUMENT 1 — ARGUMENTAIRE COMMERCIAL VENDEURS
// ============================================================
function argumentaireVendeurs() {
  return [
    bandeauTitre(
      "ARGUMENTAIRE COMMERCIAL VENDEURS EVENTY",
      "Référentiel pratique du vendeur Eventy — 5 % HT du CA voyage",
    ),
    Spacer(160),

    P("Ce document est l'outil de référence du vendeur Eventy : phrase d'accroche, présentation de l'offre, traitement des objections les plus fréquentes, closing. Il est conçu pour être maîtrisé en 1 journée de formation et réutilisé en autonomie au quotidien.", { italics: true }),

    P("Rappel du modèle : tout vendeur Eventy (créateur, ambassadeur, influenceur, partageant, indépendant) perçoit 5 % HT du CA voyage placé. Cette commission est claire, opposable, versée sous 21 jours fin de mois après le retour de voyage du voyageur. Le rôle de vendeur est cumulable avec un rôle de créateur.", { italics: true }),

    H1("1. Posture vendeur Eventy"),

    H2("1.1. Trois principes de l'entretien"),
    Bullet("Écouter avant de vendre — le voyageur a une histoire, une attente, un rêve."),
    Bullet("Vendre l'expérience, pas le prix — Eventy n'est pas le moins cher, c'est le mieux pensé."),
    Bullet("Rester honnête — refuser une vente vaut mieux qu'une vente regrettée."),

    H2("1.2. Les 3 règles d'or Eventy"),
    Bullet("Ne jamais survendre — pas de promesse qu'on ne peut pas tenir."),
    Bullet("Toujours présenter le « Pack Sérénité » et la garantie financière APST."),
    Bullet("Toujours signaler le seuil minimal de partenaires (4 voyageurs) — le voyage part même si le bus n'est pas plein."),

    H1("2. Phrase d'accroche selon le canal"),

    H2("2.1. Conversation directe (réseau, événement, salon)"),
    P("« Bonjour, je suis [Prénom], et je travaille avec Eventy. On organise des voyages de groupe où tu n'as rien à gérer, tout à vivre — destination, hôtel, activités, bus : on s'occupe de tout. Tu connais des gens qui aiment voyager mais qui en ont marre de gérer la logistique ? »", { italics: true }),

    H2("2.2. Réseaux sociaux (story / post)"),
    P("« Tu rêves d'un voyage en groupe sans le casse-tête de l'organisation ? Eventy s'occupe de tout : transport, hôtel, repas, activités. Tu paies un seul prix tout inclus, tu pars rassuré, tu n'as rien à gérer. Et même si on n'est que 4 voyageurs sur le bus, on part quand même. »", { italics: true }),

    H2("2.3. Email / message à un prospect"),
    P("« Salut [Prénom], je sais que tu adores voyager. Je viens de découvrir Eventy et je trouve ça très bien pensé : un voyage de groupe tout inclus (transport + hôtel + repas + activités + accompagnateur), avec un Pack Sérénité (assistance 24/7, médecin sur place, rapatriement). Et le prix est juste — décomposé euro par euro, sans surprise. Tu veux que je t'envoie deux ou trois exemples de programmes ? »", { italics: true }),

    H1("3. Présentation produit (3 minutes maximum)"),

    H2("3.1. La promesse Eventy"),
    P("« Le voyage de groupe où tu n'as rien à gérer, tout à vivre. »", { bold: true }),

    H2("3.2. Les 6 piliers à mentionner"),
    Numbered("Tout est inclus dans un seul prix : transport, hébergement, repas, activités, accompagnateur, Pack Sérénité."),
    Numbered("Un accompagnateur formé est avec le groupe en permanence — disponible 24/7 sur place."),
    Numbered("Pack Sérénité : médecin sur place, hébergement de secours, ligne d'urgence, rapatriement médical."),
    Numbered("Garantie financière APST : si Eventy fait défaut, le voyageur récupère 100 % de ses fonds versés."),
    Numbered("Délai de rétractation 14 jours — réservation possible sans risque."),
    Numbered("Le voyage part même si on n'est que 4 voyageurs (seuil minimal de partenaires)."),

    H2("3.3. Le différenciateur n° 1 — la transparence des prix"),
    P("« Sur la fiche voyage Eventy, tu vois exactement combien va à l'hôtel, au restaurant, au transporteur, à l'accompagnateur, à Eventy. Aucun autre opérateur ne fait ça. C'est une économie circulaire et juste : chaque euro est tracé. »", { italics: true }),

    H1("4. Traitement des objections les plus fréquentes"),

    H2("4.1. « C'est cher »"),
    P("Réponse type : « Si tu compares un séjour Eventy à un voyage individuel équivalent (bus, hôtel 3-4*, repas, activités, accompagnement, assurance), tu verras qu'on est même plus économique. Ce qui peut sembler cher, c'est le tout-inclus : tu paies une seule fois, et tu n'as rien à débourser sur place. »"),
    P("Pivot : « Et si je te montrais le détail du prix ? La fiche voyage Eventy te dit exactement où va chaque euro. »", { italics: true }),

    H2("4.2. « J'ai peur de partir avec des inconnus »"),
    P("Réponse type : « Beaucoup de voyageurs ont la même appréhension au départ. Ce qu'on entend après le voyage : ils sont devenus amis avec d'autres voyageurs, et ont prévu de repartir ensemble. L'accompagnateur facilite la cohésion sans jamais l'imposer. Tu es libre, tu participes ou pas aux activités, tu fais à ton rythme. »"),
    P("Pivot : « Et tu sais quoi ? On peut aussi t'envoyer un témoignage d'un voyageur qui était comme toi avant son premier voyage. »", { italics: true }),

    H2("4.3. « Je préfère organiser moi-même »"),
    P("Réponse type : « Je comprends complètement. Beaucoup de gens commencent comme ça. Mais combien d'heures tu mets à organiser un voyage de 4-5 jours ? Recherche hôtel, restos, activités, transport, négociation… On compte facilement 20 heures. Avec Eventy, tu signes en 5 minutes et tu profites. Et si tu adores organiser, garde ce plaisir pour les voyages perso, et utilise Eventy pour les voyages où tu veux juste te poser. »"),

    H2("4.4. « J'ai peur de la sécurité »"),
    P("Réponse type : « Eventy est immatriculé Atout France et adhère à l'APST — la même garantie que les grands tour-opérateurs. Si quelque chose se passe mal financièrement, tu récupères 100 % de tes fonds. Sur place, le Pack Sérénité couvre médical, hébergement, rapatriement. L'accompagnateur est joignable 24/7. Tu n'es jamais seul. »"),

    H2("4.5. « Et si on annule, je perds tout ? »"),
    P("Réponse type : « Tu as 14 jours de rétractation à compter de la réservation : 100 % remboursé. Au-delà, on a un barème transparent affiché dans les CGV — plus l'annulation est tardive, plus une partie reste retenue, mais on ne facture jamais 100 % avant la dernière minute. Et si tu prends l'assurance annulation (en option), tu es couvert pour la plupart des causes. »"),

    H2("4.6. « Je ne connais pas Eventy »"),
    P("Réponse type : « C'est normal, on est jeune. Mais on est immatriculé Atout France, on a une garantie financière APST de [Montant] €, on a une assurance RC Pro de plusieurs millions d'euros, et notre dirigeant David a documenté la totalité du dispositif (44+ documents publics). Tu peux tout vérifier. Et tu peux commencer petit : un voyage de 3-4 jours pour te faire une idée. »"),

    H2("4.7. « Pourquoi je passerais par toi plutôt que d'aller direct sur eventylife.fr ? »"),
    P("Réponse type : « C'est exactement la même chose pour toi — même prix, même conditions, mêmes garanties. Eventy a structuré son réseau de vendeurs comme un partage : si tu réserves via moi, c'est 5 % de ce que tu payes qui me revient en commission, sans que tu paies un centime de plus. C'est leur façon de redistribuer la création de valeur. »"),

    H1("5. Closing — les 5 questions de validation"),
    Numbered("« Quelle destination te tente le plus dans le catalogue ? »"),
    Numbered("« Tu pars seul·e, en couple, avec quelqu'un d'autre ? »"),
    Numbered("« Sur quelle période tu peux partir ? »"),
    Numbered("« Tu as un budget en tête ou tu veux que je te montre les options ? »"),
    Numbered("« On regarde une fiche ensemble pour que tu puisses te projeter ? »"),

    H1("6. Réservation — guider le voyageur"),

    H2("6.1. Étapes côté voyageur"),
    Bullet("Connexion à eventylife.fr (création compte 2 minutes)."),
    Bullet("Saisie du code parrain « [TON-CODE] » à la réservation (traçabilité de la commission)."),
    Bullet("Sélection date, voyageurs, options."),
    Bullet("Paiement Stripe (CB / Apple Pay / Google Pay / virement)."),
    Bullet("Confirmation immédiate par email."),

    H2("6.2. Étapes côté vendeur"),
    Bullet("Suivi des conversions sur le portail vendeur (eventylife.fr/portail-vendeur)."),
    Bullet("Notification de chaque réservation via le code parrain."),
    Bullet("Versement automatique de la commission 21 jours après le retour du voyage."),
    Bullet("Reporting mensuel des ventes et commissions."),

    H1("7. Phrases interdites"),
    Bullet("« C'est garanti à 100 % » — formuler plutôt « assuré » et préciser le périmètre."),
    Bullet("« Vous ne paierez rien sur place » — dire plutôt « tout est inclus, sauf les pourboires et achats personnels »."),
    Bullet("« Notre accompagnateur est expert en tout » — dire plutôt « formé sur la destination et le manuel d'incident »."),
    Bullet("« On est moins cher que tout le monde » — dire plutôt « on est le plus juste — ni surpayé, ni au rabais »."),
    Bullet("Tout propos discriminant ou stéréotypé sur une destination, un public, etc."),

    H1("8. Outils mis à disposition"),
    Bullet("Catalogue voyages PDF et fiches commerciales individuelles."),
    Bullet("Vidéos courtes par voyage (à partager sur les réseaux)."),
    Bullet("Témoignages voyageurs (texte + vidéo, avec accord)."),
    Bullet("Visuels charte graphique Eventy (post réseaux sociaux préformatés)."),
    Bullet("Code parrain unique nominatif."),
    Bullet("Portail vendeur eventylife.fr/portail-vendeur (suivi conversions, commissions)."),
    Bullet("Formation initiale 1 journée + module rappel annuel."),
    Bullet("Email de support dédié : vendeur@eventylife.fr."),

    H1("9. Indicateurs de performance vendeur"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible débutant", "Cible confirmé"],
      rows: [
        ["Taux de conversion lead → réservation", "≥ 5 %", "≥ 15 %"],
        ["Nombre voyages vendus / mois", "≥ 1", "≥ 5"],
        ["Panier moyen vendu", "≥ 700 €", "≥ 850 €"],
        ["NPS du voyageur ramené", "≥ + 60", "≥ + 70"],
        ["Taux de re-réservation parrainée", "≥ 15 %", "≥ 30 %"],
        ["Commissions mensuelles", "≥ 100 €", "≥ 1 000 €"],
      ],
    }),

    H1("10. Engagement éthique du vendeur"),
    P("Tout vendeur Eventy s'engage à :"),
    Bullet("Représenter Eventy avec sincérité et alignement aux valeurs."),
    Bullet("Refuser toute pratique commerciale agressive ou trompeuse."),
    Bullet("Signaler tout problème ou inquiétude voyageur immédiatement."),
    Bullet("Respecter la procédure de signalement / lanceurs d'alerte si besoin."),
    Bullet("Suivre la formation continue et les rappels annuels."),
    Bullet("Respecter la confidentialité des données voyageurs (cohérence RGPD)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Contrat Vendeur, Code de conduite ambassadeurs, CGV, Politique RSE, FAQ voyageurs, Plan marketing An 1.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — DOCUMENT COMMERCIAL CSE / B2B
// ============================================================
function commercialCseB2B() {
  return [
    bandeauTitre(
      "OFFRE EVENTY POUR CSE ET ENTREPRISES",
      "Voyages de groupe sur-mesure pour collectifs professionnels",
    ),
    Spacer(160),

    P("EVENTY LIFE SAS propose une offre dédiée aux Comités Sociaux et Économiques (CSE), aux directions Ressources Humaines, aux associations professionnelles et aux entreprises souhaitant offrir à leurs collaborateurs ou à leurs clients un voyage de groupe sur-mesure, clé-en-main, et porteur de valeurs.", { italics: true }),

    P("L'offre B2B Eventy s'inscrit dans la même promesse que l'offre B2C : un voyage où le groupe n'a rien à gérer, où tout est inclus et où chaque euro est tracé. La différence : un cadre sur-mesure, des engagements contractuels renforcés, et une facturation conforme aux exigences administratives des structures professionnelles.", { italics: true }),

    H1("1. Pourquoi choisir Eventy pour son CSE ou son entreprise"),

    H2("1.1. Pour les bénéficiaires"),
    Bullet("Tout est inclus dans un prix unique — pas de coûts cachés."),
    Bullet("Un accompagnateur professionnel disponible 24/7."),
    Bullet("Pack Sérénité (assistance médicale, hébergement de secours, rapatriement)."),
    Bullet("Garantie financière APST (sécurité totale des fonds versés)."),
    Bullet("Programme adapté aux profils variés (intergénérationnel, mobilité réduite, allergies)."),

    H2("1.2. Pour le CSE / l'entreprise"),
    Bullet("Une offre clé-en-main, sans charge administrative pour le CSE."),
    Bullet("Une transparence absolue des prix (chaque euro tracé)."),
    Bullet("Une facturation conforme (TVA, mentions légales, exonérations applicables)."),
    Bullet("Un interlocuteur unique pour tout le projet."),
    Bullet("Possibilité de personnalisation (logo, programme, animations)."),
    Bullet("Reporting détaillé après voyage."),

    H2("1.3. Pour les valeurs portées"),
    Bullet("Souveraineté économique (économie circulaire territoriale française)."),
    Bullet("Engagement RSE structuré (audit qualité HRA, transports raisonnés)."),
    Bullet("Économie redistributive (5 % HT vendeurs, 3 pts créateurs HRA, prix juste)."),
    Bullet("Documents complets disponibles (politique RSE, charte fournisseurs, accessibilité PMR)."),

    H1("2. Trois formats CSE / B2B"),

    H2("2.1. Format 1 — Adhésion Eventy CSE"),
    Bullet("Le CSE met à disposition de ses bénéficiaires le catalogue Eventy avec un code de réduction dédié."),
    Bullet("Le bénéficiaire réserve directement, le CSE peut prendre en charge tout ou partie du voyage."),
    Bullet("Pas d'engagement de volume — facturation à la prestation."),
    Bullet("Reporting mensuel au CSE des voyages réservés."),
    Bullet("Tarif : prix grand public, code CSE = 5 % de remise (financée par Eventy via la commission vendeur réorientée vers le CSE)."),

    H2("2.2. Format 2 — Voyage privatisé"),
    Bullet("Le CSE / l'entreprise réserve un voyage entier pour ses bénéficiaires (15 à 38 personnes)."),
    Bullet("Programme adaptable (durée, destination, activités, niveau de prestation)."),
    Bullet("Tarif négocié sur devis — économie possible vs prix grand public selon volume."),
    Bullet("Personnalisation incluse (badge, programme imprimé, animations dédiées)."),
    Bullet("Facture unique au CSE / à l'entreprise (TVA marge applicable)."),

    H2("2.3. Format 3 — Voyage incentive / séminaire"),
    Bullet("Voyage à finalité professionnelle pour collaborateurs (séminaire, incentive, team-building)."),
    Bullet("Programme structuré (alternance moments de travail, conviviaux, découvertes)."),
    Bullet("Mise à disposition de salles de réunion équipées sur place."),
    Bullet("Possibilité d'inviter des partenaires, fournisseurs, clients."),
    Bullet("Facturation séparée si nécessaire (formation continue / déplacement professionnel)."),

    H1("3. Tarification B2B (formats 2 et 3)"),

    H2("3.1. Modèle"),
    Bullet("Tarif publié sur devis selon volume, durée, destination, niveau de prestation."),
    Bullet("Possibilité de tarifs dégressifs au-delà de 25 voyageurs."),
    Bullet("Pas de marge cachée — décomposition transparente du prix dans le devis."),

    H2("3.2. Conditions de paiement"),
    Bullet("Acompte 30 % à la réservation (compte cantonné APST)."),
    Bullet("Solde 30 jours avant le départ."),
    Bullet("Paiement par virement (les CB / chèques sont acceptés mais privilégie le virement)."),
    Bullet("Possibilité de paiement en 2-3 fois sans frais sur les voyages > 5 000 € HT."),

    H2("3.3. Annulation par le CSE / l'entreprise"),
    Bullet("≥ 90 jours avant départ : 5 % de frais (couverture des frais de dossier)."),
    Bullet("60-89 jours : 30 %."),
    Bullet("30-59 jours : 60 %."),
    Bullet("8-29 jours : 90 %."),
    Bullet("≤ 7 jours : 100 % (sauf cas de force majeure attesté)."),
    Bullet("Possibilité de céder le voyage à un autre groupe (reportabilité encadrée)."),

    H1("4. Programme type — voyage privatisé 4 jours / 3 nuits"),
    makeTable({
      widths: [1872, 7488],
      header: ["Jour", "Programme indicatif"],
      rows: [
        ["Jour 1", "Départ matinal en autocar Grand Tourisme · arrivée hôtel midi · déjeuner d'accueil · après-midi visite guidée · dîner de bienvenue à l'hôtel"],
        ["Jour 2", "Petit déjeuner buffet · matinée activité au choix (visite culturelle, randonnée légère) · déjeuner local · après-midi atelier ou découverte · dîner restaurant typique"],
        ["Jour 3", "Petit déjeuner · journée découverte région (excursion, dégustation, etc.) · déjeuner sur place · dîner gastronomique"],
        ["Jour 4", "Petit déjeuner · matinée libre (shopping, balade) · déjeuner avant départ · retour en autocar · arrivée fin d'après-midi"],
      ],
    }),

    H1("5. Inclus dans le tarif B2B"),
    Bullet("Transport aller-retour en autocar Grand Tourisme (chauffeur compris) ou train/avion selon destination."),
    Bullet("Hébergement en hôtel 3*-4* selon programme (chambre double standard, single sur demande avec supplément)."),
    Bullet("Tous les repas (petits déjeuners, déjeuners, dîners — boissons soft incluses)."),
    Bullet("Activités prévues au programme (entrées, guides, transferts)."),
    Bullet("Accompagnateur Eventy formé pendant tout le séjour."),
    Bullet("Pack Sérénité (assistance 24/7, hébergement de secours, rapatriement)."),
    Bullet("Assurance RC Pro (couvrant le voyage)."),
    Bullet("Pourboires des prestataires inclus (chauffeur, guides, accompagnateur)."),

    H1("6. En option (sur devis)"),
    Bullet("Chambre individuelle (supplément single)."),
    Bullet("Activités complémentaires (vol en montgolfière, soirée privée, etc.)."),
    Bullet("Accompagnateur bilingue spécifique."),
    Bullet("Animation soirée (DJ, animation thématique, photographe)."),
    Bullet("Personnalisation matérielle (kit voyageur, photobook souvenir)."),
    Bullet("Salle de réunion équipée pour séminaire."),
    Bullet("Assurance annulation toutes causes (en complément)."),
    Bullet("Forfait CO2 compensation (tonnes CO2 estimées x prix carbone)."),

    H1("7. Démarche commerciale B2B"),

    H2("7.1. Premier contact"),
    Bullet("Email b2b@eventylife.fr ou téléphone direct."),
    Bullet("Réponse sous 24 h ouvrées."),
    Bullet("Premier rendez-vous (visio ou présentiel) sous 7 jours."),

    H2("7.2. Cadrage du besoin"),
    Bullet("Profil des bénéficiaires (nombre, âge, mobilité, attentes)."),
    Bullet("Période souhaitée et flexibilité."),
    Bullet("Budget cible et engagement de volume."),
    Bullet("Niveau de prestation attendu."),
    Bullet("Personnalisations souhaitées."),

    H2("7.3. Devis personnalisé"),
    Bullet("Remis sous 7 jours après cadrage."),
    Bullet("Détail transparent des coûts (transport, hébergement, restauration, activités, accompagnement, marge Eventy)."),
    Bullet("3 niveaux de prestation proposés (essentiel, confort, premium)."),
    Bullet("Validité du devis : 60 jours."),

    H2("7.4. Contractualisation"),
    Bullet("Contrat-cadre B2B signé électroniquement."),
    Bullet("Conditions générales B2B annexées."),
    Bullet("Acompte de 30 % à la signature."),

    H2("7.5. Suivi"),
    Bullet("Interlocuteur dédié pendant toute la phase de préparation."),
    Bullet("Points d'étape J-90, J-30, J-7."),
    Bullet("Reporting détaillé post-voyage (NPS bénéficiaires, points d'amélioration)."),

    H1("8. Documents à transmettre par le CSE / entreprise"),
    Bullet("Identification de la structure (Kbis ou équivalent, statuts, RIB)."),
    Bullet("Coordonnées du responsable du dossier."),
    Bullet("Liste nominative des bénéficiaires (40 jours avant départ)."),
    Bullet("Besoins spécifiques (allergies, mobilité, animaux d'assistance)."),
    Bullet("Le cas échéant : autorisation parentale pour mineurs."),

    H1("9. Reporting post-voyage (livré J+15)"),
    Bullet("Tableau NPS individuel et collectif."),
    Bullet("Verbatim positifs et négatifs (anonymisés)."),
    Bullet("Points forts identifiés."),
    Bullet("Pistes d'amélioration."),
    Bullet("Photos et vidéos collectives (avec accord des bénéficiaires)."),
    Bullet("Recommandations pour les prochains voyages."),

    H1("10. Indicateurs B2B Eventy"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Voyages B2B opérés / an", "≥ 5", "≥ 30"],
        ["CA B2B / CA total", "≥ 10 %", "≥ 25 %"],
        ["Panier moyen B2B (par voyageur)", "≥ 850 €", "≥ 1 000 €"],
        ["NPS bénéficiaires B2B", "≥ + 65", "≥ + 75"],
        ["Taux de fidélisation CSE / entreprise", "≥ 50 %", "≥ 70 %"],
        ["Délai de réponse à devis", "≤ 7 j", "≤ 3 j"],
      ],
    }),

    H1("11. Contacts B2B"),
    Bullet("Email dédié : b2b@eventylife.fr"),
    Bullet("Téléphone direct : [À compléter]"),
    Bullet("Catalogue B2B téléchargeable sur eventylife.fr/cse-entreprise"),

    Spacer(160),
    P("Document commercial — Version 1.0 — 2 mai 2026. Mise à jour annuelle. Ce document sert d'appui à la phase commerciale ; il est complété par un devis personnalisé et un contrat-cadre B2B.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : CGV, Catalogue programmes saison 1, Plan marketing An 1, Politique RSE, Politique accessibilité PMR.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PROGRAMME DE FIDÉLISATION VOYAGEURS
// ============================================================
function programmeFidelisation() {
  return [
    bandeauTitre(
      "PROGRAMME DE FIDÉLISATION EVENTY FAMILLE",
      "Mécanique, paliers, parrainage et engagements aux voyageurs fidèles",
    ),
    Spacer(160),

    P("Le programme de fidélisation EVENTY FAMILLE est conçu pour récompenser les voyageurs qui placent leur confiance dans Eventy et qui contribuent à faire grandir la communauté. Il s'inscrit dans une logique de réciprocité : Eventy est porté par ses voyageurs, Eventy reverse ce qu'il reçoit.", { italics: true }),

    P("Ce document complète et précise la section « Fidélisation » du document Onboarding Voyageur. Il sert de référentiel pour l'équipe (mise en œuvre, communication) et de document opposable aux voyageurs (engagements chiffrés, conditions claires).", { italics: true }),

    H1("1. Philosophie du programme"),

    H2("1.1. Principes fondateurs"),
    Bullet("Reconnaissance — chaque voyageur fidèle est important pour Eventy."),
    Bullet("Réciprocité — la fidélité du voyageur appelle la fidélité d'Eventy en retour."),
    Bullet("Simplicité — pas de mécanique alambiquée, des avantages clairs et lisibles."),
    Bullet("Tenue dans le temps — les paliers sont à vie (pas de déclassement)."),
    Bullet("Sincérité — les avantages sont réels, pas marketing."),

    H2("1.2. Promesse"),
    P("« À Eventy, on n'est pas un client de plus dans une base de données. On est de la famille — et la famille, ça se chérit. »", { italics: true, bold: true }),

    H1("2. Trois paliers de fidélité"),

    H2("2.1. Palier 1 — Voyageur Fidèle (≥ 2 voyages)"),
    Bullet("5 % de remise sur tous les voyages futurs (cumulable avec offres ponctuelles dans la limite de 15 %)."),
    Bullet("Upgrade chambre prioritaire (selon disponibilité)."),
    Bullet("Email d'anniversaire de voyage avec code privilège."),
    Bullet("Statut affiché sur l'espace voyageur."),
    Bullet("Accès anticipé au catalogue (J-30 avant le grand public)."),

    H2("2.2. Palier 2 — Voyageur Famille (≥ 5 voyages)"),
    Bullet("10 % de remise sur tous les voyages futurs (cumulable jusqu'à 20 %)."),
    Bullet("Soirée d'accueil offerte sur le voyage (apéritif privé avec accompagnateur)."),
    Bullet("Cadeau de voyage (kit personnalisé Eventy : trousse, cartes postales, etc.)."),
    Bullet("Invitation aux soirées voyageurs trimestrielles (Paris ou région selon)."),
    Bullet("Code parrainage majoré (60 € au lieu de 50 € pour le parrain)."),

    H2("2.3. Palier 3 — Voyageur Légende (≥ 10 voyages)"),
    Bullet("15 % de remise à vie sur tous les voyages."),
    Bullet("Accès en avant-première au catalogue (J-60 avant le grand public)."),
    Bullet("Invitation aux événements VIP (lancement saison, voyages presse, anniversaire Eventy)."),
    Bullet("Cadeau d'anniversaire d'arrivée au statut Légende (un voyage offert pour 2)."),
    Bullet("Possibilité de devenir ambassadeur officiel avec avantages renforcés."),
    Bullet("Mention nominative dans le « Cercle des Légendes » sur le site (avec accord)."),

    H1("3. Programme parrainage"),

    H2("3.1. Mécanique"),
    Bullet("Tout voyageur ayant effectué ≥ 1 voyage Eventy peut parrainer."),
    Bullet("Code parrainage personnel généré automatiquement (eventylife.fr/mon-compte)."),
    Bullet("Le filleul utilise le code lors de sa première réservation."),
    Bullet("Avoir parrain : 50 € par filleul ayant voyagé (60 € pour Voyageur Famille, 75 € pour Voyageur Légende)."),
    Bullet("Avantage filleul : 10 % de remise sur le premier voyage."),
    Bullet("Versement de l'avoir : sous 30 jours après le retour de voyage du filleul."),

    H2("3.2. Conditions"),
    Bullet("Aucun plafond — un voyageur peut parrainer autant qu'il le souhaite."),
    Bullet("Avoir cumulable avec les remises de palier (sans dépasser 25 % de remise totale)."),
    Bullet("Validité de l'avoir : 24 mois à compter du versement."),
    Bullet("Non transférable, non remboursable en espèces."),

    H2("3.3. Cas particulier — Famille / proches"),
    Bullet("Possibilité de parrainer son conjoint, ses enfants majeurs, ses parents, sa fratrie (sans limite)."),
    Bullet("Pas de parrainage entre comptes voyageurs joints (un compte = un parrain)."),

    H1("4. Avantages additionnels permanents"),

    H2("4.1. Pour tous les voyageurs (avec ou sans palier)"),
    Bullet("Newsletter mensuelle avec inspirations et pré-annonces."),
    Bullet("Réponse personnalisée aux questions email sous 24 h."),
    Bullet("Possibilité de proposer une destination au catalogue (formulaire eventylife.fr/proposer)."),
    Bullet("Témoignages voyageurs valorisés (avec accord) sur le site et les réseaux."),

    H2("4.2. Anniversaire voyageur"),
    Bullet("Code privilège 5 % offert dans le mois de l'anniversaire (anniversaire civil)."),
    Bullet("Email personnalisé avec attention chaleureuse."),

    H2("4.3. Anniversaire de voyage"),
    Bullet("Pour chaque voyage à anniversaire (1 an, 2 ans, 5 ans) : email mémoire avec photos / vidéos du voyage."),
    Bullet("Suggestion de re-réservation à période similaire (sans pression commerciale)."),

    H1("5. Communauté Eventy Famille"),

    H2("5.1. Groupes et espaces"),
    Bullet("Groupe Facebook privé Eventy Famille (réservé voyageurs ayant ≥ 1 voyage)."),
    Bullet("Newsletter mensuelle Famille (contenus exclusifs, témoignages, conseils)."),
    Bullet("Application mobile (en cible An 2-3)."),

    H2("5.2. Événements"),
    Bullet("Apéro Eventy trimestriel (Paris + 2 villes en province en rotation)."),
    Bullet("Conférence voyage annuelle (1 voyageur Légende et 1 partenaire HRA = 2 témoins)."),
    Bullet("Anniversaire Eventy annuel (juin) : événement ouvert à toute la communauté."),

    H2("5.3. Sondages et co-construction"),
    Bullet("Sondage trimestriel pour orienter le catalogue."),
    Bullet("Vote sur les destinations à venir."),
    Bullet("Possibilité de voter sur certaines décisions stratégiques (consultation, non décisionnelle)."),

    H1("6. Comptabilisation et palier"),

    H2("6.1. Définition du voyage comptabilisé"),
    Bullet("Un voyage est comptabilisé une fois retourné (départ + retour effectif)."),
    Bullet("Un voyage annulé (par le voyageur ou Eventy) ne compte pas."),
    Bullet("Un voyage payé par un parrain pour son filleul compte uniquement pour le filleul (pas de double comptage)."),
    Bullet("Un voyage groupe / privatisé compte 1× pour chaque voyageur."),

    H2("6.2. Activation du palier"),
    Bullet("Le palier est activé automatiquement dès le retour du voyage qui valide le seuil."),
    Bullet("Communication immédiate au voyageur (email + notification dans l'espace voyageur)."),
    Bullet("Effet sur les futurs voyages réservés à compter du retour."),

    H2("6.3. Maintien à vie"),
    Bullet("Une fois acquis, un palier ne se perd jamais (pas de déclassement par inactivité)."),
    Bullet("L'éventuelle suspension du programme global serait communiquée 12 mois à l'avance avec maintien des engagements pris."),

    H1("7. Indicateurs de fidélisation"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 5"],
      rows: [
        ["Taux de re-réservation 2e voyage (12 mois)", "≥ 25 %", "≥ 50 %"],
        ["Taux de re-réservation 3e voyage", "≥ 15 %", "≥ 35 %"],
        ["Voyageurs au statut Famille (≥ 5 voyages)", "—", "≥ 5 % base"],
        ["Voyageurs au statut Légende (≥ 10 voyages)", "—", "≥ 1 % base"],
        ["Taux de parrainage actif", "≥ 15 %", "≥ 35 %"],
        ["Avoirs parrain versés / an", "≥ 5 000 €", "≥ 200 000 €"],
        ["NPS voyageurs fidèles", "≥ + 75", "≥ + 80"],
        ["Membres groupe Facebook privé", "≥ 200", "≥ 50 000"],
      ],
    }),

    H1("8. Engagements opposables Eventy"),
    P("Eventy s'engage formellement vis-à-vis des voyageurs fidèles à :"),
    Bullet("Maintenir la mécanique de paliers à vie (à compter de l'inscription)."),
    Bullet("Verser les avoirs parrain dans les délais annoncés."),
    Bullet("Ne pas dégrader les avantages sans préavis 12 mois."),
    Bullet("Communiquer transparente sur tout changement majeur du programme."),
    Bullet("Maintenir la confidentialité absolue des données voyageurs (cohérence RGPD)."),
    Bullet("Refuser toute discrimination dans l'application du programme."),
    Bullet("Tenir un registre des avoirs et paliers, accessible au voyageur dans son espace."),

    H1("9. Cas particuliers"),

    H2("9.1. Décès d'un voyageur fidèle"),
    Bullet("Communication respectueuse à la famille."),
    Bullet("Avoirs parrain en cours transférables aux ayants droit (sur demande)."),
    Bullet("Mention dans le carnet de mémoire de la communauté (avec accord famille)."),

    H2("9.2. Voyageur exclu pour faute grave"),
    Bullet("Cas extrême — voyageur ayant eu un comportement violent, discriminatoire ou frauduleux."),
    Bullet("Procédure encadrée par le Président, après écoute du voyageur concerné."),
    Bullet("Communication écrite et motivée."),
    Bullet("Statut suspendu, avoirs remboursés sous 30 jours sauf si fraude avérée (rétention possible)."),

    H2("9.3. Litige sur l'attribution d'un palier"),
    Bullet("Demande de revue auprès de fidelite@eventylife.fr."),
    Bullet("Réponse motivée sous 14 jours."),
    Bullet("Le cas échéant : médiation Tourisme et Voyage (MTV)."),

    H1("10. Évolution du programme"),
    Bullet("Revue annuelle (1er trimestre)."),
    Bullet("Sondage des voyageurs Famille et Légende (consultation directe)."),
    Bullet("Ajustements possibles : nouveaux avantages, nouveaux paliers, ajustement des seuils."),
    Bullet("Aucune dégradation possible sans préavis 12 mois."),

    Spacer(160),
    P("Document commercial et opposable — Version 1.0 — 2 mai 2026. Engagements à effet immédiat sur les voyageurs adhérents.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Onboarding voyageur, FAQ voyageurs, CGV (article remises et programmes), Politique RGPD, Politique avis voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Argumentaire-Vendeurs.docx",
      title: "Eventy Life — Argumentaire commercial vendeurs",
      description: "Référentiel pratique du vendeur Eventy : pitch, objections, closing.",
      footer: "EVENTY LIFE SAS — Argumentaire vendeurs · Confidentiel",
      children: argumentaireVendeurs(),
    },
    {
      file: "docs/garanties/Eventy-Life-Offre-CSE-B2B.docx",
      title: "Eventy Life — Offre CSE et B2B",
      description: "Document commercial pour CSE, RH et entreprises.",
      footer: "EVENTY LIFE SAS — Offre CSE et B2B",
      children: commercialCseB2B(),
    },
    {
      file: "docs/garanties/Eventy-Life-Programme-Fidelisation-Famille.docx",
      title: "Eventy Life — Programme de fidélisation Eventy Famille",
      description: "Mécanique, paliers, parrainage et engagements voyageurs fidèles.",
      footer: "EVENTY LIFE SAS — Programme fidélisation Eventy Famille",
      children: programmeFidelisation(),
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
