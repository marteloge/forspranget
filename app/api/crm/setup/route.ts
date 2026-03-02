import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: NextRequest) {
  // Simple security: require a secret header
  const secret = request.headers.get("x-setup-secret");
  if (secret !== process.env.CRM_SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS crm_contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        status TEXT DEFAULT 'cold',
        type TEXT DEFAULT 'unknown',
        source TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        next_contact DATE,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_email TEXT NOT NULL,
        contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL DEFAULT 'note',
        address TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        outcome TEXT DEFAULT 'neutral',
        next_action_date DATE,
        next_action_note TEXT DEFAULT '',
        completed_at TIMESTAMPTZ DEFAULT now(),
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_crm_contacts_agent ON crm_contacts(agent_email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_contacts_next ON crm_contacts(agent_email, next_contact)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_events_contact ON crm_events(contact_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_events_agent ON crm_events(agent_email, completed_at DESC)`;

    return NextResponse.json({ success: true, message: "Tabeller opprettet!" });
  } catch (err) {
    console.error("Setup error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
