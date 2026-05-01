/**
 * Eventy Life — Trois documents marketing / communication
 *
 *   1. Kit ambassadeur Eventy (supports, charte graphique, kit complet)
 *   2. Charte éditoriale Eventy (ton, style, vocabulaire)
 *   3. Stratégie réseaux sociaux Eventy (plateformes, contenus, calendrier)
 *
 * Usage : node scripts/garanties/build-marketing-kit-charte-reseaux.js
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
// DOCUMENT 1 — KIT AMBASSADEUR EVENTY
// ============================================================
function kitAmbassadeur() {
  return [
    bandeauTitre(
      "KIT AMBASSADEUR EVENTY LIFE",
      "Supports prêts à l'emploi pour ambassadeurs et influenceurs partenaires",
    ),
    Spacer(160),

    P("Ce kit ambassadeur est l'outillage opérationnel mis à disposition des ambassadeurs et influenceurs partenaires d'EVENTY LIFE SAS. Il complète et opérationnalise le Code de conduite ambassadeurs (engagements éthiques) en fournissant tous les supports prêts à l'emploi : charte graphique, photos, vidéos, slogans, modèles, code parrainage.", { italics: true }),

    P("L'esprit de ce kit : t'aider à parler d'Eventy avec authenticité et cohérence, sans contraindre ta créativité. Tu peux tout utiliser tel quel ou adapter à ta sauce — l'essentiel est de respecter la charte et l'esprit Eventy.", { italics: true }),

    H1("1. Identité visuelle"),

    H2("1.1. Logo Eventy Life"),
    Bullet("Logo principal (versions horizontale, verticale, mono)."),
    Bullet("Format vectoriel SVG, PNG transparent (72/300 dpi)."),
    Bullet("Variantes couleur (orange/bleu sur fond clair, blanc sur fond sombre, mono noir/blanc)."),
    Bullet("Zone de protection : équivalent à la hauteur du « E » Eventy autour du logo."),
    Bullet("Taille minimale d'utilisation : 30 px de hauteur."),

    H2("1.2. Palette de couleurs"),
    makeTable({
      widths: [2496, 1872, 2496, 2496],
      header: ["Couleur", "Code HEX", "Code RGB", "Usage"],
      rows: [
        ["Orange Eventy", "#E87722", "232 119 34", "Couleur principale, accents, CTA"],
        ["Bleu Eventy", "#1F4E79", "31 78 121", "Texte structurant, titres, sérieux"],
        ["Bleu clair", "#D5E8F0", "213 232 240", "Fonds doux, encadrés"],
        ["Crème", "#FFF8EE", "255 248 238", "Fond bandeaux, highlights"],
        ["Vert engagement", "#2C5F2D", "44 95 45", "RSE, environnement, écologie"],
        ["Gris doux", "#555555", "85 85 85", "Texte secondaire"],
        ["Noir Eventy", "#1A1A1A", "26 26 26", "Texte principal"],
      ],
    }),

    H2("1.3. Typographies"),
    Bullet("Titres : Calibri Bold ou Inter Bold (substitut web)."),
    Bullet("Corps de texte : Calibri Regular ou Inter Regular."),
    Bullet("Citations / accroches : Calibri Italic."),
    Bullet("Aucune typographie fantaisie, manuscrite ou décorative."),

    H1("2. Photothèque"),

    H2("2.1. Banque d'images Eventy"),
    Bullet("100+ photos voyageurs (avec accord — pas de visages identifiables sans consentement écrit)."),
    Bullet("50+ photos destinations (libres de droits, format paysage et portrait)."),
    Bullet("20+ photos lifestyle (autocar, hôtel, repas, accompagnement)."),
    Bullet("Photos haute définition (≥ 2 000 px largeur)."),
    Bullet("Téléchargement via eventylife.fr/ambassadeur (espace dédié connecté)."),

    H2("2.2. Règles d'usage des photos"),
    Bullet("Aucune retouche dénaturante (filtre déformant, blanchiment artificiel)."),
    Bullet("Aucune utilisation pour un autre opérateur de voyage (clause d'exclusivité)."),
    Bullet("Aucune utilisation à des fins politiques, religieuses, ou polémiques."),
    Bullet("Crédit photo « © Eventy Life » sur les supports imprimés."),
    Bullet("Possibilité d'ajout d'incrustations Eventy (logo, slogan)."),

    H2("2.3. Vidéos disponibles"),
    Bullet("3 vidéos institutionnelles (15 sec, 30 sec, 60 sec)."),
    Bullet("8 vidéos destinations (témoignages voyageurs, format vertical 9:16 pour stories)."),
    Bullet("5 vidéos motion design (animations explicatives)."),
    Bullet("Format MP4, résolutions 1080p et 4K."),
    Bullet("Durée moyenne adaptée aux plateformes (15-90 sec selon usage)."),

    H1("3. Slogans et accroches approuvées"),

    H2("3.1. Promesse Eventy (à utiliser tel quel)"),
    P("« Le voyage de groupe où tu n'as rien à gérer, tout à vivre. »", { bold: true }),

    H2("3.2. Mini-slogans déclinables"),
    Bullet("« Tout est inclus. Rien n'est laissé au hasard. »"),
    Bullet("« Le voyage tout compris, vraiment tout compris. »"),
    Bullet("« On part même si on n'est que 4. »"),
    Bullet("« Eventy, c'est l'amour du voyage qui rassemble. »"),
    Bullet("« Ne gère plus. Vis. »"),
    Bullet("« Découvrir avec d'autres, sans se compliquer la vie. »"),

    H2("3.3. Accroches longues"),
    Bullet("« Eventy organise des voyages de groupe avec accompagnateur, transport, hôtel, repas et activités tout inclus dans un seul prix transparent. »"),
    Bullet("« Garantie financière APST, immatriculation Atout France, Pack Sérénité 24/7 : tu pars rassuré, tu reviens enchanté. »"),
    Bullet("« On n'est pas le moins cher, on est le mieux pensé : chaque euro est tracé sur la fiche voyage. »"),

    H2("3.4. Phrases interdites (cohérence Code conduite ambassadeurs)"),
    Bullet("« Garanti à 100 % » → préférer « assuré pour [X] »."),
    Bullet("« Vous ne paierez rien sur place » → préférer « tout est inclus, sauf pourboires et achats personnels »."),
    Bullet("« On est moins cher que tout le monde » → préférer « le plus juste »."),
    Bullet("Tout propos discriminant, stéréotypé, ou irrespectueux d'une destination ou d'un public."),

    H1("4. Modèles de publications préformatées"),

    H2("4.1. Post Instagram / Facebook (carrousel)"),
    Bullet("Slide 1 : photo destination + slogan principal."),
    Bullet("Slide 2 : « Ce qui est inclus » avec 6 picto (transport, hôtel, repas, activités, accompagnateur, Pack Sérénité)."),
    Bullet("Slide 3 : prix décomposé (transparence radicale)."),
    Bullet("Slide 4 : témoignage voyageur (citation + prénom + voyage)."),
    Bullet("Slide 5 : CTA (« Réserve avec mon code [TON-CODE] sur eventylife.fr »)."),

    H2("4.2. Story Instagram / TikTok"),
    Bullet("Format vertical 9:16."),
    Bullet("Vidéo 15-30 sec (max)."),
    Bullet("Sous-titres systématiques (accessibilité + sons coupés)."),
    Bullet("Lien swipe-up vers la fiche voyage avec code parrain auto-appliqué."),

    H2("4.3. Reel / TikTok"),
    Bullet("Format vertical 9:16, 15-90 sec."),
    Bullet("Hook fort dans les 3 premières secondes."),
    Bullet("Audio tendance possible (mais respect code de conduite Eventy — pas d'audio politique/clivant)."),
    Bullet("Mention obligatoire « partenariat rémunéré » ou « collaboration commerciale » si applicable."),

    H2("4.4. Newsletter / blog"),
    Bullet("Modèle d'article 800 mots minimum."),
    Bullet("Photo en-tête + 3 photos illustratives."),
    Bullet("Lien CTA en milieu et fin d'article."),
    Bullet("Mention transparence partenariat dans l'introduction."),

    H1("5. Code parrainage et lien personnalisé"),

    H2("5.1. Code parrainage"),
    Bullet("Code unique nominatif généré automatiquement (eventylife.fr/mon-compte)."),
    Bullet("Format : EVENTY-[NOM]-[ANNÉE] (ex : EVENTY-MARIE-2026)."),
    Bullet("Le filleul saisit le code à la réservation."),
    Bullet("Avantage filleul : 10 % de remise sur le 1er voyage."),
    Bullet("Avantage parrain : 50 € (60 € si Voyageur Famille, 75 € si Voyageur Légende)."),

    H2("5.2. Lien tracé"),
    Bullet("Lien personnel : eventylife.fr/?ref=[TON-CODE]."),
    Bullet("Tracking automatique des clics et conversions."),
    Bullet("Reporting mensuel disponible sur le portail ambassadeur."),

    H1("6. Charte éditoriale rapide (résumé)"),
    Bullet("Tutoiement systématique (rare dans le tourisme — c'est un parti pris Eventy)."),
    Bullet("Ton chaleureux, direct, honnête — comme un ami qui te conseille."),
    Bullet("Phrases courtes, pas de jargon technique."),
    Bullet("Pas de superlatifs vides (« incroyable », « extraordinaire », « unique »)."),
    Bullet("Toujours mentionner les garanties (APST, Pack Sérénité) dans les communications commerciales."),
    Bullet("Voir la Charte éditoriale Eventy pour le détail complet."),

    H1("7. Reporting et engagement"),

    H2("7.1. Indicateurs ambassadeur"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible 1er trimestre", "Cible An 1"],
      rows: [
        ["Publications avec mention Eventy", "≥ 3", "≥ 12"],
        ["Réservations via code parrain", "≥ 1", "≥ 5"],
        ["Taux engagement contenus Eventy", "≥ 4 %", "≥ 6 %"],
        ["NPS filleuls envoyés", "≥ + 60", "≥ + 70"],
      ],
    }),

    H2("7.2. Reporting mensuel"),
    Bullet("Disponible sur le portail ambassadeur."),
    Bullet("Inclut : clics, conversions, commissions, performance posts."),
    Bullet("Échange trimestriel avec le community manager Eventy (visio 30 min)."),

    H1("8. Demande de validation préalable"),
    P("Pour les communications à fort enjeu (article presse, intervention conférence, vidéo > 5 min, post mentionnant des chiffres financiers), une validation préalable Eventy est nécessaire."),
    Bullet("Email à : ambassadeur@eventylife.fr."),
    Bullet("Délai de réponse : 48 h ouvrées."),
    Bullet("Validation tacite si pas de retour sous 5 jours ouvrés."),

    H1("9. Évolution du kit"),
    Bullet("Mise à jour trimestrielle des supports (photos, vidéos, slogans)."),
    Bullet("Webinaire ambassadeurs trimestriel (1 h, présentation des nouveautés)."),
    Bullet("Possibilité de proposer des supports manquants (formulaire dédié)."),

    H1("10. Contact"),
    Bullet("Email dédié : ambassadeur@eventylife.fr."),
    Bullet("Téléphone direct : [À compléter]."),
    Bullet("Portail ambassadeur : eventylife.fr/ambassadeur."),
    Bullet("Espace de partage Drive/Notion pour les ressources non-publiques."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour trimestrielle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Code de conduite ambassadeurs, Charte éditoriale, Stratégie réseaux sociaux, Politique RGPD, Politique avis voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — CHARTE ÉDITORIALE EVENTY
// ============================================================
function charteEditoriale() {
  return [
    bandeauTitre(
      "CHARTE ÉDITORIALE EVENTY LIFE",
      "Ton, style et vocabulaire de la communication Eventy",
    ),
    Spacer(160),

    P("La présente charte éditoriale formalise le style de communication d'EVENTY LIFE SAS — sur le site, dans les emails, sur les réseaux sociaux, dans la presse et tous les supports écrits. Elle vise à garantir une cohérence de ton, une signature reconnaissable, et un alignement avec l'âme d'Eventy.", { italics: true }),

    P("Un ton chaleureux, direct, honnête. Comme un ami. Pas comme une marque qui veut absolument vendre. Cette posture éditoriale n'est pas un effet de style — c'est une expression cohérente de l'âme d'Eventy : la promesse, la transparence, le respect.", { italics: true }),

    H1("1. Les 5 piliers du ton Eventy"),

    H2("1.1. Chaleureux"),
    Bullet("Tutoiement systématique (« tu », pas « vous »)."),
    Bullet("Vocabulaire de proximité (« on », « avec toi », « ensemble »)."),
    Bullet("Phrases courtes, rythmées."),
    Bullet("Émotions et sensations bienvenues (« la joie », « le plaisir », « la simplicité »)."),

    H2("1.2. Direct"),
    Bullet("Aller à l'essentiel sans détour ni langue de bois."),
    Bullet("Phrases simples, sujet-verbe-complément."),
    Bullet("Refuser les jargons (« inbound marketing », « stack », « process »)."),
    Bullet("Préférer les verbes d'action aux substantifs."),

    H2("1.3. Honnête"),
    Bullet("Dire les choses comme elles sont, sans embellir."),
    Bullet("Reconnaître les limites (toutes les destinations ne conviennent pas à tout le monde)."),
    Bullet("Refuser les superlatifs vides (« unique », « incroyable », « ultime »)."),
    Bullet("Mentionner les contraintes en même temps que les avantages."),

    H2("1.4. Bienveillant"),
    Bullet("Refus des termes condescendants ou méprisants."),
    Bullet("Refus des comparaisons dénigrantes (autres opérateurs, autres styles de voyage)."),
    Bullet("Inclusivité (langage épicène quand possible, refus des stéréotypes)."),
    Bullet("Empathie face aux inquiétudes ou aux objections."),

    H2("1.5. Respectueux des intelligences"),
    Bullet("Le voyageur est intelligent — pas la peine de simplifier à outrance."),
    Bullet("Argumentaires factuels et chiffrés (chiffres, sources, références)."),
    Bullet("Refus du marketing manipulateur (urgence factice, scarcité simulée)."),
    Bullet("Renvois vers les documents publics pour celles et ceux qui veulent vérifier."),

    H1("2. Mots et expressions à privilégier"),
    makeTable({
      widths: [4680, 4680],
      header: ["Préférer", "Plutôt que"],
      rows: [
        ["Voyage", "Séjour, escapade, échappée, virée"],
        ["Tu", "Vous (sauf B2B et certaines situations protocolaires)"],
        ["On part", "Nous partons, le départ s'effectue"],
        ["Tout est inclus", "All inclusive, formule complète"],
        ["Accompagnateur", "Guide, encadrant"],
        ["HRA partenaire", "Prestataire, fournisseur"],
        ["Vendeur Eventy", "Commercial, agent"],
        ["Voyageur", "Client, consommateur, voyageant"],
        ["Eventy Famille", "Adhérent, membre, abonné"],
        ["On s'occupe de tout", "Nous prenons en charge intégralement"],
        ["Garantie financière APST", "Protection des fonds"],
        ["Pack Sérénité", "Assurance multirisque"],
        ["Le voyage de groupe où tu n'as rien à gérer", "Le tour-opérateur leader"],
      ],
    }),

    H1("3. Mots et expressions à éviter"),

    H2("3.1. Superlatifs vides"),
    Bullet("« Incroyable », « extraordinaire », « unique », « inoubliable »."),
    Bullet("« Le meilleur », « le plus beau », « numéro 1 »."),
    Bullet("« Magique », « féérique », « hors du commun »."),
    Bullet("Préférer : descriptifs concrets et factuels."),

    H2("3.2. Marketing manipulateur"),
    Bullet("« Plus que 3 places ! » (sauf si vrai et vérifiable)."),
    Bullet("« Offre flash 24 h ! » (sauf si vraiment limité dans le temps)."),
    Bullet("« Vous ne pourrez pas refuser » (manipulation)."),
    Bullet("« Cliquez ici maintenant ou vous regretterez »."),

    H2("3.3. Jargon corporate"),
    Bullet("« Solution clé en main » → « tout est inclus »."),
    Bullet("« Expérience client » → « ton voyage »."),
    Bullet("« Optimisation du parcours » → « on rend les choses simples »."),
    Bullet("« Roadmap », « pipeline », « scaling », « disrupt »."),

    H2("3.4. Anglicismes inutiles"),
    Bullet("« Best of » → « les incontournables »."),
    Bullet("« Top » → « les meilleurs choix »."),
    Bullet("« All inclusive » → « tout est inclus »."),
    Bullet("« Booking » → « réservation »."),
    Bullet("« Booster » → « accélérer », « renforcer »."),
    Bullet("Acceptés : termes techniques sans équivalent (« podcast », « webinaire »)."),

    H2("3.5. Discriminant ou stéréotypé"),
    Bullet("Pas de stéréotypes par âge (« les seniors ont du mal avec »)."),
    Bullet("Pas de stéréotypes culturels."),
    Bullet("Pas d'humour aux dépens d'un groupe (origine, religion, orientation, handicap)."),
    Bullet("Pas de présupposés (« en couple », « en famille classique »)."),

    H1("4. Règles typographiques et orthographiques"),

    H2("4.1. Règles générales"),
    Bullet("Espace insécable avant : ; ! ? « » et %."),
    Bullet("Guillemets français « » et non \" \"."),
    Bullet("Tirets cadratins (—) pour les incises (avec espaces autour)."),
    Bullet("Pas de majuscules abusives (« voyage » et non « Voyage »)."),

    H2("4.2. Nombres et chiffres"),
    Bullet("Nombres en chiffres ≥ 10 (« 38 voyageurs ») ; en lettres < 10 (« quatre voyageurs »)."),
    Bullet("Espace insécable comme séparateur de milliers : « 30 400 € »."),
    Bullet("Virgule décimale française : « 1,5 M€ » (pas « 1.5 M€ »)."),
    Bullet("Pourcentages : espace avant le % (« 5 % »)."),

    H2("4.3. Devises et dates"),
    Bullet("Devises : « 800 € » (espace), pas « 800€ »."),
    Bullet("Dates : « 2 mai 2026 » (pas de zéro initial)."),
    Bullet("Heures : « 9h30 » (sans espace) ou « 9 h 30 » (académique selon contexte)."),

    H2("4.4. Capitalisations Eventy"),
    Bullet("« Eventy Life » (pas « EventyLife », pas « eventy life »)."),
    Bullet("« Eventy » seul accepté en usage courant."),
    Bullet("« Pack Sérénité » (les deux mots avec majuscule)."),
    Bullet("« Voyageur Fidèle / Famille / Légende » (avec majuscule, statut formel)."),
    Bullet("« HRA » en majuscules (Hôtel-Restaurant-Activité)."),
    Bullet("« APST » et « Atout France » en majuscules."),

    H1("5. Adaptations selon le canal"),

    H2("5.1. Site web"),
    Bullet("Phrases courtes, paragraphes ≤ 4 lignes."),
    Bullet("Titres et sous-titres optimisés SEO sans sacrifier la qualité éditoriale."),
    Bullet("CTA clairs (« Voir le voyage », « Réserver », « En savoir plus »)."),

    H2("5.2. Email transactionnel"),
    Bullet("Sujet clair (« Ta réservation est confirmée », pas « Confirmation #45667 »)."),
    Bullet("Salutation chaleureuse (« Salut [Prénom] » ou « Bonjour [Prénom] »)."),
    Bullet("Signature avec prénom (humain), pas « Le service client »."),

    H2("5.3. Email marketing / newsletter"),
    Bullet("Sujet sincère (pas de clickbait)."),
    Bullet("Toujours une vraie information, pas que de la promo."),
    Bullet("Désinscription simple en un clic (pas de friction)."),

    H2("5.4. Réseaux sociaux"),
    Bullet("Voir Stratégie réseaux sociaux pour le détail."),
    Bullet("Conserver le ton chaleureux en gardant la concision."),
    Bullet("Modération bienveillante, pas de censure des avis négatifs (sauf injures/discriminations)."),

    H2("5.5. Réponses aux avis"),
    Bullet("Toujours répondre, positif comme négatif (cohérence Politique avis voyageurs)."),
    Bullet("Reconnaître les éventuels manquements."),
    Bullet("Proposer un contact direct pour résolution si nécessaire."),
    Bullet("Pas de défensive corporate, pas de « nous regrettons que vous ayez ressenti »."),

    H2("5.6. Communiqué de presse"),
    Bullet("Plus formel, mais pas glacial."),
    Bullet("Vouvoiement journalistes possible mais le tutoiement Eventy reste sur le site."),
    Bullet("Citations du Président possibles (signées et avec sa voix authentique)."),

    H1("6. Validation et gouvernance"),
    Bullet("Tout collaborateur produit du contenu en respectant la présente charte."),
    Bullet("Doute ou cas particulier : email à edito@eventylife.fr."),
    Bullet("Validation Président pour les contenus à fort enjeu (CP, intervention conférence, etc.)."),
    Bullet("Revue annuelle de la charte (concertation équipe + ambassadeurs Famille)."),

    H1("7. Le test final — la « phrase devant le miroir »"),
    P("Avant de publier un texte Eventy, se poser 5 questions :"),
    Numbered("Est-ce que je dirais cette phrase à un ami autour d'un café ?"),
    Numbered("Est-ce que c'est honnête (pas d'embellissement, pas d'omission)?"),
    Numbered("Est-ce que j'ai utilisé un mot inutile ou un superlatif vide ?"),
    Numbered("Est-ce que ça respecte tout le monde (pas de discriminant) ?"),
    Numbered("Est-ce que ça reflète l'âme d'Eventy (chaleur, simplicité, transparence) ?"),
    P("Si la réponse à toutes ces questions est oui — c'est bon. Sinon, on retouche.", { italics: true }),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Kit ambassadeur, Stratégie réseaux sociaux, Politique avis voyageurs, Code conduite ambassadeurs, Politique RSE, AME-EVENTY.md (manifeste fondateur).", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — STRATÉGIE RÉSEAUX SOCIAUX
// ============================================================
function strategieReseauxSociaux() {
  return [
    bandeauTitre(
      "STRATÉGIE RÉSEAUX SOCIAUX EVENTY LIFE",
      "Plateformes, contenus, calendrier et engagement Eventy",
    ),
    Spacer(160),

    P("Le présent document formalise la stratégie de présence d'EVENTY LIFE SAS sur les réseaux sociaux. Il définit les plateformes prioritaires, les contenus à produire, le calendrier éditorial type, les indicateurs de performance et les règles de modération.", { italics: true }),

    P("Pour Eventy, les réseaux sociaux ne sont pas un canal de pub : ce sont un espace de relation. La présence Eventy y est sincère, utile, chaleureuse — pas une vitrine cosmétique. Les voyageurs se reconnaissent dans nos contenus parce qu'ils y voient leur propre voyage, pas une mise en scène marketing.", { italics: true }),

    H1("1. Plateformes prioritaires"),

    H2("1.1. Instagram (priorité 1)"),
    Bullet("Audience cible : 25-55 ans, intéressés par le voyage."),
    Bullet("Format roi : photos de qualité + carrousels + reels."),
    Bullet("Fréquence : 3 posts/semaine + 5-7 stories/jour + 2 reels/semaine."),
    Bullet("Bio claire : promesse, lien, contact."),
    Bullet("Highlights structurés : Voyages · Témoignages · Coulisses · Garanties."),

    H2("1.2. Facebook (priorité 2)"),
    Bullet("Audience cible : 35-65 ans, voyageurs réguliers, CSE."),
    Bullet("Format : posts longs avec photos, vidéos, événements."),
    Bullet("Fréquence : 2 posts/semaine + groupes communautaires."),
    Bullet("Groupe privé Eventy Famille (réservé voyageurs ≥ 1 voyage)."),

    H2("1.3. TikTok (priorité 3)"),
    Bullet("Audience cible : 18-35 ans, voyageurs spontanés."),
    Bullet("Format : reels verticaux, 15-90 sec, audio tendance."),
    Bullet("Fréquence : 2-3 reels/semaine."),
    Bullet("Ton : plus décontracté, anecdotique, behind-the-scenes."),

    H2("1.4. LinkedIn (priorité 4 — B2B et investisseurs)"),
    Bullet("Audience cible : décideurs CSE, RH, investisseurs, partenaires."),
    Bullet("Format : posts pro, articles longs, témoignages B2B."),
    Bullet("Fréquence : 2 posts/semaine."),
    Bullet("Page Eventy + posts personnels du Président David Eventy."),

    H2("1.5. YouTube (priorité 5 — long terme)"),
    Bullet("Vidéos longues : 5-15 min."),
    Bullet("Format : voyages tournés, interviews voyageurs, coulisses."),
    Bullet("Fréquence : 1-2 vidéos/mois (cible An 2)."),
    Bullet("Hub central des contenus Eventy."),

    H2("1.6. Plateformes secondaires (suivies, sans investissement)"),
    Bullet("Pinterest : épingles inspiration voyage (si bandwidth disponible An 2-3)."),
    Bullet("X / Twitter : présence symbolique, veille sectorielle."),
    Bullet("Threads / Mastodon : à étudier."),

    H1("2. Piliers de contenu"),

    H2("2.1. Pilier 1 — Inspiration voyage (40 % des contenus)"),
    Bullet("Photos destinations Eventy."),
    Bullet("Programmes de voyages catalogue."),
    Bullet("Idées d'évasion (« Si tu veux du vert, regarde ces 3 voyages... »)."),
    Bullet("Saison-thématique (« 5 voyages parfaits pour les ponts de mai »)."),

    H2("2.2. Pilier 2 — Témoignages voyageurs (25 %)"),
    Bullet("Photos réelles de voyageurs (avec accord écrit)."),
    Bullet("Citations / verbatim."),
    Bullet("Vidéos témoignages courtes."),
    Bullet("Avant/après : « Avant Eventy, j'avais peur de partir seul·e. Aujourd'hui... »"),

    H2("2.3. Pilier 3 — Coulisses Eventy (15 %)"),
    Bullet("Préparation d'un voyage (visite HRA partenaire, sourcing)."),
    Bullet("Équipe Eventy au travail."),
    Bullet("Création d'un programme."),
    Bullet("Vie de bureau (sans intrusion personnelle)."),

    H2("2.4. Pilier 4 — Pédagogique (10 %)"),
    Bullet("« Comment fonctionne la garantie financière APST ? »."),
    Bullet("« Pourquoi le voyage en bus n'est pas dépassé ? »."),
    Bullet("« Tout savoir sur le Pack Sérénité »."),
    Bullet("Réponse à des questions fréquentes."),

    H2("2.5. Pilier 5 — Engagement et valeurs (10 %)"),
    Bullet("Manifeste Eventy (extraits âme d'Eventy)."),
    Bullet("Engagement carbone, RSE, accessibilité."),
    Bullet("Histoires d'indépendants partenaires."),
    Bullet("Soutien à des causes alignées (économie circulaire, tourisme social)."),

    H1("3. Calendrier éditorial type (semaine)"),
    makeTable({
      widths: [1872, 3744, 3744],
      header: ["Jour", "Instagram + Facebook", "TikTok / Reels"],
      rows: [
        ["Lundi", "Post inspiration : photo destination + carrousel", "—"],
        ["Mardi", "Story coulisses ou prépa voyage", "Reel coulisses (15-30 sec)"],
        ["Mercredi", "Post pédagogique ou pilier engagement", "—"],
        ["Jeudi", "Story témoignage voyageur", "—"],
        ["Vendredi", "Post témoignage voyageur (carrousel) + reel", "Reel témoignage (30-60 sec)"],
        ["Samedi", "Story inspiration weekend / lecture", "—"],
        ["Dimanche", "Story douce / récap semaine", "—"],
      ],
    }),

    H1("4. Règles de production"),

    H2("4.1. Photos"),
    Bullet("Privilégier la lumière naturelle."),
    Bullet("Éviter les filtres déformants."),
    Bullet("Cadrage soigné, pas de visages identifiables sans accord."),
    Bullet("Format carré 1:1 ou portrait 4:5 pour Instagram."),
    Bullet("Format vertical 9:16 pour stories/reels/TikTok."),

    H2("4.2. Vidéos"),
    Bullet("Sous-titres systématiques (accessibilité + sons coupés)."),
    Bullet("Premier plan accrocheur (3 premières secondes décisives)."),
    Bullet("Audio tendance OK, mais respect du code de conduite (pas politique/clivant)."),
    Bullet("Durée optimale : 15-30 sec stories, 30-60 sec reels, 5-15 min YouTube."),

    H2("4.3. Texte"),
    Bullet("Cohérence avec la Charte éditoriale (tutoiement, ton chaleureux, honnête)."),
    Bullet("Légende Instagram : 100-200 mots, pas plus."),
    Bullet("Hashtags : 5 à 10 ciblés (pas de spam)."),
    Bullet("CTA clair (« Réserve sur eventylife.fr », « Code dans bio »)."),

    H1("5. Modération et engagement"),

    H2("5.1. Réponse aux commentaires et messages"),
    Bullet("Réponse à tous les commentaires sous 24 h ouvrées."),
    Bullet("Réponse personnalisée (pas de copier-coller, ton chaleureux)."),
    Bullet("Question complexe → orientation vers contact@eventylife.fr."),
    Bullet("Avis négatif public → réponse publique calme + invitation à échanger en privé."),

    H2("5.2. Suppression et bannissement"),
    Bullet("Aucune suppression d'avis défavorable (sauf injures, discriminations, propos haineux)."),
    Bullet("Suppression motivée des spams, contenus hors-sujet, promotion concurrent."),
    Bullet("Bannissement réservé aux comportements gravement contraires (harcèlement)."),
    Bullet("Politique transparente affichée sur les pages."),

    H2("5.3. Crise sur les réseaux sociaux"),
    Bullet("Activation de la Procédure de gestion de crise communication."),
    Bullet("Cellule de crise + porte-parole identifié."),
    Bullet("Communication coordonnée selon niveau de gravité."),

    H1("6. Publicité payante"),

    H2("6.1. Principes"),
    Bullet("Maximum 30 % du budget marketing global (cohérence avec Plan marketing An 1)."),
    Bullet("Ciblage respectueux (pas de profilage abusif)."),
    Bullet("Refus du retargeting agressif."),
    Bullet("Mention claire « publicité » sur tous les contenus sponsorisés."),

    H2("6.2. Plateformes payantes prioritaires"),
    Bullet("Meta Ads (Instagram + Facebook) : 60 % du budget pub."),
    Bullet("TikTok Ads : 20 %."),
    Bullet("Google Ads (search) : 15 %."),
    Bullet("LinkedIn Ads (B2B) : 5 %."),

    H1("7. Indicateurs réseaux sociaux"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Abonnés Instagram", "≥ 5 000", "≥ 50 000"],
        ["Abonnés Facebook", "≥ 3 000", "≥ 30 000"],
        ["Abonnés TikTok", "≥ 2 000", "≥ 30 000"],
        ["Abonnés LinkedIn", "≥ 1 500", "≥ 15 000"],
        ["Taux d'engagement Instagram", "≥ 5 %", "≥ 7 %"],
        ["Conversions via réseaux", "≥ 10 %", "≥ 25 %"],
        ["Coût d'acquisition réseaux (€)", "≤ 80 €", "≤ 50 €"],
      ],
    }),

    H1("8. Outils et stack"),
    Bullet("Planification : Buffer, Later ou Metricool."),
    Bullet("Création visuelle : Canva, Photoshop, Premiere Pro."),
    Bullet("Reporting : Meta Business Suite, TikTok Analytics, LinkedIn Analytics."),
    Bullet("Veille : Google Alerts, mention.com (cible An 2)."),
    Bullet("Modération : interface native de chaque plateforme + alertes mention."),

    H1("9. Gouvernance"),
    Bullet("Référent réseaux sociaux : Président en An 1, recrutement community manager dédié en An 2."),
    Bullet("Comité éditorial mensuel (revue performance, planification mois suivant)."),
    Bullet("Reporting trimestriel équipe + investisseurs."),
    Bullet("Mise à jour annuelle de la stratégie."),

    H1("10. Engagements éthiques"),
    Bullet("Pas de faux comptes, pas d'achat d'abonnés, pas de manipulation d'engagement."),
    Bullet("Transparence sur les partenariats (mention claire)."),
    Bullet("Refus du dark pattern marketing."),
    Bullet("Respect strict du RGPD pour les ciblages publicitaires."),
    Bullet("Refus des plateformes ouvertement contraires aux valeurs Eventy (cas particuliers à étudier)."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Kit ambassadeur, Charte éditoriale, Plan marketing An 1, Politique avis voyageurs, Procédure gestion de crise communication, Politique RGPD, Code conduite ambassadeurs.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Kit-Ambassadeur.docx",
      title: "Eventy Life — Kit ambassadeur",
      description: "Kit ambassadeur Eventy : supports, charte, modèles, code parrainage.",
      footer: "EVENTY LIFE SAS — Kit ambassadeur",
      children: kitAmbassadeur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Charte-Editoriale.docx",
      title: "Eventy Life — Charte éditoriale",
      description: "Charte éditoriale Eventy Life : ton, style, vocabulaire.",
      footer: "EVENTY LIFE SAS — Charte éditoriale",
      children: charteEditoriale(),
    },
    {
      file: "docs/garanties/Eventy-Life-Strategie-Reseaux-Sociaux.docx",
      title: "Eventy Life — Stratégie réseaux sociaux",
      description: "Stratégie réseaux sociaux Eventy : plateformes, contenus, calendrier.",
      footer: "EVENTY LIFE SAS — Stratégie réseaux sociaux",
      children: strategieReseauxSociaux(),
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
