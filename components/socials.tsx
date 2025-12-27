'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin, Code2, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function CreditHeader() {
  const pathname = usePathname();
  const isWrappedPage = pathname === '/wrapped';
  const socialLinks = [
    {
      label: 'INSTAGRAM',
      href: 'https://instagram.com/yourhandle', // Replace with your link
      icon: <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
      color: 'hover:bg-[#FF00FE]',
    },
    {
      label: 'LINKEDIN',
      href: 'https://linkedin.com/in/yourhandle', // Replace with your link
      icon: <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
      color: 'hover:bg-[#0077B5]',
    },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-100 px-2 sm:px-4 py-2 sm:py-3 pointer-events-none ${isWrappedPage ? 'hidden sm:block' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-3">
        
        {/* BUILDER TAG */}
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="pointer-events-auto bg-white border-2 border-black px-2 sm:px-4 py-1 sm:py-1.5 shadow-[4px_4px_0px_0px_#1DB954] flex items-center gap-2 sm:gap-3 -rotate-1"
        >
          <div className="bg-black text-white p-0.5 sm:p-1">
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <div className="leading-none">
            <p className="text-[8px] sm:text-[10px] font-black text-black/50 uppercase tracking-widest">BUILT BY</p>
            <p className="text-xs sm:text-sm font-black text-black uppercase italic">Tobbie</p>
          </div>
        </motion.div>

        {/* SOCIAL LINKS TAPE */}
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="pointer-events-auto flex gap-1.5 sm:gap-2 flex-wrap justify-center"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                bg-black border-2 border-white px-2 sm:px-3 py-1 sm:py-1.5 
                text-white text-[8px] sm:text-[10px] font-black uppercase tracking-tighter 
                flex items-center gap-1 sm:gap-2 transition-all 
                hover:text-white hover:-translate-y-1 ${link.color}
                shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]
              `}
            >
              {link.icon}
              <span className="whitespace-nowrap">{link.label}</span>
              <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 opacity-50 shrink-0" />
            </a>
          ))}
        </motion.div>
      </div>
      
      {/* THIN DECORATIVE LINE */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 w-full h-px bg-white/10 origin-left"
      />
    </header>
  );
}