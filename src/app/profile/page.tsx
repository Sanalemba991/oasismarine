'use client'

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to signin if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6D688A] via-[#FFB3BA] to-[#FFDFBA] flex items-center justify-center">
        <div className="text-center">
          <AiOutlineLoading3Quarters className="text-4xl text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Debug: Log the session data
  console.log('Session data:', session);
  console.log('User image URL:', session.user?.image);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6D688A] via-[#FFB3BA] to-[#FFDFBA] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-white/80">Welcome to Oasis Marine Trading LLC</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {/* Cover Section */}
          <div className="bg-gradient-to-r from-[#6D688A] to-[#FFB3BA] h-32 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    unoptimized={process.env.NODE_ENV === 'development'}
                    onError={(e) => {
                      console.error('Image load error:', e);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                {/* Fallback avatar */}
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-[#6D688A] to-[#FFB3BA] flex items-center justify-center ${session.user?.image ? 'hidden' : ''}`}>
                  <FaUser className="text-4xl text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                  <MdVerified className="text-white text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {session.user?.name || 'User'}
              </h2>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <MdVerified className="text-green-500" />
                Verified Account
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-[#6D688A] text-lg" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{session.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-[#6D688A] text-lg" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-800">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="mt-8 text-center">
              <button 
                onClick={handleSignOut}
                className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 border-2 border-red-200 hover:border-red-400 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
