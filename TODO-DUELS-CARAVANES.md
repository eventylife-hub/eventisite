# TODO — Duels entre Caravanes
*Créé : 2026-04-25 · Priorité : FUTUR (Post-lancement Phase 2)*

> ⚠️ **Ce système est en mémoire pour le futur.** Ne pas implémenter avant d'avoir une base active
> de caravanes (100+ caravanes, 10 000+ membres). Complexité élevée, risque de toxicité si mal conçu.

---

## Concept

Les duels entre caravanes permettent à deux caravanes de s'affronter dans une compétition structurée.
Contrairement aux raids (coopératifs vs un boss), les duels sont **PvP** (Player vs Player, ici Clan vs Clan).

---

## Types de duels envisagés

### 1. Duel Quiz
- Format : 20 questions sur les voyages, destinations, culture
- Durée : 48h pour que chaque membre réponde
- Score : moyenne des scores individuels
- Enjeu : XP caravane + badge spécial

### 2. Duel Exploration
- Chaque caravane doit compléter des défis d'exploration sur des voyages réels
- Photos géolocalisées, check-in QR codes
- Durée : 7 jours
- Avantage aux caravanes avec des membres voyageant activement

### 3. Duel Recrutement
- Quelle caravane recrute le plus de nouveaux membres en 2 semaines
- Évite la toxicité : scoring sur qualité (activité) pas juste quantité

### 4. Grand Tournoi (saisonnier)
- 8 caravanes, format élimination directe
- Sponsorisé par une marque partenaire
- Loot légendaire pour la caravane gagnante + le Meneur

---

## Mécanique de défi

```
1. Meneur A challenge Meneur B via /jeux/caravanes/[id]/defier
2. Meneur B a 24h pour accepter ou refuser
3. Si accepté → les deux caravanes voient le duel actif dans leur hub
4. Pendant le duel → chat inter-caravanes (courtoisie obligatoire, modéré)
5. Résultat → annoncé au niveau global, badge accordé
```

---

## Règles anti-toxicité

- Pas de "farm" de caravanes faibles : système d'ELO (niveaux similaires uniquement)
- Chat inter-caravanes modéré automatiquement (mots clés)
- Meneur peut refuser sans pénalité
- Caravane peut set statut "Pas en duel" dans ses paramètres
- En cas de comportement toxique : suspension du droit de duel 30 jours

---

## Classement ELO Duels

- Séparé du classement XP principal
- Saison de 3 mois, reset partiel
- Top 10 caravanes en duel affichées sur la homepage gaming

---

## Page à créer (futur)

- `/jeux/caravanes/[id]/duel` — lancer un défi
- `/jeux/duels` — duels en cours, historique, classement ELO
- `/jeux/duels/[id]` — suivi d'un duel en temps réel

---

## Conditions de lancement

- [ ] 100+ caravanes actives sur la plateforme
- [ ] Système de report/modération robuste
- [ ] Charte de conduite validée par l'équipe juridique
- [ ] Tests avec groupe beta de 10 caravanes volontaires

---

## Lien avec Alliances (futur)

Quand les Alliances seront créées :
- Les duels pourront devenir inter-alliances (echelle plus grande)
- Tournois d'alliances sponsorisés
- Voir `TODO-ALLIANCES-JEUX.md`
