import { personalInfo, skills } from './content/about';
import { educations } from './content/education';

export const siteUrl = 'https://jerome.co.in';

// Keep search-engine profile facts aligned with the portfolio's original records.
export const personSchema = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: personalInfo.name,
    alternateName: '0xJerry',
    url: siteUrl,
    image: `${siteUrl}/profile.webp`,
    jobTitle: personalInfo.title,
    email: `mailto:${personalInfo.email}`,
    knowsAbout: skills.map(skill => skill.name),
    sameAs: [
        'https://github.com/Jery0843',
        'https://www.linkedin.com/in/jeromeandrewk/',
        'https://x.com/0xJerry__',
        'https://0xjerry.jerome.co.in/'
    ],
    alumniOf: educations.filter(education => education.status === 'Completed').map(education => ({
        '@type': 'EducationalOrganization',
        name: education.institution
    }))
};

export const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Jerome Andrew K — Portfolio',
    alternateName: '0xJerry',
    url: siteUrl,
    inLanguage: 'en',
    author: { '@id': personSchema['@id'] }
};
