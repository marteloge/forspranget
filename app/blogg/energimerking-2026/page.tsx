import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Energimerking 2026: Hva norske kjøpere faktisk ser etter — og hvordan du selger raskere",
  description:
    "Fra januar 2026 gjelder ny energimerkeordning for boliger. 4 av 10 kjøpere sier energimerke påvirker kjøpsbeslutningen. Her er hva meglere bør vite.",
  openGraph: {
    title: "Energimerking 2026: Hva norske kjøpere ser etter",
    description:
      "Ny A–G energimerkeordning er innført. 40 % av kjøpere lar seg påvirke. Her er hva meglere bør nevne i boligannonsen for å selge raskere.",
    type: "article",
    publishedTime: "2026-03-02T00:00:00Z",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg/energimerking-2026",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Energimerking 2026: Hva norske kjøpere faktisk ser etter",
  description:
    "Fra januar 2026 gjelder ny energimerkeordning for norske boliger. 40 % av kjøpere sier energimerket påvirker kjøpsbeslutningen.",
  datePublished: "2026-03-02T00:00:00Z",
  dateModified: "2026-03-02T00:00:00Z",
  author: { "@type": "Organization", name: "Forspranget" },
  publisher: { "@type": "Organization", name: "Forspranget", url: "https://forspranget.no" },
  mainEntityOfPage: "https://forspranget.no/blogg/energimerking-2026",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hva er den nye energimerkeordningen fra 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fra 1. januar 2026 bruker Norge et nytt energimerke-system (A–G) som i tillegg til energiforbruk nå vektlegger oppvarmingstype. Boliger med varmepumpe, fjernvarme eller biobrensel scorer vesentlig bedre enn de med direkte elektrisk oppvarming. Merket er obligatorisk ved salg og utleie.",
      },
    },
    {
      "@type": "Question",
      name: "Bør meglere alltid nevne energimerket i boligannonsen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, særlig for boliger med god energikarakter (A, B eller C). 4 av 10 kjøpere sier energimerket påvirker kjøpsbeslutningen, og for mange er det en proxy for fremtidige strøm- og oppvarmingskostnader. En bolig med varmepumpe og energikarakter B er mer attraktiv å formidle enn en tilsvarende bolig uten. God annonsering trekker det frem eksplisitt.",
      },
    },
    {
      "@type": "Question",
      name: "Hva gjør en bolig attraktiv for norske kjøpere i 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "I 2026 er de viktigste faktorene: pris, beliggenhet og planløsning — slik det alltid har vært. Men energimerke, nærhet til kollektivtransport og parkeringsmuligheter er blitt stadig viktigere. Kjøpere er bevisste på fremtidige driftskostnader, og boliger som signaliserer lave strøm- og oppvarmingsutgifter selges raskere.",
      },
    },
  ],
};

const MERKE_FARGER: Record<string, string> = {
  A: "#22c55e",
  B: "#86efac",
  C: "#fde68a",
  D: "#fbbf24",
  E: "#fb923c",
  F: "#f87171",
  G: "#ef4444",
};

export default function Energimerking2026() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="px-6 py-4 border-b" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
        <div className="mx-auto max-w-2xl flex items-center gap-4">
          <Link href="/blogg" className="text-sm transition-colors" style={{ color: "var(--gold)", opacity: 0.8 }}>
            ← Blogg
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "var(--gold)", color: "var(--background)" }}>
              Boligmarkedet 2026
            </span>
            <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>
              Mars 2026 · 5 min
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-tight mb-4 font-display" style={{ color: "var(--foreground)" }}>
            Energimerking 2026: Hva norske kjøpere faktisk ser etter
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.6 }}>
            Ny energimerkeordning er innført. 4 av 10 kjøpere sier merket påvirker kjøpsbeslutningen. Her er hva meglere bør vite — og nevne i annonsen.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>

          <p>
            Fra 1. januar 2026 gjelder en ny energimerkeordning for norske boliger. Det høres teknisk ut, men konsekvensene er konkrete: boliger med varmepumpe og god isolasjon scorer vesentlig bedre enn de med direkte elektrisk oppvarming — og kjøperne merker det.
          </p>

          <p>
            4 av 10 boligkjøpere sier energimerket påvirker kjøpsbeslutningen. Det er ikke et lite tall. Det betyr at en av annonsens viktigste salgsargumenter gjerne ikke nevnes i det hele tatt.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Hva er nytt med ordningen?
          </h2>

          <p>
            Det gamle systemet målte kun beregnet energiforbruk (kWh per kvm). Det nye systemet fra 2026 legger til <em>oppvarmingstype</em> som en eksplisitt faktor. Det betyr at to identiske boliger med identisk energiforbruk kan få ulikt merke basert på om de bruker varmepumpe, fjernvarme, ved/biobrensel eller direkte elektrisk.
          </p>

          {/* Energy scale visualization */}
          <div className="rounded-xl border p-6 my-8" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gold)", opacity: 0.6 }}>Ny energiskala A–G</p>
            <div className="space-y-1.5">
              {[
                { merke: "A", label: "Meget energieffektivt — lav driftkostnad", vinner: true },
                { merke: "B", label: "Energieffektivt", vinner: true },
                { merke: "C", label: "Moderat — gjennomsnittlig norsk bolig", vinner: false },
                { merke: "D", label: "Under middels", vinner: false },
                { merke: "E", label: "Høyt forbruk", vinner: false },
                { merke: "F", label: "Meget høyt forbruk", vinner: false },
                { merke: "G", label: "Dårligst — høyest driftkostnad", vinner: false },
              ].map(({ merke, label, vinner }) => (
                <div key={merke} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: MERKE_FARGER[merke], color: "#0a0e1a" }}
                  >
                    {merke}
                  </div>
                  <span className="text-sm" style={{ opacity: vinner ? 0.9 : 0.5 }}>{label}</span>
                  {vinner && <span className="text-xs ml-auto" style={{ color: "var(--gold)", opacity: 0.7 }}>Kjøpernes favoritt</span>}
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Hva betyr dette for boligannonsen?
          </h2>

          <p>
            En bolig med varmepumpe som er installert de siste 5 årene er ikke bare mer komfortabel — den er nå mer attraktiv å annonsere. Det er et salgsargument som går direkte på kjøperens lommeboken: lavere strøm- og oppvarmingsregning resten av boliglivet.
          </p>

          <p>
            Problemet er at de fleste boligannonser ikke nevner det. Energimerket vises som ett symbol øverst i annonsen — men det forklares ikke, og konsekvensene kontekstualiseres ikke.
          </p>

          <div className="rounded-xl border p-5 my-6" style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>Eksempel: Fra teknisk til selgende</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ opacity: 0.5 }}>Typisk annons (taper)</p>
                <p className="text-sm p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", opacity: 0.7, fontStyle: "italic" }}>
                  &quot;Energimerke: C. Oppvarming: elektrisk og varmepumpe.&quot;
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ opacity: 0.5, color: "var(--gold)" }}>AI-optimalisert (vinner)</p>
                <p className="text-sm p-3 rounded-lg" style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)" }}>
                  &quot;Energimerke B med moderne luft-til-luft varmepumpe (2022). Lave driftkostnader — strømregningen er estimert til under 2 000 kr per måned.&quot;
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Hva kjøpere faktisk prioriterer i 2026
          </h2>

          <p>
            Pris, beliggenhet og planløsning er og forblir topp-3. Men i 2026 ser vi en tydelig endring i hva som kommer etter:
          </p>

          <ul className="space-y-2 text-sm" style={{ opacity: 0.8 }}>
            <li><strong style={{ color: "var(--gold)" }}>Energieffektivitet:</strong> 40 % av kjøpere lar det påvirke beslutningen. Særlig aktuelt for store boliger der månedlige driftskostnader er høye.</li>
            <li><strong style={{ color: "var(--gold)" }}>Kollektivnærhet:</strong> Etterspørselen rundt kollektivknutepunkt er spesielt sterk i byer. Billignere bil, bedre miljøprofil.</li>
            <li><strong style={{ color: "var(--gold)" }}>Oppusset kjøkken og bad:</strong> «Innflyttingsklar» er ett av de mest søkte begrepene på FINN. Kjøpere betaler premium for å slippe renovering.</li>
            <li><strong style={{ color: "var(--gold)" }}>Parkering:</strong> I by er det knapt — og kjøpere betaler godt for det.</li>
          </ul>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Markedsforskjellene er enorme i 2026
          </h2>

          <p>
            En ting norske meglere bør ta inn over seg: markedet er ikke ett marked. Det er mange markeder med radikalt ulik dynamikk.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--gold)", opacity: 0.8 }}>By</th>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--gold)", opacity: 0.8 }}>Prisvekst 2026</th>
                  <th className="text-left py-2 font-semibold" style={{ color: "var(--gold)", opacity: 0.8 }}>Snitt dager til salg</th>
                </tr>
              </thead>
              <tbody style={{ opacity: 0.75 }}>
                {[
                  ["Stavanger", "~10 %", "Svært raskt"],
                  ["Bergen", "~8.5 %", "23 dager"],
                  ["Tromsø", "~9 %", "Raskt"],
                  ["Oslo", "~5 %", "Varierer"],
                  ["Trondheim", "~4.5 %", "Varierer"],
                  ["Fredrikstad/Sarpsborg", "Lavere", "136 dager"],
                ].map(([by, vekst, dager]) => (
                  <tr key={by} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="py-2.5 pr-4 font-medium">{by}</td>
                    <td className="py-2.5 pr-4">{vekst}</td>
                    <td className="py-2.5">{dager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Kilde: Eiendom Norge prognose 2026 og markedsstatistikk januar 2026.
          </p>

          <p>
            En megler i Stavanger trenger en annen strategi enn en megler i Fredrikstad. I pressede markeder handler det om å komme ut raskest — i tregere markeder er det langsiktig relasjonsbygging og systematisk oppfølging som skiller de gode fra de gjennomsnittlige.
          </p>

          <div className="rounded-xl border p-6 mt-10" style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>
            <p className="text-base mb-4" style={{ color: "var(--foreground)" }}>
              Forspranget genererer boligtekster som automatisk fremhever energimerke, oppvarmingstype og kjøpernes prioriteringer i 2026.
            </p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105" style={{ background: "var(--gold)", color: "var(--background)" }}>
              Prøv AI Boligtekst
            </Link>
          </div>
        </div>

        <div className="mt-16 space-y-6">
          <h2 className="text-xl font-display" style={{ color: "var(--foreground)" }}>Ofte stilte spørsmål</h2>
          {faqSchema.mainEntity.map((faq) => (
            <div key={faq.name} className="rounded-xl border p-5" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
              <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>{faq.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.6 }}>{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(201,169,110,0.1)" }}>
          <Link href="/blogg" className="text-sm transition-colors" style={{ color: "var(--gold)", opacity: 0.7 }}>
            ← Tilbake til blogg
          </Link>
        </div>
      </article>
    </main>
  );
}
