<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import ProfilePageSchema from '$lib/components/ProfilePageSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';

import { personalInfo, skills, achievements } from '$lib/content/about';
const stories = [
    { title: 'Lab Explorer', text: 'Half my time goes into hacking labs, diving deep into vulnerabilities and mastering new attack vectors.' },
    { title: 'Linux Reviver', text: "The other half into reviving my Linux after I 'accidentally' destroy it while experimenting." },
    { title: 'Learning Philosophy', text: "That's how I learn, grow, and keep the cybersecurity game entertaining. Every broken system teaches me something new." }
];

</script>
<SEO
    title="About Jerome Andrew K - Cybersecurity Expert Profile"
    description="Learn about Jerome Andrew K's background, expertise in cybersecurity, ethical hacking, penetration testing, and achievements. TryHackMe Legend, HackTheBox Pro Hacker, ML Research."
    keywords="about Jerome Andrew K, cybersecurity profile, ethical hacker bio, penetration tester profile, security researcher, TryHackMe Legend"
    canonical="https://jerome.co.in/about"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

/>
<BreadcrumbSchema pageName="About" pageUrl="/about" />
<ProfilePageSchema />

<PageHeading index="01" title="Who Am I?" description="Transforming cybersecurity challenges into innovative solutions..." />
<section class="about-profile" data-reveal>
    <div class="portrait-frame"><div class="portrait-mat"><img src="/profile.webp" alt="Jerome Andrew K" width="400" height="400"/></div><span class="portrait-caption">THE HUMAN / 0xJERRY</span></div>
    <div><div class="eyebrow">{personalInfo.status}</div><h2>{personalInfo.name}</h2><p class="large-copy">{personalInfo.title}</p><div class="profile-facts"><span>{personalInfo.location}</span><a href="mailto:{personalInfo.email}">{personalInfo.email} ↗</a></div></div>
</section>
<section class="story-grid">{#each stories as story, i}<article class="story-card" data-reveal><span class="eyebrow">0{i + 1} / MY JOURNEY</span><h3>{story.title}</h3><p>{story.text}</p></article>{/each}</section>
<blockquote class="journey-quote" data-reveal><p>"Every broken system is a lesson, every exploit is a discovery, and every rebuild makes me stronger."</p><cite>- My Journey in Cybersecurity</cite></blockquote>
<section class="page-section"><div class="section-label"><span>EXPERTISE_MATRIX</span><a href="/skills">ALL SKILLS ↗</a></div><div class="about-skills">{#each skills as skill}<article class="skill-card" data-reveal><span class="eyebrow">{skill.category}</span><h3>{skill.name}</h3><div class="skill-meter"><span style:width={`${skill.level}%`}></span></div><span class="skill-percentage">{skill.level}%</span></article>{/each}</div></section>
<section class="page-section"><div class="section-label"><span>ACHIEVEMENT_LOG</span><span>PLATFORMS / RESEARCH / BUILDS</span></div>{#each achievements as achievement}<article class="achievement-row" data-reveal><span class="eyebrow">{achievement.date}</span><div><h3>{achievement.title}</h3><p>{achievement.description}</p></div>{#if achievement.url}<a href={achievement.url} target="_blank" rel="noreferrer" aria-label={`View ${achievement.title}`}>↗</a>{/if}</article>{/each}</section>
<section class="inner-cta" data-reveal><h2>Ready to Build Something Amazing?</h2><p>Let's collaborate on innovative cybersecurity solutions</p><div class="button-row"><a class="button button-primary" href="/contact">Get In Touch ↗</a><a class="button button-secondary" href="https://xw2f7-my.sharepoint.com/:b:/g/personal/jerry_xw2f7_onmicrosoft_com/Ee3C3TnIxjhMrb2rLEX1koMBMfy7yixqd9EyPxRSKJMNuw?e=Un7NOm" target="_blank" rel="noreferrer">Download Resume ↗</a></div></section>
