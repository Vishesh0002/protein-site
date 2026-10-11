"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  Calendar,
  Layers,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Phone,
  QrCode,
  Lock,
} from "lucide-react";
import { api, VerifyCodeResponse } from "../lib/api";
import Footer from "../components/Footer";

function AuthenticateForm() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [code, setCode] = useState(initialCode.toUpperCase());
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If a code is passed in the URL (e.g., from QR code scan), set it automatically
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase();
    setCode(raw);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, "");

    if (!cleanCode || cleanCode.length < 6) {
      setError("Please enter a valid scratch code (minimum 6 characters).");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.verifyCode({
        code: cleanCode,
        phone: phone.trim() || undefined,
      });
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCode("");
    setError(null);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-neutral-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <ShieldCheck className="w-4 h-4" />
            100% Genuine Guarantee
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase"
          >
            Verify Product <span className="text-emerald-400">Authenticity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto"
          >
            Authenticate your Front-Runner supplement in seconds. Scratch the silver foil on your product to reveal your unique 10-digit code.
          </motion.p>
        </div>

        {/* Verification Card / Result Display */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="verify-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="scratchCode"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Enter 10-Digit Scratch Code <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="scratchCode"
                      type="text"
                      value={code}
                      onChange={handleCodeChange}
                      placeholder="e.g. FR8X-92K4-M1"
                      maxLength={14}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-2xl px-5 py-4 text-xl sm:text-2xl font-mono font-bold tracking-widest text-emerald-400 placeholder:text-neutral-600 outline-none transition-all"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Gently scratch the silver foil patch on your tub/box to find your unique code.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="mobilePhone"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Mobile Number <span className="text-neutral-500 text-xs font-normal">(Optional for verification SMS)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="mobilePhone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700 rounded-2xl px-5 py-3.5 text-neutral-200 placeholder:text-neutral-600 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-neutral-950 font-bold text-base sm:text-lg tracking-wide uppercase shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying with Authenticity Server...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Authenticate Product</span>
                    </>
                  )}
                </button>
              </form>

              {/* Step By Step Guide Below Form */}
              <div className="mt-10 pt-8 border-t border-neutral-800">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  How to verify your Front-Runner supplement:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
                    <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-emerald-400 text-sm mb-3">
                      1
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Locate The Seal</h4>
                    <p className="text-xs text-neutral-400">
                      Find the silver holographic scratch foil sticker on the product lid or back panel.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
                    <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-emerald-400 text-sm mb-3">
                      2
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Scratch The Foil</h4>
                    <p className="text-xs text-neutral-400">
                      Gently use a coin or fingernail to scratch the silver layer and reveal the 10-digit code.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
                    <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-emerald-400 text-sm mb-3">
                      3
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Scan or Enter</h4>
                    <p className="text-xs text-neutral-400">
                      Scan the printed QR code with your phone camera or enter the digits manually above.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Result Modal / Certificate */
            <motion.div
              key="verify-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {result.status === "AUTHENTIC" && (
                <div className="bg-gradient-to-b from-emerald-950/50 to-neutral-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Success Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-8 pb-8 border-b border-emerald-500/20">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Original & Authentic Seal Verified
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        100% Genuine Front-Runner Product
                      </h2>
                      <p className="text-emerald-300/80 text-sm mt-1">
                        {result.message}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                      <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        Product Name
                      </div>
                      <div className="text-base font-bold text-white">
                        {result.product?.title || "Front-Runner Nutrition"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                      <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        Batch Number
                      </div>
                      <div className="text-base font-mono font-bold text-emerald-400">
                        {result.batchNumber || "N/A"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                      <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        First Authenticated On
                      </div>
                      <div className="text-sm font-medium text-neutral-200">
                        {result.firstVerifiedAt
                          ? new Date(result.firstVerifiedAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Just Now"}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1">
                        First-time authentication recorded
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                      <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        Quality Certificate
                      </div>
                      <div className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        NABL 3rd-Party Lab Verified
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Meets 100% protein label claims
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-500/20">
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Verify Another Code
                    </button>

                    <Link
                      href="/shop"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Continue Shopping</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {result.status === "ALREADY_VERIFIED" && (
                <div className="bg-gradient-to-b from-amber-950/60 to-neutral-900 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Warning Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-8 pb-8 border-b border-amber-500/20">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
                      <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase mb-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Warning: Code Already Verified
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Duplicate Verification Detected!
                      </h2>
                      <p className="text-amber-200/90 text-sm mt-2 leading-relaxed">
                        This scratch code was already authenticated earlier. Each scratch code is strictly single-use only.
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-5 mb-8 space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2">
                      <span className="text-neutral-400">First Authenticated:</span>
                      <span className="text-amber-300 font-semibold">
                        {result.firstVerifiedAt
                          ? new Date(result.firstVerifiedAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Previously"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2">
                      <span className="text-neutral-400">Total Verification Attempts:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {result.verificationCount || 2} times
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Product / Batch:</span>
                      <span className="text-white font-medium">
                        {result.product?.title || "Front-Runner"} ({result.batchNumber || "N/A"})
                      </span>
                    </div>
                  </div>

                  {/* Safety Advice */}
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-8 leading-relaxed">
                    <span className="font-bold text-red-200 block mb-1">
                      ⚠️ Did you scratch this product for the first time just now?
                    </span>
                    If this package was sealed when you opened it and this is your first attempt, this product may be a <strong>counterfeit or duplicate</strong>. Please refrain from consuming and report the seller immediately.
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-500/20">
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Re-enter Code
                    </button>

                    <Link
                      href="/contact?subject=Counterfeit+Report"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Report Fake Product</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {result.status === "INVALID" && (
                <div className="bg-gradient-to-b from-red-950/60 to-neutral-900 border-2 border-red-500/70 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-8 pb-8 border-b border-red-500/20">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                      <XCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase mb-2">
                        Invalid Product Code
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Authentication Failed
                      </h2>
                      <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
                        {result.message}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-400 space-y-2 mb-8">
                    <div className="font-semibold text-neutral-300">Troubleshooting Tips:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Check that you scratched all digits completely.</li>
                      <li>Front-Runner codes never contain ambiguous letters like &apos;O&apos; or &apos;I&apos;.</li>
                      <li>Double check the characters and retry.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-red-500/20">
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>

                    <Link
                      href="/contact"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Contact Support</span>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default function AuthenticatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-20 bg-neutral-950 text-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthenticateForm />
    </Suspense>
  );
}
