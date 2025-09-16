'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { Variants } from 'framer-motion';

const latestProducts = [
  {
    id: 1,
    name: "BLIND FLANGES",
    model: "FLANGES",
    image: "/Blind.png",
    category: "Wi-Fi Camera",
  },
];

// Animation variants (unchanged)
const containerVariants : Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const titleVariants : Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.23, 1, 0.32, 1],
      delay: 0.1
    }
  }
};

const lineVariants : Variants = {
  hidden: { width: 0 },
  visible: { 
    width: "6rem",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3
    }
  }
};

const cardVariants : Variants = {
  hidden: { opacity: 0, y: 60, rotateX: 15, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.175, 0.885, 0.32, 1.275],
      delay: 0.5
    }
  },
  float: {
    y: [0, -3, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

const imageVariants : Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1],
      delay: 0.7
    }
  }
};

const nameVariants : Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.9
    }
  }
};

const modelVariants : Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 1
    }
  }
};

export default function ProductsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <motion.section 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="py-20 bg-white products-section"
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        {/* Section Header - Made smaller */}
        <div className="text-center mb-16">
          <motion.h2 
            variants={titleVariants}
            className="text-2xl md:text-4xl font-bold text-gray-800 mb-6" // Reduced from text-xl md:text-5xl
          >
            Explore Our Latest <span className='text-[#1e3a8a]'>Products</span>
          </motion.h2>
          <motion.div 
            variants={lineVariants}
            className="w-24 h-1 bg-blue-900 mx-auto"
          />
        </div>

        {/* Single Product Card - Enlarged */}
        <div className="flex justify-center">
          <div className="max-w-lg w-full">
            {latestProducts.map((product) => (
              <motion.div 
                key={product.id}
                variants={cardVariants}
                animate={inView ? ["visible", "float"] : ""}
                className="rounded-3xl  text-center "
              >
                {/* Product Image - Made bigger */}
                <div className="mb-10 flex justify-center">
                  <motion.img 
                    src={product.image} 
                    alt={product.name}
                    variants={imageVariants}
                    className="w-80 h-auto object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <motion.h3 
                    variants={nameVariants}
                    className="text-2xl font-bold text-gray-800"
                  >
                    {product.name}
                  </motion.h3>
                  <motion.p 
                    variants={modelVariants}
                    className="text-gray-600 text-base"
                  >
                    {product.model}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}