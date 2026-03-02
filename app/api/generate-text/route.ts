import { NextRequest } from "next/server";

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
  previousFinnText?: string;
  feedback?: string;
}

// ── SYSTEM PROMPTS ──────────────────────────────────────────────────────────
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

const REVISION_SYSTEM_PROMPT = `Du er en erfaren norsk eiendomsmegler-assistent som forbedrer boligannonser basert på feedback.

Du mottar den forrige versjonen av boligtekstene og meglerens feedback. Din oppgave er å:
1. Beholde den opprinnelige strukturen og gode elementer
2. Gjøre spesifikke justeringer basert på feedbacken
3. Forbedre helheten der det er naturlig

Regler:
- FINN-annonse: 200-350 ord, strukturert med avsnitt, norsk bokmål.
- Instagram: Maks 150 ord, hook + emojis + CTA + hashtags.
- SMS: Maks 160 tegn, adresse + nøkkelfaktor + CTA.

Svar ALLTID i JSON-format:
{"finn": "...", "instagram": "...", "sms": "..."}

Skriv KUN på norsk (bokmål). Aldri engelsk.`;

// ── TONE INSTRUCTIONS ────────────────────────────────────────────────────────
const TONE_PROMPTS: Record<string, string> = {
  professional: "Bruk en profesjonell, saklig og tillitsvekkende tone. Fokus på fakta og kvalitet.",
  warm: "Bruk en varm, personlig og inviterende tone. Få leseren til å se seg selv bo der.",
  engaging: "Bruk en energisk, engasjerende og action-drevet tone. Skap begeistring og urgency.",
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

/** Extract a JSON string value starting at position (after the opening quote).
 *  Handles escape sequences including \n, \t, \\, \", \uXXXX. */
function extractJsonStringValue(text: string, startIdx: number): string {
  let result = "";
  let i = startIdx;
  while (i < text.length) {
    if (text[i] === "\\") {
      if (i + 1 >= text.length) break; // incomplete escape
      const next = text[i + 1];
      switch (next) {
        case "n": result += "\n"; i += 2; break;
        case "t": result += "\t"; i += 2; break;
        case "r": result += "\r"; i += 2; break;
        case '"': result += '"'; i += 2; break;
        case "\\": result += "\\"; i += 2; break;
        case "/": result += "/"; i += 2; break;
        case "u":
          if (i + 5 < text.length) {
            const hex = text.slice(i + 2, i + 6);
            const code = parseInt(hex, 16);
            if (!isNaN(code)) {
              result += String.fromCharCode(code);
              i += 6;
            } else {
              result += next;
              i += 2;
            }
          } else {
            return result; // incomplete unicode escape — wait for more data
          }
          break;
        default:
          result += next;
          i += 2;
      }
    } else if (text[i] === '"') {
      break; // end of string value
    } else {
      result += text[i];
      i++;
    }
  }
  return result;
}

/** Build the details string from input fields. */
function buildDetails(input: BoligInput): string {
  return [
    "Adresse: " + input.address,
    "Boligtype: " + input.boligtype,
    "Størrelse: " + input.sqm + " kvm",
    input.rooms ? "Antall rom: " + input.rooms : null,
    input.floor ? "Etasje: " + input.floor : null,
    input.buildYear ? "Byggeår: " + input.buildYear : null,
    input.highlights ? "Høydepunkter: " + input.highlights : null,
    input.notes ? "Egne notater: " + input.notes : null,
  ]
    .filter(Boolean)
    .join("\n");
}

// ── EXAMPLE OUTPUT (used when no API key) ────────────────────────────────────
function getExampleOutput(input: BoligInput) {
  const addr = input.address || "Thorvald Meyers gate 15";
  const shortAddr = addr.split(",")[0] || addr;
  const sqm = input.sqm || 75;
  const rooms = input.rooms || 3;
  const type = input.boligtype || "Leilighet";
  const typeLower = type.toLowerCase();
  const floorText = input.floor ? " i " + input.floor : "";
  const buildYearText = input.buildYear ? " | Byggeår: " + input.buildYear : "";
  const buildYearPara = input.buildYear
    ? "Bygården er fra " + input.buildYear + " og er godt vedlikeholdt med oppgradert fasade og felles trappeoppgang. "
    : "";
  const firstHighlight = input.highlights?.split(",")[0]?.trim().toLowerCase() || "";
  const highlightIntro = firstHighlight
    ? "Det første som møter deg er " + firstHighlight + ". "
    : "";
  const hasPeis = input.highlights?.toLowerCase().includes("peis") || false;
  const peisText = hasPeis ? " — og peisen skaper en varm atmosfære på kjølige kvelder" : "";
  const hasKjokken = input.highlights?.toLowerCase().includes("kjøkken") || false;
  const kjokkenText = hasKjokken ? " nyoppusset og" : "";
  const hasBalkong = input.highlights?.toLowerCase().includes("balkong") || false;
  const balkongText = hasBalkong
    ? "den sydvendte balkongen — perfekt for morgenkaffe og lange sommeraftener"
    : "boligens øvrige rom";
  const firstNote = input.notes?.split(".")[0]?.trim() || "";
  const beliggText = firstNote ? ": " + firstNote : "en er sentral med kort vei til alt du trenger";
  const hasBarn = input.notes?.toLowerCase().includes("barn") || false;
  const barnText = hasBarn
    ? "Området er populært blant barnefamilier med nærhet til skoler, barnehager og lekeplasser. "
    : "";
  const toneEnd = input.tone === "warm"
    ? "et hjem med varme og karakter"
    : input.tone === "engaging"
      ? "urban livsstil og moderne komfort"
      : "kvalitet, beliggenhet og gjennomtenkte løsninger";
  const igHook = input.tone === "engaging"
    ? "Drømmer du om å bo midt i byen med alt på dørstokken? 🏙️"
    : input.tone === "warm"
      ? "Noen boliger har bare den der følelsen ☀️"
      : "Ny mulighet i " + shortAddr + " 🏠";
  const igHighlights = input.highlights
    ? input.highlights.split(",").slice(0, 2).join(" og ").toLowerCase().trim()
    : "god planløsning og flott beliggenhet";
  const igLocation = firstNote || "Sentralt beliggende med alt innen gangavstand";
  const igCta = input.tone === "warm"
    ? "Dette er et hjem du kommer til å elske å komme hjem til 💛"
    : "Ta kontakt for visning — denne varer ikke lenge! 👇";
  const igCity = addr.split(",").pop()?.trim().toLowerCase().replace(/\s+/g, "") || "oslo";
  const smsHighlight = firstHighlight ? ", " + firstHighlight : "";

  const finn = [
    shortAddr + " — " + type + " med sjel og moderne komfort",
    "",
    "Velkommen til en gjennomtenkt " + sqm + " kvm stor " + typeLower + floorText + " som forener klassisk bygårdsstil med moderne oppgraderinger.",
    "",
    highlightIntro + "Leiligheten byr på " + rooms + " rom med gjennomgående god takhøyde og store vinduer som slipper inn rikelig med naturlig lys. Stuen er romslig og åpen, med plass til både sofagruppe og spisebord" + peisText + ".",
    "",
    "Kjøkkenet er" + kjokkenText + " praktisk innredet med god benkeplass og moderne hvitevarer. Fra kjøkkenet har du direkte tilgang til " + balkongText + ".",
    "",
    buildYearPara + "Beliggenhet" + beliggText + ".",
    "",
    barnText + "Her har du gangavstand til kollektivtransport, matbutikker, kafeer og grøntområder.",
    "",
    "En bolig for deg som verdsetter " + toneEnd + ".",
    "",
    "Velkommen på visning!",
    "",
    "Primærrom: " + sqm + " kvm | " + rooms + " rom" + buildYearText,
  ].join("\n");

  const instagram = [
    igHook,
    "",
    sqm + " kvm " + typeLower + floorText + " med " + igHighlights + " ✨",
    "",
    igLocation + " 📍",
    "",
    igCta,
    "",
    "#eiendom #bolig #tilsalgs #" + igCity + " #" + typeLower + " #nybolig #boligdrøm #megler",
  ].join("\n");

  const sms = "Ny " + typeLower + " i " + shortAddr + ": " + sqm + "kvm, " + rooms + " rom" + smsHighlight + ". Visning snart — interessert?";

  return { finn, instagram, sms };
}

// ── HANDLER ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const input: BoligInput = await request.json();

    if (!input.address?.trim() || !input.sqm) {
      return new Response(
        JSON.stringify({ error: "Adresse og kvadratmeter er påkrevd." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return example output as JSON (client handles both SSE and JSON)
    if (!apiKey) {
      await new Promise((r) => setTimeout(r, 1500));
      return new Response(JSON.stringify(getExampleOutput(input)), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── Build messages ──
    const isRevision = !!(input.previousFinnText && input.feedback);
    const details = buildDetails(input);
    const toneInstruction = TONE_PROMPTS[input.tone] || TONE_PROMPTS.professional;

    let systemContent: string;
    let userContent: string;

    if (isRevision) {
      systemContent = REVISION_SYSTEM_PROMPT;
      userContent = [
        toneInstruction,
        "",
        "Boliginfo:",
        details,
        "",
        "Forrige FINN-annonse:",
        input.previousFinnText,
        "",
        "Feedback fra megleren:",
        input.feedback,
        "",
        "Generer en forbedret versjon av alle tre tekstene (FINN-annonse, Instagram-caption, SMS) basert på feedbacken.",
      ].join("\n");
    } else {
      systemContent = SYSTEM_PROMPT;
      userContent = toneInstruction + "\n\nGenerer boligtekster for denne eiendommen:\n\n" + details;
    }

    // ── Call OpenAI with streaming ──
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("OpenAI error:", err);
      return new Response(
        JSON.stringify({ error: "Kunne ikke generere tekst. Prøv igjen." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Stream SSE to client ──
    // Strategy: incrementally extract the "finn" value from the JSON being generated
    // and stream it as finn_chunk events. At the end, parse the complete JSON for
    // instagram and sms and send those as complete events.
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let finnValueStart = -1;
        let finnSentLength = 0;
        let sseBuffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split("\n");
            sseBuffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (!delta) continue;

                accumulated += delta;

                // Find the start of the "finn" value in the JSON
                if (finnValueStart === -1) {
                  const match = accumulated.match(/"finn"\s*:\s*"/);
                  if (match) {
                    finnValueStart = match.index! + match[0].length;
                  }
                }

                // Stream finn text chunks incrementally
                if (finnValueStart !== -1) {
                  const finnText = extractJsonStringValue(accumulated, finnValueStart);
                  if (finnText.length > finnSentLength) {
                    const newPart = finnText.slice(finnSentLength);
                    controller.enqueue(
                      encoder.encode(
                        "data: " + JSON.stringify({ type: "finn_chunk", text: newPart }) + "\n\n"
                      )
                    );
                    finnSentLength = finnText.length;
                  }
                }
              } catch {
                // skip unparseable SSE lines
              }
            }
          }

          // ── Stream complete: parse full JSON for instagram + sms ──
          try {
            const result = JSON.parse(accumulated);
            if (result.instagram) {
              controller.enqueue(
                encoder.encode(
                  "data: " + JSON.stringify({ type: "instagram", text: result.instagram }) + "\n\n"
                )
              );
            }
            if (result.sms) {
              controller.enqueue(
                encoder.encode(
                  "data: " + JSON.stringify({ type: "sms", text: result.sms }) + "\n\n"
                )
              );
            }
          } catch (parseErr) {
            console.error("Failed to parse complete JSON:", parseErr, "accumulated:", accumulated.slice(0, 200));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (streamErr) {
          console.error("Stream error:", streamErr);
          controller.enqueue(
            encoder.encode(
              "data: " + JSON.stringify({ type: "error", text: "Streaming feilet. Prøv igjen." }) + "\n\n"
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("Generate error:", e);
    return new Response(
      JSON.stringify({ error: "Noe gikk galt. Prøv igjen." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
