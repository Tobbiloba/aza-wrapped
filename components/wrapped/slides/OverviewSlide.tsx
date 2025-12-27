'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { formatCurrencyCompact } from '@/lib/utils/formatters';
import { AIInsights } from '@/types/insights';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface OverviewSlideProps {
  totalTransactions: number;
  totalCredits: number;
  totalDebits: number;
  days: number;
  aiInsights?: AIInsights['overview'];
}

export function OverviewSlide({
  totalTransactions,
  totalCredits,
  totalDebits,
  days,
  aiInsights,
}: OverviewSlideProps) {
  const netFlow = totalCredits - totalDebits;
  const isPositive = netFlow >= 0;

  const getWittyComment = () => {
    if (totalDebits > 3000000) return "ODOGWU! MOVING LIKE MONEY EPP 💰";
    if (totalDebits > 1000000) return "OVER A MILLI GONE. SAPA WAS GHOSTED 🔥";
    if (totalTransactions > 200) return "YOUR BANK APP IS YOUR MOST USED SOCIAL MEDIA 📱";
    if (isPositive) return "MONEY ENTER PASS WEY COMOT. LEVELS! 📈";
    return "MONEY WAKA, LIFE HAPPENED. WE MOVE! 💸";
  };

  const headline = (aiInsights?.headline || 'THE NUMBERS').toUpperCase();
  const reaction = (aiInsights?.reaction || getWittyComment()).toUpperCase();

  return (
    <BaseSlide gradient="bg-black" slideTitle="Overview" effects={[]}>
      {/* KINETIC BACKGROUND SPLIT */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '40%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF5733] z-0"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6">
        
        {/* TILTED STICKER HEADLINE */}
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: -3, scale: 1 }}
          className="bg-[#1DB954] text-black px-6 py-2 mb-12 self-start ml-4 shadow-[8px_8px_0px_0px_rgba(255,0,254,1)]"
        >
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter">
            {headline}
          </h2>
        </motion.div>

        {/* MASSIVE TRANSACTION COUNT */}
        <div className="relative mb-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[28vw] md:text-[20vw] font-black leading-none text-white tracking-tighter"
            >
                <AnimatedNumber value={totalTransactions} />
            </motion.div>
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-4 bg-[#FF00FE] -mt-8 md:-mt-12"
            />
        </div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl md:text-3xl font-black uppercase tracking-widest text-[#1DB954] mb-12"
        >
            Moves made in {days} days
        </motion.p>

        {/* AGGRESSIVE STAT BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 flex items-center justify-between border-b-8 border-r-8 border-[#1DB954]"
          >
            <div>
              <p className="text-black font-black uppercase text-xs">Total Inflow</p>
              <p className="text-3xl md:text-5xl font-black text-black tracking-tighter">
                {formatCurrencyCompact(totalCredits)}
              </p>
            </div>
            <TrendingUp size={48} className="text-[#1DB954]" />
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-black p-6 flex items-center justify-between border-4 border-white"
          >
            <div>
              <p className="text-[#FF00FE] font-black uppercase text-xs">Total Outflow</p>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {formatCurrencyCompact(totalDebits)}
              </p>
            </div>
            <TrendingDown size={48} className="text-[#FF00FE]" />
          </motion.div>
        </div>

        {/* REACTION QUOTE BOX */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
          className="w-full max-w-2xl bg-[#FF00FE] p-6 rotate-1 flex items-start gap-4"
        >
          <Zap size={32} className="text-black fill-black flex-shrink-0" />
          <p className="text-black font-black text-xl md:text-2xl leading-tight italic">
            "{reaction}"
          </p>
        </motion.div>
      </div>

      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 p-4 opacity-10">
        <p className="text-white font-black text-9xl leading-none select-none">DATA<br/>CRUNCH</p>
      </div>
    </BaseSlide>
  );
}