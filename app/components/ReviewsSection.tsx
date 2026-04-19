"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Marcus T.",
    role: "Competitive Bodybuilder",
    avatar: "M",
    rating: 5,
    text: "Best protein I've ever used. Mixes clean, tastes incredible, and I've seen noticeable gains in just 6 weeks.",
    verified: true,
  },
  {
    name: "Priya S.",
    role: "CrossFit Athlete",
    avatar: "P",
    rating: 5,
    text: "No bloating, no junk. Just clean protein that actually works. Nothing comes close to this formula.",
    verified: true,
  },
  {
    name: "Jake L.",
    role: "Marathon Runner",
    avatar: "J",
    rating: 5,
    text: "25g with only 120 calories — the macros are absolutely insane for the price. Never looking back.",
    verified: true,
  },
  {
    name: "Aisha K.",
    role: "Olympic Weightlifter",
    avatar: "A",
    rating: 5,
    text: "NSF certification was non-negotiable for me. PROMAX ticks every box and tastes great too.",
    verified: true,
  },
];

function ReviewCard({ review, index }: { review: typeof reviews[0]; index: number }) {
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 md:p-10 transition-colors hover:border-orange-500/30 shadow-2xl flex flex-col justify-between h-full"
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.08), transparent 40%)`,
        }}
      />

      {/* Decorative Background Quote */}
      <Quote 
        size={120} 
        className="absolute -top-6 -right-6 text-white/[0.03] rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" 
      />

      <div className="relative z-10">
        <div className="mb-6 flex gap-1">
          {[...Array(review.rating)].map((_, j) => (
            <Star key={j} size={16} className="text-orange-500" fill="currentColor" />
          ))}
        </div>
        
        <p className="mb-10 text-lg md:text-xl text-white/70 leading-relaxed font-medium">
          "{review.text}"
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-4 mt-auto">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-xl font-bold text-orange-400 transition-colors group-hover:bg-orange-500/20 group-hover:border-orange-500/50">
          {review.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">{review.name}</span>
            {review.verified && (
              <CheckCircle size={16} className="text-orange-500" />
            )}
          </div>
          <div className="text-sm text-white/40 font-medium tracking-wide mt-0.5">
            {review.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="relative scroll-mt-24 py-32 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[500px] bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-400">
              Social Proof
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              Trusted by
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Real Athletes.
              </span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 md:text-right md:flex-col md:items-end md:gap-2"
          >
            <div className="text-6xl font-black text-white">4.9</div>
            <div>
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-orange-500" fill="currentColor" />
                ))}
              </div>
              <div className="text-sm font-medium text-white/40">Based on 12,847 reviews</div>
            </div>
          </motion.div>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}