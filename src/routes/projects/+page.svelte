<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import ItemListSchema from '$lib/components/ItemListSchema.svelte';
import SoftwareAppSchema from '$lib/components/SoftwareAppSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';

import { onMount } from 'svelte';
import { page } from '$app/state';
import { projects } from '$lib/content/projects';
import { portfolioDate } from '$lib/utils/dates';
const projectScenes: Record<string, string> = { 'Penetration Testing': 'skills', 'Cybersecurity Tool': 'certificates', 'Machine Learning': 'experience', 'Security Application': 'projects', 'Capture The Flag': 'cybercity' };
let view = $state('projects');
let category = $state('all');
let selected = $state<(typeof projects)[number] | null>(null);
let dialog: HTMLDialogElement;
let base = $derived(projects.filter(p => view === 'ctfs' ? p.category === 'Capture The Flag' : p.category !== 'Capture The Flag'));
let categories = $derived(['all', ...new Set(base.map(p => p.category))]);
let filtered = $derived(base.filter(p => category === 'all' || p.category === category).sort((a, b) => portfolioDate(b.duration) - portfolioDate(a.duration)));
function changeView(value: string) { view = value; category = 'all'; }
$effect(() => { if (selected && dialog && !dialog.open) dialog.showModal(); else if (!selected && dialog?.open) dialog.close(); });
onMount(() => { const id = Number(page.url.searchParams.get('project')); const project = projects.find(p => p.id === id); if (project) { view = project.category === 'Capture The Flag' ? 'ctfs' : 'projects'; selected = project; } });

</script>
<SEO
    title="Projects - Jerome Andrew K | Cybersecurity Projects & CTF Challenges"
    description="Explore Jerome Andrew K's cybersecurity projects including SecureHive encryption tool, CTF challenges from HackTheBox & TryHackMe, machine learning research, and penetration testing work."
    keywords="cybersecurity projects, CTF writeups, HackTheBox, TryHackMe, SecureHive, ethical hacking projects, penetration testing projects, security tools"
    canonical="https://jerome.co.in/projects"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

/>
<BreadcrumbSchema pageName="Projects" pageUrl="/projects" />
<ItemListSchema projects={projects} />
<SoftwareAppSchema apps={[
    { name: 'SecureHive', url: 'https://securehive.securenotepad.tech/', description: 'Python-based file and folder encryption application with AES encryption, RSA key management, and cross-platform GUI.', category: 'SecurityApplication', operatingSystem: 'Windows, macOS, Linux' },
    { name: 'TorForge', url: 'https://github.com/jery0843/torforge', description: 'Transparent Tor proxy with AI-powered circuit selection, post-quantum encryption, and steganography mode.', category: 'SecurityApplication', operatingSystem: 'Linux' },
    { name: 'Kali Secure Notepad', url: 'https://securenotepad.tech/', description: 'Privacy-focused note-taking app with zero-knowledge encryption, tamper detection, and real-time security monitoring.', category: 'SecurityApplication', operatingSystem: 'Cross-platform' }
]} />

<PageHeading index="02" title="Projects" description="Cybersecurity tools, research projects, and development work" />
<div class="view-toggle" aria-label="Project type"><button class:active={view === 'projects'} aria-pressed={view === 'projects'} onclick={() => changeView('projects')}>Projects <span>{projects.filter(p => p.category !== 'Capture The Flag').length}</span></button><button class:active={view === 'ctfs'} aria-pressed={view === 'ctfs'} onclick={() => changeView('ctfs')}>CTFs <span>{projects.filter(p => p.category === 'Capture The Flag').length}</span></button></div>
<div class="filter-bar" aria-label="Project categories">{#each categories as item}<button class:active={category === item} aria-pressed={category === item} onclick={() => category = item}>{item === 'all' ? 'All' : item}</button>{/each}</div>
<p class="results-count" aria-live="polite">{filtered.length} {view === 'ctfs' ? 'CTFs' : 'projects'} / {new Set(filtered.flatMap(p => p.technologies)).size} technologies</p>
<div class="project-grid">{#each filtered as project, i (project.id)}<article class="project-card"><button class="project-open" onclick={() => selected = project} aria-label={`Explore ${project.title}`}><div class="project-art scene-{i % 3}" aria-hidden="true"><img src={`/world/${project.title === 'TorForge' ? 'contact' : projectScenes[project.category] ?? 'projects'}.webp`} alt="" width="1672" height="941" loading="lazy"/><span class="art-code">{String(i + 1).padStart(2, '0')}</span><span class="art-label">{project.category}</span></div><div class="project-card-body"><div class="eyebrow">{project.duration}<span>↗</span></div><h2>{project.title}</h2><div class="project-meta"><span>{project.status}</span><span>{project.difficulty}</span></div><p class="project-preview">{project.overview}</p><div class="tags">{#each project.technologies.slice(0, 3) as tech}<span>{tech}</span>{/each}{#if project.technologies.length > 3}<span>+{project.technologies.length - 3}</span>{/if}</div><span class="project-explore">Click to explore <span>→</span></span></div></button></article>{/each}</div>
<dialog data-lenis-prevent bind:this={dialog} class="project-dialog" aria-labelledby="project-detail-title" onclose={() => selected = null}>
    {#if selected}<div class="dialog-top"><span class="eyebrow">{selected.category} / {selected.duration}</span><button class="text-button" onclick={() => selected = null} aria-label="Close project details">CLOSE ×</button></div><h2 id="project-detail-title">{selected.title}</h2><p class="muted">{selected.affiliation}</p><div class="project-meta"><span>{selected.status}</span><span>{selected.difficulty}</span></div><a class="underlined-link" href={selected.url} target="_blank" rel="noreferrer">View Project ↗</a><div class="detail-section"><h3>Project Overview</h3><p>{selected.overview}</p></div><div class="detail-section"><h3>Technologies Used</h3><div class="tags">{#each selected.technologies as tech}<span>{tech}</span>{/each}</div></div><div class="detail-section"><h3>Key Achievements</h3><ul class="content-list">{#each selected.achievements as achievement}<li>{achievement}</li>{/each}</ul></div><div class="detail-section"><h3>Skills Developed</h3><div class="tags">{#each selected.skills as skill}<span>{skill}</span>{/each}</div></div><div class="detail-section"><h3>Project Impact</h3><p>{selected.impact}</p></div>{/if}
</dialog>
