// app/profile/ProfileClient.tsx
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaCalendarAlt, FaSignOutAlt, FaBuilding, FaShieldAlt } from 'react-icons/fa';
import { MdVerified, MdBusiness } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiOfficeBuilding } from 'react-icons/hi';
import { Session } from 'next-auth';

interface ProfileClientProps {
  session: Session | null;
}

export default function ProfileClient({ session: initialSession }: ProfileClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Use the server session if available, otherwise use client session
  const currentSession = initialSession || session;

  // Redirect to signin if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated' && !initialSession) {
      router.push('/auth/signin');
    }
  }, [status, router, initialSession]);

  if ((status === 'loading' && !initialSession) || (!currentSession && status !== 'unauthenticated')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center w-full max-w-xs">
          <AiOutlineLoading3Quarters className="text-2xl sm:text-3xl text-slate-600 animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-600 text-base sm:text-lg font-medium">Loading Profile</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return null;
  }

  const handleSignOut = async () => {
    // You'll need to implement a signOut function that works with your auth setup
    // This is just a placeholder
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-7 from-slate-50 to-slate-100">
      {/* Professional Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <HiOfficeBuilding className="text-xl sm:text-2xl text-slate-700" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Oasis Marine Trading LLC</h1>
          </div>
          <p className="text-slate-600 text-sm ml-8 sm:ml-10">Professional Account Management</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Professional Header */}
              <div className="bg-slate-800 px-6 sm:px-8 py-8 sm:py-12 text-center relative">
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                  <div className="bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <MdVerified className="text-xs" />
                    Verified
                  </div>
                </div>
                
                <div className="relative inline-block mb-4">
                  {currentSession.user?.image ? (
                    <Image
                      src={currentSession.user.image}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                      unoptimized={process.env.NODE_ENV === 'development'}
                      onError={(e) => {
                        console.error('Image load error:', e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Professional Fallback Avatar */}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg bg-slate-600 flex items-center justify-center mx-auto ${currentSession.user?.image ? 'hidden' : ''}`}>
                    <FaUser className="text-xl text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white">
                    <FaShieldAlt className="text-white text-xs" />
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {currentSession.user?.name || 'Professional User'}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm">Account Holder</p>
              </div>

              {/* Account Information */}
              <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <MdBusiness className="text-slate-600" />
                  Account Information
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="bg-slate-100 p-2 rounded-lg flex-shrink-0">
                      <FaEnvelope className="text-slate-600 text-xs sm:text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base truncate">{currentSession.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="bg-slate-100 p-2 rounded-lg flex-shrink-0">
                      <FaCalendarAlt className="text-slate-600 text-xs sm:text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Account Created</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="bg-slate-100 p-2 rounded-lg flex-shrink-0">
                      <FaBuilding className="text-slate-600 text-xs sm:text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Organization</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">Oasis Marine Trading LLC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4 sm:mb-6">Account Actions</h3>
              
              {/* Account Status */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-700">Active Account</span>
                </div>
                <p className="text-xs text-emerald-600">All systems operational</p>
              </div>

              {/* Security Info */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <FaShieldAlt className="text-slate-600 text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Security</span>
                </div>
                <p className="text-xs text-slate-600">Account verification complete</p>
              </div>

              {/* Professional Sign Out Button */}
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm"
              >
                <FaSignOutAlt className="text-xs sm:text-sm" />
                Sign Out
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-2 sm:mt-3">
                Secure session management
              </p>
            </div>

            {/* Company Info Card */}
            <div className="mt-4 sm:mt-6 bg-slate-800 text-white rounded-xl shadow-sm p-4 sm:p-6">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                <HiOfficeBuilding className="text-xs sm:text-sm" />
                Company Portal
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-3 sm:mb-4">
                Access to professional trading services and maritime solutions.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Professional Dashboard</p>
                <p>Secure Environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}