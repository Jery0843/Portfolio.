import { siteUrl } from '$lib/seo';

export const prerender = true;

const pages = ['/', '/about', '/experience', '/education', '/skills', '/projects', '/certificates', '/contact'];

export function GET() {
    // Only this host belongs in its sitemap. Omit lastmod rather than invent update dates.
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(path => `    <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}
</urlset>`;
    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml; charset=utf-8'
        }
    });
}
