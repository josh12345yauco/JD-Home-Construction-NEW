-- Leads table for quote form submissions
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  project_type TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_details TEXT NOT NULL,
  photo_urls JSONB DEFAULT '[]',
  status TEXT DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table is accessed only via your API using the service role key (no RLS required).
COMMENT ON TABLE public.leads IS 'Quote request form submissions; managed via backend API with service role.';
