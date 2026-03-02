"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface AddressSuggestion {
  tekst: string;
  gatenavn?: string;
  lat: number;
  lon: number;
  kommunenavn?: string;
}

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

// ── MAP STYLES ──────────────────────────────────────────────────────────────
interface TileStyle {
  name: string;
  url: string;
  attribution: string;
  subdomains?: string;
}

const TILE_STYLES: TileStyle[] = [
  {
    name: "Mørk",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
  },
  {
    name: "Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
  },
  {
    name: "Lys",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
  },
  {
    name: "Kartverket",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
    attribution: '&copy; <a href="https://kartverket.no">Kartverket</a>',
  },
];

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
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerEntriesRef = useRef<MarkerEntry[]>([]);

  const [query, setQuery] = useState("Thorvald Meyers gate");
  const [yearFilter, setYearFilter] = useState(2010);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<"age" | "street">("age");
  const [searched, setSearched] = useState(false);
  const [tileStyleIdx, setTileStyleIdx] = useState(2);

  // Address autocomplete
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validAddressSelected, setValidAddressSelected] = useState(true); // true on init (default query)
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // ── Swap tile layer when style changes ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const style = TILE_STYLES[tileStyleIdx];
    const opts: L.TileLayerOptions = {
      attribution: style.attribution,
      maxZoom: 20,
    };
    if (style.subdomains) opts.subdomains = style.subdomains;

    const layer = L.tileLayer(style.url, opts);
    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [tileStyleIdx]);

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

  // ── Address autocomplete ──
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setValidAddressSelected(false); // Reset until user picks from dropdown
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    if (val.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    suggestTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/address-search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSuggestions(data.adresser || []);
        setShowSuggestions((data.adresser || []).length > 0);
      } catch { /* ignore */ }
    }, 300);
  };

  const selectSuggestion = useCallback((s: AddressSuggestion) => {
    const searchTerm = s.gatenavn || s.tekst;
    setQuery(searchTerm);
    setSuggestions([]);
    setShowSuggestions(false);
    setValidAddressSelected(true);
    doSearchWithTerm(searchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doSearchWithTerm]);

  // Cleanup on unmount
  useEffect(() => () => { if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current); }, []);

  // ── Search (shared logic) ──
  const doSearchWithTerm = useCallback(async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelectedId(null);
    setProperties([]);

    try {
      const url = `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(term.trim())}&treffPerSide=50&side=1`;
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
  }, []);

  const doSearch = useCallback(() => doSearchWithTerm(query), [query, doSearchWithTerm]);

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
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Søk gate eller postnummer..."
                className={`w-full bg-white/[0.03] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  validAddressSelected
                    ? "border-white/[0.08] focus:border-[#c9a96e]/30"
                    : "border-white/[0.08] focus:border-white/20"
                }`}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1220] border border-white/[0.12] rounded-lg overflow-hidden z-50 shadow-2xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => selectSuggestion(s)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-[#c9a96e] transition-colors border-b border-white/[0.04] last:border-0 flex items-center gap-2"
                    >
                      <span className="text-[#c9a96e]/40 text-xs flex-shrink-0">📍</span>
                      <span className="truncate">{s.tekst}</span>
                    </button>
                  ))}
                </div>
              )}
              {!validAddressSelected && query.length >= 3 && (
                <p className="text-[10px] text-gray-600 mt-1 px-1">Velg en adresse fra listen</p>
              )}
            </div>
            <button
              onClick={doSearch}
              disabled={loading || !validAddressSelected}
              className="px-5 py-2.5 bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed self-start"
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
                  <div className="text-[11px] text-gray-600 mt-0.5 flex items-center gap-1">
                    {p.poststed} &middot; <span className="blur-[5px] select-none">{p.ownerName}</span>
                    <span className="text-[9px] bg-[#c9a96e]/15 text-[#c9a96e] px-1.5 py-px rounded font-semibold tracking-wide no-blur">PRO</span>
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

        {/* Legend + Map Style Picker */}
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

          {/* Map style switcher */}
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <div className="text-[10px] text-[#c9a96e]/60 uppercase tracking-[0.2em] mb-2">
              Kartstil
            </div>
            <div className="flex gap-1.5">
              {TILE_STYLES.map((style, idx) => (
                <button
                  key={style.name}
                  onClick={() => setTileStyleIdx(idx)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all duration-200 ${
                    tileStyleIdx === idx
                      ? "bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30"
                      : "bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300 hover:border-white/[0.12]"
                  }`}
                >
                  {style.name}
                </button>
              ))}
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
                ["Matrikkelnummer", selectedProperty.matrikkelnr, false],
                ["Boligtype", selectedProperty.boligtype, false],
                ["Sist tinglyst salg", String(selectedProperty.soldYear), false],
                ["År siden salg", `${selectedProperty.yearsSold} år`, false],
                ["Registrert eier", selectedProperty.ownerName, true],
                ["Alder (estimert)", `ca. ${selectedProperty.ownerAge} år`, true],
              ].map(([label, value, isPro]) => (
                <div
                  key={label as string}
                  className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-b-0"
                >
                  <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    {label as string}
                    {isPro && (
                      <span className="text-[8px] bg-[#c9a96e]/15 text-[#c9a96e] px-1.5 py-px rounded font-semibold tracking-wider">PRO</span>
                    )}
                  </span>
                  {isPro ? (
                    <span className="text-[11px] font-medium text-white text-right blur-[5px] select-none">{value as string}</span>
                  ) : (
                    <span className="text-[11px] font-medium text-white text-right">{value as string}</span>
                  )}
                </div>
              ))}

              {/* Pro upsell */}
              <div className="mt-4 mb-3 bg-[#c9a96e]/[0.06] border border-[#c9a96e]/15 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-3.5 h-3.5 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <span className="text-[11px] font-semibold text-[#c9a96e]">Oppgrader til Pro</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Se eierinfo, kontaktdetaljer og estimert alder. Forbered kontakt direkte.
                </p>
              </div>

              <button className="w-full py-2.5 bg-gradient-to-r from-[#c9a96e] to-[#dfc090] text-[#0a0e1a] font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
                Forbered kontakt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
