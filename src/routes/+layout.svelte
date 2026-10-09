<script lang="ts">
    import '../app.css';
    import 'lenis/dist/lenis.css';
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';
    import { onMount } from 'svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import CinematicWorld from '$lib/components/CinematicWorld.svelte';
    import { serializeSchema } from '$lib/utils/schema';
    let { children } = $props();
    let root: HTMLDivElement;
    let motionRunning = $state(true);
    const scenePages = ['about', 'projects', 'experience', 'education', 'skills', 'certificates', 'contact'];
    let scene = $derived(scenePages.includes(page.url.pathname.slice(1)) ? page.url.pathname.slice(1) : 'cybercity');
    const links = [
        { href: '/', label: 'Home' }, { href: '/about', label: 'About' },
        { href: '/projects', label: 'Projects' }, { href: '/experience', label: 'Experience' },
        { href: '/education', label: 'Education' }, { href: '/skills', label: 'Skills' },
        { href: '/certificates', label: 'Certificates' }, { href: '/contact', label: 'Contact' }
    ];
    const siteNavSchema = { '@context': 'https://schema.org', '@type': 'SiteNavigationElement', name: 'Main Navigation', url: 'https://jerome.co.in', hasPart: [...links.map(link => ({ '@type': 'WebPage', name: link.label, url: `https://jerome.co.in${link.href === '/' ? '' : link.href}` })), { '@type': 'WebPage', name: "0xJerry's Lab", url: 'https://0xjerry.jerome.co.in' }] };
    let scroll: import('lenis').default | undefined;
    let refreshReveals = () => {};
    afterNavigate(() => {
        // Adopt SvelteKit's new scroll position and cancel momentum from the previous page.
        scroll?.stop();
        scroll?.resize();
        scroll?.start();
        refreshReveals();
    });
    onMount(() => {
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        motionRunning = !preference.matches;
        const updateMotion = () => { motionRunning = !preference.matches; };
        preference.addEventListener('change', updateMotion);
        let disposed = false;
        let cleanup = () => {};
        Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
            if (disposed) return;
            gsap.registerPlugin(ScrollTrigger);
            const media = gsap.matchMedia();
            media.add('(prefers-reduced-motion: no-preference)', () => {
                scroll = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
                scroll.on('scroll', ScrollTrigger.update);
                let context: gsap.Context | undefined;
                refreshReveals = () => {
                    context?.revert();
                    context = gsap.context(() => {
                        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
                            // Never hide content the visitor could already see before GSAP loaded.
                            if (el.getBoundingClientRect().top < window.innerHeight) return;
                            gsap.from(el, { y: 55, opacity: 0, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
                        });
                    const hero = root.querySelector('.hero');
                        if (hero) {
                            gsap.to('.hero-copy', { y: -100, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: 1 } });
                        }
                        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach(el => {
                            gsap.fromTo(el, { y: 45 }, { y: -45, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
                        });
                    }, root);
                    ScrollTrigger.refresh();
                };
                refreshReveals();
                return () => { context?.revert(); refreshReveals = () => {}; scroll?.destroy(); scroll = undefined; };
            });
            cleanup = () => media.revert();
        }).catch(() => { /* Native scrolling and visible content remain available. */ });
        return () => { disposed = true; cleanup(); preference.removeEventListener('change', updateMotion); };
    });
</script>
<svelte:head>
    <meta name="yandex-verification" content="f845cb8aae27c0aa" />
    {@html `<script type="application/ld+json">${serializeSchema(siteNavSchema)}<\/script>`}
</svelte:head>
<div class="site-shell" data-scene={scene} bind:this={root}>
    {#key scene}<CinematicWorld {scene} bind:running={motionRunning} subdued={page.url.pathname !== '/'} />{/key}
    <a class="skip-link" href="#main-content">Skip to content</a>
    <Navigation {links} />
    <main id="main-content" tabindex="-1" class:inner-page={page.url.pathname !== '/'}>{@render children()}</main>
    <footer class="site-footer">
        <a href="/" class="wordmark">0x<span>Jerry</span><span class="brand-dot">_</span></a>
        <p>© {new Date().getFullYear()} Jerome Andrew K.</p>
        <div class="footer-links">
            <a href="https://github.com/Jery0843" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/jeromeandrewk/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href="https://x.com/0xJerry__" target="_blank" rel="noreferrer">X ↗</a>
        </div>
        <a href="#main-content" class="back-top" aria-label="Back to top">↑</a>
    </footer>
</div>
