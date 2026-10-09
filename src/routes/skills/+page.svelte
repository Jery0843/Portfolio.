<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';

import { categories, skills } from '$lib/content/skills';
let selectedCategory = $state('All');
let filtered = $derived(selectedCategory === 'All' ? skills : skills.filter(skill => skill.category === selectedCategory));

</script>
<SEO
    title="Technical Skills Matrix - Jerome Andrew K"
    description="Comprehensive technical skills of Jerome Andrew K including offensive security, web development, AI/ML, and cloud infrastructure."
    keywords="skills, technical skills, penetration testing, web development, Python, cybersecurity, Jerome Andrew K"
    canonical="https://jerome.co.in/skills"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

/>
<BreadcrumbSchema pageName="Skills" pageUrl="/skills" />

<PageHeading index="05" title="Skills Matrix" description="Comprehensive Technical Arsenal" />
<div class="stats-bar" data-reveal><div><strong>{skills.length}</strong><span>Total Skills</span></div><div><strong>{categories.length - 1}</strong><span>Categories</span></div><div><strong>{Math.round(skills.reduce((total, skill) => total + skill.level, 0) / skills.length)}%</strong><span>Avg Proficiency</span></div></div>
<div class="filter-bar" aria-label="Skill categories">{#each categories as category}<button class:active={selectedCategory === category.name} aria-pressed={selectedCategory === category.name} onclick={() => selectedCategory = category.name}>{category.name}</button>{/each}</div>
<p class="results-count" aria-live="polite">{filtered.length} skills / {selectedCategory}</p>
<div class="skills-grid">{#each filtered as skill (skill.name)}<article class="skill-card"><div class="eyebrow">{skill.category}</div><h2>{skill.name}</h2><p>{skill.description}</p><div class="skill-meter" role="meter" aria-label={`${skill.name} proficiency`} aria-valuenow={skill.level} aria-valuemin="0" aria-valuemax="100"><span style:width={`${skill.level}%`}></span></div><span class="skill-percentage">{skill.level}%</span></article>{/each}</div>
