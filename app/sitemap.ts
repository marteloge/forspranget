import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import { join } from "path";

const BASE = "https://forspranget.no";
const NOW = new Date("2026-03-02");

function getBloggSlugs(): string[] {
  try {
    const dir = join(process.cwd(), "app/blogg");
    return readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const bloggSlugs = getBloggSlugs();

  return [
    // ── Kjernessider ─────────────────────────────────────────────────────
    { url: BASE,                     lastModified: NOW, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/boligtekst`,     lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/prospektering`,  lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blogg`,          lastModified: NOW, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/personvern`,     lastModified: NOW, changeFrequency: "yearly",  priority: 0.3 },

    // ── Bloggposter (auto-oppdaget fra app/blogg/ ved build) ─────────────
    ...bloggSlugs.map((slug) => ({
      url: `${BASE}/blogg/${slug}`,
      lastModified: NOW,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
