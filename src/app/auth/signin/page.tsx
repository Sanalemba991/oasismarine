import React from 'react';
import Link from 'next/link';
import { FaShieldAlt } from 'react-icons/fa';
import { MdSupport, MdBusiness, MdSecurity } from 'react-icons/md';
import type { Metadata } from 'next';
import SignInClient from "../../../components/SignInClient"

export const metadata: Metadata = {
  title: 'Sign In | Oasis Marine Trading LLC',
  description:
    'Access your Oasis Marine Trading LLC account by signing in securely. Manage your profile, explore services, and stay connected with our latest updates.',
  keywords:
    'Oasis Marine sign in, login, account access, customer portal, marine trading UAE, industrial solutions login',
  openGraph: {
    title: 'Sign In | Oasis Marine Trading LLC',
    description:
      'Access your Oasis Marine Trading LLC account by signing in securely. Manage your profile, explore services, and stay connected with our latest updates.',
    type: 'website',
    url: 'https://oasismarineuae.com/signin',
  },
  robots: {
    index: false, // usually login/sign-in pages are not indexed
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Subtle Professional Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-200 via-transparent to-transparent opacity-30"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Professional Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12">
              <img src="/logo1.png" alt="Oasis Marine Logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-slate-800">Oasis Marine Trading LLC</h1>
              <p className="text-sm text-slate-600">Professional Portal</p>
            </div>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-slate-800 px-8 py-6">
            <h2 className="text-xl font-semibold text-white mb-1">Account Access</h2>
            <p className="text-slate-300 text-sm">Sign in to your professional dashboard</p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Client Component for Sign In Button */}
            <SignInClient />

            {/* Professional Features */}
            <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MdBusiness className="text-slate-600" />
                <h3 className="font-semibold text-slate-800">Professional Access</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Secure enterprise authentication</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Access to trading dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Professional account management</span>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
                <MdSupport className="text-sm" />
                <span className="text-xs">Need assistance?</span>
              </div>
              <Link
                href="/contact"
                className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                Contact Support Team
              </Link>
            </div>

            {/* Account Registration */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600 text-sm">
                New to the platform?{' '}
                <Link
                  href="/auth/signup"
                  className="text-slate-800 hover:text-slate-900 font-medium transition-colors"
                >
                  Request Account Access
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-emerald-600 text-sm" />
              <span className="text-xs font-medium text-slate-700">Enterprise Security</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <MdSecurity className="text-slate-600 text-sm" />
              <span className="text-xs text-slate-600">OAuth 2.0</span>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        
      </div>
    </div>
  );
}