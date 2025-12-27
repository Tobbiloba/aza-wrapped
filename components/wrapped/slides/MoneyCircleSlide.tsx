'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { RecipientStat } from '@/types/analysis';
import { formatCurrency } from '@/lib/utils/formatters';
import { generateMoneyCircleOverall } from '@/lib/analysis/insights';
import { AIInsights } from '@/types/insights';
import { Users, Send, ArrowUpRight } from 'lucide-react';

interface MoneyCircleSlideProps {
  recipients: RecipientStat[];
  totalRecipients: number;
  totalSent: number;
  aiInsights?: AIInsights['moneyCircle'];
}

export function MoneyCircleSlide({
  recipients,
  totalRecipients,
  totalSent,
  aiInsights,
}: MoneyCircleSlideProps) {
  const top5 = recipients.slice(0, 5);
  const fallbackOverallInsight = generateMoneyCircleOverall(totalRecipients, totalSent);
  const overallInsight = (aiInsights?.overall || fallbackOverallInsight).toUpperCase();

  if (!top5 || top5.length === 0) {
    return (
      <BaseSlide gradient="bg-black">
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-9xl mb-8">🧍</motion.div>
          <h2 className="text-5xl font-black text-[#FF5733] italic uppercase leading-none mb-4">SOLO RUNS ONLY.</h2>
          <p className="text-white text-xl font-bold tracking-tighter uppercase">JUST YOU AND THE POS MACHINES! 😌</p>
        </div>
      </BaseSlide>
    );
  }

  return (
    <BaseSlide gradient="bg-black" slideTitle="Money Circle" effects={[]}>
      {/* KINETIC BG ELEMENT */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '30%' }}
        className="absolute inset-0 bg-[#FF00FE] z-0"
        style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col h-full w-full px-6 py-12">
        
        {/* STICKER HEADER */}
        <motion.div
          initial={{ rotate: 5, scale: 0 }}
          animate={{ rotate: 2, scale: 1 }}
          className="bg-[#1DB954] text-black px-6 py-2 mb-12 self-start shadow-[6px_6px_0px_0px_white] border-2 border-black"
        >
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Users size={28} /> THE INNER CIRCLE
          </h2>
        </motion.div>

        {/* RECIPIENTS LIST */}
        <div className="flex-1 space-y-2 -mx-20 sm:mx-0 px-6 sm:px-0">
          {top5.map((recipient, index) => {
            const aiRecipient = aiInsights?.recipients?.find(
              (r) => r.name.toLowerCase() === recipient.name.toLowerCase()
            ) || aiInsights?.recipients?.[index];
            
            const customTitle = aiRecipient?.title?.toUpperCase();
            
            return (
              <motion.div
                key={recipient.name}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative group flex items-center py-4 border-b border-white/10"
              >
                {/* MASSIVE BACKGROUND RANK */}
                <span className="absolute -left-4 text-7xl md:text-8xl font-black italic text-white/5 select-none group-hover:text-[#1DB954]/20 transition-colors">
                  0{index + 1}
                </span>

                <div className="relative z-10 flex flex-1 items-end justify-between ml-8">
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter truncate">
                      {recipient.name}
                    </h3>
                    {customTitle && (
                      <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 tracking-widest inline-block mt-1">
                        {customTitle}
                      </span>
                    )}
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1 text-[#1DB954] font-black italic text-xl md:text-3xl">
                      {formatCurrency(recipient.totalAmount)}
                      <ArrowUpRight size={20} />
                    </div>
                    <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                      {recipient.count} TRANSFERS
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* OVERALL INSIGHT BOX */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-black border-4 border-[#1DB954] p-5 rotate-[-1deg] shadow-[8px_8px_0px_0px_#FF5733]"
        >
          <div className="flex items-start gap-3">
            <Send size={24} className="text-[#FF5733] mt-1" />
            <p className="text-white font-black text-sm md:text-lg leading-tight italic">
              "{overallInsight}"
            </p>
          </div>
        </motion.div>
      </div>

      {/* BACKGROUND MARQUEE */}
      <div className="absolute top-1/2 -right-20 transform -rotate-90 opacity-10 pointer-events-none">
        <p className="text-white font-black text-[12vw] leading-none whitespace-nowrap">
          MONEY_CIRCLE_2025_MONEY_CIRCLE_2025
        </p>
      </div>
    </BaseSlide>
  );
}