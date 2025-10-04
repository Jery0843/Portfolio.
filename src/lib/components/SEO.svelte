<script lang="ts">
    export let title: string = 'Jerome Andrew K - Cybersecurity Expert & Ethical Hacker';
    export let description: string = 'Jerome Andrew K - Cybersecurity Expert & Ethical Hacker. Specializing in encryption, AI security, penetration testing, and malware analysis. Explore projects, research, and experience.';
    export let keywords: string = 'cybersecurity, ethical hacking, penetration testing, security researcher, full-stack developer, Jerome Andrew K, infosec, vulnerability assessment, network security, malware analysis';
    export let canonical: string = '';
    export let ogImage: string = 'https://jerome.is-a.dev/logo.jpeg';
    export let ogType: string = 'website';
    export let twitterCard: string = 'summary_large_image';
    export let twitterCreator: string = '@0xJerry__';
    export let author: string = 'Jerome Andrew K';
    export let noindex: boolean = false;
    
    const baseUrl = 'https://jerome.is-a.dev';
    const fullCanonical = canonical || baseUrl;
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
</svelte:head>