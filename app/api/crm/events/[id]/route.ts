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

  await sql`DELETE FROM crm_events WHERE id = ${id} AND agent_email = ${agentEmail}`;
  return NextResponse.json({ success: true });
}
