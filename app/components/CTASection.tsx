"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Zap } from "lucide-react";

export default function CTASection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Interactive Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] p-10 py-20 md:p-24 shadow-2xl transition-colors hover:border-orange-500/30 flex flex-col items-center text-center"
          >
            {/* Dynamic Mouse Spotlight Glow */}
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300"
              style={{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.1), transparent 40%)`,
              }}
            />

            {/* Static Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.05),transparent_50%)]" />
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black/50 to-transparent" />

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8 flex items-center justify-center"
              >
                <div className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-orange-400 uppercase">
                  <Zap size={14} className="fill-orange-500/50" />
                  The Front Runner Standard
                </div>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl"
              >
                Fuel your ambition. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  Zero compromises.
                </span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 max-w-2xl text-lg text-white/50 leading-relaxed"
              >
                Clean ingredients, backed by science, engineered to help you push past your limits. This is where your potential meets our performance.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 w-full max-w-2xl"
              >
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Truck size={18} className="text-orange-500" />
                  Free shipping over ₹5000
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <ShieldCheck size={18} className="text-orange-500" />
                  30-day money-back guarantee
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}