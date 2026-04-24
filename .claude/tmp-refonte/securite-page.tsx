"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  MapPin,
  Globe2,
  Phone,
  Activity,
  Siren,
  Radio,
  Thermometer,
  Zap,
  Search,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Users,
  Plane,
  Clock,
  X,
  FileText,
  ExternalLink,
  Heart,
  BellRing,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Filter,
  Flame,
  CloudRain,
  Waves,
  Mountain,
} from "lucide-react";

const GOLD = "#D4A853";
const GOLD_SOFT = "rgba(212,168,83,0.14)";
const GOLD_RING = "rgba(212,168,83,0.42)";
const BG = "#0A0E14";

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(14px)",
};

const GLASS_STRONG: React.CSSProperties = {
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(212,168,83,0.22)",
  backdropFilter: "blur(18px)",
};

type RiskLevel = "faible" | "modere" | "eleve" | "critique";
type AlertKind = "meteo" | "sante" | "politique" | "transport" | "terrain" | "cyber";
type DestinationStatus = "ouvert" | "vigilance" | "restreint" | "ferme";

interface Destination {
  id: string;
  country: string;
  flag: string;
  city: string;
  risk: RiskLevel;
  status: DestinationStatus;
  activeTravelers: number;
  activeTrips: number;
  lastCheck: string;
  notes: string;
  threats: { kind: AlertKind; label: string }[];
}

interface AlertItem {
  id: string;
  kind: AlertKind;
  level: RiskLevel;
  title: string;
  destination: string;
  travelers: number;
  createdAt: string;
  source: string;
  action: string;
  acknowledged: boolean;
}

interface Protocol {
  id: string;
  name: string;
  scope: string;
  steps: number;
  lastReview: string;
  owner: string;
  icon: React.ElementType;
}

interface EmergencyContact {
  id: string;
  role: string;
  name: string;
  country: string;
  phone: string;
  scope: string;
  availability: string;
  priority: number;
}

const DESTINATIONS: Destination[] = [
  {
    id: "d01",
    country: "Maroc",
    flag: "MA",
    city: "Marrakech",
    risk: "faible",
    status: "ouvert",
    activeTravelers: 42,
    activeTrips: 3,
    lastCheck: "2026-04-22",
    notes: "Vigilance standard, pas de menace identifiee sur Marrakech et la region.",
    threats: [{ kind: "terrain", label: "Chaleur extreme possible (42C)" }],
  },
  {
    id: "d02",
    country: "Indonesie",
    flag: "ID",
    city: "Bali",
    risk: "modere",
    status: "vigilance",
    activeTravelers: 28,
    activeTrips: 2,
    lastCheck: "2026-04-22",
    notes: "Saison des pluies prolongee, vigilance zones rurales et volcans actifs.",
    threats: [
      { kind: "meteo", label: "Pluies intenses Ubud" },
      { kind: "terrain", label: "Volcan Agung niveau 2" },
    ],
  },
  {
    id: "d03",
    country: "Jordanie",
    flag: "JO",
    city: "Petra",
    risk: "modere",
    status: "vigilance",
    activeTravelers: 18,
    activeTrips: 1,
    lastCheck: "2026-04-21",
    notes: "Frontiere Nord a eviter absolument, reste du pays accessible.",
    threats: [{ kind: "politique", label: "Tensions regionales" }],
  },
  {
    id: "d04",
    country: "Japon",
    flag: "JP",
    city: "Kyoto",
    risk: "faible",
    status: "ouvert",
    activeTravelers: 34,
    activeTrips: 2,
    lastCheck: "2026-04-22",
    notes: "Aucune alerte en cours, sismique surveille mais calme.",
    threats: [],
  },
  {
    id: "d05",
    country: "Perou",
    flag: "PE",
    city: "Cuzco",
    risk: "eleve",
    status: "restreint",
    activeTravelers: 12,
    activeTrips: 1,
    lastCheck: "2026-04-22",
    notes: "Manifestations a Lima, Cuzco et Machu Picchu accessibles sous escorte locale.",
    threats: [
      { kind: "politique", label: "Manifestations Lima" },
      { kind: "sante", label: "Mal des montagnes > 3800m" },
    ],
  },
  {
    id: "d06",
    country: "Grece",
    flag: "GR",
    city: "Santorin",
    risk: "faible",
    status: "ouvert",
    activeTravelers: 22,
    activeTrips: 2,
    lastCheck: "2026-04-22",
    notes: "Haute saison stable, feux de foret surveilles en zone interieure.",
    threats: [{ kind: "meteo", label: "Risque incendie juillet-aout" }],
  },
  {
    id: "d07",
    country: "Inde",
    flag: "IN",
    city: "Kerala",
    risk: "modere",
    status: "vigilance",
    activeTravelers: 16,
    activeTrips: 1,
    lastCheck: "2026-04-22",
    notes: "Mousson attendue mi-juin, eviter deplacements terrestres prolonges.",
    threats: [
      { kind: "meteo", label: "Mousson" },
      { kind: "sante", label: "Eau non potable" },
    ],
  },
  {
    id: "d08",
    country: "Islande",
    flag: "IS",
    city: "Reykjavik",
    risk: "modere",
    status: "vigilance",
    activeTravelers: 8,
    activeTrips: 1,
    lastCheck: "2026-04-20",
    notes: "Activite volcanique peninsule Reykjanes, itineraire adapte.",
    threats: [{ kind: "terrain", label: "Fissure volcanique active" }],
  },
];

const ALERTS: AlertItem[] = [
  {
    id: "a01",
    kind: "meteo",
    level: "critique",
    title: "Tempete tropicale categorie 3 en approche",
    destination: "Bali, Indonesie",
    travelers: 28,
    createdAt: "2026-04-22T08:12:00Z",
    source: "Meteo France International",
    action: "Confinement hotel, report activites exterieures 48h",
    acknowledged: false,
  },
  {
    id: "a02",
    kind: "politique",
    level: "eleve",
    title: "Manifestations centre-ville Lima",
    destination: "Lima, Perou",
    travelers: 12,
    createdAt: "2026-04-22T06:40:00Z",
    source: "France Diplomatie",
    action: "Itineraire devie, transfert direct Cuzco",
    acknowledged: true,
  },
  {
    id: "a03",
    kind: "sante",
    level: "modere",
    title: "Alerte dengue en hausse",
    destination: "Kerala, Inde",
    travelers: 16,
    createdAt: "2026-04-21T14:00:00Z",
    source: "OMS",
    action: "Diffusion consignes repulsifs + surveillance fievre",
    acknowledged: true,
  },
  {
    id: "a04",
    kind: "transport",
    level: "modere",
    title: "Greve controleurs aeriens",
    destination: "Paris CDG",
    travelers: 46,
    createdAt: "2026-04-22T04:30:00Z",
    source: "DGAC",
    action: "Reroutage via Amsterdam pour 2 vols",
    acknowledged: false,
  },
  {
    id: "a05",
    kind: "terrain",
    level: "eleve",
    title: "Activite volcanique Fagradalsfjall",
    destination: "Reykjanes, Islande",
    travelers: 8,
    createdAt: "2026-04-20T22:15:00Z",
    source: "Icelandic Met Office",
    action: "Peripherique volcan ferme, detour valide par guide",
    acknowledged: true,
  },
  {
    id: "a06",
    kind: "cyber",
    level: "faible",
    title: "Tentatives phishing ciblant voyageurs",
    destination: "Global",
    travelers: 180,
    createdAt: "2026-04-19T10:00:00Z",
    source: "Eventy SOC",
    action: "Email de rappel envoye + filtre SMTP durci",
    acknowledged: true,
  },
];

const PROTOCOLS: Protocol[] = [
  { id: "p01", name: "Evacuation sanitaire",       scope: "Tous voyages",          steps: 9,  lastReview: "2026-03-15", owner: "Dr. Lefevre",  icon: Heart      },
  { id: "p02", name: "Catastrophe naturelle",      scope: "Destinations a risque", steps: 12, lastReview: "2026-02-28", owner: "Pole securite", icon: Mountain   },
  { id: "p03", name: "Crise politique / coup etat",scope: "Pays sensibles",        steps: 11, lastReview: "2026-04-01", owner: "Direction ops", icon: ShieldAlert },
  { id: "p04", name: "Disparition voyageur",       scope: "Tous voyages",          steps: 8,  lastReview: "2026-03-22", owner: "Pole securite", icon: Search     },
  { id: "p05", name: "Accident transport grave",   scope: "Bus + avion + bateau",  steps: 14, lastReview: "2026-04-10", owner: "Direction ops", icon: Plane      },
  { id: "p06", name: "Cyber incident donnees",     scope: "SI central",            steps: 7,  lastReview: "2026-04-05", owner: "DSI",           icon: Zap        },
];

const CONTACTS: EmergencyContact[] = [
  { id: "c01", role: "Cellule de crise Eventy",       name: "David A.",           country: "FR", phone: "+33 6 12 34 56 78", scope: "Direction generale",       availability: "24/7",   priority: 1 },
  { id: "c02", role: "Medecin reference",             name: "Dr. Lefevre",        country: "FR", phone: "+33 6 45 67 89 10", scope: "Triage medical",           availability: "24/7",   priority: 1 },
  { id: "c03", role: "Assistance rapatriement",       name: "Assurup",            country: "FR", phone: "+33 1 40 00 12 34", scope: "Rapatriement sanitaire",    availability: "24/7",   priority: 1 },
  { id: "c04", role: "Ambassade France Maroc",        name: "Consulat Rabat",     country: "MA", phone: "+212 5 37 68 98 00", scope: "Voyageurs au Maroc",       availability: "24/7",   priority: 2 },
  { id: "c05", role: "Ambassade France Indonesie",    name: "Consulat Jakarta",   country: "ID", phone: "+62 21 2355 7600",   scope: "Voyageurs Bali/Java",      availability: "24/7",   priority: 2 },
  { id: "c06", role: "Prefecture Lima",               name: "Securite publique",  country: "PE", phone: "+51 1 315 8888",     scope: "Manifestations Perou",     availability: "24/7",   priority: 2 },
  { id: "c07", role: "Coordinateur local Bali",       name: "Wayan K.",           country: "ID", phone: "+62 812 3456 7890",  scope: "Guide terrain Bali",       availability: "06h-23h", priority: 3 },
  { id: "c08", role: "Coordinateur local Marrakech",  name: "Ahmed B.",           country: "MA", phone: "+212 6 12 34 56 00", scope: "Guide terrain Maroc",      availability: "06h-23h", priority: 3 },
  { id: "c09", role: "Avocat tourisme",               name: "Me Dubois",          country: "FR", phone: "+33 1 44 55 66 77",   scope: "Litiges et accidents",     availability: "Heures bureau", priority: 3 },
];

const RISK_CFG: Record<RiskLevel, { label: string; color: string; bg: string; dot: string }> = {
  faible:   { label: "Faible",   color: "#34d399", bg: "rgba(52,211,153,0.14)",  dot: "#34d399" },
  modere:   { label: "Modere",   color: "#fbbf24", bg: "rgba(251,191,36,0.14)",  dot: "#fbbf24" },
  eleve:    { label: "Eleve",    color: "#fb923c", bg: "rgba(251,146,60,0.14)",  dot: "#fb923c" },
  critique: { label: "Critique", color: "#f87171", bg: "rgba(248,113,113,0.14)", dot: "#f87171" },
};

const STATUS_CFG: Record<DestinationStatus, { label: string; color: string }> = {
  ouvert:    { label: "Ouvert",    color: "#34d399" },
  vigilance: { label: "Vigilance", color: "#fbbf24" },
  restreint: { label: "Restreint", color: "#fb923c" },
  ferme:     { label: "Ferme",     color: "#f87171" },
};

const KIND_CFG: Record<AlertKind, { label: string; color: string; icon: React.ElementType }> = {
  meteo:     { label: "Meteo",     color: "#60a5fa", icon: CloudRain },
  sante:     { label: "Sante",     color: "#f472b6", icon: Heart },
  politique: { label: "Politique", color: "#fb923c", icon: ShieldAlert },
  transport: { label: "Transport", color: "#a78bfa", icon: Plane },
  terrain:   { label: "Terrain",   color: "#fbbf24", icon: Mountain },
  cyber:     { label: "Cyber",     color: "#22d3ee", icon: Zap },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "il y a quelques minutes";
  if (h < 24) return "il y a " + h + "h";
  const d = Math.floor(h / 24);
  return "il y a " + d + "j";
}

export default function SecuritePage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [kindFilter, setKindFilter] = useState<AlertKind | "all">("all");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [onlyUnacked, setOnlyUnacked] = useState(false);

  const filteredDest = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = (d.country + " " + d.city).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (riskFilter !== "all" && d.risk !== riskFilter) return false;
      return true;
    });
  }, [search, riskFilter]);

  const filteredAlerts = useMemo(() => {
    return ALERTS.filter((a) => {
      if (kindFilter !== "all" && a.kind !== kindFilter) return false;
      if (onlyUnacked && a.acknowledged) return false;
      return true;
    });
  }, [kindFilter, onlyUnacked]);

  const stats = useMemo(() => {
    const totalTravelers = DESTINATIONS.reduce((s, d) => s + d.activeTravelers, 0);
    const criticalAlerts = ALERTS.filter((a) => a.level === "critique").length;
    const openAlerts = ALERTS.filter((a) => !a.acknowledged).length;
    const highRiskDest = DESTINATIONS.filter((d) => d.risk === "eleve" || d.risk === "critique").length;
    return { totalTravelers, criticalAlerts, openAlerts, highRiskDest, destCount: DESTINATIONS.length };
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh" }} className="text-white">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 0%, rgba(248,113,113,0.06), transparent 60%), radial-gradient(700px 400px at 90% 100%, rgba(212,168,83,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        <Header stats={stats} />

        <KpiGrid stats={stats} />

        <LiveAlerts alerts={filteredAlerts} kindFilter={kindFilter} setKindFilter={setKindFilter} onlyUnacked={onlyUnacked} setOnlyUnacked={setOnlyUnacked} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 mt-8">
          <div>
            <DestinationFilters
              search={search}
              setSearch={setSearch}
              riskFilter={riskFilter}
              setRiskFilter={setRiskFilter}
              count={filteredDest.length}
            />
            <DestinationGrid list={filteredDest} onSelect={setSelectedDest} />
          </div>

          <aside className="space-y-5">
            <ProtocolsPanel />
            <ContactsPanel />
          </aside>
        </div>

        <AnimatePresence>
          {selectedDest && <DestinationDrawer dest={selectedDest} onClose={() => setSelectedDest(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({ stats }: { stats: { totalTravelers: number; criticalAlerts: number; openAlerts: number; destCount: number } }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-start justify-between gap-4 mb-8"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: GOLD_SOFT, border: "1px solid " + GOLD_RING }}
          >
            <Shield size={22} style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Centre de securite</h1>
            <p className="text-sm text-white/60 mt-0.5">
              {stats.totalTravelers} voyageurs en cours sur {stats.destCount} destinations, {stats.openAlerts} alertes a traiter
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition hover:brightness-110" style={GLASS}>
          <Download size={15} /> Export situation
        </button>
        <button
          className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #f87171 0%, #c53030 100%)", color: "white", boxShadow: "0 8px 24px rgba(248,113,113,0.32)" }}
        >
          <Siren size={16} /> Declencher cellule de crise
        </button>
      </div>
    </motion.header>
  );
}

function KpiGrid({ stats }: { stats: { totalTravelers: number; criticalAlerts: number; openAlerts: number; highRiskDest: number; destCount: number } }) {
  const cards = [
    { label: "Voyageurs actifs",     value: stats.totalTravelers, icon: Users,         color: GOLD,      trend: "+6", up: true  },
    { label: "Alertes ouvertes",     value: stats.openAlerts,      icon: BellRing,      color: "#fb923c", trend: "+2", up: false },
    { label: "Alertes critiques",    value: stats.criticalAlerts,  icon: ShieldAlert,   color: "#f87171", trend: "0",  up: true  },
    { label: "Destinations a risque",value: stats.highRiskDest,    icon: Globe2,        color: "#fbbf24", trend: "+1", up: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={GLASS}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.color + "1a", border: "1px solid " + c.color + "33" }}>
              <c.icon size={18} style={{ color: c.color }} />
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: c.up ? "#34d399" : "#f87171" }}>
              {c.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="font-semibold">{c.trend}</span>
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{c.value}</div>
          <div className="text-xs text-white/55 mt-1">{c.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function LiveAlerts({
  alerts,
  kindFilter,
  setKindFilter,
  onlyUnacked,
  setOnlyUnacked,
}: {
  alerts: AlertItem[];
  kindFilter: AlertKind | "all";
  setKindFilter: (k: AlertKind | "all") => void;
  onlyUnacked: boolean;
  setOnlyUnacked: (v: boolean) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl p-5 mt-8"
      style={GLASS_STRONG}
    >
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full" style={{ background: "#f87171", boxShadow: "0 0 14px #f87171" }} />
            <Radio size={20} style={{ color: GOLD }} />
          </div>
          <h2 className="text-lg font-semibold">Flux alertes en direct</h2>
          <span className="px-2.5 py-1 text-xs rounded-full" style={{ background: GOLD_SOFT, color: GOLD }}>
            {alerts.length} en cours
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setOnlyUnacked(!onlyUnacked)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2"
            style={onlyUnacked ? { background: "rgba(248,113,113,0.14)", color: "#f87171", border: "1px solid rgba(248,113,113,0.32)" } : { ...GLASS }}
          >
            <Filter size={13} /> Non traitees
          </button>
          <div className="flex items-center gap-1 rounded-lg p-1" style={GLASS}>
            {(["all", "meteo", "sante", "politique", "transport", "terrain", "cyber"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKindFilter(k)}
                className="px-2.5 py-1 rounded-md text-xs font-medium transition"
                style={kindFilter === k ? { background: GOLD_SOFT, color: GOLD } : { color: "rgba(255,255,255,0.6)" }}
              >
                {k === "all" ? "Tout" : KIND_CFG[k].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-white/50 text-sm">Aucune alerte en cours pour ces filtres</div>
        ) : (
          alerts.map((a, i) => <AlertRow key={a.id} alert={a} delay={i * 0.04} />)
        )}
      </div>
    </motion.section>
  );
}

function AlertRow({ alert, delay }: { alert: AlertItem; delay: number }) {
  const kind = KIND_CFG[alert.kind];
  const risk = RISK_CFG[alert.level];
  const Icon = kind.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl p-4 flex items-start gap-4 hover:brightness-110 transition"
      style={{
        background: alert.acknowledged ? "rgba(255,255,255,0.025)" : "rgba(248,113,113,0.06)",
        border: "1px solid " + (alert.acknowledged ? "rgba(255,255,255,0.07)" : "rgba(248,113,113,0.2)"),
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: kind.color + "1a", border: "1px solid " + kind.color + "33" }}>
        <Icon size={18} style={{ color: kind.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: risk.bg, color: risk.color }}>
            {risk.label}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: kind.color + "1a", color: kind.color }}>
            {kind.label}
          </span>
          {alert.acknowledged ? (
            <span className="text-xs text-white/45 flex items-center gap-1">
              <ShieldCheck size={12} /> Pris en charge
            </span>
          ) : (
            <span className="text-xs font-semibold" style={{ color: "#f87171" }}>
              A traiter
            </span>
          )}
        </div>
        <div className="text-sm font-semibold leading-tight">{alert.title}</div>
        <div className="text-xs text-white/55 mt-1 flex items-center gap-2 flex-wrap">
          <MapPin size={11} />
          <span>{alert.destination}</span>
          <span className="text-white/30">|</span>
          <Users size={11} />
          <span>{alert.travelers} voyageurs</span>
          <span className="text-white/30">|</span>
          <Clock size={11} />
          <span>{timeAgo(alert.createdAt)}</span>
          <span className="text-white/30">|</span>
          <span>Source {alert.source}</span>
        </div>
        <div className="text-xs text-white/75 mt-2 flex items-center gap-2">
          <Zap size={11} style={{ color: GOLD }} />
          <span>{alert.action}</span>
        </div>
      </div>
      <button className="shrink-0 p-2 rounded-lg hover:bg-white/5 transition">
        <ChevronRight size={16} className="text-white/50" />
      </button>
    </motion.div>
  );
}

function DestinationFilters({
  search,
  setSearch,
  riskFilter,
  setRiskFilter,
  count,
}: {
  search: string;
  setSearch: (v: string) => void;
  riskFilter: RiskLevel | "all";
  setRiskFilter: (v: RiskLevel | "all") => void;
  count: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="flex items-center gap-3 flex-wrap mb-5"
    >
      <div className="flex items-center flex-1 min-w-[220px] rounded-xl px-3 py-2" style={GLASS}>
        <Search size={15} className="text-white/45 mr-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un pays ou une ville..."
          className="bg-transparent outline-none text-sm flex-1 placeholder-white/35"
        />
      </div>
      <div className="flex items-center gap-1 rounded-xl p-1" style={GLASS}>
        {(["all", "faible", "modere", "eleve", "critique"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRiskFilter(r)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
            style={riskFilter === r ? { background: GOLD_SOFT, color: GOLD } : { color: "rgba(255,255,255,0.6)" }}
          >
            {r === "all" ? "Tous risques" : RISK_CFG[r].label}
          </button>
        ))}
      </div>
      <div className="text-sm text-white/55">{count} destinations</div>
    </motion.div>
  );
}

function DestinationGrid({ list, onSelect }: { list: Destination[]; onSelect: (d: Destination) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {list.map((d, i) => (
        <DestinationCard key={d.id} dest={d} onSelect={onSelect} delay={i * 0.03} />
      ))}
    </div>
  );
}

function DestinationCard({ dest, onSelect, delay }: { dest: Destination; onSelect: (d: Destination) => void; delay: number }) {
  const risk = RISK_CFG[dest.risk];
  const status = STATUS_CFG[dest.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={() => onSelect(dest)}
      whileHover={{ y: -2 }}
      className="text-left rounded-2xl p-5 transition"
      style={{ ...GLASS, borderLeft: "3px solid " + risk.color }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold tracking-wide" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {dest.flag}
          </div>
          <div>
            <div className="text-base font-semibold">{dest.city}</div>
            <div className="text-xs text-white/55">{dest.country}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide" style={{ background: risk.bg, color: risk.color }}>
            {risk.label}
          </span>
          <span className="text-[10px] text-white/55 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
            {status.label}
          </span>
        </div>
      </div>

      <p className="text-xs text-white/60 leading-relaxed mb-3">{dest.notes}</p>

      {dest.threats.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dest.threats.map((t, i) => {
            const k = KIND_CFG[t.kind];
            const Icon = k.icon;
            return (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: k.color + "1a", color: k.color }}>
                <Icon size={10} /> {t.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <div className="text-sm font-semibold">{dest.activeTravelers}</div>
          <div className="text-[10px] text-white/50">Voyageurs</div>
        </div>
        <div>
          <div className="text-sm font-semibold">{dest.activeTrips}</div>
          <div className="text-[10px] text-white/50">Voyages</div>
        </div>
        <div>
          <div className="text-sm font-semibold">{new Date(dest.lastCheck).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</div>
          <div className="text-[10px] text-white/50">Dernier check</div>
        </div>
      </div>
    </motion.button>
  );
}

function ProtocolsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl p-5"
      style={GLASS}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: GOLD }} />
          <h3 className="text-sm font-semibold">Protocoles de securite</h3>
        </div>
        <span className="text-xs text-white/50">{PROTOCOLS.length}</span>
      </div>

      <div className="space-y-2">
        {PROTOCOLS.map((p) => (
          <button
            key={p.id}
            className="w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-white/5 transition"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: GOLD_SOFT, border: "1px solid " + GOLD_RING }}>
              <p.icon size={16} style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.name}</div>
              <div className="text-[11px] text-white/50">{p.steps} etapes | {p.owner}</div>
            </div>
            <ChevronRight size={14} className="text-white/40 shrink-0" />
          </button>
        ))}
      </div>

      <button className="w-full mt-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2" style={{ background: GOLD_SOFT, color: GOLD }}>
        <ExternalLink size={13} /> Voir tous les protocoles
      </button>
    </motion.div>
  );
}

function ContactsPanel() {
  const sorted = [...CONTACTS].sort((a, b) => a.priority - b.priority);
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl p-5"
      style={GLASS}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Phone size={16} style={{ color: GOLD }} />
          <h3 className="text-sm font-semibold">Contacts urgence</h3>
        </div>
        <span className="text-xs text-white/50">{sorted.length}</span>
      </div>

      <div className="space-y-2">
        {sorted.map((c) => (
          <div
            key={c.id}
            className="rounded-xl px-3 py-2.5 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.02)", borderLeft: "2px solid " + (c.priority === 1 ? "#f87171" : c.priority === 2 ? "#fbbf24" : "rgba(255,255,255,0.2)") }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{c.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                  {c.country}
                </span>
              </div>
              <div className="text-[11px] text-white/55 truncate">{c.role}</div>
              <div className="text-[11px] font-mono text-white/70 mt-0.5">{c.phone}</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] text-white/45">{c.availability}</span>
              <a href={"tel:" + c.phone.replace(/\s/g, "")} className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:brightness-110" style={{ background: GOLD_SOFT, border: "1px solid " + GOLD_RING }}>
                <Phone size={13} style={{ color: GOLD }} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DestinationDrawer({ dest, onClose }: { dest: Destination; onClose: () => void }) {
  const risk = RISK_CFG[dest.risk];
  const status = STATUS_CFG[dest.status];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full max-w-[520px] z-50 overflow-y-auto"
        style={{ background: BG, borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="sticky top-0 z-10 p-5 flex items-center justify-between" style={{ background: "rgba(10,14,20,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {dest.flag}
            </div>
            <div>
              <div className="font-semibold text-lg leading-tight">{dest.city}</div>
              <div className="text-xs text-white/55">{dest.country}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/5 transition">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={GLASS}>
              <div className="text-xs text-white/55 mb-1">Niveau de risque</div>
              <div className="text-lg font-bold" style={{ color: risk.color }}>{risk.label}</div>
            </div>
            <div className="rounded-xl p-4" style={GLASS}>
              <div className="text-xs text-white/55 mb-1">Statut</div>
              <div className="text-lg font-bold" style={{ color: status.color }}>{status.label}</div>
            </div>
            <div className="rounded-xl p-4" style={GLASS}>
              <div className="text-xs text-white/55 mb-1">Voyageurs sur place</div>
              <div className="text-lg font-bold">{dest.activeTravelers}</div>
            </div>
            <div className="rounded-xl p-4" style={GLASS}>
              <div className="text-xs text-white/55 mb-1">Voyages en cours</div>
              <div className="text-lg font-bold">{dest.activeTrips}</div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="text-xs text-white/55 mb-2 flex items-center gap-2">
              <Activity size={12} /> Note situation
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{dest.notes}</p>
          </div>

          {dest.threats.length > 0 && (
            <div className="rounded-xl p-4" style={GLASS}>
              <div className="text-xs text-white/55 mb-3">Menaces identifiees</div>
              <div className="space-y-2">
                {dest.threats.map((t, i) => {
                  const k = KIND_CFG[t.kind];
                  const Icon = k.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: k.color + "1a" }}>
                        <Icon size={14} style={{ color: k.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{t.label}</div>
                        <div className="text-[10px] text-white/45">{k.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: GOLD_SOFT, color: GOLD, border: "1px solid " + GOLD_RING }}>
              <Eye size={14} /> Voir voyageurs
            </button>
            <button className="py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: "rgba(248,113,113,0.14)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
              <Siren size={14} /> Activer protocole
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
