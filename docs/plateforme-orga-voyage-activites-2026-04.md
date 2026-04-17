# Eventy — Plateforme d'organisation de voyage & activités entre amis

> **Date** : 2026-04-16 · **Auteur** : IA PDG (session claude/cool-boyd) · **Statut** : Livraison v1 — scaffolding production-ready
>
> Document fondateur du pivot produit : Eventy devient **LA plateforme** d'organisation d'événements, de voyages et d'activités entre amis — avec Eventy comme moteur de catalogue et monétisation.

---

## 1. Vision David

> « Il faut qu'on devienne la plateforme d'organisation de voyage entre amis et activité. »
> « Les Tribus ne sont pas juste des listes d'amis. Ce sont des HUBS D'ORGANISATION D'ÉVÉNEMENTS. »
> « Ça va aller avec la gamification après. »

### Positionnement

Eventy = **WhatsApp + Doodle + Splitwise + TripAdvisor + Notion**, focalisé sur les moments partagés, avec un catalogue de voyages/activités intégré qui convertit naturellement l'organisation en réservation.

### Promesse utilisateur

> **« Tout ce qu'il faut pour préparer, vivre et ranger un souvenir ensemble — en un seul endroit. »**

---

## 2. Architecture produit

### 2.1 Tribus — hubs d'organisation d'événements

Une **Tribu** n'est plus une simple liste d'amis. C'est un hub permanent avec :

| Domaine | Contenu |
|---------|---------|
| **Identité** | Nom, photo, couleur signature, devise, bio, membres |
| **Rôles** | Chef de Tribu (admin), Organisateur (crée événements), Membre, Invité |
| **Règles** | Qui peut inviter, modération, paiement par défaut, confidentialité |
| **Historique** | Timeline de tous les événements passés (voyages + activités) |
| **Stats** | km parcourus, pays visités, activités faites, montant total, photos |
| **Chat permanent** | Conversation continue + annonces épinglées + réactions + sondages rapides |
| **Événements** | Mini-projets (voyage, soirée, week-end, anniversaire, séminaire, road trip) |
| **Brainstorm** | Mode "on part où cet été ?" avec votes |
| **Connexion catalogue** | Suggestions IA voyages + activités Eventy adaptées à la Tribu |
| **Profil public** | Feature flag — page publique avec badges Tribu |

### 2.2 Événements Tribu — le cœur de l'innovation

Chaque événement créé dans une Tribu est un **mini-projet** :

- Date + lieu + budget
- Invitations (membres Tribu + externes)
- Planning collaboratif (votes, Doodle intégré)
- Budget partagé avec cagnotte + split intelligent
- Checklist de préparation (assignations)
- Chat dédié à l'événement
- Documents partagés (PDF, billets, confirmations)
- Carte interactive des lieux
- Météo J-7 automatique
- Reminders J-30, J-7, J-1
- Galerie photos
- Bilan post-événement ("refaire ?")

### 2.3 Templates d'événements

- 🏖️ Week-end entre potes
- 🎂 Anniversaire surprise
- 🏢 Team building / séminaire
- 🚗 Road trip
- ✈️ Voyage Eventy (catalogue)
- 🎉 Soirée / after-work
- 🏃 Activité sportive récurrente
- 🧘 Retraite bien-être

### 2.4 Groupes d'activités — 4 types

| Type | Exemple | Création |
|------|---------|----------|
| **Activité ponctuelle** | "Escape game samedi à 5" | 2 clics |
| **Activité récurrente** | "Sport tous les jeudis" | 2 clics + fréquence |
| **Sous-groupe voyage** | "Qui veut le quad demain ?" | Depuis événement voyage |
| **Brainstorm voyage** | "On part où cet été ?" | Depuis Tribu, mode brainstorm |

---

## 3. Portail Client — nouvelles routes

### 3.1 Hub `/client/organiser/`

**Tab principal de la navigation** (icon 🗂️). Page d'accueil avec 6 outils de préparation :

| Outil | Route | Fonction |
|-------|-------|----------|
| **Planificateur voyage** | `/client/organiser/planificateur` | Timeline partagée, votes, responsabilités, checklist, reminders |
| **Budget partagé / Cagnotte** | `/client/organiser/budget` | Contributions, split intelligent, export PDF |
| **Valise intelligente** | `/client/organiser/valise` | Checklist adaptée destination/météo, partageable |
| **Mood board** | `/client/organiser/mood-board` | Board Pinterest-like, vote, transformable en vrai voyage 1-click |
| **Carnet de voyage** | `/client/organiser/carnet` | Pendant + après = livre souvenir auto-généré |
| **Calendrier groupe** | `/client/organiser/calendrier` | Doodle-like, trouve date commune |

### 3.2 Tribus `/client/tribus/`

- Liste des Tribus de l'utilisateur avec stats
- Création de Tribu (2 clics)
- Chaque Tribu = page hub avec 6 onglets : Accueil · Événements · Chat · Membres · Stats · Paramètres

### 3.3 Catalogue activités `/client/activites/`

- Découverte d'activités locales & voyages Eventy
- Filtres : type, date, lieu, budget, avec qui
- CTA : "Proposer à ma Tribu"

### 3.4 Sidebar client — nouvelle structure

```
Principal
├─ Tableau de bord
├─ Mes voyages
└─ Organiser 🗂️   ← NOUVEAU

Social
├─ Mes Tribus    ← Enrichi (ex-Mes groupes)
├─ Activités 🎯   ← NOUVEAU
├─ Réseau social
├─ Mes amis
├─ Messagerie
├─ Favoris
├─ Cookies 🍪
├─ Hauts Faits
└─ Classement

Finance
├─ Mon wallet
├─ Rays ☀️
├─ Paiements
└─ Assurance

Compte
├─ Documents
├─ Mon profil
├─ Notifications
└─ Support
```

---

## 4. Portail Admin — Contrôle équipe

### 4.1 `/admin/tribus/`

- Liste toutes les Tribus actives
- KPIs : nb Tribus, taille moyenne, événements/mois, conversion voyage, engagement
- Modération (si contenu public activé)
- Suggestions IA pour Pôle Commercial (Tribus actives sans réservation récente → relance)

### 4.2 `/admin/groupes-activites/`

- Liste tous les groupes d'activités (ponctuels, récurrents, sous-groupes, brainstorm)
- KPIs par type
- Détection signaux faibles (groupe discute → opportunité commerciale)
- Suggestions IA de conversion (brainstorm voyage → recommandation catalogue)

---

## 5. Design system

### 5.1 Palette

Respect de la règle WCAG AA (dernier commit `2daa65e fix(audit): passe contraste WCAG AA — bg-white bannis`) :
- Dark HUD theme (fond `var(--hud-bg)`)
- Accent primary : terra/orange (`#ff906a` → `#f7652f`)
- **Jamais** de `bg-white` pur (invisible sur dark)
- Mapping legacy `--cream` / `--terra` via CSS vars dans `client.css`

### 5.2 Composants existants réutilisés

- `.client-card` — card glass
- `.client-kpi-card` — KPIs stylisés
- `.client-btn-primary` / `.client-btn-ghost`
- `.client-badge-*` — badges colorés par statut
- `.client-action-card` — cartes d'action (hub organiser)
- `.client-fab` + `.client-fab-menu` — action flottante
- `.chat-bubble-*` — messagerie

### 5.3 Animations

Framer Motion pour :
- Transitions d'entrée (staggerChildren)
- Hover cards (tilt subtle)
- Timeline événements (dessin progressif)
- Board mood (drag & drop)
- Chat reactions (pop emoji)

---

## 6. Gamification (préparée, flags OFF)

Code en place, feature flags désactivés par défaut :

- **XP par action** (créer Tribu, lancer événement, payer cagnotte, partager photo…)
- **Badges** (Chef de Tribu, Organisateur de l'année, Globe-trotters…)
- **Classement Tribus** (km, pays, activités, engagement)
- **Défis groupe** (monter une Tribu à 10, organiser 3 événements/trim…)
- **Récompenses collectives** (la Tribu gagne des Rays)

Flags :
- `flag.tribus.gamification.xp`
- `flag.tribus.gamification.badges`
- `flag.tribus.gamification.classement`
- `flag.tribus.gamification.defis`
- `flag.tribus.profil_public`

---

## 7. Data model (évolutions frontend)

Les modèles backend restent inchangés dans cette phase. Les enrichissements sont portés par les types frontend + mock data, puis migreront vers Prisma quand validés par David.

### Types partagés

```ts
type TribuRole = 'chef' | 'organisateur' | 'membre' | 'invite';

type EvenementType =
  | 'voyage_eventy' | 'week_end' | 'anniversaire'
  | 'team_building' | 'road_trip' | 'soiree'
  | 'activite_sportive' | 'retraite';

type EvenementStatus = 'brouillon' | 'planification' | 'confirme' | 'en_cours' | 'termine' | 'annule';

interface Tribu {
  id: string;
  name: string;
  color: string;       // terra, sky, forest, sun, plum, ocean
  emoji: string;
  devise?: string;
  bio?: string;
  coverImage?: string;
  createdAt: string;
  stats: {
    membersCount: number;
    eventsCount: number;
    kmTraveled: number;
    countriesVisited: number;
    totalSpent: number;
    photosShared: number;
  };
  settings: {
    invitePolicy: 'chef_only' | 'organizers' | 'members';
    defaultPaymentMode: 'individual' | 'pot' | 'split';
    moderation: boolean;
    publicProfile: boolean;
  };
  badges: string[];
}

interface Evenement {
  id: string;
  tribuId: string;
  type: EvenementType;
  status: EvenementStatus;
  title: string;
  emoji: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  budget?: number;
  invitedCount: number;
  confirmedCount: number;
  checklist: EvenementTask[];
  chatLastMessage?: string;
  polls: Poll[];
  documents: Document[];
  gallery: Photo[];
  linkedTravelId?: string;     // si voyage Eventy catalogue
  linkedActivityId?: string;   // si activité du catalogue
}
```

---

## 8. Livrables techniques — session cool-boyd

### Pages créées (15+)

**Client** :
- `app/(client)/client/organiser/page.tsx` (hub)
- `app/(client)/client/organiser/planificateur/page.tsx`
- `app/(client)/client/organiser/budget/page.tsx`
- `app/(client)/client/organiser/valise/page.tsx`
- `app/(client)/client/organiser/mood-board/page.tsx`
- `app/(client)/client/organiser/carnet/page.tsx`
- `app/(client)/client/organiser/calendrier/page.tsx`
- `app/(client)/client/tribus/page.tsx`
- `app/(client)/client/tribus/[id]/page.tsx`
- `app/(client)/client/tribus/creer/page.tsx`
- `app/(client)/client/activites/page.tsx`

**Admin** :
- `app/(admin)/admin/tribus/page.tsx`
- `app/(admin)/admin/groupes-activites/page.tsx`

### Données mock

- 5 Tribus avec historique riche
- 12+ événements passés et futurs
- Chat actif, budget partagé en cours
- Mood boards avec images Unsplash
- Badges et stats

### Modifs infra

- `app/(client)/client/layout.tsx` — nav enrichie ("Organiser 🗂️", "Mes Tribus", "Activités 🎯")

---

## 9. Roadmap post-livraison

### Phase V2 (M+1)
- Branchement backend réel (création Tribu, événements, polls)
- Notifications push reminders J-30/J-7/J-1
- Export PDF du carnet de voyage (livre souvenir)
- OCR reçus pour cagnotte auto

### Phase V3 (M+3)
- Profil public Tribu + classement
- Feed découverte Tribus (avec opt-in RGPD)
- Marketplace d'activités tierces (Airbnb Experience-like)
- IA : recommandation automatique "Voyage qui plairait à ta Tribu"

### Phase V4 (M+6)
- Gamification live (flags ON progressivement)
- API B2B pour CE/Asso : Tribu d'entreprise
- Applications mobiles natives

---

## 10. Métriques de succès

| KPI | M+1 | M+3 | M+6 |
|-----|-----|-----|-----|
| Tribus créées | 500 | 3 000 | 15 000 |
| Événements créés | 1 500 | 12 000 | 80 000 |
| % événements → voyage Eventy payant | 3 % | 6 % | 10 % |
| MAU utilisateurs Tribus | 40 % du total | 55 % | 70 % |
| Engagement chat (messages/semaine/Tribu) | 15 | 40 | 80 |

---

## 11. Âme Eventy

> Chaque Tribu, chaque événement, chaque photo partagée **doit faire sentir l'amour** que David met dans le projet. Le bouton "Créer un événement" n'est pas un CTA corporate — c'est une invitation à faire vivre un moment. Le ton reste chaleureux, direct, tutoyant quand naturel. On ne dit pas "Soumettre" mais "C'est parti !". On ne dit pas "Gérer les membres" mais "Inviter ta bande".

> **Le client doit se sentir aimé.** — Âme Eventy

---

*Doc maître — session claude/cool-boyd — 2026-04-16*
