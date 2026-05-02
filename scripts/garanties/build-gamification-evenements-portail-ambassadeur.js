/**
 * Eventy Life — Trois documents engagement / communauté
 *
 *   1. Programme de gamification voyageur
 *   2. Plan de gestion d'événements Eventy
 *   3. Guide utilisation portail ambassadeur
 *
 * Usage : node scripts/garanties/build-gamification-evenements-portail-ambassadeur.js
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
// DOCUMENT 1 — PROGRAMME GAMIFICATION VOYAGEUR
// ============================================================
function programmeGamification() {
  return [
    bandeauTitre(
      "PROGRAMME DE GAMIFICATION VOYAGEUR EVENTY",
      "Mécaniques ludiques au service de l'expérience voyageur",
    ),
    Spacer(160),

    P("Le présent document formalise le programme de gamification d'EVENTY LIFE SAS au service de l'expérience voyageur. Il complète et opérationnalise le Programme de fidélisation Eventy Famille (3 paliers à vie) en y ajoutant des mécaniques ludiques et progressives plus fines.", { italics: true }),

    P("Eventy refuse la gamification manipulatrice ou addictive. Notre approche : des mécaniques bienveillantes qui rendent l'expérience plus agréable et fidélisent par le plaisir, jamais par la pression. Les badges, défis et missions sont optionnels — un voyageur qui ne joue pas ne perd rien.", { italics: true }),

    H1("1. Principes directeurs"),

    H2("1.1. Cinq principes éthiques"),
    Bullet("Bienveillance — la gamification est plaisir, jamais pression."),
    Bullet("Optionnel — refuser de jouer n'a aucune conséquence négative."),
    Bullet("Sans dark patterns — pas d'urgence factice, pas de FOMO entretenu."),
    Bullet("Récompenses sincères — un badge a une vraie valeur d'usage ou symbolique."),
    Bullet("Cohérence avec l'âme d'Eventy — chaleur, transparence, respect."),

    H2("1.2. Refus structurés"),
    Bullet("Pas de monnaie virtuelle qui ressemble à de l'argent."),
    Bullet("Pas de roulettes, tirages au sort, jackpots."),
    Bullet("Pas de pression sur les amis (tagging forcé, partage forcé)."),
    Bullet("Pas de mécaniques d'addiction (notifications anxiogènes, push permanent)."),
    Bullet("Pas de classements publics individuels (uniquement des classements anonymisés)."),

    H1("2. Architecture du programme"),

    H2("2.1. Trois couches"),
    Numbered("**Programme de fidélisation Eventy Famille** (3 paliers à vie : Fidèle ≥ 2 voyages, Famille ≥ 5, Légende ≥ 10) — couche structurelle, cohérence avec document dédié."),
    Numbered("**Badges et trophées** — couche ludique, optionnelle."),
    Numbered("**Défis et missions** — couche communautaire, événementielle."),

    H2("2.2. Tableau de bord voyageur"),
    Bullet("Visible dans l'espace voyageur eventylife.fr/mon-compte."),
    Bullet("Statut Eventy Famille (Fidèle/Famille/Légende)."),
    Bullet("Badges débloqués."),
    Bullet("Défis en cours (optionnels)."),
    Bullet("Carte des destinations visitées."),
    Bullet("Statistiques personnelles (km parcourus, voyages cumulés, etc.)."),

    H1("3. Système de badges"),

    H2("3.1. Catégories de badges"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Catégorie", "Exemples", "Récompense associée"],
      rows: [
        ["Découverte", "Premier voyage, 1ère destination étrangère, 1ère destination > 4j", "Badge symbolique + email félicitations"],
        ["Fidélité", "2e, 5e, 10e voyage", "Cohérence Eventy Famille (5 % / 10 % / 15 %)"],
        ["Engagement", "1er parrainage actif, 5 parrainages, 10 parrainages", "Cohérence avoirs parrain (50/60/75 €)"],
        ["Communautaire", "1er avis posté, témoignage publié, photo avec accord", "Badge + reconnaissance"],
        ["Découvreur", "Visiter 5 régions, 10 régions, 5 pays, 10 pays", "Badge + carte spéciale"],
        ["Engagement RSE", "Voyage 100 % bas-carbone, voyage avec compensation, parrainage carbone", "Badge engagement"],
      ],
    }),

    H2("3.2. Règles de débloquage"),
    Bullet("Automatique au moment où la condition est remplie (pas de pression à débloquer)."),
    Bullet("Notification optionnelle (paramétrable par le voyageur)."),
    Bullet("Aucune badge ne se perd."),
    Bullet("Affichage public uniquement avec accord (option dans le profil)."),

    H1("4. Défis et missions (optionnels)"),

    H2("4.1. Format"),
    Bullet("Mission ponctuelle ou saisonnière (1-3 mois)."),
    Bullet("Description claire : objectif, durée, récompense éventuelle."),
    Bullet("Inscription volontaire (opt-in explicit)."),
    Bullet("Désinscription possible à tout moment."),

    H2("4.2. Exemples de défis"),
    Bullet("Défi « Premier vol à plumes » — réussir à voyager 4 jours en autocar (saisonnier)."),
    Bullet("Défi « Pacte parrain » — parrainer un proche dans le mois (durée 30 jours)."),
    Bullet("Défi « Bouquet de saison » — voyager dans une région française au printemps."),
    Bullet("Défi « Photo du voyage » — partager une photo coup de cœur avec accord."),

    H2("4.3. Récompenses"),
    Bullet("Badge associé."),
    Bullet("Avoir voyage si défi structurant (10-30 €)."),
    Bullet("Reconnaissance dans la newsletter (avec accord)."),
    Bullet("Aucune récompense en argent direct."),

    H1("5. Carte interactive du voyageur"),
    Bullet("Carte mondiale visible dans l'espace voyageur."),
    Bullet("Régions et pays visités progressivement débloqués."),
    Bullet("Suggestions de prochains voyages connexes."),
    Bullet("Souvenirs photo associés à chaque destination."),
    Bullet("Possibilité de partager (avec accord, screenshot)."),

    H1("6. Statistiques personnelles"),
    Bullet("Nombre de voyages effectués."),
    Bullet("Nombre de voyageurs rencontrés (sans données nominatives partagées)."),
    Bullet("Km parcourus (estimation par mode)."),
    Bullet("Émissions CO2eq estimées (cohérence Charte engagement carbone)."),
    Bullet("Avoir parrain cumulé."),
    Bullet("Note NPS moyenne données aux voyages."),

    H1("7. Communauté et entraide"),
    Bullet("Groupe Facebook privé Eventy Famille (cohérence Programme de fidélisation)."),
    Bullet("Forum dans l'espace voyageur (modéré, lecture publique, écriture sur opt-in)."),
    Bullet("Possibilité de proposer une destination via formulaire dédié."),
    Bullet("Pas de pression à participer — opt-in pur."),

    H1("8. Notifications"),

    H2("8.1. Notifications activées par défaut"),
    Bullet("Confirmation de réservation."),
    Bullet("Documents de voyage (J-30, J-7)."),
    Bullet("Reconfirmation J-1."),
    Bullet("Email de remerciement post-voyage."),

    H2("8.2. Notifications optionnelles (opt-in)"),
    Bullet("Anniversaire de voyage."),
    Bullet("Nouveaux voyages similaires aux préférences."),
    Bullet("Défis et missions saisonnières."),
    Bullet("Nouveaux badges débloqués."),
    Bullet("Newsletter mensuelle Eventy Famille."),

    H2("8.3. Notifications interdites"),
    Bullet("Notifications anxiogènes (« plus que 3 places ! » sauf si vrai)."),
    Bullet("Notifications avec urgence factice."),
    Bullet("Notifications répétitives (max 2/semaine pour le marketing)."),
    Bullet("Notifications hors heures (pas avant 8h, pas après 21h)."),

    H1("9. Indicateurs gamification"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Voyageurs avec ≥ 1 badge", "≥ 70 %", "≥ 90 %"],
        ["Voyageurs ayant participé à ≥ 1 défi", "≥ 15 %", "≥ 35 %"],
        ["Voyageurs membres groupe Facebook", "≥ 30 %", "≥ 60 %"],
        ["Taux de re-réservation (lié à gamification)", "Mesure indirecte", "+10 % vs hors gamification"],
        ["Taux d'opt-in notifications optionnelles", "≥ 40 %", "≥ 60 %"],
        ["Plaintes concernant la gamification", "0", "0"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Refus du dark pattern (urgence factice, scarcité simulée, FOMO entretenu)."),
    Bullet("Refus de l'addiction (pas de mécaniques d'engagement compulsif)."),
    Bullet("Transparence sur les algorithmes utilisés (recommandations, suggestions)."),
    Bullet("Possibilité de désactiver la gamification dans les préférences voyageur."),
    Bullet("Confidentialité des statistiques personnelles (cohérence RGPD)."),
    Bullet("Refus de la concurrence agressive entre voyageurs."),

    H1("11. Mise à jour et évolution"),
    Bullet("Revue annuelle du programme avec sondage voyageurs Famille."),
    Bullet("Possibilité de proposer de nouveaux défis (formulaire dédié)."),
    Bullet("Tests A/B sobres (cohérence éthique)."),
    Bullet("Désactivation immédiate de toute mécanique problématique."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Programme de fidélisation Eventy Famille, Onboarding voyageur, Politique RGPD, Roadmap technique, Charte engagement carbone, Politique avis voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN DE GESTION D'ÉVÉNEMENTS EVENTY
// ============================================================
function planEvenements() {
  return [
    bandeauTitre(
      "PLAN DE GESTION D'ÉVÉNEMENTS EVENTY",
      "Anniversaires, lancements, soirées et présence salons",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'EVENTY LIFE SAS en matière d'événements. Il couvre les événements internes (équipe, partenaires), les événements communautaires (voyageurs Eventy Famille), les événements commerciaux et institutionnels (salons, conférences). Il complète la Stratégie de relations presse, la Stratégie réseaux sociaux et la Charte télétravail.", { italics: true }),

    P("Pour Eventy, un événement n'est pas juste une opération marketing. C'est un temps de rassemblement aligné sur l'âme du projet (chaleur, simplicité, rencontre humaine). Nous privilégions le qualitatif et le sens, pas le clinquant.", { italics: true }),

    H1("1. Typologie d'événements"),

    H2("1.1. Événements internes (équipe)"),
    Bullet("Mardi de l'équipe (hebdomadaire — cohérence Charte télétravail)."),
    Bullet("Séminaires trimestriels (1-2 jours, hors locaux Eventy)."),
    Bullet("Soirée d'équipe trimestrielle (restaurant, activité)."),
    Bullet("Anniversaire d'embauche (gâteau, mot Président)."),
    Bullet("Onboarding nouveau collaborateur (cohérence Procédure de recrutement)."),

    H2("1.2. Événements partenaires"),
    Bullet("Réunion partenaires HRA annuelle."),
    Bullet("Webinaires trimestriels créateurs / vendeurs."),
    Bullet("Réunion ambassadeurs trimestrielle."),
    Bullet("Soirée des partenaires (annuelle, juin)."),

    H2("1.3. Événements communautaires (voyageurs)"),
    Bullet("Apéro Eventy trimestriel (Paris + 2 villes en province en rotation)."),
    Bullet("Conférence voyage annuelle (1 voyageur Légende + 1 partenaire HRA)."),
    Bullet("Anniversaire Eventy annuel (juin) — événement ouvert à toute la communauté."),
    Bullet("Événements à thème saisonniers (vœux nouvelle année, fête été, etc.)."),

    H2("1.4. Événements commerciaux et institutionnels"),
    Bullet("Salons tourisme (IFTM Top Resa principalement, septembre)."),
    Bullet("Conférences sectorielles (interventions Président)."),
    Bullet("Lancements de saison voyage (T1 et T3)."),
    Bullet("Conférence de presse pour annonces majeures (levée fonds, partenariats)."),

    H1("2. Calendrier annuel type"),
    makeTable({
      widths: [1872, 7488],
      header: ["Période", "Événements clés"],
      rows: [
        ["Janvier", "Vœux équipe, lancement saison 1 (printemps), conférence presse calendrier annuel"],
        ["Février", "Apéro Eventy Paris (T1), réunion ambassadeurs"],
        ["Mars", "Séminaire équipe T1, salon tourisme régional (selon programmation)"],
        ["Avril", "Apéro Eventy province #1 (T2), webinaires trimestriels partenaires"],
        ["Mai", "Réunion partenaires HRA annuelle"],
        ["Juin", "**Anniversaire Eventy** (événement signature), soirée partenaires"],
        ["Juillet-Août", "Activité réduite (saison voyages — opérationnel prioritaire)"],
        ["Septembre", "**IFTM Top Resa** (salon tourisme majeur), apéro Eventy Paris (T3)"],
        ["Octobre", "Lancement saison 2 (hiver), conférence voyage annuelle"],
        ["Novembre", "Apéro Eventy province #2 (T4), salon B2B / CSE"],
        ["Décembre", "Soirée d'équipe annuelle, vœux clients/partenaires"],
      ],
    }),

    H1("3. Anniversaire Eventy (événement signature)"),

    H2("3.1. Format"),
    Bullet("Date : juin (anniversaire de la création SAS Eventy Life)."),
    Bullet("Format hybride : événement physique dans une destination Eventy emblématique + retransmission en ligne."),
    Bullet("Durée : 1 journée."),
    Bullet("Capacité : 100-300 personnes selon édition."),

    H2("3.2. Audience invitée"),
    Bullet("Voyageurs Famille et Légende (priorité)."),
    Bullet("Partenaires HRA, créateurs, vendeurs, ambassadeurs."),
    Bullet("Investisseurs."),
    Bullet("Presse (cohérence Stratégie relations presse)."),
    Bullet("Personnalités tourisme et économie sociale (sur invitation)."),

    H2("3.3. Contenu type"),
    Bullet("Matin — bilan Eventy de l'année écoulée."),
    Bullet("Tables rondes thématiques (transparence prix, économie circulaire, voyage social)."),
    Bullet("Témoignages voyageurs et partenaires."),
    Bullet("Annonces stratégiques (nouveaux voyages, partenariats, projets)."),
    Bullet("Soirée festive avec animation locale."),

    H2("3.4. Engagements éthiques"),
    Bullet("Bilan carbone de l'événement publié."),
    Bullet("Compensation carbone systématique."),
    Bullet("Catering circuit court."),
    Bullet("Lieu accessible PMR."),
    Bullet("Captation vidéo accessible (sous-titres)."),

    H1("4. Apéros Eventy trimestriels"),

    H2("4.1. Format"),
    Bullet("Format léger : 18h-21h, lieu convivial (bar, café, espace tiers)."),
    Bullet("Capacité : 30-80 personnes."),
    Bullet("Pas de programme rigide — temps d'échanges informels."),

    H2("4.2. Périodicité"),
    Bullet("Paris : 2 par an (mars, septembre)."),
    Bullet("Province : 2 par an, en rotation entre 4-6 villes (Lyon, Marseille, Bordeaux, Lille, Toulouse, Nantes)."),

    H2("4.3. Coût type"),
    Bullet("Budget par événement : 500 à 2 000 € (selon ville et lieu)."),
    Bullet("Boissons et collations légères offertes."),

    H1("5. Présence salons"),

    H2("5.1. IFTM Top Resa (priorité)"),
    Bullet("Salon professionnel tourisme majeur en France (septembre)."),
    Bullet("Présence : An 1 stand modeste, An 2+ stand structurant."),
    Bullet("Objectif : sourcing créateurs/HRA, partenariats institutionnels, RP."),

    H2("5.2. Salons B2B / CSE"),
    Bullet("Salon CSE en région (1-2 par an)."),
    Bullet("Salon entreprises et événementiel."),
    Bullet("Cohérence avec Offre CSE / B2B."),

    H2("5.3. Salons régionaux et thématiques"),
    Bullet("À étudier au cas par cas selon ROI."),
    Bullet("Privilégier les salons engageants (économie sociale, tourisme durable)."),

    H1("6. Modalités d'organisation"),

    H2("6.1. Préparation"),
    Bullet("Brief événement formalisé 60 j avant (objectifs, audience, budget, livrables)."),
    Bullet("Validation Président."),
    Bullet("Coordination logistique (lieu, catering, technique)."),
    Bullet("Communication : invitations 30 j avant, rappel 7 j avant."),

    H2("6.2. Pendant l'événement"),
    Bullet("Accueil chaleureux."),
    Bullet("Photographie/captation avec accord des participants (cohérence RGPD)."),
    Bullet("Modération bienveillante des échanges."),

    H2("6.3. Après l'événement"),
    Bullet("Email de remerciement personnalisé sous 7 jours."),
    Bullet("Partage des photos/vidéos (avec accord)."),
    Bullet("Bilan d'impact (NPS participants, ROI commercial, ROI RP)."),
    Bullet("Capitalisation pour futures éditions."),

    H1("7. Budget événements"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Type d'événement", "Budget par événement", "Nombre / an"],
      rows: [
        ["Mardi de l'équipe (interne)", "≤ 50 € (déjeuner offert)", "Hebdomadaire"],
        ["Séminaire trimestriel équipe", "1 500-3 000 €", "4"],
        ["Apéro Eventy Paris", "1 500 €", "2"],
        ["Apéro Eventy province", "800 €", "2"],
        ["Réunion partenaires annuelle", "5 000 €", "1"],
        ["Anniversaire Eventy (signature)", "15 000-30 000 €", "1"],
        ["IFTM Top Resa (stand)", "10 000-25 000 €", "1"],
        ["Salon B2B / CSE", "3 000-8 000 €", "1-2"],
      ],
    }),

    H1("8. Indicateurs événements"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Événements organisés / an", "≥ 15", "≥ 30"],
        ["Participants total / an", "≥ 800", "≥ 5 000"],
        ["NPS participants événements", "≥ + 70", "≥ + 80"],
        ["Conversion événements → réservations", "Mesure indirecte", "Suivi structuré"],
        ["Articles presse liés événements", "≥ 5", "≥ 25"],
        ["Empreinte carbone moyenne / participant", "Mesurée et publiée", "−25 % vs An 1"],
      ],
    }),

    H1("9. Engagements éthiques événements"),
    Bullet("Refus du clinquant marketing (sobriété, sens)."),
    Bullet("Catering circuit court systématique."),
    Bullet("Lieux accessibles PMR (cohérence Politique accessibilité PMR)."),
    Bullet("Mesure et publication de l'empreinte carbone."),
    Bullet("Refus de la pression commerciale agressive."),
    Bullet("Confidentialité des participants (cohérence RGPD, accord photo systématique)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte télétravail, Plan marketing An 1, Stratégie relations presse, Stratégie réseaux sociaux, Programme de fidélisation Eventy Famille, Politique accessibilité PMR, Charte engagement carbone, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — GUIDE PORTAIL AMBASSADEUR
// ============================================================
function guidePortailAmbassadeur() {
  return [
    bandeauTitre(
      "GUIDE UTILISATION PORTAIL AMBASSADEUR EVENTY",
      "Mode d'emploi pour ambassadeurs et influenceurs partenaires",
    ),
    Spacer(160),

    P("Ce guide accompagne les ambassadeurs et influenceurs partenaires d'EVENTY LIFE SAS dans l'utilisation de leur portail dédié. Il complète le Code de conduite ambassadeurs (cadre éthique), le Kit ambassadeur (supports prêts à l'emploi) et le Programme de fidélisation Eventy Famille — il en est l'outil opérationnel.", { italics: true }),

    P("Le portail ambassadeur est conçu pour t'aider à promouvoir Eventy avec authenticité et efficacité. Il te donne accès à tous les supports, à ton code parrainage, à tes statistiques de performance, et à un espace de communication direct avec l'équipe Eventy.", { italics: true }),

    H1("1. Accès et premiers pas"),

    H2("1.1. Connexion"),
    Bullet("URL : eventylife.fr/portail-ambassadeur."),
    Bullet("Identifiants : email + mot de passe (12 caractères minimum)."),
    Bullet("MFA obligatoire (cohérence Politique cybersécurité)."),
    Bullet("Première connexion : tutoriel 10 min + signature Code de conduite ambassadeurs."),

    H2("1.2. Tableau de bord d'accueil"),
    Bullet("Vue rapide : conversions du mois, taux d'engagement, mois précédent."),
    Bullet("Actions rapides : copier code parrain, télécharger kit, voir nouveautés."),
    Bullet("Notifications : nouveau voyage à promouvoir, paiement de commission, message Eventy."),

    H1("2. Niveau de partenariat"),
    Bullet("Onglet « Mon statut »."),
    Bullet("4 niveaux possibles (cohérence Code de conduite ambassadeurs) : Ambassadeur, Influenceur invité, Influenceur partenaire, Personnalité publique partenaire."),
    Bullet("Avantages associés à chaque niveau (remises, événements VIP, rémunération si applicable)."),
    Bullet("Évolution possible selon performance et engagement."),

    H1("3. Code parrainage et lien tracé"),

    H2("3.1. Code unique"),
    Bullet("Code généré automatiquement : EVENTY-[NOM]-[ANNÉE]."),
    Bullet("Lien tracé personnel : eventylife.fr/?ref=[TON-CODE]."),
    Bullet("Tracking automatique des clics et conversions."),

    H2("3.2. Avantages voyageurs filleuls"),
    Bullet("10 % de remise sur le 1er voyage du filleul."),
    Bullet("Avantage parrain : avoir 50/60/75 € selon palier."),
    Bullet("Cohérence Programme de fidélisation Eventy Famille."),

    H1("4. Kit ambassadeur intégré"),

    H2("4.1. Téléchargements directs"),
    Bullet("Logo Eventy (toutes versions)."),
    Bullet("Charte graphique complète."),
    Bullet("Photothèque haute définition (100+ photos voyageurs et destinations)."),
    Bullet("Vidéos courtes prêtes à partager (15-90 sec)."),
    Bullet("Templates Instagram/FB/TikTok préformatés."),
    Bullet("Modèles email et blog."),

    H2("4.2. Mises à jour régulières"),
    Bullet("Nouveaux supports trimestriels."),
    Bullet("Webinaires de présentation des nouveautés."),
    Bullet("Possibilité de demander des supports manquants."),

    H1("5. Catalogue voyages à promouvoir"),

    H2("5.1. Vue catalogue"),
    Bullet("Tous les voyages publiés sur eventylife.fr."),
    Bullet("Filtres : destination, durée, profil voyageur, période."),
    Bullet("Voyages mis en avant cette semaine (highlights Eventy)."),
    Bullet("Voyages tendance (engagement social élevé)."),

    H2("5.2. Fiches commerciales par voyage"),
    Bullet("Argumentaire prêt à l'emploi."),
    Bullet("Photos et vidéos."),
    Bullet("Témoignages voyageurs."),
    Bullet("Liens UTM pré-formatés intégrant ton code parrain."),

    H1("6. Suivi des performances"),

    H2("6.1. Indicateurs principaux"),
    Bullet("Visiteurs uniques via ton lien."),
    Bullet("Conversions (réservations confirmées)."),
    Bullet("CA voyage généré (volume affaires apporté)."),
    Bullet("Commission cumulée si applicable."),
    Bullet("Taux d'engagement de tes contenus (si analytics réseaux liés)."),

    H2("6.2. Reporting détaillé"),
    Bullet("Graphiques temporels (mois, trimestre, année)."),
    Bullet("Comparaison période vs période précédente."),
    Bullet("Top voyages convertis."),
    Bullet("Top sources de trafic."),
    Bullet("Export CSV/PDF mensuel."),

    H1("7. Rémunération (si applicable)"),

    H2("7.1. Pour Ambassadeur (gratuit, esprit fidélité)"),
    Bullet("Pas de rémunération directe."),
    Bullet("Avantages : voyages à tarif préférentiel, code parrainage majoré 75 €, événements VIP."),

    H2("7.2. Pour Influenceur invité (échange en nature)"),
    Bullet("Voyage offert ou tarif préférentiel."),
    Bullet("Pas de rémunération financière."),
    Bullet("Engagement : 1 publication post-voyage minimum."),

    H2("7.3. Pour Influenceur partenaire (contrat structuré)"),
    Bullet("Rémunération forfaitaire ou par conversion (commission Stripe Connect)."),
    Bullet("Brief créatif validé par Eventy."),
    Bullet("Reporting mensuel."),
    Bullet("Cohérence avec contrat type structuré."),

    H1("8. Communication avec Eventy"),
    Bullet("Email dédié : ambassadeur@eventylife.fr."),
    Bullet("Messagerie intégrée au portail."),
    Bullet("Réponse Eventy sous 48 h ouvrées."),
    Bullet("Réunion trimestrielle ambassadeurs (visio)."),
    Bullet("Newsletter trimestrielle dédiée."),

    H1("9. Validation préalable des contenus à enjeu"),
    Bullet("Articles presse, intervention conférence, vidéo > 5 min, post mentionnant chiffres financiers."),
    Bullet("Demande à : ambassadeur@eventylife.fr."),
    Bullet("Délai de réponse : 48 h ouvrées."),
    Bullet("Validation tacite si pas de retour sous 5 jours ouvrés."),

    H1("10. Engagements éthiques (cohérence Code de conduite)"),
    Bullet("Authenticité absolue dans les contenus produits."),
    Bullet("Mention transparente des partenariats commerciaux."),
    Bullet("Respect du droit à l'image des autres voyageurs."),
    Bullet("Confidentialité des informations stratégiques Eventy."),
    Bullet("Refus de représenter simultanément un concurrent direct."),
    Bullet("Refus des pratiques trompeuses (fausses expériences, photos non prises sur place)."),

    H1("11. Sanctions en cas de manquement"),
    Bullet("Avertissement écrit pour manquement mineur (avec délai de régularisation 7 j)."),
    Bullet("Résiliation du partenariat pour manquement majeur."),
    Bullet("Action en justice pour manquement grave (fraude, escroquerie, atteinte à la dignité)."),
    Bullet("Cohérence avec Code de conduite ambassadeurs."),

    H1("12. Support et formation"),
    Bullet("Webinaire d'onboarding ambassadeur (90 min)."),
    Bullet("Formation continue (modules thématiques mensuels)."),
    Bullet("Documentation interne accessible 24/7 (centre d'aide)."),
    Bullet("Email dédié pour questions techniques."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour à chaque évolution majeure du portail.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Code de conduite ambassadeurs, Kit ambassadeur, Programme de fidélisation Eventy Famille, Argumentaire commercial vendeurs, Charte éditoriale, Politique cybersécurité, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Programme-Gamification-Voyageur.docx",
      title: "Eventy Life — Programme de gamification voyageur",
      description: "Mécaniques ludiques au service de l'expérience voyageur Eventy.",
      footer: "EVENTY LIFE SAS — Programme gamification voyageur",
      children: programmeGamification(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Evenements.docx",
      title: "Eventy Life — Plan de gestion d'événements",
      description: "Plan d'événements internes, partenaires, communautaires et institutionnels.",
      footer: "EVENTY LIFE SAS — Plan d'événements",
      children: planEvenements(),
    },
    {
      file: "docs/garanties/Eventy-Life-Guide-Portail-Ambassadeur.docx",
      title: "Eventy Life — Guide utilisation portail ambassadeur",
      description: "Mode d'emploi du portail ambassadeur et influenceurs Eventy.",
      footer: "EVENTY LIFE SAS — Guide portail ambassadeur",
      children: guidePortailAmbassadeur(),
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
