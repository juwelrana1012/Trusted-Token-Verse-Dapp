import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Search,
  BookOpen,
  Bookmark,
  Share2,
  User,
  Settings,
  Briefcase,
  Flame,
  Percent,
  CheckCircle2,
  QrCode,
  ExternalLink,
  MapPin,
  Compass,
  Trophy,
  Activity,
  PlusCircle,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Lock,
  Globe,
  Bell,
  Send,
  Eye,
  EyeOff,
  Languages,
  Volume2,
  VolumeX,
  Plus,
  MessageSquare,
  Clock,
  Award
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

interface BitcoinWalletDashboardProps {
  onBack: () => void;
}

interface WalletAsset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  quantity: number;
  price: number;
  change24h: number;
  category: 'bitcoin' | 'ethereum' | 'polygon' | 'bnb' | 'custom';
}

interface CoinMarket {
  logo: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
  vol: string;
  cap: string;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  time: string;
  thumbnail: string;
  category: string;
  url: string;
  saved?: boolean;
  featured?: boolean;
  views?: number;
  shares?: number;
}

export default function BitcoinWalletDashboard({ onBack }: BitcoinWalletDashboardProps) {
  // Navigation & Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return safeStorage.getItem('btc_wallet_authed') === 'true';
  });
  const [authEmail, setAuthEmail] = useState(() => {
    return safeStorage.getItem('btc_wallet_email') || 'user@wallet.com';
  });
  const [authPassword, setAuthPassword] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authType, setAuthType] = useState<'standard' | 'google' | 'telegram'>(() => {
    return (safeStorage.getItem('btc_wallet_authtype') as any) || 'standard';
  });
  const [telegramInput, setTelegramInput] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleUsers] = useState([
    { name: 'Juwel Rana', email: 'mdjuwelranajx127133@gmail.com', avatar: 'https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg' },
    { name: 'Rana Jx', email: 'ranajx127@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
  ]);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'markets' | 'trade' | 'news' | 'more'>(() => {
    return (safeStorage.getItem('btc_wallet_active_tab') as any) || 'home';
  });

  useEffect(() => {
    safeStorage.setItem('btc_wallet_active_tab', activeTab);
  }, [activeTab]);
  const [subWallets, setSubWallets] = useState<Array<{ name: string; type: string; address: string }>>([
    { name: 'Primary Bitcoin Wallet', type: 'bitcoin', address: 'bc1q9x5g8h9z...8hj' },
    { name: 'Ethereum Defi Wallet', type: 'ethereum', address: '0x3F98...8e9d' },
    { name: 'Polygon Verse Wallet', type: 'polygon', address: '0x81b7...a342' },
    { name: 'BNB Smart Chain Wallet', type: 'bnb', address: '0x992E...40d0' }
  ]);
  const [selectedWalletType, setSelectedWalletType] = useState<string>('bitcoin');

  // Interactive Coin price ticker simulator
  const [simulatedPrices, setSimulatedPrices] = useState<Record<string, number>>({
    BTC: 68420.50,
    ETH: 3512.40,
    USDT: 1.00,
    USDC: 1.00,
    BNB: 592.10,
    XRP: 0.54,
    MATIC: 0.72,
    VERSE: 0.048,
    SOL: 164.30
  });

  const [sparklines, setSparklines] = useState<Record<string, number[]>>({
    BTC: [67100, 67400, 67200, 67800, 68050, 68200, 68420.50],
    ETH: [3400, 3420, 3460, 3490, 3470, 3500, 3512.40],
    BNB: [580, 582, 590, 588, 593, 591, 592.10],
    XRP: [0.52, 0.53, 0.51, 0.55, 0.54, 0.53, 0.54],
    MATIC: [0.68, 0.70, 0.69, 0.71, 0.74, 0.73, 0.72],
    VERSE: [0.042, 0.045, 0.046, 0.043, 0.047, 0.049, 0.048],
    SOL: [159, 161, 160, 163, 162, 165, 164.30]
  });

  // Assets quantities held by the user
  const [assets, setAssets] = useState<WalletAsset[]>([
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', quantity: 0.125, price: 68420.50, change24h: 3.2, category: 'bitcoin' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', quantity: 1.25, price: 3512.40, change24h: 2.1, category: 'ethereum' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', quantity: 450.00, price: 1.00, change24h: 0.0, category: 'ethereum' },
    { id: 'usdc', name: 'U.S. Dollar Coin', symbol: 'USDC', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', quantity: 200.00, price: 1.00, change24h: 0.0, category: 'ethereum' },
    { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', quantity: 0.85, price: 592.10, change24h: -1.3, category: 'bnb' },
    { id: 'xrp', name: 'Ripple', symbol: 'XRP', logo: 'https://cryptologos.cc/logos/ripple-xrp-logo.png', quantity: 380, price: 0.54, change24h: 1.5, category: 'bitcoin' },
    { id: 'matic', name: 'Polygon', symbol: 'MATIC', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png', quantity: 650, price: 0.72, change24h: 5.4, category: 'polygon' },
    { id: 'verse', name: 'Verse', symbol: 'VERSE', logo: 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png', quantity: 12500, price: 0.048, change24h: 12.8, category: 'polygon' }
  ]);

  // Sync assets with simulatedPrices
  useEffect(() => {
    setAssets(prev => prev.map(asset => {
      if (simulatedPrices[asset.symbol]) {
        return {
          ...asset,
          price: simulatedPrices[asset.symbol]
        };
      }
      return asset;
    }));
  }, [simulatedPrices]);

  // Live simulate random asset moves
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(sym => {
          if (sym === 'USDT' || sym === 'USDC') return;
          const fluctuation = (Math.random() - 0.5) * 0.01; // max 0.5% change
          next[sym] = parseFloat((next[sym] * (1 + fluctuation)).toFixed(sym === 'VERSE' ? 5 : 2));
        });
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  // Quick action modals
  const [sendModal, setSendModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Send fields
  const [sendAsset, setSendAsset] = useState('BTC');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  // Buy state
  const [buyAsset, setBuyAsset] = useState('BTC');
  const [buyAmount, setBuyAmount] = useState('100');
  const [buyMethod, setBuyMethod] = useState<'card' | 'bank' | 'apple'>('card');

  // Sell state
  const [sellAsset, setSellAsset] = useState('BTC');
  const [sellAmount, setSellAmount] = useState('');

  // Swap / Trade engine state
  const [swapPayAsset, setSwapPayAsset] = useState('BTC');
  const [swapPayAmount, setSwapPayAmount] = useState('');
  const [swapReceiveAsset, setSwapReceiveAsset] = useState('VERSE');
  const [rateType, setRateType] = useState<'fixed' | 'floating'>('floating');

  // Markets state
  const [marketSearch, setMarketSearch] = useState('');
  const [marketFilter, setMarketFilter] = useState<'all' | 'gainers' | 'losers' | 'trending' | 'vol' | 'cap'>('all');

  // News states and Global Real-Time Automated Core News System declarations
  const [newsCategory, setNewsCategory] = useState<'all' | 'saved'>('all');
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<NewsArticle | null>(null);
  const [automatedNewsStreamActive, setAutomatedNewsStreamActive] = useState(true);
  const [nextFetchSeconds, setNextFetchSeconds] = useState(30);
  const [newsActiveReaders, setNewsActiveReaders] = useState(12480);
  const [newsFilterTopic, setNewsFilterTopic] = useState<string>('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    '🌐 Core News Socket Connected: OK',
    '📊 Listening on Global Consensus Web3 Nodes',
    '📡 Ready to receive RSS and API Broadcast streams'
  ]);

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() => {
    const saved = safeStorage.getItem('shared_verse_news');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse news articles", e);
      }
    }
    return [
      {
        id: 'n-1',
        title: 'Bitcoin Surges Past $68,000 as Institutional Inflow Reaches Record Highs',
        description: 'Exchange-traded funds see massive daily capital inflows exceeding $1.2B as major financial managers speed up physical Bitcoin acquisitions worldwide.',
        content: 'Institutional interest in digital assets has formally achieved legendary milestones. Analysts from traditional asset management houses indicate this represents a major secular transition toward secure decentralized stores of value. Sovereign wealth allocations are reported to be next in line to implement structural spot purchases, driving absolute market liquidities to previously unimaginable heights. Global regulatory frameworks have similarly matured, establishing safe environments for mainstream client onboarding at unprecedented scales.',
        source: 'Verse News Agency',
        time: '1m ago',
        thumbnail: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=300&auto=format&fit=crop',
        category: 'Bitcoin',
        url: '#',
        saved: false,
        featured: true,
        views: 24903,
        shares: 1420
      },
      {
        id: 'n-2',
        title: 'Ethereum Gas Fees Hit Record Lows as Layer-2 Adoption Skyrockets',
        description: 'Major scaling rollups successfully offload more than 94% of standard daily smart contract interactions, creating a seamless user checkout flow.',
        content: 'Technological progression of Layer-2 execution clients has resulted in historic network transaction fee drops. Decentralized application developers can now configure high-frequency microtransactions without compromising on decentralized security guarantees provided by the Ethereum base layer. This facilitates full mainstream Web3 scalability, proving serverless architecture is superior. Major rollups such as Arbitrum, Optimism, and Base continue to post massive records.',
        source: 'ETH Hub Global',
        time: '15m ago',
        thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=300&auto=format&fit=crop',
        category: 'Ethereum',
        url: '#',
        saved: true,
        featured: true,
        views: 18451,
        shares: 890
      },
      {
        id: 'n-3',
        title: 'Verse Launchpad Announces Two Web3 Projects Scheduled for Ecosystem Launch',
        description: 'The Bitcoin.com local utility token Verse partners with premier developers to launch structured DeFi utilities and reward-earning platforms.',
        content: 'Ecosystem development is critical to sustain utility valuation. The upcoming launch pad items introduce automated, multi-chain liquidity aggregation algorithms. Holders of VERSE will receive first-priority queue allocations alongside multiplier staking factors, raising dynamic engagement levels for the entire chain. Active Web3 developers praised Bitcoin.com for facilitating seamless developer kits and immediate target accessibility for thousands of retail wallets.',
        source: 'Bitcoin.com Media Office',
        time: '1h ago',
        thumbnail: 'https://images.unsplash.com/photo-1639762681057-40802193114c?q=80&w=300&auto=format&fit=crop',
        category: 'Ecosystem',
        url: '#',
        saved: false,
        featured: false,
        views: 9540,
        shares: 432
      },
      {
        id: 'n-4',
        title: 'How Multi-chain Non-custodial Wallets Safe-keep Assets in a Fractured Chain Landscape',
        description: 'An educational breakdown on how cryptography-backed seed phrase structures guard separate chain private keys safely.',
        content: 'Security of private wallet assets remains the ultimate frontier of user autonomy. Multi-chain integrations like the newly designed Bitcoin.com Wallet utilize high-grade client side elliptic curve signing algorithms. The private key never leaves your local physical storage, leaving no traces on third-party backend servers. By combining zero-trust cryptographic models with dynamic on-device PIN checks or biometric protections, users achieve absolute digital sovereign independence.',
        source: 'Web3 Academy Insights',
        time: '3h ago',
        thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=300&auto=format&fit=crop',
        category: 'Wallets',
        url: '#',
        saved: false,
        featured: false,
        views: 14205,
        shares: 1102
      }
    ];
  });

  // Save newsArticles update automatically to preserve broadcast updates across global clients load
  useEffect(() => {
    safeStorage.setItem('shared_verse_news', JSON.stringify(newsArticles));
  }, [newsArticles]);

  // Form states for broadcasting custom news updates
  const [showNewsCreatorForm, setShowNewsCreatorForm] = useState(false);
  const [newsPublishTitle, setNewsPublishTitle] = useState('');
  const [newsPublishCategory, setNewsPublishCategory] = useState('Bitcoin');
  const [newsPublishDescription, setNewsPublishDescription] = useState('');
  const [newsPublishContent, setNewsPublishContent] = useState('');
  const [newsPublishSource, setNewsPublishSource] = useState('Verse News Hub');
  const [newsPublishThumbnail, setNewsPublishThumbnail] = useState('https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=300&auto=format&fit=crop');

  // Custom translation and comments
  const [languageMode, setLanguageMode] = useState<'en' | 'bn'>('en');

  // Interactive Quiz states within details
  const [selectedNewsQuizStep, setSelectedNewsQuizStep] = useState(false);
  const [newsQuizAnswered, setNewsQuizAnswered] = useState(false);
  const [newsQuizSelection, setNewsQuizSelection] = useState<number | null>(null);
  const [newsQuizIsCorrect, setNewsQuizIsCorrect] = useState<boolean | null>(null);

  // Audio system simulation
  const [isVoiceReading, setIsVoiceReading] = useState(false);
  const [voiceSpeechCounter, setVoiceSpeechCounter] = useState(0);

  // Comments mapping state
  const [articleComments, setArticleComments] = useState<{ [id: string]: Array<{ author: string; text: string; time: string }> }>(() => {
    const saved = safeStorage.getItem('shared_verse_news_comments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse article comments from storage", e);
      }
    }
    return {
      'n-1': [
        { author: 'Juwel Rana', text: 'This represents absolute validation for decentralized assets. Awesome summary!', time: '10m ago' },
        { author: 'Enoch_V', text: 'Where can I check these SEC file transactions directly?', time: '5m ago' }
      ],
      'n-2': [
        { author: 'Niko_Dev', text: 'Layer-2 technology solves congestion. Transaction speeds have excelled!', time: '12m ago' }
      ]
    };
  });
  const [tempCommentAuthor, setTempCommentAuthor] = useState('');
  const [tempCommentText, setTempCommentText] = useState('');

  // Persist comments to localstorage
  useEffect(() => {
    safeStorage.setItem('shared_verse_news_comments', JSON.stringify(articleComments));
  }, [articleComments]);

  // Automated background global news provider simulation pool
  const [newsProviderPool, setNewsProviderPool] = useState<NewsArticle[]>([
    {
      id: 'n-5',
      title: 'Solana Smart Contracts Upgrade Increases Transaction Throughput by 45%',
      description: 'The latest mainnet protocol deployment successfully mitigates validation bottlenecks, processing over 52,000 real-world TPS.',
      content: 'Solana validation engineers finished a historical core upgrade which optimizes message handling across multiple server clusters. DApp users report incredibly fast confirmation latency times, which have dropped below 420 milliseconds globally. This upgrade is anticipated to spark an explosion of interactive Web3 trading apps, fully decentralized orderbooks, and on-chain physics engines that were previously impossible on legacy chains.',
      source: 'Solana Feed',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=300&auto=format&fit=crop',
      category: 'Web3',
      url: '#',
      saved: false,
      views: 4210,
      shares: 212
    },
    {
      id: 'n-6',
      title: 'US SEC Approves First Multi-Chain Spot ETF Package in Landmark Crypto Ruling',
      description: 'Major asset classes Bitcoin, Ethereum, and Polygon are officially structured inside an omnibus investment product for pension funds.',
      content: 'In an unprecedented regulatory shift, the US Securities and Exchange Commission approved a combined digital asset index product. This allows traditional investment trusts to purchase composite exposure via the stock market. Major mutual funds have already placed buy orders worth $3.5 Billion ahead of market open, validating the maturity and demand for decentralized infrastructure platforms.',
      source: 'Global Finance Network',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=300&auto=format&fit=crop',
      category: 'Regulations',
      url: '#',
      saved: false,
      views: 8905,
      shares: 981
    },
    {
      id: 'n-7',
      title: 'Tether reserves climb to records: $6.2B cash buffer verified in Q1 audit',
      description: 'Independent accounting verifies 105% collateralization backing USDT with primary sovereign treasuries and liquid gold vaults.',
      content: 'Stablecoin pioneer Tether published its comprehensive financial breakdown today, disclosing record-breaking cash flow profits. The surplus reserves operate as an absolute insurance mechanism, protecting the digital economy from black-swan liquidity contractions. Global usage of stablecoins in developing countries continues to increase rapidly relative to local currency inflations.',
      source: 'Stablecoin Monitor',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=300&auto=format&fit=crop',
      category: 'Regulations',
      url: '#',
      saved: false,
      views: 7421,
      shares: 412
    },
    {
      id: 'n-8',
      title: 'Binance API incorporates advanced Zero-Knowledge Proofs for Web3 Transactions',
      description: 'The secure upgrade allows global enterprise partners to verify liquidity balances without disclosing inner account keys.',
      content: 'Corporate blockchain adoption was previously slowed by the lack of structural transactional privacy. The introduction of zero-knowledge proofs (ZKP) solves this perfectly, letting enterprise applications broadcast compliance checks while keeping corporate logistics secret. This development signals a new era of trustless cooperation across competitive logistics industries.',
      source: 'SecurTech Research',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=300&auto=format&fit=crop',
      category: 'Core Tech',
      url: '#',
      saved: false,
      views: 6511,
      shares: 185
    },
    {
      id: 'n-9',
      title: 'Polygon POL token completes automatic upgrade with 99.8% migration rate',
      description: 'Native assets transitioned seamlessly into utility functions backing network validators on the new AggLayer protocol.',
      content: 'Polygon ecosystem announced the complete transition to the next-generation POL token framework. The POL token operates as an omnipresent gas utility, enabling cross-chain consensus validation throughout the zero-knowledge aggregate layer (AggLayer). Decentralized finance apps built on MATIC experienced zero downtime, showcasing high-grade software execution practices.',
      source: 'AggLayer Weekly',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=300&auto=format&fit=crop',
      category: 'DeFi',
      url: '#',
      saved: false,
      views: 12891,
      shares: 611
    },
    {
      id: 'n-10',
      title: 'Global Central Bank Interest cuts trigger speculative crypto accumulation',
      description: 'Analysis confirms sovereign yields dropped below 2.5%, driving institutional capital directly toward yield-bearing DeFi platforms.',
      content: 'Sovereign inflation adjustments have forced national banks to decrease debt interest rates. This makes traditional cash reserves less attractive compared to decentralized passive earnings interfaces. Quantitative analysts estimate a potential redirect of over $45 Billion from standard treasury notes into smart contract pools in the upcoming weeks, sparking high demand.',
      source: 'Macro Markets Live',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&auto=format&fit=crop',
      category: 'Bitcoin',
      url: '#',
      saved: false,
      views: 15410,
      shares: 721
    },
    {
      id: 'n-11',
      title: 'Artificial Intelligence DeFi Pools outperform standard indices by 180%',
      description: 'Decentralized automated agents successfully trade cross-chain liquidities using real-time market sentiment engines.',
      content: 'Decentralized autonomous organizations (DAOs) that utilize smart learning models for asset allocations report record yields. By studying global microtrends, social headlines, and continuous order sheets simultaneously, AI-driven bots execute optimized swap routes that humans are too slow to find, demonstrating the massive potential of high-tech algorithms.',
      source: 'AI Edge Reports',
      time: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=300&auto=format&fit=crop',
      category: 'Ecosystem',
      url: '#',
      saved: false,
      views: 21900,
      shares: 1545
    }
  ]);

  // More page states
  const [showDappModal, setShowDappModal] = useState<string | null>(null);
  const [setupSecurity, setSetupSecurity] = useState({ email: true, phone: false, backup: false, pin: true, kyc: false });
  const [stakedBalance, setStakedBalance] = useState<Record<string, number>>({ VERSE: 5000, BTC: 0 });
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingAsset, setStakingAsset] = useState('VERSE');
  const [rewardPoints, setRewardPoints] = useState(250);
  const [referralLink, setReferralLink] = useState('https://wallet.bitcoin.com/refer?code=VERSE_USER');
  const [customWalletName, setCustomWalletName] = useState('');
  const [customChain, setCustomChain] = useState('Solana');

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 'task-1', text: 'Daily Check-In Claim', points: 15, completed: false },
    { id: 'task-2', text: 'Read a market news update', points: 20, completed: false },
    { id: 'task-3', text: 'Execute a simulation Swap', points: 50, completed: false }
  ]);

  // Admin view variables
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState([
    { email: 'user@wallet.com', status: 'Active', balance: '$12,450.50' },
    { email: 'crypto_champ@domain.org', status: 'Pending KYC', balance: '$2,810.00' },
    { email: 'anonymous_whale@btc.com', status: 'Suspended', balance: '$1,230,000.00' }
  ]);

  // Utility copy handler
  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopied(identifier);
    triggerAlert('Address Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const triggerAlert = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  // Automated Global Broadcast stream ticking engine for Bitcoin.com Core News System
  useEffect(() => {
    const timer = setInterval(() => {
      // Periodic reader count fluctuation to simulate real live global viewership
      setNewsActiveReaders(prev => {
        const offset = Math.floor(Math.random() * 15) - 7;
        const nextVal = prev + offset;
        return nextVal < 10000 ? 11500 : nextVal;
      });

      if (!automatedNewsStreamActive) return;

      setNextFetchSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          // Trigger automated integration after this state update completes to avoid nesting side effects
          setTimeout(() => {
            setNewsProviderPool(oldPool => {
              let nextArticle: NewsArticle;
              let updatedPool = [...oldPool];

              if (updatedPool.length > 0) {
                nextArticle = updatedPool[0];
                updatedPool.shift(); // remove it
              } else {
                // Generate realistic dynamic infinite web3 blockchain news dynamically
                const subs = [
                  'Ripple (XRP)', 'Cardano (ADA)', 'Shiba Inu (SHIB)', 'Dogecoin (DOGE)', 'Uniswap (UNI)', 
                  'Chainlink (LINK)', 'Lido DAO (LDO)', 'Sui Network (SUI)', 'Aptos (APT)', 'Monero (XMR)'
                ];
                const verbs = [
                  'completes major cryptographic security audit with zero vulnerabilities found', 
                  'launches high-frequency decentralized swap liquidity pools on mainnet', 
                  'secures absolute payment integration approval from Singapore authorities', 
                  'introduces zero-knowledge cryptographic signature options inside API packages', 
                  'deploys native layer-3 bridges targeting high-speed client microtransactions',
                  'partners with global digital assets conglomerate to support decentralized commerce'
                ];
                const categories = ['DeFi', 'Regulations', 'Web3', 'Ecosystem', 'Altcoins'];
                const sources = ['Decentralized Mirror', 'Chain Insights', 'Token Ledger', 'Ecosystem Wire', 'Block Report'];
                
                const chosenSub = subs[Math.floor(Math.random() * subs.length)];
                const chosenVerb = verbs[Math.floor(Math.random() * verbs.length)];
                const chosenCategory = categories[Math.floor(Math.random() * categories.length)];
                const chosenSource = sources[Math.floor(Math.random() * sources.length)];
                
                const viewsCount = Math.floor(Math.random() * 7000) + 2000;
                const sharesCount = Math.floor(Math.random() * 600) + 80;
                
                nextArticle = {
                  id: 'n-dyn-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
                  title: `${chosenSub} ${chosenVerb} successfully`,
                  description: `Sovereign network consensus validators confirm outstanding hardware node stability yields following the ${chosenSource} update deployment.`,
                  content: `Decentralized application builders have welcomed the next-generation scaling protocols published today. Initial telemetry performance benchmarks trace direct throughput surges with close to zero gas-cost overhead. Leading core developer teams shared plans onto social platforms highlighting immediate decentralized integrations. This fully matches absolute requirements for safe cryptographic custody and globally accessible payments across all active wallet frameworks.`,
                  source: chosenSource,
                  time: 'Just now',
                  thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=300&auto=format&fit=crop',
                  category: chosenCategory,
                  url: '#',
                  saved: false,
                  views: viewsCount,
                  shares: sharesCount
                };
              }

              // Append onto main news feed in real-time
              const freshArticle = { ...nextArticle, time: 'Just now' };
              setNewsArticles(oldArticles => [freshArticle, ...oldArticles]);
              
              // Direct visual notification to indicate real-time background sync
              triggerAlert(`🌐 Global Broadcast Synced: "${freshArticle.title.substring(0, 35)}..."`);
              
              // Append to logs
              setSimulationLogs(logs => [
                `📡 System synced [${freshArticle.category}] at ${new Date().toLocaleTimeString()}`,
                ...logs.slice(0, 4)
              ]);

              return updatedPool;
            });
          }, 0);

          return 30; // reset countdown to 30 seconds
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [automatedNewsStreamActive]);

  // Portfolio aggregates
  const calculateTotalBalance = () => {
    let sum = 0;
    assets.forEach(asset => {
      sum += asset.quantity * asset.price;
    });
    return sum;
  };

  const totalBalance = calculateTotalBalance();
  const dailyGainLoss = totalBalance * 0.048; // Assume 4.8% up today statically but changing as value changes

  // Custom wallet addition
  const handleAddCustomWallet = () => {
    if (!customWalletName) return;
    setSubWallets(prev => [
      ...prev,
      { name: customWalletName, type: customChain.toLowerCase(), address: '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase() }
    ]);
    setCustomWalletName('');
    triggerAlert('New ' + customChain + ' wallet added successfully!');
  };

  // Auth procedures
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    safeStorage.setItem('btc_wallet_authed', 'true');
    setIsAuthenticated(true);
    triggerAlert('Welcome back and secure your session!');
  };

  const handleLogout = () => {
    safeStorage.removeItem('btc_wallet_authed');
    safeStorage.removeItem('btc_wallet_email');
    safeStorage.removeItem('btc_wallet_authtype');
    setIsAuthenticated(false);
    setAuthEmail('user@wallet.com');
    setAuthType('standard');
    setTelegramInput('');
    triggerAlert('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-[#c0a080]/30 relative">
      {/* Dynamic Pop-up Notifications */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white font-bold px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600"
            title="Go to main screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
              <img
                src="https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5 text-gray-900">
                Bitcoin.com <span className="text-[#8b5e3c]">Wallet</span>
              </h1>
              <p className="text-[10px] font-mono tracking-wider uppercase text-emerald-600 font-extrabold">ECOSYSTEM PLATFORM</p>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-brown-100 hover:text-[#8b5e3c] border border-gray-200 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              Admin Mode
            </button>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </header>

      {/* LOGIN BLOCK IF UNAUTHORIZED */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto px-4 py-12 relative animate-[fadeIn_0.5s_ease-out]">
          {/* Animated Decorative gradient background blobs */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-100/80 relative overflow-hidden">
            
            {/* Brand logo header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-lg mx-auto mb-4 border-2 border-slate-50 transition-transform hover:scale-105 duration-300">
                <img
                  src="https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg"
                  alt="Bitcoin.com Wallet Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5">
                Bitcoin.com <span className="text-[#8b5e3c]">Wallet</span>
              </h2>
              <p className="text-[10px] font-mono tracking-widest text-[#8b5e3c] font-bold uppercase mt-1">Ecosystem Game Portal</p>
            </div>

            {/* Tabs list for Sign In / Sign Up */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${!isSignUp ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${isSignUp ? 'bg-gradient-to-r from-[#8b5e3c] to-[#a67148] text-white shadow-sm' : 'text-slate-500 hover:text-[#a67148]'}`}
              >
                Sign Up 🚀
              </button>
            </div>

            {/* RENDER DYNAMIC CARD CONTENT */}
            {!isSignUp ? (
              // Standard Sign In layout
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-500 text-center leading-relaxed mb-2">
                  Please log in securely using your registered credentials or select <span className="text-[#8b5e3c] font-bold underline cursor-pointer hover:text-[#a67148]" onClick={() => setIsSignUp(true)}>Sign Up</span> above to register a new account.
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address or Username</label>
                    <input
                      type="text"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Enter email or username"
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none rounded-2xl px-4 py-3.5 text-sm transition-all text-slate-800 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none rounded-2xl px-4 py-3.5 text-sm transition-all"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#8b5e3c] to-[#a67148] hover:shadow-lg transition-all active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer border-t border-white/20"
                    >
                      <Lock className="w-4 h-4" />
                      Sign In to Portal
                    </button>
                  </div>
                </form>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthEmail('mdjuwelranajx127133@gmail.com');
                      setAuthPassword('supersecret');
                      triggerAlert('Demo credentials filled successfully!');
                    }}
                    className="text-[11px] text-[#8b5e3c] hover:underline font-bold transition-all cursor-pointer"
                  >
                    Autofill Demo Credentials
                  </button>
                </div>
              </div>
            ) : (
              // Detailed Interactive Sign Up options
              <div className="space-y-6">
                {/* Sign Up Help banner explaining how to sign up */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-4 text-xs text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[12px]">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Sign-Up Guide & Instructions</span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
                    Please use one of the simple channels below to configure your user session:
                  </p>
                  <ul className="list-disc pl-4 text-[11px] space-y-1.5 text-slate-600 font-semibold">
                    <li><strong className="text-emerald-700 font-bold">Google Account:</strong> Sign in instantly with a single click using Google Authentication.</li>
                    <li><strong className="text-sky-700 font-bold">Telegram Username:</strong> Connect to the game gateway instantly with your Telegram username handler.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  
                  {/* OPTION 1: GOOGLE SINGLE SIGN-ON BUTTON */}
                  <div className="border border-slate-100 rounded-[1.8rem] p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-slate-800">Google Account Sign Up</h3>
                          <p className="text-[10px] text-slate-400 font-semibold font-mono">Sign in with Google</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 font-black px-2 py-0.5 rounded-full uppercase font-mono">Instant</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGoogleModal(true);
                        triggerAlert('Please select a Google Account!');
                      }}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs transition-all border border-slate-200 shadow-sm cursor-pointer group-hover:scale-[1.01]"
                    >
                      {/* Simulated Google Logo / Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.564-1.88 4.6-6.887 4.6-4.33 0-7.859-3.582-7.859-8s3.53-8 7.859-8c2.462 0 4.113 1.018 5.051 1.916l3.251-3.129C18.29 1.191 15.54 0 12.24 0 5.48 0 0 5.373 0 12s5.48 12 12.24 12c7.058 0 11.76-4.882 11.76-11.758 0-.79-.08-1.401-.18-1.957H12.24z"/>
                      </svg>
                      Sign Up with Google
                    </button>
                  </div>

                  {/* OPTION 2: TELEGRAM USERNAME BUTTON & INPUT */}
                  <div className="border border-slate-100 rounded-[1.8rem] p-4 bg-sky-50/20 hover:bg-sky-50/40 hover:border-sky-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center">
                          <Send className="w-4 h-4 text-sky-500 rotate-45 animate-bounce" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-slate-800">Telegram Username Login</h3>
                          <p className="text-[10px] text-slate-400 font-semibold font-mono">Telegram Username Login</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-sky-500/10 text-sky-600 font-black px-2 py-0.5 rounded-full uppercase font-mono">Secure</span>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500 font-mono font-black text-sm">@</span>
                        <input
                          type="text"
                          value={telegramInput}
                          onChange={(e) => setTelegramInput(e.target.value)}
                          placeholder="mdjuwelranajx"
                          className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none rounded-xl pl-8 pr-4 py-3 text-xs text-slate-800 font-bold tracking-wide"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (!telegramInput.trim()) {
                            triggerAlert('Please enter your Telegram username!');
                            return;
                          }
                          const cleanUsername = telegramInput.trim().startsWith('@') 
                            ? telegramInput.trim() 
                            : '@' + telegramInput.trim();
                          setAuthEmail(cleanUsername);
                          setAuthType('telegram');
                          safeStorage.setItem('btc_wallet_email', cleanUsername);
                          safeStorage.setItem('btc_wallet_authtype', 'telegram');
                          safeStorage.setItem('btc_wallet_authed', 'true');
                          setIsAuthenticated(true);
                          triggerAlert(`Successfully entered the game as Telegram user ${cleanUsername}!`);
                        }}
                        className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md shadow-sky-500/15 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Access Game Dashboard 🎮
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
          
          {/* CUSTOM MOCK GOOGLE ACCOUNT SSO OVERLAY MODAL */}
          <AnimatePresence>
            {showGoogleModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100"
                >
                  {/* Google Brand Header */}
                  <div className="p-6 text-center border-b border-slate-50 bg-slate-50/50">
                    <div className="flex justify-center mb-1.5">
                      <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.82z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 5 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.93 11.93 0 0 0 0 12c0 2.05.52 4 1.21 5.46l4.11-3.22z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.22c.94-2.85 3.57-4.93 6.68-4.93z"/>
                      </svg>
                    </div>
                    <h3 className="text-sm font-black text-slate-800">Sign In with Google Account</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-bold font-mono">Choose an account for Bitcoin.com Game</p>
                  </div>

                  {/* Google accounts list */}
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold px-2 font-mono">Registered Accounts</p>
                    
                    {googleUsers.map((g, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAuthEmail(g.email);
                          setAuthType('google');
                          safeStorage.setItem('btc_wallet_email', g.email);
                          safeStorage.setItem('btc_wallet_authtype', 'google');
                          safeStorage.setItem('btc_wallet_authed', 'true');
                          setIsAuthenticated(true);
                          setShowGoogleModal(false);
                          triggerAlert(`Successfully authorized Google account ${g.name}!`);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left border border-transparent hover:border-slate-100 cursor-pointer"
                      >
                        <img
                          src={g.avatar}
                          alt={g.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-black text-slate-800 truncate">{g.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium truncate font-mono">{g.email}</p>
                        </div>
                      </button>
                    ))}

                    <div className="border-t border-slate-100 my-2 pt-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold px-2 mb-2 font-mono">Use another Account</p>
                      <div className="px-2 space-y-2">
                        <input
                          type="email"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          placeholder="Enter custom Gmail address"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none rounded-xl px-3 py-2 text-[11px] text-slate-800 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
                              triggerAlert('Please enter a valid Gmail address!');
                              return;
                            }
                            const email = customGoogleEmail.trim().toLowerCase();
                            setAuthEmail(email);
                            setAuthType('google');
                            safeStorage.setItem('btc_wallet_email', email);
                            safeStorage.setItem('btc_wallet_authtype', 'google');
                            safeStorage.setItem('btc_wallet_authed', 'true');
                            setIsAuthenticated(true);
                            setShowGoogleModal(false);
                            triggerAlert(`Successfully authorized using Gmail ${email}!`);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-3 rounded-xl text-[11px] transition-all cursor-pointer"
                        >
                          Sign Up with new Google email
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <div className="p-3 bg-slate-50 border-t border-slate-50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowGoogleModal(false)}
                      className="px-4 py-1.5 hover:bg-slate-200 text-slate-500 text-[11px] font-black rounded-lg transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ADMIN OVERLAY SIMULATION PANEL */}
          <AnimatePresence>
            {showAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden bg-slate-900 border border-slate-800 text-slate-100 rounded-[2rem] p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="text-yellow-400 w-5 h-5 animate-pulse" />
                    <h2 className="font-extrabold text-[#c0a080]">WALLET & COIN ADMIN CONTROL PANEL</h2>
                  </div>
                  <button onClick={() => setShowAdmin(false)} className="text-slate-400 hover:text-white text-sm">✕ Close</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-3 tracking-wider">Registered Active Simulation Users</h3>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto">
                      {adminUsers.map((user, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-xs font-mono text-slate-300">{user.email}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] rounded-full uppercase font-bold">{user.status}</span>
                            <span className="text-xs font-bold font-mono">{user.balance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-3 tracking-wider">Simulation Controller Commands</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => {
                          setSimulatedPrices(prev => ({ ...prev, VERSE: parseFloat((prev.VERSE * 1.5).toFixed(5)) }));
                          triggerAlert('Admin pumps Verse price (+50%)!');
                        }}
                        className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold transition-all text-left"
                      >
                        🚀 Pump VERSE Token
                      </button>
                      <button
                        onClick={() => {
                          setSimulatedPrices(prev => ({ ...prev, BTC: parseFloat((prev.BTC * 1.1).toFixed(2)) }));
                          triggerAlert('Admin pumps Bitcoin price (+10%)!');
                        }}
                        className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold transition-all text-left"
                      >
                        📈 Pump BTC Price
                      </button>
                      <button
                        onClick={() => {
                          setRewardPoints(prev => prev + 100);
                          triggerAlert('Granted 100 Reward Points instantly!');
                        }}
                        className="p-3 bg-[#8b5e3c]/20 hover:bg-[#8b5e3c]/30 border border-[#8b5e3c]/30 rounded-xl text-yellow-100 font-bold transition-all text-left"
                      >
                        💎 Credit Points (+100)
                      </button>
                      <button
                        onClick={handleLogout}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-bold transition-all text-left"
                      >
                        🔒 De-authorize User
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB BODY - HOME VIEW */}
          {activeTab === 'home' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* PORTFOLIO BOX HERO */}
              <div className="bg-gradient-to-br from-[#8b5e3c] to-[#a67148] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 opacity-40 rounded-full filter blur-3xl -translate-y-20 translate-x-10 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-xs uppercase tracking-widest font-black">Total Portfolio Valuation</p>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-1 font-mono">
                        ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                    </div>
                    {/* User identifier */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                      {authType === 'telegram' ? (
                        <Send className="w-3.5 h-3.5 text-sky-200 rotate-45 animate-pulse" />
                      ) : authType === 'google' ? (
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V14.4h6.887c-.275 1.564-1.88 4.6-6.887 4.6-4.33 0-7.859-3.582-7.859-8s3.53-8 7.859-8c2.462 0 4.113 1.018 5.051 1.916l3.251-3.129C18.29 1.191 15.54 0 12.24 0 5.48 0 0 5.373 0 12s5.48 12 12.24 12c7.058 0 11.76-4.882 11.76-11.758 0-.79-.08-1.401-.18-1.957H12.24z"/>
                        </svg>
                      ) : (
                        <User className="w-4 h-4 text-[#e3c4a8]" />
                      )}
                      <span className="text-xs font-bold truncate max-w-[120px]">{authEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/25 px-2.5 py-1 rounded-full text-emerald-200 font-extrabold text-[10px]">
                      <ArrowUpRight className="w-3 h-3" />
                      +4.82%
                    </span>
                    <span className="text-white/80 font-bold font-mono">
                      +${dailyGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Since Yesterday)
                    </span>
                  </div>

                  {/* QUICK ACTIONS ROW */}
                  <div className="grid grid-cols-4 gap-3 mt-8">
                    <button
                      onClick={() => setSendModal(true)}
                      className="flex flex-col items-center gap-2 p-3.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl border border-white/5 cursor-pointer text-center"
                    >
                      <ArrowUpRight className="w-5 h-5 text-white" />
                      <span className="text-[11px] font-extrabold tracking-wider uppercase">Send</span>
                    </button>

                    <button
                      onClick={() => setReceiveModal(true)}
                      className="flex flex-col items-center gap-2 p-3.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl border border-white/5 cursor-pointer text-center"
                    >
                      <ArrowDownLeft className="w-5 h-5 text-white" />
                      <span className="text-[11px] font-extrabold tracking-wider uppercase">Receive</span>
                    </button>

                    <button
                      onClick={() => setBuyModal(true)}
                      className="flex flex-col items-center gap-2 p-3.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl border border-white/5 cursor-pointer text-center"
                    >
                      <PlusCircle className="w-5 h-5 text-white" />
                      <span className="text-[11px] font-extrabold tracking-wider uppercase">Buy</span>
                    </button>

                    <button
                      onClick={() => setSellModal(true)}
                      className="flex flex-col items-center gap-2 p-3.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl border border-white/5 cursor-pointer text-center"
                    >
                      <RefreshCw className="w-5 h-5 text-white" />
                      <span className="text-[11px] font-extrabold tracking-wider uppercase">Sell</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ASSETS SECTION & SUB-WALLETS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assets List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#8b5e3c]" /> Owned Portfolio Assets
                    </h3>
                    <span className="text-xs font-bold text-gray-500 font-mono">Live Sync Engine Enabled</span>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm divide-y divide-gray-50">
                    {assets.map((asset) => {
                      const valuation = asset.quantity * asset.price;
                      return (
                        <div key={asset.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                              <img src={asset.logo} alt={asset.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-gray-900">{asset.name}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded uppercase">{asset.symbol}</span>
                              </div>
                              <span className="text-xs text-gray-400 font-medium font-mono">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-extrabold text-gray-900 font-mono tracking-tight">
                              ${valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                              <span className="text-xs font-extrabold font-mono text-gray-500">{asset.quantity} {asset.symbol}</span>
                              <span className={`text-[10px] font-black font-mono ${asset.change24h >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wallets & Custom tab */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#8b5e3c]" /> My Chain Wallets
                    </h3>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                    {/* Multi wallets items */}
                    <div className="space-y-3">
                      {subWallets.map((wallet, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 hover:border-gray-200 transition-all flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{wallet.type} Network</span>
                            <span className="font-extrabold text-slate-800 text-sm block mt-0.5">{wallet.name}</span>
                            <span className="text-[10px] font-mono text-slate-500 mt-1 block">{wallet.address}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(wallet.address, `cl_addr_${index}`)}
                            className="p-2 hover:bg-white border border-gray-100 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-[#8b5e3c]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Wallet support form */}
                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Add Custom Wallet Chain</p>
                      <div className="space-y-2">
                        <select
                          value={customChain}
                          onChange={(e) => setCustomChain(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-[#8b5e3c] outline-none"
                        >
                          <option value="Solana">Solana Network</option>
                          <option value="Cardano">Cardano Chain</option>
                          <option value="Avalanche">Avalanche C-Chain</option>
                          <option value="Litecoin">Litecoin Network</option>
                        </select>
                        <input
                          type="text"
                          value={customWalletName}
                          onChange={(e) => setCustomWalletName(e.target.value)}
                          placeholder="e.g. My Solana Vault"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#8b5e3c] outline-none"
                        />
                        <button
                          onClick={handleAddCustomWallet}
                          className="w-full bg-slate-900 text-white font-bold text-xs py-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Create Network Wallet Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB BODY - MARKETS PAGE */}
          {activeTab === 'markets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#8b5e3c]" /> Cryptocurrency Markets
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Simulated real-time ticker quotes with SVG spark indicators.</p>
                </div>

                {/* Market Search Box */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={marketSearch}
                    onChange={(e) => setMarketSearch(e.target.value)}
                    placeholder="Search Coin Name or Symbol..."
                    className="w-full bg-white border border-gray-200 focus:border-[#8b5e3c] focus:ring-1 focus:ring-[#8b5e3c] outline-none rounded-2xl pl-10 pr-4 py-3 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Market Quick Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Crypto Coins' },
                  { key: 'gainers', label: 'Top Gainers 🔥' },
                  { key: 'losers', label: 'Top Losers 📉' },
                  { key: 'trending', label: 'Trending Stars ⭐' }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setMarketFilter(f.key as any)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      marketFilter === f.key
                        ? 'bg-gradient-to-r from-[#8b5e3c] to-[#a67148] text-white border-transparent'
                        : 'bg-white border-gray-200/85 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Coin Rankings Table list */}
              <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm divide-y divide-gray-50">
                <div className="p-4 grid grid-cols-3 md:grid-cols-4 text-xs font-extrabold uppercase text-slate-400 tracking-wider font-mono">
                  <div>Cryptocurrency</div>
                  <div className="text-right">Live Price (USD)</div>
                  <div className="text-center hidden md:block">Price Spark Trend</div>
                  <div className="text-right">24H Change</div>
                </div>

                {/* Active Simulated Coin Rows */}
                {Object.keys(simulatedPrices)
                  .map((sym) => {
                    const price = simulatedPrices[sym];
                    const spark = sparklines[sym] || [price, price, price];
                    const change = sym === 'VERSE' ? 12.8 : sym === 'BTC' ? 3.2 : sym === 'ETH' ? 2.1 : sym === 'BNB' ? -1.3 : sym === 'MATIC' ? 5.4 : sym === 'USDT' || sym === 'USDC' ? 0.0 : -0.4;
                    const logo = sym === 'BTC' ? 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
                      : sym === 'ETH' ? 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
                      : sym === 'VERSE' ? 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png'
                      : sym === 'USDT' ? 'https://cryptologos.cc/logos/tether-usdt-logo.png'
                      : sym === 'USDC' ? 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
                      : sym === 'BNB' ? 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
                      : sym === 'MATIC' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png'
                      : sym === 'SOL' ? 'https://cryptologos.cc/logos/solana-sol-logo.png'
                      : 'https://cryptologos.cc/logos/ripple-xrp-logo.png';
                    const name = sym === 'BTC' ? 'Bitcoin'
                      : sym === 'ETH' ? 'Ethereum'
                      : sym === 'VERSE' ? 'Verse (Official)'
                      : sym === 'USDT' ? 'Tether'
                      : sym === 'USDC' ? 'USD Coin'
                      : sym === 'BNB' ? 'Binance Chain'
                      : sym === 'MATIC' ? 'Polygon Matic'
                      : sym === 'SOL' ? 'Solana Protocol'
                      : 'Ripple Labs';

                    return { sym, price, spark, change, logo, name };
                  })
                  .filter((coin) => {
                    // Apply filters & search
                    if (marketSearch && !coin.name.toLowerCase().includes(marketSearch.toLowerCase()) && !coin.sym.toLowerCase().includes(marketSearch.toLowerCase())) return false;
                    if (marketFilter === 'gainers') return coin.change > 1;
                    if (marketFilter === 'losers') return coin.change < 0;
                    if (marketFilter === 'trending') return coin.sym === 'VERSE' || coin.sym === 'BTC';
                    return true;
                  })
                  .map((coin) => {
                    const isPositive = coin.change >= 0;
                    return (
                      <div key={coin.sym} className="p-4 grid grid-cols-3 md:grid-cols-4 items-center hover:bg-slate-50/80 transition-colors">
                        {/* Information column */}
                        <div className="flex items-center gap-3">
                          <img src={coin.logo} alt={coin.name} className="w-9 h-9 object-contain flex-shrink-0" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-extrabold text-sm text-gray-900 block leading-tight">{coin.name}</span>
                            <span className="text-xs uppercase text-slate-400 font-bold block">{coin.sym}</span>
                          </div>
                        </div>

                        {/* Price column */}
                        <div className="text-right font-bold font-mono text-sm tracking-tight">
                          ${coin.price >= 1 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(5)}
                        </div>

                        {/* Sparks render as minimal SVG curves */}
                        <div className="hidden md:flex justify-center">
                          <svg className="w-24 h-10" viewBox="0 0 100 40">
                            <polyline
                              fill="none"
                              stroke={isPositive ? '#10b981' : '#f43f5e'}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={coin.spark.map((val, idx) => {
                                const min = Math.min(...coin.spark);
                                const max = Math.max(...coin.spark);
                                const range = max - min || 1;
                                const x = (idx / (coin.spark.length - 1)) * 90 + 5;
                                const y = 35 - ((val - min) / range) * 30;
                                return `${x},${y}`;
                              }).join(' ')}
                            />
                          </svg>
                        </div>

                        {/* Performance column */}
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-xl text-xs font-black font-mono ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                            {isPositive ? '▲' : '▼'} {Math.abs(coin.change)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* TAB BODY - TRADE / SWAP ENGINE */}
          {activeTab === 'trade' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Swap card column */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 mb-6">
                      <RefreshCw className="w-5 h-5 text-[#8b5e3c] animate-spin-slow" /> Instant Conversion Swap Engine
                    </h3>

                    {/* Pay Area */}
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-4">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>You Pay</span>
                        <span>Balance: {assets.find(a => a.symbol === swapPayAsset)?.quantity || 0} {swapPayAsset}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={swapPayAmount}
                          onChange={(e) => setSwapPayAmount(e.target.value)}
                          placeholder="0.00"
                          className="bg-transparent font-mono font-bold text-2xl text-slate-800 focus:outline-none w-full flex-1"
                        />
                        <select
                          value={swapPayAsset}
                          onChange={(e) => setSwapPayAsset(e.target.value)}
                          className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2 font-bold text-slate-700 focus:outline-none text-sm cursor-pointer"
                        >
                          {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Icon indicator */}
                    <div className="flex justify-center -my-2.5 relative z-10">
                      <button
                        onClick={() => {
                          const p = swapPayAsset;
                          setSwapPayAsset(swapReceiveAsset);
                          setSwapReceiveAsset(p);
                        }}
                        className="p-3 bg-slate-900 hover:bg-[#8b5e3c] text-white rounded-2xl shadow-md transition-all active:scale-90"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Receive Area */}
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-4 mt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>You Receive (Estimated)</span>
                        <span>Balance: {assets.find(a => a.symbol === swapReceiveAsset)?.quantity || 0} {swapReceiveAsset}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-mono font-bold text-2xl text-emerald-600 flex-1">
                          {swapPayAmount && !isNaN(parseFloat(swapPayAmount))
                            ? ((parseFloat(swapPayAmount) * simulatedPrices[swapPayAsset]) / simulatedPrices[swapReceiveAsset]).toLocaleString(undefined, { maximumFractionDigits: 5 })
                            : '0.00'}
                        </div>
                        <select
                          value={swapReceiveAsset}
                          onChange={(e) => setSwapReceiveAsset(e.target.value)}
                          className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2 font-bold text-slate-700 focus:outline-none text-sm cursor-pointer"
                        >
                          {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Price rates settings */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-bold">Exchange Rate</span>
                        <span className="font-mono text-gray-800 font-bold">
                          1 {swapPayAsset} ≈ {parseFloat((simulatedPrices[swapPayAsset] / simulatedPrices[swapReceiveAsset]).toFixed(4))} {swapReceiveAsset}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-bold">Network Fee (Slippage)</span>
                        <span className="font-mono text-emerald-600 font-bold">0.05% VERSE Fee waived</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-bold">Rate Type Selection</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setRateType('fixed')}
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${rateType === 'fixed' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}
                          >
                            Fixed
                          </button>
                          <button
                            onClick={() => setRateType('floating')}
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${rateType === 'floating' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}
                          >
                            Floating
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Submit swap */}
                    <button
                      onClick={() => {
                        const amt = parseFloat(swapPayAmount);
                        if (!swapPayAmount || isNaN(amt) || amt <= 0) return;
                        setAssets(prev => prev.map(a => {
                          if (a.symbol === swapPayAsset) {
                            if (a.quantity < amt) {
                              triggerAlert('Insufficient balance to swap');
                              return a;
                            }
                            return { ...a, quantity: parseFloat((a.quantity - amt).toFixed(5)) };
                          }
                          if (a.symbol === swapReceiveAsset) {
                            const got = (amt * simulatedPrices[swapPayAsset]) / simulatedPrices[swapReceiveAsset];
                            return { ...a, quantity: parseFloat((a.quantity + got).toFixed(5)) };
                          }
                          return a;
                        }));
                        setSwapPayAmount('');
                        triggerAlert(`Successful Swap: ${amt} ${swapPayAsset} converted!`);
                      }}
                      className="w-full bg-slate-900 hover:bg-[#8b5e3c] text-white font-heavy text-sm tracking-widest font-black uppercase py-4 rounded-2xl shadow-md cursor-pointer transition-colors"
                    >
                      Process Web3 Swap
                    </button>
                  </div>
                </div>

                {/* Popular trading assets recommendations */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" /> Popular Trading Pairs
                  </h3>

                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                    {[
                      { pair: 'VERSE / BTC', price: simulatedPrices.VERSE / simulatedPrices.BTC, vol: '$1.4M', logo: 'https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png' },
                      { pair: 'ETH / BTC', price: simulatedPrices.ETH / simulatedPrices.BTC, vol: '$43M', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
                      { pair: 'MATIC / VERSE', price: simulatedPrices.MATIC / simulatedPrices.VERSE, vol: '$820K', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' }
                    ].map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <img src={p.logo} alt="Pair Logo" className="w-6 h-6 object-contain flex-shrink-0" referrerPolicy="no-referrer" />
                          <div>
                            <span className="text-xs font-black text-slate-800 block">{p.pair}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">24h Vol: {p.vol}</span>
                          </div>
                        </div>
                        <div className="font-mono text-xs font-bold text-slate-700">
                          {p.price.toFixed(6)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB BODY - NEWS PAGE */}
          {activeTab === 'news' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" id="news-tab-container">
              
              {/* BRAND HEADER BANNER */}
              <div className="bg-gradient-to-r from-[#8b5e3c]/20 via-[#c0a080]/15 to-amber-50 p-6 rounded-[2rem] border border-[#8b5e3c]/10 flex flex-col md:flex-row md:items-center justify-between gap-4" id="news-brand-banner">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#8b5e3c]/20 text-[#8b5e3c] font-extrabold text-[10px] uppercase rounded-full tracking-wider animate-pulse">
                      🔴 Synchronized Global Broadcast Feed
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#8b5e3c]" /> Bitcoin.com Intelligence Core News
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xl">
                    A fully automated, global real-time news system collecting news regarding Cryptocurrency, Blockchain, Web3, DeFi, Regulations, and global financial markets instantly for all users worldwide.
                  </p>
                </div>

                {/* VISIBLE GLOBALLY HUD BADGE */}
                <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm shrink-0">
                  <div className="bg-[#8b5e3c]/10 p-2.5 rounded-xl text-[#8b5e3c]">
                    <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold font-mono text-emerald-500 block">● VISIBILITY: GLOBAL</span>
                    <span className="text-xs font-black text-slate-700 block">Unified 180+ Countries</span>
                    <span className="text-[10px] font-medium font-mono text-slate-400 block">All accounts view identical news flow</span>
                  </div>
                </div>
              </div>

              {/* AUTOMATED NETWORK SYNC OPS COCKPIT */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-slate-200 space-y-4 shadow-xl" id="global-news-live-hub">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Peer Status Lamp */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${automatedNewsStreamActive ? 'animate-ping bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${automatedNewsStreamActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className="font-mono text-xs font-black uppercase text-slate-300">
                        Core News Stream Node: {automatedNewsStreamActive ? 'ACTIVE (Consensus Verified)' : 'MANUAL PAUSED'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-mono font-medium">
                      <span>🔗 Peer Connected: 52/52 Nodes</span>
                      <span>🌍 Audience Live: <strong className="text-amber-400">{newsActiveReaders.toLocaleString()} Readers</strong></span>
                      <span>🛡 Security: Multi-sign Cryptographic RSS SSL</span>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Fetch Clock & Sync Actions */}
                  <div className="flex items-center flex-wrap gap-3">
                    {/* Auto tick toggle */}
                    <button
                      onClick={() => {
                        setAutomatedNewsStreamActive(!automatedNewsStreamActive);
                        triggerAlert(automatedNewsStreamActive ? 'Auto News Refresh Paused' : 'Auto News Refresh Active!');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono border transition-all cursor-pointer ${automatedNewsStreamActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                    >
                      {automatedNewsStreamActive ? 'Auto-Sync is ACTIVE' : 'Auto-Sync is OFF'}
                    </button>

                    {/* Progress clock value */}
                    <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-2 font-mono text-xs text-slate-300 shadow-inner">
                      <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${automatedNewsStreamActive ? 'animate-spin' : ''}`} />
                      <span>Next Check: <strong className="text-white">{nextFetchSeconds}s</strong></span>
                    </div>

                    {/* Manual Override Sync Button */}
                    <button
                      onClick={() => {
                        // Manual pool force draw
                        if (newsProviderPool.length > 0) {
                          const articleToInject = newsProviderPool[0];
                          setNewsProviderPool(prev => prev.slice(1));
                          setNewsArticles(prev => [
                            { ...articleToInject, time: 'Just now' },
                            ...prev
                          ]);
                          triggerAlert(`🌐 Sync Secured: "${articleToInject.title.slice(0, 30)}..."`);
                          setSimulationLogs(logs => [
                            `⚡ Manual Node Force Sync [${articleToInject.category}] at ${new Date().toLocaleTimeString()}`,
                            ...logs.slice(0, 4)
                          ]);
                        } else {
                          // Infinite dynamic fallback trigger
                          const fakeThemes = ['Optimism', 'Aave', 'MakerDAO', 'CoreDAO', 'Cosmos (ATOM)'];
                          const pickedTheme = fakeThemes[Math.floor(Math.random() * fakeThemes.length)];
                          const manualArticle = {
                            id: 'n-dyn-man-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
                            title: `${pickedTheme} Deploys Secure Zero-Knowledge Cross-Chain Liquidity Routing successfully`,
                            description: `Decentralized audit networks report frictionless transaction consensus logs following the latest secure network patch.`,
                            content: `Enterprise developers have finalized and validated a major interoperability router design setup. High-frequency digital asset traders can deploy dynamic positions across leading decentralized virtual systems without encountering liquidity fragmentation bottlenecks. This matches absolute security, client-side non-custodial custody, and instantaneous worldwide checkout rates inside standard bitcoin.com applications.`,
                            source: 'Consensus Dispatch',
                            time: 'Just now',
                            thumbnail: 'https://images.unsplash.com/photo-1639762681057-40802193114c?q=80&w=300&auto=format&fit=crop',
                            category: 'Web3',
                            url: '#',
                            saved: false,
                            views: Math.floor(Math.random() * 4500) + 1100,
                            shares: Math.floor(Math.random() * 210) + 20
                          };
                          setNewsArticles(prev => [manualArticle, ...prev]);
                          triggerAlert(`🌐 Manual Sync success!`);
                          setSimulationLogs(logs => [
                            `⚡ Manual Node Force Sync [${manualArticle.category}] at ${new Date().toLocaleTimeString()}`,
                            ...logs.slice(0, 4)
                          ]);
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/25 border-t border-amber-400 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Sync Feed Node Now
                    </button>
                  </div>
                </div>

                {/* NETWORK LIVE ACTIVITY TICKER LOG */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-amber-500" /> Web3 Broadcast Simulation Event Logs
                  </div>
                  <div className="space-y-1 max-h-[75px] overflow-y-auto scrollbar-thin">
                    {simulationLogs.map((log, index) => (
                      <div key={index} className="flex items-center gap-2 truncate">
                        <span className="text-amber-500/80">❯</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLLAPSIBLE GLOBAL NEWS UPDATE PUBLISHER TERMINAL */}
              <div className="bg-white border border-[#8b5e3c]/15 rounded-[2.5rem] p-6 shadow-md space-y-4" id="global-publisher-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#8b5e3c]/10 text-[#8b5e3c] p-2.5 rounded-2xl shrink-0">
                      <Sparkles className="w-5 h-5 text-[#8b5e3c] animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">গ্লোবাল ব্রডকাস্ট নিউজ লিখুন (Publish News Update)</h4>
                      <p className="text-[11px] text-slate-400 font-medium">নিউজ আপডেট করুন যাতে অন্যরা পড়তে পারে এবং জানতে পারে (Others can read instantly)</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowNewsCreatorForm(!showNewsCreatorForm)}
                    className="px-4 py-2 bg-[#8b5e3c]/10 hover:bg-[#8b5e3c]/15 text-[#8b5e3c] text-xs font-extrabold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center"
                  >
                    {showNewsCreatorForm ? 'অনুপস্থিত করুন (Close Form)' : 'নতুন নিউজ লিখুন (Write News)'}
                    <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${showNewsCreatorForm ? 'rotate-45' : ''}`} />
                  </button>
                </div>

                {showNewsCreatorForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-t border-slate-100 pt-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 block">নিউজ শিরোনাম (News Title)*</label>
                        <input
                          type="text"
                          value={newsPublishTitle}
                          onChange={(e) => setNewsPublishTitle(e.target.value)}
                          placeholder="e.g. Bitcoin.com Core Verse Upgrades Deploy Live in 180 Countries"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/30 text-slate-800"
                        />
                      </div>

                      {/* Category & Source */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">ক্যাটাগরি (Category)</label>
                          <select
                            value={newsPublishCategory}
                            onChange={(e) => setNewsPublishCategory(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none text-slate-800 focus:ring-2 focus:ring-[#8b5e3c]/30"
                          >
                            <option value="Bitcoin">Bitcoin</option>
                            <option value="Ethereum">Ethereum</option>
                            <option value="Web3">Web3</option>
                            <option value="DeFi">DeFi</option>
                            <option value="Regulations">Regulations</option>
                            <option value="Ecosystem">Ecosystem</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">উৎস (Source)</label>
                          <input
                            type="text"
                            value={newsPublishSource}
                            onChange={(e) => setNewsPublishSource(e.target.value)}
                            placeholder="e.g. Verse News Hub"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none text-slate-800 focus:ring-2 focus:ring-[#8b5e3c]/30"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Short summary */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 block">সংক্ষিপ্ত সারাংশ (Short Summary/Description)*</label>
                        <textarea
                          rows={2}
                          value={newsPublishDescription}
                          onChange={(e) => setNewsPublishDescription(e.target.value)}
                          placeholder="নিউজ সম্পর্কে একটি সংক্ষিপ্ত ও আকর্ষণীয় ১-২ বাক্যের বর্ণনা দিন..."
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/30 text-slate-800"
                        />
                      </div>

                      {/* Thumbnail preset selector */}
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-[10px] font-black uppercase text-slate-500 block">থাম্বনেইল ইমেজ (Select Cover Image Preset)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { name: 'Bitcoin', url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=300&auto=format&fit=crop' },
                            { name: 'Ethereum', url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=300&auto=format&fit=crop' },
                            { name: 'Smart Tech', url: 'https://images.unsplash.com/photo-1639762681057-40802193114c?q=80&w=300&auto=format&fit=crop' },
                            { name: 'Secure Wallet', url: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=300&auto=format&fit=crop' }
                          ].map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => {
                                setNewsPublishThumbnail(preset.url);
                                triggerAlert(`Selected Cover: ${preset.name}`);
                              }}
                              className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all ${newsPublishThumbnail === preset.url ? 'border-[#8b5e3c] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-[8px] text-white font-mono font-bold uppercase">{preset.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Extended content paragraphs */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 block">বিস্তারিত খবর / প্রতিবেদন (Full Long-form News Content)*</label>
                      <textarea
                        rows={4}
                        value={newsPublishContent}
                        onChange={(e) => setNewsPublishContent(e.target.value)}
                        placeholder="এখানে খবরের বিস্তারিত লিখুন যাতে অন্য যেকোনো ব্যবহারকারী বিস্তারিত পড়ে আপনার আপডেটটি সম্পর্ক সঠিক জ্ঞান লাভ করতে পারে। বিশদ আলোচনা, প্রভাব এবং টেকনিক্যাল প্যারামিটার সংযুক্ত করুন।"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-[#c0a080]/20 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/30 text-slate-800"
                      />
                    </div>

                    {/* Submit Action */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newsPublishTitle || !newsPublishDescription || !newsPublishContent) {
                            triggerAlert('অনুগ্রহ করে সব তারকা চিহ্নিত (*) তথ্য পূরণ করুন! (Fill all fields)');
                            return;
                          }

                          const customArticle: NewsArticle = {
                            id: 'n-custom-' + Date.now(),
                            title: newsPublishTitle,
                            description: newsPublishDescription,
                            content: newsPublishContent,
                            category: newsPublishCategory,
                            source: newsPublishSource || 'Consensus Network Coordinator',
                            time: 'Just now',
                            thumbnail: newsPublishThumbnail,
                            saved: false,
                            views: 1,
                            shares: 0,
                            url: '#'
                          };

                          // Add directly to main list saving to localstorage
                          setNewsArticles(prev => [customArticle, ...prev]);

                          // Insert simulation log event
                          setSimulationLogs(logs => [
                            `📣 Broadcast Synced: "${customArticle.title.substring(0, 30)}..." on ${customArticle.category}`,
                            ...logs.slice(0, 4)
                          ]);

                          // Increment active reader metrics slightly to signify peer traction
                          setNewsActiveReaders(prev => prev + 1);

                          // Trigger notification feedback
                          triggerAlert('নিউজ আপডেট সফলভাবে সমগ্র গ্লোবাল ফিডে ব্রডকাস্ট হয়েছে!');

                          // Reset states
                          setNewsPublishTitle('');
                          setNewsPublishDescription('');
                          setNewsPublishContent('');
                          setShowNewsCreatorForm(false);
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#8b5e3c] to-[#a2714c] text-white text-xs font-black rounded-xl hover:-translate-y-0.5 transform shadow-lg shadow-[#8b5e3c]/20 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        নিউজ ব্রডকাস্ট করুন (Broadcast Consensus Update)
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* FILTER BAR & TEXT SEARCH COMPARTMENTS */}
              <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm" id="news-filter-wrapper">
                {/* Topic Pills Selection */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" id="news-filter-pills">
                  {['all', 'bitcoin', 'ethereum', 'web3', 'defi', 'regulations', 'ecosystem'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setNewsFilterTopic(topic)}
                      className={`px-3.5 py-1.5 text-xs font-black rounded-xl capitalize transition-all cursor-pointer whitespace-nowrap ${newsFilterTopic === topic ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/15' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {topic === 'all' ? 'All Topics' : topic}
                    </button>
                  ))}
                </div>

                {/* Search query input */}
                <div className="relative w-full md:max-w-xs">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search headlines or sources..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/30 text-slate-800 transition-all"
                  />
                  {newsSearch && (
                    <button
                      onClick={() => setNewsSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-black text-slate-400 hover:text-slate-600"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Bookmark Category Filter */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner inline-flex self-start shrink-0">
                  <button
                    onClick={() => setNewsCategory('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${newsCategory === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                  >
                    All Feeds
                  </button>
                  <button
                    onClick={() => setNewsCategory('saved')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${newsCategory === 'saved' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                  >
                     Bookmarks ({newsArticles.filter(n => n.saved).length})
                  </button>
                </div>
              </div>

              {/* CORE VIEWPORT FILTERING COMPILER */}
              {(() => {
                // Compile articles matching user filter criteria
                const compiledNewsList = newsArticles.filter((art) => {
                  // Saved check
                  if (newsCategory === 'saved' && !art.saved) return false;
                  // Topic check
                  if (newsFilterTopic !== 'all' && (art.category || '').toLowerCase() !== newsFilterTopic) return false;
                  // Text query check
                  if (newsSearch) {
                    const q = newsSearch.toLowerCase();
                    const matchesHeadline = art.title.toLowerCase().includes(q);
                    const matchesDesc = art.description.toLowerCase().includes(q);
                    const matchesSource = art.source.toLowerCase().includes(q);
                    return matchesHeadline || matchesDesc || matchesSource;
                  }
                  return true;
                });

                // Extract featured breaking news block
                const featuredBreakingItem = compiledNewsList.find(n => n.featured);
                const regularNewsItems = compiledNewsList.filter(n => !featuredBreakingItem || n.id !== featuredBreakingItem.id);

                if (compiledNewsList.length === 0) {
                  return (
                    <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-[2.5rem] space-y-3" id="news-empty-view">
                      <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-lg font-black">
                        ?
                      </div>
                      <h4 className="text-base font-black text-slate-700">No synchronized broadcast logs found</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        No articles match the selected Web3 topic filters or search parameters. Clear search filters or force a node fetch update!
                      </p>
                      <button
                        onClick={() => {
                          setNewsFilterTopic('all');
                          setNewsCategory('all');
                          setNewsSearch('');
                        }}
                        className="mt-2 px-4 py-2 bg-white border border-slate-200 text-xs font-black rounded-xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm cursor-pointer"
                      >
                        Reset All View Filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-8">
                    
                    {/* TRADING / BREAKING NEWS HIGHLIGHT HERO AT TOP */}
                    {featuredBreakingItem && (
                      <div className="space-y-3" id="trending-news-section">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#8b5e3c]">
                            Global Hot-Impact Coverage
                          </h4>
                        </div>

                        <div className="relative bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-xl group hover:border-[#8b5e3c]/40 transition-all duration-300">
                          {/* Banner image backing with linear gradients */}
                          <div className="absolute inset-0">
                            <img
                              src={featuredBreakingItem.thumbnail}
                              alt={featuredBreakingItem.title}
                              className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 select-none"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
                          </div>

                          {/* Cover contents */}
                          <div className="relative p-8 md:p-10 flex flex-col justify-end min-h-[320px] md:min-h-[380px] space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-full shadow-md tracking-wider">
                                {featuredBreakingItem.category}
                              </span>
                              <span className="px-3 py-1 bg-red-600/80 border border-red-500/40 text-white text-[9px] font-extrabold uppercase rounded-full tracking-wider animate-pulse flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-white block"></span> BREAKING
                              </span>
                              <span className="text-[11px] font-mono font-bold text-slate-400">
                                {featuredBreakingItem.source} • {featuredBreakingItem.time}
                              </span>
                            </div>

                            <h3 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight max-w-3xl">
                              {featuredBreakingItem.title}
                            </h3>

                            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl line-clamp-2">
                              {featuredBreakingItem.description}
                            </p>

                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                              {/* Metadata statistics */}
                              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" /> {(featuredBreakingItem.views || 10000).toLocaleString()} Views globally
                                </span>
                                <span className="flex items-center gap-1">
                                  <Share2 className="w-3.5 h-3.5" /> {(featuredBreakingItem.shares || 120).toLocaleString()} Shares
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Bookmark */}
                                <button
                                  onClick={() => {
                                    setNewsArticles(prev => prev.map(n => n.id === featuredBreakingItem.id ? { ...n, saved: !n.saved } : n));
                                    triggerAlert(featuredBreakingItem.saved ? 'Removed bookmark' : 'Bookmarked article successfully!');
                                  }}
                                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${featuredBreakingItem.saved ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                                  title="Add to Bookmarks"
                                >
                                  <Bookmark className={`w-4 h-4 ${featuredBreakingItem.saved ? 'fill-current' : ''}`} />
                                </button>

                                {/* Coverage Action */}
                                <button
                                  onClick={() => setSelectedNewsDetail(featuredBreakingItem)}
                                  className="px-5 py-3 bg-[#8b5e3c] hover:bg-[#a97c55] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                                >
                                  📖 Read Core Coverage
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GENERAL LATEST CHRONOLOGICAL NEWS TIMELINES */}
                    <div className="space-y-4" id="latest-news-section">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#8b5e3c]">
                          Latest News Room Updates
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          Sorted by Block Age (Newest first)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {regularNewsItems.map((art) => (
                          <div
                            key={art.id}
                            className="bg-white border border-slate-100 rounded-[2rem] p-5 hover:border-[#c0a080]/30 transition-all duration-300 shadow-sm flex flex-col justify-between group hover:shadow-md"
                          >
                            <div className="space-y-4">
                              {/* Meta and banner row */}
                              <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 select-none">
                                  <img
                                    src={art.thumbnail}
                                    alt="Thumbnail"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="inline-block px-2.5 py-0.5 bg-[#8b5e3c]/10 text-[#8b5e3c] text-[9px] font-black uppercase rounded-full tracking-wider">
                                    {art.category}
                                  </span>
                                  <h4 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-[#8b5e3c] transition-colors">
                                    {art.title}
                                  </h4>
                                  <p className="text-[11.5px] text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                                    {art.description}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Actions line */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-tight">
                                  {art.source}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {art.time} • {(art.views || 1000).toLocaleString()} views
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Bookmark */}
                                <button
                                  onClick={() => {
                                    setNewsArticles(prev => prev.map(n => n.id === art.id ? { ...n, saved: !n.saved } : n));
                                    triggerAlert(art.saved ? 'Removed bookmark' : 'Bookmarked article successfully!');
                                  }}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${art.saved ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600'}`}
                                  title="Bookmark"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${art.saved ? 'fill-current' : ''}`} />
                                </button>

                                {/* Share button triggers toast block */}
                                <button
                                  onClick={() => {
                                    handleCopy(`📢 Bitcoin.com Core Intelligence - Read Breaking news: "${art.title}"`, `art_${art.id}`);
                                    triggerAlert('Direct broadcast link copied to clipboard!');
                                  }}
                                  className="p-2 bg-slate-50 border border-slate-100 rounded-xl hover:text-slate-600 text-slate-400 transition-all cursor-pointer hover:border-slate-200"
                                  title="Share Article Link"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Details Modal Trigger */}
                                <button
                                  onClick={() => setSelectedNewsDetail(art)}
                                  className="px-3.5 py-2 bg-slate-50 border border-slate-100 hover:bg-[#8b5e3c]/10 hover:border-[#8b5e3c]/20 hover:text-[#8b5e3c] text-xs font-black text-slate-600 rounded-xl transition-all cursor-pointer"
                                >
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* NEWS COVERAGE ARTICLE READING MODAL OVERLAY */}
              <AnimatePresence>
                {selectedNewsDetail && (() => {
                  // Translation catalog definition inside the render block for bulletproof compilation
                  const newsTranslations: { [id: string]: { title: string; description: string; content: string; category: string } } = {
                    'n-1': {
                      title: 'প্রাতিষ্ঠানিক বিনিয়োগের নতুন রেকর্ডে বিটকয়েন ৬৮,০০০ ডলার অতিক্রম করেছে!',
                      category: '비트코인 (Bitcoin)',
                      description: 'স্পট বিটকয়েন ইটিএফ-এ দৈনিক ১.২ বিলিয়ন ডলারেরও বেশি মূলধনের ব্যাপক আগমন ঘটেছে, যা বিশ্বজুড়ে বিটকয়েন সংগ্রহের গতিকে ত্বরান্বিত করেছে।',
                      content: 'ডিজিটাল অ্যাসেটের প্রতি প্রাতিষ্ঠানিক আগ্রহ আনুষ্ঠানিকভাবে এক ঐতিহাসিক উচ্চতায় পৌঁছেছে। ঐতিহ্যবাহী সম্পদ ব্যবস্থাপনা প্রতিষ্ঠানের বিশ্লেষকরা মনে করছেন, এটি একটি সুরক্ষিত বিকেন্দ্রীভূত মূল্যের ভান্ডারের দিকে বড় ধরনের উত্তরণ। সার্বভৌম তহবিলগুলোও পরবর্তীকালে বিটকয়েন সংগ্রহ শুরু করতে যাচ্ছে, যা বাজারের তারল্যকে অনন্য এক পর্যায়ে নিয়ে যাবে। বিশ্বব্যাপী আইনি কাঠামোও পরিপক্ব হয়েছে, যার ফলে সাধারণ গ্রাহকদের নিরাপদ ও বিশ্বস্ত ক্রিপ্টো ইকোসিস্টেমে যুক্ত হওয়ার সুযোগ তৈরি হয়েছে।'
                    },
                    'n-2': {
                      title: 'লেয়ার-২ সমাধানের জনপ্রিয়তায় ইথেরিয়ামের গ্যাস ফি রেকর্ড পরিমাণ কমেছে',
                      category: '이더리움 (Ethereum)',
                      description: 'প্রধান স্কেলিং রোলআপগুলো দৈনিক প্রায় ৯৪% স্মার্ট চুক্তির কার্যকারিতা অত্যন্ত কম খরচে সম্পন্ন করতে সফল হয়েছে, যা গ্রাহকদের জন্য লেনদেন সহজ করেছে।',
                      content: 'লেয়ার-২ এক্সিকিউশন ক্লায়েন্টদের প্রযুক্তির অভাবনীয় অগ্রগতির ফলে গ্যাস ফি এখন ঐতিহাসিক সর্বনিম্ন পর্যায়ে নেমে এসেছে। ডিসেন্ট্রালাইজড অ্যাপ্লিকেশন (DApp) ডেভেলপাররা এখন ইথেরিয়াম নেটওয়ার্কের সর্বোচ্চ নিরাপত্তা অক্ষুণ্ণ রেখেই উচ্চ-ফ্রিকোয়েন্সি মাইক্রো-পেমেন্ট বা ক্ষুদ্র লেনদেন কনফিগার করতে পারছেন। এটি সামগ্রিক ওযেব৩ স্কেলিবিলিটিকে ত্বরান্বিত করেছে এবং প্রমাণ করেছে যে ক্লায়েন্ট-সাইড প্রযুক্তি ভবিষ্যতের লেনদেনকে কতটা সুরক্ষিত রাখতে পারে।'
                    },
                    'n-3': {
                      title: 'ভার্স লঞ্চপ্যাড থেকে ইকোসিস্টেম সম্প্রসারণে নতুন দুটি ওয়েব৩ প্রজেক্টের ঘোষণা',
                      category: '생태계 (Ecosystem)',
                      description: 'বিটকয়েন ডট কম-এর নিজস্ব টোকেন "ভার্স" বিশ্বসেরা ডেভেলপারদের সাথে যুক্ত হয়ে স্বয়ংক্রিয় ফাইন্যান্স প্রোটোকল এবং পুরস্কার অর্জনের প্ল্যাটফর্ম চালু করছে।',
                      content: 'ক্রিপ্টো টোকেনের উপযোগিতা ও মান স্থায়ীভাবে বজায় রাখার জন্য ইকোসিস্টেম উন্নয়ন অত্যন্ত জরুরি। আসন্ন লঞ্চপ্যাড প্রজেক্টগুলো মাল্টি-চেইন লিকুইডিটি অ্যাগ্রিগেশন অ্যালগরিদম নিয়ে কাজ করছে। যারা VERSE টোকেন হোল্ড বা স্ট্যাক করবেন, তারা অগ্রাধিকার ভিত্তিতে অ্যালোকেশন পাবেন, যা পুরো নেটওয়ার্কের কর্মক্ষমতাকে কয়েকগুণ বাড়িয়ে দেবে। ওয়েব৩ ডেভেলপাররা বিটকয়েন ডট কম-এর এই চমৎকার সিকিউরিটি কিট ও দ্রুত অ্যাক্সেসযোগ্যতার জন্য প্রশংসা করেছেন।'
                    },
                    'n-4': {
                      title: 'মাল্টি-চেইন নন-কাস্টোডিয়াল ওয়ালেট কীভাবে ভিন্ন ভিন্ন চেইনে নিরাপদে সম্পদ রক্ষা করে?',
                      category: '지갑 (Wallets)',
                      description: 'ক্রিপ্টোগ্রাফি ক্রিয়েটেড সিড ফ্রেজ (Seed Phrase) কীভাবে আপনার সমস্ত প্রাইভেট কি-কে সম্পূর্ণ সুরক্ষিত রাখে, তার একটি চমৎকার শিক্ষামূলক বিশ্লেষণ।',
                      content: 'গ্রাহকের নিজের ডিজিটাল সম্পদের নিরাপত্তা ও স্বায়ত্তশাসন ক্রিপ্টোর প্রধান লক্ষ্য। নতুন বিটকয়েন ডট কম ওয়ালেট-এর মতো মাল্টি-চেইন ওয়ালেটগুলো উচ্চমানের উপবৃত্তাকার বক্ররেখা (Elliptic Curve) অ্যালগরিদম ব্যবহার করে। আপনার গোপন চাবি বা প্রাইভেট কি কখনই আপনার নিজস্ব ডিভাইস থেকে বের হয় না, যা হ্যাকিংয়ের ঝুঁকি শূন্যে নামিয়ে আনে। এই চমৎকার ডিজাইনে জিরো-ট্রাস্ট সিকিউরিটি ও ডিভাইস পিনের মিশ্রণ করা হয়েছে, যাতে ব্যবহারকারী তার সম্পদের একমাত্র মালিক হতে পারেন।'
                    }
                  };

                  const translateCustomNews = (title: string, desc: string, cnt: string) => {
                    let bnTitle = title
                      .replace(/Bitcoin/gi, 'বিটকয়েন')
                      .replace(/Ethereum/gi, 'ইথেরিয়াম')
                      .replace(/Solana/gi, 'সোলোনা')
                      .replace(/USDT|Tether/gi, 'টেদার')
                      .replace(/Decentralized/gi, 'বিকেন্দ্রীভূত')
                      .replace(/Wallet/gi, 'ওয়ালেট')
                      .replace(/Launchpad/gi, 'লঞ্চপ্যাড')
                      .replace(/Crypto|Cryptocurrency/gi, 'ক্রিপ্টোকারেন্সি')
                      .replace(/Secured|Secure/gi, 'সুরক্ষিত')
                      .replace(/Ecosystem/gi, 'ইকোসিস্টেম')
                      .replace(/Web3/gi, 'ওয়েব৩')
                      .replace(/DeFi/gi, 'ডিফাই')
                      .replace(/Upgrade|Upgrades/gi, 'আপগ্রেড')
                      .replace(/API/gi, 'এপিআই')
                      .replace(/Liquidity/gi, 'লিকুইডিটি')
                      .replace(/Transaction|Transactions/gi, 'লেনদেন')
                      .replace(/Consensus/gi, 'ঐক্যমত')
                      .replace(/Network|Networks/gi, 'নেটওয়ার্ক')
                      .replace(/Audit/gi, 'সিকিউরিটি অডিট');

                    let bnDesc = desc
                      .replace(/Bitcoin/gi, 'বিটকয়েন')
                      .replace(/Ethereum/gi, 'ইথেরিয়াম')
                      .replace(/Solana/gi, 'সোলোনা')
                      .replace(/Decentralized/gi, 'বিকেন্দ্রীভূত')
                      .replace(/Wallet/gi, 'ওয়ালেট')
                      .replace(/Crypto|Cryptocurrency/gi, 'ক্রিপ্টোকারেন্সি')
                      .replace(/Smart Contracts/gi, 'স্মার্ট চুক্তি')
                      .replace(/Web3/gi, 'ওয়েব৩');

                    let bnContent = cnt
                      .replace(/Bitcoin/gi, 'বিটকয়েন')
                      .replace(/Ethereum/gi, 'ইথেরিয়াম')
                      .replace(/Solana/gi, 'সোলোনা')
                      .replace(/Decentralized/gi, 'বিকেন্দ্রীভূত')
                      .replace(/Wallet/gi, 'ওয়ালেট')
                      .replace(/Smart Contracts/gi, 'স্মার্ট চুক্তি')
                      .replace(/Web3/gi, 'ওয়েব৩');

                    return { title: bnTitle, description: bnDesc, content: bnContent };
                  };

                  // Quiz mapping details
                  const topicQuizzes: { [topic: string]: { question: string; bnQuestion: string; options: string[]; bnOptions: string[]; correctIdx: number; hint: string; bnHint: string } } = {
                    'bitcoin': {
                      question: "What is the absolute maximum limit of the total Bitcoin supply under its source code rules?",
                      bnQuestion: "বিটকয়েনের প্রটোকল অনুযায়ী সর্বোচ্চ কতটি বিটকয়েন তৈরি করা সম্ভব?",
                      options: ["21 Million BTC", "100 Million BTC", "No Limit", "50 Billion BTC"],
                      bnOptions: ["২১ মিলিয়ন (21M)", "১০০ মিলিয়ন (100M)", "কোনো সীমাবদ্ধতা নেই", "৫০ বিলিয়ন (50B)"],
                      correctIdx: 0,
                      hint: "Bitcoin possesses structural scarcity. No more tokens can be minted once reached.",
                      bnHint: "বিটকয়েন একটি সসীম সম্পদ। এটি বিটকয়েন কোডের একটি মূল নিয়ম যা এর আভিজাত্য বাড়ায়।"
                    },
                    'ethereum': {
                      question: "Which signature feature makes Ethereum drastically different from simple Bitcoin?",
                      bnQuestion: "কোন প্রধান বৈশিষ্ট্যটি ইথেরিয়ামকে বিটকয়েন থেকে আলাদা করে তোলে?",
                      options: ["Limited fixed supply of 21M", "Turing-complete Smart Contracts support", "Proof of Work consensus ONLY", "Zero-fee transactions globally"],
                      bnOptions: ["২১ মিলিয়ন সসীম লিমিট", "টিউরিং-কমপ্লিট স্মার্ট কন্ট্রাক্ট সাপোর্ট (স্বয়ংক্রিয় চুক্তি)", "শুধুমাত্র প্রুফ অফ ওয়ার্ক ভিত্তিক consensus", "কোনো ট্রানজেকশন ফি না থাকা"],
                      correctIdx: 1,
                      hint: "Ethereum allows arbitrary developer applications to run without central server control.",
                      bnHint: "ইথেরিয়ামে ডেভেলপাররা যেকোনো স্বয়ংক্রিয় প্রোগ্রাম কোড লিখে ডিসেন্ট্রালাইজডভাবে রান করতে পারে।"
                    },
                    'web3': {
                      question: "What is the primary target of Non-Custodial Multi-Chain Wallets?",
                      bnQuestion: "নন-কাস্টোডিয়াল মাল্টি-চেইন ওয়ালেটের মূল লক্ষ্য কী?",
                      options: ["Relying fully on remote bank servers", "Allowing users complete ownership of private keys", "Replacing all local tokens with state assets", "Tracking physical GPS user details"],
                      bnOptions: ["সম্পূর্ণ রিমোট ব্যাংক সার্ভারের উপর নির্ভর করা", "ব্যবহারকারীকে নিজের প্রাইভেট কি-র সম্পূর্ণ মালিকানা দেওয়া", "সব লোকাল টোকেন রাষ্ট্রীয় সম্পদে রূপান্তর করা", "ব্যবহারকারীর জিপিএস ট্র্যাক করা"],
                      correctIdx: 1,
                      hint: "When you hold the seed phrase, you enjoy absolute digital authority.",
                      bnHint: "যখন আপনার কাছে বীজ শব্দগুচ্ছ বা সিড ফ্রেজ সংরক্ষিত থাকে, তখন অন্য কেউ আপনার সম্পদ হ্যাক করতে বা আটকাতে পারে না।"
                    },
                    'defi': {
                      question: "What does DeFi stand for in decentralized ecosystems?",
                      bnQuestion: "ডিসেন্ট্রালাইজড ফাইন্যান্স ইকোসিস্টেমে 'DeFi' এর পূর্ণরূপ কী?",
                      options: ["Default Finance Enterprise", "Decentralized Finance", "Deficit Foundation Indicator", "Design File Integration"],
                      bnOptions: ["ডিফল্ট ফাইন্যান্স এন্টারপ্রাইজ", "ডিসেন্ট্রালাইজড ফাইন্যান্স (Decentralized Finance)", "ডেফিসিট ইন্ডিকেটর", "ডিজাইন ফাইল ইন্টিগ্রেশন"],
                      correctIdx: 1,
                      hint: "It means peer-to-peer financial tools running without centralized banking intermediaries.",
                      bnHint: "এর অর্থ কোনো মধ্যস্থতাকারী ব্যাংক বা প্রতিষ্ঠান ছাড়াই পিয়ার-টু-পিয়ার আর্থিক লেনদেন সম্পন্ন করা।"
                    },
                    'regulations': {
                      question: "What represents a spot ETF in legal crypto markets?",
                      bnQuestion: "বৈধ ক্রিপ্টো মার্কেটে 'স্পট ইটিএফ (Spot ETF)' কী নির্দেশ করে?",
                      options: ["Virtual trading credits", "An direct investment fund holding physical cryptocurrency assets", "Government utility loyalty points", "Decentralized gaming rewards"],
                      bnOptions: ["ভার্চুয়াল ট্রেডিং ক্রেডিট", "একটি সরাসরি ইনভেস্টমেন্ট ফান্ড যা প্রকৃত ক্রিপ্টোকারেন্সি অ্যাসেট হোল্ড করে", "সরকারি ইউটিলিটি লয়্যালটি পয়েন্টস", "গেমিং রিওয়ার্ড"],
                      correctIdx: 1,
                      hint: "Holders get relative exposure to actual spot assets traded on regular stock exchanges.",
                      bnHint: "এর মাধ্যমে সাধারণ বিনিয়োগকারীরা স্টক এক্সচেঞ্জের মাধ্যমে আসল ক্রিপ্টো সম্পদের মূল্য ট্র্যাক করতে পারেন।"
                    },
                    'ecosystem': {
                      question: "What is the local utility token backing the Bitcoin.com Ecosystem projects?",
                      bnQuestion: "বিটকয়েন ডট কম ইকোসিস্টেমের মূল ইউটিলিটি টোকেন কোনটি?",
                      options: ["VERSE", "SOL", "USDC", "DOGE"],
                      bnOptions: ["VERSE", "SOL", "USDC", "DOGE"],
                      correctIdx: 0,
                      hint: "This token facilitates staking rewards, cashbacks, play-to-earn balances, and DeFi launchpads.",
                      bnHint: "এই টোকেনটি স্ট্যাকিং রিওয়ার্ড, ক্যাশব্যাক ও গেমের প্লে-টু-আর্ন ব্যালেন্সে ব্যবহার করা হয়।"
                    }
                  };

                  // Determine active contents based on user translation toggle selection
                  let activeTitle = selectedNewsDetail.title;
                  let activeDescription = selectedNewsDetail.description;
                  let activeContent = selectedNewsDetail.content;
                  let activeCategoryBN = selectedNewsDetail.category;

                  if (languageMode === 'bn') {
                    const preset = newsTranslations[selectedNewsDetail.id];
                    if (preset) {
                      activeTitle = preset.title;
                      activeDescription = preset.description;
                      activeContent = preset.content;
                      activeCategoryBN = preset.category;
                    } else {
                      const computed = translateCustomNews(selectedNewsDetail.title, selectedNewsDetail.description, selectedNewsDetail.content);
                      activeTitle = computed.title;
                      activeDescription = computed.description;
                      activeContent = computed.content;
                    }
                  }

                  // Pick quiz key corresponding to current asset category
                  const quizKey = (selectedNewsDetail.category || 'web3').toLowerCase().trim();
                  const dynamicQuiz = topicQuizzes[quizKey] || topicQuizzes['web3'];

                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={() => setSelectedNewsDetail(null)}
                      id="news-content-detail-modal"
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto overflow-x-hidden border border-slate-100 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* BANNER WITH BACKGROUND GRADIENT ACCENT OVERLAY */}
                        <div className="relative h-64 md:h-72 w-full select-none">
                          <img
                            src={selectedNewsDetail.thumbnail}
                            alt={selectedNewsDetail.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-[#8b5e3c]/15 to-transparent" />
                          
                          {/* CATEGORY TAG AND DISMISS BUTTON */}
                          <div className="absolute top-6 inset-x-6 flex items-center justify-between">
                            <span className="px-3 py-1 bg-[#8b5e3c] text-white text-[10px] font-black uppercase rounded-full shadow-md tracking-wider">
                              {languageMode === 'bn' ? 'ক্যাটাগরি: ' + activeCategoryBN : selectedNewsDetail.category}
                            </span>
                            <button
                              onClick={() => setSelectedNewsDetail(null)}
                              className="p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg border border-slate-200/50 hover:scale-105 transition-transform cursor-pointer"
                              title="Close Reader"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* ARTICLE EDITORIAL CONTENTS */}
                        <div className="p-8 space-y-6">
                          
                          {/* HEADER METADATA & INTERACTIVE CONTROLS */}
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-3">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                                <span>{selectedNewsDetail.source}</span>
                                <span>•</span>
                                <span>{selectedNewsDetail.time}</span>
                              </div>

                              {/* TRANSLATION & TEXT SPEAKER AUDIO CONTROL ROW */}
                              <div className="flex items-center gap-2">
                                {/* Language toggle button */}
                                <button
                                  onClick={() => {
                                    setLanguageMode(prev => prev === 'en' ? 'bn' : 'en');
                                    triggerAlert(languageMode === 'en' ? 'অনুবাদ সফল হয়েছে!' : 'Switched to English context!');
                                  }}
                                  className={`px-3 py-1.5 rounded-xl border text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${languageMode === 'bn' ? 'bg-[#8b5e3c] border-[#8b5e3c] text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-150'}`}
                                >
                                  <Languages className="w-3.5 h-3.5" />
                                  {languageMode === 'bn' ? 'Read in English' : 'বাংলায় অনুবাদ'}
                                </button>

                                {/* Audio speech speaker simulation button */}
                                <button
                                  onClick={() => {
                                    if (isVoiceReading) {
                                      setIsVoiceReading(false);
                                      triggerAlert('স্পিকার বন্ধ করা হয়েছে (Audio readout paused)');
                                    } else {
                                      setIsVoiceReading(true);
                                      setVoiceSpeechCounter(1);
                                      triggerAlert('স্পিকার চালু করা হয়েছে! খবর শুনুন (Simulating audio synthesis...)');
                                    }
                                  }}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${isVoiceReading ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-150'}`}
                                  title="Listen to News"
                                >
                                  {isVoiceReading ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* DYNAMIC SPEECH WAVE VISUALIZATION DRAWER */}
                            {isVoiceReading && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-500/10 flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="flex gap-1 items-center shrink-0">
                                    <span className="w-1 h-3.5 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <span className="w-1 h-4.5 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    <span className="w-1 h-2.5 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
                                  </span>
                                  <p className="text-[11px] text-emerald-700 font-mono font-bold leading-normal">
                                    🔉 {languageMode === 'bn' ? 'ভয়েস রিডআউট লাইভ চলছে...' : 'Synthesizing voice playback...'}
                                  </p>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 italic max-w-xs line-clamp-1 truncate">
                                  "{activeTitle}"
                                </span>
                              </motion.div>
                            )}

                            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                              {activeTitle}
                            </h2>

                            {/* INTERACTIVE STATS DISPLAY */}
                            <div className="flex items-center gap-4 py-1.5 text-xs text-slate-500 font-mono font-medium">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-slate-400" /> <strong>{((selectedNewsDetail.views || Number(Math.random().toString().substring(2, 5))) + 820).toLocaleString()}</strong> users reading globally
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="w-3.5 h-3.5 text-slate-400" /> <strong>{((selectedNewsDetail.shares || Math.floor(Math.random() * 300)) + 45).toLocaleString()}</strong> shared nodes
                              </span>
                            </div>
                          </div>

                          {/* DESCRIPTION BLOCK */}
                          <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-[#8b5e3c] text-slate-600 font-bold text-xs leading-relaxed">
                            {languageMode === 'bn' ? 'সারাংশ: ' : 'SUMMARY: '} {activeDescription}
                          </div>

                          {/* FULL LONG-FORM GENERATIVE ANALYSIS ARTICLE */}
                          <div className="text-xs md:text-sm text-slate-700 leading-relaxed font-semibold space-y-4 border-b border-slate-100 pb-6">
                            <p className="indent-4 leading-relaxed">{activeContent}</p>
                            
                            <p>
                              {languageMode === 'bn' ? (
                                'অতিরিক্তভাবে বলতে গেলে, এই যুগান্তকারী পরিবর্তন সরাসরি ক্রিপ্টোকারেন্সি ওয়ালেট ব্যবহারকারীদের জন্য সর্বোচ্চ নিরাপত্তা নিশ্চিত করবে। সিড কোড জেনারেশন এবং সিকিউরিটি মেকানিজম সরাসরি ডিভাইসের অভ্যন্তরে সম্পন্ন করার কারণে যেকোনো থার্ড-পার্টি হ্যাকিংয়ের ঝুঁকি সম্পূর্ণ শূন্যে নেমে আসে।'
                              ) : (
                                'Furthermore, this development directly benefits cryptocurrency wallet consumers utilizing non-custodial systems. By keeping seed generation and transactional operations strictly client-side, the risk profile drops to zero. Users avoid third-party server exposure, validating key pillars of absolute token autonomy.'
                              )}
                            </p>

                            <p className="text-[10.5px] font-mono text-slate-400 italic">
                              {languageMode === 'bn' ? (
                                '* এই প্রতিবেদনটি স্বয়ংক্রিভাবে সংকলিত ও অডিট সমাধান সম্পন্ন করে বিটকয়েন ডট কম ইন্টেলিজেন্স পিয়ার কন্সাসাস নেটওয়ার্ক থেকে লাইভ ব্রডকাস্ট করা হয়েছে।'
                              ) : (
                                '* This report was automatically parsed, cryptographically audited, and broadcasted globally from the Bitcoin.com Intelligence Consensus peer-to-peer network stream.'
                              )}
                            </p>
                          </div>

                          {/* 🧠 WEB3 CONTEXT QUIZ - DIRECT VALUE ADD EDUCATIONAL PILL */}
                          <div className="bg-gradient-to-r from-amber-500/5 via-amber-600/5 to-white border border-amber-500/20 p-6 rounded-[2rem] space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-500 animate-bounce" />
                                <span className="font-extrabold text-[12.5px] text-slate-800">
                                  {languageMode === 'bn' ? '🧠 ক্রিপ্টো জ্ঞান পরীক্ষা ও রিওয়ার্ড!' : '🧠 Test Your Insight & Claim +20 PTS'}
                                </span>
                              </div>
                              <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-mono font-bold">
                                Category: {selectedNewsDetail.category}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-700">
                              {languageMode === 'bn' ? dynamicQuiz.bnQuestion : dynamicQuiz.question}
                            </p>

                            {!newsQuizAnswered ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {(languageMode === 'bn' ? dynamicQuiz.bnOptions : dynamicQuiz.options).map((opt, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setNewsQuizSelection(index);
                                      setNewsQuizAnswered(true);
                                      const isCorrect = index === dynamicQuiz.correctIdx;
                                      setNewsQuizIsCorrect(isCorrect);
                                      if (isCorrect) {
                                        setRewardPoints(prev => prev + 20);
                                        triggerAlert('Excellent! +20 Reward Points added successfully!');
                                      } else {
                                        triggerAlert('Incorrect answer. Review the explanation and try again next time!');
                                      }
                                    }}
                                    className="px-3.5 py-2.5 bg-white hover:bg-amber-50 border border-slate-150 rounded-xl text-left text-xs font-bold text-slate-700 transition-colors shadow-sm hover:border-amber-300 cursor-pointer"
                                  >
                                    <span className="font-mono text-amber-500 mr-1.5">{String.fromCharCode(65 + index)}.</span>
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl space-y-2 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 font-black uppercase text-[10px] rounded ${newsQuizIsCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {newsQuizIsCorrect 
                                      ? (languageMode === 'bn' ? 'সঠিক উত্তর! (Correct)' : 'Correct!')
                                      : (languageMode === 'bn' ? 'ভুল উত্তর! (Incorrect)' : 'Incorrect!')}
                                  </span>
                                  <span className="font-bold text-slate-700">
                                    {languageMode === 'bn' ? 'সঠিক অপশন: ' : 'Correct Option: '}
                                    <strong className="text-amber-600">
                                      {languageMode === 'bn' ? dynamicQuiz.bnOptions[dynamicQuiz.correctIdx] : dynamicQuiz.options[dynamicQuiz.correctIdx]}
                                    </strong>
                                  </span>
                                </div>
                                <p className="text-slate-500 font-semibold italic">
                                  💡 {languageMode === 'bn' ? dynamicQuiz.bnHint : dynamicQuiz.hint}
                                </p>

                                <button
                                  onClick={() => {
                                    setNewsQuizAnswered(false);
                                    setNewsQuizSelection(null);
                                    setNewsQuizIsCorrect(null);
                                  }}
                                  className="mt-2 text-[10px] font-black uppercase text-[#8b5e3c] tracking-wider bg-[#8b5e3c]/5 hover:bg-[#8b5e3c]/10 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                                >
                                  {languageMode === 'bn' ? 'আবার চেষ্টা করুন (Try Another)' : 'Try Again'}
                                </button>
                              </motion.div>
                            )}
                          </div>

                          {/* 💬 PUBLIC DISCUSSIONS & FEEDBACK LOG - COMMUNICATIVE NODE */}
                          <div className="border-t border-slate-100 pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-slate-500" />
                                <h4 className="text-sm font-black text-slate-800">
                                  {languageMode === 'bn' ? '💬 গ্লোবাল ফোরাম মতামত ও মন্তব্য' : '💬 Consensus Feed Discussion'}
                                  <span className="ml-1.5 text-xs text-slate-400 font-normal">({(articleComments[selectedNewsDetail.id] || []).length})</span>
                                </h4>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">Syncing Live 📡</span>
                            </div>

                            {/* Comment Listing */}
                            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                              {(articleComments[selectedNewsDetail.id] || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-4">
                                  {languageMode === 'bn' ? 'এই নিউজে এখনো কোনো মতামত দেয়া হয়নি। প্রথম মন্তব্যটি আপনি করুন!' : 'No comments verified on this block. Be the first to share your perspective!'}
                                </p>
                              ) : (
                                (articleComments[selectedNewsDetail.id] || []).map((comm, cidx) => (
                                  <div key={cidx} className="bg-slate-50 rounded-2xl p-3.5 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-[9px] font-bold flex items-center justify-center text-[#8b5e3c] uppercase shadow-sm">
                                          {comm.author.charAt(0)}
                                        </div>
                                        {comm.author}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-400">{comm.time}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-650 pl-6 leading-relaxed">
                                      {comm.text}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Submit Custom Comment logs */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl space-y-3">
                              <span className="text-[10.5px] font-black uppercase text-slate-500 block">
                                {languageMode === 'bn' ? 'আপনার মন্তব্য প্রকাশ করুন (Share Your Note)' : "Post Public Node Comment"}
                              </span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder={languageMode === 'bn' ? 'আপনার নাম' : 'Your name (e.g. Satoshi)'}
                                  value={tempCommentAuthor}
                                  onChange={(e) => setTempCommentAuthor(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#8b5e3c] text-slate-800"
                                />
                                <div className="sm:col-span-2 flex gap-2">
                                  <input
                                    type="text"
                                    placeholder={languageMode === 'bn' ? 'মন্তব্যের বিবরণ লিখুন...' : 'Write your perspective on this update...'}
                                    value={tempCommentText}
                                    onChange={(e) => setTempCommentText(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#8b5e3c] text-slate-800"
                                  />
                                  <button
                                    onClick={() => {
                                      if (!tempCommentAuthor || !tempCommentText) {
                                        triggerAlert('অনুগ্রহ করে নাম এবং মন্তব্যের বিষয়বস্তু উল্লেখ করুন!');
                                        return;
                                      }

                                      const newCommentItem = {
                                        author: tempCommentAuthor,
                                        text: tempCommentText,
                                        time: 'Just now'
                                      };

                                      setArticleComments(prev => {
                                        const originalList = prev[selectedNewsDetail.id] || [];
                                        return {
                                          ...prev,
                                          [selectedNewsDetail.id]: [...originalList, newCommentItem]
                                        };
                                      });

                                      setTempCommentText('');
                                      triggerAlert('আপনার মতামত সফলভাবে সংরক্ষণ করা হয়েছে!');
                                    }}
                                    className="px-4 bg-[#8b5e3c] hover:bg-[#724a2c] text-white text-xs font-black rounded-xl transition-colors cursor-pointer block shrink-0"
                                  >
                                    {languageMode === 'bn' ? 'পোস্ট' : 'Post'}
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* FOOTER ACTIONS - BOOKMARK AND MULTIPLE SHARING DRAWER */}
                          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Left: Bookmark Toggler */}
                            <button
                              onClick={() => {
                                setNewsArticles(prev => prev.map(n => n.id === selectedNewsDetail.id ? { ...n, saved: !n.saved } : n));
                                triggerAlert(selectedNewsDetail.saved ? 'Removed bookmark' : 'Bookmarked article successfully!');
                                setSelectedNewsDetail(prev => prev ? { ...prev, saved: !prev.saved } : null);
                              }}
                              className={`px-4 py-2.5 rounded-2xl font-black text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${selectedNewsDetail.saved ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/15' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                            >
                              <Bookmark className={`w-4 h-4 ${selectedNewsDetail.saved ? 'fill-current' : ''}`} />
                              {selectedNewsDetail.saved ? (languageMode === 'bn' ? 'বুকমার্ক করা প্রজেক্ট' : 'Bookmarked Insight') : (languageMode === 'bn' ? 'বুকমার্ক করুন' : 'Bookmark Coverage')}
                            </button>

                            {/* Right: Social quick integration triggers */}
                            <div className="space-y-1.5 w-full sm:w-auto">
                              <span className="text-[10px] font-mono font-black uppercase text-slate-400 block sm:text-right">
                                🎛 Share Coverage Node Globally:
                              </span>
                              <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                {/* Twitter Share */}
                                <button
                                  onClick={() => {
                                    triggerAlert('Sharing request: Initiating Twitter broadcast dispatch...');
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-900 text-white hover:bg-black font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                >
                                  Twitter
                                </button>
                                
                                {/* Telegram Share */}
                                <a
                                  href="https://t.me/GetVerse/177599"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => {
                                    triggerAlert('Redirecting to Verse Telegram Update...');
                                  }}
                                  className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer inline-flex items-center"
                                >
                                  Telegram
                                </a>

                                {/* WhatsApp Share */}
                                <button
                                  onClick={() => {
                                    triggerAlert('Sharing request: Launching secure WhatsApp direct dispatch...');
                                  }}
                                  className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                >
                                  WhatsApp
                                </button>

                                {/* Copy Link Share */}
                                <button
                                  onClick={() => {
                                    handleCopy(`https://news.bitcoin.com/intelligence/read-${selectedNewsDetail.id}`, 'details_copied');
                                    triggerAlert('Article Web Link copied successfully!');
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                >
                                  Copy Web Link
                                </button>
                              </div>
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

            </motion.div>
          )}

          {/* TAB BODY - MORE OPERATIONS PAGE */}
          {activeTab === 'more' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

              {/* USER ACCOUNT BLOCK & VERIFICATION PROGRESS */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#8b5e3c]/10 text-[#8b5e3c] rounded-2xl flex items-center justify-center font-black text-xl shadow-inner uppercase overflow-hidden border border-slate-100">
                      {authType === 'google' ? (
                        <img 
                          src={authEmail === 'mdjuwelranajx127133@gmail.com' ? 'https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                          alt="Google Profile"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : authType === 'telegram' ? (
                        <div className="bg-sky-500 text-white w-full h-full flex items-center justify-center font-extrabold text-lg">
                          TG
                        </div>
                      ) : (
                        authEmail.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-800 flex flex-wrap items-center gap-2">
                        <span>{authEmail}</span>
                        {authType === 'telegram' && (
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[9px] rounded-full uppercase font-black tracking-wider font-mono">Telegram Handle</span>
                        )}
                        {authType === 'google' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] rounded-full uppercase font-black tracking-wider font-mono font-mono">Google Connected</span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold font-mono">
                        {authType === 'telegram' ? 'Instant Secure Telegram Identity' : authType === 'google' ? 'Google Social Managed Account' : 'Member ID: #US394-01D'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    >
                      Disconnect System Session
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">Ecosystem Profile Safety Verification Progress</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    {[
                      { key: 'email', label: 'Email Verified', done: setupSecurity.email },
                      { key: 'phone', label: 'Phone Authenticator', done: setupSecurity.phone },
                      { key: 'backup', label: 'Mnemonic Seed Backup', done: setupSecurity.backup },
                      { key: 'pin', label: 'Security PIN PIN', done: setupSecurity.pin },
                      { key: 'kyc', label: 'KYC Document Verified', done: setupSecurity.kyc }
                    ].map((step, i) => (
                      <button
                        key={step.key}
                        onClick={() => {
                          setSetupSecurity(prev => ({ ...prev, [step.key]: !prev[step.key] as any }));
                          triggerAlert(`Verification step updated: ${step.label}`);
                        }}
                        className={`p-4 rounded-2xl text-center border transition-all cursor-pointer ${
                          step.done ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-200/70 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className={`w-5 h-5 mx-auto mb-2 ${step.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span className="text-[11px] font-bold block">{step.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SERVICES STAKING, DAPP WEB3, REWARDS, ATM MAPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earn rewards tasks points items */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" /> Reward Point Center
                    </h3>
                    <span className="text-xs font-mono font-bold bg-yellow-400/10 text-yellow-600 px-2.5 py-1 rounded-full">{rewardPoints} pts Available</span>
                  </div>

                  <p className="text-xs text-slate-500">Perform activities inside the simulator to accumulate rewards redeemable against ecosystem VERSE gas discounts.</p>

                  <div className="space-y-2.5 pt-2">
                    {tasks.map((t) => (
                      <div key={t.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => {
                              setTasks(prev => prev.map(x => x.id === t.id ? { ...x, completed: !x.completed } : x));
                              if (!t.completed) {
                                setRewardPoints(prev => prev + t.points);
                                triggerAlert(`Claimed ${t.points} Reward Points!`);
                              }
                            }}
                            className="rounded text-[#8b5e3c] focus:ring-[#8b5e3c]"
                          />
                          <span className={`text-xs ${t.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-700'}`}>{t.text}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-500 px-2 rounded-md">+{t.points} PTS</span>
                      </div>
                    ))}
                  </div>

                  {/* Referral tracking box */}
                  <div className="border-t border-gray-50 pt-4 mt-2">
                    <p className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Referral System Link</p>
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-xs font-mono text-slate-500 truncate flex-1">{referralLink}</span>
                      <button
                        onClick={() => handleCopy(referralLink, 'referral')}
                        className="p-1.5 hover:bg-slate-200 border border-gray-100 rounded-lg text-[#8b5e3c] cursor-pointer"
                        title="Copy Referral Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Crypto Accept locations finder & ATMs maps */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" /> Crypto Accept & ATM Finder Nearby
                  </h3>

                  <p className="text-xs text-slate-500">Discover and transact with verified physical venues accepting bitcoin or providing Verse coin redemptions instantly.</p>

                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Bitcoin ATM Vault Hub', type: 'ATM Depot', dist: '0.4 miles away', addr: 'Sec 12, Block R, Silicon Sq' },
                      { name: 'Cafe Verse Espresso Bar', type: 'Lounge Restaurant', dist: '1.2 miles away', addr: 'Ground Fl, Elite Towers' }
                    ].map((loc, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex justify-between items-start">
                        <div>
                          <span className="text-xs font-black text-slate-800 block">{loc.name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">{loc.type}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">{loc.addr}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{loc.dist}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* EARN / PASSIVE INCOME YIELD STAKING PORTION */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Percent className="w-5 h-5 text-[#8b5e3c]" /> Earn & Passive Grow Staking
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Stake VERSE or BTC simulation tokens directly into pools yielding APY rewards automatically.</p>
                  </div>
                  {/* Total Staked value view */}
                  <div className="text-right">
                    <span className="text-xs uppercase text-slate-400 font-bold block">Current Pool Holdings</span>
                    <span className="font-mono text-sm font-black text-emerald-600">{stakedBalance.VERSE} VERSE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-gray-50 pt-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase text-slate-500">Choose Deposit Asset</label>
                    <select
                      value={stakingAsset}
                      onChange={(e) => setStakingAsset(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-[#8b5e3c] outline-none"
                    >
                      <option value="VERSE">VERSE Token (12% APY Yield)</option>
                      <option value="BTC">Bitcoin BTC Pool (4.5% APY Yield)</option>
                    </select>

                    <label className="block text-xs font-extrabold uppercase text-slate-500 pt-1">Amount to Stake</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:ring-1 focus:ring-[#8b5e3c] outline-none flex-1"
                      />
                      <button
                        onClick={() => {
                          const amt = parseFloat(stakeAmount);
                          if (!stakeAmount || isNaN(amt) || amt <= 0) return;
                          // Check balance
                          const assetInstance = assets.find(a => a.symbol === stakingAsset);
                          if (!assetInstance || assetInstance.quantity < amt) {
                            triggerAlert('Your simulated wallet does not hold enough token');
                            return;
                          }
                          // subtract from wallet balance
                          setAssets(prev => prev.map(x => x.symbol === stakingAsset ? { ...x, quantity: parseFloat((x.quantity - amt).toFixed(5)) } : x));
                          setStakedBalance(prev => ({ ...prev, [stakingAsset]: (prev[stakingAsset] || 0) + amt }));
                          setStakeAmount('');
                          triggerAlert(`Yield Staking Deposit Successful: Active rewards accumulating!`);
                        }}
                        className="bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-900 cursor-pointer"
                      >
                        Stake Asset
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-[#8b5e3c]/10 text-[#8b5e3c] rounded-xl">
                      <Activity className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase block">Yield Estimator Calculation</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Compounded rewards are calculated and credited inside your wallet balance interface every 60 seconds of simulator activity. No locks. Withdraw flexibly anytime!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTEGRATED DAPP WEB3 BROWSER EXPLORER SIMULATION SECTION */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#8b5e3c]" /> Web3 Explorer & Integrated DApps Portal
                </h3>

                <p className="text-xs text-slate-500">Access decentralized, multi-chain applications natively. Tap on any supported platform below to test out the simulation bridge connectivity.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  {[
                    { id: 'verse_dex', name: 'Verse DEX', category: 'DeFi Market', desc: 'Secure asset pools swap', link: 'https://verse.bitcoin.com' },
                    { id: 'nft_market', name: 'Verse NFT Marketplace', category: 'NFT Collectibles', desc: 'Mint and exchange arts', link: 'https://nft.verse.com' },
                    { id: 'compound', name: 'Compound Lending Stacks', category: 'Supply Protocol', desc: 'Lend and borrow easily', link: 'https://compound.finance' },
                    { id: 'explorer', name: 'Blockchain Explorer Search', category: 'Utility Block Check', desc: 'Live ledger verification', link: 'https://explorer.bitcoin.com' }
                  ].map((dapp) => (
                    <button
                      key={dapp.id}
                      onClick={() => setShowDappModal(dapp.name)}
                      className="p-4 bg-slate-50/50 border border-slate-100/90 rounded-2xl text-left hover:border-[#c0a080]/30 transition-all cursor-pointer hover:bg-slate-50"
                    >
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">{dapp.category}</span>
                      <span className="font-bold text-slate-800 text-sm block mt-1">{dapp.name}</span>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">{dapp.desc}</p>
                      <span className="text-[10px] text-[#8b5e3c] font-black inline-flex items-center gap-0.5 mt-2">
                        Verify Bridge <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* DAPP MODAL BRIDGE POPUP */}
          <AnimatePresence>
            {showDappModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full border border-gray-100 shadow-2xl relative"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black">
                      <Globe className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Bridge Verified: {showDappModal}</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Ecosystem bridge successfully verified and loaded over standard JSON-RPC 3.0 interface. Non-custodial secrets remain securely locked inside the physical browser state.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-600 mt-4 text-left">
                      RPC Method: eth_requestAccounts<br />
                      Response: Successfully linked with chain address: {subWallets[0].address}
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => setShowDappModal(null)}
                        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Disconnect Bridge
                      </button>
                      <button
                        onClick={() => {
                          setShowDappModal(null);
                          triggerAlert('Integration tested inside local Sandbox Environment!');
                        }}
                        className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Keep Connected
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* QUICK SEND MODAL */}
          <AnimatePresence>
            {sendModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-[2.5rem] p-6 max-w-md w-full border border-gray-100 shadow-2xl relative"
                >
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4">
                    <Send className="w-5 h-5 text-[#8b5e3c]" /> Send Simulation Assets
                  </h3>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Asset To Deliver</label>
                      <select
                        value={sendAsset}
                        onChange={(e) => setSendAsset(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Receipt Wallet Address</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sendAddress}
                          onChange={(e) => setSendAddress(e.target.value)}
                          placeholder="bc1q..."
                          className="font-mono text-xs bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 outline-none"
                        />
                        <button
                          onClick={() => setSendAddress('bc1qpks92jdrnvt3h8954ksd8977gwhsq08kjk21')}
                          className="bg-slate-100 hover:bg-slate-200 text-xs px-2.5 rounded-xl font-bold text-slate-600 block"
                        >
                          Paste Test
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Token Transfer sum</label>
                      <input
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                        className="font-mono text-xs bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 w-full outline-none"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-4">
                      <button
                        onClick={() => {
                          setSendModal(false);
                          setSendAmount('');
                          setSendAddress('');
                        }}
                        className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
                      >
                        Dismiss Fields
                      </button>
                      <button
                        onClick={() => {
                          const amt = parseFloat(sendAmount);
                          if (!sendAmount || isNaN(amt) || amt <= 0) return;
                          // Check balance
                          const matchAsset = assets.find(a => a.symbol === sendAsset);
                          if (!matchAsset || matchAsset.quantity < amt) {
                            triggerAlert('Your simulator balance is too low to complete this transfer');
                            return;
                          }
                          setAssets(prev => prev.map(a => a.symbol === sendAsset ? { ...a, quantity: parseFloat((a.quantity - amt).toFixed(5)) } : a));
                          setSendModal(false);
                          setSendAmount('');
                          triggerAlert(`Transaction Sent: ${amt} ${sendAsset} delivered safely!`);
                        }}
                        className="w-1/2 py-3 bg-slate-900 text-white font-heavy text-xs font-extrabold rounded-xl transition-all"
                      >
                        Dispatch Blockchain Send
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* RECEIVE MODAL */}
          <AnimatePresence>
            {receiveModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative text-center"
                >
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4">Receive Cryptocurrencies</h3>

                  <div className="bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 rounded-3xl p-6 mb-4 flex flex-col items-center justify-center">
                    {/* Simulated vector QR code with simple block grids */}
                    <div className="w-32 h-32 bg-slate-900 text-white rounded-2xl flex items-center justify-center p-3 font-bold text-xs select-none relative">
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                        {Array(25).fill(0).map((_, i) => (
                          <div key={i} className={`rounded-sm ${(i % 3 === 0 || i % 4 === 1 || i % 7 === 2) ? 'bg-white' : 'bg-transparent'}`} />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-slate-900 text-white text-[10px] font-mono px-1 py-0.5 rounded font-bold border border-slate-700">QR LINK</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 font-medium">Verify you select matching network protocols when sending transfers to avoid losses.</p>

                  <div className="bg-slate-50 p-2 text-xs font-mono rounded-xl mt-3 select-all truncate">
                    bc1qpks92jdrnvt3h8954ksd8977gwhsq08kjk21
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setReceiveModal(false)}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleCopy('bc1qpks92jdrnvt3h8954ksd8977gwhsq08kjk21', 'receive')}
                      className="w-1/2 py-2.5 bg-slate-900 hover:bg-[#8b5e3c] text-white font-heavy text-xs font-extrabold rounded-xl transition-colors"
                    >
                      Copy Address
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* BUY MODAL */}
          <AnimatePresence>
            {buyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative"
                >
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-600" /> Buy Cryptocurrencies
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Asset Choice</label>
                      <select
                        value={buyAsset}
                        onChange={(e) => setBuyAsset(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buy Amount (USD equivalent)</label>
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        placeholder="100.00"
                        className="font-mono text-xs bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 w-full outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Channel</label>
                      <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                        <button
                          onClick={() => setBuyMethod('card')}
                          className={`p-2 rounded-xl border text-center transition-all ${buyMethod === 'card' ? 'bg-[#8b5e3c]/15 border-[#8b5e3c] text-[#8b5e3c]' : 'bg-slate-50 border-gray-100 text-slate-500'}`}
                        >
                          Credit Card
                        </button>
                        <button
                          onClick={() => setBuyMethod('bank')}
                          className={`p-2 rounded-xl border text-center transition-all ${buyMethod === 'bank' ? 'bg-[#8b5e3c]/15 border-[#8b5e3c] text-[#8b5e3c]' : 'bg-slate-50 border-gray-100 text-slate-500'}`}
                        >
                          Bank Transfer
                        </button>
                        <button
                          onClick={() => setBuyMethod('apple')}
                          className={`p-2 rounded-xl border text-center transition-all ${buyMethod === 'apple' ? 'bg-[#8b5e3c]/15 border-[#8b5e3c] text-[#8b5e3c]' : 'bg-slate-50 border-gray-100 text-slate-500'}`}
                        >
                          Apple Pay
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => {
                          setBuyModal(false);
                        }}
                        className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const amtUSD = parseFloat(buyAmount);
                          if (!buyAmount || isNaN(amtUSD) || amtUSD <= 0) return;
                          setAssets(prev => prev.map(a => {
                            if (a.symbol === buyAsset) {
                              const got = amtUSD / simulatedPrices[buyAsset];
                              return { ...a, quantity: parseFloat((a.quantity + got).toFixed(5)) };
                            }
                            return a;
                          }));
                          setBuyModal(false);
                          triggerAlert(`Purchase Confirmed: ${amtUSD} USD worth of ${buyAsset} added to sandbox wallet!`);
                        }}
                        className="w-1/2 py-2.5 bg-slate-900 text-white font-heavy text-xs font-extrabold rounded-xl transition-colors"
                      >
                        Authorize & Buy
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* SELL MODAL */}
          <AnimatePresence>
            {sellModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative"
                >
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-red-500" /> Sell Choices (Convert to Stablecoins)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset To Liquify</label>
                      <select
                        value={sellAsset}
                        onChange={(e) => setSellAsset(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        {assets.map(a => <option key={a.id} value={a.symbol}>{a.symbol}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount to sell</label>
                      <input
                        type="number"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        placeholder="0.00"
                        className="font-mono text-xs bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 w-full outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => setSellModal(false)}
                        className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const amt = parseFloat(sellAmount);
                          if (!sellAmount || isNaN(amt) || amt <= 0) return;
                          // Check balance
                          const matchAsset = assets.find(a => a.symbol === sellAsset);
                          if (!matchAsset || matchAsset.quantity < amt) {
                            triggerAlert('Insufficient holdings inside sandbox wallet to finalize sale');
                            return;
                          }
                          // Add equivalent USDC
                          const valueUSD = amt * simulatedPrices[sellAsset];
                          setAssets(prev => prev.map(a => {
                            if (a.symbol === sellAsset) {
                              return { ...a, quantity: parseFloat((a.quantity - amt).toFixed(5)) };
                            }
                            if (a.symbol === 'USDC') {
                              return { ...a, quantity: parseFloat((a.quantity + valueUSD).toFixed(5)) };
                            }
                            return a;
                          }));
                          setSellModal(false);
                          setSellAmount('');
                          triggerAlert(`Authorized: Sold ${amt} ${sellAsset} for $${valueUSD.toFixed(2)} USDC!`);
                        }}
                        className="w-1/2 py-2.5 bg-slate-900 text-white font-heavy text-xs font-extrabold rounded-xl transition-colors"
                      >
                        Confirm Conversion
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* BOTTOM PERSISTENT NAVIGATION BAR */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100/90 shadow-xl px-4 py-2">
            <div className="max-w-4xl mx-auto flex items-center justify-around">
              {[
                { key: 'home', label: 'Ecosystem', icon: <Briefcase className="w-5 h-5" /> },
                { key: 'markets', label: 'Markets', icon: <Activity className="w-5 h-5" /> },
                { key: 'trade', label: 'Trade', icon: <RefreshCw className="w-5 h-5" /> },
                { key: 'news', label: 'Core News', icon: <BookOpen className="w-5 h-5" /> },
                { key: 'more', label: 'Services', icon: <Compass className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 transition-all text-xs font-bold font-sans cursor-pointer relative ${
                    activeTab === tab.key ? 'text-[#8b5e3c]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px] tracking-wide font-extrabold">{tab.label}</span>
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 w-8 h-[2.5px] bg-[#8b5e3c] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </nav>

        </div>
      )}
    </div>
  );
}
