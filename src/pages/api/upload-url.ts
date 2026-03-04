import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase-server';

const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime',
]);

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
};

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

function getMime(filename: string, contentType?: string): string {
  if (contentType && ALLOWED_TYPES.has(contentType)) return contentType;
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_TO_MIME[ext] || '';
}

/** Returns a signed upload URL so the client can upload directly to Supabase (no Vercel body limit). */
export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const body = await request.json();
    const { filename, contentType, size } = body as { filename?: string; contentType?: string; size?: number };
    if (!filename || typeof filename !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing filename' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const mime = getMime(filename, contentType);
    if (!mime || !ALLOWED_TYPES.has(mime)) {
      return new Response(JSON.stringify({ error: `Unsupported file type: ${contentType || filename}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (typeof size === 'number' && size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: `File too large (max 50MB): ${filename}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Storage not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const { error: bucketError } = await supabase.storage.createBucket('media', {
      public: true,
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
    if (bucketError && !bucketError.message.includes('already exists') && !bucketError.message.includes('Duplicate')) {
      return new Response(JSON.stringify({ error: `Storage setup failed: ${bucketError.message}` }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const ext = filename.split('.').pop()?.toLowerCase() || 'bin';
    const safeName = filename
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60);
    const storagePath = `uploads/${safeName}-${Date.now()}.${ext}`;

    const { data: signed, error } = await supabase.storage.from('media').createSignedUploadUrl(storagePath);
    if (error) {
      return new Response(JSON.stringify({ error: `Upload URL failed: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    if (!signed?.signedUrl) {
      return new Response(JSON.stringify({ error: 'No signed URL returned' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(storagePath);
    return new Response(
      JSON.stringify({ signedUrl: signed.signedUrl, publicUrl: urlData.publicUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload URL failed';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
