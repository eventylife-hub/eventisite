/**
 * Eventy Life — Trois documents méthodologie produit
 *
 *   1. Méthodologie de création de voyage Eventy
 *   2. Procédure de sourcing et qualification HRA
 *   3. Grille de décision destinations (sélection / écartement)
 *
 * Usage : node scripts/garanties/build-methodologie-creation-sourcing-destinations.js
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
// DOCUMENT 1 — MÉTHODOLOGIE DE CRÉATION DE VOYAGE
// ============================================================
function methodologieCreationVoyage() {
  return [
    bandeauTitre(
      "MÉTHODOLOGIE DE CRÉATION DE VOYAGE EVENTY",
      "De l'idée à la mise en ligne — référentiel des créateurs",
    ),
    Spacer(160),

    P("La présente méthodologie formalise le processus de création d'un voyage Eventy, depuis l'idée initiale jusqu'à la publication sur eventylife.fr. Elle s'adresse aux créateurs partenaires d'Eventy et à l'équipe interne, et garantit la cohérence qualitative, économique et éthique de chaque voyage proposé.", { italics: true }),

    P("Un voyage Eventy n'est pas un produit standard. C'est un acte créatif respectueux : du voyageur, des partenaires HRA, du territoire, et du modèle économique transparent. La méthodologie permet de transformer une idée en voyage opérationnel sans rien sacrifier sur la qualité ni sur la cohérence.", { italics: true }),

    H1("1. Étape 1 — Idéation"),

    H2("1.1. Sources d'inspiration"),
    Bullet("Demande spontanée d'un créateur (passion territoriale, expertise destination)."),
    Bullet("Demande de voyageurs (sondages communauté, retours email)."),
    Bullet("Identification de saisonnalités (ponts, fêtes, vacances scolaires)."),
    Bullet("Opportunités événementielles (festival, événement culturel, expérience exclusive)."),
    Bullet("Veille concurrentielle (positionnement Eventy par rapport au marché)."),

    H2("1.2. Premier filtre"),
    Bullet("Cohérence avec l'âme d'Eventy (chaleur, simplicité, transparence)."),
    Bullet("Compatibilité avec le format groupe 4-38 voyageurs."),
    Bullet("Présence d'un créateur identifié et motivé."),
    Bullet("Faisabilité opérationnelle (transport, hébergement, accompagnement)."),
    Bullet("Cohérence avec la grille de décision destinations (cf. document dédié)."),

    H1("2. Étape 2 — Cadrage"),

    H2("2.1. Fiche cadrage voyage"),
    Bullet("Destination précise (lieu, périmètre géographique)."),
    Bullet("Période de l'année (mois, saison)."),
    Bullet("Durée totale (3 à 14 jours)."),
    Bullet("Profil voyageurs cible (solo, couple, famille, seniors)."),
    Bullet("Budget cible (fourchette tarif tout inclus / voyageur)."),
    Bullet("Promesse éditoriale (ce qui rend ce voyage Eventy unique)."),
    Bullet("Capacité prévue (4 à 38 voyageurs)."),

    H2("2.2. Validation cadrage"),
    Bullet("Validation par le Président avant passage à la phase suivante."),
    Bullet("Décision documentée (acceptation, ajustement, refus motivé)."),
    Bullet("Si validée : ouverture du dossier voyage avec numéro [YYYYMM-VOY-XXX]."),

    H1("3. Étape 3 — Conception logistique"),

    H2("3.1. Transport"),
    Bullet("Choix du mode prioritaire (autocar, train, avion uniquement si nécessaire)."),
    Bullet("Cohérence avec la Charte engagement carbone (refus vols < 4 h)."),
    Bullet("Contact 2-3 transporteurs et demande de devis comparatifs."),
    Bullet("Choix d'un transporteur principal + 1 backup."),
    Bullet("Calcul du coût/voyageur selon scénarios capacité (4, 15, 25, 38 voyageurs)."),

    H2("3.2. Hébergement"),
    Bullet("Identification d'options (hôtel principal + 1 backup minimum)."),
    Bullet("Visite ou audit qualité préalable (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Négociation tarif groupe (20-30 % de remise standard sur tarif public)."),
    Bullet("Vérification accessibilité PMR (cohérence Politique accessibilité PMR)."),
    Bullet("Contractualisation (Contrat HRA Partenaire Eventy)."),

    H2("3.3. Restauration"),
    Bullet("Sélection 3-5 restaurants partenaires sur le programme."),
    Bullet("Privilégier les circuits courts et la saisonnalité."),
    Bullet("Vérification capacité d'accueil simultané (38 voyageurs)."),
    Bullet("Tester les options de régimes spécifiques (végétarien, allergies, sans gluten)."),
    Bullet("Contractualisation et tarif négocié."),

    H2("3.4. Activités"),
    Bullet("3-7 activités structurantes selon la durée."),
    Bullet("Mix de formats (visite culturelle, expérience locale, moment libre, activité douce)."),
    Bullet("Vérifier la disponibilité et la capacité groupe."),
    Bullet("Privilégier les guides locaux et indépendants."),
    Bullet("Inclure au moins 1 activité « engagement local » (rencontre artisan, ferme, action environnementale)."),

    H2("3.5. Accompagnement"),
    Bullet("Désigner l'accompagnateur principal (cohérence Charte qualité accompagnateur)."),
    Bullet("Briefing accompagnateur sur les particularités du voyage."),
    Bullet("Préparation du kit voyage accompagnateur (manuel d'incident, contacts, fiche voyageurs)."),

    H1("4. Étape 4 — Construction tarifaire"),

    H2("4.1. Décomposition coûts"),
    P("Application du modèle PDG validé (cohérence Note expert-comptable, Contrat HRA Partenaire) :"),
    Bullet("Coûts HRA bruts (hébergement + restauration + activités) — refacturés au voyageur."),
    Bullet("Marge socle Eventy sur HRA (~8 % HT)."),
    Bullet("Marge créateur (3 pts HT supplémentaires sur HRA, cumulable avec rôle vendeur 5 % HT)."),
    Bullet("Transport (refacturé au coût + petite marge logistique)."),
    Bullet("Cartes / énergie / gamification : pas de marge — répercuté au voyageur."),

    H2("4.2. Validation tarif"),
    Bullet("Comparaison avec voyages similaires Eventy (cohérence interne)."),
    Bullet("Comparaison avec marché concurrent (cohérence externe)."),
    Bullet("Marge brute consolidée comprise entre 10 % et 14 % du CA voyage."),
    Bullet("Validation Président avant publication."),

    H2("4.3. Affichage transparent"),
    Bullet("Sur la fiche voyage, décomposition publique : transport / hébergement / restauration / activités / accompagnement / Eventy."),
    Bullet("Pas de poste « divers » ou « charges »."),
    Bullet("Cohérence avec la promesse de transparence Eventy (chaque euro tracé)."),

    H1("5. Étape 5 — Création de la fiche voyage"),

    H2("5.1. Contenu obligatoire"),
    Bullet("Titre clair et accrocheur (cohérence Charte éditoriale)."),
    Bullet("Description courte (≤ 300 caractères)."),
    Bullet("Programme détaillé jour par jour."),
    Bullet("Hôtel(s) avec photos, étoiles, services."),
    Bullet("Restaurants partenaires."),
    Bullet("Activités incluses + activités optionnelles."),
    Bullet("Capacité 4 à 38 voyageurs (mention seuil minimal)."),
    Bullet("Émissions CO2eq estimées (cohérence Charte engagement carbone)."),
    Bullet("Niveau d'accessibilité PMR."),
    Bullet("Tarif décomposé."),
    Bullet("Inclus / non inclus."),

    H2("5.2. Photos et vidéos"),
    Bullet("Minimum 8 photos (destination, hôtel, restaurants, activités)."),
    Bullet("1 vidéo (15-30 sec) recommandée."),
    Bullet("Photos haute définition (≥ 1 600 px largeur)."),
    Bullet("Privilégier des photos authentiques (pas de banque d'images génériques sauf nécessité)."),

    H2("5.3. SEO"),
    Bullet("Meta-title et meta-description optimisés."),
    Bullet("Mots-clés naturellement intégrés."),
    Bullet("Balises Hn cohérentes."),
    Bullet("Alt sur toutes les images."),

    H1("6. Étape 6 — Validation et mise en ligne"),

    H2("6.1. Revue qualité"),
    Bullet("Relecture par le Président + au moins une autre personne de l'équipe."),
    Bullet("Vérification cohérence éditoriale, factuelle et tarifaire."),
    Bullet("Test technique (affichage mobile/desktop, paiement Stripe)."),

    H2("6.2. Publication progressive"),
    Bullet("Étape 1 — Communication anticipée à la communauté Eventy Famille (J-30 avant grand public, cohérence Programme fidélisation)."),
    Bullet("Étape 2 — Mise en ligne grand public sur eventylife.fr."),
    Bullet("Étape 3 — Communication sur les réseaux sociaux et newsletter."),

    H2("6.3. Activation commerciale"),
    Bullet("Mobilisation des vendeurs (référence dans le portail vendeur)."),
    Bullet("Mobilisation des ambassadeurs (Kit ambassadeur mis à jour)."),
    Bullet("Suivi conversions (objectif minimum : 4 voyageurs réservés à J-30 du départ)."),

    H1("7. Étape 7 — Suivi en pré-départ"),

    H2("7.1. J-60 — Bilan commercial"),
    Bullet("Vérification du nombre de réservations."),
    Bullet("Décision de maintien ou ajustement marketing."),
    Bullet("Si < 4 voyageurs à J-30 : décision de partir quand même OU annulation avec préavis voyageurs."),

    H2("7.2. J-30 — Confirmation partenaires"),
    Bullet("Reconfirmation HRA (nombre voyageurs, besoins spécifiques)."),
    Bullet("Reconfirmation transporteur."),
    Bullet("Préparation roadbook voyageurs."),
    Bullet("Briefing accompagnateur."),

    H2("7.3. J-7 — Préparation finale"),
    Bullet("Reconfirmation voyageurs (heure, lieu RDV)."),
    Bullet("Vérification chaîne logistique."),
    Bullet("Préparation kit voyage accompagnateur."),

    H1("8. Étape 8 — Retour d'expérience"),

    H2("8.1. Débrief post-voyage (J+7)"),
    Bullet("Recueil avis voyageurs (NPS)."),
    Bullet("Débrief accompagnateur (forces, axes, partenaires HRA)."),
    Bullet("Analyse marges réelles vs prévues."),
    Bullet("Identification des points d'amélioration."),

    H2("8.2. Amélioration continue"),
    Bullet("Ajustements pour la prochaine session du voyage."),
    Bullet("Mise à jour de la fiche voyage si nécessaire."),
    Bullet("Capitalisation pour les voyages similaires."),

    H1("9. Indicateurs de qualité voyage"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Délai création voyage (idée → mise en ligne)", "≤ 90 j", "≤ 60 j"],
        ["Marge brute / voyage", "10-14 %", "10-14 %"],
        ["Taux de remplissage moyen", "≥ 65 %", "≥ 90 %"],
        ["NPS voyageurs", "≥ + 60", "≥ + 75"],
        ["Voyages annulés faute de seuil minimal", "≤ 5 %", "≤ 1 %"],
        ["Voyages renouvelés saison suivante", "≥ 70 %", "≥ 85 %"],
      ],
    }),

    H1("10. Engagements éthiques création voyage"),
    Bullet("Refus de toute marge cachée ou frais opaques."),
    Bullet("Refus des destinations en surtourisme manifeste."),
    Bullet("Refus des partenaires non auditables (cohérence Charte fournisseurs)."),
    Bullet("Information honnête sur le niveau de difficulté physique."),
    Bullet("Information honnête sur les limites d'accessibilité."),
    Bullet("Refus du clickbait ou du trompe-l'œil dans la fiche voyage."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Procédure de sourcing HRA, Grille de décision destinations, Procédure d'audit qualité HRA, Charte engagement carbone, Politique accessibilité PMR, Charte qualité accompagnateur, Note expert-comptable.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PROCÉDURE DE SOURCING HRA
// ============================================================
function procedureSourcingHRA() {
  return [
    bandeauTitre(
      "PROCÉDURE DE SOURCING ET QUALIFICATION HRA",
      "Identifier, évaluer et référencer les partenaires Hôtel-Restaurant-Activité",
    ),
    Spacer(160),

    P("La présente procédure formalise le processus de sourcing, qualification et référencement des partenaires HRA (Hôtels, Restaurants, Activités) d'EVENTY LIFE SAS. Elle vise à constituer un panel de partenaires fiables, qualitatifs et alignés sur les valeurs Eventy, capables d'accueillir un groupe de voyageurs avec rigueur et chaleur.", { italics: true }),

    P("Cette procédure complète la Procédure d'audit qualité HRA (qui détaille la grille d'audit) et la Charte fournisseurs (qui formalise les engagements). Le sourcing est l'étape amont — la première porte d'entrée d'un partenaire dans l'écosystème Eventy.", { italics: true }),

    H1("1. Cadre"),
    Bullet("Objectif : disposer d'un panel HRA suffisamment large pour répondre aux besoins du catalogue (cible An 1 : 50 partenaires HRA, An 3 : 250 partenaires)."),
    Bullet("Périmètre : tous les partenaires opérant des prestations facturées au voyageur (hôtels, restaurants, guides, sites d'activités, prestations expérientielles)."),
    Bullet("Cohérence : Politique d'achats responsables, Charte fournisseurs, Procédure d'audit qualité HRA, Politique anti-corruption."),

    H1("2. Étape 1 — Identification"),

    H2("2.1. Canaux de sourcing"),
    Bullet("Recherche sur place lors de visites de destinations (priorité)."),
    Bullet("Recommandations d'autres partenaires Eventy (cooptation HRA)."),
    Bullet("Recommandations des voyageurs (formulaire eventylife.fr/proposer)."),
    Bullet("Recherche en ligne (Google, TripAdvisor, Booking — sources de découverte uniquement, pas de référencement automatique)."),
    Bullet("Salons professionnels (IFTM, ITB, Congrès du Tourisme)."),
    Bullet("Réseaux sectoriels (UMIH, syndicats hôteliers, fédérations)."),
    Bullet("Office du tourisme local (interlocuteur privilégié sur les destinations)."),

    H2("2.2. Critères de pré-sélection"),
    Bullet("Capacité d'accueil ≥ 38 voyageurs simultanément (ou capacité totale d'un voyage Eventy)."),
    Bullet("Indépendant ou petite chaîne préférés (refus chaînes internationales standardisées)."),
    Bullet("Présence d'un interlocuteur unique chez le partenaire."),
    Bullet("Adresse vérifiable (pas d'adresse fictive ou pavillonnaire suspect)."),
    Bullet("Activité réelle et conforme (vérification auprès des registres locaux)."),
    Bullet("Tarification raisonnable (rapport qualité/prix cohérent avec le marché)."),

    H1("3. Étape 2 — Qualification téléphonique (5 min)"),

    H2("3.1. Objectifs"),
    Bullet("Vérifier l'intérêt mutuel."),
    Bullet("Présenter Eventy succinctement."),
    Bullet("Recueillir les premières informations clés."),
    Bullet("Décider de la suite (visite ou pas)."),

    H2("3.2. Trame d'entretien (5 min)"),
    Numbered("Présentation Eventy (30 sec) — opérateur de voyages de groupe FR/EU, modèle distribué, transparence."),
    Numbered("Question 1 — Capacité d'accueil pour groupes 15-38 personnes ?"),
    Numbered("Question 2 — Saisonnalité, périodes ouvertes, fermetures annuelles ?"),
    Numbered("Question 3 — Tarif groupe à titre indicatif ?"),
    Numbered("Question 4 — Adhésion à des labels (Clef Verte, Écolabel, Tourisme et Handicap, Maître Restaurateur) ?"),
    Numbered("Question 5 — Disponibilité pour une visite physique ou audit à distance ?"),

    H2("3.3. Décision"),
    Bullet("Aller plus loin : prise de RDV pour visite ou audit à distance."),
    Bullet("Mettre en attente : intéressant mais sans besoin immédiat — fiche conservée."),
    Bullet("Écarter : ne correspond pas (ton commercial, tarifs incohérents, refus de transparence)."),

    H1("4. Étape 3 — Visite ou audit à distance"),

    H2("4.1. Choix du format"),
    Bullet("Visite physique : préférable pour les hôtels et sites d'activités structurants."),
    Bullet("Audit à distance (visio + photos/vidéos) : possible pour restaurants ou prestations simples."),
    Bullet("Cohérence avec la Procédure d'audit qualité HRA pour la grille d'évaluation."),

    H2("4.2. Préparation visite"),
    Bullet("Information du partenaire : durée, points abordés, attentes."),
    Bullet("Préparation grille d'audit (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Demande de documents préalables (statuts, Kbis, RC Pro, dernière inspection sanitaire)."),

    H2("4.3. Conduite de la visite (2-4 h)"),
    Bullet("Visite des lieux d'accueil voyageurs."),
    Bullet("Visite chambres / cuisine / salles à manger / activités."),
    Bullet("Vérification accessibilité PMR."),
    Bullet("Vérification sécurité (issues de secours, extincteurs, alarmes)."),
    Bullet("Échange avec le personnel (qualité d'accueil)."),
    Bullet("Si possible, dégustation ou test prestation."),

    H1("5. Étape 4 — Décision de référencement"),

    H2("5.1. Synthèse audit"),
    Bullet("Note globale (cohérence grille Procédure d'audit qualité HRA)."),
    Bullet("Forces identifiées."),
    Bullet("Points de vigilance."),
    Bullet("Recommandations d'amélioration le cas échéant."),

    H2("5.2. Décisions possibles"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Décision", "Note minimale", "Action"],
      rows: [
        ["Premium", "≥ 4,5/5", "Référencement immédiat, recommandé sur les voyages"],
        ["Validé", "≥ 3,5/5", "Référencement standard"],
        ["Sous condition", "3 à 3,5/5", "Plan d'amélioration 90 jours, audit de suivi"],
        ["Écarté", "< 3/5", "Refus motivé, possibilité de re-candidater à 12 mois"],
      ],
    }),

    H2("5.3. Notification du partenaire"),
    Bullet("Email écrit motivé sous 14 jours après la visite."),
    Bullet("En cas de validation : envoi du Contrat HRA Partenaire pour signature."),
    Bullet("En cas de refus : retour constructif sur les points d'amélioration."),

    H1("6. Étape 5 — Contractualisation et onboarding"),

    H2("6.1. Contractualisation"),
    Bullet("Signature du Contrat HRA Partenaire (10 articles, cohérence document dédié)."),
    Bullet("Signature de la Charte fournisseurs (engagements éthiques et opérationnels)."),
    Bullet("Annexe DPA RGPD si traitement de données personnelles voyageurs."),

    H2("6.2. Onboarding HRA (cohérence Onboarding partenaires)"),
    Numbered("Création compte sur la plateforme eventylife.fr/maisons."),
    Numbered("Test technique paiement et suivi commande."),
    Numbered("Formation aux outils Eventy (1 h en visio)."),
    Numbered("Première commande live."),
    Numbered("Débrief post première mission (forces, axes)."),

    H1("7. Étape 6 — Suivi continu"),

    H2("7.1. Audit annuel"),
    Bullet("Audit récurrent annuel (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Décision : maintien, élévation niveau, déclassement, déréférencement."),
    Bullet("Plan d'amélioration personnalisé si note en baisse."),

    H2("7.2. Audits inopinés (voyageurs-mystères)"),
    Bullet("Programme An 2-3 : voyageurs-mystères évaluant ponctuellement les partenaires HRA."),
    Bullet("Notes intégrées dans la grille."),

    H2("7.3. Reporting partenaire"),
    Bullet("Reporting annuel envoyé au partenaire (volumes opérés, NPS voyageurs)."),
    Bullet("Réunion annuelle (visio ou présentiel) pour échanger sur l'évolution."),

    H1("8. Cas particuliers"),

    H2("8.1. Sourcing destination internationale"),
    Bullet("Préférence absolue aux partenaires locaux (cohérence Politique d'achats responsables)."),
    Bullet("Vérification du cadre juridique local (statut, fiscalité, lois travail)."),
    Bullet("Pour pays non-UE : encadrement RGPD strict (DPA + clauses contractuelles types)."),

    H2("8.2. Sourcing micro-partenaire (artisan, ferme)"),
    Bullet("Procédure simplifiée pour les structures < 5 salariés."),
    Bullet("Audit léger (45 min vs 2-4 h)."),
    Bullet("Contrat-cadre simplifié."),
    Bullet("Privilégier dans le cadre des activités « engagement local »."),

    H2("8.3. Sourcing événementiel ponctuel"),
    Bullet("Pour événements ponctuels (festival, exposition), partenariats à durée limitée possibles."),
    Bullet("Audit allégé (cas par cas)."),
    Bullet("Contrat ad hoc avec clauses spécifiques."),

    H1("9. Indicateurs de sourcing"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Nombre HRA actifs panel", "≥ 50", "≥ 250"],
        ["Délai sourcing → référencement", "≤ 60 j", "≤ 30 j"],
        ["Taux conversion qualif. téléphone → audit", "≥ 30 %", "≥ 50 %"],
        ["Taux conversion audit → référencement", "≥ 70 %", "≥ 85 %"],
        ["HRA premium (≥ 4,5/5)", "≥ 20 %", "≥ 35 %"],
        ["HRA déréférencés / an", "≤ 10 %", "≤ 5 %"],
        ["Renouvellement annuel HRA actifs", "≥ 90 %", "≥ 95 %"],
      ],
    }),

    H1("10. Engagements éthiques de sourcing"),
    Bullet("Refus de tout pot-de-vin ou commission occulte (cohérence Politique anti-corruption)."),
    Bullet("Égalité de traitement candidats indépendamment de leur taille."),
    Bullet("Confidentialité des informations recueillies pendant l'audit."),
    Bullet("Réponse écrite motivée à toute candidature."),
    Bullet("Refus de chantage à la rémunération (« fais-moi un meilleur prix sinon »)."),
    Bullet("Respect du temps du partenaire (réponse sous 14 jours après visite)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Procédure d'audit qualité HRA, Contrat HRA Partenaire, Charte fournisseurs, Politique d'achats responsables, Onboarding partenaires, Politique anti-corruption, Méthodologie de création de voyage.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — GRILLE DE DÉCISION DESTINATIONS
// ============================================================
function grilleDecisionDestinations() {
  return [
    bandeauTitre(
      "GRILLE DE DÉCISION DESTINATIONS EVENTY",
      "Critères structurés pour sélectionner ou écarter une destination de voyage",
    ),
    Spacer(160),

    P("La présente grille formalise les critères qu'EVENTY LIFE SAS applique pour décider d'inclure ou d'écarter une destination dans son catalogue. Elle vise à garantir une cohérence stratégique, qualitative, éthique et économique sur l'ensemble du catalogue, et à éviter les décisions d'opportunité non alignées sur l'âme d'Eventy.", { italics: true }),

    P("Aucune destination n'est par essence « bonne » ou « mauvaise ». La grille n'est pas un classement moral. C'est un outil de décision rationnel qui permet de poser la question : cette destination correspond-elle à ce que veut faire Eventy, à ce moment, dans ce contexte ?", { italics: true }),

    H1("1. Cadre d'application"),
    Bullet("Toute proposition de nouvelle destination passe par la grille avant validation."),
    Bullet("Les destinations existantes sont réévaluées annuellement."),
    Bullet("La grille est appliquée par le créateur (auto-évaluation) puis validée par le Président."),
    Bullet("Décision documentée (acceptation, ajustement, refus motivé)."),

    H1("2. Critères positifs (à favoriser)"),

    H2("2.1. Cohérence avec l'âme d'Eventy"),
    Bullet("Destination chaleureuse et accueillante."),
    Bullet("Possibilité de rencontres humaines authentiques."),
    Bullet("Histoire, culture ou patrimoine intéressant à partager."),
    Bullet("Cuisine et art de vivre prononcés."),

    H2("2.2. Faisabilité opérationnelle"),
    Bullet("Accessible en autocar, train ou vol direct depuis France."),
    Bullet("Capacité hôtelière compatible groupes 15-38 voyageurs."),
    Bullet("Capacité restauration équivalente."),
    Bullet("Présence d'office du tourisme actif (interlocuteur)."),

    H2("2.3. Sécurité"),
    Bullet("Pays/région sûr (pas de zone rouge MEAE)."),
    Bullet("Infrastructure médicale d'urgence accessible."),
    Bullet("Stabilité politique récente."),
    Bullet("Pas d'épidémies ou crises sanitaires actives."),

    H2("2.4. RSE et éthique"),
    Bullet("Économie locale active à laquelle Eventy peut contribuer."),
    Bullet("Présence de partenaires HRA indépendants (pas seulement chaînes)."),
    Bullet("Engagement de la destination en faveur du tourisme durable."),
    Bullet("Capacité d'inclure des activités à faible empreinte."),

    H2("2.5. Économique"),
    Bullet("Tarif tout inclus possible dans la fourchette Eventy (500-1 200 € selon durée)."),
    Bullet("Marge brute réaliste (10-14 %)."),
    Bullet("Pas de saisonnalité destructrice (hors haute saison ultra-saturée uniquement)."),

    H1("3. Critères de vigilance (à analyser avec rigueur)"),

    H2("3.1. Surtourisme"),
    Bullet("Destinations en surtourisme manifeste (Venise centre, Bali, Santorin pic été, Dubrovnik, etc.) — refus par défaut."),
    Bullet("Possibilité d'inclure ces destinations en saison creuse, avec partenaires hors-circuit, et avec engagement éducatif (sensibilisation surtourisme)."),
    Bullet("Refus des week-ends courts dans destinations surtouristiques."),

    H2("3.2. Empreinte carbone"),
    Bullet("Destinations long-courrier (> 4 000 km) : justification carbone à expliciter."),
    Bullet("Privilégier les destinations accessibles bas-carbone (autocar, train)."),
    Bullet("Cohérence avec la Charte engagement carbone."),

    H2("3.3. Risques humains et sociaux"),
    Bullet("Destinations avec atteintes graves aux droits humains : refus."),
    Bullet("Destinations dans une dictature manifeste : refus."),
    Bullet("Destinations en conflit ouvert : refus."),
    Bullet("Risque pour la sécurité des LGBT+ ou femmes : exposé clairement, refus si trop élevé."),

    H2("3.4. Risques opérationnels"),
    Bullet("Pays où la corruption est endémique : risque pour les opérations."),
    Bullet("Pays où la justice est peu fiable : risque en cas de litige."),
    Bullet("Pays où l'évacuation médicale est difficile : exigence Pack Sérénité renforcée."),

    H1("4. Critères éliminatoires (refus systématique)"),
    Bullet("Pays / régions classés rouge par le MEAE (ministère des Affaires étrangères français)."),
    Bullet("Pays sous sanctions UE / ONU."),
    Bullet("Destinations violant manifestement les droits humains (Corée du Nord, etc.)."),
    Bullet("Destinations à risque de paludisme grave sans alternative prophylactique fiable (sauf voyage spécialisé avec encadrement médical)."),
    Bullet("Destinations promues par des opérateurs adoptant des pratiques douteuses (greenwashing extrême, exploitation animale, exploitation enfants)."),
    Bullet("Destinations promues comme « secrètes » alors qu'elles sont fragiles écologiquement."),

    H1("5. Grille de scoring rapide"),
    P("Pour chaque destination candidate, attribuer une note 1 à 5 sur les 8 critères suivants :"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Critère", "Pondération", "Note (1-5)", "Score"],
      rows: [
        ["Cohérence âme Eventy", "20 %", "[X]", "[X × 0,20]"],
        ["Faisabilité opérationnelle", "15 %", "[X]", "[X × 0,15]"],
        ["Sécurité", "15 %", "[X]", "[X × 0,15]"],
        ["RSE / éthique", "15 %", "[X]", "[X × 0,15]"],
        ["Empreinte carbone (mode transport)", "10 %", "[X]", "[X × 0,10]"],
        ["Faisabilité économique", "10 %", "[X]", "[X × 0,10]"],
        ["Originalité dans le catalogue", "10 %", "[X]", "[X × 0,10]"],
        ["Demande voyageurs identifiée", "5 %", "[X]", "[X × 0,05]"],
        ["TOTAL", "100 %", "—", "[X / 5]"],
      ],
    }),

    H2("5.1. Décision selon score"),
    Bullet("Score ≥ 4,0 / 5 : destination prioritaire à intégrer."),
    Bullet("Score 3,5 – 4,0 / 5 : destination acceptable, à approfondir."),
    Bullet("Score 3,0 – 3,5 / 5 : destination à étudier avec précaution, conditions à poser."),
    Bullet("Score < 3,0 / 5 : destination écartée."),

    H1("6. Réévaluation annuelle des destinations existantes"),

    H2("6.1. Calendrier"),
    Bullet("Revue annuelle au 1er trimestre (T1)."),
    Bullet("Pour chaque destination du catalogue : application de la grille."),
    Bullet("Décision : maintien, ajustement (saison, programme), retrait progressif, retrait immédiat."),

    H2("6.2. Critères de retrait"),
    Bullet("Évolution sécuritaire défavorable (passage en zone orange/rouge MEAE)."),
    Bullet("Atteintes graves aux droits humains constatées."),
    Bullet("Surtourisme aggravé."),
    Bullet("Performance commerciale insuffisante (≤ 65 % remplissage 2 années consécutives sans cause externe)."),
    Bullet("NPS < + 50 sur la destination."),

    H1("7. Catalogue cible Eventy"),

    H2("7.1. Mix géographique cible An 5"),
    Bullet("60 % France métropolitaine + DOM-TOM."),
    Bullet("25 % Europe (UE, Suisse, UK, Norvège, Islande)."),
    Bullet("10 % Méditerranée non-UE (Maroc, Tunisie, Turquie côtière)."),
    Bullet("5 % long-courrier (Asie de l'Est, Afrique de l'Ouest, Amérique du Nord)."),

    H2("7.2. Mix saisonnier cible"),
    Bullet("30 % hiver (oct-mars)."),
    Bullet("25 % printemps (avril-mai)."),
    Bullet("20 % été (juin-août)."),
    Bullet("25 % automne (sept-oct)."),

    H2("7.3. Mix profil"),
    Bullet("40 % grand public (35-65 ans)."),
    Bullet("25 % seniors (60+)."),
    Bullet("15 % jeunes adultes (25-40 ans)."),
    Bullet("10 % B2B / CSE."),
    Bullet("10 % thématiques (gastronomie, randonnée, culturel intense)."),

    H1("8. Cas particuliers"),

    H2("8.1. Demande forte voyageur sur destination écartée"),
    Bullet("Information transparente du voyageur sur les raisons du refus."),
    Bullet("Possibilité de proposer une destination alternative similaire."),
    Bullet("Pas de cession à la demande sans réévaluation rigoureuse."),

    H2("8.2. Crise impactant une destination existante"),
    Bullet("Activation de la Procédure de gestion de crise communication."),
    Bullet("Décision de maintien ou suspension immédiate."),
    Bullet("Information voyageurs réservés (cohérence CGV force majeure)."),

    H2("8.3. Destinations exploratoires (« voyages pilotes »)"),
    Bullet("Possibilité de tester une destination en An 1-2 sur 1-2 voyages pilotes."),
    Bullet("Bilan rigoureux (NPS, marges, retours équipe) avant inclusion permanente."),

    H1("9. Engagements opposables Eventy sur les destinations"),
    Bullet("Refus systématique des destinations contraires aux droits humains."),
    Bullet("Refus des destinations en zone rouge MEAE."),
    Bullet("Refus des destinations promues par des pratiques de greenwashing extrême."),
    Bullet("Communication transparente sur les choix éditoriaux du catalogue."),
    Bullet("Information voyageur sur les caractéristiques de chaque destination (sécurité, accessibilité, empreinte)."),
    Bullet("Refus des partenariats incentive avec des destinations sans intérêt voyageur réel."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Méthodologie de création de voyage, Procédure de sourcing HRA, Charte engagement carbone, Politique RSE, Politique d'achats responsables, Catalogue programmes saison 1.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Methodologie-Creation-Voyage.docx",
      title: "Eventy Life — Méthodologie de création de voyage",
      description: "Méthodologie de création de voyage Eventy : de l'idée à la mise en ligne.",
      footer: "EVENTY LIFE SAS — Méthodologie création voyage",
      children: methodologieCreationVoyage(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Sourcing-HRA.docx",
      title: "Eventy Life — Procédure de sourcing HRA",
      description: "Procédure de sourcing et qualification des partenaires HRA.",
      footer: "EVENTY LIFE SAS — Procédure sourcing HRA",
      children: procedureSourcingHRA(),
    },
    {
      file: "docs/garanties/Eventy-Life-Grille-Decision-Destinations.docx",
      title: "Eventy Life — Grille de décision destinations",
      description: "Grille de décision pour sélectionner ou écarter une destination.",
      footer: "EVENTY LIFE SAS — Grille décision destinations",
      children: grilleDecisionDestinations(),
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
