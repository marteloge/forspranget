import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getAgent(request: NextRequest): string | null {
  return request.cookies.get("crm_agent")?.value ?? null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { id } = await params;
  const sql = neon(process.env.DATABASE_URL!);

  const props = await sql`SELECT * FROM crm_properties WHERE id = ${id} AND agent_email = ${agentEmail}`;
  if (!props.length) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });

  // Fetch linked contacts
  const contacts = await sql`
    SELECT cp.*, c.first_name, c.last_name, c.phone, c.status
    FROM crm_contact_properties cp
    JOIN crm_contacts c ON c.id = cp.contact_id
    WHERE cp.property_id = ${id}
    ORDER BY cp.created_at DESC
  `;

  return NextResponse.json({ ...props[0], contacts });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { address, postal_code, city, property_type, size_sqm, estimated_value, notes } = body;

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    UPDATE crm_properties SET
      address = COALESCE(${address ?? null}, address),
      postal_code = COALESCE(${postal_code ?? null}, postal_code),
      city = COALESCE(${city ?? null}, city),
      property_type = COALESCE(${property_type ?? null}, property_type),
      size_sqm = COALESCE(${size_sqm ?? null}, size_sqm),
      estimated_value = COALESCE(${estimated_value ?? null}, estimated_value),
      notes = COALESCE(${notes ?? null}, notes),
      updated_at = now()
    WHERE id = ${id} AND agent_email = ${agentEmail}
    RETURNING *
  `;
  if (!result.length) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { id } = await params;
  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM crm_properties WHERE id = ${id} AND agent_email = ${agentEmail}`;
  return NextResponse.json({ success: true });
}

// POST /api/crm/properties/[id]/contacts — link a contact to this property
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { id } = await params;
  const { contact_id, relationship } = await request.json();
  if (!contact_id) return NextResponse.json({ error: "contact_id påkrevd" }, { status: 400 });

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    INSERT INTO crm_contact_properties (contact_id, property_id, relationship)
    VALUES (${contact_id}, ${id}, ${relationship ?? "interested"})
    ON CONFLICT (contact_id, property_id, relationship) DO NOTHING
    RETURNING *
  `;
  return NextResponse.json(result[0] ?? { exists: true }, { status: 201 });
}
