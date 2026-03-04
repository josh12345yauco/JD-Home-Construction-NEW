import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase-server';

const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime',
]);

/** MIME by extension when browser sends empty file.type (e.g. some mobile) */
const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
};

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB (Supabase Storage default limit)

function getFileMime(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return EXT_TO_MIME[ext] || '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Storage not configured' }), { status: 503 });
    }

    const { error: bucketError } = await supabase.storage.createBucket('media', {
      public: true,
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
    if (bucketError && !bucketError.message.includes('already exists') && !bucketError.message.includes('Duplicate')) {
      return new Response(JSON.stringify({ error: `Storage setup failed: ${bucketError.message}` }), { status: 503 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const mime = getFileMime(file);
      if (!mime || !ALLOWED_TYPES.has(mime)) {
        return new Response(JSON.stringify({ error: `Unsupported file type: ${file.type || file.name}` }), { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return new Response(JSON.stringify({ error: `File too large (max 50MB): ${file.name}` }), { status: 400 });
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const safeName = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 60);
      const uniqueName = `${safeName}-${Date.now()}.${ext}`;
      const storagePath = `uploads/${uniqueName}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || getFileMime(file);
      const { error } = await supabase.storage
        .from('media')
        .upload(storagePath, buffer, { contentType, upsert: false });

      if (error) {
        return new Response(JSON.stringify({ error: `Upload failed: ${error.message}` }), { status: 500 });
      }

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(storagePath);
      urls.push(urlData.publicUrl);
    }

    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
