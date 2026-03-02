"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  AUDIENCES,
  AUDIENCE_TILES,
  UNIVERSAL_TILES,
  getAllTiles,
  type Tile,
  type Audience,
} from "../data/boligtekst-tiles";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface GeneratedText {
  finn: string;
  instagram: string;
  sms: string;
}

interface Version {
  id: number;
  texts: GeneratedText;
  feedback: string | null;
  timestamp: Date;
}

type Tone = "professional" | "warm" | "engaging";

const TONE_LABELS: Record<Tone, { label: string; desc: string }> = {
  professional: { label: "Profesjonell", desc: "Saklig, tillitsvekkende" },
  warm: { label: "Varm", desc: "Personlig, inviterende" },
  engaging: { label: "Engasjerende", desc: "Energisk, action-drevet" },
};

const BOLIGTYPER = [
  "Leilighet",
  "Enebolig",
  "Rekkehus",
  "Tomannsbolig",
  "Selveierleilighet",
  "Annet",
];

const CATEGORY_LABELS: Record<string, string> = {
  bolig_features: "Bolig",
  omrade_features: "Område",
  livsstil: "Livsstil",
};

// ── ROOM COUNTER ─────────────────────────────────────────────────────────────
const RoomCounter = ({
  label, value, onChange, min = 0, max = 9,
}: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
  <div className="flex-1 flex flex-col items-center">
    <span className="text-[9px] text-gray-600 uppercase tracking-[0.15em] mb-1.5">{label}</span>
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-base leading-none"
      >−</button>
      <span className="w-7 text-center text-sm text-white tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-base leading-none"
      >+</button>
    </div>
  </div>
);

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function BoligtekstView() {
  // Form state
  const [address, setAddress] = useState("");
  const [boligtype, setBoligtype] = useState("Leilighet");
  const [sqm, setSqm] = useState("");
  const [rooms, setRooms] = useState("");
  const [floor, setFloor] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [highlights, setHighlights] = useState("");
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  // Room details state
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [rdSoverom, setRdSoverom] = useState(2);
  const [rdBad, setRdBad] = useState(1);
  const [rdWc, setRdWc] = useState(0);
  const [rdStueType, setRdStueType] = useState<"" | "gjennomgående" | "hjørne">("");
  const [rdKjokkenType, setRdKjokkenType] = useState<"" | "åpent" | "eget">("");
  const [rdKjokkenRenovert, setRdKjokkenRenovert] = useState(false);
  const [rdBadRenovert, setRdBadRenovert] = useState(false);
  const [rdVaskerom, setRdVaskerom] = useState(false);
  const [rdHjemmekontor, setRdHjemmekontor] = useState(false);
  const [rdKjellerstue, setRdKjellerstue] = useState(false);
  const [rdGarderoberom, setRdGarderoberom] = useState(false);

  // Audience + Tiles state
  const [selectedAudiences, setSelectedAudiences] = useState<Set<string>>(new Set());
  const [selectedTiles, setSelectedTiles] = useState<Set<string>>(new Set());
  const [showUniversal, setShowUniversal] = useState(false);

  // Version state
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"finn" | "instagram" | "sms">("finn");
  const [copied, setCopied] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const canSubmit = address.trim() && sqm.trim();
  const activeVersion = versions.find((v) => v.id === activeVersionId) ?? null;
  const currentText = loading && streamingText ? streamingText : null;

  // All tiles as flat lookup
  const allTilesFlat = useMemo(() => getAllTiles(), []);
  const tileById = useMemo(() => {
    const map = new Map<string, Tile>();
    for (const t of allTilesFlat) map.set(t.id, t);
    return map;
  }, [allTilesFlat]);

  // Merge audience tiles (deduplicated)
  const mergedAudienceTiles = useMemo(() => {
    const bolig: Tile[] = [];
    const omrade: Tile[] = [];
    const livsstil: Tile[] = [];
    const seen = new Set<string>();

    for (const audienceId of selectedAudiences) {
      const tiles = AUDIENCE_TILES[audienceId];
      if (!tiles) continue;
      for (const t of tiles.bolig_features) {
        if (!seen.has(t.id)) { bolig.push(t); seen.add(t.id); }
      }
      for (const t of tiles.omrade_features) {
        if (!seen.has(t.id)) { omrade.push(t); seen.add(t.id); }
      }
      for (const t of tiles.livsstil) {
        if (!seen.has(t.id)) { livsstil.push(t); seen.add(t.id); }
      }
    }
    return { bolig, omrade, livsstil };
  }, [selectedAudiences]);

  // ── Audience toggle ──
  const toggleAudience = (a: Audience) => {
    setSelectedAudiences((prev) => {
      const next = new Set(prev);
      if (next.has(a.id)) {
        next.delete(a.id);
      } else {
        next.add(a.id);
      }
      return next;
    });
  };

  // ── Tile toggle ──
  const toggleTile = (tile: Tile) => {
    setSelectedTiles((prev) => {
      const next = new Set(prev);
      if (next.has(tile.id)) {
        next.delete(tile.id);
      } else {
        next.add(tile.id);
      }
      // Rebuild highlights from selected tiles
      const labels = Array.from(next)
        .map((id) => tileById.get(id)?.label)
        .filter(Boolean);
      setHighlights(labels.join(", "));
      return next;
    });
  };

  // ── Payload ──
  const buildPayload = useCallback(
    (feedbackText?: string) => {
      const previousVersion = versions.length > 0 ? versions[versions.length - 1] : null;
      const audienceLabels = Array.from(selectedAudiences)
        .map((id) => AUDIENCES.find((a) => a.id === id)?.label)
        .filter(Boolean);
      const tileLabels = Array.from(selectedTiles)
        .map((id) => tileById.get(id)?.label)
        .filter(Boolean);

      const rdHasExtras = rdVaskerom || rdHjemmekontor || rdKjellerstue || rdGarderoberom;
      const rdHasType = rdStueType || rdKjokkenType || rdKjokkenRenovert || rdBadRenovert;

      return {
        address,
        boligtype,
        sqm: Number(sqm),
        rooms: Number(rooms) || undefined,
        floor: floor || undefined,
        buildYear: Number(buildYear) || undefined,
        highlights,
        notes,
        tone,
        audiences: audienceLabels.length > 0 ? audienceLabels : undefined,
        selectedTiles: tileLabels.length > 0 ? tileLabels : undefined,
        previousFinnText: previousVersion?.texts.finn || undefined,
        feedback: feedbackText || undefined,
        roomDetails: (rdSoverom !== 2 || rdBad !== 1 || rdWc > 0 || rdHasType || rdHasExtras) ? {
          soverom: rdSoverom,
          bad: rdBad,
          wc: rdWc > 0 ? rdWc : undefined,
          stueType: rdStueType || undefined,
          kjokkenType: rdKjokkenType || undefined,
          kjokkenRenovert: rdKjokkenRenovert || undefined,
          badRenovert: rdBadRenovert || undefined,
          hasVaskerom: rdVaskerom || undefined,
          hasHjemmekontor: rdHjemmekontor || undefined,
          hasKjellerstue: rdKjellerstue || undefined,
          hasGarderoberom: rdGarderoberom || undefined,
        } : undefined,
      };
    },
    [address, boligtype, sqm, rooms, floor, buildYear, highlights, notes, tone, versions, selectedAudiences, selectedTiles, tileById,
     rdSoverom, rdBad, rdWc, rdStueType, rdKjokkenType, rdKjokkenRenovert, rdBadRenovert, rdVaskerom, rdHjemmekontor, rdKjellerstue, rdGarderoberom]
  );

  // ── Generate ──
  const handleGenerate = useCallback(
    async (feedbackText?: string) => {
      if (!canSubmit) return;
      setLoading(true);
      setError("");
      setStreamingText("");

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/generate-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(feedbackText)),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Noe gikk galt. Prøv igjen.");
        }

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("text/event-stream") && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let finnText = "";
          let instagramText = "";
          let smsText = "";
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);
                if (event.type === "finn_chunk") {
                  finnText += event.text;
                  setStreamingText(finnText);
                } else if (event.type === "instagram") {
                  instagramText = event.text;
                } else if (event.type === "sms") {
                  smsText = event.text;
                }
              } catch {
                // skip
              }
            }
          }

          const newVersion: Version = {
            id: Date.now(),
            texts: { finn: finnText, instagram: instagramText, sms: smsText },
            feedback: feedbackText || null,
            timestamp: new Date(),
          };
          setVersions((prev) => [...prev, newVersion]);
          setActiveVersionId(newVersion.id);
          setActiveTab("finn");
        } else {
          const data = await res.json();
          const newVersion: Version = {
            id: Date.now(),
            texts: data,
            feedback: feedbackText || null,
            timestamp: new Date(),
          };
          setVersions((prev) => [...prev, newVersion]);
          setActiveVersionId(newVersion.id);
          setActiveTab("finn");
        }

        setFeedback("");
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError(e instanceof Error ? e.message : "Noe gikk galt.");
        }
      } finally {
        setLoading(false);
        setStreamingText("");
        abortRef.current = null;
      }
    },
    [canSubmit, buildPayload]
  );

  const handleCopy = async () => {
    const texts = activeVersion?.texts;
    if (!texts) return;
    const text = activeTab === "finn" ? texts.finn : activeTab === "instagram" ? texts.instagram : texts.sms;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    handleGenerate(feedback.trim() || undefined);
  };

  const displayText =
    currentText ||
    (activeVersion
      ? activeTab === "finn"
        ? activeVersion.texts.finn
        : activeTab === "instagram"
          ? activeVersion.texts.instagram
          : activeVersion.texts.sms
      : "");

  // ── Tile chip renderer ──
  const TileChip = ({ tile }: { tile: Tile }) => {
    const active = selectedTiles.has(tile.id);
    return (
      <button
        onClick={() => toggleTile(tile)}
        className={
          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-all duration-150 whitespace-nowrap " +
          (active
            ? "bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e]"
            : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]")
        }
      >
        <span className="text-[12px]">{tile.emoji}</span>
        {tile.label}
      </button>
    );
  };

  return (
    <div className="flex h-[calc(100vh-52px)] bg-[#0a0e1a]">
      {/* ── LEFT: Form ── */}
      <aside className="w-[420px] min-w-[420px] bg-[#0d1220] border-r border-white/[0.06] flex flex-col overflow-y-auto">
        <div className="p-6">
          <h2 className="text-[10px] text-[#c9a96e]/60 uppercase tracking-[0.25em] mb-6">
            Boligdetaljer
          </h2>

          {/* Address */}
          <div className="mb-4">
            <label className="text-[11px] text-gray-500 block mb-1.5">Adresse *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Thorvald Meyers gate 15, 0555 Oslo"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
            />
          </div>

          {/* Boligtype + sqm row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[11px] text-gray-500 block mb-1.5">Boligtype</label>
              <select
                value={boligtype}
                onChange={(e) => setBoligtype(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a96e]/30 transition-colors cursor-pointer"
              >
                {BOLIGTYPER.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="text-[11px] text-gray-500 block mb-1.5">Kvm *</label>
              <input
                type="number"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
                placeholder="75"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
              />
            </div>
          </div>

          {/* Rooms + Floor + Build year row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[11px] text-gray-500 block mb-1.5">Antall rom</label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                placeholder="3"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-gray-500 block mb-1.5">Etasje</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="3. etg"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-gray-500 block mb-1.5">Byggeår</label>
              <input
                type="number"
                value={buildYear}
                onChange={(e) => setBuildYear(e.target.value)}
                placeholder="1920"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
              />
            </div>
          </div>

          {/* ── ROM-DETALJER (collapsible) ── */}
          <div className="mb-4">
            <button
              onClick={() => setShowRoomDetails(!showRoomDetails)}
              className="flex items-center justify-between w-full text-left group mb-1"
            >
              <span className="text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors flex items-center gap-1.5">
                Romdetaljer
                {(rdStueType || rdKjokkenType || rdKjokkenRenovert || rdBadRenovert || rdVaskerom || rdHjemmekontor || rdKjellerstue || rdGarderoberom) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]/60 inline-block" />
                )}
                <span className="text-gray-700 text-[10px] ml-0.5">(valgfritt)</span>
              </span>
              <svg
                className={"w-3.5 h-3.5 text-gray-600 transition-transform duration-200 " + (showRoomDetails ? "rotate-180" : "")}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showRoomDetails && (
              <div className="mt-2 bg-white/[0.01] border border-white/[0.05] rounded-lg p-3 space-y-3">
                {/* Room counters */}
                <div className="flex gap-2 pb-2 border-b border-white/[0.05]">
                  <RoomCounter label="Soverom" value={rdSoverom} onChange={setRdSoverom} min={0} max={8} />
                  <RoomCounter label="Bad" value={rdBad} onChange={setRdBad} min={0} max={5} />
                  <RoomCounter label="WC" value={rdWc} onChange={setRdWc} min={0} max={4} />
                </div>

                {/* Stue type */}
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">Stue</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["gjennomgående", "hjørne"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setRdStueType(rdStueType === t ? "" : t)}
                        className={"px-2 py-1 rounded-md text-[11px] transition-all duration-150 " + (rdStueType === t ? "bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e]" : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300")}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                {/* Kjøkken + Bad */}
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">Kjøkken & Bad</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["åpent", "eget"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setRdKjokkenType(rdKjokkenType === t ? "" : t)}
                        className={"px-2 py-1 rounded-md text-[11px] transition-all duration-150 " + (rdKjokkenType === t ? "bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e]" : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300")}
                      >kjøkken {t}</button>
                    ))}
                    <button
                      onClick={() => setRdKjokkenRenovert(!rdKjokkenRenovert)}
                      className={"px-2 py-1 rounded-md text-[11px] transition-all duration-150 " + (rdKjokkenRenovert ? "bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e]" : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300")}
                    >🍳 kjøkken renovert</button>
                    <button
                      onClick={() => setRdBadRenovert(!rdBadRenovert)}
                      className={"px-2 py-1 rounded-md text-[11px] transition-all duration-150 " + (rdBadRenovert ? "bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e]" : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300")}
                    >🚿 bad renovert</button>
                  </div>
                </div>

                {/* Ekstrarom */}
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">Ekstrarom</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {([
                      { active: rdVaskerom, set: setRdVaskerom, label: "👕 Vaskerom" },
                      { active: rdHjemmekontor, set: setRdHjemmekontor, label: "💻 Hjemmekontor" },
                      { active: rdKjellerstue, set: setRdKjellerstue, label: "🎮 Kjellerstue" },
                      { active: rdGarderoberom, set: setRdGarderoberom, label: "👗 Garderoberom" },
                    ] as const).map(({ active, set, label }) => (
                      <button
                        key={label}
                        onClick={() => (set as (v: boolean) => void)(!active)}
                        className={"px-2 py-1 rounded-md text-[11px] transition-all duration-150 " + (active ? "bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e]" : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300")}
                      >{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className="text-[11px] text-gray-500 block mb-1.5">
              Egne notater
              <span className="text-gray-700 ml-1">(visningsinntrykk, nabolag...)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Rolig gate, nær Birkelunden park. Mange barnefamilier i området."
              rows={2}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors resize-none"
            />
          </div>

          {/* ── MÅLGRUPPE ── */}
          <div className="mb-5">
            <label className="text-[11px] text-gray-500 block mb-2">
              Målgruppe
              <span className="text-gray-700 ml-1">(velg én eller flere)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {AUDIENCES.map((a) => {
                const active = selectedAudiences.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAudience(a)}
                    className={
                      "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 " +
                      (active
                        ? "bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]"
                        : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]")
                    }
                  >
                    <span className="text-[14px]">{a.emoji}</span>
                    <span className="text-[11px] font-medium truncate">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SMART TILES (audience-specific) ── */}
          {selectedAudiences.size > 0 && (
            <div className="mb-5">
              <label className="text-[11px] text-gray-500 block mb-2">
                Høydepunkter
                <span className="text-gray-700 ml-1">(klikk for å velge)</span>
              </label>

              {/* Bolig features */}
              {mergedAudienceTiles.bolig.length > 0 && (
                <div className="mb-3">
                  <span className="text-[9px] text-[#c9a96e]/40 uppercase tracking-[0.2em] block mb-1.5">
                    {CATEGORY_LABELS.bolig_features}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mergedAudienceTiles.bolig.map((t) => (
                      <TileChip key={t.id} tile={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Område features */}
              {mergedAudienceTiles.omrade.length > 0 && (
                <div className="mb-3">
                  <span className="text-[9px] text-[#c9a96e]/40 uppercase tracking-[0.2em] block mb-1.5">
                    {CATEGORY_LABELS.omrade_features}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mergedAudienceTiles.omrade.map((t) => (
                      <TileChip key={t.id} tile={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Livsstil */}
              {mergedAudienceTiles.livsstil.length > 0 && (
                <div className="mb-3">
                  <span className="text-[9px] text-[#c9a96e]/40 uppercase tracking-[0.2em] block mb-1.5">
                    {CATEGORY_LABELS.livsstil}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mergedAudienceTiles.livsstil.map((t) => (
                      <TileChip key={t.id} tile={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── UNIVERSAL TILES (collapsible) ── */}
          <div className="mb-5">
            <button
              onClick={() => setShowUniversal(!showUniversal)}
              className="flex items-center justify-between w-full text-left group"
            >
              <span className="text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors">
                Generelle høydepunkter
              </span>
              <svg
                className={
                  "w-3.5 h-3.5 text-gray-600 transition-transform duration-200 " +
                  (showUniversal ? "rotate-180" : "")
                }
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showUniversal && (
              <div className="mt-2 space-y-3">
                {Object.entries(UNIVERSAL_TILES).map(([groupName, tiles]) => (
                  <div key={groupName}>
                    <span className="text-[9px] text-[#c9a96e]/40 uppercase tracking-[0.2em] block mb-1.5">
                      {groupName}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tiles.map((t) => (
                        <TileChip key={t.id} tile={t} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highlights textarea (preview) */}
          <div className="mb-5">
            <label className="text-[11px] text-gray-500 block mb-1.5">
              Høydepunkter
              <span className="text-gray-700 ml-1">(forhåndsvisning — redigerbar)</span>
            </label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Velg tiles ovenfor, eller skriv fritt: Sydvendt balkong, nyoppusset kjøkken..."
              rows={2}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors resize-none"
            />
            {selectedTiles.size > 0 && (
              <p className="text-[10px] text-gray-700 mt-1">
                {selectedTiles.size} valgt
              </p>
            )}
          </div>

          {/* Tone selector */}
          <div className="mb-6">
            <label className="text-[11px] text-gray-500 block mb-2.5">Tone</label>
            <div className="flex gap-2">
              {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={
                    "flex-1 py-2.5 px-3 rounded-lg text-center transition-all duration-200 " +
                    (tone === t
                      ? "bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[#c9a96e]"
                      : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]")
                  }
                >
                  <div className="text-[11px] font-semibold">{TONE_LABELS[t].label}</div>
                  <div className="text-[9px] mt-0.5 opacity-60">{TONE_LABELS[t].desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={() => handleGenerate()}
            disabled={!canSubmit || loading}
            className="w-full py-3 bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0e1a]/30 border-t-[#0a0e1a] rounded-full animate-spin" />
                Genererer...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                  />
                </svg>
                {versions.length > 0 ? "Generer fra scratch" : "Generer boligtekst"}
              </>
            )}
          </button>

          {error && <p className="text-sm text-red-400 mt-3 text-center">{error}</p>}
        </div>

        {/* Bottom tip */}
        <div className="mt-auto px-6 py-3 bg-white/[0.01] border-t border-white/[0.06] text-[10px] text-gray-600 tracking-wide">
          AI-generert &middot; Alltid kvalitetssjekk før publisering
        </div>
      </aside>

      {/* ── RIGHT: Output ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {versions.length === 0 && !loading ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-12">
            <div className="w-20 h-20 rounded-2xl bg-[#c9a96e]/[0.06] border border-[#c9a96e]/10 flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-[#c9a96e]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Klar til å skrive</h3>
            <p className="text-sm text-gray-500 max-w-sm text-center leading-relaxed">
              Fyll inn boligdetaljer til venstre og trykk{" "}
              <span className="text-[#c9a96e]">Generer boligtekst</span>. Du får en FINN-annonse,
              Instagram-caption og SMS — klar til bruk.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
              {[
                { icon: "🏠", title: "FINN-klar", desc: "Optimalisert for Norges største boligportal" },
                { icon: "📱", title: "Sosiale medier", desc: "Instagram-caption klar til publisering" },
                { icon: "💬", title: "SMS", desc: "Kort melding til potensielle kjøpere" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-[11px] font-semibold text-white mb-1">{f.title}</div>
                  <div className="text-[10px] text-gray-600 leading-snug">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Results (or streaming) */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Version pills + tab bar */}
            <div className="border-b border-white/[0.06]">
              {/* Version pills */}
              {versions.length > 1 && (
                <div className="px-6 pt-3 flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider mr-1">Versjon:</span>
                  {versions.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVersionId(v.id)}
                      className={
                        "px-2.5 py-1 text-[11px] rounded-md transition-all duration-200 " +
                        (activeVersionId === v.id
                          ? "bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30"
                          : "bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300")
                      }
                      title={v.feedback ? "Feedback: " + v.feedback : "Første generering"}
                    >
                      V{i + 1}
                      {v.feedback && (
                        <svg
                          className="w-2.5 h-2.5 inline ml-1 opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                  {loading && (
                    <div className="px-2.5 py-1 text-[11px] rounded-md bg-[#c9a96e]/10 text-[#c9a96e]/60 border border-[#c9a96e]/20 flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 border border-[#c9a96e]/40 border-t-[#c9a96e] rounded-full animate-spin" />
                      V{versions.length + 1}
                    </div>
                  )}
                </div>
              )}

              {/* Format tabs */}
              <div className="px-6 pt-3 pb-0 flex items-end gap-1">
                {[
                  { key: "finn" as const, label: "FINN-annonse", icon: "🏠" },
                  { key: "instagram" as const, label: "Instagram", icon: "📱" },
                  { key: "sms" as const, label: "SMS", icon: "💬" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={
                      "px-4 py-2.5 text-[12px] font-medium rounded-t-lg transition-all duration-200 " +
                      (activeTab === tab.key
                        ? "bg-white/[0.04] text-[#c9a96e] border border-white/[0.06] border-b-[#0a0e1a] -mb-px"
                        : "text-gray-500 hover:text-gray-300")
                    }
                  >
                    <span className="mr-1.5">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}

                {/* Copy button */}
                {activeVersion && !loading && (
                  <div className="ml-auto mb-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-[#c9a96e] hover:border-[#c9a96e]/20 transition-all"
                    >
                      {copied ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          Kopiert!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                            />
                          </svg>
                          Kopier tekst
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">
                {loading && !currentText ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="w-12 h-12 border-2 border-white/[0.06] border-t-[#c9a96e] rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium text-white mb-1">
                      {versions.length > 0 ? "Genererer ny versjon..." : "Skriver boligtekst..."}
                    </p>
                    <p className="text-xs text-gray-600">
                      AI analyserer detaljer og genererer tekst på norsk
                    </p>
                  </div>
                ) : displayText ? (
                  <>
                    {activeVersion?.feedback && (
                      <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-500">
                        <svg
                          className="w-3.5 h-3.5 text-[#c9a96e]/50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                        <span className="italic">&ldquo;{activeVersion.feedback}&rdquo;</span>
                      </div>
                    )}

                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
                        {displayText}
                        {loading && (
                          <span className="inline-block w-0.5 h-4 bg-[#c9a96e] animate-pulse ml-0.5 align-text-bottom" />
                        )}
                      </pre>
                    </div>

                    {!loading && (
                      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-600">
                        <span>
                          {displayText.split(/\s+/).filter(Boolean).length} ord &middot;{" "}
                          {displayText.length} tegn
                        </span>
                        <span>
                          V{versions.findIndex((v) => v.id === activeVersionId) + 1} &middot; Generert
                          av AI
                        </span>
                      </div>
                    )}
                  </>
                ) : null}

                {/* ── Feedback + Regenerate ── */}
                {!loading && versions.length > 0 && (
                  <div className="mt-6 border-t border-white/[0.06] pt-5">
                    <label className="text-[10px] text-[#c9a96e]/60 uppercase tracking-[0.2em] block mb-2">
                      Juster og generer ny versjon
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && feedback.trim() && handleRegenerate()}
                        placeholder="F.eks. &laquo;Mer fokus på utsikten&raquo; eller &laquo;Kortere innledning&raquo;"
                        className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
                      />
                      <button
                        onClick={handleRegenerate}
                        disabled={!feedback.trim()}
                        className="px-4 py-2.5 bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[#c9a96e] font-semibold rounded-lg text-sm hover:bg-[#c9a96e]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                          />
                        </svg>
                        Ny versjon
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-700 mt-2">
                      Skriv hva du vil endre, så lager AI en ny versjon basert på feedbacken din.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
