<script lang="ts">
    import { page } from '$app/state';
    import { siteUrl, personSchema } from '$lib/seo';
    import { serializeSchema } from '$lib/utils/schema';
    interface Props {
        title?: string;
        description?: string;
        keywords?: string;
        canonical?: string;
        ogImage?: string;
        ogType?: string;
        twitterCard?: string;
        twitterCreator?: string;
        author?: string;
        noindex?: boolean;
        datePublished?: string;
        dateModified?: string;
    }

    let {
        title = 'Jerome Andrew K - Cybersecurity Expert & Ethical Hacker',
        description = 'Jerome Andrew K - Cybersecurity Expert & Ethical Hacker. Specializing in encryption, AI security, penetration testing, and malware analysis. Explore projects, research, and experience.',
        keywords = 'cybersecurity, ethical hacking, penetration testing, security researcher, full-stack developer, Jerome Andrew K, infosec, vulnerability assessment, network security, malware analysis',
        canonical = '',
        ogImage = `${siteUrl}/world/cybercity.webp`,
        ogType = 'website',
        twitterCard = 'summary_large_image',
        twitterCreator = '@0xJerry__',
        author = 'Jerome Andrew K',
        noindex = false,
        datePublished = '',
        dateModified = ''
    }: Props = $props();
    
    const baseUrl = siteUrl;
    let fullCanonical = $derived(new URL(canonical || page.url.pathname, baseUrl).href);
    let fullImage = $derived(new URL(ogImage, baseUrl).href);

    // Structured data describes the same page and person as the visible content.
    let webPageSchema = $derived({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${fullCanonical}#webpage`,
        "name": title,
        "description": description,
        "url": fullCanonical,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            "name": "Jerome Andrew K Portfolio",
            "url": baseUrl
        },
        "author": { "@id": personSchema["@id"], "@type": "Person", "name": author },
        ...(datePublished ? { "datePublished": datePublished } : {}),
        ...(dateModified ? { "dateModified": dateModified } : {})
    });
</script>

<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />
    
    <!-- Robots -->
    {#if noindex}
        <meta name="robots" content="noindex, follow" />
    {:else}
        <meta name="robots" content="index, follow, max-image-preview:large" />
    {/if}
    
    <!-- Canonical URL -->
    <link rel="canonical" href={fullCanonical} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={fullCanonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={fullImage} />
    <meta property="og:image:alt" content="An atmospheric cybercity — Jerome Andrew K’s cybersecurity portfolio" />
    <meta property="og:site_name" content="Jerome Andrew K Portfolio" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content={twitterCard} />
    <meta name="twitter:url" content={fullCanonical} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={fullImage} />
    <meta name="twitter:image:alt" content="An atmospheric cybercity — Jerome Andrew K’s cybersecurity portfolio" />
    <meta name="twitter:creator" content={twitterCreator} />
    <meta name="twitter:site" content={twitterCreator} />
    
    <!-- Additional SEO -->
    <meta name="theme-color" content="#080f10" />
    <meta name="msapplication-TileColor" content="#080f10" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- Language -->
    <meta name="language" content="en" />
    
    <!-- Copyright -->
    <meta name="copyright" content="Jerome Andrew K" />
    
    <!-- Rating -->
    <meta name="rating" content="general" />
    
    <!-- Date Metadata -->
    {#if ogType === 'article' && datePublished}
        <meta property="article:published_time" content={datePublished} />
    {/if}
    {#if ogType === 'article' && dateModified}
        <meta property="article:modified_time" content={dateModified} />
    {/if}
    
    <!-- WebPage Structured Data -->
    {@html `<script type="application/ld+json">${serializeSchema(webPageSchema)}<\/script>`}
</svelte:head>