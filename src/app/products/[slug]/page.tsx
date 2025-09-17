import { notFound } from "next/navigation";
import { Suspense } from "react";
import ClientCategoryPage from "@/components/ClientCategoryPage";
import { Metadata } from "next";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  cardImage: string;
  detailImages: string[];
  shortFeatures: string[];
  specifications: any;
  reviewsData: any;
  catalogFile: string;
  isActive: boolean;
  categoryId: string | null;
  subcategoryId: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
    href: string;
  } | null;
  subcategory?: {
    id: string;
    name: string;
    href: string;
  } | null;
}

interface PageInfo {
  id: string;
  name: string;
  type: "category" | "subcategory";
  parentCategory?: string;
  parentCategoryId?: string;
  description?: string;
  image?: string;
}

// Get the base URL for API calls
function getBaseUrl() {
  // For production, use the full domain
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://oasismarineuae.com';
  }
  // For development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function fetchPageData(slug: string): Promise<{
  products: Product[];
  pageInfo: PageInfo;
} | null> {
  try {
    // Skip processing for detail pages
    if (slug === "detail") {
      return null;
    }

    const baseUrl = getBaseUrl();
    const currentPath = `/products/${slug}`;

    console.log(`Fetching navigation data from: ${baseUrl}/api/admin/navbar`);

    // Fetch navigation data with better error handling
    const navResponse = await fetch(`${baseUrl}/api/admin/navbar`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!navResponse.ok) {
      console.error(`Navigation API failed with status: ${navResponse.status}`);
      throw new Error(`Failed to fetch navigation data: ${navResponse.status}`);
    }

    const navData = await navResponse.json();
    let foundCategory = null;
    let foundSubcategory = null;
    let parentCategory = null;

    // Safely check if categories exist
    const categories = navData?.categories || [];

    // Check if it's a category
    foundCategory = categories.find(
      (cat: any) => cat?.href === currentPath
    );

    if (foundCategory) {
      const pageInfo: PageInfo = {
        id: foundCategory.id,
        name: foundCategory.name,
        type: "category",
        description:
          foundCategory.description ||
          `Explore our comprehensive range of ${foundCategory.name.toLowerCase()} products`,
        image: foundCategory.image,
      };

      // Fetch products for category
      const productsUrl = `${baseUrl}/api/admin/products?categoryId=${foundCategory.id}`;
      console.log(`Fetching products from: ${productsUrl}`);
      
      const response = await fetch(productsUrl, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredProducts = data?.products?.filter((product: Product) => product?.isActive) || [];
        return { products: filteredProducts, pageInfo };
      } else {
        console.error(`Products API failed with status: ${response.status}`);
        throw new Error(`Failed to fetch products for category: ${response.status}`);
      }
    } else {
      // Check if it's a subcategory
      for (const category of categories) {
        if (category?.subcategories) {
          foundSubcategory = category.subcategories.find(
            (sub: any) => sub?.href === currentPath
          );
          if (foundSubcategory) {
            parentCategory = category;
            break;
          }
        }
      }

      if (foundSubcategory && parentCategory) {
        const pageInfo: PageInfo = {
          id: foundSubcategory.id,
          name: foundSubcategory.name,
          type: "subcategory",
          parentCategory: parentCategory.name,
          parentCategoryId: parentCategory.id,
          description:
            foundSubcategory.description ||
            `Professional ${foundSubcategory.name.toLowerCase()} solutions for your industrial needs`,
          image: foundSubcategory.image,
        };

        // Fetch products for subcategory
        const productsUrl = `${baseUrl}/api/admin/products?subcategoryId=${foundSubcategory.id}`;
        console.log(`Fetching subcategory products from: ${productsUrl}`);
        
        const response = await fetch(productsUrl, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredProducts = data?.products?.filter((product: Product) => product?.isActive) || [];
          return { products: filteredProducts, pageInfo };
        } else {
          console.error(`Subcategory products API failed with status: ${response.status}`);
          throw new Error(`Failed to fetch products for subcategory: ${response.status}`);
        }
      }
    }

    console.log(`No matching category or subcategory found for slug: ${slug}`);
    return null;
  } catch (error) {
    console.error("Error fetching page data:", error);
    // In development, you might want to throw the error to see it in the browser
    if (process.env.NODE_ENV === 'development') {
      console.error("Full error details:", error);
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    // Fetch data to get the actual category/subcategory name
    const data = await fetchPageData(slug);
    
    let title = "Products | Oasis Marine Trading LLC";
    let description = "Explore our comprehensive range of marine and industrial products.";
    
    if (data?.pageInfo) {
      const { pageInfo } = data;
      title = `${pageInfo.name} Products | Oasis Marine Trading LLC`;
      description = pageInfo.description || `Explore our comprehensive range of ${pageInfo.name.toLowerCase()} products. High-quality marine and industrial solutions from Oasis Marine Trading LLC.`;
    } else {
      // Fallback to slug-based title if data fetching fails
      const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      title = `${categoryName} Products | Oasis Marine Trading LLC`;
      description = `Explore our comprehensive range of ${categoryName.toLowerCase()} products. High-quality marine and industrial solutions from Oasis Marine Trading LLC.`;
    }

    return {
      title,
      description,
      keywords: `${data?.pageInfo?.name || slug}, industrial products, marine supplies, Oasis Marine products, UAE industrial solutions`,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://oasismarineuae.com/products/${slug}`,
        siteName: 'Oasis Marine Trading LLC',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `https://oasismarineuae.com/products/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return fallback metadata
    return {
      title: "Products | Oasis Marine Trading LLC",
      description: "Explore our comprehensive range of marine and industrial products.",
    };
  }
}

export default async function DynamicCategorySubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Handle detail pages - return null to let Next.js handle routing
    if (slug === "detail") {
      return null;
    }

    return (
      <Suspense fallback={<LoadingFallback />}>
        <CategoryContent params={{ slug }} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in DynamicCategorySubcategoryPage:", error);
    return <ErrorFallback />;
  }
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">We're having trouble loading this page. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

async function CategoryContent({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    // Fetch data on the server
    const data = await fetchPageData(slug);

    if (!data) {
      console.log(`No data found for slug: ${slug}, triggering notFound`);
      notFound();
    }

    const { products, pageInfo } = data;

    // Pass data to client component
    return (
      <ClientCategoryPage
        initialProducts={products || []}
        pageInfo={pageInfo}
        slug={slug}
      />
    );
  } catch (error) {
    console.error("Error in CategoryContent:", error);
    return <ErrorFallback />;
  }
}