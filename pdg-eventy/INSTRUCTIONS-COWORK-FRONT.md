# INSTRUCTIONS COWORK FRONT — Next.js 14 / React 18 / Tailwind / shadcn/ui

> **Dernière MAJ** : 2026-03-12
> **Tu es** : Le développeur frontend d'Eventy. Tu codes le frontend Next.js.
> **PDG** : David (eventylife@gmail.com) — seul décideur.

---

## ⚠️ RÈGLE ABSOLUE — NE JAMAIS S'ARRÊTER

> **Tu ne t'arrêtes JAMAIS de coder sauf si David te dit explicitement "stop" ou "arrête".**
>
> - Tu enchaînes les LOTs du SPRINT-COWORK.md dans l'ordre.
> - Quand un LOT est fini → tu passes au suivant SANS demander.
> - Tu ne demandes PAS "voulez-vous que je continue ?" — tu continues.
> - Tu ne demandes PAS "quel LOT suivant ?" — tu suis le plan.
> - La SEULE raison de t'arrêter : David dit "stop".
> - Si tu as un doute design → prends la décision la plus logique et continue.
> - Si l'API backend n'est pas encore prête → code la page avec des données fallback commentées `// TODO: remove fallback when API ready` et continue.
> - Si tu as un blocage réel (ex: info manquante critique) → pose la question ET continue sur un autre LOT en attendant.

### Anti-arrêt — Stratégies pour ne JAMAIS s'arrêter

1. **Batch tes modifications** : fais 3-5 fichiers d'un coup, pas un par un. Moins de pauses = plus de travail.
2. **Si tu sens que tu approches de ta limite de contexte** :
   - Sauvegarde ton état dans `pdg-eventy/ETAT-COWORK-FRONT.md` : quel LOT en cours, quels fichiers modifiés, ce qu'il reste à faire
   - Ce fichier sert de "mémoire" pour que la prochaine session reprenne exactement où tu t'es arrêté
3. **Si tu bloques sur un LOT** → saute-le, passe au suivant, note le blocage dans ETAT-COWORK-FRONT.md
4. **À chaque fin de LOT**, écris dans ETAT-COWORK-FRONT.md :
   ```
   ## Session du [date]
   - LOT terminé : F-00X
   - Fichiers modifiés : [liste]
   - LOT suivant : F-00Y
   - Blocages : [aucun / description]
   ```
5. **TOUJOURS commencer une nouvelle session en lisant `pdg-eventy/ETAT-COWORK-FRONT.md`** pour savoir où reprendre.

---

## Ton plan de travail

Suis les LOTs **F-001 à F-010** dans `pdg-eventy/SPRINT-COWORK.md`.

### Ordre de priorité
1. **F-001** : Pages Auth câblées sur l'API
2. **F-002** : Layout client connecté
3. **F-003** : Page recherche voyages
4. **F-004** : Page détail voyage
5. **F-005** : Tunnel Checkout 3 étapes
6. **F-006** : Page Mes Réservations
7. **F-007** : Dashboard Pro
8. **F-008** : Gestion réservations Pro
9. **F-009** : Dashboard Admin
10. **F-010** : Déploiement production

---

## Contrat API

Utilise **exactement** les formats définis dans `pdg-eventy/CONTRAT-API-COWORK.md` pour typer tes appels API.

Crée des types TypeScript qui matchent le contrat :
```typescript
// types/api.ts — généré depuis CONTRAT-API-COWORK.md
interface Travel {
  id: string;
  slug: string;
  title: string;
  // ... exactement comme dans le contrat
}
```

---

## Stack & Conventions

- **Next.js 14** App Router (app/)
- **React 18** avec Server + Client components
- **Tailwind CSS** — mobile-first
- **shadcn/ui** — composants UI
- **Zustand** — state management (stores)
- **React Hook Form + Zod** — formulaires
- **Langue** — UI, commentaires, erreurs : FRANÇAIS

---

## Design des 3 portails

| Portail | Style | Accès |
|---------|-------|-------|
| **Client** `app/(public)/` + `app/(client)/client/` | Gradient sunset premium, navy → cream | Tous |
| **Pro** `app/(pro)/pro/` | Orange/sun, Fraunces serif | Role PRO ou ADMIN |
| **Admin** `app/(admin)/admin/` | White panels, interface admin | Role ADMIN uniquement |

> **Les 3 portails ont des designs DIFFÉRENTS.** Ne réutilise PAS les composants client pour pro/admin.

---

## Les 4 états UI obligatoires

Chaque page DOIT gérer :

1. **Loading** — Skeleton shimmer (pas de spinner)
2. **Empty** — Message + CTA (ex: "Aucun voyage trouvé. Élargissez vos critères.")
3. **Error** — Toast français + bouton retry
4. **Data** — Affichage normal

---

## Ce qui existe déjà

> **CONSULTE le code frontend existant AVANT de coder.**

- 130 pages (page.tsx) sur les 3 portails
- Beaucoup de pages utilisent déjà des appels API réels avec fallback
- Composants Pro réutilisables (ProEmptyState, ProStatCard, etc.)
- Composants a11y (FocusTrap)
- Schémas Zod pour validation
- Zustand stores (useCheckoutStore, useProStore)

**NE RECODE PAS ce qui existe.** Vérifie que ça marche, corrige si besoin, complète le câblage API.

---

## Priorité : câbler le vrai API, supprimer les mocks

Pour chaque page que tu touches :
1. Vérifie si elle utilise des données mock/statiques
2. Remplace par l'appel API réel (cf. contrat)
3. Garde un fallback commenté pour le dev offline
4. Teste les 4 états (loading, empty, error, data)

---

## Validation à chaque LOT

```bash
npm run build
npm run test
npm run lint
```

Si le build casse → corrige AVANT de passer au LOT suivant.

---

## Touch targets & Responsive

- Touch targets : minimum 44×44px
- Mobile-first : toujours coder mobile d'abord
- Breakpoints : sm (640px) → md (768px) → lg (1024px) → xl (1280px)

---

## Résumé comportement

1. Lis SPRINT-COWORK.md et CONTRAT-API-COWORK.md
2. Commence par LOT F-001
3. Code, teste, valide
4. Passe au LOT suivant — SANS ATTENDRE
5. Met à jour SPRINT-COWORK.md (coche les cases)
6. **NE T'ARRÊTE JAMAIS** sauf si David dit "stop"
