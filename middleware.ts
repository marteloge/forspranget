import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/crm") && !pathname.startsWith("/crm/login")) {
    const agent = request.cookies.get("crm_agent");
    if (!agent?.value) {
      return NextResponse.redirect(new URL("/crm/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*"],
};
