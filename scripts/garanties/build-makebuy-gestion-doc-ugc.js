/**
 * Eventy Life — Trois documents gouvernance opérationnelle
 *
 *   1. Politique d'externalisation et choix make/buy
 *   2. Politique de gestion documentaire et archivage
 *   3. Charte des contenus utilisateurs (UGC)
 *
 * Usage : node scripts/garanties/build-makebuy-gestion-doc-ugc.js
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
// DOCUMENT 1 — POLITIQUE MAKE/BUY
// ============================================================
function politiqueMakeBuy() {
  return [
    bandeauTitre(
      "POLITIQUE D'EXTERNALISATION EVENTY",
      "Choix make/buy — règles de décision interne vs externe",
    ),
    Spacer(160),

    P("La présente politique formalise les règles de décision d'EVENTY LIFE SAS sur le choix de réaliser une activité en interne ou de l'externaliser. Elle complète le Plan stratégique 5 ans et la Roadmap technique en posant des critères clairs pour préserver la maîtrise sur les sujets stratégiques tout en optimisant les ressources sur les sujets non-stratégiques.", { italics: true }),

    P("Eventy adopte une approche pragmatique : faire en interne ce qui touche à l'identité, à la maîtrise technique stratégique et à la relation directe au voyageur ; externaliser ce qui peut l'être sans perte de qualité ni de souveraineté. Cette discipline est cohérente avec notre vision de souveraineté numérique et économique.", { italics: true }),

    H1("1. Principes directeurs"),

    H2("1.1. Cinq principes"),
    Bullet("Maîtrise sur les sujets identitaires (refus de l'externalisation totale)."),
    Bullet("Souveraineté sur les données voyageurs (refus de céder le contrôle)."),
    Bullet("Externalisation de l'expertise pointue (refus du faire à moitié)."),
    Bullet("Maîtrise des coûts (interne quand volume justifie, externe quand opportunité)."),
    Bullet("Cohérence avec les valeurs Eventy (refus des prestataires aux pratiques contraires)."),

    H2("1.2. Refus structurés"),
    Bullet("Refus d'externaliser la création de voyages (cœur de métier)."),
    Bullet("Refus d'externaliser la relation directe au voyageur (sauf canaux outsourcés validés)."),
    Bullet("Refus d'externaliser l'audit qualité HRA (cohérence Procédure d'audit qualité HRA)."),
    Bullet("Refus d'externaliser les décisions stratégiques."),
    Bullet("Refus de l'offshoring extractif (Inde, Maroc, Madagascar) sur sujets sensibles."),

    H1("2. Cartographie make/buy par domaine"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Domaine", "Décision Eventy", "Justification"],
      rows: [
        ["Création voyages", "Make (créateurs)", "Cœur de métier, qualité Eventy"],
        ["Plateforme web/mobile", "Make (équipe interne)", "Souveraineté numérique"],
        ["Hébergement cloud", "Buy (Scaleway France)", "Expertise pointue, souveraineté préservée"],
        ["Paiements en ligne", "Buy (Stripe)", "Expertise pointue, conformité PCI-DSS"],
        ["Email transactionnel", "Buy (SendGrid/Postmark)", "Expertise pointue, faible enjeu identitaire"],
        ["Comptabilité", "Make + Buy (expert-comptable)", "Tenue interne + expert externe"],
        ["Juridique", "Buy (avocat tourisme partenaire)", "Expertise pointue"],
        ["Cybersécurité avancée", "Buy (cabinet PASSI annuel)", "Expertise certifiée requise"],
        ["DPO", "Buy (DPO externe)", "Expertise + indépendance"],
        ["Marketing digital", "Make + Buy (agence partielle)", "Make stratégie, buy exécution selon volume"],
        ["Support voyageurs", "Make (équipe Eventy)", "Relation directe = identité"],
        ["Pack Sérénité", "Buy (assureur assistance)", "Expertise mondiale, infrastructure"],
        ["Transport voyageurs", "Buy (autocaristes partenaires)", "Pas le métier d'Eventy"],
        ["HRA partenaires", "Buy (panel certifié)", "Indépendants partenaires de l'écosystème"],
        ["Audit financier (CAC)", "Buy (cabinet certifié)", "Indépendance requise"],
      ],
    }),

    H1("3. Critères de décision"),

    H2("3.1. Quand faire en interne (make)"),
    Bullet("Activité touchant l'identité ou la valeur ajoutée Eventy."),
    Bullet("Activité avec des données voyageurs sensibles."),
    Bullet("Activité avec relation directe voyageur."),
    Bullet("Volume justifiant l'investissement."),
    Bullet("Volonté d'apprentissage et de capitalisation interne."),
    Bullet("Refus de dépendance critique à un fournisseur."),

    H2("3.2. Quand externaliser (buy)"),
    Bullet("Expertise pointue indispensable (juridique, fiscal, cybersec)."),
    Bullet("Indépendance requise (audit, DPO)."),
    Bullet("Infrastructure mutualisée (cloud, paiement)."),
    Bullet("Volume insuffisant pour justifier équipe interne."),
    Bullet("Activité non-stratégique."),
    Bullet("Engagement de progrès supérieur du prestataire."),

    H2("3.3. Hybride (make + buy)"),
    Bullet("Make stratégie + buy exécution (marketing digital, communication)."),
    Bullet("Make tenue + buy validation (comptabilité)."),
    Bullet("Make production + buy expertise pointue (tech)."),

    H1("4. Critères de sélection des prestataires externes"),

    H2("4.1. Critères obligatoires"),
    Bullet("Cohérence avec valeurs Eventy (refus des pratiques contraires)."),
    Bullet("Solidité financière (vérification Kbis, situation Banque de France)."),
    Bullet("Localisation France/Europe préférée (cohérence Politique d'achats responsables)."),
    Bullet("Engagement RSE structuré."),
    Bullet("Conformité RGPD (DPA signé pour traitement données — cohérence DPA Sous-traitance RGPD)."),
    Bullet("Pas de conflit d'intérêts (cohérence Politique conflits d'intérêts)."),

    H2("4.2. Critères de qualité"),
    Bullet("Références clients vérifiables."),
    Bullet("Certifications applicables (Qualiopi, ISO 27001, PASSI, etc.)."),
    Bullet("Qualité du service client et délais de réponse."),
    Bullet("Capacité à accompagner la croissance Eventy."),

    H2("4.3. Critères de prix"),
    Bullet("Tarif raisonnable au regard du marché."),
    Bullet("Refus du low-cost extractif (qualité dégradée)."),
    Bullet("Refus du surfacturage (recherche du juste prix)."),
    Bullet("Engagement transparence (pas de frais cachés)."),

    H1("5. Modalités contractuelles"),

    H2("5.1. Formalisation"),
    Bullet("Contrat-cadre signé pour tout prestataire récurrent."),
    Bullet("Devis ou bon de commande pour les missions ponctuelles."),
    Bullet("Annexe DPA RGPD pour traitement de données personnelles."),
    Bullet("Clauses de confidentialité (NDA) si information sensible."),
    Bullet("Cohérence avec Politique d'achats responsables."),

    H2("5.2. Engagements de paiement"),
    Bullet("Paiement à 30 jours fin de mois (LME — cohérence Politique d'achats responsables)."),
    Bullet("Paiement à 15 jours pour micro-entreprises locales (engagement Eventy renforcé)."),

    H2("5.3. Modalités de sortie"),
    Bullet("Préavis de résiliation prévu (3-6 mois selon enjeu)."),
    Bullet("Plan de réversibilité documenté pour prestataires stratégiques (cloud, paiement)."),
    Bullet("Récupération des données et documents en cas de fin de contrat."),

    H1("6. Suivi et évaluation"),
    Bullet("Audit annuel des prestataires récurrents (cohérence Plan d'audit interne)."),
    Bullet("Tableau de bord trimestriel : prestataires actifs, coûts, performance."),
    Bullet("Revue annuelle des choix make/buy (T1 chaque année)."),
    Bullet("Possibilité de réinternalisation si justifiée (volume, stratégie)."),

    H1("7. Cas particuliers — réinternalisation"),
    Bullet("Si le volume justifie l'embauche interne, possibilité de réinternalisation progressive."),
    Bullet("Cohérence avec Roadmap technique (plan d'embauches)."),
    Bullet("Délai de transition prévu (3-6 mois)."),
    Bullet("Maintien de la qualité de service pendant la transition."),

    H1("8. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Coût total externalisation / CA", "≤ 8 %", "≤ 6 %"],
        ["Prestataires localisation France/Europe", "≥ 90 %", "≥ 95 %"],
        ["DPA signés / prestataires sensibles", "100 %", "100 %"],
        ["Audit annuel prestataires récurrents", "≥ 80 %", "100 %"],
        ["Délai paiement prestataires (jours)", "≤ 25 j", "≤ 15 j"],
        ["Prestataires en redressement / défaillance", "0", "0"],
      ],
    }),

    H1("9. Engagements éthiques"),
    Bullet("Refus du dumping social ou fiscal via prestataires."),
    Bullet("Refus de l'offshoring extractif sur sujets sensibles."),
    Bullet("Engagement à payer juste et à 30 j fin de mois maximum."),
    Bullet("Refus des contrats léonins ou abusifs."),
    Bullet("Engagement à privilégier les prestataires alignés (RSE, éthique)."),
    Bullet("Refus de prestataires en conflit d'intérêts."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Plan stratégique 5 ans, Roadmap technique, Politique d'achats responsables, DPA Sous-traitance RGPD, Politique conflits d'intérêts, Politique cybersécurité, Politique anti-corruption, Plan d'audit interne.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — POLITIQUE DE GESTION DOCUMENTAIRE
// ============================================================
function politiqueGestionDocumentaire() {
  return [
    bandeauTitre(
      "POLITIQUE DE GESTION DOCUMENTAIRE EVENTY",
      "Taxonomie, conservation, archivage et accès aux documents",
    ),
    Spacer(160),

    P("La présente politique formalise la gestion documentaire d'EVENTY LIFE SAS : organisation des documents, durées de conservation, modalités d'archivage et d'accès. Elle complète la Politique cybersécurité (sécurité des données), la Politique RGPD (protection des données personnelles) et le Plan comptable (conservation des pièces).", { italics: true }),

    P("Eventy gère plus de 90 documents structurels (cohérence ce dispositif documentaire). À cette base s'ajoutent les contrats, factures, dossiers voyageurs, échanges email, etc. Sans politique structurée, l'information se perd. Cette politique vise à garantir traçabilité, sécurité, conformité et accessibilité raisonnée.", { italics: true }),

    H1("1. Cadre juridique"),
    Bullet("Article L123-22 du Code de commerce — conservation pièces comptables 10 ans."),
    Bullet("Code du travail — conservation bulletins de paie 5 ans."),
    Bullet("Livre des procédures fiscales — conservation documents fiscaux 6 ans."),
    Bullet("RGPD — conservation données personnelles selon finalité."),
    Bullet("Code du tourisme — conservation des dossiers voyageurs."),

    H1("2. Taxonomie documentaire Eventy"),

    H2("2.1. 8 catégories principales"),
    makeTable({
      widths: [2496, 4368, 2496],
      header: ["Catégorie", "Description", "Durée conservation"],
      rows: [
        ["Légal corporate", "Statuts, PV AG, K-bis, contrats associés", "Vie société + 10 ans"],
        ["Financier", "Comptabilité, factures, déclarations fiscales", "10 ans"],
        ["Contractuel", "Contrats partenaires, contrats clients, NDA", "Durée + 5 ans"],
        ["Réglementaire", "IM Atout France, garantie APST, RC Pro", "Vie société + 5 ans"],
        ["RH", "Contrats travail, bulletins paie, entretiens", "5-50 ans selon nature"],
        ["Voyageurs", "Réservations, bons commande, factures", "5 ans après dernier voyage (RGPD)"],
        ["Opérationnel", "Procédures, manuels, audits internes", "Version active + 5 ans"],
        ["Communication", "Site web, réseaux, presse, événements", "5 ans"],
      ],
    }),

    H2("2.2. Sous-catégories opérationnelles"),
    Bullet("Légal corporate : statuts, PV, registre des associés, immatriculation."),
    Bullet("Financier : factures clients, factures fournisseurs, banque, comptes annuels, déclarations."),
    Bullet("Contractuel : créateurs, vendeurs, HRA, ambassadeurs, prestataires, NDA."),
    Bullet("Réglementaire : Atout France, APST, CNIL, audits externes."),
    Bullet("RH : contrats CDI/CDD, bulletins paie, entretiens, formations, départs."),
    Bullet("Voyageurs : profils, réservations, voyages effectués, réclamations, avis."),
    Bullet("Opérationnel : procédures, manuels, audits, incidents, plans."),
    Bullet("Communication : contenus marketing, presse, ambassadeurs, événements."),

    H1("3. Architecture de stockage"),

    H2("3.1. Coffre-fort numérique sécurisé"),
    Bullet("Hébergement Scaleway France (cohérence Politique cybersécurité)."),
    Bullet("Chiffrement AES-256 au repos."),
    Bullet("Sauvegarde quotidienne, conservation 30 jours puis hebdomadaire 12 mois."),
    Bullet("Accès chiffré multi-facteurs (MFA)."),

    H2("3.2. Hiérarchie des dossiers"),
    Bullet("/01-legal-corporate/"),
    Bullet("/02-finance/"),
    Bullet("/03-contractuel/"),
    Bullet("/04-reglementaire/"),
    Bullet("/05-rh/"),
    Bullet("/06-voyageurs/ (avec sous-dossiers anonymisés/identifiés)"),
    Bullet("/07-operationnel/"),
    Bullet("/08-communication/"),
    Bullet("/archives/ (documents > 5 ans en consultation seule)"),

    H2("3.3. Conventions de nommage"),
    Bullet("Préfixe date YYYYMMDD."),
    Bullet("Catégorie ou type de document."),
    Bullet("Nom court explicite."),
    Bullet("Version (v1, v2, etc.)."),
    Bullet("Exemple : 20260502_contrat_HRA_hotel-bordeaux_v2.pdf"),

    H1("4. Niveaux de confidentialité"),

    H2("4.1. Public"),
    Bullet("Documents accessibles à tous (site web, presse)."),
    Bullet("Stockage en libre accès."),
    Bullet("Exemples : CGV, mentions légales, politique RGPD, FAQ."),

    H2("4.2. Interne équipe"),
    Bullet("Accessible à toute l'équipe Eventy."),
    Bullet("Confidentialité non sensible."),
    Bullet("Exemples : procédures opérationnelles, manuels."),

    H2("4.3. Restreint"),
    Bullet("Accès limité aux personnes habilitées."),
    Bullet("Exemples : contrats partenaires, données voyageurs, comptes financiers."),

    H2("4.4. Confidentiel direction"),
    Bullet("Accès limité au Président et aux personnes désignées."),
    Bullet("Exemples : carnet de bord dirigeant, négociations en cours, dossiers RH sensibles."),

    H1("5. Cycle de vie d'un document"),

    H2("5.1. Création"),
    Bullet("Convention de nommage respectée."),
    Bullet("Métadonnées remplies (auteur, date, version, classification)."),
    Bullet("Validation hiérarchique selon enjeu."),

    H2("5.2. Diffusion"),
    Bullet("Selon niveau de confidentialité."),
    Bullet("Accès tracé (logs)."),
    Bullet("Pas de copie locale non maîtrisée (refus du file-by-email)."),

    H2("5.3. Mise à jour"),
    Bullet("Versioning (v1, v2, etc.)."),
    Bullet("Conservation des versions précédentes (sauf exceptions)."),
    Bullet("Mention de la date de mise à jour."),

    H2("5.4. Archivage"),
    Bullet("Document hors vie active déplacé vers /archives/."),
    Bullet("Indexation maintenue pour retrouver le document."),
    Bullet("Accès limité à la consultation."),

    H2("5.5. Destruction"),
    Bullet("À l'issue de la durée légale de conservation."),
    Bullet("Suppression définitive et irrécupérable."),
    Bullet("Documenté dans un registre de destruction."),

    H1("6. RGPD et données personnelles"),

    H2("6.1. Principe de minimisation"),
    Bullet("Conservation uniquement des données nécessaires."),
    Bullet("Suppression à la fin de la finalité (sauf comptabilité 10 ans)."),
    Bullet("Cohérence avec Politique de confidentialité RGPD."),

    H2("6.2. Anonymisation et pseudonymisation"),
    Bullet("Données voyageurs : pseudonymisation après 3 ans pour les analyses."),
    Bullet("Anonymisation totale pour les statistiques publiques."),
    Bullet("Suppression définitive après 5 ans (sauf comptabilité)."),

    H2("6.3. Droits des personnes"),
    Bullet("Droit d'accès : export possible sur demande."),
    Bullet("Droit à l'effacement : suppression dans les délais légaux."),
    Bullet("Droit à la portabilité : export structuré JSON/CSV."),
    Bullet("Cohérence avec Politique RGPD."),

    H1("7. Sécurité documentaire"),
    Bullet("Chiffrement au repos (AES-256) et en transit (TLS 1.3)."),
    Bullet("MFA obligatoire pour accès direction."),
    Bullet("Logs d'accès conservés 12 mois."),
    Bullet("Audit annuel de la sécurité documentaire (cohérence Plan d'audit interne)."),
    Bullet("Refus de cloud non-européen pour données voyageurs (cohérence Politique cybersécurité)."),

    H1("8. Sauvegardes et résilience"),
    Bullet("Sauvegarde quotidienne automatique."),
    Bullet("Conservation 30 jours en standard."),
    Bullet("Sauvegarde hebdomadaire en zone géographique distincte (12 mois)."),
    Bullet("Sauvegarde mensuelle long terme (10 ans pour comptabilité)."),
    Bullet("Tests de restauration mensuels (cohérence Politique cybersécurité)."),
    Bullet("RPO ≤ 24 h, RTO ≤ 4 h An 1."),

    H1("9. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Documents indexés / total", "100 %", "100 %"],
        ["Convention de nommage respectée", "≥ 90 %", "100 %"],
        ["Documents avec métadonnées complètes", "≥ 80 %", "100 %"],
        ["Sauvegarde quotidienne réalisée", "100 %", "100 %"],
        ["Test restauration mensuel", "12/an", "12/an"],
        ["Audit documentaire annuel", "1", "1"],
      ],
    }),

    H1("10. Gouvernance"),
    Bullet("Référent gestion documentaire : Président en An 1, recrutement An 2-3."),
    Bullet("Revue annuelle de la politique."),
    Bullet("Mise à jour des durées de conservation selon évolutions réglementaires."),
    Bullet("Formation de l'équipe à l'arrivée et annuelle."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique cybersécurité, Politique RGPD, DPA Sous-traitance RGPD, Plan comptable et processus mensuel, Plan d'audit interne, Plan de continuité d'activité, ensemble du dispositif documentaire Eventy.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — CHARTE DES CONTENUS UTILISATEURS (UGC)
// ============================================================
function charteUGC() {
  return [
    bandeauTitre(
      "CHARTE DES CONTENUS UTILISATEURS EVENTY",
      "Règles d'utilisation des photos, témoignages et avis partagés par les voyageurs",
    ),
    Spacer(160),

    P("La présente charte formalise les règles applicables aux contenus utilisateurs (UGC — User-Generated Content) chez EVENTY LIFE SAS. Elle complète la Politique image et droit à l'image (cadre juridique général), la Politique avis voyageurs (gestion des avis publics) et le Code de conduite ambassadeurs (engagements ambassadeurs). Elle s'applique aux contenus partagés par voyageurs : photos, vidéos, témoignages, avis, posts réseaux sociaux taguant Eventy.", { italics: true }),

    P("Les contenus utilisateurs sont une richesse pour Eventy : ils témoignent authentiquement de l'expérience voyage. Notre approche : valoriser ces contenus avec accord, encadrer leur réutilisation, modérer avec bienveillance, refuser l'extraction commerciale sans consentement.", { italics: true }),

    H1("1. Cadre"),

    H2("1.1. Définition UGC"),
    Bullet("Tout contenu créé par un voyageur ou un partenaire et partagé publiquement."),
    Bullet("Photos, vidéos, blogs, posts réseaux sociaux, avis, témoignages."),
    Bullet("Contenus mentionnant Eventy ou un voyage Eventy."),

    H2("1.2. Cadre juridique"),
    Bullet("Article 9 du Code civil — droit à l'image (cohérence Politique image et droit à l'image)."),
    Bullet("Code de la propriété intellectuelle (droits d'auteur)."),
    Bullet("RGPD pour les données personnelles incluses."),
    Bullet("Loi influenceurs n° 2023-451 si UGC commercial (cohérence Code conduite ambassadeurs)."),

    H1("2. Principes directeurs"),
    Bullet("Respect du droit d'auteur du créateur de contenu."),
    Bullet("Aucun usage commercial sans accord exprès."),
    Bullet("Modération bienveillante mais ferme contre injures et discriminations."),
    Bullet("Crédit systématique au créateur lors de la réutilisation."),
    Bullet("Refus de la pression à produire du contenu."),
    Bullet("Refus de l'extraction commerciale sans consentement."),

    H1("3. Types de UGC encouragés"),

    H2("3.1. Photos et vidéos de voyage"),
    Bullet("Photos partagées sur les réseaux sociaux avec hashtag #EventyLife."),
    Bullet("Vidéos témoignages partagées spontanément."),
    Bullet("Encouragement bienveillant (newsletter, message accompagnateur)."),
    Bullet("Pas de pression à produire."),

    H2("3.2. Avis voyageurs"),
    Bullet("Avis Trustpilot (cohérence Politique avis voyageurs)."),
    Bullet("Avis Google Reviews."),
    Bullet("Témoignages internes sur eventylife.fr."),
    Bullet("Encouragement par email post-voyage J+2 (cohérence Onboarding voyageur)."),

    H2("3.3. Articles de blog voyageurs"),
    Bullet("Voyageurs qui rédigent un blog sur leur expérience Eventy."),
    Bullet("Mention transparente du voyage Eventy."),
    Bullet("Possibilité de partage dans la newsletter Eventy avec accord."),

    H2("3.4. Posts réseaux sociaux"),
    Bullet("Tags @eventylife, #EventyLife."),
    Bullet("Repost possible sur réseaux Eventy avec accord du créateur."),
    Bullet("Crédit au créateur (mention nominative)."),

    H1("4. Modalités de réutilisation par Eventy"),

    H2("4.1. Demande d'accord"),
    Bullet("Avant toute réutilisation : message direct au créateur."),
    Bullet("Description précise des supports (site, réseaux, brochure, etc.)."),
    Bullet("Durée d'utilisation (3 ans recommandé)."),
    Bullet("Mention du crédit (nominatif ou anonyme selon préférence)."),
    Bullet("Possibilité de refus sans conséquence."),

    H2("4.2. Forme de l'accord"),
    Bullet("Accord écrit (email avec confirmation explicite ou formulaire signé)."),
    Bullet("Conservation de l'accord (cohérence Politique image et droit à l'image)."),

    H2("4.3. Crédit"),
    Bullet("« Photo / Vidéo : @[username] » sur les réseaux."),
    Bullet("« Témoignage de [Prénom] » sur le site (avec accord nominatif)."),
    Bullet("Lien vers le profil ou le contenu original (si pertinent)."),

    H2("4.4. Rémunération éventuelle"),
    Bullet("Pas de rémunération automatique pour UGC spontané (free will)."),
    Bullet("Possibilité de cadeau Eventy en remerciement (avoir voyage 20-50 €)."),
    Bullet("Rémunération si utilisation commerciale structurée (publicité payante par exemple) — voir Code conduite ambassadeurs et Contrats influenceurs."),

    H1("5. Modération des contenus tagant Eventy"),

    H2("5.1. Modération des commentaires"),
    Bullet("Réponse à tous les commentaires sous 24 h ouvrées."),
    Bullet("Cohérence avec Politique avis voyageurs et Stratégie réseaux sociaux."),
    Bullet("Pas de suppression d'avis défavorable (sauf injures, discriminations)."),

    H2("5.2. Modération des contenus inappropriés"),
    Bullet("Suppression / signalement des contenus injurieux, discriminants, haineux."),
    Bullet("Signalement aux plateformes."),
    Bullet("En cas de contenu illégal : signalement aux autorités si nécessaire."),

    H2("5.3. Cas du contenu négatif (mais légal)"),
    Bullet("Réponse calme et factuelle."),
    Bullet("Invitation à un échange en privé pour résolution."),
    Bullet("Cohérence avec Procédure de réclamation détaillée."),
    Bullet("Pas de pression sur l'auteur pour modifier ou supprimer le contenu."),

    H1("6. Programme « Voix Eventy » (à partir An 2)"),
    Bullet("Programme d'encouragement bienveillant à la production d'UGC."),
    Bullet("Voyageurs Famille / Légende invités à témoigner."),
    Bullet("Mise à disposition de supports et conseils (kit Voix Eventy)."),
    Bullet("Mise en avant régulière dans la newsletter et sur le site."),
    Bullet("Cohérence avec Programme de fidélisation Eventy Famille."),

    H1("7. Refus structurés"),
    Bullet("Refus de l'achat de témoignages ou de faux avis."),
    Bullet("Refus de la pression sur les voyageurs pour produire du contenu."),
    Bullet("Refus du chantage à la remise contre avis."),
    Bullet("Refus de la suppression d'avis défavorable légal."),
    Bullet("Refus de la diffamation via UGC manipulé."),
    Bullet("Refus de la cession de UGC à des tiers sans accord."),

    H1("8. Cas particuliers"),

    H2("8.1. UGC montrant d'autres voyageurs"),
    Bullet("Le créateur doit avoir l'accord des autres personnes identifiables avant publication."),
    Bullet("Eventy ne réutilise pas si accord des autres personnes incertain."),
    Bullet("Cohérence avec Politique image et droit à l'image."),

    H2("8.2. UGC montrant des partenaires HRA"),
    Bullet("Mention positive ou neutre : libre."),
    Bullet("Mention négative : modération si discriminant ou diffamatoire."),
    Bullet("Information du partenaire HRA (avec accord du créateur si possible)."),

    H2("8.3. UGC montrant des mineurs"),
    Bullet("Refus systématique de réutilisation sauf accord parental écrit."),
    Bullet("Cohérence avec Politique image et droit à l'image (Niveau 4)."),

    H2("8.4. Contenu créé par influenceur partenaire"),
    Bullet("Cadre contractuel structuré (cohérence Code de conduite ambassadeurs)."),
    Bullet("Mention « partenariat rémunéré » obligatoire (loi influenceurs)."),
    Bullet("Modalités de réutilisation prévues au contrat."),

    H1("9. Stockage et archivage"),
    Bullet("UGC réutilisés stockés sur cloud sécurisé France (Scaleway)."),
    Bullet("Accord lié à chaque média (métadonnées)."),
    Bullet("Conservation : durée d'utilisation + 1 an d'archive."),
    Bullet("Cohérence avec Politique de gestion documentaire."),

    H1("10. Indicateurs"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Posts UGC mentionnant Eventy / mois", "≥ 30", "≥ 500"],
        ["Avis voyageurs (Trustpilot, Google)", "≥ 200/an", "≥ 5 000/an"],
        ["Témoignages réutilisés avec accord", "100 %", "100 %"],
        ["Délai de réponse aux contenus tagués", "≤ 24 h", "≤ 4 h"],
        ["Plaintes droit d'auteur / image", "0", "0"],
        ["Note moyenne UGC sur Eventy", "≥ 4,5/5", "≥ 4,7/5"],
      ],
    }),

    H1("11. Engagements éthiques"),
    Bullet("Respect absolu des droits du créateur de contenu."),
    Bullet("Crédit systématique lors de la réutilisation."),
    Bullet("Refus de la pression et du chantage."),
    Bullet("Modération bienveillante."),
    Bullet("Refus de l'achat de témoignages."),
    Bullet("Transparence sur les contenus sponsorisés."),
    Bullet("Engagement à former les accompagnateurs sur ces règles."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 2 mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique image et droit à l'image, Politique avis voyageurs, Code de conduite ambassadeurs, Programme de fidélisation Eventy Famille, Stratégie réseaux sociaux, Politique RGPD, Politique de gestion documentaire, Charte éditoriale.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Make-Buy.docx",
      title: "Eventy Life — Politique d'externalisation et choix make/buy",
      description: "Règles de décision interne vs externe pour les activités Eventy.",
      footer: "EVENTY LIFE SAS — Politique make/buy",
      children: politiqueMakeBuy(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Gestion-Documentaire.docx",
      title: "Eventy Life — Politique de gestion documentaire et archivage",
      description: "Taxonomie, conservation, archivage des documents.",
      footer: "EVENTY LIFE SAS — Politique gestion documentaire",
      children: politiqueGestionDocumentaire(),
    },
    {
      file: "docs/garanties/Eventy-Life-Charte-UGC.docx",
      title: "Eventy Life — Charte des contenus utilisateurs",
      description: "Règles d'utilisation des photos, témoignages et avis voyageurs.",
      footer: "EVENTY LIFE SAS — Charte des contenus utilisateurs",
      children: charteUGC(),
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
