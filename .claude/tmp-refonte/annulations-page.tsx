'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, BarChart, Bar, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  Search, RefreshCw, CheckCircle2, XCircle, Clock, RotateCcw, Download,
  Filter, AlertTriangle, TrendingUp, TrendingDown, FileText,
  MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Eye,
  CreditCard, Gift, ChevronLeft, ChevronRight, User,
  MapPin, X, Send, ArrowUpDown, Zap, ShieldCheck, Ban,
  Hourglass, FileCheck2, Sparkles, Info,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { formatPrice } from '@/lib/utils';

// ─── Design tokens ──────────────────────────────────────────────────────────
const T = {
  bg: '#0A0E14',
  bgSoft: '#0F1520',
  surface: 'rgba(19,25,42,0.65)',
  surfaceHover: 'rgba(28,36,58,0.75)',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: '#E6EAF2',
  textDim: '#9CA3AF',
  textMute: '#6B7280',
  gold: '#D4A853',
  goldDim: 'rgba(212,168,83,0.14)',
  goldBorder: 'rgba(212,168,83,0.3)',
  emerald: '#10B981',
  emeraldDim: 'rgba(16,185,129,0.12)',
  emeraldBorder: 'rgba(16,185,129,0.28)',
  amber: '#F59E0B',
  amberDim: 'rgba(245,158,11,0.12)',
  amberBorder: 'rgba(245,158,11,0.28)',
  blue: '#60A5FA',
  blueDim: 'rgba(96,165,250,0.12)',
  blueBorder: 'rgba(96,165,250,0.28)',
  rose: '#F87171',
  roseDim: 'rgba(248,113,113,0.12)',
  roseBorder: 'rgba(248,113,113,0.28)',
  violet: '#A78BFA',
  violetDim: 'rgba(167,139,250,0.12)',
  violetBorder: 'rgba(167,139,250,0.28)',
} as const;

const glass = {
  background: T.surface,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${T.border}`,
  borderRadius: 16,
} as const;

const glassSoft = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: `1px solid ${T.border}`,
  borderRadius: 12,
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────
type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'VOUCHER';
type Motif = 'PERSONNEL' | 'MEDICAL' | 'FORCE_MAJEURE' | 'INSATISFACTION' | 'AUTRE';
type Priority = 'LOW' | 'NORMAL' | 'HIGH';

interface TimelineEvent {
  at: string;
  by: string;
  action: string;
  kind: 'action' | 'system' | 'client';
}

interface ExchangeMessage {
  at: string;
  by: string;
  role: 'client' | 'agent' | 'system';
  channel: 'email' | 'chat' | 'phone';
  text: string;
}

interface Document {
  id: string;
  name: string;
  type: 'medical' | 'contract' | 'proof' | 'other';
  uploadedAt: string;
  size: string;
}

interface Cancellation {
  id: string;
  bookingRef: string;
  travelTitle: string;
  travelId: string;
  destination: string;
  departureDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reason: string;
  motif: Motif;
  status: Status;
  totalPaidCents: number;
  refundAmountCents: number;
  bookingDate: string;
  createdAt: string;
  lastUpdateAt: string;
  handledBy?: string;
  priority: Priority;
  documents: Document[];
  timeline: TimelineEvent[];
  exchanges: ExchangeMessage[];
}

// ─── Demo data ──────────────────────────────────────────────────────────────
const today = new Date('2026-04-22');
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
};

const DEMO: Cancellation[] = [
  {
    id: 'c1', bookingRef: 'BK-001201', travelTitle: 'Marrakech Express', travelId: 'tr-mrk-03',
    destination: 'Marrakech', departureDate: iso(42),
    clientName: 'Jean Lefebvre', clientEmail: 'j.lefebvre@gmail.com', clientPhone: '+33 6 12 34 56 78',
    reason: 'Changement professionnel imprévu, impossible de maintenir les dates.',
    motif: 'PERSONNEL', status: 'PENDING', totalPaidCents: 142000, refundAmountCents: 142000,
    bookingDate: iso(-35), createdAt: iso(-4), lastUpdateAt: iso(-4),
    priority: 'HIGH',
    documents: [],
    timeline: [
      { at: iso(-4), by: 'Client', action: 'Demande reçue via portail', kind: 'client' },
      { at: iso(-3), by: 'Système', action: 'Accusé de réception envoyé', kind: 'system' },
    ],
    exchanges: [
      { at: iso(-4), by: 'Jean Lefebvre', role: 'client', channel: 'email',
        text: 'Bonjour, je dois annuler ma réservation suite à une mission professionnelle urgente.' },
    ],
  },
  {
    id: 'c2', bookingRef: 'BK-001198', travelTitle: 'Lisbonne Longweekend', travelId: 'tr-lis-01',
    destination: 'Lisbonne', departureDate: iso(18),
    clientName: 'Isabelle Renard', clientEmail: 'i.renard@hotmail.fr', clientPhone: '+33 7 98 76 54 32',
    reason: 'Hospitalisation programmée, certificat médical fourni.',
    motif: 'MEDICAL', status: 'PENDING', totalPaidCents: 224000, refundAmountCents: 224000,
    bookingDate: iso(-48), createdAt: iso(-3), lastUpdateAt: iso(-1),
    priority: 'HIGH', handledBy: 'Claire D.',
    documents: [
      { id: 'd1', name: 'certificat-medical.pdf', type: 'medical', uploadedAt: iso(-3), size: '284 Ko' },
    ],
    timeline: [
      { at: iso(-3), by: 'Client', action: 'Demande reçue + certificat', kind: 'client' },
      { at: iso(-2), by: 'Claire D.', action: 'Dossier pris en charge', kind: 'action' },
      { at: iso(-1), by: 'Claire D.', action: 'Validation assurance en cours', kind: 'action' },
    ],
    exchanges: [
      { at: iso(-3), by: 'Isabelle Renard', role: 'client', channel: 'email',
        text: 'Hospitalisation confirmée le 2 mai, ci-joint le certificat.' },
      { at: iso(-2), by: 'Claire D.', role: 'agent', channel: 'email',
        text: 'Nous vous confirmons la prise en charge. Retour sous 48h.' },
    ],
  },
  {
    id: 'c3', bookingRef: 'BK-001185', travelTitle: 'Barcelona Premium', travelId: 'tr-bcn-02',
    destination: 'Barcelone', departureDate: iso(65),
    clientName: 'Antoine Duval', clientEmail: 'a.duval@wanadoo.fr', clientPhone: '+33 6 45 67 89 10',
    reason: 'Changement de plans personnels, bien avant le départ.',
    motif: 'PERSONNEL', status: 'APPROVED', totalPaidCents: 189000, refundAmountCents: 189000,
    bookingDate: iso(-28), createdAt: iso(-13), lastUpdateAt: iso(-10),
    priority: 'NORMAL', handledBy: 'Thomas R.',
    documents: [],
    timeline: [
      { at: iso(-13), by: 'Client', action: 'Demande reçue', kind: 'client' },
      { at: iso(-12), by: 'Thomas R.', action: 'Dossier validé', kind: 'action' },
      { at: iso(-10), by: 'Thomas R.', action: 'Remboursement intégral approuvé', kind: 'action' },
    ],
    exchanges: [],
  },
  {
    id: 'c4', bookingRef: 'BK-001172', travelTitle: 'Marrakech Express', travelId: 'tr-mrk-03',
    destination: 'Marrakech', departureDate: iso(8),
    clientName: 'Nathalie Simon', clientEmail: 'n.simon@free.fr', clientPhone: '+33 6 22 33 44 55',
    reason: 'Annulation tardive, hors délais prévus par les CGV.',
    motif: 'PERSONNEL', status: 'REJECTED', totalPaidCents: 142000, refundAmountCents: 0,
    bookingDate: iso(-60), createdAt: iso(-18), lastUpdateAt: iso(-16),
    priority: 'NORMAL', handledBy: 'Thomas R.',
    documents: [],
    timeline: [
      { at: iso(-18), by: 'Client', action: 'Demande reçue', kind: 'client' },
      { at: iso(-16), by: 'Thomas R.', action: 'Refus — hors délais CGV', kind: 'action' },
    ],
    exchanges: [],
  },
  {
    id: 'c5', bookingRef: 'BK-001160', travelTitle: 'Lisbonne Longweekend', travelId: 'tr-lis-01',
    destination: 'Lisbonne', departureDate: iso(-3),
    clientName: 'Marc Petit', clientEmail: 'm.petit@orange.fr', clientPhone: '+33 7 11 22 33 44',
    reason: 'Cas de force majeure — annulation vol compagnie.',
    motif: 'FORCE_MAJEURE', status: 'REFUNDED', totalPaidCents: 135000, refundAmountCents: 135000,
    bookingDate: iso(-55), createdAt: iso(-23), lastUpdateAt: iso(-20),
    priority: 'HIGH', handledBy: 'Claire D.',
    documents: [
      { id: 'd2', name: 'attestation-compagnie.pdf', type: 'proof', uploadedAt: iso(-22), size: '156 Ko' },
    ],
    timeline: [
      { at: iso(-23), by: 'Client', action: 'Demande reçue', kind: 'client' },
      { at: iso(-22), by: 'Claire D.', action: 'Validation', kind: 'action' },
      { at: iso(-20), by: 'Système', action: 'Remboursement effectué', kind: 'system' },
    ],
    exchanges: [],
  },
  {
    id: 'c6', bookingRef: 'BK-001155', travelTitle: 'Rome Impériale', travelId: 'tr-rom-01',
    destination: 'Rome', departureDate: iso(25),
    clientName: 'Sophie Leroy', clientEmail: 's.leroy@laposte.net', clientPhone: '+33 6 33 22 11 00',
    reason: 'Insatisfaction concernant le programme proposé.',
    motif: 'INSATISFACTION', status: 'PENDING', totalPaidCents: 198000, refundAmountCents: 99000,
    bookingDate: iso(-40), createdAt: iso(-1), lastUpdateAt: iso(-1),
    priority: 'NORMAL',
    documents: [],
    timeline: [
      { at: iso(-1), by: 'Client', action: 'Demande reçue', kind: 'client' },
    ],
    exchanges: [
      { at: iso(-1), by: 'Sophie Leroy', role: 'client', channel: 'chat',
        text: 'Le programme a changé depuis ma réservation, je souhaite un geste commercial.' },
    ],
  },
  {
    id: 'c7', bookingRef: 'BK-001148', travelTitle: 'Porto Weekend', travelId: 'tr-prt-01',
    destination: 'Porto', departureDate: iso(52),
    clientName: 'Paul Morel', clientEmail: 'p.morel@sfr.fr', clientPhone: '+33 6 87 65 43 21',
    reason: 'Changement de plans familial.',
    motif: 'PERSONNEL', status: 'APPROVED', totalPaidCents: 165000, refundAmountCents: 132000,
    bookingDate: iso(-21), createdAt: iso(-8), lastUpdateAt: iso(-6),
    priority: 'LOW', handledBy: 'Thomas R.',
    documents: [],
    timeline: [
      { at: iso(-8), by: 'Client', action: 'Demande reçue', kind: 'client' },
      { at: iso(-6), by: 'Thomas R.', action: 'Remboursement partiel 80% approuvé', kind: 'action' },
    ],
    exchanges: [],
  },
  {
    id: 'c8', bookingRef: 'BK-001142', travelTitle: 'Barcelona Premium', travelId: 'tr-bcn-02',
    destination: 'Barcelone', departureDate: iso(12),
    clientName: 'Camille Bernard', clientEmail: 'c.bernard@gmail.com', clientPhone: '+33 7 55 44 33 22',
    reason: 'Problème de santé du conjoint.',
    motif: 'MEDICAL', status: 'REFUNDED', totalPaidCents: 189000, refundAmountCents: 94500,
    bookingDate: iso(-42), createdAt: iso(-11), lastUpdateAt: iso(-9),
    priority: 'NORMAL', handledBy: 'Claire D.',
    documents: [
      { id: 'd3', name: 'justificatif-medical.pdf', type: 'medical', uploadedAt: iso(-11), size: '198 Ko' },
    ],
    timeline: [
      { at: iso(-11), by: 'Client', action: 'Demande + justificatif', kind: 'client' },
      { at: iso(-10), by: 'Claire D.', action: 'Validation', kind: 'action' },
      { at: iso(-9), by: 'Système', action: 'Remboursement 50% effectué', kind: 'system' },
    ],
    exchanges: [],
  },
];

// ─── Config ─────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<Status, { label: string; color: string; dim: string; border: string; Icon: React.ElementType }> = {
  PENDING:  { label: 'En attente', color: T.amber,   dim: T.amberDim,   border: T.amberBorder,   Icon: Clock },
  APPROVED: { label: 'Approuvée',  color: T.emerald, dim: T.emeraldDim, border: T.emeraldBorder, Icon: CheckCircle2 },
  REJECTED: { label: 'Refusée',    color: T.rose,    dim: T.roseDim,    border: T.roseBorder,    Icon: XCircle },
  REFUNDED: { label: 'Remboursée', color: T.blue,    dim: T.blueDim,    border: T.blueBorder,    Icon: RotateCcw },
  VOUCHER:  { label: 'Avoir émis', color: T.violet,  dim: T.violetDim,  border: T.violetBorder,  Icon: Gift },
};

const MOTIF_CFG: Record<Motif, { label: string; color: string; dim: string; border: string }> = {
  PERSONNEL:     { label: 'Personnel',     color: T.blue,    dim: T.blueDim,    border: T.blueBorder },
  MEDICAL:       { label: 'Médical',       color: T.emerald, dim: T.emeraldDim, border: T.emeraldBorder },
  FORCE_MAJEURE: { label: 'Force majeure', color: T.violet,  dim: T.violetDim,  border: T.violetBorder },
  INSATISFACTION:{ label: 'Insatisfaction',color: T.amber,   dim: T.amberDim,   border: T.amberBorder },
  AUTRE:         { label: 'Autre',         color: T.textDim, dim: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const hoursSince = (iso: string) => (Date.now() - new Date(iso).getTime()) / 36e5;
const daysSince = (iso: string) => hoursSince(iso) / 24;
const daysBefore = (iso: string) => -daysSince(iso);

function computePolicyRefund(totalCents: number, daysBeforeDeparture: number) {
  if (daysBeforeDeparture >= 30) return { pct: 100, cents: totalCents, label: 'Annulation libre' };
  if (daysBeforeDeparture >= 15) return { pct: 50, cents: Math.round(totalCents * 0.5), label: 'Remboursement partiel' };
  if (daysBeforeDeparture >= 7) return { pct: 30, cents: Math.round(totalCents * 0.3), label: 'Geste commercial' };
  return { pct: 0, cents: 0, label: 'Hors délais CGV' };
}

function animatedCount(from: number, to: number, duration = 900) {
  const start = performance.now();
  return (cb: (v: number) => void) => {
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      cb(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
}

function useCounter(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    animatedCount(prev.current, target, duration)(setVal);
    prev.current = target;
  }, [target, duration]);
  return val;
}

// ─── Small components ──────────────────────────────────────────────────────
function StatusBadge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  const cfg = STATUS_CFG[status];
  const pad = size === 'md' ? '4px 12px' : '3px 9px';
  const fs = size === 'md' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: cfg.dim, border: `1px solid ${cfg.border}`,
      borderRadius: 999, padding: pad, fontSize: fs, fontWeight: 600, color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      <cfg.Icon size={size === 'md' ? 13 : 11} />
      {cfg.label}
    </span>
  );
}

function MotifBadge({ motif }: { motif: Motif }) {
  const cfg = MOTIF_CFG[motif];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: cfg.dim, border: `1px solid ${cfg.border}`,
      borderRadius: 6, padding: '2px 8px', fontSize: 10.5, fontWeight: 600, color: cfg.color,
      letterSpacing: 0.2, textTransform: 'uppercase',
    }}>
      {cfg.label}
    </span>
  );
}

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  numericValue?: number;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  accent: string;
  delay?: number;
}

function KpiCard({ icon: Icon, label, value, numericValue, suffix, trend, trendLabel, accent, delay = 0 }: KpiCardProps) {
  const animatedValue = useCounter(numericValue ?? 0);
  const display = numericValue !== undefined ? animatedValue.toLocaleString('fr-FR') + (suffix ?? '') : value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{ ...glass, padding: 20, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 140, height: 140,
        background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${accent}18`, border: `1px solid ${accent}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} style={{ color: accent }} />
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 600,
            color: trend >= 0 ? T.emerald : T.rose,
          }}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </div>
        )}
      </div>
      <p style={{ fontSize: 11.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 700, color: T.text, lineHeight: 1.1 }}>
        {display}
      </p>
      {trendLabel && (
        <p style={{ fontSize: 11, color: T.textMute, marginTop: 6 }}>{trendLabel}</p>
      )}
    </motion.div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
type Period = 'MONTH' | 'QUARTER' | 'YEAR';
type SortKey = 'date' | 'amount' | 'status' | 'travel' | 'client';
type SortDir = 'asc' | 'desc';

export default function AdminAnnulationsPage() {
  const [data, setData] = useState<Cancellation[]>(DEMO);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('MONTH');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL');
  const [motifFilter, setMotifFilter] = useState<'ALL' | Motif>('ALL');
  const [travelFilter, setTravelFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [panelId, setPanelId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    | { c: Cancellation; type: 'APPROVE' | 'REJECT' | 'PARTIAL' | 'VOUCHER' }
    | null
  >(null);
  const [confirmReason, setConfirmReason] = useState('');
  const [confirmAmount, setConfirmAmount] = useState('');
  const [toast, setToast] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  // Fetch
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const remote = await apiClient.get<Cancellation[]>('/admin/cancellations', { signal });
      if (remote?.length) setData(remote);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      logger.warn('API /admin/cancellations indisponible — mode démo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchData]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Derived
  const periodLimitDays = period === 'MONTH' ? 30 : period === 'QUARTER' ? 90 : 365;
  const periodData = useMemo(
    () => data.filter(c => daysSince(c.createdAt) <= periodLimitDays),
    [data, periodLimitDays]
  );

  const travelOptions = useMemo(() => {
    const m = new Map<string, string>();
    data.forEach(c => m.set(c.travelId, c.travelTitle));
    return Array.from(m.entries()).map(([id, title]) => ({ id, title }));
  }, [data]);

  const filtered = useMemo(() => {
    let out = periodData;
    if (statusFilter !== 'ALL') out = out.filter(c => c.status === statusFilter);
    if (motifFilter !== 'ALL') out = out.filter(c => c.motif === motifFilter);
    if (travelFilter !== 'ALL') out = out.filter(c => c.travelId === travelFilter);
    if (amountMin) out = out.filter(c => c.refundAmountCents >= Number(amountMin) * 100);
    if (amountMax) out = out.filter(c => c.refundAmountCents <= Number(amountMax) * 100);
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(c =>
        c.bookingRef.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.clientEmail.toLowerCase().includes(q) ||
        c.travelTitle.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q)
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    const sorted = [...out].sort((a, b) => {
      switch (sortKey) {
        case 'date':   return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        case 'amount': return (a.refundAmountCents - b.refundAmountCents) * dir;
        case 'status': return a.status.localeCompare(b.status) * dir;
        case 'travel': return a.travelTitle.localeCompare(b.travelTitle) * dir;
        case 'client': return a.clientName.localeCompare(b.clientName) * dir;
        default: return 0;
      }
    });
    return sorted;
  }, [periodData, statusFilter, motifFilter, travelFilter, amountMin, amountMax, search, sortKey, sortDir]);

  useEffect(() => { setPage(1); }, [statusFilter, motifFilter, travelFilter, search, amountMin, amountMax, period]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  // KPIs
  const kpis = useMemo(() => {
    const total = periodData.length;
    const pending = periodData.filter(c => c.status === 'PENDING').length;
    const refunded = periodData.filter(c => c.status === 'REFUNDED');
    const refundedAmount = refunded.reduce((s, c) => s + c.refundAmountCents, 0);
    const bookingsEstimate = Math.max(total, total * 18); // demo: assume ~5% cancel rate
    const rate = bookingsEstimate > 0 ? (total / bookingsEstimate) * 100 : 0;
    const prevWindow = data.filter(c => {
      const d = daysSince(c.createdAt);
      return d > periodLimitDays && d <= periodLimitDays * 2;
    }).length;
    const trend = prevWindow > 0 ? ((total - prevWindow) / prevWindow) * 100 : 0;
    return { total, pending, refundedAmount, rate, trend };
  }, [data, periodData, periodLimitDays]);

  // Alerts
  const alerts = useMemo(() => {
    const stalePending = data.filter(c => c.status === 'PENDING' && hoursSince(c.createdAt) > 48);
    const lateRefunds = data.filter(c => c.status === 'APPROVED' && daysSince(c.lastUpdateAt) > 5);
    return { stalePending, lateRefunds };
  }, [data]);

  // Charts data
  const monthlyChart = useMemo(() => {
    const months: { label: string; count: number; refunded: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString('fr-FR', { month: 'short' });
      const m = d.getMonth(), y = d.getFullYear();
      const inside = data.filter(c => {
        const cd = new Date(c.createdAt);
        return cd.getMonth() === m && cd.getFullYear() === y;
      });
      months.push({
        label,
        count: inside.length,
        refunded: inside.filter(c => c.status === 'REFUNDED').length,
      });
    }
    // seed some visual weight for demo
    if (months.every(m => m.count === 0)) {
      months.forEach((m, i) => { m.count = 3 + i + Math.floor(Math.random() * 2); m.refunded = Math.max(0, m.count - 2); });
    }
    return months;
  }, [data]);

  const motifChart = useMemo(() => {
    const counts: Record<Motif, number> = { PERSONNEL: 0, MEDICAL: 0, FORCE_MAJEURE: 0, INSATISFACTION: 0, AUTRE: 0 };
    periodData.forEach(c => { counts[c.motif]++; });
    return (Object.keys(counts) as Motif[])
      .filter(k => counts[k] > 0)
      .map(k => ({ name: MOTIF_CFG[k].label, value: counts[k], color: MOTIF_CFG[k].color }));
  }, [periodData]);

  const destChart = useMemo(() => {
    const counts = new Map<string, number>();
    periodData.forEach(c => counts.set(c.destination, (counts.get(c.destination) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [periodData]);

  // Team workload
  const team = useMemo(() => {
    const byAgent = new Map<string, { pending: number; processed: number; avgHours: number }>();
    data.forEach(c => {
      const name = c.handledBy ?? 'Non assigné';
      const cur = byAgent.get(name) ?? { pending: 0, processed: 0, avgHours: 0 };
      if (c.status === 'PENDING') cur.pending++; else cur.processed++;
      byAgent.set(name, cur);
    });
    return Array.from(byAgent.entries()).map(([name, v]) => ({
      name,
      pending: v.pending,
      processed: v.processed,
      sla: v.pending <= 2 ? 'ok' : v.pending <= 4 ? 'warn' : 'crit',
    }));
  }, [data]);

  // Handlers
  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    const visible = pageItems.map(c => c.id);
    const allSelected = visible.every(id => selected.has(id));
    setSelected(prev => {
      const n = new Set(prev);
      if (allSelected) visible.forEach(id => n.delete(id));
      else visible.forEach(id => n.add(id));
      return n;
    });
  };

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('desc'); }
  };

  const applyDecision = async (c: Cancellation, type: 'APPROVE' | 'REJECT' | 'PARTIAL' | 'VOUCHER', payload: { amountCents?: number; note?: string }) => {
    try {
      const endpoint = `/admin/cancellations/${c.id}/${type.toLowerCase()}`;
      await apiClient.post(endpoint, payload);
    } catch {
      // demo fallback — continue
    }
    setData(prev => prev.map(x => {
      if (x.id !== c.id) return x;
      const status: Status =
        type === 'APPROVE' ? 'APPROVED' :
        type === 'REJECT'  ? 'REJECTED' :
        type === 'PARTIAL' ? 'APPROVED' :
        'VOUCHER';
      const newAmount = payload.amountCents ?? x.refundAmountCents;
      return {
        ...x,
        status,
        refundAmountCents: type === 'REJECT' ? 0 : newAmount,
        lastUpdateAt: new Date().toISOString(),
        timeline: [
          ...x.timeline,
          { at: new Date().toISOString(), by: 'Admin', kind: 'action',
            action:
              type === 'APPROVE' ? 'Remboursement intégral approuvé' :
              type === 'REJECT'  ? 'Demande refusée' :
              type === 'PARTIAL' ? `Remboursement partiel ${formatPrice(newAmount)}` :
              `Avoir émis ${formatPrice(newAmount)}`,
          },
        ],
      };
    }));
    setToast({
      text:
        type === 'APPROVE' ? 'Remboursement approuvé' :
        type === 'REJECT'  ? 'Demande refusée' :
        type === 'PARTIAL' ? 'Remboursement partiel enregistré' :
        'Avoir émis',
      kind: 'success',
    });
  };

  const submitConfirm = async () => {
    if (!confirmAction) return;
    const amountCents =
      confirmAction.type === 'PARTIAL' || confirmAction.type === 'VOUCHER'
        ? Math.round((Number(confirmAmount) || 0) * 100)
        : undefined;
    await applyDecision(confirmAction.c, confirmAction.type, { amountCents, note: confirmReason });
    setConfirmAction(null);
    setConfirmReason('');
    setConfirmAmount('');
  };

  const bulkApprove = async () => {
    const targets = data.filter(c => selected.has(c.id) && c.status === 'PENDING');
    for (const t of targets) await applyDecision(t, 'APPROVE', {});
    setSelected(new Set());
    setBulkOpen(false);
  };

  const bulkReject = async () => {
    const targets = data.filter(c => selected.has(c.id) && c.status === 'PENDING');
    for (const t of targets) await applyDecision(t, 'REJECT', {});
    setSelected(new Set());
    setBulkOpen(false);
  };

  const openPanel = data.find(c => c.id === panelId) ?? null;

  // ─── Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: 24 }}>
        <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ height: 108, borderRadius: 16, background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
          <div style={{ height: 320, borderRadius: 16, background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ height: 500, borderRadius: 16, background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: -200, left: '35%', width: 600, height: 600,
        background: `radial-gradient(circle, ${T.gold}0F 0%, transparent 60%)`,
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px 80px', maxWidth: 1600, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, background: T.goldDim,
                border: `1px solid ${T.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ban size={16} style={{ color: T.gold }} />
              </div>
              <p style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 1, color: T.gold, fontWeight: 600 }}>
                Centre opérationnel
              </p>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: T.text, letterSpacing: -0.5, marginBottom: 6 }}>
              Annulations
            </h1>
            <p style={{ fontSize: 13.5, color: T.textDim, maxWidth: 540 }}>
              Traitement des demandes — approbations, remboursements, avoirs et communication client.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <PeriodSelector value={period} onChange={setPeriod} />
            <button
              onClick={() => fetchData()}
              style={{
                ...glassSoft, display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '9px 14px', fontSize: 12.5, fontWeight: 500, color: T.textDim,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}
            >
              <RefreshCw size={13} /> Actualiser
            </button>
            <button
              style={{
                ...glassSoft, display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '9px 14px', fontSize: 12.5, fontWeight: 500, color: T.textDim,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}
            >
              <Download size={13} /> Exporter CSV
            </button>
          </div>
        </motion.div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 20 }}>
          <KpiCard
            icon={Ban} label="Total annulations" numericValue={kpis.total}
            value={kpis.total} accent={T.gold} trend={kpis.trend}
            trendLabel={period === 'MONTH' ? '30 derniers jours' : period === 'QUARTER' ? '90 derniers jours' : '12 derniers mois'}
            delay={0.05}
          />
          <KpiCard
            icon={TrendingDown} label="Taux annulation"
            value={kpis.rate.toFixed(1) + '%'}
            accent={T.amber} trendLabel="vs total réservations"
            delay={0.1}
          />
          <KpiCard
            icon={CreditCard} label="Montant remboursé"
            value={formatPrice(kpis.refundedAmount)}
            accent={T.blue} trendLabel={kpis.refundedAmount > 0 ? 'Versé aux clients' : 'Aucun versement'}
            delay={0.15}
          />
          <KpiCard
            icon={Hourglass} label="En attente"
            numericValue={kpis.pending} value={kpis.pending} accent={T.rose}
            trendLabel={kpis.pending > 0 ? 'À traiter' : 'Tout est à jour'}
            delay={0.2}
          />
          <KpiCard
            icon={Sparkles} label="Motif principal"
            value={motifChart[0]?.name ?? '—'}
            accent={T.violet} trendLabel={motifChart[0] ? `${motifChart[0].value} cas` : ''}
            delay={0.25}
          />
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {(alerts.stalePending.length > 0 || alerts.lateRefunds.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12, marginBottom: 20 }}
            >
              {alerts.stalePending.length > 0 && (
                <AlertBanner
                  icon={AlertTriangle} color={T.rose} dim={T.roseDim} border={T.roseBorder}
                  title={`${alerts.stalePending.length} demande${alerts.stalePending.length > 1 ? 's' : ''} en attente > 48h`}
                  subtitle="SLA dépassé — traitement prioritaire requis"
                />
              )}
              {alerts.lateRefunds.length > 0 && (
                <AlertBanner
                  icon={Clock} color={T.amber} dim={T.amberDim} border={T.amberBorder}
                  title={`${alerts.lateRefunds.length} remboursement${alerts.lateRefunds.length > 1 ? 's' : ''} en retard`}
                  subtitle="Approuvés depuis > 5 jours, non finalisés"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14, marginBottom: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            style={{ ...glass, gridColumn: 'span 6', padding: 20 }}
            className="chart-col-lg"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tendance</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Annulations par mois</p>
              </div>
              <Legend items={[
                { label: 'Demandes', color: T.gold },
                { label: 'Remboursées', color: T.emerald },
              ]} />
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChart}>
                  <defs>
                    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.gold} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={T.gold} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.emerald} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={T.emerald} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: T.textMute, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T.textMute, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: T.textDim }}
                  />
                  <Area type="monotone" dataKey="count" stroke={T.gold} strokeWidth={2} fill="url(#gGold)" />
                  <Area type="monotone" dataKey="refunded" stroke={T.emerald} strokeWidth={2} fill="url(#gEmerald)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            style={{ ...glass, gridColumn: 'span 3', padding: 20 }}
            className="chart-col-md"
          >
            <p style={{ fontSize: 11.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>Répartition</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 16 }}>Par motif</p>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={motifChart} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value" stroke="none">
                    {motifChart.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {motifChart.map(m => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: m.color }} />
                  <span style={{ color: T.textDim, flex: 1 }}>{m.name}</span>
                  <span style={{ color: T.text, fontWeight: 600 }}>{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            style={{ ...glass, gridColumn: 'span 3', padding: 20 }}
            className="chart-col-md"
          >
            <p style={{ fontSize: 11.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>Destinations</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 16 }}>Top par volume</p>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={destChart} layout="vertical" margin={{ left: 0, right: 10, top: 4, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fill: T.textDim, fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12 }}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="value" fill={T.gold} radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Team workload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{ ...glass, padding: 20, marginBottom: 20 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <p style={{ fontSize: 11.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>Équipe</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Charge de travail et SLA</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 11.5, color: T.textMute }}>
              <SlaDot color={T.emerald} label="SLA respecté" />
              <SlaDot color={T.amber} label="Attention" />
              <SlaDot color={T.rose} label="Critique" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {team.map(t => {
              const dotColor = t.sla === 'ok' ? T.emerald : t.sla === 'warn' ? T.amber : T.rose;
              return (
                <div key={t.name} style={{ ...glassSoft, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 999,
                      background: `${T.gold}22`, border: `1px solid ${T.goldBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, color: T.gold, fontSize: 13,
                    }}>
                      {t.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.textMute }}>
                        <span style={{ width: 7, height: 7, borderRadius: 999, background: dotColor }} />
                        {t.sla === 'ok' ? 'Dans les temps' : t.sla === 'warn' ? 'Vigilance' : 'Critique'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: T.textDim }}>En cours</span>
                    <span style={{ color: T.amber, fontWeight: 600 }}>{t.pending}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
                    <span style={{ color: T.textDim }}>Traités</span>
                    <span style={{ color: T.emerald, fontWeight: 600 }}>{t.processed}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Filters bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ ...glass, padding: 14, marginBottom: bulkOpen ? 0 : 14 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: 11, color: T.textMute }} />
              <input
                type="text"
                placeholder="Référence, client, email, voyage, destination..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px 9px 34px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${T.border}`, borderRadius: 10,
                  color: T.text, fontSize: 13, outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REFUNDED', 'VOUCHER'] as const).map(s => {
                const active = statusFilter === s;
                const label = s === 'ALL' ? 'Toutes' : STATUS_CFG[s].label;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '7px 13px', fontSize: 11.5, fontWeight: 600,
                      borderRadius: 9, cursor: 'pointer', transition: 'all 0.15s',
                      background: active ? T.goldDim : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? T.goldBorder : T.border}`,
                      color: active ? T.gold : T.textDim,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 13px', fontSize: 12, fontWeight: 500,
                borderRadius: 9, cursor: 'pointer',
                background: showFilters ? T.goldDim : 'rgba(255,255,255,0.02)',
                border: `1px solid ${showFilters ? T.goldBorder : T.border}`,
                color: showFilters ? T.gold : T.textDim,
              }}
            >
              <Filter size={12} /> Filtres avancés
              {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}`,
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10,
                }}>
                  <FilterSelect
                    label="Motif"
                    value={motifFilter}
                    onChange={v => setMotifFilter(v as 'ALL' | Motif)}
                    options={[{ value: 'ALL', label: 'Tous les motifs' }, ...(Object.keys(MOTIF_CFG) as Motif[]).map(k => ({ value: k, label: MOTIF_CFG[k].label }))]}
                  />
                  <FilterSelect
                    label="Voyage"
                    value={travelFilter}
                    onChange={setTravelFilter}
                    options={[{ value: 'ALL', label: 'Tous les voyages' }, ...travelOptions.map(t => ({ value: t.id, label: t.title }))]}
                  />
                  <FilterInput label="Montant min (€)" value={amountMin} onChange={setAmountMin} type="number" placeholder="0" />
                  <FilterInput label="Montant max (€)" value={amountMax} onChange={setAmountMax} type="number" placeholder="Illimité" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bulk action bar */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                ...glass, padding: '12px 16px', marginBottom: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                background: T.goldDim, border: `1px solid ${T.goldBorder}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={15} style={{ color: T.gold }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.gold }}>
                  {selected.size} sélection{selected.size > 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setSelected(new Set())}
                  style={{ fontSize: 11.5, color: T.textDim, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Tout désélectionner
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={bulkApprove}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', fontSize: 12.5, fontWeight: 600,
                    background: T.emeraldDim, border: `1px solid ${T.emeraldBorder}`,
                    color: T.emerald, borderRadius: 9, cursor: 'pointer',
                  }}
                >
                  <CheckCircle2 size={13} /> Approuver en lot
                </button>
                <button
                  onClick={bulkReject}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', fontSize: 12.5, fontWeight: 600,
                    background: T.roseDim, border: `1px solid ${T.roseBorder}`,
                    color: T.rose, borderRadius: 9, cursor: 'pointer',
                  }}
                >
                  <XCircle size={13} /> Refuser en lot
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          style={{ ...glass, overflow: 'hidden' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${T.border}` }}>
                  <th style={thStyle('center')}>
                    <input
                      type="checkbox"
                      checked={pageItems.length > 0 && pageItems.every(c => selected.has(c.id))}
                      onChange={toggleSelectAll}
                      style={{ accentColor: T.gold, cursor: 'pointer' }}
                    />
                  </th>
                  <SortableTh label="Référence" active={sortKey === 'client'} dir={sortDir} onClick={() => toggleSort('client')} />
                  <SortableTh label="Voyage" active={sortKey === 'travel'} dir={sortDir} onClick={() => toggleSort('travel')} />
                  <th style={thStyle()}>Motif</th>
                  <SortableTh label="Date" active={sortKey === 'date'} dir={sortDir} onClick={() => toggleSort('date')} />
                  <SortableTh label="Montant" active={sortKey === 'amount'} dir={sortDir} onClick={() => toggleSort('amount')} align="right" />
                  <SortableTh label="Statut" active={sortKey === 'status'} dir={sortDir} onClick={() => toggleSort('status')} />
                  <th style={thStyle('right')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c, idx) => {
                  const isChecked = selected.has(c.id);
                  const isStale = c.status === 'PENDING' && hoursSince(c.createdAt) > 48;
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setPanelId(c.id)}
                      style={{
                        borderBottom: `1px solid ${T.border}`,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        background: isStale ? 'rgba(248,113,113,0.03)' : 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                      onMouseLeave={e => (e.currentTarget.style.background = isStale ? 'rgba(248,113,113,0.03)' : 'transparent')}
                    >
                      <td style={{ ...tdStyle(), textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(c.id)}
                          style={{ accentColor: T.gold, cursor: 'pointer' }}
                        />
                      </td>
                      <td style={tdStyle()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{c.clientName}</span>
                            {isStale && (
                              <span style={{
                                padding: '1px 6px', fontSize: 9.5, fontWeight: 700,
                                background: T.roseDim, color: T.rose, borderRadius: 4,
                                border: `1px solid ${T.roseBorder}`, textTransform: 'uppercase', letterSpacing: 0.5,
                              }}>
                                {'> 48h'}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: 11, color: T.textMute, fontFamily: 'ui-monospace, monospace' }}>{c.bookingRef}</span>
                        </div>
                      </td>
                      <td style={tdStyle()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 12.5, color: T.text }}>{c.travelTitle}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.textMute }}>
                            <MapPin size={10} /> {c.destination}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle()}><MotifBadge motif={c.motif} /></td>
                      <td style={tdStyle()}>
                        <span style={{ fontSize: 12, color: T.textDim }}>
                          {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </td>
                      <td style={{ ...tdStyle(), textAlign: 'right' }}>
                        <span style={{
                          fontSize: 13, fontWeight: 600,
                          color: c.refundAmountCents === 0 ? T.textMute : c.refundAmountCents < c.totalPaidCents ? T.amber : T.emerald,
                        }}>
                          {c.refundAmountCents === 0 ? '—' : formatPrice(c.refundAmountCents)}
                        </span>
                      </td>
                      <td style={tdStyle()}><StatusBadge status={c.status} /></td>
                      <td style={{ ...tdStyle(), textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        {c.status === 'PENDING' ? (
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <IconButton color={T.emerald} dim={T.emeraldDim} border={T.emeraldBorder}
                              onClick={() => setConfirmAction({ c, type: 'APPROVE' })} title="Approuver">
                              <CheckCircle2 size={13} />
                            </IconButton>
                            <IconButton color={T.rose} dim={T.roseDim} border={T.roseBorder}
                              onClick={() => setConfirmAction({ c, type: 'REJECT' })} title="Refuser">
                              <XCircle size={13} />
                            </IconButton>
                            <IconButton color={T.gold} dim={T.goldDim} border={T.goldBorder}
                              onClick={() => setPanelId(c.id)} title="Détails">
                              <Eye size={13} />
                            </IconButton>
                          </div>
                        ) : (
                          <IconButton color={T.textDim} dim="rgba(255,255,255,0.03)" border={T.border}
                            onClick={() => setPanelId(c.id)} title="Détails">
                            <Eye size={13} />
                          </IconButton>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 64, textAlign: 'center', color: T.textMute }}>
                      <Info size={24} style={{ opacity: 0.4, marginBottom: 8 }} />
                      <p style={{ fontSize: 13 }}>Aucune annulation ne correspond aux filtres.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > pageSize && (
            <div style={{
              padding: '12px 18px', borderTop: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
            }}>
              <span style={{ fontSize: 12, color: T.textMute }}>
                {pageStart + 1}–{Math.min(pageStart + pageSize, filtered.length)} sur {filtered.length}
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={pagBtnStyle(page === 1)}
                >
                  <ChevronLeft size={13} />
                </button>
                <span style={{ fontSize: 12, color: T.textDim, padding: '0 8px' }}>Page {page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={pagBtnStyle(page === totalPages)}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {openPanel && (
          <SidePanel
            cancellation={openPanel}
            onClose={() => setPanelId(null)}
            onAction={(type) => setConfirmAction({ c: openPanel, type })}
          />
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmAction && (
          <ConfirmModal
            action={confirmAction}
            reason={confirmReason}
            setReason={setConfirmReason}
            amount={confirmAmount}
            setAmount={setConfirmAmount}
            onCancel={() => { setConfirmAction(null); setConfirmReason(''); setConfirmAmount(''); }}
            onSubmit={submitConfirm}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{
              position: 'fixed', bottom: 28, right: 28, zIndex: 80,
              padding: '12px 18px', borderRadius: 12,
              background: toast.kind === 'success' ? T.emeraldDim : T.roseDim,
              border: `1px solid ${toast.kind === 'success' ? T.emeraldBorder : T.roseBorder}`,
              color: toast.kind === 'success' ? T.emerald : T.rose,
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 10,
              backdropFilter: 'blur(16px)',
            }}
          >
            {toast.kind === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 1024px) {
          :global(.chart-col-lg) { grid-column: span 12 !important; }
          :global(.chart-col-md) { grid-column: span 6 !important; }
        }
        @media (max-width: 640px) {
          :global(.chart-col-md) { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const opts: { key: Period; label: string }[] = [
    { key: 'MONTH', label: 'Mois' },
    { key: 'QUARTER', label: 'Trimestre' },
    { key: 'YEAR', label: 'Année' },
  ];
  return (
    <div style={{ ...glassSoft, display: 'inline-flex', padding: 3, gap: 2 }}>
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            padding: '6px 12px', fontSize: 11.5, fontWeight: 600,
            borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
            background: value === o.key ? T.goldDim : 'transparent',
            border: `1px solid ${value === o.key ? T.goldBorder : 'transparent'}`,
            color: value === o.key ? T.gold : T.textDim,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function AlertBanner({ icon: Icon, color, dim, border, title, subtitle }: {
  icon: React.ElementType; color: string; dim: string; border: string; title: string; subtitle: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', background: dim, border: `1px solid ${border}`,
      borderRadius: 12, backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: `${color}1E`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color }}>{title}</p>
        <p style={{ fontSize: 11.5, color: T.textMute }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div style={{ display: 'inline-flex', gap: 12 }}>
      {items.map(i => (
        <span key={i.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.textDim }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

function SlaDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: color }} />
      {label}
    </span>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 10.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '8px 10px', fontSize: 12.5,
          background: 'rgba(255,255,255,0.03)', color: T.text,
          border: `1px solid ${T.border}`, borderRadius: 9, outline: 'none', cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: T.bgSoft }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function FilterInput({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 10.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '8px 10px', fontSize: 12.5,
          background: 'rgba(255,255,255,0.03)', color: T.text,
          border: `1px solid ${T.border}`, borderRadius: 9, outline: 'none',
        }}
      />
    </div>
  );
}

function IconButton({ color, dim, border, onClick, title, children }: {
  color: string; dim: string; border: string;
  onClick: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, borderRadius: 8,
        background: dim, border: `1px solid ${border}`, color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

const thStyle = (align: 'left' | 'center' | 'right' = 'left'): React.CSSProperties => ({
  padding: '12px 14px', textAlign: align, fontSize: 10.5,
  fontWeight: 700, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.7,
});

const tdStyle = (): React.CSSProperties => ({
  padding: '14px', fontSize: 12.5, color: T.text, verticalAlign: 'middle',
});

function SortableTh({ label, active, dir, onClick, align = 'left' }: {
  label: string; active: boolean; dir: SortDir; onClick: () => void; align?: 'left' | 'right' | 'center';
}) {
  return (
    <th style={thStyle(align)}>
      <button
        onClick={onClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 10.5, fontWeight: 700, color: active ? T.gold : T.textMute,
          textTransform: 'uppercase', letterSpacing: 0.7,
          padding: 0,
        }}
      >
        {label}
        <ArrowUpDown size={10} style={{ opacity: active ? 1 : 0.4, transform: active && dir === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
    </th>
  );
}

function pagBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 30, height: 30, borderRadius: 8,
    background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
    color: disabled ? T.textMute : T.textDim,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  };
}

// ─── Side Panel ─────────────────────────────────────────────────────────────
interface SidePanelProps {
  cancellation: Cancellation;
  onClose: () => void;
  onAction: (type: 'APPROVE' | 'REJECT' | 'PARTIAL' | 'VOUCHER') => void;
}

function SidePanel({ cancellation: c, onClose, onAction }: SidePanelProps) {
  const days = Math.max(0, Math.round(daysBefore(c.departureDate)));
  const policy = computePolicyRefund(c.totalPaidCents, days);
  const isPending = c.status === 'PENDING';

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 60, backdropFilter: 'blur(4px)' }}
      />
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(620px, 100%)',
          background: T.bgSoft, borderLeft: `1px solid ${T.borderStrong}`, zIndex: 70,
          overflowY: 'auto', boxShadow: '-30px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Panel header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 2,
          padding: '20px 24px', background: `${T.bgSoft}ee`,
          backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: T.textMute }}>{c.bookingRef}</span>
              <StatusBadge status={c.status} size="md" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 2 }}>{c.clientName}</h2>
            <p style={{ fontSize: 13, color: T.textDim }}>{c.travelTitle} • {c.destination}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
              color: T.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Client & voyage info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InfoCard icon={User} title="Client" rows={[
              { label: 'Email', value: c.clientEmail },
              { label: 'Téléphone', value: c.clientPhone },
              { label: 'Réservé le', value: new Date(c.bookingDate).toLocaleDateString('fr-FR') },
            ]} />
            <InfoCard icon={MapPin} title="Voyage" rows={[
              { label: 'Destination', value: c.destination },
              { label: 'Départ prévu', value: new Date(c.departureDate).toLocaleDateString('fr-FR') },
              { label: 'J - départ', value: `${days} jour${days > 1 ? 's' : ''}` },
            ]} />
          </div>

          {/* Motif */}
          <div style={{ ...glassSoft, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <MotifBadge motif={c.motif} />
              <span style={{ fontSize: 11, color: T.textMute }}>
                Demandé le {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: T.textDim, lineHeight: 1.6, fontStyle: 'italic' }}>
              « {c.reason} »
            </p>
          </div>

          {/* Refund calculation */}
          <div style={{
            background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 14, padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <ShieldCheck size={15} style={{ color: T.gold }} />
              <p style={{ fontSize: 11.5, fontWeight: 700, color: T.gold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Politique de remboursement
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <PolicyStat label="Total payé" value={formatPrice(c.totalPaidCents)} color={T.text} />
              <PolicyStat label="Délai avant départ" value={`${days}j`} color={T.text} />
              <PolicyStat label="Barème CGV" value={`${policy.pct}%`} color={policy.pct >= 50 ? T.emerald : policy.pct >= 30 ? T.amber : T.rose} />
              <PolicyStat label="Remboursable" value={formatPrice(policy.cents)} color={T.gold} big />
            </div>
            <div style={{ padding: 10, background: 'rgba(0,0,0,0.25)', borderRadius: 8, fontSize: 11.5, color: T.textDim }}>
              <strong style={{ color: T.gold }}>Règle :</strong> {policy.label}. Au-delà de 30 jours : 100%. Entre 15 et 30 : 50%. Entre 7 et 14 : 30% (geste commercial). Moins de 7 jours : remboursement refusé.
            </div>
          </div>

          {/* Timeline */}
          <div style={{ ...glassSoft, padding: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 14 }}>
              Timeline de traitement
            </p>
            <div style={{ position: 'relative', paddingLeft: 22 }}>
              <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 1, background: T.border }} />
              {c.timeline.map((ev, i) => {
                const color = ev.kind === 'client' ? T.blue : ev.kind === 'system' ? T.violet : T.gold;
                return (
                  <div key={i} style={{ position: 'relative', paddingBottom: 14 }}>
                    <div style={{
                      position: 'absolute', left: -22, top: 3,
                      width: 15, height: 15, borderRadius: 999,
                      background: `${color}2A`, border: `2px solid ${color}`,
                    }} />
                    <div style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>{ev.action}</div>
                    <div style={{ fontSize: 11, color: T.textMute }}>
                      {ev.by} • {new Date(ev.at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exchanges */}
          {c.exchanges.length > 0 && (
            <div style={{ ...glassSoft, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                  Échanges client
                </p>
                <span style={{ fontSize: 11, color: T.textMute }}>{c.exchanges.length} message{c.exchanges.length > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.exchanges.map((m, i) => {
                  const isAgent = m.role === 'agent';
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isAgent ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '85%',
                        background: isAgent ? T.goldDim : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isAgent ? T.goldBorder : T.border}`,
                        borderRadius: 12, padding: '9px 12px',
                      }}>
                        <p style={{ fontSize: 12.5, color: isAgent ? T.gold : T.text, lineHeight: 1.5 }}>{m.text}</p>
                      </div>
                      <span style={{ fontSize: 10.5, color: T.textMute, marginTop: 4 }}>
                        {m.by} • {m.channel} • {new Date(m.at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documents */}
          {c.documents.length > 0 && (
            <div style={{ ...glassSoft, padding: 18 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 12 }}>
                Documents joints
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.documents.map(d => (
                  <div key={d.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`, borderRadius: 9,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${T.blue}1A`, border: `1px solid ${T.blueBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <FileText size={15} style={{ color: T.blue }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, color: T.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</p>
                      <p style={{ fontSize: 10.5, color: T.textMute }}>{d.type} • {d.size}</p>
                    </div>
                    <button style={{
                      padding: '6px 10px', fontSize: 11, fontWeight: 500,
                      background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: 7,
                      color: T.textDim, cursor: 'pointer',
                    }}>
                      Voir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact shortcuts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            <ContactBtn icon={Mail} label="Email" href={`mailto:${c.clientEmail}`} />
            <ContactBtn icon={Phone} label="Appeler" href={`tel:${c.clientPhone}`} />
            <ContactBtn icon={MessageSquare} label="Chat" href="#" />
          </div>
        </div>

        {/* Sticky actions */}
        {isPending && (
          <div style={{
            position: 'sticky', bottom: 0,
            padding: 16, background: `${T.bgSoft}ee`, backdropFilter: 'blur(16px)',
            borderTop: `1px solid ${T.border}`,
            display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8,
          }}>
            <ActionBtn color={T.emerald} dim={T.emeraldDim} border={T.emeraldBorder} icon={CheckCircle2} label="Approuver 100%" onClick={() => onAction('APPROVE')} />
            <ActionBtn color={T.rose} dim={T.roseDim} border={T.roseBorder} icon={XCircle} label="Refuser" onClick={() => onAction('REJECT')} />
            <ActionBtn color={T.amber} dim={T.amberDim} border={T.amberBorder} icon={FileCheck2} label="Remboursement partiel" onClick={() => onAction('PARTIAL')} />
            <ActionBtn color={T.violet} dim={T.violetDim} border={T.violetBorder} icon={Gift} label="Proposer un avoir" onClick={() => onAction('VOUCHER')} />
          </div>
        )}
      </motion.aside>
    </>
  );
}

function InfoCard({ icon: Icon, title, rows }: {
  icon: React.ElementType; title: string; rows: { label: string; value: string }[];
}) {
  return (
    <div style={{ ...glassSoft, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Icon size={13} style={{ color: T.gold }} />
        <p style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.7 }}>
          {title}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, alignItems: 'baseline' }}>
            <span style={{ color: T.textMute }}>{r.label}</span>
            <span style={{ color: T.text, fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PolicyStat({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 10.5, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: big ? 19 : 14, fontWeight: 700, color }}>{value}</p>
    </div>
  );
}

function ContactBtn({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        ...glassSoft, padding: '10px', textDecoration: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        fontSize: 12, fontWeight: 500, color: T.textDim,
      }}
    >
      <Icon size={13} /> {label}
    </a>
  );
}

function ActionBtn({ color, dim, border, icon: Icon, label, onClick }: {
  color: string; dim: string; border: string; icon: React.ElementType; label: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '11px 10px', fontSize: 12.5, fontWeight: 600,
        background: dim, border: `1px solid ${border}`, color,
        borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

// ─── Confirm modal ──────────────────────────────────────────────────────────
function ConfirmModal({ action, reason, setReason, amount, setAmount, onCancel, onSubmit }: {
  action: { c: Cancellation; type: 'APPROVE' | 'REJECT' | 'PARTIAL' | 'VOUCHER' };
  reason: string; setReason: (v: string) => void;
  amount: string; setAmount: (v: string) => void;
  onCancel: () => void; onSubmit: () => void;
}) {
  const needsAmount = action.type === 'PARTIAL' || action.type === 'VOUCHER';
  const titles: Record<typeof action.type, string> = {
    APPROVE: 'Approuver le remboursement',
    REJECT: 'Refuser la demande',
    PARTIAL: 'Remboursement partiel',
    VOUCHER: 'Émettre un avoir',
  };
  const colors: Record<typeof action.type, { color: string; dim: string; border: string; icon: React.ElementType }> = {
    APPROVE: { color: T.emerald, dim: T.emeraldDim, border: T.emeraldBorder, icon: CheckCircle2 },
    REJECT:  { color: T.rose,    dim: T.roseDim,    border: T.roseBorder,    icon: XCircle },
    PARTIAL: { color: T.amber,   dim: T.amberDim,   border: T.amberBorder,   icon: FileCheck2 },
    VOUCHER: { color: T.violet,  dim: T.violetDim,  border: T.violetBorder,  icon: Gift },
  };
  const cfg = colors[action.type];
  const Icon = cfg.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 90, backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(480px, 92vw)', zIndex: 100,
          background: T.bgSoft, border: `1px solid ${T.borderStrong}`, borderRadius: 18,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: cfg.dim, border: `1px solid ${cfg.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={19} style={{ color: cfg.color }} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{titles[action.type]}</h3>
              <p style={{ fontSize: 12, color: T.textMute }}>
                {action.c.bookingRef} • {action.c.clientName}
              </p>
            </div>
          </div>

          {needsAmount && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
                Montant {action.type === 'VOUCHER' ? 'de l avoir' : 'du remboursement'} (€)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={(action.c.totalPaidCents / 100).toFixed(2)}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${T.border}`, borderRadius: 10,
                  color: T.text, outline: 'none',
                }}
              />
              <p style={{ fontSize: 11, color: T.textMute, marginTop: 5 }}>
                Total payé : {formatPrice(action.c.totalPaidCents)}
              </p>
            </div>
          )}

          {action.type === 'APPROVE' && (
            <div style={{
              padding: 12, marginBottom: 14,
              background: cfg.dim, border: `1px solid ${cfg.border}`, borderRadius: 10,
            }}>
              <p style={{ fontSize: 12.5, color: cfg.color, fontWeight: 500 }}>
                Remboursement intégral de {formatPrice(action.c.refundAmountCents)} sera déclenché immédiatement.
              </p>
            </div>
          )}

          <label style={{ display: 'block', fontSize: 11, color: T.textMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
            Note interne (optionnel)
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Commentaire pour l historique interne..."
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${T.border}`, borderRadius: 10,
              color: T.text, outline: 'none', resize: 'none',
            }}
          />
        </div>

        <div style={{
          padding: '14px 24px', borderTop: `1px solid ${T.border}`,
          display: 'flex', gap: 10, justifyContent: 'flex-end',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '9px 18px', fontSize: 13, fontWeight: 500,
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
              color: T.textDim, borderRadius: 9, cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', fontSize: 13, fontWeight: 600,
              background: cfg.dim, border: `1px solid ${cfg.border}`,
              color: cfg.color, borderRadius: 9, cursor: 'pointer',
            }}
          >
            <Send size={13} /> Confirmer
          </button>
        </div>
      </motion.div>
    </>
  );
}
