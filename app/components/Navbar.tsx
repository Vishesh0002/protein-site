"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  Mail,
  Menu,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import appIcon from "../icon.png";
import { useCart } from "../lib/store/cart";
import { BRANDS } from "../lib/brands";

const navItems = [
  { label: "Shop", icon: ShoppingBag, href: "/shop", disabled: false },
  { label: "Protein Calculator", icon: Calculator, href: "/protein-calculator", disabled: false },
];

function getActiveLink(pathname: string) {
  if (pathname === "/protein-calculator") return "Protein Calculator";
  if (pathname === "/shop") return "Shop";
  return "";
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, getItemCount } = useCart();
  const itemCount = mounted ? getItemCount() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncActiveLink = () => {
      setActiveLink(getActiveLink(pathname));
    };

    syncActiveLink();
    window.addEventListener("hashchange", syncActiveLink);

    return () => window.removeEventListener("hashchange", syncActiveLink);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${scrolled
            ? "bg-neutral-950/85 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "bg-transparent"
          }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => setActiveLink("")}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <Image
                src={appIcon}
                alt="Front Runner Health Care logo"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[15px] font-extrabold leading-none tracking-[0.04em] text-orange-500">
                FRONT RUNNER
              </span>
              <span className="mt-1 text-[11px] font-medium uppercase leading-none tracking-[0.32em] text-white/45">
                Health Care
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            <li>
              <BrandsDropdown active={activeLink === "Brands"} />
            </li>
            {navItems.map(({ label, icon: Icon, href, disabled }) => {
              const baseClass = `relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeLink === label
                  ? "text-white"
                  : disabled
                    ? "cursor-not-allowed text-white/30"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                }`;
              const inner = (
                <>
                  <Icon size={13} className={activeLink === label ? "text-orange-400" : "opacity-60"} />
                  {label}
                  {activeLink === label && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute right-4 bottom-[-2px] left-4 h-[2px] rounded-full bg-orange-500"
                      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                    />
                  )}
                </>
              );
              return (
                <li key={label}>
                  {disabled ? (
                    <button type="button" disabled className={baseClass}>
                      {inner}
                    </button>
                  ) : (
                    <Link href={href} onClick={() => setActiveLink(label)} className={baseClass}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Contact Us */}
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition-all duration-200 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 lg:flex"
            >
              <Mail size={13} />
              Contact Us
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-orange-500 active:scale-[0.98]"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-neutral-950 bg-white text-[10px] font-black text-orange-600"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Coming soon"
                className="hidden lg:flex pointer-events-none relative items-center gap-3 rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white"
              >
                Login / Sign Up
              </button>
            
          




            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-all duration-200 hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[72px] right-0 left-0 z-40 flex flex-col border-b border-white/[0.06] bg-neutral-950/95 px-6 pt-2 pb-6 backdrop-blur-2xl lg:hidden"
          >
            {navItems.map(({ label, icon: Icon, href, disabled }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {disabled ? (
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 border-b border-white/[0.06] py-4 text-left text-lg font-semibold text-white/30"
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ) : (
                  <Link
                    href={href}
                    onClick={() => {
                      setActiveLink(label);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 border-b border-white/[0.06] py-4 text-lg font-semibold transition-colors ${activeLink === label
                        ? "text-orange-500"
                        : "text-white/60 hover:text-orange-400"
                      }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                )}
              </motion.div>
            ))}

            {/* Contact Us in mobile menu */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.05 }}
            >
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-4 text-lg font-semibold text-orange-400"
              >
                <Mail size={18} />
                Contact Us
              </Link>
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Coming soon"
                className="mt-4 flex pointer-events-none items-center justify-center rounded-lg bg-orange-600 py-3 text-lg font-bold text-white"
              >
                Login / Sign Up
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Brands Dropdown ---------- */

function BrandsDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          active || open
            ? "text-white"
            : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
        }`}
      >
        <Tag size={13} className={open ? "text-orange-400" : "opacity-60"} />
        Brands
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40"
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 w-[min(92vw,560px)] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Glow */}
            <div className="pointer-events-none absolute -top-10 right-1/2 h-40 w-40 translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl" />

            <div className="relative p-3">
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Shop by Brand
                </p>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-orange-400 hover:text-orange-300"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BRANDS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/shop?brand=${b.slug}`}
                    onClick={() => setOpen(false)}
                    className="group/brand relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-all hover:border-orange-500/30 hover:bg-white/[0.05]"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity group-hover/brand:opacity-60 ${b.gradient}`}
                    />
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02]">
                      <Image
                        src={b.image}
                        alt={b.name}
                        fill
                        className="object-contain p-1.5 transition-transform duration-300 group-hover/brand:scale-110"
                        unoptimized
                      />
                    </div>
                    <div className="relative min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{b.name}</p>
                      <p className="truncate text-[11px] text-white/50">{b.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
