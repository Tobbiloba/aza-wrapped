// 'use client';

// import { motion } from 'motion/react';
// import { BaseSlide } from './BaseSlide';
// import { formatDate } from '@/lib/utils/formatters';
// import { AIInsights } from '@/types/insights';

// interface IntroSlideProps {
//   periodStart: Date;
//   periodEnd: Date;
//   accountName: string;
//   aiInsights?: AIInsights['intro'];
// }

// export function IntroSlide({ periodStart, periodEnd, accountName, aiInsights }: IntroSlideProps) {
//   const firstName = accountName.split(' ')[0] || 'Oga';

//   // Use AI insights if available, otherwise fallback
//   const greeting = aiInsights?.greeting || `Thanks for an amazing year, ${firstName}!`;
//   const tagline = aiInsights?.tagline || 'Here\'s your money story';

//   const year = periodEnd.getFullYear();
//   const yearStr = year.toString();

//   // Calculate months
//   const monthDiff = (periodEnd.getFullYear() - periodStart.getFullYear()) * 12 + 
//                     (periodEnd.getMonth() - periodStart.getMonth()) + 1;

//   return (
//     <BaseSlide gradient="bg-purple-600" slideTitle="Aza Wrapped Intro" effects={[]}>
//       {/* Decorative Floating Objects */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Large Circles */}
//         <motion.div
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 0.1 }}
//           transition={{ delay: 1, duration: 1 }}
//           className="absolute top-20 left-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/30"
//         />
//         <motion.div
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 0.1 }}
//           transition={{ delay: 1.3, duration: 1 }}
//           className="absolute bottom-32 right-16 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/30"
//         />
        
//         {/* Money Icons */}
//         <motion.div
//           initial={{ opacity: 0, y: -20, rotate: -15 }}
//           animate={{ 
//             opacity: [0.3, 0.5, 0.3],
//             y: [0, -10, 0],
//             rotate: [-15, 15, -15]
//           }}
//           transition={{ delay: 1.5, duration: 3, repeat: Infinity }}
//           className="absolute top-32 right-20 text-4xl sm:text-5xl"
//         >
//           💰
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: -20, rotate: 15 }}
//           animate={{ 
//             opacity: [0.3, 0.5, 0.3],
//             y: [0, -10, 0],
//             rotate: [15, -15, 15]
//           }}
//           transition={{ delay: 1.7, duration: 3.5, repeat: Infinity }}
//           className="absolute bottom-40 left-16 text-3xl sm:text-4xl"
//         >
//           💸
//         </motion.div>
        
//         {/* Stars */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ 
//             opacity: [0.4, 0.7, 0.4],
//             scale: [1, 1.2, 1],
//             rotate: [0, 180, 360]
//           }}
//           transition={{ delay: 1.9, duration: 4, repeat: Infinity }}
//           className="absolute top-1/3 left-1/4 text-2xl sm:text-3xl"
//         >
//           ✨
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ 
//             opacity: [0.4, 0.7, 0.4],
//             scale: [1, 1.2, 1],
//             rotate: [0, -180, -360]
//           }}
//           transition={{ delay: 2.1, duration: 4.5, repeat: Infinity }}
//           className="absolute bottom-1/3 right-1/4 text-2xl sm:text-3xl"
//         >
//           ⭐
//         </motion.div>
        
//         {/* Geometric Shapes */}
//         <motion.div
//           initial={{ opacity: 0, rotate: 0 }}
//           animate={{ 
//             opacity: [0.2, 0.4, 0.2],
//             rotate: 360
//           }}
//           transition={{ delay: 2, duration: 20, repeat: Infinity, ease: 'linear' }}
//           className="absolute top-1/4 right-1/3 w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/20 transform rotate-45"
//         />
//         <motion.div
//           initial={{ opacity: 0, rotate: 0 }}
//           animate={{ 
//             opacity: [0.2, 0.4, 0.2],
//             rotate: -360
//           }}
//           transition={{ delay: 2.2, duration: 25, repeat: Infinity, ease: 'linear' }}
//           className="absolute bottom-1/4 left-1/3 w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/20"
//         />
//       </div>

//       {/* Top Message */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="mb-8 relative z-10"
//       >
//         <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90">
//           {greeting}
//         </p>
//       </motion.div>

//       {/* Large Year Display */}
//       <motion.div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ type: 'spring', stiffness: 150, delay: 0.4 }}
//         className="relative mb-16 z-10"
//       >
//         {/* Decorative elements around year */}
//         <motion.div
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 0.3 }}
//           transition={{ delay: 0.8 }}
//           className="absolute -left-8 sm:-left-12 top-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl"
//         >
//           💳
//         </motion.div>
//         <motion.div
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 0.3 }}
//           transition={{ delay: 1 }}
//           className="absolute -right-8 sm:-right-12 top-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl"
//         >
//           📊
//         </motion.div>
        
//         <div className="text-[140px] sm:text-[200px] md:text-[280px] lg:text-[320px] font-black leading-none tracking-tight">
//           {yearStr.split('').map((digit, i) => (
//             <motion.span
//               key={i}
//               initial={{ opacity: 0, y: 100, rotateX: -90 }}
//               animate={{ opacity: 1, y: 0, rotateX: 0 }}
//               transition={{ 
//                 delay: 0.5 + i * 0.15, 
//                 type: 'spring', 
//                 stiffness: 150,
//                 damping: 12
//               }}
//               className="inline-block transform-gpu"
//             >
//               {digit}
//             </motion.span>
//           ))}
//         </div>
//       </motion.div>

//       {/* "Wrapped" text */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
//         className="mb-12 relative z-10"
//       >
//         <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
//           Wrapped
//         </h1>
//       </motion.div>

//       {/* Tagline */}
//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.4 }}
//         className="text-2xl sm:text-3xl md:text-4xl font-medium mb-12 text-white/90 relative z-10"
//       >
//         {tagline}
//       </motion.p>

//       {/* Period Info */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.6 }}
//         className="text-center relative z-10"
//       >
//         <div className="relative inline-block">
//           {/* Decorative lines */}
//           <motion.div
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ delay: 1.8, duration: 0.5 }}
//             className="absolute -left-8 sm:-left-12 top-1/2 w-6 sm:w-8 h-0.5 bg-white/40"
//           />
//           <motion.div
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ delay: 1.8, duration: 0.5 }}
//             className="absolute -right-8 sm:-right-12 top-1/2 w-6 sm:w-8 h-0.5 bg-white/40"
//           />
          
//           <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-medium">
//             {formatDate(periodStart)} - {formatDate(periodEnd)}
//           </p>
//         </div>
//         <p className="text-sm sm:text-base md:text-lg text-white/60 mt-2 uppercase tracking-widest">
//           {monthDiff} {monthDiff === 1 ? 'Month' : 'Months'} of Transactions
//         </p>
        
//         {/* Small decorative icons */}
//         <div className="flex justify-center gap-4 mt-4">
//           <motion.span
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 0.5, scale: 1 }}
//             transition={{ delay: 2 }}
//             className="text-xl"
//           >
//             📈
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 0.5, scale: 1 }}
//             transition={{ delay: 2.1 }}
//             className="text-xl"
//           >
//             💼
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 0.5, scale: 1 }}
//             transition={{ delay: 2.2 }}
//             className="text-xl"
//           >
//             🎯
//           </motion.span>
//         </div>
//       </motion.div>
//     </BaseSlide>
//   );
// }








































'use client';

import { motion } from 'framer-motion'; // Reverting to standard for consistency, or keep your 'motion/react'
import { BaseSlide } from './BaseSlide';
import { formatDate } from '@/lib/utils/formatters';
import { AIInsights } from '@/types/insights';

interface IntroSlideProps {
  periodStart: Date;
  periodEnd: Date;
  accountName: string;
  aiInsights?: AIInsights['intro'];
}

export function IntroSlide({ periodStart, periodEnd, accountName, aiInsights }: IntroSlideProps) {
  const firstName = accountName.split(' ')[0] || 'Oga';
  const greeting = aiInsights?.greeting || `THANKS FOR AN AMAZING YEAR, ${firstName.toUpperCase()}!`;
  const tagline = aiInsights?.tagline || "HERE'S YOUR MONEY STORY";
  const yearStr = periodEnd.getFullYear().toString();

  const monthDiff = (periodEnd.getFullYear() - periodStart.getFullYear()) * 12 + 
                    (periodEnd.getMonth() - periodStart.getMonth()) + 1;

  return (
    <BaseSlide gradient="bg-black" effects={[]}>
      {/* KINETIC BACKGROUND ELEMENT */}
      <motion.div
        initial={{ x: '-100%', rotate: -10 }}
        animate={{ x: '-20%', rotate: -5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#FF00FE] z-0 origin-bottom-left"
        style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        
        {/* TOP STICKER GREETING */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: -3 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className="bg-[#1DB954] text-black px-6 py-2 mb-8"
        >
          <p className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">
            {greeting}
          </p>
        </motion.div>

        {/* MASSIVE KINETIC YEAR */}
        <div className="relative mb-4 flex">
          {yearStr.split('').map((digit, i) => (
            <motion.span
              key={i}
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.4 + (i * 0.1), 
                type: 'spring', 
                stiffness: 120, 
                damping: 10 
              }}
              className="text-[25vw] md:text-[20vw] font-black leading-none tracking-tighter text-white inline-block"
              style={{ 
                textShadow: i % 2 === 0 ? 'none' : '4px 4px 0px #FF00FE',
                WebkitTextStroke: i % 2 !== 0 ? '2px #1DB954' : 'none'
              }}
            >
              {digit}
            </motion.span>
          ))}
        </div>

        {/* WRAPPED TITLE BLOCK */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white">
            WRAPPED
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="h-4 bg-[#FF5733] -mt-6 md:-mt-10 ml-auto"
          />
        </motion.div>

        {/* TAGLINE & STATS */}
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[#1DB954]"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white text-black px-4 py-1 font-mono text-sm font-bold uppercase tracking-widest mb-2">
              {formatDate(periodStart)} — {formatDate(periodEnd)}
            </div>
            <p className="text-white/60 font-black uppercase text-xs tracking-[0.3em]">
              {monthDiff} MONTHS OF DATA CRUNCHED
            </p>
          </motion.div>
        </div>
      </div>

      {/* REPETITIVE TEXT OVERLAY (THE "VIBE" DECORATION) */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-20 pointer-events-none whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-4xl font-black italic text-white/30 space-x-12 flex"
        >
          {Array(10).fill(null).map((_, i) => (
            <span key={i}>AZA_WRAPPED_2025_AZA_WRAPPED_2025</span>
          ))}
        </motion.div>
      </div>
    </BaseSlide>
  );
}   