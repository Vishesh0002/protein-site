"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, Dumbbell, FlaskConical, Shield, Zap } from "lucide-react";

const items = [
  { icon: Shield, text: "Third-Party Tested" },
  { icon: Award, text: "FSSAI Certified" },
  { icon: Zap, text: "Fast Absorption" },
  { icon: CheckCircle, text: "Zero Sugar" },
  { icon: FlaskConical, text: "Clinically Dosed" },
  { icon: Dumbbell, text: "24g Protein" },
];

export default function Marquee() {
  // Quadruple the array to ensure the marquee never runs out of content on ultra-wide screens.
  // Animating to -50% shifts exactly half the total width, creating a perfect, imperceptible loop.
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative flex overflow-hidden border-y border-white/10 bg-[#050505] py-5 select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex min-w-full shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {duplicatedItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div 
              key={i} 
              className="group flex cursor-default items-center gap-4 transition-all duration-300"
            >
              <Icon 
                size={16} 
                className="text-orange-500/40 transition-colors duration-300 group-hover:text-orange-500" 
              />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/40 transition-colors duration-300 group-hover:text-orange-400">
                {item.text}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}