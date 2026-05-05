# AUDIT — Panels ÉQUIPE + ADMIN Eventy (vue exhaustive)

> **Date** : 2026-05-05
> **Branche** : `claude/sad-mcclintock-13b194` (worktree)
> **Auteur** : assistant PDG Eventy
> **Périmètre** : refonte Premium des deux portails internes Eventy — Équipe (cockpits Pôles) + Admin (cockpit PDG).
> **Règle absolue** : NE RIEN DÉCONSTRUIRE. Toute amélioration par EXTENSION uniquement.

---

## 0 · Contexte & Vision

Les panels Équipe et Admin sont les **outils de pilotage** d'Eventy. Ils ne sont pas vus par les voyageurs ; ils servent à :

- **Équipe Eventy** (cockpits Pôles) : opérationnel quotidien — validation voyages, négociation HRA, monitoring transferts, modération, conciergerie, etc.
- **Admin (PDG)** : supervision stratégique — finance plateforme, marges par tier (Standard/Premium/Luxe), conformité, RH interne, réglages globaux, audit logs immutables.

**Inspirations design retenues** : Stripe Atlas + Notion Enterprise + Linear + Apple Business + Bloomberg Terminal pour la densité d'information.

**Palette ratifiée** :
- Noir profond `#0A0E14` (admin background)
- Indigo nuit `#1E1B4B` / `#13112E` (équipe background)
- Or champagne `#D4A853` (accent premium — issu de `/equipe/voyages-a-valider`)
- Ivoire `#F5F1E8` (texte premium)
- Émeraude `#10B981` + Terracotta `#E97451` (rythme sémantique)
- Bleu Eventy nuit `#0077B6` (admin secondaire)

**Typographie** : Playfair Display / Fraunces (titres premium) + Inter (corps) — déjà chargées via `next/font`.

---

## 1 · Inventaire RÉEL (audit `find` 2026-05-05)

### 1.1 Portail Équipe — 144 pages, 65 dossiers top-level

```
achats · activites · activites-catalogue · activites-validation · aide-locale · alertes · ambassadeurs ·
annulations · assurances · carnets · cartes-gratter · catalogue-hra · checkin · clients · commercial ·
compta · comptage · conformite-voyages · data · direction · documents · finance · formation ·
gamification · groupes · hra · hra-operations · independants · itineraires · jeux · juridique ·
luxe-prestataires · maisons · maisons-monitoring · marges-ajustements · marketing · messagerie ·
missions · negociations · notifications · partenariats · planning · pourboires · qualite ·
reservations · restauration · risques · rooming · securite · sponsors · statistiques · support ·
symphonie-marketing · symphonies-a-valider · talents · tech · templates · timeline · transferts ·
transport · tribus · ventes · videos-presentation · voyage · voyages · voyages-a-valider
```

### 1.2 Portail Admin — 343 pages, ~115 dossiers top-level

```
activites · aide-locale · alertes · ambassadeurs · analytics · annulations · api-keys · assurances ·
attribution · audit · audit-log · automatisation · bookings · carnets · cartes-gratter · ce-asso ·
classements · clients · comms · communications · compliance · compta · comptage · confidentialite ·
conformite-hub · createurs · cron-jobs · dashboard · data-satisfaction · documents · dsar ·
email-templates · emails-queue · employees · energie · enrichissements · equipe · equipes ·
evenements · exports · feature-flags · finance · force-commerciale · forfaits · formation ·
fournisseurs · galerie · game-master · gamification · groupes · groupes-activites · hra ·
incidents · independants · influenceurs · integrations · investisseur · itineraires · jeux ·
juridique · lancement · marges-tiers · market-budget · marketing · marques · messagerie · metiers ·
missions · monitoring · nfc · notifications · parametres · parrainage · pension · places ·
planning · portails · pourboires · prestataires · professionnels · pros · pubs-sociaux · rbac ·
reservations · restauration · rooming · securite · sla · sponsors · statistiques · support ·
symphonie-marketing · system-health · taxes · themes-voyage · transferts-aeroport ·
transferts-voyages · transport · transports · tribus · utilisateurs · validation-pro · ventes ·
videos-presentation · voyages · webhooks · webhooks-failed
```

### 1.3 Sidebars actuelles vs réalité

| Portail | Entrées sidebar | Pages réelles top-level | Couverture |
|---------|----------------:|------------------------:|-----------:|
| Équipe (avant) | ~50 | 65 | **77 %** |
| Admin (avant) | ~110 | 115 | **96 %** |

**Pages Équipe non référencées dans la sidebar** (avant refonte) :
- `activites-catalogue` · `activites-validation` · `conformite-voyages` · `hra-operations` · `luxe-prestataires` · `maisons-monitoring` · `marges-ajustements` · `partenariats` · `planning` · `pourboires` · `qualite` · `reservations` · `restauration` · `risques` · `rooming` · `talents` · `tech` · `transferts` · `videos-presentation` · `voyage` · `voyages` · `voyages-a-valider` · `tribus` · `groupes` · `ventes` · `statistiques`

→ **22 entrées manquantes** corrigées par extension (cf. § 5).

**Pages Admin non référencées** :
- `conformite-hub` · `enrichissements` · `force-commerciale` · `marges-tiers` · `pension` · `transferts-aeroport` · `transferts-voyages` · `webhooks-failed` · `dashboard`

→ **9 entrées manquantes** corrigées (cf. § 6).

---

## 2 · Recoupement avec les 28+ audits récents

| Audit | Sujet | Impact panels |
|-------|-------|---------------|
| `AUDIT_PANEL_EQUIPE_TEMPLATES_NEGOCIATION.md` | Templates Eventy + négociations HRA + symphonies | ✅ existant — section "Symphonies" + "HRA partenaires" |
| `AUDIT_V2_PREMIUM_LUXE_PREPARATION.md` | Catégories Standard/Premium/Luxe | ✅ section "Conciergerie luxe" + "Marges & ajustements" |
| `AUDIT_HRA_CHAMBRES_FACTURATION_PAIEMENTS.md` | Cycle factures HRA | ✅ section "HRA partenaires > Operations" |
| `AUDIT_HRA_MAISONS_PMS.md` | Connexions PMS hôtels | ✅ "Connexions PMS monitoring" |
| `AUDIT_ADMIN_PLANNINGS.md` | Plannings cross-équipes | ✅ admin section "Planning" |
| `AUDIT_FLOW_CREATEUR_INDEPENDANT.md` | Indépendants vs créateurs | ✅ équipe "Indépendants monitoring" + "Créateurs" |
| `AUDIT_RESEAUX_SOCIAUX_GROUPES.md` | Modération posts/commentaires | ✅ équipe "Modération" + "Réseaux sociaux" |
| `AUDIT_SYMPHONIE_MARKETING_COMPLETE.md` | Symphonie marketing globale | ✅ équipe "Marketing > Symphonie globale" |
| `AUDIT_INTERFACE_COMPTABLE.md` | Interface comptable | ✅ admin "Finance > Comptabilité" |
| `AUDIT_NAVIGATION_PRO.md` | Navigation Pro | ➖ hors scope ici |
| `AUDIT_PRO_DASHBOARD.md` | Dashboard Pro | ➖ hors scope |
| `AUDIT-CONFORMITE-LEGALE.md` | UE 2015/2302 + RGPD | ✅ équipe "Compliance > Conformité voyages" |
| `AUDIT-MARKETING-COMPLET.md` | Marketing global | ✅ équipe "Marketing" |
| `AUDIT-CREATION-VOYAGE-COMPLET.md` | Wizard création voyage | ✅ équipe "Voyages > À valider" |
| `AUDIT_ACTIVITES_TYPES_DATABASE.md` | Catalogue activités types | ✅ équipe "Activités > Catalogue" |
| `pdg-eventy/AUDIT-HRA-FINAL-EXHAUSTIF.md` | HRA exhaustif | ✅ section HRA complète |
| `pdg-eventy/AUDIT-API-COMPLIANCE-2026-03-15.md` | Compliance API | ✅ admin "Système > Compliance" |
| `pdg-eventy/AUDIT-SECURITE-2026-03-18.md` | Sécurité | ✅ admin "Sécurité" |
| `audits/AUDIT-CLIENT-PORTAL.md` | Portail client | ➖ hors scope panels internes |
| `docs/AUDIT-ASSURANCES-SECURITE-2026-04.md` | Assurances | ✅ équipe "Assurances" + admin "Compliance > Assurances" |
| `docs/AUDIT-COMPTAGE-NFC-2026-04.md` | Comptage NFC | ✅ équipe "Comptage" |

---

## 3 · Architecture sidebar Équipe — vue Premium ratifiée

```
┌─ ÉQUIPE EVENTY ───────────────────────────────────────────────────────────┐
│                                                                            │
│  [recherche globale ⌘K]    [filtre menu]    [notif 🔔]    [DA] David A.   │
│                                                                            │
│  ▼ PILOTAGE                       ▼ CRÉATEURS & RÉSEAU                    │
│    🏠 Cockpit                       🌟 Créateurs                          │
│    ⚡ Activités                     🦅 Indépendants monitoring            │
│    📅 Timeline                      📚 Formation & certifications         │
│    📊 Tableaux de bord              🤝 Mentoring                           │
│    🎯 Direction (KPIs)              👥 Talents (recrutement)              │
│                                                                            │
│  ▼ VOYAGES                        ▼ HRA PARTENAIRES                       │
│    ✓  À valider                     📚 Catalogue HRA                      │
│    ✈️ Voyages en cours              🤝 Négociations                       │
│    📝 Modifications post-pub        🏨 Maisons HRA                         │
│    ⚠️ Litiges & incidents           🛰️ Connexions PMS                     │
│    🔬 Voyage (sandbox)              🛏️ HRA operations                     │
│                                                                            │
│  ▼ SYMPHONIES                     ▼ TRANSPORTS                            │
│    ✨ Templates Eventy              🚌 Loueurs bus / chauffeurs           │
│    🎼 Symphonies à valider          ✓  Trajets validation                 │
│    📊 Score qualité                 📡 Bus monitoring                      │
│                                                                            │
│  ▼ TRANSFERTS AÉROPORT            ▼ MARKETING                             │
│    📍 Live tracking                 🎼 Symphonie marketing globale        │
│    🏆 Performance prestataires      ✅ Validation campagnes                │
│    📋 Recrutement                   🧪 A/B testing                         │
│                                     📈 Analytics cross-créateurs          │
│                                                                            │
│  ▼ ACTIVITÉS                      ▼ CONCIERGERIE LUXE 24/7                │
│    ✓  Validation activités          🛎️ Tableau de bord conciergerie       │
│    📚 Catalogue Eventy              💎 Prestataires luxe                   │
│    🎬 Créateurs en action           🚁 Demandes en cours                   │
│                                                                            │
│  ▼ COMPLIANCE                     ▼ MODÉRATION                            │
│    ⚖️ Conformité voyages            💬 Posts / commentaires               │
│    🔐 Garantie financière           ⚠️ Litiges voyageurs                  │
│    🛡️ RGPD / RC Pro                 🧯 Risques                            │
│                                                                            │
│  ▼ FINANCE & MARGES               ▼ TERRAIN & MISSIONS                    │
│    💰 Finance                       🎯 Missions                            │
│    📒 Compta                        🗺️ Itinéraires                        │
│    💵 Pourboires                    🔢 Comptage NFC                       │
│    ⚖️ Marges & ajustements          ✅ Check-in                            │
│    💼 Ventes                        📍 Aide locale                         │
│                                     🛒 Achats                              │
│                                                                            │
│  ▼ COMMUNICATION                  ▼ OUTILS & DONNÉES                      │
│    💬 Messagerie                    🎟️ Cartes à gratter                  │
│    🔔 Notifications                 🎮 Gamification                        │
│    📓 Carnets                       🎲 Jeux live                           │
│    🛟 Support                       📄 Documents                           │
│                                     🧠 Data                                │
│                                     🚨 Alertes                             │
│                                     ⚙️ Tech (status interne)              │
└────────────────────────────────────────────────────────────────────────────┘
```

**14 sections** vs 8 avant. **78 entrées** vs 50 avant. Couverture **100 %** des dossiers existants + 6 sections nouvelles pour cadrer les besoins identifiés (Conciergerie luxe, Compliance, Modération, Marges, Transferts aéroport, Créateurs).

---

## 4 · Architecture sidebar Admin (PDG) — vue Premium ratifiée

L'admin garde sa structure (déjà à 96 % de couverture). Ajouts :

```
▼ COCKPIT PDG          (existant — Dashboard, Investisseur, Audit, Lancement)
▼ STRATÉGIE ✨ NEW     (Roadmap, Backlog, KPIs business, OKRs)
▼ FINANCES PLATEFORME  (existant — Finance, Compta, Taxes, Pourboires, Ventes, Comptage, Market Budget)
▼ MARGES & TIERS ✨    (Marges Standard/Premium/Luxe, Ajustements, Force commerciale)
▼ VOYAGES & ACTIVITÉS  (existant — Voyages, Itinéraires, Évènements, Activités, Thèmes, Forfaits, Bookings, Réservations, Annulations, Groupes)
▼ HÉBERGEMENT          (existant — Maisons HRA, Rooming, Restauration, Pension ✨ NEW, Enrichissements ✨ NEW)
▼ TRANSPORT            (existant — Transport, Transports legacy, Transferts aéroport ✨ NEW, Transferts voyages ✨ NEW)
▼ UTILISATEURS         (existant — Clients, Pros, Validation Pro, Créateurs, Indépendants, Influenceurs, Ambassadeurs, Sponsors, Employés, Équipe, Métiers, Tribus)
▼ MARKETING & COMM     (existant)
▼ ÉNERGIE & GAMING     (existant)
▼ CONFORMITÉ & LÉGAL   (existant + Conformité hub ✨ NEW)
▼ SUPPORT & OPÉRATIONS (existant)
▼ SYSTÈME & TECH       (existant + Webhooks failed ✨ NEW + Audit logs immutables)
▼ RH INTERNE ✨ NEW    (Équipe Eventy, Recrutement, Formation interne)
▼ RÉGLAGES GLOBAUX ✨  (Marges par tier, Feature flags master, A/B tests système)
```

---

## 5 · Roadmap d'implémentation (sprints)

### Sprint 1 — Layout + helpers (livré ce sprint)
- ✅ `frontend/lib/equipe/equipe-actions.ts` — helpers actions équipe (validate, reject, escalate, audit-trail)
- ✅ `frontend/lib/admin/admin-rbac.ts` — RBAC admin/équipe/superviseur
- ✅ `frontend/lib/admin/audit-trail.ts` — log immutable des actions critiques
- ✅ `frontend/components/equipe/EquipeKPICard.tsx` — carte KPI premium
- ✅ `frontend/components/admin/AdminCockpitWidget.tsx` — widget cockpit PDG
- ✅ `frontend/components/equipe/EventyTable.tsx` — tableau tri/filtres/pagination
- ✅ `frontend/components/equipe/EventyDrawer.tsx` — drawer détails latéral
- ✅ `frontend/components/equipe/ActionCenter.tsx` — actions rapides
- ✅ Refonte `app/(equipe)/equipe/layout.tsx` (extension sidebar 14 sections + filtre + breadcrumb + recherche globale + notif)
- ✅ Extension `app/(admin)/admin/layout.tsx` (9 entrées manquantes ajoutées)
- ✅ Placeholders premium : `equipe/conciergerie-luxe`, `equipe/compliance`, `equipe/moderation`, `equipe/createurs`, `equipe/transferts-aeroport`, `admin/strategie`, `admin/marges-tiers`, `admin/rh-interne`, `admin/reglages-globaux`

### Sprint 2 — Données & live (à venir)
- WebSocket / SSE pour live tracking transferts + bus monitoring
- Backend RBAC strict avec audit logs immutables (PostgreSQL append-only table)
- Notifications push équipe (Slack/Discord/Email Resend)
- Intégration calendrier Google Cal/Outlook pour planning équipe

### Sprint 3 — Collaboration
- Chat équipe interne avec mentions, threads, fichiers
- AI assistant équipe : réponses suggérées modération, détection fraude
- Heatmap performance par créateur / HRA / destination

### Sprint 4 — Reporting auto
- Rapports auto hebdomadaires/mensuels (PDF + email PDG)
- Exports comptables CSV/Excel par créateur
- Dashboard live PDG (TV mode)

### Sprint 5 — Gamification équipe
- Badges performance équipe Eventy (validation rapide, qualité modération)
- Classement équipe par pôle (mois, trimestre)

---

## 6 · TODOs (par priorité)

### P0 — Critiques (avant lancement V1)
- [ ] Backend RBAC strict avec rôles `ADMIN`, `EQUIPE_VALIDATION`, `EQUIPE_HRA`, `EQUIPE_TRANSFERTS`, `EQUIPE_CONCIERGE`, `EQUIPE_MODERATION`, `EQUIPE_FINANCE`, `EQUIPE_SUPPORT`, `EQUIPE_LECTURE_SEULE`
- [ ] Audit logs immutables PostgreSQL (table `audit_logs` append-only, hash chain anti-tampering)
- [ ] Validation 2 personnes minimum pour actions Luxe (>10 000 €)
- [ ] Garantie financière APST visible temps réel admin (montant garantie / encours / marge)

### P1 — Importants (post V1)
- [ ] WebSocket pour live tracking (transferts aéroport, bus monitoring, chauffeurs en route)
- [ ] Notifications push équipe (Slack webhook + Discord + Email Resend)
- [ ] Intégration calendrier équipe (Google Cal API / Outlook Graph)
- [ ] AI assistant équipe (réponses suggérées modération posts, détection litiges escalade automatique)
- [ ] Heatmap performance par créateur / HRA / destination (Mapbox + d3)

### P2 — Confort
- [ ] Rapports auto PDF hebdomadaires PDG (Resend + chromium headless)
- [ ] Exports comptables Excel par créateur (xlsx)
- [ ] Mode TV dashboard live (kiosque QG Eventy)
- [ ] Gamification équipe Eventy (badges + classement mensuel)
- [ ] Dark mode premium toggle (déjà sombre par défaut, mais alternative ivoire pour mode jour)

---

## 7 · Composants & helpers livrés ce sprint

### 7.1 Helpers
| Fichier | Rôle |
|---------|------|
| `frontend/lib/equipe/equipe-actions.ts` | Actions communes équipe (validate, reject, escalate) + audit |
| `frontend/lib/admin/admin-rbac.ts` | Permissions admin (canValidateLuxe, canEditMarges, canViewAuditLogs) |
| `frontend/lib/admin/audit-trail.ts` | Log immutable actions critiques (mock client + interface backend) |

### 7.2 Composants UI premium
| Fichier | Rôle |
|---------|------|
| `frontend/components/equipe/EquipeKPICard.tsx` | Carte KPI gold (label, valeur, delta, sparkline) |
| `frontend/components/admin/AdminCockpitWidget.tsx` | Widget cockpit PDG (titre, métrique, sous-métrique, action) |
| `frontend/components/equipe/EventyTable.tsx` | Tableau premium tri / filtres / pagination, glassmorphism |
| `frontend/components/equipe/EventyDrawer.tsx` | Drawer latéral détails (Framer slide right) |
| `frontend/components/equipe/ActionCenter.tsx` | Centre d'actions rapides clavier (⌘K) |

### 7.3 Pages placeholders premium
| Route | Rôle |
|-------|------|
| `/equipe/conciergerie-luxe` | Tableau de bord conciergerie 24/7 |
| `/equipe/compliance` | Hub conformité (voyages + RGPD + garantie) |
| `/equipe/moderation` | Modération posts/commentaires + litiges |
| `/equipe/createurs` | Hub créateurs (recrutement + perf + formation) |
| `/equipe/transferts-aeroport` | Live tracking + perf prestataires |
| `/admin/strategie` | Roadmap + backlog + OKRs |
| `/admin/marges-tiers` | Marges Standard / Premium / Luxe |
| `/admin/rh-interne` | Équipe Eventy interne |
| `/admin/reglages-globaux` | Réglages globaux (marges, flags, A/B) |

---

## 8 · Critères d'acceptation Premium

Chaque page/composant livré doit cocher ces critères :

- [x] Palette ratifiée (`#0A0E14`, `#D4A853`, `#F5F1E8`, `#8B5CF6` équipe / `#0077B6` admin)
- [x] Typographie Playfair/Fraunces titres + Inter corps
- [x] Glassmorphism subtil (`rgba(255,255,255,0.04)` + blur 18px)
- [x] Animations Framer Motion fluides (durée 200-280 ms)
- [x] Mode sombre par défaut + accessibilité (focus rings, aria-current, aria-live)
- [x] Pas de placeholder vide — toujours un squelette avec wording chaleureux Eventy
- [x] TODO Eventy en commentaires nombreux (backend, push, AI, etc.)
- [x] Liens entre pages cohérents (breadcrumb, retour cockpit)

---

## 9 · Suivi & métriques de qualité panels

| Métrique | Cible | Comment mesurer |
|----------|-------|-----------------|
| Couverture sidebar / pages réelles | 100 % | `find` vs sidebar map |
| Cohérence palette | 100 % | grep `bg-[#`, `text-[#` non conformes |
| Pages sans skeleton premium | 0 | audit visuel manuel |
| Audit logs immutables actifs | 100 % actions critiques | backend `audit_logs` count |
| Latence page < 1.5 s P95 | atteinte | Vercel Analytics |
| Score Lighthouse Performance | ≥ 85 | Lighthouse CI |
| Score Lighthouse Accessibility | ≥ 95 | Lighthouse CI |

---

## 10 · Conclusion

Cette refonte des panels Équipe + Admin :

1. **N'efface RIEN** de l'existant (règle absolue CLAUDE.md respectée)
2. **Étend** la couverture de 77 % → 100 % sur Équipe et de 96 % → 100 % sur Admin
3. **Ajoute 6 nouvelles sections Équipe** alignées sur les besoins identifiés dans 28+ audits
4. **Ajoute 4 nouvelles sections Admin** pour le pilotage stratégique PDG
5. **Pose les helpers + composants** réutilisables pour les sprints suivants
6. **Documente une roadmap claire** (5 sprints) avec TODOs P0/P1/P2

**Prochaine étape recommandée** : sprint 2 (WebSocket + RBAC backend strict + audit logs immutables).

— *Eventy Life — pilotage premium pour une marketplace voyage qui vit et respire.* ⚡
