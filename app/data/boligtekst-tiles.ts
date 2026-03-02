// ── TYPES ────────────────────────────────────────────────────────────────────
export interface Tile {
  id: string;
  label: string;
  emoji: string;
}

export interface TileGroup {
  bolig_features: Tile[];
  omrade_features: Tile[];
  livsstil: Tile[];
}

export interface Audience {
  id: string;
  label: string;
  emoji: string;
}

// ── AUDIENCES ────────────────────────────────────────────────────────────────
export const AUDIENCES: Audience[] = [
  { id: "barnefamilier", label: "Barnefamilier", emoji: "👨‍👩‍👧‍👦" },
  { id: "forstegangskjopere", label: "Førstegangskjøpere", emoji: "🔑" },
  { id: "par_uten_barn", label: "Par uten barn", emoji: "💑" },
  { id: "seniorer", label: "Seniorer", emoji: "🏡" },
  { id: "single_profesjonell", label: "Unge profesjonelle", emoji: "💼" },
  { id: "investorer", label: "Investorer", emoji: "📈" },
  { id: "downsizere", label: "Downsizere", emoji: "🔄" },
  { id: "naturelskere", label: "Friluftsfolk", emoji: "🏔️" },
];

// ── AUDIENCE-SPECIFIC TILES ──────────────────────────────────────────────────
export const AUDIENCE_TILES: Record<string, TileGroup> = {
  barnefamilier: {
    bolig_features: [
      { id: "stor_hage", label: "Stor hage", emoji: "🌳" },
      { id: "mange_soverom", label: "4+ soverom", emoji: "🛏️" },
      { id: "ekstra_bad", label: "Flere bad", emoji: "🚿" },
      { id: "garasje_bf", label: "Garasje", emoji: "🚗" },
      { id: "bod_lagring", label: "God lagring", emoji: "📦" },
      { id: "praktisk_planlosning", label: "Praktisk planløsning", emoji: "📐" },
      { id: "barnerom", label: "Gode barnerom", emoji: "🧸" },
      { id: "kjellerstue", label: "Kjellerstue", emoji: "🎮" },
      { id: "vaskerom", label: "Eget vaskerom", emoji: "👕" },
      { id: "terrasse_bf", label: "Terrasse/uteplass", emoji: "☀️" },
    ],
    omrade_features: [
      { id: "god_skolekrets", label: "God skolekrets", emoji: "🏫" },
      { id: "barnehage_naert", label: "Nær barnehage", emoji: "🎨" },
      { id: "lekeplass", label: "Lekeplass", emoji: "🛝" },
      { id: "trygt_nabolag", label: "Trygt nabolag", emoji: "🛡️" },
      { id: "lite_trafikk", label: "Lite trafikk", emoji: "🚸" },
      { id: "tursti_naert", label: "Turstier/marka", emoji: "🌲" },
      { id: "idrettslag", label: "Idrettsanlegg", emoji: "⚽" },
      { id: "familier_i_nabolag", label: "Barnefamilier i området", emoji: "👪" },
      { id: "gang_sykkelsti", label: "Trygg skolevei", emoji: "🚴" },
    ],
    livsstil: [
      { id: "plass_til_vekst", label: "Plass å vokse", emoji: "📈" },
      { id: "godt_naboskap", label: "Godt naboskap", emoji: "🤝" },
      { id: "hageglede", label: "Hageglede", emoji: "🌷" },
      { id: "rolig_gate", label: "Rolig blindvei", emoji: "🏘️" },
    ],
  },
  forstegangskjopere: {
    bolig_features: [
      { id: "lave_felleskostnader_fk", label: "Lave fellesk.", emoji: "💰" },
      { id: "lav_fellesgjeld_fk", label: "Lav fellesgjeld", emoji: "📉" },
      { id: "nyoppusset_fk", label: "Nyoppusset", emoji: "✨" },
      { id: "oppussingspotensial", label: "Potensial", emoji: "🔨" },
      { id: "balkong_fk", label: "Balkong", emoji: "🌞" },
      { id: "smart_planlosning", label: "Smart planløsning", emoji: "📐" },
      { id: "lys_leilighet", label: "Lys og luftig", emoji: "☀️" },
      { id: "bod_fk", label: "Egen bod", emoji: "📦" },
      { id: "heis_fk", label: "Heis", emoji: "🛗" },
      { id: "pent_bad", label: "Pent bad", emoji: "🚿" },
    ],
    omrade_features: [
      { id: "kollektivt_naert", label: "Nær kollektiv", emoji: "🚇" },
      { id: "sentralt_fk", label: "Sentralt", emoji: "📍" },
      { id: "prisgunstig_omrade", label: "Omr. i utvikling", emoji: "🏗️" },
      { id: "naert_jobb", label: "Nær jobbsentrum", emoji: "🏢" },
      { id: "dagligvare", label: "Nær butikk", emoji: "🛒" },
      { id: "trendy_nabolag", label: "Populært strøk", emoji: "🔥" },
    ],
    livsstil: [
      { id: "verdiokning", label: "Verdistigningspot.", emoji: "📈" },
      { id: "ferdig_innflytting", label: "Klar for innflytting", emoji: "🎉" },
      { id: "lett_vedlikehold", label: "Vedlikeholdsfritt", emoji: "✅" },
      { id: "godt_borettslag", label: "Godt borettslag", emoji: "🏢" },
      { id: "mye_for_pengene", label: "Mye for pengene", emoji: "💎" },
    ],
  },
  par_uten_barn: {
    bolig_features: [
      { id: "moderne_kjoekken", label: "Moderne kjøkken", emoji: "🍳" },
      { id: "apen_planlosning", label: "Åpen planløsning", emoji: "📐" },
      { id: "designbad", label: "Designbad", emoji: "🛁" },
      { id: "stor_balkong_dink", label: "Stor balkong", emoji: "🌞" },
      { id: "takterrasse", label: "Takterrasse", emoji: "🏙️" },
      { id: "walkincloset", label: "Walk-in closet", emoji: "👗" },
      { id: "peis_dink", label: "Peis/ildsted", emoji: "🔥" },
      { id: "hoy_standard", label: "Høy standard", emoji: "✨" },
      { id: "utsikt_dink", label: "Fin utsikt", emoji: "🌅" },
    ],
    omrade_features: [
      { id: "kafeliv", label: "Kafeer/restauranter", emoji: "☕" },
      { id: "sentral_beliggenhet", label: "Sentral beliggenhet", emoji: "📍" },
      { id: "kulturtilbud", label: "Kulturtilbud", emoji: "🎭" },
      { id: "treningssenter", label: "Treningssenter", emoji: "🏋️" },
      { id: "parker_groent", label: "Parker/grøntareal", emoji: "🌳" },
      { id: "gangavstand_alt", label: "Alt i gangavstand", emoji: "🚶" },
    ],
    livsstil: [
      { id: "urban_livsstil", label: "Urban livsstil", emoji: "🏙️" },
      { id: "stilrent", label: "Stilrent og moderne", emoji: "🖤" },
      { id: "underholdning", label: "Fint for gjester", emoji: "🥂" },
      { id: "helgekos", label: "Hjemmekos", emoji: "🕯️" },
    ],
  },
  seniorer: {
    bolig_features: [
      { id: "heis_senior", label: "Heis", emoji: "🛗" },
      { id: "ett_plan", label: "Alt på ett plan", emoji: "🏠" },
      { id: "livsloepsstandard", label: "Livsløpsstandard", emoji: "♿" },
      { id: "trinnfri", label: "Trinnfri adkomst", emoji: "🚪" },
      { id: "romslig_bad", label: "Romslig bad", emoji: "🚿" },
      { id: "lettstelt", label: "Lettstelt bolig", emoji: "✅" },
      { id: "balkong_solrikt", label: "Solrik balkong", emoji: "☀️" },
      { id: "varmekabler_senior", label: "Gulvvarme", emoji: "🌡️" },
      { id: "garasje_kjeller", label: "Garasje i kjeller", emoji: "🚗" },
    ],
    omrade_features: [
      { id: "gangavstand_butikk", label: "Butikk i gangavst.", emoji: "🛒" },
      { id: "helsetjenester", label: "Nær helsetjenester", emoji: "🏥" },
      { id: "kollektivt_senior", label: "Nær kollektiv", emoji: "🚌" },
      { id: "apotek", label: "Apotek nært", emoji: "💊" },
      { id: "turmulig", label: "Turmuligheter", emoji: "🚶" },
      { id: "rolig_omrade", label: "Rolig område", emoji: "🤫" },
    ],
    livsstil: [
      { id: "fellesskap", label: "Sosialt fellesskap", emoji: "🤝" },
      { id: "trygghet_senior", label: "Trygt og rolig", emoji: "🛡️" },
      { id: "vedlikeholdsfritt_senior", label: "Vedlikeholdsfritt", emoji: "🔧" },
      { id: "gjesterom", label: "Plass til gjester", emoji: "🛏️" },
      { id: "kjent_nabolag", label: "Etablert nabolag", emoji: "🏘️" },
    ],
  },
  single_profesjonell: {
    bolig_features: [
      { id: "kompakt_smart", label: "Kompakt og smart", emoji: "📐" },
      { id: "moderne_standard", label: "Moderne standard", emoji: "✨" },
      { id: "balkong_sp", label: "Balkong", emoji: "🌞" },
      { id: "apen_losning", label: "Åpen løsning", emoji: "🏠" },
      { id: "nytt_bad_sp", label: "Nytt bad", emoji: "🚿" },
      { id: "pent_kjoekken", label: "Pent kjøkken", emoji: "🍳" },
      { id: "hjemmekontor", label: "Hjemmekontor", emoji: "💻" },
    ],
    omrade_features: [
      { id: "byliv", label: "Midt i bylivet", emoji: "🏙️" },
      { id: "uteliv", label: "Nær uteliv", emoji: "🍸" },
      { id: "trening_sp", label: "Treningssenter", emoji: "🏋️" },
      { id: "kollektiv_sp", label: "God kollektiv", emoji: "🚇" },
      { id: "sykkelavstand", label: "Sykkelavstand jobb", emoji: "🚴" },
      { id: "hipt_strok", label: "Populært strøk", emoji: "🔥" },
    ],
    livsstil: [
      { id: "lavt_vedlikehold_sp", label: "Lite vedlikehold", emoji: "✅" },
      { id: "starten_boligkarriere", label: "God førstebolig", emoji: "🔑" },
      { id: "sosial_beliggenhet", label: "Sosialt og sentralt", emoji: "🎉" },
      { id: "jobbnaerhet", label: "Kort vei til jobb", emoji: "⏱️" },
    ],
  },
  investorer: {
    bolig_features: [
      { id: "lave_fellesk_inv", label: "Lave fellesk.", emoji: "💰" },
      { id: "lav_fellesgjeld_inv", label: "Lav fellesgjeld", emoji: "📉" },
      { id: "god_yield", label: "God leieinntekt", emoji: "💵" },
      { id: "utleiemulighet", label: "Utleiemulighet", emoji: "🔑" },
      { id: "todelt_losning", label: "Todelt løsning", emoji: "🏠" },
      { id: "sokkelleilighet", label: "Sokkelleilighet", emoji: "🏡" },
      { id: "lett_utleibart", label: "Lett utleibart", emoji: "✅" },
      { id: "energieffektivt", label: "Energieffektivt", emoji: "⚡" },
    ],
    omrade_features: [
      { id: "studentby_naert", label: "Nær studentby", emoji: "🎓" },
      { id: "sentralt_etterspurt", label: "Etterspurt område", emoji: "📍" },
      { id: "naer_kollektiv_inv", label: "God kollektiv", emoji: "🚇" },
      { id: "naer_sykehus", label: "Nær sykehus/jobb", emoji: "🏥" },
      { id: "prisutvikling", label: "God prisutvikl.", emoji: "📈" },
      { id: "omraade_i_vekst", label: "Område i vekst", emoji: "🏗️" },
    ],
    livsstil: [
      { id: "verdistigning_inv", label: "Verdistigningspot.", emoji: "📈" },
      { id: "god_avkastning", label: "God avkastning", emoji: "💎" },
      { id: "popularitet_inv", label: "Populær hos leietakere", emoji: "🔥" },
    ],
  },
  downsizere: {
    bolig_features: [
      { id: "hoy_standard_ds", label: "Høy standard", emoji: "✨" },
      { id: "romslig_leilighet", label: "Romslig leilighet", emoji: "📐" },
      { id: "stor_balkong_ds", label: "Stor balkong", emoji: "🌞" },
      { id: "to_soverom", label: "2-3 soverom", emoji: "🛏️" },
      { id: "peis_ds", label: "Peis", emoji: "🔥" },
      { id: "heis_ds", label: "Heis", emoji: "🛗" },
      { id: "garasje_ds", label: "Garasjeplass", emoji: "🚗" },
      { id: "lekkert_bad", label: "Lekkert bad", emoji: "🛁" },
      { id: "kvalitetskjokken", label: "Kvalitetskjøkken", emoji: "🍳" },
    ],
    omrade_features: [
      { id: "sentrumsnært_ds", label: "Sentrumsnært", emoji: "📍" },
      { id: "gangavstand_ds", label: "Alt i gangavstand", emoji: "🚶" },
      { id: "kulturliv", label: "Kulturliv", emoji: "🎭" },
      { id: "restaurant", label: "Restauranter", emoji: "🍽️" },
      { id: "park_ds", label: "Nær park", emoji: "🌳" },
      { id: "kollektivt_ds", label: "God kollektiv", emoji: "🚌" },
    ],
    livsstil: [
      { id: "frigjor_kapital", label: "Frigjør kapital", emoji: "💰" },
      { id: "vedlikeholdsfritt_ds", label: "Slipper vedlikehold", emoji: "🔧" },
      { id: "gjesterom_ds", label: "Plass til barnebarn", emoji: "👶" },
      { id: "ny_start", label: "Ny livsfase", emoji: "🌅" },
      { id: "sosialt_ds", label: "Sosialt nabolag", emoji: "🤝" },
    ],
  },
  naturelskere: {
    bolig_features: [
      { id: "stor_tomt", label: "Stor tomt", emoji: "🌲" },
      { id: "garasje_bod_nat", label: "Garasje + bod", emoji: "🚗" },
      { id: "ski_bod", label: "Skirom/sportsbod", emoji: "🎿" },
      { id: "peisestue", label: "Peis/vedovn", emoji: "🔥" },
      { id: "uteplass_nat", label: "Stor uteplass", emoji: "☀️" },
      { id: "solrikt_nat", label: "Solrikt", emoji: "🌞" },
      { id: "vaskemuligheter", label: "Grovkjøkken", emoji: "👢" },
    ],
    omrade_features: [
      { id: "marka_naert_nat", label: "Nær marka", emoji: "🌲" },
      { id: "skiloype", label: "Skiløyper", emoji: "🎿" },
      { id: "sjoetilgang", label: "Nær sjøen", emoji: "🌊" },
      { id: "turstier", label: "Turstier fra døra", emoji: "🥾" },
      { id: "sykkelsti_nat", label: "Sykkelstier", emoji: "🚴" },
      { id: "baatplass", label: "Båtplass tilgj.", emoji: "⛵" },
      { id: "naturskjoent", label: "Naturskjønne omg.", emoji: "🏔️" },
    ],
    livsstil: [
      { id: "aktivt_liv", label: "Aktivt uteliv", emoji: "🏃" },
      { id: "naturnaert", label: "Bo nært naturen", emoji: "🌿" },
      { id: "fire_aarstider", label: "Alle 4 årstider", emoji: "🍂" },
      { id: "stillhet", label: "Fred og ro", emoji: "🤫" },
    ],
  },
};

// ── UNIVERSAL TILES ──────────────────────────────────────────────────────────
export const UNIVERSAL_TILES: Record<string, Tile[]> = {
  "Bolig": [
    { id: "u_nyoppusset_bad", label: "Nyoppusset bad", emoji: "🚿" },
    { id: "u_nytt_kjoekken", label: "Nytt kjøkken", emoji: "🍳" },
    { id: "u_balkong", label: "Balkong", emoji: "🌞" },
    { id: "u_terrasse", label: "Terrasse", emoji: "☀️" },
    { id: "u_garasje", label: "Garasje", emoji: "🚗" },
    { id: "u_heis", label: "Heis", emoji: "🛗" },
    { id: "u_peis", label: "Peis/ildsted", emoji: "🔥" },
    { id: "u_bod", label: "Bod", emoji: "📦" },
    { id: "u_utsikt", label: "Utsikt", emoji: "🌅" },
    { id: "u_solrikt", label: "Solrikt", emoji: "☀️" },
    { id: "u_lyst", label: "Lyst og luftig", emoji: "💡" },
    { id: "u_hage", label: "Hage", emoji: "🌳" },
    { id: "u_stille", label: "Stille og rolig", emoji: "🤫" },
  ],
  "Oppussing": [
    { id: "u_totalrenovert", label: "Totalrenovert", emoji: "✨" },
    { id: "u_original_karakter", label: "Original karakter", emoji: "🏛️" },
    { id: "u_nytt_elektrisk", label: "Nytt el-anlegg", emoji: "⚡" },
    { id: "u_nye_vinduer", label: "Nye vinduer", emoji: "🪟" },
    { id: "u_varmekabler", label: "Gulvvarme", emoji: "🌡️" },
    { id: "u_tg0_tg1", label: "Gode TG-er", emoji: "✅" },
  ],
  "Energi": [
    { id: "u_varmepumpe", label: "Varmepumpe", emoji: "♻️" },
    { id: "u_solceller", label: "Solceller", emoji: "🔆" },
    { id: "u_elbil_lading", label: "Elbil-lading", emoji: "🔌" },
    { id: "u_energimerke", label: "Energikl. A/B", emoji: "🏷️" },
    { id: "u_vannbaaren", label: "Vannbåren varme", emoji: "🌡️" },
  ],
  "Økonomi": [
    { id: "u_lave_fellesk", label: "Lave fellesk.", emoji: "💰" },
    { id: "u_lav_fellesgjeld", label: "Lav fellesgjeld", emoji: "📉" },
    { id: "u_god_okonomi", label: "God øk. i sameiet", emoji: "🏦" },
    { id: "u_ingen_dok", label: "Ingen dok.avgift", emoji: "📋" },
  ],
};

// ── HELPER: Get all tiles as flat array ──────────────────────────────────────
export function getAllTiles(): Tile[] {
  const tiles: Tile[] = [];
  const seen = new Set<string>();

  for (const group of Object.values(AUDIENCE_TILES)) {
    for (const tile of [...group.bolig_features, ...group.omrade_features, ...group.livsstil]) {
      if (!seen.has(tile.id)) {
        tiles.push(tile);
        seen.add(tile.id);
      }
    }
  }
  for (const group of Object.values(UNIVERSAL_TILES)) {
    for (const tile of group) {
      if (!seen.has(tile.id)) {
        tiles.push(tile);
        seen.add(tile.id);
      }
    }
  }
  return tiles;
}
