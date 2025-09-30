<script lang="ts">
import '../app.css';
import { fly } from 'svelte/transition';
import { page } from '$app/stores';
import { onMount } from 'svelte';
import Navigation from '$lib/components/Navigation.svelte';
import AnimatedIcon from '$lib/components/AnimatedIcons.svelte';

const navItems = [
    { href: '/', label: 'HOME', icon: 'terminal' },
    { href: '/about', label: 'ABOUT', icon: 'user' },
    { href: '/experience', label: 'EXPERIENCE', icon: 'briefcase' },
    { href: '/education', label: 'EDUCATION', icon: 'academic-cap' },
    { href: '/skills', label: 'SKILLS', icon: 'code' },
    { href: '/projects', label: 'PROJECTS', icon: 'folder' },
    { href: '/certificates', label: 'CERTS', icon: 'badge-check' },
    { href: 'https://0xjerry.is-a.dev', label: "0xJerry's Lab", icon: 'code' },
    { href: '/contact', label: 'CONTACT', icon: 'mail' }
];

let footerEl: HTMLElement;
let footerTime = new Date();
let launching = false;
let footerProgress = 0;

function scrollTop() {
    launching = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => (launching = false), 900);
}

function onFooterMouseMove(e: MouseEvent) {
    if (!footerEl) return;
    const rect = footerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    footerEl.style.setProperty('--fx', `${x}px`);
    footerEl.style.setProperty('--fy', `${y}px`);
}

onMount(() => {
    const t = setInterval(() => (footerTime = new Date()), 60000);
    const onScroll = () => {
        const doc = document.documentElement;
        const st = doc.scrollTop || document.body.scrollTop;
        const sh = doc.scrollHeight - doc.clientHeight;
        footerProgress = sh > 0 ? Math.min(100, Math.max(0, (st / sh) * 100)) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll as any); };
});
</script>

<div class="min-h-screen flex flex-col bg-black text-green-400 relative">
    <Navigation {navItems} />
    <div class="matrix-bg fixed inset-0 opacity-20 pointer-events-none z-0"></div>
    <header class="pt-28 md:pt-24 pb-6 md:pb-8 px-4 sm:px-6 relative z-10">
        <div class="container mx-auto max-w-7xl w-full">
            <slot name="header"></slot>
        </div>
    </header>
    <main class="flex-grow relative z-10 px-4 sm:px-6 pb-12">
        <div class="container mx-auto max-w-7xl w-full">
            <slot />
        </div>
    </main>
    <footer class="site-footer relative z-10 border-t border-green-500/30" bind:this={footerEl} on:mousemove={onFooterMouseMove}>
        <div class="spotlight"></div>
        <div class="footer-content">
            <div class="left">
                <div class="socials">
                    <a href="https://github.com/Jery0843" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub" title="GitHub">
                        <AnimatedIcon icon="github" size="18px" />
                    </a>
                    <a href="https://www.linkedin.com/in/jeromeandrewk/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn" title="LinkedIn">
                        <AnimatedIcon icon="linkedin" size="18px" />
                    </a>
                    <a href="https://x.com/0xJerry__" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="X" title="X">
                        <AnimatedIcon icon="x" size="18px" />
                    </a>
                </div>
            </div>
            <button class="to-top {launching ? 'launch' : ''}" style="--p: {footerProgress * 3.6}deg" on:click={scrollTop} aria-label="Scroll to top">↑</button>
            <div class="right text-right">
                <div class="copyright text-green-400/80 text-xs font-mono">© {footerTime.getFullYear()} Jerome Andrew K.</div>
            </div>
        </div>
    </footer>
</div>

<style>
    .text-shadow-glow {
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

.site-footer {
        position: fixed;
        left: 50%;
        bottom: calc(14px + env(safe-area-inset-bottom));
        transform: translateX(-50%);
        overflow: hidden;
        border-radius: 9999px;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(16,185,129,0.25);
        box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 18px rgba(16,185,129,0.12);
        padding: 8px 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: auto;
        z-index: 100;
    }
    
    @media (max-width: 1024px) {
        .site-footer { padding: 7px 10px; bottom: calc(12px + env(safe-area-inset-bottom)); }
    }
    @media (max-width: 768px) {
        .site-footer { padding: 6px 9px; bottom: calc(10px + env(safe-area-inset-bottom)); }
    }
    @media (max-width: 480px) {
        .site-footer { padding: 5px 8px; bottom: calc(8px + env(safe-area-inset-bottom)); max-width: calc(100vw - 16px); }
    }
    .spotlight { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(200px 140px at var(--fx, -200px) var(--fy, -200px), rgba(16,185,129,0.15), transparent 60%); }
    .footer-top { display: none; }

    .footer-content { display: inline-flex; align-items: center; gap: 0.75rem; }
    .footer-content .left { display: inline-flex; align-items: center; min-width: 8px; }
    .socials { display: flex; gap: 0.5rem; }
    .social-link { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 28px; border: 1px solid rgba(0,255,0,0.25); border-radius: 6px; color: #34d399; text-decoration: none; font-weight: 700; font-size: 0.8rem; transition: all 150ms ease; }
    .social-link:hover { color: #10b981; border-color: #10b981; box-shadow: 0 0 12px rgba(16,185,129,0.5); transform: translateY(-1px); }
    
    @media (max-width: 768px) {
        .footer-content { gap: 0.625rem; }
        .socials { gap: 0.4rem; }
        .social-link { width: 30px; height: 26px; }
        .social-link svg { width: 16px; height: 16px; }
    }
    @media (max-width: 480px) {
        .footer-content { gap: 0.5rem; }
        .socials { gap: 0.35rem; }
        .social-link { width: 28px; height: 24px; }
        .social-link svg { width: 14px; height: 14px; }
    }

.to-top { position: relative; width: 36px; height: 36px; border-radius: 999px; border: 1px solid rgba(0,255,0,0.25); color: #34d399; background: rgba(0,0,0,0.4); box-shadow: 0 2px 10px rgba(0,0,0,0.4); transition: all 150ms ease; font-size: 1.2rem; }
.to-top::before { content: ""; position: absolute; inset: -4px; border-radius: 999px; background: conic-gradient(#10b981 var(--p, 0deg), rgba(255,255,255,0.05) 0); filter: saturate(1.2); z-index: -1; }
    .to-top:hover { color: #10b981; border-color: #10b981; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.5); }
    .to-top.launch { animation: launch 900ms ease both; }
    @keyframes launch { 0%{ transform: translateY(0) scale(1); } 40%{ transform: translateY(-10px) scale(1.05) rotate(-8deg); } 100%{ transform: translateY(-60vh) scale(0.9) rotate(0deg); opacity: 0; } }
    
    @media (max-width: 768px) {
        .to-top { width: 34px; height: 34px; font-size: 1.15rem; }
        .to-top::before { inset: -3px; }
    }
    @media (max-width: 480px) {
        .to-top { width: 32px; height: 32px; font-size: 1.1rem; }
        .to-top::before { inset: -2.5px; }
    }

    @media (max-width: 640px) {
        .footer-content { gap: 0.5rem; }
        .footer-content .right { display: none; }
    }
    
    @media (max-width: 360px) {
        .site-footer { padding: 4px 6px; }
        .footer-content { gap: 0.4rem; }
        .socials { gap: 0.3rem; }
        .social-link { width: 26px; height: 22px; }
        .social-link svg { width: 13px; height: 13px; }
        .to-top { width: 30px; height: 30px; font-size: 1rem; }
    }
</style>
