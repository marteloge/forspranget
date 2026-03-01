# Forspranget 🏠

> AI-arbeidsflate for norske eiendomsmeglere.

**Live:** [forspranget.no](https://forspranget.no)

## Stack

- **Framework:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth (kommer i fase 2)
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
# Fyll inn Supabase-nøkler
npm run dev
```

## Supabase-oppsett

Kjør denne SQL-migrasjonen i Supabase:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'forspranget.no',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for rask e-postsøk
CREATE INDEX waitlist_email_idx ON waitlist(email);

-- Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Kun server-side (service role) kan lese/skrive
CREATE POLICY "Service role only" ON waitlist
  USING (false)
  WITH CHECK (false);
```
