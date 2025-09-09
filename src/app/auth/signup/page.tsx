'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaCheckCircle, FaShieldAlt, FaAnchor } from 'react-icons/fa';
import { MdSupport, MdSettings } from 'react-icons/md';
import Image from 'next/image';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiSupport } from 'react-icons/bi';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
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
      console.error('Sign up error:', error);
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
            <h1 className="text-3xl font-bold text-[#6D688A] mb-2">Join Oasis Marine Trading</h1>
            <p className="text-[#6D688A]/70">Create your account to get started</p>
          </div>

          {/* Google Sign Up Button */}
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-[#6D688A]/20 rounded-lg hover:border-[#FFB3BA]/50 hover:bg-[#FFDFBA]/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="w-5 h-5 text-[#FFB3BA] animate-spin" />
              ) : (
                <FaGoogle className="w-5 h-5 text-[#4285F4]" />
              )}
              <span className="text-[#6D688A] font-medium group-hover:text-[#FFB3BA] transition-colors">
                {isLoading ? 'Creating account...' : 'Continue with Google'}
              </span>
            </button>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-[#FFDFBA]/30 to-[#FFB3BA]/20 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-semibold text-[#6D688A] mb-2 flex items-center space-x-2">
                <FaShieldAlt className="w-4 h-4" />
                <span>What you'll get:</span>
              </h3>
              <ul className="space-y-1 text-sm text-[#6D688A]/80">
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="w-3 h-3 text-[#FFB3BA]" />
                  <span>Access to premium LED products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <BiSupport className="w-3 h-3 text-[#FFB3BA]" />
                  <span>Professional technical support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MdSettings className="w-3 h-3 text-[#FFB3BA]" />
                  <span>Custom solution consultations</span>
                </li>
              </ul>
            </div>

            {/* Terms and Privacy */}
            <p className="text-xs text-[#6D688A]/60 text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#FFB3BA] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#FFB3BA] hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-[#FFDFBA]/50">
              <p className="text-[#6D688A]/70">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-[#FFB3BA] hover:text-[#6D688A] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}