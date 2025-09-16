"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faThreads,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(
          "Thank you! You have been successfully subscribed to our newsletter."
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
      setMessage("Failed to subscribe");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <footer
      className="text-white relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/footer.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Darker overlay for better text readability */}
      <div className="absolute inset-0  bg-opacity-85"></div>

      {/* Content with relative positioning to stay above overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Newsletter - Smaller */}


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {/* Brand Section - Larger logo */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center group transition-all duration-500 ease-in-out"
              >
                <Image
                  src="/logo1.png"
                  alt="Company Logo"
                  width={200}
                  height={200}
                  className="h-14 w-auto transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                  priority
                />
              </Link>
            </div>
            <p className="text-xs text-gray-300">
              Transforming ideas into digital reality with innovative solutions.
            </p>
            <div className="flex justify-center sm:justify-start space-x-2">
              <a
                href=""
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-4 w-4" />
              </a>
              <a
                href=""
                className="text-gray-300 hover:text-pink-500 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              </a>

              <a
                href="https://www.linkedin.com/company/oasis-marine-trading-llc/?originalSubdomain=ae"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* About Section - Added as requested */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-medium text-white mb-2">About Us</h3>
            <p className="text-xs text-gray-300">
              Since 2023, Oasis Marine Trading LLC specializes in marine and oil
              field supply. Since our inception, we have been dedicated to
              delivering exceptional service and solutions to meet the unique
              needs of our clients in these demanding industries.
            </p>
          </div>

          {/* Information - Updated with requested links */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-medium text-white mb-2">Information</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Smaller */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-medium text-white mb-2">Contact Us</h3>
            <ul className="space-y-3 text-xs text-gray-300">
              {/* Location with clickable map icon - Responsive text */}
              <li className="text-center sm:text-left">
                <button
                  onClick={() => {
                    const googleMapsUrl = `https://www.google.com/maps/place/Oasis+Marine+Trading+LLC/@25.286978,55.383382,6z/data=!4m6!3m5!1s0x3e5f5de30e5a6283:0x14805290c4c15df6!8m2!3d25.286978!4d55.3833818!16s%2Fg%2F11vlm3tdjq?hl=en&entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D`;
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="inline-flex items-start gap-2 hover:text-blue-400 transition-colors duration-300 group text-left"
                >
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs hover:text-blue-400 group-hover:no-underline cursor-pointer leading-relaxed">
                    <span className="block sm:inline">
                      5 - Street 2 11th St
                    </span>
                    <span className="block sm:inline sm:ml-1">
                      - Al Qusais - Dubai
                    </span>

                    <span className="block sm:inline sm:ml-1">
                      - United Arab Emirates
                    </span>
                  </span>
                </button>
              </li>

              {/* Email */}
              <li className="text-center sm:text-left">
                <a
                  href="mailto:sales@oasismarineuae.com"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs hover:text-blue-400 group-hover:no-underline cursor-pointer">
                    sales@oasismarineuae.com
                  </span>
                </a>
              </li>

              {/* Phone */}
              <li className="text-center sm:text-left">
                <a
                  href="tel:+971563096262"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs hover:text-blue-400 group-hover:no-underline cursor-pointer">
                    +971563096262
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar - Smaller */}
        <div className="border-t border-gray-600 mt-4 sm:mt-6 pt-3 sm:pt-4">
          <div className="text-center text-xs text-gray-300 space-y-2">
            <p>&copy; {currentYear} Oasis Marine. All rights reserved.</p>
            <p>
              <a
                href="/privacy-policy"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
