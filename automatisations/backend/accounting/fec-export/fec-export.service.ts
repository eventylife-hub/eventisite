import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../automations/audit-log.service';

export interface FecExportResult {
  year: number;
  fileUrl: string;
  fileName: string;
  linesWritten: number;
  bytesWritten: number;
  generatedAt: Date;
}

interface FecLine {
  JournalCode: string;
  JournalLib: string;
  EcritureNum: string;
  EcritureDate: string; // YYYYMMDD
  CompteNum: string;
  CompteLib: string;
  CompAuxNum: string;
  CompAuxLib: string;
  PieceRef: string;
  PieceDate: string;
  EcritureLib: string;
  Debit: string;
  Credit: string;
  EcritureLet: string;
  DateLet: string;
  ValidDate: string;
  Montantdevise: string;
  Idevise: string;
}

const FEC_HEADER = [
  'JournalCode',
  'JournalLib',
  'EcritureNum',
  'EcritureDate',
  'CompteNum',
  'CompteLib',
  'CompAuxNum',
  'CompAuxLib',
  'PieceRef',
  'PieceDate',
  'EcritureLib',
  'Debit',
  'Credit',
  'EcritureLet',
  'DateLet',
  'ValidDate',
  'Montantdevise',
  'Idevise',
].join('|');

@Injectable()
export class FecExportService {
  private readonly logger = new Logger(FecExportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  async exportYear(year: number): Promise<FecExportResult> {
    const from = new Date(year, 0, 1);
    const to = new Date(year, 11, 31, 23, 59, 59);

    const lines: FecLine[] = [];
    let ecritureNum = 1;

    // 1. Ventes (factures clients)
    const invoices = await this.prisma.invoice.findMany({
      where: { issuedAt: { gte: from, lte: to } },
      include: { client: true },
    });
    for (const inv of invoices) {
      const dateStr = this.toFecDate(inv.issuedAt);
      const num = String(ecritureNum++).padStart(8, '0');
      lines.push({
        JournalCode: 'VTE',
        JournalLib: 'Ventes',
        EcritureNum: num,
        EcritureDate: dateStr,
        CompteNum: '411000',
        CompteLib: 'Clients',
        CompAuxNum: this.compteAux(inv.clientId),
        CompAuxLib: this.compAuxLib(inv.client),
        PieceRef: inv.invoiceNumber,
        PieceDate: dateStr,
        EcritureLib: `Vente voyage ${inv.invoiceNumber}`,
        Debit: this.toFecAmount(Number(inv.totalAmountEur)),
        Credit: '0,00',
        EcritureLet: '',
        DateLet: '',
        ValidDate: dateStr,
        Montantdevise: '',
        Idevise: '',
      });
      lines.push({
        JournalCode: 'VTE',
        JournalLib: 'Ventes',
        EcritureNum: num,
        EcritureDate: dateStr,
        CompteNum: '706100',
        CompteLib: 'Prestations voyages — TVA marge',
        CompAuxNum: '',
        CompAuxLib: '',
        PieceRef: inv.invoiceNumber,
        PieceDate: dateStr,
        EcritureLib: `Vente voyage ${inv.invoiceNumber}`,
        Debit: '0,00',
        Credit: this.toFecAmount(Number(inv.totalAmountEur)),
        EcritureLet: '',
        DateLet: '',
        ValidDate: dateStr,
        Montantdevise: '',
        Idevise: '',
      });
    }

    // 2. Achats (factures fournisseurs)
    const supplierInvoices = await this.prisma.supplierInvoice.findMany({
      where: { issuedAt: { gte: from, lte: to } },
      include: { supplier: true },
    });
    for (const sup of supplierInvoices) {
      const dateStr = this.toFecDate(sup.issuedAt);
      const num = String(ecritureNum++).padStart(8, '0');
      lines.push({
        JournalCode: 'ACH',
        JournalLib: 'Achats',
        EcritureNum: num,
        EcritureDate: dateStr,
        CompteNum: this.supplierAccount(sup.supplier.kindof),
        CompteLib: this.supplierAccountLib(sup.supplier.kindof),
        CompAuxNum: '',
        CompAuxLib: '',
        PieceRef: sup.invoiceRef,
        PieceDate: dateStr,
        EcritureLib: `Achat ${sup.supplier.name}`,
        Debit: this.toFecAmount(Number(sup.totalAmountEur)),
        Credit: '0,00',
        EcritureLet: '',
        DateLet: '',
        ValidDate: dateStr,
        Montantdevise: '',
        Idevise: '',
      });
      lines.push({
        JournalCode: 'ACH',
        JournalLib: 'Achats',
        EcritureNum: num,
        EcritureDate: dateStr,
        CompteNum: '401000',
        CompteLib: 'Fournisseurs',
        CompAuxNum: this.compteAux(sup.supplierId),
        CompAuxLib: sup.supplier.name,
        PieceRef: sup.invoiceRef,
        PieceDate: dateStr,
        EcritureLib: `Achat ${sup.supplier.name}`,
        Debit: '0,00',
        Credit: this.toFecAmount(Number(sup.totalAmountEur)),
        EcritureLet: '',
        DateLet: '',
        ValidDate: dateStr,
        Montantdevise: '',
        Idevise: '',
      });
    }

    // 3. Encaissements
    const payments = await this.prisma.payment.findMany({
      where: { paidAt: { gte: from, lte: to }, status: 'succeeded' },
    });
    for (const p of payments) {
      const dateStr = this.toFecDate(p.paidAt);
      const num = String(ecritureNum++).padStart(8, '0');
      lines.push({
        JournalCode: 'BNQ',
        JournalLib: 'Banque',
        EcritureNum: num,
        EcritureDate: dateStr,
        CompteNum: '512000',
        CompteLib: 'Banque',
        CompAuxNum: '',
        CompAuxLib: '',
        PieceRef: p.providerRef ?? p.id,
        PieceDate: dateStr,
        EcritureLib: `Encaissement Stripe ${p.providerRef ?? ''}`,
        Debit: this.toFecAmount(Number(p.amountEur)),
        Credit: '0,00',
        EcritureLet: '',
        DateLet: '',
        ValidDate: dateStr,
        Montantdevise: '',
        Idevise: '',
      });
      lines.push({
        JournalCode: 'BNQ',
        JournalLib: 'Banque',
        EcritureNum: num,
        EcritureDate: dateStr,
        CompteNum: '411000',
        CompteLib: 'Clients',
        CompAuxNum: this.compteAux(p.clientId ?? ''),
        CompAuxLib: '',
        PieceRef: p.providerRef ?? p.id,
        PieceDate: dateStr,
        EcritureLib: `Encaissement ${p.providerRef ?? ''}`,
        Debit: '0,00',
        Credit: this.toFecAmount(Number(p.amountEur)),
        EcritureLet: '',
        DateLet: '',
        ValidDate: dateStr,
        Montantdevise: '',
        Idevise: '',
      });
    }

    const fileName = `EVT-FEC-${year}.txt`;
    const content = [FEC_HEADER, ...lines.map((l) => this.serializeLine(l))].join('\r\n');
    const buf = Buffer.concat([Buffer.from('﻿', 'utf8'), Buffer.from(content, 'utf8')]);

    const fileUrl = await this.uploadToStorage(fileName, buf);

    await this.prisma.fecExport.create({
      data: {
        year,
        fileName,
        fileUrl,
        linesWritten: lines.length,
        bytesWritten: buf.length,
        generatedAt: new Date(),
      },
    });

    await this.audit.log({
      entityType: 'fec-export',
      entityId: String(year),
      action: 'created',
      afterState: { year, linesWritten: lines.length, fileUrl },
    });

    await this.notifyAccountant(year, fileUrl, lines.length);

    return {
      year,
      fileUrl,
      fileName,
      linesWritten: lines.length,
      bytesWritten: buf.length,
      generatedAt: new Date(),
    };
  }

  private serializeLine(l: FecLine): string {
    return [
      l.JournalCode,
      l.JournalLib,
      l.EcritureNum,
      l.EcritureDate,
      l.CompteNum,
      l.CompteLib,
      l.CompAuxNum,
      l.CompAuxLib,
      l.PieceRef,
      l.PieceDate,
      l.EcritureLib,
      l.Debit,
      l.Credit,
      l.EcritureLet,
      l.DateLet,
      l.ValidDate,
      l.Montantdevise,
      l.Idevise,
    ].join('|');
  }

  private toFecDate(d: Date): string {
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  }

  private toFecAmount(n: number): string {
    return n.toFixed(2).replace('.', ',');
  }

  private compteAux(id: string): string {
    return id ? id.slice(0, 17) : '';
  }

  private compAuxLib(client: { firstName?: string | null; lastName?: string | null } | null) {
    if (!client) return '';
    return `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim();
  }

  private supplierAccount(kindof: string | null | undefined): string {
    switch (kindof) {
      case 'transport':
        return '624000';
      case 'hotel':
        return '622600';
      case 'restaurant':
        return '622700';
      case 'activity':
        return '628000';
      case 'insurance':
        return '616000';
      default:
        return '622000';
    }
  }

  private supplierAccountLib(kindof: string | null | undefined): string {
    switch (kindof) {
      case 'transport':
        return 'Transport';
      case 'hotel':
        return 'Hébergement';
      case 'restaurant':
        return 'Restauration';
      case 'activity':
        return 'Activités';
      case 'insurance':
        return 'Assurances';
      default:
        return 'Achats prestations';
    }
  }

  private async uploadToStorage(fileName: string, buffer: Buffer): Promise<string> {
    // Stub : remplacer par upload S3 / Scaleway Object Storage
    return `https://files.eventy.fr/fec/${fileName}`;
  }

  private async notifyAccountant(year: number, fileUrl: string, lines: number) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'admin', notifyAccounting: true },
    });
    for (const admin of admins) {
      await this.prisma.outboundEmail.create({
        data: {
          to: admin.email,
          template: 'fec-export-yearly',
          variables: { year, fileUrl, lines },
          status: 'queued',
        },
      });
    }
  }
}
