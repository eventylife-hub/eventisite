# TODO Archivage — Eventy
> Système d'archivage légal et opérationnel à mettre en place — Audit 25/04/2026

---

## Contexte légal — Durées de conservation obligatoires

### Documents comptables (Art. L.123-22 Code de commerce)
| Type document | Durée légale | Base légale |
|---------------|-------------|-------------|
| Livres comptables & journaux | **10 ans** | Art. L.123-22 C.com |
| Pièces justificatives (factures) | **10 ans** | Art. L.123-22 C.com |
| Grand Livre + Balance | **10 ans** | Art. L.123-22 C.com |
| Déclarations TVA (CA3) | **6 ans** | LPF Art. L.169 |
| Liasses fiscales (2050, 2052) | **10 ans** | CGI Art. 1749 A |
| Bulletins de paie | **5 ans** | Art. L.3243-4 C.trav |
| Contrats commerciaux | **5 ans** | Art. L.110-4 C.com |
| Dossiers clients voyages | **3 ans** | RGPD + politique confidentialité |
| Données personnelles comptabilité | **10 ans** | RGPD + obligation légale |

### Documents spécifiques tourisme
| Type document | Durée | Base légale |
|---------------|-------|-------------|
| Contrats voyages à forfait | **5 ans** | Art. L.211-16 C.tourisme |
| Documents assurance voyages | **5 ans** | Code des assurances |
| Attestations guides/chauffeurs | **3 ans** | Obligation prudence |
| Bordereaux cotisations APST | **10 ans** | Garantie financière |

---

## P0 — INFRASTRUCTURE D'ARCHIVAGE (avant lancement)

### [AR-01] Stockage immuable S3-compatible (P0)
- **Problème** : Aucun système d'archivage légal en place
- **Solution** : Scaleway Object Storage (bucket dédié `eventy-archives`) avec :
  - **Object Lock / WORM** (Write Once Read Many) — immutabilité réglementaire
  - Versioning activé (empêche suppression accidentelle)
  - Lifecycle rules : archivage froid après 1 an → Glacier après 3 ans
  - Chiffrement AES-256 at-rest + TLS en transit
  - Bucket distinct du bucket production (isolation)
- **Coût estimé** : ~8-15 €/mois pour 500 Go
- **Backend** : Module NestJS `ArchivageModule` à créer

### [AR-02] Archivage automatique des factures (P0)
- **Déclencheur** : À chaque émission de facture (statut PAYEE)
- **Processus** :
  1. Génération PDF/A-3 (format archivage légal)
  2. Calcul hash SHA-256 de l'original
  3. Upload S3 avec metadata (date, ID, type, hash)
  4. Enregistrement en BDD (chemin S3 + hash + timestamp)
  5. Immutabilité : jamais de modification, uniquement avoir
- **Format** : PDF/A-3 (ISO 19005-3) — requis pour archivage légal
- **Backend** : Trigger sur changement statut facture

### [AR-03] FEC automatique (P0)
- **Obligation** : Fichier des Écritures Comptables (Art. A.47 A-1 LPF)
- **Format** : UTF-8, pipe-separated, 18 champs obligatoires
- **Génération** : Mensuelle + à la clôture de l'exercice
- **Archivage** : FEC signé + horodaté déposé sur S3
- **Disponibilité** : Export immédiat en cas de contrôle fiscal (Art. L.47 A LPF)
- **Backend** : Endpoint `/admin/finance/fec/generate?period=YYYY-MM`

---

## P1 — ARCHIVAGE OPÉRATIONNEL (< 30 jours)

### [AR-04] Archivage des emails transactionnels (P1)
- **Contenu** : Confirmations réservation, factures envoyées, communications contractuelles
- **Durée** : 5 ans (valeur contractuelle)
- **Solution** : Export mensuel depuis Resend/Brevo + archivage S3
- **Méta-données** : destinataire, objet, date, ID réservation, statut envoi

### [AR-05] Archive ZIP clôture mensuelle (P1)
- **Contenu** :
  - Grand Livre du mois
  - Journal des ventes, achats, trésorerie
  - Balance générale
  - FEC du mois
  - TVA marge du trimestre (si applicable)
  - Relevés bancaires rapprochés
  - Factures clients payées
  - Factures fournisseurs validées
- **Format** : ZIP signé numériquement (PAdES ou CAdES)
- **Archivage** : S3 `eventy-archives/cloture/YYYY-MM/`
- **Accès** : Comptable + PDG uniquement (RBAC)
- **Déclencheur** : Validation clôture mensuelle par PDG

### [AR-06] Archivage contrats & documents juridiques (P1)
- **Contenu** :
  - Contrats CGV acceptés par clients (avec timestamp + IP)
  - Contrats indépendants signés
  - Contrats HRA partenaires
  - Attestations assurance
  - Statuts SAS + K-bis
  - Décisions AGE/AGO
- **Preuves d'acceptation** : Timestamp serveur + empreinte IP + hash CGV version
- **Durée** : 10 ans pour contrats commerciaux

### [AR-07] Purge RGPD automatique (P1)
- **Problème** : Les durées de rétention varient selon le type de données (voir politique confidentialité)
- **Actions automatiques** :
  - Données personnelles voyage : suppression J+3ans après fin voyage
  - Documents identité : suppression J+30 après voyage
  - Données santé : suppression J+30 après voyage
  - Comptes inactifs : suppression M+26 après dernière connexion
  - Logs navigation : suppression M+13
- **Mise en oeuvre** : Job CRON NestJS quotidien avec dry-run + rapport
- **Audit** : Log de chaque suppression (quoi, quand — sans données personnelles)

---

## P2 — ARCHIVAGE AVANCÉ (< 60 jours)

### [AR-08] Horodatage qualifié (eIDAS) (P2)
- **Utilité** : Preuve légale de l'existence d'un document à une date donnée
- **Cas d'usage** : Litige client, contrôle fiscal, contestation
- **Solution** : Service TSA (Time Stamp Authority) qualifié eIDAS
  - CertEurope, Universign, Certigna, DocuSign
  - Format RFC 3161
- **Coût** : ~50-200 €/an selon volume

### [AR-09] Signature électronique contrats (P2)
- **Utilité** : Contrats indépendants, devis acceptés, CGV B2B
- **Solution** : YouSign (français, conforme eIDAS), DocuSign, ou Universign
- **Intégration** : Webhook sur signature → archivage automatique S3
- **Valeur légale** : Niveau simple (Art. 1366 Code civil) ou qualifiée (eIDAS)

### [AR-10] Dashboard archivage (P2)
- **Créer** : `frontend/app/(admin)/admin/archivage/page.tsx`
- **Contenu** :
  - Taille archives par catégorie (graphique)
  - Documents en cours d'archivage vs archivés
  - Alertes expiration (documents dont la purge approche)
  - Log des accès (qui a consulté quoi)
  - Statut des jobs CRON d'archivage
  - Espace utilisé / disponible sur S3
  - Bouton "Export complet" pour contrôle fiscal
- **Accès** : Admin + Comptable uniquement

### [AR-11] Plan de continuité archivage (P2)
- **Documentation** :
  - Procédure en cas de perte d'accès S3
  - Sauvegarde cross-région (Scaleway Paris + Amsterdam)
  - RTO (Recovery Time Objective) : < 4h
  - RPO (Recovery Point Objective) : < 24h
  - Test restauration trimestriel

### [AR-12] Archivage des paiements Stripe (P2)
- **Obligation** : Preuve paiement 10 ans (Code monétaire et financier)
- **Contenu** :
  - Charge ID Stripe + statut + montant + date
  - Relevé Stripe mensuel (CSV)
  - Remboursements avec justificatif
- **Automatisation** : Webhook Stripe → archivage immédiat

---

## P3 — AMÉLIORATION

### [AR-13] Archivage cold storage (P3)
- Documents > 3 ans → migration automatique vers Scaleway Glacier
- Économies stockage : ~80% moins cher
- Délai récupération acceptable (< 12h pour documents anciens)

### [AR-14] Recherche full-text archives (P3)
- Indexation ElasticSearch des métadonnées archives
- Recherche par client, montant, période, type document
- Utile lors de contrôle fiscal ou litige

### [AR-15] Rapport d'archivage annuel (P3)
- Document récapitulatif adressé au commissaire aux comptes si applicable
- Attestation du volume archivé + intégrité (hash)
- Signature PDG + comptable

---

## Architecture recommandée

```
                    ┌─────────────────────────────────┐
                    │     Eventy Backend (NestJS)      │
                    │                                  │
  Événement ───────►│  ArchivageService                │
  (Facture PAID,    │   ├─ generatePDF_A3()            │
   Clôture validée, │   ├─ calculateSHA256()           │
   Contrat signé)   │   ├─ uploadToS3(worm=true)       │
                    │   └─ logArchivageEvent()         │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │  Scaleway Object Storage S3      │
                    │  Bucket: eventy-archives         │
                    │  Object Lock: COMPLIANCE mode    │
                    │  Versioning: enabled             │
                    │  Encryption: AES-256             │
                    │                                  │
                    │  /factures/YYYY/MM/EV-XXXX.pdf   │
                    │  /fec/YYYY-MM-fec.txt            │
                    │  /cloture/YYYY-MM/archive.zip    │
                    │  /contrats/YYYY/client-ID.pdf    │
                    └─────────────────────────────────┘
```

---

## Checklist archivage avant lancement

- [ ] Bucket S3 Scaleway créé avec Object Lock activé
- [ ] Module NestJS ArchivageModule créé
- [ ] Archivage automatique factures configuré
- [ ] Job CRON purge RGPD en place
- [ ] FEC automatique mensuel
- [ ] Archive ZIP clôture configurée
- [ ] Dashboard archivage créé
- [ ] Tests de restauration effectués
- [ ] Documentation procédure archivage rédigée

---
*Audit réalisé le 25/04/2026 — Révision trimestrielle recommandée*
