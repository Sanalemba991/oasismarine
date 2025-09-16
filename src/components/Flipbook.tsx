"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";

import image1 from "../app/assets/book-pages/page-1.jpg";
import image2 from "../app/assets/book-pages/page-2.jpg";
import image3 from "../app/assets/book-pages/page-3.jpg";
import image4 from "../app/assets/book-pages/page-4.jpg";
import image5 from "../app/assets/book-pages/page-5.jpg";
import image6 from "../app/assets/book-pages/page-6.jpg";
import image7 from "../app/assets/book-pages/page-7.jpg";
import image8 from "../app/assets/book-pages/page-8.jpg";
import image9 from "../app/assets/book-pages/page-9.jpg";
import image10 from "../app/assets/book-pages/page-10.jpg";
import image11 from "../app/assets/book-pages/page-11.jpg";
import image12 from "../app/assets/book-pages/page-12.jpg";
import image13 from "../app/assets/book-pages/page-13.jpg";
import image14 from "../app/assets/book-pages/page-14.jpg";
import image15 from "../app/assets/book-pages/page-15.jpg";
import image16 from "../app/assets/book-pages/page-16.jpg";
import image17 from "../app/assets/book-pages/page-17.jpg";
import image18 from "../app/assets/book-pages/page-18.jpg";
import image19 from "../app/assets/book-pages/page-19.jpg";
import image20 from "../app/assets/book-pages/page-20.jpg";
import image21 from "../app/assets/book-pages/page-21.jpg";
import image22 from "../app/assets/book-pages/page-22.jpg";
import image23 from "../app/assets/book-pages/page-23.jpg";
import image24 from "../app/assets/book-pages/page-24.jpg";
import image25 from "../app/assets/book-pages/page-25.jpg";
import image26 from "../app/assets/book-pages/page-26.jpg";
import image27 from "../app/assets/book-pages/page-27.jpg";
import image28 from "../app/assets/book-pages/page-28.jpg";
import image29 from "../app/assets/book-pages/page-29.jpg";
import image30 from "../app/assets/book-pages/page-30.jpg";
import image31 from "../app/assets/book-pages/page-31.jpg";
import image32 from "../app/assets/book-pages/page-32.jpg";

// Page component with forwardRef for react-pageflip compatibility
const Page = React.forwardRef(
  (props: { children: React.ReactNode }, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className="h-full w-full bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ padding: "16px", boxSizing: "border-box" }}
      >
        {props.children}
      </div>
    );
  }
);
Page.displayName = "Page";

// Cover component with forwardRef
const PageCover = React.forwardRef(
  (props: { children: React.ReactNode }, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className="h-full w-full bg-white rounded-lg shadow-xl overflow-hidden"
        data-density="hard"
      >
        {props.children}
      </div>
    );
  }
);
PageCover.displayName = "PageCover";

const BlogFlipbook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipbookReady, setIsFlipbookReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 500 });
  interface FlipBookInstance {
    pageFlip(): {
      flipNext: () => void;
      flipPrev: () => void;
      flip: (pageIndex: number) => void;
      getPageCount: () => number;
    };
  }
  const flipBook = useRef<FlipBookInstance | null>(null);
  const flipbookContainer = useRef<HTMLDivElement>(null);

  // Random cover images from Unsplash
  const frontCoverImage = image1;
  const backCoverImage = image2;

  const blogPages = [
    { id: 1, image: image1 },
    { id: 2, image: image2 },
    { id: 3, image: image3 },
    { id: 4, image: image4 },
    { id: 5, image: image5 },
    { id: 6, image: image6 },
    { id: 7, image: image7 },
    { id: 8, image: image8 },
    { id: 9, image: image9 },
    { id: 10, image: image10 },
    { id: 11, image: image11 },
    { id: 12, image: image12 },
    { id: 13, image: image13 },
    { id: 14, image: image14 },
    { id: 15, image: image15 },
    { id: 16, image: image16 },
    { id: 17, image: image17 },
    { id: 18, image: image18 },
    { id: 19, image: image19 },
    { id: 20, image: image20 },
    { id: 21, image: image21 },
    { id: 22, image: image22 },
    { id: 23, image: image23 },
    { id: 24, image: image24 },
    { id: 25, image: image25 },
    { id: 26, image: image26 },
    { id: 27, image: image27 },
    { id: 28, image: image28 },
    { id: 29, image: image29 },
    { id: 30, image: image30 },
    { id: 31, image: image31 },
    { id: 32, image: image32 },
  ];

  // Prevent default scroll behavior when interacting with flipbook
  const preventScroll = useCallback((e: WheelEvent | TouchEvent) => {
    if (
      flipbookContainer.current &&
      flipbookContainer.current.contains(e.target as Node)
    ) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    // Add event listeners to prevent scrolling when interacting with flipbook
    const container = flipbookContainer.current;
    if (!container) return;

    // Only prevent wheel on desktop; allow touch scroll on mobile devices
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    container.addEventListener("wheel", preventScroll, { passive: false });
    if (!isTouchDevice) {
      container.addEventListener("touchmove", preventScroll, { passive: false });
    }

    return () => {
      container.removeEventListener("wheel", preventScroll);
      if (!isTouchDevice) {
        container.removeEventListener("touchmove", preventScroll);
      }
    };
  }, [preventScroll]);

  // Responsive dimensions using container width (better for mobile)
  useEffect(() => {
    const containerElement = flipbookContainer.current;
    if (!containerElement) return;

    const updateDimensions = (containerWidth: number) => {
      const width = Math.max(240, Math.min(Math.round(containerWidth), 600));
      const height = Math.round(width * 1.33);
      setDimensions({ width, height });
    };

    // Initialize immediately
    updateDimensions(containerElement.clientWidth);

    // Observe container resize if supported; fallback to window resize
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateDimensions(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerElement);
      return () => resizeObserver.disconnect();
    } else {
      const handleResize = () => updateDimensions(containerElement.clientWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const nextPage = useCallback(() => {
    if (flipBook.current && isFlipbookReady && currentPage < totalPages - 1) {
      try {
        flipBook.current.pageFlip().flipNext();
      } catch (error) {
        console.error("Error flipping next page:", error);
      }
    }
  }, [currentPage, isFlipbookReady, totalPages]);

  const prevPage = useCallback(() => {
    if (flipBook.current && isFlipbookReady && currentPage > 0) {
      try {
        flipBook.current.pageFlip().flipPrev();
      } catch (error) {
        console.error("Error flipping previous page:", error);
      }
    }
  }, [currentPage, isFlipbookReady]);

  const onPage = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flipBook.current && flipBook.current.pageFlip) {
        try {
          const pageFlip = flipBook.current.pageFlip();
          if (pageFlip) {
            setTotalPages(pageFlip.getPageCount());
            setIsFlipbookReady(true);
          }
        } catch (error) {
          console.error("Error initializing flipbook:", error);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPage();
      } else if (e.key === "ArrowRight") {
        nextPage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, isFlipbookReady, prevPage, nextPage]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative py-8 px-4 overflow-hidden overscroll-none">
      <div className="max-w-4xl mx-auto text-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm font-semibold tracking-wider text-[#1e3a8a] uppercase bg-blue-50 px-4 py-2 rounded-full inline-block"
          >
            Interactive Product Catalog
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-6 leading-tight"
          >
            <span className="text-[#1e3a8a]">Oasis Marine</span> Trading LLC <br />
            Digital Product Catalog
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 w-20 bg-[#1e3a8a] mx-auto mb-8"
          ></motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.6, staggerChildren: 0.2 }}
          className="text-lg text-gray-700 mb-8 leading-relaxed space-y-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Explore our comprehensive digital product catalog featuring premium
            marine and oilfield equipment. This interactive flipbook showcases
            our complete range of high-quality products including marine valves,
            industrial fittings, flanges, gasket sheets, stainless steel
            components, and specialized repair solutions with detailed
            specifications and technical information.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Navigate through 68 pages of carefully curated products designed for
            marine and oil field industries. Each page provides detailed product
            information, technical specifications, and quality certifications,
            offering you a complete overview of our extensive inventory and
            capabilities in the marine equipment sector.
          </motion.p>
        </motion.div>
      </div>

      {/* Main Flipbook Container with ref */}
      <div
        ref={flipbookContainer}
        className="relative w-full max-w-4xl mx-auto"
        style={{ height: `${dimensions.height}px` }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* React PageFlip Component */}
        <HTMLFlipBook
          ref={flipBook}
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={240}
          maxWidth={600}
          minHeight={320}
          maxHeight={700}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onPage}
          className="bg-transparent mx-auto"
          style={{ position: "relative" }}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30} // Increased swipe distance for better mobile experience
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Front Cover Page - Image Only */}
          <PageCover>
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <img
                src={frontCoverImage.src}
                alt="Book Cover"
                className="max-w-full max-h-full object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </PageCover>

          {/* Content Pages - Only Images */}
          {blogPages.map((blog, index) => (
            <Page key={blog.id}>
              <div className="flex flex-col h-full">
                {/* Image Section - Full Page */}
                <div className="flex-1 relative overflow-hidden mb-3">
                  <img
                    src={blog.image.src}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Page Number */}
                <div className="pt-2 text-center text-xs text-gray-500 border-t mt-2">
                  Page {index + 1} of {blogPages.length}
                </div>
              </div>
            </Page>
          ))}

          {/* Back Cover Page - Image Only */}
          <PageCover>
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <img
                src={backCoverImage.src}
                alt="Book Back Cover"
                className="max-w-full max-h-full object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </PageCover>
        </HTMLFlipBook>

        {/* Navigation Controls - Only show when hovering */}
        <AnimatePresence>
          {isHovering && (
            <>
              <motion.button
                onClick={prevPage}
                disabled={currentPage === 0 || !isFlipbookReady}
                className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 z-10 ${
                  currentPage === 0 || !isFlipbookReady
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white hover:scale-110 hover:shadow-xl"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </motion.button>

              <motion.button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1 || !isFlipbookReady}
                className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 z-10 ${
                  currentPage === totalPages - 1 || !isFlipbookReady
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white hover:scale-110 hover:shadow-xl"
                }`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} className="text-gray-700" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Floating Page Counter */}
        

        {/* Keyboard Navigation Hint */}
        <motion.div
          className="absolute bottom-12 right-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-lg text-xs shadow-lg">
            Use ← → keys to navigate
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Flipbook error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              The flipbook encountered an error.
            </p>
            <details className="text-left mb-4 text-sm text-gray-500">
              {this.state.error && this.state.error.toString()}
            </details>
            <button
              onClick={this.resetErrorBoundary}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main export with error boundary
export default function Flipbook() {
  return (
    <ErrorBoundary>
      <BlogFlipbook />
    </ErrorBoundary>
  );
}