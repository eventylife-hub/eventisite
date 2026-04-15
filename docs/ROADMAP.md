# 🗺️ Roadmap Eventy Life

> **Dernière mise à jour** : 16 avril 2026
> **3 phases** : Standard & lancement · Luxe & gamification · International & Fondation.
>
> Ce document fixe la direction produit. Pour le détail du statut des pages, voir [`STATUT-FONCTIONNALITES.md`](./STATUT-FONCTIONNALITES.md). Pour l'historique des décisions, voir [`HISTORIQUE-DECISIONS.md`](./HISTORIQUE-DECISIONS.md).

---

## 🎯 Objectifs par phase

| Phase | Période | Objectif | Voyageurs | CA |
|-------|---------|----------|-----------|----|
| **Phase 1 — Standard & Lancement** | Q2 2026 | Lancer la gamme Standard à l'échelle (1→3 bus) | ~1 432 Y1 | ~500 000€ Y1 |
| **Phase 2 — Luxe, Gamification, Bracelets** | H2 2026 | Ouvrir la gamme Luxe + features virales | ~3 500 | ~1.5M€ |
| **Phase 3 — International & Fondation** | 2027+ | International + Fondation .org | ~10 000+ | ~5M€+ |

---

# 🚀 Phase 1 — Standard & Lancement

**Dates cibles** : lancement public Q2 2026 (avril-mai-juin).
**Objectif** : premier vrai voyage commercial, puis montée en cadence 1 bus/mois → 3 bus/mois.

## 1.1 — Pré-lancement (avril-mai 2026) — 🟡 En cours

### Produit
- [x] ✅ **Backend live** Scaleway (31 modules NestJS, PM2 + Nginx)
- [x] ✅ **Frontend live** Vercel (360 pages)
- [x] ✅ **Audit 360 pages** verdict production-ready (commit `ba60dcb`)
- [x] ✅ **Vocabulaire officiel** Voyageur/Créateur/Ambassadeur/Maison/Pôle
- [x] ✅ **Fiche voyage Netflix** — tabs, vidéo, carte, balade virtuelle
- [x] ✅ **Wizard création voyage** — 8 rubriques ergonomique + auto-sélection médias
- [x] ✅ **Tarification wizard** — cascade coût complète HRA → assurance → transport → marge 15% (7+3+5) → TVA
- [x] ✅ **Bibliothèque médias Créateur** `/pro/medias/`
- [x] ✅ **Validation Phase 1 Pôle Qualité** — audit IA + relecture humaine
- [x] ✅ **14 cockpits Pôles** complets avec VolumeWidget
- [x] ✅ **Mega-nav admin** — 5 groupes, command palette ⌘K, badges, switch pays/gamme
- [x] ✅ **Marketing niveau 2+3** — câblage voyages, funnel, campaigns, content, acquisition, rétention, referral, advocacy, segments
- [x] ✅ **Système groupes viraux** — 4 types, 23 feature flags, 3 portails (client/pro/admin), landing SEO
- [x] ✅ **Rooming auto** connecté au RoomingBoard
- [x] ✅ **Taxes internationales** 12 pays, calcul auto, provisions, manifeste J-7
- [x] ✅ **RBAC 14 rôles** backend + filtrage sidebar
- [x] ✅ **Feature flags système** avec break-glass + 4-eyes approval
- [x] ✅ **Rays ☀️** — monnaie marketing EventyLife
- [x] ✅ **Cookies de Fidélité** — programme fidélité Voyageur
- [x] ✅ **Vitrine Créateur publique** — aperçu live, stats, avis
- [x] ✅ **Seed 10 voyages réels + 10 profils Créateurs**

### À finir avant lancement
- [ ] ⏳ **Stripe Connect payouts Créateurs** — ~8h (P0)
- [ ] ⏳ **Upload photos modal voyages** — ~3h (P0)
- [ ] ⏳ **Export rooming PDF/CSV** — ~2h (P1)
- [ ] ⏳ **Pennylane sync + exports FEC** — ~6h (P1)
- [ ] ⏳ **Backend endpoints Maisons / Ambassadeur** (remplacer demo) — ~12h (P1)
- [ ] ⏳ **Endpoints manquants** : `/public/creators/:slug`, `/hra/catalog`, `/hra/loueurs`, `/pro/independents` — ~6h
- [ ] ⏳ **Fix 3 chemins `/api/*` incorrects** — ~30min (P1)
- [ ] ⏳ **Skeleton loading batch ~80 pages /pro** — ~4h (P2)
- [ ] ⏳ **IntersectionObserver géocoding arrêts** — ~3h (P2)
- [ ] ⏳ **SSR pages publiques** (vitrine Créateur) — ~2h (SEO)

### Juridique & admin (Pôle Juridique + Finance)
- [ ] ⏳ **Créer la SAS** (statuts, immatriculation)
- [ ] ⏳ **Expert-comptable signé** (Chevalier Conseil)
- [ ] ⏳ **Avocat tourisme signé**
- [ ] ⏳ **Garantie financière APST** obtenue
- [ ] ⏳ **RC Pro** souscrite
- [ ] ⏳ **Immatriculation Atout France** déposée et obtenue
- [ ] ⏳ **Compte pro** ouvert
- [ ] ⏳ **Financement** (pitch banque/investisseur)
- [ ] ⏳ **DNS Cloudflare** finalisé (NS `magali` + `rocco`)
- [ ] ⏳ **Rotation credentials DB** (Neon exposé dans .env)

### Équipe (Pôle Talents)
- [ ] ⏳ **Recruter 3-5 premiers co-fondateurs** (Finance, Marketing, Qualité en priorité)
- [ ] ⏳ **Onboarder 10 Créateurs validés** (hors seed demo)
- [ ] ⏳ **Onboarder 5 Ambassadeurs pilotes** (tabacs, coiffeurs, CE)
- [ ] ⏳ **Onboarder 15 Maisons HRA partenaires** (hôtels, restos, guides)

## 1.2 — Premier voyage commercial (mai-juin 2026)

- [ ] **Voyage pilote** : destination Marrakech ou Barcelone (bus 53)
- [ ] **J-90 à J+7** checklist opérationnelle (`pdg-eventy/10-operations/GUIDE-PREMIER-VOYAGE.md`)
- [ ] **Suivi temps réel** pendant voyage (WebSocket, position bus, incidents)
- [ ] **Debrief voyage** avec Créateur + Voyageurs
- [ ] **Close Pack financier** (bilan définitif, reversements Créateur + Maisons)
- [ ] **Publication témoignages** (vidéo + écrit)
- [ ] **Analyse KPIs** : NPS, taux recommandation, marge réelle

## 1.3 — Montée en cadence (juin-décembre 2026)

- [ ] 1 bus/mois (juin) → 2 bus/mois (septembre) → 3 bus/mois (décembre)
- [ ] **Phase 2 transport** : allotement avion (Phase 2 du bus complet = 2 bus + vol)
- [ ] Objectif fin 2026 : ~500 000€ CA, ~1 432 Voyageurs, 20-30 Créateurs actifs

---

# 💎 Phase 2 — Luxe, Gamification, Bracelets (H2 2026 → 2027)

**Objectif** : élargir l'offre avec la gamme Luxe + renforcer le K-factor viral + engagement long terme.

## 2.1 — Gamme Luxe

- [ ] **Maisons 5★** onboardées (20+ hôtels prestige Europe)
- [ ] **Transport luxe** : voitures privées, chauffeurs, charters, jets privés
- [ ] **Expériences VIP** : dîners privés, visites hors-horaires, rencontres artistes
- [ ] **Petits groupes** 15-25 pax (pas le bus 53)
- [ ] **Prix 2 000-5 000€/pax**
- [ ] **Coordination VIP** : wedding planners, coordinateurs
- [ ] **Sécurité VIP** : agents privés, protocoles
- [ ] **Activer le switch gamme** dans mega-nav admin
- [ ] **Portail Voyageur dédié** Luxe (sélecteur gamme)

## 2.2 — Gamification & Engagement

- [ ] **Rays ☀️ niveau 2** — challenges avancés, lots physiques, ambassadeurs Rays
- [ ] **Niveaux Voyageur** — débutant, régulier, globe-trotter, ambassadeur
- [ ] **Badges & quêtes** — visiter X destinations, recommander N amis, voyager à Y saisons
- [ ] **Classements** — top Voyageurs mois, top Créateurs, top Ambassadeurs
- [ ] **Rewards tangibles** — Cookies de Fidélité convertibles en bons voyage

## 2.3 — Bracelets restaurateur

- [ ] **Bracelets physiques** identifiants Voyageurs Eventy
- [ ] **Partenariat Maisons restos** — tables réservées pour bracelets Eventy
- [ ] **Dashboard restaurant** — voir les Voyageurs Eventy attendus, menu, allergies

## 2.4 — Écosystème viral

- [ ] **Tribus** — communautés de Voyageurs qui refont des voyages ensemble
- [ ] **Salon Voyage annuel** — événement physique Paris, Créateurs + Maisons + Voyageurs
- [ ] **Voyage co-créé** — mariage, EVJF/EVG, anniversaire (wizard dédié)
- [ ] **Arbre viral** — top parrains, visualisation K-factor
- [ ] **Prix dégressifs groupe** — -5% à 10 pax, -10% à 20 pax
- [ ] **Personnalisation groupe** — thème, couleur, playlist, photo cover
- [ ] **Chat de groupe** (WebSocket — feature flag OFF actuellement)
- [ ] **Cagnotte groupe** (feature flag OFF actuellement)
- [ ] **Souvenirs post-voyage** — timeline partagée, photos, vidéo récap

## 2.5 — Opérations scale

- [ ] **Charter avion A320** opéré (159 pax, -35 à -50% vs régulier)
- [ ] **2e ville de lancement** — Lyon, Marseille, ou Bordeaux
- [ ] **20 Ambassadeurs actifs**
- [ ] **50+ Créateurs actifs**
- [ ] **80+ Maisons HRA actives**
- [ ] **Ouverture premiers postes salariés** (Pôle Support, Tech) — CA > 80k€/mois

---

# 🌍 Phase 3 — International & Fondation (2027+)

**Objectif** : internationalisation + impact social.

## 3.1 — International

- [ ] **Destinations intercontinentales** — Asie (Thaïlande, Japon, Inde), Amérique, Afrique
- [ ] **Marketplace international Ambassadeurs** — multi-pays, multi-devises
- [ ] **Mega-nav switch pays actif** — déjà cablé UI
- [ ] **Hubs régionaux** Europe (Madrid, Lisbonne, Rome, Berlin)
- [ ] **Conformité juridique** par pays
- [ ] **Équipes locales** — Pôles régionaux (responsable par hub)

## 3.2 — Fondation Eventy .org

> **Vision** : faire voyager ceux qui n'en ont pas les moyens.

- [ ] **Statut association loi 1901** créé
- [ ] **Programme jeunes** — lycéens, étudiants en rupture
- [ ] **Programme seniors** — seniors isolés, EHPAD
- [ ] **Programme associations** — voyage solidaire, culturel, inclusif
- [ ] **Financement croisé** — % de chaque voyage Eventy commercial → Fondation
- [ ] **Bénévolat Créateurs** — chaque Créateur encouragé à faire 1 voyage .org /an

## 3.3 — Scale opérationnelle

- [ ] **200+ voyages/semaine/pays**
- [ ] **Charter B737** (189 pax)
- [ ] **Hubs Maisons VIP** exclusifs
- [ ] **BI avancée** (Pôle Data) — cohortes, forecasting, LTV
- [ ] **Équipes salariées** — ~40-60 personnes (au-delà des 14 co-fondateurs)
- [ ] **Série A** — levée de fonds ~10-20M€
- [ ] **Partenariats stratégiques** — Booking, Expedia, Voyages-SNCF pour distribution

---

## 🧭 Indicateurs de succès (North Stars)

| KPI | Phase 1 | Phase 2 | Phase 3 |
|-----|---------|---------|---------|
| Voyageurs / an | 1 432 | 3 500 | 10 000+ |
| CA / an | 500 000€ | 1.5M€ | 5M€+ |
| Marge brute / an | 119 000€ | 450 000€ | 1.5M€+ |
| NPS Voyageur | > 60 | > 70 | > 75 |
| K-factor viral | 1.2 | 1.8 | 2.5 |
| Créateurs actifs | 20-30 | 50-80 | 200+ |
| Maisons partenaires | 30-50 | 150+ | 500+ |
| Ambassadeurs | 10-20 | 50-100 | 300+ |
| Taux remplissage bus | 80% (43/53) | 90% (48/53) | 95% (50/53) |
| Uptime plateforme | 99.5% | 99.9% | 99.99% |

---

## 🚦 Jalons critiques

| Date | Jalon | Pôle porteur |
|------|-------|--------------|
| **Avril 2026** | Câblage Stripe Connect + Pennylane | Finance + Tech |
| **Avril 2026** | SAS créée + Atout France déposé | Juridique |
| **Avril-Mai 2026** | Garantie APST + RC Pro obtenues | Juridique |
| **Mai 2026** | 1er voyage commercial | Voyage + Qualité |
| **Juin 2026** | 3 co-fondateurs signés | Talents |
| **Septembre 2026** | 2 bus/mois | Voyage + Commercial |
| **Décembre 2026** | 3 bus/mois + 500k€ CA Y1 | Direction |
| **Q1 2027** | Lancement gamme Luxe | Produit + Maisons |
| **Q2 2027** | 1er charter A320 opéré | Transport |
| **2027** | Série A | Direction + Finance |
| **2027-2028** | Fondation .org créée | Direction + Juridique |

---

*Roadmap vivante — à réviser chaque trimestre avec les 14 Pôles. Prochaine révision : juillet 2026.*
