/**
 * Eventy Life — Trois documents support voyageur
 *
 *   1. Politique de gestion des avoirs et remboursements
 *   2. Plan d'animation communauté Eventy Famille
 *   3. Politique de communication post-incident voyageur
 *
 * Usage : node scripts/garanties/build-avoirs-comm-famille-post-incident.js
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
// DOCUMENT 1 — POLITIQUE DE GESTION DES AVOIRS ET REMBOURSEMENTS
// ============================================================
function politiqueAvoirsRemboursements() {
  return [
    bandeauTitre(
      "POLITIQUE DE GESTION DES AVOIRS ET REMBOURSEMENTS",
      "Règles de remboursement et avoirs voyageurs Eventy Life",
    ),
    Spacer(160),

    P("La présente politique formalise la gestion des avoirs et remboursements voyageurs chez EVENTY LIFE SAS. Elle complète les CGV (qui posent le cadre contractuel), la Procédure de réclamation détaillée (qui couvre le traitement des réclamations) et le Programme de fidélisation Eventy Famille (qui couvre les avoirs parrain). Elle précise les règles concrètes appliquées par l'équipe au quotidien.", { italics: true }),

    P("Eventy adopte une approche claire : remboursement rapide quand il est dû, avoir voyage attractif quand c'est cohérent, refus du « avoir forcé » qui pénalise le voyageur. Notre philosophie : un voyageur traité justement aujourd'hui est un voyageur fidèle demain. La politique de remboursement n'est pas un coût, c'est un investissement dans la confiance.", { italics: true }),

    H1("1. Cadre légal de référence"),
    Bullet("Articles L211-14 et L211-15 du Code du tourisme — droit de rétractation et résolution."),
    Bullet("Article L211-13 — modification du forfait par l'opérateur."),
    Bullet("Directive (UE) 2015/2302 — droits des voyageurs en cas d'annulation."),
    Bullet("Code de la consommation — articles L221-18 et suivants (vente à distance)."),
    Bullet("CGV Eventy Life (cohérence)."),

    H1("2. Cas de remboursement intégral (100 %)"),

    H2("2.1. Délai de rétractation"),
    Bullet("14 jours après la réservation (cohérence CGV)."),
    Bullet("Refus de toute pénalité ou frais administratifs."),
    Bullet("Versement sous 14 jours par virement."),

    H2("2.2. Annulation par Eventy avant le départ"),
    Bullet("Force majeure dûment caractérisée."),
    Bullet("Insuffisance du seuil minimal de partenaires (4 voyageurs) — bien que rare car Eventy s'engage à partir."),
    Bullet("Crise sanitaire ou géopolitique."),
    Bullet("Au choix du voyageur : remboursement intégral OU avoir 110 % du montant versé (cohérence CGV)."),

    H2("2.3. Modification substantielle non acceptée"),
    Bullet("Si Eventy modifie substantiellement le forfait (changement majeur destination, dates, programme)."),
    Bullet("Le voyageur peut refuser et obtenir remboursement intégral."),
    Bullet("Cohérence Code du tourisme article L211-13."),

    H2("2.4. Manquement Eventy aux obligations"),
    Bullet("Cas exceptionnel — manquement avéré aux obligations contractuelles."),
    Bullet("Étude au cas par cas, possible remboursement intégral + indemnité."),
    Bullet("Cohérence Procédure de réclamation détaillée."),

    H1("3. Cas de remboursement partiel"),

    H2("3.1. Annulation par le voyageur — barème CGV"),
    makeTable({
      widths: [3744, 2808, 2808],
      header: ["Délai d'annulation", "Pénalité", "Remboursement"],
      rows: [
        ["≥ 90 jours avant départ", "5 %", "95 %"],
        ["60-89 jours", "30 %", "70 %"],
        ["30-59 jours", "60 %", "40 %"],
        ["8-29 jours", "90 %", "10 %"],
        ["≤ 7 jours", "100 %", "0 %"],
      ],
    }),

    H2("3.2. Cas particuliers du barème"),
    Bullet("Possibilité de céder le voyage à un autre voyageur (modification réservation, frais 50 €)."),
    Bullet("Si voyageur a souscrit assurance annulation tiers : application des conditions de l'assureur."),
    Bullet("Refus systématique des frais d'annulation cachés ou non prévus aux CGV."),

    H2("3.3. Indemnité partielle pour incident voyage"),
    Bullet("Cohérence avec Procédure de réclamation détaillée (10 cas avec montants)."),
    Bullet("Barème indicatif : 50-150 € par cas selon gravité."),
    Bullet("Validation Président pour indemnité > 200 €."),

    H1("4. Avoir voyage Eventy"),

    H2("4.1. Conditions"),
    Bullet("Possibilité d'avoir voyage en cas d'annulation Eventy (110 % du montant versé)."),
    Bullet("Avoir parrain (50/60/75 € selon palier — cohérence Programme de fidélisation)."),
    Bullet("Avoir compensatoire en cas d'incident voyageur (validé Président, plafond 300 €)."),
    Bullet("Avoir promotionnel exceptionnel (campagne, anniversaire)."),

    H2("4.2. Modalités d'utilisation"),
    Bullet("Validité : 24 mois à compter du versement (sauf si autre durée mentionnée)."),
    Bullet("Cumul possible avec remises de palier (limite 25 % de remise totale)."),
    Bullet("Application automatique lors de la prochaine réservation."),
    Bullet("Pas de monnaie de pile (l'avoir non utilisé reste à utiliser sur futures réservations)."),

    H2("4.3. Refus structurés"),
    Bullet("Refus de l'avoir forcé (si remboursement de droit, le voyageur a le choix)."),
    Bullet("Refus de la péremption courte (minimum 24 mois)."),
    Bullet("Refus de la non-cumulabilité abusive."),
    Bullet("Refus du conditionnement à un montant minimum d'achat (sauf si avoir promotionnel cadeau)."),

    H1("5. Modalités opérationnelles"),

    H2("5.1. Demande de remboursement"),
    Bullet("Email à : annulation@eventylife.fr ou modification@eventylife.fr."),
    Bullet("Indication claire du dossier voyageur, voyage concerné, motif."),
    Bullet("Confirmation de réception sous 48 h ouvrées."),
    Bullet("Cohérence Onboarding voyageur (parcours documenté)."),

    H2("5.2. Validation"),
    Bullet("Validation par le Président (ou délégation équipe support)."),
    Bullet("Délai de validation : ≤ 7 jours ouvrés."),
    Bullet("Communication écrite du résultat (motivé en cas de refus partiel)."),

    H2("5.3. Versement"),
    Bullet("Remboursement par virement (RIB voyageur)."),
    Bullet("Délai : 14 jours après validation (au-delà : préjudice indemnisable)."),
    Bullet("Avoir voyage : crédité immédiatement sur l'espace voyageur."),
    Bullet("Justificatif fourni par email (PDF)."),

    H1("6. Cas particuliers"),

    H2("6.1. Annulation pour décès / accident grave"),
    Bullet("Geste commercial possible (au-delà du barème CGV)."),
    Bullet("Validation Président, sur production de justificatif."),
    Bullet("Décision empathique mais réaliste."),

    H2("6.2. Voyage CSE / B2B"),
    Bullet("Cohérence avec Offre CSE / B2B (barème spécifique)."),
    Bullet("Versement à l'entité ayant payé."),
    Bullet("Possibilité de transfert sur autre voyage CSE."),

    H2("6.3. Voyage avec mineur"),
    Bullet("Cohérence avec Charte mineurs voyageurs."),
    Bullet("Communication avec le représentant légal."),

    H1("7. Suivi comptable"),
    Bullet("Provision pour remboursements en cours (cohérence Plan comptable et processus mensuel)."),
    Bullet("Compte 4191 ou similaire pour avoirs voyageurs."),
    Bullet("Reporting mensuel des avoirs émis et utilisés."),
    Bullet("Cohérence Note expert-comptable."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Délai validation moyen", "≤ 7 j", "≤ 3 j"],
        ["Délai remboursement", "≤ 14 j", "≤ 7 j"],
        ["Taux d'annulation voyageurs", "Suivi", "Suivi"],
        ["Avoirs versés / an (€)", "Suivi", "Suivi"],
        ["Taux d'utilisation avoirs", "≥ 70 %", "≥ 85 %"],
        ["Plaintes liées aux remboursements", "≤ 5 %", "≤ 2 %"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Refus du remboursement abusif (geste empathique mais réaliste)."),
    Bullet("Refus de la pénalisation excessive du voyageur."),
    Bullet("Refus de l'avoir forcé contre droit du voyageur."),
    Bullet("Communication transparente des règles dès la réservation."),
    Bullet("Délais respectés en toutes circonstances."),
    Bullet("Refus du remboursement-piège (montant minimum, conditions abusives)."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : CGV, Procédure de réclamation détaillée, Programme de fidélisation Eventy Famille, Plan comptable et processus mensuel, Note expert-comptable, Onboarding voyageur, Offre CSE / B2B, Charte mineurs voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN ANIMATION COMMUNAUTÉ EVENTY FAMILLE
// ============================================================
function planAnimationCommunaute() {
  return [
    bandeauTitre(
      "PLAN D'ANIMATION COMMUNAUTÉ EVENTY FAMILLE",
      "Stratégie d'animation du groupe privé voyageurs Eventy Famille",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'animation de la communauté Eventy Famille (groupe Facebook privé réservé aux voyageurs ayant ≥ 1 voyage Eventy). Il complète le Programme de fidélisation Eventy Famille (qui pose la mécanique des paliers), la Stratégie réseaux sociaux et la Charte des contenus utilisateurs (UGC).", { italics: true }),

    P("La communauté Eventy Famille est plus qu'un groupe Facebook : c'est un espace de prolongement du voyage, où les voyageurs partagent leurs expériences, échangent entre eux, et restent connectés à Eventy. Notre approche : animer sans imposer, faire vivre sans coloniser, laisser émerger sans étouffer.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Objectifs"),
    Bullet("Maintenir le lien avec les voyageurs entre deux voyages."),
    Bullet("Faciliter les échanges entre voyageurs (entraide, retours)."),
    Bullet("Recueillir des retours qualitatifs."),
    Bullet("Animer la marque Eventy avec sincérité."),
    Bullet("Soutenir le programme de fidélisation."),

    H2("1.2. Audience cible"),
    Bullet("Voyageurs ayant effectué ≥ 1 voyage Eventy."),
    Bullet("Cible An 1 : ≥ 200 membres."),
    Bullet("Cible An 3 : ≥ 5 000 membres."),
    Bullet("Cible An 5 : ≥ 50 000 membres."),

    H2("1.3. Plateforme"),
    Bullet("An 1-2 : Facebook (groupe privé)."),
    Bullet("An 3+ : possibilité de migration vers solution propriétaire (cohérence Roadmap technique, refus dépendance acteurs non-européens)."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes"),
    Bullet("Bienveillance — refus de la modération punitive."),
    Bullet("Authenticité — refus du marketing camouflé."),
    Bullet("Service — l'animation sert les voyageurs, pas Eventy."),
    Bullet("Transparence — communication honnête, refus des coups marketing manipulatoires."),
    Bullet("Respect des contributions — chaque voyageur est valorisé."),

    H2("2.2. Refus structurés"),
    Bullet("Refus de la sur-promotion (max 20 % du contenu commercial)."),
    Bullet("Refus de la pression à publier."),
    Bullet("Refus du dénigrement des concurrents."),
    Bullet("Refus de la modération opaque (règles claires)."),
    Bullet("Refus du « faux fan » (pas d'achat de membres)."),

    H1("3. Architecture du groupe"),

    H2("3.1. Règlement intérieur"),
    Bullet("Règles claires affichées en première publication épinglée."),
    Bullet("Bienveillance obligatoire."),
    Bullet("Pas de spam ni de publicité externe."),
    Bullet("Respect du droit à l'image (cohérence Politique image)."),
    Bullet("Respect du RGPD (pas de données nominatives sans accord)."),
    Bullet("Refus des contenus politiques, religieux, polémiques."),

    H2("3.2. Modération"),
    Bullet("2 modérateurs Eventy (Président + 1 collaborateur)."),
    Bullet("Modération bienveillante mais ferme contre injures et discriminations (cohérence Charte UGC)."),
    Bullet("Refus systématique de la suppression d'avis défavorable légal."),
    Bullet("Communication motivée en cas de modération."),
    Bullet("Possibilité d'appel auprès du Président."),

    H2("3.3. Inscriptions"),
    Bullet("Vérification statut voyageur Eventy (≥ 1 voyage effectué)."),
    Bullet("Question d'entrée : « Quel a été ton voyage Eventy ? »."),
    Bullet("Validation manuelle par les modérateurs."),
    Bullet("Refus des candidats hors profil."),

    H1("4. Calendrier éditorial type"),

    H2("4.1. Hebdomadaire"),
    Bullet("Lundi — citation inspirante voyage (5 min de lecture)."),
    Bullet("Mercredi — anecdote / coulisses Eventy."),
    Bullet("Vendredi — question ouverte à la communauté (« quel est ton voyage rêve ? »)."),
    Bullet("Dimanche — récap de la semaine (publications voyageurs marquantes)."),

    H2("4.2. Mensuel"),
    Bullet("Témoignage voyageur (avec accord — cohérence Politique image)."),
    Bullet("Annonce nouveau voyage (en avant-première J-30 — cohérence Méthodologie de création de voyage)."),
    Bullet("Newsletter récapitulative envoyée également par email (cohérence Plan de communication interne)."),

    H2("4.3. Saisonnier"),
    Bullet("Inspiration printemps / été / automne / hiver."),
    Bullet("Mises en avant saisonnières du catalogue."),
    Bullet("Anniversaires de voyages spéciaux (1 an, 2 ans, 5 ans)."),

    H2("4.4. Annuel"),
    Bullet("Anniversaire Eventy (juin) — événement signature (cohérence Plan d'événements)."),
    Bullet("Vœux nouvelle année."),
    Bullet("Bilan annuel transparent (chiffres clés communauté)."),

    H1("5. Types de contenu"),

    H2("5.1. Contenus Eventy (≤ 20 % du total)"),
    Bullet("Annonces voyages (avant-première Famille)."),
    Bullet("Coulisses Eventy."),
    Bullet("Mises à jour catalogue."),
    Bullet("Sondages communauté."),

    H2("5.2. Contenus voyageurs (≥ 60 % du total)"),
    Bullet("Témoignages partagés spontanément."),
    Bullet("Photos / vidéos voyages (avec accords)."),
    Bullet("Questions et entraide (« quelqu'un a déjà fait Lisbonne ? »)."),
    Bullet("Recommandations (restaurants, sites locaux)."),

    H2("5.3. Contenus inspirationnels (≤ 20 %)"),
    Bullet("Citations voyage."),
    Bullet("Articles externes voyage durable."),
    Bullet("Inspiration culturelle."),

    H1("6. Animation par les voyageurs eux-mêmes"),
    Bullet("Identification de voyageurs Famille / Légende contributeurs naturels."),
    Bullet("Possibilité de devenir « ambassadeur communauté » (rôle bénévole)."),
    Bullet("Mise en avant des contributions remarquables."),
    Bullet("Refus de la rémunération directe pour contributions naturelles."),

    H1("7. Programme « Voix Eventy » An 2"),
    Bullet("Cohérence avec Charte UGC (programme dédié)."),
    Bullet("Encouragement bienveillant à la production de contenu."),
    Bullet("Mise à disposition de supports."),
    Bullet("Reconnaissance dans la newsletter."),

    H1("8. Mesures et adaptation"),
    Bullet("Sondage trimestriel anonyme membres (« qu'aimes-tu / aimes-tu moins ? »)."),
    Bullet("Adaptation du calendrier selon retours."),
    Bullet("Possibilité d'arrêter une rubrique non engageante."),
    Bullet("Cohérence avec Procédure d'amélioration continue."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Membres actifs / total", "≥ 60 %", "≥ 70 %"],
        ["Engagement moyen par publication", "≥ 5 %", "≥ 8 %"],
        ["Publications voyageurs / publications Eventy", "≥ 3 / 1", "≥ 5 / 1"],
        ["NPS satisfaction communauté", "≥ + 70", "≥ + 80"],
        ["Modération abusive plaintes", "0", "0"],
        ["Taux de croissance mensuel", "≥ 5 %", "≥ 10 %"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Bienveillance dans la modération."),
    Bullet("Transparence absolue (refus marketing camouflé)."),
    Bullet("Respect du RGPD et du droit à l'image."),
    Bullet("Refus du dénigrement des concurrents."),
    Bullet("Refus de la sur-promotion (≤ 20 % du contenu)."),
    Bullet("Engagement à migrer vers solution souveraine quand possible (cohérence Roadmap technique)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Programme de fidélisation Eventy Famille, Stratégie réseaux sociaux, Charte des contenus utilisateurs (UGC), Politique image et droit à l'image, Politique RGPD, Charte éditoriale, Plan d'événements, Plan de communication interne, Procédure d'amélioration continue.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — POLITIQUE COMMUNICATION POST-INCIDENT VOYAGEUR
// ============================================================
function politiqueCommunicationPostIncident() {
  return [
    bandeauTitre(
      "POLITIQUE DE COMMUNICATION POST-INCIDENT VOYAGEUR",
      "Suivi humain du voyageur après un incident de voyage",
    ),
    Spacer(160),

    P("La présente politique formalise le suivi du voyageur après un incident vécu pendant un voyage Eventy. Elle complète le Manuel d'incident voyage (qui couvre la gestion opérationnelle pendant l'incident), la Procédure de réclamation détaillée (qui couvre le traitement administratif des suites) et la Politique de gestion des avoirs et remboursements (volet financier).", { italics: true }),

    P("Eventy considère qu'un voyageur ayant vécu un incident a besoin d'attention humaine dans la durée — pas seulement d'un règlement administratif. Notre approche : suivi personnalisé, écoute, geste empathique adapté, refus de l'oubli post-règlement. Un voyageur bien suivi après un incident reste souvent voyageur Eventy.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Périmètre"),
    Bullet("Voyageurs ayant subi un incident pendant un voyage Eventy."),
    Bullet("Niveaux d'incident concernés : 2 (modéré), 3 (majeur), 4 (critique) — cohérence Manuel d'incident voyage."),
    Bullet("Niveau 1 (mineur) : suivi standard suffit."),
    Bullet("Famille / proches du voyageur en cas d'incident grave."),

    H2("1.2. Objectifs"),
    Bullet("Reconnaître l'incident vécu."),
    Bullet("Maintenir un lien humain dans la durée."),
    Bullet("Régler équitablement les suites administratives."),
    Bullet("Identifier et corriger la cause racine (cohérence Procédure d'amélioration continue)."),
    Bullet("Préserver la relation de confiance."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes"),
    Bullet("Empathie — l'incident vécu est réel pour le voyageur."),
    Bullet("Reconnaissance — refus du déni ou de la minimisation."),
    Bullet("Suivi — pas d'oubli post-règlement."),
    Bullet("Geste juste — au bon niveau, ni minimaliste ni excessif."),
    Bullet("Apprentissage — chaque incident améliore Eventy."),

    H2("2.2. Refus structurés"),
    Bullet("Refus de la communication standardisée (réponses-types)."),
    Bullet("Refus de la minimisation (« ce n'est pas si grave »)."),
    Bullet("Refus du déni de responsabilité (« ce n'est pas de notre faute »)."),
    Bullet("Refus du règlement uniquement administratif."),
    Bullet("Refus de l'oubli après le règlement."),
    Bullet("Refus de la condition (« si tu ne dis rien sur les réseaux »)."),

    H1("3. Phases du suivi"),

    H2("3.1. Phase 1 — Pendant l'incident"),
    Bullet("Cohérence avec Manuel d'incident voyage."),
    Bullet("Communication transparente à chaud."),
    Bullet("Activation Pack Sérénité si applicable."),
    Bullet("Communication aux proches du voyageur si nécessaire."),

    H2("3.2. Phase 2 — Retour de voyage (J0)"),
    Bullet("Appel téléphonique du Président ou du référent au retour."),
    Bullet("Reconnaissance de l'incident vécu."),
    Bullet("Demande de comment va le voyageur (santé, moral)."),
    Bullet("Information sur les suites prévues (réclamation, remboursement, geste)."),

    H2("3.3. Phase 3 — Réclamation formelle (J+1 à J+7)"),
    Bullet("Cohérence avec Procédure de réclamation détaillée."),
    Bullet("Accompagnement du voyageur dans la formalisation de sa réclamation."),
    Bullet("Délai de réponse confirmé."),
    Bullet("Pas de pression à minimiser."),

    H2("3.4. Phase 4 — Règlement (J+15 à J+30)"),
    Bullet("Cohérence avec Politique de gestion des avoirs et remboursements."),
    Bullet("Geste empathique adapté à la gravité (remboursement, avoir, indemnité)."),
    Bullet("Communication écrite du règlement (motivée)."),
    Bullet("Validation Président pour gestes > 200 €."),

    H2("3.5. Phase 5 — Suivi long terme (J+30 à J+90)"),
    Bullet("Appel à J+30 — comment va le voyageur depuis."),
    Bullet("Email à J+60 — vérification que le règlement a été reçu et accepté."),
    Bullet("Email à J+90 — invitation discrète à un futur voyage (avec attention particulière)."),

    H2("3.6. Phase 6 — Anniversaire (J+365)"),
    Bullet("Email mémoire à l'anniversaire de l'incident."),
    Bullet("Reconnaissance de la fidélité maintenue."),
    Bullet("Possibilité de geste anniversaire."),
    Bullet("Refus de la communication automatique froide."),

    H1("4. Modalités du geste empathique"),

    H2("4.1. Niveaux de geste selon incident"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Niveau incident", "Geste empathique typique", "Validation"],
      rows: [
        ["Niveau 2 — Modéré", "Avoir voyage 50-100 €", "Équipe support"],
        ["Niveau 3 — Majeur", "Avoir 100-300 € + voyage offert sur prochaine saison", "Président"],
        ["Niveau 4 — Critique (santé, accident)", "Sur-mesure (peut atteindre 1 000 € + voyage)", "Président + avocat"],
        ["Décès", "Sur-mesure famille (au-delà CGV)", "Président + associés"],
      ],
    }),

    H2("4.2. Refus structurés"),
    Bullet("Refus du geste minimaliste (« 20 € pour vous excuser »)."),
    Bullet("Refus du geste démesuré (qui crée des attentes irréalistes)."),
    Bullet("Refus du geste conditionnel (« si vous retirez votre avis »)."),
    Bullet("Refus du geste opaque (toujours motivé)."),

    H1("5. Communication interne"),

    H2("5.1. Information équipe"),
    Bullet("Tout incident niveau 2+ partagé en réunion équipe."),
    Bullet("Cohérence avec Plan de communication interne."),
    Bullet("Confidentialité de l'identité du voyageur (sauf si accord)."),

    H2("5.2. Apprentissage"),
    Bullet("Post-mortem systématique (cohérence Procédure d'amélioration continue)."),
    Bullet("Mise à jour des procédures concernées."),
    Bullet("Communication de l'apprentissage aux partenaires HRA / accompagnateurs si pertinent."),

    H2("5.3. Confidentialité"),
    Bullet("Identité du voyageur strictement confidentielle."),
    Bullet("Cohérence avec Politique RGPD et Politique image."),
    Bullet("Reporting anonymisé aux investisseurs et associés."),

    H1("6. Communication externe"),

    H2("6.1. Refus structurés"),
    Bullet("Refus de l'instrumentalisation de l'incident à des fins marketing."),
    Bullet("Refus de la communication publique sans accord du voyageur."),
    Bullet("Refus de la pression à supprimer un avis défavorable."),

    H2("6.2. Cas où la communication publique est possible"),
    Bullet("Avec accord exprès du voyageur (rare)."),
    Bullet("En cas de crise médiatique (cohérence Procédure de gestion de crise communication)."),
    Bullet("Statistiques anonymisées dans le rapport RSE annuel."),

    H1("7. Suivi statistique"),
    Bullet("Tableau interne des incidents niveau 2+ et leur traitement."),
    Bullet("Indicateurs de récurrence (cause racine)."),
    Bullet("Indicateurs de résolution (délai, geste, satisfaction)."),
    Bullet("Reporting mensuel équipe (cohérence Tableau de bord opérationnel)."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Délai appel post-incident niveau 2+", "≤ 7 j", "≤ 3 j"],
        ["Suivi long terme (phases 5-6) réalisé", "100 %", "100 %"],
        ["Voyageurs incidentés re-voyageant", "≥ 40 %", "≥ 60 %"],
        ["NPS post-incident", "≥ 0", "≥ + 30"],
        ["Plaintes de gestion d'incident", "≤ 5 %", "≤ 2 %"],
        ["Apprentissages documentés / incidents", "100 %", "100 %"],
      ],
    }),

    H1("9. Engagements éthiques opposables"),
    Bullet("Reconnaissance systématique de l'incident vécu."),
    Bullet("Suivi humain dans la durée (pas d'oubli post-règlement)."),
    Bullet("Refus de la minimisation et du déni."),
    Bullet("Geste juste et empathique."),
    Bullet("Confidentialité absolue."),
    Bullet("Refus du règlement conditionnel."),
    Bullet("Apprentissage systématique de chaque incident."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Manuel d'incident voyage, Procédure de réclamation détaillée, Politique de gestion des avoirs et remboursements, Politique cybersécurité (incidents cyber), Procédure de gestion de crise communication, Procédure d'amélioration continue, Politique RGPD, Politique image et droit à l'image, Tableau de bord opérationnel.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Avoirs-Remboursements.docx",
      title: "Eventy Life — Politique de gestion des avoirs et remboursements",
      description: "Règles concrètes de remboursement et avoirs voyageurs Eventy.",
      footer: "EVENTY LIFE SAS — Politique avoirs et remboursements",
      children: politiqueAvoirsRemboursements(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Animation-Communaute-Famille.docx",
      title: "Eventy Life — Plan d'animation communauté Eventy Famille",
      description: "Stratégie d'animation du groupe privé voyageurs Eventy Famille.",
      footer: "EVENTY LIFE SAS — Plan animation communauté Famille",
      children: planAnimationCommunaute(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Communication-Post-Incident.docx",
      title: "Eventy Life — Politique de communication post-incident voyageur",
      description: "Suivi humain du voyageur après un incident de voyage.",
      footer: "EVENTY LIFE SAS — Communication post-incident voyageur",
      children: politiqueCommunicationPostIncident(),
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
