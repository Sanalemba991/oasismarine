import { Metadata } from 'next';

// Add interface for product data
interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  cardImage?: string;
  detailImages?: string[];
  specifications?: any;
  category?: {
    id: string;
    name: string;
    subcategories?: Array<{
      id: string;
      name: string;
      products?: Array<{
        id: string;
        name: string;
      }>;
    }>;
  };
  subcategory?: {
    name: string;
  };
}

// Function to fetch product data
async function getProduct(id: string): Promise<Product | null> {
  try {
    // Update the API endpoint to match your route structure
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Product fetch failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate metadata based on product data
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Details - Oasis Marine Equipment & Services',
      description: 'Explore our comprehensive range of marine equipment and products. Find detailed specifications, features, and technical information.',
      robots: {
        index: false,
        follow: true,
      },
      openGraph: {
        title: 'Product Details - Oasis Marine Equipment & Services',
        description: 'Discover our range of marine equipment and products',
        type: 'website',
        siteName: 'Oasis Marine',
      },
      twitter: {
        card: 'summary',
        title: 'Product Details - Oasis Marine',
        description: 'Discover our range of marine equipment and products',
      }
    };
  }

  // Update breadcrumb to match the route structure
  const breadcrumbList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}`
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
      "name": "Details",
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}/products/detail`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": product?.name || "",
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}/products/detail/${params.id}`
    }
  ];

  // Enhanced structured data with subcategories
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.shortDescription || product.longDescription,
    "image": product.cardImage ? [product.cardImage] : [],
    "brand": {
      "@type": "Brand",
      "name": "Oasis Marine"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Oasis Marine"
    },
    "category": product.category?.name,
    "subCategory": product.subcategory?.name,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    }
  };

  // Update canonical URL to match the route structure
  return {
    title: `${product.name} | ${product.subcategory?.name || ''} | ${product.category?.name || ''} | Oasis Marine`,
    description: product.shortDescription || product.longDescription || `View details about ${product.name} in ${product.subcategory?.name || ''} category`,
    openGraph: {
      title: `${product.name} | ${product.subcategory?.name || ''} | Oasis Marine`,
      description: product.shortDescription || product.longDescription || `View details about ${product.name}`,
      images: product.cardImage ? [product.cardImage] : [],
      type: 'product',
      siteName: 'Oasis Marine',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${product.subcategory?.name || ''}`,
      description: product.shortDescription || product.longDescription || `View details about ${product.name}`,
      images: product.cardImage ? [product.cardImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/detail/${params.id}`,
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
      ...(product.category?.subcategories?.map(sub => sub.name) || [])
    ].filter(Boolean),
    authors: [{ name: 'Oasis Marine' }],
    applicationName: 'Oasis Marine',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}