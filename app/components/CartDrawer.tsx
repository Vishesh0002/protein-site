'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart, formatINR } from '../lib/store/cart';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, getSubtotal } = useCart();

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                  <ShoppingBag size={18} className="text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Your Cart</h2>
                  <p className="text-xs text-white/50">{items.length} items</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100%-180px)] flex-col">
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                    <ShoppingBag size={32} className="text-white/30" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Your cart is empty</h3>
                  <p className="mb-6 text-sm text-white/50">Add some products to get started</p>
                  <button
                    onClick={closeCart}
                    className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-white line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-white/50">
                              {formatINR(item.price)} / unit
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Qty Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-white">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Remove + Price */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-orange-400">
                                {formatINR(item.price * item.qty)}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-all hover:bg-red-500/20 hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-neutral-950 px-6 py-4">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-medium text-white">{formatINR(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span className="font-medium text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-orange-400">
                      {formatINR(getSubtotal())}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
