import type { APIRoute } from 'astro';
import landingData from '../data/service-landing.json';
import serviceAreasData from '../data/service-areas.json';
import blogPostsData from '../data/blog-posts.json';

const SITE = 'https://www.jdhomeconstruction.org';

export const GET: APIRoute = async () => {
  const staticPaths = ['', '/about', '/services', '/projects', '/areas', '/faq', '/blog', '/contact'];
  const servicePaths = (landingData as { slug: string }[]).map((s) => `/services/${s.slug}`);
  const areaPaths = (serviceAreasData as { slug: string }[]).map((a) => `/areas/${a.slug}`);
  const blogPaths = ((blogPostsData as { slug?: string }[]) || [])
    .filter((p) => p.slug)
    .map((p) => `/blog/${p.slug}`);

  const urls = [...staticPaths, ...servicePaths, ...areaPaths, ...blogPaths];
  const lastmod = new Date().toISOString().split('T')[0];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${path.startsWith('/services/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : path.startsWith('/services/') ? '0.9' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
