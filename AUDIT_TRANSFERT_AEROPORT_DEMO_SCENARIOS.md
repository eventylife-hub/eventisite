# Demo Scenarios — Module Transferts Aéroport

> Document de scénarios de démonstration pour investisseurs, partenaires
> (avocats, comptables, prestataires) et co-fondateurs.
>
> Permet de **raconter le module en 5-15 minutes** selon l'audience.
>
> Créé 2026-05-02. À utiliser avec PowerPoint d'investor pitch ou demo live.

---

## 🎯 Pitch en 60 secondes

> *« Le voyageur Eventy débarque à Marrakech, fatigué après 4h de vol.
> Il sort des bagages — et là, **Karim** l'attend, prénom déjà connu,
> photo reçue la veille, panneau gold "Eventy" bien visible.
> 22 minutes plus tard, il est à l'hôtel. **Aucun stress, aucune surprise**.
>
> Derrière, un module 100% automatisé : RFQ envoyée à 3 prestataires en
> 5 secondes, devis comparés et auto-validés, briefing chauffeur livré J-1
> avec photo, suivi temps réel pour l'équipe Eventy, fallback automatique
> si ça part en vrille.
>
> 47 fonctionnalités cataloguées, 65 tests automatisés, conforme RGPD,
> CGV adossées au Code du Tourisme L211-16. **Cœur du MVP avion.** »*

---

## 🎬 Scénario 1 — Le voyageur "happy path" (5 min)

### Setup
- Voyage : "Marrakech Express — Mai 2026", 38 voyageurs, vol AT 825
- Personas : David PDG montre la démo · Marie voyageuse fictive

### Étapes à montrer

1. **J-21** — Marie réserve son voyage sur le site Eventy (existe déjà,
   pas de nouveauté à montrer ici).

2. **J-21** — Le créateur Pro configure le voyage.
   → Page : `/pro/voyages/[id]/transferts-aeroport`
   → Montrer : 3 devis comparés côte à côte, badges RECOMMENDED / ECONOMIC / PREMIUM,
     audit notes IA, sélection en 1 clic.

3. **J-21** — Eventy reçoit les devis providers en direct.
   → Page : `/equipe/transferts` → onglet "Auto-validés"
   → Le devis Marrakech Airport Transfers passe en AUTO_APPROVED en 5 min :
     prix 421 cts/pax < seuil 450, capacité 72%, délai 14j > 7j requis.

4. **J-1 09:00** — Email automatique envoyé à Marie.
   → Page : `/admin/transferts-aeroport/emails-preview`
   → Montrer le template "Confirmation J-1" avec photo de Karim, panneau gold,
     contact direct, politique retard vol rassurante.

5. **J-1 14:00** — Karim reçoit son dispatch sheet PDF par email.
   → Document : `dispatch-sheet.template.ts` rendu en HTML
   → Montrer la feuille A4 avec timeline, manifeste 38 passagers, point RDV gold.

6. **Jour J 14:30** — Le vol atterrit à RAK.
   → Page : `/equipe/transferts/live`
   → Montrer le tracking temps réel : Karim passe de "En route" à "À l'aéroport"
     puis "Voyageurs à bord" puis "À l'hôtel". Animations live, ETA mise à jour.

7. **Jour J 15:55** — Marie est à l'hôtel.
   → Page : `/client/voyage/[id]/transfert`
   → Montrer la page chaleureuse avec les détails du chauffeur, le panneau gold,
     la rassurance retard vol.

8. **J+2** — Marie reçoit un email feedback.
   → Page : `/client/voyage/[id]/transfert/feedback`
   → 4 critères en stars + recommandation chauffeur.
   → Marie note 5★ → alimente automatiquement le qualityScore de
     Marrakech Airport Transfers.

### Punchline
> *« Toute cette expérience repose sur 22 endpoints REST, 6 templates email,
> 12 pages frontend et 65 tests automatisés. Mais Marie n'a vu qu'une chose :
> Karim, son sourire, et son panneau gold. C'est ça, l'âme Eventy. »*

---

## 🎬 Scénario 2 — Gestion de crise (3 min)

### Setup
- Vol AT 825 retardé de 2h
- Le chauffeur Karim ne se présente pas à l'aéroport

### Étapes à montrer

1. **14:00** — Le système détecte le retard de vol via l'API Flight Status.
   → Backend : `airport-transfer-cron.service.ts` → cron `EVERY_5_MINUTES`
   → Action automatique : email "Retard de vol" envoyé à Marie + à Karim.
   → Push notif Slack équipe : "⏰ Retard vol critique AT 825 : 120min"

2. **15:30** — Karim ne s'est pas présenté à l'heure prévue (sa nouvelle ETA).
   → Backend : `airport-transfer-fallback.service.ts:detectAndResolveNoShows()`
   → Action automatique : `resolveIncident({ type: 'NO_SHOW' })`.

3. **15:31** — Le système identifie le contexte (38 pax, > 30min après vol)
   et déclenche `dispatchEventyTeam()`.
   → Slack équipe : "🚨 No-show Marrakech Airport Transfers — équipe terrain
     dispatchée"
   → Email Marie : "Une équipe Eventy va vous accueillir personnellement, ne
     bougez pas"

4. **15:45** — Sarah de l'équipe Eventy locale arrive au terminal et accueille
   le groupe avec un nouveau panneau Eventy.
   → Page : `/equipe/transferts/live` → statut INCIDENT animé en blink rouge
   → Page : `/equipe/transferts/audit-log` → événement INCIDENT enregistré
     avec sévérité 4

5. **J+1** — Pénalité automatique côté Marrakech Airport Transfers.
   → Backend : `airport-transfer-stripe.service.ts:chargeProviderPenalty()`
   → Backend : `analytics.service.ts:recomputeProviderQualityScores()` →
     score passe de 92 à 82.
   → Email poli au provider expliquant le surcoût.

### Punchline
> *« Marie n'a JAMAIS senti qu'il y avait un problème. C'est ça, "le client
> doit se sentir aimé" — même quand ça part en vrille. »*

---

## 🎬 Scénario 3 — Onboarding nouveau prestataire (2 min)

### Setup
- "Atlas Voyages Marrakech" candidate au réseau

### Étapes à montrer

1. **Jour 1** — Un dirigeant d'Atlas Voyages tombe sur la page recrutement.
   → Page : `/transferts/devenir-partenaire`
   → Montrer le ton chaleureux ("partenaires, pas prestataires"), les 4
     bénéfices, les 5 critères qualité, le formulaire 2 minutes.

2. **Jour 1+5min** — Form soumis.
   → Backend : POST `/api/public/transferts/candidatures`
   → Slack équipe : "🤝 Candidature partenaire : Atlas Voyages (MA)"

3. **Jour 2** — L'équipe Eventy passe les 5 critères qualité (assurance,
   statut légal, langues, ponctualité, accueil).

4. **Jour 3** — Call de 30 min avec Atlas Voyages.

5. **Jour 4** — Création du compte Stripe Connect Express.
   → Backend : `airport-transfer-stripe.service.ts:createProviderAccount()`
   → Atlas reçoit un AccountLink pour fournir ses coordonnées bancaires + KYC.

6. **Jour 5** — Activation dans le catalogue admin.
   → Page : `/admin/transferts-aeroport`
   → Atlas apparaît avec status ACTIVE, secret HMAC généré, prêt à recevoir
     les RFQ.

7. **Jour 6** — Première RFQ test envoyée.

### Punchline
> *« 6 jours pour onboarder un nouveau prestataire international, 100%
> via le module — pas de papier, pas de scotch. »*

---

## 🎬 Scénario 4 — Le chauffeur en mission (3 min)

### Setup
- Karim, chauffeur Marrakech Airport Transfers, première mission Eventy

### Étapes à montrer

1. **J-3** — Karim reçoit un PDF "Handbook Chauffeur" par email
   ([HANDBOOK-CHAUFFEUR.md](backend/src/modules/transport/airport-transfer/HANDBOOK-CHAUFFEUR.md)).
   → Montrer le ton chaleureux : "Vous êtes la première personne qu'il
     rencontre à l'arrivée. Tout commence avec vous."

2. **J-1 14:00** — Karim reçoit son dispatch sheet PDF.
   → Document : feuille A4 imprimable avec timeline, manifeste, point RDV.
   → Montrer le panneau gold à imprimer (lien vers SVG dans le PDF).

3. **Jour J 13:00** — Karim ouvre l'espace chauffeur.
   → Page : `/chauffeur/transferts-aeroport`
   → Workflow 6 étapes : "Je passe à : EN ROUTE" → marqueur GPS push à Eventy.

4. **Jour J 13:45** — Karim arrive à l'aéroport, marque "À l'aéroport".
   → Webhook : POST `/webhooks/airport-transfer/[quoteId]/driver-status`
   → HMAC signature vérifiée
   → L'équipe Eventy voit live le statut qui change.
   → Marie reçoit un push notif : "Votre chauffeur est arrivé !"

5. **Jour J 14:30** — Le vol atterrit. Karim accueille le groupe avec son
   panneau gold. Marque "Voyageurs à bord".

6. **Jour J 15:55** — Karim dépose à l'hôtel. Marque "À l'hôtel".
   → Mission auto-marquée COMPLETED.
   → Émission auto facture (J+1).

7. **J+30 fin de mois** — Paiement automatique via Stripe Connect.
   → Backend : `airport-transfer-stripe.service.ts:transferToProvider()`
   → Karim (via Atlas Voyages) reçoit son virement NET30 fin de mois.

### Punchline
> *« Karim n'a aucun papier à signer, aucun email à scroller. Il pilote sa
> mission depuis son téléphone, fait son métier (conduire), et est payé
> automatiquement. C'est ça, le partenariat juste. »*

---

## 🎬 Scénario 5 — Démo investisseurs / pitch deck (15 min)

### Slides à utiliser

| Slide | Titre | Visuel | Punchline |
|---|---|---|---|
| 1 | Le problème | "Le voyageur fatigué qui ne trouve pas son chauffeur" | Le moment de vérité |
| 2 | Notre solution | Architecture overview du module | 9 personas, 22 endpoints, 65 tests |
| 3 | Live demo voyageur | Scénario 1 | Karim, le panneau gold |
| 4 | Live demo équipe | Scénario 2 (gestion crise) | Fallback invisible |
| 5 | Live demo provider | Scénario 3 (onboarding) | 6 jours pour onboarder |
| 6 | Tech stack | NestJS + Prisma + Next.js + Stripe + Puppeteer | Production-ready |
| 7 | Conformité | RGPD + CGV + Code du Tourisme L211-16 | Ready pour audit légal |
| 8 | Métriques | Lignes, tests, fonctions, pages | ~14 700 LoC, 65 tests, 12 pages |
| 9 | Roadmap | Plan 4 sprints (12 j-h) | Activation MVP imminente |
| 10 | ROI estimé | NPS +5pts, récurrence +12%, incidents -70% | Le client se sent aimé |

### Argumentaire investisseur (en complément)

- **Différentiation** : pas un Uber des bus. Le **prénom du chauffeur**, la
  **photo**, le **panneau gold** — c'est l'âme.
- **Scalabilité** : un voyageur amène 38 pax. Une mission = 38 voyageurs
  contents. Pas de friction marginale.
- **Réseau effet** : plus de providers = meilleure couverture = plus de
  voyages avion = plus de providers attirés.
- **Données** : chaque mission alimente le qualityScore. Sélection
  automatiquement de plus en plus fine.
- **Compliance native** : RGPD + CGV documentés depuis le jour 1, pas un
  ajout après coup.

---

## 📊 Chiffres clés à retenir

| Métrique | Valeur |
|---|---|
| Lignes de code | ~14 700 |
| Tests automatisés | 65 |
| Fonctions implémentées | 6 |
| Pages frontend | 12 |
| Personas couverts | 6 (admin, équipe, pro, client, chauffeur, provider) |
| Endpoints REST | 22 |
| Templates email | 7 |
| Locales i18n | 3 (FR/EN/ES) |
| Crons automatisés | 5 |
| Stratégies fallback | 5 |
| Documents techniques | 11 |
| Vagues d'audit + livraison | 11 |
| Zéro suppression | ✅ |

---

## 🎁 Bonus — Le panneau gold dans la vraie vie

Le composant `PanneauAeroportPreview.tsx` rend visuellement à quoi
ressemble la pancarte que le voyageur cherchera. Variantes :
- Format `panel` : panneau rigide imprimable A4
- Format `sign` : pancarte tenue à la main par le chauffeur
- Tailles `sm` / `md` / `lg` selon contexte
- Avec QR code optionnel pour check-in scan

À imprimer en gold #D4A853 sur fond noir #0a0e14 pour cohérence brand.

---

*Document de scénarios créé 2026-05-02. À mettre à jour avant chaque demo.*
