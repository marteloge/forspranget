# Forspranget: Shortcut Tiles Research
*Compiled: 2026-03-02*

Research for the "AI Boligtekst" feature — target audience selection + highlight tiles.

---

## A) Target Audiences (Målgrupper)

```json
{
  "audiences": [
    {
      "id": "barnefamilier",
      "label": "Barnefamilier",
      "emoji": "👨‍👩‍👧‍👦",
      "description": "Familier med barn, typisk 28-45 år. Prioriterer skolekrets, trygge uteområder, plass og praktisk hverdagslogistikk.",
      "property_types": ["enebolig", "rekkehus", "tomannsbolig", "stor_leilighet"]
    },
    {
      "id": "forstegangskjopere",
      "label": "Førstegangskjøpere",
      "emoji": "🔑",
      "description": "Unge voksne 23-30 år. Prissensitive, ofte med foreldrehjelp. Ser etter starten på boligkarrieren — verdiøkning og potensial viktigere enn perfeksjon.",
      "property_types": ["leilighet", "liten_leilighet"]
    },
    {
      "id": "par_uten_barn",
      "label": "Par uten barn",
      "emoji": "💑",
      "description": "DINK-par (dobbel inntekt). Prioriterer beliggenhet, urban livsstil, standard og estetikk. Fleksible på størrelse.",
      "property_types": ["leilighet", "rekkehus"]
    },
    {
      "id": "seniorer",
      "label": "Seniorer / pensjonister",
      "emoji": "🏡",
      "description": "60+ år. Flytter fra enebolig til lettstelt. Prioriterer tilgjengelighet, heis, alt på ett plan, nærhet til tjenester, sosialt fellesskap.",
      "property_types": ["leilighet", "seniorleilighet", "livsløpsbolig"]
    },
    {
      "id": "single_profesjonell",
      "label": "Unge profesjonelle",
      "emoji": "💼",
      "description": "Singles/unge 25-35 med god inntekt. Verdsetter sentral beliggenhet, moderne standard, kafé- og uteliv i nærheten.",
      "property_types": ["leilighet", "liten_leilighet"]
    },
    {
      "id": "investorer",
      "label": "Investorer / utleie",
      "emoji": "📈",
      "description": "Kjøper sekundærbolig for utleie. Fokus på yield, leiepotensial, verdiøkning, lave felleskostnader, attraktiv beliggenhet for leietakere.",
      "property_types": ["leilighet", "hybelleilighet"]
    },
    {
      "id": "downsizere",
      "label": "Downsizere",
      "emoji": "🔄",
      "description": "Par 50-65 som selger familiehjemmet. Barna har flyttet ut. Vil ha mindre vedlikehold, men gjerne god standard og plass til gjester.",
      "property_types": ["leilighet", "rekkehus"]
    },
    {
      "id": "naturelskere",
      "label": "Friluftsinteresserte",
      "emoji": "🏔️",
      "description": "Alle aldre. Prioriterer nærhet til marka/natur, skiløyper, sykkelstier, sjø. Ofte litt utenfor sentrum.",
      "property_types": ["enebolig", "rekkehus", "leilighet"]
    }
  ]
}
```

---

## B) Highlight Tiles per Target Audience

### 1. Barnefamilier 👨‍👩‍👧‍👦

```json
{
  "audience": "barnefamilier",
  "tiles": {
    "bolig_features": [
      { "id": "stor_hage", "label": "Stor hage", "emoji": "🌳" },
      { "id": "mange_soverom", "label": "4+ soverom", "emoji": "🛏️" },
      { "id": "ekstra_bad", "label": "Flere bad", "emoji": "🚿" },
      { "id": "garasje", "label": "Garasje", "emoji": "🚗" },
      { "id": "bod_lagring", "label": "God lagring", "emoji": "📦" },
      { "id": "praktisk_planlosning", "label": "Praktisk planløsning", "emoji": "📐" },
      { "id": "barnerom", "label": "Gode barnerom", "emoji": "🧸" },
      { "id": "kjellerstue", "label": "Kjellerstue", "emoji": "🎮" },
      { "id": "vaskerom", "label": "Eget vaskerom", "emoji": "👕" },
      { "id": "garderobelosning", "label": "Garderober", "emoji": "🚪" },
      { "id": "terrasse", "label": "Terrasse/uteplass", "emoji": "☀️" },
      { "id": "inngangsparti", "label": "Romslig gang", "emoji": "🚶" }
    ],
    "omrade_features": [
      { "id": "god_skolekrets", "label": "God skolekrets", "emoji": "🏫" },
      { "id": "barnehage_naert", "label": "Nær barnehage", "emoji": "🎨" },
      { "id": "lekeplass", "label": "Lekeplass", "emoji": "🛝" },
      { "id": "trygt_nabolag", "label": "Trygt nabolag", "emoji": "🛡️" },
      { "id": "lite_trafikk", "label": "Lite trafikk", "emoji": "🚸" },
      { "id": "tursti_naert", "label": "Turstier/marka", "emoji": "🌲" },
      { "id": "idrettslag", "label": "Idrettsanlegg", "emoji": "⚽" },
      { "id": "naert_butikk", "label": "Nær butikk", "emoji": "🛒" },
      { "id": "familier_i_nabolag", "label": "Barnefamilier i området", "emoji": "👪" },
      { "id": "gang_sykkelsti", "label": "Trygg skolevei", "emoji": "🚴" }
    ],
    "livsstil": [
      { "id": "plass_til_vekst", "label": "Plass å vokse", "emoji": "📈" },
      { "id": "godt_naboskap", "label": "Godt naboskap", "emoji": "🤝" },
      { "id": "hageglede", "label": "Hageglede", "emoji": "🌷" },
      { "id": "rolig_gate", "label": "Rolig blindvei", "emoji": "🏘️" }
    ]
  }
}
```

### 2. Førstegangskjøpere 🔑

```json
{
  "audience": "forstegangskjopere",
  "tiles": {
    "bolig_features": [
      { "id": "lave_felleskostnader", "label": "Lave fellesk.", "emoji": "💰" },
      { "id": "lav_fellesgjeld", "label": "Lav fellesgjeld", "emoji": "📉" },
      { "id": "nyoppusset", "label": "Nyoppusset", "emoji": "✨" },
      { "id": "oppussingspotensial", "label": "Potensial", "emoji": "🔨" },
      { "id": "balkong", "label": "Balkong", "emoji": "🌞" },
      { "id": "smart_planlosning", "label": "Smart planløsning", "emoji": "📐" },
      { "id": "lys_leilighet", "label": "Lys og luftig", "emoji": "☀️" },
      { "id": "bod", "label": "Egen bod", "emoji": "📦" },
      { "id": "heis", "label": "Heis", "emoji": "🛗" },
      { "id": "pent_bad", "label": "Pent bad", "emoji": "🚿" }
    ],
    "omrade_features": [
      { "id": "kollektivt_naert", "label": "Nær kollektiv", "emoji": "🚇" },
      { "id": "sentralt", "label": "Sentralt", "emoji": "📍" },
      { "id": "prisgunstig_omrade", "label": "Omr. i utvikling", "emoji": "🏗️" },
      { "id": "naert_jobb", "label": "Nær jobbsentrum", "emoji": "🏢" },
      { "id": "dagligvare", "label": "Nær butikk", "emoji": "🛒" },
      { "id": "trendy_nabolag", "label": "Populært strøk", "emoji": "🔥" }
    ],
    "livsstil": [
      { "id": "verdiokning", "label": "Verdistigningspot.", "emoji": "📈" },
      { "id": "ferdig_innflytting", "label": "Klar for innflytting", "emoji": "🎉" },
      { "id": "lett_vedlikehold", "label": "Vedlikeholdsfritt", "emoji": "✅" },
      { "id": "godt_borettslag", "label": "Godt borettslag", "emoji": "🏢" },
      { "id": "mye_for_pengene", "label": "Mye for pengene", "emoji": "💎" }
    ]
  }
}
```

### 3. Par uten barn (DINK) 💑

```json
{
  "audience": "par_uten_barn",
  "tiles": {
    "bolig_features": [
      { "id": "moderne_kjoekken", "label": "Moderne kjøkken", "emoji": "🍳" },
      { "id": "apen_planlosning", "label": "Åpen planløsning", "emoji": "📐" },
      { "id": "designbad", "label": "Designbad", "emoji": "🛁" },
      { "id": "stor_balkong", "label": "Stor balkong", "emoji": "🌞" },
      { "id": "takterrasse", "label": "Takterrasse", "emoji": "🏙️" },
      { "id": "parkering", "label": "Parkering", "emoji": "🅿️" },
      { "id": "walkincloset", "label": "Walk-in closet", "emoji": "👗" },
      { "id": "peis", "label": "Peis/ildsted", "emoji": "🔥" },
      { "id": "hoy_standard", "label": "Høy standard", "emoji": "✨" },
      { "id": "utsikt", "label": "Fin utsikt", "emoji": "🌅" }
    ],
    "omrade_features": [
      { "id": "kafeliv", "label": "Kafeer/restauranter", "emoji": "☕" },
      { "id": "sentral_beliggenhet", "label": "Sentral beliggenhet", "emoji": "📍" },
      { "id": "kulturtilbud", "label": "Kulturtilbud", "emoji": "🎭" },
      { "id": "treningssenter", "label": "Treningssenter", "emoji": "🏋️" },
      { "id": "parker_groent", "label": "Parker/grøntareal", "emoji": "🌳" },
      { "id": "gangavstand_alt", "label": "Alt i gangavstand", "emoji": "🚶" }
    ],
    "livsstil": [
      { "id": "urban_livsstil", "label": "Urban livsstil", "emoji": "🏙️" },
      { "id": "stilrent", "label": "Stilrent og moderne", "emoji": "🖤" },
      { "id": "underholdning", "label": "Fint for gjester", "emoji": "🥂" },
      { "id": "helgekos", "label": "Hjemmekos", "emoji": "🕯️" }
    ]
  }
}
```

### 4. Seniorer / Pensjonister 🏡

```json
{
  "audience": "seniorer",
  "tiles": {
    "bolig_features": [
      { "id": "heis", "label": "Heis", "emoji": "🛗" },
      { "id": "ett_plan", "label": "Alt på ett plan", "emoji": "🏠" },
      { "id": "livsloepsstandard", "label": "Livsløpsstandard", "emoji": "♿" },
      { "id": "trinnfri", "label": "Trinnfri adkomst", "emoji": "🚪" },
      { "id": "romslig_bad", "label": "Romslig bad", "emoji": "🚿" },
      { "id": "lettstelt", "label": "Lettstelt bolig", "emoji": "✅" },
      { "id": "balkong_solrikt", "label": "Solrik balkong", "emoji": "☀️" },
      { "id": "varmekabler", "label": "Gulvvarme", "emoji": "🌡️" },
      { "id": "garasje_kjeller", "label": "Garasje i kjeller", "emoji": "🚗" },
      { "id": "smarthus", "label": "Smarthusteknologi", "emoji": "📱" }
    ],
    "omrade_features": [
      { "id": "gangavstand_butikk", "label": "Butikk i gangavst.", "emoji": "🛒" },
      { "id": "helsetjenester", "label": "Nær helsetjenester", "emoji": "🏥" },
      { "id": "kollektivt", "label": "Nær kollektiv", "emoji": "🚌" },
      { "id": "apotek", "label": "Apotek nært", "emoji": "💊" },
      { "id": "turmulig", "label": "Turmuligheter", "emoji": "🚶" },
      { "id": "rolig_omrade", "label": "Rolig område", "emoji": "🤫" },
      { "id": "sentral_naerhetsgrad", "label": "Sentrumsnært", "emoji": "📍" }
    ],
    "livsstil": [
      { "id": "fellesskap", "label": "Sosialt fellesskap", "emoji": "🤝" },
      { "id": "trygghet", "label": "Trygt og rolig", "emoji": "🛡️" },
      { "id": "vedlikeholdsfritt", "label": "Vedlikeholdsfritt", "emoji": "🔧" },
      { "id": "gjesterom", "label": "Plass til gjester", "emoji": "🛏️" },
      { "id": "kjent_nabolag", "label": "Etablert nabolag", "emoji": "🏘️" },
      { "id": "felleshus", "label": "Felleshus/aktivitet", "emoji": "🏠" }
    ]
  }
}
```

### 5. Unge profesjonelle / Singles 💼

```json
{
  "audience": "single_profesjonell",
  "tiles": {
    "bolig_features": [
      { "id": "kompakt_smart", "label": "Kompakt og smart", "emoji": "📐" },
      { "id": "moderne_standard", "label": "Moderne standard", "emoji": "✨" },
      { "id": "balkong", "label": "Balkong", "emoji": "🌞" },
      { "id": "apen_planlosning", "label": "Åpen løsning", "emoji": "🏠" },
      { "id": "god_bod", "label": "God bodplass", "emoji": "📦" },
      { "id": "nytt_bad", "label": "Nytt bad", "emoji": "🚿" },
      { "id": "pent_kjoekken", "label": "Pent kjøkken", "emoji": "🍳" },
      { "id": "hjemmekontor", "label": "Hjemmekontor", "emoji": "💻" }
    ],
    "omrade_features": [
      { "id": "byliv", "label": "Midt i bylivet", "emoji": "🏙️" },
      { "id": "uteliv", "label": "Nær uteliv", "emoji": "🍸" },
      { "id": "trening", "label": "Treningssenter", "emoji": "🏋️" },
      { "id": "kollektiv", "label": "God kollektiv", "emoji": "🚇" },
      { "id": "sykkelavstand", "label": "Sykkelavstand jobb", "emoji": "🚴" },
      { "id": "hipt_strok", "label": "Populært strøk", "emoji": "🔥" }
    ],
    "livsstil": [
      { "id": "lavt_vedlikehold", "label": "Lite vedlikehold", "emoji": "✅" },
      { "id": "starten_boligkarriere", "label": "God førstebolig", "emoji": "🔑" },
      { "id": "sosial_beliggenhet", "label": "Sosialt og sentralt", "emoji": "🎉" },
      { "id": "jobbnaerhet", "label": "Kort vei til jobb", "emoji": "⏱️" }
    ]
  }
}
```

### 6. Investorer / Utleie 📈

```json
{
  "audience": "investorer",
  "tiles": {
    "bolig_features": [
      { "id": "lave_fellesk", "label": "Lave fellesk.", "emoji": "💰" },
      { "id": "lav_fellesgjeld", "label": "Lav fellesgjeld", "emoji": "📉" },
      { "id": "god_yield", "label": "God leieinntekt", "emoji": "💵" },
      { "id": "utleiemulighet", "label": "Utleiemulighet", "emoji": "🔑" },
      { "id": "todelt_losning", "label": "Todelt løsning", "emoji": "🏠" },
      { "id": "sokkelleilighet", "label": "Sokkelleilighet", "emoji": "🏡" },
      { "id": "god_standard", "label": "God standard", "emoji": "✨" },
      { "id": "lett_utleibart", "label": "Lett utleibart", "emoji": "✅" },
      { "id": "energieffektivt", "label": "Energieffektivt", "emoji": "⚡" },
      { "id": "lav_vedlikeholdsrisiko", "label": "Lavt vedl.behov", "emoji": "🔧" }
    ],
    "omrade_features": [
      { "id": "studentby_naert", "label": "Nær studentby", "emoji": "🎓" },
      { "id": "sentralt_etterspurt", "label": "Etterspurt område", "emoji": "📍" },
      { "id": "naer_kollektiv", "label": "God kollektiv", "emoji": "🚇" },
      { "id": "naer_sykehus", "label": "Nær sykehus/jobb", "emoji": "🏥" },
      { "id": "prisutvikling", "label": "God prisutvikl.", "emoji": "📈" },
      { "id": "omraade_i_vekst", "label": "Område i vekst", "emoji": "🏗️" }
    ],
    "livsstil": [
      { "id": "verdistigning", "label": "Verdistigningspot.", "emoji": "📈" },
      { "id": "skattefordel", "label": "Skattefordeler", "emoji": "📋" },
      { "id": "god_avkastning", "label": "God avkastning", "emoji": "💎" },
      { "id": "popularitet", "label": "Populær blant leietakere", "emoji": "🔥" }
    ]
  }
}
```

### 7. Downsizere 🔄

```json
{
  "audience": "downsizere",
  "tiles": {
    "bolig_features": [
      { "id": "hoy_standard", "label": "Høy standard", "emoji": "✨" },
      { "id": "romslig_leilighet", "label": "Romslig leilighet", "emoji": "📐" },
      { "id": "stor_balkong", "label": "Stor balkong", "emoji": "🌞" },
      { "id": "to_soverom", "label": "2-3 soverom", "emoji": "🛏️" },
      { "id": "peis", "label": "Peis", "emoji": "🔥" },
      { "id": "heis", "label": "Heis", "emoji": "🛗" },
      { "id": "garasje", "label": "Garasjeplass", "emoji": "🚗" },
      { "id": "lekkert_bad", "label": "Lekkert bad", "emoji": "🛁" },
      { "id": "kvalitetskjokken", "label": "Kvalitetskjøkken", "emoji": "🍳" },
      { "id": "god_bod", "label": "God bodplass", "emoji": "📦" }
    ],
    "omrade_features": [
      { "id": "sentrumsnært", "label": "Sentrumsnært", "emoji": "📍" },
      { "id": "gangavstand", "label": "Alt i gangavstand", "emoji": "🚶" },
      { "id": "kulturliv", "label": "Kulturliv", "emoji": "🎭" },
      { "id": "restaurant", "label": "Restauranter", "emoji": "🍽️" },
      { "id": "park", "label": "Nær park", "emoji": "🌳" },
      { "id": "kollektivt", "label": "God kollektiv", "emoji": "🚌" }
    ],
    "livsstil": [
      { "id": "frigjor_kapital", "label": "Frigjør kapital", "emoji": "💰" },
      { "id": "vedlikeholdsfritt", "label": "Slipper vedlikehold", "emoji": "🔧" },
      { "id": "gjesterom", "label": "Plass til barnebarn", "emoji": "👶" },
      { "id": "ny_start", "label": "Ny livsfase", "emoji": "🌅" },
      { "id": "sosialt", "label": "Sosialt nabolag", "emoji": "🤝" }
    ]
  }
}
```

### 8. Friluftsinteresserte 🏔️

```json
{
  "audience": "naturelskere",
  "tiles": {
    "bolig_features": [
      { "id": "stor_tomt", "label": "Stor tomt", "emoji": "🌲" },
      { "id": "garasje_bod", "label": "Garasje + bod", "emoji": "🚗" },
      { "id": "ski_bod", "label": "Skirom/sportsbod", "emoji": "🎿" },
      { "id": "peisestue", "label": "Peis/vedovn", "emoji": "🔥" },
      { "id": "uteplass", "label": "Stor uteplass", "emoji": "☀️" },
      { "id": "solrikt", "label": "Solrikt", "emoji": "🌞" },
      { "id": "vaskemuligheter", "label": "Grovkjøkken", "emoji": "👢" },
      { "id": "verktøybod", "label": "Verksted/bod", "emoji": "🔧" }
    ],
    "omrade_features": [
      { "id": "marka_naert", "label": "Nær marka", "emoji": "🌲" },
      { "id": "skiloype", "label": "Skiløyper", "emoji": "🎿" },
      { "id": "sjoetilgang", "label": "Nær sjøen", "emoji": "🌊" },
      { "id": "turstier", "label": "Turstier fra døra", "emoji": "🥾" },
      { "id": "sykkelsti", "label": "Sykkelstier", "emoji": "🚴" },
      { "id": "baatplass", "label": "Båtplass tilgj.", "emoji": "⛵" },
      { "id": "naturskjoent", "label": "Naturskjønne omg.", "emoji": "🏔️" },
      { "id": "dyreliv", "label": "Rolige omgivelser", "emoji": "🦌" }
    ],
    "livsstil": [
      { "id": "aktivt_liv", "label": "Aktivt uteliv", "emoji": "🏃" },
      { "id": "naturnaert", "label": "Bo nært naturen", "emoji": "🌿" },
      { "id": "fire_aarstider", "label": "Alle 4 årstider", "emoji": "🍂" },
      { "id": "stillhet", "label": "Fred og ro", "emoji": "🤫" }
    ]
  }
}
```

---

## C) Universelle / Generelle Highlight Tiles

These apply across ALL audiences and represent standard features agents commonly highlight.

```json
{
  "category": "universal",
  "groups": {
    "standard_bolig": [
      { "id": "nyoppusset_bad", "label": "Nyoppusset bad", "emoji": "🚿" },
      { "id": "nyoppusset_kjoekken", "label": "Nytt kjøkken", "emoji": "🍳" },
      { "id": "balkong", "label": "Balkong", "emoji": "🌞" },
      { "id": "terrasse", "label": "Terrasse", "emoji": "☀️" },
      { "id": "garasje", "label": "Garasje", "emoji": "🚗" },
      { "id": "parkering", "label": "P-plass", "emoji": "🅿️" },
      { "id": "heis", "label": "Heis", "emoji": "🛗" },
      { "id": "peis", "label": "Peis/ildsted", "emoji": "🔥" },
      { "id": "bod", "label": "Bod", "emoji": "📦" },
      { "id": "utsikt", "label": "Utsikt", "emoji": "🌅" },
      { "id": "solrikt", "label": "Solrikt", "emoji": "☀️" },
      { "id": "lyst", "label": "Lyst og luftig", "emoji": "💡" },
      { "id": "hage", "label": "Hage", "emoji": "🌳" },
      { "id": "stille", "label": "Stille og rolig", "emoji": "🤫" }
    ],
    "standard_oppussing": [
      { "id": "totalrenovert", "label": "Totalrenovert", "emoji": "✨" },
      { "id": "oppgradert", "label": "Oppgradert", "emoji": "🔨" },
      { "id": "original_karakter", "label": "Original karakter", "emoji": "🏛️" },
      { "id": "nytt_elektrisk", "label": "Nytt el-anlegg", "emoji": "⚡" },
      { "id": "nye_vinduer", "label": "Nye vinduer", "emoji": "🪟" },
      { "id": "etterisolert", "label": "Etterisolert", "emoji": "🧱" },
      { "id": "nytt_tak", "label": "Nytt tak", "emoji": "🏠" },
      { "id": "varmekabler", "label": "Gulvvarme", "emoji": "🌡️" },
      { "id": "tg0_tg1", "label": "Gode TG-er", "emoji": "✅" }
    ],
    "energi_groent": [
      { "id": "varmepumpe", "label": "Varmepumpe", "emoji": "♻️" },
      { "id": "solceller", "label": "Solceller", "emoji": "🔆" },
      { "id": "elbil_lading", "label": "Elbil-lading", "emoji": "🔌" },
      { "id": "energimerke_ab", "label": "Energikl. A/B", "emoji": "🏷️" },
      { "id": "lavt_stromforbruk", "label": "Lavt strømforbruk", "emoji": "⚡" },
      { "id": "vannbaaren_varme", "label": "Vannbåren varme", "emoji": "🌡️" },
      { "id": "groent_boliglan", "label": "Grønt boliglån-kval.", "emoji": "🌱" }
    ],
    "beliggenhet_generelt": [
      { "id": "sentralt", "label": "Sentralt", "emoji": "📍" },
      { "id": "kollektiv", "label": "Nær kollektiv", "emoji": "🚌" },
      { "id": "butikk", "label": "Nær butikk", "emoji": "🛒" },
      { "id": "barnehage", "label": "Nær barnehage", "emoji": "🎨" },
      { "id": "skole", "label": "Nær skole", "emoji": "🏫" },
      { "id": "marka_natur", "label": "Nær marka", "emoji": "🌲" },
      { "id": "sjoen", "label": "Nær sjøen", "emoji": "🌊" },
      { "id": "rolig_strok", "label": "Rolig strøk", "emoji": "🤫" },
      { "id": "populaert_omraade", "label": "Populært område", "emoji": "🔥" }
    ],
    "okonomi": [
      { "id": "lave_felleskostnader", "label": "Lave fellesk.", "emoji": "💰" },
      { "id": "lav_fellesgjeld", "label": "Lav fellesgjeld", "emoji": "📉" },
      { "id": "god_okonomi_sameie", "label": "God øk. i sameiet", "emoji": "🏦" },
      { "id": "inkl_varmtvann", "label": "Inkl. varmtvann", "emoji": "🚿" },
      { "id": "ingen_dok_avgift", "label": "Ingen dok.avgift", "emoji": "📋" }
    ]
  }
}
```

---

## D) FINN.no Listing Insights — What Sells

### Most Used Words in FINN.no Property Listings
Based on FINN's own analysis of 500 most-used words and Retorikkbyrået's review:

**Top adjectives (FINN headlines):**
1. Stor (large)
2. Solrik (sunny)
3. Flott (great/lovely)
4. Pent (nice/pretty)
5. Lys (bright)
6. Unik (unique)
7. Sjarmerende (charming)

**Most common nouns:**
1. Enebolig (detached house) — 3,106 uses
2. Garasje (garage) — 3,017 uses
3. Balkong (balcony) — 2,679 uses

**Most common phrases:**
- "Alt på en flate" / "Alt på et plan" (everything on one floor)
- "Enebolig med dobbel garasje" (detached house with double garage)

### Quality Ladder in Norwegian Agent Language
(Ascending order of quality, per industry convention)
1. Pen (nice)
2. Fin (fine)
3. Flott (lovely)
4. Herskapelig (stately/grand)

Can be amplified with "meget" (very): "Meget pen leilighet"

### What Buyers Look at First on FINN
Research from FINN.no shows buyers prioritize in this order:
1. **Plantegning** (floor plan) — most looked at
2. **Teknisk informasjon** (technical info / condition report)
3. **Boligbeskrivelse** (property description)
4. **Avstander** (distances to key amenities)
5. **Rom-presentasjon** (kitchen and bathroom close-ups)

### Best Practices from Retorikkbyrået / FINN Analysis
- **Active voice** over passive (avoid "oppfordres", "overdras", "fås")
- **"Show, don't tell"** — use images for beauty, text for hidden value (e.g. low costs)
- **Be specific:** "5 minutters gange til butikken" > "nær butikk"
- **Avoid overuse of superlatives** — they trigger suspicion
- **Address buyer as "du"** — direct, personal tone
- **Don't overuse "unik"** — FINN is full of it, it's lost meaning
- **Honesty pays** — misleading descriptions backfire legally (avhendingsloven)

### Key Selling Points That Perform Well
Based on combined research, these features consistently drive interest:

| Feature | Norwegian Term | Why It Sells |
|---------|---------------|--------------|
| Sunny aspect | Solrikt | Cultural premium in dark-winter Norway |
| Bright rooms | Lys og luftig | Same — light is highly valued |
| Updated bathroom | Nyoppusset bad | Most expensive room to renovate |
| Updated kitchen | Nytt kjøkken | Second most expensive room |
| Low shared costs | Lave felleskostnader | Direct impact on monthly budget |
| Good floor plan | God planløsning | Perceived usable space > raw sqm |
| Storage | God lagringsplass | Norwegian homes notoriously short on storage |
| Garage | Garasje | Practical in winter climate |
| Balcony/terrace | Balkong/terrasse | Outdoor space highly valued |
| Fireplace | Peis/vedovn | Cultural icon — hygge factor |
| Views | Utsikt | Premium feature |
| EV charging | Elbil-lading | Norway = world's highest EV adoption |
| Energy rating | Energimerke | New 2026 rules make this more important |
| Heat pump | Varmepumpe | Saves on heating costs |
| Quiet area | Rolig og stille | Noise = top complaint in Norway |
| Near nature | Nær marka/natur | Outdoor culture is core Norwegian identity |

---

## E) Implementation Notes for UI

### Suggested UI Flow
1. Agent selects **property type** (leilighet, enebolig, rekkehus...)
2. Agent selects **target audience** (one or multiple from the 8 segments)
3. System shows **relevant tiles** (audience-specific + universal)
4. Agent **clicks tiles** to select highlights
5. Selected tiles + property details → **AI prompt** → generated description

### Tile Rendering Logic
- Universal tiles always available (can be toggled to show/hide)
- Audience-specific tiles appear when audience is selected
- If multiple audiences selected, merge tiles and de-duplicate
- Tiles should be grouped by category (bolig, område, livsstil, økonomi, energi)
- Each tile is a simple clickable chip/tag with emoji + short label
- Selected tiles shown with a highlight state (filled/outlined toggle)

### AI Prompt Integration
Selected tiles should be fed to the AI as structured context:
```
Målgruppe: Barnefamilier
Valgte høydepunkter: God skolekrets, Stor hage, 4+ soverom, Trygt nabolag, Lekeplass, Garasje, Nyoppusset bad, Elbil-lading
```

This gives the AI clear signals about what to emphasize and what emotional triggers to use.

---

## Sources
- [FINN.no Retorikkekspert-analyse](https://www.finn.no/bedriftskunde/eiendom/nytt-om-eiendomsbransjen/retorikkekspert-har-analysert-spraket-i-boligannonser-her-er-tipsene-du-trenger)
- [Arcanova: 6 ting barnefamilier ser etter](https://www.arcanova.no/blogg/6-ting-barnefamilier-ser-etter-ved-et-boligkj%C3%B8p)
- [Nordr: Hva gjør en bolig barnevennlig](https://www.nordr.com/no/nyheter/nyheter/hva-gjor-en-bolig-barnevennlig)
- [NEF: Førstegangskjøpere](https://nef.no/nyheter/snittalder-pa-forstegangskjopere-er-280-ar/)
- [EiendomsMegler 1: Fremtidens seniorbolig](https://www.eiendomsmegler1.no/sor-vestlandet/boligartikler-senior-bolig)
- [Husbanken: Universell utforming](https://www.husbanken.no/universell-utforming/)
- [Investropa: Norway Price Forecasts 2026](https://investropa.com/blogs/news/norway-price-forecasts)
- [Eiendom Norge: Aldersfordeling kjøp/salg](https://eiendomnorge.no/blogg/hvordan-er-aldersfordelingen-ved-kjop-og-salg-av-boliger-article706-923.html)
- [Prognosesenteret: Markedskunnskap boligutvikling](https://prognosesenteret.no/bruk-av-markedskunnskap-i-boligutvikling/)
- [Mittanbud: Ny energimerking 2026](https://mittanbud.no/privatperson/aktuelt/energimerking)
