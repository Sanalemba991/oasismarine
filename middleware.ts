import { withAuth } from 'next-auth/middleware'

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
    // Add other protected routes here if needed
  ]
}