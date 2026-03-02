"use client";

import { useState } from "react";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface GeneratedText {
  finn: string;
  instagram: string;
  sms: string;
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

  // Output state
  const [result, setResult] = useState<GeneratedText | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"finn" | "instagram" | "sms">("finn");
  const [copied, setCopied] = useState(false);

  const canSubmit = address.trim() && sqm.trim();

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          boligtype,
          sqm: Number(sqm),
          rooms: Number(rooms) || undefined,
          floor: floor || undefined,
          buildYear: Number(buildYear) || undefined,
          highlights,
          notes,
          tone,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Noe gikk galt. Prøv igjen.");
      }

      const data = await res.json();
      setResult(data);
      setActiveTab("finn");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noe gikk galt.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = activeTab === "finn" ? result.finn : activeTab === "instagram" ? result.instagram : result.sms;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                  <option key={t} value={t}>{t}</option>
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

          {/* Highlights */}
          <div className="mb-4">
            <label className="text-[11px] text-gray-500 block mb-1.5">
              Høydepunkter
              <span className="text-gray-700 ml-1">(utsikt, balkong, nytt bad...)</span>
            </label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Sydvendt balkong, nyoppusset kjøkken 2024, peis i stuen, utsikt mot Oslofjorden"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors resize-none"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-[11px] text-gray-500 block mb-1.5">
              Egne notater
              <span className="text-gray-700 ml-1">(visningsinntrykk, nabolag...)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Rolig gate, nær Birkelunden park. Mange barnefamilier i området. Leiligheten har sjarm og originale detaljer."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors resize-none"
            />
          </div>

          {/* Tone selector */}
          <div className="mb-6">
            <label className="text-[11px] text-gray-500 block mb-2.5">Tone</label>
            <div className="flex gap-2">
              {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all duration-200 ${
                    tone === t
                      ? "bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[#c9a96e]"
                      : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]"
                  }`}
                >
                  <div className="text-[11px] font-semibold">{TONE_LABELS[t].label}</div>
                  <div className="text-[9px] mt-0.5 opacity-60">{TONE_LABELS[t].desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                Generer boligtekst
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-red-400 mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Bottom tip */}
        <div className="mt-auto px-6 py-3 bg-white/[0.01] border-t border-white/[0.06] text-[10px] text-gray-600 tracking-wide">
          AI-generert &middot; Alltid kvalitetssjekk før publisering
        </div>
      </aside>

      {/* ── RIGHT: Output ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!result && !loading ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-12">
            <div className="w-20 h-20 rounded-2xl bg-[#c9a96e]/[0.06] border border-[#c9a96e]/10 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#c9a96e]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Klar til å skrive</h3>
            <p className="text-sm text-gray-500 max-w-sm text-center leading-relaxed">
              Fyll inn boligdetaljer til venstre og trykk <span className="text-[#c9a96e]">Generer boligtekst</span>.
              Du får en FINN-annonse, Instagram-caption og SMS — klar til bruk.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
              {[
                { icon: "🏠", title: "FINN-klar", desc: "Optimalisert for Norges største boligportal" },
                { icon: "📱", title: "Sosiale medier", desc: "Instagram-caption klar til publisering" },
                { icon: "💬", title: "SMS", desc: "Kort melding til potensielle kjøpere" },
              ].map((f) => (
                <div key={f.title} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-[11px] font-semibold text-white mb-1">{f.title}</div>
                  <div className="text-[10px] text-gray-600 leading-snug">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : loading ? (
          /* Loading state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 border-2 border-white/[0.06] border-t-[#c9a96e] rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-white mb-1">Skriver boligtekst...</p>
            <p className="text-xs text-gray-600">AI analyserer detaljer og genererer tekst på norsk</p>
          </div>
        ) : result ? (
          /* Results */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="border-b border-white/[0.06] px-6 pt-4 flex items-end gap-1">
              {([
                { key: "finn" as const, label: "FINN-annonse", icon: "🏠" },
                { key: "instagram" as const, label: "Instagram", icon: "📱" },
                { key: "sms" as const, label: "SMS", icon: "💬" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-[12px] font-medium rounded-t-lg transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-white/[0.04] text-[#c9a96e] border border-white/[0.06] border-b-[#0a0e1a] -mb-px"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}

              {/* Copy button */}
              <div className="ml-auto mb-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-[#c9a96e] hover:border-[#c9a96e]/20 transition-all"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                      </svg>
                      Kopier tekst
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
                    {activeTab === "finn" && result.finn}
                    {activeTab === "instagram" && result.instagram}
                    {activeTab === "sms" && result.sms}
                  </pre>
                </div>

                {/* Word count */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-gray-600">
                  <span>
                    {(() => {
                      const text = activeTab === "finn" ? result.finn : activeTab === "instagram" ? result.instagram : result.sms;
                      const words = text.split(/\s+/).filter(Boolean).length;
                      const chars = text.length;
                      return `${words} ord · ${chars} tegn`;
                    })()}
                  </span>
                  <span>Generert av AI · Kvalitetssjekk anbefalt</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
