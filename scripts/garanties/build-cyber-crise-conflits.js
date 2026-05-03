/**
 * Eventy Life — Trois documents gouvernance / sécurité
 *
 *   1. Politique de cybersécurité et sécurité des SI
 *   2. Procédure de gestion de crise communication corporate
 *   3. Politique de gestion des conflits d'intérêts
 *
 * Usage : node scripts/garanties/build-cyber-crise-conflits.js
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
// DOCUMENT 1 — POLITIQUE DE CYBERSÉCURITÉ
// ============================================================
function politiqueCybersecurite() {
  return [
    bandeauTitre(
      "POLITIQUE DE CYBERSÉCURITÉ EVENTY LIFE",
      "Sécurité des systèmes d'information — protection des données voyageurs",
    ),
    Spacer(160),

    P("La présente politique de cybersécurité formalise les engagements et les mesures techniques d'EVENTY LIFE SAS en matière de protection des systèmes d'information et des données traitées (voyageurs, partenaires, équipe). Elle complète et opérationnalise la Politique de confidentialité RGPD et le DPA de sous-traitance.", { italics: true }),

    P("Eventy traite des données sensibles (identité civile, paiements, données médicales si signalées par le voyageur) qui exigent un haut niveau de sécurité. Cette politique vise à : protéger la confidentialité, l'intégrité et la disponibilité des données ; respecter le RGPD article 32 ; garantir la continuité des opérations ; rassurer voyageurs, partenaires et investisseurs.", { italics: true }),

    H1("1. Cadre de référence"),
    Bullet("RGPD article 32 — sécurité du traitement."),
    Bullet("Recommandations ANSSI — Guide d'hygiène informatique."),
    Bullet("Norme ISO/IEC 27001 — système de management de la sécurité de l'information (cible An 3)."),
    Bullet("Norme PCI-DSS — sous-traitance Stripe (Stripe certifié, Eventy ne stocke pas de PAN)."),
    Bullet("Référentiel sécurité Cloud SecNumCloud (cible long terme pour hébergement)."),

    H1("2. Périmètre"),
    Bullet("Plateforme web propriétaire eventylife.fr (Next.js + NestJS)."),
    Bullet("Base de données voyageurs et partenaires (PostgreSQL hébergé France)."),
    Bullet("Espaces de stockage cloud (Scaleway Object Storage France)."),
    Bullet("Outils internes (emails, gestion documentaire, comptabilité)."),
    Bullet("Postes de travail des collaborateurs."),
    Bullet("Sous-traitants techniques (Stripe, Google Workspace, etc.) — couverts par DPA."),

    H1("3. Architecture de sécurité"),

    H2("3.1. Hébergement et infrastructure"),
    Bullet("Hébergement principal en France (Scaleway, datacenters Paris) — souveraineté numérique européenne."),
    Bullet("CDN edge avec terminaison TLS 1.3 minimum."),
    Bullet("Cloisonnement strict des environnements : développement, staging, production, sauvegardes."),
    Bullet("Bases de données chiffrées au repos (AES-256), répliquées sur 2 zones distinctes."),
    Bullet("WAF (Web Application Firewall) en amont de la production avec règles OWASP Top 10."),
    Bullet("DDoS protection mutualisée au niveau infrastructure."),

    H2("3.2. Authentification et accès"),
    Bullet("Voyageurs : authentification email + mot de passe ≥ 12 caractères, hashing Argon2id, option passkey/Webauthn (déploiement An 1-2)."),
    Bullet("Équipe interne : authentification multi-facteurs (MFA) obligatoire — TOTP ou hardware key."),
    Bullet("Partenaires créateurs/vendeurs/HRA : MFA obligatoire à partir du portail pro."),
    Bullet("Politique de mots de passe : complexité minimale, rotation 12 mois pour comptes admin, 0 contrainte arbitraire pour voyageurs (NIST SP 800-63B)."),
    Bullet("Sessions limitées (24 h voyageur, 8 h admin), révocation côté serveur."),
    Bullet("Verrouillage automatique après tentatives échouées (5 essais, blocage 15 min)."),

    H2("3.3. Habilitations (principe du moindre privilège)"),
    Bullet("Comptes nominatifs uniquement (pas de comptes partagés)."),
    Bullet("Rôles et permissions matricés (RBAC) — voir Annexe : matrice rôles RBAC."),
    Bullet("Revue annuelle des habilitations (sortie collaborateur déclenche révocation immédiate)."),
    Bullet("Comptes admin techniques séparés des comptes utilisateur quotidiens."),
    Bullet("Accès SSH bastion centralisé, audit logs."),

    H1("4. Sécurité applicative"),

    H2("4.1. Développement sécurisé"),
    Bullet("Revue de code obligatoire avant merge en production (pull request peer-reviewed)."),
    Bullet("Tests automatisés (unitaires, intégration) — couverture ≥ 70 % cible An 1, ≥ 85 % cible An 3."),
    Bullet("Analyse statique (SAST) intégrée à la CI : Snyk, Sonar ou équivalent."),
    Bullet("Analyse dynamique (DAST) sur staging, mensuelle minimum."),
    Bullet("Scan automatique des dépendances open source (CVE) — alertes hebdomadaires."),
    Bullet("Validation systématique des entrées (anti-XSS, anti-SQLi, anti-SSRF)."),
    Bullet("Headers de sécurité HTTP : CSP strict, HSTS, X-Frame-Options, Referrer-Policy."),

    H2("4.2. Données sensibles"),
    Bullet("Données de paiement : zéro stockage du PAN ou CVC — délégation totale à Stripe (PCI-DSS Level 1)."),
    Bullet("Données médicales (allergies, mobilité réduite) : chiffrement applicatif supplémentaire (champs colonne chiffrés)."),
    Bullet("Identité civile (CNI passeport pour voyages internationaux) : stockage temporaire chiffré, suppression après voyage."),
    Bullet("Logs applicatifs : pas de PII en clair, masquage automatique des champs sensibles."),

    H1("5. Sécurité des sauvegardes"),
    Bullet("Sauvegarde automatique quotidienne, conservation 30 jours sur scaleway."),
    Bullet("Sauvegarde hebdomadaire dans une zone géographique distincte (résilience régionale)."),
    Bullet("Sauvegarde mensuelle long terme (12 mois) — chiffrement AES-256 avec clés rotatives."),
    Bullet("Tests de restauration mensuels documentés (vérification d'intégrité)."),
    Bullet("RPO (Recovery Point Objective) : ≤ 24 h."),
    Bullet("RTO (Recovery Time Objective) : ≤ 4 h pour la plateforme principale."),

    H1("6. Sécurité des postes de travail"),
    Bullet("Chiffrement intégral du disque (BitLocker / FileVault)."),
    Bullet("Antivirus / EDR à jour, géré centralement."),
    Bullet("Mises à jour système automatiques activées."),
    Bullet("VPN obligatoire pour accès aux ressources internes hors locaux Eventy."),
    Bullet("Verrouillage automatique de session ≤ 5 min d'inactivité."),
    Bullet("Aucune installation de logiciel non approuvé — politique BYOD limitée."),

    H1("7. Surveillance et détection"),
    Bullet("Logs centralisés (SIEM léger en An 1, full SIEM en An 3) : authentifications, accès admin, modifications de configuration."),
    Bullet("Conservation des logs : 12 mois minimum (article 6 RGPD - intérêt légitime)."),
    Bullet("Alertes en temps réel sur événements suspects (tentatives répétées, escalade de privilèges, exfiltration anormale)."),
    Bullet("Monitoring de disponibilité 24/7 avec astreinte technique."),
    Bullet("Veille sécurité quotidienne (CERT-FR, ANSSI, alertes éditeurs)."),

    H1("8. Tests et audits"),
    makeTable({
      widths: [3120, 3120, 3120],
      header: ["Type de test", "Périodicité", "Réalisé par"],
      rows: [
        ["Pentest applicatif boîte noire", "Annuel", "Cabinet externe certifié PASSI"],
        ["Pentest applicatif boîte grise", "Bisannuel (An 2+)", "Cabinet externe"],
        ["Audit de configuration cloud", "Annuel", "Cabinet externe ou outil"],
        ["Scan de vulnérabilités automatique", "Hebdomadaire", "Outil interne (Snyk, Trivy)"],
        ["Audit RGPD (avec DPO)", "Annuel", "DPO externe + Président"],
        ["Test de restauration des sauvegardes", "Mensuel", "Équipe technique"],
        ["Phishing test interne", "Trimestriel", "Cabinet externe ou outil"],
        ["Audit ISO 27001 (cible An 3)", "Annuel à partir d'An 3", "Cabinet certifié"],
      ],
    }),

    H1("9. Gestion des incidents de sécurité"),

    H2("9.1. Niveaux de gravité"),
    Bullet("Niveau 1 — mineur : tentative bloquée, sans impact (alerte à journaliser)."),
    Bullet("Niveau 2 — modéré : compromission limitée d'un compte non-admin, exfiltration de données non sensibles."),
    Bullet("Niveau 3 — majeur : compromission d'un compte admin, exfiltration de données voyageurs."),
    Bullet("Niveau 4 — critique : prise de contrôle de la plateforme, ransomware, fuite massive."),

    H2("9.2. Procédure de réponse"),
    Numbered("Détection — alerte automatique ou signalement (24/7 par astreinte technique)."),
    Numbered("Évaluation initiale (≤ 30 min) — niveau de gravité, périmètre."),
    Numbered("Confinement — isolation des systèmes compromis, révocation des accès."),
    Numbered("Investigation — analyse forensique, identification de la cause racine."),
    Numbered("Notification CNIL si violation de données (sous 72 h — article 33 RGPD)."),
    Numbered("Notification des personnes concernées si risque élevé (article 34 RGPD)."),
    Numbered("Remédiation — correctifs, durcissement, changement des secrets."),
    Numbered("Retour d'expérience documenté et partagé avec l'équipe."),

    H1("10. Continuité d'activité (cyber)"),
    Bullet("Plan de continuité d'activité — voir document dédié (Eventy-Life-Plan-Continuite-Activite.pdf)."),
    Bullet("Architecture multi-AZ pour la production."),
    Bullet("Procédure de bascule documentée et testée."),
    Bullet("Communication de crise — voir Procédure de gestion de crise communication."),

    H1("11. Sensibilisation et formation"),
    Bullet("Sensibilisation de l'équipe lors de l'onboarding (1h obligatoire)."),
    Bullet("Module de rappel annuel obligatoire (30 min)."),
    Bullet("Phishing test trimestriel avec restitution individuelle."),
    Bullet("Newsletter sécurité mensuelle interne (5 min de lecture)."),
    Bullet("Référent sécurité interne identifié (CISO de fait — Président actuellement, à recruter en An 2)."),

    H1("12. Engagements chiffrés"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur sécurité", "Cible An 1", "Cible An 3"],
      rows: [
        ["Disponibilité plateforme (uptime)", "≥ 99,5 %", "≥ 99,9 %"],
        ["RPO (perte de données acceptable)", "≤ 24 h", "≤ 1 h"],
        ["RTO (temps de reprise)", "≤ 4 h", "≤ 1 h"],
        ["Couverture MFA équipe", "100 %", "100 %"],
        ["Couverture pentest annuel", "1×/an", "2×/an"],
        ["Délai notification CNIL", "≤ 72 h", "≤ 24 h"],
        ["Couverture tests automatisés", "≥ 70 %", "≥ 85 %"],
        ["Phishing test taux d'erreur", "≤ 15 %", "≤ 5 %"],
        ["Incidents N3 ou N4", "0", "0"],
        ["Certification ISO 27001", "—", "Lancée"],
      ],
    }),

    H1("13. Gouvernance sécurité"),
    Bullet("Comité sécurité trimestriel (Président + référent sécurité + DPO)."),
    Bullet("Tableau de bord sécurité mensuel (incidents, vulnérabilités, indicateurs cibles)."),
    Bullet("Reporting annuel aux associés et investisseurs (assemblée générale)."),
    Bullet("Mise à jour de la présente politique : annuelle minimum, ou après incident majeur."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 1er mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique RGPD, DPA Sous-traitance RGPD, Plan de continuité d'activité, Procédure gestion de crise communication, Politique cookies.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 2 — PROCÉDURE DE GESTION DE CRISE COMMUNICATION
// ============================================================
function procedureCriseCommunication() {
  return [
    bandeauTitre(
      "PROCÉDURE DE GESTION DE CRISE COMMUNICATION",
      "Réponse coordonnée aux situations de crise corporate Eventy Life",
    ),
    Spacer(160),

    P("La présente procédure formalise la gestion de la communication d'EVENTY LIFE SAS en situation de crise. Elle s'applique à toute crise susceptible d'affecter la réputation, la confiance des voyageurs, la relation avec les partenaires ou la continuité d'activité.", { italics: true }),

    P("Elle complète et se distingue : (1) du Manuel d'incident voyage qui couvre les crises opérationnelles d'un voyage en cours ; (2) du Plan de continuité d'activité qui couvre la résilience opérationnelle ; (3) de la Procédure de signalement qui couvre les alertes éthiques. La présente procédure se concentre sur la dimension communicationnelle.", { italics: true }),

    H1("1. Typologie des crises communication"),

    H2("1.1. Crises opérationnelles à dimension communicationnelle"),
    Bullet("Incident grave sur un voyage (accident, décès) — communication post-incident voyage."),
    Bullet("Annulation collective de voyages (force majeure, défaillance fournisseur)."),
    Bullet("Hospitalisations multiples ou intoxication alimentaire imputables à un partenaire."),

    H2("1.2. Crises de réputation"),
    Bullet("Avis négatifs viraux (Trustpilot, réseaux sociaux)."),
    Bullet("Article de presse défavorable, enquête journalistique."),
    Bullet("Polémique liée à un ambassadeur, créateur ou collaborateur."),
    Bullet("Boycott ou campagne hostile organisée."),

    H2("1.3. Crises légales et éthiques"),
    Bullet("Mise en cause judiciaire (responsabilité Eventy ou d'un partenaire)."),
    Bullet("Sanction administrative (CNIL, DGCCRF, Atout France, APST)."),
    Bullet("Signalement de lanceur d'alerte rendu public."),
    Bullet("Allégation de discrimination, harcèlement, ou manquement éthique."),

    H2("1.4. Crises cyber et données"),
    Bullet("Fuite ou exfiltration de données voyageurs."),
    Bullet("Indisponibilité prolongée de la plateforme."),
    Bullet("Compromission des moyens de paiement."),
    Bullet("Ransomware ou attaque ciblée."),

    H2("1.5. Crises financières et stratégiques"),
    Bullet("Difficultés de trésorerie publiques."),
    Bullet("Échec d'une levée de fonds rendue publique."),
    Bullet("Perte de la garantie financière APST ou de l'IM Atout France."),
    Bullet("Départ inattendu d'un dirigeant ou associé clé."),

    H1("2. Cellule de crise communication"),

    H2("2.1. Composition (5 rôles)"),
    Bullet("Pilote de crise — Président David Eventy (décisionnaire)."),
    Bullet("Porte-parole officiel — Président par défaut, ou personne désignée selon nature."),
    Bullet("Conseil juridique — avocat tourisme partenaire (joignable 24/7 en cas de crise majeure)."),
    Bullet("Conseil RP / communication — agence ou consultant (à activer dès crise modérée)."),
    Bullet("Référent technique (si crise cyber) — référent sécurité interne ou prestataire."),

    H2("2.2. Délai d'activation"),
    Bullet("Crise critique (niveau 4) : activation immédiate (≤ 1 h)."),
    Bullet("Crise majeure (niveau 3) : activation sous 4 h."),
    Bullet("Crise modérée (niveau 2) : activation sous 24 h."),
    Bullet("Crise mineure (niveau 1) : traitement standard, sans cellule formelle."),

    H1("3. Niveaux de gravité"),
    makeTable({
      widths: [1872, 3744, 3744],
      header: ["Niveau", "Caractéristiques", "Réponse"],
      rows: [
        ["Niveau 1\nMineur", "Avis négatif isolé · question polémique modérée · article presse non viral", "Réponse standard sous 48 h · Procédure avis voyageurs"],
        ["Niveau 2\nModéré", "Buzz négatif limité · article presse à faible portée · plainte voyageur médiatisée", "Activation cellule (24 h) · communication réactive · suivi 7 j"],
        ["Niveau 3\nMajeur", "Crise virale · article presse à grande audience · sanction admin · litige collectif", "Activation cellule (4 h) · communication proactive · porte-parole formé · suivi quotidien"],
        ["Niveau 4\nCritique", "Décès · accident grave · fuite massive · faillite partenaire majeur · crise judiciaire pénale", "Activation immédiate · conseil juridique mobilisé · communication coordonnée · cellule en mode H24"],
      ],
    }),

    H1("4. Principes de communication de crise"),

    H2("4.1. Principes fondamentaux"),
    Bullet("Vérité — ne jamais mentir, ne jamais minimiser un fait avéré."),
    Bullet("Rapidité — communiquer tôt vaut mieux que tard."),
    Bullet("Empathie — placer les personnes affectées avant les chiffres."),
    Bullet("Cohérence — un seul message, un seul porte-parole."),
    Bullet("Transparence proportionnée — dire ce qu'on sait, ce qu'on ne sait pas, ce qu'on fait."),
    Bullet("Responsabilité — assumer ce qui relève d'Eventy, sans accuser à tort des tiers."),

    H2("4.2. Ce qu'il ne faut JAMAIS faire"),
    Bullet("Mentir, dissimuler, ou produire de faux documents."),
    Bullet("Communiquer avant validation juridique sur les sujets sensibles."),
    Bullet("Pointer du doigt un voyageur, un partenaire ou un collaborateur publiquement."),
    Bullet("Ignorer ou supprimer les avis négatifs (sauf injures ou propos discriminatoires)."),
    Bullet("Faire de l'humour, de l'ironie ou du second degré pendant la crise."),
    Bullet("Communiquer sans coordonner avec les éventuelles autorités saisies."),

    H1("5. Procédure pas-à-pas"),

    H2("5.1. Étape 1 — Détection et alerte (T0)"),
    Bullet("Sources de détection : monitoring réseaux sociaux, appel client, courrier presse, alerte juridique, alerte sécurité, signalement interne."),
    Bullet("Alerte immédiate au Président via canal dédié (téléphone direct + email avec mention « URGENCE CRISE »)."),
    Bullet("Documentation initiale : faits connus, sources, captures, horodatages."),

    H2("5.2. Étape 2 — Évaluation et qualification (T0 → T+2 h)"),
    Bullet("Caractérisation des faits avec les éléments disponibles."),
    Bullet("Détermination du niveau de gravité (cf. tableau)."),
    Bullet("Décision d'activation de la cellule de crise et de son périmètre."),
    Bullet("Établissement d'une chronologie partagée."),

    H2("5.3. Étape 3 — Vérification et investigation (T+2 h → T+24 h)"),
    Bullet("Recoupement des sources, vérification des faits."),
    Bullet("Sollicitation des partenaires concernés (HRA, transporteur, accompagnateur)."),
    Bullet("Consultation conseil juridique (toujours obligatoire en N3 et N4)."),
    Bullet("Préparation des éléments de langage internes et externes."),

    H2("5.4. Étape 4 — Communication interne (avant externe)"),
    Bullet("Information de l'équipe interne avec les éléments factuels et la posture officielle."),
    Bullet("Information des partenaires concernés (créateurs, vendeurs, ambassadeurs) avec ligne de conduite."),
    Bullet("Cadrage : qui parle, qui ne parle pas, vers quelle ressource rediriger les questions."),

    H2("5.5. Étape 5 — Communication externe"),
    Bullet("Voyageurs concernés : communication directe individualisée (téléphone + email)."),
    Bullet("Voyageurs non concernés (mais inquiets) : communication groupée, FAQ dédiée."),
    Bullet("Presse : communiqué officiel signé du Président, contact presse dédié."),
    Bullet("Réseaux sociaux : message épinglé, modération renforcée, désactivation des publicités si crise réputationnelle."),
    Bullet("Site web : bannière information ou page dédiée selon ampleur."),
    Bullet("Autorités : reporting Atout France, APST, CNIL, autres selon nature."),

    H2("5.6. Étape 6 — Suivi et ajustement (T+24 h → T+30 j)"),
    Bullet("Veille intensifiée (réseaux sociaux, presse, plateformes d'avis)."),
    Bullet("Mises à jour régulières si la situation évolue."),
    Bullet("Réponse personnalisée aux interlocuteurs clés."),
    Bullet("Bilan d'étape interne quotidien la première semaine, puis hebdomadaire."),

    H2("5.7. Étape 7 — Sortie de crise"),
    Bullet("Évaluation des dommages réputationnels et opérationnels."),
    Bullet("Identification des actions correctrices structurelles."),
    Bullet("Communication finale (selon ampleur) : engagement de progrès, mesures prises."),
    Bullet("Retour d'expérience interne formel (post-mortem, REX)."),
    Bullet("Mise à jour de la présente procédure si besoin."),

    H1("6. Modèles de communication"),

    H2("6.1. Communiqué de presse type (structure)"),
    Bullet("Titre factuel et clair (sans euphémisme)."),
    Bullet("Date, lieu, identité de l'émetteur."),
    Bullet("Faits connus à ce stade (au plus juste)."),
    Bullet("Empathie / pensées pour les personnes affectées."),
    Bullet("Mesures prises et mesures à venir."),
    Bullet("Engagement à informer en continu."),
    Bullet("Contact presse (nom, email, téléphone direct)."),

    H2("6.2. Email voyageur affecté (structure)"),
    Bullet("Salutation personnalisée."),
    Bullet("Reconnaissance des faits, sans euphémisme."),
    Bullet("Excuse sincère le cas échéant (validée par avocat)."),
    Bullet("Mesures concrètes proposées (remboursement, soutien, indemnisation)."),
    Bullet("Contact direct (téléphone, email)."),
    Bullet("Signature du Président."),

    H2("6.3. Post réseaux sociaux (structure)"),
    Bullet("Reconnaissance brève et factuelle."),
    Bullet("Lien vers communiqué officiel ou page dédiée."),
    Bullet("Pas de débat dans les commentaires (rediriger vers le canal officiel)."),
    Bullet("Modération active des contenus discriminatoires ou injurieux."),

    H1("7. Coordination avec les autorités"),

    H2("7.1. Atout France"),
    Bullet("Reporting obligatoire dans les 48 h pour tout incident grave (article L211-18 et suivants)."),
    Bullet("Format : courrier officiel + email d'alerte préalable."),

    H2("7.2. APST"),
    Bullet("Alerte immédiate en cas d'incident susceptible d'affecter la garantie financière."),
    Bullet("Reporting des annulations collectives sous 7 jours."),

    H2("7.3. CNIL"),
    Bullet("Notification sous 72 h en cas de violation de données (article 33 RGPD)."),
    Bullet("Information des personnes concernées si risque élevé (article 34)."),

    H2("7.4. Autorités judiciaires"),
    Bullet("Saisine du procureur en cas de crime ou délit grave."),
    Bullet("Coopération pleine et entière, sous coordination de l'avocat."),

    H1("8. Documentation et archivage"),
    Bullet("Tout incident de niveau 2 ou supérieur fait l'objet d'un dossier formalisé."),
    Bullet("Conservation : 5 ans minimum (10 ans pour incidents critiques avec contentieux)."),
    Bullet("Accès restreint : Président + conseil juridique + DPO si données personnelles."),
    Bullet("Inclus : chronologie, communications externes, décisions internes, documents officiels, post-mortem."),

    H1("9. Tests et exercices"),
    Bullet("Exercice de crise communication annuel obligatoire (scénario simulé)."),
    Bullet("Formation porte-parole annuelle (média training de base)."),
    Bullet("Mise à jour annuelle de la liste de contacts (presse, autorités, conseils)."),
    Bullet("Revue annuelle de la présente procédure."),

    Spacer(160),
    P("Document de référence interne — Version 1.0 — 1er mai 2026. Confidentiel.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Manuel d'incident voyage, Plan de continuité d'activité, Politique cybersécurité, Politique avis voyageurs, Procédure de signalement, Politique RSE.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — POLITIQUE DE GESTION DES CONFLITS D'INTÉRÊTS
// ============================================================
function politiqueConflitsInterets() {
  return [
    bandeauTitre(
      "POLITIQUE DE GESTION DES CONFLITS D'INTÉRÊTS",
      "Prévention et traitement des situations à risque éthique chez Eventy Life",
    ),
    Spacer(160),

    P("La présente politique formalise les règles applicables au sein d'EVENTY LIFE SAS en matière de prévention, de déclaration et de traitement des conflits d'intérêts. Elle vise à garantir l'objectivité des décisions, l'équité de traitement entre voyageurs et partenaires, et la confiance des parties prenantes.", { italics: true }),

    P("Cette politique s'inscrit en cohérence avec les autres engagements éthiques d'Eventy : politique anti-corruption (esprit Sapin 2), procédure de signalement (loi Waserman), politique RSE (pilier gouvernance), code de conduite ambassadeurs.", { italics: true }),

    H1("1. Définitions"),

    H2("1.1. Conflit d'intérêts"),
    P("Un conflit d'intérêts existe lorsqu'une personne intervenant pour Eventy (collaborateur, partenaire, créateur, vendeur, ambassadeur, dirigeant) se trouve dans une situation où ses intérêts personnels, financiers, familiaux ou professionnels sont susceptibles d'influencer ou peuvent paraître influencer ses décisions ou actions au nom d'Eventy."),

    H2("1.2. Trois formes principales"),
    Bullet("Conflit réel — la personne se trouve effectivement dans une situation où ses intérêts entrent en conflit avec ceux d'Eventy."),
    Bullet("Conflit apparent — la situation, sans être avérée, peut raisonnablement laisser penser à un tiers que les intérêts entrent en conflit."),
    Bullet("Conflit potentiel — la situation pourrait évoluer vers un conflit réel."),

    H1("2. Champ d'application"),
    Bullet("Le Président David Eventy."),
    Bullet("Les éventuels autres dirigeants et associés."),
    Bullet("Les collaborateurs salariés et non salariés."),
    Bullet("Les partenaires créateurs, vendeurs, ambassadeurs (à signature contrat)."),
    Bullet("Les partenaires HRA et transporteurs."),
    Bullet("Les conseils externes (avocat, expert-comptable, DPO, agence marketing)."),

    H1("3. Situations typiques de conflit d'intérêts"),

    H2("3.1. Conflits liés à des intérêts financiers"),
    Bullet("Détention d'une participation significative dans une société partenaire (HRA, transporteur, prestataire technique)."),
    Bullet("Bénéfice direct ou indirect d'un avantage commercial offert à Eventy par un partenaire."),
    Bullet("Activité concurrente exercée en parallèle (autre opérateur de voyages, marketplace concurrente)."),
    Bullet("Honoraires perçus d'un tiers en lien avec une décision Eventy."),

    H2("3.2. Conflits liés à des relations personnelles"),
    Bullet("Lien familial avec un partenaire, prestataire ou candidat collaborateur."),
    Bullet("Relation amicale étroite avec un fournisseur en cours de négociation."),
    Bullet("Relation amoureuse avec un collaborateur subordonné, un partenaire ou un voyageur."),

    H2("3.3. Conflits liés à des engagements externes"),
    Bullet("Mandat d'élu local ou national pouvant interférer avec l'activité d'Eventy."),
    Bullet("Engagement associatif ou militant susceptible d'influencer une décision commerciale."),
    Bullet("Activité d'enseignement, conférence, ou conseil rémunéré chez un concurrent."),

    H2("3.4. Conflits spécifiques à l'écosystème Eventy"),
    Bullet("Un créateur qui serait également propriétaire d'un HRA partenaire d'un voyage qu'il opère."),
    Bullet("Un vendeur qui serait simultanément en contrat avec un opérateur de voyages concurrent."),
    Bullet("Un ambassadeur recevant des avantages d'un autre opérateur sans déclaration."),
    Bullet("Le Président ayant une participation dans un fournisseur stratégique sans information préalable des associés."),

    H1("4. Engagements et règles"),

    H2("4.1. Devoir de transparence"),
    Bullet("Toute personne soumise à la présente politique déclare proactivement les situations susceptibles de constituer un conflit d'intérêts (réel, apparent ou potentiel)."),
    Bullet("La déclaration est faite par écrit, datée, conservée dans un registre dédié."),
    Bullet("La déclaration est mise à jour annuellement et à chaque changement significatif."),

    H2("4.2. Devoir d'abstention"),
    Bullet("La personne en situation de conflit d'intérêts s'abstient de participer à la décision concernée."),
    Bullet("Elle ne tente pas d'influencer directement ou indirectement les autres décideurs."),
    Bullet("Elle ne consulte pas et ne traite pas les informations confidentielles relatives à l'objet du conflit."),

    H2("4.3. Devoir de loyauté"),
    Bullet("Les intérêts d'Eventy priment systématiquement sur les intérêts personnels lorsqu'il y a divergence."),
    Bullet("Toute opportunité d'affaires identifiée dans le cadre Eventy est proposée d'abord à Eventy."),
    Bullet("Les ressources d'Eventy ne sont pas utilisées pour des intérêts personnels."),

    H1("5. Règles spécifiques par catégorie"),

    H2("5.1. Pour le Président et dirigeants"),
    Bullet("Déclaration annuelle de patrimoine professionnel et de toutes participations significatives."),
    Bullet("Information préalable des associés en cas d'opération entre la Société et une entité dirigée par le Président (article L227-10 — convention réglementée)."),
    Bullet("Abstention de vote en assemblée sur les sujets le concernant directement."),
    Bullet("Le pacte d'associés peut prévoir des restrictions complémentaires (non-concurrence, exclusivité)."),

    H2("5.2. Pour les collaborateurs"),
    Bullet("Déclaration à l'embauche des activités externes en cours."),
    Bullet("Demande d'autorisation pour toute nouvelle activité rémunérée externe."),
    Bullet("Information sur les liens familiaux avec partenaires ou candidats à un poste."),

    H2("5.3. Pour les créateurs, vendeurs, ambassadeurs"),
    Bullet("Déclaration des partenariats commerciaux avec d'autres opérateurs de voyages."),
    Bullet("Interdiction de représenter simultanément un concurrent direct (sauf accord exprès écrit)."),
    Bullet("Déclaration des liens capitalistiques ou familiaux avec un HRA ou prestataire."),

    H2("5.4. Pour les partenaires HRA et transporteurs"),
    Bullet("Déclaration des liens éventuels avec des collaborateurs ou dirigeants d'Eventy."),
    Bullet("Refus de toute pratique tendant à influencer une décision (cadeaux, invitations excessives)."),

    H2("5.5. Pour les conseils externes"),
    Bullet("Déclaration des autres mandats susceptibles de générer un conflit (ex : avocat conseil d'un concurrent)."),
    Bullet("Engagement de confidentialité strict (NDA inclus dans le contrat)."),

    H1("6. Procédure de déclaration et de traitement"),

    H2("6.1. Canal de déclaration"),
    Bullet("Email confidentiel : conformite@eventylife.fr (réception centralisée)."),
    Bullet("Possibilité d'utiliser le canal de signalement (alerte@eventylife.fr) si situation grave et urgente."),
    Bullet("Pour les associés et dirigeants : déclaration auprès de l'assemblée des associés ou comité de gouvernance."),

    H2("6.2. Étape 1 — Réception et accusé"),
    Bullet("Accusé de réception sous 7 jours ouvrés."),
    Bullet("Confidentialité stricte des informations transmises."),

    H2("6.3. Étape 2 — Analyse"),
    Bullet("Examen par le Président (ou par l'avocat tourisme partenaire si conflit impliquant le Président)."),
    Bullet("Caractérisation : réel / apparent / potentiel."),
    Bullet("Sollicitation de l'éventuelle convention réglementée si nécessaire (article L227-10)."),

    H2("6.4. Étape 3 — Décision"),
    Bullet("Mesure d'abstention partielle ou totale (déport)."),
    Bullet("Mesure d'aménagement (séparation des dossiers, transparence renforcée)."),
    Bullet("Mesure d'exclusion (résiliation contrat partenaire si conflit grave et irrémédiable)."),
    Bullet("Documentation écrite de la décision et notification au déclarant."),

    H2("6.5. Étape 4 — Suivi"),
    Bullet("Inscription au registre des conflits d'intérêts (centralisé, accès restreint)."),
    Bullet("Revue trimestrielle des situations actives."),
    Bullet("Réévaluation annuelle ou en cas de changement significatif."),

    H1("7. Cadeaux, invitations et avantages"),

    H2("7.1. Règles applicables"),
    Bullet("Cadeaux d'usage acceptés ≤ 30 € — déclaration au-delà."),
    Bullet("Cadeaux > 30 € : refus poli ou déclaration au registre, transmission au pot commun équipe à l'occasion."),
    Bullet("Cadeaux > 100 € (ou récurrents) : refus systématique, sauf situation de courtoisie diplomatique avec validation préalable."),
    Bullet("Invitations à des événements professionnels : acceptées si finalité d'information / formation, refusées si finalité d'influence."),
    Bullet("Hospitalités (hébergement, restaurants) : payés par Eventy par défaut."),

    H2("7.2. Refus systématique"),
    Bullet("Espèces, chèques, virements bancaires sous quelque forme que ce soit."),
    Bullet("Cartes-cadeaux ou avantages négociables."),
    Bullet("Avantages personnels gratuits durables (location, prêts, services)."),

    H1("8. Sanctions"),

    H2("8.1. Sanctions internes"),
    Bullet("Avertissement écrit en cas de manquement mineur (oubli de déclaration sans impact réel)."),
    Bullet("Mise à pied disciplinaire en cas de manquement modéré (déclaration tardive avec impact limité)."),
    Bullet("Licenciement pour faute grave en cas de manquement caractérisé (dissimulation, profit personnel)."),

    H2("8.2. Sanctions externes (partenaires)"),
    Bullet("Avertissement écrit en cas de manquement mineur."),
    Bullet("Suspension de la relation commerciale en cas de manquement modéré."),
    Bullet("Résiliation immédiate sans indemnité en cas de manquement grave."),

    H2("8.3. Sanctions pénales et civiles"),
    Bullet("Action en justice en cas de fraude ou abus de bien social."),
    Bullet("Demande de dommages et intérêts en cas de préjudice avéré."),
    Bullet("Signalement aux autorités (procureur, AFA) si infraction pénale."),

    H1("9. Indicateurs et reporting"),
    makeTable({
      widths: [4680, 2340, 2340],
      header: ["Indicateur", "Cible An 1", "Cible An 3"],
      rows: [
        ["Taux de déclaration annuelle (équipe)", "100 %", "100 %"],
        ["Taux de déclaration partenaires actifs", "≥ 80 %", "≥ 95 %"],
        ["Conflits identifiés et traités", "100 %", "100 %"],
        ["Délai moyen de traitement", "≤ 14 j", "≤ 7 j"],
        ["Sanctions prononcées", "Reporting annuel transparent", "Reporting annuel transparent"],
        ["Formation conflits d'intérêts annuelle", "100 %", "100 %"],
      ],
    }),

    H1("10. Sensibilisation et formation"),
    Bullet("Module dédié dans l'onboarding équipe (15 min) avec cas pratiques."),
    Bullet("Rappel annuel obligatoire avec déclaration actualisée."),
    Bullet("Cas pratiques discutés en comité gouvernance trimestriel."),
    Bullet("Communication de la présente politique aux partenaires lors de la signature du contrat (annexe)."),

    Spacer(160),
    P("Document de référence — Version 1.0 — 1er mai 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Cohérence avec : Politique anti-corruption, Procédure de signalement, Politique RSE (gouvernance), Code conduite ambassadeurs, Pacte d'associés, Statuts SAS.", { italics: true, color: COLOR.gray, size: 18 }),
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
      file: "docs/garanties/Eventy-Life-Politique-Cybersecurite.docx",
      title: "Eventy Life — Politique de cybersécurité",
      description: "Politique de cybersécurité et sécurité des SI Eventy Life.",
      footer: "EVENTY LIFE SAS — Politique cybersécurité · Confidentielle",
      children: politiqueCybersecurite(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Crise-Communication.docx",
      title: "Eventy Life — Procédure de gestion de crise communication",
      description: "Procédure de gestion de crise communication corporate.",
      footer: "EVENTY LIFE SAS — Procédure crise communication · Confidentielle",
      children: procedureCriseCommunication(),
    },
    {
      file: "docs/garanties/Eventy-Life-Politique-Conflits-Interets.docx",
      title: "Eventy Life — Politique de gestion des conflits d'intérêts",
      description: "Politique de prévention et gestion des conflits d'intérêts.",
      footer: "EVENTY LIFE SAS — Politique conflits d'intérêts",
      children: politiqueConflitsInterets(),
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
