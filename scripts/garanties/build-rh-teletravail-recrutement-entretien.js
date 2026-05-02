/**
 * Eventy Life — Trois documents RH
 *
 *   1. Charte télétravail et organisation interne
 *   2. Procédure de recrutement et d'intégration
 *   3. Modèle d'entretien annuel et plan de développement
 *
 * Usage : node scripts/garanties/build-rh-teletravail-recrutement-entretien.js
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
// DOCUMENT 1 — CHARTE TÉLÉTRAVAIL ET ORGANISATION INTERNE
// ============================================================
function charteTeletravail() {
  return [
    bandeauTitre(
      "CHARTE TÉLÉTRAVAIL ET ORGANISATION INTERNE",
      "Modalités d'organisation hybride et de cohésion d'équipe Eventy Life",
    ),
    Spacer(160),

    P("La présente charte formalise les modalités d'organisation du travail au sein d'EVENTY LIFE SAS, en particulier le télétravail, le travail en présentiel et l'organisation hybride. Elle s'applique à tous les collaborateurs salariés et stagiaires d'Eventy.", { italics: true }),

    P("Eventy fait le choix d'une organisation hybride flexible : un cadre clair, mais qui respecte la singularité de chaque collaborateur et l'autonomie nécessaire à un travail intellectuel de qualité. La charte est conforme aux articles L1222-9 à L1222-11 du Code du travail (transposition de l'ANI du 26 novembre 2020) et tient compte du caractère distribué et numérique de l'activité Eventy.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Articles L1222-9 à L1222-11 du Code du travail."),
    Bullet("Accord National Interprofessionnel (ANI) du 26 novembre 2020 sur le télétravail."),
    Bullet("Loi du 22 mars 2012 sur la simplification administrative (télétravail)."),
    Bullet("Recommandations CNAM/INRS sur les risques psycho-sociaux liés au télétravail."),
    Bullet("Politique cybersécurité Eventy Life (cohérence)."),
    Bullet("Politique RSE Eventy Life (pilier social)."),

    H1("2. Champ d'application"),
    Bullet("Tous les collaborateurs salariés en CDI et CDD, à l'issue d'une période d'intégration de 3 mois minimum."),
    Bullet("Les stagiaires et alternants : modalités spécifiques validées avec l'école / l'organisme."),
    Bullet("Les freelances et indépendants Eventy (créateurs, vendeurs, accompagnateurs) ne sont pas concernés — leur statut implique de fait une indépendance organisationnelle."),
    Bullet("Postes éligibles : tous les postes administratifs, techniques, marketing, support. Postes terrain (accompagnement voyage) exclus par nature."),

    H1("3. Modalités de l'organisation hybride"),

    H2("3.1. Régime par défaut — flexible coordonné"),
    Bullet("Jusqu'à 3 jours de télétravail par semaine, avec un minimum de 2 jours en présentiel."),
    Bullet("Un jour fixe en présentiel pour toute l'équipe : le mardi (« mardi de l'équipe »)."),
    Bullet("Liberté pour le second jour de présentiel, en concertation avec le manager direct."),
    Bullet("Respect des plages de disponibilité communes (cf. article 5)."),

    H2("3.2. Régime alternatif — full remote sur dérogation"),
    Bullet("Possibilité de travail 100 % à distance sur demande motivée et accord du Président."),
    Bullet("Critères : éloignement géographique > 100 km, situation familiale particulière, profil senior autonome, etc."),
    Bullet("Engagement de présence ponctuelle pour les temps forts (séminaires trimestriels, points stratégiques)."),
    Bullet("Renouvellement annuel à la demande du collaborateur ou du manager."),

    H2("3.3. Régime alternatif — full présentiel"),
    Bullet("Possibilité de venir 5 jours sur site pour les collaborateurs qui le souhaitent (espace de travail garanti)."),
    Bullet("Aucune obligation de télétravail."),

    H2("3.4. Demande et formalisation"),
    Bullet("Le télétravail est formalisé par avenant au contrat de travail (articles concernés du Code du travail)."),
    Bullet("La demande du collaborateur est traitée sous 14 jours."),
    Bullet("Refus motivé possible (poste non éligible, période d'intégration en cours, exigence opérationnelle)."),
    Bullet("Un accord peut être révisé à la demande de l'une ou l'autre des parties (préavis 30 jours)."),

    H1("4. Conditions matérielles"),

    H2("4.1. Équipement fourni par Eventy"),
    Bullet("Ordinateur portable professionnel (configuration adaptée au poste)."),
    Bullet("Casque audio, webcam et second écran sur demande motivée."),
    Bullet("Accès aux outils de collaboration (Google Workspace, Slack/équivalent, outils métier)."),
    Bullet("Accès distant sécurisé (VPN, MFA, conformément à la Politique cybersécurité)."),

    H2("4.2. Indemnité de télétravail"),
    Bullet("Forfait mensuel de 25 € net (couvre internet, électricité, chauffage proratisé), versé pour tous les collaborateurs en télétravail régulier ≥ 1 jour/semaine."),
    Bullet("Pas d'indemnité pour le télétravail occasionnel (< 1 j/semaine sur l'année)."),
    Bullet("Cumulable avec les tickets restaurant les jours de télétravail (carte numérique)."),

    H2("4.3. Espace de travail à domicile"),
    Bullet("Le collaborateur dispose d'un espace dédié et adapté (calme, ergonomique, sécurisé)."),
    Bullet("Conformité aux règles de confidentialité (pas de tiers visualisant les données voyageurs)."),
    Bullet("Possibilité de bénéficier d'un audit ergonomique sur demande (médecine du travail)."),

    H2("4.4. Bureaux Eventy"),
    Bullet("Espace de travail moderne, calme, accessible, équipé de salles de réunion."),
    Bullet("Café / thé / fruits offerts, kitchenette équipée."),
    Bullet("Accessibilité PMR conforme aux obligations (cohérence avec Politique accessibilité PMR)."),
    Bullet("Stations de travail libres en flex office (réservation simple via outil interne)."),

    H1("5. Organisation des temps et droit à la déconnexion"),

    H2("5.1. Plages de disponibilité communes"),
    Bullet("Plages de disponibilité commune : 10h-12h30 et 14h-17h (jours travaillés)."),
    Bullet("En dehors de ces plages : flexibilité totale (chronotype, contraintes personnelles)."),
    Bullet("Amplitude maximale autorisée : 7h-20h, avec respect des temps de repos quotidiens (11h)."),

    H2("5.2. Droit à la déconnexion"),
    Bullet("Aucun email, message ou appel professionnel attendu en dehors des heures travaillées."),
    Bullet("Aucune réunion programmée avant 9h ou après 18h sans accord explicite."),
    Bullet("Pas de contact week-end et jours fériés (sauf astreinte voyage en cours, formalisée)."),
    Bullet("Activation par défaut des notifications « heures de travail » sur les outils de communication."),

    H2("5.3. Astreinte voyage"),
    Bullet("Pendant un voyage Eventy en cours, une astreinte technique 24/7 est organisée (rotation entre Président et coordinateur — pas obligation pour autres salariés)."),
    Bullet("Compensation des astreintes selon Code du travail."),

    H1("6. Confidentialité et sécurité"),
    Bullet("Verrouillage automatique du poste après 5 minutes d'inactivité."),
    Bullet("Pas d'utilisation d'outils personnels pour traiter des données voyageurs ou données sensibles."),
    Bullet("Documents sensibles : conservation cloud uniquement, pas d'impression sans nécessité opérationnelle."),
    Bullet("Conférences vidéo confidentielles : utilisation de casque, fond flouté."),
    Bullet("Toute violation des règles de confidentialité fait l'objet d'une enquête et d'une sanction selon gravité."),

    H1("7. Cohésion et culture d'équipe"),

    H2("7.1. Mardi de l'équipe"),
    Bullet("Présence de toute l'équipe le mardi (sauf dérogation full remote ou contrainte personnelle exceptionnelle)."),
    Bullet("Format : matinée stratégique (10h-12h), déjeuner offert par Eventy, après-midi opérationnelle."),
    Bullet("Sujets abordés : revue stratégique, démos produit, sujets transverses, retours voyageurs marquants."),

    H2("7.2. Séminaires trimestriels"),
    Bullet("Séminaire de 1 à 2 jours par trimestre, hors locaux Eventy (gîte, hôtel, lieu inspirant)."),
    Bullet("Format mixte : revue stratégique + travail collaboratif + temps de cohésion."),
    Bullet("Présence attendue de tous, y compris full remote (pris en charge par Eventy)."),

    H2("7.3. Rituels hebdomadaires"),
    Bullet("Standup matinal court (15 min, lundi 9h30) : focus de la semaine."),
    Bullet("Démo produit tous les vendredis (30 min, 16h) : ce qui a été livré."),
    Bullet("Café du jeudi (45 min, 14h) : sujets libres, partage de lectures, retours."),

    H2("7.4. Événements de cohésion"),
    Bullet("Soirée d'équipe trimestrielle (restaurant, activité)."),
    Bullet("Anniversaires d'embauche célébrés (gâteau, mot du Président)."),
    Bullet("Anniversaire d'Eventy (juin) : événement annuel équipe + partenaires."),

    H1("8. Formation et développement"),
    Bullet("Budget formation : 2 % de la masse salariale a minima (cible 5 % en cible An 3)."),
    Bullet("Formations métier (tourisme, juridique, technique) prises en charge à 100 %."),
    Bullet("Formations transverses (langues, prise de parole, management) prises en charge selon plan de développement."),
    Bullet("Conférences professionnelles externes encouragées (1 à 2 jours / an, sur le temps de travail)."),

    H1("9. Santé et bien-être"),
    Bullet("Mutuelle d'entreprise : prise en charge à 70 % par Eventy."),
    Bullet("Médecine du travail : adhésion à un service de santé au travail interentreprises."),
    Bullet("Sensibilisation aux risques psycho-sociaux : module annuel (1h)."),
    Bullet("Référent harcèlement et discrimination : désigné à partir de 11 salariés (Code du travail)."),
    Bullet("Heures de méditation / sport : libre 1h/semaine sur le temps de travail."),

    H1("10. Évaluation et évolution"),
    Bullet("Revue annuelle de la présente charte (consultation des salariés)."),
    Bullet("Indicateurs : taux de satisfaction interne (cible ≥ 8/10), turnover (cible < 10 %), taux de présence aux séminaires."),
    Bullet("Modification possible par avenant écrit, après concertation collective."),

    H1("11. Engagements humains Eventy"),
    P("Au-delà du cadre légal, Eventy s'engage à :"),
    Bullet("Respecter la vie personnelle et l'équilibre de chaque collaborateur."),
    Bullet("Reconnaître la performance par la qualité du travail livré, pas par le temps passé visible."),
    Bullet("Développer chacun selon son potentiel, dans la durée."),
    Bullet("Construire une culture de confiance, de transparence et de proximité humaine."),
    Bullet("Maintenir une ouverture salariale équitable (rapport max/min ≤ 5)."),
    Bullet("Refuser tout comportement de pression, harcèlement ou discrimination."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique cybersécurité, Politique RSE (pilier social), Manuel des opérations quotidiennes, Politique accessibilité PMR.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PROCÉDURE DE RECRUTEMENT ET D'INTÉGRATION
// ============================================================
function procedureRecrutement() {
  return [
    bandeauTitre(
      "PROCÉDURE DE RECRUTEMENT ET D'INTÉGRATION",
      "Référentiel RH Eventy Life — du sourcing au 100ème jour",
    ),
    Spacer(160),

    P("La présente procédure formalise le processus de recrutement et d'intégration d'EVENTY LIFE SAS pour tous les collaborateurs salariés (CDI, CDD, alternance, stage). Elle vise à recruter les bons profils, dans le respect du droit du travail et de la non-discrimination, et à garantir une intégration réussie.", { italics: true }),

    P("Eventy se distingue par une politique de recrutement « humaine d'abord » : nous recrutons des personnes alignées avec l'âme d'Eventy avant tout. Les compétences techniques se forment ; les valeurs et la posture humaine sont des prérequis.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("Articles L1132-1 et L1133-1 du Code du travail — non-discrimination."),
    Bullet("Articles L1221-1 et suivants — formation du contrat de travail."),
    Bullet("Articles L1221-6 à L1221-9 — informations recueillies du candidat."),
    Bullet("Loi n° 78-17 du 6 janvier 1978 (Loi Informatique et Libertés) et RGPD."),
    Bullet("Recommandations Défenseur des droits sur le recrutement éthique."),

    H1("2. Critères de non-discrimination (rappel)"),
    P("Aucune décision de recrutement ne peut être fondée sur l'un des 25 critères discriminatoires (article L1132-1) :"),
    Bullet("Origine, sexe, mœurs, orientation sexuelle, identité de genre."),
    Bullet("Âge, situation de famille, grossesse."),
    Bullet("Caractéristiques génétiques, particulière vulnérabilité résultant de la situation économique."),
    Bullet("Appartenance ou non à une ethnie, une nation, une race, une religion."),
    Bullet("Apparence physique, nom de famille, lieu de résidence, domiciliation bancaire."),
    Bullet("État de santé, perte d'autonomie, handicap."),
    Bullet("Opinions politiques, activités syndicales ou mutualistes."),
    Bullet("Capacité à s'exprimer en français autre que celle requise."),

    H1("3. Étape 1 — Définition du besoin"),

    H2("3.1. Décision d'ouverture de poste"),
    Bullet("Validation par le Président de l'ouverture du poste (alignement budgétaire et stratégique)."),
    Bullet("Type de contrat : CDI prioritaire, CDD justifié uniquement (remplacement, projet daté), alternance pour postes en formation."),
    Bullet("Localisation : Paris (siège), full remote, ou hybride."),

    H2("3.2. Fiche de poste"),
    Bullet("Intitulé du poste."),
    Bullet("Mission et responsabilités principales (5 à 8 items)."),
    Bullet("Compétences et expériences attendues (must have / nice to have)."),
    Bullet("Soft skills attendus."),
    Bullet("Conditions (rémunération, horaires, télétravail, formation)."),
    Bullet("Validation de la fiche par le Président avant publication."),

    H2("3.3. Fourchette de rémunération"),
    Bullet("Fourchette définie en amont, basée sur les pratiques du marché et la grille interne."),
    Bullet("Transparence : la fourchette est communiquée dans l'annonce (politique de transparence salariale)."),
    Bullet("Pas de variable individuelle systématique — préférence pour le fixe + intéressement collectif."),

    H1("4. Étape 2 — Sourcing et diffusion"),

    H2("4.1. Canaux de diffusion"),
    Bullet("Page « carrières » sur eventylife.fr."),
    Bullet("LinkedIn (page Eventy + annonces ciblées)."),
    Bullet("Plateformes spécialisées (WelcomeToTheJungle, Indeed, Apec)."),
    Bullet("Plateformes spécialisées tourisme (Hospitality Insiders, etc.)."),
    Bullet("Réseau Eventy (partenaires, anciens voyageurs, ambassadeurs)."),
    Bullet("Pôle Emploi pour postes éligibles."),
    Bullet("Cabinets de recrutement spécialisés (postes seniors uniquement)."),

    H2("4.2. Programme de cooptation"),
    Bullet("Tout collaborateur peut recommander un candidat."),
    Bullet("Prime de cooptation : 1 000 € net si recrutement effectif et confirmation de période d'essai (2× pour postes seniors)."),
    Bullet("Aucune obligation de cooptation — programme volontaire."),

    H2("4.3. Annonce non-discriminatoire"),
    Bullet("Rédaction épicène (fonctions au masculin/féminin/neutre selon possibilité linguistique)."),
    Bullet("Pas d'âge, de critère de fluencyhebdomadaire/photo demandée."),
    Bullet("Mention « postes ouverts à toutes et tous » et « accessible aux personnes en situation de handicap »."),

    H1("5. Étape 3 — Sélection des candidatures"),

    H2("5.1. Tri initial"),
    Bullet("Tri par cohérence parcours / fiche de poste."),
    Bullet("Aucun tri sur photo, nom, âge ou autre critère discriminatoire."),
    Bullet("Réponse à toutes les candidatures sous 14 jours (mail personnalisé même si refus — courtoisie obligatoire)."),

    H2("5.2. Pré-sélection"),
    Bullet("Entretien téléphonique court (20-30 min) pour les candidats retenus en première lecture."),
    Bullet("Objectifs : valider la motivation, l'alignement valeurs, la fourchette de rémunération, les modalités."),
    Bullet("Compte-rendu standardisé partagé avec le manager."),

    H1("6. Étape 4 — Entretiens"),

    H2("6.1. Premier entretien — Manager"),
    Bullet("Durée 1h-1h15."),
    Bullet("Format : présentation entreprise (15 min), parcours candidat (20 min), questions techniques/métier (25 min), questions du candidat (15 min)."),
    Bullet("Grille d'évaluation standardisée (compétences techniques, soft skills, motivation, alignement valeurs)."),

    H2("6.2. Cas pratique (selon poste)"),
    Bullet("Pour les postes techniques, marketing, opérations : cas pratique remis 3 jours avant le second entretien."),
    Bullet("Durée maximum : 4 heures de travail (rémunéré à hauteur de 100 € minimum si > 2h)."),
    Bullet("Sujet réaliste, lié au quotidien du poste."),

    H2("6.3. Second entretien — Président + futur manager"),
    Bullet("Durée 1h."),
    Bullet("Restitution du cas pratique le cas échéant (30 min)."),
    Bullet("Approfondissement des soft skills, projection long terme, questions ouvertes."),
    Bullet("Présentation de l'âme d'Eventy, du collectif, du projet."),

    H2("6.4. Entretien équipe (optionnel)"),
    Bullet("Pour les profils retenus : déjeuner ou café avec 2-3 futurs collègues (1h)."),
    Bullet("Validation mutuelle de la cohésion."),
    Bullet("Retour de l'équipe pris en compte (mais le Président tranche)."),

    H1("7. Étape 5 — Décision et offre"),

    H2("7.1. Décision"),
    Bullet("Décision collégiale : Président + manager + retour équipe (poids consultatif)."),
    Bullet("Décision sous 7 jours après le dernier entretien."),
    Bullet("Communication du choix à tous les candidats interviewés (oui ou non)."),

    H2("7.2. Vérification des références"),
    Bullet("2 références professionnelles vérifiées avant offre formelle (avec accord du candidat)."),
    Bullet("Vérification des diplômes le cas échéant (postes nécessitant un diplôme particulier)."),

    H2("7.3. Promesse d'embauche"),
    Bullet("Email de promesse d'embauche détaillé : poste, rémunération, date de prise de fonction, période d'essai, condition (visite médicale, etc.)."),
    Bullet("Délai d'acceptation : 7 jours."),
    Bullet("Possibilité de rebriefing en cas de doute du candidat."),

    H2("7.4. Contrat de travail"),
    Bullet("Contrat envoyé sous 7 jours après acceptation."),
    Bullet("Mentions obligatoires : poste, lieu, durée, rémunération, convention collective applicable, période d'essai (avec préavis), modalités de télétravail (avenant)."),
    Bullet("Signature avant la prise de fonction effective."),

    H1("8. Étape 6 — Onboarding (J0 → J+30)"),

    H2("8.1. Préparation J-7 → J0"),
    Bullet("Préparation du matériel (PC, accès, badges)."),
    Bullet("Email de bienvenue avec programme premier jour."),
    Bullet("Information de l'équipe (présentation du nouvel arrivant à tous)."),
    Bullet("Désignation d'un parrain/marraine d'intégration (collaborateur ancien)."),

    H2("8.2. Premier jour J0"),
    Bullet("Accueil chaleureux par le Président (15 min)."),
    Bullet("Visite des locaux, présentation de l'équipe."),
    Bullet("Remise du kit Eventy : ordinateur, accès, livret d'accueil, goodies."),
    Bullet("Déjeuner offert avec l'équipe."),
    Bullet("Lecture de l'âme d'Eventy (AME-EVENTY.md) en duo avec le Président (45 min — discussion guidée)."),

    H2("8.3. Première semaine"),
    Bullet("Découverte de chaque pôle (1h par pôle/membre clé)."),
    Bullet("Lecture des documents fondateurs (CGV, statuts, politique RSE, manuel ops)."),
    Bullet("Module sécurité et RGPD (1h obligatoire)."),
    Bullet("Module conflits d'intérêts (15 min)."),
    Bullet("Premier point avec le manager direct (objectifs, rituels)."),

    H2("8.4. Premier mois"),
    Bullet("Plan d'objectifs concrets sur les 30/60/100 jours."),
    Bullet("Point hebdomadaire avec le manager."),
    Bullet("Participation à un voyage Eventy (en tant que voyageur ou observateur, selon poste) : essentiel pour la culture."),
    Bullet("Évaluation à mi-période d'essai (J+30 ou J+60 selon durée)."),

    H1("9. Étape 7 — Période d'essai et confirmation"),

    H2("9.1. Période d'essai"),
    Bullet("Durée : 2 mois (employés/techniciens), 3 mois (cadres), renouvelable une fois."),
    Bullet("Préavis en cas de rupture : 24h à 1 mois selon présence (article L1221-25)."),
    Bullet("Évaluation formelle à mi-période et en fin de période."),

    H2("9.2. Confirmation"),
    Bullet("Email officiel de confirmation."),
    Bullet("Communication à l'équipe."),
    Bullet("Premier entretien de développement à 6 mois."),

    H1("10. Indicateurs RH"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Délai moyen de recrutement (jours)", "≤ 60", "≤ 45"],
        ["Taux de réponse aux candidats", "100 %", "100 %"],
        ["Taux de cooptation", "≥ 20 %", "≥ 35 %"],
        ["Taux de validation de période d'essai", "≥ 90 %", "≥ 95 %"],
        ["NPS candidat (oui ou non retenu)", "≥ + 30", "≥ + 50"],
        ["Diversité des recrutements (parité H/F)", "≥ 40 %", "≥ 45 %"],
        ["Recrutements personnes en situation de handicap", "—", "≥ 6 %"],
      ],
    }),

    H1("11. Documents associés"),
    Bullet("Fiche de poste type."),
    Bullet("Grille d'évaluation entretien."),
    Bullet("Modèle de promesse d'embauche."),
    Bullet("Modèle de contrat CDI."),
    Bullet("Livret d'accueil Eventy."),
    Bullet("Programme onboarding 30/60/100 jours."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte télétravail, Modèle entretien annuel, Politique RSE (pilier social), Manuel des opérations quotidiennes.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — MODÈLE D'ENTRETIEN ANNUEL
// ============================================================
function modeleEntretienAnnuel() {
  return [
    bandeauTitre(
      "MODÈLE D'ENTRETIEN ANNUEL EVENTY LIFE",
      "Évaluation, développement et plan de progrès — référentiel équipe",
    ),
    Spacer(160),

    P("Ce modèle d'entretien annuel formalise la trame des entretiens individuels d'évaluation et de développement professionnel d'EVENTY LIFE SAS. Il s'inscrit dans une logique de bienveillance, de transparence et de progression, fidèle à l'âme d'Eventy.", { italics: true }),

    P("L'entretien annuel n'est pas un audit ; c'est un temps qualitatif de dialogue, de bilan et de projection. Il permet à chaque collaborateur de prendre du recul, de partager ses réussites et ses difficultés, et de construire son chemin professionnel chez Eventy.", { italics: true }),

    H1("1. Cadre et fréquence"),
    Bullet("Entretien annuel obligatoire pour tous les collaborateurs salariés (CDI et CDD ≥ 12 mois)."),
    Bullet("Entretien professionnel obligatoire (article L6315-1 du Code du travail) tous les 2 ans, et bilan tous les 6 ans."),
    Bullet("Le présent entretien fusionne entretien annuel + entretien professionnel pour simplifier le suivi."),
    Bullet("Période : entre le 1er janvier et le 31 mars de chaque année (bilan année écoulée, projection année en cours)."),
    Bullet("Durée : 1h30 minimum, dans un lieu calme, sans interruption."),

    H1("2. Préparation (collaborateur et manager)"),

    H2("2.1. Documents transmis 15 jours avant"),
    Bullet("La présente trame d'entretien annuel."),
    Bullet("Les objectifs de l'année écoulée (rappel)."),
    Bullet("Les évaluations intermédiaires de l'année (synthèse)."),
    Bullet("Le tableau de progression (compétences, formations suivies)."),

    H2("2.2. Préparation du collaborateur"),
    Bullet("Auto-évaluation des objectifs de l'année (atteints / partiellement / non atteints)."),
    Bullet("Identification des réussites et fiertés."),
    Bullet("Identification des difficultés rencontrées."),
    Bullet("Réflexion sur les besoins de développement (formation, mobilité, missions)."),
    Bullet("Vision à 1 an, 3 ans, 5 ans."),

    H2("2.3. Préparation du manager"),
    Bullet("Évaluation factuelle des objectifs (avec exemples concrets)."),
    Bullet("Identification des points forts et axes de progrès observés."),
    Bullet("Pistes de développement, missions à proposer."),
    Bullet("Évaluation de la rémunération (équité interne et externe)."),

    H1("3. Trame d'entretien (1h30)"),

    H2("3.1. Ouverture (5 min)"),
    Bullet("Salutation chaleureuse, environnement détendu."),
    Bullet("Rappel des objectifs de l'entretien : bilan, dialogue, projection."),
    Bullet("Cadre confidentiel, écoute mutuelle."),

    H2("3.2. Bilan de l'année écoulée (30 min)"),
    Bullet("Auto-évaluation par le collaborateur (objectifs, missions, réussites, difficultés)."),
    Bullet("Évaluation du manager (avec exemples concrets, sans jugement personnel)."),
    Bullet("Échange sur les écarts éventuels d'évaluation."),
    Bullet("Identification des facteurs de réussite et de difficulté (internes et externes)."),

    H2("3.3. Évaluation des compétences (15 min)"),
    P("Échelle d'évaluation à 5 niveaux pour chaque compétence clé du poste :"),
    Bullet("Niveau 1 — En cours d'apprentissage."),
    Bullet("Niveau 2 — Compétence en construction."),
    Bullet("Niveau 3 — Maîtrise opérationnelle."),
    Bullet("Niveau 4 — Maîtrise avancée — capacité à transmettre."),
    Bullet("Niveau 5 — Expertise — référent dans l'organisation."),
    P("Compétences évaluées (à adapter au poste) :"),
    Bullet("Compétences techniques métier."),
    Bullet("Communication écrite et orale."),
    Bullet("Travail en équipe et collaboration."),
    Bullet("Autonomie et prise d'initiative."),
    Bullet("Capacité d'adaptation."),
    Bullet("Sens client (voyageur, partenaire)."),
    Bullet("Alignement avec les valeurs Eventy."),

    H2("3.4. Bien-être et motivation (10 min)"),
    Bullet("Comment te sens-tu chez Eventy ?"),
    Bullet("Quel est ton niveau d'énergie / de motivation actuel ?"),
    Bullet("Y a-t-il des éléments qui t'apportent de la fatigue ou de la frustration ?"),
    Bullet("Qu'est-ce qui te donne le plus d'énergie au quotidien ?"),
    Bullet("Y a-t-il un sujet que tu n'oses pas aborder en temps normal ?"),

    H2("3.5. Projection — année en cours et au-delà (20 min)"),
    Bullet("Définition des objectifs de l'année en cours (3 à 5 objectifs SMART)."),
    Bullet("Identification des missions / projets souhaités."),
    Bullet("Vision à 1 an : où veux-tu être professionnellement ?"),
    Bullet("Vision à 3-5 ans : aspirations long terme (chez Eventy ou ailleurs)."),
    Bullet("Souhaits de mobilité interne (poste, géographie, périmètre)."),

    H2("3.6. Plan de développement (10 min)"),
    Bullet("Formations souhaitées (techniques, transverses, certifiantes)."),
    Bullet("Conférences, événements professionnels."),
    Bullet("Coaching ou mentorat éventuel."),
    Bullet("Lectures, ressources auto-formation."),
    Bullet("Validation du budget formation par le manager (cohérence avec budget RH)."),

    H2("3.7. Rémunération (5 min)"),
    Bullet("Discussion sur la rémunération actuelle."),
    Bullet("Évaluation par le manager d'une éventuelle évolution."),
    Bullet("Communication transparente sur la grille interne et les pratiques marché."),
    Bullet("Décision et calendrier (révision en avril chaque année)."),

    H2("3.8. Clôture (5 min)"),
    Bullet("Synthèse partagée des points abordés."),
    Bullet("Formalisation des objectifs et du plan de développement."),
    Bullet("Date du prochain point de mi-année (juillet)."),
    Bullet("Signature des deux parties sur la fiche de synthèse."),

    H1("4. Fiche de synthèse (à compléter en fin d'entretien)"),
    makeTable({
      widths: [4680, 4680],
      header: ["Rubrique", "Synthèse"],
      rows: [
        ["Bilan global de l'année écoulée", "[3 points clés]"],
        ["Atteinte des objectifs (% pondéré)", "[X %]"],
        ["3 réussites majeures", "[Liste]"],
        ["3 axes de progrès identifiés", "[Liste]"],
        ["Compétences évaluées (synthèse)", "[Niveau moyen et points saillants]"],
        ["Niveau de bien-être / motivation (1-10)", "[X / 10 — commentaire]"],
        ["Objectifs année en cours (3-5)", "[Liste SMART]"],
        ["Plan de développement (3 actions)", "[Formations, missions, mobilité]"],
        ["Décision rémunération", "[Maintien / +X % / Variable]"],
        ["Date du prochain point", "[JJ/MM/AAAA]"],
      ],
    }),

    H1("5. Suite et suivi"),

    H2("5.1. Bilan partagé"),
    Bullet("La fiche de synthèse est partagée par email sous 7 jours."),
    Bullet("Le collaborateur dispose de 14 jours pour faire des remarques ou compléter."),
    Bullet("Validation finale : signature électronique des deux parties."),

    H2("5.2. Mise à disposition des moyens"),
    Bullet("Inscription aux formations sous 30 jours après l'entretien."),
    Bullet("Communication des changements de mission ou de poste à l'équipe."),
    Bullet("Communication de la décision de rémunération sous 30 jours."),

    H2("5.3. Point de mi-année (juillet)"),
    Bullet("30 minutes de revue intermédiaire."),
    Bullet("Avancement des objectifs."),
    Bullet("Avancement du plan de développement."),
    Bullet("Ajustements si nécessaire."),

    H1("6. Cas particuliers"),

    H2("6.1. Désaccord sur l'évaluation"),
    Bullet("Le collaborateur peut demander un entretien complémentaire avec le Président."),
    Bullet("Possibilité de mentionner un désaccord formel sur la fiche de synthèse."),
    Bullet("Aucune représaille ne peut être prise pour un désaccord exprimé loyalement."),

    H2("6.2. Difficultés professionnelles avérées"),
    Bullet("Plan d'accompagnement renforcé (PIP — Performance Improvement Plan)."),
    Bullet("Objectifs précis sur 3 mois, points hebdomadaires, formation/coaching dédiés."),
    Bullet("Bilan à 3 mois — décision de continuer, prolonger, ou envisager une rupture amiable."),

    H2("6.3. Mobilité interne souhaitée"),
    Bullet("Étude de la faisabilité par le Président."),
    Bullet("Candidature interne traitée en priorité sur les recrutements externes."),
    Bullet("Période de découverte possible (2 semaines en doublon)."),

    H1("7. Engagements éthiques de l'entretien"),
    Bullet("Confidentialité absolue des échanges."),
    Bullet("Évaluation factuelle, jamais personnelle."),
    Bullet("Égalité de traitement, refus de toute discrimination."),
    Bullet("Liberté d'expression du collaborateur."),
    Bullet("Suivi effectif des engagements pris (rémunération, formation, mission)."),
    Bullet("Pas de surprise majeure : tout sujet abordé en entretien doit avoir été évoqué auparavant en cours d'année."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte télétravail, Procédure de recrutement, Politique RSE (pilier social), Manuel des opérations quotidiennes.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Teletravail.docx",
      title: "Eventy Life — Charte télétravail et organisation interne",
      description: "Charte du télétravail et organisation hybride Eventy Life.",
      footer: "EVENTY LIFE SAS — Charte télétravail",
      children: charteTeletravail(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Recrutement.docx",
      title: "Eventy Life — Procédure de recrutement et d'intégration",
      description: "Procédure RH du sourcing à l'intégration des collaborateurs.",
      footer: "EVENTY LIFE SAS — Procédure recrutement et intégration",
      children: procedureRecrutement(),
    },
    {
      file: "docs/garanties/Eventy-Life-Modele-Entretien-Annuel.docx",
      title: "Eventy Life — Modèle d'entretien annuel",
      description: "Trame d'entretien annuel et plan de développement Eventy Life.",
      footer: "EVENTY LIFE SAS — Modèle entretien annuel",
      children: modeleEntretienAnnuel(),
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
