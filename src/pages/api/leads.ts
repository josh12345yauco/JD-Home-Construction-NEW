import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase-server';

async function isAuthorized(request: Request): Promise<boolean> {
  const auth = request.headers.get('authorization');
  const token = auth?.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  const secret = import.meta.env.ADMIN_SECRET || process.env.ADMIN_SECRET;
  if (secret && token === secret) return true;

  // Supabase JWT (contains two dots)
  if (token.includes('.') && token.split('.').length >= 3) {
    const supabase = getSupabaseAdmin();
    if (!supabase) return false;
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return !error && !!user;
  }
  return false;
}

export const GET: APIRoute = async ({ request }) => {
  if (!(await isAuthorized(request))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, email, phone, zip_code, project_type, timeline, budget_range, project_details, photo_urls, status, notes, created_at')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      const leads = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        zipCode: row.zip_code,
        projectType: row.project_type,
        timeline: row.timeline,
        budgetRange: row.budget_range,
        projectDetails: row.project_details,
        photoUrls: row.photo_urls ?? [],
        status: row.status ?? 'new',
        notes: row.notes ?? '',
        createdAt: row.created_at,
      }));
      return new Response(JSON.stringify({ leads }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Leads fetch error:', err);
      return new Response(JSON.stringify({ leads: [], error: 'Failed to fetch leads' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ leads: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
