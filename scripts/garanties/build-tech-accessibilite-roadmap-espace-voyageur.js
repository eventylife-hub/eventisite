/**
 * Eventy Life — Trois documents tech / UX
 *
 *   1. Plan d'accessibilité numérique (WCAG 2.1 AA / RGAA)
 *   2. Roadmap technique Eventy (3 ans)
 *   3. Guide utilisation espace voyageur eventylife.fr
 *
 * Usage : node scripts/garanties/build-tech-accessibilite-roadmap-espace-voyageur.js
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
// DOCUMENT 1 — PLAN D'ACCESSIBILITÉ NUMÉRIQUE
// ============================================================
function planAccessibiliteNumerique() {
  return [
    bandeauTitre(
      "PLAN D'ACCESSIBILITÉ NUMÉRIQUE EVENTY",
      "Engagement WCAG 2.1 AA / RGAA — pluriannuel et déclaration",
    ),
    Spacer(160),

    P("Le présent plan formalise l'engagement d'EVENTY LIFE SAS en matière d'accessibilité numérique sur l'ensemble de ses interfaces digitales : eventylife.fr (site public), portails partenaires (créateurs, vendeurs, HRA, ambassadeurs), espace voyageur, applications mobiles futures.", { italics: true }),

    P("Eventy n'est pas formellement assujettie à l'obligation légale d'accessibilité (Code du numérique L102, applicable aux entités publiques et grandes entreprises > 250 M€ CA). Eventy choisit néanmoins de se conformer volontairement aux référentiels WCAG 2.1 AA et RGAA 4 — par cohérence avec sa Politique accessibilité PMR et ses engagements RSE.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("WCAG 2.1 AA (Web Content Accessibility Guidelines) — référentiel international du W3C."),
    Bullet("RGAA 4 (Référentiel Général d'Amélioration de l'Accessibilité) — version française adaptée."),
    Bullet("Loi du 11 février 2005 pour l'égalité des droits et des chances."),
    Bullet("Directive (UE) 2016/2102 sur l'accessibilité des sites web et applications mobiles publics."),
    Bullet("Politique accessibilité PMR Eventy (cohérence)."),
    Bullet("Politique RSE Eventy — pilier social."),

    H1("2. Niveau d'engagement"),

    H2("2.1. Cible An 1 — Conformité partielle"),
    Bullet("Conformité aux critères WCAG 2.1 niveau A (35 critères)."),
    Bullet("Conformité prioritaire aux critères AA les plus impactants."),
    Bullet("Audit initial réalisé sur les pages critiques (homepage, fiche voyage, parcours réservation)."),
    Bullet("Publication de la déclaration d'accessibilité sur eventylife.fr/accessibilite."),

    H2("2.2. Cible An 3 — Conformité totale WCAG 2.1 AA"),
    Bullet("Conformité aux 50 critères AA."),
    Bullet("Audit externe annuel par cabinet certifié."),
    Bullet("Conformité à 100 % du parcours voyageur (de la découverte à la fidélisation)."),
    Bullet("Conformité du portail vendeur, créateur, HRA, ambassadeur."),

    H2("2.3. Cible An 5 — Excellence accessibilité"),
    Bullet("Accessibilité étendue aux applications mobiles natives."),
    Bullet("Compatibilité testée avec les principaux assistive technologies (NVDA, JAWS, VoiceOver, TalkBack)."),
    Bullet("Engagement vers le niveau AAA pour les contenus critiques."),

    H1("3. Périmètre"),

    H2("3.1. Sites et plateformes"),
    Bullet("eventylife.fr — site public (priorité absolue)."),
    Bullet("eventylife.fr/mon-compte — espace voyageur."),
    Bullet("eventylife.fr/portail-vendeur — portail vendeur."),
    Bullet("eventylife.fr/portail-createur — portail créateur."),
    Bullet("eventylife.fr/maisons — portail HRA."),
    Bullet("eventylife.fr/ambassadeur — portail ambassadeur."),
    Bullet("eventylife.fr/blog — blog."),

    H2("3.2. Documents"),
    Bullet("Documents PDF publics (CGV, FAQ, mentions légales) : conformes PDF/UA recommandé."),
    Bullet("Documents emails transactionnels : balises sémantiques, alt texts."),
    Bullet("Documents partenaires (portails) : accessibles dans les portails."),

    H1("4. Critères WCAG 2.1 — engagements concrets"),

    H2("4.1. Perceptible (Principe 1)"),
    Bullet("Alternatives textuelles sur toutes les images (alt texts descriptifs)."),
    Bullet("Sous-titres systématiques sur les vidéos."),
    Bullet("Audiodescription pour les vidéos avec contenu visuel critique (cible An 3)."),
    Bullet("Contenus structurés sémantiquement (H1, H2, listes, tableaux avec en-têtes)."),
    Bullet("Contraste de couleur ≥ 4,5:1 (texte normal) et ≥ 3:1 (texte large)."),
    Bullet("Possibilité de redimensionner le texte jusqu'à 200 % sans perte de fonctionnalité."),

    H2("4.2. Utilisable (Principe 2)"),
    Bullet("Navigation au clavier complète (toutes les fonctionnalités accessibles sans souris)."),
    Bullet("Pas de pièges au clavier."),
    Bullet("Délai suffisant (pas de timeout court sur les actions utilisateur)."),
    Bullet("Pas de contenu provoquant des crises (épilepsie photosensible)."),
    Bullet("Skip links (lien d'évitement vers le contenu principal)."),
    Bullet("Indicateur de focus visible et différenciable."),

    H2("4.3. Compréhensible (Principe 3)"),
    Bullet("Langue de la page définie (lang=fr)."),
    Bullet("Vocabulaire simple, glossaire pour les termes techniques (cohérence Glossaire voyage)."),
    Bullet("Cohérence de la navigation entre les pages."),
    Bullet("Identification des erreurs et suggestions de correction."),
    Bullet("Étiquettes descriptives sur les formulaires."),
    Bullet("Confirmation avant les actions critiques (paiement, suppression)."),

    H2("4.4. Robuste (Principe 4)"),
    Bullet("Code HTML valide (W3C Validator)."),
    Bullet("Compatibilité avec les navigateurs récents (Chrome, Firefox, Safari, Edge — 2 dernières versions)."),
    Bullet("Compatibilité avec les lecteurs d'écran principaux (NVDA, JAWS, VoiceOver, TalkBack)."),
    Bullet("Utilisation de WAI-ARIA selon recommandations (pas de surutilisation)."),

    H1("5. Plan de mise en conformité (pluriannuel)"),
    makeTable({
      widths: [3744, 1872, 3744],
      header: ["Phase", "Période", "Livrables"],
      rows: [
        ["Phase 1 — Audit initial", "T2 An 1", "Audit interne par développeur senior, identification des écarts"],
        ["Phase 2 — Mise en conformité prioritaire", "T3-T4 An 1", "Correction des critères niveau A et AA prioritaires"],
        ["Phase 3 — Audit externe", "T1 An 2", "Audit par cabinet certifié, déclaration d'accessibilité publiée"],
        ["Phase 4 — Mise en conformité AA totale", "T2-T4 An 2", "Atteinte conformité WCAG 2.1 AA"],
        ["Phase 5 — Audit annuel récurrent", "An 3+", "Audit annuel + maintien conformité"],
        ["Phase 6 — Vers AAA et mobile", "An 4-5", "Niveau AAA pour contenus critiques, accessibilité apps natives"],
      ],
    }),

    H1("6. Outils de test et de suivi"),
    Bullet("axe DevTools (intégré navigateur)."),
    Bullet("WAVE Web Accessibility Evaluation Tool."),
    Bullet("Lighthouse (audit accessibilité)."),
    Bullet("Pa11y (CI/CD intégré, audit automatisé)."),
    Bullet("NVDA (lecteur d'écran gratuit, tests manuels)."),
    Bullet("VoiceOver Mac/iOS, TalkBack Android."),
    Bullet("Validator W3C HTML/CSS."),
    Bullet("Color Contrast Analyser."),
    Bullet("Cabinet externe certifié pour audit annuel (à partir An 2)."),

    H1("7. Déclaration d'accessibilité"),

    H2("7.1. Contenu obligatoire"),
    Bullet("Niveau de conformité actuel (totale, partielle, non-conforme)."),
    Bullet("Date d'établissement et de dernière mise à jour."),
    Bullet("Liste des contenus non accessibles (raisons et alternatives)."),
    Bullet("Modalités de contact pour signaler une difficulté d'accès."),
    Bullet("Recours possibles (Défenseur des droits)."),

    H2("7.2. Publication"),
    Bullet("Page eventylife.fr/accessibilite (lien dans le footer du site)."),
    Bullet("Mise à jour annuelle obligatoire."),
    Bullet("Communication transparente sur les progrès et les écarts."),

    H1("8. Modalités de signalement"),
    Bullet("Email dédié : accessibilite@eventylife.fr."),
    Bullet("Formulaire de contact en ligne avec catégorie « accessibilité »."),
    Bullet("Réponse sous 7 jours ouvrés."),
    Bullet("Résolution selon priorité (critique sous 30 j, important sous 90 j)."),
    Bullet("Recours possible auprès du Défenseur des droits si non-réponse ou désaccord."),

    H1("9. Indicateurs accessibilité"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Conformité critères WCAG 2.1 AA", "60 %", "100 %"],
        ["Score Lighthouse Accessibilité", "≥ 85", "≥ 95"],
        ["Pages auditées sur site public", "≥ 20", "100 %"],
        ["Signalements traités sous 30 j", "≥ 90 %", "≥ 98 %"],
        ["Audit externe annuel", "—", "1× / an"],
        ["Formation équipe accessibilité", "1× / an", "Continue"],
      ],
    }),

    H1("10. Engagements opposables"),
    Bullet("Publication d'une déclaration d'accessibilité dès An 2."),
    Bullet("Mise à jour annuelle de la déclaration."),
    Bullet("Réponse aux signalements sous 7 jours ouvrés."),
    Bullet("Audit externe annuel à partir d'An 3."),
    Bullet("Formation continue de l'équipe développement."),
    Bullet("Engagement à atteindre la conformité WCAG 2.1 AA totale d'ici An 3."),
    Bullet("Information transparente sur les contenus non accessibles avec alternatives."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique accessibilité PMR, Politique RSE, Politique cybersécurité, Guide SEO, Charte télétravail, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — ROADMAP TECHNIQUE EVENTY
// ============================================================
function roadmapTechnique() {
  return [
    bandeauTitre(
      "ROADMAP TECHNIQUE EVENTY LIFE",
      "Vision tech, R&D et plan de développement produit 3 ans",
    ),
    Spacer(160),

    P("La présente roadmap technique formalise la vision et le plan de développement de la plateforme eventylife.fr et de l'écosystème logiciel d'EVENTY LIFE SAS sur 3 ans. Elle complète le Dossier subventions publiques (statut JEI, CIR/CII) et le Dossier investisseur en explicitant la trajectoire produit/tech.", { italics: true }),

    P("Eventy choisit une trajectoire technique sobre, autonome et durable : peu de dépendances externes, code propriétaire maîtrisé, infrastructure souveraine. Cette discipline technique est cohérente avec le positionnement Eventy — la transparence et l'autonomie ne sont pas que des mots commerciaux, c'est une réalité technique.", { italics: true }),

    H1("1. État actuel — points de référence"),

    H2("1.1. Stack technique"),
    Bullet("Backend : NestJS 10 (TypeScript), 31 modules métier, 905 fichiers TypeScript."),
    Bullet("Frontend : Next.js 14 (App Router), 32 portails distincts, 1 118 page.tsx."),
    Bullet("Base de données : PostgreSQL via Prisma."),
    Bullet("Hébergement : Scaleway France (souveraineté numérique)."),
    Bullet("Paiements : Stripe Connect."),
    Bullet("Tests : 3 300+ tests passants."),
    Bullet("Code total : ~1 184 000 lignes (frontend ~876k · backend ~308k)."),

    H2("1.2. Capacités fonctionnelles"),
    Bullet("Catalogue voyages avec recherche / filtre."),
    Bullet("Réservation et paiement."),
    Bullet("Espace voyageur (réservations, profil, fidélité)."),
    Bullet("Portails partenaires (créateur, vendeur, HRA, ambassadeur)."),
    Bullet("Portail admin Eventy."),
    Bullet("Gestion compte cantonné via Stripe."),
    Bullet("Intégration emails transactionnels."),

    H1("2. Vision long terme (5-10 ans)"),

    H2("2.1. Plateforme leader voyage de groupe en France"),
    Bullet("L'outil de référence pour les opérateurs de voyages de groupe."),
    Bullet("Plus large catalogue indépendant FR / Europe."),
    Bullet("Standard d'industrie pour la transparence des prix."),

    H2("2.2. Open ecosystem"),
    Bullet("APIs ouvertes (lecture) pour partenaires officiels."),
    Bullet("Possibilité long terme d'open-source de modules non stratégiques."),

    H2("2.3. Innovation continue"),
    Bullet("Recherche permanente sur le voyage augmenté (AR/VR limité, IA assistante non-extractive)."),
    Bullet("Intégrations émergentes (mobilité électrique, paiement européen souverain)."),

    H1("3. Roadmap An 1 (2026-2027) — Consolidation"),

    H2("3.1. Priorités produit voyageur"),
    Bullet("Optimisation parcours réservation (taux conversion ≥ 3 %)."),
    Bullet("Amélioration recherche/filtre catalogue."),
    Bullet("Espace voyageur enrichi (programme fidélité visible, parrainage)."),
    Bullet("Affichage émissions CO2eq sur fiche voyage."),
    Bullet("Multi-langues : EN puis ES (cohérence stratégie internationale)."),

    H2("3.2. Priorités produit partenaires"),
    Bullet("Portail vendeur opérationnel (suivi conversions, commissions)."),
    Bullet("Portail créateur (création voyage assistée)."),
    Bullet("Portail HRA (gestion réservations, calendrier)."),
    Bullet("Portail ambassadeur (kit, code parrainage, reporting)."),

    H2("3.3. Priorités infrastructure / sécurité"),
    Bullet("Renforcement MFA équipe + partenaires (cohérence Politique cybersécurité)."),
    Bullet("Pentest externe annuel."),
    Bullet("Conformité WCAG 2.1 niveau A (cohérence Plan accessibilité numérique)."),
    Bullet("Optimisation Core Web Vitals (cohérence Guide SEO)."),

    H2("3.4. Innovation R&D An 1"),
    Bullet("Exploration moteur recommandation voyage (sans tracking abusif)."),
    Bullet("Algorithme de remplissage groupe (matching profils voyageurs)."),
    Bullet("Système d'alertes voyageurs sur places restantes."),
    Bullet("Intégration prototype calculateur carbone par voyage."),

    H1("4. Roadmap An 2 (2027-2028) — Croissance"),

    H2("4.1. Application mobile"),
    Bullet("App native iOS et Android (React Native ou Flutter selon arbitrage)."),
    Bullet("Fonctionnalités : réservation, espace voyageur, notifications voyage, contact accompagnateur."),
    Bullet("Lancement progressif (T2 An 2)."),

    H2("4.2. Internationalisation"),
    Bullet("Catalogue multilingue (FR, EN, ES — DE en option)."),
    Bullet("Paiements multidevise (Stripe Connect)."),
    Bullet("CGV multilingues, RGPD international."),
    Bullet("Adaptation tunnel pour voyageurs étrangers."),

    H2("4.3. Intelligence opérationnelle"),
    Bullet("Tableaux de bord avancés (analytics opérationnels, NPS, performance HRA)."),
    Bullet("Prévisions de demande (algo simple)."),
    Bullet("Reporting automatique pour les partenaires."),

    H2("4.4. Conformité étendue"),
    Bullet("Conformité WCAG 2.1 AA totale."),
    Bullet("Cible ISO 27001 (lancement chantier)."),
    Bullet("Audit RGPD externe annuel."),

    H1("5. Roadmap An 3 (2028-2029) — Maturité"),

    H2("5.1. Plateforme enrichie"),
    Bullet("Marketplace ambassadeur (rémunération directe via Stripe Connect)."),
    Bullet("Programme corporate B2B avancé (catalogue privé, facturation séparée)."),
    Bullet("API publique en lecture pour partenaires officiels."),

    H2("5.2. Optimisation économique"),
    Bullet("Optimisation des marges via outils internes (analyse coûts, benchmarks)."),
    Bullet("Système d'enchères (auctions) pour optimisation taux remplissage."),
    Bullet("Recommandations dynamiques de prix."),

    H2("5.3. Engagement RSE"),
    Bullet("Calculateur carbone enrichi (Scope 3 affiné)."),
    Bullet("Page transparence dynamique (chiffres temps réel : marges, CA, redistribution)."),
    Bullet("Reporting RSE intégré CSRD si seuils atteints."),

    H2("5.4. Innovation"),
    Bullet("Exploration IA assistante voyageur (sans tracking abusif, sur consentement)."),
    Bullet("Intégrations innovantes (paiement européen souverain, transports propres)."),

    H1("6. R&D et statuts spéciaux"),

    H2("6.1. JEI (Jeune Entreprise Innovante)"),
    Bullet("Statut JEI demandé en An 1 (cohérence Note expert-comptable)."),
    Bullet("Conditions : moins de 8 ans, dépenses R&D ≥ 15 % charges fiscales déductibles."),
    Bullet("Avantages : exonération cotisations sociales sur personnel R&D, exonération IS partielle."),

    H2("6.2. CIR (Crédit d'Impôt Recherche)"),
    Bullet("CIR sur les dépenses R&D éligibles (algorithmes voyage, cybersécurité, accessibilité, calcul carbone)."),
    Bullet("Taux : 30 % des dépenses R&D jusqu'à 100 M€."),
    Bullet("Documentation rigoureuse (technical paper, time tracking)."),

    H2("6.3. CII (Crédit d'Impôt Innovation)"),
    Bullet("CII sur les dépenses d'innovation produit."),
    Bullet("Taux : 30 % des dépenses jusqu'à 400 K€."),
    Bullet("Cumulable avec CIR sur dépenses distinctes."),

    H1("7. Plan d'embauches techniques"),
    makeTable({
      widths: [2496, 2496, 2496, 1872],
      header: ["Profil", "An 1", "An 3", "An 5"],
      rows: [
        ["Développeurs full-stack", "1", "3", "6"],
        ["Tech lead / architecte", "—", "1", "1"],
        ["Designer UX/UI", "1 (mi-temps)", "1", "2"],
        ["DevOps / SRE", "—", "1 (mi-temps)", "1"],
        ["Data / analytics", "—", "—", "1"],
        ["QA / testeur", "—", "1 (mi-temps)", "1"],
        ["Référent sécurité (CISO)", "—", "1 (mi-temps)", "1"],
        ["TOTAL équipe tech", "2-3", "7-9", "13-15"],
      ],
    }),

    H1("8. Choix techniques structurants"),

    H2("8.1. Souveraineté"),
    Bullet("Hébergement France (Scaleway), refus AWS/Azure/GCP pour les données voyageurs."),
    Bullet("Outils SaaS européens en priorité."),
    Bullet("Refus dépendances stratégiques sur acteurs non-européens."),

    H2("8.2. Open source"),
    Bullet("Stack technique majoritairement open source (Next.js, NestJS, PostgreSQL)."),
    Bullet("Contribution à l'écosystème open source dans la mesure du possible (rétro-PRs, sponsoring projets)."),

    H2("8.3. Sobriété"),
    Bullet("Refus du tout-IA / tout-blockchain."),
    Bullet("Optimisation des appels API et des requêtes DB."),
    Bullet("Mesure de l'empreinte numérique (cohérence Charte engagement carbone)."),

    H1("9. Indicateurs techniques"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Disponibilité plateforme (uptime)", "≥ 99,5 %", "≥ 99,9 %"],
        ["Score Lighthouse Performance", "≥ 80", "≥ 90"],
        ["Score Lighthouse Accessibilité", "≥ 85", "≥ 95"],
        ["Couverture tests automatisés", "≥ 70 %", "≥ 85 %"],
        ["Délai déploiement (lead time)", "≤ 2 j", "≤ 1 j"],
        ["Incidents N3-N4", "0", "0"],
        ["Délai résolution bug critique", "≤ 4 h", "≤ 1 h"],
      ],
    }),

    H1("10. Engagements stratégiques"),
    Bullet("Souveraineté numérique : refus de céder le contrôle des données voyageurs à des acteurs non-européens."),
    Bullet("Sobriété numérique : refus du tout-IA et tout-blockchain sans nécessité opérationnelle démontrée."),
    Bullet("Transparence : chiffres clés tech publiés annuellement."),
    Bullet("Refus du dark pattern UX (urgence factice, scarcité simulée, dark UI)."),
    Bullet("Engagement RGPD-by-design sur toute nouvelle fonctionnalité."),
    Bullet("Engagement accessibilité-by-design sur toute nouvelle fonctionnalité."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan d'accessibilité numérique, Politique cybersécurité, Charte engagement carbone, Note expert-comptable, Dossier subventions publiques, Dossier investisseur, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — GUIDE UTILISATION ESPACE VOYAGEUR
// ============================================================
function guideEspaceVoyageur() {
  return [
    bandeauTitre(
      "GUIDE UTILISATION ESPACE VOYAGEUR",
      "Mode d'emploi pas-à-pas du compte voyageur eventylife.fr",
    ),
    Spacer(160),

    P("Ce guide accompagne les voyageurs Eventy dans l'utilisation de leur espace personnel sur eventylife.fr. Il est conçu pour que chacun, quel que soit son niveau d'aisance avec le numérique, puisse profiter pleinement des fonctionnalités proposées sans frustration.", { italics: true }),

    P("Eventy s'engage à un site sobre, lisible, accessible. Si une étape n'est pas claire pour toi, c'est que nous avons un travail à faire — pas que tu n'es pas à la hauteur. Tu peux toujours nous contacter et nous proposer des améliorations à : contact@eventylife.fr.", { italics: true }),

    H1("1. Création de compte"),

    H2("1.1. Pourquoi créer un compte ?"),
    Bullet("Pour réserver un voyage."),
    Bullet("Pour accéder à ton historique de voyages et à ton statut Eventy Famille."),
    Bullet("Pour profiter de ton code parrainage (si tu en as un)."),
    Bullet("Pour suivre tes documents de voyage (contrat, facture, voucher)."),
    Bullet("Pour communiquer facilement avec l'équipe Eventy."),

    H2("1.2. Comment créer un compte"),
    Numbered("Aller sur eventylife.fr."),
    Numbered("Cliquer sur « Connexion » en haut à droite."),
    Numbered("Cliquer sur « Créer un compte »."),
    Numbered("Renseigner ton email + mot de passe (12 caractères minimum)."),
    Numbered("Vérifier l'email reçu et cliquer sur le lien de confirmation."),
    Numbered("Compléter ton profil voyageur (étape facultative à la création, demandée à la 1re réservation)."),

    H2("1.3. Mot de passe oublié"),
    Bullet("Cliquer sur « Mot de passe oublié » dans la page de connexion."),
    Bullet("Renseigner ton email."),
    Bullet("Tu reçois un email avec un lien de réinitialisation (valable 1 h)."),
    Bullet("Choisir un nouveau mot de passe sécurisé."),

    H1("2. Réserver un voyage"),

    H2("2.1. Trouver un voyage"),
    Bullet("Page d'accueil eventylife.fr → catalogue des voyages."),
    Bullet("Filtres : destination, durée, période, profil (solo, couple, famille)."),
    Bullet("Recherche par mot-clé (ex : « Marrakech », « bord de mer »)."),
    Bullet("Tri : prix croissant, popularité, nouveautés."),

    H2("2.2. Lire la fiche voyage"),
    Bullet("Photos et vidéo de la destination."),
    Bullet("Programme jour par jour."),
    Bullet("Hébergement(s) avec photos et services."),
    Bullet("Inclus / non inclus."),
    Bullet("Émissions CO2eq estimées (cohérence Charte engagement carbone)."),
    Bullet("Accessibilité PMR (cohérence Politique accessibilité PMR)."),
    Bullet("Avis voyageurs (Trustpilot intégré)."),
    Bullet("FAQ spécifique au voyage."),
    Bullet("Tarif décomposé euro par euro (transparence Eventy)."),

    H2("2.3. Réserver"),
    Numbered("Cliquer sur « Réserver ce voyage »."),
    Numbered("Choisir la date de départ."),
    Numbered("Renseigner le nombre de voyageurs et leur identité."),
    Numbered("Choisir les options (chambre individuelle, animal d'assistance, régime alimentaire spécifique)."),
    Numbered("Saisir le code parrainage si tu en as un (10 % de remise)."),
    Numbered("Vérifier le récapitulatif (prix, dates, conditions)."),
    Numbered("Choisir le mode de paiement : 100 % à la réservation OU acompte 30 % + solde 30 j avant départ."),
    Numbered("Payer en sécurité via Stripe (CB / Apple Pay / Google Pay / virement)."),
    Numbered("Recevoir la confirmation par email instantanément."),

    H1("3. Suivre tes voyages"),

    H2("3.1. Mes voyages"),
    Bullet("Onglet « Mes voyages » dans ton espace voyageur."),
    Bullet("Vue : voyages à venir / voyages passés / voyages annulés."),
    Bullet("Pour chaque voyage : statut, date, destination, accompagnateur."),

    H2("3.2. Documents disponibles par voyage"),
    Bullet("Contrat (CGV + bon de commande)."),
    Bullet("Reçu de paiement."),
    Bullet("Roadbook voyageur (envoyé J-30 avant départ)."),
    Bullet("Voucher Pack Sérénité (assistance, rapatriement)."),
    Bullet("Si applicable : facture séparée pour CSE."),

    H2("3.3. Modifier ou annuler une réservation"),
    Bullet("Cliquer sur le voyage concerné."),
    Bullet("Cliquer sur « Modifier » ou « Annuler »."),
    Bullet("Lire le récapitulatif des conditions (CGV)."),
    Bullet("Confirmer la demande."),
    Bullet("Eventy traite ta demande sous 48 h ouvrées."),

    H1("4. Programme Eventy Famille"),

    H2("4.1. Mon statut"),
    Bullet("Onglet « Programme fidélité » dans l'espace voyageur."),
    Bullet("Statut affiché : Voyageur Curieux (avant 1er voyage), Fidèle (≥ 2), Famille (≥ 5), Légende (≥ 10)."),
    Bullet("Visualisation des avantages associés à ton statut."),
    Bullet("Compteur des voyages effectués."),

    H2("4.2. Mon code parrainage"),
    Bullet("Onglet « Mon code parrainage »."),
    Bullet("Code unique nominatif : EVENTY-[NOM]-[ANNÉE]."),
    Bullet("Lien tracé personnel : eventylife.fr/?ref=[TON-CODE]."),
    Bullet("Suivi des parrainages : nombre de filleuls, voyages effectués, avoir cumulé."),
    Bullet("Avoir parrain disponible (50 € / 60 € / 75 € selon palier)."),

    H2("4.3. Avoirs disponibles"),
    Bullet("Section « Mes avoirs »."),
    Bullet("Détail des avoirs (parrain, anniversaire, autres)."),
    Bullet("Date de validité."),
    Bullet("Application automatique lors de la prochaine réservation."),

    H1("5. Communication avec Eventy"),

    H2("5.1. Messagerie interne"),
    Bullet("Onglet « Messages » dans l'espace voyageur."),
    Bullet("Historique des échanges email avec l'équipe Eventy."),
    Bullet("Possibilité d'envoyer un nouveau message."),
    Bullet("Réponse Eventy sous 24 h ouvrées."),

    H2("5.2. Contacts directs"),
    Bullet("Email général : contact@eventylife.fr."),
    Bullet("Réservations : reservation@eventylife.fr."),
    Bullet("Réclamations : reclamation@eventylife.fr."),
    Bullet("Modifications : modification@eventylife.fr."),
    Bullet("Annulations : annulation@eventylife.fr."),
    Bullet("Téléphone : [À compléter]."),
    Bullet("Pendant un voyage en cours : numéro accompagnateur dans le roadbook."),

    H1("6. Sécurité de mon compte"),

    H2("6.1. Bonnes pratiques"),
    Bullet("Mot de passe robuste (≥ 12 caractères, mix de types)."),
    Bullet("Ne pas réutiliser un mot de passe d'un autre site."),
    Bullet("Activation MFA recommandée (par email ou TOTP)."),
    Bullet("Déconnexion après usage sur un appareil partagé."),
    Bullet("Vigilance sur les emails de phishing (Eventy ne demande JAMAIS ton mot de passe par email)."),

    H2("6.2. Mes données personnelles"),
    Bullet("Onglet « Mon profil »."),
    Bullet("Modification possible à tout moment (nom, prénom, email, téléphone, adresse)."),
    Bullet("Données médicales (allergies, mobilité réduite) modifiables avec confidentialité."),
    Bullet("Cohérence Politique de confidentialité RGPD."),

    H2("6.3. Droits RGPD"),
    Bullet("Droit d'accès : télécharger toutes mes données (export JSON)."),
    Bullet("Droit de rectification : modifier mes données."),
    Bullet("Droit à l'effacement : supprimer mon compte (sauf comptabilité 10 ans)."),
    Bullet("Droit d'opposition aux communications marketing."),
    Bullet("Contact DPO : dpo@eventylife.fr."),

    H1("7. Préférences et notifications"),
    Bullet("Onglet « Préférences »."),
    Bullet("Choix des emails reçus : confirmations, anniversaire de voyage, newsletter, propositions personnalisées."),
    Bullet("Désinscription en un clic à tout moment."),
    Bullet("Notifications push (sur app mobile à partir An 2)."),

    H1("8. Accessibilité du site"),
    Bullet("Eventy s'engage WCAG 2.1 AA (cohérence Plan d'accessibilité numérique)."),
    Bullet("Mode contraste élevé activable dans les préférences (cible An 2)."),
    Bullet("Navigation clavier complète."),
    Bullet("Compatibilité lecteurs d'écran (NVDA, JAWS, VoiceOver, TalkBack)."),
    Bullet("Signalement de difficulté : accessibilite@eventylife.fr."),

    H1("9. Astuces et raccourcis"),
    Bullet("Sauvegarder un voyage en favoris (cœur sur la fiche voyage)."),
    Bullet("Comparer 3 voyages côte à côte (icône « Comparer »)."),
    Bullet("Recevoir une alerte si un voyage est en complet et qu'une place se libère."),
    Bullet("Calculer son empreinte carbone voyage avant réservation."),
    Bullet("Inviter un proche par email avec ton code parrainage en 2 clics."),

    H1("10. Si quelque chose ne fonctionne pas"),
    Numbered("Vérifier sa connexion internet et navigateur (versions à jour recommandées : Chrome, Firefox, Safari, Edge — 2 dernières versions)."),
    Numbered("Vider le cache navigateur si problème d'affichage persistant."),
    Numbered("Tester sur un autre navigateur ou appareil."),
    Numbered("Contacter contact@eventylife.fr avec capture d'écran et description du problème."),
    Numbered("Réponse Eventy sous 24 h ouvrées."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour à chaque évolution majeure du site.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Onboarding voyageur, FAQ voyageurs, Programme fidélisation Eventy Famille, Plan d'accessibilité numérique, Politique RGPD, Politique cookies, Politique cybersécurité.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Plan-Accessibilite-Numerique.docx",
      title: "Eventy Life — Plan d'accessibilité numérique",
      description: "Plan WCAG 2.1 AA / RGAA pour les interfaces digitales Eventy.",
      footer: "EVENTY LIFE SAS — Plan accessibilité numérique",
      children: planAccessibiliteNumerique(),
    },
    {
      file: "docs/garanties/Eventy-Life-Roadmap-Technique.docx",
      title: "Eventy Life — Roadmap technique",
      description: "Vision tech, R&D et plan de développement produit 3 ans.",
      footer: "EVENTY LIFE SAS — Roadmap technique",
      children: roadmapTechnique(),
    },
    {
      file: "docs/garanties/Eventy-Life-Guide-Espace-Voyageur.docx",
      title: "Eventy Life — Guide utilisation espace voyageur",
      description: "Mode d'emploi pas-à-pas du compte voyageur eventylife.fr.",
      footer: "EVENTY LIFE SAS — Guide espace voyageur",
      children: guideEspaceVoyageur(),
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
