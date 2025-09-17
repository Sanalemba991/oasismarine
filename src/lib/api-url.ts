/**
 * Get the correct API base URL for different environments
 * Works for both client-side and server-side requests
 */
export function getApiBaseUrl(): string {
  // If we have NEXT_PUBLIC_API_URL, use it (works on both client and server)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For server-side in production (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For development
  return 'http://localhost:3000';
}

/**
 * Build a complete API URL
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}