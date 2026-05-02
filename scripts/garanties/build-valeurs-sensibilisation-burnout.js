/**
 * Eventy Life — Trois documents humain & culturel
 *
 *   1. Charte des valeurs et code éthique équipe
 *   2. Plan d'éducation et sensibilisation voyageurs
 *   3. Plan de prévention du burnout équipe
 *
 * Usage : node scripts/garanties/build-valeurs-sensibilisation-burnout.js
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
// DOCUMENT 1 — CHARTE DES VALEURS ET CODE ÉTHIQUE ÉQUIPE
// ============================================================
function charteValeursEthique() {
  return [
    bandeauTitre(
      "CHARTE DES VALEURS ET CODE ÉTHIQUE ÉQUIPE",
      "Culture interne et code de conduite des collaborateurs Eventy Life",
    ),
    Spacer(160),

    P("La présente charte formalise les valeurs et le code éthique de l'équipe d'EVENTY LIFE SAS. Elle complète la Charte télétravail (qui couvre l'organisation), la Procédure de recrutement (qui couvre l'arrivée), le Modèle d'entretien annuel (qui couvre le développement), la Politique anti-corruption et la Politique de gestion des conflits d'intérêts. Elle pose le socle culturel d'Eventy : ce qui nous unit, ce qui nous distingue, ce qui nous engage.", { italics: true }),

    P("Eventy n'est pas qu'une entreprise — c'est un projet humain. Notre culture interne reflète notre projet externe : chaleur, transparence, respect, refus de l'extraction. La présente charte n'est pas un texte officiel à classer ; c'est un engagement vivant, lu en équipe, discuté, mis à jour. Elle nous rappelle pourquoi on fait ce qu'on fait.", { italics: true }),

    H1("1. Cinq valeurs Eventy"),

    H2("1.1. Chaleur humaine"),
    Bullet("On accueille avec sincérité — nouveaux collaborateurs, voyageurs, partenaires."),
    Bullet("On préfère le « tu » à l'« vous » (sauf contexte protocolaire)."),
    Bullet("On prend le temps de connaître les gens, pas juste leur fonction."),
    Bullet("On célèbre les bons moments (anniversaires, succès, étapes)."),
    Bullet("On accompagne dans les moments difficiles."),

    H2("1.2. Transparence radicale"),
    Bullet("On dit la vérité, même quand c'est inconfortable."),
    Bullet("On partage l'information utile à chacun (refus de la rétention)."),
    Bullet("On reconnaît nos erreurs sans les masquer."),
    Bullet("On publie les chiffres clés (cohérence Politique RSE, rapport annuel)."),
    Bullet("On refuse le langage corporate qui cache plutôt qu'il n'éclaire."),

    H2("1.3. Refus de l'extraction"),
    Bullet("On ne maximise pas la marge contre les voyageurs."),
    Bullet("On ne maximise pas l'attention contre les voyageurs (refus dark patterns)."),
    Bullet("On ne maximise pas les heures contre les collaborateurs (cohérence Charte télétravail)."),
    Bullet("On refuse le dumping social ou fiscal."),
    Bullet("On refuse la rente extractive sur partenaires."),

    H2("1.4. Sobriété et durabilité"),
    Bullet("On privilégie ce qui dure à ce qui brille."),
    Bullet("On refuse la sur-consommation et le gaspillage."),
    Bullet("On adopte des outils sobres (cohérence Roadmap technique, refus tout-IA)."),
    Bullet("On engage notre empreinte carbone (cohérence Charte engagement carbone)."),
    Bullet("On préfère l'utile au bling."),

    H2("1.5. Apprentissage et humilité"),
    Bullet("On reconnaît qu'on ne sait pas tout."),
    Bullet("On apprend des erreurs (cohérence Procédure d'amélioration continue)."),
    Bullet("On accueille les retours, même critiques."),
    Bullet("On forme et on se forme (cohérence Plan de formation interne)."),
    Bullet("On refuse le « j'ai toujours raison »."),

    H1("2. Code de conduite individuel"),

    H2("2.1. Vis-à-vis des voyageurs"),
    Bullet("Considérer chaque voyageur comme une personne, pas un dossier."),
    Bullet("Respect absolu de la diversité (cohérence Charte d'inclusion et diversité)."),
    Bullet("Confidentialité des informations partagées (cohérence Politique RGPD)."),
    Bullet("Disponibilité raisonnée (cohérence Politique support multicanal)."),
    Bullet("Refus de toute pratique commerciale manipulatrice (cohérence Charte commerciale)."),

    H2("2.2. Vis-à-vis de l'équipe"),
    Bullet("Refus du dénigrement entre collègues."),
    Bullet("Refus du favoritisme et du copinage opaque."),
    Bullet("Soutien des collègues en difficulté."),
    Bullet("Reconnaissance des contributions de chacun."),
    Bullet("Refus du harcèlement, des micro-agressions, des comportements toxiques."),

    H2("2.3. Vis-à-vis des partenaires"),
    Bullet("Égalité de traitement entre partenaires (HRA, créateurs, vendeurs, ambassadeurs)."),
    Bullet("Confidentialité des informations sensibles."),
    Bullet("Refus du conflit d'intérêts non déclaré (cohérence Politique conflits d'intérêts)."),
    Bullet("Refus de tout pot-de-vin ou cadeau inapproprié (cohérence Politique anti-corruption)."),
    Bullet("Paiement juste et à temps."),

    H2("2.4. Vis-à-vis de l'entreprise"),
    Bullet("Loyauté (refus de la concurrence cachée)."),
    Bullet("Confidentialité des secrets d'affaires."),
    Bullet("Bon usage des ressources (cohérence Politique notes de frais)."),
    Bullet("Engagement à signaler tout manquement éthique observé (cohérence Procédure de signalement)."),
    Bullet("Représentation honorable d'Eventy à l'extérieur."),

    H1("3. Engagements forts opposables"),

    H2("3.1. Refus structurés (interdits)"),
    Bullet("Refus du harcèlement sexuel ou moral (sanction immédiate)."),
    Bullet("Refus de la discrimination sur les 25 critères (cohérence Charte d'inclusion)."),
    Bullet("Refus de la fraude (notes de frais, comptabilité, etc.)."),
    Bullet("Refus de la corruption sous toute forme."),
    Bullet("Refus de la divulgation de secrets d'affaires."),
    Bullet("Refus de la consommation de drogues ou alcool excessif au travail."),
    Bullet("Refus de la mise en danger des voyageurs ou collègues."),

    H2("3.2. Engagements positifs"),
    Bullet("Refuser l'inacceptable (signalement systématique)."),
    Bullet("Soutenir la diversité activement."),
    Bullet("Maintenir la qualité même sous pression."),
    Bullet("Préserver la sécurité voyageur en toutes circonstances."),
    Bullet("Protéger la confidentialité des données voyageurs (cohérence Politique RGPD)."),

    H1("4. Vie d'équipe"),

    H2("4.1. Rituels (cohérence Plan de communication interne)"),
    Bullet("Mardi de l'équipe — moment hebdomadaire commun."),
    Bullet("Café du jeudi — sujets libres."),
    Bullet("Démo vendredi — célébrer ce qui a été livré."),
    Bullet("Anniversaires d'embauche."),
    Bullet("Anniversaire d'Eventy (juin) — tous ensemble."),

    H2("4.2. Modes de travail"),
    Bullet("Hybride flexible (cohérence Charte télétravail)."),
    Bullet("Plages communes 10h-12h30 / 14h-17h."),
    Bullet("Droit à la déconnexion absolu."),
    Bullet("Refus du sur-travail glorifié."),
    Bullet("Refus du travail nocturne ou weekend (sauf astreinte voyage en cours)."),

    H2("4.3. Reconnaissance"),
    Bullet("Mention dans la newsletter interne mensuelle."),
    Bullet("Reconnaissance lors des all-hands."),
    Bullet("Cohérence avec Modèle d'entretien annuel."),
    Bullet("Refus de l'incentive financier court-termiste."),

    H1("5. Sanctions en cas de manquement"),

    H2("5.1. Manquements mineurs"),
    Bullet("Discussion bienveillante et explication."),
    Bullet("Avertissement écrit possible."),
    Bullet("Plan d'amélioration personnel."),

    H2("5.2. Manquements modérés"),
    Bullet("Avertissement formel écrit."),
    Bullet("Sanction disciplinaire (mise à pied)."),
    Bullet("Suivi rapproché."),

    H2("5.3. Manquements graves"),
    Bullet("Licenciement pour faute grave."),
    Bullet("Action en justice si applicable (corruption, vol)."),
    Bullet("Cohérence avec Procédure de signalement."),

    H1("6. Diffusion et appropriation"),
    Bullet("Lecture obligatoire à l'arrivée (cohérence Procédure de recrutement)."),
    Bullet("Discussion en équipe lors de l'onboarding."),
    Bullet("Rappel annuel obligatoire (cohérence Plan de formation interne)."),
    Bullet("Mise à jour annuelle co-construite avec l'équipe."),
    Bullet("Affichage dans les locaux Eventy."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["NPS interne (eNPS)", "≥ + 30", "≥ + 50"],
        ["Sondage adhésion aux valeurs", "≥ 80 %", "≥ 90 %"],
        ["Plaintes harcèlement / discrimination", "0", "0"],
        ["Manquements graves (licenciement)", "0", "0"],
        ["Lecture annuelle de la charte", "100 %", "100 %"],
        ["Turnover involontaire", "< 5 %", "< 3 %"],
      ],
    }),

    H1("8. Engagements opposables Eventy envers l'équipe"),
    Bullet("Respect des valeurs énoncées."),
    Bullet("Reconnaissance des contributions."),
    Bullet("Non-représailles contre signalements (cohérence Procédure de signalement)."),
    Bullet("Égalité de traitement absolue."),
    Bullet("Formation et développement (cohérence Plan de formation interne)."),
    Bullet("Bien-être au travail (cohérence Charte télétravail)."),
    Bullet("Refus de l'extraction de l'humain."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle co-construite équipe.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : AME-EVENTY.md, Charte télétravail, Procédure de recrutement, Modèle d'entretien annuel, Politique anti-corruption, Politique conflits d'intérêts, Procédure de signalement, Charte d'inclusion et diversité, Plan de formation interne, Plan de communication interne, Politique notes de frais, Charte commerciale.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PLAN ÉDUCATION ET SENSIBILISATION VOYAGEURS
// ============================================================
function planEducationSensibilisationVoyageurs() {
  return [
    bandeauTitre(
      "PLAN D'ÉDUCATION ET SENSIBILISATION VOYAGEURS",
      "Transparence radicale en action — pré-voyage, voyage, post-voyage",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie d'éducation et de sensibilisation des voyageurs d'EVENTY LIFE SAS. Il complète l'Onboarding voyageur, le Manuel voyageur autonome, le Glossaire voyage et la Charte engagement carbone. Il vise à rendre les voyageurs acteurs informés et conscients, plutôt que consommateurs passifs.", { italics: true }),

    P("Eventy croit qu'un voyageur informé est un voyageur respecté. Notre approche : sensibilisation sobre (refus de la moralisation), informations utiles (pas de greenwashing), respect de la liberté individuelle (refus de l'injonction). On éduque par l'exemple, par la transparence, par la mise à disposition d'informations de qualité.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Périmètre"),
    Bullet("Voyageurs avant réservation (information transparente)."),
    Bullet("Voyageurs ayant réservé (préparation au voyage)."),
    Bullet("Voyageurs en cours de voyage (sensibilisation sobre)."),
    Bullet("Voyageurs post-voyage (réflexion, prolongement)."),

    H2("1.2. Cinq principes"),
    Bullet("Transparence — informations factuelles et sourcées."),
    Bullet("Sobriété — refus de la moralisation infantilisante."),
    Bullet("Respect — refus de l'injonction comportementale."),
    Bullet("Utilité — informations actionnables, pas théoriques."),
    Bullet("Bienveillance — accompagner, pas juger."),

    H2("1.3. Refus structurés"),
    Bullet("Refus de la culpabilisation (« vous êtes responsable de la planète »)."),
    Bullet("Refus du marketing vert (greenwashing)."),
    Bullet("Refus de la pression à un comportement spécifique."),
    Bullet("Refus du paternalisme (« nous savons mieux que vous »)."),
    Bullet("Refus de l'éducation conditionnelle (« si vous voyagez avec nous, vous devez... »)."),

    H1("2. Phase pré-réservation"),

    H2("2.1. Sur le site eventylife.fr"),
    Bullet("Émissions CO2eq estimées par voyage (cohérence Plan gestion environnementale destinations)."),
    Bullet("Décomposition transparente des prix (cohérence Charte commerciale)."),
    Bullet("Niveau d'accessibilité PMR clair (cohérence Politique accessibilité PMR)."),
    Bullet("Difficulté physique honnête."),
    Bullet("Conditions sanitaires et sécuritaires (cohérence Consignes sécurité destination)."),

    H2("2.2. Glossaire et FAQ"),
    Bullet("Cohérence avec Glossaire voyage (35+ termes expliqués)."),
    Bullet("Cohérence avec FAQ voyageurs (23 questions organisées)."),
    Bullet("Disponibles en accès libre."),

    H2("2.3. Ressources externes"),
    Bullet("Lien vers France Diplomatie (sécurité)."),
    Bullet("Lien vers Pasteur (santé)."),
    Bullet("Lien vers ANCV (chèques-vacances)."),
    Bullet("Refus de la promotion d'opérateurs concurrents (cohérence Charte éditoriale)."),

    H1("3. Phase préparation voyage (J-30 à J-1)"),

    H2("3.1. Roadbook voyageur (J-30)"),
    Bullet("Programme jour par jour."),
    Bullet("Conseils pratiques (climat, monnaie, prises électriques)."),
    Bullet("Coutumes locales (sans stéréotypes — cohérence Charte d'inclusion)."),
    Bullet("Documents nécessaires (cohérence Document administratif voyageur)."),
    Bullet("Recommandations sanitaires (cohérence Fiche santé voyageur international)."),

    H2("3.2. Sensibilisation environnementale (sobre)"),
    Bullet("Émissions estimées du voyage choisi."),
    Bullet("Possibilité de compensation carbone (option)."),
    Bullet("Éco-gestes simples sur place (eau, énergie, déchets)."),
    Bullet("Refus de l'injonction (« vous devez compenser »)."),

    H2("3.3. Sensibilisation culturelle"),
    Bullet("Spécificités locales (langue, salutations, code vestimentaire)."),
    Bullet("Refus du tourisme culturel extractif (refus du « tourisme zoo »)."),
    Bullet("Encouragement aux rencontres locales authentiques."),
    Bullet("Mention des sites incontournables ET des sites moins fréquentés (refus de la sur-fréquentation)."),

    H1("4. Phase voyage (sur place)"),

    H2("4.1. Briefings accompagnateur (cohérence Méthodologie d'animation accompagnateur)"),
    Bullet("Rappel des éco-gestes en début de voyage."),
    Bullet("Information sur les coutumes locales."),
    Bullet("Conseils pratiques quotidiens."),
    Bullet("Refus de la moralisation."),

    H2("4.2. Rencontres locales authentiques"),
    Bullet("Au moins 1 activité « engagement local » par voyage (cohérence Méthodologie de création de voyage)."),
    Bullet("Rencontre artisans, agriculteurs, communautés locales (avec accord)."),
    Bullet("Refus de la mise en scène artificielle."),
    Bullet("Refus du « tourisme zoo » (visite de communautés vulnérables sans dignité)."),

    H2("4.3. Information complémentaire"),
    Bullet("Histoire locale, contexte sociétal."),
    Bullet("Sites moins fréquentés à découvrir si voyageur souhaite."),
    Bullet("Bonnes adresses recommandées (commerces locaux, ESS)."),

    H1("5. Phase post-voyage"),

    H2("5.1. Email J+1 (cohérence Onboarding voyageur)"),
    Bullet("Remerciement personnalisé."),
    Bullet("Photos / vidéos collectives (avec accords)."),
    Bullet("Demande NPS et avis."),

    H2("5.2. Carte postale digitale J+15"),
    Bullet("Récapitulatif des temps forts du voyage."),
    Bullet("Anecdotes vécues (avec accord des voyageurs concernés)."),
    Bullet("Possibilité de prolonger l'aventure (programme Famille, parrainage)."),

    H2("5.3. Communauté Eventy Famille"),
    Bullet("Cohérence avec Plan d'animation communauté Famille."),
    Bullet("Échange entre voyageurs (entraide, recommandations)."),
    Bullet("Possibilité de proposer une destination."),

    H2("5.4. Approfondissement"),
    Bullet("Newsletter mensuelle Famille avec contenus inspirationnels."),
    Bullet("Articles blog sur destinations et cultures."),
    Bullet("Possibilité de témoignage (cohérence Politique image et droit à l'image)."),

    H1("6. Sujets de sensibilisation prioritaires"),

    H2("6.1. Empreinte carbone (cohérence Charte engagement carbone)"),
    Bullet("Comprendre l'empreinte de son voyage."),
    Bullet("Comparaison vs voyage individuel."),
    Bullet("Possibilité de compensation."),
    Bullet("Modes de transport alternatifs (train, bas-carbone)."),

    H2("6.2. Surtourisme (cohérence Grille de décision destinations)"),
    Bullet("Comprendre le concept et les enjeux."),
    Bullet("Eventy refuse les destinations surtouristiques (en saison pic)."),
    Bullet("Encouragement à la saisonnalité raisonnée."),

    H2("6.3. Économie locale et circulaire"),
    Bullet("Soutien aux acteurs locaux (HRA, artisans)."),
    Bullet("Achats responsables (cohérence Politique d'achats responsables)."),
    Bullet("Refus de l'extraction et de l'évasion fiscale touristique."),

    H2("6.4. Diversité et respect"),
    Bullet("Respect des coutumes locales sans relativisme excessif."),
    Bullet("Refus du regard extractif sur les populations."),
    Bullet("Cohérence avec Charte d'inclusion et diversité."),

    H2("6.5. Sécurité et santé"),
    Bullet("Cohérence avec Consignes sécurité destination + Fiche santé voyageur."),
    Bullet("Information factuelle, pas anxiogène."),

    H1("7. Outils pédagogiques"),
    Bullet("Roadbook voyageur (envoyé J-30)."),
    Bullet("Manuel voyageur autonome (handbook pratique)."),
    Bullet("Glossaire voyage (35+ termes)."),
    Bullet("FAQ voyageurs (23 questions)."),
    Bullet("Articles blog dédiés."),
    Bullet("Vidéos courtes thématiques (cible An 2-3)."),
    Bullet("Briefings accompagnateurs (sur place)."),

    H1("8. Engagements éthiques"),
    Bullet("Refus de la moralisation infantilisante."),
    Bullet("Refus du greenwashing pédagogique."),
    Bullet("Information factuelle et sourcée."),
    Bullet("Respect de la liberté individuelle."),
    Bullet("Refus de la conditionnalité (« vous devez »)."),
    Bullet("Education par l'exemple, pas par l'injonction."),
    Bullet("Refus du « tourisme zoo » et du regard extractif."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Voyageurs ayant lu roadbook", "≥ 90 %", "≥ 95 %"],
        ["Voyageurs adoptant éco-gestes (déclaratif)", "≥ 60 %", "≥ 80 %"],
        ["NPS sensibilisation pré-voyage", "≥ + 70", "≥ + 80"],
        ["Plaintes injonction / culpabilisation", "0", "0"],
        ["Articles pédagogiques publiés / an", "≥ 10", "≥ 30"],
        ["Activités engagement local / voyage", "≥ 1", "≥ 2"],
      ],
    }),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Onboarding voyageur, Manuel voyageur autonome, Glossaire voyage, FAQ voyageurs, Charte engagement carbone, Plan gestion environnementale destinations, Méthodologie de création de voyage, Méthodologie d'animation accompagnateur, Charte commerciale, Charte éditoriale, Charte d'inclusion et diversité, Plan d'animation communauté Famille.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN PRÉVENTION BURNOUT ÉQUIPE
// ============================================================
function planPreventionBurnout() {
  return [
    bandeauTitre(
      "PLAN DE PRÉVENTION DU BURNOUT ÉQUIPE EVENTY",
      "Santé mentale, charge de travail et soutien des collaborateurs",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie de prévention du burnout chez EVENTY LIFE SAS. Il complète la Charte télétravail (qui couvre le droit à la déconnexion), le Modèle d'entretien annuel (qui couvre l'évaluation bien-être), la Charte des valeurs et code éthique équipe et le Plan de communication interne. Il vise à protéger la santé mentale des collaborateurs Eventy, condition essentielle d'une entreprise qui dure.", { italics: true }),

    P("Eventy refuse la culture du sur-travail glorifié. Notre approche : prévention active, signaux faibles surveillés, droit absolu à la déconnexion, refus de la culpabilisation des collaborateurs en difficulté. Un collaborateur en burnout est un échec d'organisation, pas un échec individuel. C'est notre responsabilité.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Cadre légal"),
    Bullet("Code du travail — articles L4121-1 à L4121-5 (obligation de sécurité)."),
    Bullet("Article L1152-1 — protection contre le harcèlement moral."),
    Bullet("Articles L4624-1 et suivants — services de santé au travail."),
    Bullet("Recommandations INRS sur les risques psycho-sociaux."),

    H2("1.2. Définition du burnout"),
    Bullet("Épuisement professionnel caractérisé par : épuisement émotionnel, dépersonnalisation, perte du sens du travail."),
    Bullet("Syndrome reconnu par l'OMS (CIM-11)."),
    Bullet("Conséquence d'une exposition prolongée à un stress chronique au travail."),
    Bullet("Réversible mais nécessite intervention rapide."),

    H1("2. Engagements Eventy"),

    H2("2.1. Cinq principes"),
    Bullet("Prévention active — refus du curatif comme stratégie."),
    Bullet("Anticipation — surveiller les signaux faibles."),
    Bullet("Bienveillance — refus de la culpabilisation."),
    Bullet("Confidentialité — protection absolue des collaborateurs en difficulté."),
    Bullet("Action concrète — au-delà des mots, des mesures."),

    H2("2.2. Refus structurés"),
    Bullet("Refus de la culture du sur-travail glorifié (« il bosse jusqu'à 22h »)."),
    Bullet("Refus du présentéisme."),
    Bullet("Refus de la pression à répondre aux emails hors heures."),
    Bullet("Refus du non-prise des congés."),
    Bullet("Refus du « bon travailleur = épuisé »."),
    Bullet("Refus de la culpabilisation des arrêts maladie."),

    H1("3. Facteurs de risque identifiés"),

    H2("3.1. Charge de travail excessive"),
    Bullet("Heures supplémentaires régulières."),
    Bullet("Volume de tâches dépassant les capacités."),
    Bullet("Suivi par manager direct lors de l'entretien hebdomadaire."),

    H2("3.2. Manque d'autonomie"),
    Bullet("Sentiment de ne pas maîtriser son travail."),
    Bullet("Décisions imposées sans concertation."),
    Bullet("Cohérence avec Charte des valeurs (humilité, refus du dirigisme)."),

    H2("3.3. Conflits relationnels"),
    Bullet("Tensions équipe non résolues."),
    Bullet("Comportements toxiques (cohérence Charte des valeurs)."),
    Bullet("Cohérence avec Procédure de signalement."),

    H2("3.4. Manque de reconnaissance"),
    Bullet("Travail invisible ou peu valorisé."),
    Bullet("Compensation financière inadaptée."),
    Bullet("Cohérence avec Modèle d'entretien annuel."),

    H2("3.5. Perte de sens"),
    Bullet("Désaccord avec les orientations Eventy."),
    Bullet("Sentiment d'inutilité du travail."),
    Bullet("Cohérence avec AME-EVENTY.md (manifeste fondateur)."),

    H1("4. Mesures préventives"),

    H2("4.1. Organisation du travail"),
    Bullet("Charte télétravail (hybride flexible — cohérence document dédié)."),
    Bullet("Plages communes 10h-12h30 / 14h-17h (refus du « toujours dispo »)."),
    Bullet("Droit à la déconnexion absolu (cohérence Charte télétravail)."),
    Bullet("Pas de communication tardive (avant 8h, après 21h sauf urgence voyage)."),
    Bullet("Refus du travail nocturne ou weekend (sauf astreinte)."),

    H2("4.2. Charge de travail"),
    Bullet("Suivi de la charge en réunion hebdomadaire avec manager."),
    Bullet("Possibilité de signaler une surcharge sans jugement."),
    Bullet("Réajustement des priorités si nécessaire."),
    Bullet("Refus de la sur-promesse aux voyageurs au détriment des équipes."),

    H2("4.3. Reconnaissance"),
    Bullet("Mention dans la newsletter interne mensuelle."),
    Bullet("Reconnaissance lors des all-hands."),
    Bullet("Cohérence avec Modèle d'entretien annuel (révisions salariales annuelles)."),

    H2("4.4. Sens et autonomie"),
    Bullet("Cohérence avec AME-EVENTY.md (mission claire)."),
    Bullet("Implication dans les décisions structurantes."),
    Bullet("Possibilité de proposer des idées (cohérence Procédure d'amélioration continue)."),

    H1("5. Détection et signaux faibles"),

    H2("5.1. Sondages internes"),
    Bullet("Sondage trimestriel anonyme (cohérence Plan de communication interne)."),
    Bullet("Questions sur charge, autonomie, reconnaissance, sens, climat."),
    Bullet("Restitution publique des résultats agrégés (anonymisés)."),
    Bullet("Plan d'action si signaux faibles détectés."),

    H2("5.2. Entretien annuel"),
    Bullet("Question explicite sur le bien-être (cohérence Modèle d'entretien annuel)."),
    Bullet("Suivi de l'évolution dans le temps."),
    Bullet("Possibilité d'aborder les difficultés en confiance."),

    H2("5.3. Signaux d'alerte"),
    Bullet("Augmentation des heures supplémentaires."),
    Bullet("Diminution de la qualité du travail."),
    Bullet("Absentéisme."),
    Bullet("Repli sur soi, irritabilité."),
    Bullet("Plaintes corporelles répétées (fatigue, douleurs)."),
    Bullet("Conflits relationnels."),

    H1("6. Soutien aux collaborateurs en difficulté"),

    H2("6.1. Première étape — Discussion bienveillante"),
    Bullet("Manager direct ou Président initie une discussion."),
    Bullet("Confidentialité absolue."),
    Bullet("Écoute active, pas de jugement."),
    Bullet("Identification des facteurs concrets."),

    H2("6.2. Deuxième étape — Mesures d'aménagement"),
    Bullet("Allègement de la charge."),
    Bullet("Redistribution de tâches."),
    Bullet("Possibilité de télétravail renforcé."),
    Bullet("Aménagement horaires."),

    H2("6.3. Troisième étape — Soutien externe"),
    Bullet("Médecin du travail (consultation possible)."),
    Bullet("Psychologue partenaire (séances prises en charge — cible An 2)."),
    Bullet("Coaching professionnel si pertinent."),

    H2("6.4. Quatrième étape — Arrêt si nécessaire"),
    Bullet("Arrêt maladie respecté sans culpabilisation."),
    Bullet("Maintien du salaire pendant la durée légale."),
    Bullet("Retour progressif accompagné."),
    Bullet("Refus de la pression au retour anticipé."),

    H1("7. Référents et acteurs"),
    Bullet("Référent harcèlement et discrimination (≥ 11 salariés — anticipation Eventy)."),
    Bullet("Médecin du travail (service interentreprises)."),
    Bullet("Psychologue partenaire externe (cible An 2)."),
    Bullet("Cohérence avec Procédure de signalement (alerte@eventylife.fr)."),

    H1("8. Formation et sensibilisation"),
    Bullet("Sensibilisation aux RPS dans l'onboarding (cohérence Procédure de recrutement)."),
    Bullet("Module annuel de rappel."),
    Bullet("Formation managers à la détection des signaux faibles (cohérence Plan de formation interne)."),
    Bullet("Communication sur les ressources disponibles."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Cas de burnout", "0", "0"],
        ["Arrêts maladie longue durée (RPS)", "0", "0"],
        ["NPS interne (eNPS)", "≥ + 30", "≥ + 50"],
        ["Charge de travail moyenne (heures/semaine)", "≤ 40 h", "≤ 38 h"],
        ["Taux de prise des congés", "100 %", "100 %"],
        ["Sondage bien-être ≥ 7/10", "≥ 80 %", "≥ 90 %"],
      ],
    }),

    H1("10. Engagements opposables"),
    Bullet("Refus de la culture du sur-travail."),
    Bullet("Droit à la déconnexion absolu."),
    Bullet("Refus de la culpabilisation des arrêts maladie."),
    Bullet("Confidentialité absolue des cas individuels."),
    Bullet("Soutien externe (psychologue, médecin) en cas de besoin."),
    Bullet("Anticipation et prévention plutôt que curatif."),
    Bullet("Refus du double standard (dirigeant inclus dans la prévention)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte télétravail, Charte des valeurs et code éthique équipe, Modèle d'entretien annuel, Procédure de recrutement, Procédure de signalement, Politique de gestion des conflits d'intérêts, Plan de communication interne, Plan de formation interne, Politique RSE (pilier social), AME-EVENTY.md.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Charte-Valeurs-Ethique-Equipe.docx",
      title: "Eventy Life — Charte des valeurs et code éthique équipe",
      description: "Culture interne et code de conduite des collaborateurs Eventy.",
      footer: "EVENTY LIFE SAS — Charte valeurs et éthique équipe",
      children: charteValeursEthique(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Education-Sensibilisation-Voyageurs.docx",
      title: "Eventy Life — Plan d'éducation et sensibilisation voyageurs",
      description: "Transparence radicale en action — pré, pendant, post-voyage.",
      footer: "EVENTY LIFE SAS — Plan éducation voyageurs",
      children: planEducationSensibilisationVoyageurs(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Prevention-Burnout.docx",
      title: "Eventy Life — Plan de prévention du burnout équipe",
      description: "Santé mentale, charge de travail et soutien des collaborateurs.",
      footer: "EVENTY LIFE SAS — Plan prévention burnout équipe",
      children: planPreventionBurnout(),
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
