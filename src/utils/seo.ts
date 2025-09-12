import { Metadata } from 'next';
export const defaultMetadata: Metadata = {
    metadataBase: new URL('https://oasismarineuae.com/'),
    title: {
        default: 'Oasis Marine Trading LLC',
        template: '%s | Oasis Marine Trading LLC',
    },
    description:
        'Oasis Marine Trading LLC - Your trusted partner for marine equipment, supplies, and services in the UAE and Middle East region.',
    keywords: [
        'Oasis Marine Trading LLC',
        'marine equipment UAE',
        'marine supplies Dubai',
        'marine services Middle East',
        'ship chandlers UAE',
        'marine safety equipment',
        'navigation equipment',
        'marine parts and accessories',
        'offshore supplies',
        'yacht supplies Dubai',
        'marine hardware',
        'fishing equipment UAE',
        'boat maintenance supplies',
        'marine electronics',
        'nautical equipment Dubai',
    ],
    authors: [{ name: 'Oasis Marine Trading LLC' }],
    creator: 'Oasis Marine Trading LLC',
    publisher: 'Oasis Marine Trading LLC',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: './favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
        other: {
            rel: 'mask-icon',
            url: '/safari-pinned-tab.svg',
            color: '#5bbad5',
        },
    },
    openGraph: {
        type: 'website',
        siteName: 'Oasis Marine Trading LLC',
        locale: 'en_US',
        url: 'https://oasismarineuae.com',
        title: 'Oasis Marine Trading LLC',
        description:
            'Your trusted partner for marine equipment, supplies, and services in the UAE and Middle East region.',
        images: [
            {
                url: '/logo/oasis-marine-logo.png',
                width: 1200,
                height: 630,
                alt: 'Oasis Marine Trading LLC',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@oasismarineuae',
        creator: '@oasismarineuae',
        title: 'Oasis Marine Trading LLC',
        description:
            'Your trusted partner for marine equipment, supplies, and services in the UAE and Middle East region.',
        images: ['/logo.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://oasismarineuae.com',
        languages: {
            'en-US': 'https://oasismarineuae.com/',
            'ar-AE': 'https://oasismarineuae.com/ar/',
        },
    },
    verification: {
        google: 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
    },
    other: {
        'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
    },
    generator: 'Oasis Marine Trading LLC Website',
    applicationName: 'Oasis Marine Trading LLC',
    referrer: 'origin-when-cross-origin',
    manifest: '/site.webmanifest',
};

// ✅ Organization Schema (JSON-LD)
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oasis Marine Trading LLC',
    description:
        'Your trusted partner for marine equipment, supplies, and services in the UAE and Middle East region.',
    url: 'https://oasismarineuae.com',
    logo: './logo.png',
    foundingDate: '2010-01-01',
    founder: [
        { '@type': 'Person', name: 'Founder Name' },
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+971563096262',
        contactType: 'customer service',
        email: 'sales@oasismarineuae.com',
        areaServed: 'AE',
        availableLanguage: ['English', 'Arabic'],
    },
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Al Qusais,Dubai -U.A.E',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        postalCode: 'XXXXX',
        addressCountry: 'AE',
    },
    sameAs: [
        'https://www.instagram.com/oasismarineuae',
        'https://www.facebook.com/oasismarineuae',
        'https://www.linkedin.com/company/oasis-marine-trading-llc',
        'https://twitter.com/oasismarineuae',
    ],
    areaServed: {
        '@type': 'Country',
        name: 'United Arab Emirates',
        alternateName: 'UAE',
    },
    knowsAbout: [
        'Marine Equipment',
        'Marine Supplies',
        'Ship Chandling',
        'Marine Safety',
        'Navigation Equipment'
    ]
};

// ✅ Dynamic Content Schema (JSON-LD)
export const dynamicContentSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            item: {
                '@type': 'WebPage',
                '@id': 'https://oasismarineuae.com/products',
                name: 'Product Categories',
                description: 'Browse our marine product categories',
                url: 'https://oasismarineuae.com/products',
            },
        },
        {
            '@type': 'ListItem',
            position: 2,
            item: {
                '@type': 'CollectionPage',
                '@id': 'https://oasismarineuae.com/products',
                name: 'Products',
                description: 'Our complete marine product catalog',
                url: 'https://oasismarineuae.com/products',
            },
        },
        {
            '@type': 'ListItem',
            position: 3,
            item: {
                '@type': 'CollectionPage',
                '@id': 'https://oasismarineuae.com/services',
                name: 'Services',
                description: 'Our marine services',
                url: 'https://oasismarineuae.com/services',
            },
        },
        
       
    ],
};

// Helper function to generate dynamic metadata
export const generateDynamicMetadata = (
    type: 'product' | 'service' | 'blog',
    data: any
): Metadata => {
    return {
        title: data.title,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            images: data.images && data.images.length > 0 ? data.images : ['/logo/oasis-marine-logo.png'],
            url: `https://oasismarineuae.com/${type}/${data.slug}`,
        },
        alternates: {
            canonical: `https://oasismarineuae.com/${type}/${data.slug}`,
        },
    };
};