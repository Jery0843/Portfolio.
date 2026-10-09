<script lang="ts">
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';
    import { onMount, tick } from 'svelte';
    let { links }: { links: { href: string; label: string }[] } = $props();
    let menu: HTMLDialogElement;
    let toggle: HTMLButtonElement;
    let open = $state(false);
    function close() { menu?.close(); open = false; toggle?.focus(); }
    async function show() { open = true; await tick(); menu.showModal(); }
    afterNavigate(() => { menu?.close(); open = false; });
    onMount(() => () => { menu?.close(); });
</script>
<header class="site-header">
    <a href="/" class="wordmark" aria-label="0xJerry home">0x<span>Jerry</span><span class="brand-dot">_</span></a>
    <span class="header-coordinate">SECURITY RESEARCHER · DEVELOPER</span>
    <nav aria-label="Main navigation" class="desktop-nav">
        <a href="/about" aria-current={page.url.pathname === '/about' ? 'page' : undefined}>Intro</a>
        <a href="/projects" aria-current={page.url.pathname === '/projects' ? 'page' : undefined}>Selected work</a>
        <a href="/contact" aria-current={page.url.pathname === '/contact' ? 'page' : undefined}>Contact ↗</a>
    </nav>
    <button class="menu-toggle" bind:this={toggle} onclick={show} aria-expanded={open} aria-controls="site-menu" aria-label="Open navigation menu"><span>MENU</span><span class="menu-icon">☰</span></button>
</header>
<dialog data-lenis-prevent id="site-menu" bind:this={menu} class="navigation-dialog" onclose={() => open = false} oncancel={close}>
    <div class="menu-top"><span class="eyebrow">DIRECTORY / 0xJERRY</span><button class="text-button" onclick={close} aria-label="Close navigation menu">CLOSE ×</button></div>
    <nav aria-label="All pages" class="menu-links">
        {#each links as link, i}
            <a href={link.href} onclick={() => { menu.close(); open = false; }} aria-current={page.url.pathname === link.href ? 'page' : undefined}><span class="menu-number">0{i + 1}</span>{link.label}<span class="menu-arrow">↗</span></a>
        {/each}
    </nav>
    <a class="lab-link" href="https://0xjerry.jerome.co.in" target="_blank" rel="noreferrer">0xJerry's Lab ↗</a>
</dialog>
