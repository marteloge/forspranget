import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-playfair",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Forspranget — AI-verktøy for norske eiendomsmeglere",
  description:
    "Skriv boligtekster på 3 minutter, finn potensielle selgere før de legger ut på FINN, og aldri miste en lead igjen. Norskspråklig AI bygget for norske meglere.",
  keywords: "eiendomsmegler, AI, boligtekst, prospektering, CRM, Norge, FINN",
  openGraph: {
    title: "Forspranget — AI-verktøy for norske eiendomsmeglere",
    description:
      "Skriv boligtekster på 3 minutter. Finn potensielle selgere automatisk. Norskspråklig AI for meglere.",
    url: "https://forspranget.no",
    siteName: "Forspranget",
    locale: "nb_NO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
