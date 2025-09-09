import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Variants } from 'framer-motion';

const Sam = () => {
  // Create refs for each section
  const commitmentRef = useRef(null);
  const productRef = useRef(null);
  
  // Check if elements are in view
  const commitmentInView = useInView(commitmentRef, { once: true, margin: "-100px" });
  const productInView = useInView(productRef, { once: true, margin: "-100px" });

  // Animation variants
  const fadeInUp : Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-white py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {/* Commitment to Customer Satisfaction */}
          <motion.div 
            ref={commitmentRef}
            variants={fadeInUp}
            animate={commitmentInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <h2 className="text-3xl  text-black leading-tight">
              Commitment to Customer<br />
             <span className='text-blue-900'>Satisfaction</span> 
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              We are deeply committed to providing the best customer experience. Our 
              experienced team offers tailored solutions to meet specific project 
              requirements, from small-scale developments to large-scale commercial and 
              infrastructure projects. We understand the importance of timely delivery and 
              cost-effective solutions, which is why we work closely with our clients to 
              ensure that each order is processed efficiently and delivered on time.
            </p>
          </motion.div>

          {/* Product Range */}
          <motion.div 
            ref={productRef}
            variants={fadeInUp}
            animate={productInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <h2 className="text-3xl  text-black leading-tight">
              Product <span className='text-blue-900'>Range</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Our product portfolio includes a comprehensive range of building materials 
              such as tools, cement, insulation materials, paints, sanitary ware, plumbing 
              supplies, electrical fittings, and more. We source our products from trusted 
              manufacturers, ensuring top-tier quality and compliance with international 
              standards.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sam;