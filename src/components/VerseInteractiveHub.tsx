import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink, Sparkles, BookOpen, Zap, Copy, Check } from 'lucide-react';

interface VerseInteractiveHubProps {
  onBack: () => void;
}

export default function VerseInteractiveHub({ onBack }: VerseInteractiveHubProps) {
  const [copied, setCopied] = useState(false);
  const targetUrl = 'https://juwel-verse.vercel.app';

  const handleOpenLink = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent launching the link when copying
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div>
        {/* Navigation back button */}
        <div className="flex justify-start mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-slate-700 hover:text-indigo-400 text-slate-300 transition-all font-bold text-sm cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>গেম ড্যাশবোর্ড / Back to Game</span>
          </button>
        </div>

        {/* Header with Title and Logo Image */}
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-10">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950/70 border-2 border-indigo-500/35 overflow-hidden flex items-center justify-center p-1 shadow-xl shadow-indigo-500/10 group-hover:border-indigo-500/50 transition-colors">
              <img 
                src="https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png" 
                alt="Verse Logo" 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-350 to-pink-400 bg-clip-text text-transparent uppercase tracking-tight py-2 leading-none">
              VERSE INTERACTIVE HUB
            </h2>
          </div>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        </div>

        {/* Descriptive Knowledge Core */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0b0f2d]/90 to-[#030616]/90 border border-indigo-500/20 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left mb-12">
          {/* Subtle interior sparkles/glows */}
          <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
          <div className="absolute left-10 bottom-10 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            {/* Header subtopic badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/15 border border-indigo-500/20 rounded-full text-[11px] font-black tracking-widest text-indigo-400 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-455 animate-spin" style={{ animationDuration: '4s' }} />
              DECEN_INTERACTION_PORTAL_2026
            </div>

            {/* Description Category Header */}
            <h3 className="text-2xl font-black text-indigo-200 flex items-center gap-2">
              VERSE INTERACTIVE HUB 🌐
            </h3>

            {/* Structured description text */}
            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-semibold">
              <p className="border-l-4 border-indigo-500 pl-4 bg-indigo-500/[0.02] py-2 pr-2 rounded-r-xl text-indigo-100/95">
                A world-class Educational Knowledge Platform built to empower beginners and advanced professionals with clean, reliable insights into Cryptocurrency, Blockchain technology networks, the Verse Ecosystem, and the Sovereign Digital Economy.
              </p>
            </div>
          </div>
        </div>

        {/* Start Now Slender / Thin Square Border Link Button in Indigo / Violet theme */}
        <div className="max-w-xl mx-auto space-y-3">
          <motion.div
            whileHover={{ scale: 1.015, y: -2, boxShadow: '0 12px 30px -10px rgba(99,102,241,0.35)' }}
            whileTap={{ scale: 0.99 }}
            onClick={handleOpenLink}
            className="w-full bg-slate-950/95 border-2 border-indigo-500 rounded-2xl py-4 px-6 md:px-8 cursor-pointer shadow-lg relative overflow-hidden group transition-all flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
          >
            {/* Subtle light pulse indicator */}
            <div className="absolute inset-0 bg-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all">
                <Zap className="w-5 h-5" />
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-500 bg-clip-text text-transparent uppercase tracking-tight">
                  Start Now
                </h2>
                <p className="text-[10px] text-indigo-400/95 font-bold uppercase tracking-wider">
                  Click to launch direct interactive ecosystem application
                </p>
              </div>
            </div>

            {/* Interactive Functional Actions (Open and Copy Link) */}
            <div className="flex items-center gap-2 relative z-10">
              {/* Copy URL to Clipboard (fully functional action, no visible URL underneath the button) */}
              <button
                onClick={handleCopyLink}
                title="Copy Link to Clipboard / লিংক কপি করুন"
                className="hover:scale-105 active:scale-95 flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/60 rounded-xl text-indigo-400 text-xs font-black transition-all cursor-pointer shadow-sm min-w-[110px] justify-center"
              >
                <AnimatePresence mode="white">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 text-indigo-300"
                    >
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
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
              <div className="w-9 h-9 rounded-xl bg-indigo-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-indigo-950/40 group-hover:translate-x-1 transition-transform">
                <ExternalLink className="w-4 h-4 text-slate-100" />
              </div>
            </div>

            {/* Top flashing decoration */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent animate-pulse" />
          </motion.div>
          
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400/75 font-black animate-pulse">
              ⚡ Secure &amp; Seamless Educational Pipeline ⚡
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER FOOTNOTES */}
      <div className="mt-16 pt-6 border-t border-slate-900 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <span>© 2026 Verse Ecosystem Premium Academy. All rights reserved.</span>
        <span className="flex items-center gap-2">
          Knowledge is digital power <Sparkles className="w-3.5 h-3.5 text-indigo-400 inline" />
        </span>
      </div>
    </motion.div>
  );
}
