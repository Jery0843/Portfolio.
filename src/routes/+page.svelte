<script lang="ts">
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import AnimatedIcon from '$lib/components/AnimatedIcons.svelte';
import SEO from '$lib/components/SEO.svelte';
import StructuredData from '$lib/components/StructuredData.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

let canvas = $state();
let ctx;
let visible = $state(false);
let activeSection = 'about';

// Real information about Jerome
const personalInfo = {
    name: 'Jerome Andrew K',
    title: 'Cybersecurity Expert & Full-Stack Developer',
    location: 'Available Worldwide',
    status: 'Open to Work'
};

const skills = [
    { name: 'Ethical Hacking', level: 95 },
    { name: 'Penetration Testing', level: 90 },
    { name: 'Full-Stack Development', level: 85 },
    { name: 'Network Security', level: 88 },
    { name: 'Python/JavaScript', level: 92 }
];

// Real navigation links
const navigationLinks = [
    { name: 'Projects', url: '/projects', icon: 'rocket', description: 'View my portfolio projects' },
    { name: 'Certificates', url: '/certificates', icon: 'trophy', description: '20+ professional certifications' },
    { name: 'Blog', url: 'https://0xJerry.is-a.dev', icon: 'blog', description: 'Technical articles & insights' },
    { name: 'Contact', url: '/contact', icon: 'mail', description: 'Get in touch with me' }
];

onMount(() => {
    visible = true;
    initMatrix();
});

function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    const chars = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 35);
}
</script>

<!-- SEO Meta Tags -->
<SEO 
    title="Jerome Andrew K - Cybersecurity Expert & Ethical Hacker | Portfolio"
    description="Welcome to Jerome Andrew K's portfolio. Cybersecurity expert specializing in ethical hacking, penetration testing, network security, and full-stack development. Explore my projects and expertise."
    keywords="Jerome Andrew K, cybersecurity expert, ethical hacker, penetration testing, security researcher, full-stack developer, portfolio, infosec professional"
    canonical="https://jerome.co.in"
    datePublished="2024-01-01"
    dateModified="2026-02-11"
    speakable={true}
/>

<!-- Structured Data for SEO -->
<StructuredData type="person" />
<StructuredData type="website" />
<BreadcrumbSchema pageName="Home" pageUrl="https://jerome.co.in" />

<svelte:head>
    <link rel="preload" as="image" type="image/webp" href="/profile.webp" />
</svelte:head>

<!-- Matrix Background -->
<canvas bind:this={canvas} class="matrix-bg"></canvas>
<div class="scanline"></div>

{#if visible}
<div class="home-container" transition:fade={{ duration: 800 }}>
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -30, duration: 800 }}>
        <h1 class="hero-title">
            <span class="bracket">&lt;</span>
            <span class="name">{personalInfo.name}</span>
            <span class="bracket">/&gt;</span>
        </h1>
        <p class="hero-subtitle" in:fade={{ delay: 400 }}>{personalInfo.title}</p>
        <div class="hero-meta" in:fade={{ delay: 600 }}>
            <div class="status-item">
                <span class="status-dot"></span>
                <span>{personalInfo.status}</span>
            </div>
        </div>
    </section>

    <!-- Main Content Grid -->
    <main class="content-grid">
        <!-- Profile Section -->
        <section class="profile-section" in:fly={{ x: -50, duration: 800, delay: 200 }}>
            <div class="profile-card">
                <div class="profile-image-wrapper">
                    <div class="orbit-ring outer"></div>
                    <div class="orbit-ring inner"></div>
                    <div class="hex-scanner"></div>
                    <div class="profile-image-container">
                        <picture>
                            <source srcset="/profile.webp" type="image/webp" />
                            <img 
                                src="/profile.jpeg" 
                                alt="Jerome's Profile"
                                class="profile-image"
                                fetchpriority="high"
                                loading="eager"
                                width="400"
                                height="400"
                            />
                        </picture>
                    </div>
                    <div class="glow-burst"></div>
                </div>
                <div class="profile-info">
                    <h3>Quick Intro</h3>
                    <p>Cybersecurity researcher and penetration tester with a passion for ethical hacking and secure development. I specialize in finding vulnerabilities and building defensive solutions to protect digital infrastructure.</p>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section class="skills-section" in:fly={{ x: 50, duration: 800, delay: 400 }}>
            <div class="section-card">
                <h3 class="section-title">
                    <span class="icon"><AnimatedIcon icon="lightning" size="1.3rem" /></span>
                    Skills & Expertise
                </h3>
                <div class="skills-list">
                    {#each skills as skill, i}
                        <div class="skill-item" in:fly={{ y: 20, duration: 400, delay: 600 + (i * 100) }}>
                            <div class="skill-info">
                                <span class="skill-name">{skill.name}</span>
                                <span class="skill-percentage">{skill.level}%</span>
                            </div>
                            <div class="skill-bar">
                                <div 
                                    class="skill-fill" 
                                    style="width: {skill.level}%; animation-delay: {i * 0.2}s;"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Navigation Section -->
        <section class="navigation-section" in:fly={{ y: 50, duration: 800, delay: 600 }}>
            <div class="section-card">
                <h3 class="section-title">
                    Explore Portfolio
                </h3>
                <div class="nav-grid">
                    {#each navigationLinks as link, i}
                        <a 
                            href={link.url} 
                            class="nav-card"
                            in:fly={{ y: 30, duration: 400, delay: 800 + (i * 100) }}
                        >
                            {#if link.icon}
                            <div class="nav-icon"><AnimatedIcon icon={link.icon} size="2rem" /></div>
                            {/if}
                            <div class="nav-info">
                                <h4>{link.name}</h4>
                                <p>{link.description}</p>
                            </div>
                            <div class="nav-arrow">→</div>
                        </a>
                    {/each}
                </div>
            </div>
        </section>
    </main>

    <!-- CTA Section -->
    <section class="cta-section" in:fly={{ y: 50, duration: 800, delay: 1000 }}>
        <div class="cta-content">
            <h3>Ready to Work Together?</h3>
            <p>Let's discuss your cybersecurity needs or development projects</p>
            <div class="cta-buttons">
                <a href="/contact" class="cta-btn primary">
                    <span class="btn-icon"><AnimatedIcon icon="mail" size="1.1rem" /></span>
                    Get In Touch
                </a>
                <a href="/projects" class="cta-btn secondary">
                    <span class="btn-icon"><AnimatedIcon icon="search" size="1.1rem" /></span>
                    View My Work
                </a>
            </div>
        </div>
    </section>
</div>
{/if}

<style>
:global(body) {
    background: #000;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
    color: #fff;
}

/* Matrix Background */
.matrix-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.1;
}

/* Scanline Effect */
.scanline {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
        rgba(0, 255, 0, 0) 0%,
        rgba(0, 255, 0, 0.03) 50%,
        rgba(0, 255, 0, 0) 100%);
    animation: scanline 15s linear infinite;
    pointer-events: none;
    z-index: 1;
}

@keyframes scanline {
    0% { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
}

/* Home Container */
.home-container {
    min-height: 100vh;
    padding: 2rem 1rem;
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

@media (max-width: 1024px) {
    .home-container { padding: 1.5rem 1rem; max-width: 100%; }
}
@media (max-width: 768px) {
    .home-container { padding: 1.25rem 0.875rem; }
}
@media (max-width: 640px) {
    .home-container { padding: 1rem 0.75rem; }
}
@media (max-width: 480px) {
    .home-container { padding: 0.875rem 0.5rem; }
}

/* Hero Section */
.hero-section {
    text-align: center;
    padding: 4rem 0 3rem;
    margin-bottom: 3rem;
}

@media (max-width: 768px) {
    .hero-section { padding: 2.5rem 0 2rem; margin-bottom: 2rem; }
}
@media (max-width: 480px) {
    .hero-section { padding: 2rem 0 1.5rem; margin-bottom: 1.5rem; }
}

.hero-title {
    font-size: clamp(2rem, 6.5vw, 5.125rem);
    font-weight: 700;
    margin-bottom: 1rem;
    font-family: 'Courier New', monospace;
    word-break: break-word;
}

.bracket {
    color: #00bfff;
    text-shadow: 0 0 20px #00bfff;
}

.name {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    letter-spacing: 0.04em;
    background: linear-gradient(90deg, #00ff88, #00bfff 40%, #ff00cc 80%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 24px rgba(0,255,136,0.25), 0 0 18px rgba(0,191,255,0.15);
}

.hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.8rem);
    margin-bottom: 2rem;
    font-weight: 400;
    font-family: 'Orbitron', 'Source Code Pro', monospace;
    letter-spacing: 0.06em;
    background: linear-gradient(90deg, #a7f3d0, #60a5fa);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 14px rgba(96,165,250,0.25);
    word-break: break-word;
    padding: 0 0.5rem;
}

@media (max-width: 768px) {
    .hero-subtitle { margin-bottom: 1.5rem; }
}
@media (max-width: 480px) {
    .hero-subtitle { margin-bottom: 1rem; letter-spacing: 0.03em; }
}

.hero-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    border-radius: 20px;
    font-size: 0.9rem;
    color: #00ff00;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ff00;
    animation: pulse 2s infinite;
}

.location {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

/* Content Grid */
.content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 2rem;
    margin-bottom: 4rem;
}
@media (max-width: 1024px) {
    .content-grid { grid-template-columns: 1fr; gap: 1.75rem; margin-bottom: 3rem; }
}
@media (max-width: 768px) {
    .content-grid { gap: 1.5rem; margin-bottom: 2.5rem; }
}
@media (max-width: 480px) {
    .content-grid { gap: 1.25rem; margin-bottom: 2rem; }
}

.navigation-section {
    grid-column: 1 / -1;
}

/* Card Styles */
.profile-card,
.section-card {
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .profile-card,
    .section-card { padding: 1.5rem; border-radius: 16px; }
}
@media (max-width: 480px) {
    .profile-card,
    .section-card { padding: 1.25rem; border-radius: 12px; }
}

.profile-card:hover,
.section-card:hover {
    border-color: rgba(0, 255, 0, 0.4);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 255, 0, 0.1);
}

/* Profile Section */
/* Profile Image Wrapper */
.profile-image-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Orbital Rings */
.orbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
    opacity: 0;
}

.orbit-ring.outer {
    width: 150px;
    height: 150px;
    border-top-color: #00ff00;
    border-right-color: #00bfff;
    animation: orbitSpinIn 0.8s ease-out 0.3s forwards, orbitSpin 3s linear 1.1s infinite;
    filter: drop-shadow(0 0 6px #00ff00);
}

.orbit-ring.inner {
    width: 135px;
    height: 135px;
    border-bottom-color: #ff00cc;
    border-left-color: #00ff00;
    animation: orbitSpinIn 0.8s ease-out 0.5s forwards, orbitSpinReverse 4s linear 1.3s infinite;
    filter: drop-shadow(0 0 4px #ff00cc);
}

@keyframes orbitSpinIn {
    0% {
        opacity: 0;
        transform: scale(2) rotate(0deg);
    }
    100% {
        opacity: 0.8;
        transform: scale(1) rotate(360deg);
    }
}

@keyframes orbitSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes orbitSpinReverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
}

/* Hex Scanner Line */
.hex-scanner {
    position: absolute;
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    opacity: 0;
    animation: scanLine 0.6s ease-in-out 0.9s forwards;
    filter: drop-shadow(0 0 8px #00ff00);
    z-index: 5;
}

@keyframes scanLine {
    0% {
        opacity: 0;
        transform: translateY(-60px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(60px);
    }
}

/* Glow Burst */
.glow-burst {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    opacity: 0;
    animation: burstGlow 1s ease-out 1s forwards;
    z-index: 0;
}

@keyframes burstGlow {
    0% {
        opacity: 0;
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
    }
    30% {
        opacity: 1;
        box-shadow: 0 0 40px 10px rgba(0, 255, 0, 0.6), 0 0 80px 20px rgba(0, 191, 255, 0.3), 0 0 120px 30px rgba(255, 0, 204, 0.15);
    }
    100% {
        opacity: 1;
        box-shadow: 0 0 15px 3px rgba(0, 255, 0, 0.2), 0 0 30px 5px rgba(0, 191, 255, 0.1);
    }
}

/* Profile Container */
.profile-image-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #00ff00;
    background: linear-gradient(45deg, #00ff00, #00bfff);
    padding: 3px;
    position: relative;
    z-index: 2;
    opacity: 0;
    animation: containerMaterialize 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards, containerPulse 3s ease-in-out 1.5s infinite;
}

@keyframes containerMaterialize {
    0% {
        opacity: 0;
        transform: scale(0) rotate(-180deg);
        border-color: transparent;
    }
    60% {
        opacity: 1;
        transform: scale(1.15) rotate(10deg);
        border-color: #00ff00;
    }
    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
        border-color: #00ff00;
    }
}

@keyframes containerPulse {
    0%, 100% {
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    }
    50% {
        box-shadow: 0 0 25px rgba(0, 255, 0, 0.4), 0 0 50px rgba(0, 191, 255, 0.15);
    }
}

@media (max-width: 640px) {
    .profile-image-wrapper { width: 110px; height: 110px; }
    .profile-image-container { width: 96px; height: 96px; }
    .orbit-ring.outer { width: 116px; height: 116px; }
    .orbit-ring.inner { width: 106px; height: 106px; }
    .glow-burst { width: 96px; height: 96px; }
    .hex-scanner { width: 96px; }
}

/* Profile Image - Glitch Reveal */
.profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    opacity: 0;
    animation: glitchReveal 0.8s steps(1) 1s forwards;
}

@keyframes glitchReveal {
    0% { opacity: 0; filter: hue-rotate(90deg) saturate(3) brightness(2); }
    10% { opacity: 1; filter: hue-rotate(90deg) saturate(3) brightness(2); transform: translate(3px, -2px); }
    20% { opacity: 0; }
    30% { opacity: 1; filter: hue-rotate(-90deg) saturate(2) brightness(1.5); transform: translate(-3px, 2px); }
    40% { opacity: 0; }
    50% { opacity: 1; filter: hue-rotate(45deg) saturate(2); transform: translate(2px, 1px); }
    60% { opacity: 0.7; filter: hue-rotate(0deg) brightness(1.3); transform: translate(-1px, -1px); }
    70% { opacity: 1; filter: grayscale(0.5); transform: translate(0); }
    80% { opacity: 0.9; filter: none; }
    90% { opacity: 1; filter: brightness(1.1); }
    100% { opacity: 1; filter: none; transform: translate(0); }
}

.profile-info h3 {
    color: #00ff00;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.profile-info p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    text-align: center;
}

/* Section Titles */
.section-title {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #00ff00;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
}

.icon {
    font-size: 1.3rem;
}

/* Skills Section */
.skills-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.skill-item {
    opacity: 0;
    animation: slideUp 0.6s ease forwards;
}

.skill-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.skill-name {
    color: #fff;
    font-weight: 500;
}

.skill-percentage {
    color: #00ff00;
    font-weight: 600;
    font-family: 'Courier New', monospace;
}

.skill-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.skill-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff00, #00bfff);
    border-radius: 4px;
    transform: translateX(-100%);
    animation: fillBar 1s ease forwards;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

@keyframes slideUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fillBar {
    to {
        transform: translateX(0);
    }
}

/* Navigation Section */
.nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .nav-grid { grid-template-columns: 1fr; gap: 1.25rem; }
}
@media (max-width: 480px) {
    .nav-grid { gap: 1rem; }
}

.nav-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(0, 255, 0, 0.1);
    border-radius: 15px;
    text-decoration: none;
    color: #fff;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

@media (max-width: 768px) {
    .nav-card { padding: 1.25rem; gap: 0.875rem; border-radius: 12px; }
}
@media (max-width: 480px) {
    .nav-card { padding: 1rem; gap: 0.75rem; }
}

.nav-card:hover {
    border-color: rgba(0, 255, 0, 0.3);
    background: rgba(0, 255, 0, 0.05);
    transform: translateY(-3px);
}

.nav-icon {
    font-size: 2rem;
    min-width: 50px;
    text-align: center;
}

.nav-info {
    flex: 1;
}

.nav-info h4 {
    color: #00ff00;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
}

.nav-info p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
}

.nav-arrow {
    color: #00ff00;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.nav-card:hover .nav-arrow {
    transform: translateX(5px);
}

/* CTA Section */
.cta-section {
    text-align: center;
    padding: 3rem 2rem;
    background: rgba(0, 255, 0, 0.02);
    border: 1px solid rgba(0, 255, 0, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(20px);
}

@media (max-width: 768px) {
    .cta-section { padding: 2.5rem 1.5rem; border-radius: 16px; }
}
@media (max-width: 480px) {
    .cta-section { padding: 2rem 1.25rem; border-radius: 12px; }
}

.cta-content h3 {
    color: #00ff00;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    margin-bottom: 1rem;
}

@media (max-width: 480px) {
    .cta-content h3 { margin-bottom: 0.75rem; }
}

.cta-content p {
    color: rgba(255, 255, 255, 0.8);
    font-size: clamp(0.95rem, 2.5vw, 1.1rem);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 0.5rem;
}

@media (max-width: 768px) {
    .cta-content p { margin-bottom: 1.5rem; }
}
@media (max-width: 480px) {
    .cta-content p { margin-bottom: 1.25rem; }
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.cta-btn {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid;
    font-size: 1rem;
}

.cta-btn.primary {
    background: linear-gradient(135deg, #00ff00, #00bfff);
    color: #000;
    border-color: #00ff00;
}

.cta-btn.secondary {
    background: transparent;
    color: #00ff00;
    border-color: #00ff00;
}

.cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.cta-btn.primary:hover {
    box-shadow: 0 10px 25px rgba(0, 255, 0, 0.3);
}

.cta-btn.secondary:hover {
    background: rgba(0, 255, 0, 0.1);
}

.btn-icon {
    font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-meta {
        flex-direction: column;
        gap: 1rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .cta-btn {
        width: 100%;
        max-width: 320px;
        justify-content: center;
    }
}

@media (max-width: 640px) {
    .cta-btn {
        max-width: 280px;
        padding: 0.875rem 1.75rem;
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .hero-meta { gap: 0.75rem; }
    
    .cta-buttons { gap: 0.875rem; }
    
    .cta-btn {
        max-width: 100%;
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
    }
    
    .section-title {
        font-size: 1.25rem;
        gap: 0.6rem;
    }
    
    .icon { font-size: 1.1rem; }
}
</style>
