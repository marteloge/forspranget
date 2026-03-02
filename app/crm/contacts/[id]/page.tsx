"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Contact, CrmEvent, ContactStatus, ContactType, EventType,
  STATUS_LABELS, STATUS_COLORS, TYPE_LABELS,
  EVENT_TYPES, getEventEmoji, getEventLabel,
  formatDate, formatRelative, daysSince,
} from "@/lib/crm-types";

const STATUSES: ContactStatus[] = ["cold", "warm", "hot", "active", "won", "lost"];
const TYPES: ContactType[] = ["seller", "buyer", "investor", "heir", "renter", "unknown"];

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [events, setEvents] = useState<CrmEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadContact = useCallback(async () => {
    const [c, e] = await Promise.all([
      fetch(`/api/crm/contacts/${id}`).then((r) => r.json()),
      fetch(`/api/crm/events?contact_id=${id}`).then((r) => r.json()),
    ]);
    setContact(c.id ? c : null);
    setEvents(Array.isArray(e) ? e : []);
    setLoading(false);
  }, [id]);

  useEffect(() => { loadContact(); }, [loadContact]);

  const handleDelete = async () => {
    if (!confirm("Slett denne kontakten og all historikk? Dette kan ikke angres.")) return;
    setDeleting(true);
    await fetch(`/api/crm/contacts/${id}`, { method: "DELETE" });
    router.push("/crm/contacts");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-600 text-sm">Laster...</div>;
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Kontakt ikke funnet</p>
        <Link href="/crm/contacts" className="text-[#c9a96e] text-sm">← Tilbake</Link>
      </div>
    );
  }

  const daysSinceContact = daysSince(events[0]?.completed_at ?? contact.created_at);
  const isOverdue = contact.next_contact && new Date(contact.next_contact) <= new Date();

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back */}
      <Link href="/crm/contacts" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Kontakter
      </Link>

      {/* Contact header card */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] font-display text-xl flex-shrink-0">
              {contact.first_name[0]}{contact.last_name?.[0] ?? ""}
            </div>
            <div>
              <h1 className="font-display text-2xl text-white">
                {contact.first_name} {contact.last_name}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[contact.status]}`}>
                  {STATUS_LABELS[contact.status]}
                </span>
                {contact.type !== "unknown" && (
                  <span className="text-xs text-gray-500">{TYPE_LABELS[contact.type]}</span>
                )}
                {contact.source && (
                  <span className="text-xs text-gray-600">· {contact.source}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 border border-white/[0.06] rounded-lg hover:border-white/[0.15]"
            >
              Rediger
            </button>
            <button
              onClick={() => setShowEventModal(true)}
              className="text-xs bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              + Logg aktivitet
            </button>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="group">
              <div className="text-xs text-gray-600 mb-0.5">Telefon</div>
              <div className="text-sm text-white group-hover:text-[#c9a96e] transition-colors">{contact.phone}</div>
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="group">
              <div className="text-xs text-gray-600 mb-0.5">E-post</div>
              <div className="text-sm text-white group-hover:text-[#c9a96e] transition-colors truncate">{contact.email}</div>
            </a>
          )}
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Siste kontakt</div>
            <div className="text-sm text-white">
              {daysSinceContact > 9999 ? "Aldri" : formatRelative(events[0]?.completed_at ?? contact.created_at)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Lagt til</div>
            <div className="text-sm text-white">{formatDate(contact.created_at)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Antall aktiviteter</div>
            <div className="text-sm text-white">{events.length}</div>
          </div>
        </div>

        {/* Next contact */}
        {contact.next_contact && (
          <div className={`mt-4 p-3 rounded-lg border text-sm ${
            isOverdue
              ? "bg-orange-900/20 border-orange-500/20 text-orange-400"
              : "bg-white/[0.02] border-white/[0.06] text-gray-400"
          }`}>
            {isOverdue ? "🔔 " : "📅 "}
            {isOverdue ? "Planlagt oppfølging: " : "Neste kontakt: "}
            <span className="font-medium text-white">{formatDate(contact.next_contact)}</span>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <div className="text-xs text-gray-600 mb-1">Notater</div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}

        {/* Inactive warning */}
        {daysSinceContact > 365 && contact.status !== "won" && contact.status !== "lost" && (
          <div className="mt-3 text-xs text-yellow-600 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Ingen kontakt på {Math.floor(daysSinceContact / 30)} måneder — vurder å nå ut</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Aktivitetslogg</h2>
          <button
            onClick={() => setShowEventModal(true)}
            className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors"
          >
            + Logg aktivitet
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-sm mb-3">Ingen aktiviteter ennå</p>
            <button
              onClick={() => setShowEventModal(true)}
              className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors"
            >
              Logg din første interaksjon →
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-white/[0.05]" />

            <div className="space-y-1">
              {events.map((e, i) => (
                <EventItem key={e.id} event={e} isFirst={i === 0} onDeleted={loadContact} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="border border-red-900/20 rounded-xl p-4">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-red-600 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {deleting ? "Sletter..." : "Slett kontakt og all historikk"}
        </button>
      </div>

      {/* Modals */}
      {showEventModal && (
        <LogEventModal
          contactId={id}
          onClose={() => setShowEventModal(false)}
          onSaved={() => { setShowEventModal(false); loadContact(); }}
        />
      )}
      {showEditModal && (
        <EditContactModal
          contact={contact}
          onClose={() => setShowEditModal(false)}
          onSaved={() => { setShowEditModal(false); loadContact(); }}
        />
      )}
    </div>
  );
}

function EventItem({ event: e, isFirst, onDeleted }: { event: CrmEvent; isFirst: boolean; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Slett denne aktiviteten?")) return;
    setDeleting(true);
    await fetch(`/api/crm/events/${e.id}`, { method: "DELETE" });
    onDeleted();
  };

  const outcomeColor = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-gray-500",
    no_answer: "text-gray-600",
  }[e.outcome] ?? "text-gray-500";

  const outcomeLabel = {
    positive: "Positivt",
    negative: "Negativt",
    neutral: "Nøytralt",
    no_answer: "Ikke svar",
  }[e.outcome] ?? "";

  return (
    <div
      className="relative pl-12 pb-4 group"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Timeline dot */}
      <div className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 flex items-center justify-center ${
        isFirst ? "border-[#c9a96e] bg-[#c9a96e]/20" : "border-gray-700 bg-[#0a0e1a]"
      }`} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Event type + time */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{getEventEmoji(e.event_type)}</span>
            <span className="text-sm text-white font-medium">{getEventLabel(e.event_type)}</span>
            {e.address && (
              <span className="text-xs text-gray-500">— {e.address}</span>
            )}
            <span className={`text-xs ${outcomeColor}`}>{outcomeLabel}</span>
            <span className="text-xs text-gray-700 ml-auto">{formatRelative(e.completed_at)}</span>
          </div>

          {/* Notes */}
          {e.notes && (
            <p className="text-sm text-gray-400 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04] whitespace-pre-wrap">
              {e.notes}
            </p>
          )}

          {/* Next action */}
          {(e.next_action_date || e.next_action_note) && (
            <div className="mt-1.5 text-xs text-[#c9a96e]/70 flex items-center gap-1.5">
              <span>→</span>
              {e.next_action_date && (
                <span>Ring igjen: {new Date(e.next_action_date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}</span>
              )}
              {e.next_action_note && <span className="text-gray-500">— {e.next_action_note}</span>}
            </div>
          )}
        </div>

        {/* Delete */}
        {(showDelete || deleting) && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-gray-700 hover:text-red-500 transition-colors text-xs flex-shrink-0 mt-1"
          >
            {deleting ? "..." : "×"}
          </button>
        )}
      </div>
    </div>
  );
}

function LogEventModal({ contactId, onClose, onSaved }: { contactId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    event_type: "phone_call" as EventType,
    address: "", notes: "", outcome: "neutral",
    next_action_date: "", next_action_note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/crm/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, contact_id: contactId }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Noe gikk galt");
      setSaving(false);
      return;
    }
    onSaved();
  };

  // Quick type buttons (most common)
  const quickTypes: EventType[] = ["phone_call", "no_answer", "valuation", "private_viewing", "note"];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1320] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white text-lg">Logg aktivitet</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick type selector */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Type</label>
            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2 mb-2">
              {quickTypes.map((t) => {
                const et = EVENT_TYPES.find((x) => x.value === t)!;
                return (
                  <button
                    key={t} type="button"
                    onClick={() => set("event_type", t)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.event_type === t
                        ? "bg-[#c9a96e]/20 border-[#c9a96e]/40 text-[#c9a96e]"
                        : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/[0.15]"
                    }`}
                  >
                    {et.emoji} {et.label}
                  </button>
                );
              })}
            </div>
            {/* Full dropdown */}
            <select
              value={form.event_type}
              onChange={(e) => set("event_type", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-400 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
            >
              {EVENT_TYPES.map((et) => (
                <option key={et.value} value={et.value}>{et.emoji} {et.label}</option>
              ))}
            </select>
          </div>

          {/* Adresse (valgfritt) */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Adresse (valgfritt)</label>
            <input
              value={form.address} onChange={(e) => set("address", e.target.value)}
              placeholder="Storgata 5, Oslo"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
            />
          </div>

          {/* Utfall */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Utfall</label>
            <div className="flex gap-2">
              {[
                { v: "positive", l: "Positiv", c: "text-green-400 border-green-700/30 bg-green-900/20" },
                { v: "neutral", l: "Nøytralt", c: "text-gray-400 border-gray-700 bg-gray-800/50" },
                { v: "negative", l: "Negativ", c: "text-red-400 border-red-700/20 bg-red-900/10" },
                { v: "no_answer", l: "Ikke svar", c: "text-gray-600 border-gray-800 bg-gray-900/50" },
              ].map(({ v, l, c }) => (
                <button
                  key={v} type="button"
                  onClick={() => set("outcome", v)}
                  className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${
                    form.outcome === v ? c : "text-gray-600 border-white/[0.06] bg-white/[0.02]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Notater */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notater</label>
            <textarea
              value={form.notes} onChange={(e) => set("notes", e.target.value)}
              placeholder="Hva ble sagt? Hva skjer videre?"
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm resize-none"
            />
          </div>

          {/* Neste oppfølging */}
          <div className="bg-[#c9a96e]/[0.03] border border-[#c9a96e]/10 rounded-xl p-3 space-y-2">
            <label className="text-xs text-[#c9a96e]/60 block">Neste oppfølging</label>
            <input
              value={form.next_action_date} onChange={(e) => set("next_action_date", e.target.value)}
              type="date"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm"
            />
            <input
              value={form.next_action_note} onChange={(e) => set("next_action_note", e.target.value)}
              placeholder='Eks: "Spør om de har bestemt seg"'
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm"
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
              {saving ? "Lagrer..." : "💾 Logg aktivitet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditContactModal({ contact, onClose, onSaved }: { contact: Contact; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    first_name: contact.first_name,
    last_name: contact.last_name,
    phone: contact.phone,
    email: contact.email,
    status: contact.status,
    type: contact.type,
    source: contact.source,
    notes: contact.notes,
    next_contact: contact.next_contact?.split("T")[0] ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/crm/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, next_contact: form.next_contact || null }),
    });
    onSaved();
  };

  const SOURCES = ["Finn.no", "Visning", "Naboen", "Kaldt anrop", "Sosialt", "Anbefaling", "Annet"];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1320] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white text-lg">Rediger kontakt</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Fornavn</label>
              <input value={form.first_name} onChange={(e) => set("first_name", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Etternavn</label>
              <input value={form.last_name} onChange={(e) => set("last_name", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefon</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">E-post</label>
              <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm">
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kilde</label>
              <select value={form.source} onChange={(e) => set("source", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-400 focus:outline-none focus:border-[#c9a96e]/40 text-sm">
                <option value="">Velg kilde</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ring igjen</label>
              <input value={form.next_contact} onChange={(e) => set("next_contact", e.target.value)} type="date"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notater</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white transition-colors text-sm">
              Avbryt
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold hover:opacity-90 disabled:opacity-50 text-sm">
              {saving ? "Lagrer..." : "Lagre endringer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
