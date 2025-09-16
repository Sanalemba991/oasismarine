import { notFound } from "next/navigation";
import ClientCategoryPage from "@/components/ClientCategoryPage";
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

async function fetchPageData(slug: string): Promise<{
  products: Product[];
  pageInfo: PageInfo;
} | null> {
  try {
    // Skip processing for detail pages
    if (slug === "detail") {
      return null;
    }

    const currentPath = `/products/${slug}`;

    // Fetch navigation data
    const navResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/navbar`, {
      cache: 'no-store' // or 'force-cache' depending on your needs
    });

    if (!navResponse.ok) {
      throw new Error("Failed to fetch navigation data");
    }

    const navData = await navResponse.json();
    let foundCategory = null;
    let foundSubcategory = null;
    let parentCategory = null;

    // Check if it's a category
    foundCategory = navData.categories?.find(
      (cat: any) => cat.href === currentPath
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/products?categoryId=${foundCategory.id}`,
        { cache: 'no-store' }
      );

      if (response.ok) {
        const data = await response.json();
        const filteredProducts = data.products?.filter((product: Product) => product.isActive) || [];
        return { products: filteredProducts, pageInfo };
      } else {
        throw new Error("Failed to fetch products for category");
      }
    } else {
      // Check if it's a subcategory
      for (const category of navData.categories || []) {
        foundSubcategory = category.subcategories?.find(
          (sub: any) => sub.href === currentPath
        );
        if (foundSubcategory) {
          parentCategory = category;
          break;
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/products?subcategoryId=${foundSubcategory.id}`,
          { cache: 'no-store' }
        );

        if (response.ok) {
          const data = await response.json();
          const filteredProducts = data.products?.filter((product: Product) => product.isActive) || [];
          return { products: filteredProducts, pageInfo };
        } else {
          throw new Error("Failed to fetch products for subcategory");
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function DynamicCategorySubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Handle detail pages - return null to let Next.js handle routing
  if (slug === "detail") {
    return null;
  }

  // Fetch data on the server
  const data = await fetchPageData(slug);

  if (!data) {
    notFound();
  }

  const { products, pageInfo } = data;

  // Pass data to client component
  return (
    <ClientCategoryPage
      initialProducts={products}
      pageInfo={pageInfo}
      slug={slug}
    />
  );
}