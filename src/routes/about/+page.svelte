<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import ProfilePageSchema from '$lib/components/ProfilePageSchema.svelte';

let canvas = $state();
let ctx;
let showContent = $state(false);
let typedText = $state('');
let currentSkillIndex = 0;
let hoveredSkill = $state(null);
let mouseX = $state(0);
let mouseY = $state(0);
let particles = [];
let animationFrame;
let profileHovered = $state(false);

const personalInfo = {
    name: "Jerome Andrew K",
    title: "Cybersecurity Enthusiast & Developer",
    location: "India",
    email: "jeromeandrewk@outlook.com",
    status: "Available for opportunities"
};


const skills = [
    { name: "Penetration Testing", level: 90, category: "Security", color: "#ff0040" },
    { name: "Ethical Hacking", level: 88, category: "Security", color: "#ff4000" },
    { name: "Data Analytics", level: 85, category: "Data", color: "#00ff80" },
    { name: "Machine Learning", level: 82, category: "AI", color: "#0080ff" },
    { name: "Cloud Security", level: 80, category: "Cloud", color: "#8000ff" },
    { name: "Python", level: 90, category: "Programming", color: "#ffff00" },
    { name: "JavaScript", level: 85, category: "Programming", color: "#ff8000" },
    { name: "Cybersecurity", level: 92, category: "Security", color: "#00ffff" }
];

const achievements = [
    {
        title: "TryHackMe Legend",
        description: "100+ rooms completed - rank 0xD [Legend]",
        date: "Ongoing",
        icon: "🏆",
        glow: "#ffd700",
        url: "https://tryhackme.com/p/0xJerry"
    },
    {
        title: "HackTheBox Pro Hacker",
        description: "20+ machines completed",
        date: "Ongoing",
        icon: "🔓",
        glow: "#ff4444",
        url: "https://app.hackthebox.com/profile/1443882"
    },
    {
        title: "ML Research Paper",
        description: "Patient No-Show Prediction using Advanced Analytics",
        date: "2024",
        icon: "📊",
        glow: "#44ff44"
    },
    {
        title: "SecureHive Project",
        description: "Enterprise-grade encryption application",
        date: "2024",
        icon: "🛡️",
        glow: "#4444ff"
    }
];

const typewriterText = "Transforming cybersecurity challenges into innovative solutions...";

class Particle {
    constructor(x, y) {
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

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsl(${120 + Math.sin(this.life * 10) * 60}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10));
    }
}

function animateParticles() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
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

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trailing particles
    if (Math.random() < 0.1) {
        createParticles(mouseX, mouseY, 2);
    }
}

function startTypewriter() {
    let i = 0;
    const interval = setInterval(() => {
        typedText = typewriterText.slice(0, i);
        i++;
        if (i > typewriterText.length) {
            clearInterval(interval);
            setTimeout(() => {
                showContent = true;
                // Re-enable scrolling when content is shown
                document.body.style.overflow = 'auto';
            }, 1500);
        }
    }, 50);
}

onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    // Prevent body scroll during typewriter animation
    document.body.style.overflow = 'hidden';
    
    startTypewriter();
    animateParticles();
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        // Ensure scrolling is re-enabled
        document.body.style.overflow = 'auto';
    };
});
</script>

<!-- SEO Meta Tags -->
<SEO 
    title="About Jerome Andrew K - Cybersecurity Expert Profile"
    description="Learn about Jerome Andrew K's background, expertise in cybersecurity, ethical hacking, penetration testing, and achievements. TryHackMe Legend, HackTheBox Pro Hacker, ML Research."
    keywords="about Jerome Andrew K, cybersecurity profile, ethical hacker bio, penetration tester profile, security researcher, TryHackMe Legend"
    canonical="https://jerome.co.in/about"
    datePublished="2024-01-01"
    dateModified="2026-02-11"
    speakable={true}
/>
<BreadcrumbSchema pageName="About" pageUrl="/about" />
<ProfilePageSchema />

<!-- Particle Canvas -->
<canvas bind:this={canvas} class="particle-canvas"></canvas>

<!-- Animated Grid Background -->
<div class="grid-background"></div>

<!-- Typewriter Introduction -->
{#if !showContent}
<div class="typewriter-intro" out:fade={{ duration: 500 }}>
    <div class="terminal-window">
        <div class="terminal-header">
            <div class="controls">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
            </div>
            <span class="title">initializing_profile.sh</span>
        </div>
        <div class="terminal-body">
            <span class="prompt">root@0xjerry:~$</span>
            <span class="typed-text">{typedText}</span>
            <span class="cursor">|</span>
        </div>
    </div>
</div>
{/if}

<!-- Main Content -->
{#if showContent}
<main in:fade={{ duration: 1000 }} class="main-content">
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: 50, duration: 800, easing: cubicOut }}>
        <div class="profile-container">
            <div 
                class="profile-avatar"
                class:hovered={profileHovered}
                onmouseenter={() => {
                    profileHovered = true;
                    createParticles(window.innerWidth / 2, 200, 25);
                }}
                onmouseleave={() => profileHovered = false}
                role="button"
                tabindex="0"
            >
                <div class="avatar-ring"></div>
                <div class="avatar-content">
                    <div class="avatar-icon-animated">
                        <div class="shield-layer layer-1"></div>
                        <div class="shield-layer layer-2"></div>
                        <div class="shield-layer layer-3"></div>
                        <div class="shield-core">🛡️</div>
                    </div>
                </div>
                <div class="status-indicator"></div>
            </div>
            
            <div class="profile-info">
                <h1 class="name-title">{personalInfo.name}</h1>
                <div class="title-role">{personalInfo.title}</div>
            </div>
        </div>
    </section>


    <!-- Personal About Section -->
    <section class="about-section" in:fly={{ y: 50, duration: 800, delay: 200, easing: cubicOut }}>
        <div class="about-container">
            <h2 class="about-title">
                <span class="title-glow">Who Am I?</span>
                <div class="title-underline"></div>
            </h2>
            
            <div class="about-cards">
                <div 
                    class="about-card lab-card"
                    in:scale={{ duration: 600, delay: 400, easing: elasticOut }}
                    onmouseenter={(e) => {
                        createParticles(e.target.getBoundingClientRect().left + 150, e.target.getBoundingClientRect().top + 100, 12);
                    }}
                    role="button"
                    tabindex="0"
                >
<div class="card-icon">
    <div class="animated-icon lab-icon">
        <div class="icon-glow"></div>
        <div class="beaker-container">
            <div class="beaker-body"></div>
            <div class="liquid"></div>
            <div class="bubble bubble-1"></div>
            <div class="bubble bubble-2"></div>
            <div class="bubble bubble-3"></div>
        </div>
    </div>
</div>
                    <div class="card-content">
                        <h3 class="card-title">Lab Explorer</h3>
                        <p class="card-text">Half my time goes into hacking labs, diving deep into vulnerabilities and mastering new attack vectors.</p>
                        <div class="card-glow"></div>
                    </div>
                </div>
                
                <div 
                    class="about-card linux-card"
                    in:scale={{ duration: 600, delay: 600, easing: elasticOut }}
                    onmouseenter={(e) => {
                        createParticles(e.target.getBoundingClientRect().left + 150, e.target.getBoundingClientRect().top + 100, 12);
                    }}
                    role="button"
                    tabindex="0"
                >
<div class="card-icon">
    <div class="animated-icon linux-icon">
        <div class="icon-glow"></div>
        <div class="penguin">
            <div class="penguin-body"></div>
            <div class="penguin-belly"></div>
            <div class="penguin-eye left"></div>
            <div class="penguin-eye right"></div>
            <div class="penguin-beak"></div>
            <div class="penguin-wing left"></div>
            <div class="penguin-wing right"></div>
            <div class="penguin-foot left"></div>
            <div class="penguin-foot right"></div>
        </div>
    </div>
</div>
                    <div class="card-content">
                        <h3 class="card-title">Linux Reviver</h3>
                        <p class="card-text">The other half into reviving my Linux after I 'accidentally' destroy it while experimenting.</p>
                        <div class="card-glow"></div>
                    </div>
                </div>
                
                <div 
                    class="about-card philosophy-card"
                    in:scale={{ duration: 600, delay: 800, easing: elasticOut }}
                    onmouseenter={(e) => {
                        createParticles(e.target.getBoundingClientRect().left + 150, e.target.getBoundingClientRect().top + 100, 15);
                    }}
                    role="button"
                    tabindex="0"
                >
<div class="card-icon">
    <div class="animated-icon bulb-icon">
        <div class="icon-glow"></div>
        <div class="lightbulb">
            <div class="bulb-glass">
                <div class="filament"></div>
                <div class="glow-effect"></div>
            </div>
            <div class="bulb-base"></div>
            <div class="energy-wave wave-1"></div>
            <div class="energy-wave wave-2"></div>
            <div class="energy-wave wave-3"></div>
        </div>
    </div>
</div>
                    <div class="card-content">
                        <h3 class="card-title">Learning Philosophy</h3>
                        <p class="card-text">That's how I learn, grow, and keep the cybersecurity game entertaining. Every broken system teaches me something new.</p>
                        <div class="card-glow"></div>
                    </div>
                </div>
            </div>
            
            <div class="wisdom-quote" in:fade={{ delay: 1000, duration: 800 }}>
<div class="quote-icon">
    <div class="animated-diamond">
        <div class="diamond-core"></div>
        <div class="diamond-shine"></div>
        <div class="sparkle sparkle-1">✨</div>
        <div class="sparkle sparkle-2">✨</div>
    </div>
</div>
                <p class="quote-text">"Every broken system is a lesson, every exploit is a discovery, and every rebuild makes me stronger."</p>
                <div class="quote-author">- My Journey in Cybersecurity</div>
            </div>
        </div>
    </section>

    <!-- Interactive Skills Matrix -->
    <section class="skills-section" in:fly={{ y: 50, duration: 800, delay: 400, easing: cubicOut }}>
        <h2 class="section-title">
            <span class="title-bracket">[</span>
            EXPERTISE_MATRIX
            <span class="title-bracket">]</span>
        </h2>
        
        <div class="skills-matrix">
            {#each skills as skill, i}
                <div 
                    class="skill-node"
                    class:hovered={hoveredSkill === skill}
                    style="--skill-color: {skill.color}; --delay: {i * 0.1}s;"
                    in:scale={{ duration: 500, delay: 500 + i * 50, easing: elasticOut }}
                    onmouseenter={() => {
                        hoveredSkill = skill;
                        createParticles(mouseX, mouseY, 8);
                    }}
                    onmouseleave={() => hoveredSkill = null}
                    role="button"
                    tabindex="0"
                >
                    <div class="skill-category">{skill.category}</div>
                    <div class="skill-name">{skill.name}</div>
                    <div class="skill-level">
                        <div class="level-bar">
                            <div class="level-fill" style="width: {skill.level}%"></div>
                            <div class="level-glow"></div>
                        </div>
                        <span class="level-text">{skill.level}%</span>
                    </div>
                    <div class="skill-particles"></div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Achievements Timeline -->
    <section class="achievements-section" in:fly={{ y: 50, duration: 800, delay: 600, easing: cubicOut }}>
        <h2 class="section-title">
            <span class="title-bracket">[</span>
            ACHIEVEMENT_LOG
            <span class="title-bracket">]</span>
        </h2>
        
        <div class="achievements-timeline">
            {#each achievements as achievement, i}
                {#if achievement.url}
                    <a 
                        href={achievement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="achievement-card achievement-link"
                        style="--glow-color: {achievement.glow};"
                        in:fly={{ x: i % 2 === 0 ? -50 : 50, duration: 600, delay: 700 + i * 150, easing: cubicOut }}
                        onmouseenter={(e) => {
                            createParticles(e.target.getBoundingClientRect().left + 200, e.target.getBoundingClientRect().top + 100, 15);
                        }}
                    >
                        <div class="achievement-icon" style="filter: drop-shadow(0 0 10px {achievement.glow});">
                            {achievement.icon}
                        </div>
                        <div class="achievement-content">
                            <div class="achievement-date">{achievement.date}</div>
                            <h3 class="achievement-title">
                                {achievement.title}
                                <span class="external-link-icon">↗️</span>
                            </h3>
                            <p class="achievement-desc">{achievement.description}</p>
                        </div>
                        <div class="achievement-glow"></div>
                    </a>
                {:else}
                    <div 
                        class="achievement-card"
                        style="--glow-color: {achievement.glow};"
                        in:fly={{ x: i % 2 === 0 ? -50 : 50, duration: 600, delay: 700 + i * 150, easing: cubicOut }}
                        onmouseenter={(e) => {
                            createParticles(e.target.getBoundingClientRect().left + 200, e.target.getBoundingClientRect().top + 100, 15);
                        }}
                        role="button"
                        tabindex="0"
                    >
                        <div class="achievement-icon" style="filter: drop-shadow(0 0 10px {achievement.glow});">
                            {achievement.icon}
                        </div>
                        <div class="achievement-content">
                            <div class="achievement-date">{achievement.date}</div>
                            <h3 class="achievement-title">{achievement.title}</h3>
                            <p class="achievement-desc">{achievement.description}</p>
                        </div>
                        <div class="achievement-glow"></div>
                    </div>
                {/if}
            {/each}
        </div>
    </section>

    <!-- Interactive CTA -->
    <section class="cta-section" in:fly={{ y: 50, duration: 800, delay: 800, easing: cubicOut }}>
        <div class="cta-container">
            <div class="cta-title">Ready to Build Something Amazing?</div>
            <div class="cta-subtitle">Let's collaborate on innovative cybersecurity solutions</div>
            
            <div class="cta-buttons">
                <a 
                    href="https://xw2f7-my.sharepoint.com/:b:/g/personal/jerry_xw2f7_onmicrosoft_com/Ee3C3TnIxjhMrb2rLEX1koMBMfy7yixqd9EyPxRSKJMNuw?e=Un7NOm"
                    class="cta-button primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    onmouseenter={(e) => createParticles(e.target.getBoundingClientRect().left + 100, e.target.getBoundingClientRect().top + 25, 12)}
                >
                    <span class="button-icon">📚</span>
                    <span class="button-text">Download Resume</span>
                    <div class="button-glow"></div>
                </a>
                
                <a 
                    href="/contact"
                    class="cta-button secondary"
                    onmouseenter={(e) => createParticles(e.target.getBoundingClientRect().left + 100, e.target.getBoundingClientRect().top + 25, 8)}
                >
                    <span class="button-icon">📡</span>
                    <span class="button-text">Get In Touch</span>
                    <div class="button-glow"></div>
                </a>
            </div>
        </div>
    </section>
</main>
{/if}

<style>
    :global(body) {
        background: #000;
        overflow-x: hidden;
    }

    /* Particle Canvas */
    .particle-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    }

    /* Animated Grid Background */
    .grid-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: 
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: grid-move 20s linear infinite;
        opacity: 0.3;
    }

    @keyframes grid-move {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
    }

    /* Typewriter Introduction */
    .typewriter-intro {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        transition: all 0.8s ease;
    }

    .terminal-window {
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #00ff00;
        border-radius: 8px;
        min-width: 500px;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    }

    .terminal-header {
        background: rgba(0, 20, 0, 0.8);
        padding: 10px 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #00ff00;
    }

    .controls {
        display: flex;
        gap: 5px;
        margin-right: 15px;
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .red { background: #ff5f56; }
    .yellow { background: #ffbd2e; }
    .green { background: #27c93f; }

    .title {
        color: #00ff00;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9rem;
    }

    .terminal-body {
        padding: 20px;
        font-family: 'Source Code Pro', monospace;
        color: #00ff00;
    }

    .prompt {
        color: #00aa00;
        margin-right: 10px;
    }

    .typed-text {
        color: #00ff00;
    }

    .cursor {
        animation: blink 1s infinite;
        color: #00ff00;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }

    /* Main Content */
    .main-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        position: relative;
        z-index: 2;
    }

    /* Hero Section */
    .hero-section {
        text-align: center;
        padding: 4rem 0;
        margin-bottom: 3rem;
    }

    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .profile-avatar {
        position: relative;
        width: 150px;
        height: 150px;
        cursor: pointer;
        transition: all 0.5s ease;
    }

    .profile-avatar.hovered {
        transform: scale(1.1);
    }

    .avatar-ring {
        position: absolute;
        inset: 0;
        border: 3px solid transparent;
        border-radius: 50%;
        background: linear-gradient(45deg, #00ff00, #00aa00, #00ff00) border-box;
        animation: rotate 4s linear infinite;
    }

    .avatar-content {
        position: absolute;
        inset: 8px;
        background: rgba(0, 20, 0, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    }

    .avatar-icon {
        font-size: 3rem;
        filter: drop-shadow(0 0 10px #00ff00);
    }

    .status-indicator {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        background: #00ff00;
        border: 3px solid #000;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
    }

    .profile-info {
        text-align: center;
    }

    .name-title {
        font-size: 3rem;
        font-weight: bold;
        background: linear-gradient(45deg, #00ff00, #00aa00, #00ff00);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        animation: glow-text 3s ease-in-out infinite alternate;
    }

    .title-role {
        font-size: 1.3rem;
        color: #00aa00;
        margin-bottom: 1rem;
    }

    .location-status {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .location, .status {
        color: #00ff00;
        font-size: 0.9rem;
    }

    @keyframes glow-text {
        from { text-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
        to { text-shadow: 0 0 40px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.3); }
    }


    /* Interactive Personal About Section */
    .about-section {
        margin-bottom: 4rem;
        padding: 2rem 0;
    }

    .about-container {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
    }

    .about-title {
        margin-bottom: 3rem;
        position: relative;
        display: inline-block;
    }

    .title-glow {
        font-size: 2.5rem;
        font-weight: bold;
        color: #00ff00;
        text-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
        animation: pulse-glow 3s ease-in-out infinite alternate;
    }

    .title-underline {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #00ff00, transparent);
        animation: expand-line 2s ease-out 0.5s forwards;
    }

    @keyframes pulse-glow {
        from { text-shadow: 0 0 20px rgba(0, 255, 0, 0.6); }
        to { text-shadow: 0 0 40px rgba(0, 255, 0, 1), 0 0 60px rgba(0, 255, 0, 0.5); }
    }

    @keyframes expand-line {
        from { width: 0; }
        to { width: 200px; }
    }

    .about-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .about-card {
        background: rgba(0, 20, 0, 0.8);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 12px;
        padding: 2rem;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.4s ease;
        backdrop-filter: blur(10px);
        text-align: left;
    }

    .about-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 0, 0.1),
            transparent
        );
        transition: left 0.6s ease;
    }

    .about-card:hover {
        transform: translateY(-10px) scale(1.02);
        border-color: #00ff00;
        box-shadow: 0 15px 40px rgba(0, 255, 0, 0.3);
    }

    .about-card:hover::before {
        left: 100%;
    }

    .card-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
        filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5));
        transition: all 0.3s ease;
    }

    .about-card:hover .card-icon {
        transform: scale(1.2) rotate(5deg);
        filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.8));
    }

    .card-title {
        color: #00ff00;
        font-size: 1.4rem;
        margin-bottom: 1rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .about-card:hover .card-title {
        text-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
    }

    .card-text {
        color: #00cc00;
        line-height: 1.6;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .about-card:hover .card-text {
        color: #00ff00;
    }

    .card-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        background: radial-gradient(
            circle,
            rgba(0, 255, 0, 0.1) 0%,
            transparent 70%
        );
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    .about-card:hover .card-glow {
        opacity: 1;
    }

    /* Special card colors */
    .lab-card:hover {
        border-color: #ff6b00;
        box-shadow: 0 15px 40px rgba(255, 107, 0, 0.3);
    }

    .linux-card:hover {
        border-color: #0099ff;
        box-shadow: 0 15px 40px rgba(0, 153, 255, 0.3);
    }

    .philosophy-card:hover {
        border-color: #ff0080;
        box-shadow: 0 15px 40px rgba(255, 0, 128, 0.3);
    }

    /* Wisdom Quote */
    .wisdom-quote {
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid rgba(0, 255, 0, 0.4);
        border-radius: 15px;
        padding: 2rem;
        position: relative;
        max-width: 700px;
        margin: 0 auto;
        backdrop-filter: blur(15px);
    }

    .quote-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.7));
    }

    .quote-text {
        color: #00ff00;
        font-size: 1.2rem;
        font-style: italic;
        line-height: 1.7;
        margin-bottom: 1rem;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    .quote-author {
        color: #00aa00;
        font-size: 0.9rem;
        font-weight: bold;
    }

    /* Skills Section */
    .skills-section {
        margin-bottom: 4rem;
    }

    .section-title {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 3rem;
        color: #00ff00;
        font-family: 'Source Code Pro', monospace;
    }

    .title-bracket {
        color: #00aa00;
        animation: bracket-glow 2s ease-in-out infinite alternate;
    }

    @keyframes bracket-glow {
        from { text-shadow: 0 0 10px rgba(0, 170, 0, 0.5); }
        to { text-shadow: 0 0 20px rgba(0, 170, 0, 0.8); }
    }

    .skills-matrix {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .skill-node {
        background: rgba(0, 20, 0, 0.8);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 8px;
        padding: 1.5rem;
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
        animation: float 6s ease-in-out infinite;
        animation-delay: var(--delay);
    }

    .skill-node:hover {
        transform: translateY(-5px) scale(1.02);
        border-color: var(--skill-color);
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
    }

    .skill-node.hovered {
        border-color: var(--skill-color);
        box-shadow: 0 0 30px var(--skill-color);
    }

    .skill-category {
        font-size: 0.8rem;
        color: #00aa00;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .skill-name {
        font-size: 1.2rem;
        color: #00ff00;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .skill-level {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .level-bar {
        flex: 1;
        height: 8px;
        background: rgba(0, 40, 0, 0.5);
        border-radius: 4px;
        position: relative;
        overflow: hidden;
    }

    .level-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--skill-color), rgba(0, 255, 0, 0.8));
        border-radius: 4px;
        transition: width 1s ease;
        position: relative;
    }

    .level-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s infinite;
    }

    .level-text {
        color: var(--skill-color);
        font-weight: bold;
        min-width: 40px;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    /* Achievements Section */
    .achievements-section {
        margin-bottom: 4rem;
    }

    .achievements-timeline {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .achievement-card {
        background: rgba(0, 20, 0, 0.8);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 12px;
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
    }

    .achievement-card:hover {
        transform: translateX(10px);
        border-color: var(--glow-color);
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
    }

    .achievement-link {
        cursor: pointer;
    }

    .achievement-link:hover {
        transform: translateX(15px) scale(1.02);
    }

    .achievement-link:hover .external-link-icon {
        transform: scale(1.2);
        opacity: 1;
    }

    .achievement-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
    }

    .achievement-content {
        flex: 1;
    }

    .achievement-date {
        color: #00aa00;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .achievement-title {
        color: #00ff00;
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .external-link-icon {
        font-size: 0.9rem;
        opacity: 0.7;
        transition: all 0.3s ease;
        transform: scale(0.8);
    }

    .achievement-desc {
        color: #00aa00;
        line-height: 1.6;
    }

    .achievement-glow {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 0, 0.1),
            transparent
        );
        transition: left 0.5s ease;
    }

    .achievement-card:hover .achievement-glow {
        left: 100%;
    }

    /* CTA Section */
    .cta-section {
        text-align: center;
        padding: 4rem 0;
    }

    .cta-container {
        max-width: 600px;
        margin: 0 auto;
    }

    .cta-title {
        font-size: 2.5rem;
        color: #00ff00;
        margin-bottom: 1rem;
        text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }

    .cta-subtitle {
        color: #00aa00;
        font-size: 1.2rem;
        margin-bottom: 3rem;
        line-height: 1.6;
    }

    .cta-buttons {
        display: flex;
        gap: 2rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .cta-button {
        background: transparent;
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 1rem 2rem;
        color: #00ff00;
        text-decoration: none;
        font-weight: bold;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 180px;
        justify-content: center;
    }

    .cta-button.primary {
        background: linear-gradient(45deg, rgba(0, 255, 0, 0.1), rgba(0, 170, 0, 0.1));
    }

    .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
        color: #000;
        background: #00ff00;
    }

    .button-icon {
        font-size: 1.2rem;
    }

    .button-glow {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transition: left 0.5s ease;
    }

    .cta-button:hover .button-glow {
        left: 100%;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .terminal-window {
            min-width: 90vw;
            margin: 0 20px;
        }

        .name-title {
            font-size: 2rem;
        }


        .skills-matrix {
            grid-template-columns: 1fr;
        }

        .achievement-card {
            flex-direction: column;
            text-align: center;
        }

        .cta-buttons {
            flex-direction: column;
            align-items: center;
        }

        .main-content {
            padding: 1rem;
        }
        
        .about-cards {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
        .about-card {
            padding: 1.5rem;
        }
        
        .title-glow {
            font-size: 2rem;
        }
        
        .wisdom-quote {
            margin: 0 1rem;
            padding: 1.5rem;
        }
        
        .quote-text {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        .section-title {
            font-size: 1.8rem;
        }

        .cta-title {
            font-size: 1.8rem;
        }
    }
/* Interactive Avatar Shield Animation */
.avatar-icon-animated {
    position: relative;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.shield-layer {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid #00ff00;
    border-radius: 30% 30% 30% 30%;
    animation: shieldPulse 3s ease-in-out infinite;
}

.layer-1 {
    opacity: 0.3;
    animation-delay: 0s;
}

.layer-2 {
    width: 50px;
    height: 50px;
    opacity: 0.5;
    animation-delay: 0.5s;
}

.layer-3 {
    width: 40px;
    height: 40px;
    opacity: 0.7;
    animation-delay: 1s;
}

.shield-core {
    font-size: 2.5rem;
    position: relative;
    z-index: 5;
    filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.8));
    animation: shieldRotate 6s linear infinite;
}

@keyframes shieldPulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes shieldRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Animated Lab Beaker */
.animated-icon {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-glow {
    position: absolute;
    inset: -10px;
    background: radial-gradient(circle, rgba(0, 255, 0, 0.3), transparent 70%);
    border-radius: 50%;
    animation: iconGlowPulse 2s ease-in-out infinite;
}

@keyframes iconGlowPulse {
    0%, 100% { transform: scale(0.8); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.6; }
}

.beaker-container {
    position: relative;
    width: 40px;
    height: 50px;
}

.beaker-body {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 40px;
    border: 3px solid #00ff00;
    border-top: none;
    border-radius: 0 0 8px 8px;
    background: rgba(0, 255, 0, 0.05);
}

.liquid {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 26px;
    height: 25px;
    background: linear-gradient(to top, #00ff00, rgba(0, 255, 0, 0.3));
    border-radius: 0 0 6px 6px;
    animation: liquidBubble 3s ease-in-out infinite;
}

@keyframes liquidBubble {
    0%, 100% { height: 25px; }
    50% { height: 30px; }
}

.bubble {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #00ff00;
    border-radius: 50%;
    animation: bubbleRise 2s ease-in infinite;
}

.bubble-1 { left: 8px; animation-delay: 0s; }
.bubble-2 { left: 15px; animation-delay: 0.7s; }
.bubble-3 { left: 22px; animation-delay: 1.4s; }

@keyframes bubbleRise {
    0% { bottom: 5px; opacity: 0; }
    50% { opacity: 1; }
    100% { bottom: 35px; opacity: 0; }
}

/* Animated Linux Penguin */
.penguin {
    position: relative;
    width: 50px;
    height: 55px;
}

.penguin-body {
    position: absolute;
    width: 35px;
    height: 40px;
    background: #333;
    border-radius: 50% 50% 45% 45%;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    animation: penguinWaddle 2s ease-in-out infinite;
}

.penguin-belly {
    position: absolute;
    width: 22px;
    height: 28px;
    background: #fff;
    border-radius: 50%;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.penguin-eye {
    position: absolute;
    width: 5px;
    height: 5px;
    background: #00ff00;
    border-radius: 50%;
    top: 15px;
    box-shadow: 0 0 5px #00ff00;
    animation: penguinBlink 4s ease-in-out infinite;
}

.penguin-eye.left { left: 10px; }
.penguin-eye.right { right: 10px; }

.penguin-beak {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #ff8800;
    top: 22px;
    left: 50%;
    transform: translateX(-50%);
}

.penguin-wing {
    position: absolute;
    width: 12px;
    height: 20px;
    background: #222;
    border-radius: 50%;
    top: 18px;
}

.penguin-wing.left { left: -2px; transform: rotate(-20deg); animation: wingFlap 1.5s ease-in-out infinite; }
.penguin-wing.right { right: -2px; transform: rotate(20deg); animation: wingFlap 1.5s ease-in-out infinite 0.75s; }

.penguin-foot {
    position: absolute;
    width: 12px;
    height: 8px;
    background: #ff8800;
    border-radius: 50% 50% 0 0;
    bottom: -3px;
}

.penguin-foot.left { left: 8px; }
.penguin-foot.right { right: 8px; }

@keyframes penguinWaddle {
    0%, 100% { transform: translateX(-50%) rotate(0deg); }
    25% { transform: translateX(-50%) rotate(-5deg); }
    75% { transform: translateX(-50%) rotate(5deg); }
}

@keyframes penguinBlink {
    0%, 90%, 100% { height: 5px; }
    95% { height: 1px; }
}

@keyframes wingFlap {
    0%, 100% { transform: rotate(-20deg); }
    50% { transform: rotate(-40deg); }
}

/* Animated Light Bulb */
.lightbulb {
    position: relative;
    width: 40px;
    height: 55px;
}

.bulb-glass {
    position: absolute;
    width: 30px;
    height: 35px;
    background: radial-gradient(circle, rgba(0, 255, 0, 0.3), rgba(0, 255, 0, 0.1));
    border: 2px solid #00ff00;
    border-radius: 50% 50% 45% 45%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    animation: bulbGlow 2s ease-in-out infinite;
}

.filament {
    position: absolute;
    width: 2px;
    height: 15px;
    background: #00ff00;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
    box-shadow: 0 0 10px #00ff00;
    animation: filamentFlicker 0.3s ease-in-out infinite;
}

.glow-effect {
    position: absolute;
    inset: -5px;
    background: radial-gradient(circle, rgba(0, 255, 0, 0.6), transparent 60%);
    border-radius: 50%;
    animation: bulbGlow 2s ease-in-out infinite;
}

.bulb-base {
    position: absolute;
    width: 20px;
    height: 15px;
    background: linear-gradient(to bottom, #00aa00, #008800);
    border: 1px solid #00ff00;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0 0 4px 4px;
}

.energy-wave {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid #00ff00;
    border-radius: 50%;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    animation: energyExpand 2s ease-out infinite;
}

.wave-1 { animation-delay: 0s; }
.wave-2 { animation-delay: 0.7s; }
.wave-3 { animation-delay: 1.4s; }

@keyframes bulbGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
    50% { box-shadow: 0 0 40px rgba(0, 255, 0, 0.9), 0 0 60px rgba(0, 255, 0, 0.5); }
}

@keyframes filamentFlicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}

@keyframes energyExpand {
    0% { transform: translateX(-50%) scale(0.5); opacity: 1; }
    100% { transform: translateX(-50%) scale(2); opacity: 0; }
}

/* Animated Diamond Quote Icon */
.animated-diamond {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.diamond-core {
    width: 25px;
    height: 25px;
    background: linear-gradient(135deg, #00ff00, #00aa00);
    border: 2px solid #00ff00;
    transform: rotate(45deg);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.7);
    animation: diamondSpin 4s linear infinite;
}

.diamond-shine {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%);
    transform: rotate(45deg);
    animation: shineMove 3s ease-in-out infinite;
}

.sparkle {
    position: absolute;
    font-size: 0.8rem;
    animation: sparkleFloat 3s ease-in-out infinite;
}

.sparkle-1 {
    top: -8px;
    left: -8px;
    animation-delay: 0s;
}

.sparkle-2 {
    bottom: -8px;
    right: -8px;
    animation-delay: 1.5s;
}

@keyframes diamondSpin {
    0% { transform: rotate(45deg); }
    100% { transform: rotate(405deg); }
}

@keyframes shineMove {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
}

@keyframes sparkleFloat {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
    50% { transform: translateY(-5px) scale(1.2); opacity: 1; }
}
</style>

