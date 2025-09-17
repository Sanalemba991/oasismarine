import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  return response;
}

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If accessing the profile page, require authentication
        if (req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }
        // For all other pages, allow access
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*',
    '/api/:path*',
    // Add other protected routes here if needed
  ]
}