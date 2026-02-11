<script>
  import { createBubbler, stopPropagation } from 'svelte/legacy';

  const bubble = createBubbler();
import { fly, fade, scale } from 'svelte/transition';
import { cubicOut, elasticOut } from 'svelte/easing';
import { onMount } from 'svelte';
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import CredentialSchema from '$lib/components/CredentialSchema.svelte';

let canvas = $state();
let context;
let width;
let height;
let matrix;
let visible = $state(false);
let selectedCategory = $state('All');
let hoveredCert = $state(null);
let expandedCert = $state(null);
let searchTerm = $state('');

// Matrix background setup
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const fontSize = 10;
const columns = [];
let drops = [];

function draw() {
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
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    drops = [];
    for (let i = 0; i < width / fontSize; i++) {
        drops[i] = 1;
    }
}

onMount(() => {
    visible = true;
    context = canvas.getContext('2d');
    initMatrix();
    matrix = setInterval(draw, 35);
    
    const resizeHandler = () => {
        initMatrix();
    };
    
    window.addEventListener('resize', resizeHandler);
    
    return () => {
        clearInterval(matrix);
        window.removeEventListener('resize', resizeHandler);
    };
});


const certificates = [
    {
    id: 24,
    title: "Certified Ethical Hacker (Master)",
    link: "https://drive.google.com/file/d/1oD4RMNpCmY5mbfLewMfRDVGd5aO2ESst/view?usp=sharing",
    organization: "EC-Council",
    date: "Feb 2026",
    category: "Ethical Hacking",
    level: "Expert",
    color: "#ff0080",
    icon: "🏆",
    description: "Master-level certification demonstrating mastery of ethical hacking skills by passing both CEH Knowledge and CEH Practical exams",
    skills: ["Advanced Penetration Testing", "Ethical Hacking Mastery", "Security Assessment", "Enterprise Security"]
    },
    {
    id: 25,
    title: "Certified Ethical Hacker (Practical)",
    link: "https://drive.google.com/file/d/1VE9Slecipsy94x-134ejt0S7aAPDTWOw/view?usp=sharing",
    organization: "EC-Council",
    date: "Feb 2026",
    category: "Ethical Hacking",
    level: "Expert",
    color: "#ff0080",
    icon: "💻",
    description: "Hands-on practical exam demonstrating real-world ethical hacking skills in a proctored, performance-based environment",
    skills: ["Hands-on Penetration Testing", "Network Exploitation", "Web Application Security", "Live Target Assessment"]
    },
    {
    id: 1,
    title: "Certified Ethical Hacker (CEH v13)",
    link: "https://drive.google.com/file/d/1Tg7jN-2iZs7oYH23CL4p6txL7QfJJcBl/view?usp=sharing",
    organization: "EC-Council",
    date: "June 2025",
    category: "Ethical Hacking",
    level: "Professional",
    color: "#ff0080",
    icon: "🛡️",
    description: "Industry-standard certification demonstrating advanced ethical hacking skills and cybersecurity expertise",
    skills: ["Penetration Testing", "Vulnerability Assessment", "Network Security", "Malware Analysis"]
    },
    {
    id: 2,
    title: "Cyber Security Fundamentals",
    link: "https://www.coursera.org/account/accomplishments/verify/BK5NRV16SRJ0",
    organization: "University of London",
    date: "May 2025",
    category: "Web Security",
    level: "Intermediate",
    color: "#00ff80",
    icon: "🔒",
    description: "Comprehensive foundation in cybersecurity principles and practices",
    skills: ["Risk Assessment", "Security Frameworks", "Incident Response", "Compliance"]
    },
    {
    id: 3,
    title: "AI for Cybersecurity Specialization",
    link: "https://www.coursera.org/account/accomplishments/specialization/U3N82RMLGXH2",
    organization: "The Johns Hopkins University",
    date: "Jan 2025",
    category: "AI & Data Science",
    level: "Advanced",
    color: "#00bfff",
    icon: "🤖",
    description: "Advanced specialization combining artificial intelligence with cybersecurity applications",
    skills: ["Machine Learning", "Anomaly Detection", "AI Security", "Data Analysis"]
    },
    {
    id: 4,
    title: "Advanced Malware and Network Anomaly Detection",
    link: "https://www.coursera.org/account/accomplishments/records/EYJIPYPA82H0",
    organization: "The Johns Hopkins University",
    date: "Jan 2025",
    category: "Ethical Hacking",
    level: "Advanced",
    color: "#ff8c00",
    icon: "🔍",
    description: "Advanced techniques for malware analysis and network anomaly detection using AI",
    skills: ["Malware Analysis", "Network Monitoring", "Threat Detection", "Forensics"]
    },
    {
    id: 5,
    title: "Securing AI and Advanced Topics",
    link: "https://www.coursera.org/account/accomplishments/records/OSUEZA7KCRAM",
    organization: "The Johns Hopkins University",
    date: "Jan 2025",
    category: "AI & Data Science",
    level: "Expert",
    color: "#8a2be2",
    icon: "🛡️",
    description: "Cutting-edge security practices for AI systems and advanced cybersecurity topics",
    skills: ["AI Security", "Advanced Threats", "Security Architecture", "Risk Management"]
    },
    // Simplified additional certificates
    { id: 6, title: "Data Science", organization: "National Skill Development Corporation", date: "Sept 2024", category: "AI & Data Science", level: "Intermediate", color: "#00bfff", icon: "📊", link: "https://bit.ly/3Tr8vG2", skills: ["Data Analysis", "Statistics"], description: "Data science fundamentals and analytical techniques" },
    { id: 7, title: "AIG - Cybersecurity Simulation", organization: "Forage", date: "May 2024", category: "Simulation", level: "Intermediate", color: "#ff6b00", icon: "🔄", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/AIG/2ZFnEGEDKTQMtEv9C_AIG_Anqg2EuCSfzvP8Ky9_1715813513638_completion_certificate.pdf", skills: ["Threat Analysis", "Risk Assessment"], description: "Real-world cybersecurity simulation experience" },
    { id: 8, title: "Data Analysis with Python", organization: "IBM", date: "Feb 2024", category: "AI & Data Science", level: "Intermediate", color: "#00bfff", icon: "🐍", link: "https://coursera.org/verify/XLPD3Z8L4JY7", skills: ["Python", "Data Visualization"], description: "Python programming for data analysis" },
    { id: 9, title: "Network Defense Essentials", organization: "EC-Council", date: "July 2023", category: "Ethical Hacking", level: "Beginner", color: "#ff0080", icon: "🛡️", link: "https://codered.eccouncil.org/certificate/1d600f04-fd3b-43e4-a9c6-3c3e416fb98b?logged=true", skills: ["Network Security", "Defense Strategies"], description: "Network defense fundamentals" },
    { id: 10, title: "SQL Injection Attacks", organization: "EC-Council", date: "Jan 2023", category: "Web Security", level: "Intermediate", color: "#00ff80", icon: "🔒", link: "https://codered.eccouncil.org/certificate/98bff0f6-6b2c-45b0-907b-5f710e194dbf?logged=true", skills: ["SQL Security", "Web Attacks"], description: "SQL injection techniques and prevention" },
    { id: 11, title: "Game Development Using PyGame", organization: "GUVI", date: "Dec 2022", category: "Programming", level: "Beginner", color: "#ffff00", icon: "🎮", link: "https://www.guvi.in/verify-certificate?id=0gq018766R86Y800OW", skills: ["Python", "Game Development"], description: "Game development with Python and PyGame" },
    { id: 12, title: "Diploma in Ethical Hacking", organization: "Alison", date: "Nov 2022", category: "Ethical Hacking", level: "Beginner", color: "#ff0080", icon: "🎓", link: "https://alison.com/certification/check/%242y%2410%24eeVdQjIzTcaCAEww75V5cOcbggF6KK6GilRi1wZsevYmoufqqv6G", skills: ["Ethical Hacking", "Security Basics"], description: "Comprehensive ethical hacking diploma" },
    { id: 13, title: "Young Turks", organization: "Naukri Campus", date: "Oct 2024", category: "Programming", level: "Beginner", color: "#ffff00", icon: "🚀", link: "https://certificates.naukri.com/young-turks-2024", skills: ["Career Development", "Professional Skills"], description: "Professional development and career advancement program" },
    { id: 14, title: "Fundamentals of Information Security", organization: "Infosys Springboard", date: "Aug 2024", category: "Web Security", level: "Beginner", color: "#00ff80", icon: "🔐", link: "https://infyspringboard.onwingspan.com/web/en/app/toc/lex_auth_0127683137681989665_shared/overview", skills: ["Information Security", "Security Fundamentals"], description: "Core concepts of information security and data protection" },
    { id: 15, title: "Cognizant - Artificial Intelligence Job Simulation", organization: "Forage", date: "May 2024", category: "Simulation", level: "Intermediate", color: "#ff6b00", icon: "🧠", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Cognizant/5N2ygyhzMWjKQmgCK_Cognizant_Anqg2EuCSfzvP8Ky9_1715813629307_completion_certificate.pdf", skills: ["AI Implementation", "Business Strategy", "Data Analysis"], description: "Real-world AI project simulation with Cognizant" },
    { id: 16, title: "Hewlett Packard Enterprise - Software Engineering Job Simulation", organization: "Forage", date: "May 2024", category: "Simulation", level: "Intermediate", color: "#ff6b00", icon: "💻", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Hewlett%20Packard%20Enterprise/da2T3WZCbMAQvbE9v_Hewlett%20Packard%20Enterprise_Anqg2EuCSfzvP8Ky9_1715814025924_completion_certificate.pdf", skills: ["Software Engineering", "System Design", "Development Lifecycle"], description: "Software engineering practices simulation with HPE" },
    { id: 17, title: "Developing AI Applications with Python and Flask", organization: "IBM", date: "Dec 2023", category: "AI & Data Science", level: "Advanced", color: "#00bfff", icon: "🐍", link: "https://coursera.org/verify/AI_FLASK_2023", skills: ["Python", "Flask", "AI Development", "Web Applications"], description: "Building AI-powered web applications using Python and Flask" },
    { id: 18, title: "Ethical Hacking-Mobile Platforms and Network Architecture", organization: "Great Learning", date: "Dec 2022", category: "Ethical Hacking", level: "Intermediate", color: "#ff0080", icon: "📱", link: "https://olympus.mygreatlearning.com/courses/12761/certificate", skills: ["Mobile Security", "Network Architecture", "Penetration Testing"], description: "Mobile platform security and network architecture analysis" },
    { id: 19, title: "Python Course on Multiple Languages", organization: "CODE IIT Madras", date: "Dec 2022", category: "Programming", level: "Intermediate", color: "#ffff00", icon: "🐍", link: "https://drive.google.com/file/d/1HBqr8xKv-vwfPKTjHO9K0jZi1wYD4b2K/view", skills: ["Python", "Multi-language Programming", "Software Development"], description: "Comprehensive Python programming with multi-language integration" },
    { id: 20, title: "Learn Ethical Hacking From Scratch", organization: "Udemy", date: "Nov 2022", category: "Ethical Hacking", level: "Beginner", color: "#ff0080", icon: "🔓", link: "https://www.udemy.com/certificate/ethical-hacking-scratch-2022", skills: ["Ethical Hacking", "Security Testing", "Vulnerability Assessment"], description: "Complete beginner's guide to ethical hacking and penetration testing" },
    {
  "id": 21,
  "title": "Pre Security",
  "organization": "TryHackMe",
  "date": "Sep 2025",
  "category": "Web Security",
  "level": "Beginner",
  "color": "#00ff80",
  "icon": "🛡️",
  "link": "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-C0GNTVCOQ9.pdf",
  "skills": ["Cybersecurity Fundamentals", "Networking Basics", "Information Security"],
  "description": "Completed the Pre Security learning path covering essential cybersecurity concepts. Course duration: 7 hours 38 minutes."
},
{
  "id": 22,
  "title": "Open Source Intelligence",
  "organization": "EC-Council",
  "date": "Sep 2025",
  "category": "Ethical Hacking",
  "level": "Intermediate",
  "color": "#ff8c00",
  "icon": "🔎",
  "link": "https://learn.eccouncil.org/certificate/b2e51562-ecab-4bcc-b9c3-6ff5a308cf3e",
  "skills": ["OSINT", "Information Gathering", "Cybersecurity Research"],
  "description": "Successfully completed the Open Source Intelligence course by EC-Council Continuing Education. Course duration: 4 hours. Certificate Number: 438262."
},
{
  "id": 23,
  "title": "Introduction to Applied Cryptography",
  "organization": "University of London (Coursera)",
  "date": "Sep 2025",
  "category": "Web Security",
  "level": "Intermediate",
  "color": "#0066cc",
  "icon": "🔐",
  "link": "https://www.coursera.org/verify/D9TS2RJPLBKB",
  "skills": ["Applied Cryptography", "Public Key Infrastructure", "Encryption", "Key Management", "Data Integrity"],
  "description": "Successfully completed the 'Introduction to Applied Cryptography' course, authorized by the University of London and offered via Coursera. Course duration: 19 hours."
}


];

// Function to parse date string and create a sortable date
function parseDate(dateString) {
    const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
        'January': 1, 'February': 2, 'March': 3, 'April': 4, 'June': 6,
        'July': 7, 'August': 8, 'September': 9, 'Sept': 9, 'October': 10, 'November': 11, 'December': 12
    };
    
    const parts = dateString.trim().split(' ');
    const month = parts[0];
    const year = parseInt(parts[1]);
    const monthNum = months[month] || 1;
    
    return new Date(year, monthNum - 1, 1);
}


// Categories for filtering - dynamically extracted from certificates
let uniqueCategories = $derived([...new Set(certificates.map(cert => cert.category))]);
let categories = $derived(['All', ...uniqueCategories]);
// Filtering and search functions with date sorting
let filteredCertificates = $derived(certificates
    .filter(cert => {
        const matchesCategory = selectedCategory === 'All' || cert.category === selectedCategory;
        const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             cert.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
        // Sort by date (latest first)
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // Descending order (latest first)
    }));
let certificateStats = $derived({
    total: certificates.length,
    categories: uniqueCategories.length,
    thisYear: certificates.filter(cert => cert.date.includes(new Date().getFullYear().toString())).length
});
</script>

<!-- SEO Meta Tags -->
<SEO 
    title="Certificates & Certifications - Jerome Andrew K"
    description="Professional certifications and achievements of Jerome Andrew K in cybersecurity, ethical hacking, AI, and web security."
    keywords="certificates, certifications, cybersecurity, ethical hacking, CEH, Jerome Andrew K"
    canonical="https://jerome.co.in/certificates"
    datePublished="2024-01-01"
    dateModified="2026-02-11"
    speakable={true}
/>
<BreadcrumbSchema pageName="Certificates" pageUrl="/certificates" />
<CredentialSchema credentials={[
    { name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', category: 'Professional Certification' },
    { name: 'TryHackMe Legend', issuer: 'TryHackMe', category: 'Platform Achievement' },
    { name: 'HackTheBox Pro Hacker', issuer: 'Hack The Box', category: 'Platform Achievement' },
    { name: 'Google Cybersecurity Certificate', issuer: 'Google', category: 'Professional Certification' },
    { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', category: 'Cloud Certification' },
    { name: 'CompTIA Security+', issuer: 'CompTIA', category: 'Professional Certification' }
]} />

<!-- Matrix Background Canvas -->
<canvas bind:this={canvas}></canvas>

{#if visible}
<!-- Main Container -->
<div class="main-container" in:fade={{ duration: 1000 }}>
    <!-- Hero Section -->
    <section class="hero-section" in:fly={{ y: -50, duration: 800, easing: cubicOut }}>
        <h1 class="certificates-title">
            <span class="bracket">&lt;</span>
            <span class="glitch" data-text="CERTIFICATIONS">CERTIFICATIONS</span>
            <span class="bracket">/&gt;</span>
        </h1>
        <div class="subtitle">Digital credentials and professional achievements</div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" in:fly={{ y: 30, duration: 600, delay: 200, easing: cubicOut }}>
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-number">{certificateStats.total}</div>
                <div class="stat-label">Total Certificates</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-card">
                <div class="stat-number">{certificateStats.categories}</div>
                <div class="stat-label">Categories</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-card">
                <div class="stat-number">{certificateStats.thisYear}</div>
                <div class="stat-label">This Year</div>
            </div>
        </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="controls-section" in:fly={{ y: 30, duration: 600, delay: 400, easing: cubicOut }}>
        <div class="search-container">
            <div class="search-box">
                <input 
                    type="text" 
                    bind:value={searchTerm} 
                    placeholder="Search certificates, organizations, or skills..."
                    class="search-input"
                />
                <div class="search-icon">🔍</div>
            </div>
        </div>
        
        <div class="filter-container">
            <div class="filter-label">FILTER_BY:</div>
            <div class="filter-buttons">
                {#each categories as category, i}
                    <button 
                        class="filter-btn" 
                        class:active={selectedCategory === category}
                        in:scale={{ duration: 300, delay: 500 + i * 100, easing: elasticOut }}
                        onclick={() => selectedCategory = category}
                    >
                        {category.replace(' ', '_')}
                    </button>
                {/each}
            </div>
        </div>
    </section>

    <!-- Certificates Grid -->
    <section class="certificates-section" in:fly={{ y: 50, duration: 800, delay: 600, easing: cubicOut }}>
        <div class="certificates-grid">
            {#each filteredCertificates as cert, i (cert.id)}
                <div 
                    class="cert-card" 
                    class:hovered={hoveredCert === cert}
                    class:expanded={expandedCert === cert}
                    style="--cert-color: {cert.color}; --index: {i};"
                    in:scale={{ duration: 600, delay: 700 + i * 100, easing: elasticOut }}
                    onmouseenter={() => hoveredCert = cert}
                    onmouseleave={() => hoveredCert = null}
                    onclick={() => expandedCert = expandedCert === cert ? null : cert}
                    role="button"
                    tabindex="0"
                >
                    <!-- Certificate Icon -->
                    <div class="cert-icon" style="filter: drop-shadow(0 0 10px {cert.color});">
                        {cert.icon}
                    </div>
                    
                    <!-- Certificate Header -->
                    <div class="cert-header">
                        <h3 class="cert-title">{cert.title}</h3>
                        <div class="cert-meta">
                            <span class="level-badge" class:expert={cert.level === 'Expert'} class:advanced={cert.level === 'Advanced'}>
                                {cert.level}
                            </span>
                            <span class="category-tag">{cert.category}</span>
                        </div>
                    </div>
                    
                    <!-- Certificate Info -->
                    <div class="cert-info">
                        <div class="organization">🏢 {cert.organization}</div>
                        <div class="date">📅 {cert.date}</div>
                    </div>
                    
                    <!-- Skills Preview -->
                    <div class="skills-preview">
                        {#each cert.skills.slice(0, 2) as skill}
                            <span class="skill-tag">{skill}</span>
                        {/each}
                        {#if cert.skills.length > 2}
                            <span class="skill-more">+{cert.skills.length - 2}</span>
                        {/if}
                    </div>
                    
                    <!-- Expanded Content -->
                    {#if expandedCert === cert}
                        <div class="expanded-content" in:fade={{ duration: 300 }}>
                            <div class="description">
                                <h4>📋 Description</h4>
                                <p>{cert.description}</p>
                            </div>
                            
                            <div class="all-skills">
                                <h4>🛠️ Skills Covered</h4>
                                <div class="skills-grid">
                                    {#each cert.skills as skill, j}
                                        <span class="skill-pill" in:scale={{ duration: 200, delay: j * 50 }}>
                                            {skill}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                    
                    <!-- View Certificate Button -->
                    <div class="cert-actions">
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" class="view-btn" onclick={stopPropagation(bubble('click'))}>
                            View Certificate →
                        </a>
                    </div>
                    
                    <!-- Glow Effect -->
                    <div class="card-glow" style="background: radial-gradient(circle, {cert.color}20, transparent);"></div>
                </div>
            {/each}
        </div>
        
        {#if filteredCertificates.length === 0}
            <div class="no-results" in:fade={{ duration: 300 }}>
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">No certificates found</div>
                <div class="no-results-hint">Try adjusting your search or filter</div>
            </div>
        {/if}
    </section>
</div>
{/if}

<style>
/* Global Styles */
:global(body) {
    overflow-x: hidden;
    background: #000;
}

/* Matrix Background */
canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.3;
}

/* Main Container */
.main-container {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem 1rem;
    max-width: 1600px;
    margin: 0 auto;
}

/* Hero Section */
.hero-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
}

.certificates-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    color: #00ff00;
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
}

.bracket {
    color: #00bfff;
    text-shadow: 0 0 15px #00bfff;
    animation: bracketPulse 2s ease-in-out infinite;
}

@keyframes bracketPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.glitch {
    position: relative;
    text-shadow: 
        0.05em 0 0 #00fffc, 
        -0.03em -0.04em 0 #fc00ff,
        0.025em 0.04em 0 #fffc00;
    animation: glitch 725ms infinite;
}

@keyframes glitch {
    0% {
        text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
    }
    15% {
        text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
    }
    16% {
        text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00;
    }
    49% {
        text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00;
    }
    50% {
        text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00;
    }
    99% {
        text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00;
    }
    100% {
        text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff, -0.04em -0.025em 0 #fffc00;
    }
}

.subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 300;
    letter-spacing: 0.05em;
    margin-top: 1rem;
}

/* Stats Section */
.stats-section {
    margin-bottom: 3rem;
    text-align: center;
}

.stats-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(0, 255, 0, 0.3);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    max-width: 600px;
    margin: 0 auto;
}

.stat-card {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #00ff00;
    text-shadow: 0 0 20px #00ff00;
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
    background: linear-gradient(to bottom, transparent, #00ff00, transparent);
}

/* Controls Section */
.controls-section {
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
}

/* Search */
.search-container {
    width: 100%;
    max-width: 600px;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(0, 255, 0, 0.3);
    border-radius: 25px;
    color: #fff;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.search-icon {
    position: absolute;
    right: 1rem;
    font-size: 1.2rem;
    color: #00ff00;
    pointer-events: none;
}

/* Filter */
.filter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.filter-label {
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
    letter-spacing: 0.1em;
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    justify-content: center;
}

.filter-btn {
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(0, 255, 0, 0.3);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.filter-btn:hover {
    border-color: #00ff00;
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
    transform: translateY(-2px);
}

.filter-btn.active {
    background: #00ff00;
    border-color: #00ff00;
    color: #000;
    text-shadow: none;
    box-shadow: 0 0 20px #00ff00;
}

/* Certificates Grid */
.certificates-section {
    margin-bottom: 4rem;
}

.certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
}

/* Certificate Cards */
.cert-card {
    position: relative;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    overflow: hidden;
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.cert-card.hovered {
    transform: translateY(-10px) scale(1.02);
    border-color: var(--cert-color);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.7),
        0 0 30px var(--cert-color),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.cert-card.expanded {
    border-color: var(--cert-color);
    box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.6),
        0 0 25px var(--cert-color);
}

/* Card Elements */
.cert-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1.5rem;
    animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.cert-header {
    margin-bottom: 1.5rem;
}

.cert-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
    line-height: 1.3;
    letter-spacing: 0.02em;
}

.cert-meta {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.level-badge {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-transform: uppercase;
}

.level-badge.expert {
    color: #ff4444;
    border-color: #ff4444;
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
}

.level-badge.advanced {
    color: #ffaa00;
    border-color: #ffaa00;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
}

.category-tag {
    background: rgba(255, 255, 255, 0.05);
    color: var(--cert-color);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--cert-color);
    text-shadow: 0 0 10px var(--cert-color);
}

.cert-info {
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
}

.organization, .date {
    margin-bottom: 0.5rem;
}

.skills-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.skill-tag {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.25rem 0.6rem;
    border-radius: 12px;
    font-size: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.skill-more {
    color: var(--cert-color);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    text-shadow: 0 0 10px var(--cert-color);
}

/* Expanded Content */
.expanded-content {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.description {
    margin-bottom: 1.5rem;
}

.description h4, .all-skills h4 {
    color: var(--cert-color);
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    text-shadow: 0 0 10px var(--cert-color);
}

.description p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin: 0;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
}

.skill-pill {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    padding: 0.4rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--cert-color);
    transition: all 0.3s ease;
}

.skill-pill:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

/* Actions */
.cert-actions {
    margin-top: 1.5rem;
}

.view-btn {
    display: inline-block;
    background: linear-gradient(135deg, var(--cert-color), transparent);
    color: var(--cert-color);
    text-decoration: none;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    font-weight: 600;
    border: 2px solid var(--cert-color);
    transition: all 0.3s ease;
    text-shadow: 0 0 10px var(--cert-color);
}

.view-btn:hover {
    background: var(--cert-color);
    color: #000;
    text-shadow: none;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--cert-color);
}

/* Glow Effect */
.card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.cert-card.hovered .card-glow {
    opacity: 0.2;
}

/* No Results */
.no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: rgba(255, 255, 255, 0.6);
}

.no-results-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.no-results-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #00ff00;
}

.no-results-hint {
    font-size: 1rem;
    opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
    .main-container {
        padding: 1rem 0.5rem;
    }
    
    .certificates-title {
        font-size: 2rem;
    }
    
    .certificates-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .cert-card {
        padding: 1.5rem;
    }
    
    .stats-container {
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .stat-divider {
        width: 50px;
        height: 1px;
        background: linear-gradient(to right, transparent, #00ff00, transparent);
    }
    
    .filter-buttons {
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
    }
    
    .filter-btn {
        width: 200px;
        text-align: center;
    }
    
    .controls-section {
        gap: 1.5rem;
    }
}

@media (max-width: 480px) {
    .certificates-title {
        font-size: 1.5rem;
    }
    
    .cert-card {
        padding: 1rem;
    }
    
    .cert-icon {
        font-size: 2.5rem;
    }
    
    .cert-title {
        font-size: 1.2rem;
    }
}
</style>

