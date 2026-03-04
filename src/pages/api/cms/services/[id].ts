import type { APIRoute } from 'astro';
import data from '../../../../data/services.json';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  const items = Array.isArray(data) ? data : [];
  const item = items.find((s: { _id: string }) => s._id === id) ?? null;
  if (!item) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify(item), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
