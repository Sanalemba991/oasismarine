"use client";
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export const categories = [
  {
    title: 'Valves',
    items: [
      'BRONZE GATE VALVE FLANGED',
      'GLOBE VALVE',
      'FLANGED BUTTERFLY VALVE',
      'CHECK VALVE',
      'SS FLANGED VALVE',
      'BUTTERFLY VALVE',
    ],
  },
  {
    title: 'Flanges',
    items: [
      'Blind Flanges',
      'Flat Faced Slip On Flanges',
      'Raised Face Weld Neck Flanges',
      'Raised Faced Slip On Flanges',
    ],
  },
  {
    title: 'Fittings',
    items: ['Concentric Reducers', '45 Degree elbow', 'Cross'],
  },
  {
    title: 'Expansion Joints',
    items: ['Rubber Expansion Joints', 'METTALIC EXPANSION JOINT'],
  },
];

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

const findCategoryInfo = (slug: string) => {
  // Find main category
  const category = categories.find((cat) => generateSlug(cat.title) === slug);
  if (category) {
    return {
      type: 'category',
      name: category.title,
      items: category.items,
    };
  }

  // Find subcategory
  for (const category of categories) {
    const subcategory = category.items.find(
      (item) => generateSlug(item) === slug
    );
    if (subcategory) {
      return {
        type: 'subcategory',
        name: subcategory,
        parentCategory: category.title,
      };
    }
  }
  return null;
};

const ProductCategoriesSection = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // Extract active category from URL
  useEffect(() => {
    const pathParts = pathname?.split('/') || [];
    const slug = pathParts[pathParts.length - 1];
    
    if (slug) {
      const categoryInfo = findCategoryInfo(slug);
      if (categoryInfo) {
        if (categoryInfo.type === 'category') {
          setActiveCategory(categoryInfo.name);
          setActiveSubcategory(null);
        } else {
          if (categoryInfo.parentCategory) {
            setActiveCategory(categoryInfo.parentCategory);
            setActiveSubcategory(categoryInfo.name);
          }
        }
      }
    }
  }, [pathname]);

  const handleCategoryClick = (categoryTitle: string, item?: string) => {
    setActiveCategory(categoryTitle);
    if (item) {
      setActiveSubcategory(item);
    } else {
      setActiveSubcategory(null);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="space-y-4">
              {/* Category Title */}
              <Link
                href={`/products/${generateSlug(category.title)}`}
                className="block"
                onClick={() => handleCategoryClick(category.title)}
              >
                <h3 
                  className={`text-base font-bold border-b pb-2 transition-colors duration-200 ${
                    activeCategory === category.title
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-900 border-gray-300 hover:text-blue-600'
                  }`}
                >
                  {category.title}
                </h3>
              </Link>

              {/* Category Items */}
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={`/details/${generateSlug(item)}`}
                    className={`flex items-center justify-between transition-colors duration-200 cursor-pointer group ${
                      activeSubcategory === item 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => handleCategoryClick(category.title, item)}
                  >
                    <span className="text-sm leading-relaxed pr-2">
                      {item}
                    </span>
                    <ChevronRight
                      className={`w-3 h-3 transition-colors duration-200 flex-shrink-0 ${
                        activeSubcategory === item 
                          ? 'text-blue-600' 
                          : 'text-gray-400 group-hover:text-blue-600'
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoriesSection;