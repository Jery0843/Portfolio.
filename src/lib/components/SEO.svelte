<script lang="ts">
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
        speakable?: boolean;
    }

    let {
        title = 'Jerome Andrew K - Cybersecurity Expert & Ethical Hacker',
        description = 'Jerome Andrew K - Cybersecurity Expert & Ethical Hacker. Specializing in encryption, AI security, penetration testing, and malware analysis. Explore projects, research, and experience.',
        keywords = 'cybersecurity, ethical hacking, penetration testing, security researcher, full-stack developer, Jerome Andrew K, infosec, vulnerability assessment, network security, malware analysis',
        canonical = '',
        ogImage = 'https://jerome.co.in/logo.jpeg',
        ogType = 'website',
        twitterCard = 'summary_large_image',
        twitterCreator = '@0xJerry__',
        author = 'Jerome Andrew K',
        noindex = false,
        datePublished = '',
        dateModified = '',
        speakable = false
    }: Props = $props();
    
    const baseUrl = 'https://jerome.co.in';
    let fullCanonical = $derived(canonical || baseUrl);

    // WebPage schema with speakable and date metadata
    let webPageSchema = $derived({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": fullCanonical,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Jerome Andrew K Portfolio",
            "url": baseUrl
        },
        "author": {
            "@type": "Person",
            "name": author
        },
        ...(datePublished ? { "datePublished": datePublished } : {}),
        ...(dateModified ? { "dateModified": dateModified } : {}),
        ...(speakable ? {
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": ["h1", ".hero-title", ".cyber-title", ".section-title"]
            }
        } : {})
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
        <meta name="robots" content="noindex, nofollow" />
    {:else}
        <meta name="robots" content="index, follow" />
    {/if}
    
    <!-- Canonical URL -->
    <link rel="canonical" href={fullCanonical} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={fullCanonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:site_name" content="Jerome Andrew K Portfolio" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content={twitterCard} />
    <meta property="twitter:url" content={fullCanonical} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={ogImage} />
    <meta property="twitter:creator" content={twitterCreator} />
    <meta property="twitter:site" content={twitterCreator} />
    
    <!-- Additional SEO -->
    <meta name="theme-color" content="#000000" />
    <meta name="msapplication-TileColor" content="#000000" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- Language -->
    <meta http-equiv="content-language" content="en" />
    
    <!-- Geo Tags (if relevant) -->
    <meta name="geo.region" content="Worldwide" />
    
    <!-- Copyright -->
    <meta name="copyright" content="Jerome Andrew K" />
    
    <!-- Rating -->
    <meta name="rating" content="general" />
    
    <!-- Date Metadata -->
    {#if datePublished}
        <meta property="article:published_time" content={datePublished} />
    {/if}
    {#if dateModified}
        <meta property="article:modified_time" content={dateModified} />
    {/if}
    
    <!-- WebPage Structured Data -->
    {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
</svelte:head>