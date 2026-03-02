"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Contact, ContactStatus, ContactType,
  STATUS_LABELS, STATUS_COLORS, TYPE_LABELS,
  formatRelative, daysSince,
} from "@/lib/crm-types";

const STATUSES: ContactStatus[] = ["cold", "warm", "hot", "active", "won", "lost"];
const TYPES: ContactType[] = ["seller", "buyer", "investor", "heir", "renter", "unknown"];
const SOURCES = ["Finn.no", "Visning", "Naboen", "Kaldt anrop", "Sosialt", "Anbefaling", "Annet"];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContactStatus | "">("");
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (filterStatus) params.set("status", filterStatus);
    const data = await fetch(`/api/crm/contacts?${params}`).then((r) => r.json());
    setContacts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-white">Kontakter</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Ny kontakt
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Søk navn, telefon, epost..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ContactStatus | "")}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-400 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
        >
          <option value="">Alle statuser</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-gray-600">
          {contacts.length} kontakt{contacts.length !== 1 ? "er" : ""}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="text-gray-600 text-sm py-10 text-center">Laster...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-3">📇</div>
          <p className="text-gray-500 mb-4">Ingen kontakter funnet</p>
          <button
            onClick={() => setShowAdd(true)}
            className="text-sm text-[#c9a96e] hover:text-[#dfc090] transition-colors"
          >
            + Legg til din første kontakt
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <Link
              key={c.id}
              href={`/crm/contacts/${c.id}`}
              className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-[#c9a96e]/20 hover:bg-[#c9a96e]/[0.02] transition-all group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] font-display text-sm flex-shrink-0">
                {c.first_name[0]}{c.last_name?.[0] ?? ""}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium group-hover:text-[#c9a96e] transition-colors">
                    {c.first_name} {c.last_name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]}`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                  {c.type !== "unknown" && (
                    <span className="text-xs text-gray-600">{TYPE_LABELS[c.type]}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-600">
                  {c.phone && <span>{c.phone}</span>}
                  {c.email && <span>{c.email}</span>}
                  {c.source && <span>· {c.source}</span>}
                </div>
              </div>

              {/* Right side */}
              <div className="text-right flex-shrink-0">
                {c.next_contact && new Date(c.next_contact) <= new Date() ? (
                  <div className="text-xs text-orange-400">🔔 Ring i dag</div>
                ) : c.next_contact ? (
                  <div className="text-xs text-gray-500">
                    Ring: {new Date(c.next_contact).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
                  </div>
                ) : null}
                <div className="text-xs text-gray-700 mt-0.5">
                  {c.last_event_at
                    ? `Sist: ${formatRelative(c.last_event_at)}`
                    : c.event_count === 0 || c.event_count === undefined
                    ? `Lagt til ${formatRelative(c.created_at)}`
                    : null}
                </div>
                {c.event_count !== undefined && Number(c.event_count) > 0 && (
                  <div className="text-xs text-gray-700">{c.event_count} events</div>
                )}
                {daysSince(c.last_event_at ?? c.created_at) > 365 && c.status !== "won" && c.status !== "lost" && (
                  <div className="text-xs text-yellow-600 mt-0.5">⚠️ Inaktiv</div>
                )}
              </div>

              <svg className="w-4 h-4 text-gray-700 group-hover:text-[#c9a96e] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {/* Add contact modal */}
      {showAdd && (
        <AddContactModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); load(); }}
        />
      )}
    </div>
  );
}

function AddContactModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", email: "",
    status: "cold" as ContactStatus, type: "unknown" as ContactType,
    source: "", notes: "", next_contact: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/crm/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Noe gikk galt");
      setSaving(false);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1320] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white text-lg">Ny kontakt</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Fornavn *</label>
              <input
                value={form.first_name} onChange={(e) => set("first_name", e.target.value)}
                required placeholder="Fornavn"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Etternavn</label>
              <input
                value={form.last_name} onChange={(e) => set("last_name", e.target.value)}
                placeholder="Etternavn"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefon</label>
              <input
                value={form.phone} onChange={(e) => set("phone", e.target.value)}
                placeholder="+47 900 00 000" type="tel"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">E-post</label>
              <input
                value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="navn@epost.no" type="email"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select
                value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select
                value={form.type} onChange={(e) => set("type", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              >
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kilde</label>
              <select
                value={form.source} onChange={(e) => set("source", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-400 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              >
                <option value="">Velg kilde</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ring igjen</label>
              <input
                value={form.next_contact} onChange={(e) => set("next_contact", e.target.value)}
                type="date"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notater</label>
            <textarea
              value={form.notes} onChange={(e) => set("notes", e.target.value)}
              placeholder="Første inntrykk, bakgrunn, hva de leter etter..."
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white transition-colors text-sm">
              Avbryt
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {saving ? "Lagrer..." : "Lagre kontakt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
