<script lang="ts">
    import SEO from '$lib/components/SEO.svelte';
    import StructuredData from '$lib/components/StructuredData.svelte';
    import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
    import { personalInfo, skills, navigationLinks } from '$lib/content/home';
    import { projects } from '$lib/content/projects';
    const featured = projects.filter(p => p.category !== 'Capture The Flag').slice(0, 3);
</script>
<SEO title="Jerome Andrew K - Cybersecurity Expert & Ethical Hacker | Portfolio" description="Welcome to Jerome Andrew K's portfolio. Cybersecurity expert specializing in ethical hacking, penetration testing, network security, and full-stack development. Explore my projects and expertise." canonical="https://jerome.co.in" datePublished="2024-01-01" dateModified="2026-10-09" />
<StructuredData type="person" /><StructuredData type="website" /><BreadcrumbSchema pageName="Home" pageUrl="https://jerome.co.in" />
<section class="hero">
    <div class="hero-top-note" aria-hidden="true">AN EXPLORATION OF THE UNSEEN</div>
    <div class="hero-copy">
        <div class="eyebrow hero-kicker"><span class="status-dot"></span>{personalInfo.status}<span class="kicker-divider">/</span>THE WORLD OF 0xJERRY</div>
        <h1 aria-label={personalInfo.name}><span>Jerome</span><span class="name-second">Andrew <em>K.</em></span></h1>
        <p class="hero-role">{personalInfo.title}</p>
        <div class="hero-actions"><a href="/projects" class="button button-primary">View My Work <span>↗</span></a><a href="/about" class="hero-intro-link">Explore Portfolio <span>→</span></a></div>
    </div>
    <div class="world-caption" aria-hidden="true"><span class="caption-diamond">◇</span><span>THE QUIETER YOU BECOME,<br/>THE MORE YOU CAN HEAR.</span></div>
    <div class="hero-bottom"><a href="#intro" class="scroll-cue"><span>↓</span>SCROLL INTO THE UNKNOWN</a><span class="hero-location">{personalInfo.location}</span></div>
    <span class="hero-side-label" aria-hidden="true">SECURITY · CURIOSITY · CREATION</span>
</section>
<section id="intro" class="chapter intro-section">
    <div class="chapter-marker" data-reveal><span>Ⅰ</span><p>THE HUMAN<br/>BEHIND THE TERMINAL</p></div>
    <div class="intro-grid">
        <div class="portrait-frame" data-drift><div class="portrait-mat"><img src="/profile.webp" alt="Jerome Andrew K" width="400" height="400" loading="lazy" /></div><span class="portrait-caption">JEROME ANDREW K / 0xJERRY</span><span class="portrait-symbol" aria-hidden="true">#</span></div>
        <div class="intro-copy" data-reveal><div class="eyebrow">Quick Intro</div><h2>Curiosity is<br/>my <em>source code.</em></h2><p>Cybersecurity researcher and penetration tester with a passion for ethical hacking and secure development. I specialize in finding vulnerabilities and building defensive solutions to protect digital infrastructure.</p><a href="/about" class="underlined-link">More about me <span>↗</span></a></div>
    </div>
    <div class="chapter-whisper" aria-hidden="true">Look closer.</div>
</section>
<section class="chapter work-section">
    <div class="chapter-marker" data-reveal><span>Ⅱ</span><p>ARTIFACTS<br/>FROM THE LAB</p></div>
    <div class="section-title-row" data-reveal><h2>Ideas, brought<br/><em>into existence.</em></h2><a href="/projects" class="underlined-link">All Projects ↗</a></div>
    <div class="featured-list">{#each featured as project, i}<a href="/projects?project={project.id}" class="featured-entry" data-reveal><span class="featured-index">0{i + 1}</span><div class="featured-description"><span class="eyebrow">{project.category}</span><h3>{project.title}</h3><p>{project.overview}</p></div><div class="featured-window window-{i}" aria-hidden="true"><img src={`/world/${['skills', 'certificates', 'experience'][i]}.webp`} alt="" width="1672" height="941" loading="lazy"/><span>{project.category}</span></div><span class="featured-arrow" aria-hidden="true">↗</span></a>{/each}</div>
</section>
<section class="chapter expertise-section">
    <div class="chapter-marker" data-reveal><span>Ⅲ</span><p>A MIND<br/>WITH MANY TOOLS</p></div>
    <div class="expertise-grid"><div data-reveal><div class="eyebrow">Skills & Expertise</div><h2>Built on<br/><em>understanding.</em></h2><a href="/skills" class="underlined-link">Full Skills Matrix ↗</a></div><div class="skill-rows">{#each skills as skill, i}<div class="skill-row" data-reveal><span class="eyebrow">0{i + 1}</span><h3>{skill.name}</h3><span class="skill-value">{skill.level}<small>%</small></span></div>{/each}</div></div>
</section>
<section class="chapter explore-section">
    <div class="chapter-marker" data-reveal><span>Ⅳ</span><p>CHOOSE YOUR<br/>NEXT CHAPTER</p></div>
    <div class="eyebrow" data-reveal>Explore Portfolio</div>
    <div class="directory-grid">{#each navigationLinks as link, i}<a href={link.url} class="directory-card" data-reveal><span class="directory-number">0{i + 1}</span><h3>{link.name}<span>↗</span></h3><p>{link.description}</p></a>{/each}</div>
</section>
<section class="contact-cta chapter" data-reveal><div class="eyebrow"><span class="status-dot"></span>{personalInfo.status}</div><h2>Ready to Work<br/><em>Together?</em></h2><p>Let's discuss your cybersecurity needs or development projects</p><a href="/contact" class="button button-primary">Get In Touch <span>↗</span></a><span class="closing-mark" aria-hidden="true">&gt;_</span></section>
