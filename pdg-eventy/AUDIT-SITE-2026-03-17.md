# Audit du Site eventylife.vercel.app — 17 mars 2026

## Résumé

Le frontend est **globalement bien avancé** avec un design professionnel (gradient sunset, typographie soignée). Le responsive mobile fonctionne bien. Cependant, **plusieurs pages du footer sont en 404** et les **données placeholder** doivent être remplacées avant le lancement.

**Note de David** : La page client (espace connecté) est à refaire entièrement.

---

## Pages testées

### Pages OK (fonctionnelles)

| Page | URL | Statut | Notes |
|------|-----|--------|-------|
| Accueil | `/` | OK | Hero, stats, cartes voyages, engagements, témoignages, newsletter, footer — tout s'affiche |
| Comment ça marche | `/comment-ca-marche` | OK | 3 étapes claires avec icônes |
| Contact | `/contact` | OK | Formulaire + coordonnées |
| FAQ | `/faq` | OK | Recherche + filtres par catégorie (7 catégories), accordéons |
| Blog | `/blog` | OK | 9 articles, filtres par catégorie |
| Brochure | `/brochure` | OK | 2 brochures PDF à télécharger |
| Connexion | `/connexion` | OK | Formulaire email/mdp, lien "Oublié ?" |
| Inscription | `/inscription` | OK | Champs : Prénom, Nom, Email, Tél, Type de compte (Client/Pro), MDP |
| Mot de passe oublié | `/mot-de-passe-oublie` | OK | Formulaire de réinitialisation |
| Mentions légales | `/mentions-legales` | OK | Contenu placeholder (voir erreurs) |
| CGV | `/cgv` | OK | Conditions de vente |
| Politique confidentialité | `/politique-confidentialite` | OK | Conforme RGPD |
| Page 404 | N/A | OK | Jolie page avec valise + liens utiles |

### Pages en erreur

| Page | URL | Problème |
|------|-----|----------|
| Nos voyages | `/voyages` | **Erreur de chargement** — `TypeError: Failed to fetch` (backend API non déployé → `localhost:4000`) |
| Qui sommes-nous | `/qui-sommes-nous` | **404** — Page non créée |
| Notre mission | `/notre-mission` | **404** — Page non créée |
| Carrières | `/carrieres` | **404** — Page non créée |
| Points de départ | `/points-de-depart` | **404** — Page non créée |
| Devenir partenaire | `/devenir-partenaire` | **404** — Page non créée |
| Support client | `/support` | **404** — Page non créée |
| Suivre ma réservation | (lien footer) | Redirige probablement vers espace client (non testé sans auth) |

### Portails protégés (auth guard)

| Portail | URL | Comportement |
|---------|-----|-------------|
| Client | `/client` | Redirige vers `/connexion?redirect=%2Fclient` — OK |
| Pro | `/pro` | Redirige vers `/connexion?redirect=%2Fpro` — OK |
| Admin | `/admin` | Redirige vers `/connexion?redirect=%2Fadmin` — OK |

---

## Erreurs critiques

### 1. API Backend non connectée
- **Page** : `/voyages`
- **Erreur** : `TypeError: Failed to fetch` — l'env `NEXT_PUBLIC_API_URL` pointe sur `http://localhost:4000/api`
- **Impact** : La page voyages affiche "Erreur lors du chargement des voyages"
- **Action** : Déployer le backend ou mettre des données statiques en fallback

### 2. 7 pages du footer en 404
- `/qui-sommes-nous`, `/notre-mission`, `/carrieres`, `/points-de-depart`, `/devenir-partenaire`, `/support`, (possiblement `/cookies`)
- **Impact** : Liens cassés dans le footer visible sur TOUTES les pages
- **Action** : Créer ces pages ou retirer les liens du footer

### 3. Page client à refaire (David)
- L'espace client connecté n'est pas satisfaisant et doit être repensé

---

## Données placeholder à remplacer

| Donnée | Valeur actuelle | Localisation |
|--------|----------------|--------------|
| Téléphone | `+33 1 23 45 67 89` / `+33 (0)1 XX XX XX XX` | Footer, Contact, Mentions légales |
| Adresse | `123 Avenue des Champs, 75008` / `15 rue de la Paix, 75002` | Contact, Mentions légales |
| SIRET | `123 456 789 00012` | Mentions légales |
| TVA | `FR12123456789` | Mentions légales |
| Capital social | `50 000 EUR` | Mentions légales |
| Directeur publication | `Martin Dupont` | Mentions légales |
| Statistiques hero | `2 500+ voyageurs`, `98% satisfaction`, `50+ destinations` | Accueil |

---

## Responsive mobile (375px)

- **Header** : Menu hamburger fonctionnel avec animation
- **Hero** : Texte et boutons bien adaptés
- **Cartes voyages** : Empilées verticalement — OK
- **Footer** : S'adapte en colonnes empilées — OK
- **Bouton scroll-to-top** : Présent et fonctionnel
- **Observation** : L'étape 3 "Partir" dans "Comment ça marche" a un texte très clair/transparent, contraste faible sur mobile

---

## Console JavaScript

- **Accueil** : 0 erreur
- **Voyages** : 1 erreur (`Failed to fetch` — backend non accessible)
- **Autres pages** : 0 erreur

---

## Prochaines actions (par priorité)

1. **P0** — Corriger `NEXT_PUBLIC_API_URL` pour la prod (ou ajouter un mode fallback/mock)
2. **P0** — Refaire la page client (espace connecté) — demande David
3. **P1** — Créer les 7 pages manquantes du footer (ou retirer les liens)
4. **P1** — Remplacer TOUTES les données placeholder (mentions légales, contact, footer)
5. **P2** — Améliorer le contraste de l'étape "Partir" sur la page d'accueil
6. **P2** — Ajouter des vraies images sur les cartes voyages (actuellement des emojis/icônes placeholder)
7. **P2** — Vérifier que les brochures PDF sont de vrais fichiers (et pas des liens morts)

---

*Audit réalisé le 17 mars 2026 sur https://eventylife.vercel.app*
