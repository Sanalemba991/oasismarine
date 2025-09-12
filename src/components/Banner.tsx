"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  // Array of banner images with descriptions and links
  const banners = [
    {
      image: "/banner/Award 2.png",
      title: (
        <>
          Award-Winning <span style={{ color: "#1e3a8a" }}>Excellence</span>
        </>
      ),
      description:
        "Recognized globally for our innovative solutions and outstanding technological achievements.",
    },
    {
      image: "/banner/P 2.png",
      title: (
        <>
          Enterprise <span style={{ color: "#1e3a8a" }}>Solutions</span>
        </>
      ),
      description:
        "Complete surveillance ecosystems: high-definition cameras, reliable storage, professional cabling, and durable hard disks for long-term performance.",
    },
    {
      image: "/banner/Contact 1.png",
      title: (
        <>
          Strategic <span style={{ color: "#1e3a8a" }}>Partnership</span>
        </>
      ),
      description:
        "Partner with us to leverage cutting-edge technology and expert consultation for your business growth.",
    },
    {
      image: "/banner/History.png",
      title: (
        <>
          Innovation & <span style={{ color: "#1e3a8a" }}>Excellence</span>
        </>
      ),
      description:
        "Pioneering technological advancement with over two decades of industry expertise and innovation.",
    },
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Forward direction for auto-rotation
      setCurrentImageIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle indicator click
  const handleIndicatorClick = (index: number) => {
    const newDirection = index > currentImageIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentImageIndex(index);
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 1000); // Reset after 1 second
  };

  // Handle previous button click
  const handlePrevious = () => {
    setDirection(-1); // Left to right direction
    setCurrentImageIndex(
      currentImageIndex === 0 ? banners.length - 1 : currentImageIndex - 1
    );
  };

  // Handle next button click
  const handleNext = () => {
    setDirection(1); // Right to left direction
    setCurrentImageIndex(
      currentImageIndex === banners.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  // Animation variants
  const bannerVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Container - Full screen height */}
      <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={banners[currentImageIndex].image}
              alt={`Banner image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority={currentImageIndex === 0}
              sizes="100vw"
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Banner Content - Left aligned */}
            <div className="absolute inset-0 flex items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-white px-8 md:px-12 lg:px-24 max-w-2xl"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                >
                  {banners[currentImageIndex].title}
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl lg:text-2xl mb-8 font-light tracking-wide opacity-90"
                >
                  {banners[currentImageIndex].description}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Animate on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                variants={arrowVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-10 transition-all duration-300"
                aria-label="Previous slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>
              <motion.button
                variants={arrowVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-10 transition-all duration-300"
                aria-label="Next slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Indicators - Centered */}
        <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/80"
              } ${clickedIndex === index ? "scale-125" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}