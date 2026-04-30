/**
 * Eventy Life — Trois documents complémentaires
 *
 *   1. Politique RSE Eventy Life (Responsabilité Sociétale d'Entreprise)
 *   2. FAQ voyageurs type pour eventylife.fr
 *   3. Procédure de réclamation voyageur détaillée — manuel support standalone
 *
 * Usage : node scripts/garanties/build-rse-faq-reclamation.js
 */

const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Footer,
  AlignmentType,
  LevelFormat,
  PageNumber,
  PageBreak,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  TabStopType,
  TabStopPosition,
} = require("docx");

const COLOR = {
  orange: "E87722",
  blue: "1F4E79",
  blueLt: "D5E8F0",
  cream: "FFF8EE",
  green: "2C5F2D",
  greenLt: "E5EDD9",
  gray: "555555",
  grayLt: "EEEEEE",
  black: "1A1A1A",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function H1(text) {
  return new Paragraph({
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR.blue, font: "Calibri" })],
  });
}
function H2(text) {
  return new Paragraph({
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: COLOR.orange, font: "Calibri" })],
  });
}
function H3(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 20, color: COLOR.blue, font: "Calibri" })],
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 100, line: 280 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text, size: opts.size || 20, font: "Calibri",
        color: opts.color || COLOR.black, bold: opts.bold, italics: opts.italics,
      }),
    ],
  });
}
function Bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
  });
}
function Numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
  });
}
function Spacer(after = 120) { return new Paragraph({ spacing: { after }, children: [new TextRun("")] }); }
function tCell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text, size: opts.size || 18, bold: opts.bold,
            color: opts.color || COLOR.black, font: "Calibri",
          }),
        ],
      }),
    ],
  });
}
function makeTable({ widths, header, rows }) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map((h, i) =>
      tCell(h, { width: widths[i], shade: COLOR.blue, color: "FFFFFF", bold: true, size: 19 }),
    ),
  });
  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((c, i) =>
        tCell(c, { width: widths[i], shade: ri % 2 === 0 ? COLOR.grayLt : undefined }),
      ),
    }),
  );
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}
function bandeauTitre(title, sous, color = COLOR.orange) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 18, color },
              left: { style: BorderStyle.SINGLE, size: 18, color },
              bottom: { style: BorderStyle.SINGLE, size: 18, color },
              right: { style: BorderStyle.SINGLE, size: 18, color },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: COLOR.cream, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: title, size: 28, bold: true, color, font: "Calibri" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: sous, size: 18, italics: true, color: COLOR.blue, font: "Calibri" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Encart({ title, lines, color = COLOR.orange, fill = COLOR.cream }) {
  const lineParas = lines.map((line, i) => new Paragraph({
    alignment: line.align || AlignmentType.JUSTIFIED,
    spacing: { after: i === lines.length - 1 ? 0 : 80 },
    children: [
      new TextRun({
        text: line.text,
        size: line.size || 20,
        bold: !!line.bold,
        italics: !!line.italics,
        color: line.color || COLOR.black,
        font: "Calibri",
      }),
    ],
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.DOUBLE, size: 18, color },
              left: { style: BorderStyle.DOUBLE, size: 18, color },
              bottom: { style: BorderStyle.DOUBLE, size: 18, color },
              right: { style: BorderStyle.DOUBLE, size: 18, color },
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 360, right: 360 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [new TextRun({ text: title, size: 24, bold: true, color, font: "Calibri" })],
              }),
              ...lineParas,
            ],
          }),
        ],
      }),
    ],
  });
}

// ============================================================
// DOCUMENT 1 — POLITIQUE RSE EVENTY LIFE
// ============================================================
function politiqueRSE() {
  return [
    bandeauTitre(
      "POLITIQUE RSE EVENTY LIFE",
      "Responsabilité Sociétale d'Entreprise — engagements et indicateurs",
      COLOR.green,
    ),
    Spacer(160),

    Encart({
      title: "L'ENGAGEMENT RSE EVENTY LIFE",
      color: COLOR.green,
      fill: COLOR.greenLt,
      lines: [
        { text: "« Faire tourner la valeur, plutôt que l'extraire. »", align: AlignmentType.CENTER, italics: true, bold: true, size: 24, color: COLOR.orange },
        { text: "Eventy Life intègre la Responsabilité Sociétale d'Entreprise au cœur de son modèle économique. Notre RSE n'est pas une politique ajoutée — elle est constitutive de notre architecture distribuée et de notre vision du voyage.", align: AlignmentType.JUSTIFIED, italics: true },
      ],
    }),
    Spacer(160),

    P("La présente politique RSE formalise les engagements d'EVENTY LIFE SAS au regard des trois piliers du développement durable (économique, social, environnemental) et des principes de gouvernance responsable. Elle est destinée à être communiquée aux investisseurs, partenaires institutionnels, organismes de subvention publique, voyageurs et collaborateurs."),

    H1("1. Cadre de référence"),
    Bullet("Norme ISO 26000 — lignes directrices relatives à la responsabilité sociétale."),
    Bullet("17 Objectifs de Développement Durable (ODD) de l'ONU à l'horizon 2030."),
    Bullet("Code du Tourisme — articles relatifs à l'éthique et à la durabilité du tourisme."),
    Bullet("Charte mondiale du tourisme durable (UNESCO, OMT, ICOMOS)."),
    Bullet("Pacte mondial des Nations Unies — 10 principes fondateurs."),

    H1("2. Pilier économique — un modèle distribué qui fait circuler la valeur"),

    H2("2.1. Architecture distribuée des marges"),
    P("Eventy Life pratique un modèle économique distribué qui redistribue mécaniquement, et avant toute charge interne, une part substantielle de son chiffre d'affaires aux indépendants français et aux acteurs de l'économie locale :"),
    Bullet("Vendeurs (5 % HT du CA voyage) : auto-entrepreneurs et micro-entreprises français."),
    Bullet("Créateurs (3 pts sur HRA refacturé) : auto-entrepreneurs et micro-entreprises français."),
    Bullet("Partenaires HRA français privilégiés au démarrage (hôtels, restaurants, activités)."),
    Bullet("Autocaristes français pour le transport routier groupe."),

    H2("2.2. Engagements chiffrés"),
    makeTable({
      widths: [4680, 4680],
      header: ["Engagement", "Cible An 1 / An 5"],
      rows: [
        ["Marge brute Eventy plafonnée", "11 % du CA voyage (max 12 %)"],
        ["Plancher de redistribution aux indépendants", "Minimum 6 % du CA voyage"],
        ["Marge sur cartes / énergie / gamification", "Zéro — strictement"],
        ["Délai maximum de versement aux indépendants", "21 jours après livraison"],
        ["Délai maximum de versement aux HRA", "30 jours fin de mois"],
        ["Réserve volontaire « risques tourisme »", "5 % du CA annuel"],
        ["Transparence prix au voyageur", "Décomposition publique sur fiche voyage"],
        ["Redistribution annuelle An 1", "≈ 1,1 M€ (6,8 % du CA An 1)"],
        ["Redistribution annuelle An 5", "≈ 21,8 M€ (6,8 % du CA An 5)"],
      ],
    }),

    H2("2.3. Économie circulaire territoriale"),
    P("Sur 100 € payés par un voyageur Eventy An 1, environ 88,9 € retournent à l'économie réelle française et européenne. Aucun euro ne transite par une plateforme extra-européenne. Cette circulation territoriale soutient :"),
    Bullet("L'emploi local (autocaristes, hôteliers, restaurateurs, guides)."),
    Bullet("Les indépendants français (créateurs, vendeurs, accompagnateurs)."),
    Bullet("Les communes (taxes de séjour) et collectivités locales."),
    Bullet("Les fournisseurs intermédiaires (assureurs, plateformes de paiement français)."),

    H1("3. Pilier social — humain avant tout"),

    H2("3.1. Voyageurs"),
    Bullet("Pack Sérénité INCLUS dans tous les voyages — protection maximale sans surcoût."),
    Bullet("Accompagnateur humain présent du premier au dernier kilomètre — porte-à-porte."),
    Bullet("Ligne d'urgence 24/7 disponible pendant la durée du voyage et 48 heures après le retour."),
    Bullet("Médiation MTV gratuite en cas de litige non résolu."),
    Bullet("Accessibilité PMR documentée et signalée pour chaque voyage (engagement de transparence)."),
    Bullet("Politique anti-discrimination : aucun voyageur n'est refusé au motif de son origine, religion, orientation sexuelle, handicap, situation familiale ou opinion politique."),

    H2("3.2. Indépendants partenaires"),
    Bullet("Liberté économique : aucune clause d'exclusivité par défaut, indépendance préservée."),
    Bullet("Rémunération transparente et payée dans les délais (21 à 30 jours)."),
    Bullet("Charte qualité opposable à Eventy autant qu'au partenaire."),
    Bullet("Formation initiale gratuite pour les créateurs."),
    Bullet("Soutien opérationnel via la plateforme et la ligne 24/7."),
    Bullet("Possibilité de cumul des rôles (créateur + vendeur, HRA + vendeur) — écosystème ouvert."),

    H2("3.3. Équipe interne"),
    Bullet("Politique de rémunération équitable (écart maximum 1-5 entre rémunération minimale et celle du dirigeant)."),
    Bullet("Engagement de plein temps du Fondateur — pas de cumul avec activité concurrente."),
    Bullet("Plan de formation continue (21 heures par an minimum pour le dirigeant)."),
    Bullet("Recrutement diversifié — pas de discrimination à l'embauche."),
    Bullet("Conditions de travail : télétravail possible, équilibre vie pro/perso respecté."),
    Bullet("Pas de prime variable indexée sur le volume des fonds clients en transit (éviter les incitatifs pervers)."),

    H1("4. Pilier environnemental"),

    H2("4.1. Engagements transport"),
    Bullet("Préférence donnée au transport groupé en autocar (≈ 4× moins de CO₂ par voyageur que l'avion sur trajets équivalents)."),
    Bullet("Charter aérien A320 utilisé uniquement pour les destinations longues (> 2 000 km) où le bus n'est pas pertinent."),
    Bullet("Train SNCF privilégié pour les destinations françaises éloignées (Côte d'Azur, Pyrénées)."),
    Bullet("Optimisation des taux de remplissage (cible 38/53 places) pour réduire l'empreinte par voyageur."),
    Bullet("Calcul et communication transparente de l'empreinte CO₂ par voyageur sur chaque fiche voyage (cible An 2)."),

    H2("4.2. Engagements hébergement et restauration"),
    Bullet("Privilège donné aux hôtels et restaurants engagés dans une démarche éco-responsable."),
    Bullet("Critères d'éligibilité au référencement HRA incluant des questions environnementales (gestion des déchets, énergies renouvelables, circuit court)."),
    Bullet("Restaurateurs partenaires invités à proposer des produits frais et locaux (mise en avant sur les fiches voyage)."),
    Bullet("Pas de gaspillage alimentaire — quantités ajustées au nombre exact de voyageurs."),

    H2("4.3. Engagements numériques"),
    Bullet("Hébergement Scaleway France certifié ISO 27001 — efficacité énergétique des datacenters."),
    Bullet("Optimisation des requêtes serveur et caching pour limiter la consommation."),
    Bullet("Contenus visuels optimisés (compression images, vidéos en streaming adaptatif)."),
    Bullet("Cible An 3 : audit empreinte carbone numérique et publication d'un bilan."),

    H2("4.4. Compensation carbone"),
    Bullet("À compter de l'An 2 : possibilité offerte au voyageur de compenser son empreinte CO₂ via un partenaire certifié (sur option, prix public)."),
    Bullet("À compter de l'An 3 : Eventy compense 100 % de l'empreinte CO₂ de l'équipe interne."),
    Bullet("Partenariats potentiels : Reforest'Action, Pur Projet, Climate Seed (à étudier)."),

    H1("5. Pilier gouvernance"),

    H2("5.1. Transparence et reporting"),
    Bullet("Décomposition publique du prix sur chaque fiche voyage."),
    Bullet("Reporting trimestriel à l'APST (volume des fonds clients en transit)."),
    Bullet("Bilan annuel certifié par expert-comptable + commissaire aux comptes (au-delà du seuil)."),
    Bullet("Rapport d'activité annuel public, incluant un volet RSE."),
    Bullet("Dashboard public d'indicateurs RSE clés (à compter de l'An 2)."),

    H2("5.2. Éthique des affaires"),
    Bullet("Politique anti-corruption stricte — refus de tout cadeau ou avantage personnel auprès des partenaires."),
    Bullet("Refus de toute pratique commerciale trompeuse (prix barrés fictifs, urgence artificielle, etc.)."),
    Bullet("Confidentialité des données partenaires et voyageurs (RGPD, accords article 28)."),
    Bullet("Coopération pleine avec les autorités de contrôle (APST, Atout France, DGCCRF, CNIL)."),

    H2("5.3. Gouvernance partagée"),
    Bullet("Comité d'investissement informel post-levée Seed — droit d'information renforcé pour les Investisseurs."),
    Bullet("Statuts incluant une clause de réserve volontaire 5 % CA non-distribuable (article 13)."),
    Bullet("Politique de rémunération du dirigeant transparente, communiquée annuellement."),

    H1("6. Indicateurs RSE clés"),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Indicateur RSE", "Cible An 1", "Cible An 5"],
      rows: [
        ["Redistribution aux indépendants français (% du CA)", "≥ 6,8 %", "≥ 6,8 %"],
        ["Nombre d'indépendants actifs (créateurs + vendeurs)", "≥ 450", "≥ 5 600"],
        ["Nombre de partenaires HRA français", "≥ 100", "≥ 1 500"],
        ["Taux de voyages partis (vs annulés pour seuil)", "≥ 90 %", "≥ 95 %"],
        ["Note de satisfaction voyageur (NPS)", "≥ + 60", "≥ + 70"],
        ["Pénalités fournisseurs payées intégralement", "100 %", "100 %"],
        ["Délai moyen de paiement aux indépendants", "≤ 21 jours", "≤ 21 jours"],
        ["Pourcentage transport groupé bas-carbone", "≥ 70 %", "≥ 70 %"],
        ["Réserve volontaire constituée (en % du CA cumulé)", "≥ 1 %", "≥ 5 %"],
        ["Heures de formation continue dirigeant", "≥ 21 h/an", "≥ 21 h/an"],
      ],
    }),

    H1("7. Engagement de progrès"),
    Bullet("Audit RSE annuel par tiers indépendant à compter de l'An 3."),
    Bullet("Adhésion au Pacte Mondial des Nations Unies (à étudier An 2)."),
    Bullet("Certification B Corp ou équivalent à viser à compter de l'An 4."),
    Bullet("Publication d'un rapport RSE annuel public."),

    Spacer(180),
    P("Document de référence interne et externe — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray }),
    P("Pour toute question : eventylife@gmail.com.", { italics: true, color: COLOR.gray }),
  ];
}

// ============================================================
// DOCUMENT 2 — FAQ VOYAGEURS
// ============================================================
function faqVoyageurs() {
  return [
    bandeauTitre(
      "FAQ — VOS QUESTIONS, NOS RÉPONSES",
      "Questions fréquentes voyageurs Eventy Life — version eventylife.fr",
    ),
    Spacer(160),

    P("Cette FAQ regroupe les questions les plus fréquentes que vous pouvez vous poser avant, pendant et après votre voyage Eventy Life. Elle est mise à jour régulièrement. Pour toute autre question, contactez-nous à eventylife@gmail.com.", { italics: true }),

    H1("Avant de réserver"),

    H2("Q1. Qu'est-ce qu'Eventy Life ?"),
    P("Eventy Life est une plateforme française de voyages de groupe organisés. Nous concevons et opérons des voyages pour 38 voyageurs en moyenne, en autocar ou en avion, à destination de la France et de l'Europe à portée de bus, ainsi que du Maroc. Nous sommes immatriculés Atout France au registre des opérateurs de voyages et de séjours."),

    H2("Q2. Combien de voyageurs partent en moyenne ?"),
    P("Notre capacité nominale est de 38 voyageurs par voyage (soit 72 % d'un autocar de 53 places). Notre seuil minimum de départ est de 28 voyageurs. En dessous, le voyage est annulé et l'intégralité des sommes versées est remboursée sous 14 jours."),

    H2("Q3. Comment se fait l'inscription ?"),
    P("L'inscription se fait directement en ligne sur eventylife.fr. Vous choisissez votre voyage, vous créez votre compte, vous lisez et acceptez les Conditions Générales de Vente, et vous versez l'acompte de 30 %. Vous recevez immédiatement une confirmation par email avec votre contrat de voyage et l'accès à votre espace voyageur personnel."),

    H2("Q4. Que comprend le prix ?"),
    P("Le prix affiché est tout compris TTC : transport (autocar ou vol), hébergement, repas inclus selon le programme, activités décrites, taxes locales, Pack Sérénité (assurance incluse), accompagnement humain. Aucune surcharge ne sera ajoutée au moment du paiement. Sur chaque fiche voyage, vous voyez la décomposition simplifiée du prix."),

    H2("Q5. Quels modes de paiement acceptez-vous ?"),
    P("Carte bancaire (avec authentification forte 3D Secure), Apple Pay, Google Pay. À l'avenir, nous étudions la possibilité d'accepter les chèques-vacances ANCV."),

    H2("Q6. L'assurance est-elle incluse ?"),
    P("Oui. Le Pack Sérénité est INCLUS dans tous les voyages Eventy, sans surcoût visible. Il couvre l'annulation pour motif valable (maladie, deuil, mutation, etc.), le rapatriement médical, les frais médicaux à l'étranger, l'indemnisation des bagages perdus ou endommagés, et l'accès à une ligne d'urgence 24h/24 et 7j/7."),

    H2("Q7. Puis-je payer en plusieurs fois ?"),
    P("Le paiement est en deux étapes : 30 % d'acompte au moment de la réservation, et 70 % du solde au plus tard 30 jours avant le départ. Vous pouvez également régler le solde plus tôt si vous le souhaitez."),

    H1("Modifications et annulations"),

    H2("Q8. Puis-je modifier mon voyage après réservation ?"),
    P("Vous pouvez transférer votre voyage à un tiers (un proche, par exemple) jusqu'à 7 jours avant le départ, conformément à la directive européenne sur les voyages à forfait. Des frais administratifs limités peuvent s'appliquer. Vous pouvez aussi modifier des options accessoires (régime alimentaire, accessibilité, etc.) en contactant le support."),

    H2("Q9. Puis-je annuler mon voyage ?"),
    P("Oui, vous pouvez annuler à tout moment avant le départ, moyennant des frais de résolution selon le délai : 25 % du prix si annulation à plus de 60 jours, 50 % entre 60 et 30 jours, 75 % entre 30 et 15 jours, 90 % à moins de 15 jours. En cas de motif valable couvert par le Pack Sérénité (maladie, deuil, etc.), ces frais peuvent être pris en charge par l'assurance."),

    H2("Q10. Que se passe-t-il si Eventy annule le voyage ?"),
    P("Si Eventy annule le voyage (par exemple parce que le seuil minimum de 28 voyageurs n'est pas atteint, ou en cas de circonstances exceptionnelles inévitables), vous êtes intégralement remboursé sous 14 jours, sans frais."),

    H2("Q11. Le prix peut-il changer après réservation ?"),
    P("Le prix peut être modifié à la hausse ou à la baisse jusqu'à 20 jours avant le départ, dans la limite de 8 % maximum, en cas d'évolution du coût du carburant, des taxes ou des taux de change. Au-delà de 8 %, vous pouvez résoudre le contrat sans frais avec remboursement intégral. Aucune modification de prix n'est possible à moins de 20 jours du départ."),

    H1("Pendant le voyage"),

    H2("Q12. Y a-t-il un accompagnateur ?"),
    P("Oui, un accompagnateur Eventy est présent du premier au dernier kilomètre. Il vous attend au point de départ, voyage avec vous, organise les visites, gère les imprévus, et reste joignable 24h/24 pendant tout le séjour. Il est formé aux premiers secours et au manuel d'incident Eventy."),

    H2("Q13. Comment joindre Eventy en cas d'urgence ?"),
    P("Une ligne d'urgence 24h/24 et 7j/7 est joignable pendant toute la durée de votre voyage et 48 heures après le retour. Le numéro est inscrit sur votre confirmation de réservation, dans votre espace voyageur en ligne, et sur la pochette voyage qui vous est remise au départ."),

    H2("Q14. Que se passe-t-il en cas de problème médical ?"),
    P("En cas de problème médical, contactez immédiatement la ligne 24/7. Vous serez mis en relation avec un médecin régulateur de notre assureur Pack Sérénité. Selon la situation, vous serez orienté vers une consultation locale, ou un rapatriement médicalisé sera organisé. Tous les frais sont avancés et pris en charge par l'assureur."),

    H2("Q15. Puis-je changer de chambre ou de table ?"),
    P("Bien sûr. Parlez-en à votre accompagnateur, qui fera le nécessaire selon les disponibilités sur place. Si une demande spécifique est formulée à la réservation (chambre au calme, allergie alimentaire, etc.), elle sera communiquée au partenaire HRA en amont."),

    H2("Q16. Puis-je faire des activités libres en dehors du programme ?"),
    P("Oui, vous êtes libre de votre temps en dehors des moments de groupe. L'accompagnateur peut vous conseiller sur les bonnes adresses locales, mais respecte votre autonomie."),

    H1("Après le voyage"),

    H2("Q17. Comment laisser un avis ou faire une réclamation ?"),
    P("Au retour, vous recevez automatiquement un email avec un questionnaire de satisfaction (Net Promoter Score). N'hésitez pas à nous dire ce qui vous a plu et ce qui pourrait être amélioré. En cas de réclamation, écrivez à reclamation@eventylife.fr — vous recevrez une réponse motivée sous 30 jours."),

    H2("Q18. Que faire si Eventy ne répond pas à ma réclamation ?"),
    P("Si vous n'êtes pas satisfait de notre réponse ou si nous ne répondons pas dans les 30 jours, vous pouvez saisir gratuitement la Médiation Tourisme et Voyage (MTV) sur mtv.travel/demande-saisine. Le médiateur est indépendant et émet un avis sous 90 jours."),

    H2("Q19. Comment récupérer mes photos de voyage ?"),
    P("Un album partagé vous est proposé après le voyage (Google Photos ou équivalent), où chaque voyageur du groupe peut déposer ses photos avec son consentement. C'est un beau souvenir collectif."),

    H1("Ambassadeurs et fidélité"),

    H2("Q20. Comment devenir ambassadeur Eventy ?"),
    P("Tout voyageur qui a fait un voyage avec nous peut devenir ambassadeur en signant le Contrat Vendeur Eventy. Vous bénéficiez alors de 5 % HT de commission sur chaque inscription que vous placez auprès de vos proches. Vous recevez un code parrainage personnel — votre filleul a 5 % de réduction et vous recevez un bonus. Aucune obligation de vente, juste si l'envie vous prend."),

    H2("Q21. Y a-t-il un programme de fidélité ?"),
    P("Pas de programme de fidélité formel à ce jour, mais un système d'énergie inclus dans chaque voyage qui se convertit en réduction sur le prochain. Plus vous voyagez avec nous, plus vos voyages suivants deviennent abordables. Le détail est sur eventylife.fr/energie."),

    H1("Données personnelles et confidentialité"),

    H2("Q22. Comment mes données sont-elles protégées ?"),
    P("Vos données personnelles sont hébergées en France (Scaleway, Paris). Nous appliquons strictement le RGPD (règlement européen sur la protection des données). Notre Délégué à la Protection des Données est joignable à dpo@eventylife.fr. La politique de confidentialité complète est disponible sur eventylife.fr/confidentialite."),

    H2("Q23. Puis-je récupérer ou supprimer mes données ?"),
    P("Oui, à tout moment. Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Demandez-le à dpo@eventylife.fr — nous répondons sous 1 mois maximum."),

    H1("Contact"),
    P("Une question qui n'est pas dans cette FAQ ?"),
    Bullet("Email général : eventylife@gmail.com"),
    Bullet("Réclamation : reclamation@eventylife.fr"),
    Bullet("Données personnelles : dpo@eventylife.fr"),
    Bullet("Ligne d'urgence (pendant un voyage) : numéro communiqué dans la pochette voyage"),

    Spacer(160),
    P("Document de référence pour eventylife.fr — Version 1.0 — 30 avril 2026. Mise à jour régulière selon les retours voyageurs.", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// DOCUMENT 3 — PROCÉDURE DE RÉCLAMATION VOYAGEUR DÉTAILLÉE
// ============================================================
function procedureReclamation() {
  return [
    bandeauTitre(
      "PROCÉDURE DE RÉCLAMATION VOYAGEUR",
      "Manuel détaillé pour l'équipe support Eventy Life",
    ),
    Spacer(160),

    P("Le présent manuel détaille la procédure de traitement des réclamations voyageurs au sein d'Eventy Life. Il est destiné à l'équipe support, au Responsable opérations et au Responsable réclamations. Il complète l'Article 13 des CGV, l'Annexe R du dossier APST (procédure synthétique) et le Manuel d'incident voyage (volet incident en cours).", { italics: true }),

    P("Ce manuel a vocation à garantir un traitement équitable, rapide et documenté de chaque réclamation, dans le respect des droits du voyageur (directive UE 2015/2302 et Code du Tourisme) et de l'intérêt légitime d'Eventy.", { italics: true }),

    H1("1. Périmètre et définitions"),

    H2("1.1. Qu'est-ce qu'une réclamation ?"),
    P("Une réclamation est une expression écrite ou orale d'un voyageur qui exprime son insatisfaction concernant un aspect du voyage exécuté ou des prestations fournies. Elle se distingue :"),
    Bullet("Du simple retour de satisfaction (NPS, commentaires post-voyage non litigieux)."),
    Bullet("De la demande de renseignement (avant ou après voyage, sans grief)."),
    Bullet("De l'incident en cours de voyage (qui relève du Manuel d'incident, traitement immédiat sur place)."),
    P("La réclamation porte sur un fait constaté, un préjudice subi, ou une prestation jugée non conforme au contrat."),

    H2("1.2. Canaux de dépôt"),
    Bullet("Email principal : reclamation@eventylife.fr — canal préféré, traçabilité optimale."),
    Bullet("Courrier postal au siège social — accusé de réception recommandé pour le voyageur."),
    Bullet("Formulaire de contact eventylife.fr/reclamation — redirige vers reclamation@eventylife.fr."),
    Bullet("Téléphone de la ligne support — l'opérateur retranscrit par écrit la réclamation et la confirme par email au voyageur sous 24 h."),

    H2("1.3. Délai de dépôt"),
    P("Le voyageur dispose d'un délai raisonnable pour déposer une réclamation. Eventy recommande un dépôt dans les 30 jours suivant la fin du voyage, sans toutefois imposer ce délai (qui pourrait être considéré comme abusif). Toute réclamation déposée dans la limite de 2 ans après le voyage (prescription légale) est recevable."),

    H1("2. Étapes de traitement"),

    H2("2.1. Étape 1 — Accusé de réception (sous 48 heures ouvrées)"),
    P("Tout réclamation reçue fait l'objet d'un accusé de réception sous 48 heures ouvrées maximum. L'accusé est rédigé selon le modèle ci-dessous :"),
    Encart({
      title: "MODÈLE — ACCUSÉ DE RÉCEPTION RÉCLAMATION",
      color: COLOR.blue,
      fill: COLOR.blueLt,
      lines: [
        { text: "« Madame, Monsieur,", italics: true },
        { text: "Nous avons bien reçu votre réclamation enregistrée sous le numéro RECLA-[YYYYMM]-[####], concernant votre voyage [destination] du [dates].", italics: true },
        { text: "Votre dossier est confié à [prénom de l'agent]. Conformément à nos Conditions Générales de Vente et au Code de la consommation, nous nous engageons à vous apporter une réponse motivée dans un délai maximum de 30 jours à compter de la date de votre réclamation, soit au plus tard le [date].", italics: true },
        { text: "Si vous avez des éléments complémentaires à nous transmettre (factures, photos, témoignages), n'hésitez pas à le faire à reclamation@eventylife.fr en indiquant le numéro de dossier.", italics: true },
        { text: "Bien cordialement,\n[Prénom Nom] — Responsable Réclamations Eventy Life »", italics: true },
      ],
    }),

    H2("2.2. Étape 2 — Instruction (sous 7 à 21 jours)"),
    Numbered("Le Responsable réclamations ouvre un dossier dans la plateforme Eventy avec numéro RECLA-[YYYYMM]-[####] et journalisation horodatée."),
    Numbered("Collecte des pièces : récit du voyageur, demande explicite, factures éventuelles, photos, certificats médicaux, témoignages."),
    Numbered("Vérification des faits dans la plateforme Eventy : référence voyage, accompagnateur, partenaires HRA, éventuels incidents déjà signalés en cours de voyage."),
    Numbered("Échange éventuel avec l'accompagnateur du voyage et/ou les partenaires HRA concernés (sous 5 jours)."),
    Numbered("Qualification du préjudice (matériel, moral, manquement contractuel, force majeure)."),
    Numbered("Évaluation du droit à réduction de prix ou indemnisation au regard des CGV et de la directive UE 2015/2302."),
    Numbered("Le cas échéant, consultation de l'avocat tourisme partenaire pour avis express (sous 48 h)."),
    Numbered("Synthèse et rédaction du projet de réponse au voyageur."),
    Numbered("Validation interne par le Responsable opérations (au-delà de 200 €) ou le Président (au-delà de 1 000 €)."),

    H2("2.3. Étape 3 — Réponse au voyageur (au plus tard à J+30)"),
    P("Eventy apporte une réponse motivée dans un délai maximum de 30 jours à compter de la date de réception de la réclamation. La réponse précise :"),
    Bullet("Le motif de l'acceptation totale, partielle ou du rejet."),
    Bullet("Le cas échéant, la réduction de prix ou indemnisation proposée, avec son fondement (article du contrat, du Code du Tourisme, etc.)."),
    Bullet("Les modalités de versement de l'indemnité éventuelle (virement, voucher voyage suivant, geste commercial)."),
    Bullet("Les voies de recours en cas de désaccord : médiation MTV (gratuit), action judiciaire."),

    H2("2.4. Étape 4 — Suivi du règlement (sous 14 à 30 jours après acceptation)"),
    Bullet("Si le voyageur accepte la proposition : le règlement est effectué sous 14 jours par virement bancaire."),
    Bullet("Si le règlement prend la forme d'un voucher voyage suivant : le voucher est généré et envoyé sous 7 jours, valable 12 mois minimum."),
    Bullet("Confirmation au voyageur du règlement effectif, avec demande de retour de satisfaction sur le traitement de la réclamation."),

    H2("2.5. Étape 5 — Médiation (si désaccord)"),
    P("En cas de désaccord, le voyageur peut saisir gratuitement la Médiation Tourisme et Voyage (MTV) sur mtv.travel/demande-saisine. Eventy s'engage alors à :"),
    Bullet("Coopérer pleinement avec le médiateur."),
    Bullet("Fournir tous les documents et explications utiles sous 21 jours."),
    Bullet("Examiner avec ouverture l'avis du médiateur (qui n'est pas juridiquement contraignant)."),
    Bullet("Accepter ou refuser l'avis avec motivation, dans le délai imparti."),

    H1("3. Barème indicatif d'indemnisation"),
    P("Le présent barème est indicatif et ne lie pas l'opérateur dans tous les cas. Chaque dossier est apprécié individuellement. Le barème est conforme à la jurisprudence et aux pratiques du secteur."),
    makeTable({
      widths: [3500, 2500, 3360],
      header: ["Type de manquement", "Indemnisation typique", "Validation requise"],
      rows: [
        ["Retard de transport < 4 h", "Geste commercial 30-100 €", "Agent (autonome jusqu'à 100 €)"],
        ["Retard de transport > 4 h", "Indemnisation 100-300 €", "Responsable réclamations"],
        ["Repas inclus non servi ou très inférieur", "Remboursement valeur prestation + 50 %", "Agent"],
        ["Hôtel sur-réservé partiellement (chambre dégradée)", "Réduction 10-25 % prix hébergement", "Responsable réclamations"],
        ["Hôtel sur-réservé totalement (relogement)", "Réduction 25-50 % prix hébergement + indemnité", "Responsable opérations"],
        ["Activité incluse non réalisée", "Remboursement valeur activité + 50 %", "Agent"],
        ["Bagages perdus ou détériorés", "Indemnisation Pack Sérénité (assureur)", "Transmission assureur"],
        ["Préjudice moral léger (mauvaise qualité d'accueil)", "Geste commercial 50-150 €", "Responsable réclamations"],
        ["Préjudice corporel léger (non couvert RC Pro)", "Cas par cas, conseil avocat", "Président"],
        ["Préjudice corporel grave (couvert RC Pro)", "Transmission RC Pro Tourisme", "Président + avocat"],
      ],
    }),

    H1("4. Indicateurs de pilotage"),
    Bullet("Nombre de réclamations / mois (cible An 1 : ≤ 2 % des voyageurs)."),
    Bullet("Délai moyen de réponse (cible : ≤ 14 jours)."),
    Bullet("Taux de satisfaction post-traitement (cible : ≥ 80 %)."),
    Bullet("Taux de saisine MTV (cible : ≤ 0,2 % des voyageurs)."),
    Bullet("Coût moyen d'indemnisation par réclamation (à suivre, cible An 1 ≤ 100 €)."),
    Bullet("Reporting mensuel au Responsable opérations + revue trimestrielle Comité de pilotage."),

    H1("5. Cas particuliers"),

    H2("5.1. Réclamation collective (plusieurs voyageurs du même groupe)"),
    Bullet("Traitement consolidé du dossier sous une référence commune (RECLA-[YYYYMM]-[####]-G)."),
    Bullet("Réponse uniforme à tous les voyageurs concernés (équité)."),
    Bullet("Validation Responsable opérations dès qu'au moins 3 voyageurs sont concernés par le même fait."),
    Bullet("Présidence informée si ≥ 10 voyageurs concernés ou si l'indemnité totale dépasse 5 000 €."),

    H2("5.2. Réclamation pour fait imputable à un partenaire HRA"),
    Bullet("Eventy reste responsable de plein droit envers le voyageur (article L211-16 Code Tourisme)."),
    Bullet("L'indemnité est versée par Eventy au voyageur en première intention."),
    Bullet("Eventy se retourne ensuite contre le partenaire HRA défaillant — courrier formel + retenue éventuelle sur paiement (article 3 du contrat-cadre HRA)."),
    Bullet("En cas de récidive du HRA, mise à jour de la fiche partenaire et possible déréférencement."),

    H2("5.3. Réclamation infondée ou abusive"),
    Bullet("Eventy traite chaque réclamation avec sérieux, mais sans céder à la mauvaise foi."),
    Bullet("Si après instruction approfondie, la réclamation est jugée infondée, le voyageur en est informé avec motivation."),
    Bullet("En cas de réclamation manifestement abusive (insultes, menaces, demandes disproportionnées), le dossier est traité par le Président avec conseil avocat."),
    Bullet("Aucune indemnité n'est versée pour calmer une situation injustifiée — l'équité envers les autres voyageurs prime."),

    H2("5.4. Réclamation impliquant des enjeux de sécurité ou des autorités"),
    Bullet("Tout fait pouvant relever d'une infraction pénale (vol, agression, harcèlement) est immédiatement remonté au Président."),
    Bullet("Information éventuelle des autorités compétentes (police, gendarmerie, autorités administratives)."),
    Bullet("Conseil de l'avocat tourisme et, si nécessaire, du conseil pénal."),
    Bullet("Information des assureurs (RC Pro, Pack Sérénité) en parallèle."),

    H1("6. Outils et templates"),
    Bullet("Plateforme Eventy : module dédié réclamations avec workflow, journalisation, escalade."),
    Bullet("Templates de réponse pré-rédigés (acceptation, partielle, rejet) — à personnaliser."),
    Bullet("Bibliothèque de jurisprudence et avis MTV de référence."),
    Bullet("Tableau de bord mensuel des réclamations + reporting Comité de pilotage."),

    Spacer(180),
    P("Document opérationnel interne — Version 1.0 — 30 avril 2026. Mise à jour annuelle.", { italics: true, color: COLOR.gray, size: 18 }),
    P("Document de référence : voir Article 13 des CGV (Eventy-Life-CGV.pdf) + Annexe R du dossier APST (procédure synthétique) + Manuel d'incident voyage (volet incident en cours).", { italics: true, color: COLOR.gray, size: 18 }),
  ];
}

// ============================================================
// Document commun
// ============================================================
function makeDoc({ title, description, footerLeft, children }) {
  return new Document({
    creator: "David Eventy — Eventy Life SAS",
    title,
    description,
    styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
    numbering: {
      config: [
        { reference: "bullets", levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]},
        { reference: "numbers", levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]},
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                children: [
                  new TextRun({ text: footerLeft, size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ text: "\tPage ", size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ text: " / ", size: 14, color: COLOR.gray, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: COLOR.gray, font: "Calibri" }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

async function generate() {
  const outputs = [
    {
      file: "docs/garanties/Eventy-Life-Politique-RSE.docx",
      title: "Eventy Life — Politique RSE",
      description: "Politique de Responsabilité Sociétale d'Entreprise.",
      footer: "EVENTY LIFE SAS — Politique RSE",
      children: politiqueRSE(),
    },
    {
      file: "docs/garanties/Eventy-Life-FAQ-Voyageurs.docx",
      title: "Eventy Life — FAQ voyageurs",
      description: "Questions fréquentes voyageurs Eventy Life.",
      footer: "EVENTY LIFE SAS — FAQ voyageurs",
      children: faqVoyageurs(),
    },
    {
      file: "docs/garanties/Eventy-Life-Procedure-Reclamation-Detaillee.docx",
      title: "Eventy Life — Procédure de réclamation voyageur détaillée",
      description: "Manuel opérationnel pour l'équipe support en charge des réclamations.",
      footer: "EVENTY LIFE SAS — Procédure réclamation · Manuel support",
      children: procedureReclamation(),
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
