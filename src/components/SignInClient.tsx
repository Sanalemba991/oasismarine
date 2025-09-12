'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function SignInClient() {
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
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
    >
      {isLoading ? (
        <AiOutlineLoading3Quarters className="w-5 h-5 text-slate-600 animate-spin" />
      ) : (
        <FaGoogle className="w-5 h-5 text-[#4285F4]" />
      )}
      <span className="group-hover:text-slate-800 transition-colors">
        {isLoading ? 'Authenticating...' : 'Continue with Google'}
      </span>
    </button>
  );
}