import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getAgent(request: NextRequest): string | null {
  return request.cookies.get("crm_agent")?.value ?? null;
}

export async function GET(request: NextRequest) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const sql = neon(process.env.DATABASE_URL!);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  let contacts;
  if (q) {
    const search = `%${q}%`;
    contacts = await sql`
      SELECT c.*,
        (SELECT completed_at FROM crm_events WHERE contact_id = c.id ORDER BY completed_at DESC LIMIT 1) as last_event_at,
        (SELECT COUNT(*) FROM crm_events WHERE contact_id = c.id) as event_count
      FROM crm_contacts c
      WHERE c.agent_email = ${agentEmail}
        AND (c.first_name ILIKE ${search} OR c.last_name ILIKE ${search}
             OR c.phone ILIKE ${search} OR c.email ILIKE ${search})
      ORDER BY c.updated_at DESC
    `;
  } else if (status) {
    contacts = await sql`
      SELECT c.*,
        (SELECT completed_at FROM crm_events WHERE contact_id = c.id ORDER BY completed_at DESC LIMIT 1) as last_event_at,
        (SELECT COUNT(*) FROM crm_events WHERE contact_id = c.id) as event_count
      FROM crm_contacts c
      WHERE c.agent_email = ${agentEmail} AND c.status = ${status}
      ORDER BY c.updated_at DESC
    `;
  } else {
    contacts = await sql`
      SELECT c.*,
        (SELECT completed_at FROM crm_events WHERE contact_id = c.id ORDER BY completed_at DESC LIMIT 1) as last_event_at,
        (SELECT COUNT(*) FROM crm_events WHERE contact_id = c.id) as event_count
      FROM crm_contacts c
      WHERE c.agent_email = ${agentEmail}
      ORDER BY c.updated_at DESC
    `;
  }

  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const body = await request.json();
  const { first_name, last_name, phone, email, status, type, source, notes, next_contact } = body;

  if (!first_name) {
    return NextResponse.json({ error: "Fornavn er påkrevd" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    INSERT INTO crm_contacts (agent_email, first_name, last_name, phone, email, status, type, source, notes, next_contact)
    VALUES (${agentEmail}, ${first_name}, ${last_name ?? ""}, ${phone ?? ""},
            ${email ?? ""}, ${status ?? "cold"}, ${type ?? "unknown"},
            ${source ?? ""}, ${notes ?? ""}, ${next_contact ?? null})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
