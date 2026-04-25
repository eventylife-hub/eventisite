# TODO — Chiffrage Monétaire Global (Tous Employés Eventy)
> Portail : `frontend/app/(equipe)/equipe/`  
> Style : dark `bg-[#0A0E14]` · gold `#D4A853` · Framer Motion · Recharts  
> Date audit : 2026-04-25

---

## Principe directeur

Chaque employé Eventy doit pouvoir **piloter financièrement** son domaine :
- Voir les revenus générés par ses actions
- Mesurer le coût de ses opérations
- Calculer la marge nette de son périmètre
- Comparer vs objectifs et vs période précédente

---

## 1. Équipe Gaming (`/equipe/gamification`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Revenus sponsors gaming | Σ contrats actifs / mois | `gamification/sponsors` |
| Coût énergie distribuée | Pts distribués × taux palier moyen | `gamification/energie` |
| ROI par sponsor | (Revenus - Coût récompenses) / Revenus | `gamification/sponsors` |
| Marge gaming nette | Revenus - Coût récompenses - Coût animation | `gamification/page` |
| CPE (coût/engagement) | Budget sponsor / Joueurs engagés | `gamification/sponsors` |
| Valeur énergie en circulation | Σ soldes clients × taux conversion | `gamification/energie` |
| Budget énergie restant | Budget mensuel - Distribué | `gamification/energie` |
| Revenus événements saisonniers | Σ contrats événementiels | `gamification/analytics` |

### Pages à créer/enrichir
- [ ] `gamification/sponsors/page.tsx` — P0
- [ ] `gamification/analytics/page.tsx` — P0 (avec Recharts)
- [ ] Enrichir `gamification/page.tsx` — section finance P0
- [ ] Enrichir `gamification/energie/page.tsx` — section coûts P1

---

## 2. Équipe Voyages (`/equipe/voyage`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| CA par voyage | Σ réservations confirmées × tarif | `voyage/listing` |
| Marge par destination | CA - Coûts directs (HRA+transport+guide) | `voyage/[id]` |
| Commissions créateurs | 18% du CA net × nombre créateurs | `voyage/independants` |
| Taux de remplissage | Réservations / Capacité max | `voyage/[id]` |
| Revenu par voyageur | CA / Nombre voyageurs | `voyage/[id]` |
| Breakeven point | Coûts fixes / Marge unitaire | `voyage/[id]` |
| CA prévisionnel M+1 | Voyages confirmés × taux conversion | `voyage/page` |
| GoNoGo financier | Atteint le seuil ? (revenus vs coûts) | `voyage/[id]` |

### Pages à enrichir
- [ ] `voyage/page.tsx` — ajouter KPIs CA, marge, prévisions P0
- [ ] `voyage/[id]/page.tsx` — section finance (CA, marge, breakeven) P0
- [ ] `voyage/listing/page.tsx` — colonne CA + marge dans le tableau P1
- [ ] `voyage/independants/page.tsx` — commissions par créateur P1

---

## 3. Équipe HRA (`/equipe/hra`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Revenus HRA | Σ factures maisons × commission Eventy | `hra/page` |
| Conversion énergie | Pts énergie dépensés en avantages HRA (€) | `hra/page` |
| Coût avantages négociés | Valeur avantages accordés (€) | `hra/negociations` |
| Marge par maison | (Commission - Coût gestion) | `hra/listing` |
| CA par catégorie HRA | Hôtel / Resto / Activité / Spa... | `hra/page` |
| Taux de remplissage | Nuits/couverts réservés / Capacité | `hra/listing` |
| Avantages energy consommés | Σ pts énergie × valeur EUR | `hra/page` |
| ROI HRA | (Revenus HRA - Coût gestion) / Coût gestion | `hra/page` |

### Pages à enrichir
- [ ] `hra/page.tsx` — dashboard financier (revenus, conversion énergie, marge) P0
- [ ] `hra/listing/page.tsx` — colonne CA + commission par maison P1
- [ ] `hra/negociations/page.tsx` — coût avantages négociés vs valeur client P1

---

## 4. Équipe Transport (`/equipe/transport`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Coût par trajet | Facture loueur / Nbr voyageurs | `transport/page` |
| Revenu transport | Σ part transport dans le prix voyage | `transport/page` |
| Marge transport | Revenu - Coût loueur - Coût coordination | `transport/page` |
| Coût km moyen | Facture totale / Km parcourus | `transport/page` |
| Taux d&apos;occupation | Voyageurs / Capacité bus | `transport/page` |
| Surplus billets | Revenus billets surplus vendus | `transport/billets-surplus` |
| Budget flotte | Dépenses vs budget mensuel transport | `transport/page` |

### Pages à enrichir
- [ ] `transport/page.tsx` — ajouter section finance (coûts, marges, budget) P0
- [ ] `transport/billets-surplus/page.tsx` — revenus billets surplus P1

---

## 5. Équipe Support (`/equipe/support`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Coût par ticket | Budget support / Nbr tickets résolus | `support/page` |
| Temps moyen résolution | Σ durée tickets / Nbr tickets | `support/tickets` |
| Coût annulation | Pénalités + remboursements gérés | `support/page` |
| Ticket → fidélisation | % clients qui rebookent après support | `support/page` |
| NPS équipe support | Score Net Promoter post-résolution | `support/page` |
| Budget support mensuel | Heures × tarif horaire équipe | `support/page` |

### Pages à enrichir
- [ ] `support/page.tsx` — KPIs coût/ticket + budget + NPS P1
- [ ] `support/tickets/page.tsx` — colonne temps résolution + coût P1

---

## 6. Équipe Marketing (`/equipe/marketing`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Budget dépensé | Σ dépenses SEO + Ads + Social | `marketing/page` |
| CAC (Coût Acquisition Client) | Budget / Nouveaux clients | `marketing/page` |
| ROI campagnes | (CA généré - Budget) / Budget | `marketing/page` |
| CLV (Valeur Vie Client) | CA moyen par client × durée fidélité | `marketing/page` |
| CPL (Coût par Lead) | Budget / Leads générés | `marketing/page` |
| Taux conversion lead→résa | Réservations / Leads | `marketing/page` |
| ROI affiliation ambassadeurs | CA ambassadeurs × 5% / Coût gestion | `marketing/innovation` |
| Budget restant | Budget mensuel - Dépensé | `marketing/page` |

### Pages à enrichir
- [ ] `marketing/page.tsx` — dashboard financier (budget, CAC, ROI) P0
- [ ] `marketing/innovation/page.tsx` — ROI ambassadeurs + affiliation P1
- [ ] `marketing/templates/page.tsx` — ROI par canal de communication P2

---

## 7. Équipe Finance (`/equipe/finance`)

### Pages déjà partiellement complètes — enrichissements

| Page | Ajout requis | Priorité |
|------|-------------|----------|
| `finance/page.tsx` | Graphique Recharts CA 12 mois (AreaChart) | P0 |
| `finance/virements/page.tsx` | Synthèse virements par type (BarChart) | P1 |
| `finance/factures/page.tsx` | Ageing balance (chart créances) | P1 |
| `finance/rapprochement/page.tsx` | Taux rapprochement auto vs manuel | P1 |
| `finance/avances/page.tsx` — manquant | Créer page avances HRA + voyage | P0 |

---

## 8. Équipe Talents/RH (`/equipe/talents`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Coût recrutement créateur | Temps formation × tarif horaire | `talents/page` |
| Revenu généré par créateur | CA voyages × 82% (part Eventy) | `talents/page` |
| ROI formation | (CA généré - Coût formation) / Coût | `talents/page` |
| Taux de rétention créateurs | Créateurs actifs 6 mois / Total recruté | `talents/page` |
| Commission payée mensuelle | Σ payouts Stripe créateurs | `talents/page` |

### Pages à enrichir
- [ ] `talents/page.tsx` — KPIs financiers créateurs P1

---

## 9. Équipe Qualité (`/equipe/qualite`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Coût d&apos;un incident qualité | Remboursements + compensation × fréquence | `qualite/page` |
| Valeur d&apos;une note 5★ | CLV × taux rebooking note 5★ | `qualite/page` |
| ROI formation qualité | Réduction incidents × coût incident | `qualite/page` |

---

## 10. Équipe Sécurité (`/equipe/securite`)

### KPIs financiers manquants

| KPI | Calcul | Page cible |
|-----|--------|------------|
| Coût incident sécurité | Gestion + assurance + remboursement | `securite/page` |
| Budget sécurité mensuel | Coûts récurrents + formation | `securite/page` |
| ROI prévention | Incidents évités × coût moyen incident | `securite/page` |

---

## Composant partagé recommandé

Créer `components/equipe/FinanceKpiGrid.tsx` :

```tsx
interface FinanceKpi {
  label: string
  value: string
  sub?: string
  color?: string
  trend?: number // % vs période précédente
}

// Usage dans chaque pôle
<FinanceKpiGrid kpis={FINANCE_KPIS} columns={4} />
```

---

## Priorités d&apos;exécution

### Sprint 1 (P0 — Immédiat)
1. Gaming : sponsors + analytics + enrichissement page principale
2. Voyages : section finance voyage/page + voyage/[id]
3. Marketing : dashboard budget/CAC/ROI
4. Finance : graphique Recharts CA 12 mois

### Sprint 2 (P1 — Semaine suivante)
5. HRA : dashboard financier
6. Transport : section finance
7. Support : KPIs coût/ticket
8. Talents : ROI créateurs

### Sprint 3 (P2 — 2 semaines)
9. Qualité : KPIs financiers
10. Sécurité : budget + ROI prévention
11. Composant partagé FinanceKpiGrid
