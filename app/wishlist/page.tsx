"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, formatINR } from "../lib/store/cart";
import { useWishlist } from "../lib/store/wishlist";

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlist();
  const { addItem, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleAddToCart = (item: (typeof items)[number]) => {
    addItem({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      mrp: item.mrp,
    });
    openCart();
  };

  const empty = mounted && items.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 pt-[88px]">
      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="group mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-orange-400"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to shop
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                <Heart className="text-orange-400" size={28} />
                Your Wishlist
              </h1>
              <p className="mt-1 text-white/50">
                {mounted
                  ? `${items.length} ${items.length === 1 ? "item" : "items"} saved`
                  : "Loading..."}
              </p>
            </div>
            {mounted && items.length > 0 && (
              <button
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/70 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {empty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] px-6 py-20 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
              <Heart size={40} className="text-white/30" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Your wishlist is empty</h2>
            <p className="mb-8 max-w-sm text-white/50">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition-all hover:bg-orange-500 active:scale-[0.98]"
            >
              Browse Products
            </Link>
          </motion.div>
        )}

        {/* Items grid */}
        {mounted && items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => {
                const discount =
                  item.mrp > item.price
                    ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                    : 0;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, type: "spring", damping: 20 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/5"
                  >
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-red-400 backdrop-blur-sm transition-all hover:bg-red-500/20 active:scale-90"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={14} className="fill-red-500 text-red-500" />
                    </button>

                    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-white/10 to-white/[0.02]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-5 transition-all duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-white">
                        {item.title}
                      </h3>
                      <div className="mb-4 flex items-baseline gap-2">
                        <span className="text-lg font-black text-white">
                          {formatINR(item.price)}
                        </span>
                        {discount > 0 && (
                          <>
                            <span className="text-xs text-white/40 line-through">
                              {formatINR(item.mrp)}
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              {discount}% off
                            </span>
                          </>
                        )}
                      </div>

                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.98]"
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                          aria-label="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
