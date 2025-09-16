"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const QHSEPolicySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 1.1
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      scale: 1.1
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="bg-white py-16 px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <motion.div 
            variants={imageVariants}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <img
                src="/last.jpg"
                alt="Marine pipe fittings and components"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            variants={contentVariants}
            className="order-1 lg:order-2"
          >
            <motion.div variants={containerVariants} className="space-y-6">
              {/* Header */}
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  QHSE Policy - <span className='text-[#1e3a8a]'>Oasis Marine Trading LLC</span>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  We are dedicated to maintaining the highest standards in{' '}
                  <span className="font-semibold text-gray-800">Quality, Health, Safety, and Environmental</span>{' '}
                  practices. Our commitment includes;
                </p>
              </motion.div>

              {/* Policy Points */}
              <div className="space-y-4">
                <motion.div variants={itemVariants} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Delivering products and services that not only meet but exceed our clients' requirements, ensuring consistent quality and performance.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Continuously enhancing our quality management system to drive improvement and innovation in all areas of our operations.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Providing a safe and healthy work environment for all employees by implementing rigorous safety protocols and preventive measures.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Protecting the environment by adopting sustainable practices that minimize pollution and prevent environmental damage.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Safeguarding our assets and resources to ensure operational integrity and security.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Working towards the integration and implementation of a comprehensive Integrated Management System (IMS) to align all our practices with industry-leading standards.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QHSEPolicySection;