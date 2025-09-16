import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "../components/ConditionalNavbar";
import SessionProvider from "../components/SessionProvider";
import ConditionalFooter from "../components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oasis Marine Trading LLC - Professional Marine Solutions",
  description: "Leading provider of marine equipment, parts, and services for the maritime industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressContentEditableWarning={true}
      >
        <SessionProvider>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter /> {/* Use this instead of <Footer /> */}
        </SessionProvider>
      </body>
    </html>
  );
}
