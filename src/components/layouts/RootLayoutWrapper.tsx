"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../Navbar';
import Footer from '../Footer';
import FloatingContactButton from '../Whatsapp';

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbarFooter = !pathname.startsWith('/admin') && !pathname.startsWith('/auth');

  return (
    <>
      {showNavbarFooter && <Navbar />}
      <FloatingContactButton />
      {children}
      {showNavbarFooter && <Footer />}
    </>
  );
} 