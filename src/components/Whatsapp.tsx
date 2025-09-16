'use client';
import React, { useState, useEffect, use } from 'react';
import { Phone, Mail, Plus, X } from 'lucide-react';

const Whatsapp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window size for responsive positioning
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate positions based on screen size
  const getTransform = (type: 'whatsapp' | 'phone' | 'email'): string => {
    if (!isOpen) return 'translate(0, 0) rotate(0deg)';
    
    if (type === 'whatsapp') {
      if (windowWidth >= 768) return 'translate(-85px, -60px) rotate(-360deg)';
      if (windowWidth >= 640) return 'translate(-70px, -50px) rotate(-360deg)';
      return 'translate(-60px, -40px) rotate(-360deg)';
    }
    
    if (type === 'phone') {
      if (windowWidth >= 768) return 'translate(-20px, -100px) rotate(-360deg)';
      if (windowWidth >= 640) return 'translate(-18px, -85px) rotate(-360deg)';
      return 'translate(-15px, -70px) rotate(-360deg)';
    }
    
    if (type === 'email') {
      if (windowWidth >= 768) return 'translate(-100px, 15px) rotate(-360deg)';
      if (windowWidth >= 640) return 'translate(-85px, 12px) rotate(-360deg)';
      return 'translate(-70px, 10px) rotate(-360deg)';
    }
    
    return 'translate(0, 0) rotate(0deg)';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsApp = () => {
    const phoneNumber = '+971563096262';
    const message = 'Hello Oasis Marine UAE! I would like to get in touch.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+971563096262', '_self');
  };

  const handleEmail = () => {
    const email = 'sales@oasismarineuae.com';
    const subject = 'Inquiry from Website';
    const body = 'Hello Oasis Marine UAE Team,\n\nI would like to get in touch regarding...';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_self');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] group">
      {/* Contact Options - Circular Layout */}
      <div className="relative flex items-center">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className={`absolute flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/whatsapp
            ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
          style={{
            transform: getTransform('whatsapp'),
            transition: 'all 0.35s cubic-bezier(.4,1.8,.5,1)',
            zIndex: 30
          }}
          title="WhatsApp Chat"
        >
          <svg width="18" height="18" className="sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.488"/>
          </svg>
          
          {/* WhatsApp Button Tooltip - positioned directly above the button */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/whatsapp:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <div className="bg-gray-800 text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 rounded-lg">
              Chat on WhatsApp
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          </div>
        </button>
    
        {/* Phone Button */}
        <button
          onClick={handleCall}
          className={`absolute flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/phone
            ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
          style={{
            transform: getTransform('phone'),
            transition: 'all 0.35s cubic-bezier(.4,1.8,.5,1) 0.05s',
            zIndex: 10
          }}
          title="Call Now"
        >
          <Phone size={16} className="sm:w-[18px] sm:h-[18px] md:w-[18px] md:h-[18px]" />
          
          {/* Phone Button Tooltip - positioned directly above the button */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/phone:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <div className="bg-gray-800 text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 rounded-lg">
              Call Us Now
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          </div>
        </button>
        
        {/* Mail Button */}
        <button
          onClick={handleEmail}
          className={`absolute flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 group/mail
            ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
          style={{
            transform: getTransform('email'),
            transition: 'all 0.35s cubic-bezier(.4,1.8,.5,1) 0.1s',
            zIndex: 30  // Increased zIndex to match WhatsApp button
          }}
          title="Send Email"
        >
          <Mail size={16} className="sm:w-[18px] sm:h-[18px] md:w-[18px] md:h-[18px] text-red-500 group-hover:text-red-600" />
          
          {/* Mail Button Tooltip - positioned directly above the button with higher z-index */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/mail:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="bg-gray-800 text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 rounded-lg">
              Send Email
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          </div>
        </button>
        
        {/* Main Toggle Button */}
        <button
          onClick={toggleMenu}
          className={`relative flex items-center justify-center w-12 h-12 sm:w-[52px] sm:h-[52px] md:w-14 md:h-14 rounded-full shadow-lg transition-all duration-500 hover:scale-105 ${
            isOpen 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          }`}
          title={isOpen ? 'Close Menu' : 'Contact Support'}
        >
          <div 
            className="transition-all duration-500"
            style={{
              transform: isOpen ? 'translateY(-2px) scale(0.95) rotate(40deg)' : 'translateY(0) scale(1) rotate(0deg)',
              transition: 'all 0.4s cubic-bezier(.4,1.8,.5,1)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6 md:w-7 md:h-7">
              <circle cx="12" cy="7" r="3" fill="currentColor"/>
              <path d="M12 14c-3.5 0-6.5 1.5-6.5 4v1h13v-1c0-2.5-3-4-6.5-4z" fill="currentColor"/>
              <path d="M8 6c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="6.5" y="5.5" width="2" height="3" rx="1" fill="currentColor"/>
              <rect x="15.5" y="5.5" width="2" height="3" rx="1" fill="currentColor"/>
              <path d="M9 10c0 1.66 1.34 3 3 3s3-1.34 3-3" stroke="currentColor" strokeWidth="1" fill="none"/>
              <line x1="12" y1="13" x2="12" y2="15" stroke="currentColor" strokeWidth="1"/>
              <circle cx="12" cy="15.5" r="0.5" fill="currentColor"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Tooltip when closed */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          <div className="bg-gray-800 text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 rounded-lg">
            Need Help? Contact Us!
            <div className="absolute top-full right-4 w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whatsapp;