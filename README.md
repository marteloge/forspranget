# Forspranget 🏠

> AI-arbeidsflate for norske eiendomsmeglere.

**Live:** [forspranget.no](https://forspranget.no)

## Stack

- **Framework:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Neon (serverless Postgres)
- **Auth:** NextAuth / Neon (kommer i fase 2)
- **AI:** OpenAI GPT-4o (kommer i fase 2)
- **Hosting:** Vercel

## Features (roadmap)

- [x] Landing page + waitlist
- [ ] AI Boligbeskrivelse-generator
- [ ] Prospektering (Kartverket API)
- [ ] SoMe-innholdsgenerator
- [ ] SOI-CRM
- [ ] Oppfølgingsautomatisering

## Kom i gang

```bash
npm install
cp .env.example .env.local
# Fyll inn DATABASE_URL fra Neon
npm run dev
```

## Database-oppsett (Neon)

1. Koble til Neon via **Vercel Marketplace-integrasjonen** (gratis, setter DATABASE_URL automatisk)
2. Kjør denne SQL-migrasjonen i Neon Console:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'forspranget.no',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);
```
