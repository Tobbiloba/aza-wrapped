'use client';

import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { WrappedAnalysis } from '@/types/analysis';
import { generatePersonalityRoast } from '@/lib/analysis/insights';
import { ARCHETYPE_INFO } from '@/lib/utils/constants';
import { AIInsights } from '@/types/insights';
import { User, Sparkles, ShieldCheck } from 'lucide-react';

interface PersonalitySlideProps {
  analysis: WrappedAnalysis;
  aiInsights?: AIInsights['personality'];
}

export function PersonalitySlide({ analysis, aiInsights }: PersonalitySlideProps) {
  const { archetype, emoji } = analysis.personality;
  const fallbackRoast = generatePersonalityRoast(archetype, analysis);
  const info = ARCHETYPE_INFO[archetype];

  const displayArchetype = (aiInsights?.archetype || archetype).toUpperCase();
  const displayEmoji = aiInsights?.emoji || emoji || info?.emoji;
  // Convert all text to uppercase for aggressive style
  const opener = (aiInsights?.opener || fallbackRoast.opener).toUpperCase();
  const roastBody = (aiInsights?.roast || fallbackRoast.body).toUpperCase();
  const prediction = (aiInsights?.prediction || fallbackRoast.prediction).toUpperCase();
  const traits = aiInsights?.traits || fallbackRoast.traits;

  return (
    <BaseSlide gradient="bg-black" slideTitle="Personality Reveal" effects={[]}>
      {/* KINETIC BACKGROUND SHAPE */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '-20%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF00FE] z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col h-full w-full px-6 py-6 sm:py-12 items-center overflow-y-auto">
        
        {/* STICKER HEADER */}
        <motion.div
          initial={{ rotate: 5, scale: 0 }}
          animate={{ rotate: 2, scale: 1 }}
          className="bg-[#1DB954] text-black px-6 py-2 mb-6 self-start shadow-[6px_6px_0px_0px_white] border-2 border-black"
        >
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <User size={24} /> MONEY VIBE CHECK
          </h2>
        </motion.div>

        {/* MAIN CHARACTER REVEAL */}
        <div className="text-center mb-4 sm:mb-8 relative">
            {/* MASSIVE EMOJI */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                className="text-[100px] sm:text-[150px] md:text-[180px] leading-none mb-2 sm:mb-4 drop-shadow-[8px_8px_0px_rgba(0,0,0,0.5)]"
            >
                <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                >
                {displayEmoji}
                </motion.div>
            </motion.div>

            {/* ARCHETYPE NAME */}
            <motion.h1
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]"
                style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #FF5733' }}
            >
                {displayArchetype}
            </motion.h1>
        </div>

        {/* ROAST "ZINE SNIPPET" BOX */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -2 }}
          animate={{ opacity: 1, x: 0, rotate: -1 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-4 sm:p-5 max-w-xl mb-4 sm:mb-6 md:mb-8 border-4 border-black shadow-[8px_8px_0px_0px_#FF5733]"
        >
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-[#FF5733]" size={20} />
                <p className="text-xl sm:text-2xl font-black uppercase italic text-black leading-none">
                    {opener}
                </p>
            </div>
            <p className="text-base sm:text-lg leading-tight text-black font-bold uppercase italic">
                "{roastBody}"
            </p>
        </motion.div>

        {/* TRAIT "TAPE STRIPS" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 max-w-xl"
        >
          {traits.map((trait, index) => (
            <motion.div
              key={trait.label}
              initial={{ opacity: 0, scale: 0.5, rotate: index % 2 === 0 ? -5 : 5 }}
              animate={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? -2 : 2 }}
              transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
              className="bg-black border-2 border-white px-4 py-1 shadow-[4px_4px_0px_0px_#1DB954]"
            >
              <span className="text-sm sm:text-base font-black uppercase text-white flex items-center gap-2">
                <span>{trait.emoji}</span> {trait.label.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* PREDICTION "CRYSTAL BALL" SLIP */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-black border-4 border-[#1DB954] p-3 sm:p-4 max-w-xl w-full flex items-start gap-3 sm:gap-4 rotate-1 shadow-[6px_6px_0px_0px_white] mb-4 sm:mb-0"
        >
            <ShieldCheck size={32} className="text-[#1DB954] flex-shrink-0" />
            <div>
                <p className="text-[#1DB954] text-xs font-black uppercase tracking-widest mb-1">
                    2025 FORECAST
                </p>
                <p className="text-white text-base sm:text-lg font-bold uppercase italic leading-tight">
                    {prediction}
                </p>
            </div>
        </motion.div>
      </div>

      {/* DECORATIVE BG TEXT */}
      <div className="absolute bottom-0 left-0 p-4 opacity-10 pointer-events-none overflow-hidden w-full">
        <p className="text-white font-black text-6xl leading-none whitespace-nowrap">
          CHARACTER_UNLOCKED_
        </p>
      </div>
    </BaseSlide>
  );
}