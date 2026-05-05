# AUDIT — Conciergerie Eventy (interne + externe en backup)

> Date : 2026-05-05 · PDG : David · Branche : claude/quizzical-hopper-20cfdc
> Mission : auditer toutes les possibilités de conciergerie Eventy. Modèle hybride :
> **interne par défaut** (créateurs + indépendants) + **externe en backup**
> (Quintessentially, John Paul, etc.).
> 24/7 garanti. Voyageur jamais sans réponse.

---

## 1. Vision PDG

**"Le client doit se sentir aimé."** (AME-EVENTY.md)

Eventy n'est pas qu'une plateforme de voyages de groupe. C'est une promesse :
*"Tu n'as rien à gérer, tout à vivre."* La conciergerie est l'expression
opérationnelle de cette promesse pendant le voyage.

### Pourquoi un modèle hybride

| Modèle | Force | Faiblesse |
|--------|-------|-----------|
| 100 % interne (créateur + indé) | Connaît le voyageur, ton chaleureux, marge 100 % | Pas 24/7, hors compétence palace/jet, dort la nuit |
| 100 % externe (société conciergerie) | 24/7 garanti, expertise luxe, scalable | Coûteux, ton standardisé, ne connaît pas le voyageur |
| **Hybride Eventy** | **Chaleur interne + filet 24/7 externe + escalade fluide** | Complexité routage (résolu par lib/conciergerie/routing.ts) |

Eventy choisit l'**hybride** : créateurs/indés en première ligne (chaleur,
relation), sociétés externes en backup (couverture nuit + compétences pointues
+ tier Luxe).

---

## 2. Audit existant (2026-05-05)

### Pages & helpers déjà présents

| Chemin | Statut | Ce qui existe | Ce qui manque |
|--------|--------|---------------|---------------|
| `app/(equipe)/equipe/conciergerie-luxe/page.tsx` | Placeholder | Promesse SLA 5 min, file temps réel, livre d'or | File réelle, backend, providers |
| `app/(equipe)/equipe/luxe-prestataires/page.tsx` | Fonctionnel | Catalogue jets/yachts/palaces (mock) | Brique conciergerie spécifique |
| `app/(independant)/independant/luxe-missions/page.tsx` | Fonctionnel | Missions luxe ponctuelles | Vue conciergerie courante |
| `app/(client)/client/voyage/[id]/aide-locale/page.tsx` | Fonctionnel | Hôpital, police, taxi, change | Bouton "Conciergerie Eventy" |
| `lib/incidents-management.ts` | Fonctionnel | Gestion incidents voyage | Distinction incident vs demande conciergerie |
| `lib/admin/audit-trail.ts` | Fonctionnel | Logs immuables | Append entries conciergerie |
| Design tokens `LUXE_COLORS` / `LUXE_FONTS` | Fonctionnel | Ivoire / or / champagne / velours | Réutilisation par pages conciergerie |

### Manquant total (à construire par cette session)

- `lib/conciergerie/routing.ts` — logique routage interne / externe
- `lib/conciergerie/providers.ts` — catalogue sociétés externes
- `lib/conciergerie/sla.ts` — SLA + escalade
- `lib/conciergerie/templates.ts` — bibliothèque templates réponses
- `lib/conciergerie/types.ts` — types partagés
- `components/conciergerie/*` — UI réutilisable (cards, timer, picker, panel)
- `app/(pro)/pro/conciergerie/*` — vue créateur
- `app/(independant)/independant/conciergerie/*` — vue indé mobile-first
- `app/(equipe)/equipe/conciergerie-supervision/*` — supervision équipe
- `app/(admin)/admin/conciergerie-config/*` — config sociétés externes
- `app/(client)/client/voyage/[id]/conciergerie/*` — formulaire voyageur
- `app/(partenaire-conciergerie)/*` — portail partenaire externe (NEW)

---

## 3. Inspirations concurrents

### Quintessentially Lifestyle
- 24/7, ~80 villes, abonnement Élite ~10 k$/an + ponctuel (10–25 % marge sur réservations)
- "1 demande par jour, partout dans le monde"
- Fort réseau hôtels 5★, restos étoilés, spectacles
- → **Inspiration tier Luxe** : abonnement annuel pour clients récurrents, sinon ponctuel

### John Paul (Accor)
- B2B (banques) + B2C (cartes premium)
- API connectée à plusieurs banques/cartes
- Chat in-app + email + téléphone
- → **Inspiration intégration API** : Eventy peut s'interfacer avec John Paul pour escalade tier Premium

### Knok
- Médecine voyage (téléconsultation 24/7 multilingue)
- → **Inspiration assistance santé** : intégration spécifique pour incidents santé voyageurs

### Black Book (American Express Centurion)
- Membres only, ultra-confidentiel, "request anything legal"
- Reconnaissance vocale par téléphone
- → **Inspiration ton Luxe** : appel d'un humain qui connaît le client par son prénom

### Allianz Travel / AXA Assistance
- Assistance médicale + rapatriement (déjà couvert par RC Pro Eventy)
- → **Périmètre distinct** : conciergerie ≠ assistance assurance

### TheKey / Velocity (immobilier)
- IA chat first-line + humain escalade
- → **Inspiration AI assistant** : Claude Sonnet 4.6 propose réponses, créateur valide

### Synthèse modèles

| Modèle | Quand l'utiliser pour Eventy |
|--------|------------------------------|
| Abonnement annuel | Tier Luxe (client récurrent ≥ 2 voyages/an) |
| Ponctuel à la demande | Tier Standard / Premium |
| Marketplace prestataires | Eventy = courtier, créateur ajoute ses contacts trusted |
| AI first-line + humain escalade | Toutes demandes (AI suggère réponse, humain valide) |

---

## 4. Trois tiers de conciergerie Eventy

### Tier Standard (inclus tous voyages)
**Qui répond** : créateur + indé(s) du voyage, escalade équipe Eventy
**Périmètre** :
- Info pratique (météo, change, prises électriques, pourboires)
- Recommandations restos / activités locales
- Aide check-in (hôtel, vol, bus)
- Réimpression billets / cartes embarquement
- Premiers conseils en cas de souci (perte bagage, retard vol)

**SLA** : réponse < 4 h, résolution < 24 h
**Coût Eventy** : 0 € (déjà inclus dans la marge créateur)

### Tier Premium (inclus tier Premium voyage)
**Qui répond** : créateur + indé + équipe Eventy + accès partenaires externes
**Périmètre** :
- Réservations restos premium / shows
- Billets événements (concerts, opéra, sport)
- Transferts upgrade (limousine, hélico court trajet)
- Surclassement chambre / suite
- Cadeaux personnalisés (anniv, lune de miel)

**SLA** : réponse < 1 h, résolution < 6 h
**Coût Eventy** : 5–15 % de la marge sur la prestation externe

### Tier Luxe (inclus tier Luxe + abonnement annuel optionnel)
**Qui répond** : créateur + indé + société externe dédiée 24/7
**Périmètre** :
- Réservations palace dernière minute
- Jet privé immédiat / hélico
- Yacht charter
- Conciergerie médicale (téléconsult premium)
- Sécurité personnelle (chauffeur sécurité formé)
- Expériences sur-mesure (chef privé, fleuriste, photographe)

**SLA** : réponse < 15 min (24/7), résolution < 2 h
**Coût Eventy** : 10–20 % de la marge + retainer mensuel partenaire (~3 k€/mois)

---

## 5. Procédure routage demande

```
[Voyageur] dépose demande dans app voyage Tribu
      ↓
[Routeur lib/conciergerie/routing.ts] détermine tier voyage
      ↓
┌─ Standard ────────────────────────────────────┐
│  → Créateur du voyage (push + SMS)            │
│  → Si pas réponse en 30 min → indé(s) voyage   │
│  → Si pas résolu en 4 h → équipe Eventy        │
│  → Si critique (santé, sécurité) → 112 + équipe│
└────────────────────────────────────────────────┘

┌─ Premium ─────────────────────────────────────┐
│  → Créateur (push + SMS) + indé en parallèle   │
│  → Si demande hors compétence ou pas réponse  │
│    en 30 min → société externe partenaire     │
│  → Équipe Eventy en supervision               │
└────────────────────────────────────────────────┘

┌─ Luxe ────────────────────────────────────────┐
│  → Créateur + société externe DÉDIÉE direct   │
│  → SLA 15 min — équipe Eventy alertée si > SLA│
│  → Validation 2-personnes si > 5 000 €        │
└────────────────────────────────────────────────┘

Trace : audit-trail (immuable) + facturation auto
```

### Mode hybride 24/7 (créneaux de garde)

- Créateur définit ses créneaux de garde (ex: 9 h–22 h CET)
- Hors créneaux : société externe prend le relais automatiquement
- Vue agenda partagée : créateur voit qui couvre quand
- Possibilité créateur "désactiver mes créneaux" temporairement → tout va société externe
- Système 24/7 garanti même si créateur indispo / dort / en congé

### Escalade auto SLA (lib/conciergerie/sla.ts)

| Tier | Réponse | Résolution | Action si SLA dépassé |
|------|---------|------------|------------------------|
| Standard | 4 h | 24 h | Notif équipe Eventy + email voyageur "on s'occupe de toi" |
| Premium | 1 h | 6 h | Escalade auto société externe + alerte créateur |
| Luxe | 15 min | 2 h | Alerte critique équipe + société externe direct + appel téléphone |

---

## 6. Pages à créer (architecture portails)

### 6.1. Côté créateur — `/pro/conciergerie`
- Tableau de bord demandes en cours (ouvertes / en cours / résolues)
- SLA timer visuel sur chaque carte
- Templates réponses rapides (par catégorie)
- Bouton **"Confier à un indé / équipe / société externe"** — choix du destinataire
- Catalogue prestataires externes (par type service)
- Stats : nb demandes traitées, NPS voyageurs, temps moyen résolution
- Mode garde / hors-garde toggle (créneaux 24/7)

### 6.2. Côté indépendant — `/independant/conciergerie`
- Demandes assignées par mon créateur (mobile-first)
- Templates rapides (recettes courtes "Demande resto", "Demande pharmacie", etc.)
- Mode mobile-first (le plus utilisé sur le terrain)
- Bouton "Je m'en occupe" / "Pas dispo" (rebascule au créateur)
- Notif push (Capacitor / PWA)

### 6.3. Côté équipe Eventy — `/equipe/conciergerie-supervision`
- Vue temps réel toutes demandes plateforme (WebSocket)
- Alertes SLA dépassement (rouge)
- Bouton **"Prendre la main"** si créateur/indé débordé
- Stats globales (NPS, temps moyen, top créateurs, top demandes)
- Filtre par tier (Standard / Premium / Luxe), par statut, par société externe

### 6.4. Côté admin — `/admin/conciergerie-config`
- Sélection sociétés externes partenaires
- Conditions tarifaires négociées (retainer mensuel, % par demande)
- Paliers auto-escalade (montant déclenchant validation 2-personnes)
- Workflow validation gros montants (> 5 000 €)
- Activation / désactivation par tier
- Activation IA assistant (Claude Sonnet 4.6)

### 6.5. Côté société externe — `/partenaire-conciergerie/*` (NEW portal)
- Réception demandes Eventy
- Statut (acceptée / en cours / résolue / annulée / refusée)
- Devis / facturation Eventy (Stripe Connect ou facture manuelle)
- Templates réponses
- Stats partenaire (volume, NPS Eventy)
- KYC + contrat type (onboarding)

### 6.6. Côté voyageur — `/client/voyage/[id]/conciergerie`
- Bouton "Conciergerie Eventy" sur app voyage Tribu
- Formulaire ou chat
- Choix catégorie (santé, transport, resto, expérience, autre)
- Niveau urgence (info / standard / urgent)
- Suivi en temps réel ("Sophie ton créatrice a vu, elle revient vers toi sous 30 min")
- Notation post-résolution (NPS conciergerie)

---

## 7. Sociétés externes partenaires (catalogue de démarrage)

| Société | Tier | Périmètre | Tarif négocié cible | Statut Eventy 2026-05-05 |
|---------|------|-----------|---------------------|---------------------------|
| Quintessentially | Luxe | Global, 24/7, palace + jet | 3 500 €/mois retainer + 12 % | TODO contrat |
| John Paul | Premium / Luxe | Europe, B2B mature, API | 1 800 €/mois retainer + 10 % | TODO contrat |
| Aspire Lifestyle | Premium | UK + EU, conciergerie cartes | 2 200 €/mois retainer + 10 % | TODO contrat |
| Lestiem (FR) | Standard / Premium | France, agile, francophone | 1 200 €/mois retainer + 8 % | TODO contrat |
| Knok | Santé voyage | Téléconsult médicale 24/7 | 0,8 €/voyageur/jour | TODO contrat |
| Société de chauffeurs sécurité | Luxe | Sécurité personnelle | À la mission | TODO contrat |

### KYC + contrat type partenaire (à valider avec avocat tourisme)

- Statut juridique (SIREN, SAS / Ltd / Inc)
- RC Pro à jour (≥ 1,6 M€)
- Conformité RGPD (DPA signé Eventy)
- Garantie financière (si mandat de paiement)
- SLA contractuels (réponse 15 min Luxe, 1 h Premium)
- Indemnités si SLA non respecté
- Confidentialité (NDA strict — données voyageurs Luxe sensibles)

---

## 8. Marketplace prestataires (option avancée)

- Catalogue de sociétés conciergerie partenaires (5–10 par tier)
- Tarification (forfait mensuel + ponctuel)
- Notations équipe Eventy + créateur (1–5 ★)
- Onboarding partenaire (KYC + contrat type + activation par tier)
- API d'intégration (REST ou webhook)
- Possibilité **créateur** d'ajouter ses **contacts trusted personnels** (visible
  uniquement par lui — ex: son ami restaurateur à Bali)

---

## 9. Stack & implémentation

### Frontend (livré par cette session)

```
frontend/
├── lib/conciergerie/
│   ├── types.ts              # types partagés (DemandConcierge, Provider, SLATier, ...)
│   ├── routing.ts            # logique routage interne / externe
│   ├── providers.ts          # catalogue sociétés externes
│   ├── sla.ts                # SLA + escalade auto
│   └── templates.ts          # templates réponses + variables
├── components/conciergerie/
│   ├── DemandConciergeCard.tsx
│   ├── RoutingPanel.tsx
│   ├── ProviderPicker.tsx
│   ├── SLATimer.tsx
│   ├── TemplateResponseLibrary.tsx
│   └── CompanyExternalCard.tsx
└── app/
    ├── (pro)/pro/conciergerie/
    │   ├── page.tsx                    # dashboard créateur
    │   └── [id]/page.tsx               # détail demande
    ├── (independant)/independant/conciergerie/page.tsx  # mobile-first indé
    ├── (equipe)/equipe/conciergerie-supervision/page.tsx
    ├── (admin)/admin/conciergerie-config/page.tsx
    ├── (client)/client/voyage/[id]/conciergerie/page.tsx
    └── (partenaire-conciergerie)/partenaire-conciergerie/
        ├── layout.tsx
        └── page.tsx
```

### Backend NestJS (TODO Eventy)

- Module `concierge-requests` : CRUD demandes + routage + SLA enforcement
- Module `concierge-providers` : CRUD sociétés externes + KYC
- Module `concierge-billing` : facturation auto société externe → Eventy → créateur
- WebSocket gateway : mises à jour temps réel
- Job CRON : vérification SLA + escalade auto

### Intégrations externes (TODO Eventy)

- API John Paul (REST)
- API Quintessentially (à demander)
- Twilio (SMS escalade)
- Capacitor Push (notif mobile indé)
- Resend (email voyageur)
- Slack (#conciergerie-luxe — alertes équipe)

---

## 10. Roadmap exécution

### Sprint 1 — Foundations (cette session)
- [x] Audit complet
- [x] Helpers `lib/conciergerie/*`
- [x] Composants UI
- [x] Pages 6 portails

### Sprint 2 — Backend (semaine +1, ~5 j-h)
- [ ] Module NestJS `concierge-requests`
- [ ] WebSocket gateway temps réel
- [ ] CRON SLA enforcement
- [ ] Tests unitaires routage

### Sprint 3 — Partenaires externes (semaine +2-3, ~8 j-h)
- [ ] Négocier 3 contrats partenaires (Quintessentially, John Paul, Lestiem)
- [ ] Onboarding portail partenaire
- [ ] Intégration API (au moins John Paul)

### Sprint 4 — IA + production (semaine +4, ~5 j-h)
- [ ] AI assistant (Claude Sonnet 4.6) — réponses suggérées + traduction
- [ ] Stripe Connect facturation externe
- [ ] Beta avec 5 créateurs pilotes
- [ ] Mesure NPS conciergerie

---

## 11. KPIs (à suivre dès Sprint 2)

| Indicateur | Cible An 1 |
|------------|------------|
| Volume demandes / voyage | 4–8 |
| Taux résolution interne (sans externe) | ≥ 80 % (Standard), ≥ 60 % (Premium) |
| Temps moyen réponse | < 30 min (Premium), < 10 min (Luxe) |
| NPS conciergerie voyageur | ≥ 70 |
| Coût moyen société externe par voyage Premium | < 80 € |
| Coût moyen société externe par voyage Luxe | < 600 € |
| Disponibilité 24/7 effective | 100 % (garanti par société externe) |

---

## 12. Checklist juridique (à valider avocat tourisme + comptable)

- [ ] CGV : ajout clause conciergerie (limites de responsabilité, marge transparente)
- [ ] Conditions tier Luxe : abonnement annuel optionnel
- [ ] DPA RGPD avec chaque société externe (transfert données voyageurs)
- [ ] Garantie financière : impact si conciergerie engage paiement
- [ ] RC Pro : extension périmètre conciergerie (Allianz / Hiscox)
- [ ] Facturation TVA marge tourisme (déjà couvert par 13-comptabilite/GUIDE-COMPTABLE.md)
- [ ] Contrat type partenaire conciergerie (à créer dans 01-legal/)

---

## 13. Lien avec l'âme Eventy

> **"Le client doit se sentir aimé."**

La conciergerie est l'expression la plus concrète de cette promesse. Quand
la voyageuse a perdu sa valise à Bali, elle ne veut pas un formulaire :
elle veut **Sophie** (la créatrice de son voyage) qui dit *"je m'en occupe,
respire"*. Si Sophie dort (3 h du matin en France), c'est la société externe
qui prend le relais — sans que le voyageur sente la couture. C'est ça,
le filet 24/7 Eventy.

**Concurrence** : Voyageurs.com, Salaün, Costa, etc. ont une hotline 9 h–18 h.
Eventy = **24/7 garanti, ton chaleureux interne, expertise externe quand
il faut**. Avantage durable.

---

## 14. Procédure contrôle qualité (interne + externe)

> Eventy garantit que **la chaleur ne se dilue pas avec l'échelle**. Le pôle
> Qualité audite tout le périmètre conciergerie selon une politique d'échantillonnage
> stratifiée + mystery shoppers trimestriels.

### 14.1 Politique d'échantillonnage (lib/conciergerie/quality-control.ts)

| Tier | Taux audit aléatoire | Couverture | Auditeur |
|------|----------------------|------------|----------|
| Standard | 10 % | 1 demande sur 10 | Pôle Qualité (équipe Eventy) |
| Premium | 25 % | 1 demande sur 4 | Pôle Qualité |
| Luxe | 100 % | Toutes les demandes Luxe | Direction + Pôle Qualité (binôme) |

Le hash de l'ID demande détermine l'échantillonnage (déterministe, reproductible
pour audit-trail). Délai minimum entre 2 audits du même créateur : **7 jours**
(politique anti-bias).

### 14.2 Critères d'évaluation (7 critères pondérés)

| # | Critère | Poids | Tier |
|---|---------|-------|------|
| 1 | **Ton chaleureux** (AME-EVENTY : voyageur s'est-il senti aimé ?) | 18 % | Tous |
| 2 | **Respect SLA réponse** (4 h Std / 1 h Prem / 15 min Luxe) | 16 % | Tous |
| 3 | **Respect SLA résolution** (24 h / 6 h / 2 h) | 14 % | Tous |
| 4 | **Qualité prestation** (correspondance attente voyageur) | 20 % | Tous |
| 5 | **Gestion coûts** (marge respectée, validation 2-pers. > seuil) | 10 % | Premium + Luxe |
| 6 | **Documentation & trace** (audit-trail, NPS demandé) | 8 % | Tous |
| 7 | **Coordination société externe** (briefing clair, voyageur sans couture) | 14 % | Premium + Luxe |

Score 0–5 par critère → score global pondéré 0–100 → verdict :

| Score | Verdict | Action RH |
|-------|---------|-----------|
| ≥ 90 | **Exemplaire** | Livre d'or + intervenant Webinaire |
| 75–89 | **Conforme** | Aucune action |
| 60–74 | **Amélioration** | Warn (1) → Coaching (récidive) |
| 40–59 | **Alerte** | Warn (1) → Coaching (1) → Suspension (récidive) |
| < 40 | **Critique** | Coaching (1) → Suspension (1) → Rupture |

### 14.3 Mystery shopper (trimestriel)

Faux voyageurs (collaborateurs Eventy ou prestataires de confiance) déposent
demandes-test selon scénarios pré-définis. 3 scénarios au démarrage :

1. **Resto romantique Bali (Premium)** — anniversaire de mariage. Doit obtenir
   3 options en < 1 h, avec préférences alimentaires demandées.
2. **Pharmacie de garde Rome (Standard)** — fièvre légère. Adresse + téléphone +
   langues + suivi le lendemain.
3. **Suite royale Marrakech (Luxe)** — anniversaire surprise. Réponse < 15 min,
   société externe sollicitée, validation 2-pers., champagne + roses.

Drapeaux rouges = action RH immédiate. Indicateurs succès = bonus mensuel
créateur (+50 € si tous indicateurs verts pour ses scénarios).

### 14.4 Sanctions & coaching

- **Warn** : email automatique + note dans dossier RH Eventy
- **Coaching** : RDV 1h avec Pôle Qualité, plan d'amélioration sur 30 j
- **Suspension** : retrait des nouveaux voyages 30 j, re-formation
- **Rupture** : fin de partenariat Eventy (créateur indépendant) ou
  réorientation (indé)

Toute sanction est tracée dans audit-trail immuable, **rétention 7 ans**
pour Luxe (compliance).

### 14.5 Sociétés externes — contrôle équivalent

Mêmes critères mais barème adapté :
- Score < 75 : alerte renouvellement contrat
- Score < 60 : audit complet + plan correctif demandé sous 30 j
- Score < 40 ou récidive : rupture contrat (clause prévue dans contrat type)

KPIs partenaires affichés sur `/admin/conciergerie-config` (rating Eventy,
rating créateurs, NPS récent, volume) + dans le portail partenaire
(`/partenaire-conciergerie`) en transparence.

---

## 15. Procédure suivi PDG (reporting)

### 15.1 Rapport hebdomadaire (cron lundi 8h)

Email + Slack #pdg-eventy avec PDF :

- **Volumes** : total demandes + breakdown par tier / catégorie / urgence
- **Performance** : SLA réponse %, SLA résolution %, temps moyen
- **Acteurs** : top 5 créateurs (NPS+volume), créateurs en attention (score < 70)
- **Sociétés externes** : volume + coût + alertes contrat
- **Voyageur** : NPS moyen, détracteurs (<6), promoteurs (≥9)
- **Argent** : marge Eventy générée, coût total externe
- **Audits qualité** : nb réalisés, distribution verdicts
- **Anomalies** : alertes critiques nécessitant action PDG

Lien direct rapport interactif : `/admin/conciergerie-rapports`

### 15.2 Rapport mensuel détaillé (1er du mois)

Idem hebdo + :
- Comparaison vs mois précédent (delta % et tendance)
- Évolution NPS courbe sur 12 mois
- Coût conciergerie / valeur générée (ROI)
- Mystery shoppers trimestriels (résultats consolidés)
- Prévision sociétés externes (renouvellements, négociations)

### 15.3 Alertes anomalies temps réel (Slack #conciergerie-alerts)

Détecteur lib/conciergerie/reporting.ts surveille en continu :

| Anomalie | Seuil déclencheur | Sévérité |
|----------|-------------------|----------|
| Pic SLA réponse dépassé | > 15 % des demandes | Warn / Critical (>25 %) |
| NPS en baisse | < 7,0 sur 5 avis min | Warn / Critical (<5,0) |
| Société externe sur-sollicitée | > 40 % des Premium | Warning |
| Risque burnout créateur | > 12 demandes / jour | Warn / Critical (>20) |
| Demande > 5000 € sans 2-approbations | 1 cas | Critical (compliance) |
| Suspicion fraude | Pattern AI flag | Critical |

Chaque anomalie inclut : description, périmètre, action recommandée,
lien direct vers la ressource (créateur, demande, fournisseur).

### 15.4 Tableau de bord temps réel

`/admin/conciergerie-rapports` : dashboard live avec :
- KPIs principaux (4 cards)
- Volumes par tier (3 cards)
- Top créateurs vs créateurs en attention
- Sociétés externes sollicitées + coût
- Anomalies en haut, en rouge, avec actions
- Boutons Export PDF + Envoyer au PDG

---

## 16. Workflow contrôle complet

```
┌──────────────────────────────────────────────────────────────────┐
│  Voyageur dépose demande                                         │
│  → Routage auto (lib/conciergerie/routing.ts)                    │
│  → Trace dans audit-trail (immuable)                             │
│  → AI scoring continu (Claude Sonnet 4.6 lit conv. en arrière-pl)│
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  À la résolution :                                               │
│  → Demande NPS au voyageur (push + email)                        │
│  → Hash ID détermine si demande échantillonnée pour audit        │
│  → Si Luxe : audit systématique en file équipe Qualité           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  Audit (équipe Qualité) :                                        │
│  → 7 critères, score 0-5 chacun                                  │
│  → Score global pondéré + verdict                                │
│  → Si verdict ≤ "amélioration" → action RH (warn/coaching/...)   │
│  → Notification créateur/indé concerné (acquittement requis)     │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  Agrégation rapport :                                            │
│  → Hebdo lundi 8h (email PDG + Slack)                            │
│  → Mensuel 1er (PDF détaillé + revue avec direction)             │
│  → Alertes temps réel si anomalie franchit seuil                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  Trimestriel :                                                   │
│  → Mystery shoppers (3 scénarios randomisés par créateur actif)  │
│  → Bilan société externe (renouvellement / renégociation)        │
│  → Revue critères qualité (ajout/poids selon retours terrain)    │
└──────────────────────────────────────────────────────────────────┘
```

### Pages livrées pour le contrôle

| Page | Rôle | Acteur |
|------|------|--------|
| `/equipe/conciergerie-controle-qualite` | File audits + audits réalisés + scénarios mystery + critères | Pôle Qualité |
| `/admin/conciergerie-rapports` | Rapport hebdo live + anomalies + export | Direction / PDG |
| `/equipe/conciergerie-supervision` | Supervision temps réel | Équipe ops |
| `/admin/conciergerie-config` | Config sociétés externes + paliers | Admin |

---

## 17. Rétention & RGPD

| Donnée | Rétention | Justification |
|--------|-----------|---------------|
| Conversation conciergerie | 3 ans (Std/Prem) / 7 ans (Luxe) | Garantie commerciale + compliance Luxe |
| Audit qualité | 7 ans | Compliance + suivi RH |
| Audit-trail (immuable) | 10 ans | Conformité avocat tourisme |
| NPS (anonymisé après 2 ans) | 5 ans | Statistiques sans identifiant |
| Données société externe | Durée contrat + 5 ans | DPA + RGPD |

Voyageur peut exercer droit d'accès / suppression (RGPD art. 15-17) via
`/client/parametres/donnees` — anonymisation conservant audit-trail
(nécessaire compliance) sans identifiants directs.

---

*Audit livré : 2026-05-05 — David / Claude Opus 4.7 (1M)*
*Sections 14-17 ajoutées : Procédure contrôle qualité + Suivi PDG*
*Branche : claude/quizzical-hopper-20cfdc*
