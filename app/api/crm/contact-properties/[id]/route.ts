import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getAgent(request: NextRequest): string | null {
  return request.cookies.get("crm_agent")?.value ?? null;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agentEmail = getAgent(request);
  if (!agentEmail) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { id } = await params;
  const sql = neon(process.env.DATABASE_URL!);

  // Verify agent owns either the contact or property in this link
  await sql`
    DELETE FROM crm_contact_properties cp
    USING crm_contacts c
    WHERE cp.id = ${id}
      AND cp.contact_id = c.id
      AND c.agent_email = ${agentEmail}
  `;

  return NextResponse.json({ success: true });
}
