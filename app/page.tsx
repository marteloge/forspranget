"use client";

import { useState } from "react";
import Link from "next/link";
import { AUDIENCES } from "./data/boligtekst-tiles";

const ROLLE_OPTIONS = [
  "Selvstendig megler",
  "Kjedekontor (EIE, Privatmegleren, DNB, etc.)",
  "Meglerfullmektig / lærling",
  "Annet",
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Prospektering",
    desc: "Identifiser potensielle selgere i ditt område — før de havner på FINN. Kartverket-data møter intelligent analyse.",
    href: "/prospektering",
    badge: "Tilgjengelig nå",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    title: "AI Boligbeskrivelser",
    desc: "FINN-optimaliserte tekster på norsk. Skrevet på 3 minutter, ikke 30. Tilpasset norsk kjøpspsykologi.",
    href: "/boligtekst",
    badge: "Tilgjengelig nå",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    title: "Innhold til sosiale medier",
    desc: "Instagram, LinkedIn og TikTok — ferdig generert fra hvert salg. Konsistent tilstedeværelse uten ekstraarbeid.",
    badge: "Kommer snart",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    title: "SOI-CRM",
    desc: "Aldri glem en relasjon. Smarte påminnelser, bursdagsvarsel og kontaktoversikt — bygget for meglerens hverdag.",
    badge: "Kommer snart",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
    title: "Automatisk oppfølging",
    desc: "87 % av leads forsvinner uten oppfølging. Automatiske sekvenser for tapt budgiver, post-salg og Google-anmeldelser.",
    badge: "Kommer snart",
  },
];

const STATS = [
  { value: "3", unit: "min", label: "per boligbeskrivelse" },
  { value: "87", unit: "%", label: "av leads tapt uten oppfølging" },
  { value: "5 200", unit: "+", label: "norske meglere uten dette verktøyet" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rolle, setRolle] = useState("");
  const [by, setBy] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, rolle, by }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "already_registered") {
          setError("Du er allerede registrert — vi kontakter deg snart.");
        } else {
          setError("Noe gikk galt. Prøv igjen.");
        }
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white noise-bg overflow-hidden">
      {/* ── NAV ── */}
      <nav className="relative z-20 border-b border-white/[0.06] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-display tracking-wide">
              Forsp<span className="text-gold-gradient">ranget</span>
            </span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/prospektering"
              className="text-sm text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide"
            >
              Prospektering
            </Link>
            <Link
              href="/boligtekst"
              className="text-sm text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide"
            >
              Boligtekst
            </Link>
            <Link
              href="/blogg"
              className="text-sm text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide"
            >
              Blogg
            </Link>
            <a
              href="#venteliste"
              className="text-sm bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity tracking-wide"
            >
              Få tilgang
            </a>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Åpne meny"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0a0e1a] px-6 py-4 space-y-4">
            <Link href="/prospektering" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-400 hover:text-[#c9a96e] transition-colors py-2">Prospektering</Link>
            <Link href="/boligtekst" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-400 hover:text-[#c9a96e] transition-colors py-2">AI Boligtekst</Link>
            <Link href="/blogg" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-400 hover:text-[#c9a96e] transition-colors py-2">Blogg</Link>
            <a
              href="#venteliste"
              onClick={() => setMobileOpen(false)}
              className="block text-sm bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-5 py-3 rounded-lg text-center hover:opacity-90 transition-opacity"
            >
              Få tilgang
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#c9a96e]/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-[#c9a96e]/[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 bg-[#c9a96e]/[0.08] border border-[#c9a96e]/20 text-[#c9a96e] text-xs px-5 py-2 rounded-full mb-10 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-[#c9a96e] rounded-full animate-pulse" />
            Eksklusiv beta — begrenset tilgang
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up-delay-1 font-display text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8 leading-[0.95]">
            Gi deg selv
            <br />
            <span className="text-gold-gradient italic">forspranget</span>
          </h1>

          <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed font-light">
            AI-verktøyet bygget eksklusivt for norske eiendomsmeglere.
            <br className="hidden md:block" />
            Fra prospektering til oppfølging — på norsk, med norske regler.
          </p>

          <p className="animate-fade-in-up-delay-3 text-sm text-gray-600 max-w-lg mx-auto mb-16">
            ChatGPT forstår ikke budrunden. Follow Up Boss forstår ikke FINN.
            Forspranget er bygget for <em className="text-gray-400">deg</em>.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px max-w-2xl mx-auto mb-20 bg-white/[0.06] rounded-2xl overflow-hidden glow-gold">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#0a0e1a] p-8 text-center first:rounded-l-2xl last:rounded-r-2xl"
              >
                <div className="flex items-baseline justify-center gap-0.5 mb-2">
                  <span className="text-4xl md:text-5xl font-display text-gold-gradient">{s.value}</span>
                  <span className="text-lg text-[#c9a96e]/70 font-light">{s.unit}</span>
                </div>
                <div className="text-xs text-gray-500 tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {!submitted ? (
            <div id="venteliste" className="max-w-md mx-auto">
              <p className="text-xs text-gray-500 mb-5 tracking-widest uppercase">
                Begrenset til de 200 første meglerne
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Ditt fulle navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 transition-all text-sm tracking-wide"
                />
                <input
                  type="email"
                  placeholder="din@epost.no"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 transition-all text-sm tracking-wide"
                />
                <select
                  value={rolle}
                  onChange={(e) => setRolle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-sm tracking-wide focus:outline-none focus:border-[#c9a96e]/40 transition-all appearance-none"
                  style={{ color: rolle ? "white" : "rgb(75 85 99)" }}
                >
                  <option value="" disabled>Din rolle (valgfritt)</option>
                  {ROLLE_OPTIONS.map((r) => (
                    <option key={r} value={r} className="bg-[#0d1220] text-white">{r}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="By / kontor (valgfritt)"
                  value={by}
                  onChange={(e) => setBy(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/40 transition-all text-sm tracking-wide"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                >
                  {loading ? "Registrerer..." : "Sikre din plass"}
                </button>
                {error && (
                  <p className="text-sm text-[#c9a96e] text-center">{error}</p>
                )}
              </form>
              <p className="text-[11px] text-gray-700 mt-4 tracking-wide">
                Ingen spam. Kun eksklusiv invitasjon til beta.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-[#c9a96e]/[0.06] border border-[#c9a96e]/20 rounded-2xl p-10 glow-gold">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#c9a96e]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-display text-[#c9a96e] mb-2">
                Du er registrert.
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Vi kontakter deg personlig når beta er klar. Du er blant de første
                som får tilgang.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
      </div>

      {/* ── SNARVEIER ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-14">
        <p className="text-[10px] text-[#c9a96e]/50 tracking-[0.3em] uppercase mb-5 text-center">Tilgjengelig nå</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/boligtekst" className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-[#c9a96e]/30 hover:bg-[#c9a96e]/[0.03] transition-all duration-300 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#c9a96e]/[0.08] border border-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] flex-shrink-0 group-hover:bg-[#c9a96e]/[0.15] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold tracking-tight">AI Boligtekst</span>
                <span className="text-[9px] bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
              </div>
              <p className="text-sm text-gray-500 leading-snug">FINN-annonse, Instagram og SMS — på 3 minutter</p>
            </div>
            <svg className="w-5 h-5 text-[#c9a96e]/30 group-hover:text-[#c9a96e] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>

          <Link href="/prospektering" className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-[#c9a96e]/30 hover:bg-[#c9a96e]/[0.03] transition-all duration-300 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#c9a96e]/[0.08] border border-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] flex-shrink-0 group-hover:bg-[#c9a96e]/[0.15] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold tracking-tight">Prospektering</span>
                <span className="text-[9px] bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
              </div>
              <p className="text-sm text-gray-500 leading-snug">Finn potensielle selgere — før de havner på FINN</p>
            </div>
            <svg className="w-5 h-5 text-[#c9a96e]/30 group-hover:text-[#c9a96e] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
      </div>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        <div className="text-center mb-20">
          <p className="text-xs text-[#c9a96e]/60 tracking-[0.3em] uppercase mb-4">Plattformen</p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-5">
            Fem verktøy.{" "}
            <span className="text-gold-gradient italic">Ett forsprang.</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Hvert verktøy løser én konkret utfordring i meglerens hverdag.
            Sammen utgjør de en uslåelig fordel.
          </p>
        </div>

        <div className="space-y-4">
          {FEATURES.map((f, i) => {
            const inner = (
              <div
                className={`group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:border-[#c9a96e]/20 hover:bg-white/[0.03] transition-all duration-500 ${
                  "href" in f ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#c9a96e]/[0.08] border border-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] flex-shrink-0 group-hover:bg-[#c9a96e]/[0.12] transition-colors">
                    {f.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
                      <span
                        className={`text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                          f.badge === "Tilgjengelig nå"
                            ? "bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/20"
                            : "bg-white/[0.03] text-gray-600 border-white/[0.06]"
                        }`}
                      >
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xl">{f.desc}</p>
                  </div>

                  {/* Arrow for linked features */}
                  {"href" in f && (
                    <div className="text-[#c9a96e]/30 group-hover:text-[#c9a96e] transition-colors mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Subtle number */}
                <span className="absolute top-8 right-8 text-white/[0.03] font-display text-5xl select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            );

            if ("href" in f && f.href) {
              return <Link key={f.title} href={f.href}>{inner}</Link>;
            }
            return <div key={f.title}>{inner}</div>;
          })}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
      </div>

      {/* ── MÅLGRUPPE-TILES ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs text-[#c9a96e]/60 tracking-[0.3em] uppercase mb-4">Intelligent tilpasning</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-5">
            Skriv for de{" "}
            <span className="text-gold-gradient italic">rette kjøperne</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Velg målgruppe og AI tilpasser tone, fremhever riktige kvaliteter og treffer nerven.
            Barnefamilier får trygghet og skolekrets. Investorer får yield og utleiepotensial.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {AUDIENCES.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 text-sm hover:border-[#c9a96e]/20 hover:text-gray-300 transition-all duration-200"
            >
              <span className="text-xl">{a.emoji}</span>
              <span className="tracking-wide">{a.label}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/boligtekst"
            className="inline-flex items-center gap-2 text-sm text-[#c9a96e] hover:text-[#dfc090] transition-colors group"
          >
            Prøv målgruppe-tilpasning
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
      </div>

      {/* ── COMPARISON ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-xs text-[#c9a96e]/60 tracking-[0.3em] uppercase mb-4">Forskjellen</p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight">
            Før og etter{" "}
            <span className="text-gold-gradient italic">Forspranget</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Without */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-400 tracking-wide text-sm uppercase">Uten Forspranget</h3>
            </div>
            <ul className="space-y-4">
              {[
                "30 minutter per boligtekst",
                "Ingen systematisk prospektering",
                "SoMe-innhold sporadisk og stressende",
                "87 % av leads forsvinner",
                "ChatGPT forstår ikke norsk eiendom",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                  <span className="w-1 h-1 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="bg-[#c9a96e]/[0.04] border border-[#c9a96e]/15 rounded-2xl p-8 glow-gold">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#c9a96e] tracking-wide text-sm uppercase">Med Forspranget</h3>
            </div>
            <ul className="space-y-4">
              {[
                "3 minutter per boligtekst",
                "Finn potensielle selgere automatisk",
                "Ferdig innhold klart til publisering",
                "Automatisk oppfølging i 12 måneder",
                "AI som forstår FINN, budrunder og norsk lov",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="w-1 h-1 rounded-full bg-[#c9a96e] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
      </div>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c9a96e]/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <p className="text-xs text-[#c9a96e]/60 tracking-[0.3em] uppercase mb-6">Begrenset tilgang</p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-6 leading-tight">
            5 200 meglere i Norge.
            <br />
            <span className="text-gold-gradient italic">Hvem får forspranget?</span>
          </h2>
          <p className="text-gray-500 mb-10 text-sm">
            De første 200 meglerne får gratis tilgang til beta.
          </p>
          {!submitted && (
            <a
              href="#venteliste"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("venteliste")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity tracking-wide"
            >
              Sikre din plass
            </a>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.04] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Brand */}
            <div>
              <span className="font-display text-lg tracking-wide">
                Forsp<span className="text-gold-gradient">ranget</span>
              </span>
              <p className="text-xs text-gray-600 mt-2 max-w-xs leading-relaxed">
                AI-verktøy bygget eksklusivt for norske eiendomsmeglere.
                Norsk språk, norske regler.
              </p>
              <a
                href="mailto:hei@forspranget.no"
                className="text-xs text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors mt-3 block"
              >
                hei@forspranget.no
              </a>
            </div>

            {/* Links */}
            <div className="flex gap-16">
              <div>
                <p className="text-[10px] text-[#c9a96e]/50 uppercase tracking-[0.2em] mb-4">Verktøy</p>
                <ul className="space-y-2.5">
                  {[
                    { href: "/boligtekst", label: "AI Boligtekst" },
                    { href: "/prospektering", label: "Prospektering" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] text-[#c9a96e]/50 uppercase tracking-[0.2em] mb-4">Innhold</p>
                <ul className="space-y-2.5">
                  {[
                    { href: "/blogg", label: "Blogg" },
                    { href: "#venteliste", label: "Venteliste" },
                    { href: "/personvern", label: "Personvern" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-700 tracking-wide">
              &copy; 2026 Forspranget &middot; AI for norske eiendomsmeglere
            </p>
            <Link href="/personvern" className="text-[11px] text-gray-700 hover:text-[#c9a96e]/60 transition-colors tracking-wide">
              Personvernerklæring
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
