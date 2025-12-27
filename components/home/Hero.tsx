'use client';

import { motion } from 'motion/react';

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
      style={{ fontFamily: 'var(--font-otilito), system-ui, sans-serif' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-8xl sm:text-9xl mb-8"
      >
        💰
      </motion.div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
        Aza Wrapped
      </h1>

      <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-4 font-medium">
        Your spending story, wrapped.
      </p>

      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Upload your bank statement and discover insights about your money habits,
        top merchants, spending patterns, and more.
      </p>
    </motion.div>
  );
}
