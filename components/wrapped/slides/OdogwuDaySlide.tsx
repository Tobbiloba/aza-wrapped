'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Transaction } from '@/types/transaction';
import { formatDate, formatCurrencyCompact } from '@/lib/utils/formatters';
import { generateOdogwuDayInsight } from '@/lib/analysis/insights';
import { AIInsights } from '@/types/insights';
import { AlertTriangle, DollarSign } from 'lucide-react';

interface OdogwuDaySlideProps {
  date: Date;
  amount: number;
  transactionCount: number;
  transactions: Transaction[];
  aiInsights?: AIInsights['odogwuDay'];
}

export function OdogwuDaySlide({
  date,
  amount,
  transactionCount,
  transactions,
  aiInsights,
}: OdogwuDaySlideProps) {
  const fallbackInsight = generateOdogwuDayInsight(amount, transactionCount, transactions, date);
  const headline = (aiInsights?.title || fallbackInsight.headline).toUpperCase();
  const roast = (aiInsights?.roast || fallbackInsight.roast).toUpperCase();

  const averagePerTransaction = transactionCount > 0 ? amount / transactionCount : 0;
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const fullDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <BaseSlide gradient="bg-black" effects={[]}>
      {/* KINETIC BACKGROUND - DIAGONAL SPLIT */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF00FE] z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0% 85%)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6">

        {/* TILTED "WARNING" LABEL */}
        <motion.div
          initial={{ rotate: 10, scale: 0 }}
          animate={{ rotate: 3, scale: 1 }}
          className="bg-black text-white px-6 py-2 mb-12 self-start ml-4 shadow-[8px_8px_0px_0px_#FF5733] flex items-center gap-2 border-4 border-white"
        >
          <AlertTriangle size={28} className="text-[#FF5733]" />
          <h2 className="text-xl md:text-3xl font-black italic tracking-tighter">
            MOST EXPENSIVE DAY
          </h2>
        </motion.div>

        {/* MASSIVE DATE DISPLAY - THE "HIT RECORD" */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center mb-6"
        >
            <p className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter" style={{ WebkitTextStroke: '2px white' }}>
                {dayName}
            </p>
            <p className="text-2xl md:text-3xl font-black text-black/80 tracking-widest mt-2 bg-white/80 px-4 inline-block">
                {fullDate}
            </p>
        </motion.div>

        {/* HUGE AMOUNT - THE "SCORE" */}
        <div className="relative mb-12">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[18vw] md:text-[15vw] font-black leading-none text-white tracking-tighter"
            >
                <AnimatedNumber value={amount} formatAsCurrency />
            </motion.div>
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="h-4 bg-[#1DB954] -mt-6 md:-mt-10"
            />
        </div>

        {/* STATS "ALBUM TRACKS" */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full mb-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-black border-4 border-[#FF5733] p-6 text-center rotate-[-2deg]"
          >
            <p className="text-4xl md:text-6xl font-black text-[#FF5733] leading-none mb-2">
              {transactionCount}
            </p>
            <p className="text-xs md:text-sm text-white font-black uppercase tracking-widest">
              Transactions
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="bg-[#1DB954] border-4 border-black p-6 text-center rotate-[2deg]"
          >
            <p className="text-3xl md:text-5xl font-black text-black leading-none mb-2">
              {formatCurrencyCompact(Math.round(averagePerTransaction))}
            </p>
            <p className="text-xs md:text-sm text-black font-black uppercase tracking-widest">
              Avg. Spend
            </p>
          </motion.div>
        </div>

        {/* ROAST BANNER */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          className="w-full max-w-3xl bg-white p-6 rotate-1 text-center border-4 border-black"
        >
          <p className="text-black font-black text-xl md:text-3xl leading-tight italic uppercase">
            "{headline}: {roast}"
          </p>
        </motion.div>

      </div>
      
      {/* GLITCHY DOLLAR SIGN BACKGROUND */}
      <div className="absolute bottom-0 right-0 p-4 opacity-20 pointer-events-none">
        <DollarSign size={300} className="text-white" />
      </div>
    </BaseSlide>
  );
}