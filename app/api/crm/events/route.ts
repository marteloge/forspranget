import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getAgent(request: NextRequest): string | null {
  return request.cookies.get("crm_agent")?.value ?? null;
}

export async function GET(request: NextRequest) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contact_id");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const sql = neon(process.env.DATABASE_URL!);

  let events;
  if (contactId) {
    events = await sql`
      SELECT e.*, c.first_name, c.last_name
      FROM crm_events e
      LEFT JOIN crm_contacts c ON c.id = e.contact_id
      WHERE e.agent_email = ${agentEmail} AND e.contact_id = ${contactId}
      ORDER BY e.completed_at DESC
      LIMIT ${limit}
    `;
  } else {
    events = await sql`
      SELECT e.*, c.first_name, c.last_name
      FROM crm_events e
      LEFT JOIN crm_contacts c ON c.id = e.contact_id
      WHERE e.agent_email = ${agentEmail}
      ORDER BY e.completed_at DESC
      LIMIT ${limit}
    `;
  }

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const body = await request.json();
  const { contact_id, event_type, address, notes, outcome, next_action_date, next_action_note, completed_at } = body;

  if (!contact_id || !event_type) {
    return NextResponse.json({ error: "contact_id og event_type er påkrevd" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    INSERT INTO crm_events (agent_email, contact_id, event_type, address, notes, outcome, next_action_date, next_action_note, completed_at)
    VALUES (
      ${agentEmail}, ${contact_id}, ${event_type}, ${address ?? ""},
      ${notes ?? ""}, ${outcome ?? "neutral"},
      ${next_action_date ?? null}, ${next_action_note ?? ""},
      ${completed_at ? new Date(completed_at) : new Date()}
    )
    RETURNING *
  `;

  // Update contact's next_contact and updated_at
  if (next_action_date) {
    await sql`
      UPDATE crm_contacts SET next_contact = ${next_action_date}, updated_at = now()
      WHERE id = ${contact_id} AND agent_email = ${agentEmail}
    `;
  } else {
    await sql`UPDATE crm_contacts SET updated_at = now() WHERE id = ${contact_id} AND agent_email = ${agentEmail}`;
  }

  return NextResponse.json(result[0], { status: 201 });
}
