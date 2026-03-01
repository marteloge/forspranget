import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
