import type { Metadata } from "next";
import { CartDrawer } from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Front Runner Health Care",
  description: "Premium whey isolate protein supplements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-white">
        <Navbar />
        <CartDrawer />
        {children}
      </body>
    </html>
  );
}
