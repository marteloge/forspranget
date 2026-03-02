import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instagram for norske eiendomsmeglere: Den komplette guiden (2026)",
  description:
    "80 % av boligkjøpere bruker sosiale medier i boligjakten. Slik bygger du en Instagram-profil som gir deg leads, tillit og salg — uten å bruke timer på innhold.",
  openGraph: {
    title: "Instagram for norske eiendomsmeglere: Den komplette guiden (2026)",
    description:
      "Autentisk innhold slår polerte annonser. Her er hva norske toppmeglere gjør på Instagram — og hvordan AI kan spare deg for timesvis.",
    type: "article",
    publishedTime: "2026-03-02T00:00:00Z",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg/instagram-for-eiendomsmeglere",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Instagram for norske eiendomsmeglere: Den komplette guiden (2026)",
  description:
    "80 % av boligkjøpere bruker sosiale medier i boligjakten. Slik bygger du en Instagram-profil som gir deg leads, tillit og salg.",
  datePublished: "2026-03-02T00:00:00Z",
  dateModified: "2026-03-02T00:00:00Z",
  author: { "@type": "Organization", name: "Forspranget" },
  publisher: { "@type": "Organization", name: "Forspranget", url: "https://forspranget.no" },
  mainEntityOfPage: "https://forspranget.no/blogg/instagram-for-eiendomsmeglere",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hvor ofte bør en eiendomsmegler poste på Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De fleste eksperter anbefaler 3–5 innlegg per uke for å holde algoritmen aktiv og være top-of-mind. Det viktigste er konsistens fremfor frekvens. Bruk Stories daglig for enkel tilstedeværelse, og legg energien i 2–3 kvalitetsposter per uke.",
      },
    },
    {
      "@type": "Question",
      name: "Hva slags innhold fungerer best for meglere på Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Forskning og erfaringer fra norske meglere viser at autentisk, ufiltrert innhold fra meglerens hverdag presterer langt bedre enn polerte reklameposter. Visningsklipp, 'behind the scenes', lokalkunnskap om nabolaget og kundecaser gir høyest engagement og flest DM-henvendelser.",
      },
    },
    {
      "@type": "Question",
      name: "Trenger jeg profesjonell fotograf for Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ikke nødvendigvis. Smartphone-videoer filmet i portrait-format med naturlig lys fungerer godt for Stories og Reels. Profesjonelt bilde brukes best til statiske bildeposter av boliger. Det viktigste er at innholdet føles ekte — ikke at det er teknisk perfekt.",
      },
    },
  ],
};

export default function InstagramForMeglere() {
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
              Sosiale medier
            </span>
            <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.4 }}>
              Mars 2026 · 7 min
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-tight mb-4 font-display" style={{ color: "var(--foreground)" }}>
            Instagram for norske eiendomsmeglere: Den komplette guiden
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.6 }}>
            80 % av boligkjøpere bruker sosiale medier i boligjakten. De beste meglerne bruker Instagram til å bygge tillit lenge før kunden er klar til å selge.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>

          <p>
            En Bergen-megler ved navn Kaja prøvde noe ukonvensjonelt: hun begynte å poste ufiltrert innhold fra sin hverdag. Visninger i slitte leiligheter. Krevende kunder. Historier fra &quot;dødsbo&quot;-salg. Ikke glansbilder — virkeligheten.
          </p>

          <p>
            Resultatet? Kundene begynte å komme til henne. Ikke omvendt.
          </p>

          <p>
            Det er kjernen i hva Instagram kan gjøre for en norsk eiendomsmegler: bygge tillit i skala, over tid, med folk som ennå ikke vet at de skal selge.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Hvorfor Instagram er annerledes enn FINN-annonsering
          </h2>

          <p>
            FINN-annonser og avisannonser treffer folk som allerede er i kjøps- eller salgsmodus. Instagram treffer folk <em>før</em> de er der. Det er en grunnleggende forskjell.
          </p>

          <p>
            En boligeier i 40-årsalderen som liker og kommenterer på videoen din om &quot;hva som egentlig avgjør prisen på Grünerløkka&quot; — hun er kanskje ett år fra å selge. Men når hun er klar, ringer hun deg. Ikke konkurrenten hun aldri har hørt om.
          </p>

          <p>
            SSB bekrefter at over 80 % av den norske befolkningen bruker sosiale medier daglig. Av boligkjøpere bruker mer enn 80 % sosiale medier aktivt i boligjakten. Det er et enormt publikum som allerede er der — og de fleste meglere er ikke det.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Hva som faktisk fungerer
          </h2>

          <p>
            Mange meglere gjør samme feil: de bruker Instagram som en digital annonseplakat. Boligbilde, pris, antall soverom, link til FINN. Det presterer dårlig — fordi det er det alle gjør, og det er ikke det folk åpner Instagram for.
          </p>

          <div className="rounded-xl border p-6 my-8 space-y-5" style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: "var(--gold)" }}>
                ✅ Innhold som fungerer
              </h3>
              <ul className="text-sm space-y-2" style={{ opacity: 0.8 }}>
                <li>📹 <strong>Hverdagsklipp fra jobben</strong> — visningsrunden, forberedelsene, samtalen med selger</li>
                <li>🏘️ <strong>Lokalkunnskap</strong> — «3 ting jeg elsker med Majorstua som ikke FINN-annonsen forteller deg»</li>
                <li>💬 <strong>Kundecasen</strong> — anonymisert, med tillatelse: «Familien hadde prøvd å selge i 4 måneder. Slik snudde vi det»</li>
                <li>📊 <strong>Markedsdata</strong> — «Snittid til salg i Bergen er 23 dager nå. Her er hva det betyr»</li>
                <li>🎯 <strong>Tips til kjøpere og selgere</strong> — bygg ekspertposisjon og få delinger</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: "var(--gold)", opacity: 0.6 }}>
                ❌ Innhold som ikke fungerer
              </h3>
              <ul className="text-sm space-y-2" style={{ opacity: 0.6 }}>
                <li>Statiske boligbilder uten kontekst</li>
                <li>Reklametekster kopiert fra FINN-annonsen</li>
                <li>Generisk innhold som ikke viser hvem du er</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Plattformstrategi: Instagram, Facebook og TikTok
          </h2>

          <p>
            <strong>Instagram</strong> er primærplattformen for de fleste meglere. Kombinasjonen av Reels (video), Stories (daglig tilstedeværelse) og feed-poster (kuratert merkevare) gir deg alle verktøyene du trenger. Spesielt unge boligkjøpere — som gjerne er førstegangskjøpere — er aktive her.
          </p>

          <p>
            <strong>Facebook</strong> bør ikke neglisjeres. Den eldre demografien — som gjerne er selgere av enebolig og større leiligheter — er fortsatt mest aktiv på Facebook. Mange suksessfulle meglere kjører identisk innhold på begge plattformer og dobler rekkevidden med null ekstra arbeid.
          </p>

          <p>
            <strong>TikTok</strong> vokser, men er ennå ikke etablert som kjernekanal for norske meglere. Eksperimenter gjerne — men ikke på bekostning av de to andre.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Tidsproblemet — og løsningen
          </h2>

          <p>
            Her er det mange meglere setter seg fast: de vet at de burde poste mer, men finner ikke tiden. En salgsmåned med 3–5 boliger, visninger, budrunder og papirarbeid — og så skal du i tillegg produsere innhold?
          </p>

          <p>
            Svaret er å koble innholdsproduksjon til arbeidet du allerede gjør. Hvert boligsalg er potensielt fire stykker innhold:
          </p>

          <div className="rounded-xl border p-6 my-6" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
            <ol className="text-sm space-y-3" style={{ opacity: 0.8 }}>
              <li><strong>1. Visningsforberedelse</strong> — «Slik klargjør vi denne Frogner-leiligheten på 48 timer»</li>
              <li><strong>2. Visningsdagen</strong> — Story-serie fra morgen til kveld</li>
              <li><strong>3. Budrunden</strong> — anonymisert: «Budrunden tok 4 timer. Her er hva som skjedde»</li>
              <li><strong>4. Etter salg</strong> — kundereaksjonen, nøkkelen i hånden, takknemmeligheten</li>
            </ol>
          </div>

          <p>
            Det er ikke mangel på innhold — det er mangel på system. Med riktig verktøy kan Instagram-captionsteksten genereres automatisk fra boligdetaljene du allerede har fylt inn. Rekkevidden bygges mens du gjør jobben din.
          </p>

          <h2 className="text-xl font-display mt-10 mb-3" style={{ color: "var(--foreground)", opacity: 1 }}>
            Praktisk: Slik ser en god ukeplan ut
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--gold)", opacity: 0.8 }}>Dag</th>
                  <th className="text-left py-2 font-semibold" style={{ color: "var(--gold)", opacity: 0.8 }}>Innhold</th>
                </tr>
              </thead>
              <tbody style={{ opacity: 0.75 }}>
                {[
                  ["Mandag", "Markedsoppdatering / lokalt tall eller observasjon"],
                  ["Onsdag", "Bolig i dag: visningsklipp, \"behind the scenes\""],
                  ["Fredag", "Personlig / lokal: kafé du liker i området, kundecas"],
                  ["Daglig", "Stories: hva skjer akkurat nå (tar 2 min)"],
                ].map(([dag, innhold]) => (
                  <tr key={dag} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="py-2.5 pr-4 font-medium">{dag}</td>
                    <td className="py-2.5">{innhold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border p-6 mt-10" style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>
            <p className="text-base mb-4" style={{ color: "var(--foreground)" }}>
              Forspranget genererer Instagram-captions automatisk fra boligdetaljene du allerede bruker. Mindre tid på tekst — mer tid på autentisk innhold.
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
