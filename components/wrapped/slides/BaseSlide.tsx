'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { FloatingOrbs, PulseRings, MoneyRain } from '@/components/ui/AnimatedBackground';
import { Sparkles } from '@/components/ui/Particles';

interface BaseSlideProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
  effects?: ('orbs' | 'sparkles' | 'pulse' | 'money')[];
}

export function BaseSlide({
  children,
  gradient = 'bg-purple-600',
  className = '',
  effects = [],
}: BaseSlideProps) {

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        min-h-screen w-full flex flex-col items-center justify-center
        ${gradient}
        px-6 py-20 text-white text-center relative overflow-hidden
        ${className}
      `}
      style={{ fontFamily: 'var(--font-otilito), system-ui, sans-serif' }}
    >
      {/* Background effects - only if explicitly requested */}
      {effects.includes('orbs') && <FloatingOrbs />}
      {effects.includes('sparkles') && <Sparkles count={10} />}
      {effects.includes('pulse') && <PulseRings />}
      {effects.includes('money') && <MoneyRain count={6} />}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
        {children}
      </div>
    </motion.div>
  );
}

// Animated text components for slides
export function SlideLabel({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-base sm:text-lg uppercase tracking-[0.2em] font-semibold text-white/90 mb-6"
    >
      {children}
    </motion.p>
  );
}

export function SlideTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 leading-tight"
    >
      {children}
    </motion.h2>
  );
}

export function SlideValue({
  children,
  delay = 0.4,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none"
    >
      {children}
    </motion.div>
  );
}

export function SlideDescription({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-xl sm:text-2xl md:text-3xl text-white/95 max-w-2xl font-medium leading-relaxed"
    >
      {children}
    </motion.p>
  );
}

export function SlideEmoji({
  children,
  delay = 0.2,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="text-6xl sm:text-7xl mb-6"
    >
      {children}
    </motion.div>
  );
}
