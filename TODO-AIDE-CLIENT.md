# TODO — Centre d'Aide Client Eventy
> Objectif : le client ne doit JAMAIS se sentir perdu.
> Créé le 2026-04-25

---

## VISION

Le Centre d'Aide est la bouée de sauvetage du client. Quand il ne comprend pas quelque chose, il doit trouver la réponse en moins de 30 secondes. Le ton est chaleureux, jamais robotique. On parle comme un ami qui connaît bien le produit.

---

## 1. PAGE PRINCIPALE — /client/aide

### 1.1 Hero + Recherche
- [ ] **Barre de recherche full-width** avec suggestions en temps réel (autocomplete)
- [ ] Placeholder : "Que cherches-tu ? ex: énergie, réservation, remboursement..."
- [ ] Recherche dans titres + contenu des articles
- [ ] Résultats en dropdown avec catégorie + extrait
- [ ] État vide : "Aucun résultat pour X → Contacte le support"

### 1.2 Accès rapide (Top 4)
- [ ] **Bouton** "Annuler ma réservation"
- [ ] **Bouton** "Comprendre l'Énergie"
- [ ] **Bouton** "Démarrer avec le Gaming"
- [ ] **Bouton** "Contacter le support"

### 1.3 Catégories d'articles
- [ ] **Réservations & Voyages** (8-10 articles)
  - Comment réserver un voyage
  - Modifier ma réservation
  - Annuler et se faire rembourser
  - Que faire si je rate le bus
  - Documents à emporter
  - Assurance voyage incluse
- [ ] **Énergie & Points** (6-8 articles)
  - Qu'est-ce que l'Énergie Eventy
  - Comment gagner de l'Énergie
  - Utiliser l'Énergie pour un voyage
  - Les 5 paliers expliqués
  - Énergie expirée ? Ce qu'il faut savoir
  - Offrir de l'Énergie à un ami
- [ ] **Gaming & Jeux** (8-10 articles)
  - Comment fonctionnent les raids
  - Les guildes / clans expliqués
  - Invoquer un héros sponsor
  - Système de loot & rareté
  - Défis et challenges
  - Classements & récompenses
- [ ] **Compte & Profil** (5-6 articles)
  - Modifier mes informations
  - Changer mon mot de passe
  - Supprimer mon compte
  - Confidentialité & données
- [ ] **Paiements & Factures** (5-6 articles)
  - Payer en 3x ou 4x
  - Télécharger ma facture
  - Remboursement — délais et process
  - Ajouter une carte bancaire
- [ ] **Parrainage & Codes** (3-4 articles)
  - Comment fonctionne le parrainage
  - Utiliser un code créateur
  - Partager sur les réseaux

### 1.4 Articles populaires
- [ ] Section "Les plus consultés cette semaine" (5 articles)
- [ ] Badge "Nouveau" sur les articles récents
- [ ] Compteur de vues (mock côté client)

### 1.5 Feedback article
- [ ] Sur chaque article : "Cet article t'a aidé ?" → Oui / Non
- [ ] Si Non : textarea "Qu'est-ce qui manque ?" → envoi backend
- [ ] Compteur "X personnes ont trouvé cet article utile"

### 1.6 Chat Support intégré
- [ ] **Bouton flottant** en bas à droite (gold #D4A853)
- [ ] Widget slide-in avec :
  - Accueil : "Salut 👋 Comment puis-je t'aider ?"
  - 3 sujets rapides cliquables
  - Zone de message libre
  - Envoi vers backend /api/support/chat
  - Réponse auto : "On revient vers toi sous 24h ✓"
- [ ] Indicateur de présence (en ligne / réponse sous Xh)

---

## 2. ARTICLES DÉTAILLÉS — /client/aide/[slug]

### Structure d'un article
- [ ] **Breadcrumb** : Aide > Catégorie > Article
- [ ] **Titre H1** + temps de lecture estimé
- [ ] **Contenu riche** : texte, sous-titres H2/H3, listes, callouts (info/warning/tip)
- [ ] **Images/GIFs** illustratifs (placeholders pour l'instant)
- [ ] **Liens connexes** : "Tu pourrais aussi lire..."
- [ ] **CTA contextuel** : selon le sujet (ex: "Réserver maintenant", "Voir mon Énergie")
- [ ] **Navigation précédent/suivant** dans la catégorie

### Articles à créer (contenu complet)
- [ ] `comment-reserver` — Étapes pas à pas avec captures
- [ ] `annuler-reservation` — Conditions, délais, remboursement
- [ ] `comprendre-energie` → redirige vers /client/aide/energie (page dédiée)
- [ ] `guide-gaming` → redirige vers /client/aide/gaming (page dédiée)
- [ ] `parrainage-comment-ca-marche` — Code unique, paliers, gains
- [ ] `paiement-plusieurs-fois` — 3x/4x, conditions, exemple chiffré

---

## 3. FAQ ENRICHIE CLIENT — /client/aide/faq

### Compléments à la FAQ publique (/faq) — version connectée
- [ ] **Réponses personnalisées** selon l'état du compte (ex: "Tu as X points Énergie...")
- [ ] **FAQ Gaming** (inexistante actuellement) :
  - C'est quoi un raid ? Comment participer ?
  - Qu'est-ce qu'un héros sponsor ?
  - Comment fonctionne le loot ?
  - Mon personnage peut-il mourir ?
  - Les guildes, c'est obligatoire ?
- [ ] **FAQ Énergie** (inexistante actuellement) :
  - Mes points expirent-ils ?
  - Je peux utiliser mon Énergie pour quoi exactement ?
  - Quelle est la différence entre Mode Jeux et Mode Voyage ?
  - Puis-je transférer mon Énergie à quelqu'un ?
- [ ] Filtre par catégorie + recherche dans la FAQ
- [ ] Accordéon animé (Framer Motion)

---

## 4. COMPOSANTS TRANSVERSAUX

### 4.1 HelpBubble — Infobulle contextuelle
- [ ] Icône (?) dorée, taille sm, positionnée à côté des éléments complexes
- [ ] Tooltip au hover/tap avec explication courte (2-3 lignes)
- [ ] Optionnel : lien "En savoir plus → /client/aide/[slug]"
- [ ] À intégrer sur :
  - Dashboard client : chaque KPI
  - Page Énergie : paliers, taux de conversion
  - Page Gaming : chaque mécanique
  - Page Réservation : options, assurances
  - Wallet : solde, transactions, loyauté

### 4.2 OnboardingTooltip — Premier passage
- [ ] Série de tooltips séquentiels pour les nouveaux clients
- [ ] Déclenchement : `firstVisit === true` (localStorage)
- [ ] Overlay semi-transparent avec spotlight sur l'élément
- [ ] Boutons Précédent / Suivant / Passer
- [ ] Progression visible (step 1/5)

### 4.3 ArticleCard — Carte article aide
- [ ] Titre, catégorie, temps de lecture
- [ ] Hover : border gold, légère élévation
- [ ] Badge "Nouveau" ou "Populaire"

---

## 5. BACK-OFFICE (future)

- [ ] CMS articles d'aide (admin peut créer/modifier/supprimer)
- [ ] Analytics : articles les plus vus, taux satisfaction, recherches sans résultat
- [ ] Alertes : si 100+ recherches sans résultat → créer article

---

## PRIORITÉS

| Priorité | Item |
|----------|------|
| P0 | Page /client/aide principale + catégories |
| P0 | Articles : comprendre-energie, guide-gaming |
| P1 | HelpBubble composant + intégration dashboard |
| P1 | Chat support widget flottant |
| P2 | Articles détaillés (tous les slugs) |
| P2 | FAQ Gaming + FAQ Énergie |
| P3 | CMS back-office articles |
| P3 | Analytics aide |

---

## DESIGN

- Background : `bg-[#0A0E14]`
- Accent or : `#D4A853`
- Cards : `bg-[#0D1117]` border `border-white/5`
- Callout info : `bg-blue-500/10 border-blue-500/30`
- Callout warning : `bg-amber-500/10 border-amber-500/30`
- Callout success : `bg-emerald-500/10 border-emerald-500/30`
- Animations : Framer Motion (stagger sur les cards)
- Icônes : Lucide React
