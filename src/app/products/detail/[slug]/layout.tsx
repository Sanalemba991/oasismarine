import { Metadata } from 'next';

// Product interface definition
interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  longDescription?: string;
  cardImage?: string;
  detailImages?: string[];
  specifications?: any;
  category?: {
    id: string;
    name: string;
    href?: string;
  };
  subcategory?: {
    id: string;
    name: string;
    href?: string;
  };
}

// Function to fetch product data by slug
async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Get the base URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000';
                   
    const response = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Details | Oasis Marine',
      description: 'The requested product details.',
      robots: { index: false, follow: true }
    };
  }

  const breadcrumbList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": process.env.NEXT_PUBLIC_SITE_URL
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}/products`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": product.category?.name || "Category",
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.category?.href || ''}`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": product.name,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}/products/detail/${product.slug}`
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.shortDescription || product.longDescription,
    "image": [
      product.cardImage,
      ...(product.detailImages || [])
    ].filter(Boolean),
    "brand": {
      "@type": "Brand",
      "name": "Oasis Marine"
    },
    "category": product.category?.name,
    "subCategory": product.subcategory?.name,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    }
  };

  return {
    title: `${product.name} | ${product.category?.name || 'Products'} | Oasis Marine`,
    description: product.shortDescription || product.longDescription || `Explore ${product.name} specifications and details at Oasis Marine`,
    
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.longDescription,
      images: product.cardImage ? [{ url: product.cardImage }] : [],
      type: 'website',
      siteName: 'Oasis Marine',
      locale: 'en_US',
    },

    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: product.cardImage ? [product.cardImage] : [],
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/detail/${product.slug}`,
    },

    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },

    keywords: [
      product.name,
      product.category?.name,
      product.subcategory?.name,
      'marine equipment',
      'marine products',
      'Oasis Marine',
    ].filter(Boolean) as string[],

    other: {
      'og:type': 'product',
      'og:site_name': 'Oasis Marine',
      'twitter:site': '@OasisMarine',
      structuredData: JSON.stringify(structuredData),
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}