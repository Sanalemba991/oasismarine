# Oasis Marine Trading LLC - Next.js Authentication App

A modern Next.js application with Google OAuth authentication, MongoDB database, and beautiful UI components.

## Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google
- 🗄️ **MongoDB Database** - User data stored in MongoDB
- 🎨 **Beautiful UI** - Custom color palette with gradient designs
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Protected Routes** - Profile pages require authentication
- ⚡ **Next.js 15** - Latest Next.js with App Router

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, React Icons
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Prisma ORM
- **Deployment**: Ready for Vercel

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database - MongoDB
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your `.env` file

### 3. MongoDB Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/)
2. Create a new cluster
3. Get your connection string
4. Replace the `DATABASE_URL` in your `.env` file

### 4. Install Dependencies

```bash
npm install
```

### 5. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx     # Sign-in page
│   │   └── signup/page.tsx     # Sign-up page
│   ├── profile/page.tsx        # User profile page
│   ├── api/auth/[...nextauth]/ # NextAuth API routes
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── Navbar.tsx              # Navigation component
│   ├── ConditionalNavbar.tsx   # Conditional navbar wrapper
│   └── SessionProvider.tsx     # Session provider wrapper
└── lib/
    ├── auth.ts                 # NextAuth configuration
    └── prisma.ts               # Prisma client
```

## Authentication Flow

1. **Sign Up/Sign In**: Users click "Continue with Google"
2. **Google OAuth**: Redirected to Google for authentication
3. **Database Storage**: User information stored in MongoDB
4. **Session Management**: NextAuth.js manages user sessions
5. **Profile Access**: Authenticated users can access profile page

## Database Schema

The app uses these Prisma models:

- **User**: Stores user information (name, email, image)
- **Account**: OAuth account information
- **Session**: User session data
- **VerificationToken**: For email verification

## Color Palette

- Primary: `#6D688A` (Purple-gray)
- Coral: `#FFB3BA` (Light coral)
- Cream: `#FFDFBA` (Light cream)
- Light Cream: `#FFFFBA` (Very light cream)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to update these for production:

- `NEXTAUTH_URL`: Your production domain
- `DATABASE_URL`: Your production MongoDB connection
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Same as development or create new ones

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.
