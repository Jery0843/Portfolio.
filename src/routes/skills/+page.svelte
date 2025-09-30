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

const categories = [
    { name: 'All', color: '#00ff00', icon: '🌐' },
    { name: 'Offensive Security', color: '#ff0080', icon: '⚔️' },
    { name: 'Programming', color: '#00bfff', icon: '💻' },
    { name: 'Tools & Frameworks', color: '#ff8c00', icon: '🛠️' },
    { name: 'AI & ML', color: '#8a2be2', icon: '🤖' },
    { name: 'Cloud & Infrastructure', color: '#00ff80', icon: '☁️' }
];

const skills = [
    // Offensive Security
    { name: 'Penetration Testing', level: 90, category: 'Offensive Security', icon: '🎯', description: 'Advanced penetration testing and exploit development' },
    { name: 'Web Exploitation', level: 92, category: 'Offensive Security', icon: '🌐', description: 'OWASP Top 10, SQLi, XSS, SSRF, LFI/RFI' },
    { name: 'Binary Exploitation', level: 85, category: 'Offensive Security', icon: '⚡', description: 'Buffer overflows, ROP chains, heap exploitation' },
    { name: 'Reverse Engineering', level: 88, category: 'Offensive Security', icon: '🔧', description: 'Static and dynamic analysis, binary reversing' },
    { name: 'Cryptography', level: 87, category: 'Offensive Security', icon: '🔐', description: 'Crypto attacks, hash cracking, cipher analysis' },
    { name: 'Forensics', level: 83, category: 'Offensive Security', icon: '🔍', description: 'Digital forensics and incident response' },
    { name: 'OSINT', level: 90, category: 'Offensive Security', icon: '🕵️', description: 'Open-source intelligence gathering and analysis' },
    { name: 'Network Security', level: 89, category: 'Offensive Security', icon: '🌐', description: 'Network analysis, monitoring, and defense' },
    { name: 'Privilege Escalation', level: 86, category: 'Offensive Security', icon: '⬆️', description: 'Linux/Windows privilege escalation techniques' },
    { name: 'Social Engineering', level: 80, category: 'Offensive Security', icon: '🎭', description: 'Phishing, pretexting, and human-based attacks' },
    
    // Programming Languages
    { name: 'Python', level: 95, category: 'Programming', icon: '🐍', description: 'Automation, scripting, exploit development' },
    { name: 'Bash/Shell', level: 92, category: 'Programming', icon: '💻', description: 'Shell scripting and automation' },
    { name: 'JavaScript', level: 85, category: 'Programming', icon: '⚡', description: 'Frontend and Node.js development' },
    { name: 'C/C++', level: 78, category: 'Programming', icon: '⚙️', description: 'System programming and exploit development' },
    { name: 'SQL', level: 88, category: 'Programming', icon: '🗄️', description: 'Database querying and SQL injection' },
    { name: 'ASP.NET', level: 82, category: 'Programming', icon: '🌐', description: 'Web application development' },
    { name: 'Go', level: 75, category: 'Programming', icon: '🚀', description: 'Concurrent programming and tooling' },
    
    // Tools & Frameworks
    { name: 'Burp Suite', level: 93, category: 'Tools & Frameworks', icon: '🔥', description: 'Web application security testing' },
    { name: 'Metasploit', level: 90, category: 'Tools & Frameworks', icon: '💣', description: 'Exploitation framework and post-exploitation' },
    { name: 'Nmap', level: 94, category: 'Tools & Frameworks', icon: '📡', description: 'Network scanning and reconnaissance' },
    { name: 'Wireshark', level: 91, category: 'Tools & Frameworks', icon: '🦈', description: 'Network protocol analysis' },
    { name: 'Ghidra', level: 85, category: 'Tools & Frameworks', icon: '👾', description: 'Reverse engineering and disassembly' },
    { name: 'Radare2', level: 82, category: 'Tools & Frameworks', icon: '🔬', description: 'Binary analysis framework' },
    { name: 'IDA Pro', level: 80, category: 'Tools & Frameworks', icon: '🔭', description: 'Interactive disassembler' },
    { name: 'John/Hashcat', level: 88, category: 'Tools & Frameworks', icon: '🔓', description: 'Password cracking and hash analysis' },
    { name: 'pwntools', level: 87, category: 'Tools & Frameworks', icon: '🛠️', description: 'CTF framework and exploit development' },
    { name: 'SQLmap', level: 89, category: 'Tools & Frameworks', icon: '💉', description: 'Automated SQL injection tool' },
    { name: 'Docker', level: 86, category: 'Tools & Frameworks', icon: '🐳', description: 'Containerization and deployment' },
    { name: 'Git', level: 90, category: 'Tools & Frameworks', icon: '📦', description: 'Version control and collaboration' },
    
    // AI & Machine Learning
    { name: 'Machine Learning', level: 85, category: 'AI & ML', icon: '🧠', description: 'ML algorithms and model training' },
    { name: 'Neural Networks', level: 82, category: 'AI & ML', icon: '🕸️', description: 'Deep learning and neural architectures' },
    { name: 'Anomaly Detection', level: 88, category: 'AI & ML', icon: '🔍', description: 'ML-based threat detection' },
    { name: 'AI Security', level: 83, category: 'AI & ML', icon: '🛡️', description: 'Securing AI systems and adversarial ML' },
    { name: 'Data Analysis', level: 87, category: 'AI & ML', icon: '📊', description: 'Data processing and statistical analysis' },
    { name: 'Scikit-learn', level: 84, category: 'AI & ML', icon: '📈', description: 'ML library for Python' },
    { name: 'TensorFlow', level: 78, category: 'AI & ML', icon: '🔷', description: 'Deep learning framework' },
    { name: 'Pandas/NumPy', level: 86, category: 'AI & ML', icon: '🐼', description: 'Data manipulation libraries' },
    
    // Cloud & Infrastructure
    { name: 'AWS', level: 85, category: 'Cloud & Infrastructure', icon: '☁️', description: 'Amazon Web Services infrastructure' },
    { name: 'Linux Administration', level: 93, category: 'Cloud & Infrastructure', icon: '🐧', description: 'Linux system administration and hardening' },
    { name: 'Kali Linux', level: 95, category: 'Cloud & Infrastructure', icon: '🐉', description: 'Penetration testing distribution' },
    { name: 'Active Directory', level: 80, category: 'Cloud & Infrastructure', icon: '🏢', description: 'AD enumeration and exploitation' },
    { name: 'Cloud Security', level: 82, category: 'Cloud & Infrastructure', icon: '🔒', description: 'Cloud security best practices' },
    { name: 'GCP', level: 78, category: 'Cloud & Infrastructure', icon: '☁️', description: 'Google Cloud Platform' },
    { name: 'CI/CD', level: 81, category: 'Cloud & Infrastructure', icon: '🔄', description: 'Continuous integration and deployment' },
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 4 + 2;
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
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animateParticles() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ambient particles
    if (Math.random() < 0.015) {
        const colors = ['#00ff00', '#ff0080', '#00bfff', '#ff8c00', '#8a2be2'];
        createParticles(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
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
    animateParticles();
    
    return () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
});
</script>

<!-- Particle Canvas -->
<canvas bind:this={canvas} class="particle-canvas"></canvas>

{#if visible}
<main in:fade={{ duration: 1000 }} class="main-container">
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -50, duration: 800, easing: cubicOut }}>
        <h1 class="skills-title">
            <span class="bracket">{'<'}</span>
            <span class="main-text">SKILLS</span>
            <span class="bracket">{'/>'}</span>
        </h1>
        <p class="subtitle">Technical expertise and professional capabilities</p>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" in:fly={{ y: 30, duration: 600, delay: 200, easing: cubicOut }}>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{skillStats.total}</div>
                <div class="stat-label">Total Skills</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-card">
                <div class="stat-number">{skillStats.categories}</div>
                <div class="stat-label">Categories</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-card">
                <div class="stat-number">{skillStats.avgLevel}%</div>
                <div class="stat-label">Avg Proficiency</div>
            </div>
        </div>
    </section>

    <!-- Category Filter -->
    <section class="filter-section" in:fly={{ y: 30, duration: 600, delay: 300, easing: cubicOut }}>
        <div class="filter-container">
            <div class="filter-label">SELECT_CATEGORY:</div>
            <div class="category-buttons">
                {#each categories as category, i}
                    <button 
                        class="category-btn"
                        class:active={selectedCategory === category.name}
                        style="--category-color: {category.color};"
                        in:scale={{ duration: 300, delay: 400 + i * 100, easing: elasticOut }}
                        on:click={() => selectedCategory = category.name}
                        on:mouseenter={() => createParticles(window.innerWidth / 2, window.innerHeight / 2, 8, category.color)}
                    >
                        <span class="cat-icon">{category.icon}</span>
                        <span class="cat-name">{category.name.toUpperCase().replace(' ', '_')}</span>
                    </button>
                {/each}
            </div>
        </div>
    </section>

    <!-- Skills Grid -->
    <section class="skills-section" in:fly={{ y: 50, duration: 800, delay: 500, easing: cubicOut }}>
        <div class="skills-grid">
            {#each filteredSkills as skill, i}
                <div 
                    class="skill-hex"
                    class:hovered={hoveredSkill === skill}
                    style="--skill-level: {skill.level}%; --index: {i};"
                    in:scale={{ duration: 400, delay: 600 + i * 30, easing: elasticOut }}
                    on:mouseenter={() => {
                        hoveredSkill = skill;
                        const categoryColor = categories.find(c => c.name === skill.category)?.color || '#00ff00';
                        createParticles(window.innerWidth / 2, window.innerHeight / 2, 15, categoryColor);
                    }}
                    on:mouseleave={() => hoveredSkill = null}
                    role="button"
                    tabindex="0"
                >
                    <div class="hex-inner">
                        <div class="hex-content">
                            <div class="skill-icon">{skill.icon}</div>
                            <div class="skill-name">{skill.name}</div>
                            <div class="skill-level-num">{skill.level}%</div>
                        </div>
                        
                        <!-- Circular Progress -->
                        <svg class="progress-ring" viewBox="0 0 100 100">
                            <circle class="progress-ring-bg" cx="50" cy="50" r="45" />
                            <circle 
                                class="progress-ring-fill" 
                                cx="50" 
                                cy="50" 
                                r="45"
                                style="--progress: {(283 - (283 * skill.level) / 100)};"
                            />
                        </svg>
                        
                        <!-- Hover Tooltip -->
                        {#if hoveredSkill === skill}
                            <div class="skill-tooltip" in:scale={{ duration: 200 }}>
                                <div class="tooltip-title">{skill.name}</div>
                                <div class="tooltip-desc">{skill.description}</div>
                                <div class="tooltip-category">{skill.category}</div>
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

/* Main Container */
.main-container {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem 1rem;
    max-width: 1800px;
    margin: 0 auto;
}

/* Hero Section */
.hero-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
}

.skills-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 
        0 0 10px var(--hacker-green),
        0 0 20px var(--hacker-green),
        0 0 40px var(--hacker-green);
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
    animation: titlePulse 3s ease-in-out infinite alternate;
}

@keyframes titlePulse {
    0% { text-shadow: 0 0 10px var(--hacker-green), 0 0 20px var(--hacker-green); }
    100% { text-shadow: 0 0 20px var(--hacker-green), 0 0 40px var(--hacker-green), 0 0 60px var(--hacker-green); }
}

.bracket {
    color: var(--cyber-blue);
    text-shadow: 0 0 15px var(--cyber-blue);
}

.main-text {
    display: inline-block;
}

.subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
    letter-spacing: 0.05em;
}

/* Stats Section */
.stats-section {
    margin-bottom: 3rem;
}

.stats-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: rgba(0, 255, 0, 0.03);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    max-width: 800px;
    margin: 0 auto;
}

.stat-card {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 0 0 15px var(--hacker-green);
    font-family: 'Courier New', monospace;
}

.stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.5rem;
}

.stat-divider {
    width: 2px;
    height: 60px;
    background: linear-gradient(to bottom, transparent, var(--hacker-green), transparent);
    opacity: 0.3;
}

/* Filter Section */
.filter-section {
    margin-bottom: 4rem;
}

.filter-container {
    text-align: center;
}

.filter-label {
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: var(--hacker-green);
    text-shadow: 0 0 10px var(--hacker-green);
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
}

.category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
}

.category-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(10, 10, 10, 0.9);
    border: 2px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.9rem 1.8rem;
    border-radius: 30px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
}

.category-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--category-color), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.category-btn:hover {
    border-color: var(--category-color);
    color: var(--category-color);
    text-shadow: 0 0 10px var(--category-color);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px var(--category-color);
}

.category-btn:hover::before {
    opacity: 0.1;
}

.category-btn.active {
    background: linear-gradient(135deg, var(--category-color), rgba(0, 0, 0, 0.8));
    border-color: var(--category-color);
    color: #fff;
    box-shadow: 0 0 30px var(--category-color);
}

.cat-icon {
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
}

.cat-name {
    position: relative;
    z-index: 1;
}

/* Skills Section */
.skills-section {
    margin: 4rem 0;
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 2.5rem;
    padding: 2rem 0;
    justify-items: center;
}

/* Hexagonal Skill Card */
.skill-hex {
    position: relative;
    width: 180px;
    height: 180px;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: hexFloat 3s ease-in-out infinite;
    animation-delay: calc(var(--index) * 0.1s);
}

@keyframes hexFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.skill-hex:hover {
    transform: scale(1.15) translateY(-15px) !important;
    z-index: 10;
}

.hex-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.95);
    border: 2px solid rgba(0, 255, 0, 0.3);
    border-radius: 15px;
    padding: 1.5rem;
    backdrop-filter: blur(15px);
    overflow: visible;
    transition: all 0.3s ease;
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.skill-hex:hover .hex-inner {
    border-color: var(--hacker-green);
    background: rgba(0, 255, 0, 0.05);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.6),
        0 0 40px var(--hacker-green),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.hex-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    position: relative;
    z-index: 2;
}

.skill-icon {
    font-size: 3rem;
    margin-bottom: 0.75rem;
    filter: drop-shadow(0 0 10px var(--hacker-green));
}

.skill-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.skill-level-num {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 0 0 10px var(--hacker-green);
    font-family: 'Courier New', monospace;
}

/* Circular Progress Ring */
.progress-ring {
    position: absolute;
    inset: -3px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    pointer-events: none;
    transform: rotate(-90deg);
}

.progress-ring-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 2;
}

.progress-ring-fill {
    fill: none;
    stroke: var(--hacker-green);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 283;
    stroke-dashoffset: var(--progress);
    filter: drop-shadow(0 0 8px var(--hacker-green));
    transition: stroke-dashoffset 1s ease-out;
}

.skill-hex:hover .progress-ring-fill {
    stroke-width: 3;
    filter: drop-shadow(0 0 15px var(--hacker-green));
}

/* Tooltip */
.skill-tooltip {
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid var(--hacker-green);
    border-radius: 10px;
    padding: 1rem;
    min-width: 250px;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px var(--hacker-green);
    backdrop-filter: blur(10px);
}

.tooltip-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--hacker-green);
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px var(--hacker-green);
}

.tooltip-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.tooltip-category {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .skills-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 2rem; }
    .skill-hex { width: 160px; height: 160px; }
}

@media (max-width: 768px) {
    .main-container { padding: 1.5rem 0.75rem; }
    .stats-grid { flex-direction: column; gap: 1.5rem; padding: 1.5rem; }
    .stat-divider { width: 60px; height: 2px; }
    .category-buttons { gap: 0.75rem; }
    .category-btn { padding: 0.75rem 1.5rem; font-size: 0.85rem; }
    .skills-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; }
    .skill-hex { width: 140px; height: 140px; }
    .skill-icon { font-size: 2.5rem; }
    .skill-name { font-size: 0.85rem; }
    .skill-tooltip { min-width: 200px; }
}

@media (max-width: 480px) {
    .skills-title { font-size: 2rem; }
    .skills-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1.25rem; }
    .skill-hex { width: 120px; height: 120px; }
    .hex-inner { padding: 1rem; }
    .skill-icon { font-size: 2rem; }
    .skill-name { font-size: 0.75rem; }
    .skill-level-num { font-size: 0.95rem; }
}
</style>

