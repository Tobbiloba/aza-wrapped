'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

const steps = [
  { id: '01', title: "LOG IN", desc: "Open your bank's portal", bg: "#1DB954" },
  { id: '02', title: "EXPORT", desc: "Grab that CSV statement", bg: "#FF00FE" },
  { id: '03', title: "REVEAL", desc: "See your money story", bg: "#FF5733" },
];

export default function TutorialPage() {
  return (
    <section className="bg-black min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[#1DB954] text-5xl md:text-6xl font-black mb-4 uppercase italic">
            How to get your wrap:
          </h2>
          <Link 
            href="/upload"
            className="inline-block text-white/60 hover:text-[#1DB954] font-bold text-lg underline transition-colors"
          >
            ← Back to upload
          </Link>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6">
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

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto border-4 border-white/20">
            <p className="text-white text-xl md:text-2xl font-black mb-4">
              💡 Quick Tip
            </p>
            <p className="text-white/80 text-lg font-medium">
              Make sure to export your statement as CSV format for the best results. 
              Most banks allow you to download statements from their app or web portal.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



