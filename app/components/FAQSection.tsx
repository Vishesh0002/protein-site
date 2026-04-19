"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "When is the best time to take PROMAX?",
    a: "Within 30 minutes post-workout is optimal. You can also use it as a high-protein snack between meals or first thing in the morning to kickstart muscle protein synthesis.",
  },
  {
    q: "Is PROMAX suitable for vegetarians?",
    a: "Yes. Our whey isolate is derived from grass-fed milk, making it entirely suitable for vegetarians. However, because it contains dairy, it is not suitable for vegans.",
  },
  {
    q: "How many servings are in each tub?",
    a: "Each tub contains exactly 30 servings (960g total). One standard serving is a 32g scoop, which we recommend mixing with 250-300ml of cold water or your preferred milk.",
  },
  {
    q: "Does PROMAX contain any banned substances?",
    a: "Absolutely not. PROMAX is rigorously NSF Certified for Sport. This means every single batch is independently tested and verified to be free of over 270 banned substances.",
  },
];

function FAQItem({ 
  faq, 
  isOpen, 
  onClick, 
  index 
}: { 
  faq: typeof faqs[0]; 
  isOpen: boolean; 
  onClick: () => void;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative overflow-hidden rounded-[24px] border transition-colors duration-300 ${
        isOpen ? "border-orange-500/50 bg-orange-500/[0.02]" : "border-white/10 bg-white/[0.02] hover:border-orange-500/30"
      }`}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.08), transparent 40%)`,
        }}
      />

      <button
        onClick={onClick}
        className="relative z-10 flex w-full items-center justify-between gap-6 p-6 text-left md:p-8"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? "text-orange-500" : "text-white group-hover:text-orange-100"}`}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen ? "border-orange-500 bg-orange-500 text-black" : "border-white/10 bg-white/[0.05] text-white group-hover:border-orange-500/50 group-hover:text-orange-400"
          }`}
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="px-6 pb-8 pt-2 md:px-8 md:pt-0">
              <p className="text-white/60 leading-relaxed text-base md:text-lg max-w-2xl">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first item

  return (
    <section id="faq" className="relative scroll-mt-24 bg-[#050505] py-32 overflow-hidden border-t border-white/5">
      {/* Background Subtle Glow */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Sticky Header */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                  Support
                </span>
                <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl mb-6">
                  Got <br />
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    Questions?
                  </span>
                </h2>
                <p className="text-lg text-white/50 leading-relaxed max-w-md mb-10">
                  Everything you need to know about the product, usage, and our guarantee. Can't find the answer you're looking for?
                </p>

                <a 
                  href="#contact" 
                  className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white transition-all hover:border-orange-500/50 hover:bg-orange-500/10"
                >
                  <MessageCircle size={18} className="text-orange-500" />
                  <span>Chat with our team</span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <FAQItem 
                key={i} 
                faq={faq} 
                index={i}
                isOpen={openIndex === i} 
                onClick={() => setOpenIndex(openIndex === i ? null : i)} 
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}