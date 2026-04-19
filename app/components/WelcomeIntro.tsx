"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";

interface WelcomeIntroProps {
  /** How long the intro stays on screen in ms (default 3200) */
  duration?: number;
}

export default function WelcomeIntro({ duration = 3200 }: WelcomeIntroProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Lock scroll while intro is visible
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-neutral-950"
        >
          {/* Background glows */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.7 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/25 blur-[120px]"
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0.5 }}
            transition={{ duration: 2.6, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-[100px]"
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Sliding curtain exit layers */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute inset-x-0 top-0 h-1/2 bg-neutral-950"
          />
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-neutral-950"
          />

          {/* Content */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="relative z-10 flex w-full max-w-[92vw] flex-col items-center px-4 text-center sm:max-w-2xl md:max-w-4xl"
          >
            {/* Brand mark */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.4)]"
            >
              <Dumbbell size={28} strokeWidth={2.5} />
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-5 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-orange-400 sm:gap-3 sm:tracking-[0.35em] sm:text-xs md:text-sm md:tracking-[0.4em]"
            >
              <span className="h-px w-5 bg-orange-400/60 sm:w-6 md:w-10" />
              Welcome to the world of
              <span className="h-px w-5 bg-orange-400/60 sm:w-6 md:w-10" />
            </motion.div>

            {/* Headline */}
            <div className="w-full overflow-hidden py-2">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="whitespace-nowrap bg-gradient-to-r from-orange-300 via-orange-500 to-amber-400 bg-clip-text text-[clamp(1.75rem,7vw,6rem)] font-black leading-[0.95] tracking-tight text-transparent"
              >
                BODY BUILDING
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="mt-6 max-w-md text-sm text-white/50 md:text-base"
            >
              Premium fuel for those who chase greatness.
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-10 h-[2px] w-48 overflow-hidden rounded-full bg-white/10 md:w-64"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: duration / 1000 - 1.3, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-orange-400 to-amber-400"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
