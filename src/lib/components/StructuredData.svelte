<script lang="ts">
    import { personSchema, websiteSchema } from '$lib/seo';
    import { serializeSchema } from '$lib/utils/schema';
    let { type = 'person' }: { type?: 'person' | 'website' } = $props();
    let schema = $derived({
        '@context': 'https://schema.org',
        ...(type === 'person' ? personSchema : websiteSchema)
    });
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${serializeSchema(schema)}<\/script>`}
</svelte:head>
