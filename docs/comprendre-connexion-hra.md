# Comprendre la Connexion HRA — Guide Employés Maison

**Version** : 2.0 — 2026-04-13
**Pour** : David (PDG) + Responsables Maisons + Employés

---

## Qu'est-ce qu'une "Maison" Eventy ?

Une **Maison Eventy** est un établissement partenaire (hôtel, restaurant, activité, transport...) qui fournit des prestations aux voyageurs des groupes Eventy. Ce n'est PAS un employé salarié d'Eventy — c'est un **partenaire indépendant** avec son propre compte pro.

---

## 1. Comment s'inscrire en tant que Maison

### Option A : Invitation par Eventy (Onboarding guidé)
1. L'admin Eventy envoie un **magic link** par email
2. Le partenaire clique sur le lien → formulaire pré-rempli
3. Il complète son profil (nom, adresse, SIRET, IBAN, classement, équipements)
4. Soumission → statut **PENDING**
5. Validation par le Pôle Maisons Eventy (IA propose, humain valide)
6. Accès au portail Maison

**URL** : `/partenaire/onboarding/hotel/[token]` ou `/partenaire/onboarding/restaurant/[token]`

### Option B : Inscription self-service (Nouveau)
1. Le partenaire va sur `/maisons/inscription`
2. Formulaire en 5 étapes :
   - **Étape 1** : Type de Maison (hébergement, restauration, activités...)
   - **Étape 2** : Infos établissement (nom, SIRET, adresse, description, email)
   - **Étape 3** : Catalogue (chambres ou description d'offre)
   - **Étape 4** : Tarifs et conditions (prix base, annulation, délai réponse)
   - **Étape 5** : CGV + RGPD + soumission
3. Statut → **EN_ATTENTE_VALIDATION**
4. L'IA analyse le profil
5. Le Pôle Maisons valide manuellement
6. Email de bienvenue + accès portail

---

## 2. Comment les employés se connectent

### Rôles disponibles

| Rôle | Qui | Permissions |
|------|-----|-------------|
| **Admin Maison** | Propriétaire / Directeur | Tout voir, modifier profil, gérer employés, accepter/refuser missions, voir finance, configurer |
| **Gérant** | Responsable opérationnel | KPIs, finance, missions, calendrier, exports |
| **Réceptionniste** | Accueil / Front desk | Missions, rooming, checklists, calendrier, manifeste voyageurs |
| **Chef** | Chef de cuisine / Restauration | Missions restauration, menus, allergies/régimes, commandes |
| **Personnel** | Employé standard | Missions assignées, checklists, calendrier |

### Processus de connexion

1. L'Admin Maison va sur `/maisons/equipe`
2. Clique "Inviter un employé" → saisit prénom, nom, email, rôle
3. L'employé reçoit un email d'invitation
4. Il crée son compte (email + mot de passe)
5. Son compte est automatiquement rattaché à la Maison avec le rôle choisi
6. Il peut se connecter et voir uniquement ce que son rôle autorise

---

## 3. Comment le rooming se calcule

### Algorithme automatique (`lib/rooming/auto-assign.ts`)

L'algorithme suit ces étapes :

#### Étape 1 : Groupement des voyageurs
- **Couples** : regroupés par `groupId` → paire de 2
- **Familles** : regroupés par `groupId` → taille variable (2-6+)
- **Solos** : appairés par compatibilité (PMR ensemble, calme ensemble)

#### Étape 2 : Tri par priorité
1. Voyageurs PMR (accessibilité) → traités en premier
2. Couples → assignés en DOUBLE/SUITE
3. Familles → assignées en FAMILY/TRIPLE/QUADRUPLE
4. Solos → appairés en TWIN ou seuls en SINGLE

#### Étape 3 : Scoring des chambres
Pour chaque groupe, chaque chambre disponible reçoit un score :

| Critère | Points |
|---------|--------|
| Base | +100 |
| PMR nécessaire mais chambre non accessible | -50 |
| PMR dans chambre accessible | +30 |
| Calme désiré mais chambre bruyante | -20 |
| Calme dans chambre calme | +15 |
| Non-fumeur dans chambre fumeur | -40 |
| Type de chambre correspondant | +20 / +30 |
| Place vide dans la chambre | -5 par place |
| Couple en DOUBLE/SUITE | +40 |
| Capacité dépassée | -1000 (invalide) |

#### Étape 4 : Assignation
La chambre avec le meilleur score est choisie pour chaque groupe.

#### Exemple
**12 voyageurs** : 2 couples, 1 famille de 4, 3 solos (dont 1 PMR)

| Groupe | Chambre assignée | Score |
|--------|-----------------|-------|
| Couple Dupont | Chambre 101 (DOUBLE) | 140 |
| Couple Martin (calme) | Chambre 102 (DOUBLE, calme) | 155 |
| Famille Lefebvre (4 pers.) | Chambre 103 (FAMILY) | 130 |
| Solo PMR Julie Roche | Chambre 202 (SINGLE, accessible) | 145 |
| Solos Igor + Kevin | Chambre 201 (TWIN) | 100 |

**Résultat** : 11/11 assignés, 0 non assignés, score moyen 134

---

## 4. Flux complet : de la demande au paiement

```
[1. CRÉATEUR]                    [2. MAISON]                    [3. EVENTY]
     |                                |                              |
     |── Sélectionne Maison ─────────►|                              |
     |   dans son voyage              |                              |
     |                                |                              |
     |                           Reçoit demande                      |
     |                           (statut: EN_ATTENTE)                |
     |                                |                              |
     |                           ┌─ Accepte ─┐                      |
     |                           │  ou       │                      |
     |                           └─ Refuse ──┘                      |
     |                                |                              |
     |◄── Notification ──────────────|                              |
     |    (accepté/refusé)           |                              |
     |                                |                              |
     |                           Checklist préparation               |
     |                           (statut: EN_PREPARATION)            |
     |                                |                              |
     |                           ☑️ Chambres confirmées              |
     |                           ☑️ Menus validés                    |
     |                           ☑️ Rooming transmis                 |
     |                           ☑️ Accueil VIP préparé              |
     |                                |                              |
     |                           Tout coché →                        |
     |                           (statut: PRÊT)                      |
     |                                |                              |
     |◄── Notification ──────────────|                              |
     |    "Maison prête"             |                              |
     |                                |                              |
     |     === VOYAGE EN COURS ===   |                              |
     |                                |                              |
     |                                |── Meal Declarations ────────►|
     |                                |   (petit-déj, déjeuner,     |
     |                                |    dîner servis)             |
     |                                |                              |
     |     === POST-VOYAGE ===       |                              |
     |                                |                              |
     |                                |◄── Facturation + Paiement ──|
     |                                |    NET30 via Stripe Connect  |
     |                                |    (commission Eventy déduite)|
     |                                |                              |
     |◄── Voyageurs notent ──────────|                              |
     |    la Maison (1-5★)           |                              |
```

---

## 5. Pages disponibles

### Portail Maison (`/maisons/`)

| Page | URL | Description |
|------|-----|-------------|
| Hébergement | `/maisons/hebergement` | Blocs hôtel + partenaires hébergement |
| Restauration | `/maisons/restauration` | Missions restauration + partenaires |
| Activités | `/maisons/activites` | Missions activités + partenaires |
| Transport | `/maisons/transport` | Transport de luxe |
| Image & Souvenirs | `/maisons/image-souvenirs` | Photo, vidéo, drone |
| Décoration | `/maisons/decoration` | Décoration événementielle |
| Coordination | `/maisons/coordination` | Conciergerie VIP |
| Sécurité | `/maisons/securite` | Sécurité rapprochée |
| **Équipe** | `/maisons/equipe` | Gestion sous-comptes employés |
| **Configuration** | `/maisons/configuration` | Chambres, tarifs, blackout, prestations |
| **Inscription** | `/maisons/inscription` | Inscription self-service (5 étapes) |

### Admin HRA (`/admin/hra/`)

| Page | Description |
|------|-------------|
| Dashboard HRA | Vue globale partenaires |
| Onboarding | Validation nouvelles Maisons |
| Rate Cards | Grilles tarifaires négociées |
| Négociations | Historique négociations prix |
| Cascade HRA | Configuration marges |

### Rooming

| Page | Description |
|------|-------------|
| Admin `/admin/rooming/` | Vue globale rooming |
| Pro `/pro/voyages/[id]/rooming/` | Rooming par voyage (Créateur) |
| Client `/client/reservations/[id]/rooming/` | Vue rooming voyageur |

---

## 6. FAQ Employés

**Q: Comment je me connecte ?**
R: Votre Admin Maison vous invite par email. Créez votre compte avec cet email.

**Q: Je ne vois pas toutes les pages ?**
R: C'est normal — chaque rôle a des permissions limitées. Demandez à votre Admin Maison si vous avez besoin d'accès supplémentaires.

**Q: Comment accepter une mission ?**
R: Allez dans `/maisons/hebergement` (ou activités/restauration), trouvez la mission EN_ATTENTE, cliquez "Accepter".

**Q: Comment indiquer que je ne suis pas disponible ?**
R: Allez dans `/maisons/configuration` → onglet "Disponibilité" → ajoutez vos blackout dates.

**Q: Quand suis-je payé ?**
R: NET30 après le départ du voyage, par virement Stripe Connect. La commission Eventy (15-25%) est déduite automatiquement.

**Q: Comment modifier mes tarifs ?**
R: `/maisons/configuration` → onglet "Chambres" → modifiez les prix base et haute saison.
