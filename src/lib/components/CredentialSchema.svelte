<script lang="ts">
    import { serializeSchema } from '$lib/utils/schema';
    interface Props {
        credentials?: Array<{
        name: string;
        issuer: string;
        dateIssued?: string;
        url?: string;
        category?: string;
    }>;
    }

    let { credentials = [] }: Props = $props();
    
    let credentialListSchema = $derived({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Jerome Andrew K's Certifications & Credentials",
        "description": "Professional certifications and credentials in cybersecurity, ethical hacking, and technology",
        "url": "https://jerome.co.in/certificates",
        "numberOfItems": credentials.length,
        "itemListElement": credentials.map((cred, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "EducationalOccupationalCredential",
                "name": cred.name,
                "credentialCategory": cred.category || "Professional Certification",
                "recognizedBy": {
                    "@type": "Organization",
                    "name": cred.issuer
                },
                ...(cred.dateIssued ? { "dateCreated": cred.dateIssued } : {}),
                ...(cred.url ? { "url": cred.url } : {})
            }
        }))
    });
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${serializeSchema(credentialListSchema)}<\/script>`}
</svelte:head>
