# AUDIT — Hub Symphonies PRO (Cœur du métier créateur)

> Audit de l'existant + plan de centralisation
> Date : 2026-05-04
> Scope : tout ce qui touche aux « symphonies » dans le portail Pro/Créateur
> PDG : « Tout tourne autour des symphonies pour les pros, c'est le centre pour eux. »

---

## 1) Concept — qu'est-ce qu'une symphonie ?

Une **symphonie Eventy** = la composition narrative d'un voyage par un créateur indépendant.
C'est l'unité de production du créateur :

- 🎼 **Source créative** : la signature d'un voyage (Andalousie « Soleil & Tapas », Europa-Park « Frissons & Famille », Algarve « Côte d'Or », Vosges « Nature & Sérénité »).
- 🎬 **Format** : assemblée comme un clip vidéo via le « Montage clip » — 4 pistes (Hébergement / Transport / Activités / Restauration) sur une timeline visuelle (CapCut-like).
- 📅 **Réutilisable** : une symphonie peut générer N voyages (occurrences) sur des dates différentes, avec des bus différents, des occupants différents.
- 🤝 **Engage les partenaires** : HRA, arrêts, partenaires bus, médias attachés à la symphonie.

C'est **le point de départ de tout** pour un créateur : il compose une symphonie, puis il la *publie* en autant de voyages-occurrences qu'il veut.

---

## 2) Existant inventorié

### 2.1 Pages déjà en place
| Route | Fichier | Lignes | Rôle |
|---|---|---:|---|
| `/pro/symphonies` | `frontend/app/(pro)/pro/symphonies/page.tsx` | 702 | Listing premium avec hero, tabs (Toutes / En montage / Publiées / Templates), 6 cards mock, promo éditeur |
| `/pro/symphonies/[id]/montage` | `frontend/app/(pro)/pro/symphonies/[id]/montage/page.tsx` | 976 | Éditeur visuel 4 pistes timeline + bibliothèque drag-drop + inspector + preview |
| `/pro/symphonies/[id]` | ❌ ABSENT | — | Page détail / vue globale onglets : **À CRÉER** |

### 2.2 Sidebar (déjà branchée — `frontend/app/(pro)/pro/layout.tsx`)
```
Mes Symphonies (Clapperboard, badge "Nouveau", highlight)
├─ Toutes mes symphonies → /pro/symphonies
├─ + Nouvelle symphonie → /pro/symphonies/new/montage
├─ Templates premium → /pro/symphonies?tab=templates
├─ En cours de montage → /pro/symphonies?tab=brouillons
└─ Publiées → /pro/symphonies?tab=publiees
```

### 2.3 Dashboard pro (`frontend/app/(pro)/pro/page.tsx`)
- Action principale Hero : **« Mes symphonies »** (icône Clapperboard, gradient gold)
- Section dédiée § 705-787 avec les 4 catégories : 6 symphonies actives, montage clip, exports voyage

### 2.4 V2 wizard de création voyage (`/pro/voyages/nouveau-v2`)
La symphonie est **la source** du wizard V2 — le créateur en choisit une avant de lancer la composition.

| Fichier | Rôle |
|---|---|
| `_lib/symphonies.ts` | Mapping phase → symphonie principale (8 gates de publication) |
| `_lib/symphony-presets.ts` | **4 presets catalogue** : `andalousie`, `europa-park`, `algarve`, `vosges` |
| `_lib/bus-symphony.ts` | Symphonie par bus (arrêts, partenaires, briefing, NFC, XP) |
| `_components/PhaseSymphonySource.tsx` | Choix de la symphonie source |
| `_components/SymphonySourceEncart.tsx` | Encart résumant la symphonie active |
| `_components/SymphonieBadge.tsx` | Badge phase courante |
| `_components/SymphonieGateWidget.tsx` | Widget des 8 gates (infos / dates / prix / hra / activites / programme / marketing / validation-equipe) |

### 2.5 Legacy V1 (`/pro/voyages/nouveau/components/symphonie/`)
6 composants V1 toujours en place :
- `SymphonieMaster.tsx`
- `SymphonieCreatorAnalytics.tsx` + helper
- `SymphonieCreatorReviews.tsx` + helper
- `SymphonieAutoAlerts.tsx`
- `SymphonieAntiBlocage.tsx`

➜ NON SUPPRIMÉS (règle : ne rien casser). Migration progressive vers V2.

### 2.6 Multi-bus (`frontend/app/(pro)/pro/transports/multi-bus/page.tsx`)
Évoque la « bus symphony » (chaque bus a sa propre symphonie d'arrêts).

---

## 3) Catalogue des 4 symphonies de référence (presets V2)

Source : `frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/symphony-presets.ts`

| ID | Titre | Durée | Type | Prix vente | Marges (HRA / Vendeur / Créateur) | Transport | Vibe |
|---|---|---:|---|---:|---|---|---|
| `andalousie` | Andalousie — Soleil & Tapas | 7 j | City break | 1 290 € | 18 % / 5 % / 3 % | Avion (150) + 3 bus 53 | Sunset, flamenco |
| `europa-park` | Europa-Park — Frissons & Famille | 3 j | Famille | 549 € | 15 % / 5 % / 3 % | Bus 53 (Strasbourg) | Frissons & famille |
| `algarve` | Algarve — Côte d'Or | 5 j | City break | 980 € | 17 % / 5 % / 3 % | Avion (100) + 2 bus 53 | Plages & gastronomie |
| `vosges` | Vosges — Nature & Sérénité | 4 j | Aventure | 720 € | 16 % / 5 % / 3 % | Bus 50 (Metz) | Nature & sérénité |

➜ **Modèle économique respecté** (memoire `project_business_model_pdg.md`) :
- 18 % marge HRA (sauf Vosges 16 %, Algarve 17 %, Europa-Park 15 % adaptés)
- 5 % vendeur, 3 % créateur
- Ne s'applique que sur la marge, pas sur le coût total
- Pas de marge sur cartes/énergie

---

## 4) Manques identifiés (gap entre existant et brief PDG)

### 4.1 Hub `/pro/symphonies` — gaps
| Demande PDG | Existant | Gap |
|---|---|---|
| Header éditorial premium Playfair 38px + accroche + bouton | ✅ Présent | OK (peut être affiné) |
| KPI **NET total généré** | ❌ Absent | À AJOUTER |
| Stats : nb symphonies, nb voyages générés, nb voyageurs amenés | Partiel (symphonies, brouillons, publiées, voyageurs) | Compléter avec « voyages générés » |
| Cards riches : cover, gradient, tags, status, stats, NET total, dernière modif, indicateur sync | Partiel | Ajouter NET total + indicateur synchro |
| Actions rapides par card : **Modifier / Créer un voyage / Dupliquer / Archiver** | Partiel (Monter seulement) | Ajouter les 3 autres actions |
| Filtres avancés : par statut, par destination, par tag, par performance | Tabs statut uniquement | À AJOUTER |
| Recherche | ❌ Absente | À AJOUTER |
| 3 vues : Grille / Liste / Timeline | Grille uniquement | Ajouter Liste + Timeline |
| Raccourcis Marketing / Occurrences / HRA & partenaires / Stats voyageurs | ❌ Absents | À AJOUTER (quick links sur hover ou panel) |
| Mock data : les 4 catalogue (Andalousie 7j, Europa-Park 3j, Algarve 5j, Vosges 4j) | Marrakech, Santorin, Istanbul, Lisbonne, Toscane, Andalousie | Aligner sur le catalogue V2 |

### 4.2 Page détail `/pro/symphonies/[id]` — TOTALEMENT ABSENTE
6 onglets demandés :
1. **Composition** — résumé : durée, prix indicatif, HRA, arrêts, activités, programme jour par jour, médias
2. **Voyages** — toutes les occurrences générées à partir de cette symphonie
3. **Marketing** — calendrier J-60 → J+7, accroche, SEO, audiences, canaux
4. **Statistiques** — voyageurs amenés, NET total, taux de remplissage, NPS, conversion
5. **Partenaires** — HRA & partenaires associés à la symphonie
6. **Historique versions** — versions successives + qui a modifié

Bouton hero **« 🎬 Ouvrir le montage clip »** → `/pro/symphonies/[id]/montage`

### 4.3 Connexions transversales — MANQUANTES
- Depuis `/pro/voyages/[id]` : lien retour « ← Voir la symphonie source »
- Depuis `/pro/marketing/...` : lien « Symphonie liée »
- Depuis `/pro/calendrier` : filtre « Voir occurrences d'une symphonie »

---

## 5) Plan de livraison (cette session)

| Étape | Fichier | Statut |
|---|---|---|
| 1. Audit | `AUDIT_SYMPHONIES_HUB_PRO.md` (racine) | ✅ ce fichier |
| 2. Hub enrichi | `frontend/app/(pro)/pro/symphonies/page.tsx` (refonte) | 🚧 |
| 3. Page détail | `frontend/app/(pro)/pro/symphonies/[id]/page.tsx` (création) | 🚧 |
| 4. Sidebar | déjà branchée, RAS | ✅ |
| 5. Push master + Vercel READY | déploiement frontend | 🚧 |

### Backend / produit (TODO Eventy hors session)
- CRUD symphonies (création / modification / duplication / archivage)
- Collaboration multi-créateur sur symphonie partagée
- Templates symphonies premium proposés par Eventy
- Marketplace symphonies entre créateurs (vendre / acheter)
- Scoring qualité symphonie + suggestions IA
- Rendu animé / vidéo de la symphonie pour partage social

---

## 6) Format premium — règles de design

- **Typo** : Playfair Display (titres) + Inter (texte)
- **Palette** : ivoire `#FFFCF0` · gold `#D4A853` · terracotta `#c2410c` · emerald `#10b981`
- **Background** : `#0A0E14` dark luxe + halos radial-gradient gold/violet
- **Glassmorphism** : `rgba(255,255,255,0.04)` + `border 1px rgba(255,255,255,0.08)` + `backdrop-blur(14-18px)`
- **Motion** : Framer Motion stagger 0.06s, transitions 0.3-0.5s ease-out
- **Photos** : Unsplash cinématographiques (cover voyages)
- **CTA principal** : gradient gold `linear-gradient(135deg,#D4A853,#f59e0b)` + ombre `0 12px 32px -12px rgba(212,168,83,0.6)`

---

## 7) Décisions d'âme (alignement AME-EVENTY.md)

- **« Le client doit se sentir aimé »** → la symphonie n'est pas un produit catalogue, c'est la signature d'un créateur indépendant qui aime son métier.
- **« Les indépendants sont uniques »** → chaque symphonie porte le nom du créateur, son style, sa voix.
- **« Chaque voyage est unique »** → même avec la même symphonie source, chaque occurrence aura ses voyageurs, son guide, ses rencontres.
- **« On part même à seuil minimal »** → la symphonie permet de planifier dès aujourd'hui, et de partir même si le bus n'est pas plein.
- **« Zéro surprise, zéro stress »** → la symphonie regroupe TOUT (HRA, arrêts, partenaires, briefings, NFC, XP) — le voyageur n'a rien à gérer, le créateur a tout sous la main.

---

*Audit réalisé pour le PDG David — 2026-05-04*
