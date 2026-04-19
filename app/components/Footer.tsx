"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MoveUp, Mail } from "lucide-react";
import appIcon from "../icon.png";

// Custom Brand Icons matching Lucide's style
const InstagramIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const YoutubeIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 7.1C2.5 7.1 2.3 5.3 3.1 4.5c1-1.1 2.1-1.1 2.6-1.1C8.6 3 12 3 12 3s3.4 0 6.3.3c.5 0 1.6 0 2.6 1.1.8.8 1 2.6 1 2.6s.2 2.1.2 4.3v1.4c0 2.2-.2 4.3-.2 4.3s-.2 1.8-1 2.6c-1 1.1-2.3 1.1-2.8 1.2-3.4.3-6.6.3-6.6.3s-3.4 0-6.3-.3c-.5 0-1.6 0-2.6-1.1-.8-.8-1-2.6-1-2.6S2 13.5 2 11.3V9.9c0-2.2.2-4.3.2-4.3z"/><polygon points="9.8 15.5 15.6 11.3 9.8 7.1"/>
  </svg>
);

const FacebookIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Premium Proteins", href: "#" },
      { label: "Pre-Workout", href: "#" },
      { label: "Recovery Systems", href: "#" },
      { label: "Accessories", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Athletes", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Protein Calculator", href: "/protein-calculator" },
      { label: "Shipping & Returns", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: InstagramIcon, href: "#" },
  { icon: TwitterIcon, href: "#" },
  { icon: FacebookIcon, href: "#" },
  { icon: YoutubeIcon, href: "#" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050505] pt-24 overflow-hidden selection:bg-orange-500/30">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Top Section: CTA & Newsletter */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-16">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-white tracking-tight sm:text-5xl"
            >
              Ready to elevate your <span className="text-orange-500">performance?</span>
            </motion.h2>
            <p className="mt-4 text-white/50 text-lg">
              Join the Front Runner club for exclusive drops, early access, and performance tips.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md"
          >
            <form className="relative flex items-center group">
              <Mail className="absolute left-4 text-white/40 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-full py-4 pl-12 pr-32 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.05] transition-all"
                required
              />
              <button 
                type="submit"
                className="absolute right-2 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-6 py-2.5 transition-transform active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 gap-12 py-16 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 flex flex-col items-start">
            <Link href="/" className="group flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-orange-500/50 transition-colors">
                <Image src={appIcon} alt="Front Runner Logo" width={32} height={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-white group-hover:text-orange-500 transition-colors">
                  FRONT RUNNER
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                  Health Care
                </span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-8">
              Engineered for the serious athlete. We provide clean, tested, and effective nutrition to help you finish strong.
            </p>
            
            {/* Socials */}
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <Link 
                  key={i} 
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-white/60 hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Cols */}
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-6">
              <h3 className="text-white font-bold tracking-wide uppercase text-sm">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="group relative inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight 
                        size={14} 
                        className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-orange-500" 
                      />
                      {/* Underline effect */}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Giant Typography & Copyright */}
      <div className="relative border-t border-white/10 mt-8">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Front Runner Health Care. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm font-medium text-white/40 hover:text-orange-500 transition-colors"
          >
            Back to Top
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] border border-white/10 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-colors">
              <MoveUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Giant Text Background */}
        <div className="w-full overflow-hidden select-none pointer-events-none flex justify-center pb-4">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[14vw] font-black leading-none text-white/[0.02] tracking-tighter"
          >
            FRONTRUNNER
          </motion.h1>
        </div>
      </div>
    </footer>
  );
}