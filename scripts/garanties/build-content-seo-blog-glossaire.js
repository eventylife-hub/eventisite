/**
 * Eventy Life — Trois documents content / SEO
 *
 *   1. Guide SEO Eventy (référentiel optimisation moteurs de recherche)
 *   2. Ligne éditoriale blog Eventy
 *   3. Glossaire voyage Eventy
 *
 * Usage : node scripts/garanties/build-content-seo-blog-glossaire.js
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
// DOCUMENT 1 — GUIDE SEO EVENTY
// ============================================================
function guideSEO() {
  return [
    bandeauTitre(
      "GUIDE SEO EVENTY LIFE",
      "Référentiel d'optimisation moteurs de recherche — équipe et créateurs",
    ),
    Spacer(160),

    P("Le présent guide formalise l'approche SEO (Search Engine Optimization) d'EVENTY LIFE SAS. Il s'adresse à l'équipe interne, aux créateurs de voyages et aux personnes contribuant aux contenus du site eventylife.fr et du blog. Il vise à garantir une visibilité naturelle solide tout en respectant l'intégrité éditoriale.", { italics: true }),

    P("Eventy choisit un SEO sain : pas de bourrage de mots-clés, pas de génération automatisée de contenu vide, pas de tactiques douteuses (link farms, cloaking). La performance SEO se construit dans la durée par un contenu utile, factuel et bien structuré, en accord avec l'âme d'Eventy.", { italics: true }),

    H1("1. Principes fondamentaux"),

    H2("1.1. SEO sain et éthique"),
    Bullet("Contenu utile et factuel avant tout — pas de remplissage."),
    Bullet("Réponse précise aux intentions de recherche des voyageurs."),
    Bullet("Optimisation technique conforme aux bonnes pratiques (Web Vitals, accessibilité)."),
    Bullet("Refus du black-hat (cloaking, doorway pages, contenus dupliqués)."),
    Bullet("Refus des tactiques de growth hacking douteuses."),
    Bullet("Maillage interne cohérent, pas de link farms externes."),

    H2("1.2. Trois piliers"),
    Numbered("Technique — site rapide, accessible, bien crawlable."),
    Numbered("Contenu — utile, original, factuel, bien structuré."),
    Numbered("Notoriété — backlinks naturels, mentions presse, partenariats légitimes."),

    H1("2. Optimisation technique"),

    H2("2.1. Performance"),
    Bullet("Core Web Vitals : LCP ≤ 2,5 s, FID ≤ 100 ms, CLS ≤ 0,1."),
    Bullet("Pages servies en HTTPS (TLS 1.3)."),
    Bullet("Images optimisées (WebP/AVIF, dimensions adaptées, lazy loading)."),
    Bullet("Code minifié, ressources critiques inlinées."),
    Bullet("CDN edge (Vercel ou Cloudflare en parallèle de Scaleway France)."),
    Bullet("Cible : score Lighthouse ≥ 90 sur les pages voyage."),

    H2("2.2. Crawlabilité et indexation"),
    Bullet("Sitemap XML maintenu à jour (auto-généré)."),
    Bullet("robots.txt clair (autorisation crawlers principaux, blocage admin/preview)."),
    Bullet("Pas d'erreurs 404 cassées (redirections 301 systématiques)."),
    Bullet("Pas de pages orphelines (chaque page reliée par maillage interne)."),
    Bullet("Données structurées Schema.org (Trip, TouristTrip, FAQPage, Review, Organization)."),

    H2("2.3. Accessibilité (cohérence Politique accessibilité PMR)"),
    Bullet("Conforme WCAG 2.1 AA / RGAA."),
    Bullet("Alt texts descriptifs sur toutes les images."),
    Bullet("Hiérarchie sémantique HTML (H1 unique, H2/H3 cohérents)."),
    Bullet("Contraste de couleur conforme (rapport ≥ 4,5:1 texte normal)."),
    Bullet("Navigation clavier complète."),

    H2("2.4. Mobile-first"),
    Bullet("Design responsive (cible An 1 : 70 % du trafic mobile)."),
    Bullet("Test mobile-friendly Google ≥ 95/100."),
    Bullet("Touchpoints suffisamment espacés (44 px minimum)."),

    H1("3. Recherche de mots-clés"),

    H2("3.1. Stratégie de mots-clés"),
    Bullet("Mots-clés transactionnels : « voyage en groupe », « voyage organisé », « voyage tout inclus » (B2C)."),
    Bullet("Mots-clés informationnels : « comment voyager seul », « voyage solo accompagné », « voyage entre célibataires »."),
    Bullet("Mots-clés navigationnels : « eventy life », « eventy voyage »."),
    Bullet("Longue traîne : « voyage en groupe Marrakech 4 jours », « voyage solo accompagné Italie »."),

    H2("3.2. Outils utilisés"),
    Bullet("Google Search Console (gratuit, prioritaire)."),
    Bullet("Google Trends (gratuit)."),
    Bullet("Ubersuggest, Ahrefs, Semrush (versions limitées gratuites)."),
    Bullet("AnswerThePublic pour les questions des voyageurs."),
    Bullet("Veille manuelle des forums et groupes Facebook voyage."),

    H2("3.3. Cibles SEO An 1"),
    makeTable({
      widths: [3744, 1872, 1872, 1872],
      header: ["Famille de mots-clés", "Volume mensuel cible", "Position cible An 1", "Trafic estimé"],
      rows: [
        ["Voyage en groupe", "≥ 30 000", "Top 20", "≥ 3 000/mois"],
        ["Voyage solo accompagné", "≥ 5 000", "Top 10", "≥ 800/mois"],
        ["Voyage organisé France", "≥ 8 000", "Top 30", "≥ 500/mois"],
        ["[Destination] en groupe (par voyage)", "≥ 1 000/voyage", "Top 10", "≥ 150/mois/voyage"],
        ["Marque Eventy", "≥ 1 500", "Top 1", "≥ 1 200/mois"],
      ],
    }),

    H1("4. Optimisation des pages voyage"),

    H2("4.1. Structure type d'une fiche voyage"),
    Bullet("Title : « [Destination] — Voyage de groupe [Durée] | Eventy Life » (≤ 60 caractères)."),
    Bullet("Meta description : 1 phrase claire avec promesse + prix + CTA (≤ 160 caractères)."),
    Bullet("H1 : « [Destination] — Voyage en groupe [Durée] tout inclus »."),
    Bullet("H2 : Programme jour par jour, Hébergement, Activités, Inclus / Non inclus, Avis voyageurs, FAQ."),
    Bullet("Description longue ≥ 800 mots avec mots-clés naturellement intégrés."),
    Bullet("Photos avec alt texts descriptifs."),
    Bullet("Schema.org TouristTrip avec dates, prix, disponibilité."),

    H2("4.2. Données enrichies (rich snippets)"),
    Bullet("Étoiles d'avis (cohérence Politique avis voyageurs — Trustpilot intégré)."),
    Bullet("Prix avec mention TTC."),
    Bullet("Disponibilité (calendrier prochaines dates)."),
    Bullet("FAQ structurée (FAQPage Schema)."),
    Bullet("Breadcrumbs navigationnels."),

    H1("5. Optimisation du blog"),

    H2("5.1. Architecture"),
    Bullet("URL parlantes : eventylife.fr/blog/[slug-explicite]."),
    Bullet("Catégories thématiques cohérentes (Destinations, Conseils voyage, Vie Eventy, Engagement)."),
    Bullet("Pagination optimisée (rel=prev/next ou page-based)."),
    Bullet("Maillage interne entre articles connexes."),
    Bullet("Liens vers pages voyages quand pertinent."),

    H2("5.2. Format article SEO"),
    Bullet("Titre H1 attractif et précis."),
    Bullet("Introduction hook 2-3 lignes."),
    Bullet("H2 et H3 hiérarchisés."),
    Bullet("Longueur ≥ 800 mots (article moyen 1 200-2 000 mots)."),
    Bullet("Sous-titres courts, paragraphes ≤ 4 lignes."),
    Bullet("Conclusion + CTA discret."),

    H1("6. Notoriété et backlinks"),

    H2("6.1. Stratégie de backlinks"),
    Bullet("Mentions presse naturelles (cohérence Dossier presse Eventy)."),
    Bullet("Articles invités sur médias tourisme et lifestyle (qualité avant quantité)."),
    Bullet("Partenariats avec offices du tourisme (mentions réciproques)."),
    Bullet("Témoignages blogueurs voyage (sans rémunération en contrepartie de lien)."),
    Bullet("Refus systématique des link farms et NetWorks de PBN."),

    H2("6.2. Maillage interne"),
    Bullet("Page d'accueil : 5-10 voyages mis en avant + lien blog."),
    Bullet("Page voyage : 3-5 voyages similaires + 2-3 articles blog."),
    Bullet("Article blog : liens vers 2-3 voyages pertinents + 2-3 autres articles."),
    Bullet("Pages catégories (destinations, types) : pages hub avec maillage."),

    H1("7. Indicateurs SEO"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Trafic SEO mensuel (visites organiques)", "≥ 5 000", "≥ 80 000"],
        ["Mots-clés positionnés top 10", "≥ 30", "≥ 500"],
        ["Mots-clés positionnés top 3", "≥ 5", "≥ 100"],
        ["CTR moyen (Search Console)", "≥ 3 %", "≥ 5 %"],
        ["Position moyenne", "≤ 25", "≤ 12"],
        ["Backlinks dofollow qualifiés", "≥ 20", "≥ 200"],
        ["Score Lighthouse pages voyage", "≥ 90", "≥ 95"],
      ],
    }),

    H1("8. Reporting et gouvernance"),
    Bullet("Reporting SEO mensuel : trafic, mots-clés, conversions issues du SEO."),
    Bullet("Audit SEO trimestriel (interne ou externe selon ressources)."),
    Bullet("Mise à jour annuelle du présent guide."),
    Bullet("Référent SEO : Président en An 1, recrutement spécialiste An 2."),
    Bullet("Cohérence avec Stratégie réseaux sociaux et Plan marketing."),

    H1("9. Engagements éthiques SEO"),
    Bullet("Refus du contenu généré uniquement pour le SEO sans valeur voyageur."),
    Bullet("Refus des tactiques manipulatrices (cloaking, hidden text)."),
    Bullet("Refus de l'achat de backlinks."),
    Bullet("Refus du content scraping ou de la duplication illégale."),
    Bullet("Mention transparente des partenariats sur les articles invités."),
    Bullet("Respect de la propriété intellectuelle (citations sourcées, photos avec droits)."),

    H1("10. Outils et stack"),
    Bullet("Google Search Console (référence)."),
    Bullet("Google Analytics 4 (configuré sans cookies tiers, RGPD compliant)."),
    Bullet("Plausible Analytics ou Matomo (alternative privacy-friendly)."),
    Bullet("Lighthouse / PageSpeed Insights."),
    Bullet("Schema.org Validator."),
    Bullet("ScreamingFrog (audit technique, version gratuite)."),
    Bullet("Outil suivi positionnement (à déterminer An 2)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte éditoriale, Ligne éditoriale blog, Glossaire voyage, Stratégie réseaux sociaux, Plan marketing An 1, Politique accessibilité PMR, Politique RGPD.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — LIGNE ÉDITORIALE BLOG
// ============================================================
function ligneEditorialeBlog() {
  return [
    bandeauTitre(
      "LIGNE ÉDITORIALE BLOG EVENTY LIFE",
      "Calendrier, formats, méthodologie de rédaction du blog eventylife.fr/blog",
    ),
    Spacer(160),

    P("La présente ligne éditoriale formalise la stratégie de contenu du blog d'EVENTY LIFE SAS sur eventylife.fr/blog. Elle complète la Charte éditoriale (qui définit le ton) et le Guide SEO (qui définit l'approche technique) en posant le cadre éditorial spécifique au blog : objectifs, formats, calendrier, méthodologie de production.", { italics: true }),

    P("Le blog Eventy n'est pas un canal de pub ; c'est un service d'information aux voyageurs et aux curieux. Chaque article doit apporter une vraie valeur (information utile, perspective éclairante, plaisir de lecture) — pas seulement chercher à attirer du trafic.", { italics: true }),

    H1("1. Mission du blog"),
    Bullet("Aider les voyageurs à mieux préparer et vivre leur voyage."),
    Bullet("Partager l'âme d'Eventy (économie circulaire, rassemblement, voyage juste)."),
    Bullet("Construire une communauté autour du voyage en groupe accompagné."),
    Bullet("Améliorer la visibilité naturelle d'Eventy (SEO sain)."),
    Bullet("Assurer une présence éditoriale crédible et durable."),

    H1("2. Audiences cibles"),
    makeTable({
      widths: [2496, 3744, 3120],
      header: ["Audience", "Profil", "Sujets prioritaires"],
      rows: [
        ["Voyageur curieux", "Pré-réservation, recherche d'information", "Destinations, conseils voyage, témoignages"],
        ["Voyageur fidèle", "Déjà voyagé Eventy, lit pour préparer le suivant", "Destinations à venir, coulisses, communauté"],
        ["Prospect B2B / CSE", "RH, comités d'entreprise", "Voyage CSE, séminaires, témoignages B2B"],
        ["Partenaire potentiel", "HRA, créateur, vendeur", "Modèle Eventy, ouverture, témoignages partenaires"],
        ["Presse / influenceur", "Recherche de contenu sourcé", "Engagement Eventy, transparence, chiffres clés"],
        ["SEO grand public", "Recherche Google sur sujets voyage", "Articles informationnels longue traîne"],
      ],
    }),

    H1("3. Formats et catégories"),

    H2("3.1. Catégorie 1 — Destinations (40 % des articles)"),
    Bullet("Format : guide complet d'une destination Eventy (1 500-2 500 mots)."),
    Bullet("Trame : pourquoi y aller, que voir, que faire, conseils pratiques, lien vers le voyage Eventy."),
    Bullet("Photos : ≥ 8 photos haute définition."),
    Bullet("Cohérence avec les fiches voyages (sans duplication, complémentaire)."),

    H2("3.2. Catégorie 2 — Conseils voyage (25 %)"),
    Bullet("Format : article pratique (800-1 500 mots)."),
    Bullet("Trame : problème courant + réponse pratique + lien vers solution Eventy si pertinente."),
    Bullet("Exemples : « Comment voyager seul·e sans se sentir seul·e », « 7 erreurs à éviter avant un voyage en groupe », « Tout savoir sur le Pack Sérénité »."),

    H2("3.3. Catégorie 3 — Vie Eventy / coulisses (15 %)"),
    Bullet("Format : récit (800-1 200 mots) ou portrait (600-1 000 mots)."),
    Bullet("Trame : storytelling Eventy, équipe, partenaires, voyageurs."),
    Bullet("Exemples : « Comment on a sourcé l'hôtel de Lisbonne », « Portrait de [créateur] »."),

    H2("3.4. Catégorie 4 — Engagement / RSE (10 %)"),
    Bullet("Format : article réflexif (1 000-1 500 mots)."),
    Bullet("Trame : enjeu sociétal + position d'Eventy + actions concrètes."),
    Bullet("Exemples : « Le surtourisme et nous », « Pourquoi Eventy paye à 30 jours fin de mois »."),

    H2("3.5. Catégorie 5 — Témoignages voyageurs (10 %)"),
    Bullet("Format : interview / récit (600-1 000 mots)."),
    Bullet("Trame : profil voyageur + voyage Eventy + ce qu'il/elle en a tiré."),
    Bullet("Toujours avec accord écrit du voyageur (cohérence RGPD)."),

    H1("4. Calendrier éditorial"),

    H2("4.1. Fréquence cible"),
    Bullet("An 1 : 2 articles / mois (24 articles / an)."),
    Bullet("An 2 : 4 articles / mois (48 articles / an)."),
    Bullet("An 3 : 8 articles / mois (96 articles / an)."),

    H2("4.2. Saisonnalité"),
    Bullet("Janvier : bilans année précédente + inspirations vacances février."),
    Bullet("Février-mars : ponts de mai, vacances de printemps."),
    Bullet("Avril-mai : vacances d'été, road-trips."),
    Bullet("Juin-juillet : derniers conseils été, anniversaire Eventy."),
    Bullet("Août-septembre : préparation rentrée, weekends d'automne."),
    Bullet("Octobre-novembre : Noël/jour de l'an, ponts, vacances ski (selon catalogue)."),
    Bullet("Décembre : bilans année + inspirations 2027."),

    H2("4.3. Planification"),
    Bullet("Calendrier édito construit en T-1 (trimestre précédent)."),
    Bullet("Articles rédigés et programmés à J-15 minimum."),
    Bullet("Possibilité d'articles d'opportunité (actualité, événement)."),

    H1("5. Méthodologie de production"),

    H2("5.1. Briefing article"),
    Bullet("Sujet précis et angle."),
    Bullet("Audience cible (cf. point 2)."),
    Bullet("Mots-clés SEO principaux et secondaires."),
    Bullet("Longueur cible."),
    Bullet("Sources à citer."),
    Bullet("CTA et liens internes prévus."),

    H2("5.2. Rédaction"),
    Bullet("Cohérence stricte avec la Charte éditoriale Eventy (5 piliers du ton)."),
    Bullet("Tutoiement systématique (sauf B2B)."),
    Bullet("Sources factuelles et vérifiables."),
    Bullet("Refus du contenu généré par IA non révisé (l'IA peut être un outil, jamais une finalité)."),
    Bullet("Refus du copier-coller — toujours réécrire avec sa propre voix."),
    Bullet("Citations sourcées avec lien d'origine."),

    H2("5.3. Validation"),
    Bullet("Auto-relecture par l'auteur·rice (orthographe, ton, faits)."),
    Bullet("Relecture par un pair Eventy."),
    Bullet("Validation finale Président pour les articles à enjeu (engagement, presse, RSE)."),
    Bullet("Cohérence éditoriale et SEO vérifiée."),

    H2("5.4. Publication"),
    Bullet("Publication selon calendrier."),
    Bullet("Promotion sur les réseaux sociaux (cohérence Stratégie réseaux sociaux)."),
    Bullet("Newsletter mensuelle reprenant les meilleurs articles."),
    Bullet("Partage par l'équipe sur LinkedIn personnel."),

    H1("6. Auteurs et signatures"),

    H2("6.1. Signatures"),
    Bullet("Tous les articles sont signés (nom + prénom + rôle)."),
    Bullet("Auteurs récurrents : David Eventy (Président), créateurs partenaires, équipe interne."),
    Bullet("Auteurs invités possibles (voyageur, expert, partenaire) avec validation préalable."),
    Bullet("Photo de l'auteur en mini-bio en bas de l'article."),

    H2("6.2. Charte auteur"),
    Bullet("Engagement à respecter la Charte éditoriale et la Ligne éditoriale."),
    Bullet("Engagement à fact-checker ses propos."),
    Bullet("Engagement à signaler les conflits d'intérêts éventuels."),
    Bullet("Cession non-exclusive des droits de publication à Eventy."),

    H1("7. Articles à éviter ou interdits"),
    Bullet("Articles \"clickbait\" sans valeur réelle."),
    Bullet("Articles purement promotionnels (le blog n'est pas une plaquette)."),
    Bullet("Articles polémiques sans intérêt voyage."),
    Bullet("Articles politiques (sauf positionnement Eventy clair sur souveraineté économique, RSE)."),
    Bullet("Articles religieux."),
    Bullet("Articles dénigrant des concurrents (compatibilité avec la Charte éditoriale)."),
    Bullet("Articles auto-générés sans révision humaine."),

    H1("8. Indicateurs blog"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Articles publiés / an", "≥ 24", "≥ 96"],
        ["Visiteurs uniques mensuels blog", "≥ 1 000", "≥ 30 000"],
        ["Temps moyen sur l'article", "≥ 2 min", "≥ 4 min"],
        ["Taux de rebond", "≤ 70 %", "≤ 50 %"],
        ["Conversion blog → fiche voyage", "≥ 5 %", "≥ 12 %"],
        ["Articles avec ≥ 50 partages", "≥ 10 %", "≥ 25 %"],
      ],
    }),

    H1("9. Newsletter associée"),
    Bullet("Newsletter mensuelle « Le Mensuel Eventy »."),
    Bullet("Reprend 3-5 articles du blog du mois + 1 actualité Eventy + 1 voyage à la une."),
    Bullet("Format épuré, lisible mobile, accessible."),
    Bullet("Désinscription en un clic (cohérence RGPD)."),
    Bullet("Cible An 1 : ≥ 2 000 abonnés actifs ; An 3 : ≥ 30 000."),
    Bullet("Taux d'ouverture cible : ≥ 35 % An 1 ; ≥ 45 % An 3."),

    H1("10. Engagements éditoriaux Eventy"),
    Bullet("Refus de toute publicité native non signalée."),
    Bullet("Refus de l'achat d'articles invités camouflés."),
    Bullet("Mention transparente de tout partenariat ou affiliation."),
    Bullet("Respect de la propriété intellectuelle (citations, photos avec droits)."),
    Bullet("Modération bienveillante des commentaires (refus suppression hors injures)."),
    Bullet("Stockage des données blog conforme RGPD (Politique RGPD Eventy)."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte éditoriale, Guide SEO, Glossaire voyage, Stratégie réseaux sociaux, Plan marketing An 1, Politique RGPD, Politique avis voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — GLOSSAIRE VOYAGE EVENTY
// ============================================================
function glossaireVoyage() {
  return [
    bandeauTitre(
      "GLOSSAIRE VOYAGE EVENTY LIFE",
      "Vocabulaire du tourisme expliqué — voyageurs et équipe",
    ),
    Spacer(160),

    P("Ce glossaire rassemble les termes techniques, juridiques et commerciaux utilisés dans l'univers du voyage de groupe et chez EVENTY LIFE SAS. Il vise à rendre transparent et accessible un vocabulaire parfois opaque, conformément à l'engagement Eventy de transparence radicale.", { italics: true }),

    P("Ce glossaire est public sur eventylife.fr/glossaire et mis à jour deux fois par an. Il est aussi un outil interne pour l'équipe (cohérence des termes utilisés dans les supports écrits et oraux).", { italics: true }),

    H1("A"),
    P("ACCOMPAGNATEUR — Personne formée par Eventy qui accompagne le groupe pendant tout le voyage. Disponible 24/7 sur place, garant du respect du programme, médiateur en cas de besoin. Cohérence avec la Charte qualité accompagnateur."),
    P("APST — Association Professionnelle de Solidarité du Tourisme. Organisme de garantie financière qu'Eventy a choisi pour protéger 100 % des fonds versés par les voyageurs. En cas de défaillance Eventy, l'APST garantit le remboursement intégral. Cohérence avec le Dossier garantie financière."),
    P("ATOUT FRANCE — Agence de développement touristique de la France. Tient le registre national des opérateurs de voyages et de séjours (immatriculation obligatoire). Eventy est immatriculé Atout France conformément à l'article L211-18 du Code du tourisme."),
    P("ALL INCLUSIVE — Voir « tout inclus ». Eventy préfère cette dernière formulation."),

    H1("B"),
    P("BEH — Bulletin Épidémiologique Hebdomadaire. Publication officielle française qui édite chaque année les recommandations sanitaires pour les voyageurs. Référence pour la Fiche santé voyageur Eventy."),
    P("BON DE COMMANDE — Document contractuel signé par le voyageur lors de sa réservation, qui formalise la commande de prestations Eventy. Comprend les CGV (cohérence Bon de commande HRA + CGV Eventy)."),

    H1("C"),
    P("CEAM — Carte Européenne d'Assurance Maladie. Permet d'accéder aux soins inopinés dans les pays de l'UE/EEE/Suisse. Demande gratuite sur ameli.fr. Complémentaire au Pack Sérénité Eventy."),
    P("CGV — Conditions Générales de Vente. Document contractuel obligatoire sur eventylife.fr, conformes au Code du tourisme et à la directive UE 2015/2302. Cohérence avec le document CGV Eventy."),
    P("COMPTE CANTONNÉ — Compte bancaire ouvert chez la banque domiciliataire d'Eventy, dédié exclusivement à recevoir les fonds des voyageurs avant le voyage. Garantit que ces fonds ne peuvent pas être utilisés pour d'autres dépenses Eventy. Sécurité supplémentaire à la garantie APST."),
    P("CRÉATEUR — Partenaire indépendant Eventy qui conçoit, opère et accompagne un voyage. Rémunéré par la marge HRA + 3 points supplémentaires sur les prestations HRA refacturées. Cumulable avec rôle de vendeur. Cohérence avec le Contrat créateur."),

    H1("D"),
    P("DPA — Data Processing Agreement (Contrat de sous-traitance RGPD). Document contractuel imposé par l'article 28 du RGPD à tout sous-traitant qui traite des données personnelles pour le compte d'Eventy (Stripe, Scaleway, Google Workspace, etc.)."),
    P("DPO — Délégué à la Protection des Données. Référent RGPD interne ou externe. Eventy a un DPO externe désigné. Coordonnées : dpo@eventylife.fr."),

    H1("E"),
    P("ESTA — Electronic System for Travel Authorization. Autorisation électronique préalable obligatoire pour visiter les États-Unis (court séjour). Coût 21 USD, valable 2 ans, demande à faire 7 jours avant le départ minimum."),
    P("ETIAS — European Travel Information and Authorization System. À partir de 2026, autorisation électronique préalable obligatoire pour les ressortissants hors UE pour entrer dans l'espace Schengen. Coût 7 €, valable 3 ans."),

    H1("F"),
    P("FIL D'ARIANE — Service du ministère des Affaires étrangères français permettant de s'inscrire avant un voyage à l'étranger pour être pris en compte par les services consulaires en cas de crise. Inscription gratuite sur diplomatie.gouv.fr/ariane. Recommandé pour tous les voyages internationaux Eventy."),
    P("FORFAIT TOURISTIQUE — Voyage à forfait au sens de la directive UE 2015/2302 — combinaison d'au moins 2 prestations achetées en une seule transaction. Tous les voyages Eventy sont des forfaits touristiques au sens légal."),

    H1("G"),
    P("GARANTIE FINANCIÈRE — Mécanisme légal (article L211-18 Code tourisme) protégeant 100 % des fonds versés par les voyageurs en cas de défaillance de l'opérateur. Eventy a choisi l'APST comme garant."),
    P("GROUP TRAVEL — Voyage en groupe. Eventy se positionne sur les groupes de 4 à 38 voyageurs."),

    H1("H"),
    P("HRA — Hôtel-Restaurant-Activité. Désigne dans le langage interne Eventy l'ensemble des partenaires qui fournissent les prestations sur place : hôtels, restaurants, sites d'activités, guides. Cohérence avec le Contrat HRA Partenaire."),

    H1("I"),
    P("IM — Immatriculation au registre des opérateurs de voyages tenu par Atout France. Eventy dispose d'un IM conformément à la loi."),
    P("INFORMATION PRÉCONTRACTUELLE — Document remis au voyageur AVANT la signature du contrat, conformément à l'arrêté du 1er mars 2018. Cohérence avec le document Information précontractuelle Eventy."),

    H1("L"),
    P("LCB-FT — Lutte Contre le Blanchiment et le Financement du Terrorisme. Engagement règlementaire intégré aux process Eventy."),

    H1("M"),
    P("MEAE — Ministère de l'Europe et des Affaires Étrangères (France Diplomatie). Source officielle des conseils aux voyageurs (codes couleur vert/jaune/orange/rouge). Eventy n'opère qu'en zones vertes ou jaunes."),
    P("MTV — Médiation Tourisme et Voyage. Médiateur sectoriel gratuit pour les litiges entre voyageurs et opérateurs. Eventy adhère et y renvoie systématiquement en cas de litige non résolu en interne."),

    H1("N"),
    P("NPS — Net Promoter Score. Indicateur de satisfaction calculé sur la question « Recommanderais-tu Eventy à un proche ? ». Score de −100 à +100. Cible Eventy An 1 : ≥ +60. Cible An 3 : ≥ +75."),

    H1("P"),
    P("PACK SÉRÉNITÉ — Ensemble de protections incluses systématiquement dans tout voyage Eventy : assistance médicale 24/7, hébergement de secours, rapatriement, soutien psychologique. Cohérence avec les engagements Eventy."),
    P("PMR — Personne à Mobilité Réduite. Eventy s'engage à accueillir les PMR dans la limite des contraintes opérationnelles. Cohérence avec la Politique accessibilité PMR."),

    H1("R"),
    P("RC PRO — Responsabilité Civile Professionnelle. Assurance obligatoire pour les opérateurs de voyages (article L211-18). Eventy souscrit une RC Pro conforme."),
    P("RGPD — Règlement Général sur la Protection des Données (Règlement (UE) 2016/679). Cadre européen de protection des données personnelles. Cohérence avec la Politique de confidentialité RGPD Eventy."),

    H1("S"),
    P("SAS — Société par Actions Simplifiée. Forme juridique d'EVENTY LIFE SAS. Cohérence avec les Statuts SAS Eventy."),
    P("SCHEMA.ORG — Vocabulaire structuré reconnu par les moteurs de recherche pour qualifier le contenu (Trip, TouristTrip, FAQPage, Review). Utilisé sur eventylife.fr pour le SEO."),
    P("SEUIL MINIMAL DE PARTENAIRES — Particularité Eventy : un voyage part dès qu'il y a 4 voyageurs, là où d'autres opérateurs annulent en deçà de 15-20 voyageurs. Cohérence avec la promesse Eventy."),

    H1("T"),
    P("TOUT INCLUS — Voyage Eventy : transport, hébergement, repas, activités, accompagnateur, Pack Sérénité — tout est inclus dans le prix unique affiché. Eventy préfère « tout inclus » à « all inclusive »."),
    P("TVA MARGE — Régime fiscal spécifique au tourisme (article 266-1-e CGI). La TVA s'applique sur la marge réalisée par l'opérateur, pas sur le prix total payé par le voyageur. Cohérence avec la Note expert-comptable."),

    H1("V"),
    P("VENDEUR — Partenaire Eventy qui place des voyages auprès de son réseau. Rémunéré par 5 % HT du CA voyage placé. Cumulable avec rôle de créateur. Cohérence avec le Contrat vendeur."),
    P("VOYAGEUR — Personne qui achète un voyage Eventy. Eventy préfère « voyageur » à « client » par respect (un voyageur n'est pas qu'un client, c'est une personne qui voyage)."),
    P("VOYAGEUR FAMILLE — Statut acquis dès le 5e voyage Eventy. Avantages : 10 % de remise, soirée d'accueil offerte, cadeau de voyage. Cohérence avec le Programme de fidélisation Eventy Famille."),
    P("VOYAGEUR FIDÈLE — Statut acquis dès le 2e voyage Eventy. Avantages : 5 % de remise, upgrade chambre prioritaire."),
    P("VOYAGEUR LÉGENDE — Statut acquis dès le 10e voyage Eventy. Avantages : 15 % de remise à vie, accès en avant-première au catalogue, événements VIP, mention nominative dans le Cercle des Légendes."),

    H1("Z"),
    P("ZONE ROUGE / ORANGE / JAUNE / VERTE — Codes couleur du MEAE (France Diplomatie) qualifiant le niveau de sécurité d'une destination. Eventy n'opère qu'en zones vertes ou jaunes (cohérence avec la Grille de décision destinations)."),

    Spacer(200),

    H1("Termes éthiques propres à Eventy"),
    P("« On part même si on n'est que 4 » — Engagement opposable. Le voyage Eventy part dès le seuil minimal de partenaires (4 voyageurs), pas en attente de remplissage. Différence majeure avec les opérateurs traditionnels."),
    P("« Chaque euro est tracé » — Engagement de transparence radicale. Sur la fiche voyage Eventy, le voyageur voit la décomposition du prix : combien va à l'hôtel, au restaurant, au transporteur, à l'accompagnateur, à Eventy."),
    P("« Le voyage de groupe où tu n'as rien à gérer, tout à vivre » — Promesse-cadre Eventy. Inscrite au manifeste fondateur (AME-EVENTY.md)."),
    P("« Tu n'es jamais seul » — Engagement émotionnel Eventy : un humain est joignable 24/7 pendant le voyage."),
    P("« Liberté de l'économie » — Posture éditoriale Eventy. Préférence à l'économie redistributive et circulaire vs économie extractive."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour bisannuelle (T1 et T3).", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Charte éditoriale, Guide SEO, Ligne éditoriale blog, FAQ voyageurs, AME-EVENTY.md, ensemble du dispositif documentaire Eventy.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Guide-SEO.docx",
      title: "Eventy Life — Guide SEO",
      description: "Guide d'optimisation moteurs de recherche Eventy Life.",
      footer: "EVENTY LIFE SAS — Guide SEO",
      children: guideSEO(),
    },
    {
      file: "docs/garanties/Eventy-Life-Ligne-Editoriale-Blog.docx",
      title: "Eventy Life — Ligne éditoriale blog",
      description: "Ligne éditoriale du blog eventylife.fr/blog.",
      footer: "EVENTY LIFE SAS — Ligne éditoriale blog",
      children: ligneEditorialeBlog(),
    },
    {
      file: "docs/garanties/Eventy-Life-Glossaire-Voyage.docx",
      title: "Eventy Life — Glossaire voyage",
      description: "Glossaire du vocabulaire tourisme et Eventy Life.",
      footer: "EVENTY LIFE SAS — Glossaire voyage",
      children: glossaireVoyage(),
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
