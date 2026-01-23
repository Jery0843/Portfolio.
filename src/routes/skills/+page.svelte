<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';

let visible = false;
let canvas;
let ctx;
let particles = [];
let hoveredSkill = null;
let selectedCategory = 'All';
let animationFrame;
let mouseX = 0;
let mouseY = 0;

const categories = [
    { name: 'All', color: '#00ff00', icon: '🌐' },
    { name: 'Offensive Security', color: '#ff0080', icon: '⚔️' },
    { name: 'Web Development', color: '#ff6b00', icon: '⚡' },
    { name: 'Full Stack Development', color: '#00ff80', icon: '🔄' },
    { name: 'Programming', color: '#00bfff', icon: '💻' },
    { name: 'AI & ML', color: '#8a2be2', icon: '🤖' }
];

const skills = [
    // Offensive Security
    { name: 'Penetration Testing', level: 90, category: 'Offensive Security', icon: '🎯', description: 'Advanced penetration testing and exploit development' },
    { name: 'Web Exploitation', level: 92, category: 'Offensive Security', icon: '🌐', description: 'OWASP Top 10, SQLi, XSS, SSRF, LFI/RFI' },
    { name: 'Binary Exploitation', level: 85, category: 'Offensive Security', icon: '⚡', description: 'Buffer overflows, ROP chains, heap exploitation' },
    { name: 'Reverse Engineering', level: 88, category: 'Offensive Security', icon: '🔧', description: 'Static and dynamic analysis, binary reversing' },
    { name: 'Cryptography', level: 87, category: 'Offensive Security', icon: '🔐', description: 'Crypto attacks, hash cracking, cipher analysis' },
    
    // Web Development
    { name: 'Angular', level: 85, category: 'Web Development', icon: '🅰️', description: 'Component-based architecture, RxJS, NgRx' },
    { name: 'HTML5/CSS3', level: 95, category: 'Web Development', icon: '🎨', description: 'Semantic HTML, Flexbox, Grid, Animations' },
    { name: 'JavaScript', level: 92, category: 'Web Development', icon: '📜', description: 'ES6+, Asynchronous programming, DOM manipulation' },
    { name: 'Svelte', level: 90, category: 'Web Development', icon: '🔥', description: 'Reactive components, state management, transitions' },
    { name: 'TailwindCSS', level: 94, category: 'Web Development', icon: '🌊', description: 'Utility-first CSS, custom design systems' },

    // Full Stack Development
    { name: 'Next.js', level: 88, category: 'Full Stack Development', icon: '▲', description: 'SSR, ISR, API Routes, Middleware' },
    { name: 'Node.js', level: 90, category: 'Full Stack Development', icon: '🟢', description: 'Event-driven architecture, RESTful APIs' },
    { name: 'Express', level: 89, category: 'Full Stack Development', icon: '🚂', description: 'Middleware development, routing' },
    { name: 'MongoDB', level: 86, category: 'Full Stack Development', icon: '🍃', description: 'NoSQL schema design, aggregation pipelines' },
    { name: 'PostgreSQL', level: 85, category: 'Full Stack Development', icon: '🐘', description: 'Relational modelling, advanced queries' },
    { name: 'API Design', level: 88, category: 'Full Stack Development', icon: '🔌', description: 'REST, GraphQL, OpenAPI specification' },

    // Programming
    { name: 'Python', level: 95, category: 'Programming', icon: '🐍', description: 'Automation, scripting, exploit development' },
    { name: 'Go', level: 75, category: 'Programming', icon: '🚀', description: 'Concurrent systems, CLI tools' },
    { name: 'Bash/Shell', level: 92, category: 'Programming', icon: '💻', description: 'System automation, pipeline scripting' },
    
    // AI & ML
    { name: 'Machine Learning', level: 85, category: 'AI & ML', icon: '🧠', description: 'Algorithm implementation, model training' },
    { name: 'TensorFlow', level: 78, category: 'AI & ML', icon: '🔷', description: 'Deep learning models, neural networks' }
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.size = Math.random() * 3 + 2;
        this.color = color;
        this.alpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.alpha = this.life;
        this.vx *= 0.95;
        this.vy *= 0.95;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count, color) {
    if (!ctx) return;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animateParticles() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ambient particles
    if (Math.random() < 0.05) {
        const colors = ['#00ff00', '#ff0080', '#00bfff', '#ff8c00', '#8a2be2'];
        createParticles(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            1,
            colors[Math.floor(Math.random() * colors.length)]
        );
    }
    
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
}

$: filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

$: skillStats = {
    total: skills.length,
    categories: categories.length - 1,
    avgLevel: Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
};

onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    setTimeout(() => visible = true, 300);
    requestAnimationFrame(animateParticles);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    return () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        window.removeEventListener('mousemove', handleMouseMove);
    };
});
</script>

<canvas bind:this={canvas} class="particle-canvas"></canvas>
<div class="hexagon-background"></div>

{#if visible}
<main in:fade={{ duration: 1000 }} class="main-container">
    <!-- Holographic Hero Section -->
    <section class="hero-section" in:fly={{ y: -50, duration: 800, easing: cubicOut }}>
        <div class="hologram-container">
            <h1 class="skills-title">
                <span class="bracket">{'<'}</span>
                <span class="main-text glitch" data-text="SKILL_MATRIX">SKILL_MATRIX</span>
                <span class="bracket">{'/>'}</span>
                <div class="glitch-line"></div>
            </h1>
        </div>
        <div class="subtitle-container">
            <div class="scan-line"></div>
            <p class="subtitle">Technical Proficiency & Framework Mastery</p>
        </div>
    </section>

    <!-- Stats Dashboard -->
    <section class="stats-section" in:fly={{ y: 30, duration: 600, delay: 200, easing: cubicOut }}>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value counter">{skillStats.total}</div>
                <div class="stat-label">Total Capabilities</div>
                <div class="stat-bar"></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔖</div>
                <div class="stat-value counter">{skillStats.categories}</div>
                <div class="stat-label">Specializations</div>
                <div class="stat-bar" style="background: var(--neon-pink)"></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-value counter">{skillStats.avgLevel}%</div>
                <div class="stat-label">Avg Proficiency</div>
                <div class="stat-bar" style="background: var(--cyber-blue)"></div>
            </div>
        </div>
    </section>

    <!-- Category Command Center -->
    <section class="filter-section" in:fly={{ y: 30, duration: 600, delay: 300, easing: cubicOut }}>
        <div class="command-interface">
            <div class="interface-header">
                <span class="blink">_</span> SELECT_PROTOCOL
            </div>
            <div class="category-buttons">
                {#each categories as category, i}
                    <button 
                        class="category-btn"
                        class:active={selectedCategory === category.name}
                        style="--category-color: {category.color}; --delay: {i * 0.1}s"
                        on:click={() => selectedCategory = category.name}
                        on:mouseenter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 10, category.color);
                        }}
                    >
                        <span class="btn-glitch"></span>
                        <span class="cat-icon">{category.icon}</span>
                        <span class="cat-name">{category.name}</span>
                        {#if selectedCategory === category.name}
                            <span class="active-indicator" in:scale></span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </section>

    <!-- 3D Skill Grid -->
    <section class="skills-section" in:fly={{ y: 50, duration: 800, delay: 500, easing: cubicOut }}>
        <div class="skills-grid">
            {#each filteredSkills as skill, i (skill.name)}
                <div 
                    class="skill-card-3d"
                    class:hovered={hoveredSkill === skill}
                    style="--skill-color: {categories.find(c => c.name === skill.category)?.color || '#00ff00'}; --delay: {i * 0.05}s;"
                    in:scale={{ duration: 400, delay: 400 + i * 50, easing: elasticOut }}
                    on:mouseenter={(e) => {
                        hoveredSkill = skill;
                        const rect = e.target.getBoundingClientRect();
                        createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 15, categories.find(c => c.name === skill.category)?.color);
                    }}
                    on:mouseleave={() => hoveredSkill = null}
                    role="button"
                    tabindex="0"
                >
                    <div class="card-content">
                        <!-- Holographic Overlay -->
                        <div class="holo-overlay"></div>
                        
                        <!-- Top Decor -->
                        <div class="card-header">
                            <span class="skill-icon">{skill.icon}</span>
                            <div class="skill-percentage">{skill.level}%</div>
                        </div>
                        
                        <!-- Card Body -->
                        <div class="card-body">
                            <h3 class="skill-name">{skill.name}</h3>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div 
                                        class="progress-fill" 
                                        style="width: {skill.level}%; background: categories.find(c => c.name === skill.category)?.color;"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <!-- Hover Details -->
                        {#if hoveredSkill === skill}
                            <div class="skill-details" in:fade={{ duration: 200 }}>
                                <p class="skill-desc">{skill.description}</p>
                                <span class="skill-category-tag">{skill.category}</span>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </section>
</main>
{/if}

<style>
:global(body) {
    overflow-x: hidden;
    background: #050505;
    color: #fff;
}

:global(:root) {
    --hacker-green: #00ff00;
    --cyber-blue: #00bfff;
    --neon-pink: #ff0080;
    --electric-purple: #8a2be2;
    --warning-orange: #ff8c00;
}

.particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
}

.hexagon-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.03;
    background-image: 
        radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(0, 191, 255, 0.1) 2px, transparent 2px);
    background-size: 60px 60px;
    animation: hexMove 30s linear infinite;
    z-index: 0;
}

@keyframes hexMove {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(30px, 30px) rotate(360deg); }
}

.main-container {
    position: relative;
    z-index: 2;
    padding: 2rem;
    max-width: 1600px;
    margin: 0 auto;
}

/* Holographic Hero */
.hero-section {
    text-align: center;
    margin-bottom: 4rem;
    position: relative;
}

.skills-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    margin: 0;
    position: relative;
    display: inline-block;
}

.bracket {
    color: var(--cyber-blue);
    text-shadow: 0 0 15px var(--cyber-blue);
    animation: pulse 2s infinite;
}

.glitch {
    position: relative;
    animation: glitch-skew 3s infinite linear alternate-reverse;
}

.glitch::after {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    text-shadow: -1px 0 #ff00c1;
    top: 0;
    color: var(--hacker-green);
    background: #050505;
    overflow: hidden;
    clip: rect(0, 900px, 0, 0);
    animation: glitch-anim 2s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
    0% { clip: rect(44px, 9999px, 56px, 0); transform: skew(0.5deg); }
    5% { clip: rect(12px, 9999px, 86px, 0); transform: skew(0.4deg); }
    10% { clip: rect(78px, 9999px, 23px, 0); transform: skew(0.1deg); }
    15% { clip: rect(65px, 9999px, 3px, 0); transform: skew(0.3deg); }
    100% { clip: rect(69px, 9999px, 19px, 0); transform: skew(0.2deg); }
}

.subtitle-container {
    position: relative;
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 2rem;
    background: rgba(0, 255, 0, 0.05);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 4px;
}

.subtitle {
    font-family: 'Courier New', monospace;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 255, 0, 0.5);
    animation: scan 3s linear infinite;
    box-shadow: 0 0 10px var(--hacker-green);
}

@keyframes scan {
    0% { top: 0; opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

/* Stats Dashboard */
.stats-grid {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 4rem;
    flex-wrap: wrap;
}

.stat-card {
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem 2.5rem;
    border-radius: 12px;
    text-align: center;
    position: relative;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;
    min-width: 200px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.stat-card:hover {
    transform: translateY(-5px);
    border-color: var(--hacker-green);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
}

.stat-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.stat-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 0.5rem;
}

.stat-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--hacker-green);
    border-radius: 0 0 12px 12px;
    box-shadow: 0 0 10px currentColor;
}

/* Command Interface */
.filter-section {
    margin-bottom: 4rem;
}

.command-interface {
    background: rgba(10, 10, 10, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
}

.interface-header {
    font-family: 'Courier New', monospace;
    color: var(--hacker-green);
    margin-bottom: 2rem;
    font-size: 1.2rem;
    border-bottom: 1px solid rgba(0, 255, 0, 0.2);
    padding-bottom: 1rem;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.blink {
    animation: blink 1s infinite;
}

@keyframes blink {
    50% { opacity: 0; }
}

.category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.category-btn {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Courier New', monospace;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;
    font-weight: 600;
}

.category-btn:hover, .category-btn.active {
    background: rgba(var(--category-color), 0.1);
    border-color: var(--category-color);
    color: #fff;
    box-shadow: 0 0 20px var(--category-color), inset 0 0 10px rgba(0,0,0,0.5);
    text-shadow: 0 0 8px var(--category-color);
    transform: translateY(-2px);
}

.active-indicator {
    width: 8px;
    height: 8px;
    background: var(--category-color);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--category-color);
}

/* 3D Skill Cards */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    perspective: 1000px;
}

.skill-card-3d {
    position: relative;
    height: 180px;
    background: rgba(15, 15, 15, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    overflow: hidden;
    backdrop-filter: blur(20px);
}

.skill-card-3d:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: var(--skill-color);
    box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.5),
        0 0 30px var(--skill-color);
    z-index: 10;
}

.holo-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
    z-index: 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
}

.skill-icon {
    font-size: 2.5rem;
    filter: drop-shadow(0 0 10px var(--skill-color));
}

.skill-percentage {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--skill-color);
    text-shadow: 0 0 10px var(--skill-color);
}

.skill-name {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
}

.progress-container {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    z-index: 2;
}

.progress-fill {
    height: 100%;
    border-radius: 3px;
    box-shadow: 0 0 10px currentColor;
    background: var(--skill-color);
    transition: width 1s ease-out;
}

.skill-details {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.95);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 5;
    backdrop-filter: blur(20px);
}

.skill-desc {
    font-size: 0.9rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1rem;
}

.skill-category-tag {
    font-size: 0.75rem;
    text-transform: uppercase;
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--skill-color);
    color: var(--skill-color);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 15px var(--skill-color);
}

@media (max-width: 768px) {
    .skills-title { font-size: 2.5rem; }
    .stats-grid { gap: 1rem; }
    .stat-card { min-width: 140px; padding: 1rem; }
    .stat-value { font-size: 1.8rem; }
    .skills-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
}
</style>
