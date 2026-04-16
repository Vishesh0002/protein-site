"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Shield, Dumbbell } from "lucide-react";

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter text-orange-500"
        >
          FRONT RUNNER HEALTH <span className="text-white"> CARE</span>
        </motion.div>
        <motion.ul 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex gap-8 font-medium text-neutral-300"
        >
          <li className="hover:text-orange-500 cursor-pointer transition-colors">Shop</li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">Science</li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">About</li>
        </motion.ul>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors"
        >
          Cart (0)
        </motion.button>
      </nav>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Text Content */}
        <div className="lg:w-1/2 z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 text-orange-500 font-semibold uppercase tracking-widest text-sm">
              <Zap size={16} /> Premium Isolate Blend
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              FUEL YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                POTENTIAL
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-neutral-400 max-w-md mt-4">
              Clinically dosed, zero sugar, and fast-absorbing whey isolate to help you build muscle and recover faster than ever.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex gap-4 mt-8">
              <button className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105">
                Shop Now <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="lg:w-1/2 mt-16 lg:mt-0 relative"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/30 blur-[100px] rounded-full z-0"></div>
          
          <motion.img 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=2070&auto=format&fit=crop" 
            alt="Protein Tub Placeholder" 
            className="relative z-10 w-full max-w-lg mx-auto rounded-3xl shadow-2xl object-cover h-[500px]"
          />
        </motion.div>
      </main>

      {/* Benefits Section */}
      <section className="bg-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Benefit 1 */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-2">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-2xl font-bold">25g Pure Protein</h3>
              <p className="text-neutral-400">Micro-filtered whey isolate for maximum absorption and zero bloating.</p>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold">Zero Added Sugar</h3>
              <p className="text-neutral-400">Naturally flavored and sweetened with stevia. No artificial junk.</p>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-2">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-bold">Third-Party Tested</h3>
              <p className="text-neutral-400">Every batch is tested for banned substances and protein accuracy.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}