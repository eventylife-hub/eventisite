/**
 * Eventy Life — Trois guides d'utilisation des portails partenaires
 *
 *   1. Guide utilisation portail créateur
 *   2. Guide utilisation portail vendeur
 *   3. Guide utilisation portail HRA (Hôtel-Restaurant-Activité)
 *
 * Usage : node scripts/garanties/build-guides-portails-createur-vendeur-hra.js
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
// DOCUMENT 1 — GUIDE PORTAIL CRÉATEUR
// ============================================================
function guidePortailCreateur() {
  return [
    bandeauTitre(
      "GUIDE UTILISATION PORTAIL CRÉATEUR EVENTY",
      "Mode d'emploi pas-à-pas pour les créateurs de voyages",
    ),
    Spacer(160),

    P("Ce guide accompagne les créateurs partenaires d'EVENTY LIFE SAS dans l'utilisation de leur portail dédié. Il complète le Contrat créateur, la Méthodologie de création de voyage, et la Procédure de sourcing HRA — il en est l'expression opérationnelle au quotidien.", { italics: true }),

    P("Le portail créateur est ton outil de travail principal : tu y conçois tes voyages, tu suis leur commercialisation, tu pilotes les voyages en cours, et tu encaisses tes rémunérations (marge HRA + 3 points + 5 % HT vendeur si tu vends aussi). Il est sobre, rapide, conçu pour ton confort.", { italics: true }),

    H1("1. Accès et premiers pas"),

    H2("1.1. Connexion"),
    Bullet("URL : eventylife.fr/portail-createur."),
    Bullet("Identifiants : email + mot de passe (12 caractères minimum)."),
    Bullet("MFA obligatoire (cohérence Politique cybersécurité)."),
    Bullet("Première connexion : guide d'accueil de 15 min (vidéo + checklist)."),

    H2("1.2. Tableau de bord d'accueil"),
    Bullet("Vue synthétique : voyages en cours, voyages à venir, retours voyageurs récents."),
    Bullet("Indicateurs clés : voyages actifs, voyageurs en attente, NPS moyen, rémunération en cours."),
    Bullet("Actions rapides : créer un voyage, voir les commandes, contacter Eventy."),

    H1("2. Créer un voyage"),

    H2("2.1. Préparation"),
    Bullet("Avoir validé le cadrage avec le Président Eventy (cohérence Méthodologie de création de voyage)."),
    Bullet("Disposer du dossier voyage (logistique, HRA partenaires, programme)."),
    Bullet("Avoir validé le tarif (cohérence modèle PDG : marge socle ~8 % HT + 3 pts créateur)."),

    H2("2.2. Étapes de création"),
    Numbered("Onglet « Mes voyages » → bouton « Créer un voyage »."),
    Numbered("Renseigner les informations générales (titre, destination, durée, période)."),
    Numbered("Composer le programme jour par jour (interface intuitive)."),
    Numbered("Associer les HRA partenaires depuis le panel (cohérence Procédure de sourcing HRA)."),
    Numbered("Définir la décomposition tarifaire (transparence Eventy)."),
    Numbered("Téléverser photos et vidéo (≥ 8 photos haute définition)."),
    Numbered("Renseigner les SEO (title, meta description, mots-clés)."),
    Numbered("Indiquer les niveaux d'accessibilité PMR et émissions CO2eq estimées."),
    Numbered("Soumettre pour validation Eventy."),

    H2("2.3. Validation"),
    Bullet("Validation Président + un membre équipe sous 7 jours ouvrés."),
    Bullet("Retours via le portail (commentaires sur la fiche)."),
    Bullet("Itérations possibles (modifications, ajustements)."),
    Bullet("Une fois validé : publication progressive (Famille J-30 puis grand public)."),

    H1("3. Gérer les HRA"),

    H2("3.1. Panel HRA"),
    Bullet("Onglet « Mes HRA » : liste de tes partenaires HRA."),
    Bullet("Pour chaque HRA : statut, contrat actif, audits, NPS voyageurs."),
    Bullet("Possibilité de proposer de nouveaux HRA via le formulaire dédié."),
    Bullet("Suivi des audits récurrents (cohérence Procédure d'audit qualité HRA)."),

    H2("3.2. Onboarding d'un nouveau HRA"),
    Bullet("Pré-qualification téléphonique (5 min, trame 5 questions)."),
    Bullet("Création de la fiche dans le portail."),
    Bullet("Validation Eventy après audit."),
    Bullet("Activation du contrat HRA Partenaire."),
    Bullet("Cohérence avec Procédure de sourcing HRA."),

    H1("4. Suivre les voyages en cours"),

    H2("4.1. Pré-départ"),
    Bullet("J-60 : bilan commercial. Vérification atteinte seuil minimal (4 voyageurs)."),
    Bullet("J-30 : reconfirmation HRA et transporteurs depuis le portail."),
    Bullet("J-7 : préparation finale (roadbook voyageurs, briefing accompagnateur)."),

    H2("4.2. Pendant le voyage"),
    Bullet("Tableau de bord temps réel : statut voyageurs, météo destination, alertes."),
    Bullet("Communication avec l'accompagnateur (Whatsapp + portail)."),
    Bullet("Alerte automatique en cas d'incident signalé (cohérence Manuel d'incident voyage)."),

    H2("4.3. Retour"),
    Bullet("Recueil automatique des avis voyageurs."),
    Bullet("Calcul automatique du NPS du voyage."),
    Bullet("Débrief accompagnateur disponible J+3."),
    Bullet("Versement automatique de tes marges (3 pts HT) sous 48 h après retour."),

    H1("5. Ta rémunération"),

    H2("5.1. Marge créateur (3 pts HT sur HRA)"),
    Bullet("Calculée automatiquement sur les prestations HRA refacturées."),
    Bullet("Visible dans l'onglet « Ma rémunération »."),
    Bullet("Versée sous 48 h après le retour de chaque voyage."),

    H2("5.2. Cumul vendeur (5 % HT)"),
    Bullet("Si tu vends également un voyage à un voyageur (avec ton code parrain), tu touches 5 % HT supplémentaires."),
    Bullet("Cumulable avec le 3 pts HT créateur."),
    Bullet("Visible séparément dans l'onglet rémunération."),

    H2("5.3. Forfait accompagnement (si applicable)"),
    Bullet("Si tu accompagnes le voyage (en plus de l'avoir créé), tu touches un forfait accompagnement séparé."),
    Bullet("Montant fixé au contrat (cohérence Contrat créateur)."),

    H2("5.4. Facturation et paiement"),
    Bullet("Facturation mensuelle automatique (synthèse de tes rémunérations)."),
    Bullet("Versement par virement (compte bancaire défini dans ton profil)."),
    Bullet("Justificatifs téléchargeables au format PDF."),

    H1("6. Statistiques et performance"),
    Bullet("NPS moyen de tes voyages."),
    Bullet("Taux de remplissage moyen."),
    Bullet("Marge brute moyenne."),
    Bullet("Voyages renouvelés saison suivante."),
    Bullet("Évolution mensuelle / trimestrielle."),
    Bullet("Comparaison avec moyenne créateurs Eventy (anonymisé)."),

    H1("7. Communication interne"),
    Bullet("Messagerie intégrée avec l'équipe Eventy."),
    Bullet("Réponse Eventy sous 24 h ouvrées."),
    Bullet("Tickets pour problèmes techniques (suivi statut)."),
    Bullet("Forum créateurs (lecture, échanges entre créateurs Eventy)."),
    Bullet("Réunion trimestrielle créateurs (visio 1 h)."),

    H1("8. Support et formation"),

    H2("8.1. Formation continue"),
    Bullet("Module annuel de rappel (1 journée, prise en charge Eventy)."),
    Bullet("Webinaires thématiques mensuels (60 min)."),
    Bullet("Formation à toute nouvelle fonctionnalité du portail."),

    H2("8.2. Documentation interne"),
    Bullet("Centre d'aide intégré (recherche, articles thématiques)."),
    Bullet("Vidéos tutorielles."),
    Bullet("Documents de référence (Méthodologie, Charte qualité, etc.)."),

    H2("8.3. Contact"),
    Bullet("Email dédié : createur@eventylife.fr."),
    Bullet("Téléphone direct : [À compléter]."),
    Bullet("Réponse sous 24 h ouvrées (4 h pour urgences voyage en cours)."),

    H1("9. Bonnes pratiques"),
    Bullet("Mettre à jour ses voyages saisonnellement (photos, programme, prix)."),
    Bullet("Répondre aux avis voyageurs sous 7 jours (cohérence Politique avis voyageurs)."),
    Bullet("Documenter rigoureusement chaque retour de voyage."),
    Bullet("Anticiper les besoins (lancement voyage T-3 mois minimum)."),
    Bullet("Faire des audits inopinés réguliers chez ses HRA."),
    Bullet("Maintenir la confidentialité des données voyageurs (cohérence RGPD)."),

    H1("10. Erreurs à éviter"),
    Bullet("Promettre des prestations non confirmées par les HRA."),
    Bullet("Lancer un voyage sans validation Eventy."),
    Bullet("Modifier le programme sans concertation."),
    Bullet("Décaler un voyage sans information voyageurs."),
    Bullet("Proposer des prestations en dehors du modèle PDG."),
    Bullet("Communiquer hors charte éditoriale Eventy."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour à chaque évolution majeure du portail.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Contrat créateur, Méthodologie de création de voyage, Procédure de sourcing HRA, Procédure d'audit qualité HRA, Onboarding partenaires, Politique cybersécurité, Manuel d'incident voyage.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — GUIDE PORTAIL VENDEUR
// ============================================================
function guidePortailVendeur() {
  return [
    bandeauTitre(
      "GUIDE UTILISATION PORTAIL VENDEUR EVENTY",
      "Mode d'emploi du portail commercial pour vendeurs Eventy",
    ),
    Spacer(160),

    P("Ce guide accompagne les vendeurs Eventy (créateurs, ambassadeurs, influenceurs, partageants HRA, indépendants) dans l'utilisation de leur portail dédié. Il complète le Contrat vendeur, l'Argumentaire commercial vendeurs, et le Code de conduite ambassadeurs.", { italics: true }),

    P("Le portail vendeur est l'outil qui te permet de placer des voyages Eventy auprès de ton réseau et de toucher 5 % HT du CA voyage placé. Il est conçu pour être simple, rapide, et utilisable sur mobile et desktop sans formation préalable.", { italics: true }),

    H1("1. Accès et premiers pas"),

    H2("1.1. Connexion"),
    Bullet("URL : eventylife.fr/portail-vendeur."),
    Bullet("Identifiants : email + mot de passe."),
    Bullet("MFA obligatoire (cohérence Politique cybersécurité)."),
    Bullet("Premier login : tutoriel 10 min (vidéo + démonstration interactive)."),

    H2("1.2. Tableau de bord"),
    Bullet("Vue rapide : conversions du mois, commissions cumulées, classement (anonymisé)."),
    Bullet("Actions rapides : copier code parrain, voir les voyages tendance, partager."),
    Bullet("Notifications : nouvelle conversion, paiement de commission, message Eventy."),

    H1("2. Code parrainage personnel"),

    H2("2.1. Format et utilisation"),
    Bullet("Code unique nominatif : EVENTY-[NOM]-[ANNÉE]."),
    Bullet("Lien tracé : eventylife.fr/?ref=[TON-CODE]."),
    Bullet("À partager sur tes canaux (réseaux sociaux, email, conversations)."),
    Bullet("Le filleul saisit le code à la réservation pour bénéficier de 10 % de remise."),

    H2("2.2. Reporting"),
    Bullet("Suivi en temps réel : clics sur le lien, conversions, panier moyen."),
    Bullet("Tunnel : visiteurs → réservations → conversions confirmées."),
    Bullet("Identification anonymisée des sources (réseaux sociaux, email, autre)."),

    H1("3. Catalogue commercial"),

    H2("3.1. Voyages disponibles"),
    Bullet("Tous les voyages publiés sur eventylife.fr."),
    Bullet("Filtres : destination, durée, prix, période."),
    Bullet("Voyages à promouvoir cette semaine (highlights Eventy)."),
    Bullet("Voyages tendance (engagement social élevé)."),

    H2("3.2. Fiches commerciales"),
    Bullet("Pour chaque voyage : fiche commerciale détaillée à partager."),
    Bullet("Photo HD, programme, points forts, prix."),
    Bullet("Argumentaire prêt à l'emploi (cohérence Argumentaire vendeurs)."),
    Bullet("Témoignages voyageurs."),

    H2("3.3. Kit de partage"),
    Bullet("Visuels Instagram, Facebook, TikTok préformatés."),
    Bullet("Vidéos courtes prêtes à partager (15-90 sec)."),
    Bullet("Templates email personnalisables."),
    Bullet("Liens UTM intégrant ton code parrain (tracking)."),

    H1("4. Suivre tes ventes"),

    H2("4.1. Tableau ventes"),
    Bullet("Liste des conversions (filleul, voyage réservé, montant, date)."),
    Bullet("Statut : réservation confirmée, voyage en cours, voyage retourné, commission versée."),
    Bullet("Filtres temporels (semaine, mois, trimestre)."),

    H2("4.2. Reporting détaillé"),
    Bullet("CA voyage placé."),
    Bullet("Commission générée (5 % HT)."),
    Bullet("Panier moyen vendu."),
    Bullet("Taux de conversion."),
    Bullet("NPS des voyageurs ramenés."),

    H1("5. Ta rémunération"),

    H2("5.1. Calcul automatique"),
    Bullet("5 % HT du CA voyage placé."),
    Bullet("Calcul automatique au moment de la réservation."),
    Bullet("Validation au retour effectif du voyage."),

    H2("5.2. Versement"),
    Bullet("Versement par Stripe Connect ou virement, sous 21 jours après le retour de voyage."),
    Bullet("Commission cumulée affichée en temps réel."),
    Bullet("Justificatif PDF téléchargeable mensuellement."),

    H2("5.3. Cumul créateur (si applicable)"),
    Bullet("Si tu es également créateur (et ton voyage est vendu), tu touches en plus 3 pts HT créateur."),
    Bullet("Cumul total possible : 5 % vendeur + 3 % créateur."),

    H1("6. Outils de communication"),
    Bullet("Newsletter mensuelle vendeurs (5-10 min de lecture)."),
    Bullet("Lancements de nouveaux voyages communiqués en avant-première."),
    Bullet("Webinaires trimestriels (60 min, performance + nouveautés)."),
    Bullet("Forum vendeurs (entraide, partage de bonnes pratiques)."),

    H1("7. Performance et classements"),

    H2("7.1. Tes indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible débutant", "Cible confirmé"],
      rows: [
        ["Conversions / mois", "≥ 1", "≥ 5"],
        ["Panier moyen", "≥ 700 €", "≥ 850 €"],
        ["NPS filleuls", "≥ + 60", "≥ + 70"],
        ["Re-réservation parrainée", "≥ 15 %", "≥ 30 %"],
        ["Commissions / mois", "≥ 100 €", "≥ 1 000 €"],
      ],
    }),

    H2("7.2. Classements (optionnel et anonymisés)"),
    Bullet("Top vendeurs du mois (anonymisés sauf accord)."),
    Bullet("Progression vs mois précédent."),
    Bullet("Pas d'esprit de compétition agressif (cohérence âme Eventy)."),

    H1("8. Statut et progression"),
    Bullet("Vendeur Débutant (0-12 mois) — accompagnement renforcé."),
    Bullet("Vendeur Actif (≥ 12 mois, ≥ 12 conversions) — bonus saisonnier."),
    Bullet("Vendeur Confirmé (≥ 24 mois, ≥ 50 conversions) — invitations événements VIP."),
    Bullet("Vendeur Eventy Légende (≥ 36 mois, ≥ 200 conversions) — partenariat élargi."),

    H1("9. Engagement éthique vendeur"),
    Bullet("Représenter Eventy avec sincérité (cohérence Argumentaire vendeurs)."),
    Bullet("Refuser toute pratique commerciale agressive ou trompeuse."),
    Bullet("Signaler tout problème ou inquiétude voyageur immédiatement."),
    Bullet("Respecter la procédure de signalement / lanceurs d'alerte."),
    Bullet("Confidentialité absolue des données voyageurs (cohérence RGPD)."),
    Bullet("Refus systématique du partage avec un concurrent direct."),

    H1("10. Support et formation"),
    Bullet("Formation initiale 1 journée à l'inscription (cohérence Onboarding partenaires)."),
    Bullet("Module rappel annuel obligatoire (3 h, en visio)."),
    Bullet("Webinaires mensuels."),
    Bullet("Email dédié : vendeur@eventylife.fr."),
    Bullet("Téléphone direct : [À compléter]."),
    Bullet("Réponse sous 24 h ouvrées."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour à chaque évolution majeure du portail.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Contrat vendeur, Argumentaire commercial vendeurs, Kit ambassadeur, Code de conduite ambassadeurs, Programme fidélisation Eventy Famille, Politique cybersécurité, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — GUIDE PORTAIL HRA
// ============================================================
function guidePortailHRA() {
  return [
    bandeauTitre(
      "GUIDE UTILISATION PORTAIL HRA EVENTY",
      "Mode d'emploi pour Hôtels, Restaurants et sites d'Activité partenaires",
    ),
    Spacer(160),

    P("Ce guide accompagne les partenaires HRA (Hôtels, Restaurants, Activités) d'EVENTY LIFE SAS dans l'utilisation de leur portail dédié. Il complète le Contrat HRA Partenaire, la Charte fournisseurs, et la Procédure d'audit qualité HRA — il en est la traduction opérationnelle au quotidien.", { italics: true }),

    P("Le portail HRA est ton outil de coordination avec Eventy : tu y reçois les commandes des voyages Eventy, tu confirmes la disponibilité, tu suis tes facturations, et tu accèdes à tes statistiques. Il est conçu pour être simple, rapide, utilisable même sans grande aisance technique.", { italics: true }),

    H1("1. Accès et premiers pas"),

    H2("1.1. Connexion"),
    Bullet("URL : eventylife.fr/maisons."),
    Bullet("Identifiants : email + mot de passe (12 caractères minimum)."),
    Bullet("MFA obligatoire (cohérence Politique cybersécurité)."),
    Bullet("Compte créé après signature du Contrat HRA Partenaire."),

    H2("1.2. Tableau de bord d'accueil"),
    Bullet("Commandes en cours (à confirmer, à honorer prochainement)."),
    Bullet("Calendrier des voyages prévus dans ton établissement."),
    Bullet("Indicateurs : taux d'occupation Eventy, NPS voyageurs, factures à régler."),
    Bullet("Notifications : nouvelle commande, audit programmé, message Eventy."),

    H1("2. Profil de l'établissement"),

    H2("2.1. Onglet « Mon établissement »"),
    Bullet("Identité (raison sociale, SIREN, adresse, contact principal)."),
    Bullet("Description (services, spécialités, capacité d'accueil)."),
    Bullet("Photos haute définition (≥ 8, mises à jour annuelles recommandées)."),
    Bullet("Labels et certifications (Clef Verte, Écolabel, Tourisme et Handicap, Maître Restaurateur)."),
    Bullet("Fiches techniques (chambres, menus, activités, tarifs négociés)."),

    H2("2.2. Disponibilités et calendrier"),
    Bullet("Calendrier de disponibilité (à mettre à jour mensuellement)."),
    Bullet("Périodes de fermeture annuelles."),
    Bullet("Saisonnalité tarifaire (haute / moyenne / basse saison)."),
    Bullet("Nombre maximum de voyageurs Eventy par période."),

    H2("2.3. Engagement RSE"),
    Bullet("Engagement RSE volontaire (cohérence Charte fournisseurs)."),
    Bullet("Diagnostic énergétique (DPE)."),
    Bullet("Politique déchets, eau, économies d'énergie."),
    Bullet("Approvisionnement local (restaurants)."),

    H1("3. Recevoir et confirmer une commande"),

    H2("3.1. Réception"),
    Bullet("Notification email + alerte sur portail à chaque nouvelle commande."),
    Bullet("Détail : voyage Eventy concerné, dates, nombre de voyageurs, prestations attendues."),
    Bullet("Délai de confirmation : sous 7 jours ouvrés (idéalement 48 h)."),

    H2("3.2. Confirmation"),
    Bullet("Boutons « Confirmer » / « Demander des informations » / « Refuser »."),
    Bullet("Possibilité d'ajouter des notes opérationnelles (besoins spécifiques voyageurs, allergies)."),
    Bullet("Bon de commande HRA généré automatiquement (cohérence Bon de Commande HRA)."),

    H2("3.3. Modifications"),
    Bullet("Modifications mineures (nombre voyageurs ± 3) acceptées sous 7 j avant arrivée."),
    Bullet("Modifications majeures : concertation avec Eventy."),
    Bullet("Annulation par Eventy : délais et conditions cohérents avec contrat HRA."),

    H1("4. Pendant le voyage"),

    H2("4.1. Liste des voyageurs"),
    Bullet("Liste nominative reçue J-7 avant l'arrivée (cohérence RGPD : finalité opérationnelle uniquement)."),
    Bullet("Besoins spécifiques signalés (allergies, mobilité, animaux d'assistance)."),
    Bullet("Suppression automatique des données après le voyage (durée légale comptable conservée séparément)."),

    H2("4.2. Communication accompagnateur"),
    Bullet("Coordonnées de l'accompagnateur Eventy reçues J-7."),
    Bullet("Application messagerie ou WhatsApp pour la coordination quotidienne."),
    Bullet("Procédure incident en cas de problème (cohérence Manuel d'incident voyage)."),

    H1("5. Facturation et paiement"),

    H2("5.1. Émission des factures"),
    Bullet("Facture émise par toi à l'attention d'Eventy après prestation effectuée."),
    Bullet("Mentions obligatoires : SIREN, TVA si applicable, références voyage Eventy, détail prestations."),
    Bullet("Téléversement via portail (PDF) ou envoi email."),

    H2("5.2. Conditions de paiement"),
    Bullet("Paiement à 30 jours fin de mois maximum (LME)."),
    Bullet("Paiement à 15 jours pour micro-entreprises locales (engagement Eventy renforcé)."),
    Bullet("Versement par virement (RIB enregistré dans le profil)."),
    Bullet("Aucun retard injustifié toléré chez Eventy (cohérence Politique d'achats responsables)."),

    H2("5.3. Suivi"),
    Bullet("Tableau factures émises / payées."),
    Bullet("Échéancier prévisionnel."),
    Bullet("Rappels automatiques en cas de retard."),

    H1("6. Audits et qualité"),

    H2("6.1. Audit annuel"),
    Bullet("Audit qualité annuel programmé via le portail (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Préparation : checklist communiquée 7 jours avant."),
    Bullet("Restitution : note + recommandations."),
    Bullet("Plan d'amélioration personnalisé si note < 3,5 / 5."),

    H2("6.2. NPS voyageurs"),
    Bullet("NPS spécifique à ton établissement, calculé après chaque voyage."),
    Bullet("Verbatim positifs et négatifs (anonymisés)."),
    Bullet("Évolution dans le temps."),
    Bullet("Comparaison avec moyenne HRA Eventy (anonymisé)."),

    H2("6.3. Voyageurs-mystères (An 2-3)"),
    Bullet("Programme de voyageurs-mystères évaluant ponctuellement."),
    Bullet("Feedback intégré au tableau de bord."),

    H1("7. Statistiques et performance"),
    Bullet("Voyageurs Eventy accueillis (cumul + tendance)."),
    Bullet("CA Eventy généré."),
    Bullet("Taux d'occupation Eventy / occupation totale."),
    Bullet("Retours voyageurs."),
    Bullet("Saisonnalité observée."),

    H1("8. Communication avec Eventy"),

    H2("8.1. Messagerie"),
    Bullet("Messagerie intégrée pour échanger avec l'équipe Eventy."),
    Bullet("Réponse Eventy sous 24 h ouvrées."),
    Bullet("Tickets pour problèmes techniques."),

    H2("8.2. Réunions et événements"),
    Bullet("Réunion partenaires HRA annuelle (visio ou présentiel)."),
    Bullet("Newsletters trimestrielles (5-10 min de lecture)."),
    Bullet("Forum HRA partenaires (entraide, bonnes pratiques)."),

    H1("9. Bonnes pratiques"),
    Bullet("Mettre à jour le calendrier de disponibilité chaque mois."),
    Bullet("Confirmer les commandes sous 48 h."),
    Bullet("Communiquer rapidement en cas d'incident."),
    Bullet("Maintenir la qualité de service constante."),
    Bullet("Encourager les voyageurs à donner un avis (cohérence Politique avis voyageurs)."),
    Bullet("Renouveler les photos annuellement."),

    H1("10. Support et contact"),
    Bullet("Email dédié : maisons@eventylife.fr."),
    Bullet("Téléphone direct : [À compléter]."),
    Bullet("Centre d'aide intégré (recherche, articles)."),
    Bullet("Réponse sous 24 h ouvrées (4 h pour urgences voyage en cours)."),

    H1("11. Engagements opposables Eventy envers les HRA"),
    Bullet("Paiement à 30 jours fin de mois sans retard injustifié."),
    Bullet("Information transparente sur les commandes (jamais surprise)."),
    Bullet("Audit qualité avec restitution et plan d'amélioration."),
    Bullet("Refus des pratiques d'achat extractives (marges raisonnables)."),
    Bullet("Confidentialité absolue des informations partenaires."),
    Bullet("Refus de toute pratique de corruption ou favoritisme (cohérence Politique anti-corruption)."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour à chaque évolution majeure du portail.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Contrat HRA Partenaire, Charte fournisseurs, Procédure d'audit qualité HRA, Procédure de sourcing HRA, Politique d'achats responsables, Bon de Commande HRA, Politique cybersécurité, Politique RGPD, Politique anti-corruption.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Guide-Portail-Createur.docx",
      title: "Eventy Life — Guide utilisation portail créateur",
      description: "Mode d'emploi pas-à-pas du portail créateur Eventy.",
      footer: "EVENTY LIFE SAS — Guide portail créateur",
      children: guidePortailCreateur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Guide-Portail-Vendeur.docx",
      title: "Eventy Life — Guide utilisation portail vendeur",
      description: "Mode d'emploi pas-à-pas du portail vendeur Eventy.",
      footer: "EVENTY LIFE SAS — Guide portail vendeur",
      children: guidePortailVendeur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Guide-Portail-HRA.docx",
      title: "Eventy Life — Guide utilisation portail HRA",
      description: "Mode d'emploi pas-à-pas du portail HRA partenaires Eventy.",
      footer: "EVENTY LIFE SAS — Guide portail HRA",
      children: guidePortailHRA(),
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
