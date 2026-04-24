'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RTooltip } from 'recharts';
import { ExportCta } from '@/components/admin/export-cta';
import { formatPrice } from '@/lib/utils';
import {
  Search, RefreshCw, Eye, BadgeCheck, ShieldCheck,
  SendHorizonal, CheckCircle2, XCircle, AlertCircle, Sparkles, Clock,
  Calendar, Globe, MapPin, LayoutGrid, List as ListIcon, Rows3,
  Plus, TrendingUp, Zap, Filter,
  ArrowRight, Star, Activity, X, Copy, Archive, Trash2,
  Pencil, ExternalLink, ChevronLeft, ChevronRight,
  Users, Euro, CheckSquare, Square, DollarSign,
  ArrowUp, ArrowDown, Minus, Download, Sliders,
  Bell, MessageSquare, FileWarning, Flag, Flame, Timer,
  Keyboard, UserCircle2, Target,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { apiClient } from '@/lib/api-client';
import { useAdminKeyboardShortcuts } from '@/lib/hooks/use-admin-keyboard-shortcuts';

import { DEMO_TRAVELS_FULL, type DemoTravelFull, type DemoOccurrence } from '@/lib/demo-data';

// ═══════════════════════════════════════════════════════════════════════════════
// Design tokens
// ═══════════════════════════════════════════════════════════════════════════════

const GOLD = '#D4A853';
const GOLD_DARK = '#A97B2D';
const GOLD_LIGHT = '#F2D683';
const BG_DARK = '#0A0E14';
const BG_PANEL = '#13192A';

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

type TravelStatus =
  | 'DRAFT' | 'PHASE1_SUBMITTED' | 'PHASE1_REVIEW' | 'PHASE1_APPROVED'
  | 'PHASE2' | 'PHASE2_REVIEW' | 'PUBLISHED' | 'ON_GOING' | 'COMPLETED' | 'CANCELLED';

type GammeType = 'STANDARD' | 'LUXE';
type ViewMode = 'dense' | 'comfort' | 'grid';
type SortKey = 'title' | 'date' | 'price' | 'fill' | 'bookings' | 'ca' | 'status' | 'urgency';
type SortDir = 'asc' | 'desc';
type PoleId = 'OPERATIONS' | 'FINANCE' | 'MARKETING' | 'COMMERCIAL' | 'SUPPORT' | 'QUALITE';

interface UrgencyTask {
  id: string; label: string; level: 'low' | 'medium' | 'high' | 'critical';
}

interface VoyageModel {
  id: string;
  slug: string;
  title: string;
  status: string;
  country: string;
  destination: string;
  paysCode: string;
  proId: string;
  proName: string;
  gamme: GammeType;
  capacity: number;
  currentBookings: number;
  pricePerPersonCents: number;
  daysCount: number;
  nightsCount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tags: string[];
  occurrences: DemoOccurrence[];
  nextOccurrence?: DemoOccurrence;
  upcomingCount: number;
  avgFillRate: number;
  totalCAPrevu: number;
  createdAt: string;
  updatedAt: string;
  // Operational
  pole: PoleId;
  assignee: string;
  assigneeInitials: string;
  tasks: UrgencyTask[];
  deadline?: string;
  daysUntilDeparture: number;
  urgencyScore: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Status / meta
// ═══════════════════════════════════════════════════════════════════════════════

function normalizeStatus(raw: string): TravelStatus {
  const map: Record<string, TravelStatus> = {
    SUBMITTED: 'PHASE1_SUBMITTED', PENDING_REVIEW: 'PHASE1_REVIEW',
    PENDING: 'PHASE1_REVIEW', APPROVED_P1: 'PHASE1_APPROVED',
    PHASE_1: 'PHASE1_REVIEW', PHASE_2: 'PHASE2', IN_REVIEW: 'PHASE2_REVIEW',
  };
  return (map[raw] as TravelStatus) ?? (raw as TravelStatus);
}

const STATUS_META: Record<string, {
  label: string; color: string; bg: string; ring: string;
  icon: React.ElementType; dot: string; priority?: boolean;
}> = {
  DRAFT:            { label: 'Brouillon',    color: '#8896A6', bg: 'rgba(136,150,166,0.10)', ring: 'rgba(136,150,166,0.25)', dot: '#6B7280', icon: Clock },
  PHASE1_SUBMITTED: { label: 'P1 Soumis',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  ring: 'rgba(245,158,11,0.30)',  dot: '#F59E0B', icon: SendHorizonal, priority: true },
  PHASE1_REVIEW:    { label: 'P1 En revue',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   ring: 'rgba(239,68,68,0.30)',   dot: '#EF4444', icon: Eye, priority: true },
  PHASE1_APPROVED:  { label: 'P1 Approuvé',  color: '#10B981', bg: 'rgba(16,185,129,0.12)',  ring: 'rgba(16,185,129,0.25)', dot: '#10B981', icon: BadgeCheck },
  PHASE2:           { label: 'Phase 2',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',  ring: 'rgba(139,92,246,0.25)', dot: '#8B5CF6', icon: Zap },
  PHASE2_REVIEW:    { label: 'P2 En revue',  color: '#EC4899', bg: 'rgba(236,72,153,0.12)',  ring: 'rgba(236,72,153,0.30)',  dot: '#EC4899', icon: Eye, priority: true },
  PUBLISHED:        { label: 'Publié',       color: '#D4A853', bg: 'rgba(212,168,83,0.12)',  ring: 'rgba(212,168,83,0.28)',  dot: '#D4A853', icon: ShieldCheck },
  ON_GOING:         { label: 'En cours',     color: '#F97316', bg: 'rgba(249,115,22,0.12)',  ring: 'rgba(249,115,22,0.25)', dot: '#F97316', icon: Sparkles },
  COMPLETED:        { label: 'Terminé',      color: '#8896a6', bg: 'rgba(107,114,128,0.10)', ring: 'rgba(107,114,128,0.20)', dot: '#4B5563', icon: CheckCircle2 },
  CANCELLED:        { label: 'Annulé',       color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   ring: 'rgba(239,68,68,0.20)',  dot: '#EF4444', icon: XCircle },
};

const POLE_META: Record<PoleId, { label: string; short: string; color: string; icon: React.ElementType }> = {
  OPERATIONS: { label: 'Opérations', short: 'OPS', color: '#D4A853', icon: Target },
  FINANCE:    { label: 'Finance',    short: 'FIN', color: '#10B981', icon: DollarSign },
  MARKETING:  { label: 'Marketing',  short: 'MKT', color: '#EC4899', icon: TrendingUp },
  COMMERCIAL: { label: 'Commercial', short: 'COM', color: '#8B5CF6', icon: Users },
  SUPPORT:    { label: 'Support',    short: 'SUP', color: '#06B6D4', icon: MessageSquare },
  QUALITE:    { label: 'Qualité',    short: 'QA',  color: '#F59E0B', icon: ShieldCheck },
};

const PAYS_LIST = [
  { code: 'ALL', label: 'Tous',      flag: '🌍' },
  { code: 'MA',  label: 'Maroc',     flag: '🇲🇦' },
  { code: 'ES',  label: 'Espagne',   flag: '🇪🇸' },
  { code: 'IT',  label: 'Italie',    flag: '🇮🇹' },
  { code: 'PT',  label: 'Portugal',  flag: '🇵🇹' },
  { code: 'GR',  label: 'Grèce',     flag: '🇬🇷' },
  { code: 'TR',  label: 'Turquie',   flag: '🇹🇷' },
  { code: 'FR',  label: 'France',    flag: '🇫🇷' },
  { code: 'ID',  label: 'Indonésie', flag: '🇮🇩' },
  { code: 'CZ',  label: 'Tchéquie',  flag: '🇨🇿' },
];

const PAYS_GRADIENT: Record<string, string> = {
  MA: 'linear-gradient(135deg, #c2410c 0%, #ea580c 40%, #fdba74 100%)',
  ES: 'linear-gradient(135deg, #dc2626 0%, #f97316 40%, #fbbf24 100%)',
  IT: 'linear-gradient(135deg, #15803d 0%, #16a34a 40%, #4ade80 100%)',
  PT: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 40%, #60a5fa 100%)',
  GR: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 40%, #7dd3fc 100%)',
  TR: 'linear-gradient(135deg, #9f1239 0%, #e11d48 40%, #fb7185 100%)',
  FR: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #93c5fd 100%)',
  ID: 'linear-gradient(135deg, #166534 0%, #15803d 40%, #86efac 100%)',
  CZ: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 40%, #fed7aa 100%)',
  DEFAULT: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #7c3aed 100%)',
};

const COUNTRY_TO_CODE: Record<string, string> = {
  'Maroc': 'MA', 'Espagne': 'ES', 'Italie': 'IT', 'Portugal': 'PT',
  'Grèce': 'GR', 'Turquie': 'TR', 'France': 'FR',
  'Indonésie': 'ID', 'République tchèque': 'CZ',
};

// ═══════════════════════════════════════════════════════════════════════════════
// Deterministic hash → operational metadata (pole, assignee, tasks)
// ═══════════════════════════════════════════════════════════════════════════════

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const ASSIGNEES = [
  { name: 'Sarah Dumont',   initials: 'SD' },
  { name: 'Marc Leblanc',   initials: 'ML' },
  { name: 'Chloé Bernard',  initials: 'CB' },
  { name: 'Yannis Tardieu', initials: 'YT' },
  { name: 'Inès Kamara',    initials: 'IK' },
  { name: 'Julien Rossi',   initials: 'JR' },
];

const POLES: PoleId[] = ['OPERATIONS', 'FINANCE', 'MARKETING', 'COMMERCIAL', 'SUPPORT', 'QUALITE'];

const TASK_TEMPLATES: Array<{ label: string; level: UrgencyTask['level'] }> = [
  { label: 'Valider programme J-30', level: 'high' },
  { label: 'Confirmer hébergement', level: 'medium' },
  { label: 'Relancer 3 réservations', level: 'medium' },
  { label: 'Contrat transporteur à signer', level: 'critical' },
  { label: 'Photos à mettre à jour', level: 'low' },
  { label: 'Revoir grille tarifaire', level: 'high' },
  { label: 'Répondre 2 messages clients', level: 'low' },
  { label: 'Dossier APST à compléter', level: 'critical' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Build enriched catalogue
// ═══════════════════════════════════════════════════════════════════════════════

const CATALOGUE_MODELS: VoyageModel[] = DEMO_TRAVELS_FULL.map((t: DemoTravelFull) => {
  const occs = t.occurrences || [];
  const now = new Date();
  const upcoming = occs.filter((o: DemoOccurrence) => new Date(o.startDate) >= now);
  const avgFill = occs.length
    ? Math.round(occs.reduce((s: number, o: DemoOccurrence) => s + (o.seatsBooked / t.capacity) * 100, 0) / occs.length)
    : 0;
  const paysCode = COUNTRY_TO_CODE[t.country] ?? 'FR';
  const gamme: GammeType = t.pricePerPersonCents > 150000 ? 'LUXE' : 'STANDARD';

  const h = hashId(t.id);
  const pole = POLES[h % POLES.length];
  const assignee = ASSIGNEES[h % ASSIGNEES.length];
  const numTasks = h % 5; // 0..4
  const tasks: UrgencyTask[] = Array.from({ length: numTasks }, (_, i) => {
    const tpl = TASK_TEMPLATES[(h + i) % TASK_TEMPLATES.length];
    return { id: `${t.id}-task-${i}`, label: tpl.label, level: tpl.level };
  });
  const daysUntilDeparture = upcoming[0]
    ? Math.ceil((new Date(upcoming[0].startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const urgencyScore =
    tasks.reduce((s, task) => s + (task.level === 'critical' ? 40 : task.level === 'high' ? 20 : task.level === 'medium' ? 8 : 2), 0)
    + (daysUntilDeparture <= 7 ? 30 : daysUntilDeparture <= 30 ? 10 : 0)
    + (avgFill < 40 && daysUntilDeparture < 60 ? 15 : 0);

  return {
    id: t.id, slug: t.slug, title: t.title, status: t.status,
    country: t.country, destination: t.destination, paysCode,
    proId: t.proId, proName: t.proName, gamme,
    capacity: t.capacity, currentBookings: t.currentBookings,
    pricePerPersonCents: t.pricePerPersonCents,
    daysCount: t.daysCount, nightsCount: t.nightsCount,
    rating: t.rating, reviewsCount: t.reviewsCount,
    image: t.image, tags: t.tags,
    occurrences: occs,
    nextOccurrence: upcoming[0],
    upcomingCount: upcoming.length,
    avgFillRate: avgFill,
    totalCAPrevu: t.pricePerPersonCents * t.currentBookings,
    createdAt: t.createdAt, updatedAt: t.updatedAt,
    pole,
    assignee: assignee.name,
    assigneeInitials: assignee.initials,
    tasks,
    deadline: upcoming[0] ? new Date(new Date(upcoming[0].startDate).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : undefined,
    daysUntilDeparture,
    urgencyScore,
  };
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tabs
// ═══════════════════════════════════════════════════════════════════════════════

const QUEUE_TABS = [
  { id: 'catalogue',   label: 'Catalogue',   icon: LayoutGrid, color: '#D4A853' },
  { id: 'urgent',      label: 'Urgents',     icon: Flame, color: '#EF4444' },
  { id: 'p1_review',   label: 'Phase 1',     icon: AlertCircle, color: '#F59E0B', statuses: ['PHASE1_SUBMITTED', 'PHASE1_REVIEW'] },
  { id: 'p2_review',   label: 'Phase 2',     icon: Eye, color: '#EC4899', statuses: ['PHASE2_REVIEW', 'PHASE2'] },
  { id: 'published',   label: 'Publiés',     icon: ShieldCheck, color: '#D4A853', statuses: ['PUBLISHED'] },
  { id: 'ongoing',     label: 'En cours',    icon: Sparkles, color: '#F97316', statuses: ['ON_GOING'] },
  { id: 'completed',   label: 'Terminés',    icon: CheckCircle2, color: '#8896a6', statuses: ['COMPLETED'] },
  { id: 'cancelled',   label: 'Annulés',     icon: XCircle, color: '#EF4444', statuses: ['CANCELLED'] },
] as const;

type TabId = typeof QUEUE_TABS[number]['id'];

// ═══════════════════════════════════════════════════════════════════════════════
// Animated counter
// ═══════════════════════════════════════════════════════════════════════════════

function AnimatedNumber({
  value, format = (v: number) => Math.round(v).toString(), duration = 1.1,
}: { value: number; format?: (v: number) => string; duration?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => format(v));
  const [display, setDisplay] = useState(format(0));
  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value, duration, mv, rounded]);
  return <>{display}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Shared UI primitives
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'xs' | 'sm' | 'md' }) {
  const norm = normalizeStatus(status);
  const meta = STATUS_META[norm] ?? STATUS_META['DRAFT'];
  const Icon = meta.icon;
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]'
    : size === 'md' ? 'px-2.5 py-1 text-xs'
    : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${px}`}
      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.ring}` }}>
      <motion.span
        animate={meta.priority ? { opacity: [1, 0.5, 1] } : undefined}
        transition={meta.priority ? { duration: 1.6, repeat: Infinity } : undefined}
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: meta.dot, boxShadow: meta.priority ? `0 0 8px ${meta.dot}` : undefined }}
      />
      {Icon && <Icon className="w-2.5 h-2.5 shrink-0" />}
      {meta.label}
    </span>
  );
}

function PoleBadge({ pole, size = 'sm' }: { pole: PoleId; size?: 'xs' | 'sm' }) {
  const meta = POLE_META[pole];
  const Icon = meta.icon;
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded ${px}`}
      style={{
        background: `rgba(${hexToRgb(meta.color)}, 0.12)`,
        color: meta.color,
        border: `1px solid rgba(${hexToRgb(meta.color)}, 0.22)`,
      }}>
      <Icon className="w-2.5 h-2.5" />
      {meta.short}
    </span>
  );
}

function Avatar({ initials, name, size = 'sm' }: { initials: string; name: string; size?: 'xs' | 'sm' | 'md' }) {
  const sz = size === 'xs' ? 'w-5 h-5 text-[9px]' : size === 'md' ? 'w-9 h-9 text-xs' : 'w-7 h-7 text-[10px]';
  const h = hashId(name);
  const gradients = [
    `linear-gradient(135deg, #F2D683, #A97B2D)`,
    `linear-gradient(135deg, #8B5CF6, #6D28D9)`,
    `linear-gradient(135deg, #10B981, #059669)`,
    `linear-gradient(135deg, #EC4899, #BE185D)`,
    `linear-gradient(135deg, #06B6D4, #0E7490)`,
    `linear-gradient(135deg, #F97316, #C2410C)`,
  ];
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold tracking-wide shrink-0 ${sz}`}
      title={name}
      style={{
        background: gradients[h % gradients.length],
        color: '#fff',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}>
      {initials}
    </span>
  );
}

function FillGauge({ pct, compact = false }: { pct: number; compact?: boolean }) {
  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : pct >= 40 ? '#10B981' : GOLD;
  const glow = pct >= 90 ? '0 0 6px rgba(239,68,68,0.5)' : pct >= 70 ? '0 0 6px rgba(245,158,11,0.4)' : 'none';
  const height = compact ? 'h-1' : 'h-1.5';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className={`flex-1 ${height} rounded-full overflow-hidden`} style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}dd, ${color})`, boxShadow: glow }} />
      </div>
      <span className={`font-bold tabular-nums ${compact ? 'text-[11px] min-w-[30px]' : 'text-xs min-w-[34px]'} text-right`} style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

function UrgencyBadge({ voyage, compact }: { voyage: VoyageModel; compact?: boolean }) {
  const critical = voyage.tasks.filter(t => t.level === 'critical').length;
  const high = voyage.tasks.filter(t => t.level === 'high').length;
  const total = voyage.tasks.length;
  if (total === 0) return null;
  const color = critical > 0 ? '#EF4444' : high > 0 ? '#F59E0B' : '#8896a6';
  const Icon = critical > 0 ? Flame : high > 0 ? AlertCircle : Bell;
  return (
    <motion.span
      animate={critical > 0 ? { scale: [1, 1.06, 1] } : undefined}
      transition={critical > 0 ? { duration: 1.4, repeat: Infinity } : undefined}
      className={`inline-flex items-center gap-1 rounded-full font-bold ${compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'}`}
      style={{
        background: `rgba(${hexToRgb(color)}, 0.12)`,
        color,
        border: `1px solid rgba(${hexToRgb(color)}, 0.28)`,
      }}
      title={`${total} tâche${total > 1 ? 's' : ''} · ${critical} critique${critical > 1 ? 's' : ''} · ${high} haute${high > 1 ? 's' : ''}`}>
      <Icon className="w-2.5 h-2.5" />
      {total}
    </motion.span>
  );
}

function Countdown({ days, compact }: { days: number; compact?: boolean }) {
  if (days === 999) return <span style={{ color: '#4b5563' }}>—</span>;
  const color = days < 0 ? '#6b7280'
    : days <= 7 ? '#EF4444'
    : days <= 30 ? '#F59E0B'
    : days <= 90 ? '#10B981'
    : '#8896a6';
  const label = days < 0 ? `J+${Math.abs(days)}` : days === 0 ? 'Aujourd&apos;hui' : `J-${days}`;
  return (
    <span className={`inline-flex items-center gap-1 font-bold tabular-nums ${compact ? 'text-[10px]' : 'text-xs'}`}
      style={{ color }}>
      <Timer className="w-3 h-3" />
      {days < 0 ? `J+${Math.abs(days)}` : days === 0 ? (<>J&nbsp;0</>) : `J-${days}`}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KPI Card
// ═══════════════════════════════════════════════════════════════════════════════

function KpiCard({
  label, value, sub, color, icon: Icon, sparkline, trend, formatValue, onClick, pulse,
}: {
  label: string; value: number; sub?: string;
  color: string; icon: React.ElementType;
  sparkline?: { v: number }[];
  trend?: { dir: 'up' | 'down' | 'flat'; pct: number };
  formatValue?: (v: number) => string;
  onClick?: () => void;
  pulse?: boolean;
}) {
  const trendColor = trend?.dir === 'up' ? '#10B981' : trend?.dir === 'down' ? '#EF4444' : '#8896a6';
  const TrendIcon = trend?.dir === 'up' ? ArrowUp : trend?.dir === 'down' ? ArrowDown : Minus;
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onClick}
      className={`relative rounded-2xl border p-5 overflow-hidden group ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        background: `linear-gradient(145deg, rgba(19,25,42,0.85), rgba(10,14,20,0.7))`,
        borderColor: `rgba(${hexToRgb(color)}, 0.18)`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 8px 32px -12px rgba(${hexToRgb(color)}, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(400px circle at 50% 0%, rgba(${hexToRgb(color)}, 0.10), transparent 70%)` }} />

      <div className="relative flex items-start justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#6b7280' }}>{label}</p>
        <motion.div
          animate={pulse ? { scale: [1, 1.06, 1] } : undefined}
          transition={pulse ? { duration: 1.6, repeat: Infinity } : undefined}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, rgba(${hexToRgb(color)}, 0.18), rgba(${hexToRgb(color)}, 0.08))`,
            border: `1px solid rgba(${hexToRgb(color)}, 0.25)`,
            boxShadow: `0 0 14px rgba(${hexToRgb(color)}, ${hover ? 0.28 : 0.14})`,
          }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </motion.div>
      </div>

      <div className="relative flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-3xl font-bold tracking-tight tabular-nums leading-none" style={{ color }}>
            <AnimatedNumber value={value} format={formatValue ?? ((v) => Math.round(v).toString())} />
          </p>
          <div className="flex items-center gap-2 mt-2">
            {sub && <p className="text-[11px]" style={{ color: '#6b7280' }}>{sub}</p>}
            {trend && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ color: trendColor, background: `rgba(${hexToRgb(trendColor)}, 0.12)` }}>
                <TrendIcon className="w-2.5 h-2.5" />
                {trend.pct}%
              </span>
            )}
          </div>
        </div>

        {sparkline && sparkline.length > 1 && (
          <div className="w-20 h-12 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} />
                <RTooltip contentStyle={{ display: 'none' }} cursor={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Timeline countdown (prochains départs)
// ═══════════════════════════════════════════════════════════════════════════════

function DepartureTimeline({
  models, onOpen,
}: { models: VoyageModel[]; onOpen: (m: VoyageModel) => void }) {
  const upcoming = useMemo(() => {
    return [...models]
      .filter(m => m.nextOccurrence && m.daysUntilDeparture >= 0)
      .sort((a, b) => a.daysUntilDeparture - b.daysUntilDeparture)
      .slice(0, 10);
  }, [models]);

  if (upcoming.length === 0) return null;

  return (
    <div className="rounded-2xl border p-4"
      style={{
        background: `linear-gradient(145deg, rgba(19,25,42,0.7), rgba(10,14,20,0.5))`,
        borderColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(14px)',
      }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.25)' }}>
          <Timer className="w-3.5 h-3.5" style={{ color: GOLD }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#e5e7eb' }}>Prochains départs</h3>
          <p className="text-[11px]" style={{ color: '#6b7280' }}>Timeline opérationnelle · {upcoming.length} départ{upcoming.length > 1 ? 's' : ''} à venir</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-2 min-w-max">
          {upcoming.map((m, i) => {
            const paysInfo = PAYS_LIST.find(p => p.code === m.paysCode);
            const gradient = PAYS_GRADIENT[m.paysCode] ?? PAYS_GRADIENT.DEFAULT;
            const urgent = m.daysUntilDeparture <= 7;
            const soon = m.daysUntilDeparture <= 30;
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => onOpen(m)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-start gap-2 p-3 rounded-xl shrink-0 w-44 text-left transition-colors"
                style={{
                  background: urgent
                    ? 'linear-gradient(145deg, rgba(239,68,68,0.1), rgba(19,25,42,0.7))'
                    : soon
                    ? 'linear-gradient(145deg, rgba(245,158,11,0.08), rgba(19,25,42,0.7))'
                    : 'rgba(19,25,42,0.6)',
                  border: urgent
                    ? '1px solid rgba(239,68,68,0.3)'
                    : soon
                    ? '1px solid rgba(245,158,11,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: urgent ? '0 0 16px -4px rgba(239,68,68,0.3)' : 'none',
                }}>
                <div className="flex items-center justify-between w-full">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                      style={{ background: gradient }}>
                      {paysInfo?.flag ?? '🌍'}
                    </div>
                    <Countdown days={m.daysUntilDeparture} />
                  </div>
                  <UrgencyBadge voyage={m} compact />
                </div>
                <p className="text-xs font-bold line-clamp-1 w-full" style={{ color: '#e5e7eb' }}>
                  {m.title}
                </p>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] tabular-nums" style={{ color: '#6b7280' }}>
                    {m.nextOccurrence?.startDate}
                  </span>
                  <span className="text-[10px] font-bold tabular-nums"
                    style={{ color: m.avgFillRate >= 70 ? '#F59E0B' : '#10B981' }}>
                    {m.avgFillRate}%
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Voyage Row — Dense mode (1 ligne compacte)
// ═══════════════════════════════════════════════════════════════════════════════

function VoyageRowDense({
  model, selected, onToggleSelect, onOpen, onAction, index,
}: {
  model: VoyageModel; selected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (m: VoyageModel) => void;
  onAction: (action: string, m: VoyageModel) => void;
  index: number;
}) {
  const gradient = PAYS_GRADIENT[model.paysCode] ?? PAYS_GRADIENT.DEFAULT;
  const paysInfo = PAYS_LIST.find(p => p.code === model.paysCode);
  const urgent = model.tasks.some(t => t.level === 'critical') || model.daysUntilDeparture <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.18) }}
      whileHover={{ x: 2 }}
      className="relative group"
    >
      <div
        onClick={() => onOpen(model)}
        className="relative flex items-center gap-3 px-3 py-2 rounded-lg border overflow-hidden cursor-pointer transition-all"
        style={{
          background: selected
            ? 'rgba(212,168,83,0.08)'
            : 'rgba(19,25,42,0.55)',
          borderColor: selected
            ? `rgba(${hexToRgb(GOLD)}, 0.35)`
            : urgent
            ? 'rgba(239,68,68,0.2)'
            : 'rgba(255,255,255,0.05)',
        }}>

        {/* Urgency stripe */}
        {urgent && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(180deg, #EF4444, #F59E0B)` }} />
        )}

        {/* Checkbox */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSelect(model.id); }}
          aria-label={selected ? 'Désélectionner' : 'Sélectionner'}
          className="w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all"
          style={{
            background: selected ? GOLD : 'rgba(255,255,255,0.04)',
            border: `1px solid ${selected ? GOLD : 'rgba(255,255,255,0.15)'}`,
          }}>
          {selected && <CheckSquare className="w-2.5 h-2.5" style={{ color: BG_DARK }} />}
        </button>

        {/* Flag + pole */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0"
            style={{ background: gradient }}>
            {paysInfo?.flag ?? '🌍'}
          </div>
          <PoleBadge pole={model.pole} size="xs" />
        </div>

        {/* Title + destination */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="font-semibold text-xs truncate" style={{ color: '#e5e7eb' }}>
            {model.title}
          </span>
          {model.gamme === 'LUXE' && <Star className="w-2.5 h-2.5 shrink-0" fill={GOLD} style={{ color: GOLD }} />}
          <span className="text-[11px] truncate hidden md:inline" style={{ color: '#6b7280' }}>
            {model.destination}
          </span>
        </div>

        {/* Status */}
        <div className="hidden sm:block shrink-0">
          <StatusBadge status={model.status} size="xs" />
        </div>

        {/* Urgency */}
        <div className="shrink-0">
          <UrgencyBadge voyage={model} compact />
        </div>

        {/* Countdown */}
        <div className="shrink-0 hidden md:block" style={{ minWidth: 48 }}>
          <Countdown days={model.daysUntilDeparture} compact />
        </div>

        {/* Fill (tiny) */}
        <div className="hidden lg:block shrink-0" style={{ minWidth: 90 }}>
          <FillGauge pct={model.avgFillRate} compact />
        </div>

        {/* CA */}
        <div className="hidden xl:block shrink-0 text-right text-[11px] font-bold tabular-nums" style={{ color: '#10B981', minWidth: 70 }}>
          {formatPrice(model.totalCAPrevu)}
        </div>

        {/* Assignee */}
        <div className="shrink-0 hidden md:block">
          <Avatar initials={model.assigneeInitials} name={model.assignee} size="xs" />
        </div>

        {/* Quick actions (visible on hover) */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <QuickAction icon={Pencil} title="Modifier" onClick={(e) => { e.stopPropagation(); onAction('edit', model); }} />
          <QuickAction icon={Copy} title="Dupliquer" onClick={(e) => { e.stopPropagation(); onAction('duplicate', model); }} />
          <QuickAction icon={ExternalLink} title="Fiche publique" onClick={(e) => { e.stopPropagation(); onAction('public', model); }} />
        </div>

        <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: GOLD }} />
      </div>
    </motion.div>
  );
}

function QuickAction({
  icon: Icon, title, onClick,
}: { icon: React.ElementType; title: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: 'rgba(212,168,83,0.06)',
        border: '1px solid rgba(212,168,83,0.15)',
        color: GOLD,
      }}>
      <Icon className="w-3 h-3" />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Voyage Row — Comfort mode
// ═══════════════════════════════════════════════════════════════════════════════

function VoyageRowComfort({
  model, selected, onToggleSelect, onOpen, onAction, index,
}: {
  model: VoyageModel; selected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (m: VoyageModel) => void;
  onAction: (action: string, m: VoyageModel) => void;
  index: number;
}) {
  const gradient = PAYS_GRADIENT[model.paysCode] ?? PAYS_GRADIENT.DEFAULT;
  const paysInfo = PAYS_LIST.find(p => p.code === model.paysCode);
  const urgent = model.tasks.some(t => t.level === 'critical') || model.daysUntilDeparture <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.2), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.005, y: -1 }}
      className="relative rounded-xl border overflow-hidden cursor-pointer group"
      onClick={() => onOpen(model)}
      style={{
        background: `linear-gradient(145deg, rgba(19,25,42,0.75), rgba(15,20,34,0.65))`,
        borderColor: selected
          ? `rgba(${hexToRgb(GOLD)}, 0.4)`
          : urgent
          ? 'rgba(239,68,68,0.25)'
          : 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        boxShadow: selected
          ? `0 0 0 1px rgba(${hexToRgb(GOLD)}, 0.3), 0 8px 24px -8px rgba(${hexToRgb(GOLD)}, 0.12)`
          : '0 4px 14px -4px rgba(0,0,0,0.25)',
      }}>
      {urgent && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(180deg, #EF4444, #F59E0B)` }} />
      )}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(90deg, rgba(${hexToRgb(GOLD)}, 0.06) 0%, transparent 60%)` }} />

      <div className="relative flex items-center gap-3 p-3 pr-4">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSelect(model.id); }}
          aria-label={selected ? 'Désélectionner' : 'Sélectionner'}
          className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all"
          style={{
            background: selected ? GOLD : 'rgba(255,255,255,0.04)',
            border: `1px solid ${selected ? GOLD : 'rgba(255,255,255,0.15)'}`,
          }}>
          {selected
            ? <CheckSquare className="w-3.5 h-3.5" style={{ color: BG_DARK }} />
            : <Square className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />}
        </button>

        <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl relative overflow-hidden"
          style={{ background: gradient, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}>
          <span className="relative z-10 drop-shadow">{paysInfo?.flag ?? '🌍'}</span>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm truncate group-hover:text-white transition-colors" style={{ color: '#e5e7eb' }}>
              {model.title}
            </span>
            {model.gamme === 'LUXE' && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, color: BG_DARK }}>
                <Star className="w-2 h-2" fill={BG_DARK} />
                LUXE
              </span>
            )}
            <PoleBadge pole={model.pole} size="xs" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] flex items-center gap-0.5" style={{ color: '#8896a6' }}>
              <MapPin className="w-2.5 h-2.5" />
              {model.destination}
            </span>
            <span style={{ color: '#3f4858' }}>·</span>
            <span className="text-[11px] flex items-center gap-1" style={{ color: '#8896a6' }}>
              <Avatar initials={model.assigneeInitials} name={model.assignee} size="xs" />
              {model.assignee}
            </span>
            <span style={{ color: '#3f4858' }}>·</span>
            <span className="text-[11px]" style={{ color: '#8896a6' }}>{model.daysCount}j</span>
          </div>
        </div>

        {/* Status + urgency */}
        <div className="shrink-0 hidden sm:flex flex-col items-end gap-1">
          <StatusBadge status={model.status} />
          <div className="flex items-center gap-1.5">
            <UrgencyBadge voyage={model} />
            <Countdown days={model.daysUntilDeparture} />
          </div>
        </div>

        {/* Fill */}
        <div className="hidden md:block shrink-0" style={{ minWidth: 110 }}>
          <FillGauge pct={model.avgFillRate} />
          <div className="text-[10px] mt-1 text-right" style={{ color: '#6b7280' }}>
            {model.currentBookings}/{model.capacity} places
          </div>
        </div>

        {/* Prix */}
        <div className="hidden xl:block shrink-0 text-right" style={{ minWidth: 70 }}>
          <div className="text-sm font-bold tabular-nums" style={{ color: GOLD_LIGHT }}>
            {formatPrice(model.pricePerPersonCents)}
          </div>
          <div className="text-[10px]" style={{ color: '#6b7280' }}>par pers.</div>
        </div>

        {/* CA */}
        <div className="hidden lg:block shrink-0 text-right" style={{ minWidth: 90 }}>
          <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>
            {formatPrice(model.totalCAPrevu)}
          </div>
          <div className="text-[10px]" style={{ color: '#6b7280' }}>CA prévu</div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <QuickAction icon={Pencil} title="Modifier" onClick={(e) => { e.stopPropagation(); onAction('edit', model); }} />
          <QuickAction icon={Copy} title="Dupliquer" onClick={(e) => { e.stopPropagation(); onAction('duplicate', model); }} />
          <QuickAction icon={ExternalLink} title="Fiche publique" onClick={(e) => { e.stopPropagation(); onAction('public', model); }} />
        </div>

        <motion.div
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(212,168,83,0.08)',
            border: '1px solid rgba(212,168,83,0.18)',
            color: GOLD,
          }}
          whileHover={{ x: 2, background: 'rgba(212,168,83,0.18)' }}>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Voyage Grid Card
// ═══════════════════════════════════════════════════════════════════════════════

function VoyageGridCard({
  model, selected, onToggleSelect, onOpen, index,
}: {
  model: VoyageModel; selected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (m: VoyageModel) => void;
  index: number;
}) {
  const gradient = PAYS_GRADIENT[model.paysCode] ?? PAYS_GRADIENT.DEFAULT;
  const paysInfo = PAYS_LIST.find(p => p.code === model.paysCode);
  const urgent = model.tasks.some(t => t.level === 'critical') || model.daysUntilDeparture <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.25), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border overflow-hidden cursor-pointer"
      onClick={() => onOpen(model)}
      style={{
        background: `linear-gradient(145deg, rgba(19,25,42,0.85), rgba(10,14,20,0.7))`,
        borderColor: selected
          ? `rgba(${hexToRgb(GOLD)}, 0.45)`
          : urgent
          ? 'rgba(239,68,68,0.25)'
          : 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(14px)',
        boxShadow: selected
          ? `0 0 0 1px rgba(${hexToRgb(GOLD)}, 0.35), 0 18px 40px -16px rgba(${hexToRgb(GOLD)}, 0.3)`
          : '0 12px 32px -12px rgba(0,0,0,0.35)',
      }}>
      <div className="relative h-32 overflow-hidden" style={{ background: gradient }}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-80 group-hover:scale-110 transition-transform duration-700">
          {paysInfo?.flag ?? '🌍'}
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)' }} />

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSelect(model.id); }}
          aria-label={selected ? 'Désélectionner' : 'Sélectionner'}
          className="absolute top-3 left-3 w-6 h-6 rounded-md flex items-center justify-center transition-all z-10"
          style={{
            background: selected ? GOLD : 'rgba(10,14,20,0.6)',
            border: `1px solid ${selected ? GOLD : 'rgba(255,255,255,0.25)'}`,
            backdropFilter: 'blur(6px)',
          }}>
          {selected
            ? <CheckSquare className="w-3.5 h-3.5" style={{ color: BG_DARK }} />
            : <Square className="w-3.5 h-3.5" style={{ color: '#fff' }} />}
        </button>

        <div className="absolute top-3 right-3 flex items-center gap-1">
          {model.gamme === 'LUXE' && (
            <div className="inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-1 rounded-md"
              style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, color: BG_DARK, boxShadow: '0 4px 12px rgba(212,168,83,0.4)' }}>
              <Star className="w-2.5 h-2.5" fill={BG_DARK} />
              LUXE
            </div>
          )}
          <UrgencyBadge voyage={model} />
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <StatusBadge status={model.status} />
          <PoleBadge pole={model.pole} />
        </div>

        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold"
          style={{ background: 'rgba(10,14,20,0.75)', backdropFilter: 'blur(6px)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Countdown days={model.daysUntilDeparture} compact />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm mb-1 truncate group-hover:text-white transition-colors" style={{ color: '#e5e7eb' }}>
          {model.title}
        </h3>
        <div className="flex items-center gap-1 text-[11px] mb-3" style={{ color: '#8896a6' }}>
          <MapPin className="w-3 h-3" />
          {model.destination}
          <span style={{ color: '#3f4858' }}>·</span>
          <span>{model.daysCount}j</span>
        </div>

        <FillGauge pct={model.avgFillRate} compact />
        <div className="flex items-center justify-between mt-1 text-[10px]" style={{ color: '#6b7280' }}>
          <span>{model.currentBookings}/{model.capacity} places</span>
          <span>{model.upcomingCount} départ{model.upcomingCount > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-end justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Avatar initials={model.assigneeInitials} name={model.assignee} size="sm" />
            <div>
              <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#6b7280' }}>À partir de</p>
              <p className="text-base font-bold tabular-nums" style={{ color: GOLD_LIGHT }}>
                {formatPrice(model.pricePerPersonCents)}
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 2 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              color: BG_DARK,
              boxShadow: `0 4px 14px -4px rgba(${hexToRgb(GOLD)}, 0.5)`,
            }}>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Side panel
// ═══════════════════════════════════════════════════════════════════════════════

function VoyageSidePanel({
  voyage, onClose, onAction,
}: {
  voyage: VoyageModel | null;
  onClose: () => void;
  onAction: (action: string, voyage: VoyageModel) => void;
}) {
  const [activeSection, setActiveSection] = useState<'overview' | 'tasks' | 'occurrences' | 'bookings' | 'stats'>('overview');

  useEffect(() => { if (voyage) setActiveSection('overview'); }, [voyage]);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && voyage) onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [voyage, onClose]);

  const gradient = voyage ? (PAYS_GRADIENT[voyage.paysCode] ?? PAYS_GRADIENT.DEFAULT) : PAYS_GRADIENT.DEFAULT;
  const paysInfo = voyage ? PAYS_LIST.find(p => p.code === voyage.paysCode) : null;

  const sections = [
    { id: 'overview' as const,    label: 'Vue globale',  icon: Eye },
    { id: 'tasks' as const,       label: 'Tâches',       icon: Flag },
    { id: 'occurrences' as const, label: 'Occurrences',  icon: Calendar },
    { id: 'bookings' as const,    label: 'Réservations', icon: Users },
    { id: 'stats' as const,       label: 'Statistiques', icon: Activity },
  ];

  return (
    <AnimatePresence>
      {voyage && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90]"
            onClick={onClose}
            style={{ background: 'rgba(4,7,12,0.72)', backdropFilter: 'blur(6px)' }}
          />

          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-[100] w-full sm:w-[560px] lg:w-[680px] flex flex-col overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${BG_PANEL} 0%, ${BG_DARK} 100%)`,
              borderLeft: `1px solid rgba(${hexToRgb(GOLD)}, 0.2)`,
              boxShadow: '-24px 0 60px -20px rgba(0,0,0,0.7)',
            }}>
            {/* Hero */}
            <div className="relative h-48 shrink-0 overflow-hidden" style={{ background: gradient }}>
              <motion.div
                initial={{ scale: 1.15, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 0.85 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center text-[140px]">
                {paysInfo?.flag ?? '🌍'}
              </motion.div>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(10,14,20,0.92) 100%)' }} />

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                aria-label="Fermer (Échap)"
                style={{
                  background: 'rgba(10,14,20,0.7)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                }}>
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <StatusBadge status={voyage.status} size="md" />
                  {voyage.gamme === 'LUXE' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded"
                      style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, color: BG_DARK }}>
                      <Star className="w-2.5 h-2.5" fill={BG_DARK} />
                      LUXE
                    </span>
                  )}
                  <PoleBadge pole={voyage.pole} />
                  <span className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(10,14,20,0.6)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {voyage.daysCount} jours
                  </span>
                  <Countdown days={voyage.daysUntilDeparture} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  {voyage.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-white/80">
                  <MapPin className="w-3.5 h-3.5" />
                  {voyage.destination}
                  <span className="opacity-50">·</span>
                  <Avatar initials={voyage.assigneeInitials} name={voyage.assignee} size="xs" />
                  <span>{voyage.assignee}</span>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 px-6 py-3 shrink-0 overflow-x-auto"
              style={{ background: 'rgba(10,14,20,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <ActionButton label="Modifier" icon={Pencil} variant="gold" onClick={() => onAction('edit', voyage)} />
              <ActionButton
                label={normalizeStatus(voyage.status) === 'PUBLISHED' ? 'Dépublier' : 'Publier'}
                icon={normalizeStatus(voyage.status) === 'PUBLISHED' ? XCircle : ShieldCheck}
                variant={normalizeStatus(voyage.status) === 'PUBLISHED' ? 'danger' : 'success'}
                onClick={() => onAction('toggle-publish', voyage)}
              />
              <ActionButton label="Dupliquer" icon={Copy} variant="ghost" onClick={() => onAction('duplicate', voyage)} />
              <ActionButton label="Archiver" icon={Archive} variant="ghost" onClick={() => onAction('archive', voyage)} />
              <ActionButton label="Supprimer" icon={Trash2} variant="danger-ghost" onClick={() => onAction('delete', voyage)} />
              <div className="ml-auto">
                <ActionButton label="Voir en public" icon={ExternalLink} variant="ghost" onClick={() => onAction('public', voyage)} />
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex gap-1 px-6 pt-4 shrink-0 overflow-x-auto">
              {sections.map(s => {
                const Icon = s.icon;
                const active = activeSection === s.id;
                const badge = s.id === 'tasks' ? voyage.tasks.length : 0;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSection(s.id)}
                    className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all rounded-t-lg whitespace-nowrap"
                    style={{
                      color: active ? GOLD : '#6b7280',
                      background: active ? 'rgba(212,168,83,0.08)' : 'transparent',
                    }}>
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                    {badge > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold"
                        style={{ background: '#EF4444', color: '#fff' }}>
                        {badge}
                      </span>
                    )}
                    {active && (
                      <motion.div
                        layoutId="section-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5" style={{ background: 'rgba(6,9,15,0.3)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}>
                  {activeSection === 'overview' && <SectionOverview voyage={voyage} />}
                  {activeSection === 'tasks' && <SectionTasks voyage={voyage} />}
                  {activeSection === 'occurrences' && <SectionOccurrences voyage={voyage} />}
                  {activeSection === 'bookings' && <SectionBookings voyage={voyage} />}
                  {activeSection === 'stats' && <SectionStats voyage={voyage} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ActionButton({
  label, icon: Icon, onClick, variant = 'ghost',
}: {
  label: string; icon: React.ElementType; onClick: () => void;
  variant?: 'gold' | 'success' | 'danger' | 'danger-ghost' | 'ghost';
}) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    gold:          { bg: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: BG_DARK, border: `1px solid ${GOLD}` },
    success:       { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' },
    danger:        { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' },
    'danger-ghost':{ bg: 'rgba(255,255,255,0.03)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' },
    ghost:         { bg: 'rgba(255,255,255,0.04)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.08)' },
  };
  const s = styles[variant];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: s.border }}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Side-panel sections
// ═══════════════════════════════════════════════════════════════════════════════

function SectionOverview({ voyage }: { voyage: VoyageModel }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="Prix par personne" value={formatPrice(voyage.pricePerPersonCents)} color={GOLD} icon={Euro} />
        <MiniStat label="Taux de remplissage" value={`${voyage.avgFillRate}%`} color={voyage.avgFillRate >= 70 ? '#F59E0B' : '#10B981'} icon={TrendingUp} />
        <MiniStat label="Places réservées" value={`${voyage.currentBookings}/${voyage.capacity}`} color="#8B5CF6" icon={Users} />
        <MiniStat label="CA prévu" value={formatPrice(voyage.totalCAPrevu)} color="#10B981" icon={DollarSign} />
      </div>

      <InfoBlock title="Équipe & opérations">
        <div className="flex items-center justify-between py-1">
          <span className="text-xs" style={{ color: '#6b7280' }}>Pôle responsable</span>
          <PoleBadge pole={voyage.pole} />
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs" style={{ color: '#6b7280' }}>Personne assignée</span>
          <div className="flex items-center gap-2">
            <Avatar initials={voyage.assigneeInitials} name={voyage.assignee} size="xs" />
            <span className="text-xs font-semibold" style={{ color: '#e5e7eb' }}>{voyage.assignee}</span>
          </div>
        </div>
        <InfoRow label="Pro créateur" value={voyage.proName} />
        {voyage.deadline && <InfoRow label="Deadline interne" value={voyage.deadline} />}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs" style={{ color: '#6b7280' }}>Tâches ouvertes</span>
          <UrgencyBadge voyage={voyage} />
        </div>
      </InfoBlock>

      <InfoBlock title="Informations générales">
        <InfoRow label="Référence" value={voyage.id} mono />
        <InfoRow label="Slug" value={voyage.slug} mono />
        <InfoRow label="Durée" value={`${voyage.daysCount} jours / ${voyage.nightsCount} nuits`} />
        <InfoRow label="Gamme" value={voyage.gamme} />
        <InfoRow label="Note" value={`★ ${voyage.rating} (${voyage.reviewsCount} avis)`} />
        <InfoRow label="Créé le" value={new Date(voyage.createdAt).toLocaleDateString('fr-FR')} />
        <InfoRow label="Mis à jour" value={new Date(voyage.updatedAt).toLocaleDateString('fr-FR')} />
      </InfoBlock>

      {voyage.tags?.length > 0 && (
        <InfoBlock title="Tags">
          <div className="flex flex-wrap gap-1.5">
            {voyage.tags.map(tag => (
              <span key={tag}
                className="text-[11px] px-2 py-1 rounded-full font-medium"
                style={{
                  background: 'rgba(212,168,83,0.08)',
                  color: GOLD_LIGHT,
                  border: '1px solid rgba(212,168,83,0.15)',
                }}>
                {tag}
              </span>
            ))}
          </div>
        </InfoBlock>
      )}
    </div>
  );
}

function SectionTasks({ voyage }: { voyage: VoyageModel }) {
  if (voyage.tasks.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl"
        style={{ background: 'rgba(16,185,129,0.05)', border: '1px dashed rgba(16,185,129,0.2)' }}>
        <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#10B981' }} />
        <p className="text-sm font-bold" style={{ color: '#10B981' }}>Aucune tâche en attente</p>
        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Ce voyage est à jour</p>
      </div>
    );
  }

  const levelMeta: Record<UrgencyTask['level'], { color: string; label: string; icon: React.ElementType }> = {
    critical: { color: '#EF4444', label: 'Critique', icon: Flame },
    high:     { color: '#F59E0B', label: 'Haute',    icon: AlertCircle },
    medium:   { color: '#8B5CF6', label: 'Moyenne',  icon: Bell },
    low:      { color: '#8896a6', label: 'Basse',    icon: Minus },
  };

  return (
    <div className="space-y-2">
      {voyage.tasks.map((task, idx) => {
        const m = levelMeta[task.level];
        const Icon = m.icon;
        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl border"
            style={{
              background: `linear-gradient(90deg, rgba(${hexToRgb(m.color)}, 0.08), rgba(19,25,42,0.6))`,
              borderColor: `rgba(${hexToRgb(m.color)}, 0.2)`,
            }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `rgba(${hexToRgb(m.color)}, 0.15)`, border: `1px solid rgba(${hexToRgb(m.color)}, 0.3)` }}>
              <Icon className="w-4 h-4" style={{ color: m.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: '#e5e7eb' }}>{task.label}</p>
              <p className="text-[11px]" style={{ color: m.color }}>{m.label}</p>
            </div>
            <button
              type="button"
              className="text-[11px] font-semibold px-2 py-1 rounded-md"
              style={{
                background: 'rgba(212,168,83,0.08)',
                color: GOLD,
                border: '1px solid rgba(212,168,83,0.15)',
              }}>
              Résoudre
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

function SectionOccurrences({ voyage }: { voyage: VoyageModel }) {
  return (
    <div className="space-y-3">
      {voyage.occurrences.map((occ, idx) => {
        const pct = Math.round((occ.seatsBooked / voyage.capacity) * 100);
        const ca = voyage.pricePerPersonCents * occ.seatsBooked;
        const statusColor = occ.status === 'OPEN' ? '#10B981'
          : occ.status === 'FULL' ? '#EF4444'
          : occ.status === 'CANCELLED' ? '#EF4444'
          : '#8896a6';
        return (
          <motion.div
            key={occ.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl p-4 border"
            style={{ background: 'rgba(19,25,42,0.6)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-mono" style={{ color: '#6b7280' }}>#{String(idx + 1).padStart(2, '0')}</div>
                <div className="font-bold text-sm tabular-nums" style={{ color: '#e5e7eb' }}>
                  {occ.startDate} → {occ.endDate}
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ background: `rgba(${hexToRgb(statusColor)}, 0.12)`, color: statusColor, border: `1px solid rgba(${hexToRgb(statusColor)}, 0.25)` }}>
                {occ.status}
              </span>
            </div>
            <FillGauge pct={pct} compact />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span style={{ color: '#6b7280' }}>{occ.seatsBooked}/{voyage.capacity} places</span>
              <span className="font-bold tabular-nums" style={{ color: '#10B981' }}>{formatPrice(ca)}</span>
            </div>
          </motion.div>
        );
      })}
      <button
        type="button"
        className="w-full text-xs flex items-center justify-center gap-1.5 py-3 rounded-xl transition-all hover:scale-[1.01]"
        style={{
          background: 'rgba(212,168,83,0.06)',
          color: GOLD,
          border: '1px dashed rgba(212,168,83,0.25)',
        }}>
        <Plus className="w-3.5 h-3.5" /> Ajouter une occurrence
      </button>
    </div>
  );
}

function SectionBookings({ voyage }: { voyage: VoyageModel }) {
  return (
    <div className="space-y-3">
      <InfoBlock title="Récapitulatif">
        <InfoRow label="Total réservations" value={String(voyage.currentBookings)} />
        <InfoRow label="Capacité totale" value={String(voyage.capacity)} />
        <InfoRow label="Places disponibles" value={String(voyage.capacity - voyage.currentBookings)} />
        <InfoRow label="Taux remplissage" value={`${voyage.avgFillRate}%`} />
      </InfoBlock>
      <div className="text-center py-8 rounded-xl"
        style={{ background: 'rgba(19,25,42,0.4)', border: '1px dashed rgba(255,255,255,0.08)' }}>
        <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#4b5563' }} />
        <p className="text-xs" style={{ color: '#6b7280' }}>La liste détaillée des réservations</p>
        <p className="text-xs" style={{ color: '#6b7280' }}>sera chargée depuis l&apos;API</p>
      </div>
    </div>
  );
}

function SectionStats({ voyage }: { voyage: VoyageModel }) {
  const chartData = useMemo(() => voyage.occurrences.map((o, i) => ({
    name: `#${i + 1}`,
    réservations: o.seatsBooked,
    capacité: voyage.capacity,
  })), [voyage]);

  return (
    <div className="space-y-4">
      <InfoBlock title="Performance par occurrence">
        <div className="h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="réservations" stroke={GOLD} strokeWidth={2} fill="url(#bookingsGrad)" />
              <RTooltip
                contentStyle={{
                  background: BG_PANEL, border: `1px solid rgba(${hexToRgb(GOLD)}, 0.3)`,
                  borderRadius: 8, fontSize: 12, color: '#e5e7eb',
                }}
                cursor={{ stroke: GOLD, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </InfoBlock>

      <InfoBlock title="Indicateurs">
        <InfoRow label="Nombre d&apos;occurrences" value={String(voyage.occurrences.length)} />
        <InfoRow label="Prochains départs" value={String(voyage.upcomingCount)} />
        <InfoRow label="Remplissage moyen" value={`${voyage.avgFillRate}%`} />
        <InfoRow label="CA cumulé" value={formatPrice(voyage.totalCAPrevu)} />
        <InfoRow label="Score d&apos;urgence" value={String(voyage.urgencyScore)} />
      </InfoBlock>
    </div>
  );
}

function MiniStat({
  label, value, color, icon: Icon,
}: { label: string; value: string; color: string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl p-3 border"
      style={{
        background: `linear-gradient(145deg, rgba(19,25,42,0.7), rgba(10,14,20,0.55))`,
        borderColor: `rgba(${hexToRgb(color)}, 0.18)`,
      }}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#6b7280' }}>{label}</p>
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      </div>
      <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-wider font-bold mb-2" style={{ color: GOLD_LIGHT }}>
        {title}
      </h3>
      <div className="rounded-xl p-4 space-y-2 border"
        style={{
          background: `linear-gradient(145deg, rgba(19,25,42,0.65), rgba(10,14,20,0.45))`,
          borderColor: 'rgba(255,255,255,0.06)',
        }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs py-1">
      <span className="shrink-0" style={{ color: '#6b7280' }}>{label}</span>
      <span className={`${mono ? 'font-mono text-[11px]' : 'font-semibold'} text-right truncate`} style={{ color: '#e5e7eb' }}>
        {value}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Pagination
// ═══════════════════════════════════════════════════════════════════════════════

function Pagination({
  page, pageSize, total, onPageChange, onPageSizeChange,
}: {
  page: number; pageSize: number; total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const pages = useMemo(() => {
    const arr: (number | 'ellipsis')[] = [];
    const range = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== 'ellipsis') {
        arr.push('ellipsis');
      }
    }
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2" style={{ color: '#8896a6' }}>
        <span>Afficher</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
          className="rounded-lg px-2 py-1 font-semibold"
          style={{
            background: 'rgba(19,25,42,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e5e7eb',
          }}>
          {[20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span>par page · {from}–{to} sur {total}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#c7d2fe',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) => p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-1" style={{ color: '#4b5563' }}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className="min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all px-2"
            style={{
              background: page === p
                ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`
                : 'rgba(255,255,255,0.04)',
              color: page === p ? BG_DARK : '#c7d2fe',
              border: page === p ? `1px solid ${GOLD}` : '1px solid rgba(255,255,255,0.06)',
              boxShadow: page === p ? `0 4px 14px -4px rgba(${hexToRgb(GOLD)}, 0.4)` : 'none',
            }}>
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#c7d2fe',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Bulk bar
// ═══════════════════════════════════════════════════════════════════════════════

function BulkBar({
  count, onAction, onClear,
}: {
  count: number; onAction: (a: string) => void; onClear: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{
            background: `linear-gradient(145deg, rgba(19,25,42,0.95), rgba(10,14,20,0.95))`,
            border: `1px solid rgba(${hexToRgb(GOLD)}, 0.3)`,
            backdropFilter: 'blur(16px)',
            boxShadow: `0 20px 60px -18px rgba(${hexToRgb(GOLD)}, 0.45), 0 0 0 1px rgba(255,255,255,0.02)`,
          }}>
          <div className="flex items-center gap-2 pl-3 pr-4 py-1 border-r" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: BG_DARK }}>
              {count}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#e5e7eb' }}>
              sélectionné{count > 1 ? 's' : ''}
            </span>
          </div>
          <ActionButton label="Publier" icon={ShieldCheck} variant="success" onClick={() => onAction('bulk-publish')} />
          <ActionButton label="Archiver" icon={Archive} variant="ghost" onClick={() => onAction('bulk-archive')} />
          <ActionButton label="Exporter" icon={Download} variant="ghost" onClick={() => onAction('bulk-export')} />
          <ActionButton label="Supprimer" icon={Trash2} variant="danger-ghost" onClick={() => onAction('bulk-delete')} />
          <button
            type="button"
            onClick={onClear}
            aria-label="Effacer la sélection"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#8896a6', border: '1px solid rgba(255,255,255,0.06)' }}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Keyboard help overlay
// ═══════════════════════════════════════════════════════════════════════════════

function KeyboardHelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const shortcuts = [
    { keys: ['/'],            label: 'Focus barre de recherche' },
    { keys: ['N'],            label: 'Créer un nouveau voyage' },
    { keys: ['R'],            label: 'Actualiser la liste' },
    { keys: ['V'],            label: 'Changer de vue (dense/confort/grille)' },
    { keys: ['Échap'],        label: 'Fermer le panneau de détail' },
    { keys: ['?'],            label: 'Afficher cette aide' },
  ];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110]"
            style={{ background: 'rgba(4,7,12,0.7)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] w-[92vw] max-w-md rounded-2xl p-6"
            style={{
              background: `linear-gradient(145deg, ${BG_PANEL}, ${BG_DARK})`,
              border: `1px solid rgba(${hexToRgb(GOLD)}, 0.25)`,
              boxShadow: `0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
            }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Raccourcis clavier</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#8896a6' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                  <span style={{ color: '#c7d2fe' }}>{s.label}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j}
                        className="inline-flex items-center justify-center min-w-[26px] h-7 px-2 rounded-md text-[11px] font-bold font-mono"
                        style={{
                          background: 'rgba(212,168,83,0.08)',
                          color: GOLD_LIGHT,
                          border: '1px solid rgba(212,168,83,0.2)',
                          boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.2)',
                        }}>
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Catalogue view
// ═══════════════════════════════════════════════════════════════════════════════

function CatalogueView({
  models, onOpen, onAction, viewMode, onViewModeChange,
}: {
  models: VoyageModel[];
  onOpen: (m: VoyageModel) => void;
  onAction: (action: string, m: VoyageModel) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('urgency');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(viewMode === 'dense' ? 50 : 20);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => { setPage(1); }, [models.length]);

  const sortedModels = useMemo(() => {
    const copy = [...models];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'price': cmp = a.pricePerPersonCents - b.pricePerPersonCents; break;
        case 'fill': cmp = a.avgFillRate - b.avgFillRate; break;
        case 'bookings': cmp = a.currentBookings - b.currentBookings; break;
        case 'ca': cmp = a.totalCAPrevu - b.totalCAPrevu; break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'urgency': cmp = a.urgencyScore - b.urgencyScore; break;
        case 'date': cmp = a.daysUntilDeparture - b.daysUntilDeparture; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [models, sortKey, sortDir]);

  const pagedModels = useMemo(() => {
    const from = (page - 1) * pageSize;
    return sortedModels.slice(from, from + pageSize);
  }, [sortedModels, page, pageSize]);

  const toggleSelect = useCallback((id: string) => {
    setSelected(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const allOnPageSelected = pagedModels.length > 0 && pagedModels.every(m => selected.has(m.id));

  const toggleSelectAllOnPage = useCallback(() => {
    setSelected(s => {
      const next = new Set(s);
      if (allOnPageSelected) pagedModels.forEach(m => next.delete(m.id));
      else pagedModels.forEach(m => next.add(m.id));
      return next;
    });
  }, [allOnPageSelected, pagedModels]);

  const handleBulk = useCallback((action: string) => {
    logger.info(`Bulk: ${action}`, { ids: Array.from(selected) });
    alert(`Action groupée: ${action}\n${selected.size} voyage(s) sélectionné(s)`);
  }, [selected]);

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <DepartureTimeline models={models} onOpen={onOpen} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-xl overflow-hidden"
          style={{ background: 'rgba(19,25,42,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {([
            { mode: 'dense' as ViewMode,   icon: Rows3,      label: 'Dense' },
            { mode: 'comfort' as ViewMode, icon: ListIcon,   label: 'Confort' },
            { mode: 'grid' as ViewMode,    icon: LayoutGrid, label: 'Grille' },
          ]).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
              style={{
                background: viewMode === mode ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` : 'transparent',
                color: viewMode === mode ? BG_DARK : '#8896a6',
              }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(19,25,42,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Sliders className="w-3.5 h-3.5" style={{ color: GOLD }} />
          <span className="text-[11px] font-semibold" style={{ color: '#6b7280' }}>Trier par</span>
          <select
            value={sortKey}
            onChange={(e) => { setSortKey(e.currentTarget.value as SortKey); setPage(1); }}
            className="text-xs font-semibold bg-transparent outline-none"
            style={{ color: '#e5e7eb' }}>
            <option value="urgency">Urgence</option>
            <option value="date">Prochain départ</option>
            <option value="title">Titre</option>
            <option value="price">Prix</option>
            <option value="fill">Remplissage</option>
            <option value="bookings">Réservations</option>
            <option value="ca">CA prévu</option>
            <option value="status">Statut</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            aria-label="Inverser le tri"
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{ background: 'rgba(212,168,83,0.12)', color: GOLD }}>
            {sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Select all */}
        {viewMode !== 'grid' && pagedModels.length > 0 && (
          <button
            type="button"
            onClick={toggleSelectAllOnPage}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: allOnPageSelected ? 'rgba(212,168,83,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${allOnPageSelected ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: allOnPageSelected ? GOLD : '#8896a6',
            }}>
            {allOnPageSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            {allOnPageSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        )}

        <span className="ml-auto text-xs" style={{ color: '#6b7280' }}>
          <span className="font-bold" style={{ color: GOLD }}>{models.length}</span> voyage{models.length > 1 ? 's' : ''}
          {selected.size > 0 && (
            <> · <span className="font-bold" style={{ color: GOLD_LIGHT }}>{selected.size}</span> sélectionné{selected.size > 1 ? 's' : ''}</>
          )}
        </span>
      </div>

      {/* Content */}
      {pagedModels.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'dense' ? (
        <div className="space-y-1.5">
          {pagedModels.map((m, i) => (
            <VoyageRowDense
              key={m.id}
              model={m}
              selected={selected.has(m.id)}
              onToggleSelect={toggleSelect}
              onOpen={onOpen}
              onAction={onAction}
              index={i}
            />
          ))}
        </div>
      ) : viewMode === 'comfort' ? (
        <div className="space-y-2">
          {pagedModels.map((m, i) => (
            <VoyageRowComfort
              key={m.id}
              model={m}
              selected={selected.has(m.id)}
              onToggleSelect={toggleSelect}
              onOpen={onOpen}
              onAction={onAction}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pagedModels.map((m, i) => (
            <VoyageGridCard
              key={m.id}
              model={m}
              selected={selected.has(m.id)}
              onToggleSelect={toggleSelect}
              onOpen={onOpen}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {models.length > 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={models.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </div>
      )}

      <BulkBar
        count={selected.size}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-24 rounded-2xl border"
      style={{
        background: 'rgba(19,25,42,0.4)',
        borderColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
      }}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
        style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.18)' }}>
        <Globe className="w-8 h-8" style={{ color: GOLD }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: '#e5e7eb' }}>Aucun voyage trouvé</p>
      <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
        Ajustez vos filtres ou créez un nouveau voyage
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Validation queue (tabs P1/P2/...)
// ═══════════════════════════════════════════════════════════════════════════════

interface TravelFlat {
  id: string; title: string; status: string;
  createdBy?: { firstName: string; lastName: string };
  startDate?: string; endDate?: string;
  bookingCount?: number; capacity?: number; revenue?: number;
}

const FALLBACK_FLAT: TravelFlat[] = DEMO_TRAVELS_FULL.map(t => ({
  id: t.id, title: t.title, status: t.status,
  createdBy: { firstName: t.proName.split(' ')[0], lastName: t.proName.split(' ').slice(1).join(' ') },
  startDate: t.occurrences[0]?.startDate, endDate: t.occurrences[0]?.endDate,
  bookingCount: t.currentBookings, capacity: t.capacity,
  revenue: t.pricePerPersonCents * t.currentBookings,
}));

function ValidationQueue({
  tabId, travels, loading, onAction,
}: {
  tabId: string; travels: TravelFlat[]; loading: boolean;
  onAction: (travel: TravelFlat) => void;
}) {
  const isPriorityTab = tabId === 'p1_review' || tabId === 'p2_review';

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl animate-pulse"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
      ))}
    </div>
  );

  if (!travels.length) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20 rounded-2xl border"
      style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(19,25,42,0.4)' }}>
      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: '#10B981' }} />
      <p className="font-semibold text-sm" style={{ color: '#e5e7eb' }}>
        {isPriorityTab ? 'File vide — aucune validation en attente' : 'Aucun voyage dans cette catégorie'}
      </p>
    </motion.div>
  );

  return (
    <div className="space-y-2">
      {travels.map((t, idx) => {
        const booked = t.bookingCount || 0;
        const cap = t.capacity || 0;
        const pct = cap ? Math.round((booked / cap) * 100) : 0;
        const normStatus = normalizeStatus(t.status);
        const meta = STATUS_META[normStatus] ?? STATUS_META['DRAFT'];
        const demoTravel = DEMO_TRAVELS_FULL.find(dt => dt.id === t.id);
        const tPaysCode = demoTravel ? (COUNTRY_TO_CODE[demoTravel.country] ?? 'FR') : 'FR';
        const paysInfo = PAYS_LIST.find(p => p.code === tPaysCode);
        const gradient = PAYS_GRADIENT[tPaysCode] ?? PAYS_GRADIENT.DEFAULT;

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.2) }}
            whileHover={{ y: -1 }}
            className="flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all"
            onClick={() => onAction(t)}
            style={{
              background: 'rgba(19,25,42,0.7)',
              borderColor: meta.priority ? meta.ring : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              boxShadow: meta.priority ? `0 0 12px ${meta.bg}` : '0 4px 14px -4px rgba(0,0,0,0.2)',
            }}>
            <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-xl overflow-hidden"
              style={{ background: gradient }}>
              {paysInfo?.flag ?? '🌍'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm" style={{ color: '#e5e7eb' }}>{t.title}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: '#8896a6' }}>
                  {t.createdBy ? `${t.createdBy.firstName} ${t.createdBy.lastName}` : '—'}
                </span>
                {t.startDate && (
                  <>
                    <span style={{ color: '#3f4858' }}>·</span>
                    <span className="text-xs" style={{ color: '#8896a6' }}>
                      <Calendar className="w-2.5 h-2.5 inline mr-0.5" />
                      {t.startDate}
                    </span>
                  </>
                )}
              </div>
            </div>
            <StatusBadge status={t.status} />
            {cap > 0 && (
              <div className="hidden md:block" style={{ minWidth: 110 }}>
                <FillGauge pct={pct} />
                <div className="text-[10px] text-right mt-0.5" style={{ color: '#6b7280' }}>
                  {booked}/{cap}
                </div>
              </div>
            )}
            <div className="hidden lg:block text-right" style={{ minWidth: 80 }}>
              <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>
                {formatPrice(t.revenue || 0)}
              </div>
            </div>
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              whileHover={{ x: 2 }}
              style={{
                background: 'rgba(212,168,83,0.08)',
                border: '1px solid rgba(212,168,83,0.18)',
                color: GOLD,
              }}>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main page
// ═══════════════════════════════════════════════════════════════════════════════

export default function VoyagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('catalogue');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePays, setActivePays] = useState('ALL');
  const [activeGamme, setActiveGamme] = useState<'ALL' | 'STANDARD' | 'LUXE'>('ALL');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [activePole, setActivePole] = useState<PoleId | 'ALL'>('ALL');
  const [activePro, setActivePro] = useState<string>('ALL');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('comfort');
  const [flatTravels, setFlatTravels] = useState<TravelFlat[]>([]);
  const [loading, setLoading] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [selectedVoyage, setSelectedVoyage] = useState<VoyageModel | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const fetchTravels = useCallback(async (signal?: AbortSignal) => {
    if (activeTab === 'catalogue' || activeTab === 'urgent') return;
    try {
      setLoading(true);
      const tab = QUEUE_TABS.find(t => t.id === activeTab);
      let endpoint = '/admin/travels';
      if (activeTab === 'p1_review') endpoint = '/admin/travels/pending';
      else if (tab && 'statuses' in tab && tab.statuses) endpoint = `/admin/travels?status=${tab.statuses[0]}`;
      const data = await apiClient.get<TravelFlat[] | { data: TravelFlat[] }>(endpoint, { signal });
      let list = Array.isArray(data) ? data : (data as { data: TravelFlat[] }).data || [];
      if (searchQuery) list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setFlatTravels(list);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      logger.warn('API /admin/travels indisponible — données démo');
      setFlatTravels(FALLBACK_FLAT);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchTravels(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchTravels, retryKey]);

  useAdminKeyboardShortcuts({ searchShortcut: 'search-voyages', onRefresh: () => setRetryKey(k => k + 1) });

  // Keyboard: N, V, ?
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (inField) return;
      if (e.key === '?') { e.preventDefault(); setShowHelp(v => !v); }
      else if (e.key.toLowerCase() === 'n') { e.preventDefault(); router.push('/admin/voyages/creer'); }
      else if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setViewMode(v => v === 'dense' ? 'comfort' : v === 'comfort' ? 'grid' : 'dense');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  const proList = useMemo(() => {
    const set = new Set(CATALOGUE_MODELS.map(m => m.proName));
    return Array.from(set).sort();
  }, []);

  const filteredModels = useMemo(() => {
    return CATALOGUE_MODELS.filter(m => {
      if (activePays !== 'ALL' && m.paysCode !== activePays) return false;
      if (activeGamme !== 'ALL' && m.gamme !== activeGamme) return false;
      if (activeStatus !== 'ALL' && normalizeStatus(m.status) !== activeStatus) return false;
      if (activePole !== 'ALL' && m.pole !== activePole) return false;
      if (activePro !== 'ALL' && m.proName !== activePro) return false;
      if (activeTab === 'urgent' && m.urgencyScore < 30) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!m.title.toLowerCase().includes(q)
          && !m.proName.toLowerCase().includes(q)
          && !m.destination.toLowerCase().includes(q)
          && !m.id.toLowerCase().includes(q)
          && !m.slug.toLowerCase().includes(q)
          && !m.assignee.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activePays, activeGamme, activeStatus, activePole, activePro, searchQuery, activeTab]);

  const displayedFlat = useMemo(() => {
    const tab = QUEUE_TABS.find(t => t.id === activeTab);
    let list = [...flatTravels];
    if (tab && 'statuses' in tab && tab.statuses) {
      list = list.filter(t => (tab.statuses as readonly string[]).includes(t.status) || (tab.statuses as readonly string[]).includes(normalizeStatus(t.status)));
    }
    if (searchQuery) list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return list;
  }, [flatTravels, activeTab, searchQuery]);

  const queueCounts = useMemo(() => {
    const counts: Record<string, number> = {
      catalogue: CATALOGUE_MODELS.length,
      urgent: CATALOGUE_MODELS.filter(m => m.urgencyScore >= 30).length,
    };
    QUEUE_TABS.filter(t => 'statuses' in t && t.statuses).forEach(tab => {
      counts[tab.id] = FALLBACK_FLAT.filter(t =>
        (tab as typeof tab & { statuses: readonly string[] }).statuses.includes(t.status) ||
        (tab as typeof tab & { statuses: readonly string[] }).statuses.includes(normalizeStatus(t.status))
      ).length;
    });
    return counts;
  }, []);

  // KPIs
  const kpis = useMemo(() => {
    const all = CATALOGUE_MODELS;
    const published = all.filter(m => ['PUBLISHED', 'ON_GOING'].includes(normalizeStatus(m.status))).length;
    const avgFill = all.length ? Math.round(all.reduce((s, m) => s + m.avgFillRate, 0) / all.length) : 0;
    const caTotal = all.reduce((s, m) => s + m.totalCAPrevu, 0);
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const departsThisMonth = all.reduce((s, m) => s + m.occurrences.filter(o => {
      const d = new Date(o.startDate);
      return d >= now && d <= endOfMonth;
    }).length, 0);
    const urgentCount = all.filter(m => m.urgencyScore >= 30).length;
    const totalTasks = all.reduce((s, m) => s + m.tasks.length, 0);
    const criticalTasks = all.reduce((s, m) => s + m.tasks.filter(t => t.level === 'critical').length, 0);

    const buildSpark = (extract: (m: VoyageModel) => number) =>
      Array.from({ length: 8 }, (_, i) => {
        const slice = all.slice(0, Math.max(1, Math.floor((i + 1) * all.length / 8)));
        return { v: Math.max(1, Math.round(slice.reduce((s, m) => s + extract(m), 0) / Math.max(1, slice.length))) };
      });

    return {
      total: all.length, published, avgFill, caTotal, departsThisMonth,
      urgentCount, totalTasks, criticalTasks,
      sparkTotal: buildSpark(() => 1),
      sparkCA: buildSpark((m) => m.totalCAPrevu / 100000),
      sparkFill: buildSpark((m) => m.avgFillRate),
      sparkDeparts: buildSpark((m) => m.upcomingCount),
      sparkUrgent: buildSpark((m) => Math.min(5, m.tasks.length)),
      sparkTasks: buildSpark((m) => m.tasks.length),
    };
  }, []);

  const handleVoyageAction = useCallback((action: string, voyage: VoyageModel) => {
    switch (action) {
      case 'edit':
        router.push(`/admin/voyages/${voyage.id}`);
        break;
      case 'public':
        window.open(`/voyages/${voyage.slug}`, '_blank');
        break;
      case 'duplicate':
      case 'toggle-publish':
      case 'archive':
      case 'delete':
        logger.info(`Action ${action} sur ${voyage.id}`);
        alert(`Action: ${action}\nVoyage: ${voyage.title}\n(à brancher sur l'API)`);
        break;
      default:
        logger.info(`Action inconnue: ${action}`);
    }
  }, [router]);

  const activeFiltersCount =
    (activePays !== 'ALL' ? 1 : 0) +
    (activeGamme !== 'ALL' ? 1 : 0) +
    (activeStatus !== 'ALL' ? 1 : 0) +
    (activePole !== 'ALL' ? 1 : 0) +
    (activePro !== 'ALL' ? 1 : 0);

  return (
    <div className="admin-fade-in space-y-6 pb-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs mb-1" style={{ color: '#6b7280' }}>Admin › Voyages</div>
          <h1 className="text-3xl font-bold tracking-tight"
            style={{
              background: `linear-gradient(135deg, #fff 0%, ${GOLD_LIGHT} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            Opérations Voyages
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8896a6' }}>
            Catalogue complet · Timeline départs · Validation Phase 1/2 · Contrôle terrain
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => setShowHelp(true)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Afficher les raccourcis clavier"
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
            style={{
              background: 'rgba(19,25,42,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#c7d2fe',
            }}>
            <Keyboard className="w-3.5 h-3.5" />
            <kbd className="text-[10px] font-mono px-1 rounded"
              style={{ background: 'rgba(212,168,83,0.1)', color: GOLD_LIGHT }}>?</kbd>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setRetryKey(k => k + 1)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            style={{
              background: 'rgba(19,25,42,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#c7d2fe',
            }}>
            <RefreshCw className="w-3.5 h-3.5" /> Actualiser
          </motion.button>
          <ExportCta exportType="travels_csv" label="Exporter" />
          <motion.button
            type="button"
            onClick={() => router.push('/admin/voyages/creer')}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
              color: BG_DARK,
              boxShadow: `0 12px 32px -10px rgba(${hexToRgb(GOLD)}, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)`,
              border: `1px solid ${GOLD_LIGHT}`,
            }}>
            <Plus className="w-4 h-4" /> Nouveau voyage
          </motion.button>
        </div>
      </motion.div>

      {/* ── KPIs ── */}
      {(activeTab === 'catalogue' || activeTab === 'urgent') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Voyages actifs"
            value={kpis.published}
            sub={`${kpis.total} au total`}
            color={GOLD}
            icon={Globe}
            sparkline={kpis.sparkTotal}
            trend={{ dir: 'up', pct: 12 }}
          />
          <KpiCard
            label="Remplissage moyen"
            value={kpis.avgFill}
            sub="tous voyages"
            color="#10B981"
            icon={TrendingUp}
            sparkline={kpis.sparkFill}
            formatValue={(v) => `${Math.round(v)}%`}
            trend={{ dir: 'up', pct: 6 }}
          />
          <KpiCard
            label="Départs ce mois"
            value={kpis.departsThisMonth}
            sub="occurrences à venir"
            color="#F59E0B"
            icon={Calendar}
            sparkline={kpis.sparkDeparts}
            trend={{ dir: 'flat', pct: 0 }}
          />
          <KpiCard
            label="Voyages urgents"
            value={kpis.urgentCount}
            sub={`${kpis.criticalTasks} tâche${kpis.criticalTasks > 1 ? 's' : ''} critique${kpis.criticalTasks > 1 ? 's' : ''}`}
            color="#EF4444"
            icon={Flame}
            sparkline={kpis.sparkUrgent}
            pulse={kpis.criticalTasks > 0}
            onClick={() => setActiveTab('urgent')}
          />
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 flex-wrap">
        {QUEUE_TABS.map(tab => {
          const count = queueCounts[tab.id] ?? 0;
          const isActive = activeTab === tab.id;
          const isPriority = (tab.id === 'urgent' || tab.id === 'p1_review' || tab.id === 'p2_review') && count > 0;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabId)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{
                background: isActive
                  ? `linear-gradient(145deg, rgba(${hexToRgb(tab.color)}, 0.2), rgba(${hexToRgb(tab.color)}, 0.08))`
                  : 'rgba(19,25,42,0.4)',
                color: isActive ? tab.color : isPriority ? tab.color : '#8896a6',
                border: isActive
                  ? `1px solid rgba(${hexToRgb(tab.color)}, 0.35)`
                  : '1px solid rgba(255,255,255,0.05)',
                boxShadow: isActive ? `0 4px 16px -6px rgba(${hexToRgb(tab.color)}, 0.25)` : 'none',
              }}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: isActive ? `rgba(${hexToRgb(tab.color)}, 0.3)` : 'rgba(255,255,255,0.08)',
                    color: isActive ? tab.color : isPriority ? tab.color : '#6b7280',
                    boxShadow: isPriority ? `0 0 8px rgba(${hexToRgb(tab.color)}, 0.4)` : 'none',
                  }}>
                  {count}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── Search + Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border overflow-hidden"
        style={{
          background: `linear-gradient(145deg, rgba(19,25,42,0.6), rgba(10,14,20,0.45))`,
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
        }}>
        <div className="flex flex-wrap items-center gap-3 p-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: GOLD }} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Rechercher titre, destination, pro, équipe, ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(10,14,20,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#e5e7eb',
              }}
              data-shortcut="search-voyages"
              aria-label="Rechercher un voyage"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(212,168,83,0.1)', color: GOLD_LIGHT, border: '1px solid rgba(212,168,83,0.2)' }}>
              /
            </kbd>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer"
                className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#8896a6' }}>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {(activeTab === 'catalogue' || activeTab === 'urgent') && (
            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: showAdvanced ? 'rgba(212,168,83,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${showAdvanced ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: showAdvanced ? GOLD : '#c7d2fe',
              }}>
              <Filter className="w-3.5 h-3.5" />
              Filtres avancés
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                  style={{ background: GOLD, color: BG_DARK }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}

          {/* Quick pays filter */}
          {(activeTab === 'catalogue' || activeTab === 'urgent') && (
            <div className="flex gap-1 flex-wrap overflow-x-auto">
              {PAYS_LIST.slice(0, 8).map(p => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setActivePays(p.code)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                  style={{
                    background: activePays === p.code
                      ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`
                      : 'rgba(255,255,255,0.04)',
                    color: activePays === p.code ? BG_DARK : '#8896a6',
                  }}>
                  <span className="mr-1">{p.flag}</span>{p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showAdvanced && (activeTab === 'catalogue' || activeTab === 'urgent') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex flex-wrap items-center gap-4 p-4" style={{ background: 'rgba(6,9,15,0.3)' }}>
                {/* Pôle */}
                <FilterGroup label="Pôle">
                  <div className="flex rounded-lg overflow-hidden flex-wrap"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                      type="button"
                      onClick={() => setActivePole('ALL')}
                      className="px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        background: activePole === 'ALL' ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` : 'transparent',
                        color: activePole === 'ALL' ? BG_DARK : '#8896a6',
                      }}>
                      Tous
                    </button>
                    {(Object.keys(POLE_META) as PoleId[]).map(p => {
                      const meta = POLE_META[p];
                      const Icon = meta.icon;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setActivePole(p)}
                          className="px-3 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1"
                          style={{
                            background: activePole === p ? `rgba(${hexToRgb(meta.color)}, 0.15)` : 'transparent',
                            color: activePole === p ? meta.color : '#8896a6',
                          }}>
                          <Icon className="w-3 h-3" />
                          {meta.short}
                        </button>
                      );
                    })}
                  </div>
                </FilterGroup>

                <FilterGroup label="Gamme">
                  <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    {(['ALL', 'STANDARD', 'LUXE'] as const).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setActiveGamme(g)}
                        className="px-3 py-1.5 text-xs font-semibold transition-all"
                        style={{
                          background: activeGamme === g
                            ? g === 'LUXE' ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`
                            : 'transparent',
                          color: activeGamme === g ? BG_DARK : '#8896a6',
                        }}>
                        {g === 'LUXE' && <Star className="w-2.5 h-2.5 inline mr-0.5" fill={activeGamme === 'LUXE' ? BG_DARK : 'none'} />}
                        {g === 'ALL' ? 'Tous' : g === 'STANDARD' ? 'Standard' : 'Luxe'}
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup label="Statut">
                  <select
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.currentTarget.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold outline-none"
                    style={{
                      background: 'rgba(19,25,42,0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#e5e7eb',
                    }}>
                    <option value="ALL">Tous statuts</option>
                    {Object.entries(STATUS_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </FilterGroup>

                <FilterGroup label="Pro créateur">
                  <select
                    value={activePro}
                    onChange={(e) => setActivePro(e.currentTarget.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold outline-none min-w-[160px]"
                    style={{
                      background: 'rgba(19,25,42,0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#e5e7eb',
                    }}>
                    <option value="ALL">Tous les pros</option>
                    {proList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FilterGroup>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePays('ALL');
                      setActiveGamme('ALL');
                      setActiveStatus('ALL');
                      setActivePole('ALL');
                      setActivePro('ALL');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#EF4444',
                    }}>
                    <X className="w-3 h-3" />
                    Réinitialiser
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
        {activeTab === 'catalogue' || activeTab === 'urgent' ? (
          <CatalogueView
            models={filteredModels}
            onOpen={(m) => setSelectedVoyage(m)}
            onAction={handleVoyageAction}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        ) : (
          <ValidationQueue
            tabId={activeTab}
            travels={displayedFlat}
            loading={loading}
            onAction={(t) => {
              const model = CATALOGUE_MODELS.find(m => m.id === t.id);
              if (model) setSelectedVoyage(model);
              else router.push(`/admin/voyages/${t.id}`);
            }}
          />
        )}
      </motion.div>

      {/* Side panel */}
      <VoyageSidePanel
        voyage={selectedVoyage}
        onClose={() => setSelectedVoyage(null)}
        onAction={handleVoyageAction}
      />

      {/* Keyboard help */}
      <KeyboardHelpOverlay open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: '#6b7280' }}>
        {label}
      </span>
      {children}
    </div>
  );
}
