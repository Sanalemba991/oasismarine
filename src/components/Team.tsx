"use client";
import React, { useState, useEffect, useRef } from "react";
import { Video } from "lucide-react";
import CEO from "../app/assets/ceo/ceo.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "../app/assets/banner/About Us.jpg";
import Boat from "../app/assets/boat/boat.png";
import About from "../app/assets/boat/About.png";
const Team = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [bannerInView, setBannerInView] = useState(false);
  const [beliefsInView, setBeliefsInView] = useState(false);
  const [teamInView, setTeamInView] = useState(false);
  const [companyInView, setCompanyInView] = useState(false);

  // Refs for sections
  const overviewRef = useRef<HTMLElement>(null);
  const solutionsRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLElement>(null);
  const beliefsRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const companyRef = useRef<HTMLElement>(null);

  // Typewriter component for the specific text area
  const TypewriterText = ({
    text,
    className,
    delay = 0,
  }: {
    text: string;
    className: string;
    delay?: number;
  }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
      // Only start typing when section is in view
      if (teamInView) {
        const timer = setTimeout(() => {
          setStartTyping(true);
        }, delay);

        return () => clearTimeout(timer);
      } else {
        // Reset when out of view
        setDisplayedText("");
        setCurrentIndex(0);
        setStartTyping(false);
      }
    }, [teamInView, delay]);

    useEffect(() => {
      if (startTyping && currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 20); // Typing speed (ms per character)

        return () => clearTimeout(timeout);
      }
    }, [currentIndex, text, startTyping]);

    return <p className={className}>{displayedText}</p>;
  };

  // Intersection observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === bannerRef.current) {
            setBannerInView(entry.isIntersecting);
          }
          if (entry.target === beliefsRef.current) {
            setBeliefsInView(entry.isIntersecting);
          }
          if (entry.target === teamRef.current) {
            setTeamInView(entry.isIntersecting);
          }
          if (entry.target === companyRef.current) {
            setCompanyInView(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) observer.observe(bannerRef.current);
    if (beliefsRef.current) observer.observe(beliefsRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    if (companyRef.current) observer.observe(companyRef.current);

    return () => observer.disconnect();
  }, []);

  // Function to scroll to specific section
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);

    const sectionRefs = {
      overview: overviewRef,
      solutions: solutionsRef,
    };

    const targetRef = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (targetRef && targetRef.current) {
      const navHeight = 80;
      const elementPosition = targetRef.current.offsetTop - navHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll spy for active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "overview", ref: overviewRef },
        { id: "solutions", ref: solutionsRef },
      ];

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (
          section.ref.current &&
          section.ref.current.offsetTop <= scrollPosition
        ) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Banner Section from slug1 */}
      <section
        ref={bannerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="About Our Team"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
              src={Banner}
              alt="Our Team Banner"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          </div>

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-cyan-900/60"></div>
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
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
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
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight"
              >
                About <span className="text-blue-900 drop-shadow-lg">Us</span>
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
                We are a team of dedicated professionals driven by a passion for
                success and innovation.
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
            <span className="text-sm text-gray-200 mb-2 drop-shadow-md">
              Scroll down
            </span>
            <svg
              className="w-6 h-6 text-gray-200 drop-shadow-md"
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

      {/* Team Section */}
      <section ref={teamRef} className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Team Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative mb-8 overflow-hidden"
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="pt-2 text-center"
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              MOIDEEN AHAMED
            </h3>
            <span className="text-blue-900 font-semibold text-sm md:text-base uppercase tracking-wider block">
              CHIEF EXECUTIVE OFFICER
            </span>
          </motion.div>

          {/* CEO Section */}
          <div className="flex flex-col items-center mb-12 max-w-3xl mx-auto">
            {/* CEO Image with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={CEO.src}
                  alt="Mohamaad - Chief Executive Officer"
                  className="w-full max-w-xl mx-auto h-64 md:h-72 lg:h-80 object-contain transition-all duration-700 transform hover:scale-105"
                />
                {/* Animated gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute inset-0 bg-gradient-to-t from-gray-500/10 to-transparent"
                />
              </div>
            </motion.div>

            {/* CEO Content with staggered animation */}
            <div className="w-full text-center mt-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-gray-700 leading-relaxed text-base lg:text-lg italic"
              >
                As the Chief Executive Officer, I am proud to lead our dedicated
                team in delivering excellence in marine and oil field products.
                Our commitment to quality, innovation, and reliability is
                unwavering, ensuring that we meet and exceed the expectations of
                our clients globally. Our success is built on trust, integrity,
                and a customer-first approach. We prioritize understanding your
                unique requirements and delivering tailored solutions that
                optimize performance and efficiency.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-gray-700 leading-relaxed text-base lg:text-lg"
              >
                Our aim has always been to provide our visitors with not just
                information, but an experience. An experience that is seamless,
                intuitive, and reflective of the quality we stand for.
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section ref={companyRef} className="py-10 md:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              {/* Using a high-quality marine equipment image from Unsplash */}
              <img
                src={About.src}
                alt="Marine and Oilfield Equipment"
                className="w-full h-60 md:h-72 lg:h-80 object-cover transition-all duration-700 transform hover:scale-105"
              />
              {/* Gradient overlay for professional look */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"
              />

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-500/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl" />
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-4"
            >
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Reliable Marine and{" "}
                  <span className="text-blue-900">Oilfield Equipment</span>{" "}
                  Supplier in the UAE
                </h2>
              </motion.div>

              {/* Description paragraphs with staggered animation */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-gray-700 leading-relaxed text-base"
              >
                <p className="mb-3">
                  Since 2023,{" "}
                  <span className="font-semibold text-gray-600">
                    Oasis Marine Trading LLC
                  </span>{" "}
                  is a trusted name in the marine and oil field supply industry.
                  From the very beginning, we have been committed to providing
                  exceptional service and tailored solutions to meet the unique
                  demands of our clients.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-gray-700 leading-relaxed text-base"
              >
                <p>
                  Specializing in top-tier marine supplies, we are driven by a
                  passion for excellence and a mission to ensure reliability and
                  performance across every product we deliver.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <p className="text-gray-700 leading-relaxed text-base text-left">
            We stand by our commitment to deliver only the highest quality
            products for marine and oil field operations. Our team prioritizes
            stringent quality assurance processes, guaranteeing that every item
            we supply meets the demanding standards of these industries.
            Reliability, durability, and customer satisfaction are at the heart
            of everything we do.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mt-7 mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.h5
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="font-bold text-lg md:text-xl text-gray-900 mb-4"
        >
          Protecting the Future of Marine and Oil Field Industries
        </motion.h5>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-gray-700 leading-relaxed text-base text-left"
        >
          <p>
            At Oasis Marine Trading LLC, we believe that excellence goes hand in
            hand with responsibility. Our commitment to sustainability is woven
            into the fabric of our operations, guiding our decisions and
            actions. As a company serving industries that have a direct impact
            on the environment, we recognize our responsibility to prioritize
            sustainable practices. We are dedicated to adopting eco-friendly
            solutions in our supply chain and product offerings. From reducing
            our carbon footprint to sourcing environmentally responsible
            materials, every step we take is aimed at safeguarding the marine
            ecosystems and promoting long-term sustainability in the industries
            we serve.
          </p>
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6  py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="bg-white rounded-xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex-1 p-8 lg:p-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Our Key Sustainability <span className="text-[#1e3a8a]">Initiatives</span>
              </h2>

              <div className="space-y-7">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="initiative"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    1. Eco-Conscious Product Range
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We continually expand our product portfolio with innovative,
                    eco-friendly alternatives that offer reduced environmental
                    impact while maintaining the highest standards of quality
                    and performance.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="initiative"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    2. Sustainable Sourcing
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We collaborate with suppliers who share our commitment to
                    sustainability, ensuring that the materials we provide are
                    responsibly sourced and compliant with global environmental
                    standards.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="initiative"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    3. Waste Reduction Practices
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    At{" "}
                    <span className="text-blue-900 font-semibold">
                      Oasis Marine
                    </span>
                    , we strive to minimize waste across all levels of our
                    supply chain and operations by embracing efficient processes
                    and recycling initiatives.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="initiative"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    4. Energy Efficiency
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We implement cutting-edge energy-efficient technologies
                    across our facilities and operations to reduce our carbon
                    footprint and promote sustainable business practices.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Image Section - Made smaller with border */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex-1 flex items-center justify-center p-8 lg:p-12"
            >
              <div className="relative w-full h-64 lg:h-80 overflow-hidden rounded-xl   shadow-xl">
                <Image
                  src={Boat}
                  alt="Container ship on blue ocean waters"
                  fill
                  className="object-cover"
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {/* Subtle overlay for better visual appearance */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-cyan-700/5"></div>

                {/* Decorative border elements */}
                <div className="absolute top-2 left-2 right-2 bottom-2  rounded-lg pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Team;
