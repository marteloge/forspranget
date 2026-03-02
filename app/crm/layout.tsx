import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "CRM — Forspranget",
  description: "Lead-oppfølging for eiendomsmeglere",
};

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const agentEmail = cookieStore.get("crm_agent")?.value ?? "";

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Top nav */}
      <nav className="border-b border-white/[0.06] bg-[#0a0e1a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/crm" className="font-display text-lg tracking-wide">
              Forsp<span className="text-gold-gradient">ranget</span>
              <span className="text-gray-600 text-xs font-sans ml-2 tracking-widest uppercase">CRM</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <Link href="/crm" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/crm/contacts" className="text-gray-400 hover:text-white transition-colors">
                Kontakter
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 hidden sm:block">{agentEmail}</span>
            <CrmLogout />
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden border-t border-white/[0.04] px-4 py-2 flex gap-4 text-sm">
          <Link href="/crm" className="text-gray-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/crm/contacts" className="text-gray-400 hover:text-white transition-colors">
            Kontakter
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

function CrmLogout() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies: cookiesFn } = await import("next/headers");
        const { redirect } = await import("next/navigation");
        const cookieStore = await cookiesFn();
        cookieStore.delete("crm_agent");
        redirect("/crm/login");
      }}
    >
      <button
        type="submit"
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-2 py-1"
      >
        Logg ut
      </button>
    </form>
  );
}
