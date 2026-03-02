import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hvordan AI endrer hverdagen til norske eiendomsmeglere (2026)",
  description:
    "Bransjen er i endring. Meglere som tar i bruk AI bruker halve tiden på administrative oppgaver og mer tid på relasjoner og rådgivning. Her er hva som faktisk skjer.",
  openGraph: {
    title: "Hvordan AI endrer hverdagen til norske eiendomsmeglere (2026)",
    description:
      "AI i eiendomsbransjen handler ikke om å erstatte meglere — det handler om å gi dem superkrefter. Her er hva som faktisk endres i norsk kontekst.",
    type: "article",
    publishedTime: "2026-03-02T00:00:00Z",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg/ai-endrer-meglerhverdagen",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hvordan AI endrer hverdagen til norske eiendomsmeglere",
  description:
    "Bransjen er i endring. Meglere som tar i bruk AI bruker halve tiden på administrative oppgaver og mer tid på relasjoner og rådgivning.",
  datePublished: "2026-03-02T00:00:00Z",
  dateModified: "2026-03-02T00:00:00Z",
  author: { "@type": "Organization", name: "Forspranget" },
  publisher: {
    "@type": "Organization",
    name: "Forspranget",
    url: "https://forspranget.no",
  },
  mainEntityOfPage: "https://forspranget.no/blogg/ai-endrer-meglerhverdagen",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Vil AI erstatte eiendomsmeglere i Norge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nei. Eiendomsmegling er en relasjonsbasert bransje med høy juridisk kompleksitet, og norsk lov krever godkjent megler ved omsetning av fast eiendom. AI vil derimot gjøre de beste meglerne enda bedre ved å ta over tidkrevende administrative oppgaver — boligtekster, oppfølging, prospektering — slik at megleren kan bruke mer tid på det som faktisk gir salg: tillit og rådgivning.",
      },
    },
    {
      "@type": "Question",
      name: "Hva er de vanligste AI-verktøyene eiendomsmeglere bruker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De vanligste bruksområdene er: automatisk generering av boligbeskrivelser, AI-drevet leadscoring og prospektering, automatisert oppfølging av potensielle selgere, og innholdsproduksjon til sosiale medier. I Norge er det viktig å velge verktøy som er trent på norsk og forstår norsk eiendomsjuss og FINN-format.",
      },
    },
    {
      "@type": "Question",
      name: "Hvor mye tid kan en megler spare med AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Undersøkelser fra USA viser at meglere som bruker AI-verktøy konsekvent sparer 5–10 timer per uke på administrative oppgaver. I norsk kontekst — der boligtekster er spesielt lange og grundige — er besparelsen på tekstproduksjon alene estimert til 2–4 timer per bolig.",
      },
    },
  ],
};

export default function AiEndrerMeglerhverdagenPage() {
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

      {/* Navigation */}
      <nav
        className="px-6 py-4 border-b"
        style={{ borderColor: "rgba(201,169,110,0.15)" }}
      >
        <div className="mx-auto max-w-2xl flex items-center gap-4">
          <Link
            href="/blogg"
            className="text-sm transition-colors"
            style={{ color: "var(--gold)", opacity: 0.8 }}
          >
            ← Blogg
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: "var(--gold)", color: "var(--background)" }}
            >
              AI & Bransje
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--foreground)", opacity: 0.4 }}
            >
              Mars 2026 · 6 min
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl leading-tight mb-4 font-display"
            style={{ color: "var(--foreground)" }}
          >
            Hvordan AI endrer hverdagen til norske eiendomsmeglere
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            Bransjen er i endring. Meglere som tar i bruk AI bruker halve tiden på
            administrative oppgaver — og bruker resten på det som faktisk gir salg.
          </p>
        </div>

        {/* Content */}
        <div
          className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed"
          style={{ color: "var(--foreground)", opacity: 0.85 }}
        >
          <p>
            En norsk eiendomsmegler bruker i snitt 40–60 % av arbeidstiden på oppgaver
            som ikke direkte genererer salg: boligtekster, oppfølging av leads, admin,
            sosiale medier og prospektering. Det er tid som burde gått til klienter.
          </p>

          <p>
            AI endrer ikke hvem megleren er — men det endrer hva megleren bruker
            tiden sin på.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Det administrative tidstyveriet
          </h2>
          <p>
            La oss være ærlige: å skrive en god boligannonse for FINN tar tid. En
            grundig tekst med salgspsykologi, korrekte arealbeskrivelser og engasjerende
            språk bruker de fleste meglere 30–60 minutter på å produsere. Multipliser
            det med 3–5 salg i måneden, og det er lett 4 timer borte — bare på tekst.
          </p>
          <p>
            Legg til oppfølging av budgivere som tapte, sosiale medier-innhold,
            e-poster til potensielle selgere og CRM-oppdateringer. Plutselig er
            halvparten av arbeidsuken borte til repetitivt arbeid.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Hva AI faktisk gjør bra i eiendom
          </h2>
          <p>
            AI i eiendomsbransjen er ikke magi — det er spesialiserte verktøy som er
            trent på å gjøre spesifikke ting veldig bra. Her er de tre viktigste:
          </p>

          <div
            className="rounded-xl border p-6 my-8 space-y-5"
            style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}
          >
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--gold)" }}
              >
                1. Boligtekster på 3 minutter
              </h3>
              <p className="text-sm" style={{ opacity: 0.75 }}>
                AI som er trent på norsk og forstår FINN-formatet kan generere en
                komplett, salgsoptimalisert boligtekst fra grunndata på under 3
                minutter. Megleren justerer og godkjenner — ikke skriver fra bunnen.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--gold)" }}
              >
                2. Prospektering uten manuell research
              </h3>
              <p className="text-sm" style={{ opacity: 0.75 }}>
                Ved å analysere offentlige data (Kartverket, matrikkel, eierhistorikk)
                kan AI identifisere hvem i et område som sannsynligvis vil selge innen
                6–18 måneder — før de ringer deg. Det er prospektering i skala.
              </p>
            </div>
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--gold)" }}
              >
                3. Automatisk oppfølging av leads
              </h3>
              <p className="text-sm" style={{ opacity: 0.75 }}>
                87 % av leads forsvinner uten systematisk oppfølging. AI kan sende
                riktig melding til riktig person på riktig tidspunkt — uten at megleren
                trenger å huske det.
              </p>
            </div>
          </div>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Norsk kontekst er viktig
          </h2>
          <p>
            Her er det mange internasjonale verktøy feiler: de forstår ikke norsk
            boligrett, ikke FINN-formatet, ikke konsesjonsloven, ikke avhendingsloven.
            En AI som er trent på amerikanske boligannonser vil produsere tekster som
            føles feil — og det vil kundene merke.
          </p>
          <p>
            Norsk eiendomsmegling har også spesifikke krav til hva en annonse skal
            inneholde. Verktøy som skal brukes av norske meglere må bygges for norske
            forhold, ikke oversatt fra engelsk.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Vil AI erstatte meglere?
          </h2>
          <p>
            Nei. Og det er ikke et svar vi gir for å berolige — det er et faktabasert
            svar. Eiendomstransaksjoner i Norge krever godkjent megler ved lov. Kjøp
            og salg av bolig er for de fleste den største finansielle beslutningen de
            tar i livet. Der vil folk ha et menneske de stoler på.
          </p>
          <p>
            Det AI gjør er å gi de beste meglerne et forsprang. De som tar det i bruk
            nå, mens det ennå er nytt, vil ha bygget vaner og systemer som konkurrenter
            ikke har. Det er slik forsprang skapes.
          </p>

          <div
            className="rounded-xl border p-6 mt-10"
            style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}
          >
            <p
              className="text-base mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Forspranget er bygget for norske meglere. Boligtekster, prospektering og
              oppfølging — alt på norsk, for norske forhold.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ background: "var(--gold)", color: "var(--background)" }}
            >
              Kom deg på ventelisten
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 space-y-6">
          <h2
            className="text-xl font-display"
            style={{ color: "var(--foreground)" }}
          >
            Ofte stilte spørsmål
          </h2>
          {faqSchema.mainEntity.map((faq) => (
            <div
              key={faq.name}
              className="rounded-xl border p-5"
              style={{ borderColor: "rgba(201,169,110,0.15)" }}
            >
              <h3
                className="font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {faq.name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                {faq.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>

        {/* Back */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(201,169,110,0.1)" }}>
          <Link
            href="/blogg"
            className="text-sm transition-colors"
            style={{ color: "var(--gold)", opacity: 0.7 }}
          >
            ← Tilbake til blogg
          </Link>
        </div>
      </article>
    </main>
  );
}
