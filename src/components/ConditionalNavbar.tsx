'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Only hide navbar on admin and auth pages, but show it on profile
  const hideNavbar = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');
  
  if (hideNavbar) return null;
  
  return <Navbar />;
}
