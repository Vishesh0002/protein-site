import type { Metadata, Viewport } from "next";
import { CartDrawer } from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/SmoothScroll";
import PageLoader from "./components/PageLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Front Runner Health Care",
  description: "Premium whey isolate protein supplements",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col bg-neutral-950 text-white">
        <PageLoader />
        <Navbar />
        <CartDrawer />
        {children}
      </body>
    </html>
  );
}
