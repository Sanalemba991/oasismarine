import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MarineSupplyPage = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observers: { [key: string]: IntersectionObserver } = {};

    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.2 }
        );
        observers[key].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  const setSectionRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Hero Section */}
      <section className="text-black text-center">
        <motion.h1 
          className="mt-5 text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Your Trusted Partner in{" "}
        <span className="text-[#1e3a8a]">
            Marine and Oilfield Supply
          </span>
        </motion.h1>
      </section>

      {/* Main Content Section */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content - Comes from left */}
            <motion.div
              ref={setSectionRef("content")}
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.content ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Company Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.content ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              >
                <p className="text-base text-slate-600 leading-relaxed">
                  At{" "}
                  <span className="font-bold text-gray-700">
                    Oasis Marine Trading LLC
                  </span>
                  , we offer specialized support services and deliver
                  top-quality{" "}
                  <span className="font-semibold text-slate-800">
                    marine and oilfield equipment
                  </span>{" "}
                  to a range of industries, including{" "}
                  <span className="font-semibold text-gray-600">upstream</span>{" "}
                  and{" "}
                  <span className="font-semibold text-gray-600">
                    downstream
                  </span>{" "}
                  <span className="font-semibold text-slate-800">
                    oil & gas, refining, petrochemical, marine, power, pipeline,
                    desalination, water
                  </span>
                  , and{" "}
                  <span className="font-semibold text-gray-600">
                    utility sectors
                  </span>{" "}
                  across the globe.
                </p>
                <p className="text-base text-slate-600 leading-relaxed mt-4">
                  Our commitment to excellence ensures reliable solutions that
                  meet the{" "}
                  <span className="font-bold text-gray-700">
                    highest industry standards
                  </span>
                  , providing both quality and safety in every product and
                  service we deliver.
                </p>
              </motion.div>
            </motion.div>

            {/* Image - Comes from right */}
            <motion.div
              ref={setSectionRef("image")}
              className="flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.image ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <div className="max-w-lg">
                <img
                  src="/marine.png"
                  alt="Marine and Oilfield Equipment"
                  className="w-full h-auto object-contain shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarineSupplyPage;