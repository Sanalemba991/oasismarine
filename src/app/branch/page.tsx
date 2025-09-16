
import { Metadata } from "next";
import Branch from "../../components/Branch";

export const metadata: Metadata = {
  title: 'Our Branches | Oasis Marine Trading LLC',
  description:
    'Discover Oasis Marine Trading LLC branches across the UAE, providing reliable marine and industrial solutions with a commitment to excellence.',
  keywords: 'Oasis Marine UAE branches, marine trading locations, industrial solutions UAE, Oasis Marine offices',
  openGraph: {
    title: 'Our Branches | Oasis Marine Trading LLC',
    description:
      'Discover Oasis Marine Trading LLC branches across the UAE, providing reliable marine and industrial solutions with a commitment to excellence.',
    type: 'website',
    url: 'https://oasismarineuae.com/branches',
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function BranchPage() {
  return (
    <>
<Branch/>
        </>
  );
}