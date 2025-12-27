'use client';

import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  colors?: string[];
  children?: React.ReactNode;
}

// Animated gradient that slowly shifts
export function AnimatedGradient({ colors, children }: AnimatedBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      animate={{
        background: [
          `linear-gradient(45deg, ${colors?.[0] || '#7c3aed'}, ${colors?.[1] || '#ec4899'})`,
          `linear-gradient(90deg, ${colors?.[1] || '#ec4899'}, ${colors?.[2] || '#f59e0b'})`,
          `linear-gradient(135deg, ${colors?.[2] || '#f59e0b'}, ${colors?.[0] || '#7c3aed'})`,
          `linear-gradient(45deg, ${colors?.[0] || '#7c3aed'}, ${colors?.[1] || '#ec4899'})`,
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating orbs in background
export function FloatingOrbs() {
  const orbs = [
    { size: 300, x: '10%', y: '20%', color: 'rgba(147, 51, 234, 0.3)', duration: 20 },
    { size: 200, x: '80%', y: '60%', color: 'rgba(236, 72, 153, 0.3)', duration: 25 },
    { size: 250, x: '50%', y: '80%', color: 'rgba(245, 158, 11, 0.2)', duration: 22 },
    { size: 150, x: '20%', y: '70%', color: 'rgba(16, 185, 129, 0.2)', duration: 18 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Pulse ring effect
export function PulseRings({ color = 'rgba(255,255,255,0.2)' }: { color?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: color }}
          initial={{ width: 100, height: 100, opacity: 0.8 }}
          animate={{
            width: [100, 400],
            height: [100, 400],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Money falling animation
export function MoneyRain({ count = 15 }: { count?: number }) {
  const emojis = ['💰', '💵', '💸', '🤑', '₦'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: `${Math.random() * 100}%` }}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
}

// Glowing text effect
export function GlowText({
  children,
  className = '',
  color = '#fff',
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <motion.span
      className={className}
      animate={{
        textShadow: [
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
          `0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
