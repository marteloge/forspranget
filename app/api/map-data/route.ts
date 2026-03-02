import { NextRequest } from "next/server";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distanceText(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function parseDist(d: string): number {
  if (d.endsWith(" m")) return parseInt(d) / 1000;
  return parseFloat(d);
}

// Norske bysentra (for sentrumsavstand)
const CITY_CENTERS = [
  { name: "Oslo sentrum", lat: 59.9139, lon: 10.7522 },
  { name: "Bergen sentrum", lat: 60.3913, lon: 5.3221 },
  { name: "Trondheim sentrum", lat: 63.4305, lon: 10.3951 },
  { name: "Stavanger sentrum", lat: 58.97, lon: 5.7331 },
  { name: "Tromsø sentrum", lat: 69.6496, lon: 18.956 },
  { name: "Kristiansand sentrum", lat: 58.1462, lon: 7.9957 },
  { name: "Drammen sentrum", lat: 59.744, lon: 10.2045 },
  { name: "Fredrikstad sentrum", lat: 59.2118, lon: 10.9298 },
  { name: "Sandnes sentrum", lat: 58.8515, lon: 5.7352 },
  { name: "Sarpsborg sentrum", lat: 59.2844, lon: 11.1094 },
  { name: "Bodø sentrum", lat: 67.2803, lon: 14.405 },
  { name: "Ålesund sentrum", lat: 62.4722, lon: 6.1549 },
  { name: "Tønsberg sentrum", lat: 59.2672, lon: 10.4076 },
  { name: "Moss sentrum", lat: 59.4343, lon: 10.658 },
  { name: "Hamar sentrum", lat: 60.7945, lon: 11.0674 },
];

// ── HANDLER ───────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") || "");
  const lon = parseFloat(request.nextUrl.searchParams.get("lon") || "");

  if (isNaN(lat) || isNaN(lon)) {
    return Response.json({ error: "Ugyldig koordinater" }, { status: 400 });
  }

  // Nærmeste bysentrum
  let nearestCity = CITY_CENTERS[0];
  let minDist = Infinity;
  for (const city of CITY_CENTERS) {
    const d = haversineKm(lat, lon, city.lat, city.lon);
    if (d < minDist) {
      minDist = d;
      nearestCity = city;
    }
  }

  // Overpass API — henter POI-data fra OpenStreetMap (gratis)
  const overpassQuery = `[out:json][timeout:15];
(
  node["amenity"="school"](around:1500,${lat},${lon});
  way["amenity"="school"](around:1500,${lat},${lon});
  node["amenity"="kindergarten"](around:1000,${lat},${lon});
  way["amenity"="kindergarten"](around:1000,${lat},${lon});
  node["shop"~"supermarket|convenience|grocery|department_store"](around:600,${lat},${lon});
  node["highway"="bus_stop"](around:600,${lat},${lon});
  node["railway"~"station|tram_stop|subway_entrance|halt"](around:1200,${lat},${lon});
  node["amenity"="ferry_terminal"](around:1200,${lat},${lon});
);
out center;`;

  try {
    const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
      headers: { "Content-Type": "text/plain" },
      signal: AbortSignal.timeout(15000),
    });

    if (!overpassRes.ok) throw new Error("Overpass feilet");

    const data = await overpassRes.json();
    const elements: Record<string, unknown>[] = data.elements || [];

    type MapItem = { name: string; dist: string; distKm: number };
    type TransportItem = MapItem & { type: string };

    const skoler: MapItem[] = [];
    const barnehager: MapItem[] = [];
    const butikker: MapItem[] = [];
    const transport: TransportItem[] = [];

    for (const el of elements) {
      const tags = el.tags as Record<string, string> | undefined;
      const center = el.center as { lat: number; lon: number } | undefined;
      const elLat = (el.lat as number | undefined) ?? center?.lat;
      const elLon = (el.lon as number | undefined) ?? center?.lon;
      if (!elLat || !elLon || !tags) continue;

      const name = tags.name || tags["name:no"] || "";
      if (!name) continue;

      const km = haversineKm(lat, lon, elLat, elLon);
      const dist = distanceText(km);

      const amenity = tags.amenity;
      const highway = tags.highway;
      const railway = tags.railway;
      const shop = tags.shop;

      if (amenity === "school") {
        skoler.push({ name, dist, distKm: km });
      } else if (amenity === "kindergarten") {
        barnehager.push({ name, dist, distKm: km });
      } else if (shop) {
        butikker.push({ name, dist, distKm: km });
      } else if (highway === "bus_stop") {
        transport.push({ name, dist, distKm: km, type: "Buss" });
      } else if (railway || amenity === "ferry_terminal") {
        const rtype =
          amenity === "ferry_terminal"
            ? "Ferje"
            : railway === "subway_entrance"
              ? "T-bane"
              : railway === "tram_stop"
                ? "Trikk"
                : "Tog";
        transport.push({ name, dist, distKm: km, type: rtype });
      }
    }

    // Sorter og ta de nærmeste
    const sortFn = (a: MapItem, b: MapItem) => a.distKm - b.distKm;
    skoler.sort(sortFn);
    barnehager.sort(sortFn);
    butikker.sort(sortFn);
    transport.sort(sortFn);

    // Returner uten distKm (intern bruk)
    const clean = (arr: MapItem[]) => arr.slice(0, 5).map(({ name, dist }) => ({ name, dist }));
    const cleanTransport = (arr: TransportItem[]) =>
      arr.slice(0, 6).map(({ name, dist, type }) => ({ name, dist, type }));

    return Response.json({
      sentrum: { name: nearestCity.name, dist: distanceText(minDist) },
      skoler: clean(skoler),
      barnehager: clean(barnehager),
      butikker: clean(butikker),
      transport: cleanTransport(transport),
    });
  } catch (e) {
    console.error("Map data error:", e);
    return Response.json({ error: "Kunne ikke hente kartdata. Prøv igjen." }, { status: 500 });
  }
}
