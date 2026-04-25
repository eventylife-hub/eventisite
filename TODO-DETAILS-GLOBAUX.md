# TODO — DÉTAILS GLOBAUX SITE EVENTY
## Audit complet — 25 avril 2026

> Audit exhaustif de tous les portails principaux : (public), (client), (admin), (pro), (jeux), (maisons).
> Classé par priorité : 🔴 Critique · 🟠 Moyen · 🟡 Mineur · ✅ Conforme

---

## 🔴 PRIORITÉ 1 — CRITIQUE (Bloquants avant production)

### 1.1 MARQUES RÉELLES UTILISÉES SANS AUTORISATION

**Risque juridique élevé — brand impersonation possible**

#### Portail Public
| Page | Marques | Usage | Correction |
|------|---------|-------|-----------|
| `/devenir-marque` | Nike, Coca-Cola, Apple, Samsung, Sephora, Renault, Netflix, Adidas, Zara, McDonald's, H&M | Témoignages fictifs avec noms d'employés inventés | Remplacer par marques fictives OU obtenir accords écrits |
| `/marques/gagnants` | Nike, Air France, Samsung, Apple, Coca-Cola, Renault, Sephora, Netflix, Adidas | "Gagnants" fictifs avec photos avatars | Ajouter disclaimer visible "Données d'exemple" OU utiliser vrais gagnants |

**Code problématique (`/devenir-marque/page.tsx` ~ligne 50) :**
```typescript
const TESTIMONIALS = [
  { brand: 'Nike', author: 'Marie Leblanc', role: 'Brand Partnerships, Nike France', ... }
]
```

#### Portail Jeux
| Page | Marques | Correction |
|------|---------|-----------|
| `jeux/championnats/page.tsx` ~ligne 225 | Redbull ("Quiz Monde by Redbull"), Decathlon (x2), GoPro France, Lacoste Voyage, Thermomix, Pirelli, Librairie Gibert | Vérifier partenariat réel ou remplacer par "Sponsor Partenaire A" |
| `jeux/marketplace/page.tsx` ~ligne 111 | Domaine des Cigales | Vérifier ou anonymiser |

#### Portail Admin
| Page | Marques | Correction |
|------|---------|-----------|
| `admin/contrats/page.tsx` ~ligne 48 | Lazergame PR, Escape Masters, Bowling Prestige, Oasis Spa | Renommer DemoPartner01, DemoPartner02... |
| `admin/partenaires/page.tsx` ~ligne 60 | Lazergame Paris Republique, Parc Aventure Vercors | Anonymiser |
| `admin/hra/page.tsx` ~ligne 7 | CrossFit Republique, Escape Masters, Laser Game Arena, Spa & Wellness | Anonymiser |

#### Portail Maisons
| Page | Marque | Correction |
|------|--------|-----------|
| `maisons/a-distance/page.tsx` ~ligne 161 | "Chef Anna (ex-Grand Hotel de Milan)" | Remplacer par nom fictif |

---

### 1.2 COMPTEUR FICTIF ANIMÉ SUR `/marques/gagnants`

**Trompe l'utilisateur sur le volume réel de la plateforme**

```typescript
// ~ligne 96 — compteur qui monte tout seul :
const TOTAL_WINS_TODAY = 847;
const TOTAL_WINS_ALL_TIME = 38420;
const TOTAL_VALUE_ALL_TIME = 2840000;
setInterval(() => setCounter((c) => c + Math.floor(Math.random() * 2)), 4500);
```

**Correction :** Connecter à une vraie API, ou ajouter "(données illustratives)" visible, ou désactiver l'animation.

---

### 1.3 PORTAIL MAISONS — TABLES NON RESPONSIVES SUR MOBILE

**Pages concernées :**
- `maisons/activites/page.tsx` ~ligne 389
- `maisons/hebergement/page.tsx`

**Code problématique :**
```javascript
// Inline styles sans media query :
display: 'grid',
gridTemplateColumns: '1fr 120px 160px 80px 80px 100px 100px'
```
Sur mobile < 768px → débordement horizontal non lisible.

**Correction :**
```jsx
// Remplacer par :
<div className="overflow-x-auto">
  <table className="w-full min-w-[700px] text-sm">...</table>
</div>
```

---

### 1.4 PORTAIL MAISONS — AUCUN PRIX AFFICHÉ

Les fiches hébergement et activités n'affichent aucun tarif côté utilisateur. Les données existent dans le code (`prixParPax: 60`, `montantNet: 7200`) mais ne sont pas rendues à l'écran.

**Pages concernées :**
- `maisons/hebergement/page.tsx` — tableau sans colonne prix
- `maisons/activites/page.tsx` — tableau sans colonne prix

**Correction :** Ajouter une colonne "Tarif" ou badge "À partir de X€/nuit" dans chaque ligne.

---

### 1.5 IMAGES SANS ALT TEXT (SEO + Accessibilité)

**22 fichiers** contiennent `alt=""` sur des images de contenu (pas décoratif).

**Pages critiques :**
- `(public)/marques/gagnants/page.tsx` — photos des "gagnants"
- `(public)/devenir-marque/page.tsx` — logos de marques
- `(client)/client/marques/page.tsx`
- `(pro)/pro/marque/*/page.tsx` (3 fichiers)
- `(admin)/admin/marques/page.tsx`
- `(client)/client/chat/[id]/page.tsx`
- `(pro)/pro/chat/page.tsx`
- `(independant)/independant/chat/page.tsx`

**Correction :** Remplacer `alt=""` par une description : `alt="Logo Nike"`, `alt="Photo de Sophie M., gagnante"`.

---

## 🟠 PRIORITÉ 2 — MOYEN (À corriger avant lancement)

### 2.1 STATS SANS SOURCE DANS `/devenir-marque`

Chiffres présentés comme issus de vraies campagnes Nike mais totalement fictifs :
- "4x engagement supérieur aux campagnes sociales" (ROAS Nike)
- "3.8x ROAS" — "1.2M impressions"
- "820k impressions" — "4.1x ROAS" (Air France)

**Correction :** Ajouter la mention "(données illustratives)" après chaque stat.

---

### 2.2 STATUT JURIDIQUE DES CRÉATEURS NON EXPLICITE (Portail Pro)

Aucune mention du statut indépendant (freelance, micro-entrepreneur) dans le parcours d'inscription créateur.

**Pages concernées :**
- `pro/activites/inscription/page.tsx`
- `pro/dashboard/page.tsx`

**Correction :** Ajouter sur la page d'inscription :
> "Les créateurs Eventy exercent en tant qu'indépendants/prestataires. Eventy n'est pas votre employeur."

---

### 2.3 BANNIÈRES "MODE DÉMO" NON UNIFORMES (Portail Pro + Admin)

- Pages `pro/activites/*` affichent bien "Mode démonstration — données fictives"
- Pages `pro/dashboard/page.tsx` et pages financières admin : **pas de bannière**

**Données fictives non étiquetées :**
- Dashboard pro : CA 18 420€, 186 voyageurs, note 4.8/5
- Analytics admin : 1.24M XP, €3.8M revenus

**Correction :** Créer un composant `<DemoBanner />` réutilisable et l'ajouter sur toutes les pages financières.

---

### 2.4 PORTAIL JEUX — RÈGLES DES CLASSEMENTS NON DOCUMENTÉES

Les pages `jeux/classement/page.tsx` et `jeux/trophees/page.tsx` existent mais le contenu explicatif des règles est minimal.

**Correction :** Ajouter une section "Comment fonctionne le classement" (modal ou section dédiée).

---

### 2.5 DONNÉES FICTIVES AVEC NOMS/TÉLÉPHONES FRANÇAIS (38 fichiers)

**38 fichiers** contiennent des DEMO_DATA hardcodées avec noms (Sophie Laurent, Thomas Beaumont, Jean Dupont...) et numéros fictifs (06 12 34 56 78, etc.).

**Fichiers principaux :**
- `admin/clients/page.tsx` — 12 clients fictifs avec emails @wanadoo.fr/@orange.fr
- `ambassadeur/messagerie/page.tsx` — tableau MESSAGES hardcodé
- `equipe/activites/inscriptions/page.tsx`
- `client/filleuls/page.tsx`
- `comptable/cotisations/page.tsx`
- (+ 33 autres fichiers)

**Correction :** Centraliser les DEMO_DATA dans un fichier `lib/demo-data.ts` et commenter `// DEMO — À remplacer par API`. Ajouter une variable d'environnement `NEXT_PUBLIC_DEMO_MODE=true` pour conditionner l'affichage.

---

### 2.6 PORTAIL JEUX — GRILLE KPI CHAMPIONNATS NON RESPONSIVE

`admin/activites/championnats/page.tsx` ~ligne 48 :
```javascript
gridTemplateColumns: 'repeat(4, 1fr)'  // Inline style, aucun breakpoint
```
Sur mobile : 4 colonnes forcées → illisible.

**Correction :** `className="grid grid-cols-2 md:grid-cols-4 gap-4"`

---

### 2.7 LIENS HREF="#" NON FONCTIONNELS (3 cas)

| Page | Ligne approx | Contexte |
|------|-------------|---------|
| `admin/annulations/page.tsx` | ~1761 | `<ContactBtn href="#" />` |
| `admin/game-master/page.tsx` | ? | href="#" |
| `pro/messagerie/page.tsx` | ? | href="#" |

**Correction :** Remplacer par route valide ou `onClick` handler.

---

### 2.8 FICHES MAISONS INCOMPLÈTES

Les fiches hébergement/activités ont les données de base mais manquent :
- ❌ Photos/images de la maison ou de l'activité
- ❌ Capacité d'accueil (pax min/max)
- ❌ Services inclus (petit-déjeuner, parking, WiFi)
- ❌ Horaires d'ouverture pour activités
- ❌ Coordonnées de contact

**Correction :** Enrichir le modèle de données et les pages de détail. Priorité photos (indispensable pour l'achat).

---

## 🟡 PRIORITÉ 3 — MINEUR (Améliorations qualité)

### 3.1 ACCENTS MANQUANTS (Portail Jeux)

| Fichier | Mot incorrect | Correct |
|---------|--------------|---------|
| `jeux/types.tsx` | "Decouverte" | "Découverte" |
| `jeux/creer/page.tsx` | "Activites" (multiple) | "Activités" |
| `jeux/creer/page.tsx` | "Acces" | "Accès" |

---

### 3.2 ENTITÉS HTML MAL PLACÉES (Admin)

`admin/aide-locale/page.tsx` ~ligne 1099 :
```html
"Num&eacute;ros d'urgence"  →  devrait être UTF-8 : "Numéros d'urgence"
```

---

### 3.3 METADATA MANQUANTE SUR ROUTES DYNAMIQUES PUBLIQUES

Pages publiques sans `generateMetadata()` (héritent du layout par défaut) :
- `(public)/v/[code]/page.tsx`
- `(public)/hotel-invite/[token]/page.tsx`
- `(public)/partenaire/onboarding/hotel/[token]/page.tsx`
- `(public)/partenaire/onboarding/restaurant/[token]/page.tsx`

**Correction :** Ajouter `generateMetadata()` avec fallback si les données ne sont pas disponibles.

---

### 3.4 INLINE STYLES HARDCODÉS DANS L'ADMIN (Non-respect design tokens)

Plusieurs pages admin utilisent des couleurs hexadécimales hardcodées au lieu des variables CSS du design system (`var(--gold)`, `var(--navy)`, etc.) :
- `rgba(21,26,33,0.7)`, `#f1f3fc` dans championnats
- Non réactif au changement de thème

**Correction :** Migrer vers les classes Tailwind ou les CSS variables définies dans `globals.css`.

---

### 3.5 BG-WHITE SUR COMPOSANTS DANS PAGES DARK

324 occurrences de `bg-white` détectées — principalement dans des **composants internes** (boutons, badges, modales) et non sur des pages entières. À inspecter visuellement pour s'assurer qu'aucune page entière n'a un fond blanc non voulu.

---

## ✅ POINTS CONFORMES — NE PAS TOUCHER

Ces éléments sont corrects et ne nécessitent pas d'action :

| Élément | Statut | Notes |
|---------|--------|-------|
| **Design dark premium** | ✅ Partout | `#0A0E14`, `#D4A853`, glassmorphism cohérent |
| **Fiches voyage client** | ✅ Exemplaires | Itinéraire J/J, équipe terrain, transport, météo, avis — complet |
| **Gaming optionnel** | ✅ Conforme | Jamais bloquant, feature flags bien utilisés |
| **Modèle 82/18** | ✅ Correct | Affiché dans pro/revenus, appliqué sur la marge uniquement |
| **Orthographe française** | ✅ Excellente | Accents, conjugaisons, ponctuation — quasi-parfait |
| **Responsive public/client** | ✅ Bon | `sm:`, `md:`, `lg:` systématiques sur portails principaux |
| **Navigation principale** | ✅ Propre | Quasi aucun href="#" invalide |
| **CTA** | ✅ Présents | Chaque page a au moins 1 bouton d'action visible |
| **SEO portail public** | ✅ Complet | Metadata, Open Graph, JSON-LD, Twitter Card |
| **Pas de Lorem ipsum** | ✅ Aucun | Textes réalistes partout |
| **Données destinations/prix** | ✅ Cohérents | Fourchettes réalistes, destinations plausibles |
| **Statut noindex zones auth** | ✅ Correct | Admin/client/pro correctement désindexés |
| **Distance pickup voyages** | ✅ Visible | `distanceKm`, adresse précise dans fiches voyage client |

---

## RÉSUMÉ ACTIONS CLASSÉES

### Semaine 1 — BLOQUANTS
- [ ] Supprimer/remplacer toutes les marques réelles (Nike, Redbull, etc.) dans les données fictives
- [ ] Rendre les tables Maisons responsives (overflow-x-auto + min-w)
- [ ] Afficher les prix dans les fiches Maisons hébergement + activités
- [ ] Ajouter alt text sur les 22 images vides
- [ ] Désactiver ou sourcer le compteur animé sur `/marques/gagnants`

### Semaine 2 — IMPORTANT
- [ ] Uniformiser les bannières "Mode démo" sur toutes les pages financières
- [ ] Clarifier le statut indépendant des créateurs dans portail pro
- [ ] Corriger les 3 href="#" invalides
- [ ] Documenter les règles classement dans le portail Jeux
- [ ] Corriger les accents manquants (Decouverte → Découverte, Activites → Activités)

### Semaine 3 — QUALITÉ
- [ ] Centraliser les DEMO_DATA dans `lib/demo-data.ts`
- [ ] Migrer inline styles admin vers Tailwind + CSS variables
- [ ] Ajouter generateMetadata() sur routes dynamiques publiques
- [ ] Enrichir fiches Maisons (photos, capacité, services, contact)
- [ ] Corriger entités HTML dans admin/aide-locale
