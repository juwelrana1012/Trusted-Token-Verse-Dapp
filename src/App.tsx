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
  Briefcase
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
  { id: 'verse-2', name: 'Verse', symbol: 'VERSE', icon: 'https://i.ibb.co.com/KpD8qQk3/9i4nkq.jpg', color: 'text-yellow-500' },
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
      className="absolute pointer-events-none text-yellow-400 font-bold z-50"
    >
      +1
    </motion.div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [username, setUsername] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
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
    
    // 2 second duration loading simulation (step 1% every 20ms)
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (savedUser) setUsername(savedUser);
            setIsLoadingUser(false);
          }, 300); // 300ms delay for transition
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Tip rotation every 1 second
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
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
    VERSE: { price: 0.05, change24h: 2.5, sparkline: Array(10).fill(0.05) },
    BTC: { price: 65000, change24h: 0, sparkline: Array(10).fill(65000) },
    ETH: { price: 3400, change24h: 0, sparkline: Array(10).fill(3400) },
    SOL: { price: 145, change24h: 0, sparkline: Array(10).fill(145) },
    BNB: { price: 580, change24h: 0, sparkline: Array(10).fill(580) },
    ADA: { price: 0.45, change24h: 0, sparkline: Array(10).fill(0.45) },
    DOT: { price: 7.2, change24h: 0, sparkline: Array(10).fill(7.2) },
    MATIC: { price: 0.72, change24h: 0, sparkline: Array(10).fill(0.72) },
    DOGE: { price: 0.15, change24h: 0, sparkline: Array(10).fill(0.15) },
    USDT: { price: 1.0, change24h: 0, sparkline: Array(10).fill(1.0) },
    LTC: { price: 80, change24h: 0, sparkline: Array(10).fill(80) },
    XRP: { price: 0.60, change24h: 0, sparkline: Array(10).fill(0.60) },
    LINK: { price: 18, change24h: 0, sparkline: Array(10).fill(18) },
  });

  const [history, setHistory] = useState<Transaction[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showLinks, setShowLinks] = useState(false);

  // Market Price Simulation & Real Data Fetching
  useEffect(() => {
    if (gameState !== 'home' && gameState !== 'wallet') return;

    const fetchRealPrices = async () => {
      try {
        const ids = SUPPORTED_TOKENS.filter(t => t.id !== 'verse-2').map(t => t.id).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();
        
        setMarketData(prev => {
          const updated = { ...prev };
          SUPPORTED_TOKENS.forEach(token => {
            if (token.id === 'verse-2') return;
            const coinData = data[token.id];
            if (coinData) {
              updated[token.symbol] = {
                price: coinData.usd,
                change24h: coinData.usd_24h_change || 0,
                sparkline: [...(prev[token.symbol]?.sparkline || Array(10).fill(coinData.usd)).slice(1), coinData.usd]
              };
            }
          });
          return updated;
        });
      } catch (err) {
        console.error("Failed to fetch real prices:", err);
      }
    };

    // Initial fetch
    fetchRealPrices();

    const interval = setInterval(() => {
      // Fetch real prices every 30 seconds to stay updated but respect rate limits
      fetchRealPrices();

      // Keep simulating Verse price locally as it's the game currency
      setMarketData(prev => {
        const newData = { ...prev };
        const symbol = 'VERSE';
        const change = (Math.random() - 0.45) * 0.008; // Slight upward bias for Verse
        const newPrice = newData[symbol].price * (1 + change);
        const newSparkline = [...newData[symbol].sparkline.slice(1), newPrice];
        
        newData[symbol] = {
          ...newData[symbol],
          price: newPrice,
          change24h: newData[symbol].change24h + (change * 100),
          sparkline: newSparkline
        };
        return newData;
      });
    }, 10000); // Check for updates and simulate Verse every 10s

    return () => clearInterval(interval);
  }, [gameState]);

  // Auto-focus the username input if it exists
  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = tempUsername.trim();
    if (cleanName) {
      setIsLoggingIn(true);
      
      setTimeout(() => {
        localStorage.setItem('verseUser', cleanName);
        setUsername(cleanName);
        setIsLoggingIn(false);
      }, 2000);
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
    <div className="min-h-screen bg-[#0d1117] text-gray-100 font-sans selection:bg-yellow-500 selection:text-black">
      {/* Fixed Top Logo Header */}
      <div className="fixed top-0 left-0 w-full h-[55px] bg-[#111827] flex items-center px-[12px] z-[10000] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        <img 
          src="https://i.ibb.co.com/KpD8qQk3/9i4nkq.jpg" 
          alt="Verse Logo" 
          className="h-[35px] w-auto mr-[10px] !block"
          referrerPolicy="no-referrer"
        />
        <span className="text-white text-[18px] font-bold tracking-[1px]">VERSE GAME HUB</span>
      </div>

      <AnimatePresence mode="wait">
        {isLoadingUser ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10001] bg-gradient-to-br from-[#020617] to-[#0f172a] flex flex-col items-center justify-center p-6"
          >
            <div className="mb-8 text-center">
              <div className="text-3xl font-black text-green-500 tracking-tighter">🎮 VERSE HUB</div>
            </div>

            {/* Spinner */}
            <div className="relative w-[60px] h-[60px] mb-8">
              <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"
                style={{ animationDuration: '1s' }}
              ></div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-[220px] space-y-3">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(34,197,94,0.5)]"
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
            className="fixed inset-0 z-[9999] bg-[#0d1117] flex items-center justify-center p-6 pt-[55px]"
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
                    <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-widest animate-pulse">
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
                    src="https://i.ibb.co.com/KpD8qQk3/9i4nkq.jpg" 
                    alt="Verse Logo" 
                    className="w-32 h-auto mx-auto !block"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Identity Access</h2>
                    <p className="text-gray-400">Enter your moniker to access the Verse Mini Hub</p>
                  </div>
                  <form onSubmit={handleStart} className="space-y-4">
                    <input 
                      type="text" 
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="Username..."
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none transition-all text-center text-xl font-bold"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={!tempUsername.trim()}
                      className="w-full py-4 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all disabled:opacity-50"
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
            <header className="border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md sticky top-[55px] z-40 mt-[55px]">
              <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end items-center">
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Player: {username}</span>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-mono text-lg font-bold">{coins}</span>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-800 hidden sm:block" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Wallet Balance</span>
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-500" />
                      <span className="font-mono text-lg font-bold text-emerald-400">{walletBalance}</span>
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
                      <h2 className="text-4xl font-black text-white sm:text-5xl leading-tight">
                        Welcome back, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">{username}</span>
                      </h2>
                      <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                        Your decentralized gateway to the Verse network. 
                        Earn, play, and explore the ecosystem.
                      </p>
                    </section>

                    {/* Community Section */}
                    <section className="text-center">
                      <button 
                        onClick={() => setShowLinks(!showLinks)}
                        className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] uppercase tracking-wider text-sm"
                      >
                        {showLinks ? 'Close Community' : 'Join Our Community'}
                      </button>

                      <AnimatePresence>
                        {showLinks && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="overflow-hidden mt-6 bg-gray-900 border border-gray-800 rounded-[2rem] p-6 max-w-md mx-auto space-y-3 shadow-2xl"
                          >
                            <a href="https://t.me/GetVerse" target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95">
                              1: VERSE TELEGRAM GROUP
                            </a>
                            <a href="https://twitter.com/VerseEcosystem" target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95">
                              2: VERSE TWITTER COMMUNITY
                            </a>
                            <a href="https://twitter.com/BitcoinCom" target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95">
                              3: VERSE OFFICIAL TWITTER
                            </a>
                            <a href="http://dashboard.vgdh.io" target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95">
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
              onEarn={(x, y) => handleEarn(1, 'clicker', x, y)}
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

            <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-800 mt-12 text-center">
              <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.2em]">
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
      className={`relative group overflow-hidden bg-gray-900 border border-gray-800 rounded-3xl p-8 text-left transition-all hover:border-gray-700`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 filter blur-3xl group-hover:opacity-20 transition-opacity`} />
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} inline-block mb-6 text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
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
      <div className="w-full flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-gray-400">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <span className="font-mono text-sm uppercase tracking-widest text-gray-500">Node: Clicker-v1.1</span>
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Verse Miner</h2>
        
        <div className="relative group">
          {/* Glowing backdrops */}
          <div className="absolute inset-0 bg-yellow-500 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="w-64 h-64 rounded-[2.5rem] shadow-[0_0_50px_rgba(234,179,8,0.3)] border-[8px] border-black overflow-hidden flex items-center justify-center relative z-10 transition-transform active:rotate-2 hover:scale-[1.02]"
          >
            <img 
               src="https://i.ibb.co.com/KpD8qQk3/9i4nkq.jpg" 
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
      <div className="w-full flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
        <button 
          onClick={selectedTopic ? () => setSelectedTopic(null) : onBack} 
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-gray-400"
        >
          <ArrowLeft className="w-5 h-5" /> {selectedTopic ? 'Topics' : 'Back'}
        </button>
        {selectedTopic && (
          <div className="flex gap-1.5">
            {currentQuestions.map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-1 rounded-full transition-colors ${i === currentStep ? 'bg-purple-500' : i < currentStep ? 'bg-emerald-500' : 'bg-gray-800'}`} 
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
                className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-purple-500/50 transition-all text-left group hover:bg-gray-800/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-purple-400 transition-colors">Topic</span>
                  <Brain className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors" />
                </div>
                <h4 className="font-bold text-lg text-white">{topic}</h4>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 filter blur-3xl" />
            
            <div className="space-y-2">
              <span className="text-purple-400 font-mono text-sm uppercase tracking-widest">
                {selectedTopic} &bull; Question {currentStep + 1}
              </span>
              <h3 className="text-3xl font-bold text-white">{currentQuestions[currentStep][0]}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((choice, i) => {
                const optionText = currentQuestions[currentStep][i + 1];
                if (!optionText) return null;
                return (
                  <button
                    key={choice}
                    onClick={() => handleAnswer(choice)}
                    className="p-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-left font-medium transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    <span className="inline-block w-8 h-8 rounded-lg bg-gray-900 border border-gray-700 text-center leading-8 text-xs font-bold mr-4 text-gray-500 group-hover:text-purple-400 transition-colors">
                      {choice}
                    </span>
                    {optionText}
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
  history, 
  onBack, 
  onReceive, 
  onSend,
  onSwap
}: { 
  balance: number; 
  tokenBalances: Record<string, number>;
  marketData: Record<string, MarketData>;
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
      usdValue = amt * marketData[swapFrom].price;
    }

    if (swapTo === 'USD') {
      return usdValue;
    } else {
      return usdValue / marketData[swapTo].price;
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
      <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-gray-900/50 p-4 rounded-3xl border border-gray-800 gap-4">
        <button onClick={onBack} className="w-full sm:w-auto p-3 hover:bg-gray-800 rounded-2xl transition-colors flex items-center justify-center gap-2 text-gray-400">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex bg-gray-800/50 p-1 rounded-2xl w-full sm:w-auto">
          {(['portfolio', 'market', 'swap'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
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
                      <div key={token.symbol} className="bg-gray-900 border border-gray-800 p-6 rounded-[2rem] hover:border-gray-700 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={token.icon} alt={token.symbol} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold">{token.name}</p>
                            <p className="text-xs text-gray-500">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-black">{tokenBalances[token.symbol]?.toFixed(4)}</p>
                          <p className="text-sm text-gray-500 font-mono">
                            ≈ ${(tokenBalances[token.symbol] * marketData[token.symbol].price).toLocaleString()}
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
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <CandlestickChart className="w-5 h-5 text-emerald-500" /> Live Market Feed
                  </h4>
                  <span className="text-xs font-mono text-emerald-500 animate-pulse">● Live Data</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 text-left">
                      <tr>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">Asset</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">Price</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">24h Change</th>
                        <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500 hidden sm:table-cell">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {SUPPORTED_TOKENS.map(token => {
                        const data = marketData[token.symbol];
                        return (
                          <tr key={token.symbol} className="hover:bg-gray-800/30 transition-colors group">
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-3">
                                <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                                <div>
                                  <p className="font-bold">{token.name}</p>
                                  <p className="text-[10px] font-mono text-gray-500">{token.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <motion.p
                                key={data.price}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                className="font-mono font-bold text-white"
                              >
                                ${data.price < 1 ? data.price.toFixed(4) : data.price.toLocaleString()}
                              </motion.p>
                            </td>
                            <td className="px-6 py-6">
                              <span className={`text-sm font-bold ${data.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-6 hidden sm:table-cell">
                              <div className="flex items-end gap-1 h-8">
                                {data.sparkline.map((val, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-1 rounded-full ${data.change24h >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ 
                                      height: `${(val / Math.max(...data.sparkline)) * 100}%`,
                                      opacity: 0.3 + (i / data.sparkline.length) * 0.7
                                    }}
                                  />
                                ))}
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
                
                <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-gray-500">You Pay</label>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-gray-500">Available: {getAvailableBalance().toFixed(4)}</span>
                        <button 
                          onClick={setMaxBalance}
                          className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full hover:bg-emerald-500/30 transition-colors font-bold"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-3xl p-4 flex items-center gap-4 focus-within:border-emerald-500 border border-transparent transition-all">
                      <select 
                        value={swapFrom}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapFrom(val);
                          if (val !== 'USD' && swapTo !== 'USD') setSwapTo('USD');
                        }}
                        className="bg-transparent border-none outline-none font-bold text-lg min-w-[100px]"
                      >
                        <option value="USD">USD</option>
                        {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                      </select>
                      <input 
                        type="number" 
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent border-none outline-none text-right flex-1 text-2xl font-black text-white"
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
                      className="p-3 bg-emerald-500 text-black rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-gray-500 ml-2">You Receive (Est.)</label>
                    <div className="bg-gray-800 rounded-3xl p-6 flex items-center justify-between border border-transparent">
                      <select 
                        value={swapTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapTo(val);
                          if (val !== 'USD' && swapFrom !== 'USD') setSwapFrom('USD');
                        }}
                        className="bg-transparent border-none outline-none font-bold text-lg min-w-[100px]"
                      >
                        <option value="USD">USD</option>
                        {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                      </select>
                      <p className="text-2xl font-black text-emerald-400">
                        {getEstimatedReturn().toFixed(swapTo === 'USD' ? 2 : 6)}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleSwap}
                    disabled={!swapAmount || parseFloat(swapAmount) <= 0}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-3xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:grayscale uppercase tracking-widest"
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
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 space-y-6">
            <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <History className="w-4 h-4" /> Activity
            </h4>
            <div className="space-y-6">
              {history.length > 0 ? history.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 group">
                  <div className={`p-3 rounded-2xl ${
                    tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-500' : 
                    tx.type === 'earned' ? 'bg-yellow-500/10 text-yellow-500' :
                    tx.type === 'swap' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.type === 'receive' ? <Plus className="w-4 h-4" /> : 
                     tx.type === 'earned' ? <Zap className="w-4 h-4" /> :
                     tx.type === 'swap' ? <ArrowRightLeft className="w-4 h-4" /> :
                     <Minus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-white transition-colors">{tx.description}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{new Date(tx.date).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${
                      ['receive', 'earned'].includes(tx.type) ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {['receive', 'earned'].includes(tx.type) ? '+' : '-'}{tx.amount}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm italic">No recent anomalies detected.</p>
                </div>
              )}
            </div>
            
            <button className="w-full py-4 text-xs font-mono uppercase tracking-[0.3em] text-gray-500 hover:text-emerald-500 transition-colors border-t border-gray-800 pt-6">
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
    <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {tx.type === 'earned' ? <Zap className="w-4 h-4" /> : isPositive ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
        </div>
        <div>
          <p className="font-bold text-sm text-white">{tx.description}</p>
          <p className="text-xs text-gray-500 font-mono">{tx.date.toLocaleTimeString()}</p>
        </div>
      </div>
      <span className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : '-'}{tx.amount}
      </span>
    </div>
  );
}
