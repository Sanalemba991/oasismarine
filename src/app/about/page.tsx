
import { Metadata } from "next";
import Team from "../../components/Team";

export const metadata: Metadata = {
  title: 'About Us | Oasis Marine Trading LLC',
  description:
    'Learn more about Oasis Marine Trading LLC, our mission, vision, and dedication to delivering high-quality marine and industrial solutions across the UAE.',
  keywords: 'About Oasis Marine UAE, marine trading company, industrial solutions UAE, Oasis Marine mission vision',
  openGraph: {
    title: 'About Us | Oasis Marine Trading LLC',
    description:
      'Learn more about Oasis Marine Trading LLC, our mission, vision, and dedication to delivering high-quality marine and industrial solutions across the UAE.',
    type: 'website',
    url: 'https://oasismarineuae.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <>
    <Team />
        </>
  );
}