export const prerender = true;

const site = 'https://jerome.co.in';
const pages = [
    '/',
    '/about',
    '/experience',
    '/education',
    '/skills',
    '/projects',
    '/certificates',
    '/contact'
];

const externalPages = [
    'https://0xjerry.jerome.co.in'
];

export async function GET() {
    const body = sitemap(pages, externalPages);
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml'
    };
    return new Response(body, { headers });
}

const sitemap = (pages: string[], external: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${pages
        .map(
            (page) => `
    <url>
        <loc>${site}${page}</loc>
        <changefreq>${page === '/' ? 'daily' : 'weekly'}</changefreq>
        <priority>${page === '/' ? '1.0' : '0.8'}</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
`
        )
        .join('')}${external
            .map(
                (url) => `
    <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
`
            )
            .join('')}
</urlset>`;
