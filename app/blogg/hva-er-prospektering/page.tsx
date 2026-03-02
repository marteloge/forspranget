import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hva er prospektering? Slik finner norske meglere selgere før FINN (2026)",
  description:
    "De beste meglerne venter ikke på at kundene skal ringe. Prospektering er kunsten å identifisere potensielle selgere i riktig øyeblikk — og moderne AI gjør det i skala.",
  openGraph: {
    title: "Hva er prospektering? Slik finner norske meglere selgere før FINN (2026)",
    description:
      "Prospektering handler om å kontakte riktig person på riktig tidspunkt. Her er hvordan norske meglere gjør det — og hvordan AI gjør det bedre.",
    type: "article",
    publishedTime: "2026-03-02T00:00:00Z",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg/hva-er-prospektering",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hva er prospektering, og hvorfor bør meglere gjøre det smartere?",
  description:
    "De beste meglerne venter ikke på at kundene skal ringe. Prospektering er kunsten å identifisere potensielle selgere — og moderne AI gjør det i skala.",
  datePublished: "2026-03-02T00:00:00Z",
  dateModified: "2026-03-02T00:00:00Z",
  author: { "@type": "Organization", name: "Forspranget" },
  publisher: {
    "@type": "Organization",
    name: "Forspranget",
    url: "https://forspranget.no",
  },
  mainEntityOfPage: "https://forspranget.no/blogg/hva-er-prospektering",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hva er prospektering i eiendomsmegling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prospektering i eiendomsmegling er den aktive prosessen med å identifisere og kontakte potensielle selgere — før de tar kontakt med deg. Dette gjøres ved å analysere hvem i et område som sannsynligvis vil selge innen 6–18 måneder, basert på faktorer som botid, livssituasjon, boligens tilstand og markedsforhold.",
      },
    },
    {
      "@type": "Question",
      name: "Hvilke data brukes i moderne prospektering?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "I Norge kan meglere bruke offentlig tilgjengelig data fra Kartverket (eierhistorikk, matrikkeldata), Folkeregisteret (botid, familiestørrelse), og egne CRM-data (kontakthistorikk, interesser). AI kan analysere disse datakildene og rangere hvem som er mest sannsynlig å selge — noe som er umulig å gjøre manuelt i skala.",
      },
    },
    {
      "@type": "Question",
      name: "Er det lovlig å bruke persondata i prospektering i Norge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, med forbehold. GDPR setter rammer for hva du kan bruke og hvordan du kan kontakte folk. Offentlig tilgjengelig data fra Kartverket (eierforhold, adresser) er lovlig å bruke. Direkte markedsføring via brev er tillatt. E-post til folk du ikke har en etablert relasjon med, krever samtykke. En god tommelfingerregel: bruk data til å identifisere hvem du skal ringe eller sende brev til — ikke til automatisert e-post-utsendelse.",
      },
    },
  ],
};

const signals = [
  { emoji: "🏠", title: "Lang botid", desc: "Familier som har bodd mer enn 7–10 år begynner statistisk sett å planlegge neste steg." },
  { emoji: "📐", title: "Boligstørrelse vs. familiestørrelse", desc: "En barnefamilie i en liten 2-roms er sannsynlige oppgraderere. Et eldre par i en stor enebolig tenker kanskje nedskalering." },
  { emoji: "📅", title: "Livshendelser", desc: "Nyfødt, skilsmisse, arv, pensjon — store livshendelser utløser boligsalg. Meglere som er synlige i disse øyeblikkene vinner oppdragene." },
  { emoji: "🔨", title: "Ingen synlig vedlikehold", desc: "Boliger som ikke er oppgradert på 10+ år er statistisk mer sannsynlig å bli lagt ut etter et salgsrunde med naboboliger." },
];

export default function HvaErProspekteringPage() {
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
              Prospektering
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--foreground)", opacity: 0.4 }}
            >
              Mars 2026 · 7 min
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl leading-tight mb-4 font-display"
            style={{ color: "var(--foreground)" }}
          >
            Hva er prospektering, og hvorfor bør meglere gjøre det smartere?
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            De beste meglerne venter ikke på at kundene skal ringe. De identifiserer
            potensielle selgere i riktig øyeblikk — og kontakter dem før konkurrentene.
          </p>
        </div>

        {/* Content */}
        <div
          className="space-y-6 text-base leading-relaxed"
          style={{ color: "var(--foreground)", opacity: 0.85 }}
        >
          <p>
            I mange bransjer er salg reaktivt: kunden tar kontakt, selgeren leverer.
            De beste eiendomsmeglerne har lenge visst at det ikke er slik det fungerer
            i praksis — i hvert fall ikke hvis du vil ha de beste oppdragene.
          </p>
          <p>
            Prospektering er den proaktive strategien. Det handler om å finne riktig
            person, i riktig øyeblikk, med riktig budskap — og gjøre det systematisk.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Tradisjonell prospektering: hva meglere gjør i dag
          </h2>
          <p>
            De fleste meglere prospekterer allerede — de kaller det bare noe annet.
            Å ringe naboer etter et salg («Visste du at nr. 14 nettopp ble solgt for X?»)
            er prospektering. Å sende julekort til tidligere kunder er prospektering.
            Å poste regelmessig på Instagram for å holde seg «top of mind» er prospektering.
          </p>
          <p>
            Problemet er at det meste av dette skjer i blinde. Megleren vet ikke hvem
            som faktisk vurderer å selge — de kaster bredt og håper noen biter på.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Signalene som avslører potensielle selgere
          </h2>
          <p>
            Boligsalg er sjelden impulsivt. De fleste selgere har hatt tanken i
            bakhodet i 6–18 måneder før de tar kontakt med en megler. I den perioden
            sender de signaler — om man vet hvor man skal se.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-8">
            {signals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-xl border p-5"
                style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
              >
                <div className="text-2xl mb-2">{signal.emoji}</div>
                <h3
                  className="font-semibold mb-1 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {signal.title}
                </h3>
                <p className="text-sm" style={{ opacity: 0.65 }}>
                  {signal.desc}
                </p>
              </div>
            ))}
          </div>

          <p>
            Ingen av disse signalene er perfekte indikatorer alene. Men kombinert,
            og analysert over et geografisk område, gir de et mønster som er
            statistisk meningsfullt.
          </p>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Hva AI gjør som er umulig manuelt
          </h2>
          <p>
            En dyktig megler kan manuelt holde styr på 50–100 kontakter. Med god
            systematikk kanskje 200. Men en norsk by har tusenvis av boliger —
            og de aller fleste potensielle selgere er folk megleren aldri har møtt.
          </p>
          <p>
            Det er her AI skaper et reelt forsprang. Ved å analysere offentlig
            tilgjengelige data fra Kartverket (eierhistorikk, matrikkeldata) og
            sammenstille dette med statistiske mønstre, kan AI rangere hvilke boliger
            i et område som sannsynligvis vil komme ut på markedet — og når.
          </p>

          <div
            className="rounded-xl border p-6 my-8"
            style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}
          >
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--gold)" }}
            >
              Fra data til oppdrag — slik ser flyten ut
            </h3>
            <ol className="space-y-3 text-sm" style={{ opacity: 0.8 }}>
              <li className="flex gap-3">
                <span style={{ color: "var(--gold)" }} className="shrink-0 font-medium">1.</span>
                <span>AI analyserer Kartverket-data for ditt geografiske område</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "var(--gold)" }} className="shrink-0 font-medium">2.</span>
                <span>Boliger rangeres etter salgssannsynlighet basert på 10+ faktorer</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "var(--gold)" }} className="shrink-0 font-medium">3.</span>
                <span>Du ser en liste over de 20 mest sannsynlige selgerne i ditt område</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "var(--gold)" }} className="shrink-0 font-medium">4.</span>
                <span>Du tar kontakt — med brev, telefon eller personlig oppmøte</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "var(--gold)" }} className="shrink-0 font-medium">5.</span>
                <span>Du vinner oppdrag fra folk som ennå ikke har startet meglerjakten</span>
              </li>
            </ol>
          </div>

          <h2
            className="text-xl font-display mt-10 mb-3"
            style={{ color: "var(--foreground)", opacity: 1 }}
          >
            Kontakten som skaper tillit — ikke teknologien
          </h2>
          <p>
            Teknologi identifiserer hvem du skal snakke med. Megleren gjør resten.
          </p>
          <p>
            Den megleren som ringer en potensiell selger seks måneder før de bestemmer
            seg — ikke for å selge, men for å gi gratis verdivurdering og markedsinnsikt
            — er den megleren de ringer tilbake når de er klare.
          </p>
          <p>
            Det er ikke teknologi som vinner oppdrag. Det er tillit. Teknologien
            hjelper deg å investere tillitsbyggingen der det faktisk lønner seg.
          </p>

          <div
            className="rounded-xl border p-6 mt-10"
            style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}
          >
            <p
              className="text-base mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Forspranget sin prospekteringsfunksjon lar deg se potensielle selgere
              i ditt område — basert på Kartverket-data. Prøv det gratis.
            </p>
            <Link
              href="/prospektering"
              className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ background: "var(--gold)", color: "var(--background)" }}
            >
              Prøv prospektering →
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
