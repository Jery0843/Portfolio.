import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const origin = 'https://jerome.co.in';
const routes = ['', 'about', 'projects', 'experience', 'education', 'skills', 'certificates', 'contact'];
const titles = new Set();
const descriptions = new Set();

function attributes(tag) {
    return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
}

for (const route of routes) {
    test(`prerendered SEO: /${route}`, async () => {
        const html = await readFile(`.svelte-kit/output/prerendered/pages/${route || 'index'}.html`, 'utf8');
        const title = [...html.matchAll(/<title>(.*?)<\/title>/gs)];
        assert.equal(title.length, 1, 'one server-rendered title');
        assert.ok(!titles.has(title[0][1]), 'unique page title');
        titles.add(title[0][1]);
        const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
        const meta = key => {
            const matches = metas.filter(item => item.name === key || item.property === key);
            assert.equal(matches.length, 1, `one ${key} tag`);
            assert.ok(matches[0].content, `${key} has content`);
            return matches[0].content;
        };
        const description = meta('description');
        assert.ok(!descriptions.has(description), 'unique description');
        descriptions.add(description);
        const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag)).filter(item => item.rel === 'canonical');
        assert.equal(canonical.length, 1);
        assert.equal(canonical[0].href, `${origin}/${route}`);
        assert.equal(meta('og:url'), canonical[0].href);
        assert.equal(meta('og:title'), title[0][1]);
        assert.equal(meta('og:description'), description);
        assert.match(meta('robots'), /^index, follow/);
        assert.equal(meta('twitter:card'), 'summary_large_image');
        assert.equal(meta('twitter:image'), meta('og:image'));
        meta('og:image:alt');
        meta('twitter:image:alt');
        const image = new URL(meta('og:image'));
        assert.equal(image.origin, origin);
        await access(`static${image.pathname}`);
        assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'one rendered main heading');
        const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(([, json]) => JSON.parse(json));
        assert.ok(schemas.some(schema => schema['@type'] === 'WebPage' && schema.url === canonical[0].href));
        assert.ok(schemas.some(schema => schema['@type'] === 'BreadcrumbList'));
        assert.ok(!JSON.stringify(schemas).includes('SearchAction'), 'no nonexistent search advertised');
        if (route === '' || route === 'about') {
            const person = schemas.find(schema => schema['@type'] === 'Person') ?? schemas.find(schema => schema['@type'] === 'ProfilePage')?.mainEntity;
            assert.equal(person.email, 'mailto:jeromeandrewk@outlook.com');
            assert.ok(person.sameAs.includes('https://0xjerry.jerome.co.in/'));
            assert.ok(!person.alumniOf.some(school => school.name === 'VIT University'));
        }
    });
}

test('sitemap lists only canonical portfolio pages and robots exposes it', async () => {
    const xml = await readFile('.svelte-kit/output/prerendered/pages/sitemap.xml', 'utf8');
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
    assert.deepEqual(urls.sort(), routes.map(route => `${origin}/${route}`).sort());
    assert.ok(!xml.includes('<lastmod>'), 'no invented build-time modification dates');
    const robots = await readFile('static/robots.txt', 'utf8');
    assert.match(robots, /Sitemap: https:\/\/jerome\.co\.in\/sitemap\.xml/);
    assert.match(robots, /Disallow: \/api\//);
    assert.ok(!/^Disallow: \/$/m.test(robots));
});
