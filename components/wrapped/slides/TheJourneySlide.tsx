'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { MonthStat } from '@/types/analysis';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils/formatters';
import { generateJourneyInsight } from '@/lib/analysis/insights';
import { AIInsights } from '@/types/insights';
import { TrendingUp, Crown, MapPin } from 'lucide-react';

interface TheJourneySlideProps {
  months: MonthStat[];
  peakMonth: MonthStat | null;
  aiInsights?: AIInsights['journey'];
}

export function TheJourneySlide({ months, peakMonth, aiInsights }: TheJourneySlideProps) {
  const maxAmount = Math.max(...months.map((m) => m.debits), 1);
  
  const fallbackJourneyInsight = peakMonth
    ? generateJourneyInsight(
        { monthName: peakMonth.monthName, amount: peakMonth.debits, count: peakMonth.count },
        months.map(m => ({ monthName: m.monthName, debits: m.debits }))
      )
    : 'YOUR SPENDING JOURNEY CONTINUES...';

  const journeyInsight = (aiInsights?.peakMonthRoast || fallbackJourneyInsight).toUpperCase();
  const headline = "MONTHLY MADNESS";

  return (
    <BaseSlide gradient="bg-black" effects={[]}>
      {/* KINETIC BACKGROUND SHAPE */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '40%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF00FE] z-0"
        style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col h-full w-full px-4 py-8 md:px-6 md:py-12">
        
        {/* STICKER HEADER */}
        <motion.div
          initial={{ rotate: 3, scale: 0 }}
          animate={{ rotate: -2, scale: 1 }}
          className="bg-white text-black px-6 py-2 mb-8 self-start shadow-[6px_6px_0px_0px_#1DB954] border-2 border-black"
        >
          <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <TrendingUp size={28} /> {headline}
          </h2>
        </motion.div>

        {/* THE EQUALIZER CHART */}
        <div className="w-full max-w-2xl mx-auto mb-8 flex-1 flex flex-col justify-end">
          <div className="flex items-end justify-between gap-2 h-64 md:h-80 pb-6 border-b-4 border-white">
            {months.map((month, index) => {
              const heightRatio = month.debits / maxAmount;
              // Ensure a minimum height so zero/low months are still visible markers
              const heightPercent = Math.max(heightRatio * 100, 5); 
              const isPeak = peakMonth && month.month === peakMonth.month && month.year === peakMonth.year;

              return (
                <div key={`${month.year}-${month.month}`} className="flex-1 flex flex-col justify-end items-center group relative">
                  
                  {/* Amount Label Floating Above */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`text-[10px] md:text-xs font-black mb-2 whitespace-nowrap ${isPeak ? 'text-[#FF00FE]' : 'text-white/60'}`}
                  >
                    {formatCurrencyCompact(month.debits)}
                  </motion.div>

                  {/* The Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6, type: 'spring', damping: 15 }}
                    className={`
                      relative w-full max-w-[60px] min-w-[20px] rounded-t-sm
                      ${isPeak ? 'bg-[#FF5733] border-x-2 border-t-2 border-white shadow-[0px_0px_20px_#FF5733]' : 'bg-white/20 group-hover:bg-white/40 transition-colors'}
                    `}
                  >
                    {isPeak && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1, type: 'spring' }}
                        className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 text-[#1DB954] drop-shadow-[2px_2px_0px_black]"
                      >
                        <Crown size={40} strokeWidth={3} fill="#1DB954" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Month Label Below */}
                  <div className={`text-[10px] md:text-sm font-black uppercase mt-3 truncate w-full text-center ${isPeak ? 'text-white' : 'text-white/50'}`}>
                    {month.monthName.slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PEAK MONTH ROAST BANNER */}
        {peakMonth && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="mt-auto mx-auto w-full max-w-xl bg-black border-4 border-[#FF00FE] p-4 md:p-6 rotate-1 shadow-[8px_8px_0px_0px_white] flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-[#FF00FE]" />
                <h3 className="text-white font-black uppercase text-lg md:text-2xl italic">
                PEAK MAYHEM: {peakMonth.monthName.toUpperCase()}
                </h3>
            </div>
            <p className="text-[#1DB954] font-black text-2xl md:text-4xl leading-none mb-3">
              {formatCurrency(peakMonth.debits)}
            </p>
            <p className="text-white font-bold text-sm md:text-base uppercase leading-tight italic">
              "{journeyInsight}"
            </p>
          </motion.div>
        )}
      </div>
        
      {/* DECORATIVE MARQUEE */}
      <div className="absolute bottom-20 left-0 w-full opacity-10 pointer-events-none overflow-hidden">
        <p className="text-white font-black text-8xl leading-none whitespace-nowrap animate-marquee">
          SPENDING_SPREE_SPENDING_SPREE_
        </p>
      </div>
    </BaseSlide>
  );
}