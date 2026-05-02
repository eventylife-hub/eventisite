/**
 * Eventy Life — Trois documents support et UX
 *
 *   1. Politique de support voyageur multicanal
 *   2. Politique de gestion des langues et traduction
 *   3. Plan de tests utilisateurs qualitatifs
 *
 * Usage : node scripts/garanties/build-support-multicanal-langues-tests-ux.js
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
// DOCUMENT 1 — POLITIQUE SUPPORT VOYAGEUR MULTICANAL
// ============================================================
function politiqueSupportMulticanal() {
  return [
    bandeauTitre(
      "POLITIQUE DE SUPPORT VOYAGEUR MULTICANAL",
      "Règles d'accueil et de réponse par téléphone, email et chat",
    ),
    Spacer(160),

    P("La présente politique formalise les règles de support voyageur d'EVENTY LIFE SAS sur les différents canaux : téléphone, email, chat en ligne, réseaux sociaux. Elle complète l'Onboarding voyageur, la Procédure de réclamation détaillée, le Manuel d'incident voyage, le Guide utilisation espace voyageur et la Politique de communication post-incident.", { italics: true }),

    P("Eventy croit en un support humain, réactif et bienveillant. Les voyageurs ne sont pas un volume à traiter — ce sont des personnes qui ont besoin d'être écoutées et accompagnées. Notre approche : sobriété (pas d'IA générative non maîtrisée), réactivité (délais clairs), humanité (un humain au bout du fil quand c'est nécessaire).", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Périmètre"),
    Bullet("Voyageurs avant réservation (prospects)."),
    Bullet("Voyageurs ayant réservé."),
    Bullet("Voyageurs en cours de voyage."),
    Bullet("Voyageurs en post-voyage (avis, réclamations, fidélisation)."),
    Bullet("Famille et proches en cas d'incident."),

    H2("1.2. Cinq principes"),
    Bullet("Humanité — un humain au bout du fil quand c'est important."),
    Bullet("Réactivité — délais clairs et respectés."),
    Bullet("Précision — réponse factuelle, sans jargon."),
    Bullet("Empathie — écoute active, refus de la condescendance."),
    Bullet("Transparence — refus du langage corporate trompeur."),

    H1("2. Canaux de support"),

    H2("2.1. Email (canal principal An 1)"),
    Bullet("Email général : contact@eventylife.fr."),
    Bullet("Email réservation : reservation@eventylife.fr."),
    Bullet("Email réclamation : reclamation@eventylife.fr."),
    Bullet("Email modification : modification@eventylife.fr."),
    Bullet("Email annulation : annulation@eventylife.fr."),
    Bullet("Email accessibilité : accessibilite@eventylife.fr."),
    Bullet("Cohérence avec Onboarding voyageur."),
    Bullet("Délai de réponse : ≤ 24 h ouvrées An 1, ≤ 4 h An 3."),

    H2("2.2. Téléphone"),
    Bullet("Numéro principal : à confirmer (cohérence Mentions légales)."),
    Bullet("Plages : 9h-12h30 / 14h-18h, lundi au vendredi."),
    Bullet("En dehors de ces plages : message vocal + rappel ≤ 24 h."),
    Bullet("Pendant un voyage en cours : numéro accompagnateur 24/7."),
    Bullet("En cas d'urgence Pack Sérénité : numéro spécifique 24/7."),

    H2("2.3. Chat en ligne (cible An 2)"),
    Bullet("Disponible sur eventylife.fr aux heures ouvrées."),
    Bullet("Réponse humaine en moins de 2 minutes."),
    Bullet("**Refus du chatbot IA non maîtrisé** (cohérence Roadmap technique : refus tout-IA)."),
    Bullet("Possibilité de FAQ guidée pour questions fréquentes."),

    H2("2.4. Réseaux sociaux"),
    Bullet("Cohérence avec Stratégie réseaux sociaux."),
    Bullet("Réponse aux DM sous 24 h ouvrées."),
    Bullet("Question complexe : redirection vers email contact@."),

    H2("2.5. Espace voyageur (eventylife.fr/mon-compte)"),
    Bullet("Messagerie intégrée (cohérence Guide utilisation espace voyageur)."),
    Bullet("Suivi des échanges historiques."),
    Bullet("Documents transmis automatiquement."),

    H1("3. Délais de réponse engagés"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Canal", "An 1", "An 3", "An 5"],
      rows: [
        ["Email standard", "≤ 24 h", "≤ 4 h", "≤ 2 h"],
        ["Email urgence (mention)", "≤ 4 h", "≤ 1 h", "≤ 30 min"],
        ["Téléphone (heures ouvrées)", "Décroché immédiat", "Décroché immédiat", "Décroché immédiat"],
        ["Téléphone (hors heures)", "Rappel ≤ 24 h", "Rappel ≤ 4 h", "Rappel ≤ 2 h"],
        ["Chat en ligne", "—", "≤ 2 min", "≤ 1 min"],
        ["Réseaux sociaux DM", "≤ 24 h", "≤ 4 h", "≤ 2 h"],
        ["Pack Sérénité 24/7", "Immédiat", "Immédiat", "Immédiat"],
      ],
    }),

    H1("4. Qualité de la réponse"),

    H2("4.1. Contenu"),
    Bullet("Salutation personnalisée (utiliser le prénom)."),
    Bullet("Reformulation de la demande pour vérification."),
    Bullet("Réponse factuelle et précise."),
    Bullet("Solution proposée ou délai si étude en cours."),
    Bullet("Signature avec prénom (humain), pas « Le service client »."),
    Bullet("Cohérence avec Charte éditoriale Eventy (tutoiement, ton chaleureux)."),

    H2("4.2. Refus structurés"),
    Bullet("Refus des réponses-types impersonnelles (« nous regrettons que vous ayez ressenti »)."),
    Bullet("Refus du jargon corporate (cohérence Charte éditoriale)."),
    Bullet("Refus de la condescendance."),
    Bullet("Refus de la déresponsabilisation (« ce n'est pas de notre faute »)."),
    Bullet("Refus de la promesse non tenue (engagement dans la limite du faisable)."),

    H1("5. Escalade"),

    H2("5.1. Niveau 1 — Équipe support"),
    Bullet("Questions courantes (réservations, modifications, infos)."),
    Bullet("Problèmes mineurs."),
    Bullet("Délai de résolution ≤ 24 h ouvrées."),

    H2("5.2. Niveau 2 — Référent qualité"),
    Bullet("Réclamations modérées."),
    Bullet("Demandes d'avoir / remboursement."),
    Bullet("Délai de résolution ≤ 7 jours."),
    Bullet("Cohérence Procédure de réclamation détaillée."),

    H2("5.3. Niveau 3 — Président"),
    Bullet("Réclamations majeures."),
    Bullet("Demandes d'indemnité > 200 €."),
    Bullet("Cas sensibles ou complexes."),
    Bullet("Délai de réponse ≤ 14 jours."),

    H2("5.4. Niveau 4 — Avocat partenaire"),
    Bullet("Risque juridique caractérisé."),
    Bullet("Litige formalisé."),
    Bullet("Cohérence Note avocat tourisme."),

    H1("6. Outils support"),

    H2("6.1. Outils internes"),
    Bullet("Boîte mail dédiée (Google Workspace) avec étiquettes par catégorie."),
    Bullet("CRM léger pour tracking (Pipedrive ou équivalent souverain)."),
    Bullet("Helpdesk (à étudier An 2 — préférence solution EU comme Zammad)."),
    Bullet("Refus des outils américains exposant données voyageurs (refus Zendesk, Intercom)."),

    H2("6.2. FAQ et auto-support"),
    Bullet("FAQ voyageurs publique sur eventylife.fr (cohérence FAQ voyageurs)."),
    Bullet("Articles d'aide approfondis."),
    Bullet("Vidéos tutorielles (cible An 2-3)."),
    Bullet("Glossaire (cohérence Glossaire voyage)."),

    H1("7. Formation équipe support"),
    Bullet("Onboarding 2 jours pour nouvel embauché support (cohérence Procédure de recrutement)."),
    Bullet("Maîtrise des procédures Eventy."),
    Bullet("Maîtrise de la charte éditoriale."),
    Bullet("Sensibilisation aux situations sensibles (deuil, handicap, vulnérabilité)."),
    Bullet("Module annuel de rappel."),
    Bullet("Cohérence avec Plan de formation interne."),

    H1("8. Mesures de qualité"),
    Bullet("CSAT (Customer Satisfaction) post-réponse (1 question rapide)."),
    Bullet("Délai de réponse mesuré automatiquement."),
    Bullet("Taux de résolution au premier contact (FCR)."),
    Bullet("Reporting mensuel équipe (cohérence Tableau de bord opérationnel)."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["CSAT moyen post-support", "≥ 4,3/5", "≥ 4,7/5"],
        ["Délai moyen réponse email", "≤ 12 h", "≤ 4 h"],
        ["Taux résolution premier contact", "≥ 70 %", "≥ 85 %"],
        ["Taux escalade Niveau 3+", "≤ 5 %", "≤ 2 %"],
        ["Plaintes liées au support", "≤ 2 %", "≤ 0,5 %"],
        ["Formation annuelle équipe", "100 %", "100 %"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Humanité avant tout (humain au bout du fil quand important)."),
    Bullet("Refus du chatbot IA non maîtrisé."),
    Bullet("Refus de la sous-traitance support à des tiers (au moins An 1-3)."),
    Bullet("Délais respectés en toutes circonstances."),
    Bullet("Refus de la déresponsabilisation."),
    Bullet("Confidentialité absolue des échanges."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Onboarding voyageur, Procédure de réclamation détaillée, Manuel d'incident voyage, Guide utilisation espace voyageur, Politique de communication post-incident, Charte éditoriale, Stratégie réseaux sociaux, Politique RGPD, Politique cybersécurité, Plan de formation interne, FAQ voyageurs, Glossaire voyage.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE LANGUES ET TRADUCTION
// ============================================================
function politiqueLanguesTraduction() {
  return [
    bandeauTitre(
      "POLITIQUE DE GESTION DES LANGUES ET TRADUCTION",
      "Qualité multilingue Eventy Life pour expansion européenne",
    ),
    Spacer(160),

    P("La présente politique formalise la gestion des langues et de la traduction chez EVENTY LIFE SAS dans la perspective de son expansion européenne. Elle complète le Plan d'expansion internationale, la Roadmap technique (volet internationalisation), la Charte éditoriale et la Politique d'achats responsables. Elle vise à garantir la qualité des traductions et la cohérence de l'âme Eventy en plusieurs langues.", { italics: true }),

    P("Eventy considère la langue comme un acte de respect : parler la langue de son voyageur, c'est lui montrer qu'on le considère. Notre approche : traductions humaines (refus des outils automatiques pour les contenus contractuels), adaptation culturelle (refus du calque mécanique), maintien de la cohérence éditoriale dans toutes les langues.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Calendrier des langues"),
    makeTable({
      widths: [2496, 2496, 2496, 1872],
      header: ["Langue", "Cible déploiement", "Périmètre", "Public"],
      rows: [
        ["Français", "An 1 (lancement)", "Intégral", "France + Belgique francophone + Suisse romande + Luxembourg"],
        ["Anglais", "An 1 (T4)", "Site + supports clés", "International + voyageurs anglophones"],
        ["Espagnol", "An 2 (T2)", "Intégral", "Espagne + Latino voyageurs"],
        ["Italien", "An 3 (T1)", "Intégral", "Italie"],
        ["Portugais", "An 3 (T3)", "Intégral", "Portugal"],
        ["Néerlandais", "An 4", "Intégral", "Pays-Bas + Belgique flamande"],
        ["Allemand", "An 5", "Intégral", "Allemagne + Autriche"],
      ],
    }),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes"),
    Bullet("Qualité humaine — refus de la traduction automatique pour les contenus contractuels."),
    Bullet("Adaptation culturelle — refus du calque mécanique."),
    Bullet("Cohérence éditoriale — l'âme Eventy traverse toutes les langues."),
    Bullet("Inclusivité — langage épicène quand possible (cohérence Charte éditoriale + Charte d'inclusion)."),
    Bullet("Maintenance — mises à jour synchronisées entre les versions."),

    H2("2.2. Refus structurés"),
    Bullet("Refus de Google Translate ou ChatGPT pour les contenus contractuels."),
    Bullet("Refus du « franglais » dans les versions FR (cohérence Charte éditoriale)."),
    Bullet("Refus de la traduction approximative."),
    Bullet("Refus de l'utilisation d'outils non européens pour les contenus sensibles."),
    Bullet("Refus de la traduction symbolique (annoncer multilingue avec une seule page traduite)."),

    H1("3. Hiérarchie des contenus"),

    H2("3.1. Niveau 1 — Contractuel et légal (traduction humaine obligatoire)"),
    Bullet("CGV (cohérence CGV Eventy)."),
    Bullet("Mentions légales."),
    Bullet("Politique RGPD."),
    Bullet("Politique cookies."),
    Bullet("Information précontractuelle."),
    Bullet("Bons de commande."),
    Bullet("Validation par avocat partenaire local pour les pays cibles."),

    H2("3.2. Niveau 2 — Communication officielle (traduction humaine recommandée)"),
    Bullet("Page d'accueil eventylife.fr."),
    Bullet("Fiches voyages."),
    Bullet("Pages produits (Pack Sérénité, programme Famille)."),
    Bullet("Emails transactionnels (confirmation, voucher, etc.)."),
    Bullet("Manuel voyageur autonome."),

    H2("3.3. Niveau 3 — Marketing (traduction humaine + adaptation)"),
    Bullet("Articles blog."),
    Bullet("Posts réseaux sociaux."),
    Bullet("Newsletters."),
    Bullet("Témoignages voyageurs (avec accord)."),
    Bullet("Adaptation culturelle requise (références, exemples, ton)."),

    H2("3.4. Niveau 4 — Communautaire (traduction assistée acceptée)"),
    Bullet("Posts groupe Facebook Famille."),
    Bullet("Réponses sur les réseaux sociaux."),
    Bullet("Contenus UGC."),
    Bullet("Outils de traduction assistée acceptés (DeepL, Reverso) sous validation humaine."),

    H1("4. Choix des prestataires"),

    H2("4.1. Critères de sélection"),
    Bullet("Traducteurs natifs de la langue cible."),
    Bullet("Spécialisation tourisme idéale (vocabulaire spécifique)."),
    Bullet("Localisation Europe (cohérence Politique d'achats responsables)."),
    Bullet("Engagement RSE (cohérence Politique RSE)."),
    Bullet("Outils utilisés (refus traduction automatique non révisée)."),

    H2("4.2. Refus de prestataires"),
    Bullet("Refus des plateformes de crowdsourcing (Gengo, Unbabel) sans validation humaine native."),
    Bullet("Refus des prestataires utilisant uniquement de la post-édition machine non révisée."),
    Bullet("Refus des prestataires offshore extractifs (cohérence Politique make/buy)."),

    H2("4.3. Modalités contractuelles"),
    Bullet("Contrat-cadre par langue."),
    Bullet("Tarification transparente (mot ou caractère)."),
    Bullet("Délais clairs (urgence vs standard)."),
    Bullet("Confidentialité (NDA)."),
    Bullet("Cohérence avec Politique d'achats responsables."),

    H1("5. Processus de traduction"),

    H2("5.1. Phase 1 — Brief"),
    Bullet("Document source finalisé en français."),
    Bullet("Glossaire Eventy fourni (cohérence Glossaire voyage)."),
    Bullet("Charte éditoriale Eventy fournie."),
    Bullet("Cible et contexte précisés."),

    H2("5.2. Phase 2 — Traduction"),
    Bullet("Traducteur humain natif de la langue cible."),
    Bullet("Délai standard : 7 j ouvrés pour 5 000 mots."),
    Bullet("Communication possible avec Eventy en cas de doute."),

    H2("5.3. Phase 3 — Relecture (3-eyes principle)"),
    Bullet("Premier traducteur fait la traduction."),
    Bullet("Second relecteur natif fait la relecture qualité."),
    Bullet("Validation finale Eventy (référent multilingue)."),

    H2("5.4. Phase 4 — Adaptation culturelle"),
    Bullet("Vérification des références culturelles (exemples, dates, devises)."),
    Bullet("Adaptation des images si nécessaire."),
    Bullet("Vérification des conventions locales (formats, ponctuation)."),

    H2("5.5. Phase 5 — Mise en ligne et maintenance"),
    Bullet("Intégration dans la plateforme (cohérence Roadmap technique)."),
    Bullet("Tests de rendu et qualité."),
    Bullet("Mise à jour synchronisée avec la version FR de référence."),

    H1("6. Glossaire multilingue Eventy"),
    Bullet("Glossaire de référence par langue (à constituer pour chaque déploiement)."),
    Bullet("Termes Eventy non traduits (« Pack Sérénité », « Eventy Famille » conservés)."),
    Bullet("Termes traduits (« voyageur » → « traveler », « viajero », etc.)."),
    Bullet("Cohérence avec Glossaire voyage."),

    H1("7. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Langues actives", "FR + EN", "5 langues"],
        ["Taux contenu Niveau 1 traduit", "100 %", "100 %"],
        ["Taux contenu Niveau 2 traduit", "≥ 80 %", "100 %"],
        ["Délai mise à jour multilingue (vs FR)", "≤ 30 j", "≤ 14 j"],
        ["Plaintes qualité traduction", "0", "0"],
        ["Audit qualité externe annuel", "0", "1"],
      ],
    }),

    H1("8. Engagements éthiques"),
    Bullet("Refus de la traduction symbolique (annonce sans réalité)."),
    Bullet("Refus du multilinguisme low-cost dégradé."),
    Bullet("Engagement à payer juste les traducteurs."),
    Bullet("Engagement à utiliser des outils EU pour les outils de traduction assistée (DeepL préféré à Google Translate)."),
    Bullet("Engagement à valider chaque traduction par un humain natif."),
    Bullet("Engagement à maintenir la cohérence avec l'âme Eventy."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan d'expansion internationale, Roadmap technique, Charte éditoriale, Charte d'inclusion et diversité, Politique d'achats responsables, Politique make/buy, CGV, Glossaire voyage, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PLAN DE TESTS UTILISATEURS QUALITATIFS
// ============================================================
function planTestsUtilisateursQualitatifs() {
  return [
    bandeauTitre(
      "PLAN DE TESTS UTILISATEURS QUALITATIFS EVENTY",
      "Méthodologie de recherche UX et compréhension voyageurs",
    ),
    Spacer(160),

    P("Le présent plan formalise la stratégie de recherche utilisateur qualitative chez EVENTY LIFE SAS. Il complète le Plan d'expérimentation et tests A/B (qui couvre les tests quantitatifs) et le Plan d'études et veille marché (qui couvre les études marché plus larges). Il pose un cadre pour comprendre les voyageurs en profondeur, au-delà des chiffres.", { italics: true }),

    P("Eventy croit qu'on conçoit mieux pour les voyageurs quand on les écoute vraiment. Notre approche : méthodologie sobre et sincère, refus de la manipulation, respect du temps des voyageurs interrogés, restitution honnête des résultats. La recherche utilisateur n'est pas un alibi marketing — c'est un outil de compréhension.", { italics: true }),

    H1("1. Objectifs"),
    Bullet("Comprendre les besoins, attentes et frustrations des voyageurs."),
    Bullet("Identifier les opportunités d'amélioration produit / service."),
    Bullet("Valider ou invalider des hypothèses produit."),
    Bullet("Tester des prototypes avant développement (cohérence Roadmap technique)."),
    Bullet("Alimenter la Procédure d'amélioration continue."),

    H1("2. Principes directeurs"),

    H2("2.1. Cinq principes éthiques"),
    Bullet("Respect — du temps et de la parole des voyageurs interrogés."),
    Bullet("Sincérité — refus de la manipulation, des questions orientées."),
    Bullet("Transparence — les voyageurs savent à quoi servent leurs réponses."),
    Bullet("Confidentialité — anonymisation systématique pour publication interne."),
    Bullet("Restitution honnête — refus de l'embellissement des résultats."),

    H2("2.2. Refus structurés"),
    Bullet("Refus des questions orientées qui forcent la réponse souhaitée."),
    Bullet("Refus de l'utilisation des résultats à des fins manipulatoires."),
    Bullet("Refus du recrutement biaisé (uniquement les voyageurs Famille satisfaits)."),
    Bullet("Refus du temps non rémunéré pour les sessions longues."),
    Bullet("Refus de la diffusion publique des verbatim sans accord."),

    H1("3. Méthodes de recherche utilisateur"),

    H2("3.1. Entretiens individuels (in-depth interviews)"),
    Bullet("Durée : 45-90 min."),
    Bullet("Format : visio ou présentiel."),
    Bullet("Questions ouvertes, écoute active."),
    Bullet("Enregistrement avec accord (transcription, anonymisation)."),
    Bullet("Indemnité 50-100 € selon durée et profil."),
    Bullet("Idéal pour : compréhension profonde, motivations, parcours."),

    H2("3.2. Tests utilisateurs (usability testing)"),
    Bullet("Durée : 30-60 min."),
    Bullet("Format : remote ou présentiel sur prototype ou produit existant."),
    Bullet("Tâches concrètes (« réserve un voyage à Marrakech »)."),
    Bullet("Observation des actions et verbalisation à voix haute."),
    Bullet("Indemnité 50 € pour 30-60 min."),
    Bullet("Idéal pour : ergonomie, parcours, friction."),

    H2("3.3. Sondage qualitatif ouvert"),
    Bullet("Durée : 5-10 min en ligne."),
    Bullet("Questions ouvertes."),
    Bullet("Volume : 50-200 réponses."),
    Bullet("Indemnité : avoir voyage 20 €."),
    Bullet("Idéal pour : volumes de retours, identification de tendances."),

    H2("3.4. Diary studies"),
    Bullet("Voyageur tient un journal pendant un voyage Eventy (avec accord)."),
    Bullet("Notes quotidiennes (humeur, points forts, frustrations)."),
    Bullet("Restitution post-voyage."),
    Bullet("Indemnité 100-200 €."),
    Bullet("Idéal pour : compréhension de l'expérience vécue."),

    H2("3.5. Card sorting / co-création"),
    Bullet("Voyageurs aident à structurer une fonctionnalité."),
    Bullet("Format atelier 2-3 h."),
    Bullet("Indemnité 100 €."),
    Bullet("Idéal pour : architecture information, priorisation."),

    H1("4. Recrutement des participants"),

    H2("4.1. Profils diversifiés"),
    Bullet("Refus du recrutement biaisé (uniquement Famille satisfaits)."),
    Bullet("Diversité d'âge, profil voyageur (solo, couple, famille), expérience (premier voyage / habitué)."),
    Bullet("Inclusion personnes en situation de handicap (cohérence Politique accessibilité PMR)."),
    Bullet("Diversité géographique (cohérence Plan d'expansion internationale)."),

    H2("4.2. Sources de recrutement"),
    Bullet("Communauté Eventy Famille (volontaires)."),
    Bullet("Voyageurs récents (avec accord post-voyage)."),
    Bullet("Prospects sur eventylife.fr (formulaire dédié)."),
    Bullet("Plateformes externes (Userlytics, Tresjuhli) si profil non disponible interne."),

    H2("4.3. Refus du recrutement opaque"),
    Bullet("Information transparente sur l'objectif de la recherche."),
    Bullet("Possibilité de refus sans justification."),
    Bullet("Pas de tromperie sur la finalité."),

    H1("5. Conduite des recherches"),

    H2("5.1. Préparation"),
    Bullet("Guide d'entretien validé (questions ouvertes, neutralité)."),
    Bullet("Formation du facilitateur (refus des biais cognitifs)."),
    Bullet("Outils techniques préparés (visio, enregistrement)."),

    H2("5.2. Pendant la session"),
    Bullet("Cadre clair (objectifs, durée, confidentialité)."),
    Bullet("Possibilité d'interrompre à tout moment."),
    Bullet("Écoute active, pas d'interruption inutile."),
    Bullet("Refus des questions suggestives."),

    H2("5.3. Après la session"),
    Bullet("Remerciement et indemnité versée sous 7 jours."),
    Bullet("Transcription anonymisée (cohérence Politique RGPD)."),
    Bullet("Synthèse partagée à l'équipe."),

    H1("6. Restitution des résultats"),

    H2("6.1. Format de la restitution"),
    Bullet("Synthèse écrite (5-10 pages)."),
    Bullet("Verbatim anonymisés."),
    Bullet("Insights clés (3-5 maximum)."),
    Bullet("Recommandations actionnables."),
    Bullet("Restitution équipe (atelier 60 min)."),

    H2("6.2. Honnêteté"),
    Bullet("Refus de l'embellissement des résultats."),
    Bullet("Refus de la sélection des verbatim positifs uniquement."),
    Bullet("Présentation des biais possibles."),
    Bullet("Cohérence avec Procédure d'amélioration continue."),

    H1("7. Volume et calendrier"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Activité de recherche", "An 1", "An 3"],
      rows: [
        ["Entretiens individuels / an", "≥ 10", "≥ 50"],
        ["Tests utilisateurs / an", "≥ 5", "≥ 30"],
        ["Sondages qualitatifs / an", "≥ 3", "≥ 8"],
        ["Diary studies / an", "0", "≥ 4"],
        ["Ateliers co-création / an", "0", "≥ 3"],
        ["Restitution équipe", "Trimestrielle", "Mensuelle"],
      ],
    }),

    H1("8. Outils"),
    Bullet("Visio : Google Meet ou solution EU."),
    Bullet("Enregistrement : avec accord, suppression après transcription."),
    Bullet("Outil de transcription : préférence solution EU (refus Google Cloud Speech)."),
    Bullet("Outil de synthèse : Notion ou Confluence (cohérence Plan de communication interne)."),
    Bullet("Sondages : Tally, Typeform (vérification RGPD), ou solution interne An 2-3."),
    Bullet("Refus des outils américains exposant données voyageurs (cohérence Politique cybersécurité)."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Voyageurs interrogés / an", "≥ 30", "≥ 200"],
        ["Diversité profils participants", "Audité", "Audité"],
        ["Insights actionnables / recherche", "≥ 3", "≥ 5"],
        ["Taux mise en œuvre recommandations", "≥ 50 %", "≥ 75 %"],
        ["Indemnités versées (juste prix)", "100 % conformes", "100 % conformes"],
        ["Anonymisation post-session", "100 %", "100 %"],
      ],
    }),

    H1("10. Engagements éthiques"),
    Bullet("Refus de la manipulation et des questions orientées."),
    Bullet("Indemnisation juste des participants."),
    Bullet("Confidentialité absolue des verbatim."),
    Bullet("Refus du recrutement biaisé."),
    Bullet("Restitution honnête des résultats."),
    Bullet("Refus de l'utilisation à des fins marketing manipulatoires."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan d'expérimentation et tests, Plan d'études et veille marché, Roadmap technique, Politique RGPD, Politique cybersécurité, Procédure d'amélioration continue, Politique image et droit à l'image, Politique d'achats responsables.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Support-Multicanal.docx",
      title: "Eventy Life — Politique de support voyageur multicanal",
      description: "Règles d'accueil et de réponse par téléphone, email et chat.",
      footer: "EVENTY LIFE SAS — Politique support multicanal",
      children: politiqueSupportMulticanal(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Langues-Traduction.docx",
      title: "Eventy Life — Politique de gestion des langues et traduction",
      description: "Qualité multilingue Eventy pour expansion européenne.",
      footer: "EVENTY LIFE SAS — Politique langues et traduction",
      children: politiqueLanguesTraduction(),
    },
    {
      file: "docs/garanties/Eventy-Life-Plan-Tests-Utilisateurs-Qualitatifs.docx",
      title: "Eventy Life — Plan de tests utilisateurs qualitatifs",
      description: "Méthodologie de recherche UX et compréhension voyageurs.",
      footer: "EVENTY LIFE SAS — Plan tests utilisateurs qualitatifs",
      children: planTestsUtilisateursQualitatifs(),
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
