import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spar tid på boligtekster med AI — slik gjør du det (2026)",
  description:
    "En gjennomsnittlig boligtekst tar 30–60 minutter å skrive. Med riktig AI-verktøy tar det 3. Praktisk guide til AI-genererte boligannonser for norske meglere.",
  openGraph: {
    title: "Spar tid på boligtekster med AI — slik gjør du det (2026)",
    description:
      "Praktisk guide: Slik bruker norske eiendomsmeglere AI til å skrive FINN-optimaliserte boligtekster på 3 minutter istedenfor 30.",
    type: "article",
    publishedTime: "2026-03-02T00:00:00Z",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg/boligtekst-med-ai",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Spar tid på boligtekster med AI — slik gjør du det",
  description:
    "En gjennomsnittlig boligtekst tar 30–60 minutter å skrive. Med riktig AI-verktøy tar det 3. Praktisk guide for norske meglere.",
  datePublished: "2026-03-02T00:00:00Z",
  dateModified: "2026-03-02T00:00:00Z",
  author: { "@type": "Organization", name: "Forspranget" },
  publisher: {
    "@type": "Organization",
    name: "Forspranget",
    url: "https://forspranget.no",
  },
  mainEntityOfPage: "https://forspranget.no/blogg/boligtekst-med-ai",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kan AI skrive gode boligtekster på norsk?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, men bare med riktig verktøy. Generiske AI-verktøy som ChatGPT kan produsere tekst på norsk, men forstår ikke FINN-formatet, norsk boligrett eller salgspsykologi tilpasset norske kjøpere. Spesialiserte verktøy for norsk eiendomsmegling gir vesentlig bedre resultater fordi de er trent på norske boligannonser og norske kjøperes preferanser.",
      },
    },
    {
      "@type": "Question",
      name: "Hva bør en AI-generert boligtekst inneholde?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En god FINN-annonse bør ha: en sterk innledning som treffer målgruppen emosjonelt, korrekte arealdetaljer (BRA, BTA, etasje), nærhetsbeskrivelse (transport, skoler, servicetilbud), boligens unike særtrekk, og en tydelig call-to-action for visning. AI kan fylle ut alt dette basert på grunndata megleren oppgir.",
      },
    },
    {
      "@type": "Question",
      name: "Må megleren justere teksten AI genererer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Alltid. AI gir et solid utgangspunkt — ikke en ferdig tekst. Megleren kjenner boligen, kjenner området og kjenner selgernes situasjon. Den menneskelige justeringen er det som gjør teksten fra god til utmerket. Estimer 5–10 minutter på gjennomgang og justering, mot 30–60 minutter å skrive fra bunnen.",
      },
    },
  ],
};

const steps = [
  {
    num: "01",
    title: "Fyll inn grunndata",
    desc: "Adresse, areal (BRA/BTA), romfordeling, etasje, byggeår, standard og nærhet til kollektivtransport. Det tar under 2 minutter.",
  },
  {
    num: "02",
    title: "Velg målgruppe og tone",
    desc: "Selger du til en barnefamilie, et ungt par eller en investor? En god AI vil skrive for akkurat den kjøperen — med riktig språklig tonalitet.",
  },
  {
    num: "03",
    title: "Generer og gjennomgå",
    desc: "AI produserer en komplett FINN-annonse på sekunder. Du gjennomgår, justerer detaljer du vet bedre enn AI-en, og godkjenner. Ferdig.",
  },
];

export default function BoligtekstMedAiPage() {
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
              Praktisk guide
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--foreground)", opacity: 0.4 }}
            >
              Mars 2026 · 5 min
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl leading-tight mb-4 font-display"
            style={{ color: "var(--foreground)" }}
          >
            Spar tid på boligtekster med AI — slik gjør du det
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            En boligtekst tar i snitt 45 minutter å skrive fra bunnen. Med riktig
            verktøy tar det 3. Her er den praktiske guiden.
          </p>
        </div>

        {/* Content */}
        <div
          className="space-y-6 text-base leading-relaxed"
          style={{ color: "var(--foreground)", opacity: 0.85 }}
        >
          <p>
            Boligannonsen er salgsdokumentet. Den er det første en potensiell kjøper
            ser, og den avgjør om de booker visning eller ikke. Allikevel er den en av
            de mest tidkrevende oppgavene i meglerens hverdag.
          </p>
          <p>
            AI løser ikke alt. Men det løser akkurat dette.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Tre steg — fra grunndata til ferdig annonse
          </h2>

          <div className="space-y-4 my-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex gap-5 rounded-xl border p-5"
                style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
              >
                <div
                  className="text-2xl font-display shrink-0"
                  style={{ color: "var(--gold)", opacity: 0.5 }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ opacity: 0.7 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Hva gjør en boligtekst fra AI god — eller dårlig?
          </h2>
          <p>
            Forskjellen mellom en god og dårlig AI-boligtekst handler ikke om AI-en —
            det handler om inputen. Garbage in, garbage out gjelder like mye her som
            overalt ellers.
          </p>
          <p>
            En megler som oppgir tørre faktaopplysninger får en tørr tekst tilbake.
            En megler som i tillegg beskriver hvem som bor i nabolaget, hva som er
            unikt med utsikten, og hvem boligen passer for — får en tekst som faktisk
            selger.
          </p>

          <div
            className="rounded-xl border p-6 my-8"
            style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}
          >
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--gold)" }}
            >
              Pro-tips for bedre output
            </h3>
            <ul className="space-y-2 text-sm" style={{ opacity: 0.75 }}>
              <li>✓ Beskriv nabolaget med ett konkret eksempel («5 min til T-bane, rolig blindvei»)</li>
              <li>✓ Oppgi hva som er renovert og årstall («bad totalrenovert 2021»)</li>
              <li>✓ Fortell hvem boligen passer for («perfekt for par eller første hjem»)</li>
              <li>✓ Nevn solforhold hvis positivt («sørvest-vendt terrasse, sol til kl. 21»)</li>
              <li>✓ Be AI-en unngå klisjeer som «beliggende sentralt» og «lyse rom»</li>
            </ul>
          </div>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Norsk AI vs. generisk ChatGPT
          </h2>
          <p>
            Mange meglere har prøvd ChatGPT og blitt skuffet. Det er forståelig —
            ChatGPT er trent for å gjøre alt, noe som betyr at den er spesialist på
            ingenting. Den kjenner ikke FINN-formatet. Den vet ikke at norske kjøpere
            er opptatt av BRA vs. BTA. Den skriver ikke med norsk salgspsykologi.
          </p>
          <p>
            Et verktøy som er bygget spesifikt for norsk eiendomsmegling kjenner
            bransjen fra innsiden. Det er forskjellen på en generalist og en spesialist.
          </p>

          <div
            className="rounded-xl border p-6 mt-10"
            style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}
          >
            <p
              className="text-base mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Forspranget sin AI-boligtekst er bygget for norsk eiendomsmegling.
              Prøv det gratis — ingen betalingskort nødvendig.
            </p>
            <Link
              href="/boligtekst"
              className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ background: "var(--gold)", color: "var(--background)" }}
            >
              Prøv AI-boligtekst nå →
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
            className="text-sm"
            style={{ color: "var(--gold)", opacity: 0.7 }}
          >
            ← Tilbake til blogg
          </Link>
        </div>
      </article>
    </main>
  );
}
