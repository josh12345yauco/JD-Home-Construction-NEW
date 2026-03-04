import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase-server';
import fallbackData from '../../../data/services.json';

function mapRow(row: Record<string, unknown>) {
  return {
    _id: row.id,
    serviceName: row.service_name,
    serviceImage: row.service_image,
    shortDescription: row.short_description,
    detailedDescription: row.detailed_description,
    processSteps: row.process_steps,
    benefits: row.benefits,
    timelineEstimate: row.timeline_estimate,
    displayOrder: row.display_order,
  };
}

export const GET: APIRoute = async ({ url }) => {
  const skip = Math.max(0, parseInt(url.searchParams.get('skip') || '0', 10));
  const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));

  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from('services').select('*').order('display_order').range(skip, skip + limit - 1);
    if (!error && data) {
      const { count } = await sb.from('services').select('*', { count: 'exact', head: true });
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
  const { error } = await sb.from('services').upsert({
    id, service_name: body.serviceName || '', service_image: body.serviceImage || '',
    short_description: body.shortDescription || '', detailed_description: body.detailedDescription || '',
    process_steps: body.processSteps || '', benefits: body.benefits || '',
    timeline_estimate: body.timelineEstimate || '', display_order: body.displayOrder ?? 0,
    updated_at: new Date().toISOString(),
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  const sb = getSupabaseAdmin();
  if (!sb) return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 503 });
  const { error } = await sb.from('services').delete().eq('id', id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
