'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { 
  MdDashboard, 
  MdPeople, 
  MdMenu, 
  MdClose, 
  MdLogout,
  MdBarChart,
  MdInventory,
  MdContacts,
  MdNavigation
} from 'react-icons/md';
import { FaAnchor } from 'react-icons/fa';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: MdDashboard },
  { name: 'Users', href: '/admin/users', icon: MdPeople },
  { name: 'Navbar', href: '/admin/navbar', icon: MdNavigation },
  { name: 'Products', href: '/admin/products', icon: MdInventory },
  { name: 'Product Enquiry', href: '/admin/contacts', icon: MdContacts },
  { name: 'Conatcts Details', href: '/admin/conatcts-details', icon: FaAnchor },
  { name: 'Stats', href: '/admin/stats', icon: MdBarChart }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check admin session
    const adminSession = Cookies.get('adminSession');
    const adminUsername = Cookies.get('adminUser');
    
    if (!adminSession) {
      router.push('/admin');
      return;
    }
    
    setAdminUser(adminUsername || 'Admin');
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('adminSession');
    Cookies.remove('adminUser');
    
    toast.success('Logged out successfully!', {
      position: "top-right",
      autoClose: 2000,
    });

    setTimeout(() => {
      router.push('/admin');
    }, 2000);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Oasis Marine Trading LLC"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 bg-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {adminUser.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">Welcome back!</p>
              <p className="text-gray-300 text-sm">{adminUser}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
          >
            <MdLogout className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <MdMenu className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as: <strong>{adminUser}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
