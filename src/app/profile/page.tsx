import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import ProfileClient from '../../components/ProfileClient';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Our Profile | Oasis Marine Trading LLC',
  description:
    'Learn about Oasis Marine Trading LLC – a trusted name in marine and industrial trading across the UAE. Discover our mission, values, and commitment to delivering excellence in every service.',
  keywords:
    'Oasis Marine profile, company profile, marine trading UAE, industrial solutions UAE, Oasis Marine mission, Oasis Marine values',
  openGraph: {
    title: 'Our Profile | Oasis Marine Trading LLC',
    description:
      'Learn about Oasis Marine Trading LLC – a trusted name in marine and industrial trading across the UAE. Discover our mission, values, and commitment to delivering excellence in every service.',
    type: 'website',
    url: 'https://oasismarineuae.com/profile',
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default async function ProfilePage() {
  const session = await getServerSession();

  // Redirect to signin if not authenticated
  if (!session) {
    redirect('/auth/signin');
  }

  return <ProfileClient session={session} />;
}