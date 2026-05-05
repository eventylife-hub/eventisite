# AUDIT V2 — Préparation Premium & Luxe (création voyage)

> **Date** : 2026-05-05
> **Branche** : `claude/hardcore-meninsky-e16797`
> **Auteur** : Claude (assistant PDG Eventy)
> **Statut** : préparation progressive — code initial déposé, à enrichir par sprints
> **Règle absolue (CLAUDE.md)** : NE JAMAIS DÉCONSTRUIRE L'EXISTANT — V2 Standard reste la référence, on ajoute Premium/Luxe par-dessus.

---

## 0 · Demande PDG (rappel)

David (PDG) précise les **3 catégories Eventy actuelles** :

| Catégorie | Capa typique | Transport | Voyageurs | Devis |
|-----------|--------------|-----------|-----------|-------|
| **Standard** ✅ | 53 (bus 53p) | Bus 53p (Eventy = roi des tournées 40-42 min) | 38 (seuil bus complet 20) | manuel |
| **Premium** 🟡 | 20 (minibus VIP) | Minibus 20p, train 1ʳᵉ, vol éco premium, transferts privés | 12-20 | manuel + IA assistance |
| **Luxe** 🔴 | 4-12 (capa jet) | Jets privés, hélicos, yachts, limos | 4-12 | **automatique IA + conciergerie 24/7** |

**Particularités Luxe** :
- Aucun plafond budget (8 M€ = 8 M€)
- Facturation = `coût total ÷ pax réels`, jamais `> capacité jet`
- **Groupes partage Luxe** : 2 groupes de 4 → fusion en 8/8 (matching marketplace)
- Possibilité multi-jets (2 jets = 16 places)
- KYC renforcé loueurs (Stripe Connect Custom + AML)
- Marges 15-25 % (vs 7-10 % Standard)

---

## 1 · Architecture retenue (Option C hybride)

### 1.1 Décision

| Option | Description | Verdict |
|--------|-------------|---------|
| A — Toggle 3 tiers même page | `tier: 'standard' \| 'premium' \| 'luxe'` partout | ❌ Page Luxe trop différente (devis IA, conciergerie, groupes partage, capa jet) |
| B — 3 pages séparées | `/nouveau-v2`, `/nouveau-v2-premium`, `/nouveau-v2-luxe` | ❌ Standard et Premium trop proches → duplication |
| **C — Hybride** ✅ | Standard + Premium dans **`/nouveau-v2`** (toggle 2 tiers) · Luxe dans **`/nouveau-v2-luxe`** (page dédiée) | ✅ Retenu : équilibre code partagé / spécificités Luxe |

### 1.2 Schéma

```
┌─ /pro/voyages/nouveau-v2 ──────────────────────────┐
│   ┌──────────────────────────┐                     │
│   │  TierSwitch (Phase 0)    │                     │
│   │  [Standard] [Premium]    │ ← toggle binaire    │
│   └──────────────────────────┘                     │
│   Phases 1a → 2 (adaptation par tier via helper)   │
└────────────────────────────────────────────────────┘

┌─ /pro/voyages/nouveau-v2-luxe ─────────────────────┐
│   Stepper dédié :                                  │
│   Symphonie → Infos → Dates → 🪙 Devis IA →        │
│   Palaces 5★ → Activités exclusives →              │
│   Programme → Marketing →                          │
│   📞 Validation conciergerie 24/7                  │
└────────────────────────────────────────────────────┘
```

---

## 2 · Différences clés Standard / Premium / Luxe

| Dimension | Standard | Premium | Luxe |
|-----------|----------|---------|------|
| **Capacité défaut** | 38 (bus 53p, seuil 20) | 16 (minibus 20p) | 6 (jet 8p) |
| **Capacité MAX** | 53 | 20 | capa jet/yacht (4-12) |
| **Transport longue distance** | Bus 53p, train, vol éco | Minibus 20p, train 1ʳᵉ, vol éco premium | Jet privé, hélico, yacht |
| **Transport sur place** | Bus 20/35/50/53p | Minibus VIP 20p + transferts privés | Limousine + escorte + hélico transferts |
| **HRA** | 3-4★ | 4-5★ (boutique, châteaux, riads) | 5★ palaces, villas privées, yachts à quai |
| **Activités** | Catalogue ouvert | Catalogue Premium (chef privé, dégustation Michelin) | **Activités exclusives** (privatisation Louvre, hélico spectaculaire) |
| **Marges** | 7-10 % | 12-15 % | **15-25 %** |
| **Tarif/pax** | 800-2 000 € | 2 500-6 000 € | **6 000-150 000 €+** (sans plafond) |
| **Facturation** | Forfait fixe | Forfait fixe | **Capa jet ÷ pax réels** |
| **Validation équipe Eventy** | Auto (assistance) | 1 personne équipe | **2 personnes équipe + admin** |
| **Devis** | Manuel | Manuel + assistance IA | **Auto IA + conciergerie 24/7** |
| **Groupes partage** | non | non | **oui** (4+4 → 8/8) |
| **Délai loueur** | 24h | 12h | **2h max + escalade équipe** |
| **Onboarding loueur** | KYC standard Stripe | KYC standard | **KYC renforcé + AML** |
| **Certification créateur** | Onboarding standard | Formation 1j | **Formation 2j Eventy + certification dédiée** |

---

## 3 · Composants à modifier ou créer

### 3.1 Existants à enrichir

| Fichier | Action |
|---------|--------|
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/types.ts` | + champ `tier: 'standard' \| 'premium'` dans `TripDraft` |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/mock-data.ts` | + `tier: 'standard'` dans `DEFAULT_DRAFT` |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/page.tsx` | + intégration `<TierSwitch>` en Phase 0 |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/PhaseSymphonySource.tsx` | + bloc `<TierSwitch>` au démarrage |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/PhaseInfos.tsx` | (futur sprint) lecture `tier` → ajuster `capacite` défaut |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/PhasePrix.tsx` | (futur sprint) lecture `tier` → ajuster marges défaut |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/PhaseHRA.tsx` | (futur sprint) lecture `tier` → filtrage min note 4★ Premium |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/PhaseActivites.tsx` | (futur sprint) lecture `tier` → filtrage exclusivité Premium |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/PhaseTwo.tsx` | (futur sprint) lecture `tier` → minibus VIP par défaut Premium |

### 3.2 Nouveaux fichiers (déposés ce sprint)

| Fichier | Description |
|---------|-------------|
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_components/TierSwitch.tsx` | Cards toggle Standard/Premium (haut Phase 0) |
| `frontend/app/(pro)/pro/voyages/nouveau-v2/_lib/tier-presets.ts` | Helpers : capacités défaut, marges, transports autorisés |
| **`frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/page.tsx`** | Page V2 Luxe dédiée (squelette stepper) |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_lib/luxe-types.ts` | Types Luxe (`LuxeTripDraft`, `LuxeQuoteEstimate`) |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_lib/voyage-luxe-billing.ts` | Helpers facturation Luxe + groupes partage |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_lib/luxe-design.ts` | Palette ivoire/or/champagne/noir profond |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_lib/luxe-mock-prestataires.ts` | Mock catalogue prestataires luxe (jets, yachts, palaces) |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_components/LuxeStepper.tsx` | Stepper dédié Luxe |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_components/LuxeQuoteIA.tsx` | Phase Devis IA (mock pour l'instant) |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_components/LuxeHRAPalaces.tsx` | Phase HRA palaces 5★ |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_components/LuxeTransportPicker.tsx` | Phase transport jets/hélicos/yachts |
| `frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_components/LuxeConciergeValidation.tsx` | Phase validation conciergerie |
| **`frontend/app/(client)/luxe/groupes-partage/page.tsx`** | Page client matching groupes partage Luxe |
| **`frontend/app/(equipe)/equipe/luxe-prestataires/page.tsx`** | Catalogue équipe prestataires luxe |
| **`frontend/app/(maisons)/maisons/luxe-onboarding/page.tsx`** | Onboarding KYC renforcé loueur jet/yacht |

---

## 4 · Modèle de facturation Luxe (détail)

### 4.1 Règle PDG

> *« Si jet 8 places, prix total ÷ voyageurs réels (8/6 si 6 viennent → prix par personne ajusté). »*

### 4.2 Helper

```ts
// _lib/voyage-luxe-billing.ts
export function computeLuxePricePerPax({
  totalCost,         // ex : 240 000 € (location jet + palace + activités)
  capacity,          // ex : 8 (capa du jet)
  actualPax,         // ex : 6 (voyageurs ayant réservé)
}: { totalCost: number; capacity: number; actualPax: number }) {
  if (actualPax <= 0) throw new Error("actualPax must be > 0");
  if (actualPax > capacity) throw new Error("actualPax cannot exceed capacity");
  return Math.ceil(totalCost / actualPax);
}
```

Exemples :
- Jet 8p, voyage 240 000 € total, 6 pax → **40 000 €/pax**
- Jet 8p, voyage 240 000 € total, 8 pax → **30 000 €/pax**
- Yacht 12p, voyage 1 200 000 € total, 10 pax → **120 000 €/pax**

### 4.3 Groupes partage Luxe — matching

```ts
export interface LuxeGroup {
  id: string;
  voyageId: string;        // voyage Luxe ciblé
  members: string[];       // user IDs
  capacity: number;        // capa max (= jet/yacht)
  status: 'open' | 'full' | 'merged' | 'cancelled';
  createdAt: string;
  organizerId: string;
}

export function proposeGroupMerge({
  groupA, groupB,
}: { groupA: LuxeGroup; groupB: LuxeGroup }) {
  if (groupA.voyageId !== groupB.voyageId) return { canMerge: false, reason: "voyage différent" };
  const total = groupA.members.length + groupB.members.length;
  const capacity = Math.min(groupA.capacity, groupB.capacity);
  if (total > capacity) return { canMerge: false, reason: `dépasse capa (${total} > ${capacity})` };
  return {
    canMerge: true,
    mergedSize: total,
    capacity,
    fillRate: total / capacity,
    pricePerPaxImpact: -((1 - groupA.members.length / total) * 100), // estimation baisse %
  };
}
```

---

## 5 · Phase Devis IA (Luxe)

### 5.1 Input utilisateur

- Destination (autocomplete villes monde)
- Transport souhaité (jet privé / hélico / yacht / mix)
- Dates (précises ou fenêtre)
- Nombre voyageurs (1-12)
- Préférences (palace 5★ / villa privée / yacht)

### 5.2 Output IA (mock pour l'instant, vraie IA à brancher)

```ts
export interface LuxeQuoteEstimate {
  totalCostMin: number;      // estimation basse
  totalCostMax: number;      // estimation haute
  costBreakdown: {
    transport: number;       // ex : jet 80k€
    accommodation: number;   // ex : palace 60k€
    activities: number;      // ex : 30k€
    concierge: number;       // ex : 5k€ (frais conciergerie)
    margin: number;          // ex : 15-25 %
  };
  pricePerPaxMin: number;    // selon `actualPax` annoncé
  pricePerPaxMax: number;
  estimateConfidence: 'low' | 'medium' | 'high';
  durationSeconds: number;   // temps de génération IA
  aiModel: string;           // ex : "anthropic/claude-opus-4-7"
  disclaimers: string[];
  nextStep: 'concierge-validation';
}
```

### 5.3 TODO Eventy

- Brancher OpenAI structured output ou Anthropic tool use
- Base prix prestataires luxe (jets, yachts, palaces) à indexer
- Cache 24h sur estimations identiques
- Logs détaillés pour amélioration modèle

---

## 6 · Stepper Luxe (différent de Standard/Premium)

| # | Phase | Composant |
|---|-------|-----------|
| 1 | Symphonie source (luxe ou nouvelle) | `PhaseSymphonyLuxe` |
| 2 | Infos voyage (titre, type, durée) | `PhaseInfosLuxe` |
| 3 | Dates (précises ou fenêtre) | `PhaseDatesLuxe` |
| 4 | **🪙 Devis IA** | `LuxeQuoteIA` |
| 5 | HRA luxe (palaces 5★, villas, yachts) | `LuxeHRAPalaces` |
| 6 | Transport luxe (jets, hélicos, limos) | `LuxeTransportPicker` |
| 7 | Activités exclusives | `LuxeActivitesExclusives` |
| 8 | Programme jour par jour | `LuxeProgramme` |
| 9 | Marketing (clientèle UHNW) | `LuxeMarketing` |
| 10 | **📞 Validation conciergerie 24/7** | `LuxeConciergeValidation` |

---

## 7 · Côté Équipe Eventy

### 7.1 Catalogue prestataires luxe (`/equipe/luxe-prestataires`)

- Jets : NetJets, VistaJet, Wijet, Flexjet
- Yachts : Camper & Nicholsons, Burgess Yachts, Fraser Yachts
- Hélicos : Monacair, Helibird, Eurocopter Charter
- Palaces : Le Bristol, George V, Le Meurice, Hôtel de Crillon, Cheval Blanc Courchevel
- Villas privées : Côte d'Azur, Toscane, Provence, Mykonos, Ibiza, Marrakech
- Limousines : Carey, Diva Limousines

### 7.2 Validation renforcée

- 2 personnes équipe Luxe doivent valider chaque voyage
- 1 admin (David ou délégué) signe le contrat
- Workflow : draft créateur → équipe Luxe (review) → admin (sign) → loueur (devis 2h) → client (paiement)

### 7.3 Conciergerie 24/7 (TODO Eventy)

- Chat temps réel
- Appel direct (numéro dédié)
- WhatsApp Business
- 3 niveaux de service : Bronze (chat), Silver (chat + appel), Gold (chat + appel + concierge dédié)

---

## 8 · Côté Loueurs (Maisons)

### 8.1 Onboarding Luxe (`/maisons/luxe-onboarding`)

- KYC renforcé Stripe Connect Custom
- AML (Anti-Money Laundering) check
- Vérification certifications (FAA / EASA pour jets, MCA pour yachts)
- Police d'assurance RC Pro spécifique luxe
- Contrat-cadre Eventy signé via DocuSign Enterprise

### 8.2 Workflow demande devis

1. Demande créateur → notification email + SMS + push
2. Délai max 2h pour répondre
3. Si non-réponse à 1h → relance auto (email + SMS)
4. Si non-réponse à 2h → escalade équipe Eventy (qui contacte loueur backup)
5. Devis fourni → review équipe Luxe (15 min max) → envoi client

---

## 9 · Format ULTRA premium (design)

### 9.1 Palette

```css
--luxe-ivory: #F5F1E8;        /* texte principal */
--luxe-gold: #C9A961;          /* accent (un peu plus profond que V2 standard) */
--luxe-champagne: #E8D9B5;     /* surface élevée */
--luxe-deep-black: #050810;    /* fond ultra noir */
--luxe-noir-velvet: #0D1118;   /* surface card */
--luxe-rose-or: #B89B6A;       /* texte secondaire */
--luxe-platinum: #D9D7D2;      /* hover / focus */
```

### 9.2 Typographies

- **Display** : Playfair Display (titres) + alternative Cormorant Garamond
- **Body** : Apple SF Pro fallback + Inter
- **Numbers** : Tabular Nums activés (luxe = précision)

### 9.3 Photos

- Yachts au coucher de soleil (Méditerranée)
- Jets privés sur tarmac (Le Bourget, Genève)
- Palaces (suite avec vue mer / montagne)
- Sources : Unsplash Premium + Getty Images licensed

---

## 10 · TODO Eventy détaillé (à enrichir au fil)

```
// TODO Eventy: catalogue HRA premium 4-5★ (palaces, châteaux, riads boutique) — 30+ entries
// TODO Eventy: catalogue HRA luxe 5★ palaces/villas/yachts — 15+ entries
// TODO Eventy: catalogue prestataires luxe (jets : NetJets/VistaJet, yachts : NetJets-Yacht, hélicos)
// TODO Eventy: API IA estimation prix luxe (OpenAI structured output ou Anthropic tool use)
// TODO Eventy: matching groupes partage luxe (algo de fusion 4+4 ou 6+2)
// TODO Eventy: conciergerie 24/7 luxe (chat temps réel + appel direct + WhatsApp Business)
// TODO Eventy: workflow validation renforcée luxe (2 équipe + admin)
// TODO Eventy: onboarding KYC luxe loueurs (Stripe Connect Custom + AML)
// TODO Eventy: notification email/SMS loueur luxe avec délai 2h auto
// TODO Eventy: marges plus élevées luxe (15-25% au lieu de 7-10%)
// TODO Eventy: certification créateur luxe avec formation dédiée (2j formation Eventy)
// TODO Eventy: visuels cinéma HD pour pages luxe (Unsplash Premium + Getty)
// TODO Eventy: signature électronique contrat luxe (DocuSign Enterprise)
// TODO Eventy: assurance RC Pro spécifique luxe (Lloyd's of London ?)
// TODO Eventy: notation prestataires luxe (NPS interne + reviews privées)
// TODO Eventy: app dédiée concierge luxe (mobile, push notifications dédiées)
```

---

## 11 · Plan progressif (sprints suggérés)

| Sprint | Périmètre | Statut |
|--------|-----------|--------|
| **S0 — Fondations (ce sprint)** | TierSwitch UI + types + helper presets + page Luxe squelette + helper billing + 3 pages associées (équipe, maisons, client) | ✅ En cours |
| S1 — Adaptation phases V2 | PhaseInfos / PhasePrix / PhaseHRA / PhaseActivites / PhaseTwo lisent `tier` | ⏳ |
| S2 — Catalogue Premium | 30+ HRA premium 4-5★ + filtrage backend | ⏳ |
| S3 — Catalogue Luxe | 15+ HRA luxe 5★ + 10+ prestataires jets/yachts | ⏳ |
| S4 — IA Devis Luxe | Branchement OpenAI/Anthropic + base prix réelle | ⏳ |
| S5 — Conciergerie 24/7 | Chat temps réel + appel + WhatsApp Business | ⏳ |
| S6 — Onboarding Luxe loueurs | KYC renforcé + AML + DocuSign | ⏳ |
| S7 — Groupes partage Luxe | Matching marketplace + algo fusion | ⏳ |
| S8 — Validation renforcée | Workflow équipe (2 personnes) + admin | ⏳ |
| S9 — Marketing UHNW | Templates dédiés + audience clientèle aisée | ⏳ |

---

## 12 · Risques & points d'attention

- **Risque légal** : voyages à 8 M€ → Atout France garantie financière à recalibrer (actuellement 1,6 M€ visé An 1)
- **Risque opérationnel** : conciergerie 24/7 = équipe astreinte → coût RH élevé
- **Risque image** : un voyage Luxe raté = communication désastreuse → validation renforcée vitale
- **Risque RGPD** : clientèle UHNW exige confidentialité absolue → chiffrement E2E des dossiers Luxe
- **Compatibilité** : ne pas casser V2 Standard existante (règle absolue CLAUDE.md)
- **Performance** : page Luxe ne doit pas alourdir bundle V2 Standard → code-split

---

## 13 · Liens

- [V2 Standard actuelle](frontend/app/(pro)/pro/voyages/nouveau-v2/page.tsx)
- [Page V2 Luxe (squelette)](frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/page.tsx)
- [Helper billing Luxe](frontend/app/(pro)/pro/voyages/nouveau-v2-luxe/_lib/voyage-luxe-billing.ts)
- [Catalogue équipe Luxe](frontend/app/(equipe)/equipe/luxe-prestataires/page.tsx)
- [Onboarding loueur Luxe](frontend/app/(maisons)/maisons/luxe-onboarding/page.tsx)
- [Groupes partage client](frontend/app/(client)/luxe/groupes-partage/page.tsx)
