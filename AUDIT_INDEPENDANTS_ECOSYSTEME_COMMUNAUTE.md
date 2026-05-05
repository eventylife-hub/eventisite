# Audit — Recrutement Indépendants & Écosystème Communauté

**Date** : 2026-05-05
**Auteur** : Claude (bras droit IA du PDG David)
**Branche** : `claude/beautiful-noether-2378f0`
**Mission** : Construire un écosystème complet pour le recrutement d'indépendants par les créateurs et la communauté Eventy (créateurs ↔ indés ↔ formation ↔ mentoring).

---

## ⭐ Esprit du chantier (lecture AME-EVENTY.md)

> *« Eventy est bâti sur une armée d'indépendants. (...) On ne les traite pas comme des "prestataires". On les traite comme des partenaires à part entière. Ils sont à leur compte, ils ont choisi cette vie, et on respecte ça. Ils ne travaillent pas pour Eventy — ils travaillent avec Eventy. »*

Cet écosystème est une matérialisation directe de cette conviction. Chaque page, chaque composant respire cette philosophie : indés = partenaires, créateurs = orchestrateurs, communauté = famille.

---

## 🔎 Audit de l'existant

### Pages déjà construites (avant ce chantier)

| Page | Lignes | Description |
|------|--------|-------------|
| `/pro/annuaire/page.tsx` | 445 | Annuaire indé MOCK 12 profils + favoris/filtres + invitation email |
| `/pro/independants/page.tsx` | 383 | Annuaire créateur — privés vs marketplace (Push 38 V2) |
| `/pro/voyages/[id]/independants/page.tsx` | 732 | Page assignation indé sur une occurrence |
| `/components/independants/IndependantDetailDrawer.tsx` | 644 | Drawer profil détaillé |
| `/independant/page.tsx` | 268 | Dashboard indé avec KPIs + missions |
| `/components/social-groupes/PostFeed.tsx` etc. | — | Feed social existant pour groupes |
| `/lib/independant-occurrences.ts` | — | Helpers occurrences à opérer (mock) |

### Fichier de référence côté types/mock pré-existant

- `app/(pro)/pro/voyages/nouveau-v2/_lib/voyage-independents.ts` : `MOCK_INDEPENDENTS`, `Independent`, `IndependentTier`, helpers `tierColor/tierEmoji/languageLabel/reliabilityColor/isCertifiedForTier`.

### Couvertures manquantes identifiées

- ❌ Pas de moteur de recherche premium dédié (cards riches + filtres latéraux + scoring)
- ❌ Pas de wizard de recrutement guidé
- ❌ Pas de hub communauté (feed, événements, témoignages)
- ❌ Pas de programme mentoring formalisé
- ❌ Pas de page d'acceptation de mission côté indé
- ❌ Pas de catalogue formations (au-delà du `/independant/formation` actuel)
- ❌ Pas d'éditeur de profil enrichi (vidéo, passions, dispos calendrier)
- ❌ Pas de système d'opportunités ouvertes (marketplace de prestation)

---

## 🏛️ Architecture livrée

### Helpers (3 fichiers, ~1 100 lignes)

| Fichier | Rôle |
|---------|------|
| `lib/independants-search.ts` | Types `IndepProfilSearchable`, `SearchCriteria`, scoring, filtres, tri, MOCK_INDEPENDANTS_RICHE (8 profils enrichis), helpers UI (TIER_LABEL, ROLE_LABEL, BADGE_LABEL, TIER_GRADIENT) |
| `lib/community-feed.ts` | Types posts/réactions/threads/événements/mentoring/opportunités, MOCK posts/events/mentoring/opportunités, helpers `timeAgo`, `totalReactions`, `POST_TYPE_META`, `EVENT_TYPE_META` |
| `lib/recruitment-wizard.ts` | Types wizard 5 étapes, `besoinToCriteria`, `compatibiliteAvecBesoin` (scoring + raisons + alertes), `proposerCandidats`, `QUESTIONS_TEST_STANDARD`, `genererContratType` |

### Composants (`components/independants/`, 6 fichiers, ~2 000 lignes)

| Composant | Description |
|-----------|-------------|
| `IndependantCard.tsx` | Card riche (avatar tier-gradient + nom + tier + badge + stats inline + tarif + langues + barre compatibilité optionnelle) |
| `SearchFilters.tsx` | Sidebar filtres premium — tier/rôle/zones/langues/note/prix/expérience/véhicule/certifIA + tri |
| `RecruitmentWizard.tsx` | Wizard 5 étapes complet (Besoin → Critères → Candidats → Test → Invitation) avec stepper + transitions Framer Motion |
| `CommunityFeed.tsx` | Feed posts type Twitter/Discord — réactions ❤️🔥👏🌍🙌💡, comments inline, partages, types (témoignage/conseil/question/opportunité/événement/célébration) |
| `MentoringCard.tsx` | Card relation mentor → mentee avec thèmes, RDV, satisfaction |
| `TestimonialCard.tsx` | Card témoignage avec note, contenu italique Playfair, badge `Recommandé` |
| `index.ts` | Exports centralisés |

### Pages côté Créateur (5 nouvelles + 1 alias)

| Route | Description |
|-------|-------------|
| `/pro/independants` *(existant — sous-nav ajoutée)* | Page annuaire historique enrichie avec sous-nav vers les 4 sous-pages |
| `/pro/independants/recherche` *(NEW)* | Moteur recherche premium — sidebar filtres + grid résultats + barre recherche full-text |
| `/pro/independants/recrutement-wizard` *(NEW)* | Wizard 5 étapes (paramètre URL `?candidat=ind-xxx` pour pré-sélection) |
| `/pro/independants/communaute` *(NEW)* | Feed communauté + sidebar événements + témoignages voyageurs + stats communauté |
| `/pro/independants/mentoring` *(NEW)* | Programme mentoring : explication, avantages mentor (+5%, 100€ formation, badge, priorité), relations actives, indés à parrainer |
| `/pro/independants/[id]` *(NEW)* | Profil détaillé : hero gradient tier + KPIs + sections (vidéo, certifs, zones, passions, témoignages) + sidebar (tarif, dispos, parrainage) |
| `/pro/independants/recruter` *(NEW)* | Alias historique → redirige vers `/recrutement-wizard` (rétro-compatibilité) |

### Pages côté Indépendant (3 nouvelles)

| Route | Description |
|-------|-------------|
| `/independant/communaute` *(NEW)* | Hub indé 4 sections : Mes créateurs · Opportunités · Communauté (feed + mentoring + parrainage) · Formation |
| `/independant/formations` *(NEW)* | Catalogue formations Académie Eventy — filtres thème/niveau/gratuit, 8 formations mockées, certifications, progression, cours par mentors indés (Luca/Karim/Ahmed/Thomas) |
| `/independant/profil/edit` *(NEW)* | Éditeur de profil enrichi avec preview live (IndependantCard) — identité, parcours, certifs (toggle Standard/Premium/Luxe), langues, zones, passions, tarif, vidéo |
| `/independant/missions/[id]/accept` *(NEW)* | Page acceptation mission — message créateur, détails complets, rémunération détaillée, logistique, contraintes, CTA Accepter/Décliner/Demander précisions, génération contrat |

### Modifications mineures (sans casser)

- `app/(pro)/pro/independants/page.tsx` : ajout sous-nav 4 liens (recherche / wizard / communauté / mentoring) en tête de `<main>` — design respecte la palette existante PALETTE.gold/ocean/emerald/border.
- `app/(independant)/independant/page.tsx` : ACTIONS du dashboard étoffé (Communauté, Mon profil, Formations pluriel ajoutés).

---

## 📊 Statistiques chantier

| Métrique | Valeur |
|----------|--------|
| Helpers TS créés | 3 (~1 100 l) |
| Composants TSX créés | 6 + index (~2 000 l) |
| Pages créées | 9 |
| Pages enrichies (sans casser) | 2 |
| Lignes ajoutées (estimation) | ~6 800 |
| TODOs Eventy posés | 18 |

---

## 🧠 Modèle de données introduit

### `IndepProfilSearchable` (clé du moteur)

```ts
{
  id, prenom, nom, bio, avatarEmoji, photoUrl?, videoPresentationUrl?,
  role: IndepRole, rolesSecondaires?,
  certifications: { tier, obtenuLe, expireLe?, examScore? }[],
  tierMax: 'STANDARD' | 'PREMIUM' | 'LUXE',
  langues: string[], zonesPreferees: string[], passions: string[],
  ville, pays, geo?: { lat, lng }, rayonInterventionKm,
  stats: { voyagesOperes, satisfactionMoyenne, ponctualite, fiabilite, tauxAcceptation, delaiReponseMinutes },
  recommandations, parraine?, parrainCount?,
  disponiblesSemaines: number[], tarifJournalier, vehicule, permis?,
  experienceAnnees, inscriptionLe, derniereMissionLe?,
  badge?: 'TOP_RATED' | 'RISING_STAR' | 'LOCAL_HERO' | 'POLYGLOTTE' | 'AMBASSADEUR'
}
```

### Scoring `compatibiliteAvecBesoin` (utilisé par le wizard)

Calcule un score 0-100 + raisons (✓) + alertes (⚠) :

- **+10 / -15** : tier requis matché ou non
- **+5 / -10** : rôle principal/secondaire matché ou non
- **+10 / -8** : destination dans zones préférées ou non
- **Bonus** : note ≥ 4.8, fiabilité ≥ 95%, réponse ≤ 30min, voyages ≥ 30
- **-12** : rémunération journalière < 85% du tarif habituel

---

## 🎯 Mécanismes d'amélioration du recrutement

### Wizard 5 étapes

1. **Besoin** : titre voyage, destination, dates, voyageurs, tier, rôle, rémunération, description
2. **Critères** : récapitulatif intelligent + nb candidats pré-calculé (alerte si 0)
3. **Candidats** : top 8 triés par compatibilité avec compatibilité visuelle (barre + raisons + alertes inline) — sélection radio
4. **Test** : 5 questions QCM/Ouvertes/Scénario sur l'âme Eventy (Pack Sérénité, modèle 82/18, seuil minimal, conflit) — total 100 pts
5. **Invitation** : message personnalisé + aperçu contrat type généré (numéro, voyage, dates, rôle, tier, rémunération, conditions annulation, paiement, NDA) → envoi

### Programme parrainage

- **+200 €** côté indé qui parraine (page `/independant/communaute` section Communauté)
- **+5%** côté créateur qui mentor (page `/pro/independants/mentoring`)
- **+ 100 €** crédit formation pour le mentor

### Période d'essai supervisée

Toute première mission d'un nouvel indé recruté est marquée comme « supervisée par l'équipe Eventy » (placeholder backend pour suivi).

### Notification multi-canal

Architectures préparées pour : push, email, SMS si urgent, in-app. TODOs Eventy posés.

---

## 🎨 Direction artistique

Toutes les nouvelles pages respirent le langage **ULTRA premium** demandé :

- **Typographie** : Playfair Display pour les titres et chiffres clés, sans-serif système pour le corps
- **Palette** : `#D4A853` (gold) · `#E8C577` (gold light) · `#F8F2E0` (ivory) · `#0F0D08`/`#1A1A1A`/`#261F14` (background gradient)
- **Glassmorphism** : `backdrop-filter: blur(12-24px) saturate(120-140%)`, `background: rgba(248, 242, 224, 0.04)`, `border: 1px solid rgba(212, 168, 83, 0.18)`
- **Animations** : Framer Motion pour entrées (fade-in + translate-y), hover (-translate-y-1 + boxShadow gold) et transitions wizard
- **Tier gradients** : Standard slate, Premium gold, Luxe noir-gold — déclinés sur cards, avatars, badges

---

## 🚧 TODOs Eventy posés (backend à suivre)

```
// TODO Eventy: backend CRUD profils indés + critères recherche
// TODO Eventy: matching auto IA selon besoin créateur (ML scoring)
// TODO Eventy: système notation bidirectionnel (créateur ↔ indé)
// TODO Eventy: certifications Eventy avec examens en ligne (timer + anti-cheat)
// TODO Eventy: marketplace prestations (offres ouvertes)
// TODO Eventy: chat temps réel créateur ↔ indé (Pusher/Socket.io)
// TODO Eventy: notifications push opportunités proches géographiquement
// TODO Eventy: gamification communauté (badges, points, classements)
// TODO Eventy: événements physiques/virtuels Eventy (apéros indés annuels)
// TODO Eventy: programme parrainage indé (récompense quand un indé recruté)
// TODO Eventy: contrat type signé DocuSign placeholder
// TODO Eventy: période d'essai 1ère mission supervisée
// TODO Eventy: vidéos hébergées MUX + DRM (formations + présentation indés)
// TODO Eventy: backend GET /community/posts feed
// TODO Eventy: backend GET /pro/independents/search avec filtres serveur
// TODO Eventy: backend POST /missions/:id/accept | /decline | /clarify
// TODO Eventy: catalogue formations Eventy (vidéos MUX + certifs)
// TODO Eventy: visibilité publique : créateurs invités peuvent voir le profil
```

---

## ✅ Critères de validation respectés

- [x] **Audit profondeur** : 7 routes existantes + types pré-existants identifiés
- [x] **Toutes les pages demandées** créées
- [x] **Mécanisme recrutement amélioré** : wizard 5 étapes + scoring + tests + contrat
- [x] **Profil indé enrichi** : photo, bio, parcours, certifs (tier + dates + score), spécialités, langues, zones, passions, stats, vidéo (placeholder), recommandations, dispos
- [x] **UI ULTRA premium** : Playfair, ivoire, gold, glassmorphism, Framer Motion
- [x] **Helpers TS** : 3 modules livrés (search, community, recruitment)
- [x] **Composants** : 6 composants (IndependantCard, SearchFilters, RecruitmentWizard, CommunityFeed, MentoringCard, TestimonialCard)
- [x] **TODOs Eventy** : 18 posés en commentaires
- [x] **Ne rien effacer** : seuls 2 ajouts non destructifs (sous-nav `/pro/independants` et ACTIONS dashboard indé)
- [x] **Communauté complète** : feed, événements, mentoring, formations, opportunités, parrainage, témoignages voyageurs

---

## 📋 Prochaines étapes recommandées

### Backend (NestJS)

1. Créer module `community` (NestJS) : posts, comments, reactions, threads, events
2. Créer module `recruitment` : wizard state machine, candidats matching, contracts
3. Créer module `mentoring` : relations, RDV planning, satisfaction
4. Créer module `formations` : catalogue, progression, certifs, examens
5. Brancher DocuSign API officielle pour contrats
6. Brancher MUX (ou Cloudinary) pour vidéos

### Frontend (V2 Premium/Luxe)

1. Page `/pro/independants/recherche` → connecter au backend search au lieu du mock
2. Page wizard → POST `/recruitment/start` → notifications push
3. Composant `<RecruitmentWizard>` : ajouter étape « Brief vidéo » (créateur enregistre un message vidéo)
4. Étendre `MOCK_INDEPENDANTS_RICHE` à 50+ profils pour démo (+ photos réelles)
5. Carte interactive `<ZoneMap>` (Mapbox) pour visualiser les rayons d'intervention
6. Filtre dispo calendrier (au lieu de juste semaines ISO)

### Marketing & Communication

1. Lancer la **Convention Eventy 2026** à Marrakech (event mock déjà dans `MOCK_COMMUNITY_EVENTS`)
2. Communiquer sur le **programme parrainage indé** dans la newsletter
3. Filmer une vidéo « 1 jour dans la peau d'un indé Eventy Premium » pour la home page

---

## 💡 Ce qui rend cet écosystème unique

- **Indés = partenaires** (jamais le mot "prestataire" dans les UI livrées)
- **Tier hierarchy honnête** : Standard, Premium, Luxe — chaque indé voit son chemin de progression
- **Communauté vivante** : posts, réactions, conseils, témoignages → le feed encourage le partage
- **Mentoring rémunéré** : créateurs expérimentés sont récompensés pour faire grandir les nouveaux
- **Recrutement sérieux** : wizard guidé + tests d'évaluation sur l'âme Eventy + période d'essai supervisée
- **Un cercle vertueux** : plus on grandit, plus tout le monde grandit (cf. AME-EVENTY.md)

---

*Audit clos le 2026-05-05 — Claude (bras droit IA du PDG)*
