<script lang="ts">
    const baseUrl = 'https://jerome.co.in';
    
    const profilePageSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "name": "Jerome Andrew K",
            "alternateName": "0xJerry",
            "url": baseUrl,
            "image": "https://jerome.co.in/logo.jpeg",
            "jobTitle": "Cybersecurity Expert & Ethical Hacker",
            "description": "Cybersecurity researcher and penetration tester specializing in ethical hacking, AI security, and malware analysis.",
            "knowsAbout": [
                "Cybersecurity", "Ethical Hacking", "Penetration Testing",
                "Network Security", "Full-Stack Development", "Malware Analysis",
                "Vulnerability Assessment", "AI Security", "Encryption",
                "Machine Learning", "Web Security", "OSINT"
            ],
            "hasCredential": [
                {
                    "@type": "EducationalOccupationalCredential",
                    "name": "Certified Ethical Hacker (CEH)",
                    "credentialCategory": "Professional Certification"
                }
            ],
            "hasOccupation": {
                "@type": "Occupation",
                "name": "Cybersecurity Expert",
                "occupationLocation": { "@type": "Country", "name": "Worldwide" },
                "skills": "Penetration Testing, Vulnerability Assessment, Security Auditing, Ethical Hacking"
            },
            "sameAs": [
                "https://github.com/Jery0843",
                "https://www.linkedin.com/in/jeromeandrewk/",
                "https://x.com/0xJerry__",
                "https://tryhackme.com/p/JeromeAndrewK",
                "https://app.hackthebox.com/users/JeromeAndrewK"
            ],
            "alumniOf": [
                {
                    "@type": "EducationalOrganization",
                    "name": "VIT University"
                },
                {
                    "@type": "EducationalOrganization",
                    "name": "Loyola College"
                }
            ]
        },
        "dateCreated": "2024-01-01",
        "dateModified": "2026-02-11"
    };
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(profilePageSchema)}<\/script>`}
</svelte:head>
