"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Archive,
  CheckCheck,
  ChevronLeft,
  Filter,
  Inbox,
  Mail,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  Smile,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";

const ACCENT = "#D4A853";
const BG = "#0A0E14";

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const GLASS_ACCENT: React.CSSProperties = {
  background:
    "linear-gradient(140deg, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.03) 60%)",
  border: "1px solid rgba(212,168,83,0.22)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

type Canal = "INTERNE" | "CLIENT" | "PRO" | "HRA";
type Statut = "NON_LU" | "LU" | "ARCHIVE";

interface Attachment {
  nom: string;
  poids: string;
}

interface Message {
  id: string;
  auteur: string;
  texte: string;
  envoyeA: string;
  moi: boolean;
  piece?: Attachment;
}

interface Conversation {
  id: string;
  nom: string;
  initiales: string;
  role: string;
  canal: Canal;
  statut: Statut;
  dernierMessage: string;
  horodatage: string;
  voyage?: string;
  etoile: boolean;
  priorite: boolean;
  nonLu: number;
  messages: Message[];
}

const CANAL_CONFIG: Record<Canal, { label: string; color: string; bg: string }> = {
  INTERNE: { label: "Interne", color: "#a78bfa", bg: "rgba(167,139,250,0.14)" },
  CLIENT: { label: "Client", color: ACCENT, bg: "rgba(212,168,83,0.16)" },
  PRO: { label: "Pro", color: "#60a5fa", bg: "rgba(96,165,250,0.14)" },
  HRA: { label: "HRA", color: "#34d399", bg: "rgba(52,211,153,0.14)" },
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    nom: "Sophie Marceau",
    initiales: "SM",
    role: "Cliente VIP",
    canal: "CLIENT",
    statut: "NON_LU",
    dernierMessage: "Merci infiniment pour le suivi, on se voit au briefing vendredi.",
    horodatage: "il y a 4 min",
    voyage: "Marrakech Express - Mai 2026",
    etoile: true,
    priorite: false,
    nonLu: 2,
    messages: [
      {
        id: "m1",
        auteur: "Sophie Marceau",
        texte: "Bonjour, je voulais confirmer ma chambre avec vue piscine pour le voyage de mai.",
        envoyeA: "14:02",
        moi: false,
      },
      {
        id: "m2",
        auteur: "Moi",
        texte: "Bonjour Sophie, tout est bloque pour vous. La chambre 204 vous attend.",
        envoyeA: "14:05",
        moi: true,
      },
      {
        id: "m3",
        auteur: "Sophie Marceau",
        texte: "Merci infiniment pour le suivi, on se voit au briefing vendredi.",
        envoyeA: "14:18",
        moi: false,
      },
    ],
  },
  {
    id: "c2",
    nom: "Equipe Direction",
    initiales: "ED",
    role: "Canal interne",
    canal: "INTERNE",
    statut: "NON_LU",
    dernierMessage: "Reunion de production demain a 9h00, pensez aux chiffres semaine 17.",
    horodatage: "il y a 22 min",
    etoile: false,
    priorite: true,
    nonLu: 5,
    messages: [
      {
        id: "m4",
        auteur: "Carol Leblanc",
        texte: "Petit rappel : reunion de production demain matin.",
        envoyeA: "13:40",
        moi: false,
      },
      {
        id: "m5",
        auteur: "Hugo Tanguy",
        texte: "Je prepare la synthese voyages, ca arrive ce soir.",
        envoyeA: "13:44",
        moi: false,
      },
      {
        id: "m6",
        auteur: "Lea Morel",
        texte: "Financiers pret a partir, un oeil dessus serait bienvenu.",
        envoyeA: "13:55",
        moi: false,
        piece: { nom: "kpis-semaine-17.pdf", poids: "342 Ko" },
      },
    ],
  },
  {
    id: "c3",
    nom: "Studio Atlas (Pro)",
    initiales: "SA",
    role: "Partenaire photo",
    canal: "PRO",
    statut: "NON_LU",
    dernierMessage: "Nous confirmons la presence de 2 photographes sur Marrakech.",
    horodatage: "il y a 1 h",
    voyage: "Marrakech Express",
    etoile: false,
    priorite: false,
    nonLu: 1,
    messages: [
      {
        id: "m7",
        auteur: "Studio Atlas",
        texte: "Bonjour, besoin de valider les horaires du shooting du dimanche.",
        envoyeA: "11:12",
        moi: false,
      },
      {
        id: "m8",
        auteur: "Moi",
        texte: "Bonjour, on vous envoie le planning detaille dans la journee.",
        envoyeA: "11:34",
        moi: true,
      },
      {
        id: "m9",
        auteur: "Studio Atlas",
        texte: "Nous confirmons la presence de 2 photographes sur Marrakech.",
        envoyeA: "12:48",
        moi: false,
      },
    ],
  },
  {
    id: "c4",
    nom: "Riad Al Waha",
    initiales: "RW",
    role: "HRA - Marrakech",
    canal: "HRA",
    statut: "LU",
    dernierMessage: "Nouveau menu petit-dejeuner envoye pour validation.",
    horodatage: "il y a 3 h",
    voyage: "Marrakech Express",
    etoile: true,
    priorite: false,
    nonLu: 0,
    messages: [
      {
        id: "m10",
        auteur: "Youssef Benali",
        texte: "Nouveau menu petit-dejeuner envoye pour validation.",
        envoyeA: "10:20",
        moi: false,
        piece: { nom: "menu-riad-2026.pdf", poids: "1.2 Mo" },
      },
    ],
  },
  {
    id: "c5",
    nom: "Karim Benali",
    initiales: "KB",
    role: "Ambassadeur",
    canal: "CLIENT",
    statut: "LU",
    dernierMessage: "Je rentre de Seville, reportage disponible, ou vous l envoie.",
    horodatage: "hier",
    etoile: false,
    priorite: false,
    nonLu: 0,
    messages: [
      {
        id: "m11",
        auteur: "Karim Benali",
        texte: "Je rentre de Seville, reportage disponible, ou vous l envoie.",
        envoyeA: "19:40",
        moi: false,
      },
    ],
  },
  {
    id: "c6",
    nom: "Pole Finance",
    initiales: "PF",
    role: "Canal interne",
    canal: "INTERNE",
    statut: "LU",
    dernierMessage: "Cloture comptable avril en cours, synthese disponible lundi.",
    horodatage: "hier",
    etoile: false,
    priorite: false,
    nonLu: 0,
    messages: [
      {
        id: "m12",
        auteur: "Lea Morel",
        texte: "Cloture comptable avril en cours, synthese disponible lundi.",
        envoyeA: "17:02",
        moi: false,
      },
    ],
  },
  {
    id: "c7",
    nom: "Marie Chevalier",
    initiales: "MC",
    role: "Nouvelle cliente",
    canal: "CLIENT",
    statut: "ARCHIVE",
    dernierMessage: "Premier voyage reserve, tres emballee par le programme.",
    horodatage: "2 avr.",
    etoile: false,
    priorite: false,
    nonLu: 0,
    messages: [
      {
        id: "m13",
        auteur: "Marie Chevalier",
        texte: "Premier voyage reserve, tres emballee par le programme.",
        envoyeA: "09:18",
        moi: false,
      },
    ],
  },
];

const FILTRES: { key: Canal | "TOUS" | "NON_LU" | "STAR"; label: string }[] = [
  { key: "TOUS", label: "Tous" },
  { key: "NON_LU", label: "Non lus" },
  { key: "INTERNE", label: "Interne" },
  { key: "CLIENT", label: "Clients" },
  { key: "PRO", label: "Pros" },
  { key: "HRA", label: "HRA" },
  { key: "STAR", label: "Etoiles" },
];

export default function EquipeMessageriePage() {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number]["key"]>("TOUS");
  const [selection, setSelection] = useState<string | null>(CONVERSATIONS[0].id);
  const [brouillon, setBrouillon] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CONVERSATIONS.filter((c) => {
      if (filtre === "NON_LU" && c.nonLu === 0) return false;
      if (filtre === "STAR" && !c.etoile) return false;
      if (
        filtre !== "TOUS" &&
        filtre !== "NON_LU" &&
        filtre !== "STAR" &&
        c.canal !== filtre
      )
        return false;
      if (!q) return true;
      return (
        c.nom.toLowerCase().includes(q) ||
        c.dernierMessage.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      );
    });
  }, [search, filtre]);

  const selected = useMemo(
    () => CONVERSATIONS.find((c) => c.id === selection) ?? filtered[0] ?? CONVERSATIONS[0],
    [selection, filtered]
  );

  const stats = useMemo(
    () => ({
      total: CONVERSATIONS.length,
      nonLu: CONVERSATIONS.reduce((acc, c) => acc + c.nonLu, 0),
      clients: CONVERSATIONS.filter((c) => c.canal === "CLIENT").length,
      interne: CONVERSATIONS.filter((c) => c.canal === "INTERNE").length,
      prioritaires: CONVERSATIONS.filter((c) => c.priorite).length,
    }),
    []
  );

  const handleEnvoyer = () => {
    if (!brouillon.trim()) return;
    setBrouillon("");
  };

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: BG, color: "#f1f3fc" }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
            Messagerie unifiee
          </p>
          <h1 className="text-3xl font-bold">Boite de reception equipe</h1>
          <p className="text-sm text-gray-400 mt-1">
            Conversations internes et clients, pieces jointes et suivi prioritaire.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            style={GLASS}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          >
            <Filter size={14} style={{ color: ACCENT }} />
            Filtres avances
          </button>
          <button
            type="button"
            style={GLASS_ACCENT}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Sparkles size={14} style={{ color: ACCENT }} />
            <span style={{ color: ACCENT }}>Nouveau message</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Conversations", value: stats.total, color: ACCENT, icon: MessageCircle },
          { label: "Messages non lus", value: stats.nonLu, color: "#f87171", icon: Mail },
          { label: "Clients", value: stats.clients, color: ACCENT, icon: Users },
          { label: "Canaux internes", value: stats.interne, color: "#a78bfa", icon: Inbox },
          { label: "Prioritaires", value: stats.prioritaires, color: "#fbbf24", icon: AlertCircle },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              style={GLASS}
              className="rounded-2xl p-4"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(255,255,255,0.04)", color: k.color }}
              >
                <Icon size={16} />
              </div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-gray-500 mt-1">{k.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div style={GLASS} className="rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 text-gray-500"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un contact, une conversation ou un mot cle..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#f1f3fc",
            }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTRES.map((f) => {
            const active = filtre === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFiltre(f.key)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                style={
                  active
                    ? {
                        background: "rgba(212,168,83,0.18)",
                        color: ACCENT,
                        border: "1px solid rgba(212,168,83,0.35)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        color: "#9ca3af",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-2">
          <AnimatePresence>
            {filtered.map((c, i) => {
              const canal = CANAL_CONFIG[c.canal];
              const active = selected?.id === c.id;
              return (
                <motion.button
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, delay: i * 0.02 }}
                  type="button"
                  onClick={() => setSelection(c.id)}
                  className="w-full text-left rounded-2xl p-4 flex items-start gap-3 transition-all"
                  style={{
                    ...GLASS,
                    borderColor: active ? "rgba(212,168,83,0.35)" : undefined,
                    background: active
                      ? "linear-gradient(140deg, rgba(212,168,83,0.08), rgba(212,168,83,0.02))"
                      : GLASS.background,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs"
                    style={{
                      background: `${canal.color}22`,
                      color: canal.color,
                      border: `1px solid ${canal.color}44`,
                    }}
                  >
                    {c.initiales}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate flex-1">{c.nom}</span>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">{c.horodatage}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: canal.bg, color: canal.color }}
                      >
                        {canal.label}
                      </span>
                      {c.priorite && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: "rgba(251,191,36,0.14)", color: "#fbbf24" }}
                        >
                          <AlertCircle size={9} />
                          Prioritaire
                        </span>
                      )}
                      {c.etoile && <Star size={10} style={{ color: ACCENT }} />}
                    </div>
                    <p
                      className="text-xs truncate"
                      style={{ color: c.nonLu > 0 ? "#e5e7eb" : "#6b7280" }}
                    >
                      {c.dernierMessage}
                    </p>
                    {c.voyage && (
                      <p className="text-[10px] text-gray-600 mt-1 truncate">Voyage : {c.voyage}</p>
                    )}
                  </div>
                  {c.nonLu > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: ACCENT, color: BG }}
                    >
                      {c.nonLu}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 rounded-2xl" style={GLASS}>
              <Inbox size={32} className="mx-auto mb-3 text-gray-600" />
              <p className="text-gray-500 text-sm">Aucune conversation.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={GLASS}
              className="rounded-2xl overflow-hidden flex flex-col"
            >
              <div
                className="p-5 flex items-center gap-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <button
                  type="button"
                  onClick={() => setSelection(null)}
                  className="lg:hidden p-1"
                >
                  <ChevronLeft size={16} className="text-gray-400" />
                </button>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `${CANAL_CONFIG[selected.canal].color}22`,
                    color: CANAL_CONFIG[selected.canal].color,
                    border: `1px solid ${CANAL_CONFIG[selected.canal].color}44`,
                  }}
                >
                  {selected.initiales}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold">{selected.nom}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: CANAL_CONFIG[selected.canal].bg,
                        color: CANAL_CONFIG[selected.canal].color,
                      }}
                    >
                      {CANAL_CONFIG[selected.canal].label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selected.role}
                    {selected.voyage ? ` - ${selected.voyage}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    style={GLASS}
                    className="p-2 rounded-xl"
                    aria-label="Appel video"
                  >
                    <Video size={14} style={{ color: ACCENT }} />
                  </button>
                  <button
                    type="button"
                    style={GLASS}
                    className="p-2 rounded-xl"
                    aria-label="Marquer tout lu"
                  >
                    <CheckCheck size={14} style={{ color: "#34d399" }} />
                  </button>
                  <button
                    type="button"
                    style={GLASS}
                    className="p-2 rounded-xl"
                    aria-label="Archiver"
                  >
                    <Archive size={14} style={{ color: "#9ca3af" }} />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4 min-h-[320px] max-h-[460px] overflow-y-auto">
                {selected.messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className={`flex ${m.moi ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%] space-y-1">
                      {!m.moi && (
                        <p className="text-[10px] text-gray-500 ml-2">{m.auteur}</p>
                      )}
                      <div
                        className="rounded-2xl px-4 py-2.5 text-sm"
                        style={
                          m.moi
                            ? {
                                background: "rgba(212,168,83,0.14)",
                                border: "1px solid rgba(212,168,83,0.28)",
                                color: "#f1f3fc",
                              }
                            : {
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "#e5e7eb",
                              }
                        }
                      >
                        {m.texte}
                        {m.piece && (
                          <div
                            className="mt-2 flex items-center gap-2 p-2 rounded-xl"
                            style={{
                              background: "rgba(0,0,0,0.25)",
                              border: "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <Paperclip size={12} style={{ color: ACCENT }} />
                            <span className="text-xs flex-1">{m.piece.nom}</span>
                            <span className="text-[10px] text-gray-500">{m.piece.poids}</span>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-[10px] text-gray-600 ${m.moi ? "text-right mr-2" : "ml-2"}`}
                      >
                        {m.envoyeA}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                className="p-4 flex items-center gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <button
                  type="button"
                  style={GLASS}
                  className="p-2.5 rounded-xl"
                  aria-label="Piece jointe"
                >
                  <Paperclip size={14} style={{ color: "#9ca3af" }} />
                </button>
                <button
                  type="button"
                  style={GLASS}
                  className="p-2.5 rounded-xl"
                  aria-label="Emoji"
                >
                  <Smile size={14} style={{ color: "#9ca3af" }} />
                </button>
                <input
                  type="text"
                  value={brouillon}
                  onChange={(e) => setBrouillon(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEnvoyer();
                    }
                  }}
                  placeholder="Ecrire un message..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#f1f3fc",
                  }}
                />
                <button
                  type="button"
                  onClick={handleEnvoyer}
                  disabled={!brouillon.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: brouillon.trim()
                      ? "rgba(212,168,83,0.22)"
                      : "rgba(255,255,255,0.04)",
                    border: brouillon.trim()
                      ? "1px solid rgba(212,168,83,0.35)"
                      : "1px solid rgba(255,255,255,0.07)",
                    color: brouillon.trim() ? ACCENT : "#6b7280",
                    cursor: brouillon.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  <Send size={14} />
                  Envoyer
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
