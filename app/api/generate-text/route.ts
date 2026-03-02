import { NextRequest, NextResponse } from "next/server";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface BoligInput {
  address: string;
  boligtype: string;
  sqm: number;
  rooms?: number;
  floor?: string;
  buildYear?: number;
  highlights?: string;
  notes?: string;
  tone: "professional" | "warm" | "engaging";
}

// ── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Du er en erfaren norsk eiendomsmegler-assistent som skriver boligannonser.
Du skal generere tre tekster basert på boliginformasjonen du mottar:

1. **FINN-annonse**: En komplett boligbeskrivelse optimalisert for FINN.no.
   - Bruk naturlig, flytende norsk (bokmål).
   - Strukturer med avsnitt: Innledning → Rombeskrivelse → Beliggenhet → Nabolag → Oppsummering.
   - Fremhev emosjonelle kvaliteter (lys, romfølelse, sjarm) — ikke bare fakta.
   - Bruk norsk kjøpspsykologi: trygghet, fellesskap, livskvalitet.
   - Unngå klisjeer som "perle", "drømmebolig", "sjelden mulighet" med mindre det virkelig passer.
   - Lengde: 200-350 ord.

2. **Instagram-caption**: En kort, engasjerende tekst for Instagram.
   - Maks 150 ord.
   - Start med en hook (spørsmål eller statement).
   - Inkluder 3-5 relevante emojis naturlig i teksten.
   - Avslutt med en call-to-action.
   - Inkluder 5-8 relevante hashtags på egen linje.

3. **SMS**: En kort melding til potensielle kjøpere.
   - Maks 160 tegn.
   - Inkluder adresse og en nøkkelfaktor.
   - Avslutt med handlingsoppfordring.

Svar ALLTID i JSON-format:
{"finn": "...", "instagram": "...", "sms": "..."}

Skriv KUN på norsk (bokmål). Aldri engelsk.`;

// ── TONE INSTRUCTIONS ────────────────────────────────────────────────────────
const TONE_PROMPTS: Record<string, string> = {
  professional: "Bruk en profesjonell, saklig og tillitsvekkende tone. Fokus på fakta og kvalitet.",
  warm: "Bruk en varm, personlig og inviterende tone. Få leseren til å se seg selv bo der.",
  engaging: "Bruk en energisk, engasjerende og action-drevet tone. Skap begeistring og urgency.",
};

// ── EXAMPLE OUTPUT (used when no API key) ────────────────────────────────────
function getExampleOutput(input: BoligInput) {
  const addr = input.address || "Thorvald Meyers gate 15";
  const sqm = input.sqm || 75;
  const rooms = input.rooms || 3;
  const type = input.boligtype || "Leilighet";

  return {
    finn: `${addr} — ${type} med sjel og moderne komfort

Velkommen til en gjennomtenkt ${sqm} kvm stor ${type.toLowerCase()} ${input.floor ? `i ${input.floor}` : ""} som forener klassisk bygårdsstil med moderne oppgraderinger.

${input.highlights ? `Det første som møter deg er ${input.highlights.split(",")[0]?.trim().toLowerCase() || "de lyse rommene"}. ` : ""}Leiligheten byr på ${rooms} rom med gjennomgående god takhøyde og store vinduer som slipper inn rikelig med naturlig lys. Stuen er romslig og åpen, med plass til både sofagruppe og spisebord${input.highlights?.toLowerCase().includes("peis") ? " — og peisen skaper en varm atmosfære på kjølige kvelder" : ""}.

Kjøkkenet er${input.highlights?.toLowerCase().includes("kjøkken") ? " nyoppusset og" : ""} praktisk innredet med god benkeplass og moderne hvitevarer. Fra kjøkkenet har du direkte tilgang til ${input.highlights?.toLowerCase().includes("balkong") ? "den sydvendte balkongen — perfekt for morgenkaffe og lange sommeraftener" : "boligens øvrige rom"}.

${input.buildYear ? `Bygården er fra ${input.buildYear} og er godt vedlikeholdt med oppgradert fasade og felles trappeoppgang. ` : ""}Beliggenhet${input.notes ? `: ${input.notes.split(".")[0]?.trim()}` : "en er sentral med kort vei til alt du trenger"}.

${input.notes?.toLowerCase().includes("barn") ? "Området er populært blant barnefamilier med nærhet til skoler, barnehager og lekeplasser. " : ""}Her har du gangavstand til kollektivtransport, matbutikker, kafeer og grøntområder.

En bolig for deg som verdsetter ${input.tone === "warm" ? "et hjem med varme og karakter" : input.tone === "engaging" ? "urban livsstil og moderne komfort" : "kvalitet, beliggenhet og gjennomtenkte løsninger"}.

Velkommen på visning!

Primærrom: ${sqm} kvm | ${rooms} rom${input.buildYear ? ` | Byggeår: ${input.buildYear}` : ""}`,

    instagram: `${input.tone === "engaging" ? "Drømmer du om å bo midt i byen med alt på dørstokken? 🏙️" : input.tone === "warm" ? "Noen boliger har bare den der følelsen ☀️" : "Ny mulighet i ${addr.split(",")[0]} 🏠"}

${sqm} kvm ${type.toLowerCase()} ${input.floor ? `i ${input.floor}` : ""} med ${input.highlights?.split(",").slice(0, 2).join(" og ").toLowerCase() || "god planløsning og flott beliggenhet"} ✨

${input.notes?.split(".")[0]?.trim() || "Sentralt beliggende med alt innen gangavstand"} 📍

${input.tone === "warm" ? "Dette er et hjem du kommer til å elske å komme hjem til 💛" : "Ta kontakt for visning — denne varer ikke lenge! 👇"}

#eiendom #bolig #tilsalgs #${addr.split(",").pop()?.trim().toLowerCase().replace(/\s+/g, "") || "oslo"} #${type.toLowerCase()} #nybolig #boligdrøm #megler`,

    sms: `Ny ${type.toLowerCase()} i ${addr.split(",")[0]}: ${sqm}kvm, ${rooms} rom${input.highlights ? `, ${input.highlights.split(",")[0]?.trim().toLowerCase()}` : ""}. Visning snart — interessert?`,
  };
}

// ── HANDLER ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const input: BoligInput = await request.json();

    if (!input.address?.trim() || !input.sqm) {
      return NextResponse.json(
        { error: "Adresse og kvadratmeter er påkrevd." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return example output
    if (!apiKey) {
      // Simulate a short delay for realism
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json(getExampleOutput(input));
    }

    // Build user prompt
    const details = [
      `Adresse: ${input.address}`,
      `Boligtype: ${input.boligtype}`,
      `Størrelse: ${input.sqm} kvm`,
      input.rooms ? `Antall rom: ${input.rooms}` : null,
      input.floor ? `Etasje: ${input.floor}` : null,
      input.buildYear ? `Byggeår: ${input.buildYear}` : null,
      input.highlights ? `Høydepunkter: ${input.highlights}` : null,
      input.notes ? `Egne notater: ${input.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const userPrompt = `${TONE_PROMPTS[input.tone] || TONE_PROMPTS.professional}

Generer boligtekster for denne eiendommen:

${details}`;

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: "Kunne ikke generere tekst. Prøv igjen." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Tom respons fra AI. Prøv igjen." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json({
      finn: parsed.finn || "",
      instagram: parsed.instagram || "",
      sms: parsed.sms || "",
    });
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json(
      { error: "Noe gikk galt. Prøv igjen." },
      { status: 500 }
    );
  }
}
