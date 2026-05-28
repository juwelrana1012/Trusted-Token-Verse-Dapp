/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Gamepad2, 
  Wallet, 
  Brain, 
  ArrowLeft, 
  WalletCards, 
  Plus, 
  Minus,
  Trophy,
  History,
  TrendingUp,
  Zap,
  ArrowRightLeft,
  CandlestickChart,
  Briefcase,
  Sparkles
} from 'lucide-react';
// --- Types ---
type GameState = 'home' | 'clicker' | 'quiz' | 'wallet';

interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
}

interface MarketData {
  price: number;
  change24h: number;
  sparkline: number[];
  prediction?: 'up' | 'down' | 'steady';
}

interface Transaction {
  id: string;
  type: 'receive' | 'send' | 'earned' | 'swap';
  amount: number;
  symbol?: string; // Symbol for token transactions
  date: Date;
  description: string;
}

const SUPPORTED_TOKENS: Token[] = [
  { id: 'verse-2', name: 'Verse', symbol: 'VERSE', icon: 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png', color: 'text-yellow-500' },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', color: 'text-orange-500' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', color: 'text-blue-400' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', color: 'text-purple-400' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', color: 'text-yellow-400' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png', color: 'text-blue-600' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', color: 'text-pink-500' },
  { id: 'matic-network', name: 'Polygon', symbol: 'MATIC', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png', color: 'text-purple-600' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png', color: 'text-yellow-600' },
  { id: 'tether', name: 'Tether', symbol: 'USDT', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', color: 'text-teal-500' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', color: 'text-blue-300' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP', icon: 'https://cryptologos.cc/logos/ripple-xrp-logo.png', color: 'text-slate-400' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png', color: 'text-blue-700' },
];

// --- Components ---

function Particle({ x, y }: { x: number; y: number; key?: any }) {
  return (
    <motion.div
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{ 
        x: x + (Math.random() - 0.5) * 200, 
        y: y - 150 - Math.random() * 100, 
        opacity: 0,
        scale: 0 
      }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute pointer-events-none text-yellow-500 font-bold z-50 text-xl"
    >
      +10
    </motion.div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('verseUser'));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [loadProgress, setLoadProgress] = useState(100);
  const [currentTip, setCurrentTip] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStep, setLoginStep] = useState(0);
  const loadingTips = [
    "Tip: Collect coins to score more!",
    "Tip: Avoid enemies to survive longer!",
    "Tip: Use power-ups wisely!"
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('verseUser');
    if (savedUser) {
      setUsername(savedUser);
    }
    setIsLoadingUser(false);
  }, []);

  const [coins, setCoins] = useState(0);
  const [walletBalance, setWalletBalance] = useState(100);
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({
    VERSE: 0,
    BTC: 0,
    ETH: 0,
    SOL: 0,
    BNB: 0,
    ADA: 0,
    DOT: 0,
    MATIC: 0,
    DOGE: 0,
    USDT: 0,
    LTC: 0,
    XRP: 0,
    LINK: 0
  });
  
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({
    VERSE: { price: 0.05, change24h: 2.5, sparkline: Array(10).fill(0.05), prediction: 'up' },
    BTC: { price: 65000, change24h: 0, sparkline: Array(10).fill(65000), prediction: 'steady' },
    ETH: { price: 3400, change24h: 0, sparkline: Array(10).fill(3400), prediction: 'up' },
    SOL: { price: 145, change24h: 0, sparkline: Array(10).fill(145), prediction: 'down' },
    BNB: { price: 580, change24h: 0, sparkline: Array(10).fill(580), prediction: 'steady' },
    ADA: { price: 0.45, change24h: 0, sparkline: Array(10).fill(0.45), prediction: 'up' },
    DOT: { price: 7.2, change24h: 0, sparkline: Array(10).fill(7.2), prediction: 'down' },
    MATIC: { price: 0.72, change24h: 0, sparkline: Array(10).fill(0.72), prediction: 'up' },
    DOGE: { price: 0.15, change24h: 0, sparkline: Array(10).fill(0.15), prediction: 'up' },
    USDT: { price: 1.0, change24h: 0, sparkline: Array(10).fill(1.0), prediction: 'steady' },
    LTC: { price: 80, change24h: 0, sparkline: Array(10).fill(80), prediction: 'up' },
    XRP: { price: 0.60, change24h: 0, sparkline: Array(10).fill(0.60), prediction: 'down' },
    LINK: { price: 18, change24h: 0, sparkline: Array(10).fill(18), prediction: 'up' },
  });

  const [lastMarketSync, setLastMarketSync] = useState<Date>(new Date());
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);

  // Persistence Logic: Load data when username is set
  useEffect(() => {
    if (!username) {
      setIsDataLoaded(false);
      return;
    }

    try {
      const savedCoins = localStorage.getItem(`verse_${username}_coins`);
      const savedBalance = localStorage.getItem(`verse_${username}_balance`);
      const savedTokens = localStorage.getItem(`verse_${username}_tokens`);
      const savedHistory = localStorage.getItem(`verse_${username}_history`);

      if (savedCoins !== null) setCoins(parseInt(savedCoins));
      if (savedBalance !== null) setWalletBalance(parseFloat(savedBalance));
      
      if (savedTokens !== null) {
        setTokenBalances(JSON.parse(savedTokens));
      } else {
        setTokenBalances({
          VERSE: 0, BTC: 0, ETH: 0, SOL: 0, BNB: 0, ADA: 0, DOT: 0, MATIC: 0, DOGE: 0, USDT: 0, LTC: 0, XRP: 0, LINK: 0
        });
      }

      if (savedHistory !== null) {
        const parsedHistory = JSON.parse(savedHistory);
        const sanitizedHistory = parsedHistory.map((tx: any) => ({
          ...tx,
          date: new Date(tx.date)
        }));
        setHistory(sanitizedHistory);
      } else {
        setHistory([]);
      }

      // Mark as loaded so we can safely save updates
      setIsDataLoaded(true);
    } catch (err) {
      console.error("Failed to load persistence data:", err);
      // Even on error, mark as loaded to allow UI to function and start fresh if needed
      setIsDataLoaded(true);
    }
  }, [username]);

  // Persistence Logic: Save data whenever it changes, but ONLY after it's been loaded correctly
  useEffect(() => {
    if (!username || !isDataLoaded) return;
    localStorage.setItem(`verse_${username}_coins`, coins.toString());
    setLastSaveTime(new Date());
  }, [coins, username, isDataLoaded]);

  useEffect(() => {
    if (!username || !isDataLoaded) return;
    localStorage.setItem(`verse_${username}_balance`, walletBalance.toString());
    setLastSaveTime(new Date());
  }, [walletBalance, username, isDataLoaded]);

  useEffect(() => {
    if (!username || !isDataLoaded) return;
    localStorage.setItem(`verse_${username}_tokens`, JSON.stringify(tokenBalances));
    setLastSaveTime(new Date());
  }, [tokenBalances, username, isDataLoaded]);

  useEffect(() => {
    if (!username || !isDataLoaded) return;
    localStorage.setItem(`verse_${username}_history`, JSON.stringify(history));
    setLastSaveTime(new Date());
  }, [history, username, isDataLoaded]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showLinks, setShowLinks] = useState(false);
  const [showFocus, setShowFocus] = useState(false);

  // Market Price Simulation & Real Data Fetching
  useEffect(() => {
    if (gameState !== 'home' && gameState !== 'wallet') return;

    const fetchRealPrices = async () => {
      try {
        const ids = SUPPORTED_TOKENS.filter(t => t.id !== 'verse-2').map(t => t.id).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data || typeof data !== 'object') return;

        setMarketData(prev => {
          const updated = { ...prev };
          SUPPORTED_TOKENS.forEach(token => {
            if (token.id === 'verse-2') return;
            const coinData = data[token.id];
            
            if (coinData && typeof coinData.usd === 'number') {
              const change = coinData.usd_24h_change || 0;
              const currentSpark = prev[token.symbol]?.sparkline || Array(10).fill(coinData.usd);
              
              updated[token.symbol] = {
                price: coinData.usd,
                change24h: Number(change),
                sparkline: [...currentSpark.slice(1), coinData.usd],
                prediction: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'steady'
              };
            }
          });
          return updated;
        });
        setLastMarketSync(new Date());
      } catch (err) {
        console.warn("CoinGecko Fetch Warning:", err);
      }
    };

    // Initial fetch
    fetchRealPrices();

    const interval = setInterval(() => {
      // Fetch real prices every 30 seconds to stay updated but respect rate limits
      fetchRealPrices();

      // Keep simulating Verse price locally as it's the game currency
      setMarketData(prev => {
        if (!prev.VERSE) return prev;
        const newData = { ...prev };
        const symbol = 'VERSE';
        const change = (Math.random() - 0.45) * 0.008; // Slight upward bias for Verse
        const newPrice = newData[symbol].price * (1 + change);
        const newSparkline = [...newData[symbol].sparkline.slice(1), newPrice];
        
        newData[symbol] = {
          ...newData[symbol],
          price: newPrice,
          change24h: newData[symbol].change24h + (change * 100),
          sparkline: newSparkline,
          prediction: change > 0 ? 'up' : 'down'
        };
        return newData;
      });
    }, 30000); // Check for updates and simulate Verse every 30s

    return () => clearInterval(interval);
  }, [gameState]);

  // Auto-focus the username input if it exists
  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = tempUsername.trim();
    if (cleanName) {
      localStorage.setItem('verseUser', cleanName);
      setUsername(cleanName);
    }
  };

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      date: new Date(),
      description
    };
    setHistory(prev => [newTx, ...prev].slice(0, 5));
  };

  const handleEarn = (amount: number, from: string, x?: number, y?: number) => {
    setCoins(prev => prev + amount);
    if (x && y) {
      const id = Date.now();
      setParticles(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 1000);
    }
  };

  const transferToWallet = () => {
    if (coins > 0) {
      setWalletBalance(prev => prev + coins);
      addTransaction('earned', coins, 'Transferred from Game Balance');
      setCoins(0);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#c0a080] selection:text-white">
      {/* Fixed Top Logo Header */}
      <div className="fixed top-0 left-0 w-full h-[55px] bg-white border-b border-gray-100 flex items-center px-[12px] z-[10000] shadow-sm">
        <img 
          src="https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png" 
          alt="Verse Logo" 
          className="h-[35px] w-auto mr-[10px] !block"
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center text-[16px] font-bold tracking-[1px] uppercase">
          <span className="text-[#8b5e3c]">VERSE GAME</span>
          <span className="mx-1 text-[#003366]">&</span>
          <span className="text-[#003366]">VERSE MARKET ANALYTICS</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoadingUser ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10001] bg-white flex flex-col items-center justify-center p-6"
          >
            <div className="mb-8 text-center">
              <div className="text-3xl font-black tracking-tighter uppercase">
                <span className="text-[#8b5e3c]">VERSE GAME</span>
                <span className="mx-2 text-[#003366]">&</span>
                <span className="text-[#003366]">VERSE MARKET ANALYTICS</span>
              </div>
            </div>

            {/* Spinner */}
            <div className="relative w-[60px] h-[60px] mb-8">
              <div className="absolute inset-0 border-4 border-[#3e2716] rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-t-[#c0a080] rounded-full animate-spin"
                style={{ animationDuration: '1s' }}
              ></div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-[220px] space-y-3">
              <div className="h-2 bg-[#3e2716] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c0a080] transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(192,160,128,0.5)]"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <div className="flex justify-center">
                <span className="text-white text-sm font-bold">{Math.floor(loadProgress)}%</span>
              </div>
            </div>

            {/* Rotating Tips */}
            <motion.div 
              key={currentTip}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.8, y: 0 }}
              className="mt-6 text-sm text-gray-300 text-center font-medium italic"
            >
              {loadingTips[currentTip]}
            </motion.div>
          </motion.div>
        ) : !username ? (
          <motion.div
            key="username-entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6 pt-[55px]"
          >
            <AnimatePresence mode="wait">
              {isLoggingIn ? (
                <motion.div
                  key="logging-in"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="text-center space-y-6"
                >
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-[#c0a080]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#c0a080] rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-widest animate-pulse">
                    Logging in...
                  </h2>
                </motion.div>
              ) : (
                <motion.div 
                  key="login-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-md w-full text-center space-y-8"
                >
                  <img 
                    src="https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png" 
                    alt="Verse Logo" 
                    className="w-32 h-auto mx-auto !block"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-gray-900">Identity Access</h2>
                    <p className="text-[#8b5e3c]">Enter your moniker to access the Verse Mini Hub</p>
                  </div>
                  <form onSubmit={handleStart} className="space-y-4">
                    <input 
                      type="text" 
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="Username..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:border-[#c0a080] outline-none transition-all text-center text-xl font-bold text-gray-900"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={!tempUsername.trim()}
                      className="w-full py-4 bg-[#c0a080] text-[#1a0f0a] font-bold rounded-2xl hover:bg-[#d4b496] transition-all disabled:opacity-50"
                    >
                      Enter Hub
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Navigation Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-[55px] z-40 mt-[55px]">
              <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end items-center">
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Player: {username}</span>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('verseUser');
                          window.location.reload();
                        }}
                        className="text-[9px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-2 py-0.5 rounded transition-all font-mono"
                      >
                        LOGOUT
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-mono text-lg font-bold text-gray-900">{coins}</span>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Wallet Balance</span>
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-500" />
                      <span className="font-mono text-lg font-bold text-emerald-600">{walletBalance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
              <AnimatePresence mode="wait">
                {gameState === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <section className="text-center space-y-4">
                      <h2 className="text-4xl font-black text-gray-900 sm:text-5xl leading-tight">
                        WELCOME <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0a080] to-[#8b5e3c]">{username}</span>
                      </h2>
                      <p className="text-[#8b5e3c] max-w-lg mx-auto leading-relaxed">
                        Your decentralized gateway to the Verse network. 
                        Earn, play, and explore the ecosystem.
                      </p>
                    </section>

                    {/* Community Section */}
                    <section className="text-center space-y-6">
                      <div className="space-y-4">
                        <button 
                          onClick={() => setShowLinks(!showLinks)}
                          className="bg-[#8b5e3c] hover:bg-[#a67148] active:scale-95 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_4px_20px_rgba(139,94,60,0.3)] uppercase tracking-wider text-sm w-full sm:w-auto"
                        >
                          {showLinks ? 'Close Community' : 'Join Our Community'}
                        </button>
                        
                        <div className="block">
                          <button 
                            onClick={() => setShowFocus(!showFocus)}
                            className="text-[#8b5e3c] hover:text-[#a67148] font-black uppercase tracking-[0.2em] text-sm transition-colors py-2"
                          >
                            {showFocus ? 'Hide Focus' : 'MAIN FOCUS OF THE VERSE GAME'}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {showFocus && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="overflow-hidden bg-white border border-gray-100 rounded-[2rem] p-8 max-w-2xl mx-auto shadow-xl text-left"
                          >
                            <div className="prose prose-sm text-gray-700 space-y-4 leading-relaxed">
                              <p>First of all a big thank you to my @stone_brb boss. Also expressing gratitude to all the responsible persons of the community, whose tireless efforts and contributions have made our community so strong and organized today.</p>
                              <p>The key to making a community strong is its members. A community truly thrives and becomes sustainable only through the combined efforts of each responsible and conscious member.</p>
                              <p>The main focus and purpose of my game is to introduce the future generation to the concept of “Verse” and community, as well as provide a basic understanding of cryptocurrency. Through this game, users will learn—how to buy crypto, how to convert, and get a basic idea of market prices.</p>
                              <p>I have tried my best so that through this game the new generation can gain atleast a basic knowledge and understand things simply.</p>
                              <p>One of the most important things in human life is the "beginning". Because, if one does not initiate something, then one does not develop any knowledge or idea about that subject. With this game I wanted to make that starting point easy and interesting.</p>
                              <p>Also, using this game a user can learn how to earn points and use those points to learn the basics of crypto marketing or trading.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {showLinks && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="overflow-hidden mt-6 bg-slate-50 border border-gray-100 rounded-[2rem] p-6 max-w-md mx-auto space-y-3 shadow-lg"
                          >
                            <a href="https://t.me/GetVerse" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm">
                              1: VERSE TELEGRAM GROUP
                            </a>
                            <a href="https://twitter.com/VerseEcosystem" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm">
                              2: VERSE TWITTER COMMUNITY
                            </a>
                            <a href="https://twitter.com/BitcoinCom" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm">
                              3: VERSE OFFICIAL TWITTER
                            </a>
                            <a href="http://dashboard.vgdh.io" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm">
                              4: VERSE APP ANALYTICS
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MenuCard 
                  icon={<Gamepad2 className="w-8 h-8" />}
                  title="Verse Clicker"
                  description="Rapid earn system. How fast can you tap?"
                  color="from-blue-600 to-indigo-700"
                  onClick={() => setGameState('clicker')}
                />
                <MenuCard 
                  icon={<Brain className="w-8 h-8" />}
                  title="Knowledge Quiz"
                  description="Test your crypto IQ and earn massive bonuses."
                  color="from-purple-600 to-pink-700"
                  onClick={() => setGameState('quiz')}
                />
                <MenuCard 
                  icon={<WalletCards className="w-8 h-8" />}
                  title="Verse Wallet"
                  description="Securely manage and transfer your earned assets."
                  color="from-emerald-600 to-teal-700"
                  onClick={() => setGameState('wallet')}
                />
              </div>

              {coins > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                      <TrendingUp className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-yellow-500 font-bold">Unclaimed Assets</p>
                      <p className="text-sm text-gray-400">You have {coins} Verse waiting for you in the game balance.</p>
                    </div>
                  </div>
                  <button 
                    onClick={transferToWallet}
                    className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Transfer to Wallet
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {gameState === 'clicker' && (
            <ClickerGame 
              onBack={() => setGameState('home')} 
              onEarn={(x, y) => handleEarn(10, 'clicker', x, y)}
              particles={particles}
              coins={coins}
            />
          )}

          {gameState === 'quiz' && (
            <QuizGame 
              onBack={() => setGameState('home')} 
              onWin={(bonus) => {
                handleEarn(bonus, 'quiz');
              }}
            />
          )}

          {gameState === 'wallet' && (
            <WalletSimulator 
              balance={walletBalance}
              tokenBalances={tokenBalances}
              marketData={marketData}
              lastSync={lastMarketSync}
              lastSave={lastSaveTime}
              history={history}
              onBack={() => setGameState('home')}
              onSwap={(from, to, fromAmt, toAmt) => {
                const hasBalance = from === 'USD' ? walletBalance >= fromAmt : (tokenBalances[from] || 0) >= fromAmt;
                
                if (hasBalance) {
                  if (from === 'USD') setWalletBalance(prev => prev - fromAmt);
                  else setTokenBalances(prev => ({ ...prev, [from]: prev[from] - fromAmt }));
                  
                  if (to === 'USD') setWalletBalance(prev => prev + toAmt);
                  else setTokenBalances(prev => ({ ...prev, [to]: (prev[to] || 0) + toAmt }));
                  
                  addTransaction('swap', fromAmt, `Swapped ${fromAmt.toFixed(4)} ${from} for ${toAmt.toFixed(4)} ${to}`);
                  return true;
                }
                return false;
              }}
              onReceive={(amt) => {
                setWalletBalance(prev => prev + amt);
                addTransaction('receive', amt, 'External Credit');
              }}
              onSend={(amt) => {
                if (walletBalance >= amt) {
                  setWalletBalance(prev => prev - amt);
                  addTransaction('send', amt, 'External Transfer');
                  return true;
                }
                return false;
              }}
            />
          )}


        </AnimatePresence>
      </main>

            <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-100 mt-12 text-center text-gray-400">
              <p className="text-sm font-mono uppercase tracking-[0.2em]">
                &copy; 2026 Verse Community &bull; Decentralized Hub
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Subcomponents ---

function MenuCard({ icon, title, description, color, onClick }: { 
  icon: ReactNode; 
  title: string; 
  description: string; 
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group overflow-hidden bg-slate-50 border border-gray-100 rounded-3xl p-8 text-left transition-all hover:border-[#c0a080]/50 shadow-sm`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 filter blur-3xl group-hover:opacity-20 transition-opacity`} />
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} inline-block mb-6 text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-[#8b5e3c] text-sm leading-relaxed">{description}</p>
    </motion.button>
  );
}

function ClickerGame({ onBack, onEarn, particles, coins }: { 
  onBack: () => void; 
  onEarn: (x: number, y: number) => void;
  particles: { id: number; x: number; y: number }[];
  coins: number;
}) {
  const handleClick = (e: MouseEvent) => {
    onEarn(e.clientX, e.clientY);
  };

  return (
    <motion.div
      key="clicker"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center space-y-12"
    >
      <div className="w-full flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 text-[#8b5e3c]">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <span className="font-mono text-sm uppercase tracking-widest text-[#8b5e3c]">Node: Clicker-v1.1</span>
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Verse Miner</h2>
        
        <div className="relative group">
          {/* Glowing backdrops */}
          <div className="absolute inset-0 bg-yellow-500 rounded-full filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          
            <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="w-64 h-64 rounded-[2.5rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-[8px] border-white overflow-hidden flex items-center justify-center relative z-10 transition-transform active:rotate-2 hover:scale-[1.02]"
          >
            <img 
               src="https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png" 
               alt="Verse Clicker Logo"
               className="w-full h-full object-cover !block"
               referrerPolicy="no-referrer"
            />
          </motion.button>
        </div>

        <p className="text-gray-500 animate-pulse font-mono uppercase tracking-[0.3em] text-xs">Tap Logo to Mine Verse</p>
        <h3 className="text-2xl font-black text-yellow-500 font-mono tracking-tighter">
          Assets: {coins}
        </h3>
      </div>

      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} />
      ))}
    </motion.div>
  );
}

const QUIZ_DATA: Record<string, [string, string, string, string, string, string][]> = {
  "Verse": [
    ["Verse is associated with?", "Crypto ecosystem", "Bank", "Game", "Movie", "A"],
    ["Verse token is used for?", "Utility", "Food", "Car", "TV", "A"],
    ["Verse belongs to?", "Bitcoin.com", "Google", "Apple", "Meta", "A"],
    ["Verse supports?", "Web3", "Web1", "Web0", "Offline", "A"],
    ["Verse rewards users in?", "VERSE token", "Cash", "Gold", "Card", "A"]
  ],
  "Bitcoin.com": [
    ["Bitcoin.com provides?", "Wallet", "Video", "Game", "Music", "A"],
    ["Supports which asset?", "Bitcoin", "Only USD", "Only gold", "Only cash", "A"],
    ["Bitcoin.com is part of?", "Crypto ecosystem", "TV network", "Bank system", "Game system", "A"],
    ["Main function?", "Buy/Sell crypto", "Watch movies", "Play games", "Ads", "A"],
    ["Wallet type?", "Digital wallet", "Paper wallet", "TV wallet", "Game wallet", "A"]
  ],
  "Verse Community": [
    ["Verse community is for?", "Crypto users", "Farmers", "Doctors", "Teachers", "A"],
    ["Main goal?", "Learning Web3", "Farming", "Banking", "Sports", "A"],
    ["Rewards?", "VERSE token", "Cash", "Gold", "Points only", "A"],
    ["Community type?", "Global", "Local only", "Offline", "Private bank", "A"],
    ["Focus?", "Education + Crypto", "Only games", "Only ads", "Only TV", "A"]
  ],
  "Web2": [
    ["Example Web2?", "Facebook", "Bitcoin", "NFT", "DAO", "A"],
    ["Web2 is?", "Centralized", "Decentralized", "Offline", "Blockchain", "A"],
    ["Controlled by?", "Big tech", "Users", "Miners", "Nodes", "A"],
    ["Data type?", "Central server", "Blockchain", "Offline", "Paper", "A"],
    ["User role?", "Passive", "Validator", "Miner", "Node", "A"]
  ],
  "Web3": [
    ["Web3 is based on?", "Blockchain", "Bank", "Paper", "TV", "A"],
    ["Apps called?", "DApps", "Apps", "Sites", "Servers", "A"],
    ["Feature?", "Decentralized", "Centralized", "Offline", "Manual", "A"],
    ["Ownership?", "User controlled", "Bank controlled", "Company controlled", "TV controlled", "A"],
    ["Trust model?", "Trustless", "Fully trusted", "Manual", "Offline", "A"]
  ],
  "Verse Ecosystem": [
    ["Built on?", "Bitcoin.com", "Google", "Apple", "Meta", "A"],
    ["Token?", "VERSE", "BTC", "ETH", "USDT", "A"],
    ["Type?", "DeFi ecosystem", "Bank system", "TV system", "Game only", "A"],
    ["Goal?", "Crypto adoption", "Bank control", "Offline trade", "Paper money", "A"],
    ["Includes?", "Wallet + tools", "Only games", "Only ads", "Only videos", "A"]
  ],
  "Verse Dashboard": [
    ["Shows?", "Wallet balance", "Movies", "Games", "Ads", "A"],
    ["Used for?", "Manage crypto", "Watch TV", "Play games", "Social media", "A"],
    ["Part of?", "Verse ecosystem", "Google", "Apple", "Meta", "A"],
    ["Tracks?", "Transactions", "Videos", "Photos", "Music", "A"],
    ["Function?", "Portfolio view", "Entertainment", "Ads", "Games", "A"]
  ],
  "Verse Bangladesh": [
    ["Focus?", "Crypto adoption", "Farming", "Sports", "Movies", "A"],
    ["Part of?", "Verse global", "Local bank", "TV channel", "Government", "A"],
    ["Users learn?", "Web3", "Cooking", "Driving", "Sports", "A"],
    ["Goal?", "Education", "Entertainment", "Banking", "Offline trade", "A"],
    ["Type?", "Community", "Company", "Bank", "TV", "A"]
  ],
  "Verse Pakistan": [
    ["Promotes?", "Web3", "Banking", "TV", "Games", "A"],
    ["System?", "Blockchain", "Offline", "Paper", "TV", "A"],
    ["Goal?", "Adoption", "Restriction", "Control", "Ban crypto", "A"],
    ["Users learn?", "Crypto", "Sports", "Movies", "Cooking", "A"],
    ["Type?", "Community", "Bank", "TV", "Game", "A"]
  ],
  "Verse India": [
    ["Focus?", "Blockchain", "Movies", "Food", "Sports", "A"],
    ["Goal?", "Web3 growth", "Banking", "TV", "Offline trade", "A"],
    ["System?", "Decentralized", "Centralized", "Offline", "Paper", "A"],
    ["Users learn?", "Crypto", "Games", "Sports", "Cooking", "A"],
    ["Type?", "Community", "Bank", "TV", "Shop", "A"]
  ],
  "Verse Newbies": [
    ["Newbies are?", "Beginners", "Experts", "Admins", "Bots", "A"],
    ["Learn?", "Basics", "Advanced only", "Nothing", "Banking", "A"],
    ["Guided by?", "Tutorials", "Ads", "TV", "Games", "A"],
    ["Goal?", "Start Web3", "Stop crypto", "Banking", "Offline", "A"],
    ["Level?", "Entry", "Pro", "Admin", "Master", "A"]
  ],
  "Verse Learn": [
    ["Purpose?", "Education", "Gaming", "Ads", "Trading", "A"],
    ["Focus?", "Web3", "Movies", "Sports", "Banking", "A"],
    ["Type?", "Learning platform", "Game", "TV", "Bank", "A"],
    ["Helps?", "Crypto knowledge", "Entertainment", "Ads", "Offline work", "A"],
    ["Content?", "Tutorials", "Movies", "Songs", "Games", "A"]
  ],
  "Verse GitHub": [
    ["Used for?", "Code", "Video", "Music", "Game", "A"],
    ["Platform?", "Developers", "Farmers", "Doctors", "Teachers", "A"],
    ["Stores?", "Project code", "Movies", "Ads", "Songs", "A"],
    ["Purpose?", "Collaboration", "Entertainment", "Banking", "Sports", "A"],
    ["Type?", "Development", "TV", "Game", "Shop", "A"]
  ],
  "stone_brb": [
    ["Role?", "Community leader", "Bank CEO", "Doctor", "Player", "A"],
    ["Supports?", "Verse ecosystem", "Bank system", "TV", "Sports", "A"],
    ["Function?", "Guide users", "Sell products", "Watch TV", "Play games", "A"],
    ["Type?", "Admin", "User", "Bot", "Guest", "A"],
    ["Associated with?", "Verse community", "Google", "Meta", "Apple", "A"]
  ]
};

function QuizGame({ onBack, onWin }: { onBack: () => void; onWin: (bonus: number) => void }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const topics = Object.keys(QUIZ_DATA);
  const currentQuestions = selectedTopic ? QUIZ_DATA[selectedTopic] : [];

  const handleAnswer = (choice: string) => {
    const correctChoice = currentQuestions[currentStep][5];
    if (choice === correctChoice) {
      setResult('correct');
      onWin(10);
      setTimeout(() => {
        if (currentStep < currentQuestions.length - 1) {
          setCurrentStep(prev => prev + 1);
          setResult(null);
        } else {
          // Finished topic
          setResult(null);
          setCurrentStep(0);
          setSelectedTopic(null);
        }
      }, 1500);
    } else {
      setResult('wrong');
      setTimeout(() => setResult(null), 1000);
    }
  };

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="w-full flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <button 
          onClick={selectedTopic ? () => setSelectedTopic(null) : onBack} 
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 text-[#8b5e3c]"
        >
          <ArrowLeft className="w-5 h-5" /> {selectedTopic ? 'Topics' : 'Back'}
        </button>
        {selectedTopic && (
          <div className="flex gap-1.5">
            {currentQuestions.map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-1 rounded-full transition-colors ${i === currentStep ? 'bg-[#c0a080]' : i < currentStep ? 'bg-emerald-500' : 'bg-gray-100'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="topic-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-[#c0a080]/50 transition-all text-left group hover:bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8b5e3c] group-hover:text-[#c0a080] transition-colors">Topic</span>
                  <Brain className="w-4 h-4 text-gray-200 group-hover:text-[#c0a080] transition-colors" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">{topic}</h4>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-gray-100 rounded-3xl p-8 space-y-8 relative overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c0a080] opacity-5 filter blur-3xl" />
            
            <div className="space-y-2">
              <span className="text-[#8b5e3c] font-mono text-sm uppercase tracking-widest">
                {selectedTopic} &bull; Question {currentStep + 1}
              </span>
              <h3 className="text-3xl font-bold text-gray-900">{currentQuestions[currentStep][0]}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((choice, i) => {
                const optionText = currentQuestions[currentStep][i + 1];
                if (!optionText) return null;
                return (
                  <button
                    key={choice}
                    onClick={() => handleAnswer(choice)}
                    className="p-6 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-left font-medium transition-all hover:scale-[1.02] active:scale-95 group shadow-sm"
                  >
                    <span className="inline-block w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 text-center leading-8 text-xs font-bold mr-4 text-[#8b5e3c] group-hover:text-[#c0a080] transition-colors">
                      {choice}
                    </span>
                    <span className="text-gray-700">{optionText}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
                    result === 'correct' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {result === 'correct' ? <Trophy className="w-5 h-5" /> : null}
                  {result === 'correct' ? 'Brilliant! +10 Verse earned' : 'Nice try! Analyze and repeat.'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WalletSimulator({ 
  balance, 
  tokenBalances, 
  marketData, 
  lastSync,
  lastSave,
  history, 
  onBack, 
  onReceive, 
  onSend,
  onSwap
}: { 
  balance: number; 
  tokenBalances: Record<string, number>;
  marketData: Record<string, MarketData>;
  lastSync: Date;
  lastSave: Date | null;
  history: Transaction[];
  onBack: () => void;
  onReceive: (amt: number) => void;
  onSend: (amt: number) => boolean;
  onSwap: (from: string, to: string, fromAmt: number, toAmt: number) => boolean;
}) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'swap'>('portfolio');
  const [swapFrom, setSwapFrom] = useState<'USD' | string>('USD');
  const [swapTo, setSwapTo] = useState<string>('VERSE');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const getAvailableBalance = () => {
    if (swapFrom === 'USD') return balance;
    return tokenBalances[swapFrom] || 0;
  };

  const setMaxBalance = () => {
    setSwapAmount(getAvailableBalance().toString());
  };

  const getEstimatedReturn = () => {
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) return 0;

    let usdValue = 0;
    if (swapFrom === 'USD') {
      usdValue = amt;
    } else {
      usdValue = amt * (marketData[swapFrom]?.price || 0);
    }

    if (swapTo === 'USD') {
      return usdValue;
    } else {
      const toPrice = marketData[swapTo]?.price || 1;
      return usdValue / toPrice;
    }
  };

  const handleSwap = () => {
    const amt = parseFloat(swapAmount);
    const returnAmt = getEstimatedReturn();
    if (isNaN(amt) || amt <= 0) return;

    const success = onSwap(swapFrom, swapTo, amt, returnAmt);
    if (success) {
      setSwapAmount('');
    } else {
      setError("Insufficient funds for swap!");
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleSend = () => {
    const success = onSend(10);
    if (!success) {
      setError("Insufficient Balance!");
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Wallet Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-100 p-4 rounded-3xl shadow-sm gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button onClick={onBack} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors flex items-center justify-center gap-2 text-[#8b5e3c]">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          {lastSave && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#8b5e3c] font-mono uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Synced: {lastSave.toLocaleTimeString()}
            </div>
          )}
        </div>
        <div className="flex bg-gray-50 p-1 rounded-2xl w-full sm:w-auto border border-gray-100">
          {(['portfolio', 'market', 'swap'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-[#c0a080] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'portfolio' && (
              <motion.div
                key="tab-portfolio"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Main Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-white/10">
                  <div className="absolute top-0 right-0 p-8">
                    <Zap className="w-12 h-12 text-white/20 fill-current" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32 filter blur-3xl" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-white/60 tracking-[0.3em] uppercase text-xs">Verse Platinum</span>
                      <div className="w-12 h-8 rounded-md bg-white/20 backdrop-blur-sm border border-white/10" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-white/60 text-sm font-medium">Total App Balance</p>
                      <h2 className="text-5xl font-black text-white tracking-tighter">
                        ${balance.toLocaleString()} <span className="text-2xl font-medium text-emerald-300">USD</span>
                      </h2>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => onReceive(10)} className="flex-1 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                        <Plus className="w-5 h-5" /> Deposit
                      </button>
                      <button onClick={handleSend} className="flex-1 py-4 bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                        <Minus className="w-5 h-5" /> Withdraw
                      </button>
                    </div>
                  </div>
                </div>

                {/* Assets List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" /> Your Assets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SUPPORTED_TOKENS.map(token => (
                      <div key={token.symbol} className="bg-white border border-gray-100 p-6 rounded-[2rem] hover:border-[#c0a080]/30 transition-colors shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={token.icon} alt={token.symbol} className="w-10 h-10 rounded-full shadow-md border border-gray-50" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-gray-900">{token.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-gray-900">{tokenBalances[token.symbol]?.toFixed(4) || '0.0000'}</p>
                          <p className="text-sm text-gray-400 font-mono">
                            ≈ ${( (tokenBalances[token.symbol] || 0) * (marketData[token.symbol]?.price || 0) ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'market' && (
              <motion.div
                key="tab-market"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <CandlestickChart className="w-5 h-5 text-emerald-500" /> Live Market Feed
                    </h4>
                    <p className="text-[10px] text-[#8b5e3c] font-mono">Real-time data from global exchanges</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-emerald-500 animate-pulse flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> Live Connection
                    </span>
                    <span className="text-[9px] text-[#5e402a] font-mono uppercase tracking-tighter">
                      Updated: {lastSync.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-400">Asset</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-400">Price</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-400">24h Change</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-400 hidden sm:table-cell">Future Trend</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-400 hidden md:table-cell">Chart</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {SUPPORTED_TOKENS.map(token => {
                        const data = marketData[token.symbol];
                        if (!data) return null; // Protective check
                        
                        return (
                          <tr key={token.symbol} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-3">
                                <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full shadow-sm" referrerPolicy="no-referrer" />
                                <div>
                                  <p className="font-bold text-gray-900">{token.name}</p>
                                  <p className="text-[10px] font-mono text-gray-400">{token.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <motion.p
                                key={data.price}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                className="font-mono font-bold text-gray-900 text-sm"
                              >
                                ${data.price < 1 ? data.price.toFixed(4) : data.price.toLocaleString()}
                              </motion.p>
                            </td>
                            <td className="px-6 py-6">
                              <span className={`text-sm font-bold ${data.change24h >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-6 hidden sm:table-cell">
                              <div className="flex items-center gap-2">
                                {data.prediction === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                {data.prediction === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                                {data.prediction === 'steady' && <Minus className="w-4 h-4 text-gray-300" />}
                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                  data.prediction === 'up' ? 'text-emerald-500' : 
                                  data.prediction === 'down' ? 'text-red-500' : 
                                  'text-gray-300'
                                }`}>
                                  {data.prediction || 'Steady'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-6 hidden md:table-cell">
                              <div className="flex items-end gap-1 h-8">
                                {data.sparkline.map((val, i) => {
                                  const max = Math.max(...(data.sparkline || [0.0001]), 0.0001);
                                  const height = max > 0 ? ( (val || 0) / max) * 100 : 0;
                                  return (
                                    <div 
                                      key={i} 
                                      className={`w-1 rounded-full ${data.change24h >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                      style={{ 
                                        height: `${height}%`,
                                        opacity: 0.3 + (i / data.sparkline.length) * 0.7
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'swap' && (
              <motion.div
                key="tab-swap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-bold flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-500" /> Token Swap
                </h4>
                
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-xl">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-gray-400">You Pay</label>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-gray-400 font-mono">Available: {getAvailableBalance().toFixed(4)}</span>
                        <button 
                          onClick={setMaxBalance}
                          className="text-[10px] bg-[#c0a080]/10 text-[#8b5e3c] px-2 py-0.5 rounded-full hover:bg-[#c0a080]/20 transition-colors font-bold"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-3xl p-4 flex items-center gap-4 focus-within:border-[#c0a080] border border-gray-100 transition-all">
                      <select 
                        value={swapFrom}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapFrom(val);
                          if (val !== 'USD' && swapTo !== 'USD') setSwapTo('USD');
                        }}
                        className="bg-transparent border-none outline-none font-bold text-lg min-w-[100px] text-gray-900"
                      >
                        <option value="USD">USD</option>
                        {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                      </select>
                      <input 
                        type="number" 
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent border-none outline-none text-right flex-1 text-2xl font-black text-gray-900 placeholder-gray-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center -my-2 relative z-10">
                    <button 
                      onClick={() => {
                        const temp = swapFrom;
                        setSwapFrom(swapTo);
                        setSwapTo(temp);
                      }}
                      className="p-3 bg-[#c0a080] text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-gray-400 ml-2">You Receive (Est.)</label>
                    <div className="bg-gray-50 rounded-3xl p-6 flex items-center justify-between border border-gray-100">
                      <select 
                        value={swapTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapTo(val);
                          if (val !== 'USD' && swapFrom !== 'USD') setSwapFrom('USD');
                        }}
                        className="bg-transparent border-none outline-none font-bold text-lg min-w-[100px] text-gray-900"
                      >
                        <option value="USD">USD</option>
                        {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                      </select>
                      <p className="text-2xl font-black text-[#8b5e3c]">
                        {getEstimatedReturn().toFixed(swapTo === 'USD' ? 2 : 6)}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleSwap}
                    disabled={!swapAmount || parseFloat(swapAmount) <= 0}
                    className="w-full py-5 bg-[#c0a080] hover:bg-[#d4b496] text-white font-black rounded-3xl transition-all shadow-md disabled:opacity-50 disabled:grayscale uppercase tracking-widest"
                  >
                    Confirm Swap
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <History className="w-4 h-4" /> Activity
            </h4>
            <div className="space-y-6">
              {history.length > 0 ? history.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 group">
                  <div className={`p-3 rounded-2xl ${
                    tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-500' : 
                    tx.type === 'earned' ? 'bg-[#c0a080]/10 text-[#8b5e3c]' :
                    tx.type === 'swap' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.type === 'receive' ? <Plus className="w-4 h-4" /> : 
                     tx.type === 'earned' ? <Zap className="w-4 h-4" /> :
                     tx.type === 'swap' ? <ArrowRightLeft className="w-4 h-4" /> :
                     <Minus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-gray-900 group-hover:text-black transition-colors">{tx.description}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{new Date(tx.date).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${
                      ['receive', 'earned'].includes(tx.type) ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {['receive', 'earned'].includes(tx.type) ? '+' : '-'}{tx.amount}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-300 text-sm italic">No recent anomalies detected.</p>
                </div>
              )}
            </div>
            
            <button className="w-full py-4 text-xs font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors border-t border-gray-50 pt-6">
              View Full History
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center text-sm font-bold"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TransactionRow({ tx }: { tx: Transaction; key?: any }) {
  const isPositive = tx.type !== 'send';
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {tx.type === 'earned' ? <Zap className="w-4 h-4" /> : isPositive ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">{tx.description}</p>
          <p className="text-xs text-gray-400 font-mono">{tx.date.toLocaleTimeString()}</p>
        </div>
      </div>
      <span className={`font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
        {isPositive ? '+' : '-'}{tx.amount}
      </span>
    </div>
  );
}
