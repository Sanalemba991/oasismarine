"use client";

import { useState, useEffect, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import {
  HeartIcon,
  ShareIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  TruckIcon,
  ClockIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLink,
  FaInstagram,
  FaFacebook,
  FaDownload,
  FaBox,
  FaWeight,
  FaRulerCombined,
} from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  longDescription?: string;
  cardImage?: string;
  detailImages?: string[];
  shortFeatures?: string[];
  specifications?: any;
  reviewsData?: any;
  catalogFile?: string;
  // Added packaging information
  packaging?: {
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      unit?: string;
    };
    weight?: {
      net?: number;
      gross?: number;
      unit?: string;
    };
    material?: string;
    type?: string;
    quantity?: number;
    notes?: string;
  };
  isActive: boolean;
  viewCount: number;
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
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [productSlug, setProductSlug] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Initialize params
  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = await params;
        setProductSlug(resolvedParams.slug);
      } catch (error) {
        setError("Failed to load product parameters");
        setLoading(false);
      }
    };

    initializeParams();
  }, [params]);

  // Fetch product data
  useEffect(() => {
    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/slug/${productSlug}`);

      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);

        // Set initial selected image
        if (data.product.cardImage) {
          setSelectedImage(data.product.cardImage);
        } else if (data.product.detailImages && data.product.detailImages[0]) {
          setSelectedImage(data.product.detailImages[0]);
        }
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const allImages = product
    ? ([product.cardImage, ...(product.detailImages || [])].filter(
        Boolean
      ) as string[])
    : [];

  const prevImage = () => {
    setSelectedImageIndex((i) => (i - 1 + allImages.length) % allImages.length);
    setSelectedImage(allImages[selectedImageIndex]);
  };

  const nextImage = () => {
    setSelectedImageIndex((i) => (i + 1) % allImages.length);
    setSelectedImage(allImages[selectedImageIndex]);
  };

  const shareLinks = useMemo(() => {
    const url = encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : ""
    );
    const text = encodeURIComponent(product?.name || "");
    return {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
  }, [product]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setNotificationMessage(
      isFavorite ? "Removed from favorites" : "Added to favorites"
    );
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name || "Product Details",
          text: product?.shortDescription || "Check out this product!",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Copy link to clipboard as fallback
      navigator.clipboard.writeText(window.location.href);
      setNotificationMessage("Link copied to clipboard");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square bg-white rounded-2xl p-2 shadow-sm">
                <div className="h-full w-full rounded-xl bg-gray-100 animate-pulse"></div>
              </div>
              <div className="mt-4 flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg bg-gray-100 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-6 w-40 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-10 w-3/4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-24 w-full bg-gray-100 rounded animate-pulse"></div>
              <div className="h-48 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">Product Slug: {productSlug}</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No Product Data
          </h2>
          <p className="text-gray-600">Product data could not be loaded</p>
          <p className="text-sm text-gray-500">Product Slug: {productSlug}</p>
        </div>
      </div>
    );
  }

  const releasedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      <div
        className={`fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 transform transition-all duration-300 ${
          showNotification
            ? "translate-y-0 opacity-100"
            : "-translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        {notificationMessage}
      </div>

      {/* Banner Section */}
      <div className="relative py-8 md:py-12 lg:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              className="text-white space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {product.name}
                </motion.h1>

                {product.shortDescription && (
                  <motion.p
                    className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {product.shortDescription}
                  </motion.p>
                )}

                <motion.div
                  className="flex flex-wrap items-center gap-6 text-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                ></motion.div>
              </div>
            </motion.div>

            {/* Right side - Hero Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0"></div>

                {selectedImage ? (
                  <div className="relative w-full h-full">
                    {/* Main Product Image */}
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-contain p-8 rounded-3xl"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />

                    {/* Centered Watermark */}
                    <Image
                      src="/logo.png"
                      alt="Watermark"
                      width={150}
                      height={150}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none select-none"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-3xl">
                    <span className="text-8xl text-gray-400">🔧</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-40 w-48 h-48 border border-white/10 rounded-full"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <Link
              href="/products"
              className="hover:text-gray-700 transition-colors"
            >
              Products
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Enhanced Image Gallery */}
          <div className="space-y-4">
            <motion.div
              className="relative aspect-[4/3] w-full max-w-[500px] mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative w-full h-full">
                {/* Main Image */}
                <Image
                  src={
                    allImages[selectedImageIndex] ||
                    selectedImage ||
                    "/placeholder-product.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-contain p-5 transition-transform duration-300"
                  sizes="(min-width:1024px) 500px, 100vw"
                  priority
                />

                {/* Centered Watermark */}
                <Image
                  src="/logo.png"
                  alt="Watermark"
                  width={150}
                  height={150}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none select-none"
                />
              </div>

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 text-gray-700 border border-gray-200 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      x: isHovered ? 0 : -10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronLeft size={16} />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 text-gray-700 border border-gray-200 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      x: isHovered ? 0 : 10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronRight size={16} />
                  </motion.button>
                </>
              )}

              {/* Expand button */}
              <motion.button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute top-4 right-4 bg-white/95 text-gray-700 border border-gray-200 px-3 py-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                  scale: isHovered ? 1 : 0.9,
                }}
                transition={{ duration: 0.2 }}
              >
                <FaExpand size={14} />
              </motion.button>

              {/* Image indicator */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        setSelectedImage(allImages[idx]);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        selectedImageIndex === idx
                          ? "bg-blue-600 w-6"
                          : "bg-white/70 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Enhanced Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                {allImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setSelectedImage(img);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImageIndex === idx
                        ? "border-blue-600 shadow-lg ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedImageIndex === idx && (
                      <motion.div
                        className="absolute inset-0 bg-blue-600/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Information */}
          <div className="space-y-6">
            {/* Product Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <div className="h-1.5 w-16 bg-blue-600 rounded mt-2"></div>
              {product.longDescription && (
                <h2 className="text-base md:text-lg text-gray-600 mt-2">
                  {product.longDescription}
                </h2>
              )}
            </motion.div>

            {/* Key Features */}
            {product.shortFeatures && product.shortFeatures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.shortFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0 mr-3"></span>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Download Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Contact Us Button */}
                <motion.button
                  onClick={() => {
                    if (!session) {
                      // Redirect to sign in page if not logged in
                      router.push('/auth/signin');
                    } else {
                      // Open contact modal if logged in
                      setIsContactModalOpen(true);
                    }
                  }}
                  className="border border-green-600 text-green-600 py-1 px-3 rounded-md text-xs font-medium transition-all duration-300 flex items-center justify-center hover:bg-green-600 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  <span>Contact Us</span>
                </motion.button>

                {/* PDF Catalog Button */}
                {product.catalogFile && (
                  <motion.a
                    href={product.catalogFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    <span>PDF Catalog</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        product={product ? {
          id: product.id,
          name: product.name,
          cardImage: product.cardImage
        } : undefined}
      />
    </div>
  );
}