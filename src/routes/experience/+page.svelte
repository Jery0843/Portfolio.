<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';
import { experiences } from '$lib/content/experience';
let experienceStats = $derived({
    companies: experiences.length,
    technologies: [...new Set(experiences.flatMap(exp => exp.skills))].length,
    // Calculate approximate months from experience durations
    months: experiences.reduce((total, exp) => {
        const parts = exp.duration.split(' – ');
        if (parts.length === 2) {
            const monthMap = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
            const replaceMonth = (s: string) => { for (const [k, v] of Object.entries(monthMap)) s = s.replace(k, v); return s; };
            const start = new Date(replaceMonth(parts[0].trim()));
            const end = parts[1].trim() === 'Present' ? new Date() : new Date(replaceMonth(parts[1].trim()));
            const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
            return total + (months > 0 ? months : 1);
        }
        return total + 1;
    }, 0)
});

</script>
<SEO
    title="Professional Experience - Jerome Andrew K"
    description="Professional experience and internships of Jerome Andrew K in data analytics, web development, and cybersecurity."
    keywords="experience, internship, data analytics, web development, Jerome Andrew K, professional journey"
    canonical="https://jerome.co.in/experience"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

/>
<BreadcrumbSchema pageName="Experience" pageUrl="/experience" />

<PageHeading index="03" title="Professional Experience" description="Building expertise through hands-on experience" />
<div class="timeline-list">{#each experiences as exp, i}<article class="timeline-entry" data-reveal><div class="timeline-date"><span class="eyebrow">0{i + 1} /</span><p>{exp.duration}</p><span class="muted">{exp.location}</span></div><details class="timeline-detail"><summary><div><span class="eyebrow">{exp.type}</span><h2>{exp.company}</h2><p class="large-copy">{exp.position}</p></div><span class="expand-mark" aria-hidden="true">+</span></summary><div class="expanded-content"><h3>Key Achievements</h3><ul class="content-list">{#each exp.achievements as achievement}<li>{achievement}</li>{/each}</ul><h3>Technologies & Skills</h3><div class="tags">{#each exp.skills as skill}<span>{skill}</span>{/each}</div><h3>Impact</h3><p>{exp.impact}</p></div></details></article>{/each}</div>
<div class="stats-bar" data-reveal><div><strong>{experiences.length}</strong><span>Companies</span></div><div><strong>{experienceStats.months}</strong><span>Months Experience</span></div><div><strong>{experienceStats.technologies}+</strong><span>Technologies</span></div></div>
