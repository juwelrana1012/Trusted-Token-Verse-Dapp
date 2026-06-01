import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WalletInfoCard() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-xl flex flex-col items-center" id="wallet-top-banner-card">
      {/* Centered Banner Image */}
      <div className="w-full max-w-[450px] overflow-hidden rounded-[1.8rem] border border-gray-100 shadow-sm bg-white mb-4">
        <img 
          src="https://i.ibb.co.com/XZ8H5d7h/IMG-20260601-134305-435.jpg" 
          alt="Bitcoin.com Wallet Hero" 
          className="w-full h-auto object-contain block hover:scale-102 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Description Area */}
      <div className="w-full text-center space-y-3 px-2 sm:px-4">
        {/* First Line */}
        <p className="text-[14px] sm:text-[16px] font-black text-[#003366] leading-tight flex items-center justify-center gap-1.5 flex-wrap">
          <span>🔐</span>
          <a 
            href="https://wallet.bitcoin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-600 hover:underline transition-colors"
          >
            Bitcoin.com Wallet: Your Crypto, Your Control!
          </a>
          <span>📱</span>
        </p>

        {/* Second Line (Working Link button) */}
        <div className="flex justify-center py-1">
          <a 
            href="https://wallet.bitcoin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-full shadow-md shadow-blue-500/10 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>🔗</span> Download Here <span>🔗</span>
          </a>
        </div>

        {/* Expansion trigger action text */}
        <div className="pt-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-black tracking-widest text-[#8b5e3c] hover:text-[#bd9471] hover:underline uppercase transition-all flex items-center gap-1 mx-auto cursor-pointer"
          >
            {isExpanded ? '▲ Hide Details' : '▼ Show Details'}
          </button>
        </div>

        {/* Structured grid list details for the expanded view */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden w-full text-left border-t border-gray-100"
            >
              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed max-w-xl mx-auto pt-4">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🛡️</span>
                  <div>
                    <span className="font-extrabold text-[#003366]">Self-Custodial & Secure</span>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Only you control your crypto. No middlemen, no compromises.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🌐</span>
                  <div>
                    <a href="https://wallet.bitcoin.com" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Multi-Chain Ready</a>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Manage Bitcoin, Ethereum, Polygon, BNB Smart Chain, Avalanche, and more—all in one app.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🪙</span>
                  <div>
                    <a href="https://verse.bitcoin.com/swap/" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Buy, Sell, Swap</a>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Seamless crypto purchases, sales, and token swaps with leading providers.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🎯</span>
                  <div>
                    <a href="https://verse.bitcoin.com" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Rewards Center</a>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Get free crypto for doing simple tasks like reading news or checking prices.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🧠</span>
                  <div>
                    <a href="https://news.bitcoin.com" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Learn & Earn</a>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Built-in news and Learning Center to level up your crypto knowledge.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">💸</span>
                  <div>
                    <a href="https://verse.bitcoin.com" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Cashback & Bonuses</a>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Earn VERSE and other tokens just by using the app.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🏪</span>
                  <div>
                    <span className="font-extrabold text-[#003366]">Merchant Payments – </span>
                    <span className="text-gray-500 text-xs sm:text-sm">Pay with crypto at real-world shops or use </span>
                    <a href="https://maps.bitcoin.com" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline inline">maps.bitcoin.com</a>
                    <span className="text-gray-500 text-xs sm:text-sm inline"> to find fUSD-accepting merchants.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🔔</span>
                  <div>
                    <span className="font-extrabold text-[#003366]">Price Alerts & Notifications</span>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Stay ahead with real-time updates on your favorite assets.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-base flex-shrink-0 mt-0.5">👥</span>
                  <div>
                    <a href="https://wallet.bitcoin.com" target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Invite & Earn</a>
                    <span className="text-gray-500 text-xs sm:text-sm"> – Get rewarded for bringing your friends into crypto.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl text-emerald-850 bg-emerald-50/30 border border-emerald-100">
                  <span className="text-base flex-shrink-0 mt-0.5">🚀</span>
                  <div>
                    <span className="font-extrabold text-[#003355]">Fast, Free Setup</span>
                    <span className="text-gray-500 text-xs sm:text-sm"> – No sign-up needed. Download, create a wallet, and you’re good to go.</span>
                  </div>
                </div>

                <div className="flex justify-center pt-3">
                  <a 
                    href="https://wallet.bitcoin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-full shadow-md transition-all cursor-pointer"
                  >
                    <span>🔗</span> Download Here <span>🔗</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
