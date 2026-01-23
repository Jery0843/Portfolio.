<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';
import AnimatedIcon from '$lib/components/AnimatedIcons.svelte';

let canvas;
let ctx;
let showContent = false;
let selectedEdu = null;
let hoveredEdu = null;
let particles = [];
let animationFrame;
let mouseX = 0;
let mouseY = 0;

const educations = [
    {
        id: 1,
        institution: "RedTeam Hacker Academy",
        location: "Chennai",
        degree: "Certified Ethical Hacker (CEH v13)",
        duration: "2024 - 2025",
        level: "Professional Certification",
        color: "#ff0080",
        icon: "🛡️",
        status: "In Progress",
        subjects: [
            "Ethical Hacking Fundamentals",
            "Penetration Testing",
            "Vulnerability Assessment",
            "Network Security",
            "Web Application Security",
            "Malware Analysis",
            "Cryptography",
            "Incident Response"
        ],
        skills: ["Penetration Testing", "Vulnerability Assessment", "Network Security", "Web Security", "Incident Response"],
        achievements: [
            "Hands-on experience with industry-standard security tools",
            "Comprehensive understanding of attack vectors and defense mechanisms",
            "Real-world penetration testing scenarios",
            "Advanced threat detection and analysis techniques"
        ],
        grade: "In Progress",
        description: "Comprehensive ethical hacking certification focusing on advanced cybersecurity techniques and defensive strategies."
    },
    {
        id: 2,
        institution: "Loyola College",
        location: "Chennai", 
        degree: "Master of Science in Computer Science",
        duration: "2022 - 2024",
        level: "Master's Degree",
        color: "#00ff80",
        icon: "🎓",
        status: "Completed",
        subjects: [
            "Advanced Data Structures & Algorithms",
            "Machine Learning & AI",
            "Database Management Systems",
            "Computer Networks",
            "Software Engineering",
            "Distributed Systems",
            "Cybersecurity Fundamentals",
            "Research Methodology"
        ],
        skills: ["Machine Learning", "Data Analytics", "Advanced Programming", "Database Design", "Research"],
        achievements: [
            "Maintained consistent academic excellence throughout the program",
            "Completed advanced research projects in machine learning",
            "Specialized in data analytics and cybersecurity domains",
            "Active participation in technical seminars and workshops"
        ],
        grade: "CGPA: 8.5/10",
        description: "Advanced computer science education with focus on emerging technologies and research methodologies."
    },
    {
        id: 3,
        institution: "Loyola College of Arts and Science",
        location: "Mettala",
        degree: "Bachelor of Science in Computer Science",
        duration: "2019 - 2022",
        level: "Bachelor's Degree",
        color: "#00bfff",
        icon: "💻",
        status: "Completed",
        subjects: [
            "Programming Fundamentals",
            "Data Structures & Algorithms",
            "Object-Oriented Programming",
            "Database Management",
            "Web Technologies",
            "Operating Systems",
            "Computer Architecture",
            "Mathematics for Computing"
        ],
        skills: ["Programming", "Web Development", "Database Management", "Problem Solving", "Mathematical Computing"],
        achievements: [
            "Graduated with distinction and top academic performance",
            "Developed strong foundation in computer science principles",
            "Completed multiple programming projects and assignments",
            "Participated in coding competitions and technical events"
        ],
        grade: "Grade: A+",
        description: "Foundational computer science education establishing core programming and analytical skills."
    },
    {
        id: 4,
        institution: "John Britto Matric Hr. Sec. School",
        location: "Salem",
        degree: "Higher Secondary Education",
        duration: "2017 - 2019",
        level: "Higher Secondary",
        color: "#ff8c00",
        icon: "📚",
        status: "Completed",
        subjects: [
            "Computer Science",
            "Mathematics",
            "Physics",
            "Chemistry",
            "English",
            "Tamil"
        ],
        skills: ["Analytical Thinking", "Mathematical Reasoning", "Scientific Method", "Communication"],
        achievements: [
            "Strong academic foundation in science and mathematics",
            "Early exposure to computer science fundamentals",
            "Developed critical thinking and problem-solving abilities",
            "Consistent academic performance throughout the program"
        ],
        grade: "Excellent Performance",
        description: "Secondary education with focus on science and mathematics, laying the groundwork for technical education."
    }
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 5 + 2;
        this.color = color || '#00ff00';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count = 15, color = '#00ff00') {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            x + Math.random() * 40 - 20,
            y + Math.random() * 40 - 20,
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

// Dynamic stats calculations
$: educationStats = {
    qualifications: educations.length,
    subjects: educations.reduce((total, edu) => total + edu.subjects.length, 0),
    // Calculate approximate years of study from durations
    years: educations.reduce((total, edu) => {
        const parts = edu.duration.split(' - ');
        if (parts.length === 2) {
            const startYear = parseInt(parts[0]);
            const endYear = parseInt(parts[1]);
            if (!isNaN(startYear) && !isNaN(endYear)) {
                return total + (endYear - startYear);
            }
        }
        return total + 1;
    }, 0)
};
</script>

<!-- Particle Canvas -->
<canvas bind:this={canvas} class="particle-canvas"></canvas>

<!-- Animated Grid Background -->
<div class="grid-background"></div>

{#if showContent}
<main in:fade={{ duration: 1000 }} class="main-content">
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -50, duration: 800, easing: cubicOut }}>
        <h1 class="education-title">
            <span class="title-bracket">&lt;</span>
            ACADEMIC_JOURNEY
            <span class="title-bracket">/&gt;</span>
        </h1>
        <div class="title-subtitle">Knowledge acquired through formal education and certifications</div>
    </section>

    <!-- Interactive Education Timeline -->
    <section class="timeline-section" in:fly={{ y: 50, duration: 800, delay: 200, easing: cubicOut }}>
        <div class="timeline-container">
            <div class="timeline-line"></div>
            
            {#each educations as edu, i}
                <div 
                    class="education-card"
                    class:selected={selectedEdu === edu}
                    class:hovered={hoveredEdu === edu}
                    style="--edu-color: {edu.color}; --delay: {i * 0.15}s;"
                    in:scale={{ duration: 600, delay: 400 + i * 150, easing: elasticOut }}
                    on:click={() => selectedEdu = selectedEdu === edu ? null : edu}
                    on:mouseenter={(e) => {
                        hoveredEdu = edu;
                        createParticles(
                            e.target.getBoundingClientRect().left + 150,
                            e.target.getBoundingClientRect().top + 80,
                            20,
                            edu.color
                        );
                    }}
                    on:mouseleave={() => hoveredEdu = null}
                    role="button"
                    tabindex="0"
                >
                    <!-- Timeline Node -->
                    <div class="timeline-node">
                        <div class="node-icon" style="filter: drop-shadow(0 0 15px {edu.color});">
                            {edu.icon}
                        </div>
                        <div class="node-pulse"></div>
                    </div>
                    
                    <!-- Education Content -->
                    <div class="edu-content">
                        <div class="edu-header">
                            <div class="institution-info">
                                <h3 class="institution-name">{edu.institution}</h3>
                                <div class="location"><span class="location-icon-wrapper"><AnimatedIcon icon="location" size="1em" /></span> <span>{edu.location}</span></div>
                            </div>
                            <div class="status-badge" class:in-progress={edu.status === 'In Progress'}>
                                {edu.status}
                            </div>
                        </div>
                        
                        <div class="degree-info">
                            <h4 class="degree-title">{edu.degree}</h4>
                            <div class="level-duration">
                                <span class="edu-level">{edu.level}</span>
                                <span class="duration">{edu.duration}</span>
                            </div>
                        </div>
                        
                        <!-- Collapsed View -->
                        {#if selectedEdu !== edu}
                            <div class="preview-content">
                                <p class="description-preview">{edu.description}</p>
                                <div class="grade-preview">{edu.grade}</div>
                                <div class="skills-preview">
                                    {#each edu.skills.slice(0, 3) as skill}
                                        <span class="skill-tag">{skill}</span>
                                    {/each}
                                    {#if edu.skills.length > 3}
                                        <span class="skill-more">+{edu.skills.length - 3} more</span>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                        
                        <!-- Expanded View -->
                        {#if selectedEdu === edu}
                            <div class="expanded-content" in:fade={{ duration: 400 }}>
                                <div class="subjects-section">
                                    <h5 class="section-title">📖 Core Subjects</h5>
                                    <div class="subjects-grid">
                                        {#each edu.subjects as subject, j}
                                            <span 
                                                class="subject-pill"
                                                in:scale={{ duration: 300, delay: j * 50 }}
                                                style="border-color: {edu.color};"
                                            >
                                                {subject}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                                
                                <div class="skills-section">
                                    <h5 class="section-title">🔧 Skills Acquired</h5>
                                    <div class="skills-grid">
                                        {#each edu.skills as skill, k}
                                            <span 
                                                class="skill-pill"
                                                in:scale={{ duration: 300, delay: k * 60 }}
                                                style="background: linear-gradient(135deg, {edu.color}20, transparent); border-color: {edu.color};"
                                            >
                                                {skill}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                                
                                <div class="achievements-section">
                                    <h5 class="section-title">🏆 Key Achievements</h5>
                                    <ul class="achievements-list">
                                        {#each edu.achievements as achievement, l}
                                            <li in:fly={{ x: -20, duration: 300, delay: l * 100 }}>
                                                <span class="bullet">▶</span>
                                                {achievement}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                                
                                <div class="grade-section">
                                    <h5 class="section-title">📊 Academic Performance</h5>
                                    <div class="grade-display">
                                        <div class="grade-value" style="color: {edu.color}; text-shadow: 0 0 15px {edu.color};">
                                            {edu.grade}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                        
                        <!-- Interactive Elements -->
                        <div class="card-glow" style="background: radial-gradient(circle, {edu.color}25, transparent);"></div>
                        <div class="expand-indicator">
                            {#if selectedEdu === edu}
                                <span class="indicator-text">Click to collapse ⬆</span>
                            {:else}
                                <span class="indicator-text">Click to expand ⬇</span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>
    
    <!-- Education Summary Stats -->
    <section class="stats-section" in:fly={{ y: 50, duration: 800, delay: 600, easing: cubicOut }}>
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-number">{educationStats.qualifications}</div>
                <div class="stat-label">Qualifications</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-number">{educationStats.years}+</div>
                <div class="stat-label">Years of Study</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-number">{educationStats.subjects}+</div>
                <div class="stat-label">Core Subjects</div>
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
    background-size: 40px 40px;
    animation: gridMove 25s linear infinite;
    z-index: 0;
}

@keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
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

.education-title {
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
    color: var(--neon-pink);
    text-shadow: 0 0 15px var(--neon-pink);
    font-size: 1.1em;
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
    width: 4px;
    background: linear-gradient(to bottom, 
        transparent 0%,
        var(--neon-pink) 10%,
        var(--hacker-green) 30%,
        var(--cyber-blue) 70%,
        var(--warning-orange) 90%,
        transparent 100%
    );
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
    transform: translateX(-50%);
    z-index: 1;
    border-radius: 2px;
}

/* Education Cards */
.education-card {
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
.education-card:nth-child(odd) {
    left: 0;
    margin-right: auto;
}

.education-card:nth-child(even) {
    right: 0;
    margin-left: auto;
}

/* Card States */
.education-card.hovered {
    transform: translateY(-10px) scale(1.02);
    border-color: var(--edu-color);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.7),
        0 0 30px var(--edu-color);
}

.education-card.selected {
    transform: translateY(-5px);
    border-color: var(--edu-color);
    box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.6),
        0 0 20px var(--edu-color);
}

/* Timeline Node */
.timeline-node {
    position: absolute;
    top: 2rem;
    width: 70px;
    height: 70px;
    background: radial-gradient(circle, var(--edu-color), rgba(0, 0, 0, 0.8));
    border: 3px solid var(--edu-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 0 25px var(--edu-color),
        inset 0 0 15px rgba(0, 0, 0, 0.3);
    z-index: 3;
    transition: all 0.3s ease;
}

.education-card:nth-child(odd) .timeline-node {
    right: -4.5rem;
    transform: translateX(50%);
}

.education-card:nth-child(even) .timeline-node {
    left: -4.5rem;
    transform: translateX(-50%);
}

.node-icon {
    font-size: 1.8rem;
    color: white;
    text-shadow: 0 0 15px currentColor;
}

.node-pulse {
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border: 2px solid var(--edu-color);
    border-radius: 50%;
    animation: nodePulse 2.5s ease-in-out infinite;
    opacity: 0.7;
}

@keyframes nodePulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.3); opacity: 0.3; }
}

/* Card Content */
.edu-content {
    position: relative;
    z-index: 2;
}

.edu-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.institution-info {
    flex: 1;
}

.institution-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--edu-color);
    text-shadow: 0 0 15px var(--edu-color);
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

.status-badge {
    background: linear-gradient(135deg, var(--hacker-green), rgba(255, 255, 255, 0.1));
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
    border: 1px solid var(--hacker-green);
    box-shadow: 0 0 15px var(--hacker-green);
    white-space: nowrap;
}

.status-badge.in-progress {
    background: linear-gradient(135deg, var(--warning-orange), rgba(255, 255, 255, 0.1));
    border-color: var(--warning-orange);
    box-shadow: 0 0 15px var(--warning-orange);
    animation: progressPulse 2s ease-in-out infinite;
}

@keyframes progressPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.degree-info {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1rem;
}

.degree-title {
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    margin-bottom: 0.8rem;
    letter-spacing: 0.02em;
    line-height: 1.4;
}

.level-duration {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
}

.edu-level {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.duration {
    color: var(--edu-color);
    font-family: 'Courier New', monospace;
    font-weight: 600;
    font-size: 0.9rem;
    text-shadow: 0 0 10px var(--edu-color);
}

/* Preview Content */
.preview-content {
    margin-bottom: 1rem;
}

.description-preview {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-style: italic;
}

.grade-preview {
    color: var(--edu-color);
    font-family: 'Courier New', monospace;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px var(--edu-color);
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
    color: var(--edu-color);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    text-shadow: 0 0 10px var(--edu-color);
}

/* Expanded Content */
.expanded-content {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
    color: var(--edu-color);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-shadow: 0 0 10px var(--edu-color);
}

.subjects-section {
    margin-bottom: 2rem;
}

.subjects-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
}

.subject-pill {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    padding: 0.4rem 0.9rem;
    border-radius: 18px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--edu-color);
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
}

.subject-pill:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px var(--edu-color);
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
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--edu-color);
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.skill-pill:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px var(--edu-color);
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
    color: var(--edu-color);
    text-shadow: 0 0 10px var(--edu-color);
    font-size: 0.8rem;
    top: 0.2rem;
}

.grade-section {
    margin-bottom: 1rem;
}

.grade-display {
    text-align: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid var(--edu-color);
}

.grade-value {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.05em;
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

.education-card.hovered .card-glow {
    opacity: 0.4;
}

.expand-indicator {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
}

.education-card:hover .expand-indicator {
    color: var(--edu-color);
    text-shadow: 0 0 10px var(--edu-color);
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
    
    .education-card {
        width: calc(100% - 6rem);
        margin-left: 4rem;
        margin-right: 0;
    }
    
    .education-card:nth-child(odd),
    .education-card:nth-child(even) {
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
    
    .education-title {
        font-size: 2rem;
    }
    
    .timeline-container {
        padding: 0 1rem;
    }
    
    .timeline-line {
        left: 1.5rem;
    }
    
    .education-card {
        width: calc(100% - 4rem);
        margin-left: 3rem;
        padding: 1.5rem;
    }
    
    .timeline-node {
        left: -1.5rem !important;
        width: 60px;
        height: 60px;
    }
    
    .node-icon {
        font-size: 1.4rem;
    }
    
    .edu-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .status-badge {
        align-self: flex-start;
        margin-top: 0.5rem;
    }
    
    .level-duration {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
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
    
    .subjects-grid {
        gap: 0.4rem;
    }
    
    .subject-pill {
        font-size: 0.75rem;
        padding: 0.35rem 0.7rem;
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
    .education-title {
        font-size: 1.5rem;
    }
    
    .title-subtitle {
        font-size: 1rem;
    }
    
    .education-card {
        margin-left: 2.5rem;
        width: calc(100% - 3rem);
        padding: 1rem;
    }
    
    .timeline-line {
        left: 1rem;
    }
    
    .timeline-node {
        left: -1rem !important;
        width: 50px;
        height: 50px;
    }
    
    .node-icon {
        font-size: 1.2rem;
    }
    
    .institution-name {
        font-size: 1.2rem;
    }
    
    .degree-title {
        font-size: 1.1rem;
    }
    
    .subjects-grid,
    .skills-grid {
        gap: 0.3rem;
    }
    
    .subject-pill,
    .skill-pill {
        font-size: 0.7rem;
        padding: 0.3rem 0.6rem;
    }
}
</style>

