<script lang="ts">
    export let type: 'person' | 'website' | 'organization' = 'person';
    
    const baseUrl = 'https://jerome.is-a.dev';
    
    const personData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Jerome Andrew K",
        "url": baseUrl,
        "image": "https://jerome.is-a.dev/logo.jpeg",
        "jobTitle": "Cybersecurity Expert & Ethical Hacker",
        "description": "Cybersecurity Expert & Ethical Hacker specializing in encryption, AI security, penetration testing, and malware analysis.",
        "knowsAbout": [
            "Cybersecurity",
            "Ethical Hacking",
            "Penetration Testing",
            "Network Security",
            "Full-Stack Development",
            "Malware Analysis",
            "Vulnerability Assessment",
            "AI Security",
            "Encryption"
        ],
        "sameAs": [
            "https://github.com/Jery0843",
            "https://www.linkedin.com/in/jeromeandrewk/",
            "https://x.com/0xJerry__",
            "https://0xjerry.is-a.dev"
        ],
        "alumniOf": [
            {
                "@type": "EducationalOrganization",
                "name": "VIT University"
            }
        ],
        "email": "mailto:jeromeandrewk@proton.me"
    };
    
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Jerome Andrew K - Portfolio",
        "url": baseUrl,
        "description": "Professional portfolio showcasing cybersecurity expertise, projects, and experience",
        "author": {
            "@type": "Person",
            "name": "Jerome Andrew K"
        },
        "inLanguage": "en-US",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
    
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Jerome Andrew K",
        "url": baseUrl,
        "logo": "https://jerome.is-a.dev/logo.jpeg",
        "description": "Cybersecurity consulting and penetration testing services",
        "founder": {
            "@type": "Person",
            "name": "Jerome Andrew K"
        },
        "sameAs": [
            "https://github.com/Jery0843",
            "https://www.linkedin.com/in/jeromeandrewk/",
            "https://x.com/0xJerry__"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Professional Services",
            "availableLanguage": ["English"]
        }
    };
    
    const getData = () => {
        switch(type) {
            case 'person':
                return personData;
            case 'website':
                return websiteData;
            case 'organization':
                return organizationData;
            default:
                return personData;
        }
    };
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(getData())}<\/script>`}
</svelte:head>
