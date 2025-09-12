import { Metadata } from "next";
import { Suspense } from "react";
import ClientCategoryPage from "../../../components/ClientCategoryPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // You might want to fetch the actual category name from your API
  // For now, I'll use the slug to create a title
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryName} Products | Oasis Marine Trading LLC`,
    description:
      `Explore our comprehensive range of ${categoryName} products. High-quality marine and industrial solutions from Oasis Marine Trading LLC.`,
    keywords:
      `${categoryName}, industrial products, marine supplies, Oasis Marine products, UAE industrial solutions`,
    openGraph: {
      title: `${categoryName} Products | Oasis Marine Trading LLC`,
      description:
        `Explore our comprehensive range of ${categoryName} products. High-quality marine and industrial solutions.`,
      type: 'website',
      url: `https://oasismarineuae.com/products/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ClientCategoryPage params={params} />
    </Suspense>
  );
}