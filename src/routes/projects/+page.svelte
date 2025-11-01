<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';
import SEO from '$lib/components/SEO.svelte';

let canvas;
let ctx;
let showContent = false;
let selectedProject = null;
let hoveredProject = null;
let particles = [];
let animationFrame;
let mouseX = 0;
let mouseY = 0;
let filterType = 'all';
let primaryView = 'projects';

const projects = [
      {
  "id": 9,
  "title": "Hack The Boo CTF 2025",
  "category": "Capture The Flag",
  "url": "https://pub-113bc69380eb4f6a984dc329fbd14c58.r2.dev/HackTheBoo.pdf",
  "duration": "Oct 24–27, 2025",
  "affiliation": "HackTheBox (Secure-Hive)",
  "color": "#ff7a18",
  "icon": "🏅",
  "difficulty": "Advanced",
  "status": "Completed",
  "overview": "Participated with team Secure-Hive in HackTheBox's Hack The Boo CTF (24–27 Oct 2025). Solved 15 out of 23 challenges across multiple categories (Web, Crypto, Reversing, Forensics, and Pwn). Focused on rapid triage, exploit prototyping, automation of tooling, and producing clear write-ups for learning and portfolio.",
  "technologies": [
    "Kali Linux",
    "Burp Suite",
    "Nmap",
    "Wireshark",
    "Ghidra",
    "Radare2",
    "pwntools",
    "John / Hashcat",
    "Python",
    "Bash",
    "Docker"
  ],
  "achievements": [
    "Solved 15 out of 23 challenges across multiple categories",
    "Ranked 265th out of 2,893 teams with a total of 7,075 points",
    "Represented team 'Secure-Hive' and contributed consistently to team progress",
    "Attached certificate of participation for verification"
  ],
  "skills": [
    "Exploit development and tooling automation",
    "Reverse engineering & binary analysis",
    "Applied cryptography and forensic investigation",
    "Web exploitation and network analysis",
    "Rapid triage under time-constrained competition",
    "Team coordination and documentation of findings"
  ],
  "impact": "Enhanced hands-on offensive security capabilities by solving realistic CTF challenges. Strengthened teamwork, rapid exploit prototyping, forensic analysis, and produced reusable notes and write-ups to improve efficiency in future competitions."
},
     {
  "id": 8,
  "title": "QnQSec CTF 2025",
  "category": "Capture The Flag",
  "url": "#",
  "duration": "Oct 2025",
  "affiliation": "QnQSec CTF (Individual Participant – Team Secure-Hive)",
  "color": "#8a2be2",
  "icon": "🏴‍☠️",
  "difficulty": "Advanced",
  "status": "Completed",
  "overview": "Participated individually in the 48-hour QnQSec CTF 2025 (17–19 Oct 2025) under the team name 'Secure-Hive'. Solved a variety of challenges across OSINT, Warmup, Misc, Hardware, and Pwn categories — emphasizing analytical thinking, reverse engineering, and system exploitation. Focused on end-to-end challenge solving, from reconnaissance to payload crafting, while maintaining detailed documentation for post-event learning.",
  "technologies": [
    "Kali Linux",
    "Ghidra",
    "pwntools",
    "Nmap",
    "Burp Suite",
    "Wireshark",
    "Python",
    "Bash",
    "Docker",
    "Radare2"
  ],
  "achievements": [
    "Ranked 247th out of global participants with a total score of 550 points",
    "Solved 10+ challenges spanning OSINT, Pwn, Warmup, Misc, and Hardware categories",
    "Maintained consistent progress across the 48-hour event while documenting challenge solutions",
    "Individually represented team 'Secure-Hive' with handle '0xJerry'"
  ],
  "skills": [
    "Reverse engineering and exploit development",
    "OSINT and information correlation",
    "Binary and firmware analysis",
    "Hardware interfacing and debugging basics",
    "CTF strategy and time-constrained problem solving",
    "Clear documentation and write-up creation"
  ],
  "impact": "Significantly improved proficiency in practical cybersecurity problem solving through hands-on challenges across diverse domains. Strengthened capabilities in exploit prototyping, binary analysis, and OSINT workflows. This competition experience expanded technical breadth and contributed refined notes and reusable tooling for future CTF participation."
},
     {
  "id": 1,
  "title": "Holmes CTF 2025",
  "category": "Capture The Flag",
  "url": "https://pub-113bc69380eb4f6a984dc329fbd14c58.r2.dev/Certificate-0xJerry.pdf",
  "duration": "Sep 2025 ",
  "affiliation": "Holmes CTF (Individual Participant)",
  "color": "#6a0dad",
  "icon": "🏅",
  "difficulty": "Advanced",
  "status": "Completed",
  "overview": "Participated individually in Holmes CTF 2025 (22–26 Sep 2025). Solved 46 out of 65 challenges across web exploitation, reverse engineering, cryptography, and forensics. Focused on rapid triage, exploit development, automation of tooling, and producing clear write-ups for learning and portfolio.",
  "technologies": [
    "Kali Linux",
    "Burp Suite",
    "Nmap",
    "Wireshark",
    "Ghidra",
    "Radare2",
    "pwntools",
    "John / Hashcat",
    "Python",
    "Bash",
    "Docker"
  ],
  "achievements": [
    "Solved 46 out of 65 challenges across Web, Crypto, Reversing, and Forensics categories",
    "Ranked 774th out of 7,085 teams with a total score of 5,100 points",
    "Individually represented team 'Secure-Hive' and maintained consistent performance",
    "Produced structured notes and write-ups to document techniques and approaches"
  ],
  "skills": [
    "Exploit development and tooling automation",
    "Reverse engineering & binary analysis",
    "Applied cryptography and forensic investigation",
    "Web exploitation and network analysis",
    "Rapid triage under time-constrained competition",
    "Self-driven participation and knowledge documentation"
  ],
  "impact": "Enhanced hands-on offensive security capabilities by solving real-world styled CTF challenges. Strengthened individual problem-solving, rapid exploit prototyping, and forensic analysis skills. The experience contributed reusable notes and methodologies to improve efficiency in future competitions."
},
    {
  "id": 2,
  "title": "HackTheBox Play CTF",
  "category": "Capture The Flag",
  "url": "https://github.com/Jery0843/HackTheBox/tree/main/Play_CTF-2025",
  "duration": "2025",
  "affiliation": "Hack The Box (Participant)",
  "color":  "#ff4500",
  "icon": "🏆",
  "difficulty": "Advanced",
  "status": "Completed",
  "overview": "Active competitor in Hack The Box Play CTF events and continuous challenge practice. Work spans web exploitation, binary pwn, reverse engineering, crypto, forensics, OSINT and infrastructure/hardening tasks. Focus on rapid triage, exploit development, tool automation, and producing clear write-ups for learning and portfolio.",
  "technologies": [
    "Kali Linux",
    "Burp Suite",
    "Nmap",
    "Wireshark",
    "Metasploit",
    "Ghidra",
    "Radare2",
    "IDA Pro",
    "pwntools",
    "John / Hashcat",
    "Python",
    "Bash",
    "Docker"
  ],
  "achievements": [
    "Solved diverse challenges across Web, Pwn, Crypto, Forensics, and OSINT categories (2024–2025)",
    "Developed and automated exploitation tooling and reconnaissance scripts in Python",
    "Authored detailed public write-ups documenting approach, techniques, and mitigations",
    "Coordinated team strategy during live CTFs — task allocation, scoring prioritization and post-mortem analysis"
  ],
  "skills": [
    "Offensive security (web, binary exploitation, crypto)",
    "Reverse engineering & static/dynamic analysis",
    "Network & forensic analysis",
    "OSINT and information discovery",
    "Exploit development & scripting",
    "CTF teamwork, task triage and post-mortem documentation"
  ],
  "impact": "Significantly improved practical offensive and defensive security skills through hands-on CTF challenges; strengthened ability to rapidly triage, exploit, and document vulnerabilities while collaborating with a team under time pressure. Produced portfolio-grade write-ups and reusable tooling that accelerated future engagements."
},
    {
        id: 3,
        title: "HackTheBox & TryHackMe Labs",
        category: "Penetration Testing",
        url: "https://htb-writeup.jerome.co.in/",
        duration: "Ongoing",
        affiliation: "Self-Study",
        color: "#ff0080",
        icon: "🔓",
        difficulty: "Advanced",
        status: "Active",
        overview: "Hands-on penetration testing practice through HackTheBox and TryHackMe platforms, covering real-world attack scenarios and advanced exploitation techniques.",
        technologies: ["Burp Suite", "Metasploit", "Nmap", "John the Ripper", "Hydra", "Python"],
        achievements: [
            "Solved 50+ HackTheBox machines with detailed writeups",
            "Achieved top 10% ranking in TryHackMe leaderboards",
            "Mastered advanced privilege escalation techniques",
            "Developed custom exploitation scripts"
        ],
        skills: ["Web Exploitation", "Privilege Escalation", "Reverse Engineering", "Forensics", "Network Security"],
        impact: "Strengthened offensive security skills through real-world inspired challenges, developing expertise in vulnerability discovery and exploitation."
    },
    {
        id: 4,
        title: "CloudSEK CTF",
        category: "Capture The Flag",
        url: "https://cloudsek-ctf-report.hashnode.dev/cloudsek-hiring-ctf-august-2025-report-and-insights",
        duration: "Aug 2025",
        affiliation: "CloudSEK",
        color: "#00ff80",
        icon: "🏆",
        difficulty: "Expert",
        status: "Completed",
        overview: "Participated in CloudSEK's Capture the Flag challenge, demonstrating advanced penetration testing skills across web applications, authentication mechanisms, and API exploitation.",
        technologies: ["Nmap", "Burp Suite", "Wireshark", "Python", "GraphQL", "JWT"],
        achievements: [
            "Successfully exploited AI prompt injection vulnerabilities",
            "Performed advanced GraphQL schema introspection",
            "Bypassed Multi-Factor Authentication mechanisms",
            "Demonstrated SSRF exploitation techniques"
        ],
        skills: ["OSINT", "AI Security", "GraphQL Exploitation", "JWT Forgery", "MFA Bypass", "SSRF"],
        impact: "Demonstrated advanced penetration testing skills by chaining vulnerabilities to achieve privileged access, while providing detailed remediation strategies."
    },
    {
        id: 5,
        title: "SecureHive",
        category: "Cybersecurity Tool",
        url: "https://securehive.securenotepad.tech/",
        duration: "May 2024 - Dec 2024",
        affiliation: "Red Team Hacker Academy",
        color: "#00bfff",
        icon: "🛡️",
        difficulty: "Advanced",
        status: "Released",
        overview: "Sophisticated Python-based file and folder encryption application providing robust data security through advanced cryptographic techniques and user-friendly interface.",
        technologies: ["Python", "PyQt6", "AES Encryption", "RSA", "SHA-256", "Email API"],
        achievements: [
            "Implemented military-grade AES encryption",
            "Built secure RSA key management system",
            "Created automated security monitoring",
            "Developed intuitive cross-platform GUI"
        ],
        skills: ["Cryptography", "GUI Development", "Security Architecture", "Data Protection", "System Integration"],
        impact: "Created enterprise-grade encryption tool that bridges technical complexity with intuitive design, providing robust data security for end users."
    },
    {
        id: 6,
        title: "Patient No-Show Predictor",
        category: "Machine Learning",
        url: "https://ijnrd.org/viewpaperforall.php?paper=IJNRD2403501",
        duration: "Dec 2023 - Mar 2024",
        affiliation: "KANINI",
        color: "#ff8c00",
        icon: "🤖",
        difficulty: "Intermediate",
        status: "Published",
        overview: "Predictive machine learning model to forecast patient no-shows, optimizing healthcare scheduling and improving care delivery through data-driven insights.",
        technologies: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
        achievements: [
            "Published research paper in IJNRD journal",
            "Achieved 85% prediction accuracy",
            "Reduced healthcare scheduling inefficiencies by 30%",
            "Integrated demographic and behavioral analytics"
        ],
        skills: ["Machine Learning", "Data Analysis", "Feature Engineering", "Statistical Modeling", "Healthcare Analytics"],
        impact: "Enabled healthcare providers to reduce no-show rates and enhance operational efficiency through predictive analytics and strategic resource allocation."
    },
    {
        id: 7,
        title: "Kali Secure Notepad",
        category: "Security Application",
        url: "https://securenotepad.tech/",
        duration: "Jun 2023 - Nov 2023",
        affiliation: "Loyola College",
        color: "#8a2be2",
        icon: "📝",
        difficulty: "Intermediate",
        status: "Completed",
        overview: "Advanced privacy-focused note-taking application designed for secure data storage with robust encryption, integrity verification, and security monitoring.",
        technologies: ["Python", "Tkinter", "Cryptography", "Hash Functions", "Email Integration"],
        achievements: [
            "Implemented zero-knowledge architecture",
            "Built real-time security monitoring",
            "Created tamper-detection mechanisms",
            "Developed secure authentication system"
        ],
        skills: ["Application Security", "Encryption", "Data Integrity", "Authentication", "Privacy Engineering"],
        impact: "Delivered secure note-taking solution balancing high-level data privacy with intuitive user experience and advanced cybersecurity techniques."
    }
];

const categories = ['all', 'Penetration Testing', 'Capture The Flag', 'Cybersecurity Tool', 'Machine Learning', 'Security Application'];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 1;
        this.decay = Math.random() * 0.025 + 0.015;
        this.size = Math.random() * 6 + 2;
        this.color = color || '#00ff00';
        this.alpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.alpha = this.life;
        this.vx *= 0.97;
        this.vy *= 0.97;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count = 20, color = '#00ff00') {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            x + Math.random() * 60 - 30,
            y + Math.random() * 60 - 30,
            color
        ));
    }
}

function animateParticles() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create ambient particles
    if (Math.random() < 0.02) {
        const colors = ['#00ff00', '#ff0080', '#00bfff', '#ff8c00', '#8a2be2'];
        createParticles(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            3,
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

function handleKeydown(e) {
    if (e.key === 'Escape' && selectedProject) {
        closeProject();
    }
}

$: baseProjects = primaryView === 'ctfs'
    ? projects.filter(p => p.category === 'Capture The Flag')
    : projects.filter(p => p.category !== 'Capture The Flag');

$: visibleCategories = primaryView === 'ctfs'
    ? ['all', 'Capture The Flag']
    : categories.filter(c => c !== 'Capture The Flag');

$: filteredProjects = filterType === 'all'
    ? baseProjects
    : baseProjects.filter(project => project.category === filterType);

// Dynamic stats helpers and sets
function uniqueCount(arr) {
    return new Set(arr).size;
}
function pickCategories(list) {
    return list.map(p => p.category);
}
function pickTechnologies(list) {
    return list.flatMap(p => p.technologies || []);
}

// Sets respecting current filter selection
$: projectsSet = projects.filter(p => p.category !== 'Capture The Flag' && (filterType === 'all' || p.category === filterType));
$: ctfsSet = projects.filter(p => p.category === 'Capture The Flag' && (filterType === 'all' || p.category === filterType));

// Stats per group
$: statsProjects = {
    items: projectsSet.length,
    categories: uniqueCount(pickCategories(projectsSet)),
    techs: uniqueCount(pickTechnologies(projectsSet))
};
$: statsCtfs = {
    items: ctfsSet.length,
    categories: uniqueCount(pickCategories(ctfsSet)),
    techs: uniqueCount(pickTechnologies(ctfsSet))
};

function openProject(project) {
    selectedProject = project;
}

function closeProject() {
    selectedProject = null;
}

// Allow background scrolling - no body lock needed

onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    
    setTimeout(() => showContent = true, 800);
    animateParticles();
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeydown);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
});
</script>

<!-- SEO Meta Tags -->
<SEO 
    title="Projects - Jerome Andrew K | Cybersecurity Projects & CTF Challenges"
    description="Explore Jerome Andrew K's cybersecurity projects including SecureHive encryption tool, CTF challenges from HackTheBox & TryHackMe, machine learning research, and penetration testing work."
    keywords="cybersecurity projects, CTF writeups, HackTheBox, TryHackMe, SecureHive, ethical hacking projects, penetration testing projects, security tools"
    canonical="https://jerome.is-a.dev/projects"
/>

<!-- Particle Canvas -->
<canvas bind:this={canvas} class="particle-canvas"></canvas>

<!-- Hexagon Background Pattern -->
<div class="hexagon-background"></div>

{#if showContent}
<main in:fade={{ duration: 1000 }} class="main-container">
    <!-- Hero Section with Holographic Effect -->
    <section class="hero-section" in:fly={{ y: -50, duration: 800, easing: cubicOut }}>
        <div class="hologram-container">
            <h1 class="project-title">
                <span class="bracket">{'{'}</span>
                <span class="main-text">PROJECTS</span>
                <span class="bracket">{'}'}</span>
                <div class="glitch-line"></div>
            </h1>
        </div>
        <p class="subtitle">Cybersecurity tools, research projects, and development work</p>
    </section>

    <!-- Primary View Toggle -->
    <section class="primary-toggle-section" in:fly={{ y: 20, duration: 600, delay: 150, easing: cubicOut }}>
        <div class="primary-toggle">
            <button 
                class="toggle-btn" 
                class:active={primaryView === 'projects'}
                on:click={() => { primaryView = 'projects'; filterType = 'all'; selectedProject = null; }}
            >
                Projects
            </button>
            <button 
                class="toggle-btn" 
                class:active={primaryView === 'ctfs'}
                on:click={() => { primaryView = 'ctfs'; filterType = 'all'; selectedProject = null; }}
            >
                CTFs
            </button>
        </div>
    </section>

    <!-- Category Filter -->
    <section class="filter-section" in:fly={{ y: 30, duration: 600, delay: 200, easing: cubicOut }}>
        <div class="filter-container">
            <div class="filter-label">FILTER_BY:</div>
            <div class="filter-buttons">
{#each visibleCategories as category, i}
                    <button 
                        class="filter-btn"
                        class:active={filterType === category}
                        style="--delay: {i * 0.1}s"
                        in:scale={{ duration: 200, delay: 200 + i * 80, easing: cubicOut }}
                        on:click={() => filterType = category}
                    >
                        {category.toUpperCase().replace(' ', '_')}
                    </button>
                {/each}
            </div>
        </div>
    </section>

    {#if selectedProject}
        <div class="modal-layer" in:fade={{ duration: 100 }}>
            <div 
                class="sheet-modal" 
                style="--project-color: {selectedProject.color};"
                in:fade={{ duration: 200 }} 
                on:click|stopPropagation
                role="dialog"
                aria-label="Project details"
            >
                <div class="sheet-handle"></div>
                <div class="sheet-header">
                    <div class="back-title">
                        <span class="icon-large">{selectedProject.icon}</span>
                        <div>
                            <h3>{selectedProject.title}</h3>
                            <a href={selectedProject.url} target="_blank" class="project-link">
                                View Project →
                            </a>
                        </div>
                    </div>
                    <button class="close-btn" on:click|stopPropagation={closeProject}>✕</button>
                </div>

                <div class="sheet-body">
                    <div class="detail-section">
                        <h4 class="section-title">📋 Project Overview</h4>
                        <p class="section-content">{selectedProject.overview}</p>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-title">🛠️ Technologies</h4>
                        <div class="tech-grid">
                            {#each selectedProject.technologies as tech, j}
                                <span 
                                    class="tech-pill"
                                    in:scale={{ duration: 250, delay: j * 40 }}
                                    style="background: linear-gradient(135deg, {selectedProject.color}20, transparent); border-color: {selectedProject.color};"
                                >
                                    {tech}
                                </span>
                            {/each}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-title">🏆 Key Achievements</h4>
                        <ul class="achievements-list">
                            {#each selectedProject.achievements as achievement, k}
                                <li in:fly={{ x: -12, duration: 220, delay: k * 80 }}>
                                    <span class="bullet">▶</span>
                                    {achievement}
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-title">🎯 Skills Demonstrated</h4>
                        <div class="skills-grid">
                            {#each selectedProject.skills as skill, l}
                                <span 
                                    class="skill-badge"
                                    in:scale={{ duration: 220, delay: l * 50 }}
                                    style="color: {selectedProject.color}; border-color: {selectedProject.color};"
                                >
                                    {skill}
                                </span>
                            {/each}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-title">💥 Project Impact</h4>
                        <div class="impact-content" style="border-left-color: {selectedProject.color};">
                            <p>{selectedProject.impact}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
    
    <!-- Project Stats -->
    <section class="gallery-section" in:fly={{ y: 50, duration: 800, delay: 400, easing: cubicOut }}>
        <div class="projects-gallery">
            {#each filteredProjects as project, i}
                <div 
                    class="project-card-3d"
                    class:selected={selectedProject === project}
                    style="--project-color: {project.color}; --index: {i};"
                    in:scale={{ duration: 300, delay: 200 + i * 80, easing: cubicOut }}
                    on:click={() => openProject(project)}
                    role="button"
                    tabindex="0"
                >
                    <!-- Card Front -->
                    <div class="card-front">
                        <div class="card-glow"></div>
                        <div class="card-border"></div>
                        
                        <!-- Header with Icon -->
                        <div class="card-header">
                            <div class="project-icon" style="filter: drop-shadow(0 0 15px {project.color});">
                                {project.icon}
                            </div>
                            <div class="header-info">
                                <h3 class="project-name">{project.title}</h3>
                                <div class="project-meta">
                                    <span class="category-tag">{project.category}</span>
                                    <span class="difficulty-badge" class:expert={project.difficulty === 'Expert'} class:advanced={project.difficulty === 'Advanced'}>
                                        {project.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Status & Duration -->
                        <div class="status-section">
                            <div class="status-indicator" class:active={project.status === 'Active'} class:completed={project.status === 'Completed' || project.status === 'Released' || project.status === 'Published'}>
                                <div class="status-dot"></div>
                                <span>{project.status}</span>
                            </div>
                            <div class="duration">{project.duration}</div>
                        </div>
                        
                        <!-- Overview Preview -->
                        <div class="overview-preview">
                            <p>{project.overview.substring(0, 140)}...</p>
                        </div>
                        
                        <!-- Technology Tags -->
                        <div class="tech-tags">
                            {#each project.technologies.slice(0, 3) as tech}
                                <span class="tech-tag" style="border-color: {project.color};">{tech}</span>
                            {/each}
                            {#if project.technologies.length > 3}
                                <span class="tech-more">+{project.technologies.length - 3}</span>
                            {/if}
                        </div>
                        
                        <!-- Expand Indicator -->
                        <div class="expand-hint">
                            <div class="pulse-ring"></div>
                            <span>Click to explore</span>
                        </div>
                    </div>
                    
                    <!-- Card Back rendered globally -->
                </div>
            {/each}
        </div>
    </section>

    
    <!-- Project Stats -->
    <section class="stats-section" in:fly={{ y: 50, duration: 800, delay: 800, easing: cubicOut }}>
        <div class="stats-grid">
            <div class="stats-block {primaryView === 'projects' ? 'active' : ''}">
                <div class="block-title">Projects</div>
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-number">{statsProjects.items}</div>
                        <div class="stat-label">Projects</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-card">
                        <div class="stat-number">{statsProjects.categories}</div>
                        <div class="stat-label">Categories</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-card">
                        <div class="stat-number">{statsProjects.techs}</div>
                        <div class="stat-label">Technologies</div>
                    </div>
                </div>
            </div>

            <div class="stats-block {primaryView === 'ctfs' ? 'active' : ''}">
                <div class="block-title">CTFs</div>
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-number">{statsCtfs.items}</div>
                        <div class="stat-label">Challenges</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-card">
                        <div class="stat-number">{statsCtfs.categories}</div>
                        <div class="stat-label">Categories</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-card">
                        <div class="stat-number">{statsCtfs.techs}</div>
                        <div class="stat-label">Technologies</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
{/if}

<style>
/* Global Styles */
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

/* Hexagon Background */
.hexagon-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.02;
    background-image: 
        radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(0, 191, 255, 0.1) 2px, transparent 2px);
    background-size: 60px 60px;
    animation: hexMove 30s linear infinite;
    z-index: 0;
    will-change: transform;
    transform: translateZ(0);
}

@keyframes hexMove {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(30px, 30px) rotate(360deg); }
}

/* Main Container */
.main-container {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem 1rem;
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
}

@media (max-width: 1024px) {
    .main-container { padding: 1.5rem 1rem; max-width: 100%; }
}
@media (max-width: 768px) {
    .main-container { padding: 1.25rem 0.875rem; }
}
@media (max-width: 480px) {
    .main-container { padding: 1rem 0.5rem; }
}

/* Hero Section */
.hero-section {
    text-align: center;
    margin-bottom: 4rem;
    padding: 2rem 0;
    isolation: isolate;
}

.hologram-container {
    position: relative;
    display: inline-block;
    isolation: isolate;
    contain: layout style;
}

.project-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 
        0 0 10px var(--hacker-green),
        0 0 20px var(--hacker-green),
        0 0 40px var(--hacker-green);
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
    animation: hologramGlow 4s ease-in-out infinite alternate;
    will-change: text-shadow;
    transform: translateZ(0);
    position: relative;
    display: inline-block;
    padding-bottom: 15px;
    backface-visibility: hidden;
    contain: layout;
}

.bracket {
    color: var(--cyber-blue);
    text-shadow: 0 0 15px var(--cyber-blue);
    animation: bracketFlicker 3s ease-in-out infinite;
    will-change: opacity;
}

.main-text {
    position: relative;
    display: inline-block;
    will-change: auto;
}

.glitch-line {
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    height: 2px;
    overflow: hidden;
    pointer-events: none;
}

.glitch-line::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--hacker-green), transparent);
    animation: glitchScan 2s linear infinite;
    will-change: transform;
    transform: translateZ(0) translateX(-100%);
}

@keyframes hologramGlow {
    0% { text-shadow: 0 0 10px var(--hacker-green), 0 0 20px var(--hacker-green), 0 0 40px var(--hacker-green); }
    100% { text-shadow: 0 0 20px var(--hacker-green), 0 0 30px var(--hacker-green), 0 0 60px var(--hacker-green); }
}

@keyframes bracketFlicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes glitchScan {
    0% { 
        transform: translateZ(0) translateX(-100%); 
        opacity: 0;
    }
    5% {
        opacity: 1;
    }
    95% {
        opacity: 1;
    }
    100% { 
        transform: translateZ(0) translateX(200%); 
        opacity: 0;
    }
}

.subtitle {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 300;
    letter-spacing: 0.05em;
    margin-top: 1.5rem;
    opacity: 0;
    animation: subtitleFade 2s ease-out 0.5s forwards;
}

@keyframes subtitleFade {
    to { opacity: 1; }
}

/* Filter Section */
.filter-section {
    margin-bottom: 4rem;
    text-align: center;
}

@media (max-width: 768px) {
    .filter-section { margin-bottom: 3rem; }
}
@media (max-width: 480px) {
    .filter-section { margin-bottom: 2.5rem; }
}

/* Primary Toggle */
.primary-toggle-section {
    margin-bottom: 2rem;
    text-align: center;
}

.primary-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(0, 255, 0, 0.3);
    border-radius: 9999px;
    overflow: hidden;
}

.toggle-btn {
    padding: 0.6rem 1.2rem;
    font-family: 'Courier New', monospace;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.toggle-btn:hover {
    color: var(--hacker-green);
}

.toggle-btn.active {
    background: linear-gradient(135deg, var(--hacker-green), rgba(0, 255, 0, 0.15));
    color: #000;
    box-shadow: 0 0 20px var(--hacker-green);
}

.filter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.filter-label {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    color: var(--hacker-green);
    text-shadow: 0 0 10px var(--hacker-green);
    letter-spacing: 0.1em;
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .filter-buttons { gap: 0.75rem; }
}
@media (max-width: 480px) {
    .filter-buttons { gap: 0.625rem; }
}

.filter-btn {
    background: rgba(10, 10, 10, 0.9);
    border: 2px solid rgba(0, 255, 0, 0.3);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.7rem 1.5rem;
    border-radius: 25px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
}

@media (max-width: 768px) {
    .filter-btn { padding: 0.6rem 1.25rem; font-size: 0.85rem; }
}
@media (max-width: 480px) {
    .filter-btn { padding: 0.5rem 1rem; font-size: 0.8rem; border-radius: 20px; }
}

.filter-btn:hover {
    border-color: var(--hacker-green);
    color: var(--hacker-green);
    text-shadow: 0 0 10px var(--hacker-green);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 255, 0, 0.2);
}

.filter-btn.active {
    background: linear-gradient(135deg, var(--hacker-green), rgba(0, 255, 0, 0.1));
    border-color: var(--hacker-green);
    color: #000;
    text-shadow: none;
    box-shadow: 0 0 20px var(--hacker-green);
}

/* Gallery Section */
.gallery-section {
    margin: 4rem 0;
}

.projects-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2.5rem;
    padding: 1rem 0;
}

@media (max-width: 1200px) {
    .projects-gallery { grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; }
}
@media (max-width: 900px) {
    .projects-gallery { grid-template-columns: 1fr; gap: 1.75rem; max-width: 600px; margin: 0 auto; }
}
@media (max-width: 768px) {
    .projects-gallery { gap: 1.5rem; padding: 0.75rem 0; }
}
@media (max-width: 480px) {
    .projects-gallery { gap: 1.25rem; padding: 0.5rem 0; max-width: 100%; }
}

/* 3D Project Cards */
.project-card-3d {
    position: relative;
    width: 100%;
    height: 400px;
    cursor: pointer;
    transition: all 0.3s ease;
    will-change: transform;
    backface-visibility: hidden;
    transform-style: flat;
}

@media (max-width: 768px) {
    .project-card-3d { height: 380px; }
}
@media (max-width: 480px) {
    .project-card-3d { height: 360px; }
}

/* Keep hover simple to avoid flicker/hide issues */
.project-card-3d.hovered {
    transform: none;
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.35));
}

.project-card-3d.selected {
    transform: scale(1.02);
    z-index: 2;
}

/* Card Front */
.card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.95);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    overflow: hidden;
    transition: all 0.25s ease;
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    will-change: transform, border-color, box-shadow;
    backface-visibility: hidden;
}

.project-card-3d.hovered .card-front {
    border-color: var(--project-color);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.6),
        0 0 30px var(--project-color),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, var(--project-color), transparent);
    opacity: 0;
    border-radius: 20px;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.project-card-3d.hovered .card-glow {
    opacity: 0.1;
}

.card-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: linear-gradient(45deg, transparent 30%, var(--project-color), transparent 70%);
    opacity: 0;
    animation: borderSweep 3s ease-in-out infinite;
    will-change: opacity;
    pointer-events: none;
}

@keyframes borderSweep {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.3; }
}

/* Card Header */
.card-header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
}

.project-icon {
    font-size: 3rem;
}

.header-info {
    flex: 1;
}

.project-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.8rem;
    letter-spacing: 0.02em;
    line-height: 1.3;
}

.project-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.category-tag {
    background: rgba(255, 255, 255, 0.1);
    color: var(--project-color);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid var(--project-color);
    text-shadow: 0 0 10px var(--project-color);
}

.difficulty-badge {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.difficulty-badge.expert {
    color: #ff4444;
    border-color: #ff4444;
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
}

.difficulty-badge.advanced {
    color: #ffaa00;
    border-color: #ffaa00;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
}

/* Status Section */
.status-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #666;
    animation: statusPulse 2s ease-in-out infinite;
    will-change: opacity;
}

.status-indicator.active .status-dot {
    background: #00ff00;
    box-shadow: 0 0 10px #00ff00;
}

.status-indicator.completed .status-dot {
    background: #00bfff;
    box-shadow: 0 0 10px #00bfff;
}

@keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.duration {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-family: 'Courier New', monospace;
}

/* Overview Preview */
.overview-preview {
    margin-bottom: 1.5rem;
}

.overview-preview p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    font-size: 0.95rem;
    margin: 0;
}

/* Technology Tags */
.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.tech-tag {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.4rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--project-color);
    transition: all 0.3s ease;
}

.tech-tag:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.tech-more {
    color: var(--project-color);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.8rem;
    text-shadow: 0 0 10px var(--project-color);
}

/* Expand Hint */
.expand-hint {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    font-weight: 500;
}

.pulse-ring {
    width: 12px;
    height: 12px;
    border: 2px solid var(--project-color);
    border-radius: 50%;
}


/* Modal layer centers the modal independent of page layout */
.modal-layer {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 999;
    pointer-events: none; /* allow background scroll */
}

/* Bottom sheet floating modal */
.sheet-modal::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -1px; height: 24px;
    background: linear-gradient(to bottom, rgba(10,10,10,0), rgba(10,10,10,0.8));
    pointer-events: none;
}

.sheet-modal {
    position: relative;
    width: min(1100px, 96vw);
    height: min(80vh, 900px);
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 2001;
    pointer-events: auto;
    will-change: transform;
    transform: translateZ(0);
    border-radius: 20px 20px 0 0;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 -10px 30px rgba(0,0,0,0.6), 0 0 30px var(--project-color);
}

@media (max-width: 1024px) {
    .sheet-modal { width: 94vw; height: min(82vh, 850px); }
}
@media (max-width: 768px) {
    .sheet-modal { width: 95vw; height: 82vh; border-radius: 18px 18px 0 0; }
}
@media (max-width: 480px) {
    .sheet-modal { width: 98vw; height: 88vh; border-radius: 16px 16px 0 0; }
}

/* Center at bottom of viewport */
.modal-layer {
    position: fixed;
    inset: 0;
    display: grid;
    align-items: end;
    justify-items: center;
    z-index: 2000; /* above footer */
    pointer-events: none;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

.sheet-handle {
    width: 60px;
    height: 5px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
    margin: 10px auto 0;
}

.sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 1.25rem 0.75rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: linear-gradient(to bottom, rgba(255,255,255,0.04), transparent);
    flex-shrink: 0;
}

.sheet-body {
    padding: 1.2rem 1.25rem 1.4rem 1.25rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
}

@media (max-width: 768px) {
    .sheet-body { padding: 1rem 1rem 1.2rem 1rem; gap: 0.875rem; }
}
@media (max-width: 480px) {
    .sheet-body { padding: 0.875rem 0.875rem 1rem 0.875rem; gap: 0.75rem; }
}

/* Custom Scrollbar for Modal Content */
.detailed-content::-webkit-scrollbar {
    width: 6px;
}

.detailed-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.detailed-content::-webkit-scrollbar-thumb {
    background: var(--project-color);
    border-radius: 3px;
    opacity: 0.7;
}

.detailed-content::-webkit-scrollbar-thumb:hover {
    opacity: 1;
    background: var(--project-color);
}

/* Back Header */
.back-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
    flex-shrink: 0;
}

.back-title {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.icon-large {
    font-size: 2.5rem;
    filter: drop-shadow(0 0 15px var(--project-color));
}

.back-title h3 {
    font-size: 1.8rem;
    color: white;
    margin: 0 0 0.5rem 0;
    border: none;
    padding: 0;
}

.project-link {
    color: var(--project-color);
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    text-shadow: 0 0 10px var(--project-color);
}

.project-link:hover {
    text-decoration: underline;
    text-shadow: 0 0 15px var(--project-color);
}

.close-btn {
    background: rgba(255, 0, 0, 0.1);
    border: 2px solid #ff4444;
    color: #ff4444;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: rotate(90deg);
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
}

/* Detailed Content */
.detailed-content {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}

.detail-section {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.detail-section:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: var(--project-color);
    transform: translateY(-2px);
}

.section-title {
    color: var(--project-color);
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-shadow: 0 0 10px var(--project-color);
}

.section-content {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    font-size: 1rem;
    margin: 0;
}

.tech-grid,
.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.tech-pill,
.skill-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--project-color);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.tech-pill {
    color: rgba(255, 255, 255, 0.9);
}

.skill-badge {
    background: rgba(255, 255, 255, 0.05);
    text-shadow: 0 0 10px var(--project-color);
}

.tech-pill:hover,
.skill-badge:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px var(--project-color);
}

.achievements-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.achievements-list li {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.8rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;
    font-size: 0.95rem;
}

.bullet {
    position: absolute;
    left: 0;
    color: var(--project-color);
    text-shadow: 0 0 10px var(--project-color);
    font-size: 0.8rem;
    top: 0.2rem;
}

.impact-content {
    background: rgba(255, 255, 255, 0.03);
    border-left: 4px solid var(--project-color);
    border-radius: 8px;
    padding: 1.5rem;
    font-style: italic;
}

.impact-content p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    font-size: 1rem;
    margin: 0;
}

/* Stats Section */
.stats-section {
    margin-top: 6rem;
    text-align: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    align-items: stretch;
}

.stats-block {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.stats-block.active .block-title {
    color: var(--hacker-green);
    text-shadow: 0 0 18px var(--hacker-green);
}

.block-title {
    font-family: 'Courier New', monospace;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.8);
}

.stats-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    margin: 0 auto;
}

.stat-card {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--hacker-green);
    text-shadow: 0 0 20px var(--hacker-green);
    font-family: 'Courier New', monospace;
    margin-bottom: 0.5rem;
    animation: statGlow 3s ease-in-out infinite alternate;
}

@keyframes statGlow {
    0% { text-shadow: 0 0 20px var(--hacker-green); }
    100% { text-shadow: 0 0 30px var(--hacker-green), 0 0 40px var(--hacker-green); }
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
@media (max-width: 1200px) {
    .detailed-content {
        grid-template-columns: 1fr;
    }
    .card-header { gap: 1.25rem; }
}

@media (max-width: 1024px) {
    .project-title { font-size: clamp(2.25rem, 4.5vw, 3rem); }
    .subtitle { font-size: clamp(1.1rem, 2.5vw, 1.3rem); }
    .card-front { padding: 1.75rem; }
}

@media (max-width: 768px) {
    .project-title { font-size: 2rem; }
    .subtitle { font-size: 1.1rem; }
    
    .card-front { padding: 1.5rem; }
    
    .card-header {
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-direction: column;
        align-items: flex-start;
    }
    
    .project-icon { font-size: 2.5rem; }
    .project-name { font-size: 1.2rem; }
    
    .project-meta {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.625rem;
    }
    
    .back-header {
        padding: 1rem 1.5rem;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .stats-container {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
    }
    
    .stat-divider {
        width: 50px;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--hacker-green), transparent);
    }
}

@media (max-width: 640px) {
    .project-title { font-size: 1.75rem; }
    .subtitle { font-size: 1rem; }
}

@media (max-width: 480px) {
    .project-title { font-size: 1.5rem; letter-spacing: 0.06em; }
    .subtitle { font-size: 0.95rem; }
    
    .card-front { padding: 1.25rem; }
    
    .header-info { width: 100%; }
    .project-icon { font-size: 2.25rem; }
    .project-name { font-size: 1.1rem; }
    
    .project-meta {
        gap: 0.5rem;
    }
    
    .category-tag,
    .difficulty-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.7rem;
    }
    
    .status-section { padding: 0.875rem; }
    .duration { font-size: 0.85rem; }
    
    .overview-preview p { font-size: 0.9rem; }
    
    .back-header { padding: 1rem; }
    .back-title { width: 100%; }
    .icon-large { font-size: 2rem; }
    .back-title h3 { font-size: 1.5rem; }
    
    .tech-tags,
    .tech-grid,
    .skills-grid {
        gap: 0.4rem;
    }
    
    .tech-tag,
    .tech-pill,
    .skill-badge {
        font-size: 0.75rem;
        padding: 0.3rem 0.6rem;
    }
    
    .section-title { font-size: 1.05rem; }
    .achievements-list li { font-size: 0.875rem; }
    .impact-content p { font-size: 0.925rem; }
}
</style>

