# Audit — Navigation des sidebars Pro Eventy

> **Date** : 2026-05-03
> **Branche** : claude/nifty-keller-e78896
> **Scope** : Tous les portails pros (créateur, vendeur, ambassadeur, influenceur, HRA/maisons, indépendant, indépendants multi-métiers)
> **Trigger** : Bug PDG — clic sur "Commissions HRA" depuis la sidebar pro créateur tombait sur la page Configuration Destination Revenus (`/pro/revenus/config`), totalement hors-sujet.

---

## Synthèse

| Portail | Fichier sidebar | Entrées | Bugs | Sévérité |
|---|---|---|---|---|
| **Pro / Créateur** | `frontend/app/(pro)/pro/layout.tsx` | 56 | **2** | 🔴 P0 (1 critique) |
| **Ambassadeur** | `frontend/app/(ambassadeur)/ambassadeur/layout.tsx` | 25 | 0 | ✅ |
| **Influenceur** | `frontend/app/(influenceur)/influenceur/layout.tsx` | 5 | **1** | 🟠 P1 (encodage URL) |
| **HRA / Maisons** | `frontend/app/(maisons)/maisons/layout.tsx` | 49 | 0 | ✅ |
| **Indépendant** (mono) | `frontend/app/(independant)/independant/layout.tsx` | 21 | 0 | ✅ |
| **Indépendants** (multi-métier × 10) | `frontend/app/(independants)/independants/layout.tsx` | 6 × 10 = 60 | **50** | 🟠 P1 (placeholders à générer) |

**Total bugs identifiés** : 53
**Total bugs corrigés dans ce PR** : 53

---

## Bug #1 — 🔴 CRITIQUE — `Commissions HRA` → mauvaise page

| Champ | Valeur |
|---|---|
| **Portail** | Pro / Créateur |
| **Fichier** | `frontend/app/(pro)/pro/layout.tsx:160` |
| **Label menu** | `Commissions HRA` |
| **Catégorie** | `Revenus` |
| **href actuel** | `/pro/revenus/config` |
| **Cible actuelle** | Page de configuration de destination des revenus (RIB perso/asso/split) — **rien à voir avec les commissions HRA** |
| **href attendu** | `/pro/revenus/commissions-hra` |
| **Cible attendue** | Page dédiée listant les HRA partenaires + commissions négociées + historique des commissions touchées |

**Fix** :
- Création de `frontend/app/(pro)/pro/revenus/commissions-hra/page.tsx` avec contenu cohérent (dark Eventy + ivoire + gold #D4A853, glassmorphism, Framer Motion)
- Mise à jour de l'href dans `frontend/app/(pro)/pro/layout.tsx:160`

**Contenu de la nouvelle page** :
1. KPIs commissions (total touché, en attente, taux moyen %)
2. Liste des HRA partenaires actifs du créateur (hôtels, restaurants, activités)
3. Commission négociée par HRA (% ou €)
4. Historique des commissions touchées (timeline + tableau filtrable)
5. CTA "Négocier un nouveau partenariat" → `/pro/hra`

---

## Bug #2 — 🟠 Influenceur — encodage URL accentué

| Champ | Valeur |
|---|---|
| **Portail** | Influenceur |
| **Fichier** | `frontend/app/(influenceur)/influenceur/layout.tsx:29` |
| **Label menu** | `Récompenses` |
| **href actuel** | `/influenceur/récompenses` (avec accent é) |
| **href attendu** | `/influenceur/recompenses` (sans accent — correspond au dossier `recompenses/` qui existe) |

**Symptôme** : Le clic provoque un 404 ou une URL malformée car le dossier réel est `recompenses` (sans accent). Next.js encode `é` en `%C3%A9` mais le routing ne match pas le dossier `recompenses`.

**Fix** : Remplacer `/influenceur/récompenses` par `/influenceur/recompenses` dans le menu.

---

## Bugs #3-#52 — 🟠 Indépendants multi-métiers — pages métiers manquantes

**Contexte** : Le portail `(independants)` accueille 10 métiers (accompagnateur, animateur, chauffeur, coordinateur, décorateur, fleuriste, guide, photographe, sécurité, traiteur). La sidebar définit 6 entrées par métier : Dashboard, Missions, Planning, Facturation, Formation, Profil.

**Bug** : Seule la page `dashboard/page.tsx` existe pour chaque métier. Les 5 autres entrées (Missions, Planning, Facturation, Formation, Profil) tombent en 404 → **50 routes cassées**.

**Liste exhaustive des routes 404** :

```
/independants/accompagnateur/missions
/independants/accompagnateur/planning
/independants/accompagnateur/facturation
/independants/accompagnateur/formation
/independants/accompagnateur/profil
/independants/animateur/missions
/independants/animateur/planning
/independants/animateur/facturation
/independants/animateur/formation
/independants/animateur/profil
/independants/chauffeur/missions
/independants/chauffeur/planning
/independants/chauffeur/facturation
/independants/chauffeur/formation
/independants/chauffeur/profil
/independants/coordinateur/missions
/independants/coordinateur/planning
/independants/coordinateur/facturation
/independants/coordinateur/formation
/independants/coordinateur/profil
/independants/decorateur/missions
/independants/decorateur/planning
/independants/decorateur/facturation
/independants/decorateur/formation
/independants/decorateur/profil
/independants/fleuriste/missions
/independants/fleuriste/planning
/independants/fleuriste/facturation
/independants/fleuriste/formation
/independants/fleuriste/profil
/independants/guide/missions
/independants/guide/planning
/independants/guide/facturation
/independants/guide/formation
/independants/guide/profil
/independants/photographe/missions
/independants/photographe/planning
/independants/photographe/facturation
/independants/photographe/formation
/independants/photographe/profil
/independants/securite/missions
/independants/securite/planning
/independants/securite/facturation
/independants/securite/formation
/independants/securite/profil
/independants/traiteur/missions
/independants/traiteur/planning
/independants/traiteur/facturation
/independants/traiteur/formation
/independants/traiteur/profil
```

**Fix** :
- Création d'un composant partagé `IndependantSectionPlaceholder` (premium, dark, gold accent) dans `frontend/app/(independants)/independants/_components/`
- Création de 50 pages wrappers (chacune ~6 lignes) qui montent ce composant avec les bons paramètres (métier, section).
- Le placeholder affiche : nom métier, nom section, "En cours de finalisation", roadmap visible (3-4 features prévues), CTA retour Dashboard.

---

## Pages vérifiées OK (pas de bug détecté)

### Pro / Créateur — 56 entrées vérifiées
Toutes les routes pointent vers une page existante, **sauf le bug #1 ci-dessus**.

Sections auditées :
- Tableau de bord (Dashboard principal, Statistiques, Notifications)
- Mes Voyages (Créer, En cours, Passés, Brouillons, Multi-voyages, Calendrier, Réservations)
- Vendre en 3 minutes (Offre rapide, Templates, Dupliquer, Mini-landing, Lien paiement, Réservation assistée)
- Mes HRA (Hôtels, Restaurants, Négociations, Hôteliers, Restaurateurs)
- Transport (Bus ramassage, Bus sur place, Devis, Multi-bus, Charters)
- Activités (Mes activités, Créer, Communauté, Catalogue, Calendrier)
- Mon Équipe (Accompagnateurs, Guides, Planning terrain, Guide accompagnateur, Annuaire)
- Énergie & Codes (QR, Redistribution, Stats, Hauts faits, Classement)
- Revenus (Par voyage, **Commissions HRA ❌**, Historique paiements, Cotisations, Wallet, Comptabilité)
- Marketing (Flyers, Campagnes, Réseaux, Médias, Studio IA, Visuels, Kit média)
- Documents (Contrats, Factures, Certifications)
- Paramètres (Profil, Préférences, Compte, Support)

### Ambassadeur — 25 entrées vérifiées
Toutes valides. Sections : Dashboard, Réseau, Filleuls, Parrainages, Ventes, Catalogue, Clients, Missions, Statistiques, Commissions, Wallet, Recharge, Récompenses, Outils, QR Code, Partager, Créations, Innover, Classement, Impact, Messagerie, Profil, Documents, Formation, Support.

### HRA / Maisons — 49 entrées vérifiées
Toutes valides. Catégories complètes : Hébergement, Restauration, Activités, Clients, Énergie, Revenus, Vendre en 3min, Documents, Configuration.

### Indépendant (mono-métier) — 21 entrées vérifiées
Toutes valides. Sections : Activités, Disponibilités, Tribus, Urgence, Revenus, Finance, Documents, Portfolio, Certifications, Formation, Profil, Énergie, Gaming Impact, Chat, Partager, Support.

---

## Pistes futures (hors-scope ce PR)

```ts
// TODO Eventy: tests E2E navigation par rôle pro
//   → Cypress / Playwright : pour chaque portail, click chaque entrée sidebar,
//     assert URL match + page render OK.
// TODO Eventy: middleware vérifie rôle utilisateur ↔ portail pro
//   → ex: un utilisateur "createur" ne peut pas accéder à /maisons/* .
//     Aujourd'hui tout passe (Auth check uniquement, pas de role-gating).
// TODO Eventy: redirection auto si mauvais portail
//   → si user "ambassadeur" tape /pro/* → redirect vers /ambassadeur/dashboard.
```

Autres améliorations identifiées :
- Centraliser les NAV configs dans `frontend/lib/navigation/` (1 fichier par portail) au lieu d'inliner dans chaque `layout.tsx`. Bénéfice : tests automatiques de cohérence href ↔ filesystem.
- Ajouter un script CI `scripts/check-nav-links.ts` qui parcourt tous les NAV configs et vérifie que chaque href correspond à un `page.tsx` existant. Bloque tout merge avec un href cassé.
- Audit visuel : capturer chaque page de chaque portail et flagger celles qui sont "vides" (placeholder sans contenu).

---

## Récapitulatif des fichiers modifiés

### Créés
- `frontend/app/(pro)/pro/revenus/commissions-hra/page.tsx` — Page dédiée Commissions HRA (premium dark + gold)
- `frontend/app/(independants)/independants/_components/MetierSectionPlaceholder.tsx` — Composant partagé placeholder
- `frontend/app/(independants)/independants/{metier}/{section}/page.tsx` × 50 — Wrappers placeholder

### Modifiés
- `frontend/app/(pro)/pro/layout.tsx` — Fix href Commissions HRA
- `frontend/app/(influenceur)/influenceur/layout.tsx` — Fix encodage Récompenses

**Aucun fichier n'a été supprimé** — règle absolue Eventy respectée.
