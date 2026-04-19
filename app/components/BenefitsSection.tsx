"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Dumbbell,
  FlaskConical,
  Shield,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: Dumbbell,
    title: "24g Pure Protein",
    desc: "Micro-filtered whey isolate for maximum absorption and zero bloating. Fuel your recovery instantly.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: CheckCircle,
    title: "Zero Added Sugar",
    desc: "Naturally flavored and sweetened with stevia. No artificial fillers, no insulin spikes.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Shield,
    title: "Third-Party Tested",
    desc: "Every single batch is independently tested for banned substances and protein accuracy.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Fast Absorption",
    desc: "Hydrolysed peptides bypass standard digestion to hit your muscles in under 30 minutes.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: FlaskConical,
    title: "Clinically Dosed",
    desc: "A Leucine-optimised formula engineered to trigger maximal muscle protein synthesis.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Award,
    title: "FSSAI Certified",
    desc: "Backed by FSSAI certification, meeting stringent safety, hygiene, and quality regulations for trusted consumption.",
    color: "from-cyan-400 to-blue-500",
  },
];

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
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

  const Icon = benefit.icon;

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
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 md:p-10 transition-colors hover:border-white/20 shadow-2xl flex flex-col h-full"
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* Large Decorative Background Icon */}
      <Icon 
        size={140} 
        strokeWidth={1}
        className="absolute -bottom-6 -right-6 text-white/[0.02] transition-transform duration-500 group-hover:-translate-y-4 group-hover:-translate-x-4 group-hover:scale-110" 
      />

      <div className="relative z-10">
        <div className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.color} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
          <Icon size={28} className="text-white drop-shadow-sm" strokeWidth={2.5} />
        </div>

        <h3 className="mb-4 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-orange-100">
          {benefit.title}
        </h3>
        
        <p className="text-base leading-relaxed text-white/50 font-medium">
          {benefit.desc}
        </p>
      </div>

      {/* Animated Bottom Border */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.color}`}
        initial={{ width: "0%" }}
        animate={{ width: isHovering ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}

export default function BenefitsSection() {
  return (
    <section id="benefits" className="relative scroll-mt-24 bg-[#050505] py-32 overflow-hidden border-t border-white/5">
      {/* Background Subtle Glow */}
      <div className="absolute right-0 top-1/4 h-[600px] w-[600px] translate-x-1/3 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-400">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              Built Different, <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                By Design.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {benefits.map((benefit, i) => (
            <BenefitCard key={i} benefit={benefit} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}