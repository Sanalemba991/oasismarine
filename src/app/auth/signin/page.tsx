'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaLock, FaCheckCircle } from 'react-icons/fa';
import { MdSupport } from 'react-icons/md';
import Image from 'next/image';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: '/profile',
        redirect: false,
      });
      
      if (result?.ok) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFBA]/30 via-[#FFDFBA]/50 to-[#FFB3BA]/30 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFB3BA]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6D688A]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#FFDFBA]/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#FFDFBA]/50 p-8">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#6D688A] to-[#FFB3BA] rounded-2xl mb-4 shadow-lg p-2">
              <Image
                src="/logo.png"
                alt="Oasis Marine Trading LLC"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#6D688A] mb-2">Welcome Back</h1>
            <p className="text-[#6D688A]/70">Sign in to your Oasis Marine Trading account</p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-[#6D688A]/20 rounded-lg hover:border-[#FFB3BA]/50 hover:bg-[#FFDFBA]/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="w-5 h-5 text-[#FFB3BA] animate-spin" />
              ) : (
                <FaGoogle className="w-5 h-5 text-[#4285F4]" />
              )}
              <span className="text-[#6D688A] font-medium group-hover:text-[#FFB3BA] transition-colors">
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            {/* Quick Access Info */}
            <div className="bg-gradient-to-r from-[#FFDFBA]/30 to-[#FFB3BA]/20 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-semibold text-[#6D688A] mb-2">Quick & Secure Access</h3>
              <ul className="space-y-1 text-sm text-[#6D688A]/80">
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="w-3 h-3 text-[#FFB3BA]" />
                  <span>One-click sign in with Google</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="w-3 h-3 text-[#FFB3BA]" />
                  <span>Secure & encrypted connection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="w-3 h-3 text-[#FFB3BA]" />
                  <span>Access to your dashboard</span>
                </li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="text-center">
              <p className="text-xs text-[#6D688A]/60 mb-2 flex items-center justify-center space-x-1">
                <MdSupport className="w-3 h-3" />
                <span>Having trouble signing in?</span>
              </p>
              <Link
                href="/support"
                className="text-[#FFB3BA] hover:text-[#6D688A] text-sm font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-[#FFDFBA]/50">
              <p className="text-[#6D688A]/70">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-[#FFB3BA] hover:text-[#6D688A] font-medium transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-[#FFDFBA]/50">
            <FaLock className="w-4 h-4 text-[#6D688A]" />
            <span className="text-xs text-[#6D688A]/70 font-medium">
              Secured by Google OAuth
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}