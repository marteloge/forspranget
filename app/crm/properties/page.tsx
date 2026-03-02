"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Property, PropertyType, PROPERTY_TYPE_LABELS, formatRelative } from "@/lib/crm-types";

interface AddressSuggestion {
  tekst: string;
  adressetekst?: string;
  gatenavn?: string;
  postnummer?: string;
  poststed?: string;
  lat?: number;
  lon?: number;
  kommunenavn?: string;
}

const PROPERTY_TYPES: PropertyType[] = ["apartment", "house", "cabin", "commercial", "land", "other"];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    const data = await fetch(`/api/crm/properties?${params}`).then((r) => r.json());
    setProperties(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-white">Adresser</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Ny adresse
        </button>
      </div>

      <input
        type="text"
        placeholder="Søk adresse, by, postnr..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
      />

      {!loading && (
        <p className="text-xs text-gray-600">{properties.length} adresse{properties.length !== 1 ? "r" : ""}</p>
      )}

      {loading ? (
        <div className="text-gray-600 text-sm py-10 text-center">Laster...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-3">🏠</div>
          <p className="text-gray-500 mb-4">Ingen adresser ennå</p>
          <button onClick={() => setShowAdd(true)} className="text-sm text-[#c9a96e] hover:text-[#dfc090] transition-colors">
            + Legg til din første adresse
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/crm/properties/${p.id}`}
              className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-[#c9a96e]/20 hover:bg-[#c9a96e]/[0.02] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#c9a96e]/[0.08] border border-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] flex-shrink-0 text-lg">
                {p.property_type === "apartment" ? "🏢" : p.property_type === "cabin" ? "🏡" : p.property_type === "commercial" ? "🏗️" : "🏠"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium group-hover:text-[#c9a96e] transition-colors truncate">
                    {p.address}
                  </span>
                  <span className="text-xs text-gray-600 flex-shrink-0">
                    {PROPERTY_TYPE_LABELS[p.property_type]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-600">
                  {p.postal_code && <span>{p.postal_code} {p.city}</span>}
                  {p.size_sqm && <span>· {p.size_sqm} m²</span>}
                  {p.estimated_value && <span>· {(p.estimated_value / 1_000_000).toFixed(1)} M</span>}
                </div>
              </div>

              <div className="text-right flex-shrink-0 space-y-0.5">
                {Number(p.contact_count) > 0 && (
                  <div className="text-xs text-gray-600">👤 {p.contact_count} kontakt{Number(p.contact_count) !== 1 ? "er" : ""}</div>
                )}
                {Number(p.event_count) > 0 && (
                  <div className="text-xs text-gray-600">📋 {p.event_count} events</div>
                )}
                {p.last_event_at && (
                  <div className="text-xs text-gray-700">{formatRelative(p.last_event_at)}</div>
                )}
              </div>

              <svg className="w-4 h-4 text-gray-700 group-hover:text-[#c9a96e] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {showAdd && (
        <AddPropertyModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); load(); }}
        />
      )}
    </div>
  );
}

function AddPropertyModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    address: "", postal_code: "", city: "",
    property_type: "apartment" as PropertyType,
    size_sqm: "", estimated_value: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Address search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedAddress(null);
    setForm((f) => ({ ...f, address: "", postal_code: "", city: "" }));
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (val.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/address-search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSuggestions(data.adresser || []);
        setShowSuggestions((data.adresser || []).length > 0);
      } catch { /* ignore */ }
    }, 300);
  };

  const handleSelectAddress = (s: AddressSuggestion) => {
    setSelectedAddress(s);
    setSearchQuery(s.tekst);
    setSuggestions([]);
    setShowSuggestions(false);
    setForm((f) => ({
      ...f,
      address: s.adressetekst || s.tekst,
      postal_code: s.postnummer || "",
      city: s.poststed || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/crm/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        size_sqm: form.size_sqm ? parseInt(form.size_sqm) : null,
        estimated_value: form.estimated_value ? parseInt(form.estimated_value.replace(/\s/g, "")) : null,
      }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Noe gikk galt"); setSaving(false); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1320] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white text-lg">Ny adresse</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Address search — vises bare når ingen adresse er valgt */}
          {!selectedAddress ? (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Søk adresse *</label>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Skriv gate og nummer..."
                  autoComplete="off"
                  autoFocus
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1220] border border-white/[0.12] rounded-lg overflow-hidden z-50 shadow-2xl">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => handleSelectAddress(s)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-[#c9a96e] transition-colors border-b border-white/[0.04] last:border-0 flex items-center gap-2"
                      >
                        <span className="text-[#c9a96e]/40 text-xs flex-shrink-0">📍</span>
                        <span className="truncate">{s.tekst}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length >= 3 && !showSuggestions && suggestions.length === 0 && (
                  <p className="text-[10px] text-gray-600 mt-1 px-1">Ingen treff — prøv et annet søk</p>
                )}
              </div>
            </div>
          ) : (
            /* Valgt adresse — vises som kort, ikke redigerbar */
            <div className="flex items-start gap-3 px-4 py-3 bg-[#c9a96e]/[0.06] border border-[#c9a96e]/25 rounded-xl">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-[#c9a96e]/15 flex items-center justify-center flex-shrink-0 text-sm">📍</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#c9a96e]/70 uppercase tracking-[0.15em] mb-0.5">Valgt adresse</p>
                <p className="text-sm text-white font-medium">{form.address}</p>
                <p className="text-xs text-gray-500 mt-0.5">{form.postal_code} {form.city}</p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedAddress(null); setSearchQuery(""); setForm(f => ({...f, address: "", postal_code: "", city: ""})); }}
                className="text-gray-600 hover:text-gray-300 transition-colors text-xs px-2 py-1 rounded hover:bg-white/[0.05] flex-shrink-0"
              >
                Endre
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.property_type} onChange={(e) => set("property_type", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm">
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Størrelse (m²)</label>
              <input value={form.size_sqm} onChange={(e) => set("size_sqm", e.target.value)} type="number"
                placeholder="72"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Est. verdi (kr)</label>
              <input value={form.estimated_value} onChange={(e) => set("estimated_value", e.target.value)}
                placeholder="4 200 000"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notater</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
              placeholder="Særtrekk, nabolag, historikk..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm resize-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white transition-colors text-sm">Avbryt</button>
            <button type="submit" disabled={saving || !selectedAddress}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {saving ? "Lagrer..." : "Lagre adresse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
