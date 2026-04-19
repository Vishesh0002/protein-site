"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

// Helper component to animate text by words and characters without breaking mid-word
function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  
  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-4 md:gap-x-6 ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, charIndex) => {
            // Calculate a staggered delay based on overall character position
            const delay = (wordIndex * 5 + charIndex) * 0.04;
            return (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay, ease: "easeOut" }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  // Mouse tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Subtle rotation values based on mouse position
  const rotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    // Reset position smoothly when mouse leaves
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }} // Required for 3D effect
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-[center_30%] opacity-100 md:object-center"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/image/7676735-uhd_4096_2160_25fps.mp4" type="video/mp4" />
        </video>

        {/* Overlays for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015]" />
      </div>

      {/* Centered Interactable Content Container */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center"
      >
        {/* Title */}
        <h1
          className="mb-6 text-6xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl"
          style={{ transform: "translateZ(40px)" }} // Pops out slightly during tilt
        >
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex flex-col">
             <AnimatedText text="FUEL YOUR" />
             <AnimatedText text="POWER & PASSION" />
          </span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ transform: "translateZ(20px)" }} // Pops out a bit less than the title
          className="mb-8 max-w-2xl text-lg font-medium text-white/80 md:text-xl lg:text-2xl"
        >
          Experience the next generation of premium performance. Push your limits and achieve your ultimate goals with our newly formulated health care solutions.
        </motion.p>

        {/* Contact Us Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ transform: "translateZ(30px)" }}
        >
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-base font-medium text-white/80 transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
          >
            <Mail size={18} />
            Contact Us
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}