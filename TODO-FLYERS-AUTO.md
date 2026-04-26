# TODO — Flyers automatisés Eventy (audit complet)

> **Audit réalisé le 2026-04-26**
> Système de génération, impression et distribution de flyers pour TOUS les
> pros qui vendent (créateurs, ambassadeurs, vendeurs, influenceurs, magasins).
>
> Page actuelle : `frontend/app/(pro)/pro/flyers/page.tsx`
> État : v1 fonctionnelle (générateur visuel + maquette commande + bandeaux IA/admin)

---

## VISION

```
Créateur de voyage                   Eventy automatise                  Client
        │                                    │                            │
        │ Termine sa Symphonie               │                            │
        │ → "Créer un flyer pour            │                            │
        │    ce voyage ?"                    │                            │
        │                                    │                            │
        ├────────► Flyer auto-généré ◄──────┤                            │
        │          (titre · dates · prix    │                            │
        │           · QR · logo créateur)   │                            │
        │                                    │                            │
        │ Personnalise (couleur · texte     │                            │
        │  · photo)                          │                            │
        │                                    │                            │
        ├────────► Téléchargement / Print / Partage ◄────────────────────┤
        │          PNG · PDF · SVG          │   Scan QR → page voyage    │
        │          A5 · A4 · Story · Carré  │   → cookie tracking         │
        │          Bannière · Email         │   → réservation             │
        │                                    │   → commission créateur     │
        │                                    │                            │
        └────► Commande imprimés ──► Livraison 5j ──► Distribution ──────┘
```

---

## ÉTAT ACTUEL

| Élément | État | Fichier |
|---------|------|---------|
| Page `/pro/flyers` | ✅ v1 | `app/(pro)/pro/flyers/page.tsx` |
| Sidebar Pro · Marketing · Flyers automatisés | ✅ | `app/(pro)/pro/layout.tsx:174` |
| Quick dock entry | ✅ | `components/pro/pro-quick-dock.tsx:177` |
| Endpoint API `/pro/travels/summary` | ❌ MANQUE | backend `pro/travels/summary` |
| Endpoint API `/pro/flyers` (CRUD) | ❌ MANQUE | backend `pro/flyers` module |
| Génération PNG/PDF côté serveur | ❌ MANQUE | Puppeteer ou Playwright |
| Templates officiels (admin) | ❌ MANQUE | `app/(admin)/admin/flyers/templates/` |
| Modération flyers personnalisés | ❌ MANQUE | `app/(admin)/admin/flyers/moderation/` |
| Suggestion auto fin Symphonie | ❌ MANQUE | `app/(pro)/pro/voyages/nouveau/components/EtapeMarketingVoyage.tsx` |
| Studio IA (génération visuel auto) | ❌ MANQUE | `app/(pro)/pro/marketing/studio-ia/` |
| Stats scans QR par flyer | ❌ MANQUE | `app/(pro)/pro/analytics/` |
| Boutique impression (commande réelle) | ⚠️ Maquette | `app/(pro)/pro/magasin/page.tsx` |
| Code parrainage auto-injecté dans QR | ⚠️ Affichage | manque routing `/r/:code` côté backend |

---

## P0 — Production minimum viable (MVP flyers)

### FLYERS-001 [P0] · Backend : module `pro/flyers`
- [ ] Créer `backend/src/modules/pro/flyers/`
  - `flyers.controller.ts` — endpoints REST
  - `flyers.service.ts` — logique métier
  - `flyers.module.ts`
  - `dto/create-flyer.dto.ts`, `dto/order-print.dto.ts`
- [ ] Endpoints :
  - `GET /pro/flyers` — historique flyers de l'utilisateur
  - `POST /pro/flyers` — sauvegarde un flyer généré
  - `GET /pro/flyers/:id` — détail
  - `DELETE /pro/flyers/:id`
  - `POST /pro/flyers/:id/render` — render PNG/PDF/SVG
  - `POST /pro/flyers/:id/share` — partage Insta/WA/Mail
  - `POST /pro/flyers/:id/order-print` — commande impression
- [ ] Schéma Prisma :
  ```prisma
  model Flyer {
    id           String   @id @default(cuid())
    proId        String
    travelId     String
    format       FlyerFormat
    theme        FlyerTheme
    customColor  String?
    customLogo   String?  // URL S3
    customPhoto  String?  // URL S3
    qrUrl        String   // lien tracké eventy.fr/r/CODE-VOYAGE
    title        String
    snapshotPng  String?  // URL S3 du rendu
    snapshotPdf  String?
    status       FlyerStatus  // DRAFT, PENDING_MOD, APPROVED, REJECTED
    moderatedBy  String?
    moderatedAt  DateTime?
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    pro          Pro      @relation(fields: [proId], references: [id])
    travel       Travel   @relation(fields: [travelId], references: [id])
    printOrders  PrintOrder[]
    @@index([proId])
    @@index([travelId])
  }

  model PrintOrder {
    id          String   @id @default(cuid())
    flyerId     String
    quantity    Int
    format      String   // A5, A4, A3, CARTE_POSTALE
    addressJson Json     // adresse livraison
    priceCents  Int
    status      PrintOrderStatus  // PENDING, PRINTING, SHIPPED, DELIVERED
    trackingUrl String?
    carrier     String?
    createdAt   DateTime @default(now())
    flyer       Flyer    @relation(fields: [flyerId], references: [id])
    @@index([flyerId])
  }
  ```

### FLYERS-002 [P0] · Génération PNG/PDF serveur
- [ ] Service `flyer-render.service.ts` utilisant **Puppeteer headless**
- [ ] Render à partir d'un template HTML server-side, conversion en PNG (1080p) + PDF (300dpi)
- [ ] Upload S3 → `flyers/{proId}/{flyerId}.png` & `.pdf`
- [ ] Fallback SVG inline (le composant `<FlyerPreview/>` peut être réutilisé via `react-dom/server`)
- [ ] Rate limit : 100 renders/jour/pro, 1000/jour pour admin

### FLYERS-003 [P0] · Endpoint voyages summary
- [ ] `GET /pro/travels/summary` — retourne uniquement les champs nécessaires :
  ```ts
  { id, titre, destination, dateDepart, dateRetour, durée, prix,
    capacité, placesRestantes, photo, points, tagline }
  ```
- [ ] Filtre : voyages publiés ou en pré-vente uniquement
- [ ] Cache 5 min côté front (SWR)

### FLYERS-004 [P0] · QR code tracké
- [ ] Backend : route publique `GET /r/:code` → 302 vers la page voyage avec cookie d'attribution (90 jours)
- [ ] Format `:code` = `EVENTY-{PRO_CODE}-{TRAVEL_ID}` (slug court)
- [ ] Cookie : `eventy_ref={proId}.{travelId}.{flyerId}.{ts}`
- [ ] Au moment du checkout : si cookie présent → attribution + commission au pro
- [ ] Service `tracking.service.ts` enregistre chaque scan dans `FlyerScan` :
  ```prisma
  model FlyerScan {
    id        String   @id @default(cuid())
    flyerId   String
    proId     String
    ipHash    String   // hashed pour RGPD
    userAgent String?
    referer   String?
    converted Boolean  @default(false)
    bookingId String?
    createdAt DateTime @default(now())
  }
  ```

---

## P1 — Personnalisation & expérience pro

### FLYERS-010 [P1] · Personnalisation rapide
- [ ] Color picker (champ `customColor`) — déjà maquetté, brancher l'état
- [ ] Upload logo créateur — endpoint `POST /pro/flyers/upload-logo` (S3, max 1 Mo, PNG/SVG)
- [ ] Upload photo destination personnalisée — endpoint `POST /pro/flyers/upload-photo` (S3, max 5 Mo, JPG/PNG)
- [ ] Édition rapide du tagline et des 4 points forts (inputs inline)
- [ ] Mode "preview live" : la modification met à jour le SVG en temps réel

### FLYERS-011 [P1] · Templates supplémentaires
- [ ] Format **A6** (mini-flyer 105×148 mm) pour distribution main à main
- [ ] Format **Carte de visite** 85×55 mm avec QR
- [ ] Format **Tract format US Letter** pour pros à l'étranger
- [ ] Format **Roll-up bannière** 80×200 cm pour salons
- [ ] Format **TikTok 9:16** distinct du Story Insta (durée vidéo + waveform overlay)

### FLYERS-012 [P1] · Thèmes additionnels
- [ ] Thème **MARIAGE** (rose poudré + or)
- [ ] Thème **AVENTURE** (terracotta + camel)
- [ ] Thème **LUXE** (noir mat + or sombre)
- [ ] Thème **FAMILLE** (jaune solaire + bleu doux)
- [ ] Thème **SENIOR** (lisibilité grande taille, contrastes renforcés)

### FLYERS-013 [P1] · Partage direct
- [ ] **Instagram Story** : Web Share API + génération format 1080×1920
- [ ] **Instagram Post** : 1080×1080 + caption pré-rédigée
- [ ] **Facebook** : 1200×630 + texte pré-rédigé
- [ ] **WhatsApp Business** : envoi direct via `wa.me/?text=...&url=...`
- [ ] **Email** : ouverture client mail avec attachement PDF
- [ ] **Copier le lien** : raccourci `eventy.fr/r/CODE`
- [ ] Tracking UTM auto sur tous les liens partagés

---

## P1 — Commande de flyers imprimés

### FLYERS-020 [P1] · Commande impression réelle
- [ ] Sélectionner un partenaire imprimeur (Vistaprint API, Pixartprinting, Helloprint, ou imprimeur local)
- [ ] Service `print-order.service.ts` :
  - Validation adresse (Google Address Validation API)
  - Calcul prix selon format × quantité
  - Création commande chez l'imprimeur
  - Sauvegarde `PrintOrder` + paiement Stripe
- [ ] Tarifs MVP (à valider PDG) :
  | Format | 50 ex | 100 ex | 250 ex | 500 ex | 1000 ex |
  |--------|-------|--------|--------|--------|---------|
  | A5 R/V | 19 €  | 29 €   | 49 €   | 79 €   | 119 €   |
  | A4     | 29 €  | 49 €   | 79 €   | 119 €  | 179 €   |
  | A3     | 49 €  | 79 €   | 119 €  | 179 €  | 249 €   |
  | Carte postale | 15 € | 25 € | 39 € | 65 € | 99 € |
- [ ] Marge Eventy : modèle 82/18 (82 % marge Eventy / 18 % brut imprimeur sur la marge)
- [ ] Webhook imprimeur → mise à jour statut + email tracking au pro
- [ ] Page suivi commande dans `/pro/magasin` avec barre de progression

### FLYERS-021 [P1] · Bon à tirer (BAT) avant impression
- [ ] Avant validation impression : afficher prévisualisation HD (PDF 300dpi)
- [ ] Checkbox "J'ai relu, le BAT est conforme"
- [ ] Conservation BAT signé (RGPD : 5 ans)
- [ ] Si erreur après impression : pas de remboursement

### FLYERS-022 [P1] · Livraison & retours
- [ ] Choix transporteur (Colissimo, Mondial Relay, Chronopost)
- [ ] Suivi colis intégré (API tracking)
- [ ] Notification email J-1 livraison
- [ ] SAV : si flyers défectueux à réception → photo + remplacement gratuit
- [ ] Eco-friendly : papier FSC recyclé 250 g par défaut

---

## P1 — Force commerciale & affiliation

### FLYERS-030 [P1] · Code et lien tracké pour TOUS
- [ ] Chaque pro (créateur, vendeur, ambassadeur, influenceur, magasin) a son code unique
  - Format : `EVENTY-{PSEUDO}-{ANNEE}`
  - Stocké dans `Pro.referralCode`
- [ ] Auto-injecté dans tous les flyers que le pro génère
- [ ] Le QR code redirige vers `eventy.fr/r/{code}`
- [ ] Cookie d'attribution 90 jours côté client

### FLYERS-031 [P1] · Commissions trackées
- [ ] Modèle commissionnement (à valider PDG, voir 5 % force commerciale) :
  - **Vendeur classique** : 5 % HT du voyage vendu via son flyer
  - **Ambassadeur** : 7 % HT (volume engagement)
  - **Influenceur** : 10 % HT (audience engagement)
  - **Magasin partenaire** : 3 % HT + crédits magasin
- [ ] Versement mensuel automatique via Wallet Eventy
- [ ] Ligne dédiée dans `/pro/revenus` : "Commissions flyers"
- [ ] Conformité fiscale : facture auto-générée pour chaque commission

### FLYERS-032 [P1] · Stats par flyer
- [ ] Page `/pro/flyers/:id/stats` :
  - Scans QR (par jour, par heure, par device)
  - Conversions (scan → réservation)
  - CA généré
  - Carte chaleur des scans (géolocalisation IP, opt-in RGPD)
- [ ] Comparatif : flyer A vs flyer B (A/B testing manuel)
- [ ] Export CSV des scans

---

## P2 — Côté équipe / admin

### FLYERS-040 [P2] · Templates officiels (admin)
- [ ] Page `app/(admin)/admin/flyers/templates/page.tsx`
  - CRUD templates par l'équipe Marketing
  - Champs : nom, format, thème, JSON layout, statut (publié/brouillon)
  - Preview live
- [ ] Templates marqués "officiels" → diffusion auto-validée (pas de modération)
- [ ] Templates user-generated → modération obligatoire

### FLYERS-041 [P2] · Modération flyers (admin)
- [ ] Page `app/(admin)/admin/flyers/moderation/page.tsx`
  - Liste flyers en attente (`status = PENDING_MOD`)
  - Aperçu HD + métadonnées (pro, voyage, date)
  - Boutons Approuver / Rejeter + commentaire
  - SLA : 24h max (notif Slack équipe au-delà)
- [ ] Critères de modération :
  - Mention APST visible (obligatoire APST/Atout France)
  - Mention "voyage à forfait selon Code du tourisme"
  - Aucune image protégée par droit d'auteur
  - Aucune promesse marketing trompeuse (prix barré faux, "garanti", etc.)
  - RGPD : aucune photo de personne sans consentement
- [ ] Logs modération conservés 5 ans (conformité)

### FLYERS-042 [P2] · Dashboard équipe — stats globales
- [ ] Page `app/(equipe)/equipe/marketing/flyers/page.tsx`
  - Total flyers générés (semaine / mois / total)
  - Total scans QR
  - Total conversions
  - Top 10 pros qui génèrent le plus
  - Top 10 voyages les plus "flyerés"
  - Coût impression total (commandes payées)
  - CA généré attribuable aux flyers

### FLYERS-043 [P2] · Suggestion en fin de Symphonie
- [ ] Dans `app/(pro)/pro/voyages/nouveau/components/EtapeMarketingVoyage.tsx`
  - Étape finale : bandeau "Votre voyage est prêt — créer un flyer maintenant ?"
  - 2 boutons : "Générer flyer A5" (+ thème dark gold par défaut) / "Plus tard"
  - Si oui → `/pro/flyers?travelId={id}&autoGenerate=true`
- [ ] Page flyers détecte `autoGenerate=true` et lance la génération immédiatement

---

## P3 — Studio IA (futur)

### FLYERS-050 [P3] · Génération visuel IA
- [ ] Intégration **DALL-E 3 / Midjourney API / SDXL local**
- [ ] À partir du titre + destination → génère 4 variantes d'image hero
- [ ] Pro choisit sa préférée
- [ ] Image cachée 30 jours puis purgée
- [ ] Coût IA : 0,04 €/image → facturé en "crédits Studio IA" (pack à acheter)

### FLYERS-051 [P3] · Adaptation texte selon cible
- [ ] Sélecteur de cible : Familles · Seniors · Jeunes actifs · Couples · Solo
- [ ] LLM (Claude Opus) reformule le tagline et les 4 points forts selon la cible
- [ ] Exemple : "Bus porte-à-porte" devient "Pas de stress aéroport" pour seniors,
  "On t'embarque chez toi" pour jeunes actifs
- [ ] Conservation des prompts pour amélioration continue

### FLYERS-052 [P3] · Distribution automatique
- [ ] **Auto-publication réseaux sociaux** (avec OAuth pro) :
  - Instagram Business API (Story + Post)
  - Facebook Pages API
  - LinkedIn (pour B2B, voyages CSE)
  - TikTok for Business API
- [ ] Planification (date + heure) via cron NestJS
- [ ] Logs : succès/échec par réseau

### FLYERS-053 [P3] · A/B testing IA
- [ ] L'IA génère 2 versions du même flyer (variations subtiles)
- [ ] 50 % des scans envoyés sur version A, 50 % sur B
- [ ] Après 100 scans → l'IA conclut le vainqueur et bascule 100 % du trafic
- [ ] Recommandations futures basées sur les vainqueurs (style, couleur, accroche)

### FLYERS-054 [P3] · Génération vidéo (Reels/TikTok)
- [ ] À partir d'un flyer → animation auto (Lottie / Remotion)
- [ ] Format MP4 9:16, 15 sec, musique libre de droits
- [ ] Sous-titres auto
- [ ] CTA final avec QR code

---

## P3 — Intégrations futures

- [ ] **Canva Connect API** : édition avancée dans Canva si besoin
- [ ] **WhatsApp Business API officielle** : envoi push aux contacts pro
- [ ] **Google Business Profile** : publication auto sur fiche Google
- [ ] **Mailchimp / Brevo** : intégration newsletter avec flyer en hero
- [ ] **POS imprimante directe** : magasins partenaires impriment à la demande au comptoir
- [ ] **NFC tags** : alternative au QR pour distribution physique haut de gamme

---

## Conformité légale (à valider avocat tourisme)

- [ ] Mentions obligatoires sur tout flyer voyage (Code tourisme L211-9) :
  - Nom et SIRET d'Eventy
  - Numéro d'immatriculation Atout France (IM XXX XXX XXX)
  - Garant financier (APST + n° dossier)
  - Assureur RC Pro (nom + n° police)
  - Mention "voyage à forfait selon les articles L211-1 et suivants du Code du tourisme"
- [ ] Mention RGPD si scan QR collecte données : "En scannant, vous acceptez nos CGV/RGPD"
- [ ] Templates officiels Eventy intègrent ces mentions automatiquement (pied de page)
- [ ] Si pro modifie un template au point de retirer ces mentions → modération bloque

---

## KPIs à suivre

| KPI | Cible M+1 | Cible M+3 | Cible M+6 |
|-----|-----------|-----------|-----------|
| Flyers générés / semaine | 50 | 250 | 1 000 |
| Scans QR / semaine | 100 | 1 000 | 5 000 |
| Taux conversion scan → résa | 3 % | 5 % | 7 % |
| Commandes impression / mois | 5 | 30 | 100 |
| CA attribuable aux flyers | 5 000 € | 25 000 € | 80 000 € |
| Pros utilisant le générateur | 20 % | 50 % | 80 % |

---

## Prochaines actions PDG

1. **Valider la grille tarifaire impression** — voir tableau FLYERS-020
2. **Choisir le partenaire imprimeur** — RDV à prendre (Pixartprinting · Helloprint · imprimeur local Île-de-France)
3. **Valider le modèle commissions force commerciale** — 5 % vendeur / 7 % ambassadeur / 10 % influenceur ?
4. **Brief équipe Marketing** — créer 5 templates officiels avant lancement (1 par thème : DARK_GOLD · BLANC · OCEAN · NATURE · FESTIF)
5. **Brief avocat tourisme** — validation mentions légales obligatoires sur flyers
6. **Backend** — prioriser FLYERS-001 à FLYERS-004 (P0) pour MVP fonctionnel

---

*Audit produit par le bras droit IA du PDG — 2026-04-26*
