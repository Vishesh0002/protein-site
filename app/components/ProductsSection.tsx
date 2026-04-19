"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Sparkles,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../lib/store/cart";

type Product = {
  id: string;
  title: string;
  tag: string;
  image: string;
  gradient: string;
  price: number;
  mrp: number;
  badge?: string;
  note?: string;
};

const products: Product[] = [
  {
    id: "product-1",
    title: "Body Mass Gainer",
    tag: "Bulk Up",
    image: "/image/1.png",
    gradient: "from-orange-500/30 via-orange-600/20 to-amber-500/10",
    price: 4599,
    mrp: 4599,
    badge: "Best Seller",
  },
  {
    id: "product-2",
    title: "Whey Protein 100%",
    tag: "Recovery",
    image: "/image/2.png",
    gradient: "from-purple-500/25 via-pink-500/15 to-orange-500/10",
    price: 1199,
    mrp: 1499,
    badge: "Limited",
  },
  {
    id: "product-3",
    title: "Pre Workout",
    tag: "Perfomance",
    image: "/image/3.png?v=2",
    gradient: "from-amber-500/30 via-yellow-500/20 to-orange-600/10",
    price: 2299,
    mrp: 2999,
  },
  {
    id: "product-4",
    title: "Nitro Blast",
    tag: "Daily Health",
    image: "/image/4.png",
    gradient: "from-emerald-500/25 via-teal-500/15 to-cyan-500/10",
    price: 799,
    mrp: 999,
    badge: "New",
  },
];

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const { addItem, openCart } = useCart();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [6, -6]);
  const rotateY = useTransform(mouseX, [-100, 100], [-6, 6]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative h-full w-[280px] shrink-0 snap-start md:w-[320px]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm transition-colors duration-300 group-hover:border-orange-500/40">
        {/* Hover glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-orange-500/0 blur-3xl transition-all duration-500 group-hover:bg-orange-500/30" />

        {/* Image area with gradient + icon */}
        <div
          className={`relative h-52 overflow-hidden bg-gradient-to-br ${product.gradient}`}
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Product image */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
          >
            <Image
              key={product.image}
              src={product.image}
              alt={product.title}
              width={280}
              height={280}
              unoptimized
              className="h-full w-full object-contain p-6 drop-shadow-[0_10px_40px_rgba(249,115,22,0.25)]"
            />
          </motion.div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-orange-300 backdrop-blur-md">
              <Sparkles size={10} />
              {product.badge}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label="Add to wishlist"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950/50 text-white/70 backdrop-blur-md transition-all hover:border-orange-500/40 hover:text-orange-400"
          >
            <Heart
              size={16}
              className={liked ? "text-orange-500" : ""}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col p-5" style={{ transform: "translateZ(10px)" }}>
          {/* Tag */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            <Tag size={10} />
            {product.tag}
          </div>

          {/* Title */}
          <h3 className="mb-4 line-clamp-2 min-h-[3rem] text-base font-bold leading-snug text-white transition-colors group-hover:text-orange-300">
            {product.title}
          </h3>

          {/* Pricing */}
          <div className="mb-3 flex items-end justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Price
              </p>
              <p className="mt-0.5 text-2xl font-black text-white">
                {formatINR(product.price)}
              </p>
              <p className="text-[11px] text-white/30">
                MRP: <span className="line-through">{formatINR(product.mrp)}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </span>
              <span className="text-[10px] font-medium text-emerald-400/80">
                Save {formatINR(product.mrp - product.price)}
              </span>
            </div>
          </div>

          {/* Note slot (kept for uniform height) */}
          <div className="flex min-h-[28px] flex-col gap-2">
            {product.note && (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                <Sparkles size={11} />
                {product.note}
              </div>
            )}
          </div>

          {/* Actions (anchored to bottom) */}
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <button
              onClick={() => {
                addItem({
                  id: product.id,
                  title: product.title,
                  image: product.image,
                  price: product.price,
                  mrp: product.mrp,
                });
                openCart();
              }}
              className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 active:scale-[0.98]"
            >
              <ShoppingCart size={15} />
              Add to Cart
            </button>
            <Link
              href="/checkout"
              onClick={() =>
                addItem({
                  id: product.id,
                  title: product.title,
                  image: product.image,
                  price: product.price,
                  mrp: product.mrp,
                })
              }
              className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:shadow-orange-500/40 active:scale-[0.98]"
            >
              <span className="relative z-10">Buy Now</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="products"
      className="relative overflow-hidden bg-neutral-950 py-20 md:py-28"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[360px] w-[360px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              <Sparkles size={12} />
              Products
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              Shop Our{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-base text-white/50">
              Hand-picked supplements engineered for results. Fuel every rep, rep every goal.
            </p>
          </motion.div>

          {/* Nav arrows (desktop) */}
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scrollBy("left")}
              disabled={!canLeft}
              aria-label="Scroll left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy("right")}
              disabled={!canRight}
              aria-label="Scroll right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 transition-all duration-200 hover:border-orange-500/60 hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div className="relative -mx-6">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
            {/* trailing spacer for snap */}
            <div className="w-1 shrink-0" />
          </div>

          {/* Edge fade hints */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-neutral-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-neutral-950 to-transparent" />
        </div>
      </div>
    </section>
  );
}
