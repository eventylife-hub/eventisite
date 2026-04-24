"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Star,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Crown,
  Award,
  Shield,
  Heart,
  Zap,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  ChevronRight,
  LayoutGrid,
  List,
  Download,
  UserCheck,
  UserX,
  Clock,
  Plane,
  Euro,
  ArrowUpRight,
  Flame,
  X,
  Eye,
  BadgeCheck,
  Briefcase,
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

type IndepStatus = "actif" | "en_attente" | "suspendu" | "archive";
type IndepAvail = "disponible" | "en_mission" | "indisponible" | "derniere_minute";
type CotisStatus = "a_jour" | "en_retard" | "suspendue";
type SpecKey = "culture" | "aventure" | "gastronomie" | "bien_etre" | "famille" | "luxe" | "nature" | "urbain";
type ViewMode = "grid" | "list";

interface Independant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  photo: string;
  specialty: SpecKey;
  zone: string;
  country: string;
  languages: string[];
  status: IndepStatus;
  availability: IndepAvail;
  rating: number;
  reviewsCount: number;
  tripsCompleted: number;
  revenueYear: number;
  nextTrip: { name: string; date: string } | null;
  cotisation: CotisStatus;
  joinDate: string;
  verified: boolean;
  trained: boolean;
  firstAid: boolean;
  lastMinute: boolean;
  bio: string;
}

const INDEPS: Independant[] = [
  {
    id: "i01",
    firstName: "Ahmed",
    lastName: "Benali",
    email: "ahmed.benali@guide.ma",
    phone: "+212 6 12 34 56",
    avatar: "AB",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    specialty: "culture",
    zone: "Marrakech",
    country: "Maroc",
    languages: ["FR", "AR", "EN"],
    status: "actif",
    availability: "en_mission",
    rating: 4.9,
    reviewsCount: 218,
    tripsCompleted: 47,
    revenueYear: 32400,
    nextTrip: { name: "Maroc Express", date: "2026-05-18" },
    cotisation: "a_jour",
    joinDate: "2025-06-15",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: false,
    bio: "Guide culturel a Marrakech, specialise medina et cuisine berbere.",
  },
  {
    id: "i02",
    firstName: "Elena",
    lastName: "Papadopoulos",
    email: "elena@santorin-guide.gr",
    phone: "+30 694 12 34 56",
    avatar: "EP",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80",
    specialty: "luxe",
    zone: "Santorin",
    country: "Grece",
    languages: ["FR", "EN", "GR", "IT"],
    status: "actif",
    availability: "disponible",
    rating: 5.0,
    reviewsCount: 142,
    tripsCompleted: 31,
    revenueYear: 28700,
    nextTrip: { name: "Santorin Sunset", date: "2026-06-02" },
    cotisation: "a_jour",
    joinDate: "2025-04-22",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: true,
    bio: "Guide haute gamme, hotels 5 etoiles et caldera privatisee.",
  },
  {
    id: "i03",
    firstName: "Takeshi",
    lastName: "Yamamoto",
    email: "takeshi@kyoto-zen.jp",
    phone: "+81 90 1234 5678",
    avatar: "TY",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    specialty: "bien_etre",
    zone: "Kyoto",
    country: "Japon",
    languages: ["FR", "EN", "JP"],
    status: "actif",
    availability: "disponible",
    rating: 4.8,
    reviewsCount: 89,
    tripsCompleted: 19,
    revenueYear: 18200,
    nextTrip: { name: "Kyoto Zen", date: "2026-05-28" },
    cotisation: "a_jour",
    joinDate: "2025-09-10",
    verified: true,
    trained: true,
    firstAid: false,
    lastMinute: false,
    bio: "Maitre de the certifie, parcours temples et meditation zen.",
  },
  {
    id: "i04",
    firstName: "Carlos",
    lastName: "Rodriguez",
    email: "carlos@barcelona-tapas.es",
    phone: "+34 630 12 34 56",
    avatar: "CR",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
    specialty: "gastronomie",
    zone: "Barcelone",
    country: "Espagne",
    languages: ["FR", "ES", "CA", "EN"],
    status: "actif",
    availability: "derniere_minute",
    rating: 4.7,
    reviewsCount: 312,
    tripsCompleted: 62,
    revenueYear: 41200,
    nextTrip: null,
    cotisation: "a_jour",
    joinDate: "2025-02-08",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: true,
    bio: "Sommelier et passionne tapas, contacts dans tous les marches catalans.",
  },
  {
    id: "i05",
    firstName: "Made",
    lastName: "Wirawan",
    email: "made@bali-zen.id",
    phone: "+62 812 3456 7890",
    avatar: "MW",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80",
    specialty: "nature",
    zone: "Ubud",
    country: "Indonesie",
    languages: ["FR", "EN", "ID"],
    status: "actif",
    availability: "en_mission",
    rating: 4.9,
    reviewsCount: 176,
    tripsCompleted: 28,
    revenueYear: 22400,
    nextTrip: { name: "Bali Immersion", date: "2026-05-12" },
    cotisation: "a_jour",
    joinDate: "2025-07-03",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: false,
    bio: "Guide spiritualite et rizieres, famille hote Ubud.",
  },
  {
    id: "i06",
    firstName: "Bjorn",
    lastName: "Eriksson",
    email: "bjorn@islande-aurores.is",
    phone: "+354 691 2345",
    avatar: "BE",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
    specialty: "aventure",
    zone: "Reykjavik",
    country: "Islande",
    languages: ["FR", "EN", "IS"],
    status: "actif",
    availability: "disponible",
    rating: 4.8,
    reviewsCount: 94,
    tripsCompleted: 22,
    revenueYear: 26800,
    nextTrip: { name: "Islande Aurores", date: "2026-06-15" },
    cotisation: "a_jour",
    joinDate: "2025-08-17",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: true,
    bio: "Guide glaciers et chasseur aurores, 4x4 et super jeep.",
  },
  {
    id: "i07",
    firstName: "Sofia",
    lastName: "Martinez",
    email: "sofia.martinez@provence.fr",
    phone: "+33 6 12 34 56 78",
    avatar: "SM",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    specialty: "famille",
    zone: "Provence",
    country: "France",
    languages: ["FR", "EN", "ES"],
    status: "actif",
    availability: "disponible",
    rating: 4.6,
    reviewsCount: 67,
    tripsCompleted: 14,
    revenueYear: 11200,
    nextTrip: { name: "Provence Lavande", date: "2026-07-08" },
    cotisation: "a_jour",
    joinDate: "2025-11-05",
    verified: true,
    trained: true,
    firstAid: false,
    lastMinute: false,
    bio: "Activites enfants, champs de lavande et ateliers savon.",
  },
  {
    id: "i08",
    firstName: "Leila",
    lastName: "Hassan",
    email: "leila.hassan@candidat.ma",
    phone: "+212 6 98 76 54",
    avatar: "LH",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    specialty: "urbain",
    zone: "Casablanca",
    country: "Maroc",
    languages: ["FR", "AR", "EN"],
    status: "en_attente",
    availability: "indisponible",
    rating: 0,
    reviewsCount: 0,
    tripsCompleted: 0,
    revenueYear: 0,
    nextTrip: null,
    cotisation: "suspendue",
    joinDate: "2026-04-18",
    verified: false,
    trained: false,
    firstAid: false,
    lastMinute: false,
    bio: "Candidature en cours de validation, dossier sous examen.",
  },
  {
    id: "i09",
    firstName: "Dimitri",
    lastName: "Volkov",
    email: "dimitri@prague-tours.cz",
    phone: "+420 777 123 456",
    avatar: "DV",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    specialty: "culture",
    zone: "Prague",
    country: "Republique tcheque",
    languages: ["FR", "EN", "CZ", "RU"],
    status: "suspendu",
    availability: "indisponible",
    rating: 3.8,
    reviewsCount: 42,
    tripsCompleted: 8,
    revenueYear: 4200,
    nextTrip: null,
    cotisation: "en_retard",
    joinDate: "2025-03-12",
    verified: true,
    trained: false,
    firstAid: false,
    lastMinute: false,
    bio: "Suspension temporaire suite litige client, reexamen en mai.",
  },
  {
    id: "i10",
    firstName: "Amira",
    lastName: "Khouri",
    email: "amira@petra-jordan.jo",
    phone: "+962 79 123 4567",
    avatar: "AK",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    specialty: "aventure",
    zone: "Petra",
    country: "Jordanie",
    languages: ["FR", "AR", "EN"],
    status: "actif",
    availability: "derniere_minute",
    rating: 4.9,
    reviewsCount: 128,
    tripsCompleted: 24,
    revenueYear: 19600,
    nextTrip: null,
    cotisation: "a_jour",
    joinDate: "2025-05-20",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: true,
    bio: "Guide bedouine, connaissance absolue de la vallee de Petra.",
  },
  {
    id: "i11",
    firstName: "Pierre",
    lastName: "Dubois",
    email: "pierre@normandie-gourmet.fr",
    phone: "+33 6 78 90 12 34",
    avatar: "PD",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
    specialty: "gastronomie",
    zone: "Normandie",
    country: "France",
    languages: ["FR", "EN"],
    status: "actif",
    availability: "en_mission",
    rating: 4.7,
    reviewsCount: 58,
    tripsCompleted: 12,
    revenueYear: 9800,
    nextTrip: { name: "Normandie Saveurs", date: "2026-04-28" },
    cotisation: "a_jour",
    joinDate: "2025-10-14",
    verified: true,
    trained: true,
    firstAid: false,
    lastMinute: false,
    bio: "Ancien chef, visite fermes fromageres et calvados.",
  },
  {
    id: "i12",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@kerala-backwaters.in",
    phone: "+91 98 7654 3210",
    avatar: "PS",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    specialty: "bien_etre",
    zone: "Kerala",
    country: "Inde",
    languages: ["FR", "EN", "HI"],
    status: "actif",
    availability: "disponible",
    rating: 4.8,
    reviewsCount: 73,
    tripsCompleted: 16,
    revenueYear: 12400,
    nextTrip: { name: "Kerala Ayurveda", date: "2026-09-10" },
    cotisation: "a_jour",
    joinDate: "2025-08-29",
    verified: true,
    trained: true,
    firstAid: true,
    lastMinute: false,
    bio: "Therapeute ayurveda certifiee, retraites spirituelles.",
  },
];

const SPEC_CFG: Record<SpecKey, { label: string; color: string; icon: React.ElementType }> = {
  culture: { label: "Culture", color: "#a78bfa", icon: Award },
  aventure: { label: "Aventure", color: "#fb923c", icon: Flame },
  gastronomie: { label: "Gastronomie", color: "#f472b6", icon: Heart },
  bien_etre: { label: "Bien-etre", color: "#34d399", icon: Sparkles },
  famille: { label: "Famille", color: "#60a5fa", icon: Users },
  luxe: { label: "Luxe", color: GOLD, icon: Crown },
  nature: { label: "Nature", color: "#22d3ee", icon: MapPin },
  urbain: { label: "Urbain", color: "#94a3b8", icon: Briefcase },
};

const STATUS_CFG: Record<IndepStatus, { label: string; color: string; bg: string }> = {
  actif: { label: "Actif", color: "#34d399", bg: "rgba(52,211,153,0.14)" },
  en_attente: { label: "En attente", color: "#fbbf24", bg: "rgba(251,191,36,0.14)" },
  suspendu: { label: "Suspendu", color: "#f87171", bg: "rgba(248,113,113,0.14)" },
  archive: { label: "Archive", color: "#94a3b8", bg: "rgba(148,163,184,0.14)" },
};

const AVAIL_CFG: Record<IndepAvail, { label: string; color: string; dot: string }> = {
  disponible: { label: "Disponible", color: "#34d399", dot: "#34d399" },
  en_mission: { label: "En mission", color: "#60a5fa", dot: "#60a5fa" },
  indisponible: { label: "Indisponible", color: "#94a3b8", dot: "#94a3b8" },
  derniere_minute: { label: "Derniere minute", color: GOLD, dot: GOLD },
};

const COTIS_CFG: Record<CotisStatus, { label: string; color: string }> = {
  a_jour: { label: "A jour", color: "#34d399" },
  en_retard: { label: "En retard", color: "#f87171" },
  suspendue: { label: "Suspendue", color: "#94a3b8" },
};

function formatEur(n: number): string {
  return n.toLocaleString("fr-FR") + " euros";
}

function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function IndependantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IndepStatus | "all">("all");
  const [availFilter, setAvailFilter] = useState<IndepAvail | "all">("all");
  const [specFilter, setSpecFilter] = useState<SpecKey | "all">("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Independant | null>(null);

  const filtered = useMemo(() => {
    return INDEPS.filter((i) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = (i.firstName + " " + i.lastName + " " + i.zone + " " + i.country).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (availFilter !== "all" && i.availability !== availFilter) return false;
      if (specFilter !== "all" && i.specialty !== specFilter) return false;
      return true;
    });
  }, [search, statusFilter, availFilter, specFilter]);

  const stats = useMemo(() => {
    const actifs = INDEPS.filter((i) => i.status === "actif").length;
    const enAttente = INDEPS.filter((i) => i.status === "en_attente").length;
    const enMission = INDEPS.filter((i) => i.availability === "en_mission").length;
    const disponibles = INDEPS.filter((i) => i.availability === "disponible" || i.availability === "derniere_minute").length;
    const ratings = INDEPS.filter((i) => i.rating > 0);
    const noteAvg = ratings.reduce((s, i) => s + i.rating, 0) / (ratings.length || 1);
    const cotisOk = INDEPS.filter((i) => i.cotisation === "a_jour").length;
    const cotisKo = INDEPS.filter((i) => i.cotisation !== "a_jour").length;
    const totalRevenue = INDEPS.reduce((s, i) => s + i.revenueYear, 0);
    const totalTrips = INDEPS.reduce((s, i) => s + i.tripsCompleted, 0);
    return {
      total: INDEPS.length,
      actifs,
      enAttente,
      enMission,
      disponibles,
      noteAvg,
      cotisOk,
      cotisKo,
      totalRevenue,
      totalTrips,
    };
  }, []);

  const topPerformers = useMemo(() => {
    return [...INDEPS].filter((i) => i.status === "actif").sort((a, b) => b.revenueYear - a.revenueYear).slice(0, 5);
  }, []);

  const derniers = useMemo(() => {
    return [...INDEPS].sort((a, b) => b.joinDate.localeCompare(a.joinDate)).slice(0, 4);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh" }} className="text-white">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px 500px at 10% 0%, rgba(212,168,83,0.08), transparent 60%), radial-gradient(600px 400px at 90% 100%, rgba(212,168,83,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        <Header
          total={stats.total}
          enAttente={stats.enAttente}
          view={view}
          setView={setView}
        />

        <KpiGrid stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 mt-8">
          <div>
            <FilterBar
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              availFilter={availFilter}
              setAvailFilter={setAvailFilter}
              specFilter={specFilter}
              setSpecFilter={setSpecFilter}
              count={filtered.length}
            />

            {view === "grid" ? (
              <IndepGrid list={filtered} onSelect={setSelected} />
            ) : (
              <IndepList list={filtered} onSelect={setSelected} />
            )}
          </div>

          <aside className="space-y-5">
            <TopPerformers list={topPerformers} onSelect={setSelected} />
            <DerniersInscrits list={derniers} onSelect={setSelected} />
            <AlertsPanel />
          </aside>
        </div>

        <AnimatePresence>
          {selected && <DetailDrawer indep={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({
  total,
  enAttente,
  view,
  setView,
}: {
  total: number;
  enAttente: number;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}) {
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
            style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_RING}` }}
          >
            <Users size={22} style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Independants</h1>
            <p className="text-sm text-white/60 mt-0.5">
              {total} partenaires referenes, {enAttente} candidatures en attente
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center rounded-xl p-1"
          style={GLASS}
        >
          <button
            onClick={() => setView("grid")}
            className="px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            style={view === "grid" ? { background: GOLD_SOFT, color: GOLD } : { color: "rgba(255,255,255,0.6)" }}
          >
            <LayoutGrid size={15} /> Grille
          </button>
          <button
            onClick={() => setView("list")}
            className="px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            style={view === "list" ? { background: GOLD_SOFT, color: GOLD } : { color: "rgba(255,255,255,0.6)" }}
          >
            <List size={15} /> Liste
          </button>
        </div>

        <button
          className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition hover:brightness-110"
          style={GLASS}
        >
          <Download size={15} /> Export
        </button>

        <button
          className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8893f 100%)`,
            color: BG,
            boxShadow: "0 8px 24px rgba(212,168,83,0.32)",
          }}
        >
          <Plus size={16} /> Inviter un partenaire
        </button>
      </div>
    </motion.header>
  );
}

function KpiGrid({ stats }: { stats: ReturnType<typeof getStatsType> }) {
  const kpis = [
    {
      label: "Partenaires actifs",
      value: stats.actifs,
      sub: stats.total + " au total",
      delta: 12,
      icon: UserCheck,
      accent: "#34d399",
    },
    {
      label: "En mission",
      value: stats.enMission,
      sub: stats.disponibles + " disponibles",
      delta: 4,
      icon: Plane,
      accent: "#60a5fa",
    },
    {
      label: "Candidatures",
      value: stats.enAttente,
      sub: "A valider",
      delta: 2,
      icon: Clock,
      accent: "#fbbf24",
    },
    {
      label: "Note moyenne",
      value: stats.noteAvg.toFixed(2),
      sub: "sur 5 etoiles",
      delta: 0.2,
      icon: Star,
      accent: GOLD,
    },
    {
      label: "Cotisations a jour",
      value: stats.cotisOk,
      sub: stats.cotisKo + " a relancer",
      delta: -1,
      icon: Shield,
      accent: "#a78bfa",
    },
    {
      label: "CA partenaires annee",
      value: (stats.totalRevenue / 1000).toFixed(0) + "k",
      sub: stats.totalTrips + " voyages livres",
      delta: 18,
      icon: Euro,
      accent: "#f472b6",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((k, idx) => {
        const Ic = k.icon;
        return (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="rounded-2xl p-4 transition hover:scale-[1.02]"
            style={GLASS}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${k.accent}22`, border: `1px solid ${k.accent}44` }}
              >
                <Ic size={16} style={{ color: k.accent }} />
              </div>
              <div
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: k.delta >= 0 ? "#34d399" : "#f87171" }}
              >
                {k.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {k.delta >= 0 ? "+" : ""}
                {k.delta}
                {typeof k.delta === "number" && Math.abs(k.delta) < 1 ? "" : "%"}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{k.value}</div>
            <div className="text-xs text-white/50">{k.label}</div>
            <div className="text-[11px] text-white/35 mt-1">{k.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function getStatsType() {
  return {
    total: 0,
    actifs: 0,
    enAttente: 0,
    enMission: 0,
    disponibles: 0,
    noteAvg: 0,
    cotisOk: 0,
    cotisKo: 0,
    totalRevenue: 0,
    totalTrips: 0,
  };
}

function FilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  availFilter,
  setAvailFilter,
  specFilter,
  setSpecFilter,
  count,
}: {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: IndepStatus | "all";
  setStatusFilter: (s: IndepStatus | "all") => void;
  availFilter: IndepAvail | "all";
  setAvailFilter: (s: IndepAvail | "all") => void;
  specFilter: SpecKey | "all";
  setSpecFilter: (s: SpecKey | "all") => void;
  count: number;
}) {
  return (
    <div className="rounded-2xl p-4 mb-5" style={GLASS}>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[240px]"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search size={15} className="text-white/40" />
          <input
            type="text"
            placeholder="Rechercher nom, zone, pays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-white/35"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as IndepStatus | "all")}
          options={[
            { value: "all", label: "Tous statuts" },
            { value: "actif", label: "Actif" },
            { value: "en_attente", label: "En attente" },
            { value: "suspendu", label: "Suspendu" },
            { value: "archive", label: "Archive" },
          ]}
        />
        <Select
          value={availFilter}
          onChange={(v) => setAvailFilter(v as IndepAvail | "all")}
          options={[
            { value: "all", label: "Dispo : toutes" },
            { value: "disponible", label: "Disponible" },
            { value: "en_mission", label: "En mission" },
            { value: "derniere_minute", label: "Derniere minute" },
            { value: "indisponible", label: "Indisponible" },
          ]}
        />
        <Select
          value={specFilter}
          onChange={(v) => setSpecFilter(v as SpecKey | "all")}
          options={[
            { value: "all", label: "Toutes specialites" },
            ...Object.entries(SPEC_CFG).map(([k, cfg]) => ({ value: k, label: cfg.label })),
          ]}
        />

        <div className="text-xs text-white/50 ml-auto flex items-center gap-2">
          <Filter size={13} />
          {count} resultat{count > 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
      style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", color: "white" }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: BG, color: "white" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function IndepGrid({ list, onSelect }: { list: Independant[]; onSelect: (i: Independant) => void }) {
  if (list.length === 0) return <EmptyState />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      {list.map((i, idx) => (
        <IndepCard key={i.id} indep={i} idx={idx} onSelect={onSelect} />
      ))}
    </div>
  );
}

function IndepCard({ indep, idx, onSelect }: { indep: Independant; idx: number; onSelect: (i: Independant) => void }) {
  const spec = SPEC_CFG[indep.specialty];
  const status = STATUS_CFG[indep.status];
  const avail = AVAIL_CFG[indep.availability];
  const SpecIc = spec.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.03 }}
      whileHover={{ y: -3 }}
      onClick={() => onSelect(indep)}
      className="rounded-2xl p-5 cursor-pointer transition"
      style={GLASS}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{
              background: `linear-gradient(135deg, ${spec.color}33, ${spec.color}11)`,
              border: `1px solid ${spec.color}44`,
              color: spec.color,
            }}
          >
            {indep.avatar}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
            style={{ background: avail.dot, borderColor: BG }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold truncate">
                  {indep.firstName} {indep.lastName}
                </h3>
                {indep.verified && <BadgeCheck size={14} style={{ color: GOLD }} />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 mt-0.5">
                <MapPin size={11} />
                <span className="truncate">
                  {indep.zone}, {indep.country}
                </span>
              </div>
            </div>
            <span
              className="text-[10px] px-2 py-1 rounded-md font-semibold uppercase tracking-wide"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium"
              style={{ background: `${spec.color}22`, color: spec.color }}
            >
              <SpecIc size={11} />
              {spec.label}
            </span>
            <span
              className="text-xs px-2 py-1 rounded-md font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: avail.color }}
            >
              {avail.label}
            </span>
          </div>
        </div>
      </div>

      {indep.rating > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
          <Stat
            icon={Star}
            label="Note"
            value={indep.rating.toFixed(1)}
            color={GOLD}
            sub={indep.reviewsCount + " avis"}
          />
          <Stat
            icon={Plane}
            label="Voyages"
            value={String(indep.tripsCompleted)}
            color="#60a5fa"
            sub="livres"
          />
          <Stat
            icon={Euro}
            label="CA annee"
            value={(indep.revenueYear / 1000).toFixed(0) + "k"}
            color="#34d399"
            sub={formatEur(indep.revenueYear)}
          />
        </div>
      )}

      {indep.nextTrip && (
        <div
          className="mt-4 px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs"
          style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.18)" }}
        >
          <Calendar size={13} className="text-blue-300" />
          <span className="text-white/70">Prochain :</span>
          <span className="font-semibold">{indep.nextTrip.name}</span>
          <span className="text-white/50 ml-auto">{formatDate(indep.nextTrip.date)}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <BadgeIcon on={indep.verified} icon={BadgeCheck} label="Verifie" color={GOLD} />
        <BadgeIcon on={indep.trained} icon={Award} label="Forme" color="#a78bfa" />
        <BadgeIcon on={indep.firstAid} icon={Heart} label="Premiers secours" color="#f472b6" />
        <BadgeIcon on={indep.lastMinute} icon={Zap} label="Derniere minute" color={GOLD} />
        <div className="ml-auto text-[11px] text-white/40">{indep.languages.join(" · ")}</div>
      </div>
    </motion.div>
  );
}

function BadgeIcon({
  on,
  icon: Ic,
  label,
  color,
}: {
  on: boolean;
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div
      title={label}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition"
      style={{
        background: on ? `${color}22` : "rgba(255,255,255,0.03)",
        border: `1px solid ${on ? color + "44" : "rgba(255,255,255,0.06)"}`,
        opacity: on ? 1 : 0.35,
      }}
    >
      <Ic size={13} style={{ color: on ? color : "rgba(255,255,255,0.4)" }} />
    </div>
  );
}

function Stat({
  icon: Ic,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[11px] text-white/40 mb-0.5">
        <Ic size={10} style={{ color }} />
        {label}
      </div>
      <div className="font-bold text-sm">{value}</div>
      {sub && <div className="text-[10px] text-white/35 mt-0.5 truncate">{sub}</div>}
    </div>
  );
}

function IndepList({ list, onSelect }: { list: Independant[]; onSelect: (i: Independant) => void }) {
  if (list.length === 0) return <EmptyState />;
  return (
    <div className="rounded-2xl overflow-hidden" style={GLASS}>
      <div
        className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-[11px] uppercase tracking-wider font-semibold text-white/45"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div>Partenaire</div>
        <div>Zone</div>
        <div>Specialite</div>
        <div>Note</div>
        <div>CA annee</div>
        <div>Statut</div>
      </div>
      {list.map((i, idx) => {
        const spec = SPEC_CFG[i.specialty];
        const status = STATUS_CFG[i.status];
        const avail = AVAIL_CFG[i.availability];
        return (
          <motion.div
            key={i.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.02 }}
            onClick={() => onSelect(i)}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center cursor-pointer border-t border-white/5 transition hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `${spec.color}22`,
                    border: `1px solid ${spec.color}44`,
                    color: spec.color,
                  }}
                >
                  {i.avatar}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: avail.dot, borderColor: BG }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium truncate">
                    {i.firstName} {i.lastName}
                  </span>
                  {i.verified && <BadgeCheck size={12} style={{ color: GOLD }} />}
                </div>
                <div className="text-[11px] text-white/45 truncate">{i.email}</div>
              </div>
            </div>
            <div className="text-sm text-white/70 truncate">
              {i.zone}, {i.country}
            </div>
            <div>
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: `${spec.color}22`, color: spec.color }}
              >
                {spec.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Star size={12} style={{ color: GOLD, fill: GOLD }} />
              {i.rating > 0 ? i.rating.toFixed(1) : "-"}
              <span className="text-[11px] text-white/40">({i.reviewsCount})</span>
            </div>
            <div className="text-sm font-semibold">{(i.revenueYear / 1000).toFixed(1)}k</div>
            <span
              className="text-[10px] px-2 py-1 rounded-md font-semibold uppercase tracking-wide"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl p-12 text-center flex flex-col items-center gap-3"
      style={GLASS}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_RING}` }}
      >
        <Users size={24} style={{ color: GOLD }} />
      </div>
      <div className="text-lg font-semibold">Aucun partenaire trouve</div>
      <div className="text-sm text-white/50">Affine ta recherche ou reinitialise les filtres.</div>
    </div>
  );
}

function TopPerformers({ list, onSelect }: { list: Independant[]; onSelect: (i: Independant) => void }) {
  return (
    <div className="rounded-2xl p-5" style={GLASS_STRONG}>
      <div className="flex items-center gap-2 mb-4">
        <Crown size={16} style={{ color: GOLD }} />
        <h3 className="font-semibold">Top performers</h3>
        <span className="text-[11px] text-white/40 ml-auto">Par CA annee</span>
      </div>
      <div className="space-y-2">
        {list.map((i, idx) => {
          const spec = SPEC_CFG[i.specialty];
          return (
            <div
              key={i.id}
              onClick={() => onSelect(i)}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-white/5"
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold"
                style={{
                  background: idx === 0 ? GOLD_SOFT : "rgba(255,255,255,0.05)",
                  color: idx === 0 ? GOLD : "rgba(255,255,255,0.6)",
                }}
              >
                {idx + 1}
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: `${spec.color}22`, color: spec.color }}
              >
                {i.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {i.firstName} {i.lastName}
                </div>
                <div className="text-[11px] text-white/50 truncate">
                  {i.tripsCompleted} voyages · {i.rating.toFixed(1)}
                  <Star size={8} className="inline ml-1" style={{ color: GOLD, fill: GOLD }} />
                </div>
              </div>
              <div className="text-sm font-bold" style={{ color: GOLD }}>
                {(i.revenueYear / 1000).toFixed(0)}k
              </div>
            </div>
          );
        })}
      </div>
      <Link
        href="/admin/independants/performance"
        className="mt-3 flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition hover:bg-white/5"
        style={{ color: GOLD }}
      >
        Voir le classement complet <ChevronRight size={12} />
      </Link>
    </div>
  );
}

function DerniersInscrits({ list, onSelect }: { list: Independant[]; onSelect: (i: Independant) => void }) {
  return (
    <div className="rounded-2xl p-5" style={GLASS}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-purple-300" />
        <h3 className="font-semibold">Nouveaux partenaires</h3>
      </div>
      <div className="space-y-3">
        {list.map((i) => {
          const spec = SPEC_CFG[i.specialty];
          return (
            <div
              key={i.id}
              onClick={() => onSelect(i)}
              className="flex items-center gap-3 cursor-pointer transition hover:bg-white/5 p-2 rounded-lg -mx-2"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: `${spec.color}22`, color: spec.color }}
              >
                {i.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {i.firstName} {i.lastName}
                </div>
                <div className="text-[11px] text-white/45">{formatDate(i.joinDate)}</div>
              </div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                style={{ background: STATUS_CFG[i.status].bg, color: STATUS_CFG[i.status].color }}
              >
                {STATUS_CFG[i.status].label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlertsPanel() {
  const alerts = [
    {
      icon: AlertTriangle,
      color: "#fbbf24",
      title: "1 candidature en attente de validation",
      sub: "Leila Hassan · Casablanca",
      action: "Examiner",
    },
    {
      icon: UserX,
      color: "#f87171",
      title: "1 partenaire suspendu",
      sub: "Dimitri Volkov · Reexamen prevu en mai",
      action: "Voir",
    },
    {
      icon: Shield,
      color: "#a78bfa",
      title: "Cotisations en retard",
      sub: "1 partenaire a relancer",
      action: "Relancer",
    },
  ];
  return (
    <div className="rounded-2xl p-5" style={GLASS}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-amber-300" />
        <h3 className="font-semibold">Alertes</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((a, idx) => {
          const Ic = a.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${a.color}22`, border: `1px solid ${a.color}44` }}
              >
                <Ic size={14} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{a.sub}</div>
                <button
                  className="mt-2 text-[11px] font-semibold flex items-center gap-1 transition hover:brightness-125"
                  style={{ color: a.color }}
                >
                  {a.action} <ArrowUpRight size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailDrawer({ indep, onClose }: { indep: Independant; onClose: () => void }) {
  const spec = SPEC_CFG[indep.specialty];
  const status = STATUS_CFG[indep.status];
  const avail = AVAIL_CFG[indep.availability];
  const cotis = COTIS_CFG[indep.cotisation];
  const SpecIc = spec.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-[560px] z-50 overflow-y-auto"
        style={{ background: BG, borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(10,14,20,0.85)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Users size={15} />
            Fiche partenaire
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${spec.color}33, ${spec.color}11)`,
                  border: `1px solid ${spec.color}44`,
                  color: spec.color,
                }}
              >
                {indep.avatar}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
                style={{ background: avail.dot, borderColor: BG }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold truncate">
                  {indep.firstName} {indep.lastName}
                </h2>
                {indep.verified && <BadgeCheck size={18} style={{ color: GOLD }} />}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                <MapPin size={12} />
                {indep.zone}, {indep.country}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className="text-xs px-2 py-1 rounded-md font-semibold"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium"
                  style={{ background: `${spec.color}22`, color: spec.color }}
                >
                  <SpecIc size={11} />
                  {spec.label}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-md font-medium"
                  style={{ background: "rgba(255,255,255,0.05)", color: avail.color }}
                >
                  {avail.label}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/70 leading-relaxed">{indep.bio}</div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(212,168,83,0.08)", border: `1px solid ${GOLD_RING}` }}>
              <Star size={14} style={{ color: GOLD, margin: "0 auto 6px" }} />
              <div className="text-lg font-bold" style={{ color: GOLD }}>
                {indep.rating > 0 ? indep.rating.toFixed(1) : "-"}
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">{indep.reviewsCount} avis</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={GLASS}>
              <Plane size={14} className="text-blue-300" style={{ margin: "0 auto 6px" }} />
              <div className="text-lg font-bold text-blue-300">{indep.tripsCompleted}</div>
              <div className="text-[10px] text-white/50 mt-0.5">Voyages livres</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={GLASS}>
              <Euro size={14} className="text-green-300" style={{ margin: "0 auto 6px" }} />
              <div className="text-lg font-bold text-green-300">{(indep.revenueYear / 1000).toFixed(0)}k</div>
              <div className="text-[10px] text-white/50 mt-0.5">CA annee</div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Coordonnees</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-white/40" />
                <span>{indep.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-white/40" />
                <span>{indep.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-white/40" />
                <span>Inscrit le {formatDate(indep.joinDate)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Certifications</div>
            <div className="grid grid-cols-2 gap-3">
              <CertLine on={indep.verified} icon={BadgeCheck} label="Identite verifiee" color={GOLD} />
              <CertLine on={indep.trained} icon={Award} label="Formation Eventy" color="#a78bfa" />
              <CertLine on={indep.firstAid} icon={Heart} label="Premiers secours" color="#f472b6" />
              <CertLine on={indep.lastMinute} icon={Zap} label="Derniere minute" color={GOLD} />
            </div>
          </div>

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Cotisation</div>
              <span className="text-xs font-semibold" style={{ color: cotis.color }}>
                {cotis.label}
              </span>
            </div>
            <div className="text-xs text-white/50">Langues parlees : {indep.languages.join(", ")}</div>
          </div>

          {indep.nextTrip && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.22)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-blue-300" />
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Prochaine mission</div>
              </div>
              <div className="font-semibold">{indep.nextTrip.name}</div>
              <div className="text-xs text-white/60 mt-1">{formatDate(indep.nextTrip.date)}</div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #b8893f 100%)`, color: BG }}
            >
              <MessageCircle size={15} /> Contacter
            </button>
            <button className="py-3 px-4 rounded-xl text-sm font-medium transition hover:bg-white/5" style={GLASS}>
              <Eye size={15} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function CertLine({
  on,
  icon: Ic,
  label,
  color,
}: {
  on: boolean;
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{
          background: on ? `${color}22` : "rgba(255,255,255,0.03)",
          border: `1px solid ${on ? color + "44" : "rgba(255,255,255,0.06)"}`,
        }}
      >
        {on ? <CheckCircle2 size={13} style={{ color }} /> : <Ic size={13} className="text-white/30" />}
      </div>
      <span className={on ? "text-white" : "text-white/40"}>{label}</span>
    </div>
  );
}
