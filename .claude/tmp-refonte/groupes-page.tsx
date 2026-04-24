'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Users, TrendingUp, Share2, Download, RefreshCw, AlertTriangle,
  Search, Filter, LayoutGrid, List as ListIcon, Calendar, X,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown,
  Plus, Minus, Send, Archive, Edit3, MoreVertical, Eye, Crown,
  MapPin, Clock, MessageCircle, Activity, Zap, Sparkles,
  CheckCircle2, XCircle, Ban, Flame, Link2, UserPlus, UserMinus,
  Bell, History, BarChart3, CheckSquare, Square, Trash2,
  Copy, ExternalLink, PieChart, Target, Crosshair, Mail,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { apiClient } from '@/lib/api-client';

// Types

type GroupStatus = 'FORMING' | 'ACTIVE' | 'CONFIRMED' | 'FULL' | 'TRAVELING' | 'COMPLETED' | 'CLOSED' | 'SUSPENDED';
type MemberRole = 'LEADER' | 'CO_LEADER' | 'MEMBER' | 'GUEST';
type ViewMode = 'list' | 'grid' | 'timeline';
type SortKey = 'departure' | 'size' | 'fill' | 'destination' | 'created' | 'name';
type SortDir = 'asc' | 'desc';

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarColor: string;
  joinedAt: string;
}

interface HistoryEntry {
  date: string;
  type: 'created' | 'member_joined' | 'member_left' | 'message' | 'modified' | 'status_changed';
  label: string;
  actor?: string;
}

interface AdminGroup {
  id: string;
  name: string;
  code: string;
  status: GroupStatus;
  maxCapacity: number;
  memberCount: number;
  pendingInvites: number;
  members: Member[];
  leaderName: string;
  leaderEmail: string;
  travelTitle: string;
  travelId: string;
  travelSlug: string;
  destination: string;
  country: string;
  flag: string;
  proId: string;
  proName: string;
  departureDate?: string;
  createdAt: string;
  messageCount: number;
  shareCount: number;
  conversionRate: number;
  energyScore: number;
  activitiesCount: number;
  reported: boolean;
  hasConflict: boolean;
  history: HistoryEntry[];
  lastMessage?: { author: string; text: string; at: string };
}

interface GroupStats {
  totalGroups: number;
  activeGroups: number;
  totalMembers: number;
  avgSize: number;
  fillRate: number;
  nextDepartures: number;
  incompleteNearDeparture: number;
  conflicts: number;
  totalShares: number;
  suspendedGroups: number;
}

// Constants

const GOLD = '#D4A853';
const BG = '#0A0E14';
const SURFACE = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';
const GLASS: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}` };

const STATUS_META: Record<GroupStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  FORMING:    { label: 'En formation', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  icon: Users },
  ACTIVE:     { label: 'Actif',        color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: Activity },
  CONFIRMED:  { label: 'Confirme',     color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  icon: CheckCircle2 },
  FULL:       { label: 'Complet',      color: '#D4A853', bg: 'rgba(212,168,83,0.12)',  icon: Crown },
  TRAVELING:  { label: 'En voyage',    color: '#F97316', bg: 'rgba(249,115,22,0.12)',  icon: Sparkles },
  COMPLETED:  { label: 'Termine',      color: '#8896a6', bg: 'rgba(136,150,166,0.10)', icon: CheckCircle2 },
  CLOSED:     { label: 'Ferme',        color: '#6B7280', bg: 'rgba(107,114,128,0.10)', icon: XCircle },
  SUSPENDED:  { label: 'Suspendu',     color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: Ban },
};

const ROLE_META: Record<MemberRole, { label: string; color: string }> = {
  LEADER:    { label: 'Leader',    color: '#D4A853' },
  CO_LEADER: { label: 'Co-leader', color: '#8B5CF6' },
  MEMBER:    { label: 'Membre',    color: '#3B82F6' },
  GUEST:     { label: 'Invite',    color: '#8896a6' },
};

const PAGE_SIZE = 12;

// Demo data

function makeMembers(count: number, leader: string, email: string): Member[] {
  const palette = ['#D4A853', '#8B5CF6', '#3B82F6', '#10B981', '#F97316', '#EC4899', '#F59E0B', '#06B6D4'];
  const names = ['Marie D.', 'Jean L.', 'Sophie M.', 'Karim H.', 'Lucas M.', 'Emma R.', 'Paul T.', 'Lea B.', 'Noa F.', 'Yanis K.', 'Chloe V.', 'Hugo P.', 'Zoe G.', 'Tom C.', 'Ines S.'];
  const members: Member[] = [{
    id: 'm0', name: leader, email,
    role: 'LEADER', avatarColor: palette[0],
    joinedAt: '2026-03-01T10:00:00Z',
  }];
  for (let i = 1; i < count; i++) {
    members.push({
      id: `m${i}`,
      name: names[i % names.length],
      email: `member${i}@example.com`,
      role: i === 1 && count > 3 ? 'CO_LEADER' : 'MEMBER',
      avatarColor: palette[i % palette.length],
      joinedAt: `2026-03-${String(5 + (i % 20)).padStart(2, '0')}T10:00:00Z`,
    });
  }
  return members;
}

function makeHistory(name: string, count: number): HistoryEntry[] {
  return [
    { date: '2026-03-01T10:00:00Z', type: 'created', label: 'Groupe cree', actor: name },
    { date: '2026-03-05T14:00:00Z', type: 'member_joined', label: 'Nouveau membre : Sophie M.', actor: 'Sophie M.' },
    { date: '2026-03-12T09:00:00Z', type: 'message', label: `${count} messages echanges`, actor: name },
    { date: '2026-03-20T16:00:00Z', type: 'modified', label: 'Capacite augmentee (+2 places)' },
    { date: '2026-04-02T11:00:00Z', type: 'status_changed', label: 'Statut : Actif' },
  ];
}

const COUNTRIES = [
  { code: 'MA', label: 'Maroc',    flag: 'MA' },
  { code: 'ES', label: 'Espagne',  flag: 'ES' },
  { code: 'IT', label: 'Italie',   flag: 'IT' },
  { code: 'PT', label: 'Portugal', flag: 'PT' },
  { code: 'GR', label: 'Grece',    flag: 'GR' },
  { code: 'TR', label: 'Turquie',  flag: 'TR' },
  { code: 'FR', label: 'France',   flag: 'FR' },
];

function generateDemoGroups(): AdminGroup[] {
  const travels = [
    { id: 't1', title: 'Marrakech Express',        slug: 'marrakech-express',        dest: 'Marrakech',  country: 'MA', flag: 'MA', proId: 'p1', pro: 'Karim Voyages' },
    { id: 't2', title: 'Lisbonne Longweekend',     slug: 'lisbonne-longweekend',     dest: 'Lisbonne',   country: 'PT', flag: 'PT', proId: 'p2', pro: 'Atlas Travel' },
    { id: 't3', title: 'Barcelona Premium',        slug: 'barcelona-premium',        dest: 'Barcelone',  country: 'ES', flag: 'ES', proId: 'p3', pro: 'Iberia Pro' },
    { id: 't4', title: 'Santorin Sunset',          slug: 'santorin-sunset',          dest: 'Santorin',   country: 'GR', flag: 'GR', proId: 'p4', pro: 'Olympus Tours' },
    { id: 't5', title: 'Rome Eternelle',           slug: 'rome-eternelle',           dest: 'Rome',       country: 'IT', flag: 'IT', proId: 'p5', pro: 'Bella Italia' },
    { id: 't6', title: 'Istanbul Imperial',        slug: 'istanbul-imperial',        dest: 'Istanbul',   country: 'TR', flag: 'TR', proId: 'p6', pro: 'Bosphore Travel' },
    { id: 't7', title: 'Corse Sauvage',            slug: 'corse-sauvage',            dest: 'Ajaccio',    country: 'FR', flag: 'FR', proId: 'p7', pro: 'Ile de Beaute' },
    { id: 't8', title: 'Seville Flamenca',         slug: 'seville-flamenca',         dest: 'Seville',    country: 'ES', flag: 'ES', proId: 'p3', pro: 'Iberia Pro' },
    { id: 't9', title: 'Essaouira Surf',           slug: 'essaouira-surf',           dest: 'Essaouira',  country: 'MA', flag: 'MA', proId: 'p1', pro: 'Karim Voyages' },
    { id: 't10', title: 'Porto Vineyards',         slug: 'porto-vineyards',          dest: 'Porto',      country: 'PT', flag: 'PT', proId: 'p2', pro: 'Atlas Travel' },
  ];

  const statuses: GroupStatus[] = ['FORMING', 'ACTIVE', 'CONFIRMED', 'FULL', 'TRAVELING', 'COMPLETED', 'CLOSED', 'SUSPENDED'];
  const leaderNames = ['Marie Dupont', 'Jean Leclerc', 'Sophie Moreau', 'Karim Hadj', 'Lucas Martin', 'Emma Riviere', 'Paul Thomas', 'Lea Bernard', 'Noa Faure', 'Yanis Khaled', 'Chloe Vidal', 'Hugo Petit', 'Zoe Garnier', 'Tom Colin', 'Ines Simon'];
  const groupPrefixes = ['Les Aventuriers', 'Escapade', 'Team Building', 'Groupe libre', 'Les Marseillais', 'Evasion', 'Les Explorateurs', 'Roadtrip', 'Famille & Amis', 'Summer Vibes', 'Eternel Voyage', 'Les Nomades', 'Tribu', 'Les Epicuriens', 'Route du Sud'];

  const result: AdminGroup[] = [];
  for (let i = 0; i < 68; i++) {
    const travel = travels[i % travels.length];
    const status = statuses[i % statuses.length];
    const capacity = [6, 8, 10, 12, 15, 18, 20][i % 7];
    const memberCount = Math.max(1, Math.min(capacity, Math.round(capacity * (0.3 + (i % 7) * 0.11))));
    const leader = leaderNames[i % leaderNames.length];
    const email = `${leader.toLowerCase().replace(' ', '.')}@example.com`;
    const prefix = groupPrefixes[i % groupPrefixes.length];
    const reported = i % 23 === 0;
    const hasConflict = i % 19 === 0;
    const daysOffset = (i % 9) * 7 - 10;
    const departureDate = new Date(2026, 4 + (i % 4), 5 + daysOffset).toISOString();

    result.push({
      id: `g${i + 1}`,
      name: `${prefix} ${travel.dest} ${2026 + (i % 2)}`,
      code: `${travel.dest.slice(0, 3).toUpperCase()}${String(i + 100).padStart(3, '0')}`,
      status,
      maxCapacity: capacity,
      memberCount,
      pendingInvites: Math.max(0, Math.min(6, (i % 5))),
      members: makeMembers(memberCount, leader, email),
      leaderName: leader,
      leaderEmail: email,
      travelTitle: travel.title,
      travelId: travel.id,
      travelSlug: travel.slug,
      destination: travel.dest,
      country: travel.country,
      flag: travel.flag,
      proId: travel.proId,
      proName: travel.pro,
      departureDate,
      createdAt: new Date(2026, 2, 1 + (i % 28)).toISOString(),
      messageCount: Math.round(5 + (i * 7.3) % 150),
      shareCount: Math.round((i * 3.1) % 40),
      conversionRate: Number((0.2 + ((i * 0.07) % 0.5)).toFixed(2)),
      energyScore: Math.round(40 + (i * 4.7) % 60),
      activitiesCount: Math.round(2 + (i * 1.3) % 15),
      reported,
      hasConflict,
      history: makeHistory(leader, memberCount),
      lastMessage: i % 3 === 0 ? { author: leader, text: 'Hate d\'y etre, qui prend le transport ?', at: '2026-04-20T14:30:00Z' } : undefined,
    });
  }
  return result;
}

const DEMO_GROUPS = generateDemoGroups();

// Animated counter

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, latest => Math.round(latest));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: 'easeOut' });
    const unsub = rounded.on('change', v => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value, mv, rounded]);
  return <span>{display}{suffix}</span>;
}

// Helpers

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const diff = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
  return diff;
}

function fillColor(pct: number): string {
  if (pct >= 100) return '#10B981';
  if (pct >= 80)  return '#D4A853';
  if (pct >= 50)  return '#3B82F6';
  return '#F59E0B';
}

// Initials avatar

function Avatar({ name, color, size = 32 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold flex-shrink-0"
      style={{ width: size, height: size, background: `${color}22`, color, border: `1px solid ${color}44`, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

// Main component

export default function AdminGroupesPage() {
  const [groups, setGroups] = useState<AdminGroup[]>(DEMO_GROUPS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | GroupStatus>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterPro, setFilterPro] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('departure');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ groups: AdminGroup[] }>('/admin/groups');
      if (data?.groups?.length) setGroups(data.groups);
    } catch {
      logger.warn('[AdminGroupes] API indisponible — mode demo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  // Derived stats

  const stats: GroupStats = useMemo(() => {
    const active = groups.filter(g => ['FORMING', 'ACTIVE', 'CONFIRMED', 'FULL'].includes(g.status));
    const totalMembers = groups.reduce((s, g) => s + g.memberCount, 0);
    const totalCapacity = groups.reduce((s, g) => s + g.maxCapacity, 0);
    const avgSize = groups.length ? totalMembers / groups.length : 0;
    const fillRate = totalCapacity ? (totalMembers / totalCapacity) * 100 : 0;
    const nextDepartures = groups.filter(g => {
      const d = daysUntil(g.departureDate);
      return d !== null && d >= 0 && d <= 30;
    }).length;
    const incompleteNearDeparture = groups.filter(g => {
      const d = daysUntil(g.departureDate);
      return d !== null && d >= 0 && d <= 14 && g.memberCount < g.maxCapacity * 0.7 && g.status !== 'CLOSED' && g.status !== 'SUSPENDED';
    }).length;
    const conflicts = groups.filter(g => g.hasConflict).length;
    const totalShares = groups.reduce((s, g) => s + g.shareCount, 0);
    const suspended = groups.filter(g => g.status === 'SUSPENDED').length;
    return {
      totalGroups: groups.length,
      activeGroups: active.length,
      totalMembers,
      avgSize: Number(avgSize.toFixed(1)),
      fillRate: Math.round(fillRate),
      nextDepartures,
      incompleteNearDeparture,
      conflicts,
      totalShares,
      suspendedGroups: suspended,
    };
  }, [groups]);

  // Filtering + sorting

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = groups.filter(g => {
      if (filterStatus !== 'all' && g.status !== filterStatus) return false;
      if (filterCountry !== 'all' && g.country !== filterCountry) return false;
      if (filterPro !== 'all' && g.proId !== filterPro) return false;
      if (filterSize !== 'all') {
        if (filterSize === 'small' && g.maxCapacity > 8) return false;
        if (filterSize === 'medium' && (g.maxCapacity < 9 || g.maxCapacity > 14)) return false;
        if (filterSize === 'large' && g.maxCapacity < 15) return false;
      }
      if (filterDate !== 'all') {
        const d = daysUntil(g.departureDate);
        if (d === null) return false;
        if (filterDate === 'week' && (d < 0 || d > 7)) return false;
        if (filterDate === 'month' && (d < 0 || d > 30)) return false;
        if (filterDate === 'quarter' && (d < 0 || d > 90)) return false;
      }
      if (q) {
        const hay = `${g.name} ${g.code} ${g.leaderName} ${g.leaderEmail} ${g.travelTitle} ${g.destination} ${g.proName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'departure': return ((a.departureDate || '') < (b.departureDate || '') ? -1 : 1) * dir;
        case 'size':      return (a.memberCount - b.memberCount) * dir;
        case 'fill':      return ((a.memberCount / a.maxCapacity) - (b.memberCount / b.maxCapacity)) * dir;
        case 'destination': return a.destination.localeCompare(b.destination) * dir;
        case 'created':   return (a.createdAt < b.createdAt ? -1 : 1) * dir;
        case 'name':      return a.name.localeCompare(b.name) * dir;
      }
    });
    return list;
  }, [groups, search, filterStatus, filterCountry, filterPro, filterSize, filterDate, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const proOptions = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach(g => map.set(g.proId, g.proName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [groups]);

  const alertsReported = groups.filter(g => g.reported);

  // Actions

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === pageItems.length) setSelected(new Set());
    else setSelected(new Set(pageItems.map(g => g.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const handleAction = async (groupId: string, action: 'suspend' | 'unsuspend' | 'close' | 'archive') => {
    try {
      await apiClient.post(`/admin/groups/${groupId}/${action}`, {});
    } catch {
      logger.warn(`[AdminGroupes] Action ${action} en mode demo`);
    }
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      if (action === 'suspend')   return { ...g, status: 'SUSPENDED' };
      if (action === 'unsuspend') return { ...g, status: 'ACTIVE' };
      if (action === 'close')     return { ...g, status: 'CLOSED' };
      if (action === 'archive')   return { ...g, status: 'COMPLETED' };
      return g;
    }));
  };

  const handleBulk = async (action: 'notify' | 'archive' | 'close') => {
    const ids = Array.from(selected);
    for (const id of ids) {
      if (action === 'archive') await handleAction(id, 'archive');
      if (action === 'close')   await handleAction(id, 'close');
    }
    clearSelection();
  };

  const handleExport = () => {
    const header = 'Nom,Code,Statut,Membres,Capacite,Remplissage,Leader,Voyage,Destination,Pro,Depart,Messages,Partages\n';
    const rows = filtered.map(g => [
      g.name, g.code, g.status, g.memberCount, g.maxCapacity,
      `${Math.round((g.memberCount / g.maxCapacity) * 100)}%`,
      g.leaderName, g.travelTitle, g.destination, g.proName,
      formatDate(g.departureDate), g.messageCount, g.shareCount,
    ].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groupes-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openedGroup = openGroupId ? groups.find(g => g.id === openGroupId) ?? null : null;

  const resetFilters = () => {
    setSearch(''); setFilterStatus('all'); setFilterCountry('all');
    setFilterPro('all'); setFilterSize('all'); setFilterDate('all');
  };

  const activeFilterCount =
    (filterStatus !== 'all' ? 1 : 0) +
    (filterCountry !== 'all' ? 1 : 0) +
    (filterPro !== 'all' ? 1 : 0) +
    (filterSize !== 'all' ? 1 : 0) +
    (filterDate !== 'all' ? 1 : 0);

  // Loading skeleton

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ background: BG, color: '#E5E7EB' }}>
        <div className="animate-pulse space-y-5">
          <div className="h-10 w-64 rounded-xl" style={{ background: SURFACE }} />
          <div className="grid grid-cols-6 gap-3">
            {[0,1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-xl" style={{ background: SURFACE }} />)}
          </div>
          <div className="h-14 rounded-xl" style={{ background: SURFACE }} />
          <div className="h-96 rounded-xl" style={{ background: SURFACE }} />
        </div>
      </div>
    );
  }

  // Render

  return (
    <div className="min-h-screen relative" style={{ background: BG, color: '#E5E7EB' }}>
      {/* Decorative gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative p-6 max-w-[1600px] mx-auto">
        {/* ─── Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase px-2 py-1 rounded" style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                Admin
              </span>
              <span className="text-[11px] text-gray-500">Operations</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: GOLD, letterSpacing: '-0.02em' }}>
              Groupes de voyageurs
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Pilote tous les groupes — composition, remplissage, operations
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/admin/groupes/analytics"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(139,92,246,0.10)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
              <BarChart3 size={13} /> Analytics
            </Link>
            <Link href="/admin/groupes/settings"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/5"
              style={GLASS}>
              <Edit3 size={13} /> Parametres
            </Link>
            <button onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white transition-all hover:bg-white/5"
              style={GLASS}>
              <Download size={13} /> Export CSV
            </button>
            <button onClick={fetchGroups}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white transition-all hover:bg-white/5"
              style={GLASS}>
              <RefreshCw size={13} /> Actualiser
            </button>
          </div>
        </motion.div>

        {/* ─── Alertes ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {stats.incompleteNearDeparture > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>{stats.incompleteNearDeparture} groupes incomplets</p>
                <p className="text-xs text-gray-400">Depart dans moins de 14 jours</p>
              </div>
            </motion.div>
          )}
          {stats.conflicts > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.25)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)' }}>
                <Crosshair size={18} style={{ color: '#EC4899' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EC4899' }}>{stats.conflicts} conflits detectes</p>
                <p className="text-xs text-gray-400">Chevauchements ou doublons</p>
              </div>
            </motion.div>
          )}
          {alertsReported.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <Ban size={18} style={{ color: '#EF4444' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>{alertsReported.length} groupes signales</p>
                <p className="text-xs text-gray-400">Verification manuelle requise</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── KPIs ──────────────────────────────────────────── */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
        >
          {[
            { label: 'Total groupes',     value: stats.totalGroups,      color: GOLD,      icon: Users,        sub: `${stats.activeGroups} actifs` },
            { label: 'Membres',           value: stats.totalMembers,     color: '#3B82F6', icon: Users,        sub: `moy. ${stats.avgSize}/groupe` },
            { label: 'Taux remplissage',  value: stats.fillRate,         color: '#10B981', icon: Target,       sub: 'capacite globale', suffix: '%' },
            { label: 'Prochains departs', value: stats.nextDepartures,   color: '#F97316', icon: Calendar,     sub: 'dans 30 jours' },
            { label: 'Partages',          value: stats.totalShares,      color: '#8B5CF6', icon: Share2,       sub: 'viralite cumulee' },
            { label: 'Suspendus',         value: stats.suspendedGroups,  color: stats.suspendedGroups ? '#EF4444' : '#6B7280', icon: Ban, sub: 'a traiter' },
          ].map((k, i) => (
            <motion.div key={i}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -2 }}
              className="rounded-xl p-4 transition-all cursor-default"
              style={{ ...GLASS, backdropFilter: 'blur(8px)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{k.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }}>
                  <k.icon size={13} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: k.color }}>
                <AnimatedCounter value={Number(k.value) || 0} suffix={k.suffix || ''} />
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{k.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Toolbar ───────────────────────────────────────── */}
        <div className="rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2" style={{ ...GLASS, backdropFilter: 'blur(12px)' }}>
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher un groupe, code, leader, voyage..."
              className="w-full pl-9 pr-9 py-2 rounded-xl text-sm bg-white/[0.03] text-gray-200 placeholder-gray-500 outline-none focus:bg-white/[0.05]"
              style={{ border: `1px solid ${BORDER}` }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters toggle */}
          <button onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={activeFilterCount > 0
              ? { background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }
              : { ...GLASS, color: '#9CA3AF' }}
          >
            <Filter size={13} /> Filtres
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold" style={{ background: GOLD, color: '#000' }}>
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={GLASS}>
            <ArrowUpDown size={12} className="text-gray-500 ml-1" />
            <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
              className="bg-transparent text-xs text-gray-300 outline-none py-1">
              <option value="departure">Date depart</option>
              <option value="size">Taille</option>
              <option value="fill">Remplissage</option>
              <option value="destination">Destination</option>
              <option value="created">Creation</option>
              <option value="name">Nom</option>
            </select>
            <button onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="text-gray-400 hover:text-white text-xs px-1.5 py-1 rounded hover:bg-white/5">
              {sortDir === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* View toggle */}
          <div className="flex items-center p-0.5 rounded-xl" style={GLASS}>
            {[
              { v: 'list' as ViewMode, icon: ListIcon, label: 'Liste' },
              { v: 'grid' as ViewMode, icon: LayoutGrid, label: 'Grille' },
              { v: 'timeline' as ViewMode, icon: Clock, label: 'Timeline' },
            ].map(opt => (
              <button key={opt.v} onClick={() => setViewMode(opt.v)}
                title={opt.label}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={viewMode === opt.v
                  ? { background: `${GOLD}18`, color: GOLD }
                  : { background: 'transparent', color: '#6B7280' }}>
                <opt.icon size={13} />
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 ml-auto">
            <span className="text-gray-300 font-semibold">{filtered.length}</span> / {groups.length} groupes
          </div>
        </div>

        {/* Filters expanded */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-3" style={{ ...GLASS, backdropFilter: 'blur(12px)' }}>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5 block">Statut</label>
                  <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white/[0.03] text-gray-200 outline-none"
                    style={{ border: `1px solid ${BORDER}` }}>
                    <option value="all">Tous</option>
                    {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5 block">Destination</label>
                  <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white/[0.03] text-gray-200 outline-none"
                    style={{ border: `1px solid ${BORDER}` }}>
                    <option value="all">Toutes</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5 block">Pro organisateur</label>
                  <select value={filterPro} onChange={e => { setFilterPro(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white/[0.03] text-gray-200 outline-none"
                    style={{ border: `1px solid ${BORDER}` }}>
                    <option value="all">Tous</option>
                    {proOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5 block">Taille</label>
                  <select value={filterSize} onChange={e => { setFilterSize(e.target.value as any); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white/[0.03] text-gray-200 outline-none"
                    style={{ border: `1px solid ${BORDER}` }}>
                    <option value="all">Toutes</option>
                    <option value="small">Petit (≤8)</option>
                    <option value="medium">Moyen (9-14)</option>
                    <option value="large">Grand (≥15)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1.5 block">Depart</label>
                  <select value={filterDate} onChange={e => { setFilterDate(e.target.value as any); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white/[0.03] text-gray-200 outline-none"
                    style={{ border: `1px solid ${BORDER}` }}>
                    <option value="all">Toutes dates</option>
                    <option value="week">7 jours</option>
                    <option value="month">30 jours</option>
                    <option value="quarter">90 jours</option>
                  </select>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters}
                    className="col-span-full md:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white"
                    style={GLASS}>
                    <X size={12} /> Reinitialiser
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Bulk actions bar ──────────────────────────────── */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-xl p-3 mb-4 flex items-center gap-3 flex-wrap"
              style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30` }}
            >
              <span className="text-sm font-semibold" style={{ color: GOLD }}>
                {selected.size} groupe{selected.size > 1 ? 's' : ''} selectionne{selected.size > 1 ? 's' : ''}
              </span>
              <div className="h-4 w-px" style={{ background: 'rgba(212,168,83,0.3)' }} />
              <button onClick={() => handleBulk('notify')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-[1.02] transition-all"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}>
                <Send size={12} /> Notification groupee
              </button>
              <button onClick={() => handleBulk('archive')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-[1.02] transition-all"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
                <Archive size={12} /> Archiver
              </button>
              <button onClick={() => handleBulk('close')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-[1.02] transition-all"
                style={{ background: 'rgba(107,114,128,0.15)', color: '#9CA3AF', border: '1px solid rgba(107,114,128,0.3)' }}>
                <XCircle size={12} /> Fermer
              </button>
              <button onClick={clearSelection}
                className="ml-auto text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <X size={12} /> Annuler
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main view ─────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} hasFilters={activeFilterCount > 0 || search.length > 0} />
        ) : viewMode === 'list' ? (
          <ListView
            items={pageItems}
            selected={selected}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onOpen={setOpenGroupId}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={toggleSort}
            onAction={handleAction}
          />
        ) : viewMode === 'grid' ? (
          <GridView items={pageItems} selected={selected} onToggleSelect={toggleSelect} onOpen={setOpenGroupId} />
        ) : (
          <TimelineView items={filtered} onOpen={setOpenGroupId} />
        )}

        {/* ─── Pagination ───────────────────────────────────── */}
        {viewMode !== 'timeline' && totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-xs text-gray-500">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur <span className="text-gray-300">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                style={GLASS}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .map((n, idx, arr) => (
                  <React.Fragment key={n}>
                    {idx > 0 && arr[idx - 1] !== n - 1 && <span className="text-xs text-gray-600 px-1">…</span>}
                    <button onClick={() => setPage(n)}
                      className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                      style={n === page
                        ? { background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}40` }
                        : { ...GLASS, color: '#9CA3AF' }}>
                      {n}
                    </button>
                  </React.Fragment>
                ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                style={GLASS}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Side panel ──────────────────────────────────────── */}
      <AnimatePresence>
        {openedGroup && (
          <SidePanel
            group={openedGroup}
            onClose={() => setOpenGroupId(null)}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function EmptyState({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
  return (
    <div className="rounded-xl p-12 flex flex-col items-center text-center" style={GLASS}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(212,168,83,0.1)' }}>
        <Users size={24} style={{ color: GOLD }} />
      </div>
      <p className="text-lg font-semibold text-gray-200 mb-1">Aucun groupe trouve</p>
      <p className="text-sm text-gray-500 mb-4">
        {hasFilters ? 'Ajuste ou reinitialise tes filtres' : 'Aucun groupe pour le moment'}
      </p>
      {hasFilters && (
        <button onClick={onReset} className="px-4 py-2 rounded-lg text-xs font-medium"
          style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>
          Reinitialiser les filtres
        </button>
      )}
    </div>
  );
}

function ListView({ items, selected, onToggleSelect, onSelectAll, onOpen, sortKey, sortDir, onSort, onAction }: {
  items: AdminGroup[]; selected: Set<string>;
  onToggleSelect: (id: string) => void; onSelectAll: () => void; onOpen: (id: string) => void;
  sortKey: SortKey; sortDir: SortDir; onSort: (k: SortKey) => void;
  onAction: (id: string, a: 'suspend' | 'unsuspend' | 'close' | 'archive') => void;
}) {
  const allSelected = items.length > 0 && items.every(g => selected.has(g.id));

  const SortTh = ({ k, label, className = '' }: { k: SortKey; label: string; className?: string }) => (
    <th className={`px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-300 ${className}`}
      onClick={() => onSort(k)}>
      <span className="flex items-center gap-1">
        {label}
        {sortKey === k && <span style={{ color: GOLD }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ ...GLASS, backdropFilter: 'blur(12px)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              <th className="px-3 py-3 w-10">
                <button onClick={onSelectAll} className="text-gray-500 hover:text-white">
                  {allSelected ? <CheckSquare size={15} style={{ color: GOLD }} /> : <Square size={15} />}
                </button>
              </th>
              <SortTh k="name" label="Groupe" />
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Statut</th>
              <SortTh k="destination" label="Voyage" />
              <SortTh k="departure" label="Depart" />
              <SortTh k="fill" label="Remplissage" />
              <SortTh k="size" label="Membres" />
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Activite</th>
              <th className="px-3 py-3 w-28 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((g, idx) => {
              const st = STATUS_META[g.status];
              const StIcon = st.icon;
              const pct = Math.min(100, Math.round((g.memberCount / g.maxCapacity) * 100));
              const fc = fillColor(pct);
              const dDays = daysUntil(g.departureDate);
              const isSelected = selected.has(g.id);
              const isUrgent = dDays !== null && dDays >= 0 && dDays <= 14 && pct < 70 && g.status !== 'CLOSED' && g.status !== 'SUSPENDED';

              return (
                <motion.tr key={g.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                  className="transition-colors cursor-pointer group"
                  onClick={() => onOpen(g.id)}
                  style={{
                    borderBottom: idx < items.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none',
                    background: isSelected ? 'rgba(212,168,83,0.05)' : 'transparent',
                  }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <td className="px-3 py-3" onClick={e => { e.stopPropagation(); onToggleSelect(g.id); }}>
                    <button className="text-gray-500 hover:text-white">
                      {isSelected ? <CheckSquare size={15} style={{ color: GOLD }} /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={g.leaderName} color={g.members[0]?.avatarColor || GOLD} size={30} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-100 truncate max-w-[200px]">{g.name}</span>
                          {g.reported && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                              !
                            </span>
                          )}
                          {isUrgent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                              <Flame size={9} /> urgent
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <code style={{ color: '#D4A853AA' }}>{g.code}</code>
                          <span>•</span>
                          <span>{g.leaderName}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium"
                      style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
                      <StIcon size={10} /> {st.label}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs text-gray-300 truncate max-w-[160px]">{g.travelTitle}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1"><MapPin size={9} /> {g.destination}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs text-gray-300">{formatDate(g.departureDate)}</p>
                    {dDays !== null && (
                      <p className="text-[11px]" style={{ color: dDays < 0 ? '#6B7280' : dDays <= 14 ? '#F59E0B' : dDays <= 30 ? '#10B981' : '#8896a6' }}>
                        {dDays < 0 ? `passe` : dDays === 0 ? `aujourd hui` : `dans ${dDays}j`}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                          className="h-full rounded-full" style={{ background: fc }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: fc, minWidth: 32 }}>{pct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-bold text-gray-100">{g.memberCount}<span className="text-gray-500 font-normal text-xs">/{g.maxCapacity}</span></p>
                    {g.pendingInvites > 0 && <p className="text-[10px] text-amber-400">+{g.pendingInvites} invite(s)</p>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1"><MessageCircle size={10} />{g.messageCount}</span>
                      <span className="flex items-center gap-1"><Share2 size={10} />{g.shareCount}</span>
                      <span className="flex items-center gap-1"><Zap size={10} style={{ color: '#F59E0B' }} />{g.energyScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onOpen(g.id)}
                        title="Ouvrir"
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Eye size={13} />
                      </button>
                      {g.status !== 'SUSPENDED' && g.status !== 'CLOSED' && (
                        <button onClick={() => onAction(g.id, 'suspend')}
                          title="Suspendre"
                          className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                          style={{ color: '#EF4444' }}>
                          <Ban size={13} />
                        </button>
                      )}
                      {g.status === 'SUSPENDED' && (
                        <button onClick={() => onAction(g.id, 'unsuspend')}
                          title="Reactiver"
                          className="p-1.5 rounded-md hover:bg-green-500/10 transition-colors"
                          style={{ color: '#10B981' }}>
                          <CheckCircle2 size={13} />
                        </button>
                      )}
                      <Link href={`/admin/voyages/${g.travelId}`}
                        title="Voir voyage"
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GridView({ items, selected, onToggleSelect, onOpen }: {
  items: AdminGroup[]; selected: Set<string>;
  onToggleSelect: (id: string) => void; onOpen: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {items.map((g, idx) => {
        const st = STATUS_META[g.status];
        const StIcon = st.icon;
        const pct = Math.min(100, Math.round((g.memberCount / g.maxCapacity) * 100));
        const fc = fillColor(pct);
        const dDays = daysUntil(g.departureDate);
        const isSelected = selected.has(g.id);

        return (
          <motion.div key={g.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
            whileHover={{ y: -3 }}
            onClick={() => onOpen(g.id)}
            className="rounded-xl p-4 cursor-pointer transition-all group relative"
            style={{
              ...GLASS,
              backdropFilter: 'blur(12px)',
              borderColor: isSelected ? `${GOLD}50` : BORDER,
              background: isSelected ? `${GOLD}08` : SURFACE,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar name={g.leaderName} color={g.members[0]?.avatarColor || GOLD} size={36} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-100 truncate">{g.name}</p>
                  <p className="text-[11px] text-gray-500"><code style={{ color: '#D4A853AA' }}>{g.code}</code></p>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); onToggleSelect(g.id); }}
                className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {isSelected ? <CheckSquare size={14} style={{ color: GOLD }} /> : <Square size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
                <StIcon size={9} /> {st.label}
              </span>
              {g.reported && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>Signale</span>}
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-300 truncate">{g.travelTitle}</p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                <span className="flex items-center gap-1"><MapPin size={9} /> {g.destination}</span>
                <span>•</span>
                <span>{formatDate(g.departureDate)}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Remplissage</span>
                <span className="text-xs font-bold" style={{ color: fc }}>
                  {g.memberCount}/{g.maxCapacity} · {pct}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                  className="h-full rounded-full" style={{ background: fc }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
              <span className="flex items-center gap-1"><MessageCircle size={10} /> {g.messageCount}</span>
              <span className="flex items-center gap-1"><Share2 size={10} /> {g.shareCount}</span>
              <span className="flex items-center gap-1"><Zap size={10} style={{ color: '#F59E0B' }} /> {g.energyScore}</span>
              {dDays !== null && dDays >= 0 && dDays <= 30 && (
                <span className="flex items-center gap-1 text-amber-400"><Clock size={10} /> {dDays}j</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function TimelineView({ items, onOpen }: { items: AdminGroup[]; onOpen: (id: string) => void }) {
  const withDates = items.filter(g => g.departureDate);
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, AdminGroup[]>();
    [...withDates]
      .sort((a, b) => (a.departureDate || '').localeCompare(b.departureDate || ''))
      .forEach(g => {
        const d = new Date(g.departureDate!);
        const key = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(g);
      });
    return Array.from(map.entries());
  }, [withDates]);

  return (
    <div className="rounded-xl p-6" style={{ ...GLASS, backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Calendar size={16} style={{ color: GOLD }} />
        <h3 className="text-sm font-bold text-gray-200">Departs a venir par mois</h3>
        <span className="text-xs text-gray-500 ml-auto">{withDates.length} groupes planifies</span>
      </div>
      <div className="space-y-6">
        {groupedByMonth.map(([month, grps], mIdx) => (
          <motion.div key={month}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: mIdx * 0.05 }}
            className="relative pl-6"
          >
            <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ background: GOLD, boxShadow: `0 0 0 3px ${GOLD}20` }} />
            {mIdx < groupedByMonth.length - 1 && (
              <div className="absolute left-[3px] top-5 bottom-[-24px] w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            )}
            <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: GOLD }}>
              {month} <span className="text-gray-500">({grps.length})</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {grps.map(g => {
                const pct = Math.min(100, Math.round((g.memberCount / g.maxCapacity) * 100));
                const fc = fillColor(pct);
                const st = STATUS_META[g.status];
                const dDays = daysUntil(g.departureDate);
                return (
                  <button key={g.id} onClick={() => onOpen(g.id)}
                    className="text-left rounded-lg p-3 hover:bg-white/[0.04] transition-all" style={GLASS}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono" style={{ color: GOLD }}>
                        {new Date(g.departureDate!).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-200 truncate">{g.name}</p>
                    <p className="text-[11px] text-gray-500 truncate mb-2">{g.destination} · {g.memberCount}/{g.maxCapacity}</p>
                    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full" style={{ width: `${pct}%`, background: fc }} />
                    </div>
                    {dDays !== null && dDays >= 0 && dDays <= 14 && pct < 70 && (
                      <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: '#F59E0B' }}>
                        <AlertTriangle size={9} /> depart {dDays}j · incomplet
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SidePanel({ group, onClose, onAction }: {
  group: AdminGroup; onClose: () => void;
  onAction: (id: string, a: 'suspend' | 'unsuspend' | 'close' | 'archive') => void;
}) {
  const [tab, setTab] = useState<'composition' | 'chat' | 'history' | 'stats'>('composition');
  const pct = Math.min(100, Math.round((group.memberCount / group.maxCapacity) * 100));
  const fc = fillColor(pct);
  const st = STATUS_META[group.status];
  const StIcon = st.icon;
  const dDays = daysUntil(group.departureDate);

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      />
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[520px] flex flex-col overflow-hidden"
        style={{ background: '#0D1117', borderLeft: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div className="p-5" style={{ borderBottom: `1px solid ${BORDER}`, background: 'linear-gradient(180deg, rgba(212,168,83,0.08) 0%, transparent 100%)' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
                  <StIcon size={10} /> {st.label}
                </span>
                {group.reported && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                    Signale
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-100 truncate">{group.name}</h2>
              <p className="text-xs text-gray-500 mt-1">
                <code style={{ color: GOLD }}>{group.code}</code> · cree le {formatDate(group.createdAt)}
              </p>
            </div>
            <button onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Voyage */}
          <Link href={`/admin/voyages/${group.travelId}`}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors" style={GLASS}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}18` }}>
              <MapPin size={13} style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate">{group.travelTitle}</p>
              <p className="text-[11px] text-gray-500">{group.destination} · par {group.proName}</p>
            </div>
            <ExternalLink size={13} className="text-gray-500" />
          </Link>

          {/* Key metrics row */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <FillGauge pct={pct} color={fc} label={`${group.memberCount}/${group.maxCapacity}`} subLabel="remplissage" />
            <div className="rounded-lg p-2.5" style={GLASS}>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Depart</p>
              <p className="text-sm font-bold text-gray-200">{formatDate(group.departureDate)}</p>
              {dDays !== null && (
                <p className="text-[11px]" style={{ color: dDays < 0 ? '#6B7280' : dDays <= 14 ? '#F59E0B' : '#10B981' }}>
                  {dDays < 0 ? 'passe' : dDays === 0 ? 'aujourd hui' : `dans ${dDays}j`}
                </p>
              )}
            </div>
            <div className="rounded-lg p-2.5" style={GLASS}>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Energie</p>
              <p className="text-sm font-bold flex items-center gap-1" style={{ color: '#F59E0B' }}>
                <Zap size={13} />{group.energyScore}<span className="text-gray-500 font-normal">/100</span>
              </p>
              <p className="text-[11px] text-gray-500">{group.activitiesCount} activites</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-3 pt-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {[
            { v: 'composition' as const, label: 'Composition', icon: Users },
            { v: 'chat'        as const, label: 'Chat',        icon: MessageCircle },
            { v: 'history'     as const, label: 'Historique',  icon: History },
            { v: 'stats'       as const, label: 'Stats',       icon: BarChart3 },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors relative"
              style={{ color: tab === t.v ? GOLD : '#6B7280' }}>
              <t.icon size={12} /> {t.label}
              {tab === t.v && (
                <motion.div layoutId="tab-indicator"
                  className="absolute inset-x-1 -bottom-px h-[2px]"
                  style={{ background: GOLD }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'composition' && <CompositionTab group={group} />}
          {tab === 'chat' && <ChatTab group={group} />}
          {tab === 'history' && <HistoryTab group={group} />}
          {tab === 'stats' && <StatsTab group={group} />}
        </div>

        {/* Footer actions */}
        <div className="p-3 flex items-center gap-2 flex-wrap" style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
            style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>
            <UserPlus size={12} /> Ajouter
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' }}>
            <Send size={12} /> Message
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Edit3 size={12} /> Modifier
          </button>
          <button onClick={() => onAction(group.id, 'archive')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
            style={GLASS}>
            <Archive size={12} /> Archiver
          </button>
          {group.status !== 'SUSPENDED' && group.status !== 'CLOSED' ? (
            <button onClick={() => onAction(group.id, 'suspend')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ml-auto"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}>
              <Ban size={12} /> Suspendre
            </button>
          ) : group.status === 'SUSPENDED' ? (
            <button onClick={() => onAction(group.id, 'unsuspend')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ml-auto"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
              <CheckCircle2 size={12} /> Reactiver
            </button>
          ) : null}
        </div>
      </motion.aside>
    </>
  );
}

function FillGauge({ pct, color, label, subLabel }: { pct: number; color: string; label: string; subLabel: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, pct) / 100) * circumference;

  return (
    <div className="rounded-lg p-2.5 flex items-center gap-2.5" style={GLASS}>
      <svg width={48} height={48} viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx={24} cy={24} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <motion.circle cx={24} cy={24} r={radius} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          strokeLinecap="round" transform="rotate(-90 24 24)"
        />
        <text x={24} y={27} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{pct}%</text>
      </svg>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-200 truncate">{label}</p>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{subLabel}</p>
      </div>
    </div>
  );
}

function CompositionTab({ group }: { group: AdminGroup }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-200">Membres ({group.memberCount})</h3>
          <p className="text-[11px] text-gray-500">
            {group.pendingInvites > 0 ? `${group.pendingInvites} invitation(s) en attente` : 'Aucune invitation en attente'}
          </p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium hover:scale-[1.02] transition-all"
          style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>
          <UserPlus size={11} /> Ajouter
        </button>
      </div>
      <div className="space-y-1.5">
        {group.members.map((m, i) => {
          const role = ROLE_META[m.role];
          return (
            <motion.div key={m.id}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.04] group"
              style={GLASS}
            >
              <Avatar name={m.name} color={m.avatarColor} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-200 truncate">{m.name}</p>
                  {m.role === 'LEADER' && <Crown size={10} style={{ color: role.color }} />}
                </div>
                <p className="text-[11px] text-gray-500 truncate">{m.email}</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ background: `${role.color}15`, color: role.color }}>
                {role.label}
              </span>
              {m.role !== 'LEADER' && (
                <button className="p-1 rounded text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Retirer">
                  <UserMinus size={12} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ChatTab({ group }: { group: AdminGroup }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-200">Fil de discussion</h3>
          <p className="text-[11px] text-gray-500">{group.messageCount} messages echanges</p>
        </div>
        <Link href={`/admin/groupes/${group.id}/chat`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-white"
          style={GLASS}>
          <ExternalLink size={11} /> Ouvrir
        </Link>
      </div>

      {group.lastMessage ? (
        <div className="rounded-lg p-3 mb-3" style={GLASS}>
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar name={group.lastMessage.author} color={group.members[0]?.avatarColor || GOLD} size={24} />
            <div>
              <p className="text-xs font-semibold text-gray-200">{group.lastMessage.author}</p>
              <p className="text-[10px] text-gray-500">{formatDate(group.lastMessage.at)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 italic pl-8">{'"'}{group.lastMessage.text}{'"'}</p>
        </div>
      ) : (
        <div className="rounded-lg p-4 text-center text-[11px] text-gray-500" style={GLASS}>
          Pas encore de messages dans ce groupe
        </div>
      )}

      <div className="rounded-lg p-3" style={GLASS}>
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Envoyer au groupe</p>
        <textarea
          placeholder="Message administrateur (visible par tous les membres)..."
          rows={3}
          className="w-full text-xs bg-white/[0.02] rounded p-2 text-gray-200 placeholder-gray-600 outline-none resize-none"
          style={{ border: `1px solid ${BORDER}` }}
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer">
            <input type="checkbox" className="accent-amber-500" /> Notification push
          </label>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>
            <Send size={11} /> Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ group }: { group: AdminGroup }) {
  const iconFor = (t: HistoryEntry['type']) => {
    switch (t) {
      case 'created':        return { icon: Sparkles,    color: GOLD };
      case 'member_joined':  return { icon: UserPlus,    color: '#10B981' };
      case 'member_left':    return { icon: UserMinus,   color: '#EF4444' };
      case 'message':        return { icon: MessageCircle, color: '#3B82F6' };
      case 'modified':       return { icon: Edit3,       color: '#8B5CF6' };
      case 'status_changed': return { icon: Activity,    color: '#F97316' };
    }
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-200 mb-3">Historique du groupe</h3>
      <div className="relative space-y-3">
        {group.history.map((h, i) => {
          const { icon: Icon, color } = iconFor(h.type);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                  <Icon size={11} />
                </div>
                {i < group.history.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
              <div className="flex-1 pb-3">
                <p className="text-xs text-gray-200">{h.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {formatDate(h.date)}{h.actor ? ` · ${h.actor}` : ''}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatsTab({ group }: { group: AdminGroup }) {
  const pct = Math.min(100, Math.round((group.memberCount / group.maxCapacity) * 100));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={MessageCircle} color="#3B82F6" label="Messages"   value={group.messageCount} />
        <StatCard icon={Share2}       color="#8B5CF6" label="Partages"   value={group.shareCount} />
        <StatCard icon={Zap}          color="#F59E0B" label="Energie"    value={group.energyScore} suffix="/100" />
        <StatCard icon={Activity}     color="#10B981" label="Activites"  value={group.activitiesCount} />
        <StatCard icon={Target}       color={GOLD}    label="Remplissage" value={pct} suffix="%" />
        <StatCard icon={TrendingUp}   color="#EC4899" label="Conversion" value={Math.round(group.conversionRate * 100)} suffix="%" />
      </div>

      <div className="rounded-lg p-3" style={GLASS}>
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Repartition des roles</p>
        {(['LEADER', 'CO_LEADER', 'MEMBER', 'GUEST'] as MemberRole[]).map(role => {
          const count = group.members.filter(m => m.role === role).length;
          if (count === 0) return null;
          const pctRole = Math.round((count / group.members.length) * 100);
          const r = ROLE_META[role];
          return (
            <div key={role} className="mb-2 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-400">{r.label}</span>
                <span className="text-[11px] font-semibold" style={{ color: r.color }}>{count} · {pctRole}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pctRole}%` }} transition={{ duration: 0.8 }}
                  className="h-full rounded-full" style={{ background: r.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value, suffix = '' }: {
  icon: React.ElementType; color: string; label: string; value: number; suffix?: string;
}) {
  return (
    <div className="rounded-lg p-3" style={GLASS}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{label}</p>
        <Icon size={12} style={{ color }} />
      </div>
      <p className="text-lg font-bold" style={{ color }}>
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
    </div>
  );
}
