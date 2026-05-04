# Audit Flow Créateur ↔ Indépendant — 2026-05-04

> **Demande PDG (David)** — « organiser tout ça pour que ce soit fluide. Tous les boutons nécessaires (modifications etc.). Toutes les pages nécessaires. Détail pour les assister. TODOs + code dans la foulée. »
>
> **Cœur du métier pro.** Tout doit partir de la symphonie pour le créateur, et de l'occurrence pour l'indépendant. Format premium ivoire/gold/glassmorphism partout, mêmes patterns que `/pro/voyages/nouveau-v2`.

---

## 1. État de l'existant — créateur

### 1.1 Hub symphonies — `/pro/symphonies/page.tsx` ✅ EXCELLENT (1284 lignes)

Rendu **premium dark** déjà très avancé :

- Hero éditorial Playfair 38–52px + accroche + KPIs (NET total, voyages, voyageurs, en montage, publiées)
- Toolbar : recherche live (titre/destination/tag), 3 vues (Grille / Liste / Timeline), filtres avancés (destination · tag · performance)
- Tabs status (Toutes / En montage / Publiées / Templates premium)
- `<SymphonieCard>` riche : cover gradient, status chip, mini-timeline 4 pistes animée, stats 4 (Voyages/Voy./Jours/NET k€), tags, sync badge, **6 actions** (Monter, Créer un voyage, Dupliquer, Archiver) + 4 quick-links (Voyages, Marketing, HRA, Stats), CTA « Vue globale »
- `<SymphonieRow>` (vue liste) + `<SymphonieTimeline>` (vue chronologique)
- 4 templates pré-remplis Eventy (Évasion 3j, Grand tour 7j, Romantique, Aventure outdoor)
- Mock data : 6 symphonies (Andalousie, Europa-Park, Algarve, Vosges, Marrakech VIP, Toscane)

**Verdict** : ne rien toucher, hub déjà au top.

### 1.2 Vue globale symphonie — `/pro/symphonies/[id]/page.tsx` ✅ EXCELLENT (1246 lignes)

Page détail avec **6 onglets internes** : Composition, Voyages, Marketing, Statistiques, Partenaires, Historique. Sections riches : HRA cards, activités signature, programme jour-par-jour, table voyages avec fill-rate + NET, calendrier marketing J-60→J+7 multi-canal, KPI stats globaux + détaillés, partenaires exclusifs, versioning historique.

**Verdict** : ne rien toucher.

### 1.3 Montage clip — `/pro/symphonies/[id]/montage/page.tsx` ✅ EXCELLENT (976 lignes)

Éditeur visuel timeline avec pistes HRA / Arrêts / Activités / Médias.

**Verdict** : ne rien toucher.

### 1.4 Wizard nouveau voyage V2 — `/pro/voyages/nouveau-v2/page.tsx` ✅

Accepte le param `?symphony=<id>` (déjà branché côté hub via le bouton « Créer un voyage »). Pré-remplit phases 1a-1g via `_lib/symphony-presets.ts`.

### 1.5 Manques côté créateur (à créer)

| Route | Mission |
|-------|---------|
| `/pro/symphonies/nouvelle` | Wizard de création — choix template Eventy ou symphonie vierge, métadonnées de base, redirige vers le montage clip |
| `/pro/symphonies/[id]/voyage-from` | Page « De cette symphonie vers un voyage » — pré-vue de la composition + bouton CTA qui redirige vers `nouveau-v2?symphony=<id>` avec confirmation (sécurité contre clic accidentel) |
| `/pro/symphonies/[id]/voyages` | Vue dédiée « voyages liés » — table riche + filtres, séparée de la vue globale |
| `/pro/symphonies/[id]/stats` | Vue dédiée statistiques — graphes, performance, comparatif inter-occurrences |
| `/pro/symphonies/[id]/marketing` | Vue dédiée marketing — calendrier, accroche, audience, canaux, CTA création campagne |
| `/pro/symphonies/[id]/historique` | Vue dédiée versioning — timeline versions, diff visuel, restaurer |

> Note : la vue globale `[id]/page.tsx` reste le hub central avec ses 6 tabs ; les routes ci-dessus sont des **deep-links premium** pour usage avancé (ex. on partage `/pro/symphonies/andalousie/marketing` à un partenaire).

---

## 2. État de l'existant — indépendant

### 2.1 Routes existantes — `app/(independant)/independant/`

```
activites/         certifications/    chat/             clients/
disponibilites/    documents/         energie/          finance/
formation/         gaming-impact/     missions/         page.tsx
partager/          portfolio/         profil/           revenus/
support/           tribus/            urgence/          ventes/
voyages/           voyageurs/
```

`missions/` contient déjà :
- `missions/page.tsx` — liste des missions filtrée (statut, recherche), MiniStats + drawer détail
- `missions/[id]/page.tsx` — détail mission avec brief + équipe + script
- `missions/[id]/script/page.tsx` — script de mission

### 2.2 Manques côté indépendant (à créer)

Le PDG demande de cadrer le flow autour des **occurrences** (= un voyage concret que l'indépendant doit opérer). Les missions existantes sont génériques ; les occurrences sont la **réalisation J0** d'une symphonie créateur.

| Route | Mission |
|-------|---------|
| `/independant/occurrences` | Liste des occurrences à opérer — cards riches (date, voyageurs, statut, créateur de la symphonie, contact) |
| `/independant/occurrences/[id]/carnet` | Carnet de voyage par occurrence — programme, HRA, contacts, script, briefing |
| `/independant/occurrences/[id]/messagerie` | Messagerie créateur ↔ indépendant — fil temps réel + pièces jointes |
| `/independant/occurrences/[id]/validation` | Check-in J0 — appel voyageurs, briefing, contacts urgence |
| `/independant/occurrences/[id]/compte-rendu` | Compte rendu post-voyage — note voyageurs, incidents, photos, satisfaction |

> Il existe déjà `/independant/revenus/page.tsx` → on n'y touche pas, on s'aligne dessus côté liens cross-page.

---

## 3. Composants partagés à créer

| Composant | Rôle |
|-----------|------|
| `<SymphonieCard>` (helper local au hub) ✅ existe | déjà OK dans `/pro/symphonies/page.tsx` |
| `<OccurrenceCard>` | Card d'une occurrence côté indépendant — équivalent visuel à SymphonieCard mais pour le terrain |
| `<ActionsMenu>` | Menu d'actions universel (Modifier / Dupliquer / Partager / Archiver / Voir voyages liés / Voir stats / Demander assistance / Mettre en pause) |
| `<OnboardingTour>` | Tour guidé pas-à-pas overlay (première fois créateur OU indépendant) |
| `<AideFlottanteButton>` | Bouton flottant 🆘 « aide & contact équipe » accessible partout dans les pages pro/indépendant |
| `<TooltipSmart>` | Tooltip d'astuce contextuelle riche (texte + lien doc + emoji) |

---

## 4. Helpers à créer

| Fichier | Contenu |
|---------|---------|
| `lib/symphonie-actions.ts` | Fonctions client : `createSymphonie`, `updateSymphonie`, `duplicateSymphonie`, `archiveSymphonie`, `restoreSymphonieVersion`, `pauseSymphonie`. Toutes en mock + `// TODO Eventy: backend`. |
| `lib/independant-occurrences.ts` | Mock data type `Occurrence` + helpers `getOccurrence`, `listOccurrences`, `validateOccurrence`, `submitCompteRendu`. |

---

## 5. UX douce — détail pour assister

Selon brief PDG :

- **Onboarding** créateur première fois → `<OnboardingTour>` overlay 5 étapes (Hub / Templates / Montage / Stats / Aide)
- **Astuces contextuelles** → `<TooltipSmart>` sur champs importants
- **Templates pré-remplis** → déjà existants côté hub (4 templates premium)
- **Suggestions IA** placeholder → bandeau « Tu veux ajouter une activité culturelle ? Voici 3 suggestions Andalousie » avec icône Sparkles, état désactivé (TODO Eventy)
- **Aide & contact équipe** → `<AideFlottanteButton>` bottom-right fixed, ouvre modale chat / appel / FAQ
- **Mode brouillon** → toast « Brouillon sauvegardé · il y a Xs » dans le wizard
- **Validation visuelle** → checks ✓/✗ par section dans le wizard

---

## 6. TODOs Eventy (backend)

```ts
// TODO Eventy: backend CRUD symphonies (créer/modifier/dupliquer/archiver/restaurer version)
// TODO Eventy: backend CRUD occurrences indépendant (réception, suivi, compte rendu)
// TODO Eventy: messagerie temps réel créateur ↔ indépendant
// TODO Eventy: notifications push (changement statut symphonie/occurrence)
// TODO Eventy: onboarding interactif première fois (saved progress)
// TODO Eventy: système de tags/favoris pour organiser symphonies
// TODO Eventy: comparaison versions symphonie côte à côte (diff visuel)
// TODO Eventy: suggestions IA contextuelles (activités/HRA/programme)
// TODO Eventy: marketplace symphonies entre créateurs
// TODO Eventy: scoring qualité symphonie + recos
```

---

## 7. Plan de livraison

1. ✅ Audit complet — ce fichier
2. Helpers `symphonie-actions.ts` + `independant-occurrences.ts`
3. Composants partagés `<TooltipSmart>`, `<AideFlottanteButton>`, `<OnboardingTour>`, `<ActionsMenu>`, `<OccurrenceCard>`
4. Pages créateur manquantes (`nouvelle`, `voyage-from`, `voyages`, `stats`, `marketing`, `historique`)
5. Pages indépendant (`occurrences`, `[id]/carnet`, `[id]/messagerie`, `[id]/validation`, `[id]/compte-rendu`)
6. Commit + push master (frontend) + bump main (worktree) + vérif Vercel

**Format** : 100% premium dark Eventy — Playfair Display + ivoire + gold #D4A853 + glassmorphism + Framer Motion. Aucun fichier existant ne sera supprimé ni écrasé.

---

*PDG · 2026-05-04*
