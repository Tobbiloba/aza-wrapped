// components/Hero.tsx
"use client";
import { motion } from "framer-motion";
import { ArrowRight, UploadCloud } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col justify-center items-center">
      {/* Background Kinetic Blocks */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF00FE] z-0 origin-bottom"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }}
      />

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <span className="bg-black text-[#1DB954] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
            2025 wrapped
          </span>
          <h1 className="mt-6 text-[12vw] md:text-[8vw] font-black leading-none text-white uppercase tracking-tighter">
            YOUR MONEY <br />
            <span className="text-black italic">UNLEASHED.</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <button className="group relative px-12 py-6 bg-black text-white text-2xl font-black rounded-full overflow-hidden hover:scale-105 transition-transform">
            <span className="relative z-10 flex items-center gap-3">
              DROP YOUR STATEMENT <UploadCloud />
            </span>
            <div className="absolute inset-0 bg-[#1DB954] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Floating Mini-Stats Mockups */}
      <StatCard label="Top Category" value="Uber" color="#FF5733" x="-20%" y="-20%" rotate={-12} />
      <StatCard label="Big Spender" value="$2,400" color="#1DB954" x="25%" y="15%" rotate={8} />
    </section>
  );
}

function StatCard({ label, value, color, x, y, rotate }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="hidden lg:block absolute p-6 rounded-2xl shadow-2xl border-4 border-black"
      style={{ backgroundColor: color, left: '50%', top: '50%', x, y, rotate }}
    >
      <p className="text-black font-bold uppercase text-xs">{label}</p>
      <p className="text-black font-black text-4xl">{value}</p>
    </motion.div>
  );
}

