"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, Award, Shield, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "What services does Oasis Marine Trading LLC provide?",
      answer: "At Oasis Marine Trading LLC, we specialize in delivering high-quality marine and oilfield equipment. Additionally, we offer specialized support services to industries like oil & gas, marine, refining, power, desalination, and more.",
      icon: <Truck className="w-4 h-4 text-gray-600" />
    },
    {
      question: "Which industries do you serve?",
      answer: "We cater to a wide variety of industries, including upstream and downstream oil & gas, refining, petrochemical, marine, power, pipeline, desalination, water, and utility sectors. Our products are designed to meet the demands of these critical industries.",
      icon: <MapPin className="w-4 h-4 text-gray-600" />
    },
    {
      question: "Are your products ISO certified?",
      answer: "Yes, Oasis Marine Trading LLC is an ISO-certified company. We adhere to strict quality management and safety standards to ensure that all of our products meet the highest international industry requirements.",
      icon: <Award className="w-4 h-4 text-gray-600" />
    },
    {
      question: "What types of products do you supply?",
      answer: "We offer a wide range of marine and oilfield equipment, including: Valves, Mild Steel, Galvanized Iron, Stainless Steel, Flanges, Gasket sheets, Rubber sheets, Straub pipe repair solutions, and Top Orange Hand Cleaner. These products are selected to ensure durability, reliability, and top performance in demanding environments.",
      icon: <Shield className="w-4 h-4 text-gray-600" />
    },
    {
      question: "Where do you deliver your products and services?",
      answer: "We deliver our products and services across the UAE and the Middle East.",
      icon: <MapPin className="w-4 h-4 text-gray-600" />
    },
    {
      question: "What sets Oasis Marine Trading LLC apart from other suppliers?",
      answer: "Our commitment to excellence, ISO certification, and our ability to deliver time-critical project supplies makes us stand out. We provide reliable, high-quality products with exceptional service, ensuring that all your marine and oilfield equipment needs are met efficiently and cost-effectively.",
      icon: <Award className="w-4 h-4 text-gray-600" />
    },
    {
      question: "Do you offer custom solutions for specific projects?",
      answer: "Yes, we work closely with our clients to provide tailored solutions that meet the specific requirements of each project. Whether it's a specialized product or meeting a tight deadline, we aim to deliver customized, cost-effective solutions.",
      icon: <Truck className="w-4 h-4 text-gray-600" />
    },
    {
      question: "What is your approach to quality and safety?",
      answer: "At Oasis Marine Trading LLC, we are dedicated to quality, health, safety, and environmental (QHSE) practices. Our commitment to excellence ensures that all our products and services comply with the highest safety and environmental standards. We continuously improve our processes to ensure reliability and sustainability.",
      icon: <Shield className="w-4 h-4 text-gray-600" />
    },
    {
      question: "How can I place an order or inquire about a product?",
      answer: "You can reach out to us via our contact page, send us an email to oasismarinegrp@gmail.com, or give us a call. For instant support, feel free to use our contact numbers +971563096262, +97148927427, +97148928245 for quick inquiries or to discuss your needs directly with our team.",
      icon: <Phone className="w-4 h-4 text-gray-600" />
    },
    {
      question: "What is your return or warranty policy on products?",
      answer: "We provide a warranty for all of our products, ensuring they meet the required quality standards. If you encounter any issues, please contact our support team, and we will guide you through the return or replacement process based on the warranty terms.",
      icon: <Shield className="w-4 h-4 text-gray-600" />
    }
  ];

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // Animation variants for items
  const itemVariants : Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Animation variants for accordion content
  const accordionVariants: Variants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    expanded: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50">
      {/* FAQ Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Everything You Need to Know
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Find answers to the most common questions about our marine and oilfield equipment services, 
              quality standards, and how we can support your industry needs.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            className="space-y-3"
          >
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <motion.button
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleItem(index)}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="text-base font-medium text-gray-800 pr-4">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <motion.div
                      animate={{ rotate: openItems[index] ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </motion.div>
                  </div>
                </motion.button>
                
                <AnimatePresence initial={false}>
                  {openItems[index] && (
                    <motion.div
                      variants={accordionVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1">
                        <div className="pl-7">
                          <motion.p 
                            className="text-gray-700 text-sm leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {item.answer}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;