<script lang="ts">
import SEO from '$lib/components/SEO.svelte';
import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
import ContactPageSchema from '$lib/components/ContactPageSchema.svelte';
import PageHeading from '$lib/components/PageHeading.svelte';

import { contacts } from '$lib/content/contact';
let formData = $state({ name: '', email: '', subject: '', message: '' });
let sending = $state(false);
let status = $state('');
let error = $state('');
let messageId = $state('');
async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    if (Object.values(formData).some(value => !value.trim())) { error = 'Please complete every field.'; status = 'error'; return; }
    sending = true; status = 'sending'; error = ''; messageId = '';
    try {
        const response = await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const result = await response.json();
        if (!response.ok) throw new Error(response.status === 429 ? 'Rate limit exceeded. Please wait before sending another message.' : result.error || 'Failed to send message');
        status = 'success'; messageId = result.messageId || ''; formData = { name: '', email: '', subject: '', message: '' };
    } catch (cause) { status = 'error'; error = cause instanceof Error ? cause.message : 'Failed to send message. Please try again.'; }
    finally { sending = false; }
}

</script>
<SEO
    title="Contact Jerome Andrew K - Get In Touch | Cybersecurity Consultant"
    description="Contact Jerome Andrew K for cybersecurity consulting, penetration testing services, collaboration opportunities, or professional inquiries. Available via email, LinkedIn, and social platforms."
    keywords="contact Jerome Andrew K, cybersecurity consultant contact, penetration tester hire, security researcher contact, collaboration inquiry"
    canonical="https://jerome.co.in/contact"
    datePublished="2024-01-01"
    dateModified="2026-10-09"

/>
<BreadcrumbSchema pageName="Contact" pageUrl="/contact" />
<ContactPageSchema />

<PageHeading index="07" title="Contact Portal" description="Open a secure channel" />
<div class="contact-layout"><section class="contact-channels" data-reveal><div class="eyebrow"><span class="status-dot"></span>SYSTEM STATUS: ONLINE</div><h2>Direct Channels<span class="heading-dot">.</span></h2>{#each contacts.email as contact}<a class="channel-link" href={contact.isLink ? contact.address : `mailto:${contact.address}`} target={contact.isLink ? '_blank' : undefined} rel="noreferrer"><div><span class="eyebrow">{contact.platform}</span><span>{contact.isLink ? contact.platform : contact.address}</span></div><span>↗</span></a>{/each}<h3 class="social-heading">Social Networks</h3>{#each contacts.social as contact}<a class="channel-link" href={contact.url} target="_blank" rel="noreferrer"><span>{contact.platform}</span><span>↗</span></a>{/each}</section>
<section class="contact-form-panel" data-reveal><div class="eyebrow">SEND A SECURE MESSAGE</div><h2>Get In Touch<span class="heading-dot">.</span></h2><form onsubmit={submit}><div class="form-row"><label for="contact-name">Name<input id="contact-name" name="name" autocomplete="name" required maxlength="100" bind:value={formData.name} placeholder="Your name" /></label><label for="contact-email">Email<input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254" bind:value={formData.email} placeholder="you@example.com" /></label></div><label for="contact-subject">Subject<input id="contact-subject" name="subject" required maxlength="200" bind:value={formData.subject} placeholder="What do you have in mind?" /></label><label for="contact-message">Message<textarea id="contact-message" name="message" required maxlength="1000" rows="6" bind:value={formData.message} placeholder="Tell me about your project..."></textarea></label><button class="button button-primary" type="submit" disabled={sending}>{sending ? 'TRANSMITTING...' : 'SEND SECURE MESSAGE'}<span>↗</span></button><div class="form-status" class:error={status === 'error'} role="status" aria-live="polite">{#if status === 'success'}Message sent successfully.{#if messageId}<span class="message-id">Message ID: {messageId}</span>{/if}{:else if status === 'error'}{error}{:else if sending}Sending your message...{/if}</div></form></section></div>
