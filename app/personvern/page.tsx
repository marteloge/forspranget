import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personvernerklæring — Forspranget",
  description: "Personvernerklæring for Forspranget. Hvordan vi samler inn, bruker og beskytter dine personopplysninger.",
  alternates: {
    canonical: "https://forspranget.no/personvern",
  },
};

export default function PersonvernPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-[#c9a96e]/80 hover:text-[#c9a96e] transition-colors">
            ← Forspranget
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl mb-3 tracking-tight">
          Personvernerklæring
        </h1>
        <p className="text-gray-500 text-sm mb-12">Sist oppdatert: 2. mars 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Behandlingsansvarlig</h2>
            <p>
              Forspranget behandler personopplysninger i forbindelse med drift av tjenesten på forspranget.no.
              Ved spørsmål om personvern, ta kontakt på{" "}
              <a href="mailto:hei@forspranget.no" className="text-[#c9a96e] hover:underline">hei@forspranget.no</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Hvilke opplysninger samler vi inn?</h2>
            <p className="mb-3">Vi samler inn følgende opplysninger:</p>
            <ul className="space-y-2 list-none">
              {[
                ["Venteliste", "Navn, e-postadresse, rolle (selvstendig/kjede) og by/kontor — oppgitt frivillig når du melder deg på ventelisten."],
                ["Bruksdata", "Anonymisert trafikk- og bruksstatistikk via Umami Analytics. Ingen cookies, ingen fingerprinting, GDPR-compliant."],
                ["Generert innhold", "Adresse og boligdetaljer du fyller inn ved bruk av AI Boligtekst. Disse lagres ikke permanent."],
              ].map(([tittel, tekst]) => (
                <li key={tittel as string} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <span className="text-[#c9a96e] font-medium text-sm">{tittel as string}: </span>
                  <span className="text-gray-400 text-sm">{tekst as string}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Formål og rettslig grunnlag</h2>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                <span className="text-gray-300">Venteliste:</span> E-post og navn brukes til å kontakte deg
                når beta-tilgang er tilgjengelig. Rettslig grunnlag: samtykke (GDPR art. 6(1)(a)).
              </p>
              <p>
                <span className="text-gray-300">Analysedata:</span> Brukes til å forstå hvordan tjenesten
                brukes og forbedre produktet. Rettslig grunnlag: berettiget interesse (GDPR art. 6(1)(f)).
                Umami samler ikke inn personlig identifiserbar informasjon.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Lagring og sikkerhet</h2>
            <p className="text-sm text-gray-400">
              Venteliste-data lagres i en kryptert database (Neon Postgres) i EU (Frankfurt).
              Vi bruker SSL/TLS for all dataoverføring. Data slettes senest 2 år etter innsamling,
              eller på forespørsel.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Deling med tredjeparter</h2>
            <p className="text-sm text-gray-400 mb-3">
              Vi deler ikke dine personopplysninger med tredjeparter, med unntak av:
            </p>
            <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
              <li>Neon (databaselagring) — EU-region</li>
              <li>Vercel (hosting) — EU-region</li>
              <li>OpenAI (AI-tekstgenerering) — kun boliginformasjon du oppgir, ikke persondata</li>
              <li>Umami (anonymisert analyse) — EU-region</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Dine rettigheter</h2>
            <p className="text-sm text-gray-400 mb-3">
              I henhold til GDPR har du rett til å:
            </p>
            <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
              <li>Få innsyn i hvilke opplysninger vi har om deg</li>
              <li>Kreve retting av uriktige opplysninger</li>
              <li>Kreve sletting av dine opplysninger (&quot;retten til å bli glemt&quot;)</li>
              <li>Trekke tilbake samtykke når som helst</li>
              <li>Klage til Datatilsynet (datatilsynet.no)</li>
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              For å utøve disse rettighetene, send e-post til{" "}
              <a href="mailto:hei@forspranget.no" className="text-[#c9a96e] hover:underline">hei@forspranget.no</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Cookies</h2>
            <p className="text-sm text-gray-400">
              Forspranget bruker kun én funksjonell cookie (<code className="text-[#c9a96e]">crm_agent</code>)
              for innlogging til CRM-verktøyet. Denne er nødvendig for tjenestens funksjon og krever
              ikke samtykke. Vi bruker ingen sporingscookies eller tredjeparts reklamecookies.
              Umami Analytics er cookie-fri.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Endringer</h2>
            <p className="text-sm text-gray-400">
              Denne personvernerklæringen kan oppdateres ved vesentlige endringer i tjenesten.
              Vi vil varsle registrerte brukere per e-post ved slike endringer.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            href="/"
            className="text-sm text-[#c9a96e]/70 hover:text-[#c9a96e] transition-colors"
          >
            ← Tilbake til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
