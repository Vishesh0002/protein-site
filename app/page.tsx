"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import BenefitsSection from "./components/BenefitsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import FAQSection from "./components/FAQSection";
import HeroSection from "./components/HeroSection";
import Marquee from "./components/Marquee";
import NutritionSection from "./components/NutritionSection";
import ProductsSection from "./components/ProductsSection";
import ReviewsSection from "./components/ReviewsSection";
import WelcomeIntro from "./components/WelcomeIntro";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  flavor: string;
  quantity: number;
  price: number;
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 mix-blend-difference md:block"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div
        className="h-full w-full rounded-full bg-white"
        animate={{ scale: isHovering ? 1.5 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </motion.div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (flavor: string, delta: number) => void;
  onRemove: (flavor: string) => void;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md bg-[#0c0c0c] shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 className="text-lg font-bold text-white">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                >
                  <X size={18} className="text-white/70" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ShoppingBag size={48} className="mb-4 text-white/20" />
                    <p className="text-white/40">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.flavor}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-center gap-4 rounded-2xl bg-white/5 p-4"
                      >
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20" />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{item.flavor}</p>
                          <p className="text-sm text-white/40">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.flavor, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10"
                          >
                            <Minus size={14} className="text-white/70" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.flavor, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10"
                          >
                            <Plus size={14} className="text-white/70" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.flavor)}
                          className="text-white/30 transition-colors hover:text-red-400"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/10 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-xl font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                  <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-4 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateQuantity = (flavor: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.flavor === flavor ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (flavor: string) => {
    setCartItems((prev) => prev.filter((item) => item.flavor !== flavor));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-orange-500/30">
      <WelcomeIntro />
      <CustomCursor />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />
      <HeroSection />
      <Marquee />
      <ProductsSection />
      <BenefitsSection />
      <NutritionSection />
      <ReviewsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
