<script lang="ts">
    import { page } from '$app/state';
    import SEO from '$lib/components/SEO.svelte';
    import PageHeading from '$lib/components/PageHeading.svelte';
</script>

<SEO title={`${page.status} — Jerome Andrew K`} description="This page could not be loaded. Return to Jerome Andrew K’s portfolio." noindex />
<PageHeading index={String(page.status)} title={page.status === 404 ? 'Page not found' : 'Something went wrong'} description={page.error?.message ?? 'Please try again.'} />
<a class="button button-primary" href="/">Back to home <span>↗</span></a>
