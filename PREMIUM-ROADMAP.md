# Eventy Life — PREMIUM ROADMAP
> Mis à jour : 2026-03-23

## Vision : "Hors de prix pour qu'on parle de nous"

Eventy positionne ses indépendants comme créateurs d'expériences uniques. Les classes premium créent l'effet de bouche-à-oreille, la rareté crée le désir.

---

## Classes actuelles (Sprint Premium-01 — 2026-03-23)

### Catégories de voyage
| Enum | Label | Icon | Cible |
|------|-------|------|-------|
| `STANDARD` | Standard | 🗺️ | Grand public, CE, associations |
| `PREMIUM` | Premium | ⭐ | CSP+, cadeaux d'affaires |
| `LUXE` | Luxe | 💎 | Ultra-premium, jet privé, yachts |
| `AVENTURE` | Aventure | 🏔️ | 25-45 ans actifs |
| `CULTUREL` | Culturel | 🏛️ | Seniors cultivés, associations |
| `BIEN_ETRE` | Bien-être | 🧘 | Femmes 30-55 ans, retraites yoga |
| `GASTRONOMIE` | Gastronomie | 🍾 | Épicuriens, chefs amateurs |
| `SPORT` | Sport | ⚡ | Sportifs, clubs, collectifs |

### Classes de voyage
| Enum | Label | Prix indicatif |
|------|-------|---------------|
| `ECONOMIQUE` | Économique | 300–800€ |
| `PREMIUM_ECONOMY` | Premium Economy | 800–2 000€ |
| `BUSINESS` | Business | 2 000–5 000€ |
| `FIRST` | Première Classe | 5 000–15 000€ |
| `PRIVE` | Privé | 15 000€+ |

### Types d'hébergement
`HOTEL` · `VILLA` · `RIAD` · `LODGE` · `ECOLODGE` · `PALACE` · `BOUTIQUE_HOTEL` · `APPARTEMENT` · `CAMPING_LUXE` · `YACHT` · `CHALET`

### Standing hébergement
`STANDARD` · `CONFORT` · `SUPERIEUR` · `LUXE` · `PALACE`

---

## Prochaines classes — Feuille de route

### Classe Diamant (Q3 2026)
**Concept** : Ultra-luxe absolu, conciergerie 24/7, privatisation totale.
- Jet privé Gulfstream ou Bombardier uniquement
- Max 4 personnes
- Conciergerie personnelle dédiée 24/7 (numéro direct)
- Suite présidentielle garantie
- Photographe/vidéaste personnel inclus
- **Prix cible** : 50 000€+ par personne

**Implémentation prévue** :
- Nouvel enum `TravelCategory.DIAMANT`
- Nouveau flag `isUltraExclusive: Boolean`
- Workflow de validation spécial admin
- Page dédiée sur le site public

---

### Classe Aventure Extrême (Q4 2026)
**Concept** : Pour les aventuriers sérieux, pas les touristes.
- Expéditions avec guides certifiés IFMGA / BAFA
- Matériel pro fourni
- Assurance rapatriement hélicoptère incluse
- Accès zones non touristiques
- **Prix cible** : 3 000–8 000€ par personne

**Implémentation prévue** :
- Nouveau tag `isExtremeAdventure: Boolean`
- Validation guide certifié obligatoire
- Formulaire de pré-qualification client

---

### Classe Corporate (Q1 2027)
**Concept** : Séminaires d'entreprise, team building, incentives.
- Groupes 10–50 personnes
- Espaces de travail intégrés (co-working, salles de conf)
- Activités de team building sur mesure
- Facturation B2B, notes de frais
- **Prix cible** : 1 500–5 000€ par personne

**Implémentation prévue** :
- Nouveau `ProType.CORPORATE`
- Module facturation B2B
- Intégration avec outils RH (API)

---

### Classe Famille Premium (Q2 2027)
**Concept** : Vacances de luxe pour familles avec enfants.
- Suites familiales 3+ chambres
- Club enfants privatisé
- Programme adultes ET enfants
- Tout-inclus sans compromis
- **Prix cible** : 2 000–6 000€ par adulte, enfants -50%

**Implémentation prévue** :
- Nouveau flag `isFamilyFriendly: Boolean`
- Champ `childrenPolicy: Json`
- Filtres âge sur le site public

---

### Classe Solo Voyageur (Q3 2027)
**Concept** : Voyager seul sans chambre single supplement, rencontrer des gens.
- Matchmaking algorithmique de voyageurs compatibles
- Chambre partagée sans frais supplément
- Activités sociales intégrées
- **Prix cible** : Prix standard (pas de supplement)

**Implémentation prévue** :
- Nouveau flag `isSoloFriendly: Boolean`
- Algorithme de matching profils
- Chat de découverte avant le départ

---

## Voyage vitrine — "L'Odyssée Méditerranée"

Le voyage symbolique d'Eventy, conçu pour être partagé sur les réseaux :
- **Catégorie** : LUXE
- **Classe** : PRIVE
- **Prix** : 25 000€/personne (150 000€ pour 6 personnes)
- **Transport** : Jet privé Gulfstream G650
- **Itinéraire** : Santorin → Amalfi → Monaco → Ibiza → Marrakech
- **Slug** : `/collections/odyssee-mediterranee`
- **Données seed** : `backend/prisma/seed.ts`

---

## Métriques de succès

| Métrique | Objectif 6 mois | Objectif 1 an |
|----------|----------------|---------------|
| Voyages LUXE actifs | 3 | 10 |
| CA catégorie LUXE | 300k€ | 1M€ |
| Panier moyen PRIVE | 20 000€ | 25 000€ |
| Part CA premium+ | 30% | 50% |
| Mentions réseaux sociaux "Eventy Luxe" | 100 | 1 000 |

---

*Ce document est la propriété d'Eventy Life — David (eventylife@gmail.com)*
