"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel,
  UtensilsCrossed,
  Mountain,
  Search,
  Filter,
  Plus,
  Download,
  Star,
  MapPin,
  Euro,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Users,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  X,
  BadgeCheck,
  Eye,
  Wifi,
  Waves,
  Coffee,
  Wine,
  Camera,
  Compass,
  Ship,
  Flame,
  Leaf,
  Heart,
  Building2,
  FileSignature,
  CalendarDays,
  Handshake,
  RefreshCw,
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

type Category = "hebergement" | "restaurant" | "activite";
type ContractStatus = "prospection" | "negociation" | "signe" | "actif" | "a_renouveler" | "expire";
type AvailStatus = "ouvert" | "complet" | "saison" | "ferme";

interface Provider {
  id: string;
  name: string;
  category: Category;
  subtype: string;
  photo: string;
  zone: string;
  country: string;
  contact: { name: string; email: string; phone: string };
  rating: number;
  reviewsCount: number;
  capacity: number;
  tarif: { value: number; unit: string };
  commission: number;
  contract: ContractStatus;
  contractStart: string;
  contractEnd: string;
  availability: AvailStatus;
  bookings90d: number;
  revenue90d: number;
  amenities: string[];
  verified: boolean;
  premium: boolean;
  description: string;
}

const PROVIDERS: Provider[] = [
  {
    id: "h01",
    name: "Riad Dar El Ma",
    category: "hebergement",
    subtype: "Riad 5 etoiles",
    photo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    zone: "Marrakech",
    country: "Maroc",
    contact: { name: "Hassan El Amrani", email: "hassan@darelma.ma", phone: "+212 524 38 90 12" },
    rating: 4.9,
    reviewsCount: 342,
    capacity: 28,
    tarif: { value: 180, unit: "nuit" },
    commission: 15,
    contract: "actif",
    contractStart: "2025-03-10",
    contractEnd: "2027-03-09",
    availability: "ouvert",
    bookings90d: 186,
    revenue90d: 33480,
    amenities: ["wifi", "piscine", "petit-dej", "spa"],
    verified: true,
    premium: true,
    description: "Riad authentique au coeur de la medina, piscine interieure chauffee et hammam prive.",
  },
  {
    id: "h02",
    name: "Villa Santorini Caldera",
    category: "hebergement",
    subtype: "Villa vue mer",
    photo: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80",
    zone: "Oia",
    country: "Grece",
    contact: { name: "Elena Kostas", email: "elena@caldera-villas.gr", phone: "+30 22860 71234" },
    rating: 5.0,
    reviewsCount: 189,
    capacity: 12,
    tarif: { value: 420, unit: "nuit" },
    commission: 18,
    contract: "actif",
    contractStart: "2025-05-01",
    contractEnd: "2026-11-30",
    availability: "saison",
    bookings90d: 84,
    revenue90d: 35280,
    amenities: ["wifi", "piscine", "vue-mer", "chef"],
    verified: true,
    premium: true,
    description: "Villa troglodyte avec piscine infinity face au coucher de soleil legendaire.",
  },
  {
    id: "h03",
    name: "Ryokan Yume no Yado",
    category: "hebergement",
    subtype: "Ryokan traditionnel",
    photo: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=800&q=80",
    zone: "Kyoto",
    country: "Japon",
    contact: { name: "Hiroshi Tanaka", email: "hiroshi@yume-yado.jp", phone: "+81 75 771 1234" },
    rating: 4.8,
    reviewsCount: 156,
    capacity: 18,
    tarif: { value: 260, unit: "nuit" },
    commission: 12,
    contract: "actif",
    contractStart: "2025-09-15",
    contractEnd: "2027-09-14",
    availability: "ouvert",
    bookings90d: 94,
    revenue90d: 24440,
    amenities: ["onsen", "kaiseki", "jardin", "tea-ceremony"],
    verified: true,
    premium: false,
    description: "Ryokan familial avec onsen prive, ceremonies du the et kaiseki traditionnel.",
  },
  {
    id: "h04",
    name: "Glamping Lofoten Arctic",
    category: "hebergement",
    subtype: "Glamping bulle",
    photo: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=800&q=80",
    zone: "Lofoten",
    country: "Norvege",
    contact: { name: "Astrid Johansson", email: "astrid@lofoten-arctic.no", phone: "+47 78 12 34 56" },
    rating: 4.9,
    reviewsCount: 78,
    capacity: 16,
    tarif: { value: 340, unit: "nuit" },
    commission: 20,
    contract: "a_renouveler",
    contractStart: "2024-06-01",
    contractEnd: "2026-05-31",
    availability: "ouvert",
    bookings90d: 62,
    revenue90d: 21080,
    amenities: ["aurores", "sauna", "vue-mer", "petit-dej"],
    verified: true,
    premium: true,
    description: "Bulles transparentes chauffees pour observation des aurores boreales.",
  },
  {
    id: "r01",
    name: "Cafe Nomad",
    category: "restaurant",
    subtype: "Cuisine berbere",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    zone: "Marrakech",
    country: "Maroc",
    contact: { name: "Youssef Bennani", email: "youssef@cafenomad.ma", phone: "+212 524 38 11 22" },
    rating: 4.7,
    reviewsCount: 521,
    capacity: 60,
    tarif: { value: 35, unit: "pers" },
    commission: 10,
    contract: "actif",
    contractStart: "2025-04-20",
    contractEnd: "2027-04-19",
    availability: "ouvert",
    bookings90d: 412,
    revenue90d: 14420,
    amenities: ["terrasse", "vegetarien", "groupe", "halal"],
    verified: true,
    premium: false,
    description: "Cuisine berbere contemporaine, terrasse panoramique sur la medina.",
  },
  {
    id: "r02",
    name: "Tapas Bar El Sol",
    category: "restaurant",
    subtype: "Tapas catalanes",
    photo: "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=800&q=80",
    zone: "Barcelone",
    country: "Espagne",
    contact: { name: "Montserrat Vidal", email: "mvidal@elsol.es", phone: "+34 93 412 34 56" },
    rating: 4.8,
    reviewsCount: 784,
    capacity: 45,
    tarif: { value: 42, unit: "pers" },
    commission: 12,
    contract: "actif",
    contractStart: "2025-01-15",
    contractEnd: "2027-01-14",
    availability: "ouvert",
    bookings90d: 562,
    revenue90d: 23604,
    amenities: ["bar-vin", "terrasse", "groupe", "sans-gluten"],
    verified: true,
    premium: true,
    description: "Institution catalane, 18 tapas signature et carte de vins bio 120 references.",
  },
  {
    id: "r03",
    name: "Sushi Hanabi",
    category: "restaurant",
    subtype: "Sushi omakase",
    photo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    zone: "Kyoto",
    country: "Japon",
    contact: { name: "Kenji Watanabe", email: "kenji@hanabi.jp", phone: "+81 75 212 3456" },
    rating: 4.9,
    reviewsCount: 234,
    capacity: 22,
    tarif: { value: 120, unit: "pers" },
    commission: 15,
    contract: "negociation",
    contractStart: "",
    contractEnd: "",
    availability: "complet",
    bookings90d: 0,
    revenue90d: 0,
    amenities: ["chef-etoile", "comptoir", "sake", "omakase"],
    verified: true,
    premium: true,
    description: "Omakase 12 services, chef Watanabe forme au Kikunoi 3 etoiles Michelin.",
  },
  {
    id: "r04",
    name: "Warung Ibu Made",
    category: "restaurant",
    subtype: "Cuisine balinaise",
    photo: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80",
    zone: "Ubud",
    country: "Indonesie",
    contact: { name: "Made Ayu", email: "madeayu@warung-ubud.id", phone: "+62 361 975 432" },
    rating: 4.6,
    reviewsCount: 412,
    capacity: 35,
    tarif: { value: 18, unit: "pers" },
    commission: 8,
    contract: "actif",
    contractStart: "2025-07-01",
    contractEnd: "2026-06-30",
    availability: "ouvert",
    bookings90d: 289,
    revenue90d: 5202,
    amenities: ["vegan", "rizieres", "cours-cuisine", "groupe"],
    verified: true,
    premium: false,
    description: "Warung familial au milieu des rizieres, cours de cuisine et balinese dance.",
  },
  {
    id: "a01",
    name: "Excursion Dunes de Merzouga",
    category: "activite",
    subtype: "Desert 4x4",
    photo: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    zone: "Merzouga",
    country: "Maroc",
    contact: { name: "Omar Ait Said", email: "omar@merzouga-tours.ma", phone: "+212 661 23 45 67" },
    rating: 4.9,
    reviewsCount: 612,
    capacity: 48,
    tarif: { value: 85, unit: "pers" },
    commission: 18,
    contract: "actif",
    contractStart: "2025-02-10",
    contractEnd: "2027-02-09",
    availability: "ouvert",
    bookings90d: 348,
    revenue90d: 29580,
    amenities: ["4x4", "bivouac", "chameau", "coucher-soleil"],
    verified: true,
    premium: true,
    description: "Virees 4x4 dans lerg Chebbi, bivouac luxe avec musique gnaoua et diner berbere.",
  },
  {
    id: "a02",
    name: "Croisiere Caldera Sunset",
    category: "activite",
    subtype: "Croisiere privee",
    photo: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    zone: "Santorin",
    country: "Grece",
    contact: { name: "Nikos Papas", email: "nikos@caldera-sail.gr", phone: "+30 6945 123 456" },
    rating: 4.8,
    reviewsCount: 298,
    capacity: 16,
    tarif: { value: 140, unit: "pers" },
    commission: 20,
    contract: "actif",
    contractStart: "2025-04-15",
    contractEnd: "2026-10-14",
    availability: "saison",
    bookings90d: 186,
    revenue90d: 26040,
    amenities: ["bateau", "bbq", "snorkeling", "open-bar"],
    verified: true,
    premium: true,
    description: "Catamaran 50 pieds privatise, arret sources chaudes et plage rouge.",
  },
  {
    id: "a03",
    name: "Ceremonie du the Urasenke",
    category: "activite",
    subtype: "Culturelle",
    photo: "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800&q=80",
    zone: "Kyoto",
    country: "Japon",
    contact: { name: "Madame Sato", email: "sato@urasenke-kyoto.jp", phone: "+81 75 231 4567" },
    rating: 5.0,
    reviewsCount: 142,
    capacity: 8,
    tarif: { value: 65, unit: "pers" },
    commission: 15,
    contract: "actif",
    contractStart: "2025-09-01",
    contractEnd: "2027-08-31",
    availability: "ouvert",
    bookings90d: 126,
    revenue90d: 8190,
    amenities: ["kimono", "jardin-zen", "wagashi", "matcha"],
    verified: true,
    premium: false,
    description: "Ceremonie traditionnelle dans maison de maitre, kimono fourni et wagashi artisanaux.",
  },
  {
    id: "a04",
    name: "Chasse aux aurores boreales",
    category: "activite",
    subtype: "Expedition nuit",
    photo: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    zone: "Reykjavik",
    country: "Islande",
    contact: { name: "Bjorn Eriksson", email: "bjorn@islande-aurores.is", phone: "+354 691 2345" },
    rating: 4.9,
    reviewsCount: 87,
    capacity: 32,
    tarif: { value: 95, unit: "pers" },
    commission: 22,
    contract: "signe",
    contractStart: "2026-01-01",
    contractEnd: "2027-12-31",
    availability: "saison",
    bookings90d: 54,
    revenue90d: 5130,
    amenities: ["super-jeep", "photo", "chocolat-chaud", "aurora-app"],
    verified: true,
    premium: true,
    description: "Super jeep 4x4 loin de la pollution lumineuse, photographe et combis thermiques.",
  },
  {
    id: "a05",
    name: "Atelier sushi Tokyo",
    category: "activite",
    subtype: "Cours de cuisine",
    photo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    zone: "Tokyo",
    country: "Japon",
    contact: { name: "Yuki Sato", email: "yuki@tokyo-cooking.jp", phone: "+81 3 3456 7890" },
    rating: 4.7,
    reviewsCount: 203,
    capacity: 12,
    tarif: { value: 88, unit: "pers" },
    commission: 14,
    contract: "expire",
    contractStart: "2024-01-01",
    contractEnd: "2025-12-31",
    availability: "ferme",
    bookings90d: 0,
    revenue90d: 0,
    amenities: ["chef", "tablier", "degustation", "sake"],
    verified: true,
    premium: false,
    description: "Contrat expire, renegociation en cours avec conditions 2026.",
  },
  {
    id: "h05",
    name: "Hotel Costa Brava",
    category: "hebergement",
    subtype: "Hotel 4 etoiles",
    photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    zone: "Costa Brava",
    country: "Espagne",
    contact: { name: "Joan Puig", email: "joan@costabrava-hotel.es", phone: "+34 972 12 34 56" },
    rating: 4.5,
    reviewsCount: 234,
    capacity: 120,
    tarif: { value: 145, unit: "nuit" },
    commission: 14,
    contract: "prospection",
    contractStart: "",
    contractEnd: "",
    availability: "ouvert",
    bookings90d: 0,
    revenue90d: 0,
    amenities: ["piscine", "plage", "spa", "restaurant"],
    verified: false,
    premium: false,
    description: "Premier contact pris en avril, rendez-vous prevu semaine prochaine.",
  },
];

const CATEGORY_CFG: Record<Category, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  hebergement: { label: "Hebergement", color: "#60a5fa", icon: Hotel, bg: "rgba(96,165,250,0.14)" },
  restaurant: { label: "Restaurant", color: "#f472b6", icon: UtensilsCrossed, bg: "rgba(244,114,182,0.14)" },
  activite: { label: "Activite", color: "#34d399", icon: Mountain, bg: "rgba(52,211,153,0.14)" },
};

const CONTRACT_CFG: Record<ContractStatus, { label: string; color: string; bg: string }> = {
  prospection: { label: "Prospection", color: "#94a3b8", bg: "rgba(148,163,184,0.14)" },
  negociation: { label: "Negociation", color: "#fbbf24", bg: "rgba(251,191,36,0.14)" },
  signe: { label: "Signe", color: "#60a5fa", bg: "rgba(96,165,250,0.14)" },
  actif: { label: "Actif", color: "#34d399", bg: "rgba(52,211,153,0.14)" },
  a_renouveler: { label: "A renouveler", color: GOLD, bg: GOLD_SOFT },
  expire: { label: "Expire", color: "#f87171", bg: "rgba(248,113,113,0.14)" },
};

const AVAIL_CFG: Record<AvailStatus, { label: string; color: string; dot: string }> = {
  ouvert: { label: "Ouvert", color: "#34d399", dot: "#34d399" },
  complet: { label: "Complet", color: "#fbbf24", dot: "#fbbf24" },
  saison: { label: "Saisonnier", color: "#60a5fa", dot: "#60a5fa" },
  ferme: { label: "Ferme", color: "#94a3b8", dot: "#94a3b8" },
};

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi,
  piscine: Waves,
  "petit-dej": Coffee,
  spa: Sparkles,
  "vue-mer": Ship,
  chef: UtensilsCrossed,
  onsen: Waves,
  kaiseki: UtensilsCrossed,
  jardin: Leaf,
  "tea-ceremony": Coffee,
  aurores: Sparkles,
  sauna: Flame,
  terrasse: Leaf,
  vegetarien: Leaf,
  groupe: Users,
  halal: CheckCircle2,
  "bar-vin": Wine,
  "sans-gluten": Leaf,
  "chef-etoile": Star,
  comptoir: UtensilsCrossed,
  sake: Wine,
  omakase: UtensilsCrossed,
  vegan: Leaf,
  rizieres: Leaf,
  "cours-cuisine": UtensilsCrossed,
  "4x4": Compass,
  bivouac: Flame,
  chameau: Mountain,
  "coucher-soleil": Sparkles,
  bateau: Ship,
  bbq: Flame,
  snorkeling: Waves,
  "open-bar": Wine,
  kimono: Heart,
  "jardin-zen": Leaf,
  wagashi: Coffee,
  matcha: Coffee,
  "super-jeep": Compass,
  photo: Camera,
  "chocolat-chaud": Coffee,
  "aurora-app": Sparkles,
  tablier: Heart,
  degustation: Wine,
  plage: Waves,
  restaurant: UtensilsCrossed,
};

function formatEur(n: number): string {
  return n.toLocaleString("fr-FR") + " euros";
}

function formatDate(d: string): string {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(d: string): number {
  if (!d) return 0;
  const diff = new Date(d).getTime() - Date.now();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

interface Stats {
  total: number;
  hebergements: number;
  restaurants: number;
  activites: number;
  actifs: number;
  aRenouveler: number;
  enNego: number;
  revenue90d: number;
  bookings90d: number;
  noteAvg: number;
}

export default function HraPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [contractFilter, setContractFilter] = useState<ContractStatus | "all">("all");
  const [availFilter, setAvailFilter] = useState<AvailStatus | "all">("all");
  const [selected, setSelected] = useState<Provider | null>(null);

  const filtered = useMemo(() => {
    return PROVIDERS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = (p.name + " " + p.zone + " " + p.country + " " + p.subtype).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (contractFilter !== "all" && p.contract !== contractFilter) return false;
      if (availFilter !== "all" && p.availability !== availFilter) return false;
      return true;
    });
  }, [category, search, contractFilter, availFilter]);

  const stats: Stats = useMemo(() => {
    const hebergements = PROVIDERS.filter((p) => p.category === "hebergement").length;
    const restaurants = PROVIDERS.filter((p) => p.category === "restaurant").length;
    const activites = PROVIDERS.filter((p) => p.category === "activite").length;
    const actifs = PROVIDERS.filter((p) => p.contract === "actif").length;
    const aRenouveler = PROVIDERS.filter((p) => p.contract === "a_renouveler" || p.contract === "expire").length;
    const enNego = PROVIDERS.filter(
      (p) => p.contract === "negociation" || p.contract === "prospection" || p.contract === "signe"
    ).length;
    const revenue90d = PROVIDERS.reduce((s, p) => s + p.revenue90d, 0);
    const bookings90d = PROVIDERS.reduce((s, p) => s + p.bookings90d, 0);
    const ratings = PROVIDERS.filter((p) => p.rating > 0);
    const noteAvg = ratings.reduce((s, p) => s + p.rating, 0) / (ratings.length || 1);
    return {
      total: PROVIDERS.length,
      hebergements,
      restaurants,
      activites,
      actifs,
      aRenouveler,
      enNego,
      revenue90d,
      bookings90d,
      noteAvg,
    };
  }, []);

  const renewals = useMemo(() => {
    return PROVIDERS.filter(
      (p) =>
        p.contract === "a_renouveler" ||
        p.contract === "expire" ||
        (p.contractEnd && daysUntil(p.contractEnd) < 120 && daysUntil(p.contractEnd) > 0)
    );
  }, []);

  const negociations = useMemo(() => {
    return PROVIDERS.filter(
      (p) => p.contract === "negociation" || p.contract === "signe" || p.contract === "prospection"
    );
  }, []);

  const topRevenue = useMemo(() => {
    return [...PROVIDERS]
      .filter((p) => p.contract === "actif")
      .sort((a, b) => b.revenue90d - a.revenue90d)
      .slice(0, 5);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh" }} className="text-white">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 520px at 15% 0%, rgba(212,168,83,0.08), transparent 60%), radial-gradient(700px 460px at 85% 100%, rgba(96,165,250,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        <Header stats={stats} />
        <KpiGrid stats={stats} />
        <CategoryTabs category={category} setCategory={setCategory} stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 mt-6">
          <div>
            <FilterBar
              search={search}
              setSearch={setSearch}
              contractFilter={contractFilter}
              setContractFilter={setContractFilter}
              availFilter={availFilter}
              setAvailFilter={setAvailFilter}
              count={filtered.length}
            />
            <ProviderGrid list={filtered} onSelect={setSelected} />
          </div>

          <aside className="space-y-5">
            <NegoPanel list={negociations} onSelect={setSelected} />
            <RenewalsPanel list={renewals} onSelect={setSelected} />
            <TopRevenuePanel list={topRevenue} onSelect={setSelected} />
          </aside>
        </div>

        <AnimatePresence>
          {selected && <DetailDrawer provider={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({ stats }: { stats: Stats }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-start justify-between gap-4 mb-8"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_RING}` }}
        >
          <Building2 size={22} style={{ color: GOLD }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel HRA</h1>
          <p className="text-sm text-white/60 mt-0.5">
            Hebergements, Restaurants, Activites · {stats.total} prestataires sous contrat ou en prospection
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/hra/rate-cards"
          className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition hover:brightness-110"
          style={GLASS}
        >
          <FileText size={15} /> Rate cards
        </Link>
        <Link
          href="/admin/hra/negociations"
          className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition hover:brightness-110"
          style={GLASS}
        >
          <Handshake size={15} /> Negociations
        </Link>
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
          <Plus size={16} /> Nouveau prestataire
        </button>
      </div>
    </motion.header>
  );
}

function KpiGrid({ stats }: { stats: Stats }) {
  const kpis = [
    { label: "Prestataires actifs", value: stats.actifs, sub: stats.total + " au total", delta: 14, icon: CheckCircle2, accent: "#34d399" },
    { label: "Hebergements", value: stats.hebergements, sub: "Riads, villas, hotels", delta: 8, icon: Hotel, accent: "#60a5fa" },
    { label: "Restaurants", value: stats.restaurants, sub: "Gastro et bistrots", delta: 12, icon: UtensilsCrossed, accent: "#f472b6" },
    { label: "Activites", value: stats.activites, sub: "Excursions, ateliers", delta: 22, icon: Mountain, accent: "#34d399" },
    { label: "A renouveler", value: stats.aRenouveler, sub: "Contrats en fin de vie", delta: -3, icon: RefreshCw, accent: GOLD },
    { label: "Revenu 90j", value: (stats.revenue90d / 1000).toFixed(0) + "k", sub: stats.bookings90d + " reservations", delta: 28, icon: Euro, accent: "#a78bfa" },
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
                {k.delta}%
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

function CategoryTabs({
  category,
  setCategory,
  stats,
}: {
  category: Category | "all";
  setCategory: (c: Category | "all") => void;
  stats: Stats;
}) {
  const tabs: { key: Category | "all"; label: string; count: number; icon: React.ElementType; color: string }[] = [
    { key: "all", label: "Tous", count: stats.total, icon: Building2, color: GOLD },
    { key: "hebergement", label: "Hebergements", count: stats.hebergements, icon: Hotel, color: "#60a5fa" },
    { key: "restaurant", label: "Restaurants", count: stats.restaurants, icon: UtensilsCrossed, color: "#f472b6" },
    { key: "activite", label: "Activites", count: stats.activites, icon: Mountain, color: "#34d399" },
  ];

  return (
    <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1">
      {tabs.map((t) => {
        const Ic = t.icon;
        const active = category === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setCategory(t.key)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition whitespace-nowrap"
            style={
              active
                ? {
                    background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`,
                    border: `1px solid ${t.color}66`,
                    color: t.color,
                  }
                : { ...GLASS, color: "rgba(255,255,255,0.7)" }
            }
          >
            <Ic size={15} />
            {t.label}
            <span
              className="text-[11px] px-2 py-0.5 rounded-md font-bold"
              style={{
                background: active ? `${t.color}33` : "rgba(255,255,255,0.08)",
                color: active ? t.color : "rgba(255,255,255,0.7)",
              }}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FilterBar({
  search,
  setSearch,
  contractFilter,
  setContractFilter,
  availFilter,
  setAvailFilter,
  count,
}: {
  search: string;
  setSearch: (s: string) => void;
  contractFilter: ContractStatus | "all";
  setContractFilter: (s: ContractStatus | "all") => void;
  availFilter: AvailStatus | "all";
  setAvailFilter: (s: AvailStatus | "all") => void;
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
            placeholder="Rechercher prestataire, zone, pays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-white/35"
          />
        </div>

        <Select
          value={contractFilter}
          onChange={(v) => setContractFilter(v as ContractStatus | "all")}
          options={[
            { value: "all", label: "Contrats : tous" },
            { value: "actif", label: "Actif" },
            { value: "signe", label: "Signe" },
            { value: "negociation", label: "Negociation" },
            { value: "prospection", label: "Prospection" },
            { value: "a_renouveler", label: "A renouveler" },
            { value: "expire", label: "Expire" },
          ]}
        />
        <Select
          value={availFilter}
          onChange={(v) => setAvailFilter(v as AvailStatus | "all")}
          options={[
            { value: "all", label: "Dispo : toutes" },
            { value: "ouvert", label: "Ouvert" },
            { value: "complet", label: "Complet" },
            { value: "saison", label: "Saisonnier" },
            { value: "ferme", label: "Ferme" },
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

function ProviderGrid({ list, onSelect }: { list: Provider[]; onSelect: (p: Provider) => void }) {
  if (list.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center flex flex-col items-center gap-3" style={GLASS}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_RING}` }}
        >
          <Building2 size={24} style={{ color: GOLD }} />
        </div>
        <div className="text-lg font-semibold">Aucun prestataire trouve</div>
        <div className="text-sm text-white/50">Modifie les filtres ou ajoute un nouveau prestataire.</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {list.map((p, idx) => (
        <ProviderCard key={p.id} provider={p} idx={idx} onSelect={onSelect} />
      ))}
    </div>
  );
}

function ProviderCard({
  provider,
  idx,
  onSelect,
}: {
  provider: Provider;
  idx: number;
  onSelect: (p: Provider) => void;
}) {
  const cat = CATEGORY_CFG[provider.category];
  const contract = CONTRACT_CFG[provider.contract];
  const avail = AVAIL_CFG[provider.availability];
  const CatIc = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.03 }}
      whileHover={{ y: -3 }}
      onClick={() => onSelect(provider)}
      className="rounded-2xl overflow-hidden cursor-pointer transition"
      style={GLASS}
    >
      <div className="relative h-44">
        <Image
          src={provider.photo}
          alt={provider.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,14,20,0.9) 100%)" }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-semibold backdrop-blur-md"
            style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}44` }}
          >
            <CatIc size={11} />
            {cat.label}
          </span>
          {provider.premium && (
            <span
              className="text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 font-bold uppercase tracking-wider backdrop-blur-md"
              style={{ background: GOLD_SOFT, color: GOLD, border: `1px solid ${GOLD_RING}` }}
            >
              <Sparkles size={10} />
              Premium
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className="text-[10px] px-2 py-1 rounded-lg font-semibold uppercase tracking-wider backdrop-blur-md"
            style={{ background: contract.bg, color: contract.color, border: `1px solid ${contract.color}44` }}
          >
            {contract.label}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg truncate">{provider.name}</h3>
                {provider.verified && <BadgeCheck size={15} style={{ color: GOLD }} />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/70 mt-0.5">
                <MapPin size={11} />
                {provider.zone}, {provider.country}
              </div>
            </div>
            {provider.rating > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0 backdrop-blur-md"
                style={{ background: "rgba(10,14,20,0.55)", border: `1px solid ${GOLD_RING}` }}
              >
                <Star size={11} style={{ color: GOLD, fill: GOLD }} />
                <span className="text-sm font-bold">{provider.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-white/60">{provider.subtype}</div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: avail.color }}>
            <div className="w-2 h-2 rounded-full" style={{ background: avail.dot }} />
            {avail.label}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <div className="text-[10px] text-white/45 uppercase tracking-wider mb-0.5">Tarif</div>
            <div className="font-bold text-sm" style={{ color: GOLD }}>
              {provider.tarif.value} euros
            </div>
            <div className="text-[10px] text-white/45">par {provider.tarif.unit}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/45 uppercase tracking-wider mb-0.5">Capacite</div>
            <div className="font-bold text-sm">{provider.capacity}</div>
            <div className="text-[10px] text-white/45">personnes</div>
          </div>
          <div>
            <div className="text-[10px] text-white/45 uppercase tracking-wider mb-0.5">Commission</div>
            <div className="font-bold text-sm text-green-300">{provider.commission}%</div>
            <div className="text-[10px] text-white/45">Eventy</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {provider.amenities.slice(0, 5).map((a) => {
            const Ic = AMENITY_ICONS[a] || Sparkles;
            return (
              <span
                key={a}
                className="text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-medium"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)" }}
              >
                <Ic size={10} />
                {a}
              </span>
            );
          })}
        </div>

        {provider.bookings90d > 0 && (
          <div
            className="flex items-center justify-between text-xs px-3 py-2 rounded-xl"
            style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
          >
            <div className="flex items-center gap-1.5 text-white/70">
              <CalendarDays size={12} className="text-green-300" />
              {provider.bookings90d} reservations 90j
            </div>
            <div className="font-bold text-green-300">{(provider.revenue90d / 1000).toFixed(1)}k</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NegoPanel({ list, onSelect }: { list: Provider[]; onSelect: (p: Provider) => void }) {
  if (list.length === 0) return null;
  return (
    <div className="rounded-2xl p-5" style={GLASS_STRONG}>
      <div className="flex items-center gap-2 mb-4">
        <Handshake size={16} style={{ color: GOLD }} />
        <h3 className="font-semibold">Negociations</h3>
        <span className="text-[11px] text-white/40 ml-auto">{list.length} en cours</span>
      </div>
      <div className="space-y-2">
        {list.slice(0, 5).map((p) => {
          const cat = CATEGORY_CFG[p.category];
          const contract = CONTRACT_CFG[p.contract];
          const CatIc = cat.icon;
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition hover:bg-white/5"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: cat.bg, border: `1px solid ${cat.color}44` }}
              >
                <CatIc size={14} style={{ color: cat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-[11px] text-white/50 truncate">{p.zone}</div>
              </div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0"
                style={{ background: contract.bg, color: contract.color }}
              >
                {contract.label}
              </span>
            </div>
          );
        })}
      </div>
      <Link
        href="/admin/hra/negociations"
        className="mt-3 flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition hover:bg-white/5"
        style={{ color: GOLD }}
      >
        Ouvrir le pipeline <ChevronRight size={12} />
      </Link>
    </div>
  );
}

function RenewalsPanel({ list, onSelect }: { list: Provider[]; onSelect: (p: Provider) => void }) {
  if (list.length === 0) return null;
  return (
    <div className="rounded-2xl p-5" style={GLASS}>
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw size={16} className="text-amber-300" />
        <h3 className="font-semibold">Renouvellements</h3>
        <span className="text-[11px] text-white/40 ml-auto">{list.length} alertes</span>
      </div>
      <div className="space-y-3">
        {list.map((p) => {
          const days = daysUntil(p.contractEnd);
          const cat = CATEGORY_CFG[p.category];
          const overdue = p.contract === "expire";
          const CatIc = cat.icon;
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              className="p-3 rounded-xl cursor-pointer transition hover:bg-white/5"
              style={{
                background: overdue ? "rgba(248,113,113,0.08)" : "rgba(212,168,83,0.06)",
                border: `1px solid ${overdue ? "rgba(248,113,113,0.22)" : GOLD_RING}`,
              }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cat.bg }}
                >
                  <CatIc size={13} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: overdue ? "#f87171" : GOLD }}>
                    {overdue
                      ? "Contrat expire"
                      : days > 0
                      ? "Fin dans " + days + " jours"
                      : "Renouvellement en retard"}
                  </div>
                </div>
                <button
                  className="text-[10px] px-2 py-1 rounded-md font-semibold shrink-0 transition hover:brightness-110"
                  style={{
                    background: overdue ? "rgba(248,113,113,0.2)" : GOLD_SOFT,
                    color: overdue ? "#f87171" : GOLD,
                  }}
                >
                  Relancer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopRevenuePanel({ list, onSelect }: { list: Provider[]; onSelect: (p: Provider) => void }) {
  return (
    <div className="rounded-2xl p-5" style={GLASS}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-green-300" />
        <h3 className="font-semibold">Top revenus 90j</h3>
      </div>
      <div className="space-y-2">
        {list.map((p, idx) => {
          const cat = CATEGORY_CFG[p.category];
          const CatIc = cat.icon;
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-white/5"
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{
                  background: idx === 0 ? GOLD_SOFT : "rgba(255,255,255,0.05)",
                  color: idx === 0 ? GOLD : "rgba(255,255,255,0.6)",
                }}
              >
                {idx + 1}
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: cat.bg }}
              >
                <CatIc size={13} style={{ color: cat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-[11px] text-white/50 truncate">{p.bookings90d} reservations</div>
              </div>
              <div className="text-sm font-bold text-green-300">{(p.revenue90d / 1000).toFixed(1)}k</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailDrawer({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const cat = CATEGORY_CFG[provider.category];
  const contract = CONTRACT_CFG[provider.contract];
  const avail = AVAIL_CFG[provider.availability];
  const CatIc = cat.icon;

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
        className="fixed right-0 top-0 bottom-0 w-full md:w-[620px] z-50 overflow-y-auto"
        style={{ background: BG, borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="relative h-64">
          <Image src={provider.photo} alt={provider.name} fill className="object-cover" sizes="620px" unoptimized />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 20%, rgba(10,14,20,0.95) 100%)" }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center transition hover:brightness-125 backdrop-blur-md"
            style={{ background: "rgba(10,14,20,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <X size={16} />
          </button>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold backdrop-blur-md"
              style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}44` }}
            >
              <CatIc size={12} />
              {cat.label}
            </span>
            {provider.premium && (
              <span
                className="text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold uppercase tracking-wider backdrop-blur-md"
                style={{ background: GOLD_SOFT, color: GOLD, border: `1px solid ${GOLD_RING}` }}
              >
                <Sparkles size={11} />
                Premium
              </span>
            )}
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold truncate">{provider.name}</h2>
                  {provider.verified && <BadgeCheck size={20} style={{ color: GOLD }} />}
                </div>
                <div className="text-sm text-white/70 mt-1">{provider.subtype}</div>
                <div className="flex items-center gap-1.5 text-sm text-white/80 mt-1">
                  <MapPin size={13} />
                  {provider.zone}, {provider.country}
                </div>
              </div>
              {provider.rating > 0 && (
                <div
                  className="flex flex-col items-center px-3 py-2 rounded-xl shrink-0 backdrop-blur-md"
                  style={{ background: "rgba(10,14,20,0.55)", border: `1px solid ${GOLD_RING}` }}
                >
                  <div className="flex items-center gap-1">
                    <Star size={13} style={{ color: GOLD, fill: GOLD }} />
                    <span className="text-lg font-bold">{provider.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-[10px] text-white/60">{provider.reviewsCount} avis</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-1 rounded-md font-semibold uppercase tracking-wider"
              style={{ background: contract.bg, color: contract.color }}
            >
              {contract.label}
            </span>
            <span
              className="text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.05)", color: avail.color }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: avail.dot }} />
              {avail.label}
            </span>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">{provider.description}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3" style={{ background: GOLD_SOFT, border: `1px solid ${GOLD_RING}` }}>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Tarif</div>
              <div className="text-xl font-bold mt-1" style={{ color: GOLD }}>
                {provider.tarif.value}
              </div>
              <div className="text-[11px] text-white/60">euros par {provider.tarif.unit}</div>
            </div>
            <div className="rounded-xl p-3" style={GLASS}>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Capacite</div>
              <div className="text-xl font-bold mt-1">{provider.capacity}</div>
              <div className="text-[11px] text-white/60">personnes</div>
            </div>
            <div className="rounded-xl p-3" style={GLASS}>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Commission</div>
              <div className="text-xl font-bold mt-1 text-green-300">{provider.commission}%</div>
              <div className="text-[11px] text-white/60">marge Eventy</div>
            </div>
          </div>

          {provider.bookings90d > 0 && (
            <div className="rounded-xl p-4" style={GLASS}>
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Performance 90 jours</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-white/55 mb-1">
                    <CalendarDays size={11} />
                    Reservations
                  </div>
                  <div className="text-lg font-bold">{provider.bookings90d}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-white/55 mb-1">
                    <Euro size={11} />
                    Revenu genere
                  </div>
                  <div className="text-lg font-bold text-green-300">{formatEur(provider.revenue90d)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Contrat</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/55">Statut</span>
                <span className="font-semibold" style={{ color: contract.color }}>
                  {contract.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/55">Debut</span>
                <span>{formatDate(provider.contractStart)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/55">Fin</span>
                <span>{formatDate(provider.contractEnd)}</span>
              </div>
              {provider.contractEnd && daysUntil(provider.contractEnd) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-white/55">Echeance</span>
                  <span style={{ color: daysUntil(provider.contractEnd) < 90 ? GOLD : "rgba(255,255,255,0.9)" }}>
                    {daysUntil(provider.contractEnd)} jours
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Contact</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-white/40" />
                <span>{provider.contact.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-white/40" />
                <span>{provider.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-white/40" />
                <span>{provider.contact.phone}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={GLASS}>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Prestations et equipements</div>
            <div className="flex items-center gap-2 flex-wrap">
              {provider.amenities.map((a) => {
                const Ic = AMENITY_ICONS[a] || Sparkles;
                return (
                  <span
                    key={a}
                    className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)" }}
                  >
                    <Ic size={11} />
                    {a}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #b8893f 100%)`, color: BG }}
            >
              <FileSignature size={15} /> Ouvrir le contrat
            </button>
            <button className="py-3 px-4 rounded-xl text-sm font-medium transition hover:bg-white/5" style={GLASS}>
              <Mail size={15} />
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
