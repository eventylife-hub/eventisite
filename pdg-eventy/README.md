# EVENTY — Projet PDG / Pilotage Entreprise

> **PDG** : David (eventylife@gmail.com)
> **Statut** : Pré-création — Beta test en cours
> **Budget enveloppe** : 15 000€ - 50 000€
> **Activité** : Plateforme tech SaaS + Agence de voyages de groupe
> **Fichiers** : 30 fichiers / 14 dossiers

---

## Fichiers racine

| Fichier | Description |
|---------|-----------|
| `DASHBOARD-PDG.md` | Dashboard central — statut de tous les domaines |
| `DASHBOARD-EVENTY.html` | **Dashboard interactif** — 7 onglets, simulateurs transport + devis |
| `BUDGET-EVENTY.xlsx` | **Budget Excel** — 4 onglets, 72 formules, simulateur transport |
| `PDG-EVENTY-COMPLET.zip` | **Archive ZIP** — Tous les fichiers en un seul download |

## Structure du projet

| Dossier | Fichiers | Contenu |
|---------|----------|---------|
| `01-legal/` | 7 | Structure juridique, immatriculation, RGPD, CGV, contrat partenaire, mentions légales, checklist avocat |
| `02-finance/` | 3 | Budget prévisionnel, trésorerie M0-M12, grille tarifaire |
| `03-transport/` | 1 | Comparatif prestataires transport + prix |
| `04-hebergement-infra/` | 1 | Comparatif cloud (Scaleway, OVH, AWS, Vercel) |
| `05-partenaires/` | 2 | Stratégie partenaires + suivi/tracking |
| `06-rh-organisation/` | 1 | Organigramme phases 1-3, fiches de poste, workflows |
| `07-marketing-commercial/` | 1 | Plan lancement, SEO, ads, KPIs, offres |
| `08-assurance-conformite/` | 2 | RC Pro + garantie financière APST |
| `09-site-beta/` | 2 | Suivi beta + plan de déploiement production |
| `10-operations/` | 1 | Process quotidiens, KPIs, routines |
| `11-templates-emails/` | 3 | Templates : partenaires (7), clients (8), administratif (4) |
| `12-checklist-lancement/` | 1 | Checklist 8 phases de lancement |
| `13-comptabilite/` | 2 | Guide TVA marge + modèle facture |
| `14-pitch/` | 1 | Dossier présentation banque/investisseur |

---

## Priorités immédiates (avant création société)

1. **Créer la SAS** → `01-legal/STRUCTURE-JURIDIQUE.md`
2. **Trouver avocat + expert-comptable** → `01-legal/CHECKLIST-AVOCAT.md` + `13-comptabilite/GUIDE-COMPTABLE.md`
3. **Obtenir la garantie financière APST** → `08-assurance-conformite/GARANTIE-FINANCIERE.md`
4. **Souscrire RC Pro** → `08-assurance-conformite/RC-PRO.md`
5. **Déposer dossier Atout France** → `01-legal/IMMATRICULATION-ATOUT-FRANCE.md`
6. **Ouvrir compte pro + financement** → `14-pitch/PITCH-BANQUE.md`
7. **Déployer en production** → `09-site-beta/PLAN-DEPLOIEMENT.md`

---

## Projet technique

| Élément | Détail |
|---------|--------|
| Backend | `../backend/` — NestJS 10, 29 modules, 252 fichiers source |
| Frontend | `../frontend/` — Next.js 14 App Router, 20+ pages |
| Tests | 3 300+ (3 301 pass), 7 audits backend complétés |
| Prisma | 3 232 lignes de schema |
| CI/CD | 4 workflows GitHub Actions |
| Docker | docker-compose.yml prêt |
| Module HRA | 24 endpoints fournisseurs, 40 tests |
| Lignes totales | 290 477 |
