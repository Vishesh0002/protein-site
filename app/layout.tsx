import type { Metadata, Viewport } from "next";
import { CartDrawer } from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/SmoothScroll";
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden bg-neutral-950 text-white">
        <SmoothScroll />
        <Navbar />
        <CartDrawer />
        {children}
      </body>
    </html>
  );
}
