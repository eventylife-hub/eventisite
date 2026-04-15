# 📚 Index Documentation Eventy

> **Eventy Life** — Plateforme SaaS + Agence de voyages de groupe
> **Domaine** : eventylife.fr
> **Dernière mise à jour** : 16 avril 2026
> **PDG** : David — eventylife@gmail.com

Ce dossier `docs/` contient la documentation vivante du projet Eventy — produit, utilisateurs, décisions, roadmap, audits.

> **Le document fondateur** est [`../AME-EVENTY.md`](../AME-EVENTY.md) à la racine. À lire en premier.

---

## 🧭 Documents maîtres — Lecture obligatoire

| Doc | Contenu | Pour qui |
|-----|---------|----------|
| [`PROJET-EVENTY-ETAT.md`](./PROJET-EVENTY-ETAT.md) | État du projet, vision, chiffres clés, stack technique & IA, features livrées / en cours / futures | Tout le monde — David, co-fondateurs, Ambassadeurs, investisseurs |
| [`VOCABULAIRE-EVENTY.md`](./VOCABULAIRE-EVENTY.md) | Référentiel officiel des termes Eventy (Voyageur, Créateur, Maison, Ambassadeur, Pôle, etc.) | Obligatoire pour tout contenu client/partenaire/équipe |
| [`PARCOURS-UTILISATEURS.md`](./PARCOURS-UTILISATEURS.md) | Flux end-to-end : Voyageur, Créateur, Ambassadeur, Maison HRA, Équipe (14 Pôles) | Produit, UX, support, onboarding |
| [`STATUT-FONCTIONNALITES.md`](./STATUT-FONCTIONNALITES.md) | Tableau page × état (✅ Live / 🟡 Partiel / 🔴 Bug / ⏳ À faire) | Priorisation produit |
| [`HISTORIQUE-DECISIONS.md`](./HISTORIQUE-DECISIONS.md) | Décisions clés structurantes (vocabulaire, Pennylane, Claude-first, parts sociales, etc.) | Nouveaux arrivants, fidélité à la vision |
| [`ROADMAP.md`](./ROADMAP.md) | Phase 1 (Standard, lancement), Phase 2 (Luxe, gamification), Phase 3 (international, .org) | Planning stratégique |

---

## 🔍 Audits & rapports techniques

| Doc | Date | Contenu |
|-----|------|---------|
| [`audit-pro-gestion-2026-04.md`](./audit-pro-gestion-2026-04.md) | 15/04/2026 | Audit 360 pages — Pro, Maisons, Ambassadeur, Équipe, Admin. Verdict production-ready. |
| [`audit-fallback-3-interfaces.md`](./audit-fallback-3-interfaces.md) | 14/04/2026 | Audit fallbacks 187 fichiers — endpoints manquants, données demo, seed prioritaire. |
| [`audit-groupes.md`](./audit-groupes.md) | 13/04/2026 | Audit système groupes viraux — backend, frontend 3 portails, feature flags manquants. |
| [`groupes-admin-controls.md`](./groupes-admin-controls.md) | 13/04/2026 | Guide des 23+ feature flags du système de groupes (admin). |

Autres audits PDG disponibles dans [`../pdg-eventy/`](../pdg-eventy/) :
- `AUDIT-HRA-FINAL-EXHAUSTIF.md` (169 Ko) — audit complet Maisons HRA
- `AUDIT-TECHNIQUE-2026-03-15.md` — audit stack technique
- `AUDIT-API-COMPLIANCE-2026-03-15.md` — conformité API
- `AUDIT-SECURITE-2026-03-18.md` — audit sécurité
- `FRONTEND-AUDIT-DETAILLE.md` — audit frontend approfondi

---

## 🏛️ Pilotage PDG — [`../pdg-eventy/`](../pdg-eventy/)

Pour le pilotage opérationnel (juridique, finance, partenaires, opérations), voir le dossier [`pdg-eventy/`](../pdg-eventy/) à la racine :

- **Stratégie & dashboard** : `DASHBOARD-PDG.md`, `README.md`, `ROADMAP-PRODUIT.md`
- **Juridique** : `01-legal/` — SAS, Atout France, RGPD, CGV
- **Finance** : `02-finance/` — budget, trésorerie, grille tarifaire
- **Partenaires** : `05-partenaires/` — stratégie, scripts commerciaux
- **RH** : `06-rh-organisation/` — organigramme, fiches de poste
- **Marketing** : `07-marketing-commercial/` — plan lancement, brand guide
- **Opérations** : `10-operations/` — process quotidiens, guide premier voyage
- **Templates emails** : `11-templates-emails/` — partenaires, clients, admin
- **Pitch** : `14-pitch/` — dossier banque/investisseur

---

## 🧩 Architecture technique — [`../`](../)

| Doc | Contenu |
|-----|---------|
| [`../CLAUDE.md`](../CLAUDE.md) | Instructions projet pour l'IA PDG |
| [`../AME-EVENTY.md`](../AME-EVENTY.md) | Document fondateur — l'âme d'Eventy |
| [`../PROGRESS.md`](../PROGRESS.md) | Historique massif des sprints techniques |
| `../backend/ARCHITECTURE.md` | Architecture NestJS (submodule) |
| `../frontend/ARCHITECTURE_OVERVIEW.md` | Architecture Next.js (submodule) |

---

## 📝 Conventions

- Toute date au format **AAAA-MM-JJ** (ex : 2026-04-16)
- Vocabulaire **OBLIGATOIRE** : voir [`VOCABULAIRE-EVENTY.md`](./VOCABULAIRE-EVENTY.md)
- Tonalité : chaleureuse, directe, honnête — voir [`../AME-EVENTY.md`](../AME-EVENTY.md) § "Le ton Eventy"
- Toute décision structurante → ajouter entrée datée dans [`HISTORIQUE-DECISIONS.md`](./HISTORIQUE-DECISIONS.md)
- Tout nouveau chantier majeur → mettre à jour [`PROJET-EVENTY-ETAT.md`](./PROJET-EVENTY-ETAT.md) + [`STATUT-FONCTIONNALITES.md`](./STATUT-FONCTIONNALITES.md)

---

*Index tenu à jour par l'IA PDG d'Eventy. En cas d'ajout d'un nouveau doc, l'indexer ici.*
