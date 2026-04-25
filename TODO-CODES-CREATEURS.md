# TODO — Codes QR Créateurs Eventy

> **Audit réalisé le 2026-04-25**
> Système de codes QR pour les indépendants Eventy, permettant à leurs
> communautés de gagner de l'énergie et de déclencher des voyages.

---

## VISION

```
Créateur indépendant                 Client / Voyageur
        │                                    │
        │ Génère son QR code                 │
        │ sur son panel                      │
        │                                    │
        └──────────────[QR CODE]─────────────┘
                              │
                    Scan → +500 pts énergie
                              │
                    Énergie utilisable :
                    - Réduction sur voyage
                    - Entry championnat
                    - Activité HRA
                              │
                    Si voyage déclenché → créateur touche
                    une commission (paramétrable)
```

---

## ÉTAT ACTUEL

| Page | État |
|------|------|
| `pro/marque/codes` | ✅ Existe — MAIS pour les MARQUES SPONSORS (Nike, etc.), pas pour les créateurs indépendants |
| `independant/energie` | ❌ **N'EXISTE PAS** |
| `independant/energie/codes` | ❌ **N'EXISTE PAS** |
| `admin/createurs/energie` | ❌ **N'EXISTE PAS** |
| `client/energie` | ⚠️ Existe mais pas de scanner de code créateur |

---

## COMMENT ÇA MARCHE — FLOW COMPLET

### 1. Le créateur génère son code

```
Créateur → /independant/energie/codes
         → Choisit : montant fixe (ex: 500 pts) ou % voyage (ex: 2%)
         → Configure : max scans, date expiration, visuel QR
         → Télécharge le QR code (PNG + PDF print-ready)
         → Partage via WhatsApp, Instagram, e-mail, sticker physique
```

### 2. Le client scanne

```
Client → /client/energie  (section "Scanner un code créateur")
       → Entre le code manuellement OU scanne la caméra
       → Voit "Jean Dupont vous offre 500 pts ⚡"
       → Confirme → pts crédités instantanément
       → Notification "Vous avez reçu 500 pts de Jean Dupont !"
```

### 3. L'admin pilote tout

```
Admin → /admin/createurs/energie
      → Voit les quotas par créateur
      → Modifie les limites
      → Désactive un code en cas d'abus
      → Voit les tendances de redistribution
```

---

## PAGE-07 · `independant/energie/codes` — Gestion codes QR

**Priorité : P1**
**Route** : `/independant/energie/codes`

### Maquette textuelle complète

```
┌─────────────────────────────────────────────────────────┐
│ ← Mon Énergie     MES CODES QR — Redistribution         │
├─────────────────────────────────────────────────────────┤
│ Quota disponible : 16 000 pts / 50 000 pts ce mois      │
├─────────────────────────────────────────────────────────┤
│ MES CODES ACTIFS                                        │
│                                                         │
│ ┌─── EVT-JEAN12 ──────────────────────────────── ACTIF ─┐│
│ │ "Mon code communauté"                                 ││
│ │ Valeur : 500 pts / scan                               ││
│ │ Scans : 68 / 200 max    Expire : 01/06/2026           ││
│ │ Distribué : 34 000 pts                                ││
│ │                                                       ││
│ │ [📱 QR Code]  [📋 Copier lien]  [📲 Partager]        ││
│ │ [✏️ Modifier] [⏸ Suspendre]    [🗑 Supprimer]        ││
│ └───────────────────────────────────────────────────────┘│
│                                                          │
│ ┌─── EVT-MAROC-PROMO ──────────────────────── ACTIF ──-─┐│
│ │ "Promo voyage Maroc"                                  ││
│ │ Valeur : 200 pts / scan                               ││
│ │ Scans : 12 / 50 max     Expire : 15/05/2026           ││
│ │ Distribué : 2 400 pts                                 ││
│ │                                                       ││
│ │ [📱 QR Code]  [📋 Copier lien]  [📲 Partager]        ││
│ │ [✏️ Modifier] [⏸ Suspendre]    [🗑 Supprimer]        ││
│ └───────────────────────────────────────────────────────┘│
│                                                          │
│ CODES EXPIRÉS / ÉPUISÉS                                  │
│ EVT-NOEL2025 · Épuisé · 500 scans / 500 · 25/12/2025   │
│                                                          │
│ [+ Créer un nouveau code]                               │
└─────────────────────────────────────────────────────────┘
```

---

### Wizard création de code (3 étapes)

#### Étape 1 — Configuration

```
┌─────────────────────────────────────────────────────────┐
│ CRÉER UN CODE — Étape 1/3 : Configuration               │
├─────────────────────────────────────────────────────────┤
│ Nom du code (usage interne) :                           │
│ [________________________________]                      │
│ ex : "Mon code Instagram", "Sticker Paris"              │
│                                                         │
│ Valeur énergie par scan :                               │
│ ○ Fixe : [100] [200] [500] [1 000] pts  ○ Personnalisé │
│                                                         │
│ Limite de scans :                                       │
│ ○ Illimité  ○ Max [_____] scans                         │
│                                                         │
│ Date d'expiration :                                     │
│ ○ Sans limite  ○ Le [____/____/____]                    │
│                                                         │
│ Restriction géographique (optionnel) :                  │
│ ○ Aucune  ○ Ville [______________]  ○ Voyage [▼]       │
│                                                         │
│ Coût sur mon quota : ~[_____] pts (si X scans prévus)  │
│                                        [Suivant →]      │
└─────────────────────────────────────────────────────────┘
```

#### Étape 2 — Personnalisation visuelle

```
┌─────────────────────────────────────────────────────────┐
│ CRÉER UN CODE — Étape 2/3 : Visuel                      │
├─────────────────────────────────────────────────────────┤
│ Message affiché au client lors du scan :                │
│ [Jean Dupont vous offre 500 pts ⚡ Merci !]             │
│ (max 80 caractères)                                     │
│                                                         │
│ Format QR :                                             │
│ ○ Standard (fond blanc)                                 │
│ ○ Eventy Gold (fond sombre, or)                         │
│ ○ Personnalisé (upload logo) [Choisir fichier]          │
│                                                         │
│ Aperçu :                                                │
│ ┌──────────────────────┐                               │
│ │  [QR CODE PREVIEW]   │                               │
│ │  ⚡ 500 pts énergie  │                               │
│ │  Jean Dupont         │                               │
│ │  eventy.fr/scan      │                               │
│ └──────────────────────┘                               │
│                                                         │
│ [← Retour]                             [Suivant →]      │
└─────────────────────────────────────────────────────────┘
```

#### Étape 3 — Confirmation et téléchargement

```
┌─────────────────────────────────────────────────────────┐
│ CRÉER UN CODE — Étape 3/3 : Confirmation                │
├─────────────────────────────────────────────────────────┤
│ ✅ Code créé : EVT-JEAN14                               │
│                                                         │
│ ┌──────────────────────────────────────┐               │
│ │            [QR CODE FINAL]           │               │
│ │         500 pts ⚡ / scan            │               │
│ │   Limite : 200 scans | Exp. 01/06   │               │
│ └──────────────────────────────────────┘               │
│                                                         │
│ Lien direct : eventy.fr/e/EVT-JEAN14                   │
│ [📋 Copier le lien]                                    │
│                                                         │
│ Télécharger :                                           │
│ [📥 QR Code PNG HD]                                    │
│ [📥 PDF Print (A4 + A6 + sticker 5cm)]                 │
│                                                         │
│ Partager :                                              │
│ [📲 WhatsApp]  [📸 Instagram]  [📧 Email]  [💬 SMS]  │
│                                                         │
│ [Retour à mes codes]                                    │
└─────────────────────────────────────────────────────────┘
```

---

## PAGE ADMIN — `admin/createurs/energie`

**Priorité : P1**
**Route** : `/admin/createurs/energie`

### Maquette

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Codes Créateurs — Pilotage Admin                      │
├─────────────────────────────────────────────────────────┤
│ KPIs globaux                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ 34       │ │ 18/34    │ │ 74 800   │ │ 1 247    │   │
│ │ codes    │ │ créateurs│ │ pts/mois │ │ clients  │   │
│ │ actifs   │ │ actifs   │ │ redistrib│ │ bénéfic. │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────────────────┤
│ PARAMÈTRES GLOBAUX                                      │
│                                                         │
│ Quota mensuel par créateur (défaut) : [50 000 pts] [✏]  │
│ Quota VIP créateurs (>500 voyageurs) : [200 000 pts] [✏]│
│ Valeur max par code : [1 000 pts / scan] [✏]            │
│ Max scans par code : [10 000] [✏]                       │
│ Anti-abus : 1 scan par client par code par 24h [✅ ON]  │
│                                    [Sauvegarder]        │
├─────────────────────────────────────────────────────────┤
│ TOUS LES CODES ACTIFS                                   │
│                                                         │
│ Filtres : [Tous ▼] [Créateur ___] [Statut ▼] [🔍]     │
│                                                         │
│ Code          Créateur     Valeur  Scans   Statut       │
│ ─────────────────────────────────────────────────────── │
│ EVT-JEAN12    Jean Dupont  500 pts 68/200  ● ACTIF [⏸] │
│ EVT-MARIE01   Marie Martin 1000 pts 2340/∞ ● ACTIF [⏸] │
│ EVT-ALEX-PROMO Alex Bon    200 pts 12/50  ● ACTIF [⏸] │
│ EVT-NOEL2025  Jean Dupont  500 pts 500/500 ○ ÉPUISÉ    │
│ ...                                         [Export CSV]│
├─────────────────────────────────────────────────────────┤
│ ALERTES & ANOMALIES                                     │
│                                                         │
│ ⚠️ EVT-MARIE01 : 2 340 scans en 7j — pic inhabituel    │
│    → [Investiguer] [Suspendre] [Valider]                │
│                                                         │
│ ⚠️ Jean Dupont quota 93.7% (15j avant reset)            │
│    → [Augmenter quota] [Contacter]                      │
│                                                         │
│ ✅ Aucune fraude détectée (multi-scan 24h)              │
├─────────────────────────────────────────────────────────┤
│ GRAPHE REDISTRIBUTION (30 jours)                        │
│                                                         │
│ [AreaChart : pts redistribués via codes créateurs/jour] │
└─────────────────────────────────────────────────────────┘
```

---

## PAGE CLIENT — Scanner un code créateur

**Priorité : P1**
**Route existante** : `/client/energie` — **MODIFIER** (section à ajouter)
**Route nouvelle possible** : `/client/energie/scanner`

### Maquette section à ajouter dans client/energie

```
┌─── SCANNER UN CODE CRÉATEUR ───────────────────────────┐
│                                                         │
│ Un indépendant Eventy vous a partagé un code ?          │
│                                                         │
│ [📷 Scanner avec ma caméra]                            │
│                                                         │
│ — ou entrer manuellement —                              │
│                                                         │
│ Code : EVT - [____________]     [Valider]               │
│                                                         │
│ ✅ EVT-JEAN12 validé !                                  │
│ +500 ⚡ énergie de Jean Dupont                          │
│ "Merci pour votre confiance !"                          │
│                                                         │
│ Nouveau solde : 3 740 pts                               │
│                                                         │
│ ─────────────────────────────────────────────          │
│ Codes utilisés récemment :                              │
│ EVT-JEAN12   +500 pts   23/04   Jean Dupont            │
│ EVT-MAROC    +200 pts   15/04   Marie Martin           │
└─────────────────────────────────────────────────────────┘
```

---

## DONNÉES & TYPES

### Interface TypeScript (frontend)

```typescript
type CodeCreateurStatut = 'actif' | 'suspendu' | 'epuise' | 'expire'
type CodeDistribChannel = 'qr' | 'url' | 'whatsapp' | 'instagram' | 'email' | 'print' | 'sms'

interface CodeCreateur {
  id: string
  code: string           // "EVT-JEAN12"
  label: string          // nom interne du créateur
  createurId: string
  createurNom: string
  valeurPts: number      // pts offerts par scan
  maxScans: number | null
  scansActuels: number
  dateExpiration: string | null
  restriction?: {        // optionnel
    type: 'VILLE' | 'VOYAGE'
    valeur: string
  }
  messageClient: string  // affiché lors du scan
  statut: CodeCreateurStatut
  channels: CodeDistribChannel[]
  createdAt: string
  totalPtsDistribues: number
  last7: number[]        // scans des 7 derniers jours
}

interface ScanCodeResult {
  success: boolean
  code: string
  createurNom: string
  messageClient: string
  ptsCredites: number
  nouveauSolde: number
  error?: 'CODE_INVALIDE' | 'DEJA_SCANNE_24H' | 'EPUISE' | 'EXPIRE' | 'QUOTA_CREATEUR_VIDE'
}
```

### APIs backend à créer

```
# Créateur indépendant
GET    /independant/energie/codes                 liste ses codes
POST   /independant/energie/codes                 créer un code
GET    /independant/energie/codes/:id             détail + stats
PUT    /independant/energie/codes/:id             modifier
DELETE /independant/energie/codes/:id             supprimer
POST   /independant/energie/codes/:id/suspend     suspendre
POST   /independant/energie/codes/:id/resume      réactiver
GET    /independant/energie/codes/:id/qr          générer QR PNG

# Client
POST   /client/energie/scan-code                  scanner un code
GET    /client/energie/codes-utilises             historique scans

# Admin
GET    /admin/energie/codes-createurs             tous les codes
GET    /admin/energie/codes-createurs/stats       KPIs globaux
PUT    /admin/energie/codes-createurs/:id/suspend suspendre
GET    /admin/energie/codes-createurs/alertes     anomalies
GET    /admin/createurs/:id/quota                 quota d'un créateur
PUT    /admin/createurs/:id/quota                 modifier quota
```

---

## ANTI-FRAUDE

```
Règles à implémenter côté backend :

1. Anti-double-scan (par client, par code, par 24h)
   → Redis TTL key: scan:{clientId}:{codeId} = 24h

2. Détection pic inhabituel
   → Si scans > 3x moyenne 7j en 1h → alerte admin auto

3. Quota créateur
   → Chaque scan décrémente le quota mensuel du créateur
   → Si quota = 0 → code invalide (même si actif)
   → Reset le 1er du mois à minuit

4. Validation code
   → Code doit commencer par "EVT-"
   → Format : EVT-[A-Z0-9]{4,12}
   → Vérification en base : statut = 'actif', non expiré, non épuisé

5. Un créateur ne peut pas scanner son propre code
   → Vérifier createurId !== clientId connecté
```

---

## RÉCAPITULATIF PRIORITÉS

| Priorité | Page / Fonctionnalité | Action |
|----------|----------------------|--------|
| P1 | `independant/energie/codes` | CRÉER |
| P1 | Wizard création code (3 étapes) | CRÉER |
| P1 | QR code génération + téléchargement | CRÉER |
| P1 | `client/energie` — section scanner QR | MODIFIER |
| P1 | `admin/createurs/energie` | CRÉER |
| P1 | APIs backend codes créateurs | CRÉER |
| P1 | Anti-fraude backend | CRÉER |
| P2 | Page `independant/energie` hub | CRÉER |
| P2 | Partage social (WhatsApp, Instagram) | CRÉER |
| P2 | PDF print-ready A4+sticker | CRÉER |
| P2 | Stats détaillées par code (graphes) | CRÉER |
| P3 | Restriction géographique par code | CRÉER |
| P3 | Code = % voyage (pas pts fixe) | CRÉER |
| P3 | Alertes SMS/push scan créateur | CRÉER |

---

*Audit réalisé le 2026-04-25 | David Eventy*
