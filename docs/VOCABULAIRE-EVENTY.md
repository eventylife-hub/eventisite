# 🗣️ Vocabulaire Eventy — Référentiel officiel

> **Dernière mise à jour** : 16 avril 2026
> **Statut** : Obligatoire pour tout contenu client, partenaire, équipe, code, doc.
> **Décidé** : vocabulaire adopté post-audit pro 360 pages (avril 2026) — remplace "partenaire" / "indépendant" / "utilisateur" par des termes humains et fidèles à [l'âme d'Eventy](../AME-EVENTY.md).

Chez Eventy, les mots que l'on utilise ne sont pas neutres. Chaque terme est choisi pour dire quelque chose de fort sur la relation. On ne parle pas de *clients*, on parle de *Voyageurs*. On ne parle pas de *prestataires*, on parle de *Créateurs*, *Maisons*, *Ambassadeurs*. C'est volontaire : nos mots racontent notre modèle.

---

## 👤 Voyageur

> Celui qui part avec Eventy.

- **Ancien terme** : client, utilisateur, customer
- **Nouveau terme** : **Voyageur** (ou Voyageuse)
- **Règle** : toujours avec une majuscule dans un contexte marketing/produit. Minuscule uniquement dans un contexte juridique (CGV, contrats).
- **Pourquoi** : "client" est transactionnel. "Voyageur" dit ce que la personne fait, ce qu'elle vit. Un Voyageur n'achète pas un produit — il vit une expérience.
- **Exemples** :
  - ✅ "Tu es Voyageur Eventy — tu cliques, tu voyages."
  - ✅ "Chaque Voyageur est couvert par le Pack Sérénité."
  - ✅ Portail : **Espace Voyageur** (remplace "Espace Client").
  - ❌ "Nos clients apprécient…" → ✅ "Nos Voyageurs apprécient…"

---

## 🎨 Créateur

> L'indépendant qui imagine, construit et accompagne un voyage Eventy.

- **Ancien terme** : partenaire pro, indépendant, prestataire, tour leader, pro
- **Nouveau terme** : **Créateur** (ou Créatrice) de voyage
- **Pourquoi** : au cœur du modèle Eventy, il y a des humains qui créent. Ce ne sont ni des exécutants, ni des "prestataires" : ce sont des **artistes du voyage**. Ils apportent leur personnalité, leur réseau, leur manière de faire voyager.
- **Statut juridique** : auto-entrepreneur, micro-entrepreneur, SASU, SARL — peu importe. Ce sont des partenaires à parts entières, pas des employés.
- **Portail** : `/pro/*` → **Espace Créateur** (le dossier reste `/pro` pour raisons techniques, mais l'UI dit "Créateur"/"Créatrice").
- **Niveaux** :
  - **Créateur Standard** : génère des devis/demandes → Eventy valide.
  - **Créateur Premium** (`isPremium=true`) : auto-valide ses devis, accès avancé.
- **Exemples** :
  - ✅ "Marie, Créatrice indépendante du Maroc depuis 12 ans, a imaginé ce voyage."
  - ✅ "Devenir Créateur Eventy."
  - ❌ "Nos partenaires pro" → ✅ "Nos Créateurs"

---

## 🤝 Ambassadeur

> Le revendeur de proximité qui vend le catalogue Eventy à ses clients.

- **Ancien terme** : vendeur, revendeur, point de vente, reseller
- **Nouveau terme** : **Ambassadeur** (ou Ambassadrice)
- **Qui ? ** : tabacs-presse, coiffeurs, agences locales, magasins, comités d'entreprise, associations, auto-entrepreneurs apporteurs d'affaires.
- **Modèle** : touche une **commission** (cookie "last click wins" — 5% par défaut) sur chaque vente qu'il apporte.
- **Portail** : `/ambassadeur/*` — accent cyan #06b6d4.
- **Exemples** :
  - ✅ "Deviens Ambassadeur Eventy — présente nos voyages, touche une commission."
  - ✅ "Le tabac-presse de quartier devient Ambassadeur."
  - ❌ "Vendeur du réseau" → ✅ "Ambassadeur Eventy"

---

## 🏛️ Maison HRA

> L'établissement qui accueille, nourrit ou anime un voyage Eventy.

- **Acronyme** : HRA = **Hôtel · Restaurant · Activité** (originellement). Étendu aux 8 catégories Maisons.
- **Nouveau terme** : **Maison** (ou Maison HRA en interne)
- **Pourquoi "Maison" ?** : un hôtel, un restaurant, un prestataire d'activité — ce sont des lieux qui accueillent. En France, on parle d'une "Maison" pour un grand restaurant, une "Maison de champagne", une "Maison d'hôtes". Le mot porte la chaleur, l'accueil, la signature.
- **8 catégories de Maisons** :
  1. **Hébergement** — hôtels, maisons d'hôtes, resorts
  2. **Restauration** — restaurants, traiteurs, tables
  3. **Activités** — guides, ateliers, expériences
  4. **Transport luxe** (Phase 2) — voitures, chauffeurs privés
  5. **Image & Souvenirs** — photographes, vidéastes
  6. **Décoration** — art floral, décoration événementielle
  7. **Coordination VIP** — wedding planners, coordinateurs
  8. **Sécurité VIP** — agents de sécurité, protocoles
- **Portail** : `/maisons/*` — dark luxury, accent amber #b45309.
- **Workflow d'onboarding** : `INVITED → PENDING → UNDER_REVIEW → ACTIVE`
- **Exemples** :
  - ✅ "La Maison d'Argent, notre partenaire de confiance à Marrakech."
  - ✅ "Inscrire ma Maison sur Eventy."
  - ❌ "Nos fournisseurs hôtel" → ✅ "Nos Maisons d'hébergement"

---

## 🏢 Pôle

> Une équipe métier interne à Eventy (salariée ou en cours de recrutement).

- **Ancien terme** : service, département, team, squad
- **Nouveau terme** : **Pôle**
- **Pourquoi** : "Pôle" évoque l'attraction, la référence, le lieu où converge une expertise. Chaque Pôle a son cockpit sur `/equipe/{pole}`.
- **Les 14 Pôles Eventy** :
  1. **Direction** — PDG, stratégie, investisseurs, meta-dashboard
  2. **Finance** — compta Pennylane, TVA marge, payouts Stripe Connect, cotisations indé
  3. **Voyage** — lifecycle voyages (draft → published → on-going → completed), Go/No-Go
  4. **Transport** — flotte bus, charters, devis, routes, chauffeurs
  5. **Commercial** — B2B (CE, associations, séminaires), acquisition Créateurs
  6. **Talents** — recrutement Créateurs, RH salariés, onboarding
  7. **Marketing** — acquisition, rétention, referral, content, Rays, presse
  8. **Support** — tickets, réponses Voyageurs, SOS, urgence terrain
  9. **Juridique** — CGV, Atout France, RGPD, contrats Créateurs/Maisons
  10. **Sécurité** — données (sécurité info), terrain (safety voyages), incidents
  11. **Tech** — plateforme, infra Scaleway/Vercel, monitoring, Sentry
  12. **Data** — analytics, BI, cohortes, forecasting
  13. **Qualité** — Phase 1 Pôle Qualité, validation voyages avant publication, relecture
  14. **Maisons** — négociations HRA, cascades tarifaires, onboarding Maisons
  15. **Achats** — fournisseurs transport, matériel, logistique Eventy
- **Portail** : `/equipe/{pole}` — dark HUD, couleur accent par Pôle.
- **Exemples** :
  - ✅ "Le Pôle Qualité valide chaque voyage avant publication."
  - ✅ "Cockpit du Pôle Voyage."

---

## 🚌 Bus complet 53

> L'unité de base économique d'un voyage Eventy.

- **Définition** : un voyage Eventy = un bus de **53 places**.
- **Pourquoi 53 ?** : sweet spot prix/ambiance. Transport divisé par 53, hôtels -15%, restos -20%.
- **Seuil minimal** : on **part même si le bus n'est pas plein** (40-45 suffisent selon le voyage). Promesse : on laisse pas les Voyageurs sur le carreau.
- **3 sources de remplissage** : Groupe organisateur (50-70%) · Places ouvertes publiques (20-30%) · Réseau Créateurs/Ambassadeurs (10-20%).
- **Phase 2 — Charter avion** : 159 passagers sur charter A320 (-35% à -50% vs régulier).

---

## 🧳 Pack Sérénité

> L'assurance + assistance **incluse, gratuite, simple** pour tout Voyageur Eventy.

- **Règle** : **jamais une option payante**. Inclus pour 100% des Voyageurs.
- **Couvre** : annulation, rapatriement, bagages perdus, souci médical, remplacement Créateur.
- **Promesse** : *« Quoi qu'il arrive, on s'en occupe. »*
- **Pas de petites lignes. Pas de cases à cocher. Pas de supplément caché.**

---

## ⭐ Standard / Luxe

> La double gamme Eventy.

- **Gamme Standard** (Phase 1 — actuelle) : voyages bus 53 places, hôtels 3-4★, prix accessible (500-1 200€/pax).
- **Gamme Luxe** (Phase 2) : hôtels 5★, expériences privées, Maisons VIP, chauffeurs, petits groupes 15-25 pax, 2 000-5 000€/pax.
- **Règle** : Standard d'abord (lancement), Luxe **en Phase 2 uniquement**. On ne mélange pas les deux gammes dans la même interface Voyageur sans sélecteur clair.

---

## 🎟️ Termes secondaires — à connaître

| Terme | Définition |
|-------|------------|
| **Rays** ☀️ | Monnaie virtuelle marketing EventyLife : Créateurs et Voyageurs gagnent des Rays (challenges, parrainages) échangeables contre services marketing, prospectus, réductions. |
| **Cookies de Fidélité** 🍪 | Programme de fidélité Voyageur — 1 voyage = X cookies → réductions sur prochains voyages. |
| **Cocktail de départ** 🥂 | Moment convivial au point de ramassage : le Créateur accueille les Voyageurs avant de monter dans le bus. Règle : **le Créateur est là dès le 1er km**. |
| **Cagnotte** | Pot commun d'un groupe — tous contribuent, organisateur paie. Feature flag OFF au lancement. |
| **Groupe** | Sous-entité d'un voyage — famille/amis/CE/événement qui réservent ensemble. 4 types, 23 feature flags. |
| **Tribu** (Phase 2) | Communauté de Voyageurs qui refont des voyages ensemble — moteur de rétention. |
| **Salon Voyage** (Phase 2) | Événement physique annuel Eventy — Créateurs, Maisons, Voyageurs se rencontrent. |
| **Voyage co-créé** (Phase 2) | Voyage sur-mesure imaginé avec le Voyageur (mariage, EVJF, séminaire). |
| **Bracelets restaurateur** (Phase 2) | Système de bracelets aux tables pour identifier les Voyageurs Eventy dans les restaurants partenaires. |
| **Fondation Eventy .org** (Phase 3) | Branche non-profit : faire voyager ceux qui n'en ont pas les moyens (jeunes, seniors isolés, associations). |
| **isPremium** | Flag sur ProProfile — Créateur Premium peut auto-générer ET auto-valider ses devis transport. |
| **HRA Cascade** | Cascade tarifaire multi-niveaux Maison → Créateur → Voyageur, avec marges négociées. |
| **Quality Gate** | Portail de validation qualité d'un voyage — Pôle Qualité valide avant passage en SALES_OPEN. |
| **Go/No-Go** | Décision admin J-X : on part ou on annule selon le remplissage. |
| **Close Pack** | Clôture financière d'un voyage post-retour — bilan par Créateur, reversement définitif. |

---

## 🎨 Règles d'écriture

1. **Majuscules** : Voyageur, Créateur, Ambassadeur, Maison, Pôle — **toujours majuscule** en contexte produit/marketing. Minuscule en contexte juridique strict.
2. **Genre** : on privilégie la forme au masculin générique, mais **Créatrice/Voyageuse/Ambassadrice** doivent apparaître régulièrement dans les contenus visuels (diversité).
3. **Tutoiement** : privilégier le *tu* avec le Voyageur et le Créateur. Vouvoiement avec les Maisons et les institutions.
4. **Ne jamais dire** :
   - ❌ "client" (sauf CGV)
   - ❌ "prestataire" (les Créateurs et Maisons ne sont pas des prestataires)
   - ❌ "fournisseur" (pour les Maisons : elles *accueillent*, elles ne fournissent pas)
   - ❌ "utilisateur" / "user"
   - ❌ "partenaire" seul (trop vague — préciser Créateur, Maison ou Ambassadeur)
5. **La promesse — toujours cette formulation** :
   > *« 0 stress. Il clique, il voyage. Dynamique et libre. »*

---

## 🔤 Règles techniques (code)

Dans le code, les routes et noms de tables restent en anglais/neutre pour raisons techniques, mais **les strings UI doivent utiliser le vocabulaire ci-dessus**.

| Domaine tech | Nom code | Terme UI |
|--------------|----------|----------|
| Route `/pro/*` | `pro` | "Créateur" dans les textes |
| Table `ProProfile` | `ProProfile` | "Profil Créateur" dans l'UI |
| Table `TravelGroup` | `TravelGroup` | "Groupe" dans l'UI |
| Rôle `PRO` | `PRO` | "Créateur" dans l'UI |
| Rôle `ADMIN` | `ADMIN` | "Équipe Eventy" dans l'UI |
| Table `HraPartner` | `HraPartner` | "Maison" dans l'UI |

---

*Document maintenu par le Pôle Produit + IA PDG. Toute proposition de nouveau terme doit être ajoutée ici et validée par David.*
