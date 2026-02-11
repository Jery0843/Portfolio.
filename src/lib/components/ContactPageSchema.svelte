<script lang="ts">
    const baseUrl = 'https://jerome.co.in';
    
    const contactPageSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Jerome Andrew K",
        "description": "Get in touch with Jerome Andrew K for cybersecurity consulting, penetration testing, or collaboration opportunities.",
        "url": `${baseUrl}/contact`,
        "mainEntity": {
            "@type": "Person",
            "name": "Jerome Andrew K",
            "email": "jeromeandrewk@outlook.com",
            "url": baseUrl,
            "contactPoint": [
                {
                    "@type": "ContactPoint",
                    "contactType": "Professional Services",
                    "email": "jeromeandrewk@outlook.com",
                    "availableLanguage": ["English"],
                    "areaServed": "Worldwide"
                }
            ],
            "sameAs": [
                "https://github.com/Jery0843",
                "https://www.linkedin.com/in/jeromeandrewk/",
                "https://x.com/0xJerry__"
            ]
        }
    };
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(contactPageSchema)}<\/script>`}
</svelte:head>
