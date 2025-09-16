"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  // Array of banner images with descriptions and links
 const banners = [
  {
    image: "/banner/banner.png",
    title: (
      <>
        Contact <span style={{ color: "#87C0CD" }}>Us</span>
      </>
    ),
    description:
      "Reach out for quotes, support or inquiries. Our expert team is here to help you find the right marine & industrial supplies.",
  },
  {
    image: "/banner/banner (1).png",
    title: (
      <>
        About <span style={{ color: "#87C0CD" }}>Us</span>
      </>
    ),
    description:
      "Founded in 2023, we deliver high-quality marine & oilfield equipment across UAE & Middle East, driven by innovation, quality & customer service.",
  },
  {
    image: "/banner/banner (3).png",
    title: (
      <>
        Our <span style={{ color: "#87C0CD" }}>Products</span>
      </>
    ),
    description:
      "Valves, fittings, flanges, rubber & gasket sheets, clamps, hoses + more — all engineered for durability & performance in demanding environments.",
  },
  {
    image: "/banner/banner (2).png",
    title: (
      <>
        Our <span style={{ color: "#87C0CD" }}>Branches</span>
      </>
    ),
    description:
      "Serving multiple locations with efficient distribution, quick response & in-person support so you can count on local presence & reliability.",
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

  

  return (
    <div
      className="w-full relative"
    >
      {/* Banner Container - Full screen height */}
      <div className="relative w-full h-screen mt-4 min-h-[600px] overflow-hidden">
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

        

        {/* Bottom Indicators - Centered */}
        <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/50"
              } ${clickedIndex === index ? "scale-125" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}