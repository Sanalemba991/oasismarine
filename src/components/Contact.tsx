"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Banner from "../app/assets/banner/Contact 1.png";

const Contact: React.FC = () => {
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const [bannerInView, setBannerInView] = React.useState(false);
  const timelineRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [activeItems, setActiveItems] = React.useState<boolean[]>([]);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  // useInView hook for sections
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [oasisRef, oasisInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [contactFormRef, contactFormInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setBannerInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  // Function to handle phone call
  const handlePhoneCall = () => {
    window.open("tel:+971563096262");
  };

  // Function to handle email
  const handleEmailClick = () => {
    window.open("mailto:sales@oasismarineuae.com");
  };

  // Function to open location in Google Maps
  const handleLocationClick = () => {
    window.open("https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6089481.187286434!2d55.383382!3d25.286978!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5de30e5a6283%3A0x14805290c4c15df6!2sOasis%20Marine%20Trading%20LLC!5e1!3m2!1sen!2sus!4v1756716453086!5m2!1sen!2sus");
  };

  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const slideInFromRight: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <>
      {/* Banner Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="About Oasis Marine UAE"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
              src={Banner}
              alt="Oasis Marine UAE Banner"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          </div>

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-gray-700/60"></div>
        </div>

        {/* Animated background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-10"
        >
          {/* Tech grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(107, 114, 128, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(107, 114, 128, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3,
                    delayChildren: 0.4,
                    ease: "easeOut",
                    duration: 0.8,
                  },
                },
              }}
              className="text-white"
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight"
              >
                Contact Oasis{" "}
                <span className="text-[#3f23cc] drop-shadow-lg">
                  Marine UAE
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="text-sm sm:text-base lg:text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl drop-shadow-md"

              >
               At Oasis Marine trading L.L.C we specialize in providing top-quality oil marine equipment to support your maritime operations. With a focus on reliability and performance, we offer a comprehensive range of high-pressure fittings, pumps, valves, and more. Serving the UAE’s vibrant marine industry, our products are designed to withstand the harshest conditions, ensuring safety and efficiency. Explore our extensive inventory and experience unparalleled service today!
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-gray-300 mb-2 drop-shadow-md">
              Scroll down
            </span>
            <svg
              className="w-6 h-6 text-gray-300 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section
        ref={contactFormRef}
        className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(107, 114, 128, 0.1) 0%, transparent 70%),
                radial-gradient(circle at 75% 75%, rgba(107, 114, 128, 0.1) 0%, transparent 70%)
              `,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={contactFormInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              <motion.div variants={fadeInUpVariants}>
                <h2 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
                  Do You Have Any{" "}
                  <span className="text-[#3f23cc]">Questions?</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  For inquiries about our extensive range of products including
                  carbon and stainless steel pipes, flanges, fittings, valves,
                  plates, gaskets, fasteners, and more, contact Fitting World
                  Trading LLC.
                </p>
              </motion.div>

              <motion.div variants={fadeInUpVariants} className="space-y-6">
                {/* Email */}
                <div 
                  className="flex items-center space-x-4 group cursor-pointer"
                  onClick={handleEmailClick}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 21H5V3H13V9H19Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-lg">
                     sales@oasismarineuae.com
                    </p>
                    <p className="text-gray-500">Email address</p>
                  </div>
                </div>

                {/* Phone 1 */}
                <div 
                  className="flex items-center space-x-4 group cursor-pointer"
                  onClick={handlePhoneCall}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-lg">
                      +971563096262
                    </p>
                    <p className="text-gray-500">Phone line</p>
                  </div>
                </div>

                {/* Address */}
                <div 
                  className="flex items-start space-x-4 group cursor-pointer"
                  onClick={handleLocationClick}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300 mt-1">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-lg leading-relaxed">
                    5 - Street 2 11th St - Al Qusais - Dubai - United Arab Emirates
                    </p>
                    <p className="text-gray-500">Office address</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form - Coming from right */}
            <motion.div
              variants={slideInFromRight}
              initial="hidden"
              animate={contactFormInView ? "visible" : "hidden"}
              className="p-8 lg:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject*
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="What is this regarding?"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-vertical"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>                        
                {/* Submit Button */}
                <div className="flex justify-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{
                      backgroundColor: "transparent",
                      color: "#1e3a8a",
                      border: "2px solid #1e3a8a",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`py-3 px-8 font-medium text-white border-2 border-transparent ${
                      isSubmitting
                        ? "bg-blue-700 cursor-not-allowed"
                        : submitStatus === "success"
                        ? "bg-emerald-600"
                        : submitStatus === "error"
                        ? "bg-red-600"
                        : "bg-blue-900"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="text-sm">Sending...</span>
                        </>
                      ) : submitStatus === "success" ? (
                        <>
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Message Sent</span>
                        </>
                      ) : submitStatus === "error" ? (
                        <>
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Try Again</span>
                        </>
                      ) : (
                        <span className="text-sm">Send Message</span>
                      )}
                    </div>
                  </motion.button>
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-100 border border-gray-300"
                  >
                    <p className="text-gray-800 text-sm">
                      Thank you for your message! We will get back to you within
                      24 hours.
                    </p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-100 border border-gray-300"
                  >
                    <p className="text-gray-800 text-sm">
                      Sorry, there was an error sending your message. Please try
                      again or contact us directly.
                    </p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
       <section className="bg-white w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="w-full h-[600px] relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6089481.187286434!2d55.383382!3d25.286978!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5de30e5a6283%3A0x14805290c4c15df6!2sOasis%20Marine%20Trading%20LLC!5e1!3m2!1sen!2sus!4v1756716453086!5m2!1sen!2sus" 
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Oasis Marine Trading LLC - Al Qusais, Dubai - United Arab Emirates"
              className="absolute inset-0"
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Contact;