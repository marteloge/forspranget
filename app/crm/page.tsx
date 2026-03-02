"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Contact, CrmEvent,
  STATUS_LABELS, STATUS_COLORS,
  getEventEmoji, getEventLabel,
  formatRelative, formatDate, daysSince,
} from "@/lib/crm-types";

export default function CrmDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<CrmEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/crm/contacts").then((r) => r.json()),
      fetch("/api/crm/events?limit=10").then((r) => r.json()),
    ]).then(([c, e]) => {
      setContacts(Array.isArray(c) ? c : []);
      setEvents(Array.isArray(e) ? e : []);
      setLoading(false);
    });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ring i dag: next_contact <= today
  const ringIdag = contacts.filter((c) => {
    if (!c.next_contact) return false;
    return new Date(c.next_contact) <= today;
  });

  // Smarte forslag: ingen kontakt på 12+ måneder og status warm/hot
  const varmeGlemte = contacts.filter((c) => {
    if (c.status === "won" || c.status === "lost") return false;
    const days = daysSince(c.last_event_at ?? c.created_at);
    return days > 365 && (c.status === "warm" || c.status === "hot");
  });

  // Kalde leads: ingen kontakt på 24+ måneder
  const kaldeOld = contacts.filter((c) => {
    if (c.status === "won" || c.status === "lost") return false;
    const days = daysSince(c.last_event_at ?? c.created_at);
    return days > 730 && c.status === "cold";
  }).slice(0, 3);

  // Pipeline counts
  const pipeline = {
    cold: contacts.filter((c) => c.status === "cold").length,
    warm: contacts.filter((c) => c.status === "warm").length,
    hot: contacts.filter((c) => c.status === "hot").length,
    active: contacts.filter((c) => c.status === "active").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-sm">Laster...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/crm/contacts"
          className="text-sm bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Ny kontakt
        </Link>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Kalde", count: pipeline.cold, color: "text-gray-400" },
          { label: "Lunken", count: pipeline.warm, color: "text-yellow-400" },
          { label: "Varm", count: pipeline.hot, color: "text-orange-400" },
          { label: "Aktiv", count: pipeline.active, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className={`text-2xl font-display ${s.color}`}>{s.count}</div>
            <div className="text-xs text-gray-600 mt-1 tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ring i dag */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔔</span>
            <h2 className="font-semibold text-white">Ring i dag</h2>
            {ringIdag.length > 0 && (
              <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                {ringIdag.length}
              </span>
            )}
          </div>
          {ringIdag.length === 0 ? (
            <p className="text-gray-600 text-sm">Ingen planlagte samtaler i dag 🎉</p>
          ) : (
            <ul className="space-y-2">
              {ringIdag.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/crm/contacts/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-[#c9a96e]/20 hover:bg-[#c9a96e]/[0.02] transition-all group"
                  >
                    <div>
                      <div className="text-white text-sm font-medium group-hover:text-[#c9a96e] transition-colors">
                        {c.first_name} {c.last_name}
                      </div>
                      <div className="text-gray-600 text-xs mt-0.5">
                        {c.next_contact && formatDate(c.next_contact)}
                        {c.phone && <span className="ml-2">· {c.phone}</span>}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Siste aktivitet */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⏱️</span>
            <h2 className="font-semibold text-white">Siste aktivitet</h2>
          </div>
          {events.length === 0 ? (
            <p className="text-gray-600 text-sm">Ingen aktiviteter ennå.</p>
          ) : (
            <ul className="space-y-2">
              {events.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/crm/contacts/${e.contact_id}`}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.03] transition-all group"
                  >
                    <span className="text-base mt-0.5 flex-shrink-0">{getEventEmoji(e.event_type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                        {getEventLabel(e.event_type)}
                        {e.first_name && (
                          <span className="text-gray-500 ml-1.5">— {e.first_name} {e.last_name}</span>
                        )}
                      </div>
                      {e.notes && (
                        <div className="text-xs text-gray-600 mt-0.5 truncate">{e.notes}</div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 flex-shrink-0">{formatRelative(e.completed_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Smarte forslag */}
      {(varmeGlemte.length > 0 || kaldeOld.length > 0) && (
        <div className="bg-[#c9a96e]/[0.03] border border-[#c9a96e]/15 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💡</span>
            <h2 className="font-semibold text-[#c9a96e]">Smarte forslag</h2>
          </div>
          <div className="space-y-3">
            {varmeGlemte.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <div>
                  <span className="text-white text-sm font-medium">{c.first_name} {c.last_name}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    — ingen kontakt på {Math.floor(daysSince(c.last_event_at ?? c.created_at) / 30)} mnd
                  </span>
                </div>
                <Link
                  href={`/crm/contacts/${c.id}`}
                  className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors"
                >
                  Ring →
                </Link>
              </div>
            ))}
            {kaldeOld.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <div>
                  <span className="text-white text-sm font-medium">{c.first_name} {c.last_name}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    — gammel kald lead ({Math.floor(daysSince(c.last_event_at ?? c.created_at) / 365)} år siden)
                  </span>
                </div>
                <Link
                  href={`/crm/contacts/${c.id}`}
                  className="text-xs text-[#c9a96e] hover:text-[#dfc090] transition-colors"
                >
                  Prøv igjen →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">📇</div>
          <p className="text-lg text-gray-500 mb-2">Ingen kontakter ennå</p>
          <p className="text-sm mb-6">Legg til din første lead og begynn å bygge din relasjonsdatabase.</p>
          <Link
            href="/crm/contacts"
            className="inline-block bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            + Legg til kontakt
          </Link>
        </div>
      )}
    </div>
  );
}
