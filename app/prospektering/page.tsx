import type { Metadata } from "next";
import Link from "next/link";
import ProspekteringWrapper from "../components/ProspekteringWrapper";

export const metadata: Metadata = {
  title: "Prospektering — Forspranget",
  description:
    "Finn potensielle selgere i ditt område før de legger ut på FINN. Bruk Kartverket-data til å identifisere eiendommer som ikke har vært solgt på mange år.",
};

export default function ProspekteringPage() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0e1a]">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between bg-[#0a0e1a] z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-lg tracking-wide text-white hover:opacity-80 transition-opacity">
            Forsp<span className="text-gold-gradient">ranget</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs text-[#c9a96e]/60 tracking-[0.2em] uppercase font-medium">
            Prospektering
          </span>
        </div>
        <nav className="flex items-center gap-5">
          <Link
            href="/boligtekst"
            className="text-xs text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide uppercase"
          >
            Boligtekst
          </Link>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide uppercase"
          >
            Hjem
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <ProspekteringWrapper />
    </div>
  );
}
