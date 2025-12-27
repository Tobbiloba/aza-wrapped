'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Scale, ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  const sections = [
    {
      title: "1. Data Privacy & Security",
      icon: <Lock className="text-[#1DB954]" />,
      content: "Your financial privacy is our top priority. Aza Wrapped is a 'client-side' application. This means your bank statements are processed locally in your browser. We do not store, upload, or transmit your transaction data to any external servers."
    },
    {
      title: "2. No Financial Advice",
      icon: <Scale className="text-[#FF5733]" />,
      content: "The insights, archetypes, and roasts provided are for entertainment and self-reflection purposes only. Aza Wrapped does not provide professional financial advice, auditing, or certified accounting services."
    },
    {
      title: "3. Accuracy of Analysis",
      icon: <EyeOff className="text-[#FF00FE]" />,
      content: "Analysis is based on the PDF/CSV structure of your bank statement. While we strive for 100% accuracy, variations in bank formatting may lead to categorization errors. We are not responsible for any decisions made based on this analysis."
    },
    {
      title: "4. User Responsibility",
      icon: <ShieldCheck className="text-white" />,
      content: "You are responsible for ensuring the file you upload is your own statement. You agree not to use this tool for any fraudulent or malicious activities."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* BACK BUTTON */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-[#1DB954] mb-8 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-tighter text-sm">Back to Wrapped</span>
        </Link>

        {/* HEADER */}
        <header className="mb-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block bg-[#1DB954] text-black px-4 py-1 font-black uppercase italic mb-4"
          >
            Legal & Privacy
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            Terms of <span className="text-[#FF00FE]">Service</span>
          </h1>
          <p className="text-white/60 font-medium max-w-2xl uppercase text-xs tracking-[0.2em]">
            Last Updated: December 2025 • Read carefully, stay safe.
          </p>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="grid gap-8 mb-16">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-white/10 pl-6 py-2 hover:border-[#1DB954] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h2 className="text-xl font-black uppercase italic tracking-tight">{section.title}</h2>
              </div>
              <p className="text-white/70 leading-relaxed font-medium">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* FINAL DISCLAIMER */}
        <footer className="bg-white/5 border-2 border-dashed border-white/20 p-8 rounded-sm">
          <h3 className="text-[#FF5733] font-black uppercase italic mb-2">Notice:</h3>
          <p className="text-sm text-white/50 leading-relaxed uppercase">
            By using Aza Wrapped, you acknowledge that you have read, understood, and agreed to these terms. This project is a tribute to financial literacy and the "Wrapped" culture.
          </p>
        </footer>
      </div>
    </div>
  );
}