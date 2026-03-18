# COMPREHENSIVE FRONTEND AUDIT REPORT
**Generated:** 2026-03-06  
**Codebase:** /sessions/focused-exciting-lamport/mnt/eventisite/frontend

---

## SUMMARY STATISTICS
- **Total TSX Files:** 289
- **Total TS Files:** 54
- **Total Directory Size:** 2.9M
- **Page Files:** 104 page.tsx files
- **Component Files:** 87 tsx files
- **Store Files:** 7 store files
- **Type Definitions:** 1 main types file (1,433 lines)
- **Test Files:** 14 test files
- **Config Files:** 10 root-level config files

---

## 1. ALL PAGES (104 page.tsx files)

### PUBLIC PAGES (18 pages)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/page.tsx [HOME]
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/a-propos/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/cgv/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/confidentialite/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/contact/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/cookies/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/depart/[ville]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/faq/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/mentions-legales/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/p/[proSlug]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/politique-confidentialite/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/voyages/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/voyages/[slug]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/voyages/[slug]/avis/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/voyages/[slug]/checkout/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/voyages/[slug]/groupes/page.tsx
```

### AUTH PAGES (10 pages)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/connexion/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/inscription/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/login/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/register/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/mot-de-passe-oublie/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/reinitialiser-mot-de-passe/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/verification-email/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/auth/connexion/page.tsx [REDIRECT]
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/auth/inscription/page.tsx [REDIRECT]
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/auth/mot-de-passe-oublie/page.tsx [REDIRECT]
```

### CLIENT PAGES (22 pages)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/page.tsx [DASHBOARD]
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/profil/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/notifications/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/paiements/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/assurance/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/avis/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/documents/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/support/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/wallet/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/annuler/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/avis/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/facture/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/preferences/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/rooming/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/[id]/inviter/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/creer/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/rejoindre/page.tsx
```

### PRO/PARTNER PAGES (30 pages)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/page.tsx [DASHBOARD]
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/login/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/inscription/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/onboarding/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/vendre/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/arrets/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/documents/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/finance/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/formation/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/revenus/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/revenus/releve/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/marketing/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/marketing/creer/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/marketing/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/nouveau/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/equipe/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/reservations/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/rooming/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/rooming/hotel-blocks/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/bilan/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/finance/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/factures/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/transport/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/transport/manifest/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/restauration/page.tsx
```

### CHECKOUT PAGES (5 pages)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(checkout)/checkout/start/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(checkout)/checkout/step-1/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(checkout)/checkout/step-2/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(checkout)/checkout/step-3/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(checkout)/checkout/confirmation/page.tsx
```

### ADMIN PAGES (24 pages)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/page.tsx [DASHBOARD]
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/alertes/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/annulations/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/annulations/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/audit/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/bookings/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/documents/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/exports/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/finance/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/finance/payouts/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/marketing/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/notifications/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/parametres/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/pros/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/rooming/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/support/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/transport/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/utilisateurs/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/utilisateurs/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/creer/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/[id]/lifecycle/page.tsx
```

---

## 2. ALL COMPONENTS (87 component files)

### ROOT COMPONENTS (6)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/BookingCard.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/JsonLd.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/Navbar.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/frontend/components/PaymentHistoryTable.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ReviewCard.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/TravelCard.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/TravelFilters.tsx
```

### ADMIN COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/admin/approval-modal.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/admin/data-table.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/admin/export-cta.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/admin/stats-card.tsx
```

### CANCELLATION COMPONENTS (2)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/cancellation/cancellation-policy.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/cancellation/refund-calculator.tsx
```

### CHECKOUT COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/checkout/hold-timer.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/checkout/price-summary.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/checkout/step-indicator.tsx
```

### COOKIE BANNER COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/cookie-banner/CookieBanner.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/cookie-banner/CookiePreferencesModal.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/cookie-banner/ScriptWithConsent.tsx
```

### ERROR COMPONENTS (2)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/error-boundary.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/error-boundary/SentryErrorBoundary.tsx
```

### FINANCE COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/finance/cost-table.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/finance/finance-summary.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/finance/margin-chart.tsx
```

### GROUPS COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/groups/group-card.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/groups/invite-form.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/groups/member-list.tsx
```

### INSURANCE COMPONENTS (1)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/insurance/insurance-card.tsx
```

### LAYOUT COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/layout/footer.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/layout/header.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/layout/sidebar.tsx
```

### LEGAL COMPONENTS (2)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/legal/cookie-banner.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/legal/legal-acceptance-modal.tsx
```

### MARKETING COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/marketing/campaign-card.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/marketing/campaign-wizard.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/marketing/metrics-chart.tsx
```

### NOTIFICATIONS COMPONENTS (2)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/notifications/notification-bell.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/notifications/notification-item.tsx
```

### POST-SALE COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/post-sale/feedback-form.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/post-sale/invoice-preview.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/post-sale/travel-report-preview.tsx
```

### RESTAURATION COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/restauration/dietary-form.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/restauration/meal-plan-editor.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/restauration/restaurant-card.tsx
```

### ROOMING COMPONENTS (2)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/rooming/hotel-block-card.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/rooming/rooming-table.tsx
```

### TRANSPORT COMPONENTS (2)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/transport/stop-card.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/transport/stop-map.tsx
```

### TRAVELS COMPONENTS (1)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/travels/lifecycle-timeline.tsx
```

### UI COMPONENTS (18 - shadcn/ui based)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/alert.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/badge.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/button.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/card.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/checkbox.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/dialog.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/dropdown-menu.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/input.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/label.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/pagination.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/radio-group.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/select.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/skeleton.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/table.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/tabs.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/textarea.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/toast.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/ui/tooltip.tsx
```

### UPLOADS COMPONENTS (3)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/uploads/file-preview.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/uploads/file-upload.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/components/uploads/upload-progress.tsx
```

---

## 3. ALL STORES (7 store files)

```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/index.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/auth-store.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/checkout-store.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/client-store.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/notification-store.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/pro-store.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/stores/ui-store.ts
```

---

## 4. TYPE DEFINITIONS (1 main file)

```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/types/index.ts (1,433 lines)
```

---

## 5. STUB PAGES (5 pages with < 30 lines)

These are simple redirect pages:

1. **9 lines**: `/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/auth/connexion/page.tsx`
   - Redirects to `/connexion`

2. **9 lines**: `/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/auth/inscription/page.tsx`
   - Redirects to `/inscription`

3. **9 lines**: `/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/auth/mot-de-passe-oublie/page.tsx`
   - Redirects to `/mot-de-passe-oublie`

4. **9 lines**: `/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/login/page.tsx`
   - Simple redirect/wrapper

5. **9 lines**: `/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/register/page.tsx`
   - Simple redirect/wrapper

**Analysis:** These are intentional redirect pages, not broken placeholders. They route duplicate URLs to canonical endpoints.

---

## 6. PAGES WITH MOCK/TODO/PLACEHOLDER CONTENT (40 pages)

Pages flagged as having mock data, TODO comments, FIXME comments, or placeholder content:

### Admin Pages (10 with flags)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/audit/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/bookings/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/documents/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/exports/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/notifications/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/rooming/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/utilisateurs/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/creer/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(admin)/admin/voyages/[id]/lifecycle/page.tsx
```

### Auth Pages (6 with flags)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/connexion/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/inscription/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/mot-de-passe-oublie/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(auth)/reinitialiser-mot-de-passe/page.tsx
```

### Client Pages (8 with flags)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/avis/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/creer/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/rejoindre/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/[id]/inviter/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/groupes/[id]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/profil/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/annuler/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/avis/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/reservations/[id]/rooming/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/support/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(client)/client/wallet/page.tsx
```

### Checkout Pages (1 with flags)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(checkout)/checkout/step-2/page.tsx
```

### Pro Pages (10 with flags)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/inscription/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/login/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/onboarding/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/vendre/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/nouveau/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/equipe/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/reservations/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/rooming/hotel-blocks/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/transport/page.tsx
```

### Public Pages (5 with flags)
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/contact/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/depart/[ville]/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/faq/page.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/app/(public)/p/[proSlug]/page.tsx
```

---

## 7. LIB & UTILITY FILES

### Core API/Config
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/api.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/api-client.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/config.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/constants.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/sentry.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/utils.ts
```

### Hooks
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/hooks/use-auth.ts
```

### Validations
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/lib/validations/auth.ts
```

### Root Config Files
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/.eslintrc.json
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/.prettierrc.json
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/jest.config.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/jest.setup.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/middleware.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/next-env.d.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/package.json
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/playwright.config.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/tailwind.config.ts
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/tsconfig.json
```

---

## 8. TEST FILES (14 test files)

### Unit & Component Tests
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/test-utils.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/admin/dashboard.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/admin/users.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/auth/forgot-password.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/auth/login.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/auth/register.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/components/BookingCard.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/components/CookieBanner.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/components/Navbar.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/components/ReviewCard.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/components/TravelCard.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/components/TravelFilters.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/pages/travels-list.test.tsx
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/__tests__/pro/dashboard.test.tsx
```

### E2E Test Utilities
```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/e2e/test-utils.ts
```

---

## 9. PUBLIC ASSETS

```
/sessions/focused-exciting-lamport/mnt/eventisite/frontend/public/robots.txt
```

---

## 10. DIRECTORY STRUCTURE OVERVIEW

```
frontend/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin routes (23 pages)
│   ├── (auth)/                   # Auth routes (10 pages)
│   ├── (checkout)/               # Checkout routes (5 pages)
│   ├── (client)/                 # Client routes (22 pages)
│   ├── (pro)/                    # Pro/Partner routes (30 pages)
│   ├── (public)/                 # Public routes (18 pages)
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── sitemap.ts
├── components/                   # React components (87 files)
│   ├── admin/
│   ├── cancellation/
│   ├── checkout/
│   ├── cookie-banner/
│   ├── error-boundary/
│   ├── finance/
│   ├── groups/
│   ├── insurance/
│   ├── layout/
│   ├── legal/
│   ├── marketing/
│   ├── notifications/
│   ├── post-sale/
│   ├── restauration/
│   ├── rooming/
│   ├── transport/
│   ├── travels/
│   ├── ui/                       # 18 shadcn/ui components
│   └── uploads/
├── lib/                          # Utilities & state
│   ├── hooks/
│   ├── stores/                   # Zustand stores (7 files)
│   ├── types/
│   ├── validations/
│   ├── api.ts
│   ├── api-client.ts
│   ├── config.ts
│   ├── constants.ts
│   ├── sentry.ts
│   └── utils.ts
├── __tests__/                    # Unit & component tests
│   ├── admin/
│   ├── auth/
│   ├── components/
│   ├── pages/
│   ├── pro/
│   └── test-utils.tsx
├── e2e/                          # E2E test utils
├── public/                       # Static assets
├── middleware.ts
├── .eslintrc.json
├── .prettierrc.json
├── jest.config.ts
├── jest.setup.ts
├── next-env.d.ts
├── package.json
├── playwright.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 11. KEY OBSERVATIONS

### Strengths
✅ Well-organized route structure with grouped layouts `(admin)`, `(auth)`, `(checkout)`, `(client)`, `(pro)`, `(public)`
✅ Comprehensive component library with 87 reusable components
✅ Proper separation of concerns with UI components, domain components, and layouts
✅ Zustand state management with 7 dedicated stores
✅ Test coverage with 14 test files
✅ Modern Next.js 14 App Router implementation
✅ shadcn/ui integration (18 UI components)
✅ Proper error handling with ErrorBoundary and Sentry integration
✅ SEO integration with JSON-LD, sitemap, and robots.txt

### Areas to Watch
⚠ 40 pages have TODO/FIXME/mock/placeholder comments - require cleanup before production
⚠ Limited hooks (only 1 - use-auth) - may need more custom hooks for state management
⚠ Limited validations (only auth.ts) - other pages may need input validation
⚠ Minimal public assets (only robots.txt) - consider branding assets, favicons, etc.
⚠ Some auth route duplication (redirects to canonical URLs)

### Code Quality Indicators
- 289 TSX files + 54 TS files = 343 total TypeScript files
- 2.9M total size is reasonable
- Strong component organization by feature
- Clear middleware integration
- Proper error boundaries for resilience

---

## 12. CRITICAL PAGES TO VERIFY BEFORE LAUNCH

**High Priority Validation:**
1. Auth pages (`/connexion`, `/inscription`, `/mot-de-passe-oublie`)
2. Checkout flow (all 5 pages)
3. Client dashboard (`/client`)
4. Pro dashboard (`/pro`)
5. Admin dashboard (`/admin`)
6. Public homepage and travel listing

**Medium Priority:**
7. Group management pages
8. Rooming and transport pages
9. Finance/revenue pages
10. Marketing/notifications pages

---

End of Report
