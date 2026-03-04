import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/** Server-side Supabase client (service role). Use in API routes only. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_URL) || process.env.SUPABASE_URL;
  const key = (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY) || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
