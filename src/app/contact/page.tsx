
import { Metadata } from "next";
import Contact from "../../components/Contact";

export const metadata: Metadata = {
  title: 'Contact Us | Oasis Marine Trading LLC',
  description:
    'Get in touch with Oasis Marine Trading LLC for inquiries, support, and professional marine and industrial solutions across the UAE.',
  keywords: 'Oasis Marine UAE contact, marine trading inquiries, industrial solutions UAE, get in touch Oasis Marine',
  openGraph: {
    title: 'Contact Us | Oasis Marine Trading LLC',
    description:
      'Get in touch with Oasis Marine Trading LLC for inquiries, support, and professional marine and industrial solutions across the UAE.',
    type: 'website',
    url: 'https://oasismarineuae.com/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function ContactPage() {
  return (
    <>
<Contact/>
        </>
  );
}