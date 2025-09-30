<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';
import AnimatedIcon from '$lib/components/AnimatedIcons.svelte';

let canvas;
let ctx;
let showContent = false;
let selectedExp = null;
let hoveredExp = null;
let particles = [];
let animationFrame;
let mouseX = 0;
let mouseY = 0;

const experiences = [
    {
        id: 1,
        company: "Kanini Software Solutions",
        location: "Chennai",
        position: "Data & Analytics Intern",
        duration: "Dec 2023 – Apr 2024",
        type: "Data Science",
        color: "#00ff80",
        icon: "📊",
        achievements: [
            "Performed exploratory data analysis (EDA) on large datasets to derive insights and improve healthcare scheduling by 20%",
            "Built and optimized machine learning models for predicting patient no-shows, increasing prediction accuracy by 15%",
            "Collaborated with healthcare professionals to understand domain-specific requirements",
            "Presented findings to stakeholders using data visualization tools"
        ],
        skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "Healthcare Analytics"],
        impact: "Improved healthcare scheduling efficiency and reduced patient no-show rates"
    },
    {
        id: 2,
        company: "Mic & Mac Solutions",
        location: "Chennai", 
        position: "Web Development Intern",
        duration: "May 2023 – Jun 2023",
        type: "Full Stack Development",
        color: "#ff6b00",
        icon: "💻",
        achievements: [
            "Developed full-stack web applications using ASP.NET and CSS, improving application response times by 30%",
            "Used SQL to manage and optimize databases, improving query performance by 25%",
            "Implemented responsive web design principles for better user experience",
            "Collaborated with senior developers on code reviews and best practices"
        ],
        skills: ["ASP.NET", "CSS", "SQL", "Web Development", "Database Optimization"],
        impact: "Enhanced web application performance and database efficiency"
    }
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 4 + 1;
        this.color = color || '#00ff00';
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count = 12, color = '#00ff00') {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            x + Math.random() * 30 - 15,
            y + Math.random() * 30 - 15,
            color
        ));
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

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    setTimeout(() => showContent = true, 800);
    animateParticles();
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
});
</script>

<!-- Particle Canvas -->
<canvas bind:this={canvas} class="particle-canvas"></canvas>

<!-- Animated Grid Background -->
<div class="grid-background"></div>

{#if showContent}
<main in:fade={{ duration: 1000 }} class="main-content">
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -50, duration: 800, easing: cubicOut }}>
        <h1 class="experience-title">
            <span class="title-bracket">[</span>
            PROFESSIONAL_JOURNEY
            <span class="title-bracket">]</span>
        </h1>
        <div class="title-subtitle">Building expertise through hands-on experience</div>
    </section>

    <!-- Interactive Experience Timeline -->
    <section class="timeline-section" in:fly={{ y: 50, duration: 800, delay: 200, easing: cubicOut }}>
        <div class="timeline-container">
            <div class="timeline-line"></div>
            
            {#each experiences as exp, i}
                <div 
                    class="experience-card"
                    class:selected={selectedExp === exp}
                    class:hovered={hoveredExp === exp}
                    style="--exp-color: {exp.color}; --delay: {i * 0.2}s;"
                    in:scale={{ duration: 600, delay: 400 + i * 200, easing: elasticOut }}
                    on:click={() => selectedExp = selectedExp === exp ? null : exp}
                    on:mouseenter={(e) => {
                        hoveredExp = exp;
                        createParticles(
                            e.target.getBoundingClientRect().left + 200,
                            e.target.getBoundingClientRect().top + 100,
                            15,
                            exp.color
                        );
                    }}
                    on:mouseleave={() => hoveredExp = null}
                    role="button"
                    tabindex="0"
                >
                    <!-- Timeline Node -->
                    <div class="timeline-node">
                        <div class="node-icon" style="filter: drop-shadow(0 0 10px {exp.color});">
                            {exp.icon}
                        </div>
                        <div class="node-pulse"></div>
                    </div>
                    
                    <!-- Experience Content -->
                    <div class="exp-content">
                        <div class="exp-header">
                            <div class="company-info">
                                <h3 class="company-name">{exp.company}</h3>
                                <div class="location"><span class="location-icon-wrapper"><AnimatedIcon icon="location" size="1em" /></span> <span>{exp.location}</span></div>
                            </div>
                            <div class="duration-badge">{exp.duration}</div>
                        </div>
                        
                        <div class="position-info">
                            <h4 class="position-title">{exp.position}</h4>
                            <span class="exp-type">{exp.type}</span>
                        </div>
                        
                        <!-- Collapsed View -->
                        {#if selectedExp !== exp}
                            <div class="preview-content">
                                <p class="impact-preview">{exp.impact}</p>
                                <div class="skills-preview">
                                    {#each exp.skills.slice(0, 3) as skill}
                                        <span class="skill-tag">{skill}</span>
                                    {/each}
                                    {#if exp.skills.length > 3}
                                        <span class="skill-more">+{exp.skills.length - 3} more</span>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                        
                        <!-- Expanded View -->
                        {#if selectedExp === exp}
                            <div class="expanded-content" in:fade={{ duration: 400 }}>
                                <div class="achievements-section">
                                    <h5 class="section-title">🏆 Key Achievements</h5>
                                    <ul class="achievements-list">
                                        {#each exp.achievements as achievement, j}
                                            <li in:fly={{ x: -20, duration: 300, delay: j * 100 }}>
                                                <span class="bullet">▶</span>
                                                {achievement}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                                
                                <div class="skills-section">
                                    <h5 class="section-title">🛠️ Technologies & Skills</h5>
                                    <div class="skills-grid">
                                        {#each exp.skills as skill, k}
                                            <span 
                                                class="skill-pill"
                                                in:scale={{ duration: 300, delay: k * 50 }}
                                                style="border-color: {exp.color};"
                                            >
                                                {skill}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                                
                                <div class="impact-section">
                                    <h5 class="section-title">💥 Impact</h5>
                                    <p class="impact-text">{exp.impact}</p>
                                </div>
                            </div>
                        {/if}
                        
                        <!-- Interactive Elements -->
                        <div class="card-glow" style="background: radial-gradient(circle, {exp.color}20, transparent);"></div>
                        <div class="expand-indicator">
                            {#if selectedExp === exp}
                                <span class="indicator-text">Click to collapse ↑</span>
                            {:else}
                                <span class="indicator-text">Click to expand ↓</span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>
    
    <!-- Summary Stats -->
    <section class="stats-section" in:fly={{ y: 50, duration: 800, delay: 600, easing: cubicOut }}>
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-number">2</div>
                <div class="stat-label">Companies</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-number">6</div>
                <div class="stat-label">Months Experience</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-number">10+</div>
                <div class="stat-label">Technologies</div>
            </div>
        </div>
    </section>
</main>
{/if}

<style>
/* Global Styles & Variables */
:global(body) {
    overflow-x: hidden;
    background: #0a0a0a;
}

:global(:root) {
    --hacker-green: #00ff00;
    --cyber-blue: #00bfff;
    --neon-pink: #ff0080;
    --electric-purple: #8a2be2;
    --warning-orange: #ff8c00;
}

/* Particle Canvas */
.particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
}

/* Grid Background */
.grid-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.03;
    background-image: 
        linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
    z-index: 0;
}

@keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
}

/* Main Content */
.main-content {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem 1rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* Hero Section */
.hero-section {
    text-align: center;
    margin-bottom: 4rem;
    padding: 2rem 0;
}

.experience-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 
        0 0 10px var(--hacker-green),
        0 0 20px var(--hacker-green),
        0 0 40px var(--hacker-green);
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
    animation: titleGlow 3s ease-in-out infinite alternate;
}

.title-bracket {
    color: var(--cyber-blue);
    text-shadow: 0 0 15px var(--cyber-blue);
    font-size: 1.2em;
    animation: bracketPulse 2s ease-in-out infinite;
}

@keyframes titleGlow {
    0% { text-shadow: 0 0 10px var(--hacker-green), 0 0 20px var(--hacker-green), 0 0 40px var(--hacker-green); }
    100% { text-shadow: 0 0 20px var(--hacker-green), 0 0 30px var(--hacker-green), 0 0 60px var(--hacker-green); }
}

@keyframes bracketPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.title-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 300;
    letter-spacing: 0.05em;
    margin-top: 1rem;
    opacity: 0;
    animation: subtitleFade 2s ease-out 0.5s forwards;
}

@keyframes subtitleFade {
    to { opacity: 1; }
}

/* Timeline Section */
.timeline-section {
    position: relative;
    margin: 4rem 0;
}

.timeline-container {
    position: relative;
    padding: 0 2rem;
}

/* Timeline Line */
.timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, 
        transparent 0%,
        var(--hacker-green) 10%,
        var(--cyber-blue) 50%,
        var(--neon-pink) 90%,
        transparent 100%
    );
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    transform: translateX(-50%);
    z-index: 1;
}

/* Experience Cards */
.experience-card {
    position: relative;
    width: calc(50% - 4rem);
    margin: 3rem 0;
    background: rgba(10, 10, 10, 0.95);
    border: 2px solid transparent;
    border-radius: 15px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    overflow: hidden;
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Alternating card positions */
.experience-card:nth-child(odd) {
    left: 0;
    margin-right: auto;
}

.experience-card:nth-child(even) {
    right: 0;
    margin-left: auto;
}

/* Card States */
.experience-card.hovered {
    transform: translateY(-10px) scale(1.02);
    border-color: var(--exp-color);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.7),
        0 0 30px var(--exp-color);
}

.experience-card.selected {
    transform: translateY(-5px);
    border-color: var(--exp-color);
    box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.6),
        0 0 20px var(--exp-color);
}

/* Timeline Node */
.timeline-node {
    position: absolute;
    top: 2rem;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, var(--exp-color), rgba(0, 0, 0, 0.8));
    border: 3px solid var(--exp-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 0 20px var(--exp-color),
        inset 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 3;
    transition: all 0.3s ease;
}

.experience-card:nth-child(odd) .timeline-node {
    right: -4rem;
    transform: translateX(50%);
}

.experience-card:nth-child(even) .timeline-node {
    left: -4rem;
    transform: translateX(-50%);
}

.node-icon {
    font-size: 1.5rem;
    color: white;
    text-shadow: 0 0 10px currentColor;
}

.node-pulse {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid var(--exp-color);
    border-radius: 50%;
    animation: nodePulse 2s ease-in-out infinite;
    opacity: 0.6;
}

@keyframes nodePulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 0.3; }
}

/* Card Content */
.exp-content {
    position: relative;
    z-index: 2;
}

.exp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.company-info {
    flex: 1;
}

.company-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--exp-color);
    text-shadow: 0 0 15px var(--exp-color);
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.05em;
}

.location {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.duration-badge {
    background: linear-gradient(135deg, var(--exp-color), rgba(255, 255, 255, 0.1));
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
    border: 1px solid var(--exp-color);
    box-shadow: 0 0 15px var(--exp-color);
    white-space: nowrap;
}

.position-info {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1rem;
}

.position-title {
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 0.02em;
}

.exp-type {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Preview Content */
.preview-content {
    margin-bottom: 1rem;
}

.impact-preview {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.skills-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.skill-tag {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.skill-more {
    color: var(--exp-color);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    text-shadow: 0 0 10px var(--exp-color);
}

/* Expanded Content */
.expanded-content {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
    color: var(--exp-color);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-shadow: 0 0 10px var(--exp-color);
}

.achievements-section {
    margin-bottom: 2rem;
}

.achievements-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.achievements-list li {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;
    font-size: 0.95rem;
}

.bullet {
    position: absolute;
    left: 0;
    color: var(--exp-color);
    text-shadow: 0 0 10px var(--exp-color);
    font-size: 0.8rem;
    top: 0.2rem;
}

.skills-section {
    margin-bottom: 2rem;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.skill-pill {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--exp-color);
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.skill-pill:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px var(--exp-color);
}

.impact-section {
    margin-bottom: 1rem;
}

.impact-text {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    font-size: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border-left: 3px solid var(--exp-color);
    font-style: italic;
}

/* Interactive Elements */
.card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
}

.experience-card.hovered .card-glow {
    opacity: 0.3;
}

.expand-indicator {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
}

.experience-card:hover .expand-indicator {
    color: var(--exp-color);
    text-shadow: 0 0 10px var(--exp-color);
}

.indicator-text {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

/* Stats Section */
.stats-section {
    margin-top: 6rem;
    text-align: center;
}

.stats-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    max-width: 600px;
    margin: 0 auto;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 0 0 20px var(--hacker-green);
    font-family: 'Courier New', monospace;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.stat-divider {
    width: 1px;
    height: 50px;
    background: linear-gradient(to bottom, transparent, var(--hacker-green), transparent);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .timeline-line {
        left: 2rem;
    }
    
    .experience-card {
        width: calc(100% - 6rem);
        margin-left: 4rem;
        margin-right: 0;
    }
    
    .experience-card:nth-child(odd),
    .experience-card:nth-child(even) {
        left: 0;
        right: auto;
        margin-left: 4rem;
    }
    
    .timeline-node {
        left: -2rem !important;
        right: auto !important;
        transform: translateX(-50%) !important;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 1rem 0.5rem;
    }
    
    .experience-title {
        font-size: 2rem;
    }
    
    .timeline-container {
        padding: 0 1rem;
    }
    
    .timeline-line {
        left: 1.5rem;
    }
    
    .experience-card {
        width: calc(100% - 4rem);
        margin-left: 3rem;
        padding: 1.5rem;
    }
    
    .timeline-node {
        left: -1.5rem !important;
        width: 50px;
        height: 50px;
    }
    
    .node-icon {
        font-size: 1.2rem;
    }
    
    .exp-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .duration-badge {
        align-self: flex-start;
        margin-top: 0.5rem;
    }
    
    .stats-container {
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .stat-divider {
        width: 50px;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--hacker-green), transparent);
    }
    
    .skills-grid {
        gap: 0.5rem;
    }
    
    .skill-pill {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
    }
}

@media (max-width: 480px) {
    .experience-title {
        font-size: 1.5rem;
    }
    
    .title-subtitle {
        font-size: 1rem;
    }
    
    .experience-card {
        margin-left: 2.5rem;
        width: calc(100% - 3rem);
        padding: 1rem;
    }
    
    .timeline-line {
        left: 1rem;
    }
    
    .timeline-node {
        left: -1rem !important;
        width: 40px;
        height: 40px;
    }
    
    .node-icon {
        font-size: 1rem;
    }
    
    .company-name {
        font-size: 1.2rem;
    }
    
    .position-title {
        font-size: 1.1rem;
    }
}
</style>
