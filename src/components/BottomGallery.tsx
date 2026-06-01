import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Grid, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Download, 
  ExternalLink 
} from 'lucide-react';

const SYSTEM_IMAGES = [
  { id: 1, url: "https://i.ibb.co.com/QFV00NcS/IMG-20260601-090047.jpg", alt: "Verse System Activity 1" },
  { id: 2, url: "https://i.ibb.co.com/CsK81QvD/IMG-20260601-090156.jpg", alt: "Verse System Activity 2" },
  { id: 3, url: "https://i.ibb.co.com/4ZV1V8GY/IMG-20260601-090315.jpg", alt: "Verse System Activity 3" },
  { id: 4, url: "https://i.ibb.co.com/rfN2SgPz/IMG-20260601-090416.jpg", alt: "Verse System Activity 4" },
  { id: 5, url: "https://i.ibb.co.com/HTdj3TCN/IMG-20260601-090447.jpg", alt: "Verse System Activity 5" },
  { id: 6, url: "https://i.ibb.co.com/v4cnbhRq/IMG-20260601-090724.jpg", alt: "Verse System Activity 6" },
  { id: 7, url: "https://i.ibb.co.com/S4xYss4L/IMG-20260601-090754.jpg", alt: "Verse System Activity 7" },
  { id: 8, url: "https://i.ibb.co.com/7dMzJrFd/IMG-20260601-090909.jpg", alt: "Verse System Activity 8" },
  { id: 9, url: "https://i.ibb.co.com/MyYPy2Qg/IMG-20260601-091009.jpg", alt: "Verse System Activity 9" },
  { id: 10, url: "https://i.ibb.co.com/XZ1xG14w/IMG-20260601-091107.jpg", alt: "Verse System Activity 10" },
  { id: 11, url: "https://i.ibb.co.com/7Jpg2Sbn/IMG-20260601-091134.jpg", alt: "Verse System Activity 11" },
  { id: 12, url: "https://i.ibb.co.com/JWhjhzZv/IMG-20260601-091151.jpg", alt: "Verse System Activity 12" },
  { id: 13, url: "https://i.ibb.co.com/8nMXHMwb/IMG-20260601-091210.jpg", alt: "Verse System Activity 13" },
  { id: 14, url: "https://i.ibb.co.com/0wbDHbT/IMG-20260601-091238.jpg", alt: "Verse System Activity 14" },
  { id: 15, url: "https://i.ibb.co.com/N2CKT9ps/IMG-20260601-091257.jpg", alt: "Verse System Activity 15" },
  { id: 16, url: "https://i.ibb.co.com/JFnQ7VQ3/IMG-20260601-091327.jpg", alt: "Verse System Activity 16" },
  { id: 17, url: "https://i.ibb.co.com/XfkRSwdq/IMG-20260601-091343.jpg", alt: "Verse System Activity 17" },
  { id: 18, url: "https://i.ibb.co.com/vC7mbLzV/IMG-20260601-091402.jpg", alt: "Verse System Activity 18" },
  { id: 19, url: "https://i.ibb.co.com/ZZbzrGv/IMG-20260601-091425.jpg", alt: "Verse System Activity 19" },
  { id: 20, url: "https://i.ibb.co.com/x8dVQfkQ/IMG-20260601-091442.jpg", alt: "Verse System Activity 20" },
  { id: 21, url: "https://i.ibb.co.com/fV6Zj3Md/IMG-20260601-091519.jpg", alt: "Verse System Activity 21" },
  { id: 22, url: "https://i.ibb.co.com/8WJTMk6/IMG-20260601-091555.jpg", alt: "Verse System Activity 22" },
  { id: 23, url: "https://i.ibb.co.com/pjC2dNPH/IMG-20260601-092056.jpg", alt: "Verse System Activity 23" },
  { id: 24, url: "https://i.ibb.co.com/YTtxghNZ/IMG-20260601-092119.jpg", alt: "Verse System Activity 24" },
  { id: 25, url: "https://i.ibb.co.com/Nvdy8MH/IMG-20260601-092154.jpg", alt: "Verse System Activity 25" },
  { id: 26, url: "https://i.ibb.co.com/jkT52ZqS/IMG-20260601-092403.jpg", alt: "Verse System Activity 26" }
];

export default function BottomGallery() {
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

  // Setup Keyboard arrow key navigation when viewer is open
  useEffect(() => {
    if (selectedImgIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImgIndex(null);
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImgIndex]);

  const handlePrev = () => {
    setSelectedImgIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? SYSTEM_IMAGES.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    setSelectedImgIndex((prev) => {
      if (prev === null) return null;
      return prev === SYSTEM_IMAGES.length - 1 ? 0 : prev + 1;
    });
  };

  const activeImage = selectedImgIndex !== null ? SYSTEM_IMAGES[selectedImgIndex] : null;

  return (
    <div className="w-full max-w-4xl mx-auto my-12" id="bitcoin-community-gallery-view">
      <div className="bg-[#0b1329] border border-blue-900/30 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative elements matching dark blue hub style */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Gallery Title & Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-blue-900/10 pb-6 mb-8">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 shadow-inner flex-shrink-0">
              <Grid className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 uppercase tracking-tight">
                Ecosystem Activity Log (সম্পূর্ণ কার্য বিবরণী)
              </h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#8b5e3c] font-black mt-0.5">
                Proof of community engagement • 26 snapshots
              </p>
            </div>
          </div>
          <div className="bg-sky-950/40 px-4 py-1.5 rounded-full border border-sky-400/10 text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider">
            📁 Click to Zoom • ক্লিক করে সম্পূর্ণ দেখুন
          </div>
        </div>

        {/* Dense visual grid of 26 images as requested, zero skipped */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SYSTEM_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              onClick={() => setSelectedImgIndex(idx)}
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-sky-950/10 border border-blue-900/20 hover:border-amber-500/35 rounded-3xl p-3 shadow-md hover:shadow-xl transition-all group overflow-hidden cursor-zoom-in"
            >
              {/* Image Frame with corner rounding and soft containment */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-blue-950/40 relative bg-slate-900">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Overlay with zoom icon */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Index Indicator tag */}
                <div className="absolute top-3 left-3 bg-[#0c142c]/95 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
                  No. {String(img.id).padStart(2, '0')}
                </div>
              </div>
              
              {/* Optional brief caption area */}
              <div className="mt-3.5 px-1 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#c0a080]" /> Open Snapshot
                </span>
                <span className="text-[9px] font-mono text-[#8b5e3c] font-black group-hover:text-amber-400 transition-colors uppercase">VIEW DETAILS</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PREMIUM HIGH-QUALITY MODAL LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between items-center p-4 sm:p-6"
            onClick={() => setSelectedImgIndex(null)}
          >
            {/* Top Toolbar */}
            <div className="w-full max-w-5xl flex items-center justify-between gap-4 py-3 border-b border-white/10 relative z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/25 text-amber-500">
                  <ImageIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Ecosystem Proof Snapshot
                  </h3>
                  <p className="text-[10px] font-mono text-amber-400/90 font-bold uppercase tracking-widest">
                    LOG INDEX {selectedImgIndex !== null ? selectedImgIndex + 1 : 0} OF {SYSTEM_IMAGES.length}
                  </p>
                </div>
              </div>

              {/* Toolbar Action Links */}
              <div className="flex items-center gap-2">
                <a
                  href={activeImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 border border-white/5"
                  title="Open original image link"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">ORIGINAL</span>
                </a>
                
                <button
                  onClick={() => setSelectedImgIndex(null)}
                  className="w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center border border-rose-500/20 hover:border-transparent transition-all cursor-pointer"
                  title="Close Media Viewer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Main Showcase Section */}
            <div className="w-full max-w-5xl flex-1 flex items-center justify-between gap-2.5 sm:gap-6 relative my-4">
              {/* Left Navigation trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-500/40 text-white flex items-center justify-center transition-all transform active:scale-90 shadow-xl cursor-pointer hover:text-amber-400 relative z-30"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image Frame container (Guaranteed high visibility responsive ratio container) */}
              <motion.div
                key={activeImage.id}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="flex-1 max-h-[72vh] flex items-center justify-center relative z-20 group/viewer"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={activeImage.url}
                  alt={activeImage.alt}
                  className="max-h-[70vh] max-w-full rounded-[2rem] border-2 border-white/10 shadow-2xl hover:border-amber-500/40 transition-colors duration-500 object-contain block select-none bg-slate-900"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Right Navigation trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-500/40 text-white flex items-center justify-center transition-all transform active:scale-90 shadow-xl cursor-pointer hover:text-amber-400 relative z-30"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Indicator bar */}
            <div className="w-full max-w-3xl text-center py-3 border-t border-white/10 flex flex-col items-center gap-1.5 relative z-30">
              <p className="text-xs text-white/90 font-extrabold max-w-lg uppercase tracking-wider">
                🔬 Ecosystem Detail Snap: {activeImage.alt}
              </p>
              <div className="flex gap-2 justify-center flex-wrap items-center text-[10px] text-amber-400 font-mono font-bold tracking-widest uppercase">
                <span>⚡ NO. {activeImage.id}</span>
                <span className="text-white/20">•</span>
                <span>🔥 VERSE ENGAGEMENT PROTOCOL</span>
                <span className="text-white/20">•</span>
                <span>🖱️ CLICK ANYWHERE OUTSIDE TO CLOSE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
