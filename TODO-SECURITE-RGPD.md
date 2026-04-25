# TODO — Sécurité & RGPD Eventy
> Audit réalisé le **2026-04-25** — Priorité MVP avant mise en production

---

## Score de conformité actuel

| Domaine | Score | Statut |
|---------|-------|--------|
| Pages RGPD / mentions légales | 95/100 | ✅ Excellent |
| Bandeau cookies (CNIL) | 95/100 | ✅ Excellent |
| Droits utilisateurs (Art. 15-21) | 90/100 | ✅ Très bon |
| Sécurité en-têtes HTTP | 85/100 | ✅ Bon |
| Protection données sensibles | 70/100 | ⚠️ À améliorer |
| Formulaires avec mentions RGPD | 65/100 | ⚠️ Lacunes |
| Sécurité backend / secrets | 60/100 | ⚠️ À corriger |
| **GLOBAL** | **80/100** | ⚠️ Acceptable — corrections requises |

---

## 🔴 CRITIQUE — Bloquer la mise en prod

### [ ] SECU-001 — JWT dev fallback hardcodé (backend)
- **Fichier** : `backend/src/modules/auth/auth.service.ts` ligne 76
- **Problème** : Secret JWT de repli `dev-access-secret-NOT-FOR-PRODUCTION` retourné si `NODE_ENV=development` — risque de tokens forgés si l'env est mal configuré en prod
- **Action** : Supprimer le fallback dev. En dev, exiger `JWT_ACCESS_SECRET` dans `.env.local`. Lever une erreur claire si absent.
- **Responsable** : Dev backend
- **Délai** : Avant déploiement prod

### [ ] SECU-002 — Consentement explicite manquant sur formulaire rooming (passeport)
- **Fichier** : `frontend/app/(client)/client/reservations/[id]/rooming/page.tsx` ligne 467
- **Problème** : Le formulaire demande le passeport sans case à cocher de consentement RGPD explicite (Art. 6 et 9 RGPD — document d&apos;identité = donnée sensible)
- **Action** : Ajouter avant le champ passeport :
  - Case à cocher obligatoire : "J&apos;accepte que ces données soient traitées uniquement pour ce voyage et supprimées J+30 après le retour"
  - Lien vers `/politique-confidentialite#donnees-identite`
- **Responsable** : Dev frontend
- **Délai** : Avant déploiement prod

---

## 🟠 IMPORTANT — Corriger rapidement (semaine 1)

### [ ] SECU-003 — Formulaire inscription Pro sans mention RGPD
- **Fichier** : `frontend/app/(pro)/pro/inscription/` (aucun fichier de composant trouvé avec consentement)
- **Problème** : L&apos;inscription Pro ne contient aucune mention RGPD visible, ni lien politique de confidentialité, ni case de consentement
- **Action** : Ajouter en bas du formulaire :
  ```jsx
  <p>En vous inscrivant, vous acceptez notre{' '}
    <a href="/politique-confidentialite">politique de confidentialité</a>{' '}
    et nos <a href="/cgv">CGV</a>.
  </p>
  ```
- **Responsable** : Dev frontend

### [ ] SECU-004 — Formulaire partenaires sans mention RGPD
- **Fichier** : `frontend/app/(public)/partenaires/_components/partenaires-form.tsx`
- **Problème** : Aucune mention RGPD ou consentement dans le formulaire partenaires
- **Action** : Même correction que SECU-003 + case à cocher si données sensibles collectées
- **Responsable** : Dev frontend

### [ ] SECU-005 — CSP : `unsafe-inline` sur script-src
- **Fichier** : `frontend/next.config.js` ligne ~107
- **Problème** : `script-src 'unsafe-inline'` autorise l&apos;exécution de scripts inline — risque XSS (TODO déjà noté dans le code)
- **Action** : Implémenter nonce-based CSP via middleware Next.js pour remplacer `unsafe-inline` par `nonce-{random}`
- **Responsable** : Dev frontend
- **Note** : Tâche complexe — peut être post-lancement si délai trop court

### [ ] SECU-006 — DPIA Art. 35 non terminé (données de santé)
- **Référence** : `frontend/app/(admin)/admin/compliance/page.tsx` — ticket TK-006 "DPIA données de santé (Art. 35)"
- **Problème** : L&apos;analyse d&apos;impact (DPIA) pour les données allergie/mobilité/médical n&apos;est pas formalisée
- **Action** : Rédiger et archiver la DPIA. Modèle CNIL disponible sur cnil.fr
- **Responsable** : DPO / Avocat
- **Délai** : Obligatoire avant traitement en prod

### [ ] SECU-007 — Consentement explicite pour données de santé (allergie, mobilité)
- **Problème** : Le formulaire de réservation collecte allergies et besoins de mobilité sans case de consentement explicite séparée (Art. 9 RGPD — données de santé = catégorie spéciale)
- **Action** : Ajouter une section dédiée avant ces champs :
  ```
  ☐ "J'autorise Eventy à traiter mes données de santé (allergies, 
     mobilité réduite) uniquement pour l'organisation de ce voyage"
  ```
- **Responsable** : Dev frontend

### [ ] SECU-008 — DPA Vercel non signé
- **Référence** : Audit légal existant — DPA Vercel en brouillon
- **Problème** : Vercel (hébergement frontend, USA) doit avoir un DPA signé + transfert encadré par SCC/DPF
- **Action** : Finaliser et signer le DPA Vercel sur dashboard.vercel.com
- **Responsable** : PDG / DPO

---

## 🟡 MOYEN — Planifier ce mois

### [ ] SECU-009 — Durée de conservation des logs non documentée
- **Problème** : Les logs applicatifs (backend NestJS) n&apos;ont pas de durée de conservation RGPD documentée
- **Action** : Définir et implémenter une purge automatique des logs > 12 mois. Documenter dans la politique de confidentialité.
- **Responsable** : DevOps + DPO

### [ ] SECU-010 — Tester les API RGPD en production
- **Fichiers** :
  - `frontend/app/api/rgpd/data-delete/route.ts` (Art. 17 — droit à l&apos;oubli)
  - `frontend/app/api/rgpd/data-export/route.ts` (Art. 20 — portabilité)
  - `frontend/app/api/rgpd/consent/route.ts` (consentement)
- **Action** : Test end-to-end de chaque route après déploiement prod. Vérifier que la suppression J+30 déclenche bien la cascade backend.
- **Responsable** : Dev + QA

### [ ] SECU-011 — Vérifier purge automatique données d&apos;identité (J+30 après voyage)
- **Problème** : La politique de confidentialité mentionne la suppression des documents d&apos;identité J+30 après le voyage — vérifier que le cron est implémenté
- **Action** : Rechercher le cron de suppression dans `backend/src/modules/cron/` et valider qu&apos;il couvre passeport + données de santé
- **Responsable** : Dev backend

### [ ] SECU-012 — Registre des traitements (Art. 30) à finaliser
- **Référence** : `frontend/app/(avocat)/avocat/rgpd/page.tsx` — dashboard existant
- **Action** : S&apos;assurer que tous les traitements sont listés (rooming, allergie, GPS groupe, analytics) avec base légale, durée de conservation, sous-traitants
- **Responsable** : DPO

### [ ] SECU-013 — Rate limiting sur les APIs sensibles
- **Problème** : Vérifier que les endpoints `/api/rgpd/data-delete` et `/api/auth/` ont un rate limiting pour éviter les abus
- **Action** : Confirmer que le middleware de rate limiting NestJS (Throttler) couvre ces routes
- **Responsable** : Dev backend

---

## ✅ Points conformes — Ne pas modifier

| Élément | Fichier | Statut |
|---------|---------|--------|
| Bandeau cookies CNIL | `components/cookie-banner/CookieBanner.tsx` | ✅ Accepter/Refuser/Personnaliser — conforme |
| Politique cookies | `app/(public)/politique-cookies/page.tsx` | ✅ Granulaire, tableau complet |
| Politique confidentialité | `app/(public)/politique-confidentialite/page.tsx` + `app/(public)/confidentialite/page.tsx` | ✅ Art. 13-14, droits complets |
| Mentions légales | `app/(public)/mentions-legales/page.tsx` | ✅ LCEN conforme |
| API droit à l&apos;oubli | `app/api/rgpd/data-delete/route.ts` | ✅ Délai 7j confirmation + 30j suppression |
| API portabilité | `app/api/rgpd/data-export/route.ts` | ✅ JSON + CSV, validité 7j |
| Consentement cookies | `app/api/rgpd/consent/route.ts` | ✅ GET/PUT fonctionnel |
| En-têtes sécurité HTTP | `next.config.js` | ✅ HSTS, CSP, X-Frame-Options, Permissions-Policy |
| .env.local hors git | `.gitignore` ligne `.env.local` | ✅ Clés Firebase non exposées |
| Aucune clé réelle hardcodée | Source code | ✅ Les `sk_live_` trouvées sont des données mock UI |
| Formulaire inscription public | `app/(public)/inscription/` | ✅ Lien politique de confidentialité |
| Formulaire contact public | `app/(public)/contact/` | ✅ Checkbox consentement RGPD |
| Argon2id mots de passe | `backend/src/modules/auth/` | ✅ Hash robuste |
| Données santé — politique | `politique-confidentialite/page.tsx` | ✅ Suppression J+30, consentement documenté |
| Sous-traitants DPA | Politique confidentialité | ✅ Stripe, Scaleway, Brevo |

---

## Prochaines actions recommandées

1. **Immédiat** (cette semaine) : SECU-001 + SECU-002 — bloquants prod
2. **Semaine 1** : SECU-003, SECU-004, SECU-006, SECU-007, SECU-008
3. **Ce mois** : SECU-005, SECU-009, SECU-010, SECU-011, SECU-012, SECU-013

---

## Référence — Fichiers RGPD clés

```
frontend/components/cookie-banner/CookieBanner.tsx         ← Bandeau CNIL
frontend/components/cookie-banner/CookiePreferencesModal.tsx ← Modal préférences
frontend/hooks/useCookieConsent.ts                         ← Hook consentement
frontend/app/(public)/politique-confidentialite/page.tsx   ← Politique RGPD
frontend/app/(public)/politique-cookies/page.tsx           ← Politique cookies
frontend/app/(public)/mentions-legales/page.tsx            ← Mentions LCEN
frontend/app/api/rgpd/data-delete/route.ts                 ← Art. 17 oubli
frontend/app/api/rgpd/data-export/route.ts                 ← Art. 20 portabilité
frontend/app/api/rgpd/consent/route.ts                     ← Consentement
frontend/app/(avocat)/avocat/rgpd/page.tsx                 ← Registre traitements
backend/src/modules/auth/auth.service.ts:76                ← ⚠️ JWT fallback à corriger
```
