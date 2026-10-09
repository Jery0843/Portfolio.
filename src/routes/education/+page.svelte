<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';
import { educations } from '$lib/content/education';
let educationStats = $derived({
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
});

</script>
<SEO
    title="Education & Academic Journey - Jerome Andrew K"
    description="Academic background and qualifications of Jerome Andrew K including MTech Cyber Security, MSc Computer Science, BSc Computer Science, and CEH certification."
    keywords="education, academic, MTech Cyber Security, IIIT SriCity, MSc Computer Science, Loyola College, Jerome Andrew K, cybersecurity education"
    canonical="https://jerome.co.in/education"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

/>
<BreadcrumbSchema pageName="Education" pageUrl="/education" />

<PageHeading index="04" title="Academic Journey" description="Knowledge acquired through formal education and certifications" />
<div class="timeline-list">{#each educations as edu, i}<article class="timeline-entry" data-reveal><div class="timeline-date"><span class="eyebrow">0{i + 1} /</span><p>{edu.duration}</p><span class="muted">{edu.location}</span></div><details class="timeline-detail"><summary><div><span class="eyebrow">{edu.level} / {edu.status}</span><h2>{edu.institution}</h2><p class="large-copy">{edu.degree}</p><p>{edu.description}</p><span class="grade-badge">{edu.grade}</span></div><span class="expand-mark" aria-hidden="true">+</span></summary><div class="expanded-content"><h3>Core Subjects</h3><div class="tags">{#each edu.subjects as subject}<span>{subject}</span>{/each}</div><h3>Skills Acquired</h3><div class="tags">{#each edu.skills as skill}<span>{skill}</span>{/each}</div><h3>Key Achievements</h3><ul class="content-list">{#each edu.achievements as achievement}<li>{achievement}</li>{/each}</ul></div></details></article>{/each}</div>
<div class="stats-bar" data-reveal><div><strong>{educations.length}</strong><span>Qualifications</span></div><div><strong>{educationStats.years}+</strong><span>Years of Study</span></div><div><strong>{educationStats.subjects}+</strong><span>Core Subjects</span></div></div>
