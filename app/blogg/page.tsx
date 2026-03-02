import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/app/data/posts";

export const metadata: Metadata = {
  title: "Blogg — Forspranget | AI for norske eiendomsmeglere",
  description:
    "Innsikt, guider og nyheter om AI i eiendomsbransjen. For norske meglere som vil jobbe smartere.",
  openGraph: {
    title: "Forspranget Blogg — AI for norske eiendomsmeglere",
    description:
      "Innsikt, guider og nyheter om AI i eiendomsbransjen. For norske meglere som vil jobbe smartere.",
    type: "website",
    locale: "nb_NO",
  },
  alternates: {
    canonical: "https://forspranget.no/blogg",
  },
};

export default function BloggPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navigation */}
      <nav
        className="px-6 py-4 border-b"
        style={{ borderColor: "rgba(201,169,110,0.15)" }}
      >
        <div className="mx-auto max-w-3xl flex items-center gap-4">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: "var(--gold)", opacity: 0.8 }}
          >
            ← Forspranget
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1
          className="text-3xl sm:text-4xl mb-2 font-display"
          style={{ color: "var(--foreground)" }}
        >
          Blogg
        </h1>
        <p
          className="text-lg mb-10"
          style={{ color: "var(--foreground)", opacity: 0.55 }}
        >
          Innsikt og guider for meglere som vil ligge foran.
        </p>

        {/* Featured post */}
        <Link
          href={`/blogg/${featured.slug}`}
          className="block rounded-xl border p-6 sm:p-8 mb-4 transition-all hover:scale-[1.01]"
          style={{
            borderColor: "rgba(201,169,110,0.3)",
            background: "rgba(201,169,110,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: "var(--gold)", color: "var(--background)" }}
            >
              {featured.tag}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--foreground)", opacity: 0.4 }}
            >
              {featured.date} · {featured.readTime}
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl mb-2 font-display"
            style={{ color: "var(--foreground)" }}
          >
            {featured.title}
          </h2>
          <p
            className="leading-relaxed text-sm"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            {featured.description}
          </p>
          <span
            className="inline-block mt-4 text-sm font-medium"
            style={{ color: "var(--gold)" }}
          >
            Les artikkelen →
          </span>
        </Link>

        {/* Rest of posts */}
        <div className="space-y-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blogg/${post.slug}`}
              className="block rounded-xl border p-6 sm:p-8 transition-all hover:scale-[1.01]"
              style={{
                borderColor: "rgba(201,169,110,0.15)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(201,169,110,0.15)",
                    color: "var(--gold)",
                  }}
                >
                  {post.tag}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                  {post.date} · {post.readTime}
                </span>
              </div>
              <h2
                className="text-xl sm:text-2xl mb-2 font-display"
                style={{ color: "var(--foreground)" }}
              >
                {post.title}
              </h2>
              <p
                className="leading-relaxed text-sm"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                {post.description}
              </p>
              <span
                className="inline-block mt-4 text-sm"
                style={{ color: "var(--gold)", opacity: 0.8 }}
              >
                Les artikkelen →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-16 rounded-xl border p-8 text-center"
          style={{ borderColor: "rgba(201,169,110,0.2)" }}
        >
          <p
            className="text-lg mb-4 font-display"
            style={{ color: "var(--foreground)" }}
          >
            Vil du prøve Forspranget selv?
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ background: "var(--gold)", color: "var(--background)" }}
          >
            Kom deg på ventelisten
          </Link>
        </div>
      </div>
    </main>
  );
}
