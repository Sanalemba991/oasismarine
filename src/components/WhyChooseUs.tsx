"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion';

export default function WhyChooseUs() {
  const [openSection, setOpenSection] = useState<string | null>('expertise');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: 'expertise',
      title: 'Expertise',
      content: 'Our team brings deep industry knowledge and experience, ensuring our clients receive the best solutions for their marine and oil field needs'
    },
    {
      id: 'quality',
      title: 'Quality & Reliability',
      content: 'We maintain the highest standards in all our products and services, ensuring consistent performance and durability in the most demanding environments.'
    },
    {
      id: 'customized',
      title: 'Customized Solutions',
      content: 'Every project is unique, and we tailor our approaches to meet specific client requirements, providing personalized solutions that deliver optimal results.'
    },
    {
      id: 'commitment',
      title: 'Commitment to Service',
      content: 'Our dedication to exceptional customer service means we\'re with you every step of the way, from initial consultation to ongoing support and maintenance.'
    }
  ];

  const containerVariants : Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const imageVariants : Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const accordionVariants : Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants : Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const contentVariants : Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div ref={ref} className="bg-white py-12 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -15 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5
              }
            }
          }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose <span className='text-[#1e3a8a]'>Us</span>
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side - Image with animation */}
          <motion.div 
            className="flex justify-center"
            variants={imageVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="w-full max-w-lg">
              <div className="h-96 rounded-lg flex items-center justify-center">
                <div className="flex justify-center">
                  <img 
                    src="/procducts.png"
                    className="w-96 h-auto object-contain"
                    alt="Our Products"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Accordion with animation */}
          <motion.div 
            className="space-y-0"
            variants={accordionVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  className={`border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}
                  variants={itemVariants}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 px-2"
                  >
                    <span className="text-lg font-semibold text-gray-800">
                      {section.title}
                    </span>
                    <div className="flex-shrink-0 ml-3">
                      {openSection === section.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 font-bold" strokeWidth={2.5} />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 font-bold" strokeWidth={2.5} />
                      )}
                    </div>
                  </button>
                  
                  {/* Expandable content with animation */}
                  <AnimatePresence>
                    {openSection === section.id && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={contentVariants}
                        className="overflow-hidden"
                      >
                        <div className="px-2 pb-4">
                          <p className="text-gray-600 leading-relaxed text-base">
                            {section.content}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}