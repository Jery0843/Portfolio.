<script lang="ts">
    import { serializeSchema } from '$lib/utils/schema';
    interface Props {
        projects?: Array<{
        title: string;
        url: string;
        overview: string;
        icon: string;
        category: string;
    }>;
    }

    let { projects = [] }: Props = $props();
    
    const baseUrl = 'https://jerome.co.in';
    
    let itemListSchema = $derived({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Jerome Andrew K's Projects & CTF Challenges",
        "description": "Cybersecurity projects, tools, and CTF challenge writeups by Jerome Andrew K",
        "url": `${baseUrl}/projects`,
        "numberOfItems": projects.length,
        "itemListElement": projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": project.title,
            "url": project.url,
            "description": project.overview.substring(0, 160)
        }))
    });
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${serializeSchema(itemListSchema)}<\/script>`}
</svelte:head>
