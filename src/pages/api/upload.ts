import type { APIRoute } from 'astro';

const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime',
]);

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), { status: 400 });
    }

    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Storage not configured' }), { status: 503 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return new Response(JSON.stringify({ error: `Unsupported file type: ${file.type}` }), { status: 400 });
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
      const { error } = await supabase.storage
        .from('media')
        .upload(storagePath, buffer, { contentType: file.type, upsert: false });

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
