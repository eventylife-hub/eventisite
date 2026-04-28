# TODO — AUTOMATISATIONS EVENTY (audit exhaustif)

> **Audit réalisé le 2026-04-29**
> Objectif : automatiser tout ce qui peut l'être pour gagner du temps à
> tous les acteurs (créateurs, clients, équipe, comptable, admin).
>
> Principe : chaque tâche manuelle répétée plus de 3 fois = candidate à
> l'automatisation. L'humain garde la décision (validation, créativité,
> relation), la machine fait le reste.
>
> **Modèle économique rappelé** : 82% marge Eventy / 18% brut indépendant
> (sur la marge uniquement, jamais sur le coût total — cf. mémoire projet).

---

## SOMMAIRE

1. [Création voyage (côté pro)](#1-création-voyage-côté-pro)
2. [Réservation client](#2-réservation-client)
3. [Bracelets NFC](#3-bracelets-nfc)
4. [Marketing](#4-marketing)
5. [Comptabilité](#5-comptabilité)
6. [Communication](#6-communication)
7. [Gaming / Énergie](#7-gaming--énergie)
8. [Modération](#8-modération)
9. [Tableau de priorités MVP](#9-tableau-de-priorités-mvp)
10. [Architecture proposée](#10-architecture-proposée)

---

## VISION

```
Créateur ───► Voyage publié auto         Client ───► Réservation guidée
   │              │                          │              │
   │     ┌────────┴───────┐                  │     ┌────────┴────────┐
   │     │  ENGINE AUTO   │ ◄────────────────┘     │  WORKFLOW AUTO  │
   │     │  - Programme   │                        │  - Confirmation │
   │     │  - Prix        │                        │  - Facture      │
   │     │  - Devis bus   │                        │  - Calendrier   │
   │     │  - Flyers      │                        │  - Notifs J-N   │
   │     └────────────────┘                        └─────────────────┘
   │              │                                         │
   └──► Versement auto ◄── COMPTA AUTO ──► TVA marge / FEC / facturier
```

---

## 1. CRÉATION VOYAGE (côté pro)

### 1.1 Programme jour par jour AUTO-GÉNÉRÉ

**Objectif** : Le créateur définit les arrêts (départ, étapes, destination)
et les activités prévues. Le système génère automatiquement un programme
détaillé heure par heure.

| Étape | Auto ? | Détail |
|-------|--------|--------|
| Calcul durée trajet | ✅ Auto | Distance × vitesse moyenne bus + pauses légales |
| Pauses chauffeur | ✅ Auto | 1 pause 45min toutes les 4h30 (loi UE 561/2006) |
| Heures d'arrivée | ✅ Auto | Cumul depuis heure de départ |
| Insertion activités | ✅ Auto | Slot le plus logique selon horaires HRA |
| Repas | ✅ Auto | Petit-déj 8h, déjeuner 12h30, dîner 19h30 |
| Check-in / check-out hôtel | ✅ Auto | 15h / 11h par défaut, ajustable |
| Suggestions intelligentes | 🟡 Semi | "Activité libre 14h-17h ?" |
| Texte descriptif | ✅ Auto | Template par type de jour (transit / sur place / retour) |
| Validation finale | 🚫 Humain | Le créateur relit et publie |

**Fichiers cibles** :
- `backend/src/modules/travels/itinerary/itinerary-generator.service.ts`
- `frontend/app/(pro)/pro/voyages/[id]/programme/page.tsx`

### 1.2 Calcul prix AUTO

**Formule appliquée** :
```
Coût total = Bus + Hébergement + Restos + Activités + Assurance
Marge brute = Coût × (% configurable, défaut 25%)
Prix vendu HT = Coût + Marge brute
TVA marge = Marge × 20/120
Prix vendu TTC = Prix HT (TVA déjà incluse dans la marge)
Frais Stripe = Prix TTC × 1.4% + 0.25€
Marge nette Eventy = (Marge × 82%) - Frais Stripe
Brut indépendant = Marge × 18%
```

| Composant | Source | Auto ? |
|-----------|--------|--------|
| Bus | Devis transporteur (table `transport_quotes`) | ✅ |
| Hébergement | Tarif HRA × nb chambres × nb nuits | ✅ |
| Restos | Tarif menu × nb pax × nb repas | ✅ |
| Activités | Tarif activité × nb pax | ✅ |
| Assurance | Pack Sérénité (forfait fixe 9€/pax) | ✅ |
| Marge | % paramétrable par créateur (défaut 25%) | 🟡 |
| Arrondi | Au 5€ supérieur (psychologie prix) | ✅ |

**Fichiers cibles** :
- `backend/src/modules/travels/pricing/pricing-engine.service.ts`
- `frontend/components/pro/voyages/price-calculator.tsx`

### 1.3 Suggestions HRA selon destination

| Action | Auto ? |
|--------|--------|
| Filtrer hôtels dans rayon X km destination | ✅ |
| Trier par taux de remplissage / avis | ✅ |
| Suggérer restos sur le trajet (pause déjeuner) | ✅ |
| Suggérer activités selon thème voyage | ✅ |
| Vérifier disponibilité dates voyage | ✅ |

### 1.4 Génération fiche voyage prête à publier

| Auto ? | Élément |
|--------|---------|
| ✅ | Slug SEO depuis titre |
| ✅ | Meta title / description |
| ✅ | Photo de couverture (1ère photo destination) |
| ✅ | Galerie (photos HRA + activités) |
| ✅ | Carte interactive (arrêts géocodés) |
| ✅ | Calendrier disponibilités |
| ✅ | Bouton "Réserver" actif si seuil minimal atteint |
| 🚫 | Validation modération (humain) |

### 1.5 Demande de devis transport AUTO

| Auto ? | Détail |
|--------|--------|
| ✅ | Sélection automatique des 3 transporteurs les mieux notés sur la zone |
| ✅ | Email type envoyé avec : itinéraire, dates, nb pax, contact créateur |
| ✅ | Délai de réponse 48h, relance auto à J+2 |
| ✅ | Comparatif côté admin dès réception |
| 🚫 | Choix final (humain) |

### 1.6 Génération flyers AUTO

→ Couvert par [TODO-FLYERS-AUTO.md](TODO-FLYERS-AUTO.md). À intégrer.

---

## 2. RÉSERVATION CLIENT

### 2.1 Confirmation email AUTO après réservation

| Auto ? | Action |
|--------|--------|
| ✅ | Email confirmation immédiate (template `EMAILS-CLIENTS.md` #2) |
| ✅ | PDF récapitulatif joint |
| ✅ | Lien espace client personnalisé |
| ✅ | Numéro de réservation auto-généré (`EVT-YYYY-XXXXXX`) |

### 2.2 Génération facture AUTO

| Auto ? | Détail |
|--------|--------|
| ✅ | Numérotation séquentielle (`F-YYYY-NNNN`) |
| ✅ | Mention "TVA sur la marge — Art. 266-1-b CGI" |
| ✅ | PDF stocké dans S3 / Scaleway |
| ✅ | Envoi email + accès espace client |
| ✅ | Réémission auto si données client modifiées |

### 2.3 Ajout au calendrier client AUTO

| Auto ? | Format |
|--------|--------|
| ✅ | Génération `.ics` joint |
| ✅ | Bouton "Ajouter à Google Calendar" |
| ✅ | Bouton "Ajouter à Apple Calendar" |
| ✅ | Bouton "Ajouter à Outlook" |
| ✅ | Mise à jour auto si dates voyage changent |

### 2.4 Création groupe voyage AUTO si plusieurs personnes

| Auto ? | Détail |
|--------|--------|
| ✅ | Si réservation ≥ 2 personnes → groupe créé automatiquement |
| ✅ | Réservation principale = "responsable groupe" |
| ✅ | Invitation email aux co-voyageurs |
| ✅ | Formulaires individuels (pièce identité, allergies, urgence) |
| ✅ | Chat groupe activé |

### 2.5 Notifications J-7, J-3, J-1, jour J

| Date | Canal | Contenu |
|------|-------|---------|
| J-30 | Email | Préparation, équipement conseillé |
| J-7 | Email + Push | Récapitulatif, météo, équipe |
| J-3 | Email + Push | Lieu de RDV, horaire précis, contact chauffeur |
| J-1 | SMS + Push | "Rappel : départ demain 7h Place Bellecour" |
| Jour J | Push | "Bon voyage ! Voici le contact en cas de besoin" |
| J+1 | Push | "Tout va bien ? Une question ?" |
| J+3 | Email | Photos, demande d'avis, fidélisation |

---

## 3. BRACELETS NFC

### 3.1 Commande AUTO chez fournisseur

| Auto ? | Action |
|--------|--------|
| ✅ | Trigger : voyage validé + seuil minimal atteint |
| ✅ | Calcul quantité = nb_pax + 10% buffer |
| ✅ | Provisioning UID NFC dans la base avant impression |
| ✅ | Commande API auprès du fournisseur (Adopen, Smartrac, ou local) |
| ✅ | Email confirmation au créateur |
| ✅ | Suivi commande dans `/pro/voyages/[id]/nfc` |

### 3.2 Tracking AUTO de la livraison

| Auto ? | Action |
|--------|--------|
| ✅ | Webhook fournisseur → MAJ statut |
| ✅ | Notification créateur à chaque étape (commandé, expédié, livré) |
| ✅ | Alerte admin si retard > 3 jours |

### 3.3 Notification indépendant à réception

| Auto ? | Action |
|--------|--------|
| ✅ | Push + email : "Vos bracelets sont arrivés" |
| ✅ | Lien vers checklist activation |
| ✅ | Bouton "Confirmer réception" |

### 3.4 Rattachement client AUTO à l'embarquement

| Auto ? | Action |
|--------|--------|
| ✅ | Scan bracelet à l'embarquement → recherche par UID |
| ✅ | Si UID non rattaché : pop-up sélection passager |
| ✅ | Liaison `client_id ↔ nfc_uid` enregistrée |
| ✅ | Synchronisation hors-ligne (PWA) |

---

## 4. MARKETING

### 4.1 Flyers générés AUTO

→ Couvert par [TODO-FLYERS-AUTO.md](TODO-FLYERS-AUTO.md).

### 4.2 Templates partage social pré-remplis

| Réseau | Auto ? | Format |
|--------|--------|--------|
| Instagram Story | ✅ | 1080×1920 PNG + lien sticker |
| Instagram Post | ✅ | 1080×1080 PNG + caption pré-écrite |
| Facebook | ✅ | Image + copy + lien |
| WhatsApp | ✅ | Image + texte + lien court |
| LinkedIn | ✅ | Image + post pro |
| TikTok | 🟡 | Storyboard + audio suggéré |

### 4.3 Campagnes saisonnières AUTO

| Saison | Trigger date | Voyages mis en avant |
|--------|--------------|----------------------|
| Noël / Nouvel An | 15 nov | Marchés Noël, Réveillon |
| St Valentin | 1 fév | Escapades couples |
| Vacances été | 1 mai | Week-end mer / montagne |
| Rentrée | 15 août | Sorties septembre |
| Toussaint | 1 oct | Vacances scolaires |

### 4.4 Liens trackés AUTO pour vendeurs

| Auto ? | Détail |
|--------|--------|
| ✅ | Génération slug court (`evt.fr/v/AB12CD`) |
| ✅ | UTM auto (utm_source = code vendeur) |
| ✅ | Cookie 30 jours pour attribution |
| ✅ | Dashboard vendeur temps réel |
| ✅ | Commission auto sur conversion |

---

## 5. COMPTABILITÉ

### 5.1 Facture créateur AUTO chaque mois

| Auto ? | Détail |
|--------|--------|
| ✅ | Cron 1er du mois 03:00 |
| ✅ | Calcul commissions sur voyages clôturés du mois précédent |
| ✅ | Application 18% brut indépendant sur la marge |
| ✅ | Génération facture/note d'auto-entrepreneur |
| ✅ | Envoi email + dépôt espace créateur |
| ✅ | Mention TVA exonérée si auto-entrepreneur < seuil |

### 5.2 Facture client AUTO

→ Couvert par 2.2.

### 5.3 Versement créateur AUTO selon modèle

| Auto ? | Détail |
|--------|--------|
| ✅ | Cron 5 du mois (date stable) |
| ✅ | Virement SEPA via API banque (Qonto / Stripe Treasury) |
| ✅ | Référence : numéro facture créateur |
| ✅ | Email confirmation virement |
| ✅ | Trace dans `transactions` (audit) |
| 🚫 | Validation manuelle si > 10 000€ (anti-fraude) |

### 5.4 Export FEC AUTO pour comptable

| Auto ? | Détail |
|--------|--------|
| ✅ | Export annuel automatique au 31/12 minuit |
| ✅ | Format FEC officiel (Article A47 A-1 LPF) |
| ✅ | 18 colonnes obligatoires |
| ✅ | Encodage UTF-8 BOM |
| ✅ | Séparateur `|` (pipe) |
| ✅ | Envoi expert-comptable + dépôt espace admin |

### 5.5 Calcul TVA marge AUTO

| Auto ? | Détail |
|--------|--------|
| ✅ | Calcul mensuel : marge brute × 20/120 |
| ✅ | Pré-remplissage déclaration CA3 |
| ✅ | Alerte admin avant 19 du mois |
| ✅ | Archivage justificatifs (factures fournisseurs) |

---

## 6. COMMUNICATION

### 6.1 Email pré-départ AUTO

→ Couvert par 2.5.

### 6.2 SMS rappel arrêt bus AUTO

| Auto ? | Détail |
|--------|--------|
| ✅ | Trigger J-1 18h : SMS chaque passager |
| ✅ | Contenu : "Demain 7h00 — Place Bellecour, devant l'Office du Tourisme" |
| ✅ | Lien Google Maps |
| ✅ | Lien chat chauffeur |
| ✅ | Provider : OVH SMS, Twilio ou Brevo |

### 6.3 Email post-voyage AUTO

| J+ | Action |
|----|--------|
| J+1 | Push : "Tout s'est bien passé ?" |
| J+3 | Email : photos partagées, demande avis |
| J+7 | Email : "Le prochain voyage qui pourrait vous plaire" |
| J+30 | Email : code parrainage (-20€ pour 1 ami) |

### 6.4 Notification créateur si nouvelle réservation

| Auto ? | Canal |
|--------|--------|
| ✅ | Push (PWA pro) |
| ✅ | Email résumé quotidien (digest) |
| ✅ | Slack si intégration activée |

---

## 7. GAMING / ÉNERGIE

### 7.1 Distribution énergie AUTO

| Source | Trigger | Énergie attribuée |
|--------|---------|-------------------|
| Réservation voyage | Paiement confirmé | 100 ⚡ |
| Avis ≥ 4 étoiles | Avis posté | 50 ⚡ |
| Parrainage filleul converti | Réservation filleul | 200 ⚡ |
| Code créateur utilisé | Réservation | 75 ⚡ |
| Quizz daily | Réponse correcte | 10 ⚡ |
| Boss vaincu | Mécanique gaming | 500 ⚡ |
| Anniversaire | J-anniversaire | 150 ⚡ |

### 7.2 Calcul cagnotte AUTO

| Auto ? | Détail |
|--------|--------|
| ✅ | Conversion énergie → € (1000 ⚡ = 1€) |
| ✅ | Plafond cagnotte : 50% du prix voyage suivant |
| ✅ | Expiration : 24 mois |
| ✅ | Application auto au checkout (si client le souhaite) |

### 7.3 Cartes énergie AUTO lors d'événements

| Événement | Carte distribuée |
|-----------|------------------|
| Lancement nouveau voyage | Carte "Pionnier" |
| Voyage de groupe complet | Carte "Bus rempli" |
| Voyage à thème | Carte thématique |
| Anniversaire compte | Carte "Anniversaire Eventy" |

---

## 8. MODÉRATION

### 8.1 Détection auto contenu inapproprié

| Auto ? | Outil |
|--------|--------|
| ✅ | Texte : OpenAI Moderation API (si activé) ou regex maison |
| ✅ | Image : Sightengine ou modération manuelle EXIF/poids |
| ✅ | Détection insultes, contenu sexuel, violence |
| ✅ | Liste noire de mots configurable |

### 8.2 Validation auto si conformité OK

| Auto ? | Action |
|--------|--------|
| ✅ | Score conformité < seuil → publication immédiate |
| ✅ | Score zone grise → file modération admin |
| ✅ | Score critique → blocage + notif créateur |

### 8.3 Alertes admin AUTO si anomalie

| Type | Trigger |
|------|---------|
| Pic réservations | > 3× moyenne 7j |
| Annulations en masse | > 5% taux quotidien |
| Pics paiements échoués | > 10% taux quotidien |
| Avis négatifs | Note moyenne 7j < 3.5 |
| Tentatives connexion | > 10/min même IP |
| Trafic suspect | Bot signature détectée |

---

## 9. TABLEAU DE PRIORITÉS MVP

### P0 — INDISPENSABLE LANCEMENT (codé maintenant)

| # | Automatisation | Module |
|---|----------------|--------|
| 1 | Programme jour par jour auto | `travels/itinerary` |
| 2 | Calcul prix auto | `travels/pricing` |
| 3 | Confirmation + facture client | `bookings/lifecycle` |
| 4 | Notifications J-N voyage | `notifications/scheduled` |
| 5 | Commande NFC auto | `nfc/orders` |
| 6 | Facture créateur mensuelle | `accounting/creator-invoicing` |
| 7 | Calcul TVA marge mensuel | `accounting/vat-margin` |
| 8 | Export FEC annuel | `accounting/fec-export` |

### P1 — POST-LANCEMENT (3 mois)

| # | Automatisation |
|---|----------------|
| 9 | Devis transport auto + relance |
| 10 | Suggestions HRA selon destination |
| 11 | Création groupe voyage auto |
| 12 | Cagnotte énergie auto |
| 13 | Liens trackés vendeurs auto |
| 14 | Versement SEPA créateur auto |
| 15 | Modération contenu auto |

### P2 — V2 (6 mois)

| # | Automatisation |
|---|----------------|
| 16 | Campagnes saisonnières auto |
| 17 | Suggestions activités IA |
| 18 | Détection anomalies admin (ML) |
| 19 | Cartes énergie événementielles |
| 20 | Slack/Discord intégrations |

---

## 10. ARCHITECTURE PROPOSÉE

### Backend NestJS

```
backend/src/modules/
├── automations/                  ← NOUVEAU module orchestrateur
│   ├── automations.module.ts
│   ├── automation-runner.service.ts   (cron + queue dispatcher)
│   ├── audit-log.service.ts           (toutes actions auto loguées)
│   └── README.md
├── travels/
│   ├── itinerary/
│   │   └── itinerary-generator.service.ts   ← P0
│   └── pricing/
│       └── pricing-engine.service.ts        ← P0
├── bookings/
│   └── lifecycle/
│       └── booking-lifecycle.service.ts     ← P0
├── nfc/
│   └── orders/
│       └── nfc-order.service.ts             ← P0
├── notifications/
│   └── scheduled/
│       └── scheduled-notifications.service.ts ← P0
└── accounting/
    ├── creator-invoicing/
    │   └── creator-invoicing.service.ts     ← P0
    ├── vat-margin/
    │   └── vat-margin.service.ts            ← P0
    └── fec-export/
        └── fec-export.service.ts            ← P0
```

### Frontend Next.js — Page admin de pilotage

```
frontend/app/(admin)/admin/automations/
├── page.tsx                 ← Dashboard dark gold
├── runs/
│   └── page.tsx             ← Historique exécutions
├── schedules/
│   └── page.tsx             ← Cron actifs
└── settings/
    └── page.tsx             ← Toggles on/off par automatisation
```

### Cron schedule global

| Cron | Heure | Tâche |
|------|-------|-------|
| `0 3 1 * *` | 03:00 du 1er mois | Factures créateurs |
| `0 4 5 * *` | 04:00 du 5 mois | Versements SEPA |
| `0 2 19 * *` | 02:00 du 19 mois | Calcul TVA marge |
| `0 0 31 12 *` | Minuit 31/12 | Export FEC annuel |
| `0 18 * * *` | 18:00 chaque jour | SMS J-1 voyages |
| `*/15 * * * *` | Toutes les 15min | Notifications J-N |
| `0 9 * * *` | 09:00 chaque jour | Digest créateurs |
| `0 8 * * 1` | Lundi 08:00 | Newsletter clients |

### Tables BDD ajoutées

```sql
automation_runs (
  id, automation_name, status, started_at, ended_at,
  duration_ms, payload, error, retries_count
)

automation_settings (
  id, automation_name, enabled, schedule_cron, last_run_at,
  next_run_at, owner_user_id, updated_at
)

audit_log_automations (
  id, automation_run_id, entity_type, entity_id,
  action, before_state, after_state, created_at
)
```

---

## RÈGLES D'OR

1. **Tout est traçable** : chaque action auto est loguée (`audit_log_automations`).
2. **Tout est désactivable** : toggle global et par automatisation.
3. **Tout est testé en preview** : mode "dry-run" avant prod.
4. **L'humain garde la décision finale** sur ce qui touche au juridique,
   commercial, et à la marque (validation modération, choix devis,
   vérification facture).
5. **Idempotence** : exécuter 2 fois = exécuter 1 fois (clé déduplication).
6. **Pas de données perso dans les logs** : RGPD strict.
7. **Failover** : retry exponentiel 3 tentatives, puis escalade admin.
8. **Backup avant action destructive** : ex. avant export FEC, snapshot.

---

> Document vivant — à mettre à jour à chaque nouvelle automatisation
> implémentée ou désactivée. Cf. [DASHBOARD-PDG.md](pdg-eventy/DASHBOARD-PDG.md).
