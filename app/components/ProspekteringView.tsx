"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface Property {
  id: number;
  address: string;
  poststed: string;
  kommunenummer: string;
  gnr: number;
  bnr: number;
  matrikkelnr: string;
  lat: number;
  lon: number;
  soldYear: number;
  yearsSold: number;
  ownerName: string;
  ownerAge: number;
  boligtype: string;
}

interface MarkerEntry {
  marker: L.Marker;
  property: Property;
  dotEl: HTMLDivElement | null;
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const CURRENT_YEAR = 2026;

const NORSK_NAVN = [
  "Kari Olsen", "Per Hansen", "Anne Johansen", "Lars Andersen",
  "Marit Pedersen", "Erik Nilsen", "Ingrid Berg", "Tor Kristiansen",
  "Hanne Larsen", "Bjørn Haugen", "Solveig Moen", "Geir Dahl",
  "Britt Halvorsen", "Svein Lund", "Astrid Jacobsen", "Helge Sørensen",
  "Gunn Eriksen", "Rolf Thorsen", "Sissel Jensen", "Arne Pettersen",
  "Tove Bakke", "Jon Henriksen", "Berit Lie", "Nils Christiansen",
  "Eva Mathisen", "Finn Karlsen", "Aud Svensson", "Terje Lindberg",
  "Ruth Holm", "Knut Martinsen",
];

const TYPER = ["Enebolig", "Rekkehus", "Leilighet", "Tomannsbolig", "Selveierleilighet"];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function mockFromSeed(seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0x80000000;
  };

  const yearsSold = Math.floor(rand() * 40) + 1;
  const soldYear = CURRENT_YEAR - yearsSold;
  const ownerName = NORSK_NAVN[Math.floor(rand() * NORSK_NAVN.length)];
  const ownerAge = Math.floor(55 + rand() * 30);
  const boligtype = TYPER[Math.floor(rand() * TYPER.length)];
  return { soldYear, yearsSold, ownerName, ownerAge, boligtype };
}

function ageColor(years: number): string {
  if (years >= 20) return "#ef4444";
  if (years >= 10) return "#c9a96e";
  return "#60a5fa";
}

function ageDotClass(years: number): string {
  if (years >= 20) return "bg-red-500";
  if (years >= 10) return "bg-[#c9a96e]";
  return "bg-blue-400";
}

function ageTagStyle(years: number): string {
  if (years >= 20) return "bg-red-500/10 text-red-400 border-red-500/20";
  if (years >= 10) return "bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/20";
  return "bg-blue-400/10 text-blue-400 border-blue-400/20";
}

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function ProspekteringView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerEntriesRef = useRef<MarkerEntry[]>([]);

  const [query, setQuery] = useState("Thorvald Meyers gate");
  const [yearFilter, setYearFilter] = useState(2010);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<"age" | "street">("age");
  const [searched, setSearched] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedId) ?? null;

  // ── Init map (once) ──
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [59.9256, 10.7553],
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    const darkTiles = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    );

    darkTiles.on("tileerror", () => {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
    });

    darkTiles.addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Create markers when properties change (NOT on filter change) ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    markerEntriesRef.current.forEach((e) => map.removeLayer(e.marker));
    markerEntriesRef.current = [];

    // Create new markers
    properties.forEach((p) => {
      const color = ageColor(p.yearsSold);

      const icon = L.divIcon({
        className: "",
        html: `<div class="marker-dot" style="
          width:14px;height:14px;border-radius:50%;
          background:${color};border:2px solid rgba(255,255,255,0.7);
          box-shadow:0 2px 8px rgba(0,0,0,0.4);
          opacity:1;
          transition: opacity 0.2s ease;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([p.lat, p.lon], { icon })
        .addTo(map)
        .on("click", () => setSelectedId(p.id));

      // Get the actual DOM element for fast opacity updates
      const el = marker.getElement();
      const dotEl = el?.querySelector(".marker-dot") as HTMLDivElement | null;

      markerEntriesRef.current.push({ marker, property: p, dotEl });
    });
  }, [properties]);

  // ── Update marker opacity when filter changes (no re-creation!) ──
  useEffect(() => {
    markerEntriesRef.current.forEach(({ property, dotEl }) => {
      if (!dotEl) return;
      const isVisible = property.soldYear <= yearFilter;
      dotEl.style.opacity = isVisible ? "1" : "0.1";
    });
  }, [yearFilter]);

  // ── Search ──
  const doSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelectedId(null);
    setProperties([]);

    try {
      const url = `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(query.trim())}&treffPerSide=50&side=1`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.adresser || data.adresser.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      const seen = new Set<string>();
      const results: Property[] = data.adresser
        .filter((a: Record<string, unknown>) => {
          const key = `${a.kommunenummer}-${a.gardsnummer}/${a.bruksnummer}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((a: Record<string, unknown>, i: number) => {
          const gnr = a.gardsnummer as number;
          const bnr = a.bruksnummer as number;
          const seed = gnr * 10000 + bnr + i;
          const mock = mockFromSeed(seed);
          const punkt = a.representasjonspunkt as { lat: number; lon: number } | null;
          return {
            id: i,
            address: a.adressetekst as string,
            poststed: a.poststed as string,
            kommunenummer: a.kommunenummer as string,
            gnr,
            bnr,
            matrikkelnr: `${a.kommunenummer}-${gnr}/${bnr}/0/0`,
            lat: punkt?.lat ?? 0,
            lon: punkt?.lon ?? 0,
            ...mock,
          };
        })
        .filter((p: Property) => p.lat && p.lon);

      if (results.length > 0 && mapInstanceRef.current) {
        const lats = results.map((p: Property) => p.lat);
        const lons = results.map((p: Property) => p.lon);
        mapInstanceRef.current.fitBounds(
          [
            [Math.min(...lats) - 0.001, Math.min(...lons) - 0.001],
            [Math.max(...lats) + 0.001, Math.max(...lons) + 0.001],
          ],
          { padding: [20, 20] }
        );
      }

      setProperties(results);
    } catch (e) {
      console.error("Search failed:", e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Auto-search on mount
  useEffect(() => {
    const timer = setTimeout(doSearch, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortMode === "age") return a.soldYear - b.soldYear;
    return a.address.localeCompare(b.address);
  });

  const filtered = sortedProperties.filter((p) => p.soldYear <= yearFilter);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    const p = properties.find((x) => x.id === id);
    if (p && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([p.lat, p.lon], 17, { duration: 0.8 });
    }
  };

  return (
    <div className="flex h-[calc(100vh-52px)] bg-[#0a0e1a]">
      {/* ── SIDEBAR ── */}
      <aside className="w-[380px] min-w-[380px] bg-[#0d1220] border-r border-white/[0.06] flex flex-col overflow-hidden">
        {/* Search area */}
        <div className="p-5 border-b border-white/[0.06]">
          <h2 className="text-[10px] text-[#c9a96e]/60 uppercase tracking-[0.25em] mb-4">
            Finn potensielle selgere
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Gate, bydel eller postnummer..."
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a96e]/30 transition-colors"
            />
            <button
              onClick={doSearch}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Søk"}
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 tracking-wide">Ikke solgt siden</span>
              <span className="font-semibold text-white tabular-nums">{yearFilter}</span>
            </div>
            <input
              type="range"
              min={1980}
              max={2018}
              value={yearFilter}
              onChange={(e) => setYearFilter(Number(e.target.value))}
              className="w-full accent-[#c9a96e]"
            />
          </div>
        </div>

        {/* Results header */}
        {searched && properties.length > 0 && (
          <div className="px-5 py-3 border-b border-white/[0.06] flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <span className="text-white font-semibold">{filtered.length}</span> av{" "}
              <span className="text-white font-semibold">{properties.length}</span> eiendommer
            </div>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as "age" | "street")}
              className="text-[11px] bg-white/[0.03] border border-white/[0.08] rounded px-2 py-1 text-gray-400 cursor-pointer"
            >
              <option value="age">Eldst salg først</option>
              <option value="street">Gate A–Å</option>
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm">
            <div className="w-8 h-8 border-2 border-white/[0.06] border-t-[#c9a96e] rounded-full animate-spin mb-3" />
            <span className="text-xs tracking-wide">Henter data fra Kartverket...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && properties.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-sm p-8 text-center">
            <svg className="w-10 h-10 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Ingen eiendommer funnet. Prøv et annet søk.
          </div>
        )}

        {/* Property list */}
        {!loading && filtered.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`w-full text-left px-5 py-3.5 border-b border-white/[0.04] flex gap-3 items-start transition-all duration-200 hover:bg-white/[0.03] ${
                  selectedId === p.id
                    ? "bg-[#c9a96e]/[0.06] border-l-2 border-l-[#c9a96e]"
                    : ""
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${ageDotClass(p.yearsSold)}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{p.address}</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    {p.poststed} &middot; {p.ownerName}
                  </div>
                  <span
                    className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${ageTagStyle(p.yearsSold)}`}
                  >
                    {p.yearsSold} år siden salg
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No filter matches */}
        {!loading && properties.length > 0 && filtered.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm p-8 text-center">
            Ingen treff for valgt filter. Juster årstallet.
          </div>
        )}

        {/* Initial empty state */}
        {!loading && !searched && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-sm p-8 text-center">
            <svg className="w-10 h-10 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Søk etter en gate eller bydel for å finne potensielle selgere.
          </div>
        )}

        {/* Data note */}
        <div className="px-5 py-2.5 bg-white/[0.01] border-t border-white/[0.06] text-[10px] text-gray-600 tracking-wide">
          Adresser: Kartverket &middot; Eierinfo: simulert for demo
        </div>
      </aside>

      {/* ── MAP ── */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-[#0d1220]/90 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 z-[1000]">
          <div className="text-[10px] text-[#c9a96e]/60 uppercase tracking-[0.2em] mb-3">
            Salgssannsynlighet
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>20+ år — Høy</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-full bg-[#c9a96e]" />
              <span>10–20 år — Middels</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-full bg-blue-400" />
              <span>Under 10 år — Lav</span>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedProperty && (
          <div className="absolute bottom-6 right-6 w-[320px] bg-[#0d1220] border border-white/[0.08] rounded-2xl shadow-2xl z-[1000] overflow-hidden glow-gold">
            <div className="bg-[#0a0e1a] px-5 py-4 flex justify-between items-start border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white leading-snug pr-3">
                {selectedProperty.address}
              </h3>
              <button
                onClick={() => setSelectedId(null)}
                className="text-gray-600 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4">
              {[
                ["Matrikkelnummer", selectedProperty.matrikkelnr],
                ["Boligtype", selectedProperty.boligtype],
                ["Sist tinglyst salg", String(selectedProperty.soldYear)],
                ["År siden salg", `${selectedProperty.yearsSold} år`],
                ["Registrert eier", selectedProperty.ownerName],
                ["Alder (estimert)", `ca. ${selectedProperty.ownerAge} år`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-2.5 border-b border-white/[0.04] last:border-b-0"
                >
                  <span className="text-[11px] text-gray-500">{label}</span>
                  <span className="text-[11px] font-medium text-white text-right">{value}</span>
                </div>
              ))}
              <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
                Forbered kontakt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
