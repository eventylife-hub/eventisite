# Procédure Support — Gestion d'un changement de pension après réservation

> **Audience** : Équipe Support Client + Ops Eventy
> **Statut** : Procédure officielle v1
> **Dernière mise à jour** : 2026-04-30
> **Conformité** : Directive EU 2015/2302 art. 11 + Article 297-A CGI

---

## Table des matières

1. [Quand cette procédure s'applique](#1-quand-cette-procédure-sapplique)
2. [Délais légaux](#2-délais-légaux)
3. [Procédure étape par étape](#3-procédure-étape-par-étape)
4. [Outils internes](#4-outils-internes)
5. [Cas particuliers](#5-cas-particuliers)
6. [Scripts de communication client](#6-scripts-de-communication-client)
7. [Escalade et récupération](#7-escalade-et-récupération)
8. [Indicateurs de performance](#8-indicateurs-de-performance)

---

## 1. Quand cette procédure s'applique

Cette procédure couvre **tout changement de type de pension** survenu **après confirmation de la réservation client** :

- L'hôtel HRA ne peut plus assurer la pension promise (cuisine HS, manque de personnel…)
- Le restaurant partenaire ferme (saisonnier, administratif, faillite)
- Eventy décide un changement opérationnel (renégociation contrat, surclassement)
- Le partenaire HRA conteste l'assignation (voir `/maisons/voyages-pension`)

**N'utilisez PAS cette procédure pour** :
- Un changement de pension AVANT confirmation client → c'est juste une mise à jour du voyage
- Une annulation totale du voyage → procédure dédiée `PROCESS-QUOTIDIEN.md` § Annulations
- Un voyageur qui demande lui-même à changer → c'est une demande client, pas un downgrade

---

## 2. Délais légaux

| Délai | Action | Fondement |
|---|---|---|
| **Immédiat** | Notifier le client par email + SMS | Directive EU 2015/2302 art. 11.1 |
| **14 jours** | Le client doit avoir choisi son option | Pratique Eventy + Code conso art. L211-13 |
| **14 jours après choix** | Refund cash crédité sur moyen paiement initial | Code conso art. L211-14 |
| **48h** | Réponse à toute contestation HRA | Engagement Eventy partenaires |

> ⚠️ Si **plus de 7 jours** se sont écoulés sans réaction du client après la 1ère notification → **2e relance obligatoire** par email + appel téléphonique.

---

## 3. Procédure étape par étape

### Étape 1 — Détection du changement

Le changement peut être déclaré par **3 sources** :

1. **Partenaire HRA Maison** via `/maisons/voyages-pension` → bouton "Contester"
2. **Admin Eventy** via `/admin/pension` → bouton "Override"
3. **Créateur Pro** via `/pro/voyages/[id]/edit` → modification post-publication

Dans tous les cas, un événement `DowngradeEvent` est créé et apparaît dans `/admin/pension/downgrades`.

### Étape 2 — Vérification de l'événement

Ouvre `/admin/pension/downgrades` et identifie la ligne concernée.

**Vérifie systématiquement** :
- [ ] Le type de pension promise est bien différent du nouveau type
- [ ] La raison est documentée (champ `reasonDetail` non vide)
- [ ] La liste des `impactedBookings` est complète (cross-check avec `/admin/voyages/[id]/reservations`)
- [ ] Le calcul du refund est cohérent (formule = (val_originale - val_nouvelle) × durée × pers)
- [ ] Si upgrade : aucun refund attendu (Eventy offre)

### Étape 3 — Notification client

L'email automatique `sendPensionDowngradeNotification` est envoyé en parallèle de la création de l'événement.

**Contenu** : 3 options proposées au client (downgrade) ou message gratulations (upgrade).

**Vérifie** :
- [ ] Email parti (status livraison dans `/admin/comms`)
- [ ] Lien `resolutionUrl` actif (le client peut choisir)
- [ ] Subject contient le titre du voyage + référence

### Étape 4 — Suivi de la réponse client

Le client a **14 jours** pour choisir. La page `/admin/pension/downgrades` affiche l'état :
- 🟡 `PENDING_CLIENT_RESPONSE` — pas encore répondu
- 🟢 `RESOLVED_REFUND` — choix remboursement cash
- 🟡 `RESOLVED_ENERGY_CREDIT` — choix crédit énergie (+50% fidélité)
- 🔵 `RESOLVED_ALTERNATIVE` — choix alternative (chambre / voyage)
- 🔴 `CANCELLED` — réservation entièrement annulée

**Si le client ne répond pas après 7 jours** → **relance** avec `Renvoyer notification client` + appel téléphonique.

**Si toujours pas de réponse à J+14** → application automatique du **refund cash** (option par défaut, la plus protectrice pour le client).

### Étape 5 — Application de la résolution

| Choix client | Action backend | Délai |
|---|---|---|
| **Refund cash** | Crédit Stripe sur moyen paiement initial | 14 jours |
| **Crédit énergie** | Augmente `energyBalance.soldeDepensable` du compte client | Immédiat |
| **Alternative** | Création nouveau booking + cancel ancien | 24-48h |
| **Annulation** | Refund 100% du voyage (pas seulement la diff) | 14 jours |

Mettre à jour le statut dans `/admin/pension/downgrades` une fois la résolution appliquée.

### Étape 6 — Communication finale au client

Email de confirmation post-résolution :
- Refund cash → "Le remboursement de XX € sera crédité sous 14 jours"
- Crédit énergie → "XX points ajoutés à votre cagnotte, dispo immédiatement"
- Alternative → "Votre nouvelle réservation est confirmée, vous recevez un nouveau manifeste"
- Annulation → "Annulation confirmée, refund total sous 14 jours"

### Étape 7 — Archivage et audit

L'événement reste visible dans `/admin/pension/downgrades` indéfiniment pour audit comptable. Pas de suppression.

---

## 4. Outils internes

| Outil | URL | Usage |
|---|---|---|
| **Dashboard downgrades** | `/admin/pension/downgrades` | Vue centralisée + KPIs |
| **Configuration pension** | `/admin/pension` | Override admin sur voyage spécifique |
| **Page HRA contestation** | `/maisons/voyages-pension` | Vue côté partenaire (read pour support) |
| **Communications** | `/admin/comms` | Statut livraison emails + SMS |
| **Réservations** | `/admin/voyages/[id]/reservations` | Liste des bookings impactés |
| **Comptabilité** | `/admin/finance/comptable` | Suivi refunds + journal |
| **Doc PDG pension** | `pdg-eventy/10-operations/GUIDE-PENSION.md` | Référence interne complète |

---

## 5. Cas particuliers

### 5.1 — Réservation groupe (CE / Asso > 10 pax)

Le délégué groupe répond **pour tous les voyageurs**. Une seule décision pour tout le groupe.

**Procédure** :
1. Notification email envoyée uniquement au délégué (champ `groupLeaderEmail`)
2. Le délégué a 14 jours pour décider
3. Si refund cash → crédité sur le compte du groupe (pas split par voyageur)
4. Si crédit énergie → multiplié par le nombre de voyageurs

### 5.2 — Booking multi-voyages (séries / abonnements)

Le client a réservé **plusieurs voyages** sur la même réservation.

**Procédure** :
1. Le downgrade impacte UN seul voyage de la série
2. Compensation calculée uniquement pour ce voyage spécifique
3. Les autres voyages de la série restent inchangés
4. Si le client annule, refund partiel UNIQUEMENT sur ce voyage

### 5.3 — Voyageur déjà parti

Le voyageur est **déjà sur place** quand le changement est déclaré (rare, mais possible si HRA déclare en cours de séjour).

**Procédure spéciale** :
1. Notification immédiate **par SMS** + appel téléphonique du créateur sur place
2. Compensation = solution **immédiate** (repas alternatif, indemnité jour, etc.)
3. Refund post-séjour calculé après retour
4. Escalade systématique au créateur Pro pour gestion terrain

### 5.4 — Voyageur dans l'avion / pas joignable

Si SLA notification > 12h sans réponse du client :
1. Appel à l'urgence Eventy 24/7 (`+33 1 80 88 90 00`)
2. SMS de courtoisie pré-arrivée
3. Solution refund auto à J+14

### 5.5 — Réservation avec assurance Eventy Premium

L'assurance Pack Sérénité Premium (souscrite à +55€/voyageur) couvre **les changements de pension** comme inconvénient indemnisable.

**Procédure** :
- Indemnité automatique de 30€/voyageur en plus du refund cash
- Pas de choix entre refund/énergie/alternative — les 3 sont cumulatifs avec l'assurance
- Le ticket assurance est ouvert auto par le webhook downgrade

### 5.6 — Voyage offert / cadeau / parrainage

Si le voyage a été offert (paiement par un tiers / code parrainage / cadeau Eventy) :
- Refund cash → vers le **payeur original** (pas le voyageur bénéficiaire)
- Crédit énergie → sur le compte du **voyageur bénéficiaire** (préférable)
- Recommander le crédit énergie en priorité

### 5.7 — Conflit HRA / créateur sur la pension réelle

Si l'HRA conteste mais le créateur affirme avoir reçu confirmation écrite :
1. **Ne pas downgrader le voyage immédiatement**
2. Ouvrir un ticket Ops "Conflit pension" (priorité haute)
3. Récupérer les 2 versions des emails / contrats
4. Décision Eventy sous 48h
5. Pendant ce temps : voyage maintenu avec pension originale

### 5.8 — Changement multiple sur même voyage

Si la pension change **2 fois** dans une fenêtre courte (ex: HRA promet → ne peut plus → peut à nouveau) :
- Garder UN seul `DowngradeEvent` ouvert
- Le 2e changement annule le premier (`status: CANCELLED`)
- Notifier le client uniquement de la résolution finale
- Pas de refund si retour à l'identique

---

## 6. Scripts de communication client

### 6.1 — Email automatique (déjà envoyé par `sendPensionDowngradeNotification`)

C'est l'email transactionnel automatique. **Ne pas le renvoyer manuellement** — utiliser "Renvoyer notification" dans `/admin/pension/downgrades`.

### 6.2 — Script appel téléphonique (relance J+7)

> "Bonjour [Prénom], c'est [Nom] de l'équipe Eventy Life. Je vous appelle au sujet de votre voyage **[titre]** prévu le **[date]**.
>
> Nous vous avons envoyé un email il y a une semaine concernant un changement de pension sur votre voyage : la **[pension originale]** initialement prévue n'est plus disponible, et votre voyage sera désormais en **[pension nouvelle]**.
>
> Nous voulons nous assurer que vous avez bien reçu cette information et vous rappeler les 3 options qui s'offrent à vous :
>
> 1. **Remboursement cash** de **[X €]**, crédité sous 14 jours
> 2. **Crédit énergie de [N points]** (+50% bonus fidélité) — utilisable immédiatement
> 3. **Annulation sans frais** si vous préférez ne plus partir
>
> Avez-vous une préférence ? On peut tout enregistrer ensemble maintenant, ça vous prend 30 secondes."

**Si refund cash** : "Parfait, on enregistre l'option remboursement cash. Vous recevrez un email de confirmation dans les 5 minutes et le crédit arrivera sur votre carte sous 14 jours."

**Si crédit énergie** : "Excellent choix ! Vos [N points] sont déjà disponibles dans votre compte Eventy. Vous pouvez les utiliser sur n'importe quel prochain voyage, sans limite de durée."

**Si annulation** : "Pas de souci, on comprend. Le refund total de [Y €] sera crédité sous 14 jours. On garde votre profil pour vos prochains projets si l'envie revient."

**Si hésitation** : "Prenez le temps de réfléchir. Vous avez jusqu'au [J+14 date]. Sans réponse de votre part, on appliquera automatiquement le remboursement cash, c'est l'option par défaut."

### 6.3 — Email manuel (si situation particulière)

```
Objet : Votre voyage [titre] — précisions sur le changement de pension

Bonjour [Prénom],

Suite à notre échange téléphonique d'aujourd'hui, je voulais vous remercier pour votre compréhension concernant le changement de pension sur votre voyage [titre].

Pour récapituler :
- Pension initialement prévue : [pension originale]
- Pension désormais : [pension nouvelle]
- Raison : [raison localisée]

Comme convenu, [option choisie] sera appliquée. [Détail action et délai].

Si vous avez la moindre question d'ici votre départ, je reste votre interlocutrice/-eur direct(e) sur cette réservation. N'hésitez pas à me joindre directement à [email perso] ou au [téléphone].

Bon voyage,
[Prénom Nom]
Équipe Support Eventy Life
```

### 6.4 — Cas conflictuel (client mécontent)

Si le client est mécontent, **ne pas justifier**, **valider** :

> "Je comprends totalement votre frustration. Vous aviez payé pour la **[pension originale]** et c'est ce que vous attendiez. C'est une situation que personne ne souhaite, et je suis désolé(e) qu'elle vous arrive sur ce voyage.
>
> Voilà ce qu'on peut faire pour vous, au-delà des options standards :
> - Le crédit énergie peut être augmenté jusqu'à **+100% fidélité** au lieu de 50% (escalade Ops, je m'en charge)
> - Si vous préférez un autre voyage à la place, je peux vous proposer 3 alternatives compatibles
> - Si vous voulez réserver le même voyage en **[pension originale]** sur une autre date, on annule et reréserve sans frais"

**Limite** : escalader systématiquement à un Lead Ops si le client demande une indemnité au-delà de +100% fidélité.

---

## 7. Escalade et récupération

### Escalade vers Lead Ops

**Quand escalader** :
- Conflit HRA/créateur non résolu sous 48h
- Client demande compensation > +100% fidélité
- Voyageur déjà sur place + situation critique
- Plus de 5 voyageurs impactés sur même downgrade
- Référence presse / réseau social vu par l'équipe

**Comment escalader** :
1. Ouvrir un ticket dans Linear (projet OPS) avec tag `pension-downgrade`
2. Mentionner le `DowngradeEvent.id` + `bookingRef`
3. Joindre les emails / scripts d'appel
4. Set priorité `P1` si voyageur sur place, `P2` sinon

### Récupération (escalade inverse — Ops vers Support)

Si Ops résout un cas, mettre à jour `/admin/pension/downgrades` avec :
- Nouveau statut
- Note dans le commentaire interne
- Notif au support pour clôture

---

## 8. Indicateurs de performance

Métriques suivies hebdomadairement par l'équipe Support :

| Métrique | Cible | Calcul |
|---|---|---|
| **Taux de réponse client < 7j** | > 80% | `bookings_repondus_avant_J7 / total_pending` |
| **Taux refund cash** | < 50% | `RESOLVED_REFUND / total_resolved` |
| **Taux crédit énergie** | > 30% | `RESOLVED_ENERGY_CREDIT / total_resolved` |
| **Taux annulation** | < 5% | `CANCELLED / total_resolved` |
| **NPS post-résolution** | > 7/10 | Email NPS J+30 après résolution |
| **Coût refund moyen** | < 80 € / cas | `Σ refundTotal / N events` |

> 💡 **Astuce** : un fort taux de crédit énergie indique une équipe Support efficace dans la conversion refund → fidélité.

---

## Annexes

### Annexe A — Cycle de vie d'un événement

```
[Source: HRA / Admin / Créateur]
        ↓
DowngradeEvent.created
        ↓
sendPensionDowngradeNotification (email auto)
        ↓
status = PENDING_CLIENT_RESPONSE
        ↓
[14 jours d'attente]
        ↓
┌───────────────┬──────────────┬────────────────┐
↓               ↓              ↓                ↓
RESOLVED_       RESOLVED_      RESOLVED_        CANCELLED
REFUND          ENERGY_CREDIT  ALTERNATIVE
↓               ↓              ↓                ↓
Stripe refund   Energy credit  New booking      Full refund
(14j)           (immediate)    (24-48h)         (14j)
        ↓
Email confirmation post-résolution
        ↓
Archivage permanent (audit)
```

### Annexe B — Liens fichiers source

- Helper : `lib/voyage/pension-downgrade.ts`
- Email template : `lib/emails/templates.ts` § Template 5
- Page admin : `app/(admin)/admin/pension/downgrades/page.tsx`
- Tests : `lib/voyage/__tests__/pension-downgrade.test.ts` (21 tests)
- Référence pension globale : `pdg-eventy/10-operations/GUIDE-PENSION.md`

### Annexe C — Mention légale

Tous les emails et factures liés à un downgrade portent automatiquement la mention :

> « Conformément à la Directive EU 2015/2302 article 11, vous avez droit à
> une réduction de prix appropriée ou à la résolution sans frais du contrat
> en cas de modification importante d'un élément essentiel du forfait. »

---

## Changelog

- **2026-04-30** : Procédure initiale v1. Couverture complète : 8 cas particuliers,
  4 scripts communication, escalade Ops, KPIs Support.
