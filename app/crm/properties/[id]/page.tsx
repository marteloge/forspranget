"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Property, CrmEvent, Contact, PropertyType,
  ContactPropertyRelationship, ContactPropertyLink,
  PROPERTY_TYPE_LABELS, RELATIONSHIP_LABELS, STATUS_LABELS, STATUS_COLORS,
  EVENT_TYPES, getEventEmoji, getEventLabel,
  formatDate, formatRelative,
} from "@/lib/crm-types";

const PROPERTY_TYPES: PropertyType[] = ["apartment", "house", "cabin", "commercial", "land", "other"];
const RELATIONSHIPS: ContactPropertyRelationship[] = ["owner", "past_owner", "interested", "viewed", "bidder", "neighbor", "heir"];

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [events, setEvents] = useState<CrmEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const [p, e] = await Promise.all([
      fetch(`/api/crm/properties/${id}`).then((r) => r.json()),
      fetch(`/api/crm/events?property_id=${id}`).then((r) => r.json()),
    ]);
    setProperty(p.id ? p : null);
    setEvents(Array.isArray(e) ? e : []);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Slett denne adressen og all historikk?")) return;
    setDeleting(true);
    await fetch(`/api/crm/properties/${id}`, { method: "DELETE" });
    router.push("/crm/properties");
  };

  const unlinkContact = async (linkId: string) => {
    await fetch(`/api/crm/contact-properties/${linkId}`, { method: "DELETE" });
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-600 text-sm">Laster...</div>;
  if (!property) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Adresse ikke funnet</p>
      <Link href="/crm/properties" className="text-[#c9a96e] text-sm">← Tilbake</Link>
    </div>
  );

  const typeEmoji = property.property_type === "apartment" ? "🏢" : property.property_type === "cabin" ? "🏡" : property.property_type === "commercial" ? "🏗️" : "🏠";

  return (
    <div className="max-w-3xl space-y-5">
      <Link href="/crm/properties" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Adresser
      </Link>

      {/* Property header */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#c9a96e]/[0.08] border border-[#c9a96e]/15 flex items-center justify-center text-3xl flex-shrink-0">
              {typeEmoji}
            </div>
            <div>
              <h1 className="font-display text-2xl text-white">{property.address}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                {property.postal_code && <span>{property.postal_code} {property.city}</span>}
                <span>· {PROPERTY_TYPE_LABELS[property.property_type]}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="text-xs bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            + Logg aktivitet
          </button>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          {property.size_sqm && (
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Størrelse</div>
              <div className="text-sm text-white">{property.size_sqm} m²</div>
            </div>
          )}
          {property.estimated_value && (
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Estimert verdi</div>
              <div className="text-sm text-white">{property.estimated_value.toLocaleString("nb-NO")} kr</div>
            </div>
          )}
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Lagt til</div>
            <div className="text-sm text-white">{formatDate(property.created_at)}</div>
          </div>
        </div>

        {property.notes && (
          <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <div className="text-xs text-gray-600 mb-1">Notater</div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{property.notes}</p>
          </div>
        )}
      </div>

      {/* Linked contacts */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Tilknyttede kontakter</h2>
          <button
            onClick={() => setShowLinkModal(true)}
            className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors"
          >
            + Koble kontakt
          </button>
        </div>

        {!property.contacts?.length ? (
          <div className="text-center py-6">
            <p className="text-gray-600 text-sm mb-2">Ingen kontakter koblet ennå</p>
            <button onClick={() => setShowLinkModal(true)} className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors">
              Koble til eksisterende kontakt →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {property.contacts.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl group">
                <Link href={`/crm/contacts/${link.contact_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] text-xs font-display flex-shrink-0">
                    {link.first_name?.[0]}{link.last_name?.[0]}
                  </div>
                  <div>
                    <div className="text-sm text-white hover:text-[#c9a96e] transition-colors">
                      {link.first_name} {link.last_name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{RELATIONSHIP_LABELS[link.relationship as ContactPropertyRelationship]}</span>
                      {link.status && (
                        <span className={`px-1.5 py-0.5 rounded-full border text-[10px] ${STATUS_COLORS[link.status]}`}>
                          {STATUS_LABELS[link.status]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => unlinkContact(link.id)}
                  className="text-gray-700 hover:text-red-500 transition-colors text-sm opacity-0 group-hover:opacity-100 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event timeline */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Aktivitetslogg</h2>
          <button onClick={() => setShowEventModal(true)} className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors">
            + Logg aktivitet
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-sm mb-3">Ingen aktiviteter på denne adressen</p>
            <button onClick={() => setShowEventModal(true)} className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors">
              Logg første aktivitet →
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-white/[0.05]" />
            <div className="space-y-1">
              {events.map((e, i) => (
                <PropertyEventItem key={e.id} event={e} isFirst={i === 0} onDeleted={load} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Danger */}
      <div className="border border-red-900/20 rounded-xl p-4">
        <button onClick={handleDelete} disabled={deleting} className="text-xs text-red-600 hover:text-red-400 transition-colors disabled:opacity-50">
          {deleting ? "Sletter..." : "Slett adresse og all historikk"}
        </button>
      </div>

      {showEventModal && (
        <PropertyEventModal
          propertyId={id}
          propertyAddress={property.address}
          onClose={() => setShowEventModal(false)}
          onSaved={() => { setShowEventModal(false); load(); }}
        />
      )}
      {showLinkModal && (
        <LinkContactModal
          propertyId={id}
          onClose={() => setShowLinkModal(false)}
          onSaved={() => { setShowLinkModal(false); load(); }}
        />
      )}
    </div>
  );
}

function PropertyEventItem({ event: e, isFirst, onDeleted }: { event: CrmEvent; isFirst: boolean; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [hover, setHover] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Slett aktivitet?")) return;
    setDeleting(true);
    await fetch(`/api/crm/events/${e.id}`, { method: "DELETE" });
    onDeleted();
  };

  return (
    <div className="relative pl-12 pb-4 group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 ${isFirst ? "border-[#c9a96e] bg-[#c9a96e]/20" : "border-gray-700 bg-[#0a0e1a]"}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-base">{getEventEmoji(e.event_type)}</span>
            <span className="text-sm text-white font-medium">{getEventLabel(e.event_type)}</span>
            {e.first_name && (
              <Link href={`/crm/contacts/${e.contact_id}`} className="text-xs text-[#c9a96e]/70 hover:text-[#c9a96e] transition-colors">
                — {e.first_name} {e.last_name}
              </Link>
            )}
            <span className="text-xs text-gray-700 ml-auto">{formatRelative(e.completed_at)}</span>
          </div>
          {e.notes && (
            <p className="text-sm text-gray-400 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04] whitespace-pre-wrap">{e.notes}</p>
          )}
          {(e.next_action_date || e.next_action_note) && (
            <div className="mt-1.5 text-xs text-[#c9a96e]/70 flex items-center gap-1.5">
              <span>→</span>
              {e.next_action_date && <span>{new Date(e.next_action_date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}</span>}
              {e.next_action_note && <span className="text-gray-500">— {e.next_action_note}</span>}
            </div>
          )}
        </div>
        {(hover || deleting) && (
          <button onClick={handleDelete} disabled={deleting} className="text-gray-700 hover:text-red-500 transition-colors text-xs flex-shrink-0 mt-1">
            {deleting ? "..." : "×"}
          </button>
        )}
      </div>
    </div>
  );
}

function PropertyEventModal({ propertyId, propertyAddress, onClose, onSaved }: {
  propertyId: string; propertyAddress: string; onClose: () => void; onSaved: () => void;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState({
    event_type: "phone_call", contact_id: "", notes: "", outcome: "neutral",
    next_action_date: "", next_action_note: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/crm/contacts").then((r) => r.json()).then((data) => setContacts(Array.isArray(data) ? data : []));
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/crm/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        property_id: propertyId,
        address: propertyAddress,
        contact_id: form.contact_id || null,
      }),
    });
    onSaved();
  };

  const quickTypes = ["phone_call", "valuation", "private_viewing", "open_house", "note"];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1320] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white text-lg">Logg aktivitet</h2>
            <p className="text-xs text-gray-500 mt-0.5">{propertyAddress}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Type</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickTypes.map((t) => {
                const et = EVENT_TYPES.find((x) => x.value === t)!;
                return (
                  <button key={t} type="button" onClick={() => set("event_type", t)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.event_type === t ? "bg-[#c9a96e]/20 border-[#c9a96e]/40 text-[#c9a96e]" : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/[0.15]"
                    }`}>
                    {et?.emoji} {et?.label}
                  </button>
                );
              })}
            </div>
            <select value={form.event_type} onChange={(e) => set("event_type", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-400 focus:outline-none focus:border-[#c9a96e]/40 text-sm">
              {EVENT_TYPES.map((et) => <option key={et.value} value={et.value}>{et.emoji} {et.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Knyttet til kontakt (valgfritt)</label>
            <select value={form.contact_id} onChange={(e) => set("contact_id", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-400 focus:outline-none focus:border-[#c9a96e]/40 text-sm">
              <option value="">Ingen spesifikk kontakt</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-2 block">Utfall</label>
            <div className="flex gap-2">
              {[
                { v: "positive", l: "Positiv", c: "text-green-400 border-green-700/30 bg-green-900/20" },
                { v: "neutral", l: "Nøytralt", c: "text-gray-400 border-gray-700 bg-gray-800/50" },
                { v: "negative", l: "Negativ", c: "text-red-400 border-red-700/20 bg-red-900/10" },
                { v: "no_answer", l: "Ikke svar", c: "text-gray-600 border-gray-800 bg-gray-900/50" },
              ].map(({ v, l, c }) => (
                <button key={v} type="button" onClick={() => set("outcome", v)}
                  className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${form.outcome === v ? c : "text-gray-600 border-white/[0.06] bg-white/[0.02]"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notater</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
              placeholder="Hva skjedde? Hva ble sagt?"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm resize-none" />
          </div>

          <div className="bg-[#c9a96e]/[0.03] border border-[#c9a96e]/10 rounded-xl p-3 space-y-2">
            <label className="text-xs text-[#c9a96e]/60 block">Neste oppfølging</label>
            <input value={form.next_action_date} onChange={(e) => set("next_action_date", e.target.value)} type="date"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
            <input value={form.next_action_note} onChange={(e) => set("next_action_note", e.target.value)}
              placeholder='Eks: "Følg opp visningsinteressenter"'
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 text-sm" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white transition-colors text-sm">Avbryt</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold hover:opacity-90 disabled:opacity-50 text-sm">
              {saving ? "Lagrer..." : "💾 Logg"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LinkContactModal({ propertyId, onClose, onSaved }: { propertyId: string; onClose: () => void; onSaved: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactId, setContactId] = useState("");
  const [relationship, setRelationship] = useState<ContactPropertyRelationship>("interested");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/crm/contacts").then((r) => r.json()).then((data) => setContacts(Array.isArray(data) ? data : []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId) return;
    setSaving(true);
    await fetch(`/api/crm/properties/${propertyId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_id: contactId, relationship }),
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1320] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Koble kontakt</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Kontakt</label>
            <select value={contactId} onChange={(e) => setContactId(e.target.value)} required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm">
              <option value="">Velg kontakt...</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Relasjon</label>
            <select value={relationship} onChange={(e) => setRelationship(e.target.value as ContactPropertyRelationship)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/40 text-sm">
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{RELATIONSHIP_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white transition-colors text-sm">Avbryt</button>
            <button type="submit" disabled={saving || !contactId}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold hover:opacity-90 disabled:opacity-50 text-sm">
              {saving ? "Lagrer..." : "Koble til"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
