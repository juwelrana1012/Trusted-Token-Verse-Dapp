/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BitcoinWalletDashboard from './components/BitcoinWalletDashboard';
import CryptoHistory from './components/CryptoHistory';
import ClaimReward from './components/ClaimReward';
import TelegramCommunityHub from './components/TelegramCommunityHub';
import WalletInfoCard from './components/WalletInfoCard';
import BottomGallery from './components/BottomGallery';
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
  Sparkles,
  Send,
  Mail,
  Download,
  RefreshCw,
  Percent,
  Flame,
  QrCode,
  Info,
  Check,
  Lock,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Globe,
  BookOpen,
  CalendarRange
} from 'lucide-react';
// --- Safe Storage Wrapper for Iframe Compatibility ---
const safeStorage = {
  memoryStorage: {} as Record<string, string>,
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return this.memoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      this.memoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      delete this.memoryStorage[key];
    }
  },
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (e) {
      this.memoryStorage = {};
    }
  },
  keys(): string[] {
    try {
      return Object.keys(window.localStorage);
    } catch (e) {
      return Object.keys(this.memoryStorage);
    }
  }
};

// --- Types ---
type GameState = 'home' | 'clicker' | 'quiz' | 'wallet' | 'bitcoinWallet' | 'cryptoHistory' | 'claimReward';

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

const maskEmail = (email: string | null): string => {
  if (!email) return '';
  const emailLower = email.toLowerCase().trim();
  if (emailLower === 'mdjuwelranajx127133@gmail.com' || emailLower === 'mdjuwelranajx127133') {
    return 'm...........@gmail.com';
  }
  if (email.includes('@')) {
    const parts = email.split('@');
    const firstChar = parts[0].length > 0 ? parts[0][0] : '';
    return `${firstChar}...........@${parts[1]}`;
  }
  if (email.length > 2) {
    return email.charAt(0) + '...' + email.charAt(email.length - 1);
  }
  return email;
};

const COMMUNITY_WEBSITE_SLIDES = [
  {
    subtitle: "HONORING MENTORS & LEADERS",
    title: "A Monumental Appreciation",
    content: "First of all a big thank you to my @stone_brb boss. Also expressing gratitude to all the responsible persons of the community, whose tireless efforts and contributions have made our community so strong and organized today.",
    detail: "The key to making a community strong is its members. A community truly thrives and becomes sustainable only through the combined efforts of each responsible and conscious member."
  },
  {
    subtitle: "OUR ULTIMATE PURPOSE",
    title: "Main Focus and Purpose",
    content: "The main focus and purpose of my Website is to introduce the future generation to the concept of “Verse” and ''Bitcoin.com wallet''And '' community'' as well as provide a basic understanding of cryptocurrency.",
    detail: "Through this game, users will learn—how to buy crypto, how to convert, and get a basic idea of market prices.\n\nI have tried my best so that through this game the new generation can gain atleast a basic knowledge and understand things simply.\n\nOne of the most important things in human life is the \"beginning\". Because, if one does not initiate something, then one does not develop any knowledge or idea about that subject. With this game I wanted to make that starting point easy and interesting.\n\nAlso, using this game a user can learn how to earn points and use those points to learn the basics of crypto marketing or trading."
  },
  {
    subtitle: "ECOSYSTEM DISCOVERY",
    title: "Detailed Overview of Features",
    content: "Our website has been designed to provide clear and easy-to-understand information about the Bitcoin.com Wallet and the Verse Ecosystem, helping both new and existing users learn more about the ecosystem.",
    detail: "Detailed Overview of Our Website Features:\nOur website has been designed to provide clear and easy-to-understand information about the Bitcoin.com Wallet and the Verse Ecosystem, helping both new and existing users learn more about the ecosystem."
  },
  {
    subtitle: "DIGITAL ASSETS PLATFORM",
    title: "Bitcoin.com Wallet Features",
    content: "In this section, we have provided a simple overview of what the Bitcoin.com Wallet is, how it works, and the features it offers.",
    detail: "Our goal is to help users gain a basic understanding of the wallet and its functionality in an easy and accessible way.\nOur website has been designed to provide clear and easy-to-understand information about the Bitcoin.com Wallet and the Verse Ecosystem, helping both new and existing users learn more about the ecosystem.\n\nWe have also included cryptocurrency market prices, trading-related information, crypto news, and other useful resources so that users can access important information from a single platform."
  },
  {
    subtitle: "CHRONICLES OF DECENTRALIZATION",
    title: "Crypto Founder and History",
    content: "This section focuses on the founders and history of popular cryptocurrencies. Learn who created a particular cryptocurrency and how the project grew.",
    detail: "Crypto Founder and History\nThis section focuses on the founders and history of popular cryptocurrencies. Here, you can learn:\n• Who created a particular cryptocurrency\n• Background information about the founder\n• How the project started\n• How the cryptocurrency gained popularity over time\n\nWe have presented this information in a simple format to help users understand the history of the crypto industry and the people behind some of its most influential projects.\n\nCurrently, we have included a limited number of popular cryptocurrencies. More projects and historical information will be added through future updates."
  },
  {
    subtitle: "INCENTIVIZED WALLET TRAINING",
    title: "Claim Daily Reward System",
    content: "In this section, we aim to explain how the reward system within the Bitcoin.com Wallet works.",
    detail: "Using practical examples, we demonstrate how users can participate in various reward opportunities and activities available through the Bitcoin.com Wallet. This helps new users better understand the platform before using the app and makes the overall experience easier to navigate."
  },
  {
    subtitle: "REINFORCING CONCEPTS",
    title: "Verse Community Knowledge Quiz",
    content: "We have included educational questions and community-related content to help users learn more about the Verse Community.",
    detail: "Through this section, users can test their knowledge, discover new information, and gain a deeper understanding of the Verse Ecosystem and its community."
  },
  {
    subtitle: "GLOBAL SOCIAL COLLABORATION",
    title: "Official Telegram Community Link",
    content: "Our website also includes a link to the official Telegram Community.",
    detail: "By joining our Telegram Community, you can connect with members from around the world, stay updated with the latest community news, participate in discussions, and learn about upcoming events and opportunities.\n\nWe have made an effort to highlight the purpose, activities, and benefits of being part of our community."
  },
  {
    subtitle: "COGNITIVE GRAPHICS & STUDY",
    title: "Ecosystem Learning Section",
    content: "In addition to written content, we use ecosystem-related images, diagrams, and visual materials to make learning easier and more engaging.",
    detail: "These resources help users better understand the Verse Ecosystem and Bitcoin.com Wallet, gain valuable knowledge, learn independently, and share that knowledge with others."
  },
  {
    subtitle: "BUILDING TOMORROW'S FUTURE",
    title: "Our Final Message",
    content: "Our goal is not only to provide information but also to create an educational platform where people can learn, share knowledge, and improve their understanding of Web3 and the crypto industry.",
    detail: "Thank you for visiting our website.\n\nJoin the Verse Community, learn new skills, share knowledge with others, and work together to build a better future for yourself and those around you."
  }
];

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
  const [username, setUsername] = useState<string | null>(() => safeStorage.getItem('verseUser'));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  
  // Custom Login Flow States
  const [appIsSignUp, setAppIsSignUp] = useState(false);
  const [telegramUser, setTelegramUser] = useState('');
  const [telegramPass, setTelegramPass] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [googleShowModalApp, setGoogleShowModalApp] = useState(false);
  const [customGoogleEmailApp, setCustomGoogleEmailApp] = useState('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'telegram'>('google');
  const [appAuthType, setAppAuthType] = useState<'standard' | 'google' | 'telegram'>(() => {
    return (safeStorage.getItem('verse_app_authtype') as any) || 'standard';
  });
  const [googleUsersApp] = useState([
    { name: 'Juwel Rana', email: 'mdjuwelranajx127133@gmail.com', avatar: 'https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg' },
    { name: 'Rana Jx', email: 'ranajx127@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
  ]);

  const [isConnectingApp, setIsConnectingApp] = useState(false);
  const [connectProgress, setConnectProgress] = useState(0);

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
    const savedUser = safeStorage.getItem('verseUser');
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
      const savedCoins = safeStorage.getItem(`verse_${username}_coins`);
      const savedBalance = safeStorage.getItem(`verse_${username}_balance`);
      const savedTokens = safeStorage.getItem(`verse_${username}_tokens`);
      const savedHistory = safeStorage.getItem(`verse_${username}_history`);

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
    safeStorage.setItem(`verse_${username}_coins`, coins.toString());
    setLastSaveTime(new Date());
  }, [coins, username, isDataLoaded]);

  useEffect(() => {
    if (!username || !isDataLoaded) return;
    safeStorage.setItem(`verse_${username}_balance`, walletBalance.toString());
    setLastSaveTime(new Date());
  }, [walletBalance, username, isDataLoaded]);

  useEffect(() => {
    if (!username || !isDataLoaded) return;
    safeStorage.setItem(`verse_${username}_tokens`, JSON.stringify(tokenBalances));
    setLastSaveTime(new Date());
  }, [tokenBalances, username, isDataLoaded]);

  useEffect(() => {
    if (!username || !isDataLoaded) return;
    safeStorage.setItem(`verse_${username}_history`, JSON.stringify(history));
    setLastSaveTime(new Date());
  }, [history, username, isDataLoaded]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showLinks, setShowLinks] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [isWelcomeExpanded, setIsWelcomeExpanded] = useState(false);
  const [homeSubState, setHomeSubState] = useState<'welcome' | 'features'>('welcome');
  const [focusSlideIndex, setFocusSlideIndex] = useState<number>(() => {
    const saved = safeStorage.getItem('verse_focus_slide_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showSlideDetail, setShowSlideDetail] = useState(false);

  useEffect(() => {
    safeStorage.setItem('verse_focus_slide_index', focusSlideIndex.toString());
  }, [focusSlideIndex]);

  useEffect(() => {
    safeStorage.setItem('verse_game_state', gameState);
  }, [gameState]);

  useEffect(() => {
    safeStorage.setItem('verse_home_sub_state', homeSubState);
  }, [homeSubState]);

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
      safeStorage.setItem('verseUser', cleanName);
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
      setTokenBalances(prev => ({
        ...prev,
        VERSE: (prev['VERSE'] || 0) + coins
      }));
      addTransaction('earned', coins, `Transferred ${coins} VERSE to Wallet`);
      setCoins(0);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#c0a080] selection:text-white">

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
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#02081f] via-[#051130] to-[#091b4f] flex items-center justify-center p-6 pt-[55px] overflow-y-auto"
          >
            {/* Ambient luxury colored bg glowing backdrops */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[110px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

            <AnimatePresence mode="wait">
              {isConnectingApp ? (
                <motion.div
                  key="logging-in"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="text-center space-y-6 relative z-10 max-w-sm"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {/* Pulsing glow rings */}
                    <div className="absolute inset-[-12px] bg-blue-500/10 rounded-full blur-md animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-400 border-r-indigo-500 border-l-sky-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
                  </div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-200 to-indigo-300 uppercase tracking-widest animate-pulse">
                    Connecting Portal...
                  </h2>
                  <p className="text-xs text-slate-400 font-bold font-mono tracking-wider">Please wait while your secure session is starting</p>
                  
                  {/* Dynamic Progress indicator */}
                  <div className="w-[240px] mx-auto space-y-2 pt-2">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-650 to-sky-400 transition-all duration-150 ease-out"
                        style={{ width: `${connectProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono font-bold">
                      <span>SECURE SYNCING</span>
                      <span>{Math.floor(connectProgress)}%</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div key="login-form-container" className="w-full max-w-md relative z-10 flex flex-col items-center gap-6">
                  
                  {/* BRAND HEADER & WELCOME MESSAGE */}
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center w-full px-4"
                  >
                    <div className="flex justify-center items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden shadow-2xl border-2 border-blue-500/30 p-1 bg-slate-950/80 transition-all hover:scale-110 duration-300">
                        <img
                          src="https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg"
                          alt="Bitcoin.com Wallet Logo"
                          className="w-full h-full object-cover rounded-[1.4rem]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden shadow-2xl border-2 border-blue-500/30 p-1 bg-slate-950/80 transition-all hover:scale-110 duration-300">
                        <img
                          src="https://i.ibb.co.com/gbFvzHdb/file-00000000fdd071fa8b2edad69edccb1f.png"
                          alt="Verse Ecosystem Logo"
                          className="w-full h-full object-cover rounded-[1.4rem]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                      Bitcoin.com <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Wallet</span>
                    </h1>
                    <p className="text-[11px] font-mono tracking-[0.2em] text-[#c0a080] font-black uppercase mt-1">AND VERSE ECOSYSTEM & ANALYTICS PORTAL</p>
                  </motion.div>

                  {/* SIGN IN INSTRUCTIONS DESCRIPTION CARD */}
                  <div className="bg-blue-950/50 border border-blue-500/20 rounded-[2rem] p-5 backdrop-blur-md text-left text-slate-200 text-xs leading-relaxed space-y-3 w-full">
                    <div className="flex items-center gap-2 text-sky-400 font-extrabold uppercase tracking-wider text-[11px]">
                      <Info className="w-4 h-4" />
                      <span>Security Instructions</span>
                    </div>
                    <p className="text-slate-350 font-medium font-sans">
                      Welcome to the portal. Enter your security credentials below to enter. This login page acts as your portal gateway to access website features and analytics.
                    </p>
                  </div>

                  {/* SINGLE UNIFIED PREMIUM LOGIN FORM */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-[#0b1329]/90 border border-blue-900/55 rounded-[2.2rem] p-6 backdrop-blur-2xl transition-all shadow-2xl flex flex-col gap-5 border-t-2 border-t-blue-500/20"
                  >
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-sky-400 font-black uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/10">
                        {loginMethod === 'google' ? 'GOOGLE EMAIL SESSION' : 'TELEGRAM SECURE CORES'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {loginMethod === 'google' ? (
                        <>
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold mb-1.5 px-0.5">Google Gmail Account</label>
                            <input
                              type="email"
                              value={customGoogleEmailApp}
                              onChange={(e) => setCustomGoogleEmailApp(e.target.value)}
                              placeholder="...........@gmail.com"
                              className="w-full bg-[#050b1a] border border-blue-900/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none rounded-xl px-4 py-3 text-xs text-white font-semibold transition-all font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold mb-1.5 px-0.5">Access Password</label>
                            <input
                              type="password"
                              value={telegramPass}
                              onChange={(e) => setTelegramPass(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#050b1a] border border-blue-900/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none rounded-xl px-4 py-3 text-xs text-white font-semibold transition-all"
                            />
                          </div>

                          <div className="pt-1 flex justify-start">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomGoogleEmailApp('...........@gmail.com');
                                setTelegramPass('supersecret');
                              }}
                              className="inline-flex items-center gap-1.5 text-[10.5px] text-blue-400 hover:text-blue-300 transition-colors font-mono font-black hover:underline bg-blue-950/20 hover:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-500/15 cursor-pointer"
                            >
                              💡 Autofill Demo Account
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-sky-400 font-extrabold mb-1.5 px-0.5">Telegram Username</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 font-black font-mono text-xs">@</span>
                              <input
                                type="text"
                                value={telegramUser}
                                onChange={(e) => setTelegramUser(e.target.value)}
                                placeholder="username"
                                className="w-full bg-[#050b1a] border border-sky-900/50 focus:border-sky-450 focus:ring-1 focus:ring-sky-450 outline-none rounded-xl pl-8 pr-4 py-3 text-xs text-white font-semibold transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-sky-400 font-extrabold mb-1.5 px-0.5">Access Password</label>
                            <input
                              type="password"
                              value={telegramPass}
                              onChange={(e) => setTelegramPass(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#050b1a] border border-sky-900/50 focus:border-sky-450 focus:ring-1 focus:ring-sky-450 outline-none rounded-xl px-4 py-3 text-xs text-white font-semibold transition-all"
                            />
                          </div>

                          <div className="pt-1 flex justify-start">
                            <button
                              type="button"
                              onClick={() => {
                                setTelegramUser('juwel_rana_official');
                                setTelegramPass('secretpass123');
                              }}
                              className="inline-flex items-center gap-1.5 text-[10.5px] text-sky-400 hover:text-sky-300 transition-colors font-mono font-black hover:underline bg-sky-950/20 hover:bg-sky-950/40 px-3 py-1.5 rounded-xl border border-sky-500/15 cursor-pointer"
                            >
                              💡 Autofill Demo Account
                            </button>
                          </div>
                        </>
                      )}

                      {/* Unified Trigger Button below Autofill to hop styles */}
                      <div className="pt-3 border-t border-blue-900/20 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginMethod(loginMethod === 'google' ? 'telegram' : 'google');
                          }}
                          className="w-full text-center py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all bg-sky-500/10 hover:bg-sky-500/20 text-sky-450 border border-sky-550/25 flex items-center justify-center gap-2 cursor-pointer shadow-sm font-sans"
                        >
                          <Send className="w-3.5 h-3.5 rotate-45 text-sky-400" />
                          Login to Telegram Username
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (loginMethod === 'google') {
                          const emailInput = customGoogleEmailApp.trim();
                          if (!emailInput) return;
                          
                          // Map the user session securely
                          const finalEmail = (emailInput === '...........@gmail.com' || emailInput === '')
                            ? 'mdjuwelranajx127133@gmail.com'
                            : emailInput;
                            
                          setIsConnectingApp(true);
                          setConnectProgress(0);
                          let progressCount = 0;
                          const t = setInterval(() => {
                            progressCount += Math.random() * 25 + 5;
                            if (progressCount >= 100) {
                              clearInterval(t);
                              setConnectProgress(100);
                              setAppAuthType('google');
                              safeStorage.setItem('verse_app_authtype', 'google');
                              safeStorage.setItem('verseUser', finalEmail);
                              setUsername(finalEmail);
                              setIsConnectingApp(false);
                            } else {
                              setConnectProgress(progressCount);
                            }
                          }, 80);
                        } else {
                          const tgUserRaw = telegramUser.trim();
                          if (!tgUserRaw) return;
                          
                          const finalTgUser = tgUserRaw.startsWith('@') ? tgUserRaw : '@' + tgUserRaw;
                          
                          setIsConnectingApp(true);
                          setConnectProgress(0);
                          let progressCount = 0;
                          const t = setInterval(() => {
                            progressCount += Math.random() * 25 + 5;
                            if (progressCount >= 100) {
                              clearInterval(t);
                              setConnectProgress(100);
                              setAppAuthType('telegram');
                              safeStorage.setItem('verse_app_authtype', 'telegram');
                              safeStorage.setItem('verseUser', finalTgUser);
                              setUsername(finalTgUser);
                              setIsConnectingApp(false);
                            } else {
                              setConnectProgress(progressCount);
                            }
                          }, 80);
                        }
                      }}
                      disabled={loginMethod === 'google' ? !customGoogleEmailApp.trim() : !telegramUser.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-45 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 cursor-pointer mt-2 border-t border-white/10"
                    >
                      {loginMethod === 'google' ? (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.535 1.21 15.655 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"/>
                          </svg>
                          Sign In with Google Account
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 rotate-45" />
                          Sign In with Telegram Account
                        </>
                      )}
                    </button>
                  </motion.div>

                </div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-0"
          >
            {/* Navigation Header - Only shown inside gameplay/features screens, completely hidden on the welcome page */}
            {!(gameState === 'home' && homeSubState === 'welcome') && (
              <header className="border-b border-amber-500/10 bg-white/95 mt-4 mb-2 mx-auto max-w-4xl rounded-2xl shadow-[0_2px_15px_rgba(139,94,60,0.05)]">
                <div className="px-4 sm:px-6 py-3.5 flex items-center justify-start gap-3 w-full">
                  
                  {/* Top-Left Corner Premium Logo and Brand Name side-by-side on a single line */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src="https://i.ibb.co.com/gbFvzHdb/file-00000000fdd071fa8b2edad69edccb1f.png"
                      alt="Bitcoin.com logo"
                      className="w-10 h-10 object-cover rounded-xl border border-amber-500/30 shadow-md transform hover:scale-105 transition-transform duration-300 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-[#8b5e3c] uppercase leading-none select-none min-w-0 truncate">
                      Bitcoin.com Wallet &amp; Verse community Hub
                    </h1>
                  </div>

                </div>
              </header>
            )}

            <main className="max-w-4xl mx-auto px-6 py-8">
              {/* Centered top banner image and expandable wallet description */}
              {(gameState === 'home' && homeSubState === 'features') && <WalletInfoCard />}

              <AnimatePresence mode="wait">
                {gameState === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <AnimatePresence mode="wait">
                      {homeSubState === 'welcome' && (
                        <motion.div
                          key="welcome-page"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="w-full max-w-2xl mx-auto border border-[#8b5e3c]/25 rounded-[2.5rem] p-8 md:p-10 bg-gradient-to-br from-white via-amber-50/15 to-white shadow-2xl space-y-8 flex flex-col items-center"
                        >
                          <section className="text-center space-y-4 w-full select-none">
                            {/* Masked User Badge */}
                            <div className="flex justify-center mb-4">
                              <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-amber-500/10 border border-amber-500/20 text-[#8b5e3c] px-3.5 py-1.5 rounded-full shadow-sm">
                                Verified User: {maskEmail(username)}
                              </span>
                            </div>

                            {/* Clickable task 8 title */}
                            <button
                              onClick={() => setIsWelcomeExpanded(!isWelcomeExpanded)}
                              className="text-center w-full focus:outline-none group cursor-pointer"
                            >
                              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#8b5e3c] via-[#bd9471] to-[#603f25] hover:scale-[1.01] transition-transform duration-300">
                                Welcome! Welcome! Welcome! Welcome! Welcome!
                              </h2>
                              <p className="text-[10px] text-[#bd9471] font-extrabold uppercase tracking-widest mt-2 font-mono flex items-center justify-center gap-1.5 group-hover:text-[#8b5e3c]">
                                {isWelcomeExpanded ? '▼ Tap to collapse details' : '▲ Tap to expand details'}
                              </p>
                            </button>

                            {/* Sliding/expandable description under Clickable Header */}
                            <AnimatePresence initial={false}>
                              {isWelcomeExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, y: -5 }}
                                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                                  exit={{ opacity: 0, height: 0, y: -5 }}
                                  className="overflow-hidden max-w-md mx-auto"
                                >
                                  <p className="text-xs sm:text-sm font-semibold text-[#8b5e3c]/85 leading-relaxed bg-[#8b5e3c]/5 border border-[#8b5e3c]/10 p-5 rounded-2xl text-left shadow-inner">
                                    Welcome to Verse Community Hub. Here, you can explore important information about the Verse ecosystem, learn how to monitor market prices, access various analyses and reviews, and gain valuable knowledge and insights about Verse. This is an informative and educational platform for both new and experienced users, where updates, guides, and useful information are shared regularly.
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Badge rows for authorization status */}
                            <div className="flex justify-center gap-2 pt-2">
                              {appAuthType === 'telegram' && (
                                <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 border border-sky-200/50 rounded-full px-3 py-1.5 text-[10px] font-black tracking-wide font-mono shadow-sm">
                                  <Send className="w-3.5 h-3.5 rotate-45 text-sky-500 animate-pulse" />
                                  TELEGRAM ACCESS CORES
                                </div>
                              )}
                              {appAuthType === 'google' && (
                                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200/50 rounded-full px-3 py-1.5 text-[10px] font-black tracking-wide font-mono shadow-sm">
                                  <Globe className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
                                  SECURE SESSION GRANTED
                                </div>
                              )}
                            </div>
                          </section>

                          {/* Community Section */}
                          <section className="text-center space-y-6 w-full animate-fade-in animate-duration-300">
                            <div className="space-y-4">
                              <button 
                                onClick={() => setShowLinks(!showLinks)}
                                className="bg-[#8b5e3c] hover:bg-[#a67148] active:scale-95 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_4px_20px_rgba(139,94,60,0.3)] uppercase tracking-wider text-sm w-full sm:w-auto cursor-pointer"
                              >
                                {showLinks ? 'Close Community' : 'Join Our Community'}
                              </button>
                              
                              <div className="block">
                                <button 
                                  type="button"
                                  onClick={() => setShowFocus(!showFocus)}
                                  className="relative inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/15 to-amber-500/10 hover:from-amber-500/20 hover:to-amber-500/25 text-[#8b5e3c] font-black uppercase tracking-wider text-xs border border-amber-500/25 mt-4 transition-all duration-300 hover:shadow-md cursor-pointer text-center"
                                >
                                  <Sparkles className="w-4 h-4 text-[#8b5e3c] animate-pulse" />
                                  {showFocus ? 'COLLAPSE WEBSITE FOCUS' : 'MAIN FOCUS OF THE BITCOIN.COM & VERSE COMMUNITY WEBSITE'}
                                </button>
                              </div>
                            </div>

                            <AnimatePresence>
                              {showFocus && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.98, y: -8 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                                  className="overflow-hidden bg-slate-900 border border-amber-500/30 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl text-left relative mt-4 border-t-4 border-t-amber-500/40 text-gray-200"
                                >
                                  {/* Ambient Glow */}
                                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                                  {/* Section top tracker and label */}
                                  <div className="flex justify-between items-center border-b border-amber-500/15 pb-4 mb-6">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/20">
                                        Ecosystem Objective • Slide {focusSlideIndex + 1} of {COMMUNITY_WEBSITE_SLIDES.length}
                                      </span>
                                    </div>
                                    <div className="text-[11px] font-mono font-black text-amber-500/60 uppercase">
                                      Education Deck
                                    </div>
                                  </div>

                                  {/* Interactive Slide Animation Container */}
                                  <AnimatePresence mode="wait">
                                    <motion.div
                                      key={focusSlideIndex}
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      transition={{ duration: 0.3 }}
                                      className="space-y-4"
                                    >
                                      <div>
                                        <span className="text-[9.5px] uppercase tracking-widest font-mono font-bold text-[#c0a080]">
                                          {COMMUNITY_WEBSITE_SLIDES[focusSlideIndex].subtitle}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white tracking-tight mt-0.5">
                                          {COMMUNITY_WEBSITE_SLIDES[focusSlideIndex].title}
                                        </h3>
                                      </div>

                                      {/* Content explanation paragraph */}
                                      <p className="text-xs sm:text-sm font-semibold text-gray-300 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-2xl border border-white/5 whitespace-pre-line">
                                        {COMMUNITY_WEBSITE_SLIDES[focusSlideIndex].content}
                                      </p>

                                      {/* "More details" interactive expander button */}
                                      <div className="space-y-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={() => setShowSlideDetail(!showSlideDetail)}
                                          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-xl font-bold font-mono border border-amber-500/15 cursor-pointer"
                                        >
                                          <span>✨ {showSlideDetail ? 'Hide details' : 'More details'}</span>
                                        </button>

                                        <AnimatePresence>
                                          {showSlideDetail && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 5 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: 5 }}
                                              className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-[#040815]/95 p-5 rounded-2xl border border-amber-500/20 shadow-inner whitespace-pre-line"
                                            >
                                              {COMMUNITY_WEBSITE_SLIDES[focusSlideIndex].detail}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </motion.div>
                                  </AnimatePresence>

                                  {/* Multi-step pagination dots progress bar */}
                                  <div className="flex flex-wrap gap-1.5 justify-center items-center py-4 my-2">
                                    {COMMUNITY_WEBSITE_SLIDES.map((_, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                          setFocusSlideIndex(i);
                                          setShowSlideDetail(false);
                                        }}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                                          i === focusSlideIndex 
                                            ? 'bg-amber-400 scale-125 shadow-[0_0_8px_#f59e0b]' 
                                            : 'bg-slate-700 hover:bg-slate-500'
                                        }`}
                                        title={`Page ${i + 1}`}
                                      />
                                    ))}
                                  </div>

                                  {/* Next and Back controllers */}
                                  <div className="flex items-center justify-between border-t border-amber-500/15 pt-5 mt-4">
                                    <button
                                      type="button"
                                      disabled={focusSlideIndex === 0}
                                      onClick={() => {
                                        setFocusSlideIndex(prev => Math.max(0, prev - 1));
                                        setShowSlideDetail(false);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-25 bg-slate-800 hover:bg-slate-700 disabled:hover:bg-slate-800 text-amber-300 cursor-pointer"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      Back
                                    </button>

                                    <button
                                      type="button"
                                      disabled={focusSlideIndex === COMMUNITY_WEBSITE_SLIDES.length - 1}
                                      onClick={() => {
                                        setFocusSlideIndex(prev => Math.min(COMMUNITY_WEBSITE_SLIDES.length - 1, prev + 1));
                                        setShowSlideDetail(false);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-25 bg-amber-500 hover:bg-amber-400 disabled:hover:bg-amber-500 text-slate-950 font-sans cursor-pointer shadow-md"
                                    >
                                      Next
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
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

                          {/* Action GET STARTED Button */}
                          <div className="pt-8 w-full flex justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setHomeSubState('features')}
                              className="px-14 py-5 bg-gradient-to-r from-amber-500 via-[#8b5e3c] to-amber-600 text-white font-black text-2xl rounded-2xl tracking-[0.1em] shadow-[0_12px_36px_rgba(139,94,60,0.4)] hover:shadow-[0_15px_40px_rgba(139,94,60,0.6)] cursor-pointer select-none transition-all duration-300 uppercase shrink-0 border border-amber-400/20"
                            >
                              GET STARTED
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {homeSubState === 'features' && (
                        <motion.div
                          key="features-page"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-8"
                        >


                          {/* Bitcoin.com Wallet Featured Option */}
                          <motion.button
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setGameState('bitcoinWallet')}
                            className="w-full flex items-center gap-5 bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/80 rounded-[2rem] p-6 text-left transition-all hover:border-[#c0a080]/40 shadow-sm group cursor-pointer"
                          >
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-white flex-shrink-0 bg-white group-hover:scale-105 transition-transform duration-300">
                              <img 
                                src="https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg" 
                                alt="Bitcoin.com Wallet Logo" 
                                className="w-full h-full object-cover transition-all"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#8b5e3c] transition-colors">
                              Bitcoin.com Wallet
                            </h3>
                          </motion.button>

                          {/* Crypto Founder & History Featured Option (Task 10 & 11) */}
                          <motion.button
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setGameState('cryptoHistory')}
                            className="w-full flex items-center gap-5 bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/25 rounded-[2rem] p-6 text-left transition-all hover:border-amber-500/50 shadow-xl group cursor-pointer relative overflow-hidden"
                          >
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/15 shadow-md flex-shrink-0 bg-transparent">
                                <img 
                                  src="https://i.ibb.co.com/hx1FvtyV/file-00000000bc08720b9442e03fc47020a2.png" 
                                  alt="Crypto Founder Logo" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <h3 className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight group-hover:text-amber-400 transition-colors">
                                  Crypto Founder and History
                                </h3>
                                <p className="text-[10px] text-amber-200/95 font-black uppercase tracking-widest mt-1">Founders, dates and historical discoveries</p>
                              </div>
                            </div>
                          </motion.button>

                          {/* Claim Daily Reward Featured Option (Task 12) */}
                          <motion.button
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setGameState('claimReward')}
                            className="w-full flex items-center gap-5 bg-gradient-to-r from-emerald-950/20 to-teal-950/30 border border-emerald-500/20 rounded-[2rem] p-6 text-left transition-all hover:border-emerald-500/45 shadow-xl group cursor-pointer relative overflow-hidden"
                          >
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-500/15 flex items-center justify-center border-2 border-emerald-500/20 shadow-md flex-shrink-0">
                              <CalendarRange className="w-7 h-7 text-emerald-400 animate-bounce" style={{ animationDuration: '3s' }} />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                                Claim daily Reward
                                <img 
                                  src="https://i.ibb.co.com/XxcwjvBq/Screenshot-2026-05-31-14-49-38-518-com-bitcoin-mwallet-edit.jpg" 
                                  alt="Daily Reward" 
                                  className="w-8 h-8 sm:w-9 sm:h-9 object-cover rounded-lg border border-emerald-500/35 shadow-md flex-shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              </h3>
                              <p className="text-[10px] text-emerald-200/95 font-black uppercase tracking-widest mt-1">Ticking hours & direct rewards</p>
                            </div>
                          </motion.button>

                          {/* Verse Knowledge Quiz Option */}
                          <motion.button
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setGameState('quiz')}
                            className="w-full flex items-center justify-between gap-5 bg-gradient-to-r from-purple-950/20 to-indigo-950/30 border border-purple-500/20 rounded-[2rem] p-6 text-left transition-all hover:border-purple-500/45 shadow-xl group cursor-pointer relative overflow-hidden"
                          >
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-purple-500/15 flex items-center justify-center border-2 border-purple-500/20 shadow-md flex-shrink-0">
                                <Brain className="w-7 h-7 text-purple-400 animate-pulse" />
                              </div>
                              <div>
                                <h3 className="text-xl sm:text-2xl font-black text-purple-400 tracking-tight group-hover:text-purple-300 transition-colors">
                                  Verse Knowledge Quiz
                                </h3>
                                <p className="text-[10px] text-purple-200/95 font-black uppercase tracking-widest mt-1">Test your crypto IQ and earn massive bonuses</p>
                              </div>
                            </div>
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 p-0.5 bg-slate-900 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <img 
                                src="https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png" 
                                alt="Verse Logo" 
                                className="w-full h-full object-cover rounded-xl"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </motion.button>

                          {/* Verse Wallet Option */}
                          <motion.button
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setGameState('wallet')}
                            className="w-full flex items-center justify-between gap-5 bg-gradient-to-r from-[#0a233b]/40 to-[#050b1a]/50 border border-teal-500/20 rounded-[2rem] p-6 text-left transition-all hover:border-teal-500/45 shadow-xl group cursor-pointer relative overflow-hidden"
                          >
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-500/15 flex items-center justify-center border-2 border-teal-500/20 shadow-md flex-shrink-0">
                                <WalletCards className="w-7 h-7 text-teal-400 animate-pulse" />
                              </div>
                              <div>
                                <h3 className="text-xl sm:text-2xl font-black text-teal-400 tracking-tight group-hover:text-teal-300 transition-colors">
                                  Verse Wallet
                                </h3>
                                <p className="text-[10px] text-teal-200/95 font-black uppercase tracking-widest mt-1">Securely manage and transfer your earned assets</p>
                              </div>
                            </div>
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-teal-500/30 p-0.5 bg-slate-900 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <img 
                                src="https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png" 
                                alt="Verse Logo" 
                                className="w-full h-full object-cover rounded-xl"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </motion.button>

                          {coins > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-subtle"
                            >
                              <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="p-3 bg-yellow-500/20 rounded-full">
                                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                  <p className="text-yellow-500 font-bold">Unclaimed Assets</p>
                                  <p className="text-sm text-gray-400">You have {coins} Verse waiting for you in the website balance.</p>
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

                          <TelegramCommunityHub />

                          {/* Elegant Premium Bottom Session Controller */}
                          <div className="flex flex-col items-center gap-3.5 pt-8 pb-4 border-t border-amber-500/10 text-center">
                            <div className="inline-flex items-center gap-2 bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/10">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-xs text-[#8b5e3c] font-mono tracking-wider font-extrabold">
                                Active Security Session: {maskEmail(username)} • Balance: <span className="text-[#bd9471]">{coins} PTS</span>
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                safeStorage.removeItem('verseUser');
                                safeStorage.removeItem('verse_game_state');
                                safeStorage.removeItem('verse_home_sub_state');
                                safeStorage.removeItem('verse_app_authtype');
                                window.location.reload();
                              }}
                              className="text-xs bg-red-500/15 hover:bg-red-500 text-red-550 hover:text-white px-6 py-2.5 rounded-2xl transition-all font-mono font-black border border-red-500/20 cursor-pointer shadow-sm"
                            >
                              LOGOUT SECURITY SESSION
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              setWalletBalance={setWalletBalance}
              setTokenBalances={setTokenBalances}
              setHistory={setHistory}
              addTransaction={addTransaction}
            />
          )}

          {gameState === 'bitcoinWallet' && (
            <BitcoinWalletDashboard onBack={() => setGameState('home')} />
          )}

          {gameState === 'cryptoHistory' && (
            <CryptoHistory onBack={() => setGameState('home')} />
          )}

          {gameState === 'claimReward' && (
            <ClaimReward 
              onBack={() => setGameState('home')} 
              username={username || 'anonymous'}
              walletBalance={walletBalance}
              onClaimSuccess={(amount) => {
                setWalletBalance(prev => prev + amount);
                addTransaction('receive', amount, 'Daily Reward Check-in Claim matured');
              }}
            />
          )}


        </AnimatePresence>
      </main>

      {(gameState === 'home' && homeSubState === 'features') && (
        <>
          {/* Bottom Images Gallery System (26 SNAPSHOTS) */}
          <BottomGallery />

          {/* LARGE CENTERED BOTTOM LOGO */}
          <div className="flex flex-col items-center justify-center py-10 pb-16 text-center w-full relative z-10 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="group flex flex-col items-center justify-center"
            >
              <img 
                src="https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png" 
                alt="Verse Featured Centered Logo" 
                className="w-64 sm:w-80 h-auto object-contain transition-all duration-500 drop-shadow-[0_12px_40px_rgba(139,94,60,0.2)] group-hover:drop-shadow-[0_20px_50px_rgba(139,94,60,0.45)] group-hover:scale-105 active:scale-98"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-100 mt-12 text-center text-gray-400">
            <p className="text-sm font-mono uppercase tracking-[0.2em]">
              &copy; 2026 Verse Community &bull; Decentralized Hub
            </p>
          </footer>
        </>
      )}
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
  setWalletBalance,
  setTokenBalances,
  setHistory,
  addTransaction
}: { 
  balance: number; 
  tokenBalances: Record<string, number>;
  marketData: Record<string, MarketData>;
  lastSync: Date;
  lastSave: Date | null;
  history: Transaction[];
  onBack: () => void;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  setTokenBalances: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setHistory: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransaction: (type: Transaction['type'], amount: number, description: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'send' | 'receive' | 'swap' | 'farms'>('portfolio');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // --- Staking Yield Farms & Pools State (Screenshot 1: Farms & Pools) ---
  const [stakedAmounts, setStakedAmounts] = useState<Record<string, number>>(() => {
    try {
      const u = safeStorage.getItem('verseUser') || 'default';
      const saved = safeStorage.getItem(`verse_staked_${u}`);
      return saved ? JSON.parse(saved) : { 'VERSE_ETH': 0, 'VERSE_USDT': 0, 'VERSE_SOL': 0 };
    } catch {
      return { 'VERSE_ETH': 0, 'VERSE_USDT': 0, 'VERSE_SOL': 0 };
    }
  });

  const [unclaimedRewards, setUnclaimedRewards] = useState<Record<string, number>>({
    'VERSE_ETH': 0, 'VERSE_USDT': 0, 'VERSE_SOL': 0
  });

  const FARMS = [
    { id: 'VERSE_ETH', name: 'VERSE-ETH Yield Farm', pair: 'VERSE / ETH', apy: 64.2, tvl: '$1,245,600', icon1: 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png', icon2: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { id: 'VERSE_USDT', name: 'VERSE-USDT Liquidity Pool', pair: 'VERSE / USDT', apy: 48.5, tvl: '$840,320', icon1: 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png', icon2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { id: 'VERSE_SOL', name: 'VERSE-SOL Staking Pool', pair: 'VERSE / SOL', apy: 35.8, tvl: '$520,150', icon1: 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png', icon2: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  ];

  // Simulating continuous reward emission over time
  useEffect(() => {
    const interval = setInterval(() => {
      setUnclaimedRewards(prev => {
        const next = { ...prev };
        Object.entries(stakedAmounts).forEach(([farmId, stakedAmount]) => {
          const sAmt = stakedAmount as number;
          if (sAmt > 0) {
            const farm = FARMS.find(f => f.id === farmId);
            const apyDecimal = (farm?.apy || 30) / 100;
            // reward produced in 2 seconds of real time
            // Let's multiply rewards rate for instant arcade stimulation progress
            const secsInYear = 365 * 24 * 3600;
            const rewardEarned = (sAmt * apyDecimal * 2 * 100) / secsInYear; 
            next[farmId] = (next[farmId] || 0) + rewardEarned;
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [stakedAmounts]);

  const handleStake = (farmId: string, amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    const verseBal = (tokenBalances as any)['VERSE'] || 0;
    if (verseBal < amount) {
      triggerError('Insufficient VERSE tokens for staking!');
      return;
    }

    // Deduct VERSE from balances
    setTokenBalances((prev: any) => ({
      ...prev,
      VERSE: (prev['VERSE'] || 0) - amount
    }));

    // Add to staked amount
    const updatedStaking = {
      ...stakedAmounts,
      [farmId]: ((stakedAmounts as any)[farmId] || 0) + amount
    };
    setStakedAmounts(updatedStaking);
    try {
      const u = safeStorage.getItem('verseUser') || 'default';
      safeStorage.setItem(`verse_staked_${u}`, JSON.stringify(updatedStaking));
    } catch (err) { console.error(err); }

    addTransaction('swap', amount, `Staked ${amount.toFixed(2)} VERSE in ${farmId.replace('_', '-')}`);
    triggerSuccess(`Successfully staked ${amount} VERSE!`);
  };

  const handleUnstake = (farmId: string) => {
    const staked = stakedAmounts[farmId] || 0;
    if (staked <= 0) return;

    // Return to assets
    setTokenBalances(prev => ({
      ...prev,
      VERSE: (prev['VERSE'] || 0) + staked
    }));

    const updatedStaking = {
      ...stakedAmounts,
      [farmId]: 0
    };
    setStakedAmounts(updatedStaking);
    try {
      const u = safeStorage.getItem('verseUser') || 'default';
      safeStorage.setItem(`verse_staked_${u}`, JSON.stringify(updatedStaking));
    } catch (err) { console.error(err); }

    // Recover rewards if any
    const accrued = unclaimedRewards[farmId] || 0;
    if (accrued > 0) {
      setTokenBalances(prev => ({ ...prev, VERSE: (prev['VERSE'] || 0) + accrued }));
      setUnclaimedRewards(prev => ({ ...prev, [farmId]: 0 }));
      addTransaction('receive', accrued, `Harvested & Unstaked Verse Farm Rewards`);
    }

    addTransaction('receive', staked, `Unstaked ${staked.toFixed(2)} VERSE from ${farmId.replace('_', '-')}`);
    triggerSuccess(`Successfully unstaked VERSE!`);
  };

  const handleHarvest = (farmId: string) => {
    const reward = unclaimedRewards[farmId] || 0;
    if (reward <= 0) {
      triggerError('No rewards accrued to harvest yet!');
      return;
    }

    setTokenBalances(prev => ({
      ...prev,
      VERSE: (prev['VERSE'] || 0) + reward
    }));

    setUnclaimedRewards(prev => ({
      ...prev,
      [farmId]: 0
    }));

    addTransaction('receive', reward, `Harvested ${reward.toFixed(4)} VERSE staking rewards`);
    triggerSuccess(`Harvested ${reward.toFixed(4)} VERSE successfully!`);
  };

  // --- Send Assets State (Screenshot 4: Send Asset Layout) ---
  const [sendToken, setSendToken] = useState<string>('VERSE');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<string>('');
  const [sendInUSD, setSendInUSD] = useState<boolean>(false);
  const [sendFeeSpeed, setSendFeeSpeed] = useState<'economy' | 'regular' | 'priority'>('regular');
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isSliding, setIsSliding] = useState<boolean>(false);

  const getSendLimit = () => {
    if (sendToken === 'USD') return balance;
    return tokenBalances[sendToken] || 0;
  };

  const getSendFee = () => {
    switch (sendFeeSpeed) {
      case 'economy': return 0.15;
      case 'regular': return 0.45;
      case 'priority': return 1.25;
    }
  };

  const validateAddress = (addr: string) => {
    if (sendToken === 'BTC') {
      return addr.startsWith('bc1') || addr.startsWith('1') || addr.startsWith('3');
    }
    if (sendToken === 'SOL') {
      return addr.length > 30 && !addr.startsWith('0x');
    }
    return addr.startsWith('0x') && addr.length === 42;
  };

  const executeSendFunds = () => {
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) {
      triggerError('Please enter a valid transfer amount.');
      return;
    }

    const fee = getSendFee();
    let computedTokenAmount = amt;
    let computedUSDAmount = amt;

    const tokenPrice = sendToken === 'USD' ? 1 : marketData[sendToken]?.price || 1;

    if (sendInUSD) {
      computedTokenAmount = amt / tokenPrice;
      computedUSDAmount = amt;
    } else {
      computedTokenAmount = amt;
      computedUSDAmount = amt * tokenPrice;
    }

    const currentTokenBalance = getSendLimit();
    if (currentTokenBalance < computedTokenAmount) {
      triggerError(`Insufficient balance of ${sendToken}!`);
      return;
    }

    if (balance < fee) {
      triggerError('Insufficient USD Wallet balance to pay network fees!');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      triggerError(`Invalid destination public address format for ${sendToken}!`);
      return;
    }

    // Process balances deducting Send amounts and gas fees
    if (sendToken === 'USD') {
      setWalletBalance(prev => prev - computedUSDAmount - fee);
    } else {
      setTokenBalances(prev => ({
        ...prev,
        [sendToken]: prev[sendToken] - computedTokenAmount
      }));
      setWalletBalance(prev => prev - fee);
    }

    addTransaction('send', computedTokenAmount, `Sent ${computedTokenAmount.toFixed(4)} ${sendToken} to external holder`);
    triggerSuccess(`Successfully sent ${computedTokenAmount.toFixed(4)} ${sendToken}!`);

    // Reset fields
    setSendAmount('');
    setRecipientAddress('');
    setSliderPosition(0);
  };

  // --- Receive Assets State (Screenshot 2: Receive & Invoice) ---
  const [receiveToken, setReceiveToken] = useState<string>('VERSE');
  const [requestInvoiceAmount, setRequestInvoiceAmount] = useState<string>('');

  const getWalletAddress = (sym: string) => {
    switch (sym) {
      case 'BTC': return 'bc1q9f5a7dce3472089aedcd9ec7a50852f902';
      case 'SOL': return 'Go5e3472VfBG6R2VXfBGf902dcd9ec7a50852m89a';
      default: return '0x8b5e3c9aedcd9ec7a50852f902bc1q9f5a7dce34';
    }
  };

  const handleCopyClipboard = () => {
    const addr = getWalletAddress(receiveToken);
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Token Swap Settings (Screenshot 3: Token Swap Interface) ---
  const [swapFrom, setSwapFrom] = useState<string>('USD');
  const [swapTo, setSwapTo] = useState<string>('VERSE');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [swapSlippage, setSwapSlippage] = useState<number>(0.5);
  const [customSlippageInput, setCustomSlippageInput] = useState<string>('');
  const [showSlippageTooltip, setShowSlippageTooltip] = useState<boolean>(false);

  const getSwapAvailableBalance = () => {
    if (swapFrom === 'USD') return balance;
    return tokenBalances[swapFrom] || 0;
  };

  const handleSwapMax = () => {
    setSwapAmount(getSwapAvailableBalance().toString());
  };

  const getConversionRate = () => {
    if (swapFrom === swapTo) return 1;
    const priceFrom = swapFrom === 'USD' ? 1 : marketData[swapFrom]?.price || 0.05;
    const priceTo = swapTo === 'USD' ? 1 : marketData[swapTo]?.price || 0.05;
    return priceFrom / priceTo;
  };

  const getSwapEstimatedReturn = () => {
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) return 0;
    return amt * getConversionRate();
  };

  const executeSwapTrade = () => {
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) {
      triggerError('Please enter a valid swap quantity.');
      return;
    }

    const available = getSwapAvailableBalance();
    if (available < amt) {
      triggerError(`Insufficient ${swapFrom} funds available!`);
      return;
    }

    const estimateReturn = getSwapEstimatedReturn();
    const gasFeeUSD = 0.35; // Simulated gas cost representing Screenshot 3

    if (balance < gasFeeUSD) {
      triggerError('Insufficient USD Wallet balance to pay network exchange gas fees!');
      return;
    }

    // Subtract from balance
    if (swapFrom === 'USD') {
      setWalletBalance(prev => prev - amt);
    } else {
      setTokenBalances(prev => ({ ...prev, [swapFrom]: prev[swapFrom] - amt }));
    }

    // Add to balance
    if (swapTo === 'USD') {
      setWalletBalance(prev => prev + estimateReturn - gasFeeUSD);
    } else {
      setTokenBalances(prev => ({ ...prev, [swapTo]: (prev[swapTo] || 0) + estimateReturn }));
      setWalletBalance(prev => prev - gasFeeUSD);
    }

    addTransaction('swap', amt, `Swapped ${amt.toFixed(4)} ${swapFrom} for ${estimateReturn.toFixed(4)} ${swapTo}`);
    triggerSuccess(`Exchanged ${amt} ${swapFrom} to ${estimateReturn.toFixed(4)} ${swapTo}!`);
    setSwapAmount('');
  };

  // --- Aggregate Portfolio Home Metrics (Screenshot 5: Dashboard Overview) ---
  const calculateTotalPortfolioValue = () => {
    let sum = balance; // Start with USD cash balance
    Object.entries(tokenBalances).forEach(([sym, amount]) => {
      const price = marketData[sym]?.price || 0;
      sum += amount * price;
    });
    return sum;
  };

  const totalPortfolioValue = calculateTotalPortfolioValue();

  // Helpers
  const triggerError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3500);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Dynamic Top Wallet System Bar */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-100 p-4 rounded-3xl shadow-sm gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button onClick={onBack} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors flex items-center justify-center gap-2 text-[#8b5e3c] font-bold">
            <ArrowLeft className="w-5 h-5" /> Home Page Mode
          </button>
          {lastSave && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#8b5e3c] font-mono uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Synced: {lastSave.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {/* Navigation Tab Deck (Matches Screenshots' Tab Design) */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl w-full sm:w-auto border border-gray-100 overflow-x-auto">
          {([
            { id: 'portfolio', label: 'Portfolio', icon: WalletCards },
            { id: 'send', label: 'Send', icon: Send },
            { id: 'receive', label: 'Receive', icon: Download },
            { id: 'swap', label: 'Swap DEX', icon: ArrowRightLeft },
            { id: 'farms', label: 'Yield Farms', icon: Flame }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-[#c0a080] text-white shadow-md' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Core Area & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: PORTFOLIO MAIN TAB (Screenshot 5: Dashboard Overview) */}
            {activeTab === 'portfolio' && (
              <motion.div
                key="tab-portfolio"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                {/* Simulated Ledger Dashboard Card */}
                <div className="bg-gradient-to-br from-emerald-700 via-teal-900 to-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white border border-white/10">
                  <div className="absolute top-0 right-0 p-8 text-neutral-400/20">
                    <Sparkles className="w-24 h-24 stroke-[1]" />
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                        <span className="font-mono text-white/70 tracking-[0.25em] text-[10px] uppercase font-bold">VERSE INTEGRATED PORTFOLIO</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Total Value Balance</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-5xl font-black text-white tracking-tighter">
                          ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <span className="text-xl font-bold text-gray-300">USD</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-max mt-2 border border-emerald-500/20">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+4.28% Daily Yield</span>
                      </div>
                    </div>

                    {/* Quick Access Grid Actions (Matches Screenshot 5 layout icons) */}
                    <div className="grid grid-cols-4 gap-3 pt-6 border-t border-white/5">
                      <button 
                        onClick={() => setActiveTab('send')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/15 active:scale-95 rounded-2xl transition-all cursor-pointer text-center"
                      >
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300"><ArrowUpRight className="w-4 h-4" /></div>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Send</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('receive')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/15 active:scale-95 rounded-2xl transition-all cursor-pointer text-center"
                      >
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300"><ArrowDownLeft className="w-4 h-4" /></div>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Receive</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('swap')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/15 active:scale-95 rounded-2xl transition-all cursor-pointer text-center"
                      >
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300"><RefreshCw className="w-4 h-4" /></div>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Swap DEX</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('farms')}
                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/15 active:scale-95 rounded-2xl transition-all cursor-pointer text-center"
                      >
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300"><Flame className="w-4 h-4" /></div>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Farms</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Portfolio Visual Balance History Interactive Curve Chart */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center justify-between">
                    <span>PORTFOLIO GROWTH PROJECTIONS</span>
                    <span className="text-emerald-500 font-bold">ARCADE VALUE TRACK</span>
                  </h4>
                  <div className="w-full h-24 relative mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Interactive area and stroke curve representing live coin trends */}
                      <path 
                        d="M0,18 Q15,8 30,12 T60,5 T85,10 T100,2" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="1.2"
                      />
                      <path 
                        d="M0,18 Q15,8 30,12 T60,5 T85,10 T100,2 L100,30 L0,30 Z" 
                        fill="url(#chartGradient)"
                      />
                      <circle cx="100" cy="2" r="1.5" fill="#10b981" className="animate-pulse" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-2">
                    <span>1D AGO</span>
                    <span>12H AGO</span>
                    <span>6H AGO</span>
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Active Holdings List (Screenshot 5: Coin asset rows list) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-sm font-black uppercase text-gray-900 tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-500" /> Active Holdings
                    </h4>
                    <span className="text-xs text-gray-400 font-mono italic">TAP TABS TO INTERACT</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Render standard USD Balance first */}
                    <div className="bg-[#f8fafc]/75 border border-slate-100 p-5 rounded-3xl hover:border-[#c0a080]/30 transition-all flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-extrabold shadow-sm">
                            <Coins className="w-5 h-5 text-slate-950" />
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-slate-800">Total Verse</p>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">Ecosystem Assets</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/15 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">VERSE</span>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-slate-900">{balance.toLocaleString()} VERSE</p>
                        <p className="text-xs text-slate-400 font-mono">Primary Unified Wallet Balance</p>
                      </div>
                    </div>

                    {SUPPORTED_TOKENS.slice(0, 5).map(token => {
                      const coinBalance = tokenBalances[token.symbol] || 0;
                      const price = marketData[token.symbol]?.price || 0;
                      const valUSD = coinBalance * price;
                      const pctChange = marketData[token.symbol]?.change24h || 1.8;

                      return (
                        <div key={token.symbol} className="bg-white border border-gray-100 p-5 rounded-3xl hover:border-[#c0a080]/30 transition-all flex flex-col justify-between shadow-sm group">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <img src={token.icon} alt={token.symbol} className="w-10 h-10 rounded-full shadow-sm" referrerPolicy="no-referrer" />
                              <div>
                                <p className="font-extrabold text-sm text-gray-900">{token.name}</p>
                                <p className="text-xs text-gray-400 font-mono font-bold">{token.symbol}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${dctStyle(pctChange)}`}>
                              {pctChange > 0 ? '+' : ''}{pctChange.toFixed(2)}%
                            </span>
                          </div>
                          <div>
                            <div className="flex items-baseline justify-between">
                              <p className="text-2xl font-black text-gray-900">{coinBalance.toFixed(4)}</p>
                              <span className="text-xs font-mono text-gray-500 font-bold">≈ ${valUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            
                            {/* Visual mini line chart (Inline sparkline representing Screenshot 5 coin miniature charts) */}
                            <div className="h-4 flex items-end gap-0.5 mt-2 overflow-hidden opacity-40 group-hover:opacity-85 transition-all">
                              {Array.from({ length: 12 }).map((_, i) => {
                                const hVal = Math.sin(i * 0.5) * 5 + 8;
                                return (
                                  <div 
                                    key={i} 
                                    style={{ height: `${hVal * 8}%` }}
                                    className={`w-1 rounded-full flex-1 ${pctChange >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} 
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: SEND ASSET TAB (Screenshot 4: Send Asset Screen & Slide to Send Slider) */}
            {activeTab === 'send' && (
              <motion.div
                key="tab-send"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-500" /> Send Cryptocurrency
                  </h4>
                  <button 
                    onClick={() => {
                      setRecipientAddress(getWalletAddress(sendToken));
                      triggerSuccess('Pre-filled mock delivery terminal address!');
                    }} 
                    className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold border border-emerald-100 transition-colors uppercase tracking-wider"
                  >
                    Use Demo Address
                  </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden">
                  
                  {/* Select Coin */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Select Asset to Transfer</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['VERSE', 'BTC', 'ETH', 'SOL', 'USDT'].map(sym => {
                        const iconUrl = sym === 'VERSE' ? 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png' : SUPPORTED_TOKENS.find(t => t.symbol === sym)?.icon || '';
                        return (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => {
                              setSendToken(sym);
                              setRecipientAddress('');
                            }}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                              sendToken === sym 
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold scale-[1.03] shadow-sm' 
                                : 'bg-slate-50 border-gray-100 text-gray-500 hover:bg-gray-100/50'
                            }`}
                          >
                            <img src={iconUrl} alt={sym} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                            <span className="text-[10px] font-mono font-bold tracking-tight">{sym}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recipient Address */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Recipient Address</label>
                      <span className="text-[9px] text-[#8b5e3c] font-mono bg-slate-50 px-2 py-0.5 rounded border border-gray-100">
                        Type address manually or click Demo
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 focus-within:border-emerald-300 transition-all">
                      <QrCode className="w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder={`Address (e.g., ${sendToken === 'BTC' ? 'bc1q...' : '0x...'})`}
                        className="bg-transparent border-none outline-none flex-1 text-sm text-gray-900 placeholder-gray-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Amount Entry & Convert Toggles (Matches Dual denomination design) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Transfer Quantity</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setSendAmount(getSendLimit().toString());
                          setSendInUSD(false);
                        }}
                        className="text-[10px] font-mono bg-[#c0a080]/15 hover:bg-[#c0a080]/25 text-[#8b5e3c] px-3 py-0.5 rounded-full font-bold transition-all"
                      >
                        MAX: {getSendLimit().toFixed(4)} {sendToken}
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                      <div className="flex-1">
                        <input 
                          type="number" 
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          placeholder="0.00"
                          className="bg-transparent border-none outline-none text-2xl font-black text-gray-900 placeholder-gray-400 w-full"
                        />
                        <div className="text-xs font-mono text-gray-400 mt-1">
                          {sendInUSD ? (
                            `≈ ${(parseFloat(sendAmount || '0') / (marketData[sendToken]?.price || 1)).toFixed(4)} ${sendToken}`
                          ) : (
                            `≈ $${(parseFloat(sendAmount || '0') * (marketData[sendToken]?.price || 0.05)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
                          )}
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setSendInUSD(!sendInUSD)}
                        className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 transition-all font-mono"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {sendInUSD ? 'USD Mode' : `${sendToken} Mode`}
                      </button>
                    </div>
                  </div>

                  {/* Gas Fee Speed Cards (Matches Screenshot 4 Gas Options card details) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Network Gas Speed Fee</label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id: 'economy', label: 'Economy', cost: 0.15, time: '~10 Mins' },
                        { id: 'regular', label: 'Regular', cost: 0.45, time: '~2 Mins' },
                        { id: 'priority', label: 'Priority', cost: 1.25, time: '~15 Secs' }
                      ] as const).map(tier => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSendFeeSpeed(tier.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            sendFeeSpeed === tier.id 
                              ? 'bg-emerald-50/50 border-emerald-400 text-emerald-800' 
                              : 'bg-slate-50/50 border-gray-100 text-gray-500 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-bold text-xs">{tier.label}</div>
                          <div className="font-mono text-sm font-black text-gray-900 mt-1">${tier.cost}</div>
                          <div className="text-[9px] font-mono text-gray-400 mt-0.5 uppercase">{tier.time}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Sliding Button ("Slide to Send" - Matches Screenshot 4 slider system) */}
                  <div className="relative mt-8 pt-4">
                    <div className="bg-slate-100 h-14 rounded-2xl w-full flex items-center justify-center relative overflow-hidden border border-gray-100">
                      
                      {/* Interactive Drag Handle (Drag to complete dispatch) */}
                      <motion.div 
                        drag="x"
                        dragConstraints={{ left: 0, right: 300 }}
                        dragElastic={0}
                        onDrag={(event, info) => {
                          setSliderPosition(info.offset.x);
                        }}
                        onDragStart={() => setIsSliding(true)}
                        onDragEnd={(event, info) => {
                          setIsSliding(false);
                          if (info.offset.x >= 280) {
                            executeSendFunds();
                          } else {
                            setSliderPosition(0);
                          }
                        }}
                        style={{ x: sliderPosition }}
                        animate={isSliding ? undefined : { x: 0 }}
                        className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl shadow-lg flex items-center justify-center cursor-ew-resize active:scale-95 absolute left-0 z-25 text-white"
                      >
                        <ChevronRight className="w-6 h-6 animate-pulse" />
                      </motion.div>

                      {/* Sliding visual rail info */}
                      <span className="text-xs uppercase tracking-[0.25em] font-black pointer-events-none font-mono text-slate-400 select-none">
                        {sliderPosition > 220 ? 'RELEASE TO DISPATCH!' : 'Slide To Send Assets'}
                      </span>

                      {/* Color Fill underneath slider */}
                      <div 
                        className="absolute left-0 top-0 h-full bg-emerald-500/10 pointer-events-none transition-all duration-75"
                        style={{ width: `${Math.max(sliderPosition + 35, 0)}px` }}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 3: RECEIVE ASSET TAB (Screenshot 2: Receive & Invoice) */}
            {activeTab === 'receive' && (
              <motion.div
                key="tab-receive"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Download className="w-5 h-5 text-emerald-500" /> Receive Assets
                  </h4>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">My Addresses Portal</span>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col items-center">
                  
                  {/* Receive Asset pick */}
                  <div className="w-full space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 block text-center">CHOOSE COIN ADDRESS</label>
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 max-w-sm mx-auto">
                      {['VERSE', 'BTC', 'ETH', 'SOL'].map(sym => (
                        <button
                          key={sym}
                          onClick={() => {
                            setReceiveToken(sym);
                            setRequestInvoiceAmount('');
                          }}
                          className={`flex-1 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            receiveToken === sym ? 'bg-[#c0a080] text-white shadow' : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive set request payment amount */}
                  <div className="w-full max-w-xs space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.1em] text-gray-400 block text-center">Set Request Billing Amount (Optional)</label>
                    <div className="bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100 flex items-center gap-1 text-slate-800 focus-within:border-[#c0a080] justify-center text-sm">
                      <span className="font-bold text-[#8b5e3c] font-mono">{receiveToken}:</span>
                      <input 
                        type="number"
                        value={requestInvoiceAmount}
                        onChange={(e) => setRequestInvoiceAmount(e.target.value)}
                        placeholder="Request Amount (e.g. 100)"
                        className="bg-transparent border-none outline-none font-bold text-xs text-center font-mono flex-1 w-full"
                      />
                    </div>
                  </div>

                  {/* Dynamic generated payment request bill description */}
                  {requestInvoiceAmount && parseFloat(requestInvoiceAmount) > 0 && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center mt-2 max-w-md w-full"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block mb-1">PAYMENT INVOICE BILL GENERATED</span>
                      <h5 className="text-lg font-black text-emerald-900 font-mono">
                        {requestInvoiceAmount} {receiveToken}
                      </h5>
                      <p className="text-xs text-emerald-600 font-mono mt-0.5">
                        ≈ ${(parseFloat(requestInvoiceAmount) * (marketData[receiveToken]?.price || 0.05)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </p>
                    </motion.div>
                  )}

                  {/* Elegant High-Resolution Art QR Code container (Matches Screenshot 2 custom stylized QR layout) */}
                  <div className="relative p-6 bg-[#f8fafc] rounded-[2rem] border border-gray-100 shadow-inner flex flex-col items-center justify-center my-4">
                    <div className="w-48 h-48 bg-white rounded-3xl p-4 border border-gray-100 shadow flex items-center justify-center relative overflow-hidden group">
                      
                      {/* Generated SVG Mock QR Layout which matches the actual coin selected */}
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-800 selection:bg-none">
                        <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" />
                        <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" />
                        <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" />
                        
                        <rect x="42" y="10" width="8" height="8" />
                        <rect x="52" y="25" width="8" height="12" />
                        <rect x="10" y="45" width="12" height="8" />
                        <rect x="25" y="45" width="22" height="15" />
                        <rect x="52" y="45" width="16" height="8" />
                        <rect x="42" y="65" width="12" height="8" />
                        <rect x="62" y="60" width="8" height="14" />
                        <rect x="75" y="52" width="20" height="8" />
                        <rect x="80" y="70" width="12" height="20" />
                        <rect x="55" y="80" width="15" height="10" />
                        
                        <circle cx="50" cy="50" r="1.5" className="fill-emerald-500" />
                      </svg>

                      {/* Coin Watermark in center of QR code */}
                      <div className="absolute w-12 h-12 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-1.5">
                        <img 
                          src={receiveToken === 'VERSE' ? 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png' : SUPPORTED_TOKENS.find(t => t.symbol === receiveToken)?.icon || ''} 
                          alt="Coin Logo" 
                          className="w-full h-full rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#8b5e3c] mt-3">Scan code to credit client</p>
                  </div>

                  {/* Public Key Display and clipboard click selectors (Matches Screenshot 2 share controls) */}
                  <div className="w-full space-y-4 max-w-md">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">Your Public Address</span>
                      <p className="font-mono text-xs text-gray-700 font-extrabold select-all break-all px-2">
                        {getWalletAddress(receiveToken)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={handleCopyClipboard}
                        className="flex items-center justify-center gap-2 py-4 bg-[#c0a080] hover:bg-[#d4b496] active:scale-95 text-white font-bold rounded-2xl transition-all shadow-md cursor-pointer text-sm"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <QrCode className="w-4 h-4" />}
                        {copied ? 'Address Copied!' : 'Copy Public Key'}
                      </button>

                      <button 
                        onClick={() => {
                          const demoAmt = requestInvoiceAmount ? parseFloat(requestInvoiceAmount) : 50;
                          setWalletBalance(prev => prev + (demoAmt * (marketData[receiveToken]?.price || 0.05)));
                          addTransaction('receive', demoAmt, `Deposited mock ${receiveToken} deposit via receipt Scan`);
                          triggerSuccess(`Mock transaction simulator credited your wallet with ${demoAmt} ${receiveToken}!`);
                        }}
                        className="flex items-center justify-center gap-2 py-4 bg-[#003366] hover:bg-[#002244] active:scale-95 text-white font-bold rounded-2xl transition-all shadow-md cursor-pointer text-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Simulate Deposit
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 4: TOKEN SWAP TAB (Screenshot 3: Token Swap Interface) */}
            {activeTab === 'swap' && (
              <motion.div
                key="tab-swap"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-emerald-500" /> Token Swap (DEX)
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setShowSlippageTooltip(!showSlippageTooltip)}
                    className="text-gray-400 hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <Info className="w-4 h-4" /> Explain Slippage
                  </button>
                </div>

                {/* Optional help explanation badge */}
                {showSlippageTooltip && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    className="bg-[#f8fafc] border border-gray-200 p-5 rounded-3xl text-xs text-gray-600 leading-relaxed space-y-2 mt-1"
                  >
                    <p className="font-bold text-gray-800">What is Slippage Tolerance?</p>
                    <p>Slippage refers to the price difference between what you expect to pay and the final price paid at swap execution. A tolerance filter prevents trades executing if high volatility changes trade returns beyond your safety limits.</p>
                  </motion.div>
                )}

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden">
                  
                  {/* YOU PAY (FROM) AREA */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Available Funds (Pay)</label>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[10px] text-gray-400 font-mono">Available: {getSwapAvailableBalance().toFixed(4)}</span>
                        <button 
                          onClick={handleSwapMax}
                          className="text-[10px] bg-[#c0a080]/15 hover:bg-[#c0a080]/25 text-[#8b5e3c] px-2 py-0.5 rounded-full transition-colors font-black"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 focus-within:border-emerald-300 border border-gray-100 transition-all">
                      <select 
                        value={swapFrom}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapFrom(val);
                          if (val !== 'USD' && swapTo !== 'USD') setSwapTo('USD');
                        }}
                        className="bg-transparent border-none outline-none font-black text-lg min-w-[110px] text-gray-900 cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
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

                  {/* REVERSAL SWAP INTERACTION ICON */}
                  <div className="flex justify-center -my-3 relative z-10">
                    <button 
                      onClick={() => {
                        const temp = swapFrom;
                        setSwapFrom(swapTo);
                        setSwapTo(temp);
                      }}
                      className="p-3.5 bg-gradient-to-tr from-[#c0a080] to-[#b09070] text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      <RefreshCw className="w-5 h-5 rotate-45" />
                    </button>
                  </div>

                  {/* YOU RECEIVE (TO) AREA */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 px-1 ml-1">Est. Conversion Yield (Receive)</label>
                    <div className="bg-slate-50/50 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
                      <select 
                        value={swapTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSwapTo(val);
                          if (val !== 'USD' && swapFrom !== 'USD') setSwapFrom('USD');
                        }}
                        className="bg-transparent border-none outline-none font-black text-lg min-w-[110px] text-gray-900 cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
                        {SUPPORTED_TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                      </select>
                      <p className="text-2xl font-black text-[#8b5e3c] font-mono leading-none">
                        {getSwapEstimatedReturn().toFixed(swapTo === 'USD' ? 2 : 6)}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Rate conversions stats */}
                  <div className="flex justify-between items-center bg-gray-50/40 p-3 rounded-xl text-xs font-mono text-gray-500 border border-slate-100/50 px-4">
                    <span>Rate exchange conversion:</span>
                    <span className="font-extrabold text-gray-800">
                      1 {swapFrom} = {getConversionRate().toFixed(swapTo === 'USD' ? 2 : 6)} {swapTo}
                    </span>
                  </div>

                  {/* Slippage tolerance cards configuration panel (Matches Screenshot 3 design details) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 px-1">Slippage Tolerance Options</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.5, 1.0, 3.0].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setSwapSlippage(val);
                            setCustomSlippageInput('');
                          }}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            swapSlippage === val && !customSlippageInput
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800' 
                              : 'bg-slate-50 border-gray-50 text-gray-400 hover:bg-slate-100/50'
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                      <div className="relative">
                        <input 
                          type="number"
                          value={customSlippageInput}
                          onChange={(e) => {
                            setCustomSlippageInput(e.target.value);
                            const valParsed = parseFloat(e.target.value);
                            if (!isNaN(valParsed)) setSwapSlippage(valParsed);
                          }}
                          placeholder="Custom %"
                          className="w-full bg-slate-50 border border-gray-10s text-right rounded-xl py-2 px-3 text-xs font-semibold focus:border-emerald-300 outline-none text-slate-750 placeholder-gray-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Execution Fees Summary */}
                  <div className="space-y-2.5 pt-4 border-t border-gray-50 text-xs text-gray-500 font-mono">
                    <div className="flex justify-between items-center">
                      <span>Liquidity Platform Fee:</span>
                      <span className="text-gray-800 font-bold">0.3% ($0.00 USD)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Network Gas Processing Fee:</span>
                      <span className="text-emerald-600 font-bold">$0.35 USD (12 Gwei)</span>
                    </div>
                  </div>

                  {/* Execution Swap Button */}
                  <button 
                    onClick={executeSwapTrade}
                    disabled={!swapAmount || parseFloat(swapAmount) <= 0}
                    className="w-full py-5 bg-[#c0a080] hover:bg-[#d4b496] active:scale-[0.99] text-white font-black rounded-3xl transition-all shadow-md disabled:opacity-50 disabled:grayscale uppercase tracking-widest cursor-pointer text-sm"
                  >
                    Slide to Confirm Token Exchange
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 5: YIELD FARMS & STAKING POOLS (Screenshot 1: Farms & Pools) */}
            {activeTab === 'farms' && (
              <motion.div
                key="tab-farms"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex flex-col">
                  <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> Verse Liquidity Farms
                  </h4>
                  <p className="text-xs text-[#8b5e3c] font-mono">Stake VERSE tokens to harvest compound mining reward yields!</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {FARMS.map(farm => {
                    const stakedVal = stakedAmounts[farm.id] || 0;
                    const accumulatedReward = unclaimedRewards[farm.id] || 0;

                    return (
                      <div 
                        key={farm.id}
                        className="bg-white border border-gray-150 p-6 rounded-[2.5rem] shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/5 rounded-full filter blur-3xl pointer-events-none" />
                        
                        {/* Farm Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            {/* Overlapping double coin badge representing pool holdings */}
                            <div className="flex -space-x-4 relative">
                              <img src={farm.icon1} className="w-11 h-11 rounded-full border-2 border-white relative z-20 shadow-md" referrerPolicy="no-referrer" />
                              <img src={farm.icon2} className="w-11 h-11 rounded-full border-2 border-white relative z-10 shadow-md" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-base text-gray-900">{farm.name}</h5>
                              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{farm.pair} Liquidity pair</p>
                            </div>
                          </div>
                          
                          {/* APY Rewards Rate */}
                          <div className="text-right">
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 block font-bold">ANNUAL REWARDS APY</span>
                            <span className="text-2xl font-black text-emerald-600 font-mono tracking-tight">{farm.apy}%</span>
                          </div>
                        </div>

                        {/* Staked balances vs rewards panel */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-3xl border border-dashed border-gray-250 mb-6">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">YOUR STAKED PRINCIPAL</span>
                            <p className="text-xl font-mono font-black text-slate-800 mt-1">{stakedVal.toFixed(2)} VERSE</p>
                            <span className="text-[10px] text-slate-400 block font-mono">≈ ${(stakedVal * (marketData['VERSE']?.price || 0.05)).toFixed(2)} USD</span>
                          </div>

                          <div className="border-l border-gray-250 pl-5 relative flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b5e3c] block font-bold">UNCLAIMED REWARDS ACCRUED</span>
                              <p className="text-xl font-mono font-black text-rose-600 mt-1">{accumulatedReward.toFixed(5)} VERSE</p>
                            </div>
                            
                            {/* Claim/Harvest buttons */}
                            {accumulatedReward > 0 && (
                              <button
                                onClick={() => handleHarvest(farm.id)}
                                className="mt-2 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-3 py-1 bg-white items-center gap-1 font-bold rounded-lg uppercase tracking-wider w-max transition-all animate-pulse"
                              >
                                HARVEST REWARDS
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Action buttons (Staking inputs & triggers) */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              const inputAmt = prompt("How many VERSE tokens from your balance would you like to stake/lock to lease rewards?");
                              if (inputAmt) handleStake(farm.id, parseFloat(inputAmt));
                            }}
                            className="flex-1 py-3 bg-slate-900 border border-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-[#c0a080] hover:border-[#c0a080] transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5" /> Stake VERSE
                          </button>

                          {stakedVal > 0 && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to unstake ${stakedVal.toFixed(2)} VERSE tokens from this liquidity pool and recover accrued rewards?`)) {
                                  handleUnstake(farm.id);
                                }
                              }}
                              className="flex-1 py-3 border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-500 hover:text-red-600 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              Unstake VERSE
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* SIDEBAR FOR TRANS LEDGER (Screenshot 5: Recent operations) */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2"><History className="w-4.5 h-4.5 text-[#c0a080]" /> Ledger history</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-tighter">TOTAL: {history.length}</span>
            </h4>
            
            <div className="space-y-5">
              {history.length > 0 ? (
                history.map(tx => (
                  <div key={tx.id} className="flex items-center gap-4 group hover:bg-slate-50/50 p-2 rounded-2xl transition-all">
                    <div className={`p-3 rounded-2xl h-11 w-11 flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-emerald-50 text-emerald-500' : 
                      tx.type === 'earned' ? 'bg-[#c0a080]/10 text-[#8b5e3c]' :
                      tx.type === 'swap' ? 'bg-blue-50 text-blue-500' :
                      'bg-rose-50 text-rose-500'
                    }`}>
                      {tx.type === 'receive' ? <ArrowDownLeft className="w-4 h-4" /> : 
                       tx.type === 'earned' ? <Sparkles className="w-3.5 h-3.5" /> :
                       tx.type === 'swap' ? <ArrowRightLeft className="w-4 h-4" /> :
                       <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 truncate">{tx.description}</p>
                      <p className="text-[9px] text-[#8b5e3c] font-mono tracking-tighter mt-0.5">
                        {new Date(tx.date).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`text-xs font-black ${
                        ['receive', 'earned'].includes(tx.type) ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {['receive', 'earned'].includes(tx.type) ? '+' : '-'}{tx.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300 text-xs italic font-serif">No transaction entries found in history.</p>
                </div>
              )}
            </div>
          </div>

          {/* Toast Error Alert boxes */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 text-center text-xs font-bold font-mono tracking-tight"
              >
                ⚠ ERROR: {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 text-center text-xs font-bold font-mono tracking-tight"
              >
                ✓ SUCCESS: {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}

// Support function inside layout helper for dynamic color classification of token stats
function dctStyle(val: number) {
  return val >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 'bg-rose-50 text-rose-500 border border-rose-200/50';
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
