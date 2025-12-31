'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { WrappedAnalysis } from '@/types/analysis';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';
import { AIInsights } from '@/types/insights';
import { Share2, RotateCcw, Zap, Star } from 'lucide-react';

interface SummarySlideProps {
  analysis: WrappedAnalysis;
  aiInsights?: AIInsights['summary'];
}

export function SummarySlide({ analysis, aiInsights }: SummarySlideProps) {
  const topMerchant = analysis.merchants.top[0];
  const topRecipient = analysis.recipients.top[0];

  const headline = (aiInsights?.headline || 'YEAR IN REVIEW').toUpperCase();
  const caption = (aiInsights?.caption || "MONEY COME, MONEY GO. AT LEAST WE HAD FUN!").toUpperCase();

  return (
    <BaseSlide gradient="bg-black" effects={[]}>
      {/* KINETIC BACKGROUND SPLIT */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '20%' }}
        className="absolute inset-0 bg-[#1DB954] z-0"
        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 py-10">
        
        {/* POSTER WRAPPER */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-black border-4 border-white w-full max-w-md overflow-hidden shadow-[20px_20px_0px_0px_#FF00FE]"
        >
          {/* POSTER HEADER */}
          <div className="bg-white p-4 text-center border-b-4 border-black">
            <h2 className="text-4xl font-black text-black tracking-tighter leading-none italic">
              {headline}
            </h2>
            <p className="text-xs font-black text-black/60 uppercase tracking-[0.3em] mt-2">
              {analysis.period.end.getFullYear()} EDITION
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* HERO STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-white/20 p-4 relative group overflow-hidden">
                <p className="text-[10px] font-black text-[#1DB954] uppercase mb-1">TOTAL SPENT</p>
                <p className="text-2xl font-black text-white italic">
                   {formatCurrency(analysis.overview.totalDebits).replace('NGN', '₦')}
                </p>
              </div>
              <div className="border-2 border-white/20 p-4">
                <p className="text-[10px] font-black text-[#FF00FE] uppercase mb-1">TRANSACTIONS</p>
                <p className="text-2xl font-black text-white italic">
                   {analysis.overview.totalTransactions}
                </p>
              </div>
            </div>

            {/* THE "HIT LIST" */}
            <div className="space-y-4">
              {topMerchant && (
                <div className="flex items-center gap-4">
                  <div className="bg-white text-black p-2 font-black text-xs rotate-[-2deg]">SHOP</div>
                  <p className="text-xl font-black text-white uppercase tracking-tighter truncate border-b border-white/40 flex-1">
                    {topMerchant.name}
                  </p>
                </div>
              )}
              {topRecipient && (
                <div className="flex items-center gap-4">
                  <div className="bg-[#1DB954] text-black p-2 font-black text-xs rotate-[3deg]">VIBE</div>
                  <p className="text-xl font-black text-white uppercase tracking-tighter truncate border-b border-white/40 flex-1">
                    {topRecipient.name}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="bg-[#FF00FE] text-black p-2 font-black text-xs rotate-[-1deg]">TYPE</div>
                <p className="text-xl font-black text-white uppercase tracking-tighter truncate border-b border-white/40 flex-1">
                   {analysis.personality.emoji} {analysis.personality.archetype}
                </p>
              </div>
            </div>

            {/* CAPTION BOX */}
            <div className="bg-white/5 border-l-4 border-[#1DB954] p-4 italic">
                <p className="text-white font-bold text-sm leading-tight uppercase">
                    "{caption}"
                </p>
            </div>

            {/* BRANDING FOOTER */}
            <div className="flex justify-between items-center pt-4 opacity-50">
                <div className="flex gap-1">
                    <Star size={12} fill="white" />
                    <Star size={12} fill="white" />
                    <Star size={12} fill="white" />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    AZA_WRAPPED_CORE
                </p>
            </div>
          </div>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md mt-10 grid grid-cols-2 gap-4"
        >
          <button 
            onClick={() => window.print()} // Placeholder for share logic
            className="flex items-center justify-center gap-2 py-4 bg-[#1DB954] text-black font-black rounded-sm uppercase italic tracking-tighter hover:scale-105 transition-transform"
          >
            <Share2 size={20} /> Share
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-4 bg-white text-black font-black rounded-sm uppercase italic tracking-tighter hover:scale-105 transition-transform"
          >
            <RotateCcw size={20} /> Replay
          </Link>
        </motion.div>
      </div>

      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-0 p-8 opacity-10">
        <Zap size={100} className="text-white" />
      </div>
    </BaseSlide>
  );
}