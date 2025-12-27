'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export function UploadButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="text-center mt-12"
    >
      <Link
        href="/upload"
        className="group relative inline-block px-12 py-6 bg-purple-600 text-white text-2xl font-black rounded-full overflow-hidden hover:scale-105 transition-transform"
      >
        <span className="relative z-10 flex items-center gap-3">
          DROP YOUR STATEMENT
        </span>
        <div className="absolute inset-0 bg-green-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
      </Link>
    </motion.div>
  );
}



