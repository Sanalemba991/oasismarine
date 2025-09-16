"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "../assets/branch/History.png";

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

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderInView, setIsHeaderInView] = useState(false);
  const [isFiltersInView, setIsFiltersInView] = useState(false);
  const [isProductsInView, setIsProductsInView] = useState(false);

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
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-blue-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-blue-400 animate-spin mx-auto opacity-60"></div>
          </div>
          <div className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">
              Loading Categories
            </h2>
          </div>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce shadow-sm"></div>
            <div
              className="h-2 w-2 bg-blue-600 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="h-2 w-2 bg-blue-600 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: "0.2s" }}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header with Framer Motion */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="About Lovosis Technology"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
              src={Banner}
              alt="Lovosis Technology Banner"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          </div>

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-cyan-900/60"></div>
        </div>

        {/* Animated background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-10"
        >
          {/* Tech grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3,
                    delayChildren: 0.4,
                    ease: "easeOut",
                    duration: 0.8,
                  },
                },
              }}
              className="text-white"
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight"
              >
                Discover{" "}
                <span className="text-blue-900 drop-shadow-lg">
                  Our Products
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl drop-shadow-md"
              >
                Explore our comprehensive range of high-quality industrial
                products— including valves, gaskets, fasteners, and
                more—engineered to meet the demanding requirements of marine and
                industrial applications.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-blue-200 mb-2 drop-shadow-md">
              Scroll down
            </span>
            <svg
              className="w-6 h-6 text-blue-200 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div id="header-section">
          <motion.div
            initial="hidden"
            animate={isHeaderInView ? "visible" : "hidden"}
            variants={headerVariants}
            className="text-center mb-12"
          >
            {/* Breadcrumb */}
            <nav className="flex justify-center mb-6" aria-label="Breadcrumb">
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
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
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
            <div className="text-center mb-12">
              {/* Main Centered Search Bar */}
              <div className="max-w-2xl mx-auto mb-6">
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
        <div id="products-section">
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                          <div className="bg-gray-50 relative overflow-hidden h-40">
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
                                    src="/logo.png" // your watermark file
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
                          <div className="p-4">
                            <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {subcategory.name}
                            </h3>

                            {/* Action Button */}
                            <div className="mt-4">
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
      </div>
    </div>
  );
}
