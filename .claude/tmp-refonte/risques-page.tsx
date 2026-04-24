'use client';

/**
 * Admin — Dashboard Risques Voyages Premium
 * Route: /admin/voyages/risques
 *
 * Refonte complete — design premium dark + or, operationnel.
 * Carte monde, scores 0-100, categories de risques, alertes temps reel,
 * checklist actions, timeline incidents, vue equipe, export PDF/CSV.
 *
 * @since 2026-04-22
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Activity,
  Globe2,
  Siren,
  Heart,
  CloudRain,
  Plane,
  Landmark,
  Mountain,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  FileText,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  Clock,
  Users,
  MapPin,
  Phone,
  Briefcase,
  CheckCircle2,
  Circle,
  XCircle,
  History,
  Eye,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  UserCog,
  Radio,
  Thermometer,
  Zap,
  Flag,
  FileCheck,
  PhoneCall,
  Map as MapIcon,
  List,
  LucideIcon,
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PolarAngleAxis,
  Cell,
} from 'recharts';
import { apiClient } from '@/lib/api-client';
import { DEMO_TRAVELS_FULL } from '@/lib/demo-data';

// ─── Types ────────────────────────────────────────────────────────────

type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type RiskCategory = 'SAFETY' | 'HEALTH' | 'WEATHER' | 'TRANSPORT' | 'POLITICAL' | 'NATURAL';
type ActionStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

interface RiskItem {
  id: string;
  category: RiskCategory;
  label: string;
  severity: RiskLevel;
  description?: string;
  action?: string;
  actionUrl?: string;
  status: ActionStatus;
  owner?: string;
  dueDate?: string;
}

interface IncidentRecord {
  id: string;
  date: string;
  destination: string;
  category: RiskCategory;
  severity: RiskLevel;
  label: string;
  resolution: string;
}

interface TravelRisk {
  travelId: string;
  title: string;
  destination: string;
  country: string;
  lat: number;
  lng: number;
  departureDate: string;
  status: string;
  proName: string;
  ownerName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  passengerCount: number;
  capacity: number;
  risks: RiskItem[];
  daysUntilDeparture: number;
  checklist: {
    insurance: boolean;
    briefing: boolean;
    embassy: boolean;
    planB: boolean;
  };
  trend: 'UP' | 'DOWN' | 'STABLE';
}

interface CountryRisk {
  country: string;
  code: string;
  lat: number;
  lng: number;
  level: RiskLevel;
  advisory: string;
}

// ─── Config ───────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, {
  label: string;
  color: string;
  glow: string;
  bg: string;
  border: string;
  Icon: LucideIcon;
}> = {
  CRITICAL: {
    label: 'Critique',
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.35)',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.35)',
    Icon: Siren,
  },
  HIGH: {
    label: 'Eleve',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.30)',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.30)',
    Icon: ShieldAlert,
  },
  MEDIUM: {
    label: 'Modere',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.25)',
    bg: 'rgba(59,130,246,0.10)',
    border: 'rgba(59,130,246,0.25)',
    Icon: Shield,
  },
  LOW: {
    label: 'Faible',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.25)',
    bg: 'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.25)',
    Icon: ShieldCheck,
  },
};

const CATEGORY_CONFIG: Record<RiskCategory, { label: string; Icon: LucideIcon; color: string }> = {
  SAFETY: { label: 'Securite pays', Icon: Shield, color: '#EF4444' },
  HEALTH: { label: 'Sante', Icon: Heart, color: '#EC4899' },
  WEATHER: { label: 'Meteo', Icon: CloudRain, color: '#3B82F6' },
  TRANSPORT: { label: 'Transport', Icon: Plane, color: '#D4A853' },
  POLITICAL: { label: 'Politique', Icon: Landmark, color: '#A78BFA' },
  NATURAL: { label: 'Naturel', Icon: Mountain, color: '#F97316' },
};

const GOLD = '#D4A853';

// ─── Donnees de demonstration ─────────────────────────────────────────

const COUNTRY_RISKS: CountryRisk[] = [
  { country: 'Maroc', code: 'MA', lat: 31.7, lng: -7.1, level: 'MEDIUM', advisory: 'Vigilance accrue zones frontalieres' },
  { country: 'Italie', code: 'IT', lat: 41.9, lng: 12.5, level: 'LOW', advisory: 'Conditions normales' },
  { country: 'Grece', code: 'GR', lat: 39.1, lng: 21.8, level: 'LOW', advisory: 'Risque canicule estivale' },
  { country: 'Thailande', code: 'TH', lat: 15.9, lng: 100.9, level: 'MEDIUM', advisory: 'Mousson juin-octobre' },
  { country: 'Egypte', code: 'EG', lat: 26.8, lng: 30.8, level: 'HIGH', advisory: 'Eviter zones frontalieres Sinai' },
  { country: 'Portugal', code: 'PT', lat: 39.4, lng: -8.2, level: 'LOW', advisory: 'Conditions normales' },
  { country: 'Espagne', code: 'ES', lat: 40.4, lng: -3.7, level: 'LOW', advisory: 'Conditions normales' },
  { country: 'Turquie', code: 'TR', lat: 38.9, lng: 35.2, level: 'HIGH', advisory: 'Vigilance zones frontalieres Sud-Est' },
  { country: 'Tunisie', code: 'TN', lat: 33.9, lng: 9.5, level: 'MEDIUM', advisory: 'Vigilance accrue' },
  { country: 'France', code: 'FR', lat: 46.2, lng: 2.2, level: 'LOW', advisory: 'Conditions normales' },
];

const COUNTRY_COORDS: Record<string, { lat: number; lng: number; country: string }> = {
  'Marrakech': { lat: 31.6, lng: -8.0, country: 'Maroc' },
  'Rome': { lat: 41.9, lng: 12.5, country: 'Italie' },
  'Athenes': { lat: 37.9, lng: 23.7, country: 'Grece' },
  'Bangkok': { lat: 13.7, lng: 100.5, country: 'Thailande' },
  'Le Caire': { lat: 30.0, lng: 31.2, country: 'Egypte' },
  'Lisbonne': { lat: 38.7, lng: -9.1, country: 'Portugal' },
  'Barcelone': { lat: 41.3, lng: 2.1, country: 'Espagne' },
  'Istanbul': { lat: 41.0, lng: 28.9, country: 'Turquie' },
};

const INCIDENTS: IncidentRecord[] = [
  {
    id: 'inc-1',
    date: '2026-03-14',
    destination: 'Marrakech',
    category: 'WEATHER',
    severity: 'MEDIUM',
    label: 'Orages exceptionnels — bus retarde 4h',
    resolution: 'Herbergement de secours active — couts reinternalises',
  },
  {
    id: 'inc-2',
    date: '2026-02-02',
    destination: 'Istanbul',
    category: 'POLITICAL',
    severity: 'HIGH',
    label: 'Manifestation centre-ville — modification itineraire',
    resolution: 'Deroute sur quartier asiatique — aucun incident',
  },
  {
    id: 'inc-3',
    date: '2025-11-22',
    destination: 'Athenes',
    category: 'TRANSPORT',
    severity: 'HIGH',
    label: 'Greve controleurs aeriens Grece',
    resolution: 'Rebook + indemnisation voyageurs (6 200&euro;)',
  },
  {
    id: 'inc-4',
    date: '2025-09-08',
    destination: 'Bangkok',
    category: 'HEALTH',
    severity: 'MEDIUM',
    label: 'Cas de dengue signale — 2 participants',
    resolution: 'Rapatriement sanitaire + prise en charge assurance',
  },
];

function generateDemoRisks(): TravelRisk[] {
  const base = DEMO_TRAVELS_FULL
    .filter(t => ['PUBLISHED', 'ON_GOING', 'DRAFT'].includes(t.status))
    .slice(0, 12);

  return base.map((t, idx) => {
    const occupancy = t.occupancyRate ?? 0;
    const daysUntil = Math.max(
      0,
      Math.round((new Date(t.occurrences?.[0]?.startDate ?? '2026-07-01').getTime() - Date.now()) / 86400000)
    );

    const coords = COUNTRY_COORDS[t.destination] || { lat: 48.8, lng: 2.3, country: t.destination };

    // Distribution realiste des niveaux de risque
    let level: RiskLevel = 'LOW';
    let score = 18;
    if (idx === 0) { level = 'CRITICAL'; score = 87; }
    else if (idx === 1) { level = 'HIGH'; score = 71; }
    else if (idx === 2) { level = 'HIGH'; score = 64; }
    else if (idx <= 5) { level = 'MEDIUM'; score = 35 + idx * 4; }
    else { level = 'LOW'; score = 12 + (idx - 6) * 3; }

    const risks: RiskItem[] = [];

    if (idx === 0) {
      risks.push({
        id: `r-${idx}-1`,
        category: 'TRANSPORT',
        label: 'Option vol expire dans 48h',
        description: 'Confirmation necessaire aupres de Royal Air Maroc avant 2026-04-24 18h00.',
        severity: 'CRITICAL',
        action: 'Confirmer vol',
        actionUrl: '/admin/transport/vols-a-confirmer',
        status: 'PENDING',
        owner: 'Sophie Martin',
        dueDate: '2026-04-24',
      });
      risks.push({
        id: `r-${idx}-2`,
        category: 'SAFETY',
        label: 'Alerte securite zone Atlas',
        description: 'Ministere des Affaires Etrangeres — vigilance accrue randonnees.',
        severity: 'HIGH',
        action: 'Briefing guide',
        status: 'IN_PROGRESS',
        owner: 'Karim Benali',
        dueDate: '2026-04-28',
      });
      risks.push({
        id: `r-${idx}-3`,
        category: 'HEALTH',
        label: 'Vaccins recommandes non confirmes',
        description: '4 voyageurs n&apos;ont pas confirme les vaccins hepatite A + typhoide.',
        severity: 'MEDIUM',
        action: 'Relancer voyageurs',
        status: 'PENDING',
        owner: 'Sophie Martin',
        dueDate: '2026-05-02',
      });
    }
    if (idx === 1) {
      risks.push({
        id: `r-${idx}-1`,
        category: 'WEATHER',
        label: 'Canicule prevue semaine depart',
        description: 'Temperatures &ge; 42&deg;C annoncees — adaptation programme necessaire.',
        severity: 'HIGH',
        action: 'Adapter programme',
        status: 'IN_PROGRESS',
        owner: 'Emma Roussel',
        dueDate: '2026-05-10',
      });
      risks.push({
        id: `r-${idx}-2`,
        category: 'POLITICAL',
        label: 'Elections locales semaine +1',
        description: 'Risque manifestations — preparer itineraire alternatif.',
        severity: 'MEDIUM',
        status: 'PENDING',
        owner: 'Emma Roussel',
      });
    }
    if (idx === 2) {
      risks.push({
        id: `r-${idx}-1`,
        category: 'NATURAL',
        label: 'Zone seismique active',
        description: 'Secousses signalees derniere semaine — protocole evacuation requis.',
        severity: 'HIGH',
        action: 'Valider plan B',
        status: 'DONE',
        owner: 'Karim Benali',
      });
    }
    if (idx >= 3 && idx <= 5) {
      risks.push({
        id: `r-${idx}-1`,
        category: 'TRANSPORT',
        label: 'Affluence aeroport saison haute',
        severity: 'MEDIUM',
        action: 'Check-in prioritaire',
        status: 'IN_PROGRESS',
        owner: 'Sophie Martin',
      });
      if (occupancy < 75) {
        risks.push({
          id: `r-${idx}-2`,
          category: 'SAFETY',
          label: `Remplissage ${occupancy}% — seuil minimum`,
          severity: 'MEDIUM',
          action: 'Booster marketing',
          actionUrl: '/admin/marketing',
          status: 'PENDING',
          owner: 'Emma Roussel',
        });
      }
    }
    if (idx > 5) {
      risks.push({
        id: `r-${idx}-1`,
        category: 'HEALTH',
        label: 'Protocole sanitaire standard',
        severity: 'LOW',
        status: 'DONE',
      });
    }

    return {
      travelId: t.id,
      title: t.title,
      destination: t.destination,
      country: coords.country,
      lat: coords.lat,
      lng: coords.lng,
      departureDate: t.occurrences?.[0]?.startDate ?? '2026-07-01',
      status: t.status,
      proName: t.proName,
      ownerName: idx % 3 === 0 ? 'Sophie Martin' : idx % 3 === 1 ? 'Karim Benali' : 'Emma Roussel',
      riskScore: score,
      riskLevel: level,
      passengerCount: t.currentBookings ?? 0,
      capacity: t.capacity ?? 50,
      risks,
      daysUntilDeparture: daysUntil,
      checklist: {
        insurance: idx !== 0,
        briefing: idx > 1,
        embassy: idx > 2,
        planB: idx > 0 && idx !== 1,
      },
      trend: idx === 0 ? 'UP' : idx === 1 ? 'UP' : idx === 3 ? 'DOWN' : 'STABLE',
    };
  });
}

const DEMO_RISKS: TravelRisk[] = generateDemoRisks();

// ─── Utils ────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function useAnimatedCounter(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const loop = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ─── Sous-composants ──────────────────────────────────────────────────

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const v = useAnimatedCounter(value);
  return <span className={className}>{v}</span>;
}

function GlobalRiskGauge({ score, level }: { score: number; level: RiskLevel }) {
  const cfg = RISK_CONFIG[level];
  const data = [{ name: 'score', value: score, fill: cfg.color }];
  const animated = useAnimatedCounter(score, 1000);
  return (
    <div className="relative w-full h-[220px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
          startAngle={210}
          endAngle={-30}
          data={data}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: 'rgba(255,255,255,0.05)' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-5xl font-bold tabular-nums" style={{ color: cfg.color, textShadow: `0 0 30px ${cfg.glow}` }}>
          {animated}
        </div>
        <div className="text-[11px] uppercase tracking-[0.15em] text-white/50 mt-1">Score global</div>
        <div
          className="mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          {cfg.label}
        </div>
      </div>
    </div>
  );
}

// Carte monde SVG simplifiee (projection equirectangulaire)
function WorldMap({
  countries,
  travels,
  onTravelClick,
}: {
  countries: CountryRisk[];
  travels: TravelRisk[];
  onTravelClick?: (id: string) => void;
}) {
  const width = 1000;
  const height = 500;

  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#0A0E14] to-[#0B1220]">
      {/* Grille radar */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full relative"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Continents stylises (silhouettes simplifiees) */}
        <g fill="rgba(255,255,255,0.04)" stroke="rgba(212,168,83,0.15)" strokeWidth="1">
          {/* Europe */}
          <path d="M 470 160 L 540 150 L 580 170 L 590 200 L 560 220 L 520 215 L 490 200 L 475 180 Z" />
          {/* Afrique */}
          <path d="M 470 220 L 560 220 L 580 260 L 590 320 L 560 380 L 520 400 L 490 390 L 475 350 L 465 290 L 470 250 Z" />
          {/* Asie */}
          <path d="M 590 150 L 720 140 L 810 170 L 840 210 L 820 250 L 780 270 L 720 260 L 680 240 L 620 220 L 595 190 Z" />
          {/* Asie du Sud-Est */}
          <path d="M 780 280 L 830 285 L 850 320 L 830 355 L 795 340 L 785 310 Z" />
          {/* Amerique du Nord */}
          <path d="M 150 140 L 260 130 L 310 160 L 300 220 L 250 250 L 200 240 L 160 210 L 140 170 Z" />
          {/* Amerique du Sud */}
          <path d="M 270 290 L 320 285 L 340 320 L 335 380 L 310 420 L 285 410 L 270 370 L 265 320 Z" />
          {/* Oceanie */}
          <path d="M 800 380 L 870 380 L 885 410 L 860 435 L 815 430 L 800 405 Z" />
        </g>

        {/* Zones de risque pays */}
        {countries.map(c => {
          const p = project(c.lat, c.lng);
          const cfg = RISK_CONFIG[c.level];
          return (
            <g key={c.code}>
              <circle
                cx={p.x}
                cy={p.y}
                r="25"
                fill={cfg.color}
                opacity="0.08"
              >
                <animate attributeName="r" values="25;32;25" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill={cfg.color}
                stroke="#0A0E14"
                strokeWidth="2"
                onMouseEnter={() => setHover(c.code)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer', filter: `drop-shadow(0 0 8px ${cfg.glow})` }}
              />
            </g>
          );
        })}

        {/* Voyages actifs (losanges or) */}
        {travels.slice(0, 8).map(t => {
          const p = project(t.lat, t.lng);
          const cfg = RISK_CONFIG[t.riskLevel];
          const active = hover === `t-${t.travelId}`;
          return (
            <g
              key={t.travelId}
              transform={`translate(${p.x} ${p.y})`}
              onMouseEnter={() => setHover(`t-${t.travelId}`)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onTravelClick?.(t.travelId)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="-8"
                y="-8"
                width="16"
                height="16"
                transform={`rotate(45) scale(${active ? 1.25 : 1})`}
                fill={GOLD}
                stroke={cfg.color}
                strokeWidth="2"
                style={{ transition: 'transform 0.2s', filter: `drop-shadow(0 0 6px ${cfg.glow})` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip hover */}
      {hover && (
        <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-xl bg-[#0A0E14]/95 border border-[#D4A853]/30 backdrop-blur-md text-xs">
          {hover.startsWith('t-') ? (
            (() => {
              const t = travels.find(x => x.travelId === hover.slice(2));
              if (!t) return null;
              return (
                <>
                  <div className="font-bold text-white">{t.title}</div>
                  <div className="text-white/60 mt-0.5">
                    {t.destination} &middot; J-{t.daysUntilDeparture}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: RISK_CONFIG[t.riskLevel].color }}>
                    Score {t.riskScore}/100 &middot; {RISK_CONFIG[t.riskLevel].label}
                  </div>
                </>
              );
            })()
          ) : (
            (() => {
              const c = countries.find(x => x.code === hover);
              if (!c) return null;
              return (
                <>
                  <div className="font-bold text-white">{c.country}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: RISK_CONFIG[c.level].color }}>
                    {RISK_CONFIG[c.level].label}
                  </div>
                  <div className="text-white/60 text-[11px] mt-1 max-w-[180px]">{c.advisory}</div>
                </>
              );
            })()
          )}
        </div>
      )}

      {/* Legende */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 px-3 py-2 rounded-xl bg-[#0A0E14]/80 backdrop-blur-md border border-white/[0.08]">
        {(Object.entries(RISK_CONFIG) as [RiskLevel, typeof RISK_CONFIG[RiskLevel]][]).map(([k, cfg]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
            <span className="text-[10px] text-white/60 uppercase tracking-wider">{cfg.label}</span>
          </div>
        ))}
        <div className="w-px h-3 bg-white/20 mx-1" />
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rotate-45" style={{ background: GOLD }} />
          <span className="text-[10px] text-white/60 uppercase tracking-wider">Voyages</span>
        </div>
      </div>
    </div>
  );
}

function CategoryChart({ travels }: { travels: TravelRisk[] }) {
  const data = useMemo(() => {
    const counts: Record<RiskCategory, number> = {
      SAFETY: 0, HEALTH: 0, WEATHER: 0, TRANSPORT: 0, POLITICAL: 0, NATURAL: 0,
    };
    travels.forEach(t => t.risks.forEach(r => { counts[r.category]++; }));
    return (Object.keys(counts) as RiskCategory[]).map(k => ({
      name: CATEGORY_CONFIG[k].label,
      value: counts[k],
      fill: CATEGORY_CONFIG[k].color,
      key: k,
    }));
  }, [travels]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(212,168,83,0.05)' }}
          contentStyle={{
            background: '#0A0E14',
            border: '1px solid rgba(212,168,83,0.3)',
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.key} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function TrendChart() {
  const data = useMemo(
    () => [
      { day: 'J-30', critical: 1, high: 2, medium: 4 },
      { day: 'J-25', critical: 1, high: 2, medium: 5 },
      { day: 'J-20', critical: 2, high: 3, medium: 4 },
      { day: 'J-15', critical: 1, high: 3, medium: 6 },
      { day: 'J-10', critical: 2, high: 4, medium: 5 },
      { day: 'J-5', critical: 1, high: 3, medium: 5 },
      { day: 'Auj.', critical: 1, high: 2, medium: 4 },
    ],
    []
  );
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#0A0E14',
            border: '1px solid rgba(212,168,83,0.3)',
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="high" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="medium" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MiniScoreBar({ score, level }: { score: number; level: RiskLevel }) {
  const cfg = RISK_CONFIG[level];
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.glow}` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color: cfg.color }}>
        {score}
      </span>
    </div>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-white/30 shrink-0" />
      )}
      <span className={done ? 'text-white/70 line-through decoration-emerald-500/50' : 'text-white/80'}>
        {label}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: ActionStatus }) {
  const map = {
    PENDING: { label: 'A faire', color: '#F59E0B', Icon: Circle },
    IN_PROGRESS: { label: 'En cours', color: '#3B82F6', Icon: Activity },
    DONE: { label: 'Termine', color: '#10B981', Icon: CheckCircle2 },
  };
  const cfg = map[status];
  const Icon = cfg.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}40` }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Export utils ─────────────────────────────────────────────────────

function exportCSV(travels: TravelRisk[]) {
  const lines = [
    'Voyage;Destination;Pays;Depart;J-;Score;Niveau;Passagers;Owner;Nb risques;Actions en attente',
    ...travels.map(t =>
      [
        t.title.replace(/;/g, ','),
        t.destination,
        t.country,
        t.departureDate,
        t.daysUntilDeparture,
        t.riskScore,
        t.riskLevel,
        `${t.passengerCount}/${t.capacity}`,
        t.ownerName,
        t.risks.length,
        t.risks.filter(r => r.status === 'PENDING').length,
      ].join(';')
    ),
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rapport-risques-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(travels: TravelRisk[]) {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Rapport Risques Voyages Eventy', 14, 20);
  doc.setFontSize(10);
  doc.text(`Genere le ${new Date().toLocaleString('fr-FR')}`, 14, 28);
  autoTable(doc, {
    startY: 36,
    head: [['Voyage', 'Destination', 'Depart', 'Score', 'Niveau', 'Owner', 'Actions']],
    body: travels.map(t => [
      t.title,
      `${t.destination} (${t.country})`,
      formatDate(t.departureDate),
      `${t.riskScore}/100`,
      RISK_CONFIG[t.riskLevel].label,
      t.ownerName,
      String(t.risks.filter(r => r.status !== 'DONE').length),
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [212, 168, 83], textColor: [10, 14, 20] },
    alternateRowStyles: { fillColor: [245, 245, 247] },
  });
  doc.save(`rapport-risques-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── Composant principal ──────────────────────────────────────────────

export default function VoyagesRisquesPage() {
  const [travels, setTravels] = useState<TravelRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const listRef = useRef<HTMLDivElement>(null);

  const fetchRisks = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await apiClient.get<TravelRisk[]>('/admin/voyages/risks', { signal });
      setTravels(Array.isArray(data) && data.length > 0 ? data : DEMO_RISKS);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setTravels(DEMO_RISKS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchRisks(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchRisks]);

  const filtered = useMemo(() => {
    let out = travels;
    if (riskFilter !== 'all') out = out.filter(t => t.riskLevel === riskFilter);
    if (categoryFilter !== 'all') out = out.filter(t => t.risks.some(r => r.category === categoryFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.ownerName.toLowerCase().includes(q)
      );
    }
    out = [...out].sort((a, b) =>
      sortBy === 'score' ? b.riskScore - a.riskScore : a.daysUntilDeparture - b.daysUntilDeparture
    );
    return out;
  }, [travels, riskFilter, categoryFilter, search, sortBy]);

  const critCount = travels.filter(t => t.riskLevel === 'CRITICAL').length;
  const highCount = travels.filter(t => t.riskLevel === 'HIGH').length;
  const medCount = travels.filter(t => t.riskLevel === 'MEDIUM').length;
  const lowCount = travels.filter(t => t.riskLevel === 'LOW').length;

  const allRisks = useMemo(() => travels.flatMap(t => t.risks), [travels]);
  const pendingActions = allRisks.filter(r => r.status === 'PENDING' && r.action).length;
  const inProgressActions = allRisks.filter(r => r.status === 'IN_PROGRESS' && r.action).length;

  const globalScore = useMemo(() => {
    if (travels.length === 0) return 0;
    return Math.round(travels.reduce((acc, t) => acc + t.riskScore, 0) / travels.length);
  }, [travels]);

  const globalLevel: RiskLevel =
    globalScore >= 75 ? 'CRITICAL' : globalScore >= 55 ? 'HIGH' : globalScore >= 30 ? 'MEDIUM' : 'LOW';

  // Vue equipe : actions par owner
  const teamView = useMemo(() => {
    const map = new Map<string, { name: string; pending: number; inProgress: number; done: number; urgent: number }>();
    travels.forEach(t =>
      t.risks.forEach(r => {
        if (!r.owner) return;
        const cur = map.get(r.owner) || { name: r.owner, pending: 0, inProgress: 0, done: 0, urgent: 0 };
        if (r.status === 'PENDING') cur.pending++;
        if (r.status === 'IN_PROGRESS') cur.inProgress++;
        if (r.status === 'DONE') cur.done++;
        if (r.severity === 'CRITICAL' && r.status !== 'DONE') cur.urgent++;
        map.set(r.owner, cur);
      })
    );
    return Array.from(map.values());
  }, [travels]);

  const criticalTravels = travels.filter(t => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH');

  const scrollToTravel = (id: string) => {
    setExpandedId(id);
    setTimeout(() => {
      document.getElementById(`travel-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white">
      {/* Glow ambiant */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #D4A853 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #EF4444 0%, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">

        {/* ─── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/admin" className="hover:text-[#D4A853] transition-colors">Admin</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/admin/voyages" className="hover:text-[#D4A853] transition-colors">Voyages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 font-medium">Risques &amp; Actions</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,168,83,0.18) 0%, rgba(212,168,83,0.06) 100%)',
                  border: '1px solid rgba(212,168,83,0.25)',
                  boxShadow: '0 0 30px rgba(212,168,83,0.15)',
                }}
              >
                <ShieldAlert className="w-6 h-6" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Centre de controle risques
                </h1>
                <p className="text-sm text-white/60 mt-1">
                  <AnimatedNumber value={travels.length} /> voyages surveilles &middot;{' '}
                  <AnimatedNumber value={pendingActions + inProgressActions} /> actions ouvertes
                  {critCount > 0 && (
                    <>
                      {' '}
                      &middot;{' '}
                      <span className="text-red-400 font-semibold">
                        <AnimatedNumber value={critCount} /> critique{critCount > 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportCSV(filtered)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                type="button"
                onClick={() => exportPDF(filtered)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </button>
              <button
                type="button"
                onClick={() => fetchRisks()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#0A0E14] transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #D4A853 0%, #C4923E 100%)',
                  boxShadow: '0 4px 20px rgba(212,168,83,0.25)',
                }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>
        </motion.div>

        {/* ─── Alerte critique ─────────────────────────────────── */}
        <AnimatePresence>
          {critCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 40px rgba(239,68,68,0.15)',
              }}
            >
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.15) 50%, transparent 100%)',
                  animation: 'slideRight 3s linear infinite',
                }} />
              </div>
              <div className="relative flex items-center gap-4 flex-wrap">
                <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Siren className="w-5 h-5 text-red-400" />
                  </motion.div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-red-300 text-sm flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    {critCount} voyage{critCount > 1 ? 's' : ''} en situation critique
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    Action immediate requise &middot; options de vol, documents expires ou alertes securite.
                  </p>
                </div>
                {criticalTravels.slice(0, 3).map(t => (
                  <button
                    key={t.travelId}
                    type="button"
                    onClick={() => scrollToTravel(t.travelId)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 transition-colors text-xs font-semibold text-red-300"
                  >
                    <MapPin className="w-3 h-3" />
                    {t.destination}
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── KPI Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {([
            ['CRITICAL', critCount],
            ['HIGH', highCount],
            ['MEDIUM', medCount],
            ['LOW', lowCount],
          ] as [RiskLevel, number][]).map(([level, count], idx) => {
            const cfg = RISK_CONFIG[level];
            const Icon = cfg.Icon;
            const active = riskFilter === level;
            return (
              <motion.button
                key={level}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setRiskFilter(active ? 'all' : level)}
                className="relative rounded-2xl p-4 sm:p-5 text-left transition-all overflow-hidden group"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${cfg.bg} 0%, rgba(10,14,20,0.8) 100%)`
                    : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: `1px solid ${active ? cfg.border : 'rgba(255,255,255,0.06)'}`,
                  backdropFilter: 'blur(12px)',
                  boxShadow: active ? `0 8px 32px ${cfg.glow}` : undefined,
                }}
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.15] group-hover:opacity-30 transition-opacity"
                  style={{ background: `radial-gradient(circle, ${cfg.color} 0%, transparent 70%)` }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>
                  {count > 0 && level === 'CRITICAL' && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <div className="text-3xl sm:text-4xl font-bold tabular-nums mb-1" style={{ color: cfg.color }}>
                  <AnimatedNumber value={count} />
                </div>
                <div className="text-xs uppercase tracking-wider text-white/50 font-medium">
                  Niveau {cfg.label}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ─── Grid principal : Map + Gauge ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
                  <Globe2 className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Carte mondiale des risques</div>
                  <div className="text-[11px] text-white/50">
                    {COUNTRY_RISKS.length} pays suivis &middot; {travels.length} voyages actifs
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mise a jour live
              </div>
            </div>
            <div className="p-2 sm:p-4">
              <WorldMap countries={COUNTRY_RISKS} travels={travels} onTravelClick={scrollToTravel} />
            </div>
          </motion.div>

          {/* Gauge globale + top risques */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl flex flex-col"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wider text-white/50 font-medium">Score de risque</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <TrendingDown className="w-3 h-3" />
                  -4 pts vs 7j
                </div>
              </div>
              <GlobalRiskGauge score={globalScore} level={globalLevel} />
            </div>

            <div className="p-5 flex-1 flex flex-col gap-3">
              <div className="text-xs uppercase tracking-wider text-white/50 font-medium">Top risques actifs</div>
              {[...allRisks]
                .filter(r => r.status !== 'DONE')
                .sort((a, b) => {
                  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                  return order[a.severity] - order[b.severity];
                })
                .slice(0, 4)
                .map(r => {
                  const cat = CATEGORY_CONFIG[r.category];
                  const sev = RISK_CONFIG[r.severity];
                  const CatIcon = cat.Icon;
                  return (
                    <div
                      key={r.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                      >
                        <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white truncate">{r.label}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px]" style={{ color: sev.color }}>
                            {sev.label}
                          </span>
                          {r.dueDate && (
                            <>
                              <span className="text-[10px] text-white/30">&middot;</span>
                              <span className="text-[10px] text-white/50 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {formatDateShort(r.dueDate)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* ─── Graphiques : categories + tendance ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <div className="text-sm font-bold text-white">Repartition par categorie</div>
                <div className="text-[11px] text-white/50 mt-0.5">Clic pour filtrer la liste</div>
              </div>
              {categoryFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className="text-[10px] text-white/50 hover:text-white underline"
                >
                  Retirer filtre
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {(Object.entries(CATEGORY_CONFIG) as [RiskCategory, typeof CATEGORY_CONFIG[RiskCategory]][]).map(
                ([k, cfg]) => {
                  const Icon = cfg.Icon;
                  const active = categoryFilter === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCategoryFilter(active ? 'all' : k)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all"
                      style={{
                        background: active ? `${cfg.color}20` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? `${cfg.color}50` : 'rgba(255,255,255,0.08)'}`,
                        color: active ? cfg.color : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </button>
                  );
                }
              )}
            </div>
            <CategoryChart travels={travels} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-bold text-white">Evolution 30 jours</div>
                <div className="text-[11px] text-white/50 mt-0.5">Nombre de risques par niveau</div>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Crit
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Eleve
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Mod.
                </div>
              </div>
            </div>
            <TrendChart />
          </motion.div>
        </div>

        {/* ─── Vue equipe operationnelle ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
              <UserCog className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Equipe operationnelle</div>
              <div className="text-[11px] text-white/50">Repartition des actions par responsable</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamView.map((m, idx) => {
              const initials = m.name
                .split(' ')
                .map(s => s[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
              const total = m.pending + m.inProgress + m.done;
              const donePct = total > 0 ? Math.round((m.done / total) * 100) : 0;
              return (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden"
                >
                  {m.urgent > 0 && (
                    <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-bold text-red-300 bg-red-500/20 border-l border-b border-red-500/30 rounded-bl-lg">
                      {m.urgent} URGENT
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212,168,83,0.2) 0%, rgba(212,168,83,0.05) 100%)',
                        border: '1px solid rgba(212,168,83,0.3)',
                        color: GOLD,
                      }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{m.name}</div>
                      <div className="text-[10px] text-white/50">{total} actions</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Circle className="w-2.5 h-2.5" />
                      {m.pending} a faire
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <Activity className="w-2.5 h-2.5" />
                      {m.inProgress} en cours
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {m.done}
                    </div>
                  </div>
                  <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${donePct}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Filtres + Liste voyages ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          ref={listRef}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
                <List className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Voyages surveilles</div>
                <div className="text-[11px] text-white/50">
                  {filtered.length} resultat{filtered.length > 1 ? 's' : ''} sur {travels.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-[#D4A853]/40 transition-colors w-44"
                />
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'score' | 'date')}
                className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.08] text-white/80 focus:outline-none focus:border-[#D4A853]/40 transition-colors cursor-pointer"
              >
                <option value="score" className="bg-[#0A0E14]">Tri : score</option>
                <option value="date" className="bg-[#0A0E14]">Tri : depart</option>
              </select>
              {(riskFilter !== 'all' || categoryFilter !== 'all' || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setRiskFilter('all');
                    setCategoryFilter('all');
                    setSearch('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                >
                  <XCircle className="w-3 h-3" />
                  Reinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Filter className="w-8 h-8 text-white/30 mx-auto mb-3" />
              <div className="text-sm text-white/70 font-medium">Aucun voyage ne correspond aux filtres</div>
              <div className="text-xs text-white/40 mt-1">Essayez de reinitialiser les criteres</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((travel, idx) => {
                const cfg = RISK_CONFIG[travel.riskLevel];
                const Icon = cfg.Icon;
                const isExpanded = expandedId === travel.travelId;
                const pendingRisks = travel.risks.filter(r => r.status !== 'DONE').length;
                const urgentRisks = travel.risks.filter(
                  r => r.severity === 'CRITICAL' && r.status !== 'DONE'
                ).length;

                return (
                  <motion.div
                    id={`travel-${travel.travelId}`}
                    key={travel.travelId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                    className="rounded-2xl overflow-hidden transition-all"
                    style={{
                      background: isExpanded
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isExpanded ? cfg.border : 'rgba(255,255,255,0.06)'}`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: isExpanded ? `0 8px 40px ${cfg.glow}` : undefined,
                    }}
                  >
                    {/* Header ligne */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : travel.travelId)}
                      className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div
                        className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center relative"
                        style={{
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          boxShadow: `0 0 20px ${cfg.glow}`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                        {urgentRisks > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white">
                            {urgentRisks}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr,auto,auto] gap-2 sm:gap-4 items-center">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white truncate">{travel.title}</span>
                            {travel.trend === 'UP' && (
                              <span className="flex items-center gap-0.5 text-[10px] text-red-400 px-1.5 py-0.5 rounded-md bg-red-500/10">
                                <TrendingUp className="w-2.5 h-2.5" /> +
                              </span>
                            )}
                            {travel.trend === 'DOWN' && (
                              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 px-1.5 py-0.5 rounded-md bg-emerald-500/10">
                                <TrendingDown className="w-2.5 h-2.5" /> -
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-white/50 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {travel.destination}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDateShort(travel.departureDate)}
                            </span>
                            <span
                              className={`flex items-center gap-1 font-semibold ${
                                travel.daysUntilDeparture < 30
                                  ? 'text-red-400'
                                  : travel.daysUntilDeparture < 60
                                  ? 'text-amber-400'
                                  : 'text-white/50'
                              }`}
                            >
                              J-{travel.daysUntilDeparture}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {travel.passengerCount}/{travel.capacity}
                            </span>
                            <span className="flex items-center gap-1 text-[#D4A853]">
                              <Briefcase className="w-3 h-3" />
                              {travel.ownerName}
                            </span>
                          </div>
                        </div>

                        <div className="w-36 hidden sm:block">
                          <MiniScoreBar score={travel.riskScore} level={travel.riskLevel} />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                          >
                            {cfg.label}
                          </span>
                          {pendingRisks > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] text-white/70 bg-white/[0.06] border border-white/10">
                              {pendingRisks} action{pendingRisks > 1 ? 's' : ''}
                            </span>
                          )}
                          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="w-4 h-4 text-white/40" />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    {/* Details deplies */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-white/[0.05]">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-5">
                              {/* Colonne gauche : liste des risques */}
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <div className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
                                    Risques identifies ({travel.risks.length})
                                  </div>
                                  <Link
                                    href={`/admin/voyages/${travel.travelId}`}
                                    className="flex items-center gap-1 text-[11px] text-[#D4A853] hover:underline"
                                  >
                                    Fiche voyage
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </div>

                                {travel.risks.map(risk => {
                                  const cat = CATEGORY_CONFIG[risk.category];
                                  const sev = RISK_CONFIG[risk.severity];
                                  const CatIcon = cat.Icon;
                                  return (
                                    <div
                                      key={risk.id}
                                      className="p-3 rounded-xl border transition-colors"
                                      style={{
                                        background: `${sev.color}08`,
                                        borderColor: `${sev.color}20`,
                                      }}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div
                                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                          style={{
                                            background: `${cat.color}15`,
                                            border: `1px solid ${cat.color}30`,
                                          }}
                                        >
                                          <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-white">
                                                  {risk.label}
                                                </span>
                                                <span
                                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                                                  style={{ color: sev.color, background: `${sev.color}15` }}
                                                >
                                                  {sev.label}
                                                </span>
                                                <StatusBadge status={risk.status} />
                                              </div>
                                              {risk.description && (
                                                <p
                                                  className="text-xs text-white/60 mt-1"
                                                  dangerouslySetInnerHTML={{ __html: risk.description }}
                                                />
                                              )}
                                              {(risk.owner || risk.dueDate) && (
                                                <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40">
                                                  {risk.owner && (
                                                    <span className="flex items-center gap-1">
                                                      <Briefcase className="w-2.5 h-2.5" />
                                                      {risk.owner}
                                                    </span>
                                                  )}
                                                  {risk.dueDate && (
                                                    <span className="flex items-center gap-1">
                                                      <Clock className="w-2.5 h-2.5" />
                                                      Echeance {formatDateShort(risk.dueDate)}
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                            {risk.action && (
                                              risk.actionUrl ? (
                                                <Link
                                                  href={risk.actionUrl}
                                                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:scale-105"
                                                  style={{
                                                    background: sev.color,
                                                    color: '#0A0E14',
                                                    boxShadow: `0 2px 12px ${sev.glow}`,
                                                  }}
                                                >
                                                  {risk.action}
                                                  <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                              ) : (
                                                <button
                                                  type="button"
                                                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:scale-105"
                                                  style={{
                                                    background: sev.color,
                                                    color: '#0A0E14',
                                                    boxShadow: `0 2px 12px ${sev.glow}`,
                                                  }}
                                                >
                                                  {risk.action}
                                                </button>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Colonne droite : checklist + contacts */}
                              <div className="flex flex-col gap-4">
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                  <div className="flex items-center gap-2 mb-3">
                                    <FileCheck className="w-3.5 h-3.5" style={{ color: GOLD }} />
                                    <div className="text-[11px] uppercase tracking-wider text-white/70 font-medium">
                                      Checklist obligatoire
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2.5">
                                    <ChecklistItem done={travel.checklist.insurance} label="Assurance souscrite" />
                                    <ChecklistItem done={travel.checklist.briefing} label="Briefing voyageurs fait" />
                                    <ChecklistItem done={travel.checklist.embassy} label="Contacts ambassade" />
                                    <ChecklistItem done={travel.checklist.planB} label="Plan B transport valide" />
                                  </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                  <div className="flex items-center gap-2 mb-3">
                                    <PhoneCall className="w-3.5 h-3.5" style={{ color: GOLD }} />
                                    <div className="text-[11px] uppercase tracking-wider text-white/70 font-medium">
                                      Contacts urgence
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 text-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white/60">Astreinte Eventy</span>
                                      <span className="text-white font-medium">+33 7 85 42 11 80</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-white/60">Ambassade France</span>
                                      <span className="text-[#D4A853]">Voir fiche</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-white/60">Assurance Mondial</span>
                                      <span className="text-white font-medium">+33 1 40 25 25 25</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Link
                                    href={`/admin/voyages/${travel.travelId}/controle/risques`}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0A0E14] transition-all hover:scale-[1.02]"
                                    style={{
                                      background: 'linear-gradient(135deg, #D4A853 0%, #C4923E 100%)',
                                      boxShadow: '0 4px 20px rgba(212,168,83,0.25)',
                                    }}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    Ouvrir dossier complet
                                  </Link>
                                  <Link
                                    href={`/admin/voyages/${travel.travelId}/messagerie`}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    Contacter equipe
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ─── Historique incidents ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
              <History className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Historique incidents</div>
              <div className="text-[11px] text-white/50">
                Dernieres 12 mois &middot; {INCIDENTS.length} incidents resolus
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-px"
              style={{
                background: 'linear-gradient(180deg, rgba(212,168,83,0.4) 0%, rgba(212,168,83,0.05) 100%)',
              }}
            />
            <div className="flex flex-col gap-4">
              {INCIDENTS.map((inc, idx) => {
                const cat = CATEGORY_CONFIG[inc.category];
                const sev = RISK_CONFIG[inc.severity];
                const CatIcon = cat.Icon;
                return (
                  <motion.div
                    key={inc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="relative pl-12"
                  >
                    <div
                      className="absolute left-0 top-1 w-8 h-8 rounded-xl flex items-center justify-center z-10"
                      style={{
                        background: '#0A0E14',
                        border: `1px solid ${cat.color}60`,
                        boxShadow: `0 0 12px ${cat.color}30`,
                      }}
                    >
                      <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                    </div>
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{inc.label}</span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                            style={{ color: sev.color, background: `${sev.color}15` }}
                          >
                            {sev.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-white/50">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {inc.destination}
                          </span>
                          <span>{formatDate(inc.date)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/60">{inc.resolution}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="pt-4 pb-2 flex items-center justify-between flex-wrap gap-2 text-[10px] text-white/30">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Systeme operationnel
          </div>
          <div>Derniere synchro : {new Date().toLocaleTimeString('fr-FR')}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
