"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Property, PropertyType, PROPERTY_TYPE_LABELS, formatRelative } from "@/lib/crm-types";

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

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Adresse *</label>
            <input value={form.address} onChange={(e) => set("address", e.target.value)} required
              placeholder="Storgata 5"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Postnummer</label>
              <input value={form.postal_code} onChange={(e) => set("postal_code", e.target.value)}
                placeholder="0182"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">By</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)}
                placeholder="Oslo"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
          </div>

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
                placeholder="4200000"
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
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold hover:opacity-90 disabled:opacity-50 text-sm">
              {saving ? "Lagrer..." : "Lagre adresse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
