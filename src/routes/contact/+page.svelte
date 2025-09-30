<script>
import { onMount } from 'svelte';
import { fade, fly, scale } from 'svelte/transition';
import AnimatedIcon from '$lib/components/AnimatedIcons.svelte';
import SEO from '$lib/components/SEO.svelte';

const contacts = {
    email: [
        { platform: 'Outlook', address: 'jeromeandrewk@outlook.com', icon: '📧', color: '#0078d4' },
        { platform: 'Discord', address: 'https://discord.com/users/1408916757069959231', icon: '💬', color: '#5865F2', isLink: true }
    ],
    social: [
{ platform: 'Github', url: 'https://github.com/Jery0843', icon: '🧑‍💻', color: '#333' },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/jeromeandrewk/', icon: '🔗', color: '#0077b5' },
        { platform: 'X', url: 'https://x.com/0xJerry__', icon: '𝕏', color: '#000000' }
    ]
};

let canvas;
let ctx;
let showContent = false;
let hoveredLink = null;
let typingText = '';
let currentCommandIndex = 0;
let isTyping = false;
let showForm = false;
let formData = { name: '', email: '', subject: '', message: '' };
let formErrors = {};
let isSubmitting = false;
let submitStatus = '';
let messageId = '';
let isRateLimited = false;
let particles = [];

const commands = [
    'Initializing secure connection...',
    'Loading contact protocols...',
    'Scanning available channels...',
    'Contact systems online!',
    'Ready to establish communication.'
];

const initMatrix = () => {
    const fontSize = 12;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = Array(columns).fill(1);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = Math.random() > 0.5 ? '1' : '0';
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    return setInterval(draw, 50);
};

const typeCommand = async (command) => {
    isTyping = true;
    typingText = '';
    
    for (let i = 0; i <= command.length; i++) {
        typingText = command.substring(0, i);
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    isTyping = false;
};

const startTypingSequence = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    for (let i = 0; i < commands.length; i++) {
        await typeCommand(commands[i]);
        currentCommandIndex = i;
    }
    
    // Small delay before hiding terminal and showing content
    await new Promise(resolve => setTimeout(resolve, 1500));
    showContent = true;
    setTimeout(() => showForm = true, 600);
};

const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    formErrors = errors;
    return Object.keys(errors).length === 0;
};

const submitForm = async () => {
    if (!validateForm()) return;
    
    isSubmitting = true;
    submitStatus = 'sending';
    
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            if (response.status === 429) {
                isRateLimited = true;
                throw new Error('Rate limit exceeded. Please wait before sending another message.');
            }
            throw new Error(result.error || 'Failed to send message');
        }
        
        submitStatus = 'success';
        messageId = result.messageId || '';
        formData = { name: '', email: '', subject: '', message: '' };
        
    } catch (error) {
        console.error('Error sending message:', error);
        submitStatus = 'error';
    } finally {
        isSubmitting = false;
        setTimeout(() => submitStatus = '', 4000);
    }
};

const createParticle = (x, y) => {
    return {
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
    };
};

const animateParticles = () => {
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
    
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    }
};

onMount(() => {
    const interval = initMatrix();
    
    // Prevent body scroll during typing animation
    document.body.style.overflow = 'hidden';
    
    startTypingSequence().then(() => {
        // Re-enable scrolling when content is shown
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 500);
    });
    
    return () => {
        clearInterval(interval);
        document.body.style.overflow = 'auto';
    };
});
</script>

<!-- SEO Meta Tags -->
<SEO 
    title="Contact Jerome Andrew K - Get In Touch | Cybersecurity Consultant"
    description="Contact Jerome Andrew K for cybersecurity consulting, penetration testing services, collaboration opportunities, or professional inquiries. Available via email, LinkedIn, and social platforms."
    keywords="contact Jerome Andrew K, cybersecurity consultant contact, penetration tester hire, security researcher contact, collaboration inquiry"
    canonical="https://jerome.is-a.dev/contact"
/>

<canvas bind:this={canvas} class="matrix-bg"></canvas>
<div class="scanline"></div>

<!-- Terminal Typing Animation -->
{#if !showContent}
<div class="typing-terminal" out:fade={{ duration: 500 }}>
    <div class="terminal-window">
        <div class="terminal-header">
            <div class="controls">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <div class="title">secure_contact.sh</div>
        </div>
        <div class="terminal-body">
            <div class="command-prompt">
                <span class="prompt">root@0xjerry:~$</span>
                <span class="typing-text">{typingText}</span>
                {#if isTyping}<span class="cursor-blink">|</span>{/if}
            </div>
        </div>
    </div>
</div>
{/if}

{#if showContent}
<main in:fade={{ duration: 800 }}>
    <!-- Title Section with Glitch Effect -->
    <div class="hero-section" in:fly={{ y: -50, duration: 800, delay: 200 }}>
<h1 class="cyber-title">CONTACT PORTAL</h1>
<p class="cyber-subtitle">Open a secure channel</p>
        <div class="status-bar">
            <span class="status-indicator active"></span>
            <span>SYSTEM STATUS: ONLINE</span>
        </div>
    </div>

    <!-- Interactive Contact Grid -->
    <div class="contact-grid" in:fly={{ y: 50, duration: 800, delay: 400 }}>
        <div class="contact-section">
            <h2 class="section-title">DIRECT CHANNELS</h2>
            <div class="contact-cards">
                {#each contacts.email as contact, i}
                    {#if contact.isLink}
<a 
                            href={contact.address} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="contact-card contact-card-link" 
                            style="--orb: {contact.color}"
                            in:scale={{ duration: 400, delay: 600 + i * 100 }}
                            on:mouseenter={(e) => {
                                hoveredLink = contact;
                                for (let j = 0; j < 5; j++) {
                                    particles.push(createParticle(e.clientX + Math.random() * 20, e.clientY + Math.random() * 20));
                                }
                                if (particles.length === 5) animateParticles();
                            }}
                            on:mouseleave={() => hoveredLink = null}
                        >
<div class="card-header">
                                {#if contact.platform === 'Outlook'}
                                    <div class="icon-wrapper"><AnimatedIcon icon="email" size="24px" /></div>
                                {:else if contact.platform === 'Discord'}
                                    <div class="icon-wrapper"><AnimatedIcon icon="discord" size="24px" /></div>
                                {:else}
                                    <span class="icon">{contact.icon}</span>
                                {/if}
                                <span class="platform">{contact.platform}</span>
                            </div>
<div class="card-overlay"></div>
                        </a>
                    {:else}
<a 
                            href="mailto:{contact.address}" 
                            class="contact-card contact-card-link" 
                            style="--orb: {contact.color}"
                            in:scale={{ duration: 400, delay: 600 + i * 100 }}
                            on:mouseenter={(e) => {
                                hoveredLink = contact;
                                for (let j = 0; j < 5; j++) {
                                    particles.push(createParticle(e.clientX + Math.random() * 20, e.clientY + Math.random() * 20));
                                }
                                if (particles.length === 5) animateParticles();
                            }}
                            on:mouseleave={() => hoveredLink = null}
                        >
<div class="card-header">
                                {#if contact.platform === 'Outlook'}
                                    <div class="icon-wrapper"><AnimatedIcon icon="email" size="24px" /></div>
                                {:else if contact.platform === 'Discord'}
                                    <div class="icon-wrapper"><AnimatedIcon icon="discord" size="24px" /></div>
                                {:else}
                                    <span class="icon">{contact.icon}</span>
                                {/if}
                                <span class="platform">{contact.platform}</span>
                            </div>
<div class="card-overlay"></div>
                        </a>
                    {/if}
                {/each}
            </div>
        </div>

        <div class="contact-section">
            <h2 class="section-title">SOCIAL NETWORKS</h2>
            <div class="contact-cards">
                {#each contacts.social as contact, i}
<a 
                        href={contact.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="contact-card contact-card-link"
                        style="--orb: {contact.color}"
                        in:scale={{ duration: 400, delay: 800 + i * 100 }}
                        on:mouseenter={(e) => {
                            hoveredLink = contact;
                            for (let j = 0; j < 5; j++) {
                                particles.push(createParticle(e.clientX + Math.random() * 20, e.clientY + Math.random() * 20));
                            }
                            if (particles.length === 5) animateParticles();
                        }}
                        on:mouseleave={() => hoveredLink = null}
                    >
                        <div class="card-header">
                            {#if contact.platform === 'Github'}
                                <div class="icon-wrapper"><AnimatedIcon icon="github" size="24px" /></div>
                            {:else if contact.platform === 'LinkedIn'}
                                <div class="icon-wrapper"><AnimatedIcon icon="linkedin" size="24px" /></div>
                            {:else if contact.platform === 'X'}
                                <div class="icon-wrapper"><AnimatedIcon icon="x" size="24px" /></div>
                            {:else}
                                <span class="icon">{contact.icon}</span>
                            {/if}
                            <span class="platform">{contact.platform}</span>
                        </div>
<div class="card-overlay"></div>
                    </a>
                {/each}
            </div>
        </div>
    </div>

    <!-- Interactive Contact Form -->
    {#if showForm}
    <div class="form-section" in:fly={{ y: 100, duration: 800, delay: 200 }}>
<h2 class="section-title">SEND A SECURE MESSAGE</h2>
<form class="contact-form glass" on:submit|preventDefault={submitForm}>
            <div class="form-grid">
                <div class="input-group">
                    <label for="name" class="input-label">NAME</label>
                    <input 
                        type="text" 
                        id="name" 
                        bind:value={formData.name}
                        class="cyber-input"
                        class:error={formErrors.name}
                        placeholder="Your name..."
                    />
                    {#if formErrors.name}
                        <span class="error-message">{formErrors.name}</span>
                    {/if}
                </div>

                <div class="input-group">
                    <label for="email" class="input-label">EMAIL</label>
                    <input 
                        type="email" 
                        id="email" 
                        bind:value={formData.email}
                        class="cyber-input"
                        class:error={formErrors.email}
                        placeholder="your.email@domain.com"
                    />
                    {#if formErrors.email}
                        <span class="error-message">{formErrors.email}</span>
                    {/if}
                </div>
            </div>

            <div class="input-group">
                <label for="subject" class="input-label">SUBJECT</label>
                <input 
                    type="text" 
                    id="subject" 
                    bind:value={formData.subject}
                    class="cyber-input"
                    class:error={formErrors.subject}
                    placeholder="Message subject..."
                />
                {#if formErrors.subject}
                    <span class="error-message">{formErrors.subject}</span>
                {/if}
            </div>

            <div class="input-group">
                <label for="message" class="input-label">MESSAGE</label>
                <textarea 
                    id="message" 
                    bind:value={formData.message}
                    class="cyber-input message-input"
                    class:error={formErrors.message}
                    placeholder="Your secure message..."
                    rows="4"
                ></textarea>
                {#if formErrors.message}
                    <span class="error-message">{formErrors.message}</span>
                {/if}
            </div>

            <button 
                type="submit" 
                class="submit-btn"
                class:loading={isSubmitting}
                disabled={isSubmitting}
            >
                {#if isSubmitting}
                    <span class="loading-spinner"></span>
                    TRANSMITTING...
                {:else}
                    SEND SECURE MESSAGE
                {/if}
            </button>

            {#if submitStatus === 'success'}
                <div class="success-message" in:fade>
                    <div class="success-header">
                        🛡️ Secure transmission completed successfully!
                    </div>
                    {#if messageId}
                        <div class="message-id">Tracking ID: {messageId.substring(0, 8)}***</div>
                    {/if}
                    <div class="security-features">
                        ✓ Encrypted • ✓ Sanitized • ✓ Rate Limited • ✓ Tracked
                    </div>
                </div>
            {/if}
            
            {#if submitStatus === 'error'}
                <div class="error-message-box" in:fade>
                    <div class="error-header">
                        ✗ Transmission failed
                    </div>
                    <div class="error-details">
                        {#if isRateLimited}
                            Rate limit exceeded. Please wait 15 minutes before sending another message.
                        {:else}
                            Please check your input and try again, or contact directly.
                        {/if}
                    </div>
                </div>
            {/if}
        </form>
    </div>
    {/if}
</main>
{/if}

<!-- Particle Canvas for Interactive Effects -->
<canvas class="particle-canvas" width="100" height="100"></canvas>

<style>
    :global(body) {
        background: #000;
        overflow-x: hidden;
    }

    /* Matrix Background */
    .matrix-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        opacity: 0.1;
    }

    .scanline {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ff00, transparent);
        animation: scanline 4s linear infinite;
        z-index: 1000;
        pointer-events: none;
        opacity: 0.6;
    }

    @keyframes scanline {
        0% { transform: translateY(-2px); }
        100% { transform: translateY(100vh); }
    }

    /* Terminal Typing Animation */
    .typing-terminal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        transition: all 0.8s ease;
        pointer-events: none;
    }

    .terminal-window {
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid #00ff00;
        border-radius: 8px;
        min-width: 500px;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    }

    .terminal-header {
        background: rgba(0, 20, 0, 0.8);
        padding: 8px 15px;
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
        min-height: 60px;
    }

    .command-prompt {
        display: flex;
        align-items: center;
        color: #00ff00;
        font-family: 'Source Code Pro', monospace;
        font-size: 1rem;
    }

    .prompt {
        color: #00aa00;
        margin-right: 10px;
    }

    .typing-text {
        color: #00ff00;
    }

    .cursor-blink {
        animation: blink 1s infinite;
        color: #00ff00;
        margin-left: 2px;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }

    /* Main Content */
    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        color: #00ff00;
        font-family: 'Source Code Pro', monospace;
        position: relative;
        z-index: 2;
        width: 100%;
    }
    
    @media (max-width: 1024px) {
        main { padding: 1.5rem 1rem; max-width: 100%; }
    }
    @media (max-width: 768px) {
        main { padding: 1.25rem 0.875rem; }
    }
    @media (max-width: 480px) {
        main { padding: 1rem 0.5rem; }
    }

    /* Hero Section */
    .hero-section {
        text-align: center;
        margin-bottom: 4rem;
        padding: 2rem 0;
    }
    
    @media (max-width: 768px) {
        .hero-section { margin-bottom: 3rem; padding: 1.5rem 0; }
    }
    @media (max-width: 480px) {
        .hero-section { margin-bottom: 2.5rem; padding: 1.25rem 0; }
    }

    .cyber-title {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: bold;
        background: linear-gradient(45deg, #00ff00, #00aa00, #00ff00);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        margin-bottom: 1rem;
        animation: glow-pulse 2s ease-in-out infinite alternate;
        word-break: break-word;
    }
    
    @media (max-width: 480px) {
        .cyber-title { margin-bottom: 0.75rem; }
    }

    .cyber-subtitle {
        font-size: clamp(1.05rem, 2.5vw, 1.3rem);
        color: #00aa00;
        margin-bottom: 2rem;
        opacity: 0.9;
    }
    
    @media (max-width: 768px) {
        .cyber-subtitle { margin-bottom: 1.5rem; }
    }
    @media (max-width: 480px) {
        .cyber-subtitle { margin-bottom: 1.25rem; }
    }

    .status-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 0.9rem;
        color: #00cc00;
    }

    .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff0000;
        animation: pulse 2s infinite;
    }

    .status-indicator.active {
        background: #00ff00;
        box-shadow: 0 0 10px #00ff00;
    }

    @keyframes glow-pulse {
        from { text-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
        to { text-shadow: 0 0 40px rgba(0, 255, 0, 0.8); }
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    /* Contact Grid */
    .contact-grid {
        display: grid;
        gap: 3rem;
        margin-bottom: 4rem;
    }
    
    @media (max-width: 1024px) {
        .contact-grid { gap: 2.5rem; margin-bottom: 3.5rem; }
    }
    @media (max-width: 768px) {
        .contact-grid { gap: 2rem; margin-bottom: 3rem; }
    }
    @media (max-width: 480px) {
        .contact-grid { gap: 1.75rem; margin-bottom: 2.5rem; }
    }

    .contact-section {
        margin-bottom: 2rem;
    }

    .section-title {
        font-size: clamp(1.4rem, 3vw, 1.8rem);
        color: #00ff00;
        margin-bottom: 2rem;
        text-align: center;
        position: relative;
        padding-bottom: 10px;
    }
    
    @media (max-width: 768px) {
        .section-title { margin-bottom: 1.5rem; }
    }
    @media (max-width: 480px) {
        .section-title { margin-bottom: 1.25rem; padding-bottom: 8px; }
    }

    .section-title::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ff00, transparent);
    }

    .contact-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
        justify-content: center;
    }
    @media (max-width: 768px) {
        .contact-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    }
    @media (max-width: 480px) {
        .contact-cards { grid-template-columns: 1fr 1fr; }
    }
    
    /* Make direct channels more flexible for multiple items */
    .contact-section:first-child .contact-cards {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        max-width: 800px;
        margin: 0 auto;
    }

.contact-card {
        background: rgba(0, 0, 0, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 9999px;
        padding: 1rem;
        width: 140px;
        height: 140px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        backdrop-filter: blur(14px);
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 28px rgba(0,0,0,0.35);
        margin: 0 auto;
}
@media (max-width: 768px) {
    .contact-card { width: 120px; height: 120px; }
}
@media (max-width: 480px) {
    .contact-card { width: 104px; height: 104px; }
}
    
    .contact-card-link {
        text-decoration: none;
        color: inherit;
    }
    
    .contact-card-link:visited {
        color: inherit;
    }

    .contact-card::before {
        content: '';
        position: absolute;
        inset: -40% -20% -40% -20%;
        background: radial-gradient(50% 50% at 50% 50%, rgba(16,185,129,0.15), transparent 60%);
        filter: blur(18px);
        transform: scale(0);
        transition: transform 300ms ease;
    }

.contact-card:hover {
        transform: translateY(-6px) scale(1.03);
        border-color: var(--orb, #10b981);
        box-shadow: 0 14px 34px rgba(0,0,0,0.45), 0 0 26px var(--orb, rgba(16,185,129,0.35));
    }

    .contact-card:hover::before {
        transform: scale(1);
    }

    .card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-bottom: 0.25rem;
    }

.icon {
        font-size: 1.9rem;
        transition: all 0.3s ease;
        filter: drop-shadow(0 0 10px var(--orb, #10b981));
    }
    .icon-svg { width: 28px; height: 28px; fill: currentColor; color: #e5fff4; filter: drop-shadow(0 0 10px var(--orb, #10b981)); }

    .contact-card:hover .icon {
        transform: scale(1.1) rotate(5deg);
    }

    .platform {
        font-size: 0.9rem;
        font-weight: 700;
        color: #e5fff4;
        font-family: 'Orbitron', monospace;
        letter-spacing: 0.08em;
    }

    .contact-info { display: none; }


    .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 0, 0.1) 0%,
            transparent 50%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .contact-card:hover .card-overlay {
        opacity: 1;
    }

    /* Form Section */
    .form-section {
        background: rgba(0, 20, 0, 0.8);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 12px;
        padding: 3rem;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
    }
    
    @media (max-width: 1024px) {
        .form-section { padding: 2.5rem; }
    }
    @media (max-width: 768px) {
        .form-section { padding: 2rem 1.5rem; border-radius: 10px; }
    }
    @media (max-width: 480px) {
        .form-section { padding: 1.75rem 1.25rem; border-radius: 8px; }
    }

    .form-section::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #00ff00, transparent, #00ff00);
        border-radius: 12px;
        z-index: -1;
        opacity: 0.3;
        animation: border-glow 3s linear infinite;
    }

    @keyframes border-glow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
    }

    .contact-form {
        max-width: 600px;
        margin: 0 auto;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .form-grid { grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
    }
    @media (max-width: 480px) {
        .form-grid { gap: 1rem; margin-bottom: 1rem; }
    }

    .input-group {
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .input-group { margin-bottom: 1.25rem; }
    }
    @media (max-width: 480px) {
        .input-group { margin-bottom: 1rem; }
    }

    .input-label {
        display: block;
        color: #00ff00;
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .cyber-input {
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 4px;
        padding: 12px 15px;
        color: #00ff00;
        font-family: 'Source Code Pro', monospace;
        font-size: 1rem;
        transition: all 0.3s ease;
        outline: none;
        box-sizing: border-box;
    }
    
    @media (max-width: 768px) {
        .cyber-input { padding: 11px 13px; font-size: 0.95rem; }
    }
    @media (max-width: 480px) {
        .cyber-input { padding: 10px 12px; font-size: 0.9rem; }
    }

    .cyber-input:focus {
        border-color: #00ff00;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        background: rgba(0, 20, 0, 0.5);
    }

    .cyber-input::placeholder {
        color: rgba(0, 255, 0, 0.5);
    }

    .cyber-input.error {
        border-color: #ff0000;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
    }

    .message-input {
        min-height: 100px;
        max-height: 200px;
        resize: vertical;
        font-family: 'Source Code Pro', monospace;
        line-height: 1.5;
    }

    .error-message {
        color: #ff4444;
        font-size: 0.8rem;
        margin-top: 5px;
        display: block;
    }

    .submit-btn {
        background: linear-gradient(45deg, #00aa00, #00ff00);
        border: none;
        border-radius: 6px;
        padding: 15px 40px;
        color: #000;
        font-family: 'Source Code Pro', monospace;
        font-size: 1rem;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        width: 100%;
        margin-top: 1rem;
    }

    .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 255, 0, 0.3);
    }

    .submit-btn:active {
        transform: translateY(0);
    }

    .submit-btn.loading {
        opacity: 0.8;
        cursor: not-allowed;
    }

    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #000;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        margin-right: 10px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .success-message {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff00;
        border-radius: 6px;
        padding: 20px;
        color: #00ff00;
        text-align: center;
        margin-top: 1rem;
        animation: success-glow 0.5s ease;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
    }
    
    .success-header {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 8px;
    }
    
    .message-id {
        font-size: 0.8rem;
        color: #00aa00;
        margin: 5px 0;
        font-family: 'Source Code Pro', monospace;
    }
    
    .security-features {
        font-size: 0.75rem;
        color: #00aa00;
        margin-top: 8px;
        opacity: 0.8;
    }
    
    .error-message-box {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid #ff4444;
        border-radius: 6px;
        padding: 20px;
        color: #ff4444;
        text-align: center;
        margin-top: 1rem;
        animation: error-glow 0.5s ease;
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
    }
    
    .error-header {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 8px;
    }
    
    .error-details {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    @keyframes success-glow {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes error-glow {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }

    /* Particle Canvas */
    .particle-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .typing-terminal .terminal-window {
            min-width: 90vw;
            margin: 0 20px;
        }
        
        .contact-section:first-child .contact-cards {
            max-width: 100%;
            grid-template-columns: 1fr;
        }
        
        .platform { font-size: 0.85rem; }
        .icon { font-size: 1.75rem; }
        .icon-svg { width: 26px; height: 26px; }
    }
    
    @media (max-width: 640px) {
        .typing-terminal .terminal-window {
            min-width: 94vw;
            margin: 0 12px;
        }
        
        .terminal-header { padding: 7px 12px; }
        .terminal-body { padding: 16px; }
        .command-prompt { font-size: 0.95rem; }
    }

    @media (max-width: 480px) {
        .typing-terminal .terminal-window {
            min-width: 96vw;
            margin: 0 8px;
        }
        
        .terminal-header { padding: 6px 10px; }
        .controls { gap: 4px; }
        .dot { width: 10px; height: 10px; }
        .title { font-size: 0.85rem; }
        .terminal-body { padding: 14px; min-height: 50px; }
        .command-prompt { font-size: 0.875rem; }
        
        .platform { font-size: 0.8rem; }
        .icon { font-size: 1.6rem; }
        .icon-svg { width: 24px; height: 24px; }
    }
</style>

