# Recommandations — Sécurisation Module Uploads

**Date:** 2026-03-13
**Priorité:** Non-bloquante pour MVP

---

## Phase 1 (MVP) — ✅ COMPLET

Aucune action requise. Le module est sécurisé tel quel.

---

## Phase 2 (Post-MVP) — Recommandé

### 1. Intégrer VirusTotal API (PRIORITÉ MOYENNE)

**Raison:** Détecter malware/ransomware dans fichiers PDF et vidéos

**Implémentation:**

```typescript
// uploads.service.ts — Ajouter dans confirmUpload() après magic bytes check

async confirmUpload(assetId: string, userId: string): Promise<void> {
  // ... validations existantes ...

  // SÉCURITÉ — Antivirus scan pour fichiers sensibles
  if (['application/pdf', 'video/mp4'].includes(fileAsset.mimeType)) {
    const isSafe = await this.antivirusService.scan(fileAsset.storageKey);
    if (!isSafe) {
      this.logger.warn(`Fichier malveillant détecté: ${assetId}`);
      await this.s3Service.deleteObject(fileAsset.storageKey);
      await this.prismaService.fileAsset.delete({ where: { id: assetId } });
      throw new BadRequestException('Fichier contient du contenu malveillant');
    }
  }

  // Mettre à jour statut
  await this.prismaService.fileAsset.update({
    where: { id: assetId },
    data: { status: FileAssetStatus.CONFIRMED, confirmedAt: new Date() },
  });
}
```

**Service antivirus (nouveau fichier):**

```typescript
// uploads/antivirus.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

@Injectable()
export class AntivirusService {
  private readonly logger = new Logger(AntivirusService.name);

  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

  async scan(storageKey: string): Promise<boolean> {
    try {
      // Récupérer le fichier depuis S3
      const buffer = await this.s3Service.getObjectRange(storageKey, 0, 1000000); // 1MB max

      // Appeler VirusTotal API
      const response = await fetch('https://www.virustotal.com/api/v3/files', {
        method: 'POST',
        headers: {
          'x-apikey': this.configService.get<string>('VIRUSTOTAL_API_KEY'),
        },
        body: new FormData(), // Inclure le fichier
      });

      const result = await response.json();

      // Vérifier score (stats.malicious)
      const isSafe = result.data.attributes.stats.malicious === 0;

      if (!isSafe) {
        this.logger.warn(`VirusTotal detected threat in ${storageKey}`);
      }

      return isSafe;
    } catch (error) {
      // Si API fail, logger et continuer (ne pas bloquer)
      this.logger.warn(`VirusTotal scan failed: ${error}`);
      return true; // Défaut: permettre si API indisponible
    }
  }
}
```

**Configuration `.env`:**
```bash
VIRUSTOTAL_API_KEY=your_api_key_here
```

**Coût:** Gratuit jusqu'à 500 requêtes/jour (ample pour MVP)

---

### 2. Réduire download URL expiry (PRIORITÉ BASSE)

**Raison:** Limiter la fenêtre d'exploitation si presigned URL est compromise

**Change:**

```typescript
// uploads.service.ts — getAsset()

// Ancien: 3600s (1h)
// Nouveau: 600s (10 min)
const downloadUrl = await this.s3Service.getSignedDownloadUrl(
  fileAsset.storageKey,
  600, // 10 minutes au lieu de 1h
);
```

**Impact:** Utilisateurs doivent télécharger dans 10 minutes (acceptable)

---

### 3. Audit logging fichiers suspects (PRIORITÉ BASSE)

**Raison:** Détecter patterns d'attaque et répondre aux incidents

**Implémentation:**

```typescript
// uploads.service.ts — Ajouter logging dans confirmUpload()

// Si magic bytes invalides
this.logger.warn(
  `SECURITY: Invalid magic bytes detected - userId: ${userId}, ` +
  `filename: ${fileAsset.filename}, mimeType: ${fileAsset.mimeType}, ` +
  `assetId: ${assetId}, timestamp: ${new Date().toISOString()}`,
);

// Si antivirus détecte menace
this.logger.warn(
  `SECURITY: Malware detected by VirusTotal - userId: ${userId}, ` +
  `filename: ${fileAsset.filename}, storageKey: ${fileAsset.storageKey}, ` +
  `assetId: ${assetId}, timestamp: ${new Date().toISOString()}`,
);
```

**Utiliser pour:**
- Alerter si même user upload plusieurs fichiers suspects
- Rate limiting plus agressif pour utilisateurs malveillants
- Signaler à équipe sécurité Eventy

---

## Phase 3+ (Optimisations)

### Scan metadata vidéo
Valider dimension, durée, codec avec FFprobe.

### Compression images
Réduire taille stockage S3 via Sharp après confirmation.

### Versioning fichiers
Garder historique uploads pour audit/recovery.

---

## Checklist sécurité pour lancement production

- [ ] VirusTotal API key configurée en env
- [ ] AntivirusService intégré dans UploadModule
- [ ] Download URL expiry réduit à 600s
- [ ] Audit logging en place pour fichiers suspects
- [ ] Tests end-to-end pour antivirus (fichier benin vs eicar test)
- [ ] Monitoring VirusTotal API quota
- [ ] Documentation user: max file size + formats acceptés
- [ ] S3 bucket access logs enabled
- [ ] CloudTrail logging enabled

---

**Assistant IA — Eventy PDG**
2026-03-13
