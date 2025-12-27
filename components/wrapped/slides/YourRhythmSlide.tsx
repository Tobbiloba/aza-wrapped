'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { formatCurrency } from '@/lib/utils/formatters';
import { generateRhythmInsight } from '@/lib/analysis/insights';
import { AIInsights } from '@/types/insights';
import { Clock, Sun, Moon, Sunrise, Sunset, Zap } from 'lucide-react';

interface YourRhythmSlideProps {
  timeOfDay: {
    morning: { count: number; amount: number };
    afternoon: { count: number; amount: number };
    evening: { count: number; amount: number };
    night: { count: number; amount: number };
  };
  weekendVsWeekday: {
    weekend: { count: number; amount: number };
    weekday: { count: number; amount: number };
  };
  aiInsights?: AIInsights['rhythm'];
}

const timeSlots = [
  { key: 'morning', label: 'MORNINGS', time: '6AM-12PM', icon: <Sunrise size={32} /> },
  { key: 'afternoon', label: 'AFTERNOONS', time: '12PM-6PM', icon: <Sun size={32} /> },
  { key: 'evening', label: 'EVENINGS', time: '6PM-10PM', icon: <Sunset size={32} /> },
  { key: 'night', label: 'LATE NIGHTS', time: '10PM-6AM', icon: <Moon size={32} /> },
] as const;

export function YourRhythmSlide({
  timeOfDay,
  weekendVsWeekday,
  aiInsights,
}: YourRhythmSlideProps) {
  const total = weekendVsWeekday.weekend.amount + weekendVsWeekday.weekday.amount;
  const weekendPercent = total > 0 ? (weekendVsWeekday.weekend.amount / total) * 100 : 0;
  const weekdayPercent = total > 0 ? (weekendVsWeekday.weekday.amount / total) * 100 : 0;

  const fallbackRhythmInsight = generateRhythmInsight(
    {
      morning: timeOfDay.morning.amount,
      afternoon: timeOfDay.afternoon.amount,
      evening: timeOfDay.evening.amount,
      night: timeOfDay.night.amount,
    },
    weekendPercent
  );

  const title = (aiInsights?.title || "YOUR FINANCIAL RHYTHM").toUpperCase();
  const description = (aiInsights?.description || fallbackRhythmInsight.description).toUpperCase();

  const sortedTimeSlots = timeSlots
    .map(slot => ({
      ...slot,
      amount: timeOfDay[slot.key].amount,
      data: timeOfDay[slot.key],
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <BaseSlide gradient="bg-black" slideTitle="Your Rhythm" effects={[]}>
      {/* KINETIC BACKGROUND SHAPE */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '30%' }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-[#FF5733] z-0"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col h-full w-full px-6 py-12">
        
        {/* STICKER HEADER */}
        <motion.div
          initial={{ rotate: -5, scale: 0 }}
          animate={{ rotate: -2, scale: 1 }}
          className="bg-[#1DB954] text-black px-6 py-2 mb-10 self-start shadow-[6px_6px_0px_0px_white] border-2 border-black"
        >
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Clock size={28} /> {title}
          </h2>
        </motion.div>

        {/* RANKED TIME SLOTS */}
        <div className="flex-1 space-y-2">
          {sortedTimeSlots.map((slot, index) => (
            <motion.div
              key={slot.key}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative group flex items-center py-4 border-b border-white/10"
            >
              {/* GHOST NUMBER */}
              <span className="absolute -left-4 text-7xl md:text-8xl font-black italic text-white/5 select-none group-hover:text-[#FF00FE]/20 transition-colors">
                0{index + 1}
              </span>

              <div className="relative z-10 flex flex-1 items-center justify-between ml-10">
                <div className="flex items-center gap-4">
                    <div className="text-[#FF00FE] group-hover:scale-110 transition-transform">
                        {slot.icon}
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
                            {slot.label}
                        </h3>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                            {slot.time}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                  <p className="text-xl md:text-3xl font-black text-[#1DB954] italic">
                    {formatCurrency(slot.amount)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WEEKEND VS WEEKDAY CLASH */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-4 border-b-8 border-r-8 border-[#FF00FE]"
          >
            <p className="text-black font-black text-xs uppercase tracking-widest mb-1">WEEKDAYS</p>
            <p className="text-2xl md:text-4xl font-black text-black leading-none">{Math.round(weekdayPercent)}%</p>
            <p className="text-[10px] font-bold text-black/60 mt-1 uppercase">THE GRIND</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-black border-4 border-[#1DB954] p-4 rotate-2 shadow-[6px_6px_0px_0px_white]"
          >
            <p className="text-[#1DB954] font-black text-xs uppercase tracking-widest mb-1">WEEKENDS</p>
            <p className="text-2xl md:text-4xl font-black text-white leading-none">{Math.round(weekendPercent)}%</p>
            <p className="text-[10px] font-bold text-white/60 mt-1 uppercase">THE CHOP LIFE</p>
          </motion.div>
        </div>

        {/* ROAST BANNER */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 bg-[#FF00FE] p-5 flex items-start gap-4 border-4 border-black"
        >
          <Zap size={24} className="text-black fill-black flex-shrink-0 mt-1" />
          <p className="text-black font-black text-sm md:text-lg leading-tight italic uppercase">
            "{description}"
          </p>
        </motion.div>
      </div>

      {/* DECORATIVE MARQUEE */}
      <div className="absolute top-0 right-0 p-4 opacity-10 rotate-90 origin-top-right">
        <p className="text-white font-black text-6xl whitespace-nowrap">TICK_TOCK_MONEY_CLOCK</p>
      </div>
    </BaseSlide>
  );
}