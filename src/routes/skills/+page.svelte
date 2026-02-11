<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

let visible = $state(false);
let canvas = $state();
let context;
let width;
let height;
let matrix;
let hoveredSkill = $state(null);
let selectedCategory = $state('All');

// Matrix Background Setup
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const fontSize = 10;
let drops = [];

function draw() {
    if (!context) return;
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, width, height);
    
    context.fillStyle = '#0F0';
    context.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        context.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

function initMatrix() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    drops = [];
    for (let i = 0; i < width / fontSize; i++) {
        drops[i] = 1;
    }
}

// Data
const categories = [
    { name: 'All', color: '#00ff00', icon: '🌐' },
    { name: 'Offensive Security', color: '#ff0080', icon: '⚔️' },
    { name: 'Web Development', color: '#ff6b00', icon: '⚡' },
    { name: 'Full Stack Development', color: '#00ff80', icon: '🔄' },
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
    
    // Web Development
    { name: 'Angular', level: 85, category: 'Web Development', icon: '🅰️', description: 'Component-based architecture, RxJS, NgRx' },
    { name: 'HTML5/CSS3', level: 95, category: 'Web Development', icon: '🎨', description: 'Semantic HTML, Flexbox, Grid, Animations' },
    { name: 'JavaScript', level: 92, category: 'Web Development', icon: '📜', description: 'ES6+, Asynchronous programming, DOM manipulation' },
    { name: 'Svelte', level: 90, category: 'Web Development', icon: '🔥', description: 'Reactive components, state management, transitions' },
    { name: 'TailwindCSS', level: 94, category: 'Web Development', icon: '🌊', description: 'Utility-first CSS, custom design systems' },
    { name: 'ASP.NET', level: 82, category: 'Web Development', icon: '🌐', description: 'Web application development' },

    // Full Stack Development
    { name: 'Next.js', level: 88, category: 'Full Stack Development', icon: '▲', description: 'SSR, ISR, API Routes, Middleware' },
    { name: 'Node.js', level: 90, category: 'Full Stack Development', icon: '🟢', description: 'Event-driven architecture, RESTful APIs' },
    { name: 'Express', level: 89, category: 'Full Stack Development', icon: '🚂', description: 'Middleware development, routing' },
    { name: 'MongoDB', level: 86, category: 'Full Stack Development', icon: '🍃', description: 'NoSQL schema design, aggregation pipelines' },
    { name: 'PostgreSQL', level: 85, category: 'Full Stack Development', icon: '🐘', description: 'Relational modelling, advanced queries' },
    { name: 'API Design', level: 88, category: 'Full Stack Development', icon: '🔌', description: 'REST, GraphQL, OpenAPI specification' },

    // Programming
    { name: 'Python', level: 95, category: 'Programming', icon: '🐍', description: 'Automation, scripting, exploit development' },
    { name: 'Bash/Shell', level: 92, category: 'Programming', icon: '💻', description: 'Shell scripting and automation' },
    { name: 'C/C++', level: 78, category: 'Programming', icon: '⚙️', description: 'System programming and exploit development' },
    { name: 'SQL', level: 88, category: 'Programming', icon: '🗄️', description: 'Database querying and SQL injection' },
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

    // AI & ML
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
    { name: 'CI/CD', level: 81, category: 'Cloud & Infrastructure', icon: '🔄', description: 'Continuous integration and deployment' }
];

let filteredSkills = $derived(selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory));

let skillStats = $derived({
    total: skills.length,
    categories: categories.length - 1,
    avgLevel: Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
});

onMount(() => {
    context = canvas.getContext('2d');
    initMatrix();
    matrix = setInterval(draw, 35);
    
    setTimeout(() => visible = true, 300);
    
    const resizeHandler = () => initMatrix();
    window.addEventListener('resize', resizeHandler);

    return () => {
        clearInterval(matrix);
        window.removeEventListener('resize', resizeHandler);
    };
});
</script>

<!-- SEO Meta Tags -->
<SEO 
    title="Technical Skills Matrix - Jerome Andrew K"
    description="Comprehensive technical skills of Jerome Andrew K including offensive security, web development, AI/ML, and cloud infrastructure."
    keywords="skills, technical skills, penetration testing, web development, Python, cybersecurity, Jerome Andrew K"
    canonical="https://jerome.co.in/skills"
    datePublished="2024-01-01"
    dateModified="2026-02-11"
    speakable={true}
/>
<BreadcrumbSchema pageName="Skills" pageUrl="/skills" />

<canvas bind:this={canvas} class="matrix-canvas"></canvas>

{#if visible}
<main in:fade={{ duration: 1000 }} class="main-container">
    
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -30, duration: 800, easing: cubicOut }}>
        <h1 class="page-title">
            <span class="code-bracket">{'<'}</span>
            SKILLS_MATRIX
            <span class="code-bracket">{'/>'}</span>
        </h1>
        <p class="subtitle">Comprehensive Technical Arsenal</p>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar glass-panel" in:fly={{ y: 20, duration: 600, delay: 200, easing: cubicOut }}>
        <div class="stat-item">
            <div class="stat-value">{skillStats.total}</div>
            <div class="stat-label">Total Skills</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <div class="stat-value">{skillStats.categories}</div>
            <div class="stat-label">Categories</div>
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
                    onclick={() => selectedCategory = category.name}
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
                onmouseenter={() => hoveredSkill = skill}
                onmouseleave={() => hoveredSkill = null}
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
    background: #000;
    color: #fff;
    overflow-x: hidden;
}

.matrix-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    opacity: 0.3;
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
    background: rgba(10, 10, 10, 0.7);
    border: 1px solid rgba(0, 255, 0, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
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
    color: #00ff00;
    text-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.code-bracket {
    color: #00bfff; 
    font-weight: 300;
}

.subtitle {
    color: rgba(255, 255, 255, 0.7);
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
    font-size: 2.2rem;
    font-weight: 800;
    font-family: 'Courier New', monospace;
    color: #00ff00;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.stat-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 1px;
    margin-top: 0.3rem;
}

.stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(0, 255, 0, 0.2);
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
    padding: 0.7rem 1.4rem;
    background: rgba(0, 10, 0, 0.6);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    cursor: pointer;
    font-family: 'Courier New', monospace;
    transition: all 0.2s ease;
}

.filter-chip:hover, .filter-chip.active {
    background: rgba(0, 255, 0, 0.15);
    border-color: #00ff00;
    color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05);
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
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-icon {
    font-size: 1.8rem;
    filter: drop-shadow(0 0 5px var(--accent-color));
}

.skill-level {
    font-family: 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent-color);
    font-size: 1.1rem;
    text-shadow: 0 0 10px var(--accent-color);
}

.card-body h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
}

.skill-category {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0.2rem 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.progress-track {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    border-radius: 3px;
    box-shadow: 0 0 10px var(--accent-color);
}

.card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(5, 5, 5, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid var(--accent-color);
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
