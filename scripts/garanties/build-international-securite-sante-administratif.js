/**
 * Eventy Life — Trois documents international / sécurité voyageur
 *
 *   1. Consignes sécurité destination (modèle fiche pays)
 *   2. Fiche santé voyageur international
 *   3. Document administratif voyageur international (visa, passeport, formalités)
 *
 * Usage : node scripts/garanties/build-international-securite-sante-administratif.js
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
// DOCUMENT 1 — CONSIGNES SÉCURITÉ DESTINATION
// ============================================================
function consignesSecuriteDestination() {
  return [
    bandeauTitre(
      "CONSIGNES SÉCURITÉ DESTINATION EVENTY",
      "Modèle de fiche pays — référentiel équipe et voyageurs",
    ),
    Spacer(160),

    P("Le présent document est le modèle-type de fiche sécurité que prépare EVENTY LIFE SAS pour chaque destination internationale (et certaines destinations France métropolitaine sensibles). Il est remis aux voyageurs avant le départ et utilisé en interne par l'accompagnateur.", { italics: true }),

    P("L'objectif n'est pas d'effrayer les voyageurs, mais de les informer honnêtement et de leur permettre de voyager sereinement. La grande majorité des voyages se déroulent sans incident — la fiche sert avant tout à anticiper les rares cas où un voyageur a besoin d'un repère.", { italics: true }),

    H1("1. En-tête de la fiche pays"),

    H2("1.1. Identité"),
    Bullet("Pays / Région / Ville(s) du voyage."),
    Bullet("Numéro de voyage Eventy [YYYYMM-VOY-XXX]."),
    Bullet("Période du voyage."),
    Bullet("Date de mise à jour de la fiche (validité 6 mois)."),

    H2("1.2. Niveau de vigilance MEAE"),
    Bullet("Source : France Diplomatie — diplomatie.gouv.fr/conseils-aux-voyageurs."),
    Bullet("Code couleur : Vert (vigilance normale), Jaune (vigilance renforcée), Orange (déconseillé sauf raison impérative), Rouge (formellement déconseillé)."),
    Bullet("Eventy n'opère que sur destinations classées Vert ou Jaune (cohérence Grille de décision destinations)."),

    H1("2. Contacts d'urgence"),

    H2("2.1. Contacts Eventy"),
    Bullet("Accompagnateur Eventy sur place : [Nom + numéro WhatsApp + numéro local]."),
    Bullet("Ligne d'urgence Eventy 24/7 : [Numéro central]."),
    Bullet("Email urgence : urgence@eventylife.fr."),
    Bullet("Pack Sérénité (assistance, rapatriement) : [Numéro assureur + référence dossier]."),

    H2("2.2. Contacts officiels"),
    Bullet("Numéros d'urgence locaux (police, ambulance, pompiers) — équivalents 112."),
    Bullet("Ambassade ou consulat de France — adresse, téléphone, horaires."),
    Bullet("Centre médical d'urgence le plus proche du lieu d'hébergement."),
    Bullet("Inscription au Fil d'Ariane MEAE (recommandée) — diplomatie.gouv.fr/ariane."),

    H1("3. Sécurité générale"),

    H2("3.1. Niveau de risque sécuritaire"),
    Bullet("Synthèse en 3 lignes du niveau de risque (très faible / faible / modéré)."),
    Bullet("Zones spécifiques à éviter (quartiers, sites)."),
    Bullet("Zones touristiques sécurisées (où le voyage se concentre)."),

    H2("3.2. Risques courants à connaître"),
    Bullet("Vol à la tire et arnaques touristiques (consignes : sac fermé devant soi, pas d'objet de valeur visible)."),
    Bullet("Agressions (rares, mais signaler les modalités si pertinent)."),
    Bullet("Risques routiers (qualité du réseau, conduite locale)."),
    Bullet("Risques liés aux manifestations / mouvements sociaux le cas échéant."),

    H2("3.3. Conseils pratiques"),
    Bullet("Ne pas circuler seul·e après [heure] dans certains quartiers."),
    Bullet("Photocopie des documents officiels conservée séparément (cohérence document administratif)."),
    Bullet("Application sur le téléphone : numéros utiles pré-enregistrés."),
    Bullet("Espèces : porter peu sur soi, plusieurs poches/coffret."),

    H1("4. Risques sanitaires"),

    H2("4.1. Synthèse santé"),
    Bullet("Niveau de risque sanitaire (renvoyer à la Fiche santé voyageur dédiée)."),
    Bullet("Vaccinations recommandées et obligatoires."),
    Bullet("Eau du robinet (potable / non potable)."),
    Bullet("Précautions alimentaires."),

    H2("4.2. Numéros médicaux"),
    Bullet("Hôpital de référence sur la destination (adresse, téléphone)."),
    Bullet("Pharmacie de garde 24/7 si applicable."),
    Bullet("Médecin francophone si disponible."),
    Bullet("Eventy Pack Sérénité — assistance médicale 24/7."),

    H1("5. Risques climatiques et naturels"),
    Bullet("Saison du voyage (climat attendu)."),
    Bullet("Risques saisonniers (inondations, ouragans, séismes, canicules)."),
    Bullet("Conduite à tenir en cas d'alerte (consignes accompagnateur)."),
    Bullet("Cohérence avec le Manuel d'incident voyage (procédures évacuation)."),

    H1("6. Législation locale et coutumes"),

    H2("6.1. Lois à respecter (sélection)"),
    Bullet("Drogues : législation locale (souvent très stricte hors UE)."),
    Bullet("Alcool : législation locale (interdit dans certains pays)."),
    Bullet("Photographie : sites interdits (sites militaires, religieux, gouvernementaux)."),
    Bullet("Comportement public : tenue, étreintes, démonstrations affectives selon culture."),
    Bullet("Pourboires : usage local (obligatoire / discrétionnaire)."),

    H2("6.2. Spécificités culturelles"),
    Bullet("Salutations et formules de politesse."),
    Bullet("Tenue vestimentaire dans les lieux religieux."),
    Bullet("Repas et conventions sociales (heures, partage)."),
    Bullet("Marchandage : pratique courante ou non."),

    H2("6.3. LGBTQIA+ — niveau de tolérance"),
    Bullet("Information factuelle et honnête sur le niveau de tolérance local."),
    Bullet("Conseils pratiques (discrétion publique le cas échéant)."),
    Bullet("Refus des destinations où la loi pénalise — cohérence Grille de décision destinations."),

    H1("7. Argent et paiements"),
    Bullet("Devise locale et taux de change indicatif."),
    Bullet("Paiements acceptés (CB / espèces / Apple Pay) selon contexte."),
    Bullet("Distributeurs (DAB) accessibles, sécurité d'utilisation."),
    Bullet("Bureaux de change recommandés."),
    Bullet("Pourboires (montants indicatifs, obligation ou non)."),

    H1("8. Communication et connectivité"),
    Bullet("Réseau mobile : couverture, opérateurs."),
    Bullet("Forfait européen / international (rappel sur l'itinérance)."),
    Bullet("Wi-Fi gratuit dans les hébergements et restaurants."),
    Bullet("Carte SIM locale ou eSIM si pertinent."),
    Bullet("Applications utiles à télécharger avant le départ."),

    H1("9. Spécificités voyage Eventy"),

    H2("9.1. Programme et logistique"),
    Bullet("Heures de RDV quotidiens."),
    Bullet("Lieux de rassemblement."),
    Bullet("Tolérance retard (15 min standard sauf cas particuliers)."),

    H2("9.2. Règles de groupe"),
    Bullet("Liberté individuelle préservée (skipper une activité sans surcoût)."),
    Bullet("Information à l'accompagnateur si on s'absente du groupe."),
    Bullet("Respect des autres voyageurs (silence chambres, tabagisme, etc.)."),

    H2("9.3. Pack Sérénité"),
    Bullet("Couverture (médicale, hébergement de secours, rapatriement, perte bagages)."),
    Bullet("Procédure de déclaration sinistre."),
    Bullet("Numéros à conserver."),

    H1("10. Procédures Eventy en cas d'incident"),
    Bullet("Niveau 1 — incident mineur : signalement à l'accompagnateur, prise en charge sur place."),
    Bullet("Niveau 2 — incident modéré : activation Pack Sérénité, information Président Eventy."),
    Bullet("Niveau 3 — incident majeur : activation cellule de crise, information famille."),
    Bullet("Niveau 4 — incident critique : rapatriement, soutien officiel."),
    Bullet("Cohérence avec Manuel d'incident voyage (procédures détaillées)."),

    H1("11. Liste personnelle pré-départ"),
    P("À cocher avant le départ :"),
    Bullet("☐ Documents administratifs vérifiés et photocopiés (cf. Document administratif)."),
    Bullet("☐ Vaccinations à jour si nécessaires (cf. Fiche santé)."),
    Bullet("☐ Carte vitale + carte européenne d'assurance maladie (CEAM) si UE."),
    Bullet("☐ Numéros d'urgence enregistrés."),
    Bullet("☐ Inscription Fil d'Ariane (international)."),
    Bullet("☐ Contact famille / proche informé du voyage."),
    Bullet("☐ Application bancaire opérationnelle à l'étranger."),
    Bullet("☐ Adapateur électrique si nécessaire."),
    Bullet("☐ Trousse pharmacie personnelle (cohérence Fiche santé)."),
    Bullet("☐ Pièce d'identité acceptée (passeport/CNI selon destination)."),

    H1("12. Mise à jour et validation"),
    Bullet("Fiche mise à jour 30 jours avant chaque départ."),
    Bullet("Validation par le créateur du voyage + Président Eventy."),
    Bullet("Sources : France Diplomatie, OMS, ambassade locale, partenaires HRA sur place."),
    Bullet("Mise à jour exceptionnelle si crise / événement (cohérence Procédure de gestion de crise communication)."),

    Spacer(160),
    P("Document de référence et information voyageur — Version 1.0 — 2 mai 2026. Validité 6 mois.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Manuel d'incident voyage, Pack Sérénité, Fiche santé voyageur international, Document administratif voyageur, Procédure de gestion de crise communication, Grille de décision destinations.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — FICHE SANTÉ VOYAGEUR INTERNATIONAL
// ============================================================
function ficheSanteVoyageur() {
  return [
    bandeauTitre(
      "FICHE SANTÉ VOYAGEUR INTERNATIONAL EVENTY",
      "Vaccinations, prophylaxies, hygiène et trousse de pharmacie — référentiel pratique",
    ),
    Spacer(160),

    P("La présente fiche santé est conçue pour informer les voyageurs Eventy avant un voyage international. Elle complète les Consignes sécurité destination et le Document administratif voyageur. Elle est adaptée à chaque destination dans la version finale remise aux voyageurs.", { italics: true }),

    P("Cette fiche n'est pas un avis médical. Pour toute question spécifique (traitement chronique, antécédent, allergie sévère, grossesse), consulter son médecin traitant ou un centre de vaccination internationale 4-6 semaines avant le départ.", { italics: true }),

    H1("1. Vaccinations universellement recommandées"),

    H2("1.1. Vaccinations à jour (calendrier français)"),
    Bullet("Diphtérie-Tétanos-Poliomyélite (DTP) : rappels selon âge (tous les 20 ans après 25 ans, tous les 10 ans après 65 ans)."),
    Bullet("ROR (Rougeole-Oreillons-Rubéole) — particulièrement important si né après 1980."),
    Bullet("Coqueluche (selon âge et profil)."),

    H2("1.2. Vaccinations recommandées voyage"),
    Bullet("Hépatite A (toutes destinations hors Europe occidentale, Amérique du Nord, Australie/NZ)."),
    Bullet("Hépatite B (séjours longs ou contact prévu avec milieu médical/social)."),
    Bullet("Typhoïde (Asie du Sud, Afrique, certaines zones d'Amérique latine)."),

    H1("2. Vaccinations selon destination"),

    H2("2.1. Vaccinations obligatoires (selon pays)"),
    Bullet("Fièvre jaune : pays subsahariens (Afrique tropicale) et certains pays d'Amérique du Sud — obligatoire pour entrer."),
    Bullet("Méningite ACWY : Arabie Saoudite (pèlerinage La Mecque) — obligatoire."),
    Bullet("Polio (preuve récente) : certains pays ré-émetteurs (Afghanistan, Pakistan)."),
    Bullet("Le carnet de vaccination international (jaune) est demandé à l'entrée sur certains territoires."),

    H2("2.2. Vaccinations fortement recommandées (selon contexte)"),
    Bullet("Encéphalite japonaise (Asie rurale, séjours longs)."),
    Bullet("Rage (séjours longs en zone à risque, contact avec animaux)."),
    Bullet("Encéphalite à tiques (Europe centrale et de l'Est, Russie, randonnée)."),
    Bullet("Méningite ACWY (« ceinture méningitique » Afrique sahélienne en saison sèche)."),

    H1("3. Prophylaxies et préventions"),

    H2("3.1. Paludisme"),
    Bullet("Présence évaluée selon zone et saison (Afrique subsaharienne, Asie du Sud-Est rurale, Amazonie, etc.)."),
    Bullet("Prophylaxie médicamenteuse à prescrire par le médecin selon zone."),
    Bullet("Mesures anti-moustiques systématiques (répulsif DEET ou IR3535, vêtements longs, moustiquaires)."),

    H2("3.2. Autres maladies vectorielles"),
    Bullet("Dengue, chikungunya, Zika (zones tropicales) — pas de prophylaxie médicamenteuse, prévention anti-moustique uniquement."),
    Bullet("Maladies tiques (Lyme, encéphalite) — examen tiques après chaque sortie en forêt."),

    H2("3.3. Maladies de l'eau et de l'alimentation"),
    Bullet("Boire uniquement de l'eau encapsulée scellée ou bouillie."),
    Bullet("Refuser les glaçons sauf certitude qu'ils proviennent d'eau potable."),
    Bullet("Éviter crudités lavées à l'eau locale, jus pressés ouverts, fruits non pelables soi-même."),
    Bullet("Réchauffer suffisamment les viandes et poissons."),
    Bullet("Probiotiques (Saccharomyces boulardii) en prévention si voyage à risque."),

    H1("4. Trousse de pharmacie voyageur"),

    H2("4.1. Trousse minimale (UE, court séjour)"),
    Bullet("Antalgique-antipyrétique (paracétamol)."),
    Bullet("Anti-diarrhéique simple (lopéramide)."),
    Bullet("Sérum de réhydratation orale."),
    Bullet("Antihistaminique (cétirizine)."),
    Bullet("Pansements adhésifs, désinfectant cutané, sparadrap."),
    Bullet("Compresses stériles, ciseaux, pince à épiler."),
    Bullet("Solution hydroalcoolique."),
    Bullet("Crème solaire indice 50+ (haute protection)."),
    Bullet("Lunettes de soleil filtrantes."),

    H2("4.2. Compléments pour zones tropicales / éloignées"),
    Bullet("Antibiotique à large spectre (sur prescription médicale)."),
    Bullet("Anti-paludéen (sur prescription, selon zone)."),
    Bullet("Répulsif moustiques DEET 30 % minimum."),
    Bullet("Moustiquaire imprégnée si nécessaire."),
    Bullet("Comprimés de purification de l'eau (DCCNa)."),
    Bullet("Anti-vomitif (métoclopramide ou autre sur prescription)."),
    Bullet("Protection auditive."),
    Bullet("Stylo épinéphrine (EpiPen) si allergie connue."),

    H2("4.3. Traitements personnels"),
    Bullet("Quantité suffisante pour la durée du voyage + 7 jours."),
    Bullet("Ordonnance dans la trousse (en français + traduction anglaise pour douane)."),
    Bullet("Liste des génériques pour aider en cas de perte."),
    Bullet("Pour insuline, anticoagulants, immunosuppresseurs : signaler à l'accompagnateur."),

    H1("5. Précautions selon profil"),

    H2("5.1. Femmes enceintes"),
    Bullet("Avis médical impératif avant tout voyage international."),
    Bullet("Refus en zone Zika (1er et 2e trimestre)."),
    Bullet("Vaccins vivants atténués contre-indiqués (fièvre jaune, ROR)."),
    Bullet("Eventy informe et oriente vers le médecin traitant."),

    H2("5.2. Personnes âgées (65+)"),
    Bullet("Bilan cardiologique récent recommandé."),
    Bullet("Précautions sur les vols longs (compression veineuse, hydratation)."),
    Bullet("Adapter le rythme du voyage."),
    Bullet("Précautions canicule renforcées en saison chaude."),

    H2("5.3. Pathologies chroniques"),
    Bullet("Carte d'urgence médicale en français + anglais."),
    Bullet("Liste détaillée des médicaments avec génériques."),
    Bullet("Compte-rendu médical récent (en cas d'hospitalisation à l'étranger)."),
    Bullet("Coordonnées du médecin traitant en France."),
    Bullet("Information à l'accompagnateur Eventy avec accord."),

    H2("5.4. Personnes à mobilité réduite"),
    Bullet("Cohérence avec Politique accessibilité PMR."),
    Bullet("Vérification accessibilité du parcours en amont."),
    Bullet("Anticipation transports adaptés et hébergement."),

    H1("6. Couverture santé et assurance"),

    H2("6.1. Carte Européenne d'Assurance Maladie (CEAM)"),
    Bullet("Voyages UE/EEE/Suisse uniquement."),
    Bullet("Demande gratuite sur ameli.fr 15 jours avant le départ."),
    Bullet("Couvre les soins inopinés."),
    Bullet("Limites : pas de rapatriement, pas de prise en charge directe systématique."),

    H2("6.2. Pack Sérénité Eventy"),
    Bullet("Assistance médicale 24/7 (téléconsultation, orientation, traduction)."),
    Bullet("Frais médicaux d'urgence pris en charge."),
    Bullet("Hospitalisation à l'étranger (avance et facturation)."),
    Bullet("Rapatriement médical si nécessaire."),
    Bullet("Soutien psychologique post-incident."),
    Bullet("Numéros d'urgence Pack Sérénité conservés sur soi."),

    H2("6.3. Mutuelle complémentaire santé"),
    Bullet("Vérifier les couvertures voyage avant départ."),
    Bullet("Compléter avec assurance voyage Eventy si nécessaire."),

    H1("7. Au retour"),
    Bullet("Surveiller son état de santé pendant 1 mois post-retour de zone tropicale."),
    Bullet("Consulter rapidement en cas de fièvre, diarrhée persistante, éruption inhabituelle."),
    Bullet("Signaler le récent voyage tropical au médecin (orientation diagnostic)."),
    Bullet("Conserver le carnet de vaccination international."),

    H1("8. Sources et références"),
    Bullet("Institut Pasteur — pasteur.fr/fr/centre-medical/preparer-son-voyage."),
    Bullet("OMS / WHO — informations santé pays."),
    Bullet("CDC (États-Unis) — cdc.gov/travel."),
    Bullet("BEH (Bulletin Épidémiologique Hebdomadaire) — recommandations annuelles voyage."),
    Bullet("France Diplomatie — diplomatie.gouv.fr/conseils-aux-voyageurs."),
    Bullet("Centre de vaccinations internationales le plus proche du voyageur."),

    H1("9. Engagement Eventy"),
    Bullet("Cette fiche est générique. Une version personnalisée est remise pour chaque destination."),
    Bullet("Eventy oriente vers les sources officielles, ne se substitue jamais à un avis médical personnalisé."),
    Bullet("Confidentialité absolue des informations médicales partagées (cohérence Politique RGPD)."),
    Bullet("Pas de discrimination liée à un état de santé (cohérence Politique accessibilité PMR, RH)."),

    Spacer(160),
    P("Document de référence et information voyageur — Version 1.0 — 2 mai 2026. À adapter par destination.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Consignes sécurité destination, Document administratif voyageur, Pack Sérénité, Politique accessibilité PMR, Politique RGPD, Manuel d'incident voyage.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — DOCUMENT ADMINISTRATIF VOYAGEUR INTERNATIONAL
// ============================================================
function documentAdministratifVoyageur() {
  return [
    bandeauTitre(
      "DOCUMENT ADMINISTRATIF VOYAGEUR INTERNATIONAL",
      "Visas, passeports, formalités douanières — référentiel pratique Eventy",
    ),
    Spacer(160),

    P("Le présent document accompagne les voyageurs Eventy sur les formalités administratives nécessaires à un voyage international : pièces d'identité acceptées, visas, autorisations électroniques, formalités douanières, et démarches préalables au départ.", { italics: true }),

    P("Eventy informe et facilite, mais ne se substitue pas au voyageur pour les démarches personnelles. Les passeports, visas et autorisations sont à demander individuellement par chaque voyageur. En revanche, Eventy alerte sur les délais, les pièges courants et accompagne en cas de difficulté.", { italics: true }),

    H1("1. Pièces d'identité acceptées selon destination"),

    H2("1.1. Carte Nationale d'Identité (CNI)"),
    Bullet("Acceptée pour : France, UE, Andorre, Monaco, Saint-Marin, Vatican, Suisse, Norvège, Liechtenstein, Islande."),
    Bullet("CNI au format carte plastique uniquement (anciens modèles cartonnés progressivement non acceptés)."),
    Bullet("Validité : 15 ans pour les CNI délivrées entre 2004 et 2013, 10 ans pour les plus récentes."),
    Bullet("Vérifier la date de validité au moins 1 mois avant le départ."),

    H2("1.2. Passeport"),
    Bullet("Obligatoire pour toute destination hors UE."),
    Bullet("Validité : minimum 6 mois après la date de retour pour la plupart des pays."),
    Bullet("Pages vierges : minimum 2 pages vierges (parfois 4) pour les visas et tampons."),
    Bullet("Délai d'obtention : 4-6 semaines en France métropolitaine (jusqu'à 8-10 semaines en haute saison)."),
    Bullet("Coût : 86 € adulte, 42 € mineur 15-18 ans, 17 € mineur < 15 ans (tarifs 2026)."),

    H2("1.3. Cas spéciaux"),
    Bullet("Mineurs voyageant sans représentant légal : Autorisation de Sortie du Territoire (AST) obligatoire + photocopie CNI du représentant + le passeport ou CNI du mineur."),
    Bullet("Personnes en situation administrative particulière : titre de séjour en cours de validité + passeport du pays d'origine."),
    Bullet("Passeport biométrique requis pour entrée USA (depuis 2006)."),

    H1("2. Visas et autorisations électroniques"),

    H2("2.1. Espace Schengen et UE"),
    Bullet("Aucun visa pour les voyageurs français."),
    Bullet("CNI ou passeport en cours de validité suffit."),

    H2("2.2. Pays sans visa pour les Français (court séjour)"),
    Bullet("La plupart des pays développés accordent l'entrée sans visa pour 30 à 90 jours selon les pays."),
    Bullet("Exemples : Japon, Corée du Sud, Taïwan, Singapour, Malaisie, Thaïlande, Maroc, Tunisie, Égypte, Mexique, Argentine, Brésil, Pérou, Chili."),
    Bullet("Vérification à l'avance : France Diplomatie ou ambassade du pays."),

    H2("2.3. Pays nécessitant une autorisation électronique préalable"),
    makeTable({
      widths: [2496, 2496, 2496, 1872],
      header: ["Pays", "Système", "Délai obtention", "Coût indicatif"],
      rows: [
        ["États-Unis", "ESTA", "72 h (recommandé 7 j avant)", "21 USD"],
        ["Canada", "AVE/eTA", "Quelques minutes à 72 h", "7 CAD"],
        ["Royaume-Uni", "ETA (depuis 2025)", "3 jours ouvrés", "10 GBP"],
        ["Australie", "ETA / eVisitor", "24 h", "20 AUD"],
        ["Nouvelle-Zélande", "NZeTA", "72 h", "23 NZD"],
        ["Espace UE Schengen (étrangers)", "ETIAS (à partir 2026)", "Quelques minutes", "7 €"],
        ["Brésil (à partir 2026)", "VeM", "5 jours ouvrés", "80 USD"],
        ["Sri Lanka", "ETA", "1-2 jours", "35-50 USD"],
        ["Inde", "e-Visa", "3-5 jours", "10-100 USD selon durée"],
        ["Turquie", "e-Visa", "Quelques minutes", "Gratuit pour Français"],
      ],
    }),

    H2("2.4. Visa traditionnel (procédure ambassade)"),
    Bullet("Pays nécessitant un visa traditionnel : Russie, Chine, Iran, Algérie (selon situation), Cuba (carte de tourisme), etc."),
    Bullet("Délai d'obtention : 2-8 semaines selon ambassade."),
    Bullet("Pièces : passeport (validité min. 6 mois), photos, formulaire, justificatifs voyage, attestation hébergement."),
    Bullet("Coût variable (souvent 60-150 €)."),
    Bullet("Possibilité de passer par une agence (frais supplémentaires)."),

    H2("2.5. Visa à l'arrivée (« visa on arrival »)"),
    Bullet("Pays acceptant le visa à l'arrivée : Cambodge, Laos, certaines destinations africaines."),
    Bullet("Préparer espèces (USD souvent), photos d'identité, formulaire."),
    Bullet("Privilégier le e-Visa quand disponible (plus sûr)."),

    H1("3. Délais et anticipation"),
    makeTable({
      widths: [3744, 3744, 1872],
      header: ["Démarche", "Délai recommandé avant départ", "Coût indicatif"],
      rows: [
        ["Vérifier validité CNI / passeport", "60 j", "—"],
        ["Demande passeport (renouvellement)", "60 j (haute saison 90 j)", "86 €"],
        ["Visa traditionnel ambassade", "60 j minimum", "60-150 €"],
        ["Autorisation électronique (ESTA, ETA)", "14 j", "7-21 USD"],
        ["Vaccinations (carnet vaccination international)", "30 j", "20-150 € selon"],
        ["Permis de conduire international", "30 j (gratuit, en mairie)", "Gratuit"],
        ["Inscription Fil d'Ariane MEAE", "Avant départ", "Gratuit"],
        ["Assurance complémentaire voyage", "Avant départ", "Variable"],
      ],
    }),

    H1("4. Formalités douanières"),

    H2("4.1. Sortie de France"),
    Bullet("Devises : déclaration obligatoire pour transferts ≥ 10 000 €."),
    Bullet("Marchandises : interdictions sur produits contrefaits, espèces protégées, drogues."),
    Bullet("Médicaments : ordonnance + traduction anglaise dans la trousse."),

    H2("4.2. Entrée à destination"),
    Bullet("Vérifier les interdictions du pays (alcool, viande, produits laitiers, plantes, animaux)."),
    Bullet("Connaître les franchises (achats hors taxes acceptés)."),
    Bullet("Conserver les factures pour justifier les achats récents."),

    H2("4.3. Retour en France"),
    Bullet("Franchises : 430 € en avion/bateau, 300 € autres modes (au-delà : déclaration et taxes)."),
    Bullet("Tabac : 200 cigarettes ou 50 cigares ou 250 g tabac (de pays UE) ; 200/50/250 (hors UE)."),
    Bullet("Alcool : 16 L bière, 4 L vin tranquille, 2 L autre (UE) ; règles différentes hors UE."),
    Bullet("Espèces : déclaration ≥ 10 000 € à l'entrée et la sortie de l'UE."),
    Bullet("Interdictions : produits CITES (espèces protégées), contrefaçons, certaines plantes/animaux."),

    H1("5. Conduite à l'étranger"),

    H2("5.1. Permis de conduire"),
    Bullet("Permis français accepté : UE, EEE, Suisse, Andorre, Monaco — 1 an puis besoin d'échange."),
    Bullet("Permis international (gratuit, mairie) recommandé hors UE."),
    Bullet("Validité : 3 ans, ne remplace pas le permis français (à porter ensemble)."),
    Bullet("Permis pas accepté dans certains pays (Iran, Vietnam — location avec chauffeur)."),

    H2("5.2. Assurance véhicule"),
    Bullet("Vérifier l'extension internationale auprès de l'assureur."),
    Bullet("Carte verte (UE+ certains pays voisins)."),
    Bullet("Précautions location : assurance complémentaire LDW recommandée."),

    H1("6. Eventy : ce que nous prenons en charge"),
    Bullet("Information préalable sur les formalités spécifiques à la destination du voyage."),
    Bullet("Rappel J-60, J-30, J-7 sur les démarches restantes."),
    Bullet("Aide en cas de difficulté administrative (orientation vers les bonnes administrations)."),
    Bullet("Lettre attestation de voyage Eventy (utile pour visa traditionnel) sur demande."),
    Bullet("Coordination avec l'ambassade en cas de perte de papiers pendant le voyage."),
    Bullet("Coordination Pack Sérénité en cas de perte papiers (documents temporaires de retour)."),

    H1("7. Eventy : ce qui reste à la charge du voyageur"),
    Bullet("Demande et obtention de la pièce d'identité (CNI, passeport)."),
    Bullet("Demande et obtention du visa ou autorisation électronique."),
    Bullet("Vaccinations selon prescription médicale personnelle."),
    Bullet("Souscription d'assurances complémentaires éventuelles."),
    Bullet("Photocopies et numérisations des documents."),
    Bullet("Inscription Fil d'Ariane individuelle."),

    H1("8. En cas de perte / vol de papiers à l'étranger"),
    Numbered("Déclaration immédiate aux autorités locales (police) — récupérer un récépissé."),
    Numbered("Information immédiate à l'accompagnateur Eventy."),
    Numbered("Activation du Pack Sérénité (assistance documents)."),
    Numbered("Contact avec l'ambassade ou consulat de France."),
    Numbered("Demande de laissez-passer consulaire (retour France)."),
    Numbered("Au retour : signalement à la police française et demande de nouveau document."),

    H1("9. Documents à scanner et stocker en sécurité"),
    Bullet("Pièce d'identité (CNI ou passeport)."),
    Bullet("Visa et autorisations électroniques."),
    Bullet("Permis de conduire (français + international)."),
    Bullet("Carte vitale et CEAM."),
    Bullet("Carte assurance et numéros d'urgence."),
    Bullet("Réservations Eventy (confirmation, voucher Pack Sérénité)."),
    Bullet("Cartes bancaires (recto / numéros d'opposition)."),
    Bullet("Contacts d'urgence (famille, médecin, accompagnateur)."),
    Bullet("Stockage : email personnel + cloud sécurisé + impression papier conservée séparément."),

    H1("10. Engagement Eventy"),
    Bullet("Information honnête, à jour et neutre sur les formalités."),
    Bullet("Pas de jugement sur la situation administrative personnelle des voyageurs."),
    Bullet("Confidentialité absolue des informations partagées (cohérence Politique RGPD)."),
    Bullet("Refus de toute pratique commerciale exploitant la méconnaissance administrative."),
    Bullet("Aide concrète en cas de difficulté pendant le voyage (cohérence Pack Sérénité)."),

    Spacer(160),
    P("Document de référence et information voyageur — Version 1.0 — 2 mai 2026. Mise à jour annuelle et à chaque évolution réglementaire majeure.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Consignes sécurité destination, Fiche santé voyageur international, Pack Sérénité, Politique RGPD, Manuel d'incident voyage, Onboarding voyageur.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Consignes-Securite-Destination.docx",
      title: "Eventy Life — Consignes sécurité destination",
      description: "Modèle de fiche pays sécurité voyageur international.",
      footer: "EVENTY LIFE SAS — Consignes sécurité destination",
      children: consignesSecuriteDestination(),
    },
    {
      file: "docs/garanties/Eventy-Life-Fiche-Sante-Voyageur.docx",
      title: "Eventy Life — Fiche santé voyageur international",
      description: "Vaccinations, prophylaxies, hygiène et trousse de pharmacie.",
      footer: "EVENTY LIFE SAS — Fiche santé voyageur",
      children: ficheSanteVoyageur(),
    },
    {
      file: "docs/garanties/Eventy-Life-Document-Administratif-Voyageur.docx",
      title: "Eventy Life — Document administratif voyageur international",
      description: "Pièces d'identité, visas, formalités douanières.",
      footer: "EVENTY LIFE SAS — Document administratif voyageur",
      children: documentAdministratifVoyageur(),
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
