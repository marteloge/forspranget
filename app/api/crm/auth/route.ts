import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Mangler e-post eller kode" }, { status: 400 });
  }

  const accessCode = process.env.CRM_ACCESS_CODE;
  if (!accessCode || code !== accessCode) {
    return NextResponse.json({ error: "Feil tilgangskode" }, { status: 401 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Ugyldig e-postadresse" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("crm_agent", email.toLowerCase().trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 dager
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("crm_agent");
  return response;
}
