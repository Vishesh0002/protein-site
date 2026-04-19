"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";
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
  const router = useRouter();
  const { items, updateQty, removeItem, getSubtotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);

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
  const shipping = subtotal >= 2000 ? 0 : 50;
  const total = subtotal + shipping;

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
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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

  return (
    <div className="min-h-screen bg-neutral-950 pt-[72px]">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-orange-400"
          >
            <ArrowLeft size={16} />
            Back to shopping
          </Link>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Checkout</h1>
          <p className="mt-1 text-white/50">Complete your purchase securely</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {[
                { id: "cart", label: "Cart", icon: ShoppingBag },
                { id: "contact", label: "Contact", icon: User },
                { id: "shipping", label: "Shipping", icon: MapPin },
                { id: "payment", label: "Payment", icon: CreditCard },
              ].map((s, i) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isDone =
                  (step === "contact" && s.id === "cart") ||
                  (step === "shipping" && (s.id === "cart" || s.id === "contact")) ||
                  (step === "payment" && s.id !== "payment");

                return (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-orange-600 text-white"
                          : isDone
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {isDone ? <Check size={14} /> : <Icon size={14} />}
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < 3 && <ChevronRight size={16} className="mx-1 text-white/20" />}
                  </div>
                );
              })}
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
          <div className="lg:sticky lg:top-[88px] lg:h-fit">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>
              
              <div className="mb-4 max-h-[200px] overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-white/50">Qty: {item.qty}</p>
                      <p className="text-sm font-semibold text-orange-400">
                        {formatINR(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="font-medium text-white">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="font-medium text-white">
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-lg">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-orange-400">{formatINR(total)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <ShieldCheck size={14} />
                <span>Secure SSL encryption</span>
              </div>
            </div>
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
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-white">Review Your Cart</h2>
      
      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/50">{formatINR(item.price)} / unit</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-white">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-orange-400">
                    {formatINR(item.price * item.qty)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-white/40 transition-all hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 size={16} />
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
  const isValid = data.email && data.phone && data.firstName && data.lastName;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-white">Contact Information</h2>
      
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
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 rounded-xl bg-orange-600 py-3 font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-white">Shipping Address</h2>
      
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

      <div className="grid gap-4 sm:grid-cols-3">
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
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">PIN Code</label>
          <input
            type="text"
            value={addr.pincode}
            onChange={(e) =>
              setData((d) => ({ ...d, address: { ...d.address, pincode: e.target.value } }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="400001"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 rounded-xl bg-orange-600 py-3 font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
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
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-white">Payment</h2>
      
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
            <CreditCard size={20} className="text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-white">Razorpay Secure Checkout</p>
            <p className="text-xs text-white/50">Cards, UPI, NetBanking, Wallets</p>
          </div>
        </div>
        
        <div className="space-y-2 border-t border-white/10 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Amount to pay</span>
            <span className="font-bold text-white">{formatINR(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-white/40">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        <p>
          Your payment is secured by Razorpay. We do not store your card details. 
          All transactions are encrypted with 256-bit SSL.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="flex-1 rounded-xl bg-orange-600 py-3 font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </span>
          ) : (
            `Pay ${formatINR(total)}`
          )}
        </button>
      </div>
    </motion.div>
  );
}
