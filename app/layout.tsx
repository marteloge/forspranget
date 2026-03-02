import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
      <head>
        <script
          defer
          src="https://umami-ten-fawn.vercel.app/script.js"
          data-website-id="00b111b1-8f74-4372-bee2-33d9da21daa9"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
