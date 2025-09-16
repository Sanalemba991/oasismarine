import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Variants } from 'framer-motion';
import { MapPin, Mail, Flag } from 'lucide-react';

const Sam = () => {
  // Create refs for each section
  const commitmentRef = useRef(null);
  const productRef = useRef(null);
  const contactRef = useRef(null);
     
  // Check if elements are in view
  const commitmentInView = useInView(commitmentRef, { once: true, margin: "-100px" });
  const productInView = useInView(productRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  // Animation variants
  const fadeInUp: Variants = {
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

  const contactItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Function to handle opening Google Maps
  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/place/Oasis+Marine+Trading+LLC/@25.286978,55.383382,6z/data=!4m6!3m5!1s0x3e5f5de30e5a6283:0x14805290c4c15df6!8m2!3d25.286978!4d55.3833818!16s%2Fg%2F11vlm3tdjq?hl=en&entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D', '_blank');
  };

  return (
    <div className="bg-white py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16"
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
            <h2 className="text-3xl text-black leading-tight">
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
            <h2 className="text-3xl text-black leading-tight">
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

        {/* Contact Information Section */}
        <motion.div
          ref={contactRef}
          variants={fadeInUp}
          animate={contactInView ? "visible" : "hidden"}
          className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-8 shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl text-center text-black mb-8 leading-tight"
              variants={fadeInUp}
            >
              Get in <span className='text-blue-900'>Touch</span>
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerChildren}
              animate={contactInView ? "visible" : "hidden"}
            >
              {/* Address - Now clickable */}
              <motion.div 
                variants={contactItemVariants}
                className="flex items-start space-x-4 group cursor-pointer"
                onClick={openGoogleMaps}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-red-500 transition-colors duration-300">
                    Al Nakheel Street, Deira, Dubai
                  </p>
                </div>
              </motion.div>

              {/* P.O. Box */}
              <motion.div 
                variants={contactItemVariants}
                className="flex items-start space-x-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">P.O. Box</h3>
                  <p className="text-gray-600 text-sm">
                    182353
                  </p>
                </div>
              </motion.div>

              {/* Country */}
              <motion.div 
                variants={contactItemVariants}
                className="flex items-start space-x-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Country</h3>
                  <p className="text-gray-600 text-sm">
                    United Arab Emirates
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sam;