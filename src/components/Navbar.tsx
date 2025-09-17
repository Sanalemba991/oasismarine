"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const useNavbarStyles = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
     .navbar-fade-in {
  animation: navbar-fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.navbar-slide-up {
  animation: navbar-slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.navbar-scale-in {
  animation: navbar-scale-in 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes navbar-fade-in {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes navbar-slide-up {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes navbar-scale-in {
  0% { opacity: 0; transform: scale(0.96); }
  100% { opacity: 1; transform: scale(1); }
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-link-enhanced {
  position: relative;
  overflow: hidden;
  padding: 12px 24px !important;
  margin: 0 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-link-enhanced::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #1e3a8a, #1e40af);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateX(-50%);
  border-radius: 2px 2px 0 0;
}

.nav-link-enhanced:hover::after {
  width: 80%;
}

.nav-link-enhanced.active::after {
  width: 90%;
  animation: pulse-underline 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.nav-link-enhanced.transparent::after {
  background: linear-gradient(90deg, #1e3a8a, #1e40af);
  box-shadow: 0 0 8px rgba(30, 58, 138, 0.4);
}

.nav-link-enhanced.transparent:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
}

.nav-link-enhanced.scrolled:hover {
  background: rgba(107, 114, 128, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.1);
}

@keyframes pulse-underline {
  0%, 100% { 
    opacity: 1;
    transform: translateX(-50%) scaleX(1);
  }
  50% { 
    opacity: 0.7;
    transform: translateX(-50%) scaleX(0.95);
  }
}

.mobile-menu-backdrop {
  background: rgba(255, 255, 255, 0.1);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.98);
}

.mobile-nav-enhanced:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}

.logo-transition {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.logo-color-invert {
  filter: invert(1) brightness(0) saturate(100%);
}

.logo-color-dark {
  filter: brightness(0) saturate(100%);
}

.logo-fade-transition {
  transition: opacity 0.3s ease-in-out;
}

.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.25rem;
  min-width: 12rem;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.dropdown-menu::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.dropdown-menu {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  overflow-y: auto;
  max-height: calc(100vh - 80px); /* Adjust height as needed */
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu.hide {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
}

.auth-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.auth-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.auth-button:hover::before {
  left: 100%;
}

    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};

interface Category {
  id: string;
  name: string;
  href: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  href: string;
  image?: string;
  description?: string;
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true); // Always true now
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Add initialization state
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useNavbarStyles();

  // Initialize component - prevent automatic dropdown opening
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Fetch categories and extract all subcategories for products dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("/api/admin/navbar");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const toggleMobileMenu = () => {
    const next = !isMobileMenuOpen;
    setIsMobileMenuOpen(next);
  };

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setOpenDropdown(null);
  };

  const navItems = [
    { href: "/", label: "Home" },
    {
      href: "/products",
      label: "Products",
      hasDropdown: true,
      categories: categories,
    },
    { href: "/branch", label: "Our Branches" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 glass-effect shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand with Enhanced Transitions */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center group transition-all duration-300 ease-out"
              >
                <Image
                  src="/logo.png"
                  alt="Oasis Marine"
                  width={900}
                  height={200}
                  className={`h-10 w-auto logo-transition group-hover:scale-105 ${
                    isScrolled ? "" : "brightness-0 invert"
                  }`}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-4"> {/* Changed from space-x-6 to space-x-4 */}
                {navItems.map((item) =>
                  item.hasDropdown ? (
                    <ProductsDropdown
                      key={item.href}
                      label={item.label}
                      categories={categories}
                      isActive={
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href))
                      }
                      isScrolled={isScrolled}
                      openDropdown={openDropdown}
                      setOpenDropdown={setOpenDropdown}
                      loading={loadingCategories}
                      isInitialized={isInitialized} // Pass initialization state
                    />
                  ) : (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      isActive={
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href))
                      }
                      isScrolled={isScrolled}
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Contact Actions */}
              <ContactAction
                href="mailto:sales@oasismarineuae.com"
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                tooltip="sales@oasismarineuae.com"
                isScrolled={isScrolled}
              />
              <ContactAction
                href="tel:+971563096262"
                icon={<Phone className="w-4 h-4" />}
                label="Call"
                tooltip="+971563096262"
                isScrolled={isScrolled}
              />
              <ContactAction
                href="https://www.google.com/maps/place/Oasis+Marine+Trading+LLC/@25.286978,55.383382,6z/data=!4m6!3m5!1s0x3e5f5de30e5a6283:0x14805290c4c15df6!8m2!3d25.286978!4d55.3833818!16s%2Fg%2F11vlm3tdjq?hl=en&entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D"
                icon={<MapPin className="w-4 h-4" />}
                label="Location"
                tooltip="Olaya Street, Riyadh"
                isScrolled={isScrolled}
                external
              />

              {/* Authentication Section */}
              <div className="flex items-center space-x-4 ml-4 border-l border-gray-300/30 pl-4">
                {status === "loading" ? (
                  <div
                    className={`text-sm ${
                      isScrolled ? "text-gray-500" : "text-white/70"
                    }`}
                  >
                    Loading...
                  </div>
                ) : session ? (
                  /* Authenticated User */
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => toggleDropdown("profile")}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                        isScrolled
                          ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60"
                          : "text-white hover:text-gray-200 hover:bg-white/20"
                      }`}
                    >
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={150}
                          height={150}
                          className="w-10 h-10 rounded-full border-2 border-current/30 object-cover"
                          unoptimized={process.env.NODE_ENV === "development"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ${
                          session.user?.image ? "hidden" : ""
                        }`}
                      >
                        <User className="text-black text-sm" />
                      </div>
                      
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    <div
                      className={`dropdown-menu ${
                        openDropdown === "profile" ? "show" : "hide"
                      }`}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        <User className="h-4 w-4" />
                        View Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Unauthenticated User */
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/auth/signin"
                      className={`auth-button border-2 py-2 px-4 font-medium transition-colors duration-300 flex items-center justify-center text-sm  ${
                        isScrolled
                          ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                          : "border-white text-white hover:bg-white hover:text-blue-600"
                      }`}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                type="button"
                className={`relative inline-flex items-center justify-center p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2 transition-all duration-200 ease-out ${
                  isScrolled
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                    : "text-white hover:text-gray-200 hover:bg-white/20"
                }`}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-200" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 lg:hidden mobile-menu-backdrop"
              onClick={toggleMobileMenu}
            />

            {/* Menu Panel */}
            <div className="absolute top-full left-0 right-0 lg:hidden navbar-slide-up">
              <div className="glass-effect border-t border-gray-200/20 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  {/* Navigation Items */}
                  <div className="space-y-1 mb-6">
                    {navItems.map((item, index) => (
                      <MobileNavLink
                        key={item.href}
                        href={item.href}
                        onClick={toggleMobileMenu}
                        isActive={
                          pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href))
                        }
                        delay={index * 50}
                      >
                        {item.label}
                      </MobileNavLink>
                    ))}
                  </div>

                  {/* Authentication Section - Mobile */}
                  <div className="mt-2 pt-4 border-t border-gray-200 mb-6">
                    {status === "loading" ? (
                      <div className="px-3 py-2 text-gray-500">Loading...</div>
                    ) : session ? (
                      /* Authenticated User - Mobile */
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 px-3 py-2">
                          {session.user?.image ? (
                            <Image
                              src={session.user.image}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 object-cover"
                              unoptimized={
                                process.env.NODE_ENV === "development"
                              }
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ${
                              session.user?.image ? "hidden" : ""
                            }`}
                          >
                            <User className="text-white text-sm" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {session.user?.name || "User"}
                          </span>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50/60 rounded-md transition-all duration-300"
                          onClick={toggleMobileMenu}
                        >
                          <User className="h-4 w-4" />
                          View Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-6 py-2 text-red-600 hover:text-red-700 hover:bg-red-50/60 rounded-md transition-all duration-300"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      /* Unauthenticated User - Mobile */
                      <div className="px-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                          Account
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white/70 p-3 shadow-sm">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 leading-tight">You&apos;re not signed in</p>
                              <p className="text-xs text-gray-500 leading-tight">Access your profile and manage orders</p>
                            </div>
                          </div>
                          <div className="flex">
                            <Link
                              href="/auth/signin"
                              className="w-full inline-flex items-center justify-center h-9 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
                              onClick={toggleMobileMenu}
                              aria-label="Sign in"
                            >
                              Sign In
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Info - icons only, horizontal */}
                  <div className="border-t border-gray-200/30 pt-4">
                    <div className="flex items-center justify-start gap-3">
                      <Link
                        href="mailto:sales@oasismarineuae.com"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-blue-600 ring-1 ring-gray-200 hover:bg-gray-50"
                        onClick={toggleMobileMenu}
                        title="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </Link>
                      <Link
                        href="tel:+971563096262"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-blue-600 ring-1 ring-gray-200 hover:bg-gray-50"
                        onClick={toggleMobileMenu}
                        title="Call"
                      >
                        <Phone className="w-5 h-5" />
                      </Link>
                      <Link
                        href="https://www.google.com/maps/place/Oasis+Marine+Trading+LLC/@25.286978,55.383382,6z/data=!4m6!3m5!1s0x3e5f5de30e5a6283:0x14805290c4c15df6!8m2!3d25.286978!4d55.3833818!16s%2Fg%2F11vlm3tdjq?hl=en&entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-blue-600 ring-1 ring-gray-200 hover:bg-gray-50"
                        onClick={toggleMobileMenu}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Location"
                      >
                        <MapPin className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}

// NavLink component
function NavLink({
  href,
  children,
  isActive,
  isScrolled,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  isScrolled: boolean;
}) {
  return (
    <Link
      href={href}
      className={`nav-link-enhanced text-sm font-medium transition-all duration-300 ease-out ${
        !isScrolled ? "transparent" : "scrolled"
      } ${isActive ? "active" : ""} ${
        isScrolled
          ? `${
              isActive ? "text-gray-600" : "text-gray-700 hover:text-gray-900"
            }`
          : `${isActive ? "text-gray-300" : "text-white hover:text-gray-200"}`
      }`}
    >
      {children}
    </Link>
  );
}

// ContactAction component
function ContactAction({
  href,
  icon,
  label,
  tooltip,
  isScrolled,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  isScrolled: boolean;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-gray-500/20 transform hover:scale-105 ${
        isScrolled
          ? "text-gray-600 hover:text-gray-600 hover:bg-gray-50 hover:shadow-md"
          : "text-white hover:text-gray-200 hover:bg-white/20 hover:shadow-md"
      }`}
      title={tooltip}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      <span className="sr-only">{label}</span>

      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
          isScrolled
            ? "bg-gradient-to-br from-gray-400/10 to-gray-600/10"
            : "bg-gradient-to-br from-white/10 to-gray-200/10"
        }`}
      ></div>
    </Link>
  );
}

// MobileNavLink component
function MobileNavLink({
  href,
  children,
  onClick,
  isActive,
  delay = 0,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  delay?: number;
}) {
  return (
    <Link
      href={href}
      className={`mobile-nav-enhanced navbar-scale-in flex items-center px-4 py-3 text-base font-medium transition-all duration-300 ease-out ${
        isActive
          ? "text-gray-600 bg-gray-50/60 border border-gray-200/50 shadow-sm"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/60"
      }`}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
      )}
    </Link>
  );
}

// ProductsDropdown component - Fixed to prevent auto-opening
function ProductsDropdown({
  label,
  categories,
  isActive,
  isScrolled,
  openDropdown,
  setOpenDropdown,
  loading,
  isInitialized,
}: {
  label: string;
  categories: Category[];
  isActive: boolean;
  isScrolled: boolean;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  loading: boolean;
  isInitialized: boolean;
}) {
  const dropdownId = "products";
  const isOpen = openDropdown === dropdownId;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    // Only allow dropdown to open after component is fully initialized
    if (isInitialized) {
      setOpenDropdown(dropdownId);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Check if relatedTarget exists and is an Element
    const relatedTarget = e.relatedTarget as Element | null;
    
    if (
      dropdownRef.current &&
      relatedTarget && // Check if relatedTarget exists
      !dropdownRef.current.contains(relatedTarget)
    ) {
      setOpenDropdown(null);
    }
  };

  const handleClick = () => {
    // Handle click for mobile/touch devices
    if (isInitialized) {
      setOpenDropdown(isOpen ? null : dropdownId);
    }
  };

  return (
    <div
      className="relative dropdown-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <button
        onClick={handleClick}
        className={`nav-link-enhanced text-sm font-medium transition-all duration-300 ease-out flex items-center ${
          !isScrolled ? "transparent" : "scrolled"
        } ${isActive ? "active" : ""} ${
          isScrolled
            ? `${
                isActive ? "text-gray-600" : "text-gray-700 hover:text-gray-900"
              }`
            : `${isActive ? "text-gray-300" : "text-white hover:text-gray-200"}`
        }`}
      >
        {label}
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mega Menu Dropdown - Only show if initialized and open */}
      {isInitialized && (
        <div
          className={`dropdown-menu ${isOpen ? "show" : "hide"}`}
          style={{
            position: "fixed",
            top: "64px",
            left: "50%",
            transform: "translateX(-50%)",
            right: "auto",
            minWidth: "90vw",
            maxWidth: "1200px",
            width: "auto",
            zIndex: 60,
          }}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h2 className="text-xl text-semibold  text-gray-700">
                Our Products
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-3 text-lg text-gray-600">Loading...</span>
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-4">
                {/* Horizontal layout for all subcategories */}
                <div className="space-y-3">
                  <h3 className="text-semibold  text-gray-700 ">
                    All Product Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {categories.flatMap((category) =>
                      category.subcategories?.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={subcategory.href}
                          className="block p-2 text-center text-xs font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded border border-gray-100 hover:border-blue-200 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {subcategory.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Available
                </h3>
                <p className="text-gray-500">
                  Check back later for our latest products
                </p>
              </div>
            )}

            {/* Single View All Products button */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2 border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                onClick={() => setOpenDropdown(null)}
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}