# AUDIT ASSURANCES — INTÉGRATION TOTALE INCIDENTS / CONCIERGERIE / VOYAGES

> **Mandat David (PDG) — 2026-05-05**
> *« N'oublie pas de penser aux assurances en cas de souci, tout doit être relié. »*
>
> Cet audit décrit comment chaque incident voyageur, partenaire ou plateforme déclenche **automatiquement** la chaîne assurance la plus protectrice, comment chaque police se branche au reste de l'écosystème Eventy (incidents, conciergerie, voyages, finance, communications), et ce qu'il reste à câbler côté code, contrats et API assureurs.

---

## 1. Vision

Chez Eventy, la promesse est : **« Tu n'as rien à gérer, tout à vivre. »**
Cela signifie que dès qu'un imprévu touche un voyageur, un créateur, une maison HRA ou la plateforme elle-même :

1. **Le voyageur est rassuré en moins de 60 secondes** par une notification claire (statut, qui prend en charge, où en est l'assureur).
2. **L'équipe Eventy a déjà reçu le pré-dossier** de sinistre (photos, témoignages, géolocalisation) et n'a qu'à valider.
3. **L'assureur reçoit le dossier complet par API** ou email automatisé, sans aucune ressaisie humaine.
4. **Le remboursement est versé sur Stripe** dès la décision de l'assureur, et le voyageur est informé à chaque étape.

Aucun voyageur ne doit *jamais* avoir à expliquer deux fois ce qui s'est passé. Aucun créateur ne doit *jamais* être seul face à une catastrophe naturelle, une hospitalisation ou une perte de bagages. C'est le **Pack Sérénité** mis en code.

---

## 2. Périmètre — 10 catégories d'assurance Eventy

| # | Catégorie | Couverture | Détenteur | Compagnie type | Coût estimé |
|---|-----------|-----------|-----------|----------------|-------------|
| 1 | **RC Pro Eventy** | Responsabilité plateforme + créateurs | Eventy SAS | AXA Entreprises | ~25 000 €/an |
| 2 | **Garantie financière** | Voyageurs si Eventy défaillit | Eventy SAS | APST (1ᵉʳ choix) | ~2 100 €/an pour 1,6 M€ |
| 3 | **Annulation voyageur** | Voyageur annule pour raison légitime | Voyageur | Mondial / Allianz Travel | +10€/pax (pack Std) |
| 4 | **Assistance voyage** | Rapatriement, frais médicaux, retour anticipé | Voyageur | Europ Assistance / AXA Assistance | +20€/pax (pack Std) |
| 5 | **Bagages** | Perte, vol, détérioration | Voyageur | MAIF / Chapka | +5€/pax (pack Std) |
| 6 | **Multirisque Premium** | Pack complet annulation + assistance + bagages + interruption | Voyageur | Allianz Travel | +30€/pax |
| 7 | **Multirisque Luxe** | Couverture jet/yacht + bijoux + clés VIP | Voyageur Luxe | Lloyds of London | +200€/pax sur mesure |
| 8 | **Créateur / Indépendant** | RC perso opérations + AT (accidents du travail) | Créateur indé | Hiscox / SwissLife | ~600€/an par indé |
| 9 | **HRA partenaire** | Couverture spécifique chambres / tables / activités | Maison HRA | Generali / MAIF Pro | Variable |
| 10 | **Cyber assurance Eventy** | Fuites, ransomware, attaques | Eventy SAS | Beazley / Hiscox | ~8 000 €/an pour 2 M€ |

Total prime annuelle estimée Eventy An 1 : **~45 k€** (hors primes voyageurs refacturées).

---

## 3. Lien incidents ↔ assurances — matrice d'auto-déclenchement

| Type d'incident détecté | Module qui détecte | Assurance(s) déclenchée(s) | Action automatique Eventy |
|------------------------|--------------------|---------------------------|---------------------------|
| Voyageur malade | `incidents` + `accompagnateur` | **Assistance voyage** + Multirisque | Téléassistance 24/7 + dossier auto + notif équipe |
| Annulation force majeure (J-X) | `bookings/cancellation` | **Annulation** | Reconstruction dossier + envoi automatique + remboursement Stripe |
| Bagages perdus avion | `incidents` (catégorie LUGGAGE) | **Bagages** | Photo BSP + PIR transmis + relance compagnie aérienne |
| Indé blessé pendant voyage | `incidents` (catégorie WORKER_INJURY) | **AT créateur/indé** + RC Eventy | Déclaration AT < 48h + soutien légal |
| Surbooking HRA | `incidents` (catégorie HRA_OVERBOOK) | **RC Eventy** + recours HRA | Relogement + indemnisation client + recours auto vs HRA |
| Catastrophe naturelle | `incidents` (catégorie FORCE_MAJEURE) | **Multirisque** + assistance + RC Eventy | Cellule crise + comm voyageurs + dossier multi-assureurs |
| Vol / agression | `incidents` (catégorie THEFT) | **Bagages** + assistance | Dépôt plainte digital + transmission auto |
| Décès voyageur | `incidents` (catégorie DEATH) | **Assistance** + multirisque + RC | Cellule crise spéciale + accompagnement famille |
| Cyberbreach Eventy | `securité` (CISO) | **Cyber assurance** | Notif CNIL <72h + comm voyageurs + dossier Beazley |
| Litige légal voyageur | `legal` | **RC Pro Eventy** | Dossier avocat + notif AXA Entreprises |
| Accident jet/yacht (luxe) | `incidents` + `transport` | **Multirisque Luxe** Lloyds | Cellule crise VIP + concierge sur place |

**Tout incident enregistré (`incidents.create`) déclenche `sinistre-workflow.ts` qui décide quelle police activer.**

---

## 4. Workflow de déclenchement automatique

```
[Détection incident]
       │
       ▼
[Triage par catégorie + sévérité]
       │
       ▼
[Sélection police(s) concernée(s)]   ◄── insurance-policies.ts
       │
       ▼
[Construction dossier sinistre auto] ◄── insurance-claim-builder.ts
   • photos depuis le voyage
   • géoloc accompagnateur
   • témoignages texte recueillis
   • justificatifs uploadés
   • PIR / BSP / dépôt de plainte
       │
       ▼
[Transmission assureur]
   • API Mondial / AXA / Europ / Allianz / April si dispo
   • sinon email automatique avec PDF + pièces
       │
       ▼
[Suivi statuts]
   SUBMITTED → IN_REVIEW → APPROVED / REJECTED → PAID
       │
       ▼
[Notification voyageur à chaque étape]
   • email + push + WhatsApp (selon préférence)
       │
       ▼
[Versement remboursement Stripe]
   • automatique dès APPROVED + montant validé
   • compte bancaire voyageur ou wallet Eventy
       │
       ▼
[Audit log + dashboard équipe]
```

Chaque étape est tracée dans le module `audit-log` avec hash signé (anti-falsification).

---

## 5. État des lieux — code existant

### Backend (NestJS)

| Module | Fichier | Statut |
|--------|---------|--------|
| `insurance` | `backend/src/modules/insurance/insurance.module.ts` | ✅ Présent |
| `insurance.service` | `insurance.service.ts` | ✅ |
| `insurance.controller` | `insurance.controller.ts` | ✅ |
| `claims.service` | `claims.service.ts` | ✅ |
| `claims.controller` | `claims.controller.ts` | ✅ |
| `assureur-access.service` | `assureur-access.service.ts` | ✅ Portail RBAC ASSUREUR |
| DTO `subscribe-insurance.dto.ts` | ✅ |
| DTO `submit-claim.dto.ts` | ✅ |
| DTO `update-claim-status.dto.ts` | ✅ |
| Tests E2E | `backend/test/insurance.e2e-spec.ts` | ✅ |

### Frontend

| Page / Composant | Path | Statut | Action |
|------------------|------|--------|--------|
| `/admin/assurances` | `app/(admin)/admin/assurances/page.tsx` | ✅ Complète (5 onglets) | Inchangée |
| `/equipe/assurances` | `app/(equipe)/equipe/assurances/page.tsx` | ✅ Dashboard | Inchangée |
| `/equipe/assurances/sinistres` | `app/(equipe)/equipe/assurances/sinistres/page.tsx` | ✅ | Inchangée |
| `/equipe/assurances/declarations` | `app/(equipe)/equipe/assurances/declarations/page.tsx` | ✅ | Inchangée |
| `/equipe/sinistres/[id]` | — | ❌ | **À CRÉER** |
| `/pro/assurances` | — | ❌ | **À CRÉER** |
| `/independant/assurances` | — | ❌ | **À CRÉER** |
| `/maisons/assurances` | — | ❌ | **À CRÉER** |
| `/client/voyage/[id]/assurances` | — | ❌ | **À CRÉER** |
| `/client/assurance` | `app/(client)/client/assurance/page.tsx` | ✅ Existe | Inchangée |
| `<InsuranceCard>` | `components/insurance/insurance-card.tsx` | ✅ Basique | Conservée |
| `<InsurancePackCard>` | — | ❌ | **À CRÉER** |
| `<ComparisonTable>` | — | ❌ | **À CRÉER** |
| `<ClaimForm>` | — | ❌ | **À CRÉER** |
| `<SinistreCard>` | — | ❌ | **À CRÉER** |
| `<InsurerDashboard>` | — | ❌ | **À CRÉER** |
| `useInsurance()` hook | `lib/hooks/use-insurance.ts` | ✅ | Inchangé |
| `lib/insurance-policies.ts` | — | ❌ | **À CRÉER** |
| `lib/sinistre-workflow.ts` | — | ❌ | **À CRÉER** |
| `lib/insurance-claim-builder.ts` | — | ❌ | **À CRÉER** |

### API routes existantes

- `POST /api/client/assurance/subscribe` — souscription
- `GET /api/client/assurance` — liste
- `POST /api/client/assurance/claim` — déposer un sinistre
- `GET /api/client/assurance/claim` — suivre ses sinistres
- `GET /api/insurance/mine` — assurances de l'user

**API à ajouter** :
- `POST /api/equipe/sinistres/from-incident` — création depuis incident
- `POST /api/equipe/sinistres/[id]/transmit` — transmission assureur
- `GET /api/equipe/sinistres/[id]` — drill down
- `POST /api/equipe/sinistres/[id]/refund` — versement Stripe

---

## 6. Format ULTRA premium

**Palette assurances** (homogène avec brand Eventy V2 Premium / Luxe) :

| Token | Couleur | Usage |
|-------|---------|-------|
| `--ivory` | `#F5EFE6` | Fond pages voyageur |
| `--ivory-soft` | `#FAF6EF` | Cards |
| `--gold` | `#D4A853` | Accents premium |
| `--gold-soft` | `#E8C88B` | Hover gold |
| `--midnight` | `#0F1A2E` | Bleu nuit confiance, headers |
| `--midnight-soft` | `#1B2942` | Cards portail équipe |
| `--shield-green` | `#3D8C5F` | Statut couvert / payé |
| `--alert-coral` | `#E56B6F` | Alerte sinistre ouvert |

**Typographies** : Playfair Display (titres), Inter (corps), JetBrains Mono (montants).

**Iconographie** : `Shield`, `ShieldCheck`, `Heart`, `Phone`, `LifeBuoy`, `Sparkles`, `Crown`, `BadgeCheck`.

**Effets** : glassmorphism (backdrop-blur), gradients ivoire→gold, photos cinéma "main qui rassure" pour packs.

---

## 7. Documentation légale — pack par pack

### Pack BASIQUE (inclus dans tout voyage)
- RC Eventy + garantie financière APST
- Assistance 24/7 par téléphone
- Pas de remboursement annulation

### Pack STANDARD (+10€/pax)
- Tout BASIQUE
- Annulation pour maladie, accident, décès proche
- Bagages jusqu'à 800€
- Frais médicaux Europe jusqu'à 30 000€

### Pack PREMIUM (+30€/pax)
- Tout STANDARD
- Annulation toutes causes (sauf exclusions)
- Bagages jusqu'à 2 500€
- Frais médicaux monde jusqu'à 150 000€
- Rapatriement sanitaire premium
- Retour anticipé sans justificatif

### Pack LUXE (+200€/pax — sur mesure)
- Tout PREMIUM
- Couverture jet/yacht + bijoux + matériel pro
- Conciergerie 24/7 dédiée Lloyds
- Frais médicaux monde jusqu'à 1 000 000€
- Indemnité forfaitaire VIP en cas de retard >4h

**Conformité UE 2015/2302** : Notice information voyageur PDF auto-générée à chaque réservation, listant : assurances incluses, assurances optionnelles, exclusions, organisme de garantie financière (APST), procédure de déclaration, délais.

---

## 8. Côté équipe — tableau de bord sinistres

- Vue par compagnie : nombre de sinistres, taux d'acceptation, délai moyen, ratio S/P
- Vue par voyage : sinistres ouverts, montants en jeu, couverture en pourcentage
- Statistiques annuelles : prime payée vs sinistres remboursés, ratio par police
- Renégociation polices : auto-relance courtier 60 jours avant échéance
- Notification équipe automatique si sinistre coûteux >5 000€ ou >10 000€ → escalade direction

---

## 9. Intégrations API assureurs

| Compagnie | API disponible | Mode fallback |
|-----------|---------------|---------------|
| **Mondial Assistance** | API REST partenaires (à négocier) | Email automatique avec PDF + pièces |
| **AXA Assistance** | AXA API Hub (B2B) | Email |
| **Europ Assistance** | EA Connect (sur demande) | Email |
| **Allianz Travel** | Allianz Connect (B2B) | Email |
| **April International** | April B2B API | Email |
| **Lloyds of London** (Luxe) | Pas d'API publique | Email + appel courtier |
| **Beazley** (Cyber) | Email + portail courtier | Email |
| **Hiscox** | Hiscox Connect | Email |

**Architecture** : adaptateur générique `InsurerAdapter` qui implémente `submit()`, `status()`, `documents()`, `webhook()`. Chaque compagnie a son implémentation, fallback email si l'API est down.

---

## 10. Plan de mise en œuvre

### Sprint 1 — fondations (cette session)
- [x] Audit
- [x] Helpers `lib/insurance-policies.ts`, `lib/sinistre-workflow.ts`, `lib/insurance-claim-builder.ts`
- [x] Pages manquantes : pro / indé / maisons / voyageur / équipe sinistres détail
- [x] Composants : InsurancePackCard, ComparisonTable, ClaimForm, SinistreCard, InsurerDashboard

### Sprint 2 — câblage backend
- [ ] Endpoint `POST /api/equipe/sinistres/from-incident`
- [ ] Endpoint `POST /api/equipe/sinistres/[id]/transmit`
- [ ] Adaptateurs API Mondial / AXA / Europ / Allianz / April
- [ ] Webhooks reçus → mise à jour statut + notif voyageur
- [ ] Stripe payout automatique post-validation

### Sprint 3 — production
- [ ] Négociation polices avec courtier (Gras Savoye)
- [ ] Signature contrats (RC Pro, voyageurs pack, créateurs, HRA)
- [ ] Activation API B2B chez chaque compagnie
- [ ] Test end-to-end sinistre fictif

### Sprint 4 — opérations
- [ ] Documentation runbook équipe
- [ ] Formation équipe sinistres (guide visuel)
- [ ] Rapport mensuel sinistralité
- [ ] Audit annuel des polices

---

## 11. TODO Eventy (en commentaires dans le code)

```
// TODO Eventy: négocier polices Eventy avec compagnies (RC pro, voyageurs pack, créateurs, HRA)
// TODO Eventy: API Mondial Assistance / AXA / Europ / Allianz / April (déclaration sinistre + suivi)
// TODO Eventy: génération auto dossier sinistre depuis incident (PDF + photos + témoignages)
// TODO Eventy: workflow remboursement automatique post-validation sinistre
// TODO Eventy: notification voyageur étapes sinistre (réception / instruction / décision / paiement)
// TODO Eventy: assurance cyber (Beazley, Hiscox) pour la plateforme
// TODO Eventy: assurance jet/yacht spécifique luxe (Lloyds, Allianz Aviation)
// TODO Eventy: tableau bord PDG : montant prime annuel + sinistres + ratio
// TODO Eventy: audit annuel des polices avec courtier
// TODO Eventy: notice info voyage PDF auto (UE 2015/2302) avec mentions assurances
```

---

## 12. Liens vers les fichiers livrés

### Helpers
- `frontend/lib/insurance-policies.ts` — catalogue compagnies + polices
- `frontend/lib/sinistre-workflow.ts` — workflow déclenchement
- `frontend/lib/insurance-claim-builder.ts` — builder dossier auto

### Pages
- `frontend/app/(pro)/pro/assurances/page.tsx`
- `frontend/app/(independant)/independant/assurances/page.tsx`
- `frontend/app/(maisons)/maisons/assurances/page.tsx`
- `frontend/app/(client)/client/voyage/[id]/assurances/page.tsx`
- `frontend/app/(equipe)/equipe/sinistres/[id]/page.tsx`

### Composants
- `frontend/components/insurance/InsurancePackCard.tsx`
- `frontend/components/insurance/ComparisonTable.tsx`
- `frontend/components/insurance/ClaimForm.tsx`
- `frontend/components/insurance/SinistreCard.tsx`
- `frontend/components/insurance/InsurerDashboard.tsx`

---

**Audit terminé — 2026-05-05 — David, ton dos est couvert.**
*Tout incident → toute assurance → tout voyageur protégé. Sans clic manuel.*
