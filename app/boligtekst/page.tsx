import type { Metadata } from "next";
import Link from "next/link";
import BoligtekstWrapper from "../components/BoligtekstWrapper";

export const metadata: Metadata = {
  title: "AI Boligtekst — Forspranget",
  description:
    "Generer FINN-klare boligbeskrivelser, Instagram-captions og SMS på sekunder. AI-drevet, skrevet på norsk, optimalisert for norske kjøpere.",
};

export default function BoligtekstPage() {
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
            AI Boligtekst
          </span>
        </div>
        <nav className="flex items-center gap-5">
          <Link
            href="/prospektering"
            className="text-xs text-gray-500 hover:text-[#c9a96e] transition-colors tracking-wide uppercase"
          >
            Prospektering
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
      <BoligtekstWrapper />
    </div>
  );
}
