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
  {
    slug: "leads-etter-visning",
    title: "87 % av leads forsvinner etter visning — slik stopper du det",
    description:
      "I Bergen selges boliger på 23 dager. I Fredrikstad tar det 136. Forskjellen er ikke bare markedet — det er hva meglerne gjør etter visningen. Her er systemet som skiller toppmeglerne fra resten.",
    date: "Mars 2026",
    tag: "Leads & CRM",
    readTime: "6 min",
  },
  {
    slug: "instagram-for-eiendomsmeglere",
    title: "Instagram for norske eiendomsmeglere: Den komplette guiden (2026)",
    description:
      "80 % av boligkjøpere bruker sosiale medier i boligjakten. Autentisk innhold slår polerte annonser. Her er hva norske toppmeglere gjør på Instagram — og hvordan du bygger din profil uten å bruke timer på innhold.",
    date: "Mars 2026",
    tag: "Sosiale medier",
    readTime: "7 min",
  },
  {
    slug: "energimerking-2026",
    title: "Energimerking 2026: Hva norske kjøpere faktisk ser etter",
    description:
      "Ny A–G energimerkeordning er innført fra januar 2026. 4 av 10 kjøpere sier energimerket påvirker kjøpsbeslutningen. Her er hva meglere bør fremheve i boligannonsen — og markedsforskjellene du bør kjenne til.",
    date: "Mars 2026",
    tag: "Boligmarkedet 2026",
    readTime: "5 min",
  },
];
