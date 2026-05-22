-- =============================================================
-- Enable Row-Level Security on all public tables
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- 1. Enable RLS on each table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Public read-only policies for content tables
--    (anyone can SELECT, but cannot INSERT/UPDATE/DELETE via anon key)

CREATE POLICY "Allow public read access on services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on faqs"
  ON public.faqs FOR SELECT
  USING (true);

-- 3. Leads table: allow anonymous inserts only (quote form submissions)
--    No one can read/update/delete leads via the anon key.

CREATE POLICY "Allow anonymous insert on leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);
