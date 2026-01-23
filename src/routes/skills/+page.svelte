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

// Data
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

$: filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

$: skillStats = {
    total: skills.length,
    categories: categories.length - 1,
    avgLevel: Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
};

// --- Particle System (Restored) ---
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 1;
        this.color = color;
        this.alpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.alpha = this.life;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha * 0.8;
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
    if (Math.random() < 0.08) {
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

onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    setTimeout(() => visible = true, 300);
    requestAnimationFrame(animateParticles);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    return () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
});
</script>

<canvas bind:this={canvas} class="particle-canvas"></canvas>
<div class="background-overlay"></div>

{#if visible}
<main in:fade={{ duration: 1000 }} class="main-container">
    
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -30, duration: 800, easing: cubicOut }}>
        <h1 class="page-title">
            <span class="code-bracket">{'<'}</span>
            SKILLS_MATRIX
            <span class="code-bracket">{'/>'}</span>
        </h1>
        <p class="subtitle">Architecting solutions with modern technologies</p>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar glass-panel" in:fly={{ y: 20, duration: 600, delay: 200, easing: cubicOut }}>
        <div class="stat-item">
            <div class="stat-value">{skillStats.total}</div>
            <div class="stat-label">Competencies</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <div class="stat-value">{skillStats.categories}</div>
            <div class="stat-label">Domains</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <div class="stat-value">{skillStats.avgLevel}%</div>
            <div class="stat-label">Avg Proficiency</div>
        </div>
    </section>

    <!-- Filters -->
    <section class="filter-section" in:fly={{ y: 20, duration: 600, delay: 300, easing: cubicOut }}>
        <div class="chips-container">
            {#each categories as category, i}
                <button 
                    class="filter-chip"
                    class:active={selectedCategory === category.name}
                    style="--chip-color: {category.color}"
                    on:click={() => selectedCategory = category.name}
                >
                    <span class="chip-icon">{category.icon}</span>
                    {category.name}
                </button>
            {/each}
        </div>
    </section>

    <!-- Skills Grid -->
    <section class="skills-grid">
        {#each filteredSkills as skill, i (skill.name)}
            <div 
                class="skill-card glass-panel"
                class:hovered={hoveredSkill === skill}
                style="--accent-color: {categories.find(c => c.name === skill.category)?.color || '#fff'}"
                in:scale={{ duration: 300, delay: i * 30, easing: cubicOut }}
                on:mouseenter={(e) => {
                    hoveredSkill = skill;
                    const rect = e.target.getBoundingClientRect();
                    createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 8, categories.find(c => c.name === skill.category)?.color);
                }}
                on:mouseleave={() => hoveredSkill = null}
            >
                <div class="card-header">
                    <div class="icon-box">
                        <span class="skill-icon">{skill.icon}</span>
                    </div>
                    <div class="skill-level">{skill.level}%</div>
                </div>
                
                <div class="card-body">
                    <h3 class="skill-name">{skill.name}</h3>
                    <p class="skill-category">{skill.category}</p>
                    
                    <div class="progress-track">
                        <div class="progress-bar" style="width: {skill.level}%; background: var(--accent-color)"></div>
                    </div>
                </div>

                {#if hoveredSkill === skill}
                    <div class="card-overlay" in:fade={{ duration: 200 }}>
                        <p class="description">{skill.description}</p>
                    </div>
                {/if}
            </div>
        {/each}
    </section>

</main>
{/if}

<style>
:global(body) {
    background: #080808;
    color: #fff;
    overflow-x: hidden;
}

.particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
}

.background-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(20, 20, 30, 0), rgba(0, 0, 0, 0.8));
    pointer-events: none;
    z-index: 0;
}

.main-container {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
}

/* Glassmorphism Helper */
.glass-panel {
    background: rgba(20, 20, 20, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Typography */
.hero-section {
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    font-family: 'Courier New', monospace;
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -1px;
    margin-bottom: 0.5rem;
    color: #fff;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.code-bracket {
    color: #00ff00; /* Hacker green accent */
    font-weight: 300;
}

.subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.1rem;
    font-weight: 300;
}

/* Stats */
.stats-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    padding: 1.5rem;
    max-width: 800px;
    margin: 0 auto 4rem auto;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: 800;
    font-family: 'Courier New', monospace;
    color: #00ff00;
}

.stat-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 1px;
    margin-top: 0.2rem;
}

.stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
}

/* Filters */
.filter-section {
    margin-bottom: 3rem;
}

.chips-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.filter-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-chip:hover, .filter-chip.active {
    background: rgba(var(--chip-color), 0.1);
    border-color: var(--chip-color);
    color: #fff;
    box-shadow: 0 0 15px var(--chip-color);
}

.chip-icon {
    font-size: 1rem;
}

/* Skills Grid */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.skill-card {
    position: relative;
    padding: 1.5rem;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    cursor: default;
}

.skill-card:hover {
    transform: translateY(-5px);
    border-color: var(--accent-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.02);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.icon-box {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.skill-icon {
    font-size: 1.8rem;
}

.skill-level {
    font-family: 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent-color);
    font-size: 1rem;
}

.card-body h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
}

.skill-category {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0.2rem 0 1rem 0;
}

.progress-track {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    border-radius: 2px;
    box-shadow: 0 0 10px var(--accent-color);
}

.card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 10, 0.96);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    text-align: center;
}

.description {
    font-size: 0.9rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
    .page-title { font-size: 2.5rem; }
    .stats-bar { padding: 1rem; gap: 1rem; }
    .stat-value { font-size: 1.5rem; }
}
</style>
