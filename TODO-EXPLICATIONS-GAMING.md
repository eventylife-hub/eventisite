# TODO — Explications Gaming Eventy
> Le gaming doit être compréhensible en 5 minutes, même pour quelqu'un qui n'a jamais joué.
> Créé le 2026-04-25

---

## VISION

Le système Gaming d'Eventy est une couche de fun et de récompenses par-dessus les voyages. Chaque mécanique doit avoir une explication claire, visuelle, courte. On n'explique pas pour expliquer — on donne envie de jouer.

---

## 1. PAGE GUIDE GAMING — /client/aide/gaming

### 1.1 Structure générale
- [ ] Hero : "Le Gaming Eventy — Joue, Gagne, Voyage"
- [ ] 6 sections avec ancres :
  1. #raids-boss
  2. #guildes-clans
  3. #heros-sponsors
  4. #loot-recompenses
  5. #energy-gaming
  6. #classements

### 1.2 Navigation sticky latérale (desktop)
- [ ] Sommaire à gauche, contenu à droite
- [ ] Highlight de la section active au scroll
- [ ] Sur mobile : menu déroulant en haut

---

## 2. LES RAIDS & BOSS

### Concept
- [ ] **Qu'est-ce qu'un raid ?** : Événement collectif où les joueurs attaquent un Boss ensemble pendant une durée limitée (24h, 48h, 72h)
- [ ] **Types de Boss** :
  - Normal : solo ou groupe, pas de héros requis
  - Héroïque : 1 héros sponsor minimum requis
  - Mythique : 3 héros sponsors requis
  - Légendaire : 5 héros sponsors, héros rares requis
- [ ] **Comment participer** :
  - Rejoindre un raid en cours (bouton "Attaquer")
  - Attaque = action concrète (jouer à un jeu, scanner un code, acheter, inviter)
  - Chaque action inflige des dégâts au boss
- [ ] **Récompenses** :
  - Énergie proportionnelle aux dégâts infligés
  - Loot aléatoire si le boss est vaincu
  - Bonus de première victoire (First Kill)
  - Badge exclusif "Vainqueur du Boss X"

### Pages à créer
- [ ] Section détaillée dans /client/aide/gaming#raids-boss
- [ ] Schéma visuel : joueur → actions → dégâts → boss → loot
- [ ] Exemple concret : "Tu joues 10 minutes à un mini-jeu → 500 dégâts → le boss tombe → tu gagnes 1500 Énergie + 1 item Rare"

---

## 3. LES GUILDES / CLANS

### Concept
- [ ] **Qu'est-ce qu'une guilde ?** : Groupe de 5 à 50 joueurs qui coopèrent pour des événements et des raids
- [ ] **Créer une guilde** :
  - Nom, emblème, description, règles d'accès (ouverte / sur demande / fermée)
  - Coût de création : 500 Énergie (anti-spam)
- [ ] **Rejoindre une guilde** :
  - Rechercher par nom ou laisser le système suggérer selon son niveau
  - Candidature → approbation du chef de guilde
- [ ] **Avantages guilde** :
  - Raids en guilde avec bonus collectif (+10% Énergie si 5 membres actifs)
  - Chat guilde dédié
  - Classement inter-guildes
  - Coffre commun (loot partageable)
- [ ] **Rôles** : Membre, Officier, Chef

### Pages à créer
- [ ] Section dans /client/aide/gaming#guildes-clans
- [ ] Schéma : structure d'une guilde (chef → officiers → membres)
- [ ] Tableau des avantages par taille de guilde

---

## 4. LES HÉROS SPONSORS

### Concept
- [ ] **Qu'est-ce qu'un héros ?** : Personnage unique lié à un sponsor Eventy (marque partenaire). Chaque héros a des statistiques et capacités spéciales.
- [ ] **Raretés** :
  - ⚪ Commun : disponible facilement, bonus faibles
  - 🟢 Peu commun : obtenu via codes créateurs
  - 🔵 Rare : obtenu via raids normaux
  - 🟣 Épique : drop raids héroïques, très puissant
  - 🟡 Légendaire : drop raids mythiques/légendaires, capacités uniques
  - 🔴 Sponsor Exclusif : lié à un événement ou sponsor spécifique, limité dans le temps
- [ ] **Comment obtenir un héros** :
  - Scan code QR sponsor
  - Drop de loot en raid
  - Achat dans la boutique (Énergie ou réel)
  - Événements limités
- [ ] **Utilisation** :
  - Invoquer avant un raid pour débloquer la difficulté et obtenir bonus
  - Chaque héros a un "cooldown" d'invocation (ex: 24h)
  - Monter en niveau le héros avec des items de fusion

### Pages à créer
- [ ] Section dans /client/aide/gaming#heros-sponsors
- [ ] Grille visuelle des raretés avec couleurs
- [ ] Exemple d'un héros (fiche : stats, capacités, comment l'obtenir)

---

## 5. LE LOOT & RÉCOMPENSES

### Concept
- [ ] **Drop de loot** : À la fin d'un raid gagné, chaque participant ouvre un coffre virtuel
- [ ] **Contenu possible** :
  - Énergie (100 → 10 000 pts selon rareté)
  - Réductions voyage (5% → 30%)
  - Nuits d'hôtel offertes
  - Héros (voir ci-dessus)
  - Items de fusion pour améliorer un héros
  - Titres exclusifs ("Le Conquistador", "Légende du Maroc"...)
  - Codes promo sponsors
- [ ] **Probabilités** :
  - Commun : 60%
  - Peu commun : 25%
  - Rare : 10%
  - Épique : 4%
  - Légendaire : 1%
- [ ] **Coffre animé** : ouverture avec effet Framer Motion (tremblement → explosion de lumière → révélation)
- [ ] **Historique du loot** : page /client/jeux/inventaire ou section wallet

### Pages à créer
- [ ] Section dans /client/aide/gaming#loot-recompenses
- [ ] Tableau des probabilités visuel (barres colorées)
- [ ] Animation d'ouverture de coffre (stub visuel dans le guide)

---

## 6. L'ÉNERGIE EN MODE GAMING

### Concept
- [ ] **Mode Jeux vs Mode Voyage** :
  - Mode Jeux : l'Énergie est utilisée pour JOUER (attaquer dans les raids, invoquer des héros)
  - Mode Voyage : l'Énergie est convertie en réduction sur la prochaine réservation
  - Le switch entre les modes est dans /client/energie
- [ ] **Énergie dépensée en gaming** :
  - Invoquer un héros Commun : 100 Énergie
  - Invoquer un héros Rare : 500 Énergie
  - Ouvrir un coffre Épique : 1 000 Énergie
  - Participer à un raid Légendaire : 200 Énergie
- [ ] **Énergie gagnée en gaming** :
  - Victoire de raid Normal : 200-500 Énergie
  - Victoire Héroïque : 500-1500 Énergie
  - Victoire Mythique : 1500-5000 Énergie
  - First Kill du boss : bonus ×2

### Pages à créer
- [ ] Section dans /client/aide/gaming#energy-gaming
- [ ] Tableau : dépenses vs gains par type de raid
- [ ] Lien vers /client/aide/energie

---

## 7. LES CLASSEMENTS

### Concept
- [ ] **Classement individuel** : top joueurs par Énergie gagnée / boss vaincus / raids participés
- [ ] **Classement guildes** : top guildes par victoires collectives
- [ ] **Classement sponsors** : héros les plus invoqués (visibilité pour les sponsors)
- [ ] **Resets** : mensuel, avec récompenses pour le top 3 (Énergie, badges, items exclusifs)
- [ ] **Palmarès** : historique des champions des mois passés

### Pages à créer
- [ ] Section dans /client/aide/gaming#classements
- [ ] Lien vers /client/classement (page existante)

---

## 8. COMPOSANTS GAMING (UI)

### À créer
- [ ] **`<RarityBadge>`** : affiche la rareté avec couleur + label (⚪ Commun, 🔴 Exclusif...)
- [ ] **`<HeroCard>`** : carte héros avec image, nom, rareté, stats, sponsor logo
- [ ] **`<RaidTimer>`** : countdown temps restant pour un raid (animé)
- [ ] **`<LootChest>`** : animation ouverture de coffre (Framer Motion)
- [ ] **`<DamageBar>`** : barre PV du boss (rouge qui diminue)
- [ ] **`<GuildBadge>`** : emblème et nom de guilde
- [ ] **`<GamingTooltip>`** : infobulle contextuelle pour chaque terme gaming

### Intégration tooltips dans les pages existantes
- [ ] Page /client/jeux : tooltip sur chaque mécanique (raid, guilde, héros)
- [ ] Page /client/energie : tooltip "Mode Jeux" vs "Mode Voyage"
- [ ] Page /client/gamification : tooltip sur chaque hub card

---

## 9. FAQ GAMING

### Questions fréquentes à créer
- [ ] Est-ce que je peux jouer sans payer ?
- [ ] Mes héros sont-ils perdus si je change de niveau ?
- [ ] Que se passe-t-il si le raid n'est pas vaincu ?
- [ ] Puis-je vendre ou échanger mes items ?
- [ ] Le gaming est-il disponible sur mobile ?
- [ ] Comment créer mon personnage ?
- [ ] Combien de guildes peut-on rejoindre ?
- [ ] Les sponsors peuvent-ils voir mes stats de jeu ?

---

## PRIORITÉS

| Priorité | Item |
|----------|------|
| P0 | Page /client/aide/gaming (guide complet) |
| P0 | Explications raids, guildes, héros, loot |
| P1 | RarityBadge + HeroCard composants |
| P1 | FAQ Gaming (9 questions) |
| P2 | GamingTooltip intégré sur pages existantes |
| P2 | LootChest animation |
| P3 | RaidTimer, DamageBar composants |
| P3 | Classement sponsors |

---

## DESIGN

- Background : `bg-[#0A0E14]`
- Commun : `#9ca3af` (gris)
- Peu commun : `#34d399` (vert)
- Rare : `#60a5fa` (bleu)
- Épique : `#a78bfa` (violet)
- Légendaire : `#D4A853` (or Eventy)
- Exclusif Sponsor : `#f472b6` (rose)
- Boss HP bar : `from-red-600 to-red-400`
- Coffre : animation scale + glow or au reveal
- Framer Motion : `layoutId` pour transitions de carte héros
