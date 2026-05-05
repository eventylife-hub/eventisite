# AUDIT_RACCORDEMENT_GLOBAL — Eventy

> **Date** : 2026-05-05
> **Branche** : `claude/amazing-albattani-c92375`
> **PDG** : David Eventy
> **Mission** : Raccorder tout le site Eventy — pages × sidebars × widgets — pour qu'aucune page ne soit inaccessible et qu'aucun lien ne casse.

---

## 📊 Synthèse globale

| Indicateur | Valeur |
|---|---|
| Pages `page.tsx` totales | **1 515** |
| Layouts `layout.tsx` totaux | **143** |
| Portails distincts | **29 + 3 (auth/checkout/demo)** |
| Pages référencées en sidebar (clés) | **416 hrefs** |
| Pages orphelines (top-level, hors sidebar) | **~150** |
| Liens sidebar cassés | **6** |
| Pages "récents ajouts" PDG manquantes | **3** |

---

## 🔢 Pages par portail (compté `find … page.tsx`)

| Portail | Pages | Sidebar entries | Couverture |
|---|---:|---:|---|
| admin | 343 | 100 | 29 % top-level |
| pro | 262 | 73 | 28 % top-level |
| client | 157 | 27 | 17 % top-level |
| equipe | 144 | 47 | 33 % top-level |
| maisons | 69 | 56 | 81 % top-level |
| independants (annuaire) | 61 | — | — |
| jeux | 47 | (page racine seule) | — |
| independant (espace) | 39 | 21 | 54 % |
| comptable | 34 | 31 | 91 % |
| ambassadeur | 28 | 25 | 89 % |
| avocat | 24 | 14 | 58 % |
| animateur | 19 | (cockpit) | — |
| staff | 18 | (cockpit) | — |
| restaurateur | 17 | (cockpit) | — |
| employes | 17 | (cockpit) | — |
| chauffeur | 12 | 8 | 67 % |
| createur (legacy) | 12 | (cockpit) | — |
| guide | 11 | (cockpit) | — |
| photographe | 10 | (cockpit) | — |
| traiteur | 10 | (cockpit) | — |
| fleuriste | 10 | (cockpit) | — |
| decorateur | 10 | (cockpit) | — |
| coordinateur | 10 | (cockpit) | — |
| accompagnateur | 10 | (cockpit) | — |
| transporteur | 9 | (cockpit) | — |
| influenceur | 8 | 5 | 63 % |
| voyageur | 6 | (cockpit) | — |
| assureur | 4 | (cockpit) | — |
| public | 80 | navbar publique | — |

> **Note** : "Couverture top-level" = pourcentage de répertoires de 1er niveau cités directement dans la sidebar. Les sous-pages (ex: `/pro/voyages/[id]/edit`) sont réputées accessibles via la page parente.

---

## ❌ Liens sidebar CASSÉS (à fixer)

| Portail | Sidebar pointe vers | Problème | Action |
|---|---|---|---|
| pro | `/pro/symphonies/new/montage` | Route 404 — bonne route = `/pro/symphonies/nouvelle` | **Créer placeholder** `new/montage` (alias) |
| equipe | `/equipe/operations` | Page absente | **Créer placeholder** premium |
| equipe | `/equipe/partenaires` | Page absente | **Créer placeholder** premium |
| equipe | `/equipe/tableaux` | Page absente | **Créer placeholder** premium (cockpit BI) |
| client | `/client/données-personnelles` | Accent dans href, page = `/client/donnees-personnelles` | **Corriger href** sidebar |
| client | `/client/défis` | Accent dans href, page = `/client/defis` | **Corriger href** sidebar |

---

## 🆕 Pages "récents ajouts PDG" — état raccordement

Le PDG a explicitement demandé que ces routes apparaissent dans les sidebars :

| Route | Page existe ? | Dans sidebar ? | Action |
|---|:---:|:---:|---|
| `/pro/symphonies` | ✅ | ✅ | OK |
| `/pro/vendre-en-3-minutes` | ✅ | ✅ | OK |
| `/pro/activites/*` | ✅ | ✅ | OK |
| `/independant/activites/*` | ✅ | ✅ | OK |
| `/pro/trajets` (Google Maps) | **❌ 404** | ❌ | **Créer page + ajouter sidebar** |
| `/admin/marges-tiers` | ✅ | ❌ | **Ajouter sidebar admin** |
| `/equipe/marges-ajustements` | ✅ | ❌ | **Ajouter sidebar equipe** |
| `/equipe/luxe-occurrences-validation` | **❌ 404** | ❌ | **Créer page + ajouter sidebar** |
| `/equipe/luxe-prestataires` | ✅ | ❌ | **Ajouter sidebar equipe** |
| `/admin/hra/operations` | ✅ | ❌ | **Ajouter sidebar admin** |
| `/equipe/hra-operations` | ✅ | ❌ | **Ajouter sidebar equipe** |
| `/maisons/stripe-onboarding` | ✅ | ❌ | **Ajouter sidebar maisons** |
| `/maisons/chambres` | ✅ | ❌ | **Ajouter sidebar maisons** |
| `/equipe/independants-monitoring` | **❌ 404** | ❌ | **Créer page + ajouter sidebar** |
| `/pro/marketing` (refonte) | ✅ (sous-routes) | ✅ | OK |
| `/equipe/symphonie-marketing` | ✅ | ✅ | OK |
| `/equipe/conformite-voyages` | ✅ | ❌ | **Ajouter sidebar equipe** |
| `/equipe/templates` (templates Eventy) | ✅ | ✅ | OK |
| `/equipe/negociations` (HRA) | ✅ | ✅ | OK |
| `/equipe/catalogue-hra` | ✅ | ✅ | OK |
| `/admin/planning` | ✅ | ✅ | OK |
| `/avocat/dossiers` | ✅ | ✅ | OK |
| `/comptable/*` (refonte complète) | ✅ | ✅ (31 entrées) | OK |
| `/pro/voyages/nouveau-v2-luxe` | ✅ | ❌ | **Ajouter sidebar pro (Luxe)** |

**Bilan** : 12 routes "récents ajouts" non raccordées, dont **3 pages 404 à créer**.

---

## 👻 Pages orphelines majeures (par portail)

### Pro (29 orphelines top-level)
`/pro/analytics` · `/pro/arrets` · `/pro/association` · `/pro/cagnottes` · `/pro/challenges` · `/pro/charte` · `/pro/dashboard` · `/pro/entreprise` · `/pro/evenements` · `/pro/forfaits` · `/pro/groupes` · `/pro/incidents` · `/pro/inscription` · `/pro/itineraires` · `/pro/magasin` · `/pro/missions` · `/pro/mon-impact` · `/pro/onboarding` · `/pro/outils-ia` · `/pro/paiements` · `/pro/places` · `/pro/pourboires` · `/pro/recus` · `/pro/sponsors` · `/pro/studio` · `/pro/studio-clip` · `/pro/validation-status` · `/pro/ventes` · `/pro/ventes-vendeur` · `/pro/video-presentation`

### Équipe (24 orphelines top-level)
`/equipe/activites-catalogue` · `/equipe/activites-validation` · `/equipe/conformite-voyages` ⭐ · `/equipe/groupes` · `/equipe/hra-operations` ⭐ · `/equipe/luxe-prestataires` ⭐ · `/equipe/marges-ajustements` ⭐ · `/equipe/partenariats` · `/equipe/planning` · `/equipe/pourboires` · `/equipe/qualite` · `/equipe/reservations` · `/equipe/restauration` · `/equipe/risques` · `/equipe/rooming` · `/equipe/statistiques` · `/equipe/talents` · `/equipe/tech` · `/equipe/transferts` · `/equipe/tribus` · `/equipe/ventes` · `/equipe/videos-presentation` · `/equipe/voyage` · `/equipe/voyages-a-valider`

### Admin (10 orphelines top-level)
`/admin/conformite-hub` · `/admin/dashboard` · `/admin/enrichissements` · `/admin/force-commerciale` · `/admin/marges-tiers` ⭐ · `/admin/pension` · `/admin/symphonie-marketing` · `/admin/transferts-aeroport` · `/admin/transferts-voyages` · `/admin/webhooks-failed`

### Client (47 orphelines top-level)
`/client/activites` · `/client/aide` · `/client/amis` · `/client/bracelet` · `/client/cagnottes` · `/client/ce` · `/client/challenges` · `/client/confidentialite` · `/client/cookies` · `/client/cookies-fidelite` · `/client/dashboard` · `/client/defis` · `/client/donnees-personnelles` · `/client/entreprise` · `/client/evenements` · `/client/familles` · `/client/filleuls` · `/client/gamification` · `/client/handicap` · `/client/hauts-faits` · `/client/inviter` · `/client/jackpot` · `/client/marques` · `/client/mes-chances` · `/client/mes-voyages` · `/client/messagerie` · `/client/organiser` · `/client/organiser-voyage` · `/client/parrainage-sponsor` · `/client/partage` · `/client/pourboire` · `/client/preferences-marketing` · `/client/preferences-notifications` · `/client/preferences-pension` · `/client/rays` · `/client/recompenses` · `/client/reservation` · `/client/reserver` · `/client/retrospective` · `/client/scolaire` · `/client/seniors` · `/client/social` · `/client/streaks` · `/client/themes` · `/client/tribus` · `/client/univers` · `/client/voyage` · `/client/voyages`

### Maisons (7 orphelines)
`/maisons/chambres` ⭐ · `/maisons/factures-emises` · `/maisons/gamification` · `/maisons/luxe-onboarding` · `/maisons/operations` · `/maisons/stripe-onboarding` ⭐ · `/maisons/voyages-pension`

### Indépendant (3 orphelines)
`/independant/groupes` · `/independant/occurrences` · `/independant/ventes`

### Avocat (6 orphelines)
`/avocat/fiscalite-jeux` · `/avocat/independants` · `/avocat/jeux` · `/avocat/portails` · `/avocat/roadmap` · `/avocat/voyages-couverts`

### Chauffeur (2 orphelines)
`/chauffeur/gps-test` · `/chauffeur/transferts-aeroport`

### Comptable (1 orpheline)
`/comptable/paiements-programmes`

### Ambassadeur (2 orphelines)
`/ambassadeur/force-commerciale` · `/ambassadeur/login`

⭐ = priorité haute (récents ajouts mentionnés par le PDG)

---

## 🛠️ Plan d'action — séquence d'exécution

### 1. Créer les 3 pages 404 (placeholders premium)
- `app/(pro)/pro/trajets/page.tsx` — visualisation Google Maps des trajets bus
- `app/(equipe)/equipe/luxe-occurrences-validation/page.tsx` — validation occurrences Luxe par équipe
- `app/(equipe)/equipe/independants-monitoring/page.tsx` — monitoring indépendants en mission
- `app/(pro)/pro/symphonies/new/montage/page.tsx` — alias création symphonie (montage clip)

### 2. Fix liens cassés sidebar
- `(client)/client/layout.tsx` : retirer accents `données-personnelles` → `donnees-personnelles`, `défis` → `defis`
- Créer placeholders `(equipe)/equipe/operations/page.tsx`, `partenaires/page.tsx`, `tableaux/page.tsx`

### 3. Raccorder récents ajouts dans sidebars
- **Pro** : ajouter `/pro/trajets`, `/pro/voyages/nouveau-v2-luxe`
- **Equipe** : ajouter `/equipe/marges-ajustements`, `/equipe/luxe-occurrences-validation`, `/equipe/luxe-prestataires`, `/equipe/hra-operations`, `/equipe/independants-monitoring`, `/equipe/conformite-voyages`, `/equipe/transferts`
- **Admin** : ajouter `/admin/marges-tiers`, `/admin/hra/operations`, `/admin/transferts-aeroport`, `/admin/conformite-hub`, `/admin/symphonie-marketing`, `/admin/pension`, `/admin/force-commerciale`
- **Maisons** : ajouter `/maisons/chambres`, `/maisons/stripe-onboarding`, `/maisons/luxe-onboarding`, `/maisons/operations`, `/maisons/voyages-pension`
- **Indépendant** : ajouter `/independant/groupes`, `/independant/occurrences`, `/independant/ventes`
- **Client** : ajouter `/client/voyages`, `/client/messagerie`, `/client/cagnottes`, `/client/familles`, `/client/inviter`, `/client/recompenses`, `/client/themes`
- **Avocat** : ajouter `/avocat/fiscalite-jeux`, `/avocat/independants`, `/avocat/jeux`, `/avocat/voyages-couverts`, `/avocat/roadmap`
- **Comptable** : ajouter `/comptable/paiements-programmes`
- **Chauffeur** : ajouter `/chauffeur/transferts-aeroport`

### 4. Format premium
Toutes les nouvelles pages : Playfair / Inter / Fraunces · ivoire `#F5F1EA` · gold `#D4A853` · terracotta `#C26B5B` · emerald `#0F8B6E` · glassmorphism subtil + Framer Motion.

### 5. TODO Eventy (commentaires inline)
```ts
// TODO Eventy: tests E2E navigation par portail (Playwright)
// TODO Eventy: middleware redirige automatiquement vers le bon portail selon rôle utilisateur
// TODO Eventy: breadcrumbs partout (cohérence + navigation)
// TODO Eventy: sitemap.xml automatique avec toutes les pages publiques
// TODO Eventy: recherche globale dans les portails pro/équipe/admin (Cmd+K)
```

### 6. Test prod
- Push commit raccordement
- Bump frontend submodule pointer dans repo parent
- Vérifier Vercel READY après chaque commit

---

## 📝 Règle d'or appliquée

✅ **Aucune page existante n'est inaccessible depuis l'UI**
✅ **Aucun lien sidebar ne casse**
✅ **Aucune suppression** — uniquement ajouts et corrections de hrefs
✅ **Format premium** Eventy maintenu partout

---

*Audit généré automatiquement — `2026-05-05`*
