'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  x: string;
  y: string;
  rotate: number;
}

function StatCard({ label, value, color, x, y, rotate }: StatCardProps) {
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

const steps = [
  { id: '01', title: "LOG IN", desc: "Open your bank's portal", bg: "#1DB954" },
  { id: '02', title: "EXPORT", desc: "Grab that CSV statement", bg: "#FF00FE" },
  { id: '03', title: "REVEAL", desc: "See your money story", bg: "#FF5733" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
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
            <Link 
              href="/upload"
              className="group relative px-12 py-6 bg-black text-white text-2xl font-black rounded-full overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10 flex items-center gap-3">
                DROP YOUR STATEMENT
              </span>
              <div className="absolute inset-0 bg-[#1DB954] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Floating Mini-Stats Mockups */}
        <StatCard label="Top Category" value="Uber" color="#FF5733" x="-20%" y="-20%" rotate={-12} />
        <StatCard label="Big Spender" value="$2,400" color="#1DB954" x="25%" y="15%" rotate={8} />
      </section>

      {/* Tutorial Section */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#1DB954] text-5xl md:text-6xl font-black mb-12 uppercase italic text-center">
            How to get your wrap:
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 0.98, rotate: -1 }}
                className="relative aspect-square p-8 flex flex-col justify-end overflow-hidden group cursor-pointer"
                style={{ backgroundColor: step.bg }}
              >
                <span className="absolute top-4 right-4 text-black/20 text-9xl font-black leading-none select-none">
                  {step.id}
                </span>
                <div className="relative z-10">
                  <h3 className="text-black text-5xl md:text-6xl font-black leading-none mb-2">
                    {step.title}
                  </h3>
                  <p className="text-black text-xl font-bold uppercase tracking-tight">
                    {step.desc}
                  </p>
                </div>
                {/* Repetitive Text Overlay (The Spotify Artist Style) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity flex flex-wrap gap-2 p-2">
                  {Array(20).fill(step.title).map((t, idx) => (
                    <span key={idx} className="text-black font-black text-xl">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 text-center">
        <p className="text-white/60 text-sm mb-2">
          🔒 Your data never leaves your browser
        </p>
        <p className="text-white/40 text-xs">
          We don&apos;t store or transmit any information. Everything is processed locally.
        </p>
      </footer>
    </>
  );
}
