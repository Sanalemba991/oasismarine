"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Banner from "../app/assets/banner/banner.png";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

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

interface DynamicCategoryClientProps {
  initialProducts: Product[];
  pageInfo: PageInfo;
  slug: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
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
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const filterVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ClientCategoryPage({
  initialProducts,
  pageInfo,
  slug,
}: DynamicCategoryClientProps) {
  const [products] = useState<Product[]>(initialProducts || []);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [isHeaderInView, setIsHeaderInView] = useState(false);
  const [isFiltersInView, setIsFiltersInView] = useState(false);
  const [isProductsInView, setIsProductsInView] = useState(false);
  const [isCtaInView, setIsCtaInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side after mount
    if (!isMounted) return;
    
    // Set up scroll event listener to detect when sections are in view
    const handleScroll = () => {
      try {
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

        // CTA section
        const ctaSection = document.getElementById("cta-section");
        if (ctaSection) {
          const ctaPosition = ctaSection.offsetTop;
          if (scrollPosition > ctaPosition + 100) {
            setIsCtaInView(true);
          }
        }
      } catch (error) {
        console.error("Error in scroll handler:", error);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount to check initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Filter and sort products with safety checks
  const filteredProducts = products
    .filter((product) => {
      if (!product) return false;
      
      const matchesSearch =
        (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.shortDescription || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (filterBy === "all") return matchesSearch;
      if (filterBy === "featured")
        return matchesSearch && (product.reviewsData?.averageRating || 0) > 4;
      if (filterBy === "new") {
        try {
          return (
            matchesSearch &&
            new Date(product.createdAt) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          );
        } catch {
          return matchesSearch;
        }
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      try {
        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "rating":
            return (
              (b.reviewsData?.averageRating || 0) -
              (a.reviewsData?.averageRating || 0)
            );
          case "newest":
            return (
              new Date(b.createdAt || 0).getTime() - 
              new Date(a.createdAt || 0).getTime()
            );
          default:
            return 0;
        }
      } catch {
        return 0;
      }
    });

  const totalItems = filteredProducts.length;

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Banner Section - Dynamic content based on pageInfo */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label={`About ${pageInfo?.name || 'Products'}`}
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Use page-specific image if available, otherwise use default banner */}
          <Image
            src={ Banner}
            alt={pageInfo?.name || "Oasis Marine Trading LLC"}
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />

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
                <span className="text-[#87C0CD] drop-shadow-lg">
                  {pageInfo?.name || 'Our Products'}
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
                {pageInfo?.description ||
                  `Explore our comprehensive range of high-quality ${(pageInfo?.name || 'product').toLowerCase()} products engineered to meet the demanding requirements of marine and industrial applications.`}
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
                  <Link
                    href="/products"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Products
                  </Link>
                </li>

                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-blue-600 font-medium capitalize">
                    {(pageInfo?.name || 'category').toLowerCase()}
                  </span>
                </li>
              </ol>
            </nav>

            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              variants={headerVariants}
            >
              {pageInfo?.name || 'Products'}
            </motion.h1>

            <motion.div
              className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4"
              variants={headerVariants}
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
              {totalItems} Products
            </motion.div>

            {pageInfo?.description && (
              <motion.p
                className="text-base text-gray-600 max-w-2xl mx-auto"
                variants={headerVariants}
              >
                {pageInfo.description}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Filters and Controls */}
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
                    placeholder="Search for products..."
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
            {filteredProducts.length === 0 ? (
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
                  No products found
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm
                    ? `No products match your search "${searchTerm}"`
                    : `No products are currently available in this ${pageInfo?.type || 'category'}.`}
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
                      {filteredProducts.length}
                    </span>{" "}
                    products
                    {searchTerm && (
                      <span>
                        {" "}
                        for "<span className="font-semibold">{searchTerm}</span>
                        "
                      </span>
                    )}
                  </p>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                  variants={containerVariants}
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{
                        y: -4,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group"
                    >
                      <div
                        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full ${
                          viewMode === "list" ? "flex items-center" : ""
                        }`}
                      >
                        {/* Product Image */}
                        <div
                          className={`bg-gray-50 relative overflow-hidden ${
                            viewMode === "list"
                              ? "w-48 h-48 flex-shrink-0"
                              : "h-40"
                          }`}
                        >
                          <div className="relative w-full h-full">
                            {/* Main Product Image */}
                            <Image
                              src={
                                product.cardImage || "/images/placeholder.jpg"
                              }
                              alt={product.name || "Product"}
                              fill
                              unoptimized={true}
                              sizes={
                                viewMode === "list"
                                  ? "192px"
                                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              }
                              className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                            />

                            {/* Watermark (Centered) */}
                            <Image
                              src="/logo.png"
                              alt="Watermark"
                              width={120}
                              height={120}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none"
                            />
                          </div>

                          {/* Badges */}
                          {(() => {
                            try {
                              return new Date(product.createdAt) >
                                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                            } catch {
                              return false;
                            }
                          })() && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              New
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-lg"
                            >
                              <HeartIcon className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div
                          className={`p-4 ${
                            viewMode === "list" ? "flex-1" : ""
                          }`}
                        >
                          <div
                            className={`${
                              viewMode === "list"
                                ? "flex justify-between items-start"
                                : ""
                            }`}
                          >
                            <div
                              className={`${
                                viewMode === "list" ? "flex-1 pr-6" : ""
                              }`}
                            >
                              <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                {product.name || "Untitled Product"}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                                {product.shortDescription || "No description available"}
                              </p>

                              {/* Rating */}
                              {(product.reviewsData?.averageRating || 0) > 0 && (
                                <div className="flex items-center mb-3">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIconSolid
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < (product.reviewsData?.averageRating || 0)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-600">
                                    ({product.reviewsData?.totalReviews || 0})
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div
                              className={`${
                                viewMode === "list" ? "flex flex-col gap-3" : ""
                              }`}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Link
                                  href={`/details/${product.slug}`}
                                  className="inline-flex items-center text-blue-600 font-medium text-xs group-hover:text-blue-700 transition-colors duration-200"
                                >
                                  View Details
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
                                </Link>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
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