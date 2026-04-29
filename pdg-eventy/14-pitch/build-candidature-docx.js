/**
 * build-candidature-docx.js
 * Génère le .docx de la candidature incubateur Eventy Life
 * à partir de CANDIDATURE-INCUBATEUR.md (vision PDG validée 2026-04-29).
 *
 * Usage: node build-candidature-docx.js
 *
 * Sortie: Eventy-Life-Candidature-Incubateur-COMPLET.docx
 */

const fs = require('fs');
const path = require('path');

// Charge docx depuis npm global
const NPM_GLOBAL = process.env.NPM_GLOBAL_ROOT || 'C:/Users/paco6/AppData/Roaming/npm/node_modules';
const docxPath = path.join(NPM_GLOBAL, 'docx');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageBreak, TabStopType, TabStopPosition,
  PageOrientation,
} = require(docxPath);

// ───────────────────────────────────────────────────────────────────────────
// Couleurs et constantes de mise en forme
// ───────────────────────────────────────────────────────────────────────────
const COLORS = {
  gold: 'B8860B',
  goldLight: 'F4E4B8',
  navy: '0F2A44',
  charcoal: '2A2A2A',
  grey: '666666',
  lightGrey: 'CCCCCC',
  bgHeader: '0F2A44',
  bgRowAlt: 'F7F2E5',
  white: 'FFFFFF',
};

const border = { style: BorderStyle.SINGLE, size: 4, color: COLORS.lightGrey };
const cellBorders = { top: border, bottom: border, left: border, right: border };

// A4: 11906 x 16838 DXA, marges 1440 (1 inch) → contenu = 11906 - 2880 = 9026
const PAGE_WIDTH_DXA = 9026;

// ───────────────────────────────────────────────────────────────────────────
// Helpers de paragraphes
// ───────────────────────────────────────────────────────────────────────────
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 280 },
    ...opts,
    children: [new TextRun({ text, font: 'Calibri', size: 22, ...opts.run })],
  });
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: 'Calibri', size: 36, bold: true, color: COLORS.navy })],
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, font: 'Calibri', size: 28, bold: true, color: COLORS.gold })],
  });
}

function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: 'Calibri', size: 24, bold: true, color: COLORS.navy })],
  });
}

function Quote(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    indent: { left: 360 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.gold, space: 8 },
    },
    children: [new TextRun({ text, font: 'Calibri', size: 22, italics: true, color: COLORS.charcoal })],
  });
}

function Bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function Numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function PB() {
  return new Paragraph({ children: [new PageBreak()] });
}

function HR() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.gold, space: 1 } },
    children: [new TextRun({ text: '' })],
  });
}

// Inline runs supporting **bold** and `code` lightweight parsing
function inlineRuns(text, baseOpts = {}) {
  const runs = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), font: 'Calibri', size: 22, ...baseOpts }));
    }
    if (m[1]) {
      runs.push(new TextRun({ text: m[1], font: 'Calibri', size: 22, bold: true, ...baseOpts }));
    } else if (m[2]) {
      runs.push(new TextRun({ text: m[2], font: 'Consolas', size: 20, color: COLORS.gold, ...baseOpts }));
    }
    last = re.lastIndex;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), font: 'Calibri', size: 22, ...baseOpts }));
  }
  return runs.length ? runs : [new TextRun({ text, font: 'Calibri', size: 22, ...baseOpts })];
}

function P_rich(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 280 },
    ...opts,
    children: inlineRuns(text),
  });
}

function Bullet_rich(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 40, after: 40 },
    children: inlineRuns(text),
  });
}

function Numbered_rich(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { before: 40, after: 40 },
    children: inlineRuns(text),
  });
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers tables
// ───────────────────────────────────────────────────────────────────────────
function table(rows, columnWidths) {
  return new Table({
    width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
    columnWidths,
    rows: rows.map((row, idx) =>
      new TableRow({
        tableHeader: idx === 0,
        children: row.map((cell, cIdx) => {
          const isHeader = idx === 0;
          const fill = isHeader
            ? COLORS.bgHeader
            : idx % 2 === 0
              ? COLORS.bgRowAlt
              : COLORS.white;
          return new TableCell({
            borders: cellBorders,
            width: { size: columnWidths[cIdx], type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: inlineRuns(String(cell), isHeader ? { bold: true, color: COLORS.white } : {}),
              }),
            ],
          });
        }),
      })
    ),
  });
}

// Distribute widths evenly summing to PAGE_WIDTH_DXA
function evenWidths(n) {
  const base = Math.floor(PAGE_WIDTH_DXA / n);
  const widths = Array(n).fill(base);
  widths[n - 1] = PAGE_WIDTH_DXA - base * (n - 1);
  return widths;
}

// ───────────────────────────────────────────────────────────────────────────
// Construction du document
// ───────────────────────────────────────────────────────────────────────────
const children = [];

// ─── Page de garde ─────────────────────────────────────────────────────────
children.push(
  new Paragraph({
    spacing: { before: 1200, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'EVENTY LIFE', font: 'Calibri', size: 64, bold: true, color: COLORS.navy })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Le voyage de groupe où tu n’as rien à gérer, tout à vivre.', font: 'Calibri', size: 28, italics: true, color: COLORS.gold })],
  }),
  HR(),
  new Paragraph({
    spacing: { before: 600, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Dossier de candidature', font: 'Calibri', size: 40, bold: true, color: COLORS.charcoal })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 800 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Incubateurs et accélérateurs français', font: 'Calibri', size: 32, color: COLORS.charcoal })],
  }),
  new Paragraph({
    spacing: { before: 200, after: 80 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'France Tourisme Tech · Welcome City Lab · Open Tourisme Lab', font: 'Calibri', size: 24, color: COLORS.navy })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 400 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Provence Travel Innovation · Station F · WILCO', font: 'Calibri', size: 24, color: COLORS.navy })],
  }),
  new Paragraph({
    spacing: { before: 800, after: 60 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Version 1.0 — refonte profonde validée PDG', font: 'Calibri', size: 22, color: COLORS.grey })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 60 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Date : 2026-04-29', font: 'Calibri', size: 22, color: COLORS.grey })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 60 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'David, Fondateur & PDG · eventylife@gmail.com · www.eventylife.fr', font: 'Calibri', size: 22, color: COLORS.grey })],
  }),
  PB(),
);

// ─── Sommaire (manuel) ────────────────────────────────────────────────────
children.push(H1('Sommaire'));
const toc = [
  '1. Pitch en 60 secondes',
  '2. Le problème qu’on résout',
  '3. La solution Eventy Life',
  '4. L’âme et la promesse',
  '5. Marché et opportunité',
  '6. Modèle économique : le voyage est le cœur',
  '7. La force commerciale : 5 % qui change tout',
  '8. Activités, gamification et énergie : les compléments',
  '9. Plateforme technologique',
  '10. Traction et trajectoire de croissance',
  '11. Équipe et gouvernance',
  '12. Conformité et différenciation réglementaire',
  '13. Besoins de financement',
  '14. Pourquoi un incubateur, pourquoi maintenant',
  '15. Annexes et preuves',
];
toc.forEach((item) => children.push(P(item)));
children.push(PB());

// ─── 1. Pitch ─────────────────────────────────────────────────────────────
children.push(H1('1. Pitch en 60 secondes'));
children.push(P_rich('**Eventy Life est la plateforme française qui réinvente le voyage de groupe** en alignant trois forces : une technologie SaaS complète (1,18 million de lignes de code, 32 portails, 31 modules backend, 3 300+ tests automatisés), une armée de créateurs indépendants qui conçoivent ET vendent leurs voyages, et une promesse simple : « le voyage de groupe où tu n’as rien à gérer, tout à vivre ».'));
children.push(P_rich('**Le voyage est le cœur du moteur.** Chaque rentrée d’argent — réservation, activité complémentaire, carte d’énergie, ambassadeur, influenceur — converge vers le chiffre d’affaires voyage. La gamification et les activités sont des compléments, activables ou non, qui viennent enrichir l’expérience sans jamais détourner la valeur.'));
children.push(P_rich('**La marge globale est volontairement contenue à 7 %** : 5 % redistribués à la force commerciale (créateurs, ambassadeurs, influenceurs), 2 % nets pour Eventy. Le résultat : une force de vente quasi gratuite à coût marginal nul, un client qui paie le prix juste, et une scalabilité européenne (BE / LUX / IT / ES dès l’année 2).'));
children.push(P_rich('**Les volumes sont concrets et validés PDG** : 10 voyages/semaine au T1 (304 K€ de CA brut hebdomadaire), 50 voyages/semaine au T4 (1,52 M€/sem, soit ~6,1 M€/mois), 200 voyages/semaine en année 2 sur l’Europe (~24 M€/mois de CA brut). Avec un panier moyen de 800 € et un bus type rempli à 38 voyageurs, **chaque voyage génère 30 400 € de CA brut**.'));
children.push(P_rich('Nous candidatons aux meilleurs incubateurs et accélérateurs français pour franchir trois étapes en 12 mois : sécuriser la conformité (SAS, Atout France, APST, RC Pro), passer de 10 à 50 voyages par semaine, et préparer une Série A de 500 K€ à 1 M€ en année 2.'));

// ─── 2. Problème ──────────────────────────────────────────────────────────
children.push(H1('2. Le problème qu’on résout'));
children.push(H2('2.1 Le voyage de groupe est cassé en France'));
children.push(table(
  [
    ['Constat', 'Réalité du marché', 'Conséquence client'],
    ['Bus à moitié vide', 'Agences classiques partent à 15-25 personnes sur des cars de 50', 'Prix gonflé de 40-60 %'],
    ['Devis lent', '48-72 h par e-mail, devis figé', 'Le groupe se décourage, le projet meurt'],
    ['Cagnotte centralisée', 'Une personne avance pour tout le monde', 'Tensions, abandons, retards de paiement'],
    ['Assurance optionnelle', '50-80 € par voyageur, complexe', 'Le client renonce, voyage non couvert'],
    ['Indépendants invisibles', 'Guides, animateurs, accompagnateurs traités comme des prestataires', 'Pas de valorisation, pas de fidélisation'],
    ['Aucun outil unifié', 'Excel + WhatsApp + e-mails', 'Le créateur passe plus de temps à gérer qu’à créer'],
  ],
  [2200, 3700, 3126]
));
children.push(H2('2.2 Les indépendants du tourisme cherchent une plateforme'));
children.push(P('Il existe en France des milliers de guides, animateurs, accompagnateurs, photographes, restaurateurs et hôteliers qui rêvent de vivre du voyage sans rentrer dans une structure corporate. Aucune plateforme ne leur permet aujourd’hui de :'));
children.push(Bullet('Créer un voyage en quelques clics et le mettre en vente le jour même.'));
children.push(Bullet('Récupérer une rémunération transparente, validée à l’avance.'));
children.push(Bullet('Bénéficier d’une garantie financière, d’une assurance et d’un cadre juridique conformes.'));
children.push(Bullet('Constituer leur propre clientèle tout en restant indépendants.'));
children.push(Quote('Eventy Life est cette plateforme.'));

// ─── 3. Solution ──────────────────────────────────────────────────────────
children.push(H1('3. La solution Eventy Life'));
children.push(H2('3.1 Le concept en une phrase'));
children.push(Quote('Une marketplace SaaS où des créateurs indépendants conçoivent et vendent des voyages de groupe, sur une infrastructure conforme Atout France, avec une force commerciale distribuée et une promesse client unique : zéro stress, prix juste, accompagnement humain de bout en bout.'));
children.push(H2('3.2 Les trois piliers'));
children.push(Numbered_rich('**Plateforme technologique** : 32 portails métiers (Admin, Pro/Créateur, Client, Équipe, Public, Maisons HRA, Jeux, Ambassadeur, 18 portails métiers spécialisés). Réservation 100 % digitale, paiement fractionné, gestion logistique automatisée.'));
children.push(Numbered_rich('**Réseau de créateurs indépendants** : auto-entrepreneurs, micro-entrepreneurs, passionnés. Ils créent les voyages, les vendent, accompagnent les groupes. Eventy Life ne salarie quasi personne — la valeur est partagée.'));
children.push(Numbered_rich('**Couverture réglementaire complète** : immatriculation Atout France, garantie financière APST, RC Pro, conformité RGPD, CGV Code du Tourisme, médiation MTV, TVA sur la marge.'));
children.push(H2('3.3 Ce qu’on livre au client final'));
children.push(Bullet('Réservation en ligne en moins de 3 minutes.'));
children.push(Bullet('Paiement fractionné : chaque voyageur paie sa part directement.'));
children.push(Bullet_rich('Pack Sérénité **inclus** (annulation toutes causes, rapatriement, bagages, RC, frais médicaux étranger).'));
children.push(Bullet('Un accompagnateur humain du ramassage en bus au retour à la maison.'));
children.push(Bullet('Un dashboard temps réel pour le créateur ET pour le groupe.'));
children.push(Bullet('Un seuil de départ minimal — on part même si le bus n’est pas complet, parce qu’un bon voyage à 38 vaut mieux que pas de voyage du tout.'));

// ─── 4. Âme ───────────────────────────────────────────────────────────────
children.push(H1('4. L’âme et la promesse'));
children.push(Quote('Le client doit se sentir aimé. Pas « satisfait », pas « bien servi ». Aimé.'));
children.push(P('Eventy Life n’est pas né d’une étude de marché ni d’un incubateur. Le projet est né d’un homme qui aime voyager, qui aime entreprendre, qui aime l’Homme au sens large.'));
children.push(P('Cela se traduit dans nos décisions :'));
children.push(Bullet_rich('**Indépendants = partenaires**, pas prestataires. Leurs visages, leurs prénoms, leurs histoires sont mis en avant sur le site.'));
children.push(Bullet_rich('**Marge honnête** : 7 % au total, dont 2 % nets pour Eventy. On ne marge pas pour s’enrichir vite, on marge pour vivre durablement.'));
children.push(Bullet_rich('**Pas de petites lignes** : le prix affiché est le prix payé. Pack Sérénité inclus. Pas de supplément caché.'));
children.push(Bullet_rich('**Seuil minimal** : on ne laisse pas un voyageur enthousiaste sur le carreau parce qu’il manque cinq places.'));
children.push(Bullet_rich('**Chaleur dans la voix, sérieux dans le fond** : ton direct, tutoiement quand c’est naturel, conformité totale derrière.'));
children.push(P_rich('Cette âme — documentée dans le fichier `AME-EVENTY.md`, lecture obligatoire pour tout collaborateur ou partenaire — est notre principal différenciateur défensif. Elle ne se copie pas.'));

// ─── 5. Marché ────────────────────────────────────────────────────────────
children.push(H1('5. Marché et opportunité'));
children.push(H2('5.1 Le marché français du voyage de groupe'));
children.push(Bullet_rich('**Marché total** : ~8 milliards €/an (FNTV, Atout France).'));
children.push(Bullet_rich('**Croissance** : +12 % par an post-COVID sur le segment groupe.'));
children.push(Bullet_rich('**Cible primaire** : groupes d’amis 25-45 ans, familles, associations, comités d’entreprise.'));
children.push(Bullet_rich('**Cible B2B** : 73 % des entreprises externalisent l’organisation de leurs séminaires.'));
children.push(Bullet_rich('**Marché autocar** : 450 000+ véhicules en France, demande en forte hausse, taux de remplissage moyen ~55 %.'));
children.push(H2('5.2 L’opportunité européenne (Année 2)'));
children.push(Bullet('Belgique, Luxembourg, Italie, Espagne : marchés à portée de bus, frontaliers, francophones ou hispanophones.'));
children.push(Bullet('Réglementation européenne harmonisée (Directive UE 2015/2302 sur les voyages à forfait).'));
children.push(Bullet('Réseau d’autocaristes et d’hôteliers déjà connus depuis la France.'));
children.push(Bullet('Objectif : 200 voyages/semaine en cumul européen à fin année 2.'));
children.push(H2('5.3 Pourquoi maintenant'));
children.push(Numbered('La digitalisation du tourisme accuse un retard que les acteurs historiques ne comblent pas.'));
children.push(Numbered('La génération 25-40 ans veut payer en ligne, individuellement, sans cagnotte.'));
children.push(Numbered('Les indépendants du tourisme cherchent activement une plateforme qui les valorise.'));
children.push(Numbered_rich('Le programme **France Tourisme Tech** entre dans sa 3ᵉ édition 2025-2026 — fenêtre idéale pour candidater.'));
children.push(Numbered('Atout France a lancé l’AMI Innovation Touristique avec des subventions jusqu’à 100 000 € par startup.'));

// ─── 6. Modèle économique ─────────────────────────────────────────────────
children.push(H1('6. Modèle économique : le voyage est le cœur'));
children.push(H2('6.1 Principe directeur (validé PDG, 2026-04-29)'));
children.push(Quote('Le voyage est le centre de toutes les rentrées d’argent. Les activités viennent en complément du voyage. La gamification vient en complément (toggle ON/OFF, désactivable). Tout rentre par le voyage. L’énergie cotisée repart en chiffre d’affaires voyage automatiquement.'));
children.push(H2('6.2 Sur quoi on marge — et sur quoi on ne marge pas'));
children.push(table(
  [
    ['Source de revenu', 'Marge Eventy ?', 'Justification'],
    ['Voyage (transport, hébergement, accompagnement)', '✅ Oui — 7 % total', 'Cœur de l’activité'],
    ['Activité complémentaire (excursion, atelier, restaurant)', '✅ Oui — 7 % total', 'Vendue via la fiche voyage'],
    ['Pack Sérénité (assurance incluse)', '✅ Oui — marge prestataire', 'Inclus dans le prix voyage'],
    ['Cartes à gratter', '❌ Non — 0 %', 'Outil de fidélisation, pas de marge directe'],
    ['Cartes d’énergie', '❌ Non — 0 %', 'L’énergie revient automatiquement en CA voyage'],
    ['Boutique cosmétique de fidélisation', '❌ Non — 0 %', 'Effet d’attraction, pas de marge'],
  ],
  [3500, 2500, 3026]
));
children.push(P_rich('**Conséquence stratégique** : les ventes de cartes, énergie, boutique alimentent l’engagement et **se répercutent automatiquement en ventes de voyages et d’activités** — où la marge réelle est captée. Le modèle est volontairement contre-intuitif pour ne pas distraire la valeur.'));
children.push(H2('6.3 Décomposition de la marge — 7 % / 5 % / 2 %'));
children.push(table(
  [
    ['Bloc', 'Part', 'Bénéficiaire', 'Rôle'],
    ['Force commerciale', '5 %', 'Créateurs, ambassadeurs, influenceurs', 'Marketing distribué, conversion terrain'],
    ['Marge nette Eventy', '2 %', 'Plateforme', 'Fonctionnement, R&D, infra, conformité'],
    ['Marge totale', '7 %', '—', 'Reste compétitif vs agences traditionnelles (15-30 %)'],
  ],
  [2400, 1200, 2500, 2926]
));
children.push(P_rich('Cette structure est validée par le **modèle 82/18** appliqué côté indépendants : 82 % de la marge restent à Eventy (force commerciale + plateforme), 18 % reviennent en brut indépendant — uniquement sur la marge, pas sur le coût total du voyage.'));
children.push(H2('6.4 Exemple unitaire — Voyage type (1 bus de 50 places, 38 voyageurs cible, panier 800 €)'));
children.push(table(
  [
    ['Poste', 'CA TTC', 'Détail'],
    ['Hébergement', '11 400 €', '300 €/voyageur'],
    ['Transport autocar', '5 320 €', '140 €/voyageur'],
    ['Activités incluses', '5 700 €', '150 €/voyageur'],
    ['Restauration', '6 080 €', '160 €/voyageur'],
    ['Pack Sérénité', '1 900 €', '50 €/voyageur'],
    ['CA brut voyage', '30 400 €', '800 €/voyageur'],
    ['Marge totale 7 %', '2 128 €', 'dont 5 % vendeurs (1 520 €) + 2 % Eventy net (608 €)'],
  ],
  [2800, 2200, 4026]
));
children.push(Quote('Panier moyen 800 € validé PDG (2026-04-29). Le voyageur paie en ligne sa quote-part directement, sans cagnotte centralisée.'));
children.push(H2('6.5 BFR favorable'));
children.push(Bullet('Acompte 30 % à la réservation (J-45).'));
children.push(Bullet('Solde 70 % à J-30 avant départ.'));
children.push(Bullet('Stripe verse les fonds J+2 (CB) / J+5 (SEPA).'));
children.push(Bullet('Les prestataires sont payés J+30 après le séjour.'));
children.push(Bullet_rich('**Trésorerie naturellement positive** : le client paie avant les fournisseurs.'));

// ─── 7. Force commerciale ─────────────────────────────────────────────────
children.push(H1('7. La force commerciale : 5 % qui change tout'));
children.push(H2('7.1 Le levier stratégique'));
children.push(Quote('Les créateurs et indépendants sont la PUISSANCE MARKETING d’Eventy Life. Ils créent ET vendent leurs voyages. C’est notre force commerciale en place — sans coût fixe, sans CDI, sans plafond.'));
children.push(H2('7.2 Comment ça marche'));
children.push(Numbered_rich('**Le créateur conçoit son voyage** sur le portail Pro (Madagascar, Vosges, Algarve, Andalousie…).'));
children.push(Numbered_rich('**Il fixe son prix**, ses dates, ses prestataires (la plateforme propose des autocaristes, hôtels, activités préselectionnés).'));
children.push(Numbered_rich('**Eventy Life publie le voyage** sur le portail public et le portail client.'));
children.push(Numbered_rich('**Le créateur active son réseau** : famille, amis, communauté Instagram, base e-mail.'));
children.push(Numbered_rich('**Chaque vente déclenche une commission** redistribuée selon la chaîne : créateur principal + ambassadeur si applicable + influenceur si applicable.'));
children.push(Numbered_rich('**Eventy Life encaisse, sécurise, accompagne, livre.**'));
children.push(H2('7.3 Trois rôles dans la force commerciale'));
children.push(table(
  [
    ['Rôle', 'Mission', 'Rémunération typique'],
    ['Créateur', 'Concevoir et vendre le voyage', 'Part principale du 5 % + 18 % brut sur la marge selon modèle 82/18'],
    ['Ambassadeur', 'Représenter Eventy localement, recruter des voyageurs', 'Part du 5 % sur ses ventes confirmées'],
    ['Influenceur', 'Apporter du trafic et des conversions via codes promo', 'Part du 5 % sur les conversions tracées'],
  ],
  [1800, 3500, 3726]
));
children.push(H2('7.4 Pourquoi c’est puissant'));
children.push(Bullet_rich('**Coût d’acquisition client (CAC) ≈ 0 €** sur la part organique apportée par le créateur.'));
children.push(Bullet_rich('**Effet réseau** : chaque créateur recruté apporte sa base de contacts.'));
children.push(Bullet_rich('**Pas de masse salariale** : la force commerciale est rémunérée à la performance.'));
children.push(Bullet_rich('**Motivation alignée** : un créateur gagne quand il vend, donc il vend.'));
children.push(Bullet_rich('**Fidélité plateforme** : un créateur formé sur Eventy Life ne va pas chez la concurrence (qui n’a pas l’outillage).'));
children.push(H2('7.5 Investisseurs : ce que ça signifie'));
children.push(P_rich('Au lieu d’investir dans une équipe commerciale salariée (250 K€-500 K€/an pour 3 commerciaux + manager), Eventy Life investit dans la **plateforme outillée** qui transforme chaque créateur en commercial. À 200 voyages/semaine en année 2, la force commerciale équivalente coûterait à un acteur classique 3 à 5 millions d’euros — Eventy Life la rémunère exclusivement à la performance, sans charge fixe.'));

// ─── 8. Activités, gamification ───────────────────────────────────────────
children.push(H1('8. Activités, gamification et énergie : les compléments'));
children.push(H2('8.1 Hiérarchie claire'));
children.push(P('VOYAGE (cœur du business) — 100 % du CA remonte ici.'));
children.push(P('▼ Au-dessous : Activités (complément) · Gamification (toggle ON/OFF) · Boutique (fidélisation).'));
children.push(P('Tout converge vers le voyage.'));
children.push(H2('8.2 Activités'));
children.push(Bullet('Vendues sur la fiche voyage en upsell (excursion privée, atelier artisanal, expérience gastronomique).'));
children.push(Bullet('Marge appliquée selon le même modèle 7 % (5 % vendeurs / 2 % Eventy).'));
children.push(Bullet('Augmentent le panier moyen de 15-25 %.'));
children.push(H2('8.3 Gamification — désactivable'));
children.push(Bullet('Système d’énergie, raids, mondes, héros, Hall of Legends.'));
children.push(Bullet_rich('**Toggle administrable** : un créateur peut désactiver toute la couche ludique pour les groupes B2B (séminaires d’entreprise, voyages premium).'));
children.push(Bullet_rich('**Aucune marge directe** sur les cartes à gratter, l’énergie ou la boutique cosmétique.'));
children.push(Bullet_rich('**L’énergie cotisée est convertie automatiquement en réduction sur le prochain voyage** — ce qui ramène 100 % de la valeur sur le CA voyage.'));
children.push(H2('8.4 Pourquoi cette architecture rassure les investisseurs'));
children.push(Numbered_rich('**Le cœur (voyage) ne dépend pas de la gamification.** Si demain on coupe la gamification, le business tourne.'));
children.push(Numbered_rich('**La gamification booste la rétention sans cannibaliser la marge.**'));
children.push(Numbered_rich('**Les voyages B2B premium peuvent être livrés en mode 100 % corporate**, sans aucune couche jeu visible.'));
children.push(Numbered_rich('**L’effet flywheel est mesurable** : chaque euro investi dans la gamification se traduit en euros de CA voyage additionnel via la conversion énergie → réduction → réservation.'));

// ─── 9. Plateforme technologique ──────────────────────────────────────────
children.push(H1('9. Plateforme technologique'));
children.push(H2('9.1 Volumétrie réelle (audit du 24/04/2026)'));
children.push(table(
  [
    ['Indicateur', 'Valeur', 'Note'],
    ['Lignes de code totales', '~1 184 000', 'Frontend ~876 K, Backend ~308 K'],
    ['Pages frontend (page.tsx)', '1 118', '32 portails distincts'],
    ['Modules backend NestJS', '31', 'Admin, Auth, Bookings, Checkout, Email, Finance, Groups, HRA, Insurance, Legal, Marketing, Payments, Pro, Public, Reviews, Rooming, SEO, Support, Transport, Travels, Users, etc.'],
    ['Tests automatisés', '3 300+', 'Suite passante'],
    ['Fichiers TypeScript', '4 493 (frontend) + 905 (backend)', 'Stack robuste'],
    ['Hébergement', 'Scaleway (Paris)', 'Infrastructure souveraine'],
  ],
  [2600, 2600, 3826]
));
children.push(H2('9.2 Les 32 portails'));
children.push(table(
  [
    ['Portail', 'Pages', 'Mission'],
    ['Admin', '275', 'Pilotage finance, voyages, monitoring, gamification, RBAC, sécurité'],
    ['Pro / Créateur', '211', 'Dashboard créateur, voyages, marketing, finance, transport, CRM'],
    ['Client / Voyageur', '126', 'Réservations, groupes, gamification, wallet'],
    ['Équipe / Pôles', '98', '14 cockpits internes'],
    ['Public', '63', 'SEO, marketing, catalogue, blog'],
    ['Maisons HRA', '33', 'Hôtels, restaurants, activités partenaires'],
    ['Jeux', '26', 'Gamification avancée'],
    ['Ambassadeur', '23', 'Revendeurs réseau'],
    ['18 portails métiers', '4-19 chacun', 'Accompagnateur, animateur, assureur, avocat, chauffeur, comptable, coordinateur, créateur, décorateur, fleuriste, guide, indépendant, influenceur, photographe, restaurateur, traiteur, transporteur, voyageur'],
    ['Auth / Checkout / Demo', '9 + 9 + 4', 'Tunnels d’entrée'],
    ['Total', '1 118', '32 portails distincts'],
  ],
  [2400, 1300, 5326]
));
children.push(H2('9.3 Stack et choix techniques'));
children.push(Bullet_rich('**Frontend** : Next.js 14 (App Router), React Server Components, Tailwind CSS, shadcn/ui.'));
children.push(Bullet_rich('**Backend** : NestJS 10, Prisma, PostgreSQL.'));
children.push(Bullet_rich('**Paiements** : Stripe (split payment, fonds disponibles J+2).'));
children.push(Bullet_rich('**Hébergement** : Scaleway (Paris) — souveraineté française.'));
children.push(Bullet_rich('**Apps complémentaires** : PWA Admin, PWA Pro (compagnes du frontend principal).'));
children.push(H2('9.4 Barrière à l’entrée'));
children.push(P_rich('Reproduire cette plateforme par un acteur externe coûterait, au prix marché agence web, **1,2 à 1,8 million d’euros** (à 1-1,5 €/ligne de code maintenue, normes 2025). Eventy Life a été développée intégralement par le fondateur — ce qui explique un budget de lancement contenu à 30-50 K€ malgré la profondeur fonctionnelle.'));

// ─── 10. Traction et trajectoire ──────────────────────────────────────────
children.push(H1('10. Traction et trajectoire de croissance'));
children.push(H2('10.1 Hypothèse opérationnelle (validée PDG)'));
children.push(Bullet_rich('**Bus de référence** : 50 places.'));
children.push(Bullet_rich('**Cible voyageurs/voyage** : 38 (seuil minimal de départ ≥ rentabilité).'));
children.push(Bullet_rich('**Modèle d’activité** : marketplace SaaS — créateurs indépendants, pas d’employés fixes.'));
children.push(H2('10.2 Trajectoire trimestre par trimestre — Année 1'));
children.push(Quote('Hypothèse de référence (validée PDG 2026-04-29) : 38 voyageurs par voyage × 800 € de panier moyen = 30 400 € de CA brut par voyage.'));
children.push(table(
  [
    ['Période', 'Voyages/sem', 'Voyageurs/sem', 'CA brut/sem', 'CA brut mensuel', 'Marge totale 7 % /mois', 'Marge nette Eventy 2 % /mois'],
    ['T1', '10', '380', '304 K€', '~1,2 M€', '~85 K€', '~34 K€'],
    ['T2', '15', '570', '456 K€', '~1,8 M€', '~127 K€', '~52 K€'],
    ['T3', '25', '950', '760 K€', '~3,0 M€', '~213 K€', '~85 K€'],
    ['T4', '50', '1 900', '1,52 M€', '~6,1 M€', '~426 K€', '~170 K€'],
  ],
  [900, 1100, 1300, 1300, 1500, 1500, 1426]
));
children.push(H2('10.3 Trajectoire Année 2 — expansion européenne'));
children.push(table(
  [
    ['Marché', 'Voyages/sem cible', 'Statut'],
    ['France', '50', 'Acquis Y1'],
    ['Belgique', '30', 'Lancement T1 Y2'],
    ['Luxembourg', '10', 'Lancement T1 Y2'],
    ['Italie', '50', 'Lancement T2 Y2'],
    ['Espagne', '60', 'Lancement T3 Y2'],
    ['Total Y2 (cumul Europe)', '200 voy/sem', '~7 600 voyageurs/sem'],
  ],
  [3000, 3000, 3026]
));
children.push(H2('10.4 Lecture financière à pleine charge'));
children.push(table(
  [
    ['Indicateur clé', 'Valeur PDG validée'],
    ['CA brut hebdo An2', '~6 M€/sem'],
    ['CA brut mensuel An2', '~24 M€/mois'],
    ['Marge totale An2 (7 %)', '~1,68 M€/mois'],
    ['Marge nette Eventy An2 (2 %)', '~680 K€/mois'],
    ['Force commerciale rémunérée An2 (5 %)', '~1,2 M€/mois redistribués'],
  ],
  [4500, 4526]
));
children.push(P_rich('**Interprétation investisseur** : à 200 voyages/semaine en année 2, Eventy Life capture **~8,2 M€ de marge nette annuelle** tout en redistribuant **~14,4 M€ par an** à sa force commerciale d’indépendants — sans masse salariale équivalente. Le modèle est volontairement contre-intuitif : on capte peu pour faire grandir vite, et la valorisation se construit sur le volume + la position de marché + l’actif technologique.'));
children.push(P_rich('**Précision méthode** : les chiffres ci-dessus représentent la capacité opérationnelle nominale validée PDG. Les plans financiers détaillés (`pdg-eventy/02-finance/BUDGET-PREVISIONNEL.md`) modulent ces volumes par un taux de remplissage prudent (60-75 % en montée en charge).'));

// ─── 11. Équipe ───────────────────────────────────────────────────────────
children.push(H1('11. Équipe et gouvernance'));
children.push(H2('11.1 Le fondateur'));
children.push(P_rich('**David** — Fondateur & PDG'));
children.push(Bullet('Profil : développeur full-stack (Next.js, NestJS, Prisma, PostgreSQL) + entrepreneur passionné de voyage.'));
children.push(Bullet('A développé l’intégralité de la plateforme (1,18 M lignes, 32 portails, 31 modules backend, 3 300+ tests).'));
children.push(Bullet('Investit 30 000 € en numéraire dans la SAS au lancement.'));
children.push(Bullet('Apport en industrie valorisé entre 1,2 M€ et 1,8 M€ (coût de développement équivalent).'));
children.push(H2('11.2 Recrutements prioritaires (à activer via Cofondateur.fr et incubateur)'));
children.push(table(
  [
    ['Rôle', 'Profil cible', 'Timing', 'Mode'],
    ['Co-fondateur Business / CMO', 'Tourisme, growth, B2B/B2C', 'T2 2026', 'Pacte associés'],
    ['Responsable Conformité Tourisme', 'Atout France, APST, droit du tourisme', 'T2 2026', 'Indépendant ou temps partiel'],
    ['Lead Customer Success', 'Tourisme + service client haut de gamme', 'T3 2026', 'CDI + parts'],
    ['Data / Growth', 'Acquisition, attribution, gamification analytics', 'T3-T4 2026', 'Indépendant puis CDI'],
  ],
  [2500, 3000, 1500, 2026]
));
children.push(H2('11.3 Le réseau de partenaires opérationnels'));
children.push(Bullet_rich('**Avocat tourisme** : à sélectionner via incubateur (CHECKLIST-AVOCAT.md ouverte).'));
children.push(Bullet_rich('**Expert-comptable** : Chevalier Conseil — devis demandé.'));
children.push(Bullet_rich('**Garantie financière** : APST.'));
children.push(Bullet_rich('**Assurance RC Pro** : devis Hiscox / Orus / Coover en cours.'));
children.push(Bullet_rich('**Hébergement cloud** : Scaleway (souveraineté FR).'));
children.push(H2('11.4 Modèle organisationnel : marketplace, pas employeur'));
children.push(Quote('Eventy Life n’est pas une agence de voyages classique avec 50 salariés. C’est une plateforme SaaS qui orchestre des indépendants. À 200 voyages/semaine en année 2, l’effectif salarié direct restera entre 8 et 15 personnes (admin, support, finance, tech, conformité). Le reste — créateurs, ambassadeurs, accompagnateurs, guides, animateurs, photographes — est indépendant.'));

// ─── 12. Conformité ───────────────────────────────────────────────────────
children.push(H1('12. Conformité et différenciation réglementaire'));
children.push(H2('12.1 Statut réglementaire visé'));
children.push(table(
  [
    ['Obligation', 'Statut actuel', 'Échéance'],
    ['SAS Eventy Life immatriculée', 'En préparation (statuts en validation avocat)', 'T2 2026'],
    ['Immatriculation Atout France', 'Dossier en préparation, pré-requis Kbis + APST + RC Pro', 'T2-T3 2026'],
    ['Garantie financière APST', 'Échange engagé', 'T2 2026'],
    ['RC Professionnelle', 'Devis Hiscox / Orus / Coover', 'T2 2026'],
    ['CGV Code du Tourisme', 'Template rédigé, validation avocat', 'T2 2026'],
    ['Conformité RGPD', 'Implémentée — module DSAR backend opérationnel', '✅'],
    ['Médiation MTV', 'Adhésion prévue au lancement', 'T2 2026'],
    ['TVA sur la marge', 'Régime identifié (art. 266-1-b CGI)', 'À cadrer avec expert-comptable'],
  ],
  [2800, 4500, 1726]
));
children.push(H2('12.2 Pourquoi c’est un actif stratégique'));
children.push(P('L’immatriculation Atout France + garantie APST + RC Pro constituent une barrière à l’entrée pour tout pure-player tech qui voudrait nous copier sans passer par 6 à 12 mois de mise en conformité.'));
children.push(H2('12.3 Données : souveraineté française'));
children.push(Bullet('Hébergement Scaleway, datacenters Paris.'));
children.push(Bullet('Données utilisateurs jamais hors UE.'));
children.push(Bullet('Module DSAR fonctionnel (export, suppression, portabilité).'));
children.push(Bullet('Cookies conformes RGPD/CNIL.'));

// ─── 13. Financement ──────────────────────────────────────────────────────
children.push(H1('13. Besoins de financement'));
children.push(H2('13.1 Phase 1 — Seed (T2 2026)'));
children.push(P_rich('**Cible** : 150 K€ – 300 K€'));
children.push(P_rich('**Vecteurs** :'));
children.push(Bullet('Apport personnel fondateur : 30 K€ (déjà engagé).'));
children.push(Bullet('Subventions et prêts non-dilutifs : BPI France (prêt innovation), WILCO (€0 intérêt jusqu’à 120 K€), Atout France AMI Innovation (jusqu’à 100 K€).'));
children.push(Bullet('France Tourisme Tech (programme DGE) : open innovation, mentoring, accès investisseurs.'));
children.push(Bullet('Business angels via incubateurs (Welcome City Lab, Open Tourisme Lab).'));
children.push(P_rich('**Allocation** :'));
children.push(table(
  [
    ['Poste', 'Montant', 'Justification'],
    ['Conformité (SAS, Atout France, APST, RC Pro, avocat)', '15 K€', 'Bloquant légal'],
    ['Marketing acquisition T1-T4 (Google Ads + influenceurs)', '60 K€', 'Accélération créateurs'],
    ['Recrutement co-fondateur Business + responsable conformité', '80 K€', 'Bande de roulement 12 mois'],
    ['Trésorerie de sécurité', '30 K€', '6 mois de charges fixes'],
    ['Frais infra et tooling (Stripe, Scaleway, monitoring)', '15 K€', 'Fonctionnement'],
    ['Total max', '300 K€', '—'],
  ],
  [4500, 1500, 3026]
));
children.push(H2('13.2 Phase 2 — Série A (Année 2)'));
children.push(P_rich('**Cible** : 500 K€ – 1 M€'));
children.push(P_rich('**Usage** : ouverture Belgique, Luxembourg, Italie, Espagne. Recrutement Country Managers, déploiement multi-langues, marketing local, partenariats autocaristes européens.'));
children.push(H2('13.3 Pourquoi c’est dimensionné juste'));
children.push(Bullet('L’investissement tech est déjà fait (équivalent 1,2-1,8 M€).'));
children.push(Bullet('La force commerciale est rémunérée à la performance (pas de masse salariale).'));
children.push(Bullet('L’infra Scaleway scale linéairement à coût marginal faible.'));
children.push(Bullet('Le BFR est positif (clients paient avant fournisseurs).'));

// ─── 14. Pourquoi un incubateur ───────────────────────────────────────────
children.push(H1('14. Pourquoi un incubateur, pourquoi maintenant'));
children.push(H2('14.1 Ce que nous apportons à un incubateur'));
children.push(Bullet_rich('Une **plateforme déjà bâtie** (1,18 M lignes, 32 portails, 3 300 tests passants) — pas un projet papier.'));
children.push(Bullet_rich('Une **vision claire et documentée** : âme, modèle économique 7/5/2, hiérarchie voyage > activités > gamification.'));
children.push(Bullet_rich('Un **fondateur engagé financièrement et techniquement**.'));
children.push(Bullet_rich('Un **secteur stratégique** pour la France : tourisme, souveraineté numérique, indépendants.'));
children.push(Bullet_rich('Un **modèle de marketplace réplicable à l’échelle européenne**.'));
children.push(H2('14.2 Ce que nous attendons d’un incubateur'));
children.push(table(
  [
    ['Apport', 'Programme cible', 'Impact attendu'],
    ['Mise en relation investisseurs', 'France Tourisme Tech, Welcome City Lab, Station F', '5-10 meetings VC/angels en T3-T4 2026'],
    ['Mentoring expert tourisme', 'Welcome City Lab, Open Tourisme Lab', 'Affinage stratégie B2B et international'],
    ['Accès commande publique', 'France Tourisme Tech (DGE)', 'Référencement régions, CE, collectivités'],
    ['Coopération européenne', 'France Tourisme Tech', 'Préparation expansion BE / LUX / IT / ES'],
    ['Crédibilité institutionnelle', 'Atout France AMI, BPI France', 'Facilitation Atout France + financements'],
    ['Réseau créateurs', 'Open Tourisme Lab (réseau ESCAET)', 'Recrutement créateurs qualifiés'],
  ],
  [2800, 3500, 2726]
));
children.push(H2('14.3 Calendrier de candidatures'));
children.push(Bullet_rich('**T1 2026** : préparation pitch deck, vidéo démo, profil Cofondateur.fr.'));
children.push(Bullet_rich('**T2 2026** : candidatures Welcome City Lab + Open Tourisme Lab + France Tourisme Tech.'));
children.push(Bullet_rich('**T3 2026** : démarrage programme retenu, candidatures financement (WILCO, BPI).'));
children.push(Bullet_rich('**T4 2026** : pitch investisseurs, préparation tour de table seed.'));

// ─── 15. Annexes ──────────────────────────────────────────────────────────
children.push(H1('15. Annexes et preuves'));
children.push(H2('15.1 Documents de référence (dans le repo pdg-eventy/)'));
children.push(table(
  [
    ['Document', 'Localisation', 'Contenu'],
    ['Âme Eventy', 'AME-EVENTY.md', 'Document fondateur — pourquoi Eventy existe'],
    ['Pitch banque', 'pdg-eventy/14-pitch/PITCH-BANQUE.md', 'Dossier détaillé compte pro & financement'],
    ['Roadmap incubateurs', 'pdg-eventy/05-partenaires/ROADMAP-INCUBATEURS-2026.md', 'Plan d’actions incubateurs trimestre par trimestre'],
    ['Cartographie incubateurs', 'pdg-eventy/05-partenaires/INCUBATEURS-ACCELERATEURS-COFONDATEURS.md', 'Recherche complète écosystème français'],
    ['Stratégie partenaires', 'pdg-eventy/05-partenaires/STRATEGIE-PARTENAIRES.md', 'Approche commerciale partenaires'],
    ['Plan de lancement', 'pdg-eventy/07-marketing-commercial/PLAN-LANCEMENT.md', 'KPIs lancement et acquisition'],
    ['Budget prévisionnel', 'pdg-eventy/02-finance/BUDGET-PREVISIONNEL.md', '3 scénarios financiers'],
    ['Conformité légale', 'AUDIT-CONFORMITE-LEGALE.md', 'Audit conformité Code du Tourisme'],
    ['Architecture technique', 'frontend/ARCHITECTURE_OVERVIEW.md + backend/ARCHITECTURE.md', 'Vue d’ensemble plateforme'],
  ],
  [2400, 3500, 3126]
));
children.push(H2('15.2 Preuves de traction et de qualité'));
children.push(Bullet('3 300+ tests automatisés passants (CI/CD).'));
children.push(Bullet('31 modules backend NestJS opérationnels.'));
children.push(Bullet('1 118 pages frontend déployables.'));
children.push(Bullet('Module DSAR RGPD fonctionnel.'));
children.push(Bullet_rich('Pack Sérénité documenté (`marketing/landing-pages/pack-serenite.html`).'));
children.push(Bullet_rich('Pitch deck HTML (`marketing/PITCH-DECK-EVENTY.html`).'));
children.push(H2('15.3 Demande de rendez-vous'));
children.push(Quote('David — Fondateur & PDG · eventylife@gmail.com · www.eventylife.fr · France'));
children.push(HR());
children.push(P('Document préparé par la cellule PDG d’Eventy Life. Refonte profonde en accord avec la vision PDG validée le 2026-04-29. Mise à jour permanente — version 1.0.'));

// ───────────────────────────────────────────────────────────────────────────
// Document
// ───────────────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: 'Eventy Life — David, Fondateur & PDG',
  title: 'Eventy Life — Candidature Incubateur',
  description: 'Dossier de candidature incubateur, refonte profonde validée PDG (2026-04-29).',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Calibri', color: COLORS.navy },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Calibri', color: COLORS.gold },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Calibri', color: COLORS.navy },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
      ] },
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    },
  ],
});

// ───────────────────────────────────────────────────────────────────────────
// Build
// ───────────────────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, 'Eventy-Life-Candidature-Incubateur-COMPLET.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`OK : ${outPath} (${sizeKb} Ko)`);
}).catch((err) => {
  console.error('Erreur génération docx :', err);
  process.exit(1);
});
