import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 3) {
    return Response.json({ adresser: [] });
  }

  // GeoNorge address search — gratis, ingen API-nøkkel nødvendig
  const url =
    `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(q)}&fuzzy=true&treffPerSide=6&utkoordsys=4326`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return Response.json({ adresser: [] });

    const data = await res.json();

    const adresser = (data.adresser || [])
      .map((a: Record<string, unknown>) => {
        const repr = a.representasjonspunkt as { lat?: number; lon?: number } | undefined;
        return {
          tekst: `${a.adressetekst}, ${a.postnummer} ${a.poststed}`,
          lat: repr?.lat,
          lon: repr?.lon,
          kommunenavn: a.kommunenavn,
        };
      })
      .filter((a: { lat?: number; lon?: number }) => a.lat && a.lon);

    return Response.json({ adresser });
  } catch {
    return Response.json({ adresser: [] });
  }
}
