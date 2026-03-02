import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Leads etter visning: Slik stopper du at de forsvinner (2026)",
  description:
    "Visningen er over — og 87 % av interessentene hører aldri fra megleren igjen. Her er hva de beste meglerne gjør annerledes, og hvorfor Bergen-meglere selger på 23 dager.",
  openGraph: {
    title: "Leads etter visning: Slik stopper du at de forsvinner (2026)",
    description:
      "I Bergen selges boliger på 23 dager. I Fredrikstad tar det 136. Forskjellen er ikke markedet — det er oppfølgingssystemet.",
    type: "article",
    publishedTime: "2026-03-02T00:00:00Z",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg/leads-etter-visning",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Leads etter visning: Slik stopper du at de forsvinner",
  description:
    "Visningen er over — og 87 % av interessentene hører aldri fra megleren igjen. Her er hva de beste meglerne gjør annerledes.",
  datePublished: "2026-03-02T00:00:00Z",
  dateModified: "2026-03-02T00:00:00Z",
  author: { "@type": "Organization", name: "Forspranget" },
  publisher: { "@type": "Organization", name: "Forspranget", url: "https://forspranget.no" },
  mainEntityOfPage: "https://forspranget.no/blogg/leads-etter-visning",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hvor raskt bør megleren følge opp etter en visning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "I varme markeder som Bergen og Stavanger (23 dagers snitt til salg) bør oppfølging skje innen 24–48 timer. I kaldere markeder har du noe mer tid, men 14 dager er absolutt maksimum — da begynner interessen å dabbe av. Beste praksis er personlig oppfølging dagen etter visning, etterfulgt av en systematisk e-post/SMS-sekvens de neste ukene.",
      },
    },
    {
      "@type": "Question",
      name: "Hva er SOI i eiendomsbransjen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOI står for Sphere of Influence — ditt nettverk av folk du kjenner personlig: familie, venner, naboer, tidligere kunder, kolleger. Forskning viser at 82 % av alle eiendomstransaksjoner skjer via en relasjon eller referral fra SOI. Det betyr at den mest verdifulle basen din ikke er kalde leads fra Facebook-annonser, men folkene du allerede kjenner.",
      },
    },
    {
      "@type": "Question",
      name: "Hva gjør en megler med tapte budgivere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tapte budgivere er de varmeste leadsene du har — de var klare til å kjøpe, men vant ikke. Beste praksis er å kontakte dem innen 24 timer etter avsluttet budrunde med et personlig notat, tilby å finne tilsvarende alternativer, og legge dem inn i et CRM for oppfølging over de neste 3–6 månedene. Mange kjøper innen 6 måneder — fra megleren som fulgte opp.",
      },
    },
  ],
};

export default function LeadsEtterVisning() {
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
              Leads & CRM
            </span>
            <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>
              Mars 2026 · 6 min
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-tight mb-4 font-display" style={{ color: "var(--foreground)" }}>
            87 % av leads forsvinner etter visning — slik stopper du det
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.6 }}>
            Visningen er din beste arena for å bygge relasjoner. Men uten et system for oppfølging, forsvinner de fleste interessenter like stille som de kom.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>

          <p>
            I Bergen selges boliger på 23 dager i gjennomsnitt. I Stavanger er det enda raskere. I Fredrikstad og Sarpsborg tar det 136 dager.
          </p>

          <p>
            Den forskjellen skyldes ikke bare markedet. Den skyldes i stor grad hva meglerne gjør <em>etter</em> visningen — og om de i det hele tatt gjør noe.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Det koster mer enn du tror å miste en lead
          </h2>

          <p>
            La oss si at du hadde 18 interessenter på visningen. Kanskje 3–4 la inn bud. De 14 andre? De fleste hørte aldri fra deg igjen.
          </p>

          <p>
            Men mange av dem skal kjøpe bolig innen 6 måneder. De har midlene klare, boliglånet er forhåndsgodkjent, motivasjonen er høy. De tapte budet på én bolig — de ga ikke opp drømmen.
          </p>

          <p>
            Megleren som følger dem opp systematisk de neste ukene er megleren som selger dem neste bolig. Ikke deg, med mindre du har et system.
          </p>

          <div className="rounded-xl border p-6 my-8" style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                ["87 %", "av leads forsvinner uten oppfølging"],
                ["82 %", "av transaksjoner skjer via relasjon eller referral"],
                ["23 dager", "snitt til salg i Bergen (mot 136 i Fredrikstad)"],
              ].map(([tall, label]) => (
                <div key={tall}>
                  <div className="text-2xl font-display mb-1" style={{ color: "var(--gold)" }}>{tall}</div>
                  <div className="text-xs" style={{ opacity: 0.6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            De tre leadskategoriene etter en visning
          </h2>

          <p>
            Ikke alle leads er like varme. Systemet starter med å sortere:
          </p>

          <div className="space-y-4 my-6">
            {[
              {
                farge: "#ef4444",
                tittel: "🔴 Tapte budgivere",
                tekst: "Den varmeste kategorien. De var klare til å kjøpe — de nådde bare ikke frem. Kontakt dem innen 24 timer. Mange kjøper via deg innen 3–6 måneder hvis du holder kontakten.",
              },
              {
                farge: "#c9a96e",
                tittel: "🟡 Visintenteressenter uten bud",
                tekst: "De kom, de så — men var ikke klare akkurat nå. Kanskje ventet de på å selge sin egen bolig, kanskje var prisen for høy. Systematisk kontakt over 6–12 måneder.",
              },
              {
                farge: "#60a5fa",
                tittel: "🔵 Tidlige markedsspeidere",
                tekst: "De er ikke klare ennå, men de bygger kunnskap. En gang i fremtiden velger de megler — og da vil de huske den som ga dem nyttig info underveis.",
              },
            ].map((item) => (
              <div key={item.tittel} className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <h3 className="font-semibold mb-1.5 text-sm" style={{ color: item.farge }}>{item.tittel}</h3>
                <p className="text-sm" style={{ opacity: 0.7 }}>{item.tekst}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            SOI: Nettverket ditt er den viktigste ressursen din
          </h2>

          <p>
            Det finnes et begrep i internasjonal eiendomsbransje som norske meglere bør kjenne bedre: <strong>SOI — Sphere of Influence</strong>. Det er alle menneskene du kjenner personlig: familie, venner, naboer, tidligere kunder, kollegaer, treningskamerater.
          </p>

          <p>
            82 % av alle eiendomstransaksjoner skjer via en relasjon eller referral. Det vil si at om du hjelper 10 kunder med å kjøpe eller selge bolig i år, er det statistisk sett bare 2 av dem som fant deg via en kald annonse eller Google-søk. De 8 andre kom via noen de kjente.
          </p>

          <p>
            Det betyr at den viktigste markedsaktiviteten din ikke er Facebook-annonser — det er systematisk vedlikehold av relasjonene du allerede har.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Hva gjør de beste meglerne?
          </h2>

          <p>
            Toppmeglerne har et enkelt system som kjøres etter hver visning:
          </p>

          <div className="rounded-xl border p-6 my-6" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
            <ol className="text-sm space-y-4" style={{ opacity: 0.8 }}>
              <li className="flex gap-3">
                <span className="font-display text-lg" style={{ color: "var(--gold)" }}>1.</span>
                <div><strong>Samme dag:</strong> Legg alle visningsdeltagere inn i CRM. Kategoriser som kjøper, mulig selger eller annet.</div>
              </li>
              <li className="flex gap-3">
                <span className="font-display text-lg" style={{ color: "var(--gold)" }}>2.</span>
                <div><strong>Dagen etter:</strong> Personlig takk-melding til alle. Tapte budgivere får en ekstra, personlig beskjed med tilbud om å finne alternativ.</div>
              </li>
              <li className="flex gap-3">
                <span className="font-display text-lg" style={{ color: "var(--gold)" }}>3.</span>
                <div><strong>Uke 2–4:</strong> Relevante boliger i samme segment sendes til interessentene som ikke kjøpte.</div>
              </li>
              <li className="flex gap-3">
                <span className="font-display text-lg" style={{ color: "var(--gold)" }}>4.</span>
                <div><strong>Løpende:</strong> Quarterly touch til hele SOI — en hyggelig melding, markedsoppdatering, eller relevant nyhet. Ikke reklame.</div>
              </li>
            </ol>
          </div>

          <p>
            Utfordringen er ikke å vite hva man skal gjøre — det er å huske å gjøre det, konsekvent, for alle. Det er der et CRM-system gjør hele forskjellen.
          </p>

          <div className="rounded-xl border p-6 mt-10" style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>
            <p className="text-base mb-4" style={{ color: "var(--foreground)" }}>
              Forspranget bygger et SOI-CRM for norske meglere — med smarte påminnelser, oppfølgingssekvenser og dashbord over leads som er klare til å handle.
            </p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105" style={{ background: "var(--gold)", color: "var(--background)" }}>
              Kom deg på ventelisten
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
