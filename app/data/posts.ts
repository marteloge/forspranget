export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  readTime: string;
  featured?: boolean;
}

export const posts: BlogPost[] = [
  {
    slug: "ai-endrer-meglerhverdagen",
    title: "Hvordan AI endrer hverdagen til norske eiendomsmeglere",
    description:
      "Bransjen er i endring. Meglere som tar i bruk AI bruker halve tiden på administrative oppgaver — og bruker resten på det som faktisk gir salg: relasjoner og rådgivning.",
    date: "Mars 2026",
    tag: "AI & Bransje",
    readTime: "6 min",
    featured: true,
  },
  {
    slug: "boligtekst-med-ai",
    title: "Spar tid på boligtekster med AI — slik gjør du det",
    description:
      "En gjennomsnittlig boligtekst tar 30–60 minutter å skrive. Med riktig AI-verktøy tar det 3. Her er den praktiske guiden til hvordan norske meglere skriver bedre tekster på kortere tid.",
    date: "Mars 2026",
    tag: "Praktisk guide",
    readTime: "5 min",
  },
  {
    slug: "hva-er-prospektering",
    title: "Hva er prospektering, og hvorfor bør meglere gjøre det smartere?",
    description:
      "De beste meglerne venter ikke på at kundene skal ringe. De identifiserer potensielle selgere før de legger ut boligen — og kontakter dem i riktig øyeblikk. Slik fungerer moderne prospektering.",
    date: "Mars 2026",
    tag: "Prospektering",
    readTime: "7 min",
  },
];
