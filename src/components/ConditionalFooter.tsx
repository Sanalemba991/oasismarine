"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  // Hide footer on admin pages
  const hideFooter =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  if (hideFooter) return null;
  return <Footer />;
}
