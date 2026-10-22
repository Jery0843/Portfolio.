# 0xJerry — Cinematic portfolio

Jerome Andrew K's portfolio, rebuilt around eight original cinematic scenes,
living fog and light, pointer-driven depth, and animated scroll chapters.
All original portfolio records are preserved in `src/lib/content/`.

## Run locally

```sh
npm install
npm run dev -- --host 127.0.0.1
```

## Verify

```sh
npm run check
npm test
npm run build
```

The content tests compare semantic fingerprints captured from the original
portfolio before redesign. They protect the original names, descriptions,
links, dates, experience, education, skill levels, and certification records.
The existing input-validation tests remain in place.

## Design and architecture

- Svelte 5, SvelteKit 2, TypeScript, Vite.
- CSS for first-paint text entrances; GSAP/ScrollTrigger and Lenis for reveal and scroll motion.
- One lazily loaded Three.js shader renders the current page's artwork with
  mist, subtle water/cloth movement, reflected light, and pointer depth.
- Every page has a different scene. Project previews also use different images.
- Original desktop/mobile WebP artwork lives in `static/world/`; generation
  prompts and provenance are recorded in `static/world/ARTWORK.md`.
- Self-hosted Cormorant Garamond, Space Grotesk, and IBM Plex Mono fonts.
- Native dialogs handle keyboard focus and Escape; native details handle timelines.
- Reduced-motion preferences, a persistent-in-session pause control, static-art
  fallback, and cleanup of GPU resources and animation listeners are supported.

## Contact and deployment

The original `/api/send-email` endpoint remains in place. Live delivery requires
`MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and `RECIPIENT_EMAIL` in the server environment.
No real email was sent during verification.

### Security maintenance

Run `npm audit` alongside the verification commands above. SvelteKit 2's `cookie`
dependency is overridden to 0.7.2 to fix GHSA-pxg6-pf52-xh8x without a framework
major-version migration. Keep the override until upgrading to a SvelteKit release
that requires a patched cookie version itself. Security regression tests cover
cookie delimiter injection and contact request validation and resource limits.

The contact API accepts JSON bodies up to 16 KiB, enforces the form's field
limits, rejects foreign Origin headers, and times out Mailgun requests after
10 seconds. Its three-requests-per-15-minutes limiter expires entries and caps
tracking at 10,000 clients per server instance. It is not a distributed limit;
multi-instance deployments need a hosting-edge limit for fleet-wide enforcement.

The site is hosted on Netlify. The existing `adapter-auto` detects Netlify through
its `NETLIFY` environment variable and selects the Netlify adapter, preserving
prerendered HTML and server endpoints. Hosting settings have not been changed.
The original third-party advertising script in the HTML template is retained.

## SEO

All eight pages are server rendered and prerendered with unique titles,
descriptions, canonical URLs, and Open Graph/Twitter previews. The sitemap only
lists pages on `jerome.co.in`; robots.txt points crawlers to it. Error pages use
`noindex`. Person/ProfilePage structured data shares the original portfolio
records, and there is no advertised search endpoint that does not exist.

After building, run `npm run test:seo` to check the generated HTML, structured
data, preview image, canonical URLs, robots rules, and sitemap. Search rankings
and indexing remain controlled by search engines; submit the sitemap in Search
Console after deployment.

Previous React scaffolding and superseded UI are preserved in `archive/`.
`archive/README.previous.md` contains the previous documentation.
