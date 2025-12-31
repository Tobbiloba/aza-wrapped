'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { MerchantStat } from '@/types/analysis';
import { formatCurrency } from '@/lib/utils/formatters';
import { getMerchantRelationship, generateSpotsOverallInsight } from '@/lib/analysis/insights';
import { AIInsights } from '@/types/insights';
import { Crown, Star, Flame } from 'lucide-react';

interface YourSpotsSlideProps {
  merchants: MerchantStat[];
  aiInsights?: AIInsights['yourSpots'];
}

export function YourSpotsSlide({ merchants, aiInsights }: YourSpotsSlideProps) {
  const top4 = merchants.slice(0, 4);
  const topMerchant = top4[0];

  if (!topMerchant) {
    return (
      <BaseSlide gradient="bg-black">
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-9xl mb-8">🤷</motion.div>
          <h2 className="text-5xl font-black text-[#FF00FE] italic uppercase leading-none mb-4">NO POS FOUND.</h2>
          <p className="text-white text-xl font-bold tracking-tighter uppercase">YOU JUST DEY TRANSFER MONEY ANYHOW! 😂</p>
        </div>
      </BaseSlide>
    );
  }

  const getMerchantInsight = (merchantName: string, index: number) => {
    const aiMerchant = aiInsights?.merchants?.find(
      (m) => m.name.toLowerCase() === merchantName.toLowerCase()
    ) || aiInsights?.merchants?.[index];

    if (aiMerchant) return { status: aiMerchant.relationship, roast: aiMerchant.roast };
    return getMerchantRelationship(merchants[index]);
  };

  const mainInsight = getMerchantInsight(topMerchant.name, 0);

  return (
    <BaseSlide gradient="bg-black" effects={[]}>
      {/* KINETIC BG SHAPE */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '-30%' }}
        className="absolute inset-0 bg-[#1DB954] z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col h-full w-full px-6 py-12">
        
        {/* STICKER HEADER */}
        <motion.div
          initial={{ rotate: -5, scale: 0 }}
          animate={{ rotate: -2, scale: 1 }}
          className="bg-white text-black px-6 py-2 mb-10 self-start shadow-[6px_6px_0px_0px_#FF00FE] border-2 border-black"
        >
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
            YOUR MAIN SPOTS
          </h2>
        </motion.div>

        {/* TOP MERCHANT HERO */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 text-[#FF00FE] mb-2">
            <Crown fill="currentColor" size={32} />
            <span className="font-black uppercase tracking-widest text-sm">UNDISPUTED CHAMPION</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-4">
            {topMerchant.name}
          </h1>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="bg-[#FF5733] text-black px-4 py-2 rotate-1">
              <p className="text-4xl font-black leading-none">
                {formatCurrency(topMerchant.totalAmount)}
              </p>
            </div>
            <p className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {topMerchant.count} VISITS
            </p>
          </div>

          {mainInsight?.roast && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-6 text-xl md:text-2xl text-white font-bold italic uppercase leading-tight max-w-xl border-l-4 border-[#1DB954] pl-4"
            >
              "{mainInsight.roast.toUpperCase()}"
            </motion.p>
          )}
        </motion.div>

        {/* RUNNERS UP LIST */}
        <div className="mt-auto space-y-3 w-full max-w-2xl">
          <p className="text-white/50 font-black uppercase tracking-[0.3em] text-xs mb-4">THE RUNNERS UP</p>
          {top4.slice(1).map((merchant, index) => {
            const colors = ['border-[#FF00FE]', 'border-[#1DB954]', 'border-[#FF5733]'];
            return (
              <motion.div
                key={merchant.name}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className={`flex items-center justify-between border-l-8 ${colors[index % 3]} bg-white/5 p-4 transition-colors group`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-white/20 italic">#{index + 2}</span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-none group-hover:text-[#1DB954]">
                      {merchant.name}
                    </h3>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">
                        {merchant.count} SESSIONS
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-white">
                        {formatCurrency(merchant.totalAmount)}
                    </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* BACKGROUND ACCENT */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Star size={200} className="text-white rotate-12" />
      </div>
    </BaseSlide>
  );
}