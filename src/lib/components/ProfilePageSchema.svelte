<script lang="ts">
    import { siteUrl, personSchema } from '$lib/seo';
    import { serializeSchema } from '$lib/utils/schema';
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/about#profile`,
        url: `${siteUrl}/about`,
        name: `About ${personSchema.name}`,
        mainEntity: personSchema,
        dateModified: '2026-10-09'
    };
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${serializeSchema(schema)}<\/script>`}
</svelte:head>
