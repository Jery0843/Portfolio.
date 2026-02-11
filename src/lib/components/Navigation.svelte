<script lang="ts">
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { afterNavigate } from '$app/navigation';
import { slide, fade } from 'svelte/transition';

    interface Props {
        navItems: Array<{
    href: string;
    label: string;
    icon?: string;
}>;
    }

    let { navItems }: Props = $props();

let isMenuOpen = $state(false);
let isMobile = $state(false);
let canvas = $state();
let ctx;
let particles = [];
let animationFrame;
let scrollProgress = $state(0);
let isScrolled = $state(false);
let hidden = $state(false);
let lastScrollY = 0;
let navInnerEl: HTMLElement = $state();
let mounted = false;

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    decay: number;
    size: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsl(${120 + Math.sin(this.life * 10) * 60}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x: number, y: number, count = 15) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10));
    }
}

function animateParticles() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(particle => {
        particle.update();
        if (particle.life > 0) {
            particle.draw(ctx);
            return true;
        }
        return false;
    });

    animationFrame = requestAnimationFrame(animateParticles);
}

function handleNavHover(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    createParticles(rect.left + rect.width / 2, rect.top + 10, 8);
}

function toggleMenu() {
    console.log('🔧 Toggle menu clicked!');
    console.log('  Current state:', isMenuOpen);
    console.log('  isMobile:', isMobile);
    console.log('  mounted:', mounted);
    console.log('  window.innerWidth:', typeof window !== 'undefined' ? window.innerWidth : 'N/A');
    
    isMenuOpen = !isMenuOpen;
    
    console.log('  ✅ New menu state:', isMenuOpen);
    
    // Prevent body scroll when menu is open
    if (typeof document !== 'undefined') {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            console.log('  📌 Body scroll locked');
        } else {
            document.body.style.overflow = '';
            console.log('  📌 Body scroll restored');
        }
    }
}

function onNavMouseMove(e: MouseEvent) {
    if (!navInnerEl) return;
    const rect = navInnerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    navInnerEl.style.setProperty('--mx', `${x}px`);
    navInnerEl.style.setProperty('--my', `${y}px`);
}

// Aurora arc dynamics
let hovered = false;
const ARC_HEIGHT = 18;
function curveOffset(i: number, count: number) {
    if (count <= 1) return 0;
    const t = i / (count - 1);
    return -Math.sin(t * Math.PI) * ARC_HEIGHT * (isScrolled ? 0.8 : 1.0) * (hovered ? 1.15 : 1.0);
}

// Handle navigation clicks - close menu and navigate
function handleNavClick(href: string) {
    if (isMenuOpen) {
        isMenuOpen = false;
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    }
}

// Close menu after route changes to avoid accidental immediate close on click
let removeAfterNav: (() => void) | undefined;

onMount(() => {
    removeAfterNav = afterNavigate(() => {
        if (isMenuOpen) {
            isMenuOpen = false;
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        }
    });
});

onMount(() => {
    mounted = true;
    
    const onScroll = () => {
        const doc = document.documentElement;
        const st = doc.scrollTop || document.body.scrollTop;
        const sh = doc.scrollHeight - doc.clientHeight;
        scrollProgress = sh > 0 ? Math.min(100, Math.max(0, (st / sh) * 100)) : 0;
        isScrolled = st > 8;
        // Hide on scroll down, show on scroll up
        if (st > lastScrollY && st > 20) {
            hidden = true;
        } else {
            hidden = false;
        }
        lastScrollY = st;
    };
    
    const checkMobile = () => {
        isMobile = window.innerWidth < 768;
        // Close menu if window is resized to desktop
        if (!isMobile && isMenuOpen) {
            isMenuOpen = false;
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        }
    };
    
    checkMobile();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkMobile);

    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');
        animateParticles();
    }

    return () => {
        mounted = false;
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('scroll', onScroll as any);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        if (removeAfterNav) removeAfterNav();
        // Cleanup: restore body scroll
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    };
});
</script>

<!-- Particle Canvas -->
<canvas bind:this={canvas} class="particle-canvas"></canvas>

<nav class="nav-shell fixed top-0 left-0 w-full z-[9998]" class:scrolled={isScrolled} class:hidden={hidden}>
    <div class="scroll-progress" style="--progress: {scrollProgress}%"></div>
    <div class="nav-fab" bind:this={navInnerEl} onmousemove={onNavMouseMove} role="region" aria-label="Primary navigation">
        <div class="aurora"></div>
        <div class="arc-nav">
            {#each navItems as item, i}
                <a 
                    href={item.href}
                    class="arc-link {$page.url.pathname === item.href ? 'active' : ''}"
                    onmouseenter={handleNavHover}
                    onclick={() => handleNavClick(item.href)}
                >
                    {item.label}
                </a>
            {/each}
            <div class="arc-pulse"></div>
        </div>

        <!-- Mobile Menu Button (always render, CSS handles visibility) -->
        <button 
            class="mobile-menu-btn"
            class:visible={isMobile}
            onclick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            type="button"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                {#if !isMenuOpen}
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                {/if}
            </svg>
        </button>
    </div>
</nav>

<!-- Mobile Menu Backdrop (always in DOM; toggled with class) -->
<div 
    class="mobile-menu-backdrop"
    class:open={isMenuOpen}
    onclick={() => isMenuOpen = false}
    onkeydown={(e) => { if (e.key === 'Escape') isMenuOpen = false; }}
    role="button"
    tabindex="-1"
    aria-label="Close menu"
></div>

<!-- Mobile Navigation (always in DOM; toggled with class) -->
<div 
    class="mobile-menu"
    class:open={isMenuOpen}
    role="navigation"
    aria-label="Mobile navigation menu"
    aria-hidden={!isMenuOpen}
>
    <div class="mobile-menu-content">
        {#each navItems as item}
            <a 
                href={item.href}
                class="mobile-menu-link {$page.url.pathname === item.href ? 'active' : ''}"
                onclick={() => handleNavClick(item.href)}
                role="menuitem"
            >
                {item.label}
            </a>
        {/each}
    </div>
</div>

<style>
.particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
}

.scroll-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    width: var(--progress);
    background: linear-gradient(90deg, rgba(0,255,0,0.2), var(--tw-shadow-color, #00ff00));
    box-shadow: 0 0 12px rgba(0,255,0,0.6);
    transition: width 80ms linear;
    z-index: 10000;
    pointer-events: none;
}

.nav-shell { 
    pointer-events: none; 
    transition: transform 220ms ease;
}
.nav-shell.hidden { 
    transform: translateY(-120%); 
}
.nav-fab { 
    pointer-events: auto;
    position: relative;
    z-index: 10000; /* Nav container */
}

.nav-fab {
    margin: 8px auto;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    max-width: min(980px, calc(100% - 16px));
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 28px rgba(16,185,129,0.12);
    position: relative;
    overflow: hidden;
}
@media (max-width: 1024px) {
    .nav-fab { max-width: calc(100% - 16px); padding: 0.4rem 0.6rem; }
}
@media (max-width: 768px) {
    .nav-fab { 
        max-width: calc(100% - 12px); 
        gap: 0.4rem; 
        padding: 0.35rem 0.5rem;
        grid-template-columns: auto;
        justify-content: flex-end;
    }
}
@media (max-width: 480px) {
    .nav-fab { max-width: calc(100% - 8px); gap: 0.3rem; padding: 0.3rem 0.4rem; margin: 6px auto; }
}

/* Aurora sheet */
.aurora { position: absolute; inset: -40% -10% -60% -10%; pointer-events: none; background:
    radial-gradient(60% 40% at 10% 10%, rgba(16,185,129,0.15), transparent),
    radial-gradient(40% 60% at 90% 30%, rgba(59,130,246,0.15), transparent),
    radial-gradient(50% 50% at 50% 80%, rgba(236,72,153,0.12), transparent);
    filter: blur(16px) saturate(1.2);
    animation: drift 12s ease-in-out infinite alternate;
}
@keyframes drift { 0%{ transform: translateY(0) translateX(0) } 100%{ transform: translateY(-6%) translateX(2%) } }

/* Arc navigation */
.arc-nav { 
    position: relative; 
    padding: 8px 10px; 
    display: flex; 
    gap: 18px; 
    justify-content: center; 
    align-items: center; 
    flex-wrap: wrap;
}
.arc-link { 
    position: relative; 
    color: #a7f3d0; 
    text-decoration: none; 
    font-family: monospace; 
    font-size: 0.8rem; 
    letter-spacing: 0.18em; 
    padding: 2px 6px; 
    border-radius: 8px; 
    transition: color 150ms ease, transform 150ms ease; 
    white-space: nowrap;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
.arc-link:hover { 
    color: #34d399; 
    text-shadow: 0 0 12px rgba(52,211,153,0.5); 
}
.arc-link.active { 
    color: #10b981; 
    text-shadow: 0 0 16px rgba(16,185,129,0.7); 
}

@media (max-width: 1024px) {
    .arc-nav { gap: 12px; padding: 6px 8px; }
    .arc-link { font-size: 0.75rem; letter-spacing: 0.12em; padding: 2px 4px; }
}
@media (max-width: 768px) {
    .arc-nav { display: none; }
}
@media (max-width: 480px) {
    .arc-link { font-size: 0.7rem; padding: 1px 3px; }
}

/* Mobile Menu Button */
.mobile-menu-btn {
    display: none;
    color: #34d399;
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 150ms ease;
    z-index: 10001;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    pointer-events: auto;
}

.mobile-menu-btn .menu-icon {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    display: block;
}

.mobile-menu-btn:hover {
    color: #6ee7b7;
}

.mobile-menu-btn:active {
    transform: scale(0.95);
}

/* Always show on mobile */
@media (max-width: 768px) {
    .mobile-menu-btn {
        display: block;
    }
}

/* Fallback: show if has visible class */
.mobile-menu-btn.visible {
    display: block;
}

/* Mobile Menu Backdrop */
.mobile-menu-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9998;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

/* Mobile Menu Backdrop */
.mobile-menu-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10001; /* Above nav, below menu */
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 180ms ease, visibility 0s linear 180ms;
}
.mobile-menu-backdrop.open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: opacity 180ms ease;
}

/* Mobile Menu Dropdown */
.mobile-menu {
    position: fixed;
    left: 0;
    right: 0;
    top: 0; /* Start from top to guarantee visibility */
    background: rgba(0, 0, 0, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 0;
    border-bottom: 1px solid rgba(16, 185, 129, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    max-height: 100vh;
    overflow-y: auto;
    z-index: 10002; /* On top of everything */
    transform: translateY(-12px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: transform 200ms ease, opacity 180ms ease, visibility 0s linear 180ms;
    padding-top: 60px; /* create space for nav bar height */
}
.mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: transform 200ms ease, opacity 180ms ease;
}

.mobile-menu-content {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0;
    gap: 0.25rem;
}

.mobile-menu-link {
    display: block;
    color: #34d399;
    text-decoration: none;
    font-family: monospace;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    padding: 0.875rem 1.5rem;
    transition: all 150ms ease;
    border-left: 3px solid transparent;
    cursor: pointer;
    pointer-events: auto;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

.mobile-menu-link:hover {
    color: #6ee7b7;
    background: rgba(16, 185, 129, 0.08);
    border-left-color: #34d399;
}

.mobile-menu-link:active {
    background: rgba(16, 185, 129, 0.15);
}

.mobile-menu-link.active {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border-left-color: #10b981;
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

@media (max-width: 480px) {
    .mobile-menu {
        top: 64px;
        max-height: calc(100vh - 70px);
    }
    
    .mobile-menu-content {
        padding: 0.5rem 0;
    }
    
    .mobile-menu-link {
        font-size: 0.8125rem;
        padding: 0.75rem 1.25rem;
    }
}

.arc-pulse { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: linear-gradient(90deg, transparent, #10b981, transparent); animation: pulse-run 3s linear infinite; opacity: 0.7; }
@keyframes pulse-run { 0%{ transform: translateX(-100%);} 100%{ transform: translateX(100%);} }

.nav-shell.scrolled .nav-fab {
    padding: 0.4rem 0.6rem;
    background: rgba(0,0,0,0.5);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 14px rgba(16,185,129,0.08);
}

/* Mouse spotlight */
.nav-fab::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    background: radial-gradient(140px 100px at var(--mx, -100px) var(--my, -100px), rgba(16,185,129,0.14), rgba(16,185,129,0) 60%);
    opacity: 1;
}

/* Subtle border glow */
.nav-inner::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 14px;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px rgba(16,185,129,0.2), 0 0 20px rgba(16,185,129,0.1);
}

.nav-link {
    position: relative;
    color: #34d399; /* green-400 */
    text-transform: uppercase;
    font-family: monospace;
    font-size: 0.75rem;
    letter-spacing: 0.16em;
    transition: color 150ms ease;
    padding: 0.2rem 0.3rem;
    border-radius: 8px;
    white-space: nowrap;
}

.nav-link:hover { color: #6ee7b7; }

.nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #10b981, transparent);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 200ms ease;
}

.nav-link:hover::after, .nav-link.active::after {
    transform: scaleX(1);
}

.nav-links { 
    display: flex; gap: 0.6rem; align-items: center; justify-content: center; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; 
}
.nav-links::-webkit-scrollbar { display: none; }

.glitch-text {
    position: relative;
    text-shadow: 0.02em 0 0 rgba(255, 0, 0, 0.3),
            -0.02em -0.01em 0 rgba(0, 255, 0, 0.3),
            -0.01em 0.02em 0 rgba(0, 0, 255, 0.3);
    animation: glitch 4s infinite;
}

.subtle-glitch {
    text-shadow: 0.01em 0 0 rgba(0, 255, 0, 0.2),
            -0.01em 0 0 rgba(0, 255, 0, 0.2);
    animation: subtle-glitch 6s infinite linear;
}

.glitch-text::before,
.glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
}

.glitch-text::before {
    animation: glitch 650ms infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
    transform: translate(-0.025em, -0.0125em);
    opacity: 0.8;
}

.glitch-text::after {
    animation: glitch 375ms infinite;
    clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
    transform: translate(0.0125em, 0.025em);
    opacity: 0.8;
}

@keyframes glitch {
    0% {
        text-shadow: 0.02em 0 0 rgba(255, 0, 0, 0.3),
                -0.02em -0.01em 0 rgba(0, 255, 0, 0.3),
                -0.01em 0.02em 0 rgba(0, 0, 255, 0.3);
    }
    2% {
        text-shadow: 0.02em 0 0 rgba(255, 0, 0, 0.3),
                -0.02em -0.01em 0 rgba(0, 255, 0, 0.3),
                -0.01em 0.02em 0 rgba(0, 0, 255, 0.3);
    }
    3% {
        text-shadow: -0.02em -0.01em 0 rgba(255, 0, 0, 0.3),
                0.01em 0.01em 0 rgba(0, 255, 0, 0.3),
                -0.02em -0.02em 0 rgba(0, 0, 255, 0.3);
    }
    6% {
        text-shadow: none;
    }
    100% {
        text-shadow: none;
    }
}

@keyframes subtle-glitch {
    0% { transform: translate(0); }
    1% { transform: translate(-1px, 1px); }
    2% { transform: translate(1px, -1px); }
    3% { transform: translate(0); }
    100% { transform: translate(0); }
}
</style>
