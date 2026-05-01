/**
 * Eventy Life — Trois documents opérationnels et commerciaux
 *
 *   1. Manuel des opérations quotidiennes (procédures internes Eventy)
 *   2. Onboarding voyageur pas-à-pas (parcours B2C post-réservation)
 *   3. Code de conduite ambassadeurs / influenceurs (programme partenariat)
 *
 * Usage : node scripts/garanties/build-operations-onboarding-ambassadeurs.js
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
// DOCUMENT 1 — MANUEL DES OPÉRATIONS QUOTIDIENNES
// ============================================================
function manuelOperations() {
  return [
    bandeauTitre(
      "MANUEL DES OPÉRATIONS QUOTIDIENNES",
      "Procédures internes Eventy Life — référentiel équipe",
    ),
    Spacer(160),

    P("Le présent manuel formalise les procédures internes quotidiennes d'EVENTY LIFE SAS pour garantir la qualité, la traçabilité et la cohérence des opérations. Il est destiné à l'équipe interne (Président, équipe administrative, accompagnateurs) ainsi qu'aux partenaires opérationnels (créateurs, vendeurs, HRA).", { italics: true }),

    P("Ce manuel s'inscrit en cohérence avec : la Procédure d'audit qualité HRA, la Charte qualité accompagnateur, le Tableau de bord opérationnel, le Plan de continuité d'activité et la Procédure de réclamation détaillée.", { italics: true }),

    H1("1. Routine quotidienne — Président"),

    H2("1.1. Matin (9h-10h)"),
    Bullet("Revue du tableau de bord opérationnel (KPI réservations, CA, NPS, réclamations en cours)."),
    Bullet("Lecture des emails support@eventylife.fr et reclamation@eventylife.fr (réponse sous 24 h ouvrées)."),
    Bullet("Vérification du compte cantonné APST (mouvements 24 h, alertes anomalies)."),
    Bullet("Briefing équipe — agenda du jour, urgences, voyages en cours."),

    H2("1.2. Journée"),
    Bullet("Suivi réservations en cours (validation paiements, confirmation aux voyageurs)."),
    Bullet("Suivi voyages en cours (point matinal et soirée avec accompagnateurs)."),
    Bullet("Coordination partenaires (HRA, transporteurs) — appels de qualification, ajustements."),
    Bullet("Décisions stratégiques (catalogue, marketing, partenariats)."),

    H2("1.3. Soir (17h-18h)"),
    Bullet("Revue de la journée — réservations confirmées, CA encaissé, points d'attention."),
    Bullet("Mise à jour du tableau de bord (manuel ou semi-automatisé)."),
    Bullet("Préparation du lendemain — priorités, rendez-vous, échéances."),

    H1("2. Routine hebdomadaire"),

    H2("2.1. Lundi"),
    Bullet("Comité de direction interne (1h) — bilan semaine passée, priorités semaine en cours."),
    Bullet("Revue partenariats (HRA, transport, accompagnateurs) — pipeline, signatures, réactivations."),
    Bullet("Suivi marketing (campagnes en cours, KPI acquisition, contenus à publier)."),

    H2("2.2. Mercredi"),
    Bullet("Revue financière (compte cantonné, trésorerie, factures à régler, factures à émettre)."),
    Bullet("Échange avec expert-comptable (sous 24 h en cas d'anomalie)."),
    Bullet("Mise à jour cash flow rolling 13 semaines."),

    H2("2.3. Vendredi"),
    Bullet("Reporting hebdomadaire (CA, voyages confirmés, voyageurs ce mois, NPS, réclamations résolues)."),
    Bullet("Communication équipe — message récapitulatif des avancées et priorités semaine suivante."),
    Bullet("Planification week-end (voyages en cours, astreintes, communication clients)."),

    H1("3. Routine mensuelle"),

    H2("3.1. Premier lundi du mois"),
    Bullet("Clôture mensuelle préliminaire (CA, marges, dépenses) — préparation expert-comptable."),
    Bullet("Mise à jour Plan de trésorerie M0-M12."),
    Bullet("Revue OKR mensuels (Objectives & Key Results)."),
    Bullet("Reporting investisseurs (mensuel, format 1 page recto)."),

    H2("3.2. Mi-mois"),
    Bullet("Audit qualité aléatoire (1-2 HRA visités ou audités à distance)."),
    Bullet("Revue NPS détaillée par voyage et par étape (transport, hébergement, restauration, activités, accompagnement)."),
    Bullet("Suivi formation accompagnateurs (sessions à programmer, modules à mettre à jour)."),

    H2("3.3. Fin de mois"),
    Bullet("Clôture comptable mensuelle avec expert-comptable."),
    Bullet("Déclaration TVA marge (si trimestrielle, planifier sur le mois concerné)."),
    Bullet("Sauvegarde des données opérationnelles (compte cantonné, voyages, réclamations)."),
    Bullet("Revue stratégique mensuelle (catalogue, prix, positionnement, tendances)."),

    H1("4. Procédures de gestion des réservations"),

    H2("4.1. Réception d'une réservation"),
    Numbered("Le voyageur réserve via eventylife.fr (paiement Stripe en ligne)."),
    Numbered("Le système envoie automatiquement le contrat (CGV + bon de commande) au voyageur."),
    Numbered("L'équipe Eventy reçoit notification par email + tableau de bord."),
    Numbered("Vérification dans les 24 h ouvrées : disponibilité, conformité, alerte sur besoins spécifiques."),
    Numbered("Confirmation officielle au voyageur sous 48 h ouvrées (email automatique + manuel si besoins spécifiques)."),
    Numbered("Le montant est versé sur le compte cantonné APST jusqu'à la fin du voyage."),

    H2("4.2. Modification d'une réservation"),
    Bullet("Demande du voyageur reçue à modification@eventylife.fr."),
    Bullet("Étude de faisabilité sous 48 h (selon délai et type de modification)."),
    Bullet("Devis modificatif si surcoût applicable (nouveau bon de commande à signer)."),
    Bullet("Confirmation et mise à jour du dossier voyageur."),

    H2("4.3. Annulation par le voyageur"),
    Bullet("Demande reçue à annulation@eventylife.fr (email type avec accusé réception immédiat)."),
    Bullet("Application des barèmes CGV Article 8 (échelonnement selon délai annulation)."),
    Bullet("Calcul du remboursement, communication au voyageur sous 48 h."),
    Bullet("Remboursement effectif sous 14 jours par virement (ou avoir si demandé)."),
    Bullet("Si applicable : déclenchement assurance annulation (selon contrat souscrit)."),

    H2("4.4. Annulation par Eventy (force majeure)"),
    Bullet("Information immédiate au voyageur (téléphone + email)."),
    Bullet("Proposition d'avoir 110 % du montant versé OU remboursement intégral sous 14 jours (au choix du voyageur)."),
    Bullet("Reporting Atout France si annulation collective."),
    Bullet("Activation du Plan de continuité d'activité si nécessaire."),

    H1("5. Procédures de gestion des voyages en cours"),

    H2("5.1. J-30 — Confirmation finale"),
    Bullet("Vérification que le seuil minimal de partenaires (4 voyageurs) est atteint."),
    Bullet("Confirmation auprès des HRA et du transporteur."),
    Bullet("Briefing accompagnateur (programme, voyageurs, besoins spécifiques)."),
    Bullet("Envoi roadbook voyageurs (programme détaillé, contacts, conseils pratiques)."),

    H2("5.2. J-7 — Préparation"),
    Bullet("Reconfirmation voyageurs (rappel rendez-vous, dernières informations)."),
    Bullet("Vérification chaîne logistique (transport, hôtels, restaurants, activités)."),
    Bullet("Préparation du kit de voyage accompagnateur (téléphone d'urgence, trousse premiers secours, fiche voyageurs)."),

    H2("5.3. Pendant le voyage (J0 à J+N)"),
    Bullet("Point quotidien matin et soir entre Président et accompagnateur (Whatsapp ou téléphone)."),
    Bullet("Reporting incident immédiat (voir Manuel Incident Voyage) — délai 30 min pour les incidents majeurs."),
    Bullet("Disponibilité Président 24/7 pour décisions urgentes."),
    Bullet("Communication aux familles si demande."),

    H2("5.4. Retour de voyage (J+1 à J+7)"),
    Bullet("Email de remerciement et invitation à donner un avis (J+1 ou J+2)."),
    Bullet("Collecte avis voyageurs (lien vers Trustpilot et formulaire interne)."),
    Bullet("Calcul NPS du voyage."),
    Bullet("Débrief accompagnateur (forces, axes d'amélioration, partenaires HRA)."),
    Bullet("Versement des marges aux créateurs (3pts) sous 48 h."),
    Bullet("Versement de la commission aux vendeurs (5%) sous 48 h."),
    Bullet("Retour des fonds du compte cantonné vers compte courant Eventy (montant solde après marges/commissions)."),

    H1("6. Procédures de gestion des partenaires"),

    H2("6.1. Onboarding HRA"),
    Bullet("Sourcing — pré-qualification téléphonique (5 min) — visite ou audit qualité."),
    Bullet("Signature contrat HRA Partenaire (modèle commun)."),
    Bullet("Onboarding plateforme (compte créateur sur eventylife.fr/maisons)."),
    Bullet("Test technique paiement et suivi commande."),
    Bullet("Première commande live."),

    H2("6.2. Onboarding créateur"),
    Bullet("Entretien de validation profil (motivations, expérience, capacités)."),
    Bullet("Signature contrat créateur (modèle commun)."),
    Bullet("Formation initiale (3 jours — création voyage, négociation HRA, gestion logistique, accompagnement)."),
    Bullet("Premier voyage en double (avec accompagnateur expérimenté)."),
    Bullet("Validation après débrief premier voyage."),

    H2("6.3. Onboarding vendeur"),
    Bullet("Entretien de validation (motivations, capacités commerciales)."),
    Bullet("Signature contrat vendeur (modèle commun, 5% HT)."),
    Bullet("Formation produit (1 journée — connaissance catalogue, argumentaire, outils CRM)."),
    Bullet("Mise à disposition outils (CRM, flyers, fiches commerciales, portail vendeur)."),

    H1("7. Procédures de gestion administrative"),

    H2("7.1. Comptabilité quotidienne"),
    Bullet("Saisie des factures fournisseurs sous 7 jours (logiciel comptable)."),
    Bullet("Saisie des factures clients dès l'émission (lien automatique avec Stripe)."),
    Bullet("Rapprochement bancaire hebdomadaire (compte courant et compte cantonné)."),
    Bullet("Sauvegarde des justificatifs (cloud sécurisé France, conservation 10 ans)."),

    H2("7.2. Gestion documentaire"),
    Bullet("Archivage des contrats signés (cloud sécurisé France, accès restreint)."),
    Bullet("Archivage des bons de commande, factures et reçus voyageurs (5 ans)."),
    Bullet("Archivage des contrats partenaires (durée du contrat + 5 ans)."),
    Bullet("Suppression des données voyageurs au terme légal (cf. RGPD : 5 ans après dernier voyage, sauf comptabilité 10 ans)."),

    H2("7.3. Conformité"),
    Bullet("Veille réglementaire trimestrielle (Code Tourisme, Code Consommation, RGPD)."),
    Bullet("Renouvellement annuel : adhésion APST, RC Pro, immatriculation Atout France (sur 3 ans)."),
    Bullet("Mise à jour CGV en cas de changement réglementaire."),
    Bullet("Reporting CNIL si incident de sécurité avec données personnelles (sous 72 h)."),

    H1("8. Indicateurs de pilotage quotidiens"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Indicateur", "Cible", "Périodicité", "Responsable"],
      rows: [
        ["Réservations confirmées / jour", "≥ 2", "Quotidien", "Président"],
        ["Délai réponse email support", "≤ 24 h", "Quotidien", "Président"],
        ["NPS voyages clôturés", "≥ + 60", "Mensuel", "Président"],
        ["Réclamations en cours", "≤ 5 ouvertes", "Quotidien", "Président"],
        ["Délai résolution réclamation", "≤ 14 j ouvrés", "Hebdo", "Président"],
        ["Trésorerie disponible", "≥ 30 j charges", "Hebdo", "Président + Comptable"],
        ["Compte cantonné — solde", "100 % engagé", "Quotidien", "Président"],
        ["Voyages au-dessus seuil 4 pax", "100 %", "Hebdo", "Président"],
        ["Audit qualité HRA / mois", "≥ 2", "Mensuel", "Président"],
      ],
    }),

    H1("9. Outils internes utilisés"),
    Bullet("Plateforme propriétaire eventylife.fr (Next.js 14 + NestJS, hébergement Scaleway France)."),
    Bullet("Stripe Connect — paiements et flux financiers (compte cantonné dédié)."),
    Bullet("Slack ou WhatsApp — communication équipe et accompagnateurs."),
    Bullet("Cloud documentaire France (Scaleway Object Storage ou OVH cloud)."),
    Bullet("Logiciel comptable (à confirmer avec expert-comptable — Pennylane, Tiime, ou équivalent)."),
    Bullet("Trustpilot — collecte avis voyageurs."),
    Bullet("Google Workspace — emails (eventylife.fr)."),

    H1("10. Mise à jour et formation"),
    Bullet("Le présent manuel est revu et mis à jour annuellement (1er trimestre)."),
    Bullet("Toute mise à jour majeure est communiquée à l'équipe et signée."),
    Bullet("Formation des nouveaux collaborateurs sur le manuel (½ journée d'onboarding)."),
    Bullet("Mises à jour mineures consignées dans un journal de version (Annexe A — non détaillée ici)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 30 avril 2026. Document confidentiel, à usage exclusif équipe Eventy.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Procédure audit qualité HRA, Charte qualité accompagnateur, Tableau de bord opérationnel, Plan continuité activité, Procédure réclamation détaillée, Manuel Incident Voyage.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — ONBOARDING VOYAGEUR PAS-À-PAS
// ============================================================
function onboardingVoyageur() {
  return [
    bandeauTitre(
      "ONBOARDING VOYAGEUR EVENTY LIFE",
      "Parcours pas-à-pas de la réservation au retour de voyage",
    ),
    Spacer(160),

    P("Ce document décrit, du point de vue du voyageur, l'ensemble du parcours Eventy : de la première visite sur eventylife.fr jusqu'au retour de voyage et au-delà. Il a vocation à être lu par l'équipe interne, par les accompagnateurs et par les voyageurs eux-mêmes (version simplifiée publiée sur le site).", { italics: true }),

    P("L'âme d'Eventy : « Le voyage de groupe où tu n'as rien à gérer, tout à vivre. » Chaque étape de ce parcours est conçue pour que le voyageur se sente accompagné, en confiance, jamais seul.", { italics: true }),

    H1("1. Étape 1 — Découverte (J-180 à J-90 avant départ)"),

    H2("1.1. Le voyageur découvre Eventy"),
    Bullet("Via SEO (recherche Google « voyage en groupe », « voyage solo accompagné »)."),
    Bullet("Via réseaux sociaux (Instagram, Facebook, TikTok — contenus créateurs et voyageurs)."),
    Bullet("Via bouche-à-oreille (parrainage voyageurs, recommandations)."),
    Bullet("Via partenariats vendeurs (commerciaux indépendants au sein de leur réseau)."),
    Bullet("Via ambassadeurs / influenceurs (programme partenariat — voir Code de conduite ambassadeurs)."),

    H2("1.2. Le voyageur explore le catalogue"),
    Bullet("Filtre par destination, durée, budget, profil (solo, couple, famille, ami(e)s)."),
    Bullet("Lecture fiches voyages détaillées : programme jour par jour, hébergements, transport, activités, prix tout inclus."),
    Bullet("Consultation des avis voyageurs (Trustpilot et avis internes)."),
    Bullet("Consultation des photos et vidéos du voyage (créateurs voyage)."),

    H2("1.3. Le voyageur pose ses questions"),
    Bullet("Chat en ligne pendant les heures ouvrées (réponse sous 1 h)."),
    Bullet("Email contact@eventylife.fr (réponse sous 24 h ouvrées)."),
    Bullet("Téléphone direct (numéro publié sur le site)."),
    Bullet("FAQ détaillée (50+ questions) consultable en ligne."),

    H1("2. Étape 2 — Réservation (J-180 à J-30 avant départ)"),

    H2("2.1. Le voyageur choisit son voyage"),
    Bullet("Sélection date de départ (calendrier interactif)."),
    Bullet("Sélection nombre de voyageurs (solo, couple, famille)."),
    Bullet("Sélection options (chambre individuelle, animal d'assistance, régime alimentaire spécifique, etc.)."),
    Bullet("Récapitulatif clair du prix tout inclus (transport + hébergement + restauration + activités + Pack Sérénité)."),

    H2("2.2. Création du compte voyageur"),
    Bullet("Création de compte en 2 minutes (email + mot de passe + identité civile)."),
    Bullet("Validation email (lien de confirmation sous 5 min)."),
    Bullet("Profil voyageur : informations administratives, médicales (optionnel), préférences."),

    H2("2.3. Paiement sécurisé"),
    Bullet("Paiement via Stripe (CB, Apple Pay, Google Pay, virement)."),
    Bullet("Au choix : 100 % à la réservation OU acompte 30 % + solde 30 jours avant départ."),
    Bullet("Versement immédiat sur le compte cantonné APST (garantie financière intégrale)."),
    Bullet("Reçu de paiement envoyé par email instantanément."),

    H2("2.4. Confirmation officielle"),
    Bullet("Email de confirmation contenant : contrat (CGV + bon de commande), reçu, rappel programme, contacts d'urgence."),
    Bullet("Délai de rétractation 14 jours mentionné explicitement."),
    Bullet("Numéro de dossier voyageur attribué (format YYYYMM-VOY-####)."),
    Bullet("Accès à l'espace voyageur sur eventylife.fr."),

    H1("3. Étape 3 — Préparation (J-30 à J-7 avant départ)"),

    H2("3.1. J-30 — Roadbook voyageur"),
    Bullet("Email envoyé automatiquement avec : programme jour par jour détaillé, liste des hôtels, contacts urgence locaux."),
    Bullet("Liste des documents à apporter (CNI, passeport, carte vitale, attestation assurance)."),
    Bullet("Conseils pratiques (climat, monnaie, pourboires, code vestimentaire, prises électriques)."),
    Bullet("Coordonnées de l'accompagnateur (nom, téléphone disponible J-7)."),

    H2("3.2. J-15 — Reconfirmation"),
    Bullet("Appel personnalisé (sur les voyages premium) ou email de reconfirmation."),
    Bullet("Vérification besoins spécifiques (mobilité, allergies, traitements)."),
    Bullet("Réponse aux éventuelles dernières questions."),
    Bullet("Présentation du groupe (sans identités personnelles, juste profil général)."),

    H2("3.3. J-7 — Briefing final"),
    Bullet("Email récapitulatif final (heure RDV, lieu, dernières informations)."),
    Bullet("Mise en relation Whatsapp avec l'accompagnateur (groupe voyageurs)."),
    Bullet("Possibilité de poser ses dernières questions."),

    H1("4. Étape 4 — Le voyage (J0 à J+N)"),

    H2("4.1. Jour de départ (J0)"),
    Bullet("Arrivée au lieu de RDV (parking sécurisé pour voitures voyageurs si départ bus)."),
    Bullet("Accueil personnalisé par l'accompagnateur (présentation, distribution kit voyageur, café)."),
    Bullet("Briefing du voyage (programme rappelé, règles de groupe, contacts urgence)."),
    Bullet("Départ à l'heure prévue (tolérance 30 min pour retardataires, communiquée à l'avance)."),

    H2("4.2. Pendant le voyage"),
    Bullet("Disponibilité accompagnateur 24/7 (excepté heures de sommeil)."),
    Bullet("Activités quotidiennes annoncées la veille au soir (debriefing chaque soir)."),
    Bullet("Liberté individuelle préservée — possibilité de skipper une activité sans surcoût."),
    Bullet("Pack Sérénité activé en cas de besoin (médecin, pharmacie, consulat, rapatriement)."),
    Bullet("Sondage quotidien rapide (1 question — humeur du jour) pour ajuster l'expérience."),

    H2("4.3. Dernier jour"),
    Bullet("Bilan collectif (temps fort souvenirs)."),
    Bullet("Distribution des photos/vidéos collectives (Google Drive ou WeTransfer)."),
    Bullet("Échange des coordonnées entre voyageurs (sous accord, RGPD respecté)."),
    Bullet("Au revoir personnalisé par l'accompagnateur."),

    H1("5. Étape 5 — Retour (J+1 à J+30)"),

    H2("5.1. J+1 — Email de remerciement"),
    Bullet("Email personnalisé du Président d'Eventy (ou créateur du voyage)."),
    Bullet("Lien vers formulaire d'avis interne (5 questions, 3 minutes)."),
    Bullet("Lien vers Trustpilot pour avis public."),
    Bullet("Photos/vidéos du voyage (si traitement et accord voyageurs)."),

    H2("5.2. J+7 — Suivi qualité"),
    Bullet("Si NPS individuel < + 60 : appel personnalisé pour comprendre et améliorer."),
    Bullet("Si réclamation : ouverture dossier réclamation (voir Procédure réclamation détaillée)."),
    Bullet("Si NPS individuel ≥ + 80 : invitation au programme parrainage et au programme ambassadeur."),

    H2("5.3. J+15 — Carte postale digitale"),
    Bullet("Email récapitulatif des temps forts du voyage (album photos, anecdotes, témoignages)."),
    Bullet("Présentation des prochains voyages susceptibles d'intéresser le voyageur (sans pression commerciale)."),
    Bullet("Code de parrainage actif (10 % de remise pour le filleul, avoir 50€ pour le parrain)."),

    H2("5.4. J+30 — Cycle suivant"),
    Bullet("Newsletter mensuelle (4 voyages mis en avant)."),
    Bullet("Invitation aux événements communautaires (apéro voyageurs, conférences voyage)."),
    Bullet("Si voyage à anniversaire (1 an, 2 ans, 5 ans) : message dédié."),

    H1("6. Étape 6 — Fidélisation (J+90 et au-delà)"),

    H2("6.1. Programme parrainage Eventy Family"),
    Bullet("À chaque parrainage validé (filleul ayant voyagé), le parrain reçoit 50€ d'avoir voyage."),
    Bullet("Le filleul bénéficie de 10 % de remise sur son premier voyage."),
    Bullet("Aucun plafond — un voyageur peut parrainer autant qu'il le souhaite."),

    H2("6.2. Programme fidélité Eventy Famille"),
    Bullet("À partir du 2e voyage : statut « Voyageur Fidèle » — 5 % de remise et upgrade chambre prioritaire."),
    Bullet("À partir du 5e voyage : statut « Voyageur Famille » — 10 % de remise + soirée d'accueil offerte + cadeau de voyage."),
    Bullet("À partir du 10e voyage : statut « Voyageur Légende » — 15 % de remise à vie + accès en avant-première au catalogue + invitation événements VIP."),

    H2("6.3. Communauté voyageurs"),
    Bullet("Groupe Facebook privé (anciens voyageurs)."),
    Bullet("Newsletter mensuelle dédiée fidèles."),
    Bullet("Sondages annuels pour orienter le catalogue."),
    Bullet("Invitations à donner des conférences voyage (ambassadeurs naturels)."),

    H1("7. Indicateurs d'expérience voyageur"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Indicateur", "Cible An 1", "Cible An 3", "Cible An 5"],
      rows: [
        ["NPS global voyageurs", "≥ + 60", "≥ + 70", "≥ + 75"],
        ["Taux de satisfaction (≥ 8/10)", "≥ 80 %", "≥ 88 %", "≥ 92 %"],
        ["Taux de fidélisation (2e voyage)", "≥ 25 %", "≥ 40 %", "≥ 50 %"],
        ["Taux de parrainage actif", "≥ 15 %", "≥ 25 %", "≥ 35 %"],
        ["Taux de réclamation", "≤ 5 %", "≤ 3 %", "≤ 2 %"],
        ["Délai résolution réclamation", "≤ 14 j", "≤ 10 j", "≤ 7 j"],
        ["Note moyenne Trustpilot", "≥ 4.5/5", "≥ 4.7/5", "≥ 4.8/5"],
      ],
    }),

    H1("8. Engagements émotionnels Eventy"),
    P("Au-delà des indicateurs, Eventy s'engage sur 7 promesses émotionnelles à chaque voyageur :"),
    Bullet("Tu n'es jamais seul — un humain est joignable 24/7 pendant ton voyage."),
    Bullet("Tu es accueilli avec chaleur — pas comme un client, comme un ami."),
    Bullet("Tu n'as rien à gérer — l'accompagnateur prend en charge tout l'opérationnel."),
    Bullet("Tu peux te tromper — un délai de rétractation 14 jours te protège."),
    Bullet("Tu es respecté — ton rythme, tes besoins, ta dignité."),
    Bullet("Tu es informé — pas de mauvaise surprise, tout est dit en amont."),
    Bullet("Tu es écouté — chaque retour de voyage est lu et pris en compte."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : CGV, Information précontractuelle, Charte qualité accompagnateur, Procédure réclamation détaillée, Politique RSE, Politique accessibilité PMR.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — CODE DE CONDUITE AMBASSADEURS / INFLUENCEURS
// ============================================================
function codeAmbassadeurs() {
  return [
    bandeauTitre(
      "CODE DE CONDUITE AMBASSADEURS",
      "Programme partenariat ambassadeurs et influenceurs Eventy Life",
    ),
    Spacer(160),

    P("Le présent code de conduite formalise les engagements réciproques entre EVENTY LIFE SAS et les personnes engagées dans son programme ambassadeurs et influenceurs. Il s'applique à tout partenaire identifié comme ambassadeur, influenceur, créateur de contenu, ou personnalité publique relayant l'offre Eventy.", { italics: true }),

    P("Il s'inscrit dans la cohérence des engagements éthiques d'Eventy : politique anti-corruption (esprit Sapin 2), politique RSE, politique de confidentialité (RGPD), conformité ARPP/loi influenceurs (loi n° 2023-451 du 9 juin 2023).", { italics: true }),

    H1("1. Cadre juridique"),
    Bullet("Loi n° 2023-451 du 9 juin 2023 visant à encadrer l'influence commerciale (« loi influenceurs »)."),
    Bullet("Recommandation ARPP (Autorité de Régulation Professionnelle de la Publicité)."),
    Bullet("Loi n° 2004-575 du 21 juin 2004 (LCEN — économie numérique)."),
    Bullet("Code de la consommation — articles L121-1 et suivants (pratiques commerciales trompeuses)."),
    Bullet("RGPD (Règlement (UE) 2016/679) — protection des données personnelles."),
    Bullet("Code Tourisme — article L211-3 (commercialisation de voyages)."),

    H1("2. Définitions et niveaux de partenariat"),

    H2("2.1. Ambassadeur"),
    P("L'ambassadeur est une personne ayant déjà voyagé avec Eventy au moins 2 fois et adhérant à la philosophie de l'entreprise. Il représente Eventy auprès de son cercle proche, naturellement et sans pression commerciale obligatoire."),

    H2("2.2. Influenceur partenaire"),
    P("L'influenceur partenaire est un créateur de contenu professionnel disposant d'une audience significative (≥ 5 000 abonnés actifs sur au moins une plateforme) et engagé contractuellement avec Eventy pour produire du contenu rémunéré ou en échange d'expériences."),

    H2("2.3. Influenceur invité"),
    P("L'influenceur invité bénéficie d'une expérience voyage offerte ou à tarif préférentiel en échange d'une production de contenu authentique, sans engagement commercial structurel."),

    H2("2.4. Personnalité publique partenaire"),
    P("Personnalité publique (sportif, artiste, journaliste) ayant signé un partenariat structuré avec Eventy (statut spécifique, négocié au cas par cas)."),

    H1("3. Engagements de l'ambassadeur / influenceur"),

    H2("3.1. Authenticité et transparence"),
    Bullet("L'ambassadeur s'engage à ne diffuser que des contenus reflétant sa propre expérience et son opinion sincère."),
    Bullet("Tout contenu sponsorisé est explicitement signalé (#sponsorisé, #partenaireeventy, mention « collaboration commerciale »)."),
    Bullet("Aucun contenu ne peut être trompeur, exagéré ou faux."),
    Bullet("L'ambassadeur ne peut pas s'attribuer un titre qui le présenterait comme un agent commercial salarié d'Eventy."),

    H2("3.2. Respect de la marque et des valeurs"),
    Bullet("L'ambassadeur respecte la cohérence visuelle Eventy (couleurs, typographies, logos — kit fourni)."),
    Bullet("Il ne tient aucun propos contraire aux valeurs Eventy : respect de la dignité, lutte contre les discriminations, écologie, transparence."),
    Bullet("Il ne tient aucun propos politiquement clivant ou polémique en lien direct avec Eventy."),
    Bullet("Il refuse toute association avec des marques en conflit éthique (industrie du tabac, jeux d'argent, secteurs controversés)."),

    H2("3.3. Confidentialité"),
    Bullet("L'ambassadeur respecte la confidentialité des autres voyageurs (pas de photos identifiables sans accord, pas d'anecdotes nominatives)."),
    Bullet("Il respecte la confidentialité des partenaires HRA (pas de divulgation de tarifs négociés, pas de critiques publiques avant échange privé avec Eventy)."),
    Bullet("Il respecte la confidentialité des informations stratégiques Eventy (catalogue futur, partenariats en cours, projections financières)."),

    H2("3.4. Lutte contre les pratiques trompeuses"),
    Bullet("L'ambassadeur ne diffuse aucun « avant/après » trompeur (filtres déformants, photos d'autres destinations)."),
    Bullet("Il ne crée pas de fausses expériences (récits inventés, photos non prises sur place)."),
    Bullet("Il ne supprime pas les commentaires négatifs (sauf injures ou propos discriminatoires)."),
    Bullet("Il ne propose pas de codes promo manipulés ou inexistants."),

    H1("4. Engagements d'Eventy"),

    H2("4.1. Soutien et formation"),
    Bullet("Eventy fournit un kit ambassadeur (charte graphique, photos, vidéos, slogans approuvés)."),
    Bullet("Eventy organise une réunion d'information annuelle pour les ambassadeurs et influenceurs (présentiel ou visio)."),
    Bullet("Eventy met à disposition un interlocuteur dédié (community manager ou Président)."),
    Bullet("Eventy informe en avant-première des nouveautés catalogue (1 mois avant lancement public)."),

    H2("4.2. Avantages"),
    Bullet("Voyages à tarif préférentiel (jusqu'à 25 % de remise selon niveau)."),
    Bullet("Code de parrainage majoré (avoir 100€/parrainage vs 50€ standard)."),
    Bullet("Invitation à des événements VIP (lancements, voyages presse)."),
    Bullet("Pour les influenceurs partenaires : rémunération contractuelle (forfait par publication ou commission sur conversions)."),
    Bullet("Crédit photo / mention sur les supports Eventy (avec accord)."),

    H2("4.3. Respect de la liberté éditoriale"),
    Bullet("Eventy ne dicte pas le contenu de l'ambassadeur — il ne fournit que des éléments factuels et la charte."),
    Bullet("L'ambassadeur garde le contrôle total de ses publications (style, ton, opinion)."),
    Bullet("Eventy peut suggérer des contenus mais sans imposition (sauf influenceur partenaire avec brief contractuel)."),

    H1("5. Modalités contractuelles selon niveau"),

    H2("5.1. Ambassadeur (gratuit, esprit fidélité)"),
    Bullet("Engagement informel — adhésion volontaire."),
    Bullet("Code de conduite signé."),
    Bullet("Pas d'engagement de production de contenu."),
    Bullet("Statut révocable à tout moment par Eventy ou par l'ambassadeur."),

    H2("5.2. Influenceur invité (échange en nature)"),
    Bullet("Contrat type 1 page (annexe non détaillée ici)."),
    Bullet("Voyage offert ou tarif préférentiel."),
    Bullet("Engagement minimal : 1 publication post-voyage (Instagram, blog, vidéo)."),
    Bullet("Mention « voyage offert par Eventy » obligatoire."),
    Bullet("Délai de publication : sous 30 jours après le voyage."),

    H2("5.3. Influenceur partenaire (contrat structuré)"),
    Bullet("Contrat type structuré (négocié au cas par cas)."),
    Bullet("Rémunération forfaitaire ou commission Stripe Connect."),
    Bullet("Engagement de production : nombre de contenus, plateformes, format, durée."),
    Bullet("Brief créatif validé par Eventy (sans imposer le ton)."),
    Bullet("Reporting mensuel des performances (impressions, clics, conversions)."),

    H2("5.4. Personnalité publique (cas spécifique)"),
    Bullet("Contrat structuré négocié individuellement."),
    Bullet("Conditions sur-mesure (image, durée, exclusivité)."),
    Bullet("Validation préalable par avocat de chaque communication."),

    H1("6. Lutte contre les conflits d'intérêts"),
    Bullet("L'ambassadeur ne peut pas représenter simultanément un concurrent direct d'Eventy (autre opérateur de voyages de groupe à offre similaire)."),
    Bullet("Il déclare ses partenariats actifs lors de l'entrée dans le programme."),
    Bullet("Il informe Eventy de tout nouveau partenariat susceptible de générer un conflit (sous 7 jours)."),
    Bullet("Eventy se réserve le droit de mettre fin au programme en cas de conflit caractérisé."),

    H1("7. Sanctions et résiliation"),

    H2("7.1. Manquements mineurs (avertissement)"),
    Bullet("Oubli de mention « collaboration commerciale »."),
    Bullet("Léger écart de charte graphique sans impact réputationnel."),
    Bullet("Retard ponctuel sur publication contractuelle."),
    Numbered("→ Avertissement écrit et invitation à régulariser sous 7 jours."),

    H2("7.2. Manquements majeurs (résiliation)"),
    Bullet("Diffusion de fausses informations sur Eventy ou les partenaires."),
    Bullet("Comportement contraire aux valeurs (discrimination, propos haineux)."),
    Bullet("Non-respect répété des engagements contractuels."),
    Bullet("Conflit d'intérêts non déclaré avec un concurrent direct."),
    Numbered("→ Résiliation immédiate du partenariat et, le cas échéant, action en justice (préjudice réputationnel)."),

    H2("7.3. Manquements graves (résiliation + action légale)"),
    Bullet("Détournement de codes promo, fraude, escroquerie."),
    Bullet("Atteinte à la dignité des voyageurs ou des partenaires."),
    Bullet("Divulgation de secrets professionnels ou commerciaux."),
    Numbered("→ Résiliation immédiate, action en justice (responsabilité civile et pénale), signalement aux autorités compétentes."),

    H1("8. Données personnelles et droit à l'image"),
    Bullet("Le contenu produit par l'ambassadeur lui appartient — Eventy peut en réutiliser des extraits avec son accord express."),
    Bullet("Le droit à l'image des autres voyageurs est strictement respecté (accord exprès avant publication)."),
    Bullet("Toute donnée personnelle d'autrui collectée par l'ambassadeur dans le cadre Eventy doit être traitée conformément au RGPD."),
    Bullet("L'ambassadeur peut demander à tout moment la suppression de son nom et de son image des supports Eventy."),

    H1("9. Reporting et indicateurs"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Indicateur", "Cible An 1", "Cible An 3", "Cible An 5"],
      rows: [
        ["Ambassadeurs actifs", "≥ 30", "≥ 200", "≥ 600"],
        ["Influenceurs partenaires", "≥ 5", "≥ 20", "≥ 50"],
        ["Voyages générés via ambassadeurs", "≥ 10 %", "≥ 20 %", "≥ 30 %"],
        ["Coût d'acquisition via influenceurs", "≤ 80 €", "≤ 60 €", "≤ 40 €"],
        ["Taux d'engagement contenus ambassadeurs", "≥ 4 %", "≥ 5 %", "≥ 6 %"],
        ["Taux de manquement aux règles", "≤ 5 %", "≤ 2 %", "≤ 1 %"],
      ],
    }),

    H1("10. Procédure de candidature"),
    Bullet("Candidature en ligne sur eventylife.fr/ambassadeur (formulaire dédié)."),
    Bullet("Vérification du profil (audience, valeurs, cohérence)."),
    Bullet("Entretien (15-30 min) avec le community manager ou le Président."),
    Bullet("Signature du présent code de conduite."),
    Bullet("Activation du statut et envoi du kit ambassadeur."),

    H1("11. Recours et médiation"),
    Bullet("En cas de différend, contact prioritaire : ambassadeur@eventylife.fr."),
    Bullet("Médiation interne (Président) sous 14 jours."),
    Bullet("Si nécessaire : médiation Tourisme et Voyage (MTV) ou Conciliateur Justice."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique anti-corruption, Politique RSE, Politique confidentialité RGPD, Plan marketing An 1, Politique avis voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Manuel-Operations-Quotidiennes.docx",
      title: "Eventy Life — Manuel des opérations quotidiennes",
      description: "Procédures internes quotidiennes, hebdomadaires et mensuelles d'Eventy Life.",
      footer: "EVENTY LIFE SAS — Manuel opérations quotidiennes · Confidentiel",
      children: manuelOperations(),
    },
    {
      file: "docs/garanties/Eventy-Life-Onboarding-Voyageur.docx",
      title: "Eventy Life — Onboarding voyageur pas-à-pas",
      description: "Parcours pas-à-pas du voyageur de la découverte à la fidélisation.",
      footer: "EVENTY LIFE SAS — Onboarding voyageur",
      children: onboardingVoyageur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Code-Conduite-Ambassadeurs.docx",
      title: "Eventy Life — Code de conduite ambassadeurs et influenceurs",
      description: "Cadre éthique et contractuel du programme ambassadeurs / influenceurs.",
      footer: "EVENTY LIFE SAS — Code conduite ambassadeurs",
      children: codeAmbassadeurs(),
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
