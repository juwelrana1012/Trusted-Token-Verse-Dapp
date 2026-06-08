import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink, Sparkles, BookOpen, Copy, Check } from 'lucide-react';

interface CryptoEncyclopediaProps {
  onBack: () => void;
}

export default function CryptoEncyclopedia({ onBack }: CryptoEncyclopediaProps) {
  const [copied, setCopied] = useState(false);
  const targetUrl = 'https://crypto-encyclopedia.vercel.app';

  const handleOpenLink = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the link when clicking copy button specifically
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 relative text-slate-100 min-h-[85vh] flex flex-col justify-between"
    >
      {/* Background glow decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div>
        {/* Navigation back button */}
        <div className="flex justify-start mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-slate-700 hover:text-emerald-400 text-slate-300 transition-all font-bold text-sm cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>গেম ড্যাশবোর্ড / Back to Game</span>
          </button>
        </div>

        {/* Header with Title and Logo Image */}
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-10">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950/70 border-2 border-emerald-500/35 overflow-hidden flex items-center justify-center p-1 shadow-xl shadow-emerald-500/10 group-hover:border-emerald-500/50 transition-colors">
              <img 
                src="https://i.ibb.co.com/tpLLKjSG/IMG-20260603-145948.png" 
                alt="Crypto Encyclopedia Logo" 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent uppercase tracking-tight py-2 leading-none">
              Crypto Encyclopedia
            </h2>
          </div>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        </div>

        {/* Descriptive Knowledge Core */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#071333]/90 to-[#03091e]/90 border border-emerald-500/20 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left mb-12">
          {/* Subtle interior sparkles/glows */}
          <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
          <div className="absolute left-10 bottom-10 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            {/* Header subtopic badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full text-[11px] font-black tracking-widest text-emerald-400 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-450 animate-spin" style={{ animationDuration: '4s' }} />
              DECEN_KNOWLEDGE_ARCHIVE_2026
            </div>

            {/* Description Paragraphs in custom elegant spacing */}
            <h3 className="text-2xl font-black text-emerald-350 flex items-center gap-2">
              Crypto Encyclopedia 📚
            </h3>

            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-semibold">
              <p>
                Everything you need to know about crypto, the most important questions are arranged here in one place. Questions on everything from Bitcoin, Blockchain, Token, Ecosystem, Airdrop, DeFi, Security to various project analysis are here.
              </p>
              <p className="border-l-4 border-emerald-550 pl-4 bg-emerald-500/[0.02] py-2 pr-2 rounded-r-xl text-emerald-100/90">
                By reading these questions, you will not only know what crypto is, but also understand whether a project is good or bad, where there are opportunities, where there are risks. Useful for beginners as well as those who want to learn crypto seriously, it is a simple and effective knowledge base. 🚀📖
              </p>
            </div>
          </div>
        </div>

        {/* Start Read & Learn Slender / Thin Square Border Link Button in green */}
        <div className="max-w-xl mx-auto space-y-3">
          <motion.div
            whileHover={{ scale: 1.015, y: -2, boxShadow: '0 12px 30px -10px rgba(16,185,129,0.35)' }}
            whileTap={{ scale: 0.99 }}
            onClick={handleOpenLink}
            className="w-full bg-slate-950/95 border-2 border-emerald-500 rounded-2xl py-4 px-6 md:px-8 cursor-pointer shadow-lg relative overflow-hidden group transition-all flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
          >
            {/* Subtle light pulse indicator */}
            <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent uppercase tracking-tight">
                  Start Read &amp; Learn
                </h2>
                <p className="text-[10px] text-emerald-400/95 font-bold uppercase tracking-wider">
                  Click to open direct web app portal
                </p>
              </div>
            </div>

            {/* Interactive Functional Actions (Open and Copy Link) */}
            <div className="flex items-center gap-2 relative z-10">
              {/* Copy URL to Clipboard (Hidden link string, fully functional action) */}
              <button
                onClick={handleCopyLink}
                title="Copy Link to Clipboard / লিংক কপি করুন"
                className="hover:scale-105 active:scale-95 flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl text-emerald-400 text-xs font-black transition-all cursor-pointer shadow-sm min-w-[110px] justify-center"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 text-emerald-300"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      COPIED!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      COPY LINK
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* External web app arrow indicator */}
              <div className="w-9 h-9 rounded-xl bg-emerald-500/90 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-950/40 group-hover:translate-x-1 transition-transform">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>

            {/* Top flashing decoration */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent animate-pulse" />
          </motion.div>
          
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#10b981]/70 font-black animate-pulse">
              ⚡ Safe, Fast, Non-Custodial Education Network ⚡
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER FOOTNOTES */}
      <div className="mt-16 pt-6 border-t border-slate-900 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <span>© 2026 Verse Ecosystem Premium Academy. All rights reserved.</span>
        <span className="flex items-center gap-2">
          Keep learning, keep earning <Sparkles className="w-3.5 h-3.5 text-emerald-400 inline" />
        </span>
      </div>
    </motion.div>
  );
}
