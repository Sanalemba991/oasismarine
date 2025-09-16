import { Metadata } from "next";
import Privacy from "@/components/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Oasis Marine Trading LLC",
  description:
    "Read the Privacy Policy of Oasis Marine Trading LLC to understand how we collect, use, and protect your information while providing marine and industrial solutions across the UAE.",
  keywords:
    "Oasis Marine privacy policy, data protection UAE, Oasis Marine data usage, information security Oasis Marine",
  openGraph: {
    title: "Privacy Policy | Oasis Marine Trading LLC",
    description:
      "Read the Privacy Policy of Oasis Marine Trading LLC to understand how we collect, use, and protect your information while providing marine and industrial solutions across the UAE.",
    type: "website",
    url: "https://oasismarineuae.com/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <Privacy />
    </>
  );
}
