<script lang="ts">
    interface Props {
        pageName: string;
        pageUrl: string;
    }

    let { pageName, pageUrl }: Props = $props();
    
    const baseUrl = 'https://jerome.co.in';
    
    let breadcrumbData = $derived({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            ...(pageName !== 'Home' ? [{
                "@type": "ListItem",
                "position": 2,
                "name": pageName,
                "item": pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`
            }] : [])
        ]
    });
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbData)}<\/script>`}
</svelte:head>
