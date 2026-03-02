import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getAgent(request: NextRequest): string | null {
  return request.cookies.get("crm_agent")?.value ?? null;
}

export async function GET(request: NextRequest) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const sql = neon(process.env.DATABASE_URL!);

  let properties;
  if (q) {
    const search = `%${q}%`;
    properties = await sql`
      SELECT p.*,
        (SELECT COUNT(*) FROM crm_events WHERE property_id = p.id) as event_count,
        (SELECT COUNT(*) FROM crm_contact_properties WHERE property_id = p.id) as contact_count,
        (SELECT completed_at FROM crm_events WHERE property_id = p.id ORDER BY completed_at DESC LIMIT 1) as last_event_at
      FROM crm_properties p
      WHERE p.agent_email = ${agentEmail}
        AND (p.address ILIKE ${search} OR p.city ILIKE ${search} OR p.postal_code ILIKE ${search})
      ORDER BY p.updated_at DESC
    `;
  } else {
    properties = await sql`
      SELECT p.*,
        (SELECT COUNT(*) FROM crm_events WHERE property_id = p.id) as event_count,
        (SELECT COUNT(*) FROM crm_contact_properties WHERE property_id = p.id) as contact_count,
        (SELECT completed_at FROM crm_events WHERE property_id = p.id ORDER BY completed_at DESC LIMIT 1) as last_event_at
      FROM crm_properties p
      WHERE p.agent_email = ${agentEmail}
      ORDER BY p.updated_at DESC
    `;
  }

  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const body = await request.json();
  const { address, postal_code, city, property_type, size_sqm, estimated_value, notes } = body;

  if (!address) return NextResponse.json({ error: "Adresse er påkrevd" }, { status: 400 });

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    INSERT INTO crm_properties (agent_email, address, postal_code, city, property_type, size_sqm, estimated_value, notes)
    VALUES (${agentEmail}, ${address}, ${postal_code ?? ""}, ${city ?? ""},
            ${property_type ?? "apartment"}, ${size_sqm ?? null}, ${estimated_value ?? null}, ${notes ?? ""})
    RETURNING *
  `;
  return NextResponse.json(result[0], { status: 201 });
}
