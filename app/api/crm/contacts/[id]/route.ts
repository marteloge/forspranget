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

  const contacts = await sql`
    SELECT * FROM crm_contacts WHERE id = ${id} AND agent_email = ${agentEmail}
  `;

  if (!contacts.length) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });
  return NextResponse.json(contacts[0]);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const sql = neon(process.env.DATABASE_URL!);

  const { first_name, last_name, phone, email, status, type, source, notes, next_contact } = body;

  const result = await sql`
    UPDATE crm_contacts SET
      first_name = COALESCE(${first_name ?? null}, first_name),
      last_name = COALESCE(${last_name ?? null}, last_name),
      phone = COALESCE(${phone ?? null}, phone),
      email = COALESCE(${email ?? null}, email),
      status = COALESCE(${status ?? null}, status),
      type = COALESCE(${type ?? null}, type),
      source = COALESCE(${source ?? null}, source),
      notes = COALESCE(${notes ?? null}, notes),
      next_contact = ${next_contact !== undefined ? (next_contact || null) : sql`next_contact`},
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

  await sql`DELETE FROM crm_contacts WHERE id = ${id} AND agent_email = ${agentEmail}`;
  return NextResponse.json({ success: true });
}
