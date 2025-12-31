'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { CategoryStat } from '@/types/analysis';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/formatters';
import { Category } from '@/types/transaction';
import { AIInsights } from '@/types/insights';
import { PieChart, Zap } from 'lucide-react';

interface CategoryBreakdownSlideProps {
  categories: CategoryStat[];
  aiInsights?: AIInsights['categories'];
}

export function CategoryBreakdownSlide({ categories, aiInsights }: CategoryBreakdownSlideProps) {
  const top5 = categories.slice(0, 5);
  const topCategory = top5[0];
  const headline = (aiInsights?.headline || 'THE BREAKDOWN').toUpperCase();

  const roast = (aiInsights?.roast || "YOUR MONEY HAS PRIORITIES. WE'RE NOT JUDGING... MUCH 👀").toUpperCase();

  return (
    <BaseSlide gradient="bg-black" effects={[]}>
      {/* KINETIC BACKGROUND SPLIT */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '-20%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF5733] z-0"
        style={{ clipPath: 'polygon(0 0, 80% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col h-full w-full px-6 sm:px-6 py-12">
        
        {/* STICKER HEADER */}
        <motion.div
          initial={{ rotate: -5, scale: 0 }}
          animate={{ rotate: -2, scale: 1 }}
          className="bg-[#1DB954] text-black px-6 py-2 mb-8 self-start shadow-[6px_6px_0px_0px_white] border-2 border-black"
        >
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <PieChart size={28} /> {headline}
          </h2>
        </motion.div>

        {/* HERO CATEGORY - THE "BIG PERCENT" */}
        {topCategory && (
          <div className="relative mb-10 -mx-6 sm:mx-0">
            <div className="flex items-start gap-4 px-6 sm:px-0">
               {/* GIANT PERCENTAGE */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[22vw] md:text-[15vw] font-black leading-none text-white tracking-tighter"
              >
                {Math.round(topCategory.percentage)}%
              </motion.div>

              {/* TILTED CATEGORY LABEL */}
              <motion.div
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 12 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="bg-white text-black p-4 mt-4 shadow-[4px_4px_0px_0px_#FF00FE] border-2 border-black"
              >
                <span className="text-4xl md:text-6xl">{CATEGORY_EMOJIS[topCategory.category as Category]}</span>
                <p className="text-xl md:text-2xl font-black uppercase italic leading-none mt-2">
                    {CATEGORY_LABELS[topCategory.category as Category]}
                </p>
              </motion.div>
            </div>
            
            <motion.p 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="h-3 bg-[#FF00FE] mt-[-20px] md:mt-[-30px] mb-4"
            />
            
            <p className="text-white text-2xl md:text-4xl font-black italic uppercase tracking-tighter">
                TOTAL: {formatCurrency(topCategory.totalAmount)}
            </p>
          </div>
        )}

        {/* OTHER CATEGORIES - HORIZONTAL TAPE LAYOUT */}
        <div className="mt-auto overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
                {top5.slice(1, 5).map((cat, index) => (
                    <motion.div
                        key={cat.category}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="bg-black border-4 border-white p-6 w-48 md:w-64 flex flex-col"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">{CATEGORY_EMOJIS[cat.category as Category]}</span>
                            <h3 className="text-xl font-black text-white uppercase truncate flex-1">
                                {CATEGORY_LABELS[cat.category as Category]}
                            </h3>
                        </div>
                        <div className="mt-auto space-y-2">
                            <p className="text-lg md:text-xl font-black text-white">
                                {formatCurrency(cat.totalAmount)}
                            </p>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                {cat.count} {cat.count === 1 ? 'TRANSFER' : 'TRANSFERS'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* ROAST BANNER */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          className="mt-8 bg-[#FF00FE] p-5 rotate-1 flex items-start gap-4 shadow-[8px_8px_0px_0px_black]"
        >
          <Zap size={32} className="text-black fill-black flex-shrink-0" />
          <p className="text-black font-black text-sm md:text-lg leading-tight italic">
            "{roast}"
          </p>
        </motion.div>
      </div>

      {/* REPETITIVE TEXT MARQUEE */}
      <div className="absolute top-1/4 -right-10 opacity-10 pointer-events-none rotate-90">
        <p className="text-white font-black text-8xl leading-none whitespace-nowrap">
          VIBE_CHECK_VIBE_CHECK_VIBE_CHECK
        </p>
      </div>
    </BaseSlide>
  );
}