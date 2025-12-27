'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatAsCurrency?: boolean;
}

export function AnimatedNumber({
  value,
  duration = 1.5,
  formatAsCurrency = false,
}: AnimatedNumberProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
  });

  const display = useTransform(spring, (current) => {
    if (formatAsCurrency) {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(current));
    }
    return Math.round(current).toLocaleString('en-NG');
  });

  useEffect(() => {
    if (isClient) {
      spring.set(value);
    }
  }, [spring, value, isClient]);

  if (!isClient) {
    return (
      <span>
        {formatAsCurrency
          ? new Intl.NumberFormat('en-NG', {
              style: 'currency',
              currency: 'NGN',
              minimumFractionDigits: 0,
            }).format(0)
          : '0'}
      </span>
    );
  }

  return <motion.span>{display}</motion.span>;
}
