'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
  type?: 'burst' | 'rain' | 'fireworks' | 'money';
}

export function Confetti({ trigger = true, type = 'burst' }: ConfettiProps) {
  const fireBurst = useCallback(() => {
    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
    });
  }, []);

  const fireRain = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0 },
        colors: ['#9333ea', '#ec4899', '#f59e0b'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const fireFireworks = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#9333ea', '#ec4899', '#f59e0b'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    }, 250);
  }, []);

  const fireMoney = useCallback(() => {
    // Money/naira themed
    const scalar = 2;
    const money = confetti.shapeFromText({ text: '💰', scalar });
    const naira = confetti.shapeFromText({ text: '₦', scalar });

    const defaults = {
      spread: 180,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      shapes: [money, naira],
      scalar,
    };

    confetti({
      ...defaults,
      particleCount: 30,
      origin: { x: 0.2, y: 0.3 },
    });

    confetti({
      ...defaults,
      particleCount: 30,
      origin: { x: 0.8, y: 0.3 },
    });

    confetti({
      ...defaults,
      particleCount: 20,
      origin: { x: 0.5, y: 0.2 },
    });
  }, []);

  useEffect(() => {
    if (!trigger) return;

    const timer = setTimeout(() => {
      switch (type) {
        case 'rain':
          fireRain();
          break;
        case 'fireworks':
          fireFireworks();
          break;
        case 'money':
          fireMoney();
          break;
        case 'burst':
        default:
          fireBurst();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [trigger, type, fireBurst, fireRain, fireFireworks, fireMoney]);

  return null;
}

// Hook for triggering confetti programmatically
export function useConfetti() {
  const burst = useCallback((options?: confetti.Options) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
      ...options,
    });
  }, []);

  const sides = useCallback(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }, []);

  return { burst, sides };
}
