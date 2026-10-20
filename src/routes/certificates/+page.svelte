<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import CredentialSchema from '$lib/components/CredentialSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';

import { certificates } from '$lib/content/certificates';
import { portfolioDate } from '$lib/utils/dates';
let category = $state('All');
let query = $state('');
const categories = ['All', ...new Set(certificates.map(c => c.category))];
let filtered = $derived(certificates.filter(c => (category === 'All' || c.category === category) && [c.title, c.organization, ...c.skills].some(value => value.toLowerCase().includes(query.toLowerCase()))).sort((a, b) => portfolioDate(b.date) - portfolioDate(a.date)));

</script>
<SEO
    title="Certificates & Certifications - Jerome Andrew K"
    description="Professional certifications and achievements of Jerome Andrew K in cybersecurity, ethical hacking, AI, and web security."
    keywords="certificates, certifications, cybersecurity, ethical hacking, CEH, Jerome Andrew K"
    canonical="https://jerome.co.in/certificates"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

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

<PageHeading index="06" title="Certifications" description="Digital credentials and professional achievements" />
<div class="stats-bar" data-reveal><div><strong>{certificates.length}</strong><span>Total Certificates</span></div><div><strong>{categories.length - 1}</strong><span>Categories</span></div><div><strong>{certificates.filter(c => c.date.includes(String(new Date().getFullYear()))).length}</strong><span>This Year</span></div></div>
<div class="search-field"><label for="certificate-search">Search certificates</label><input id="certificate-search" type="search" bind:value={query} placeholder="Search by title, organization, or skill..." /></div>
<div class="filter-bar" aria-label="Certificate categories">{#each categories as item}<button class:active={category === item} aria-pressed={category === item} onclick={() => category = item}>{item}</button>{/each}</div>
<p class="results-count" aria-live="polite">{filtered.length} certificates / latest first</p>
<div class="certificate-grid">{#each filtered as cert (cert.id)}<article class="certificate-card"><div class="certificate-top"><span class="eyebrow">{cert.organization}</span><span class="certificate-seal" aria-hidden="true">✳&#xFE0E;</span></div><h2>{cert.title}</h2><div class="project-meta"><span>{cert.date}</span><span>{cert.level}</span></div><p>{cert.description}</p><details><summary>Skills & details <span class="expand-mark">+</span></summary><div class="tags">{#each cert.skills as skill}<span>{skill}</span>{/each}</div><p class="eyebrow">{cert.category}</p></details>{#if cert.link}<a href={cert.link} target="_blank" rel="noreferrer" class="credential-link">Verify Certificate <span>↗</span></a>{/if}</article>{:else}<div class="empty-state"><h2>No matching certificates</h2><p>Try another search or category.</p><button class="button button-secondary" onclick={() => { query = ''; category = 'All'; }}>Clear filters</button></div>{/each}</div>
