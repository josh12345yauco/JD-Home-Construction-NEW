import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase-server';
import fallbackData from '../../../data/faqs.json';

function mapRow(row: Record<string, unknown>) {
  return {
    _id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    isFeatured: row.is_featured,
    displayOrder: row.display_order,
  };
}

export const GET: APIRoute = async ({ url }) => {
  const skip = Math.max(0, parseInt(url.searchParams.get('skip') || '0', 10));
  const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));

  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('faqs').select('*').order('display_order').range(skip, skip + limit - 1);
    if (!error && data) {
      const { count } = await sb.from('faqs').select('*', { count: 'exact', head: true });
      const totalCount = count ?? data.length;
      return new Response(JSON.stringify({ items: data.map(mapRow), totalCount, hasNext: skip + limit < totalCount }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const items = Array.isArray(fallbackData) ? fallbackData : [];
  const paginated = items.slice(skip, skip + limit);
  return new Response(JSON.stringify({ items: paginated, totalCount: items.length, hasNext: skip + limit < items.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request }) => {
  const sb = getSupabaseAdmin();
  if (!sb) return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 503 });
  const body = await request.json();
  const id = body._id || crypto.randomUUID();
  const { error } = await sb.from('faqs').upsert({
    id, question: body.question || '', answer: body.answer || '',
    category: body.category || '', is_featured: body.isFeatured ?? true,
    display_order: body.displayOrder ?? 0, updated_at: new Date().toISOString(),
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  const sb = getSupabaseAdmin();
  if (!sb) return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 503 });
  const { error } = await sb.from('faqs').delete().eq('id', id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
