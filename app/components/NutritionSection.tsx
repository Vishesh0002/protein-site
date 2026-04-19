"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, Dna, Wheat, Droplet, Ban } from "lucide-react";

const macros = [
  {
    id: "protein",
    value: 24,
    unit: "g",
    label: "Premium Protein",
    desc: "Ultra-filtered whey isolate for maximum bioavailability and muscle synthesis.",
    max: 30,
    icon: Activity,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    type: "hero",
  },
  {
    id: "calories",
    value: 142,
    unit: "",
    label: "Calories",
    desc: "Ultra-lean macro profile.",
    max: 200,
    icon: Flame,
    colSpan: "col-span-1",
    type: "ring",
  },
  {
    id: "leucine",
    value: 2.8,
    unit: "g",
    label: "Leucine",
    desc: "Triggers growth.",
    max: 5,
    icon: Dna,
    colSpan: "col-span-1",
    type: "ring",
  },
  {
    id: "carbs",
    value: 7,
    unit: "g",
    label: "Total Carbs",
    desc: "Low glycemic impact.",
    max: 30,
    icon: Wheat,
    colSpan: "col-span-1",
    type: "bar",
  },
  {
    id: "fat",
    value: 2,
    unit: "g",
    label: "Total Fat",
    desc: "Trace healthy fats.",
    max: 30,
    icon: Droplet,
    colSpan: "col-span-1",
    type: "bar",
  },
  {
    id: "sugar",
    value: 0,
    unit: "g",
    label: "Zero Sugar",
    desc: "No artificial spikes or crashes.",
    max: 30,
    icon: Ban,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    type: "bar",
  },
];

function BentoCard({ macro, index }: { macro: typeof macros[0]; index: number }) {
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

  const Icon = macro.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 transition-colors hover:border-orange-500/30 ${macro.colSpan}`}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 text-white/50 transition-colors group-hover:text-orange-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] border border-white/5 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-colors">
            <Icon size={18} />
          </div>
          <span className="font-bold tracking-wide uppercase text-sm">{macro.label}</span>
        </div>

        {/* Visualizer & Value */}
        <div className="flex-grow flex flex-col justify-center">
          
          {macro.type === "hero" && (
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter">
                  {macro.value}
                </span>
                <span className="text-3xl font-bold text-orange-500">{macro.unit}</span>
              </div>
              {/* Giant abstract progress bar for hero */}
              <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(macro.value / macro.max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {macro.type === "ring" && (
            <div className="flex items-center gap-6 mt-4">
              <div className="relative h-20 w-20 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/5" />
                  <motion.circle
                    cx="50" cy="50" r="40" stroke="url(#gradient-ring)" strokeWidth="8" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: macro.value / macro.max }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{macro.value}</span>
                <span className="text-lg font-medium text-orange-500">{macro.unit}</span>
              </div>
            </div>
          )}

          {macro.type === "bar" && (
            <div className="mt-4">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">{macro.value}</span>
                <span className="text-lg font-medium text-orange-500">{macro.unit}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(macro.value / macro.max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed font-medium">
          {macro.desc}
        </p>

      </div>
    </motion.div>
  );
}

export default function NutritionSection() {
  return (
    <section id="nutrition" className="relative scroll-mt-24 bg-[#050505] py-32 overflow-hidden border-t border-white/5">
      {/* Background Subtle Glow */}
      <div className="absolute left-0 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-400">
              Nutrition Facts
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              What&apos;s Inside <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Every Scoop.
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-lg text-white/50 leading-relaxed md:text-right"
          >
            No proprietary blends. No hidden fillers. Just fully transparent, science-backed nutrition engineered for peak performance.
          </motion.p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {macros.map((macro, i) => (
            <BentoCard key={macro.id} macro={macro} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}