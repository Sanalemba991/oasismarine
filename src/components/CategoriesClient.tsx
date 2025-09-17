"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "../assets/branch/History.png";
import brand1 from "../app/assets/brands/brand (1).jpg";
import brand2 from "../app/assets/brands/brand (2).jpg";
import brand3 from "../app/assets/brands/brand (3).jpg";
import brand4 from "../app/assets/brands/brand (4).jpg";
import brand5 from "../app/assets/brands/brand (5).jpg";
import brand6 from "../app/assets/brands/brand (6).jpg";
import brand7 from "../app/assets/brands/brand (7).jpg";
import brand8 from "../app/assets/brands/brand (8).jpg";
import brand9 from "../app/assets/brands/brand (9).jpg";
import brand10 from "../app/assets/brands/brand (10).jpg";
import brand11 from "../app/assets/brands/brand (11).jpg";
import brand12 from "../app/assets/brands/brand (12).jpg";
import brand13 from "../app/assets/brands/brand (13).jpg";
import brand14 from "../app/assets/brands/brand (14).jpg";
import brand15 from "../app/assets/brands/brand (15).jpg";
import brand16 from "../app/assets/brands/brand (16).jpg";
import brand17 from "../app/assets/brands/brand (17).jpg";
import brand18 from "../app/assets/brands/brand (18).jpg";
import brand19 from "../app/assets/brands/brand (19).jpg";
import brand20 from "../app/assets/brands/brand (20).jpg";
import brand21 from "../app/assets/brands/brand (21).jpg";
import brand22 from "../app/assets/brands/brand (22).jpg";
import brand23 from "../app/assets/brands/brand (23).jpg";
import brand24 from "../app/assets/brands/brand (24).jpg";
import brand25 from "../app/assets/brands/brand (25).jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isActive?: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  href: string;
  image?: string;
  description?: string;
  itemCount?: number;
  products?: Product[];
}

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const brands = [
  { id: 1, name: "Brand 1", image: brand1 },
  { id: 2, name: "Brand 2", image: brand2 },
  { id: 3, name: "Brand 3", image: brand3 },
  { id: 4, name: "Brand 4", image: brand4 },
  { id: 5, name: "Brand 5", image: brand5 },
  { id: 6, name: "Brand 6", image: brand6 },
  { id: 7, name: "Brand 7", image: brand7 },
  { id: 8, name: "Brand 8", image: brand8 },
  { id: 9, name: "Brand 9", image: brand9 },
  { id: 10, name: "Brand 10", image: brand10 },
  { id: 11, name: "Brand 11", image: brand11 },
  { id: 12, name: "Brand 12", image: brand12 },
  { id: 13, name: "Brand 13", image: brand13 },
  { id: 14, name: "Brand 14", image: brand14 },
  { id: 15, name: "Brand 15", image: brand15 },
  { id: 16, name: "Brand 16", image: brand16 },
  { id: 17, name: "Brand 17", image: brand17 },
  { id: 18, name: "Brand 18", image: brand18 },
  { id: 19, name: "Brand 19", image: brand19 },
  { id: 20, name: "Brand 20", image: brand20 },
  { id: 21, name: "Brand 21", image: brand21 },
  { id: 22, name: "Brand 22", image: brand22 },
  { id: 23, name: "Brand 23", image: brand23 },
  { id: 24, name: "Brand 24", image: brand24 },
  { id: 25, name: "Brand 25", image: brand25 },
];

export default function CategoriesClient() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderInView, setIsHeaderInView] = useState(false);
  const [isFiltersInView, setIsFiltersInView] = useState(false);
  const [isProductsInView, setIsProductsInView] = useState(false);
  const [isBrandsInView, setIsBrandsInView] = useState(false);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  useEffect(() => {
    // Set up scroll event listener to detect when sections are in view
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;

      // Header section
      const headerSection = document.getElementById("header-section");
      if (headerSection) {
        const headerPosition = headerSection.offsetTop;
        if (scrollPosition > headerPosition + 100) {
          setIsHeaderInView(true);
        }
      }

      // Filters section
      const filtersSection = document.getElementById("filters-section");
      if (filtersSection) {
        const filtersPosition = filtersSection.offsetTop;
        if (scrollPosition > filtersPosition + 100) {
          setIsFiltersInView(true);
        }
      }

      // Products section
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        const productsPosition = productsSection.offsetTop;
        if (scrollPosition > productsPosition + 100) {
          setIsProductsInView(true);
        }
      }

      // Brands section
      const brandsSection = document.getElementById("brands-section");
      if (brandsSection) {
        const brandsPosition = brandsSection.offsetTop;
        if (scrollPosition > brandsPosition + 100) {
          setIsBrandsInView(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount to check initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSubcategories = async () => {
    try {
      const navResponse = await fetch("/api/admin/navbar");
      if (navResponse.ok) {
        const navData = await navResponse.json();
        const categoriesData: Category[] = navData.categories || [];

        // Flatten all subcategories from all categories
        const allSubcategories: Subcategory[] = [];
        categoriesData.forEach((category) => {
          if (category.subcategories) {
            allSubcategories.push(...category.subcategories);
          }
        });

        // Fetch item counts for each subcategory
        const subcategoriesWithCounts = await Promise.all(
          allSubcategories.map(async (subcategory) => {
            try {
              console.log(
                `Fetching products for subcategory: ${subcategory.name}`
              );

              const productsResponse = await fetch(
                `/api/admin/products/count?subcategoryId=${subcategory.id}&isActive=true`
              );
              if (productsResponse.ok) {
                const countData = await productsResponse.json();
                console.log(`Count data for ${subcategory.name}:`, countData);

                return {
                  ...subcategory,
                  itemCount: countData.count || 0,
                };
              }
            } catch (error) {
              console.error(
                `Error fetching products for subcategory ${subcategory.id}:`,
                error
              );
            }
            return {
              ...subcategory,
              itemCount: 0,
            };
          })
        );

        console.log("Subcategories with counts:", subcategoriesWithCounts);

        setCategories(categoriesData);
        setSubcategories(subcategoriesWithCounts);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-slate-200 border-t-blue-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 rounded-full h-24 w-24 border-4 border-transparent border-t-blue-400 animate-spin mx-auto opacity-60"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">
              Loading Categories
            </h2>
            <p className="text-slate-600">
              Please wait while we fetch the categories...
            </p>
          </div>
          <div className="mt-8 flex justify-center space-x-3">
            <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce shadow-sm"></div>
            <div
              className="h-3 w-3 bg-blue-600 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-3 w-3 bg-blue-600 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Filter subcategories based on search
  const filteredSubcategories = subcategories.filter((sub) => {
    const search = searchTerm.toLowerCase().trim();
    return (
      sub.name.toLowerCase().includes(search) ||
      sub.description?.toLowerCase().includes(search)
    );
  });

  // Update the grid layout and spacing for better mobile responsiveness
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="mt-9 py-9 sm:py-6 bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12 max-w-7xl">
        {/* Header Section */}
        <div id="header-section">
          <motion.div
            initial="hidden"
            animate={isHeaderInView ? "visible" : "hidden"}
            variants={headerVariants}
            className="text-center mb-6 sm:mb-12"
          >
            {/* Breadcrumb - Hide on mobile */}
            <nav className="hidden sm:flex justify-center mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>

                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-blue-600 font-medium capitalize">
                    Categories
                  </span>
                </li>
              </ol>
            </nav>

            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
              variants={headerVariants}
            >
              Product Categories
            </motion.h1>

            <motion.div
              className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4"
              variants={headerVariants}
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
              {filteredSubcategories.length} Categories
            </motion.div>

            <motion.p
              className="text-base text-gray-600 max-w-2xl mx-auto"
              variants={headerVariants}
            >
              Browse our comprehensive range of industrial products
            </motion.p>
          </motion.div>
        </div>

        {/* Filters Section */}
        <div id="filters-section">
          <motion.div
            initial="hidden"
            animate={isFiltersInView ? "visible" : "hidden"}
            variants={filterVariants}
            className="max-w-7xl mx-auto"
          >
            {/* Hero Search Section */}
            <div className="text-center mb-6 sm:mb-12">
              {/* Main Centered Search Bar */}
              <div className="max-w-2xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-14 pl-14 pr-14 text-lg text-gray-800 placeholder-gray-500 bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 outline-none"
                  />
                  <AnimatePresence>
                    {searchTerm && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Section */}
        <div id="products-section" className="px-2 sm:px-0">
          <AnimatePresence mode="wait">
            {filteredSubcategories.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isProductsInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16 bg-white rounded-lg shadow-sm"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                  <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No categories found
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm
                    ? `No categories match your search "${searchTerm}"`
                    : "No categories are currently available."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchTerm && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchTerm("")}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Clear Search
                    </motion.button>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/products"
                      className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold"
                    >
                      Browse All Products
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.section
                key="products-grid"
                initial="hidden"
                animate={isProductsInView ? "visible" : "hidden"}
                variants={sectionVariants}
              >
                {/* Results Count */}
                <motion.div variants={headerVariants} className="mb-6">
                  <p className="text-lg text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-blue-600">
                      {filteredSubcategories.length}
                    </span>{" "}
                    categories
                    {searchTerm && (
                      <span>
                        {" "}
                        for "<span className="font-semibold">{searchTerm}</span>
                        "
                      </span>
                    )}
                  </p>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
                >
                  {filteredSubcategories.map((subcategory) => (
                    <motion.div
                      key={subcategory.id}
                      variants={itemVariants}
                      whileHover={{
                        y: -4,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group"
                    >
                      <Link href={subcategory.href} className="block h-full">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full">
                          {/* Category Image */}
                          <div className="bg-gray-50 relative overflow-hidden h-32 sm:h-40">
                            {subcategory.image ? (
                              <div className="relative w-full h-full">
                                {/* Main Product Image */}
                                <div className="relative w-full h-full">
                                  {/* Main Product Image */}
                                  <Image
                                    src={subcategory.image}
                                    alt={subcategory.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                                  />

                                  {/* Centered Watermark */}
                                  <Image
                                    src="/logo1.png" // your watermark file
                                    alt="Watermark"
                                    width={120}
                                    height={120}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-100">
                                <svg
                                  className="h-16 w-16 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Category Info */}
                          <div className="p-3 sm:p-4">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {subcategory.name}
                            </h3>

                            {/* Action Button */}
                            <div className="mt-2 sm:mt-4">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center text-blue-600 font-medium text-xs group-hover:text-blue-700 transition-colors duration-200"
                              >
                                View Products
                                <svg
                                  className="ml-1 w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Brands Section */}
        <div id="brands-section" className="mt-12 sm:mt-20">
          <motion.section
            className="relative bg-white py-8 sm:py-16 z-20"
            initial="hidden"
            animate={isBrandsInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <motion.div
                className="text-center mb-8 sm:mb-12"
                variants={headerVariants}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Our Trusted{" "}
                  <span className="text-[#1e3a8a]">Brands</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
                  We partner with leading manufacturers to bring you the highest
                  quality industrial products
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 items-center justify-items-center"
                variants={containerVariants}
              >
                {brands.map((brand) => (
                  <motion.div
                    key={brand.id}
                    className="relative w-24 sm:w-32 h-16 sm:h-20 hover:grayscale-0 transition-all duration-500 ease-in-out transform-gpu"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.15,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                  >
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}