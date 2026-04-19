"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useCart, formatINR } from "../lib/store/cart";

const FREE_SHIPPING_THRESHOLD = 2000;

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 shadow-2xl ring-1 ring-white/10"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-24 right-1/2 h-64 w-64 translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
                >
                  <ShoppingBag size={18} className="text-white" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">Your Cart</h2>
                  <p className="text-xs text-white/50">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:rotate-90 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="relative z-10 border-b border-white/5 bg-white/[0.02] px-6 py-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-white/60">
                    <Truck size={12} className="text-orange-400" />
                    {amountToFreeShipping > 0 ? (
                      <>
                        <span className="font-medium text-white">
                          {formatINR(amountToFreeShipping)}
                        </span>{" "}
                        to free shipping
                      </>
                    ) : (
                      <span className="font-semibold text-emerald-400">
                        You got free shipping!
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-white/40">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className={`h-full rounded-full ${
                      amountToFreeShipping > 0
                        ? "bg-gradient-to-r from-orange-500 to-orange-400"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full flex-col items-center justify-center px-6 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10"
                  >
                    <ShoppingBag size={40} className="text-white/30" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold text-white">Cart is empty</h3>
                  <p className="mb-8 max-w-xs text-sm text-white/50">
                    Looks like you haven&apos;t added anything yet. Let&apos;s find something
                    great!
                  </p>
                  <button
                    onClick={closeCart}
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.03] hover:shadow-orange-500/40 active:scale-[0.97]"
                  >
                    Start Shopping
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3 px-4 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -120, scale: 0.9 }}
                        transition={{ type: "spring", damping: 22, stiffness: 260 }}
                        className="group relative flex gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-3 transition-all hover:border-white/10 hover:from-white/[0.06]"
                      >
                        {/* Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <h4 className="line-clamp-1 text-sm font-semibold text-white">
                              {item.title}
                            </h4>
                            <p className="mt-0.5 text-xs text-white/40">
                              {formatINR(item.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Qty Controls */}
                            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-90"
                              >
                                <Minus size={12} />
                              </button>
                              <motion.span
                                key={item.qty}
                                initial={{ scale: 1.3, color: "#fb923c" }}
                                animate={{ scale: 1, color: "#ffffff" }}
                                transition={{ duration: 0.2 }}
                                className="w-6 text-center text-xs font-bold"
                              >
                                {item.qty}
                              </motion.span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-90"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price + Remove */}
                            <div className="flex items-center gap-2">
                              <motion.span
                                key={item.price * item.qty}
                                initial={{ opacity: 0.6, y: -2 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-bold text-orange-400"
                              >
                                {formatINR(item.price * item.qty)}
                              </motion.span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-red-500/15 hover:text-red-400 active:scale-90"
                                aria-label="Remove"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Promo hint */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs text-white/50">
                    <Tag size={12} className="text-orange-400" />
                    <span>Promo codes can be applied at checkout</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="relative z-10 border-t border-white/10 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-950/80 px-6 py-5 backdrop-blur-xl"
              >
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-medium text-white">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span
                      className={`font-medium ${
                        shipping === 0 ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {shipping === 0 ? "Free" : formatINR(shipping)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-3">
                    <div>
                      <p className="text-xs text-white/50">Total</p>
                      <motion.p
                        key={total}
                        initial={{ opacity: 0.5, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-black tracking-tight text-white"
                      >
                        {formatINR(total)}
                      </motion.p>
                    </div>
                    <p className="text-xs text-white/40">Incl. all taxes</p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 active:scale-[0.98]"
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <ArrowRight
                    size={16}
                    className="relative z-10 transition-transform group-hover:translate-x-1"
                  />
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/40">
                  <ShieldCheck size={12} />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
