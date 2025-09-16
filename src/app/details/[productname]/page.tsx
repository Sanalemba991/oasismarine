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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  params: Promise<{ productname: string }>;
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

  // Initialize params
  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = await params;
        setProductSlug(resolvedParams.productname);
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
  // ... existing imports ...

  const downloadProductInfo = async () => {
    if (!product) return;

    setIsDownloading(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let currentY = margin;

      // Helper functions
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * (fontSize * 0.5));
      };

      const addHeading = (text: string, y: number) => {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 64, 175);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, y);
        currentY = y + 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(12);
      };

      // Improved image loading function
      const loadImageSafely = async (imageUrl: string): Promise<string | null> => {
        try {
          // Check if it's a relative URL and make it absolute
          const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;

          const response = await fetch(fullUrl, {
            mode: 'cors',
            headers: {
              'Accept': 'image/*',
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }

          const blob = await response.blob();

          // Validate image type
          if (!blob.type.startsWith('image/')) {
            throw new Error('Invalid image type');
          }

          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.warn(`Failed to load image ${imageUrl}:`, error);
          return null;
        }
      };

      // Add header with company logo
      try {
        const logoBase64 = await loadImageSafely('/logo1.png');
        if (logoBase64) {
          pdf.addImage(logoBase64, 'PNG', margin, currentY, 20, 20);
        }
        currentY += 30;
      } catch (error) {
        console.warn('Logo loading failed:', error);
        currentY += 10; // Add some space even if logo fails
      }

      // Add product title section
      pdf.setFillColor(245, 247, 250);
      pdf.rect(margin, currentY, pageWidth - (margin * 2), 30, 'F');

      // Product name
      pdf.setFontSize(20);
      pdf.setTextColor(33, 64, 175);
      pdf.setFont('helvetica', 'bold');
      currentY = addWrappedText(product.name, margin + 5, currentY + 8, pageWidth - (margin * 2) - 10, 20);

      // Short description
      if (product.shortDescription) {
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'normal');
        currentY = addWrappedText(product.shortDescription, margin + 5, currentY + 5, pageWidth - (margin * 2) - 10, 12);
      }

      currentY += 15;

      // Add product image with better error handling
      if (product.cardImage || (product.detailImages && product.detailImages[0])) {
        const imageUrl = product.cardImage || product.detailImages![0];

        try {
          const imageBase64 = await loadImageSafely(imageUrl);
          if (imageBase64) {
            // Determine image format
            const imageFormat = imageUrl.toLowerCase().includes('.png') ? 'PNG' : 'JPEG';

            // Add image with proper dimensions
            const imageWidth = Math.min(pageWidth - (margin * 2), 120);
            const imageHeight = 80;

            pdf.addImage(imageBase64, imageFormat, margin, currentY, imageWidth, imageHeight);
            currentY += imageHeight + 15;
          } else {
            // Add placeholder text if image fails
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text('[Image could not be loaded]', margin, currentY);
            currentY += 10;
          }
        } catch (error) {
          console.warn('Product image loading failed:', error);
          // Continue without image
        }
      }

      // Add long description
      if (product.longDescription) {
        addHeading('Description', currentY);
        currentY = addWrappedText(product.longDescription, margin, currentY + 5, pageWidth - (margin * 2));
        currentY += 10;
      }

      // Add key features
      if (product.shortFeatures && product.shortFeatures.length > 0) {
        addHeading('Key Features', currentY);
        product.shortFeatures.forEach(feature => {
          // Add bullet point
          pdf.setFillColor(33, 64, 175);
          pdf.circle(margin + 3, currentY + 3, 1, 'F');
          currentY = addWrappedText(feature, margin + 8, currentY + 4, pageWidth - (margin * 2) - 8);
          currentY += 4;
        });
        currentY += 10;
      }

      // Add specifications table
      if (product.specifications && Object.keys(product.specifications).length > 0) {
        addHeading('Technical Specifications', currentY);

        const tableData = Object.entries(product.specifications)
          .filter(([_, value]) => value !== null && value !== undefined && value !== '');

        if (tableData.length > 0) {
          // Table styling
          pdf.setFillColor(245, 247, 250);
          pdf.setDrawColor(220, 220, 220);
          pdf.setLineWidth(0.1);

          // Table headers
          pdf.setFont('helvetica', 'bold');
          pdf.setFillColor(33, 64, 175);
          pdf.setTextColor(255, 255, 255);
          pdf.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
          pdf.text('Specification', margin + 3, currentY + 6);
          pdf.text('Value', margin + (pageWidth - (margin * 2)) / 2 + 3, currentY + 6);
          currentY += 8;

          // Table rows
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 60, 60);

          tableData.forEach((row, index) => {
            if (index % 2 === 0) {
              pdf.setFillColor(250, 250, 250);
              pdf.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
            }

            // Truncate long values to prevent overflow
            const key = row[0].length > 25 ? row[0].substring(0, 22) + '...' : row[0];
            const value = String(row[1]).length > 30 ? String(row[1]).substring(0, 27) + '...' : String(row[1]);

            pdf.text(key, margin + 3, currentY + 6);
            pdf.text(value, margin + (pageWidth - (margin * 2)) / 2 + 3, currentY + 6);
            currentY += 8;
          });
          currentY += 10;
        }
      }

      // Add packaging information
      if (product.packaging) {
        addHeading('Packaging Information', currentY);

        const packagingInfo = [];

        if (product.packaging.dimensions) {
          const dims = product.packaging.dimensions;
          packagingInfo.push(`Dimensions: ${dims.length || 'N/A'} × ${dims.width || 'N/A'} × ${dims.height || 'N/A'} ${dims.unit || ''}`);
        }

        if (product.packaging.weight) {
          const weight = product.packaging.weight;
          packagingInfo.push(`Net Weight: ${weight.net || 'N/A'} ${weight.unit || ''}`);
          packagingInfo.push(`Gross Weight: ${weight.gross || 'N/A'} ${weight.unit || ''}`);
        }

        if (product.packaging.material) {
          packagingInfo.push(`Material: ${product.packaging.material}`);
        }

        if (product.packaging.type) {
          packagingInfo.push(`Package Type: ${product.packaging.type}`);
        }

        if (product.packaging.quantity) {
          packagingInfo.push(`Quantity per Package: ${product.packaging.quantity} units`);
        }

        packagingInfo.forEach(info => {
          currentY = addWrappedText(`• ${info}`, margin, currentY + 4, pageWidth - (margin * 2));
          currentY += 2;
        });

        if (product.packaging.notes) {
          currentY += 5;
          pdf.setFillColor(255, 248, 220);
          const noteHeight = 15;
          pdf.rect(margin, currentY, pageWidth - (margin * 2), noteHeight, 'F');
          pdf.setFontSize(10);
          pdf.setTextColor(150, 100, 0);
          currentY = addWrappedText(`Note: ${product.packaging.notes}`, margin + 3, currentY + 5, pageWidth - (margin * 2) - 6, 10);
          currentY += 10;
        }
      }

      // Add footer with generation info
      const footerY = pageHeight - 15;
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, footerY);

      pdf.text('© ' + new Date().getFullYear() + ' All rights reserved', pageWidth - margin - 50, footerY);

      // Generate filename
      const sanitizedName = product.name
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 50);

      const fileName = `${sanitizedName}_product_info.pdf`;

      // Save the PDF
      pdf.save(fileName);

      setNotificationMessage('Product information PDF downloaded successfully!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

    } catch (error) {
      console.error('PDF generation error:', error);
      setNotificationMessage('Failed to generate PDF. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsDownloading(false);
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
          <p className="text-sm text-gray-500 mb-6">Product Name: {productSlug}</p>
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
          <p className="text-sm text-gray-500">Product Name: {productSlug}</p>
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
    <div className="min-h-screen bg-white">
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
      <div className="relative py-4 md:py-6 lg:py-8 bg-white overflow-hidden">         
  <div className="absolute inset-0 bg-white"></div>         
  <div className="container mx-auto px-6 py-8 relative z-10">           
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">             
      {/* Left side - Content */}             
      <motion.div               
        className="text-white space-y-4"               
        initial={{ opacity: 0, x: -50 }}               
        animate={{ opacity: 1, x: 0 }}               
        transition={{ duration: 0.8 }}             
      >               
        <div>                 
          <motion.h1                   
            className="text-3xl text-[#1e3a8a] md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"                   
            initial={{ opacity: 0, y: 30 }}                   
            animate={{ opacity: 1, y: 0 }}                   
            transition={{ duration: 0.8, delay: 0.3 }}                 
          >                   
            {product.name}                 
          </motion.h1>                  
          
          {product.shortDescription && (                   
            <motion.p                     
              className="text-lg md:text-xl text-black leading-relaxed mb-4"                     
              initial={{ opacity: 0, y: 20 }}                     
              animate={{ opacity: 1, y: 0 }}                     
              transition={{ duration: 0.6, delay: 0.4 }}                   
            >                     
              {product.shortDescription}                   
            </motion.p>                 
          )}                  
          
          <motion.div                   
            className="flex flex-wrap items-center gap-4 text-blue-100"                   
            initial={{ opacity: 0, y: 20 }}                   
            animate={{ opacity: 1, y: 0 }}                   
            transition={{ duration: 0.6, delay: 0.5 }}                 
          >
          </motion.div>               
        </div>             
      </motion.div>              
      
      {/* Right side - Hero Image */}             
      <motion.div               
        className="relative order-first lg:order-last"               
        initial={{ opacity: 0, x: 50 }}               
        animate={{ opacity: 1, x: 0 }}               
        transition={{ duration: 0.8, delay: 0.2 }}             
      >               
        <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto">                 
          <div className="absolute inset-0"></div>                  
          
          {selectedImage ? (                   
            <div className="relative w-full h-full">                     
              {/* Main Product Image */}                     
              <Image                       
                src={selectedImage}                       
                alt={product.name}                       
                fill                       
                className="object-contain p-4 sm:p-6 rounded-xl sm:rounded-2xl"                       
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, 50vw"                       
                priority                     
              />                      
              
              {/* Centered Watermark */}                     
              <Image                       
                src="/logo1.png"                       
                alt="Watermark"                       
                width={80}
                height={80}                       
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 sm:opacity-30 pointer-events-none select-none sm:w-[120px] sm:h-[120px]"                     
              />                   
            </div>                 
          ) : (                   
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl sm:rounded-2xl">                     
              <span className="text-4xl sm:text-5xl md:text-6xl text-gray-400">🔧</span>                   
            </div>                 
          )}               
        </div>             
      </motion.div>           
    </div>         
  </div>          
  
  {/* Decorative Elements */}                
</div>

      {/* Breadcrumb */}
      <div className="bg-white border-b-[0.5px] border-gray-200">
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
                  src="/logo1.png"
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

            {/* Social Share Section */}
            <motion.div
              className="flex items-center gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <span className="text-gray-800 mr-2 font-medium">Share:</span>
              <motion.a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-green-500 hover:bg-green-500 hover:border-green-400 hover:text-white transition-all duration-300 shadow-lg shadow-green-500/20"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp size={16} />
              </motion.a>
              <motion.a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTwitter size={16} />
              </motion.a>
              <motion.a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 shadow-lg shadow-blue-600/20"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFacebookF size={16} />
              </motion.a>
              <motion.button
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:border-purple-400 hover:text-white transition-all duration-300 shadow-lg shadow-purple-500/20 relative"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLink size={14} />
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-gray-700"
                  >
                    Copied!
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
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

            {/* Packaging Information Section */}
            {product.packaging && (
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CubeIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Packaging Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.packaging.dimensions && (
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <FaRulerCombined className="text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">
                          Dimensions
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        {product.packaging.dimensions.length || "N/A"} ×{" "}
                        {product.packaging.dimensions.width || "N/A"} ×{" "}
                        {product.packaging.dimensions.height || "N/A"}{" "}
                        {product.packaging.dimensions.unit || ""}
                      </p>
                    </div>
                  )}
                  {product.packaging.weight && (
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <FaWeight className="text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">Weight</h4>
                      </div>
                      <p className="text-gray-600">
                        Net: {product.packaging.weight.net || "N/A"}{" "}
                        {product.packaging.weight.unit || ""}
                      </p>
                      <p className="text-gray-600">
                        Gross: {product.packaging.weight.gross || "N/A"}{" "}
                        {product.packaging.weight.unit || ""}
                      </p>
                    </div>
                  )}
                  {product.packaging.material && (
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <FaBox className="text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">Material</h4>
                      </div>
                      <p className="text-gray-600">
                        {product.packaging.material}
                      </p>
                    </div>
                  )}
                  {product.packaging.type && (
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <TagIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">
                          Package Type
                        </h4>
                      </div>
                      <p className="text-gray-600">{product.packaging.type}</p>
                    </div>
                  )}
                  {product.packaging.quantity && (
                    <div className="bg-white rounded-xl p-4 border border-blue-200 md:col-span-2">
                      <div className="flex items-center mb-2">
                        <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">
                          Quantity per Package
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        {product.packaging.quantity} units
                      </p>
                    </div>
                  )}
                </div>
                {product.packaging.notes && (
                  <div className="mt-4 bg-blue-100 rounded-lg p-3 border-l-4 border-blue-600">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> {product.packaging.notes}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="bottom-0 left-0 w-full h-px bg-gray-300"></div>

            {/* Enhanced Download Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Enhanced Download Button */}
                <motion.button
                  onClick={downloadProductInfo}
                  disabled={isDownloading}
                  className="border border-blue-600 text-blue-600 py-1 px-3 rounded-md text-xs font-medium transition-all duration-300 flex items-center justify-center hover:bg-blue-600 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2"></div>
                      <span>Preparing Download...</span>
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2" />
                      <span>Download Complete Info</span>
                    </>
                  )}
                </motion.button>

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

              {/* Download Info */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Complete info includes: Product details, specifications,
                  packaging info, and all images
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      <Transition appear show={isImageModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsImageModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative max-w-6xl max-h-full">
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={selectedImage || "/placeholder-product.jpg"}
                      alt={product.name}
                      width={1200}
                      height={900}
                      className="object-contain max-h-full rounded-xl shadow-2xl"
                    />
                    <motion.button
                      onClick={() => setIsImageModalOpen(false)}
                      className="absolute top-4 right-4 text-white bg-black/20 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-black/40 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes size={18} />
                    </motion.button>

                    {allImages.length > 1 && (
                      <>
                        <motion.button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-black/40 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronLeft size={18} />
                        </motion.button>
                        <motion.button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-black/40 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronRight size={18} />
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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