// components/OasisStarSection.js
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import RAms from "../app/assets/branch/logo1.png";
import SAms from "../app/assets/branch/logo2.png";
import DAms from "../app/assets/branch/logo3.png";
import FAms from "../app/assets/branch/logo4.png";


// Animation variants for different elements
const titleVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const textVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0.3,
      ease: "easeOut"
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Component for animating when in view
const AnimatedSection = ({ children, variants, className = "" }: { children: React.ReactNode; variants: any; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Ram = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AnimatedSection variants={titleVariant}>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Expanded Reach Across the <span className='text-blue-900'>Middle East</span>
        </h1>
      </AnimatedSection>
      
      <AnimatedSection variants={textVariant}>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Over the years, <span className='font-bold  text-blue-900'>OASIS STAR</span> has expanded its operations, serving not only the UAE but also various regions across the Middle East. Our strategic presence in key markets ensures that we can deliver a wide range of premium building materials to meet the needs of contractors, developers, and businesses in countries including Saudi Arabia, Qatar, Oman and beyond.
        </p>
      </AnimatedSection>
      
      <hr className="border-gray-300 my-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { src: RAms, alt: "Quality Building Materials", text: "Quality Building Materials" },
          { src: SAms, alt: "Reliable Construction Supplies", text: "Reliable Construction Supplies" },
          { src: FAms, alt: "Premium Building Solution", text: "Premium Building Solution" },
          { src: DAms, alt: "Building the Future Together", text: "Building the Future Together" }
        ].map((item, index) => (
          <AnimatedSection 
            key={index}
            variants={itemVariant}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={80}
                height={80}
                className="mb-4"
              />
            </motion.div>
            <span className="text-gray-700 font-medium">{item.text}</span>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default Ram;