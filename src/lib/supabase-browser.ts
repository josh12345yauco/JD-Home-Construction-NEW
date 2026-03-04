import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Create a browser Supabase client (anon key). Pass url + anonKey from /api/config. */
export function createSupabaseBrowser(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey);
}
