'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[110] px-4 pt-6 pb-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <div className="max-w-xl mx-auto">
        {/* THE TRACKER LINE */}
        <div className="flex gap-1.5 h-1.5">
          {Array.from({ length: total }).map((_, index) => {
            const isCompleted = index < current;
            const isActive = index === current;

            return (
              <div
                key={index}
                className="relative flex-1 bg-white/20 overflow-hidden"
              >
                {/* ACTIVE PROGRESS BACKGROUND */}
                <motion.div
                  initial={{ width: isCompleted ? '100%' : '0%' }}
                  animate={{
                    width: isCompleted || isActive ? '100%' : '0%',
                  }}
                  transition={{
                    duration: isActive ? 0.4 : 0.2,
                    ease: "circOut",
                  }}
                  className={`h-full ${
                    isActive ? 'bg-[#1DB954]' : isCompleted ? 'bg-white' : 'bg-transparent'
                  }`}
                />
                
                {/* GLITCH OVERLAY FOR ACTIVE SLIDE */}
                {isActive && (
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="absolute inset-0 bg-[#FF00FE]/30"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* BRUTALIST INDEX INDICATOR */}
        <div className="flex justify-between items-center mt-3">
          <div className="bg-white px-2 py-0.5 shadow-[2px_2px_0px_0px_#FF00FE]">
            <span className="text-[10px] font-black text-black tracking-tighter italic">
              SLIDE_0{current + 1} // 0{total}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-[#1DB954] animate-pulse" />
             <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
                Live_Analysis_Sync
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}