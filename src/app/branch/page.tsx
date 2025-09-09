
import { Metadata } from "next";
import Branch from "../../components/Branch";

export const metadata: Metadata = {
  title: 'Careers at Lovosis Technologies Pvt Ltd | Join Our Team',
  description: 'Explore exciting career opportunities at Lovosis Technologies. Join our innovative team and be part of cutting-edge technology solutions.',
  keywords: 'careers, jobs, employment, technology jobs, IT careers, Lovosis Technologies careers',
  openGraph: {
    title: 'Careers at Lovosis Technologies Pvt Ltd | Join Our Team',
    description: 'Explore exciting career opportunities at Lovosis Technologies. Join our innovative team and be part of cutting-edge technology solutions.',
    type: 'website',
    url: 'https://lovosis.in/careers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CareersPage() {
  return (
    <>
<Branch/>
        </>
  );
}