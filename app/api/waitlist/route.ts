import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Navn og e-post er påkrevd" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig e-postadresse" },
        { status: 400 }
      );
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("Missing DATABASE_URL env var");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    // Check if already registered
    const existing = await sql`
      SELECT id FROM waitlist WHERE email = ${email.toLowerCase()} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "already_registered" },
        { status: 409 }
      );
    }

    // Insert new entry
    await sql`
      INSERT INTO waitlist (email, name, source, created_at)
      VALUES (
        ${email.toLowerCase()},
        ${name.trim()},
        'forspranget.no',
        NOW()
      )
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
