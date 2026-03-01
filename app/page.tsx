"use client";

import { useState } from "react";

const FEATURES = [
  {
    icon: "🔍",
    title: "Finn potensielle selgere",
    desc: "Se hvem i ditt område som ikke har solgt på 15+ år — FØR de legger ut på FINN.",
  },
  {
    icon: "✍️",
    title: "Boligtekst på 3 minutter",
    desc: "FINN-optimaliserte beskrivelser på norsk. Ikke 30 min. Ikke 5 min. 3 minutter.",
  },
  {
    icon: "📱",
    title: "SoMe-innhold klart til posting",
    desc: "Instagram, TikTok og LinkedIn-tekster generert automatisk fra hvert salg.",
  },
  {
    icon: "🤝",
    title: "SOI-CRM for meglere",
    desc: "Hold styr på alle relasjoner. Smart påminning når noen er klar til å selge.",
  },
  {
    icon: "🔔",
    title: "Oppfølging som faktisk skjer",
    desc: "87% av leads forsvinner pga. manglende oppfølging. Ikke hos deg.",
  },
];

const STATS = [
  { value: "3 min", label: "å skrive én boligtekst" },
  { value: "87%", label: "av leads går tapt uten oppfølging" },
  { value: "5 200+", label: "norske meglere — ingen har dette ennå" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "already_registered") {
          setError("Denne e-postadressen er allerede på ventelisten! 🎉");
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
    <main className="min-h-screen bg-[#0f1629] text-white">
      {/* NAV */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">
              Forsp<span className="text-green-400">ranget</span>
            </span>
            <span className="text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded-full">
              Beta kommer snart
            </span>
          </div>
          <a
            href="#venteliste"
            className="text-sm bg-green-400 text-[#0f1629] font-semibold px-4 py-2 rounded-lg hover:bg-green-300 transition-colors"
          >
            Få tidlig tilgang →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 text-green-400 text-sm px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Norges første AI-verktøy bygget spesifikt for norske meglere
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-balance">
          Gi deg selv{" "}
          <span className="text-green-400 relative">
            forspranget
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M2 8c80-6 160-6 296 0"
                stroke="#4ade80"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          .
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-4 text-balance">
          AI-assistenten norske eiendomsmeglere har ventet på.
        </p>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-12 text-balance">
          ChatGPT forstår ikke budrunden. Follow Up Boss forstår ikke FINN.
          Forspranget er bygget for <em>norske</em> meglere — på norsk, med
          norske regler.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-3xl font-black text-green-400 mb-1">
                {s.value}
              </div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {!submitted ? (
          <div id="venteliste" className="max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-4">
              Bli med de <strong className="text-white">200 første</strong> —
              gratis beta-tilgang
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Ditt navn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
              />
              <input
                type="email"
                placeholder="din@epost.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-400 text-[#0f1629] font-bold py-3 rounded-xl hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registrerer..." : "Ja, jeg vil ha tidlig tilgang →"}
              </button>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
            </form>
            <p className="text-xs text-gray-600 mt-3">
              Ingen spam. Kun info om beta-lansering.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-green-400/10 border border-green-400/30 rounded-2xl p-8">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Du er på ventelisten!
            </h3>
            <p className="text-gray-400 text-sm">
              Vi gir deg beskjed når beta er klar. Du er blant de første norske
              meglerne som får prøve Forspranget.
            </p>
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
          Alt du trenger. Ingenting du ikke trenger.
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-lg mx-auto">
          5 verktøy som løser de 5 største tidstyvene i megleryrket.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-400/30 transition-colors ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-16">
          Uten vs. med Forspranget
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>❌</span> Uten Forspranget
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>30 min per boligtekst</li>
              <li>Ingen systematisk prospektering</li>
              <li>SoMe-innhold = stressende og sporadisk</li>
              <li>87% av leads forsvinner</li>
              <li>ChatGPT forstår ikke budrunden</li>
            </ul>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
            <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>✅</span> Med Forspranget
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>3 min per boligtekst</li>
              <li>Finn potensielle selgere automatisk</li>
              <li>Ferdige poster klare til publisering</li>
              <li>Automatisk oppfølging i 12 måneder</li>
              <li>AI som faktisk forstår norsk eiendom</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          5 200 meglere i Norge.{" "}
          <span className="text-green-400">Du kan være den som skiller seg ut.</span>
        </h2>
        <p className="text-gray-400 mb-8">
          Ikke vent til konkurrenten din finner dette.
        </p>
        {!submitted && (
          <a
            href="#venteliste"
            onClick={() =>
              document
                .getElementById("venteliste")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-block bg-green-400 text-[#0f1629] font-bold px-8 py-4 rounded-xl hover:bg-green-300 transition-colors text-lg"
          >
            Sikre min plass på ventelisten →
          </a>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold">
            Forsp<span className="text-green-400">ranget</span>
          </span>
          <p className="text-xs text-gray-600">
            © 2026 Forspranget. Norskspråklig AI for eiendomsmeglere.
          </p>
          <p className="text-xs text-gray-600">forspranget.no</p>
        </div>
      </footer>
    </main>
  );
}
