"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "../components/PhoneInput";
import { useCart, formatINR, CartItem } from "../lib/store/cart";
import { api } from "../lib/api";
import { loadRazorpayScript, openRazorpay } from "../lib/razorpay";

// Multi-step checkout flow
// Step 1: Review Cart
// Step 2: Contact Info
// Step 3: Shipping Address
// Step 4: Payment

type CheckoutStep = "cart" | "contact" | "shipping" | "payment";

interface CheckoutData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function CheckoutPage() {
  const { items, updateQty, removeItem, getSubtotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const COUPONS: Record<string, number> = { FAMILY: 50 };
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  // Mobile-only: controls whether the order summary details are expanded
  const [summaryOpen, setSummaryOpen] = useState(false);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (!(code in COUPONS)) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(code);
    setCouponError(null);
    setCouponInput("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const subtotal = getSubtotal();
  // Must match backend logic in orders.service.ts
  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] : 0;
  const discount = Math.round((subtotal * discountPct) / 100);
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= 2000 ? 0 : 50;
  const total = discountedSubtotal + shipping;

  // Redirect if cart is empty and not complete
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6">
        <div className="text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 mx-auto">
            <ShoppingBag size={48} className="text-white/30" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Your cart is empty</h1>
          <p className="mb-8 text-white/50">Add some products before checking out</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-all hover:bg-orange-500"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step === "cart") setStep("contact");
    else if (step === "contact") setStep("shipping");
    else if (step === "shipping") setStep("payment");
  };

  const handleBack = () => {
    if (step === "contact") setStep("cart");
    else if (step === "shipping") setStep("contact");
    else if (step === "payment") setStep("shipping");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway");

      // 2. Create order on backend
      const orderRes = await api.createOrder({
        items: items.map((i) => ({ slug: i.id, qty: i.qty })),
        shipping: {
          name: `${checkoutData.firstName} ${checkoutData.lastName}`.trim(),
          line1: checkoutData.address.line1,
          line2: checkoutData.address.line2 || undefined,
          city: checkoutData.address.city,
          state: checkoutData.address.state,
          pincode: checkoutData.address.pincode,
          phone: checkoutData.phone,
        },
        guestEmail: checkoutData.email,
        guestName: `${checkoutData.firstName} ${checkoutData.lastName}`.trim(),
        guestPhone: checkoutData.phone,
        coupon: appliedCoupon ?? undefined,
      });

      // 3. Open Razorpay modal
      openRazorpay({
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "Front Runner Health Care",
        description: "Order payment",
        order_id: orderRes.razorpayOrderId,
        prefill: {
          name: `${checkoutData.firstName} ${checkoutData.lastName}`.trim(),
          email: checkoutData.email,
          contact: checkoutData.phone,
        },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            await api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setOrderId(orderRes.orderId);
            setOrderComplete(true);
            clearCart();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Payment verification failed";
            setError(msg);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 mx-auto">
            <Check size={48} className="text-emerald-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Order Placed!</h1>
          <p className="mb-6 text-white/60">
            Thank you for your purchase. Your order <span className="font-mono text-orange-400">{orderId}</span> has been confirmed.
          </p>
          <p className="mb-8 text-sm text-white/40">
            A confirmation email has been sent to {checkoutData.email}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-all hover:bg-orange-500"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const stepIndex = { cart: 0, contact: 1, shipping: 2, payment: 3 }[step];
  const progressPct = (stepIndex / 3) * 100;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 pt-[72px]">
      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-orange-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="group mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-orange-400"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to shopping
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
            Checkout
          </h1>
          <p className="mt-1 text-white/50">Complete your purchase securely</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,400px] lg:gap-8">
          {/* Main Content */}
          <div className="order-2 space-y-5 sm:space-y-6 lg:order-1">
            {/* Progress Steps */}
            <div className="relative">
              {/* Progress line background */}
              <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/5" />
              {/* Progress line fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", damping: 20, stiffness: 140 }}
                className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
              />

              <div className="relative flex items-center justify-between">
                {[
                  { id: "cart", label: "Cart", icon: ShoppingBag },
                  { id: "contact", label: "Contact", icon: User },
                  { id: "shipping", label: "Shipping", icon: MapPin },
                  { id: "payment", label: "Payment", icon: CreditCard },
                ].map((s) => {
                  const Icon = s.icon;
                  const isActive = step === s.id;
                  const idx = { cart: 0, contact: 1, shipping: 2, payment: 3 }[
                    s.id as CheckoutStep
                  ];
                  const isDone = idx < stepIndex;

                  return (
                    <div key={s.id} className="flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all ${
                          isActive
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20"
                            : isDone
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/30"
                            : "bg-neutral-900 ring-2 ring-white/10"
                        }`}
                      >
                        {isDone ? (
                          <Check size={16} className="text-white" />
                        ) : (
                          <Icon
                            size={16}
                            className={isActive ? "text-white" : "text-white/40"}
                          />
                        )}
                        {isActive && (
                          <motion.span
                            className="absolute inset-0 rounded-full bg-orange-500/30"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </motion.div>
                      <span
                        className={`hidden text-[11px] font-semibold tracking-wide sm:inline ${
                          isActive
                            ? "text-orange-300"
                            : isDone
                            ? "text-emerald-400"
                            : "text-white/40"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <CartStep
                  key="cart"
                  items={items}
                  updateQty={updateQty}
                  removeItem={removeItem}
                  onNext={handleNext}
                />
              )}
              {step === "contact" && (
                <ContactStep
                  key="contact"
                  data={checkoutData}
                  setData={setCheckoutData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === "shipping" && (
                <ShippingStep
                  key="shipping"
                  data={checkoutData}
                  setData={setCheckoutData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === "payment" && (
                <PaymentStep
                  key="payment"
                  total={total}
                  isProcessing={isProcessing}
                  error={error}
                  onPlaceOrder={handlePlaceOrder}
                  onBack={handleBack}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-[88px] lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-4 shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:p-6"
            >
              {/* Glow accent */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative">
                {/* Header: collapsible on mobile, static on desktop. Total is always visible on mobile. */}
                <button
                  type="button"
                  onClick={() => setSummaryOpen((o) => !o)}
                  className="mb-3 flex w-full items-center justify-between gap-2 text-left lg:pointer-events-none lg:mb-5"
                  aria-expanded={summaryOpen}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <h2 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                      Order Summary
                    </h2>
                    <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/60 sm:px-2.5 sm:py-1 sm:text-xs">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 lg:hidden">
                    <span className="text-sm font-black tracking-tight text-white sm:text-base">
                      {formatINR(total)}
                    </span>
                    <motion.span
                      animate={{ rotate: summaryOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-white/70"
                    >
                      <ChevronDown size={14} />
                    </motion.span>
                  </div>
                </button>

                {/* Details: hidden on mobile unless expanded, always visible on desktop */}
                <div className={`${summaryOpen ? "block" : "hidden"} lg:block`}>
                <div className="mb-5 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-all hover:border-white/10"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-md">
                          {item.qty}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="text-sm font-bold text-orange-400">
                          {formatINR(item.price * item.qty)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mb-4 border-t border-white/10 pt-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-emerald-300">{appliedCoupon} applied</p>
                          <p className="text-[10px] text-emerald-400/70">
                            {COUPONS[appliedCoupon]}% off · -{formatINR(discount)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-300/70 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200"
                        aria-label="Remove coupon"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value);
                              if (couponError) setCouponError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                applyCoupon();
                              }
                            }}
                            placeholder="Coupon code"
                            className={`w-full rounded-xl border bg-white/[0.03] py-2 pl-9 pr-3 text-sm uppercase tracking-wider text-white placeholder:text-white/30 placeholder:normal-case placeholder:tracking-normal focus:outline-none ${
                              couponError
                                ? "border-red-500/50 focus:border-red-500"
                                : "border-white/10 focus:border-orange-500/50"
                            }`}
                          />
                        </div>
                        <button
                          onClick={applyCoupon}
                          disabled={!couponInput.trim()}
                          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-1.5 text-xs text-red-400">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-medium text-white">{formatINR(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400/80">
                        Discount ({appliedCoupon})
                      </span>
                      <span className="font-medium text-emerald-400">
                        -{formatINR(discount)}
                      </span>
                    </div>
                  )}
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
                  <div className="mt-1 flex items-end justify-between border-t border-white/10 pt-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40">Total</p>
                      <motion.p
                        key={total}
                        initial={{ opacity: 0.6, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-black tracking-tight text-white"
                      >
                        {formatINR(total)}
                      </motion.p>
                    </div>
                    <p className="pb-1 text-[10px] text-white/40">Incl. taxes</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-center">
                  <div className="rounded-lg bg-white/[0.02] px-3 py-2">
                    <ShieldCheck size={14} className="mx-auto mb-1 text-emerald-400" />
                    <p className="text-[10px] text-white/50">Secure SSL</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] px-3 py-2">
                    <Package size={14} className="mx-auto mb-1 text-orange-400" />
                    <p className="text-[10px] text-white/50">Fast shipping</p>
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components

function CartStep({
  items,
  updateQty,
  removeItem,
  onNext,
}: {
  items: CartItem[];
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-4 shadow-xl backdrop-blur-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Review Your Cart</h2>
        <p className="mt-1 text-sm text-white/50">Make sure everything looks right</p>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:gap-4 sm:p-4"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-24 sm:w-24">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white sm:text-base">{item.title}</h3>
                <p className="text-xs text-white/50 sm:text-sm">{formatINR(item.price)} / unit</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:bg-white/10 sm:h-8 sm:w-8"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-white sm:w-8">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:bg-white/10 sm:h-8 sm:w-8"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-sm font-semibold text-orange-400 sm:text-base">
                    {formatINR(item.price * item.qty)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-all hover:bg-red-500/20 hover:text-red-400 sm:h-8 sm:w-8"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-4 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white transition-all hover:bg-orange-500 active:scale-[0.98]"
      >
        Continue to Contact Info
      </button>
    </motion.div>
  );
}

function ContactStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: CheckoutData;
  setData: React.Dispatch<React.SetStateAction<CheckoutData>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const phoneValid = !!data.phone && isValidPhoneNumber(data.phone);
  const isValid = emailValid && phoneValid && data.firstName && data.lastName;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-4 shadow-xl backdrop-blur-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Contact Information</h2>
        <p className="mt-1 text-sm text-white/50">We&apos;ll use this to send order updates</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">First Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
              placeholder="John"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Last Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => setData((d) => ({ ...d, lastName: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">Phone</label>
        <PhoneInput
          value={data.phone}
          onChange={(phone) => setData((d) => ({ ...d, phone }))}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 sm:px-6 sm:text-base"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] sm:text-base"
        >
          Continue to Shipping
        </button>
      </div>
    </motion.div>
  );
}

function ShippingStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: CheckoutData;
  setData: React.Dispatch<React.SetStateAction<CheckoutData>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const addr = data.address;
  const isValid = addr.line1 && addr.city && addr.state && addr.pincode;
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  useEffect(() => {
    const pin = addr.pincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPincodeError(null);
      return;
    }
    const ctrl = new AbortController();
    setPincodeLoading(true);
    setPincodeError(null);
    fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((res) => {
        const info = res?.[0];
        if (info?.Status === "Success" && info.PostOffice?.length > 0) {
          const po = info.PostOffice[0];
          setData((d) => ({
            ...d,
            address: {
              ...d.address,
              city: d.address.city || po.District || po.Block || "",
              state: d.address.state || po.State || "",
            },
          }));
        } else {
          setPincodeError("Invalid PIN code");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setPincodeError("Could not verify PIN");
      })
      .finally(() => setPincodeLoading(false));
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr.pincode]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-4 shadow-xl backdrop-blur-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Shipping Address</h2>
        <p className="mt-1 text-sm text-white/50">Where should we deliver your order?</p>
      </div>
      
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">Address Line 1</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={addr.line1}
            onChange={(e) =>
              setData((d) => ({ ...d, address: { ...d.address, line1: e.target.value } }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="House number, Street"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">
          Address Line 2 <span className="text-white/40">(Optional)</span>
        </label>
        <input
          type="text"
          value={addr.line2}
          onChange={(e) =>
            setData((d) => ({ ...d, address: { ...d.address, line2: e.target.value } }))
          }
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
          placeholder="Apartment, Landmark"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">
          PIN Code
          <span className="ml-2 text-xs font-normal text-white/40">
            Auto-fills city &amp; state
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={addr.pincode}
            onChange={(e) => {
              const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
              setData((d) => ({
                ...d,
                address: {
                  ...d.address,
                  pincode: pin,
                  // Reset city/state if pincode changes significantly
                  ...(pin.length < 6 ? { city: "", state: "" } : {}),
                },
              }));
            }}
            className={`w-full rounded-xl border bg-white/[0.03] py-2.5 px-4 text-white placeholder:text-white/30 focus:outline-none ${
              pincodeError
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-orange-500/50"
            }`}
            placeholder="400001"
          />
          {pincodeLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-orange-500/30 border-t-orange-500"
            />
          )}
          {!pincodeLoading && /^\d{6}$/.test(addr.pincode) && !pincodeError && (
            <Check
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
            />
          )}
        </div>
        {pincodeError && (
          <p className="mt-1 text-xs text-red-400">{pincodeError}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">City</label>
          <input
            type="text"
            value={addr.city}
            onChange={(e) =>
              setData((d) => ({ ...d, address: { ...d.address, city: e.target.value } }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="Mumbai"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">State</label>
          <input
            type="text"
            value={addr.state}
            onChange={(e) =>
              setData((d) => ({ ...d, address: { ...d.address, state: e.target.value } }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="Maharashtra"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 sm:px-6 sm:text-base"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] sm:text-base"
        >
          Continue to Payment
        </button>
      </div>
    </motion.div>
  );
}

function PaymentStep({
  total,
  isProcessing,
  error,
  onPlaceOrder,
  onBack,
}: {
  total: number;
  isProcessing: boolean;
  error: string | null;
  onPlaceOrder: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-4 shadow-xl backdrop-blur-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Payment</h2>
        <p className="mt-1 text-sm text-white/50">Choose your preferred payment method</p>
      </div>

      {/* Razorpay card */}
      <div className="group relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent p-5 ring-2 ring-orange-500/20">
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl transition-opacity group-hover:opacity-80" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40">
            <CreditCard size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-white">Razorpay Secure Checkout</p>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                Recommended
              </span>
            </div>
            <p className="mt-1 text-sm text-white/60">
              Cards · UPI · NetBanking · Wallets · EMI
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Visa", "Mastercard", "RuPay", "UPI", "Paytm"].map((b) => (
                <span
                  key={b}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Amount summary */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/50">Amount to pay</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-white">
              {formatINR(total)}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10">
            <ShieldCheck size={24} className="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: ShieldCheck, label: "256-bit SSL" },
          { icon: CreditCard, label: "PCI Secure" },
          { icon: Check, label: "PCI DSS" },
        ].map((t) => {
          const I = t.icon;
          return (
            <div
              key={t.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
            >
              <I size={14} className="text-emerald-400" />
              <p className="text-[10px] font-medium text-white/60">{t.label}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50 sm:px-6 sm:text-base"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] sm:text-base"
        >
          <span className="relative z-10">
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
                Processing...
              </span>
            ) : (
              `Pay ${formatINR(total)}`
            )}
          </span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
    </motion.div>
  );
}
