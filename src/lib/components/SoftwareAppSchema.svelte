<script lang="ts">
    interface Props {
        apps?: Array<{
        name: string;
        url: string;
        description: string;
        category: string;
        operatingSystem?: string;
    }>;
    }

    let { apps = [] }: Props = $props();
    
    let appSchemas = $derived(apps.map(app => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": app.name,
        "url": app.url,
        "description": app.description,
        "applicationCategory": app.category,
        "operatingSystem": app.operatingSystem || "Cross-platform",
        "author": {
            "@type": "Person",
            "name": "Jerome Andrew K",
            "url": "https://jerome.co.in"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    })));
</script>

<svelte:head>
    {#each appSchemas as schema}
        {@html `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`}
    {/each}
</svelte:head>
