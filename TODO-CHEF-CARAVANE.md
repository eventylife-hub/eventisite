# TODO — Rôle Meneur de Caravane
*Créé : 2026-04-25*

## Concept

Le Meneur de Caravane est un **rôle communautaire puissant**, à mi-chemin entre Guild Master (jeu vidéo) et animateur communautaire (IRL). C'est un levier business clé pour Eventy : les meilleurs Meneurs animent des communautés de 100-200 voyageurs.

### Inspiration
- World of Warcraft : Guild Master + officiers
- Discord : Admin serveur + modérateurs
- Twitch : Streamer qui anime sa communauté
- **Eventy** : Meneur qui organise des raids = des voyages collectifs

---

## Pouvoirs du Meneur

### Gestion de la caravane
- [ ] Modifier le nom, l'emblème, la devise, la description
- [ ] Gérer les membres : accepter/refuser les demandes
- [ ] Promouvoir des Officiers (jusqu'à 5 max)
- [ ] Exclure un membre de la caravane
- [ ] Ouvrir / fermer les candidatures
- [ ] Modifier la capacité max (selon le niveau caravane)

### Organisation raids
- [ ] Lancer un raid (choisir boss, composer équipe, définir stratégie)
- [ ] Planifier un raid à l'avance (calendrier)
- [ ] Annuler un raid en cours (pénalité XP si >50% du temps écoulé)
- [ ] Définir les règles de loot (rotation, priorité rôle, aléatoire)

### Animation communautaire
- [ ] Épingler des messages dans le chat caravane
- [ ] Créer des événements caravane (hors raid : quiz, soirées, etc.)
- [ ] Attribuer des titres honorifiques aux membres
- [ ] Mettre en avant des membres du mois

### Statistiques avancées
- [ ] Dashboard Meneur : activité membres, XP apporté, présence aux raids
- [ ] Identifier les membres inactifs (>30 jours)
- [ ] Voir le taux de participation aux raids

---

## Devenir Meneur

### Prérequis (à valider)
- [ ] Niveau personnel ≥ 10
- [ ] Au moins 1 raid complété
- [ ] Compte vérifié Eventy (email + téléphone)
- [ ] Pas déjà Meneur d'une autre caravane

### Processus
1. L'utilisateur crée une caravane → devient automatiquement Meneur
2. Ou : le Meneur actuel cède la direction (transfert de leadership)
3. Ou : la caravane est sans Meneur depuis 30j → vote interne des officiers

---

## Meneur Pro (futur)

Vision : certains Meneurs deviennent des **animateurs professionnels** pour Eventy.

### Critères Meneur Pro
- Caravane niv. 20+
- 100+ membres actifs
- 80%+ de participation aux raids sur 3 mois
- Note communauté ≥ 4.5/5

### Avantages Meneur Pro
- Badge ✓ vérifié sur le profil
- Commission sur les voyages achetés par sa caravane (% à définir)
- Accès anticipé aux nouveaux boss
- Ligne directe avec l'équipe Eventy
- Invitation aux événements IRL Eventy
- Potentiel : contrat d'animateur freelance

### Mécanisme de rémunération (étude)
- Chaque membre de la caravane qui réserve un voyage via Eventy → small % au Meneur Pro
- Modèle partenaire, pas salarié (cohérent avec l'ADN Eventy indépendants)
- Cap mensuel à définir

---

## Officiers

- Max 5 officiers par caravane
- Rôle attribué par le Meneur
- Pouvoirs : accepter candidatures, modérer le chat, co-animer les raids
- Pas de pouvoirs sur la structure (pas de kick, pas de transfert)

---

## Interface Meneur (pages à créer)

- [ ] `/jeux/caravanes/[id]/gestion` — panneau admin complet
  - Onglet Membres (liste, rôles, activité)
  - Onglet Raids (historique, planification)
  - Onglet Stats (dashboard)
  - Onglet Paramètres (modifier caravane)
- [ ] Notification système : "Tu as une demande d'adhésion à ta caravane"
- [ ] Email récap hebdo Meneur : activité caravane de la semaine

---

## Gamification du rôle Meneur

- Badge "Fondateur" : créer une caravane
- Badge "Meneur Actif" : 3 mois d'activité consécutive
- Badge "Conquérant" : 10 raids gagnés
- Badge "Rassembleur" : 100 membres dans sa caravane
- Titre "Meneur Légendaire" : caravane niv. 30+

---

## Notes business

> La mécanique Meneur Pro transforme les meilleurs leaders gaming en ambassadeurs business d'Eventy.
> C'est un canal d'acquisition puissant : un Meneur Pro avec 150 membres actifs = potentiellement
> 150 voyageurs qui font confiance à sa recommandation.
> 
> À documenter dans la stratégie partenaires : `pdg-eventy/05-partenaires/STRATEGIE-PARTENAIRES.md`
