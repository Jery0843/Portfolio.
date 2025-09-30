export const prerender = true;

const site = 'https://jerome.is-a.dev';
const pages = [
    '',
    '/about',
    '/experience',
    '/education',
    '/skills',
    '/projects',
    '/certificates',
    '/contact'
];

export async function GET() {
    const body = sitemap(pages);
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml'
    };
    return new Response(body, { headers });
}

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
${pages
    .map(
        (page) => `
    <url>
        <loc>${site}${page}</loc>
        <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
`
    )
    .join('')}
</urlset>`;