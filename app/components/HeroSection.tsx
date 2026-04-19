"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { MousePointer2, Play, Sparkles, Star, X } from "lucide-react";

interface Flavor {
  name: string;
  color: string;
  gradient: string;
  image: string;
}

const flavors: Flavor[] = [
  {
    name: "Chocolate Fudge",
    color: "#7c3f1e",
    gradient: "from-amber-900 to-orange-950",
    image: "/image/1.png",
  },
  {
    name: "Vanilla Dream",
    color: "#c8a46e",
    gradient: "from-amber-200 to-yellow-100",
    image: "/image/2.png",
  },
  {
    name: "Strawberry Burst",
    color: "#c0392b",
    gradient: "from-red-500 to-pink-500",
    image: "/image/3.png",
  },
  {
    name: "Mint Chip",
    color: "#1a7a4a",
    gradient: "from-emerald-500 to-teal-500",
    image: "/image/4.png",
  },
];

function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.03 }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

const heroGlowColor = "rgba(124, 63, 30, 0.28)";

export default function HeroSection({ onAddToCart }: { onAddToCart: (flavor: string) => void }) {
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSelectedFlavor((current) => (current + 1) % flavors.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden pt-20">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${heroGlowColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, ${heroGlowColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 80%, ${heroGlowColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${heroGlowColor} 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
      </div>

      <motion.div style={{ opacity, scale }} className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid min-h-[80vh] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2"
            >
              <Sparkles size={14} className="text-orange-400" />
              <span className="text-xs font-medium text-orange-400">New 2025 Formula</span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              <AnimatedText text="FUEL" />
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                <AnimatedText text="YOUR" />
              </span>
              <br />
              <AnimatedText text="POWER" />
            </h1>

           

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap items-center gap-4"
            >
              

              <button
                onClick={() => setIsVideoPlaying(true)}
                className="flex items-center gap-3 text-white/60 transition-colors hover:text-white"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white/40">
                  <Play size={16} fill="currentColor" />
                </span>
                <span className="text-sm font-medium">Watch Video</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              {[
                { value: "25g", label: "Protein" },
                { value: "0g", label: "Sugar" },
                { value: "120", label: "Calories" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-white/30">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div
            className="relative flex items-center justify-center perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-20 rounded-full blur-3xl"
                animate={{ backgroundColor: heroGlowColor }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10">
                <div className="relative mx-auto h-[560px] w-[420px] max-w-[82vw]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFlavor}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={flavors[selectedFlavor].image}
                        alt={`${flavors[selectedFlavor].name} PROMAX container`}
                        fill
                        className="object-contain drop-shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-16 top-20 rounded-2xl border border-white/10 bg-[#141414]/90 p-4 backdrop-blur-xl"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="text-orange-400" fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-white">4.9</span>
                  </div>
                  <div className="mt-1 text-[10px] text-white/40">12,847 reviews</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-12 bottom-32 rounded-2xl border border-white/10 bg-[#141414]/90 p-4 backdrop-blur-xl"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="text-2xl font-black text-orange-400">97%</div>
                  <div className="text-[10px] text-white/40">Would rebuy</div>
                </motion.div>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute -bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3">
              {flavors.map((flavor, index) => (
                <div
                  key={flavor.name}
                  className="h-1.5 w-10 overflow-hidden rounded-full bg-white/12"
                >
                  <motion.div
                    className="h-full rounded-full bg-white/85"
                    animate={{
                      width: selectedFlavor === index ? "100%" : "30%",
                      opacity: selectedFlavor === index ? 1 : 0.35,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-white/30">Scroll</span>
          <MousePointer2 size={16} className="text-white/30" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative aspect-video w-full max-w-4xl rounded-2xl bg-[#141414]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Play size={64} className="mx-auto mb-4 text-white/20" />
                  <p className="text-white/40">Video placeholder</p>
                </div>
              </div>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
