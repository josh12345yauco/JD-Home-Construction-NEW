import type { APIRoute } from 'astro';

/** Returns public Supabase config for client-side auth (anon key is safe to expose). */
export const GET: APIRoute = () => {
  const url = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ supabaseUrl: url, supabaseAnonKey: anon }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
