'use client';

import { useSession } from 'next-auth/react';

export default function OTHERSMARINEPRODUCTSPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">OTHERS MARINE PRODUCTS</h1>
            <p className="mt-2 text-gray-600">
              Welcome to the others marine products page
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              OTHERS MARINE PRODUCTS Content
            </h2>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              This page was automatically generated for the OTHERS MARINE PRODUCTS section. 
              You can customize this content by editing the page file.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Page path: <code className="bg-gray-100 px-2 py-1 rounded">/products/marine-products</code>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {session ? (
                  <>Logged in as: {session.user?.name || session.user?.email}</>
                ) : (
                  <>Welcome! Explore our products and services</>
                )}
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">About OTHERS MARINE PRODUCTS</h3>
              <p className="text-gray-600 text-sm">
                Add information about others marine products here. This section can be customized 
                to show relevant content for your visitors.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Responsive design</li>
                <li>• SEO optimized</li>
                <li>• User authentication ready</li>
                <li>• Easy to customize</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-gray-600 text-sm">
                Edit this page to add your own content, images, and functionality 
                specific to others marine products.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
