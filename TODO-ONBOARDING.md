# TODO — Onboarding Client & Première Visite
> Le client doit comprendre Eventy en moins de 2 minutes, sans effort.
> Créé le 2026-04-25

---

## VISION

L'onboarding client est le moment le plus important. C'est là qu'on gagne ou perd quelqu'un. Il doit être :
- **Court** : 4-5 étapes max, pas de texte à lire
- **Visuel** : illustrations, animations Framer Motion
- **Contextuel** : montrer les vraies fonctionnalités, pas des slides génériques
- **Optionnel** : toujours une option "Passer" visible

---

## 1. WELCOME TOUR — Premier login client

### 1.1 Déclenchement
- [ ] Condition : `user.onboardingCompleted === false` (stocké en DB)
- [ ] Aussi déclenchable via "Revoir le guide" dans les paramètres compte
- [ ] Mobile-first : fonctionne parfaitement sur téléphone

### 1.2 Structure — 5 étapes

**Étape 1 — Bienvenue**
- [ ] Illustration animée : logo Eventy + étoiles/confettis
- [ ] Titre : "Bienvenue dans Eventy, [Prénom] !"
- [ ] Sous-titre : "Le voyage de groupe où tu n'as rien à gérer, tout à vivre"
- [ ] CTA : "Commençons →"

**Étape 2 — Découvrir les voyages**
- [ ] Animation : carte avec destinations qui apparaissent
- [ ] "Browse 50+ destinations. Réserve en 3 clics."
- [ ] Mini-preview d'une fiche voyage (image, titre, prix, dates)
- [ ] CTA : "Je vois →"

**Étape 3 — L'Énergie Eventy**
- [ ] Animation : barre de progression qui se remplit en or
- [ ] "Gagne des points à chaque action. Utilise-les pour voyager."
- [ ] 3 icônes animées : Jeux → Points → Voyage
- [ ] CTA : "Cool →"

**Étape 4 — Le Gaming**
- [ ] Animation : personnage/héros qui apparaît
- [ ] "Rejoins des raids, invoque des héros, gagne des récompenses."
- [ ] Teaser visuel d'un boss/raid
- [ ] CTA : "J'essaie →"

**Étape 5 — C'est parti !**
- [ ] Confettis dorés
- [ ] "Tu es prêt(e). Où veux-tu commencer ?"
- [ ] 3 boutons : "Explorer les voyages" / "Voir mon Énergie" / "Jouer"
- [ ] Marquer `onboardingCompleted = true` en DB

### 1.3 Navigation
- [ ] Barre de progression en haut (5 tirets, or = complété)
- [ ] Bouton "Passer" discret en haut à droite (toujours visible)
- [ ] Flèches précédent/suivant
- [ ] Swipe gauche/droite sur mobile

---

## 2. GUIDE "COMMENT ÇA MARCHE" INTERACTIF — /client/guide

### 2.1 Améliorations de la page existante (/comment-ca-marche)
La page publique existe mais n'est pas interactive. La version client doit être plus riche.

- [ ] **Tabs** : Voyages / Énergie / Gaming (3 guides distincts dans la même page)
- [ ] **Animations** Framer Motion : chaque étape slide-in au scroll
- [ ] **Visuels mockups** : screenshots de vraies pages avec hotspots cliquables
- [ ] **Vidéo courte** (60s) embarquée — placeholder pour l'instant

### 2.2 Section Voyages (4 étapes)
- [ ] Étape 1 : Chercher (filtres, carte, catalogue)
- [ ] Étape 2 : Réserver (fiche voyage, options, chambre, paiement)
- [ ] Étape 3 : Préparer (documents, point de ramassage, WhatsApp groupe)
- [ ] Étape 4 : Vivre (accompagnateur, programme, souvenirs)

### 2.3 Section Énergie (4 étapes)
- [ ] Étape 1 : Gagner (jeux, codes, parrainage, achats)
- [ ] Étape 2 : Cumuler (paliers, avantages croissants)
- [ ] Étape 3 : Choisir (Mode Jeux OU Mode Voyage)
- [ ] Étape 4 : Utiliser (déduction sur voyage, gifting)

### 2.4 Section Gaming (4 étapes)
- [ ] Étape 1 : Créer son personnage / rejoindre
- [ ] Étape 2 : Rejoindre une guilde
- [ ] Étape 3 : Participer aux raids/boss
- [ ] Étape 4 : Gagner du loot & des récompenses

---

## 3. TOOLTIPS PREMIER PASSAGE — OnboardingTooltip

### 3.1 Composant à créer : `<OnboardingTooltip>`
- [ ] Props : `id`, `title`, `content`, `position`, `step`, `totalSteps`
- [ ] Overlay semi-transparent (bg-black/50)
- [ ] Spotlight autour de l'élément ciblé (box-shadow ring)
- [ ] Tooltip flèche pointant vers l'élément
- [ ] Boutons : ← Précédent | Suivant → | Passer (discret)
- [ ] Animation slide-in Framer Motion
- [ ] Stockage progression : `localStorage.setItem('tooltipStep_X', 'done')`

### 3.2 Pages à équiper de tooltips
- [ ] **Dashboard client** (5 tooltips) :
  - T1 : "Voici ton solde Énergie"
  - T2 : "Tes voyages réservés"
  - T3 : "Ton niveau Gaming"
  - T4 : "Les défis du jour"
  - T5 : "Ton classement"
- [ ] **Page Énergie** (4 tooltips) :
  - T1 : "Ton solde actuel"
  - T2 : "Ton palier — avance pour débloquer plus"
  - T3 : "Les sources : comment gagner plus"
  - T4 : "Mode Jeux vs Mode Voyage"
- [ ] **Page Gaming/Jeux** (4 tooltips) :
  - T1 : "Ton personnage"
  - T2 : "Les raids actifs"
  - T3 : "Ta guilde"
  - T4 : "Le loot disponible"

---

## 4. TUTORIELS PAS À PAS — /client/aide/tutoriels

### 4.1 Liste des tutoriels
- [ ] **Tuto 1 : Faire ma première réservation** (6 étapes)
- [ ] **Tuto 2 : Gagner mon premier badge** (4 étapes)
- [ ] **Tuto 3 : Rejoindre un raid** (5 étapes)
- [ ] **Tuto 4 : Utiliser mon Énergie pour voyager** (4 étapes)
- [ ] **Tuto 5 : Parrainer un ami** (3 étapes)
- [ ] **Tuto 6 : Scanner un code créateur** (3 étapes)

### 4.2 Structure d'un tutoriel
- [ ] Barre de progression en haut (X/Y étapes)
- [ ] Chaque étape : illustration + texte court + action à faire
- [ ] Validation de l'étape (clic sur bouton ou interaction simulée)
- [ ] Récompense à la fin : badge + Énergie bonus

---

## 5. VIDÉO DE PRÉSENTATION

- [ ] Embed YouTube/Vimeo sur /client/guide et /client/aide
- [ ] Durée cible : 60-90 secondes
- [ ] Contenu : montre une réservation de A à Z
- [ ] Thumbnail : image Eventy attractive
- [ ] Autoplay désactivé, contrôles visibles

---

## PRIORITÉS

| Priorité | Item |
|----------|------|
| P0 | Welcome Tour 5 étapes (premier login) |
| P0 | Composant OnboardingTooltip |
| P1 | Guide interactif /client/guide (tabs Voyages/Énergie/Gaming) |
| P1 | Tooltips Dashboard client (5 points) |
| P2 | Tutoriels pas à pas (6 tutoriels) |
| P2 | Tooltips Page Énergie + Gaming |
| P3 | Vidéo de présentation embedée |
| P3 | Swipe mobile Welcome Tour |

---

## DESIGN

- Overlay : `bg-black/60 backdrop-blur-sm`
- Spotlight : `box-shadow: 0 0 0 9999px rgba(0,0,0,0.7)`
- Tooltip bg : `bg-[#0D1117] border border-[#D4A853]/40`
- Titre : `text-[#D4A853] font-bold`
- Progress : tirets or pour complété, gris pour à venir
- Bouton CTA : `bg-[#D4A853] text-[#0A0E14] font-bold`
- Animations : Framer Motion `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
