"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useRef, useEffect } from "react";

interface StatCardProps {
  number: number;
  label: string;
  index: number;
}

const StatCard = ({ number, label, index }: StatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, number, {
        duration: 2,
        delay: index * 0.2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, number, index]);

  return (
    <motion.div
      ref={ref}
      className="text-center text-white drop-shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="text-4xl lg:text-5xl font-bold mb-1 text-shadow-lg"
        initial={{ scale: 0.8 }}
        animate={isInView ? { scale: 1 } : { scale: 0.8 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15 + 0.2,
          ease: "backOut",
        }}
        style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
      >
        +<motion.span>{rounded}</motion.span>
      </motion.div>
      <div
        className="text-lg lg:text-xl font-medium"
        style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)" }}
      >
        {label}
      </div>
    </motion.div>
  );
};

export default function MarineEquipmentPage() {
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true });

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Stats Section */}
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden flex items-center justify-center">
            {/* Background Image - Full opacity */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/ban.png')`,
              }}
            />

            {/* Stats Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-8 p-4">
              <StatCard number={200} label="Products" index={0} />
              <StatCard number={3} label="Years Experience" index={1} />
              <StatCard number={150} label="Clients" index={2} />
              <StatCard number={10} label="Employees" index={3} />
            </div>
          </div>

          {/* Right Side - Content */}
          <motion.div
            ref={contentRef}
            className="p-6 lg:p-8 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={
              isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="text-3xl lg:text-4xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={
                isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Trusted Marine & Oilfield{" "}
              <span className="text-[#1e3a8a]">Equipment Supplier</span> in UAE
            </motion.h1>

            <motion.div
              className="space-y-4 text-[#555555]"
              initial={{ opacity: 0 }}
              animate={isContentInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <p>
                We specialize in delivering high-quality marine and oilfield
                equipment across the UAE and Middle East, providing innovative
                and reliable products.
              </p>

              <p>
                Our offerings include valves, Mild Steel, Galvanized Iron,
                Stainless Steel, fittings, flanges, gasket sheets, rubber
                sheets, and Straub pipe repair solutions.
              </p>

              <p>
                Serving both marine and oil field industries, we prioritize
                performance, durability, and safety in all our solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="pt-4"
            ></motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
