<script>
import { onMount, onDestroy } from 'svelte';
import { fade, fly, scale, crossfade } from 'svelte/transition';
import { cubicOut, elasticOut, cubicInOut } from 'svelte/easing';

let visible = false;
let canvas;
let gl;
let program;
let animationFrame;
let hoveredSkill = null;
let selectedCategory = 'All';
let mouseX = 0.5;
let mouseY = 0.5;
let startTime;

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

// --- WebGL Logic ---
const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // Pseudo-random function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Noise function
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;
        
        // Mouse warp effect
        vec2 mouse = u_mouse * vec2(u_resolution.x/u_resolution.y, 1.0);
        float dist = distance(st, mouse);
        float warp = smoothstep(0.5, 0.0, dist) * 0.1;
        st += warp;

        // Neural Matrix Grid
        float size = 10.0;
        vec2 grid = fract(st * size);
        vec2 cell = floor(st * size);
        
        float n = noise(cell + u_time * 0.1);
        float brightness = smoothstep(0.8, 1.0, sin(n * 6.28 + u_time)) * 0.5;
        
        // Data streams
        float stream = step(0.98, random(vec2(cell.x, floor(u_time * 2.0 + cell.y * 0.2))));
        brightness += stream * 0.8;

        // Color palette
        vec3 color = vec3(0.0);
        color += vec3(0.0, 1.0, 0.4) * brightness; // Cyber Green
        color += vec3(0.0, 0.5, 1.0) * (1.0 - brightness) * 0.05; // Deep Blue ambient

        // Vignette
        float vignette = smoothstep(1.2, 0.2, distance(gl_FragCoord.xy / u_resolution.xy, vec2(0.5)));
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
    }
`;

function initWebGL() {
    gl = canvas.getContext('webgl');
    if (!gl) return;

    // Create Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    program = createProgram(gl, vertexShader, fragmentShader);

    // Set up geometry (full screen quad)
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ]), gl.STATIC_DRAW);

    // Resize handler
    resize();
    window.addEventListener('resize', resize);
    startTime = Date.now();

    render();
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function render() {
    if (!gl || !program) return;

    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mouseX, 1.0 - mouseY); // Flip Y for shader coords

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationFrame = requestAnimationFrame(render);
}

// Kinetic Type Effect
function animateText(node, text) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    let iterations = 0;
    const interval = setInterval(() => {
        node.innerText = text.split('').map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        
        if (iterations >= text.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

function handleMouseMove(e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
    
    // Tilt effect for cards
    document.querySelectorAll('.skill-card-3d').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - cardX) / 20;
        const deltaY = (e.clientY - cardY) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(1.02, 1.02, 1.02)`;
    });
}

function handleMouseLeave() {
    document.querySelectorAll('.skill-card-3d').forEach(card => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
}

// Synaptic Lines Drawing
let synapticLines = [];

function drawSynapticLines(categoryId) {
    // Clear old lines
    synapticLines = [];
}

onMount(() => {
    initWebGL();
    setTimeout(() => visible = true, 300);
    
    // Animate title
    const titleElement = document.querySelector('.glitch-text');
    if(titleElement) animateText(titleElement, 'SKILL_MATRIX_V2.0');

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        cancelAnimationFrame(animationFrame);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', resize);
    };
});
</script>

<canvas bind:this={canvas} class="webgl-canvas"></canvas>

{#if visible}
<main in:fade={{ duration: 1500 }} class="main-container">
    
    <!-- Ultra Header -->
    <section class="header-section">
        <div class="hologram-projector">
            <h1 class="mega-title">
                <span class="prefix">SYSTEM://</span>
                <span class="glitch-text" data-text="SKILL_MATRIX">LOADING...</span>
                <span class="cursor">_</span>
            </h1>
            <div class="subtitle-bar">
                <div class="bar-fill"></div>
                <span class="bar-text">NEURAL SYNCHRONIZATION: 100%</span>
            </div>
        </div>
    </section>

    <!-- Stats HUD -->
    <section class="hud-stats">
        <div class="hud-panel glass-panel">
             <div class="hud-data">
                <span class="hud-label">CAPABILITIES</span>
                <span class="hud-value">{skillStats.total}</span>
             </div>
             <div class="hud-graph">
                 {#each Array(10) as _, i}
                    <div class="graph-bar" style="height: {Math.random() * 100}%; animation-delay: {i * 0.1}s"></div>
                 {/each}
             </div>
        </div>
        <div class="hud-panel glass-panel center-panel">
            <div class="radar-scan"></div>
            <span class="hud-alert blink">SYSTEM OPTIMAL</span>
        </div>
        <div class="hud-panel glass-panel">
            <div class="hud-data">
                <span class="hud-label">PROFICIENCY</span>
                <span class="hud-value">{skillStats.avgLevel}%</span>
             </div>
             <div class="hex-grid-mini"></div>
        </div>
    </section>

    <!-- Command Deck -->
    <section class="command-deck">
        <div class="deck-interface glass-panel">
            <div class="deck-header">
                <span class="icon">⬢</span> SELECT_PROTOCOL
            </div>
            <div class="category-grid">
                {#each categories as category, i}
                    <button 
                        class="deck-btn"
                        class:active={selectedCategory === category.name}
                        style="--cat-color: {category.color}"
                        on:click={() => selectedCategory = category.name}
                    >
                        <div class="btn-bg"></div>
                        <span class="btn-icon">{category.icon}</span>
                        <span class="btn-text">{category.name}</span>
                        <div class="btn-border"></div>
                    </button>
                {/each}
            </div>
        </div>
    </section>

    <!-- Quantum Grid -->
    <section class="quantum-grid">
        {#each filteredSkills as skill, i (skill.name)}
            <div 
                class="quantum-card skill-card-3d"
                class:active={hoveredSkill === skill}
                style="--card-color: {categories.find(c => c.name === skill.category)?.color || '#fff'}; --delay: {i * 0.05}s"
                in:scale={{ duration: 600, delay: i * 50, easing: elasticOut }}
                on:mouseenter={() => hoveredSkill = skill}
                on:mouseleave={() => { hoveredSkill = null; handleMouseLeave(); }}
                role="button"
                tabindex="0"
            >
                <div class="glass-surface"></div>
                <div class="neon-border"></div>
                
                <div class="card-content">
                    <div class="icon-chamber">
                        <div class="icon-glow"></div>
                        <span class="skill-icon">{skill.icon}</span>
                    </div>
                    
                    <div class="info-module">
                        <h3 class="skill-name">{skill.name}</h3>
                        <div class="data-row">
                            <span class="data-label">PWR_LVL</span>
                            <span class="data-value">{skill.level}%</span>
                        </div>
                        <div class="power-bar-container">
                            <div class="power-bar-fill" style="width: {skill.level}%; background: var(--card-color)">
                                <div class="power-particles"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {#if hoveredSkill === skill}
                    <div class="hologram-details" in:fly={{ y: 20, duration: 300 }}>
                        <div class="scan-line-overlay"></div>
                        <p class="desc-text">{skill.description}</p>
                        <span class="cat-tag">{skill.category}</span>
                    </div>
                {/if}
            </div>
        {/each}
    </section>

</main>
{/if}

<style>
/* --- Core Variables --- */
:global(:root) {
    --neon-green: #00ff41;
    --neon-blue: #0088ff;
    --neon-pink: #ff0055;
    --dark-void: #020202;
    --glass-bg: rgba(10, 10, 15, 0.6);
    --glass-border: rgba(255, 255, 255, 0.1);
}

:global(body) {
    background: var(--dark-void);
    color: #fff;
    overflow-x: hidden;
}

/* --- WebGL Canvas --- */
.webgl-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
}

.main-container {
    position: relative;
    z-index: 10;
    max-width: 1800px;
    margin: 0 auto;
    padding: 2rem;
}

/* --- Mega Header --- */
.header-section {
    text-align: center;
    margin-bottom: 5rem;
    padding-top: 3rem;
}

.mega-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(2.5rem, 5vw, 6rem);
    font-weight: 900;
    letter-spacing: -2px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    text-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
}

.prefix {
    color: var(--glass-border);
    font-size: 0.5em;
    vertical-align: top;
}

.glitch-text {
    color: #fff;
    position: relative;
}

.cursor {
    color: var(--neon-green);
    animation: blink 0.8s infinite;
}

.subtitle-bar {
    width: 300px;
    height: 24px;
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid var(--neon-green);
    margin: 1rem auto;
    position: relative;
    overflow: hidden;
    skew: -20deg;
}

.bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: repeating-linear-gradient(
        45deg,
        var(--neon-green),
        var(--neon-green) 10px,
        transparent 10px,
        transparent 20px
    );
    opacity: 0.3;
    animation: loadBar 2s linear infinite;
}

.bar-text {
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 22px;
    font-size: 0.8rem;
    font-family: 'Courier New', monospace;
    color: var(--neon-green);
    font-weight: 700;
}

/* --- HUD Stats --- */
.hud-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 5rem;
    flex-wrap: wrap;
}

.glass-panel {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    position: relative;
    overflow: hidden;
}

.glass-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shine 5s infinite;
}

.hud-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 250px;
}

.hud-value {
    font-size: 3rem;
    font-weight: 800;
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 20px rgba(255,255,255,0.5);
}

.hud-graph {
    display: flex;
    gap: 4px;
    height: 40px;
    align-items: flex-end;
    margin-top: 1rem;
}

.graph-bar {
    width: 6px;
    background: var(--neon-green);
    animation: eqAnim 1s infinite alternate;
}

.center-panel {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid rgba(0, 255, 65, 0.3);
}

.radar-scan {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg, transparent 270deg, rgba(0, 255, 65, 0.2));
    border-radius: 50%;
    animation: rotate 4s linear infinite;
}

.hud-alert {
    color: var(--neon-green);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
}

/* --- Command Deck --- */
.command-deck {
    margin-bottom: 4rem;
    display: flex;
    justify-content: center;
}

.deck-interface {
    padding: 2rem;
    border-radius: 20px;
    max-width: 1200px;
    width: 100%;
}

.deck-header {
    font-family: 'Courier New';
    color: rgba(255,255,255,0.6);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    letter-spacing: 2px;
}

.category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.deck-btn {
    position: relative;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-family: 'Courier New', monospace;
    color: rgba(255,255,255,0.7);
    font-weight: 700;
    transition: all 0.3s;
}

.btn-bg {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.02);
    transform: skew(-15deg);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s;
}

.deck-btn:hover .btn-bg, .deck-btn.active .btn-bg {
    background: rgba(var(--cat-color), 0.1);
    border-color: var(--cat-color);
    box-shadow: 0 0 15px var(--cat-color);
}

.btn-text, .btn-icon {
    position: relative;
    z-index: 2;
}

/* --- Quantum Grid --- */
.quantum-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2.5rem;
    perspective: 2000px;
}

.quantum-card {
    position: relative;
    height: 200px;
    background: rgba(10, 10, 10, 0.4);
    border-radius: 16px;
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out; /* Smooth JS tilt */
    cursor: pointer;
}

.glass-surface {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
}

.neon-border {
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: linear-gradient(45deg, var(--card-color), transparent, var(--card-color));
    opacity: 0;
    transition: opacity 0.3s;
    filter: blur(10px);
    z-index: -1;
}

.quantum-card:hover .neon-border {
    opacity: 0.6;
}

.card-content {
    position: relative;
    z-index: 2;
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.icon-chamber {
    width: 60px;
    height: 60px;
    background: rgba(0,0,0,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid rgba(255,255,255,0.1);
}

.skill-icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 10px var(--card-color));
}

.skill-name {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.power-bar-container {
    height: 4px;
    background: rgba(255,255,255,0.1);
    margin-top: 0.5rem;
    border-radius: 2px;
    overflow: hidden;
}

.power-bar-fill {
    height: 100%;
    box-shadow: 0 0 10px currentColor;
}

/* Hologram Details Overlay */
.hologram-details {
    position: absolute;
    inset: 0;
    background: rgba(5, 5, 5, 0.95);
    border-radius: 16px;
    padding: 2rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid var(--card-color);
    box-shadow: 0 0 30px var(--card-color);
}

.scan-line-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.5;
}

.desc-text {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
}

.cat-tag {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: var(--card-color);
    letter-spacing: 2px;
    position: relative;
    z-index: 2;
}

/* --- Animations --- */
@keyframes blink { 50% { opacity: 0; } }
@keyframes loadBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes shine { 0% { left: -100%; } 20% { left: 100%; } 100% { left: 100%; } }
@keyframes eqAnim { 0% { height: 20%; } 100% { height: 90%; } }

@media (max-width: 768px) {
    .header-section { margin-bottom: 3rem; }
    .mega-title { font-size: 3rem; }
    .stats-hud { flex-direction: column; }
    .glass-panel { width: 100%; }
    .center-panel { display: none; }
}
</style>
