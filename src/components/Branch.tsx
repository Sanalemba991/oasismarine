"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Ram from "./Ram";
import Sam from "./Sam";
import RAms from "../app/assets/branch/oasisstar-275x300.jpg";
import Banner from  "../app/assets/banner/Our Branches.jpg";

interface HistoryMilestone {
  year: number;
  title: string;
  description: string;
  image?: string;
}

// Animation variants (unchanged from your original code)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 1, 1] },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 1, 1] },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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
      ease: "easeOut" as const,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Branch: React.FC = () => {
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const [bannerInView, setBannerInView] = React.useState(false);
  const timelineRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [activeItems, setActiveItems] = React.useState<boolean[]>([]);
  const router = useRouter();

  // useInView hook for sections
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [oasisRef, oasisInView] = useInView({
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

  return (
    <>
      {/* Banner Section - Updated with placeholder image */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="About Lovosis Technology"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
            src={Banner}
              alt="Lovosis Technology Banner"
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
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight"
              >
                Our <span className="text-blue-900 drop-shadow-lg">Branch</span>
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
                Empowering innovation, education, and digital transformation
                across all our branches.
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
            <span className="text-sm text-blue-200 mb-2 drop-shadow-md">
              Scroll down
            </span>
            <svg
              className="w-6 h-6 text-blue-200 drop-shadow-md"
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

      {/* Oasis Star Building Materials Section - Fixed with external image */}
      <motion.section
        ref={oasisRef}
        className="py-16 md:py-20 lg:py-24 "
        initial="hidden"
        animate={oasisInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              className="space-y-6 md:space-y-8"
              variants={itemVariants}
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl md:text-4xl sm:text-4xl  font-bold text-gray-900 leading-tight mb-6">
                  <span className="block text-2xl sm:text-3xl md:text-4xl mb-2">
                    OASIS STAR BUILDING
                  </span>
                  <span className="block text-2xl sm:text-3xl md:text-4xl mb-2">
                    MATERIALS TRADING LLC,
                  </span>
                  <span className=" block text-2xl sm:text-3xl md:text-4xl">
                    DEIRA, <span className="text-blue-900">DUBAI</span>
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                  Established in 2005, OASIS STAR BUILDING MATERIALS TRADING LLC
                  brings over 20 years of extensive experience in the UAE
                  market, specializing in the supply of high-quality building
                  materials. With a strong commitment to excellence, we ensure
                  that our products meet the highest standards of durability and
                  reliability, supporting construction and infrastructure
                  projects of all scales.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden "
              variants={imageVariants}
            >
              <Image
                src={RAms}
                alt="Oasis Star Building Materials"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Ram />
      <Sam />

    </>
  );
};

export default Branch;
